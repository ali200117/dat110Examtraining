DAT110.addModule({
  id: 'transport',
  title: 'Transportlaget: UDP, pålitelig overføring og TCP',
  source: 'Kurose & Ross kap. 3.1–3.5',
  exam: 'Oppgave 1 (demux, sjekksum, rdt, GBN/SR), Oppgave 4 (UDP-segment jan 2024; rdt-mekanismer mai 2024)',
  goals: [
    'Forklare multipleksing/demultipleksing med porter (UDP 2-tuppel, TCP 4-tuppel)',
    'Beskrive UDP-segmentet og regne Internett-sjekksummen (enerkomplement)',
    'Forklare rdt 1.0 → 2.0 → 2.1 → 2.2 → 3.0 og hvorfor hver mekanisme trengs',
    'Regne utnyttelse for stop-and-wait og skille Go-Back-N og Selective Repeat',
    'Forklare TCP: sekvensnummer, kumulative ACK, timeout, fast retransmit, flytkontroll og treveis-håndtrykk'
  ],
  sections: [
    {
      id: 'transport-1',
      title: 'Transportlagets tjeneste og (de)multipleksing',
      html: `
<p>Nettverkslaget (IP) gir <b>logisk kommunikasjon mellom verter</b>. Transportlaget utvider dette til <b>logisk kommunikasjon mellom prosesser</b>. Transportprotokoller kjører <b>bare i endesystemene</b>.</p>
<ul>
  <li><b>Multipleksing</b> (avsender): samle data fra flere sockets, legge på transport-header med portnumre.</li>
  <li><b>Demultipleksing</b> (mottaker): levere dataene i et mottatt segment til <b>riktig socket</b> ved hjelp av header-feltene.</li>
</ul>
<div class="callout exam"><span class="ct">Juni 2025 1b</span>«Delivering the data contained in a transport-segment to the correct socket is called» → <b>Demultiplexing</b>.</div>
<div class="compare">
  <div><h4>UDP-demux (forbindelsesløs)</h4><p>Socket identifiseres av <b>(dest-IP, destport)</b>. Segmenter fra ulike kilder til samme port havner i samme socket.</p></div>
  <div><h4>TCP-demux (forbindelsesorientert)</h4><p>Socket identifiseres av <b>4-tuppel (kilde-IP, kildeport, dest-IP, destport)</b>. En webserver på port 80 har én socket per klientforbindelse.</p></div>
</div>
<div class="callout"><span class="ct">Hva betyr «pålitelig dataoverføring»?</span>Dataene mottakeren får er <b>like</b> dataene avsenderen sendte, og <b>rekkefølgen er bevart</b> – ingen bitfeil, tap, duplikater eller omrokkering. PDU-en på transportlaget heter <b>segment</b>.</div>
`,
      quiz: [
        { q: 'Å levere dataene i et transportsegment til riktig socket kalles …', o: ['Innkapsling', 'Multipleksing', 'Demultipleksing', 'Dekapsling'], a: [2], e: 'Demux på mottakersiden.' },
        { q: 'At transportlaget gir pålitelig dataoverføring betyr …', o: ['Data mottatt = data sendt, og rekkefølgen er bevart', 'Data mottatt = data sendt (rekkefølge uviktig)', 'Mottakeren kan få bare noe av dataene'], a: [0], e: 'Både innhold og rekkefølge.' },
        { q: 'Hva slags pakker utveksles mellom protokollentiteter på transportlaget?', o: ['Datagrammer', 'Rammer', 'Segmenter'], a: [2], e: 'Segment (UDP-litteratur sier av og til «datagram», men Kurose bruker segment).' }
      ]
    },
    {
      id: 'transport-2',
      title: 'UDP og Internett-sjekksummen',
      html: `
<p>UDP legger bare til <b>porter</b> (demux) og en <b>sjekksum</b> (feildeteksjon) oppå IP. Tjenesten er <b>forbindelsesløs</b> og <b>upålitelig</b>: segmenter kan gå tapt, dupliseres eller komme i feil rekkefølge (jan 2024 4a).</p>
<div class="figure"><svg viewBox="0 0 440 150" xmlns="http://www.w3.org/2000/svg">
  <text x="220" y="14" text-anchor="middle" class="txs">32 bit</text>
  <rect x="20" y="20" width="200" height="30" class="bx2"/><text x="120" y="40" text-anchor="middle" class="txs">Source port (16)</text>
  <rect x="220" y="20" width="200" height="30" class="bx2"/><text x="320" y="40" text-anchor="middle" class="txs">Dest. port (16)</text>
  <rect x="20" y="50" width="200" height="30" class="bxw"/><text x="120" y="70" text-anchor="middle" class="txs">Length (16)</text>
  <rect x="220" y="50" width="200" height="30" class="bxw"/><text x="320" y="70" text-anchor="middle" class="txs">Checksum (16)</text>
  <rect x="20" y="80" width="400" height="50" class="bxg"/><text x="220" y="110" text-anchor="middle" class="txs">Application data (message)</text>
</svg><figcaption>UDP-header er bare 8 byte.</figcaption></div>
<div class="table-wrap"><table>
<tr><th>Felt</th><th>Formål (jan 2024 4b)</th></tr>
<tr><td>Source port</td><td>Identifiserer porten på verten segmentet sendes fra (for svar)</td></tr>
<tr><td>Dest. port</td><td>Identifiserer porten på mottakerverten segmentet skal leveres til (demux)</td></tr>
<tr><td>Length</td><td>Total lengde i byte av segmentet (header + data)</td></tr>
<tr><td>Checksum</td><td>Fange opp transmisjonsfeil (bitfeil) i header og data</td></tr>
<tr><td>Application data</td><td>De faktiske dataene som sendes mellom applikasjonene</td></tr>
</table></div>
<div class="callout why"><span class="ct">Hvorfor bruke UDP?</span>Ingen forbindelsesoppsett (ingen RTT-forsinkelse), ingen tilstand i avsender/mottaker, liten header, ingen metningskontroll som bremser. Bra for DNS, strømming, spill, SNMP. Trengs pålitelighet kan applikasjonen legge det til selv.</div>
<h3>Sjekksum-beregning (juni 2025 1d)</h3>
<p>Legg sammen 16-bits (her: 8-bits) ord med <b>wraparound</b> (mente ut av toppen legges til nederst), og ta <b>enerkomplementet</b> (inverter alle bit).</p>
<pre>  01010011
+ 01100110
= 10111001
+ 00110100
= 11101101          (ingen mente ut av toppen)
enerkomplement →  00010010   ← sjekksummen</pre>
<p>Mottakeren legger sammen alle ordene <b>og</b> sjekksummen. Blir resultatet bare 1-ere (11111111), er det ingen oppdaget feil.</p>
<div class="callout warn"><span class="ct">Garanterer korrekt sjekksum at segmentet er feilfritt?</span><b>Nei</b> – bare «med svært høy sannsynlighet». To bitfeil kan oppheve hverandre. Ingen feildeteksjonsteknikk fanger alle feil.</div>
<div class="callout"><span class="ct">Wraparound-eksempel</span>1110 + 1011 = 1 1001 → mente 1 legges til: 1001 + 1 = 1010 → komplement: 0101.</div>
`,
      quiz: [
        { q: 'Gitt bytene 01010011, 01100110, 00110100. Hva er enerkomplementet av summen?', o: ['00000000', '10000100', '00010010'], a: [2], e: 'Sum = 11101101 → invertert = 00010010.' },
        { q: 'En vert mottar et UDP-segment og sjekksummen stemmer. Hva vet mottakeren?', o: ['Segmentet er identisk med det sendte med 100 % sikkerhet', 'Segmentet er likt det sendte med svært høy sannsynlighet'], a: [1], e: 'Noen feilkombinasjoner kan oppheve hverandre.' },
        { q: 'Hvilken tjeneste gir UDP?', o: ['Pålitelig overføring over én link', 'Pålitelig toveis overføring mellom verter', 'Upålitelig ende-til-ende-overføring av datagrammer/segmenter mellom verter'], a: [2], e: 'Forbindelsesløst, tap/duplisering/omrokkering mulig.' },
        { q: 'Hva slags pakke kapsles et UDP-segment inn i når det sendes over Internett?', o: ['En Ethernet-ramme direkte', 'Et IP-datagram', 'Et TCP-segment', 'En HTTP-melding'], a: [1], e: 'UDP-segmentet er data i et IP-datagram (som så ligger i rammer per link).' }
      ]
    },
    {
      id: 'transport-3',
      title: 'Prinsipper for pålitelig overføring (rdt)',
      html: `
<p>Kurose bygger opp en pålitelig protokoll steg for steg over en stadig verre kanal. Poenget er å forstå <b>hvilken mekanisme som løser hvilket problem</b>.</p>
<div class="table-wrap"><table>
<tr><th>Versjon</th><th>Kanalen kan …</th><th>Nye mekanismer</th></tr>
<tr><td><b>rdt1.0</b></td><td>ingenting – perfekt kanal</td><td>Bare send og motta</td></tr>
<tr><td><b>rdt2.0</b></td><td>gi bitfeil</td><td><b>Sjekksum</b> (oppdage feil), <b>ACK/NAK</b> (tilbakemelding), <b>retransmisjon</b>. Stop-and-wait.</td></tr>
<tr><td><b>rdt2.1</b></td><td>bitfeil – også i ACK/NAK!</td><td><b>Sekvensnummer</b> (0/1) så mottaker kan oppdage duplikater når avsender retransmitterer etter ødelagt ACK/NAK</td></tr>
<tr><td><b>rdt2.2</b></td><td>som 2.1</td><td>NAK-fri: mottaker sender <b>ACK med sekvensnummeret</b> til siste korrekte pakke; duplikat-ACK = NAK</td></tr>
<tr><td><b>rdt3.0</b></td><td>bitfeil <b>og tap</b></td><td><b>Timer</b>: avsender retransmitterer hvis ingen ACK innen timeout (alternating-bit protocol)</td></tr>
</table></div>
<div class="callout why"><span class="ct">Hvorfor holder ikke rdt2.0?</span>
Hvis en ACK/NAK blir ødelagt, vet ikke avsenderen hva som skjedde. Den vet sikkert bare at <b>mottakeren fikk <em>et</em> segment</b> (ellers ville den ikke svart). Retransmitterer den bare, kan mottakeren ikke se om pakken er ny eller et duplikat → derfor <b>sekvensnummer</b> i rdt2.1.</div>
<h3>Mekanismene og formålet (mai 2024 4c)</h3>
<div class="table-wrap"><table>
<tr><th>Mekanisme</th><th>Formål</th></tr>
<tr><td><b>Checksum</b></td><td>Oppdage bitfeil i en overført pakke</td></tr>
<tr><td><b>Timer</b></td><td>Time ut og retransmittere en pakke fordi pakken eller ACK-en ble borte i kanalen</td></tr>
<tr><td><b>Sequence number</b></td><td>Sekvensiell nummerering av pakker fra avsender til mottaker. Hull i sekvensnumrene lar mottakeren oppdage tap; duplikate numre lar mottakeren oppdage duplikater</td></tr>
<tr><td><b>Acknowledgement</b></td><td>Mottakeren forteller avsenderen at en pakke er mottatt korrekt. Avsender kan oppdage tap når ACK ikke kommer</td></tr>
<tr><td>NAK</td><td>Mottakeren forteller at en pakke ikke ble mottatt korrekt</td></tr>
<tr><td>Vindu / pipelining</td><td>Avsender kan ha flere ubekreftede pakker «i luften» → bedre utnyttelse</td></tr>
</table></div>
<div class="callout exam"><span class="ct">Jan 2024 1c – tenk selv!</span>
«A network may <b>duplicate</b> datagrams, but there are <b>no</b> transmission errors, loss or overtaking. What mechanism(s) are required?» → Bare <b>sekvensnumre</b> (for å oppdage og forkaste duplikater). Ingen feil → ingen sjekksum; ingen tap → ingen timer/retransmisjon/ACK nødvendig.</div>
`,
      quiz: [
        { q: 'Et nett kan duplisere datagrammer, men har ingen bitfeil, tap eller forbikjøring. Hvilken mekanisme trengs for pålitelig overføring?', o: ['Retransmisjon', 'Sekvensnummer', 'Bekreftelser (ACK)', 'Sjekksum'], a: [1], e: 'Kun duplikater må oppdages → sekvensnummer.' },
        { q: 'Kan rdt2.0 håndtere ødelagte ACK/NAK ved å bare retransmittere den nåværende pakken?', o: ['Ja', 'Nei – mottakeren kan da ikke skille et duplikat fra en ny pakke'], a: [1], e: 'Det er derfor rdt2.1 innfører sekvensnummer.' },
        { q: 'Det er mulig å unngå NAK i rdt2.1 ved å ha sekvensnummer i ACK-en – og fortsatt ha en korrekt protokoll.', o: ['Sant', 'Usant'], a: [0], e: 'Det er rdt2.2: duplikat-ACK betyr «forrige pakke ikke OK».' },
        { q: 'Avsender i rdt2.0 mottar en ødelagt ACK/NAK. Hva vet den sikkert?', o: ['Mottakeren fikk en ødelagt pakke', 'Mottakeren fikk ingen pakke', 'Mottakeren fikk en eller annen pakke'], a: [2], e: 'Mottakeren svarte – altså fikk den noe.' },
        { q: 'Hvilken mekanisme håndterer at pakker eller ACK-er går tapt?', o: ['Sjekksum', 'Timer (timeout og retransmisjon)', 'Portnummer', 'Length-felt'], a: [1], e: 'rdt3.0 legger til timer.' }
      ]
    },
    {
      id: 'transport-4',
      title: 'Pipelining: Go-Back-N og Selective Repeat',
      html: `
<p>Stop-and-wait er tregt: avsenderen sender én pakke og venter en hel RTT. <b>Utnyttelse</b>:</p>
<span class="formula">U_sender = (L/R) / (RTT + L/R)</span>
<div class="callout example"><span class="ct">Eksempel (Kurose)</span>R = 1 Gbit/s, L = 8000 bit, RTT = 30 ms: L/R = 0,008 ms → U = 0,008 / 30,008 ≈ <b>0,00027</b>. Linken står nesten alltid ubrukt! Med pipelining av 3 pakker blir utnyttelsen 3 ganger så høy.</div>
<div class="compare">
  <div><h4>Go-Back-N (GBN)</h4><ul><li>Opptil N ubekreftede pakker i vinduet.</li><li><b>Kumulative ACK</b>: ACK n = «alt t.o.m. n er mottatt».</li><li>Én timer for eldste ubekreftede pakke.</li><li>Ved timeout: send <b>alle</b> ubekreftede pakker på nytt («gå tilbake N»).</li><li>Mottaker forkaster pakker som kommer i feil rekkefølge (ingen buffer).</li></ul></div>
  <div><h4>Selective Repeat (SR)</h4><ul><li>Opptil N ubekreftede pakker.</li><li><b>Individuelle ACK</b> for hver pakke.</li><li>Timer per pakke – retransmitterer bare den som mangler.</li><li>Mottaker <b>bufrer</b> pakker i feil rekkefølge.</li><li>Krav: sekvensnummerrommet ≥ <b>2 × vindusstørrelsen</b>, ellers kan mottaker forveksle gamle og nye pakker.</li></ul></div>
</div>
<div class="callout"><span class="ct">TCP er en hybrid</span>TCP har kumulative ACK (som GBN) men bufrer pakker i feil rekkefølge og retransmitterer typisk bare én pakke (som SR).</div>
`,
      quiz: [
        { q: 'For hvilken protokoll er ACK-ene kumulative?', o: ['Stop-and-wait', 'Selective Repeat', 'Go-Back-N'], a: [2], e: 'GBN (og TCP).' },
        { q: 'Hvilket forhold kreves mellom sekvensnummerrommet og vindusstørrelsen i Selective Repeat?', o: ['Sekvensnummerrommet må være minst dobbelt så stort som vinduet', 'Ingen krav', 'De må være like store'], a: [0], e: 'Ellers kan mottakeren ikke skille retransmisjoner fra nye pakker.' },
        { q: 'R = 1 Gbit/s, L = 8000 bit, RTT = 30 ms. Omtrent hvor stor er stop-and-wait-utnyttelsen?', o: ['0,00027', '0,027', '0,27', '0,5'], a: [0], e: '0,008 ms / 30,008 ms.' },
        { q: 'Hva skjer ved timeout i Go-Back-N?', o: ['Bare den tapte pakken sendes på nytt', 'Alle ubekreftede pakker i vinduet sendes på nytt', 'Forbindelsen lukkes', 'Vinduet dobles'], a: [1], e: '«Go back N».' }
      ]
    },
    {
      id: 'transport-5',
      title: 'TCP: segment, pålitelighet, flytkontroll og forbindelser',
      html: `
<p>TCP gir en <b>pålitelig, ordnet, toveis byte-strøm</b> mellom to prosesser (point-to-point, full dupleks), med flytkontroll og metningskontroll. Forbindelsen opprettes med et <b>treveis håndtrykk</b>.</p>
<h3>Segmentstruktur (viktigste felt)</h3>
<p><b>Source/dest port</b> · <b>Sequence number</b> (nummeret til første <em>byte</em> i segmentet) · <b>Acknowledgment number</b> (neste byte mottakeren forventer) · header length · flagg (<b>SYN, ACK, FIN, RST</b>) · <b>receive window</b> (flytkontroll) · checksum · options.</p>
<div class="callout example"><span class="ct">Sekvens- og ACK-nummer</span>
Host A sender et segment med seq = 92 og 8 byte data (byte 92–99). Host B svarer med <b>ACK = 100</b> – «jeg har fått alt til og med 99, send meg byte 100». ACK-ene er <b>kumulative</b>.</div>
<h3>Timeout og RTT-estimering</h3>
<span class="formula">EstimatedRTT = (1 − α)·EstimatedRTT + α·SampleRTT    (α = 0,125)
DevRTT = (1 − β)·DevRTT + β·|SampleRTT − EstimatedRTT|   (β = 0,25)
TimeoutInterval = EstimatedRTT + 4·DevRTT</span>
<ul>
  <li>Timeout for kort → unødvendige retransmisjoner. For lang → treg reaksjon på tap.</li>
  <li>Ved timeout <b>dobles</b> timeout-intervallet (enkel metningskontroll).</li>
  <li><b>Fast retransmit</b>: <b>3 duplikate ACK</b> for samme byte → retransmitter den manglende pakken umiddelbart, uten å vente på timeren.</li>
</ul>
<h3>Flytkontroll – beskytter mottakeren</h3>
<p>Mottakeren annonserer ledig bufferplass i <b>rwnd</b> (receive window) i hvert segment. Avsender sørger for at <code>LastByteSent − LastByteAcked ≤ rwnd</code>. <b>Formål: hindre at avsenderen oversvømmer mottakerens buffer.</b></p>
<div class="callout warn"><span class="ct">Flytkontroll ≠ metningskontroll</span>Flytkontroll beskytter <b>mottakeren</b>. Metningskontroll (congestion control, cwnd) beskytter <b>nettverket</b>. TCP tolker tap som tegn på metning – men <b>tap er ikke alltid metning</b> (kan være bitfeil på en trådløs link).</div>
<h3>Forbindelseshåndtering</h3>
<div class="figure"><svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="arT" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="aha"/></marker></defs>
  <text x="90" y="16" text-anchor="middle" class="txa">Klient</text><text x="390" y="16" text-anchor="middle" class="txa">Server</text>
  <line x1="90" y1="24" x2="90" y2="190" class="ln"/><line x1="390" y1="24" x2="390" y2="190" class="ln"/>
  <line x1="90" y1="40" x2="390" y2="75" class="lna" marker-end="url(#arT)"/><text x="240" y="48" text-anchor="middle" class="txs">SYN, seq = x</text>
  <line x1="390" y1="90" x2="90" y2="125" class="lna" marker-end="url(#arT)"/><text x="240" y="100" text-anchor="middle" class="txs">SYNACK, seq = y, ack = x+1</text>
  <line x1="90" y1="140" x2="390" y2="175" class="lna" marker-end="url(#arT)"/><text x="240" y="150" text-anchor="middle" class="txs">ACK, ack = y+1 (kan ha data)</text>
</svg><figcaption>Treveis håndtrykk: begge parter blir enige om startsekvensnumrene.</figcaption></div>
<p>Lukking: hver side sender <b>FIN</b> og får ACK. <b>SYN-flood</b>-angrep fyller serveren med halvåpne forbindelser (forsvar: SYN cookies).</p>
`,
      quiz: [
        { q: 'Hva er formålet med flytkontroll?', o: ['Hindre at avsenderen oversvømmer mottakeren med data', 'Sikre pålitelig overføring', 'Redusere segmenttap i nettverket'], a: [0], e: 'rwnd beskytter mottakerbufferet.' },
        { q: 'Tap av transportsegmenter er alltid et tegn på metning i nettet.', o: ['Sant', 'Usant'], a: [1], e: 'Kan også skyldes bitfeil, f.eks. på trådløse linker.' },
        { q: 'Hvilken tjeneste gir TCP?', o: ['Upålitelig overføring av en bytesekvens mellom verter', 'Pålitelig overføring av datagrammer over én link', 'Pålitelig toveis overføring av byte-strømmer mellom verter'], a: [2], e: 'Pålitelig, ordnet, full dupleks byte-strøm.' },
        { q: 'A sender seq = 300 med 50 byte data. Hvilket ACK-nummer sender B hvis alt er mottatt?', o: ['300', '349', '350', '351'], a: [2], e: 'Neste forventede byte = 300 + 50 = 350.' },
        { q: 'Hva utløser TCP fast retransmit?', o: ['Én timeout', '3 duplikate ACK for samme data', 'En FIN', 'At rwnd = 0'], a: [1], e: 'Raskere enn å vente på timeren.' },
        { q: 'Hva er rekkefølgen i TCPs treveis håndtrykk?', o: ['SYN → SYNACK → ACK', 'ACK → SYN → FIN', 'SYN → ACK → SYNACK', 'FIN → ACK → FIN'], a: [0], e: 'Begge sider utveksler og bekrefter startsekvensnummer.' }
      ]
    }
  ],
  summary: [
    'Transportlaget: logisk kommunikasjon mellom prosesser; kjører bare i endesystemene. PDU = segment.',
    'Demultipleksing = levere segmentdata til riktig socket. UDP: (dest-IP, destport). TCP: 4-tuppel.',
    'UDP: forbindelsesløs, upålitelig, 8-byte header (source port, dest port, length, checksum).',
    'Sjekksum: summér ord med wraparound, ta enerkomplement. Korrekt sjekksum = feilfri med høy sannsynlighet.',
    'rdt: sjekksum (bitfeil), ACK/NAK + retransmisjon, sekvensnummer (duplikater), timer (tap). rdt2.2 er NAK-fri.',
    'Stop-and-wait: U = (L/R)/(RTT + L/R). GBN: kumulative ACK, send alt på nytt. SR: individuelle ACK, buffer, seq-rom ≥ 2·vindu.',
    'TCP: seq = første byte, ACK = neste forventede byte (kumulativ). Timeout = EstRTT + 4·DevRTT. Fast retransmit ved 3 dup-ACK.',
    'Flytkontroll (rwnd) beskytter mottaker; metningskontroll beskytter nettet. Treveis håndtrykk SYN, SYNACK, ACK.'
  ],
  formulas: [
    { name: 'Stop-and-wait-utnyttelse', expr: 'U = (L/R) / (RTT + L/R)', note: 'Med n pipelinede pakker: U = n·(L/R) / (RTT + L/R)' },
    { name: 'TCP RTT-estimat', expr: 'EstRTT = 0,875·EstRTT + 0,125·SampleRTT', note: 'α = 0,125' },
    { name: 'TCP DevRTT', expr: 'DevRTT = 0,75·DevRTT + 0,25·|SampleRTT − EstRTT|', note: 'β = 0,25' },
    { name: 'TCP timeout', expr: 'TimeoutInterval = EstRTT + 4·DevRTT', note: '' },
    { name: 'Flytkontroll', expr: 'LastByteSent − LastByteAcked ≤ rwnd', note: '' },
    { name: 'Sjekksum', expr: 'enerkomplement( Σ ord med wraparound )', note: 'Mottaker: Σ ord + sjekksum = 111…1' }
  ],
  examQA: [
    { q: 'Explain briefly what service the UDP protocol provides.', a: 'UDP provides a connectionless transport-layer service where loss, duplication and reordering (overtaking) of segments are possible.' },
    { q: 'Explain the function of the UDP fields Source port, Dest. port, Length, Checksum, Application data.', a: 'Source port: port on the sending host; Dest. port: port on the receiving host where the segment is delivered; Length: total length in bytes of the segment; Checksum: detect transmission errors in header and data; Application data: the actual data exchanged between applications.' },
    { q: 'What are the purposes of checksum, timer, sequence number and acknowledgement in reliable data transfer?', a: 'Checksum: detect bit errors. Timer: time out and retransmit when the packet or its ACK was lost. Sequence number: number packets so gaps reveal loss and duplicates can be detected. Acknowledgement: receiver tells sender a packet was received correctly; missing ACK reveals loss.' },
    { q: 'What kind of packet will a TCP/UDP segment be encapsulated in?', a: 'In an IP datagram at the network layer (whose header contains e.g. the destination IP address).' }
  ]
});
