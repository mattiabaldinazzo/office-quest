'use strict';
// Sistema di lotta a turni in stile GBA.
let BT = null;

const BattleLayer = { opaque: true, draw() { drawBattle(); } };
const bsay = (msg, o = {}) => say(msg, Object.assign({ style: 'battle' }, o));
const stageMul = s => s >= 0 ? (2 + s) / 2 : 2 / (2 - s);
const freshStages = () => ({ atk: 0, def: 0, spd: 0 });

function sideMon(s) { return s === 'a' ? BT.ally : BT.enemy; }
function sideStages(s) { return s === 'a' ? BT.aSt : BT.eSt; }
function other(s) { return s === 'a' ? 'e' : 'a'; }
function nm(s) {
  if (s === 'a') return monName(BT.ally);
  return monName(BT.enemy) + (BT.wild ? ' selvatico' : ' nemico');
}
function setDispHp(s, v) { if (s === 'a') BT.aHp = v; else BT.eHp = v; }

async function flashTransition() {
  const fl = { a: 0, draw() { if (this.a) { ctx.fillStyle = `rgba(255,255,255,${this.a})`; ctx.fillRect(0, 0, W, H); } } };
  push(fl);
  await animate(28, t => { fl.a = (Math.floor(t * 6) % 2) ? 0.85 : 0; });
  pop(fl);
  await fadeOut(16);
}

async function startBattle(opts) {
  Sound.play(opts.boss ? 'boss' : 'battle');
  await flashTransition();
  const t = opts.trainer;
  const team = opts.wild ? [opts.wild] : (typeof t.team === 'function' ? t.team() : t.team).map(([s, l]) => makeMon(s, l));
  const ai = game.party.findIndex(m => m.hp > 0);
  BT = {
    wild: !!opts.wild, trainer: t, opts, enemies: team, enemy: team[0], ai, ally: game.party[ai],
    eSt: freshStages(), aSt: freshStages(),
    eVis: false, aVis: false, showTrainer: !opts.wild, trainerX: 0,
    eSlide: 1, aSlide: 1, eDrop: 0, aDrop: 0, eHide: false, aHide: false, aLunge: 0, eLunge: 0,
    ball: null, lastCmd: 0, participants: new Set([ai])
  };
  BT.eHp = BT.enemy.hp; BT.aHp = BT.ally.hp; BT.aExp = expFrac(BT.ally);
  push(BattleLayer);
  await fadeIn(16);
  let result;
  try { result = await battleMain(); } catch (e) { console.error(e); result = 'run'; }
  const lost = result === 'lose' && !opts.canLose;
  await fadeOut(16);
  pop(BattleLayer);
  BT = null;
  if (lost) await blackout();
  Sound.play('town');
  await fadeIn(16);
  if (lost) await say('Una buona tazza di caffè e la squadra è di nuovo in piena forma! Attento a non esagerare con il lavoro.');
  return result;
}

async function battleMain() {
  const b = BT;
  if (b.wild) {
    b.eVis = true;
    await animate(30, t => { b.eSlide = 1 - t; });
    await bsay(`Un ${monName(b.enemy)} selvatico ti sbarra la strada!`);
  } else {
    await animate(30, t => { b.eSlide = 1 - t; });
    await bsay(`${b.trainer.title} vuole lottare!`);
    await animate(16, t => { b.trainerX = t; });
    b.showTrainer = false;
    b.eVis = true; b.eSlide = 0;
    Sound.sfx('door');
    await bsay(`${b.trainer.title} manda in campo ${monName(b.enemy)}!`);
  }
  await sendOutAlly(true);

  for (;;) {
    const act = await chooseAction();
    if (act.type === 'run') {
      if (!b.wild) { await bsay('Non puoi scappare da una lotta tra colleghi!'); continue; }
      const as = calcStats(b.ally).spd, es = calcStats(b.enemy).spd;
      b.runTries = (b.runTries || 0) + 1;
      if (as >= es || Math.random() < 0.45 + 0.15 * b.runTries) {
        Sound.sfx('door');
        await bsay('Fuga riuscita!');
        return 'run';
      }
      await bsay('Non riesci a fuggire!');
    } else if (act.type === 'switch') {
      await bsay(`Torna qui, ${monName(b.ally)}!`);
      await animate(12, t => { b.aSlide = -t; });
      b.aVis = false;
      setAlly(act.idx);
      await sendOutAlly();
    } else if (act.type === 'item') {
      const r = await useItemInBattle(act);
      if (r === 'caught') return 'catch';
    }

    const eMove = pickEnemyMove();
    if (act.type === 'move') {
      const sa = calcStats(b.ally).spd * stageMul(b.aSt.spd), se = calcStats(b.enemy).spd * stageMul(b.eSt.spd);
      const order = (sa > se || (sa === se && Math.random() < 0.5)) ? ['a', 'e'] : ['e', 'a'];
      for (const s of order) {
        await useMove(s, s === 'a' ? act.id : eMove);
        const r = await checkFaints();
        if (r === 'win' || r === 'lose') return await endBattle(r);
        if (r === 'faint') break;
      }
    } else {
      await useMove('e', eMove);
      const r = await checkFaints();
      if (r === 'win' || r === 'lose') return await endBattle(r);
    }
  }
}

