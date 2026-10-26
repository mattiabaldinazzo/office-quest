# Office Quest

Gioco di ruolo in stile Pokémon per Game Boy Advance, ambientato in ufficio. Gira nel browser, senza installazioni.

**Gioca qui:** https://mattiabaldinazzo.github.io/office-quest/

## Storia

È il tuo primo giorno all'Office Tower. Gli oggetti d'ufficio hanno preso vita: si chiamano **Officemon**. Scegli il tuo primo collega all'ufficio HR, assumi Officemon selvatici tra i grovigli di cavi, sfida i colleghi piano dopo piano e conquista la promozione battendo il Direttore.

## Comandi

| Azione | Tastiera | Touch |
| --- | --- | --- |
| Muoviti | Frecce o WASD | Croce direzionale |
| A: parla, conferma | Z, Spazio, J | A |
| B: annulla, corri (tieni premuto) | X, Esc, K | B |
| START: menu, salvataggio | Invio | START |
| SELECT: audio on/off | M | AUDIO |

## Contenuti

- 5 mappe: Reception, Ufficio HR, Open Space, Reparto IT, Ufficio del Direttore
- 12 Officemon in 4 tipi: CARTA, CAFFÈ, TECH, UFFICIO
- Tabella dei tipi: CARTA batte CAFFÈ, CAFFÈ batte TECH, TECH batte CARTA
- 15 mosse con danni, modifiche alle statistiche e cure
- Lotte a turni, esperienza, livelli e nuove mosse
- Allenatori con linea di vista, rivale, boss finale con rivincita
- Cattura con i Contratti, zaino, distributore automatico, macchinetta del caffè per curare la squadra
- Salvataggio nel browser (localStorage)
- Musica chiptune ed effetti sonori generati con WebAudio
- Grafica pixel art generata via codice a 240x160, la risoluzione del GBA

## Struttura

```
index.html      pagina e console GBA
css/style.css   layout desktop e mobile
js/audio.js     musica ed effetti sonori
js/engine.js    input, loop, finestre, dialoghi, menu
js/sprites.js   pixel art di tile, personaggi e Officemon
js/data.js      tipi, mosse, specie, strumenti
js/maps.js      mappe, personaggi, allenatori
js/battle.js    sistema di lotta
js/main.js      esplorazione, storia, menu, salvataggi
```

Nessuna dipendenza e nessun passaggio di build. Per provarlo in locale:

```
python3 -m http.server 8000
```

poi apri http://localhost:8000.

## Pubblicazione su GitHub Pages

Settings > Pages > Build and deployment > Source: **Deploy from a branch**, branch `main`, cartella `/ (root)`.
