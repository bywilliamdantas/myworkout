const STORAGE_KEY = "gym-data";
const THEME_KEY = "gym-theme";
const APP_VERSION = "v5.0";
const SCHEMA_VERSION = 3;
const AUTOBACKUP_KEY = "gym-autobackups";
const AUTOBACKUP_MAX = 5;
const SESSION_KEY = "gym-session";
const USERS_URL = "users.json";

let currentUser = null;
let authError = "";
let authBusy = false;
let activeTab = "inicio";
const TABS = ["inicio", "treinos", "historico", "progresso", "ajustes"];

function storageKey(){ return currentUser ? `${STORAGE_KEY}:${currentUser.username}` : STORAGE_KEY; }
function autobackupKey(){ return currentUser ? `${AUTOBACKUP_KEY}:${currentUser.username}` : AUTOBACKUP_KEY; }

function migrateUserDataIfNeeded(username){
  try{
    const newKey = `${STORAGE_KEY}:${username}`;
    const newAb = `${AUTOBACKUP_KEY}:${username}`;
    if(window.localStorage.getItem(newKey) == null){
      const old = window.localStorage.getItem(STORAGE_KEY);
      if(old != null) window.localStorage.setItem(newKey, old);
    }
    if(window.localStorage.getItem(newAb) == null){
      const oldAb = window.localStorage.getItem(AUTOBACKUP_KEY);
      if(oldAb != null) window.localStorage.setItem(newAb, oldAb);
    }
  }catch(e){}
}

