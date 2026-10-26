'use strict';
// Menu, salvataggi, titolo, introduzione, titoli di coda e avvio.
const SAVE_KEY = 'office-quest-save-v2';

// ---------- Squadra ----------
function partyScreen(o = {}) {
  const L = {
    opaque: true, i: o.start !== undefined ? o.start : Math.max(0, game.party.findIndex((m, k) => m.hp > 0 && !(BT && k === BT.ai))), prompt: o.prompt || 'Scegli un Officemon.', swap: -1, resolve: null,
    update() {
      if (!L.resolve) return;
      const n = game.party.length, total = o.forced ? n : n + 1;
      const d = Input.dir();
      if (d === 'up') { L.i = (L.i - 1 + total) % total; Sound.sfx('blip'); }
      if (d === 'down') { L.i = (L.i + 1) % total; Sound.sfx('blip'); }
      if (Input.ok()) { Sound.sfx('select'); L.resolve(L.i >= n ? -1 : L.i); return; }
      if (Input.hit('b') && !o.forced) { Sound.sfx('blip'); L.resolve(-1); }
    },
    draw() {
      rect(0, 0, W, H, '#3868a0');
      for (let x = -160; x < W; x += 16) { ctx.fillStyle = '#4078b0'; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 8, 0); ctx.lineTo(x + 168, H); ctx.lineTo(x + 160, H); ctx.fill(); }
      game.party.forEach((m, k) => {
        const y = 4 + k * 21, sel = k === L.i, mx = maxHp(m);
        rect(4, y, 232, 20, sel ? '#f89838' : L.swap === k ? '#58c858' : '#204870');
        rect(5, y + 1, 230, 18, m.hp <= 0 ? '#e8b8b0' : sel ? '#f8e8c0' : '#d8e8f8');
        const bob = sel && (frameCount >> 3) % 2 ? -1 : 0;
        ctx.drawImage(Sprites.monIcon(m.sp), 7, y - 3 + bob);
        txt(monName(m), 34, y + 3, { size: 6 });
        txt('Lv' + m.lvl, 34, y + 12, { size: 5, color: '#606060', shadow: false });
        txt('PS', 128, y + 4, { size: 5, color: '#e08020', shadow: false });
        hpBar(142, y + 5, 64, m.hp / mx);
        txt(`${m.hp}/${mx}`, 230, y + 11, { size: 5, align: 'right', shadow: false });
        if (BT && k === BT.ai) txt('IN CAMPO', 128, y + 12, { size: 5, color: '#3870c8', shadow: false });
      });
      frame(4, 130, 170, 28);
      const lines = wrapText(L.prompt, 150, 6);
      lines.slice(0, 2).forEach((ln, k) => txt(ln, 12, 137 + k * 10, { size: 6 }));
      if (!o.forced) {
        frame(178, 130, 58, 28, L.i >= game.party.length ? 'menu' : 'normal');
        txt('ANNULLA', 207, 141, { size: 6, align: 'center' });
      }
    }
  };
  return L;
}
function partyPick(L) { return new Promise(r => { L.resolve = v => { L.resolve = null; r(v); }; }); }

async function partyMenu() {
  const L = push(partyScreen());
  for (;;) {
    L.prompt = 'Scegli un Officemon.';
    const i = await partyPick(L);
    if (i < 0) break;
    const c = await choose(['DETTAGLI', 'SPOSTA', 'ANNULLA'], { cancel: 2, y: 66 });
    if (c === 0) await summary(i);
    else if (c === 1) {
      L.swap = i;
      L.prompt = `Spostare ${monName(game.party[i])} dove?`;
      const j = await partyPick(L);
      if (j >= 0 && j !== i) {
        [game.party[i], game.party[j]] = [game.party[j], game.party[i]];
        Sound.sfx('select');
        L.i = j;
      }
      L.swap = -1;
    }
  }
  pop(L);
}

