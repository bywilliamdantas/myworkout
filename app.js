const STORAGE_KEY = "gym-data";
const PALETTE = ["#ff5a1f", "#3d9dff", "#30d158", "#ffd60a", "#bf5af2", "#64d2ff"];
const REST_COLOR = "#5b5b5b";
const WEEKDAY_FULL = ["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];
const MONTH_NAMES = ["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];
const MONTH_NAMES_FULL = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];

const ICONS = {
  close: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>`,
  check: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5L20 6"/></svg>`,
  pencil: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
  up: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>`,
  down: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`,
  download: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16"/></svg>`,
  upload: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V9m0 0l-4 4m4-4l4 4M4 5h16"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5M4 19h16M8 15l3-4 3 3 4-6"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/></svg>`,
  moonSmall: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/></svg>`
};

function pad(n){ return String(n).padStart(2,"0"); }
function dateKeyFromDate(d){ return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
function todayKey(){ return dateKeyFromDate(new Date()); }
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

let state = {
  order: ["A","B","C"],
  workouts: {
    A: { name: "Treino A", exercises: [] },
    B: { name: "Treino B", exercises: [] },
    C: { name: "Treino C", exercises: [] }
  },
  sessions: {},  // { "2026-09-11": { letter:"A", log: { exId: {weight,reps} } } }
  settings: {
    reminder: { enabled: false, time: "18:00", lastNotifiedDate: null },
    lastBackupAt: null
  }
};
let loadFailed = false;
let saveInFlight = false;
let exIdCounter = 1;
let restCounter = 1;
let overlay = null;         // { type:'day'|'progress'|'importChoice', ... }
let updateAvailable = null; // service worker registration with a waiting worker

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

function migrateSessions(s){
  if(!s.sessions) { s.sessions = {}; return; }
  Object.keys(s.sessions).forEach(k => {
    if(typeof s.sessions[k] === "string"){
      s.sessions[k] = { letter: s.sessions[k], log: {} };
    } else if(s.sessions[k] && !s.sessions[k].log){
      s.sessions[k].log = {};
    }
  });
}
function migrateSettings(s){
  if(!s.settings) s.settings = {};
  if(!s.settings.reminder) s.settings.reminder = { enabled:false, time:"18:00", lastNotifiedDate:null };
  if(s.settings.reminder.enabled === undefined) s.settings.reminder.enabled = false;
  if(!s.settings.reminder.time) s.settings.reminder.time = "18:00";
  if(s.settings.reminder.lastNotifiedDate === undefined) s.settings.reminder.lastNotifiedDate = null;
  if(s.settings.lastBackupAt === undefined) s.settings.lastBackupAt = null;
}

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

// ---------- storage (localStorage) ----------
function storageAvailable(){
  try{
    const testKey = "__storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  }catch(e){
    return false;
  }
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
        state = parsed;
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
  const dot = document.getElementById("syncDot");
  const text = document.getElementById("syncText");
  const retryBtn = document.getElementById("syncRetryBtn");
  dot.className = "sync-dot";
  retryBtn.style.display = "none";
  if(s === "busy"){ row.classList.remove("hidden"); dot.classList.add("busy"); text.textContent = "salvando…"; }
  else if(s === "ok"){ dot.classList.add("ok"); text.textContent = "salvo neste aparelho"; setTimeout(() => { if(!saveInFlight) row.classList.add("hidden"); }, 1300); }
  else if(s === "err"){ row.classList.remove("hidden"); dot.classList.add("err"); text.textContent = "falha ao salvar"; retryBtn.style.display = "inline"; }
}

document.getElementById("syncRetryBtn").addEventListener("click", () => persist());

let toastTimer;
function showToast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
}

// ---------- derived data ----------
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
  const start = new Date(now);
  start.setDate(now.getDate() - day);
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
    if(log && log[exId] && (log[exId].weight || log[exId].reps)) return log[exId];
  }
  return null;
}

