'use strict';
// Situazioni del Dott. Baldinazzo, parte 1. Ogni voce: [cosa sta facendo, cosa dice].
// La prima parte si legge dopo "Il Dott. Baldinazzo ...".
const BALD_TEXT = {};

BALD_TEXT.amaca = [
  ['dorme su un\'amaca tesa tra due colonne portanti', 'Non sto dormendo, sto facendo un deep dive sul riposo. Il backlog dei sogni era pienissimo.'],
  ['sonnecchia su un\'amaca, con la pochette usata come mascherina', 'Modalità aereo attivata. Anche per il cervello. Nessuna notifica, nessun ping.'],
  ['dondola su un\'amaca appesa tra due rack', 'Sto testando la stabilità dei rack. Se reggono me, reggono anche il traffico di Capodanno.'],
  ['riposa su un\'amaca con un portatile acceso sulla pancia', 'Il portatile fa la build, io faccio da dissipatore. Lavoro di squadra.'],
  ['dorme su un\'amaca e russa a ritmo di modem', 'Russo a 56k. È un omaggio ai vecchi tempi, quando internet faceva rumore.'],
  ['si dondola su un\'amaca, sorridendo a occhi chiusi', 'Sto visualizzando il Gantt perfetto. Tutte le barre verdi. Lasciami sognare ancora un minuto.'],
  ['dorme su un\'amaca con un cartello "Non disturbare, sto pensando"', 'Il cartello dice il vero. Penso meglio in orizzontale: il sangue arriva prima al cervello. Latenza ridotta.'],
  ['riposa su un\'amaca fatta di cavi di rete intrecciati', 'L\'ho fatta con i cavi avanzati dal cablaggio del terzo piano. Categoria 6. Comodissima.'],
  ['fa un pisolino su un\'amaca, con un timer da cucina sul petto', 'Power nap da diciotto minuti esatti. Il diciannovesimo minuto è una riunione.'],
  ['dorme su un\'amaca e parla nel sonno: "...rilascio in produzione venerdì..."', 'Cosa? Chi? Venerdì? No, mai di venerdì. Stavo avendo un incubo.'],
  ['si dondola su un\'amaca guardando le stelle dipinte sul soffitto', 'Ho fatto dipingere il soffitto con le costellazioni. Quella è l\'Orsa Maggiore, quella è la Roadmap Minore.'],
  ['dorme su un\'amaca con un gatto addormentato sulla giacca', 'Il gatto è della vigilanza. Fa il turno di notte. Adesso recupera, come me.'],
  ['riposa su un\'amaca con le scarpe perfettamente allineate sotto', 'L\'ordine è importante. Anche quando dormo, le scarpe devono essere pronte per una call improvvisa.'],
  ['sonnecchia su un\'amaca e ogni tanto alza il pollice nel sonno', 'Approvo. Non so cosa, ma approvo. Il mio subconscio è molto collaborativo.']
];

BALD_TEXT.libro = [
  ['legge "Guerra e Pace" in edizione tascabile', 'Mi serve per capire le riunioni di budget. Sono lunghe uguali, ma con meno pace.'],
  ['legge un libro sui diagrammi di Gantt con la copertina dorata', 'È un regalo che mi sono fatto per il compleanno del progetto. Il progetto non lo sa ancora.'],
  ['legge un manuale di telecomunicazioni del 1987', 'Qui parlano del fax come del futuro. Ogni tanto bisogna ricordarsi da dove veniamo.'],
  ['sfoglia un libro di poesie sul 5G', '"O onda millimetrica, che attraversi i muri ma non le porte tagliafuoco..." Bellissima. L\'ho scritta io.'],
  ['legge in piedi, girando le pagine a velocità impressionante', 'Lettura veloce. Duecento pagine al minuto. Il trucco è saltare le note a piè di pagina.'],
  ['legge un giallo intitolato "Chi ha rubato la banda?"', 'L\'assassino è il ripetitore Wi-Fi. Lo sapevo dalla prima pagina. Era sempre in mezzo.'],
  ['legge un libro capovolto con aria concentrata', 'Sto allenando la mia capacità di adattamento. E poi, visto così, il capitolo sul budget è molto più ottimista.'],
  ['legge un dizionario di acronimi aziendali', 'Sono arrivato alla lettera K. KPI, KYC, KO. Domani attacco la L: Latenza.'],
  ['legge un fumetto nascosto dentro un report trimestrale', 'Il report l\'ho già letto. Il fumetto è più realistico.'],
  ['legge un libro di ricette per il pranzo in ufficio', 'Ricetta numero uno: insalata di riso con gli avanzi della riunione. Ricetta numero due: idem, ma tiepida.'],
  ['legge un romanzo d\'amore tra un router e una SIM', 'Si conoscono in negozio, si separano per la portabilità, si ritrovano in roaming. Piango ogni volta.'],
  ['legge un trattato di filosofia con gli occhiali sulla punta del naso', 'Socrate diceva "so di non sapere". Lo diceva anche il mio primo product owner, ma in riunione.'],
  ['legge il manuale d\'uso della macchinetta del caffè', 'Sessantadue pagine. Il caffè resta lo stesso, ma ora so che esiste l\'opzione "lungo con amore".'],
  ['legge un libro sulla gestione del tempo, controllando l\'orologio ogni tre secondi', 'Capitolo uno: non guardare l\'orologio. Ci sto lavorando. Bel orologio, comunque, vero?']
];

