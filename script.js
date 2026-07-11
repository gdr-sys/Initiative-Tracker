// ============================================================
// INITIATIVE TRACKER — script.js
// Tutta la logica dell'app. Nessuna dipendenza esterna.
// ============================================================

// ============================================================
// TRADUZIONI / TRANSLATIONS
// ============================================================
const translations = {
  it: {
    round: 'Round',
    mode: 'Modalità',
    acting_now: '▶ AGISCE ORA',
    next_turn: '⏭️ Prossimo Turno',
    restored: 'Combattimento precedente ripristinato',
    empty_state: 'Nessun combattente. Aggiungi il primo per iniziare!',
    add_button: '+ Aggiungi',
    new_round_button: 'Nuovo Round',
    new_combat_button: 'Nuovo Combattimento',
    credit: 'Creato da Noemi Marcolini',
    kofi_long: '☕ Offrimi un caffè',
    portfolio_long: '🎲 Altri strumenti per GDR',
    portfolio_short: '🎲 Altri tool GDR',
    settings_title: 'Impostazioni',
    add_title: 'Aggiungi',
    name_label: 'Nome',
    name_placeholder: 'Aldric il Guerriero',
    type_label: 'Tipo',
    type_hero: 'PG',
    type_villain: 'Nemico',
    type_neutral: 'Neutrale',
    type_summon: 'Evocazione',
    initiative_label: 'Iniziativa',
    roll_d20: '🎲 Tira 1d20',
    hp_label: 'HP',
    hp_current_label: 'Attuali',
    hp_max_label: 'Massimi',
    add_multiple_label: 'Aggiungi Multipli',
    add_multiple_hint: 'Utile per gruppi di nemici identici',
    add_confirm: 'Aggiungi al Combattimento',
    status_label: 'Status',
    status_placeholder: 'Es. Avvelenato',
    status_add: '+ Status',
    notes_label: 'Note',
    notes_placeholder: 'Note libere...',
    mark_acted: '✓ Segna come Agito',
    remove_combatant: '🗑️ Rimuovi dal Combattimento',
    critical_x2: 'CRITICO x2',
    apply: 'Applica',
    cancel: 'Annulla',
    language_label: 'Lingua',
    mode_section_label: 'Modalità Iniziativa',
    mode_dnd_title: 'D&D / Numerica',
    mode_dnd_desc: 'Ordinamento per numero, turni individuali',
    mode_fabula_title: 'Fabula Ultima / Alternata',
    mode_fabula_desc: 'Turni alternati Eroi/Villain, nessun numero',
    mode_pbta_title: 'PbtA / Spotlight',
    mode_pbta_desc: 'Nessun ordine fisso, il Master decide',
    options_label: 'Opzioni',
    opt_sounds: 'Suoni',
    opt_haptics: 'Vibrazione',
    opt_animations: 'Animazioni',
    opt_largescreen: 'Modalità schermo grande',
    reset_label: 'Reset',
    clear_all_button: 'Cancella Tutto e Ricomincia',
    victory_title: '🏆 VITTORIA!',
    victory_text: 'Tutti i nemici sono stati sconfitti.',
    close: 'Chiudi',
    // Stringhe dinamiche generate da JS
    mode_short_dnd: 'D&D',
    mode_short_fabula: 'Fabula Ultima',
    mode_short_pbta: 'PbtA',
    heroes_group: 'Eroi',
    villains_group: 'Villain',
    has_acted_suffix: ' — Ha Agito',
    spotlight_on: '✨ In Spotlight',
    spotlight_off: '💡 Illumina',
    action_damage: '❤️ Danno',
    action_heal: '💚 Cura',
    action_acted: '✓ Agito',
    toast_no_undo: 'Niente da annullare',
    toast_undo_done: 'Azione annullata',
    toast_added: 'Combattente aggiunto',
    toast_removed: 'Combattente rimosso',
    toast_name_required: 'Inserisci un nome',
    toast_new_combat: 'Nuovo combattimento iniziato',
    toast_clear_all: 'Tutto cancellato',
    damage_to: 'Danno a',
    heal_to: 'Cura a',
    apply_damage_btn: 'Applica Danno',
    apply_heal_btn: 'Applica Cura',
    rounds_reached: 'Round raggiunti',
    confirm_new_combat: 'Iniziare un nuovo combattimento? La lista attuale verrà svuotata.',
    confirm_clear_all: 'Cancellare tutto e ricominciare da zero? Questa azione non è annullabile.'
  },
  en: {
    round: 'Round',
    mode: 'Mode',
    acting_now: '▶ ACTING NOW',
    next_turn: '⏭️ Next Turn',
    restored: 'Previous combat restored',
    empty_state: 'No combatants yet. Add the first one to get started!',
    add_button: '+ Add',
    new_round_button: 'New Round',
    new_combat_button: 'New Combat',
    credit: 'Created by Noemi Marcolini',
    kofi_long: '☕ Buy me a coffee',
    portfolio_long: '🎲 More RPG tools',
    portfolio_short: '🎲 More RPG tools',
    settings_title: 'Settings',
    add_title: 'Add',
    name_label: 'Name',
    name_placeholder: 'Aldric the Warrior',
    type_label: 'Type',
    type_hero: 'PC',
    type_villain: 'Enemy',
    type_neutral: 'Neutral',
    type_summon: 'Summon',
    initiative_label: 'Initiative',
    roll_d20: '🎲 Roll 1d20',
    hp_label: 'HP',
    hp_current_label: 'Current',
    hp_max_label: 'Max',
    add_multiple_label: 'Add Multiple',
    add_multiple_hint: 'Useful for groups of identical enemies',
    add_confirm: 'Add to Combat',
    status_label: 'Status',
    status_placeholder: 'E.g. Poisoned',
    status_add: '+ Status',
    notes_label: 'Notes',
    notes_placeholder: 'Free notes...',
    mark_acted: '✓ Mark as Acted',
    remove_combatant: '🗑️ Remove from Combat',
    critical_x2: 'CRITICAL x2',
    apply: 'Apply',
    cancel: 'Cancel',
    language_label: 'Language',
    mode_section_label: 'Initiative Mode',
    mode_dnd_title: 'D&D / Numeric',
    mode_dnd_desc: 'Numeric ordering, individual turns',
    mode_fabula_title: 'Fabula Ultima / Alternating',
    mode_fabula_desc: 'Alternating Hero/Villain turns, no numbers',
    mode_pbta_title: 'PbtA / Spotlight',
    mode_pbta_desc: 'No fixed order, the GM decides',
    options_label: 'Options',
    opt_sounds: 'Sounds',
    opt_haptics: 'Vibration',
    opt_animations: 'Animations',
    opt_largescreen: 'Large screen mode',
    reset_label: 'Reset',
    clear_all_button: 'Clear Everything and Restart',
    victory_title: '🏆 VICTORY!',
    victory_text: 'All enemies have been defeated.',
    close: 'Close',
    mode_short_dnd: 'D&D',
    mode_short_fabula: 'Fabula Ultima',
    mode_short_pbta: 'PbtA',
    heroes_group: 'Heroes',
    villains_group: 'Villains',
    has_acted_suffix: ' — Has Acted',
    spotlight_on: '✨ In Spotlight',
    spotlight_off: '💡 Spotlight',
    action_damage: '❤️ Damage',
    action_heal: '💚 Heal',
    action_acted: '✓ Acted',
    toast_no_undo: 'Nothing to undo',
    toast_undo_done: 'Action undone',
    toast_added: 'Combatant added',
    toast_removed: 'Combatant removed',
    toast_name_required: 'Enter a name',
    toast_new_combat: 'New combat started',
    toast_clear_all: 'Everything cleared',
    damage_to: 'Damage to',
    heal_to: 'Heal to',
    apply_damage_btn: 'Apply Damage',
    apply_heal_btn: 'Apply Heal',
    rounds_reached: 'Rounds reached',
    confirm_new_combat: 'Start a new combat? The current list will be cleared.',
    confirm_clear_all: 'Clear everything and start from scratch? This cannot be undone.'
  }
};