function exerciseHistory(exId){
  return Object.keys(state.sessions).sort().map(k => {
    const log = sessionLog(k);
    if(log && log[exId] && (log[exId].weight || log[exId].reps)){
      const w = log[exId].weight !== "" && log[exId].weight != null ? Number(log[exId].weight) : null;
      const r = log[exId].reps !== "" && log[exId].reps != null ? Number(log[exId].reps) : null;
      return { date: k, weight: (w != null && !isNaN(w)) ? w : null, reps: (r != null && !isNaN(r)) ? r : null };
    }
    return null;
  }).filter(Boolean);
}

function daysSince(iso){
  if(!iso) return Infinity;
  const then = new Date(iso).getTime();
  if(isNaN(then)) return Infinity;
  return (Date.now() - then) / (1000*60*60*24);
}

// ---------- rendering ----------
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

  let topBanner = "";
  if(loadFailed){
    topBanner += `<div class="banner"><span>Não foi possível carregar seus dados salvos.</span><button id="retryLoadBtn">tentar de novo</button></div>`;
  }
  if(updateAvailable){
    topBanner += `<div class="banner info"><span>Nova versão do app disponível.</span><button id="updateBtn">atualizar</button></div>`;
  }
  const backupDays = daysSince(state.settings.lastBackupAt);
  const backupDue = total > 0 && backupDays >= 14;
  if(backupDue){
    const daysTxt = backupDays === Infinity ? "Você ainda não exportou um backup" : `Já fazem ${Math.floor(backupDays)} dias sem backup`;
    topBanner += `<div class="banner info"><span>${daysTxt}.</span><button id="backupNowBtn">exportar agora</button></div>`;
  }

  let html = "";

  // ----- hero -----
  const chainPreview = state.order.map(k => state.workouts[k]?.isRest ? "Desc." : k).join(" → ");
  html += `<div class="card">
    ${topBanner}
    <p class="eyebrow">${doneToday ? "TREINO DE HOJE" : "PRÓXIMO"} · ${weekdayLabel}</p>
    <div class="hero-top">
      <div class="letter-badge" style="background:${colorFor(heroKey, state.order)}${state.workouts[heroKey]?.isRest ? ";color:#f5f5f5" : ""}">${badgeContent(heroKey)}</div>
      <div class="hero-info">
        <div class="workout-name">${escapeHtml(heroW.name || workoutLabel(heroKey))}</div>
        <div class="workout-sub">${doneToday ? "concluído hoje" : `ciclo: ${chainPreview} → ${chainPreview.split(" → ")[0]}...`}</div>
      </div>
    </div>
    <div class="stats-row">
      <div class="stat highlight"><div class="stat-num">${streak}</div><div class="stat-label">dias seguidos</div></div>
      <div class="stat"><div class="stat-num">${thisWeek}</div><div class="stat-label">essa semana</div></div>
      <div class="stat"><div class="stat-num">${total}</div><div class="stat-label">total geral</div></div>
    </div>
    ${doneToday
      ? `<button class="cta-btn done" disabled>${ICONS.check} ${state.workouts[doneToday]?.isRest ? "Descanso registrado" : "Treino " + doneToday + " concluído"}</button>
         <div class="hero-links">
           <button class="undo-link" id="editTodayBtn">editar registro</button>
           <button class="undo-link" id="undoTodayBtn">desfazer</button>
         </div>`
      : `<button class="cta-btn" id="markDoneBtn">${state.workouts[next]?.isRest ? "Marcar descanso como feito" : "Marcar Treino " + next + " como feito"}</button>`
    }
  </div>`;

  // ----- workouts management -----
  html += `<p class="section-title">Meus treinos</p>`;
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
            <button class="progress-btn" data-role="viewprogress" data-exid="${ex.id}" data-name="${escapeAttr(ex.name || "Exercício")}" ${hasHist ? "" : "disabled"} aria-label="Ver progresso de carga${hasHist ? "" : " (sem registros ainda)"}">${ICONS.chart}</button>
            <button class="ex-del" data-role="delex" data-letter="${key}" data-exid="${ex.id}" aria-label="remover exercício">${ICONS.close}</button>
          </div>
          <div class="ex-row-bottom">
            <label class="ex-field"><span>séries</span><input data-role="exsets" data-letter="${key}" data-exid="${ex.id}" value="${escapeAttr(ex.sets)}" placeholder="4" inputmode="numeric" aria-label="Séries"></label>
            <label class="ex-field"><span>reps</span><input data-role="exreps" data-letter="${key}" data-exid="${ex.id}" value="${escapeAttr(ex.reps)}" placeholder="12" inputmode="numeric" aria-label="Repetições"></label>
          </div>
        </div>`;
      }).join("") : `<div class="empty-ex">Nenhum exercício ainda — adicione o primeiro abaixo.</div>`}
      <button class="add-exercise-btn" data-role="addex" data-letter="${key}">${ICONS.plus} Adicionar exercício</button>
      `}
    </div>`;
  });
  html += `<div style="display:flex;gap:10px;">
    <button class="add-workout-btn" id="addWorkoutBtn" style="flex:1;">${ICONS.plus} Novo treino</button>
    <button class="add-workout-btn" id="addRestBtn" style="flex:1;">${ICONS.moonSmall} Descanso</button>
  </div>`;

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
    ${buildHeatmap()}
  </div>`;

  // ----- lembretes -----
  const r = state.settings.reminder;
  html += `<p class="section-title" style="margin-top:24px;">Lembretes</p>
  <div class="card">
    <label class="reminder-row">
      <span>Lembrete diário de treino</span>
      <input type="checkbox" id="reminderToggle" ${r.enabled ? "checked" : ""} aria-label="Ativar lembrete diário de treino">
    </label>
    <div class="reminder-time-row" id="reminderTimeRow" style="${r.enabled ? "" : "display:none;"}">
      <span>Horário</span>
      <input type="time" id="reminderTime" value="${r.time}" aria-label="Horário do lembrete">
    </div>
    <p class="reminder-note">O lembrete funciona enquanto o app está aberto (ou quando você o reabre) — o iPhone não permite alarmes em segundo plano para apps instalados via Safari sem um servidor de notificações próprio.</p>
  </div>`;

  html += `<div class="footer-actions">
    <button class="footer-btn" id="exportBtn">${ICONS.download} Exportar backup</button>
    <button class="footer-btn" id="importBtn">${ICONS.upload} Importar backup</button>
  </div>
  <input type="file" id="importFile" accept="application/json">
  <div class="hint">toque em um exercício ou dia do histórico para editar</div>`;

  app.innerHTML = html;
  attachHandlers();
  renderOverlay();
}