BALD_TEXT.tiro = [
  ['spara a un bersaglio con un fucile da tiro a segno', 'Centro perfetto. Come le stime del mio ultimo progetto. Che non erano perfette, ma il bersaglio non lo sa.'],
  ['tira al bersaglio con una pistola ad aria compressa', 'Ogni colpo è una deadline. Le centro tutte. Quasi tutte. Ok, questa no.'],
  ['si allena al tiro a segno con la concentrazione di un campione olimpico', 'Respiro, mira, scatto. È lo stesso metodo che uso per rispondere alle email del lunedì.'],
  ['spara a un bersaglio con disegnata una clessidra', 'La clessidra rappresenta il tempo perso in riunioni inutili. Oggi la prendo in pieno.'],
  ['tira al bersaglio con un occhio chiuso e l\'altro sorridente', 'Mai prendersi troppo sul serio. Tranne quando si mira. Lì, serietà assoluta.'],
  ['colpisce il centro del bersaglio senza nemmeno guardare', 'Anni di allenamento. Anche a non guardare le notifiche delle chat. Stesso principio.'],
  ['spara con un fucile di precisione a un bersaglio a forma di bug', 'Bug individuato, bug eliminato, ticket chiuso. Se solo fosse sempre così facile.'],
  ['si esercita al tiro dinamico, ruotando su se stesso', 'Agilità. Se il mercato cambia direzione, bisogna saper mirare anche girandosi.'],
  ['spara a un bersaglio con scritto "SCOPE CREEP"', 'Lo scope creep è il nemico numero uno del project manager. Va fermato subito. Bang.'],
  ['tira al bersaglio con la giacca perfettamente abbottonata', 'La giacca non si slaccia mai. È una regola di stile e di sicurezza.'],
  ['spara a un bersaglio e poi soffia sulla canna, con stile', 'Questo gesto non serve a niente. Ma fa tantissima scena. Come certe slide.'],
  ['pratica il tiro a segno in un poligono portatile', 'Il poligono si monta in quattro minuti. Il manuale dice venti. Ho ottimizzato il processo.'],
  ['spara a un modulo da compilare in triplice copia appeso al bersaglio', 'La burocrazia si combatte così: un colpo per ogni copia. Mi manca solo l\'originale.'],
  ['tira tre colpi formando un piccolo cuore sul bersaglio', 'Era un test di precisione. Il cuore è venuto da solo. Il cuore viene sempre da solo.']
];

BALD_TEXT.bolle = [
  ['fa le bolle di sapone con aria assorta', 'Ogni bolla è un\'idea. Alcune volano lontano, altre scoppiano subito. Come nei brainstorming.'],
  ['soffia bolle di sapone giganti', 'Questa è grande come il budget del marketing. E scoppia uguale.'],
  ['fa bolle di sapone a forma di cubo', 'Il segreto è un telaio quadrato. E tanta fiducia nella geometria.'],
  ['fa le bolle di sapone mentre canticchia', 'Le bolle rilassano. Le dashboard un po\' meno. Alterno le due cose.'],
  ['soffia bolle di sapone verso il soffitto contando ad alta voce', 'Quarantadue bolle. Nuovo record del piano. Lo aggiungo ai KPI.'],
  ['fa le bolle di sapone con un ventilatore da scrivania', 'Automazione. Perché soffiare a mano quando c\'è un processo che lo fa per te?'],
  ['fa bolle di sapone che riflettono i colori dei monitor', 'Ogni bolla ha dentro un pezzetto di dashboard. Bellissimo e totalmente inutile.'],
  ['soffia bolle dentro altre bolle', 'Bolla dentro bolla. Come un progetto dentro un programma dentro un portafoglio. Ma più colorato.'],
  ['fa le bolle di sapone con una graffetta piegata ad anello', 'Mai sottovalutare una graffetta. È l\'utensile più versatile dell\'ufficio. Dopo me.'],
  ['fa bolle di sapone che volano tutte nella stessa direzione', 'Si chiama allineamento. Ci ho messo tre workshop. Con le persone ce ne vogliono di più.'],
  ['fa rimbalzare le bolle di sapone sul palmo di un guanto di cotone', 'Con il guanto di cotone le bolle rimbalzano. Con le scadenze, purtroppo, no.'],
  ['fa le bolle di sapone e saluta ogni bolla che si allontana', 'Ciao bolla. Buon viaggio. Attenta ai condizionatori.'],
  ['fa bolle di sapone profumate alla vaniglia', 'Il profumo aiuta la concentrazione. E copre l\'odore del toner bruciato.'],
  ['fa bolle di sapone mentre alcuni colleghi lo guardano incantati', 'Non c\'è niente da vedere, è solo sapone. Va bene, forse sono anche bravo.']
];