async function sha256Hex(str){
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function fetchUsers(){
  try{
    const res = await fetch(USERS_URL, { cache: "no-cache" });
    if(!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data && data.users) ? data.users : null;
  }catch(e){ return null; }
}

async function tryLogin(username, password){
  username = (username || "").trim();
  password = (password || "").replace(/^\s+|\s+$/g, "");
  if(!username || !password) return { ok: false, msg: "Preencha usuário e senha." };
  const users = await fetchUsers();
  if(!users) return { ok: false, msg: "Não foi possível verificar o login (sem conexão e sem dados salvos ainda)." };
  const u = users.find(x => x.username.toLowerCase() === username.toLowerCase());
  if(!u) return { ok: false, msg: "Usuário ou senha inválidos." };
  let hash;
  try{ hash = await sha256Hex((u.salt || "") + password); }catch(e){ return { ok: false, msg: "Não foi possível verificar a senha neste navegador." }; }
  if(hash !== u.hash) return { ok: false, msg: "Usuário ou senha inválidos." };
  return { ok: true, user: { username: u.username, name: u.name || u.username } };
}

function readSession(){
  try{
    const raw = window.localStorage.getItem(SESSION_KEY) || window.sessionStorage.getItem(SESSION_KEY);
    if(!raw) return null;
    const s = JSON.parse(raw);
    if(s && s.username) return { username: s.username, name: s.name || s.username };
  }catch(e){}
  return null;
}
function writeSession(user, keep){
  const raw = JSON.stringify({ username: user.username, name: user.name });
  try{
    if(keep){ window.localStorage.setItem(SESSION_KEY, raw); window.sessionStorage.removeItem(SESSION_KEY); }
    else { window.sessionStorage.setItem(SESSION_KEY, raw); window.localStorage.removeItem(SESSION_KEY); }
  }catch(e){}
}
function clearSession(){
  try{ window.localStorage.removeItem(SESSION_KEY); window.sessionStorage.removeItem(SESSION_KEY); }catch(e){}
}

async function doLogin(username, password, keep){
  authBusy = true; authError = ""; renderLogin();
  const r = await tryLogin(username, password);
  authBusy = false;
  if(!r.ok){ authError = r.msg; renderLogin(); return; }
  migrateUserDataIfNeeded(r.user.username);
  currentUser = r.user;
  writeSession(r.user, keep);
  authError = "";
  activeTab = getTabFromHash() || "inicio";
  await bootApp();
}

function doLogout(){
  clearSession();
  currentUser = null;
  authError = "";
  overlay = null;
  try{ window.location.hash = ""; }catch(e){}
  renderLogin();
}

function getTabFromHash(){
  const h = (window.location.hash || "").replace(/^#\/?/, "");
  return TABS.includes(h) ? h : null;
}
function goTab(tab, opts){
  if(!TABS.includes(tab)) return;
  activeTab = tab;
  try{ window.location.hash = "/" + tab; }catch(e){}
  render();
  if(!opts || !opts.keepScroll){
    const scroller = document.getElementById("app");
    if(scroller) scroller.scrollTop = 0;
    window.scrollTo(0, 0);
  }
}
function initRouter(){
  window.addEventListener("hashchange", () => {
    if(!currentUser) return;
    const t = getTabFromHash();
    if(t && t !== activeTab){ activeTab = t; render(); window.scrollTo(0, 0); }
    else if(!t){ try{ window.location.hash = "/" + activeTab; }catch(e){} }
  });
}
const KG_PER_LB = 0.45359237;
const SET_TYPES = ["normal", "warm", "drop", "fail"];
const SET_TYPE_LABEL = { normal: "", warm: "A", drop: "D", fail: "F" };
const SET_TYPE_NAME = { normal: "normal", warm: "aquecimento", drop: "drop set", fail: "até a falha" };
const PALETTE = ["#ff5a1f", "#3d9dff", "#30b857", "#f5b400", "#9b59b6", "#0ea5b7"];

const EXERCISE_LIBRARY = {
  "Quadríceps": ["Agachamento livre","Agachamento frontal","Agachamento com barra alta","Agachamento com barra baixa","Agachamento sumô","Agachamento com halteres","Agachamento goblet","Agachamento búlgaro","Agachamento unilateral","Agachamento com calcanhar elevado","Agachamento Zercher","Agachamento Hack com barra","Step-up com halteres","Afundo com barra","Afundo com halteres","Afundo reverso","Afundo caminhando","Afundo búlgaro","Sissy squat","Pistol squat","Leg Press 45°","Leg Press horizontal","Leg Press vertical","Hack Squat","Agachamento Smith","Agachamento pendular","Agachamento V-Squat","Cadeira extensora","Belt Squat","Máquina de agachamento unilateral","Agachamento no cabo","Afundo no cabo","Agachamento unilateral no cabo","Step-up no cabo"],
  "Glúteos": ["Hip Thrust com barra","Hip Thrust com halteres","Glute Bridge com barra","Glute Bridge com halteres","Afundo búlgaro","Afundo reverso","Afundo caminhando","Step-up","Step-up alto","Agachamento sumô","Agachamento profundo","Levantamento terra sumô","Levantamento terra romeno","Good Morning","Swing com kettlebell","Hip Thrust máquina","Glute Drive","Máquina de extensão de quadril","Glúteo no cabo/máquina","Abdução de quadril","Máquina de coice","Coice no cabo","Extensão de quadril no cabo","Abdução no cabo","Adução no cabo","Pull-through"],
  "Posteriores de coxa": ["Stiff com barra","Stiff com halteres","Levantamento terra romeno","Levantamento terra","Levantamento terra sumô","Good Morning","Nordic Curl","Glute Ham Raise","Flexão nórdica assistida","Mesa flexora","Cadeira flexora","Flexora unilateral","Flexora vertical","Glute Ham Developer","Máquina de posterior","Flexão de joelho no cabo","Flexão de joelho unilateral no cabo","Pull-through"],
  "Adutores": ["Adução na máquina","Adução no cabo","Adução com faixa","Adução lateral no cabo","Agachamento sumô","Levantamento terra sumô","Copenhagen plank","Adução com bola"],
  "Abdutores": ["Abdução na máquina","Abdução no cabo","Abdução com faixa elástica","Abdução deitada","Caminhada lateral com faixa","Monster walk","Fire Hydrant"],
  "Panturrilhas": ["Elevação de panturrilha em pé com barra","Elevação de panturrilha em pé com halteres","Elevação unilateral","Panturrilha no Smith","Panturrilha no degrau","Panturrilha donkey","Panturrilha com kettlebell","Panturrilha em pé","Panturrilha sentada","Panturrilha no Leg Press","Panturrilha no Hack","Panturrilha horizontal","Panturrilha no cabo","Panturrilha unilateral no cabo"],
  "Peitoral": ["Supino reto com barra","Supino reto com halteres","Supino inclinado com barra","Supino inclinado com halteres","Supino declinado com barra","Supino declinado com halteres","Supino unilateral com halter","Floor Press","Floor Press com halteres","Squeeze Press","Pullover com halter","Chest Press","Chest Press inclinado","Chest Press declinado","Supino convergente","Supino horizontal","Supino unilateral máquina","Crossover alto","Crossover médio","Crossover baixo","Crossover unilateral","Crucifixo no cabo","Crucifixo unilateral","Press no cabo"],
  "Peitoral superior": ["Supino inclinado com barra","Supino inclinado com halteres","Supino inclinado Smith","Supino inclinado máquina","Supino inclinado unilateral","Crucifixo inclinado com halteres","Crucifixo inclinado no cabo","Crossover de baixo para cima","Squeeze Press inclinado"],
  "Peitoral inferior": ["Supino declinado","Supino declinado com halteres","Supino declinado máquina","Crossover de cima para baixo","Paralelas com inclinação do tronco","Crucifixo declinado"],
  "Costas / Dorsal": ["Barra fixa pronada","Barra fixa supinada","Barra fixa neutra","Barra fixa aberta","Barra fixa fechada","Barra fixa unilateral","Remada curvada com barra","Remada curvada supinada","Remada Pendlay","Remada cavalinho","Remada unilateral com halter","Remada serrote","Remada com kettlebell","Pullover com halter","Puxada frontal","Puxada articulada","Puxada convergente","Puxada unilateral","Remada baixa","Remada articulada","Remada unilateral","Remada cavalinho máquina","Remada Hammer","High Row","Low Row","Máquina de dorsal","Puxada aberta","Puxada fechada","Puxada supinada","Puxada neutra","Pulldown com braço reto","Pullover no cabo","Remada alta","Remada ajoelhada","Lat Pulldown unilateral"],
  "Trapézio": ["Encolhimento com barra","Encolhimento com halteres","Encolhimento no Smith","Encolhimento com kettlebell","Farmer's Walk","High Pull","Remada alta","Encolhimento no cabo","Encolhimento máquina","Remada alta no cabo","Face Pull","Y-Raise no cabo"],
  "Deltoide anterior": ["Desenvolvimento militar com barra","Desenvolvimento com halteres","Desenvolvimento Arnold","Desenvolvimento no Smith","Desenvolvimento na máquina","Desenvolvimento unilateral","Desenvolvimento sentado","Desenvolvimento em pé","Elevação frontal com barra","Elevação frontal com halteres","Elevação frontal no cabo","Elevação frontal unilateral","Landmine Press","Landmine Press unilateral"],
  "Deltoide lateral": ["Elevação lateral com halteres","Elevação lateral unilateral","Elevação lateral no cabo","Elevação lateral unilateral no cabo","Elevação lateral na máquina","Elevação lateral inclinada","Elevação lateral sentado","Elevação lateral no banco","Lean-Away Lateral Raise"],
  "Deltoide posterior": ["Crucifixo inverso com halteres","Crucifixo inverso na máquina","Crucifixo inverso no cabo","Crucifixo inverso unilateral","Face Pull","Reverse Pec Deck","Remada alta aberta","Remada para deltoide posterior","Y-Raise","Y-Raise no cabo","Rear Delt Row"],
  "Bíceps": ["Rosca direta com barra","Rosca direta com barra W","Rosca direta com halteres","Rosca alternada","Rosca martelo","Rosca martelo cruzada","Rosca concentrada","Rosca Scott","Rosca Scott com barra","Rosca Scott com halteres","Rosca inclinada","Rosca spider","Rosca 21","Rosca Zottman","Rosca drag","Rosca reversa","Rosca unilateral","Rosca bayesiana","Rosca Scott máquina","Rosca máquina","Rosca unilateral máquina","Máquina de bíceps","Rosca direta no cabo","Rosca unilateral no cabo","Rosca martelo no cabo","Rosca inversa no cabo","Rosca baixa","Rosca alta","Bayesian Curl","Rosca concentrada no cabo"],
  "Tríceps": ["Tríceps testa com barra","Tríceps testa com halteres","Tríceps francês","Tríceps francês unilateral","Tríceps acima da cabeça","Tríceps coice","Supino fechado","Paralelas","Tate Press","JM Press","Tríceps máquina","Tríceps mergulho máquina","Tríceps articulado","Tríceps pulley","Tríceps corda","Tríceps barra","Tríceps unilateral","Tríceps inverso","Tríceps cross-body","Tríceps coice no cabo"],
  "Antebraço": ["Rosca de punho","Rosca de punho reversa","Rosca inversa","Rosca martelo","Farmer's Walk","Pinch Grip","Wrist Roller","Flexão de dedos","Extensão de dedos","Pronação de punho","Supinação de punho","Pegada estática"],
  "Abdômen": ["Abdominal tradicional","Crunch","Crunch reverso","Abdominal bicicleta","Abdominal canivete","V-Up","Sit-up","Elevação de pernas","Elevação de joelhos","Mountain Climber","Dead Bug","Hollow Body Hold","Hollow Rock","Crunch no cabo","Crunch máquina","Elevação de pernas na máquina","Abdominal na máquina","Woodchopper no cabo","Pallof Press","Prancha","Prancha lateral","Prancha reversa","RKC Plank","Copenhagen Plank"],
  "Lombar / Eretores": ["Levantamento terra","Terra romeno","Stiff","Good Morning","Hiperextensão","Hiperextensão unilateral","Extensão lombar na máquina","Reverse Hyperextension","Superman","Bird Dog","Back Extension"],
  "Kettlebell": ["Kettlebell Swing","Russian Swing","American Swing","Goblet Squat","Front Squat","Clean","Clean & Press","Snatch","Turkish Get-Up","Windmill","Farmer Walk","Suitcase Carry","Front Rack Carry","Kettlebell Row","Kettlebell Deadlift","Kettlebell Lunges","Kettlebell Thruster","Kettlebell Press","Kettlebell High Pull"],
  "Peso corporal": ["Flexão tradicional","Flexão inclinada","Flexão declinada","Flexão diamante","Flexão arqueiro","Flexão unilateral","Flexão explosiva","Barra fixa","Chin-up","Australian Pull-up","Paralelas","Dips","Pistol Squat","Bulgarian Split Squat","Nordic Curl","Sissy Squat","Handstand Push-up","Pike Push-up","Muscle-up","Burpee","Agachamento","Afundo","Step-up"]
};
const REST_COLOR = "#8e8e97";
const WEEKDAY_FULL = ["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];
const MONTH_NAMES_FULL = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];

const ICONS = {
  close: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>`,
  check: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5L20 6"/></svg>`,
  checkSm: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5L20 6"/></svg>`,
  pencil: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
  up: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>`,
  down: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`,
  download: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16"/></svg>`,
  upload: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V9m0 0l-4 4m4-4l4 4M4 5h16"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5M4 19h16M8 15l3-4 3 3 4-6"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/></svg>`,
  moonSmall: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/></svg>`,
  sunSmall: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`,
  autoSmall: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor"/></svg>`,
  left: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`,
  right: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.6 21.6 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a21.6 21.6 0 0 1-3.22 4.44M1 1l22 22"/><path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5a3.5 3.5 0 0 0 2.47-1.03"/></svg>`,
  user: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.2-3.5 4-5 7-5s5.8 1.5 7 5"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="10" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>`,
  logoDumbbell: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5h11v11h-11z" fill="currentColor" stroke="none" opacity="0.18"/><path d="M6.5 6.5h11v11h-11z"/><path d="M3 9v6M21 9v6M1 10.5v3M23 10.5v3"/></svg>`,
  dumbbell: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5h11v11h-11z"/><path d="M3 9v6M21 9v6M1 10.5v3M23 10.5v3"/></svg>`,
  timer: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/></svg>`,
  cardio: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/></svg>`,
  refresh: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>`,
  play: `<svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor"><path d="M8 5v14l11-7Z"/></svg>`,
  pause: `<svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>`,
  link: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>`,
  trophy: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>`
};

function pad(n){ return String(n).padStart(2,"0"); }
function dateKeyFromDate(d){ return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
function todayKey(){ return dateKeyFromDate(new Date()); }
function escapeHtml(s){
  return String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function escapeAttr(s){ return escapeHtml(s); }
function prefersReducedMotion(){
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function haptic(pattern = 10){
  if(navigator.vibrate && !prefersReducedMotion()) {
    try { navigator.vibrate(pattern); } catch(e){}
  }
}
function parseNum(v){
  if(v === "" || v == null) return null;
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(",", "."));
  return isNaN(n) ? null : n;
}
function roundToStep(v, step){
  if(v == null) return null;
  return Math.round(v / step) * step;
}
function fmtWeight(v){
  if(v == null || v === "") return "";
  const n = Number(v);
  if(isNaN(n)) return String(v);
  return (Math.round(n * 1000) / 1000).toString().replace(".", ",");
}
function fmtDuration(ms){
  const totalMin = Math.round(ms / 60000);
  if(totalMin < 1) return "<1 min";
  if(totalMin < 60) return totalMin + " min";
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m === 0 ? h + "h" : h + "h " + m + "min";
}
function fmtClock(totalSec){
  const s = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if(h > 0) return h + ":" + pad(m) + ":" + pad(sec);
  return pad(m) + ":" + pad(sec);
}
function unit(){ return state.settings && state.settings.unit === "lb" ? "lb" : "kg"; }
function toDisp(kg){ if(kg == null) return null; return unit() === "lb" ? kg / KG_PER_LB : kg; }
function fromDisp(v){
  if(v == null) return null;
  const kg = unit() === "lb" ? v * KG_PER_LB : v;
  return Math.round(kg * 10000) / 10000;
}
function fmtW(kg){
  if(kg == null || kg === "" || isNaN(Number(kg))) return "";
  const d = toDisp(Number(kg));
  const r = unit() === "lb" ? Math.round(d * 10) / 10 : Math.round(d * 100) / 100;
  return String(r).replace(".", ",");
}
function weightStep(){ return unit() === "lb" ? 5 : 2.5; }
function isWork(s){ return !!s && s.type !== "warm"; }
function isPerformed(s){
  if(!s) return false;
  if(s.done === true) return true;
  if(s.done === false) return false;
  return s.weight != null || s.reps != null || s.minutes != null;
}
function e1rm(w, r){
  if(!(w > 0)) return 0;
  if(!(r > 1)) return w;
  return w * (1 + r / 30);
}
function safeUrl(u){
  if(!u) return "";
  let s = String(u).trim();
  if(!s) return "";
  if(!/^https?:\/\//i.test(s)) s = "https://" + s;
  try{
    const x = new URL(s);
    return (x.protocol === "http:" || x.protocol === "https:") ? x.href : "";
  }catch(e){ return ""; }
}

function isCardio(ex){ return ex && ex.type === "cardio"; }
function newSessionId(){ return "s" + Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

function getThemePref(){
  try {
    const t = localStorage.getItem(THEME_KEY);
    if(t === "light" || t === "dark" || t === "auto") return t;
  } catch(e){}
  return "auto";
}
function applyTheme(pref){
  try {
    if(pref === "auto"){
      delete document.documentElement.dataset.theme;
      localStorage.removeItem(THEME_KEY);
    } else {
      document.documentElement.dataset.theme = pref;
      localStorage.setItem(THEME_KEY, pref);
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if(meta){
      const dark = pref === "dark" || (pref === "auto" && !window.matchMedia("(prefers-color-scheme: light)").matches);
      meta.setAttribute("content", dark ? "#000000" : "#ffffff");
    }
  } catch(e){}
}

let state = {
  order: ["A","B","C"],
  workouts: {
    A: { name: "Treino A", exercises: [] },
    B: { name: "Treino B", exercises: [] },
    C: { name: "Treino C", exercises: [] }
  },
  sessions: {},
  body: [],
  schemaVersion: SCHEMA_VERSION,
  activeSession: {
    letter: null,
    state: "idle",
    elapsedMs: 0,
    startedAt: null,
    startedDate: null
  },
  settings: {
    reminder: { enabled: false, time: "18:00", lastNotifiedDate: null },
    lastBackupAt: null,
    workoutsCollapsed: false,
    collapsedSections: {},
    restDuration: 90,
    weekStartsMonday: false,
    restTimerActive: null,
    unit: "kg",
    keepAwake: true
  }
};
let loadFailed = false;
let saveInFlight = false;
let exIdCounter = 1;
let restCounter = 1;
let overlay = null;
let updateAvailable = null;
let swRegistration = null;
let historyMonth = new Date(); historyMonth.setDate(1); historyMonth.setHours(0,0,0,0);
let restTimerInterval = null;
let sheetClockInterval = null;
let heroClockInterval = null;

function newExId(){ return "ex" + (exIdCounter++); }
function newRestKey(){ return "REST" + (restCounter++); }

function initExIdCounter(){
  let max = 0;
  Object.values(state.workouts).forEach(w => {
    (w.exercises || []).forEach(ex => {
      const n = parseInt(String(ex.id).replace("ex",""), 10);
      if(!isNaN(n) && n > max) max = n;
    });
  });
  exIdCounter = max + 1;
}
function initRestCounter(){
  let max = 0;
  state.order.forEach(k => {
    const m = /^REST(\d+)$/.exec(k);
    if(m){ const n = parseInt(m[1],10); if(n > max) max = n; }
  });
  restCounter = max + 1;
}

function migrateSessionEntry(entry){
  if(!entry) return null;
  if(typeof entry === "string") return { letter: entry, log: {} };
  if(!entry.log) entry.log = {};
  Object.keys(entry.log).forEach(exId => {
    const v = entry.log[exId];
    if(v && !Array.isArray(v)) {
      const weight = v.weight;
      const reps = v.reps;
      const hasAny = (weight !== "" && weight != null) || (reps !== "" && reps != null);
      entry.log[exId] = hasAny ? [{ weight: parseNum(weight), reps: parseNum(reps), done: true }] : [];
    }
    if(!Array.isArray(entry.log[exId])) entry.log[exId] = [];
  });
  return entry;
}
function migrateSessions(s){
  if(!s.sessions) { s.sessions = {}; return; }
  Object.keys(s.sessions).forEach(k => {
    const v = s.sessions[k];
    if(Array.isArray(v)){
      v.forEach(sess => {
        if(sess && !sess.id) sess.id = newSessionId();
        if(sess && !sess.log) sess.log = {};
        Object.keys(sess.log || {}).forEach(exId => {
          if(!Array.isArray(sess.log[exId])) sess.log[exId] = [];
        });
      });
      return;
    }
    const migrated = migrateSessionEntry(v);
    const session = {
      id: newSessionId(),
      letter: migrated?.letter || null,
      log: migrated?.log || {},
      startedAt: migrated?.startedAt || null,
      endedAt: migrated?.endedAt || null
    };
    s.sessions[k] = [session];
  });
}
function migrateSettings(s){
  if(!s.settings) s.settings = {};
  const d = {
    reminder: { enabled:false, time:"18:00", lastNotifiedDate:null },
    lastBackupAt: null,
    workoutsCollapsed: false,
    restDuration: 90,
    weekStartsMonday: false,
    restTimerActive: null
  };
  if(!s.settings.reminder) s.settings.reminder = { ...d.reminder };
  if(s.settings.reminder.enabled === undefined) s.settings.reminder.enabled = false;
  if(!s.settings.reminder.time) s.settings.reminder.time = "18:00";
  if(s.settings.reminder.lastNotifiedDate === undefined) s.settings.reminder.lastNotifiedDate = null;
  if(s.settings.lastBackupAt === undefined) s.settings.lastBackupAt = null;
  if(s.settings.workoutsCollapsed === undefined) s.settings.workoutsCollapsed = false;
  if(!s.settings.collapsedSections || typeof s.settings.collapsedSections !== "object" || Array.isArray(s.settings.collapsedSections)){
    s.settings.collapsedSections = s.settings.workoutsCollapsed ? { workouts: true } : {};
  }
  if(s.settings.restDuration === undefined) s.settings.restDuration = 90;
  if(s.settings.weekStartsMonday === undefined) s.settings.weekStartsMonday = false;
  if(s.settings.restTimerActive === undefined) s.settings.restTimerActive = null;
  if(s.settings.unit !== "kg" && s.settings.unit !== "lb") s.settings.unit = "kg";
  if(s.settings.keepAwake === undefined) s.settings.keepAwake = true;
}
function migrateActiveSession(s){
  if(!s.activeSession || typeof s.activeSession !== "object"){
    s.activeSession = { letter: null, state: "idle", elapsedMs: 0, startedAt: null, startedDate: null };
  }
  const a = s.activeSession;
  if(!("letter" in a)) a.letter = null;
  if(!("state" in a)) a.state = "idle";
  if(!("elapsedMs" in a)) a.elapsedMs = 0;
  if(!("startedAt" in a)) a.startedAt = null;
  if(!("startedDate" in a)) a.startedDate = null;
}
function migrateWorkouts(w){
  if(!w) return;
  Object.values(w.workouts || {}).forEach(wk => {
    (wk.exercises || []).forEach(ex => {
      if(!ex.type) ex.type = "strength";
    });
  });
  if(!Array.isArray(w.body)) w.body = [];
  w.body = w.body.filter(b => b && typeof b === "object" && /^\d{4}-\d{2}-\d{2}$/.test(b.date || ""));
  w.body.forEach(b => { if(!b.id) b.id = "b" + Math.random().toString(36).slice(2, 9); });
  w.schemaVersion = SCHEMA_VERSION;
}

function storageAvailable(){
  try{
    const testKey = "__storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  }catch(e){ return false; }
}
async function withRetry(fn, attempts=3, baseDelay=250){
  let lastErr;
  for(let i=0;i<attempts;i++){
    try{ return fn(); }
    catch(e){
      lastErr = e;
      if(i < attempts-1) await new Promise(r => setTimeout(r, baseDelay * Math.pow(2,i)));
    }
  }
  throw lastErr;
}

async function loadData(){
  try{
    const raw = await withRetry(() => window.localStorage.getItem(storageKey()), 3, 200);
    if(raw){
      const parsed = JSON.parse(raw);
      if(parsed && parsed.order && parsed.workouts){
        state = { ...state, ...parsed };
        migrateSessions(state);
        migrateSettings(state);
        migrateActiveSession(state);
        migrateWorkouts(state);
      }
    }
    loadFailed = false;
  }catch(e){
    loadFailed = true;
  }
  initExIdCounter();
  initRestCounter();
}

async function persist(){
  saveInFlight = true;
  updateSyncUI("busy");
  try{
    await withRetry(() => window.localStorage.setItem(storageKey(), JSON.stringify(state)), 3, 250);
    saveInFlight = false;
    updateSyncUI("ok");
  }catch(e){
    saveInFlight = false;
    const full = e && (e.name === "QuotaExceededError" || e.code === 22 || e.code === 1014);
    updateSyncUI(full ? "full" : "err");
    if(full) showToast("Armazenamento cheio — exporte um backup");
  }
}

function updateSyncUI(s){
  const row = document.getElementById("syncRow");
  if(!row) return;
  const dot = document.getElementById("syncDot");
  const text = document.getElementById("syncText");
  const retryBtn = document.getElementById("syncRetryBtn");
  dot.className = "sync-dot";
  retryBtn.style.display = "none";
  if(s === "busy"){ row.classList.remove("hidden"); dot.classList.add("busy"); text.textContent = "salvando…"; }
  else if(s === "ok"){ dot.classList.add("ok"); text.textContent = "salvo neste aparelho"; setTimeout(() => { if(!saveInFlight) row.classList.add("hidden"); }, 1300); }
  else if(s === "err" || s === "full"){ row.classList.remove("hidden"); dot.classList.add("err"); text.textContent = s === "full" ? "armazenamento cheio" : "falha ao salvar"; retryBtn.style.display = "inline"; }
}

let toastTimer;
function showToast(msg, action){
  const t = document.getElementById("toast");
  t.textContent = msg;
  if(action){
    const b = document.createElement("button");
    b.type = "button";
    b.className = "toast-action";
    b.textContent = action.label;
    b.addEventListener("click", () => {
      clearTimeout(toastTimer);
      t.classList.remove("show");
      action.fn();
    });
    t.appendChild(b);
  }
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), action ? 6500 : 2400);
}

function colorFor(key, order){
  if(state.workouts[key]?.isRest) return REST_COLOR;
  const idx = order.indexOf(key);
  return PALETTE[idx >= 0 ? idx % PALETTE.length : 0];
}
function workoutLabel(key){
  const w = state.workouts[key];
  if(!w) return key;
  return w.isRest ? "descanso" : `Treino ${key}`;
}

function sessionsFor(dateKey){
  const v = state.sessions[dateKey];
  if(!v) return [];
  if(Array.isArray(v)) return v;
  return [v];
}
function firstSessionFor(dateKey){ return sessionsFor(dateKey)[0] || null; }

function sessionLetter(key){
  const first = firstSessionFor(key);
  return first ? (first.letter || null) : null;
}
function sessionLog(key){
  const first = firstSessionFor(key);
  return first ? (first.log || {}) : {};
}
function lastSessionEntry(){
  const keys = Object.keys(state.sessions).sort();
  if(keys.length === 0) return null;
  for(let i = keys.length - 1; i >= 0; i--){
    const arr = sessionsFor(keys[i]);
    if(arr.length){
      const last = arr[arr.length - 1];
      return { date: keys[i], letter: last.letter };
    }
  }
  return null;
}
function isRestLetter(letter){
  return !!(letter && state.workouts[letter] && state.workouts[letter].isRest);
}
function lastNonRestSessionEntry(){
  const keys = Object.keys(state.sessions).sort();
  for(let i = keys.length - 1; i >= 0; i--){
    const arr = sessionsFor(keys[i]);
    for(let j = arr.length - 1; j >= 0; j--){
      if(!isRestLetter(arr[j].letter)) return { date: keys[i], letter: arr[j].letter };
    }
  }
  return null;
}
function nextWorkoutLetter(){
  const order = state.order.filter(k => !isRestLetter(k));
  if(!order.length) return state.order[0];
  const last = lastNonRestSessionEntry();
  if(!last) return order[0];
  const idx = order.indexOf(last.letter);
  if(idx === -1) return order[0];
  return order[(idx + 1) % order.length];
}
function computeStreak(){
  let cursor = new Date();
  if(!state.sessions[todayKey()]){
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  while(state.sessions[dateKeyFromDate(cursor)]){
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
function totalSessions(){
  let n = 0;
  Object.keys(state.sessions).forEach(k => n += sessionsFor(k).length);
  return n;
}
function totalDays(){ return Object.keys(state.sessions).length; }
function sessionsThisMonth(){
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  let c = 0;
  for(const key of Object.keys(state.sessions)){
    const [ky, km] = key.split("-").map(Number);
    if(ky === y && km === m) c += sessionsFor(key).filter(s => !isRestLetter(s.letter)).length;
  }
  return c;
}
function sessionsThisWeek(){
  const now = new Date();
  const day = now.getDay();
  const offset = state.settings.weekStartsMonday ? (day === 0 ? 6 : day - 1) : day;
  const start = new Date(now);
  start.setDate(now.getDate() - offset);
  start.setHours(0,0,0,0);
  let c = 0;
  for(const key of Object.keys(state.sessions)){
    const [y,m,d] = key.split("-").map(Number);
    const dt = new Date(y, m-1, d);
    if(dt >= start) c += sessionsFor(key).filter(s => !isRestLetter(s.letter)).length;
  }
  return c;
}

function getLibraryNameSet(){
  const set = new Set();
  Object.values(EXERCISE_LIBRARY).forEach(arr => arr.forEach(n => set.add(n.toLowerCase())));
  return set;
}
function getCustomExerciseNames(){
  const libSet = getLibraryNameSet();
  const names = new Set();
  Object.values(state.workouts).forEach(w => {
    (w.exercises || []).forEach(ex => {
      const n = (ex.name || "").trim();
      if(n && !libSet.has(n.toLowerCase())) names.add(n);
    });
  });
  return Array.from(names).sort((a,b) => a.localeCompare(b, "pt-BR"));
}
function getAllExerciseNames(){
  const names = new Set();
  Object.values(EXERCISE_LIBRARY).forEach(arr => arr.forEach(n => names.add(n)));
  getCustomExerciseNames().forEach(n => names.add(n));
  return Array.from(names).sort((a,b) => a.localeCompare(b, "pt-BR"));
}

function findExercise(exId){
  for(const w of Object.values(state.workouts)){
    const ex = (w.exercises || []).find(e => e.id === exId);
    if(ex) return ex;
  }
  return null;
}

function lastLoggedValue(exId, beforeKey){
  const keys = Object.keys(state.sessions).filter(k => k < beforeKey).sort();
  for(let i = keys.length - 1; i >= 0; i--){
    const arr = sessionsFor(keys[i]);
    for(let j = arr.length - 1; j >= 0; j--){
      const rawSets = arr[j].log && arr[j].log[exId];
      const sets = Array.isArray(rawSets) ? rawSets.filter(x => x && x.type !== "warm" && x.type !== "drop") : null;
      if(sets && sets.length){
        const last = sets[sets.length - 1];
        if(last && (last.weight != null || last.reps != null || last.minutes != null)) return last;
      }
    }
  }
  return null;
}

function exerciseHistory(exId){
  const ex = findExercise(exId);
  const cardio = isCardio(ex);
  const out = [];
  Object.keys(state.sessions).sort().forEach(k => {
    const arr = sessionsFor(k);
    const allSets = [];
    arr.forEach(sess => {
      const sets = sess.log && sess.log[exId];
      if(Array.isArray(sets)) allSets.push(...sets.filter(isWork));
    });
    if(allSets.length === 0) return;
    if(cardio){
      const minutes = allSets.map(s => s.minutes).filter(v => v != null && !isNaN(v));
      if(minutes.length === 0) return;
      out.push({
        date: k,
        minutes: Math.max(...minutes),
        totalMinutes: minutes.reduce((a,b) => a+b, 0),
        weight: null, reps: null
      });
      return;
    }
    const weights = allSets.map(s => s.weight).filter(w => w != null);
    const reps = allSets.map(s => s.reps).filter(r => r != null);
    const maxWeight = weights.length ? Math.max(...weights) : null;
    const totalReps = reps.length ? reps.reduce((a,b) => a+b, 0) : null;
    if(maxWeight == null && totalReps == null) return;
    out.push({ date: k, weight: maxWeight, reps: totalReps });
  });
  return out;
}

function daysSince(iso){
  if(!iso) return Infinity;
  const then = new Date(iso).getTime();
  if(isNaN(then)) return Infinity;
  return (Date.now() - then) / (1000*60*60*24);
}
function sessionDurationMs(session){
  if(!session || !session.startedAt || !session.endedAt) return null;
  const ms = session.endedAt - session.startedAt;
  if(ms <= 0) return null;
  return ms;
}
function totalDurationForDay(dateKey){
  const arr = sessionsFor(dateKey);
  let total = 0;
  arr.forEach(s => {
    const ms = sessionDurationMs(s);
    if(ms) total += ms;
  });
  return total > 0 ? total : null;
}
function restForExercise(exId){
  const ex = findExercise(exId);
  if(ex){
    const n = parseInt(ex.rest, 10);
    if(!isNaN(n) && n > 0) return n;
  }
  return state.settings.restDuration || 90;
}

function activeElapsedMs(){
  const a = state.activeSession;
  if(!a) return 0;
  const base = a.elapsedMs || 0;
  if(a.state === "running" && a.startedAt){
    return base + Math.max(0, Date.now() - a.startedAt);
  }
  return base;
}
function startActiveSession(letter){
  const a = state.activeSession;
  if(!letter){ showToast("Sem treino para iniciar"); return; }
  if(a.state === "idle"){
    a.letter = letter;
    a.elapsedMs = 0;
    a.startedAt = Date.now();
    a.startedDate = todayKey();
    a.state = "running";
  } else if(a.state === "paused"){
    a.startedAt = Date.now();
    a.state = "running";
  } else if(a.state === "running"){
    return;
  }
  haptic([10,30,10]);
  render();
  persist();
}
function pauseActiveSession(){
  const a = state.activeSession;
  if(a.state !== "running") return;
  a.elapsedMs = activeElapsedMs();
  a.startedAt = null;
  a.state = "paused";
  haptic(12);
  render();
  persist();
}
function endActiveSession(){
  const a = state.activeSession;
  if(a.state === "idle") return;
  const letter = a.letter;
  const totalMs = activeElapsedMs();
  const dateKey = a.startedDate || todayKey();
  const arr = sessionsFor(dateKey).slice();
  let target = arr.find(s => s.letter === letter && !s.endedAt);
  const now = Date.now();
  if(target){
    target.endedAt = now;
    if(!target.startedAt) target.startedAt = now - totalMs;
  } else {
    arr.push({
      id: newSessionId(),
      letter,
      log: {},
      startedAt: now - totalMs,
      endedAt: now
    });
  }
  state.sessions[dateKey] = arr;
  a.state = "idle";
  a.letter = null;
  a.elapsedMs = 0;
  a.startedAt = null;
  a.startedDate = null;
  haptic([20,40,20]);
  render();
  persist();
  showToast(`${workoutLabel(letter)[0].toUpperCase()}${workoutLabel(letter).slice(1)} finalizado · ${fmtDuration(totalMs)}`);
}
function cancelActiveSession(){
  const a = state.activeSession;
  if(!a || a.state === "idle") return;
  a.state = "idle";
  a.letter = null;
  a.elapsedMs = 0;
  a.startedAt = null;
  a.startedDate = null;
  haptic([15, 30, 15]);
  render();
  persist();
  showToast("Treino cancelado");
}

function renderHeroClock(){
  const el = document.getElementById("heroClock");
  const timeEl = document.getElementById("heroClockTime");
  if(!el || !timeEl) return;
  const a = state.activeSession;
  if(a.state === "idle"){
    el.classList.add("hidden");
    return;
  }
  el.classList.remove("hidden");
  el.classList.toggle("paused", a.state === "paused");
  const ms = activeElapsedMs();
  timeEl.textContent = fmtClock(Math.floor(ms / 1000));
}

let wakeLock = null;
async function syncWakeLock(){
  if(!("wakeLock" in navigator)) return;
  const a = state.activeSession;
  const training = a.state === "running" || (overlay && overlay.type === "day" && overlay.dateKey === todayKey());
  const want = !!state.settings.keepAwake && training && document.visibilityState === "visible";
  try{
    if(want && !wakeLock){
      wakeLock = await navigator.wakeLock.request("screen");
      wakeLock.addEventListener("release", () => { wakeLock = null; });
    } else if(!want && wakeLock){
      await wakeLock.release();
      wakeLock = null;
    }
  }catch(e){ wakeLock = null; }
}

let storagePersisted = null;
function storageStatusText(){
  if(storagePersisted === null) return "verificando…";
  return storagePersisted ? "ativa" : "não garantida";
}
async function requestPersistentStorage(){
  try{
    if(navigator.storage && navigator.storage.persisted){
      let p = await navigator.storage.persisted();
      if(!p && navigator.storage.persist) p = await navigator.storage.persist();
      storagePersisted = !!p;
    } else {
      storagePersisted = false;
    }
  }catch(e){ storagePersisted = false; }
  const el = document.getElementById("storageStatus");
  if(el){
    el.textContent = storageStatusText();
    el.classList.toggle("ok", storagePersisted === true);
  }
}

function readAutoBackups(){
  try{
    const list = JSON.parse(window.localStorage.getItem(autobackupKey()) || "[]");
    return Array.isArray(list) ? list : [];
  }catch(e){ return []; }
}
function writeAutoBackups(list){
  const copy = list.slice(0, AUTOBACKUP_MAX);
  while(copy.length){
    try{
      window.localStorage.setItem(autobackupKey(), JSON.stringify(copy));
      return true;
    }catch(e){
      copy.pop();
    }
  }
  return false;
}
function hasMeaningfulData(){
  if(totalDays() > 0 || (state.body && state.body.length)) return true;
  return Object.values(state.workouts).some(w => (w.exercises || []).length > 0);
}
function takeAutoBackup(force){
  try{
    if(!hasMeaningfulData()) return;
    const list = readAutoBackups();
    const today = todayKey();
    if(!force && list[0] && list[0].date === today) return;
    const data = JSON.parse(JSON.stringify(state));
    data.activeSession = { letter: null, state: "idle", elapsedMs: 0, startedAt: null, startedDate: null };
    data.settings.restTimerActive = null;
    list.unshift({ date: today, at: new Date().toISOString(), sessions: totalSessions(), data });
    writeAutoBackups(list);
  }catch(e){}
}

function validateBackup(p){
  if(!p || typeof p !== "object" || Array.isArray(p)) return { ok:false, error:"Arquivo inválido" };
  if(typeof p.schemaVersion === "number" && p.schemaVersion > SCHEMA_VERSION){
    return { ok:false, error:"Backup de uma versão mais nova do app" };
  }
  if(!Array.isArray(p.order) || !p.workouts || typeof p.workouts !== "object" || Array.isArray(p.workouts)){
    return { ok:false, error:"Formato de backup inválido" };
  }
  const consistent = p.order.every(k => typeof k === "string" && p.workouts[k] && typeof p.workouts[k] === "object");
  if(!consistent) return { ok:false, error:"Backup com treinos inconsistentes" };
  Object.values(p.workouts).forEach(w => {
    if(!Array.isArray(w.exercises)) w.exercises = [];
    if(typeof w.name !== "string") w.name = "Treino";
    w.exercises = w.exercises.filter(e => e && typeof e === "object" && e.id);
  });
  if(p.sessions && typeof p.sessions === "object" && !Array.isArray(p.sessions)){
    Object.keys(p.sessions).forEach(k => { if(!/^\d{4}-\d{2}-\d{2}$/.test(k)) delete p.sessions[k]; });
  } else {
    p.sessions = {};
  }
  return { ok:true };
}

async function deliverFile(content, filename, mime, shareTitle){
  try{
    const file = new File([content], filename, { type: mime });
    if(navigator.canShare && navigator.canShare({ files: [file] })){
      await navigator.share({ files: [file], title: shareTitle });
      return "shared";
    }
  }catch(e){
    if(e && e.name === "AbortError") return "cancelled";
  }
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return "downloaded";
}

function forEachWorkSet(exId, cb){
  Object.keys(state.sessions).sort().forEach(k => {
    sessionsFor(k).forEach(sess => {
      const sets = sess.log && sess.log[exId];
      if(!Array.isArray(sets)) return;
      sets.forEach(s => {
        if(!isWork(s) || !isPerformed(s) || !(s.weight > 0)) return;
        cb(s, k, sess);
      });
    });
  });
}
function bestBefore(exId, dateKey, sessionId){
  let has = false, maxWeight = 0, best1rm = 0;
  forEachWorkSet(exId, (s, k, sess) => {
    if(k > dateKey) return;
    if(k === dateKey && sess.id === sessionId) return;
    has = true;
    if(s.weight > maxWeight) maxWeight = s.weight;
    const e = e1rm(s.weight, s.reps);
    if(e > best1rm) best1rm = e;
  });
  return has ? { maxWeight, best1rm } : null;
}
function exercisePRs(exId){
  let out = null;
  forEachWorkSet(exId, (s, k) => {
    const e = e1rm(s.weight, s.reps);
    if(!out) out = { maxWeight: s.weight, maxWeightDate: k, maxWeightReps: s.reps, best1rm: e, best1rmDate: k, lastDate: k };
    if(s.weight >= out.maxWeight){ out.maxWeight = s.weight; out.maxWeightDate = k; out.maxWeightReps = s.reps; }
    if(e >= out.best1rm){ out.best1rm = e; out.best1rmDate = k; }
    out.lastDate = k;
  });
  return out;
}
function checkPR(exId, set, sets, idx){
  if(!(set.weight > 0)) return null;
  const prior = bestBefore(exId, overlay.dateKey, overlay.sessionId);
  if(!prior) return null;
  let bestW = prior.maxWeight, best1 = prior.best1rm;
  sets.forEach((s, i) => {
    if(i === idx || !s.done || !isWork(s) || !(s.weight > 0)) return;
    bestW = Math.max(bestW, s.weight);
    best1 = Math.max(best1, e1rm(s.weight, s.reps));
  });
  if(set.weight > bestW + 1e-9) return `Novo recorde de carga: ${fmtW(set.weight)} ${unit()}`;
  const e = e1rm(set.weight, set.reps);
  if(e > best1 + 0.05) return `Novo recorde de 1RM estimado: ${fmtW(e)} ${unit()}`;
  return null;
}

function lastWorkSets(exId, beforeKey){
  const keys = Object.keys(state.sessions).filter(k => k < beforeKey).sort();
  for(let i = keys.length - 1; i >= 0; i--){
    const arr = sessionsFor(keys[i]);
    for(let j = arr.length - 1; j >= 0; j--){
      const raw = arr[j].log && arr[j].log[exId];
      if(!Array.isArray(raw)) continue;
      const sets = raw.filter(s => isWork(s) && isPerformed(s) && s.weight > 0);
      if(sets.length) return sets;
    }
  }
  return null;
}
function suggestNext(ex, beforeKey){
  if(!ex || isCardio(ex)) return null;
  const target = parseInt(ex.reps, 10);
  if(!target) return null;
  const sets = lastWorkSets(ex.id, beforeKey);
  if(!sets) return null;
  const top = Math.max(...sets.map(s => s.weight));
  const atTop = sets.filter(s => s.weight === top);
  const minReps = Math.min(...atTop.map(s => s.reps != null ? s.reps : 0));
  if(minReps >= target){
    const next = fromDisp(roundToStep(toDisp(top) + weightStep(), 0.1));
    return { weight: next, reps: target, text: `Sugestão: ${fmtW(next)} ${unit()} × ${target} (bateu ${target} reps)` };
  }
  const reps = Math.min(target, minReps + 1);
  return { weight: top, reps, text: `Sugestão: ${fmtW(top)} ${unit()} × ${reps} (busque +1 rep)` };
}

let statsRange = 30;
let _libGroupMap = null;
function muscleGroupOf(name){
  if(!name) return "Outros";
  if(!_libGroupMap){
    _libGroupMap = {};
    Object.keys(EXERCISE_LIBRARY).forEach(g => EXERCISE_LIBRARY[g].forEach(n => { _libGroupMap[n.toLowerCase()] = g; }));
  }
  return _libGroupMap[String(name).trim().toLowerCase()] || "Outros";
}
function weekStartOf(d){
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = x.getDay();
  const offset = state.settings.weekStartsMonday ? (day === 0 ? 6 : day - 1) : day;
  x.setDate(x.getDate() - offset);
  return x;
}
function forEachLoggedSet(cb){
  Object.keys(state.sessions).forEach(k => {
    sessionsFor(k).forEach(sess => {
      if(state.workouts[sess.letter] && state.workouts[sess.letter].isRest) return;
      Object.keys(sess.log || {}).forEach(exId => {
        const arr = sess.log[exId];
        if(!Array.isArray(arr)) return;
        const ex = findExercise(exId);
        arr.forEach(s => cb(s, k, ex, sess));
      });
    });
  });
}
function collectStats(days){
  const end = new Date(); end.setHours(0,0,0,0);
  const start = new Date(end); start.setDate(start.getDate() - (days - 1));
  const startKey = dateKeyFromDate(start), endKey = dateKeyFromDate(end);
  const groups = {};
  let volume = 0, sets = 0, cardioMin = 0;
  const sessionIds = new Set();
  forEachLoggedSet((s, k, ex, sess) => {
    if(k < startKey || k > endKey) return;
    if(!isPerformed(s)) return;
    if(isCardio(ex)){ if(s.minutes != null) cardioMin += s.minutes; sessionIds.add(sess.id); return; }
    if(!isWork(s)) return;
    sessionIds.add(sess.id);
    sets++;
    const g = muscleGroupOf(ex && ex.name);
    groups[g] = (groups[g] || 0) + 1;
    if(s.weight > 0 && s.reps > 0) volume += s.weight * s.reps;
  });
  return { volume, sets, cardioMin, sessions: sessionIds.size, groups };
}
function weeklyVolume(n){
  const first = weekStartOf(new Date());
  first.setDate(first.getDate() - 7 * (n - 1));
  const buckets = Array.from({ length: n }, (_, i) => {
    const d = new Date(first); d.setDate(d.getDate() + 7 * i);
    return { start: d, volume: 0 };
  });
  forEachLoggedSet((s, k, ex) => {
    if(isCardio(ex) || !isWork(s) || !isPerformed(s) || !(s.weight > 0 && s.reps > 0)) return;
    const [y, m, d] = k.split("-").map(Number);
    const idx = Math.round((weekStartOf(new Date(y, m - 1, d)) - first) / 86400000 / 7);
    if(idx >= 0 && idx < n) buckets[idx].volume += s.weight * s.reps;
  });
  return buckets;
}
function fmtVolume(kg){
  const v = Math.round(toDisp(kg));
  return v.toLocaleString("pt-BR") + " " + unit();
}
function isCollapsed(id){
  const c = state.settings.collapsedSections;
  return !!(c && c[id]);
}
function sectionHeader(id, title, first, noToggle){
  if(noToggle){
    return `<p class="section-title${first ? "" : " spaced-title"}">${title}</p>`;
  }
  const c = isCollapsed(id);
  return `<div class="section-title-row${first ? "" : " spaced"}">
    <p class="section-title" style="margin:0;">${title}</p>
    <button type="button" class="toggle-visibility-btn" data-role="togglesection" data-section="${id}" aria-expanded="${c ? "false" : "true"}" aria-label="${c ? "mostrar" : "ocultar"} ${escapeAttr(title.toLowerCase())}">
      ${c ? ICONS.eyeOff + " Mostrar" : ICONS.eye + " Ocultar"}
    </button>
  </div>`;
}
function blockHeader(title, first){
  return `<p class="section-title${first ? "" : " spaced-title"}">${title}</p>`;
}

function renderStatsCard(){
  if(isCollapsed("stats")) return sectionHeader("stats", "Estatísticas");
  const st = collectStats(statsRange);
  const hasAny = st.sets > 0 || st.cardioMin > 0;
  let body;
  if(!hasAny){
    body = `<div class="sheet-empty" style="margin:0;">Registre séries nos treinos para ver suas estatísticas.</div>`;
  } else {
    const entries = Object.keys(st.groups).map(g => [g, st.groups[g]]).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const maxSets = entries.length ? entries[0][1] : 1;
    const wk = weeklyVolume(8);
    const maxVol = Math.max(1, ...wk.map(b => b.volume));
    body = `<div class="stat-grid">
        <div><div class="sg-num">${escapeHtml(fmtVolume(st.volume))}</div><div class="sg-label">volume total</div></div>
        <div><div class="sg-num">${st.sets}</div><div class="sg-label">séries</div></div>
        <div><div class="sg-num">${st.sessions}</div><div class="sg-label">treinos</div></div>
      </div>
      ${st.cardioMin ? `<div class="sg-extra">${ICONS.cardio} ${st.cardioMin} min de cardio</div>` : ""}
      ${entries.length ? `<p class="bars-title">Séries por grupo muscular</p>
      <div class="hbars">${entries.map(([g, n]) => `<div class="hbar-row">
        <span class="hbar-name">${escapeHtml(g)}</span>
        <span class="hbar-track"><span class="hbar-fill" style="width:${Math.max(4, Math.round(n / maxSets * 100))}%"></span></span>
        <span class="hbar-val">${n}</span>
      </div>`).join("")}</div>` : ""}
      <p class="bars-title">Volume por semana</p>
      <div class="vbars">${wk.map((b, i) => `<div class="vbar-col" title="${escapeAttr(fmtVolume(b.volume))}">
        <span class="vbar-track"><span class="vbar-fill ${i === wk.length - 1 ? "current" : ""}" style="height:${b.volume ? Math.max(4, Math.round(b.volume / maxVol * 100)) : 0}%"></span></span>
        <span class="vbar-label">${pad(b.start.getDate())}/${pad(b.start.getMonth() + 1)}</span>
      </div>`).join("")}</div>`;
  }
  return sectionHeader("stats", "Estatísticas") + `<div class="card">
    <div class="theme-selector" style="margin-bottom:14px;">
      ${[7, 30, 90].map(d => `<button class="theme-opt ${statsRange === d ? "active" : ""}" data-role="statsrange" data-days="${d}">${d} dias</button>`).join("")}
    </div>
    ${body}
  </div>`;
}
function collectRecords(){
  const out = [];
  state.order.forEach(key => {
    const w = state.workouts[key];
    if(!w || w.isRest) return;
    let best = null;
    (w.exercises || []).forEach(ex => {
      if(isCardio(ex) || !ex.name) return;
      const pr = exercisePRs(ex.id);
      if(!pr) return;
      if(!best || pr.maxWeightDate > best.pr.maxWeightDate ||
        (pr.maxWeightDate === best.pr.maxWeightDate && pr.maxWeight > best.pr.maxWeight)){
        best = { ex, pr, key };
      }
    });
    if(best) out.push(best);
  });
  return out;
}
function renderRecordsCard(){
  const recs = collectRecords();
  if(!recs.length) return "";
  if(isCollapsed("records")) return sectionHeader("records", "Recordes");
  return sectionHeader("records", "Recordes") + `<div class="card records-card">
    ${recs.map(({ ex, pr, key }) => {
      const [, m, d] = pr.maxWeightDate.split("-").map(Number);
      return `<button type="button" class="record-row" data-role="openrecord" data-exid="${ex.id}" data-name="${escapeAttr(ex.name)}">
        <span class="record-ico">${ICONS.trophy}</span>
        <span class="record-name">${escapeHtml(ex.name)}</span>
        <span class="record-w" style="background:${colorFor(key, state.order)}">${escapeHtml(key)}</span>
        <span class="record-val">${fmtW(pr.maxWeight)} ${unit()}${pr.maxWeightReps ? " × " + pr.maxWeightReps : ""}</span>
        <span class="record-date">${d}/${m}</span>
      </button>`;
    }).join("")}
  </div>`;
}

const BODY_MEASURES = [
  { key: "waist", label: "Cintura" },
  { key: "chest", label: "Peito" },
  { key: "arm", label: "Braço" },
  { key: "thigh", label: "Coxa" }
];
function bodySorted(){ return (state.body || []).slice().sort((a, b) => a.date < b.date ? -1 : (a.date > b.date ? 1 : 0)); }
function newBodyId(){ return "b" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }
function renderBodyCard(){
  if(isCollapsed("body")) return sectionHeader("body", "Corpo");
  const list = bodySorted();
  let inner;
  if(!list.length){
    inner = `<div class="sheet-empty" style="margin:0 0 12px;">Registre seu peso e medidas para acompanhar a evolução.</div>`;
  } else {
    const withW = list.filter(e => e.weight != null);
    let head = "";
    if(withW.length){
      const last = withW[withW.length - 1];
      const prev = withW.length > 1 ? withW[withW.length - 2] : null;
      let delta = "";
      if(prev){
        const dv = Math.round((toDisp(last.weight) - toDisp(prev.weight)) * 10) / 10;
        delta = `<span class="body-delta ${dv > 0 ? "up" : (dv < 0 ? "down" : "")}">${dv > 0 ? "+" : ""}${String(dv).replace(".", ",")} ${unit()}</span>`;
      }
      head = `<div class="body-head"><div class="body-big">${fmtW(last.weight)} <span>${unit()}</span></div>${delta}</div>`;
    }
    const chartPts = withW.slice(-20).map(e => ({ date: e.date, weight: Math.round(toDisp(e.weight) * 10) / 10 }));
    const chart = chartPts.length >= 2 ? `<div class="chart-wrap">${buildLineChart(chartPts, unit())}</div>` : "";
    const measures = BODY_MEASURES.map(m => {
      const vals = list.filter(e => e[m.key] != null);
      if(!vals.length) return "";
      const last = vals[vals.length - 1];
      const prev = vals.length > 1 ? vals[vals.length - 2] : null;
      const dv = prev ? Math.round((last[m.key] - prev[m.key]) * 10) / 10 : null;
      return `<div class="body-measure"><span>${m.label}</span><b>${String(last[m.key]).replace(".", ",")} cm</b>${dv ? `<i class="${dv > 0 ? "up" : "down"}">${dv > 0 ? "+" : ""}${String(dv).replace(".", ",")}</i>` : ""}</div>`;
    }).join("");
    const recent = list.slice(-5).reverse().map(e => {
      const [, m, d] = e.date.split("-").map(Number);
      const bits = [];
      if(e.weight != null) bits.push(fmtW(e.weight) + " " + unit());
      BODY_MEASURES.forEach(ms => { if(e[ms.key] != null) bits.push(ms.label.toLowerCase() + " " + String(e[ms.key]).replace(".", ",")); });
      return `<div class="progress-row"><span>${d}/${m}</span><span style="flex:1;">${escapeHtml(bits.join(" · "))}</span><button class="sds-del" data-role="delbody" data-id="${e.id}" aria-label="remover registro">${ICONS.close}</button></div>`;
    }).join("");
    inner = `${head}${chart}${measures ? `<div class="body-measures">${measures}</div>` : ""}<div class="progress-list" style="margin-top:10px;">${recent}</div>`;
  }
  return sectionHeader("body", "Corpo") + `<div class="card">
    ${inner}
    <button class="add-workout-btn" id="openBodyBtn" style="margin-top:12px;">${ICONS.plus} Registrar peso / medidas</button>
  </div>`;
}
function openBodySheet(){
  overlay = { type: "body" };
  renderOverlay();
}
function renderBodyOverlay(root){
  const list = bodySorted();
  const lastOf = (key) => { const v = list.filter(e => e[key] != null); return v.length ? v[v.length - 1][key] : null; };
  const lastW = lastOf("weight");
  root.innerHTML = `<div class="sheet-backdrop" id="sheetBackdrop"></div>
  <div class="sheet" role="dialog" aria-modal="true" aria-label="Registrar peso e medidas">
    <div class="sheet-handle"></div>
    <div class="sheet-header">
      <div class="sheet-date">Peso e medidas</div>
      <button class="icon-btn" id="sheetClose" aria-label="fechar">${ICONS.close}</button>
    </div>
    <div class="body-form">
      <label class="body-field wide"><span>Data</span><input type="date" id="bodyDate" value="${todayKey()}" max="${todayKey()}"></label>
      <label class="body-field wide"><span>Peso (${unit()})</span><input type="text" inputmode="decimal" id="bodyWeight" placeholder="${lastW != null ? fmtW(lastW) : "0"}" autocomplete="off"></label>
      ${BODY_MEASURES.map(m => `<label class="body-field"><span>${m.label} (cm)</span><input type="text" inputmode="decimal" data-measure="${m.key}" placeholder="${lastOf(m.key) != null ? String(lastOf(m.key)).replace(".", ",") : "0"}" autocomplete="off"></label>`).join("")}
    </div>
    <div class="sheet-actions"><button class="cta-btn" id="bodySave">Salvar</button></div>
  </div>`;
  document.getElementById("sheetBackdrop").addEventListener("click", closeOverlay);
  document.getElementById("sheetClose").addEventListener("click", closeOverlay);
  document.getElementById("bodySave").addEventListener("click", async () => {
    const date = document.getElementById("bodyDate").value;
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date) || date > todayKey()){ showToast("Data inválida"); return; }
    const wv = parseNum(document.getElementById("bodyWeight").value);
    const entry = { weight: wv != null && wv > 0 ? fromDisp(wv) : null };
    root.querySelectorAll("[data-measure]").forEach(inp => {
      const v = parseNum(inp.value);
      entry[inp.dataset.measure] = v != null && v > 0 ? v : null;
    });
    const hasAny = entry.weight != null || BODY_MEASURES.some(m => entry[m.key] != null);
    if(!hasAny){ showToast("Preencha pelo menos um valor"); return; }
    let existing = state.body.find(e => e.date === date);
    if(existing){
      Object.keys(entry).forEach(k => { if(entry[k] != null) existing[k] = entry[k]; });
    } else {
      state.body.push({ id: newBodyId(), date, ...entry });
    }
    haptic([10, 30, 10]);
    closeOverlay();
    render();
    await persist();
    showToast("Registro salvo");
  });
}

function openBackupsSheet(){
  overlay = { type: "backups" };
  renderOverlay();
}
function renderBackupsOverlay(root){
  const list = readAutoBackups();
  root.innerHTML = `<div class="sheet-backdrop" id="sheetBackdrop"></div>
  <div class="sheet" role="dialog" aria-modal="true" aria-label="Backups automáticos">
    <div class="sheet-handle"></div>
    <div class="sheet-header">
      <div class="sheet-date">Backups automáticos</div>
      <button class="icon-btn" id="sheetClose" aria-label="fechar">${ICONS.close}</button>
    </div>
    <p style="font-size:12.5px;color:var(--text-muted);margin:0 0 14px;line-height:1.5;">
      O app guarda uma cópia por dia (as ${AUTOBACKUP_MAX} mais recentes) dentro do próprio aparelho.
      Isso protege contra erros seus, mas não substitui exportar um arquivo para o iCloud.
    </p>
    ${list.length ? `<div class="backup-list">${list.map((b, i) => {
      const [y, m, d] = String(b.date).split("-").map(Number);
      const nTreinos = ((b.data && b.data.order) || []).length;
      return `<div class="backup-row">
        <div class="backup-info"><div class="backup-date">${pad(d)}/${pad(m)}/${y}</div><div class="backup-meta">${b.sessions || 0} sessões · ${nTreinos} treino(s)</div></div>
        <button class="footer-btn" style="flex:none;padding:9px 14px;" data-role="restorebackup" data-idx="${i}">Restaurar</button>
      </div>`;
    }).join("")}</div>` : `<div class="sheet-empty">Ainda não há backups automáticos. O primeiro é criado quando você abre o app com dados salvos.</div>`}
  </div>`;
  document.getElementById("sheetBackdrop").addEventListener("click", closeOverlay);
  document.getElementById("sheetClose").addEventListener("click", closeOverlay);
  root.querySelectorAll('[data-role="restorebackup"]').forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.idx, 10);
      const snap = list[idx];
      if(!snap || !snap.data) return;
      const [y, m, d] = String(snap.date).split("-").map(Number);
      openConfirm(`Restaurar o backup de ${pad(d)}/${pad(m)}/${y}? Seus dados atuais serão guardados antes.`, async () => {
        const data = JSON.parse(JSON.stringify(snap.data));
        const v = validateBackup(data);
        if(!v.ok){ showToast("Backup corrompido"); return; }
        await replaceImportData(data, "Backup restaurado");
      }, { yesLabel: "Restaurar", yesStyle: "accent" });
    });
  });
}

function render(){
  if(!currentUser){ renderLogin(); return; }
  const app = document.getElementById("app");
  const next = nextWorkoutLetter();
  const a = state.activeSession;
  const isRunning = a.state === "running";
  const isPaused = a.state === "paused";
  const hasActive = isRunning || isPaused;
  const todayArr = sessionsFor(todayKey());
  const todayCount = todayArr.length;
  const streak = computeStreak();
  const total = sessionsThisMonth();
  const thisWeek = sessionsThisWeek();
  const now = new Date();
  const weekdayLabel = WEEKDAY_FULL[now.getDay()];
  const heroKey = hasActive ? a.letter : (todayCount ? todayArr[todayArr.length-1].letter : next);
  const heroW = state.workouts[heroKey] || { name: heroKey, exercises: [] };

  let banners = "";
  if(loadFailed){
    banners += `<div class="banner"><span>Não foi possível carregar seus dados salvos.</span><button id="retryLoadBtn">tentar de novo</button></div>`;
  }
  if(updateAvailable){
    banners += `<div class="banner info"><span>Nova versão do app disponível.</span><button id="updateBtn">atualizar</button></div>`;
  }
  const backupDays = daysSince(state.settings.lastBackupAt);
  const backupDue = totalDays() > 0 && backupDays >= 14;
  if(backupDue){
    const daysTxt = backupDays === Infinity ? "Você ainda não exportou um backup" : `Já fazem ${Math.floor(backupDays)} dias sem backup`;
    banners += `<div class="banner info"><span>${daysTxt}.</span><button id="backupNowBtn">exportar</button></div>`;
  }
  const bannersHtml = banners ? `<div class="banners">${banners}</div>` : "";

  const todayDuration = totalDurationForDay(todayKey());

  const todayIsRest = todayCount > 0 && isRestLetter(todayArr[todayArr.length - 1].letter);
  let eyebrowText = "Próximo";
  if(isRunning) eyebrowText = "Treinando agora";
  else if(isPaused) eyebrowText = "Pausado";
  else if(todayIsRest) eyebrowText = "Descanso";
  else if(todayCount === 1) eyebrowText = "Treino de hoje";
  else if(todayCount > 1) eyebrowText = todayCount + " treinos hoje";

  let statusIcon = ICONS.play;
  let statusCls = "state-idle";
  if(isRunning){ statusIcon = ICONS.play; statusCls = "state-running"; }
  else if(isPaused){ statusIcon = ICONS.pause; statusCls = "state-paused"; }

  const heroSub = todayCount > 0
    ? (todayDuration ? `concluído em ${fmtDuration(todayDuration)}` : "concluído hoje")
    : state.workouts[heroKey]?.isRest
      ? "dia de recuperação"
      : hasActive
        ? "toque no ícone para registrar"
        : "pronto para começar";

  const heroHtml = `<div class="card" id="heroCard">
    <p class="eyebrow">${eyebrowText} · ${weekdayLabel}</p>
    <div class="hero-head">
      <button class="status-btn ${statusCls}" id="statusBtn" aria-label="Abrir séries do treino">
        ${statusIcon}
      </button>
      <div class="hero-info">
        <div class="workout-name">${escapeHtml(heroW.name || workoutLabel(heroKey))}</div>
        <div class="workout-sub">${heroSub}</div>
      </div>
      <div class="hero-clock hidden" id="heroClock">
        ${ICONS.timer}
        <span class="clock-time" id="heroClockTime">00:00</span>
      </div>
    </div>
    <div class="control-row">
      <button class="ctrl-btn start ${isRunning ? "disabled" : ""}" id="startBtn" ${isRunning ? "disabled" : ""}>Start</button>
      <button class="ctrl-btn stop" id="stopBtn" ${isRunning ? "" : "disabled"}>Stop</button>
      <button class="ctrl-btn end" id="endBtn" ${hasActive ? "" : "disabled"}>End</button>
    </div>
    ${!hasActive && todayCount > 0
      ? `<div class="hero-action-row">
           <button class="hero-action edit" id="editTodayBtn">Editar</button>
           <button class="hero-action undo" id="undoTodayBtn">Desfazer</button>
           <button class="hero-action second" id="addSecondBtn">${ICONS.plus} Novo Treino</button>
         </div>`
      : ""}
  </div>`;

  const statsRowHtml = `<div class="card stats-card">
    <div class="stat streak"><div class="stat-num" data-count="${streak}">0</div><div class="stat-label">dias seguidos</div></div>
    <div class="stat"><div class="stat-num" data-count="${thisWeek}">0</div><div class="stat-label">essa semana</div></div>
    <div class="stat"><div class="stat-num" data-count="${total}">0</div><div class="stat-label">no mês</div></div>
  </div>`;

  const hour = now.getHours();
  const greetWord = hour < 5 ? "Boa madrugada" : hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const dateLabel = `${weekdayLabel}, ${now.getDate()} de ${MONTH_NAMES_FULL[now.getMonth()]}`;
  const firstName = (currentUser.name || "Treinador").split(" ")[0];
  const greetHtml = `<div class="greet-row">
    <div>
      <div class="greet-hello">${greetWord}, <span style="color:var(--accent)">${escapeHtml(firstName)}</span></div>
      <div class="greet-date">${dateLabel}</div>
    </div>
  </div>`;

  const weekDayShort = ["D","S","T","Q","Q","S","S"];
  const wOffset = state.settings.weekStartsMonday ? (now.getDay() === 0 ? 6 : now.getDay() - 1) : now.getDay();
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - wOffset); weekStart.setHours(0,0,0,0);
  let weekDotsHtml = `<div class="card week-dots-card">
    <p class="section-title" style="margin:0 0 10px;">Essa semana</p>
    <div class="week-dots">`;
  for(let i=0;i<7;i++){
    const d = new Date(weekStart); d.setDate(weekStart.getDate()+i);
    const dk = dateKeyFromDate(d);
    const dArr = sessionsFor(dk);
    const done = dArr.some(s => !isRestLetter(s.letter));
    const restOnly = !done && dArr.length > 0 && dArr.every(s => isRestLetter(s.letter));
    const isToday = dk === todayKey();
    const idx = state.settings.weekStartsMonday ? (i+1)%7 : i;
    weekDotsHtml += `<div class="week-dot-col">
      <span class="week-dot-label">${weekDayShort[idx]}</span>
      <span class="week-dot ${done ? "done" : ""} ${restOnly ? "rest" : ""} ${isToday ? "today" : ""}">${done ? ICONS.checkSm : (restOnly ? ICONS.moonSmall : "")}</span>
    </div>`;
  }
  weekDotsHtml += `</div></div>`;

  const allRecords = collectRecords().slice().sort((x, y) => y.pr.maxWeightDate < x.pr.maxWeightDate ? -1 : (y.pr.maxWeightDate > x.pr.maxWeightDate ? 1 : 0));
  const lastRecord = allRecords[0] || null;
  const lastRecordHtml = lastRecord ? `<button type="button" class="card last-record-card" id="goLastRecord">
    <span class="record-ico">${ICONS.trophy}</span>
    <span style="flex:1;min-width:0;text-align:left;">
      <span class="lr-title">Último recorde batido</span>
      <span class="lr-name">${escapeHtml(lastRecord.ex.name)} · ${fmtW(lastRecord.pr.maxWeight)} ${unit()}${lastRecord.pr.maxWeightReps ? " × " + lastRecord.pr.maxWeightReps : ""}</span>
    </span>
    <span class="lr-arrow">${ICONS.right}</span>
  </button>` : "";

  const quickActionsHtml = `<div class="quick-actions">
    <button type="button" class="quick-action-btn" id="qaWeight">${ICONS.chart}<span>Registrar peso</span></button>
    <button type="button" class="quick-action-btn" id="qaHistory">${ICONS.timer}<span>Ver histórico</span></button>
  </div>`;

  const homeHtml = `${greetHtml}${bannersHtml}${heroHtml}${statsRowHtml}${weekDotsHtml}${lastRecordHtml}${quickActionsHtml}`;

  let workoutsHtml = "";
  state.order.forEach((key, idx) => {
    const w = state.workouts[key];
    const color = colorFor(key, state.order);
    workoutsHtml += `<div class="card workout-card" data-letter="${key}">
      <div class="workout-head">
        <div class="reorder-btns">
          <button class="reorder-btn" data-role="moveup" data-letter="${key}" ${idx===0?"disabled":""} aria-label="mover para cima">${ICONS.up}</button>
          <button class="reorder-btn" data-role="movedown" data-letter="${key}" ${idx===state.order.length-1?"disabled":""} aria-label="mover para baixo">${ICONS.down}</button>
        </div>
        <div class="workout-chip" style="background:${color}">${w.isRest ? ICONS.moonSmall : key}</div>
        <input class="workout-title-input" data-role="wname" data-letter="${key}" value="${escapeAttr(w.name)}" placeholder="${w.isRest ? "Nome do descanso" : "Nome do treino"}" aria-label="Nome de ${w.isRest ? "descanso" : "treino " + key}">
        <span class="edit-pencil">${ICONS.pencil}</span>
        ${w.isRest ? "" : `<button class="icon-btn" data-role="dupworkout" data-letter="${key}" aria-label="duplicar treino ${key}">${ICONS.copy}</button>`}
        ${state.order.length > 1 ? `<button class="icon-btn" data-role="delworkout" data-letter="${key}" aria-label="remover ${w.isRest ? "descanso" : "treino " + key}">${ICONS.close}</button>` : ""}
      </div>
      ${w.isRest ? `<div class="rest-note">Dia de descanso — sem exercícios para registrar.</div>` : `
      ${w.exercises.length > 0 ? w.exercises.map((ex, exIdx) => {
        const cardio = isCardio(ex);
        const hasHist = exerciseHistory(ex.id).length > 0;
        return `
        <div class="exercise-row${(isLinkedNext(w, exIdx) || (exIdx > 0 && isLinkedNext(w, exIdx - 1))) ? " linked" : ""}" data-exid="${ex.id}">
          <div class="ex-row-top">
            <button type="button" class="ex-name-input ex-name-btn" data-role="openexname" data-letter="${key}" data-exid="${ex.id}" aria-label="Escolher nome do exercício">
              <span class="ex-name-text ${ex.name ? "" : "placeholder"}">${ex.name ? escapeHtml(ex.name) : (cardio ? "Escolher exercício (Esteira, Bike...)" : "Escolher exercício")}</span>
              ${ICONS.pencil}
            </button>
            <button class="progress-btn" data-role="viewprogress" data-exid="${ex.id}" data-name="${escapeAttr(ex.name || "Exercício")}" ${hasHist ? "" : "disabled"} aria-label="Ver progresso">${ICONS.chart}</button>
            <button class="ex-del" data-role="delex" data-letter="${key}" data-exid="${ex.id}" aria-label="remover exercício">${ICONS.close}</button>
          </div>
          <div class="ex-type-toggle">
            <button class="ex-type-btn ${cardio ? "" : "active"}" data-role="extype" data-letter="${key}" data-exid="${ex.id}" data-type="strength">${ICONS.dumbbell} Força</button>
            <button class="ex-type-btn ${cardio ? "active" : ""}" data-role="extype" data-letter="${key}" data-exid="${ex.id}" data-type="cardio">${ICONS.cardio} Cardio</button>
          </div>
          <div class="ex-tools">
            <button class="tool-btn icon" data-role="exmove" data-dir="-1" data-letter="${key}" data-exid="${ex.id}" ${exIdx === 0 ? "disabled" : ""} aria-label="mover exercício para cima">${ICONS.up}</button>
            <button class="tool-btn icon" data-role="exmove" data-dir="1" data-letter="${key}" data-exid="${ex.id}" ${exIdx === w.exercises.length - 1 ? "disabled" : ""} aria-label="mover exercício para baixo">${ICONS.down}</button>
            ${exIdx < w.exercises.length - 1 ? `<button class="tool-btn ${ex.ss ? "active" : ""}" data-role="exss" data-letter="${key}" data-exid="${ex.id}" aria-pressed="${!!ex.ss}">Superset com o próximo</button>` : ""}
            <button class="tool-btn ${ex.link ? "active" : ""}" data-role="exlink" data-letter="${key}" data-exid="${ex.id}" aria-label="link de vídeo ou técnica">${ICONS.link} Link</button>
          </div>
          ${cardio ? `
            <div class="ex-row-bottom">
              <label class="ex-field"><span>minutos</span><input data-role="exmins" data-letter="${key}" data-exid="${ex.id}" value="${escapeAttr(ex.mins || "")}" placeholder="30" inputmode="numeric" aria-label="Minutos"></label>
            </div>
          ` : `
            <div class="ex-row-bottom">
              <label class="ex-field"><span>séries</span><input data-role="exsets" data-letter="${key}" data-exid="${ex.id}" value="${escapeAttr(ex.sets)}" placeholder="4" inputmode="numeric" aria-label="Séries"></label>
              <label class="ex-field"><span>reps</span><input data-role="exreps" data-letter="${key}" data-exid="${ex.id}" value="${escapeAttr(ex.reps)}" placeholder="12" inputmode="numeric" aria-label="Repetições"></label>
              <label class="ex-field"><span>descanso (s)</span><input data-role="exrest" data-letter="${key}" data-exid="${ex.id}" value="${escapeAttr(ex.rest || "")}" placeholder="90" inputmode="numeric" aria-label="Descanso em segundos"></label>
            </div>
          `}
        </div>`;
      }).join("") : `<div class="empty-state">
          <div class="empty-icon">${ICONS.dumbbell}</div>
          <p class="empty-title">Nenhum exercício ainda</p>
          <p class="empty-sub">Toque em "Adicionar exercício" para começar a montar este treino.</p>
        </div>`}
      <button class="add-exercise-btn" data-role="addex" data-letter="${key}">${ICONS.plus} Adicionar exercício</button>
      `}
    </div>`;
  });
  workoutsHtml += `<div class="row-2">
    <button class="add-workout-btn" id="addWorkoutBtn">${ICONS.plus} Novo treino</button>
    <button class="add-workout-btn" id="addRestBtn">${ICONS.moonSmall} Descanso</button>
  </div>`;

  const legendWorkouts = state.order.filter(k => !state.workouts[k]?.isRest);
  const hasRest = state.order.some(k => state.workouts[k]?.isRest);
  let historyHtml = `<div class="card">
    <div class="legend">
      ${legendWorkouts.map(l => `<div class="legend-item"><span class="legend-dot" style="background:${colorFor(l, state.order)}"></span>${l}</div>`).join("")}
      ${hasRest ? `<div class="legend-item"><span class="legend-dot" style="background:${REST_COLOR}"></span>descanso</div>` : ""}
      <div class="legend-item"><span class="legend-dot" style="background:var(--dot-off)"></span>não treinou</div>
    </div>
    ${buildMonthCalendar(historyMonth)}
  </div>`;

  const monthKeys = Object.keys(state.sessions).filter(k => {
    const [ky, km] = k.split("-").map(Number);
    return ky === historyMonth.getFullYear() && km === historyMonth.getMonth() + 1;
  }).sort().reverse();
  historyHtml += `<p class="section-title spaced-title">Sessões do mês</p>`;
  if(!monthKeys.length){
    historyHtml += `<div class="empty-state">
      <div class="empty-icon">${ICONS.timer}</div>
      <p class="empty-title">Nenhuma sessão nesse mês</p>
      <p class="empty-sub">Os treinos que você concluir vão aparecer aqui.</p>
    </div>`;
  } else {
    historyHtml += `<div class="card month-sessions-card">${monthKeys.map(dk => {
      const arr = sessionsFor(dk);
      const [, m, d] = dk.split("-").map(Number);
      return `<button type="button" class="month-session-row" data-role="openhistoryday" data-datekey="${dk}">
        <span class="ms-date">${d}/${m}</span>
        <span class="ms-letters">${arr.map(s => {
          const isRest = isRestLetter(s.letter);
          const bg = s.letter && state.workouts[s.letter] && !isRest ? colorFor(s.letter, state.order) : REST_COLOR;
          return `<span class="ms-chip" style="background:${bg}">${isRest ? ICONS.moonSmall : (s.letter || "?")}</span>`;
        }).join("")}</span>
        <span class="ms-arrow">${ICONS.right}</span>
      </button>`;
    }).join("")}</div>`;
  }

  const progressHtml = renderStatsCard() + renderRecordsCard() + renderBodyCard();

  const r = state.settings.reminder;
  const themePref = getThemePref();
  const bkDays = daysSince(state.settings.lastBackupAt);
  const bkTxt = bkDays === Infinity ? "nunca" : (bkDays < 1 ? "hoje" : `há ${Math.floor(bkDays)} dia(s)`);

  const ajustesHtml = `
    ${blockHeader("Conta", true)}
    <div class="card">
      <div class="reminder-row">
        <div style="display:flex;flex-direction:column;gap:2px;">
          <span>${escapeHtml(currentUser.name || currentUser.username)}</span>
          <span style="font-size:11px;color:var(--text-muted);">@${escapeHtml(currentUser.username)}</span>
        </div>
        <button class="footer-btn danger" id="logoutBtn" style="flex:none;padding:9px 14px;">Sair</button>
      </div>
    </div>

    ${blockHeader("Treino")}
    <div class="card">
      <label class="reminder-row">
        <span>Lembrete diário de treino</span>
        <span class="switch">
          <input type="checkbox" id="reminderToggle" ${r.enabled ? "checked" : ""} aria-label="Ativar lembrete diário">
          <span class="slider"></span>
        </span>
      </label>
      <div class="reminder-time-row" id="reminderTimeRow" style="${r.enabled ? "" : "display:none;"}">
        <span>Horário</span>
        <input type="time" id="reminderTime" value="${r.time}" aria-label="Horário do lembrete">
      </div>
      <div class="reminder-row" style="margin-top:14px;">
        <span>Duração do descanso padrão</span>
        <div class="step-group" style="max-width:140px;">
          <button class="step-btn" id="restMinus" aria-label="diminuir">−</button>
          <div class="step-value" id="restDurationVal">${state.settings.restDuration}s</div>
          <button class="step-btn" id="restPlus" aria-label="aumentar">+</button>
        </div>
      </div>
      <div class="reminder-row" style="margin-top:14px;">
        <span>Semana começa na segunda</span>
        <span class="switch">
          <input type="checkbox" id="weekStartToggle" ${state.settings.weekStartsMonday ? "checked" : ""} aria-label="Semana começa na segunda">
          <span class="slider"></span>
        </span>
      </div>
      <div class="reminder-row" style="margin-top:14px;">
        <span>Manter a tela ligada no treino</span>
        <span class="switch">
          <input type="checkbox" id="keepAwakeToggle" ${state.settings.keepAwake ? "checked" : ""} aria-label="Manter a tela ligada durante o treino">
          <span class="slider"></span>
        </span>
      </div>
    </div>

    ${blockHeader("Aparência")}
    <div class="card">
      <div class="reminder-row" style="margin-bottom:14px;">
        <span>Tema</span>
      </div>
      <div class="theme-selector">
        <button class="theme-opt ${themePref === "light" ? "active" : ""}" data-role="settheme" data-theme="light">${ICONS.sunSmall} Claro</button>
        <button class="theme-opt ${themePref === "dark" ? "active" : ""}" data-role="settheme" data-theme="dark">${ICONS.moonSmall} Escuro</button>
        <button class="theme-opt ${themePref === "auto" ? "active" : ""}" data-role="settheme" data-theme="auto">${ICONS.autoSmall} Auto</button>
      </div>
      <div class="reminder-row" style="margin-top:14px;">
        <span>Unidade de peso</span>
        <div class="theme-selector" style="max-width:150px;">
          <button class="theme-opt ${state.settings.unit === "kg" ? "active" : ""}" data-role="setunit" data-unit="kg">kg</button>
          <button class="theme-opt ${state.settings.unit === "lb" ? "active" : ""}" data-role="setunit" data-unit="lb">lb</button>
        </div>
      </div>
    </div>

    ${blockHeader("Dados e backup")}
    <div class="card">
      <div class="reminder-row">
        <span>Proteção contra limpeza do aparelho</span>
        <span class="status-pill ${storagePersisted === true ? "ok" : ""}" id="storageStatus">${storageStatusText()}</span>
      </div>
      <div class="reminder-row" style="margin-top:14px;">
        <span>Último backup exportado</span>
        <span class="status-pill">${bkTxt}</span>
      </div>
      <div class="reminder-row" style="margin-top:14px;">
        <div style="display:flex;flex-direction:column;gap:2px;">
          <span>Backups automáticos</span>
          <span style="font-size:11px;color:var(--text-muted);">${readAutoBackups().length} cópia(s) neste aparelho</span>
        </div>
        <button class="footer-btn" id="openBackupsBtn" style="flex:none;padding:9px 14px;">Ver</button>
      </div>
      <div class="reminder-row" style="margin-top:14px;">
        <div style="display:flex;flex-direction:column;gap:2px;">
          <span>Versão do app</span>
          <span id="appVersionText" style="font-size:11px;color:var(--text-muted);">${APP_VERSION}</span>
        </div>
        <button class="footer-btn" id="checkUpdateBtn" style="flex:none;padding:9px 14px;">
          <span id="checkUpdateIcon">${ICONS.refresh}</span>
          <span id="checkUpdateLabel">Atualizar</span>
        </button>
      </div>
      <div class="reminder-row" style="margin-top:14px;">
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0;">
          <span>App não atualiza?</span>
          <span style="font-size:11px;color:var(--text-muted);">Limpa o cache do app e recarrega. Seus treinos e histórico não são apagados.</span>
        </div>
        <button class="footer-btn" id="hardRefreshBtn" style="flex:none;padding:9px 14px;">Recarregar</button>
      </div>
    </div>
    <div class="footer-actions" style="margin-top:14px;">
      <button class="footer-btn" id="exportBtn">${ICONS.download} Exportar</button>
      <button class="footer-btn" id="exportCsvBtn">${ICONS.download} CSV</button>
      <button class="footer-btn" id="importBtn">${ICONS.upload} Importar</button>
    </div>
    <input type="file" id="importFile" accept="application/json">
    <div class="app-footer">William Dantas - ©2026</div>`;

  const TAB_TITLES = { treinos: "Treinos", historico: "Histórico", progresso: "Progresso", ajustes: "Ajustes" };
  let content;
  if(activeTab === "treinos") content = `<h1 class="tab-title">${TAB_TITLES.treinos}</h1>${workoutsHtml}`;
  else if(activeTab === "historico") content = `<h1 class="tab-title">${TAB_TITLES.historico}</h1>${historyHtml}`;
  else if(activeTab === "progresso") content = `<h1 class="tab-title">${TAB_TITLES.progresso}</h1>${progressHtml}`;
  else if(activeTab === "ajustes") content = `<h1 class="tab-title">${TAB_TITLES.ajustes}</h1>${ajustesHtml}`;
  else { activeTab = "inicio"; content = homeHtml; }

  app.innerHTML = `<div class="tab-panel" id="tabPanel">${content}</div>`;
  attachHandlers();
  runCountUp();
  renderOverlay();
  renderRestTimer();
  renderHeroClock();
  startHeroClockTicker();
  syncWakeLock();
  renderTabBar();
}

function startHeroClockTicker(){
  if(heroClockInterval){ clearInterval(heroClockInterval); }
  heroClockInterval = setInterval(() => {
    const a = state.activeSession;
    if(a.state === "running"){
      renderHeroClock();
    }
  }, 1000);
}

function runCountUp(){
  if(prefersReducedMotion()) {
    document.querySelectorAll("[data-count]").forEach(el => el.textContent = el.dataset.count);
    return;
  }
  document.querySelectorAll("[data-count]").forEach(el => {
    const target = parseInt(el.dataset.count, 10) || 0;
    if(target <= 0){ el.textContent = "0"; return; }
    const start = performance.now();
    const duration = 500;
    function tick(t){
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if(p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  });
}

function buildMonthCalendar(monthDate){
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = first.getDay();
  const todayD = new Date(); todayD.setHours(0,0,0,0);
  const isCurrentMonth = (year === todayD.getFullYear() && month === todayD.getMonth());

  let cells = "";
  for(let i = 0; i < startWeekday; i++){
    cells += `<div class="cal-cell empty"></div>`;
  }
  for(let day = 1; day <= daysInMonth; day++){
    const d = new Date(year, month, day);
    const key = dateKeyFromDate(d);
    const arr = sessionsFor(key);
    const count = arr.length;
    const letter = count ? arr[arr.length - 1].letter : null;
    const isToday = key === todayKey();
    const isFuture = d > todayD;
    const style = letter ? `background:${colorFor(letter, state.order)};color:#fff` : "";
    const cls = "cal-cell" + (letter ? " filled" : "") + (isToday ? " today" : "") + (isFuture ? " future" : "");
    const label = `${day} de ${MONTH_NAMES_FULL[month]}${count ? " — " + count + " treino(s)" : (isFuture ? "" : " — sem treino")}`;
    const badge = count > 1 ? `<span class="cal-badge">${count}x</span>` : "";
    if(isFuture){
      cells += `<div class="${cls}" aria-label="${escapeAttr(label)}"><span>${day}</span></div>`;
    } else {
      cells += `<button class="${cls}" style="${style}" data-role="calday" data-key="${key}" aria-label="${escapeAttr(label)}"><span>${day}</span>${badge}</button>`;
    }
  }
  const totalCells = startWeekday + daysInMonth;
  const trailing = (7 - (totalCells % 7)) % 7;
  for(let i = 0; i < trailing; i++){
    cells += `<div class="cal-cell empty"></div>`;
  }

  const monthLabel = MONTH_NAMES_FULL[month].charAt(0).toUpperCase() + MONTH_NAMES_FULL[month].slice(1) + " de " + year;

  return `
    <div class="cal-header">
      <button class="cal-nav" id="calPrevBtn" aria-label="mês anterior">${ICONS.left}</button>
      <div class="cal-month-label">${monthLabel}</div>
      <button class="cal-nav" id="calNextBtn" aria-label="próximo mês" ${isCurrentMonth ? "disabled" : ""}>${ICONS.right}</button>
    </div>
    <div class="cal-weekdays"><span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span></div>
    <div class="cal-grid">${cells}</div>
  `;
}

function openDaySheet(dateKey, opts){
  opts = opts || {};
  const arr = sessionsFor(dateKey);
  const a = state.activeSession;
  const hasActive = a.state === "running" || a.state === "paused";

  let sessionId, letter, log, startedAt;

  if(opts.mode === "new"){
    sessionId = null;
    letter = opts.letter || (hasActive && dateKey === todayKey() ? a.letter : nextWorkoutLetter());
    log = {};
    startedAt = Date.now();
  } else if(opts.sessionId){
    const sess = arr.find(s => s.id === opts.sessionId);
    if(sess){
      sessionId = sess.id;
      letter = sess.letter;
      log = JSON.parse(JSON.stringify(sess.log || {}));
      startedAt = sess.startedAt || Date.now();
    } else {
      sessionId = null;
      letter = nextWorkoutLetter();
      log = {};
      startedAt = Date.now();
    }
  } else if(arr.length){
    const sess = arr[arr.length - 1];
    sessionId = sess.id;
    letter = sess.letter;
    log = JSON.parse(JSON.stringify(sess.log || {}));
    startedAt = sess.startedAt || Date.now();
  } else {
    sessionId = null;
    letter = hasActive && dateKey === todayKey() ? a.letter : (dateKey === todayKey() ? nextWorkoutLetter() : state.order[0]);
    log = {};
    startedAt = Date.now();
  }

  let meta = {}, note = "";
  if(sessionId){
    const sess0 = arr.find(x => x.id === sessionId);
    if(sess0){
      meta = JSON.parse(JSON.stringify(sess0.meta || {}));
      note = sess0.note || "";
    }
  }
  overlay = {
    type: "day",
    mode: opts.mode || (sessionId ? "edit" : "new"),
    dateKey,
    sessionId,
    letter,
    log,
    startedAt,
    meta,
    note
  };
  renderOverlay();
}
function openProgressSheet(exId, name){
  overlay = { type: "progress", exId, name };
  renderOverlay();
}
function openImportChoice(parsed){
  overlay = { type: "importChoice", parsed };
  renderOverlay();
}
function openConfirm(msg, onYes, opts){
  overlay = {
    type: "confirm",
    msg,
    onYes,
    yesLabel: opts?.yesLabel,
    noLabel: opts?.noLabel,
    yesStyle: opts?.yesStyle,
    onNo: opts?.onNo
  };
  renderOverlay();
}
function openWorkoutPicker(dateKey){
  overlay = { type: "picker", dateKey };
  renderOverlay();
}
function openExercisePicker(opts){
  overlay = {
    type: "exercisePicker",
    mode: opts.mode,
    letter: opts.letter,
    exId: opts.exId || null,
    query: "",
    selected: new Set(),
    customChecked: false
  };
  renderOverlay();
}
function openDaySessionsSheet(dateKey){
  overlay = { type: "daySessions", dateKey };
  renderOverlay();
}
function closeOverlay(){
  flushAutoSave();
  overlay = null;
  if(sheetClockInterval){ clearInterval(sheetClockInterval); sheetClockInterval = null; }
  renderOverlay();
  syncWakeLock();
}
function renderOverlay(){
  const root = document.getElementById("sheetRoot");
  if(!overlay){ root.innerHTML = ""; return; }
  if(overlay.type === "day") return renderDayOverlay(root);
  if(overlay.type === "progress") return renderProgressOverlay(root);
  if(overlay.type === "importChoice") return renderImportChoiceOverlay(root);
  if(overlay.type === "confirm") return renderConfirmOverlay(root);
  if(overlay.type === "picker") return renderPickerOverlay(root);
  if(overlay.type === "daySessions") return renderDaySessionsOverlay(root);
  if(overlay.type === "exercisePicker") return renderExercisePickerOverlay(root);
  if(overlay.type === "body") return renderBodyOverlay(root);
  if(overlay.type === "backups") return renderBackupsOverlay(root);
}

function renderPickerOverlay(root){
  const { dateKey } = overlay;
  root.innerHTML = `<div class="sheet-backdrop" id="sheetBackdrop"></div>
  <div class="sheet" role="dialog" aria-modal="true">
    <div class="sheet-handle"></div>
    <div class="sheet-header">
      <div class="sheet-date">Escolher treino</div>
      <button class="icon-btn" id="sheetClose" aria-label="fechar">${ICONS.close}</button>
    </div>
    <div class="sheet-picker">
      ${state.order.map(k => {
        const wk = state.workouts[k];
        const isRest = wk?.isRest;
        return `<button class="sheet-picker-item" data-role="pickletter" data-letter="${k}">
          <div class="spi-chip" style="background:${colorFor(k,state.order)}">${isRest ? ICONS.moonSmall : k}</div>
          <div class="spi-name">${escapeHtml(wk?.name || workoutLabel(k))}</div>
        </button>`;
      }).join("")}
    </div>
  </div>`;
  document.getElementById("sheetBackdrop").addEventListener("click", closeOverlay);
  document.getElementById("sheetClose").addEventListener("click", closeOverlay);
  document.querySelectorAll('[data-role="pickletter"]').forEach(b => {
    b.addEventListener("click", () => {
      haptic(6);
      const letter = b.dataset.letter;
      overlay = null;
      startActiveSession(letter);
      openDaySheet(dateKey, { mode: "new", letter });
    });
  });
}

function renderExercisePickerOverlay(root){
  const { mode } = overlay;
  root.innerHTML = `<div class="sheet-backdrop" id="sheetBackdrop"></div>
  <div class="sheet" role="dialog" aria-modal="true">
    <div class="sheet-handle"></div>
    <div class="sheet-header">
      <div class="sheet-date">${mode === "rename" ? "Escolher exercício" : "Adicionar exercícios"}</div>
      <button class="icon-btn" id="sheetClose" aria-label="fechar">${ICONS.close}</button>
    </div>
    <input type="text" id="exPickerSearch" class="ex-picker-search" placeholder="Buscar ou digitar um novo nome…" value="${escapeAttr(overlay.query)}" autocomplete="off" autocapitalize="sentences">
    <div class="ex-picker-list" id="exPickerList"></div>
    ${mode === "add" ? `<button class="footer-btn primary" id="exPickerConfirm" style="width:100%;margin-top:12px;">Adicionar selecionados</button>` : ""}
  </div>`;
  document.getElementById("sheetBackdrop").addEventListener("click", closeOverlay);
  document.getElementById("sheetClose").addEventListener("click", closeOverlay);

  const searchInput = document.getElementById("exPickerSearch");
  searchInput.addEventListener("input", (e) => {
    overlay.query = e.target.value;
    renderExercisePickerList();
  });

  renderExercisePickerList();

  if(mode === "add"){
    const confirmBtn = document.getElementById("exPickerConfirm");
    confirmBtn.addEventListener("click", async () => {
      const names = Array.from(overlay.selected);
      const q = overlay.query.trim();
      if(overlay.customChecked && q && !names.some(n => n.toLowerCase() === q.toLowerCase())){
        names.push(q);
      }
      if(names.length === 0){ showToast("Selecione ao menos um exercício"); return; }
      const w = state.workouts[overlay.letter];
      names.forEach(n => {
        w.exercises.push({ id: newExId(), name: n, sets: "", reps: "", rest: "", mins: "", type: "strength" });
      });
      haptic([10,30,10]);
      closeOverlay();
      render();
      await persist();
      showToast(names.length === 1 ? "Exercício adicionado" : names.length + " exercícios adicionados");
    });
  }

  setTimeout(() => { try{ searchInput.focus(); }catch(e){} }, 50);
}

function renderExercisePickerList(){
  const listEl = document.getElementById("exPickerList");
  if(!listEl || !overlay || overlay.type !== "exercisePicker") return;
  const { mode, selected } = overlay;
  const qRaw = overlay.query.trim();
  const q = qRaw.toLowerCase();

  const itemHtml = (n) => {
    if(mode === "add"){
      return `<label class="ex-picker-item">
        <input type="checkbox" data-name="${escapeAttr(n)}" ${selected.has(n) ? "checked" : ""}>
        <span>${escapeHtml(n)}</span>
      </label>`;
    }
    return `<button type="button" class="ex-picker-item" data-role="pickexname" data-name="${escapeAttr(n)}">
      ${escapeHtml(n)}
    </button>`;
  };
  const customRowHtml = () => {
    if(mode === "add"){
      return `<label class="ex-picker-item ex-picker-custom">
        <input type="checkbox" id="exPickerCustomCheck" ${overlay.customChecked ? "checked" : ""}>
        <span>${ICONS.plus} Adicionar “${escapeHtml(qRaw)}”</span>
      </label>`;
    }
    return `<button type="button" class="ex-picker-item ex-picker-custom" data-role="pickexname" data-name="${escapeAttr(qRaw)}">
      ${ICONS.plus} Usar “${escapeHtml(qRaw)}”
    </button>`;
  };

  let html = "";

  if(q){
    const allNames = getAllExerciseNames();
    const filtered = allNames.filter(n => n.toLowerCase().includes(q));
    const exactMatch = allNames.some(n => n.toLowerCase() === q);
    if(!exactMatch) html += customRowHtml();
    filtered.forEach(n => { html += itemHtml(n); });
  } else {
    const custom = getCustomExerciseNames();
    if(custom.length){
      html += `<details class="ex-picker-group">
        <summary class="ex-picker-group-title"><span>Meus exercícios</span> <span class="ex-picker-count">${custom.length}</span></summary>
        <div class="ex-picker-group-list">${custom.map(itemHtml).join("")}</div>
      </details>`;
    }
    Object.keys(EXERCISE_LIBRARY).forEach(group => {
      const list = EXERCISE_LIBRARY[group];
      html += `<details class="ex-picker-group">
        <summary class="ex-picker-group-title"><span>${escapeHtml(group)}</span> <span class="ex-picker-count">${list.length}</span></summary>
        <div class="ex-picker-group-list">${list.map(itemHtml).join("")}</div>
      </details>`;
    });
  }

  listEl.innerHTML = html;

  listEl.querySelectorAll("details.ex-picker-group").forEach(d => {
    d.addEventListener("toggle", () => {
      if(!d.open) return;
      listEl.querySelectorAll("details.ex-picker-group[open]").forEach(o => { if(o !== d) o.open = false; });
      d.scrollIntoView({ block: "nearest" });
    });
  });

  if(mode === "add"){
    const customCheck = document.getElementById("exPickerCustomCheck");
    if(customCheck) customCheck.addEventListener("change", (e) => {
      overlay.customChecked = e.target.checked;
    });
    listEl.querySelectorAll('input[type="checkbox"][data-name]').forEach(cb => {
      cb.addEventListener("change", (e) => {
        const n = e.target.dataset.name;
        if(e.target.checked) overlay.selected.add(n);
        else overlay.selected.delete(n);
      });
    });
  } else {
    listEl.querySelectorAll('[data-role="pickexname"]').forEach(btn => {
      btn.addEventListener("click", async () => {
        const name = btn.dataset.name;
        const w = state.workouts[overlay.letter];
        const ex = w.exercises.find(e => e.id === overlay.exId);
        if(!ex) return;
        ex.name = name;
        haptic(6);
        closeOverlay();
        render();
        await persist();
      });
    });
  }
}

function renderDaySessionsOverlay(root){
  const { dateKey } = overlay;
  const arr = sessionsFor(dateKey);
  const [y,m,dd] = dateKey.split("-").map(Number);
  const d = new Date(y, m-1, dd);
  const dateLabel = `${WEEKDAY_FULL[d.getDay()]}, ${dd} de ${MONTH_NAMES_FULL[m-1]}`;
  root.innerHTML = `<div class="sheet-backdrop" id="sheetBackdrop"></div>
  <div class="sheet" role="dialog" aria-modal="true">
    <div class="sheet-handle"></div>
    <div class="sheet-header">
      <div class="sheet-date" style="text-transform:capitalize;">${escapeHtml(dateLabel)}</div>
      <button class="icon-btn" id="sheetClose" aria-label="fechar">${ICONS.close}</button>
    </div>
    <p style="font-size:12px;color:var(--text-muted);margin:0 0 12px;">${arr.length} treinos neste dia</p>
    <div class="sheet-day-sessions">
      ${arr.map((sess, idx) => {
        const wk = state.workouts[sess.letter];
        const isRest = wk?.isRest;
        const dur = sessionDurationMs(sess);
        const setsCount = Object.values(sess.log || {}).reduce((n, sets) => n + (Array.isArray(sets) ? sets.length : 0), 0);
        const metaBits = [];
        if(idx === 0) metaBits.push("1º");
        else if(idx === 1) metaBits.push("2º");
        else metaBits.push((idx+1) + "º");
        if(dur) metaBits.push(fmtDuration(dur));
        if(setsCount) metaBits.push(setsCount + " série(s)");
        return `<div class="sheet-day-session" role="button" data-role="opensession" data-sessionid="${sess.id}">
          <div class="sds-chip" style="background:${colorFor(sess.letter, state.order)}">${isRest ? ICONS.moonSmall : sess.letter}</div>
          <div class="sds-info">
            <div class="sds-name">${escapeHtml(wk?.name || workoutLabel(sess.letter))}</div>
            <div class="sds-meta">${metaBits.join(" · ")}</div>
          </div>
          <button class="sds-del" data-role="delsession" data-sessionid="${sess.id}" aria-label="remover sessão">${ICONS.close}</button>
        </div>`;
      }).join("")}
    </div>
  </div>`;
  document.getElementById("sheetBackdrop").addEventListener("click", closeOverlay);
  document.getElementById("sheetClose").addEventListener("click", closeOverlay);
  document.querySelectorAll('[data-role="opensession"]').forEach(b => {
    b.addEventListener("click", (ev) => {
      if(ev.target.closest('[data-role="delsession"]')) return;
      const sessionId = b.dataset.sessionid;
      overlay = null;
      openDaySheet(dateKey, { sessionId });
    });
  });
  document.querySelectorAll('[data-role="delsession"]').forEach(el => {
    el.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const sessionId = el.dataset.sessionid;
      const before = sessionsFor(dateKey).slice();
      const origIdx = before.findIndex(x => x.id === sessionId);
      if(origIdx < 0) return;
      const removed = before[origIdx];
      const arr2 = before.filter(x => x.id !== sessionId);
      if(arr2.length) state.sessions[dateKey] = arr2;
      else delete state.sessions[dateKey];
      overlay = null;
      render();
      persist();
      showToast("Sessão removida", { label: "Desfazer", fn: async () => {
        const cur = sessionsFor(dateKey).slice();
        if(cur.some(x => x.id === removed.id)) return;
        cur.splice(Math.min(origIdx, cur.length), 0, removed);
        state.sessions[dateKey] = cur;
        render();
        await persist();
        showToast("Sessão restaurada");
      }});
    });
  });
}

function ensureSetsForExercise(log, exId, defaultSets){
  if(!Array.isArray(log[exId])){
    const n = Math.max(1, parseInt(defaultSets, 10) || 1);
    log[exId] = Array.from({length: n}, () => ({ weight: null, reps: null, done: false }));
  }
  return log[exId];
}
function ensureCardioSets(log, exId){
  if(!Array.isArray(log[exId]) || log[exId].length === 0){
    log[exId] = [{ minutes: null, done: false }];
  }
  log[exId].forEach(s => {
    if(!("minutes" in s)) s.minutes = null;
    if(!("done" in s)) s.done = false;
  });
  return log[exId];
}

function isLinkedNext(w, idx){
  const ex = w.exercises[idx];
  return !!(ex && ex.ss && idx < w.exercises.length - 1);
}
function ensureMeta(exId){
  overlay.meta = overlay.meta || {};
  overlay.meta[exId] = overlay.meta[exId] || {};
  return overlay.meta[exId];
}
function cleanMeta(meta){
  const out = {};
  Object.keys(meta || {}).forEach(id => {
    const m = meta[id] || {};
    const note = (m.note || "").trim();
    const rpe = m.rpe != null && !isNaN(m.rpe) ? m.rpe : null;
    if(note || rpe != null){
      out[id] = {};
      if(rpe != null) out[id].rpe = rpe;
      if(note) out[id].note = note;
    }
  });
  return out;
}
let autoSaveTimer = null;
function scheduleAutoSave(){
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => { autoSaveTimer = null; autoSaveOverlay(); }, 350);
}
function flushAutoSave(){
  if(autoSaveTimer){ clearTimeout(autoSaveTimer); autoSaveTimer = null; autoSaveOverlay(); }
}

