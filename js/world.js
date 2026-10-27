'use strict';
// Esplorazione: mappe, movimento, collisioni, interazioni, allenatori.
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const OPP = { up: 'down', down: 'up', left: 'right', right: 'left' };
const WALKABLE = '.,gESOoVpdsyGqke';
const ENCOUNTER = 'gq';
const FACE_ROW = '#WESOVbZNLH';
const GROUND = { ',': 'floor', '.': 'carpet', s: 's', a: 'a', G: 'G', y: 'y', d: 'd', p: 'p', q: 'G' };

let game = null;
let map = null, curMapId = null, npcs = [], banner = null, busy = false;
const player = { x: 0, y: 0, dir: 'down', moving: false, prog: 0, speed: 1, parity: false, wasMoving: false, turnDelay: 0, lastBump: 0, path: [], goal: null, target: null };

function resetGame() {
  game = {
    name: 'Nuovo', party: [], bag: { contratto: 0, caffe: 0, espresso: 0, ricarica: 0, cornetto: 0 }, money: 500,
    flags: {}, heal: { map: 'p5', x: 4, y: 4, dir: 'up' }, time: 0, started: false, bald: null
  };
}
resetGame();

// ---------- Mappe ----------
function loadMap(id, x, y, dir, opts = {}) {
  curMapId = id;
  map = MAPS[id];
  npcs = map.npcs.map(n => Object.assign({}, n, { ox: 0, oy: 0, fr: 0, timer: 60 + Math.floor(Math.random() * 120) }));
  Object.assign(player, { x, y, dir, moving: false, prog: 0, wasMoving: false, turnDelay: 0, path: [], goal: null, target: null });
  banner = opts.noBanner ? null : { text: map.name, t: 0 };
  Sound.play(map.outdoor ? 'city' : 'town');
  CustomChars.spawnFor(id);
  Bald.onEnterMap(!opts.noBald);
}
function tileAt(x, y) {
  const row = map.tiles[y];
  if (!row || x < 0 || x >= row.length) return map.outside || 'X';
  return row[x];
}
function decorAt(x, y) {
  if (!map.decor) return null;
  return map.decor.find(d => !d.nosolid && x >= d.x && x < d.x + d.w && y >= d.y && y < d.y + d.h && !(d.holes && d.holes.some(h => h[0] === x && h[1] === y))) || null;
}
function decorAny(x, y) {
  if (!map.decor) return null;
  const hits = map.decor.filter(d => !d.under && x >= d.x && x < d.x + d.w && y >= d.y && y < d.y + d.h && !(d.holes && d.holes.some(h => h[0] === x && h[1] === y)));
  return hits.find(d => !d.nosolid) || hits[hits.length - 1] || map.decor.find(d => d.under && x >= d.x && x < d.x + d.w && y >= d.y && y < d.y + d.h) || null;
}
function walkable(x, y) { return WALKABLE.includes(tileAt(x, y)) && !decorAt(x, y); }
function baldHidden(n) {
  const b = npcs.find(o => o.kind === 'bald');
  return b && b.hide === n.id;
}
function activeNpcs() {
  return npcs.filter(n => (!n.show || n.show()) && !(n.kind === 'item' && game.flags[n.id]) && !baldHidden(n));
}
function npcAt(x, y) {
  return activeNpcs().find(n => (n.x === x && n.y === y) || (n.tiles && n.tiles.some(t => t[0] === x && t[1] === y)));
}
function npcById(id) { return npcs.find(n => n.id === id); }
function isWarp(x, y) { return !!(map.warps && map.warps[`${x},${y}`]) || tileAt(x, y) === 'E'; }

function tileUnder(x, y) {
  for (const t of [tileAt(x - 1, y), tileAt(x + 1, y), tileAt(x, y + 1), tileAt(x, y - 1)]) if (GROUND[t]) return GROUND[t];
  return map.outdoor ? 's' : 'carpet';
}
function drawTile(x, y, sx, sy) {
  const ch = tileAt(x, y);
  const v = ((x * 7 + y * 13) % 4 + 4) % 4;
  let img;
  if (ch === '#') {
    const below = tileAt(x, y + 1);
    img = Sprites.tile(below !== 'X' && !FACE_ROW.includes(below) ? '#face' : '#top');
  } else if (ch === 'b') img = Sprites.tile('B', v, 'face');
  else if (ch === 'H') img = Sprites.tile(tileAt(x, y + 1) === 'H' ? 'Hup' : 'Hlow');
  else img = Sprites.tile(ch, v, tileUnder(x, y));
  ctx.drawImage(img, sx, sy);
}