function summary(start) {
  return new Promise(res => {
    let k = start;
    const L = {
      opaque: true,
      update() {
        const d = Input.dir();
        if (d === 'up' || d === 'down') {
          k = (k + (d === 'down' ? 1 : -1) + game.party.length) % game.party.length;
          Sound.sfx('blip');
        }
        if (Input.ok() || Input.hit('b')) { Sound.sfx('blip'); pop(L); res(); }
      },
      draw() {
        const m = game.party[k], S = SPECIES[m.sp], st = calcStats(m);
        rect(0, 0, W, H, '#58a0d0');
        rect(0, 0, W, 3, '#3878b0');
        frame(4, 4, 98, 100);
        rect(10, 10, 86, 60, '#e0ecf4');
        ctx.drawImage(Sprites.mon(m.sp), 29, 14);
        txt(monName(m), 53, 74, { size: 6, align: 'center' });
        txt('Lv' + m.lvl, 30, 87, { size: 6, align: 'center' });
        rect(52, 85, 42, 10, TYPES[S.type].color);
        txt(TYPES[S.type].name, 73, 87, { size: 5, color: '#f8f8f8', shadow: '#404040', align: 'center' });
        frame(104, 4, 132, 100);
        const rows = [['PS', `${m.hp}/${st.hp}`], ['ATTACCO', st.atk], ['DIFESA', st.def], ['VELOCITÀ', st.spd],
          ['ESP.', m.exp], ['PROSSIMO', m.lvl >= MAX_LVL ? '-' : expFor(m.lvl + 1) - m.exp]];
        rows.forEach(([a, b], i) => {
          txt(a, 114, 13 + i * 14, { size: 6, color: '#606060' });
          txt(String(b), 226, 13 + i * 14, { size: 6, align: 'right' });
        });
        rect(114, 96, 112, 2, '#404848');
        rect(114, 96, Math.round(112 * expFrac(m)), 2, '#40a8f8');
        frame(4, 106, 232, 52);
        m.moves.forEach((id, i) => {
          const mv = MOVES[id], x = 14 + (i % 2) * 112, y = 115 + Math.floor(i / 2) * 20;
          rect(x, y, 6, 6, TYPES[mv.type].color);
          txt(mv.name, x + 10, y, { size: 6 });
          txt(mv.power ? 'POT ' + mv.power : 'STATO', x + 10, y + 9, { size: 5, color: '#808080', shadow: false });
        });
      }
    };
    push(L);
  });
}

// ---------- Zaino ----------
function pickItem(o = {}) {
  return new Promise(res => {
    const keys = ITEM_ORDER.filter(k => game.bag[k] > 0);
    const n = keys.length;
    let i = 0;
    const L = {
      opaque: true,
      update() {
        const d = Input.dir();
        if (d === 'up') { i = (i - 1 + n + 1) % (n + 1); Sound.sfx('blip'); }
        if (d === 'down') { i = (i + 1) % (n + 1); Sound.sfx('blip'); }
        if (Input.ok()) { Sound.sfx('select'); pop(L); res(i < n ? keys[i] : null); return; }
        if (Input.hit('b')) { Sound.sfx('blip'); pop(L); res(null); }
      },
      draw() {
        rect(0, 0, W, H, '#e8a050');
        for (let y = 0; y < H; y += 8) rect(0, y, W, 1, '#e09040');
        rect(14, 30, 52, 56, '#a05828'); rect(18, 26, 44, 8, '#804018'); rect(16, 34, 48, 50, '#c07038');
        rect(30, 18, 20, 10, '#804018'); rect(34, 22, 12, 6, '#e8a050');
        rect(22, 48, 36, 4, '#804018'); rect(36, 46, 8, 8, '#f8d050');
        txt('ZAINO', 40, 94, { size: 7, align: 'center', color: '#f8f8f8', shadow: '#804018' });
        frame(80, 4, 156, 110);
        keys.forEach((k, j) => {
          txt(ITEMS[k].name, 96, 13 + j * 15);
          txt('x' + game.bag[k], 226, 13 + j * 15, { align: 'right' });
        });
        txt('CHIUDI', 96, 13 + n * 15);
        cursor(87, 13 + i * 15);
        frame(4, 116, 232, 42);
        const desc = i < n ? ITEMS[keys[i]].desc : 'Chiudi lo zaino.';
        wrapText(desc, 212, 6).slice(0, 3).forEach((ln, k) => txt(ln, 13, 125 + k * 10, { size: 6 }));
      }
    };
    push(L);
  });
}

