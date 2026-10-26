'use strict';
// Dati di gioco: tipi, mosse, specie, strumenti.
const COMPANY = 'LatenzaZero S.p.A.';
const COMPANY_UP = 'LATENZAZERO';

const TYPES = {
  SEGNALE: { name: 'SEGNALE', color: '#d09818' },
  FIBRA: { name: 'FIBRA', color: '#3888d0' },
  CARTA: { name: 'CARTA', color: '#58a848' },
  UFFICIO: { name: 'UFFICIO', color: '#a8a078' }
};
// La FIBRA batte il SEGNALE (il cavo non perde colpi), il SEGNALE batte la CARTA
// (si digitalizza tutto), la CARTA batte la FIBRA (senza permessi niente scavi).
const TYPE_STRONG = { FIBRA: 'SEGNALE', SEGNALE: 'CARTA', CARTA: 'FIBRA' };
function typeEff(atk, def) {
  if (TYPE_STRONG[atk] === def) return 2;
  if (TYPE_STRONG[def] === atk) return 0.5;
  if (atk === def && atk !== 'UFFICIO') return 0.5;
  return 1;
}

const MOVES = {
  fotocopia: { name: 'Fotocopia', type: 'UFFICIO', power: 40, acc: 100 },
  pinzata: { name: 'Pinzata', type: 'UFFICIO', power: 55, acc: 95 },
  schizzo: { name: 'Schizzo', type: 'UFFICIO', power: 50, acc: 100 },
  caffeina: { name: 'Caffeina', type: 'UFFICIO', power: 70, acc: 90 },
  licenzia: { name: 'Licenzia', type: 'UFFICIO', power: 85, acc: 90 },
  riorganizza: { name: 'Riorganizza', type: 'UFFICIO', power: 95, acc: 85 },
  squillo: { name: 'Squillo', type: 'SEGNALE', power: 40, acc: 100 },
  roaming: { name: 'Roaming', type: 'SEGNALE', power: 58, acc: 95 },
  onda5g: { name: 'Onda 5G', type: 'SEGNALE', power: 78, acc: 90 },
  ping: { name: 'Ping', type: 'FIBRA', power: 40, acc: 100 },
  bandalarga: { name: 'Banda Larga', type: 'FIBRA', power: 58, acc: 95 },
  fibraottica: { name: 'Fibra Ottica', type: 'FIBRA', power: 78, acc: 90 },
  bolletta: { name: 'Bolletta', type: 'CARTA', power: 40, acc: 100 },
  tagliocarta: { name: 'Taglio Carta', type: 'CARTA', power: 58, acc: 95 },
  modulistica: { name: 'Modulistica', type: 'CARTA', power: 78, acc: 90 },
  riunione: { name: 'Riunione', type: 'UFFICIO', power: 0, acc: 100, effect: { target: 'foe', stat: 'atk', stages: -1 } },
  attesa: { name: 'Attesa', type: 'SEGNALE', power: 0, acc: 100, effect: { target: 'foe', stat: 'atk', stages: -1 } },
  latenza: { name: 'Latenza', type: 'FIBRA', power: 0, acc: 100, effect: { target: 'foe', stat: 'spd', stages: -1 } },
  ticket: { name: 'Ticket Aperto', type: 'CARTA', power: 0, acc: 100, effect: { target: 'foe', stat: 'def', stages: -1 } },
  disdetta: { name: 'Disdetta', type: 'SEGNALE', power: 0, acc: 100, effect: { target: 'foe', stat: 'def', stages: -1 } },
  straordinari: { name: 'Straordinari', type: 'UFFICIO', power: 0, acc: 100, effect: { target: 'self', stat: 'atk', stages: 1 } },
  riavvio: { name: 'Riavvio', type: 'FIBRA', power: 0, acc: 100, effect: { heal: 0.5 } },
  pausapranzo: { name: 'Pausa Pranzo', type: 'UFFICIO', power: 0, acc: 100, effect: { heal: 0.5 } }
};