function setAlly(idx) {
  BT.ai = idx;
  BT.ally = game.party[idx];
  BT.aSt = freshStages();
  BT.aHp = BT.ally.hp;
  BT.aExp = expFrac(BT.ally);
  BT.participants.add(idx);
}

async function sendOutAlly(first) {
  const b = BT;
  b.aVis = true; b.aDrop = 0; b.aSlide = 1;
  Sound.sfx('door');
  await animate(14, t => { b.aSlide = 1 - t; });
  await bsay(first ? `Vai! ${monName(b.ally)}!` : `Forza, ${monName(b.ally)}!`, { auto: 20 });
}

async function chooseAction() {
  const b = BT;
  for (;;) {
    const d = await bsay(`Cosa farà\n${monName(b.ally)}?`, { keep: true, instant: true, width: 104 });
    const i = await choose(['LOTTA', 'ZAINO', 'SQUADRA', 'FUGA'], { cols: 2, colW: 58, x: 116, y: 112, w: 124, h: 48, lh: 16, style: 'menu', start: b.lastCmd });
    pop(d);
    b.lastCmd = i;
    if (i === 0) {
      const mv = await chooseMove();
      if (mv) return { type: 'move', id: mv };
    } else if (i === 1) {
      const key = await pickItem({ battle: true });
      if (!key) continue;
      if (key === 'contratto') {
        if (!b.wild) { await bsay("Non puoi assumere l'Officemon di un collega!"); continue; }
        if (game.party.length >= 6) { await bsay('La tua squadra è al completo: non puoi assumere altri Officemon.'); continue; }
        return { type: 'item', key };
      }
      const idx = await pickMonFor(key, true);
      if (idx >= 0) return { type: 'item', key, idx };
    } else if (i === 2) {
      const L = partyScreen({ prompt: 'Scegli un Officemon.', battle: true });
      push(L);
      const idx = await partyPick(L);
      pop(L);
      if (idx < 0) continue;
      if (idx === b.ai) { await bsay(`${monName(b.ally)} è già in campo!`); continue; }
      if (game.party[idx].hp <= 0) { await bsay(`${monName(game.party[idx])} non ha più energie per lottare!`); continue; }
      return { type: 'switch', idx };
    } else {
      return { type: 'run' };
    }
  }
}

function chooseMove() {
  const ms = BT.ally.moves;
  return choose(ms.map(id => MOVES[id].name), {
    cols: 2, colW: 80, x: 0, y: 112, w: 170, h: 48, lh: 16, size: 6, style: 'menu', cancel: -1,
    drawExtra(i) {
      const mv = MOVES[ms[i]];
      frame(170, 112, 70, 48, 'menu');
      txt('TIPO', 180, 122, { size: 6, color: '#707070' });
      rect(180, 132, 52, 9, TYPES[mv.type].color);
      txt(TYPES[mv.type].name, 206, 133, { size: 6, color: '#f8f8f8', shadow: '#404040', align: 'center' });
      txt('POT ' + (mv.power || '-'), 180, 146, { size: 6 });
    }
  }).then(i => i < 0 ? null : ms[i]);
}