function buildHeatmap(){
  const todayD = new Date(); todayD.setHours(0,0,0,0);
  const totalWeeks = 18;
  let start = new Date(todayD);
  start.setDate(start.getDate() - (totalWeeks*7 - 1));
  start.setDate(start.getDate() - start.getDay());

  const weeks = [];
  let cursor = new Date(start);
  while(true){
    const week = [];
    for(let i=0;i<7;i++){
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate()+1);
    }
    weeks.push(week);
    if(cursor > todayD) break;
  }

  const monthsRow = weeks.map(week => {
    const firstOfMonth = week.find(d => d.getDate() <= 7 && d <= todayD);
    return firstOfMonth ? MONTH_NAMES[firstOfMonth.getMonth()] : "";
  });

  let html = `<div class="heat-months">${monthsRow.map(m => `<span>${m}</span>`).join("")}</div>`;
  html += `<div class="heat-body">`;
  html += `<div class="heat-weekday-labels"><span></span><span>seg</span><span></span><span>qua</span><span></span><span>sex</span><span></span></div>`;
  html += `<div class="heat-grid">`;
  weeks.forEach(week => {
    html += `<div class="heat-col">`;
    week.forEach(d => {
      if(d > todayD){
        html += `<div class="heat-cell empty"></div>`;
        return;
      }
      const key = dateKeyFromDate(d);
      const letter = sessionLetter(key);
      const isToday = key === todayKey();
      const style = letter ? `background:${colorFor(letter, state.order)}` : "";
      let cls = "heat-cell" + (letter ? "" : " off") + (isToday ? " today" : "");
      const label = `${WEEKDAY_FULL[d.getDay()]}, ${d.getDate()} de ${MONTH_NAMES_FULL[d.getMonth()]}${letter ? " — " + workoutLabel(letter) : " — sem treino"}`;
      html += `<button class="${cls}" style="${style}" data-role="heatday" data-key="${key}" aria-label="${escapeAttr(label)}"></button>`;
    });
    html += `</div>`;
  });
  html += `</div></div>`;
  return html;
}

