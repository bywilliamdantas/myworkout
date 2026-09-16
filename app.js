const STORAGE_KEY = "gym-data";
const PALETTE = ["#ff5a1f", "#3d9dff", "#30d158", "#ffd60a", "#bf5af2", "#64d2ff"];
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
  left: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`,
  right: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.6 21.6 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a21.6 21.6 0 0 1-3.22 4.44M1 1l22 22"/><path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5a3.5 3.5 0 0 0 2.47-1.03"/></svg>`,
  dumbbell: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5h11v11h-11z"/><path d="M3 9v6M21 9v6M1 10.5v3M23 10.5v3"/></svg>`,
  timer: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/></svg>`
};

// ---------- utils ----------
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
  if(v == null) return "";
  const n = Number(v);
  if(isNaN(n)) return String(v);
  return (Math.round(n * 100) / 100).toString().replace(".", ",");
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

// ---------- state ----------
let state = {
  order: ["A","B","C"],
  workouts: {
    A: { name: "Treino A", exercises: [] },
    B: { name: "Treino B", exercises: [] },
    C: { name: "Treino C", exercises: [] }
  },
  sessions: {},
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
let historyMonth = new Date(); historyMonth.setDate(1); historyMonth.setHours(0,0,0,0);
let restTimerInterval = null;
let sheetClockInterval = null;

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

// ---------- migrations ----------
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
    s.sessions[k] = migrateSessionEntry(s.sessions[k]);
  });
}
function migrateSettings(s){
  if(!s.settings) s.settings = {};
  const d = state.settings;
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

// ---------- storage ----------
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

// ---------- colors / labels ----------
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
function badgeContent(key){
  return state.workouts[key]?.isRest ? ICONS.moon : key;
}

// ---------- derived ----------
function sessionLetter(key){
  const e = state.sessions[key];
  if(!e) return null;
  return typeof e === "string" ? e : e.letter;
}
function sessionLog(key){
  const e = state.sessions[key];
  if(!e || typeof e === "string") return {};
  return e.log || {};
}
function lastSessionEntry(){
  const keys = Object.keys(state.sessions).sort();
  if(keys.length === 0) return null;
  const lastDate = keys[keys.length - 1];
  return { date: lastDate, letter: sessionLetter(lastDate) };
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
function totalSessions(){ return Object.keys(state.sessions).length; }
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
    if(dt >= start) c++;
  }
  return c;
}
function lastLoggedValue(exId, beforeKey){
  const keys = Object.keys(state.sessions).filter(k => k < beforeKey).sort();
  for(let i = keys.length - 1; i >= 0; i--){
    const log = sessionLog(keys[i]);
    const sets = log && log[exId];
    if(Array.isArray(sets) && sets.length){
      const last = sets[sets.length - 1];
      if(last && (last.weight != null || last.reps != null)) return last;
    }
  }
  return null;
}
function exerciseHistory(exId){
  return Object.keys(state.sessions).sort().map(k => {
    const log = sessionLog(k);
    const sets = log && log[exId];
    if(!Array.isArray(sets) || sets.length === 0) return null;
    const weights = sets.map(s => s.weight).filter(w => w != null);
    const reps = sets.map(s => s.reps).filter(r => r != null);
    const maxWeight = weights.length ? Math.max(...weights) : null;
    const totalReps = reps.length ? reps.reduce((a,b) => a+b, 0) : null;
    const volume = sets.reduce((sum, s) => sum + ((s.weight||0) * (s.reps||0)), 0);
    if(maxWeight == null && totalReps == null) return null;
    return { date: k, weight: maxWeight, reps: totalReps, volume };
  }).filter(Boolean);
}
function daysSince(iso){
  if(!iso) return Infinity;
  const then = new Date(iso).getTime();
  if(isNaN(then)) return Infinity;
  return (Date.now() - then) / (1000*60*60*24);
}

// duração do treino a partir de uma sessão
function sessionDuration(session){
  if(!session || !session.startedAt || !session.endedAt) return null;
  const ms = session.endedAt - session.startedAt;
  if(ms <= 0) return null;
  return ms;
}

// descanso específico do exercício (procura em qualquer treino)
function restForExercise(exId){
  for(const w of Object.values(state.workouts)){
    const ex = (w.exercises || []).find(e => e.id === exId);
    if(ex){
      const n = parseInt(ex.rest, 10);
      if(!isNaN(n) && n > 0) return n;
      break;
    }
  }
  return state.settings.restDuration || 90;
}

// ---------- render: app ----------
function render(){
  const app = document.getElementById("app");
  const next = nextWorkoutLetter();
  const doneToday = sessionLetter(todayKey());
  const streak = computeStreak();
  const total = totalSessions();
  const thisWeek = sessionsThisWeek();
  const now = new Date();
  const weekdayLabel = WEEKDAY_FULL[now.getDay()];
  const heroKey = doneToday || next;
  const heroW = state.workouts[heroKey] || { name: heroKey, exercises: [] };

  let banners = "";
  if(loadFailed){
    banners += `<div class="banner"><span>Não foi possível carregar seus dados salvos.</span><button id="retryLoadBtn">tentar de novo</button></div>`;
  }
  if(updateAvailable){
    banners += `<div class="banner info"><span>Nova versão do app disponível.</span><button id="updateBtn">atualizar</button></div>`;
  }
  const backupDays = daysSince(state.settings.lastBackupAt);
  const backupDue = total > 0 && backupDays >= 14;
  if(backupDue){
    const daysTxt = backupDays === Infinity ? "Você ainda não exportou um backup" : `Já fazem ${Math.floor(backupDays)} dias sem backup`;
    banners += `<div class="banner info"><span>${daysTxt}.</span><button id="backupNowBtn">exportar</button></div>`;
  }

  let html = "";
  if(banners) html += `<div class="banners">${banners}</div>`;

  // ----- duração do treino de hoje -----
  const todaySession = state.sessions[todayKey()];
  const todayDuration = sessionDuration(todaySession);

  // ----- hero -----
  html += `<div class="card" id="heroCard">
    <p class="eyebrow">${doneToday ? "Treino de hoje" : "Próximo"} · ${weekdayLabel}</p>
    <div class="hero-top">
      <div class="letter-badge" id="heroBadge" style="background:${colorFor(heroKey, state.order)}${state.workouts[heroKey]?.isRest ? ";color:#f5f5f5" : ""}">${badgeContent(heroKey)}</div>
      <div class="hero-info">
        <div class="workout-name">${escapeHtml(heroW.name || workoutLabel(heroKey))}</div>
        <div class="workout-sub">${doneToday
          ? (todayDuration ? `concluído em ${fmtDuration(todayDuration)}` : "concluído hoje")
          : state.workouts[next]?.isRest ? "dia de recuperação" : "toque para registrar"}</div>
      </div>
    </div>
    ${doneToday
      ? `<button class="cta-btn done" disabled>${ICONS.check} ${state.workouts[doneToday]?.isRest ? "Descanso registrado" : "Treino " + doneToday + " concluído"}</button>
         <div class="hero-links">
           <button class="undo-link" id="editTodayBtn">editar registro</button>
           <button class="undo-link" id="undoTodayBtn">desfazer</button>
         </div>`
      : `<button class="cta-btn" id="markDoneBtn">${state.workouts[next]?.isRest ? "Marcar descanso como feito" : "Começar Treino " + next}</button>`
    }
  </div>`;

  // ----- stats -----
  html += `<div class="card stats-card">
    <div class="stat streak"><div class="stat-num" data-count="${streak}">0</div><div class="stat-label">dias seguidos</div></div>
    <div class="stat"><div class="stat-num" data-count="${thisWeek}">0</div><div class="stat-label">essa semana</div></div>
    <div class="stat"><div class="stat-num" data-count="${total}">0</div><div class="stat-label">total geral</div></div>
  </div>`;

  // ----- workouts -----
  html += `<div class="section-title-row">
    <p class="section-title" style="margin:0;">Meus treinos</p>
    <button class="toggle-visibility-btn" id="toggleWorkoutsBtn" aria-label="${state.settings.workoutsCollapsed ? "mostrar treinos" : "ocultar treinos"}">
      ${state.settings.workoutsCollapsed ? ICONS.eyeOff + " Mostrar" : ICONS.eye + " Ocultar"}
    </button>
  </div>`;

  if(state.settings.workoutsCollapsed){
    html += `<div class="card collapsed-note"><p>Seus treinos estão ocultos. Toque em "Mostrar" para editar.</p></div>`;
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
          const hasHist = exerciseHistory(ex.id).length > 0;
          return `
          <div class="exercise-row" data-exid="${ex.id}">
            <div class="ex-row-top">
              <input class="ex-name-input" data-role="exname" data-letter="${key}" data-exid="${ex.id}" value="${escapeAttr(ex.name)}" placeholder="Ex: Supino reto" aria-label="Nome do exercício">
              <button class="progress-btn" data-role="viewprogress" data-exid="${ex.id}" data-name="${escapeAttr(ex.name || "Exercício")}" ${hasHist ? "" : "disabled"} aria-label="Ver progresso">${ICONS.chart}</button>
              <button class="ex-del" data-role="delex" data-letter="${key}" data-exid="${ex.id}" aria-label="remover exercício">${ICONS.close}</button>
            </div>
            <div class="ex-row-bottom">
              <label class="ex-field"><span>séries</span><input data-role="exsets" data-letter="${key}" data-exid="${ex.id}" value="${escapeAttr(ex.sets)}" placeholder="4" inputmode="numeric" aria-label="Séries"></label>
              <label class="ex-field"><span>reps</span><input data-role="exreps" data-letter="${key}" data-exid="${ex.id}" value="${escapeAttr(ex.reps)}" placeholder="12" inputmode="numeric" aria-label="Repetições"></label>
              <label class="ex-field"><span>descanso (s)</span><input data-role="exrest" data-letter="${key}" data-exid="${ex.id}" value="${escapeAttr(ex.rest || "")}" placeholder="90" inputmode="numeric" aria-label="Descanso em segundos"></label>
            </div>
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

  // ----- history -----
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

  // ----- reminder -----
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
    <p class="reminder-note">O lembrete funciona enquanto o app está aberto. O iPhone não permite alarmes em segundo plano para apps instalados via Safari sem um servidor de notificações próprio.</p>
  </div>`;

  // ----- preferences -----
  html += `<p class="section-title" style="margin-top:24px;">Preferências</p>
  <div class="card">
    <div class="reminder-row">
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
  </div>`;

  html += `<div class="footer-actions">
    <button class="footer-btn" id="exportBtn">${ICONS.download} Exportar</button>
    <button class="footer-btn" id="exportCsvBtn">${ICONS.download} CSV</button>
    <button class="footer-btn" id="importBtn">${ICONS.upload} Importar</button>
  </div>
  <input type="file" id="importFile" accept="application/json">
  <div class="hint">toque em um exercício ou dia do histórico para editar</div>`;

  app.innerHTML = html;
  attachHandlers();
  runCountUp();
  renderOverlay();
  renderRestTimer();
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

// ---------- calendar ----------
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
    const letter = sessionLetter(key);
    const isToday = key === todayKey();
    const isFuture = d > todayD;
    const style = letter ? `background:${colorFor(letter, state.order)};color:${state.workouts[letter]?.isRest ? "#f5f5f5" : "#0a0a0a"}` : "";
    const cls = "cal-cell" + (letter ? " filled" : "") + (isToday ? " today" : "") + (isFuture ? " future" : "");
    const label = `${day} de ${MONTH_NAMES_FULL[month]}${letter ? " — " + workoutLabel(letter) : (isFuture ? "" : " — sem treino")}`;
    if(isFuture){
      cells += `<div class="${cls}" aria-label="${escapeAttr(label)}"><span>${day}</span></div>`;
    } else {
      cells += `<button class="${cls}" style="${style}" data-role="calday" data-key="${key}" aria-label="${escapeAttr(label)}"><span>${day}</span></button>`;
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

// ---------- overlay ----------
function openDaySheet(dateKey){
  const existing = state.sessions[dateKey];
  const letter = existing ? sessionLetter(dateKey) : (dateKey === todayKey() ? nextWorkoutLetter() : state.order[0]);
  const existingLog = existing ? sessionLog(dateKey) : {};
  // se já existe sessão com startedAt, reusa; senão marca agora
  const startedAt = existing?.startedAt || Date.now();
  overlay = {
    type: "day",
    dateKey,
    letter,
    log: JSON.parse(JSON.stringify(existingLog)),
    startedAt,
    isEditing: !!existing
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
function openConfirm(msg, onYes){
  overlay = { type: "confirm", msg, onYes };
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
}

// ---------- day sheet ----------
function ensureSetsForExercise(log, exId, defaultSets){
  if(!Array.isArray(log[exId])){
    const n = Math.max(1, parseInt(defaultSets, 10) || 1);
    log[exId] = Array.from({length: n}, () => ({ weight: null, reps: null, done: false }));
  }
  return log[exId];
}

function renderDayOverlay(root){
  const { dateKey, letter, log, startedAt } = overlay;
  const [y,m,dd] = dateKey.split("-").map(Number);
  const d = new Date(y, m-1, dd);
  const isToday = dateKey === todayKey();
  const dateLabel = isToday ? "Hoje" : `${WEEKDAY_FULL[d.getDay()]}, ${dd} de ${MONTH_NAMES_FULL[m-1]}`;
  const existing = !!state.sessions[dateKey];
  const w = state.workouts[letter] || { exercises: [] };

  const elapsed = Math.floor((Date.now() - startedAt) / 1000);

  let html = `<div class="sheet-backdrop" id="sheetBackdrop"></div>`;
  html += `<div class="sheet" role="dialog" aria-modal="true" aria-label="Registrar treino" id="daySheet">
    <div class="sheet-handle" id="sheetHandle"></div>
    <div class="sheet-header">
      <div class="sheet-date">${escapeHtml(dateLabel)}</div>
      <button class="icon-btn" id="sheetClose" aria-label="fechar">${ICONS.close}</button>
    </div>
    <div class="sheet-clock" id="sheetClock">
      <span class="clock-icon">${ICONS.timer}</span>
      <span class="clock-time" id="sheetClockTime">${fmtClock(elapsed)}</span>
      <span class="clock-label">em andamento</span>
    </div>
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
                    <div class="step-value" data-field="weight" data-exid="${ex.id}" data-setidx="${i}" data-value="${initialWeight}">${fmtWeight(initialWeight)}</div>
                    <span class="step-unit">kg</span>
                    <button class="step-btn" data-role="wplus" data-exid="${ex.id}" data-setidx="${i}" aria-label="aumentar peso">+</button>
                  </div>
                  <div class="step-group">
                    <button class="step-btn" data-role="rminus" data-exid="${ex.id}" data-setidx="${i}" aria-label="diminuir reps">−</button>
                    <div class="step-value" data-field="reps" data-exid="${ex.id}" data-setidx="${i}" data-value="${initialReps}">${initialReps}</div>
                    <button class="step-btn" data-role="rplus" data-exid="${ex.id}" data-setidx="${i}" aria-label="aumentar reps">+</button>
                  </div>
                  <button class="sheet-set-check" data-role="toggleSet" data-exid="${ex.id}" data-setidx="${i}" aria-label="marcar série ${i+1}">${ICONS.checkSm}</button>
                </div>`;
              }).join("")}
            </div>
            <button class="add-set-btn" data-role="addset" data-exid="${ex.id}">+ adicionar série</button>
          </div>`;
        }).join("")}</div>` : `<div class="empty-state">
            <div class="empty-icon">${ICONS.dumbbell}</div>
            <p class="empty-title">Treino sem exercícios</p>
            <p class="empty-sub">Adicione exercícios na seção "Meus treinos" antes de registrar.</p>
          </div>`)
    }
    <div class="sheet-actions">
      <button class="cta-btn" id="sheetSave">Salvar</button>
      ${existing ? `<button class="footer-btn danger" id="sheetRemove">${ICONS.trash} Remover registro do dia</button>` : ""}
    </div>
  </div>`;
  root.innerHTML = html;

  document.getElementById("sheetBackdrop").addEventListener("click", closeOverlay);
  document.getElementById("sheetClose").addEventListener("click", closeOverlay);

  // cronômetro do treino
  if(sheetClockInterval){ clearInterval(sheetClockInterval); }
  sheetClockInterval = setInterval(() => {
    const el = document.getElementById("sheetClockTime");
    if(!el){ return; }
    const sec = Math.floor((Date.now() - startedAt) / 1000);
    el.textContent = fmtClock(sec);
  }, 1000);

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
        const cur = set.weight != null ? set.weight : 0;
        set.weight = Math.max(0, roundToStep(cur + (role === "wplus" ? step : -step), step));
        const el = root.querySelector(`[data-field="weight"][data-exid="${exid}"][data-setidx="${setidx}"]`);
        if(el){ el.textContent = fmtWeight(set.weight); el.dataset.value = set.weight; }
      } else if(role === "rplus" || role === "rminus"){
        const cur = set.reps != null ? set.reps : 0;
        set.reps = Math.max(0, cur + (role === "rplus" ? 1 : -1));
        const el = root.querySelector(`[data-field="reps"][data-exid="${exid}"][data-setidx="${setidx}"]`);
        if(el){ el.textContent = set.reps; el.dataset.value = set.reps; }
      }
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
      if(set.done){
        haptic([10,30,10]);
        startRestTimer(exid);
      } else {
        haptic(6);
      }
    });
  });

  root.querySelectorAll('[data-role="addset"]').forEach(btn => {
    btn.addEventListener("click", () => {
      haptic(6);
      const exid = btn.dataset.exid;
      const sets = overlay.log[exid] || [];
      const last = sets[sets.length - 1] || {};
      sets.push({ weight: last.weight ?? null, reps: last.reps ?? null, done: false });
      overlay.log[exid] = sets;
      renderOverlay();
    });
  });

  document.getElementById("sheetSave").addEventListener("click", saveDaySheet);
  const removeBtn = document.getElementById("sheetRemove");
  if(removeBtn) removeBtn.addEventListener("click", () => {
    openConfirm("Remover o registro deste dia?", removeDaySheetEntry);
  });

  enableSheetDrag(root.querySelector("#daySheet"), root.querySelector("#sheetHandle"));
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