function setDefaults(ex, dateKey){
  const last = lastLoggedValue(ex.id, dateKey);
  if(isCardio(ex)){
    const dm = parseInt(ex.mins, 10) || null;
    return { minutes: dm != null ? dm : (last && last.minutes != null ? last.minutes : 20) };
  }
  const dr = parseInt(ex.reps, 10) || null;
  return {
    weight: last && last.weight != null ? last.weight : 0,
    reps: dr != null ? dr : (last && last.reps != null ? last.reps : 10)
  };
}
function commitSetDefaults(ex, set, dateKey){
  if(!ex) return;
  const d = setDefaults(ex, dateKey);
  if(isCardio(ex)){
    if(set.minutes == null) set.minutes = d.minutes;
  } else {
    if(set.weight == null) set.weight = d.weight;
    if(set.reps == null) set.reps = d.reps;
  }
}
function setNumHtml(s, i){
  const t = SET_TYPES.includes(s.type) ? s.type : "normal";
  return (t === "normal" ? String(i + 1) : SET_TYPE_LABEL[t]) + (s.pr ? `<span class="set-pr">${ICONS.trophy}</span>` : "");
}
function refreshSetInputs(root, exid, setidx){
  const set = overlay.log[exid] && overlay.log[exid][setidx];
  if(!set) return;
  const q = (f) => root.querySelector(`[data-field="${f}"][data-exid="${exid}"][data-setidx="${setidx}"]`);
  const w = q("weight"); if(w && set.weight != null) w.value = fmtW(set.weight);
  const r = q("reps"); if(r && set.reps != null) r.value = String(set.reps);
  const m = q("minutes"); if(m && set.minutes != null) m.textContent = set.minutes;
}