function t(key) {
  const lang = state.settings.lang || 'it';
  return (translations[lang] && translations[lang][key]) || translations.it[key] || key;
}

function applyStaticTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.dataset.i18nTitle);
  });
  document.documentElement.lang = state.settings.lang || 'it';
}

// ---------------- STATO GLOBALE ----------------
const state = {
  mode: 'dnd',                    // 'dnd' | 'fabula' | 'pbta'
  round: 1,
  activeIndex: 0,
  spotlightId: null,
  combatants: [],
  history: [],
  settings: {
    sounds: true,
    haptics: true,
    animations: true,
    largeScreen: false,
    lang: 'it'
  }
};

const STORAGE_KEY = 'initiative_tracker_state';

// Combattente attualmente aperto in un pannello (danno/dettaglio)
let activeCombatantId = null;
let damageAmount = 1;
let damageIsHeal = false;

// ---------------- PERSISTENZA ----------------
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Impossibile salvare lo stato:', e);
  }
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(state, parsed);
      return true;
    }
  } catch (e) {
    console.warn('Impossibile caricare lo stato:', e);
  }
  return false;
}

// ---------------- UNDO / HISTORY ----------------
function pushHistory() {
  state.history.push(JSON.parse(JSON.stringify({
    combatants: state.combatants,
    round: state.round,
    activeIndex: state.activeIndex
  })));
  if (state.history.length > 20) state.history.shift();
}