function playerPixel() {
  const [dx, dy] = DIRS[player.dir];
  const k = player.moving ? player.prog : 0;
  return [player.x * TS + dx * k, player.y * TS + dy * k];
}

function drawNpcSprite(n, sx, sy) {
  if (n.kind === 'folder') { ctx.drawImage(Sprites.obj('folder', n.color), sx, sy - 3); return; }
  if (n.kind === 'item') { ctx.drawImage(Sprites.obj('item'), sx, sy); return; }
  if (n.kind === 'bald') { Bald.draw(n, sx, sy); return; }
  let dy = 0;
  if (n.anim === 'pp' || n.anim === 'cal') dy = (frameCount >> 3) % 2 ? -1 : 0;
  ctx.drawImage(Sprites.character(n.pal, n.dir, n.fr || 0), sx, sy - 5 + dy);
  if (n.anim === 'pp') {
    const hx = n.dir === 'right' ? sx + 13 : sx - 1, sw = Math.round(Math.sin(frameCount / 5) * 2);
    rect(hx, sy + 8 + sw, 4, 4, '#d03838'); rect(hx + 1, sy + 12 + sw, 2, 2, '#7c5428');
  }
  if (n.bubble) ctx.drawImage(Sprites.obj('bubble'), sx, sy - 22);
}

const Overworld = {
  opaque: true, camX: 0, camY: 0,
  click(gx, gy) {
    if (busy) return true;
    clickWorld(Math.floor((gx + this.camX) / TS), Math.floor((gy + this.camY + 4) / TS));
    return true;
  },
  update() {
    if (busy) return;
    for (const n of activeNpcs()) {
      if (!n.wander) continue;
      if (--n.timer <= 0) {
        n.dir = ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)];
        n.timer = 90 + Math.floor(Math.random() * 160);
      }
    }
    updatePlayer();
  },
  draw() {
    const [px, py] = playerPixel();
    const camX = Math.round(px - 112), camY = Math.round(py - 72);
    this.camX = camX; this.camY = camY;
    rect(0, 0, W, H, '#101018');
    const x0 = Math.floor(camX / TS), y0 = Math.floor(camY / TS);
    for (let ty = y0; ty <= y0 + 11; ty++) for (let tx = x0; tx <= x0 + 15; tx++) drawTile(tx, ty, tx * TS - camX, ty * TS - camY);
    if (player.goal && (frameCount >> 3) % 2) {
      const gx = player.goal[0] * TS - camX, gy = player.goal[1] * TS - camY;
      ctx.strokeStyle = '#f8f8f8'; ctx.lineWidth = 1; ctx.strokeRect(gx + 2.5, gy + 2.5, 11, 11);
    }
    const ents = activeNpcs().map(n => ({ n, y: n.y * TS + n.oy, x: n.x * TS + n.ox }));
    for (const d of (map.decor || [])) {
      if (d.under) Decor.draw(d, d.x * TS - camX, d.y * TS - camY);
      else ents.push({ d, x: d.x * TS, y: (d.y + d.h - 1) * TS - (d.nosolid ? 0 : 0.5) });
    }
    ents.push({ p: true, x: px, y: py });
    ents.sort((a, b) => a.y - b.y);
    for (const e of ents) {
      const sx = Math.round(e.x - camX), sy = Math.round(e.y - camY);
      if (e.p) {
        const fr = player.moving ? (player.prog < 8 ? (player.parity ? 1 : 2) : 0) : 0;
        ctx.drawImage(Sprites.character(PAL.player, player.dir, fr), sx, sy - 5);
      } else if (e.d) Decor.draw(e.d, Math.round(e.d.x * TS - camX), Math.round(e.d.y * TS - camY));
      else drawNpcSprite(e.n, sx, sy);
    }
    if (map.dark) {
      const g = ctx.createRadialGradient(px - camX + 8, py - camY + 4, 14, px - camX + 8, py - camY + 4, 70);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,8,0.93)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    if (banner) {
      const t = banner.t++;
      if (t > 160) banner = null;
      else {
        const y = t < 12 ? -22 + t * 2 : t > 140 ? 2 - (t - 140) * 1.2 : 2;
        const w = textW(banner.text, 6) + 20;
        frame(2, Math.round(y), w, 20, 'menu');
        txt(banner.text, 12, Math.round(y) + 7, { size: 6 });
      }
    }
  }
};

