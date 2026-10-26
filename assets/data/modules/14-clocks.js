DAT110.addModule({
  id: 'clocks',
  title: 'Klokkesynkronisering og logiske klokker',
  source: 'van Steen & Tanenbaum kap. 5.1–5.2',
  exam: 'Oppgave 9 (vektorklokker: mai 2023, jan 2024, mai 2024, juni 2025 – nesten hvert år!) og Oppgave 1 (Lamport, accuracy/precision)',
  goals: [
    'Forklare hvorfor fysiske klokker driver, og skille accuracy og precision',
    'Forklare Cristian/NTP og Berkeley-algoritmen',
    'Definere happens-before (→) og samtidige hendelser',
    'Regne Lamport-klokker og vite hva de (ikke) kan si',
    'Regne vektorklokker med eksamensreglene og avgjøre kausalitet'
  ],
  sections: [
    {
      id: 'clocks-1',
      title: 'Fysiske klokker og synkronisering',
      html: `
<p>Hver maskin har en krystallklokke som tikker litt for fort eller for sakte (<b>drift</b>). Etter en stund viser klokkene ulik tid (<b>skew</b>). Det er et problem når f.eks. <code>make</code> sammenligner tidsstempler på filer fra ulike maskiner.</p>
<div class="compare">
  <div><h4>Precision (presisjon)</h4><p>Holde avviket mellom klokkene til <b>to maskiner i systemet</b> innenfor en grense π: |C<sub>p</sub>(t) − C<sub>q</sub>(t)| ≤ π. → <b>Intern</b> synkronisering.</p></div>
  <div><h4>Accuracy (nøyaktighet)</h4><p>Holde avviket mellom <b>en maskins klokke og en referanse (UTC)</b> innenfor en grense α: |C<sub>p</sub>(t) − t| ≤ α. → <b>Ekstern</b> synkronisering.</p></div>
</div>
<div class="callout exam"><span class="ct">Canvas-quiz – fellen</span>«Accuracy is keeping the difference between UTC and the clock for a machine bound» ✔ og «Precision is keeping the deviation between the clocks of two machines within a bound» ✔. De to andre alternativene bytter om på begrepene.</div>
<h3>Cristian / NTP</h3>
<p>Klienten A spør en tidsserver B. A noterer T1 (sendt) og T4 (mottatt); B noterer T2 (mottatt) og T3 (sendt):</p>
<span class="formula">offset θ = ((T2 − T1) + (T3 − T4)) / 2       forsinkelse δ = ((T4 − T1) − (T3 − T2)) / 2</span>
<p>Antar at forsinkelsen er lik begge veier. NTP organiserer servere i <b>strata</b> (stratum 1 har atomklokke/GPS).</p>
<h3>Berkeley-algoritmen</h3>
<p>Ingen maskin har UTC. En <b>tidsdemon</b> spør alle om deres tid, beregner <b>gjennomsnittet</b>, og forteller hver maskin hvor mye den skal justere. Målet er at alle er <b>enige</b> (precision), ikke nødvendigvis riktig (accuracy).</p>
<div class="callout warn"><span class="ct">Aldri still klokka bakover!</span>Tiden må være monoton. Går klokka for fort, <b>senkes tikkehastigheten</b> gradvis i stedet.</div>
`,
      quiz: [
        { q: 'Hvilke utsagn om klokkesynkronisering stemmer?', o: ['Accuracy: holde forskjellen mellom UTC og en maskins klokke innenfor en grense', 'Accuracy: holde avviket mellom to maskiners klokker innenfor en grense', 'Precision: holde forskjellen mellom UTC og en maskins klokke innenfor en grense', 'Precision: holde avviket mellom to maskiners klokker innenfor en grense'], a: [0, 3], e: 'Accuracy = ekstern (mot UTC). Precision = intern (mellom maskiner).' },
        { q: 'Hva gjør Berkeley-algoritmen?', o: ['Henter tid fra en atomklokke', 'En tidsdemon spør alle maskiner, beregner gjennomsnitt og ber hver justere seg', 'Bruker Lamport-tidsstempler', 'Stiller alle klokker bakover'], a: [1], e: 'Intern synkronisering uten UTC-kilde.' },
        { q: 'En klokke går for fort. Hva gjør man?', o: ['Stiller den bakover', 'Senker tikkehastigheten gradvis', 'Ignorerer det', 'Restarter maskinen'], a: [1], e: 'Tid må aldri gå bakover.' }
      ]
    },
    {
      id: 'clocks-2',
      title: 'Lamports logiske klokker',
      html: `
<p>Ofte trenger vi ikke den <em>ekte</em> tiden – bare å være <b>enige om rekkefølgen</b> hendelser skjedde i. Lamport definerte relasjonen <b>happens-before (→)</b>:</p>
<ol>
  <li>Hvis a og b er i <b>samme prosess</b> og a kommer før b: <b>a → b</b>.</li>
  <li>Hvis a er <b>sending</b> av en melding og b er <b>mottak</b> av samme melding: <b>a → b</b>.</li>
  <li>Transitiv: a → b og b → c ⇒ a → c.</li>
</ol>
<p>Er verken a → b eller b → a, er a og b <b>samtidige</b> (concurrent): a ∥ b.</p>
<h3>Lamport-algoritmen</h3>
<ol class="steps">
  <li>Før hver hendelse (lokal eller send): <code>C<sub>i</sub> ← C<sub>i</sub> + 1</code>.</li>
  <li>Ved sending: send med tidsstempel ts(m) = C<sub>i</sub>.</li>
  <li>Ved mottak: <code>C<sub>j</sub> ← max(C<sub>j</sub>, ts(m))</code>, deretter steg 1 (+1) og lever meldingen.</li>
</ol>
<div class="callout example"><span class="ct">Canvas-eksempel</span>
<pre>p0:  s1      a       b
p1:  c       r1      s2        (s1 → r1, s2 → r2)
p2:  d       r2      e</pre>
p0: s1 = 1, a = 2, b = 3 · p1: c = 1, r1 = max(1, 1)+1 = <b>2</b>, s2 = 3 · p2: d = 1, r2 = max(1, 3)+1 = 4, e = 5.<br>
Svar: <b>r1 = 2, s1 = 1, a = 2, s2 = 3</b>.</div>
<h3>Hva kan Lamport-klokker si?</h3>
<ul>
  <li><b>a → b ⇒ C(a) &lt; C(b)</b> (alltid).</li>
  <li>Men <b>C(a) &lt; C(b) ⇒ a → b gjelder IKKE</b> generelt (a og b kan være samtidige i ulike prosesser).</li>
  <li>I <b>samme prosess</b> betyr C(a) &lt; C(b) at a kom før b (a → b).</li>
  <li>Total orden: bryt likhet med prosess-ID (C(a), i).</li>
</ul>
<div class="callout"><span class="ct">Totalt ordnet multicast</span>Brukes for å holde replikaer konsistente (aktiv replikering): hver melding tidsstemples, legges i en kø sortert på Lamport-tid, multicastes og kvitteres. En melding leveres først når den er først i køen og er kvittert av alle. Da ser alle replikaer operasjonene i <b>samme rekkefølge</b>. I prosjekt 3 brukes Lamport-klokka i mutex-algoritmen for å gi meldingene tidsstempler og total orden – lavest tidsstempel vinner.</div>
`,
      quiz: [
        { q: 'Hva er ideen bak Lamports logiske klokker?', o: ['Prosessene bruker absolutt tid for å ordne hendelser', 'Prosessene bruker rekkefølgen hendelsene skjedde i i stedet for absolutt tid'], a: [1], e: 'Logisk orden, ikke fysisk tid.' },
        { q: 'Hvilke utsagn om Lamport-klokker C kan være sanne?', o: ['Hvis a er sending og b mottak av samme melding: a → b og C(a) < C(b)', 'Hvis a og b er i samme prosess og C(a) < C(b), så a → b', 'Hvis a og b er i ulike prosesser og C(a) < C(b), så a → b'], a: [0, 1], e: 'Det tredje gjelder ikke – de kan være samtidige.' },
        { q: 'p0: s1, a, b · p1: c, r1, s2 · p2: d, r2, e (s1→r1, s2→r2). Lamport-verdier for r1, s1, a, s2?', o: ['r1=1, s1=0, a=2, s2=3', 'r1=2, s1=1, a=2, s2=3', 'r1=1, s1=1, a=2, s2=2', 'r1=1, s1=0, a=1, s2=2'], a: [1], e: 'Start på 0, +1 før hver hendelse, max ved mottak.' },
        { q: 'I prosjekt 3 – til hva ble LamportClock brukt?', o: ['Til å hashe filnavn', 'Til å gi tidsstempler/total orden på meldinger i mutex-algoritmen, så laveste tidsstempel får gå inn i kritisk region', 'Til å synkronisere med UTC', 'Til fingertabellen'], a: [1], e: 'Mai 2023 2f.' }
      ]
    },
    {
      id: 'clocks-3',
      title: 'Vektorklokker (Oppgave 9!)',
      html: `
<p>Lamport-klokker kan ikke avgjøre kausalitet. <b>Vektorklokker</b> kan: hver prosess P<sub>i</sub> har en vektor VC<sub>i</sub> med én teller per prosess.</p>
<ul>
  <li>VC<sub>i</sub>[i] = antall hendelser som har skjedd i P<sub>i</sub>.</li>
  <li>VC<sub>i</sub>[j] = antall hendelser i P<sub>j</sub> som P<sub>i</sub> vet om (som kan ha påvirket P<sub>i</sub>).</li>
</ul>
<h3>Reglene – akkurat som sensorveiledningen</h3>
<pre>clock ci: [0 0 0 0]
1. pi(ci) &lt;- pi(ci) + 1                          : send- eller lokal hendelse
2. pi(c)  &lt;- max(m(c), pi(c)), deretter regel 1  : mottakshendelse</pre>
<p>Ved mottak: ta <b>elementvis maksimum</b> av egen vektor og vektoren i meldingen (tidsstempelet til send-hendelsen), og øk så <b>egen</b> komponent med 1.</p>
<h3>Fullt eksempel (jan 2024 9d)</h3>
<pre>P1:  a     s1    s2
P2:  b     c     d
P3:  r1    e     s3          s1 → r1,  s2 → r2,  s3 → r3
P4:  r2    r3    f</pre>
<div class="table-wrap"><table class="center mono">
<tr><th></th><th>hendelse 1</th><th>hendelse 2</th><th>hendelse 3</th></tr>
<tr><td>P1</td><td>a = 1000</td><td>s1 = 2000</td><td>s2 = 3000</td></tr>
<tr><td>P2</td><td>b = 0100</td><td>c = 0200</td><td>d = 0300</td></tr>
<tr><td>P3</td><td>r1 = 2010</td><td>e = 2020</td><td>s3 = 2030</td></tr>
<tr><td>P4</td><td>r2 = 3001</td><td>r3 = 3032</td><td>f = 3033</td></tr>
</table></div>
<ul>
  <li><b>r1</b> (P3): max([0,0,0,0], s1=[2,0,0,0]) = [2,0,0,0] → +1 på P3 → <b>[2,0,1,0]</b>.</li>
  <li><b>r2</b> (P4): max([0,0,0,0], s2=[3,0,0,0]) → +1 → <b>[3,0,0,1]</b>.</li>
  <li><b>r3</b> (P4): max([3,0,0,1], s3=[2,0,3,0]) = [3,0,3,1] → +1 → <b>[3,0,3,2]</b>.</li>
</ul>
<div class="callout warn"><span class="ct">Vanlige feil</span>1) Glemme å legge til 1 etter max. 2) Bruke mottakerens vektor <em>etter</em> i stedet for <em>før</em>. 3) Bruke feil send-tidsstempel – bruk vektoren til <b>send-hendelsen</b>, ikke avsenderens nåværende vektor. 4) Regne mottak før sendingen er beregnet: regn i en rekkefølge som respekterer meldingene.</div>
<h3>Sammenligne vektorer</h3>
<ul>
  <li><b>V(a) &lt; V(b)</b> hvis alle komponenter V(a)[k] ≤ V(b)[k] og minst én er strengt mindre → <b>a → b</b> (a skjedde før b, kausalt).</li>
  <li>Hvis verken V(a) ≤ V(b) eller V(b) ≤ V(a) → <b>samtidige</b>.</li>
</ul>
<p>Eks.: e = [2,0,2,0] og b = [0,1,0,0] er samtidige (2 &gt; 0 i første, 0 &lt; 1 i andre). s1 = [2,0,0,0] &lt; f = [3,0,3,3] → s1 → f.</p>
<div class="callout"><span class="ct">Hva forteller [2 4 0 1] ved p4?</span>At 2 hendelser i p1 og 4 hendelser i p2 har skjedd «før» denne hendelsen og kan ha påvirket den (p4 avhenger kausalt av dem), mens ingen hendelser i p3 er kjent, og dette er p4 sin første hendelse.</div>
<h3>Kausalt ordnet multicast</h3>
<p>En melding m fra P<sub>i</sub> leveres hos P<sub>j</sub> først når (1) ts(m)[i] = VC<sub>j</sub>[i] + 1 (det er neste melding fra P<sub>i</sub>) og (2) ts(m)[k] ≤ VC<sub>j</sub>[k] for alle k ≠ i (P<sub>j</sub> har sett alt avsenderen hadde sett).</p>
<p>👉 Øv på tilfeldige hendelsessekvenser i <a href="trening.html#vc">Regnetrening → Vektorklokker</a>.</p>
`,
      quiz: [
        { q: 'Hva kan vektorklokker avgjøre som Lamport-klokker ikke kan?', o: ['Absolutt tid', 'Om to hendelser er kausalt relatert eller samtidige', 'Hvilken prosess som er raskest', 'Nettverksforsinkelse'], a: [1], e: 'Kausalitet kan utledes fra vektorklokker.' },
        { q: 'Hva er nødvendig for å konkludere at hendelse a skjedde før z?', o: ['V(a) > V(z)', 'C(a) < C(z)', 'V(a) < V(z)', 'C(a) > C(z)'], a: [2], e: 'Lamport C(a) < C(z) er ikke tilstrekkelig.' },
        { q: 'P3 har [0,0,1,0] og mottar en melding med tidsstempel [2,2,0,0]. Hva blir P3 sin vektor?', o: ['[2,2,1,0]', '[2,2,2,0]', '[2,2,0,0]', '[3,3,2,1]'], a: [1], e: 'max = [2,2,1,0], +1 på egen komponent → [2,2,2,0].' },
        { q: 'Er [2,0,1,0] og [0,1,0,0] kausalt relatert?', o: ['Ja, den første kom før', 'Ja, den andre kom før', 'Nei, de er samtidige'], a: [2], e: 'Ingen av dem er ≤ den andre i alle komponenter.' },
        { q: 'p0: s1, a, b · p1: c, r1, s2 · p2: d, r2, e (s1→r1, s2→r2). Vektorklokker for r1 og e?', o: ['r1=(1 1 0), e=(2 0 2)', 'r1=(1 2 0), e=(1 3 3)', 'r1=(2 1 0), e=(3 1 1)'], a: [1], e: 'r1 = max((0,1,0),(1,0,0)) + 1 = (1,2,0). r2 = max((0,0,1),(1,3,0)) + 1 = (1,3,2), e = (1,3,3).' },
        { q: 'Kausale relasjoner kan utledes ved hjelp av …', o: ['Lamport-klokke', 'Vektorklokke', 'Absolutt klokke'], a: [1], e: 'Bare vektorklokker fanger kausalitet fullt ut.' }
      ]
    }
  ],
  summary: [
    'Fysiske klokker driver. Precision = mellom maskiner (intern). Accuracy = mot UTC (ekstern).',
    'Cristian/NTP: θ = ((T2−T1)+(T3−T4))/2. Berkeley: tidsdemon tar gjennomsnitt. Aldri still klokka bakover.',
    'Happens-before: samme prosess, send→mottak, transitiv. Ellers samtidige.',
    'Lamport: +1 før hver hendelse; mottak: max(lokal, ts)+1. a→b ⇒ C(a)<C(b), men ikke omvendt.',
    'Totalt ordnet multicast: Lamport-tid + prosess-ID, kø, ACK fra alle.',
    'Vektorklokke-regler: send/lokal: egen +1. Mottak: elementvis max, så egen +1.',
    'V(a) < V(b) (alle ≤, minst én <) ⇔ a → b. Ellers samtidige.'
  ],
  formulas: [
    { name: 'NTP offset', expr: 'θ = ((T2 − T1) + (T3 − T4)) / 2', note: '' },
    { name: 'NTP forsinkelse', expr: 'δ = ((T4 − T1) − (T3 − T2)) / 2', note: '' },
    { name: 'Lamport mottak', expr: 'C_j = max(C_j, ts(m)) + 1', note: '' },
    { name: 'Vektor send/lokal', expr: 'VC_i[i] = VC_i[i] + 1', note: '' },
    { name: 'Vektor mottak', expr: 'VC_j[k] = max(VC_j[k], ts(m)[k]) for alle k; så VC_j[j] += 1', note: '' },
    { name: 'Kausal orden', expr: 'V(a) < V(b) ⇔ ∀k: V(a)[k] ≤ V(b)[k] og ∃k: <', note: '' }
  ],
  examQA: [
    { q: 'Compute the vector clock values for all the events at these four processes.', a: 'Skriv reglene (rule 1: send/local +1; rule 2: receive = max then rule 1), start på [0 0 0 0], og fyll inn tabellen rad for rad – regn mottak etter at tilhørende sending er beregnet.' },
    { q: 'What information does the vector clock [2 4 0 1] at p4 give?', a: '2 events happened in p1 and 4 events in p2 that p4 probably depends on (causal relationship), no known events from p3, and this is p4’s first event.' }
  ]
});
