'use strict';
// Personaggi aggiuntivi descritti da file JSON nella cartella characters/ del repository.
const CustomChars = (() => {
  const list = [];
  const ALL = ['pt', 'pm1', 'p1', 'p2', 'p3', 'p4', 'p5', 'ad', 'via', 'piazza', 'bosco', 'isola', 'sede2pt', 'sede2p1'];
  const FLOORS = {
    '-1': ['pm1'], 'PT': ['pt'], '0': ['pt'], 'RECEPTION': ['pt'],
    '1': ['p1'], '2': ['p2'], '3': ['p3'], '4': ['p4'], '5': ['p5'], 'AD': ['ad'],
    'SEDE #2': ['sede2pt', 'sede2p1'], 'SEDE2': ['sede2pt', 'sede2p1'], 'SEDE #2 PT': ['sede2pt'], 'SEDE #2 1': ['sede2p1'],
    'VIA': ['via'], 'PIAZZA': ['piazza'], 'BOSCO': ['bosco'], 'ISOLA': ['isola'], 'ESTERNI': ['via', 'piazza', 'bosco', 'isola'],
    'SEDE PRINCIPALE': ['pt', 'pm1', 'p1', 'p2', 'p3', 'p4', 'p5'], 'TUTTI': ALL
  };
  const HAIR = {
    corti: {}, lunghi: { long: true }, ciuffo: { quiff: true }, spettinati: { spiky: true },
    calvo: { bald: true }, chignon: { bun: true }, raccolti: { bun: true }
  };
  const COLORS = {
    neri: '#18161c', nero: '#18161c', castani: '#5a3a22', castano: '#5a3a22', marroni: '#5a3a22', biondi: '#e0c060', biondo: '#e0c060',
    rossi: '#c05028', rosso: '#c05028', grigi: '#a8a8b0', grigio: '#a8a8b0', bianchi: '#e8e8e8', bianco: '#e8e8e8',
    blu: '#3060c8', azzurri: '#48a0e8', azzurro: '#48a0e8', verdi: '#3c9450', verde: '#3c9450', viola: '#8048b0', rosa: '#f080b0',
    nocciola: '#8a5a30', ambra: '#c08830'
  };
  const SHIRTS = ['#f8f8f8', '#b8c8e8', '#e87878', '#58a058', '#f0a040', '#7858b8', '#48a8a8', '#f8e070', '#d05878', '#303038', '#a0a0c8', '#c8b890'];
  const PANTS = ['#384878', '#383848', '#202028', '#584838', '#486848', '#585868', '#3a4a6a', '#6a5a48'];
  const JACKETS = ['#1c2440', '#3a3a44', '#5a1c28', '#2c4a3a', '#6a5038', '#283048', '#4a4a58'];
  const TIES = ['#d03030', '#3858a8', '#f8d030', '#58a058', '#a050a0'];
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const norm = s => String(s || '').trim();
  const color = (v, def) => { const s = norm(v).toLowerCase(); if (/^#[0-9a-f]{6}$/.test(s)) return s; return COLORS[s] || def; };
  const slug = s => norm(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'collega';

  function parse(raw, file) {
    const nome = norm(raw.nome);
    if (!nome) { console.warn(`Personaggio ${file}: manca il nome, lo salto.`); return null; }
    const maps = new Set();
    for (const p of [].concat(raw.piani || 'TUTTI')) {
      const key = norm(p).toUpperCase().replace('°', '').replace(/\s+/g, ' ');
      (FLOORS[key] || (ALL.includes(norm(p)) ? [norm(p)] : [])).forEach(m => maps.add(m));
    }
    if (!maps.size) console.warn(`Personaggio ${file}: nessun piano valido, uso tutti i piani.`);
    const pct = Math.max(0, Math.min(100, Number(raw.percentuale_incontri ?? 30) || 0));
    const hair = raw.capelli || {};
    return {
      id: 'cc_' + slug(nome), nome, ruolo: norm(raw.ruolo) || 'Collega',
      carattere: norm(raw.carattere).toLowerCase() || 'allegro',
      pct, maps: maps.size ? [...maps] : ALL,
      hairColor: color(hair.colore ?? raw.colore_capelli, '#5a3a22'),
      style: HAIR[norm(hair.acconciatura ?? raw.acconciatura).toLowerCase()] || {},
      eyes: color(raw.occhi ?? raw.colore_occhi, null),
      skin: color(raw.pelle, '#f8c8a0'),
      frasi: Array.isArray(raw.frasi) ? raw.frasi.map(norm).filter(Boolean) : []
    };
  }

  async function getJson(url) {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error(url + ' ' + r.status);
    return r.json();
  }
  // Elenco dei file: prima characters/index.json (generato dalla GitHub Action), poi l'API di GitHub.
  async function fileList() {
    try {
      const idx = await getJson('characters/index.json?v=' + Date.now());
      if (Array.isArray(idx.files)) return idx.files;
    } catch (e) { /* si prova l'API */ }
    try {
      const m = /^([^.]+)\.github\.io$/.exec(location.hostname);
      const repo = location.pathname.split('/').filter(Boolean)[0];
      if (!m || !repo) return [];
      const items = await getJson(`https://api.github.com/repos/${m[1]}/${repo}/contents/characters`);
      return items.filter(i => i.name.endsWith('.json') && i.name !== 'index.json').map(i => i.name);
    } catch (e) { return []; }
  }

  async function load() {
    const files = await fileList();
    await Promise.all(files.map(async f => {
      try {
        const c = parse(await getJson('characters/' + encodeURIComponent(f) + '?v=' + Date.now()), f);
        if (c && !list.some(o => o.id === c.id)) list.push(c);
      } catch (e) { console.warn('Personaggio non caricato: ' + f, e); }
    }));
    if (list.length) console.info(`Personaggi aggiuntivi caricati: ${list.map(c => c.nome).join(', ')}`);
  }

  // Il vestito cambia a ogni incontro.
  function outfit(c) {
    const o = { shirt: pick(SHIRTS), pants: pick(PANTS) };
    if (Math.random() < 0.4) o.jacket = pick(JACKETS);
    if (Math.random() < 0.3) o.tie = pick(TIES);
    if (Math.random() < 0.15) o.glasses = true;
    const id = c.id + [o.shirt, o.pants, o.jacket, o.tie, o.glasses].join('');
    return Object.assign({ id, hair: c.hairColor, skin: c.skin, eyes: c.eyes }, c.style, o);
  }

  function spawnFor(mapId) {
    for (const c of list) {
      if (!c.maps.includes(mapId) || Math.random() * 100 >= c.pct || npcs.some(n => n.id === c.id)) continue;
      const pos = Bald.findSpot([]);
      if (!pos) continue;
      npcs.push({ id: c.id, custom: c, x: pos[0], y: pos[1], dir: pick(['down', 'left', 'right', 'up']), pal: outfit(c), wander: true,
        ox: 0, oy: 0, fr: 0, timer: 60 + Math.floor(Math.random() * 120), talk: () => talk(c) });
    }
  }

  const fill = (s, c) => s.replace(/\{nome\}/g, c.nome).replace(/\{ruolo\}/g, c.ruolo).replace(/\{giocatore\}/g, game.name);
  function personality(c) {
    const k = Object.keys(CHAR_LINES).find(key => c.carattere.startsWith(key)) || 'alleg';
    return CHAR_LINES[k];
  }
  async function talk(c) {
    const who = c.nome.toUpperCase() + ': ';
    const p = personality(c);
    await say(who + fill(pick(p.saluti), c));
    const pool = c.frasi.length && Math.random() < 0.7 ? c.frasi : p.battute;
    await say(who + fill(pick(pool), c));
  }

  return { load, spawnFor, list, parse };
})();

// Frasi per carattere. {nome}, {ruolo} e {giocatore} vengono sostituiti.
const CHAR_LINES = {
  alleg: {
    saluti: ['Ciao {giocatore}! Che bella giornata per lavorare in {ruolo}!', 'Ehi! Sono {nome}, di mestiere {ruolo}. Piacere!', 'Buongiorno! Hai già preso il caffè? Io tre.'],
    battute: ['Oggi ho chiuso tutti i ticket prima delle dieci. Mi sento un supereroe.', 'Il segreto della felicità? Una scrivania vicino alla finestra e colleghi simpatici. Tipo te.', 'Se ti serve una mano, chiedi pure. Se mi serve una mano, ti chiamo!', 'Stasera aperitivo all\'Isola, vieni? Porta anche i tuoi Officemon.']
  },
  timid: {
    saluti: ['Oh... ciao. Sono {nome}. Lavoro come {ruolo}. Scusa se disturbo.', 'Ehm... buongiorno {giocatore}.', 'Ciao... non ti avevo visto arrivare.'],
    battute: ['Nelle riunioni non parlo mai. Però prendo appunti bellissimi.', 'Una volta ho alzato la mano in una call. Mi hanno messo in muto per sbaglio.', 'Mi piace lavorare in silenzio. Con le cuffie. Anche senza musica.', 'Se vedi il Dott. Baldinazzo... salutamelo tu, io mi vergogno.']
  },
  sarcas: {
    saluti: ['Oh, guarda chi c\'è. Il nuovo assunto. Benvenuto all\'inferno, ehm, in ufficio.', 'Sono {nome}, {ruolo}. Sì, è un lavoro vero. Più o meno.', 'Ciao {giocatore}. Che sorpresa. Non.'],
    battute: ['Adoro le riunioni che potevano essere una mail. Cioè tutte.', 'Il Wi-Fi qui è velocissimo. Quando funziona. Cioè il martedì.', 'Il nostro processo di approvazione è agile. Ci vogliono solo sei settimane.', 'Latenza zero, dicono. La latenza delle risposte alle mie mail è infinita.']
  },
  entusias: {
    saluti: ['WOW, ciao {giocatore}! Sono {nome}, {ruolo}, e AMO il mio lavoro!', 'Eccoti! Sai che oggi è un giorno FANTASTICO?', 'Ciao! Hai sentito della nuova offerta? Incredibile!!!'],
    battute: ['Ho appena finito una presentazione da 80 slide. Ne voglio fare un\'altra!', 'Ogni ticket è un\'opportunità! Ogni bug è un regalo!', 'Ho proposto di fare lo stand-up due volte al giorno. Nessuno mi ha risposto. Strano!', 'Il 5G è la cosa più bella dopo il caffè. E dopo il 4G.']
  },
  brontol: {
    saluti: ['Mmh. Sono {nome}. {ruolo}. Cosa vuoi?', 'Uff. Un\'altra persona che mi parla prima del caffè.', 'Sì, ciao, ciao. Sono occupato. Sono sempre occupato.'],
    battute: ['Ai miei tempi le SIM erano grandi come carte di credito. E funzionavano meglio.', 'L\'aria condizionata è troppo fredda. O troppo calda. Comunque sbagliata.', 'Hanno spostato di nuovo la macchinetta del caffè. Perché? Perché?!', 'Il ping pong al -1 fa rumore. Però vinco sempre io, quindi va bene.']
  },
  saggi: {
    saluti: ['Benvenuto, {giocatore}. Sono {nome}, {ruolo} da molti anni.', 'Siediti un momento, giovane collega.', 'Ah, una faccia nuova. Bene. L\'azienda ha bisogno di energia.'],
    battute: ['Un buon lavoro si vede da come lo lasci a chi viene dopo.', 'Non c\'è problema tecnico che un caffè e una passeggiata non aiutino a capire.', 'Ascolta più di quanto parli. In riunione e nelle lotte.', 'Ho visto passare tre riorganizzazioni. Le persone restano, gli organigrammi cambiano.']
  },
  distratt: {
    saluti: ['Oh, ciao! Sono... ah sì, {nome}. {ruolo}. Credo.', 'Ciao {giocatore}! Aspetta, cosa stavo facendo?', 'Hai visto il mio badge? Ce l\'ho al collo? Ah, ecco.'],
    battute: ['Sono venuto qui per prendere qualcosa. Non ricordo cosa.', 'Ho una riunione alle tre. O alle due. Oggi o domani.', 'Ho mandato una mail a tutta l\'azienda per sbaglio. Era la lista della spesa.', 'Il mio Officemon si è perso. No, aspetta, è nello zaino.']
  },
  competit: {
    saluti: ['Ciao {giocatore}. Sono {nome}, {ruolo}. Il migliore del piano, ovviamente.', 'Ah, sei tu. Sappi che ho battuto Kevin tre volte.', 'Ehi. Quanti Officemon hai? Io di più.'],
    battute: ['Ho chiuso più ticket di tutti questo mese. Ho fatto un grafico per dimostrarlo.', 'A ping pong sono imbattuto. Tranne contro il Dott. Baldinazzo. Non conta.', 'Il mio record di velocità sulle scale è 38 secondi. Fino al quinto.', 'La prossima volta ti sfido. Preparati.']
  },
  pettegol: {
    saluti: ['Psst, {giocatore}! Vieni qui. Sono {nome}, {ruolo}. Hai sentito l\'ultima?', 'Ciao! Allora, cosa si dice ai piani alti?', 'Eccoti! Ho una notizia bomba.'],
    battute: ['Dicono che l\'AD abbia una poltrona che parla. Non lo dico io, lo dicono.', 'Hai visto che il Dott. Baldinazzo oggi aveva la giacca bordeaux? Vuol dire qualcosa.', 'Al terzo piano si dice che il rack numero 7 abbia una cotta per lo switch del secondo.', 'Non dirlo a nessuno, ma in Sede #2 hanno un\'altra macchinetta del caffè. Più buona.']
  },
  zen: {
    saluti: ['Namasté, {giocatore}. Sono {nome}. Di mestiere {ruolo}, nell\'anima viandante.', 'Ciao. Respira. Bene. Ora possiamo parlare.', 'Benvenuto nel momento presente.'],
    battute: ['La casella email piena è solo un\'illusione. Come la pausa pranzo di cinque minuti.', 'Ogni bug ha qualcosa da insegnarci. Soprattutto la pazienza.', 'Il traffico di rete scorre come un fiume. Io lo osservo dalla riva.', 'Quando il Wi-Fi cade, io resto in piedi.']
  },
  pigr: {
    saluti: ['Ciao... sono {nome}, {ruolo}. Scusa, sbadiglio.', 'Ehi {giocatore}. È già ora di pranzo?', 'Mmh, ciao. Non dirlo a nessuno che sono qui.'],
    battute: ['Ho automatizzato il mio lavoro. Ora devo solo nascondere che l\'ho automatizzato.', 'Il divanetto del -1 è il posto più produttivo del palazzo. Per dormire.', 'Ho una sola regola: mai riunioni prima delle dieci.', 'Correre? Le sneakers aziendali le uso come pantofole.']
  },
  precis: {
    saluti: ['Buongiorno {giocatore}. Sono {nome}, {ruolo}. Sei arrivato con 2 minuti e 14 secondi di anticipo.', 'Ciao. Hai compilato il modulo di presentazione? No? Te lo mando.', 'Salve. Allineamento perfetto delle scrivanie oggi. Ottimo.'],
    battute: ['Ho rinominato tutti i file della cartella condivisa con una convenzione nuova. Ora nessuno trova niente, ma è ordinato.', 'Il mio Excel ha 14 fogli, tutti con lo stesso formato. È bellissimo.', 'Le riunioni devono iniziare in orario. Infatti io arrivo sempre da solo.', 'Ho contato i passi dalla mia scrivania alla macchinetta: 47. Ottimizzabile.']
  }
};
