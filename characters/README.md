# Personaggi aggiuntivi

Ogni file `.json` in questa cartella aggiunge un collega al gioco. Crei o modifichi il file, fai commit su `main` e al prossimo caricamento della pagina il personaggio compare.

La GitHub Action `Indice personaggi` aggiorna da sola `index.json`, l'elenco dei file che il gioco legge. Non serve toccarlo a mano. Se l'Action non parte, il gioco prova a leggere la cartella tramite l'API di GitHub.

## Esempio

```json
{
  "nome": "Sara Sprint",
  "ruolo": "Scrum Master",
  "carattere": "entusiasta",
  "percentuale_incontri": 40,
  "piani": ["1", "-1", "Sede #2"],
  "capelli": { "colore": "rossi", "acconciatura": "lunghi" },
  "occhi": "verdi",
  "frasi": [
    "Lo stand-up di oggi è durato 14 minuti e 58 secondi. Record personale!"
  ]
}
```

## Campi

| Campo | Obbligatorio | Valori |
| --- | --- | --- |
| `nome` | sì | Testo. Compare in maiuscolo nei dialoghi. |
| `ruolo` | no | Testo libero, per esempio `Data Analyst`. Predefinito: `Collega`. |
| `carattere` | no | `allegro`, `timido`, `sarcastico`, `entusiasta`, `brontolone`, `saggio`, `distratto`, `competitivo`, `pettegolo`, `zen`, `pigro`, `preciso`. Va bene anche il femminile (`allegra`, `timida`...). Predefinito: `allegro`. |
| `percentuale_incontri` | no | Da 0 a 100: probabilità che compaia ogni volta che entri in uno dei suoi piani. Predefinito: 30. |
| `piani` | no | Elenco tra: `-1`, `PT`, `1`, `2`, `3`, `4`, `5`, `AD`, `Sede #2`, `Sede #2 PT`, `Sede #2 1`, `Via`, `Piazza`, `Bosco`, `Isola`, `Esterni`, `Sede principale`, `Tutti`. Predefinito: `Tutti`. |
| `capelli.colore` | no | Nome (`neri`, `castani`, `biondi`, `rossi`, `grigi`, `bianchi`, `blu`, `verdi`, `viola`, `rosa`) o codice esadecimale come `#704020`. |
| `capelli.acconciatura` | no | `corti`, `lunghi`, `ciuffo`, `spettinati`, `calvo`, `chignon`. |
| `occhi` | no | Nome (`castani`, `nocciola`, `azzurri`, `verdi`, `grigi`, `neri`, `ambra`) o codice esadecimale. |
| `pelle` | no | Codice esadecimale, per esempio `#e8b890`. |
| `frasi` | no | Frasi personali. Se mancano, il personaggio usa le frasi del suo carattere. Puoi usare `{nome}`, `{ruolo}` e `{giocatore}`. |

Il vestito è casuale: camicia, pantaloni, giacca, cravatta e occhiali cambiano a ogni incontro.

Circa un personaggio su cinque, scelto in base al nome, chiede al giocatore se ha visitato l'ufficio del Dott. Baldinazzo e regala un indizio per trovarlo.

## Consigli

- Usa un file per persona, con un nome senza spazi: `nome-cognome.json`.
- Il repository è pubblico: usa soprannomi o nomi di fantasia, oppure chiedi il consenso alle persone che inserisci.
- Se un file contiene un errore di sintassi, il gioco lo salta e la console del browser mostra un avviso. L'Action segnala lo stesso errore nella scheda Actions di GitHub.
