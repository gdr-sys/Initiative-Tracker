const state = {
  mode: 'dnd',
  round: 1,
  combatants: [],
  history: []
};

function saveState() {
  localStorage.setItem('initiative_tracker_state', JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem('initiative_tracker_state');
  if (saved) Object.assign(state, JSON.parse(saved));
  render();
}

function render() {
  const list = document.getElementById('combatant-list');
  list.innerHTML = state.combatants.map(c => `
    <div class="combatant-card ${state.combatants.indexOf(c) === state.activeIndex ? 'active' : ''}">
      <div class="combatant-name">${c.name}</div>
      <div class="hp-text">HP: ${c.hp.current}/${c.hp.max}</div>
    </div>
  `).join('');
}

document.getElementById('btn-next').addEventListener('click', () => {
  // Logica next turn
  render();
  saveState();
});

loadState();