function undo() {
  if (state.history.length === 0) {
    showToast(t('toast_no_undo'));
    return;
  }
  const previous = state.history.pop();
  state.combatants = previous.combatants;
  state.round = previous.round;
  state.activeIndex = previous.activeIndex;
  render();
  saveState();
  showToast(t('toast_undo_done'));
}

// ---------------- UTILITY ----------------
function uid() {
  return 'comb_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
}

function vibrate(ms) {
  if (state.settings.haptics && navigator.vibrate) {
    navigator.vibrate(ms);
  }
}

function playSound(type) {
  // Suoni semplici via WebAudio, nessun file esterno necessario
  if (!state.settings.sounds) return;
  try {
    const ctx = playSound._ctx || (playSound._ctx = new (window.AudioContext || window.webkitAudioContext)());
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const freqs = { turn: 440, damage: 180, heal: 660, round: 300, ko: 100 };
    osc.frequency.value = freqs[type] || 440;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch (e) { /* audio non disponibile, ignora */ }
}

let toastTimeout = null;
function showToast(message, kind) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast visible' + (kind ? ' ' + kind : '');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('visible');
  }, 1800);
}

function getHPColorVar(current, max) {
  if (current <= 0) return 'var(--hp-zero)';
  const pct = current / max;
  if (pct > 0.6) return 'var(--hp-full)';
  if (pct > 0.3) return 'var(--hp-mid)';
  if (pct > 0.1) return 'var(--hp-low)';
  return 'var(--hp-critical)';
}

function isCritical(current, max) {
  return max > 0 && (current / max) < 0.1 && current > 0;
}

// ---------------- GESTIONE COMBATTENTI ----------------
function addCombatant(data) {
  pushHistory();
  const count = Math.max(1, parseInt(data.count) || 1);
  for (let i = 0; i < count; i++) {
    const nameSuffix = count > 1 ? ` ${i + 1}` : '';
    const combatant = {
      id: uid(),
      name: data.name + nameSuffix,
      type: data.type,
      initiative: data.initiative !== null ? data.initiative : null,
      hp: data.hasHp ? { current: data.hpCurrent, max: data.hpMax } : null,
      statuses: [],
      hasActed: false,
      notes: '',
      isKO: false,
      addedAt: Date.now() + i
    };
    state.combatants.push(combatant);
  }
  sortCombatants();
  render();
  saveState();
  showToast(t('toast_added'));
}

function removeCombatant(id) {
  pushHistory();
  state.combatants = state.combatants.filter(c => c.id !== id);
  if (state.activeIndex >= state.combatants.length) state.activeIndex = 0;
  render();
  saveState();
  showToast(t('toast_removed'));
}

function sortCombatants() {
  if (state.mode === 'dnd') {
    state.combatants.sort((a, b) => (b.initiative || 0) - (a.initiative || 0));
  }
}

function markActed(id) {
  pushHistory();
  const c = state.combatants.find(x => x.id === id);
  if (c) c.hasActed = true;
  render();
  saveState();
}

function applyDamage(id, amount) {
  pushHistory();
  const c = state.combatants.find(x => x.id === id);
  if (!c || !c.hp) return;
  c.hp.current = Math.max(0, c.hp.current - amount);
  if (c.hp.current <= 0) {
    c.isKO = true;
    vibrate(200);
    playSound('ko');
  } else {
    playSound('damage');
  }
  render();
  saveState();
  showToast(`-${amount} HP ${state.settings.lang === 'en' ? 'to' : 'a'} ${c.name}`, 'damage');
  flashCard(id, 'damage-taken');
  checkVictory();
}

