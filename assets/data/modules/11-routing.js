DAT110.addModule({
  id: 'routing',
  title: 'Routing: link-state, distance-vector, OSPF, BGP og ICMP',
  source: 'Kurose & Ross kap. 5.1–5.4, 5.6',
  exam: 'Oppgave 5 (distance-vector/Bellman-Ford: jan 2024, mai 2024, jan 2025) og Oppgave 6 (LS vs DV – juni 2025)',
  goals: [
    'Modellere et nett som en graf og klassifisere rutingalgoritmer',
    'Kjøre Dijkstra (link-state) for hånd',
    'Kjøre distance-vector: initialisering og oppdatering med Bellman-Ford',
    'Forklare count-to-infinity og poisoned reverse',
    'Sammenligne link-state og distance-vector',
    'Forklare OSPF (intra-AS), BGP (inter-AS) og ICMP'
  ],
  sections: [
    {
      id: 'routing-1',
      title: 'Rutingproblemet som en graf',
      html: `
<p>Nettet modelleres som en graf <b>G = (N, E)</b>: noder = rutere, kanter = linker med kostnad <b>c(x, y)</b> (kan være forsinkelse, pris eller bare 1 per link). Målet: finne <b>least-cost path</b> fra kilde til hver destinasjon.</p>
<div class="table-wrap"><table>
<tr><th>Klassifisering</th><th>Alternativer</th></tr>
<tr><td>Hvor mye informasjon?</td><td><b>Global/sentralisert</b> (alle kjenner hele topologien → link-state) vs. <b>desentralisert</b> (kjenner bare naboene → distance-vector)</td></tr>
<tr><td>Hvor ofte endres stier?</td><td><b>Statisk</b> (sjelden, manuelt) vs. <b>dynamisk</b> (reagerer på endringer)</td></tr>
<tr><td>Lastsensitiv?</td><td>Kostnad som avhenger av metning – sjelden brukt i dag</td></tr>
</table></div>
`,
      quiz: [
        { q: 'Hvilken type rutingalgoritme bruker global kunnskap om hele topologien?', o: ['Distance-vector', 'Link-state', 'Begge', 'Ingen'], a: [1], e: 'Link-state: alle rutere kjenner hele grafen (via flooding av link-state-pakker).' }
      ]
    },
    {
      id: 'routing-2',
      title: 'Link-state: Dijkstras algoritme',
      html: `
<p>Hver ruter får <b>hele topologien</b> (link-state-pakker floodes til alle) og kjører Dijkstra lokalt for å finne korteste vei fra <b>seg selv</b> til alle andre. Etter <b>k</b> iterasjoner kjenner den de <b>k</b> nærmeste destinasjonene.</p>
<div class="figure"><svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="110" r="20" class="bx2"/><text x="60" y="115" text-anchor="middle" class="tx">u</text>
  <circle cx="180" cy="40" r="20" class="bx"/><text x="180" y="45" text-anchor="middle" class="tx">v</text>
  <circle cx="180" cy="180" r="20" class="bx"/><text x="180" y="185" text-anchor="middle" class="tx">x</text>
  <circle cx="330" cy="40" r="20" class="bx"/><text x="330" y="45" text-anchor="middle" class="tx">w</text>
  <circle cx="330" cy="180" r="20" class="bx"/><text x="330" y="185" text-anchor="middle" class="tx">y</text>
  <circle cx="460" cy="110" r="20" class="bx"/><text x="460" y="115" text-anchor="middle" class="tx">z</text>
  <line x1="77" y1="99" x2="163" y2="51" class="ln"/><text x="110" y="66" class="txb">2</text>
  <line x1="77" y1="121" x2="163" y2="169" class="ln"/><text x="110" y="160" class="txb">1</text>
  <line x1="80" y1="108" x2="310" y2="45" class="ln"/><text x="230" y="80" class="txb">5</text>
  <line x1="180" y1="60" x2="180" y2="160" class="ln"/><text x="186" y="112" class="txb">2</text>
  <line x1="200" y1="40" x2="310" y2="40" class="ln"/><text x="255" y="34" class="txb">3</text>
  <line x1="196" y1="168" x2="314" y2="52" class="ln"/><text x="268" y="115" class="txb">3</text>
  <line x1="200" y1="180" x2="310" y2="180" class="ln"/><text x="255" y="196" class="txb">1</text>
  <line x1="330" y1="60" x2="330" y2="160" class="ln"/><text x="336" y="112" class="txb">1</text>
  <line x1="348" y1="49" x2="442" y2="101" class="ln"/><text x="400" y="66" class="txb">5</text>
  <line x1="348" y1="171" x2="442" y2="119" class="ln"/><text x="400" y="160" class="txb">2</text>
</svg></div>
<div class="table-wrap"><table class="center small">
<tr><th>Steg</th><th>N'</th><th>D(v),p</th><th>D(w),p</th><th>D(x),p</th><th>D(y),p</th><th>D(z),p</th></tr>
<tr><td>0</td><td>u</td><td>2,u</td><td>5,u</td><td><b>1,u</b></td><td>∞</td><td>∞</td></tr>
<tr><td>1</td><td>ux</td><td>2,u</td><td>4,x</td><td>–</td><td><b>2,x</b></td><td>∞</td></tr>
<tr><td>2</td><td>uxy</td><td><b>2,u</b></td><td>3,y</td><td>–</td><td>–</td><td>4,y</td></tr>
<tr><td>3</td><td>uxyv</td><td>–</td><td><b>3,y</b></td><td>–</td><td>–</td><td>4,y</td></tr>
<tr><td>4</td><td>uxyvw</td><td>–</td><td>–</td><td>–</td><td>–</td><td><b>4,y</b></td></tr>
<tr><td>5</td><td>uxyvwz</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
</table></div>
<p>I hvert steg: velg noden <b>utenfor N'</b> med minst D, legg den til N', og oppdater naboene: <code>D(v) = min(D(v), D(w) + c(w,v))</code>. Resultat fra u: x via x (1), y via x (2), v direkte (2), w via x–y (3), z via x–y (4).</p>
<ul>
  <li>Kompleksitet: O(n²) (O(n log n) med heap).</li>
  <li>Hver ruter kjører sin egen instans → <b>10 rutere = 10 instanser</b> for å beregne alle least-cost-stier (Canvas-quiz).</li>
  <li>Med lastavhengige kostnader kan det oppstå <b>oscillasjoner</b>.</li>
</ul>
`,
      quiz: [
        { q: 'Et nett har 10 rutere. Hvor mange instanser av Dijkstra må kjøres for å beregne alle least-cost-stier?', o: ['1', '10', '3'], a: [1], e: 'Hver ruter kjører Dijkstra med seg selv som kilde.' },
        { q: 'Hva velger Dijkstra i hvert steg?', o: ['Noden med størst kostnad', 'Noden utenfor N\' med minst kjent kostnad D', 'En tilfeldig nabo', 'Noden med flest naboer'], a: [1], e: 'Grådig valg av nærmeste ukjente node.' }
      ]
    },
    {
      id: 'routing-3',
      title: 'Distance-vector og Bellman-Ford (Oppgave 5!)',
      html: `
<p>Hver ruter x kjenner bare <b>kostnaden til naboene</b> c(x, v) og <b>distansevektorene naboene sender</b>. Den bruker <b>Bellman-Ford-likningen</b>:</p>
<span class="formula">D_x(y) = min over naboer v { c(x, v) + D_v(y) }</span>
<p>Algoritmen (nøyaktig som på eksamen):</p>
<pre>Initialization
  for all destinations y in N:
      Dx(y) = c(x,y)       // c(x,y) = ∞ if y is not a neighbor  (og Dx(x) = 0)
  for each neighbor w
      Dw(y) = ? for all destinations y in N
  for each neighbor w
      send Dx = [Dx(y): y in N] to w

Loop
  wait until link cost change to some neighbor or
        receive distance vector from some neighbor
  for each y in N
      Dx(y) = min_v{c(x,v) + Dv(y)}
  if Dx(y) changed for any destination y
      send Dx = [Dx(y): y in N] to all neighbors
forever</pre>
<p>Algoritmen er <b>iterativ</b>, <b>asynkron</b> og <b>distribuert</b>: den kjører til ingen vektorer endres (konvergens).</p>
<h3>Fullt eksempel – eksamen jan 2024, oppgave 5</h3>
<div class="figure"><svg viewBox="0 0 420 170" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="80" r="22" class="bx2"/><text x="60" y="85" text-anchor="middle" class="tx">R1</text>
  <circle cx="200" cy="30" r="22" class="bx2"/><text x="200" y="35" text-anchor="middle" class="tx">R2</text>
  <circle cx="200" cy="140" r="22" class="bx2"/><text x="200" y="145" text-anchor="middle" class="tx">R3</text>
  <circle cx="350" cy="90" r="22" class="bx2"/><text x="350" y="95" text-anchor="middle" class="tx">R4</text>
  <line x1="80" y1="70" x2="180" y2="38" class="ln"/><text x="125" y="44" class="txb">7</text>
  <line x1="80" y1="92" x2="180" y2="130" class="ln"/><text x="120" y="128" class="txb">2</text>
  <line x1="200" y1="52" x2="200" y2="118" class="ln"/><text x="207" y="90" class="txb">1</text>
  <line x1="221" y1="133" x2="330" y2="99" class="ln"/><text x="280" y="128" class="txb">5</text>
</svg></div>
<p><b>a) Least-cost R1 → R4:</b> R1 → R3 → R4 = 2 + 5 = <b>7</b> (via R2: 7+1+5 = 13).</p>
<p><b>b) Etter initialisering</b> (bare direkte naboer, ellers ∞):</p>
<div class="table-wrap"><table class="center">
<tr><th>y</th><th>R1</th><th>R2</th><th>R3</th><th>R4</th></tr>
<tr><td>D<sub>R2</sub>(y)</td><td>7</td><td>0</td><td>1</td><td>∞</td></tr>
<tr><td>D<sub>R3</sub>(y)</td><td>2</td><td>1</td><td>0</td><td>5</td></tr>
</table></div>
<p><b>c) R2 mottar D<sub>R3</sub></b>. R2 har naboer R1 (7) og R3 (1). For hver destinasjon:</p>
<ul>
  <li>R1: min( c(R2,R1) + D<sub>R1</sub>(R1), c(R2,R3) + D<sub>R3</sub>(R1) ) = min(7 + 0, 1 + 2) = <b>3</b> (via R3)</li>
  <li>R2: 0</li>
  <li>R3: min(7 + ?, 1 + 0) = <b>1</b></li>
  <li>R4: min(7 + ∞, 1 + 5) = <b>6</b> (via R3)</li>
</ul>
<p>Ny D<sub>R2</sub> = [3, 0, 1, 6]. <b>d)</b> Etter full konvergens er den fortsatt [3, 0, 1, 6] (dette er de faktiske korteste avstandene).</p>
<div class="callout warn"><span class="ct">Vanlige feil</span>
1) Ta med <b>alle</b> naboer i min-uttrykket – og bare naboer. 2) Bruk den vektoren du faktisk har fått: har R2 bare fått vektoren fra R3, bruker du R2s egne gamle verdier for veien via R1 (dvs. c(R2,R1) + D<sub>R1</sub>(y) der D<sub>R1</sub> er det R2 vet – ofte bare den direkte kostnaden). 3) Initialisering: kun direkte linker; selv = 0; resten ∞.</div>
<div class="callout example"><span class="ct">Mai 2024 5c – oppdatering som ikke endrer alt</span>
Grafen: R1–R3 = 8, R2–R3 = 2, R2–R4 = 1, R3–R4 = 5. R1 har bare én nabo: R3 (kost 8). R1 = [0, 10, 8, 13] og mottar D<sub>R3</sub> = [8, 2, 0, 3] (R3 har lært at R4 nås via R2 for 2+1 = 3). Via R3: R2 = 8+2 = 10, R3 = 8+0 = 8, R4 = 8+3 = <b>11</b> (forbedring fra 13). Ny D<sub>R1</sub> = [0, 10, 8, 11]. Least-cost R1→R4 er altså R1–R3–R2–R4 = 8+2+1 = 11.</div>
<p>👉 Tren på nye grafer i <a href="trening.html#dv">Regnetrening → Distance-vector</a>.</p>
`,
      quiz: [
        { q: 'Hva sier Bellman-Ford-likningen?', o: ['D_x(y) = max_v{c(x,v) + D_v(y)}', 'D_x(y) = min_v{c(x,v) + D_v(y)}', 'D_x(y) = c(x,y) alltid', 'D_x(y) = min_v{D_v(y)}'], a: [1], e: 'Kost til nabo + naboens kost til målet, minimert over alle naboer.' },
        { q: 'R1, R2, R3 med c(R1,R2) = 10, c(R1,R3) = 1, c(R2,R3) = 3. R1 har [0, 10, 1]; R3 har [1, 3, 0]. R3 sender vektoren sin til R1. Hvor mange oppføringer i R1s vektor oppdateres?', o: ['2', '1', '3'], a: [1], e: 'Bare R2: min(10+0, 1+3) = 4. De andre er uendret.' },
        { q: 'Hva er D_x(y) etter initialisering hvis y ikke er nabo av x?', o: ['0', '1', '∞', 'Kostnaden via korteste sti'], a: [2], e: 'Bare direkte linker er kjent.' },
        { q: 'Når sender en ruter sin distansevektor til naboene i løkken?', o: ['Hvert sekund uansett', 'Bare når vektoren har endret seg', 'Aldri', 'Bare når en nabo ber om det'], a: [1], e: '«if Dx(y) changed for any destination y → send».' }
      ]
    },
    {
      id: 'routing-4',
      title: 'Count-to-infinity og LS vs. DV',
      html: `
<h3>Gode nyheter går fort, dårlige nyheter går sakte</h3>
<p>Hvis en linkkostnad <b>øker</b> kraftig, kan to rutere peke på hverandre og øke avstandene sine litt etter litt i mange runder – <b>count-to-infinity</b>-problemet. Klassisk eksempel: x–y = 4 blir 60, y–z = 1, x–z = 50. y tror den kan nå x via z (som egentlig går via y!), og de teller opp i 44 runder.</p>
<p><b>Poisoned reverse</b>: hvis z ruter til x via y, forteller z til y at D<sub>z</sub>(x) = ∞. Da prøver ikke y å gå via z. Løser løkker mellom to noder, men ikke alle lengre løkker.</p>
<h3>Link-state vs. distance-vector (juni 2025 6b)</h3>
<div class="table-wrap"><table>
<tr><th></th><th>Link-state (Dijkstra)</th><th>Distance-vector (Bellman-Ford)</th></tr>
<tr><td>Kunnskap</td><td><b>Global</b> – hele topologien</td><td><b>Lokal</b> – bare naboene</td></tr>
<tr><td>Meldinger</td><td>O(n·E) – hver node floodes til alle</td><td>Bare mellom naboer</td></tr>
<tr><td>Konvergens</td><td>O(n²), kan oscillere</td><td>Varierer; kan få løkker og count-to-infinity</td></tr>
<tr><td>Robusthet</td><td>En feil ruter påvirker bare sin egen tabell</td><td>Feil kan spre seg gjennom hele nettet</td></tr>
<tr><td>Brukes i</td><td>OSPF, IS-IS</td><td>RIP (og BGP er en «path-vector»-variant)</td></tr>
</table></div>
<div class="callout exam"><span class="ct">Modellsvar juni 2025 6b</span>«The link-state algorithm computes the least-cost paths by using the <b>global knowledge</b> of the network topology. The distance vector algorithm computes its least costs by using <b>local knowledge</b> of the network from its <b>immediate neighbours</b>.»</div>
`,
      quiz: [
        { q: 'Hva er den viktigste forskjellen mellom link-state og distance-vector?', o: ['LS bruker global kunnskap om topologien, DV bruker bare informasjon fra naboene', 'DV er raskere alltid', 'LS brukes bare mellom AS-er', 'De er like'], a: [0], e: 'Global vs. lokal kunnskap.' },
        { q: 'Hva løser poisoned reverse?', o: ['At gode nyheter spres sakte', 'Rutingløkker mellom to nabo-rutere ved kostnadsøkning (count-to-infinity)', 'Bitfeil', 'At Dijkstra oscillerer'], a: [1], e: 'z lyver at D_z(x) = ∞ til y når z ruter via y.' }
      ]
    },
    {
      id: 'routing-5',
      title: 'OSPF, BGP og ICMP',
      html: `
<p>Internett er for stort til én rutingalgoritme. Det er delt i <b>autonome systemer (AS)</b> – nett under én administrasjon (f.eks. en ISP).</p>
<div class="compare">
  <div><h4>OSPF – intra-AS</h4><ul><li><b>Link-state</b>: link-state-annonseringer floodes til alle rutere i AS-et; hver kjører Dijkstra.</li><li>Kostnader settes av administrator.</li><li>Sikkerhet (autentiserte meldinger), flere like gode stier, <b>hierarkisk</b> (områder + backbone).</li></ul></div>
  <div><h4>BGP – inter-AS</h4><ul><li>«Limet som holder Internett sammen».</li><li><b>Path-vector</b>: annonserer prefikser med hele AS-stien (AS-PATH) og NEXT-HOP.</li><li><b>eBGP</b> mellom AS-er, <b>iBGP</b> internt i AS-et.</li><li>Velger rute etter <b>policy</b> (forretningsavtaler), deretter korteste AS-PATH, så <b>hot potato</b> (nærmeste NEXT-HOP), …</li></ul></div>
</div>
<div class="callout why"><span class="ct">Hvorfor ulike protokoller inne i og mellom AS-er?</span>
<b>Policy</b>: mellom AS-er handler det om hvem som får sende trafikk gjennom hvem (penger, avtaler) – inne i et AS har én admin kontroll. <b>Skala</b>: hierarkisk ruting gir mindre tabeller og mindre trafikk. <b>Ytelse</b>: inne i et AS kan man fokusere på ytelse; mellom AS-er dominerer policy.</div>
<h3>ICMP – Internet Control Message Protocol</h3>
<p>Brukes av verter og rutere til å kommunisere <b>nettverksinformasjon</b>: feilrapportering (destination unreachable, TTL expired) og echo request/reply (<b>ping</b>). ICMP-meldinger bæres <b>inne i IP-datagrammer</b>.</p>
<p><b>Traceroute</b> sender pakker med TTL = 1, 2, 3 … Ruter nr. n dropper pakken med TTL n og sender en ICMP «TTL expired» tilbake → avsenderen lærer ruterens adresse og RTT. Stopper når målet svarer med «port unreachable».</p>
`,
      quiz: [
        { q: 'Hvilken protokoll brukes for ruting mellom autonome systemer?', o: ['OSPF', 'RIP', 'BGP', 'ICMP'], a: [2], e: 'BGP = inter-AS (path-vector).' },
        { q: 'Hva brukes ICMP til?', o: ['Feilrapportering og diagnostikk (ping, traceroute)', 'Tildeling av IP-adresser', 'Navneoppslag', 'Kryptering'], a: [0], e: 'F.eks. «destination unreachable», «TTL expired».' },
        { q: 'OSPF er en …', o: ['distance-vector-protokoll', 'link-state-protokoll', 'path-vector-protokoll'], a: [1], e: 'Flooding av link-state + Dijkstra.' }
      ]
    }
  ],
  summary: [
    'Nett = graf G=(N,E) med kostnader c(x,y). Mål: least-cost path.',
    'Link-state (global): flooding av topologi, Dijkstra lokalt i hver ruter (n rutere = n instanser). O(n²).',
    'Distance-vector (lokal): D_x(y) = min_v{c(x,v) + D_v(y)}. Init: selv 0, naboer = linkkost, andre ∞. Send vektor når den endres.',
    'Count-to-infinity ved kostnadsøkning; poisoned reverse hjelper for to-node-løkker.',
    'OSPF: link-state intra-AS, hierarkisk. BGP: path-vector inter-AS, policy-basert (eBGP/iBGP, AS-PATH, NEXT-HOP, hot potato).',
    'ICMP: feil og diagnostikk (ping, traceroute med økende TTL).'
  ],
  formulas: [
    { name: 'Bellman-Ford', expr: 'D_x(y) = min_v { c(x,v) + D_v(y) }', note: 'v går over alle NABOER av x' },
    { name: 'Dijkstra-oppdatering', expr: 'D(v) = min( D(v), D(w) + c(w,v) )', note: 'w = node nettopp lagt til N\'' }
  ],
  examQA: [
    { q: 'What is the least-cost path from R1 to R4?', a: 'Sjekk alle stier og summer kostnadene; oppgi stien og totalkost (f.eks. R1→R3→R4 = 2+5 = 7).' },
    { q: 'Specify the distance vectors after the initialization part has been executed.', a: 'For hver ruter: 0 til seg selv, linkkostnaden til direkte naboer, ∞ til alle andre.' },
    { q: 'What will D_x be after x has updated its distance vector (having received D_v)?', a: 'For hver destinasjon y: beregn c(x,v)+D_v(y) for hver nabo v du har vektor fra (og direkte kostnad), ta minimum. Vis utregningen, f.eks. R1: min(7+0, 1+2) = 3.' },
    { q: 'Briefly explain the differences between distance vector and link-state.', a: 'Link-state computes least-cost paths using global knowledge of the topology (Dijkstra); distance vector computes them iteratively and distributedly using only local knowledge from immediate neighbours (Bellman-Ford).' }
  ]
});