function renderDayOverlay(root){
  const { dateKey, letter, log, startedAt, mode } = overlay;
  const [y,m,dd] = dateKey.split("-").map(Number);
  const d = new Date(y, m-1, dd);
  const isToday = dateKey === todayKey();
  const dateLabel = isToday ? "Hoje" : `${WEEKDAY_FULL[d.getDay()]}, ${dd} de ${MONTH_NAMES_FULL[m-1]}`;
  const w = state.workouts[letter] || { exercises: [] };

  const a = state.activeSession;
  const hasActiveHere = (a.state === "running" || a.state === "paused") && dateKey === todayKey() && a.letter === letter;
  const elapsed = hasActiveHere
    ? Math.floor(activeElapsedMs() / 1000)
    : Math.floor((Date.now() - startedAt) / 1000);

  const hasExercises = !w.isRest && w.exercises.length > 0;

  let html = `<div class="sheet-backdrop" id="sheetBackdrop"></div>`;
  html += `<div class="sheet" role="dialog" aria-modal="true" aria-label="Registrar treino" id="daySheet">
    <div class="sheet-handle" id="sheetHandle"></div>
    <div class="sheet-header">
      <div class="sheet-date">${escapeHtml(dateLabel)}</div>
      <button class="icon-btn" id="sheetClose" aria-label="fechar">${ICONS.close}</button>
    </div>
    ${hasActiveHere ? `
      <div class="sheet-clock" id="sheetClock">
        <span class="clock-icon">${ICONS.timer}</span>
        <span class="clock-time" id="sheetClockTime">${fmtClock(elapsed)}</span>
        <span class="clock-label">em andamento</span>
      </div>` : ""}
    <div class="sheet-chips">
      ${state.order.map(k => {
        const wk = state.workouts[k];
        const label = wk?.isRest ? "Desc." : k;
        const active = k === letter;
        return `<button class="chip" data-role="sheetletter" data-letter="${k}" aria-pressed="${active}" style="${active ? `background:${colorFor(k,state.order)};color:#fff;border-color:transparent` : ""}">${label}</button>`;
      }).join("")}
    </div>
    ${hasExercises ? `<p class="sheet-hint">Toque no número da série para marcar aquecimento (A), drop set (D) ou até a falha (F). Aquecimento não entra nas estatísticas.</p>` : ""}
    ${w.isRest
      ? `<div class="sheet-empty">Dia de descanso — nada para registrar.</div>`
      : (w.exercises.length ? `<div class="sheet-exercises">${w.exercises.map((ex, i) => {
          const linked = isLinkedNext(w, i) || (i > 0 && isLinkedNext(w, i - 1));
          if(isCardio(ex)) return renderCardioRow(ex, log, dateKey, linked);
          return renderStrengthRow(ex, log, dateKey, linked);
        }).join("")}</div>` : `<div class="empty-state">
            <div class="empty-icon">${ICONS.dumbbell}</div>
            <p class="empty-title">Treino sem exercícios</p>
            <p class="empty-sub">Adicione exercícios na seção "Meus treinos" antes de registrar.</p>
          </div>`)
    }
    ${hasExercises ? `<label class="sheet-note-wrap"><span>Observações do treino</span>
      <textarea id="sessionNote" class="sheet-note-area" rows="2" placeholder="Sono, dor, energia…">${escapeHtml(overlay.note || "")}</textarea></label>` : ""}
    <div class="sheet-actions">
      ${mode === "new"
        ? `<button class="cta-btn" id="sheetCreate">Salvar treino</button>`
        : ""}
    </div>
  </div>`;
  root.innerHTML = html;

  document.getElementById("sheetBackdrop").addEventListener("click", closeOverlay);
  document.getElementById("sheetClose").addEventListener("click", closeOverlay);

  if(sheetClockInterval){ clearInterval(sheetClockInterval); sheetClockInterval = null; }
  const clockEl = document.getElementById("sheetClockTime");
  if(clockEl){
    sheetClockInterval = setInterval(() => {
      const a2 = state.activeSession;
      const hasActive = (a2.state === "running" || a2.state === "paused") && dateKey === todayKey() && a2.letter === letter;
      if(!hasActive) return;
      clockEl.textContent = fmtClock(Math.floor(activeElapsedMs() / 1000));
    }, 1000);
  }

  document.querySelectorAll('[data-role="sheetletter"]').forEach(b => {
    b.addEventListener("click", () => { haptic(6); overlay.letter = b.dataset.letter; renderOverlay(); });
  });

  root.querySelectorAll(".step-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      haptic(6);
      const exid = btn.dataset.exid;
      const setidx = parseInt(btn.dataset.setidx, 10);
      const role = btn.dataset.role;
      const sets = overlay.log[exid];
      if(!sets || !sets[setidx]) return;
      const set = sets[setidx];
      commitSetDefaults(findExercise(exid), set, overlay.dateKey);
      if(role === "wplus" || role === "wminus"){
        const cur = set.weight != null ? toDisp(Number(set.weight)) : 0;
        const next = Math.max(0, roundToStep(cur + (role === "wplus" ? 1 : -1) * weightStep(), 0.1));
        set.weight = fromDisp(next);
      } else if(role === "rplus" || role === "rminus"){
        const cur = set.reps != null ? Number(set.reps) : 0;
        set.reps = Math.max(0, cur + (role === "rplus" ? 1 : -1));
      } else if(role === "mplus" || role === "mminus"){
        const cur = set.minutes != null ? Number(set.minutes) : 0;
        set.minutes = Math.max(0, cur + (role === "mplus" ? 1 : -1));
      } else {
        return;
      }
      refreshSetInputs(root, exid, setidx);
      autoSaveOverlay();
    });
  });

  root.querySelectorAll('input.step-value.input[data-field="weight"]').forEach(inp => {
    inp.addEventListener("input", () => {
      const exid = inp.dataset.exid;
      const setidx = parseInt(inp.dataset.setidx, 10);
      const sets = overlay.log[exid];
      if(!sets || !sets[setidx]) return;
      sets[setidx].weight = fromDisp(parseNum(inp.value));
      autoSaveOverlay();
    });
    inp.addEventListener("blur", () => {
      const exid = inp.dataset.exid;
      const setidx = parseInt(inp.dataset.setidx, 10);
      const sets = overlay.log[exid];
      if(!sets || !sets[setidx]) return;
      const wv = sets[setidx].weight;
      inp.value = wv == null ? "" : fmtW(wv);
    });
  });
  root.querySelectorAll('input.step-value.input[data-field="reps"]').forEach(inp => {
    inp.addEventListener("input", () => {
      const exid = inp.dataset.exid;
      const setidx = parseInt(inp.dataset.setidx, 10);
      const sets = overlay.log[exid];
      if(!sets || !sets[setidx]) return;
      sets[setidx].reps = parseNum(inp.value);
      autoSaveOverlay();
    });
    inp.addEventListener("blur", () => {
      const exid = inp.dataset.exid;
      const setidx = parseInt(inp.dataset.setidx, 10);
      const sets = overlay.log[exid];
      if(!sets || !sets[setidx]) return;
      const r = sets[setidx].reps;
      inp.value = r == null ? "" : String(r);
    });
  });

  root.querySelectorAll('[data-role="settype"]').forEach(btn => {
    btn.addEventListener("click", () => {
      const exid = btn.dataset.exid;
      const setidx = parseInt(btn.dataset.setidx, 10);
      const sets = overlay.log[exid];
      if(!sets || !sets[setidx]) return;
      const set = sets[setidx];
      const cur = SET_TYPES.indexOf(set.type || "normal");
      const next = SET_TYPES[(cur + 1) % SET_TYPES.length];
      if(next === "normal") delete set.type; else set.type = next;
      if(next === "warm") set.pr = false;
      haptic(6);
      btn.innerHTML = setNumHtml(set, setidx);
      const row = btn.closest(".sheet-set");
      SET_TYPES.forEach(t => row.classList.remove("t-" + t));
      row.classList.add("t-" + next);
      btn.setAttribute("aria-label", `série ${setidx + 1}, tipo ${SET_TYPE_NAME[next]}. Toque para mudar`);
      autoSaveOverlay();
    });
  });

  root.querySelectorAll('[data-role="toggleSet"]').forEach(btn => {
    btn.addEventListener("click", () => {
      const exid = btn.dataset.exid;
      const setidx = parseInt(btn.dataset.setidx, 10);
      const sets = overlay.log[exid];
      if(!sets || !sets[setidx]) return;
      const set = sets[setidx];
      const ex = findExercise(exid);
      set.done = !set.done;
      let prMsg = null;
      if(set.done){
        commitSetDefaults(ex, set, overlay.dateKey);
        refreshSetInputs(root, exid, setidx);
        set.pr = false;
        if(ex && !isCardio(ex) && isWork(set)){
          prMsg = checkPR(exid, set, sets, setidx);
          if(prMsg) set.pr = true;
        }
      } else {
        set.pr = false;
      }
      const row = btn.closest(".sheet-set");
      row.classList.toggle("done", set.done);
      const numBtn = row.querySelector('[data-role="settype"]');
      if(numBtn) numBtn.innerHTML = setNumHtml(set, setidx);
      autoSaveOverlay();
      if(set.done){
        if(prMsg){
          haptic([30, 50, 30, 50, 80]);
          showToast(prMsg);
        } else {
          haptic([10, 30, 10]);
        }
        if(ex && ex.ss){
          if(!prMsg) showToast("Superset — vá para o próximo exercício");
        } else {
          startRestTimer(exid);
        }
      } else {
        haptic(6);
      }
    });
  });

  root.querySelectorAll('[data-role="applysuggest"]').forEach(btn => {
    btn.addEventListener("click", () => {
      const exid = btn.dataset.exid;
      const ex = findExercise(exid);
      const sug = suggestNext(ex, overlay.dateKey);
      const sets = overlay.log[exid];
      if(!sug || !sets) return;
      sets.forEach((s, i) => {
        if(s.done) return;
        s.weight = sug.weight;
        s.reps = sug.reps;
        refreshSetInputs(root, exid, i);
      });
      haptic(8);
      autoSaveOverlay();
      showToast("Sugestão aplicada");
    });
  });

  root.querySelectorAll('[data-role="exrpe"]').forEach(sel => {
    sel.addEventListener("change", () => {
      const v = sel.value ? parseInt(sel.value, 10) : null;
      ensureMeta(sel.dataset.exid).rpe = v;
      autoSaveOverlay();
    });
  });
  root.querySelectorAll('[data-role="exnote"]').forEach(inp => {
    inp.addEventListener("input", () => {
      ensureMeta(inp.dataset.exid).note = inp.value;
      scheduleAutoSave();
    });
  });
  const noteEl = document.getElementById("sessionNote");
  if(noteEl) noteEl.addEventListener("input", () => {
    overlay.note = noteEl.value;
    scheduleAutoSave();
  });

  const createBtn = document.getElementById("sheetCreate");
  if(createBtn) createBtn.addEventListener("click", () => {
    const { dateKey: dk, letter: lt, log: lg, startedAt: st, mode: md } = overlay;
    if(md !== "new") return;
    const arr = sessionsFor(dk).slice();
    const cleanLog = JSON.parse(JSON.stringify(lg));
    Object.keys(cleanLog).forEach(exId => {
      cleanLog[exId] = (cleanLog[exId] || []).filter(s => s.minutes != null || s.weight != null || s.reps != null || s.done);
    });
    const meta = cleanMeta(overlay.meta);
    const note = (overlay.note || "").trim();
    let sess = arr.find(s => s.letter === lt && !s.endedAt);
    if(sess){
      sess.log = cleanLog;
    } else {
      sess = {
        id: newSessionId(),
        letter: lt,
        log: cleanLog,
        startedAt: st,
        endedAt: null
      };
      arr.push(sess);
    }
    if(Object.keys(meta).length) sess.meta = meta; else delete sess.meta;
    if(note) sess.note = note; else delete sess.note;
    state.sessions[dk] = arr;
    haptic([10,40,10]);
    closeOverlay();
    render();
    persist();
    showToast("Séries salvas");
  });

  enableSheetDrag(root.querySelector("#daySheet"), root.querySelector("#sheetHandle"));
  syncWakeLock();
}