function applyHeal(id, amount) {
  pushHistory();
  const c = state.combatants.find(x => x.id === id);
  if (!c || !c.hp) return;
  c.hp.current = Math.min(c.hp.max, c.hp.current + amount);
  if (c.hp.current > 0) c.isKO = false;
  playSound('heal');
  render();
  saveState();
  showToast(`+${amount} HP ${state.settings.lang === 'en' ? 'to' : 'a'} ${c.name}`, 'heal');
  flashCard(id, 'healed');
}

function flashCard(id, className) {
  if (!state.settings.animations) return;
  requestAnimationFrame(() => {
    const el = document.querySelector(`.combatant-card[data-id="${id}"]`);
    if (el) {
      el.classList.add(className);
      setTimeout(() => el.classList.remove(className), 450);
    }
  });
}

function setInitiative(id, value) {
  pushHistory();
  const c = state.combatants.find(x => x.id === id);
  if (c) c.initiative = value;
  sortCombatants();
  render();
  saveState();
}

function addStatus(id, status) {
  if (!status.trim()) return;
  pushHistory();
  const c = state.combatants.find(x => x.id === id);
  if (c) c.statuses.push(status.trim());
  render();
  saveState();
}

function removeStatus(id, status) {
  pushHistory();
  const c = state.combatants.find(x => x.id === id);
  if (c) c.statuses = c.statuses.filter(s => s !== status);
  render();
  saveState();
}

function setNotes(id, notes) {
  const c = state.combatants.find(x => x.id === id);
  if (c) { c.notes = notes; saveState(); }
}

// ---------------- TURNI / ROUND ----------------
function nextTurn() {
  vibrate(40);
  playSound('turn');

  if (state.mode === 'dnd') {
    const c = state.combatants[state.activeIndex];
    if (c) c.hasActed = true;
    let next = state.activeIndex + 1;
    // salta i KO
    while (next < state.combatants.length && state.combatants[next].isKO) next++;
    if (next >= state.combatants.length) {
      newRound();
      return;
    }
    state.activeIndex = next;
  } else if (state.mode === 'fabula') {
    const heroes = state.combatants.filter(c => c.type === 'hero' || c.type === 'summon');
    const villains = state.combatants.filter(c => c.type === 'villain' || c.type === 'neutral');
    const allActed = heroes.every(c => c.hasActed) && villains.every(c => c.hasActed);
    if (allActed) {
      newRound();
      return;
    }
  }
  render();
  saveState();
}

function newRound() {
  pushHistory();
  state.round += 1;
  state.activeIndex = 0;
  state.combatants.forEach(c => { c.hasActed = false; });
  if (state.mode === 'dnd') {
    // salta eventuali KO all'inizio
    while (state.activeIndex < state.combatants.length && state.combatants[state.activeIndex].isKO) {
      state.activeIndex++;
    }
  }
  vibrate([50, 50, 50]);
  playSound('round');
  render();
  saveState();
  showRoundBanner();
}

function showRoundBanner() {
  const overlay = document.getElementById('round-banner-overlay');
  const text = document.getElementById('round-banner-text');
  text.textContent = `ROUND ${state.round}!`;
  overlay.classList.add('visible');
  setTimeout(() => overlay.classList.remove('visible'), 1500);
}

function checkVictory() {
  const villains = state.combatants.filter(c => c.type === 'villain');
  if (villains.length > 0 && villains.every(c => c.isKO)) {
    setTimeout(() => {
      const summary = document.getElementById('victory-summary');
      summary.innerHTML = `<p>${t('rounds_reached')}: ${state.round}</p>`;
      openModal('modal-victory');
      vibrate([100, 50, 100, 50, 200]);
    }, 400);
  }
}

// ---------------- RENDER ----------------
function render() {
  applyStaticTranslations();
  document.getElementById('round-value').textContent = state.round;
  const modeLabels = { dnd: t('mode_short_dnd'), fabula: t('mode_short_fabula'), pbta: t('mode_short_pbta') };
  document.getElementById('mode-value').textContent = modeLabels[state.mode];

  document.body.classList.toggle('large-screen', state.settings.largeScreen);
  document.body.classList.toggle('no-animations', !state.settings.animations);

  renderActiveBanner();
  renderList();
}

