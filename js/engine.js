'use strict';
// Motore: input, loop a passo fisso, livelli (layer), testo, finestre e menu.
const W = 240, H = 160, SCALE = 4, TS = 16;
const FONT = '"Press Start 2P", "Courier New", monospace';
const canvas = document.getElementById('screen');
canvas.width = W * SCALE;
canvas.height = H * SCALE;
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
let frameCount = 0;

// ---------- Input ----------
const KEYMAP = {
  ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down',
  ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
  KeyZ: 'a', KeyJ: 'a', Space: 'a',
  KeyX: 'b', KeyK: 'b', Backspace: 'b', Escape: 'b',
  Enter: 'start', KeyM: 'select'
};
const Input = {
  down: {}, pressed: {}, charHandler: null,
  press(b) {
    Sound.init();
    if (b === 'select') { Sound.toggleMute(); updateMuteLabel(); return; }
    if (!this.down[b]) this.pressed[b] = true;
    this.down[b] = true;
  },
  release(b) { this.down[b] = false; },
  hit(b) { return !!this.pressed[b]; },
  held(b) { return !!this.down[b]; },
  ok() { return this.hit('a') || this.hit('start'); },
  dir() {
    for (const d of ['up', 'down', 'left', 'right']) if (this.pressed[d]) return d;
    return null;
  },
  heldDir() {
    for (const d of ['up', 'down', 'left', 'right']) if (this.down[d]) return d;
    return null;
  },
  clear() { this.pressed = {}; }
};

window.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (Input.charHandler && e.key.length === 1) {
    if (Input.charHandler(e.key)) { e.preventDefault(); Sound.init(); return; }
  }
  const b = KEYMAP[e.code];
  if (!b) return;
  e.preventDefault();
  if (e.repeat) return;
  Input.press(b);
});
window.addEventListener('keyup', e => { const b = KEYMAP[e.code]; if (b) Input.release(b); });
window.addEventListener('blur', () => { Input.down = {}; });

function updateMuteLabel() {
  const el = document.getElementById('mute');
  if (el) el.textContent = Sound.muted ? 'AUDIO OFF' : 'AUDIO ON';
}

// Controlli touch
function setupTouch() {
  document.querySelectorAll('[data-btn]').forEach(el => {
    const b = el.dataset.btn;
    const on = e => { e.preventDefault(); el.classList.add('on'); Input.press(b); };
    const off = e => { e.preventDefault(); el.classList.remove('on'); Input.release(b); };
    el.addEventListener('pointerdown', on);
    el.addEventListener('pointerup', off);
    el.addEventListener('pointercancel', off);
    el.addEventListener('pointerleave', off);
    el.addEventListener('contextmenu', e => e.preventDefault());
  });
  const pad = document.getElementById('dpad');
  if (!pad) return;
  let cur = null;
  const set = d => {
    if (d === cur) return;
    if (cur) Input.release(cur);
    cur = d;
    pad.dataset.dir = d || '';
    if (d) Input.press(d);
  };
  const fromEvent = e => {
    const r = pad.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
    if (Math.hypot(x, y) < r.width * 0.12) return cur;
    return Math.abs(x) > Math.abs(y) ? (x > 0 ? 'right' : 'left') : (y > 0 ? 'down' : 'up');
  };
  pad.addEventListener('pointerdown', e => { e.preventDefault(); pad.setPointerCapture(e.pointerId); set(fromEvent(e)); });
  pad.addEventListener('pointermove', e => { if (e.buttons || e.pointerType === 'touch') { if (cur) set(fromEvent(e)); } });
  const end = e => { e.preventDefault(); set(null); };
  pad.addEventListener('pointerup', end);
  pad.addEventListener('pointercancel', end);
  pad.addEventListener('contextmenu', e => e.preventDefault());
}

