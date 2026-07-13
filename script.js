/* ═══════════════════════════════════════════════════════════════
   INITIATIVE TRACKER — SCRIPT.JS
   Vanilla JS, localStorage persistence
   ═══════════════════════════════════════════════════════════════ */

// ─── UTILITIES ───
function $(id) { return document.getElementById(id); }
function genId() { return '_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36); }
function save(key, data) { localStorage.setItem('it_' + key, JSON.stringify(data)); }
function load(key, def) { try { const d = localStorage.getItem('it_' + key); return d ? JSON.parse(d) : def; } catch { return def; } }

// HP color gradient
function hpColor(ratio) {
    ratio = Math.max(0, Math.min(1, ratio));
    let r, g;
    if (ratio > 0.5) {
        const t = (ratio - 0.5) * 2;
        r = Math.round(220 * (1 - t));
        g = 200;
    } else {
        const t = ratio * 2;
        r = 220;
        g = Math.round(200 * t);
    }
    return `rgb(${r}, ${g}, 40)`;
}

// ─── NAVIGATION ───
let currentMode = load('mode', 'menu');

function setMode(mode) {
    currentMode = mode;
    save('mode', mode);
    showScreen(mode);
    if (mode === 'dnd') dndRender();
    if (mode === 'fabula') fabRender();
    if (mode === 'pbta') pbtaRender();
    if (mode === 'sea') seaRender();
    if (mode === 'generic') genRender();
}

function goBack() {
    setMode('menu');
}

function showScreen(mode) {
    $('menuScreen').classList.toggle('hidden', mode !== 'menu');
    $('dndScreen').classList.toggle('hidden', mode !== 'dnd');
    $('fabulaScreen').classList.toggle('hidden', mode !== 'fabula');
    $('pbtaScreen').classList.toggle('hidden', mode !== 'pbta');
    $('seaScreen').classList.toggle('hidden', mode !== 'sea');
    $('genericScreen').classList.toggle('hidden', mode !== 'generic');
}

// ═══════════════════════════════════════════════════════════════
// D&D TRACKER
// ═══════════════════════════════════════════════════════════════
let dndChars = load('dnd_chars', []);
let dndTurn = load('dnd_turn', 0);
let dndRound = load('dnd_round', 1);

function dndSave() {
    save('dnd_chars', dndChars);
    save('dnd_turn', dndTurn);
    save('dnd_round', dndRound);
}

function dndRollD20() {
    $('dndIni').value = Math.floor(Math.random() * 20) + 1;
}

function dndAdd() {
    const name = $('dndName').value.trim();
    const ini = parseInt($('dndIni').value);
    const hp = parseInt($('dndHp').value);
    const ca = parseInt($('dndCa').value);
    if (!name || isNaN(ini) || isNaN(hp) || hp <= 0 || isNaN(ca) || ca <= 0) return;
    
    dndChars.push({ id: genId(), name, initiative: ini, hpMax: hp, hpCurrent: hp, hpTemp: 0, ca, acted: false });
    dndChars.sort((a, b) => b.initiative - a.initiative);
    dndSave();
    dndRender();
    
    $('dndName').value = '';
    $('dndIni').value = '';
    $('dndHp').value = '';
    $('dndCa').value = '';
    $('dndName').focus();
}

function dndRemove(id) {
    const idx = dndChars.findIndex(c => c.id === id);
    dndChars = dndChars.filter(c => c.id !== id);
    if (dndChars.length === 0) dndTurn = 0;
    else if (idx < dndTurn) dndTurn--;
    else if (dndTurn >= dndChars.length) dndTurn = 0;
    dndSave();
    dndRender();
}

function dndNextTurn() {
    if (dndChars.length === 0) return;
    dndChars[dndTurn].acted = true;
    dndTurn++;
    let attempts = 0;
    while (attempts < dndChars.length) {
        if (dndTurn >= dndChars.length) {
            dndTurn = 0;
            dndRound++;
            dndChars.forEach(c => c.acted = false);
        }
        if (dndChars[dndTurn].hpCurrent > 0) break;
        dndTurn++;
        attempts++;
    }
    dndSave();
    dndRender();
}

function dndNewRound() {
    dndTurn = 0;
    dndRound++;
    dndChars.forEach(c => c.acted = false);
    dndSave();
    dndRender();
}

function dndReset() {
    if (!confirm('Resettare il tracker D&D?')) return;
    dndChars = [];
    dndTurn = 0;
    dndRound = 1;
    dndSave();
    dndRender();
}

function dndHeal() {
    const id = $('dndTarget').value;
    const val = parseInt($('dndValue').value);
    if (!id || isNaN(val) || val <= 0) return;
    const c = dndChars.find(x => x.id === id);
    if (c) c.hpCurrent = Math.min(c.hpCurrent + val, c.hpMax);
    $('dndValue').value = '';
    dndSave();
    dndRender();
}

function dndDamage() {
    const id = $('dndTarget').value;
    const val = parseInt($('dndValue').value);
    if (!id || isNaN(val) || val <= 0) return;
    const c = dndChars.find(x => x.id === id);
    if (c) {
        let dmg = val;
        if (c.hpTemp > 0) {
            if (c.hpTemp >= dmg) { c.hpTemp -= dmg; dmg = 0; }
            else { dmg -= c.hpTemp; c.hpTemp = 0; }
        }
        if (dmg > 0) c.hpCurrent = Math.max(c.hpCurrent - dmg, 0);
    }
    $('dndValue').value = '';
    dndSave();
    dndRender();
}

function dndTemp() {
    const id = $('dndTarget').value;
    const val = parseInt($('dndValue').value);
    if (!id || isNaN(val) || val <= 0) return;
    const c = dndChars.find(x => x.id === id);
    if (c) c.hpTemp = Math.max(c.hpTemp, val);
    $('dndValue').value = '';
    dndSave();
    dndRender();
}

function dndRender() {
    $('dndRound').textContent = dndRound;
    const list = $('dndList');
    const sel = $('dndTarget');
    
    if (dndChars.length === 0) {
        list.innerHTML = '<div class="empty-state"><div class="empty-icon">🎭</div><p>Nessun personaggio</p></div>';
        $('dndActionsPanel').style.display = 'none';
        return;
    }
    
    $('dndActionsPanel').style.display = 'block';
    
    let html = '';
    dndChars.forEach((c, i) => {
        const active = i === dndTurn;
        const dead = c.hpCurrent <= 0;
        const ratio = c.hpMax > 0 ? c.hpCurrent / c.hpMax : 0;
        const color = hpColor(ratio);
        const totalRatio = c.hpMax > 0 ? Math.min((c.hpCurrent + c.hpTemp) / c.hpMax, 1.5) : 0;
        
        let cls = 'char-card';
        if (active) cls += ' active gold';
        else if (dead) cls += ' dead';
        else if (c.acted) cls += ' acted';
        
        html += `<div class="${cls}">
            <div class="char-header">
                <div class="char-info">
                    <div class="char-name-row">
                        ${active ? '<span class="turn-indicator gold">▶</span>' : ''}
                        <span class="char-name">${c.name}</span>
                    </div>
                    <div class="char-badges">
                        <span class="badge ini">INI ${c.initiative}</span>
                        <span class="badge ca">CA ${c.ca}</span>
                        ${dead ? '<span class="badge ko">💀 KO</span>' : ''}
                        ${c.acted && !dead ? '<span class="badge acted">✓ Agito</span>' : ''}
                    </div>
                </div>
                <div class="char-buttons">
                    <button class="btn-icon remove" onclick="dndRemove('${c.id}')">✕</button>
                </div>
            </div>
            <div class="hp-section">
                <div class="hp-bar-track">
                    ${c.hpTemp > 0 ? `<div class="hp-bar-temp" style="width:${Math.min(totalRatio * 100, 100)}%"></div>` : ''}
                    <div class="hp-bar-fill" style="width:${ratio * 100}%;background:${color}"></div>
                </div>
                <div class="hp-text">
                    <span class="hp-current" style="color:${color}">${c.hpCurrent} / ${c.hpMax} HP</span>
                    ${c.hpTemp > 0 ? `<span class="hp-temp">+${c.hpTemp} temp</span>` : ''}
                </div>
            </div>
        </div>`;
    });
    list.innerHTML = html;
    
    // Update select
    const prevVal = sel.value;
    sel.innerHTML = '<option value="">— Seleziona bersaglio —</option>';
    dndChars.forEach(c => {
        sel.innerHTML += `<option value="${c.id}">${c.name} (${c.hpCurrent}/${c.hpMax})</option>`;
    });
    if (dndChars.find(c => c.id === prevVal)) sel.value = prevVal;
}

// ═══════════════════════════════════════════════════════════════
// FABULA ULTIMA TRACKER
// ═══════════════════════════════════════════════════════════════
let fabChars = load('fab_chars', []);
let fabRound = load('fab_round', 1);
let fabLastFaction = load('fab_last', 'villain');
let fabCurrentFaction = 'hero';

function fabSave() {
    save('fab_chars', fabChars);
    save('fab_round', fabRound);
    save('fab_last', fabLastFaction);
}

function fabSetFaction(f) {
    fabCurrentFaction = f;
    $('fabHeroBtn').classList.toggle('active', f === 'hero');
    $('fabHeroBtn').classList.toggle('green', f === 'hero');
    $('fabVillainBtn').classList.toggle('active', f === 'villain');
    $('fabVillainBtn').classList.toggle('red', f === 'villain');
}

function fabAdd() {
    const name = $('fabName').value.trim();
    const hp = parseInt($('fabHp').value);
    if (!name || isNaN(hp) || hp <= 0) return;
    
    fabChars.push({ id: genId(), name, faction: fabCurrentFaction, hpMax: hp, hpCurrent: hp, acted: false });
    fabSave();
    fabRender();
    
    $('fabName').value = '';
    $('fabHp').value = '';
    $('fabName').focus();
}

function fabRemove(id) {
    fabChars = fabChars.filter(c => c.id !== id);
    fabSave();
    fabRender();
}

function fabToggle(id) {
    const c = fabChars.find(x => x.id === id);
    if (c) {
        c.acted = !c.acted;
        if (c.acted) fabLastFaction = c.faction;
    }
    fabSave();
    fabRender();
}

function fabModHp(id, delta) {
    const c = fabChars.find(x => x.id === id);
    if (c) c.hpCurrent = Math.max(0, Math.min(c.hpMax, c.hpCurrent + delta));
    fabSave();
    fabRender();
}

function fabNewRound() {
    fabRound++;
    fabChars.forEach(c => c.acted = false);
    fabLastFaction = 'villain';
    fabSave();
    fabRender();
}

function fabReset() {
    if (!confirm('Resettare il tracker Fabula Ultima?')) return;
    fabChars = [];
    fabRound = 1;
    fabLastFaction = 'villain';
    fabSave();
    fabRender();
}

function fabRender() {
    $('fabRound').textContent = fabRound;
    
    const heroes = fabChars.filter(c => c.faction === 'hero');
    const villains = fabChars.filter(c => c.faction === 'villain');
    const allActed = fabChars.length > 0 && fabChars.every(c => c.acted || c.hpCurrent <= 0);
    const nextFac = fabLastFaction === 'hero' ? 'villain' : 'hero';
    
    $('fabNextFaction').textContent = nextFac === 'hero' ? '🛡️ Eroi' : '👹 Cattivi';
    $('fabNextFaction').className = 'next-faction ' + (nextFac === 'hero' ? 'green' : 'red');
    $('fabAllActed').style.display = allActed ? 'block' : 'none';
    
    $('fabEmpty').style.display = fabChars.length === 0 ? 'block' : 'none';
    $('fabHeroSection').style.display = heroes.length > 0 ? 'block' : 'none';
    $('fabVillainSection').style.display = villains.length > 0 ? 'block' : 'none';
    
    $('fabHeroCount').textContent = `${heroes.filter(c => c.acted).length}/${heroes.length}`;
    $('fabVillainCount').textContent = `${villains.filter(c => c.acted).length}/${villains.length}`;
    
    $('fabHeroList').innerHTML = heroes.map(c => fabCardHtml(c)).join('');
    $('fabVillainList').innerHTML = villains.map(c => fabCardHtml(c)).join('');
}

function fabCardHtml(c) {
    const dead = c.hpCurrent <= 0;
    const ratio = c.hpMax > 0 ? c.hpCurrent / c.hpMax : 0;
    const color = hpColor(ratio);
    const isHero = c.faction === 'hero';
    
    let cls = 'char-card';
    if (dead) cls += ' dead';
    else if (c.acted) cls += ' acted';
    
    return `<div class="${cls}">
        <div class="char-header">
            <div class="char-info">
                <div class="char-name-row">
                    <span class="char-name">${c.name}</span>
                    <span class="badge ${isHero ? 'hero' : 'villain'}">${isHero ? '🛡️ Eroe' : '👹 Cattivo'}</span>
                    ${dead ? '<span class="badge ko">💀 KO</span>' : ''}
                </div>
            </div>
            <div class="char-buttons">
                <button class="btn-icon toggle ${c.acted ? 'active' : ''}" onclick="fabToggle('${c.id}')">✓</button>
                <button class="btn-icon remove" onclick="fabRemove('${c.id}')">✕</button>
            </div>
        </div>
        <div class="hp-section">
            <div class="hp-bar-track">
                <div class="hp-bar-fill" style="width:${ratio * 100}%;background:${color}"></div>
            </div>
            <div class="hp-controls">
                <span class="hp-current" style="color:${color}">${c.hpCurrent} / ${c.hpMax} HP</span>
                <div class="hp-quick-btns">
                    <button class="btn-hp minus" onclick="fabModHp('${c.id}',-5)">-5</button>
                    <button class="btn-hp minus" onclick="fabModHp('${c.id}',-1)">-1</button>
                    <button class="btn-hp plus" onclick="fabModHp('${c.id}',1)">+1</button>
                    <button class="btn-hp plus" onclick="fabModHp('${c.id}',5)">+5</button>
                </div>
            </div>
        </div>
    </div>`;
}

// ═══════════════════════════════════════════════════════════════
// PBTA / SPOTLIGHT TRACKER
// ═══════════════════════════════════════════════════════════════
let pbtaChars = load('pbta_chars', []);

function pbtaSave() {
    save('pbta_chars', pbtaChars);
}

function pbtaAdd() {
    const name = $('pbtaName').value.trim();
    if (!name) return;
    
    pbtaChars.push({ id: genId(), name, notes: '', spotlight: false });
    pbtaSave();
    pbtaRender();
    
    $('pbtaName').value = '';
    $('pbtaName').focus();
}

function pbtaRemove(id) {
    pbtaChars = pbtaChars.filter(c => c.id !== id);
    pbtaSave();
    pbtaRender();
}

function pbtaSpotlight(id) {
    pbtaChars.forEach(c => c.spotlight = c.id === id);
    pbtaSave();
    pbtaRender();
}

function pbtaClearSpot() {
    pbtaChars.forEach(c => c.spotlight = false);
    pbtaSave();
    pbtaRender();
}

function pbtaUpdateNotes(id, notes) {
    const c = pbtaChars.find(x => x.id === id);
    if (c) c.notes = notes;
    pbtaSave();
}

function pbtaReset() {
    if (!confirm('Resettare il tracker PbtA?')) return;
    pbtaChars = [];
    pbtaSave();
    pbtaRender();
}

function pbtaRender() {
    const list = $('pbtaList');
    $('pbtaEmpty').style.display = pbtaChars.length === 0 ? 'block' : 'none';
    $('pbtaControlsPanel').style.display = pbtaChars.length > 0 ? 'block' : 'none';
    
    if (pbtaChars.length === 0) {
        list.innerHTML = '';
        return;
    }
    
    list.innerHTML = pbtaChars.map(c => {
        let cls = 'char-card';
        if (c.spotlight) cls += ' active green';
        
        return `<div class="${cls}">
            <div class="char-header">
                <div class="char-info">
                    <div class="char-name-row">
                        ${c.spotlight ? '<span style="font-size:1.5rem">🔦</span>' : ''}
                        <span class="char-name">${c.name}</span>
                        ${c.spotlight ? '<span class="badge spotlight">In scena</span>' : ''}
                    </div>
                </div>
                <div class="char-buttons">
                    <button class="btn-icon spotlight ${c.spotlight ? 'active' : ''}" onclick="pbtaSpotlight('${c.id}')">🔦</button>
                    <button class="btn-icon remove" onclick="pbtaRemove('${c.id}')">✕</button>
                </div>
            </div>
            <div class="char-notes ${c.notes ? '' : 'empty'}" onclick="pbtaEditNotes('${c.id}', this)">
                ${c.notes || '✏️ Tocca per aggiungere note...'}
            </div>
        </div>`;
    }).join('');
}

function pbtaEditNotes(id, el) {
    const c = pbtaChars.find(x => x.id === id);
    if (!c) return;
    
    const textarea = document.createElement('textarea');
    textarea.className = 'char-notes-input';
    textarea.value = c.notes;
    textarea.placeholder = 'Note, mosse, tag...';
    
    textarea.onblur = function() {
        pbtaUpdateNotes(id, this.value);
        pbtaRender();
    };
    
    el.replaceWith(textarea);
    textarea.focus();
}

// ═══════════════════════════════════════════════════════════════
// 7TH SEA TRACKER
// ═══════════════════════════════════════════════════════════════
let seaChars = load('sea_chars', []);
let seaTurn = load('sea_turn', -1);

function seaSave() {
    save('sea_chars', seaChars);
    save('sea_turn', seaTurn);
}

function seaSort() {
    seaChars.sort((a, b) => {
        if (b.raisesRemaining !== a.raisesRemaining) return b.raisesRemaining - a.raisesRemaining;
        return a.name.localeCompare(b.name);
    });
}

function seaAdd() {
    const name = $('seaName').value.trim();
    const raises = parseInt($('seaRaises').value);
    if (!name || isNaN(raises) || raises <= 0) return;
    
    seaChars.push({ id: genId(), name, raisesTotal: raises, raisesRemaining: raises });
    seaSort();
    seaSave();
    seaRender();
    
    $('seaName').value = '';
    $('seaRaises').value = '';
    $('seaName').focus();
}

function seaRemove(id) {
    seaChars = seaChars.filter(c => c.id !== id);
    if (seaChars.length === 0) seaTurn = -1;
    else if (seaTurn >= seaChars.length) seaTurn = 0;
    seaSave();
    seaRender();
}

function seaNextAction() {
    if (seaChars.length === 0) return;
    
    // Consume raise from current
    if (seaTurn >= 0 && seaTurn < seaChars.length && seaChars[seaTurn].raisesRemaining > 0) {
        seaChars[seaTurn].raisesRemaining--;
    }
    
    seaSort();
    
    // Find next with raises
    const next = seaChars.findIndex(c => c.raisesRemaining > 0);
    if (next === -1) {
        seaTurn = -1;
        alert('🏁 Round terminato! Tutte le raises sono esaurite.');
    } else {
        seaTurn = next;
    }
    
    seaSave();
    seaRender();
}

function seaNewRound() {
    seaChars.forEach(c => c.raisesRemaining = c.raisesTotal);
    seaSort();
    seaTurn = -1;
    seaSave();
    seaRender();
}

function seaReset() {
    if (!confirm('Resettare il tracker 7th Sea?')) return;
    seaChars = [];
    seaTurn = -1;
    seaSave();
    seaRender();
}

function seaAddRaises() {
    const id = $('seaTarget').value;
    const val = parseInt($('seaModValue').value);
    if (!id || isNaN(val) || val <= 0) return;
    const c = seaChars.find(x => x.id === id);
    if (c) {
        c.raisesRemaining += val;
        c.raisesTotal = Math.max(c.raisesTotal, c.raisesRemaining);
    }
    seaSort();
    $('seaModValue').value = '';
    seaSave();
    seaRender();
}

function seaRemoveRaises() {
    const id = $('seaTarget').value;
    const val = parseInt($('seaModValue').value);
    if (!id || isNaN(val) || val <= 0) return;
    const c = seaChars.find(x => x.id === id);
    if (c) c.raisesRemaining = Math.max(0, c.raisesRemaining - val);
    seaSort();
    $('seaModValue').value = '';
    seaSave();
    seaRender();
}

function seaRender() {
    const curName = seaTurn >= 0 && seaTurn < seaChars.length ? seaChars[seaTurn].name : '—';
    $('seaCurrent').textContent = curName;
    
    const list = $('seaList');
    const sel = $('seaTarget');
    
    $('seaEmpty').style.display = seaChars.length === 0 ? 'block' : 'none';
    $('seaModifyPanel').style.display = seaChars.length > 0 ? 'block' : 'none';
    
    if (seaChars.length === 0) {
        list.innerHTML = '';
        return;
    }
    
    list.innerHTML = seaChars.map((c, i) => {
        const active = i === seaTurn;
        const exhausted = c.raisesRemaining === 0;
        const total = Math.max(c.raisesTotal, c.raisesRemaining);
        
        let cls = 'char-card';
        if (active) cls += ' active blue';
        else if (exhausted) cls += ' exhausted';
        
        let dots = '';
        for (let j = 0; j < total; j++) {
            dots += `<div class="raise-dot ${j < c.raisesRemaining ? 'on' : 'off'}"></div>`;
        }
        
        return `<div class="${cls}">
            <div class="char-header">
                <div class="char-info">
                    <div class="char-name-row">
                        ${active ? '<span class="turn-indicator blue">▶</span>' : ''}
                        <span class="char-name">${c.name}</span>
                        <span class="badge raises ${exhausted ? 'empty' : ''}">${c.raisesRemaining} / ${c.raisesTotal}</span>
                    </div>
                    ${exhausted ? '<div style="font-size:0.85rem;color:rgba(255,255,255,0.25);margin-top:6px">Raises esaurite</div>' : ''}
                </div>
                <div class="char-buttons">
                    <button class="btn-icon remove" onclick="seaRemove('${c.id}')">✕</button>
                </div>
            </div>
            <div class="raises-dots">${dots}</div>
        </div>`;
    }).join('');
    
    // Update select
    const prevVal = sel.value;
    sel.innerHTML = '<option value="">— Seleziona personaggio —</option>';
    seaChars.forEach(c => {
        sel.innerHTML += `<option value="${c.id}">${c.name} (${c.raisesRemaining}/${c.raisesTotal})</option>`;
    });
    if (seaChars.find(c => c.id === prevVal)) sel.value = prevVal;
}

// ═══════════════════════════════════════════════════════════════
// GENERIC TRACKER
// ═══════════════════════════════════════════════════════════════
let genChars = load('gen_chars', []);
let genTurn = load('gen_turn', 0);
let genRound = load('gen_round', 1);

function genSave() {
    save('gen_chars', genChars);
    save('gen_turn', genTurn);
    save('gen_round', genRound);
}

function genAdd() {
    const name = $('genName').value.trim();
    const ini = parseInt($('genIni').value);
    const hp = parseInt($('genHp').value);
    const notes = $('genNotes').value.trim();
    if (!name || isNaN(ini) || isNaN(hp) || hp <= 0) return;
    
    genChars.push({ id: genId(), name, initiative: ini, hpMax: hp, hpCurrent: hp, notes, acted: false });
    genChars.sort((a, b) => b.initiative - a.initiative);
    genSave();
    genRender();
    
    $('genName').value = '';
    $('genIni').value = '';
    $('genHp').value = '';
    $('genNotes').value = '';
    $('genName').focus();
}

function genRemove(id) {
    const idx = genChars.findIndex(c => c.id === id);
    genChars = genChars.filter(c => c.id !== id);
    if (genChars.length === 0) genTurn = 0;
    else if (idx < genTurn) genTurn--;
    else if (genTurn >= genChars.length) genTurn = 0;
    genSave();
    genRender();
}

function genToggle(id) {
    const c = genChars.find(x => x.id === id);
    if (c) c.acted = !c.acted;
    genSave();
    genRender();
}

function genModHp(id, delta) {
    const c = genChars.find(x => x.id === id);
    if (c) c.hpCurrent = Math.max(0, Math.min(c.hpMax, c.hpCurrent + delta));
    genSave();
    genRender();
}

function genNextTurn() {
    if (genChars.length === 0) return;
    genChars[genTurn].acted = true;
    genTurn++;
    let attempts = 0;
    while (attempts < genChars.length) {
        if (genTurn >= genChars.length) {
            genTurn = 0;
            genRound++;
            genChars.forEach(c => c.acted = false);
        }
        if (genChars[genTurn].hpCurrent > 0) break;
        genTurn++;
        attempts++;
    }
    genSave();
    genRender();
}

function genNewRound() {
    genTurn = 0;
    genRound++;
    genChars.forEach(c => c.acted = false);
    genSave();
    genRender();
}

function genReset() {
    if (!confirm('Resettare il tracker generico?')) return;
    genChars = [];
    genTurn = 0;
    genRound = 1;
    genSave();
    genRender();
}

function genRender() {
    $('genRound').textContent = genRound;
    const list = $('genList');
    
    $('genEmpty').style.display = genChars.length === 0 ? 'block' : 'none';
    
    if (genChars.length === 0) {
        list.innerHTML = '';
        return;
    }
    
    list.innerHTML = genChars.map((c, i) => {
        const active = i === genTurn;
        const dead = c.hpCurrent <= 0;
        const ratio = c.hpMax > 0 ? c.hpCurrent / c.hpMax : 0;
        const color = hpColor(ratio);
        
        let cls = 'char-card';
        if (active) cls += ' active rose';
        else if (dead) cls += ' dead';
        else if (c.acted) cls += ' acted';
        
        return `<div class="${cls}">
            <div class="char-header">
                <div class="char-info">
                    <div class="char-name-row">
                        ${active ? '<span class="turn-indicator rose">▶</span>' : ''}
                        <span class="char-name">${c.name}</span>
                        <span class="badge ini">INI ${c.initiative}</span>
                        ${dead ? '<span class="badge ko">💀 KO</span>' : ''}
                        ${c.acted && !dead ? '<span class="badge acted">✓</span>' : ''}
                    </div>
                    ${c.notes ? `<div style="font-size:0.85rem;color:rgba(255,255,255,0.35);margin-top:8px">${c.notes}</div>` : ''}
                </div>
                <div class="char-buttons">
                    <button class="btn-icon toggle rose ${c.acted ? 'active' : ''}" onclick="genToggle('${c.id}')">✓</button>
                    <button class="btn-icon remove" onclick="genRemove('${c.id}')">✕</button>
                </div>
            </div>
            <div class="hp-section">
                <div class="hp-bar-track">
                    <div class="hp-bar-fill" style="width:${ratio * 100}%;background:${color}"></div>
                </div>
                <div class="hp-controls">
                    <span class="hp-current" style="color:${color}">${c.hpCurrent} / ${c.hpMax} HP</span>
                    <div class="hp-quick-btns">
                        <button class="btn-hp minus" onclick="genModHp('${c.id}',-5)">-5</button>
                        <button class="btn-hp minus" onclick="genModHp('${c.id}',-1)">-1</button>
                        <button class="btn-hp plus" onclick="genModHp('${c.id}',1)">+1</button>
                        <button class="btn-hp plus" onclick="genModHp('${c.id}',5)">+5</button>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
}

// ─── KEYBOARD SHORTCUTS ───
document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        if (e.key === 'Enter') {
            const id = e.target.id;
            if (['dndName', 'dndIni', 'dndHp', 'dndCa'].includes(id)) { e.preventDefault(); dndAdd(); }
            if (['fabName', 'fabHp'].includes(id)) { e.preventDefault(); fabAdd(); }
            if (id === 'pbtaName') { e.preventDefault(); pbtaAdd(); }
            if (['seaName', 'seaRaises'].includes(id)) { e.preventDefault(); seaAdd(); }
            if (['genName', 'genIni', 'genHp', 'genNotes'].includes(id)) { e.preventDefault(); genAdd(); }
        }
        return;
    }
    
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (currentMode === 'dnd') dndNextTurn();
        if (currentMode === 'sea') seaNextAction();
        if (currentMode === 'generic') genNextTurn();
    }
});

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
    showScreen(currentMode);
    if (currentMode === 'dnd') dndRender();
    if (currentMode === 'fabula') { fabRender(); fabSetFaction('hero'); }
    if (currentMode === 'pbta') pbtaRender();
    if (currentMode === 'sea') seaRender();
    if (currentMode === 'generic') genRender();
});