function renderActiveBanner() {
  const banner = document.getElementById('active-banner');
  if (state.mode === 'pbta') {
    banner.style.display = 'none';
    return;
  }
  let activeCombatant = null;
  if (state.mode === 'dnd') {
    activeCombatant = state.combatants[state.activeIndex];
  }
  if (state.mode === 'fabula' || !activeCombatant) {
    banner.style.display = state.mode === 'dnd' && !activeCombatant ? 'none' : (state.mode === 'fabula' ? 'none' : 'none');
  }

  if (state.mode === 'dnd' && activeCombatant) {
    banner.style.display = 'block';
    document.getElementById('active-banner-name').textContent = activeCombatant.name;
    const hpEl = document.getElementById('active-banner-hp');
    if (activeCombatant.hp) {
      hpEl.textContent = `HP: ${activeCombatant.hp.current}/${activeCombatant.hp.max}`;
    } else {
      hpEl.textContent = '';
    }
  } else {
    banner.style.display = 'none';
  }
}

function renderList() {
  const listEl = document.getElementById('combatant-list');
  const emptyEl = document.getElementById('empty-state');
  listEl.innerHTML = '';

  if (state.combatants.length === 0) {
    emptyEl.style.display = 'block';
    return;
  }
  emptyEl.style.display = 'none';

  if (state.mode === 'fabula') {
    renderFabulaGroups(listEl);
  } else {
    state.combatants.forEach((c, idx) => {
      listEl.appendChild(buildCombatantCard(c, idx));
    });
  }
}

function renderFabulaGroups(listEl) {
  const heroes = state.combatants.filter(c => c.type === 'hero' || c.type === 'summon');
  const villains = state.combatants.filter(c => c.type === 'villain' || c.type === 'neutral');

  const heroLabel = document.createElement('div');
  heroLabel.className = 'combatant-group-label';
  heroLabel.textContent = t('heroes_group');
  listEl.appendChild(heroLabel);
  heroes.forEach((c, idx) => listEl.appendChild(buildCombatantCard(c, idx)));

  const villainLabel = document.createElement('div');
  villainLabel.className = 'combatant-group-label';
  villainLabel.textContent = t('villains_group');
  listEl.appendChild(villainLabel);
  villains.forEach((c, idx) => listEl.appendChild(buildCombatantCard(c, idx)));
}

function buildCombatantCard(c, idx) {
  const card = document.createElement('div');
  card.className = 'combatant-card';
  card.dataset.id = c.id;
  card.dataset.type = c.type;

  const isActiveDnd = state.mode === 'dnd' && state.combatants[state.activeIndex] && state.combatants[state.activeIndex].id === c.id;
  const isSpotlight = state.mode === 'pbta' && state.spotlightId === c.id;

  if (isActiveDnd) card.classList.add('active');
  if (isSpotlight) card.classList.add('spotlight');
  if (c.hasActed && state.mode !== 'pbta') card.classList.add('acted');
  if (c.isKO) card.classList.add('ko');

  const typeLabels = { hero: t('type_hero'), villain: t('type_villain'), neutral: t('type_neutral'), summon: t('type_summon') };

  let topRow = `
    <div class="combatant-top-row">
      <span class="combatant-type-badge" data-type="${c.type}"></span>
      <span class="combatant-name">${escapeHtml(c.name)}</span>
    </div>
    <div class="combatant-subtitle">${typeLabels[c.type]}${c.hasActed && state.mode !== 'pbta' ? t('has_acted_suffix') : ''}</div>
  `;

  let initHtml = '';
  if (state.mode === 'dnd' && c.initiative !== null) {
    initHtml = `<div class="combatant-initiative">${c.initiative}</div>`;
  }

  let hpHtml = '';
  if (c.hp) {
    const pct = Math.max(0, Math.min(100, (c.hp.current / c.hp.max) * 100));
    const color = getHPColorVar(c.hp.current, c.hp.max);
    const critical = isCritical(c.hp.current, c.hp.max);
    hpHtml = `
      <div class="hp-bar-container">
        <div class="hp-bar-fill ${critical ? 'pulse-critical' : ''}" style="width:${pct}%; background:${color};"></div>
      </div>
      <div class="hp-text">HP: ${c.hp.current} / ${c.hp.max}</div>
    `;
  }

  let statusHtml = '';
  if (c.statuses.length > 0) {
    statusHtml = `<div class="status-badges-row">${c.statuses.map(s => `<span class="status-badge">${escapeHtml(s)}</span>`).join('')}</div>`;
  }

  let actionsHtml = '';
  if (state.mode === 'pbta') {
    actionsHtml = `<div class="combatant-actions-row">
      <button class="action-chip action-spotlight" data-action="spotlight">${isSpotlight ? t('spotlight_on') : t('spotlight_off')}</button>
    </div>`;
  } else {
    actionsHtml = `<div class="combatant-actions-row">
      ${c.hp ? `<button class="action-chip action-damage" data-action="damage">${t('action_damage')}</button><button class="action-chip action-heal" data-action="heal">${t('action_heal')}</button>` : ''}
      <button class="action-chip action-acted" data-action="acted">${t('action_acted')}</button>
    </div>`;
  }

  card.innerHTML = topRow + initHtml + hpHtml + statusHtml + actionsHtml;

  card.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('[data-action]');
    if (actionBtn) {
      e.stopPropagation();
      const action = actionBtn.dataset.action;
      if (action === 'damage') openDamageSheet(c.id, false);
      else if (action === 'heal') openDamageSheet(c.id, true);
      else if (action === 'acted') markActed(c.id);
      else if (action === 'spotlight') {
        state.spotlightId = state.spotlightId === c.id ? null : c.id;
        render();
        saveState();
      }
      return;
    }
    openDetailModal(c.id);
  });

  return card;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---------------- MODALI ----------------
