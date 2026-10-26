DAT110.addModule({
  id: 'network',
  title: 'Nettverkslaget: IP, adressering og forwarding',
  source: 'Kurose & Ross kap. 4.1, 4.2–4.2.3, 4.3, 4.5',
  exam: 'Oppgave 4 (IPv4-header: mai 2022, jan 2025) og Oppgave 6 (binær IP, CIDR, longest prefix match, DHCP) – hvert år! Oppgave 3 (fragmentering, mai 2022)',
  goals: [
    'Skille forwarding (dataplan) og routing (kontrollplan)',
    'Beskrive hva som skjer inne i en ruter',
    'Forklare alle feltene i IPv4-headeren',
    'Regne IP-fragmentering med identifier, flagg og offset',
    'Konvertere IP-adresser til/fra binær, finne CIDR-intervaller og antall adresser',
    'Bruke longest prefix match på en videresendingstabell',
    'Forklare DHCP, NAT og hvorfor vi bruker IP-adresser og ikke MAC-adresser'
  ],
  sections: [
    {
      id: 'network-1',
      title: 'Forwarding vs. routing og nettverkslagets tjeneste',
      html: `
<div class="compare">
  <div><h4>Forwarding (dataplanet)</h4><p><b>Lokal</b> handling i én ruter: flytt en innkommende pakke fra input-link til riktig output-link ved å slå opp i <b>videresendingstabellen</b>. Skjer i maskinvare, nanosekunder, for hver pakke.</p></div>
  <div><h4>Routing (kontrollplanet)</h4><p><b>Nettverksomfattende</b> prosess: beregne beste (least-cost) stier fra kilde til mål, og dermed <b>innholdet i videresendingstabellene</b>. Algoritmer: link-state, distance-vector.</p></div>
</div>
<div class="callout exam"><span class="ct">Modellsvar (mai 2022 6f / juni 2025 6a)</span>
«The forwarding function is a <b>router-local</b> action concerned with moving an incoming packet from the input link interface to the appropriate output link interface <b>using the router's forwarding table</b>. The routing function is a <b>network-wide</b> process concerned with <b>computing the least-cost paths</b> packets take from source to destination, and it is used to <b>configure the forwarding table</b>.»</div>
<div class="callout tip"><span class="ct">Analogi</span>Routing = planlegge kjøreturen Bergen–Oslo på kartet. Forwarding = velge riktig avkjøring i ett bestemt veikryss.</div>
<p>Kontrollplanet kan være <b>per ruter</b> (tradisjonelt: hver ruter kjører rutingalgoritmen) eller <b>logisk sentralisert</b> (SDN: en ekstern kontroller beregner tabellene).</p>
<h3>Tjenestemodellen: best effort</h3>
<p>IP lover <b>ingenting</b>: ikke levering, ikke rekkefølge, ikke båndbredde, ikke forsinkelse. Tjenesten er <b>upålitelig multi-hop ende-til-ende-overføring av datagrammer mellom verter</b>. Enkelheten er grunnen til at Internett vokste så fort – pålitelighet legges i endesystemene (TCP).</p>
`,
      quiz: [
        { q: 'Hva er rollen til forwarding-funksjonen på nettverkslaget?', o: ['Beregne least-cost-stier i nettet', 'Overføre datagrammer fra innkommende link til riktig utgående link', 'Gi diagnostikk ved nettverksfeil'], a: [1], e: 'Lokal, per-pakke handling med tabelloppslag.' },
        { q: 'Hva er rollen til routing-funksjonen?', o: ['Gi diagnostikk ved feil', 'Overføre datagrammer fra input til output', 'Beregne innholdet som skal inn i rutertabellene'], a: [2], e: 'Routing fyller tabellene; forwarding bruker dem.' },
        { q: 'Hva finnes i videresendingstabellen til en ruter?', o: ['Destinasjonsadresser (prefikser) og utgående linker', 'Kildeadresser og innkommende linker', 'Hvilke linker ruteren er koblet til', 'Hele den korteste stien gjennom nettet'], a: [0], e: 'Prefiks → utgående grensesnitt.' },
        { q: 'Hvilken tjeneste gir nettverkslaget i TCP/IP?', o: ['Upålitelig ende-til-ende multi-hop overføring av datagrammer mellom verter', 'Upålitelig overføring mellom verter og rutere', 'Pålitelig ende-til-ende overføring mellom rutere'], a: [0], e: 'Best effort.' }
      ]
    },
    {
      id: 'network-2',
      title: 'Inne i en ruter',
      html: `
<div class="figure"><svg viewBox="0 0 620 200" xmlns="http://www.w3.org/2000/svg">
  <rect x="200" y="20" width="220" height="40" rx="8" class="bxw"/><text x="310" y="45" text-anchor="middle" class="txs">Rutingprosessor (kontrollplan)</text>
  <rect x="20" y="80" width="150" height="34" rx="6" class="bx2"/><text x="95" y="102" text-anchor="middle" class="txs">Input-port</text>
  <rect x="20" y="130" width="150" height="34" rx="6" class="bx2"/><text x="95" y="152" text-anchor="middle" class="txs">Input-port</text>
  <rect x="235" y="80" width="150" height="84" rx="8" class="bx"/><text x="310" y="118" text-anchor="middle" class="txs">Svitsjestruktur</text><text x="310" y="134" text-anchor="middle" class="txmu">(switching fabric)</text>
  <rect x="450" y="80" width="150" height="34" rx="6" class="bxg"/><text x="525" y="102" text-anchor="middle" class="txs">Output-port</text>
  <rect x="450" y="130" width="150" height="34" rx="6" class="bxg"/><text x="525" y="152" text-anchor="middle" class="txs">Output-port</text>
  <line x1="170" y1="97" x2="235" y2="105" class="ln"/><line x1="170" y1="147" x2="235" y2="140" class="ln"/><line x1="385" y1="105" x2="450" y2="97" class="ln"/><line x1="385" y1="140" x2="450" y2="147" class="ln"/>
  <line x1="310" y1="60" x2="310" y2="80" class="lnd"/>
  <text x="95" y="185" text-anchor="middle" class="txmu">oppslag i tabell (LPM)</text><text x="525" y="185" text-anchor="middle" class="txmu">kø + planlegging</text>
</svg></div>
<ul>
  <li><b>Input-port</b>: fysisk og link-lag-mottak, så <b>oppslag i videresendingstabellen</b> (desentralisert – hver port har en kopi) med <b>longest prefix match</b>. Køing hvis strukturen er opptatt (head-of-line blocking).</li>
  <li><b>Svitsjestruktur</b>: flytter pakken fra input til output – via minne, buss eller crossbar.</li>
  <li><b>Output-port</b>: bufring og <b>planlegging</b> (FIFO, prioritet, round robin, weighted fair queuing). Fullt buffer → <b>tap</b>.</li>
  <li><b>Rutingprosessor</b>: kjører rutingprotokollene og oppdaterer tabellene.</li>
</ul>
`,
      quiz: [
        { q: 'Hvor gjøres oppslaget i videresendingstabellen i en moderne ruter?', o: ['I output-porten', 'I input-porten (desentralisert)', 'Bare i rutingprosessoren', 'I svitsjestrukturen'], a: [1], e: 'Hver input-port har en kopi av tabellen for å holde linjehastighet.' },
        { q: 'Hvor oppstår pakketap typisk i en ruter?', o: ['I rutingprosessoren', 'Når køen ved en output-port er full', 'I kabelen', 'Ved oppslag'], a: [1], e: 'Bufferoverflyt.' }
      ]
    },
    {
      id: 'network-3',
      title: 'IPv4-datagrammet',
      html: `
<div class="figure"><svg viewBox="0 0 520 250" xmlns="http://www.w3.org/2000/svg">
  <text x="260" y="12" text-anchor="middle" class="txs">32 bit</text>
  <rect x="20" y="18" width="70" height="30" class="bx2"/><text x="55" y="37" text-anchor="middle" class="txs">Version</text>
  <rect x="90" y="18" width="60" height="30" class="bx2"/><text x="120" y="31" text-anchor="middle" class="txs">Header</text><text x="120" y="43" text-anchor="middle" class="txs">length</text>
  <rect x="150" y="18" width="110" height="30" class="bx2"/><text x="205" y="37" text-anchor="middle" class="txs">Type of service</text>
  <rect x="260" y="18" width="240" height="30" class="bx2"/><text x="380" y="37" text-anchor="middle" class="txs">Datagram length (bytes)</text>
  <rect x="20" y="48" width="240" height="30" class="bxw"/><text x="140" y="67" text-anchor="middle" class="txs">16-bit Identifier</text>
  <rect x="260" y="48" width="50" height="30" class="bxw"/><text x="285" y="67" text-anchor="middle" class="txs">Flags</text>
  <rect x="310" y="48" width="190" height="30" class="bxw"/><text x="405" y="67" text-anchor="middle" class="txs">13-bit Fragmentation offset</text>
  <rect x="20" y="78" width="120" height="30" class="bx2"/><text x="80" y="97" text-anchor="middle" class="txs">Time-to-live</text>
  <rect x="140" y="78" width="120" height="30" class="bx2"/><text x="200" y="91" text-anchor="middle" class="txs">Upper-layer</text><text x="200" y="103" text-anchor="middle" class="txs">protocol</text>
  <rect x="260" y="78" width="240" height="30" class="bx2"/><text x="380" y="97" text-anchor="middle" class="txs">Header checksum</text>
  <rect x="20" y="108" width="480" height="30" class="bxg"/><text x="260" y="127" text-anchor="middle" class="txs">32-bit Source IP address</text>
  <rect x="20" y="138" width="480" height="30" class="bxg"/><text x="260" y="157" text-anchor="middle" class="txs">32-bit Destination IP address</text>
  <rect x="20" y="168" width="480" height="30" class="bx"/><text x="260" y="187" text-anchor="middle" class="txs">Options (if any)</text>
  <rect x="20" y="198" width="480" height="40" class="bx"/><text x="260" y="222" text-anchor="middle" class="txs">Data (f.eks. TCP- eller UDP-segment)</text>
</svg><figcaption>Uten options er headeren 5 rader à 32 bit = 5 · 4 byte = 20 byte.</figcaption></div>
<div class="table-wrap"><table>
<tr><th>Felt</th><th>Formål</th></tr>
<tr><td>Version</td><td>IP-versjon (4) – så ruteren vet hvordan resten tolkes</td></tr>
<tr><td>Header length</td><td>Lengden på headeren (pga. valgfrie options); vanligvis 20 byte</td></tr>
<tr><td>Type of service</td><td>Skille typer datagrammer (f.eks. sanntid vs. vanlig)</td></tr>
<tr><td>Datagram length</td><td>Total lengde (header + data) i byte – maks 65 535</td></tr>
<tr><td><b>Identifier</b></td><td>Avgjør hvilke fragmenter som hører til <b>samme opprinnelige datagram</b></td></tr>
<tr><td><b>Flags</b></td><td>Avgjør når reassemblering er ferdig (flagg = 0 betyr <b>siste fragment</b>)</td></tr>
<tr><td><b>Fragmentation offset</b></td><td>Hvor i det opprinnelige datagrammet fragmentets data hørte hjemme (i enheter à 8 byte)</td></tr>
<tr><td><b>Time-to-live</b></td><td>Dekrementeres i hver ruter; når 0 droppes datagrammet → <b>oppdager/hindrer rutingløkker</b></td></tr>
<tr><td><b>Upper-layer protocol</b></td><td>Hvilken transportprotokoll som ligger i datafeltet (6 = TCP, 17 = UDP)</td></tr>
<tr><td>Header checksum</td><td>Oppdage bitfeil i headeren (beregnes på nytt i hver ruter fordi TTL endres)</td></tr>
<tr><td><b>Source IP</b></td><td>IP-adressen til avsenderen</td></tr>
<tr><td><b>Destination IP</b></td><td>IP-adressen til mottakeren – det eneste ruterne bruker for videresending</td></tr>
<tr><td>Data</td><td>Nyttelasten som skal leveres mellom avsender og mottaker</td></tr>
</table></div>
<div class="callout exam"><span class="ct">Mai 2022 4d: Hvorfor er kilde-IP med når ruting bare bruker destinasjon?</span>
Fordi mottakeren i mange tilfeller må <b>sende noe tilbake</b> (data, svar, ACK). Kilde-IP-en brukes som destinasjonsadresse i datagrammet som sendes i motsatt retning. (Den brukes også i ICMP-feilmeldinger.)</div>
`,
      quiz: [
        { q: 'Hvor stor er IPv4-headeren uten options?', o: ['8 byte', '16 byte', '20 byte', '32 byte'], a: [2], e: '5 rader à 32 bit = 160 bit = 20 byte.' },
        { q: 'Hva er formålet med Time-to-live?', o: ['Angi hvor lenge forbindelsen varer', 'Oppdage rutingløkker ved å dekrementere verdien i hvert hopp', 'Angi prioritet', 'Måle RTT'], a: [1], e: 'Når TTL når 0, droppes pakken (og en ICMP-melding sendes).' },
        { q: 'Hvorfor inneholder datagrammet kilde-IP når ruting bare bruker destinasjon?', o: ['For å beregne sjekksummen', 'For at mottakeren skal kunne sende svar/ACK tilbake', 'For fragmentering', 'Det trengs ikke'], a: [1], e: 'Kilde-IP blir destinasjon i svaret.' },
        { q: 'Hvilket felt brukes til å avgjøre hvilke fragmenter som tilhører samme datagram?', o: ['Flags', 'Identifier', 'Offset', 'TTL'], a: [1], e: 'Identifier er lik i alle fragmentene av samme datagram.' }
      ]
    },
    {
      id: 'network-4',
      title: 'IP-fragmentering (Oppgave 3, mai 2022)',
      html: `
<p>Hver link har en <b>MTU</b> (Maximum Transfer Unit) – den største mengden data en link-ramme kan bære (Ethernet: 1500 byte). Er datagrammet større, deles det i <b>fragmenter</b>. Fragmentene settes sammen igjen (<b>reassembleres</b>) først i <b>destinasjonsverten</b>.</p>
<h3>Oppskrift</h3>
<ol class="steps">
  <li><b>Header</b> = 20 byte (uten options).</li>
  <li><b>Data i opprinnelig datagram</b> = totallengde − 20.</li>
  <li><b>Maks data per fragment</b> = MTU − 20, <b>rundet ned til et multiplum av 8</b> (fordi offset måles i 8-byte-enheter). 1500 − 20 = 1480 (1480/8 = 185 ✓).</li>
  <li><b>Antall fragmenter</b> = ⌈ data / maks data per fragment ⌉.</li>
  <li><b>Offset</b> for fragment k = (antall databyte før fragmentet) / 8.</li>
  <li><b>Identifier</b> = samme som originalen i alle fragmenter. <b>Flagg</b> (more fragments) = 1 i alle unntatt det siste.</li>
</ol>
<h3>Regnet ut: 5200 byte over Ethernet (MTU 1500), identifier 110</h3>
<div class="table-wrap"><table class="center">
<tr><th>Fragment</th><th>Databyte</th><th>Byte i originalen</th><th>Total lengde</th><th>Identifier</th><th>Offset</th><th>Flagg</th></tr>
<tr><td>1</td><td>1480</td><td>0–1479</td><td>1500</td><td>110</td><td>0</td><td>1</td></tr>
<tr><td>2</td><td>1480</td><td>1480–2959</td><td>1500</td><td>110</td><td>1480/8 = <b>185</b></td><td>1</td></tr>
<tr><td>3</td><td>1480</td><td>2960–4439</td><td>1500</td><td>110</td><td>2960/8 = <b>370</b></td><td>1</td></tr>
<tr><td>4</td><td>5180 − 4440 = <b>740</b></td><td>4440–5179</td><td>760</td><td>110</td><td>4440/8 = <b>555</b></td><td>0</td></tr>
</table></div>
<p>Data i originalen: 5200 − 20 = 5180 byte. 5180 / 1480 = 3,5 → <b>4 fragmenter</b>.</p>
<div class="callout exam"><span class="ct">Reassemblering (mai 2022 3f)</span>
H2 bruker <b>16-bit identifier</b> for å avgjøre hvilke fragmenter som hører til samme opprinnelige datagram, og <b>fragmentation offset</b> for å sette dataene sammen i riktig rekkefølge. Flagget forteller når siste fragment er mottatt.</div>
<div class="callout"><span class="ct">IPv6</span>IPv6 tillater <b>ikke</b> fragmentering i rutere (for tregt). Er pakken for stor, droppes den og avsender får en ICMP «Packet Too Big».</div>
<p>👉 Tren på nye tall i <a href="trening.html#frag">Regnetrening → Fragmentering</a>.</p>
`,
      quiz: [
        { q: 'Et datagram på 4000 byte (20 byte header) sendes over en link med MTU 1500. Hvor mange fragmenter?', o: ['2', '3', '4', '5'], a: [1], e: 'Data = 3980. Maks 1480 per fragment → 1480 + 1480 + 1020 = 3 fragmenter.' },
        { q: 'Hva er offset for andre fragment når første fragment bærer 1480 databyte?', o: ['1480', '1500', '185', '187'], a: [2], e: 'Offset i 8-byte-enheter: 1480/8 = 185.' },
        { q: 'Hvor reassembleres fragmentene?', o: ['I neste ruter', 'I destinasjonsverten', 'I ruteren som fragmenterte', 'I DNS-serveren'], a: [1], e: 'Bare i endesystemet.' },
        { q: 'Hvorfor måles offset i enheter på 8 byte?', o: ['Fordi feltet bare er 13 bit, så maks offset 8191·8 = 65 528 dekker hele datagrammet', 'Fordi Ethernet sender 8 byte om gangen', 'Fordi headeren er 8 byte', 'Det er tilfeldig'], a: [0], e: '13 bit holder ikke for byte-adressering opp til 65 535.' }
      ]
    },
    {
      id: 'network-5',
      title: 'IP-adresser, binær konvertering og CIDR',
      html: `
<p>En IPv4-adresse er <b>32 bit</b>, skrevet i <b>dotted decimal</b>: fire tall 0–255, hvert = 8 bit. IP-adresser tildeles <b>nettverksgrensesnitt</b> (interfaces) på verter og rutere – ikke selve maskinen. En ruter med tre grensesnitt har tre IP-adresser.</p>
<div class="callout exam"><span class="ct">Jan 2024 1d</span>«How are IP addresses used?» → <b>IP addresses are assigned to network interfaces of hosts and of routers.</b></div>
<h3>Desimal → binær (metoden)</h3>
<p>Trekk fra posisjonsverdiene <b>128 64 32 16 8 4 2 1</b> fra venstre:</p>
<div class="table-wrap"><table class="center mono">
<tr><th>Tall</th><th>128</th><th>64</th><th>32</th><th>16</th><th>8</th><th>4</th><th>2</th><th>1</th><th>Binær</th></tr>
<tr><td>221</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td>1</td><td>11011101</td></tr>
<tr><td>198</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>11000110</td></tr>
<tr><td>201</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>11001001</td></tr>
<tr><td>132</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>10000100</td></tr>
<tr><td>108</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>01101100</td></tr>
<tr><td>223</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>11011111</td></tr>
</table></div>
<p>F.eks. 221: 221−128 = 93 → 93−64 = 29 → (32 passer ikke: 0) → 29−16 = 13 → 13−8 = 5 → 5−4 = 1 → (2: 0) → 1−1 = 0. → <span class="bits">11011101</span>.</p>
<p>Så: <b>221.198.201.1</b> = <span class="bits">11011101.11000110.11001001.00000001</span> (mai 2022 6b).</p>
<h3>CIDR – Classless InterDomain Routing</h3>
<p>Notasjon <b>a.b.c.d/x</b>: de første <b>x</b> bitene er <b>nettverksdelen (prefikset)</b>, resten (32 − x) er vertsdelen.</p>
<span class="formula">Antall adresser i en /x-blokk = 2^(32 − x)</span>
<ul>
  <li><b>Første adresse</b>: prefiksbitene + alle vertsbit = 0.</li>
  <li><b>Siste adresse</b>: prefiksbitene + alle vertsbit = 1.</li>
</ul>
<div class="callout example"><span class="ct">Eksempler fra eksamen</span>
<b>221.198.0.0/16</b> → 221.198.0.0 – 221.198.255.255 (2<sup>16</sup> = 65 536 adresser).<br>
<b>132.202.1.0/24</b> → 132.202.1.0 – 132.202.1.255 (256 adresser).<br>
<b>223.1.1.0/23</b> → 2<sup>9</sup> = <b>512</b> adresser (mai 2024 1d): 223.1.0.0 – 223.1.1.255 (byte 3 = 0000000<u>x</u>).<br>
<b>224.192.40.0/22</b> → 22 bit prefiks: 3. byte 40 = <span class="bits">001010|00</span> → de to siste bitene i byte 3 + hele byte 4 er vertsdel → 224.192.40.0 – 224.192.<b>43</b>.255 (jan 2025 6c).</div>
<div class="callout tip"><span class="ct">Snarvei når x ikke er 8/16/24</span>Blokkstørrelsen i den «delte» byten er 2<sup>(8 − bit brukt i den byten)</sup>. /22 bruker 6 bit av byte 3 → blokkstørrelse 2<sup>2</sup> = 4 → 40, 41, 42, 43.</div>
<p>👉 Tren i <a href="trening.html#ip">Regnetrening → IP og CIDR</a>.</p>
`,
      quiz: [
        { q: 'Hva er 10011110001110010100011001111010 i dotted decimal?', o: ['158.57.70.122', '127.56.1.7', '236.17.90.2'], a: [0], e: '10011110=158, 00111001=57, 01000110=70, 01111010=122.' },
        { q: 'Hvor mange IP-adresser er det i blokken 223.1.1.0/23?', o: ['1', '9', '256', '512'], a: [3], e: '2^(32−23) = 2^9 = 512.' },
        { q: 'Hvilket intervall dekker 132.202.1.0/24?', o: ['132.202.0.0 – 132.202.255.255', '132.202.1.0 – 132.202.1.255', '132.202.1.0 – 132.202.1.127', '132.0.0.0 – 132.255.255.255'], a: [1], e: '/24 → siste byte er vertsdel.' },
        { q: 'Hva er 200.193.57.14 i binær?', o: ['11001000 11000001 00111001 00001110', '11001000 11000001 00101010 00001110', '11000100 11000001 00111001 00001110', '11001000 10000001 00111001 00001110'], a: [0], e: '200=11001000, 193=11000001, 57=00111001, 14=00001110.' },
        { q: 'IP-adresser tildeles …', o: ['bare verter', 'verter og rutere (én per maskin)', 'nettverksgrensesnittene til verter og rutere'], a: [2], e: 'Én adresse per interface.' }
      ]
    },
    {
      id: 'network-6',
      title: 'Longest prefix match',
      html: `
<p>Ruteren sammenligner destinasjonsadressen (binært) med prefiksene i tabellen. Et prefiks <b>matcher</b> hvis de første bitene er like (resten ignoreres). Matcher flere, brukes det <b>lengste</b> (mest spesifikke). Matcher ingen, brukes <b>otherwise</b> (default).</p>
<h3>Mai 2022 6c–d</h3>
<p>Destinasjon <b>221.198.201.1</b> = <span class="bits"><span class="hlg">11011101 11000110</span> <span class="hl">11001001</span> 00000001</span></p>
<div class="table-wrap"><table class="mono">
<tr><th>Destination (prefiks)</th><th>Interface</th><th>Match?</th></tr>
<tr><td>10000100 11001010</td><td>1</td><td>✘ første bit er ulik</td></tr>
<tr><td>11011101 11000110</td><td>3</td><td>✔ 16 bit</td></tr>
<tr><td>11011101 11000110 11001001</td><td>2</td><td>✔ <b>24 bit – lengst</b></td></tr>
<tr><td>otherwise</td><td>2</td><td>–</td></tr>
</table></div>
<p>Uten den tredje linjen → interface <b>3</b>. Med den → <b>longest prefix match</b> gir interface <b>2</b>.</p>
<h3>Juni 2025 6e – inkludert «ingen match»</h3>
<div class="table-wrap"><table class="mono">
<tr><th>Destination</th><th>Interface</th></tr>
<tr><td>11011111 00000001 00000001</td><td>0</td></tr>
<tr><td>11011111 00000001 00001001</td><td>2</td></tr>
<tr><td>11011111 00000001 00000111</td><td>1</td></tr>
<tr><td>otherwise</td><td>3</td></tr>
</table></div>
<ul class="mono small">
<li>223.1.9.40 = 11011111 00000001 <span class="hlg">00001001</span> 00101000 → interface <b>2</b></li>
<li>223.1.7.125 = 11011111 00000001 <span class="hlg">00000111</span> 01111101 → interface <b>1</b></li>
<li>223.53.40.7 = 11011111 <span class="hlb">00110101</span> … → ingen match → <b>3</b></li>
</ul>
<h3>Mai 2023 6e – lag en ny regel</h3>
<p>Send alle adresser i <b>221.198.201.64 – 221.198.201.127</b> via interface 3. Binært: 64 = <span class="bits">01000000</span>, 127 = <span class="bits">01111111</span>. De har felles prefiks <span class="bits">11011101.11000110.11001001.<b>01</b></span> (26 bit). Legg til regelen <code>11011101 11000110 11001001 01 → 3</code>. Longest prefix match sørger for at den vinner over 24-bits-regelen.</p>
<div class="callout warn"><span class="ct">Vanlige feil</span>1) Konverter <b>hele</b> adressen til binær først. 2) Sjekk <b>alle</b> linjer, ikke bare første treff. 3) Et prefiks på 6 bit i en byte (f.eks. <span class="bits">001010</span>) skal sammenlignes med de 6 første bitene i den byten.</div>
`,
      quiz: [
        { q: 'Tabell: a) 11001000 00010111 00010*** · b) 11001000 00010111 00011000 · c) 11001000 00010111 00011***. Destinasjon starter med 11001000 00010111 00011000. Hvilken linje brukes?', o: ['a', 'b', 'c'], a: [1], e: 'a matcher ikke (00010 ≠ 00011). b og c matcher; b er lengst (24 bit).' },
        { q: 'Tabell: 11011101 11000110 → 3; 11011101 11000110 11001001 → 2; otherwise → 1. Hvor sendes 221.198.201.1?', o: ['1', '2', '3'], a: [1], e: 'Begge matcher; 24-bits-prefikset er lengst.' },
        { q: 'Tabell: 11001000 11000001 001010 → 1; 11001000 11000001 001111 → 2; otherwise → 4. Hvor sendes 200.193.57.14?', o: ['1', '2', '4'], a: [2], e: '57 = 00111001 → de 6 første bitene 001110 matcher verken 001010 eller 001111 → otherwise (jan 2025 6e).' }
      ]
    },
    {
      id: 'network-7',
      title: 'DHCP, NAT, IPv6 – og hvorfor ikke MAC-adresser?',
      html: `
<h3>DHCP – Dynamic Host Configuration Protocol</h3>
<p>Brukes av en vert som kommer inn i et nett for å <b>automatisk få en IP-adresse</b> (plug-and-play). Fire meldinger (DORA):</p>
<ol>
  <li><b>DHCP discover</b> (broadcast fra 0.0.0.0 til 255.255.255.255): «finnes det en DHCP-server?»</li>
  <li><b>DHCP offer</b>: serveren tilbyr en adresse.</li>
  <li><b>DHCP request</b>: verten ber om adressen.</li>
  <li><b>DHCP ACK</b>: serveren bekrefter.</li>
</ol>
<p>DHCP gir også <b>nettmaske</b>, <b>default gateway</b> (første-hopp-ruter) og <b>DNS-server</b>.</p>
<div class="callout exam"><span class="ct">Spurt i 2023, jan 2024, mai 2024</span>«What protocol can a new host H0 use to automatically configure its network interface with an IP address?» → <b>DHCP</b>. (Ikke ARP – ARP finner MAC fra IP. Ikke DNS – DNS finner IP fra navn.)</div>
<h3>NAT – Network Address Translation</h3>
<p>Alle maskiner i et hjemmenett deler <b>én offentlig IP-adresse</b>. Ruteren bytter ut (privat IP, port) med (offentlig IP, ny port) og husker koblingen i en <b>NAT-tabell</b>. Sparer IPv4-adresser og skjuler interne maskiner. Kritikk: bryter end-to-end-prinsippet (ruteren endrer porter på lag 4).</p>
<h3>IPv6</h3>
<p><b>128-bit</b> adresser (løser adressemangelen) · fast 40-byte header · ingen fragmentering i rutere · ingen header-checksum · <b>flow label</b>. Overgang via <b>tunneling</b> (IPv6 inni IPv4).</p>
<h3>Hvorfor IP-adresser og ikke MAC-adresser? (mai 2023 6f)</h3>
<div class="callout why"><span class="ct">Modellsvar</span>
En link-lag-adresse er knyttet til hvert nettverkskort og endres ikke. Noder i samme nett kan derfor ikke dele en felles del av adressen (nettverksadresse). Da måtte <b>hver enkelt MAC-adresse ligge i rutertabellene</b>, noe som gir <b>skaleringsproblemer</b>. IP-adresser er <b>hierarkiske</b>: ett prefiks dekker et helt nett (route aggregation), så tabellene blir små.</div>
<h3>Middlebokser (4.5)</h3>
<p>Enheter som gjør noe annet enn vanlig IP-forwarding mellom kilde og mål: NAT, brannmurer, IDS, lastbalanserere, cacher.</p>
`,
      quiz: [
        { q: 'Hva brukes DHCP til?', o: ['Avbilde vertsnavn til IP-adresser', 'Utveksle rutinginformasjon', 'Automatisk konfigurere en verts nettverksgrensesnitt med IP-adresse'], a: [2], e: 'Pluss nettmaske, gateway og DNS-server.' },
        { q: 'Hvorfor bruker Internett IP-adresser i stedet for MAC-adresser for ruting?', o: ['MAC-adresser er for lange', 'MAC-adresser er flate og ikke hierarkiske – rutere måtte lagret alle enkeltadresser, som ikke skalerer', 'MAC-adresser kan ikke krypteres', 'MAC-adresser endres hele tiden'], a: [1], e: 'IP-prefikser kan aggregeres.' },
        { q: 'Hvilken DHCP-melding sendes først?', o: ['DHCP offer', 'DHCP request', 'DHCP discover', 'DHCP ACK'], a: [2], e: 'Discover → Offer → Request → ACK.' },
        { q: 'Hvor mange bit har en IPv6-adresse?', o: ['32', '48', '64', '128'], a: [3], e: '128 bit.' }
      ]
    }
  ],
  summary: [
    'Forwarding: lokal, flytt pakke input→output via tabell. Routing: nettverksomfattende, beregner stier og fyller tabellene.',
    'IP er best effort: upålitelig multi-hop ende-til-ende-overføring av datagrammer.',
    'Ruter: input-port (oppslag/LPM), svitsjestruktur, output-port (kø, planlegging, tap), rutingprosessor.',
    'IPv4-header 20 byte. TTL mot løkker. Protocol: 6=TCP, 17=UDP. Identifier/flags/offset for fragmentering. Kilde-IP for svar.',
    'Fragmentering: maks data = MTU−20 (multiplum av 8); offset = byte før / 8; samme identifier; flagg 0 i siste. Reassembleres i målverten.',
    'IP-adresser tildeles grensesnitt. /x-blokk har 2^(32−x) adresser; første = vertsbit 0, siste = vertsbit 1.',
    'Longest prefix match: konverter til binær, finn alle matcher, velg lengste, ellers otherwise.',
    'DHCP: discover/offer/request/ACK – gir IP, maske, gateway, DNS. NAT: én offentlig IP for et privat nett.',
    'IP i stedet for MAC: hierarkisk adressering gir små rutertabeller (skalerbarhet).'
  ],
  formulas: [
    { name: 'IPv4-header', expr: '5 · 32 bit = 20 byte (uten options)', note: '' },
    { name: 'Data i datagram', expr: 'data = totallengde − 20', note: '' },
    { name: 'Maks data per fragment', expr: 'floor((MTU − 20) / 8) · 8', note: 'MTU 1500 → 1480' },
    { name: 'Antall fragmenter', expr: 'ceil(data / maksdata)', note: '' },
    { name: 'Fragment-offset', expr: 'offset_k = (k−1) · maksdata / 8', note: 'i 8-byte-enheter' },
    { name: 'Antall adresser i /x', expr: '2^(32 − x)', note: '/24 = 256, /23 = 512, /22 = 1024, /16 = 65 536' },
    { name: 'Posisjonsverdier', expr: '128 64 32 16 8 4 2 1', note: 'Desimal ↔ binær per byte' }
  ],
  examQA: [
    { q: 'Explain briefly what service the IP protocol provides.', a: 'Unreliable multi-hop end-to-end transmission of datagrams.' },
    { q: 'Explain the purpose of Identifier, Flags and Fragmentation offset.', a: 'Identifier determines which fragments belong to the same original datagram; Flags determine when reassembly is complete (flag = 0 marks the last fragment); Fragmentation offset specifies where in the original datagram the fragment data was positioned.' },
    { q: 'Explain the purpose of Time-to-live, Source IP, Destination IP and Data.', a: 'TTL detects routing loops by being decremented for each hop; Source IP specifies the sender; Destination IP specifies the receiver; Data contains the actual data transmitted between sender and receiver.' },
    { q: 'On which interface will a datagram with destination X be forwarded? (justify)', a: 'Konverter X til binær, sammenlign med hver linje, velg longest prefix match; ingen match → otherwise-linjen.' },
    { q: 'Why are IP addresses used instead of link-layer addresses?', a: 'Link-layer addresses are specific to each network card and do not change, so nodes on the same network cannot share a common network part. Every individual link-layer address would have to be in router forwarding tables, causing scalability problems.' },
    { q: 'Explain the difference between the routing function and the forwarding function.', a: 'Forwarding is router-local: moving an incoming packet to the appropriate output link using the forwarding table. Routing is network-wide: computing least-cost paths and thereby the content of forwarding tables.' }
  ]
});
