'use strict';
// Mappe, personaggi e allenatori.
const PAL = {
  player: { id: 'player', hair: '#5a3a22', shirt: '#f8f8f8', pants: '#384878', tie: '#d03030' },
  ferri: { id: 'ferri', hair: '#a02818', shirt: '#a050a0', pants: '#383848', long: true, glasses: true },
  kevin: { id: 'kevin', hair: '#e8c040', shirt: '#3888d0', pants: '#584838', spiky: true },
  giulia: { id: 'giulia', hair: '#282828', shirt: '#e87878', pants: '#484858', long: true },
  guard: { id: 'guard', hair: '#404040', shirt: '#404868', pants: '#303038', tie: '#f8d030' },
  luca: { id: 'luca', hair: '#c87838', shirt: '#f8e070', pants: '#486848' },
  marta: { id: 'marta', hair: '#704020', shirt: '#58a058', pants: '#383848', long: true },
  paolo: { id: 'paolo', hair: '#303030', shirt: '#b8c8e8', pants: '#505060', tie: '#3858a8' },
  anna: { id: 'anna', hair: '#d07030', shirt: '#f0a040', pants: '#585868', long: true },
  gianni: { id: 'gianni', hair: '#282828', shirt: '#585860', pants: '#383848', glasses: true },
  sara: { id: 'sara', hair: '#d8a048', shirt: '#d05878', pants: '#383848', long: true },
  ivo: { id: 'ivo', hair: '#683820', shirt: '#78b878', pants: '#485868' },
  boss: { id: 'boss', hair: '#c8c8c8', shirt: '#f8f8f8', pants: '#282838', tie: '#d8b030', jacket: '#282838' },
  segretaria: { id: 'segretaria', hair: '#583020', shirt: '#e8e8f0', pants: '#585868', long: true, glasses: true }
};

const RIVAL_PICK = { foglietto: 'mousino', tazzino: 'foglietto', mousino: 'tazzino' };

const TRAINERS = {
  rival1: { title: 'KEVIN', pal: PAL.kevin, money: 100, lose: 'Cosa?! Ho scelto la cartellina sbagliata!',
    team: () => [[RIVAL_PICK[game.flags.starter], 5]] },
  luca: { title: 'STAGISTA LUCA', pal: PAL.luca, money: 120, sight: 4,
    intro: ['Ehi! Sono stagista da tre mesi e non ho mai perso una lotta!', 'Beh, non ho mai lottato. Ma c\'è sempre una prima volta!'],
    lose: 'Lo scrivo nel report: "esperienza formativa".',
    after: 'Fra due settimane scade il mio stage. Speriamo nel rinnovo...',
    team: [['graffetta', 4], ['postit', 5]] },
  marta: { title: 'CONTABILE MARTA', pal: PAL.marta, money: 200, sight: 3,
    intro: ['Alt! Hai consegnato la nota spese?', 'No? Allora lottiamo. I conti devono tornare!'],
    lose: 'Il bilancio è in rosso... come la mia faccia.',
    after: 'Il Direttore controlla ogni centesimo. Preparati bene prima di salire.',
    team: [['faldone', 6]] },
  gianni: { title: 'TECNICO IT GIANNI', pal: PAL.gianni, money: 260, sight: 3,
    intro: ['Hai provato a spegnere e riaccendere?', 'No? Allora ti riavvio io!'],
    lose: 'Errore 404: vittoria non trovata.',
    after: 'Ti consiglio un Officemon di tipo CAFFÈ contro la TECH. Mandano tutto in corto circuito.',
    team: [['cavetto', 8], ['stampacchio', 9]] },
  sara: { title: 'PROJECT MANAGER SARA', pal: PAL.sara, money: 300, sight: 2,
    intro: ['Ho cinque minuti tra una call e l\'altra.', 'Facciamo una lotta veloce. Agile!'],
    lose: 'Va bene, sposto la vittoria al prossimo sprint.',
    after: 'Il Direttore usa una POLTRONISSIMA. È di tipo UFFICIO: nessun tipo ha vantaggio su di lei.',
    team: [['pinzatrice', 9], ['moka', 10]] },
  rival2: { title: 'KEVIN', pal: PAL.kevin, money: 500, sight: 3,
    intro: ['Eccoti finalmente! Anch\'io voglio la promozione.', 'Prima di vedere il Direttore dovrai passare sopra di me!'],
    lose: 'Va bene, hai vinto tu. Il Direttore è tutto tuo. In bocca al lupo!',
    after: 'Il Direttore è dietro quella porta. Io resto qui a... riorganizzare la scrivania.',
    team: () => [['pinzatrice', 10], ['moka', 11], [RIVAL_PICK[game.flags.starter], 13]] },
  boss: { title: 'IL DIRETTORE', pal: PAL.boss, money: 2000,
    lose: 'Impressionante. Davvero impressionante.',
    team: [['espressone', 12], ['faldone', 13], ['poltronissima', 14]] },
  bossRematch: { title: 'IL DIRETTORE', pal: PAL.boss, money: 3000,
    lose: 'Revisione superata a pieni voti.',
    team: [['espressone', 20], ['stampacchio', 20], ['faldone', 21], ['poltronissima', 23]] }
};