function applyHealItem(key, m) {
  const it = ITEMS[key], mx = maxHp(m);
  if (it.revive) { m.hp = Math.floor(mx / 2); return `${monName(m)} si è ripreso!`; }
  const before = m.hp;
  m.hp = Math.min(mx, m.hp + it.heal);
  return `${monName(m)} recupera ${m.hp - before} PS.`;
}

async function pickMonFor(key, inBattle) {
  const it = ITEMS[key];
  const L = push(partyScreen({ prompt: `Usare ${it.name.toUpperCase()} su quale Officemon?` }));
  let res = -1;
  for (;;) {
    const i = await partyPick(L);
    if (i < 0) break;
    const m = game.party[i];
    const noEffect = it.revive ? m.hp > 0 : (m.hp <= 0 || m.hp >= maxHp(m));
    if (noEffect) { await say(m.hp <= 0 && !it.revive ? `${monName(m)} è esausto: serve un CORNETTO.` : 'Non avrebbe alcun effetto.'); continue; }
    res = i;
    break;
  }
  pop(L);
  return res;
}

async function bagMenu() {
  for (;;) {
    const key = await pickItem();
    if (!key) return;
    if (key === 'contratto') { await say('Non è il momento! I CONTRATTI si propongono agli Officemon selvatici durante una lotta.'); continue; }
    if (!game.party.length) { await say('Non hai ancora nessun Officemon.'); continue; }
    const idx = await pickMonFor(key, false);
    if (idx < 0) continue;
    game.bag[key]--;
    const r = applyHealItem(key, game.party[idx]);
    Sound.sfx('heal');
    await say(r);
  }
}

// ---------- Menu START ----------
async function startMenu() {
  let i = 0;
  for (;;) {
    const opts = [], acts = [];
    if (game.party.length) { opts.push('OFFICEMON'); acts.push(partyMenu); }
    opts.push('ZAINO'); acts.push(bagMenu);
    opts.push(game.name.toUpperCase()); acts.push(trainerCard);
    opts.push('SALVA'); acts.push(saveMenu);
    opts.push(Sound.muted ? 'AUDIO: NO' : 'AUDIO: SÌ'); acts.push(async () => { Sound.toggleMute(); updateMuteLabel(); });
    opts.push('ESCI'); acts.push(null);
    const k = await choose(opts, { y: 4, cancel: opts.length - 1, start: Math.min(i, opts.length - 1) });
    if (k === opts.length - 1) return;
    i = k;
    await acts[k]();
  }
}

function fmtTime(frames) {
  const m = Math.floor(frames / 3600), h = Math.floor(m / 60);
  return `${h}:${String(m % 60).padStart(2, '0')}`;
}
function defeatedCount() { return Object.keys(game.flags).filter(k => k.startsWith('def_')).length; }

function trainerCard() {
  return new Promise(res => {
    const L = {
      update() { if (Input.ok() || Input.hit('b')) { Sound.sfx('blip'); pop(L); res(); } },
      draw() {
        frame(10, 8, 220, 144, 'menu');
        rect(14, 12, 212, 18, '#3870c8');
        txt('TESSERINO AZIENDALE', 120, 17, { size: 6, align: 'center', color: '#f8f8f8', shadow: '#204890' });
        const f = game.flags;
        const rows = [['NOME', game.name], ['RUOLO', f.champion ? 'Capo reparto' : 'Neoassunto'], ['BUONI PASTO', game.money],
          ['TEMPO', fmtTime(game.time)], ['OFFICEMON', game.party.length], ['LOTTE VINTE', defeatedCount()],
          ['INCONTRI DOTT. B.', Bald.count()], ['UFFICIO SEGRETO', f.secretFound ? 'TROVATO' : '???']];
        rows.forEach(([a, b], i) => {
          txt(a, 20, 36 + i * 13, { size: 6, color: '#606060' });
          txt(String(b), 166, 36 + i * 13, { size: 6, align: 'right' });
        });
        rect(178, 40, 42, 52, '#d8e8f8');
        ctx.drawImage(Sprites.character(PAL.player, 'down', 0), 183, 44, 32, 42);
        txt(COMPANY_UP, 199, 98, { size: 4, align: 'center', color: '#c02828', shadow: false });
        if (f.baldGold || f.baldBronze) {
          ctx.fillStyle = f.baldGold ? '#f8d030' : '#c88040';
          ctx.beginPath(); ctx.arc(199, 120, 8, 0, Math.PI * 2); ctx.fill();
          txt('PM', 199, 117, { size: 5, align: 'center', color: '#604010', shadow: false });
        }
      }
    };
    push(L);
  });
}