function pickEnemyMove() {
  const e = BT.enemy, ms = e.moves;
  if (!BT.wild && Math.random() < 0.65) {
    let best = ms[0], bv = -1;
    for (const id of ms) {
      const mv = MOVES[id];
      let v = mv.power * typeEff(mv.type, SPECIES[BT.ally.sp].type) * (mv.type === SPECIES[e.sp].type ? 1.5 : 1);
      if (!mv.power) v = mv.effect.heal ? (e.hp < maxHp(e) * 0.4 ? 120 : 0) : 25;
      if (v > bv) { bv = v; best = id; }
    }
    return best;
  }
  const useful = ms.filter(id => !(MOVES[id].effect && MOVES[id].effect.heal && e.hp >= maxHp(e) * 0.8));
  const pool = useful.length ? useful : ms;
  return pool[Math.floor(Math.random() * pool.length)];
}

function calcDamage(user, target, mv, uSt, tSt) {
  const atk = calcStats(user).atk * stageMul(uSt.atk);
  const def = calcStats(target).def * stageMul(tSt.def);
  const base = Math.floor(Math.floor(Math.floor(2 * user.lvl / 5 + 2) * mv.power * atk / def) / 50) + 2;
  const stab = SPECIES[user.sp].type === mv.type ? 1.5 : 1;
  const eff = typeEff(mv.type, SPECIES[target.sp].type);
  const crit = Math.random() < 1 / 16;
  const dmg = Math.max(1, Math.floor(base * stab * eff * (crit ? 1.5 : 1) * (0.85 + Math.random() * 0.15)));
  return { dmg, eff, crit };
}

async function useMove(s, id) {
  const b = BT, user = sideMon(s), target = sideMon(other(s));
  if (user.hp <= 0) return;
  const mv = MOVES[id];
  await bsay(`${nm(s)} usa ${mv.name.toUpperCase()}!`, { auto: 24 });
  if (Math.random() * 100 >= mv.acc) { await bsay(`Ma l'attacco di ${nm(s)} fallisce!`); return; }
  if (mv.power > 0) {
    const t = other(s);
    await animate(10, k => { if (s === 'a') b.aLunge = Math.sin(k * Math.PI) * 10; else b.eLunge = Math.sin(k * Math.PI) * 10; });
    const r = calcDamage(user, target, mv, sideStages(s), sideStages(t));
    Sound.sfx(r.eff > 1 ? 'super' : r.eff < 1 ? 'weak' : 'hit');
    await animate(24, k => { const h = Math.floor(k * 8) % 2 === 1 && k < 1; if (t === 'a') b.aHide = h; else b.eHide = h; });
    const from = target.hp, to = Math.max(0, target.hp - r.dmg);
    target.hp = to;
    await animate(Math.max(12, Math.min(40, (from - to) * 2)), k => setDispHp(t, from + (to - from) * k));
    if (r.crit) await bsay('Brutto colpo!', { auto: 40 });
    if (r.eff > 1) await bsay('È superefficace!', { auto: 40 });
    else if (r.eff < 1) await bsay('Non è molto efficace...', { auto: 40 });
    return;
  }
  const e = mv.effect;
  if (e.heal) {
    const max = maxHp(user);
    if (user.hp >= max) { await bsay('Ma non succede nulla!'); return; }
    const from = user.hp;
    user.hp = Math.min(max, user.hp + Math.floor(max * e.heal));
    Sound.sfx('heal');
    await animate(24, k => setDispHp(s, from + (user.hp - from) * k));
    await bsay(`${nm(s)} recupera energie!`);
    return;
  }
  const ts = e.target === 'self' ? s : other(s);
  const st = sideStages(ts), cur = st[e.stat], nv = Math.max(-6, Math.min(6, cur + e.stages));
  if (nv === cur) { await bsay(`${STAT_NAMES[e.stat]} di ${nm(ts)} non può ${e.stages > 0 ? 'salire' : 'scendere'} ancora!`); return; }
  st[e.stat] = nv;
  Sound.sfx(e.stages > 0 ? 'up' : 'down');
  await animate(20, k => { const h = Math.floor(k * 6) % 2 === 1 && k < 1; if (ts === 'a') b.aHide = h; else b.eHide = h; });
  await bsay(`${STAT_NAMES[e.stat]} di ${nm(ts)} ${e.stages > 0 ? 'aumenta' : 'diminuisce'}!`);
}

