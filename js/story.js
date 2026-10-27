'use strict';
// Storia: eventi, missioni e dialoghi principali.
const WARP_COND = {
  async exitHQ() {
    if (game.flags.dossier) return true;
    await sayAll([
      'VIGILANZA BADGE: Ehi, dove vai? Sei appena arrivato, oggi resti in sede.',
      'VIGILANZA BADGE: Se ti mandano in trasferta te lo diranno. E credimi, te ne accorgerai.'
    ]);
    return false;
  },
  async adDoor() {
    const need = ['controller', 'tax', 'legal', 'cfo'].filter(id => !game.flags['def_' + id]);
    if (!need.length) return true;
    await sayAll([
      'SEGRETARIA: Un momento! L\'Amministratore Delegato riceve solo chi ha l\'ok di tutta la Direzione.',
      `SEGRETARIA: Ti mancano ancora ${need.length === 1 ? 'un collega' : need.length + ' colleghi'}: Finance, Tax, Legal e Controlling devono approvare.`
    ]);
    return false;
  }
};

const Story = {
  async onEnter(mapId) {
    if (mapId === 'p5' && !game.flags.baldIntro) await Bald.intro();
    if (mapId === 'studio' && !game.flags.secretFound) await secretFound();
    if (mapId === 'sede2pt' && !game.flags.arrivedSede) {
      game.flags.arrivedSede = true;
      await sayAll([
        `Finalmente! Dopo cantieri, deviazioni e Terre Desolate, ${game.name} arriva alla SEDE #2.`,
        'Il viaggio è durato più di una riunione di budget. Il che è tutto dire.'
      ]);
    }
  },
  onWin: {
    async techlead() {
      Sound.sfx('fanfare');
      await say('Il badge di ' + game.name + ' ora apre anche il 2° piano, ASSISTENZA IT.');
    },
    async respit() {
      Sound.sfx('fanfare');
      await say('Il badge di ' + game.name + ' ora apre anche il 3° piano, RETE E LOGISTICA B2B.');
    },
    async netman() {
      await sayAll([
        'NETWORK MANAGER: Ottimo lavoro. Ora ti affido una missione delicata.',
        'NETWORK MANAGER: L\'AD vuole lanciare la nuova offerta FIBRA LATENZA ZERO. Serve il via libera di Sales, Marketing e Customer Care.',
        'NETWORK MANAGER: Lavorano tutti nella SEDE #2. Prendi questo DOSSIER e portalo lì.'
      ]);
      game.flags.dossier = true;
      Sound.sfx('fanfare');
      await say(`${game.name} riceve il DOSSIER DI LANCIO!`);
      await sayAll([
        'NETWORK MANAGER: Esci dalla reception al piano terra. Passa dalla Piazza delle Fontane, poi dal Bosco in Verticale, poi attraversa l\'Isola.',
        'NETWORK MANAGER: È lontana. Molto lontana. Porta caffè, contratti e pazienza. Soprattutto pazienza.'
      ]);
    },
    async kevin4() {
      await say('KEVIN si fa da parte. La porta dell\'Amministratore Delegato è proprio lì.');
    }
  },
  decorText(d) {
    const T = {
      pingpong: ['Un tavolo da ping pong. La rete è stata sostituita con un cavo di rete. Funziona lo stesso.'],
      calcetto: ['Un calcio balilla. Le stecche sono consumate da mille derby tra Sales e IT.'],
      desk3: ['Tre monitor accesi pieni di grafici colorati. Barre che salgono, linee che ondeggiano, cerchi che girano. Nessun numero: solo emoticon sorridenti.', 'Sotto la tastiera c\'è un post-it: "Le dashboard dicono cosa succede. Le persone dicono perché. Dott. B."'],
      chair: ['La sedia da ufficio più ergonomica che tu abbia mai visto. Meglio non sedersi: è chiaramente la sua.'],
      sign: ['Il cartello sulla sedia dice: TORNO SUBITO.', 'Sotto, scritto più piccolo: "Subito è un concetto relativo. Dott. B."'],
      sede: [`La sede di ${COMPANY} Vetro, acciaio e un badge che non funziona mai al primo colpo.`],
      torre: ['Una torre di vetro altissima con una guglia che punta al cielo. Dall\'ultimo piano, dicono, si vede tutta la città.'],
      vetro: ['Un grattacielo di vetro. Ci si specchiano le nuvole, i piccioni e i manager in pausa.'],
      bosco: ['Una torre ricoperta di alberi, balcone dopo balcone. Un bosco in verticale. Ogni tanto cade una foglia su un monopattino.'],
      palazzo: ['Un palazzo colorato del quartiere. Al piano terra c\'è un bar con dieci tipi di spritz e un solo tipo di Wi-Fi: lento.'],
      tram: ['Un vecchio tram arancione con le panche di legno. È fermo. Il tranviere dice che riparte "a breve".'],
      gru: ['Una gru gigante. Si muove piano piano, come un project plan in ritardo.'],
      board: () => studioBoard(),
      quadro: () => sayAll({
        ritratto: ['Un ritratto a olio del Dott. Baldinazzo, in posa da condottiero rinascimentale. Il ciuffo è dipinto con foglia d\'oro.', 'Targhetta: "Il Project Manager, olio su tela, autore anonimo (lui)".'],
        paddle: ['Una racchetta da ping pong placcata oro, appesa come un cimelio.', 'Targhetta: "Finale del -1, 47 a 45 ai vantaggi. Due ore e dodici minuti. Mai dimenticare."'],
        gioconda: ['Una Gioconda che, al posto delle mani, tiene un modem tondo. Il sorriso è più misterioso del solito.', 'Targhetta: "La Connessa". Il Wi-Fi si chiama "Leonardo_5G".'],
        notte: ['Un cielo stellato blu e giallo, con un\'antenna al posto del cipresso.', 'Targhetta: "Notte stellata con copertura 5G".'],
        diploma: ['Un diploma incorniciato: "Laurea in Gantt applicati. 110 e lode con bacio accademico e applauso della commissione".', 'Sotto, un secondo foglio: "Master in Scuse Eleganti per Uscire dalle Call. Con menzione."']
      }[d.v] || ['Un quadro.']),
      scritta: () => sayAll([`Sul muro, in lettere dorate: "${d.text}".`, 'Sotto, più piccolo, a matita: "e anche il caffè".']),
      tappeto: () => studioRug(),
      poltrona: () => sayAll(['Una poltrona chesterfield in pelle, con i bottoni capitonné. Profuma di cuoio e decisioni importanti.', 'Ti siedi un istante. Ti senti subito più autorevole. Ti rialzi prima che torni lui.']),
      lampada: () => sayAll(['Una lampada da lettura in ottone con il paralume verde, da biblioteca inglese.', 'Fa una luce calda che rende tutto più elegante. Anche i fogli Excel.']),
      mappamondo: () => sayAll(['Un mappamondo antico. Lo fai girare...', ['Si ferma sulla Sede #2. Il mappamondo ha senso dell\'umorismo.', 'Si ferma sull\'oceano Pacifico. Nessuna copertura. Il sogno di ogni PM in ferie.', 'Si ferma su Milano. C\'è un puntino rosso disegnato a penna: "-1, griglia".'][Math.floor(Math.random() * 3)]]),
      pendolo: () => { Sound.sfx('shake'); return sayAll(['Un orologio a pendolo alto fino al soffitto. Tic. Tac.', 'Segna sempre le 18:59. Il Dott. Baldinazzo dice che è l\'ora perfetta per una call "veloce".']); },
      trofei: () => sayAll(['Una vetrina di trofei.', 'Coppa d\'oro: "Campione di calcio balilla del -1, dieci anni di fila". Medaglia: "Miglior scusa per uscire da una call, edizione 2023".', 'Targa: "Project Manager dell\'anno". Più piccola: "Ciuffo dell\'anno". Più piccola ancora: "Ha risposto a tutte le email di agosto".']),
      appendiabiti: () => sayAll(['Un appendiabiti con tre giacche: due blu notte identiche e una bordeaux.', 'Su un biglietto: "Blu notte per i giorni normali. Bordeaux per le occasioni speciali. Tipo il giovedì."']),
      grammofono: () => { Sound.sfx('heal'); return sayAll(['Un grammofono d\'epoca. Appoggi la puntina...', 'Parte un valzer lento suonato da un\'orchestra di modem. È sorprendentemente bello.']); },
      carrello: () => sayAll(['Un carrello bar in ottone. Una caraffa di cristallo con l\'etichetta "Chinotto d\'annata, 2009".', 'Accanto, una ciotola di noccioline e un biglietto: "Solo per le riunioni che finiscono in orario. Quindi mai".']),
      cassaforte: () => studioSafe(),
      telefono: () => studioPhone(),
      macchina: () => sayAll(['Una macchina da scrivere con un foglio infilato. È l\'inizio di un\'autobiografia:', '"Capitolo 1. Il giorno in cui inventai la latenza zero. Era un martedì. Pioveva. Il Wi-Fi no."']),
      gatto: () => sayAll(['Il gatto della vigilanza dorme acciambellato sotto la poltrona.', 'Ha un collarino con una medaglietta: "CAPO DELLA SICUREZZA". Apre un occhio, ti riconosce, lo richiude. Approvato.'])
    }[d.k];
    if (typeof T === 'function') return T;
    return T ? () => sayAll(T) : null;
  },
  async studioBooks() {
    const books = [
      '"Il project management spiegato al mio gatto". Pieno di sottolineature.',
      '"Gantt: una storia d\'amore". Con dedica dell\'autore.',
      '"5G, 6G e oltre: manuale per sognatori".',
      '"Come dire di no a una riunione senza perdere amici". Volume 3.',
      '"KPI che contano davvero". Il segnalibro è a pagina 1, ma il libro sembra letto dieci volte.',
      '"La latenza zero e altre leggende metropolitane".',
      '"Excel avanzato per persone pazienti".',
      '"Il ciuffo perfetto: manutenzione ordinaria e straordinaria". Molto consumato.',
      '"Storia delle SIM: dal formato carta di credito alla eSIM".',
      '"L\'arte di arrivare in Sede #2". Ha solo un capitolo: "Non farlo".',
      '"Leadership gentile in 7 passi".',
      '"Agile, ma non troppo".',
      '"Ping pong e strategia aziendale". Con appunti a matita.',
      '"Le 100 migliori scuse per uscire da una call".',
      '"Fibra ottica: la luce che corre". Una dedica: "A chi aspetta l\'attivazione".'
    ];
    await say('Una libreria enorme, dal pavimento al soffitto. Prendi un libro a caso...');
    await say(books[Math.floor(Math.random() * books.length)]);
  }
};

