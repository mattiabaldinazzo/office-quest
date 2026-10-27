'use strict';
// Oggetti grandi disegnati direttamente sullo schermo: tavoli da gioco, arredi, edifici di Milano.
const Decor = (() => {
  const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
  const circle = (x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); };
  const ring = (x, y, r, c) => { ctx.strokeStyle = c; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke(); };
  const OUT = '#202028';
  function box(x, y, w, h, fill) { R(x - 1, y - 1, w + 2, h + 2, OUT); R(x, y, w, h, fill); }

  const KINDS = {
    pingpong(x, y, d) {
      box(x + 2, y + 4, 44, 22, '#2c7c54');
      R(x + 3, y + 5, 42, 1, '#f8f8f8'); R(x + 3, y + 24, 42, 1, '#f8f8f8'); R(x + 3, y + 14, 42, 1, '#c8e8d8');
      R(x + 23, y + 1, 2, 27, '#e8e8e8'); R(x + 22, y + 1, 1, 27, '#606060');
      R(x + 5, y + 27, 2, 4, '#303038'); R(x + 41, y + 27, 2, 4, '#303038');
      const t = (frameCount % 60) / 60, dir = Math.floor(frameCount / 60) % 2;
      const bx = dir ? x + 6 + t * 36 : x + 42 - t * 36;
      const by = y + 10 + Math.sin(t * Math.PI * 2) * 4 - Math.sin(t * Math.PI) * 6;
      R(bx, by, 2, 2, '#f8f8f8'); R(bx, by + 8, 2, 1, 'rgba(0,0,0,.25)');
    },
    calcetto(x, y, d) {
      box(x + 1, y + 6, 46, 20, '#8c5a2c');
      R(x + 4, y + 9, 40, 14, '#3c9c48');
      R(x + 4, y + 15, 40, 1, '#e8f8e8'); R(x + 23, y + 9, 1, 14, '#e8f8e8');
      R(x + 2, y + 13, 2, 6, '#f8f8f8'); R(x + 44, y + 13, 2, 6, '#f8f8f8');
      for (let i = 0; i < 6; i++) {
        const rx = x + 8 + i * 6, off = Math.round(Math.sin(frameCount / 6 + i) * 2);
        R(rx, y + 3, 1, 26, '#b8b8c0');
        const c = i % 2 ? '#3870d0' : '#d03838';
        R(rx - 1, y + 11 + off, 3, 3, c); R(rx - 1, y + 17 + off, 3, 3, c);
      }
      const bx = x + 8 + (Math.sin(frameCount / 23) + 1) * 16, by = y + 12 + (Math.cos(frameCount / 17) + 1) * 4;
      R(bx, by, 2, 2, '#f8f8f8');
    },
    desk3(x, y, d) {
      box(x, y + 8, 48, 8, '#7c4c24'); R(x, y + 8, 48, 1, '#a06838');
      for (let i = 0; i < 3; i++) {
        const mx = x + 1 + i * 16;
        box(mx, y - 6, 14, 11, '#101418');
        R(mx + 1, y - 5, 12, 9, '#0c2038');
        if (i === 0) { for (let b = 0; b < 4; b++) R(mx + 2 + b * 3, y + 2 - (b + 1) * 1.5 - ((frameCount >> 5) + b) % 2, 2, (b + 1) * 1.5 + 1, '#58d8a0'); }
        if (i === 1) { R(mx + 2, y - 4, 10, 2, '#f8d050'); R(mx + 2, y - 1, 6, 1, '#88c8f8'); R(mx + 2, y + 1, 8, 1, '#88c8f8'); }
        if (i === 2) { const ph = frameCount >> 3; for (let k = 0; k < 10; k++) R(mx + 2 + k, y - 1 + Math.round(Math.sin((k + ph) / 2) * 2), 1, 1, '#f87878'); }
        R(mx + 6, y + 5, 2, 3, '#303038');
      }
      R(x + 18, y + 10, 12, 3, '#d8d8e0'); R(x + 36, y + 9, 4, 4, '#f8f8f8'); R(x + 36, y + 9, 4, 1, '#6a3a1a');
    },
    chair(x, y) {
      R(x + 4, y + 13, 8, 2, '#303038'); R(x + 7, y + 9, 2, 4, '#303038');
      box(x + 3, y + 6, 10, 4, '#202028'); box(x + 4, y - 2, 8, 9, '#282830');
    },
    sign(x, y) {
      R(x + 7, y + 6, 2, 9, '#5c3c20');
      box(x + 1, y - 2, 14, 9, '#f8f0d0');
      R(x + 3, y, 10, 1, '#c03030'); R(x + 3, y + 2, 8, 1, '#c03030'); R(x + 3, y + 4, 9, 1, '#c03030');
    },
    sede(x, y, d) {
      const w = d.w * 16, h = d.h * 16;
      box(x, y, w, h, d.color || '#d8d8dc');
      for (let r = 0; r < Math.floor((h - 26) / 14); r++) for (let c = 0; c < Math.floor((w - 8) / 12); c++) {
        R(x + 6 + c * 12, y + 22 + r * 14, 8, 9, '#4c6c8c'); R(x + 6 + c * 12, y + 22 + r * 14, 8, 2, '#88a8c8');
      }
      R(x + 4, y + 4, w - 8, 12, d.band || '#c02828');
      txt(d.label || COMPANY_UP, x + w / 2, y + 7, { size: 6, align: 'center', color: '#f8f8f8', shadow: false });
      if (d.door !== undefined) {
        const dx = x + d.door * 16;
        R(dx - 3, y + h - 20, 38, 20, '#505868'); R(dx - 1, y + h - 18, 34, 18, '#98c4e0');
        R(dx + 15, y + h - 18, 2, 18, '#505868'); R(dx + 3, y + h - 14, 3, 8, '#d8f0ff'); R(dx + 20, y + h - 12, 3, 8, '#d8f0ff');
        R(dx - 6, y + h - 24, 44, 3, d.band || '#c02828');
      }
    },
    torre(x, y, d) {
      const w = d.w * 16, h = d.h * 16, cx = x + w / 2;
      R(cx - 1, y, 2, 30, '#d8dce4'); R(cx - 1, y, 2, 2, '#f84848');
      ctx.fillStyle = OUT;
      ctx.beginPath(); ctx.moveTo(cx - 3, y + 28); ctx.quadraticCurveTo(cx - w / 2 + 4, y + 60, cx - w / 2 + 6, y + h); ctx.lineTo(cx + w / 2 - 6, y + h); ctx.quadraticCurveTo(cx + w / 2 - 4, y + 60, cx + 3, y + 28); ctx.fill();
      const g = ctx.createLinearGradient(x, 0, x + w, 0);
      g.addColorStop(0, '#5c88b8'); g.addColorStop(0.5, '#a8d0f0'); g.addColorStop(1, '#4c78a8');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(cx - 2, y + 30); ctx.quadraticCurveTo(cx - w / 2 + 5, y + 61, cx - w / 2 + 7, y + h - 1); ctx.lineTo(cx + w / 2 - 7, y + h - 1); ctx.quadraticCurveTo(cx + w / 2 - 5, y + 61, cx + 2, y + 30); ctx.fill();
      for (let yy = y + 44; yy < y + h - 4; yy += 6) R(x + 8, yy, w - 16, 1, 'rgba(255,255,255,.25)');
      R(cx - 1, y + 34, 2, h - 36, 'rgba(255,255,255,.35)');
    },
    vetro(x, y, d) {
      const w = d.w * 16, h = d.h * 16;
      box(x + 2, y + 4, w - 4, h - 4, '#7ca0c4');
      for (let yy = y + 8; yy < y + h; yy += 5) R(x + 3, yy, w - 6, 1, '#9cc0e0');
      for (let xx = x + 8; xx < x + w - 4; xx += 8) R(xx, y + 5, 1, h - 6, '#5c80a4');
      R(x + 4, y + 6, 3, h - 10, 'rgba(255,255,255,.35)');
    },
    bosco(x, y, d) {
      const w = d.w * 16, h = d.h * 16;
      box(x + 4, y + 2, w - 8, h - 2, '#b8b4ac');
      for (let r = 0; r * 8 + 6 < h - 4; r++) {
        const yy = y + 6 + r * 8;
        R(x + 5, yy + 5, w - 10, 2, '#8c887c');
        for (let c = 0; c < 4; c++) {
          const cx = x + 8 + c * ((w - 16) / 3) + ((r % 2) ? 4 : -2);
          const col = ['#2c7c34', '#3c9444', '#4ca44c', '#5cb45c'][(r + c) % 4];
          ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(cx, yy + 2, 4.5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = col; ctx.beginPath(); ctx.arc(cx, yy + 2, 3.5, 0, Math.PI * 2); ctx.fill();
        }
      }
    },
    palazzo(x, y, d) {
      const w = d.w * 16, h = d.h * 16, cols = ['#e0a070', '#e8c868', '#c8786c', '#a8c098', '#d8b0c8'];
      box(x, y + 4, w, h - 4, cols[(d.v || 0) % 5]);
      R(x - 1, y + 2, w + 2, 3, '#7c4c34');
      for (let r = 0; r < Math.floor((h - 26) / 13); r++) for (let c = 0; c < Math.floor((w - 6) / 11); c++) {
        R(x + 5 + c * 11, y + 9 + r * 13, 6, 8, '#4c5c6c'); R(x + 3 + c * 11, y + 9 + r * 13, 2, 8, '#3c7c4c'); R(x + 11 + c * 11, y + 9 + r * 13, 2, 8, '#3c7c4c');
      }
      R(x + 2, y + h - 14, w - 4, 4, d.awning || '#c84040');
      for (let xx = x + 2; xx < x + w - 4; xx += 6) R(xx, y + h - 14, 3, 4, '#f8f8f0');
      R(x + 6, y + h - 9, w - 12, 8, '#3c4c5c');
      if (d.graffiti) { R(x + 4, y + h - 22, 10, 3, '#f050a0'); R(x + 9, y + h - 24, 8, 3, '#50d0f0'); R(x + 14, y + h - 21, 7, 2, '#f8e050'); }
    },
    gru(x, y, d) {
      const h = d.h * 16;
      for (let yy = y + 8; yy < y + h; yy += 6) { R(x + 6, yy, 6, 1, '#d8a020'); R(x + 6, yy, 1, 6, '#d8a020'); R(x + 11, yy, 1, 6, '#d8a020'); }
      R(x + 5, y + 8, 1, h - 8, '#a07010'); R(x + 12, y + 8, 1, h - 8, '#a07010');
      R(x - 30, y + 4, 70, 3, '#e8b030'); R(x - 30, y + 7, 70, 1, '#a07010');
      R(x + 4, y, 10, 5, '#d04040');
      const hx = x + 30 + Math.round(Math.sin(frameCount / 60) * 6);
      R(hx, y + 8, 1, 20, '#404048'); R(hx - 3, y + 28, 7, 4, '#606068');
      R(x - 28, y + 7, 8, 6, '#808088');
    },
    tram(x, y, d) {
      const w = d.w * 16;
      box(x + 1, y + 6, w - 2, 20, '#e88830');
      R(x + 1, y + 6, w - 2, 3, '#c86818'); R(x + 1, y + 22, w - 2, 4, '#585858');
      for (let xx = x + 5; xx < x + w - 8; xx += 10) { R(xx, y + 11, 7, 7, '#d8e8f0'); R(xx, y + 11, 7, 2, '#a8c0d0'); }
      R(x + w / 2 - 1, y, 2, 6, '#404048'); R(x + w / 2 - 6, y, 12, 1, '#404048');
      R(x + 4, y + 26, 6, 3, '#303030'); R(x + w - 10, y + 26, 6, 3, '#303030');
    },
    // ---------- Ufficio segreto del Dott. Baldinazzo ----------
    board(x, y, d) {
      const w = d.w * 16, h = d.h * 16;
      R(x - 1, y + 1, w + 2, h - 1, '#8c6a3c'); R(x + 1, y + 3, w - 2, h - 6, '#f4f4ee');
      txt('PROGETTI TOP SECRET', x + w / 2, y + 4, { size: 4, align: 'center', color: '#c02828', shadow: false });
      const rows = BALD_PROJECTS.slice(0, 5);
      rows.forEach((pr, i) => {
        const yy = y + 10 + i * 4.2;
        txt(pr.code.slice(0, 11), x + 3, yy, { size: 3, color: '#283048', shadow: false });
        R(x + 46, yy + 0.5, 22, 2.4, '#d8d8d8');
        R(x + 46, yy + 0.5, Math.round(22 * pr.pct / 100), 2.4, pr.pct >= 80 ? '#48b048' : pr.pct >= 30 ? '#e0b030' : '#e04838');
        txt(projectStatus(pr), x + w - 3, yy, { size: 2.5, align: 'right', color: '#283048', shadow: false });
      });
      R(x + w - 14, y + h - 6, 8, 2, '#3870d0'); R(x + w - 24, y + h - 6, 8, 2, '#e04848');
    },
    quadro(x, y, d) {
      R(x + 1, y + 1, 14, 12, '#c8a050'); R(x + 2, y + 2, 12, 10, '#7c5c2c'); R(x + 3, y + 3, 10, 8, '#e8dcc0');
      const v = d.v;
      if (v === 'ritratto') { R(x + 3, y + 3, 10, 8, '#5a4030'); R(x + 6, y + 5, 4, 4, '#f2cbac'); R(x + 5, y + 4, 6, 2, '#141218'); R(x + 5, y + 9, 6, 2, '#1c2440'); R(x + 7, y + 9, 2, 2, '#f8f8f8'); }
      if (v === 'gioconda') { R(x + 3, y + 3, 10, 8, '#7c8a50'); R(x + 6, y + 4, 4, 4, '#d8b088'); R(x + 5, y + 4, 1, 5, '#3a2810'); R(x + 10, y + 4, 1, 5, '#3a2810'); R(x + 5, y + 8, 6, 3, '#3a3a30'); R(x + 7, y + 9, 2, 1, '#58c8f8'); }
      if (v === 'notte') { R(x + 3, y + 3, 10, 8, '#284890'); R(x + 4, y + 4, 2, 1, '#f8e070'); R(x + 9, y + 5, 2, 2, '#f8e070'); R(x + 7, y + 5, 1, 6, '#202028'); R(x + 6, y + 6, 3, 1, '#202028'); R(x + 3, y + 9, 10, 2, '#183060'); }
      if (v === 'diploma') { R(x + 4, y + 4, 8, 1, '#a0a8c8'); R(x + 4, y + 6, 6, 1, '#a0a8c8'); R(x + 4, y + 8, 7, 1, '#a0a8c8'); R(x + 10, y + 8, 2, 2, '#c02828'); }
      if (v === 'paddle') { R(x + 3, y + 3, 10, 8, '#24402f'); R(x + 5, y + 4, 6, 5, '#e0b030'); R(x + 7, y + 9, 2, 2, '#8c5a2c'); R(x + 6, y + 5, 2, 1, '#f8e8a0'); }
    },
    scritta(x, y, d) {
      const size = Math.max(2, Math.min(4, Math.floor((d.w * 16 - 2) / d.text.length)));
      txt(d.text, x + d.w * 8, y + 6, { size, align: 'center', color: '#e8c870', shadow: '#102018' });
    },
    tappeto(x, y, d) {
      const w = d.w * 16, h = d.h * 16;
      R(x + 2, y + 2, w - 4, h - 4, '#7c1c1c'); R(x + 5, y + 5, w - 10, h - 10, '#a83030');
      R(x + 8, y + 8, w - 16, h - 16, '#7c1c1c'); R(x + 11, y + 11, w - 22, h - 22, '#c8a050');
      for (let i = x + 4; i < x + w - 4; i += 4) { R(i, y + 3, 2, 1, '#e0c070'); R(i, y + h - 4, 2, 1, '#e0c070'); }
      for (let i = x + 2; i < x + w - 2; i += 3) { R(i, y, 1, 2, '#e8dcc0'); R(i, y + h - 2, 1, 2, '#e8dcc0'); }
    },
    poltrona(x, y) {
      box(x + 1, y - 2, 14, 9, '#5a2a18'); for (let i = 0; i < 3; i++) { R(x + 3 + i * 4, y, 1, 1, '#3a1a10'); R(x + 5 + i * 4, y + 3, 1, 1, '#3a1a10'); }
      box(x, y + 4, 3, 9, '#6a3220'); box(x + 13, y + 4, 3, 9, '#6a3220');
      box(x + 3, y + 7, 10, 5, '#7a3a24'); R(x + 3, y + 7, 10, 1, '#9a5a3a');
      R(x + 2, y + 13, 2, 2, '#2a1408'); R(x + 12, y + 13, 2, 2, '#2a1408');
    },
    lampada(x, y) {
      R(x + 7, y - 6, 2, 19, '#b08830'); R(x + 4, y + 13, 8, 2, '#8c6a20');
      ctx.fillStyle = '#202028'; ctx.beginPath(); ctx.moveTo(x + 2, y - 4); ctx.lineTo(x + 14, y - 4); ctx.lineTo(x + 11, y - 13); ctx.lineTo(x + 5, y - 13); ctx.fill();
      ctx.fillStyle = '#2c6c3c'; ctx.beginPath(); ctx.moveTo(x + 3, y - 5); ctx.lineTo(x + 13, y - 5); ctx.lineTo(x + 10.5, y - 12); ctx.lineTo(x + 5.5, y - 12); ctx.fill();
      ctx.fillStyle = 'rgba(255,230,150,0.18)'; ctx.beginPath(); ctx.moveTo(x + 3, y - 4); ctx.lineTo(x + 13, y - 4); ctx.lineTo(x + 22, y + 14); ctx.lineTo(x - 6, y + 14); ctx.fill();
    },
    mappamondo(x, y) {
      R(x + 4, y + 9, 8, 2, '#7c5428'); R(x + 7, y + 6, 2, 4, '#b08830'); R(x + 5, y + 13, 6, 2, '#5c3c20'); R(x + 7, y + 11, 2, 2, '#7c5428');
      circle(x + 8, y + 2, 6.5, '#202028'); circle(x + 8, y + 2, 5.5, '#c8b878');
      const r = (frameCount >> 4) % 4;
      R(x + 4 + r, y - 1, 3, 2, '#5c8c48'); R(x + 9 - r / 2, y + 2, 2, 3, '#5c8c48'); R(x + 6, y + 4, 2, 1, '#5c8c48');
      ring(x + 8, y + 2, 7, '#b08830');
    },
    pendolo(x, y, d) {
      const h = d.h * 16;
      box(x + 3, y - 10, 10, h + 8, '#5a3418'); R(x + 4, y - 9, 8, 3, '#7c4a24');
      circle(x + 8, y - 2, 3.6, '#f4ecd8'); R(x + 8, y - 4, 1, 2, '#202028'); R(x + 8, y - 2, 2, 1, '#202028');
      R(x + 5, y + 4, 6, h - 10, '#2a1408');
      const sw = Math.sin(frameCount / 18) * 2;
      R(x + 8 + sw * 0.3, y + 5, 1, 9, '#b08830'); circle(x + 8.5 + sw, y + 15, 1.8, '#e0b030');
    },
    trofei(x, y, d) {
      const h = d.h * 16;
      box(x + 1, y - 6, 14, h + 4, '#5a3418'); R(x + 2, y - 5, 12, h + 2, '#c8d8e0');
      R(x + 2, y + 6, 12, 1, '#5a3418'); R(x + 2, y + 17, 12, 1, '#5a3418');
      R(x + 4, y - 3, 3, 5, '#e0b030'); R(x + 4, y + 2, 3, 1, '#8c6a20');
      R(x + 9, y - 2, 4, 4, '#d0d0d8'); R(x + 10, y + 2, 2, 2, '#8c8c90');
      R(x + 4, y + 9, 2, 6, '#e0b030'); R(x + 3, y + 9, 4, 2, '#e0b030'); R(x + 9, y + 10, 4, 3, '#c8783c'); R(x + 10, y + 13, 2, 2, '#8c5428');
      R(x + 4, y + 20, 8, 3, '#d03838'); R(x + 5, y + 19, 6, 1, '#e0b030');
    },
    appendiabiti(x, y) {
      R(x + 7, y - 10, 2, 24, '#5a3418'); R(x + 4, y + 13, 8, 2, '#3a2210');
      const suits = ['#1c2440', '#1c2440', '#5a1c28'];
      suits.forEach((c, i) => { box(x + 2 + i * 4, y - 8 + i, 5, 9, c); R(x + 4 + i * 4, y - 8 + i, 1, 3, '#f8f8f8'); });
    },
    grammofono(x, y) {
      box(x + 3, y + 6, 10, 7, '#7c4a24'); circle(x + 8, y + 6, 3, '#202024');
      R(x + 10, y - 2, 1, 7, '#b08830');
      ctx.fillStyle = '#e0b030'; ctx.beginPath(); ctx.moveTo(x + 10, y - 2); ctx.lineTo(x + 16, y - 12); ctx.lineTo(x + 6, y - 12); ctx.fill();
      if ((frameCount >> 4) % 2) { R(x + 14, y - 16 - (frameCount >> 2) % 6, 1, 4, '#202028'); R(x + 12, y - 13 - (frameCount >> 2) % 6, 2, 2, '#202028'); }
    },
    carrello(x, y) {
      R(x + 2, y + 2, 12, 2, '#b08830'); R(x + 2, y + 9, 12, 2, '#b08830'); R(x + 2, y + 2, 1, 11, '#b08830'); R(x + 13, y + 2, 1, 11, '#b08830');
      circle(x + 4, y + 13, 1.5, '#202020'); circle(x + 12, y + 13, 1.5, '#202020');
      R(x + 4, y - 5, 4, 7, '#a8d0c0'); R(x + 5, y - 7, 2, 2, '#a8d0c0'); R(x + 4, y - 2, 4, 4, '#4a2010');
      R(x + 9, y - 1, 3, 3, '#e0f0f8'); R(x + 9, y + 6, 4, 3, '#f8f8f8');
    },
    cassaforte(x, y) {
      box(x + 2, y - 2, 12, 15, '#3a3a44'); R(x + 3, y - 1, 10, 1, '#5a5a64');
      circle(x + 8, y + 5, 3, '#b8b8c0'); circle(x + 8, y + 5, 1.4, '#3a3a44'); R(x + 11, y + 4, 2, 3, '#b8b8c0');
    },
    telefono(x, y) {
      R(x + 3, y + 5, 10, 2, '#5a3418'); R(x + 5, y + 7, 1, 8, '#5a3418'); R(x + 10, y + 7, 1, 8, '#5a3418');
      box(x + 4, y + 1, 8, 4, '#c02020'); R(x + 3, y - 1, 10, 2, '#c02020'); R(x + 7, y + 2, 2, 2, '#f8f8f8');
      if ((frameCount % 240) < 30 && (frameCount >> 2) % 2) { R(x + 1, y - 4, 2, 1, '#f8e070'); R(x + 13, y - 4, 2, 1, '#f8e070'); }
    },
    macchina(x, y) {
      R(x + 2, y + 5, 12, 2, '#5a3418'); R(x + 4, y + 7, 1, 8, '#5a3418'); R(x + 11, y + 7, 1, 8, '#5a3418');
      box(x + 3, y, 10, 5, '#2c2c34'); R(x + 4, y + 3, 8, 1, '#c8c8c8'); R(x + 5, y - 5, 6, 5, '#f8f8f0'); R(x + 6, y - 4, 4, 1, '#a0a8c8');
    },
    gatto(x, y) {
      ctx.fillStyle = '#202028'; ctx.beginPath(); ctx.ellipse(x + 8, y + 10, 6.5, 3.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#e88838'; ctx.beginPath(); ctx.ellipse(x + 8, y + 10, 5.5, 2.6, 0, 0, Math.PI * 2); ctx.fill();
      circle(x + 3.5, y + 9, 2.6, '#e88838'); R(x + 2, y + 6, 1, 2, '#e88838'); R(x + 4, y + 6, 1, 2, '#e88838');
      R(x + 7, y + 9, 1, 2, '#c86818'); R(x + 10, y + 9, 1, 2, '#c86818'); R(x + 2, y + 10, 4, 1, '#3870d0');
      const k = (frameCount >> 5) % 3; txt('z', x + 4 + k * 2, y - 2 - k * 3, { size: 4, color: '#f8f8f8', shadow: '#404060' });
    },
    jets(x, y, d) {
      for (let i = 0; i < (d.n || 5); i++) {
        const jx = x + 8 + i * 16, hh = 8 + ((frameCount >> 2) + i * 3) % 8;
        R(jx, y + 8 - hh, 2, hh, 'rgba(220,240,255,.85)');
        R(jx - 2, y + 8 - hh, 6, 2, 'rgba(255,255,255,.9)');
      }
    }
  };

  function draw(d, sx, sy) { (KINDS[d.k] || (() => {}))(sx, sy, d); }
  return { draw };
})();