function autoSaveOverlay(){
  if(!overlay || overlay.type !== "day") return;
  if(overlay.mode === "new") return;
  const { dateKey, sessionId, letter, log, startedAt } = overlay;
  const arr = sessionsFor(dateKey).slice();
  let sess = arr.find(s => s.id === sessionId);
  if(!sess){
    sess = { id: sessionId || newSessionId(), letter, log: {}, startedAt, endedAt: null };
    arr.push(sess);
  }
  sess.letter = letter;
  sess.log = JSON.parse(JSON.stringify(log));
  const meta = cleanMeta(overlay.meta);
  if(Object.keys(meta).length) sess.meta = meta; else delete sess.meta;
  const note = (overlay.note || "").trim();
  if(note) sess.note = note; else delete sess.note;
  if(!sess.startedAt) sess.startedAt = startedAt;
  state.sessions[dateKey] = arr;
  persist();
}

function exExtrasHtml(ex){
  const meta = (overlay.meta && overlay.meta[ex.id]) || {};
  const rpeOpts = `<option value="">RPE</option>` + [10,9,8,7,6,5,4,3,2,1].map(n => `<option value="${n}" ${meta.rpe === n ? "selected" : ""}>RPE ${n}</option>`).join("");
  return `<div class="sheet-ex-extra">
    <select class="sheet-rpe" data-role="exrpe" data-exid="${ex.id}" aria-label="Esforço percebido (RPE)">${rpeOpts}</select>
    <input class="sheet-note" type="text" data-role="exnote" data-exid="${ex.id}" value="${escapeAttr(meta.note || "")}" placeholder="Observação…" aria-label="Observação do exercício" autocomplete="off">
  </div>`;
}
function exNameHtml(ex, fallback, linked){
  const url = safeUrl(ex.link);
  return `<div class="sheet-ex-name${linked ? " linked" : ""}">
    <span class="sheet-ex-title">${isCardio(ex) ? ICONS.cardio + " " : ""}${escapeHtml(ex.name || fallback)}</span>
    ${linked ? `<span class="ss-badge">superset</span>` : ""}
    ${url ? `<a class="ex-link" href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer" aria-label="Ver vídeo ou técnica">${ICONS.link}</a>` : ""}
  </div>`;
}

function renderStrengthRow(ex, log, dateKey, linked){
  const last = lastLoggedValue(ex.id, dateKey);
  const sets = ensureSetsForExercise(log, ex.id, ex.sets);
  const def = setDefaults(ex, dateKey);
  const restSec = restForExercise(ex.id);
  const sug = suggestNext(ex, dateKey);
  const pr = exercisePRs(ex.id);
  const lastLabel = last
    ? `última vez: ${last.weight != null ? fmtW(last.weight) + " " + unit() : "—"} × ${last.reps != null ? last.reps : "—"}`
    : "primeira vez registrando";
  const restLabel = ex.ss ? "sem descanso (superset)" : `descanso ${restSec}s`;
  return `<div class="sheet-ex-row${linked ? " linked" : ""}" data-exid="${ex.id}">
    ${exNameHtml(ex, "Exercício", linked)}
    <div class="sheet-ex-last">${lastLabel} · ${restLabel}${pr ? ` · recorde ${fmtW(pr.maxWeight)} ${unit()}` : ""}</div>
    ${sug ? `<button type="button" class="suggest-chip" data-role="applysuggest" data-exid="${ex.id}"><span>${escapeHtml(sug.text)}</span><b>aplicar</b></button>` : ""}
    <div class="sheet-sets" data-exid="${ex.id}">
      ${sets.map((s, i) => {
        const initialWeight = s.weight != null ? s.weight : def.weight;
        const initialReps = s.reps != null ? s.reps : def.reps;
        const t = SET_TYPES.includes(s.type) ? s.type : "normal";
        return `<div class="sheet-set ${s.done ? "done" : ""} t-${t}" data-setidx="${i}">
          <button type="button" class="sheet-set-num" data-role="settype" data-exid="${ex.id}" data-setidx="${i}" aria-label="série ${i+1}, tipo ${SET_TYPE_NAME[t]}. Toque para mudar">${setNumHtml(s, i)}</button>
          <div class="step-group">
            <button class="step-btn" data-role="wminus" data-exid="${ex.id}" data-setidx="${i}" aria-label="diminuir peso">−</button>
            <input class="step-value input" type="text" inputmode="decimal"
              data-field="weight" data-exid="${ex.id}" data-setidx="${i}"
              value="${escapeAttr(fmtW(initialWeight))}"
              aria-label="peso em ${unit()}">
            <span class="step-unit">${unit()}</span>
            <button class="step-btn" data-role="wplus" data-exid="${ex.id}" data-setidx="${i}" aria-label="aumentar peso">+</button>
          </div>
          <div class="step-group">
            <button class="step-btn" data-role="rminus" data-exid="${ex.id}" data-setidx="${i}" aria-label="diminuir reps">−</button>
            <input class="step-value input" type="text" inputmode="numeric"
              data-field="reps" data-exid="${ex.id}" data-setidx="${i}"
              value="${escapeAttr(initialReps != null && initialReps !== "" ? String(initialReps) : "")}"
              aria-label="repetições">
            <button class="step-btn" data-role="rplus" data-exid="${ex.id}" data-setidx="${i}" aria-label="aumentar reps">+</button>
          </div>
          <button class="sheet-set-check" data-role="toggleSet" data-exid="${ex.id}" data-setidx="${i}" aria-label="marcar série ${i+1}">${ICONS.checkSm}</button>
        </div>`;
      }).join("")}
    </div>
    ${exExtrasHtml(ex)}
  </div>`;
}

function renderCardioRow(ex, log, dateKey, linked){
  const last = lastLoggedValue(ex.id, dateKey);
  const sets = ensureCardioSets(log, ex.id);
  const def = setDefaults(ex, dateKey);
  const lastLabel = last && last.minutes != null
    ? `última vez: ${last.minutes} min`
    : "primeira vez registrando";
  return `<div class="sheet-ex-row${linked ? " linked" : ""}" data-exid="${ex.id}">
    ${exNameHtml(ex, "Cardio", linked)}
    <div class="sheet-ex-last">${lastLabel}</div>
    <div class="sheet-sets" data-exid="${ex.id}">
      ${sets.map((s, i) => {
        const initialMin = s.minutes != null ? s.minutes : def.minutes;
        return `<div class="sheet-set ${s.done ? "done" : ""}" data-setidx="${i}">
          <div class="sheet-set-num">${i+1}</div>
          <div class="step-group">
            <button class="step-btn" data-role="mminus" data-exid="${ex.id}" data-setidx="${i}" aria-label="diminuir minutos">−</button>
            <div class="step-value" data-field="minutes" data-exid="${ex.id}" data-setidx="${i}">${initialMin}</div>
            <span class="step-unit">min</span>
            <button class="step-btn" data-role="mplus" data-exid="${ex.id}" data-setidx="${i}" aria-label="aumentar minutos">+</button>
          </div>
          <button class="sheet-set-check" data-role="toggleSet" data-exid="${ex.id}" data-setidx="${i}" aria-label="marcar ${i+1}">${ICONS.checkSm}</button>
        </div>`;
      }).join("")}
    </div>
    ${exExtrasHtml(ex)}
  </div>`;
}

function enableSheetDrag(sheetEl, handleEl){
  if(!sheetEl || !handleEl) return;
  let startY = 0, curY = 0, dragging = false;
  handleEl.addEventListener("pointerdown", (e) => {
    dragging = true; startY = e.clientY; curY = 0;
    sheetEl.classList.add("dragging");
    handleEl.setPointerCapture(e.pointerId);
  });
  handleEl.addEventListener("pointermove", (e) => {
    if(!dragging) return;
    curY = Math.max(0, e.clientY - startY);
    sheetEl.style.transform = `translateY(${curY}px)`;
  });
  const end = () => {
    if(!dragging) return;
    dragging = false;
    sheetEl.classList.remove("dragging");
    if(curY > 100){
      closeOverlay();
    } else {
      sheetEl.style.transform = "";
    }
    curY = 0;
  };
  handleEl.addEventListener("pointerup", end);
  handleEl.addEventListener("pointercancel", end);
}

async function undoToday(){
  const dateKey = todayKey();
  const arr = sessionsFor(dateKey);
  if(arr.length === 0) return;
  arr.pop();
  if(arr.length === 0) delete state.sessions[dateKey];
  else state.sessions[dateKey] = arr;

  const a = state.activeSession;
  if(a.startedDate === dateKey && a.state !== "idle"){
    a.state = "idle"; a.letter = null; a.elapsedMs = 0; a.startedAt = null; a.startedDate = null;
  }
  render();
  await persist();
  showToast("Desfeito");
}

function startRestTimer(exId){
  const duration = exId ? restForExercise(exId) : (state.settings.restDuration || 90);
  const endsAt = Date.now() + duration * 1000;
  state.settings.restTimerActive = { endsAt, duration };
  persist();
  renderRestTimer();
}
function stopRestTimer(){
  state.settings.restTimerActive = null;
  if(restTimerInterval){ clearInterval(restTimerInterval); restTimerInterval = null; }
  persist();
  renderRestTimer();
}
function finishRestTimer(root){
  if(restTimerInterval){ clearInterval(restTimerInterval); restTimerInterval = null; }
  state.settings.restTimerActive = null;
  persist();
  haptic([200,100,200]);
  if(typeof Notification !== "undefined" && Notification.permission === "granted"){
    try { new Notification("Descanso acabou", { body: "Bora pra próxima série." }); } catch(e){}
  }
  showToast("Descanso acabou — próxima série!");
  root.innerHTML = "";
}
function buildRestTimerDom(root, C){
  root.innerHTML = `<div class="rest-timer">
    <div class="rest-ring">
      <svg viewBox="0 0 44 44">
        <circle class="ring-bg" cx="22" cy="22" r="18"/>
        <circle class="ring-fg" id="restRingFg" cx="22" cy="22" r="18"
          stroke-dasharray="${C}" stroke-dashoffset="0"/>
      </svg>
    </div>
    <div class="rest-info">
      <div class="rest-label">descanso</div>
      <div class="rest-time" id="restTime"></div>
    </div>
    <button class="rest-btn" id="restPlus30">+30s</button>
    <button class="rest-btn primary" id="restStop">pular</button>
  </div>`;
  document.getElementById("restStop").addEventListener("click", () => {
    haptic(6);
    stopRestTimer();
  });
  document.getElementById("restPlus30").addEventListener("click", () => {
    haptic(6);
    const t = state.settings.restTimerActive;
    if(t){
      t.endsAt += 30000;
      t.duration += 30;
      persist();
      renderRestTimer();
    }
  });
}
function renderRestTimer(){
  const root = document.getElementById("restTimerRoot");
  if(!root) return;
  const t = state.settings.restTimerActive;
  if(!t){
    root.innerHTML = "";
    if(restTimerInterval){ clearInterval(restTimerInterval); restTimerInterval = null; }
    return;
  }

  const remainMs = t.endsAt - Date.now();
  const remain = Math.max(0, Math.ceil(remainMs / 1000));
  if(remain <= 0){ finishRestTimer(root); return; }

  const C = 2 * Math.PI * 18;
  if(!root.firstElementChild) buildRestTimerDom(root, C);

  const timeEl = document.getElementById("restTime");
  const txt = `${pad(Math.floor(remain / 60))}:${pad(remain % 60)}`;
  if(timeEl && timeEl.textContent !== txt) timeEl.textContent = txt;

  const fg = document.getElementById("restRingFg");
  if(fg){
    const pct = Math.min(1, Math.max(0, remainMs / (t.duration * 1000)));
    fg.style.strokeDashoffset = String(C * (1 - pct));
  }

  if(!restTimerInterval){
    restTimerInterval = setInterval(renderRestTimer, 250);
  }
}

function buildLineChart(hist, unit){
  const w = 300, h = 140, padL = 34, padR = 14, padT = 14, padB = 24;
  const validPts = hist.filter(p => (p.weight != null && !isNaN(p.weight)) || (p.minutes != null && !isNaN(p.minutes)));
  const validValues = validPts.map(p => p.weight != null ? p.weight : p.minutes);
  if(validValues.length === 0) return "";
  let min = Math.min(...validValues), max = Math.max(...validValues);
  if(min === max){ min -= 1; max += 1; }
  const stepX = validPts.length > 1 ? (w - padL - padR) / (validPts.length - 1) : 0;
  const pts = validPts.map((p, i) => {
    const x = padL + i * stepX;
    const val = p.weight != null ? p.weight : p.minutes;
    const y = padT + (1 - (val - min) / (max - min)) * (h - padT - padB);
    return { x, y };
  });
  const linePath = pts.map((pt, i) => (i === 0 ? "M" : "L") + pt.x.toFixed(1) + " " + pt.y.toFixed(1)).join(" ");
  const circles = pts.map(pt => `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="3.2" fill="var(--accent)"/>`).join("");
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" role="img" aria-label="Gráfico de evolução">
    <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${h-padB}" stroke="var(--divider)" stroke-width="1"/>
    <line x1="${padL}" y1="${h-padB}" x2="${w-padR}" y2="${h-padB}" stroke="var(--divider)" stroke-width="1"/>
    <text x="4" y="${padT+4}" font-size="9" fill="var(--text-muted)">${max}${unit}</text>
    <text x="4" y="${h-padB+4}" font-size="9" fill="var(--text-muted)">${min}${unit}</text>
    <path d="${linePath}" fill="none" stroke="var(--accent)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>
    ${circles}
  </svg>`;
}