function updatePlayer() {
  const p = player;
  if (p.moving) {
    p.prog += p.speed;
    if (p.prog >= TS) {
      const [dx, dy] = DIRS[p.dir];
      p.x += dx; p.y += dy;
      p.moving = false; p.prog = 0;
      onStep();
    }
    return;
  }
  if (Input.hit('start')) { clearPath(); Sound.sfx('select'); runScript(startMenu); return; }
  if (Input.hit('a')) { clearPath(); interact(); return; }
  let d = Input.heldDir();
  if (d) clearPath();
  else if (p.path.length) {
    d = p.path.shift();
    p.dir = d;
    p.turnDelay = 0;
    const [ax, ay] = DIRS[d];
    if (!walkable(p.x + ax, p.y + ay) || npcAt(p.x + ax, p.y + ay)) { clearPath(); return; }
    p.moving = true; p.prog = 0; p.speed = game.flags.kit ? 2 : 1; p.parity = !p.parity; p.wasMoving = true;
    return;
  } else if (p.target) {
    const t = p.target;
    p.target = null; p.goal = null;
    const fx = Math.sign(t.x - p.x), fy = Math.sign(t.y - p.y);
    p.dir = fx > 0 ? 'right' : fx < 0 ? 'left' : fy > 0 ? 'down' : 'up';
    interact();
    return;
  } else p.goal = null;
  if (!d) { p.wasMoving = false; p.turnDelay = 0; return; }
  if (d !== p.dir) {
    p.dir = d;
    if (!p.wasMoving) { p.turnDelay = 7; return; }
  }
  if (p.turnDelay > 0) { p.turnDelay--; if (p.turnDelay > 0) return; }
  const [dx, dy] = DIRS[d];
  if (walkable(p.x + dx, p.y + dy) && !npcAt(p.x + dx, p.y + dy)) {
    p.moving = true; p.prog = 0;
    p.speed = Input.held('b') && game.flags.kit ? 2 : 1;
    p.parity = !p.parity;
    p.wasMoving = true;
  } else {
    p.wasMoving = false;
    if (frameCount - p.lastBump > 20) { Sound.sfx('bump'); p.lastBump = frameCount; }
  }
}

function clearPath() { player.path = []; player.goal = null; player.target = null; }

// Percorso più breve verso una delle caselle obiettivo, senza attraversare uscite intermedie.
function findPath(goals) {
  const key = (x, y) => x + ',' + y;
  const goalSet = new Set(goals.map(([x, y]) => key(x, y)));
  if (goalSet.has(key(player.x, player.y))) return [];
  const prev = new Map([[key(player.x, player.y), null]]), q = [[player.x, player.y]];
  while (q.length) {
    const [x, y] = q.shift();
    for (const [dname, [dx, dy]] of Object.entries(DIRS)) {
      const nx = x + dx, ny = y + dy, k = key(nx, ny);
      if (prev.has(k) || !walkable(nx, ny) || npcAt(nx, ny)) continue;
      prev.set(k, [x, y, dname]);
      if (goalSet.has(k)) {
        const path = [];
        let cur = k;
        while (prev.get(cur)) { const [px, py, dn] = prev.get(cur); path.unshift(dn); cur = key(px, py); }
        return path;
      }
      if (!isWarp(nx, ny)) q.push([nx, ny]);
    }
  }
  return null;
}