async function secretFound() {
  game.flags.secretFound = true;
  Sound.sfx('fanfare');
  await sayAll([
    'Una stanza nascosta, calda e silenziosa. Profumo di libri e di caffè appena fatto.',
    `${game.name} ha trovato l'UFFICIO SEGRETO DEL DOTT. BALDINAZZO!`,
    'Tre monitor accesi pieni di dashboard, una libreria enorme, una poltrona in pelle, quadri antichi, una grande lavagna e un cartello: TORNO SUBITO.',
    'Il gatto della vigilanza dorme sotto la poltrona. Ti guarda come per dire: "Finalmente."',
    'Sulla scrivania c\'è un biglietto: "Se sei arrivato fin qui, sei curioso e testardo. Le qualità migliori di un collega. Prendi pure. Dott. B."'
  ]);
  game.bag.ricarica += 3; game.bag.cornetto += 2; game.bag.contratto += 5; game.money += 3000;
  Sound.sfx('coin');
  await say(`${game.name} riceve 3 RICARICHE GIGA, 2 CORNETTI, 5 CONTRATTI e 3000 buoni pasto!`);
}

// ---------- Piano terra ----------
async function receptTalk() {
  const f = game.flags;
  if (!f.starter) await sayAll([`RECEPTIONIST SORRISO: Benvenuto in ${COMPANY}! Tu devi essere ${game.name}, il nuovo assunto.`, 'RECEPTIONIST SORRISO: Sali con l\'ascensore al 5° piano: la Dott.ssa ONBOARDINI delle Risorse Umane ti aspetta.']);
  else if (!f.kit) await say('RECEPTIONIST SORRISO: Hai già ritirato la dotazione al Facility? È al 5° piano, accanto all\'HR.');
  else if (!f.dossier) await say('RECEPTIONIST SORRISO: Al -1 c\'è l\'area break con ping pong e calcio balilla. Ufficialmente è per le pause. Ufficiosamente è dove si decide tutto.');
  else if (!f.badge4) await say('RECEPTIONIST SORRISO: In Sede #2? Ti preparo un panino. Anzi due. Il viaggio è lungo.');
  else if (!f.champion) await say('RECEPTIONIST SORRISO: Il tuo badge ora apre il 4° piano. L\'AD ti aspetta!');
  else await say(`RECEPTIONIST SORRISO: Buongiorno, capo! Le preparo un caffè?`);
}