BALD_TEXT.palco = [
  ['parla su un palco davanti a una folla di colleghi', '...e quindi ricordate: la latenza è temporanea, la qualità è per sempre! Grazie, grazie.'],
  ['tiene un keynote sul futuro della fibra', 'Il futuro è luce che viaggia nel vetro. Il presente è un caffè. Partiamo dal presente.'],
  ['presenta i risultati trimestrali con grande entusiasmo', 'Abbiamo superato il target del 12%. L\'applauso è per voi, non per me. Va bene, anche un po\' per me.'],
  ['fa un discorso motivazionale con il microfono in mano', 'Siamo una squadra! E una squadra si vede quando il server cade di venerdì alle 18.'],
  ['parla dal palco e fa ridere tutta la platea', 'Qual è il colmo per un router? Perdere la connessione con i sentimenti. Funziona sempre.'],
  ['presenta un nuovo processo aziendale con una slide sola', 'Una slide. Una. Ho tolto le altre 47. La gente piange di gioia.'],
  ['tiene un talk dal titolo "Il project manager gentile"', 'Si può gestire un progetto senza urlare. Servono pazienza, ascolto e un ottimo foglio Excel.'],
  ['si intervista da solo sul palco, cambiando voce', 'Dott. Baldinazzo, come fa a essere così bravo? Domanda difficile. Diciamo talento e tanto caffè.'],
  ['ringrazia dal palco ogni singolo collega per nome', 'Ricordare i nomi è il primo KPI di un buon leader. Il secondo è ricordarsi i compleanni.'],
  ['annuncia dal palco la nuova offerta, tra gli applausi', 'Non posso dire il prezzo. Posso dire che è bello. Molto bello. Applaudite pure.'],
  ['fa una presentazione con puntatore laser e tempismo perfetto', 'Il segreto è finire due minuti prima del previsto. Il pubblico ti amerà per sempre.'],
  ['guida dal palco una sessione di stretching per tutto l\'ufficio', 'Braccia in alto! E giù! Più energia di uno stand-up del lunedì!'],
  ['parla sul palco con un riflettore che sembra seguirlo ovunque', 'Non li ho chiesti io, i riflettori. Mi seguono. Sarà un problema tecnico. Credo.'],
  ['conclude un discorso sul palco con un inchino impeccabile', 'Grazie a tutti. Le slide sono nella cartella condivisa "Slide definitive v7 ultimo vero".']
];

BALD_TEXT.ballo = [
  ['balla con le cuffie col filo, a occhi chiusi', 'Cuffie col filo. Il Bluetooth è per chi ha paura dei nodi. Io i nodi li affronto.'],
  ['balla il moonwalk nel corridoio', 'È una tecnica di project management: sembra che vai avanti, invece torni a rivedere i requisiti.'],
  ['balla con le cuffie e mima un assolo di chitarra elettrica', 'Questo assolo è dedicato al server di posta. Ha retto tutto il trimestre.'],
  ['balla e il filo delle cuffie disegna cerchi nell\'aria', 'Il filo è lungo tre metri. Così posso ballare e restare collegato al PC. Sempre online.'],
  ['fa passi di breakdance accanto alle scrivanie', 'Una volta ho vinto una gara di breakdance. Il premio era una chiavetta USB da 128 MB. Ce l\'ho ancora.'],
  ['balla il tango da solo, con eleganza', 'Il tango è come una trattativa: un passo avanti, uno indietro, e alla fine si chiude.'],
  ['balla con le cuffie e ogni tanto fa una piroetta', 'Sto ascoltando la musica d\'attesa del customer care in versione remix. È una hit.'],
  ['balla e canticchia sottovoce', 'Questa canzone l\'ho scritta io. Si chiama "Banda Larga, Cuore Stretto". Esce venerdì.'],
  ['balla la disco anni \'70 con un paio di cuffie enormi', 'Le cuffie sono vintage. Il groove è eterno.'],
  ['balla con movimenti robotici', 'Danza robotica. Un omaggio a tutti i chatbot che lavorano senza pause.'],
  ['balla con le cuffie e alza le braccia a tempo', 'Quando il deploy va bene, si balla. Oggi il deploy è andato benissimo.'],
  ['balla il valzer con una sedia da ufficio', 'La sedia ha le rotelle. È la partner ideale: segue ogni mio passo.'],
  ['balla schioccando le dita a tempo', 'Il ritmo è tutto, nella musica e nei rilasci. Sprint, sprint, release. Cha cha cha.'],
  ['balla con le cuffie collegate a un vecchio walkman', 'Musicassetta, lato B. Le canzoni migliori stanno sempre nel lato B, come i requisiti nascosti.']
];

