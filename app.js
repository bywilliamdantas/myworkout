const STORAGE_KEY = "gym-data";
const THEME_KEY = "gym-theme";
const APP_VERSION = "v2.2";
const PALETTE = ["#ff5a1f", "#3d9dff", "#30d158", "#ffd60a", "#bf5af2", "#64d2ff"];

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
const REST_COLOR = "#5b5b5b";
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
  eye: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.6 21.6 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a21.6 21.6 0 0 1-3.22 4.44M1 1l22 22"/><path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5a3.5 3.5 0 0 0 2.47-1.03"/></svg>`,
  dumbbell: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5h11v11h-11z"/><path d="M3 9v6M21 9v6M1 10.5v3M23 10.5v3"/></svg>`,
  timer: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/></svg>`,
  cardio: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/></svg>`,
  refresh: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>`,
  play: `<svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor"><path d="M8 5v14l11-7Z"/></svg>`,
  pause: `<svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>`
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
      meta.setAttribute("content", dark ? "#000000" : "#f4f4f6");
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
    restDuration: 90,
    weekStartsMonday: false,
    restTimerActive: null
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
  if(s.settings.restDuration === undefined) s.settings.restDuration = 90;
  if(s.settings.weekStartsMonday === undefined) s.settings.weekStartsMonday = false;
  if(s.settings.restTimerActive === undefined) s.settings.restTimerActive = null;
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
    const raw = await withRetry(() => window.localStorage.getItem(STORAGE_KEY), 3, 200);
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
    await withRetry(() => window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)), 3, 250);
    saveInFlight = false;
    updateSyncUI("ok");
  }catch(e){
    saveInFlight = false;
    updateSyncUI("err");
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
  else if(s === "err"){ row.classList.remove("hidden"); dot.classList.add("err"); text.textContent = "falha ao salvar"; retryBtn.style.display = "inline"; }
}

