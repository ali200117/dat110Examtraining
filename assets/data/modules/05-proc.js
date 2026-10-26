DAT110.addModule({
  id: 'proc',
  title: 'Prosesser, tråder, klienter og servere',
  source: 'van Steen & Tanenbaum kap. 3.1, 3.3, 3.4 (s. 149–153) og 3.4.4',
  exam: 'Oppgave 7 (multithreading i servere – mai 2022, jan 2024; stateful vs stateless – jan 2025) og Oppgave 1',
  goals: [
    'Skille prosess og tråd, og forklare hvorfor tråder er billigere',
    'Forklare bruk av tråder i klienter (skjule forsinkelse) og servere (samtidighet)',
    'Kjenne dispatcher/worker-modellen og de tre måtene å bygge en server på',
    'Skille iterative og samtidige (concurrent) servere',
    'Skille tilstandsløse (stateless) og tilstandsfulle (stateful) servere',
    'Forklare serverklynger og forespørselsfordeling'
  ],
  sections: [
    {
      id: 'proc-1',
      title: 'Prosesser og tråder',
      html: `
<p>En <b>prosess</b> er et program under utførelse, med eget adresserom (minne), egne filer, registre og stack. OS-et sørger for at prosesser er isolert fra hverandre (<b>samtidighetstransparens</b>) – men det koster: å bytte mellom prosesser (<b>context switch</b>) krever bytte av minnekart, tømming av TLB/cache osv.</p>
<p>En <b>tråd</b> er en «lettvektsprosess»: en egen utførelsesflyt (egen programteller, registre og stack) <b>inne i en prosess</b>. Tråder i samme prosess <b>deler adresserom</b> (minne, filer).</p>
<div class="compare">
  <div><h4>Fordeler med tråder</h4><ul><li>Blokkerende kall (I/O, nettverk) stopper bare én tråd – resten av prosessen fortsetter.</li><li>Kan utnytte flere prosessorkjerner (parallellitet).</li><li>Mye billigere å opprette og bytte mellom enn prosesser.</li><li>Enkel deling av data via felles minne.</li></ul></div>
  <div><h4>Ulemper</h4><ul><li>Ingen beskyttelse mellom tråder – en tråd kan ødelegge data for en annen.</li><li>Programmereren må synkronisere (låser, <code>synchronized</code>) – race conditions og vranglås.</li></ul></div>
</div>
<div class="callout why"><span class="ct">Hvorfor er trådbytte billigere enn prosessbytte?</span>
Tråder i samme prosess deler minnekartet. Ved trådbytte trenger OS-et bare bytte registre og stack-peker – ikke hele adresserommet. (Canvas-feller: «It is less efficient to perform thread switch than process switch» er <b>feil</b>.)</div>
`,
      quiz: [
        { q: 'Tråder i samme prosess deler adresserom.', o: ['Sant', 'Usant'], a: [0], e: 'Ja – de deler minne og filer, men har egen stack og egne registre.' },
        { q: 'En hovedgrunn til å bruke flertrådet modell i et distribuert miljø er at …', o: ['det er mindre effektivt å bytte tråd enn prosess', 'forespørsler kan prosesseres samtidig uten at hele prosessen blokkeres', 'det gjør omdirigeringspolicy enklere for serveren'], a: [1], e: 'Et blokkerende kall stopper bare én tråd.' },
        { q: 'Hva må en programmerer passe på ved bruk av tråder?', o: ['Ingenting – OS-et isolerer trådene', 'Synkronisering av tilgang til delte data', 'At trådene har ulike IP-adresser'], a: [1], e: 'Delt minne → race conditions uten låsing.' }
      ]
    },
    {
      id: 'proc-2',
      title: 'Tråder i distribuerte systemer: klienter og servere',
      html: `
<h3>Flertrådede klienter – skjule kommunikasjonsforsinkelse</h3>
<p>Eksempel: en <b>nettleser</b>. Den henter HTML-siden, og starter så én tråd per bilde/skript som skal lastes ned. Brukeren ser siden bygges opp mens resten lastes. Er webserveren <b>replikert</b>, kan trådene hente fra <b>ulike replikaer parallelt</b> – nesten lineær hastighetsøkning.</p>
<div class="callout exam"><span class="ct">Canvas-quiz</span>«One main use of multithreading in client systems is:» → <b>Hiding communication latency by using multiple threads to concurrently connect to different replicas and fetch data</b>.</div>
<h3>Flertrådede servere – dispatcher/worker</h3>
<div class="figure"><svg viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="arP" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="ah"/></marker></defs>
  <rect x="10" y="85" width="90" height="40" rx="8" class="bx"/><text x="55" y="110" text-anchor="middle" class="txs">Forespørsler</text>
  <line x1="100" y1="105" x2="170" y2="105" class="ln" marker-end="url(#arP)"/>
  <rect x="170" y="80" width="110" height="50" rx="8" class="bx2"/><text x="225" y="102" text-anchor="middle" class="txs">Dispatcher-</text><text x="225" y="117" text-anchor="middle" class="txs">tråd</text>
  <rect x="360" y="20" width="110" height="36" rx="8" class="bxg"/><text x="415" y="43" text-anchor="middle" class="txs">Worker 1</text>
  <rect x="360" y="87" width="110" height="36" rx="8" class="bxg"/><text x="415" y="110" text-anchor="middle" class="txs">Worker 2</text>
  <rect x="360" y="154" width="110" height="36" rx="8" class="bxg"/><text x="415" y="177" text-anchor="middle" class="txs">Worker 3</text>
  <line x1="280" y1="98" x2="360" y2="40" class="ln" marker-end="url(#arP)"/><line x1="280" y1="105" x2="360" y2="105" class="ln" marker-end="url(#arP)"/><line x1="280" y1="112" x2="360" y2="170" class="ln" marker-end="url(#arP)"/>
  <rect x="500" y="80" width="90" height="50" rx="8" class="bxw"/><text x="545" y="102" text-anchor="middle" class="txs">Disk /</text><text x="545" y="117" text-anchor="middle" class="txs">database</text>
  <line x1="470" y1="38" x2="500" y2="95" class="lnd"/><line x1="470" y1="105" x2="500" y2="105" class="lnd"/><line x1="470" y1="172" x2="500" y2="115" class="lnd"/>
  <text x="300" y="212" text-anchor="middle" class="txmu">Dispatcheren tar imot og deler ut; en worker kan blokkere på I/O uten å stoppe de andre</text>
</svg></div>
<div class="callout exam"><span class="ct">Modellsvar (mai 2022 7b / jan 2024 7a)</span>
«In a multi-threaded server, requests from clients are passed to separate threads to process the request. In this way the server can handle multiple requests <b>without blocking</b>. Multithreading also allows the server to <b>exploit multi-processor architectures</b>, leading to better performance.»</div>
<h3>Tre måter å bygge en server på</h3>
<div class="table-wrap"><table>
<tr><th>Modell</th><th>Egenskaper</th></tr>
<tr><td><b>Flertrådet</b></td><td>Parallellitet + enkle blokkerende kall (lett å programmere)</td></tr>
<tr><td><b>Enkelttrådet prosess</b></td><td>Ingen parallellitet, blokkerende kall (enkel, men treg)</td></tr>
<tr><td><b>Endelig tilstandsmaskin</b> (event-drevet)</td><td>Parallellitet + ikke-blokkerende kall (rask, men vanskelig å programmere)</td></tr>
</table></div>
<div class="callout"><span class="ct">Kobling til prosjekt 2 (jan 2024 2f)</span>
Brokeren i prosjekt 2 har én dispatcher-tråd som poller alle klientsesjoner. For å utnytte flere kjerner: endre <code>waitConnect</code> i <code>Broker</code> slik at den <b>starter en ny dispatcher-tråd for hver klient</b> som kobler seg til. Hver tråd håndterer bare forespørslene fra sin klient.</div>
`,
      quiz: [
        { q: 'Hva er hovedpoenget med flertrådede servere?', o: ['Serveren kan håndtere flere forespørsler uten å blokkere, og utnytte flere prosessorer', 'Serveren trenger færre porter', 'Serveren blir tilstandsløs', 'Klientene slipper å bruke TCP'], a: [0], e: 'Hver forespørsel får sin egen tråd.' },
        { q: 'Hvilken servermodell gir parallellitet med ikke-blokkerende kall, men er vanskelig å programmere?', o: ['Flertrådet', 'Enkelttrådet prosess', 'Endelig tilstandsmaskin'], a: [2], e: 'Event-drevet FSM: ett tråd, men aldri blokkering.' },
        { q: 'En nettleser åpner flere tråder for å hente bilder fra ulike replikaer samtidig. Hva oppnås?', o: ['Skjuler kommunikasjonsforsinkelse', 'Økt sikkerhet', 'Sterk konsistens', 'Mindre minnebruk'], a: [0], e: 'Klassisk eksempel på flertrådet klient.' }
      ]
    },
    {
      id: 'proc-3',
      title: 'Klienter og distribusjonstransparens',
      html: `
<p>En klient er mer enn et brukergrensesnitt – klientprogramvaren hjelper med å oppnå transparens:</p>
<ul>
  <li><b>Access-transparens</b>: klient-<b>stubber</b> (som i RPC) skjuler hvordan og hvor en tjeneste kalles.</li>
  <li><b>Location/migration/relocation</b>: via navnesystem – klienten kan koble seg til ny adresse uten at brukeren merker det.</li>
  <li><b>Replikeringstransparens</b>: klientsiden kan sende forespørselen til flere replikaer, samle svarene og levere ett svar til applikasjonen.</li>
  <li><b>Feiltransparens</b>: klientmiddleware prøver på nytt, eller bruker cachede data.</li>
</ul>
<p><b>Tynn klient</b>: lite logikk lokalt (alt kjører på serveren). <b>Tykk klient</b>: mye logikk lokalt (f.eks. validering i nettleseren for å skjule forsinkelse).</p>
`,
      quiz: [
        { q: 'Hvordan kan klientprogramvare gi replikeringstransparens?', o: ['Ved å sende forespørselen til flere replikaer og levere ett samlet svar til applikasjonen', 'Ved å bruke UDP', 'Ved å kryptere forespørselen', 'Ved å bruke én fast server'], a: [0], e: 'Klientsiden skjuler at det finnes flere kopier.' }
      ]
    },
    {
      id: 'proc-4',
      title: 'Servere: iterative vs. samtidige, stateless vs. stateful',
      html: `
<div class="compare">
  <div><h4>Iterativ server</h4><p>Håndterer <b>én forespørsel om gangen</b> – fullfører den helt før den tar imot neste. Enkel, men andre klienter må vente. (Prosjekt 1-serveren håndterer bare én forbindelse.)</p></div>
  <div><h4>Samtidig (concurrent) server</h4><p>Gir forespørselen videre til en egen tråd/prosess og er straks klar for neste. Flertrådet server er den vanligste formen.</p></div>
</div>
<h3>Hvordan finner klienten serveren? Porter</h3>
<p>Klienter sender til et <b>endepunkt (port)</b> på serverens maskin. Kjente tjenester har faste porter (HTTP 80, DNS 53). Alternativt finnes en <b>daemon</b> som holder oversikt over hvilken port en tjeneste bruker, eller en <b>superserver</b> (inetd) som lytter på mange porter og starter riktig server ved behov.</p>
<h3>Avbryte en server</h3>
<p>Klienten kan bare bryte forbindelsen, eller sende <b>out-of-band</b>-data (TCP «urgent data») som serveren behandler med høyere prioritet.</p>
<h3>Stateless vs. stateful</h3>
<div class="compare">
  <div><h4>Stateless (tilstandsløs)</h4><ul><li>Holder <b>ingen informasjon</b> om klientenes tilstand.</li><li>Kan endre egen tilstand uten å informere klienter.</li><li>Eks.: webserver (HTTP), som ikke husker hvem du er.</li><li><b>Fordeler</b>: krasj og gjenoppretting med lite overhead, enkel horisontal skalering, ingen inkonsistent klienttilstand å rydde opp i.</li></ul></div>
  <div><h4>Stateful (tilstandsfull)</h4><ul><li>Holder <b>vedvarende informasjon</b> om klientene.</li><li>Eks.: filserver som husker hvilke filer en klient har åpne, for å gjøre oppdateringer raskere.</li><li><b>Fordel</b>: bedre ytelse (f.eks. lokal caching hos klient).</li><li><b>Ulempe</b>: etter krasj må tilstanden gjenopprettes.</li></ul></div>
</div>
<div class="callout exam"><span class="ct">Modellsvar jan 2025 7a</span>«Stateful servers maintain persistent information about their clients while stateless servers do not keep information about the state of its clients and can change their own state without having to inform any client.»</div>
<p><b>Soft state</b>: serveren lover å huske tilstand bare en begrenset tid (f.eks. abonnement på oppdateringer som utløper). <b>Cookies</b> lar en tilstandsløs server få klienten til å bære tilstanden.</p>
`,
      quiz: [
        { q: 'En iterativ server innebærer at …', o: ['serveren aksepterer bare én forespørsel om gangen og tar nye først når den er ferdig', 'serveren aksepterer mange forbindelser og delegerer dem til tråder', 'serveren prosesserer alle forespørsler samtidig'], a: [0], e: 'Iterativ = en etter en.' },
        { q: 'Hvilke utsagn om stateful og stateless servere stemmer?', o: ['En stateful server holder på tilstanden til klientene sine', 'En stateless server holder ikke informasjon om klientene sine', 'En stateful server holder ikke tilstanden til klientene', 'En stateless server holder informasjon om klientene'], a: [0, 1], e: 'Definisjonene.' },
        { q: 'Hvilke er fordeler med en tilstandsløs server?', o: ['Mindre risiko for inkonsistent tilstand mellom klient og server', 'Serveren kan krasje og gjenopprettes med lite overhead', 'Enkel horisontal skalering'], a: [0, 1, 2], e: 'Ingen klienttilstand å miste eller synkronisere – enhver server kan ta enhver forespørsel.' },
        { q: 'Er en HTTP-webserver typisk stateful eller stateless?', o: ['Stateful', 'Stateless'], a: [1], e: 'HTTP er tilstandsløs; cookies legges på for å bære tilstand.' }
      ]
    },
    {
      id: 'proc-5',
      title: 'Serverklynger',
      html: `
<p>En <b>serverklynge</b> er en samling maskiner koblet sammen med et raskt nett, der hver maskin kjører én eller flere servere. Typisk <b>tre-lags</b> organisering:</p>
<ol>
  <li><b>Logisk svitsj</b> (front-end / dispatcher) – tar imot forespørsler og fordeler dem (eneste kontaktpunkt for klientene).</li>
  <li><b>Applikasjons-/beregningsservere</b> – gjør selve jobben.</li>
  <li><b>Distribuert fil-/databasesystem</b> – delt lagring.</li>
</ol>
<div class="figure"><svg viewBox="0 0 600 170" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="65" width="80" height="36" rx="8" class="bx"/><text x="50" y="88" text-anchor="middle" class="txs">Klienter</text>
  <rect x="140" y="55" width="100" height="56" rx="8" class="bx2"/><text x="190" y="80" text-anchor="middle" class="txs">Logisk</text><text x="190" y="96" text-anchor="middle" class="txs">svitsj</text>
  <rect x="300" y="15" width="120" height="30" rx="8" class="bxg"/><text x="360" y="35" text-anchor="middle" class="txs">App-server</text>
  <rect x="300" y="68" width="120" height="30" rx="8" class="bxg"/><text x="360" y="88" text-anchor="middle" class="txs">App-server</text>
  <rect x="300" y="121" width="120" height="30" rx="8" class="bxg"/><text x="360" y="141" text-anchor="middle" class="txs">App-server</text>
  <rect x="470" y="55" width="120" height="56" rx="8" class="bxw"/><text x="530" y="80" text-anchor="middle" class="txs">Distribuert</text><text x="530" y="96" text-anchor="middle" class="txs">fil/DB</text>
  <line x1="90" y1="83" x2="140" y2="83" class="ln"/><line x1="240" y1="75" x2="300" y2="30" class="ln"/><line x1="240" y1="83" x2="300" y2="83" class="ln"/><line x1="240" y1="91" x2="300" y2="136" class="ln"/>
  <line x1="420" y1="30" x2="470" y2="70" class="lnd"/><line x1="420" y1="83" x2="470" y2="83" class="lnd"/><line x1="420" y1="136" x2="470" y2="96" class="lnd"/>
</svg></div>
<ul>
  <li><b>TCP handoff</b>: svitsjen gir TCP-forbindelsen videre til en server, som svarer direkte til klienten (med svitsjens IP som avsender).</li>
  <li><b>Innholdsbevisst fordeling</b>: svitsjen ser på forespørselen (f.eks. URL) og sender den til serveren som har dataene.</li>
  <li><b>Vidstrakte klynger (WAN)</b>: servere spredt i ulike datasentre. Hovedutfordringen er <b>omdirigeringspolicy</b> (redirection) – å sende klienten til en server nær seg, f.eks. via DNS-basert omdirigering.</li>
</ul>
`,
      quiz: [
        { q: 'Hva er hovedutfordringen ved å skalere en serverklynge over et WAN?', o: ['Å håndtere omdirigeringspolicyen (sende klienten til riktig/nærmeste server)', 'Å håndtere klyngekonfigurasjonen', 'Å håndtere antall replikaer'], a: [0], e: 'van Steen: i vidstrakte klynger er valget av server (redirection) det sentrale.' },
        { q: 'Hva gjør den logiske svitsjen i en tre-lags serverklynge?', o: ['Lagrer alle data', 'Er eneste kontaktpunkt for klientene og fordeler forespørsler til serverne', 'Krypterer trafikken', 'Kjører applikasjonslogikken'], a: [1], e: 'Front-end/dispatcher.' }
      ]
    }
  ],
  summary: [
    'Prosess = eget adresserom; tråd = utførelsesflyt i en prosess, deler adresserom. Trådbytte er billigere enn prosessbytte.',
    'Flertrådede klienter skjuler kommunikasjonsforsinkelse (parallelle forbindelser, gjerne til replikaer).',
    'Flertrådede servere: håndterer flere forespørsler uten å blokkere og utnytter flere kjerner (dispatcher/worker).',
    'Servermodeller: flertrådet (parallell, blokkerende), enkelttrådet (ingen parallellitet), FSM (parallell, ikke-blokkerende).',
    'Iterativ server: én forespørsel om gangen. Samtidig server: delegerer til tråder/prosesser.',
    'Stateful: holder klienttilstand. Stateless: holder ikke klienttilstand, kan endre egen tilstand uten å informere; enkel gjenoppretting og skalering.',
    'Serverklynge: logisk svitsj → app-servere → distribuert lagring. WAN: omdirigering er nøkkelen.'
  ],
  formulas: [],
  examQA: [
    { q: 'Explain briefly the main use of multi-threading in server design.', a: 'In a multithreaded server, each client request is passed to a separate thread, so the server can handle multiple requests concurrently without blocking. It also allows the server to exploit multi-processor/multi-core architectures, giving better performance.' },
    { q: 'Describe briefly the difference between stateful and stateless servers.', a: 'Stateful servers maintain persistent information about their clients; stateless servers keep no information about the state of their clients and can change their own state without informing any client.' },
    { q: 'Sketch how the broker (project 2) can process multiple client sessions in parallel.', a: 'Change the broker so that waitConnect creates a new dispatcher thread for each connecting client; that thread then handles all requests from that client (and is stopped on disconnect).' }
  ]
});
