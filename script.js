const state = {
    mode: 'dnd',
    round: 1,
    activeIndex: 0,
    combatants: []
};

function render() {
    const list = document.getElementById('combatant-list');
    list.innerHTML = state.combatants.map((c, i) => `
        <div class="combatant-card ${i === state.activeIndex ? 'active' : ''}">
            <div>
                <div class="combatant-name">${c.name}</div>
                <div>HP: ${c.hp}</div>
            </div>
            <div class="initiative">${c.init}</div>
        </div>
    `).join('');
    document.getElementById('round-display').innerText = `Round: ${state.round}`;
}

document.getElementById('btn-next').addEventListener('click', () => {
    state.activeIndex = (state.activeIndex + 1) % state.combatants.length;
    if (state.activeIndex === 0) state.round++;
    render();
    localStorage.setItem('initiative_data', JSON.stringify(state));
});

// Caricamento iniziale
const saved = localStorage.getItem('initiative_data');
if (saved) Object.assign(state, JSON.parse(saved));
render();
