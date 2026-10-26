DAT110.addModule({
  id: 'projects',
  title: 'Obligatoriske prosjekter 1–3 (Oppgave 2)',
  source: 'Prosjektbeskrivelser og startkode for prosjekt 1 (RPC), 2 (pub-sub) og 3 (ChordDHT)',
  exam: 'Oppgave 2 (10 %) HVERT ÅR handler om et prosjekt: P1 i jan 2025, P2 i jan 2024, P3 i mai 2023, mai 2024 og juni 2025',
  goals: [
    'Forklare de tre lagene i prosjekt 1 og hvordan de henger sammen',
    'Forklare 128-byte-segmentet og hvorfor første byte trengs',
    'Forklare hvordan RPC-serveren finner metoden som skal kalles',
    'Gjenkjenne komponentene i brokeren i prosjekt 2',
    'Forklare navngiving, adresserom, oppslag, remote-write og mutex i prosjekt 3'
  ],
  sections: [
    {
      id: 'projects-1',
      title: 'Prosjekt 1: arkitektur og meldingslaget',
      html: `
<p>Målet: et lite IoT-system der en <b>kontroller</b> leser temperatur fra en <b>sensor</b> og skriver den på en <b>display</b> – med RPC, bygget lag for lag oppå TCP-sockets.</p>
<div class="figure"><svg viewBox="0 0 600 230" xmlns="http://www.w3.org/2000/svg">
  <rect x="40" y="20" width="520" height="40" rx="8" class="bxg"/><text x="300" y="45" text-anchor="middle" class="tx">IoT-applikasjon: Controller · SensorDevice · DisplayDevice</text>
  <rect x="40" y="70" width="520" height="40" rx="8" class="bx2"/><text x="300" y="95" text-anchor="middle" class="tx">RPC-lag: RPCClient · RPCServer · stubber · RPCUtils (marshalling)</text>
  <rect x="40" y="120" width="520" height="40" rx="8" class="bxw"/><text x="300" y="145" text-anchor="middle" class="tx">Meldingslag: Message · MessageUtils · MessageConnection · MessagingClient/Server</text>
  <rect x="40" y="170" width="520" height="40" rx="8" class="bx"/><text x="300" y="195" text-anchor="middle" class="tx">TCP (Java Socket / ServerSocket)</text>
</svg></div>
<div class="callout exam"><span class="ct">Modellsvar jan 2025 2a</span>«The three layers were: IoT application layer, RPC layer, and Messaging layer. The messaging layer was implemented on top of TCP and was used to implement the RPC layer for remote procedure calls. The RPC layer was then used by the IoT application layer to implement the sensor-display-controller IoT system.»</div>
<h3>Segmentformatet: 128 byte</h3>
<div class="figure"><svg viewBox="0 0 600 70" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="15" width="70" height="40" class="bx2"/><text x="55" y="32" text-anchor="middle" class="txs">lengde</text><text x="55" y="47" text-anchor="middle" class="txs">(1 byte)</text>
  <rect x="90" y="15" width="300" height="40" class="bxg"/><text x="240" y="40" text-anchor="middle" class="txs">payload (0–127 byte)</text>
  <rect x="390" y="15" width="190" height="40" class="bx"/><text x="485" y="40" text-anchor="middle" class="txs">padding (ignoreres)</text>
  <text x="300" y="68" text-anchor="middle" class="txmu">alltid nøyaktig 128 byte på TCP-forbindelsen</text>
</svg></div>
<div class="callout exam"><span class="ct">Jan 2025 2b – hvorfor første byte?</span>De første 8 bitene angir <b>hvor mange av de påfølgende 127 bytene som er payload</b>. Det trengs fordi meldingene har fast lengde 128 byte (plass til 127 byte data), mens ikke alle meldinger har 127 byte payload – mottakeren må vite hvor dataene slutter og paddingen begynner.</div>
<div class="callout why"><span class="ct">Hvorfor fast størrelse i det hele tatt?</span>TCP er en <b>byte-strøm uten meldingsgrenser</b>. Skriver avsenderen to meldinger, kan mottakeren få alt i ett <code>read()</code>, eller halve meldingen. Med faste 128 byte og <code>readFully(128)</code> vet mottakeren alltid nøyaktig hvor én melding slutter. (Valgfri utfordring: lengdeprefiks uten padding.)</div>
<h4>Innkapsling og dekapsling (MessageUtils)</h4>
<pre><code><span class="kw">public static byte</span>[] encapsulate(<span class="ty">Message</span> message) {
    <span class="kw">byte</span>[] data = message.getData();
    <span class="kw">byte</span>[] segment = <span class="kw">new byte</span>[<span class="nu">128</span>];
    segment[<span class="nu">0</span>] = (<span class="kw">byte</span>) data.length;                      <span class="cm">// header: antall payload-byte</span>
    <span class="ty">System</span>.arraycopy(data, <span class="nu">0</span>, segment, <span class="nu">1</span>, data.length);   <span class="cm">// resten er padding (0)</span>
    <span class="kw">return</span> segment;
}
<span class="kw">public static</span> <span class="ty">Message</span> decapsulate(<span class="kw">byte</span>[] segment) {
    <span class="kw">int</span> length = segment[<span class="nu">0</span>];
    <span class="kw">return new</span> <span class="ty">Message</span>(<span class="ty">Arrays</span>.copyOfRange(segment, <span class="nu">1</span>, <span class="nu">1</span> + length));
}</code></pre>
<p><code>Message</code>-konstruktøren sjekker at data ikke er <code>null</code> og ikke lengre enn 127 byte. <code>MessageConnection</code> pakker en <code>Socket</code> med <code>DataOutputStream</code>/<code>DataInputStream</code>: <code>send</code> skriver segmentet, <code>receive</code> gjør <code>readFully</code> på 128 byte. <code>MessagingClient.connect()</code> lager <code>new Socket(server, port)</code>; <code>MessagingServer.accept()</code> kaller <code>welcomeSocket.accept()</code>.</p>
<div class="callout"><span class="ct">Jan 2025 2c</span>En socket (kommunikasjonsendepunkt) på transportlaget identifiseres med <b>IP-adresse og portnummer</b>.</div>
`,
      quiz: [
        { q: 'Hva er formålet med første byte i 128-byte-meldingene i prosjekt 1?', o: ['Inneholder RPC-metodenummeret', 'Angir hvor mange av de påfølgende 127 bytene som er payload', 'Inneholder kilde-IP', 'Angir om det er request eller reply'], a: [1], e: 'Resten er padding. (RPC-id er første byte i payloaden – ett lag opp.)' },
        { q: 'Hvorfor bruker meldingslaget faste 128-byte-segmenter over TCP?', o: ['Fordi TCP krever det', 'Fordi TCP er en byte-strøm uten meldingsgrenser – fast størrelse gjør det lett å vite hvor en melding slutter', 'For å kryptere data', 'For å spare båndbredde'], a: [1], e: 'readFully(128) gir alltid nøyaktig én melding.' },
        { q: 'Hvilke tre lag ble implementert i prosjekt 1 (nedenfra)?', o: ['TCP, IP, RPC', 'Meldingslag, RPC-lag, IoT-applikasjonslag', 'RPC, meldingslag, IoT', 'Fysisk, link, nettverk'], a: [1], e: 'TCP er det underliggende – ikke et av prosjektets lag.' }
      ]
    },
    {
      id: 'projects-2',
      title: 'Prosjekt 1: RPC-laget og IoT-systemet',
      html: `
<h3>Request og reply</h3>
<div class="table-wrap"><table class="mono">
<tr><th>Melding</th><th>byte 0</th><th>byte 1 …</th></tr>
<tr><td>RPC request</td><td>rpcid (hvilken metode)</td><td>marshallert parameter (evt. tom)</td></tr>
<tr><td>RPC reply</td><td>rpcid (utført metode)</td><td>marshallert returverdi (evt. tom)</td></tr>
</table></div>
<p>Disse RPC-meldingene er <b>payload</b> i meldingslagets 128-byte-segmenter (innkapsling i to nivåer!).</p>
<h3>Hvordan finner serveren metoden? (jan 2025 2d)</h3>
<div class="callout exam"><span class="ct">Modellsvar</span>Første byte i RPC-requesten (som bæres som payload i meldingslaget) angir <b>nummeret til RPC-metoden</b>. Nummeret brukes til å <b>slå opp metoden i RPC-tabellen</b> (en <code>HashMap&lt;Byte, RPCRemoteImpl&gt;</code>) på serveren, og så kalles <code>invoke</code>.</div>
<pre><code><span class="kw">public void</span> run() {                                         <span class="cm">// RPCServer</span>
    connection = msgserver.accept();
    <span class="kw">boolean</span> stop = <span class="kw">false</span>;
    <span class="kw">while</span> (!stop) {
        <span class="kw">byte</span>[] rpcmsg = connection.receive().getData();
        <span class="kw">byte</span> rpcid = rpcmsg[<span class="nu">0</span>];                                <span class="cm">// hvilken metode?</span>
        <span class="kw">byte</span>[] param = <span class="ty">RPCUtils</span>.decapsulate(rpcmsg);
        <span class="kw">byte</span>[] ret = services.get(rpcid).invoke(param);       <span class="cm">// slå opp og kall</span>
        connection.send(<span class="kw">new</span> <span class="ty">Message</span>(<span class="ty">RPCUtils</span>.encapsulate(rpcid, ret)));
        <span class="kw">if</span> (rpcid == <span class="ty">RPCCommon</span>.RPIDSTOP) stop = <span class="kw">true</span>;          <span class="cm">// id 0 er reservert for stop()</span>
    }
}</code></pre>
<h3>Klient- og serverside av en metode</h3>
<div class="compare">
<div><h4>Klient-stub (DisplayStub)</h4><pre><code><span class="kw">public void</span> write(<span class="ty">String</span> message) {
  <span class="kw">byte</span>[] req = <span class="ty">RPCUtils</span>.marshallString(message);
  <span class="kw">byte</span>[] resp = rpcclient.call((<span class="kw">byte</span>) WRITE_RPCID, req);
  <span class="ty">RPCUtils</span>.unmarshallVoid(resp);
}</code></pre></div>
<div><h4>Server-impl (DisplayImpl)</h4><pre><code><span class="kw">public byte</span>[] invoke(<span class="kw">byte</span>[] param) {
  <span class="ty">String</span> msg = <span class="ty">RPCUtils</span>.unmarshallString(param);
  write(msg);               <span class="cm">// den ekte metoden</span>
  <span class="kw">return</span> <span class="ty">RPCUtils</span>.marshallVoid();
}</code></pre></div>
</div>
<p><code>RPCLocalStub</code> (abstrakt) gir stubbene tilgang til <code>rpcclient.call</code>. <code>RPCRemoteImpl</code> (abstrakt) registrerer seg i serverens tabell i konstruktøren og har <code>invoke</code>, som gjør unmarshalling → kall → marshalling.</p>
<h3>Ett kall, byte for byte: <code>display.write("17")</code></h3>
<ol class="steps">
  <li>DisplayStub marshaller "17" → <code>[0x31, 0x37]</code>.</li>
  <li>RPCClient.call legger på rpcid 2 → RPC-melding <code>[02, 31, 37]</code>.</li>
  <li>Meldingslaget lager segment: <code>[03, 02, 31, 37, 00, 00, …]</code> (128 byte, første byte = lengde 3).</li>
  <li>TCP sender. DisplayDevice sin MessageConnection leser 128 byte, dekapsler → <code>[02, 31, 37]</code>.</li>
  <li>RPCServer: rpcid = 2 → DisplayImpl.invoke(<code>[31, 37]</code>) → skriver «DISPLAY:17».</li>
  <li>Svar: <code>[02]</code> (void) i et segment <code>[01, 02, 00, …]</code> tilbake. Stubben unmarshaller void.</li>
</ol>
<p>Sensoren tilsvarende: <code>read()</code> har rpcid 1, void-parameter, og returnerer en int marshallert som 4 byte (<code>ByteBuffer</code>). Display lytter på port 8080, sensor på 8081.</p>
`,
      quiz: [
        { q: 'Hvordan identifiserer RPC-serveren i prosjekt 1 hvilken metode som skal kalles?', o: ['Fra portnummeret', 'Første byte i RPC-requesten er metodens ID, som slås opp i en HashMap', 'Fra metodenavnet som sendes som streng', 'Fra TCP-headeren'], a: [1], e: 'HashMap<Byte, RPCRemoteImpl>.' },
        { q: 'Hvilken RPC-id er reservert for stop()?', o: ['0', '1', '2', '127'], a: [0], e: 'RPCCommon.RPIDSTOP = 0.' },
        { q: 'Hva blir hele 128-byte-segmentet sin første byte når display.write("17") sendes (rpcid 2)?', o: ['2', '3', '17', '128'], a: [1], e: 'RPC-meldingen er [rpcid, \'1\', \'7\'] = 3 byte, så lengdebyten = 3.' },
        { q: 'Hva gjør invoke() i en RPCRemoteImpl-klasse?', o: ['Sender meldingen over TCP', 'Unmarshaller parameteren, kaller den ekte metoden og marshaller returverdien', 'Registrerer klienten', 'Starter serveren'], a: [1], e: 'Server-stub-logikken.' }
      ]
    },
    {
      id: 'projects-3',
      title: 'Prosjekt 2: publish-subscribe (kortversjon)',
      html: `
<p>Detaljene står i <a href="laer.html#mom">MOM-modulen</a>. Det du må kunne til Oppgave 2:</p>
<ul>
  <li><b>Komponenter i brokeren</b>: MessagingServer (tar imot meldinger), Broker (løkke som tar imot klienter), Dispatcher (prosesserer meldinger: onConnect, onCreateTopic, onSubscribe, onPublish …), Storage (tilkoblede klienter + topic → abonnenter), ClientSession (forbindelsen til én klient).</li>
  <li><b>Meldingslaget</b> gir en pålitelig utveksling av (korte) meldinger oppå TCP.</li>
  <li><b>Kontakte server</b>: IP-adresse + port.</li>
  <li><b>Finne mottakere</b> av en publish: <code>subscriptions.get(topic)</code> gir settet av brukere; hver bruker → ClientSession → send.</li>
  <li><b>Stopable</b>: tråd som kjører <code>doProcess()</code> i løkke til <code>doStop()</code>.</li>
  <li><b>Parallell broker</b>: ny dispatcher-tråd per klient i <code>waitConnect</code>.</li>
  <li><b>Bufring</b> (Task E): lagre meldinger for frakoblede abonnenter og sende ved reconnect.</li>
</ul>
`,
      quiz: [
        { q: 'Hvilken datastruktur i Storage brukes for å finne abonnentene på et emne?', o: ['ArrayList<String>', 'ConcurrentHashMap<String, Set<String>> (topic → brukere)', 'Queue<Message>', 'HashMap<Integer, Socket>'], a: [1], e: 'Topic som nøkkel, sett av brukere som verdi.' }
      ]
    },
    {
      id: 'projects-4',
      title: 'Prosjekt 3: ChordDHT med replikering, remote-write og mutex',
      html: `
<div class="callout exam"><span class="ct">Hovedmål (mai 2023 2a / mai 2024 2a)</span>Å tilby <b>distribuert og samarbeidende fildeling</b> (cooperative mirroring) der flere innholdsleverandører samarbeider om å lagre og tjene hverandres filer – med skalerbarhet, ytelse, høy tilgjengelighet og feiltoleranse.</div>
<h3>Navngiving og adresserom</h3>
<ul>
  <li><b>MD5</b> gir 128 bit → adresserom <b>2<sup>128</sup></b> (mai 2024 2b, juni 2025 2b).</li>
  <li><b>Hvem får adresser?</b> Både <b>prosessene/nodene</b> og <b>filene</b> (juni 2025 2c, mai 2024 2c): <code>nodeID = Hash.hashOf(nodename)</code>.</li>
  <li><b>Replikaer</b>: en fil replikeres N = 4 ganger ved å legge indeks 0…N−1 på filnavnet («test0», «test1» …), og hver replika får ID = MD5-hash av navnet.</li>
  <li><b>Kommunikasjon</b> mellom nodene: <b>RPC</b> via <b>Java RMI</b> (juni 2025 2a).</li>
</ul>
<pre><code><span class="kw">public static</span> <span class="ty">BigInteger</span> hashOf(<span class="ty">String</span> entity) {
    <span class="ty">MessageDigest</span> md = <span class="ty">MessageDigest</span>.getInstance(<span class="st">"MD5"</span>);
    <span class="kw">byte</span>[] digest = md.digest(entity.getBytes());          <span class="cm">// 16 byte = 128 bit</span>
    <span class="kw">return new</span> <span class="ty">BigInteger</span>(toHex(digest), <span class="nu">16</span>);
}</code></pre>
<h3>Oppslag: findSuccessor og hjelpemetodene (mai 2023 2c)</h3>
<ul>
  <li><b>checkInterval</b>: sjekker om en nøkkel ligger mellom forgjengeren og noden, <b>pred(node) &lt; key ≤ node</b> (sirkulært).</li>
  <li><b>findHighestPredecessor</b>: finner noden i fingertabellen som er nærmest (høyeste forgjenger til) nøkkelen, <b>node &lt; finger &lt; key</b>, ved å søke <b>fra bunnen</b> av fingertabellen.</li>
</ul>
<pre><code><span class="kw">public</span> <span class="ty">NodeInterface</span> findSuccessor(<span class="ty">BigInteger</span> key) {
    <span class="ty">NodeInterface</span> succ = node.getSuccessor();
    <span class="kw">if</span> (<span class="ty">Util</span>.checkInterval(key, node.getNodeID().add(<span class="ty">BigInteger</span>.ONE), succ.getNodeID()))
        <span class="kw">return</span> succ;                                       <span class="cm">// node &lt; key ≤ succ</span>
    <span class="ty">NodeInterface</span> highest = findHighestPredecessor(key);
    <span class="kw">return</span> highest.findSuccessor(key);                      <span class="cm">// rekursivt (RMI-kall)</span>
}</code></pre>
<h3>Konsistens og samtidighet</h3>
<ul>
  <li><b>Remote-write (primary-based)</b> → sekvensiell konsistens (mai 2023 2d). En replika merkes tilfeldig som primær ved distribusjon.</li>
  <li><b>findPrimaryOfItem()</b> (i FileManager): finner hvilken av nodene som har filen som er <b>primær</b>; primæren brukes til å <b>koordinere skrivinger</b> til de andre replikaene (mai 2023 2e).</li>
  <li><b>Distribuert mutex</b> med <b>Lamport-klokke</b>: tidsstempler gir total orden; lavest tidsstempel får gå inn i CS (mai 2023 2f).</li>
  <li>For å unngå samtidig modifikasjon brukes altså <b>remote-write-protokollen og distribuert mutual exclusion</b> (mai 2024 2e, juni 2025 2d).</li>
</ul>
<h3>Oppgavene i prosjektet</h3>
<ol>
  <li>Hash og adresserom (MD5, 2<sup>128</sup>).</li>
  <li>Replikere filer (filnavn + indeks).</li>
  <li>checkInterval, fixFingerTable, findSuccessor.</li>
  <li>distributeReplicastoPeers – hver replika til <code>findSuccessor(replicaID)</code>.</li>
  <li>requestActiveNodesForFile – finn alle noder som har en kopi.</li>
  <li>Remote-write: tilfeldig primær + findPrimaryOfItem.</li>
  <li>Distribuert mutual exclusion (MutualExclusion.java).</li>
</ol>
`,
      quiz: [
        { q: 'Hva er adresserommet i prosjekt 3?', o: ['2^32', '2^64', '2^128 (MD5)', '2^160 (SHA-1)'], a: [2], e: 'MD5 gir 128 bit.' },
        { q: 'Hvordan lages identifikatorene til replikaene av en fil?', o: ['Tilfeldige tall', 'Filnavn + indeks (0…N−1), hashet med MD5', 'Nodens IP-adresse', 'Filstørrelsen'], a: [1], e: 'f.eks. hash("file30"), hash("file31") …' },
        { q: 'Hvilke to hjelpemetoder trenger findSuccessor()?', o: ['hashOf og bitSize', 'checkInterval og findHighestPredecessor', 'notify og leaveRing', 'acquireLock og releaseLocks'], a: [1], e: 'Mai 2023 2c.' },
        { q: 'Hvilken kommunikasjonsprotokoll bruker nodene i prosjekt 3?', o: ['UDP-sockets', 'RPC via Java RMI', 'HTTP/REST', 'MQTT'], a: [1], e: 'Juni 2025 2a.' },
        { q: 'Hva brukes primæren som findPrimaryOfItem() returnerer til?', o: ['Til å lese filen raskere', 'Til å koordinere skrivinger til de andre replikaene', 'Til å beregne fingertabellen', 'Til å velge leder i ringen'], a: [1], e: 'Remote-write: alle oppdateringer går via primæren.' },
        { q: 'Hvilke mekanismer brukes i prosjekt 3 for å unngå at flere prosesser endrer samme fil samtidig?', o: ['Quorum-basert protokoll', 'Remote-write-protokoll', 'Distribuert mutual exclusion', 'Token ring'], a: [1, 2], e: 'Mai 2024 2e / juni 2025 2d.' }
      ]
    }
  ],
  summary: [
    'P1: IoT-applikasjon → RPC-lag → meldingslag → TCP.',
    'P1 segment: 128 byte; byte 0 = antall payload-byte (0–127), resten padding. Trengs fordi meldingene har fast lengde og TCP er en byte-strøm.',
    'P1 RPC: request [rpcid | param], reply [rpcid | retur]; serveren slår opp rpcid i HashMap<Byte, RPCRemoteImpl> og kaller invoke. rpcid 0 = stop.',
    'P1: socket = IP + port. Stubber (RPCLocalStub) marshaller; Impl (RPCRemoteImpl) unmarshaller/kaller/marshaller.',
    'P2: Broker, Dispatcher, Storage (topic → abonnenter), ClientSession, Stopable, JSON-meldinger; parallell broker = tråd per klient.',
    'P3: cooperative mirroring; MD5 → 2^128; noder og filer får ID; replikaer = filnavn+indeks; Java RMI.',
    'P3: findSuccessor med checkInterval (pred < key ≤ node) og findHighestPredecessor (søk fra bunnen).',
    'P3: remote-write (tilfeldig primær, findPrimaryOfItem) + distribuert mutex med Lamport-klokke.'
  ],
  formulas: [],
  examQA: [
    { q: 'List the three protocol layers implemented in project 1 and explain how they are related.', a: 'IoT application layer, RPC layer and Messaging layer. The messaging layer was implemented on top of TCP and used to implement the RPC layer; the RPC layer was used by the IoT application layer to implement the sensor-display-controller system.' },
    { q: 'Explain the purpose of the first 8 bits in the 128-byte messages and why they are needed.', a: 'They specify the number of payload bytes in the subsequent 127 bytes. Needed because messages have a fixed length of 128 bytes (room for up to 127 data bytes) but not all messages have 127 bytes of payload.' },
    { q: 'When the RPC server receives a request, how does it identify the method to invoke?', a: 'The first byte of the RPC request (carried as payload in the messaging layer) specifies the RPC method number, which is used to look up the method in the RPC table on the server.' },
    { q: 'What is the main goal of ChordDHT? How are processes and files named?', a: 'Distributed cooperative file sharing (multiple providers store and serve each other’s data). Address space 2^128 via MD5; files replicated N times by appending index 0..N−1 to the filename; each replica and each process gets ID = MD5 hash of its name.' },
    { q: 'What two helper methods does findSuccessor need?', a: 'checkInterval (is key in pred(node) < key ≤ node) and findHighestPredecessor (closest finger with node < finger < key, searched from the bottom of the finger table).' }
  ]
});
