/* Begrepsliste: [begrep, engelsk, tema, forklaring, eksempel/eksamenstips] */
(function () {
  const D = window.DAT110;
  const G = (term, en, t, def, ex) => D.glossary.push({ term, en, t, def, ex: ex || '' });

  // Internett og forsinkelse
  G('Internett', 'Internet', 'intro', 'Et nettverk av nettverk: en heterogen samling nettverksteknologier koblet sammen med IP.', 'Eksamen: «network-of-networks comprised of a heterogenous collection».');
  G('Protokoll', 'Protocol', 'intro', 'Definerer format og rekkefølge på meldinger mellom enheter, og handlingene som utføres ved sending/mottak.', 'HTTP, TCP, IP, Ethernet.');
  G('Endesystem / vert', 'End system / host', 'intro', 'Datamaskin i nettverkskanten der applikasjoner kjører (PC, server, mobil, IoT).', '');
  G('Nettverkskant', 'Network edge', 'intro', 'Delen av nettet der vertene og applikasjonene befinner seg.', '');
  G('Aksessnett', 'Access network', 'intro', 'Nettet som kobler en vert til første ruter (kantruteren): DSL, kabel, fiber, WiFi, 4G/5G.', '');
  G('Nettverkskjerne', 'Network core', 'intro', 'Mesh av sammenkoblede rutere som videresender pakker.', '');
  G('Pakkesvitsjing', 'Packet switching', 'intro', 'Meldinger deles i pakker som sendes uavhengig; ressurser deles ved behov (statistisk multipleksing). Kø og tap kan oppstå.', 'Internett bruker pakkesvitsjing.');
  G('Linjesvitsjing', 'Circuit switching', 'intro', 'En dedikert krets reserveres ende-til-ende før kommunikasjonen. Garantert ytelse, men sløsing når den er inaktiv.', 'Gammelt telefonnett. FDM/TDM.');
  G('Store-and-forward', 'Store-and-forward', 'intro', 'En ruter må motta hele pakken før den begynner å sende den videre. Gir L/R forsinkelse per link.', '');
  G('Transmisjonsforsinkelse', 'Transmission delay', 'intro', 'Tiden det tar å legge alle bitene i pakken ut på linken: L/R.', 'Avhenger IKKE av avstand.');
  G('Propagasjonsforsinkelse', 'Propagation delay', 'intro', 'Tiden én bit bruker fra den ene enden av linken til den andre: d/s.', 'Avhenger IKKE av pakkestørrelse.');
  G('Prosesseringsforsinkelse', 'Processing delay', 'intro', 'Tid til å lese header, sjekke bitfeil og bestemme utgående link.', '');
  G('Køforsinkelse', 'Queuing delay', 'intro', 'Tid pakken venter i utgående buffer. Varierer med trafikken.', '');
  G('Nodal forsinkelse', 'Nodal delay', 'intro', 'd_proc + d_queue + d_trans + d_prop i én node.', 'Ende-til-ende = sum over nodene som sender.');
  G('Trafikkintensitet', 'Traffic intensity', 'intro', 'La/R: forholdet mellom bit/s som presenteres for linken og linkens rate.', 'Nær 1 → stor kø. > 1 → kø vokser uten grense.');
  G('Gjennomstrømning', 'Throughput', 'intro', 'Raten (bit/s) mottakeren faktisk får data med.', 'Begrenses av flaskehalsen.');
  G('Flaskehalslink', 'Bottleneck link', 'intro', 'Linken med lavest kapasitet på stien – bestemmer ende-til-ende-gjennomstrømningen.', '');
  G('Linkutnyttelse', 'Link utilization', 'intro', 'Faktisk gjennomstrømning delt på linkens kapasitet.', '25/80 = 0,31 (mai 2024).');
  G('ISP', 'Internet Service Provider', 'intro', 'Leverandør av nettilgang. Hierarki: aksess-ISP → regional ISP → tier-1 ISP.', '');
  G('IXP', 'Internet Exchange Point', 'intro', 'Sted der flere ISP-er kobler seg sammen og utveksler trafikk (peering).', '');

  // Lag
  G('Lagdeling', 'Layering', 'layers', 'Organisering av nettverksfunksjonalitet i lag der hvert lag gir en tjeneste til laget over og bruker laget under.', '');
  G('Tjeneste', 'Service', 'layers', 'Det et lag tilbyr laget over (hva). Bestemmer ikke protokollen.', '');
  G('Innkapsling', 'Encapsulation', 'layers', 'Hvert lag legger til sin header når data går nedover i stakken hos avsender.', 'Melding → segment → datagram → ramme.');
  G('Dekapsling', 'Decapsulation', 'layers', 'Hvert lag fjerner sin header når data går oppover hos mottaker.', '');
  G('PDU', 'Protocol Data Unit', 'layers', 'Dataenheten på et lag: melding, segment, datagram, ramme, bit.', '');
  G('TCP/IP-stakken', 'TCP/IP protocol stack', 'layers', 'Fem lag: fysisk, link, nettverk, transport, applikasjon.', 'Rutere: 1–3. Svitsjer: 1–2. Verter: alle.');
  G('OSI-modellen', 'OSI reference model', 'layers', 'Sju-lags modell; har i tillegg presentasjon og sesjon.', '');
  G('Multipleksing', 'Multiplexing', 'layers', 'Samle data fra flere kilder (sockets/protokoller) og merke dem slik at mottakeren kan skille dem.', '');

  // DS-intro
  G('Distribuert system', 'Distributed system', 'ds-intro', 'En samling autonome beregningselementer som for brukerne fremstår som ett sammenhengende system.', '');
  G('Middleware', 'Middleware', 'ds-intro', 'Programvarelag mellom applikasjoner og OS/nettverk som skjuler heterogenitet og tilbyr felles tjenester (kommunikasjon, navngiving, sikkerhet).', 'RPC- og pub-sub-laget i prosjekt 1 og 2.');
  G('Distribusjonstransparens', 'Distribution transparency', 'ds-intro', 'Å skjule at prosesser og ressurser er fysisk distribuert – et «single-system image».', '');
  G('Access-transparens', 'Access transparency', 'ds-intro', 'Skjuler forskjeller i datarepresentasjon og hvordan et objekt aksesseres.', '');
  G('Location-transparens', 'Location transparency', 'ds-intro', 'Skjuler hvor et objekt befinner seg.', '');
  G('Relocation-transparens', 'Relocation transparency', 'ds-intro', 'Skjuler at et objekt flyttes mens det er i bruk.', '');
  G('Migration-transparens', 'Migration transparency', 'ds-intro', 'Skjuler at et objekt kan flyttes til et annet sted.', '');
  G('Replication-transparens', 'Replication transparency', 'ds-intro', 'Skjuler at et objekt er replikert.', '');
  G('Concurrency-transparens', 'Concurrency transparency', 'ds-intro', 'Skjuler at et objekt deles av flere uavhengige brukere.', '');
  G('Failure-transparens', 'Failure transparency', 'ds-intro', 'Skjuler feil og gjenoppretting av et objekt.', '');
  G('Skalerbarhet', 'Scalability', 'ds-intro', 'Evnen til å vokse i størrelse, geografisk utstrekning og administrativt uten å miste ytelse/håndterbarhet.', 'Teknikker: skjule forsinkelse, partisjonere, replikere/cache.');
  G('Åpenhet', 'Openness', 'ds-intro', 'Komponenter kan lett brukes i/integreres med andre systemer: interoperabilitet, portabilitet, utvidbarhet.', '');
  G('IaaS', 'Infrastructure as a Service', 'ds-intro', 'Skymodell der kunden leier virtuelle maskiner, lagring og nett.', 'Amazon EC2.');
  G('PaaS', 'Platform as a Service', 'ds-intro', 'Skymodell der kunden utvikler og deployer egen kode på en ferdig plattform.', 'Google App Engine.');
  G('SaaS', 'Software as a Service', 'ds-intro', 'Skymodell der kunden bruker en ferdig applikasjon over nettet.', 'Gmail.');
  G('Rapid elasticity', 'Rapid elasticity', 'ds-intro', 'Skyegenskap: ressurser skaleres raskt opp og ned etter behov → skalerbarhet.', '');
  G('Virtualisering', 'Virtualization', 'ds-intro', 'En hypervisor kjører flere isolerte VM-er på én fysisk maskin.', 'VM-er kan migreres.');
  G('Round robin', 'Round robin', 'ds-intro', 'Lastbalansering der serverne velges etter tur uten å se på last.', '');

  // Applikasjon
  G('Klient-server', 'Client-server', 'app', 'Arkitektur med en alltid-på server og klienter som kommuniserer med den.', '');
  G('Peer-to-peer (P2P)', 'Peer-to-peer', 'app', 'Arkitektur der likeverdige noder kommuniserer direkte; selvskalerende.', 'BitTorrent, Chord.');
  G('Socket', 'Socket', 'app', 'Grensesnitt («dør») mellom en prosess og transportlaget. Endepunkt = IP-adresse + port.', '');
  G('Portnummer', 'Port number', 'app', '16-bits tall som identifiserer en prosess/socket på en vert.', 'HTTP 80, HTTPS 443, DNS 53.');
  G('HTTP', 'HyperText Transfer Protocol', 'app', 'Tilstandsløs request-response-protokoll for web over TCP.', 'Metoder: GET, POST, PUT, DELETE, HEAD.');
  G('Persistent HTTP', 'Persistent HTTP', 'app', 'Én TCP-forbindelse brukes til flere objekter.', '');
  G('Cookie', 'Cookie', 'app', 'Liten tilstandsinformasjon som lar en tilstandsløs server huske klienten.', '');
  G('Web-cache / proxy', 'Web cache / proxy server', 'app', 'Svarer på HTTP-forespørsler på vegne av opprinnelsesserveren for å redusere responstid og trafikk.', '');
  G('Conditional GET', 'Conditional GET', 'app', 'GET med If-Modified-Since; serveren svarer 304 Not Modified hvis uendret.', 'Wireshark-laben.');
  G('Content-Type', 'Content-Type', 'app', 'HTTP-header som angir formatet på entity body.', 'application/json');
  G('Idempotent', 'Idempotent', 'app', 'En operasjon som gir samme resultat om den utføres én eller flere ganger.', 'GET, PUT, DELETE er idempotente; POST er ikke.');
  G('DNS', 'Domain Name System', 'app', 'Distribuert, hierarkisk database som oversetter vertsnavn til IP-adresser.', 'Rot → TLD → autoritativ; lokal resolver.');
  G('Iterativ navneoppløsning', 'Iterative name resolution', 'app', 'Hver server svarer med en henvisning; den lokale resolveren spør videre selv.', '');
  G('Rekursiv navneoppløsning', 'Recursive name resolution', 'app', 'Hver server spør videre på vegne av den som spurte og returnerer endelig svar.', 'Mer last på høye nivåer, bedre caching.');
  G('Autoritativ navneserver', 'Authoritative name server', 'app', 'Organisasjonens DNS-server som har de faktiske navn→IP-postene.', '');
  G('TLD-server', 'Top-Level Domain server', 'app', 'DNS-server for .com, .no osv. som vet hvilke autoritative servere som har ansvar.', '');
  G('Ressurspost (RR)', 'Resource record', 'app', 'DNS-post (navn, verdi, type, TTL). Typer: A, NS, CNAME, MX.', '');

  // Prosesser
  G('Tråd', 'Thread', 'proc', 'Utførelsesflyt i en prosess; deler adresserom med andre tråder i prosessen.', '');
  G('Context switch', 'Context switch', 'proc', 'Bytte av hvilken prosess/tråd som kjører. Billigere for tråder enn prosesser.', '');
  G('Dispatcher/worker', 'Dispatcher/worker model', 'proc', 'En dispatcher-tråd tar imot forespørsler og deler dem ut til worker-tråder.', '');
  G('Iterativ server', 'Iterative server', 'proc', 'Håndterer én forespørsel om gangen.', '');
  G('Samtidig server', 'Concurrent server', 'proc', 'Gir hver forespørsel til en egen tråd/prosess og tar straks imot neste.', '');
  G('Stateless server', 'Stateless server', 'proc', 'Holder ingen informasjon om klientenes tilstand.', 'HTTP-server.');
  G('Stateful server', 'Stateful server', 'proc', 'Holder vedvarende informasjon om klientene.', 'Filserver med åpne filer.');
  G('Soft state', 'Soft state', 'proc', 'Tilstand serveren bare lover å holde en begrenset tid.', '');
  G('Serverklynge', 'Server cluster', 'proc', 'Maskiner koblet med raskt nett; ofte logisk svitsj → app-servere → distribuert lagring.', '');
  G('Superserver', 'Superserver (inetd)', 'proc', 'Lytter på mange porter og starter riktig server ved behov.', '');

  // RPC
  G('RPC', 'Remote Procedure Call', 'rpc', 'Lar en klientprosess kalle en prosedyre i en ekstern serverprosess som om den var lokal.', 'Transient og synkron.');
  G('Klient-stub', 'Client stub (proxy)', 'rpc', 'Lokal representant for fjernprosedyren: marshaller parametre, sender, venter, unmarshaller svar.', 'DisplayStub i prosjekt 1.');
  G('Server-stub', 'Server stub (skeleton)', 'rpc', 'Mottar request, unmarshaller, kaller implementasjonen, marshaller svaret.', 'RPCRemoteImpl.invoke.');
  G('Marshalling', 'Marshalling', 'rpc', 'Gjøre om parametre/verdier til en bytesekvens som kan sendes.', 'ByteBuffer.putInt i prosjekt 1.');
  G('Unmarshalling', 'Unmarshalling', 'rpc', 'Gjøre om bytes tilbake til verdier.', '');
  G('Big-endian / little-endian', 'Byte order', 'rpc', 'Rekkefølgen bytene i et flerbyte-tall lagres i. Må avtales i RPC.', '');
  G('IDL', 'Interface Definition Language', 'rpc', 'Språk for å beskrive grensesnitt slik at stubber kan genereres automatisk.', '');
  G('Asynkron RPC', 'Asynchronous RPC', 'rpc', 'Klienten blokkerer ikke; serveren kvitterer straks.', '');
  G('Deferred synchronous RPC', 'Deferred synchronous RPC', 'rpc', 'Klienten får ACK, og resultatet leveres senere via callback/enveis-kall.', '');
  G('Callback', 'Callback', 'rpc', 'Funksjon klienten registrerer, som kalles når resultatet er klart.', '');
  G('Java RMI', 'Java Remote Method Invocation', 'rpc', 'Språkbasert RPC i Java; brukt mellom nodene i prosjekt 3.', '');

  // MOM
  G('Persistent kommunikasjon', 'Persistent communication', 'mom', 'Middleware lagrer meldingen til den er levert.', 'E-post, meldingskø.');
  G('Transient kommunikasjon', 'Transient communication', 'mom', 'Meldingen lagres bare mens avsender og mottaker kjører.', 'Sockets, RPC.');
  G('Synkron kommunikasjon', 'Synchronous communication', 'mom', 'Avsenderen blokkeres til forespørselen er kjent akseptert.', '');
  G('Asynkron kommunikasjon', 'Asynchronous communication', 'mom', 'Avsenderen fortsetter straks etter å ha levert meldingen.', '');
  G('Meldingskø', 'Message queue', 'mom', 'Kø i middleware der meldinger lagres til mottakeren henter dem (PUT, GET, POLL, NOTIFY).', '');
  G('Meldingsbroker', 'Message broker', 'mom', 'Applikasjonsnivå-gateway som transformerer meldingsformater og ruter meldinger (f.eks. etter emne).', '');
  G('Publish-subscribe', 'Publish-subscribe', 'mom', 'Utgivere publiserer på emner; abonnenter får meldinger på emner de abonnerer på. Romlig (og tidsmessig) avkobling.', 'Prosjekt 2.');
  G('Topic', 'Topic', 'mom', 'Navngitt kanal/emne meldinger publiseres på.', '');
  G('Stopable-tråd', 'Stopable thread', 'mom', 'Tråd i prosjekt 2 som kjører doProcess() i løkke til doStop() kalles.', 'Broker og Dispatcher.');
  G('Dispatcher (prosjekt 2)', 'Dispatcher', 'mom', 'Prosesserer meldinger fra klientsesjonene og kaller onConnect, onSubscribe, onPublish …', '');
  G('Storage (prosjekt 2)', 'Storage', 'mom', 'Lagrer tilkoblede klienter (user → ClientSession) og abonnementer (topic → Set<user>).', '');

  // Multicast
  G('Overlay-nettverk', 'Overlay network', 'mcast', 'Logisk nett av prosesser oppå det fysiske nettet.', '');
  G('Applikasjonsnivå-multicast', 'Application-level multicasting', 'mcast', 'Prosessene videresender multicast selv i et overlay (tre/mesh), ikke ruterne.', '');
  G('Link stress', 'Link stress', 'mcast', 'Hvor mange ganger samme pakke krysser samme fysiske link.', '');
  G('Stretch / RDP', 'Relative Delay Penalty', 'mcast', 'Forsinkelse langs overlay-stien delt på beste fysiske forsinkelse.', 'RDP = 1 er perfekt.');
  G('Tree cost', 'Tree cost', 'mcast', 'Summen av kostnadene på alle kantene i et multicast-tre.', '');
  G('Flooding', 'Flooding', 'mcast', 'Hver node sender meldingen videre til alle naboer. Antall meldinger ≈ antall kanter.', 'p·N(N−1)/2.');
  G('Probabilistisk flooding', 'Probabilistic flooding', 'mcast', 'Hver node videresender bare med sannsynlighet p – færre meldinger.', '');
  G('Gossip / epidemisk protokoll', 'Gossip / epidemic protocol', 'mcast', 'Noder sprer oppdateringer til tilfeldige andre noder (push, pull, push-pull).', '');
  G('Anti-entropi', 'Anti-entropy', 'mcast', 'To noder utveksler oppdateringer (push, pull eller push-pull) til alle er like.', '');
  G('Rykte-spredning', 'Rumor spreading', 'mcast', 'Gossip der noden slutter å spre med sannsynlighet 1/k når den treffer en som allerede vet.', '');
  G('Dødssertifikat', 'Death certificate', 'mcast', 'Spredt markering av at et element er slettet, så gamle kopier ikke gjenopplives.', '');

  // Transport
  G('Demultipleksing', 'Demultiplexing', 'transport', 'Levere dataene i et mottatt segment til riktig socket.', 'Juni 2025 1b.');
  G('UDP', 'User Datagram Protocol', 'transport', 'Forbindelsesløs, upålitelig transportprotokoll med porter og sjekksum. 8-byte header.', '');
  G('TCP', 'Transmission Control Protocol', 'transport', 'Forbindelsesorientert, pålitelig, ordnet byte-strøm med flyt- og metningskontroll.', '');
  G('Sjekksum', 'Checksum', 'transport', 'Enerkomplementet av summen (med wraparound) av ordene; brukes til å oppdage bitfeil.', '');
  G('ACK / NAK', 'Acknowledgement / negative ACK', 'transport', 'Mottakerens tilbakemelding om at en pakke er mottatt riktig / feil.', '');
  G('Sekvensnummer', 'Sequence number', 'transport', 'Nummerering av pakker/byte; lar mottakeren oppdage tap og duplikater.', '');
  G('Timer / timeout', 'Timer / timeout', 'transport', 'Avsender retransmitterer hvis ACK ikke kommer innen tiden.', '');
  G('Stop-and-wait', 'Stop-and-wait', 'transport', 'Send én pakke og vent på ACK før neste. Lav utnyttelse.', '');
  G('Pipelining', 'Pipelining', 'transport', 'Flere ubekreftede pakker «i luften» samtidig.', '');
  G('Go-Back-N', 'Go-Back-N', 'transport', 'Pipelining med kumulative ACK; ved timeout sendes alle ubekreftede pakker på nytt.', '');
  G('Selective Repeat', 'Selective Repeat', 'transport', 'Pipelining med individuelle ACK og buffer hos mottaker; bare tapte pakker sendes på nytt.', 'Seq-rom ≥ 2 · vindu.');
  G('Kumulativ ACK', 'Cumulative ACK', 'transport', 'ACK n betyr at alt til og med n (TCP: før n) er mottatt.', '');
  G('Fast retransmit', 'Fast retransmit', 'transport', 'TCP retransmitterer etter 3 duplikate ACK uten å vente på timeout.', '');
  G('Flytkontroll', 'Flow control', 'transport', 'Hindrer at avsenderen oversvømmer mottakerens buffer (rwnd).', '');
  G('Metningskontroll', 'Congestion control', 'transport', 'Hindrer at avsendere overbelaster nettet (cwnd).', '');
  G('Treveis håndtrykk', 'Three-way handshake', 'transport', 'SYN, SYNACK, ACK – oppretter TCP-forbindelse og avtaler startsekvensnummer.', '');

  // Nettverkslaget
  G('Forwarding', 'Forwarding', 'network', 'Lokal handling: flytte en pakke fra input-link til riktig output-link via videresendingstabellen.', '');
  G('Routing', 'Routing', 'network', 'Nettverksomfattende prosess som beregner least-cost-stier og fyller videresendingstabellene.', '');
  G('Videresendingstabell', 'Forwarding table', 'network', 'Tabell i ruteren: destinasjonsprefiks → utgående grensesnitt.', '');
  G('Best effort', 'Best-effort service', 'network', 'IP gir ingen garantier om levering, rekkefølge eller forsinkelse.', '');
  G('IPv4-datagram', 'IPv4 datagram', 'network', 'Pakke på nettverkslaget med 20-byte header (uten options).', '');
  G('TTL', 'Time-to-live', 'network', 'Header-felt som dekrementeres i hver ruter; ved 0 droppes datagrammet (hindrer løkker).', '');
  G('Upper-layer protocol', 'Upper-layer protocol field', 'network', 'IP-headerfelt som angir transportprotokollen i datafeltet (6 = TCP, 17 = UDP).', '');
  G('MTU', 'Maximum Transfer Unit', 'network', 'Største datamengde en link-ramme kan bære. Ethernet: 1500 byte.', '');
  G('Fragmentering', 'Fragmentation', 'network', 'Oppdeling av et datagram som er større enn MTU; reassembleres i målverten.', 'Identifier, flags, offset (8-byte-enheter).');
  G('Fragmentation offset', 'Fragmentation offset', 'network', 'Hvor i det opprinnelige datagrammet fragmentets data hører hjemme, i enheter à 8 byte.', '');
  G('IP-adresse', 'IP address', 'network', '32-bits adresse som tildeles et nettverksgrensesnitt.', 'Dotted decimal.');
  G('Subnett', 'Subnet', 'network', 'Grensesnitt med samme nettverksprefiks som kan nå hverandre uten ruter.', '');
  G('CIDR', 'Classless InterDomain Routing', 'network', 'Adressering a.b.c.d/x der x er prefikslengden. 2^(32−x) adresser.', '');
  G('Longest prefix match', 'Longest prefix matching', 'network', 'Ved flere treff i videresendingstabellen brukes det lengste (mest spesifikke) prefikset.', '');
  G('DHCP', 'Dynamic Host Configuration Protocol', 'network', 'Gir en vert automatisk IP-adresse (+ maske, gateway, DNS). Discover, offer, request, ACK.', '');
  G('NAT', 'Network Address Translation', 'network', 'Ruter som lar mange private adresser dele én offentlig IP ved å oversette (IP, port).', '');
  G('IPv6', 'IPv6', 'network', '128-bits adresser, fast 40-byte header, ingen fragmentering i rutere.', '');
  G('Default gateway', 'Default gateway', 'network', 'Første-hopp-ruteren en vert sender til når målet er i et annet subnett.', '');

  // Routing
  G('Link-state-ruting', 'Link-state routing', 'routing', 'Alle rutere kjenner hele topologien (flooding) og kjører Dijkstra.', 'OSPF.');
  G('Distance-vector-ruting', 'Distance-vector routing', 'routing', 'Hver ruter kjenner bare naboene og oppdaterer med Bellman-Ford basert på naboenes vektorer.', 'RIP.');
  G('Bellman-Ford-likningen', 'Bellman-Ford equation', 'routing', 'D_x(y) = min_v { c(x,v) + D_v(y) }.', '');
  G('Dijkstras algoritme', "Dijkstra's algorithm", 'routing', 'Beregner korteste stier fra én kilde ved å legge til nærmeste ukjente node i hvert steg.', 'O(n²).');
  G('Count-to-infinity', 'Count-to-infinity', 'routing', 'DV-problem der dårlige nyheter (kostnadsøkning) spres sakte og rutere teller opp.', 'Poisoned reverse hjelper.');
  G('Poisoned reverse', 'Poisoned reverse', 'routing', 'Ruter som går via nabo y forteller y at avstanden er ∞, for å unngå løkker.', '');
  G('Autonomt system (AS)', 'Autonomous system', 'routing', 'Nett under én administrasjon; ruting deles i intra-AS og inter-AS.', '');
  G('OSPF', 'Open Shortest Path First', 'routing', 'Intra-AS link-state-protokoll, hierarkisk med områder.', '');
  G('BGP', 'Border Gateway Protocol', 'routing', 'Inter-AS path-vector-protokoll; policy-basert (AS-PATH, NEXT-HOP, hot potato).', '');
  G('ICMP', 'Internet Control Message Protocol', 'routing', 'Feilrapportering og diagnostikk (ping, traceroute).', '');

  // Link
  G('Ramme', 'Frame', 'link', 'PDU på linklaget: header (MAC-adresser, type) + data + trailer (CRC).', '');
  G('MAC-adresse', 'MAC / LAN address', 'link', '48-bits flat adresse brent inn i nettverkskortet.', 'Broadcast FF:FF:FF:FF:FF:FF.');
  G('ARP', 'Address Resolution Protocol', 'link', 'Finner MAC-adressen til en IP-adresse i samme subnett (query broadcast, reply unicast).', '');
  G('ARP-tabell', 'ARP table', 'link', 'Tabell i vert/ruter: IP-adresse → MAC-adresse (med TTL).', '');
  G('Svitsjetabell', 'Switch table', 'link', 'Tabell i svitsj: MAC-adresse → port (lært fra kilde-MAC).', '');
  G('Selvlærende svitsj', 'Self-learning switch', 'link', 'Svitsj som lærer port for hver kilde-MAC og filtrerer/videresender/flooder.', '');
  G('Hub', 'Hub', 'link', 'Fysisk-lags enhet som kringkaster hvert bit på alle porter.', 'Ett kollisjonsdomene.');
  G('CRC', 'Cyclic Redundancy Check', 'link', 'Feildeteksjon basert på modulo-2-divisjon med en generator; brukes i Ethernet.', '');
  G('Paritetsbit', 'Parity bit', 'link', 'En ekstra bit som gjør antall 1-ere partall; oppdager odde antall bitfeil.', '');
  G('CSMA', 'Carrier Sense Multiple Access', 'link', 'Random access: lytt før du sender. Kollisjoner mulig pga. propagasjonsforsinkelse.', '');
  G('CSMA/CD', 'CSMA with Collision Detection', 'link', 'Avbryt ved kollisjon og vent tilfeldig (binær eksponentiell backoff).', 'Klassisk Ethernet.');
  G('TDM / FDM', 'Time/Frequency Division Multiplexing', 'link', 'Kanalpartisjonering i tidsluker eller frekvensbånd – ingen kollisjoner.', '');
  G('Ethernet', 'Ethernet', 'link', 'Dominerende kablet LAN-teknologi; forbindelsesløs og upålitelig.', '');
  G('Type-felt (Ethernet)', 'Ethernet type field', 'link', 'Angir hvilken protokoll fra laget over som ligger i datafeltet (IP, ARP).', '');

  // Navngiving
  G('Navn', 'Name', 'naming', 'Streng som refererer til en entitet.', '');
  G('Adresse', 'Address', 'naming', 'Navnet på et aksesspunkt til en entitet.', '');
  G('Identifikator', 'Identifier', 'naming', 'Navn som refererer til høyst én entitet, hver entitet har høyst én, og som aldri gjenbrukes.', '');
  G('Stedsuavhengig navn', 'Location-independent name', 'naming', 'Navn som er uavhengig av entitetens adresse.', 'Domenenavn.');
  G('Navnerom', 'Name space', 'naming', 'Alle gyldige navn som gjenkjennes og håndteres av en tjeneste.', '');
  G('Flat navngiving', 'Flat naming', 'naming', 'Navn uten struktur (f.eks. bitstrenger); løses med broadcasting, forwarding pointers, home-based, DHT.', '');
  G('Forwarding pointers', 'Forwarding pointers', 'naming', 'En flyttet entitet etterlater en peker til ny plass. Lange kjeder, brudd.', '');
  G('Home-based', 'Home-based approach', 'naming', 'En fast hjemmeadresse holder oversikt over hvor entiteten er. Dårlig geografisk skalerbarhet.', 'Mobile IP.');
  G('DHT', 'Distributed Hash Table', 'naming', 'Strukturert P2P-system der nøkler og noder deler identifikatorrom og oppslag gjøres effektivt.', 'Chord.');
  G('Chord', 'Chord', 'naming', 'DHT med ring mod 2^m; nøkkel k lagres hos succ(k); fingertabeller gir O(log N) oppslag.', '');
  G('succ(k)', 'Successor', 'naming', 'Første node med ID ≥ k (med urviseren, wrap rundt).', '');
  G('Fingertabell', 'Finger table', 'naming', 'FT_p[i] = succ(p + 2^(i−1)) mod 2^m. Snarveier til eksponentielt fjerne noder.', '');
  G('Adresserom', 'Address space', 'naming', '2^m mulige identifikatorer. MD5 → 2^128.', '');

  // Klokker
  G('Clock skew', 'Clock skew', 'clocks', 'Forskjellen i tid mellom to klokker.', '');
  G('UTC', 'Coordinated Universal Time', 'clocks', 'Verdens tidsstandard, basert på atomklokker.', '');
  G('Accuracy', 'Accuracy', 'clocks', 'Avviket mellom en maskins klokke og en ekstern referanse (UTC) holdes innenfor en grense.', 'Ekstern synkronisering.');
  G('Precision', 'Precision', 'clocks', 'Avviket mellom klokkene til maskiner i systemet holdes innenfor en grense.', 'Intern synkronisering.');
  G('NTP / Cristian', 'Network Time Protocol', 'clocks', 'Klient spør tidsserver og justerer for nettverksforsinkelse.', 'θ = ((T2−T1)+(T3−T4))/2.');
  G('Berkeley-algoritmen', 'Berkeley algorithm', 'clocks', 'Tidsdemon spør alle, tar gjennomsnitt, ber hver justere seg.', '');
  G('Happens-before (→)', 'Happens-before relation', 'clocks', 'a → b hvis samme prosess og a før b, eller a er send og b mottak av samme melding, eller transitivt.', '');
  G('Samtidige hendelser', 'Concurrent events', 'clocks', 'Hendelser der verken a → b eller b → a.', '');
  G('Lamport-klokke', 'Lamport logical clock', 'clocks', 'Teller per prosess: +1 før hver hendelse, mottak: max(lokal, ts)+1.', 'a→b ⇒ C(a)<C(b).');
  G('Vektorklokke', 'Vector clock', 'clocks', 'Vektor med én teller per prosess; fanger kausalitet: V(a) < V(b) ⇔ a → b.', '');
  G('Totalt ordnet multicast', 'Totally ordered multicast', 'clocks', 'Alle meldinger leveres i samme rekkefølge hos alle mottakere (via Lamport-tid + ACK).', '');

  // Mutex
  G('Kritisk region', 'Critical section', 'mutex', 'Kodedel der en delt ressurs brukes; bare én prosess om gangen.', '');
  G('Sentralisert mutex', 'Centralized mutual exclusion', 'mutex', 'En koordinator gir tillatelse. 3 meldinger; ett feilpunkt.', '');
  G('Distribuert mutex (Ricart-Agrawala)', 'Distributed mutual exclusion', 'mutex', 'Request til alle med Lamport-tid; lavest vinner; OK fra alle. 2(N−1) meldinger, N feilpunkter.', 'Prosjekt 3.');
  G('Token ring', 'Token ring algorithm', 'mutex', 'Et token sirkulerer i en logisk ring; den med token får gå inn.', 'Tapt token er problemet.');
  G('Desentralisert mutex', 'Decentralized mutual exclusion', 'mutex', 'Flertall (m > N/2) av koordinatorene til replikaene må stemme ja.', '');
  G('Bully-algoritmen', 'Bully algorithm', 'mutex', 'Valg der ELECTION sendes til høyere ID-er; høyeste levende blir koordinator.', '');
  G('Ring-valg', 'Ring election algorithm', 'mutex', 'ELECTION-melding samler ID-er rundt ringen; høyeste ID blir koordinator.', '');

  // Konsistens
  G('Replikering', 'Replication', 'consistency', 'Flere kopier av data/prosesser for pålitelighet, ytelse, skalerbarhet og tilgjengelighet.', '');
  G('Konsistensmodell', 'Consistency model', 'consistency', 'Kontrakt mellom prosesser og datalager om hva lesinger kan returnere.', '');
  G('Continuous consistency', 'Continuous consistency', 'consistency', 'Måler og spesifiserer tålt inkonsistens: numerisk, alder (staleness) og ordning.', '');
  G('Sekvensiell konsistens', 'Sequential consistency', 'consistency', 'Alle prosesser ser alle operasjoner i samme sekvensielle rekkefølge (programrekkefølge per prosess).', '');
  G('Kausal konsistens', 'Causal consistency', 'consistency', 'Kausalt relaterte skrivinger ses i samme rekkefølge av alle; samtidige kan variere.', '');
  G('Datasentrisk konsistens', 'Data-centric consistency', 'consistency', 'Systemomfattende konsistens for alle replikaer.', '');
  G('Klientsentrisk konsistens', 'Client-centric consistency', 'consistency', 'Konsistens for én klient som beveger seg mellom replikaer.', '');
  G('Eventual consistency', 'Eventual consistency', 'consistency', 'Uten nye oppdateringer blir alle replikaer etter hvert like.', '');
  G('Monotonic reads', 'Monotonic reads', 'consistency', 'Har en prosess lest en verdi, ser den aldri en eldre senere.', '');
  G('Monotonic writes', 'Monotonic writes', 'consistency', 'En prosess sine skrivinger på x fullføres i rekkefølge.', '');
  G('Read your writes', 'Read your writes', 'consistency', 'En prosess ser alltid effekten av sine egne skrivinger.', 'Passordendring.');
  G('Writes follow reads', 'Writes follow reads', 'consistency', 'En skriving etter en lesing skjer på en minst like ny verdi.', '');
  G('Primary-based protokoll', 'Primary-based protocol', 'consistency', 'Bare én prosess (primæren) kan skrive et dataelement (single-leader).', 'Remote-write, local-write.');
  G('Remote-write', 'Remote-write protocol', 'consistency', 'Alle skrivinger videresendes til en fast primær som oppdaterer backupene. Gir sekvensiell konsistens.', 'Prosjekt 3.');
  G('Local-write', 'Local-write protocol', 'consistency', 'Primærkopien flytter til prosessen som vil skrive.', '');
  G('Replicated-write protokoll', 'Replicated-write protocol', 'consistency', 'Skrivinger kan utføres på flere replikaer (multi-leader).', 'Aktiv replikering, quorum.');
  G('Aktiv replikering', 'Active replication', 'consistency', 'Operasjonen sendes til alle replikaer; krever total orden.', '');
  G('Quorum-basert protokoll', 'Quorum-based protocol', 'consistency', 'Majoritetsavstemning: N_R + N_W > N og N_W > N/2.', '');
  G('Cache-koherens', 'Cache coherence', 'consistency', 'Å holde cachede kopier konsistente, f.eks. ved invalidering fra serveren.', '');

  // Feiltoleranse
  G('Dependability', 'Dependability', 'fault', 'Availability, reliability, safety, maintainability.', '');
  G('Availability', 'Availability', 'fault', 'Sannsynligheten for at systemet fungerer på et gitt tidspunkt.', '');
  G('Reliability', 'Reliability', 'fault', 'Systemet kjører kontinuerlig uten feil over et tidsintervall.', '');
  G('Fault / error / failure', 'Fault, error, failure', 'fault', 'Årsak → feil tilstand → systemet leverer ikke det det lover.', '');
  G('Feiltolerant', 'Fault tolerant', 'fault', 'Kan fortsette å operere selv om det finnes feil.', '');
  G('Crash failure', 'Crash failure', 'fault', 'Serveren stopper, men fungerte riktig fram til da.', '');
  G('Omission failure', 'Omission failure', 'fault', 'Serveren svarer ikke på forespørsler / sender ikke meldinger.', '');
  G('Timing failure', 'Timing failure', 'fault', 'Svaret kommer utenfor spesifisert tidsintervall.', '');
  G('Response failure', 'Response failure', 'fault', 'Svaret er feil (verdi eller tilstandsovergang).', '');
  G('Bysantinsk feil', 'Arbitrary / Byzantine failure', 'fault', 'Vilkårlige (evt. ondsinnede) svar til vilkårlige tider.', '3k+1 for enighet.');
  G('k-feiltolerant', 'k-fault tolerant', 'fault', 'Systemet overlever at k komponenter feiler.', 'k+1 / 2k+1 / 3k+1.');
  G('Flat gruppe', 'Flat group', 'fault', 'Lederløs prosessgruppe der beslutninger tas kollektivt.', 'Replicated-write.');
  G('Hierarkisk gruppe', 'Hierarchical group', 'fault', 'Prosessgruppe med en valgt koordinator og arbeidere.', 'Primary-based.');
  G('Orphan', 'Orphan computation', 'fault', 'Beregning hos serveren som ingen klient venter på (klienten krasjet).', '');
  G('At-least-once', 'At-least-once semantics', 'fault', 'Operasjonen utføres minst én gang (kan dupliseres).', '');
  G('At-most-once', 'At-most-once semantics', 'fault', 'Operasjonen utføres høyst én gang (kan mangle).', '');
  G('Feedback implosion', 'Feedback implosion', 'fault', 'Avsenderen oversvømmes av ACK/NACK i pålitelig multicast.', '');
  G('Feedback suppression', 'Feedback suppression', 'fault', 'Mottakere venter tilfeldig og dropper egen NACK hvis noen andre allerede har sendt den.', '');
  G('FIFO-ordning', 'FIFO-ordered multicast', 'fault', 'Meldinger fra samme avsender leveres i sendt rekkefølge.', '');
  G('Atomisk multicast', 'Atomic multicast', 'fault', 'Meldingen leveres til alle eller ingen, i samme rekkefølge.', '');

  // Sikkerhet
  G('Konfidensialitet', 'Confidentiality', 'security', 'Bare avsender og tiltenkt mottaker forstår innholdet.', 'Kryptering.');
  G('Integritet', 'Integrity', 'security', 'Data er ikke endret uten at det oppdages.', 'MAC, signatur.');
  G('Autentisering', 'Authentication', 'security', 'Bekrefte identiteten til en part.', '');
  G('Autorisasjon', 'Authorization', 'security', 'Kontroll av hva en (autentisert) part har lov til.', '');
  G('Non-repudiation', 'Non-repudiation', 'security', 'Avsenderen kan ikke benekte å ha sendt/signert.', 'Digital signatur med privat nøkkel.');
  G('Spoofing', 'Spoofing', 'security', 'Å utgi seg for å være en annen (falsk avsender).', 'Mottiltak: digital signatur.');
  G('Symmetrisk kryptografi', 'Symmetric-key cryptography', 'security', 'Samme hemmelige nøkkel til kryptering og dekryptering. Rask.', 'AES, DES.');
  G('Asymmetrisk kryptografi', 'Public-key cryptography', 'security', 'Nøkkelpar: offentlig (K+) og privat (K−).', 'RSA.');
  G('RSA', 'RSA', 'security', 'Offentlig-nøkkel-algoritme: n = pq, ed ≡ 1 mod (p−1)(q−1), c = m^e mod n.', '');
  G('Diffie-Hellman', 'Diffie-Hellman key exchange', 'security', 'To parter blir enige om en hemmelig nøkkel over en usikker kanal: K = g^(xy) mod p.', '');
  G('Sesjonsnøkkel', 'Session key', 'security', 'Midlertidig symmetrisk nøkkel for én sesjon.', 'TLS.');
  G('Hashfunksjon', 'Cryptographic hash function', 'security', 'Lager et kort fingeravtrykk; enveis og kollisjonsresistent.', 'MD5, SHA-256.');
  G('MAC (meldingsautentisering)', 'Message Authentication Code', 'security', 'H(m + s) med delt hemmelighet s: integritet + autentisering, ikke non-repudiation.', 'Ikke forveksle med MAC-adresse!');
  G('Digital signatur', 'Digital signature', 'security', 'Hash av meldingen signert med avsenderens private nøkkel; verifiseres med offentlig.', 'Integritet + autentisering + non-repudiation.');
  G('Sertifikat', 'Certificate', 'security', 'Dokument signert av en CA som binder en offentlig nøkkel til en identitet.', 'Mot man-in-the-middle.');
  G('CA', 'Certification Authority', 'security', 'Betrodd tredjepart som signerer sertifikater.', '');
  G('Nonce', 'Nonce', 'security', 'Tall som brukes bare én gang; hindrer playback-angrep.', '');
  G('Man-in-the-middle', 'Man-in-the-middle attack', 'security', 'Angriper plasserer seg mellom partene og utgir seg for å være begge.', '');
  G('TLS', 'Transport Layer Security', 'security', 'Sikker forbindelse oppå TCP: handshake med sertifikat, sesjonsnøkler, records med MAC og sekvensnummer.', 'HTTPS.');
  G('Brannmur', 'Firewall', 'security', 'Filtrerer trafikk: tilstandsløst/tilstandsfullt pakkefilter eller applikasjonsgateway.', '');
  G('IDS', 'Intrusion Detection System', 'security', 'Overvåker trafikk (dyp pakkeinspeksjon) for å oppdage angrep.', '');
  G('STRIDE', 'STRIDE', 'security', 'Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege.', '');

  // Prosjekter
  G('Meldingslaget (P1)', 'Messaging layer', 'projects', 'Lag oppå TCP som utveksler 128-byte segmenter: 1 byte lengde + inntil 127 byte payload + padding.', '');
  G('RPCRemoteImpl (P1)', 'RPCRemoteImpl', 'projects', 'Abstrakt klasse server-side metoder arver; registrerer seg i RPC-serveren og implementerer invoke().', '');
  G('RPCLocalStub (P1)', 'RPCLocalStub', 'projects', 'Abstrakt klasse klient-stubber arver for å få tilgang til rpcclient.call().', '');
  G('rpcid (P1)', 'RPC identifier', 'projects', 'Første byte i RPC-melding; nøkkel i serverens HashMap. 0 er reservert for stop().', '');
  G('Cooperative mirroring (P3)', 'Cooperative mirroring', 'projects', 'Flere innholdsleverandører samarbeider om å lagre og tjene hverandres data.', '');
  G('checkInterval (P3)', 'checkInterval', 'projects', 'Sjekker om en ID ligger i et (sirkulært) intervall, f.eks. pred < key ≤ node.', '');
  G('findHighestPredecessor (P3)', 'findHighestPredecessor', 'projects', 'Finner fingeren nærmest nøkkelen (node < finger < key), søkt fra bunnen av fingertabellen.', '');
  G('findPrimaryOfItem (P3)', 'findPrimaryOfItem', 'projects', 'Finner primærnoden for en fil; brukes til å koordinere skrivinger (remote-write).', '');
})();
