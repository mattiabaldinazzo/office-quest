'use strict';
// Dati di gioco: tipi, mosse, specie, strumenti.
const TYPES = {
  UFFICIO: { name: 'UFFICIO', color: '#a8a078' },
  CARTA: { name: 'CARTA', color: '#58a848' },
  CAFFE: { name: 'CAFFÈ', color: '#b06830' },
  TECH: { name: 'TECH', color: '#4878d8' }
};
// CARTA assorbe il CAFFÈ, il CAFFÈ manda in tilt la TECH, la TECH digitalizza la CARTA.
const TYPE_STRONG = { CARTA: 'CAFFE', CAFFE: 'TECH', TECH: 'CARTA' };
function typeEff(atk, def) {
  if (TYPE_STRONG[atk] === def) return 2;
  if (TYPE_STRONG[def] === atk) return 0.5;
  if (atk === def && atk !== 'UFFICIO') return 0.5;
  return 1;
}

const MOVES = {
  fotocopia: { name: 'Fotocopia', type: 'UFFICIO', power: 40, acc: 100 },
  pinzata: { name: 'Pinzata', type: 'UFFICIO', power: 55, acc: 95 },
  burocrazia: { name: 'Burocrazia', type: 'UFFICIO', power: 70, acc: 90 },
  licenzia: { name: 'Licenzia', type: 'UFFICIO', power: 85, acc: 90 },
  tagliocarta: { name: 'Taglio Carta', type: 'CARTA', power: 45, acc: 100 },
  modulistica: { name: 'Modulistica', type: 'CARTA', power: 75, acc: 90 },
  schizzo: { name: 'Schizzo', type: 'CAFFE', power: 45, acc: 100 },
  caffeina: { name: 'Caffeina', type: 'CAFFE', power: 75, acc: 90 },
  doppioclic: { name: 'Doppio Clic', type: 'TECH', power: 45, acc: 100 },
  schermoblu: { name: 'Schermo Blu', type: 'TECH', power: 75, acc: 90 },
  riunione: { name: 'Riunione', type: 'UFFICIO', power: 0, acc: 100, effect: { target: 'foe', stat: 'atk', stages: -1 } },
  emailcc: { name: 'Email in CC', type: 'TECH', power: 0, acc: 100, effect: { target: 'foe', stat: 'def', stages: -1 } },
  scadenza: { name: 'Scadenza', type: 'UFFICIO', power: 0, acc: 100, effect: { target: 'foe', stat: 'spd', stages: -1 } },
  turnoextra: { name: 'Turno Extra', type: 'UFFICIO', power: 0, acc: 100, effect: { target: 'self', stat: 'atk', stages: 1 } },
  pausapranzo: { name: 'Pausa Pranzo', type: 'CAFFE', power: 0, acc: 100, effect: { heal: 0.5 } }
};