BALD_TEXT.chimica = [
  ['fa esperimenti con delle ampolle fluorescenti che ogni tanto esplodono', 'Tranquillo, è tutto sotto controllo. Più o meno. Diciamo sotto supervisione.'],
  ['mescola liquidi verdi e rosa che brillano nella penombra', 'Sto creando il caffè definitivo. Per ora brilla e fa paura. Siamo sulla buona strada.'],
  ['fa reagire due ampolle con un piccolo botto', 'Pfff! Ecco. Quella era la reazione del management al budget proposto.'],
  ['scalda un\'ampolla che emette una luce verde', 'Radiazioni? No, no. È solo entusiasmo concentrato. Molto concentrato.'],
  ['fa esperimenti con occhiali protettivi e camice sopra l\'abito', 'La sicurezza prima di tutto. Lo stile subito dopo. Ma di poco.'],
  ['versa una goccia in un\'ampolla che cambia colore cinque volte', 'Ogni colore è una fase del progetto. Il verde è il collaudo. Il viola è "ci risentiamo".'],
  ['crea una nuvoletta colorata che profuma di fragola', 'Volevo rendere le riunioni più piacevoli. Ho inventato la nebbia alla fragola.'],
  ['fa esplodere un\'ampolla e resta perfettamente pettinato', 'Il ciuffo è resistente alle esplosioni. È una certificazione ISO che ho solo io.'],
  ['studia una sostanza fluorescente al microscopio', 'Ho isolato la molecola della motivazione del lunedì. È piccolissima, ma c\'è.'],
  ['immerge una vecchia SIM in un\'ampolla piena di liquido blu', 'Non provateci a casa. Sto cercando di estrarre i giga avanzati. Sono tantissimi, nessuno li usa.'],
  ['distilla un liquido dorato goccia dopo goccia', 'Distillato di brainstorming. Dieci ore di riunione per una goccia di idea buona.'],
  ['fa esperimenti con ampolle che fumano di tutti i colori', 'Questo fumo è innocuo. Ha anche l\'approvazione della compliance. Credo.'],
  ['fa saltare il tappo di un\'ampolla fino al soffitto', 'Bel colpo, eh? Quel tappo era l\'ultimo ostacolo prima del rilascio.'],
  ['mescola elementi chimici canticchiando la tavola periodica', 'Idrogeno, elio, litio... latenzio. Il latenzio l\'ho scoperto io. Ha valore zero.']
];

BALD_TEXT.pingpong = [
  ['gioca a ping pong al -1 con una concentrazione assoluta', 'Il ping pong è come il networking: ping, pong, risposta in pochi millisecondi.'],
  ['gioca a ping pong e risponde a una schiacciata senza voltarsi', 'Riflessi da project manager. Le richieste urgenti arrivano sempre alle spalle.'],
  ['gioca a ping pong con la racchetta nella mano sinistra', 'Sono destro. Ma così do un po\' di vantaggio. È una questione di fair play.'],
  ['gioca a ping pong e tiene il punteggio a voce alta', 'Dieci a otto. Il mio avversario dice nove a otto. Apriamo un ticket.'],
  ['gioca a ping pong in giacca e non suda', 'Movimenti minimi, massima efficienza. Lean management applicato allo sport.'],
  ['gioca a ping pong e fa una battuta a effetto impossibile', 'Si chiama "battuta Gantt": parte dritta, poi va in ritardo e cambia direzione.'],
  ['gioca a ping pong con un collega e ride di gusto', 'Il ping pong è il miglior team building. Costa poco e nessuno deve preparare slide.'],
  ['gioca a ping pong recuperando ogni pallina', 'Non ne perdo una. Come le email importanti. Le altre le perdo volentieri.'],
  ['gioca a ping pong commentando ogni scambio come un telecronista', 'Ed ecco il dritto incrociato! Che classe! Che eleganza! Che ciuffo!'],
  ['gioca a ping pong con due palline insieme', 'Multitasking. Una pallina è il progetto A, l\'altra il progetto B. Per ora nessuna è caduta.'],
  ['gioca la finale di ping pong per decidere chi paga i caffè', 'In palio ci sono dodici caffè e l\'onore del piano. Soprattutto i caffè.'],
  ['gioca a ping pong e saluta i colleghi tra un punto e l\'altro', 'Ciao! Ciao anche a te! Scusa, punto. Ciao di nuovo!'],
  ['gioca a ping pong e lascia vincere l\'ultimo punto all\'avversario', 'Shh. Il mio collega ha avuto una settimana difficile. Un punto non costa niente, un sorriso vale tanto.'],
  ['gioca a ping pong al -1 con un\'eleganza fuori dal comune', 'Il ping pong si gioca con i polsi, non con le braccia. E con il cuore, ovviamente.']
];

