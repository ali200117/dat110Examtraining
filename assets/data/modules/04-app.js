DAT110.addModule({
  id: 'app',
  title: 'Applikasjonslaget: HTTP, DNS og sockets',
  source: 'Kurose & Ross kap. 2.1, 2.2, 2.4, 2.7 (+ Wireshark-lab)',
  exam: 'Oppgave 1 (DNS, HTTP, socket API), Oppgave 4 (HTTP request-format: mai 2023, juni 2025)',
  goals: [
    'Skille klient-server og P2P, og forklare hva en socket er',
    'Vite hvilke transporttjenester applikasjoner trenger, og hva TCP og UDP tilbyr',
    'Forklare HTTP: request/response-format, metoder, statuskoder, persistent vs. ikke-persistent, cookies, conditional GET',
    'Forklare DNS: hierarki, iterativ vs. rekursiv oppslag, caching, ressursposter',
    'Skrive enkel socket-kode i Java for TCP og UDP'
  ],
  sections: [
    {
      id: 'app-1',
      title: 'Prinsipper for nettverksapplikasjoner',
      html: `
<h3>To arkitekturer</h3>
<div class="compare">
  <div><h4>Klient-server</h4><ul><li><b>Server</b>: alltid på, fast IP-adresse, ofte i datasentre.</li><li><b>Klienter</b>: kommuniserer med serveren, ikke direkte med hverandre; kan ha dynamisk IP.</li><li>Eksempler: web (HTTP), e-post, DNS-oppslag.</li></ul></div>
  <div><h4>Peer-to-peer (P2P)</h4><ul><li>Ingen alltid-på-server; vilkårlige endesystemer (peers) kommuniserer direkte.</li><li><b>Selvskalerende</b>: nye peers gir både ny etterspørsel og ny kapasitet.</li><li>Vanskelig å styre (peers kommer og går, skifter IP).</li><li>Eksempler: BitTorrent, Chord DHT (prosjekt 3).</li></ul></div>
</div>
<h3>Prosesser, sockets og adressering</h3>
<p>Det er <b>prosesser</b> (kjørende programmer) som kommuniserer – ikke maskiner. En prosess sender og mottar meldinger gjennom en <b>socket</b> – en «dør» mellom applikasjonen og transportlaget. Socketen er grensesnittet (API-et) operativsystemet tilbyr for å bruke TCP og UDP.</p>
<div class="callout"><span class="ct">Hvordan identifiseres en prosess?</span>
<b>IP-adresse</b> (hvilken vert) + <b>portnummer</b> (hvilken prosess/socket på verten). Eks.: webserver = 80/443, DNS = 53. Dette er svaret på «How are communication endpoints identified at the transport layer?» → <b>IP addresses and port numbers</b> (spurt i 4 eksamener!).</div>
<h3>Hva trenger applikasjonene fra transportlaget?</h3>
<ul>
  <li><b>Pålitelig dataoverføring</b> (filoverføring, web) – eller tapstoleranse (lyd/video).</li>
  <li><b>Gjennomstrømning</b> (multimedia trenger minimum rate; «elastiske» apper tar det de får).</li>
  <li><b>Timing</b> (spill, telefoni: lav forsinkelse).</li>
  <li><b>Sikkerhet</b> (kryptering, integritet).</li>
</ul>
<div class="compare">
  <div><h4>TCP-tjenesten</h4><ul><li>Forbindelsesorientert (handshake)</li><li>Pålitelig, i rekkefølge</li><li>Flytkontroll og metningskontroll</li><li>Ingen garanti for timing, minimum gjennomstrømning eller sikkerhet (TLS legges oppå)</li></ul></div>
  <div><h4>UDP-tjenesten</h4><ul><li>Forbindelsesløs, ingen handshake</li><li>Upålitelig: tap, duplisering, omrokkering mulig</li><li>Ingen flyt- eller metningskontroll</li><li>Minimal overhead – rask</li></ul></div>
</div>
<p>En <b>applikasjonsprotokoll</b> definerer: typer meldinger (request/response), syntaks (felter), semantikk (betydning), og regler for når og hvordan meldinger sendes.</p>
`,
      quiz: [
        { q: 'Hvordan identifiseres kommunikasjonsendepunkter på transportlaget i TCP/IP?', o: ['Med IP-adresser og link-lag-adresser', 'Bare med IP-adresser', 'Med IP-adresser og portnumre', 'Med IP-adresser og prosess-ID-er'], a: [2], e: 'Socket = (IP-adresse, port). Prosess-ID er lokal for OS-et og brukes ikke i nettet.' },
        { q: 'Hva er hovedformålet med socket-API-et som OS-et tilbyr?', o: ['Gi applikasjonsutviklere tilgang til transporttjenestene TCP og UDP', 'Gi tilgang til DNS fra applikasjoner', 'Implementere delt minne mellom prosesser på samme maskin'], a: [0], e: 'Socket-API-et er grensesnittet mellom applikasjonen og transportlaget.' },
        { q: 'Alle prosessene i en distribuert applikasjon må være skrevet i samme programmeringsspråk.', o: ['Sant', 'Usant'], a: [1], e: 'Så lenge de følger samme protokoll (meldingsformat), kan de være skrevet i hvilket som helst språk.' },
        { q: 'Hva er typisk for P2P-arkitektur?', o: ['En alltid-på server med fast IP', 'Selvskalerende: nye peers gir også ny kapasitet', 'Klientene kommuniserer kun via serveren'], a: [1], e: 'Hver peer er både klient og server.' }
      ]
    },
    {
      id: 'app-2',
      title: 'HTTP – webens protokoll',
      html: `
<p>HTTP (HyperText Transfer Protocol) er en <b>klient-server</b>, <b>request-response</b>-protokoll på applikasjonslaget. Klienten (nettleseren) sender en HTTP-request; serveren svarer med en HTTP-response. HTTP bruker <b>TCP</b> (port 80, HTTPS 443) og er <b>tilstandsløs</b> (stateless): serveren husker ingenting om tidligere forespørsler.</p>
<div class="callout exam"><span class="ct">Mai 2023 4a–c (modellsvar)</span>
<b>Tjenesten:</b> HTTP lar en klient <em>opprette, lese, oppdatere og slette</em> ressurser (f.eks. filer) på en HTTP-server. <b>Method</b> angir hvilken operasjon som skal utføres; <b>URL</b> angir hvilken ressurs.<br>
<b>Utveksling:</b> klienten sender en HTTP request; serveren prosesserer den og sender tilbake en HTTP response.<br>
<b>TCPs rolle:</b> TCP gir den underliggende forbindelsen som klient og server bruker til å sende og motta request og response (pålitelig, i rekkefølge).</div>
<h3>Request-formatet (Oppgave 4!)</h3>
<div class="figure"><svg viewBox="0 0 620 230" xmlns="http://www.w3.org/2000/svg">
  <text x="10" y="32" class="txs">Request line</text>
  <rect x="120" y="15" width="80" height="26" class="bx2"/><text x="160" y="33" text-anchor="middle" class="txs">method</text>
  <rect x="200" y="15" width="24" height="26" class="bx"/><text x="212" y="33" text-anchor="middle" class="txs">sp</text>
  <rect x="224" y="15" width="110" height="26" class="bx2"/><text x="279" y="33" text-anchor="middle" class="txs">URL</text>
  <rect x="334" y="15" width="24" height="26" class="bx"/><text x="346" y="33" text-anchor="middle" class="txs">sp</text>
  <rect x="358" y="15" width="90" height="26" class="bx2"/><text x="403" y="33" text-anchor="middle" class="txs">version</text>
  <rect x="448" y="15" width="26" height="26" class="bx"/><text x="461" y="33" text-anchor="middle" class="txs">cr</text>
  <rect x="474" y="15" width="26" height="26" class="bx"/><text x="487" y="33" text-anchor="middle" class="txs">lf</text>
  <text x="10" y="82" class="txs">Header lines</text>
  <rect x="120" y="55" width="160" height="26" class="bxw"/><text x="200" y="73" text-anchor="middle" class="txs">header field name:</text>
  <rect x="280" y="55" width="24" height="26" class="bx"/><text x="292" y="73" text-anchor="middle" class="txs">sp</text>
  <rect x="304" y="55" width="90" height="26" class="bxw"/><text x="349" y="73" text-anchor="middle" class="txs">value</text>
  <rect x="394" y="55" width="26" height="26" class="bx"/><text x="407" y="73" text-anchor="middle" class="txs">cr</text><rect x="420" y="55" width="26" height="26" class="bx"/><text x="433" y="73" text-anchor="middle" class="txs">lf</text>
  <text x="200" y="100" text-anchor="middle" class="txmu">⋮ (flere header-linjer)</text>
  <text x="10" y="132" class="txs">Blank line</text>
  <rect x="120" y="115" width="26" height="26" class="bx"/><text x="133" y="133" text-anchor="middle" class="txs">cr</text><rect x="146" y="115" width="26" height="26" class="bx"/><text x="159" y="133" text-anchor="middle" class="txs">lf</text>
  <text x="10" y="180" class="txs">Entity body</text>
  <rect x="120" y="155" width="380" height="55" class="bxg"/><text x="310" y="187" text-anchor="middle" class="txs">data (brukes av POST/PUT – tom for GET)</text>
</svg></div>
<ul>
  <li><b>Method</b>: operasjonen serveren skal utføre (GET, POST, PUT, DELETE, HEAD).</li>
  <li><b>URL</b>: adressen/stien til ressursen.</li>
  <li><b>Version</b>: HTTP-versjon, f.eks. HTTP/1.1.</li>
  <li><b>Header lines</b>: metadata, f.eks. <code>Host:</code>, <code>User-Agent:</code>, <code>Content-Type:</code>, <code>Connection:</code>.</li>
  <li><b>Entity body</b>: data som sendes (f.eks. JSON ved PUT/POST).</li>
</ul>
<pre>PUT /accessdevice/code HTTP/1.1
Host: api.example.com
Content-Type: application/json
Content-Length: 15

{"code":[1,2]}</pre>
<div class="callout exam"><span class="ct">Juni 2025 4c–d og mai 2023 4d</span>
Formatet på entity body angis med header-linjen <b>Content-Type</b>, f.eks. <code>Content-Type: application/json</code>.<br>
Oppdatere en ressurs → metoden <b>PUT</b>, og dataene ligger i <b>entity body</b>.</div>
<h3>Metoder og REST (CRUD)</h3>
<div class="table-wrap"><table>
<tr><th>Metode</th><th>Bruk</th><th>Idempotent?</th></tr>
<tr><td>GET</td><td>Lese (Read) en ressurs</td><td>Ja (og «safe» – ingen endring)</td></tr>
<tr><td>POST</td><td>Opprette (Create) / sende data</td><td>Nei – to POST kan gi to ressurser</td></tr>
<tr><td>PUT</td><td>Oppdatere/erstatte (Update)</td><td>Ja – samme sluttilstand</td></tr>
<tr><td>DELETE</td><td>Slette (Delete)</td><td>Ja</td></tr>
<tr><td>HEAD</td><td>Som GET, men bare headere (ingen body)</td><td>Ja</td></tr>
</table></div>
<div class="callout why"><span class="ct">Hvorfor bryr vi oss om idempotens?</span>
Hvis et svar går tapt og klienten sender forespørselen på nytt, er det trygt for idempotente operasjoner (PUT «sett temperatur = 22» to ganger gir samme resultat). For ikke-idempotente (POST «overfør 100 kr») må serveren oppdage duplikater. Dette kommer igjen i RPC-feilhåndtering!</div>
<h3>Statuskoder</h3>
<p><code>200 OK</code> · <code>301 Moved Permanently</code> · <code>304 Not Modified</code> · <code>400 Bad Request</code> · <code>404 Not Found</code> · <code>505 HTTP Version Not Supported</code>. Gruppene: 2xx suksess, 3xx omdirigering, 4xx klientfeil, 5xx serverfeil.</p>
<h3>Persistent vs. ikke-persistent HTTP</h3>
<ul>
  <li><b>Ikke-persistent</b>: ny TCP-forbindelse for hvert objekt. Responstid per objekt ≈ <b>2·RTT + transmisjonstid</b> (1 RTT for TCP-oppsett, 1 RTT for request/response).</li>
  <li><b>Persistent</b> (HTTP/1.1 standard): forbindelsen holdes åpen for flere objekter → sparer RTT-er. (<code>Connection: keep-alive</code> i Wireshark.)</li>
</ul>
<h3>Cookies, webcache og conditional GET</h3>
<ul>
  <li><b>Cookies</b>: lar en tilstandsløs protokoll huske brukere (handlekurv, innlogging). Fire deler: Set-cookie i respons, cookie i request, cookie-fil hos klient, database hos server.</li>
  <li><b>Webcache (proxy)</b>: svarer på forespørsler på vegne av opprinnelsesserveren → raskere svar og mindre trafikk på aksesslinken.</li>
  <li><b>Conditional GET</b>: klienten sender <code>If-Modified-Since: &lt;dato&gt;</code>. Er ressursen uendret, svarer serveren <code>304 Not Modified</code> uten body. Dette så du i Wireshark-laben (GET → 304, så GET → 200 OK).</li>
</ul>
<img src="assets/img/wireshark_example.png" alt="Wireshark: HTTP/1.1 200 OK-respons med headere" loading="lazy">
`,
      quiz: [
        { q: 'Hvilken HTTP-metode brukes for å oppdatere en eksisterende ressurs, og hvor ligger dataene?', o: ['GET – i URL-en', 'PUT – i entity body', 'HEAD – i header-linjene', 'DELETE – i entity body'], a: [1], e: 'PUT oppdaterer/erstatter ressursen; dataene ligger i entity body.' },
        { q: 'Hvordan angir klienten formatet på dataene i entity body?', o: ['Med version-feltet', 'Med header-linjen Content-Type', 'Med method-feltet', 'Det kan ikke angis'], a: [1], e: 'F.eks. Content-Type: application/json.' },
        { q: 'Hvilke metoder støtter HTTP?', o: ['POST', 'DELETE', 'GET', 'PUT'], a: [0, 1, 2, 3], e: 'Alle fire (pluss HEAD m.fl.).' },
        { q: 'Hvilken rolle har TCP for HTTP?', o: ['TCP oversetter domenenavn til IP-adresser', 'TCP gir den underliggende pålitelige forbindelsen som request og response sendes over', 'TCP krypterer HTTP-meldingene', 'HTTP bruker UDP, ikke TCP'], a: [1], e: 'HTTP ligger oppå TCP.' },
        { q: 'Klienten sender If-Modified-Since og ressursen er uendret. Hva svarer serveren?', o: ['200 OK med hele objektet', '304 Not Modified uten body', '404 Not Found', '301 Moved Permanently'], a: [1], e: 'Conditional GET sparer båndbredde når cachen er oppdatert.' },
        { q: 'Hvorfor kalles HTTP «stateless»?', o: ['Den kan ikke håndtere flere klienter', 'Serveren lagrer ingen informasjon om tidligere forespørsler fra klienten', 'Den bruker UDP', 'Den støtter ikke cookies'], a: [1], e: 'Hver request behandles uavhengig. Cookies er en løsning på toppen.' },
        { q: 'Hvilken metode er IKKE idempotent?', o: ['GET', 'PUT', 'DELETE', 'POST'], a: [3], e: 'To like POST-er kan opprette to ressurser.' }
      ]
    },
    {
      id: 'app-3',
      title: 'DNS – Internetts telefonkatalog',
      html: `
<p>Mennesker bruker navn (<code>www.hvl.no</code>); rutere bruker IP-adresser. <b>DNS (Domain Name System)</b> er en <b>distribuert, hierarkisk database</b> og en applikasjonsprotokoll for å <b>oversette vertsnavn til IP-adresser</b>.</p>
<div class="callout exam"><span class="ct">Spurt i mai 2023 1e og jan 2025 1e</span>«What is the main purpose of DNS?» → <b>Mapping of hostnames to IP addresses</b>. (IP→MAC er ARP!)</div>
<p>Andre DNS-tjenester: <b>aliasing</b> av verter og e-postservere (kanoniske navn), og <b>lastfordeling</b> (ett navn → flere IP-adresser i rotasjon).</p>
<h3>Hvorfor ikke én sentral DNS-server?</h3>
<p>Ett feilpunkt · enorm trafikk · lang avstand for mange brukere · umulig vedlikehold. <b>Den skalerer ikke.</b></p>
<h3>Hierarkiet</h3>
<div class="figure"><svg viewBox="0 0 600 190" xmlns="http://www.w3.org/2000/svg">
  <rect x="250" y="10" width="100" height="32" rx="8" class="bx2"/><text x="300" y="31" text-anchor="middle" class="txs">Rot-servere</text>
  <rect x="70" y="72" width="90" height="30" rx="8" class="bxw"/><text x="115" y="92" text-anchor="middle" class="txs">.com TLD</text>
  <rect x="255" y="72" width="90" height="30" rx="8" class="bxw"/><text x="300" y="92" text-anchor="middle" class="txs">.no TLD</text>
  <rect x="440" y="72" width="90" height="30" rx="8" class="bxw"/><text x="485" y="92" text-anchor="middle" class="txs">.org TLD</text>
  <rect x="20" y="138" width="110" height="30" rx="8" class="bxg"/><text x="75" y="158" text-anchor="middle" class="txs">google.com</text>
  <rect x="140" y="138" width="110" height="30" rx="8" class="bxg"/><text x="195" y="158" text-anchor="middle" class="txs">amazon.com</text>
  <rect x="255" y="138" width="90" height="30" rx="8" class="bxg"/><text x="300" y="158" text-anchor="middle" class="txs">hvl.no</text>
  <rect x="440" y="138" width="90" height="30" rx="8" class="bxg"/><text x="485" y="158" text-anchor="middle" class="txs">wikipedia.org</text>
  <line x1="300" y1="42" x2="115" y2="72" class="ln"/><line x1="300" y1="42" x2="300" y2="72" class="ln"/><line x1="300" y1="42" x2="485" y2="72" class="ln"/>
  <line x1="115" y1="102" x2="75" y2="138" class="ln"/><line x1="115" y1="102" x2="195" y2="138" class="ln"/><line x1="300" y1="102" x2="300" y2="138" class="ln"/><line x1="485" y1="102" x2="485" y2="138" class="ln"/>
  <text x="560" y="31" class="txmu" text-anchor="end">nivå 1</text><text x="590" y="92" class="txmu" text-anchor="end">nivå 2</text><text x="590" y="182" class="txmu" text-anchor="end">autoritative</text>
</svg></div>
<ul>
  <li><b>Rot-servere</b>: vet hvor TLD-serverne er (13 logiske, replikert hundrevis av steder via anycast).</li>
  <li><b>TLD-servere</b> (.com, .no, …): vet hvilke <b>autoritative</b> servere som har ansvar for et domene.</li>
  <li><b>Autoritative servere</b>: organisasjonens egne – lagrer de faktiske navn→IP-postene.</li>
  <li><b>Lokal DNS-server</b> (resolver, hos ISP/campus): første stopp for klienten, gjør jobben og cacher svar.</li>
</ul>
<h3>Iterativ vs. rekursiv oppslag</h3>
<div class="compare">
  <div><h4>Iterativ</h4><p>Den lokale DNS-serveren spør rot → får henvisning («spør .no-TLD») → spør TLD → får henvisning → spør autoritativ → får svaret. <b>Hver server svarer bare med en henvisning.</b></p><p><b>+</b> Lite belastning på rot/TLD. <b>−</b> Mange (lange) rundturer fra resolveren – kommunikasjonsforsinkelse/avstand kan være et problem.</p></div>
  <div><h4>Rekursiv</h4><p>Hver server spør selv videre på vegne av den som spurte og returnerer det endelige svaret.</p><p><b>+</b> Caching blir mer effektivt (mellomliggende servere lærer svar), kommunikasjonskostnad/avstand kan reduseres. <b>−</b> Høy belastning på servere høyt i hierarkiet.</p></div>
</div>
<div class="callout exam"><span class="ct">Mai 2023 9a – figuren med «Long-distance communication»</span>
Utfordringer: <b>størrelses-skalerbarhet</b> (rekursiv belaster høynivåservere) og <b>geografisk skalerbarhet</b> (iterativ: klientens resolver kommuniserer over lange avstander). Løsning: <b>replikering</b> av servere og <b>caching</b> i lokal DNS.</div>
<h3>Caching og ressursposter</h3>
<p>Når en DNS-server lærer en kobling, <b>cacher</b> den svaret i TTL sekunder. Derfor besøkes rot-serverne sjelden. DNS lagrer <b>ressursposter</b> (RR) på formen (navn, verdi, type, ttl):</p>
<ul>
  <li><b>A</b>: vertsnavn → IPv4-adresse</li>
  <li><b>NS</b>: domene → navn på autoritativ navneserver</li>
  <li><b>CNAME</b>: alias → kanonisk navn</li>
  <li><b>MX</b>: domene → e-postserver</li>
</ul>
<p>DNS bruker vanligvis <b>UDP, port 53</b> (se jan 2024 4c: én request + én response; TCP-oppsett ville gitt unødvendig overhead).</p>
`,
      quiz: [
        { q: 'Hva er hovedformålet med DNS?', o: ['Avbilde IP-adresser til link-lag-adresser', 'Avbilde URI-er til filer', 'Avbilde vertsnavn til IP-adresser'], a: [2], e: 'IP → MAC er ARP sin jobb.' },
        { q: 'I iterativ DNS-oppslag – hvem kontakter TLD-serveren?', o: ['Nettleseren', 'Den lokale DNS-serveren', 'Rot-serveren', 'Den autoritative serveren'], a: [1], e: 'Rot-serveren gir bare en henvisning; den lokale resolveren spør videre selv.' },
        { q: 'Hvilke utsagn om iterativ og rekursiv DNS stemmer?', o: ['Ved rekursiv oppslag kan servere høyt i hierarkiet få for mye last', 'Ved iterativ oppslag kan kommunikasjonsforsinkelse (lange avstander) være et problem', 'Ved rekursiv oppslag er kommunikasjonsavstand mindre et problem', 'Ved iterativ oppslag er kommunikasjonsavstand aldri et problem'], a: [0, 1, 2], e: 'Rekursiv: last på høynivåservere, men kortere/færre lange hopp og bedre caching. Iterativ: lav last på rot, men lange rundturer fra resolveren.' },
        { q: 'Hvilken ressurspost-type mapper et domene til navnet på dets autoritative navneserver?', o: ['A', 'NS', 'CNAME', 'MX'], a: [1], e: 'NS = name server.' },
        { q: 'Hvorfor bruker DNS normalt UDP?', o: ['UDP er pålitelig', 'Ett request + ett response – TCP-oppsett ville gitt stor overhead per oppslag', 'TCP støtter ikke port 53', 'UDP har metningskontroll'], a: [1], e: 'Jan 2024 4c.' },
        { q: 'DNS-systemet er hierarkisk organisert. Hvilke utsagn stemmer?', o: ['Rot-serveren kontaktes for å starte oppslaget (hvis ikke noe er cachet)', 'Den autoritative navneserveren lagrer og leverer den faktiske IP-adressen for vertsnavnet', 'Rot-serveren lagrer postene til alle autoritative navneservere'], a: [0, 1], e: 'Rot kjenner TLD-serverne, ikke alle autoritative servere.' }
      ]
    },
    {
      id: 'app-4',
      title: 'Socket-programmering i Java (TCP og UDP)',
      html: `
<p>Prosjekt 1 bygger på TCP-sockets. Det er to ulike typer socket på servere med TCP:</p>
<ul>
  <li><b>Velkomst-socket</b> (<code>ServerSocket</code>): lytter på en kjent port og venter på nye klienter.</li>
  <li><b>Forbindelses-socket</b> (<code>Socket</code> returnert fra <code>accept()</code>): én per klient – brukes til selve dataoverføringen.</li>
</ul>
<h4>TCP-server</h4>
<pre><code><span class="ty">ServerSocket</span> welcome = <span class="kw">new</span> <span class="ty">ServerSocket</span>(<span class="nu">8080</span>);      <span class="cm">// lytt på port 8080</span>
<span class="kw">while</span> (<span class="kw">true</span>) {
    <span class="ty">Socket</span> conn = welcome.accept();               <span class="cm">// blokkerer til en klient kobler seg på</span>
    <span class="ty">DataInputStream</span>  in  = <span class="kw">new</span> <span class="ty">DataInputStream</span>(conn.getInputStream());
    <span class="ty">DataOutputStream</span> out = <span class="kw">new</span> <span class="ty">DataOutputStream</span>(conn.getOutputStream());
    <span class="ty">String</span> line = in.readUTF();
    out.writeUTF(line.toUpperCase());
    conn.close();
}</code></pre>
<h4>TCP-klient</h4>
<pre><code><span class="ty">Socket</span> s = <span class="kw">new</span> <span class="ty">Socket</span>(<span class="st">"localhost"</span>, <span class="nu">8080</span>);  <span class="cm">// TCP-handshake skjer her</span>
<span class="ty">DataOutputStream</span> out = <span class="kw">new</span> <span class="ty">DataOutputStream</span>(s.getOutputStream());
<span class="ty">DataInputStream</span>  in  = <span class="kw">new</span> <span class="ty">DataInputStream</span>(s.getInputStream());
out.writeUTF(<span class="st">"hei"</span>);
<span class="ty">System</span>.out.println(in.readUTF());                 <span class="cm">// HEI</span>
s.close();</code></pre>
<h4>UDP</h4>
<pre><code><span class="ty">DatagramSocket</span> sock = <span class="kw">new</span> <span class="ty">DatagramSocket</span>();     <span class="cm">// ingen forbindelse</span>
<span class="kw">byte</span>[] data = <span class="st">"hei"</span>.getBytes();
<span class="ty">DatagramPacket</span> p = <span class="kw">new</span> <span class="ty">DatagramPacket</span>(data, data.length, <span class="ty">InetAddress</span>.getByName(<span class="st">"localhost"</span>), <span class="nu">9876</span>);
sock.send(p);                                     <span class="cm">// hver pakke må ha destinasjon (IP + port)</span></code></pre>
<div class="compare">
  <div><h4>TCP-socket</h4><p>Identifiseres av <b>4-tuppel</b>: (kilde-IP, kildeport, dest-IP, destport). To klienter mot samme serverport får <em>hver sin</em> socket på serveren.</p></div>
  <div><h4>UDP-socket</h4><p>Identifiseres av <b>2-tuppel</b>: (dest-IP, destport). Segmenter fra ulike avsendere til samme port havner i <em>samme</em> socket.</p></div>
</div>
<div class="callout why"><span class="ct">Hvorfor trenger TCP to typer socket?</span>
Serveren må kunne ta imot nye klienter mens den snakker med de gamle. Velkomst-socketen tar bare imot «banking på døra»; hver godtatt klient får sin egen forbindelses-socket slik at bytestrømmene ikke blandes. Det er også dette som gjør det naturlig å gi hver forbindelse sin egen tråd (flertrådet server).</div>
`,
      quiz: [
        { q: 'Hvordan identifiseres en TCP-socket/forbindelse?', o: ['Med (kildeport, kilde-IP, destport, dest-IP)', 'Med (kildeport, destport)', 'Med (dest-IP, destport)'], a: [0], e: 'TCP = 4-tuppel. UDP = 2-tuppel (dest-IP, destport).' },
        { q: 'Hva returnerer ServerSocket.accept() i Java?', o: ['En ny Socket for kommunikasjon med den klienten som koblet seg til', 'En DatagramPacket', 'Portnummeret til klienten', 'Ingenting – den sender bare SYN'], a: [0], e: 'accept() blokkerer til en klient kobler seg til, og returnerer en dedikert forbindelses-socket.' },
        { q: 'Det er mulig for to prosesser på ulike verter å sende UDP-segmenter til samme port på en tredje vert.', o: ['Sant', 'Usant'], a: [0], e: 'Begge havner i samme UDP-socket (identifisert av dest-IP + destport).' },
        { q: 'Hva trenger en messaging-klient for å kontakte en messaging-server (prosjekt 1/2)?', o: ['Serverens MAC-adresse', 'IP-adressen til verten serveren kjører på + porten serveren lytter på', 'Bare vertsnavnet', 'Serverens prosess-ID'], a: [1], e: 'Jan 2024 2c: IP-adresse + port.' }
      ]
    }
  ],
  summary: [
    'Klient-server (alltid-på server) vs P2P (selvskalerende).',
    'Prosesser kommuniserer via sockets; endepunkt = IP-adresse + portnummer.',
    'TCP: forbindelsesorientert, pålitelig, flyt- og metningskontroll. UDP: forbindelsesløs, upålitelig, lav overhead.',
    'HTTP: stateless request/response over TCP. Request = method sp URL sp version + headere + blank linje + entity body.',
    'GET (les), POST (opprett), PUT (oppdater – data i entity body), DELETE. Content-Type angir body-format.',
    'Ikke-persistent HTTP: 2 RTT + transmisjon per objekt. Persistent: gjenbruker TCP-forbindelsen.',
    'Conditional GET: If-Modified-Since → 304 Not Modified.',
    'DNS: hierarkisk, distribuert database (rot → TLD → autoritativ; lokal resolver). Vertsnavn → IP. UDP port 53.',
    'Iterativ: henvisninger, lav last på rot. Rekursiv: last på høye nivåer, bedre caching. Skalerer via replikering + caching.',
    'TCP-socket = 4-tuppel; UDP-socket = (dest-IP, destport). ServerSocket.accept() gir ny Socket per klient.'
  ],
  formulas: [
    { name: 'Ikke-persistent HTTP, ett objekt', expr: 'T = 2·RTT + L/R', note: '1 RTT TCP-oppsett + 1 RTT request/response + overføring' },
    { name: 'Ikke-persistent, base-HTML + n objekter (seriell)', expr: 'T = (n+1) · (2·RTT + L/R)', note: 'Persistent med pipelining: ≈ 2·RTT + n·RTT/flere samtidig' }
  ],
  examQA: [
    { q: 'Explain briefly what service HTTP provides and the function of the fields method and URL.', a: 'HTTP allows an HTTP client to create, read, update and delete resources (e.g., files) on an HTTP server. The method field specifies which operation to perform on a resource while the URL specifies the resource.' },
    { q: 'Which HTTP method is used to update a resource, and what part of the request contains the data?', a: 'PUT; the data is in the entity body.' },
    { q: 'How can a client specify the format of the entity body?', a: 'Using the header line Content-Type, e.g. Content-Type: application/json.' },
    { q: 'Give an example of an application-layer protocol that relies on UDP. Why UDP and not TCP?', a: 'DNS. It is a request-response protocol mapping hostnames to IP addresses; using TCP would add large overhead due to connection establishment for each request-response.' }
  ]
});