const SPECIES = {
  foglietto: { name: 'Foglietto', type: 'CARTA', base: { hp: 46, atk: 49, def: 56, spd: 45 }, exp: 90, catch: 0.45,
    desc: 'Un foglio A4 sveglio e diligente. Si offende se lo pieghi male.',
    learn: [[1, 'tagliocarta'], [1, 'riunione'], [4, 'fotocopia'], [7, 'scadenza'], [10, 'turnoextra'], [13, 'modulistica'], [17, 'burocrazia']] },
  tazzino: { name: 'Tazzino', type: 'CAFFE', base: { hp: 42, atk: 55, def: 45, spd: 55 }, exp: 90, catch: 0.45,
    desc: 'Una tazzina sempre bollente. Senza di lui la riunione delle 9 non inizia.',
    learn: [[1, 'schizzo'], [1, 'turnoextra'], [4, 'fotocopia'], [7, 'riunione'], [10, 'pausapranzo'], [13, 'caffeina'], [17, 'pinzata']] },
  mousino: { name: 'Mousino', type: 'TECH', base: { hp: 40, atk: 52, def: 46, spd: 60 }, exp: 90, catch: 0.45,
    desc: 'Un mouse curioso. Clicca su tutto, anche sui link sospetti.',
    learn: [[1, 'doppioclic'], [1, 'emailcc'], [4, 'fotocopia'], [7, 'scadenza'], [10, 'turnoextra'], [13, 'schermoblu'], [17, 'pinzata']] },
  graffetta: { name: 'Graffetta', type: 'UFFICIO', base: { hp: 36, atk: 45, def: 40, spd: 62 }, exp: 60, catch: 0.75,
    desc: 'Tiene insieme i fogli e il morale della squadra.',
    learn: [[1, 'fotocopia'], [3, 'scadenza'], [8, 'pinzata'], [13, 'turnoextra']] },
  postit: { name: 'Post-it', type: 'CARTA', base: { hp: 40, atk: 42, def: 40, spd: 52 }, exp: 60, catch: 0.75,
    desc: 'Si attacca ovunque. Porta promemoria che nessuno legge.',
    learn: [[1, 'fotocopia'], [3, 'riunione'], [7, 'tagliocarta'], [14, 'modulistica']] },
  moka: { name: 'Moka', type: 'CAFFE', base: { hp: 48, atk: 50, def: 52, spd: 36 }, exp: 70, catch: 0.6,
    desc: 'Borbotta quando è sotto pressione. Cioè sempre.',
    learn: [[1, 'fotocopia'], [4, 'schizzo'], [8, 'pausapranzo'], [14, 'caffeina']] },
  cavetto: { name: 'Cavetto', type: 'TECH', base: { hp: 42, atk: 52, def: 38, spd: 58 }, exp: 70, catch: 0.6,
    desc: 'Si aggroviglia da solo dietro le scrivanie. Nessuno sa come.',
    learn: [[1, 'fotocopia'], [4, 'doppioclic'], [8, 'emailcc'], [14, 'schermoblu']] },
  stampacchio: { name: 'Stampacchio', type: 'TECH', base: { hp: 56, atk: 54, def: 60, spd: 30 }, exp: 85, catch: 0.5,
    desc: 'Si inceppa apposta quando hai fretta.',
    learn: [[1, 'fotocopia'], [1, 'emailcc'], [6, 'doppioclic'], [10, 'modulistica'], [15, 'schermoblu']] },
  faldone: { name: 'Faldone', type: 'CARTA', base: { hp: 62, atk: 54, def: 70, spd: 25 }, exp: 95, catch: 0.4,
    desc: 'Contiene pratiche del secolo scorso. Pesa come un armadio.',
    learn: [[1, 'fotocopia'], [1, 'riunione'], [5, 'tagliocarta'], [11, 'burocrazia'], [15, 'modulistica']] },
  pinzatrice: { name: 'Pinzatrice', type: 'UFFICIO', base: { hp: 50, atk: 66, def: 50, spd: 45 }, exp: 90, catch: 0.45,
    desc: 'Morde i documenti e non li lascia più.',
    learn: [[1, 'pinzata'], [1, 'scadenza'], [9, 'turnoextra'], [14, 'burocrazia']] },
  espressone: { name: 'Espressone', type: 'CAFFE', base: { hp: 66, atk: 72, def: 60, spd: 52 }, exp: 140, catch: 0.2,
    desc: 'La macchina del caffè del Direttore. Pressione: 15 bar di arroganza.',
    learn: [[1, 'schizzo'], [1, 'turnoextra'], [8, 'pausapranzo'], [12, 'caffeina']] },
  poltronissima: { name: 'Poltronissima', type: 'UFFICIO', base: { hp: 82, atk: 76, def: 76, spd: 46 }, exp: 180, catch: 0.1,
    desc: 'La poltrona in pelle del Direttore. Chi ci si siede non si alza più.',
    learn: [[1, 'riunione'], [1, 'burocrazia'], [10, 'turnoextra'], [14, 'licenzia']] }
};

const ITEMS = {
  contratto: { name: 'Contratto', price: 200, desc: 'Fa firmare un Officemon selvatico. Funziona meglio se è indebolito.' },
  caffe: { name: 'Caffè', price: 150, heal: 25, desc: 'Ridà 25 PS a un Officemon.' },
  espresso: { name: 'Espresso Doppio', price: 400, heal: 60, desc: 'Ridà 60 PS a un Officemon.' },
  cornetto: { name: 'Cornetto', price: 600, revive: true, desc: 'Rianima un Officemon esausto con metà dei PS.' }
};
const ITEM_ORDER = ['contratto', 'caffe', 'espresso', 'cornetto'];

const STAT_NAMES = { atk: "L'ATTACCO", def: 'La DIFESA', spd: 'La VELOCITÀ' };
const MAX_LVL = 50;

function expFor(l) { return l * l * l; }
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
