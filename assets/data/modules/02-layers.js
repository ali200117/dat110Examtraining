DAT110.addModule({
  id: 'layers',
  title: 'Protokollag og innkapsling',
  source: 'Kurose & Ross kap. 1.5–1.6',
  exam: 'Oppgave 1 (hvilke lag har en ruter? hvilke protokoller hører til hvilket lag?) og Oppgave 4/6 (innkapsling, header-felt)',
  goals: [
    'Forklare hvorfor nettverk organiseres i lag, og skille tjeneste fra protokoll',
    'Kunne de fem lagene i TCP/IP-stakken, PDU-navnene og eksempler på protokoller',
    'Vite hvilke lag verter, rutere og svitsjer implementerer',
    'Forklare innkapsling og dekapsling – og telle dem langs en sti',
    'Forstå hvordan header-felt (type, protocol, port) brukes til multipleksing mellom lag'
  ],
  sections: [
    {
      id: 'layers-1',
      title: 'Hvorfor lagdeling?',
      html: `
<p>Et nettverk er ekstremt komplekst: elektriske signaler, feildeteksjon, ruting over hele kloden, pålitelighet, applikasjonslogikk … Lagdeling deler problemet i <b>uavhengige deler</b>. Hvert lag:</p>
<ol>
  <li>leverer en <b>tjeneste</b> (service) til laget over,</li>
  <li>ved å utføre egne handlinger <b>og</b> bruke tjenesten til laget under.</li>
</ol>
<div class="callout example"><span class="ct">Flyreise-analogien (Kurose)</span>
Billett (kjøp ↔ klage) → bagasje (innsjekk ↔ henting) → gate (ombordstigning ↔ avstigning) → rullebane (avgang ↔ landing) → flyruting. Hvert «lag» gjør sin del og stoler på at laget under gjør sin. Du kan bytte ut bagasjesystemet uten å endre billettsystemet.</div>
<h3>Tjeneste vs. protokoll vs. grensesnitt</h3>
<div class="table-wrap"><table>
<tr><th>Begrep</th><th>Betydning</th><th>Eksempel</th></tr>
<tr><td><b>Tjeneste</b> (service)</td><td><em>Hva</em> laget tilbyr laget over</td><td>Transportlaget (TCP): pålitelig byte-strøm mellom prosesser</td></tr>
<tr><td><b>Protokoll</b></td><td><em>Hvordan</em> to like lag (peers) på hver sin maskin snakker sammen – format, rekkefølge, handlinger</td><td>TCP-segmenter med sekvensnummer og ACK</td></tr>
<tr><td><b>Grensesnitt</b> (interface)</td><td>Hvordan laget over får tilgang til tjenesten</td><td>Socket-API</td></tr>
</table></div>
<div class="callout why"><span class="ct">Hvorfor er skillet viktig?</span>
En tjeneste <b>bestemmer ikke</b> hvilken protokoll som må brukes. Samme tjeneste («pålitelig overføring») kan implementeres med Go-Back-N eller Selective Repeat. Derfor kan protokoller byttes ut uten at laget over merker noe. (Canvas-quiz: «A service provided by a layer also mandates the protocol that must be used» → <b>False</b>.)</div>
<div class="compare">
  <div><h4>Fordeler</h4><ul><li>Modularitet – enklere å forstå og vedlikeholde</li><li>Et lag kan byttes ut (WiFi i stedet for Ethernet) uten å endre de andre</li><li>Standardiserte grensesnitt muliggjør utstyr fra ulike produsenter</li></ul></div>
  <div><h4>Ulemper</h4><ul><li>Kan duplisere funksjonalitet (feilhåndtering både i link- og transportlaget)</li><li>Et lag kan trenge info fra et annet lag (f.eks. tidsstempel), som bryter separasjonen</li><li>Litt overhead (en header per lag)</li></ul></div>
</div>
`,
      quiz: [
        { q: 'En tjeneste levert av et lag bestemmer også hvilken protokoll som må brukes for å implementere den.', o: ['Sant', 'Usant'], a: [1], e: 'Tjeneste = hva; protokoll = hvordan. Samme tjeneste kan implementeres av ulike protokoller.' },
        { q: 'Hva er den viktigste fordelen med lagdeling?', o: ['Hvert lag krypterer data', 'Et lag kan endres/byttes ut uavhengig så lenge tjenesten til laget over er den samme', 'Pakker går aldri tapt', 'Færre protokoller trengs'], a: [1], e: 'Modularitet: f.eks. byttes Ethernet med WiFi uten at TCP eller HTTP endres.' },
        { q: 'Hva kalles det når to like lag på to ulike maskiner utveksler meldinger etter faste regler?', o: ['Et grensesnitt', 'En protokoll', 'En tjeneste', 'En socket'], a: [1], e: 'Protokollen er «språket» mellom peer-entiteter på samme lag.' }
      ]
    },
    {
      id: 'layers-2',
      title: 'De fem lagene i TCP/IP-stakken',
      html: `
<div class="table-wrap"><table>
<tr><th>#</th><th>Lag</th><th>Oppgave / tjeneste</th><th>PDU</th><th>Protokoller</th></tr>
<tr><td>5</td><td><b>Applikasjon</b></td><td>Nettverksapplikasjoner og deres protokoller</td><td>Melding</td><td>HTTP, DNS, SMTP, FTP, (MQTT)</td></tr>
<tr><td>4</td><td><b>Transport</b></td><td>Prosess-til-prosess-levering (porter). TCP: pålitelig byte-strøm. UDP: upålitelig datagram</td><td>Segment</td><td>TCP, UDP</td></tr>
<tr><td>3</td><td><b>Nettverk</b></td><td>Upålitelig multi-hop ende-til-ende-overføring av datagrammer mellom verter (ruting/forwarding)</td><td>Datagram</td><td>IP, ICMP, OSPF, BGP</td></tr>
<tr><td>2</td><td><b>Link</b></td><td>Overføring av rammer over <em>én</em> link mellom naboer (oftest upålitelig)</td><td>Ramme (frame)</td><td>Ethernet, WiFi (802.11), PPP, ARP</td></tr>
<tr><td>1</td><td><b>Fysisk</b></td><td>Overføre enkeltbit som signaler på mediet</td><td>Bit</td><td>Kobber, fiber, radio</td></tr>
</table></div>
<div class="callout tip"><span class="ct">Huskeregel (nedenfra)</span><b>F</b>ysisk – <b>L</b>ink – <b>N</b>ettverk – <b>T</b>ransport – <b>A</b>pplikasjon. PDU: bit → ramme → datagram → segment → melding.</div>
<h3>Tjenesten hvert lag leverer – formuleringene eksamen bruker</h3>
<ul>
  <li><b>Linklaget:</b> «Unreliable transmission of frames across <em>one</em> communication link» (mai 2022 1d, jan 2025 1a).</li>
  <li><b>Nettverkslaget:</b> «Unreliable multi-hop (end-to-end) forwarding of datagrams between hosts» (mai 2023 1c, juni 2025 1e).</li>
  <li><b>Transportlaget (TCP):</b> «Reliable bidirectional transmission of byte-streams between hosts/processes».</li>
  <li><b>Transportlaget (UDP):</b> «Unreliable end-to-end transmission of datagrams between hosts».</li>
</ul>
<h3>OSI-modellen</h3>
<p>ISO/OSI har <b>7 lag</b>: i tillegg til de fem har den <b>presentasjon</b> (datarepresentasjon, kryptering, komprimering) og <b>sesjon</b> (synkronisering, sjekkpunkter). I TCP/IP må applikasjonen selv ta seg av dette. (Canvas: «Which is <em>not</em> a layer in TCP/IP?» → <b>Session</b>.)</p>
<h3>Hvem implementerer hvilke lag?</h3>
<div class="figure"><svg viewBox="0 0 660 230" xmlns="http://www.w3.org/2000/svg">
  <g>
    <text x="70" y="18" text-anchor="middle" class="txa">Vert (kilde)</text>
    <rect x="20" y="25" width="100" height="30" class="bx"/><text x="70" y="45" text-anchor="middle" class="txs">Applikasjon</text>
    <rect x="20" y="55" width="100" height="30" class="bx"/><text x="70" y="75" text-anchor="middle" class="txs">Transport</text>
    <rect x="20" y="85" width="100" height="30" class="bx"/><text x="70" y="105" text-anchor="middle" class="txs">Nettverk</text>
    <rect x="20" y="115" width="100" height="30" class="bx"/><text x="70" y="135" text-anchor="middle" class="txs">Link</text>
    <rect x="20" y="145" width="100" height="30" class="bx"/><text x="70" y="165" text-anchor="middle" class="txs">Fysisk</text>
    <text x="230" y="78" text-anchor="middle" class="txa">Svitsj</text>
    <rect x="180" y="115" width="100" height="30" class="bxw"/><text x="230" y="135" text-anchor="middle" class="txs">Link</text>
    <rect x="180" y="145" width="100" height="30" class="bxw"/><text x="230" y="165" text-anchor="middle" class="txs">Fysisk</text>
    <text x="390" y="78" text-anchor="middle" class="txa">Ruter</text>
    <rect x="340" y="85" width="100" height="30" class="bx2"/><text x="390" y="105" text-anchor="middle" class="txs">Nettverk</text>
    <rect x="340" y="115" width="100" height="30" class="bx2"/><text x="390" y="135" text-anchor="middle" class="txs">Link</text>
    <rect x="340" y="145" width="100" height="30" class="bx2"/><text x="390" y="165" text-anchor="middle" class="txs">Fysisk</text>
    <text x="580" y="18" text-anchor="middle" class="txa">Vert (mål)</text>
    <rect x="530" y="25" width="100" height="30" class="bx"/><text x="580" y="45" text-anchor="middle" class="txs">Applikasjon</text>
    <rect x="530" y="55" width="100" height="30" class="bx"/><text x="580" y="75" text-anchor="middle" class="txs">Transport</text>
    <rect x="530" y="85" width="100" height="30" class="bx"/><text x="580" y="105" text-anchor="middle" class="txs">Nettverk</text>
    <rect x="530" y="115" width="100" height="30" class="bx"/><text x="580" y="135" text-anchor="middle" class="txs">Link</text>
    <rect x="530" y="145" width="100" height="30" class="bx"/><text x="580" y="165" text-anchor="middle" class="txs">Fysisk</text>
    <path d="M70,175 L70,200 L230,200 L230,175" class="lna"/><path d="M230,200 L390,200 L390,175" class="lna"/><path d="M390,200 L580,200 L580,175" class="lna"/>
    <text x="330" y="222" text-anchor="middle" class="txmu">Rutere: lag 1–3 · Svitsjer: lag 1–2 · Huber: kun lag 1 · Verter: alle 5</text>
  </g>
</svg></div>
<div class="callout exam"><span class="ct">Spørres nesten hvert år</span>
«What layers of the TCP/IP protocol stack does a router implement?» → <b>Physical, Link, Network</b>. En ruter trenger bare destinasjons-IP (lag 3) for å bestemme neste hopp. Den ser aldri på TCP-porter eller HTTP. Mai 2022 5a–b: en <b>hub</b> opererer på <b>fysisk lag</b>; en <b>svitsj</b> på <b>fysisk og link</b>.</div>
<div class="callout"><span class="ct">Hvor mange instanser av linklaget har en ruter med tre linker? (juni 2025 1a)</span>
<b>Tre</b> – én per nettverksgrensesnitt/link. Hvert grensesnitt har sitt eget nettverkskort (NIC) med egen MAC-adresse og eget linklag, mens ruteren har ett felles nettverkslag.</div>
`,
      quiz: [
        { q: 'Hvilke lag implementerer en ruter?', o: ['Fysisk', 'Link', 'Nettverk', 'Transport', 'Applikasjon'], a: [0, 1, 2], e: 'Rutere implementerer lag 1–3. De trenger ikke transport- eller applikasjonslaget for å videresende.' },
        { q: 'Hvilke protokoller hører til applikasjonslaget?', o: ['UDP', 'IP', 'DNS', 'HTTP', 'ARP'], a: [2, 3], e: 'DNS og HTTP er applikasjonsprotokoller. UDP = transport, IP = nettverk, ARP = link-/nettverksgrensen (brukes innen et LAN).' },
        { q: 'Hvilken tjeneste gir linklaget generelt?', o: ['Multi-hop videresending av rammer mellom verter', 'Pålitelig overføring av rammer over én link', 'Upålitelig overføring av rammer over én link'], a: [2], e: 'Linklaget opererer over én link (ett hopp). Ethernet er upålitelig – rammer med feil forkastes uten retransmisjon.' },
        { q: 'Hvilket av følgende er IKKE et lag i TCP/IP-stakken?', o: ['Fysisk', 'Nettverk', 'Sesjon', 'Transport'], a: [2], e: 'Sesjon (og presentasjon) finnes bare i OSI-modellen.' },
        { q: 'En ruter er koblet til tre linker. Hvor mange instanser av linklaget har den?', o: ['1', '3', '6'], a: [1], e: 'Ett linklag per grensesnitt/link.' },
        { q: 'Hva kalles PDU-en på nettverkslaget?', o: ['Segment', 'Ramme', 'Datagram', 'Melding'], a: [2], e: 'Applikasjon: melding, transport: segment, nettverk: datagram, link: ramme.' }
      ]
    },
    {
      id: 'layers-3',
      title: 'Innkapsling og dekapsling',
      html: `
<p>På vei <b>nedover</b> i stakken hos avsender legger hvert lag på sin egen <b>header</b> (og linklaget ofte en trailer). Dette er <b>innkapsling</b>. Hos mottaker går det <b>oppover</b>, og hvert lag fjerner sin header – <b>dekapsling</b>.</p>
<div class="figure"><svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg">
  <text x="10" y="32" class="txs">Applikasjon</text><rect x="330" y="15" width="150" height="26" class="bx"/><text x="405" y="33" text-anchor="middle" class="txs">M (melding)</text>
  <text x="10" y="72" class="txs">Transport</text><rect x="280" y="55" width="50" height="26" class="bxw"/><text x="305" y="73" text-anchor="middle" class="txs">H_t</text><rect x="330" y="55" width="150" height="26" class="bx"/><text x="405" y="73" text-anchor="middle" class="txs">M</text><text x="500" y="73" class="txmu">segment</text>
  <text x="10" y="112" class="txs">Nettverk</text><rect x="230" y="95" width="50" height="26" class="bx2"/><text x="255" y="113" text-anchor="middle" class="txs">H_n</text><rect x="280" y="95" width="50" height="26" class="bxw"/><text x="305" y="113" text-anchor="middle" class="txs">H_t</text><rect x="330" y="95" width="150" height="26" class="bx"/><text x="405" y="113" text-anchor="middle" class="txs">M</text><text x="500" y="113" class="txmu">datagram</text>
  <text x="10" y="152" class="txs">Link</text><rect x="180" y="135" width="50" height="26" class="bxg"/><text x="205" y="153" text-anchor="middle" class="txs">H_l</text><rect x="230" y="135" width="50" height="26" class="bx2"/><text x="255" y="153" text-anchor="middle" class="txs">H_n</text><rect x="280" y="135" width="50" height="26" class="bxw"/><text x="305" y="153" text-anchor="middle" class="txs">H_t</text><rect x="330" y="135" width="150" height="26" class="bx"/><text x="405" y="153" text-anchor="middle" class="txs">M</text><text x="500" y="153" class="txmu">ramme</text>
  <text x="10" y="188" class="txs">Fysisk</text><text x="330" y="188" text-anchor="middle" class="txm">0110100101110…</text>
</svg><figcaption>Hvert lag legger nyttelasten fra laget over inn i sitt eget «data»-felt og legger til en header.</figcaption></div>
<div class="callout example"><span class="ct">Analogi: brev i konvolutter</span>
Brevet (melding) legges i en konvolutt med navn på avdeling (transport-header: port), som legges i en konvolutt med adresse (nettverks-header: IP), som legges i en postsekk merket for neste postkontor (link-header: MAC). Hvert postkontor åpner bare postsekken, leser adressen, og legger konvolutten i en <em>ny</em> postsekk til neste kontor.</div>
<h3>Hva skjer i en ruter og en svitsj?</h3>
<ul>
  <li><b>Ruter:</b> mottar ramme → dekapsler link-header → leser IP-header → slår opp i videresendingstabellen → kapsler inn i en <b>ny ramme</b> med nye MAC-adresser for neste link. IP-datagrammet (og alt over) er uendret (bortsett fra TTL og header-checksum).</li>
  <li><b>Svitsj:</b> ser bare på link-headeren (MAC). Ingen dekapsling til IP.</li>
</ul>
<h3>Tell innkapslinger (eksamen jan 2024, 6c)</h3>
<p>Datagram fra H0 via R1, R3 til H5 (en svitsj S1 mellom R3 og H5): datagrammet kapsles inn i en ramme <b>3 ganger</b> (i H0, R1, R3) og dekapsles <b>3 ganger</b> (i R1, R3, H5). <b>Ingen</b> inn/utkapsling i S1, fordi svitsjen opererer på linklaget og videresender rammen uendret.</p>
<div class="callout tip"><span class="ct">Generell regel</span>Antall innkapslinger av et IP-datagram i rammer = antall <b>link-hopp på IP-nivå</b> (antall noder på lag 3 som sender det: kilde + rutere). Svitsjer og huber teller ikke.</div>
<h3>Ekte eksempel: Wireshark</h3>
<p>Fra lab-øvingen (HTTP mot www.example.com) ser du lagene direkte i Wireshark – nøyaktig innkapslingsrekkefølgen:</p>
<pre>Frame 4591: 449 bytes on wire
Ethernet II, Src: AzureWaveTec_e3:f2:8f, Dst: Cisco_5b:11:df      ← linklaget (MAC)
Internet Protocol Version 4, Src: 158.37.188.103, Dst: 104.18.27.120  ← nettverk (IP)
Transmission Control Protocol, Src Port: 63493, Dst Port: 80     ← transport (TCP-porter)
Hypertext Transfer Protocol                                       ← applikasjon
    GET / HTTP/1.1\r\n
    Host: www.example.com\r\n
    If-Modified-Since: Mon, 05 Jan 2026 20:20:37 GMT\r\n</pre>
<p class="small muted">Legg merke til: destinasjons-MAC er <b>ruterens</b> (Cisco), ikke webserverens – fordi rammen bare skal til første hopp. Destinasjons-IP er webserverens.</p>
<img src="assets/img/wireshark_exampleTest.png" alt="Wireshark-skjermbilde av HTTP GET med If-Modified-Since" loading="lazy">
`,
      quiz: [
        { q: 'Hva skjer med en pakke på vei NED i protokollstakken hos avsender?', o: ['Hvert lag fjerner en header', 'Hvert lag legger til sin egen header (innkapsling)', 'Bare transportlaget legger til en header', 'Pakken krypteres på hvert lag'], a: [1], e: 'Innkapsling: melding → segment → datagram → ramme.' },
        { q: 'Et IP-datagram går fra H0 → R1 → R3 → S1 (svitsj) → H5. Hvor mange ganger kapsles datagrammet inn i en ramme?', o: ['2', '3', '4', '5'], a: [1], e: 'H0, R1 og R3 kapsler inn. Svitsjen S1 opererer på linklaget og gjør ingen inn/utkapsling av datagrammet.' },
        { q: 'Hvilken destinasjons-MAC-adresse har rammen som en vert sender til en webserver i et annet nett?', o: ['Webserverens MAC', 'MAC-adressen til ruterens grensesnitt i vertens eget nett (første hopp)', 'Broadcast FF:FF:FF:FF:FF:FF', 'DNS-serverens MAC'], a: [1], e: 'Rammen skal bare over én link – til default gateway. IP-adressen er derimot webserverens.' },
        { q: 'Hva endrer en ruter i IP-datagrammet når det videresendes?', o: ['Destinasjons-IP', 'Kilde-IP', 'TTL (og dermed header-checksum)', 'TCP-portene'], a: [2], e: 'TTL dekrementeres med 1 per hopp; checksum må da beregnes på nytt. Adresser og portene er uendret (uten NAT).' }
      ]
    },
    {
      id: 'layers-4',
      title: 'Multipleksing mellom lag: type-, protocol- og port-felt',
      html: `
<p>Når en mottaker dekapsler, hvordan vet hvert lag hvem det skal levere nyttelasten til? Hver header har et felt som peker til <b>laget over</b>:</p>
<div class="table-wrap"><table>
<tr><th>Header</th><th>Felt</th><th>Forteller</th><th>Eksempel</th></tr>
<tr><td>Ethernet-ramme</td><td><b>Type</b></td><td>Hvilken protokoll på nettverkslaget som ligger i datafeltet</td><td>0x0800 = IPv4, 0x0806 = ARP</td></tr>
<tr><td>IPv4-datagram</td><td><b>Upper-layer protocol</b></td><td>Hvilken transportprotokoll som ligger i datafeltet</td><td>6 = TCP, 17 = UDP</td></tr>
<tr><td>TCP/UDP-segment</td><td><b>Destinasjonsport</b></td><td>Hvilken socket/prosess som skal ha dataene</td><td>80 = HTTP, 53 = DNS</td></tr>
</table></div>
<div class="callout exam"><span class="ct">Eksamen jan 2024 1e og mai 2024 1e</span>
«What is the purpose of the <em>type</em> field of an Ethernet frame?» → <b>To specify what upper-layer protocol is encapsulated in the data part of the frame.</b><br>
Mai 2022 4c / jan 2025 4d: «How does a sender host specify whether the datagram carries a UDP or a TCP segment?» → <b>Upper-layer protocol-feltet</b> i IP-headeren.</div>
<div class="callout why"><span class="ct">Hvorfor trengs dette?</span>
Uten disse feltene ville en mottaker ikke visst om bytene i en ramme er et IP-datagram eller en ARP-melding, eller om et datagram inneholder TCP eller UDP. Feltene er «adresselapper» mellom lagene – dette kalles <b>multipleksing</b> (på vei ned) og <b>demultipleksing</b> (på vei opp).</div>
`,
      quiz: [
        { q: 'Hva er formålet med «type»-feltet i en Ethernet-ramme?', o: ['Angi hvilken type kommunikasjonslink som brukes', 'Angi om rammen er data eller bekreftelse', 'Angi hvilken protokoll fra laget over som er innkapslet i datafeltet'], a: [2], e: 'F.eks. 0x0800 = IPv4, 0x0806 = ARP.' },
        { q: 'Hvordan vet mottakeren om et IP-datagram inneholder et TCP- eller UDP-segment?', o: ['Fra portnummeret', 'Fra upper-layer protocol-feltet i IP-headeren', 'Fra lengden på datagrammet', 'Fra Ethernet-typen'], a: [1], e: 'Protocol-feltet: 6 = TCP, 17 = UDP.' }
      ]
    },
    {
      id: 'layers-5',
      title: 'Nettverk under angrep (oversikt)',
      html: `
<p>Internett ble opprinnelig laget for «en gruppe gjensidig tillitsfulle brukere». Derfor mangler mange protokoller innebygd sikkerhet. Kurose 1.6 lister de viktigste truslene (mer i sikkerhetsmodulen):</p>
<ul>
  <li><b>Skadevare</b> (malware): virus (krever brukerhandling), ormer (sprer seg selv), botnett.</li>
  <li><b>Tjenestenekt</b> (DoS/DDoS): sårbarhetsangrep, båndbreddeflom, tilkoblingsflom (SYN-flood). DDoS bruker mange kilder (botnett).</li>
  <li><b>Pakkesniffing</b>: passiv avlytting av trafikk (spesielt lett på WiFi og delte medier). Forsvar: kryptering.</li>
  <li><b>IP-spoofing</b>: å sende pakker med falsk kildeadresse. Forsvar: <b>ende-punkt-autentisering</b> (f.eks. digitale signaturer).</li>
</ul>
`,
      quiz: [
        { q: 'Hva er IP-spoofing?', o: ['Avlytting av pakker på et delt medium', 'Å sende pakker med falsk kildeadresse', 'Å overbelaste en server', 'Å kryptere trafikk'], a: [1], e: 'Spoofing = utgi seg for å være en annen. Motmiddel: autentisering/digitale signaturer.' },
        { q: 'Hva skiller DDoS fra DoS?', o: ['DDoS bruker kryptering', 'DDoS angriper fra mange kilder samtidig (ofte et botnett)', 'DDoS angriper bare DNS', 'Ingen forskjell'], a: [1], e: 'Distributed = mange angripende maskiner.' }
      ]
    }
  ],
  summary: [
    'Lagdeling: hvert lag gir en tjeneste til laget over og bruker tjenesten under. Tjeneste ≠ protokoll.',
    'TCP/IP: Fysisk – Link – Nettverk – Transport – Applikasjon (OSI har i tillegg presentasjon og sesjon).',
    'PDU: bit, ramme, datagram, segment, melding.',
    'Verter: alle 5 lag. Rutere: 1–3. Svitsjer: 1–2. Huber: 1.',
    'Linklaget: (u)pålitelig overføring av rammer over én link. Nettverkslaget: upålitelig multi-hop ende-til-ende overføring av datagrammer.',
    'Innkapsling: hvert lag legger på header ned i stakken; dekapsling fjerner opp i stakken.',
    'En ruter dekapsler til IP, slår opp, og kapsler inn i ny ramme. En svitsj rører ikke IP.',
    'Ethernet type → nettverksprotokoll; IP protocol → TCP/UDP; port → prosess.'
  ],
  formulas: [
    { name: 'Antall innkapslinger i rammer', expr: '= antall noder på lag 3 som sender datagrammet (kilde + rutere)', note: 'Svitsjer/huber teller ikke' }
  ],
  examQA: [
    { q: 'What are the five levels that comprise the TCP/IP protocol stack?', a: 'Physical, Link, Network, Transport, Application.' },
    { q: 'Which TCP/IP layers are implemented by routers, and which by hosts?', a: 'Routers implement layers 1–3 (Physical, Link, Network) whereas hosts implement all five layers.' },
    { q: 'At what layer does a hub / a switch operate?', a: 'Hub: physical layer. Switch: physical and link layer.' },
    { q: 'How many times will the datagram be encapsulated into a frame on the route, and decapsulated?', a: 'Én gang for hver node på lag 3 som sender (kilde og hver ruter), og dekapslet i hver ruter og i mottakeren. Svitsjer gjør ingen inn/utkapsling fordi de opererer på linklaget.' }
  ]
});
