DAT110.addModule({
  id: 'intro',
  title: 'Internett, forsinkelse og gjennomstrømning',
  source: 'Kurose & Ross kap. 1.1–1.4',
  exam: 'Oppgave 1 (flervalg) og Oppgave 3 (forsinkelse/gjennomstrømning) – kommer hvert år',
  goals: [
    'Forklare hva Internett er – både «muttere og bolter» og som tjenesteplattform',
    'Skille nettverkskant, aksessnett og nettverkskjerne',
    'Forklare pakkesvitsjing (store-and-forward) vs. linjesvitsjing',
    'Regne transmisjons-, propagerings-, nodal- og ende-til-ende-forsinkelse',
    'Regne trafikkintensitet og forklare når køforsinkelse oppstår',
    'Finne flaskehalslink, gjennomstrømning og linkutnyttelse'
  ],
  sections: [
    {
      id: 'intro-1',
      title: 'Hva er Internett?',
      html: `
<p>Internett kan beskrives på to måter, og eksamen spør om begge:</p>
<div class="compare">
  <div><h4>1. «Muttere og bolter» (komponenter)</h4>
    <ul>
      <li><b>Verter / endesystemer</b> (hosts): PC-er, mobiler, servere, IoT-sensorer – her kjører <em>applikasjonene</em>.</li>
      <li><b>Kommunikasjonslinker</b>: fiber, kobber, radio. Har en <em>transmisjonsrate</em> R (bit/s).</li>
      <li><b>Pakkesvitsjer</b>: <em>rutere</em> (nettverkslaget) og <em>link-lag-svitsjer</em> (linklaget).</li>
      <li><b>ISP-er</b> (Internet Service Providers) som knytter alt sammen.</li>
      <li><b>Protokoller</b> (TCP, IP, HTTP, Ethernet …) og <b>standarder</b> (IETF RFC-er, IEEE).</li>
    </ul></div>
  <div><h4>2. Tjenestesyn</h4>
    <p>Internett er en <b>infrastruktur som leverer tjenester til distribuerte applikasjoner</b> (web, e-post, spill, strømming). Applikasjonene bruker et <b>socket-grensesnitt</b> for å be Internett om å levere data til et program på en annen vert.</p>
  </div>
</div>
<div class="callout"><span class="ct">Definisjon: protokoll</span>
En <b>protokoll</b> definerer <b>formatet</b> og <b>rekkefølgen</b> på meldinger som utveksles mellom to eller flere kommuniserende enheter, samt <b>handlingene</b> som utføres ved sending og mottak av en melding (eller annen hendelse).</div>
<h3>Internetworking = nettverk av nettverk</h3>
<p>Det viktigste poenget: Internett er <b>et nettverk av nettverk</b> som består av en <b>heterogen</b> samling nettverksteknologier (Ethernet, WiFi, 4G, fiber …). IP-protokollen er «limet» som gjør at alle disse forskjellige nettene kan snakke sammen.</p>
<div class="callout exam"><span class="ct">Eksamensvinkel (mai 2023, 1a)</span>
«What is Internetworking and the Internet about?» → <b>Enabling a network-of-networks comprised of a heterogenous collection of data network technologies.</b> Feller: «to datamaskiner over én link» (for smalt) og «identiske mindre nett» (feil – poenget er nettopp at de er <em>forskjellige</em>).</div>
<h3>Kant, aksess og kjerne</h3>
<div class="figure"><svg viewBox="0 0 640 210" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="20" width="150" height="170" rx="12" class="bxg"/><text x="85" y="40" text-anchor="middle" class="txg">Nettverkskant</text>
  <rect x="30" y="60" width="50" height="32" rx="6" class="bx"/><text x="55" y="81" text-anchor="middle" class="txs">PC</text>
  <rect x="90" y="60" width="55" height="32" rx="6" class="bx"/><text x="117" y="81" text-anchor="middle" class="txs">Server</text>
  <rect x="30" y="110" width="50" height="32" rx="6" class="bx"/><text x="55" y="131" text-anchor="middle" class="txs">Mobil</text>
  <rect x="90" y="110" width="55" height="32" rx="6" class="bx"/><text x="117" y="131" text-anchor="middle" class="txs">IoT</text>
  <text x="85" y="170" text-anchor="middle" class="txmu">applikasjoner kjører her</text>
  <rect x="190" y="20" width="150" height="170" rx="12" class="bxw"/><text x="265" y="40" text-anchor="middle" class="tx" font-weight="700">Aksessnett</text>
  <text x="265" y="80" text-anchor="middle" class="txs">DSL · kabel · fiber (FTTH)</text>
  <text x="265" y="100" text-anchor="middle" class="txs">Ethernet · WiFi</text>
  <text x="265" y="120" text-anchor="middle" class="txs">4G/5G</text>
  <text x="265" y="160" text-anchor="middle" class="txmu">«første hopp» inn i nettet</text>
  <rect x="370" y="20" width="260" height="170" rx="12" class="bx2"/><text x="500" y="40" text-anchor="middle" class="txa">Nettverkskjerne</text>
  <circle cx="420" cy="90" r="18" class="bx"/><text x="420" y="95" text-anchor="middle" class="txs">R</text>
  <circle cx="500" cy="70" r="18" class="bx"/><text x="500" y="75" text-anchor="middle" class="txs">R</text>
  <circle cx="580" cy="100" r="18" class="bx"/><text x="580" y="105" text-anchor="middle" class="txs">R</text>
  <circle cx="470" cy="140" r="18" class="bx"/><text x="470" y="145" text-anchor="middle" class="txs">R</text>
  <circle cx="550" cy="150" r="18" class="bx"/><text x="550" y="155" text-anchor="middle" class="txs">R</text>
  <line x1="438" y1="84" x2="482" y2="74" class="ln"/><line x1="518" y1="74" x2="562" y2="94" class="ln"/>
  <line x1="428" y1="106" x2="458" y2="128" class="ln"/><line x1="488" y1="142" x2="532" y2="150" class="ln"/>
  <line x1="566" y1="114" x2="558" y2="134" class="ln"/><line x1="500" y1="88" x2="475" y2="122" class="ln"/>
  <line x1="160" y1="105" x2="190" y2="105" class="lna"/><line x1="340" y1="105" x2="402" y2="95" class="lna"/>
</svg><figcaption>Endesystemer i kanten → aksessnett → mesh av rutere i kjernen.</figcaption></div>
<ul>
  <li><b>Nettverkskanten</b>: endesystemene (verter). Det er her applikasjonene «bor» – ikke i kjernen.</li>
  <li><b>Aksessnettet</b>: det fysiske nettet som kobler en vert til den første ruteren (kantruteren).</li>
  <li><b>Nettverkskjernen</b>: et mesh av sammenkoblede rutere som videresender pakker.</li>
</ul>
<div class="callout why"><span class="ct">Hvorfor bor applikasjonene i kanten?</span>
Fordi rutere bare implementerer lag 1–3 (fysisk, link, nett). De ser aldri på applikasjonsdata. Dette er <em>end-to-end-prinsippet</em>: intelligensen ligger i endene, kjernen er «dum og rask». Derfor kan nye apper lages uten å endre en eneste ruter.</div>
<h3>Nettverk av nettverk – ISP-hierarkiet</h3>
<p>Aksess-ISP-er (f.eks. Telenor-hjemmenett) kobler seg til regionale ISP-er, som kobler seg til <b>tier-1 ISP-er</b> (globale backbones). I tillegg finnes <b>IXP-er</b> (Internet Exchange Points) der ISP-er møtes og utveksler trafikk direkte (<b>peering</b>), og store <b>innholdsleverandørnett</b> (Google, Netflix) som bygger egne nett nær brukerne for å redusere forsinkelse og kostnad.</p>
`,
      quiz: [
        { q: 'Hva er den beste beskrivelsen av «internetworking»?', o: ['Å koble to datamaskiner sammen med én kabel', 'Å få et nettverk av ulike (heterogene) nettverksteknologier til å fungere som ett nett', 'Å bygge ett stort nett av identiske delnett', 'Å kryptere trafikk mellom nett'], a: [1], e: 'Internett = nettverk av nettverk. Hele poenget er at delnettene er forskjellige (Ethernet, WiFi, 4G …) og at IP binder dem sammen.' },
        { q: 'Hvor kjører applikasjonene i den grunnleggende Internett-modellen?', o: ['I nettverkskjernen', 'I aksessnettet', 'I nettverkskanten (endesystemene)'], a: [2], e: 'Applikasjoner kjører på verter i kanten. Rutere i kjernen implementerer bare lag 1–3.' },
        { q: 'Hvilke tre ting definerer en protokoll?', o: ['Format på meldinger, rekkefølge på meldinger, og handlinger ved sending/mottak', 'Kabeltype, hastighet og pris', 'IP-adresse, portnummer og MAC-adresse', 'Kun formatet på meldingene'], a: [0], e: 'Kurose sin definisjon: format + rekkefølge + handlinger.' }
      ]
    },
    {
      id: 'intro-2',
      title: 'Nettverkskjernen: pakkesvitsjing vs. linjesvitsjing',
      html: `
<p>Det finnes to grunnleggende måter å flytte data gjennom et nett på:</p>
<div class="compare">
  <div><h4>Pakkesvitsjing (Internett)</h4>
  <ul>
    <li>Meldinger deles opp i <b>pakker</b> med header + nyttelast.</li>
    <li>Ressurser (linker, buffere) deles <b>ved behov</b> – <em>statistisk multipleksing</em>.</li>
    <li><b>Store-and-forward</b>: ruteren må motta <em>hele</em> pakken før den kan sende første bit videre.</li>
    <li>Pakker kan få <b>køforsinkelse</b> og <b>tapes</b> hvis bufferet blir fullt.</li>
  </ul></div>
  <div><h4>Linjesvitsjing (gammelt telefonnett)</h4>
  <ul>
    <li>En <b>dedikert ende-til-ende-forbindelse</b> (krets) reserveres før kommunikasjonen starter.</li>
    <li>Ressursene er reservert hele tiden – også når ingen snakker (sløsing).</li>
    <li>Garantert, forutsigbar ytelse. Ingen kø, ingen tap.</li>
    <li>Deler linken med <b>FDM</b> (frekvensdeling) eller <b>TDM</b> (tidsdeling).</li>
  </ul></div>
</div>
<div class="callout why"><span class="ct">Hvorfor valgte Internett pakkesvitsjing?</span>
De fleste brukere er inaktive mesteparten av tiden (de leser, tenker, venter). Med linjesvitsjing ville hver bruker holdt en reservert krets som står tom. Med pakkesvitsjing bruker en inaktiv bruker <b>null kapasitet</b>, så samme link kan betjene langt flere brukere. Prisen er variabel forsinkelse og mulig pakketap – noe TCP i endesystemene håndterer.</div>
<div class="callout example"><span class="ct">Klassisk eksempel (Kurose)</span>
En 1 Mbit/s-link, hver bruker sender 100 kbit/s når aktiv, men er aktiv bare 10 % av tiden.<br>
<b>Linjesvitsjing:</b> maks 10 brukere (10 × 100 kbit/s).<br>
<b>Pakkesvitsjing:</b> med 35 brukere er sannsynligheten for at &gt;10 er aktive samtidig bare ca. 0,0004. Altså nesten samme ytelse for 3,5 ganger så mange brukere.</div>
<h3>Store-and-forward – konsekvens for forsinkelse</h3>
<p>Skal en pakke på L bit over N linker med rate R, må hver ruter vente på hele pakken. Ignorerer vi andre forsinkelser blir ende-til-ende-forsinkelsen <code>N · L/R</code>.</p>
<div class="callout example"><span class="ct">Regneeksempel</span>
L = 10 000 bit, R = 1 Mbit/s, 3 linker (kilde → R1 → R2 → mål).<br>
L/R = 10 000 / 1 000 000 = 0,01 s. Totalt: 3 · 0,01 = <b>0,03 s</b>.</div>
<h3>To nøkkelfunksjoner i kjernen</h3>
<ul>
  <li><b>Forwarding</b> (videresending) – <em>lokal</em> handling: flytt en innkommende pakke til riktig utgående link ved å slå opp i <b>videresendingstabellen</b>.</li>
  <li><b>Routing</b> – <em>global</em> handling: beregne veiene pakker skal ta, og dermed <em>innholdet</em> i videresendingstabellene.</li>
</ul>
<p>Disse kommer tilbake i detalj i nettverkslaget – men de dukker opp allerede i Oppgave 1 og 6.</p>
<h3>Hvor kan pakker gå tapt?</h3>
<ol>
  <li><b>Bufferoverflyt</b>: for mange pakker ankommer for sending på samme link → køen er full → pakken droppes.</li>
  <li><b>Bitfeil</b>: interferens på linken endrer bit → feildeteksjon oppdager det → pakken forkastes.</li>
</ol>
<div class="callout exam"><span class="ct">Eksamen mai 2022, 1a</span>
«Which situations may lead to loss of packets?» Riktig: <b>interferens som endrer bit</b> og <b>buffere som flyter over</b>. Feil: «en vert sier til svitsjen at den ikke vil sende likevel» – det er ikke et tap.</div>
`,
      quiz: [
        { q: 'Hva betyr «store-and-forward»?', o: ['Ruteren lagrer alle pakker permanent for logging', 'Ruteren må motta hele pakken før den begynner å sende den videre', 'Ruteren sender hver bit videre straks den ankommer', 'Ruteren venter på bekreftelse fra mottaker før videresending'], a: [1], e: 'Hele pakken må være mottatt (og sjekket) før første bit sendes ut på neste link. Derfor gir hver link en full L/R-forsinkelse.' },
        { q: 'Hvorfor gir pakkesvitsjing bedre utnyttelse enn linjesvitsjing for vanlig datatrafikk?', o: ['Fordi pakker aldri går tapt', 'Fordi inaktive brukere ikke bruker kapasitet (statistisk multipleksing)', 'Fordi propagasjonsforsinkelsen blir null', 'Fordi hver bruker får en reservert krets'], a: [1], e: 'Trafikk er «burstete». Med pakkesvitsjing deles linken ved behov, så mange flere brukere kan dele den.' },
        { q: 'Hvilke situasjoner kan føre til pakketap i et pakkesvitsjet nett?', o: ['Interferens som endrer bit på en link', 'En vert som bestemmer seg for ikke å sende likevel', 'Buffere som flyter over fordi for mange pakker skal ut på samme link'], a: [0, 2], e: 'Tap skyldes enten bitfeil (pakken forkastes) eller fulle buffere (pakken droppes).' },
        { q: 'En pakke på 8 000 bit skal over 4 linker à 2 Mbit/s. Hva er total transmisjonsforsinkelse (store-and-forward, ignorer annet)?', o: ['4 ms', '8 ms', '16 ms', '32 ms'], a: [2], e: 'L/R = 8000/2 000 000 = 0,004 s = 4 ms per link. 4 linker → 16 ms.' }
      ]
    },
    {
      id: 'intro-3',
      title: 'De fire forsinkelsene i en node',
      html: `
<p>Når en pakke går gjennom en node (vert eller ruter) får den fire forsinkelser. Summen kalles <b>nodal forsinkelse</b>:</p>
<span class="formula">d_nodal = d_proc + d_queue + d_trans + d_prop</span>
<div class="figure"><svg viewBox="0 0 660 190" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="arA" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="ah"/></marker></defs>
  <rect x="20" y="60" width="60" height="50" rx="8" class="bx"/><text x="50" y="90" text-anchor="middle" class="tx">A</text>
  <line x1="80" y1="85" x2="150" y2="85" class="ln" marker-end="url(#arA)"/>
  <rect x="150" y="40" width="260" height="95" rx="12" class="bx2"/><text x="280" y="32" text-anchor="middle" class="txa">Ruter</text>
  <rect x="165" y="60" width="70" height="50" rx="6" class="bxw"/><text x="200" y="82" text-anchor="middle" class="txs">prosess-</text><text x="200" y="96" text-anchor="middle" class="txs">ering</text>
  <rect x="250" y="66" width="18" height="38" class="bx"/><rect x="270" y="66" width="18" height="38" class="bx"/><rect x="290" y="66" width="18" height="38" class="bx"/>
  <text x="280" y="125" text-anchor="middle" class="txs">kø (buffer)</text>
  <rect x="325" y="60" width="70" height="50" rx="6" class="bxg"/><text x="360" y="82" text-anchor="middle" class="txs">trans-</text><text x="360" y="96" text-anchor="middle" class="txs">misjon</text>
  <line x1="410" y1="85" x2="560" y2="85" class="lna" marker-end="url(#arA)"/>
  <text x="485" y="75" text-anchor="middle" class="txs">propagering d/s</text>
  <rect x="560" y="60" width="70" height="50" rx="8" class="bx"/><text x="595" y="90" text-anchor="middle" class="tx">B</text>
  <text x="200" y="160" text-anchor="middle" class="txmu">d_proc</text><text x="280" y="160" text-anchor="middle" class="txmu">d_queue</text>
  <text x="360" y="160" text-anchor="middle" class="txmu">d_trans = L/R</text><text x="485" y="160" text-anchor="middle" class="txmu">d_prop = d/s</text>
</svg><figcaption>De fire forsinkelsene en pakke opplever i en node.</figcaption></div>
<div class="table-wrap"><table>
<tr><th>Forsinkelse</th><th>Hva skjer?</th><th>Avhenger av</th><th>Typisk</th></tr>
<tr><td><b>Prosessering</b> d<sub>proc</sub></td><td>Lese header, sjekke bitfeil, bestemme utgående link</td><td>Ruterens maskinvare</td><td>mikrosekunder</td></tr>
<tr><td><b>Kø</b> d<sub>queue</sub></td><td>Vente i utgående buffer bak andre pakker</td><td>Trafikkmengden (metning)</td><td>0 → mange ms</td></tr>
<tr><td><b>Transmisjon</b> d<sub>trans</sub> = L/R</td><td>Tiden det tar å <em>dytte alle bitene ut</em> på linken</td><td>Pakkestørrelse L og linkrate R</td><td>µs → ms</td></tr>
<tr><td><b>Propagering</b> d<sub>prop</sub> = d/s</td><td>Tiden én bit bruker på å <em>reise</em> gjennom linken</td><td>Linklengde d og signalhastighet s</td><td>µs → ms</td></tr>
</table></div>
<div class="callout warn"><span class="ct">Vanligste feil på eksamen</span>
Transmisjon og propagering er <b>helt uavhengige</b>. Transmisjon handler om <em>hvor mange bit</em> og <em>hvor fort du kan legge dem ut</em> (L/R) – avstanden spiller ingen rolle. Propagering handler om <em>avstand og fysikk</em> (d/s) – pakkestørrelsen spiller ingen rolle.<br><b>Analogi (Kurose):</b> en bilkaravane gjennom en bomstasjon. Tiden det tar å få alle bilene gjennom bommen er transmisjon. Tiden en bil bruker på å kjøre til neste bom er propagering.</div>
<h3>Fullt regnet eksempel (eksamen jan 2025, oppgave 3)</h3>
<p>Link R1–R2: R = 10<sup>6</sup> bit/s, d = 10<sup>4</sup> m, s = 5·10<sup>8</sup> m/s. Pakke L = 10<sup>3</sup> bit. R1 har d<sub>proc</sub> = 0,002 s og d<sub>queue</sub> = 0,01 s.</p>
<ol class="steps">
  <li><b>Transmisjon:</b> d<sub>trans</sub> = L/R = 10<sup>3</sup>/10<sup>6</sup> = <b>0,001 s</b></li>
  <li><b>Propagering:</b> d<sub>prop</sub> = d/s = 10<sup>4</sup> / (5·10<sup>8</sup>) = 2·10<sup>-5</sup> = <b>0,00002 s</b></li>
  <li><b>Nodal:</b> 0,002 + 0,01 + 0,001 + 0,00002 = <b>0,01302 s</b></li>
  <li><b>Ende-til-ende H1 → H3</b> (H1, R1 og R2 sender hver pakken ut på en link, alle like): 3 · 0,01302 = <b>0,03906 s</b></li>
</ol>
<div class="callout tip"><span class="ct">Slik teller du noder i ende-til-ende</span>
Tell hvor mange noder som <b>sender pakken ut på en link</b>. På stien H1 → R1 → R2 → H3 er det H1, R1 og R2 (tre linker). Mottakeren H3 sender ikke videre. Med like noder: <code>d_end-end = N · (d_proc + d_queue + d_trans + d_prop)</code>.</div>
<div class="callout exam"><span class="ct">Tips for å få full uttelling</span>
Skriv alltid <b>formelen</b>, sett inn tallene med enheter, og gi svaret i sekunder. Bruk tierpotenser: 10<sup>5</sup>/10<sup>8</sup> = 10<sup>-3</sup>. Sensor gir poeng for riktig metode selv om du slurver på siste desimal.</div>
`,
      quiz: [
        { q: 'Hvilken forsinkelse påvirkes IKKE av pakkestørrelsen L?', o: ['Transmisjonsforsinkelse', 'Propagasjonsforsinkelse', 'Begge påvirkes', 'Ingen påvirkes'], a: [1], e: 'd_prop = d/s avhenger bare av avstand og signalhastighet.' },
        { q: 'Du dobler lengden på en kabel. Hva skjer?', o: ['Transmisjonsforsinkelsen dobles', 'Propagasjonsforsinkelsen dobles', 'Begge dobles', 'Køforsinkelsen dobles'], a: [1], e: 'Lengre kabel = lengre reisevei for signalet = dobbel d/s. L/R endres ikke.' },
        { q: 'L = 10⁵ bit, R = 10⁸ bit/s. Hva er transmisjonsforsinkelsen?', o: ['0,1 s', '0,01 s', '0,001 s', '1 s'], a: [2], e: '10⁵/10⁸ = 10⁻³ s = 0,001 s (eksamen mai 2023).' },
        { q: 'Hvilken forsinkelse varierer mest og kan bli svært stor ved metning?', o: ['Prosessering', 'Kø', 'Transmisjon', 'Propagering'], a: [1], e: 'Køforsinkelsen avhenger av hvor mange pakker som står foran i bufferet – den svinger med trafikken.' },
        { q: 'H1 → R1 → R2 → H3, alle noder har nodal forsinkelse 0,0125 s. Ende-til-ende?', o: ['0,0125 s', '0,025 s', '0,0375 s', '0,05 s'], a: [2], e: 'Tre noder sender ut på en link (H1, R1, R2): 3 · 0,0125 = 0,0375 s.' }
      ]
    },
    {
      id: 'intro-4',
      title: 'Køforsinkelse, trafikkintensitet og tap',
      html: `
<p>La <b>a</b> være gjennomsnittlig antall pakker som ankommer per sekund til en utgående link, <b>L</b> bit per pakke, og <b>R</b> linkraten. Da er</p>
<span class="formula">Trafikkintensitet = L · a / R</span>
<p>Det er altså forholdet mellom <b>hvor mange bit/s som presenteres</b> for linken og <b>hvor mange bit/s linken klarer å sende</b>.</p>
<div class="figure"><svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg">
  <line x1="50" y1="170" x2="490" y2="170" class="ln"/><line x1="50" y1="170" x2="50" y2="20" class="ln"/>
  <text x="270" y="194" text-anchor="middle" class="txs">La/R →</text>
  <text x="18" y="100" class="txs" transform="rotate(-90 18 100)">gj.snittlig køforsinkelse</text>
  <path d="M50,166 C200,164 300,150 360,120 C400,98 420,60 432,22" class="lna"/>
  <line x1="440" y1="170" x2="440" y2="20" class="lnd"/><text x="444" y="185" class="txs">1</text>
  <text x="130" y="150" class="txs">liten (≈0)</text><text x="330" y="100" class="txs">vokser raskt</text>
</svg><figcaption>Køforsinkelsen eksploderer når trafikkintensiteten nærmer seg 1.</figcaption></div>
<ul>
  <li><b>La/R ≈ 0</b>: pakker kommer sjelden – nesten ingen kø.</li>
  <li><b>La/R → 1</b>: køforsinkelsen vokser kraftig.</li>
  <li><b>La/R &gt; 1</b>: det kommer mer enn linken klarer – køen vokser uten grense (i praksis: bufferoverflyt og tap).</li>
</ul>
<div class="callout tip"><span class="ct">Huskeregel</span>Design systemet slik at trafikkintensiteten <b>aldri er større enn 1</b>.</div>
<h3>Eksamen mai 2023, 3d–e</h3>
<p>10 pakker/s à 100 000 bit på en link med R = 10<sup>8</sup> bit/s:</p>
<span class="formula">La/R = (10⁵ · 10) / 10⁸ = 10⁶ / 10⁸ = 0,01</span>
<p><b>Blir det køforsinkelse?</b> Nei (praktisk talt). Køforsinkelse oppstår når trafikkintensiteten nærmer seg 1 og kapasiteten begynner å bli brukt opp. 0,01 er langt unna.</p>
<div class="callout exam"><span class="ct">Flervalg (jan 2025, 1b)</span>
«What is traffic intensity a measure of?» → <b>A relation between the amount of bits presented per time unit for transmission on the link and the rate with which the bits can be transmitted.</b> (Ikke bare «bits per sekund presentert».)</div>
<h3>Pakketap og traceroute</h3>
<p>Bufferet foran en link er endelig. Kommer en pakke til fullt buffer, droppes den. Den kan retransmitteres av forrige node, av senderen (TCP), eller aldri. <b>Traceroute</b> sender pakker med økende TTL slik at hver ruter på veien svarer med en ICMP-melding – slik måles forsinkelsen til hver ruter.</p>
`,
      quiz: [
        { q: 'Hva måler trafikkintensitet?', o: ['Antall bit/s som presenteres for en link', 'Forholdet mellom bit/s som presenteres for linken og raten linken kan sende med', 'Antall bit som mottas på en innkommende link', 'Antall pakker som går tapt per sekund'], a: [1], e: 'La/R – tilført last delt på kapasitet.' },
        { q: '20 pakker/s à 5 000 bit på en 1 Mbit/s-link. Trafikkintensitet?', o: ['0,01', '0,1', '1', '10'], a: [1], e: 'La/R = 5000 · 20 / 1 000 000 = 100 000 / 1 000 000 = 0,1.' },
        { q: 'Hva skjer hvis La/R > 1 over tid?', o: ['Køen tømmes', 'Køen vokser uten grense og pakker går tapt', 'Propagasjonsforsinkelsen øker', 'Linkraten øker automatisk'], a: [1], e: 'Mer trafikk enn kapasitet → køen vokser → bufferoverflyt → tap.' }
      ]
    },
    {
      id: 'intro-5',
      title: 'Gjennomstrømning, flaskehals og linkutnyttelse',
      html: `
<p><b>Gjennomstrømning</b> (throughput) er raten (bit/s) mottakeren faktisk får data med. Langs en sti begrenses den av den tregeste linken – <b>flaskehalslinken</b>:</p>
<span class="formula">throughput = min(R₁, R₂, …, R_N)</span>
<div class="callout example"><span class="ct">Vannrør-analogi</span>Vann gjennom flere rør etter hverandre: det smaleste røret bestemmer hvor mye vann som kommer ut, uansett hvor brede de andre er.</div>
<h3>Eksamen jan 2024, 3d og jan 2025, 3d</h3>
<p>H1→R1: 100 Mbps, R1→R2: 10 Mbps, R2→H3: 50 Mbps. Flaskehals = <b>R1–R2 (10 Mbps)</b> – den laveste kapasiteten på stien. (Jan 2025: 50/100/10 → flaskehals R2–H3 på 10 Mbps.)</p>
<h3>Delt link – rettferdig deling (eksamen mai 2024, oppgave 3)</h3>
<div class="figure"><svg viewBox="0 0 620 200" xmlns="http://www.w3.org/2000/svg">
  <g class="tx">
  <rect x="20" y="20" width="40" height="26" rx="5" class="bx"/><text x="40" y="38" text-anchor="middle" class="txs">S1</text>
  <rect x="20" y="62" width="40" height="26" rx="5" class="bx"/><text x="40" y="80" text-anchor="middle" class="txs">S2</text>
  <rect x="20" y="104" width="40" height="26" rx="5" class="bx"/><text x="40" y="122" text-anchor="middle" class="txs">S3</text>
  <rect x="20" y="146" width="40" height="26" rx="5" class="bx"/><text x="40" y="164" text-anchor="middle" class="txs">S4</text>
  <circle cx="200" cy="96" r="20" class="bx2"/><text x="200" y="100" text-anchor="middle" class="txs">R1</text>
  <circle cx="420" cy="96" r="20" class="bx2"/><text x="420" y="100" text-anchor="middle" class="txs">R2</text>
  <line x1="60" y1="33" x2="182" y2="88" class="ln"/><line x1="60" y1="75" x2="180" y2="93" class="ln"/><line x1="60" y1="117" x2="180" y2="99" class="ln"/><line x1="60" y1="159" x2="182" y2="104" class="ln"/>
  <line x1="220" y1="96" x2="400" y2="96" class="lnb" style="stroke-width:5"/>
  <text x="310" y="86" text-anchor="middle" class="txb">R = 100 Mbps</text>
  <text x="110" y="196" text-anchor="middle" class="txs">Rs = 80 Mbps</text><text x="510" y="196" text-anchor="middle" class="txs">Rc = 40 Mbps</text>
  <rect x="560" y="20" width="40" height="26" rx="5" class="bx"/><text x="580" y="38" text-anchor="middle" class="txs">C1</text>
  <rect x="560" y="62" width="40" height="26" rx="5" class="bx"/><text x="580" y="80" text-anchor="middle" class="txs">C2</text>
  <rect x="560" y="104" width="40" height="26" rx="5" class="bx"/><text x="580" y="122" text-anchor="middle" class="txs">C3</text>
  <rect x="560" y="146" width="40" height="26" rx="5" class="bx"/><text x="580" y="164" text-anchor="middle" class="txs">C4</text>
  <line x1="438" y1="88" x2="560" y2="33" class="ln"/><line x1="440" y1="93" x2="560" y2="75" class="ln"/><line x1="440" y1="99" x2="560" y2="117" class="ln"/><line x1="438" y1="104" x2="560" y2="159" class="ln"/>
  </g>
</svg><figcaption>Fire server–klient-par deler midtlinken R1–R2.</figcaption></div>
<ol class="steps">
  <li><b>Gjennomstrømning per par:</b> midtlinken deles likt på 4 → 100/4 = 25 Mbps. min(80, 25, 40) = <b>25 Mbps</b>.</li>
  <li><b>Flaskehals:</b> den delte midtlinken R (hver får bare 25 Mbps av den).</li>
  <li><b>Utnyttelse serverlink:</b> 25/80 ≈ <b>0,31</b></li>
  <li><b>Utnyttelse klientlink:</b> 25/40 ≈ <b>0,62</b></li>
</ol>
<span class="formula">linkutnyttelse = faktisk gjennomstrømning / linkens kapasitet</span>
<div class="callout exam"><span class="ct">Juni 2025, 3d</span>
H1→R1 80 Mbps, R1–R2 30 Mbps, R2→H3 50 Mbps. Kun H1 sender maks til H3. Gjennomstrømning = 30 Mbps (flaskehals). Utnyttelse av R2–H3 = 30/50 = <b>0,6</b>.</div>
`,
      quiz: [
        { q: 'En sti har linker på 500 Mbps, 20 Mbps, 1 Gbps og 200 Mbps. Gjennomstrømning?', o: ['20 Mbps', '200 Mbps', '430 Mbps (snitt)', '1 Gbps'], a: [0], e: 'Flaskehalsen (minste kapasitet) bestemmer: 20 Mbps.' },
        { q: '5 par deler en midtlink på 100 Mbps rettferdig. Serverlinker 50 Mbps, klientlinker 30 Mbps. Gjennomstrømning per par?', o: ['20 Mbps', '30 Mbps', '50 Mbps', '100 Mbps'], a: [0], e: 'min(50, 100/5 = 20, 30) = 20 Mbps.' },
        { q: 'Med 20 Mbps gjennomstrømning over en 50 Mbps-link – hva er utnyttelsen?', o: ['0,2', '0,4', '2,5', '0,5'], a: [1], e: '20/50 = 0,4.' }
      ]
    }
  ],
  summary: [
    'Internett = nettverk av nettverk (heterogene teknologier), limt sammen av IP.',
    'Applikasjoner kjører i kanten (endesystemer). Rutere i kjernen implementerer lag 1–3.',
    'Pakkesvitsjing: deling ved behov, store-and-forward, kø og tap mulig. Linjesvitsjing: reservert krets (FDM/TDM).',
    'Pakketap: bufferoverflyt eller bitfeil.',
    'd_nodal = d_proc + d_queue + d_trans + d_prop. d_trans = L/R, d_prop = d/s.',
    'Ende-til-ende = sum av nodal forsinkelse i hver node som sender pakken ut på en link.',
    'Trafikkintensitet La/R: nær 1 → stor kø; > 1 → kø vokser uten grense.',
    'Gjennomstrømning = min av linkratene (flaskehals). Utnyttelse = gjennomstrømning / kapasitet.'
  ],
  formulas: [
    { name: 'Transmisjonsforsinkelse', expr: 'd_trans = L / R', note: 'L = bit i pakken, R = linkrate (bit/s)' },
    { name: 'Propagasjonsforsinkelse', expr: 'd_prop = d / s', note: 'd = linklengde (m), s = signalhastighet (m/s), ofte 2–3·10⁸' },
    { name: 'Nodal forsinkelse', expr: 'd_nodal = d_proc + d_queue + d_trans + d_prop', note: 'Alle fire må med' },
    { name: 'Ende-til-ende (N like noder)', expr: 'd_e2e = N · d_nodal', note: 'N = antall noder som sender ut på en link (kilde + rutere)' },
    { name: 'Store-and-forward (kun transmisjon)', expr: 'd = N · L / R', note: 'N linker' },
    { name: 'Trafikkintensitet', expr: 'I = L · a / R', note: 'a = pakker/s. I ≥ 1 → problemer' },
    { name: 'Gjennomstrømning', expr: 'min(R₁, R₂, …) ; delt link: R/n', note: 'Flaskehalsen bestemmer' },
    { name: 'Linkutnyttelse', expr: 'U = gjennomstrømning / linkkapasitet', note: 'mai 2024, juni 2025' }
  ],
  examQA: [
    { q: 'Compute the nodal delay at R1 (gitt L, R, d, s, d_proc, d_queue).', a: 'Skriv d_nodal = d_proc + d_queue + d_trans + d_prop, regn d_trans = L/R og d_prop = d/s, og summer. Eks. (jan 2024): 0,1 + 0,005 + 0,02 + 0,00005 = 0,12505 s.' },
    { q: 'Will there be a queuing delay at R1 with the traffic intensity computed?', a: 'Hvis La/R er langt under 1: Nei/neglisjerbar – køforsinkelse oppstår først når trafikkintensiteten nærmer seg 1 og linkens kapasitet begynner å bli brukt opp.' },
    { q: 'Which communication link constitutes the bottleneck link? (justify)', a: 'Flaskehalsen er linken med lavest kapasitet (transmisjonsrate) på stien – den begrenser ende-til-ende-gjennomstrømningen.' },
    { q: 'What are the link utilizations for the server links?', a: 'Utnyttelse = faktisk ende-til-ende gjennomstrømning / linkens kapasitet, f.eks. 25/80 = 0,31.' }
  ]
});
