DAT110.addModule({
  id: 'mutex',
  title: 'Gjensidig utelukkelse og valgalgoritmer',
  source: 'van Steen & Tanenbaum kap. 5.3–5.3.5 og 5.4–5.4.2 (+ prosjekt 3 task 7)',
  exam: 'Oppgave 1 («2(N−1) messages» – spurt i mai 2022, mai 2024, juni 2025!) og Oppgave 2 (prosjekt 3: mutex og Lamport)',
  goals: [
    'Forklare problemet med gjensidig utelukkelse i distribuerte systemer',
    'Beskrive sentralisert, distribuert (Ricart-Agrawala), token ring og desentralisert algoritme',
    'Kunne antall meldinger, forsinkelse og feilproblemer for hver',
    'Koble den distribuerte algoritmen til MutualExclusion i prosjekt 3',
    'Forklare bully- og ring-valgalgoritmene'
  ],
  sections: [
    {
      id: 'mutex-1',
      title: 'Sentralisert og distribuert algoritme',
      html: `
<p>Når flere prosesser vil bruke en delt ressurs (f.eks. oppdatere samme fil), må bare én om gangen være i den <b>kritiske regionen (CS)</b>. To hovedtyper løsninger: <b>tillatelsesbaserte</b> (be om lov) og <b>token-baserte</b> (den som har token får gå inn).</p>
<h3>1. Sentralisert</h3>
<p>Én <b>koordinator</b>. Prosessen sender <code>REQUEST</code>; koordinatoren svarer <code>GRANT</code> hvis ingen er inne, ellers køer den forespørselen (og svarer ikke, eller sender «denied»). Ved utgang: <code>RELEASE</code>.</p>
<ul>
  <li><b>3 meldinger</b> per inn/ut (request, grant, release). Forsinkelse før inngang: <b>2</b> meldingstider.</li>
  <li>Rettferdig (FIFO), ingen utsulting, enkel.</li>
  <li><b>Problem</b>: koordinatoren er <b>ett feilpunkt</b> og en <b>flaskehals</b> (skalerer dårlig). En blokkert prosess kan ikke skille «død koordinator» fra «ikke din tur».</li>
</ul>
<h3>2. Distribuert (Ricart & Agrawala)</h3>
<p>Ingen koordinator. Bygger på <b>totalt ordnede Lamport-tidsstempler</b>.</p>
<ol class="steps">
  <li>Prosessen som vil inn, sender <code>REQUEST(ressurs, sitt nummer, Lamport-tid)</code> til <b>alle andre</b>.</li>
  <li>En mottaker gjør ett av tre:
    <ul>
      <li><b>Er ikke i CS og vil ikke inn</b> → svar <b>OK</b>.</li>
      <li><b>Er i CS</b> → svar ikke, <b>legg forespørselen i kø</b>.</li>
      <li><b>Vil inn selv, men er ikke inne ennå</b> → sammenlign tidsstempler: <b>lavest vinner</b>. Har avsenderen lavest → send OK; ellers kø.</li>
    </ul></li>
  <li>Prosessen går inn når den har fått <b>OK fra alle N − 1</b>.</li>
  <li>Ved utgang sendes OK til alle i køen.</li>
</ol>
<div class="callout exam"><span class="ct">«Which mutual exclusion algorithm requires 2·(N−1) messages?»</span><b>Distributed</b>. N − 1 REQUEST + N − 1 OK = <b>2(N−1)</b>. Spurt i 3 eksamener + Canvas.</div>
<div class="callout warn"><span class="ct">Paradokset</span>Den distribuerte algoritmen har <b>N feilpunkter</b> (en hvilken som helst krasjet prosess svarer aldri → ingen kommer inn), og alle prosesser må håndtere alle forespørsler. Den er altså både tregere, mer komplisert og mindre robust enn den sentraliserte!</div>
<div class="callout"><span class="ct">Prosjekt 3 – MutualExclusion.java</span>
Nøyaktig denne algoritmen. <code>onMutexRequestReceived</code> velger <code>caseid</code>:
<b>0</b>: ikke i CS og vil ikke (<code>!CS_BUSY &amp;&amp; !WANTS_TO_ENTER_CS</code>) → send ACK · <b>1</b>: i CS (<code>CS_BUSY</code>) → kø · <b>2</b>: vil inn → sammenlign klokker (Lamport), ved likhet laveste node-ID, laveste vinner.
Prosessen får oppdatere filen når <code>areAllMessagesReturned(numvoters)</code> er sann (alle replikaene har stemt ja) – deretter <code>broadcastUpdatetoPeers</code> og <code>multicastReleaseLocks</code>.</div>
`,
      quiz: [
        { q: 'Hvilken mutex-algoritme krever 2·(N−1) meldinger for at en prosess skal komme inn i kritisk region?', o: ['Distribuert', 'Sentralisert', 'Token ring', 'Desentralisert'], a: [0], e: '(N−1) requests + (N−1) OK.' },
        { q: 'Hvilken mutex-algoritme har N feilpunkter?', o: ['Desentralisert', 'Sentralisert', 'Token ring', 'Distribuert'], a: [3], e: 'Alle må svare – én krasj blokkerer alle.' },
        { q: 'Den sentraliserte mutex-algoritmen kan få skaleringsproblemer.', o: ['Sant', 'Usant'], a: [0], e: 'Koordinatoren blir en flaskehals.' },
        { q: 'I Ricart-Agrawala vil både P (ts 8) og Q (ts 12) inn. Q mottar P sin forespørsel. Hva gjør Q?', o: ['Køer den', 'Sender OK, fordi P har lavere tidsstempel', 'Ignorerer den', 'Går inn i CS'], a: [1], e: 'Lavest tidsstempel vinner.' },
        { q: 'Hvor mange meldinger trengs i den sentraliserte algoritmen per inn/ut av CS?', o: ['1', '2', '3', '2(N−1)'], a: [2], e: 'Request, grant, release.' }
      ]
    },
    {
      id: 'mutex-2',
      title: 'Token ring og desentralisert algoritme',
      html: `
<h3>3. Token ring</h3>
<p>Prosessene er organisert i en <b>logisk ring</b>. Et <b>token</b> sirkulerer; bare den som har token kan gå inn i CS. Vil den ikke, sendes token videre.</p>
<ul>
  <li>Meldinger per inngang: <b>1 … ∞</b> (token går rundt også når ingen vil inn).</li>
  <li>Forsinkelse: <b>0 … N−1</b> meldingstider.</li>
  <li>Problemer: <b>tapt token</b> (vanskelig å oppdage – kanskje noen bare bruker det lenge) og krasjede prosesser (må hoppes over).</li>
</ul>
<h3>4. Desentralisert (voting)</h3>
<p>Ressursen er replikert N ganger med en koordinator per replika. For å få tilgang trengs <b>flertall: m &gt; N/2</b> stemmer. En koordinator som krasjer og glemmer stemmen sin kan gi feil, men sannsynligheten er liten.</p>
<ul><li>Problemer: mange meldinger under konkurranse, mulig <b>utsulting</b> (starvation) og lav utnyttelse.</li></ul>
<h3>Sammenligning (van Steen)</h3>
<div class="table-wrap"><table>
<tr><th>Algoritme</th><th>Meldinger per inn/ut</th><th>Forsinkelse før inngang</th><th>Problem</th></tr>
<tr><td>Sentralisert</td><td><b>3</b></td><td>2</td><td>Koordinator krasjer (1 feilpunkt)</td></tr>
<tr><td>Distribuert</td><td><b>2(N−1)</b></td><td>2(N−1)</td><td>Hvilken som helst prosess krasjer (N feilpunkter)</td></tr>
<tr><td>Token ring</td><td><b>1 … ∞</b></td><td>0 … N−1</td><td>Tapt token, prosess krasjer</td></tr>
<tr><td>Desentralisert</td><td>2kN + (k−1)N/2 + N, k = 1, 2, …</td><td>2kN + (k−1)N/2</td><td>Utsulting, lav effektivitet</td></tr>
</table></div>
`,
      quiz: [
        { q: 'Hvor mange meldinger trengs per inngang i token ring?', o: ['Alltid 1', '1 til ∞', '2(N−1)', '3'], a: [1], e: 'Token sirkulerer selv om ingen vil inn.' },
        { q: 'Hva er hovedproblemet med token ring?', o: ['Tapt token og krasjede prosesser', 'For mange meldinger per inngang alltid', 'Krever global klokke', 'Utsulting'], a: [0], e: 'Et tapt token er vanskelig å oppdage.' },
        { q: 'Hvor mange stemmer trengs i den desentraliserte algoritmen med N koordinatorer?', o: ['1', 'm > N/2 (flertall)', 'N', 'N−1'], a: [1], e: 'Majoritetsstemme.' }
      ]
    },
    {
      id: 'mutex-3',
      title: 'Valgalgoritmer: bully og ring',
      html: `
<p>Mange algoritmer trenger en <b>koordinator</b>. Når den krasjer, må en ny <b>velges</b>. Antakelse: alle prosesser har en unik ID, og vi vil velge den <b>levende prosessen med høyest ID</b>.</p>
<h3>Bully-algoritmen</h3>
<ol class="steps">
  <li>P oppdager at koordinatoren ikke svarer. P sender <code>ELECTION</code> til alle prosesser med <b>høyere</b> ID.</li>
  <li>Svarer ingen → P vinner og sender <code>COORDINATOR</code> til alle.</li>
  <li>Svarer en høyere prosess (OK) → den tar over valget, og P er ferdig.</li>
  <li>Til slutt gjenstår den høyeste levende – «bøllen» – som kunngjør seg selv.</li>
</ol>
<div class="callout example"><span class="ct">Eksempel</span>Prosesser 0–7, koordinator 7 krasjer. 4 oppdager det og sender ELECTION til 5, 6, 7. 5 og 6 svarer OK. 5 sender til 6 og 7; 6 svarer. 6 sender til 7 – ingen svar → <b>6 blir koordinator</b> og sender COORDINATOR til alle.</div>
<h3>Ring-algoritmen</h3>
<ol class="steps">
  <li>Prosessene er i en logisk ring. Den som oppdager feilen sender <code>ELECTION</code> med sin ID til neste levende i ringen.</li>
  <li>Hver mottaker legger til sin ID og sender videre (hopper over døde).</li>
  <li>Når meldingen kommer tilbake til initiativtakeren, velges <b>høyeste ID i listen</b>, og en <code>COORDINATOR</code>-melding sendes rundt.</li>
</ol>
<p>Starter flere valg samtidig, får man flere meldinger rundt, men alle ender med samme resultat.</p>
`,
      quiz: [
        { q: 'I bully-algoritmen – hvem sender P sin ELECTION-melding til?', o: ['Alle prosesser', 'Bare prosesser med høyere ID', 'Bare prosesser med lavere ID', 'Bare koordinatoren'], a: [1], e: 'Bare høyere ID-er kan «overta».' },
        { q: 'Prosesser 1–8, koordinator 8 krasjer, 3 oppdager det. 7 er levende. Hvem blir ny koordinator?', o: ['3', '7', '8', '1'], a: [1], e: 'Høyeste levende ID.' },
        { q: 'I ring-algoritmen – hva skjer når ELECTION-meldingen kommer tilbake til initiativtakeren?', o: ['Den med lavest ID velges', 'Høyeste ID i listen velges, og COORDINATOR sendes rundt', 'Valget starter på nytt', 'Alle blir koordinatorer'], a: [1], e: '' }
      ]
    }
  ],
  summary: [
    'Kritisk region: bare én om gangen. Tillatelsesbasert vs. token-basert.',
    'Sentralisert: 3 meldinger, forsinkelse 2, ett feilpunkt + flaskehals.',
    'Distribuert (Ricart-Agrawala): 2(N−1) meldinger, Lamport-tid, lavest vinner, N feilpunkter. = prosjekt 3 MutualExclusion (case 0/1/2).',
    'Token ring: 1…∞ meldinger, forsinkelse 0…N−1, tapt token.',
    'Desentralisert: flertall m > N/2 av replikakoordinatorer; utsulting/lav effektivitet.',
    'Bully: ELECTION til høyere ID-er; ingen svar → vinner. Ring: ELECTION samler ID-er rundt ringen; høyeste vinner.'
  ],
  formulas: [
    { name: 'Distribuert mutex', expr: 'meldinger = 2(N − 1)', note: 'N−1 requests + N−1 OK' },
    { name: 'Sentralisert mutex', expr: 'meldinger = 3', note: 'request, grant, release' },
    { name: 'Desentralisert', expr: 'stemmer m > N/2', note: '' }
  ],
  examQA: [
    { q: 'In which task of project 3 was LamportClock used, and for what purpose?', a: 'In the distributed mutual exclusion task. The Lamport clock gave timestamps and a total ordering to the messages exchanged; the process with the lowest timestamp enters the critical region.' },
    { q: 'What approaches are used in ChordDHT (project 3) to avoid concurrent modification of a file by multiple processes?', a: 'Remote-write protocol (primary-based) and the distributed mutual exclusion algorithm.' }
  ]
});