BALD_TEXT.calcetto = [
  ['gioca a calcio balilla al -1 con grinta', 'Niente rullate! Le regole sono regole. Anche al -1.'],
  ['gioca a calcio balilla e segna un gol con il portiere', 'Il gol del portiere è leadership pura: partire dalle retrovie e arrivare in fondo.'],
  ['gioca a calcio balilla e urla "GOL!" a tutto il piano', 'Scusate. Era un gol importante. Per la candidatura del calcio balilla a disciplina olimpica.'],
  ['gioca a calcio balilla in coppia con un collega del customer care', 'Lui difende, io attacco. Lui ascolta, io risolvo. Squadra perfetta.'],
  ['gioca a calcio balilla tenendo il punteggio con le graffette', 'Ogni graffetta un gol. Ne ho dodici. Il mio avversario ne ha due, e una è piegata.'],
  ['gioca a calcio balilla muovendo il polso come un motore', 'Cinque minuti di calcio balilla valgono dieci di yoga. Lo dice uno studio. Il mio.'],
  ['gioca a calcio balilla e fa un passaggio di sponda perfetto', 'La sponda è come il dialogo con gli stakeholder: si gioca di riflesso, ma con precisione.'],
  ['gioca a calcio balilla e consola il portiere avversario', 'Non è colpa tua. Il tiro era imparabile. E poi sei un portiere di legno, fai il possibile.'],
  ['gioca una sfida a calcio balilla tra Sales e IT', 'Arbitro e gioco insieme. Conflitto di interessi? No, conflitto di talento.'],
  ['gioca a calcio balilla con i polsini da tennista', 'I polsini sono fondamentali. Asciugano il sudore e danno un\'aria professionale.'],
  ['gioca a calcio balilla e spiega la tattica con i post-it', 'Due difensori, cinque centrocampisti, tre attaccanti. Il modulo è fisso, la creatività no.'],
  ['gioca a calcio balilla e fa la ola da solo dopo un gol', 'La ola da soli è difficile: bisogna correre da una parte all\'altra. Ma ne vale la pena.'],
  ['gioca a calcio balilla con una pallina fosforescente', 'Più facile da seguire. E fa atmosfera. Il -1 di sera sembra una discoteca.'],
  ['gioca a calcio balilla e chiede di rivedere l\'azione al VAR', 'Il VAR è il collega che filma con il telefono. Dice che era fuori. Io dico di no.']
];

BALD_TEXT.chitarra = [
  ['suona la chitarra con il piede appoggiato a una sedia', 'Questa si chiama "Ballata del ticket aperto". Dura finché qualcuno non lo chiude.'],
  ['suona un assolo di chitarra acustica', 'Tre accordi e la verità. Come in una buona riunione: breve e onesta.'],
  ['suona la chitarra e canta una canzone sulla fibra ottica', '"Viaggia la luce, nel vetro sottile, arriva a casa tua prima di aprile..." È ancora in lavorazione.'],
  ['accorda la chitarra con un\'app sul telefono', 'La chitarra va accordata. Come il team: ogni corda alla sua tensione giusta.'],
  ['suona la chitarra flamenco battendo il piede', 'Olé! L\'ho imparato durante una trasferta. Era a Bergamo, ma il maestro era bravissimo.'],
  ['suona una ninna nanna alla chitarra per un server', 'Il server numero 3 è nervoso. Una ninna nanna lo calma. Lo dicono anche i sistemisti.'],
  ['suona la chitarra con un plettro ricavato da una vecchia SIM', 'Una SIM formato maxi, tagliata a mano. Prima dell\'eSIM era un oggetto di culto.'],
  ['suona la chitarra mentre i colleghi battono le mani a tempo', 'La musica unisce più di qualsiasi workshop sulla collaborazione.'],
  ['suona un blues malinconico alla chitarra', 'È il blues del lunedì mattina. Si suona solo in tonalità minore e con un caffè vicino.'],
  ['suona la chitarra e improvvisa un rap sulla latenza', 'Zero millisecondi, siamo i più veloci, la rete non ci ferma, siamo... Lavoro ancora sulle rime.'],
  ['suona la chitarra elettrica senza amplificatore', 'Suono in silenzio, per rispetto dell\'open space. La musica è tutta nella mia testa.'],
  ['suona la chitarra con una tracolla abbinata all\'abito', 'La tracolla abbinata all\'abito. È un dettaglio, ma i dettagli fanno la differenza.'],
  ['suona una serenata alla macchinetta del caffè', 'Stamattina mi ha dato un caffè perfetto. Una serenata era il minimo.'],
  ['suona una chitarra a dodici corde con grande facilità', 'Dodici corde, dodici stakeholder. Bisogna farli suonare tutti insieme. È lo stesso lavoro.']
];

