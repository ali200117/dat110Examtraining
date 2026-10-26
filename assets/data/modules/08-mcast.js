DAT110.addModule({
  id: 'mcast',
  title: 'Multicast, overlay-nettverk og gossip',
  source: 'van Steen & Tanenbaum kap. 4.4',
  exam: 'Oppgave 8 (10 %) HVERT ÅR: overlay-graf, stretch/RDP og tree cost. Oppgave 1: flooding og gossip.',
  goals: [
    'Forklare applikasjonsnivå-multicast og overlay-nettverk',
    'Tegne det fullt koblede overlay-nettet med minste forsinkelse mellom prosesser',
    'Regne stretch/RDP og tree cost og velge beste multicast-tre',
    'Regne forventet antall meldinger ved flooding i et tilfeldig nett',
    'Forklare gossip/epidemiske protokoller: push, pull, push-pull, anti-entropi og rykte-spredning'
  ],
  sections: [
    {
      id: 'mcast-1',
      title: 'Applikasjonsnivå-multicast og overlay-nettverk',
      html: `
<p><b>Multicast</b> = sende samme data til en gruppe mottakere. IP-multicast (i rutere) ble aldri utbredt. I stedet organiserer prosessene seg selv i et <b>overlay-nettverk</b> på applikasjonsnivå, og videresender meldinger til hverandre – <b>application-level multicasting (ALM)</b>.</p>
<div class="callout"><span class="ct">Overlay-nettverk</span>Et logisk nett bygget oppå det fysiske nettet. Hver logisk kant mellom to prosesser kan gå gjennom mange fysiske rutere. Overlayet kan spenne over flere fysiske nett, og topologien er generelt <b>forskjellig</b> fra den fysiske.</div>
<p>Typisk organiseres prosessene i et <b>tre</b> (unik sti mellom hvert par) eller et <b>mesh</b> (flere stier – robust mot feil).</p>
<h3>Kvalitetsmål</h3>
<ul>
  <li><b>Link stress</b>: hvor mange ganger <em>samme</em> pakke krysser <em>samme</em> fysiske link. Ideelt 1.</li>
  <li><b>Stretch / Relative Delay Penalty (RDP)</b>: forholdet mellom forsinkelsen langs overlay-stien og forsinkelsen langs den beste fysiske stien:
  <span class="formula">RDP(A→D) = forsinkelse i overlay-treet fra A til D / beste fysiske (ruter-)forsinkelse fra A til D</span>
  RDP = 1 er perfekt. RDP = 2 betyr at overlayet bruker dobbelt så lang tid som det underliggende nettet.</li>
  <li><b>Tree cost</b>: summen av kostnadene (forsinkelsene) på alle kantene i multicast-treet – et globalt mål. Lavere er bedre.</li>
</ul>
<div class="callout why"><span class="ct">Hvorfor to mål?</span>
RDP måler hvor godt treet er for <b>ett bestemt par</b> (f.eks. A→D). Tree cost måler hvor «billig» treet er <b>totalt</b> for å nå alle. Et tre kan ha lav RDP for A→D men høy total kostnad, eller omvendt – derfor spør eksamen om begge (b og c).</div>
`,
      quiz: [
        { q: 'Et overlay-nettverk med stretch 2,0 mellom to noder betyr at …', o: ['overlay og fysisk nett har samme forsinkelse', 'overlay-nettet bruker dobbelt så lang tid som det underliggende nettet mellom de to nodene', 'det fysiske nettet bruker dobbelt så lang tid som overlayet'], a: [1], e: 'RDP = overlay / fysisk = 2.' },
        { q: 'Hvilke utsagn om overlay-nettverk stemmer?', o: ['Prosesser kan bruke overlayet til å rute meldinger til andre prosesser', 'Overlay-topologien er alltid lik den fysiske topologien', 'Overlay kan bare dannes i et LAN', 'Et overlay kan spenne over flere fysiske nett'], a: [0, 3], e: 'Overlayet er logisk og generelt forskjellig fra det fysiske nettet.' },
        { q: 'Hva er link stress?', o: ['Antall ganger samme pakke krysser samme fysiske link', 'Forholdet mellom overlay- og fysisk forsinkelse', 'Summen av alle kantkostnader i treet', 'Antall rutere i nettet'], a: [0], e: 'Ideelt sett 1.' }
      ]
    },
    {
      id: 'mcast-2',
      title: 'Oppgave 8 steg for steg: overlay-graf, RDP og tree cost',
      html: `
<p>Eksempel fra <b>eksamen jan 2025</b>. Prosessene A–E henger på hver sin ruter med kostnad 1. Ruterne danner en ring:</p>
<div class="figure"><svg viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg">
  <circle cx="150" cy="80" r="20" class="bx2"/><text x="150" y="85" text-anchor="middle" class="txs">Ra</text>
  <circle cx="410" cy="80" r="20" class="bx2"/><text x="410" y="85" text-anchor="middle" class="txs">Re</text>
  <circle cx="110" cy="190" r="20" class="bx2"/><text x="110" y="195" text-anchor="middle" class="txs">Rb</text>
  <circle cx="280" cy="190" r="20" class="bx2"/><text x="280" y="195" text-anchor="middle" class="txs">Rc</text>
  <circle cx="450" cy="190" r="20" class="bx2"/><text x="450" y="195" text-anchor="middle" class="txs">Rd</text>
  <line x1="170" y1="80" x2="390" y2="80" class="ln"/><text x="280" y="72" text-anchor="middle" class="txb">40</text>
  <line x1="143" y1="99" x2="117" y2="171" class="ln"/><text x="118" y="135" class="txb">5</text>
  <line x1="130" y1="190" x2="260" y2="190" class="ln"/><text x="195" y="183" text-anchor="middle" class="txb">10</text>
  <line x1="300" y1="190" x2="430" y2="190" class="ln"/><text x="365" y="183" text-anchor="middle" class="txb">5</text>
  <line x1="443" y1="171" x2="417" y2="99" class="ln"/><text x="440" y="135" class="txb">5</text>
  <rect x="60" y="20" width="34" height="28" rx="6" class="bxg"/><text x="77" y="39" text-anchor="middle" class="tx">A</text><line x1="94" y1="38" x2="132" y2="72" class="ln"/><text x="110" y="50" class="txs">1</text>
  <rect x="466" y="20" width="34" height="28" rx="6" class="bxg"/><text x="483" y="39" text-anchor="middle" class="tx">E</text><line x1="466" y1="38" x2="428" y2="72" class="ln"/><text x="447" y="50" class="txs">1</text>
  <rect x="30" y="240" width="34" height="28" rx="6" class="bxg"/><text x="47" y="259" text-anchor="middle" class="tx">B</text><line x1="64" y1="248" x2="96" y2="205" class="ln"/><text x="70" y="225" class="txs">1</text>
  <rect x="263" y="250" width="34" height="28" rx="6" class="bxg"/><text x="280" y="269" text-anchor="middle" class="tx">C</text><line x1="280" y1="250" x2="280" y2="210" class="ln"/><text x="286" y="235" class="txs">1</text>
  <rect x="496" y="240" width="34" height="28" rx="6" class="bxg"/><text x="513" y="259" text-anchor="middle" class="tx">D</text><line x1="496" y1="248" x2="464" y2="205" class="ln"/><text x="485" y="225" class="txs">1</text>
</svg><figcaption>Fysisk nett: rutere Ra–Re (ring), prosesser A–E koblet med kostnad 1.</figcaption></div>
<h3>Steg 1 – Beste fysiske forsinkelse mellom hvert par</h3>
<p>Antall kanter i fullt koblet graf: <b>E = N(N−1)/2 = 5·4/2 = 10</b>. For hvert par: korteste vei gjennom ruterne + 1 + 1 (de to tilkoblingslinkene). Sjekk begge veier rundt ringen!</p>
<div class="table-wrap"><table class="center">
<tr><th>Par</th><th>Ruter-sti (billigste)</th><th>Forsinkelse</th></tr>
<tr><td>A–B</td><td>Ra–Rb = 5</td><td>1+5+1 = <b>7</b></td></tr>
<tr><td>A–C</td><td>Ra–Rb–Rc = 15 (ikke via Re: 50)</td><td><b>17</b></td></tr>
<tr><td>A–D</td><td>Ra–Rb–Rc–Rd = 20 (via Re: 45)</td><td><b>22</b></td></tr>
<tr><td>A–E</td><td>Ra–Rb–Rc–Rd–Re = 25 (direkte: 40!)</td><td><b>27</b></td></tr>
<tr><td>B–C</td><td>10</td><td><b>12</b></td></tr>
<tr><td>B–D</td><td>15</td><td><b>17</b></td></tr>
<tr><td>B–E</td><td>20</td><td><b>22</b></td></tr>
<tr><td>C–D</td><td>5</td><td><b>7</b></td></tr>
<tr><td>C–E</td><td>10</td><td><b>12</b></td></tr>
<tr><td>D–E</td><td>5</td><td><b>7</b></td></tr>
</table></div>
<div class="callout warn"><span class="ct">Felle</span>A–E har en direkte ruterlink på 40, men den andre veien rundt (5+10+5+5 = 25) er billigere. Ruterne bruker alltid <b>billigste</b> vei.</div>
<h3>Steg 2 – RDP for et tre</h3>
<p>Trærne oppgis som en kjede, f.eks. <b>Tre 1: A – E – D – B – C</b> (kanter A–E, E–D, D–B, B–C). Meldingen fra A til D følger treet: A → E → D.</p>
<ol class="steps">
  <li>Overlay-forsinkelse A→D i tre 1 = A–E + E–D = 27 + 7 = <b>34</b></li>
  <li>Beste fysiske A→D = <b>22</b></li>
  <li>RDP = 34 / 22 = <b>1,55</b></li>
</ol>
<p><b>Tre 2: A – B – C – E – D</b>: A→D = 7 + 12 + 12 + 7 = 38 → RDP = 38/22 = <b>1,73</b>. Tre 1 er best for A→D (nærmest det fysiske nettet).</p>
<h3>Steg 3 – Tree cost</h3>
<ul>
  <li>Tre 1: 27 + 7 + 17 + 12 = <b>63</b></li>
  <li>Tre 2: 7 + 12 + 12 + 7 = <b>38</b></li>
</ul>
<p>Tre 2 har lavest total kostnad → mest effektivt for å rute meldinger <b>blant alle prosessene</b>. Legg merke til at svaret i (b) og (c) kan være <b>ulike trær</b>!</p>
<div class="callout exam"><span class="ct">Slik skriver du svaret</span>
(b) «Best router path A–D = 22. Tree 1: overlay path A–E–D = 27+7 = 34, RDP = 34/22 = 1.55. Tree 2: A–B–C–E–D = 38, RDP = 1.73. Tree 1 is more efficient for A→D since its delay is closest to the physical routers.»<br>
(c) «Tree 1 cost = 63, Tree 2 cost = 38. Tree 2 has lower global cost and is more efficient for routing messages among all processes.»</div>
<p>👉 Øv på uendelig mange varianter i <a href="trening.html#overlay">Regnetrening → Overlay/RDP</a>.</p>
`,
      quiz: [
        { q: 'Hvor mange kanter har en fullt koblet overlay-graf med 6 prosesser?', o: ['6', '12', '15', '30'], a: [2], e: 'N(N−1)/2 = 6·5/2 = 15.' },
        { q: 'Overlay-sti A→C i et tre har forsinkelse 49; beste fysiske A→C er 47. RDP?', o: ['0,96', '1,04', '2', '96'], a: [1], e: '49/47 ≈ 1,04 (eksamen mai 2023).' },
        { q: 'Tre X har lavest RDP for A→D, tre Y har lavest tree cost. Hvilket er best for å sende meldinger blant ALLE prosessene?', o: ['X', 'Y', 'Begge like', 'Kan ikke avgjøres'], a: [1], e: 'Tree cost er det globale målet.' },
        { q: 'Prosesser henger på rutere med kostnad 1. Ruterne R1 og R2 har billigste vei 30 mellom seg. Hva er minste forsinkelse mellom prosessene på R1 og R2?', o: ['30', '31', '32', '60'], a: [2], e: '1 + 30 + 1 = 32.' }
      ]
    },
    {
      id: 'mcast-3',
      title: 'Flooding-basert multicast',
      html: `
<p>Ved <b>flooding</b> sender hver node meldingen videre til alle naboene sine (unntatt den den kom fra). Meldingen når <b>alle tilkoblede noder</b>. Antall meldinger avhenger av <b>antall kanter</b>:</p>
<ul>
  <li><b>Tre</b> med N noder: N − 1 kanter → <b>N − 1</b> meldinger (optimalt).</li>
  <li><b>Fullt koblet graf</b>: <b>N(N−1)/2</b> kanter → så mange meldinger.</li>
  <li><b>Tilfeldig graf</b> der to noder er koblet med sannsynlighet p: forventet antall kanter (= meldinger) er
    <span class="formula">M = p · N(N−1)/2</span></li>
</ul>
<div class="callout example"><span class="ct">Eksamen mai 2022 1g / jan 2024 1f</span>
N = 500, p = 0,4: 0,4 · 500 · 499 / 2 = 0,4 · 124 750 = 49 900 ≈ <b>50 000</b>.<br>
Canvas-variant: p = 0,6 → 0,6 · 124 750 = 74 850 ≈ <b>75 000</b>.<br>
Tre vs. fullt koblet med 10 noder: <b>9</b> meldinger i treet og <b>45</b> i det fullt koblede.</div>
<h3>Probabilistisk flooding</h3>
<p>For å redusere antall meldinger videresender hver node meldingen bare med en sannsynlighet p<sub>flood</sub>. <b>Hovedgrunnen: redusere antall meldinger i nettverket</b> (jan 2025 1f). Ulempen er at noen noder kanskje ikke nås.</p>
`,
      quiz: [
        { q: 'Et ustrukturert P2P-nett med 500 noder, p = 0,4 for at to noder er koblet. Forventet antall meldinger ved flooding?', o: ['200', '50 000', '500', '125 000'], a: [1], e: '0,4 · 500·499/2 ≈ 50 000.' },
        { q: 'Et tre og en fullt koblet graf, begge med 10 noder. Antall meldinger ved flooding?', o: ['9 i treet og 45 i fullt koblet', '10 og 50', '9 og 100', '50 og 10'], a: [0], e: 'Tre: N−1 = 9. Fullt koblet: 10·9/2 = 45.' },
        { q: 'Hovedgrunnen til probabilistisk flooding er å …', o: ['lage et strukturert overlay', 'øke antall meldinger for pålitelighet', 'redusere antall meldinger i nettverket'], a: [2], e: 'Hver node sender bare videre med sannsynlighet p.' },
        { q: 'Hvilke utsagn om flooding-basert multicast stemmer?', o: ['Meldinger rutes gjennom alle tilkoblede noder', 'Antall meldinger avhenger av antall kanter i overlayet', 'Det er billigere å flood-e i en fullt koblet graf enn i et tre med like mange noder', 'Ruting i et ustrukturert nett koster det samme som i et strukturert nett'], a: [0, 1], e: 'Fullt koblet = flest kanter = flest meldinger.' }
      ]
    },
    {
      id: 'mcast-4',
      title: 'Gossip-basert spredning (epidemiske protokoller)',
      html: `
<p>Inspirert av hvordan sykdom sprer seg. En node er <b>infisert</b> (har en oppdatering den vil spre), <b>mottakelig</b> (har ikke sett den) eller <b>fjernet</b> (har den, men sprer den ikke lenger).</p>
<h3>Anti-entropi</h3>
<p>Hver node P velger med jevne mellomrom en tilfeldig node Q og utveksler oppdateringer:</p>
<ul>
  <li><b>Push</b>: P sender bare sine oppdateringer til Q.</li>
  <li><b>Pull</b>: P henter nye oppdateringer fra Q.</li>
  <li><b>Push-pull</b>: P og Q sender oppdateringer til hverandre. Raskest – sprer til alle på O(log N) runder.</li>
</ul>
<div class="callout why"><span class="ct">Når er push dårlig og pull god?</span>
Når <b>mange</b> noder allerede er infisert, velger en infisert node med push ofte en node som allerede har oppdateringen – bortkastet. Med <b>pull</b> spør hver gjenværende mottakelig node aktivt etter oppdateringer, og treffer nesten alltid en infisert node. Derfor: er 99 % oppdatert, prioriter <b>pull</b> for å nå den siste 1 %.</div>
<h3>Rykte-spredning (rumor spreading / gossiping)</h3>
<p>En node som kontakter en annen node som allerede har oppdateringen, slutter å spre med sannsynlighet 1/k. Raskt og billig, men <b>ingen garanti</b> for at alle nås (en liten andel s forblir uvitende; med k = 4 er s ≈ 0,7 %). Kombineres derfor ofte med anti-entropi.</p>
<h3>Slette data</h3>
<p>Å bare slette en verdi fungerer ikke – den gamle kopien vil spres igjen. Løsning: <b>dødssertifikater</b> (death certificates) – slettingen spres som en vanlig oppdatering.</p>
`,
      quiz: [
        { q: 'Hvilke metoder brukes for å utveksle oppdateringer i anti-entropi?', o: ['Pull (P henter fra Q)', 'Push-pull (P og Q sender til hverandre)', 'Push (P sender bare sine oppdateringer til Q)'], a: [0, 1, 2], e: 'Alle tre er varianter av anti-entropi.' },
        { q: '99 % av 10 000 replikaer har fått en oppdatering. Hva bør prioriteres for å nå de siste 1 %?', o: ['Push-pull', 'Push', 'Pull'], a: [2], e: 'De få mottakelige nodene spør selv og treffer nesten alltid en infisert node.' },
        { q: 'Hvorfor brukes dødssertifikater i gossip-systemer?', o: ['For å kryptere data', 'Fordi en slettet verdi ellers ville blitt spredt på nytt fra gamle kopier', 'For å telle runder', 'For å velge leder'], a: [1], e: 'Slettingen må selv spres som en oppdatering.' }
      ]
    }
  ],
  summary: [
    'ALM: prosessene videresender multicast selv i et overlay (tre eller mesh).',
    'Fullt koblet overlay: N(N−1)/2 kanter; kantkost = korteste fysiske vei (+1 +1 for tilkoblingslinkene).',
    'RDP/stretch = overlay-forsinkelse i treet / beste fysiske forsinkelse. 1 er perfekt.',
    'Tree cost = sum av kantkostnader i treet (globalt mål). Trær oppgis som kjeder: A – E – D betyr kantene A–E og E–D.',
    'Link stress = antall ganger samme pakke krysser samme fysiske link.',
    'Flooding: meldinger ≈ antall kanter. Tre: N−1. Fullt koblet: N(N−1)/2. Tilfeldig: p·N(N−1)/2.',
    'Probabilistisk flooding reduserer antall meldinger.',
    'Gossip: push, pull, push-pull. Pull er best når de fleste allerede er infisert. Rykte-spredning garanterer ikke full spredning. Dødssertifikater for sletting.'
  ],
  formulas: [
    { name: 'Kanter i fullt koblet graf', expr: 'E = N(N−1)/2', note: 'N prosesser' },
    { name: 'Forventede meldinger ved flooding (tilfeldig graf)', expr: 'M = p · N(N−1)/2', note: '500 noder, p=0,4 → ≈ 50 000' },
    { name: 'Stretch / RDP', expr: 'RDP = d_overlay(A→B) / d_fysisk(A→B)', note: 'Beste fysiske vei' },
    { name: 'Tree cost', expr: 'Σ kostnad for alle kanter i treet', note: 'Lavest = mest effektivt globalt' },
    { name: 'Overlay-kant', expr: 'c(X,Y) = 1 + korteste ruter-vei + 1', note: 'Når prosessene er koblet til ruterne med kostnad 1' }
  ],
  examQA: [
    { q: 'Draw the fully connected overlay network graph and label the edges with the smallest delay.', a: 'N(N−1)/2 kanter. For hvert par: korteste vei gjennom ruterne (sjekk begge retninger) + tilkoblingslinkene. Tegn alle prosessene og skriv tallet på hver kant.' },
    { q: 'Compute the stretch/RDP when a message is multicast from A to D using the trees. Which is most efficient?', a: 'Finn beste fysiske A→D. For hvert tre: summer kantene langs treets sti fra A til D. RDP = overlay/fysisk. Treet med RDP nærmest 1 er mest effektivt for A→D.' },
    { q: 'Compute the tree costs. Which tree is more efficient to route messages among the processes?', a: 'Tree cost = summen av alle kantene i treet. Treet med lavest tree cost er mest effektivt globalt.' }
  ]
});