function clickWorld(tx, ty) {
  if (tx === player.x && ty === player.y) return;
  const n = npcAt(tx, ty);
  const ch = tileAt(tx, ty);
  const interesting = n || (map.signs && map.signs[`${tx},${ty}`]) || (decorAny(tx, ty) && Story.decorText(decorAny(tx, ty))) || TILE_TEXT[ch === 'b' ? 'B' : ch];
  let goals, target = null;
  if (!n && walkable(tx, ty)) goals = [[tx, ty]];
  else {
    target = { x: tx, y: ty };
    goals = Object.values(DIRS).map(([dx, dy]) => [tx + dx, ty + dy]).filter(([x, y]) => walkable(x, y) && !npcAt(x, y) && !isWarp(x, y));
    // dietro a un bancone si parla da due caselle di distanza
    for (const [dx, dy] of Object.values(DIRS)) if ('DRC'.includes(tileAt(tx + dx, ty + dy)) && walkable(tx + 2 * dx, ty + 2 * dy)) goals.push([tx + 2 * dx, ty + 2 * dy]);
    if (Math.abs(tx - player.x) + Math.abs(ty - player.y) === 1) goals.push([player.x, player.y]);
    if (!interesting) target = null;
  }
  const path = goals.length ? findPath(goals) : null;
  if (path === null) { Sound.sfx('bump'); return; }
  player.path = path;
  player.goal = path.length ? [tx, ty] : null;
  player.target = target;
  Sound.sfx('blip');
}

function onStep() {
  if (tileAt(player.x, player.y) === 'E') { runScript(elevatorMenu); return; }
  const w = map.warps && map.warps[`${player.x},${player.y}`];
  if (w) { runScript(() => doWarp(w)); return; }
  const t = spottingTrainer();
  if (t) { runScript(() => trainerSpotted(t)); return; }
  if (ENCOUNTER.includes(tileAt(player.x, player.y)) && map.encounters && Math.random() < 0.1 && game.party.some(m => m.hp > 0)) {
    const mon = rollEncounter();
    runScript(() => startBattle({ wild: mon }));
    return;
  }
  Bald.onStep();
}

function rollEncounter() {
  const list = map.encounters;
  let r = Math.random() * list.reduce((s, e) => s + e[3], 0);
  for (const [sp, a, b, wgt] of list) {
    if ((r -= wgt) <= 0) return makeMon(sp, a + Math.floor(Math.random() * (b - a + 1)));
  }
  const [sp, a] = list[0];
  return makeMon(sp, a);
}

function spottingTrainer() {
  for (const n of activeNpcs()) {
    if (!n.trainer || !n.trainer.sight || game.flags['def_' + n.id]) continue;
    const [dx, dy] = DIRS[n.dir];
    for (let i = 1; i <= n.trainer.sight; i++) {
      const tx = n.x + dx * i, ty = n.y + dy * i;
      if (tx === player.x && ty === player.y) return n;
      if (!walkable(tx, ty) || npcAt(tx, ty)) break;
    }
  }
  return null;
}

async function runScript(fn) {
  if (busy) return;
  busy = true;
  player.path = []; player.goal = null; player.target = null;
  try { await fn(); } catch (e) { console.error(e); }
  busy = false;
  player.wasMoving = false;
}

async function doWarp(w) {
  const [mapId, x, y, dir, cond] = w;
  if (cond && WARP_COND[cond] && !(await WARP_COND[cond]())) {
    const [dx, dy] = DIRS[player.dir];
    player.x -= dx; player.y -= dy;
    return;
  }
  Sound.sfx('door');
  await fadeOut(10);
  loadMap(mapId, x, y, dir);
  await fadeIn(10);
  await Story.onEnter(mapId);
}

async function elevatorMenu() {
  const opts = FLOORS.map(f => f.label + (f.id === curMapId ? '  <' : '') + (f.open() ? '' : '  X'));
  const cur = Math.max(0, FLOORS.findIndex(f => f.id === curMapId));
  const d = await say('Ascensore. A quale piano vuoi andare?', { keep: true, instant: true });
  const i = await choose([...opts, 'ANNULLA'], { cancel: opts.length, start: cur, size: 6, lh: 12, x: 64, y: 2, w: 172 });
  pop(d);
  const f = FLOORS[i];
  if (!f || f.id === curMapId) { player.y += 1; player.dir = 'down'; return; }
  if (!f.open()) {
    Sound.sfx('bump');
    await say('BIP BIP. Il tuo badge non è ancora abilitato per questo piano.');
    player.y += 1; player.dir = 'down';
    return;
  }
  Sound.sfx('door');
  await fadeOut(12);
  const [lx, ly] = MAPS[f.id].lift;
  loadMap(f.id, lx, ly, 'down');
  await wait(10);
  await fadeIn(12);
  await Story.onEnter(f.id);
}