// ---------- 5° piano: HR e Facility ----------
function picLayer(sp) {
  return { draw() { frame(84, 18, 72, 72); ctx.drawImage(Sprites.mon(sp), 96, 30); } };
}

async function hrTalk() {
  const f = game.flags;
  if (!f.metHR) {
    await sayAll([
      `ONBOARDINI: Eccoti, ${game.name}! Benvenuto in ${COMPANY} Sono la Dott.ssa ONBOARDINI, Risorse Umane.`,
      'ONBOARDINI: Qui il lavoro lo fanno insieme a noi gli OFFICEMON: SIM, modem, cavi, graffette... oggetti che hanno preso vita.',
      'ONBOARDINI: Ogni nuovo assunto riceve il suo primo Officemon. Sul tavolo qui sotto ci sono tre cartelline.',
      'ONBOARDINI: SIMMETTA è di tipo SEGNALE, SIMBOX di tipo CARTA, ROUTERINO di tipo FIBRA. Scegli con cura!'
    ]);
    f.metHR = true;
    return;
  }
  if (!f.starter) { await say('ONBOARDINI: Allora? Scegli una delle cartelline sul tavolo!'); return; }
  healAll();
  Sound.sfx('heal');
  if (!f.kit) await say('ONBOARDINI: Ho rimesso in forma la tua squadra. Ora vai dal Facility, qui accanto: ti danno la dotazione di lavoro.');
  else if (!f.champion) await sayAll([
    'ONBOARDINI: Ho rimesso in forma la tua squadra.',
    'ONBOARDINI: Ricorda: la FIBRA batte il SEGNALE, il SEGNALE batte la CARTA e la CARTA batte la FIBRA. L\'UFFICIO è neutrale, come la Svizzera.'
  ]);
  else await say('ONBOARDINI: Il nostro nuovo CAPO REPARTO! Lo sapevo dal primo colloquio. Squadra rimessa in forma.');
}