// Mouse, trackpad e tocco sullo schermo: click sui menu, sui tasti e sulla mappa.
const Pointer = { q: [], hover: null, moved: false };
function toGame(e) {
  const r = canvas.getBoundingClientRect();
  return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H };
}
canvas.addEventListener('pointerdown', e => {
  e.preventDefault();
  Sound.init();
  const p = toGame(e);
  Pointer.q.push({ x: p.x, y: p.y, b: e.button === 2 ? 'b' : 'a' });
});
canvas.addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse') return;
  Pointer.hover = toGame(e);
  Pointer.moved = true;
});
canvas.addEventListener('contextmenu', e => e.preventDefault());
function dispatchPointer(top) {
  if (!top) { Pointer.q.length = 0; return; }
  if (Pointer.moved && Pointer.hover && top.hover) top.hover(Pointer.hover.x, Pointer.hover.y);
  Pointer.moved = false;
  if (!Pointer.q.length) return;
  const c = Pointer.q.shift();
  if (c.b === 'b') { Input.pressed.b = true; return; }
  if (top.click && top.click(c.x, c.y)) return;
  Input.pressed.a = true;
}

// ---------- Layer ----------
const Layers = [];
function push(l) { Layers.push(l); return l; }
function pop(l) { const i = Layers.indexOf(l); if (i >= 0) Layers.splice(i, 1); }

function wait(frames) {
  return new Promise(res => {
    const l = { update() { if (--frames <= 0) { pop(l); res(); } }, draw() {} };
    push(l);
  });
}
function animate(frames, fn) {
  return new Promise(res => {
    let f = 0;
    const l = { update() { f++; fn(Math.min(1, f / frames)); if (f >= frames) { pop(l); res(); } }, draw() {} };
    push(l);
  });
}
function waitPress() {
  return new Promise(res => {
    const l = { update() { if (Input.ok() || Input.hit('b')) { Sound.sfx('select'); pop(l); res(); } }, draw() {} };
    push(l);
  });
}

const Overlay = { a: 0, color: '0,0,0', draw() { if (this.a > 0) { ctx.fillStyle = `rgba(${this.color},${this.a})`; ctx.fillRect(0, 0, W, H); } } };
async function fadeOut(frames = 14, color = '0,0,0') {
  pop(Overlay); Overlay.color = color; push(Overlay);
  await animate(frames, t => { Overlay.a = t; });
}
async function fadeIn(frames = 14) {
  pop(Overlay); push(Overlay);
  await animate(frames, t => { Overlay.a = 1 - t; });
  pop(Overlay); Overlay.a = 0;
}

// ---------- Loop ----------
let last = 0, acc = 0;
const STEP = 1000 / 60;
function loop(ts) {
  if (!last) last = ts;
  acc += Math.min(100, ts - last);
  last = ts;
  while (acc >= STEP) {
    acc -= STEP;
    const top = Layers[Layers.length - 1];
    dispatchPointer(top);
    if (top && top.update) {
      try { top.update(); } catch (e) { console.error(e); }
    }
    Input.clear();
    frameCount++;
    if (typeof game !== 'undefined' && game.started) game.time++;
  }
  ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
  ctx.imageSmoothingEnabled = false;
  let start = 0;
  for (let i = Layers.length - 1; i >= 0; i--) if (Layers[i].opaque) { start = i; break; }
  if (!Layers.some(l => l.opaque)) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); }
  for (let i = start; i < Layers.length; i++) {
    try { Layers[i].draw(); } catch (e) { console.error(e); }
  }
  requestAnimationFrame(loop);
}