async function checkFaints() {
  const b = BT;
  if (b.enemy.hp <= 0) {
    Sound.sfx('faint');
    await animate(20, t => { b.eDrop = t; });
    b.eVis = false;
    await bsay(`${nm('e')} è esausto!`);
    await gainExp();
    const next = b.enemies.findIndex(m => m.hp > 0);
    if (next < 0) return 'win';
    b.enemy = b.enemies[next];
    b.eSt = freshStages();
    b.eHp = b.enemy.hp;
    b.participants = new Set([b.ai]);
    await bsay(`${b.trainer.title} sta per mandare in campo ${monName(b.enemy)}.`);
    if (game.party.filter(m => m.hp > 0).length > 1 && await ask(`Vuoi cambiare Officemon?`, { style: 'battle' })) {
      const L = partyScreen({ prompt: 'Scegli un Officemon.', battle: true });
      push(L);
      for (;;) {
        const idx = await partyPick(L);
        if (idx < 0 || idx === b.ai) break;
        if (game.party[idx].hp <= 0) { Sound.sfx('bump'); continue; }
        pop(L);
        await animate(12, t => { b.aSlide = -t; });
        setAlly(idx);
        await sendOutAlly();
        break;
      }
      pop(L);
    }
    b.eVis = true; b.eDrop = 0; b.eSlide = 1;
    Sound.sfx('door');
    await animate(14, t => { b.eSlide = 1 - t; });
    await bsay(`${b.trainer.title} manda in campo ${monName(b.enemy)}!`, { auto: 30 });
    return 'faint';
  }
  if (b.ally.hp <= 0) {
    Sound.sfx('faint');
    await animate(20, t => { b.aDrop = t; });
    b.aVis = false;
    await bsay(`${monName(b.ally)} è esausto!`);
    if (!game.party.some(m => m.hp > 0)) return 'lose';
    const L = partyScreen({ prompt: 'Scegli il prossimo Officemon.', battle: true, forced: true });
    push(L);
    let idx;
    for (;;) {
      idx = await partyPick(L);
      if (idx >= 0 && game.party[idx].hp > 0) break;
      Sound.sfx('bump');
    }
    pop(L);
    setAlly(idx);
    await sendOutAlly();
    return 'faint';
  }
  return null;
}

async function gainExp() {
  const b = BT, e = b.enemy;
  const total = Math.floor(SPECIES[e.sp].exp * e.lvl / 5 * (b.wild ? 1 : 1.5));
  const alive = [...b.participants].filter(i => game.party[i] && game.party[i].hp > 0);
  if (!alive.length) return;
  const share = Math.max(1, Math.floor(total / alive.length));
  for (const i of alive) {
    const m = game.party[i], isActive = i === b.ai;
    await bsay(`${monName(m)} guadagna ${share} Punti Esperienza!`);
    let left = share;
    while (left > 0 && m.lvl < MAX_LVL) {
      const need = expFor(m.lvl + 1) - m.exp, add = Math.min(need, left);
      const from = expFrac(m);
      m.exp += add; left -= add;
      const up = m.exp >= expFor(m.lvl + 1);
      if (isActive) await animate(24, t => { b.aExp = from + ((up ? 1 : expFrac(m)) - from) * t; });
      if (up) {
        await levelUp(m, isActive);
        if (isActive) b.aExp = 0;
      }
    }
    if (isActive) b.aExp = expFrac(m);
  }
}

async function levelUp(m, isActive) {
  const old = calcStats(m);
  m.lvl++;
  const ns = calcStats(m);
  if (m.hp > 0) m.hp += ns.hp - old.hp;
  if (isActive) BT.aHp = m.hp;
  Sound.sfx('levelup');
  await bsay(`${monName(m)} sale al Lv. ${m.lvl}!`);
  for (const [l, mv] of SPECIES[m.sp].learn) if (l === m.lvl) await learnMove(m, mv, bsay);
}

