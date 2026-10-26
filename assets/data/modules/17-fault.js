DAT110.addModule({
  id: 'fault',
  title: 'Feiltoleranse og pålitelig kommunikasjon',
  source: 'van Steen & Tanenbaum kap. 8.1, 8.2–8.2.2, 8.2.5, 8.2.8, 8.3, 8.4',
  exam: 'Oppgave 9 (lost request/lost reply, 5 RPC-feilklasser, flat vs hierarkisk gruppe, hierarkisk feedback) og Oppgave 1 (3k+1, omission failure, k-fault tolerant)',
  goals: [
    'Kjenne begrepene dependability: availability, reliability, safety, maintainability',
    'Skille fault, error og failure og kjenne feilmodellene',
    'Forklare prosessgrupper (flat vs hierarkisk) og k-feiltoleranse (k+1, 2k+1, 3k+1)',
    'Forklare feildeteksjon med timeouts',
    'Kunne de fem feilklassene i RPC og hvordan lost request/lost reply håndteres',
    'Forklare pålitelig multicast, feedback implosion og hierarkisk tilbakemelding, samt meldingsordning'
  ],
  sections: [
    {
      id: 'fault-1',
      title: 'Grunnbegreper og feilmodeller',
      html: `
<p>Et system er <b>dependable</b> (pålitelig i vid forstand) når det har:</p>
<ul>
  <li><b>Availability</b> (tilgjengelighet): systemet er klart til bruk <em>akkurat nå</em> (sannsynlighet ved et tidspunkt).</li>
  <li><b>Reliability</b> (pålitelighet): systemet kjører kontinuerlig uten feil over et tidsintervall.</li>
  <li><b>Safety</b>: en midlertidig feil fører ikke til katastrofe.</li>
  <li><b>Maintainability</b>: et feilet system kan lett repareres.</li>
</ul>
<p class="small muted">Et system som går ned 1 ms hver time har høy tilgjengelighet men lav pålitelighet. Et system som aldri krasjer men stenges 2 uker i året har høy pålitelighet men lavere tilgjengelighet.</p>
<p><b>Fault</b> (årsak) → <b>error</b> (feil tilstand) → <b>failure</b> (systemet leverer ikke det det lover). Feil kan være forbigående (transient), periodiske (intermittent) eller permanente. Tilnærminger: <b>forebygging</b>, <b>toleranse</b>, <b>fjerning</b> og <b>prognose</b> (forecasting).</p>
<div class="callout"><span class="ct">Feiltolerant</span>Et system er <b>feiltolerant</b> hvis det kan <b>fortsette å operere</b> (levere tjenestene sine) <b>selv om det finnes feil</b>.</div>
<h3>Feilmodeller (failure models)</h3>
<div class="table-wrap"><table>
<tr><th>Type</th><th>Beskrivelse</th></tr>
<tr><td><b>Crash failure</b></td><td>Serveren stopper (halts), men fungerte korrekt fram til da</td></tr>
<tr><td><b>Omission failure</b></td><td>Serveren <b>svarer ikke på innkommende forespørsler</b> (receive omission) eller sender ikke meldinger (send omission)</td></tr>
<tr><td><b>Timing failure</b></td><td>Svaret kommer utenfor det spesifiserte tidsintervallet (for sent/tidlig)</td></tr>
<tr><td><b>Response failure</b></td><td>Svaret er <b>feil</b>: feil verdi (value failure) eller avviker fra riktig kontrollflyt (state-transition failure)</td></tr>
<tr><td><b>Arbitrary / Byzantine</b></td><td>Vilkårlige svar til vilkårlige tider – også ondsinnede, inkonsistente svar</td></tr>
</table></div>
<div class="callout exam"><span class="ct">Jan 2024 1g / mai 2024 1g</span>«The type of failure where a server fails to respond to incoming requests» → <b>Omission failure</b>. (Crash = stopper helt; response = svarer feil.)</div>
`,
      quiz: [
        { q: 'Feiltypen der en server ikke svarer på innkommende forespørsler kalles …', o: ['Response failure', 'Timing failure', 'Crash failure', 'Omission failure'], a: [3], e: 'Receive/send omission.' },
        { q: 'Et system er feiltolerant hvis …', o: ['det kan fortsette å operere selv om det finnes feil', 'det tåler crash og omission, men ikke vilkårlige feil', 'det tåler crash, men ikke vilkårlige feil', 'en delvis feil kan krasje systemet, men det kan repareres senere'], a: [0], e: 'Definisjonen.' },
        { q: 'Hvilke feiltyper kan gi svar fra serveren som bryter dataintegriteten (feil innhold)?', o: ['Crash failure', 'Timing failure', 'Response failure', 'Omission failure', 'Byzantine (arbitrary) failure'], a: [2, 4], e: 'Response = feil verdi/tilstand; Byzantine = vilkårlige (også feil) svar.' },
        { q: 'Et system er sjelden nede, men hver gang i et sekund hver time. Hva er høyt og lavt?', o: ['Høy pålitelighet, lav tilgjengelighet', 'Høy tilgjengelighet, lav pålitelighet', 'Begge høye', 'Begge lave'], a: [1], e: 'Det er nesten alltid oppe (tilgjengelig) men kjører ikke lenge uavbrutt.' }
      ]
    },
    {
      id: 'fault-2',
      title: 'Prosessresiliens: grupper og k-feiltoleranse',
      html: `
<p>Den generelle teknikken for å beskytte mot prosessfeil er å <b>organisere flere identiske prosesser i en gruppe</b>. Når en melding sendes til gruppen, mottar alle medlemmene den; feiler noen, tar andre over.</p>
<div class="compare">
<div><h4>Flat gruppe</h4><p><b>Lederløs</b>: ingen utpekt leder, beslutninger tas kollektivt. Ingen enkelt feilpunkt, men beslutninger er tregere. Eksempel: <b>replicated-write</b>-protokoll.</p></div>
<div><h4>Hierarkisk gruppe</h4><p><b>Lederbasert</b>: én prosess er valgt <b>koordinator</b>, de andre er arbeidere; koordinatoren bestemmer hvem som gjør jobben. Raskt, men koordinatoren er et feilpunkt (→ valgalgoritme). Eksempel: <b>primary-based</b>-protokoll.</p></div>
</div>
<div class="callout exam"><span class="ct">Jan 2024 9c / mai 2024 9a</span>«Briefly explain the two ways to arrange the replication of a fault-tolerant group of processes and give an example under each.» → flat (replicated-write) og hierarkisk (primary-based) som over.</div>
<h3>k-feiltoleranse – hvor mange prosesser trengs?</h3>
<p>Et system er <b>k-feiltolerant</b> hvis det kan overleve at <b>k</b> komponenter feiler og fortsatt oppfylle spesifikasjonen.</p>
<div class="table-wrap"><table>
<tr><th>Situasjon</th><th>Antall prosesser</th><th>Hvorfor</th></tr>
<tr><td>Crash/omission (stille feil)</td><td><b>k + 1</b></td><td>Det holder at én svarer korrekt</td></tr>
<tr><td>Vilkårlige feil, flertallsavstemning over svarene</td><td><b>2k + 1</b></td><td>De k+1 korrekte må være i flertall over k feilende</td></tr>
<tr><td><b>Bysantinsk enighet</b> (agreement) blant prosessene</td><td><b>3k + 1</b></td><td>Feilende prosesser kan lyve ulikt til ulike prosesser; trengs 2k+1 korrekte</td></tr>
</table></div>
<div class="callout exam"><span class="ct">Spurt i 2023, jan 2024 (+ Canvas)</span>«How many processes are needed to form a byzantine agreement in a group with k faulty processes?» → <b>3k + 1</b>.<br>
«How many processes in a leaderless protocol to obtain a correct result from a <b>majority vote</b> with k failing?» → <b>2k + 1</b>.</div>
<h3>Feildeteksjon</h3>
<p>I praksis oppdages feil med <b>timeouts</b>: send «lever du?» (ping/heartbeat) og vent. Problemet: en treg prosess eller et tregt nett kan ikke skilles fra en krasjet prosess → <b>falske positive</b>. Gossip-baserte detektorer kan spre «X ser ut til å være død».</p>
`,
      quiz: [
        { q: 'En generell teknikk for prosessresiliens i distribuerte systemer er å …', o: ['organisere flere identiske prosesser i en gruppe', 'forutsi feilen slik at systemet kan handle når den oppstår', 'bruke en feilfjerningsteknikk', 'bruke en feilforebyggingsteknikk'], a: [0], e: 'Replikering av prosesser i grupper.' },
        { q: 'Hvor mange prosesser trengs for bysantinsk enighet med k feilende prosesser?', o: ['3k+1', 'k+1', '2k+1', '3k'], a: [0], e: 'Lamport, Shostak & Pease.' },
        { q: 'Et system er k-feiltolerant hvis det …', o: ['overlever at flertallet feiler', 'overlever at alle unntatt k feiler', 'overlever at k+1 feiler', 'overlever at k feiler'], a: [3], e: 'Definisjonen.' },
        { q: 'Hvor mange prosesser trengs i en lederløs protokoll for å få riktig resultat ved flertallsavstemning når k prosesser kan ha vilkårlige feil?', o: ['k+1', '3k+1', '2k+1'], a: [2], e: 'k+1 korrekte må være flertall over k feilende.' },
        { q: 'Hvilken grupperingsform har en koordinator og arbeidere?', o: ['Flat gruppe', 'Hierarkisk gruppe'], a: [1], e: 'Eksempel: primary-based.' }
      ]
    },
    {
      id: 'fault-3',
      title: 'Pålitelig klient-server: de fem RPC-feilklassene',
      html: `
<p>RPC skal ideelt se ut som et lokalt kall. Men fem ting kan gå galt (jan 2025 9b):</p>
<div class="table-wrap"><table>
<tr><th>#</th><th>Feil</th><th>Håndtering</th></tr>
<tr><td>1</td><td><b>Klienten finner ikke serveren</b> – ingen forespørsel kan sendes</td><td>Rapporter unntak/feil til klienten (bryter transparens)</td></tr>
<tr><td>2</td><td><b>Forespørselen går tapt</b> – serveren svarer aldri</td><td>Timer + retransmisjon (se under)</td></tr>
<tr><td>3</td><td><b>Serveren krasjer</b> etter mottak – forespørselen er kanskje kvittert men ikke utført (eller utført men ikke svart)</td><td>Semantikk: at-least-once, at-most-once, exactly-once (umulig å garantere generelt)</td></tr>
<tr><td>4</td><td><b>Svaret går tapt</b> – tjenesten er utført, men resultatet kommer ikke fram</td><td>Timer + retransmisjon + duplikatdeteksjon for ikke-idempotente</td></tr>
<tr><td>5</td><td><b>Klienten krasjer</b> etter sending – serveren sender svar til en omstartet klient som ikke venter på det (<b>orphan</b>)</td><td>Orphan extermination, reincarnation, expiration</td></tr>
</table></div>
<h3>Lost request (mai 2024 9b, juni 2025 9a)</h3>
<div class="callout exam"><span class="ct">Modellsvar</span>
<b>Klient</b>: starter en <b>timer</b> før forespørselen sendes. Hver forespørsel får et <b>sekvensnummer</b>. Kommer ingen ACK/svar før timeren går ut, <b>retransmitteres</b> forespørselen.<br>
<b>Server</b>: for <b>ikke-idempotente</b> forespørsler holder serveren styr på <b>siste mottatte sekvensnummer</b> fra hver klient og bruker det til å oppdage retransmisjoner.</div>
<h3>Lost reply (mai 2022 9e)</h3>
<div class="callout exam"><span class="ct">Modellsvar – to ting må med</span>
1. Klienten starter en timer ved sending. Går timeren ut før svar/ACK kommer, sendes forespørselen på nytt.<br>
2. Hensyn til <b>ikke-idempotente</b> forespørsler (write, update, delete, pengeoverføring): (i) klienten gir hver forespørsel et <b>sekvensnummer</b>, (ii) serveren husker <b>siste sekvensnummer per klient</b>, (iii) serveren skiller da original fra retransmisjon og <b>nekter å utføre en forespørsel to ganger</b> (sender evt. lagret svar på nytt).</div>
<div class="callout why"><span class="ct">Hvorfor er idempotens nøkkelen?</span>Klienten kan <b>ikke vite</b> om forespørselen eller svaret gikk tapt – eller om serveren bare er treg. Den må derfor sende på nytt. For en <b>idempotent</b> operasjon (les saldo, sett temperatur = 22) er det ufarlig å utføre den to ganger – serveren trenger ikke bry seg. For en <b>ikke-idempotent</b> (overfør 100 kr) ville gjentatt utførelse gi feil resultat → duplikatdeteksjon.</div>
<h3>Serverkrasj – semantikk</h3>
<ul>
  <li><b>At-least-once</b>: prøv igjen til svar kommer → utført minst én gang (kanskje flere).</li>
  <li><b>At-most-once</b>: gi opp ved feil → utført høyst én gang (kanskje ingen).</li>
  <li><b>Exactly-once</b>: ønsket, men kan generelt ikke garanteres.</li>
</ul>
<h3>Klientkrasj – orphans</h3>
<p>En <b>orphan</b> (foreldreløs beregning) kan <b>låse filer og binde ressurser</b>, <b>sløse serverens CPU-tid</b>, og et <b>gammelt svar kan forvirre</b> klienten når den har startet på nytt og sendt en ny forespørsel.</p>
`,
      quiz: [
        { q: 'En klient kan retransmittere forespørselen når svar fra serveren går tapt. Hvilke utsagn stemmer?', o: ['Serveren trenger ikke bry seg om duplikater hvis forespørselen er idempotent', 'Serveren må bry seg om duplikater hvis forespørselen er ikke-idempotent', 'Serveren trenger aldri bry seg om retransmitterte forespørsler'], a: [0, 1], e: 'Idempotens avgjør.' },
        { q: 'Hvilke problemer kan oppstå når en klient krasjer etter at forespørselen er sendt til serveren?', o: ['Forespørselen kan skape en orphan som låser filer og binder ressurser', 'Forespørselen kan skape en orphan som sløser serverens CPU-tid', 'Et gammelt svar kan forvirre klienten når den starter på nytt og sender en ny forespørsel'], a: [0, 1, 2], e: 'Alle tre er klassiske orphan-problemer.' },
        { q: 'Hvordan skiller serveren en retransmisjon fra en ny forespørsel?', o: ['Ved å se på IP-adressen', 'Ved å huske siste sekvensnummer fra hver klient', 'Ved å se på TTL', 'Det går ikke'], a: [1], e: 'Klienten nummererer forespørslene.' },
        { q: 'Hvilken semantikk får man hvis klienten gir opp med en gang ved feil?', o: ['At-least-once', 'At-most-once', 'Exactly-once'], a: [1], e: 'Kanskje utført, men aldri mer enn én gang.' }
      ]
    },
    {
      id: 'fault-4',
      title: 'Pålitelig gruppekommunikasjon og meldingsordning',
      html: `
<h3>Pålitelig multicast med tilbakemelding</h3>
<p>Enkel løsning: avsender holder meldinger i en historikkbuffer; mottakerne sender ACK (eller NACK ved manglende melding), og avsender retransmitterer. Problem: med mange mottakere drukner avsenderen i tilbakemeldinger – <b>feedback implosion</b>.</p>
<h3>Ikke-hierarkisk tilbakemeldingskontroll</h3>
<p>Mottakere sender bare NACK, og venter en <b>tilfeldig tid</b> først; ser de at noen andre allerede har multicastet en NACK for samme melding, undertrykker de sin egen (<b>feedback suppression</b>). Ulempe: retransmisjonen multicastes til alle, så <b>mottakere som allerede har meldingen må prosessere ubrukelige retransmisjoner</b>.</p>
<h3>Hierarkisk tilbakemeldingskontroll (jan 2025 9a)</h3>
<div class="callout exam"><span class="ct">Modellsvar</span>For store grupper deles mottakerne i <b>undergrupper organisert i et tre</b>. Hver undergruppe har en <b>lokal koordinator C</b> som håndterer retransmisjonsforespørsler i sin undergruppe. Mangler C en melding m, ber den koordinatoren i avsenderens undergruppe (foreldrenoden) om å retransmittere. ACK/NACK går mellom koordinatorene → <b>færre tilbakemeldinger</b> og bedre skalerbarhet.</div>
<div class="figure"><svg viewBox="0 0 520 190" xmlns="http://www.w3.org/2000/svg">
  <circle cx="260" cy="30" r="20" class="bx2"/><text x="260" y="35" text-anchor="middle" class="txs">S</text>
  <circle cx="130" cy="95" r="18" class="bxw"/><text x="130" y="100" text-anchor="middle" class="txs">C</text>
  <circle cx="390" cy="95" r="18" class="bxw"/><text x="390" y="100" text-anchor="middle" class="txs">C</text>
  <line x1="245" y1="44" x2="145" y2="83" class="ln"/><line x1="275" y1="44" x2="375" y2="83" class="ln"/>
  <circle cx="70" cy="160" r="13" class="bx"/><circle cx="130" cy="160" r="13" class="bx"/><circle cx="190" cy="160" r="13" class="bx"/>
  <circle cx="330" cy="160" r="13" class="bx"/><circle cx="390" cy="160" r="13" class="bx"/><circle cx="450" cy="160" r="13" class="bx"/>
  <line x1="122" y1="111" x2="78" y2="148" class="ln"/><line x1="130" y1="113" x2="130" y2="147" class="ln"/><line x1="138" y1="111" x2="182" y2="148" class="ln"/>
  <line x1="382" y1="111" x2="338" y2="148" class="ln"/><line x1="390" y1="113" x2="390" y2="147" class="ln"/><line x1="398" y1="111" x2="442" y2="148" class="ln"/>
  <text x="20" y="100" class="txs">undergruppe 1</text><text x="420" y="70" class="txs">undergruppe 2</text>
</svg><figcaption>Lokale koordinatorer (C) samler tilbakemeldinger i sin undergruppe.</figcaption></div>
<h3>Meldingsordning i multicast</h3>
<div class="table-wrap"><table>
<tr><th>Ordning</th><th>Garanti</th></tr>
<tr><td><b>Uordnet</b></td><td>Ingen garanti om rekkefølge</td></tr>
<tr><td><b>FIFO</b></td><td>Meldinger fra <b>samme avsender</b> leveres i den rekkefølgen de ble sendt (men meldinger fra ulike avsendere kan flettes vilkårlig)</td></tr>
<tr><td><b>Kausal</b></td><td>Kausalt relaterte meldinger leveres i kausal rekkefølge</td></tr>
<tr><td><b>Total (atomisk)</b></td><td>Alle mottakere leverer <b>alle</b> meldinger i <b>samme rekkefølge</b></td></tr>
</table></div>
<p><b>Atomisk multicast</b> = pålitelig multicast der meldingen leveres til <em>alle</em> eller <em>ingen</em> (virtuell synkroni), og (ofte) i samme rekkefølge. «FIFO-atomic» = FIFO-ordnet + samme rekkefølge hos alle.</p>
<h3>Eksamen mai 2023 9d – FIFO-ordninger</h3>
<p>P1 sender m1, så m2. P5 sender m3, så m4. FIFO krever <b>m1 før m2</b> og <b>m3 før m4</b>. Mulige rekkefølger (fletting av to sekvenser à 2 = 4!/(2!·2!) = <b>6</b>):</p>
<pre>m1, m2, m3, m4      m1, m3, m2, m4      m1, m3, m4, m2
m3, m4, m1, m2      m3, m1, m4, m2      m3, m1, m2, m4</pre>
<p><b>FIFO-atomisk</b>: P2, P3 og P4 må alle levere i <b>én og samme</b> av disse rekkefølgene (f.eks. alle: m1, m3, m4, m2).</p>
`,
      quiz: [
        { q: 'Et stort problem med pålitelig multicast med tilbakemeldinger er …', o: ['ordning av multicast-meldinger', 'feedback implosion', 'feilende prosesser'], a: [1], e: 'Avsenderen oversvømmes av ACK/NACK.' },
        { q: 'En utfordring med ikke-hierarkisk tilbakemeldingskontroll er at …', o: ['mottakere må sende ACK for meldinger de ikke mottok', 'mottakere som fikk meldingen riktig må prosessere retransmisjoner som er ubrukelige for dem', 'avsender må sende meldinger til koordinator'], a: [1], e: 'Retransmisjonen multicastes til alle.' },
        { q: 'P1 sender m1 så m2, P5 sender m3 så m4. Hvilken rekkefølge er IKKE FIFO-ordnet?', o: ['m1, m3, m2, m4', 'm3, m1, m4, m2', 'm2, m1, m3, m4', 'm3, m4, m1, m2'], a: [2], e: 'm2 kan ikke leveres før m1.' },
        { q: 'Hvor mange FIFO-ordninger finnes når to avsendere sender to meldinger hver?', o: ['4', '6', '12', '24'], a: [1], e: '4!/(2!·2!) = 6.' },
        { q: 'Hva krever total (atomisk) ordning?', o: ['At meldinger fra samme avsender kommer i rekkefølge', 'At alle mottakere leverer alle meldinger i samme rekkefølge', 'At kausalt relaterte meldinger ordnes', 'Ingenting'], a: [1], e: 'Lik rekkefølge overalt.' }
      ]
    }
  ],
  summary: [
    'Dependability: availability (klar nå), reliability (kjører uten feil over tid), safety, maintainability.',
    'Feilmodeller: crash (stopper), omission (svarer ikke), timing (for sent), response (feil svar), arbitrary/byzantine.',
    'Prosessresiliens: grupper av identiske prosesser. Flat (lederløs, replicated-write) vs hierarkisk (koordinator, primary-based).',
    'k-feiltoleranse: k+1 (stille feil), 2k+1 (flertallsavstemning ved vilkårlige feil), 3k+1 (bysantinsk enighet).',
    'Feildeteksjon: timeouts – kan ikke skille treg fra død.',
    'RPC-feil: finner ikke server, tapt request, serverkrasj, tapt reply, klientkrasj (orphans).',
    'Tapt request/reply: timer + retransmisjon; sekvensnummer per forespørsel; server husker siste sekvensnummer for ikke-idempotente.',
    'Pålitelig multicast: feedback implosion → feedback suppression (ikke-hierarkisk) eller lokale koordinatorer i tre (hierarkisk).',
    'Ordning: uordnet, FIFO (per avsender), kausal, total (lik rekkefølge hos alle).'
  ],
  formulas: [
    { name: 'Stille feil (crash)', expr: 'k + 1 prosesser', note: '' },
    { name: 'Flertallsavstemning, vilkårlige feil', expr: '2k + 1 prosesser', note: '' },
    { name: 'Bysantinsk enighet', expr: '3k + 1 prosesser', note: '' },
    { name: 'Antall FIFO-flettinger (a og b meldinger)', expr: '(a + b)! / (a! · b!)', note: '2+2 → 6' }
  ],
  examQA: [
    { q: 'The reply from the RPC server was lost. Explain how the client should correctly handle this.', a: '1) Client starts a timer when sending; if it expires before reply/ACK, the request is resent. 2) For non-idempotent requests: client assigns each request a sequence number, server keeps track of the most recent sequence number from each client, so it can tell original from retransmission and refuse to carry out a request twice.' },
    { q: 'The request to the RPC server was lost. How should client and server handle it?', a: 'Client: start timer before sending, assign sequence number, retransmit if no ACK before timeout. Server: for non-idempotent requests, keep track of the most recently received sequence number to detect retransmissions.' },
    { q: 'Briefly describe the five classes of failures that can occur in RPC systems.', a: '(1) Client cannot locate the server; (2) request lost; (3) server crashes after receiving the request; (4) reply lost; (5) client crashes after sending the request (orphan, reply to a restarted client).' },
    { q: 'How is hierarchical feedback control used in reliable group multicasting?', a: 'Receivers are partitioned into subgroups organized as a tree; each subgroup has a local coordinator that handles retransmission requests; if the coordinator misses m it asks the coordinator of the parent/sender subgroup. ACK/NACK only between coordinators → fewer feedback messages, scalable.' },
    { q: 'Explain the two ways to arrange the replication of a fault-tolerant group of processes.', a: 'Flat group: leaderless, decisions made collectively (e.g. replicated-write). Hierarchical group: one elected coordinator and workers; the coordinator decides who does the job (e.g. primary-based).' }
  ]
});