// ---------- Disegno ----------
function rect(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }
function setFont(size) { ctx.font = `${size}px ${FONT}`; }
function txt(s, x, y, o = {}) {
  const size = o.size || 7;
  setFont(size);
  ctx.textBaseline = 'top';
  ctx.textAlign = o.align || 'left';
  if (o.shadow !== false) {
    ctx.fillStyle = o.shadow || '#d0d0c8';
    ctx.fillText(s, x + 0.75, y + 0.75);
  }
  ctx.fillStyle = o.color || '#404040';
  ctx.fillText(s, x, y);
  ctx.textAlign = 'left';
}
function textW(s, size = 7) { setFont(size); return ctx.measureText(s).width; }
function wrapText(s, maxW, size = 7) {
  const lines = [];
  for (const para of String(s).split('\n')) {
    let line = '';
    for (const w of para.split(' ')) {
      const test = line ? line + ' ' + w : w;
      if (line && textW(test, size) > maxW) { lines.push(line); line = w; } else line = test;
    }
    lines.push(line);
  }
  return lines;
}
const STYLES = {
  normal: { fill: '#f8f8f8', b1: '#485060', b2: '#a8c0d8', text: '#404040', shadow: '#d0d0c8' },
  battle: { fill: '#284860', b1: '#101820', b2: '#d8b050', text: '#f8f8f8', shadow: '#586878' },
  menu: { fill: '#f8f8f8', b1: '#485060', b2: '#d8b050', text: '#404040', shadow: '#d0d0c8' }
};
function frame(x, y, w, h, style = 'normal') {
  const s = STYLES[style] || STYLES.normal;
  rect(x + 2, y, w - 4, h, s.b1); rect(x, y + 2, w, h - 4, s.b1); rect(x + 1, y + 1, w - 2, h - 2, s.b1);
  rect(x + 2, y + 1, w - 4, h - 2, s.b2); rect(x + 1, y + 2, w - 2, h - 4, s.b2);
  rect(x + 3, y + 2, w - 6, h - 4, s.fill); rect(x + 2, y + 3, w - 4, h - 6, s.fill);
}
function cursor(x, y, c = '#404040') { for (let i = 0; i < 4; i++) rect(x + i, y + i, 1, 7 - 2 * i, c); }
function downArrow(x, y, c = '#e05030') { for (let i = 0; i < 4; i++) rect(x + i, y + i, 7 - 2 * i, 1, c); }
function ellipseFill(cx, cy, rx, ry, c) {
  ctx.fillStyle = c;
  for (let y = -ry; y < ry; y++) {
    const yy = (y + 0.5) / ry;
    const hw = Math.round(rx * Math.sqrt(Math.max(0, 1 - yy * yy)));
    ctx.fillRect(Math.round(cx - hw), Math.round(cy + y), hw * 2, 1);
  }
}
function hpColor(r) { return r > 0.5 ? '#48d070' : r > 0.2 ? '#f0c030' : '#f04838'; }
function hpBar(x, y, w, ratio) {
  rect(x - 1, y - 1, w + 2, 5, '#404040');
  rect(x, y, w, 3, '#686868');
  const fw = Math.max(0, Math.round(w * ratio));
  if (fw > 0) { rect(x, y, fw, 3, hpColor(ratio)); rect(x, y, fw, 1, 'rgba(255,255,255,.35)'); }
}

// ---------- Dialoghi ----------
const DLG = {
  normal: { x: 2, y: 114, w: 236, h: 44, tx: 11, ty: 10, lw: 212 },
  battle: { x: 0, y: 112, w: 240, h: 48, tx: 11, ty: 11, lw: 216 }
};
function say(msg, opts = {}) {
  return new Promise(res => {
    const style = opts.style || 'normal';
    const g = Object.assign({}, DLG[style]);
    if (opts.width) g.lw = opts.width;
    const size = opts.size || 7;
    const lines = wrapText(msg, g.lw, size);
    let page = 0, chars = 0, done = false, timer = 0;
    const pageLen = () => lines.slice(page, page + 2).join('').length;
    const L = {
      dialog: true,
      update() {
        if (done) return;
        const total = pageLen();
        if (chars < total) {
          if (opts.instant) chars = total;
          else chars += (Input.held('a') || Input.held('b')) ? 3 : 1.25;
          if (Input.hit('a') || Input.hit('b')) chars = total;
          if (chars >= total) {
            chars = total;
            if (page + 2 >= lines.length && opts.keep) { done = true; res(L); }
          }
          return;
        }
        if (opts.auto && page + 2 >= lines.length) {
          if (++timer >= opts.auto || Input.hit('a') || Input.hit('b')) { pop(L); res(); }
          return;
        }
        if (Input.hit('a') || Input.hit('b') || Input.hit('start')) {
          Sound.sfx('blip');
          if (page + 2 < lines.length) { page += 2; chars = 0; } else { pop(L); res(); }
        }
      },
      draw() {
        const s = STYLES[style];
        if (opts.portrait) {
          frame(2, 62, 54, 52, 'menu');
          rect(5, 65, 48, 46, '#d8e4f0');
          ctx.drawImage(Sprites.portrait(opts.portrait), 5, 64);
        }
        frame(g.x, g.y, g.w, g.h, style);
        let left = Math.floor(chars);
        lines.slice(page, page + 2).forEach((ln, i) => {
          const part = ln.slice(0, Math.max(0, left));
          left -= ln.length;
          txt(part, g.x + g.tx, g.y + g.ty + i * 15, { color: s.text, shadow: s.shadow, size });
        });
        if (!done && !opts.auto && chars >= pageLen() && (frameCount >> 4) % 2 === 0) {
          downArrow(g.x + g.w - 16, g.y + g.h - 11, style === 'battle' ? '#f8d050' : '#e05030');
        }
      }
    };
    push(L);
  });
}
async function sayAll(list, opts) {
  if (!Array.isArray(list)) list = [list];
  for (const m of list) await say(typeof m === 'function' ? m() : m, opts);
}

