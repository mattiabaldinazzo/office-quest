# Office Quest

Gioco di ruolo in stile Pokémon per Game Boy Advance, ambientato in una società di telecomunicazioni immaginaria: **LatenzaZero S.p.A.** Gira nel browser, senza installazioni.

**Gioca qui:** https://mattiabaldinazzo.github.io/office-quest/

## Storia

È il tuo primo giorno in LatenzaZero. Gli oggetti del lavoro hanno preso vita: SIM, modem, cavi, graffette. Si chiamano **Officemon**.

1. Reception al piano terra, poi il 5° piano: HR per il primo Officemon, Facility per PC, gadget, kit smart working e sneakers per correre.
2. Software Factory al 1° piano, Assistenza IT al 2°, Rete e Logistica B2B al 3°. Ogni responsabile sconfitto abilita il badge per il piano successivo.
3. Il Network Manager ti affida il dossier di lancio della nuova offerta: serve il via libera della sede staccata.
4. Il viaggio attraversa Milano: la piazza delle fontane con la torre con la guglia, il bosco in verticale, il quartiere Isola. Cantieri, deviazioni e terre desolate.
5. In sede staccata fai avanti e indietro tra Sales, Marketing e Customer Care fino alla firma.
6. Torni in sede, superi Finance, Tax, Legal e Controlling al 4° piano e sfidi l'Amministratore Delegato.

## Il Dott. Baldinazzo

Il Project Manager più esperto dell'azienda. Compare continuamente in giro per le mappe mentre fa qualcosa di insolito: dorme sull'amaca, spara al bersaglio, fa le bolle di sapone, parla dal palco, balla con le cuffie col filo, fa esperimenti chimici fluorescenti, gioca a ping pong e a calcio balilla al -1, e molto altro.

- 36 attività animate, 504 situazioni diverse, 133 scuse per scappare in riunione
- Ogni incontro: cosa sta facendo, una battuta, un consiglio legato al punto della storia, la scusa e l'uscita di scena
- Se lo ignori, ti chiama lui
- Il tesserino aziendale conta gli incontri; a 25, 50, 100, 150, 200, 300, 400 e 500 ci sono premi
- **Easter egg:** il suo ufficio segreto. Ogni personaggio dà un indizio.

## Comandi

| Azione | Tastiera | Touch |
| --- | --- | --- |
| Muoviti | Frecce o WASD | Croce direzionale |
| A: parla, conferma | Z, Spazio, J | A |
| B: annulla, corri (tieni premuto) | X, Esc, K | B |
| START: menu, salvataggio | Invio | START |
| SELECT: audio on/off | M | AUDIO |
| Vai in un punto, parla con qualcuno | Clic sulla mappa o sul personaggio | Tocco sullo schermo |
| Scegli una voce di menu o una lettera | Clic sulla voce | Tocco sulla voce |
| Tasto B | Clic destro | B |

Su smartphone in verticale la console occupa tutto lo schermo. Per giocare senza le barre del browser aggiungi la pagina alla schermata Home: si apre a schermo intero come un'app.

## Contenuti

- 17 mappe: 7 piani della sede principale, ufficio dell'AD, cunicolo e ufficio segreto, 4 zone di Milano, sede staccata su 2 piani
- 22 Officemon in 4 tipi: SEGNALE, FIBRA, CARTA, UFFICIO
- Tabella dei tipi: la FIBRA batte il SEGNALE, il SEGNALE batte la CARTA, la CARTA batte la FIBRA
- Starter: Simmetta (SIM), Simbox (totem self service), Routerino (modem tondo)
- 23 mosse con termini del settore: Roaming, Onda 5G, Banda Larga, Latenza, Ticket Aperto, Disdetta
- Ascensore con scelta del piano e badge che si abilita con la storia
- Allenatori con linea di vista, rivale in quattro tappe, boss finale con rivincita
- Salvataggio nel browser, musica chiptune, controlli touch

## Struttura

```
index.html          pagina e console GBA
css/style.css       layout desktop e mobile
js/audio.js         musica ed effetti sonori
js/engine.js        input, loop, finestre, dialoghi, menu
js/sprites.js       pixel art di tile, personaggi, Officemon e ritratti
js/decor.js         oggetti grandi: ping pong, calcio balilla, edifici di Milano
js/data.js          tipi, mosse, specie, strumenti
js/bald_text*.js    situazioni, scuse, consigli e premi del Dott. Baldinazzo
js/maps.js          mappe, personaggi, allenatori, indizi
js/battle.js        sistema di lotta
js/bald.js          comparse, scene animate e dialoghi del Dott. Baldinazzo
js/world.js         esplorazione, ascensore, collisioni, interazioni
js/story.js         eventi e missioni
js/main.js          menu, salvataggi, titolo, introduzione, titoli di coda
```

Nessuna dipendenza e nessun passaggio di build. Per provarlo in locale:

```
python3 -m http.server 8000
```

poi apri http://localhost:8000.

## Pubblicazione su GitHub Pages

Settings > Pages > Build and deployment > Source: **Deploy from a branch**, branch `main`, cartella `/ (root)`.

Nomi di persone, aziende e luoghi sono inventati o usati senza loghi. Ogni riferimento a marchi reali è assente.