const SPECIES = {
  simmetta: { name: 'Simmetta', type: 'SEGNALE', base: { hp: 44, atk: 52, def: 44, spd: 62 }, exp: 90, catch: 0.45,
    desc: 'Una SIM piccola ma con un segnale fortissimo. Si attiva in meno di cinque minuti.',
    learn: [[1, 'squillo'], [1, 'attesa'], [4, 'fotocopia'], [8, 'disdetta'], [11, 'roaming'], [15, 'straordinari'], [19, 'onda5g'], [26, 'licenzia']] },
  simbox: { name: 'Simbox', type: 'CARTA', base: { hp: 54, atk: 48, def: 58, spd: 38 }, exp: 90, catch: 0.45,
    desc: 'Un totem self service. Ti scansiona i documenti, ti fa un video e ti consegna una SIM con un sorriso.',
    learn: [[1, 'bolletta'], [1, 'ticket'], [4, 'fotocopia'], [8, 'riunione'], [11, 'tagliocarta'], [15, 'riavvio'], [19, 'modulistica'], [26, 'licenzia']] },
  routerino: { name: 'Routerino', type: 'FIBRA', base: { hp: 48, atk: 54, def: 50, spd: 50 }, exp: 90, catch: 0.45,
    desc: 'Un modem tondo e compatto. Sul suo piccolo schermo mostra il QR del Wi-Fi a chi gli sta simpatico.',
    learn: [[1, 'ping'], [1, 'latenza'], [4, 'fotocopia'], [8, 'straordinari'], [11, 'bandalarga'], [15, 'riavvio'], [19, 'fibraottica'], [26, 'licenzia']] },
  antennina: { name: 'Antennina', type: 'SEGNALE', base: { hp: 50, atk: 56, def: 48, spd: 46 }, exp: 85, catch: 0.5,
    desc: 'Una piccola stazione radio base. Cresce in altezza ogni volta che qualcuno si lamenta del campo.',
    learn: [[1, 'squillo'], [1, 'attesa'], [10, 'roaming'], [16, 'disdetta'], [20, 'onda5g']] },
  smartfonino: { name: 'Smartfonino', type: 'SEGNALE', base: { hp: 42, atk: 50, def: 40, spd: 66 }, exp: 75, catch: 0.6,
    desc: 'Uno smartphone sempre al 3% di batteria. Non risponde mai al primo squillo.',
    learn: [[1, 'squillo'], [6, 'disdetta'], [11, 'roaming'], [18, 'onda5g']] },
  cuffietta: { name: 'Cuffietta', type: 'SEGNALE', base: { hp: 46, atk: 46, def: 50, spd: 52 }, exp: 75, catch: 0.6,
    desc: 'La cuffia del customer care. Ripete "la sua chiamata è importante per noi" anche nel sonno.',
    learn: [[1, 'attesa'], [1, 'squillo'], [10, 'roaming'], [17, 'pausapranzo']] },
  ripetitore: { name: 'Ripetitore', type: 'SEGNALE', base: { hp: 48, atk: 50, def: 54, spd: 50 }, exp: 85, catch: 0.5,
    desc: 'Un ripetitore Wi-Fi. Ripete tutto quello che dici, ma un po\' più lentamente.',
    learn: [[1, 'squillo'], [1, 'latenza'], [12, 'roaming'], [19, 'onda5g']] },
  cavetto: { name: 'Cavetto', type: 'FIBRA', base: { hp: 42, atk: 54, def: 38, spd: 58 }, exp: 70, catch: 0.6,
    desc: 'Si aggroviglia da solo dietro le scrivanie. Nessuno sa come.',
    learn: [[1, 'ping'], [5, 'latenza'], [10, 'bandalarga'], [18, 'fibraottica']] },
  mousino: { name: 'Mousino', type: 'FIBRA', base: { hp: 40, atk: 50, def: 46, spd: 60 }, exp: 70, catch: 0.65,
    desc: 'Un mouse con il filo. Clicca su tutto, anche sui link sospetti.',
    learn: [[1, 'fotocopia'], [3, 'ping'], [8, 'latenza'], [14, 'bandalarga']] },
  switchone: { name: 'Switchone', type: 'FIBRA', base: { hp: 56, atk: 58, def: 60, spd: 40 }, exp: 95, catch: 0.45,
    desc: 'Uno switch a 48 porte. Le sue lucine lampeggiano a ritmo quando è contento.',
    learn: [[1, 'ping'], [1, 'latenza'], [12, 'bandalarga'], [17, 'riavvio'], [21, 'fibraottica']] },
  rackone: { name: 'Rackone', type: 'FIBRA', base: { hp: 74, atk: 70, def: 72, spd: 38 }, exp: 150, catch: 0.15,
    desc: 'Un intero rack del data center. Se si arrabbia, cade la rete di mezza Italia.',
    learn: [[1, 'ping'], [1, 'riavvio'], [14, 'bandalarga'], [20, 'fibraottica'], [26, 'riorganizza']] },
  foglietto: { name: 'Foglietto', type: 'CARTA', base: { hp: 44, atk: 46, def: 54, spd: 46 }, exp: 65, catch: 0.7,
    desc: 'Un foglio A4 sveglio e diligente. Si offende se lo pieghi male.',
    learn: [[1, 'bolletta'], [1, 'riunione'], [9, 'tagliocarta'], [17, 'modulistica']] },
  postit: { name: 'Post-it', type: 'CARTA', base: { hp: 40, atk: 44, def: 40, spd: 54 }, exp: 60, catch: 0.75,
    desc: 'Si attacca ovunque. Porta promemoria che nessuno legge.',
    learn: [[1, 'fotocopia'], [3, 'riunione'], [7, 'bolletta'], [14, 'tagliocarta']] },
  faldone: { name: 'Faldone', type: 'CARTA', base: { hp: 64, atk: 56, def: 72, spd: 26 }, exp: 100, catch: 0.4,
    desc: 'Contiene pratiche del secolo scorso. Pesa come un armadio.',
    learn: [[1, 'fotocopia'], [1, 'ticket'], [8, 'bolletta'], [14, 'tagliocarta'], [20, 'modulistica']] },
  bolletta: { name: 'Bolletta', type: 'CARTA', base: { hp: 46, atk: 58, def: 42, spd: 54 }, exp: 80, catch: 0.55,
    desc: 'Arriva sempre quando meno te l\'aspetti. Ha un conguaglio per tutti.',
    learn: [[1, 'bolletta'], [1, 'ticket'], [12, 'tagliocarta'], [19, 'modulistica']] },
  stampacchio: { name: 'Stampacchio', type: 'CARTA', base: { hp: 56, atk: 54, def: 60, spd: 30 }, exp: 85, catch: 0.5,
    desc: 'Si inceppa apposta quando hai fretta.',
    learn: [[1, 'fotocopia'], [1, 'ticket'], [8, 'bolletta'], [13, 'tagliocarta'], [20, 'modulistica']] },
  graffetta: { name: 'Graffetta', type: 'UFFICIO', base: { hp: 36, atk: 45, def: 40, spd: 62 }, exp: 55, catch: 0.8,
    desc: 'Tiene insieme i fogli e il morale della squadra.',
    learn: [[1, 'fotocopia'], [3, 'riunione'], [8, 'pinzata'], [15, 'straordinari']] },
  pinzatrice: { name: 'Pinzatrice', type: 'UFFICIO', base: { hp: 50, atk: 66, def: 50, spd: 45 }, exp: 90, catch: 0.45,
    desc: 'Morde i documenti e non li lascia più.',
    learn: [[1, 'pinzata'], [1, 'riunione'], [12, 'straordinari'], [20, 'licenzia']] },
  tazzino: { name: 'Tazzino', type: 'UFFICIO', base: { hp: 42, atk: 52, def: 44, spd: 56 }, exp: 65, catch: 0.7,
    desc: 'Una tazzina sempre bollente. Senza di lui lo stand-up delle 9 non inizia.',
    learn: [[1, 'schizzo'], [4, 'straordinari'], [10, 'pausapranzo'], [17, 'caffeina']] },
  moka: { name: 'Moka', type: 'UFFICIO', base: { hp: 50, atk: 52, def: 54, spd: 36 }, exp: 75, catch: 0.6,
    desc: 'Borbotta quando è sotto pressione. Cioè sempre.',
    learn: [[1, 'schizzo'], [6, 'riunione'], [12, 'pausapranzo'], [18, 'caffeina']] },
  espressone: { name: 'Espressone', type: 'UFFICIO', base: { hp: 66, atk: 72, def: 60, spd: 52 }, exp: 140, catch: 0.2,
    desc: 'La macchina del caffè della direzione. Pressione: 15 bar di arroganza.',
    learn: [[1, 'schizzo'], [1, 'straordinari'], [12, 'pausapranzo'], [18, 'caffeina'], [26, 'licenzia']] },
  poltronissima: { name: 'Poltronissima', type: 'UFFICIO', base: { hp: 82, atk: 76, def: 76, spd: 46 }, exp: 180, catch: 0.1,
    desc: 'La poltrona in pelle dell\'AD. Chi ci si siede non si alza più.',
    learn: [[1, 'riunione'], [1, 'pinzata'], [16, 'straordinari'], [22, 'licenzia'], [28, 'riorganizza']] }
};
const STARTERS = ['simmetta', 'simbox', 'routerino'];
// Il rivale sceglie sempre lo starter con il vantaggio di tipo.
const RIVAL_PICK = { simmetta: 'routerino', routerino: 'simbox', simbox: 'simmetta' };