async function folderTalk(n) {
  const S = SPECIES[n.sp], name = S.name.toUpperCase();
  if (game.flags.starter) { await say(`È la cartellina di ${name}. Resterà qui all'HR, al sicuro.`); return; }
  if (!game.flags.metHR) { await say('Tre cartelline personali. Meglio parlare prima con la Dott.ssa ONBOARDINI.'); return; }
  const pic = push(picLayer(n.sp));
  await say(S.desc);
  const yes = await ask(`Vuoi ${name}, l'Officemon di tipo ${TYPES[S.type].name}?`);
  pop(pic);
  if (!yes) return;
  game.flags.starter = n.sp;
  game.flags['taken_' + n.sp] = true;
  game.party.push(makeMon(n.sp, 5));
  Sound.sfx('fanfare');
  await say(`${game.name} riceve ${name}!`);
  await say(`ONBOARDINI: ${name} sembra già affezionato a te!`);
  const kev = npcById('kevin');
  const rsp = RIVAL_PICK[n.sp], rname = SPECIES[rsp].name.toUpperCase();
  kev.dir = 'left';
  await say(`KEVIN: Ehi, aspetta! Anch'io sono nuovo! Allora io prendo ${rname}!`);
  game.flags['taken_' + rsp] = true;
  Sound.sfx('fanfare');
  await say(`KEVIN riceve ${rname}!`);
  await say('KEVIN: Facciamo subito una prova sul campo. Vediamo chi è il vero talento!');
  const r = await startBattle({ trainer: TRAINERS.rival1, canLose: true });
  if (r === 'win') await say('KEVIN: Accidenti! La prossima volta vinco io, vedrai!');
  else await say('KEVIN: Ah-ha! Lo sapevo, sono nato per questo lavoro!');
  healAll();
  Sound.sfx('heal');
  await say('ONBOARDINI: Che energia! Vi ho rimesso in sesto entrambi. Prendete anche questi.');
  game.bag.contratto += 5;
  game.bag.caffe += 3;
  Sound.sfx('fanfare');
  await say(`${game.name} riceve 5 CONTRATTI e 3 CAFFÈ!`);
  await sayAll([
    'ONBOARDINI: Con i CONTRATTI potete assumere gli Officemon selvatici. Indeboliteli prima di proporre la firma!',
    'ONBOARDINI: Ora passate dal Facility, nella stanza qui accanto: vi danno PC, gadget e kit per lo smart working.',
    `KEVIN: Ci vediamo ai piani bassi, ${game.name}! Io corro, tu cammina.`
  ]);
  await fadeOut(10);
  game.flags.rival1 = true;
  await fadeIn(10);
}

