DAT110.addModule({
  id: 'rpc',
  title: 'Remote Procedure Call (RPC)',
  source: 'van Steen & Tanenbaum kap. 4.2 (+ prosjekt 1)',
  exam: 'Oppgave 1 («main idea behind RPC»), Oppgave 2 (prosjekt 1), Oppgave 7/9 (asynkron RPC – 2023, jan 2024, mai 2024, juni 2025)',
  goals: [
    'Forklare ideen bak RPC og rollen til klient- og server-stub',
    'Gå gjennom de 10 stegene i et RPC-kall',
    'Forklare marshalling, byte-rekkefølge og problemet med referanser',
    'Skille synkron, asynkron, utsatt-synkron (deferred), enveis og multicast RPC',
    'Forklare hvordan en server kan gjøres asynkron med tråder og callbacks'
  ],
  sections: [
    {
      id: 'rpc-1',
      title: 'Ideen: kall en prosedyre på en annen maskin',
      html: `
<p>Message passing med <code>send</code>/<code>receive</code> skjuler ikke kommunikasjonen. Birrell & Nelson (1984) foreslo: <b>la programmer kalle prosedyrer som ligger på andre maskiner, som om de var lokale</b>. Det er RPC.</p>
<div class="callout exam"><span class="ct">Spurt i mai 2022 og jan 2025</span>«The main idea behind RPC is to:» → <b>Allow a client process to invoke a function on a remote server process.</b> Feller: «send messages via TCP» (det er transportmekanismen, ikke ideen) og «call its own function and forward the results» (feil retning).</div>
<p>Fra prosjekt 1-teksten: med RPC kan kontrolleren skrives som vanlig kode, selv om metodene utføres på andre maskiner:</p>
<pre><code><span class="kw">for</span> (<span class="kw">int</span> i = <span class="nu">0</span>; i &lt; N; i++) {
    <span class="kw">int</span> temp = sensor.read();                 <span class="cm">// utføres på sensor-maskinen!</span>
    display.write(<span class="ty">Integer</span>.toString(temp));    <span class="cm">// utføres på display-maskinen!</span>
}</code></pre>
<h3>Stubber</h3>
<ul>
  <li><b>Klient-stub</b> (proxy): ser ut som den ekte prosedyren for klienten. Den <em>pakker parametrene inn i en melding</em> (marshalling), sender den, venter på svar, pakker ut returverdien.</li>
  <li><b>Server-stub</b> (skeleton): mottar meldingen, pakker ut parametrene (unmarshalling), kaller den ekte prosedyren lokalt, pakker returverdien inn i en svarmelding.</li>
</ul>
<h3>De 10 stegene</h3>
<div class="figure"><svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="arR" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="aha"/></marker></defs>
  <text x="140" y="18" text-anchor="middle" class="txa">Klientmaskin</text><text x="500" y="18" text-anchor="middle" class="txa">Servermaskin</text>
  <rect x="40" y="30" width="200" height="36" rx="6" class="bx"/><text x="140" y="53" text-anchor="middle" class="txs">Klientprosess: k = add(i, j)</text>
  <rect x="40" y="80" width="200" height="36" rx="6" class="bx2"/><text x="140" y="103" text-anchor="middle" class="txs">Klient-stub (marshalling)</text>
  <rect x="40" y="130" width="200" height="36" rx="6" class="bxw"/><text x="140" y="153" text-anchor="middle" class="txs">Klient-OS</text>
  <rect x="400" y="30" width="200" height="36" rx="6" class="bx"/><text x="500" y="53" text-anchor="middle" class="txs">Server: implementasjon av add</text>
  <rect x="400" y="80" width="200" height="36" rx="6" class="bx2"/><text x="500" y="103" text-anchor="middle" class="txs">Server-stub (unmarshalling)</text>
  <rect x="400" y="130" width="200" height="36" rx="6" class="bxw"/><text x="500" y="153" text-anchor="middle" class="txs">Server-OS</text>
  <line x1="120" y1="66" x2="120" y2="80" class="lna" marker-end="url(#arR)"/><text x="106" y="77" class="txs">1</text>
  <line x1="120" y1="116" x2="120" y2="130" class="lna" marker-end="url(#arR)"/><text x="106" y="127" class="txs">2</text>
  <path d="M140,166 L140,200 L500,200 L500,166" class="lna" marker-end="url(#arR)"/><text x="320" y="195" text-anchor="middle" class="txs">3 melding: [add | i | j]</text>
  <line x1="480" y1="130" x2="480" y2="116" class="lna" marker-end="url(#arR)"/><text x="466" y="127" class="txs">4</text>
  <line x1="480" y1="80" x2="480" y2="66" class="lna" marker-end="url(#arR)"/><text x="466" y="77" class="txs">5</text>
  <line x1="520" y1="66" x2="520" y2="80" class="lng" marker-end="url(#arR)"/><text x="528" y="77" class="txs">6</text>
  <line x1="520" y1="116" x2="520" y2="130" class="lng" marker-end="url(#arR)"/><text x="528" y="127" class="txs">7</text>
  <path d="M520,166 L520,225 L160,225 L160,166" class="lng" marker-end="url(#arR)"/><text x="340" y="240" text-anchor="middle" class="txs">8 svarmelding: [add | resultat]</text>
  <line x1="160" y1="130" x2="160" y2="116" class="lng" marker-end="url(#arR)"/><text x="168" y="127" class="txs">9</text>
  <line x1="160" y1="80" x2="160" y2="66" class="lng" marker-end="url(#arR)"/><text x="168" y="77" class="txs">10</text>
</svg></div>
<ol>
  <li>Klienten kaller klient-stubben (vanlig lokalt kall).</li>
  <li>Stubben bygger en melding (marshalling) og kaller det lokale OS-et.</li>
  <li>Klient-OS sender meldingen til server-OS.</li>
  <li>Server-OS gir meldingen til server-stubben.</li>
  <li>Server-stubben pakker ut parametrene og kaller serveren.</li>
  <li>Serveren gjør jobben og returnerer resultatet til stubben.</li>
  <li>Server-stubben pakker resultatet i en melding og kaller sitt OS.</li>
  <li>Server-OS sender svaret til klient-OS.</li>
  <li>Klient-OS gir svaret til klient-stubben.</li>
  <li>Stubben pakker ut resultatet og returnerer til klienten.</li>
</ol>
<div class="callout why"><span class="ct">Hvorfor RPC – og hvorfor ikke bare sockets?</span>
RPC gir <b>access-transparens</b>: programmereren skriver vanlige metodekall og slipper å tenke på meldingsformat og sockets. Men RPC kan aldri bli <em>helt</em> transparent: nettverket kan feile, kallet tar lengre tid, og klient og server har <b>ulike adresserom</b>.</div>
`,
      quiz: [
        { q: 'Hovedideen bak RPC er å …', o: ['sende meldinger via TCP til en ekstern prosess', 'la en klientprosess kalle sin egen funksjon og sende resultatet til serveren', 'la en klientprosess kalle en funksjon i en ekstern serverprosess'], a: [2], e: 'Kallet ser lokalt ut, men utføres på serveren.' },
        { q: 'Hva gjør klient-stubben?', o: ['Utfører selve prosedyren', 'Pakker parametrene i en melding (marshalling), sender den og pakker ut svaret', 'Ruter pakken til serveren', 'Lagrer resultatet i en database'], a: [1], e: 'Stubben er en lokal «stand-in» for den eksterne prosedyren.' },
        { q: 'En protokoll (meldingsformat, datarepresentasjon) må avtales mellom kaller og den kalte for at RPC skal fungere.', o: ['Sant', 'Usant'], a: [0], e: 'Begge stubber må være enige om formatet – ofte spesifisert med et IDL.' },
        { q: 'Hvilken type transparens er RPC først og fremst et forsøk på å gi?', o: ['Replikeringstransparens', 'Access-transparens', 'Migrasjonstransparens', 'Samtidighetstransparens'], a: [1], e: 'Fjernkall skal se ut som lokale kall.' }
      ]
    },
    {
      id: 'rpc-2',
      title: 'Parameteroverføring og marshalling',
      html: `
<p><b>Marshalling</b> = å gjøre om parametre/verdier til en sekvens av bytes som kan sendes i en melding. <b>Unmarshalling</b> = det motsatte. Problemer som må løses:</p>
<h3>1. Ulik datarepresentasjon og byte-rekkefølge</h3>
<p>Et heltall på 4 byte kan lagres <b>big-endian</b> (mest signifikante byte først – «nettverksrekkefølge», SPARC, Java) eller <b>little-endian</b> (minst signifikante først – Intel x86). Sendes bytene rått, kan 5 bli tolket som 83 886 080!</p>
<div class="table-wrap"><table class="center mono">
<tr><th>Verdi 5 som int</th><th>byte 0</th><th>byte 1</th><th>byte 2</th><th>byte 3</th></tr>
<tr><td>Big-endian</td><td>00</td><td>00</td><td>00</td><td>05</td></tr>
<tr><td>Little-endian</td><td>05</td><td>00</td><td>00</td><td>00</td></tr>
</table></div>
<p>Løsning: avtal et felles format i protokollen (f.eks. alltid big-endian). I Java gjør <code>ByteBuffer</code> dette (big-endian som standard) – nøyaktig det prosjekt 1 bruker:</p>
<pre><code><span class="kw">public static byte</span>[] marshallInteger(<span class="kw">int</span> x) {
    <span class="kw">return</span> <span class="ty">ByteBuffer</span>.allocate(<span class="nu">4</span>).putInt(x).array();   <span class="cm">// int = 4 byte</span>
}
<span class="kw">public static int</span> unmarshallInteger(<span class="kw">byte</span>[] data) {
    <span class="kw">return</span> <span class="ty">ByteBuffer</span>.wrap(data).getInt();
}
<span class="kw">public static byte</span>[] marshallString(<span class="ty">String</span> str) { <span class="kw">return</span> str.getBytes(); }
<span class="kw">public static byte</span>[] marshallBoolean(<span class="kw">boolean</span> b) { <span class="kw">return new byte</span>[]{ (<span class="kw">byte</span>)(b ? <span class="nu">1</span> : <span class="nu">0</span>) }; }</code></pre>
<h3>2. Referanser (pekere) gir ikke mening</h3>
<p>Klient og server har <b>ulike adresserom</b>. En peker til adresse 0x1000 hos klienten betyr noe helt annet hos serveren. Løsninger:</p>
<ul>
  <li><b>Kopier inn/kopier ut</b> (copy/restore): send hele datastrukturen (f.eks. en array) som verdi, og kopier evt. endringer tilbake.</li>
  <li>Forby referanser, eller bruk globale referanser (fjernobjekt-referanser som i Java RMI).</li>
</ul>
<div class="callout exam"><span class="ct">Canvas-quiz: «Issues in Remote Procedure Call include»</span>
✔ Byte-rekkefølge kan være forskjellig fordi arkitekturene er forskjellige.<br>
✔ Prosessene kjører i ulike adresserom.<br>
✘ «Access-transparens fordi kommunikasjonen er skjult» – det er et <em>mål</em>, ikke et problem.</div>
<h3>IDL og stub-generering</h3>
<p>I «ekte» RPC-systemer beskrives grensesnittet i et <b>Interface Definition Language (IDL)</b>, og stubbene <b>genereres automatisk</b> av en kompilator. I <b>språkbasert RPC</b> (Java RMI, brukt i prosjekt 3) er grensesnittet et vanlig Java-<code>interface</code>, og stubbene lages av Java. I prosjekt 1 lager vi stubbene <b>manuelt</b> (DisplayStub, SensorStub, …).</p>
`,
      quiz: [
        { q: 'Hvorfor kan man ikke sende en peker (minneadresse) som parameter i RPC?', o: ['Pekere er for store', 'Klient og server har ulike adresserom, så adressen betyr ingenting hos serveren', 'TCP støtter ikke pekere', 'Pekere er alltid null'], a: [1], e: 'Løsning: copy/restore eller globale referanser.' },
        { q: 'Hvor mange byte bruker prosjekt 1 for å marshalle en Java int?', o: ['1', '2', '4', '8'], a: [2], e: 'En Java int er 32 bit = 4 byte (ByteBuffer.allocate(4).putInt(x)).' },
        { q: 'Hva er utfordringer ved RPC?', o: ['Byte-rekkefølgen kan være ulik fordi maskinarkitekturene er ulike', 'Prosessene opererer i ulike adresserom', 'Access-transparens fordi kommunikasjonen er skjult'], a: [0, 1], e: 'Access-transparens er målet, ikke problemet.' },
        { q: 'Hva er et IDL?', o: ['Et språk for å beskrive grensesnitt slik at stubber kan genereres automatisk', 'En type socket', 'En krypteringsalgoritme', 'Et rutingprotokoll'], a: [0], e: 'Interface Definition Language.' }
      ]
    },
    {
      id: 'rpc-3',
      title: 'Synkron vs. asynkron RPC',
      html: `
<p>Tradisjonell RPC er <b>synkron</b>: klienten <b>blokkerer</b> til svaret kommer. RPC er derfor et eksempel på <b>transient, synkron kommunikasjon</b> – begge parter må kjøre samtidig, og ingenting lagres underveis.</p>
<div class="callout"><span class="ct">Hovedmålet med asynkron RPC (mai 2023 9b)</span>
Å bli kvitt den strenge request-reply-oppførselen og la klienten <b>fortsette å jobbe (ikke blokkere)</b> mens den venter på resultatet (om det finnes et).</div>
<h3>Varianter</h3>
<div class="figure"><svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="arS" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="ah"/></marker></defs>
  <text x="150" y="16" text-anchor="middle" class="txa">Synkron RPC</text>
  <line x1="40" y1="40" x2="290" y2="40" class="ln"/><text x="10" y="44" class="txs">Klient</text>
  <line x1="40" y1="100" x2="290" y2="100" class="ln"/><text x="10" y="104" class="txs">Server</text>
  <line x1="70" y1="40" x2="100" y2="100" class="ln" marker-end="url(#arS)"/><rect x="100" y="94" width="110" height="12" class="bxg"/><text x="155" y="122" text-anchor="middle" class="txs">utfører kall</text>
  <line x1="210" y1="100" x2="240" y2="40" class="ln" marker-end="url(#arS)"/>
  <rect x="70" y="34" width="170" height="12" class="bxb"/><text x="155" y="30" text-anchor="middle" class="txb">venter (blokkert)</text>
  <text x="470" y="16" text-anchor="middle" class="txa">Asynkron RPC</text>
  <line x1="360" y1="40" x2="620" y2="40" class="ln"/><text x="330" y="44" class="txs">Klient</text>
  <line x1="360" y1="100" x2="620" y2="100" class="ln"/><text x="330" y="104" class="txs">Server</text>
  <line x1="390" y1="40" x2="420" y2="100" class="ln" marker-end="url(#arS)"/>
  <line x1="425" y1="100" x2="450" y2="40" class="lnd" marker-end="url(#arS)"/><text x="447" y="76" class="txs">ACK</text>
  <rect x="425" y="94" width="130" height="12" class="bxg"/><text x="490" y="122" text-anchor="middle" class="txs">utfører kall</text>
  <rect x="452" y="34" width="150" height="12" class="bxg"/><text x="527" y="30" text-anchor="middle" class="txg">klienten jobber videre</text>
  <text x="320" y="152" text-anchor="middle" class="txa">Utsatt synkron RPC (deferred synchronous)</text>
  <line x1="60" y1="180" x2="620" y2="180" class="ln"/><text x="10" y="184" class="txs">Klient</text>
  <line x1="60" y1="235" x2="620" y2="235" class="ln"/><text x="10" y="239" class="txs">Server</text>
  <line x1="90" y1="180" x2="120" y2="235" class="ln" marker-end="url(#arS)"/><text x="78" y="212" class="txs">request</text>
  <line x1="125" y1="235" x2="150" y2="180" class="lnd" marker-end="url(#arS)"/><text x="146" y="212" class="txs">ACK</text>
  <rect x="125" y="229" width="250" height="12" class="bxg"/><text x="250" y="254" text-anchor="middle" class="txs">utfører kallet</text>
  <rect x="152" y="174" width="270" height="12" class="bxg"/><text x="287" y="170" text-anchor="middle" class="txg">klienten jobber videre</text>
  <line x1="380" y1="235" x2="430" y2="180" class="lna" marker-end="url(#arS)"/><text x="440" y="214" class="txa">callback / enveis-kall med resultat</text>
  <rect x="432" y="174" width="90" height="12" class="bxw"/><text x="477" y="170" text-anchor="middle" class="txs">bruker resultatet</text>
</svg></div>
<div class="table-wrap"><table>
<tr><th>Variant</th><th>Hvordan</th><th>Brukes når</th></tr>
<tr><td><b>Kun ACK</b> (asynkron)</td><td>Serveren sender en kvittering med en gang den mottar forespørselen; klienten fortsetter</td><td>Ingen returverdi trengs (f.eks. starte en jobb, overføre penger uten svar)</td></tr>
<tr><td><b>Utsatt synkron</b> (deferred synchronous)</td><td>To asynkrone kall: klienten får ACK, og serveren leverer resultatet senere via et <b>enveis-kall/callback</b> (avbryter klienten)</td><td>Resultat trengs, men ikke umiddelbart</td></tr>
<tr><td><b>Enveis RPC</b> (one-way)</td><td>Klienten venter ikke engang på ACK</td><td>Upålitelighet er akseptabelt</td></tr>
<tr><td><b>Multicast RPC</b></td><td>Klienten sender (del)oppgaver til flere servere; resultatene kommer tilbake via callbacks</td><td>Parallell jobb, replikerte servere</td></tr>
</table></div>
<h3>Hvordan bygger man det? Tråder + callbacks</h3>
<div class="callout exam"><span class="ct">Juni 2025, oppgave 7 – figuren med klientene A og C og serveren B</span>
<b>a) Gjøre B til asynkron server:</b> B må unngå å blokkere og kunne håndtere mange forespørsler – altså en samtidig server. B bruker <b>flertråding</b> og (eventuelt) en <b>callback-funksjon registrert av klienten</b>. B kan kvittere (ACK) til klienten og gi forespørselen fra A eller C til en <b>ny tråd</b>. Når forespørselen er ferdig, trigger tråden callback-funksjonen som sender svaret tilbake til klienten.<br>
<b>b) Gjøre A og C til asynkrone klienter:</b> siden de trenger svar fra B, må de unngå å blokkere mens de venter. A kan registrere en <b>callback</b> hos B, og <b>starte en ny tråd</b> hver gang en forespørsel sendes, mens hovedprogrammet fortsetter i hovedtråden. B leverer svaret via callbacken.<br>
<em>Svar som bare nevner «send ACK» gir bare noen få poeng!</em></div>
<div class="callout why"><span class="ct">RPC vs. meldingsorientert kommunikasjon (mai 2022 7a)</span>
Tradisjonell RPC er <b>synkron og blokkerende</b> – sender og mottaker må kjøre samtidig for at kallet skal lykkes. Meldingsorientert kommunikasjon er <b>asynkron og ikke-blokkerende</b>, og lar sender og mottaker være <b>løst koblet i tid</b> (f.eks. via en broker/kø).</div>
`,
      quiz: [
        { q: 'RPC er et eksempel på …', o: ['Persistent og synkron kommunikasjon', 'Transient og synkron kommunikasjon', 'Persistent og asynkron kommunikasjon', 'Transient og asynkron kommunikasjon'], a: [1], e: 'Ingen lagring underveis (transient) og klienten blokkerer (synkron).' },
        { q: 'Asynkron RPC kan implementeres ved hjelp av …', o: ['Det er umulig – RPC er alltid synkron', 'Callback som trigger en funksjon hos klienten', 'Flertråding'], a: [1, 2], e: 'Tråder unngår blokkering, callbacks leverer resultatet.' },
        { q: 'Hva er hovedmålet med asynkron RPC?', o: ['Å kryptere kallet', 'Å la klienten fortsette å jobbe i stedet for å blokkere mens den venter på resultatet', 'Å garantere exactly-once', 'Å fjerne behovet for stubber'], a: [1], e: 'Bli kvitt streng request-reply-blokkering.' },
        { q: 'I utsatt synkron (deferred synchronous) RPC – hvordan får klienten resultatet?', o: ['Den blokkerer til resultatet kommer', 'Serveren leverer resultatet senere via et enveis-kall/callback', 'Klienten poller en database', 'Den får det aldri'], a: [1], e: 'To asynkrone kall: ACK først, resultat senere.' },
        { q: 'Hvordan gjør du en RPC-server asynkron?', o: ['Bruk UDP', 'Kvitter forespørselen, gi den til en ny tråd, og send svaret via en callback når tråden er ferdig', 'Gjør serveren tilstandsløs', 'Øk bufferstørrelsen'], a: [1], e: 'Juni 2025 7a.' }
      ]
    }
  ],
  summary: [
    'RPC: la en klientprosess kalle en prosedyre i en ekstern serverprosess som om den var lokal (access-transparens).',
    'Klient-stub: marshaller parametre, sender, venter, unmarshaller svar. Server-stub: unmarshaller, kaller, marshaller svar.',
    '10 steg: klient → stub → OS → nett → OS → stub → server → (tilbake samme vei).',
    'Problemer: ulik byte-rekkefølge (big/little endian), ulike adresserom (pekere), ulike datarepresentasjoner → avtalt format/IDL.',
    'RPC er transient og synkron. MOM er persistent/asynkron og løst koblet i tid.',
    'Asynkron RPC: ACK straks; deferred synchronous: resultat via callback; one-way: ingen ACK; multicast RPC: flere servere + callbacks.',
    'Asynkron server/klient bygges med flertråding + callback-funksjoner.'
  ],
  formulas: [],
  examQA: [
    { q: 'What is the main goal of asynchronous RPC? Describe briefly how it is designed to achieve this goal.', a: 'Goal: get rid of the strict request-reply behaviour and let the client continue working (unblocked) while waiting for the result. Designs: (1) acknowledgement only from server; (2) deferred synchronous calls – multithreading + callback to deliver results when available; (3) multicast RPC – client sends tasks to several servers, results delivered via callbacks.' },
    { q: 'Explain briefly the difference between traditional RPC and message-oriented communication.', a: 'Traditional RPC is synchronous and blocking; sender and receiver must both be running. Message-oriented communication is asynchronous and non-blocking and lets sender and receiver be loosely coupled in time (e.g., via brokers/queues).' },
    { q: 'What is the purpose of multithreading and callbacks in RPC design?', a: 'To avoid blocking by constructing an asynchronous RPC, allowing processes to continue running.' }
  ]
});
