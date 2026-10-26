/* Ekstra øvingsspørsmål i eksamensstil (engelsk) – samme stoff, nye formuleringer */
(function () {
  const D = window.DAT110;
  let n = 0;
  const E = (t, q, o, a, e) => D.quizbank.push({ id: 'xt-' + (++n), t, src: 'Øvingsspørsmål (eksamensstil)', q, o, a, e });

  // Internett og forsinkelse
  E('intro', 'A packet of L = 2·10⁴ bits is sent on a link with R = 10⁷ bits/s. What is the transmission delay?', ['0.2 ms', '2 ms', '20 ms', '0.002 ms'], [1], 'L/R = 2·10⁴ / 10⁷ = 2·10⁻³ s = 2 ms.');
  E('intro', 'A link is 2·10⁵ m long with propagation speed 2·10⁸ m/s. What is the propagation delay?', ['1 ms', '0.1 ms', '10 ms', '100 ms'], [0], 'd/s = 10⁻³ s.');
  E('intro', 'Which component of nodal delay depends on the length of the physical link?', ['Processing delay', 'Queuing delay', 'Transmission delay', 'Propagation delay'], [3], '');
  E('intro', 'Which component of nodal delay depends on the packet length L?', ['Transmission delay', 'Propagation delay', 'Both', 'Neither'], [0], '');
  E('intro', 'Traffic intensity La/R on a link approaches 1. What happens to the average queuing delay?', ['It approaches zero', 'It grows very large', 'It stays constant', 'It becomes negative'], [1], '');
  E('intro', 'A path consists of links with rates 50 Mbps, 10 Mbps and 100 Mbps. What is the end-to-end throughput?', ['160 Mbps', '50 Mbps', '10 Mbps', '100 Mbps'], [2], 'Flaskehalsen.');
  E('intro', 'In circuit switching, resources needed along a path are …', ['shared on demand', 'reserved for the duration of the communication session', 'allocated per packet', 'never reserved'], [1], '');
  E('intro', 'Which multiplexing technique divides the link into time slots?', ['FDM', 'TDM', 'CSMA', 'CDMA'], [1], '');
  E('intro', 'A router has processing delay 1 ms, queuing delay 4 ms, transmission delay 2 ms and propagation delay 3 ms. What is its nodal delay?', ['3 ms', '6 ms', '10 ms', '24 ms'], [2], 'Summen av alle fire.');
  E('intro', 'Servers S1–S3 send to clients C1–C3 over a shared link R = 60 Mbps (fairly shared). Server links are 30 Mbps, client links 15 Mbps. What is the max end-to-end throughput per pair?', ['15 Mbps', '20 Mbps', '30 Mbps', '60 Mbps'], [0], 'min(30, 60/3 = 20, 15) = 15.');

  // Lag
  E('layers', 'At which layer does an Ethernet switch primarily make its forwarding decisions?', ['Physical', 'Link', 'Network', 'Transport'], [1], 'MAC-adresser.');
  E('layers', 'Which PDU contains a destination port number?', ['Frame', 'Datagram', 'Segment', 'Bit'], [2], '');
  E('layers', 'Which layers are implemented in end hosts?', ['Only application and transport', 'Only physical and link', 'All five layers', 'Network, link and physical'], [2], '');
  E('layers', 'During encapsulation at the sender, what does the network layer add?', ['A header with port numbers', 'A header with IP addresses', 'A trailer with CRC', 'Nothing'], [1], '');
  E('layers', 'A datagram goes Host A → Router X → Switch S → Router Y → Host B. How many times is it encapsulated into a link-layer frame?', ['2', '3', '4', '5'], [1], 'A, X og Y (svitsjen teller ikke).');

  // DS-intro
  E('ds-intro', 'Which type of transparency hides that a resource may be shared by several competitive users?', ['Concurrency transparency', 'Replication transparency', 'Location transparency', 'Access transparency'], [0], '');
  E('ds-intro', 'Which type of transparency hides where a resource is physically located?', ['Access', 'Location', 'Migration', 'Failure'], [1], '');
  E('ds-intro', 'Which is NOT a common technique to achieve scalability?', ['Hiding communication latencies', 'Partitioning and distribution', 'Replication and caching', 'Centralizing all services on one server'], [3], 'Sentralisering er problemet.');
  E('ds-intro', 'Which of these is a "fallacy" (false assumption) when developing distributed systems?', ['The network is reliable', 'Latency is zero', 'Bandwidth is infinite', 'All of the above'], [3], 'Alle er falske antakelser.');
  E('ds-intro', 'A customer uses a complete application (e.g. web-mail) provided over the Internet. Which service model?', ['IaaS', 'PaaS', 'SaaS'], [2], '');
  E('ds-intro', 'Which NIST cloud characteristic lets customers provision resources themselves without human interaction with the provider?', ['Resource pooling', 'On-demand self-service', 'Measured service', 'Broad network access'], [1], '');

  // Applikasjonslaget
  E('app', 'Which field of an HTTP request message specifies the operation to perform on the resource?', ['URL', 'Version', 'Method', 'Entity body'], [2], '');
  E('app', 'Which HTTP status code means the cached copy is still valid (conditional GET)?', ['200 OK', '301 Moved Permanently', '304 Not Modified', '404 Not Found'], [2], '');
  E('app', 'Which transport protocol does HTTP/1.1 use?', ['UDP', 'TCP', 'IP', 'ICMP'], [1], '');
  E('app', 'With non-persistent HTTP, approximately how long does it take to fetch one small object?', ['1 RTT', '2 RTT + transmission time', '3 RTT', 'Transmission time only'], [1], '');
  E('app', 'Which DNS server is contacted first by a host performing a name lookup?', ['Root server', 'TLD server', 'Its local DNS server', 'Authoritative server'], [2], '');
  E('app', 'Which DNS record type maps a hostname to an IPv4 address?', ['A', 'NS', 'MX', 'CNAME'], [0], '');
  E('app', 'In Java, which class does a TCP server use to wait for new client connections?', ['DatagramSocket', 'ServerSocket', 'URLConnection', 'InetAddress'], [1], '');
  E('app', 'Which header line is used by HTTP to indicate the format of the entity body?', ['Host', 'Content-Type', 'User-Agent', 'Connection'], [1], '');

  // Prosesser
  E('proc', 'Why is a thread context switch cheaper than a process context switch?', ['Threads have no registers', 'Threads in the same process share the address space, so the memory map need not be changed', 'Threads run in the kernel', 'Threads do not use a stack'], [1], '');
  E('proc', 'In the dispatcher/worker model, what does the dispatcher thread do?', ['Executes all requests itself', 'Reads incoming requests and hands each to a worker thread', 'Only handles disk I/O', 'Kills idle workers'], [1], '');
  E('proc', 'Which server design gives parallelism AND uses blocking system calls?', ['Single-threaded process', 'Multithreaded server', 'Finite-state machine'], [1], '');
  E('proc', 'A stateless server …', ['must recover client state after a crash', 'does not keep information on the state of its clients', 'cannot be used for the Web', 'always uses UDP'], [1], '');
  E('proc', 'What is "soft state"?', ['State kept forever', 'State the server maintains only for a limited time on behalf of the client', 'State kept on disk', 'Encrypted state'], [1], '');

  // RPC
  E('rpc', 'What is the role of the client stub in RPC?', ['Execute the procedure', 'Marshal parameters into a message and send it to the server, then unmarshal the result', 'Route packets', 'Store the result'], [1], '');
  E('rpc', 'What is marshalling?', ['Encrypting messages', 'Converting parameters/values into a byte sequence suitable for a message', 'Choosing a server', 'Retransmitting requests'], [1], '');
  E('rpc', 'Little-endian and big-endian machines differ in …', ['the order in which bytes of a multi-byte integer are stored', 'the size of a byte', 'the character set', 'the clock rate'], [0], '');
  E('rpc', 'In deferred synchronous RPC, the client …', ['blocks until the result arrives', 'gets an acknowledgement and later receives the result through a callback/one-way call', 'never gets a result', 'polls the server continuously'], [1], '');
  E('rpc', 'Which is an example of language-based RPC used in project 3?', ['gRPC', 'Java RMI', 'SOAP', 'MQTT'], [1], '');
  E('rpc', 'Why can RPC never be completely transparent?', ['Because of stubs', 'Because client and server have different address spaces and the network can fail or be slow', 'Because RPC uses UDP', 'Because of IDL'], [1], '');

  // MOM
  E('mom', 'Which queue primitive blocks until the queue is non-empty and then removes the first message?', ['PUT', 'GET', 'POLL', 'NOTIFY'], [1], '');
  E('mom', 'In persistent communication, a message is …', ['discarded if the receiver is not running', 'stored by the middleware as long as it takes to deliver it', 'always delivered immediately', 'never acknowledged'], [1], '');
  E('mom', 'In asynchronous communication, the sender …', ['blocks until the receiver processes the message', 'continues immediately after submitting the message for transmission', 'waits for an ACK from the receiver', 'must be running when the message is delivered'], [1], '');
  E('mom', 'In publish-subscribe, subscribers receive messages …', ['from a specific publisher address', 'published on the topics they have subscribed to', 'only if they are online when the broker starts', 'in a round-robin fashion'], [1], '');
  E('mom', 'In project 2, the format of messages between client and broker is …', ['XML', 'JSON (using gson)', 'Raw Java serialization', 'Protocol buffers'], [1], '');

  // Multicast
  E('mcast', 'How many edges are there in a fully connected overlay of 8 processes?', ['8', '16', '28', '56'], [2], '8·7/2.');
  E('mcast', 'Overlay path A→D costs 66, best physical path A→D costs 44. RDP?', ['0.67', '1.5', '22', '2'], [1], '');
  E('mcast', 'The tree cost of a multicast tree is …', ['the delay between the two farthest nodes', 'the sum of the costs of all edges in the tree', 'the number of nodes', 'the RDP times N'], [1], '');
  E('mcast', 'In gossip-based dissemination, which approach spreads updates fastest overall?', ['Push only', 'Pull only', 'Push-pull'], [2], '');
  E('mcast', 'Why are "death certificates" needed in gossip systems?', ['To kill processes', 'Because deleted data would otherwise be reintroduced by older copies', 'To elect a leader', 'To encrypt updates'], [1], '');

  // Transport
  E('transport', 'Which fields are present in a UDP header?', ['Source port, destination port, length, checksum', 'Sequence number and ACK number', 'Source and destination IP', 'Receive window'], [0], '');
  E('transport', 'Host A sends a TCP segment with sequence number 1000 and 200 bytes of data. What ACK number does B send if everything is OK?', ['1000', '1199', '1200', '1201'], [2], '');
  E('transport', 'Which mechanism in rdt3.0 deals with lost packets?', ['Checksum', 'Countdown timer and retransmission', 'NAK', 'Window size'], [1], '');
  E('transport', 'Stop-and-wait with L/R = 1 ms and RTT = 9 ms gives sender utilization of …', ['0.1', '0.9', '1', '0.01'], [0], '1/(9+1) = 0,1.');
  E('transport', 'In Go-Back-N, what does the receiver do with an out-of-order packet?', ['Buffers it', 'Discards it and re-ACKs the last in-order packet', 'Sends a NAK', 'Delivers it to the application'], [1], '');
  E('transport', 'What does TCP do after 3 duplicate ACKs?', ['Closes the connection', 'Fast retransmit of the missing segment', 'Doubles the timeout', 'Nothing'], [1], '');
  E('transport', 'What does the receive window (rwnd) in TCP implement?', ['Congestion control', 'Flow control', 'Error detection', 'Connection setup'], [1], '');
  E('transport', 'Compute the 1s complement checksum of 8-bit words 11110000 and 00011000 (with wraparound).', ['11110110', '00001001', '11110111', '00001000'], [0], '11110000 + 00011000 = 1 00001000. Menten (1) legges til nederst: 00001000 + 1 = 00001001. Enerkomplement: 11110110.');
  E('transport', 'Why does TCP need a three-way handshake?', ['To exchange encryption keys', 'So both sides agree on initial sequence numbers and know the other side is alive', 'To find the route', 'To resolve the hostname'], [1], '');

  // Nettverkslaget
  E('network', 'How many addresses are in the block 10.0.0.0/30?', ['2', '4', '8', '30'], [1], '2^2.');
  E('network', 'What is the last address in 192.168.4.0/22?', ['192.168.4.255', '192.168.7.255', '192.168.5.255', '192.168.255.255'], [1], '/22: tredje byte 4–7.');
  E('network', 'A datagram of 3000 bytes (20-byte header) is sent on a link with MTU 1500. How many fragments?', ['2', '3', '4'], [1], 'Data 2980: 1480 + 1480 + 20 → 3.');
  E('network', 'What is the fragment offset of the third fragment when each fragment carries 1480 data bytes?', ['370', '2960', '185', '555'], [0], '2960/8 = 370.');
  E('network', 'Which device reassembles IP fragments?', ['Every router', 'The destination host', 'The first router', 'The DHCP server'], [1], '');
  E('network', 'What does a router do when TTL reaches 0?', ['Forwards the datagram', 'Discards the datagram (and sends an ICMP message)', 'Resets TTL to 64', 'Fragments it'], [1], '');
  E('network', 'Which protocol number in the IP header indicates UDP?', ['6', '17', '1', '80'], [1], '6 = TCP, 17 = UDP, 1 = ICMP.');
  E('network', 'What does NAT allow?', ['Many hosts in a private network to share one public IP address', 'Automatic IP address configuration', 'Hostname resolution', 'Error reporting'], [0], '');
  E('network', 'What is 11000000.10101000.00000001.00001010 in dotted decimal?', ['192.168.1.10', '192.168.1.5', '193.168.1.10', '192.160.1.10'], [0], '');
  E('network', 'Forwarding table: 200.23.16.0/21 → 0, 200.23.24.0/24 → 1, 200.23.24.0/21 → 2, otherwise → 3. Destination 200.23.24.170?', ['0', '1', '2', '3'], [1], 'Tredje byte 24 = 00011000. 200.23.16.0/21 krever 00010 → ingen match. 200.23.24.0/21 og 200.23.24.0/24 matcher begge; lengste prefiks er /24 → interface 1.');

  // Routing
  E('routing', 'Dijkstra\'s algorithm is used in which routing approach?', ['Distance vector', 'Link state', 'Path vector', 'Flooding'], [1], '');
  E('routing', 'Which protocol is used for intra-AS routing and is link-state based?', ['BGP', 'OSPF', 'RIP', 'ICMP'], [1], '');
  E('routing', 'In BGP, the AS-PATH attribute is used to …', ['detect loops and choose shorter AS paths', 'encrypt routes', 'assign IP addresses', 'compute checksums'], [0], '');
  E('routing', 'R1 has neighbours R2 (cost 2) and R3 (cost 6). D_R2(R4) = 5, D_R3(R4) = 0. What is D_R1(R4)?', ['5', '6', '7', '11'], [1], 'min(2+5, 6+0) = 6.');
  E('routing', 'What is the "count-to-infinity" problem?', ['Dijkstra runs forever', 'In distance-vector, bad news (cost increase) propagates slowly with routers increasing their estimates step by step', 'BGP tables grow forever', 'TTL counts to infinity'], [1], '');
  E('routing', 'What does traceroute rely on?', ['DNS', 'ICMP TTL-expired messages from routers', 'ARP', 'DHCP'], [1], '');

  // Linklaget
  E('link', 'How long is a MAC address?', ['32 bits', '48 bits', '64 bits', '128 bits'], [1], '');
  E('link', 'An ARP query is sent to which destination MAC address?', ['The target\'s MAC', 'FF:FF:FF:FF:FF:FF (broadcast)', '00:00:00:00:00:00', 'The router\'s MAC'], [1], '');
  E('link', 'A switch receives a frame whose destination MAC is not in its table. What does it do?', ['Drops it', 'Floods it on all ports except the incoming one', 'Sends it back', 'Sends it to the router'], [1], '');
  E('link', 'What does a switch learn from an incoming frame?', ['Destination MAC and outgoing port', 'Source MAC and incoming port', 'IP address and port', 'Nothing'], [1], '');
  E('link', 'Which error-detection technique is used in Ethernet frames?', ['Parity', 'Internet checksum', 'CRC', 'Hamming code'], [2], '');
  E('link', 'In CSMA/CD, what happens after a collision?', ['The frame is dropped forever', 'Abort and retransmit after a random binary exponential backoff', 'Immediately retransmit', 'Switch to TDM'], [1], '');
  E('link', 'H1 sends an IP datagram to a host on another subnet. What is the destination MAC address of the frame on the first hop?', ['The destination host\'s MAC', 'The MAC of the router interface on H1\'s subnet', 'Broadcast', 'H1\'s own MAC'], [1], '');

  // Navngiving
  E('naming', 'Chord ring m = 5 with nodes {4, 11, 19, 26}. Which node stores key 27?', ['26', '4', '11', '19'], [1], 'Ingen node ≥ 27 → wrap til 4.');
  E('naming', 'Chord m = 5, nodes {4, 11, 19, 26}. What is FT_19[5] = succ(19 + 16)?', ['26', '4', '11', '19'], [1], '35 mod 32 = 3 → succ(3) = 4.');
  E('naming', 'Chord m = 5, nodes {4, 11, 19, 26}. FT_4 = ?', ['[11, 11, 11, 19, 26]', '[11, 11, 11, 11, 26]', '[5, 6, 8, 12, 20]', '[11, 19, 26, 4, 11]'], [0], '5→11, 6→11, 8→11, 12→19, 20→26.');
  E('naming', 'The main advantage of finger tables in Chord is …', ['security', 'lookup in O(log N) hops', 'no need for hashing', 'strong consistency'], [1], '');
  E('naming', 'Forwarding pointers as a naming solution suffer from …', ['long chains and broken links', 'too many broadcasts', 'needing a home agent', 'nothing'], [0], '');
  E('naming', 'In Chord, which node is responsible for key k?', ['pred(k)', 'succ(k): the first node whose identifier is ≥ k', 'the node with the largest ID', 'a random node'], [1], '');

  // Klokker
  E('clocks', 'Process P has Lamport clock 7 and receives a message with timestamp 12. What is P\'s clock after the receive event?', ['8', '12', '13', '19'], [2], 'max(7,12)+1.');
  E('clocks', 'P2 has vector [1,3,0] and receives a message stamped [2,1,4]. New vector at P2?', ['[2,3,4]', '[2,4,4]', '[3,4,4]', '[2,3,5]'], [1], 'max = [2,3,4], +1 på P2 → [2,4,4].');
  E('clocks', 'Two events have vector clocks [2,1,0] and [1,2,0]. They are …', ['causally ordered, first before second', 'causally ordered, second before first', 'concurrent'], [2], '');
  E('clocks', 'Which algorithm synchronizes clocks by averaging without an external UTC source?', ['Cristian', 'NTP', 'Berkeley', 'Lamport'], [2], '');
  E('clocks', 'What can you conclude if C(a) < C(b) for Lamport clocks of events in different processes?', ['a → b', 'b → a', 'Nothing definite – they may be concurrent', 'a and b are the same event'], [2], '');

  // Mutex
  E('mutex', 'How many messages does the centralized mutual exclusion algorithm use per entry/exit?', ['2', '3', '2(N−1)', 'N'], [1], '');
  E('mutex', 'In Ricart–Agrawala, when does a process enter the critical section?', ['When the coordinator grants it', 'When it has received OK from all other processes', 'When it holds the token', 'When a majority votes yes'], [1], '');
  E('mutex', 'What is the main problem with the token-ring algorithm?', ['2(N−1) messages', 'The token can be lost and is hard to detect', 'Starvation', 'Needs global clock'], [1], '');
  E('mutex', 'In the bully algorithm, a process that receives an ELECTION message from a lower-numbered process …', ['ignores it', 'replies OK and starts its own election', 'becomes coordinator immediately', 'forwards it around the ring'], [1], '');

  // Konsistens
  E('consistency', 'P1: W(x)a · P2: R(x)a W(x)b · P3: R(x)a R(x)b · P4: R(x)a R(x)b. Is the store causally consistent?', ['Yes', 'No'], [0], 'Alle ser a før b.');
  E('consistency', 'Which consistency model guarantees that all processes see all writes in the same order?', ['Causal', 'Sequential', 'Eventual', 'Monotonic reads'], [1], '');
  E('consistency', 'Which client-centric model guarantees that a reply in a forum is only shown where the original post is shown?', ['Monotonic reads', 'Monotonic writes', 'Read your writes', 'Writes follow reads'], [3], '');
  E('consistency', 'With N = 7 replicas, which quorum is valid?', ['N_R = 3, N_W = 5', 'N_R = 2, N_W = 4', 'N_R = 4, N_W = 3', 'N_R = 1, N_W = 6'], [0], 'Krav: N_R + N_W > 7 og N_W > 3,5. Bare 3 + 5 = 8 oppfyller begge. (4+3: N_W for liten. 1+6 = 7 og 2+4 = 6 er ikke > 7.)');
  E('consistency', 'In local-write primary-based protocols …', ['the primary never moves', 'the primary copy migrates to the process that wants to write', 'all replicas can write simultaneously', 'there is no primary'], [1], '');
  E('consistency', 'Eventual consistency guarantees that …', ['all replicas are always identical', 'in the absence of updates, all replicas gradually become consistent', 'reads always return the latest write', 'writes are totally ordered'], [1], '');

  // Feiltoleranse
  E('fault', 'A server that responds too late, outside the specified time interval, exhibits a …', ['crash failure', 'omission failure', 'timing failure', 'response failure'], [2], '');
  E('fault', 'How many replicas are needed to tolerate k crash (fail-silent) failures?', ['k', 'k+1', '2k+1', '3k+1'], [1], '');
  E('fault', 'With RPC "at-least-once" semantics, the operation is …', ['executed exactly once', 'executed one or more times', 'executed zero or one time', 'never executed'], [1], '');
  E('fault', 'Which RPC operation is idempotent?', ['Transfer 100 NOK from account A to B', 'Append a line to a file', 'Read the balance of an account', 'Increment a counter'], [2], '');
  E('fault', 'In hierarchical feedback control for reliable multicast, who handles retransmission requests in a subgroup?', ['The original sender only', 'A local coordinator of the subgroup', 'Every receiver', 'The DNS server'], [1], '');
  E('fault', 'Availability differs from reliability in that availability is …', ['the probability the system works at a given instant', 'the time the system runs continuously without failure', 'the ease of repair', 'the absence of catastrophes'], [0], '');

  // Sikkerhet
  E('security', 'Which property does encryption primarily provide?', ['Integrity', 'Confidentiality', 'Non-repudiation', 'Availability'], [1], '');
  E('security', 'Why is the hash of a message signed instead of the whole message?', ['Hashes are encrypted', 'Public-key operations are expensive; the hash is short and fixed-size', 'It provides confidentiality', 'It is required by TCP'], [1], '');
  E('security', 'What does a certificate authority (CA) do?', ['Encrypts all traffic', 'Signs certificates that bind a public key to an identity', 'Generates nonces', 'Assigns IP addresses'], [1], '');
  E('security', 'What is the purpose of a nonce in authentication protocols?', ['Encrypt the password', 'Prevent playback (replay) attacks', 'Compress data', 'Choose a route'], [1], '');
  E('security', 'In RSA with n = 33 and e = 3, encrypt m = 2.', ['6', '8', '9', '27'], [1], '2³ = 8 mod 33 = 8.');
  E('security', 'Which provides integrity and authentication but NOT non-repudiation?', ['Digital signature', 'MAC (shared-secret)', 'Public-key encryption', 'Certificate'], [1], '');
  E('security', 'In TLS, bulk data is encrypted with …', ['the server\'s private key', 'symmetric session keys', 'the client\'s public key', 'no encryption'], [1], '');

  // Prosjekter
  E('projects', 'In project 1, how many bytes of payload can a message at the messaging layer carry at most?', ['128', '127', '255', '64'], [1], '');
  E('projects', 'In project 1, which class on the server side must every remote method implementation extend?', ['RPCLocalStub', 'RPCRemoteImpl', 'MessagingServer', 'Stopable'], [1], '');
  E('projects', 'In project 1, which class must client-side stubs extend?', ['RPCLocalStub', 'RPCRemoteImpl', 'RPCServer', 'Message'], [0], '');
  E('projects', 'In project 3, how many replicas (numReplicas) are created for each file in the start code?', ['2', '3', '4', '5'], [2], 'Util.numReplicas = 4.');
  E('projects', 'In project 3, which rule decides the peer that stores a replica?', ['pred < replica ≤ peer', 'replica < peer < succ', 'random assignment', 'the peer with the most free space'], [0], '');
})();
