// =============================================================
//  NAVIGATION
// =============================================================

let currentMode = null;

function setMode(mode) {
    currentMode = mode;
    document.getElementById('modeSelect').classList.add('hidden');
    document.getElementById('screenDnd').classList.add('hidden');
    document.getElementById('screenSea').classList.add('hidden');

    if (mode === 'dnd') {
        document.getElementById('screenDnd').classList.remove('hidden');
        dndRender();
    } else if (mode === 'sea') {
        document.getElementById('screenSea').classList.remove('hidden');
        seaRender();
    }
}

function goBack() {
    document.getElementById('screenDnd').classList.add('hidden');
    document.getElementById('screenSea').classList.add('hidden');
    document.getElementById('modeSelect').classList.remove('hidden');
}

// =============================================================
//  UTILITY
// =============================================================

function generateId() {
    return '_' + Math.random().toString(36).substring(2, 9);
}

// =============================================================
//  D&D — STATO
// =============================================================

let dndCharacters = [];
let dndTurnIndex = 0;
let dndRoundNum = 1;

// Gradiente fluido: verde (ratio=1) → giallo → arancione → rosso (ratio=0)
function getHpColor(ratio) {
    ratio = Math.max(0, Math.min(1, ratio));
    let r, g;
    if (ratio > 0.5) {
        const t = (ratio - 0.5) * 2; // 1→0
        r = Math.round(220 * (1 - t));
        g = 200;
    } else {
        const t = ratio * 2; // 1→0
        r = 220;
        g = Math.round(200 * t);
    }
    return `rgb(${r}, ${g}, 40)`;
}

// --- Aggiungi personaggio ---
function dndAddCharacter() {
    const name       = document.getElementById('dndName').value.trim();
    const initiative = parseInt(document.getElementById('dndInitiative').value);
    const hp         = parseInt(document.getElementById('dndHp').value);
    const ca         = parseInt(document.getElementById('dndCa').value);

    if (!name)                    return alert('Inserisci un nome!');
    if (isNaN(initiative))        return alert('Inserisci un valore di iniziativa!');
    if (isNaN(hp) || hp <= 0)     return alert('Inserisci HP validi!');
    if (isNaN(ca) || ca <= 0)     return alert('Inserisci CA valida!');

    dndCharacters.push({
        id: generateId(),
        name, initiative,
        hpMax: hp, hpCurrent: hp, hpTemp: 0,
        ca
    });

    dndCharacters.sort((a, b) => b.initiative - a.initiative);

    document.getElementById('dndName').value = '';
    document.getElementById('dndInitiative').value = '';
    document.getElementById('dndHp').value = '';
    document.getElementById('dndCa').value = '';
    document.getElementById('dndName').focus();

    dndRender();
}

// --- Rimuovi personaggio ---
function dndRemoveCharacter(id) {
    const i = dndCharacters.findIndex(c => c.id === id);
    if (i === -1) return;
    dndCharacters.splice(i, 1);
    if (dndCharacters.length === 0) {
        dndTurnIndex = 0;
    } else if (dndTurnIndex >= dndCharacters.length) {
        dndTurnIndex = 0;
        dndRoundNum++;
    }
    dndRender();
}

// --- Prossimo turno ---
function dndNextTurn() {
    if (dndCharacters.length === 0) return;
    dndTurnIndex++;
    if (dndTurnIndex >= dndCharacters.length) {
        dndTurnIndex = 0;
        dndRoundNum++;
    }
    dndRender();
}

// --- Reset ---
function dndReset() {
    if (!confirm('Sei sicuro di voler resettare il tracker D&D?')) return;
    dndCharacters = [];
    dndTurnIndex  = 0;
    dndRoundNum   = 1;
    dndRender();
}