BALD_TEXT.giocoleria = [
  ['fa giocoleria con tre palline colorate', 'Ogni pallina è una priorità. Il trucco è non farne cadere nessuna. Il segreto è non averne quattro.'],
  ['fa giocoleria con tre SIM di formati diversi', 'Nano, micro e mini. Tre formati, una sola mano. Questa è portabilità.'],
  ['fa giocoleria con tre tazzine di caffè vuote', 'Vuote, per fortuna. Con quelle piene ci ho provato una volta sola.'],
  ['fa giocoleria con tre graffette giganti', 'Regalo di un fornitore. Non servono a niente, ma rimbalzano benissimo.'],
  ['fa giocoleria mentre risponde a una call con l\'auricolare', 'Sì, sì, ci sono. Ti seguo. No, quel rumore sono io che faccio giocoleria. Vai avanti.'],
  ['fa giocoleria con tre mele', 'Una mela al giorno toglie il medico di torno. Tre mele in aria tolgono lo stress.'],
  ['fa giocoleria con tre penne senza farne cadere una', 'Sono le penne che spariscono dalla reception. Le sto riportando con stile.'],
  ['fa giocoleria a occhi chiusi', 'Fiducia nel processo. Se il processo è buono, puoi anche chiudere gli occhi. Ma non troppo a lungo.'],
  ['fa giocoleria con tre modem tondi da esposizione', 'Sono campioni vuoti. I clienti li vorrebbero più di quelli veri.'],
  ['fa giocoleria con una mano sola', 'L\'altra mano la tengo libera per stringere quelle dei colleghi.'],
  ['fa giocoleria con tre post-it appallottolati', 'Ogni post-it era un\'idea scartata. Ora hanno una seconda vita.'],
  ['fa giocoleria con tre palline luminose', 'Di notte fanno un effetto incredibile. Di giorno sono solo palline. Come certe idee.'],
  ['fa giocoleria e lancia una pallina a un collega di passaggio', 'Prendila! Bravo! Ora ridammela. Ecco, lavoro di squadra.'],
  ['fa giocoleria con cinque palline', 'Cinque. Il mio record. Come i progetti che seguo insieme. Anche lì non ne faccio cadere uno.']
];

BALD_TEXT.yoga = [
  ['fa yoga nella posizione dell\'albero', 'La posizione dell\'albero insegna l\'equilibrio. Utilissima nelle riunioni con quattro manager.'],
  ['medita in posizione yoga su un tappetino viola', 'Inspiro i requisiti, espiro le aspettative irrealistiche. Om.'],
  ['fa il saluto al sole davanti alla finestra', 'Il sole sorge ogni mattina senza ticket. Un esempio di affidabilità.'],
  ['fa yoga in giacca senza stropicciarla', 'Tessuto tecnico, elasticizzato e antipiega. È la tecnologia più avanzata dell\'azienda.'],
  ['tiene la posizione del guerriero da cinque minuti', 'Guerriero due. Il guerriero uno l\'ho fatto prima della riunione con i fornitori.'],
  ['fa yoga guidando una classe immaginaria', 'E ora, cari colleghi invisibili, respiriamo insieme. Bravissimi, tutti in sincrono.'],
  ['fa yoga accanto a una pianta finta', 'La pianta finta è il simbolo della calma assoluta. Non si scompone mai.'],
  ['fa stretching per la schiena da scrivania', 'Otto ore alla scrivania meritano dieci minuti di cura. La schiena è il primo asset aziendale.'],
  ['fa yoga con gli occhi chiusi e un sorriso sereno', 'Sto visualizzando la casella email a zero. È un posto bellissimo. Ci sono stato una volta, anni fa.'],
  ['fa la posizione del cane a testa in giù', 'Visto da qui, l\'organigramma ha molto più senso.'],
  ['fa yoga respirando e contando fino a otto', 'Otto secondi per inspirare, otto per espirare. Otto come le ore di sonno che non faccio mai.'],
  ['fa yoga su un tappetino con disegnata una SIM gigante', 'Tappetino personalizzato. Il chip in mezzo è il mio punto di equilibrio.'],
  ['fa yoga in perfetto equilibrio su un piede solo', 'Su un piede solo. L\'altro lo tengo pronto per scappare in riunione.'],
  ['fa yoga e saluta con un inchino chi passa', 'Namasté. Il project manager che è in me saluta il project manager che è in te.']
];

BALD_TEXT.skate = [
  ['va in skateboard avanti e indietro', 'Il corridoio è la mia half pipe. La sicurezza dice di no. Il mio cuore dice sì.'],
  ['va in skate in abito elegante', 'La cravatta in skate è pericolosa, per questo non la metto. Il ciuffo invece è aerodinamico.'],
  ['fa un ollie perfetto con lo skateboard', 'Ollie! È come un salto di qualità nel progetto, ma più rumoroso.'],
  ['va in skateboard trasportando una pila di documenti', 'Consegna documenti express. Più veloce della posta interna. Molto più veloce.'],
  ['scivola in skate con le mani in tasca', 'Equilibrio, nonchalance e un pizzico di follia. Le doti di un buon PM.'],
  ['fa avanti e indietro in skate cronometrandosi', 'Dieci secondi risparmiati a tragitto, cinquanta tragitti al giorno: otto minuti. Un caffè in più.'],
  ['va in skate e batte il cinque ai colleghi al volo', 'Il cinque al volo è un gesto di fiducia. Se manchi la mano, è una lezione di umiltà.'],
  ['va in skate su una tavola con le ruote che si illuminano', 'Ruote LED, si ricaricano col movimento. Energia rinnovabile, come il mio entusiasmo.'],
  ['si allena in skateboard con la grinta di un campione', 'Mi preparo per la gara aziendale di skate. Non esiste ancora, ma la organizzo io.'],
  ['va in skate e frena con una sgommata elegante', 'Frenare è l\'arte di saper dire stop. In skate e nelle richieste fuori scope.'],
  ['va in skate a velocità moderata, rispettando la segnaletica', 'Niente acrobazie vicino alla macchinetta del caffè. È zona sacra.'],
  ['va in skate con un caffè in mano senza versarne una goccia', 'Il caffè non si spreca. Mai. Neanche in curva.'],
  ['fa slalom in skate tra i cestini', 'Ogni cestino è un rischio di progetto. Li evito tutti con grazia.'],
  ['va in skateboard canticchiando una sigla dei cartoni anni \'90', 'Questa sigla mi dà la carica come uno sprint planning. Anzi, di più.']
];

