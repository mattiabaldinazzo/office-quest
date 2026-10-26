'use strict';
// Pixel art generata via codice: tile, personaggi, Officemon e icone.
const Sprites = (() => {
  const cache = {};
  function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function painter(g, W2, H2) {
    const P = {
      r(x, y, w, h, c) { g.fillStyle = c; g.fillRect(x, y, w, h); },
      p(x, y, c) { g.fillStyle = c; g.fillRect(x, y, 1, 1); },
      f(test, c) { g.fillStyle = c; for (let y = 0; y < H2; y++) for (let x = 0; x < W2; x++) if (test(x, y)) g.fillRect(x, y, 1, 1); },
      e(cx, cy, rx, ry, c) { P.f((x, y) => { const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry; return dx * dx + dy * dy <= 1; }, c); },
      ring(cx, cy, rx, ry, t, c) {
        P.f((x, y) => {
          const dx = (x + 0.5 - cx), dy = (y + 0.5 - cy);
          const o = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
          const i = (dx * dx) / ((rx - t) * (rx - t)) + (dy * dy) / ((ry - t) * (ry - t));
          return o <= 1 && i > 1;
        }, c);
      },
      rr(x, y, w, h, r, c) { P.f(rrTest(x, y, w, h, r), c); },
      ln(x0, y0, x1, y1, c, t = 1) {
        const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;
        for (;;) {
          P.r(x0, y0, t, t, c);
          if (x0 === x1 && y0 === y1) break;
          const e2 = 2 * err;
          if (e2 > -dy) { err -= dy; x0 += sx; }
          if (e2 < dx) { err += dx; y0 += sy; }
        }
      },
      clear(x, y, w, h) { g.clearRect(x, y, w, h); },
      eye(x, y, h = 4, look = 0) {
        P.r(x, y, 3, h, '#202028');
        P.p(x + (look > 0 ? 1 : 0), y, '#ffffff');
        P.p(x + (look > 0 ? 1 : 0), y + 1, '#ffffff');
      },
      blush(x, y) { P.r(x, y, 3, 1, '#f09090'); }
    };
    return P;
  }
  function rrTest(x, y, w, h, r) {
    return (px, py) => {
      if (px < x || py < y || px >= x + w || py >= y + h) return false;
      const cx = Math.min(Math.max(px + 0.5, x + r), x + w - r);
      const cy = Math.min(Math.max(py + 0.5, y + r), y + h - r);
      const dx = px + 0.5 - cx, dy = py + 0.5 - cy;
      return dx * dx + dy * dy <= r * r;
    };
  }
  function outline(c, col = '#202028') {
    const g = c.getContext('2d');
    const w = c.width, h = c.height;
    const d = g.getImageData(0, 0, w, h);
    const p = d.data, out = new Uint8ClampedArray(p);
    const rgb = [parseInt(col.slice(1, 3), 16), parseInt(col.slice(3, 5), 16), parseInt(col.slice(5, 7), 16)];
    const a = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? 0 : p[(y * w + x) * 4 + 3];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (a(x, y) > 0) continue;
      if (a(x - 1, y) || a(x + 1, y) || a(x, y - 1) || a(x, y + 1)) {
        const k = (y * w + x) * 4;
        out[k] = rgb[0]; out[k + 1] = rgb[1]; out[k + 2] = rgb[2]; out[k + 3] = 255;
      }
    }
    g.putImageData(new ImageData(out, w, h), 0, 0);
  }
  function flipped(c) {
    const f = mk(c.width, c.height), g = f.getContext('2d');
    g.translate(c.width, 0); g.scale(-1, 1); g.drawImage(c, 0, 0);
    return f;
  }

  // ---------- Tile ----------
  const C = {
    carpet: '#9aa8bc', carpetD: '#8a98ac', carpetL: '#aab6c8',
    floor: '#e8dcc0', floorL: '#f4ead2', floorD: '#d0c4a8',
    face: '#ece4d4', faceD: '#ddd3c1', base: '#9c7c5c', baseL: '#b89878', baseD: '#7c5c3c',
    wtop: '#4c4660', wtopL: '#5a5470', wtopE: '#6c6488',
    wood: '#d09a60', woodL: '#e8b880', woodD: '#9c6838'
  };
  function carpet(P, v) {
    P.r(0, 0, 16, 16, C.carpet);
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      if ((x + y * 3) % 8 === 0) P.p(x, y, C.carpetD);
      else if ((x * 5 + y * 7 + v) % 13 === 0) P.p(x, y, C.carpetL);
    }
  }
  function tileFloor(P) {
    P.r(0, 0, 16, 16, C.floor);
    P.r(0, 0, 16, 1, C.floorD); P.r(0, 8, 16, 1, C.floorD);
    P.r(0, 0, 1, 16, C.floorD); P.r(8, 0, 1, 16, C.floorD);
    P.r(1, 1, 3, 1, C.floorL); P.r(9, 9, 3, 1, C.floorL); P.r(9, 1, 2, 1, C.floorL); P.r(1, 9, 2, 1, C.floorL);
  }
  function face(P) {
    P.r(0, 0, 16, 16, C.face);
    for (let x = 1; x < 16; x += 4) P.r(x, 0, 1, 12, C.faceD);
    P.r(0, 0, 16, 1, '#c8bca8');
    P.r(0, 12, 16, 4, C.base); P.r(0, 12, 16, 1, C.baseL); P.r(0, 15, 16, 1, C.baseD);
  }
  function wallTop(P) {
    P.r(0, 0, 16, 16, C.wtop);
    P.r(0, 4, 16, 1, C.wtopL); P.r(0, 12, 16, 1, C.wtopL);
    P.r(7, 0, 1, 4, C.wtopL); P.r(3, 5, 1, 7, C.wtopL); P.r(11, 5, 1, 7, C.wtopL); P.r(7, 13, 1, 3, C.wtopL);
  }
  function bg(P, under, v) {
    if (under === 'face') face(P); else if (under === 'floor') tileFloor(P); else carpet(P, v);
  }
  const TILES = {
    '.': (P, v) => carpet(P, v),
    ',': P => tileFloor(P),
    'X': P => P.r(0, 0, 16, 16, '#101018'),
    '#top': P => wallTop(P),
    '#face': P => face(P),
    'W': P => {
      face(P);
      P.r(2, 1, 12, 10, '#f8f8f8');
      P.r(3, 2, 10, 8, '#88c0f0');
      P.r(3, 7, 10, 3, '#a8d4f8');
      P.r(8, 2, 1, 8, '#f8f8f8');
      P.r(4, 3, 2, 1, '#e0f4ff'); P.r(4, 4, 1, 2, '#e0f4ff');
      P.r(10, 4, 2, 1, '#ffffff'); P.r(9, 5, 4, 1, '#ffffff');
      P.r(1, 11, 14, 1, '#c8c0b0');
    },
    'E': P => {
      face(P);
      P.r(1, 2, 14, 14, '#6c707c');
      P.r(2, 4, 6, 12, '#c0c8d4'); P.r(8, 4, 6, 12, '#b0b8c4');
      P.r(7, 4, 2, 12, '#5c606c');
      P.r(3, 5, 1, 9, '#e0e8f0'); P.r(9, 5, 1, 9, '#d0d8e0');
      P.r(6, 0, 4, 2, '#303038'); P.p(7, 0, '#f8d030'); P.p(8, 1, '#f8d030');
    },
    'S': P => {
      P.r(0, 0, 16, 16, '#5c5468');
      const sh = ['#d8ccb8', '#c4b8a4', '#aea290', '#988c7a'];
      for (let i = 0; i < 4; i++) { P.r(2, 12 - i * 4, 12, 4, sh[i]); P.r(2, 12 - i * 4, 12, 1, '#f0e8d8'); }
      P.r(0, 0, 2, 16, '#786890'); P.r(14, 0, 2, 16, '#786890');
    },
    'O': P => {
      face(P);
      P.r(2, 1, 12, 15, '#6c4424');
      P.r(3, 2, 10, 14, '#b07844');
      P.r(4, 3, 8, 5, '#9c6838'); P.r(4, 9, 8, 6, '#9c6838');
      P.r(5, 4, 6, 3, '#b8824e'); P.r(5, 10, 6, 4, '#b8824e');
      P.r(11, 9, 1, 2, '#f8d850');
    },
    'o': P => {
      tileFloor(P);
      P.r(1, 1, 14, 14, '#7c2c2c'); P.r(2, 2, 12, 12, '#b04848');
      for (let y = 4; y < 13; y += 3) P.r(3, y, 10, 1, '#c86060');
      P.r(6, 11, 4, 1, '#f0d0a0'); P.r(7, 12, 2, 1, '#f0d0a0');
    },
    'M': P => {
      P.r(0, 0, 16, 16, '#505868');
      P.r(1, 0, 14, 16, '#98c4e0');
      P.r(7, 0, 2, 16, '#505868');
      P.ln(2, 10, 6, 2, '#d8f0ff'); P.ln(9, 12, 13, 4, '#d8f0ff');
      P.r(5, 7, 1, 3, '#303038'); P.r(10, 7, 1, 3, '#303038');
    },
    'D': (P, v, u) => {
      bg(P, u, v);
      P.r(0, 1, 16, 11, C.wood); P.r(0, 1, 16, 1, C.woodL);
      P.r(0, 12, 16, 3, C.woodD); P.r(0, 15, 16, 1, '#6c4424');
      if (v === 0) { P.r(3, 3, 6, 5, '#f8f8f8'); P.r(4, 4, 4, 1, '#a0a8c8'); P.r(4, 6, 3, 1, '#a0a8c8'); }
      if (v === 1) { P.r(9, 4, 3, 3, '#f8f8f8'); P.r(10, 5, 1, 1, '#784020'); P.r(12, 5, 1, 1, '#f8f8f8'); }
      if (v === 2) { P.r(5, 5, 5, 2, '#3870c8'); P.r(10, 5, 1, 2, '#f8d030'); }
    },
    'C': (P, v, u) => {
      bg(P, u, v);
      P.r(0, 1, 16, 11, C.wood); P.r(0, 1, 16, 1, C.woodL);
      P.r(0, 12, 16, 3, C.woodD); P.r(0, 15, 16, 1, '#6c4424');
      P.r(3, 0, 10, 8, '#383848'); P.r(4, 1, 8, 6, v === 1 ? '#3878c8' : '#58a8e8');
      P.r(5, 2, 3, 1, '#c0e8ff'); P.r(5, 4, 5, 1, '#a0d0f8');
      P.r(7, 8, 2, 2, '#383848'); P.r(4, 10, 8, 2, '#e0e0e8'); P.r(4, 11, 8, 1, '#b0b0b8');
    },
    'R': (P, v, u) => {
      bg(P, u, v);
      P.r(0, 2, 16, 9, '#e8d0a8'); P.r(0, 2, 16, 1, '#f8e8c8');
      P.r(0, 11, 16, 5, '#a07850'); P.r(0, 11, 16, 1, '#c09068');
      if (v === 1) { P.r(6, 4, 4, 3, '#f8d030'); P.r(7, 3, 2, 1, '#f8d030'); P.r(5, 7, 6, 1, '#a08020'); }
    },
    'T': (P, v, u) => {
      bg(P, u, v);
      P.rr(1, 2, 14, 10, 2, '#c8a070'); P.r(2, 3, 12, 1, '#e0bc88');
      P.r(3, 12, 2, 3, '#8c6438'); P.r(11, 12, 2, 3, '#8c6438');
    },
    'P': (P, v, u) => {
      bg(P, u, v);
      P.r(4, 11, 8, 5, '#b06030'); P.r(3, 10, 10, 2, '#c87840'); P.r(5, 12, 1, 3, '#c87840');
      P.e(8, 6, 6, 5, '#3c8c3c');
      P.e(5, 5, 3, 3, '#58b050'); P.e(11, 6, 3, 3, '#58b050'); P.e(8, 3, 3, 3, '#68c058');
      P.p(6, 4, '#98e088'); P.p(9, 2, '#98e088'); P.p(12, 5, '#98e088');
    },
    'g': (P, v) => {
      P.r(0, 0, 16, 16, '#8494aa');
      for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) if ((x + y * 3) % 7 === 0) P.p(x, y, '#76869c');
      const cols = ['#282830', '#3870d0', '#e0c030', '#d04040'];
      const a = cols[v % 4], b = cols[(v + 1) % 4];
      P.ring(5, 6, 4, 3, 1, a); P.ring(11, 10, 4, 3, 1, b);
      P.ln(0, 13, 6, 9, a); P.ln(9, 2, 15, 5, b);
      P.r(2, 1, 3, 2, '#f8f8f8'); P.r(12, 13, 2, 2, '#e8e8e8');
      P.r(9, 7, 2, 1, '#202020');
    },
    'B': (P, v, u) => {
      bg(P, u, v);
      P.r(1, 0, 14, 16, '#8c94a0');
      P.r(1, 0, 14, 1, '#c0c8d0');
      for (const i of [1, 6, 11]) {
        P.r(2, i, 12, 4, '#b4bcc8'); P.r(2, i + 4, 12, 1, '#6c7480');
        P.r(6, i + 1, 4, 1, '#585e68'); P.r(3, i + 1, 2, 2, '#f8f8f0');
      }
    },
    'K': (P, v, u) => {
      bg(P, u, v);
      P.r(3, 0, 10, 16, '#383840'); P.r(3, 0, 10, 4, '#c83838'); P.r(3, 0, 10, 1, '#e86060');
      P.r(5, 5, 6, 3, '#88d8f8'); P.r(6, 6, 2, 1, '#f8f8f8');
      P.r(4, 9, 8, 6, '#18181c'); P.r(7, 9, 2, 2, '#808088');
      P.r(7, 12, 2, 3, '#f8f8f8'); P.r(7, 12, 2, 1, '#784020');
      P.p(11, 6, '#f8d030');
    },
    'v': (P, v, u) => {
      bg(P, u, v);
      P.r(1, 0, 14, 16, '#3060b0'); P.r(1, 0, 14, 1, '#6090e0');
      P.r(2, 2, 9, 11, '#c8e8f8');
      const sn = ['#e04848', '#f8c830', '#48b048', '#e88830', '#9858c8', '#e04848'];
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) P.r(3 + c * 3, 3 + r * 3 + 0, 2, 2, sn[(r + c) % 6]);
      P.r(12, 3, 2, 4, '#202020'); P.r(12, 8, 2, 2, '#f8d030');
      P.r(2, 13, 9, 2, '#202838');
    },
    'h': (P, v, u) => {
      bg(P, u, v);
      P.r(0, 2, 16, 5, '#2c6c54'); P.r(0, 7, 16, 7, '#3c8c6c'); P.r(0, 7, 16, 1, '#5cac8c');
      P.r(7, 7, 1, 7, '#2c6c54'); P.r(0, 14, 16, 1, '#1c4c3c');
    },
    'w': (P, v, u) => {
      bg(P, u, v);
      P.r(4, 8, 8, 8, '#e8e8e8'); P.r(4, 8, 8, 1, '#f8f8f8'); P.r(5, 14, 6, 1, '#b8b8b8');
      P.rr(5, 0, 6, 8, 2, '#88c8f8'); P.r(6, 1, 1, 5, '#c8e8ff');
      P.r(7, 10, 2, 2, '#3870c8');
    },
    'Q': (P, v, u, ph) => {
      P.r(0, 0, 16, 16, '#28282e'); P.r(1, 0, 14, 16, '#38383f'); P.r(1, 0, 14, 1, '#58585f');
      for (let y = 2; y < 15; y += 3) {
        P.r(2, y, 12, 2, '#202024');
        const on = ((y + v + ph) % 3) === 0;
        P.p(3, y, on ? '#58f858' : '#287828');
        P.p(5, y, ((y + ph) % 2) ? '#f8a030' : '#784818');
        P.r(8, y, 5, 1, '#48484f');
      }
    },
    'x': (P, v, u) => {
      bg(P, u, v);
      P.r(1, 4, 14, 10, '#e0e0d8'); P.r(1, 4, 14, 2, '#b8b8b0');
      P.r(4, 1, 8, 4, '#f8f8f8'); P.r(3, 9, 10, 1, '#404040'); P.r(4, 10, 8, 4, '#f8f8f8');
      P.p(12, 7, '#58f858'); P.r(1, 14, 14, 1, '#888880');
    }
  };
  function tile(key, v = 0, under = 'carpet') {
    const ph = key === 'Q' ? (frameCount >> 5) % 6 : 0;
    const k = key + ':' + v + ':' + under + ':' + ph;
    if (cache[k]) return cache[k];
    const c = mk(16, 16), P = painter(c.getContext('2d'), 16, 16);
    (TILES[key] || TILES['.'])(P, v, under, ph);
    return (cache[k] = c);
  }

  // ---------- Personaggi (16x21) ----------
  function character(pal, dir, fr = 0) {
    const k = 'ch:' + pal.id + dir + fr;
    if (cache[k]) return cache[k];
    if (dir === 'left') return (cache[k] = flipped(character(pal, 'right', fr)));
    const c = mk(16, 21), P = painter(c.getContext('2d'), 16, 21);
    const { skin = '#f8c8a0', hair = '#503020', shirt = '#f8f8f8', pants = '#384878', shoe = '#383838' } = pal;
    const dk = '#202028';
    const bob = fr ? 1 : 0;
    if (dir === 'down' || dir === 'up') {
      const l1 = fr === 1 ? -1 : 0, l2 = fr === 2 ? -1 : 0;
      P.r(5, 16, 3, 3 + l1, pants); P.r(8, 16, 3, 3 + l2, pants);
      P.r(5, 19 + l1, 3, 1, shoe); P.r(8, 19 + l2, 3, 1, shoe);
      P.r(4, 10 + bob, 8, 7 - bob, shirt);
      P.r(3, 11 + bob, 1, 4, shirt); P.r(12, 11 + bob, 1, 4, shirt);
      P.p(3, 15 + bob, skin); P.p(12, 15 + bob, skin);
      if (pal.tie && dir === 'down') { P.r(7, 10 + bob, 2, 1, pal.tie); P.r(7, 11 + bob, 2, 4, pal.tie); }
      if (pal.jacket) { P.r(4, 10 + bob, 2, 7 - bob, pal.jacket); P.r(10, 10 + bob, 2, 7 - bob, pal.jacket); P.r(3, 11 + bob, 1, 4, pal.jacket); P.r(12, 11 + bob, 1, 4, pal.jacket); }
      const hy = bob;
      P.r(4, 2 + hy, 8, 8, skin);
      if (dir === 'down') {
        P.r(4, 1 + hy, 8, 3, hair); P.r(5, 0 + hy, 6, 1, hair);
        P.r(3, 2 + hy, 1, 5, hair); P.r(12, 2 + hy, 1, 5, hair);
        if (pal.long) { P.r(3, 7 + hy, 1, 5, hair); P.r(12, 7 + hy, 1, 5, hair); }
        if (pal.spiky) { P.p(4, 0 + hy, hair); P.p(11, 0 + hy, hair); P.p(7, -1 + hy + 1, hair); }
        P.r(6, 6 + hy, 1, 2, dk); P.r(9, 6 + hy, 1, 2, dk);
        if (pal.glasses) { P.r(5, 5 + hy, 3, 1, dk); P.r(8, 5 + hy, 3, 1, dk); }
        P.p(4, 8 + hy, '#f0a090'); P.p(11, 8 + hy, '#f0a090');
      } else {
        P.r(3, 1 + hy, 10, 8, hair); P.r(5, 0 + hy, 6, 1, hair);
        if (pal.long) P.r(3, 9 + hy, 10, 3, hair);
      }
    } else {
      const f1 = fr === 1 ? 1 : fr === 2 ? -1 : 0;
      P.r(6 + f1, 16, 3, 3, pants); P.r(7 - f1, 16, 3, 3, pants);
      P.r(6 + f1, 19, 4, 1, shoe); P.r(7 - f1, 19, 3, 1, shoe);
      P.r(5, 10 + bob, 6, 7 - bob, shirt);
      if (pal.jacket) P.r(5, 10 + bob, 6, 7 - bob, pal.jacket);
      P.r(7 - f1, 11 + bob, 2, 4, pal.jacket || shirt); P.r(7 - f1, 15 + bob, 2, 1, skin);
      const hy = bob;
      P.r(4, 2 + hy, 8, 8, skin);
      P.r(4, 1 + hy, 8, 3, hair); P.r(5, 0 + hy, 6, 1, hair); P.r(3, 2 + hy, 4, 6, hair);
      if (pal.long) P.r(3, 8 + hy, 3, 4, hair);
      if (pal.spiky) P.p(3, 1 + hy, hair);
      P.r(10, 6 + hy, 1, 2, dk);
      if (pal.glasses) P.r(9, 5 + hy, 3, 1, dk);
      P.p(12, 7 + hy, skin);
    }
    outline(c);
    return (cache[k] = c);
  }

  // ---------- Officemon (48x48) ----------
  const ART = {
    foglietto(P) {
      P.r(12, 6, 24, 34, '#f8f8f0');
      P.r(32, 6, 4, 34, '#dcdcd0');
      P.clear(29, 6, 7, 1); P.clear(30, 7, 6, 1); P.clear(31, 8, 5, 1); P.clear(32, 9, 4, 1); P.clear(33, 10, 3, 1); P.clear(34, 11, 2, 1); P.clear(35, 12, 1, 1);
      for (let i = 0; i < 7; i++) P.r(29, 6 + i, 1 + i, 1, '#c8c8bc');
      P.r(15, 12, 12, 1, '#a0a8c8'); P.r(15, 15, 14, 1, '#a0a8c8'); P.r(15, 33, 16, 1, '#a0a8c8'); P.r(15, 36, 10, 1, '#a0a8c8');
      P.eye(17, 20, 5); P.eye(27, 20, 5);
      P.blush(15, 27); P.blush(29, 27);
      P.r(21, 28, 5, 1, '#202028'); P.p(20, 27, '#202028'); P.p(26, 27, '#202028');
      P.r(7, 24, 5, 2, '#f8f8f0'); P.r(36, 24, 5, 2, '#f8f8f0');
      P.r(16, 40, 5, 4, '#f8f8f0'); P.r(27, 40, 5, 4, '#f8f8f0');
      P.r(17, 7, 2, 4, '#c0c0c8'); P.r(16, 7, 4, 1, '#c0c0c8');
    },
    tazzino(P) {
      P.ln(18, 13, 16, 9, '#d8d8e8', 2); P.ln(16, 9, 18, 5, '#d8d8e8', 2);
      P.ln(27, 13, 25, 9, '#d8d8e8', 2); P.ln(25, 9, 27, 4, '#d8d8e8', 2);
      P.e(24, 43, 20, 4, '#e8e8f0');
      P.ring(37, 28, 7, 7, 3, '#f0f0f8');
      P.rr(9, 16, 28, 26, 7, '#f8f8f8');
      P.r(9, 16, 28, 8, '#f8f8f8');
      P.r(31, 18, 5, 20, '#e0e0e8');
      P.e(23, 17, 14, 3, '#6a3a1a'); P.e(21, 16, 6, 1, '#8a5a3a');
      P.r(9, 33, 28, 3, '#c83838');
      P.eye(15, 23, 5); P.eye(26, 23, 5);
      P.blush(13, 30); P.blush(29, 30);
      P.r(19, 29, 6, 2, '#202028'); P.r(20, 31, 4, 1, '#e05050');
    },
    mousino(P) {
      P.ln(24, 44, 32, 45, '#404048', 2); P.ln(32, 45, 40, 42, '#404048', 2); P.ln(40, 42, 44, 36, '#404048', 2);
      P.e(24, 27, 14, 17, '#c8c8d4');
      P.e(20, 24, 8, 12, '#dcdce8');
      P.r(24, 10, 1, 14, '#808090');
      P.r(23, 14, 3, 6, '#e04848'); P.r(23, 14, 1, 2, '#f8a0a0');
      P.r(12, 24, 25, 1, '#9898a8');
      P.eye(17, 28, 5, 1); P.eye(28, 28, 5, 1);
      P.blush(14, 35); P.blush(31, 35);
      P.r(22, 36, 5, 1, '#202028');
    },
    graffetta(P) {
      const o1 = rrTest(14, 4, 20, 40, 9), o2 = rrTest(17, 7, 14, 34, 6);
      const i1 = rrTest(19, 12, 12, 26, 5), i2 = rrTest(22, 15, 6, 20, 2);
      P.f((x, y) => o1(x, y) && !o2(x, y), '#a8b0bc');
      P.f((x, y) => o1(x, y) && !o2(x, y) && x < 17, '#d8e0ec');
      P.f((x, y) => i1(x, y) && !i2(x, y), '#c8d0dc');
      P.e(24, 25, 9, 7, '#e8eef4');
      P.eye(19, 22, 4); P.eye(26, 22, 4);
      P.r(22, 28, 4, 1, '#202028');
      P.p(17, 20, '#202028'); P.p(18, 19, '#202028'); P.p(30, 20, '#202028'); P.p(29, 19, '#202028');
    },
    postit(P) {
      P.f((x, y) => x >= 9 && x < 39 && y >= 8 && y < 38 && (x - 32) + (y - 31) <= 6, '#f8e060');
      P.r(9, 8, 30, 3, '#e8c840');
      P.f((x, y) => x >= 32 && y >= 31 && x < 39 && y < 38 && (x - 32) + (y - 31) >= 3 && (x - 32) + (y - 31) <= 6, '#d8b030');
      P.r(13, 30, 14, 1, '#3870d0'); P.r(13, 33, 10, 1, '#3870d0');
      P.eye(15, 18, 5); P.eye(28, 18, 5);
      P.ln(13, 14, 19, 16, '#202028'); P.ln(34, 14, 28, 16, '#202028');
      P.r(20, 26, 8, 1, '#202028'); P.p(19, 27, '#202028'); P.p(28, 27, '#202028');
      P.r(14, 38, 4, 5, '#e8c840'); P.r(29, 38, 4, 5, '#e8c840');
    },
    moka(P) {
      P.r(20, 4, 8, 3, '#303038'); P.r(23, 2, 2, 2, '#303038');
      P.f((x, y) => y >= 7 && y < 22 && x >= 14 + (21 - y) / 3 - 4 && x < 34 - (21 - y) / 3 + 4, '#b8b8c4');
      P.r(15, 21, 18, 3, '#808090');
      P.f((x, y) => y >= 24 && y < 42 && x >= 12 + (y - 24) / 6 - 2 + 2 && x < 36 - (y - 24) / 6 + 2 - 2, '#c8c8d4');
      P.r(14, 24, 4, 18, '#e0e0ec');
      P.ln(10, 10, 14, 14, '#b8b8c4', 2);
      P.r(34, 9, 6, 3, '#303038'); P.r(38, 9, 3, 16, '#303038'); P.r(34, 22, 6, 3, '#303038');
      P.eye(18, 29, 4); P.eye(27, 29, 4);
      P.r(21, 36, 6, 1, '#202028');
      P.r(13, 42, 22, 2, '#909098');
    },
    cavetto(P) {
      const pts = [[6, 42], [10, 44], [16, 43], [20, 38], [20, 32], [16, 28], [14, 22], [18, 18], [24, 18]];
      for (let i = 0; i < pts.length - 1; i++) {
        const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
        for (let t = 0; t <= 1; t += 0.1) P.e(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, 3.2, 3.2, '#3870d0');
      }
      for (let i = 0; i < pts.length - 1; i++) {
        const [x0, y0] = pts[i];
        P.p(x0 - 1, y0 - 1, '#78a8f0');
      }
      P.rr(22, 8, 18, 18, 3, '#d8e0e8');
      P.r(25, 4, 3, 5, '#e0b030'); P.r(34, 4, 3, 5, '#e0b030');
      P.r(22, 22, 18, 4, '#a8b0c0');
      P.eye(26, 13, 4); P.eye(33, 13, 4);
      P.r(28, 19, 6, 1, '#202028'); P.p(31, 20, '#f06060');
    },
    stampacchio(P) {
      P.r(13, 4, 22, 12, '#f8f8f8'); P.r(15, 7, 14, 1, '#a0a8c8'); P.r(15, 10, 10, 1, '#a0a8c8');
      P.rr(5, 14, 38, 24, 3, '#e0e0d8');
      P.r(5, 14, 38, 4, '#b8b8b0');
      P.r(36, 21, 5, 6, '#909088'); P.p(37, 22, '#58f858'); P.p(39, 22, '#f84848'); P.r(37, 24, 3, 1, '#606060');
      P.eye(12, 21, 5); P.eye(24, 21, 5);
      P.r(9, 30, 30, 2, '#303030');
      P.r(14, 31, 18, 10, '#f8f8f8'); P.r(17, 34, 10, 1, '#a0a8c8'); P.r(17, 37, 7, 1, '#a0a8c8');
      P.r(7, 38, 6, 4, '#909088'); P.r(35, 38, 6, 4, '#909088');
    },
    faldone(P) {
      P.r(11, 3, 26, 40, '#3858a8'); P.r(11, 3, 5, 40, '#284890'); P.r(35, 3, 2, 40, '#284890');
      P.r(18, 7, 14, 12, '#f8f8f0'); P.r(20, 10, 10, 1, '#606878'); P.r(20, 13, 8, 1, '#606878'); P.r(20, 16, 9, 1, '#606878');
      P.e(25, 36, 3, 3, '#f8f8f0'); P.e(25, 36, 1.5, 1.5, '#203060');
      P.eye(19, 23, 5); P.eye(28, 23, 5);
      P.ln(17, 21, 22, 22, '#101830'); P.ln(32, 21, 27, 22, '#101830');
      P.r(22, 30, 6, 1, '#101830');
      P.r(6, 24, 5, 3, '#3858a8'); P.r(37, 24, 5, 3, '#3858a8');
      P.r(14, 43, 6, 3, '#284890'); P.r(28, 43, 6, 3, '#284890');
    },
    pinzatrice(P) {
      P.rr(4, 34, 40, 7, 2, '#383840'); P.r(6, 34, 36, 1, '#585860');
      P.f((x, y) => x >= 6 && x < 44 && y >= 22 - Math.floor((x - 6) / 8) && y < 32 - Math.floor((x - 6) / 12), '#d03838');
      P.f((x, y) => x >= 6 && x < 44 && y >= 22 - Math.floor((x - 6) / 8) && y < 24 - Math.floor((x - 6) / 8), '#f06868');
      for (let x = 30; x < 43; x += 3) { P.r(x, 30 - Math.floor((x - 6) / 12), 2, 2, '#f8f8f8'); P.r(x, 33, 2, 1, '#f8f8f8'); }
      P.e(30, 21, 4, 4, '#f8f8f8'); P.r(30, 20, 2, 3, '#202028');
      P.ln(26, 16, 34, 18, '#202028');
      P.r(6, 26, 4, 8, '#383840');
      P.r(8, 41, 5, 4, '#383840'); P.r(34, 41, 5, 4, '#383840');
    },
    espressone(P) {
      P.rr(6, 6, 36, 34, 3, '#c8c8d0'); P.r(6, 6, 36, 4, '#e8e8f0'); P.r(36, 10, 6, 30, '#a8a8b0');
      P.e(16, 17, 6, 6, '#f8f8f8'); P.ring(16, 17, 6, 6, 1, '#606068'); P.r(15, 15, 3, 4, '#202028');
      P.e(31, 17, 6, 6, '#f8f8f8'); P.ring(31, 17, 6, 6, 1, '#606068'); P.r(30, 15, 3, 4, '#202028');
      P.ln(10, 9, 20, 12, '#202028'); P.ln(37, 9, 27, 12, '#202028');
      P.r(14, 25, 20, 4, '#303038'); P.r(20, 29, 8, 3, '#303038');
      P.r(19, 34, 10, 6, '#f8f8f8'); P.r(19, 34, 10, 1, '#784020'); P.r(29, 35, 2, 3, '#f8f8f8');
      P.r(6, 40, 36, 4, '#404048');
      P.ln(4, 24, 4, 34, '#909098', 2);
      P.r(34, 30, 4, 2, '#e04848'); P.r(34, 33, 4, 2, '#48c048');
    },
    poltronissima(P) {
      P.rr(10, 2, 28, 30, 6, '#6a3220');
      for (let y = 8; y < 28; y += 6) for (let x = 15; x < 36; x += 6) { P.p(x, y, '#3a1a10'); P.p(x + 3, y + 3, '#3a1a10'); }
      P.r(12, 4, 3, 24, '#8a4a30');
      P.rr(3, 18, 9, 16, 3, '#5a2a18'); P.rr(36, 18, 9, 16, 3, '#5a2a18');
      P.rr(8, 28, 32, 9, 3, '#7a3a24'); P.r(10, 29, 28, 1, '#9a5a3a');
      P.r(22, 37, 4, 6, '#303038');
      P.r(10, 42, 28, 2, '#303038'); P.r(9, 44, 3, 2, '#202024'); P.r(36, 44, 3, 2, '#202024'); P.r(22, 44, 4, 2, '#202024');
      P.e(19, 14, 4, 3, '#f8e070'); P.e(29, 14, 4, 3, '#f8e070');
      P.r(18, 13, 2, 3, '#202028'); P.r(28, 13, 2, 3, '#202028');
      P.ln(14, 9, 22, 12, '#f8e070'); P.ln(34, 9, 26, 12, '#f8e070');
      P.r(20, 21, 8, 1, '#f8e070');
    }
  };
  function mon(sp, flip = false) {
    const k = 'mon:' + sp + flip;
    if (cache[k]) return cache[k];
    if (flip) return (cache[k] = flipped(mon(sp)));
    const c = mk(48, 48), g = c.getContext('2d'), P = painter(g, 48, 48);
    (ART[sp] || ART.foglietto)(P);
    outline(c);
    return (cache[k] = c);
  }
  function monIcon(sp) {
    const k = 'icon:' + sp;
    if (cache[k]) return cache[k];
    const c = mk(24, 24), g = c.getContext('2d');
    g.imageSmoothingEnabled = true;
    g.imageSmoothingQuality = 'high';
    g.drawImage(mon(sp), 0, 0, 24, 24);
    return (cache[k] = c);
  }

  // ---------- Oggetti ----------
  const OBJ = {
    folder(P, col) {
      P.r(2, 6, 12, 8, col); P.r(2, 5, 5, 1, col); P.r(2, 6, 12, 1, '#ffffff55');
      P.r(4, 4, 8, 3, '#f8f8f0'); P.r(5, 5, 5, 1, '#a0a8c8');
    },
    item(P) {
      P.r(4, 4, 8, 10, '#f8f8f0'); P.r(5, 6, 6, 1, '#a0a8c8'); P.r(5, 8, 5, 1, '#a0a8c8');
      P.e(10, 12, 3, 3, '#d03030'); P.p(9, 11, '#f88080');
    },
    contract(P) {
      P.r(3, 2, 10, 12, '#f8f8f0'); P.r(4, 4, 7, 1, '#a0a8c8'); P.r(4, 6, 6, 1, '#a0a8c8'); P.r(4, 8, 7, 1, '#a0a8c8');
      P.e(10, 12, 3, 3, '#d03030'); P.p(9, 11, '#f88080');
    },
    bubble(P) {
      P.rr(2, 0, 12, 13, 3, '#f8f8f8'); P.r(7, 13, 3, 2, '#f8f8f8');
      P.r(7, 2, 2, 6, '#e03030'); P.r(7, 10, 2, 2, '#e03030');
    }
  };
  function obj(kind, col = '#e05050') {
    const k = 'obj:' + kind + col;
    if (cache[k]) return cache[k];
    const c = mk(16, 16), P = painter(c.getContext('2d'), 16, 16);
    OBJ[kind](P, col);
    outline(c);
    return (cache[k] = c);
  }

  return { tile, character, mon, monIcon, obj, flipped };
})();