const ITEMS = {
  contratto: { name: 'Contratto', price: 200, desc: 'Fa firmare un Officemon selvatico. Funziona meglio se è indebolito.' },
  caffe: { name: 'Caffè', price: 150, heal: 30, desc: 'Ridà 30 PS a un Officemon.' },
  espresso: { name: 'Espresso Doppio', price: 400, heal: 70, desc: 'Ridà 70 PS a un Officemon.' },
  ricarica: { name: 'Ricarica Giga', price: 900, heal: 999, desc: 'Ricarica tutti i PS di un Officemon. Giga illimitati.' },
  cornetto: { name: 'Cornetto', price: 600, revive: true, desc: 'Rianima un Officemon esausto con metà dei PS.' }
};
const ITEM_ORDER = ['contratto', 'caffe', 'espresso', 'ricarica', 'cornetto'];
const PLURAL = { contratto: 'CONTRATTI', caffe: 'CAFFÈ', espresso: 'ESPRESSI DOPPI', ricarica: 'RICARICHE GIGA', cornetto: 'CORNETTI' };

const STAT_NAMES = { atk: "L'ATTACCO", def: 'La DIFESA', spd: 'La VELOCITÀ' };
const MAX_LVL = 60;

function expFor(l) { return Math.floor(0.8 * l * l * l); }
function calcStats(m) {
  const b = SPECIES[m.sp].base, l = m.lvl;
  return {
    hp: Math.floor(2 * b.hp * l / 100) + l + 10,
    atk: Math.floor(2 * b.atk * l / 100) + 5,
    def: Math.floor(2 * b.def * l / 100) + 5,
    spd: Math.floor(2 * b.spd * l / 100) + 5
  };
}
function maxHp(m) { return calcStats(m).hp; }
function makeMon(sp, lvl) {
  const m = { sp, lvl, exp: expFor(lvl), moves: [] };
  for (const [l, mv] of SPECIES[sp].learn) {
    if (l > lvl || m.moves.includes(mv)) continue;
    m.moves.push(mv);
    if (m.moves.length > 4) m.moves.shift();
  }
  m.hp = maxHp(m);
  return m;
}
function monName(m) { return SPECIES[m.sp].name.toUpperCase(); }
function expFrac(m) {
  if (m.lvl >= MAX_LVL) return 0;
  const a = expFor(m.lvl), b = expFor(m.lvl + 1);
  return Math.max(0, Math.min(1, (m.exp - a) / (b - a)));
}
