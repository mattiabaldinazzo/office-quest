'use strict';
// Chiptune minimale con WebAudio: musiche a loop ed effetti sonori.
const Sound = (() => {
  let ac = null, master = null, muted = false;
  let track = null, trackName = null, step = 0, nextTime = 0, timer = null, pending = null;
  try { muted = localStorage.getItem('oq-mute') === '1'; } catch (e) {}

  const SEMI = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };
  function freq(n) {
    const m = /^([A-G]#?)(\d)$/.exec(n);
    if (!m) return 0;
    const midi = SEMI[m[1]] + (parseInt(m[2], 10) + 1) * 12;
    return 440 * Math.pow(2, (midi - 69) / 12);
  }
  const seq = s => s.trim().split(/\s+/);

  const TRACKS = {
    title: {
      bpm: 112, loop: true, voices: [
        { type: 'square', vol: 0.05, notes: seq(`
          C5 - E5 - G5 - C6 -  B5 - G5 - A5 - - -  F5 - A5 - C6 - B5 -  G5 - - - E5 - - -
          D5 - F5 - A5 - G5 -  E5 - C5 - D5 - E5 -  F5 - E5 - D5 - B4 -  C5 - - - - - . .`) },
        { type: 'triangle', vol: 0.13, notes: seq(`
          C3 - - - G2 - - -  F2 - - - A2 - - -  F2 - - - G2 - - -  C3 - - - E2 - - -
          D2 - - - F2 - - -  A2 - - - C3 - - -  F2 - - - G2 - - -  C3 - - - G2 - - -`) }
      ]
    },
    town: {
      bpm: 120, loop: true, voices: [
        { type: 'square', vol: 0.045, notes: seq(`
          E5 . G5 . C6 . B5 A5  G5 - E5 - C5 . D5 E5  F5 . A5 . D6 . C6 B5  A5 - - - G5 - . .
          E5 . G5 . C6 . B5 A5  G5 - E5 - C5 . D5 E5  F5 . E5 . D5 . B4 D5  C5 - - - . . . .`) },
        { type: 'triangle', vol: 0.12, notes: seq(`
          C3 . G3 . C3 . G3 .  A2 . E3 . A2 . E3 .  F2 . C3 . F2 . C3 .  G2 . D3 . G2 . B2 .
          C3 . G3 . C3 . G3 .  A2 . E3 . A2 . E3 .  F2 . C3 . G2 . G2 .  C3 . G2 . C3 . . .`) }
      ]
    },
    battle: {
      bpm: 168, loop: true, voices: [
        { type: 'square', vol: 0.045, notes: seq(`
          A4 C5 E5 A5 G5 E5 C5 E5  F4 A4 C5 F5 E5 C5 A4 C5  G4 B4 D5 G5 F5 D5 B4 D5  E4 G#4 B4 E5 D5 B4 G#4 B4
          A5 . A5 G5 A5 . C6 B5  A5 . F5 . E5 . C5 D5  E5 . D5 . C5 . B4 C5  E5 - - - G#4 - B4 .`) },
        { type: 'triangle', vol: 0.13, notes: seq(`
          A2 A3 A2 A3 A2 A3 A2 A3  F2 F3 F2 F3 F2 F3 F2 F3  G2 G3 G2 G3 G2 G3 G2 G3  E2 E3 E2 E3 E2 E3 E2 E3
          A2 A3 A2 A3 A2 A3 A2 A3  F2 F3 F2 F3 F2 F3 F2 F3  G2 G3 G2 G3 G2 G3 G2 G3  E2 E3 E2 E3 E2 E3 G#2 B2`) }
      ]
    },
    boss: {
      bpm: 184, loop: true, voices: [
        { type: 'square', vol: 0.045, notes: seq(`
          D5 . D5 F5 A5 . G5 F5  E5 . C5 . A4 . C5 E5  D5 . D5 F5 A5 . C6 A5  A#5 - A5 - G5 - E5 .
          F5 G5 A5 F5 D5 E5 F5 D5  C5 D5 E5 C5 A4 B4 C5 A4  A#4 C5 D5 A#4 G4 A4 A#4 G4  A4 - - - C#5 - E5 .`) },
        { type: 'triangle', vol: 0.14, notes: seq(`
          D2 D3 D2 D3 D2 D3 D2 D3  C2 C3 C2 C3 C2 C3 C2 C3  D2 D3 D2 D3 D2 D3 D2 D3  A#1 A#2 A#1 A#2 A1 A2 A1 A2
          D2 D3 D2 D3 D2 D3 D2 D3  C2 C3 C2 C3 C2 C3 C2 C3  A#1 A#2 A#1 A#2 A#1 A#2 A#1 A#2  A1 A2 A1 A2 A1 A2 C#2 E2`) }
      ]
    },
    victory: {
      bpm: 150, loop: false, voices: [
        { type: 'square', vol: 0.05, notes: seq(`C5 C5 C5 C5 G#4 - A#4 - C5 . A#4 C5 - - - - . .`) },
        { type: 'triangle', vol: 0.13, notes: seq(`C3 - - - G#2 - A#2 - C3 . A#2 C3 - - - - . .`) }
      ]
    }
  };

  function init() {
    if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ac = new AC();
    master = ac.createGain();
    master.gain.value = muted ? 0 : 0.6;
    master.connect(ac.destination);
    timer = setInterval(tick, 25);
    if (pending) { const p = pending; pending = null; trackName = null; play(p); }
  }

  function tone(f, t, dur, type, vol) {
    if (!f) return;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(vol, t);
    g.gain.setValueAtTime(vol, t + Math.max(0, dur - 0.04));
    g.gain.exponentialRampToValueAtTime(0.0005, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.02);
  }

  function sweep(f0, f1, t, dur, type, vol) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0005, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.02);
  }

  function tick() {
    if (!ac || !track) return;
    const stepDur = 60 / track.bpm / 2;
    const len = Math.max(...track.voices.map(v => v.notes.length));
    while (nextTime < ac.currentTime + 0.12) {
      if (!track.loop && step >= len) { track = null; trackName = null; return; }
      for (const v of track.voices) {
        const i = step % v.notes.length, n = v.notes[i];
        if (n === '.' || n === '-') continue;
        let k = 1;
        while (v.notes[(i + k) % v.notes.length] === '-' && k < v.notes.length) k++;
        tone(freq(n), nextTime, stepDur * k * 0.95, v.type, v.vol);
      }
      step++;
      nextTime += stepDur;
    }
  }

  function play(name) {
    if (!ac) { pending = name; return; }
    if (trackName === name) return;
    trackName = name;
    track = TRACKS[name] || null;
    step = 0;
    nextTime = ac.currentTime + 0.06;
  }

  function stop() { track = null; trackName = null; pending = null; }

  function notes(list, type = 'square', vol = 0.07, gap = 0.09) {
    let t = ac.currentTime;
    for (const n of list) { tone(freq(n), t, gap * 0.9, type, vol); t += gap; }
  }

  function sfx(name) {
    if (!ac || muted) return;
    const t = ac.currentTime;
    switch (name) {
      case 'blip': tone(1046, t, 0.04, 'square', 0.04); break;
      case 'select': tone(784, t, 0.04, 'square', 0.05); tone(1175, t + 0.045, 0.05, 'square', 0.05); break;
      case 'bump': tone(98, t, 0.08, 'square', 0.06); break;
      case 'door': sweep(300, 900, t, 0.15, 'square', 0.04); break;
      case 'hit': sweep(500, 60, t, 0.18, 'sawtooth', 0.08); sweep(200, 40, t + 0.02, 0.15, 'square', 0.05); break;
      case 'super': sweep(900, 60, t, 0.28, 'sawtooth', 0.09); break;
      case 'weak': sweep(240, 80, t, 0.12, 'square', 0.05); break;
      case 'faint': sweep(700, 50, t, 0.6, 'square', 0.06); break;
      case 'alert': tone(1568, t, 0.06, 'square', 0.06); tone(2093, t + 0.07, 0.12, 'square', 0.06); break;
      case 'heal': notes(['C5', 'E5', 'G5', 'C6', 'G5', 'C6'], 'square', 0.06, 0.11); break;
      case 'fanfare': notes(['G4', 'C5', 'E5', 'G5', 'E5', 'G5', 'C6'], 'square', 0.06, 0.1); break;
      case 'levelup': notes(['C5', 'E5', 'G5', 'C6'], 'square', 0.06, 0.07); break;
      case 'up': sweep(300, 1200, t, 0.25, 'square', 0.05); break;
      case 'down': sweep(1200, 200, t, 0.25, 'square', 0.05); break;
      case 'throw': sweep(400, 1600, t, 0.2, 'triangle', 0.1); break;
      case 'shake': tone(220, t, 0.05, 'square', 0.06); tone(180, t + 0.06, 0.05, 'square', 0.06); break;
      case 'catch': notes(['E5', 'G5', 'C6', 'E6'], 'square', 0.06, 0.09); break;
      case 'coin': tone(988, t, 0.06, 'square', 0.05); tone(1319, t + 0.07, 0.15, 'square', 0.05); break;
    }
  }

  function toggleMute() {
    muted = !muted;
    try { localStorage.setItem('oq-mute', muted ? '1' : '0'); } catch (e) {}
    if (master) master.gain.value = muted ? 0 : 0.6;
    return muted;
  }

  return { init, play, stop, sfx, toggleMute, get muted() { return muted; } };
})();
