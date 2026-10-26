DAT110.addModule({
  id: 'consistency',
  title: 'Konsistens og replikering',
  source: 'van Steen & Tanenbaum kap. 7.1, 7.2 (til s. 402), 7.3–7.3.4, 7.5–7.5.2 (+ prosjekt 3 task 6)',
  exam: 'Oppgave 9 (replikering, kausal konsistens, primary-based vs replicated-write, data- vs klientsentrisk) og Oppgave 1 (quorum, continuous, cache coherence)',
  goals: [
    'Forklare grunnene til replikering og hvorfor konsistens er en kostnad',
    'Forklare continuous consistency og de tre avviksmålene',
    'Avgjøre om en historikk er sekvensielt eller kausalt konsistent',
    'Kjenne de fire klientsentriske modellene med eksempler',
    'Skille primary-based (remote-write, local-write) og replicated-write (aktiv, quorum)',
    'Forklare remote-write-protokollen i prosjekt 3'
  ],
  sections: [
    {
      id: 'consistency-1',
      title: 'Hvorfor replikere?',
      html: `
<div class="table-wrap"><table>
<tr><th>Grunn</th><th>Forklaring (eksamenssvar jan 2024 9b / juni 2025 9d)</th></tr>
<tr><td><b>Feiltoleranse / pålitelighet</b></td><td>Krasjer en replika, bytter vi til en annen. Beskytter også mot korrupte data (flertall av kopier).</td></tr>
<tr><td><b>Ytelse</b></td><td>Data nær brukerne (geografisk skala); flere replikaer deler lasten (størrelsesskala, lastbalansering).</td></tr>
<tr><td><b>Skalerbarhet</b></td><td>Unngår flaskehals i én hovedserver – lasten fordeles mellom replikaene.</td></tr>
<tr><td><b>Tilgjengelighet</b></td><td>Data lagret flere steder er tilgjengelige selv om noen steder er nede.</td></tr>
</table></div>
<div class="callout warn"><span class="ct">Prisen: konsistens</span>Når én kopi endres, er de andre ikke lenger like. Å holde alle kopier strengt like krever global synkronisering (atomiske oppdateringer) – som selv er dyrt og skalerer dårlig. Løsning: <b>slakke på konsistensen</b>. Hvor mye avhenger av <b>lese- og skrivemønsteret</b> til dataene og <b>hva dataene brukes til</b>.</div>
<p>En <b>konsistensmodell</b> er en <b>kontrakt</b> mellom prosessene og datalageret: følger prosessene visse regler, lover lageret å oppføre seg på en bestemt måte.</p>
`,
      quiz: [
        { q: 'Hva kan være grunner til replikering?', o: ['Forbedre brukervennlighet', 'Forbedre ytelse', 'Øke pålitelighet', 'Forbedre tilgjengelighet'], a: [1, 2, 3], e: 'Brukervennlighet er ikke en replikeringsgrunn.' },
        { q: 'Hvilke faktorer bestemmer hvor mye vi kan slakke på konsistensen?', o: ['Antall tilgjengelige replikaservere', 'Hvilke kommunikasjonsprotokoller som finnes', 'Lese- og skrivemønsteret til de replikerte dataene', 'Hva dataene brukes til'], a: [2, 3], e: 'van Steen: «depends on access and update patterns and on the purpose for which the data is used».' }
      ]
    },
    {
      id: 'consistency-2',
      title: 'Datasentrisk konsistens: continuous, sekvensiell og kausal',
      html: `
<h3>Continuous consistency</h3>
<p>I stedet for «konsistent / ikke konsistent» gir continuous consistency en måte å <b>måle og spesifisere hvor mye inkonsistens en applikasjon tåler</b>. Tre akser (per <i>conit</i> – consistency unit):</p>
<ul>
  <li><b>Numerisk avvik</b>: hvor mye verdiene kan avvike (f.eks. aksjekurs ±0,02 kr, eller antall ikke-propagerte oppdateringer).</li>
  <li><b>Alder/staleness-avvik</b>: hvor gammel en kopi kan være (værdata oppdatert hver time).</li>
  <li><b>Ordningsavvik</b>: hvor mange tentative (ikke-endelig ordnede) oppdateringer som kan være utestående.</li>
</ul>
<h3>Notasjon</h3>
<p><code>W(x)a</code> = skriv verdien a til x. <code>R(x)a</code> = les x og få a. Tiden går mot høyre.</p>
<h3>Sekvensiell konsistens</h3>
<div class="callout">Resultatet av enhver kjøring er som om operasjonene til alle prosessene ble utført i <b>en eller annen sekvensiell rekkefølge</b>, og operasjonene til hver prosess opptrer i denne rekkefølgen i programrekkefølge. <b>Alle prosesser ser samme rekkefølge</b> av skrivinger.</div>
<div class="compare">
<div><h4>✔ Sekvensielt konsistent</h4><pre>P1: W(x)a
P2:    W(x)b
P3:         R(x)b   R(x)a
P4:         R(x)b   R(x)a</pre><p class="small">Alle ser b før a – OK (rekkefølgen trenger ikke følge sanntid).</p></div>
<div><h4>✘ Ikke sekvensielt konsistent</h4><pre>P1: W(x)a
P2:    W(x)b
P3:         R(x)b   R(x)a
P4:         R(x)a   R(x)b</pre><p class="small">P3 og P4 ser skrivingene i ulik rekkefølge.</p></div>
</div>
<h3>Kausal konsistens</h3>
<div class="callout">Skrivinger som er <b>potensielt kausalt relatert</b> må ses av alle prosesser i <b>samme rekkefølge</b>. <b>Samtidige</b> skrivinger kan ses i ulik rekkefølge av ulike prosesser.</div>
<p>To skrivinger er kausalt relatert hvis f.eks. en prosess <b>leste</b> verdien fra den første før den gjorde den andre skrivingen (b kan avhenge av a).</p>
<div class="compare">
<div><h4>✘ Bryter kausal konsistens (mai 2022 9c, juni 2025 9c)</h4><pre>P1: W(x)a
P2:      R(x)a  W(x)b
P3:                    R(x)b  R(x)a
P4:                    R(x)a  R(x)b</pre><p class="small"><b>P2 leste a før den skrev b</b> → b avhenger kausalt av a. Alle må se a før b. Men <b>P3 ser b før a</b> → brudd.</p></div>
<div><h4>✔ Kausalt (men ikke sekvensielt) konsistent</h4><pre>P1: W(x)a
P2:      W(x)b
P3:              R(x)b  R(x)a
P4:              R(x)a  R(x)b</pre><p class="small">Ingen leste a før b ble skrevet → a og b er <b>samtidige</b> → ulik rekkefølge er lov.</p></div>
</div>
<div class="callout exam"><span class="ct">Modellsvar</span>«The data-store violates causal consistency because the data item b causally depends on a. Therefore, every process that uses this data-store must see a before b. However, in P3, b was seen before a.»</div>
`,
      quiz: [
        { q: 'Continuous consistency-modellen kan gi …', o: ['rekkefølgen operasjoner skal ha på replikaene', 'en måte å måle og spesifisere nivået av inkonsistens en applikasjon tåler', 'eventual consistency for replikerte data'], a: [1], e: 'Numerisk, staleness og ordningsavvik.' },
        { q: 'P1: W(x)a · P2: R(x)a W(x)b · P3: R(x)b R(x)a · P4: R(x)a R(x)b. Er dette kausalt konsistent?', o: ['Ja', 'Nei – b avhenger av a, men P3 ser b før a'], a: [1], e: 'P2 leste a før den skrev b.' },
        { q: 'P1: W(x)a · P2: W(x)b · P3: R(x)b R(x)a · P4: R(x)a R(x)b. Hvilken modell er oppfylt?', o: ['Både sekvensiell og kausal', 'Kausal, men ikke sekvensiell', 'Sekvensiell, men ikke kausal', 'Ingen'], a: [1], e: 'Samtidige skrivinger kan ses i ulik rekkefølge under kausal; sekvensiell krever lik rekkefølge.' },
        { q: 'Hva krever sekvensiell konsistens?', o: ['At alle prosesser ser alle skrivinger i samme rekkefølge (en eller annen sekvensiell rekkefølge)', 'At skrivinger ses i sanntidsrekkefølge', 'At bare kausalt relaterte skrivinger ordnes', 'At alle replikaer oppdateres samtidig'], a: [0], e: 'Samme interleaving for alle, programrekkefølge per prosess.' }
      ]
    },
    {
      id: 'consistency-3',
      title: 'Klientsentrisk konsistens',
      html: `
<p><b>Datasentrisk</b> konsistens handler om å holde <b>hele datalageret</b> konsistent for alle replikaer og prosesser. <b>Klientsentrisk</b> konsistens gir garantier for <b>én enkelt klient</b> som beveger seg mellom replikaer (f.eks. en mobil bruker) – og bryr seg ikke om samtidige skrivinger fra ulike klienter.</p>
<div class="callout exam"><span class="ct">Modellsvar (mai 2022 9d / jan 2025 9c)</span>«Data-centric consistency is about maintaining system-wide data consistency for all replicas in the data-store and does not focus on a single client. Client-centric consistency seeks to provide consistency for a single client that moves from one replica to another.»</div>
<h3>Eventual consistency</h3>
<p>Hvis det ikke skjer flere oppdateringer, vil alle replikaer <b>etter hvert</b> bli like. Passer når det er få skrivekonflikter (f.eks. DNS, web-cacher). Problemet: en mobil bruker kan se «gamle» data når hun bytter replika – derfor de fire modellene under.</p>
<div class="table-wrap"><table>
<tr><th>Modell</th><th>Garanti</th><th>Eksempel</th></tr>
<tr><td><b>Monotonic reads</b></td><td>Har en prosess lest en verdi av x, vil senere lesinger aldri gi en <b>eldre</b> verdi</td><td>E-post: ser du en melding i Bergen, ser du den også når du logger inn fra Oslo</td></tr>
<tr><td><b>Monotonic writes</b></td><td>En skriving fra en prosess på x er fullført før neste skriving på x fra samme prosess</td><td>Programvarebibliotek: versjon 2 må ikke legges inn før versjon 1</td></tr>
<tr><td><b>Read your writes</b></td><td>Effekten av en skriving ses alltid av senere lesinger fra <b>samme</b> prosess</td><td>Endrer du passord, virker det nye passordet straks – også på en annen replika</td></tr>
<tr><td><b>Writes follow reads</b></td><td>En skriving etter en lesing av x skjer på en like ny eller nyere verdi enn den som ble lest</td><td>Svar i et nyhetsforum vises bare der det opprinnelige innlegget også er synlig</td></tr>
</table></div>
`,
      quiz: [
        { q: 'Monotonic-read-modellen garanterer at …', o: ['når en prosess har sett en verdi av x, vil den aldri se en eldre versjon av x', 'en skriving fullføres før neste skriving fra samme prosess', 'oppdateringer propageres som følge av tidligere skrivinger'], a: [0], e: 'Ingen «tilbakehopp» i lesing.' },
        { q: 'En klient endrer passordet på én replika og ser endringen straks på en annen replika. Hvilken modell?', o: ['Read your writes', 'Monotonic writes', 'Monotonic reads', 'Writes follow reads'], a: [0], e: 'Egne skrivinger skal være synlige for egne lesinger.' },
        { q: 'Klientsentrisk konsistens handler om …', o: ['Å gi konsistens for én klient som aksesserer ulike replikaer', 'Å sikre et systemomfattende konsistent bilde av datalageret', 'Begge deler'], a: [0], e: 'Datasentrisk = systemomfattende.' }
      ]
    },
    {
      id: 'consistency-4',
      title: 'Konsistensprotokoller: primary-based og replicated-write',
      html: `
<div class="callout"><span class="ct">Kjerneforskjellen (mai 2022 9a / mai 2023 9c)</span>I <b>primary-based</b> protokoller kan skrivinger til et dataelement bare utføres av <b>én prosess</b> (single-leader). I <b>replicated-write</b> protokoller kan skrivinger utføres av <b>flere prosesser</b> (multi-leader).</div>
<h3>Primary-based</h3>
<div class="compare">
<div><h4>Remote-write (primary-backup)</h4><p>Hvert dataelement x har en <b>fast primær</b>. Alle skrivinger <b>videresendes til primæren</b>, som utfører dem og ber backupene oppdatere, venter på ACK, og svarer klienten. Lesing kan skje lokalt. Primæren kan ordne alle skrivinger → enkel implementasjon av <b>sekvensiell konsistens</b>. Ulempe: skriving blokkerer lenge.</p></div>
<div><h4>Local-write</h4><p>Primærrollen <b>flytter</b> til prosessen som vil skrive. Mange påfølgende skrivinger kan da gjøres lokalt. Nyttig for mobile/frakoblede klienter.</p></div>
</div>
<div class="figure"><svg viewBox="0 0 560 200" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="arC" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="aha"/></marker></defs>
  <rect x="20" y="80" width="80" height="36" rx="8" class="bx"/><text x="60" y="103" text-anchor="middle" class="txs">Klient</text>
  <rect x="200" y="80" width="110" height="40" rx="8" class="bx2"/><text x="255" y="104" text-anchor="middle" class="txa">Primær</text>
  <rect x="420" y="20" width="110" height="34" rx="8" class="bxg"/><text x="475" y="42" text-anchor="middle" class="txs">Backup 1</text>
  <rect x="420" y="83" width="110" height="34" rx="8" class="bxg"/><text x="475" y="105" text-anchor="middle" class="txs">Backup 2</text>
  <rect x="420" y="146" width="110" height="34" rx="8" class="bxg"/><text x="475" y="168" text-anchor="middle" class="txs">Backup 3</text>
  <line x1="100" y1="92" x2="200" y2="92" class="lna" marker-end="url(#arC)"/><text x="150" y="86" text-anchor="middle" class="txs">1 W(x)</text>
  <line x1="310" y1="92" x2="420" y2="40" class="lna" marker-end="url(#arC)"/><line x1="310" y1="100" x2="420" y2="100" class="lna" marker-end="url(#arC)"/><line x1="310" y1="108" x2="420" y2="160" class="lna" marker-end="url(#arC)"/>
  <text x="365" y="60" class="txs">2 oppdater</text><text x="370" y="140" class="txs">3 ACK</text>
  <line x1="200" y1="112" x2="100" y2="112" class="lng" marker-end="url(#arC)"/><text x="150" y="128" text-anchor="middle" class="txs">4 ACK skriv</text>
</svg><figcaption>Remote-write: all skriving går via primæren for x.</figcaption></div>
<h3>Replicated-write</h3>
<ul>
  <li><b>Aktiv replikering</b>: operasjonen sendes til <b>alle</b> replikaer, som utfører den. Hovedutfordring: <b>operasjonene må utføres i samme rekkefølge overalt</b> → totalt ordnet multicast (Lamport) eller en sekvenserer.</li>
  <li><b>Quorum-basert</b> (majoritetsavstemning): for å lese må man samle et lese-quorum N<sub>R</sub>, for å skrive et skrive-quorum N<sub>W</sub>, med
    <span class="formula">N_R + N_W &gt; N      (hindrer lese-skrive-konflikt)
N_W &gt; N/2           (hindrer skrive-skrive-konflikt)</span>
    Eks. N = 12: N<sub>R</sub> = 3, N<sub>W</sub> = 10 ✔. N<sub>R</sub> = 7, N<sub>W</sub> = 6 ✘ (6 ≤ 12/2 → to skrivinger kan begge få quorum). ROWA: N<sub>R</sub> = 1, N<sub>W</sub> = N.</li>
</ul>
<div class="callout exam"><span class="ct">Eksempler (mai 2022 9b)</span><b>Primary-based</b>: local-write eller remote-write. <b>Replicated-write</b>: aktiv replikering eller quorum-basert. «A replicated-write protocol based on majority voting» → <b>Quorum-based protocol</b> (mai 2024, juni 2025).</div>
<h3>Cache-koherens</h3>
<p>Når data caches lokalt hos klienter, kan serveren <b>sende invalidering til alle cacher</b> når et dataelement endres (Canvas: <b>True</b>). Alternativt propageres selve oppdateringen.</p>
<h3>Prosjekt 3: remote-write på Chord</h3>
<p>Hver fil replikeres 4 ganger. Én replika merkes tilfeldig som <b>primær</b> (<code>primaryServer = true</code>) i <code>distributeReplicastoPeers</code>. <code>findPrimaryOfItem()</code> finner primæren blant nodene som har filen; klienten sender oppdateringen til primæren (<code>requestRemoteWriteOperation</code>), som koordinerer at de andre replikaene oppdateres (<code>broadcastUpdatetoPeers</code>). Dette gir <b>sekvensiell konsistens</b> (mai 2023 2d–e).</p>
`,
      quiz: [
        { q: 'En replicated-write-protokoll basert på majoritetsavstemning kalles …', o: ['Local-write', 'Aktiv replikering', 'Quorum-basert protokoll', 'Koherensbasert protokoll'], a: [2], e: 'N_R + N_W > N, N_W > N/2.' },
        { q: 'I remote-write-protokoller …', o: ['har hvert dataelement en primærserver', 'ordnes operasjonene i en sekvensiell rekkefølge', 'må alle skriveoperasjoner videresendes til én server'], a: [0, 1, 2], e: 'Alle tre stemmer – derfor gir den sekvensiell konsistens.' },
        { q: 'Hovedutfordringen med aktiv replikering er at …', o: ['den ikke er feiltolerant', 'kommunikasjonen kan være upålitelig', 'hendelser må ordnes likt på alle replikaer'], a: [2], e: 'Totalt ordnet multicast trengs.' },
        { q: 'I replicated-write-protokoller …', o: ['kan skriveoperasjoner utføres på flere replikaer', 'kan skriveoperasjoner bare utføres på én replika', 'begge'], a: [0], e: 'Multi-leader.' },
        { q: 'I primary-based protokoller …', o: ['kan oppdateringer bare utføres på én replika (primæren)', 'kan oppdateringer utføres på flere replikaer', 'begge'], a: [0], e: 'Single-leader.' },
        { q: 'N = 10 replikaer. Hvilket quorum er gyldig?', o: ['N_R = 3, N_W = 5', 'N_R = 4, N_W = 7', 'N_R = 5, N_W = 5', 'N_R = 2, N_W = 8'], a: [1], e: '4+7 = 11 > 10 og 7 > 5. (2+8 = 10 er ikke > 10; 5 er ikke > 5.)' },
        { q: 'Hvilken konsistensprotokoll ble implementert i prosjekt 3?', o: ['Quorum-basert', 'Remote-write (primary-based)', 'Aktiv replikering', 'Eventual consistency'], a: [1], e: 'Mai 2023 2d.' }
      ]
    }
  ],
  summary: [
    'Replikering gir feiltoleranse, ytelse, skalerbarhet, tilgjengelighet – men koster konsistens.',
    'Hvor mye konsistens kan slakkes: avhenger av lese/skrivemønster og hva dataene brukes til.',
    'Continuous consistency: mål/spesifiser tålt inkonsistens (numerisk, staleness, ordning).',
    'Sekvensiell: alle ser samme rekkefølge. Kausal: kausalt relaterte skrivinger i samme rekkefølge; samtidige kan variere.',
    'Datasentrisk = systemomfattende; klientsentrisk = én klient som flytter mellom replikaer.',
    'Klientsentrisk: monotonic reads, monotonic writes, read your writes, writes follow reads (+ eventual).',
    'Primary-based (single-leader): remote-write, local-write. Replicated-write (multi-leader): aktiv (total orden), quorum (N_R+N_W>N, N_W>N/2).',
    'Prosjekt 3: remote-write – tilfeldig primær per fil, findPrimaryOfItem, oppdatering via primæren.'
  ],
  formulas: [
    { name: 'Quorum lese-skrive', expr: 'N_R + N_W > N', note: '' },
    { name: 'Quorum skrive-skrive', expr: 'N_W > N/2', note: '' }
  ],
  examQA: [
    { q: 'Explain briefly the difference between primary-based and replicated-write protocols.', a: 'In primary-based protocols, writes to a data item can only be performed by one process (single-leader). In replicated-write protocols, writes can be performed by more than one process (multi-leader).' },
    { q: 'Give one example each of a primary-based and a replicated-write protocol.', a: 'Primary-based: remote-write or local-write. Replicated-write: active replication or quorum-based protocols.' },
    { q: 'Explain whether the data-store violates causal consistency.', a: 'Identifiser om en prosess leste a før den skrev b (da avhenger b kausalt av a). Hvis noen prosess ser b før a → brudd. Ellers (samtidige skrivinger) er ulik rekkefølge tillatt.' },
    { q: 'Explain the reasons for replication in distributed systems.', a: 'Fault-tolerance (switch to another replica on crash), performance (data close to users; load balancing), scalability (avoid bottleneck at main server), availability (data stored at several locations).' },
    { q: 'Explain the difference between data-centric and client-centric consistency.', a: 'Data-centric maintains system-wide consistency for all replicas and does not focus on a single client; client-centric provides consistency for a single client moving from one replica to another.' }
  ]
});