BALD_TEXT.telescopio = [
  ['guarda le stelle con un telescopio', 'Sto cercando il satellite che ci porta il segnale. Eccolo. Salutalo anche tu.'],
  ['osserva il cielo con un telescopio puntato in alto', 'Le stelle sono come i KPI: lontane, luminose e difficili da raggiungere.'],
  ['guarda in un telescopio e prende appunti', 'Ho scoperto una costellazione nuova. L\'ho chiamata "Roadmap": ha una freccia che punta lontano.'],
  ['punta il telescopio verso l\'antenna sul tetto di fronte', 'Controllo l\'orientamento. Due gradi a sinistra e la copertura migliora del 3%.'],
  ['osserva la Luna con il telescopio', 'Sulla Luna non c\'è campo. Nessuno può scriverti in chat. Ci andrei in vacanza.'],
  ['cerca una cometa con il telescopio', 'Le comete passano di rado, come le buone idee. Bisogna essere pronti a guardare.'],
  ['regola le lenti di un telescopio con delicatezza', 'La messa a fuoco è tutto. Nella vita, nei progetti e nei telescopi.'],
  ['guarda nel telescopio con la meraviglia di un bambino', 'Non smettere mai di stupirti. È il consiglio più importante che posso darti.'],
  ['usa il telescopio per leggere un cartello lontanissimo', 'C\'è scritto "Fine lavori: 2019". Lo leggo ogni giorno, per ricordarmi che i Gantt mentono.'],
  ['osserva Marte con il telescopio', 'Su Marte la latenza è di venti minuti. Altro che zero. Mi sento fortunato.'],
  ['guarda le stelle e dà un nome a ciascuna', 'Questa è la stella del customer care: brilla anche di notte. Quella del marketing cambia colore ogni ora.'],
  ['scruta l\'orizzonte con il telescopio come un capitano', 'Nuovo mercato all\'orizzonte! Tutti ai posti di combattimento! Ah no, è un piccione.'],
  ['punta il telescopio verso la torre con la guglia', 'Da qui si vede l\'ultimo piano. Le riunioni più alte d\'Italia. Letteralmente.'],
  ['osserva il cielo e sorride a una stella cadente', 'Ho espresso un desiderio. Non posso dirlo, ma riguarda un deploy senza errori.']
];

BALD_TEXT.pittura = [
  ['dipinge un quadro astratto su un cavalletto', 'Si intitola "Riunione delle 9". È molto confuso, ma ha un\'anima.'],
  ['dipinge un ritratto della macchinetta del caffè', 'È la musa di questo piano. Le dovevo un ritratto.'],
  ['dipinge un paesaggio di antenne al tramonto', 'Le antenne al tramonto sembrano alberi tecnologici che salutano il sole.'],
  ['dipinge con pennellate veloci e sicure', 'Dipingere è come pianificare: prima lo schizzo, poi i colori, infine i dettagli. E mai toccare quando è fresco.'],
  ['dipinge un grafico a torta in stile impressionista', 'Monet dipingeva ninfee. Io dipingo grafici a torta. Ognuno ha il suo stile.'],
  ['dipinge un murale per l\'area break', 'Rappresenta tutti i colleghi che si tengono per mano. E una gigantesca tazza di caffè.'],
  ['finisce un quadro e lo firma con un ghirigoro', 'La firma è importante. Anche sui documenti di progetto. Soprattutto sui documenti di progetto.'],
  ['dipinge un tramonto usando solo i colori aziendali', 'Rosso, bianco e un po\' di blu notte. Il blu notte l\'ho aggiunto io. Mi sta bene.'],
  ['dipinge tenendo il pennello come una bacchetta da direttore d\'orchestra', 'Ogni colore è uno strumento. E io dirigo la sinfonia.'],
  ['dipinge un quadro che sembra un diagramma di Gantt', 'Le barre sono colorate a mano. Almeno qui rispettano le scadenze.'],
  ['dipinge un cielo stellato sopra un open space deserto', 'L\'open space di notte è poesia: silenzio, buio e i LED dei router accesi.'],
  ['dipinge un fiore con la delicatezza di un maestro', 'Ogni petalo è un collega. Insieme fanno il fiore. Che metafora, eh?'],
  ['dipinge una natura morta con SIM, cavi e una tazza', 'Natura morta tecnologica. Le SIM sono scadute, il caffè è freddo. Molto realistico.'],
  ['dipinge con una piccola macchia di colore sulla guancia', 'Ah sì? Dove? Va bene, la lascio. Fa molto artista.']
];

