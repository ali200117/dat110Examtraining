DAT110.addModule({
  id: 'link',
  title: 'Linklaget: feildeteksjon, MAC, ARP, Ethernet og svitsjer',
  source: 'Kurose & Ross kap. 6.1, 6.2, 6.3 (s. 491–495, 499–503), 6.4–6.4.3, 6.7',
  exam: 'Oppgave 5/6 (ARP, hub vs svitsj, svitsjetabell, innkapsling: mai 2022, mai 2023, jan 2024, mai 2024, jan 2025, juni 2025) og Oppgave 1',
  goals: [
    'Beskrive tjenestene linklaget kan tilby og hvor det implementeres (NIC)',
    'Forklare paritet, sjekksum og CRC',
    'Skille kanalpartisjonering (TDM/FDM) og random access (ALOHA, CSMA, CSMA/CD)',
    'Forklare MAC-adresser og ARP – og løse ARP-oppgaver med huber og svitsjer',
    'Forklare Ethernet-rammen og selvlærende svitsjer',
    'Følge en web-forespørsel gjennom alle lag («a day in the life»)'
  ],
  sections: [
    {
      id: 'link-1',
      title: 'Linklagets tjenester',
      html: `
<p>Linklaget flytter en <b>ramme</b> (frame) fra én node til en <b>tilstøtende</b> node over <b>én link</b>. Et datagram kan gå over mange ulike linktyper på veien (Ethernet, WiFi, fiber) – hver med sin linklagsprotokoll.</p>
<div class="callout example"><span class="ct">Reiseanalogien</span>Reise Bergen → Roma: buss til Flesland, fly til Roma, tog til hotellet. Turist = datagram, hver etappe = link, transportmiddel = linklagsprotokoll, reisebyrå = rutingalgoritmen.</div>
<ul>
  <li><b>Framing</b>: kapsle datagram i ramme med header (MAC-adresser) og trailer.</li>
  <li><b>Link access</b>: MAC-protokoll som koordinerer tilgangen når flere deler mediet.</li>
  <li><b>Pålitelig levering</b> over linken – vanlig på trådløse linker (høy feilrate), sjelden på kablet Ethernet.</li>
  <li><b>Feildeteksjon</b> (og evt. feilretting).</li>
  <li>Flytkontroll, half/full dupleks.</li>
</ul>
<p>Linklaget implementeres i <b>nettverkskortet (NIC)</b> – i maskinvare – pluss litt programvare (driver). En ruter har én NIC (og ett linklag) <b>per grensesnitt</b>.</p>
<div class="callout exam"><span class="ct">Tjenesten «generelt» (mai 2022 1d / jan 2025 1a)</span><b>Unreliable transmission of frames across one communication link.</b></div>
`,
      quiz: [
        { q: 'Hvilken tjeneste gir linklaget generelt?', o: ['Multi-hop forwarding av rammer mellom verter', 'Upålitelig overføring av rammer over én kommunikasjonslink', 'Pålitelig overføring av rammer over én kommunikasjonslink'], a: [1], e: 'Ett hopp, oftest upålitelig (Ethernet).' },
        { q: 'Hvor implementeres linklaget hovedsakelig?', o: ['I applikasjonen', 'I nettverkskortet (NIC)', 'I DNS-serveren', 'I transportlaget'], a: [1], e: 'Maskinvare på kortet + driver.' }
      ]
    },
    {
      id: 'link-2',
      title: 'Feildeteksjon: paritet, sjekksum og CRC',
      html: `
<ul>
  <li><b>Enkel paritet</b>: én ekstra bit slik at antall 1-ere blir partall (even parity). Oppdager et <b>odde antall</b> bitfeil.</li>
  <li><b>2D-paritet</b>: paritet per rad og kolonne → kan <b>oppdage og rette</b> én bitfeil (krysningspunktet).</li>
  <li><b>Internett-sjekksum</b>: enerkomplement-sum (transportlaget/IP). Enkel, raskt i programvare.</li>
  <li><b>CRC</b> (Cyclic Redundancy Check): data D tolkes som et binært tall; avsender legger til r bit R slik at &lt;D,R&gt; er delelig (modulo 2) med en avtalt generator G (r+1 bit). Mottaker deler; rest ≠ 0 → feil. Oppdager alle burst-feil kortere enn r+1 bit. Brukes i Ethernet og WiFi (i maskinvare).</li>
</ul>
<span class="formula">R = rest( D · 2^r  /  G )   (modulo-2-divisjon = XOR uten mente)</span>
<div class="callout example"><span class="ct">CRC-eksempel (Kurose)</span>D = 101110, G = 1001 (r = 3). D·2³ = 101110000. Divider med XOR: rest R = <b>011</b>. Send 101110<b>011</b>.</div>
<div class="callout warn"><span class="ct">Fanger feildeteksjon alltid alle feil?</span><b>Nei</b> (Canvas: «Usann»). Det finnes alltid feilmønstre som ikke oppdages – målet er å gjøre sannsynligheten svært liten.</div>
`,
      quiz: [
        { q: 'Hvis vi bruker en feildeteksjonsteknikk (paritet, sjekksum, CRC), fanger vi alltid opp alle transmisjonsfeil.', o: ['Sant', 'Usant'], a: [1], e: 'Noen feilmønstre slipper alltid gjennom.' },
        { q: 'Hvilken teknikk brukes i Ethernet-rammer?', o: ['Enkel paritet', 'Internett-sjekksum', 'CRC'], a: [2], e: 'CRC-32 i trailer.' },
        { q: 'Hva kan 2D-paritet gjøre som enkel paritet ikke kan?', o: ['Oppdage og rette én bitfeil', 'Oppdage alle feil', 'Kryptere data', 'Ingenting'], a: [0], e: 'Rad- og kolonneparitet peker ut biten.' }
      ]
    },
    {
      id: 'link-3',
      title: 'Multiple access: TDM, FDM, ALOHA og CSMA',
      html: `
<p>På en <b>broadcast-link</b> (delt medium: gammel Ethernet med hub, WiFi) kan flere sende samtidig → <b>kollisjon</b>. Da trengs en <b>multiple access-protokoll</b>. På en <b>punkt-til-punkt-link</b> trengs det ikke.</p>
<div class="table-wrap"><table>
<tr><th>Klasse</th><th>Protokoller</th><th>Kollisjoner?</th><th>Egenskaper</th></tr>
<tr><td><b>Kanalpartisjonering</b></td><td><b>TDM</b> (tidsluker), <b>FDM</b> (frekvensbånd)</td><td>Nei</td><td>Rettferdig, men hver node får maks R/N selv om den er alene</td></tr>
<tr><td><b>Random access</b></td><td>ALOHA, slotted ALOHA, <b>CSMA</b>, CSMA/CD, CSMA/CA</td><td><b>Ja</b></td><td>Full rate R når én sender; kollisjoner håndteres med tilfeldig ventetid</td></tr>
<tr><td><b>Taking turns</b></td><td>Polling, token passing</td><td>Nei</td><td>Overhead, ett feilpunkt (master/token)</td></tr>
</table></div>
<h3>CSMA – «lytt før du snakker»</h3>
<p>Noden lytter på kanalen og sender bare hvis den er ledig. Kollisjoner kan <b>likevel</b> skje på grunn av <b>propagasjonsforsinkelse</b>: to noder kan oppfatte kanalen som ledig samtidig fordi signalet fra den andre ennå ikke har nådd fram.</p>
<p><b>CSMA/CD</b> (collision detection, klassisk Ethernet): avbryt sendingen straks kollisjon oppdages, vent tilfeldig tid med <b>binær eksponentiell backoff</b> (etter n-te kollisjon: vent K·512 bit-tider, K tilfeldig i {0, …, 2<sup>n</sup>−1}).</p>
<div class="callout exam"><span class="ct">Mai 2022 1e / jan 2025 1d</span>«For which type of medium access protocol may collision of frames occur?» → <b>CSMA</b>. FDM og TDM deler kanalen slik at ingen sender samtidig på samme ressurs.</div>
`,
      quiz: [
        { q: 'For hvilken medium access-protokoll kan kollisjoner av rammer forekomme?', o: ['FDM', 'CSMA', 'TDM'], a: [1], e: 'Random access → kollisjoner mulig.' },
        { q: 'På hvilken type link trengs en link access-protokoll for å koordinere tilgangen?', o: ['Broadcast-link', 'Punkt-til-punkt-link'], a: [0], e: 'Delt medium.' },
        { q: 'Hvorfor kan det bli kollisjon selv med CSMA?', o: ['Fordi noder ikke lytter', 'På grunn av propagasjonsforsinkelse – en node hører ikke at en annen nettopp har begynt å sende', 'Fordi CRC feiler', 'Det kan det ikke'], a: [1], e: 'Signalet bruker tid på å nå fram.' },
        { q: 'Kan det forekomme kollisjoner av rammer når en hub brukes til å koble sammen verter?', o: ['Sant', 'Usant'], a: [0], e: 'En hub kringkaster hvert bit på alle porter – ett kollisjonsdomene.' }
      ]
    },
    {
      id: 'link-4',
      title: 'MAC-adresser og ARP',
      html: `
<p>Hvert nettverksgrensesnitt har en <b>48-bit MAC-adresse</b> (LAN-/fysisk adresse), brent inn i NIC-en, skrevet heksadesimalt: <code>1A:2F:BB:76:09:AD</code>. MAC-adresser er <b>flate</b> (ingen hierarki) og følger kortet – som et personnummer. IP-adresser er hierarkiske og avhenger av hvor du er koblet til – som en postadresse.</p>
<p>Broadcast-adresse: <code>FF:FF:FF:FF:FF:FF</code>.</p>
<div class="callout example"><span class="ct">Heks → binær (Canvas)</span>50:7B:9D:E7:19:D0 → 5=0101 0=0000 | 7=0111 B=1011 | 9=1001 D=1101 | E=1110 7=0111 | 1=0001 9=1001 | D=1101 0=0000 → <span class="bits">01010000 01111011 10011101 11100111 00011001 11010000</span></div>
<h3>ARP – Address Resolution Protocol</h3>
<div class="callout"><span class="ct">Formål</span>Gitt <b>IP-adressen</b> til en node i <b>samme subnett</b>, finn dens <b>MAC-adresse</b>. Trengs fordi et IP-datagram må kapsles inn i en ramme med kilde- og destinasjons-MAC før det kan sendes over linken – og ved videresending kjenner vi bare neste-hopp-ets IP-adresse.</div>
<ol class="steps">
  <li>A vil sende til B (IP kjent), men B sin MAC står ikke i A sin <b>ARP-tabell</b>.</li>
  <li>A <b>kringkaster</b> en ARP-query (dest-MAC FF:FF:FF:FF:FF:FF) med B sin IP: «hvem har 132.200.1.3?»</li>
  <li>Alle i LAN-et mottar den. <b>Bare B</b> (den med den IP-en) svarer med en <b>unicast</b> ARP-reply med sin MAC.</li>
  <li>A legger inn <b>(IP, MAC, TTL)</b> i ARP-tabellen (soft state – utløper, typisk etter ~20 min).</li>
</ol>
<p>ARP-tabellen lagrer altså <b>sammenhengen mellom IP-adresser og MAC-adresser</b>. ARP er plug-and-play – ingen administrator trengs.</p>
<h3>Sende til et annet subnett</h3>
<p>Skal A (132.200.1.1) sende til H4 (221.198.1.4) bak ruteren R:</p>
<ul>
  <li>IP-datagrammet: kilde-IP = A, <b>dest-IP = H4</b> (hele veien).</li>
  <li>Rammen på første hopp: kilde-MAC = A, <b>dest-MAC = ruterens grensesnitt</b> mot A sitt nett (funnet med ARP på <b>ruterens IP-adresse</b> på det grensesnittet).</li>
  <li>Ruteren lager en ny ramme mot H4: kilde-MAC = ruterens andre grensesnitt, dest-MAC = H4.</li>
</ul>
<div class="callout exam"><span class="ct">Jan 2024 6b / mai 2024 6b</span>«What IP address should H0 specify in the ARP query to obtain the link-layer address of interface 1 of R1?» → <b>IP-adressen til interface 1 på R1</b> (ruterens grensesnitt i samme subnett), f.eks. 132.200.1.3 / 108.201.1.3. Ikke destinasjonsvertens IP!</div>
`,
      quiz: [
        { q: 'Hva er formålet med ARP?', o: ['Konfigurere et grensesnitt med en IP-adresse', 'Avbilde en IP-adresse til tilhørende link-lag (MAC)-adresse', 'Konfigurere et nettverkskort med en MAC-adresse'], a: [1], e: 'IP → MAC innenfor samme subnett.' },
        { q: 'Hvilken informasjon lagres i en ARP-tabell?', o: ['Sammenheng mellom grensesnittnummer og MAC-adresse', 'Sammenheng mellom IP-adresser og MAC-adresser', 'Hvilke verter som skal få hvilke IP-adresser'], a: [1], e: '(IP, MAC, TTL). Svitsjetabellen har port ↔ MAC.' },
        { q: 'Hvilket 48-bit mønster tilsvarer 50:7B:9D:E7:19:D0?', o: ['010111100111101101011101111001111101100111010000', '010100000111101110011101111001110001100111010000', '010101000111101110001101101001110000100101010000'], a: [1], e: 'Hvert heks-siffer = 4 bit.' },
        { q: 'Hvordan sendes en ARP-query og en ARP-reply?', o: ['Query unicast, reply broadcast', 'Query broadcast, reply unicast', 'Begge broadcast', 'Begge unicast'], a: [1], e: 'Spørsmålet til alle, svaret bare til spørreren.' },
        { q: 'H0 skal sende til en vert i et annet nett via ruter R1. Hvilken IP spør H0 om i ARP-query?', o: ['Destinasjonsvertens IP', 'IP-adressen til R1 sitt grensesnitt i H0 sitt subnett', 'DNS-serverens IP', 'Broadcast-IP'], a: [1], e: 'Rammen skal bare til første hopp.' }
      ]
    },
    {
      id: 'link-5',
      title: 'Ethernet, huber og selvlærende svitsjer',
      html: `
<h3>Ethernet-rammen</h3>
<div class="figure"><svg viewBox="0 0 620 70" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="15" width="90" height="36" class="bx"/><text x="50" y="37" text-anchor="middle" class="txs">Preamble (8)</text>
  <rect x="95" y="15" width="90" height="36" class="bx2"/><text x="140" y="31" text-anchor="middle" class="txs">Dest.</text><text x="140" y="45" text-anchor="middle" class="txs">address (6)</text>
  <rect x="185" y="15" width="90" height="36" class="bx2"/><text x="230" y="31" text-anchor="middle" class="txs">Source</text><text x="230" y="45" text-anchor="middle" class="txs">address (6)</text>
  <rect x="275" y="15" width="60" height="36" class="bxw"/><text x="305" y="37" text-anchor="middle" class="txs">Type (2)</text>
  <rect x="335" y="15" width="190" height="36" class="bxg"/><text x="430" y="37" text-anchor="middle" class="txs">Data (46–1500 byte)</text>
  <rect x="525" y="15" width="90" height="36" class="bx"/><text x="570" y="37" text-anchor="middle" class="txs">CRC (4)</text>
</svg></div>
<ul>
  <li><b>Preamble</b>: synkronisering av klokker. <b>Dest/Source</b>: MAC-adresser. <b>Type</b>: hvilken protokoll som ligger i datafeltet (IP, ARP …). <b>CRC</b>: feildeteksjon.</li>
  <li>Ethernet er <b>forbindelsesløst</b> og <b>upålitelig</b>: ingen handshake, ingen ACK/NAK. Rammer med CRC-feil forkastes.</li>
  <li>MTU (maks data) = <b>1500 byte</b>.</li>
</ul>
<h3>Hub vs. svitsj</h3>
<div class="compare">
  <div><h4>Hub (lag 1)</h4><p>Gjentar hvert innkommende bit ut på <b>alle andre porter</b>. Ingen bufring, ingen adresser. Alle tilkoblede deler ett <b>kollisjonsdomene</b>.</p></div>
  <div><h4>Svitsj (lag 1–2)</h4><p>Lagrer og videresender rammer <b>selektivt</b> basert på dest-MAC og en <b>svitsjetabell</b> (port ↔ MAC). Hver port er sitt eget kollisjonsdomene. <b>Transparent</b> for vertene (de vet ikke at den finnes) og <b>plug-and-play</b>.</p></div>
</div>
<h3>Den selvlærende svitsjen</h3>
<ol class="steps">
  <li>Ramme kommer inn på port p med kilde-MAC S → <b>lær</b>: legg inn (p, S) i tabellen.</li>
  <li>Slå opp dest-MAC D:
    <ul><li>Finnes (q, D) og q = p → <b>forkast</b> (filter – mottakeren er på samme segment).</li>
    <li>Finnes (q, D), q ≠ p → <b>videresend bare på port q</b>.</li>
    <li>Finnes ikke (eller D er broadcast) → <b>flood</b>: send på alle porter unntatt p.</li></ul>
  </li>
</ol>
<div class="callout warn"><span class="ct">Det svitsjen lærer er KILDEN</span>Svitsjen lærer bare fra <b>kilde-MAC</b> på innkommende rammer. En ramme fra 0x3A til 0x3B i en tom svitsj gir <b>én</b> oppføring – for 0x3A.</div>
<h3>Typisk eksamensoppgave (mai 2022 / mai 2023 / juni 2025, oppgave 5)</h3>
<div class="figure"><svg viewBox="0 0 640 210" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="30" width="56" height="34" rx="6" class="bx"/><text x="48" y="52" text-anchor="middle" class="tx">H1</text>
  <text x="20" y="20" class="txm">132.200.1.1 · 1A:1B:…:1F</text>
  <rect x="20" y="140" width="56" height="34" rx="6" class="bx"/><text x="48" y="162" text-anchor="middle" class="tx">H2</text>
  <text x="20" y="195" class="txm">132.200.1.2 · 2A:2B:…:2F</text>
  <circle cx="160" cy="104" r="26" class="bxw"/><text x="160" y="109" text-anchor="middle" class="tx">Hb</text>
  <circle cx="300" cy="104" r="26" class="bx2"/><text x="300" y="109" text-anchor="middle" class="tx">R</text>
  <text x="230" y="80" class="txm" text-anchor="middle">if1: 132.200.1.3</text><text x="230" y="92" class="txm" text-anchor="middle">6A:6B:…:6F</text>
  <text x="370" y="80" class="txm" text-anchor="middle">if2: 221.198.1.3</text><text x="370" y="92" class="txm" text-anchor="middle">5A:5B:…:5F</text>
  <rect x="420" y="86" width="64" height="36" rx="6" class="bxg"/><text x="452" y="109" text-anchor="middle" class="tx">Sw</text>
  <rect x="560" y="30" width="56" height="34" rx="6" class="bx"/><text x="588" y="52" text-anchor="middle" class="tx">H3</text>
  <text x="520" y="20" class="txm">221.198.1.3 · 3A:…:3F</text>
  <rect x="560" y="140" width="56" height="34" rx="6" class="bx"/><text x="588" y="162" text-anchor="middle" class="tx">H4</text>
  <text x="520" y="195" class="txm">221.198.1.4 · 4A:…:4F</text>
  <line x1="76" y1="52" x2="140" y2="90" class="ln"/><line x1="76" y1="155" x2="140" y2="118" class="ln"/><line x1="186" y1="104" x2="274" y2="104" class="ln"/><line x1="326" y1="104" x2="420" y2="104" class="ln"/>
  <line x1="484" y1="96" x2="560" y2="52" class="ln"/><line x1="484" y1="112" x2="560" y2="155" class="ln"/>
  <text x="410" y="122" class="txb">1</text><text x="494" y="84" class="txb">2</text><text x="494" y="132" class="txb">3</text>
</svg><figcaption>H1, H2 og R på en hub; R, H3 og H4 på en svitsj (port 1 = R, 2 = H3, 3 = H4).</figcaption></div>
<ul>
  <li><b>H1 sender ARP-query for 132.200.1.3</b>: huben sender den til alle → <b>H2 og R mottar</b>. Bare <b>R svarer</b> (har den IP-en). H1 sin ARP-tabell: (132.200.1.3 → 6A:6B:6C:6D:6E:6F).</li>
  <li><b>Svitsjetabellen har (1, 5A:…)</b> og H4 sender til 5A:… → videresendes <b>bare på port 1</b>.</li>
  <li><b>H3 sender til H4</b> (tom tabell) → svitsjen lærer <b>(2, 3A:…)</b>. Svarer H4 → lærer også <b>(3, 4A:…)</b>.</li>
  <li><b>Juni 2025 5d</b>: tom tabell, H4 sender til H3 → H4 må først ARP-e (broadcast inn på port 3, floodes til port 1 og 2). ARP-reply fra H3 → tabellen får <b>3 → 4A:…</b> og <b>2 → 3A:…</b>.</li>
  <li><b>Datagram H1 → H4</b>: IP-kilde 132.200.1.1, IP-dest 221.198.1.4. Første ramme: kilde-MAC 1A:…, <b>dest-MAC 6A:…</b> (R sitt if1).</li>
</ul>
<div class="callout"><span class="ct">Kan rammer gå tapt i en Ethernet-svitsj?</span><b>Ja</b> – hvis output-bufferet er fullt (Canvas: «Sann»).</div>
`,
      quiz: [
        { q: 'På hvilket lag opererer en hub?', o: ['Fysisk', 'Link', 'Nettverk'], a: [0], e: 'Hub = repeater på bitnivå.' },
        { q: 'På hvilke lag opererer en svitsj?', o: ['Bare fysisk', 'Fysisk og link', 'Fysisk, link og nettverk'], a: [1], e: 'Svitsjen ser på MAC-adresser.' },
        { q: 'En ramme med kilde 0x3A og mottaker 0x3B sendes gjennom en tom svitsj. Hvilke oppføringer opprettes?', o: ['Én for 0x3A', 'Én for 0x3B', 'To – én for hver adresse'], a: [0], e: 'Svitsjen lærer bare kilden.' },
        { q: 'H1, H2 og ruteren R henger på en hub. H1 sender ARP-query etter R sin IP. Hvem mottar den, og hvem svarer?', o: ['Bare R mottar og svarer', 'H2 og R mottar; bare R svarer', 'H2 og R mottar; begge svarer', 'Ingen mottar'], a: [1], e: 'Huben kringkaster; bare eieren av IP-en svarer.' },
        { q: 'Svitsjetabellen har (1, 5A:5B:5C:5D:5E:5F). H4 sender en ramme til denne adressen. Hvor videresendes den?', o: ['Alle porter', 'Bare port 1', 'Alle unntatt port 1', 'Den forkastes'], a: [1], e: 'Kjent destinasjon → selektiv videresending.' },
        { q: 'Kan det forekomme tap av rammer i en Ethernet-svitsj?', o: ['Sant', 'Usant'], a: [0], e: 'Bufferoverflyt i output-porten.' }
      ]
    },
    {
      id: 'link-6',
      title: 'A day in the life of a web request',
      html: `
<p>Kurose 6.7 setter alt sammen. Bob kobler laptopen til campusnettet og åpner www.google.com:</p>
<ol class="steps">
  <li><b>DHCP</b>: laptopen har ingen IP. Sender DHCP discover (UDP → IP broadcast → Ethernet broadcast). Svitsjen flooder; DHCP-serveren i ruteren svarer. Laptopen får IP, maske, <b>default gateway</b> og <b>DNS-server</b>.</li>
  <li><b>ARP</b>: for å sende DNS-forespørselen ut av subnettet trengs gatewayens MAC → ARP-query (broadcast), ARP-reply fra ruteren.</li>
  <li><b>DNS</b>: DNS-query (UDP, port 53) sendes i en ramme til gatewayen, rutes (OSPF/BGP har fylt tabellene) til DNS-serveren, som svarer med Googles IP.</li>
  <li><b>TCP</b>: treveis håndtrykk (SYN, SYNACK, ACK) med Googles server, port 80/443.</li>
  <li><b>HTTP</b>: GET-request i TCP-segmentet; Google svarer med HTML-en. Nettleseren viser siden.</li>
</ol>
<div class="callout tip"><span class="ct">Hvorfor nyttig?</span>Denne kjeden (DHCP → ARP → DNS → TCP → HTTP) binder sammen nesten hele nettverksdelen, og er perfekt for å svare på «hva skjer når …»-spørsmål.</div>
`,
      quiz: [
        { q: 'Hva er rekkefølgen når en ny laptop åpner en nettside?', o: ['DNS → DHCP → ARP → TCP → HTTP', 'DHCP → ARP → DNS → TCP → HTTP', 'ARP → DHCP → HTTP → DNS → TCP', 'TCP → DHCP → DNS → ARP → HTTP'], a: [1], e: 'Først IP-adresse (DHCP), så gatewayens MAC (ARP), så IP-en til serveren (DNS), så forbindelse (TCP) og forespørsel (HTTP).' }
      ]
    }
  ],
  summary: [
    'Linklaget: ramme over én link; implementert i NIC. Ethernet: upålitelig, forbindelsesløst, MTU 1500, CRC.',
    'Feildeteksjon: paritet (1 bit), 2D-paritet (kan rette 1 bit), sjekksum, CRC. Ingen fanger alle feil.',
    'Multiple access: TDM/FDM (ingen kollisjon), random access ALOHA/CSMA (kollisjon mulig), taking turns.',
    'CSMA kolliderer pga. propagasjonsforsinkelse. CSMA/CD: avbryt + binær eksponentiell backoff.',
    'MAC: 48 bit, flat, følger kortet. Broadcast FF:FF:FF:FF:FF:FF.',
    'ARP: IP → MAC i samme subnett. Query broadcast, reply unicast. ARP-tabell (IP, MAC, TTL).',
    'Til annet subnett: dest-IP = mål, dest-MAC = gatewayens grensesnitt (ARP på gatewayens IP).',
    'Hub: lag 1, kringkaster alt. Svitsj: lag 1–2, selvlærende (lærer kilde-MAC per port), filter/forward/flood.',
    'Day in the life: DHCP → ARP → DNS → TCP → HTTP.'
  ],
  formulas: [
    { name: 'CRC', expr: 'R = rest(D · 2^r / G), modulo 2', note: 'Send D,R. Mottaker: rest(<D,R>/G) = 0 → ingen feil' },
    { name: 'Binær eksponentiell backoff', expr: 'K ∈ {0,…,2^n − 1}, vent K · 512 bit-tider', note: 'etter n-te kollisjon' }
  ],
  examQA: [
    { q: 'Explain why ARP is needed in an IP network.', a: 'An IP datagram must be encapsulated in a link-layer frame with source and destination link-layer addresses. When forwarding we only know the next-hop IP address, so we need to find the corresponding link-layer address – this is done with ARP.' },
    { q: 'H1 sends an ARP query with target IP X. Which nodes receive it and which reply? (justify)', a: 'Alle på samme LAN mottar (broadcast; en hub videresender på alle porter). Bare noden som eier IP-adresse X svarer (unicast).' },
    { q: 'What entry is created in H1’s ARP table when the reply arrives?', a: '(X, MAC-adressen til noden som svarte), f.eks. (132.200.1.3, 6A:6B:6C:6D:6E:6F).' },
    { q: 'What will be the content of the switch table after H3 sends to H4 and H4 replies?', a: 'Svitsjen lærer kilde-MAC og innkommende port for hver ramme: (port til H3, MAC H3) og (port til H4, MAC H4).' },
    { q: 'What will be the source and destination link-layer addresses of the frame on the first hop from H1 to router R?', a: 'Source = H1 sin MAC (avsender av rammen); destination = MAC-adressen til R sitt grensesnitt mot H1 sitt nett (mottaker av rammen).' }
  ]
});