function renderProgressOverlay(root){
  const { exId, name } = overlay;
  const ex = findExercise(exId);
  const cardio = isCardio(ex);
  const hist = exerciseHistory(exId);
  let body;
  if(hist.length === 0){
    body = `<div class="sheet-empty">Ainda não há registros para "${escapeHtml(name)}".</div>`;
  } else if(cardio){
    const chart = buildLineChart(hist, "min");
    body = `<div class="chart-wrap">${chart}</div>` +
      `<div class="progress-list">${hist.slice().reverse().map(p => {
        const [, mo, da] = p.date.split("-").map(Number);
        return `<div class="progress-row"><span>${da}/${mo}</span><span>${p.minutes != null ? p.minutes + " min" : "—"}</span><span>${p.totalMinutes ? p.totalMinutes + " min total" : ""}</span></div>`;
      }).join("")}</div>`;
  } else {
    const chart = buildLineChart(hist.map(p => ({ ...p, weight: p.weight != null ? Math.round(toDisp(p.weight) * 10) / 10 : null })), unit());
    const prs = exercisePRs(exId);
    const prHtml = prs ? `<div class="pr-chips">
      <div class="pr-chip"><span>${ICONS.trophy} carga máx.</span><b>${fmtW(prs.maxWeight)} ${unit()}${prs.maxWeightReps ? " × " + prs.maxWeightReps : ""}</b></div>
      <div class="pr-chip"><span>1RM estimado</span><b>${fmtW(prs.best1rm)} ${unit()}</b></div>
    </div>` : "";
    body = prHtml + `<div class="chart-wrap">${chart || `<div class="sheet-empty">Só há repetições registradas, sem peso, até agora.</div>`}</div>` +
      `<div class="progress-list">${hist.slice().reverse().map(p => {
        const [, mo, da] = p.date.split("-").map(Number);
        return `<div class="progress-row"><span>${da}/${mo}</span><span>${p.weight != null ? fmtW(p.weight) + " " + unit() : "—"}</span><span>${p.reps != null ? p.reps + " reps" : "—"}</span></div>`;
      }).join("")}</div>`;
  }
  root.innerHTML = `<div class="sheet-backdrop" id="sheetBackdrop"></div>
  <div class="sheet" role="dialog" aria-modal="true" aria-label="Progresso do exercício">
    <div class="sheet-handle"></div>
    <div class="sheet-header">
      <div class="sheet-date">${escapeHtml(name)}</div>
      <button class="icon-btn" id="sheetClose" aria-label="fechar">${ICONS.close}</button>
    </div>
    ${body}
  </div>`;
  document.getElementById("sheetBackdrop").addEventListener("click", closeOverlay);
  document.getElementById("sheetClose").addEventListener("click", closeOverlay);
}

