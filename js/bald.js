'use strict';
// Il Dott. Baldinazzo: compare in giro per l'azienda facendo cose fighe, dà consigli e scappa in riunione.
const Bald = (() => {
  const NO_BALD = ['cunicolo', 'studio'];
  const SKIN = '#f0c8a8';
  const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
  const circle = (x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); };
  const ring = (x, y, r, c, w = 1) => { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke(); };
  const line = (x0, y0, x1, y1, c, w = 1) => { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); };
  const note = (x, y, c = '#f8f8f8') => { R(x + 2, y, 1, 5, '#202028'); R(x, y + 4, 3, 2, '#202028'); R(x + 2, y, 3, 1, '#202028'); R(x + 2, y - 0.5, 1, 4, c); };
  const F = () => frameCount;
  function me(n, x, y, o = {}) {
    const img = Sprites.character(n.pal, o.dir || n.dir, o.fr || 0);
    ctx.drawImage(img, Math.round(x + (o.dx || 0)), Math.round(y - 5 + (o.dy || 0)));
  }
  function meRot(n, cx, cy, a) {
    ctx.save(); ctx.translate(Math.round(cx), Math.round(cy)); ctx.rotate(a);
    ctx.drawImage(Sprites.character(n.pal, 'down', 0), -8, -10); ctx.restore();
  }
  function colleague(pal, x, y, dir, dy = 0) { ctx.drawImage(Sprites.character(pal, dir, 0), Math.round(x), Math.round(y - 5 + dy)); }
  const bob = (s = 10, a = 1) => Math.round(Math.sin(F() / s) * a);

  // Ogni scena: caselle occupate dagli oggetti (relative alla posizione) e disegno animato.
  const VIS = {
    amaca: { props: [[-1, 0], [1, 0]], draw(n, x, y) {
      R(x - 12, y - 8, 2, 22, '#7c5428'); R(x + 26, y - 8, 2, 22, '#7c5428');
      const sw = Math.sin(F() / 40) * 1.5;
      for (let i = 0; i <= 36; i++) { const s = Math.sin(i / 36 * Math.PI) * 6 + sw * Math.sin(i / 36 * Math.PI); R(x - 11 + i, y - 4 + s, 1, 1, '#a07840'); R(x - 11 + i, y + 1 + s, 1, 2, '#e8c890'); }
      if (n.awake) me(n, x, y); else meRot(n, x + 8, y + 3 + sw, -Math.PI / 2);
      if (!n.awake) { const k = (F() >> 4) % 3; txt('z', x + 14 + k * 3, y - 10 - k * 4, { size: 5, color: '#f8f8f8', shadow: '#404060' }); }
    } },
    libro: { props: [], draw(n, x, y) {
      me(n, x, y);
      const flip = (F() % 120) < 8;
      R(x + 3, y + 6, 10, 7, '#202028'); R(x + 4, y + 7, 8, 5, '#c03838');
      R(x + 4, y + 7, 4, 5, '#f8f8f0'); R(x + (flip ? 6 : 8), y + 7, 4, 5, '#f0f0e0');
    } },
    tiro: { props: [[1, 0], [2, 0]], draw(n, x, y) {
      me(n, x, y, { dir: 'right' });
      R(x + 10, y + 7, 10, 2, '#303038'); R(x + 9, y + 8, 3, 3, '#7c5428');
      const tx = x + 40, ty = y + 2;
      R(tx - 1, ty + 6, 2, 10, '#7c5428');
      circle(tx, ty, 7, '#202028'); circle(tx, ty, 6, '#f8f8f8'); circle(tx, ty, 4, '#e03030'); circle(tx, ty, 2.5, '#f8f8f8'); circle(tx, ty, 1.2, '#e03030');
      const s = F() % 60;
      if (s < 4) { circle(x + 21, y + 8, 2.5, '#f8e070'); line(x + 22, y + 8, tx, ty, 'rgba(255,240,180,.8)'); }
      for (let i = 0; i < Math.min(5, Math.floor(F() / 60) % 6); i++) R(tx - 2 + (i * 3) % 5, ty - 2 + (i * 2) % 4, 1, 1, '#202028');
    } },
    bolle: { props: [], draw(n, x, y) {
      me(n, x, y);
      R(x + 12, y + 4, 1, 7, '#e04848'); ring(x + 12.5, y + 2, 2, '#e04848');
      for (let i = 0; i < 7; i++) {
        const ph = (F() + i * 19) % 130, bx = x + 14 + Math.sin((ph + i * 9) / 11) * 6 + ph * 0.12, by = y + 1 - ph * 0.42;
        const r = 2 + (i % 3) * 0.8;
        ring(bx, by, r, 'rgba(200,235,255,.9)', 0.7); R(bx - r / 2, by - r / 2, 1, 1, '#ffffff');
      }
    } },
    palco: { props: [[-1, 0], [1, 0], [0, 1], [-1, 2], [0, 2], [1, 2]], draw(n, x, y) {
      R(x - 16, y + 9, 48, 10, '#6c4424'); R(x - 16, y + 9, 48, 2, '#b07840');
      me(n, x, y, { dy: -2, dir: 'down', fr: (F() >> 5) % 3 === 2 ? 1 : 0 });
      R(x + 3, y + 15, 10, 9, '#4a2c14'); R(x + 3, y + 15, 10, 2, '#7c5428'); R(x + 7, y + 8, 1, 7, '#303038'); R(x + 6, y + 7, 3, 2, '#808088');
      const pals = [PAL.dev1, PAL.po, PAL.bi];
      for (let i = 0; i < 3; i++) colleague(pals[i], x - 16 + i * 16, y + 32, 'up', (F() >> 3) % 4 === i ? -2 : 0);
      if ((F() >> 4) % 4 === 0) for (let i = 0; i < 3; i++) { R(x - 12 + i * 16, y + 20, 1, 3, '#f8f8f8'); R(x - 6 + i * 16, y + 20, 1, 3, '#f8f8f8'); }
      ring(x + 8, y + 6, 4 + (F() >> 3) % 4, 'rgba(255,255,255,.5)', 0.6);
    } },
    ballo: { props: [], draw(n, x, y) {
      const dirs = ['down', 'left', 'down', 'right'];
      const d = dirs[(F() >> 4) % 4], dy = -Math.abs(Math.sin(F() / 8)) * 3;
      me(n, x, y, { dir: d, dy, fr: (F() >> 3) % 3 });
      R(x + 3, y - 5 + dy, 10, 1, '#202020'); R(x + 3, y - 4 + dy, 2, 4, '#202020'); R(x + 11, y - 4 + dy, 2, 4, '#202020');
      line(x + 12, y + dy, x + 12, y + 9 + dy, '#202020', 0.6);
      note(x + 16, y - 8 - (F() >> 2) % 10, '#f8d050'); note(x - 6, y - 4 - ((F() >> 2) + 5) % 10, '#88d0f8');
    } },
    chimica: { props: [[1, 0]], draw(n, x, y) {
      me(n, x, y, { dir: 'right' });
      R(x + 17, y + 4, 15, 3, '#d8d8e0'); R(x + 18, y + 7, 2, 9, '#808088'); R(x + 29, y + 7, 2, 9, '#808088');
      const g = 0.5 + Math.sin(F() / 8) * 0.3;
      circle(x + 21, y + 1, 5, `rgba(80,255,120,${g * 0.35})`); circle(x + 28, y, 5, `rgba(255,80,220,${g * 0.35})`);
      R(x + 19, y - 4, 4, 8, '#e8f8ff'); R(x + 19, y, 4, 4, '#50ff78');
      R(x + 26, y - 6, 4, 10, '#e8f8ff'); R(x + 26, y - 1, 4, 5, '#ff50dc');
      R(x + 23, y + 1, 3, 3, '#58c8ff');
      const e = F() % 150;
      if (e < 24) { const r = e / 2; circle(x + 25, y - 6, r, `rgba(255,${200 - e * 4},60,${1 - e / 24})`); circle(x + 25, y - 6, r * 0.6, `rgba(120,255,120,${1 - e / 24})`); }
      else if (e < 60) circle(x + 25, y - 10 - (e - 24) / 3, 3, `rgba(200,200,210,${0.6 - (e - 24) / 60})`);
    } },
    pingpong: { slot: true, draw(n, x, y) {
      me(n, x, y, { dir: 'left', dy: (F() >> 3) % 2 ? -1 : 0 });
      const sw = Math.round(Math.sin(F() / 5) * 2);
      R(x - 2, y + 7 + sw, 4, 4, '#d03838'); R(x - 1, y + 11 + sw, 2, 2, '#7c5428');
    } },
    calcetto: { slot: true, draw(n, x, y) {
      me(n, x, y, { dir: 'up', dy: (F() >> 2) % 2 ? -1 : 0 });
    } },
    chitarra: { props: [], draw(n, x, y) {
      me(n, x, y);
      R(x + 1, y + 6, 10, 1, '#5c3c20'); circle(x + 11, y + 10, 4, '#202028'); circle(x + 11, y + 10, 3.2, '#c87830'); circle(x + 11, y + 10, 1, '#202028');
      if ((F() >> 3) % 2) R(x + 10, y + 7, 1, 2, SKIN);
      note(x + 17, y - 6 - (F() >> 2) % 12, '#f8d050');
    } },
    giocoleria: { props: [], draw(n, x, y) {
      me(n, x, y);
      const cols = ['#e04848', '#48a8e8', '#f8d030'];
      for (let i = 0; i < 3; i++) {
        const ph = ((F() / 40) + i / 3) % 1;
        const bx = x + 8 + Math.cos(ph * Math.PI * 2) * 8, by = y - 4 - Math.abs(Math.sin(ph * Math.PI * 2)) * 12;
        circle(bx, by, 2, '#202028'); circle(bx, by, 1.4, cols[i]);
      }
    } },
    yoga: { props: [], draw(n, x, y) {
      R(x - 3, y + 13, 22, 4, '#a050c0'); R(x - 3, y + 13, 22, 1, '#c070e0');
      me(n, x, y, { dir: 'down', dy: -1 });
      R(x + 6, y - 9, 4, 3, SKIN); R(x + 7, y - 6, 2, 2, n.suit);
      if ((F() >> 6) % 2) txt('om', x + 16, y - 10, { size: 4, color: '#f8f8f8', shadow: '#5050a0' });
    } },
    skate: { props: [[-1, 0], [1, 0]], draw(n, x, y) {
      const off = Math.sin(F() / 30) * 14, d = Math.cos(F() / 30) > 0 ? 'right' : 'left';
      me(n, x + off, y, { dir: d, dy: -2 });
      R(x + 2 + off, y + 13, 13, 2, '#e04848'); R(x + 3 + off, y + 15, 2, 2, '#202028'); R(x + 12 + off, y + 15, 2, 2, '#202028');
    } },
    telescopio: { props: [[1, 0]], draw(n, x, y) {
      me(n, x, y, { dir: 'right' });
      line(x + 22, y + 4, x + 18, y + 16, '#404048'); line(x + 22, y + 4, x + 27, y + 16, '#404048'); line(x + 22, y + 4, x + 23, y + 16, '#404048');
      line(x + 15, y + 6, x + 30, y - 4, '#202028', 4); line(x + 15, y + 6, x + 30, y - 4, '#e8e8f0', 2.5);
      for (let i = 0; i < 3; i++) if (((F() >> 4) + i) % 3 === 0) { const sx = x + 26 + i * 6, sy = y - 16 + i * 3; R(sx, sy - 1, 1, 3, '#f8f8a0'); R(sx - 1, sy, 3, 1, '#f8f8a0'); }
    } },
    pittura: { props: [[1, 0]], draw(n, x, y) {
      me(n, x, y, { dir: 'right' });
      line(x + 20, y - 6, x + 18, y + 16, '#7c5428', 1.5); line(x + 28, y - 6, x + 30, y + 16, '#7c5428', 1.5);
      R(x + 17, y - 8, 14, 15, '#202028'); R(x + 18, y - 7, 12, 13, '#f8f8f0');
      const k = (F() >> 5) % 8, cols = ['#e04848', '#48a8e8', '#f8d030', '#58c058', '#b058d8', '#f08830', '#48d8c8', '#f070a0'];
      for (let i = 0; i <= k; i++) R(x + 19 + (i * 5) % 9, y - 6 + (i * 3) % 10, 3, 2, cols[i]);
      R(x + 12, y + 7 + bob(6, 1), 5, 1, '#7c5428'); R(x + 16, y + 7 + bob(6, 1), 1, 1, cols[k]);
    } },
    barbecue: { props: [[1, 0]], draw(n, x, y) {
      me(n, x, y, { dir: 'right' });
      R(x + 17, y + 5, 14, 6, '#202024'); R(x + 18, y + 6, 12, 2, (F() >> 3) % 2 ? '#f86020' : '#f8a030');
      R(x + 19, y + 11, 1, 5, '#404048'); R(x + 28, y + 11, 1, 5, '#404048');
      R(x + 19, y + 4, 4, 2, '#c86838'); R(x + 24, y + 4, 4, 2, '#a85828');
      for (let i = 0; i < 3; i++) { const ph = (F() + i * 25) % 75; circle(x + 22 + Math.sin(ph / 8) * 3, y + 2 - ph * 0.3, 2 + ph / 40, `rgba(200,200,200,${0.6 - ph / 130})`); }
      R(x + 12, y + 8, 6, 1, '#808088');
    } },
    pesca: { props: [[0, 1]], draw(n, x, y) {
      me(n, x, y, { dir: 'down' });
      R(x + 2, y + 18, 12, 10, '#202028'); R(x + 3, y + 19, 10, 9, '#8890a0'); R(x + 3, y + 19, 10, 3, '#3c88d0');
      line(x + 12, y + 8, x + 20, y - 4, '#7c5428', 1); line(x + 20, y - 4, x + 9, y + 20, 'rgba(240,240,240,.8)', 0.5);
      R(x + 8, y + 19 + bob(7, 1), 2, 2, '#e04848');
    } },
    meditazione: { props: [], draw(n, x, y) {
      const fl = -7 + Math.sin(F() / 20) * 2;
      ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(x + 8, y + 15, 7, 2, 0, 0, Math.PI * 2); ctx.fill();
      circle(x + 8, y + 4 + fl, 12, `rgba(255,240,160,${0.15 + Math.sin(F() / 15) * 0.08})`);
      me(n, x, y, { dir: 'down', dy: fl });
    } },
    drone: { props: [], draw(n, x, y) {
      me(n, x, y);
      R(x + 5, y + 7, 5, 3, '#303038'); R(x + 6, y + 6, 1, 1, '#e04848');
      const dx = x + 8 + Math.cos(F() / 25) * 14, dy = y - 14 + Math.sin(F() / 12) * 3;
      R(dx - 3, dy - 1, 6, 3, '#404048'); R(dx - 6, dy - 2, 3, 1, (F() >> 1) % 2 ? '#c0c0c8' : '#606068'); R(dx + 3, dy - 2, 3, 1, (F() >> 1) % 2 ? '#606068' : '#c0c0c8');
      R(dx, dy + 2, 1, 1, '#58f858');
    } },
    magia: { props: [[1, 0]], draw(n, x, y) {
      me(n, x, y, { dir: 'right' });
      R(x + 18, y + 8, 12, 2, '#7c5428'); R(x + 23, y + 10, 2, 6, '#7c5428');
      R(x + 19, y + 2, 10, 6, '#181818'); R(x + 17, y + 7, 14, 2, '#181818'); R(x + 19, y + 5, 10, 1, '#c03030');
      const up = (F() % 120) > 60;
      if (up) { R(x + 21, y - 4, 2, 6, '#f8f8f8'); R(x + 25, y - 4, 2, 6, '#f8f8f8'); R(x + 21, y - 3, 1, 3, '#f0a0b0'); R(x + 25, y - 3, 1, 3, '#f0a0b0'); }
      R(x + 12, y + 5, 6, 1, '#181818'); R(x + 17, y + 5, 1, 1, '#f8f8f8');
      if ((F() >> 3) % 2) { R(x + 18, y + 1, 1, 3, '#f8e070'); R(x + 17, y + 2, 3, 1, '#f8e070'); }
    } },
    dj: { props: [[0, 1]], draw(n, x, y) {
      me(n, x, y, { dir: 'down', dy: (F() >> 3) % 2 ? -1 : 0 });
      R(x - 5, y + 13, 26, 11, '#202028'); R(x - 4, y + 14, 24, 9, '#383840');
      ring(x + 2, y + 18, 3, '#808088'); ring(x + 14, y + 18, 3, '#808088');
      line(x + 2, y + 18, x + 2 + Math.cos(F() / 4) * 3, y + 18 + Math.sin(F() / 4) * 3, '#f8f8f8', 0.6);
      const cols = ['#f04848', '#48f048', '#4888f8', '#f8e048'];
      for (let i = 0; i < 4; i++) R(x - 3 + i * 6, y + 12, 3, 1, cols[((F() >> 3) + i) % 4]);
      note(x + 20, y - 6 - (F() >> 2) % 10, '#f070c0');
    } },
    pesi: { props: [], draw(n, x, y) {
      const lift = (Math.sin(F() / 15) + 1) * 4;
      me(n, x, y, { dir: 'down' });
      R(x - 3, y - 5 + lift, 22, 2, '#606068'); R(x - 5, y - 8 + lift, 3, 8, '#202024'); R(x + 18, y - 8 + lift, 3, 8, '#202024');
      R(x + 3, y - 4 + lift, 2, 2, SKIN); R(x + 11, y - 4 + lift, 2, 2, SKIN);
    } },
    cubo: { props: [], draw(n, x, y) {
      me(n, x, y);
      const cols = ['#f8f8f8', '#f8d030', '#e04848', '#3870d0', '#48b048', '#f08830'];
      R(x + 4, y + 6, 8, 8, '#202028');
      for (let i = 0; i < 9; i++) R(x + 5 + (i % 3) * 2, y + 7 + Math.floor(i / 3) * 2, 2, 2, cols[(i + (F() >> 5)) % 6]);
    } },
    aerei: { props: [], draw(n, x, y) {
      me(n, x, y);
      for (let i = 0; i < 2; i++) {
        const t = F() / 50 + i * Math.PI;
        const px = x + 8 + Math.cos(t) * 18, py = y - 8 + Math.sin(t * 2) * 6, dir = -Math.sin(t) > 0 ? 1 : -1;
        ctx.fillStyle = '#f8f8f8'; ctx.beginPath(); ctx.moveTo(px + 4 * dir, py); ctx.lineTo(px - 4 * dir, py - 2); ctx.lineTo(px - 2 * dir, py); ctx.lineTo(px - 4 * dir, py + 2); ctx.fill();
      }
    } },
    robot: { props: [[1, 0]], draw(n, x, y) {
      me(n, x, y, { dir: 'right' });
      const b = (F() >> 3) % 2;
      R(x + 19, y + 3 - b, 10, 9, '#202028'); R(x + 20, y + 4 - b, 8, 7, '#a8b0c0');
      R(x + 20, y - 3 - b, 8, 6, '#202028'); R(x + 21, y - 2 - b, 6, 4, '#c8d0e0');
      R(x + 22, y - 1 - b, 1, 1, (F() >> 5) % 4 ? '#3888f0' : '#c8d0e0'); R(x + 25, y - 1 - b, 1, 1, '#3888f0');
      R(x + 24, y - 6 - b, 1, 3, '#606068'); R(x + 23, y - 7 - b, 3, 1, (F() >> 4) % 2 ? '#f84848' : '#801818');
      R(x + 21, y + 12, 2, 4, '#606068'); R(x + 25, y + 12, 2, 4, '#606068');
    } },
    vr: { props: [], draw(n, x, y) {
      me(n, x, y, { dir: 'down' });
      R(x + 4, y + 1, 8, 4, '#202028'); R(x + 5, y + 2, 6, 1, (F() >> 4) % 2 ? '#48c8f8' : '#a058f8');
      const w = Math.sin(F() / 6) * 3;
      R(x + 1 + w, y + 3, 2, 2, SKIN); R(x + 13 - w, y + 2, 2, 2, SKIN);
    } },
    sax: { props: [], draw(n, x, y) {
      me(n, x, y);
      R(x + 9, y + 3, 2, 9, '#e0b030'); R(x + 9, y + 12, 5, 2, '#e0b030'); R(x + 12, y + 9, 3, 4, '#f0c840'); R(x + 8, y + 3, 2, 1, '#202028');
      note(x + 17, y - 4 - (F() >> 2) % 12, '#f8d050'); note(x + 21, y - 10 - ((F() >> 2) + 6) % 12, '#88d0f8');
    } },
    domino: { props: [[1, 0], [2, 0], [3, 0]], draw(n, x, y) {
      me(n, x, y, { dir: 'right' });
      const fallen = Math.floor(((F() % 300) / 300) * 14) - 2;
      for (let i = 0; i < 9; i++) {
        const dx = x + 20 + i * 5;
        if (i < fallen) { R(dx, y + 10, 7, 3, '#202028'); R(dx + 1, y + 11, 5, 1, '#f8f8f0'); }
        else { R(dx, y + 2, 3, 11, '#202028'); R(dx + 1, y + 3, 1, 9, '#f8f8f0'); R(dx + 1, y + 5, 1, 1, '#202028'); R(dx + 1, y + 9, 1, 1, '#202028'); }
      }
    } },
    hula: { props: [], draw(n, x, y) {
      const s = Math.sin(F() / 5) * 2;
      me(n, x, y, { dir: 'down', dx: -s / 2 });
      ctx.strokeStyle = '#f050a0'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(x + 8 + s, y + 10, 9, 2.5, Math.sin(F() / 10) * 0.15, 0, Math.PI * 2); ctx.stroke();
    } },
    scacchi: { props: [[1, 0], [2, 0]], draw(n, x, y) {
      me(n, x, y, { dir: 'right' });
      R(x + 17, y + 5, 14, 9, '#202028');
      for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) R(x + 18 + i * 3, y + 6 + j * 2.5, 3, 2.5, (i + j) % 2 ? '#f8f0d8' : '#7c5428');
      R(x + 20, y + 3, 2, 3, '#f8f8f8'); R(x + 27, y + 3, 2, 3, '#202028'); R(x + 24, y + 2, 2, 4, (F() >> 6) % 2 ? '#f8f8f8' : '#202028');
      R(x + 22, y + 14, 4, 4, '#5c3c20');
      colleague(PAL.dev2, x + 32, y, 'left');
    } },
    basket: { props: [[1, 0], [2, 0]], draw(n, x, y) {
      me(n, x, y, { dir: 'right' });
      R(x + 42, y - 12, 2, 28, '#606068'); R(x + 34, y - 18, 12, 9, '#f8f8f8'); R(x + 37, y - 15, 5, 4, '#e05020');
      R(x + 34, y - 9, 8, 1, '#e05020'); line(x + 35, y - 8, x + 37, y - 4, '#f8f8f8', 0.5); line(x + 41, y - 8, x + 39, y - 4, '#f8f8f8', 0.5);
      const t = (F() % 80) / 80;
      const bx = x + 12 + t * 26, by = y + 4 - Math.sin(t * Math.PI) * 22 + t * -6;
      circle(bx, by, 2.5, '#202028'); circle(bx, by, 2, '#f08830');
    } },
    golf: { props: [[1, 0], [2, 0]], draw(n, x, y) {
      me(n, x, y, { dir: 'right' });
      ctx.fillStyle = '#58b048'; ctx.beginPath(); ctx.ellipse(x + 30, y + 13, 18, 4, 0, 0, Math.PI * 2); ctx.fill();
      R(x + 40, y + 12, 3, 2, '#202028'); R(x + 41, y - 4, 1, 16, '#c0c0c8'); R(x + 42, y - 4, 6, 4, '#e03030');
      R(x + 12, y + 6, 1, 9, '#c0c0c8'); R(x + 12, y + 14, 3, 1, '#606068');
      const t = (F() % 120) / 120;
      if (t < 0.8) R(x + 16 + t / 0.8 * 25, y + 12, 2, 2, '#f8f8f8');
    } },
    latteart: { props: [[1, 0]], draw(n, x, y) {
      me(n, x, y, { dir: 'right' });
      R(x + 17, y + 6, 14, 3, '#7c5428'); R(x + 18, y + 9, 2, 7, '#5c3c20'); R(x + 28, y + 9, 2, 7, '#5c3c20');
      R(x + 19, y - 6, 10, 12, '#202028'); R(x + 20, y - 5, 8, 10, '#c8c8d0'); R(x + 22, y, 4, 2, '#303038');
      R(x + 21, y + 3, 6, 3, '#f8f8f8'); R(x + 23, y + 4, 2, 1, '#e07080');
      if ((F() >> 4) % 2) circle(x + 24, y - 9, 2, 'rgba(230,230,240,.6)');
    } },
    piante: { props: [[1, 0]], draw(n, x, y) {
      me(n, x, y, { dir: 'right' });
      const h = 3 + ((F() >> 4) % 12);
      R(x + 23, y + 10 - h, 1, h, '#3c8c3c');
      for (let i = 0; i < h; i += 3) { R(x + 20, y + 9 - i, 3, 2, '#58b050'); R(x + 24, y + 8 - i, 3, 2, '#68c058'); }
      if (h > 10) circle(x + 23.5, y - 2 - (h - 10), 2, '#f070a0');
      R(x + 19, y + 9, 10, 7, '#202028'); R(x + 20, y + 10, 8, 5, '#b06030');
      R(x + 11, y + 5, 6, 4, '#48a048'); R(x + 16, y + 4, 3, 1, '#48a048');
      for (let i = 0; i < 3; i++) R(x + 19 + i, y + 4 + ((F() + i * 5) % 10), 1, 1, '#88c8f8');
    } },
    karaoke: { props: [], draw(n, x, y) {
      me(n, x, y, { dir: 'down', dy: (F() >> 4) % 2 ? -1 : 0 });
      R(x + 11, y + 4, 2, 4, '#303038'); R(x + 10, y + 2, 4, 3, '#808088');
      frame(x - 10, y - 26, 36, 14);
      note(x - 3, y - 23, '#f070c0'); note(x + 5, y - 22, '#48a8e8'); note(x + 13, y - 23, '#f8d050');
    } },
    corda: { props: [], draw(n, x, y) {
      const t = F() / 9, hop = -Math.abs(Math.sin(t)) * 5;
      const front = Math.cos(t) > 0;
      const ry = 13 * Math.abs(Math.cos(t / 1)) + 1;
      if (!front) { ctx.strokeStyle = '#e04848'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x + 8, y + 5 + hop / 2, 10, ry, 0, Math.PI, Math.PI * 2); ctx.stroke(); }
      me(n, x, y, { dir: 'down', dy: hop });
      if (front) { ctx.strokeStyle = '#e04848'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x + 8, y + 5 + hop / 2, 10, ry, 0, 0, Math.PI); ctx.stroke(); }
    } }
  };

  function st() {
    if (!game.bald) game.bald = { count: 0, order: null, pos: 0, steps: 0, next: 16, ex: null, exPos: 0, tips: {} };
    return game.bald;
  }
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  let SC = null;
  function scenes() {
    if (!SC) { SC = []; for (const v of Object.keys(BALD_TEXT)) if (VIS[v]) for (const [n, b] of BALD_TEXT[v]) SC.push({ v, n, b }); }
    return SC;
  }
  function pickScene() {
    const s = st(), all = scenes();
    if (!s.order || s.order.length !== all.length || s.pos >= all.length) { s.order = shuffle([...all.keys()]); s.pos = 0; }
    const slots = map.baldSlots || {};
    const ok = sc => VIS[sc.v].slot ? !!slots[sc.v] : true;
    const prefer = curMapId === 'pm1' && Math.random() < 0.5;
    let k = -1;
    if (prefer) k = s.order.findIndex((id, i) => i >= s.pos && VIS[all[id].v].slot && ok(all[id]));
    if (k < 0) k = s.order.findIndex((id, i) => i >= s.pos && ok(all[id]));
    if (k < 0) return null;
    [s.order[k], s.order[s.pos]] = [s.order[s.pos], s.order[k]];
    return { sc: all[s.order[s.pos]], commit() { s.pos++; } };
  }

  function inSight(x, y) {
    return activeNpcs().some(n => {
      if (!n.trainer || !n.trainer.sight || game.flags['def_' + n.id]) return false;
      const [dx, dy] = DIRS[n.dir];
      for (let i = 1; i <= n.trainer.sight; i++) if (n.x + dx * i === x && n.y + dy * i === y) return true;
      return false;
    });
  }
  function free(x, y) {
    const ch = tileAt(x, y);
    return walkable(x, y) && !ENCOUNTER.includes(ch) && !'ESOoVe'.includes(ch) && !isWarp(x, y) && !npcAt(x, y) && !(x === player.x && y === player.y) && !inSight(x, y);
  }
  function reachable() {
    const seen = new Set([player.x + ',' + player.y]), q = [[player.x, player.y]];
    while (q.length) {
      const [x, y] = q.shift();
      for (const [dx, dy] of Object.values(DIRS)) {
        const nx = x + dx, ny = y + dy, k = nx + ',' + ny;
        if (seen.has(k) || !walkable(nx, ny) || npcAt(nx, ny)) continue;
        seen.add(k); q.push([nx, ny]);
      }
    }
    return seen;
  }
  function findSpot(props) {
    const reach = reachable(), good = [], ok = [];
    const h = map.tiles.length, w = map.tiles[0].length;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (!free(x, y)) continue;
      const tiles = props.map(([dx, dy]) => [x + dx, y + dy]);
      if (!tiles.every(([a, b]) => free(a, b))) continue;
      const foot = [[x, y], ...tiles];
      const inFoot = (a, b) => foot.some(t => t[0] === a && t[1] === b);
      const approach = foot.some(([a, b]) => Object.values(DIRS).some(([dx, dy]) => !inFoot(a + dx, b + dy) && reach.has((a + dx) + ',' + (b + dy))));
      if (!approach) continue;
      const dist = Math.abs(x - player.x) + Math.abs(y - player.y);
      if (dist < 3) continue;
      if (Math.abs(x - player.x) <= 6 && Math.abs(y - player.y) <= 4) good.push([x, y]); else if (dist < 16) ok.push([x, y]);
    }
    const list = good.length ? good : ok;
    return list.length ? list[Math.floor(Math.random() * list.length)] : null;
  }

  function make(x, y, dir, sc, suit, extra = {}) {
    const props = (VIS[sc.v].props || []).map(([dx, dy]) => [x + dx, y + dy]);
    return Object.assign({ id: 'bald', kind: 'bald', x, y, dir, scene: sc, suit, pal: baldPal(suit), tiles: props, ox: 0, oy: 0, fr: 0, alpha: 1 }, extra);
  }

  function spawn() {
    if (!game.flags.baldIntro || NO_BALD.includes(curMapId) || npcs.some(n => n.kind === 'bald')) return false;
    const pick = pickScene();
    if (!pick) return false;
    const sc = pick.sc, slot = map.baldSlots && map.baldSlots[sc.v];
    let x, y, dir = 'down', hide;
    if (slot) { [x, y, dir, hide] = slot; if (x === player.x && y === player.y) return false; }
    else {
      const p = findSpot(VIS[sc.v].props || []);
      if (!p) return false;
      [x, y] = p;
      dir = ['down', 'left', 'right'][Math.floor(Math.random() * 3)];
    }
    pick.commit();
    const suit = BALD_SUITS[Math.floor(Math.random() * BALD_SUITS.length)];
    npcs.push(make(x, y, dir, sc, suit, { hide }));
    return true;
  }

  function onEnterMap() {
    const s = st();
    s.steps = 0;
    if (game.flags && game.flags.baldIntro && Math.random() < 0.7) spawn();
  }
  function onStep() {
    if (!game.flags.baldIntro) return;
    const s = st();
    const cur = npcs.find(n => n.kind === 'bald');
    if (cur) {
      if (cur.leaving) return;
      cur.age = (cur.age || 0) + 1;
      if (cur.age < 12) return;
      const visible = Math.abs(cur.x - player.x) <= 7 && Math.abs(cur.y - player.y) <= 4;
      if (visible) runScript(() => callOut(cur));
      else { npcs.splice(npcs.indexOf(cur), 1); s.steps = s.next - 2; }
      return;
    }
    s.steps++;
    if (s.steps >= s.next && spawn()) { s.steps = 0; s.next = 8 + Math.floor(Math.random() * 8); }
  }

  // Dopo una lotta il Dott. Baldinazzo arriva presto: ha sempre un commento sulla partita.
  function afterBattle() {
    if (!game.flags.baldIntro) return;
    const s = st();
    s.steps = Math.max(s.steps, s.next - 2);
  }

  // Se il giocatore non si avvicina, è il Dott. Baldinazzo a chiamarlo.
  async function callOut(n) {
    n.bubble = true;
    Sound.sfx('alert');
    await wait(30);
    n.bubble = false;
    const calls = [
      `DOTT. BALDINAZZO: Ehi, ${game.name}! Sì, dico proprio a te! Vieni a vedere!`,
      `DOTT. BALDINAZZO: ${game.name}! Psst! Hai un minuto? Anzi, trenta secondi.`,
      `DOTT. BALDINAZZO: Oh, ${game.name}! Che tempismo! Guarda qua!`,
      `DOTT. BALDINAZZO: ${game.name}, non far finta di non vedermi. Ti ho visto che mi hai visto.`,
      `DOTT. BALDINAZZO: Ciao ${game.name}! Fermati un attimo, ho una cosa da farti vedere.`
    ];
    await say(calls[Math.floor(Math.random() * calls.length)], { portrait: n.suit });
    await talk(n);
  }

  function draw(n, sx, sy) {
    ctx.save();
    ctx.globalAlpha = n.alpha;
    if (n.leaving) {
      me(n, sx, sy, { fr: n.fr });
      if ((frameCount >> 2) % 2) { R(sx + 2 - DIRS[n.dir][0] * 8, sy + 13, 3, 2, 'rgba(220,220,220,.7)'); }
    } else {
      VIS[n.scene.v].draw(n, sx, sy);
      if ((frameCount % 150) < 12) { const k = frameCount % 150; R(sx + 14, sy - 9 + k / 4, 1, 3, '#ffffff'); R(sx + 13, sy - 8 + k / 4, 3, 1, '#ffffff'); }
    }
    if (n.bubble) ctx.drawImage(Sprites.obj('bubble'), sx, sy - 24);
    ctx.restore();
  }

  function pickFrom(list, key) {
    const s = st();
    if (!s.tips[key] || s.tips[key].length !== list.length) s.tips[key] = shuffle([...list.keys()]);
    const k = (s.tips[key + '_i'] || 0) % list.length;
    s.tips[key + '_i'] = k + 1;
    return list[s.tips[key][k]];
  }
  function phase() {
    const f = game.flags, q = f.q || 0;
    if (!f.starter) return 'start';
    if (!f.kit) return 'kit';
    if (!f.def_techlead) return 'f1';
    if (!f.def_respit) return 'f2';
    if (!f.def_netman) return 'f3';
    if (!f.arrivedSede) return 'trip';
    if (!f.badge4) return 'sede' + Math.min(q, 6);
    if (!f.champion) return ['controller', 'tax', 'legal', 'cfo'].every(id => f['def_' + id]) ? 'ad' : 'p4';
    return 'post';
  }
  function tip() {
    const p = phase();
    const pool = (Math.random() < 0.35 || !BALD_TIPS[p]) ? 'general' : p;
    return pickFrom(BALD_TIPS[pool], 'tip_' + pool);
  }

  function exitPath(n) {
    const key = (x, y) => x + ',' + y;
    const prev = new Map([[key(n.x, n.y), null]]), q = [[n.x, n.y]];
    const w = map.tiles[0].length, h = map.tiles.length;
    let goal = null;
    while (q.length) {
      const [x, y] = q.shift();
      if ((x !== n.x || y !== n.y) && (isWarp(x, y) || (map.outdoor && (x === 0 || y === 0 || x === w - 1 || y === h - 1)))) { goal = [x, y]; break; }
      for (const [dx, dy] of Object.values(DIRS)) {
        const nx = x + dx, ny = y + dy, k = key(nx, ny);
        if (prev.has(k) || !walkable(nx, ny) || (nx === player.x && ny === player.y)) continue;
        const o = npcAt(nx, ny);
        if (o && o !== n) continue;
        prev.set(k, [x, y]); q.push([nx, ny]);
      }
    }
    if (!goal) return [];
    const path = [];
    let cur = goal;
    while (cur && !(cur[0] === n.x && cur[1] === n.y)) { const p = prev.get(key(cur[0], cur[1])); path.unshift([cur[0] - p[0], cur[1] - p[1]]); cur = p; }
    return path;
  }

  async function leave(n) {
    n.tiles = [];
    n.leaving = true;
    Sound.sfx('up');
    const path = exitPath(n).slice(0, 12);
    for (const [dx, dy] of path) {
      n.dir = dx > 0 ? 'right' : dx < 0 ? 'left' : dy > 0 ? 'down' : 'up';
      n.parity = !n.parity;
      await animate(5, t => { n.ox = dx * 16 * t; n.oy = dy * 16 * t; n.fr = t < 0.5 ? (n.parity ? 1 : 2) : 0; });
      n.x += dx; n.y += dy; n.ox = 0; n.oy = 0;
    }
    await animate(10, t => { n.alpha = 1 - t; });
    const i = npcs.indexOf(n);
    if (i >= 0) npcs.splice(i, 1);
  }

  async function milestone(c) {
    const special = BALD_MILESTONES[c];
    if (special) {
      Sound.sfx('fanfare');
      await sayAll(special.text.map(t => t.replace('{N}', c).replace('{NAME}', game.name)));
      for (const [k, q] of special.items) game.bag[k] = (game.bag[k] || 0) + q;
      if (special.flag) game.flags[special.flag] = true;
      return;
    }
    if (c % 10 === 0) {
      const gifts = [['caffe', 2, '2 CAFFÈ'], ['contratto', 2, '2 CONTRATTI'], ['espresso', 1, 'un ESPRESSO DOPPIO']];
      const [k, q, label] = gifts[(c / 10) % 3];
      game.bag[k] = (game.bag[k] || 0) + q;
      Sound.sfx('coin');
      await say(`Incontro numero ${c} con il Dott. Baldinazzo! Nella tasca della giacca ${game.name} trova ${label}. Come ci sono finiti lì?`);
    }
  }

  async function talk(n) {
    const s = st(), sc = n.scene, P = { portrait: n.suit };
    const fixed = ['palco', 'pingpong', 'calcetto', 'skate', 'dj', 'meditazione', 'tiro', 'scacchi', 'domino', 'golf', 'basket'];
    if (!fixed.includes(sc.v) && !VIS[sc.v].props?.length) n.dir = OPP[player.dir];
    await say(`Il Dott. Baldinazzo ${sc.n}.`);
    if (sc.v === 'amaca') n.awake = true;
    await say(`DOTT. BALDINAZZO: ${sc.b}`, P);
    if (Math.random() < 0.3) await say(pickFrom(BALD_CHARM, 'charm'));
    await say(`DOTT. BALDINAZZO: ${tip()}`, P);
    await say(`DOTT. BALDINAZZO: ${pickFrom(BALD_EXCUSES, 'excuse')}`, P);
    s.count++;
    await leave(n);
    await milestone(s.count);
  }

  async function intro() {
    const sc = { v: 'bolle', n: '', b: '' };
    const n = make(13, 3, 'left', sc, '#1c2440');
    npcs.push(n);
    await wait(30);
    Sound.sfx('alert');
    n.bubble = true;
    await wait(36);
    n.bubble = false;
    const P = { portrait: n.suit };
    await say('In mezzo al corridoio, un uomo in abito blu notte fa le bolle di sapone. Le bolle brillano alla luce delle finestre.');
    await sayAll([
      'DOTT. BALDINAZZO: Oh, ciao! Tu devi essere il nuovo arrivato. Piacere, Dott. Baldinazzo, Project Manager.',
      'DOTT. BALDINAZZO: Le bolle? Sto testando i processi aziendali: se una bolla dura più di una riunione, il processo funziona. Finora hanno vinto le bolle.',
      'DOTT. BALDINAZZO: Un consiglio: l\'HR è qui a sinistra, il Facility a destra. Prima l\'HR, poi il Facility. L\'ordine conta, come nei Gantt.',
      'DOTT. BALDINAZZO: Ci vedremo in giro. Spesso. Molto spesso. Ora scusa, ho uno stand-up iniziato quattro minuti fa!'
    ], P);
    game.flags.baldIntro = true;
    st().count = Math.max(st().count, 1);
    await leave(n);
  }

  // Solo per test: mostra una scena precisa in una posizione precisa.
  function force(v, x, y, dir = 'down', suit = BALD_SUITS[0]) {
    const sc = scenes().find(s => s.v === v);
    npcs = npcs.filter(n => n.kind !== 'bald');
    npcs.push(make(x, y, dir, sc, suit));
  }

  return { draw, talk, intro, onEnterMap, onStep, spawn, force, afterBattle, count: () => (game.bald ? game.bald.count : 0), VIS };
})();
