/* Øvingseksamener i samme format som de ekte – nye tall og nye vinklinger */
(function () {
  'use strict';
  const D = window.DAT110;
  const F = () => D.examFig;
  const ring = (nodes) => () => `<div class="figure">${D.fig.chordRing(nodes, 5, { size: 360 })}</div>`;

  /* ======================= ØVINGSEKSAMEN A ======================= */
  D.exams.push({
    id: 'ovelse-a', title: 'Øvingseksamen A', kind: 'mock',
    note: 'Laget i samme format som eksamenene 2022–2025, men med nye tall og litt andre vinklinger. Ta den på tid (f.eks. 3–4 timer) uten å se i læringsløpet.',
    tasks: [
      {
        n: 1, title: 'Flervalg', w: 10, mc: [
          { q: 'Which device operates only at the physical layer of the TCP/IP stack?', o: ['Router', 'Switch', 'Hub', 'Host'], a: [2], e: 'En hub gjentar bare bit.' },
          { q: 'In which order are the PDUs created when data moves down the stack at the sender?', o: ['message → segment → datagram → frame', 'segment → message → frame → datagram', 'datagram → segment → frame → message', 'frame → datagram → segment → message'], a: [0], e: '' },
          { q: 'Which mechanism lets a TCP receiver prevent the sender from overflowing its buffer?', o: ['The congestion window', 'The receive window (flow control)', 'The checksum', 'The three-way handshake'], a: [1], e: '' },
          { q: 'How many IP addresses does the CIDR block 10.1.4.0/22 contain?', o: ['256', '512', '1024', '4096'], a: [2], e: '2^(32−22) = 1024.' },
          { q: 'Which protocol does a router use to report that a datagram’s TTL expired?', o: ['ARP', 'DHCP', 'ICMP', 'BGP'], a: [2], e: '' },
          { q: 'Which election algorithm sends ELECTION messages only to processes with higher identifiers?', o: ['Ring algorithm', 'Bully algorithm', 'Berkeley algorithm', 'Ricart–Agrawala'], a: [1], e: '' },
          { q: 'Two events have vector clocks [3,1,0] and [2,2,1]. They are:', o: ['causally ordered – the first happened before the second', 'causally ordered – the second happened before the first', 'concurrent'], a: [2], e: '3 > 2, men 1 < 2.' },
          { q: 'Which client-centric model guarantees that a process never reads an older version of x after having read a newer one?', o: ['Read your writes', 'Monotonic reads', 'Monotonic writes', 'Writes follow reads'], a: [1], e: '' },
          { q: 'Which property is NOT provided by a digital signature?', o: ['Integrity', 'Authentication', 'Non-repudiation', 'Confidentiality'], a: [3], e: 'Meldingen sendes i klartekst.' },
          { q: 'How many messages per entry and exit of the critical section does the centralized mutual exclusion algorithm use?', o: ['1', '2', '3', '2(N−1)'], a: [2], e: 'Request, grant, release.' }
        ]
      },
      {
        n: 2, title: 'Prosjekt 1 – RPC-middleware', w: 10, intro: 'This task is related to mandatory project 1 (socket programming and RPC middleware).',
        subs: [
          { l: 'a', q: 'Explain the role of the abstract classes RPCLocalStub and RPCRemoteImpl.', a: 'RPCLocalStub is extended by client-side stubs (e.g. DisplayStub) and gives them access to the RPC client’s call method for making remote calls. RPCRemoteImpl is extended by server-side implementations (e.g. DisplayImpl); it registers the object in the RPC server’s table and declares invoke, which unmarshals the parameter, calls the real method and marshals the return value.' },
          { l: 'b', q: 'The controller calls display.write("21") and WRITE_RPCID = 2. Describe the content of the request (i) at the RPC layer and (ii) in the 128-byte segment at the messaging layer.', a: '(i) RPC message = [2, \'2\', \'1\'] – first byte the rpcid, then the marshalled string bytes (3 bytes). (ii) Segment = [3, 2, \'2\', \'1\', 0, 0, …] – first byte = payload length 3, then the RPC message, then padding up to 128 bytes.' },
          { l: 'c', q: 'Why must an int be marshalled into 4 bytes, and how can it be done in Java?', a: 'A Java int is 32 bits = 4 bytes; both sides must agree on the representation (byte order). E.g. ByteBuffer.allocate(4).putInt(x).array() and ByteBuffer.wrap(data).getInt() (big-endian).' },
          { l: 'd', q: 'What happens if write is called with a string longer than 126 characters? Why?', a: 'The RPC message would be 1 + n &gt; 127 bytes, so constructing the Message fails (the constructor rejects data longer than 127 bytes – IllegalArgumentException). The messaging layer can only carry 127 bytes of payload, and one byte is used for the rpcid.' }
        ]
      },
      {
        n: 3, title: 'Forsinkelse, trafikkintensitet og utnyttelse', w: 10,
        intro: () => `<p>Link R1–R2: R = 2·10<sup>6</sup> bit/s, d = 4·10<sup>5</sup> m, s = 2·10<sup>8</sup> m/s.</p><div class="figure">${F().delayNet()}</div>`,
        subs: [
          { l: 'a', q: 'A packet of L = 4000 bits is sent on R1–R2. What is the transmission delay?', a: 'L/R = 4000 / 2·10<sup>6</sup> = <b>0.002 s</b>' },
          { l: 'b', q: 'R1 has processing delay 0.001 s and queuing delay 0.004 s. Compute the nodal delay at R1.', a: 'd_prop = 4·10<sup>5</sup>/2·10<sup>8</sup> = 0.002 s. d_nodal = 0.001 + 0.004 + 0.002 + 0.002 = <b>0.009 s</b>' },
          { l: 'c', q: 'H1 and R2 have the same delays and all links are equal. End-to-end delay from H1 to H3?', a: '3 × 0.009 = <b>0.027 s</b> (H1, R1 and R2 each send the packet on a link).' },
          { l: 'd', q: '200 packets/s of 4000 bits arrive for the link R1–R2. Compute the traffic intensity and comment on the queuing delay.', a: 'La/R = 4000·200 / 2·10<sup>6</sup> = <b>0.4</b>. Below 1, so the queue does not grow without bound, but the average queuing delay is noticeable and will grow quickly as the intensity approaches 1.' },
          { l: 'e', q: 'H1→R1 = 40 Mbps, R1–R2 = 25 Mbps, R2→H3 = 100 Mbps. Which link is the bottleneck, and what is the utilization of R2→H3 when H1 sends at maximum rate?', a: 'Bottleneck: R1–R2 (25 Mbps). Utilization R2→H3 = 25/100 = <b>0.25</b>.' }
        ]
      },
      {
        n: 4, title: 'TCP', w: 10,
        subs: [
          { l: 'a', q: 'Explain briefly what service TCP provides.', a: 'A connection-oriented, reliable, in-order, bidirectional byte-stream between two processes, with flow control and congestion control.' },
          { l: 'b', q: 'Explain the purpose of the TCP header fields: source port, destination port, sequence number, acknowledgment number, receive window, checksum.', a: 'Source/destination port: identify the sending and receiving sockets (multiplexing/demultiplexing). Sequence number: byte-stream number of the first data byte in the segment (detect loss, duplicates, reordering). Acknowledgment number: the next byte the receiver expects (cumulative ACK). Receive window: free buffer space at the receiver (flow control). Checksum: detect bit errors.' },
          { l: 'c', q: 'Host A sends a segment with sequence number 500 carrying 300 bytes. What acknowledgment number does B send if everything is received correctly?', a: '<b>800</b> – the next byte B expects.' },
          { l: 'd', q: 'Explain why TCP uses a three-way handshake.', a: 'Both sides must agree on initial sequence numbers and know that the other side is alive and willing before reliable transfer can start: SYN (client ISN), SYNACK (server ISN + ACK), ACK.' }
        ]
      },
      {
        n: 5, title: 'Distance-vector', w: 10,
        intro: () => `<div class="figure">${F().dv({ R1R2: 3, R1R3: 9, R2R3: 4, R2R4: 10, R3R4: 2 })}</div>`,
        subs: [
          { l: 'a', q: 'What is the least-cost path from R1 to R4?', a: 'R1 → R2 → R3 → R4 = 3 + 4 + 2 = <b>9</b> (R1–R2–R4 = 13, R1–R3–R4 = 11).' },
          { l: 'b', q: 'Specify all four distance vectors after initialization.', a: 'D_R1 = [0, 3, 9, ∞] · D_R2 = [3, 0, 4, 10] · D_R3 = [9, 4, 0, 2] · D_R4 = [∞, 10, 2, 0]' },
          { l: 'c', q: 'R1 receives the initial vectors from both R2 and R3. What is D_R1 after the update? Show the computation.', a: 'R2: min(3+0, 9+4) = 3 · R3: min(3+4, 9+0) = <b>7</b> · R4: min(3+10, 9+2) = <b>11</b> → D_R1 = [0, 3, 7, 11]' },
          { l: 'd', q: 'What is D_R1 when the algorithm has converged?', a: '[0, 3, 7, <b>9</b>] – R2 eventually learns R4 via R3 (4+2 = 6), so R1 gets 3 + 6 = 9.' }
        ]
      },
      {
        n: 6, title: 'IP-adressering, forwarding og fragmentering', w: 10,
        subs: [
          { l: 'a', q: 'What 32-bit pattern does 172.20.135.9 correspond to?', a: '10101100.00010100.10000111.00001001' },
          { l: 'b', q: 'What interval does 172.20.128.0/18 span, and how many addresses does it contain? (justify)', a: '18 bits = 16 + 2 bits of the third byte. 128 = <u>10</u>000000 → third byte 128–191. Interval <b>172.20.128.0 – 172.20.191.255</b>, 2<sup>14</sup> = <b>16384</b> addresses.' },
          { l: 'c', q: 'Table: 10101100 00010100 10 → 1; 10101100 00010100 1000 → 2; 10101100 00010100 10000111 → 3; otherwise → 0. Interfaces for i) 172.20.135.9 ii) 172.20.140.1 iii) 172.20.200.1 iv) 10.20.135.9?', a: 'i) third byte 10000111 matches all three; longest = entry 3 → <b>3</b>. ii) 140 = 10001100 matches entries 1 and 2 → <b>2</b>. iii) 200 = 11001000 matches none → <b>0</b>. iv) first byte differs → <b>0</b>.' },
          { l: 'd', q: 'A new laptop joins the network. Which protocol gives it an IP address, and which four messages are exchanged?', a: 'DHCP: discover → offer → request → ACK (also gives netmask, default gateway and DNS server).' },
          { l: 'e', q: 'A datagram of 4020 bytes (20-byte header, identifier 777) is forwarded on a link with MTU 1500. Give number of fragments and identifier/offset/flag for each.', a: 'Data = 4000 bytes; max 1480 per fragment → 3 fragments (1480, 1480, 1040). Fragment 1: 777, offset 0, flag 1 · Fragment 2: 777, offset 185, flag 1 · Fragment 3: 777, offset 370, flag 0.' }
        ]
      },
      {
        n: 7, title: 'Kommunikasjon og transparens', w: 5,
        subs: [
          { l: 'a', q: 'Explain the difference between transient and persistent communication, with an example of each.', a: 'Persistent: the middleware stores the message as long as needed to deliver it; the receiver need not be running (e-mail, message queues). Transient: the message is only stored while sender and receiver are running, otherwise discarded (TCP sockets, RPC).' },
          { l: 'b', q: 'What is location transparency? Give an example.', a: 'Hiding where a resource is located, e.g. a URL such as www.hvl.no gives no information about which machine hosts the service.' }
        ]
      },
      {
        n: 8, title: 'Overlay-multicast', w: 10,
        intro: () => `<p>Five processes A–E are attached to routers Ra–Re with cost 1.</p><div class="figure">${F().overlay5({ ae: 15, ab: 10, bc: 5, cd: 20, de: 5 })}</div>`,
        subs: [
          { l: 'a', q: 'Draw the fully connected overlay graph and label the edges with the smallest delay.', a: 'A–B 12 · A–C 17 · A–D 22 · A–E 17 · B–C 7 · B–D 27 · B–E 27 · C–D 22 · C–E 27 · D–E 7', x: 'A–D: via Re (15+5 = 20) er billigere enn via Rb–Rc (10+5+20 = 35). B–D: via Rc (5+20 = 25) vs via Ra–Re (10+15+5 = 30).' },
          { l: 'b', q: 'Compute the RDP for a multicast from B to D using 1) A–B–C–D–E and 2) C–B–A–E–D. Which is more efficient?', a: 'Best physical B–D = 27. Tree 1: B–C–D = 7+22 = 29 → RDP 1.07. Tree 2: B–A–E–D = 12+17+7 = 36 → RDP 1.33. Tree 1 is more efficient for B→D.' },
          { l: 'c', q: 'Compute the tree costs. Which tree is more efficient overall?', a: 'Tree 1 = 12+7+22+7 = <b>48</b>. Tree 2 = 7+12+17+7 = <b>43</b>. Tree 2 has the lower total cost (note: different answer than in b!).' }
        ]
      },
      {
        n: 9, title: 'Feilhåndtering, vektorklokker og quorum', w: 10,
        subs: [
          { l: 'a', q: 'The reply from an RPC server is lost. How should the client (and server) handle this?', a: 'Client: timer; on timeout retransmit the request. Each request gets a sequence number. Server: for non-idempotent requests, remember the latest sequence number per client, detect the retransmission and not execute it twice (resend the stored reply instead).' },
          { l: 'b', q: () => 'Compute the vector clocks. Messages: s1→r1 (P1→P2), s2→r2 (P2→P3), s3→r3 (P3→P1), s4→r4 (P4→P2).' + F().vcTable([['P1', 's1', 'a', 'r3', 'b'], ['P2', 'c', 'r1', 's2', 'r4'], ['P3', 'd', 'r2', 's3', 'e'], ['P4', 'f', 's4', 'g', 'h']]), a: () => F().vcTable([['P1', '1000', '2000', '3330', '4330'], ['P2', '0100', '1200', '1300', '1402'], ['P3', '0010', '1320', '1330', '1340'], ['P4', '0001', '0002', '0003', '0004']]) + 'E.g. r3 at P1: max([2,0,0,0],[1,3,3,0]) = [2,3,3,0] → +1 → [3,3,3,0].' },
          { l: 'c', q: 'Are events a (P1) and e (P3) causally related? Justify using the vector clocks.', a: 'a = [2,0,0,0], e = [1,3,4,0]. Neither vector is ≤ the other (2 &gt; 1 but 0 &lt; 3), so a and e are <b>concurrent</b>.' },
          { l: 'd', q: 'A quorum-based protocol has N = 9 replicas. Is N_R = 4, N_W = 5 valid? Give a valid choice.', a: 'Not valid: N_R + N_W = 9 is not &gt; 9 (a read may miss the latest write). Valid e.g. N_R = 5, N_W = 5 (10 &gt; 9 and 5 &gt; 4.5) or N_R = 1, N_W = 9.' }
        ]
      },
      {
        n: 10, title: 'Chord DHT', w: 15,
        intro: () => `<p>A ring with m = 5 bits; five servers (2, 8, 14, 20, 27). Finger tables: succ(n + 2<sup>i−1</sup>).</p>${ring([2, 8, 14, 20, 27])()}`,
        subs: [
          { l: 'a', q: 'Compute the finger tables (show steps).', a: '2: succ(3)=8, succ(4)=8, succ(6)=8, succ(10)=14, succ(18)=20 · 8: 14, 14, 14, 20, 27 · 14: 20, 20, 20, 27, succ(30)=2 · 20: 27, 27, 27, succ(28)=2, succ(36 mod 32=4)=8 · 27: succ(28)=2, succ(29)=2, succ(31)=2, succ(35 mod 32=3)=8, succ(43 mod 32=11)=14' },
          { l: 'b', q: 'Keys {1, 9, 21, 28}. Which servers are responsible? Show the formula.', a: 'pred(server) &lt; key ≤ server: 1 → 2 · 9 → 14 · 21 → 27 · 28 → 2 (wrap)' },
          { l: 'c', q: 'Resolve key 24 from server 2.', a: 'Round 1: n=2, succ=8: 2&lt;24≤8? No. Finger(5)=20: 2&lt;20&lt;24 yes → 20. Round 2: n=20, succ=27: 20&lt;24≤27 → <b>27</b>.' },
          { l: 'd', q: 'Resolve key 5 from server 20.', a: 'Round 1: n=20, succ=27: 20&lt;5≤27? No. Finger(5)=8: 20&lt;8&lt;5 (wrap: 21…31,0…4)? No. Finger(4)=2: yes → 2. Round 2: n=2, succ=8: 2&lt;5≤8 → <b>8</b>.' },
          { l: 'e', q: 'Explain what gives scalable search and fault tolerance in this DHT.', a: 'Finger tables with exponentially distant nodes → O(log n) lookup. Replication of data (files) and processes → fault tolerance.' }
        ]
      }
    ]
  });

  /* ======================= ØVINGSEKSAMEN B ======================= */
  const HUB_B = { h1ip: '10.0.0.1', h1mac: 'AA:AA:AA:AA:AA:01', h2ip: '10.0.0.2', h2mac: 'AA:AA:AA:AA:AA:02', r1ip: '10.0.0.254', r1mac: 'AA:AA:AA:AA:AA:FE', r2ip: '10.0.1.254', r2mac: 'BB:BB:BB:BB:BB:FE', h3ip: '10.0.1.3', h3mac: 'CC:CC:CC:CC:CC:03', h4ip: '10.0.1.4', h4mac: 'DD:DD:DD:DD:DD:04' };
  D.exams.push({
    id: 'ovelse-b', title: 'Øvingseksamen B', kind: 'mock',
    note: 'Andre øvingssett. Fokus på varianter du ikke har sett ennå: 3 par i gjennomstrømning, ny hub/svitsj-adressering, 6-ruter-overlay og vektorklokker med 3 prosesser.',
    tasks: [
      {
        n: 1, title: 'Flervalg', w: 10, mc: [
          { q: 'Which statement about IPv4 fragmentation is correct?', o: ['Fragments are reassembled at each router', 'Fragments are reassembled at the destination host', 'The fragmentation offset is measured in bytes', 'IPv6 routers fragment datagrams'], a: [1], e: '' },
          { q: 'What is the main difference between a hub and a switch?', o: ['A hub forwards frames selectively based on MAC addresses', 'A switch forwards frames selectively using its switch table, while a hub repeats bits on all ports', 'Both operate at the network layer', 'A switch broadcasts all frames'], a: [1], e: '' },
          { q: 'Which delay component is computed as d/s?', o: ['Transmission delay', 'Propagation delay', 'Queuing delay', 'Processing delay'], a: [1], e: '' },
          { q: 'What does a DNS client typically use for its queries?', o: ['TCP port 80', 'UDP port 53', 'UDP port 80', 'TCP port 25'], a: [1], e: '' },
          { q: 'In Go-Back-N, a timeout causes the sender to …', o: ['retransmit only the oldest packet', 'retransmit all unacknowledged packets', 'close the connection', 'halve the window'], a: [1], e: '' },
          { q: 'Which is an advantage of a stateless server?', o: ['It can offer better client-side caching', 'It can recover easily after a crash', 'It knows which files clients have open', 'It always generates less network traffic'], a: [1], e: '' },
          { q: 'A Chord ring uses m = 6 bits. How large is the address space?', o: ['6', '36', '64', '128'], a: [2], e: '2^6 = 64.' },
          { q: 'Which form of communication describes e-mail?', o: ['Transient synchronous', 'Persistent asynchronous', 'Transient asynchronous', 'Persistent synchronous'], a: [1], e: '' },
          { q: 'Three processes vote on results with majority voting. How many processes with arbitrary failures can be tolerated?', o: ['0', '1', '2', '3'], a: [1], e: '2k+1 = 3 → k = 1.' },
          { q: 'Which key does Alice use to encrypt a confidential message to Bob?', o: ['Alice’s private key', 'Alice’s public key', 'Bob’s public key', 'Bob’s private key'], a: [2], e: '' }
        ]
      },
      {
        n: 2, title: 'Prosjekt 2 – publish-subscribe', w: 10,
        subs: [
          { l: 'a', q: 'Explain the role of the Dispatcher and the Storage in the broker.', a: 'Dispatcher: a Stopable thread that polls client sessions for incoming messages and processes them (onConnect, onCreateTopic, onSubscribe, onPublish, …). Storage: keeps connected clients (user → ClientSession) and subscriptions (topic → set of users).' },
          { l: 'b', q: 'Which protocol messages are exchanged when a display subscribes to "temperature" and a sensor publishes "21"?', a: 'Display → broker: Connect, CreateTopic(temperature), Subscribe(temperature). Sensor → broker: Connect, Publish(temperature, "21"). Broker → display: Publish(temperature, "21"). (Later Unsubscribe/Disconnect.)' },
          { l: 'c', q: 'How could the broker buffer messages for a subscriber that is temporarily disconnected?', a: 'Add a map in Storage from user to a buffer of messages. On publish, if a subscriber has no session, store the message in its buffer. On connect, send all buffered messages to the client and clear the buffer.' },
          { l: 'd', q: 'Why does Storage use ConcurrentHashMap?', a: 'The broker and dispatcher run as separate threads that access the storage concurrently; ConcurrentHashMap gives thread-safe access without explicit locking.' }
        ]
      },
      {
        n: 3, title: 'Gjennomstrømning og utnyttelse', w: 10,
        intro: '<p>Three server–client pairs share a middle link of R = 90 Mbps (fairly shared). Server links Rs = 50 Mbps, client links Rc = 20 Mbps.</p>',
        subs: [
          { l: 'a', q: 'Maximum end-to-end throughput per pair? (justify)', a: 'min(Rs, R/3, Rc) = min(50, 30, 20) = <b>20 Mbps</b>.' },
          { l: 'b', q: 'Which link is the bottleneck?', a: 'The client links Rc (20 Mbps) – they limit each pair below its share of the middle link.' },
          { l: 'c', q: 'What is the utilization of the middle link?', a: '3 × 20 / 90 = <b>0.67</b>' },
          { l: 'd', q: 'What is the utilization of the server links?', a: '20/50 = <b>0.4</b>' },
          { l: 'e', q: 'The client links are upgraded to 60 Mbps. New throughput per pair and bottleneck?', a: 'min(50, 30, 60) = <b>30 Mbps</b>; the shared middle link becomes the bottleneck.' }
        ]
      },
      {
        n: 4, title: 'IPv4', w: 10, intro: () => F().ipv4,
        subs: [
          { l: 'a', q: 'What is the size of the header without options? Justify.', a: '5 rows × 32 bits = 160 bits = <b>20 bytes</b>.' },
          { l: 'b', q: 'Explain the purpose of Identifier, Flags and Fragmentation offset.', a: 'Identifier: which fragments belong to the same datagram. Flags: whether more fragments follow (0 = last). Offset: position of the fragment’s data in the original datagram (in 8-byte units).' },
          { l: 'c', q: 'Why does the IP header contain a Time-to-live field?', a: 'It is decremented at each router and the datagram is discarded when it reaches 0, preventing datagrams from circulating forever in routing loops.' },
          { l: 'd', q: 'Why must the header checksum be recomputed at every router?', a: 'Because TTL (part of the header) changes at every hop.' }
        ]
      },
      {
        n: 5, title: 'ARP, hub og svitsj', w: 10,
        intro: () => `<div class="figure">${F().hubSwitch(HUB_B)}</div>`,
        subs: [
          { l: 'a', q: 'H2 sends a frame to R’s interface 1. Which devices receive the frame, and which processes it?', a: 'The hub repeats it on all ports: H1 and R receive it. Only R processes it (destination MAC matches); H1 discards it.' },
          { l: 'b', q: 'H3 sends an IP datagram to H1. Give the IP source/destination, and the MAC source/destination on the first hop (H3→R) and second hop (R→H1).', a: 'IP: 10.0.1.3 → 10.0.0.1 (unchanged). Hop 1: CC:CC:CC:CC:CC:03 → BB:BB:BB:BB:BB:FE. Hop 2: AA:AA:AA:AA:AA:FE → AA:AA:AA:AA:AA:01.' },
          { l: 'c', q: 'Sw’s table is empty. H3 sends an ARP query for 10.0.1.254, R replies, then H3 sends the datagram. Which ports is the ARP query forwarded on, and what is the final switch table?', a: 'The query arrives on port 2 and is flooded on ports 1 and 3. Table: CC:CC:CC:CC:CC:03 → 2 (learned from the query), BB:BB:BB:BB:BB:FE → 1 (learned from the reply).' },
          { l: 'd', q: 'What does H3’s ARP table contain afterwards?', a: '10.0.1.254 → BB:BB:BB:BB:BB:FE' },
          { l: 'e', q: 'Why does H3 not send an ARP query for H1’s IP address?', a: 'H1 is in another subnet (10.0.0.0/24). ARP only works within a subnet (broadcasts do not cross routers); H3 sends the datagram to its default gateway R and therefore needs R’s MAC.' }
        ]
      },
      {
        n: 6, title: 'Longest prefix match og routing', w: 10,
        subs: [
          { l: 'a', q: 'Explain longest prefix matching and why it is needed.', a: 'A router compares the destination address with the prefixes in its table; if several match, the longest (most specific) is chosen. Needed because prefixes overlap when address blocks are aggregated and exceptions are added for sub-blocks.' },
          { l: 'b', q: 'What 32-bit pattern does 192.168.37.200 correspond to?', a: '11000000.10101000.00100101.11001000' },
          { l: 'c', q: 'What interval does 192.168.32.0/20 span, and how many addresses?', a: '20 bits = 16 + 4 bits of byte 3: 32 = 0010|0000 → 32–47. <b>192.168.32.0 – 192.168.47.255</b>, 2<sup>12</sup> = <b>4096</b> addresses.' },
          { l: 'd', q: 'Table: 11000000 10101000 0010 → 1; 11000000 10101000 00100101 → 2; 11000000 10101000 001001 → 3; otherwise → 0. Interfaces for i) 192.168.37.200 ii) 192.168.38.1 iii) 192.168.50.1?', a: 'i) 37 = 00100101 matches all; longest (24 bits) → <b>2</b>. ii) 38 = 00100110 matches entries 1 and 3; longest (22 bits) → <b>3</b>. iii) 50 = 00110010 matches none → <b>0</b>.' },
          { l: 'e', q: 'Explain the difference between link-state and distance-vector routing.', a: 'Link-state: every router learns the complete topology (flooding) and computes paths with Dijkstra – global knowledge. Distance-vector: each router only knows its neighbours and iteratively updates its vector with Bellman-Ford using the neighbours’ vectors – local knowledge.' }
        ]
      },
      {
        n: 7, title: 'RPC og servere', w: 5,
        subs: [
          { l: 'a', q: 'What is the purpose of marshalling in RPC, and why is byte order an issue?', a: 'Marshalling converts parameters/return values into a byte sequence that can be sent in a message. Machines may store multi-byte values in different byte order (big- vs little-endian), so client and server must agree on a common representation.' },
          { l: 'b', q: 'Explain the difference between an iterative and a concurrent server.', a: 'An iterative server handles one request at a time to completion before accepting the next. A concurrent server passes each request to a separate thread/process and is immediately ready for new requests.' }
        ]
      },
      {
        n: 8, title: 'Overlay-multicast (6 prosesser)', w: 10,
        intro: () => '<div class="figure">' + F().overlay({
          routers: [
            { id: 'Ra', x: 110, y: 80, p: 'A', px: 40, py: 25 }, { id: 'Rf', x: 260, y: 80, p: 'F', px: 260, py: 22 }, { id: 'Re', x: 410, y: 80, p: 'E', px: 480, py: 25 },
            { id: 'Rb', x: 110, y: 190, p: 'B', px: 40, py: 245 }, { id: 'Rc', x: 260, y: 190, p: 'C', px: 260, py: 250 }, { id: 'Rd', x: 410, y: 190, p: 'D', px: 480, py: 245 }
          ],
          links: [['Ra', 'Rf', 30], ['Rf', 'Re', 5], ['Re', 'Rd', 15], ['Rd', 'Rc', 10], ['Rc', 'Rb', 20], ['Rb', 'Ra', 5]]
        }) + '</div>',
        subs: [
          { l: 'a', q: 'Draw the fully connected overlay graph (15 edges).', a: 'A–B 7 · A–C 27 · A–D 37 · A–E 37 · A–F 32 · B–C 22 · B–D 32 · B–E 42 · B–F 37 · C–D 12 · C–E 27 · C–F 32 · D–E 17 · D–F 22 · E–F 7', x: 'Sjekk begge veier rundt ringen (sum 85). F.eks. A–E: via Rf (30+5 = 35) vs via Rb–Rc–Rd (5+20+10+15 = 50).' },
          { l: 'b', q: 'RDP from A to D using 1) A–B–C–D–E–F and 2) A–F–E–D–C–B?', a: 'Best A–D = 37. Tree 1: A–B–C–D = 7+22+12 = 41 → RDP 1.11. Tree 2: A–F–E–D = 32+7+17 = 56 → RDP 1.51. Tree 1 is more efficient.' },
          { l: 'c', q: 'Tree costs?', a: 'Tree 1 = 7+22+12+17+7 = <b>65</b>. Tree 2 = 32+7+17+12+22 = <b>90</b>. Tree 1 is more efficient overall.' }
        ]
      },
      {
        n: 9, title: 'Konsistens, valg og vektorklokker', w: 10,
        subs: [
          { l: 'a', q: 'P1: W(x)a … W(x)c · P2: R(x)a W(x)b · P3: R(x)a R(x)c R(x)b · P4: R(x)a R(x)b R(x)c. Is the store causally consistent? Is it sequentially consistent?', a: 'a → b (P2 read a before writing b) and a → c (program order in P1); b and c are concurrent. Everyone sees a first, and the concurrent b and c may be seen in different orders → <b>causally consistent</b>. Not sequentially consistent, since P3 and P4 see b and c in different orders.' },
          { l: 'b', q: 'Processes 1–7; coordinator 7 has crashed and process 3 notices. Describe the bully algorithm until a new coordinator is elected (4, 5, 6 alive).', a: '3 sends ELECTION to 4, 5, 6, 7. 4, 5, 6 answer OK, so 3 stops. 4, 5 and 6 hold their own elections towards higher IDs; 6 gets no answer from 7, wins, and sends COORDINATOR to all.' },
          { l: 'c', q: () => 'Compute the vector clocks (s1→r1 P1→P2, s2→r2 P2→P3, s3→r3 P3→P1).' + F().vcTable([['P1', 'a', 's1', 'b', 'r3'], ['P2', 'r1', 'c', 's2', 'd'], ['P3', 'e', 'r2', 's3', 'f']]), a: () => F().vcTable([['P1', '100', '200', '300', '433'], ['P2', '210', '220', '230', '240'], ['P3', '001', '232', '233', '234']]) },
          { l: 'd', q: 'Is b → f? Is a → f?', a: 'b = [3,0,0], f = [2,3,4]: 3 &gt; 2 → not b → f; they are concurrent. a = [1,0,0] ≤ [2,3,4] → <b>a → f</b>.' }
        ]
      },
      {
        n: 10, title: 'Chord DHT', w: 15,
        intro: () => `<p>m = 5; five servers (6, 13, 18, 24, 30).</p>${ring([6, 13, 18, 24, 30])()}`,
        subs: [
          { l: 'a', q: 'Compute the finger tables.', a: '6: 13, 13, 13, 18, 24 · 13: 18, 18, 18, 24, 30 · 18: 24, 24, 24, 30, succ(34 mod 32=2)=6 · 24: 30, 30, 30, succ(32 mod 32=0)=6, succ(40 mod 32=8)=13 · 30: succ(31)=6, succ(0)=6, succ(2)=6, succ(6)=6, succ(46 mod 32=14)=18' },
          { l: 'b', q: 'Keys {3, 13, 19, 31}. Responsible servers?', a: '3 → 6 · 13 → 13 · 19 → 24 · 31 → 6' },
          { l: 'c', q: 'Resolve key 28 from server 6.', a: 'Round 1: n=6, succ=13: no. Finger(5)=24: 6&lt;24&lt;28 yes → 24. Round 2: n=24, succ=30: 24&lt;28≤30 → <b>30</b>.' },
          { l: 'd', q: 'Resolve key 16 from server 24.', a: 'Round 1: n=24, succ=30: 24&lt;16≤30? No. Finger(5)=13: 24&lt;13&lt;16 (wrap) yes → 13. Round 2: n=13, succ=18: 13&lt;16≤18 → <b>18</b>.' },
          { l: 'e', q: 'Why does a real system (e.g. project 3) use a very large identifier space such as 2<sup>128</sup>?', a: 'To make collisions between hashed identifiers of nodes and files practically impossible, and to spread keys uniformly over the ring (load balancing).' }
        ]
      }
    ]
  });
})();