async function learnMove(m, mv, out = say) {
  if (m.moves.includes(mv)) return;
  const name = monName(m), mvName = MOVES[mv].name.toUpperCase();
  if (m.moves.length < 4) {
    m.moves.push(mv);
    Sound.sfx('fanfare');
    await out(`${name} impara ${mvName}!`);
    return;
  }
  await out(`${name} vuole imparare ${mvName}, ma conosce già quattro mosse.`);
  const style = out === bsay ? 'battle' : 'normal';
  if (await ask(`Vuoi dimenticare una mossa per fare posto a ${mvName}?`, { style })) {
    const i = await choose(m.moves.map(id => MOVES[id].name), { cancel: -1, style: 'menu', x: 130, y: 112 - (m.moves.length * 15 + 14) });
    if (i >= 0) {
      const old = MOVES[m.moves[i]].name.toUpperCase();
      m.moves[i] = mv;
      await out(`1, 2 e... puf! ${name} dimentica ${old} e impara ${mvName}!`);
      return;
    }
  }
  await out(`${name} non impara ${mvName}.`);
}

async function useItemInBattle(act) {
  const b = BT, it = ITEMS[act.key];
  game.bag[act.key]--;
  if (act.key === 'contratto') {
    await bsay(`${game.name} propone un CONTRATTO!`, { auto: 20 });
    Sound.sfx('throw');
    b.ball = { x: 40, y: 90, r: 0 };
    await animate(24, t => { b.ball.x = 40 + (176 - 40) * t; b.ball.y = 90 - Math.sin(t * Math.PI) * 60 + (40 - 90) * t; });
    b.eVis = false;
    const S = SPECIES[b.enemy.sp];
    const hpR = b.enemy.hp / maxHp(b.enemy);
    const chance = Math.max(0.05, S.catch * (1 - 0.7 * hpR) + 0.05);
    const ok = Math.random() < chance;
    const shakes = ok ? 3 : Math.floor(Math.random() * 3);
    await wait(16);
    for (let i = 0; i < shakes; i++) {
      Sound.sfx('shake');
      await animate(16, t => { b.ball.r = Math.sin(t * Math.PI * 2) * 3; });
      await wait(12);
    }
    if (ok) {
      Sound.sfx('catch');
      await bsay(`Fatto! ${monName(b.enemy)} ha firmato il contratto!`);
      b.enemy.hp = Math.max(1, b.enemy.hp);
      game.party.push(b.enemy);
      game.flags.caught = (game.flags.caught || 0) + 1;
      await bsay(`${monName(b.enemy)} entra a far parte della tua squadra.`);
      b.ball = null;
      return 'caught';
    }
    b.ball = null;
    b.eVis = true;
    Sound.sfx('door');
    const msgs = ['Oh no! Ha strappato il contratto!', 'Accidenti! Voleva più ferie!', 'Quasi! Mancava solo una firma!'];
    await bsay(msgs[Math.min(shakes, 2)]);
    return null;
  }
  const m = game.party[act.idx];
  const r = applyHealItem(act.key, m);
  if (act.idx === b.ai) {
    const from = b.aHp;
    Sound.sfx('heal');
    await animate(24, t => { b.aHp = from + (m.hp - from) * t; });
  } else Sound.sfx('heal');
  await bsay(`${game.name} usa ${it.name.toUpperCase()}. ${r}`);
  return null;
}

async function endBattle(r) {
  const b = BT, t = b.trainer;
  if (r === 'win' && t) {
    Sound.play('victory');
    b.showTrainer = true; b.trainerX = 1;
    await animate(20, k => { b.trainerX = 1 - k; });
    await bsay(`Hai sconfitto ${t.title}!`);
    if (t.lose) await bsay(`${t.title}: ${t.lose}`);
    if (t.money) {
      game.money += t.money;
      Sound.sfx('coin');
      await bsay(`Ricevi ${t.money} buoni pasto come premio.`);
    }
  } else if (r === 'win') {
    Sound.play('victory');
    await wait(30);
  } else if (r === 'lose') {
    await bsay(`${game.name} non ha più Officemon in grado di lottare!`);
    if (!b.opts.canLose) await bsay(`${game.name} è stremato dalla fatica...`);
  }
  return r;
}