async function facilityTalk() {
  const f = game.flags;
  if (!f.starter) { await sayAll(['SIG. CABLAGGI: Facility, buongiorno. Prima passa dall\'HR, qui a sinistra. Senza contratto niente dotazione.']); return; }
  if (!f.kit) {
    await sayAll([
      `SIG. CABLAGGI: Ah, ${game.name}! Il nuovo assunto. Ecco la tua dotazione di lavoro.`,
      'SIG. CABLAGGI: Un PC portatile con 37 aggiornamenti in attesa. Una felpa aziendale taglia unica. Una borraccia che non perde. Quasi.',
      'SIG. CABLAGGI: Il kit per lo smart working: cuffie con microfono, mouse, zaino e un cuscino lombare.',
      'SIG. CABLAGGI: E queste: SNEAKERS AZIENDALI. Tieni premuto il tasto B per correre nei corridoi. Non dirlo alla sicurezza.'
    ]);
    f.kit = true;
    Sound.sfx('fanfare');
    await say(`${game.name} riceve la DOTAZIONE DI LAVORO e le SNEAKERS AZIENDALI!`);
    await sayAll([
      'SIG. CABLAGGI: Il tuo badge ora apre il -1, con l\'area break, e il 1° piano, la Software Factory.',
      'SIG. CABLAGGI: Al 1° piano il TECH LEAD ti aspetta per l\'onboarding. Batti lui e il badge si abilita per i piani successivi.'
    ]);
    return;
  }
  const lines = [
    'SIG. CABLAGGI: Se la sedia cigola, apri un ticket. Se il ticket cigola, chiama me.',
    'SIG. CABLAGGI: Abbiamo cambiato tutte le lampadine con quelle a LED. Ora sono tutti più svegli. Anche troppo.',
    'SIG. CABLAGGI: Il -1 l\'abbiamo progettato noi. Ci sono più cose lì sotto di quante pensi.'
  ];
  await say(lines[Math.floor(Math.random() * lines.length)]);
}

// ---------- 4° piano e AD ----------
async function segretariaTalk() {
  const need = ['controller', 'tax', 'legal', 'cfo'].filter(id => !game.flags['def_' + id]);
  if (need.length) await say(`SEGRETARIA: L'Amministratore Delegato riceve solo con l'ok di Finance, Tax, Legal e Controlling. Ti ${need.length === 1 ? 'manca un ok' : 'mancano ' + need.length + ' ok'}.`);
  else if (!game.flags.champion) await say('SEGRETARIA: Hai tutti gli ok. L\'AD ti riceve subito. La porta è qui accanto.');
  else await say('SEGRETARIA: Complimenti per la promozione! I biglietti da visita nuovi arrivano tra sei settimane lavorative.');
}