const MAPS = {
  hall: {
    name: 'RECEPTION',
    tiles: [
      '####################',
      '##W###O####W###E##W#',
      '#P........,,......P#',
      '#.........,,.......#',
      '#..RRRRR..,,..ww...#',
      '#.........,,.......#',
      '#.hhh.....,,..BBBB.#',
      '#.........,,.......#',
      '#P........,,......P#',
      '##########MM########'
    ],
    warps: { '6,1': ['hr', 5, 7, 'up'], '15,1': ['open', 1, 2, 'down'] },
    npcs: [
      { id: 'giulia', x: 5, y: 3, dir: 'down', pal: PAL.giulia, talk: async () => {
        if (!game.flags.starter) await sayAll([`GIULIA: Buongiorno! Tu devi essere ${game.name}, il nuovo assunto.`, 'GIULIA: La Dott.ssa FERRI delle Risorse Umane ti aspetta. La porta è in alto a sinistra.']);
        else if (!game.flags.champion) await sayAll(['GIULIA: Al primo piano c\'è la macchinetta del caffè. Usala per rimettere in forma la squadra.', 'GIULIA: E ricordati di salvare spesso dal menu START!']);
        else await say(`GIULIA: Capo reparto ${game.name}! Le preparo un caffè?`);
      } },
      { id: 'guard', x: 15, y: 2, dir: 'down', pal: PAL.guard, show: () => !game.flags.starter,
        text: ['BRUNO: Alt! Ai piani superiori si lavora con gli Officemon.', 'BRUNO: Passa prima dall\'ufficio delle Risorse Umane, è la porta in alto a sinistra.'] },
      { id: 'guard2', x: 17, y: 2, dir: 'left', pal: PAL.guard, show: () => !!game.flags.starter,
        text: ['BRUNO: L\'ascensore porta all\'open space del primo piano. Buon lavoro!'] }
    ],
    signs: {
      '10,9': ['È il tuo primo giorno: non puoi già tornartene a casa!'],
      '11,9': ['È il tuo primo giorno: non puoi già tornartene a casa!']
    }
  },
  hr: {
    name: 'UFFICIO HR',
    tiles: [
      '############',
      '#b#b##W##b##',
      '#..........#',
      '#...DDDD...#',
      '#..........#',
      '#..T.T.T...#',
      '#..........#',
      '#P........P#',
      '#####oo#####'
    ],
    warps: { '5,8': ['hall', 6, 2, 'down'], '6,8': ['hall', 6, 2, 'down'] },
    npcs: [
      { id: 'ferri', x: 5, y: 2, dir: 'down', pal: PAL.ferri, talk: () => ferriTalk() },
      { id: 'kevin', x: 9, y: 5, dir: 'left', pal: PAL.kevin, show: () => !game.flags.rival1,
        text: ['KEVIN: Ciao! Anch\'io sono nuovo. Mi chiamo KEVIN.', 'KEVIN: Pare che oggi ci assegnino il nostro primo Officemon. Che emozione!'] },
      { id: 'f_foglietto', kind: 'folder', color: '#58a848', sp: 'foglietto', x: 3, y: 5, show: () => !game.flags.taken_foglietto, talk: n => folderTalk(n) },
      { id: 'f_tazzino', kind: 'folder', color: '#b06830', sp: 'tazzino', x: 5, y: 5, show: () => !game.flags.taken_tazzino, talk: n => folderTalk(n) },
      { id: 'f_mousino', kind: 'folder', color: '#4878d8', sp: 'mousino', x: 7, y: 5, show: () => !game.flags.taken_mousino, talk: n => folderTalk(n) }
    ]
  },
  open: {
    name: 'OPEN SPACE - 1° PIANO',
    tiles: [
      '########################',
      '#E##W###W###W###W###W#S#',
      '#......................#',
      '#.DCD.DCD....gggggg....#',
      '#....................K.#',
      '#.DCD.DCD....gggggg..v.#',
      '#.............gggg.....#',
      '#P....................P#',
      '#gggg....BBBB....,,,,,,#',
      '#gggg............,,TT,,#',
      '#gggg....DCD.DCD.,,,,,,#',
      '#.....................P#',
      '########################'
    ],
    warps: { '1,1': ['hall', 15, 2, 'down'], '22,1': ['piano2', 1, 2, 'down'] },
    encounters: [['graffetta', 2, 4, 40], ['postit', 2, 4, 40], ['moka', 3, 4, 20]],
    npcs: [
      { id: 'paolo', x: 3, y: 4, dir: 'down', pal: PAL.paolo, wander: true,
        text: ['PAOLO: Vedi quei grovigli di cavi? Lì dentro vivono gli Officemon selvatici.', 'PAOLO: Indeboliscili in lotta e poi proponi un CONTRATTO dallo ZAINO!'] },
      { id: 'anna', x: 21, y: 9, dir: 'left', pal: PAL.anna, wander: true,
        text: ['ANNA: La macchinetta del caffè qui accanto rimette in forma tutta la squadra. Gratis!', 'ANNA: Il distributore invece vende strumenti utili, se hai buoni pasto.'] },
      { id: 'luca', x: 10, y: 6, dir: 'left', pal: PAL.luca, trainer: TRAINERS.luca },
      { id: 'marta', x: 17, y: 2, dir: 'down', pal: PAL.marta, trainer: TRAINERS.marta },
      { id: 'item_open1', kind: 'item', x: 1, y: 11, item: 'contratto', qty: 2 },
      { id: 'item_open2', kind: 'item', x: 21, y: 11, item: 'caffe', qty: 2 }
    ]
  },
  piano2: {
    name: 'REPARTO IT - 2° PIANO',
    tiles: [
      '######################',
      '#S###W####W#####O##W##',
      '#....................#',
      '#.gggggg.....DCD.DCD.#',
      '#.gggggg.............#',
      '#.QQQQQQ....K........#',
      '#.gggggg.....DCD.DCD.#',
      '#.gggggg.............#',
      '#.QQQQQQ.......BBBB..#',
      '#.gggggg.............#',
      '#P..................P#',
      '######################'
    ],
    warps: { '1,1': ['open', 22, 2, 'down'], '16,1': ['boss', 6, 8, 'up'] },
    encounters: [['cavetto', 6, 8, 35], ['stampacchio', 7, 8, 25], ['moka', 6, 8, 15], ['faldone', 7, 9, 10], ['pinzatrice', 7, 8, 15]],
    npcs: [
      { id: 'ivo', x: 1, y: 9, dir: 'right', pal: PAL.ivo,
        text: ['IVO: Tra i rack dei server i cavi sono vivi. Letteralmente.', 'IVO: Qui gli Officemon sono più forti. Fai scorta di CAFFÈ!'] },
      { id: 'gianni', x: 9, y: 7, dir: 'left', pal: PAL.gianni, trainer: TRAINERS.gianni },
      { id: 'sara', x: 13, y: 9, dir: 'up', pal: PAL.sara, trainer: TRAINERS.sara },
      { id: 'kevin2', x: 14, y: 2, dir: 'right', pal: PAL.kevin, trainer: TRAINERS.rival2 },
      { id: 'item_p2', kind: 'item', x: 20, y: 9, item: 'espresso', qty: 1 },
      { id: 'item_p2b', kind: 'item', x: 8, y: 9, item: 'cornetto', qty: 1 }
    ]
  },
  boss: {
    name: 'UFFICIO DEL DIRETTORE',
    tiles: [
      '##############',
      '##W##W##W##W##',
      '#B..........B#',
      '#....DDDD....#',
      '#............#',
      '#P....,,....P#',
      '#.....,,.....#',
      '#.....,,.....#',
      '#.....,,.....#',
      '######oo######'
    ],
    warps: { '6,9': ['piano2', 16, 2, 'down'], '7,9': ['piano2', 16, 2, 'down'] },
    npcs: [
      { id: 'boss', x: 6, y: 2, dir: 'down', pal: PAL.boss, talk: () => directorTalk() },
      { id: 'segretaria', x: 2, y: 6, dir: 'right', pal: PAL.segretaria,
        text: () => game.flags.champion ? ['SEGRETARIA: Congratulazioni per la promozione! Le ho già ordinato i biglietti da visita.'] : ['SEGRETARIA: Il Direttore la riceve subito. Ha l\'agenda piena, sia breve.', 'SEGRETARIA: Le consiglio di passare prima dalla macchinetta del caffè.'] }
    ]
  }
};

// Testi e azioni dei tile interattivi
const TILE_TEXT = {
  K: () => useCoffee(),
  v: () => vendingShop(),
  B: ['Un classificatore pieno di pratiche. Alcune risalgono al 1987.'],
  C: () => say(['Sullo schermo: 147 email non lette.', 'Sullo schermo: "Aggiornamento in corso, non spegnere il PC" (da tre giorni).', 'Sullo schermo: un foglio Excel con 40.000 righe.', 'Sullo schermo: una videochiamata con la telecamera spenta.'][Math.floor(Math.random() * 4)]),
  D: ['Una scrivania ordinata. Troppo ordinata. Sospetto.'],
  Q: ['Il server ronza minaccioso. Una spia lampeggia: tutto bene, credo.'],
  w: ['Acqua fresca dal boccione. Ti senti idratato e produttivo.'],
  h: ['Un divanetto per gli ospiti. Comodo, ma non è il momento di riposare.'],
  T: ['Un tavolo condiviso. C\'è una tazza dimenticata da chissà quando.'],
  P: ['Una pianta finta. In dieci anni nessuno se n\'è mai accorto.'],
  R: ['Il bancone della reception. C\'è un campanello: DLIN!'],
  x: ['La stampante è inceppata. Come sempre.']
};