function openModal(id) {
  document.getElementById(id).classList.add('visible');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('visible');
}

function openAddModal() {
  document.getElementById('input-name').value = '';
  document.getElementById('input-initiative').value = '';
  document.getElementById('input-hp-current').value = '';
  document.getElementById('input-hp-max').value = '';
  document.getElementById('input-count').value = 1;
  document.querySelector('input[name="type"][value="hero"]').checked = true;

  document.getElementById('init-field-group').style.display = state.mode === 'dnd' ? 'block' : 'none';
  document.getElementById('hp-field-group').style.display = state.mode === 'pbta' ? 'none' : 'block';

  openModal('modal-add');
  document.getElementById('input-name').focus();
}

function confirmAddCombatant() {
  const name = document.getElementById('input-name').value.trim();
  if (!name) {
    showToast(t('toast_name_required'));
    return;
  }
  const type = document.querySelector('input[name="type"]:checked').value;
  const initiative = state.mode === 'dnd'
    ? (parseInt(document.getElementById('input-initiative').value) || 0)
    : null;
  const hpCurrentRaw = document.getElementById('input-hp-current').value;
  const hpMaxRaw = document.getElementById('input-hp-max').value;
  const hasHp = state.mode !== 'pbta' && hpMaxRaw !== '';
  const hpMax = parseInt(hpMaxRaw) || 0;
  const hpCurrent = hpCurrentRaw !== '' ? parseInt(hpCurrentRaw) : hpMax;
  const count = parseInt(document.getElementById('input-count').value) || 1;

  addCombatant({ name, type, initiative, hasHp, hpCurrent, hpMax, count });
  closeModal('modal-add');
}

function openDetailModal(id) {
  activeCombatantId = id;
  const c = state.combatants.find(x => x.id === id);
  if (!c) return;
  const typeLabels = { hero: t('type_hero'), villain: t('type_villain'), neutral: t('type_neutral'), summon: t('type_summon') };

  document.getElementById('detail-name').textContent = c.name;
  document.getElementById('detail-subtitle').textContent = typeLabels[c.type] + (c.initiative !== null ? ` — ${t('initiative_label')} ${c.initiative}` : '');

  const hpBlock = document.getElementById('detail-hp-block');
  if (c.hp) {
    hpBlock.style.display = 'block';
    document.getElementById('detail-hp-text').textContent = `${c.hp.current} / ${c.hp.max}`;
    document.getElementById('detail-hp-current-value').textContent = c.hp.current;
    document.getElementById('detail-hp-max-value').textContent = c.hp.max;
    const pct = Math.max(0, Math.min(100, (c.hp.current / c.hp.max) * 100));
    const bar = document.getElementById('detail-hp-bar');
    bar.style.width = pct + '%';
    bar.style.background = getHPColorVar(c.hp.current, c.hp.max);
  } else {
    hpBlock.style.display = 'none';
  }

  renderStatusList(c);

  const initInput = document.getElementById('detail-initiative-input');
  initInput.style.display = state.mode === 'dnd' ? 'block' : 'none';
  initInput.value = c.initiative !== null ? c.initiative : '';

  document.getElementById('detail-notes').value = c.notes || '';

  openModal('modal-detail');
}