async function adTalk() {
  const n = npcById('ad');
  n.dir = 'down';
  if (!game.flags.champion) {
    await sayAll([
      `AD: Benvenuto. Quindi sei tu ${game.name}. Il collega di cui parla tutta l'azienda.`,
      'AD: Hai portato il via libera della Sede #2, hai l\'ok della Direzione. Resta una cosa sola.',
      'AD: Dimostrami che sai guidare una squadra quando la rete è sotto pressione. Lotta!'
    ]);
    const r = await startBattle({ trainer: TRAINERS.ad, boss: true });
    if (r !== 'win') return;
    game.flags.champion = true;
    game.flags.def_ad = true;
    await sayAll([
      'AD: In tanti anni non avevo mai visto una squadra così affiatata.',
      `AD: L'offerta FIBRA LATENZA ZERO parte domani. E da oggi ${game.name} è il nuovo CAPO REPARTO di ${COMPANY}!`,
      'AD: Ah, un\'ultima cosa. Se incontri il Dott. Baldinazzo, ringrazialo da parte mia. Senza i suoi consigli saresti ancora alla reception.'
    ]);
    Sound.sfx('fanfare');
    await credits();
    await say('Ricordati di salvare dal menu START. L\'AD accetta rivincite e il Dott. Baldinazzo continua a girare per l\'azienda!');
  } else if (await ask('AD: Già di ritorno? Vuoi una revisione di metà anno? Intendo... una rivincita.')) {
    const r = await startBattle({ trainer: TRAINERS.adRematch, boss: true });
    if (r === 'win') await say('AD: Va bene, va bene. Ti regalo la mia penna stilografica. Quella buona.');
  } else {
    await say('AD: Allora torna al lavoro, CAPO REPARTO.');
  }
}

// ---------- Sede #2 ----------
async function recept2Talk() {
  await say('RECEPTIONIST DELLA SEDE #2: Benvenuto in Sede #2! Sales, Marketing e Customer Care sono al primo piano. Le scale sono lì in alto.');
  if (game.party.length && await ask('RECEPTIONIST DELLA SEDE #2: Il viaggio ti ha distrutto, vero? Vuoi un caffè per la squadra?')) {
    healAll();
    game.heal = { map: curMapId, x: player.x, y: player.y, dir: player.dir };
    Sound.sfx('heal');
    await flashScreen();
    await say('RECEPTIONIST DELLA SEDE #2: Ecco fatto. Torna quando vuoi: qui il caffè è gratis, il Wi-Fi un po\' meno.');
  }
}

async function headBattle(id) {
  if (game.flags['def_' + id]) return true;
  const t = TRAINERS[id];
  const r = await startBattle({ trainer: t });
  if (r === 'win') { game.flags['def_' + id] = true; return true; }
  return false;
}

async function salesTalk() {
  const f = game.flags, q = f.q || 0;
  if (!f.dossier) { await say('DIRETTRICE SALES QUOTA: Ciao! Se non hai un appuntamento, ripassa. Se hai un appuntamento, ripassa lo stesso.'); return; }
  if (q === 0) {
    await sayAll([
      'DIRETTRICE SALES QUOTA: Il dossier di lancio? Arrivato dalla sede principale a piedi? Che coraggio.',
      'DIRETTRICE SALES QUOTA: Il via libera lo firmo volentieri. Ma prima mi serve la BROCHURE dell\'offerta. La prepara Marketing, nella stanza in mezzo.'
    ]);
    f.q = 1;
  } else if (q < 3) {
    await say('DIRETTRICE SALES QUOTA: Hai la brochure? No? Marketing è nella stanza in mezzo. Non posso vendere quello che non vedo.');
  } else if (q === 3) {
    await sayAll([
      'DIRETTRICE SALES QUOTA: Il Customer Care vuole i volumi? Giusto, così si preparano.',
      'DIRETTRICE SALES QUOTA: Ecco le PREVISIONI DI VENDITA. Ottimiste, come sempre.'
    ]);
    Sound.sfx('fanfare');
    await say(`${game.name} riceve le PREVISIONI DI VENDITA!`);
    f.q = 4;
  } else if (q < 6) {
    await say(q === 4 ? 'DIRETTRICE SALES QUOTA: Porta le previsioni al Customer Care, nell\'ultima stanza a destra.' : 'DIRETTRICE SALES QUOTA: E la brochure? Marketing ci sta ancora lavorando?');
  } else if (q === 6) {
    await sayAll([
      'DIRETTRICE SALES QUOTA: La brochure! Finalmente. "Fibra Latenza Zero: veloce come un\'idea." Mi piace.',
      'DIRETTRICE SALES QUOTA: Prima di firmare, però, voglio vedere come gestisci la pressione. Facciamo una lotta da fine trimestre!'
    ]);
    if (!(await headBattle('sales'))) return;
    f.q = 7;
    f.badge4 = true;
    await sayAll([
      'DIRETTRICE SALES QUOTA: Ecco il VIA LIBERA firmato da Sales, Marketing e Customer Care.',
      'DIRETTRICE SALES QUOTA: E questo è il BADGE per il 4° piano. Torna in sede principale: l\'AD ti aspetta in Direzione.'
    ]);
    Sound.sfx('fanfare');
    await say(`${game.name} riceve il VIA LIBERA e il BADGE DEL 4° PIANO!`);
    await say('Il viaggio di ritorno è lungo quanto quello di andata. Ma ormai conosci la strada.');
  } else {
    await say('DIRETTRICE SALES QUOTA: Vai dall\'AD! E quando lanciamo l\'offerta, ricordati che le vendite le ho fatte io.');
  }
}