async function npcWalk(n) {
  const [dx, dy] = DIRS[n.dir];
  n.parity = !n.parity;
  await animate(16, t => { n.ox = dx * 16 * t; n.oy = dy * 16 * t; n.fr = t < 0.5 ? (n.parity ? 1 : 2) : 0; });
  n.x += dx; n.y += dy; n.ox = 0; n.oy = 0; n.fr = 0;
}

async function trainerSpotted(n) {
  Sound.sfx('alert');
  n.bubble = true;
  await wait(40);
  n.bubble = false;
  while (Math.abs(player.x - n.x) + Math.abs(player.y - n.y) > 1) await npcWalk(n);
  player.dir = OPP[n.dir];
  await trainerBattle(n);
}

async function trainerBattle(n) {
  const t = n.trainer;
  if (t.intro) await sayAll(t.intro.map(s => `${t.title}: ${s}`));
  const r = await startBattle({ trainer: t, boss: n.id === 'ad' });
  if (r === 'win') {
    game.flags['def_' + n.id] = true;
    if (Story.onWin[n.id]) await Story.onWin[n.id](n);
  }
  return r;
}

function interact() {
  const [dx, dy] = DIRS[player.dir];
  const tx = player.x + dx, ty = player.y + dy;
  let n = npcAt(tx, ty);
  if (!n && 'DRC'.includes(tileAt(tx, ty))) n = npcAt(tx + dx, ty + dy);
  if (n) { runScript(() => talkNpc(n)); return; }
  const sign = map.signs && map.signs[`${tx},${ty}`];
  if (sign) { runScript(() => typeof sign === 'function' ? sign() : sayAll(sign)); return; }
  const d = decorAny(tx, ty);
  if (d && Story.decorText(d)) { runScript(() => Story.decorText(d)()); return; }
  let ch = tileAt(tx, ty);
  if (ch === 'b') ch = 'B';
  if (curMapId === 'studio' && ch === 'L') { runScript(() => Story.studioBooks()); return; }
  const t = TILE_TEXT[ch];
  if (t) runScript(() => typeof t === 'function' ? t() : sayAll(t));
}