// --- Cura ---
function dndHeal() {
    const char = dndCharacters.find(c => c.id === document.getElementById('dndTarget').value);
    const val  = parseInt(document.getElementById('dndActionVal').value);
    if (!char)              return alert('Seleziona un bersaglio!');
    if (isNaN(val) || val <= 0) return alert('Valore non valido!');
    char.hpCurrent = Math.min(char.hpCurrent + val, char.hpMax);
    document.getElementById('dndActionVal').value = '';
    dndRender();
}

// --- Attacco ---
function dndAttack() {
    const char = dndCharacters.find(c => c.id === document.getElementById('dndTarget').value);
    const val  = parseInt(document.getElementById('dndActionVal').value);
    if (!char)              return alert('Seleziona un bersaglio!');
    if (isNaN(val) || val <= 0) return alert('Valore non valido!');

    let dmg = val;

    // Prima toglie dai PF temporanei
    if (char.hpTemp > 0) {
        if (char.hpTemp >= dmg) {
            char.hpTemp -= dmg;
            dmg = 0;
        } else {
            dmg -= char.hpTemp;
            char.hpTemp = 0;
        }
    }

    // Poi dai PF normali
    if (dmg > 0) {
        char.hpCurrent = Math.max(char.hpCurrent - dmg, 0);
    }

    document.getElementById('dndActionVal').value = '';
    dndRender();
}

// --- PF Temporanei ---
function dndAddTemp() {
    const char = dndCharacters.find(c => c.id === document.getElementById('dndTarget').value);
    const val  = parseInt(document.getElementById('dndActionVal').value);
    if (!char)              return alert('Seleziona un bersaglio!');
    if (isNaN(val) || val <= 0) return alert('Valore non valido!');
    // Regola D&D 5e: non si sommano, si tiene il più alto
    char.hpTemp = Math.max(char.hpTemp, val);
    document.getElementById('dndActionVal').value = '';
    dndRender();
}