// ---------- Disegno della lotta ----------
function drawBattle() {
  const b = BT;
  if (!b) return;
  rect(0, 0, 240, 112, '#e8e0cc');
  for (let x = 0; x < 240; x += 24) rect(x, 0, 1, 50, '#ddd3bf');
  rect(0, 8, 240, 1, '#f4ecd8');
  rect(18, 6, 46, 30, '#f8f8f8'); rect(20, 8, 42, 26, '#9ccaf0'); rect(40, 8, 2, 26, '#f8f8f8'); rect(20, 26, 42, 8, '#b8daf8');
  rect(150, 4, 30, 22, '#9c7c5c'); rect(152, 6, 26, 18, '#f0e8c8'); rect(156, 10, 18, 2, '#c08060'); rect(156, 15, 12, 2, '#80a0c0');
  rect(0, 46, 240, 4, '#9c7c5c'); rect(0, 46, 240, 1, '#b89878');
  rect(0, 50, 240, 62, '#a8b4c4');
  for (let y = 52; y < 112; y += 6) for (let x = (y / 6) % 2 ? 0 : 6; x < 240; x += 12) rect(x, y, 2, 1, '#98a4b6');
  ellipseFill(176, 64, 46, 9, '#8a96aa'); ellipseFill(176, 63, 42, 7, '#c2ccd8'); ellipseFill(176, 62, 36, 5, '#d4dce6');
  ellipseFill(62, 108, 56, 10, '#8a96aa'); ellipseFill(62, 107, 52, 8, '#c2ccd8'); ellipseFill(62, 106, 44, 6, '#d4dce6');

  if (b.showTrainer && b.trainer && b.trainer.pal) {
    const img = Sprites.character(b.trainer.pal, 'down', 0);
    const x = 160 - b.eSlide * 200 + b.trainerX * 100;
    ctx.drawImage(img, x, 18, 32, 42);
  }
  if (b.eVis && !b.eHide) {
    const img = Sprites.mon(b.enemy.sp);
    const x = 152 - b.eSlide * 200 - b.eLunge, y = 18 + b.eDrop * 48;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 240, 66); ctx.clip();
    ctx.drawImage(img, Math.round(x), Math.round(y));
    ctx.restore();
  }
  if (b.ball) {
    ctx.save();
    ctx.translate(b.ball.x, b.ball.y + 8);
    ctx.rotate(b.ball.r * 0.15);
    ctx.drawImage(Sprites.obj('contract'), -8, -8);
    ctx.restore();
  }
  if (b.aVis && !b.aHide) {
    const img = Sprites.mon(b.ally.sp, true);
    const x = 38 + b.aSlide * 200 + b.aLunge, y = 62 + b.aDrop * 50;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 240, 112); ctx.clip();
    ctx.drawImage(img, Math.round(x), Math.round(y), 52, 52);
    ctx.restore();
  }
  if (b.eVis || (b.eDrop > 0 && b.eDrop < 1)) drawEnemyBox(b);
  if (b.aVis) drawAllyBox(b);
}

function panel(x, y, w, h) {
  rect(x + 1, y, w - 2, h, '#404848'); rect(x, y + 1, w, h - 2, '#404848');
  rect(x + 1, y + 1, w - 2, h - 2, '#f8f8e0');
  rect(x + 2, y + h - 3, w - 4, 1, '#d8d8b8');
}
function drawEnemyBox(b) {
  const m = b.enemy, x = 6, y = 8, w = 116;
  panel(x, y, w, 28);
  txt(monName(m), x + 6, y + 5, { size: 6 });
  txt('Lv' + m.lvl, x + w - 6, y + 5, { size: 6, align: 'right' });
  txt('PS', x + 30, y + 17, { size: 5, color: '#e08020', shadow: false });
  hpBar(x + 44, y + 18, 62, Math.max(0, b.eHp) / maxHp(m));
}
function drawAllyBox(b) {
  const m = b.ally, x = 118, y = 68, w = 118, mx = maxHp(m);
  panel(x, y, w, 40);
  txt(monName(m), x + 8, y + 5, { size: 6 });
  txt('Lv' + m.lvl, x + w - 6, y + 5, { size: 6, align: 'right' });
  txt('PS', x + 32, y + 17, { size: 5, color: '#e08020', shadow: false });
  hpBar(x + 46, y + 18, 62, Math.max(0, b.aHp) / mx);
  txt(`${Math.max(0, Math.ceil(b.aHp))}/${mx}`, x + w - 8, y + 25, { size: 6, align: 'right' });
  rect(x + 8, y + 35, w - 16, 2, '#404848');
  rect(x + 8, y + 35, Math.round((w - 16) * b.aExp), 2, '#40a8f8');
}