BALD_TEXT.barbecue = [
  ['fa un barbecue improvvisato', 'Grigliata di fine sprint! Salsicce per tutti, verdure per i vegani, e il facility ha detto sì. Quasi.'],
  ['gira le salsicce sulla griglia con una pinza', 'La griglia va gestita come un progetto: fuoco giusto, attenzione costante, girare al momento giusto.'],
  ['fa il barbecue con un grembiule con scritto "Project Griller"', 'Regalo del team. Dicono che sono più bravo con la griglia che con le slide. Mmh.'],
  ['cuoce spiedini con precisione millimetrica', 'Ogni spiedino è un task. Peperone, cipolla, salsiccia. In ordine di dipendenza.'],
  ['fa il barbecue e il profumo attira mezzo ufficio', 'Ecco come si fa engagement. Altro che newsletter interna.'],
  ['accende il barbecue con un solo fiammifero', 'Un fiammifero, una scintilla. Come una buona idea in un brainstorming.'],
  ['griglia verdure con un sorriso soddisfatto', 'Le zucchine sono pronte. Il segreto è non dimenticarle mentre rispondi alle email.'],
  ['fa il barbecue e serve i colleghi uno a uno', 'Prima i nuovi assunti, poi gli stagisti, poi i manager. È la mia gerarchia del barbecue.'],
  ['fa il barbecue con il fumo che forma degli anelli perfetti', 'Anelli di fumo perfetti. Un talento che non sapevo di avere.'],
  ['griglia il pane e lo condisce con olio buono', 'Pane, olio e un po\' di sale. Le cose semplici sono le migliori. Come i processi snelli.'],
  ['fa il barbecue in abito, senza nemmeno una macchia', 'Il segreto è stare sopravento. E avere un abito idrorepellente.'],
  ['controlla la temperatura della griglia con un termometro digitale', 'Duecentoventi gradi. Perfetto. Prima di tutto i dati, anche al barbecue.'],
  ['fa il barbecue canticchiando una canzone da spiaggia', 'La cantavo d\'estate al mare. Il barbecue mi riporta lì.'],
  ['fa una grigliata per un progetto chiuso in anticipo', 'In anticipo! Non succedeva da anni. Questa merita una grigliata.']
];

BALD_TEXT.pesca = [
  ['pesca con una canna da pesca in un secchio d\'acqua', 'Non ho ancora preso niente. Ma la pazienza è la virtù del project manager. E del pescatore.'],
  ['pesca in un secchio, sperando di prendere un\'idea', 'Qui dentro c\'è l\'idea del secolo. Bisogna solo aspettare che abbocchi.'],
  ['pesca con un\'esca a forma di SIM', 'Se nel secchio c\'è un Officemon, abboccherà. Le SIM sono irresistibili.'],
  ['pesca e fissa il galleggiante con attenzione', 'Il galleggiante si è mosso! No, era il condizionatore. Si ricomincia.'],
  ['pesca in un secchio con un cappello da pescatore', 'Il cappello fa metà del lavoro. L\'altra metà la fa il silenzio.'],
  ['pesca e racconta di un pesce enorme preso l\'anno scorso', 'Era grande così. Anzi, così. Va bene, era una graffetta. Ma era una graffetta enorme.'],
  ['pesca con una canna di bambù fatta a mano', 'L\'ho costruita con le canne della pianta del quarto piano. Non dite niente al facility.'],
  ['lancia l\'amo nel secchio con eleganza', 'Il lancio è tutto. Come una presentazione: se parti bene, il resto viene da sé.'],
  ['pesca e tira su una vecchia chiavetta USB', 'Una chiavetta da 2 GB del 2008! Chissà cosa c\'è dentro. Meglio non saperlo.'],
  ['pesca seduto su uno sgabello pieghevole', 'Lo sgabello è ergonomico. Ho fatto la valutazione dei rischi anche per pescare.'],
  ['pesca e sussurra qualcosa al secchio', 'Sto negoziando con i pesci. Offro molliche, chiedo collaborazione. Classico win-win.'],
  ['pesca con una pazienza infinita', 'Tre ore e nessun pesce. Ma ho pensato al piano del prossimo trimestre. Pescare è produttivo.'],
  ['pesca e tira su un post-it bagnato', 'C\'è scritto "chiamare il fornitore". È di tre anni fa. Lo chiamo oggi, giuro.'],
  ['pesca con un amo che, giura, è d\'oro', 'L\'amo d\'oro attira solo le buone opportunità. Le altre restano nel secchio.']
];