// Menu di scelta generico. Restituisce l'indice scelto oppure o.cancel con B.
function choose(options, o = {}) {
  return new Promise(res => {
    const size = o.size || 7, cols = o.cols || 1, lh = o.lh || 15;
    const rows = Math.ceil(options.length / cols);
    const colW = o.colW || (Math.max(...options.map(s => textW(s, size))) + 14);
    const w = o.w || colW * cols + 16;
    const h = o.h || rows * lh + 14;
    const x = o.x !== undefined ? o.x : W - w - 2;
    const y = o.y !== undefined ? o.y : 112 - h;
    let i = o.start || 0;
    const style = o.style || 'normal';
    const hit = (gx, gy) => options.findIndex((opt, k) => {
      const r = Math.floor(k / cols), c = k % cols;
      const tx = x + 14 + c * colW, ty = y + 9 + r * lh;
      return gx >= tx - 11 && gx < tx - 11 + colW && gy >= ty - 4 && gy < ty - 4 + lh;
    });
    const L = {
      click(gx, gy) {
        const k = hit(gx, gy);
        if (k >= 0) { i = k; Sound.sfx('select'); pop(L); res(i); }
        return true;
      },
      hover(gx, gy) { const k = hit(gx, gy); if (k >= 0) i = k; },
      update() {
        const d = Input.dir();
        if (d) {
          let r = Math.floor(i / cols), c = i % cols;
          if (d === 'up') r = (r - 1 + rows) % rows;
          if (d === 'down') r = (r + 1) % rows;
          if (d === 'left' && cols > 1) c = (c - 1 + cols) % cols;
          if (d === 'right' && cols > 1) c = (c + 1) % cols;
          let ni = r * cols + c;
          if (ni >= options.length) ni = cols > 1 ? r * cols : options.length - 1;
          if (ni !== i) { i = ni; Sound.sfx('blip'); }
        }
        if (Input.ok()) { Sound.sfx('select'); pop(L); res(i); return; }
        if (Input.hit('b') && o.cancel !== undefined) { Sound.sfx('blip'); pop(L); res(o.cancel); }
      },
      draw() {
        const s = STYLES[style];
        frame(x, y, w, h, style);
        options.forEach((opt, k) => {
          const r = Math.floor(k / cols), c = k % cols;
          const tx = x + 14 + c * colW, ty = y + 9 + r * lh;
          txt(opt, tx, ty, { size, color: s.text, shadow: s.shadow });
          if (k === i) cursor(tx - 9, ty, s.text);
        });
        if (o.drawExtra) o.drawExtra(i);
      }
    };
    push(L);
  });
}
async function ask(q, o = {}) {
  const d = await say(q, Object.assign({}, o, { keep: true }));
  const i = await choose(['SÌ', 'NO'], { cancel: 1, style: o.style === 'battle' ? 'menu' : 'normal', x: 182, y: o.style === 'battle' ? 66 : 70 });
  pop(d);
  return i === 0;
}
