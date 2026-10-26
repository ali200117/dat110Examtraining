DAT110.addModule({
  id: 'ds-intro',
  title: 'Distribuerte systemer – introduksjon og sky',
  source: 'van Steen & Tanenbaum kap. 1.1–1.3',
  exam: 'Oppgave 1 (sky: IaaS/PaaS/SaaS, rapid elasticity) og Oppgave 7 (transparens, skalerbarhet)',
  goals: [
    'Definere et distribuert system og forklare rollen til middleware',
    'Kunne alle typene distribusjonstransparens med eksempler',
    'Forklare de tre formene for skalerbarhet og teknikkene for å skalere',
    'Kjenne de falske antakelsene («fallacies») ved distribuerte systemer',
    'Skille IaaS, PaaS og SaaS og kjenne egenskapene ved skytjenester'
  ],
  sections: [
    {
      id: 'ds-intro-1',
      title: 'Hva er et distribuert system?',
      html: `
<div class="callout"><span class="ct">Definisjon (van Steen)</span>
Et distribuert system er <b>en samling autonome beregningselementer som for brukerne fremstår som ett enkelt, sammenhengende system</b>.</div>
<p>To nøkkelord:</p>
<ul>
  <li><b>Autonome noder</b>: hver node har egen prosessor, eget minne, egen klokke og kan feile uavhengig. Nodene samarbeider ved å sende meldinger. De er ofte organisert i et <b>overlay-nettverk</b> (strukturert, f.eks. en ring, eller ustrukturert, tilfeldige naboer).</li>
  <li><b>Ett sammenhengende system</b>: brukeren skal ikke trenge å vite hvor ting skjer. Dette er målet om <b>distribusjonstransparens</b>.</li>
</ul>
<h3>Middleware – «operativsystemet» for distribuerte systemer</h3>
<div class="figure"><svg viewBox="0 0 600 210" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="15" width="170" height="34" rx="6" class="bx"/><text x="105" y="37" text-anchor="middle" class="txs">Applikasjon A</text>
  <rect x="215" y="15" width="170" height="34" rx="6" class="bx"/><text x="300" y="37" text-anchor="middle" class="txs">Applikasjon B</text>
  <rect x="410" y="15" width="170" height="34" rx="6" class="bx"/><text x="495" y="37" text-anchor="middle" class="txs">Applikasjon C</text>
  <rect x="20" y="62" width="560" height="40" rx="6" class="bx2"/><text x="300" y="87" text-anchor="middle" class="txa">Middleware-lag (samme grensesnitt overalt)</text>
  <rect x="20" y="115" width="170" height="34" rx="6" class="bxw"/><text x="105" y="137" text-anchor="middle" class="txs">Lokalt OS 1</text>
  <rect x="215" y="115" width="170" height="34" rx="6" class="bxw"/><text x="300" y="137" text-anchor="middle" class="txs">Lokalt OS 2</text>
  <rect x="410" y="115" width="170" height="34" rx="6" class="bxw"/><text x="495" y="137" text-anchor="middle" class="txs">Lokalt OS 3</text>
  <rect x="20" y="160" width="170" height="30" rx="6" class="bx"/><text x="105" y="180" text-anchor="middle" class="txs">Maskin 1</text>
  <rect x="215" y="160" width="170" height="30" rx="6" class="bx"/><text x="300" y="180" text-anchor="middle" class="txs">Maskin 2</text>
  <rect x="410" y="160" width="170" height="30" rx="6" class="bx"/><text x="495" y="180" text-anchor="middle" class="txs">Maskin 3</text>
  <line x1="20" y1="202" x2="580" y2="202" class="lna"/><text x="300" y="198" text-anchor="middle" class="txmu">nettverk</text>
</svg><figcaption>Middleware ligger mellom applikasjonene og de lokale operativsystemene, og skjuler heterogenitet.</figcaption></div>
<p>Middleware tilbyr felles tjenester: <b>kommunikasjon</b> (f.eks. RPC, meldingskøer), <b>marshalling/unmarshalling</b> av data, <b>navngiving</b>, <b>sikkerhet</b>, <b>transaksjoner</b>, <b>feilhåndtering</b> – og gjør at programmer på ulike plattformer kan samarbeide (interoperabilitet). Prosjekt 1 og 2 handler nettopp om å lage middleware (RPC og publish-subscribe).</p>
<div class="callout why"><span class="ct">Hvorfor distribuere i det hele tatt?</span>
<ul class="mb0"><li><b>Deling av ressurser</b> (lagring, data, tjenester).</li><li><b>Skalerbarhet</b> – én maskin har fysiske grenser.</li><li><b>Pålitelighet/tilgjengelighet</b> – én maskin kan krasje; flere kopier gjør at systemet overlever.</li><li><b>Geografi</b> – data nær brukerne gir lavere forsinkelse.</li></ul></div>
<h3>Tre grunnleggende utfordringer</h3>
<ol>
  <li><b>Ingen felles klokke</b> – vanskelig å vite rekkefølgen på hendelser (→ logiske klokker).</li>
  <li><b>Ingen felles minne</b> – all samhandling via meldinger over et upålitelig nett.</li>
  <li><b>Delvise feil</b> – noen deler feiler mens resten kjører. En treg node og en krasjet node ser like ut utenfra.</li>
</ol>
`,
      quiz: [
        { q: 'Hvilken definisjon passer best for et distribuert system?', o: ['En kraftig klynge med delt minne', 'En samling autonome datamaskiner som fremstår som ett sammenhengende system for brukeren', 'Ett program som kjører på én server', 'Et nettverk av rutere'], a: [1], e: 'van Steen: autonome beregningselementer + ett sammenhengende system.' },
        { q: 'Applikasjoner i et distribuert system kjører typisk …', o: ['som prosesser på ulike datamaskiner som kommuniserer over et nettverk', 'som tråder i én prosess med delt minne', 'kun i nettverkskjernen'], a: [0], e: 'Ingen felles minne – kommunikasjon via meldinger.' },
        { q: 'Hva kan middleware-laget i et distribuert system gjøre?', o: ['Gjøre det mulig for heterogene plattformer å samarbeide (interoperabilitet)', 'Marshalling og unmarshalling av meldinger', 'Formidle meldinger mellom applikasjonen og transportlaget'], a: [0, 1, 2], e: 'Middleware ligger mellom applikasjonen og OS/transport, skjuler heterogenitet og tilbyr kommunikasjonstjenester som RPC (inkl. marshalling).' },
        { q: 'Hvilket utsagn om distribuerte systemer stemmer?', o: ['De gjør det mulig å lage mer pålitelige og mer skalerbare applikasjoner', 'De er automatisk sikrere enn sentraliserte systemer', 'Alle prosessene må skrives i samme programmeringsspråk'], a: [0], e: 'Replikering gir pålitelighet; flere maskiner gir skalerbarhet. Sikkerhet blir ofte vanskeligere. Prosesser kan skrives i ulike språk så lenge de følger samme protokoll.' }
      ]
    },
    {
      id: 'ds-intro-2',
      title: 'Distribusjonstransparens',
      html: `
<p><b>Distribusjonstransparens</b> handler om å oppnå et «single-system image»: å få en samling nettverkskoblede datamaskiner og prosesser til å fremstå som én datamaskin/prosess. Det finnes flere typer – <b>du må kunne alle</b> (mai 2023 7b).</p>
<div class="table-wrap"><table>
<tr><th>Transparens</th><th>Skjuler …</th><th>Eksempel</th></tr>
<tr><td><b>Access</b></td><td>forskjeller i datarepresentasjon og <em>hvordan</em> et objekt aksesseres</td><td>Samme API for lokal og ekstern fil; RPC skjuler byte-rekkefølge</td></tr>
<tr><td><b>Location</b></td><td><em>hvor</em> et objekt befinner seg</td><td>URL-en www.hvl.no sier ikke hvilken maskin</td></tr>
<tr><td><b>Relocation</b></td><td>at et objekt kan flyttes <em>mens det er i bruk</em></td><td>Mobil bruker som bytter aksesspunkt uten brudd</td></tr>
<tr><td><b>Migration</b></td><td>at et objekt kan flyttes til et annet sted</td><td>VM flyttes til annen fysisk maskin</td></tr>
<tr><td><b>Replication</b></td><td>at et objekt er replikert</td><td>Brukeren ser én nettside, ikke 50 kopier</td></tr>
<tr><td><b>Concurrency</b></td><td>at objektet deles av flere uavhengige brukere</td><td>To brukere oppdaterer samme database</td></tr>
<tr><td><b>Failure</b></td><td>feil og gjenoppretting av et objekt</td><td>En replika krasjer, en annen tar over</td></tr>
</table></div>
<div class="callout tip"><span class="ct">Huskeregel: «ALL Men Run Crazy Fast»</span><b>A</b>ccess, <b>L</b>ocation, <b>R</b>elocation, <b>M</b>igration, <b>R</b>eplication, <b>C</b>oncurrency, <b>F</b>ailure.</div>
<div class="callout exam"><span class="ct">Eksamensformuleringer</span>
<b>Access transparency</b> (jan 2024 7b): «deals with hiding differences in data representation and the way that objects can be accessed».<br>
<b>Failure transparency</b> (mai 2024 7b): «hiding the failure and recovery of an object – a user or application does not notice that some part of the software fails, and that the system subsequently (automatically) recovers».</div>
<div class="callout why"><span class="ct">Kan vi alltid ha full transparens? Nei!</span>
Full transparens er ofte for dyrt eller umulig: kommunikasjonsforsinkelse over kloden kan ikke skjules, og man kan ikke skille en treg server fra en krasjet en. Å skjule alt kan også gå ut over ytelse (f.eks. strenge konsistensgarantier). Noen ganger er det bedre å <em>eksponere</em> distribusjonen (f.eks. mobil-app som viser «offline»).</div>
`,
      quiz: [
        { q: 'Hvilken transparens skjuler at et objekt flyttes MENS det er i bruk?', o: ['Migration', 'Relocation', 'Location', 'Replication'], a: [1], e: 'Relocation = flytting under bruk. Migration = flytting (generelt).' },
        { q: 'Access transparency handler om å skjule …', o: ['hvor objektet er', 'forskjeller i datarepresentasjon og hvordan objektet aksesseres', 'at objektet er replikert', 'feil og gjenoppretting'], a: [1], e: 'Eksamen jan 2024 7b.' },
        { q: 'En bruker merker ikke at en server krasjet og ble erstattet automatisk. Hvilken transparens?', o: ['Concurrency', 'Failure', 'Migration', 'Access'], a: [1], e: 'Failure transparency = skjule feil og gjenoppretting.' },
        { q: 'Distribusjonstransparens i flertrådede klienter kan oppnås ved å …', o: ['bruke et praktisk navnesystem', 'la en flertrådet server kommunisere med klienten', 'skjule kommunikasjonsforsinkelse ved å bruke flere tråder mot ulike serverreplikaer samtidig'], a: [2], e: 'van Steen 3.1: flertrådede klienter (f.eks. nettleser) skjuler forsinkelse ved å hente data parallelt, gjerne fra flere replikaer.' }
      ]
    },
    {
      id: 'ds-intro-3',
      title: 'Skalerbarhet og åpenhet',
      html: `
<h3>Tre dimensjoner av skalerbarhet</h3>
<ul>
  <li><b>Størrelse</b> (size): flere brukere/ressurser uten merkbart ytelsestap. Problemer: sentraliserte tjenester (én server = flaskehals), beregningskapasitet, lagring, nettverk.</li>
  <li><b>Geografisk</b>: brukere og ressurser langt fra hverandre. Problemer: synkron kommunikasjon over WAN er treg, WAN er mindre pålitelig, broadcast fungerer ikke.</li>
  <li><b>Administrativ</b>: systemet spenner over mange organisasjoner med ulike regler og sikkerhetspolicyer.</li>
</ul>
<h3>Teknikker for å skalere</h3>
<div class="table-wrap"><table>
<tr><th>Teknikk</th><th>Idé</th><th>Eksempel</th></tr>
<tr><td><b>Skjule kommunikasjonsforsinkelse</b></td><td>Ikke vent – bruk asynkron kommunikasjon, eller flytt arbeid til klienten</td><td>Validere skjema i nettleseren i stedet for serveren; asynkron RPC</td></tr>
<tr><td><b>Partisjonering og distribusjon</b></td><td>Del data og arbeid i biter som spres</td><td>DNS-navnerommet delt i soner; DHT</td></tr>
<tr><td><b>Replikering og caching</b></td><td>Kopier data nær brukerne; fordel last</td><td>DNS-cache, CDN, speil-servere</td></tr>
</table></div>
<div class="callout exam"><span class="ct">Eksamen mai 2023, 9a – DNS og skalerbarhet</span>
Iterativ og rekursiv navneoppslag i DNS har <b>størrelses-</b> og <b>geografiske</b> skaleringsutfordringer (mye trafikk mot rot-servere; lange avstander). Løsning i DNS: <b>omfattende replikering</b> på globalt og administrativt nivå, og <b>caching</b> i klientens lokale DNS-server.</div>
<div class="callout warn"><span class="ct">Bakside av replikering</span>Kopier må holdes konsistente. Sterk konsistens krever global synkronisering, som i seg selv skalerer dårlig. Derfor finnes svakere konsistensmodeller (se Konsistens-modulen).</div>
<h3>Åpenhet (openness)</h3>
<p>Et åpent system tilbyr komponenter som lett kan brukes i, eller integreres med, andre systemer: <b>interoperabilitet</b> (ulike implementasjoner virker sammen), <b>portabilitet</b> (kjører på ulike plattformer) og <b>utvidbarhet</b>. Et viktig prinsipp er å skille <b>policy</b> (hva) fra <b>mekanisme</b> (hvordan).</p>
<h3>De falske antakelsene (fallacies)</h3>
<p>Nybegynnere antar ofte at: nettverket er pålitelig · nettverket er sikkert · nettverket er homogent · topologien endres ikke · forsinkelsen er null · båndbredden er uendelig · transportkostnaden er null · det finnes én administrator. <b>Alle er feil</b> – og distribuerte systemer må designes for at de er feil.</p>
`,
      quiz: [
        { q: 'Hvordan løses skaleringsproblemer i DNS?', o: ['Ved å bruke et flatt navnerom', 'Ved å replikere DNS-servere på høyere nivå', 'Ved caching i lokale DNS-servere'], a: [1, 2], e: 'Replikering (f.eks. rot-servere) + caching. DNS er hierarkisk, ikke flatt.' },
        { q: 'Å validere skjemaet i nettleseren før det sendes, er et eksempel på …', o: ['replikering', 'å skjule kommunikasjonsforsinkelse', 'partisjonering', 'migrasjon'], a: [1], e: 'Arbeid flyttes til klienten, færre rundturer.' },
        { q: 'Hvilken skaleringsdimensjon handler om at systemet spenner over mange organisasjoner?', o: ['Størrelse', 'Geografisk', 'Administrativ'], a: [2], e: 'Administrativ skalerbarhet – ulike policyer, sikkerhet, ledelse.' }
      ]
    },
    {
      id: 'ds-intro-4',
      title: 'Typer distribuerte systemer og skytjenester',
      html: `
<p>van Steen 1.3 deler distribuerte systemer i tre hovedtyper:</p>
<ol>
  <li><b>Høyytelses distribuert databehandling</b>: <em>klynger</em> (homogene maskiner i et høyhastighets LAN), <em>grid</em> (heterogene ressurser fra flere organisasjoner), og <em>sky</em> (cloud).</li>
  <li><b>Distribuerte informasjonssystemer</b>: forretningssystemer med transaksjoner og integrasjon av applikasjoner (Enterprise Application Integration).</li>
  <li><b>Pervasive (gjennomtrengende) systemer</b>: ubiquitous computing, mobile systemer og <b>sensornettverk / IoT</b> – små enheter, ofte trådløse, ofte med begrenset strøm.</li>
</ol>
<h3>Sky (cloud computing)</h3>
<p>Skyen leverer virtualiserte ressurser (beregning, lagring, nettverk) <b>på forespørsel</b> over nettet, betalt etter bruk. NIST sine fem egenskaper:</p>
<ul>
  <li><b>On-demand self-service</b> – kunden skaffer seg ressurser selv, uten menneskelig kontakt.</li>
  <li><b>Broad network access</b> – tilgjengelig over nettet fra mange typer enheter.</li>
  <li><b>Resource pooling</b> – leverandøren deler ressurser mellom mange kunder (multi-tenancy).</li>
  <li><b>Rapid elasticity</b> – ressurser skaleres raskt opp og ned etter behov → handler om <b>skalerbarhet</b>.</li>
  <li><b>Measured service</b> – bruken måles og faktureres.</li>
</ul>
<div class="figure"><svg viewBox="0 0 620 200" xmlns="http://www.w3.org/2000/svg">
  <text x="105" y="16" text-anchor="middle" class="txa">IaaS</text><text x="310" y="16" text-anchor="middle" class="txa">PaaS</text><text x="515" y="16" text-anchor="middle" class="txa">SaaS</text>
  <g>
  <rect x="30" y="24" width="150" height="26" class="bxg"/><text x="105" y="41" text-anchor="middle" class="txs">Applikasjon</text>
  <rect x="30" y="50" width="150" height="26" class="bxg"/><text x="105" y="67" text-anchor="middle" class="txs">Data</text>
  <rect x="30" y="76" width="150" height="26" class="bxg"/><text x="105" y="93" text-anchor="middle" class="txs">Runtime/middleware</text>
  <rect x="30" y="102" width="150" height="26" class="bxg"/><text x="105" y="119" text-anchor="middle" class="txs">OS</text>
  <rect x="30" y="128" width="150" height="26" class="bx2"/><text x="105" y="145" text-anchor="middle" class="txs">Virtualisering (VM)</text>
  <rect x="30" y="154" width="150" height="26" class="bx2"/><text x="105" y="171" text-anchor="middle" class="txs">Maskinvare/nett</text>
  <rect x="235" y="24" width="150" height="26" class="bxg"/><text x="310" y="41" text-anchor="middle" class="txs">Applikasjon</text>
  <rect x="235" y="50" width="150" height="26" class="bxg"/><text x="310" y="67" text-anchor="middle" class="txs">Data</text>
  <rect x="235" y="76" width="150" height="26" class="bx2"/><text x="310" y="93" text-anchor="middle" class="txs">Runtime/middleware</text>
  <rect x="235" y="102" width="150" height="26" class="bx2"/><text x="310" y="119" text-anchor="middle" class="txs">OS</text>
  <rect x="235" y="128" width="150" height="26" class="bx2"/><text x="310" y="145" text-anchor="middle" class="txs">Virtualisering</text>
  <rect x="235" y="154" width="150" height="26" class="bx2"/><text x="310" y="171" text-anchor="middle" class="txs">Maskinvare/nett</text>
  <rect x="440" y="24" width="150" height="26" class="bx2"/><text x="515" y="41" text-anchor="middle" class="txs">Applikasjon</text>
  <rect x="440" y="50" width="150" height="26" class="bx2"/><text x="515" y="67" text-anchor="middle" class="txs">Data*</text>
  <rect x="440" y="76" width="150" height="26" class="bx2"/><text x="515" y="93" text-anchor="middle" class="txs">Runtime/middleware</text>
  <rect x="440" y="102" width="150" height="26" class="bx2"/><text x="515" y="119" text-anchor="middle" class="txs">OS</text>
  <rect x="440" y="128" width="150" height="26" class="bx2"/><text x="515" y="145" text-anchor="middle" class="txs">Virtualisering</text>
  <rect x="440" y="154" width="150" height="26" class="bx2"/><text x="515" y="171" text-anchor="middle" class="txs">Maskinvare/nett</text>
  </g>
  <rect x="160" y="186" width="12" height="10" class="bxg"/><text x="178" y="195" class="txs">kunden styrer</text>
  <rect x="300" y="186" width="12" height="10" class="bx2"/><text x="318" y="195" class="txs">leverandøren styrer</text>
</svg></div>
<div class="table-wrap"><table>
<tr><th>Modell</th><th>Kunden får</th><th>Eksempel</th><th>Eksamensformulering</th></tr>
<tr><td><b>IaaS</b></td><td>Virtuelle maskiner, lagring, nett</td><td>Amazon EC2, Azure VM</td><td>«rent virtual machines in the cloud»</td></tr>
<tr><td><b>PaaS</b></td><td>Plattform for å utvikle og kjøre egen kode</td><td>Google App Engine, Heroku</td><td>«develop and deploy a product using the cloud development infrastructure»</td></tr>
<tr><td><b>SaaS</b></td><td>Ferdig applikasjon</td><td>Gmail, Office 365</td><td>«use software over the Internet»</td></tr>
</table></div>
<div class="callout exam"><span class="ct">Spurt i 5 av 6 eksamener</span>
Leie VM-er → <b>IaaS</b> (mai 2023, mai 2024, juni 2025). Utvikle og deploye → <b>PaaS</b> (jan 2024). Rapid elasticity → <b>Scalability</b> (mai 2022, jan 2025). Feller: «Utility as a Service», «Development as a Service» og «Business as a Service» finnes ikke som standard modeller.</div>
<h3>Virtualisering og lastbalansering</h3>
<ul>
  <li>En <b>hypervisor</b> kjører flere isolerte VM-er på én fysisk maskin. VM-er kan <b>migreres</b> mellom fysiske verter (også mens de kjører).</li>
  <li><b>Containere</b> (Docker) deler OS-kjernen – lettere og raskere enn VM-er, men svakere isolasjon.</li>
  <li><b>Lastbalansering</b>: <em>round robin</em> (servere velges etter tur uten å ta hensyn til last), <em>weighted round robin</em>, <em>least connections</em>, <em>low latency</em>.</li>
  <li>Ressurser som kan leveres på forespørsel: lagring, minne, nettverk, CPU (ikke en fysisk laptop!).</li>
</ul>
`,
      quiz: [
        { q: 'En kunde vil leie virtuelle maskiner i skyen. Hvilken tjenestemodell?', o: ['Platform as a Service', 'Infrastructure as a Service', 'Software as a Service', 'Utility as a Service'], a: [1], e: 'IaaS = infrastruktur (VM, lagring, nett).' },
        { q: 'Brukere vil utvikle og deploye et produkt med skyens utviklingsinfrastruktur. Modell?', o: ['SaaS', 'PaaS', 'Development as a Service', 'IaaS'], a: [1], e: 'PaaS gir en plattform for egen kode.' },
        { q: '«Rapid elasticity» er en skyegenskap som handler om …', o: ['Personvern', 'Sikkerhet', 'Skalerbarhet'], a: [2], e: 'Ressurser kan skaleres raskt opp/ned.' },
        { q: 'Hvilke av disse er standard tjenestemodeller i skyen?', o: ['Business as a Service', 'Utility as a Service', 'Software as a Service', 'Infrastructure as a Service'], a: [2, 3], e: 'De tre standardmodellene er IaaS, PaaS og SaaS.' },
        { q: 'En lastbalanseringsteknikk der servere velges én etter én uten å ta hensyn til last kalles …', o: ['Least connections', 'Low latency', 'Round robin', 'Weighted round robin'], a: [2], e: 'Round robin går bare på rundgang.' },
        { q: 'Virtuelle maskiner kan migreres fra én vert til en annen i et skymiljø.', o: ['Sant', 'Usant'], a: [0], e: 'VM-migrering (også «live migration») er en kjerneegenskap ved virtualisering.' }
      ]
    }
  ],
  summary: [
    'DS = autonome noder som fremstår som ett sammenhengende system. Middleware skjuler heterogenitet.',
    'Transparenser: Access, Location, Relocation, Migration, Replication, Concurrency, Failure.',
    'Skalerbarhet: størrelse, geografisk, administrativ. Teknikker: skjule forsinkelse (asynkront), partisjonere/distribuere, replikere/cache.',
    'DNS skalerer via replikering og caching.',
    'Sky: on-demand, broad network access, resource pooling, rapid elasticity (skalerbarhet), measured service.',
    'IaaS = leie VM; PaaS = utvikle/deploye på plattform; SaaS = ferdig programvare.'
  ],
  formulas: [],
  examQA: [
    { q: 'Describe briefly what distribution transparency means.', a: 'Distribution transparency is about achieving a single-system image: making a collection of networked computers and processes appear as a single computer/process.' },
    { q: 'What are the various types of distribution transparency?', a: 'Access (hide data representation and how an object is accessed), Location (where), Relocation (moved while in use), Migration (moved), Replication (replicated), Concurrency (shared by several users), Failure (failure and recovery).' },
    { q: 'What types of scalability challenges exist in DNS name resolution and how are they solved?', a: 'Size scalability and geographical scalability. Solved by extensive replication at global and administrational levels, and caching at the client’s local DNS server.' }
  ]
});