async function mktTalk() {
  const f = game.flags, q = f.q || 0;
  if (q === 0) { await say('HEAD OF MARKETING BRAND: Ciao! Se ti serve qualcosa, passa prima da Sales. Qui lavoriamo su brief, non su richieste a voce.'); return; }
  if (q === 1) {
    await say('HEAD OF MARKETING BRAND: La brochure per Sales? Certo. Ma prima dimostrami che hai la stoffa del brand ambassador!');
    if (!(await headBattle('mkt'))) return;
    await sayAll([
      'HEAD OF MARKETING BRAND: La brochure è quasi pronta. Mi mancano solo i FEEDBACK DEI CLIENTI.',
      'HEAD OF MARKETING BRAND: Li ha il Customer Care, nell\'ultima stanza a destra. Senza la voce del cliente non scrivo una riga.'
    ]);
    f.q = 2;
  } else if (q < 5) {
    await say('HEAD OF MARKETING BRAND: Aspetto ancora i feedback del Customer Care. Il claim è pronto, mi manca la verità.');
  } else if (q === 5) {
    await sayAll([
      'HEAD OF MARKETING BRAND: I feedback! "Veloce", "stabile", "finalmente". Perfetto.',
      'HEAD OF MARKETING BRAND: Ecco la BROCHURE dell\'offerta FIBRA LATENZA ZERO. Portala a Sales.'
    ]);
    Sound.sfx('fanfare');
    await say(`${game.name} riceve la BROCHURE!`);
    f.q = 6;
  } else {
    await say('HEAD OF MARKETING BRAND: La campagna partirà ovunque: tram, metro, social. Anche sul tram arancione fermo da cent\'anni.');
  }
}

async function ccTalk() {
  const f = game.flags, q = f.q || 0;
  if (q < 2) { await say('HEAD OF CUSTOMER CARE NPS: Buongiorno, la sua visita è importante per noi. Torni quando ha un motivo preciso.'); return; }
  if (q === 2) {
    await say('HEAD OF CUSTOMER CARE NPS: I feedback dei clienti per Marketing? Li custodisco come un tesoro. Prima, una lotta!');
    if (!(await headBattle('cc'))) return;
    await sayAll([
      'HEAD OF CUSTOMER CARE NPS: Te li darei subito. Ma prima mi servono i VOLUMI di attivazione previsti da Sales.',
      'HEAD OF CUSTOMER CARE NPS: Se arriva un\'ondata di chiamate, i miei operatori devono saperlo prima. Torna da Sales.'
    ]);
    f.q = 3;
  } else if (q === 3) {
    await say('HEAD OF CUSTOMER CARE NPS: Aspetto i volumi da Sales, nella prima stanza a sinistra.');
  } else if (q === 4) {
    await sayAll([
      'HEAD OF CUSTOMER CARE NPS: Le previsioni! Bene, organizzo i turni.',
      'HEAD OF CUSTOMER CARE NPS: Ecco i FEEDBACK DEI CLIENTI. Portali a Marketing, nella stanza in mezzo.'
    ]);
    Sound.sfx('fanfare');
    await say(`${game.name} riceve i FEEDBACK DEI CLIENTI!`);
    f.q = 5;
  } else {
    await say('HEAD OF CUSTOMER CARE NPS: Il segreto del customer care? Ascoltare. E avere sempre un caffè a portata di mano.');
  }
}