function renderConfirmOverlay(root){
  const { msg, onYes, yesLabel, noLabel, onNo } = overlay;
  const yesText = yesLabel || "Confirmar";
  const noText = noLabel || "Cancelar";
  const yesClass = overlay.yesStyle === "accent" ? "footer-btn primary" : (overlay.yesStyle === "danger" ? "footer-btn danger" : "footer-btn");
  root.innerHTML = `<div class="sheet-backdrop" id="sheetBackdrop"></div>
  <div class="sheet" role="dialog" aria-modal="true">
    <div class="sheet-handle"></div>
    <div class="sheet-header">
      <div class="sheet-date" style="font-size:16px;">${escapeHtml(msg)}</div>
      <button class="icon-btn" id="sheetClose" aria-label="fechar">${ICONS.close}</button>
    </div>
    <div class="sheet-actions">
      <button class="${yesClass}" id="confirmYes">${escapeHtml(yesText)}</button>
      <button class="footer-btn" id="confirmNo">${escapeHtml(noText)}</button>
    </div>
  </div>`;
  document.getElementById("sheetBackdrop").addEventListener("click", closeOverlay);
  document.getElementById("sheetClose").addEventListener("click", closeOverlay);
  document.getElementById("confirmNo").addEventListener("click", () => {
    overlay = null;
    renderOverlay();
    if(typeof onNo === "function") onNo();
  });
  document.getElementById("confirmYes").addEventListener("click", () => {
    overlay = null;
    renderOverlay();
    onYes();
  });
}

function renderImportChoiceOverlay(root){
  const { parsed } = overlay;
  const nTreinos = (parsed.order || []).length;
  const nSessoes = Object.keys(parsed.sessions || {}).length;
  root.innerHTML = `<div class="sheet-backdrop" id="sheetBackdrop"></div>
  <div class="sheet" role="dialog" aria-modal="true" aria-label="Importar backup">
    <div class="sheet-handle"></div>
    <div class="sheet-header">
      <div class="sheet-date">Importar backup</div>
      <button class="icon-btn" id="sheetClose" aria-label="fechar">${ICONS.close}</button>
    </div>
    <p style="font-size:13px;color:var(--text-muted);margin:0 0 18px;line-height:1.5;">
      Este arquivo tem ${nTreinos} treino(s) e ${nSessoes} dia(s) registrado(s).
    </p>
    <div class="sheet-actions">
      <button class="cta-btn" id="importMergeBtn">Mesclar com os dados atuais</button>
      <button class="footer-btn danger" id="importReplaceBtn">${ICONS.trash} Substituir tudo</button>
      <button class="undo-link" id="importCancelBtn" style="margin-top:2px;">cancelar</button>
    </div>
  </div>`;
  document.getElementById("sheetBackdrop").addEventListener("click", closeOverlay);
  document.getElementById("sheetClose").addEventListener("click", closeOverlay);
  document.getElementById("importCancelBtn").addEventListener("click", closeOverlay);
  document.getElementById("importMergeBtn").addEventListener("click", () => mergeImportData(parsed));
  document.getElementById("importReplaceBtn").addEventListener("click", () => replaceImportData(parsed));
}

async function mergeImportData(parsed){
  takeAutoBackup(true);
  migrateSessions(parsed);
  migrateSettings(parsed);
  migrateActiveSession(parsed);
  migrateWorkouts(parsed);
  Object.keys(parsed.sessions || {}).forEach(k => {
    const incoming = parsed.sessions[k] || [];
    const existing = sessionsFor(k);
    const seen = new Set(existing.map(x => x.id));
    const merged = existing.slice();
    incoming.forEach(x => {
      if(!seen.has(x.id)) merged.push(x);
    });
    state.sessions[k] = merged;
  });
  const seenBody = new Set((state.body || []).map(b => b.id));
  (parsed.body || []).forEach(b => { if(!seenBody.has(b.id)) state.body.push(b); });
  initExIdCounter();
  initRestCounter();
  overlay = null;
  render();
  await persist();
  showToast("Sessões mescladas");
}
async function replaceImportData(parsed, msg){
  takeAutoBackup(true);
  state = { ...state, ...parsed };
  state.body = Array.isArray(parsed.body) ? parsed.body : [];
  migrateSessions(state);
  migrateSettings(state);
  migrateActiveSession(state);
  migrateWorkouts(state);
  state.activeSession = { letter: null, state: "idle", elapsedMs: 0, startedAt: null, startedDate: null };
  state.settings.restTimerActive = null;
  initExIdCounter();
  initRestCounter();
  overlay = null;
  render();
  await persist();
  showToast(msg || "Backup importado");
}

async function exportBackup(){
  try{
    const data = JSON.stringify(state, null, 2);
    const res = await deliverFile(data, `meus-treinos-backup-${todayKey()}.json`, "application/json", "Backup Meus Treinos");
    if(res === "cancelled") return;
    state.settings.lastBackupAt = new Date().toISOString();
    render();
    await persist();
    showToast(res === "shared" ? "Backup compartilhado" : "Backup exportado");
  }catch(e){
    showToast("Não foi possível exportar");
  }
}

async function exportCsv(){
  try{
    const rows = [["data","ordem","treino","exercicio","tipo","serie","tipo_serie","peso_kg","reps","minutos","feito","rpe","nota_exercicio","nota_treino"]];
    Object.keys(state.sessions).sort().forEach(dateKey => {
      const arr = sessionsFor(dateKey);
      arr.forEach((sess, sessIdx) => {
        const letter = sess.letter;
        const log = sess.log || {};
        const w = state.workouts[letter];
        const exMap = {};
        (w?.exercises || []).forEach(ex => exMap[ex.id] = { name: ex.name || ex.id, type: ex.type || "strength" });
        Object.keys(log).forEach(exId => {
          const meta = exMap[exId] || { name: exId, type: "strength" };
          const xm = (sess.meta && sess.meta[exId]) || {};
          (log[exId] || []).forEach((s, i) => {
            rows.push([
              dateKey,
              String(sessIdx + 1),
              letter || "",
              meta.name,
              meta.type === "cardio" ? "cardio" : "forca",
              String(i+1),
              SET_TYPE_NAME[s.type] || "normal",
              s.weight != null ? String(s.weight).replace(".", ",") : "",
              s.reps != null ? String(s.reps) : "",
              s.minutes != null ? String(s.minutes) : "",
              s.done ? "1" : "0",
              i === 0 && xm.rpe != null ? String(xm.rpe) : "",
              i === 0 && xm.note ? xm.note : "",
              i === 0 && sess.note ? sess.note : ""
            ]);
          });
        });
      });
    });
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
    const res = await deliverFile("\ufeff" + csv, `meus-treinos-${todayKey()}.csv`, "text/csv;charset=utf-8", "Treinos em CSV");
    if(res === "cancelled") return;
    showToast(res === "shared" ? "CSV compartilhado" : "CSV exportado");
  }catch(e){
    showToast("Não foi possível exportar CSV");
  }
}