let toastTimer;
function showToast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
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
function nextWorkoutLetter(){
  const last = lastSessionEntry();
  if(!last) return state.order[0];
  const idx = state.order.indexOf(last.letter);
  if(idx === -1) return state.order[0];
  return state.order[(idx + 1) % state.order.length];
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
    if(ky === y && km === m) c += sessionsFor(key).length;
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
    if(dt >= start) c += sessionsFor(key).length;
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
      const sets = arr[j].log && arr[j].log[exId];
      if(Array.isArray(sets) && sets.length){
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
      if(Array.isArray(sets)) allSets.push(...sets);
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

function render(){
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

  let html = "";
  if(banners) html += `<div class="banners">${banners}</div>`;

  const todayDuration = totalDurationForDay(todayKey());

  let eyebrowText = "Próximo";
  if(isRunning) eyebrowText = "Treinando agora";
  else if(isPaused) eyebrowText = "Pausado";
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

  html += `<div class="card" id="heroCard">
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

  html += `<div class="card stats-card">
    <div class="stat streak"><div class="stat-num" data-count="${streak}">0</div><div class="stat-label">dias seguidos</div></div>
    <div class="stat"><div class="stat-num" data-count="${thisWeek}">0</div><div class="stat-label">essa semana</div></div>
    <div class="stat"><div class="stat-num" data-count="${total}">0</div><div class="stat-label">no mês</div></div>
  </div>`;

  html += `<div class="section-title-row">
    <p class="section-title" style="margin:0;">Meus treinos</p>
    <button class="toggle-visibility-btn" id="toggleWorkoutsBtn" aria-label="${state.settings.workoutsCollapsed ? "mostrar treinos" : "ocultar treinos"}">
      ${state.settings.workoutsCollapsed ? ICONS.eyeOff + " Mostrar" : ICONS.eye + " Ocultar"}
    </button>
  </div>`;

  if(state.settings.workoutsCollapsed){
    html += `<div class="card" style="text-align:center;color:var(--text-muted);font-size:12.5px;padding:22px 16px;"><p style="margin:0;line-height:1.5;">Seus treinos estão ocultos.</p></div>`;
  } else {
    state.order.forEach((key, idx) => {
      const w = state.workouts[key];
      const color = colorFor(key, state.order);
      html += `<div class="card workout-card" data-letter="${key}">
        <div class="workout-head">
          <div class="reorder-btns">
            <button class="reorder-btn" data-role="moveup" data-letter="${key}" ${idx===0?"disabled":""} aria-label="mover para cima">${ICONS.up}</button>
            <button class="reorder-btn" data-role="movedown" data-letter="${key}" ${idx===state.order.length-1?"disabled":""} aria-label="mover para baixo">${ICONS.down}</button>
          </div>
          <div class="workout-chip" style="background:${color}${w.isRest?";color:#f5f5f5":""}">${w.isRest ? ICONS.moonSmall : key}</div>
          <input class="workout-title-input" data-role="wname" data-letter="${key}" value="${escapeAttr(w.name)}" placeholder="${w.isRest ? "Nome do descanso" : "Nome do treino"}" aria-label="Nome de ${w.isRest ? "descanso" : "treino " + key}">
          <span class="edit-pencil">${ICONS.pencil}</span>
          ${state.order.length > 1 ? `<button class="icon-btn" data-role="delworkout" data-letter="${key}" aria-label="remover ${w.isRest ? "descanso" : "treino " + key}">${ICONS.close}</button>` : ""}
        </div>
        ${w.isRest ? `<div class="rest-note">Dia de descanso — sem exercícios para registrar.</div>` : `
        ${w.exercises.length > 0 ? w.exercises.map(ex => {
          const cardio = isCardio(ex);
          const hasHist = exerciseHistory(ex.id).length > 0;
          return `
          <div class="exercise-row" data-exid="${ex.id}">
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

    html += `<div class="row-2">
      <button class="add-workout-btn" id="addWorkoutBtn">${ICONS.plus} Novo treino</button>
      <button class="add-workout-btn" id="addRestBtn">${ICONS.moonSmall} Descanso</button>
    </div>`;
  }

  html += `<p class="section-title" style="margin-top:24px;">Histórico</p>`;
  const legendWorkouts = state.order.filter(k => !state.workouts[k]?.isRest);
  const hasRest = state.order.some(k => state.workouts[k]?.isRest);
  html += `<div class="card">
    <div class="legend">
      ${legendWorkouts.map(l => `<div class="legend-item"><span class="legend-dot" style="background:${colorFor(l, state.order)}"></span>${l}</div>`).join("")}
      ${hasRest ? `<div class="legend-item"><span class="legend-dot" style="background:${REST_COLOR}"></span>descanso</div>` : ""}
      <div class="legend-item"><span class="legend-dot" style="background:var(--dot-off)"></span>não treinou</div>
    </div>
    ${buildMonthCalendar(historyMonth)}
  </div>`;

  const r = state.settings.reminder;
  html += `<p class="section-title" style="margin-top:24px;">Lembretes</p>
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
  </div>`;

  const themePref = getThemePref();
  html += `<p class="section-title" style="margin-top:24px;">Preferências</p>
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
      <div style="display:flex;flex-direction:column;gap:2px;">
        <span>Versão do app</span>
        <span id="appVersionText" style="font-size:11px;color:var(--text-muted);">${APP_VERSION}</span>
      </div>
      <button class="footer-btn" id="checkUpdateBtn" style="flex:none;padding:9px 14px;">
        <span id="checkUpdateIcon">${ICONS.refresh}</span>
        <span id="checkUpdateLabel">Atualizar</span>
      </button>
    </div>
  </div>`;

  html += `<div class="footer-actions">
    <button class="footer-btn" id="exportBtn">${ICONS.download} Exportar</button>
    <button class="footer-btn" id="exportCsvBtn">${ICONS.download} CSV</button>
    <button class="footer-btn" id="importBtn">${ICONS.upload} Importar</button>
  </div>
  <input type="file" id="importFile" accept="application/json">
  <div class="app-footer">William Dantas - ©2026</div>`;

  app.innerHTML = html;
  attachHandlers();
  runCountUp();
  renderOverlay();
  renderRestTimer();
  renderHeroClock();
  startHeroClockTicker();
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
    const style = letter ? `background:${colorFor(letter, state.order)};color:${state.workouts[letter]?.isRest ? "#f5f5f5" : "#0a0a0a"}` : "";
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

  overlay = {
    type: "day",
    mode: opts.mode || (sessionId ? "edit" : "new"),
    dateKey,
    sessionId,
    letter,
    log,
    startedAt
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
  overlay = null;
  if(sheetClockInterval){ clearInterval(sheetClockInterval); sheetClockInterval = null; }
  renderOverlay();
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
          <div class="spi-chip" style="background:${colorFor(k,state.order)}${isRest?";color:#f5f5f5":""}">${isRest ? ICONS.moonSmall : k}</div>
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
      // inicia o novo treino com o cronômetro e abre o sheet em modo "new"
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
    // busca: lista plana com todos os nomes (biblioteca + já usados) que combinam
    const allNames = getAllExerciseNames();
    const filtered = allNames.filter(n => n.toLowerCase().includes(q));
    const exactMatch = allNames.some(n => n.toLowerCase() === q);
    if(!exactMatch) html += customRowHtml();
    filtered.forEach(n => { html += itemHtml(n); });
  } else {
    // sem busca: navegação por grupo muscular
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
          <div class="sds-chip" style="background:${colorFor(sess.letter, state.order)}${isRest?";color:#f5f5f5":""}">${isRest ? ICONS.moonSmall : sess.letter}</div>
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
      openConfirm("Remover esta sessão?", async () => {
        const arr2 = sessionsFor(dateKey).filter(s => s.id !== sessionId);
        if(arr2.length) state.sessions[dateKey] = arr2;
        else delete state.sessions[dateKey];
        render();
        await persist();
        showToast("Sessão removida");
      });
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
        return `<button class="chip" data-role="sheetletter" data-letter="${k}" aria-pressed="${active}" style="${active ? `background:${colorFor(k,state.order)};color:${wk?.isRest?"#f5f5f5":"#0a0a0a"};border-color:transparent` : ""}">${label}</button>`;
      }).join("")}
    </div>
    ${w.isRest
      ? `<div class="sheet-empty">Dia de descanso — nada para registrar.</div>`
      : (w.exercises.length ? `<div class="sheet-exercises">${w.exercises.map(ex => {
          if(isCardio(ex)) return renderCardioRow(ex, log, dateKey);
          return renderStrengthRow(ex, log, dateKey);
        }).join("")}</div>` : `<div class="empty-state">
            <div class="empty-icon">${ICONS.dumbbell}</div>
            <p class="empty-title">Treino sem exercícios</p>
            <p class="empty-sub">Adicione exercícios na seção "Meus treinos" antes de registrar.</p>
          </div>`)
    }
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
      if(role === "wplus" || role === "wminus"){
        const step = 2.5;
        const cur = set.weight != null ? Number(set.weight) : 0;
        const next = Math.max(0, roundToStep(cur + (role === "wplus" ? step : -step), 0.1));
        set.weight = Math.round(next * 1000) / 1000;
        autoSaveOverlay();
        const el = root.querySelector(`[data-field="weight"][data-exid="${exid}"][data-setidx="${setidx}"]`);
        if(el){ el.value = fmtWeight(set.weight); }
      } else if(role === "rplus" || role === "rminus"){
        const cur = set.reps != null ? Number(set.reps) : 0;
        set.reps = Math.max(0, cur + (role === "rplus" ? 1 : -1));
        autoSaveOverlay();
        const el = root.querySelector(`[data-field="reps"][data-exid="${exid}"][data-setidx="${setidx}"]`);
        if(el){ el.value = set.reps; }
      } else if(role === "mplus" || role === "mminus"){
        const cur = set.minutes != null ? Number(set.minutes) : 0;
        set.minutes = Math.max(0, cur + (role === "mplus" ? 1 : -1));
        autoSaveOverlay();
        const el = root.querySelector(`[data-field="minutes"][data-exid="${exid}"][data-setidx="${setidx}"]`);
        if(el){ el.textContent = set.minutes; }
      }
    });
  });

  root.querySelectorAll('input.step-value.input[data-field="weight"]').forEach(inp => {
    inp.addEventListener("input", () => {
      const exid = inp.dataset.exid;
      const setidx = parseInt(inp.dataset.setidx, 10);
      const sets = overlay.log[exid];
      if(!sets || !sets[setidx]) return;
      const parsed = parseNum(inp.value);
      sets[setidx].weight = parsed;
      autoSaveOverlay();
    });
    inp.addEventListener("blur", () => {
      const exid = inp.dataset.exid;
      const setidx = parseInt(inp.dataset.setidx, 10);
      const sets = overlay.log[exid];
      if(!sets || !sets[setidx]) return;
      const w = sets[setidx].weight;
      inp.value = w == null ? "" : fmtWeight(w);
    });
  });

  root.querySelectorAll('input.step-value.input[data-field="reps"]').forEach(inp => {
    inp.addEventListener("input", () => {
      const exid = inp.dataset.exid;
      const setidx = parseInt(inp.dataset.setidx, 10);
      const sets = overlay.log[exid];
      if(!sets || !sets[setidx]) return;
      const parsed = parseNum(inp.value);
      sets[setidx].reps = parsed;
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

  root.querySelectorAll('[data-role="toggleSet"]').forEach(btn => {
    btn.addEventListener("click", () => {
      const exid = btn.dataset.exid;
      const setidx = parseInt(btn.dataset.setidx, 10);
      const sets = overlay.log[exid];
      if(!sets || !sets[setidx]) return;
      const set = sets[setidx];
      set.done = !set.done;
      const row = btn.closest(".sheet-set");
      row.classList.toggle("done", set.done);
      autoSaveOverlay();
      if(set.done){
        haptic([10,30,10]);
        startRestTimer(exid);
      } else {
        haptic(6);
      }
    });
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
    // reaproveita a sessão aberta criada pelo startActiveSession, se existir
    const a3 = state.activeSession;
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
    state.sessions[dk] = arr;
    haptic([10,40,10]);
    closeOverlay();
    render();
    persist();
    showToast("Séries salvas");
  });

  enableSheetDrag(root.querySelector("#daySheet"), root.querySelector("#sheetHandle"));
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
  if(!sess.startedAt) sess.startedAt = startedAt;
  state.sessions[dateKey] = arr;
  persist();
}

function renderStrengthRow(ex, log, dateKey){
  const last = lastLoggedValue(ex.id, dateKey);
  const sets = ensureSetsForExercise(log, ex.id, ex.sets);
  const defaultReps = parseInt(ex.reps, 10) || null;
  const restSec = restForExercise(ex.id);
  const lastLabel = last
    ? `última vez: ${last.weight != null ? fmtWeight(last.weight) + " kg" : "—"} × ${last.reps != null ? last.reps : "—"}`
    : "primeira vez registrando";
  return `<div class="sheet-ex-row" data-exid="${ex.id}">
    <div class="sheet-ex-name">${escapeHtml(ex.name || "Exercício")}</div>
    <div class="sheet-ex-last">${lastLabel} · descanso ${restSec}s</div>
    <div class="sheet-sets" data-exid="${ex.id}">
      ${sets.map((s, i) => {
        const initialWeight = s.weight != null ? s.weight : (last?.weight != null ? last.weight : 0);
        const initialReps = s.reps != null ? s.reps : (defaultReps != null ? defaultReps : (last?.reps != null ? last.reps : 10));
        return `<div class="sheet-set ${s.done ? "done" : ""}" data-setidx="${i}">
          <div class="sheet-set-num">${i+1}</div>
          <div class="step-group">
            <button class="step-btn" data-role="wminus" data-exid="${ex.id}" data-setidx="${i}" aria-label="diminuir peso">−</button>
            <input class="step-value input" type="text" inputmode="decimal"
              data-field="weight" data-exid="${ex.id}" data-setidx="${i}"
              value="${escapeAttr(fmtWeight(initialWeight))}"
              aria-label="peso">
            <span class="step-unit">kg</span>
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
  </div>`;
}

function renderCardioRow(ex, log, dateKey){
  const last = lastLoggedValue(ex.id, dateKey);
  const sets = ensureCardioSets(log, ex.id);
  const defaultMin = parseInt(ex.mins, 10) || null;
  const lastLabel = last && last.minutes != null
    ? `última vez: ${last.minutes} min`
    : "primeira vez registrando";
  return `<div class="sheet-ex-row" data-exid="${ex.id}">
    <div class="sheet-ex-name">${ICONS.cardio} ${escapeHtml(ex.name || "Cardio")}</div>
    <div class="sheet-ex-last">${lastLabel}</div>
    <div class="sheet-sets" data-exid="${ex.id}">
      ${sets.map((s, i) => {
        const initialMin = s.minutes != null ? s.minutes : (defaultMin != null ? defaultMin : (last?.minutes != null ? last.minutes : 20));
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
function renderRestTimer(){
  const root = document.getElementById("restTimerRoot");
  if(!root) return;
  const t = state.settings.restTimerActive;
  if(!t){ root.innerHTML = ""; if(restTimerInterval){ clearInterval(restTimerInterval); restTimerInterval = null; } return; }

  const remain = Math.max(0, Math.ceil((t.endsAt - Date.now()) / 1000));
  if(remain <= 0){
    if(restTimerInterval){ clearInterval(restTimerInterval); restTimerInterval = null; }
    state.settings.restTimerActive = null;
    persist();
    haptic([200,100,200]);
    if(typeof Notification !== "undefined" && Notification.permission === "granted"){
      try { new Notification("Descanso acabou", { body: "Bora pra próxima série." }); } catch(e){}
    }
    showToast("Descanso acabou — próxima série!");
    root.innerHTML = "";
    return;
  }

  const pct = remain / t.duration;
  const C = 2 * Math.PI * 18;
  const offset = C * (1 - pct);

  root.innerHTML = `<div class="rest-timer">
    <div class="rest-ring">
      <svg viewBox="0 0 44 44">
        <circle class="ring-bg" cx="22" cy="22" r="18"/>
        <circle class="ring-fg" cx="22" cy="22" r="18"
          stroke-dasharray="${C}" stroke-dashoffset="${offset}"/>
      </svg>
    </div>
    <div class="rest-info">
      <div class="rest-label">descanso</div>
      <div class="rest-time" id="restTime">${pad(Math.floor(remain/60))}:${pad(remain%60)}</div>
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
    if(state.settings.restTimerActive){
      state.settings.restTimerActive.endsAt += 30000;
      state.settings.restTimerActive.duration += 30;
      persist();
      renderRestTimer();
    }
  });

  if(!restTimerInterval){
    restTimerInterval = setInterval(() => renderRestTimer(), 1000);
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
    const chart = buildLineChart(hist, "kg");
    body = `<div class="chart-wrap">${chart || `<div class="sheet-empty">Só há repetições registradas, sem peso, até agora.</div>`}</div>` +
      `<div class="progress-list">${hist.slice().reverse().map(p => {
        const [, mo, da] = p.date.split("-").map(Number);
        return `<div class="progress-row"><span>${da}/${mo}</span><span>${p.weight != null ? fmtWeight(p.weight) + " kg" : "—"}</span><span>${p.reps != null ? p.reps + " reps" : "—"}</span></div>`;
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
  const yesClass = overlay.yesStyle === "accent" ? "footer-btn primary" : "footer-btn";
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
  migrateSessions(parsed);
  migrateSettings(parsed);
  migrateActiveSession(parsed);
  migrateWorkouts(parsed);
  Object.keys(parsed.sessions || {}).forEach(k => {
    const incoming = parsed.sessions[k] || [];
    const existing = sessionsFor(k);
    const seen = new Set(existing.map(s => s.id));
    const merged = existing.slice();
    incoming.forEach(s => {
      if(!seen.has(s.id)) merged.push(s);
    });
    state.sessions[k] = merged;
  });
  initExIdCounter();
  initRestCounter();
  overlay = null;
  render();
  await persist();
  showToast("Sessões mescladas");
}
async function replaceImportData(parsed){
  state = { ...state, ...parsed };
  migrateSessions(state);
  migrateSettings(state);
  migrateActiveSession(state);
  migrateWorkouts(state);
  initExIdCounter();
  initRestCounter();
  overlay = null;
  render();
  await persist();
  showToast("Backup importado");
}

async function exportBackup(){
  try{
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meus-treinos-backup-${todayKey()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    state.settings.lastBackupAt = new Date().toISOString();
    render();
    await persist();
    showToast("Backup exportado");
  }catch(e){
    showToast("Não foi possível exportar");
  }
}

function exportCsv(){
  try{
    const rows = [["data","ordem","treino","exercicio","tipo","serie","peso_kg","reps","minutos","feito"]];
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
          (log[exId] || []).forEach((s, i) => {
            rows.push([
              dateKey,
              String(sessIdx + 1),
              letter || "",
              meta.name,
              meta.type === "cardio" ? "cardio" : "forca",
              String(i+1),
              s.weight != null ? String(s.weight).replace(".", ",") : "",
              s.reps != null ? String(s.reps) : "",
              s.minutes != null ? String(s.minutes) : "",
              s.done ? "1" : "0"
            ]);
          });
        });
      });
    });
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meus-treinos-${todayKey()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("CSV exportado");
  }catch(e){
    showToast("Não foi possível exportar CSV");
  }
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

async function checkForUpdate(){
  if(!("serviceWorker" in navigator)){
    showToast("Atualização não suportada neste navegador");
    return;
  }
  if(!swRegistration){
    showToast("Serviço ainda iniciando — tente em instantes");
    return;
  }
  setUpdateButtonState("loading");
  haptic(6);
  try {
    if(swRegistration.waiting){
      setUpdateButtonState("available");
      swRegistration.waiting.postMessage("SKIP_WAITING");
      return;
    }
    await swRegistration.update();
    await new Promise(r => setTimeout(r, 1200));
    if(swRegistration.waiting){
      setUpdateButtonState("available");
      swRegistration.waiting.postMessage("SKIP_WAITING");
    } else if(swRegistration.installing){
      const installing = swRegistration.installing;
      installing.addEventListener("statechange", () => {
        if(installing.state === "installed"){
          setUpdateButtonState("available");
          if(swRegistration.waiting) swRegistration.waiting.postMessage("SKIP_WAITING");
        }
      });
    } else {
      setUpdateButtonState("success");
      showToast("Você já está na versão mais recente");
      haptic([10, 30, 10]);
    }
  } catch(e){
    console.error("[update]", e);
    setUpdateButtonState("idle");
    showToast("Não foi possível verificar agora");
  }
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
      // pega a última sessão do dia se houver, senão o próximo do ciclo
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
    if(updateAvailable && updateAvailable.waiting){
      updateAvailable.waiting.postMessage("SKIP_WAITING");
    }
  });

  const backupNowBtn = $("backupNowBtn");
  if(backupNowBtn) backupNowBtn.addEventListener("click", exportBackup);

  const toggleWorkoutsBtn = $("toggleWorkoutsBtn");
  if(toggleWorkoutsBtn) toggleWorkoutsBtn.addEventListener("click", async () => {
    state.settings.workoutsCollapsed = !state.settings.workoutsCollapsed;
    render();
    await persist();
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
    el.addEventListener("click", () => {
      const key = el.dataset.letter;
      const label = state.workouts[key]?.isRest ? "o descanso" : `o Treino ${key}`;
      openConfirm(`Remover ${label} do ciclo?`, async () => {
        state.order = state.order.filter(l => l !== key);
        delete state.workouts[key];
        render();
        await persist();
      });
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
    el.addEventListener("click", () => {
      openConfirm("Remover este exercício?", async () => {
        const w = state.workouts[el.dataset.letter];
        w.exercises = w.exercises.filter(e => e.id !== el.dataset.exid);
        render();
        await persist();
      });
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
      if(!parsed.order || !parsed.workouts) throw new Error("formato inválido");
      openImportChoice(parsed);
    }catch(e){
      showToast("Arquivo inválido");
    }
    ev.target.value = "";
  });

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

  if(!storageAvailable()){
    loadFailed = true;
    render();
    showToast("Armazenamento indisponível (modo privado?).");
    return;
  }
  await loadData();
  render();
  if(state.settings.restTimerActive){
    if(state.settings.restTimerActive.endsAt <= Date.now()){
      state.settings.restTimerActive = null;
      persist();
    } else {
      renderRestTimer();
    }
  }
  checkReminder();
  document.addEventListener("visibilitychange", () => {
    if(document.visibilityState === "visible"){
      checkReminder();
      renderRestTimer();
      renderHeroClock();
    }
  });
  setInterval(checkReminder, 5 * 60 * 1000);
  window.addEventListener("beforeunload", () => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e){}
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
      const reg = await navigator.serviceWorker.register("sw.js");
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
    }catch(e){}
  });
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if(refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}