async function saveDaySheet(){
  const { dateKey, letter, log, startedAt, isEditing } = overlay;
  Object.keys(log).forEach(exId => {
    log[exId] = (log[exId] || []).filter(s => s.weight != null || s.reps != null || s.done);
  });
  state.sessions[dateKey] = {
    letter,
    log,
    startedAt,
    endedAt: Date.now()
  };
  haptic([10,40,10]);
  overlay = null;
  if(sheetClockInterval){ clearInterval(sheetClockInterval); sheetClockInterval = null; }
  render();
  await persist();
  const label = workoutLabel(letter);
  const dur = state.sessions[dateKey].endedAt - state.sessions[dateKey].startedAt;
  const durTxt = dur > 60000 ? ` · ${fmtDuration(dur)}` : "";
  showToast(dateKey === todayKey() ? `${label[0].toUpperCase()}${label.slice(1)} registrado${durTxt}` : "Registro salvo");
  if(dateKey === todayKey()){
    const badge = document.getElementById("heroBadge");
    if(badge){
      badge.classList.add("pulse");
      setTimeout(() => badge.classList.remove("pulse"), 500);
    }
  }
}
async function removeDaySheetEntry(){
  delete state.sessions[overlay.dateKey];
  overlay = null;
  if(sheetClockInterval){ clearInterval(sheetClockInterval); sheetClockInterval = null; }
  render();
  await persist();
  showToast("Registro removido");
}
async function undoToday(){
  delete state.sessions[todayKey()];
  render();
  await persist();
  showToast("Desfeito");
}

