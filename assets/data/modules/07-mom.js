DAT110.addModule({
  id: 'mom',
  title: 'Meldingsorientert kommunikasjon og publish-subscribe',
  source: 'van Steen & Tanenbaum kap. 4.3–4.3.3 (+ prosjekt 2)',
  exam: 'Oppgave 1 (brokere, pub-sub), Oppgave 2 (prosjekt 2 – jan 2024), Oppgave 7 (sync vs async, RPC vs MOM)',
  goals: [
    'Skille persistent/transient og synkron/asynkron kommunikasjon',
    'Kjenne socket-primitivene og mønstrene request-reply, publish-subscribe og pipeline',
    'Forklare meldingskøsystemer og hvorfor de gir løs kobling i tid',
    'Forklare hva en meldingsbroker gjør',
    'Beskrive arkitekturen i prosjekt 2 (Broker, Dispatcher, Storage, ClientSession, Stopable)'
  ],
  sections: [
    {
      id: 'mom-1',
      title: 'Typer kommunikasjon: persistent/transient og synkron/asynkron',
      html: `
<div class="compare">
  <div><h4>Persistent vs. transient</h4>
  <ul><li><b>Persistent</b>: meldingen <b>lagres</b> av middleware så lenge det trengs for å levere den. Mottakeren trenger ikke kjøre når meldingen sendes (e-post, meldingskøer).</li>
  <li><b>Transient</b>: meldingen lagres bare mens avsender og mottaker kjører. Er mottakeren ikke der, kastes den (TCP/UDP-sockets, RPC).</li></ul></div>
  <div><h4>Synkron vs. asynkron</h4>
  <ul><li><b>Synkron</b>: avsenderen <b>blokkeres</b> til forespørselen er kjent akseptert – enten ved levering til middleware, ved levering til mottaker, eller etter at mottakeren har prosessert (som RPC).</li>
  <li><b>Asynkron</b>: avsenderen <b>fortsetter umiddelbart</b> etter å ha levert meldingen for sending.</li></ul></div>
</div>
<div class="callout exam"><span class="ct">Modellsvar jan 2025 7b</span>«In synchronous communication, the sender is blocked until its request is known to be accepted. In asynchronous communication, the sender continues immediately (not blocked) after it has submitted its message for transmission.»</div>
<div class="table-wrap"><table>
<tr><th></th><th>Synkron</th><th>Asynkron</th></tr>
<tr><td><b>Transient</b></td><td>RPC, klassisk klient-server</td><td>UDP-datagram «fire and forget»</td></tr>
<tr><td><b>Persistent</b></td><td>Avsender venter til meldingen er lagret i køen</td><td>E-post, meldingskø (MOM)</td></tr>
</table></div>
<div class="callout why"><span class="ct">Hvorfor trenger vi noe annet enn RPC?</span>
RPC antar at mottakeren <b>kjører når kallet skjer</b>, og at klienten kan <b>vente</b>. I mange systemer (IoT-sensorer som sover, systemer i ulike organisasjoner) holder ikke det. Da trengs <b>meldingsorientert middleware</b> som lagrer og leverer meldinger senere – løs kobling i tid.</div>
`,
      quiz: [
        { q: 'Meldingsorientert middleware gjør det mulig for avsender og mottaker å være løst koblet i tid.', o: ['Sant', 'Usant'], a: [0], e: 'Meldingen lagres i køen til mottakeren henter den.' },
        { q: 'Hva kjennetegner synkron kommunikasjon?', o: ['Avsenderen fortsetter umiddelbart', 'Avsenderen blokkeres til forespørselen er kjent akseptert', 'Meldingen lagres alltid på disk', 'Mottakeren trenger ikke kjøre'], a: [1], e: 'Blokkering til aksept (levering/prosessering).' },
        { q: 'E-post er et eksempel på …', o: ['transient synkron', 'persistent asynkron', 'transient asynkron', 'persistent synkron'], a: [1], e: 'Mailservere lagrer meldingen (persistent), og avsender fortsetter med en gang (asynkron).' }
      ]
    },
    {
      id: 'mom-2',
      title: 'Socket-basert meldingsutveksling og mønstre',
      html: `
<h3>Berkeley socket-primitivene</h3>
<div class="table-wrap"><table>
<tr><th>Primitiv</th><th>Betydning</th><th>Hvem</th></tr>
<tr><td>socket</td><td>Opprett nytt kommunikasjonsendepunkt</td><td>begge</td></tr>
<tr><td>bind</td><td>Knytt lokal adresse (port) til socketen</td><td>server</td></tr>
<tr><td>listen</td><td>Si fra at man tar imot forbindelser</td><td>server</td></tr>
<tr><td>accept</td><td>Blokker til en forbindelsesforespørsel kommer</td><td>server</td></tr>
<tr><td>connect</td><td>Forsøk å opprette forbindelse</td><td>klient</td></tr>
<tr><td>send / receive</td><td>Send / motta data over forbindelsen</td><td>begge</td></tr>
<tr><td>close</td><td>Frigjør forbindelsen</td><td>begge</td></tr>
</table></div>
<h3>Mønstre (ZeroMQ-stil)</h3>
<ul>
  <li><b>Request-reply</b>: klient sender forespørsel, server svarer (klassisk klient-server).</li>
  <li><b>Publish-subscribe</b>: en prosess <b>publiserer</b> meldinger uten å bry seg om hvem som henter dem; <b>abonnenter</b> får meldingene de har meldt interesse for (emne/topic).</li>
  <li><b>Pipeline</b>: en prosess <b>dytter</b> ut resultater; den første ledige prosessen i neste ledd <b>trekker</b> dem inn (arbeidsfordeling).</li>
</ul>
<div class="callout exam"><span class="ct">Canvas-quiz</span>«A process that pushes out its messages and does not care who pulls them, but assumes others want to pull them in» → <b>Publish-subscribe pattern</b>.</div>
`,
      quiz: [
        { q: 'Hvilket mønster beskriver en prosess som dytter ut meldinger uten å bry seg om hvem som henter dem?', o: ['Publish-subscribe', 'Request-reply', 'Pipelining', 'Topic-based routing'], a: [0], e: 'Pub-sub: utgiveren kjenner ikke abonnentene.' },
        { q: 'Hvilken socket-primitiv blokkerer en server til en klient ber om forbindelse?', o: ['bind', 'listen', 'accept', 'connect'], a: [2], e: 'accept() blokkerer og returnerer en ny forbindelses-socket.' }
      ]
    },
    {
      id: 'mom-3',
      title: 'Meldingskøsystemer og brokere',
      html: `
<p>I et <b>meldingskøsystem</b> (Message-Oriented Middleware, MOM) legger applikasjoner meldinger i <b>køer</b>. Middleware sørger for at de etter hvert leveres – men gir ingen garanti for <em>når</em>, eller at mottakeren leser dem. Avsender og mottaker trenger <b>ikke</b> kjøre samtidig.</p>
<div class="table-wrap"><table>
<tr><th>Operasjon</th><th>Betydning</th></tr>
<tr><td>PUT</td><td>Legg en melding i en kø</td></tr>
<tr><td>GET</td><td>Blokker til køen ikke er tom, og ta ut første melding</td></tr>
<tr><td>POLL</td><td>Sjekk køen; ta ut første melding hvis den finnes – aldri blokker</td></tr>
<tr><td>NOTIFY</td><td>Installer en handler som kalles når en melding legges i køen</td></tr>
</table></div>
<p>Fire kombinasjoner er mulige: begge kjører · bare avsender kjører · bare mottaker kjører · ingen kjører (meldingen ligger trygt i køen).</p>
<h3>Meldingsbroker</h3>
<p>Når mange heterogene applikasjoner skal integreres, er det upraktisk at alle forstår hverandres format. En <b>meldingsbroker</b> er en applikasjonsnivå-gateway som:</p>
<ul>
  <li><b>Transformerer</b> meldinger til formatet mottakeren forstår (håndterer <b>heterogenitet</b>).</li>
  <li><b>Ruter</b> meldinger – f.eks. til alle som abonnerer på et emne (publish-subscribe).</li>
  <li>Bruker en <b>regel-database</b> for transformasjon og ruting.</li>
</ul>
<div class="figure"><svg viewBox="0 0 600 170" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="arM" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="ah"/></marker></defs>
  <rect x="20" y="30" width="110" height="34" rx="8" class="bx"/><text x="75" y="52" text-anchor="middle" class="txs">Publisher (sensor)</text>
  <rect x="20" y="100" width="110" height="34" rx="8" class="bx"/><text x="75" y="122" text-anchor="middle" class="txs">Publisher (app)</text>
  <rect x="230" y="45" width="140" height="74" rx="10" class="bx2"/><text x="300" y="72" text-anchor="middle" class="txa">Broker</text><text x="300" y="90" text-anchor="middle" class="txs">topic → abonnenter</text><text x="300" y="106" text-anchor="middle" class="txs">(+ transformasjon)</text>
  <rect x="470" y="20" width="110" height="30" rx="8" class="bxg"/><text x="525" y="40" text-anchor="middle" class="txs">Subscriber 1</text>
  <rect x="470" y="68" width="110" height="30" rx="8" class="bxg"/><text x="525" y="88" text-anchor="middle" class="txs">Subscriber 2</text>
  <rect x="470" y="116" width="110" height="30" rx="8" class="bxg"/><text x="525" y="136" text-anchor="middle" class="txs">Subscriber 3</text>
  <line x1="130" y1="47" x2="230" y2="70" class="ln" marker-end="url(#arM)"/><line x1="130" y1="117" x2="230" y2="96" class="ln" marker-end="url(#arM)"/>
  <line x1="370" y1="70" x2="470" y2="35" class="lna" marker-end="url(#arM)"/><line x1="370" y1="82" x2="470" y2="83" class="lna" marker-end="url(#arM)"/><line x1="370" y1="94" x2="470" y2="131" class="lna" marker-end="url(#arM)"/>
  <text x="180" y="40" class="txs">publish(temp, 21)</text><text x="380" y="160" class="txmu">publiserte meldinger på emnet</text>
</svg></div>
<div class="callout exam"><span class="ct">Canvas-quiz: «Message brokers can provide the following»</span>
✔ Håndtere applikasjoners heterogenitet i et køsystem · ✔ Transformere innkommende meldinger til målformat · ✔ Rute meldinger til abonnenter av et emne · ✘ «Bare synkron kommunikasjon» (feil – brokere gir nettopp asynkron, løs kobling).</div>
<div class="callout why"><span class="ct">Hvorfor publish-subscribe for IoT?</span>
<b>Romlig avkobling</b>: utgiver og abonnent kjenner ikke hverandres adresser – bare brokeren og emnet. <b>Tidsavkobling</b> (med bufring): de trenger ikke være pålogget samtidig. Nye abonnenter kan legges til uten å endre sensoren. Dette er ideen bak MQTT og prosjekt 2.</div>
`,
      quiz: [
        { q: 'Hva kan en meldingsbroker tilby?', o: ['Håndtere heterogenitet mellom applikasjoner', 'Transformere meldinger til formatet mottakeren forstår', 'Bare tillate synkron kommunikasjon mellom produsent og konsument', 'Rute meldinger til konsumenter som abonnerer på et emne'], a: [0, 1, 3], e: 'Brokere gir asynkron, løst koblet kommunikasjon.' },
        { q: 'Hvilken køoperasjon sjekker køen uten å blokkere?', o: ['PUT', 'GET', 'POLL', 'NOTIFY'], a: [2], e: 'GET blokkerer, POLL gjør ikke.' },
        { q: 'I publish-subscribe – hva vet en utgiver (publisher) om abonnentene?', o: ['IP-adressene deres', 'Ingenting – den kjenner bare emnet og brokeren', 'Hvor mange de er og hvem', 'Portnumrene deres'], a: [1], e: 'Romlig avkobling.' }
      ]
    },
    {
      id: 'mom-4',
      title: 'Prosjekt 2: publish-subscribe-middleware',
      html: `
<p>Prosjekt 2 implementerer en publish-subscribe meldingsorientert middleware (PB-MOM) <b>oppå meldingslaget fra prosjekt 1</b> (som igjen ligger på TCP).</p>
<div class="figure"><svg viewBox="0 0 620 230" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="arM2" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="ah"/></marker></defs>
  <rect x="10" y="40" width="120" height="40" rx="8" class="bx"/><text x="70" y="57" text-anchor="middle" class="txs">Client</text><text x="70" y="72" text-anchor="middle" class="txmu">(sensor/display)</text>
  <rect x="10" y="140" width="120" height="40" rx="8" class="bx"/><text x="70" y="157" text-anchor="middle" class="txs">Client</text><text x="70" y="172" text-anchor="middle" class="txmu">(ChApp)</text>
  <rect x="180" y="20" width="420" height="200" rx="14" class="bx2"/><text x="390" y="40" text-anchor="middle" class="txa">Broker-server</text>
  <rect x="200" y="60" width="140" height="44" rx="8" class="bxw"/><text x="270" y="80" text-anchor="middle" class="txs">Broker (Stopable)</text><text x="270" y="95" text-anchor="middle" class="txmu">accept-løkke</text>
  <rect x="200" y="140" width="140" height="44" rx="8" class="bxw"/><text x="270" y="160" text-anchor="middle" class="txs">MessagingServer</text><text x="270" y="175" text-anchor="middle" class="txmu">(fra prosjekt 1)</text>
  <rect x="380" y="60" width="200" height="44" rx="8" class="bxg"/><text x="480" y="80" text-anchor="middle" class="txs">Dispatcher (Stopable)</text><text x="480" y="95" text-anchor="middle" class="txmu">onConnect, onPublish, …</text>
  <rect x="380" y="140" width="200" height="60" rx="8" class="bx"/><text x="480" y="160" text-anchor="middle" class="txs">Storage</text><text x="480" y="176" text-anchor="middle" class="txmu">clients: user → ClientSession</text><text x="480" y="191" text-anchor="middle" class="txmu">subscriptions: topic → Set&lt;user&gt;</text>
  <line x1="130" y1="60" x2="200" y2="80" class="ln" marker-end="url(#arM2)"/><line x1="130" y1="160" x2="200" y2="162" class="ln" marker-end="url(#arM2)"/>
  <line x1="340" y1="82" x2="380" y2="82" class="ln" marker-end="url(#arM2)"/><line x1="270" y1="140" x2="270" y2="104" class="lnd"/>
  <line x1="480" y1="104" x2="480" y2="140" class="ln" marker-end="url(#arM2)"/>
</svg></div>
<div class="table-wrap"><table>
<tr><th>Komponent</th><th>Ansvar</th></tr>
<tr><td><b>MessagingServer</b> (meldingslaget)</td><td>Den underliggende meldingstjenesten som tar imot meldinger fra klienter (TCP-basert)</td></tr>
<tr><td><b>Broker</b></td><td>Stopable-tråd med en løkke som tar imot nye klienter som kobler seg på (<code>waitConnect</code>)</td></tr>
<tr><td><b>Dispatcher</b></td><td>Stopable-tråd som poller klientsesjonene (<code>hasData</code>) og prosesserer de ulike meldingene (<code>onCreateTopic</code>, <code>onSubscribe</code>, <code>onPublish</code> …)</td></tr>
<tr><td><b>Storage</b></td><td>Lagrer hvilke klienter som er tilkoblet og hvilke klienter som abonnerer på hvilke emner (to <code>ConcurrentHashMap</code>)</td></tr>
<tr><td><b>ClientSession</b></td><td>Representerer forbindelsen til én tilkoblet klient (send/receive/hasData)</td></tr>
</table></div>
<h3>Protokollmeldingene</h3>
<p>Alle arver fra <code>Message</code> (har <code>user</code> og <code>type</code>) og sendes som <b>JSON</b> (gson), f.eks. <code>{"type":"CONNECT","user":"display"}</code>:</p>
<p><code>ConnectMsg</code> · <code>DisconnectMsg</code> · <code>CreateTopicMsg(topic)</code> · <code>DeleteTopicMsg(topic)</code> · <code>SubscribeMsg(topic)</code> · <code>UnsubscribeMsg(topic)</code> · <code>PublishMsg(topic, message)</code></p>
<h3>Hvordan finner brokeren mottakerne av en publish? (jan 2024 2d)</h3>
<pre><code><span class="kw">public void</span> onPublish(<span class="ty">PublishMsg</span> msg) {
    <span class="kw">for</span> (<span class="ty">String</span> user : storage.getSubscribers(msg.getTopic())) {   <span class="cm">// topic → Set&lt;user&gt;</span>
        <span class="ty">ClientSession</span> session = storage.getSession(user);          <span class="cm">// user → sesjon</span>
        <span class="kw">if</span> (session != <span class="kw">null</span>) session.send(msg);
    }
}</code></pre>
<h3>Stopable-tråden (jan 2024 2e)</h3>
<pre><code><span class="kw">public abstract class</span> <span class="ty">Stopable</span> <span class="kw">extends</span> <span class="ty">Thread</span> {
    <span class="kw">private boolean</span> stop = <span class="kw">false</span>;
    <span class="kw">public synchronized void</span> doStop() { stop = <span class="kw">true</span>; }
    <span class="kw">private synchronized boolean</span> doCont() { <span class="kw">return</span> !stop; }
    <span class="kw">public abstract void</span> doProcess();
    <span class="kw">public void</span> run() { <span class="kw">while</span> (doCont()) doProcess(); }      <span class="cm">// kjører doProcess om og om igjen</span>
}</code></pre>
<p>En Stopable-tråd kjører <code>doProcess()</code> kontinuerlig til <code>doStop()</code> kalles. Den passer til oppgaver som skal gjentas i en løkke – f.eks. Brokerens accept-løkke og Dispatcherens polling.</p>
<h3>Valgfrie utvidelser</h3>
<ul>
  <li><b>Task E – bufring</b>: hvis en abonnent er frakoblet, lagres publiserte meldinger (ny hash-map i Storage) og sendes når klienten kobler til igjen → <b>tidsavkobling</b>.</li>
  <li><b>Task F – flertrådet broker</b>: én dispatcher-tråd per klient, startet i <code>waitConnect</code>, stoppet med <code>doStop()</code> ved disconnect.</li>
</ul>
`,
      quiz: [
        { q: 'Hva var tjenesten meldingslaget (fra prosjekt 1) ga prosjekt 2?', o: ['Ruting av IP-datagrammer', 'En meldingsabstraksjon oppå TCP som lar klient og server pålitelig utveksle (korte) meldinger', 'Kryptering', 'Navneoppslag'], a: [1], e: 'Jan 2024 2b.' },
        { q: 'Hvordan finner brokeren hvilke klienter som skal motta en publish-melding?', o: ['Den sender til alle tilkoblede klienter', 'Storage har en HashMap fra topic til settet av brukere som abonnerer', 'Den spør DNS', 'Klientene poller brokeren'], a: [1], e: 'subscriptions: topic → Set<user>; deretter user → ClientSession.' },
        { q: 'Hvordan fungerer en Stopable-tråd?', o: ['Den kjører doProcess() én gang', 'Den kjører doProcess() i en løkke til doStop() kalles', 'Den stopper av seg selv etter 10 sekunder', 'Den er en vanlig Runnable uten løkke'], a: [1], e: 'run(): while (doCont()) doProcess();' },
        { q: 'Hvordan kan brokeren utvides til å prosessere flere klientsesjoner parallelt?', o: ['Ved å bruke UDP', 'Ved å starte en ny dispatcher-tråd per klient i waitConnect', 'Ved å øke portnummeret', 'Ved å la klientene kommunisere direkte'], a: [1], e: 'Jan 2024 2f / Task F.' }
      ]
    }
  ],
  summary: [
    'Persistent: middleware lagrer meldingen til den leveres. Transient: lagres bare mens begge kjører.',
    'Synkron: avsender blokkeres til forespørselen er akseptert. Asynkron: avsender fortsetter med en gang.',
    'RPC = transient synkron. MOM/meldingskø = persistent asynkron (løs kobling i tid).',
    'Mønstre: request-reply, publish-subscribe (utgiver bryr seg ikke om hvem som henter), pipeline.',
    'Kø-operasjoner: PUT, GET (blokkerer), POLL (blokkerer ikke), NOTIFY (handler).',
    'Broker: transformerer formater (heterogenitet) og ruter meldinger til abonnenter av et emne.',
    'Prosjekt 2: Broker (accept-løkke), Dispatcher (prosesserer meldinger), Storage (klienter + topic→abonnenter), ClientSession, meldinger i JSON, Stopable-tråder.'
  ],
  formulas: [],
  examQA: [
    { q: 'List the main components implemented in the Broker (project 2) and explain their purpose.', a: 'MessagingServer (underlying messaging service receiving messages from clients), Broker (loop accepting connecting clients), Dispatcher (processes the different messages received), Storage (stores connected clients and which clients subscribe to which topics).' },
    { q: 'What information does a messaging client need to contact a messaging server?', a: 'The IP address of the host running the server and the port the server is listening on.' },
    { q: 'How does the broker identify the clients to which a published message should be sent?', a: 'Via Storage, which has a HashMap mapping each topic (key) to the set of users subscribing to it; each user maps to a ClientSession used for sending.' },
    { q: 'Explain briefly how a Stopable-thread works and what kind of task it can be used for.', a: 'It extends Thread and its run method continuously executes a doProcess method until doStop is called. Implementing doProcess makes the thread repeatedly perform a task, e.g., accepting connections or dispatching messages.' }
  ]
});