// ---------- Salvataggio ----------
function hasSave() { try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; } }
function saveGame() {
  const data = {
    v: 2, name: game.name, party: game.party, bag: game.bag, money: game.money, flags: game.flags,
    heal: game.heal, time: game.time, bald: game.bald, map: curMapId, x: player.x, y: player.y, dir: player.dir
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}
function loadGame() {
  try {
    const d = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!d || !MAPS[d.map]) return false;
    resetGame();
    Object.assign(game, { name: d.name, party: d.party, bag: Object.assign(game.bag, d.bag), money: d.money, flags: d.flags, heal: d.heal, time: d.time || 0, bald: d.bald || null });
    loadMap(d.map, d.x, d.y, d.dir);
    return true;
  } catch (e) { console.error(e); return false; }
}
async function saveMenu() {
  if (!await ask('Vuoi salvare la partita?')) return;
  try {
    saveGame();
    Sound.sfx('fanfare');
    await say(`${game.name} ha salvato la partita.`);
  } catch (e) {
    await say('Impossibile salvare: il browser blocca la memoria locale.');
  }
}

// ---------- Titolo, introduzione, nome, titoli di coda ----------
function outlinedText(s, x, y, size, color, out) {
  for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [1, -1], [-1, 1]]) txt(s, x + dx, y + dy, { size, color: out, shadow: false, align: 'center' });
  txt(s, x, y, { size, color, shadow: false, align: 'center' });
}
function drawSkyline() {
  const sky = ['#f8c070', '#f0a868', '#d88870', '#a87088', '#7868a0', '#5060a8'];
  sky.forEach((c, i) => rect(0, i * 18, W, 18, c));
  rect(0, 108, W, 52, '#5060a8');
  const b = [[0, 60, 30], [26, 40, 24], [48, 72, 28], [74, 30, 36], [108, 50, 26], [132, 20, 30], [160, 56, 22], [180, 36, 34], [212, 64, 28]];
  for (const [x, y, w] of b) {
    rect(x, y + 20, w, 140, '#2c2c4c');
    for (let wy = y + 26; wy < 150; wy += 8) for (let wx = x + 4; wx < x + w - 4; wx += 6) {
      if ((wx * 3 + wy * 7) % 5 < 2) rect(wx, wy, 3, 4, '#f8d878');
      else rect(wx, wy, 3, 4, '#3c3c64');
    }
  }
}

const TitleLayer = {
  opaque: true,
  draw() {
    drawSkyline();
    rect(0, 120, W, 40, 'rgba(20,20,40,0.55)');
    outlinedText('OFFICE', 120, 16, 20, '#f8d030', '#302050');
    outlinedText('QUEST', 120, 40, 20, '#f8d030', '#302050');
    outlinedText('LATENZAZERO S.P.A.', 120, 66, 6, '#f8f8f8', '#302050');
    const sps = ['simmetta', 'simbox', 'routerino'];
    sps.forEach((sp, i) => {
      const bob = Math.round(Math.sin(frameCount / 12 + i * 2) * 2);
      ctx.drawImage(Sprites.mon(sp), 36 + i * 60, 76 + bob);
    });
    if ((frameCount >> 5) % 2 === 0) outlinedText('PREMI START', 120, 132, 7, '#f8f8f8', '#302050');
    txt('2026  OFFICE QUEST', 120, 150, { size: 5, align: 'center', color: '#b8b8d8', shadow: false });
  }
};