// ---------- rest timer ----------
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

// ---------- progress sheet ----------
function buildLineChart(hist){
  const w = 300, h = 140, padL = 34, padR = 14, padT = 14, padB = 24;
  const validWeights = hist.map(p => p.weight).filter(v => v != null && !isNaN(v));
  if(validWeights.length === 0) return "";
  const validPts = hist.filter(p => p.weight != null && !isNaN(p.weight));
  let min = Math.min(...validWeights), max = Math.max(...validWeights);
  if(min === max){ min -= 1; max += 1; }
  const stepX = validPts.length > 1 ? (w - padL - padR) / (validPts.length - 1) : 0;
  const pts = validPts.map((p, i) => {
    const x = padL + i * stepX;
    const y = padT + (1 - (p.weight - min) / (max - min)) * (h - padT - padB);
    return { x, y };
  });
  const linePath = pts.map((pt, i) => (i === 0 ? "M" : "L") + pt.x.toFixed(1) + " " + pt.y.toFixed(1)).join(" ");
  const circles = pts.map(pt => `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="3.2" fill="var(--accent)"/>`).join("");
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" role="img" aria-label="Gráfico de evolução de carga">
    <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${h-padB}" stroke="var(--divider)" stroke-width="1"/>
    <line x1="${padL}" y1="${h-padB}" x2="${w-padR}" y2="${h-padB}" stroke="var(--divider)" stroke-width="1"/>
    <text x="4" y="${padT+4}" font-size="9" fill="var(--text-muted)">${max}kg</text>
    <text x="4" y="${h-padB+4}" font-size="9" fill="var(--text-muted)">${min}kg</text>
    <path d="${linePath}" fill="none" stroke="var(--accent)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>
    ${circles}
  </svg>`;
}

function renderProgressOverlay(root){
  const { exId, name } = overlay;
  const hist = exerciseHistory(exId);
  let body;
  if(hist.length === 0){
    body = `<div class="sheet-empty">Ainda não há registros de carga para "${escapeHtml(name)}".</div>`;
  } else {
    const chart = buildLineChart(hist);
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

// ---------- confirm ----------
function renderConfirmOverlay(root){
  const { msg, onYes } = overlay;
  root.innerHTML = `<div class="sheet-backdrop" id="sheetBackdrop"></div>
  <div class="sheet" role="dialog" aria-modal="true">
    <div class="sheet-handle"></div>
    <div class="sheet-header">
      <div class="sheet-date" style="font-size:16px;">${escapeHtml(msg)}</div>
      <button class="icon-btn" id="sheetClose" aria-label="fechar">${ICONS.close}</button>
    </div>
    <div class="sheet-actions">
      <button class="cta-btn" id="confirmYes" style="background:var(--danger);color:#fff;">Confirmar</button>
      <button class="footer-btn" id="confirmNo">Cancelar</button>
    </div>
  </div>`;
  document.getElementById("sheetBackdrop").addEventListener("click", closeOverlay);
  document.getElementById("sheetClose").addEventListener("click", closeOverlay);
  document.getElementById("confirmNo").addEventListener("click", closeOverlay);
  document.getElementById("confirmYes").addEventListener("click", () => {
    overlay = null;
    renderOverlay();
    onYes();
  });
}

// ---------- import choice ----------
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
      Este arquivo tem ${nTreinos} treino(s) e ${nSessoes} sessão(ões) registradas.
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
  state.sessions = { ...state.sessions, ...parsed.sessions };
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
  initExIdCounter();
  initRestCounter();
  overlay = null;
  render();
  await persist();
  showToast("Backup importado");
}

// ---------- backup ----------
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
    const rows = [["data","treino","exercicio","serie","peso_kg","reps","feito"]];
    Object.keys(state.sessions).sort().forEach(dateKey => {
      const letter = sessionLetter(dateKey);
      const log = sessionLog(dateKey);
      const w = state.workouts[letter];
      const exMap = {};
      (w?.exercises || []).forEach(ex => exMap[ex.id] = ex.name || ex.id);
      Object.keys(log).forEach(exId => {
        (log[exId] || []).forEach((s, i) => {
          rows.push([
            dateKey,
            letter || "",
            exMap[exId] || exId,
            String(i+1),
            s.weight != null ? String(s.weight).replace(".", ",") : "",
            s.reps != null ? String(s.reps) : "",
            s.done ? "1" : "0"
          ]);
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

// ---------- reminder ----------
function checkReminder(){
  const r = state.settings.reminder;
  if(!r || !r.enabled) return;
  if(sessionLetter(todayKey())) return;
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

// ---------- handlers ----------
function attachHandlers(){
  const $ = (id) => document.getElementById(id);

  const markBtn = $("markDoneBtn");
  if(markBtn) markBtn.addEventListener("click", () => { haptic(8); openDaySheet(todayKey()); });

  const editTodayBtn = $("editTodayBtn");
  if(editTodayBtn) editTodayBtn.addEventListener("click", () => openDaySheet(todayKey()));

  const undoBtn = $("undoTodayBtn");
  if(undoBtn) undoBtn.addEventListener("click", undoToday);

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

  document.querySelectorAll('[data-role="exname"], [data-role="exsets"], [data-role="exreps"], [data-role="exrest"]').forEach(el => {
    el.addEventListener("change", async () => {
      const w = state.workouts[el.dataset.letter];
      const ex = w.exercises.find(e => e.id === el.dataset.exid);
      if(!ex) return;
      if(el.dataset.role === "exname") ex.name = el.value;
      if(el.dataset.role === "exsets") ex.sets = el.value;
      if(el.dataset.role === "exreps") ex.reps = el.value;
      if(el.dataset.role === "exrest") ex.rest = el.value;
      await persist();
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
    el.addEventListener("click", async () => {
      haptic(6);
      const w = state.workouts[el.dataset.letter];
      w.exercises.push({ id: newExId(), name: "", sets: "", reps: "", rest: "" });
      render();
      await persist();
      const inputs = document.querySelectorAll(`[data-letter="${el.dataset.letter}"][data-role="exname"]`);
      const lastInput = inputs[inputs.length - 1];
      if(lastInput) lastInput.focus();
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
    el.addEventListener("click", () => openDaySheet(el.dataset.key));
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

// ---------- init ----------
(async function init(){
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
    }
  });
  setInterval(checkReminder, 5 * 60 * 1000);
  window.addEventListener("beforeunload", () => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e){}
  });
})();

// ---------- service worker ----------
if("serviceWorker" in navigator){
  window.addEventListener("load", async () => {
    try{
      const reg = await navigator.serviceWorker.register("sw.js");
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
    }catch(e){}
  });
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if(refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}