const TAB_DEFS = [
  { id: "inicio", label: "Início", icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/></svg>` },
  { id: "treinos", label: "Treinos", icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5h11v11h-11z"/><path d="M3 9v6M21 9v6M1 10.5v3M23 10.5v3"/></svg>` },
  { id: "historico", label: "Histórico", icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>` },
  { id: "progresso", label: "Progresso", icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5M4 19h16M8 15l3-4 3 3 4-6"/></svg>` },
  { id: "ajustes", label: "Ajustes", icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.6 1Z"/></svg>` }
];
function renderTabBar(){
  let bar = document.getElementById("tabBar");
  if(!currentUser){ if(bar) bar.innerHTML = ""; return; }
  if(!bar) return;
  bar.innerHTML = TAB_DEFS.map(t => `<button type="button" class="tab-btn ${activeTab === t.id ? "active" : ""}" data-role="gotab" data-tab="${t.id}" aria-label="${t.label}" aria-current="${activeTab === t.id ? "page" : "false"}">
    <span class="tab-btn-icon">${t.icon}</span>
    <span class="tab-btn-label">${t.label}</span>
  </button>`).join("");
  bar.querySelectorAll('[data-role="gotab"]').forEach(btn => {
    btn.addEventListener("click", () => {
      if(btn.dataset.tab === activeTab) return;
      haptic(6);
      goTab(btn.dataset.tab);
    });
  });
}

/* ---------- tela de login (fiel ao mockup) ---------- */
function renderLogin(){
  const app = document.getElementById("app");
  const bar = document.getElementById("tabBar");
  if(bar) bar.innerHTML = "";
  if(!app) return;
  app.innerHTML = `<div class="login-wrap">
        <div class="login-logo">
      <img src="icons/logo.png" alt="Meus Treinos" onerror="this.style.display='none'; this.parentElement.innerHTML='${ICONS.logoDumbbell.replace(/'/g, "\\'")}';">
    </div>
    <h1 class="login-title">Meus <span class="accent">Treinos</span></h1>

    <div class="login-form">
      <label class="login-input-wrap">
        <span class="li-icon">${ICONS.user}</span>
        <input type="text" id="loginUser" autocomplete="username" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Usuário">
      </label>

      <label class="login-input-wrap">
        <span class="li-icon">${ICONS.lock}</span>
        <input type="password" id="loginPass" autocomplete="current-password" placeholder="Senha">
        <button type="button" class="pw-toggle" id="loginPwToggle" aria-label="mostrar senha">${ICONS.eye}</button>
      </label>

      <label class="login-keep-row">
        <span class="switch lg">
          <input type="checkbox" id="loginKeep" checked>
          <span class="slider"></span>
        </span>
        <span>Manter conectado</span>
      </label>

      ${authError ? `<div class="login-error">${escapeHtml(authError)}</div>` : ""}

      <button type="button" class="cta-btn" id="loginSubmit" ${authBusy ? "disabled" : ""}>${authBusy ? "Entrando…" : "Entrar"}</button>
    </div>
  </div>`;

  const userInput = document.getElementById("loginUser");
  const passInput = document.getElementById("loginPass");
  const submit = async () => {
    if(authBusy) return;
    await doLogin(userInput.value, passInput.value, document.getElementById("loginKeep").checked);
  };
  document.getElementById("loginSubmit").addEventListener("click", submit);
  [userInput, passInput].forEach(inp => inp.addEventListener("keydown", (e) => { if(e.key === "Enter") submit(); }));
  document.getElementById("loginPwToggle").addEventListener("click", () => {
    const show = passInput.type === "password";
    passInput.type = show ? "text" : "password";
    document.getElementById("loginPwToggle").innerHTML = show ? ICONS.eyeOff : ICONS.eye;
  });
  if(userInput && !authBusy) userInput.focus();
}

async function bootApp(){
  const app = document.getElementById("app");
  if(app) app.innerHTML = `<div class="loading">carregando…</div>`;
  await loadData();
  takeAutoBackup(false);
  render();
  requestPersistentStorage();
  if(state.settings.restTimerActive){
    if(state.settings.restTimerActive.endsAt <= Date.now()){
      state.settings.restTimerActive = null;
      persist();
    } else {
      renderRestTimer();
    }
  }
  checkReminder();
}

function checkReminder(){
  const r = state.settings.reminder;
  if(!r || !r.enabled) return;
  if(sessionsFor(todayKey()).length) return;
  const now = new Date();
  const hhmm = pad(now.getHours()) + ":" + pad(now.getMinutes());
  if(hhmm < r.time) return;
  if(r.lastNotifiedDate === todayKey()) return;
  r.lastNotifiedDate = todayKey();
  persist();
  const next = nextWorkoutLetter();
  const msg = `Não esqueça: hoje é ${workoutLabel(next)}.`;
  if(typeof Notification !== "undefined" && Notification.permission === "granted"){
    try{ new Notification("Hora do treino", { body: msg }); }catch(e){}
  }
  showToast(msg);
}

function setUpdateButtonState(state){
  const btn = document.getElementById("checkUpdateBtn");
  const label = document.getElementById("checkUpdateLabel");
  const icon = document.getElementById("checkUpdateIcon");
  if(!btn || !label || !icon) return;
  btn.classList.remove("loading", "success");
  if(state === "idle"){
    label.textContent = "Atualizar";
    icon.innerHTML = ICONS.refresh;
  } else if(state === "loading"){
    label.textContent = "Verificando…";
    icon.innerHTML = "";
    btn.classList.add("loading");
  } else if(state === "success"){
    label.textContent = "Atualizado";
    icon.innerHTML = ICONS.checkSm;
    btn.classList.add("success");
    setTimeout(() => setUpdateButtonState("idle"), 1800);
  } else if(state === "available"){
    label.textContent = "Atualizar";
    icon.innerHTML = ICONS.refresh;
    btn.classList.add("success");
  }
}

let updateBusy = false;
let reloadingForUpdate = false;
let lastBgCheck = 0;

function reloadOnce(){
  if(reloadingForUpdate) return;
  reloadingForUpdate = true;
  try {
    const u = new URL(window.location.href);
    u.searchParams.set("_u", String(Date.now()));
    window.location.replace(u.toString());
  } catch(e){
    window.location.reload();
  }
}
try {
  const cleanUrl = new URL(window.location.href);
  if(cleanUrl.searchParams.has("_u")){
    cleanUrl.searchParams.delete("_u");
    window.history.replaceState(null, "", cleanUrl.pathname + (cleanUrl.search || "") + cleanUrl.hash);
  }
} catch(e){}

function swRequest(worker, msg, timeoutMs){
  return new Promise((resolve) => {
    if(!worker){ resolve(null); return; }
    const ch = new MessageChannel();
    const timer = setTimeout(() => resolve(null), timeoutMs);
    ch.port1.onmessage = (e) => { clearTimeout(timer); resolve(e.data); };
    try { worker.postMessage(msg, [ch.port2]); }
    catch(e){ clearTimeout(timer); resolve(null); }
  });
}

function waitInstalled(worker, timeoutMs){
  return new Promise((resolve) => {
    if(!worker || worker.state === "installed" || worker.state === "activated" || worker.state === "redundant"){ resolve(); return; }
    const timer = setTimeout(resolve, timeoutMs);
    worker.addEventListener("statechange", () => {
      if(worker.state === "installed" || worker.state === "activated" || worker.state === "redundant"){
        clearTimeout(timer);
        resolve();
      }
    });
  });
}

function applyWaitingUpdate(reg){
  if(reg && reg.waiting){
    reg.waiting.postMessage("SKIP_WAITING");
    setTimeout(reloadOnce, 2500);
  } else {
    reloadOnce();
  }
}

async function checkAssetsChanged(){
  const worker = (swRegistration && swRegistration.active) || navigator.serviceWorker.controller;
  const res = await swRequest(worker, { type: "REFRESH_ASSETS" }, 20000);
  if(!res || !res.ok) return null;
  const versionDiffers = !!(res.remoteVersion && res.remoteVersion !== APP_VERSION);
  return res.changed || versionDiffers;
}

async function checkForUpdate(){
  if(!("serviceWorker" in navigator)){
    showToast("Atualização não suportada neste navegador");
    return;
  }
  if(!swRegistration){
    showToast("Serviço ainda iniciando — tente em instantes");
    return;
  }
  if(updateBusy) return;
  updateBusy = true;
  setUpdateButtonState("loading");
  haptic(6);
  try {
    try { await swRegistration.update(); } catch(e){}
    if(swRegistration.installing) await waitInstalled(swRegistration.installing, 15000);
    if(swRegistration.waiting){
      setUpdateButtonState("available");
      showToast("Atualizando…");
      applyWaitingUpdate(swRegistration);
      return;
    }
    const changed = await checkAssetsChanged();
    if(changed === true){
      setUpdateButtonState("available");
      showToast("Atualizando…");
      setTimeout(reloadOnce, 500);
      return;
    }
    if(changed === false){
      setUpdateButtonState("success");
      showToast("Você já está na versão mais recente");
      haptic([10, 30, 10]);
      return;
    }
    throw new Error("sem resposta do service worker");
  } catch(e){
    console.error("[update]", e);
    setUpdateButtonState("idle");
    showToast("Não foi possível verificar agora. Confira a conexão.");
  } finally {
    updateBusy = false;
  }
}

async function backgroundUpdateCheck(){
  if(!swRegistration || updateBusy || updateAvailable) return;
  const now = Date.now();
  if(now - lastBgCheck < 3 * 60 * 1000) return;
  lastBgCheck = now;
  try { await swRegistration.update(); } catch(e){ return; }
  if(swRegistration.waiting || swRegistration.installing) return;
  const changed = await checkAssetsChanged();
  if(changed === true && !updateAvailable){
    updateAvailable = { reload: true };
    render();
  }
}

async function hardRefreshApp(){
  try {
    if("serviceWorker" in navigator){
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }
    if(window.caches){
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
  } catch(e){ console.error("[hardRefresh]", e); }
  reloadOnce();
}

function attachHandlers(){
  const $ = (id) => document.getElementById(id);

  const statusBtn = $("statusBtn");
  if(statusBtn) statusBtn.addEventListener("click", () => {
    haptic(6);
    const dateKey = todayKey();
    const arr = sessionsFor(dateKey);
    if(arr.length >= 2){
      openDaySessionsSheet(dateKey);
    } else {
      openDaySheet(dateKey);
    }
  });

  const startBtn = $("startBtn");
  if(startBtn && !startBtn.disabled) startBtn.addEventListener("click", () => {
    const a = state.activeSession;
    let letter;
    if(a.state === "running" || a.state === "paused"){
      letter = a.letter;
    } else {
      const arr = sessionsFor(todayKey());
      letter = arr.length ? arr[arr.length - 1].letter : nextWorkoutLetter();
    }
    if(!letter) return;
    startActiveSession(letter);
  });

  const stopBtn = $("stopBtn");
  if(stopBtn && !stopBtn.disabled) stopBtn.addEventListener("click", pauseActiveSession);

  const endBtn = $("endBtn");
  if(endBtn && !endBtn.disabled) endBtn.addEventListener("click", () => {
    openConfirm("Finalizar o treino?", endActiveSession, {
      yesLabel: "Treino Concluído",
      noLabel: "Cancelar Treino",
      yesStyle: "accent",
      onNo: cancelActiveSession
    });
  });

  const editTodayBtn = $("editTodayBtn");
  if(editTodayBtn) editTodayBtn.addEventListener("click", () => {
    const dateKey = todayKey();
    const arr = sessionsFor(dateKey);
    if(arr.length >= 2){
      openDaySessionsSheet(dateKey);
    } else {
      openDaySheet(dateKey);
    }
  });

  const undoBtn = $("undoTodayBtn");
  if(undoBtn) undoBtn.addEventListener("click", undoToday);

  const addSecondBtn = $("addSecondBtn");
  if(addSecondBtn) addSecondBtn.addEventListener("click", () => {
    haptic(6);
    openWorkoutPicker(todayKey());
  });

  const retryLoadBtn = $("retryLoadBtn");
  if(retryLoadBtn) retryLoadBtn.addEventListener("click", async () => {
    showToast("Carregando…");
    await loadData();
    render();
  });

  const updateBtn = $("updateBtn");
  if(updateBtn) updateBtn.addEventListener("click", () => {
    if(!updateAvailable) return;
    haptic(6);
    showToast("Atualizando…");
    applyWaitingUpdate(updateAvailable.waiting ? updateAvailable : null);
  });

  const backupNowBtn = $("backupNowBtn");
  if(backupNowBtn) backupNowBtn.addEventListener("click", exportBackup);

  const logoutBtn = $("logoutBtn");
  if(logoutBtn) logoutBtn.addEventListener("click", () => {
    openConfirm("Sair da sua conta?", doLogout, { yesLabel: "Sair", noLabel: "Cancelar", yesStyle: "danger" });
  });

  const qaWeight = $("qaWeight");
  if(qaWeight) qaWeight.addEventListener("click", () => { haptic(6); openBodySheet(); });

  const qaHistory = $("qaHistory");
  if(qaHistory) qaHistory.addEventListener("click", () => { haptic(6); goTab("historico"); });

  const goLastRecord = $("goLastRecord");
  if(goLastRecord) goLastRecord.addEventListener("click", () => { haptic(6); goTab("progresso"); });

  document.querySelectorAll('[data-role="openhistoryday"]').forEach(el => {
    el.addEventListener("click", () => {
      haptic(6);
      const dk = el.dataset.datekey;
      const arr = sessionsFor(dk);
      if(arr.length >= 2) openDaySessionsSheet(dk); else openDaySheet(dk);
    });
  });

  document.querySelectorAll('[data-role="togglesection"]').forEach(el => {
    el.addEventListener("click", async () => {
      const id = el.dataset.section;
      haptic(6);
      const before = el.getBoundingClientRect().top;
      if(!state.settings.collapsedSections) state.settings.collapsedSections = {};
      if(state.settings.collapsedSections[id]) delete state.settings.collapsedSections[id];
      else state.settings.collapsedSections[id] = true;
      render();
      const again = document.querySelector(`[data-role="togglesection"][data-section="${id}"]`);
      if(again) window.scrollBy(0, again.getBoundingClientRect().top - before);
      await persist();
    });
  });

  document.querySelectorAll('[data-role="wname"]').forEach(el => {
    el.addEventListener("change", async () => {
      state.workouts[el.dataset.letter].name = el.value || workoutLabel(el.dataset.letter);
      await persist();
    });
    el.addEventListener("keydown", (ev) => { if(ev.key === "Enter") el.blur(); });
  });

  document.querySelectorAll('[data-role="moveup"],[data-role="movedown"]').forEach(el => {
    el.addEventListener("click", async () => {
      haptic(6);
      const key = el.dataset.letter;
      const dir = el.dataset.role === "moveup" ? -1 : 1;
      const idx = state.order.indexOf(key);
      const newIdx = idx + dir;
      if(newIdx < 0 || newIdx >= state.order.length) return;
      [state.order[idx], state.order[newIdx]] = [state.order[newIdx], state.order[idx]];
      render();
      await persist();
    });
  });

  document.querySelectorAll('[data-role="delworkout"]').forEach(el => {
    el.addEventListener("click", async () => {
      const key = el.dataset.letter;
      const wk = state.workouts[key];
      if(!wk) return;
      const idx = state.order.indexOf(key);
      const label = wk.isRest ? "Descanso" : `Treino ${key}`;
      state.order = state.order.filter(l => l !== key);
      delete state.workouts[key];
      render();
      await persist();
      showToast(`${label} removido`, { label: "Desfazer", fn: async () => {
        if(state.workouts[key]) return;
        state.workouts[key] = wk;
        state.order.splice(Math.min(idx, state.order.length), 0, key);
        render();
        await persist();
        showToast("Restaurado");
      }});
    });
  });

  document.querySelectorAll('[data-role="dupworkout"]').forEach(el => {
    el.addEventListener("click", async () => {
      haptic(6);
      const src = state.workouts[el.dataset.letter];
      const nl = nextAvailableLetter();
      if(!src || !nl){ showToast("Limite atingido"); return; }
      state.workouts[nl] = {
        name: `${src.name} (cópia)`,
        exercises: (src.exercises || []).map(e => ({ ...JSON.parse(JSON.stringify(e)), id: newExId() }))
      };
      state.order.push(nl);
      render();
      await persist();
      showToast(`Duplicado como Treino ${nl}`);
    });
  });

  document.querySelectorAll('[data-role="extype"]').forEach(el => {
    el.addEventListener("click", async () => {
      haptic(6);
      const w = state.workouts[el.dataset.letter];
      const ex = w.exercises.find(e => e.id === el.dataset.exid);
      if(!ex) return;
      const newType = el.dataset.type;
      if((ex.type || "strength") === newType) return;
      ex.type = newType;
      render();
      await persist();
    });
  });

  document.querySelectorAll('[data-role="exsets"], [data-role="exreps"], [data-role="exrest"], [data-role="exmins"]').forEach(el => {
    el.addEventListener("change", async () => {
      const w = state.workouts[el.dataset.letter];
      const ex = w.exercises.find(e => e.id === el.dataset.exid);
      if(!ex) return;
      const r = el.dataset.role;
      if(r === "exsets") ex.sets = el.value;
      if(r === "exreps") ex.reps = el.value;
      if(r === "exrest") ex.rest = el.value;
      if(r === "exmins") ex.mins = el.value;
      await persist();
    });
  });

  document.querySelectorAll('[data-role="openexname"]').forEach(el => {
    el.addEventListener("click", () => {
      haptic(6);
      openExercisePicker({ mode: "rename", letter: el.dataset.letter, exId: el.dataset.exid });
    });
  });

  document.querySelectorAll('[data-role="delex"]').forEach(el => {
    el.addEventListener("click", async () => {
      const w = state.workouts[el.dataset.letter];
      if(!w) return;
      const idx = w.exercises.findIndex(e => e.id === el.dataset.exid);
      if(idx < 0) return;
      const removed = w.exercises[idx];
      w.exercises.splice(idx, 1);
      render();
      await persist();
      showToast("Exercício removido", { label: "Desfazer", fn: async () => {
        const w2 = state.workouts[el.dataset.letter];
        if(!w2 || w2.exercises.some(e => e.id === removed.id)) return;
        w2.exercises.splice(Math.min(idx, w2.exercises.length), 0, removed);
        render();
        await persist();
        showToast("Restaurado");
      }});
    });
  });

  document.querySelectorAll('[data-role="exmove"]').forEach(el => {
    el.addEventListener("click", async () => {
      haptic(6);
      const w = state.workouts[el.dataset.letter];
      if(!w) return;
      const idx = w.exercises.findIndex(e => e.id === el.dataset.exid);
      const ni = idx + parseInt(el.dataset.dir, 10);
      if(idx < 0 || ni < 0 || ni >= w.exercises.length) return;
      [w.exercises[idx], w.exercises[ni]] = [w.exercises[ni], w.exercises[idx]];
      render();
      await persist();
    });
  });
  document.querySelectorAll('[data-role="exss"]').forEach(el => {
    el.addEventListener("click", async () => {
      haptic(6);
      const w = state.workouts[el.dataset.letter];
      const ex = w && w.exercises.find(e => e.id === el.dataset.exid);
      if(!ex) return;
      if(ex.ss) delete ex.ss; else ex.ss = true;
      render();
      await persist();
    });
  });
  document.querySelectorAll('[data-role="exlink"]').forEach(el => {
    el.addEventListener("click", async () => {
      const w = state.workouts[el.dataset.letter];
      const ex = w && w.exercises.find(e => e.id === el.dataset.exid);
      if(!ex) return;
      const v = window.prompt("Link de vídeo ou técnica (deixe vazio para remover):", ex.link || "");
      if(v === null) return;
      const clean = safeUrl(v);
      if(v.trim() && !clean){ showToast("Link inválido"); return; }
      if(clean) ex.link = clean; else delete ex.link;
      render();
      await persist();
    });
  });

  document.querySelectorAll('[data-role="viewprogress"]').forEach(el => {
    if(el.disabled) return;
    el.addEventListener("click", () => openProgressSheet(el.dataset.exid, el.dataset.name));
  });

  document.querySelectorAll('[data-role="addex"]').forEach(el => {
    el.addEventListener("click", () => {
      haptic(6);
      openExercisePicker({ mode: "add", letter: el.dataset.letter });
    });
  });

  const addWorkoutBtn = $("addWorkoutBtn");
  if(addWorkoutBtn) addWorkoutBtn.addEventListener("click", async () => {
    const nextLetter = nextAvailableLetter();
    if(!nextLetter){ showToast("Limite atingido"); return; }
    state.order.push(nextLetter);
    state.workouts[nextLetter] = { name: `Treino ${nextLetter}`, exercises: [] };
    render();
    await persist();
  });

  const addRestBtn = $("addRestBtn");
  if(addRestBtn) addRestBtn.addEventListener("click", async () => {
    const key = newRestKey();
    state.order.push(key);
    state.workouts[key] = { name: "Descanso", exercises: [], isRest: true };
    render();
    await persist();
  });

  document.querySelectorAll('[data-role="calday"]').forEach(el => {
    el.addEventListener("click", () => {
      const dateKey = el.dataset.key;
      const arr = sessionsFor(dateKey);
      if(arr.length >= 2){
        openDaySessionsSheet(dateKey);
      } else {
        openDaySheet(dateKey);
      }
    });
  });
  const calPrevBtn = $("calPrevBtn");
  if(calPrevBtn) calPrevBtn.addEventListener("click", () => {
    historyMonth.setMonth(historyMonth.getMonth() - 1);
    render();
  });
  const calNextBtn = $("calNextBtn");
  if(calNextBtn) calNextBtn.addEventListener("click", () => {
    const todayD = new Date();
    const isCurrent = historyMonth.getFullYear() === todayD.getFullYear() && historyMonth.getMonth() === todayD.getMonth();
    if(isCurrent) return;
    historyMonth.setMonth(historyMonth.getMonth() + 1);
    render();
  });

  const reminderToggle = $("reminderToggle");
  if(reminderToggle) reminderToggle.addEventListener("change", async (e) => {
    state.settings.reminder.enabled = e.target.checked;
    state.settings.reminder.lastNotifiedDate = null;
    if(e.target.checked && typeof Notification !== "undefined" && Notification.permission === "default"){
      try{ await Notification.requestPermission(); }catch(err){}
    }
    render();
    await persist();
  });
  const reminderTime = $("reminderTime");
  if(reminderTime) reminderTime.addEventListener("change", async (e) => {
    state.settings.reminder.time = e.target.value;
    await persist();
  });

  document.querySelectorAll('[data-role="settheme"]').forEach(el => {
    el.addEventListener("click", () => {
      haptic(6);
      applyTheme(el.dataset.theme);
      render();
    });
  });

  const restMinus = $("restMinus");
  const restPlus = $("restPlus");
  const updateRest = async (delta) => {
    haptic(6);
    state.settings.restDuration = Math.max(15, Math.min(600, (state.settings.restDuration || 90) + delta));
    const v = $("restDurationVal");
    if(v) v.textContent = state.settings.restDuration + "s";
    await persist();
  };
  if(restMinus) restMinus.addEventListener("click", () => updateRest(-15));
  if(restPlus) restPlus.addEventListener("click", () => updateRest(15));

  const weekStartToggle = $("weekStartToggle");
  if(weekStartToggle) weekStartToggle.addEventListener("change", async (e) => {
    state.settings.weekStartsMonday = e.target.checked;
    render();
    await persist();
  });

  const checkUpdateBtn = $("checkUpdateBtn");
  if(checkUpdateBtn) checkUpdateBtn.addEventListener("click", checkForUpdate);
  const hardRefreshBtn = $("hardRefreshBtn");
  if(hardRefreshBtn) hardRefreshBtn.addEventListener("click", () => {
    openConfirm("Limpar o cache do app e recarregar? Seus treinos e histórico continuam salvos.", hardRefreshApp, { yesLabel: "Recarregar", yesStyle: "accent" });
  });

  const exportBtn = $("exportBtn");
  if(exportBtn) exportBtn.addEventListener("click", exportBackup);
  const exportCsvBtn = $("exportCsvBtn");
  if(exportCsvBtn) exportCsvBtn.addEventListener("click", exportCsv);

  const importBtn = $("importBtn");
  if(importBtn) importBtn.addEventListener("click", () => $("importFile").click());
  const importFile = $("importFile");
  if(importFile) importFile.addEventListener("change", async (ev) => {
    const file = ev.target.files[0];
    if(!file) return;
    try{
      const text = await file.text();
      const parsed = JSON.parse(text);
      const v = validateBackup(parsed);
      if(!v.ok){ showToast(v.error); ev.target.value = ""; return; }
      openImportChoice(parsed);
    }catch(e){
      showToast("Arquivo inválido");
    }
    ev.target.value = "";
  });

  document.querySelectorAll('[data-role="setunit"]').forEach(el => {
    el.addEventListener("click", async () => {
      haptic(6);
      state.settings.unit = el.dataset.unit === "lb" ? "lb" : "kg";
      render();
      await persist();
    });
  });
  const keepAwakeToggle = $("keepAwakeToggle");
  if(keepAwakeToggle) keepAwakeToggle.addEventListener("change", async (e) => {
    state.settings.keepAwake = e.target.checked;
    syncWakeLock();
    await persist();
  });
  document.querySelectorAll('[data-role="statsrange"]').forEach(el => {
    el.addEventListener("click", () => {
      haptic(6);
      statsRange = parseInt(el.dataset.days, 10) || 30;
      render();
    });
  });
  document.querySelectorAll('[data-role="openrecord"]').forEach(el => {
    el.addEventListener("click", () => openProgressSheet(el.dataset.exid, el.dataset.name));
  });
  const openBodyBtn = $("openBodyBtn");
  if(openBodyBtn) openBodyBtn.addEventListener("click", () => { haptic(6); openBodySheet(); });
  document.querySelectorAll('[data-role="delbody"]').forEach(el => {
    el.addEventListener("click", async () => {
      const idx = state.body.findIndex(b => b.id === el.dataset.id);
      if(idx < 0) return;
      const removed = state.body[idx];
      state.body.splice(idx, 1);
      render();
      await persist();
      showToast("Registro removido", { label: "Desfazer", fn: async () => {
        if(state.body.some(b => b.id === removed.id)) return;
        state.body.push(removed);
        render();
        await persist();
        showToast("Restaurado");
      }});
    });
  });
  const openBackupsBtn = $("openBackupsBtn");
  if(openBackupsBtn) openBackupsBtn.addEventListener("click", () => { haptic(6); openBackupsSheet(); });

  const syncRetryBtn = $("syncRetryBtn");
  if(syncRetryBtn) syncRetryBtn.addEventListener("click", () => persist());
}

function nextAvailableLetter(){
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for(const ch of alphabet){
    if(!state.order.includes(ch)) return ch;
  }
  return null;
}

(async function init(){
  applyTheme(getThemePref());
  initRouter();

  if(!storageAvailable()){
    loadFailed = true;
    currentUser = readSession();
    if(currentUser) render(); else renderLogin();
    showToast("Armazenamento indisponível (modo privado?).");
    return;
  }

  currentUser = readSession();
  if(currentUser){
    activeTab = getTabFromHash() || "inicio";
    await bootApp();
  } else {
    renderLogin();
  }

  document.addEventListener("visibilitychange", () => {
    if(document.visibilityState === "visible" && currentUser){
      checkReminder();
      renderRestTimer();
      renderHeroClock();
      syncWakeLock();
      backgroundUpdateCheck();
    }
  });
  setInterval(() => { if(currentUser) checkReminder(); }, 5 * 60 * 1000);
  window.addEventListener("beforeunload", () => {
    if(!currentUser) return;
    try { window.localStorage.setItem(storageKey(), JSON.stringify(state)); } catch(e){}
  });

  if(window.matchMedia){
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    if(mq.addEventListener) mq.addEventListener("change", () => {
      if(getThemePref() === "auto") applyTheme("auto");
    });
  }
})();

if("serviceWorker" in navigator){
  window.addEventListener("load", async () => {
    try{
      const reg = await navigator.serviceWorker.register("sw.js", { updateViaCache: "none" });
      swRegistration = reg;
      if(reg.waiting && navigator.serviceWorker.controller){
        updateAvailable = reg;
        render();
      }
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if(!newWorker) return;
        newWorker.addEventListener("statechange", () => {
          if(newWorker.state === "installed" && navigator.serviceWorker.controller){
            updateAvailable = reg;
            render();
          }
        });
      });
      const btn = document.getElementById("checkUpdateBtn");
      if(btn && !btn.dataset.bound){
        btn.dataset.bound = "1";
        btn.addEventListener("click", checkForUpdate);
      }
      setTimeout(backgroundUpdateCheck, 2500);
    }catch(e){}
  });
  navigator.serviceWorker.addEventListener("controllerchange", reloadOnce);
}