function escapeHtml(s){
  return String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function escapeAttr(s){ return escapeHtml(s); }

// ---------- overlay (bottom sheet): dia / progresso / import ----------
function openDaySheet(dateKey){
  const existing = state.sessions[dateKey];
  const letter = existing ? sessionLetter(dateKey) : (dateKey === todayKey() ? nextWorkoutLetter() : state.order[0]);
  const existingLog = existing ? sessionLog(dateKey) : {};
  overlay = { type: "day", dateKey, letter, log: JSON.parse(JSON.stringify(existingLog)) };
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
function closeOverlay(){
  overlay = null;
  renderOverlay();
}

function renderOverlay(){
  const root = document.getElementById("sheetRoot");
  if(!overlay){ root.innerHTML = ""; return; }
  if(overlay.type === "day") return renderDayOverlay(root);
  if(overlay.type === "progress") return renderProgressOverlay(root);
  if(overlay.type === "importChoice") return renderImportChoiceOverlay(root);
}

async function saveDaySheet(){
  const { dateKey, letter, log } = overlay;
  state.sessions[dateKey] = { letter, log };
  if(navigator.vibrate) navigator.vibrate([10,40,10]);
  overlay = null;
  render();
  await persist();
  showToast(dateKey === todayKey() ? `${workoutLabel(letter)[0].toUpperCase()}${workoutLabel(letter).slice(1)} marcado como feito` : "Registro salvo");
  if(dateKey === todayKey()){
    const heroCard = document.querySelector("#app .card");
    if(heroCard){
      heroCard.classList.add("celebrate");
      setTimeout(() => heroCard.classList.remove("celebrate"), 650);
    }
  }
}
async function removeDaySheetEntry(){
  delete state.sessions[overlay.dateKey];
  overlay = null;
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

function renderDayOverlay(root){
  const { dateKey, letter, log } = overlay;
  const [y,m,dd] = dateKey.split("-").map(Number);
  const d = new Date(y, m-1, dd);
  const isToday = dateKey === todayKey();
  const dateLabel = isToday ? "Hoje" : `${WEEKDAY_FULL[d.getDay()]}, ${dd} de ${MONTH_NAMES_FULL[m-1]}`;
  const existing = !!state.sessions[dateKey];
  const w = state.workouts[letter] || { exercises: [] };

  let html = `<div class="sheet-backdrop" id="sheetBackdrop"></div>`;
  html += `<div class="sheet" role="dialog" aria-modal="true" aria-label="Registrar treino">
    <div class="sheet-handle"></div>
    <div class="sheet-header">
      <div class="sheet-date">${escapeHtml(dateLabel)}</div>
      <button class="icon-btn" id="sheetClose" aria-label="fechar">${ICONS.close}</button>
    </div>
    <div class="sheet-chips">
      ${state.order.map(k => {
        const wk = state.workouts[k];
        const label = wk?.isRest ? "Desc." : k;
        const active = k === letter;
        return `<button class="chip" data-role="sheetletter" data-letter="${k}" aria-pressed="${active}" aria-label="Selecionar ${wk?.isRest ? "descanso" : "Treino " + k}" style="${active ? `background:${colorFor(k,state.order)};color:${wk?.isRest?"#f5f5f5":"#0a0a0a"};border-color:transparent` : ""}">${label}</button>`;
      }).join("")}
    </div>
    ${w.isRest
      ? `<div class="sheet-empty">Dia de descanso — nada para registrar.</div>`
      : (w.exercises.length ? `<div class="sheet-exercises">${w.exercises.map(ex => {
          const last = lastLoggedValue(ex.id, dateKey);
          const cur = log[ex.id] || {};
          return `<div class="sheet-ex-row">
            <div class="sheet-ex-name">${escapeHtml(ex.name || "Exercício")}</div>
            <div class="sheet-ex-inputs">
              <input class="sheet-input" data-role="logweight" data-exid="${ex.id}" inputmode="decimal" placeholder="${last?.weight ? last.weight + " kg" : "peso (kg)"}" value="${escapeAttr(cur.weight || "")}" aria-label="Peso usado em ${escapeAttr(ex.name||"exercício")}">
              <input class="sheet-input" data-role="logreps" data-exid="${ex.id}" inputmode="numeric" placeholder="${last?.reps || ex.reps || "reps"}" value="${escapeAttr(cur.reps || "")}" aria-label="Repetições feitas em ${escapeAttr(ex.name||"exercício")}">
            </div>
          </div>`;
        }).join("")}</div>` : `<div class="sheet-empty">Esse treino ainda não tem exercícios cadastrados.</div>`)
    }
    <div class="sheet-actions">
      <button class="cta-btn" id="sheetSave">Salvar</button>
      ${existing ? `<button class="footer-btn danger" id="sheetRemove">${ICONS.trash} Remover registro deste dia</button>` : ""}
    </div>
  </div>`;
  root.innerHTML = html;

  document.getElementById("sheetBackdrop").addEventListener("click", closeOverlay);
  document.getElementById("sheetClose").addEventListener("click", closeOverlay);
  document.querySelectorAll('[data-role="sheetletter"]').forEach(b => {
    b.addEventListener("click", () => { overlay.letter = b.dataset.letter; renderOverlay(); });
  });
  document.querySelectorAll('[data-role="logweight"],[data-role="logreps"]').forEach(inp => {
    inp.addEventListener("input", () => {
      const exid = inp.dataset.exid;
      const field = inp.dataset.role === "logweight" ? "weight" : "reps";
      overlay.log[exid] = { ...overlay.log[exid], [field]: inp.value };
    });
  });
  document.getElementById("sheetSave").addEventListener("click", saveDaySheet);
  const removeBtn = document.getElementById("sheetRemove");
  if(removeBtn) removeBtn.addEventListener("click", removeDaySheetEntry);
}

function buildLineChart(hist){
  const w = 300, h = 130, padL = 34, padR = 14, padT = 14, padB = 24;
  const validWeights = hist.map(p => p.weight).filter(v => v != null && !isNaN(v));
  if(validWeights.length === 0) return "";
  let min = Math.min(...validWeights), max = Math.max(...validWeights);
  if(min === max){ min -= 1; max += 1; }
  const stepX = hist.length > 1 ? (w - padL - padR) / (hist.length - 1) : 0;
  const pts = hist.map((p, i) => {
    const x = padL + i * stepX;
    const val = (p.weight != null && !isNaN(p.weight)) ? p.weight : min;
    const y = padT + (1 - (val - min) / (max - min)) * (h - padT - padB);
    return { x, y };
  });
  const linePath = pts.map((pt, i) => (i === 0 ? "M" : "L") + pt.x.toFixed(1) + " " + pt.y.toFixed(1)).join(" ");
  const circles = pts.map(pt => `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="3.2" fill="var(--accent)"/>`).join("");
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" role="img" aria-label="Gráfico de evolução de carga">
    <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${h-padB}" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <line x1="${padL}" y1="${h-padB}" x2="${w-padR}" y2="${h-padB}" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <text x="4" y="${padT+4}" font-size="9" fill="#7d7d7d">${max}kg</text>
    <text x="4" y="${h-padB+4}" font-size="9" fill="#7d7d7d">${min}kg</text>
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
    body = (chart || `<div class="sheet-empty">Só há repetições registradas, sem peso, até agora.</div>`) +
      `<div class="progress-list">${hist.slice().reverse().map(p => {
        const [, mo, da] = p.date.split("-").map(Number);
        return `<div class="progress-row"><span>${da}/${mo}</span><span>${p.weight != null ? p.weight + " kg" : "—"}</span><span>${p.reps != null ? p.reps + " reps" : "—"}</span></div>`;
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
    <p style="font-size:13px;color:var(--text-muted);margin:0 0 18px;line-height:1.4;">
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
  state.sessions = { ...state.sessions, ...parsed.sessions };
  overlay = null;
  render();
  await persist();
  showToast("Sessões mescladas com sucesso");
}
async function replaceImportData(parsed){
  state = parsed;
  migrateSessions(state);
  migrateSettings(state);
  initExIdCounter();
  initRestCounter();
  overlay = null;
  render();
  await persist();
  showToast("Backup importado (dados substituídos)");
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
    showToast("Não foi possível exportar o backup");
  }
}

// ---------- lembrete ----------
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
  const markBtn = document.getElementById("markDoneBtn");
  if(markBtn) markBtn.addEventListener("click", () => openDaySheet(todayKey()));

  const editTodayBtn = document.getElementById("editTodayBtn");
  if(editTodayBtn) editTodayBtn.addEventListener("click", () => openDaySheet(todayKey()));

  const undoBtn = document.getElementById("undoTodayBtn");
  if(undoBtn) undoBtn.addEventListener("click", undoToday);

  const retryLoadBtn = document.getElementById("retryLoadBtn");
  if(retryLoadBtn) retryLoadBtn.addEventListener("click", async () => {
    showToast("Carregando novamente…");
    await loadData();
    render();
  });

  const updateBtn = document.getElementById("updateBtn");
  if(updateBtn) updateBtn.addEventListener("click", () => {
    if(updateAvailable && updateAvailable.waiting){
      updateAvailable.waiting.postMessage("SKIP_WAITING");
    }
  });

  const backupNowBtn = document.getElementById("backupNowBtn");
  if(backupNowBtn) backupNowBtn.addEventListener("click", exportBackup);

  document.querySelectorAll('[data-role="wname"]').forEach(el => {
    el.addEventListener("change", async () => {
      state.workouts[el.dataset.letter].name = el.value || workoutLabel(el.dataset.letter);
      await persist();
    });
    el.addEventListener("keydown", (ev) => { if(ev.key === "Enter") el.blur(); });
  });

  document.querySelectorAll('[data-role="moveup"],[data-role="movedown"]').forEach(el => {
    el.addEventListener("click", async () => {
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
      const label = state.workouts[key]?.isRest ? "o descanso" : `o Treino ${key}`;
      if(!confirm(`Remover ${label} do ciclo? Os dias já registrados no histórico permanecem.`)) return;
      state.order = state.order.filter(l => l !== key);
      delete state.workouts[key];
      render();
      await persist();
    });
  });

  document.querySelectorAll('[data-role="exname"], [data-role="exsets"], [data-role="exreps"]').forEach(el => {
    el.addEventListener("change", async () => {
      const w = state.workouts[el.dataset.letter];
      const ex = w.exercises.find(e => e.id === el.dataset.exid);
      if(!ex) return;
      if(el.dataset.role === "exname") ex.name = el.value;
      if(el.dataset.role === "exsets") ex.sets = el.value;
      if(el.dataset.role === "exreps") ex.reps = el.value;
      await persist();
    });
  });

  document.querySelectorAll('[data-role="delex"]').forEach(el => {
    el.addEventListener("click", async () => {
      const w = state.workouts[el.dataset.letter];
      w.exercises = w.exercises.filter(e => e.id !== el.dataset.exid);
      render();
      await persist();
    });
  });

  document.querySelectorAll('[data-role="viewprogress"]').forEach(el => {
    if(el.disabled) return;
    el.addEventListener("click", () => openProgressSheet(el.dataset.exid, el.dataset.name));
  });

  document.querySelectorAll('[data-role="addex"]').forEach(el => {
    el.addEventListener("click", async () => {
      const w = state.workouts[el.dataset.letter];
      w.exercises.push({ id: newExId(), name: "", sets: "", reps: "" });
      render();
      await persist();
      const inputs = document.querySelectorAll(`[data-letter="${el.dataset.letter}"][data-role="exname"]`);
      const lastInput = inputs[inputs.length - 1];
      if(lastInput) lastInput.focus();
    });
  });

  const addWorkoutBtn = document.getElementById("addWorkoutBtn");
  if(addWorkoutBtn) addWorkoutBtn.addEventListener("click", async () => {
    const nextLetter = nextAvailableLetter();
    if(!nextLetter){ showToast("Limite de treinos atingido"); return; }
    state.order.push(nextLetter);
    state.workouts[nextLetter] = { name: `Treino ${nextLetter}`, exercises: [] };
    render();
    await persist();
  });

  const addRestBtn = document.getElementById("addRestBtn");
  if(addRestBtn) addRestBtn.addEventListener("click", async () => {
    const key = newRestKey();
    state.order.push(key);
    state.workouts[key] = { name: "Descanso", exercises: [], isRest: true };
    render();
    await persist();
  });

  document.querySelectorAll('[data-role="heatday"]').forEach(el => {
    el.addEventListener("click", () => openDaySheet(el.dataset.key));
  });

  const reminderToggle = document.getElementById("reminderToggle");
  if(reminderToggle) reminderToggle.addEventListener("change", async (e) => {
    state.settings.reminder.enabled = e.target.checked;
    if(e.target.checked && typeof Notification !== "undefined" && Notification.permission === "default"){
      try{ await Notification.requestPermission(); }catch(err){}
    }
    render();
    await persist();
  });
  const reminderTime = document.getElementById("reminderTime");
  if(reminderTime) reminderTime.addEventListener("change", async (e) => {
    state.settings.reminder.time = e.target.value;
    await persist();
  });

  document.getElementById("exportBtn").addEventListener("click", exportBackup);

  document.getElementById("importBtn").addEventListener("click", () => {
    document.getElementById("importFile").click();
  });
  document.getElementById("importFile").addEventListener("change", async (ev) => {
    const file = ev.target.files[0];
    if(!file) return;
    try{
      const text = await file.text();
      const parsed = JSON.parse(text);
      if(!parsed.order || !parsed.workouts) throw new Error("formato inválido");
      openImportChoice(parsed);
    }catch(e){
      showToast("Arquivo de backup inválido");
    }
    ev.target.value = "";
  });
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
    showToast("Armazenamento indisponível (modo privado?). Seus dados não serão salvos.");
    return;
  }
  await loadData();
  render();
  if(loadFailed){
    showToast("Seus dados salvos não puderam ser carregados agora");
  }
  checkReminder();
  document.addEventListener("visibilitychange", () => {
    if(document.visibilityState === "visible") checkReminder();
  });
  setInterval(checkReminder, 5 * 60 * 1000);
})();

// ---------- service worker (offline + atualização) ----------
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