function speakerOf(n) {
  if (n.trainer) return n.trainer.title;
  if (n.custom) return n.custom.nome.toUpperCase();
  const t = typeof n.text === 'function' ? n.text() : n.text;
  const first = Array.isArray(t) ? t[0] : t;
  const m = first && /^([A-ZÀ-Ù0-9'. ]{3,}):/.exec(first);
  return m ? m[1] : (n.speaker || '');
}

// I colleghi chiedono spesso se hai visto l'ufficio del Dott. Baldinazzo, e danno un indizio.
// Circa un collega su cinque sa qualcosa dell'ufficio segreto, distribuiti su piani diversi.
const SECRET_KEEPERS = new Set(['guard', 'pp1', 'pausa2', 'facil2', 'scrum', 'utente', 'segretaria', 'passante1', 'nonna', 'giardiniera', 'writer', 'divano2']);
function knowsSecret(n) {
  if (!n.custom) return SECRET_KEEPERS.has(n.id);
  let h = 0;
  for (const ch of String(n.id)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h % 5 === 0;
}

async function sayHint(n) {
  if (n.hint === undefined && !n.custom) return;
  if (!knowsSecret(n)) return;
  const who = speakerOf(n), pre = who ? who + ': ' : '';
  const hint = HINTS[(n.hint !== undefined ? n.hint : Math.floor(Math.random() * HINTS.length)) % HINTS.length];
  const found = !!game.flags.secretFound;
  if (Math.random() < 0.65) {
    const yes = await ask(pre + OFFICE_Q[Math.floor(Math.random() * OFFICE_Q.length)]);
    const pool = found ? (yes ? OFFICE_YES_FOUND : OFFICE_NO_FOUND) : (yes ? OFFICE_YES_NOTFOUND : OFFICE_NO_NOTFOUND);
    await say(pre + pool[Math.floor(Math.random() * pool.length)]);
    if (!found) await say(pre + hint);
  } else if (!found) await say(hint);
}

async function talkNpc(n) {
  if (n.kind === 'bald') { await Bald.talk(n); return; }
  if (n.kind === 'item') { await pickupItem(n); return; }
  if (n.kind === 'folder') { await n.talk(n); return; }
  if (!n.anim) n.dir = OPP[player.dir];
  if (n.trainer) {
    if (!game.flags['def_' + n.id]) { await trainerBattle(n); return; }
    if (n.trainer.after) await say(`${n.trainer.title}: ${n.trainer.after}`);
    await sayHint(n);
    return;
  }
  if (n.talk) { await n.talk(n); await sayHint(n); return; }
  const t = typeof n.text === 'function' ? n.text() : n.text;
  if (t) await sayAll(t);
  await sayHint(n);
}

async function pickupItem(n) {
  game.flags[n.id] = true;
  game.bag[n.item] = (game.bag[n.item] || 0) + n.qty;
  Sound.sfx('fanfare');
  const label = n.qty > 1 ? `${n.qty} ${PLURAL[n.item]}` : `un ${ITEMS[n.item].name.toUpperCase()}`;
  await say(`${game.name} trova ${label}! Lo mette nello ZAINO.`);
}

function healAll() { for (const m of game.party) m.hp = maxHp(m); }

async function flashScreen() {
  await fadeOut(8, '255,255,255');
  await fadeIn(12);
}

async function blackout() {
  healAll();
  game.money = Math.floor(game.money / 2);
  const h = game.heal;
  loadMap(h.map, h.x, h.y, h.dir, { noBanner: true, noBald: true });
}

async function useCoffee() {
  await say('È la macchinetta del caffè aziendale. Che profumo!');
  if (!game.party.length) { await say('Ti prendi un caffè. Ora sei pronto per lavorare!'); return; }
  if (await ask('Vuoi offrire un caffè alla tua squadra?')) {
    healAll();
    game.heal = { map: curMapId, x: player.x, y: player.y, dir: player.dir };
    Sound.sfx('heal');
    await flashScreen();
    await say('Glu glu... La tua squadra è tornata in piena forma!');
  }
}

async function kioskTalk(who) {
  await say(`${who}: Benvenuto! Qui si ricarica tutto: le persone, i telefoni e gli Officemon.`);
  if (!game.party.length) return;
  if (await ask(`${who}: Ti offro un caffè per la tua squadra?`)) {
    healAll();
    game.heal = { map: curMapId, x: player.x, y: player.y, dir: player.dir };
    Sound.sfx('heal');
    await flashScreen();
    await say(`${who}: Ecco fatto! Squadra in piena forma. Offre la casa.`);
  }
  if (await ask(`${who}: Vuoi comprare qualcosa per il viaggio?`)) await shopMenu();
}

async function vendingShop() {
  await say('Un distributore automatico. Accetta buoni pasto.');
  await shopMenu();
}

async function shopMenu() {
  let i = 0;
  const opts = ITEM_ORDER.map(k => ITEMS[k].name.padEnd(16) + String(ITEMS[k].price).padStart(4));
  for (;;) {
    const d = await say('Cosa vuoi comprare?', { keep: true, instant: true });
    const k = await choose([...opts, 'ESCI'], {
      cancel: opts.length, start: i,
      drawExtra() { frame(2, 4, 64, 30); txt('BUONI', 10, 10, { size: 6 }); txt(String(game.money), 58, 21, { size: 6, align: 'right' }); }
    });
    pop(d);
    if (k === opts.length) break;
    i = k;
    const key = ITEM_ORDER[k], it = ITEMS[key];
    if (game.money < it.price) { await say('Non hai abbastanza buoni pasto!'); continue; }
    if (await ask(`${it.name.toUpperCase()} costa ${it.price} buoni pasto. Lo compri?`)) {
      game.money -= it.price;
      game.bag[key] = (game.bag[key] || 0) + 1;
      Sound.sfx('coin');
      await say(`Clonk! Hai comprato ${it.name.toUpperCase()}.`);
    }
  }
}