// ---------- Ufficio segreto: oggetti interattivi ----------
async function studioBoard() {
  await say('Una grande lavagna: "PROGETTI TOP SECRET DEL DOTT. B." Ogni progetto ha un nome in codice, una barra colorata e uno stato scritto a pennarello.');
  const list = BALD_PROJECTS.map(p => `${p.code}  ${projectStatus(p)}`);
  let i = 0;
  for (;;) {
    const k = await choose([...list, 'CHIUDI'], { cancel: list.length, start: i, size: 5, lh: 9, x: 40, y: 2, w: 196 });
    if (k === list.length) break;
    i = k;
    const p = BALD_PROJECTS[k];
    await say(`PROGETTO ${p.code.toUpperCase()} (${projectStatus(p)}): ${p.note}`);
  }
  await say('In fondo alla lavagna, scritto in piccolo: "Prossima revisione di avanzamento: quando torno. Cioè subito."');
}

async function studioRug() {
  if (game.flags.rugNote) { await say('Un tappeto persiano rosso e oro. Sotto l\'angolo sollevato non c\'è più niente.'); return; }
  game.flags.rugNote = true;
  await sayAll(['Un tappeto persiano rosso e oro. Un angolo è leggermente sollevato...', 'Sotto c\'è un post-it: "Se hai sollevato il tappeto, sei curioso come me. Tieni, offro io. Dott. B."']);
  game.bag.espresso += 3;
  Sound.sfx('fanfare');
  await say(`${game.name} trova 3 ESPRESSI DOPPI!`);
}

async function studioSafe() {
  await say('Una piccola cassaforte di ghisa con una rotella dorata.');
  if (game.flags.safeOpen) { await say('È aperta e vuota. Dentro è rimasto solo un biglietto: "Ricetta del mio caffè: segreta anche per me".'); return; }
  if (!await ask('Provi a indovinare la combinazione?')) return;
  const codes = ['0000', '1234', 'LATENZA ZERO', 'CIUFFO'];
  const k = await choose(codes, { cancel: -1 });
  if (k === 3) {
    game.flags.safeOpen = true;
    Sound.sfx('catch');
    await sayAll(['Clic! La cassaforte si apre.', 'Dentro: una pila di buoni pasto e un biglietto: "Pensavi ci fossero gioielli? Il vero tesoro è il team. E questi buoni pasto."']);
    game.money += 5000; game.bag.ricarica += 2;
    Sound.sfx('coin');
    await say(`${game.name} riceve 5000 buoni pasto e 2 RICARICHE GIGA!`);
  } else if (k >= 0) {
    Sound.sfx('bump');
    await say(['Niente. Troppo facile, la sua password non sarebbe mai così banale.', 'Niente. Forse la combinazione ha a che fare con la cosa a cui tiene di più.', 'Niente. Pensa: cosa sistema ogni mattina allo specchio?'][Math.min(k, 2)]);
  }
}

async function studioPhone() {
  await say('Un telefono rosso, con un solo tasto. Sotto c\'è scritto: "Linea diretta".');
  if (!await ask('Sollevi la cornetta?')) return;
  Sound.sfx('alert');
  const lines = [
    ['DRIIIN... Pronto?', 'DOTT. BALDINAZZO: Ah, sei tu! Lo sapevo che l\'avresti trovato. Bello il mio ufficio, eh?', 'DOTT. BALDINAZZO: Non toccare la poltrona. Scherzo, siediti pure. Ma non dirlo al gatto.', 'DOTT. BALDINAZZO: Ora scusa, sono in riunione. Anzi, sono in tre riunioni. Ciao!'],
    ['TUUU... TUUU...', 'Segreteria: "Ha chiamato il Dott. Baldinazzo. Sono impegnato a fare qualcosa di molto figo. Lasci un messaggio dopo il bip. Biiip."'],
    ['DRIIIN... Dall\'altra parte qualcuno respira, poi una voce: "Il ping pong del -1 è libero alle 16:30. Passo e chiudo."']
  ];
  await sayAll(lines[Math.floor(Math.random() * lines.length)], { portrait: '#1c2440' });
}