function renderStatusList(c) {
  const el = document.getElementById('detail-status-list');
  el.innerHTML = c.statuses.map(s =>
    `<span class="status-badge-removable" data-status="${escapeHtml(s)}">${escapeHtml(s)} ✕</span>`
  ).join('');
  el.querySelectorAll('.status-badge-removable').forEach(badge => {
    badge.addEventListener('click', () => {
      removeStatus(c.id, badge.dataset.status);
      renderStatusList(state.combatants.find(x => x.id === c.id));
    });
  });
}

function openDamageSheet(id, isHeal) {
  activeCombatantId = id;
  damageIsHeal = isHeal;
  damageAmount = 1;
  const c = state.combatants.find(x => x.id === id);
  if (!c || !c.hp) return;
  document.getElementById('damage-title').textContent = `${isHeal ? t('heal_to') : t('damage_to')}: ${c.name}`;
  document.getElementById('damage-current-hp').textContent = `${c.hp.current} / ${c.hp.max}`;
  document.getElementById('dmg-amount').textContent = damageAmount;
  const applyBtn = document.getElementById('btn-apply-damage');
  applyBtn.textContent = isHeal ? t('apply_heal_btn') : t('apply_damage_btn');
  applyBtn.className = isHeal ? 'btn-primary' : 'btn-primary';
  applyBtn.style.background = isHeal ? '#4caf50' : '#f44336';
  openModal('modal-damage');
}

