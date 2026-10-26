DAT110.addModule({
  id: 'naming',
  title: 'Navngiving, navneoppslag og Chord DHT',
  source: 'van Steen & Tanenbaum kap. 6.1, 6.2–6.2.3, 6.3.3 (+ prosjekt 3)',
  exam: 'Oppgave 10 (15 %!) HVERT ÅR: fingertabeller, ansvarlig server, oppslag steg for steg, skalerbarhet/feiltoleranse. Oppgave 1: adresserom, home-based, DNS.',
  goals: [
    'Skille navn, identifikator og adresse, og forklare stedsuavhengige navn',
    'Forklare enkle løsninger for flat navngiving: broadcasting, forwarding pointers, home-based',
    'Forklare Chord: identifikatorring, succ(k), hvem som har ansvar for en nøkkel',
    'Beregne fingertabeller med succ(n + 2^(i−1)) mod 2^m',
    'Løse et oppslag steg for steg slik sensorveiledningen gjør det',
    'Forklare hvorfor Chord er skalerbart (O(log N)) og feiltolerant (replikering)'
  ],
  sections: [
    {
      id: 'naming-1',
      title: 'Navn, identifikatorer og adresser',
      html: `
<ul>
  <li><b>Navn</b>: en streng som refererer til en entitet (vert, fil, prosess, bruker …).</li>
  <li><b>Aksesspunkt</b>: det man bruker for å nå entiteten. Navnet på aksesspunktet er en <b>adresse</b> (f.eks. IP + port). En entitet kan ha flere aksesspunkter, og de kan endres over tid.</li>
  <li><b>Identifikator</b>: et navn med tre egenskaper: (1) refererer til <b>høyst én</b> entitet, (2) hver entitet har <b>høyst én</b> identifikator, (3) identifikatoren <b>gjenbrukes aldri</b> for en annen entitet.</li>
</ul>
<div class="callout"><span class="ct">Stedsuavhengig navn</span>Et navn som er <b>uavhengig av adressen</b> til entiteten. Eksempel: et <b>domenenavn</b> (www.hvl.no kan flyttes til en annen IP uten at navnet endres). En IP-adresse eller et telefonnummer er derimot knyttet til hvor entiteten er.</div>
<p>Et <b>navnerom</b> inneholder alle <b>gyldige navn som gjenkjennes og håndteres av en tjeneste</b> (ikke «alle navn man kan finne på»). <b>Navneoppløsning</b> = å slå opp navnet og finne adressen.</p>
`,
      quiz: [
        { q: 'Hvilket er et eksempel på et stedsuavhengig navn?', o: ['En IP-adresse', 'Et domenenavn', 'Et telefonnummer', 'Alle alternativene'], a: [1], e: 'Domenenavnet kan peke til nye adresser uten å endres.' },
        { q: 'Et navnerom inneholder …', o: ['alle navn en designer kan tenke seg', 'ubegrensede navn slik at man kan velge vilkårlig navn', 'alle gyldige navn som gjenkjennes og håndteres av en tjeneste'], a: [2], e: 'Navnerommet er definert av tjenesten.' },
        { q: 'Hvilke egenskaper har en ekte identifikator?', o: ['Refererer til høyst én entitet', 'Hver entitet har høyst én identifikator', 'Gjenbrukes aldri', 'Inneholder alltid IP-adressen'], a: [0, 1, 2], e: 'De tre egenskapene fra van Steen.' }
      ]
    },
    {
      id: 'naming-2',
      title: 'Flat navngiving: broadcasting, forwarding pointers og home-based',
      html: `
<p>Flate navn (f.eks. tilfeldige bitstrenger) har ingen struktur som forteller hvor entiteten er. Enkle løsninger:</p>
<div class="table-wrap"><table>
<tr><th>Løsning</th><th>Hvordan</th><th>Problem</th></tr>
<tr><td><b>Broadcasting</b></td><td>Kringkast identifikatoren; den som har entiteten svarer med adressen. <em>ARP er et eksempel.</em></td><td>Skalerer ikke utover LAN – alle må prosessere alle forespørsler</td></tr>
<tr><td><b>Forwarding pointers</b></td><td>Når en entitet flytter, etterlater den en peker til ny plass</td><td>Lange kjeder → treg oppslag, og <b>brudd i kjeden</b> hvis én peker forsvinner</td></tr>
<tr><td><b>Home-based</b></td><td>En fast <b>hjemmeadresse</b> holder styr på hvor entiteten er nå (Mobile IP: home agent → care-of address)</td><td>Hjemmet må finnes hele entitetens levetid; permanent flytting blir kronglete; <b>dårlig geografisk skalerbarhet</b> (klienten kan være rett ved entiteten, men må via hjemmet langt unna)</td></tr>
<tr><td><b>DHT</b> (Chord)</td><td>Strukturert P2P: nøkler og noder i samme identifikatorrom</td><td>– se under</td></tr>
</table></div>
<div class="callout exam"><span class="ct">Canvas-quiz</span>«One major challenge with home-based approach is:» → <b>Poor geographical scalability</b>. («Broken links because of long chains of pointers» er forwarding pointers.)</div>
`,
      quiz: [
        { q: 'En stor utfordring med home-based-tilnærmingen er …', o: ['Brutte lenker pga. lange pekerkjeder', 'Dårlig geografisk skalerbarhet', 'Hjemmeadressen kan ikke registreres i en navnetjeneste'], a: [1], e: 'Trafikken må gå via hjemmet selv om klient og entitet er nær hverandre.' },
        { q: 'Hvilken protokoll er et eksempel på broadcasting for å finne en adresse?', o: ['DNS', 'ARP', 'BGP', 'HTTP'], a: [1], e: 'ARP kringkaster «hvem har IP X?».' }
      ]
    },
    {
      id: 'naming-3',
      title: 'Chord: ringen og hvem som har ansvaret for en nøkkel',
      html: `
<p>Chord bruker et <b>m-bits identifikatorrom</b>: alle ID-er er tall 0 … 2<sup>m</sup> − 1 organisert i en <b>ring</b> (modulo 2<sup>m</sup>). Både <b>noder</b> (hash av IP/navn) og <b>nøkler/data</b> (hash av filnavn) får ID-er i samme rom.</p>
<span class="formula">Adresserommets størrelse = 2^m     (m = 5 → 32, m = 8 → 256, MD5: m = 128 → 2^128)</span>
<div class="callout"><span class="ct">Ansvarsregelen</span>En nøkkel k lagres hos <b>succ(k)</b> – den første noden med ID ≥ k (med urviseren, wrap rundt). Ekvivalent: node n er ansvarlig for alle nøkler der
<span class="formula">pred(n) &lt; k ≤ n</span></div>
<div class="figure" data-chord="1,5,10,15,20,29" data-m="5" data-keys="14,25"></div>
<p class="figcap center">Chord-ring med m = 5 (ID 0–31) og nodene 1, 5, 10, 15, 20, 29. Nøkkel 14 lagres hos 15, nøkkel 25 hos 29.</p>
<h3>Eksempel (jan 2024): m = 5, noder {1, 5, 10, 15, 20, 29}</h3>
<div class="table-wrap"><table class="center">
<tr><th>Nøkkel</th><th>Regel</th><th>Ansvarlig</th></tr>
<tr><td>5</td><td>1 &lt; 5 ≤ 5</td><td><b>5</b></td></tr>
<tr><td>14</td><td>10 &lt; 14 ≤ 15</td><td><b>15</b></td></tr>
<tr><td>20</td><td>15 &lt; 20 ≤ 20</td><td><b>20</b></td></tr>
<tr><td>25</td><td>20 &lt; 25 ≤ 29</td><td><b>29</b></td></tr>
<tr><td>31 (eller 0)</td><td>29 &lt; 31 ≤ 1 (wrap)</td><td><b>1</b></td></tr>
</table></div>
<div class="callout warn"><span class="ct">Wrap-around</span>Nøkler større enn den største noden går til den <b>minste</b> noden (ringen fortsetter: 30, 31, 0, 1). Nøkkel = node-ID → den noden selv.</div>
<div class="callout example"><span class="ct">Canvas: noder P1 = 20, P2 = 10, P3 = 30; filer 5, 12, 31, 1</span>
5 → 10 (P2) · 12 → 20 (P1) · 31 → wrap → 10 (P2) · 1 → 10 (P2). Svar: <b>P1 holder 12; P2 holder 1, 5, 31</b>.</div>
<p><b>Naiv oppslag</b>: spør etterfølgeren, som spør sin etterfølger … → <b>O(N)</b> hopp. Skalerer ikke. Løsning: fingertabeller.</p>
`,
      quiz: [
        { q: 'En DHT bruker 8 bit for adresserommet. Hvor stort er adresserommet?', o: ['64', '128', '256', '8'], a: [2], e: '2^8 = 256.' },
        { q: 'Chord-ring med noder 3, 12, 21, 31 (m = 5). Hvem er ansvarlig for nøkkel 15?', o: ['12', '21', '31', '3'], a: [1], e: '12 < 15 ≤ 21.' },
        { q: 'Samme ring (3, 12, 21, 31). Hvem er ansvarlig for nøkkel 0?', o: ['31', '3', '12', '0 finnes ikke'], a: [1], e: 'Wrap: 31 < 0 ≤ 3 (modulo 32).' },
        { q: 'Peers P1 = 20, P2 = 10, P3 = 30. Hvem holder filene 5, 12, 31 og 1?', o: ['P3 holder 1, 5, 31; P2 holder 12', 'P1 holder 12; P2 holder 1, 5, 31', 'P1 holder 12, P2 holder 1, 5, P3 holder 31', 'P1 holder 1, 5, 31; P2 holder 12'], a: [1], e: '31 > 30 → wrap til minste node 10.' }
      ]
    },
    {
      id: 'naming-4',
      title: 'Fingertabeller og oppslag (Oppgave 10)',
      html: `
<p>Hver node p har en <b>fingertabell</b> med m innganger:</p>
<span class="formula">FT_p[i] = succ( (p + 2^(i−1)) mod 2^m ),   i = 1 … m</span>
<p>Fingerne peker til noder som er <b>eksponentielt lenger unna</b>: +1, +2, +4, +8, +16 … Dermed kan hvert hopp halvere avstanden til målet → <b>O(log N)</b> hopp.</p>
<h3>Fingertabell for node 29 (m = 5, noder {1, 5, 10, 15, 20, 29})</h3>
<div class="table-wrap"><table class="center">
<tr><th>i</th><th>29 + 2<sup>i−1</sup></th><th>mod 32</th><th>succ</th></tr>
<tr><td>1</td><td>30</td><td>30</td><td><b>1</b></td></tr>
<tr><td>2</td><td>31</td><td>31</td><td><b>1</b></td></tr>
<tr><td>3</td><td>33</td><td>1</td><td><b>1</b></td></tr>
<tr><td>4</td><td>37</td><td>5</td><td><b>5</b></td></tr>
<tr><td>5</td><td>45</td><td>13</td><td><b>15</b></td></tr>
</table></div>
<div class="callout tip"><span class="ct">Skriv det slik sensor vil ha det</span><code>i=4: succ(29+8) = succ(37 mod 32) = succ(5) = 5</code> – vis hvert mellomsteg for alle noder.</div>
<h3>Oppslagsalgoritmen (slik sensorveiledningen beskriver den)</h3>
<ol class="steps">
  <li><b>Steg 1:</b> Sjekk om nøkkelen ligger mellom noden og dens etterfølger: <b>n &lt; k ≤ succ(n)</b>. Hvis ja → <b>succ(n)</b> er ansvarlig. Ferdig.</li>
  <li><b>Steg 2:</b> Ellers: gå så langt som mulig. Start <b>nederst</b> i fingertabellen (Finger(5)) og gå oppover: finn første finger f med <b>n &lt; f &lt; k</b> (sirkulært). Videresend til f og gjenta fra steg 1.</li>
</ol>
<h3>Eksempel: slå opp k = 18 fra node 1 (jan 2024 10c)</h3>
<div class="table-wrap"><table class="center small">
<tr><th>Node</th><th>FT[1..5]</th></tr>
<tr><td>1</td><td>5, 5, 5, 10, 20</td></tr>
<tr><td>10</td><td>15, 15, 15, 20, 29</td></tr>
<tr><td>15</td><td>20, 20, 20, 29, 1</td></tr>
</table></div>
<ul>
  <li><b>Runde 1</b> (n = 1, succ = 5): 1 &lt; 18 ≤ 5? Nei. Finger(5) = 20: 1 &lt; 20 &lt; 18? Nei. Finger(4) = 10: 1 &lt; 10 &lt; 18? <b>Ja</b> → gå til 10.</li>
  <li><b>Runde 2</b> (n = 10, succ = 15): 10 &lt; 18 ≤ 15? Nei. Finger(5) = 29? Nei. Finger(4) = 20? 10 &lt; 20 &lt; 18 – nei. Finger(3) = 15: 10 &lt; 15 &lt; 18? <b>Ja</b> → gå til 15.</li>
  <li><b>Runde 3</b> (n = 15, succ = 20): 15 &lt; 18 ≤ 20? <b>Ja</b> → svaret er <b>node 20</b>.</li>
</ul>
<h3>Wrap-around i oppslag (jan 2025 10c): k = 15 fra node 31</h3>
<p>Noder {3, 12, 21, 31}. FT<sub>31</sub> = [3, 3, 3, 12, 21]. Runde 1: 31 &lt; 15 ≤ 3? (intervallet 31→3 er {0,1,2,3}) Nei. Finger(5) = 21: er 21 i (31, 15) = {0,…,14}? Nei. Finger(4) = 12: i (31, 15)? <b>Ja</b> → node 12. Runde 2: 12 &lt; 15 ≤ 21 → <b>node 21</b>.</p>
<div class="callout warn"><span class="ct">Sirkulære intervaller</span>Når nedre grense er større enn øvre (f.eks. 31 &lt; x &lt; 15), betyr intervallet «fra 31, rundt 0, opp til 15». Tenk: <b>gå med urviseren fra a; treffer du x før b?</b></div>
<div class="callout why"><span class="ct">Skalerbarhet og feiltoleranse (alltid deloppgave d/e)</span>
<b>Skalerbart søk</b>: fingertabellen lagrer noder som ligger eksponentielt langt unna, så et oppslag fullføres på <b>O(log n)</b> hopp. Last/data fordeles på mange servere.<br>
<b>Feiltoleranse</b>: både <b>data (filer) og prosesser replikeres</b> – feiler en prosess kan en annen ta over; er data korrupt hos én, kan en replika hentes fra en annen.</div>
<p>👉 Øv på nye ringer i <a href="trening.html#dht">Regnetrening → Chord DHT</a> – med automatisk fasit i eksamensformat.</p>
`,
      quiz: [
        { q: 'Hva er FT_p[i] i Chord?', o: ['succ(p + i)', 'succ(p + 2^(i−1)) mod 2^m', 'pred(p − 2^i)', 'p · 2^i'], a: [1], e: 'i = 1 gir nærmeste etterfølger (p+1).' },
        { q: 'Noder {0, 9, 17, 30}, m = 5. Hva er FT_30?', o: ['[0, 0, 9, 9, 17]', '[0, 0, 0, 9, 17]', '[9, 9, 9, 9, 17]', '[0, 9, 9, 9, 17]'], a: [0], e: '31→0, 32≡0→0, 34≡2→9, 38≡6→9, 46≡14→17 (mai 2024).' },
        { q: 'Hvor mange hopp trenger et Chord-oppslag typisk?', o: ['O(1)', 'O(log N)', 'O(N)', 'O(N²)'], a: [1], e: 'Fingertabellen halverer avstanden.' },
        { q: 'I oppslagets steg 2 – hvor i fingertabellen begynner man?', o: ['Øverst (FT[1])', 'Nederst (FT[m]) – den som er lengst unna', 'I midten', 'Tilfeldig'], a: [1], e: 'Gå så langt som mulig uten å passere nøkkelen.' },
        { q: 'Hvilke egenskaper ved DHT-en gir feiltoleranse?', o: ['Fingertabellen', 'Replikering av data og prosesser', 'MD5-hashing', 'O(log n)-søk'], a: [1], e: 'Fingertabellen gir skalerbart søk; replikering gir feiltoleranse.' },
        { q: 'Du skal designe et skalerbart Chord-oppslag. Hva anbefaler du?', o: ['Spørre etterfølger etter etterfølger til adressen finnes', 'Multicast forespørselen til alle noder', 'En rutingtabell med referanser til noen få eksponentielt fjerne noder'], a: [2], e: 'Fingertabeller.' },
        { q: 'Hva kan en DHT tilby?', o: ['Tilgjengelighet', 'Sikkerhet', 'Skalerbarhet', 'Feiltoleranse'], a: [0, 2, 3], e: 'DHT alene gir ikke sikkerhet.' }
      ]
    }
  ],
  summary: [
    'Navn → (navneoppløsning) → adresse til et aksesspunkt. Identifikator: maks én entitet, maks én ID per entitet, gjenbrukes aldri.',
    'Stedsuavhengig navn: uavhengig av adressen (domenenavn). Navnerom = alle gyldige navn en tjeneste håndterer.',
    'Flat navngiving: broadcasting (ARP), forwarding pointers (brutte kjeder), home-based (dårlig geografisk skalerbarhet), DHT.',
    'Chord: ring mod 2^m. Adresserom 2^m (8 bit → 256; MD5 → 2^128). Nøkkel k lagres hos succ(k): pred(n) < k ≤ n.',
    'Fingertabell: FT_p[i] = succ(p + 2^(i−1) mod 2^m), i = 1..m.',
    'Oppslag: (1) n < k ≤ succ(n) → succ(n). (2) Ellers første finger fra bunnen med n < f < k; gjenta.',
    'Skalerbarhet: fingertabell → O(log n). Feiltoleranse: replikering av data og prosesser.'
  ],
  formulas: [
    { name: 'Adresserom', expr: '2^m', note: 'm bit' },
    { name: 'Ansvar', expr: 'pred(n) < k ≤ n   ⇔   k lagres hos succ(k)', note: 'sirkulært' },
    { name: 'Finger', expr: 'FT_p[i] = succ((p + 2^(i−1)) mod 2^m)', note: 'i = 1, …, m' },
    { name: 'Oppslag steg 1', expr: 'n < k ≤ succ(n) ⇒ svar = succ(n)', note: '' },
    { name: 'Oppslag steg 2', expr: 'for i = m … 1: hvis n < FT[i] < k ⇒ gå til FT[i]', note: 'closest preceding finger' }
  ],
  examQA: [
    { q: 'Compute the finger tables for each server (show computation steps).', a: 'For hver node n og i=1..5: succ(n + 2^(i−1)) – skriv f.eks. «i=5: succ(29+16) = succ(45 mod 32) = succ(13) = 15».' },
    { q: 'A file is replicated with keys {…}. Which servers are responsible? Show the formula.', a: 'Formel: pred(server) < key ≤ server. Finn for hver nøkkel første node ≥ nøkkelen (wrap rundt).' },
    { q: 'Resolve the file with key k from server n (show steps).', a: 'Runde for runde: Steg 1: n < k ≤ succ(n)? Hvis ja ferdig. Steg 2: sjekk Finger(5), Finger(4), … til n < finger < k; gå dit og gjenta. Oppgi svaret.' },
    { q: 'Which features of the DHT provide scalable search / fault tolerance?', a: 'Scalable search: the finger table stores exponentially distant nodes so lookup completes in O(log n). Fault tolerance: data replication and process replication.' }
  ]
});