// --- Render D&D ---
function dndRender() {
    document.getElementById('dndRound').textContent = dndRoundNum;

    const list = document.getElementById('dndList');
    list.innerHTML = '';

    if (dndCharacters.length === 0) {
        list.innerHTML = '<p class="empty-msg">Nessun personaggio aggiunto.</p>';
    }

    dndCharacters.forEach((char, index) => {
        const isActive   = index === dndTurnIndex;
        const isDead     = char.hpCurrent <= 0;
        const hpRatio    = Math.max(char.hpCurrent / char.hpMax, 0);
        const hpColor    = getHpColor(hpRatio);
        const tempWidth  = Math.min(((char.hpCurrent + char.hpTemp) / char.hpMax) * 100, 100);

        const card = document.createElement('div');
        card.className = 'character-card' +
            (isActive ? ' active-turn' : '') +
            (isDead   ? ' dead'        : '');

        card.innerHTML = `
            <div class="card-header">
                <div class="card-info">
                    <span class="turn-indicator">${isActive ? '▶' : ''}</span>
                    <strong class="char-name">${char.name}</strong>
                    <span class="badge badge-ini">INI ${char.initiative}</span>
                    <span class="badge badge-ca">CA ${char.ca}</span>
                </div>
                <button class="btn-remove" onclick="dndRemoveCharacter('${char.id}')">✕</button>
            </div>
            <div class="card-hp">
                <div class="hp-bar-container">
                    ${char.hpTemp > 0
                        ? `<div class="hp-bar-temp" style="width:${tempWidth}%"></div>`
                        : ''}
                    <div class="hp-bar" style="width:${hpRatio * 100}%; background:${hpColor};"></div>
                </div>
                <div class="hp-text">
                    <span class="hp-numbers">${char.hpCurrent} / ${char.hpMax} HP</span>
                    ${char.hpTemp > 0
                        ? `<span class="hp-temp-text">+${char.hpTemp} temp</span>`
                        : ''}
                    ${isDead ? '<span class="dead-label">💀 KO</span>' : ''}
                </div>
            </div>
        `;

        list.appendChild(card);
    });

    // Aggiorna select bersaglio
    const sel  = document.getElementById('dndTarget');
    const prev = sel.value;
    sel.innerHTML = '<option value="">-- Seleziona bersaglio --</option>';
    dndCharacters.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.name} (${c.hpCurrent}/${c.hpMax})`;
        sel.appendChild(opt);
    });
    if (dndCharacters.find(c => c.id === prev)) sel.value = prev;
}

// =============================================================
//  7TH SEA — STATO
// =============================================================

let seaCharacters  = [];
let seaTurnIndex   = -1;

// --- Ordina per raises rimanenti decrescenti ---
function seaSort() {
    seaCharacters.sort((a, b) => {
        if (b.raisesRemaining !== a.raisesRemaining)
            return b.raisesRemaining - a.raisesRemaining;
        return a.name.localeCompare(b.name);
    });
}

// --- Aggiungi personaggio ---
function seaAddCharacter() {
    const name   = document.getElementById('seaName').value.trim();
    const raises = parseInt(document.getElementById('seaRaises').value);

    if (!name)                      return alert('Inserisci un nome!');
    if (isNaN(raises) || raises < 0) return alert('Inserisci un numero di raises valido!');

    seaCharacters.push({
        id: generateId(),
        name,
        raisesTotal:     raises,
        raisesRemaining: raises
    });

    seaSort();

    document.getElementById('seaName').value   = '';
    document.getElementById('seaRaises').value = '';
    document.getElementById('seaName').focus();

    if (seaCharacters.length === 1) seaTurnIndex = 0;

    seaRender();
}

// --- Rimuovi personaggio ---
function seaRemoveCharacter(id) {
    const i = seaCharacters.findIndex(c => c.id === id);
    if (i === -1) return;
    seaCharacters.splice(i, 1);
    if (seaCharacters.length === 0) {
        seaTurnIndex = -1;
    } else if (seaTurnIndex >= seaCharacters.length) {
        seaTurnIndex = 0;
    }
    seaRender();
}

// --- Trova il prossimo con raises > 0 ---
function seaFindNext() {
    for (let i = 0; i < seaCharacters.length; i++) {
        if (seaCharacters[i].raisesRemaining > 0) return i;
    }
    return -1;
}

// --- Prossima azione ---
function seaNextAction() {
    if (seaCharacters.length === 0) return;

    // Consuma una raise dal personaggio corrente
    if (seaTurnIndex >= 0 && seaTurnIndex < seaCharacters.length) {
        const cur = seaCharacters[seaTurnIndex];
        if (cur.raisesRemaining > 0) cur.raisesRemaining--;
    }

    seaSort();

    const next = seaFindNext();
    if (next === -1) {
        seaTurnIndex = -1;
        alert('🏁 Round terminato! Tutti hanno esaurito le raises.');
    } else {
        seaTurnIndex = next;
    }

    seaRender();
}

// --- Reset ---
function seaReset() {
    if (!confirm('Sei sicuro di voler resettare il tracker 7th Sea?')) return;
    seaCharacters = [];
    seaTurnIndex  = -1;
    seaRender();
}

// --- Aggiungi raises ---
function seaAddRaises() {
    const char = seaCharacters.find(c => c.id === document.getElementById('seaTarget').value);
    const val  = parseInt(document.getElementById('seaModVal').value);
    if (!char)              return alert('Seleziona un personaggio!');
    if (isNaN(val) || val <= 0) return alert('Valore non valido!');
    char.raisesRemaining += val;
    char.raisesTotal     += val;
    seaSort();
    seaRender();
}

// --- Rimuovi raises ---
function seaRemoveRaises() {
    const char = seaCharacters.find(c => c.id === document.getElementById('seaTarget').value);
    const val  = parseInt(document.getElementById('seaModVal').value);
    if (!char)              return alert('Seleziona un personaggio!');
    if (isNaN(val) || val <= 0) return alert('Valore non valido!');
    char.raisesRemaining = Math.max(char.raisesRemaining - val, 0);
    seaSort();
    if (seaFindNext() === -1) seaTurnIndex = -1;
    seaRender();
}

// --- Imposta raises ---
function seaSetRaises() {
    const char = seaCharacters.find(c => c.id === document.getElementById('seaTarget').value);
    const val  = parseInt(document.getElementById('seaModVal').value);
    if (!char)             return alert('Seleziona un personaggio!');
    if (isNaN(val) || val < 0) return alert('Valore non valido!');
    char.raisesRemaining = val;
    char.raisesTotal     = Math.max(char.raisesTotal, val);
    seaSort();
    seaRender();
}

// --- Render 7th Sea ---
function seaRender() {
    const cur = document.getElementById('seaCurrent');
    if (seaTurnIndex >= 0 && seaTurnIndex < seaCharacters.length) {
        const c = seaCharacters[seaTurnIndex];
        cur.textContent = `${c.name} (${c.raisesRemaining} raises)`;
    } else {
        cur.textContent = '—';
    }

    const list = document.getElementById('seaList');
    list.innerHTML = '';

    if (seaCharacters.length === 0) {
        list.innerHTML = '<p class="empty-msg">Nessun personaggio aggiunto.</p>';
        // Aggiorna select vuota
        document.getElementById('seaTarget').innerHTML =
            '<option value="">-- Seleziona personaggio --</option>';
        return;
    }

    seaCharacters.forEach((char, index) => {
        const isActive    = index === seaTurnIndex;
        const isExhausted = char.raisesRemaining === 0;

        const card = document.createElement('div');
        card.className = 'character-card sea-card' +
            (isActive    ? ' active-turn' : '') +
            (isExhausted ? ' exhausted'   : '');

        // Pallini raises
        let dotsHtml = '';
        const total = Math.max(char.raisesTotal, char.raisesRemaining);
        for (let i = 0; i < total; i++) {
            const spent = i >= char.raisesRemaining;
            dotsHtml += `<div class="raise-dot${spent ? ' spent' : ''}"></div>`;
        }

        card.innerHTML = `
            <div class="card-header">
                <div class="card-info">
                    <span class="turn-indicator sea">${isActive ? '▶' : ''}</span>
                    <strong class="char-name">${char.name}</strong>
                    <span class="badge badge-raises ${isExhausted ? 'zero' : ''}">
                        ${char.raisesRemaining} / ${char.raisesTotal} Raises
                    </span>
                </div>
                <button class="btn-remove" onclick="seaRemoveCharacter('${char.id}')">✕</button>
            </div>
            <div class="raises-dots">${dotsHtml}</div>
        `;

        list.appendChild(card);
    });

    // Aggiorna select
    const sel  = document.getElementById('seaTarget');
    const prev = sel.value;
    sel.innerHTML = '<option value="">-- Seleziona personaggio --</option>';
    seaCharacters.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.name} (${c.raisesRemaining}/${c.raisesTotal})`;
        sel.appendChild(opt);
    });
    if (seaCharacters.find(c => c.id === prev)) sel.value = prev;
}

// =============================================================
//  KEYBOARD SHORTCUTS
// =============================================================

document.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;

    // D&D: aggiungi con Enter nei campi input
    const dndFields = ['dndName','dndInitiative','dndHp','dndCa'];
    if (dndFields.includes(document.activeElement.id)) {
        dndAddCharacter();
        return;
    }

    // D&D: Enter nel campo valore azione → attacca
    if (document.activeElement.id === 'dndActionVal') {
        dndAttack();
        return;
    }

    // 7th Sea: aggiungi con Enter
    const seaFields = ['seaName','seaRaises'];
    if (seaFields.includes(document.activeElement.id)) {
        seaAddCharacter();
        return;
    }
});