// ---------------- EVENTI ----------------
function attachEvents() {
  document.getElementById('btn-add-open').addEventListener('click', openAddModal);
  document.getElementById('btn-confirm-add').addEventListener('click', confirmAddCombatant);
  document.getElementById('btn-roll-d20').addEventListener('click', () => {
    document.getElementById('input-initiative').value = Math.floor(Math.random() * 20) + 1;
  });

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.closeModal));
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('visible');
    });
  });

  document.getElementById('btn-next-turn').addEventListener('click', nextTurn);
  document.getElementById('btn-new-round').addEventListener('click', newRound);
  document.getElementById('btn-new-combat').addEventListener('click', confirmNewCombat);
  document.getElementById('btn-settings-new-combat').addEventListener('click', confirmNewCombat);
  document.getElementById('btn-settings-clear-all').addEventListener('click', confirmClearAll);

  document.getElementById('btn-settings').addEventListener('click', () => {
    document.querySelector(`input[name="mode"][value="${state.mode}"]`).checked = true;
    document.querySelector(`input[name="lang"][value="${state.settings.lang || 'it'}"]`).checked = true;
    document.getElementById('opt-sounds').checked = state.settings.sounds;
    document.getElementById('opt-haptics').checked = state.settings.haptics;
    document.getElementById('opt-animations').checked = state.settings.animations;
    document.getElementById('opt-largescreen').checked = state.settings.largeScreen;
    openModal('modal-settings');
  });

  document.querySelectorAll('input[name="lang"]').forEach(radio => {
    radio.addEventListener('change', () => {
      state.settings.lang = radio.value;
      render();
      saveState();
    });
  });

  document.querySelectorAll('input[name="mode"]').forEach(radio => {
    radio.addEventListener('change', () => {
      state.mode = radio.value;
      state.activeIndex = 0;
      state.spotlightId = null;
      sortCombatants();
      render();
      saveState();
    });
  });

  document.getElementById('opt-sounds').addEventListener('change', (e) => { state.settings.sounds = e.target.checked; saveState(); });
  document.getElementById('opt-haptics').addEventListener('change', (e) => { state.settings.haptics = e.target.checked; saveState(); });
  document.getElementById('opt-animations').addEventListener('change', (e) => { state.settings.animations = e.target.checked; render(); saveState(); });
  document.getElementById('opt-largescreen').addEventListener('change', (e) => { state.settings.largeScreen = e.target.checked; render(); saveState(); });

  // Danno/cura bottom sheet
  document.getElementById('dmg-increase').addEventListener('click', () => {
    damageAmount++;
    document.getElementById('dmg-amount').textContent = damageAmount;
  });
  document.getElementById('dmg-decrease').addEventListener('click', () => {
    damageAmount = Math.max(1, damageAmount - 1);
    document.getElementById('dmg-amount').textContent = damageAmount;
  });
  document.querySelectorAll('[data-dmg-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
      damageAmount = parseInt(btn.dataset.dmgPreset);
      document.getElementById('dmg-amount').textContent = damageAmount;
    });
  });
  document.getElementById('btn-dmg-crit').addEventListener('click', () => {
    damageAmount = damageAmount * 2;
    document.getElementById('dmg-amount').textContent = damageAmount;
  });
  document.getElementById('btn-apply-damage').addEventListener('click', () => {
    if (!activeCombatantId) return;
    if (damageIsHeal) applyHeal(activeCombatantId, damageAmount);
    else applyDamage(activeCombatantId, damageAmount);
    closeModal('modal-damage');
  });

  // Dettaglio combattente
  document.querySelectorAll('[data-hp-delta]').forEach(btn => {
    btn.addEventListener('click', () => {
      const delta = parseInt(btn.dataset.hpDelta);
      if (!activeCombatantId) return;
      if (delta > 0) applyHeal(activeCombatantId, delta);
      else applyDamage(activeCombatantId, Math.abs(delta));
      openDetailModal(activeCombatantId);
    });
  });
  document.querySelectorAll('[data-hpmax-delta]').forEach(btn => {
    btn.addEventListener('click', () => {
      const delta = parseInt(btn.dataset.hpmaxDelta);
      const c = state.combatants.find(x => x.id === activeCombatantId);
      if (!c || !c.hp) return;
      pushHistory();
      c.hp.max = Math.max(1, c.hp.max + delta);
      c.hp.current = Math.min(c.hp.current, c.hp.max);
      render();
      saveState();
      openDetailModal(activeCombatantId);
    });
  });
  document.getElementById('btn-add-status').addEventListener('click', () => {
    const input = document.getElementById('input-new-status');
    if (!activeCombatantId) return;
    addStatus(activeCombatantId, input.value);
    input.value = '';
    renderStatusList(state.combatants.find(x => x.id === activeCombatantId));
  });
  document.getElementById('detail-initiative-input').addEventListener('change', (e) => {
    if (!activeCombatantId) return;
    setInitiative(activeCombatantId, parseInt(e.target.value) || 0);
  });
  document.getElementById('detail-notes').addEventListener('change', (e) => {
    if (!activeCombatantId) return;
    setNotes(activeCombatantId, e.target.value);
  });
  document.getElementById('btn-mark-acted').addEventListener('click', () => {
    if (!activeCombatantId) return;
    markActed(activeCombatantId);
    closeModal('modal-detail');
  });
  document.getElementById('btn-remove-combatant').addEventListener('click', () => {
    if (!activeCombatantId) return;
    removeCombatant(activeCombatantId);
    closeModal('modal-detail');
  });

  // Scorciatoie da tastiera
  document.addEventListener('keydown', (e) => {
    // Ignora se si sta scrivendo in un campo
    const tag = document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.code === 'Space' || e.key === 'Enter') {
      e.preventDefault();
      nextTurn();
    } else if (e.key === 'n' || e.key === 'N') {
      newRound();
    } else if (e.key === 'a' || e.key === 'A') {
      openAddModal();
    } else if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.visible').forEach(m => m.classList.remove('visible'));
    } else if ((e.key === 'z' || e.key === 'Z') && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      undo();
    } else if (e.key >= '1' && e.key <= '9') {
      const idx = parseInt(e.key) - 1;
      const cards = document.querySelectorAll('.combatant-card');
      if (cards[idx]) cards[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

function confirmNewCombat() {
  if (state.combatants.length > 0 && !confirm(t('confirm_new_combat'))) return;
  pushHistory();
  state.combatants = [];
  state.round = 1;
  state.activeIndex = 0;
  state.spotlightId = null;
  render();
  saveState();
  closeModal('modal-settings');
  showToast(t('toast_new_combat'));
}

function confirmClearAll() {
  if (!confirm(t('confirm_clear_all'))) return;
  localStorage.removeItem(STORAGE_KEY);
  state.combatants = [];
  state.round = 1;
  state.activeIndex = 0;
  state.spotlightId = null;
  state.history = [];
  render();
  closeModal('modal-settings');
  showToast(t('toast_clear_all'));
}

// ---------------- INIZIALIZZAZIONE ----------------
function init() {
  const restored = loadState();
  attachEvents();
  render();
  if (restored && state.combatants.length > 0) {
    const banner = document.getElementById('restore-banner');
    banner.style.display = 'block';
    setTimeout(() => { banner.style.display = 'none'; }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', init);