function nameEntry() {
  return new Promise(res => {
    const rows = ['ABCDEFGHIJ', 'KLMNOPQRST', 'UVWXYZ.-\' ', 'abcdefghij', 'klmnopqrst', 'uvwxyzàèìò'];
    let r = 0, c = 0, name = '';
    const finish = () => {
      Input.charHandler = null;
      pop(L);
      res(name.trim() || 'Nuovo');
    };
    const add = ch => { if (name.length < 8) { name += ch; Sound.sfx('blip'); } else Sound.sfx('bump'); };
    const del = () => { if (name.length) { name = name.slice(0, -1); Sound.sfx('blip'); } };
    Input.charHandler = ch => {
      if (/^[A-Za-z0-9àèéìòù.\-' ]$/.test(ch)) { add(ch); return true; }
      return false;
    };
    const L = {
      opaque: true,
      update() {
        const d = Input.dir();
        if (d === 'up') r = (r - 1 + rows.length + 1) % (rows.length + 1);
        if (d === 'down') r = (r + 1) % (rows.length + 1);
        if (d === 'left') c = (c - 1 + 10) % 10;
        if (d === 'right') c = (c + 1) % 10;
        if (d) Sound.sfx('blip');
        if (Input.hit('start')) { Sound.sfx('select'); finish(); return; }
        if (Input.hit('b')) del();
        if (Input.hit('a')) {
          if (r === rows.length) { if (c < 5) del(); else { Sound.sfx('select'); finish(); } }
          else add(rows[r][c]);
        }
      },
      draw() {
        rect(0, 0, W, H, '#5878c8');
        for (let y = 0; y < H; y += 4) rect(0, y, W, 1, '#5070c0');
        frame(8, 4, 224, 26);
        txt('Come ti chiami?', 18, 9, { size: 6 });
        const shown = name + (name.length < 8 && (frameCount >> 4) % 2 ? '_' : '');
        txt(shown, 18, 19, { size: 7, color: '#3060c0' });
        ctx.drawImage(Sprites.character(PAL.player, 'down', 0), 206, 7);
        frame(8, 34, 224, 122);
        rows.forEach((row, ry) => {
          [...row].forEach((ch, cx) => {
            const x = 30 + cx * 19, y = 44 + ry * 14;
            if (ry === r && cx === c) rect(x - 4, y - 3, 14, 13, '#f8d878');
            txt(ch === ' ' ? '_' : ch, x, y, { size: 7, color: ch === ' ' ? '#a0a0a0' : '#404040' });
          });
        });
        const y = 44 + rows.length * 14 + 4;
        if (r === rows.length) rect(c < 5 ? 34 : 130, y - 4, 72, 14, '#f8d878');
        txt('CANCELLA', 70, y, { size: 6, align: 'center' });
        txt('FINE', 166, y, { size: 6, align: 'center' });
      }
    };
    push(L);
  });
}

async function intro() {
  const L = {
    opaque: true, show: 'ondina',
    draw() {
      rect(0, 0, W, H, '#d8e8f0');
      for (let y = 0; y < 112; y += 6) rect(0, y, W, 3, '#d0e0ec');
      ellipseFill(120, 100, 50, 10, '#a8bccc'); ellipseFill(120, 99, 44, 7, '#c4d4e0');
      if (this.show === 'ondina') ctx.drawImage(Sprites.character(PAL.ondina, 'down', 0), 96, 38, 48, 63);
      if (this.show === 'mon') { ctx.drawImage(Sprites.mon('simmetta'), 60, 52); ctx.drawImage(Sprites.mon('routerino'), 132, 52); }
      if (this.show === 'player') ctx.drawImage(Sprites.character(PAL.player, 'down', 0), 96, 38, 48, 63);
    }
  };
  push(L);
  Sound.play('town');
  await fadeIn(20);
  await sayAll([
    'Ciao! Benvenuto nel mondo di OFFICE QUEST!',
    `Io sono la Dott.ssa ONDINA, Risorse Umane di ${COMPANY}, la società di telecomunicazioni più veloce d'Italia. Almeno secondo il marketing.`
  ]);
  L.show = 'mon';
  Sound.sfx('fanfare');
  await sayAll([
    'Questi sono OFFICEMON! Nei nostri uffici le SIM, i modem, i cavi e perfino le graffette hanno preso vita.',
    'Lavorano al nostro fianco, gestiscono la rete e ogni tanto si sfidano in lotte amichevoli tra colleghi.'
  ]);
  L.show = 'player';
  await say('E tu? Parlami un po\' di te. Come ti chiami?');
  game.name = await nameEntry();
  await sayAll([
    `${game.name}! Che bel nome. Oggi è il tuo primo giorno in ${COMPANY}`,
    'Fatti strada piano dopo piano, forma una squadra di Officemon e conquista la fiducia dell\'AMMINISTRATORE DELEGATO!',
    'Ti aspetto all\'HR, al quinto piano. E se incontri il Dott. Baldinazzo... beh, lo incontrerai di sicuro.'
  ]);
  await fadeOut(24);
  pop(L);
}

async function credits() {
  await fadeOut(30);
  Sound.play('title');
  let finished;
  const done = new Promise(r => { finished = r; });
  const lines = ['OFFICE QUEST', '', `Complimenti, ${game.name}!`, '', 'Da oggi sei', 'CAPO REPARTO', `di ${COMPANY}`, '', '',
    `Officemon in squadra: ${game.party.length}`, `Assunti con contratto: ${game.flags.caught || 0}`,
    `Incontri con il Dott. Baldinazzo: ${Bald.count()}`, `Ufficio segreto: ${game.flags.secretFound ? 'trovato' : 'ancora un mistero'}`,
    `Tempo di gioco: ${fmtTime(game.time)}`, '', '',
    'Un ringraziamento speciale', 'al Dott. Baldinazzo,', 'Project Manager,', 'che in questo momento', 'sta correndo in riunione.', '', '',
    'Un gioco in stile', 'Game Boy Advance', 'fatto con HTML5 Canvas', '', '', 'Grazie per aver giocato!', '', '', 'FINE'];
  const L = {
    opaque: true, y: H + 10, stopped: false, closed: false,
    update() {
      const end = H / 2 - (lines.length - 1) * 14;
      if (this.y > end) this.y -= Input.held('a') ? 1.6 : 0.4;
      else if (!this.stopped) this.stopped = true;
      else if (!this.closed && (Input.ok() || Input.hit('b'))) { this.closed = true; finished(); }
    },
    draw() {
      drawSkyline();
      rect(0, 0, W, H, 'rgba(10,10,30,0.72)');
      lines.forEach((l, i) => {
        const y = this.y + i * 14;
        if (y < -10 || y > H) return;
        const big = l === 'OFFICE QUEST' || l === 'CAPO REPARTO' || l === 'FINE';
        txt(l, 120, y, { size: big ? 9 : 6, align: 'center', color: big ? '#f8d030' : '#f8f8f8', shadow: '#302050' });
      });
    }
  };
  push(L);
  await fadeIn(30);
  await done;
  await fadeOut(20);
  pop(L);
  Sound.play(map && map.outdoor ? 'city' : 'town');
  await fadeIn(20);
}

function validateMaps() {
  for (const [id, m] of Object.entries(MAPS)) {
    const w = m.tiles[0].length;
    m.tiles.forEach((row, y) => { if (row.length !== w) console.warn(`Mappa ${id}: riga ${y} lunga ${row.length} invece di ${w}`); });
    for (const [k, t] of Object.entries(m.warps || {})) {
      if (!MAPS[t[0]]) console.warn(`Mappa ${id}: warp ${k} verso mappa inesistente ${t[0]}`);
    }
  }
}

async function titleScreen() {
  Layers.length = 0;
  push(TitleLayer);
  Overlay.a = 1;
  push(Overlay);
  Sound.play('title');
  await fadeIn(24);
  await waitPress();
  const has = hasSave();
  const opts = has ? ['CONTINUA', 'NUOVA PARTITA'] : ['NUOVA PARTITA'];
  const i = await choose(opts, { x: 64, y: 100, w: 112 });
  await fadeOut(20);
  pop(TitleLayer);
  if (has && i === 0 && loadGame()) {
    Layers.unshift(Overworld);
    game.started = true;
    await fadeIn(20);
    return;
  }
  resetGame();
  await intro();
  loadMap('pt', 10, 7, 'up');
  Layers.unshift(Overworld);
  game.started = true;
  await fadeIn(20);
}

async function boot() {
  setupTouch();
  updateMuteLabel();
  try {
    await Promise.race([document.fonts.load('8px "Press Start 2P"'), new Promise(r => setTimeout(r, 2500))]);
  } catch (e) {}
  validateMaps();
  requestAnimationFrame(loop);
  titleScreen();
}
boot();
