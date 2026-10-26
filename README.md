# DAT110 – eksamenstrening

Øvingsside for DAT110 *Distribuerte systemer og nettverksteknologi* (HVL), laget for eksamen 7. januar 2027.
Ren HTML, CSS og JavaScript – ingen installasjon eller byggesteg.

## Kom i gang

Åpne `index.html` direkte i nettleseren, eller start den lille Java-serveren:

```
java Server.java
```

og gå til http://localhost:8000. Siden kan også publiseres med GitHub Pages (Settings → Pages → branch `main`, mappe `/`).

Fremdrift (leste seksjoner, quizstatistikk, eksamenssvar, studieplan) lagres i nettleserens `localStorage`.

## Innhold

| Side | Hva |
|---|---|
| `index.html` | Hjem: nedtelling, fremdrift, studieplan uke for uke fram til eksamen, svakeste temaer |
| `laer.html` | Læringsløp: 19 moduler fra første til siste tema, med figurer, regnede eksempler og mini-quizer |
| `teori.html` | Teoriark per tema (huskeliste, formler, modellsvar), samlet formelark og eksamensteknikk |
| `quiz.html` | Quizbank (600+ spørsmål): ekte Oppgave 1-spørsmål, Canvas-quizene, læringsløpet og nye spørsmål |
| `eksamen.html` | Eksamener 2022–2025 med sensorveiledningens løsninger + to øvingseksamener, tidtaker og selvvurdering |
| `trening.html` | Regnetrening med nye tall hver gang: Chord DHT, vektorklokker, IP/CIDR/LPM, forsinkelse, distance-vector, overlay/RDP, fragmentering, sjekksum, RSA, flooding |
| `begreper.html` | 260+ begreper med norsk forklaring og engelsk fagterm; liste, flashcards og test |

## Struktur

```
assets/css/style.css          felles stil (lys/mørk modus)
assets/js/core.js             navigasjon, lagring, quiz-motor
assets/js/figs.js             figurer (Chord-ring, grafer, tidslinjer)
assets/js/*.js                logikk per side
assets/data/modules/*.js      læringsmodulene (ett tema per fil)
assets/data/quiz-*.js         quizbanken
assets/data/exams-*.js        eksamener og øvingseksamener
assets/data/glossary-data.js  begrepslisten
```

Nytt innhold legges til ved å redigere datafilene: en modul er et objekt i `DAT110.addModule({...})`, og et quizspørsmål er `{ q, o: [alternativer], a: [riktige indekser], e: forklaring }`.
