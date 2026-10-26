/* Tidligere eksamener med sensorveiledningens løsninger (a) og ekstra forklaring (x) */
(function () {
  'use strict';
  const D = window.DAT110;
  const F = () => D.examFig;
  const ring = (nodes, keys) => () => `<div class="figure">${D.fig.chordRing(nodes, 5, { keys: keys || [], size: 360 })}</div>`;
  const DHT_ALGO = 'Steg 1: sjekk om nøkkelen ligger mellom noden og etterfølgeren (n &lt; k ≤ succ(n)) – i så fall er succ(n) svaret. Steg 2: ellers, gå så langt som mulig: start nederst i fingertabellen (Finger(5)) og finn første finger med n &lt; finger &lt; k. Gå dit og gjenta steg 1.';

  const HUB_2022 = { h1ip: '132.200.1.1', h1mac: '1A:1B:1C:1D:1E:1F', h2ip: '132.200.1.2', h2mac: '2A:2B:2C:2D:2E:2F', r1ip: '132.200.1.3', r1mac: '6A:6B:6C:6D:6E:6F', r2ip: '221.198.1.3', r2mac: '5A:5B:5C:5D:5E:5F', h3ip: '221.198.1.3', h3mac: '3A:3B:3C:3D:3E:3F', h4ip: '221.198.1.4', h4mac: '4A:4B:4C:4D:4E:4F' };
  const HUB_2025 = { h1ip: '200.102.1.1', h1mac: '1A:1B:1C:1D:1E:1F', h2ip: '200.102.1.2', h2mac: '2A:2B:2C:2D:2E:2F', r1ip: '200.102.1.3', r1mac: '5A:5B:5C:5D:5E:5F', r2ip: '100.162.1.3', r2mac: '6A:6B:6C:6D:6E:6F', h3ip: '100.162.1.1', h3mac: '3A:3B:3C:3D:3E:3F', h4ip: '100.162.1.2', h4mac: '4A:4B:4C:4D:4E:4F' };

  /* ======================= MAI 2022 ======================= */
  D.exams.push({
    id: 'mai-2022', title: 'Eksamen 25. mai 2022', kind: 'past',
    note: 'Oppgave 2 handlet om prosjekt 4 (IoT access control), som ikke er pensum i 2026. Tilsvarende oppgave i 2027 vil handle om prosjekt 1, 2 eller 3.',
    tasks: [
      { n: 1, title: 'Flervalg', w: 10, mcSrc: 'mai 2022' },
      {
        n: 2, title: 'Prosjekt 4 – IoT access control (ikke pensum 2026)', w: 10,
        intro: 'This task is related to the mandatory project 4 on an IoT access control system.',
        subs: [
          { l: 'a', q: 'Explain briefly what characterises an IoT device.', a: 'Embedded microprocessor/controller and software, dedicated purpose and interface, sensors and actuators.' },
          { l: 'b', q: 'Specify which sensors and which actuators were being used on the access control IoT device in project 4.', a: 'PIR sensor, push buttons (sensors); LEDs (actuators).' },
          { l: 'c', q: 'Explain briefly the main purpose of the setup()-function and the loop()-function in an Arduino program.', a: 'setup() is executed upon start/boot of the device and is typically used for initialisation. loop() is repeatedly executed and typically consists of reading sensors, processing data, and controlling actuators.' },
          { l: 'd', q: 'Which hardware component of an IoT device is responsible for executing the software embedded on the device?', a: 'The microprocessor/microcontroller.' },
          { l: 'e', q: 'The cloud service (Spark/Java) supported HTTP DELETE /accessdevice/log/ to delete all entries. Explain how you would extend it to delete a specific entry.', a: 'Add a route that handles a DELETE request containing an identifier, e.g. <code>delete("/accessdevice/log/:id", …)</code>: parse the id from the request parameters (as for GET of a specific entry) and remove the entry with that id from the hash-map storing the access log, returning the deleted entry as JSON.', x: 'Poenget: REST – ressursen identifiseres i URL-en (…/log/:id) og operasjonen med metoden (DELETE).' }
        ]
      },
      {
        n: 3, title: 'IP-fragmentering', w: 10,
        intro: () => `<p>Consider the network comprised of routers R1 and R2 and hosts H1, H2 and H3. Assume that R1 receives an IP datagram of length 5200 bytes from H1 for forwarding to R2 having the format below, where the Options field is not present. The link between R1 and R2 uses Ethernet frames that can hold up to 1500 bytes (MTU) in the Data field.</p><div class="figure">${F().delayNet()}</div>${F().ipv4}${F().ethernet}`,
        subs: [
          { l: 'a', q: 'What is the size measured in bytes of the header in the IP datagram?', a: '32 bits × 5 = 4 bytes × 5 = <b>20 bytes</b>.' },
          { l: 'b', q: 'What is the size measured in bytes of the Data part of the IP datagram?', a: '5200 − 20 = <b>5180 bytes</b>.' },
          { l: 'c', q: 'How many fragments will the IP datagram be split into before being forwarded on the link from R1 to R2? (justify)', a: 'Each fragment can be at most 1500 bytes and hence hold 1480 bytes of data from the original datagram. 5180 bytes of data → 3 fragments with 1480 bytes and one with 5180 − 3·1480 = 740 bytes. Hence <b>four fragments</b>.' },
          { l: 'd', q: 'Explain the purpose of the 13-bit fragmentation offset.', a: 'When a datagram is split into fragments containing different parts of the Data, we need to specify where in the original datagram the data was positioned. That is the purpose of the fragmentation offset.' },
          { l: 'e', q: 'Assume the 16-bit identifier has the value 110. Specify for each fragment the identifier and the fragmentation offset.', a: 'Fragment 1: 110, 0 · Fragment 2: 110, 185 · Fragment 3: 110, 370 · Fragment 4: 110, 555 (offset in units of 8 bytes: 1480/8 = 185).' },
          { l: 'f', q: 'Assume all fragments arrive at H2. Explain how H2 reassembles the original datagram.', a: 'H2 uses the 16-bit identifier to determine which fragments belong to the same original datagram, and the fragmentation offset to put the data in the fragments together in the correct order (the flag shows the last fragment).' }
        ]
      },
      {
        n: 4, title: 'IPv4-datagrammet', w: 10,
        intro: () => '<p>The figure shows the format of datagrams used in the IPv4 protocol.</p>' + F().ipv4,
        subs: [
          { l: 'a', q: 'Explain briefly what service the IP protocol provides.', a: 'Unreliable multi-hop end-to-end transmission of datagrams.' },
          { l: 'b', q: 'Explain briefly the purpose of the fields: Time-to-live, 32-bit Source IP address, 32-bit Destination IP address, and Data.', a: 'TTL detects routing loops by decrementing the value for each hop. Source IP specifies the IP address of the sender; Destination IP specifies the receiver. Data contains the actual data transmitted between sender and receiver.' },
          { l: 'c', q: 'How does a sender host specify whether the datagram carries a UDP or a TCP segment?', a: 'Using the Upper-layer protocol field.' },
          { l: 'd', q: 'When routing, only the destination address is used. Why is the source IP address included in the datagram?', a: 'In many cases a message/data/acknowledgement will have to be sent back to the sender. The source address can be used as destination address in the datagram sent in the opposite direction.' }
        ]
      },
      {
        n: 5, title: 'ARP, hub og svitsj', w: 10,
        intro: () => `<p>Consider the IP network with hosts H1–H4 and router R, a LAN implemented using a hub Hb (H1, H2, R) and a LAN implemented using a switch Sw (R, H3, H4).</p><div class="figure">${F().hubSwitch(HUB_2022)}</div>`,
        subs: [
          { l: 'a', q: 'At what layer of the TCP/IP stack does a hub operate?', a: 'Physical layer.' },
          { l: 'b', q: 'At what layer does a switch operate?', a: 'Physical and link layer.' },
          { l: 'c', q: 'Explain why ARP is needed in an IP network.', a: 'An IP datagram must be encapsulated into a link-layer frame with source and destination link-layer addresses. When forwarding we only know the next-hop IP address, so we need to find the corresponding link-layer address – this is done using ARP.' },
          { l: 'd', q: 'H1 sends an ARP query with target IP 132.200.1.3. Which hosts/routers receive the query and which reply? (justify)', a: 'H2 and R receive the query since the hub operates at the physical layer and forwards the frame on all its ports. Only R replies, as it has the targeted IP address.' },
          { l: 'e', q: 'When H1 receives the ARP reply, what entry is created in its ARP table? (justify)', a: 'R replies with its link-layer address 6A:6B:6C:6D:6E:6F for 132.200.1.3, so H1 creates the entry (132.200.1.3, 6A:6B:6C:6D:6E:6F).' },
          { l: 'f', q: 'The switch table has the entry (1, 5A:5B:5C:5D:5E:5F) and H4 sends a frame to 5A:5B:5C:5D:5E:5F. On which ports is the frame forwarded? (justify)', a: 'Only on port 1, since the switch table says the device with that address is connected to port 1.' },
          { l: 'g', q: 'H3 sends a frame to H4. What entry is created in the switch table? (justify)', a: 'A frame with source address 3A:3B:3C:3D:3E:3F arrives on port 2, so the switch learns (2, 3A:3B:3C:3D:3E:3F).' }
        ]
      },
      {
        n: 6, title: 'IP-adresser og forwarding', w: 10,
        intro: () => `<p>Consider the IP network with hosts H1 and H2 and routers R1–R4. The integers denote network interface identifiers.</p><div class="figure">${F().r1r4('132.202.1.1', '221.198.201.1')}</div>`,
        subs: [
          { l: 'a', q: 'The subnetwork with H2 and R4 has the address block 221.198.0.0/16. Specify the interval of IP addresses.', a: '221.198.0.0 to 221.198.255.255.' },
          { l: 'b', q: 'What 32-bit pattern does 221.198.201.1 correspond to?', a: '11011101.11000110.11001001.00000001' },
          { l: 'c', q: 'R2’s table: 10000100 11001010 → 1; 11011101 11000110 → 3; otherwise → 2. On which interface is 221.198.201.1 forwarded? (justify)', a: 'The first 16 bits match the second entry and not the first. Hence interface <b>3</b>.' },
          { l: 'd', q: 'The table is modified to: 10000100 11001010 → 1; 11011101 11000110 → 3; 11011101 11000110 11001001 → 2; otherwise → 2. Which interface now? (justify)', a: 'The address matches both the second and the third entry. The third has the longest prefix match, so interface <b>2</b>.' },
          { l: 'e', q: 'Cost = number of links. Specify one of the shortest paths between H1 and H2.', a: 'H1 → R1 → R2 → R4 → H2 (cost 4). (H1 → R1 → R3 → R4 → H2 is equally short.)' },
          { l: 'f', q: 'Explain the difference between the routing function and the forwarding function.', a: 'Forwarding takes an incoming datagram and, by consulting the forwarding table, determines the next hop. Routing computes/determines the content of the forwarding tables.' }
        ]
      },
      {
        n: 7, title: 'Kommunikasjon og tråder', w: 5,
        subs: [
          { l: 'a', q: 'Explain briefly the difference between the traditional RPC model and the message-oriented communication model.', a: 'Traditional RPC is a synchronous, blocking model where sender and receiver must both be running for the call to succeed. Message-oriented communication is asynchronous and non-blocking, allowing sender and receiver to be loosely coupled in time (e.g., by using brokers).' },
          { l: 'b', q: 'Explain briefly the main use of multi-threading in server design.', a: 'Each client request is passed to a separate thread, so the server can handle multiple requests. Multithreading also lets the server exploit multi-processor architectures for better performance.' }
        ]
      },
      {
        n: 8, title: 'Overlay-multicast', w: 10,
        intro: () => `<p>Five processes (A–E) form an overlay network for multicasting. The physical links are formed by routers Ra–Re; the numbers show the cost (delay).</p><div class="figure">${F().overlay5({ ae: 75, ab: 15, bc: 30, cd: 20, de: 20 })}</div>`,
        subs: [
          { l: 'a', q: 'Draw the fully connected overlay network graph and label the edges with the smallest delay. (Hint: E = N(N−1)/2)', a: 'A–B 17 · A–C 47 · A–D 67 · A–E 77 · B–C 32 · B–D 52 · B–E 72 · C–D 22 · C–E 42 · D–E 22', x: 'A–D: via Rb–Rc–Rd = 15+30+20 = 65 (+2) = 67 – billigere enn via Re (75+20 = 95). A–E: direkte 75 vs. rundt 85 → 77.' },
          { l: 'b', q: 'Compute the RDP when a message is multicast from A to D using the trees: a. C–B–A–E–D, b. B–A–E–C–D, c. E–A–B–C–D.', a: 'Best router path A–D = 67. a) A–E–D = 77+22 = 99 → RDP = 99/67 = 1.48. b) A–E–C–D = 77+42+22 = 141 → RDP = 2.1. c) A–B–C–D = 17+32+22 = 71 → RDP = 1.06.' },
          { l: 'c', q: 'Which tree is most efficient to route a message from A to D? Explain.', a: 'Tree c (E–A–B–C–D): its RDP (≈1.05) is the lowest, i.e. nearly the same cost as the physical network.' }
        ]
      },
      {
        n: 9, title: 'Konsistens og RPC-feil', w: 10,
        subs: [
          { l: 'a', q: 'Explain briefly the difference between primary-based and replicated-write protocols.', a: 'In primary-based protocols, writes to a data item can only be performed by one process (single-leader). In replicated-write protocols, writes can be performed by more than one process (multi-leader).' },
          { l: 'b', q: 'Give one example each of a primary-based and a replicated-write protocol.', a: 'Primary-based: local-write or remote-write. Replicated-write: active replication or quorum-based protocols.' },
          { l: 'c', q: 'P1: W(x)a · P2: R(x)a W(x)b · P3: R(x)b R(x)a · P4: R(x)a R(x)b. Does the data-store violate causal consistency?', a: 'Yes. b causally depends on a (P2 read a before writing b), so every process must see a before b. However, P3 saw b before a.' },
          { l: 'd', q: 'Explain briefly the difference between data-centric and client-centric consistency.', a: 'Data-centric consistency maintains system-wide consistency for all replicas and does not focus on a single client. Client-centric consistency provides consistency for a single client that moves from one replica to another.' },
          { l: 'e', q: 'The reply from the RPC server was lost. Explain how the client should correctly handle this “lost reply failure”.', a: '1) The client starts a timer when sending the request; if it expires before a reply/ACK comes back, the request is sent again. 2) For non-idempotent requests: the client assigns each request a sequence number, the server keeps track of the most recent sequence number from each client, and can thus distinguish an original from a retransmission and refuse to carry out a request twice.' }
        ]
      },
      {
        n: 10, title: 'Chord DHT', w: 15,
        intro: () => `<p>A ring with m = 5 bits; five server replicas (1, 7, 15, 19, 29). Finger tables use succ(n + 2<sup>i−1</sup>), i = 1..5.</p>${ring([1, 7, 15, 19, 29])()}`,
        subs: [
          { l: 'a', q: 'Compute the finger tables for each of the five servers (show steps).', a: 'Server 1: succ(2)=7, succ(3)=7, succ(5)=7, succ(9)=15, succ(17)=19 · Server 7: succ(8)=15, succ(9)=15, succ(11)=15, succ(15)=15, succ(23)=29 · Server 15: succ(16)=19, succ(17)=19, succ(19)=19, succ(23)=29, succ(31)=1 · Server 19: succ(20)=29, succ(21)=29, succ(23)=29, succ(27)=29, succ(35 mod 32=3)=7 · Server 29: succ(30)=1, succ(31)=1, succ(33 mod 32=1)=1, succ(37 mod 32=5)=7, succ(45 mod 32=13)=15' },
          { l: 'b', q: 'A file is replicated with keys {1, 12, 17, 20, 31}. Which servers are responsible? Show the formula.', a: 'pred(server) &lt; k ≤ server. 1 → 1 · 12 → 15 · 17 → 19 · 20 → 29 · 31 → 1' },
          { l: 'c', q: 'Resolve the file with key 17 from server 7.', a: DHT_ALGO + '<br>Round 1: n=7, succ=15. 7&lt;17≤15? No. Finger(5)=29: 7&lt;29&lt;17? No. Finger(4)=15: 7&lt;15&lt;17? Yes → go to 15.<br>Round 2: n=15, succ=19. 15&lt;17≤19? Yes → <b>server 19</b>.' },
          { l: 'd', q: 'Resolve the file with key 12 from server 15.', a: 'Round 1: n=15, succ=19. 15&lt;12≤19? No. Finger(5)=1: 15&lt;1&lt;12 (wrap)? Yes → go to 1.<br>Round 2: n=1, succ=7. 1&lt;12≤7? No. Finger(5)=19? No. Finger(4)=15? No. Finger(3)=7: 1&lt;7&lt;12? Yes → go to 7.<br>Round 3: n=7, succ=15. 7&lt;12≤15? Yes → <b>server 15</b>.' },
          { l: 'e', q: 'Explain which features of the DHT provide scalability (one sentence).', a: 'Load/data is distributed over several servers, and lookup using the finger table completes in O(log n).' },
          { l: 'f', q: 'Explain which features provide fault-tolerance (one sentence).', a: 'Both data replication and process replication.' }
        ]
      }
    ]
  });

  /* ======================= MAI 2023 ======================= */
  D.exams.push({
    id: 'mai-2023', title: 'Eksamen 11. mai 2023', kind: 'past',
    note: 'Merk: i oppgave 3c bruker sensorveiledningen 3 × 0,0123 ≈ 0,037 s (avrundet). Nøyaktig: 3 × 0,0120033 ≈ 0,036 s.',
    tasks: [
      { n: 1, title: 'Flervalg', w: 10, mcSrc: 'mai 2023' },
      {
        n: 2, title: 'Prosjekt 3 – ChordDHT', w: 10, intro: 'This task is related to the mandatory project 3 on ChordDHT.',
        subs: [
          { l: 'a', q: 'What is the main goal of the ChordDHT system?', a: 'To provide distributed and cooperative file sharing where multiple providers of content cooperate to store and serve each other’s data.' },
          { l: 'b', q: 'Explain briefly how processes and files are given names (identifiers).', a: 'An address space of 2<sup>128</sup> is defined using MD5. Files are replicated N times by appending an index 0..N−1 to the file name, and MD5 gives each replica a unique identifier. Similarly MD5 of the process name gives each process its identifier. Identifier(replica) = Hash(replica), Identifier(process) = Hash(process).' },
          { l: 'c', q: 'findSuccessor() looks up a key. Which two helper methods are needed? Explain their purposes.', a: '<b>checkInterval</b>: checks whether a key lies between the predecessor of a node and the node, pred(node) &lt; key ≤ node. <b>findHighestPredecessor</b>: finds the node closest to (highest predecessor of) the key, node &lt; finger &lt; key, searching from the bottom of the finger table.' },
          { l: 'd', q: 'What type of sequential consistency protocol was implemented in project 3?', a: 'Remote-write protocol (primary-based).' },
          { l: 'e', q: 'What is the purpose of findPrimaryOfItem() in FileManager and what is the returned primary used for?', a: 'It finds which of the processes holding the file is the primary. The primary is used to coordinate writes to the other replicas.' },
          { l: 'f', q: 'In which task was LamportClock used, and for what purpose?', a: 'In the distributed mutual exclusion task. It provided timestamps and total ordering of the messages; the process with the lowest timestamp enters the critical region.' }
        ]
      },
      {
        n: 3, title: 'Forsinkelse og trafikkintensitet', w: 10,
        intro: () => `<p>Link R1–R2: R = 10<sup>8</sup> bit/s, d = 10<sup>3</sup> m, s = 3·10<sup>8</sup> m/s.</p><div class="figure">${F().delayNet()}</div>`,
        subs: [
          { l: 'a', q: 'A packet of L = 10<sup>5</sup> bits is sent on the link R1–R2. What is the transmission delay?', a: 'L/R = 10<sup>5</sup>/10<sup>8</sup> = 10<sup>−3</sup> = <b>0.001 s</b>.' },
          { l: 'b', q: 'R1 has processing delay 0.001 s and queuing delay 0.01 s. Compute the nodal delay at R1.', a: 'd_nodal = d_proc + d_queue + d_trans + d_prop = 0.001 + 0.01 + 0.001 + 10<sup>3</sup>/(3·10<sup>8</sup>) ≈ <b>0.012 s</b> (d_prop ≈ 0.0000033 s).' },
          { l: 'c', q: 'H1 and R2 have the same delays as R1 and all links are equal. Compute the end-to-end delay from H1 to H3.', a: 'The packet incurs processing, queuing, transmission and propagation delay at H1, R1 and R2: 3 × 0.012 ≈ <b>0.036–0.037 s</b>.' },
          { l: 'd', q: '10 packets/s of 10<sup>5</sup> bits arrive for the link R1–R2. Compute the traffic intensity.', a: 'La/R = (10<sup>5</sup> · 10)/10<sup>8</sup> = 10<sup>−2</sup> = <b>0.01</b>.' },
          { l: 'e', q: 'Will there be a queuing delay at R1 with this traffic intensity?', a: 'No (practically). Queuing delay arises when the traffic intensity approaches 1 and the capacity of the link starts to be exhausted.' }
        ]
      },
      {
        n: 4, title: 'HTTP', w: 10, intro: () => '<p>The figure shows the format of an HTTP request message.</p>' + F().http,
        subs: [
          { l: 'a', q: 'Explain what service HTTP provides and the function of the fields method and URL.', a: 'HTTP allows a client to create, read, update and delete resources (e.g., files) on an HTTP server. The method specifies which operation to perform; the URL specifies the resource.' },
          { l: 'b', q: 'Describe the typical exchange of messages between an HTTP client and server.', a: 'The client sends an HTTP request; the server processes it and sends back an HTTP response.' },
          { l: 'c', q: 'What role does TCP have in conjunction with HTTP?', a: 'TCP provides the underlying connection used by the HTTP client and server to send and receive requests and responses.' },
          { l: 'd', q: 'Which HTTP method is used to update a resource, and what part of the request contains the information?', a: 'PUT; the update data is in the entity body.' }
        ]
      },
      {
        n: 5, title: 'ARP, hub og svitsj', w: 10,
        intro: () => `<p>Same type of network as in May 2022: hub Hb (H1, H2, R) and switch Sw (R, H3, H4).</p><div class="figure">${F().hubSwitch(HUB_2022)}</div>`,
        subs: [
          { l: 'a', q: 'Explain briefly the purpose of ARP.', a: 'ARP maps IP addresses to link-layer addresses. To send an IP datagram to a node on the network, the link-layer address of that node is needed to encapsulate the datagram in a frame.' },
          { l: 'b', q: 'H1’s ARP table is empty. What will it contain after H1 has sent an IP datagram to H2? (justify)', a: 'H1 must have found H2’s link-layer address, so the table contains 132.200.1.2 → 2A:2B:2C:2D:2E:2F.' },
          { l: 'c', q: 'Sw’s table is empty. What will it contain after H3 sends to H4 and H4 sends back to H3? (justify)', a: 'Frames from H3 arrive on port 2 and from H4 on port 3: 2 → 3A:3B:3C:3D:3E:3F, 3 → 4A:4B:4C:4D:4E:4F.' },
          { l: 'd', q: 'An IP datagram is sent from H1 to H4 via R. What are the IP source and destination addresses?', a: 'Source 132.200.1.1 (H1), destination 221.198.1.4 (H4).' },
          { l: 'e', q: 'On the first hop H1 → R, what are the source and destination link-layer addresses of the frame? (justify)', a: 'Source 1A:1B:1C:1D:1E:1F (H1 sends the frame); destination 6A:6B:6C:6D:6E:6F (R’s interface 1 receives it).' },
          { l: 'f', q: 'A new host H0 arrives on the hub LAN. Which protocol does it use to automatically obtain an IP address?', a: 'DHCP (Dynamic Host Configuration Protocol).' }
        ]
      },
      {
        n: 6, title: 'IP-adresser og longest prefix match', w: 10,
        intro: () => `<div class="figure">${F().r1r4('132.202.1.1', '221.198.201.1')}</div>`,
        subs: [
          { l: 'a', q: 'What 32-bit pattern does 132.202.1.1 correspond to?', a: '10000100 11001010 00000001 00000001' },
          { l: 'b', q: 'What interval does the CIDR block 132.202.1.0/24 span?', a: '132.202.1.0 to 132.202.1.255.' },
          { l: 'c', q: 'R2: 10000100 11001010 00000001 → 1; 11011101 11000110 11001001 → 2; otherwise → 3. Interface for 132.202.1.1? (justify)', a: '132.202.1.1 = 10000100 11001010 00000001 00000001 matches the first entry → interface <b>1</b>.' },
          { l: 'd', q: 'Table modified: … → 1; 11011101 11000110 11001001 → 2; 11011101 11000110 11001001 0010 → 3; otherwise → 3. Interface for 221.198.201.42?', a: '221.198.201.42 = 11011101.11000110.11001001.00101010. Matches entries 2 and 3; entry 3 is the longest prefix → interface <b>3</b>.' },
          { l: 'e', q: 'How should the table be modified to send all datagrams for 221.198.201.64 – 221.198.201.127 via interface 3? (justify)', a: '64 = 01000000 and 127 = 01111111, so all have the prefix 11011101.11000110.11001001.01. Insert the entry <code>11011101.11000110.11001001.01 → 3</code>; longest prefix matching ensures they are now sent via interface 3.' },
          { l: 'f', q: 'Why are IP addresses used on the Internet instead of link-layer (MAC) addresses?', a: 'A link-layer address is specific for each network card and does not change, so nodes on the same network cannot share a common network part. Individual link-layer addresses would then have to be in router forwarding tables, causing scalability problems.' }
        ]
      },
      {
        n: 7, title: 'Distribusjonstransparens', w: 5,
        subs: [
          { l: 'a', q: 'Describe briefly what distribution transparency means.', a: 'Achieving a single-system image: making a collection of networked computers and processes appear as a single computer and process.' },
          { l: 'b', q: 'What are the various types of distribution transparency?', a: 'Access (data representation and how an object is accessed), Location (where), Relocation (moved while in use), Migration (moved), Replication, Concurrency (shared by several users), Failure (failure and recovery).' }
        ]
      },
      {
        n: 8, title: 'Overlay-multicast (6 prosesser)', w: 10,
        intro: () => '<p>Six processes (A–F) form an overlay; physical links via routers Ra–Rf.</p><div class="figure">' + F().overlay({
          routers: [
            { id: 'Ra', x: 110, y: 80, p: 'A', px: 40, py: 25 }, { id: 'Re', x: 260, y: 80, p: 'E', px: 260, py: 22 }, { id: 'Rc', x: 410, y: 80, p: 'C', px: 480, py: 25 },
            { id: 'Rb', x: 110, y: 190, p: 'B', px: 40, py: 245 }, { id: 'Rd', x: 260, y: 190, p: 'D', px: 260, py: 250 }, { id: 'Rf', x: 410, y: 190, p: 'F', px: 480, py: 245 }
          ],
          links: [['Ra', 'Re', 10], ['Re', 'Rc', 35], ['Ra', 'Rb', 25], ['Rb', 'Rd', 40], ['Rd', 'Rf', 15], ['Rf', 'Rc', 10]]
        }) + '</div>',
        subs: [
          { l: 'a', q: 'Draw the fully connected overlay graph with smallest delays.', a: 'A–E 12 · A–C 47 · A–B 27 · A–D 67 · A–F 57 · E–C 37 · E–B 37 · E–D 62 · E–F 47 · C–F 12 · C–D 27 · C–B 67 · B–D 42 · B–F 57 · D–F 17' },
          { l: 'b', q: 'Compute the RDP for a multicast from A to C using 1) B–A–E–C–D–F and 2) B–D–A–F–C–E. Which is more efficient?', a: 'Physical A–C = 47. Tree 1: A–E–C = 12+37 = 49 → RDP 1.04. Tree 2: A–F–C = 57+12 = 69 → RDP 1.47. Tree 1 is more efficient (≈ same cost as the routers).' },
          { l: 'c', q: 'Compute the tree costs. Which tree is more efficient overall?', a: 'Tree 1 = 27+12+37+27+17 = <b>120</b>. Tree 2 = 42+67+57+12+37 = <b>215</b>. Tree 1 has the lower global cost.' }
        ]
      },
      {
        n: 9, title: 'Skalerbarhet, asynkron RPC, ordning og vektorklokker', w: 10,
        subs: [
          { l: 'a', q: 'DNS name resolution (iterative and recursive, figure with long-distance communication): i) What scalability challenges? ii) How are they solved in DNS?', a: 'i) Size scalability and geographical scalability. ii) Extensive replication at global and administrational levels, and caching at the client’s local DNS server.' },
          { l: 'b', q: 'What is the main goal of asynchronous RPC? Describe how it is designed to achieve this goal.', a: 'Get rid of the strict request-reply behaviour and let the client continue working while waiting for the result. Designs: 1) acknowledgement only from server; 2) deferred synchronous calls using multithreading and callbacks; 3) multicast RPC – tasks to several servers, results via callbacks.' },
          { l: 'c', q: 'Explain the difference between primary-based and replicated-write protocols.', a: 'Primary-based: only one process (primary) can perform writes (single-leader). Replicated-write: writes can be performed by more than one process (multi-leader).' },
          { l: 'd', q: 'P1 sends m1 then m2; P5 sends m3 then m4; P2, P3, P4 receive all four. i) Write all possible FIFO orderings. ii) If FIFO-atomic ordered, give one possible ordering at P2, P3, P4.', a: 'i) m1,m3,m4,m2 · m1,m2,m3,m4 · m1,m3,m2,m4 · m3,m4,m1,m2 · m3,m1,m4,m2 · m3,m1,m2,m4. ii) All three receivers deliver in the same of these orders, e.g. P2, P3, P4: m1, m3, m4, m2.' },
          { l: 'e', q: () => 'Compute the vector clocks. (si/ri = send/receive, other letters are local events.)' + F().vcTable([['P1', 's1', 's2', 'a'], ['P2', 'r1', 'b', 'r2'], ['P3', 'c', 's3', 'd'], ['P4', 'r3', 'e', 'f']]), a: () => 'Rule 1: pi(ci) ← pi(ci)+1 (send/local). Rule 2: receive: max then rule 1.' + F().vcTable([['P1', '1000', '2000', '3000'], ['P2', '1100', '1200', '2300'], ['P3', '0010', '0020', '0030'], ['P4', '0021', '0022', '0023']]) }
        ]
      },
      {
        n: 10, title: 'Chord DHT og non-repudiation', w: 15,
        intro: () => `<p>m = 5; six servers (3, 9, 10, 17, 25, 31). Finger tables: succ(n + 2<sup>i−1</sup>).</p>${ring([3, 9, 10, 17, 25, 31])()}`,
        subs: [
          { l: 'a', q: 'Compute the finger tables.', a: '3: 9, 9, 9, 17, 25 · 9: 10, 17, 17, 17, 25 · 10: 17, 17, 17, 25, 31 · 17: 25, 25, 25, 25, 3 · 25: 31, 31, 31, 3, 9 · 31: 3, 3, 3, 9, 17', x: 'F.eks. 25: succ(26)=31, succ(27)=31, succ(29)=31, succ(33 mod 32=1)=3, succ(41 mod 32=9)=9.' },
          { l: 'b', q: 'Keys {2, 11, 15, 18}. Which servers are responsible? Show the formula.', a: 'pred(server) &lt; key ≤ server: 2 → 3 · 11 → 17 · 15 → 17 · 18 → 25' },
          { l: 'c', q: 'Resolve key 18 from server 31.', a: 'Round 1: n=31, succ=3: 31&lt;18≤3? No. Finger(5)=17: 31&lt;17&lt;18 (wrap)? Yes → 17. Round 2: n=17, succ=25: 17&lt;18≤25 → <b>server 25</b>.' },
          { l: 'd', q: 'Which features provide fault-tolerance and scalable search?', a: 'Data and process replication give fault tolerance; the finger table (routing) gives scalable search in O(log n).' },
          { l: 'e', q: 'What cryptography solution provides non-repudiation among the servers? Prove that it works.', a: 'Symmetric keys cannot, since both parties share the key. Public-key cryptography / digital signatures can: each server has K<sup>+</sup> and K<sup>−</sup> (only the owner knows K<sup>−</sup>). The sender signs the message digest with K<sup>−</sup> and sends message + signature; the receiver decrypts the signature with the sender’s K<sup>+</sup>, recomputes the digest with the same hash and compares. If equal, the message came from the sender, who cannot deny having signed since only they know K<sup>−</sup>.' }
        ]
      }
    ]
  });

  /* ======================= JAN 2024 ======================= */
  D.exams.push({
    id: 'jan-2024', title: 'Eksamen 4. januar 2024', kind: 'past',
    note: 'Merk: i oppgave 6b har både H0 og R1 sitt grensesnitt adressen 132.200.1.3 i originalteksten (en feil i oppgaven). Poenget er at H0 skal spørre etter IP-adressen til R1 sitt grensesnitt 1.',
    tasks: [
      { n: 1, title: 'Flervalg', w: 10, mcSrc: 'jan 2024' },
      {
        n: 2, title: 'Prosjekt 2 – publish-subscribe', w: 10, intro: 'This task is related to the mandatory project 2 on publish-subscribe messaging middleware.',
        subs: [
          { l: 'a', q: 'List the main components implemented in the Broker and explain their purpose.', a: 'MessagingServer (underlying messaging service receiving messages from clients), Broker (loop handling clients connecting), Dispatcher (processes the different messages that can be received), Storage (stores information about connected clients and which clients subscribe to which topics).' },
          { l: 'b', q: 'The middleware was implemented on top of a messaging layer. What service did it provide?', a: 'A message abstraction on top of TCP enabling a client and a server to reliably exchange (short) messages.' },
          { l: 'c', q: 'What information does a messaging client need to contact a messaging server?', a: 'The IP address of the host where the server runs and the port the server listens on.' },
          { l: 'd', q: 'How does the broker identify the clients a published message should be sent to?', a: 'Via Storage, which has a HashMap that for each topic (key) stores the list/set of clients (values) subscribing to that topic.' },
          { l: 'e', q: 'Explain how a Stopable-thread works and what tasks it can be used for.', a: 'Built on Thread; its run method continuously executes doProcess until doStop is called. By implementing doProcess, the thread can continuously perform a task (e.g., accepting connections, dispatching messages).' },
          { l: 'f', q: 'Sketch how the broker could process multiple client sessions in parallel (multiple cores).', a: 'Change the broker so that waitConnect creates a new dispatcher thread for each connecting client; that thread handles the requests from that client.' }
        ]
      },
      {
        n: 3, title: 'Forsinkelse og flaskehals', w: 10,
        intro: () => `<p>Link R1–R2: R = 10<sup>5</sup> bit/s, d = 10<sup>4</sup> m, s = 2·10<sup>8</sup> m/s.</p><div class="figure">${F().delayNet()}</div>`,
        subs: [
          { l: 'a', q: 'Packet L = 10<sup>4</sup> bits. Transmission delay?', a: '10<sup>4</sup>/10<sup>5</sup> = <b>0.1 s</b>.' },
          { l: 'b', q: 'R1: processing 0.005 s, queuing 0.02 s. Nodal delay at R1?', a: 'd_prop = 10<sup>4</sup>/(2·10<sup>8</sup>) = 0.00005 s. d_nodal = 0.1 + 0.005 + 0.02 + 0.00005 = <b>0.12505 s</b>.' },
          { l: 'c', q: 'H1 and R2 have the same delays; all links equal. End-to-end delay H1 → H3?', a: '3 × 0.12505 = <b>0.37515 s</b> (nodal delay at H1, R1 and R2).' },
          { l: 'd', q: 'Links H1/H2→R1 = 100 Mbps, R1–R2 = 10 Mbps, R2–H3 = 50 Mbps. Which link is the bottleneck? (justify)', a: 'The bottleneck is the link with the lowest capacity on the path: <b>R1–R2</b> (10 Mbps).' }
        ]
      },
      {
        n: 4, title: 'UDP', w: 10, intro: () => '<p>The figure shows the format of UDP segments.</p>' + F().udp,
        subs: [
          { l: 'a', q: 'Explain briefly what service UDP provides.', a: 'A connectionless transport-layer service where loss, duplication and overtaking (reordering) of segments is possible.' },
          { l: 'b', q: 'Explain the function of Source port, Dest. port, Length, Checksum, Application data.', a: 'Source port: the port on the host the segment is sent from. Dest. port: the port on the receiving host where the segment is delivered. Length: total length in bytes of the segment. Checksum: detect transmission errors (header and data). Application data: the actual data exchanged between applications.' },
          { l: 'c', q: 'Give an example of an application-layer protocol that relies on UDP. Why UDP and not TCP?', a: 'DNS – a request-response protocol mapping hostnames to IP addresses. Using TCP would give large overhead due to connection establishment for each request-response.' },
          { l: 'd', q: 'What kind of packet is a UDP segment encapsulated in when transmitted over the Internet?', a: 'As data in an IP datagram (whose header contains e.g. the destination IP address).' }
        ]
      },
      {
        n: 5, title: 'Distance-vector', w: 10,
        intro: () => `<div class="figure">${F().dv({ R1R2: 7, R1R3: 2, R2R3: 1, R3R4: 5 })}</div><pre>Initialization
  for all destinations y in N: Dx(y) = c(x,y)  // ∞ if y is not a neighbor
  for each neighbor w: Dw(y) = ? for all y
  for each neighbor w: send Dx to w
Loop
  wait until link cost change or receive distance vector from neighbor
  for each y in N: Dx(y) = min_v{c(x,v) + Dv(y)}
  if Dx(y) changed for any y: send Dx to all neighbors
forever</pre>`,
        subs: [
          { l: 'a', q: 'What is the least-cost path from R1 to R4?', a: 'R1 → R3 → R4 with cost 2 + 5 = <b>7</b>.' },
          { l: 'b', q: 'Specify D_R2 and D_R3 after the initialization part.', a: 'D_R2 = [R1: 7, R2: 0, R3: 1, R4: ∞] · D_R3 = [R1: 2, R2: 1, R3: 0, R4: 5]' },
          { l: 'c', q: 'R2 has D_R2 = [7, 0, 1, ∞] and receives D_R3 = [2, 1, 0, 5]. What is D_R2 after the update?', a: '[R1: 3 (1+2), R2: 0, R3: 1, R4: 6 (1+5)]' },
          { l: 'd', q: 'What will D_R2 be after the algorithm has fully executed (no further changes)?', a: '[3, 0, 1, 6]' }
        ]
      },
      {
        n: 6, title: 'DHCP, ARP, innkapsling og forwarding', w: 10,
        intro: () => `<div class="figure">${F().net2024(false)}</div>`,
        subs: [
          { l: 'a', q: 'A new host H0 arrives at the LAN with H1 and H2. Which protocol can it use to configure its interface with an IP address?', a: 'DHCP – Dynamic Host Configuration Protocol.' },
          { l: 'b', q: 'H0 is to send a datagram to H5; first hop H0 → R1. What IP address should H0 specify in the ARP query for the link-layer address of interface 1 of R1? (justify)', a: 'The IP address of the interface the datagram is sent via, i.e. R1’s interface 1: <b>132.200.1.3</b>.' },
          { l: 'c', q: 'A datagram is sent from H0 via R1, R3 to H5. How many times is it encapsulated into a frame and decapsulated? (justify)', a: 'Encapsulated 3 times (at H0 to send to R1, at R1 to send to R3, at R3 to send to H5) and decapsulated 3 times (R1, R3, H5). No encapsulation/decapsulation at S1 since a switch operates at the link layer.' },
          { l: 'd', q: 'What 32-bit pattern does 132.200.1.1 correspond to?', a: '10000100.11001000.00000001.00000001' },
          { l: 'e', q: 'R1: 10000100 11001000 00000001 → 1; 11011101 11000110 00000001 → 2; 01101100 11001001 00000001 → 3; otherwise → 1. Interfaces for i) 108.201.1.5 ii) 221.198.1.3 iii) 236.201.1.1?', a: 'i) 01101100.11001001.00000001.00000101 → <b>3</b>. ii) 11011101.11000110.00000001.00000011 → <b>2</b>. iii) 11101100.11001001.00000001.00000001 – no prefix match → <b>1</b>.' }
        ]
      },
      {
        n: 7, title: 'Tråder og transparens', w: 5,
        subs: [
          { l: 'a', q: 'Briefly explain the purpose of multi-threading in server design.', a: 'It allows the server to handle multiple requests from clients without blocking, and to exploit multi-processor architectures for better performance.' },
          { l: 'b', q: 'Briefly explain what access transparency means.', a: 'Hiding differences in data representation and the way objects can be accessed.' }
        ]
      },
      {
        n: 8, title: 'Overlay-multicast', w: 10,
        intro: () => `<div class="figure">${F().overlay5({ ae: 40, ab: 15, bc: 20, cd: 10, de: 15 })}</div>`,
        subs: [
          { l: 'a', q: 'Draw the fully connected overlay graph with smallest delays.', a: 'A–B 17 · A–C 37 · A–D 47 · A–E 42 · B–C 22 · B–D 32 · B–E 47 · C–D 12 · C–E 27 · D–E 17' },
          { l: 'b', q: 'RDP from B to E using 1) B–C–A–D–E and 2) A–B–C–E–D. Which is more efficient?', a: 'Best physical B–E = 47. Tree 1: B–C–A–D–E = 22+37+47+17 = 123 → RDP 2.62. Tree 2: B–C–E = 22+27 = 49 → RDP 1.04. Tree 2 is more efficient (nearly the cost of the physical network).' },
          { l: 'c', q: 'Compute the tree costs. Which tree is more efficient?', a: 'Tree 1 = 22+37+47+17 = <b>123</b>. Tree 2 = 17+22+27+17 = <b>83</b>. Tree 2 has significantly lower total delay.' }
        ]
      },
      {
        n: 9, title: 'Asynkron RPC, replikering, grupper og vektorklokker', w: 10,
        subs: [
          { l: 'a', q: 'Describe the possible designs of asynchronous RPC.', a: 'Goal: continue working while waiting. Combine multithreading and callbacks. 1) Acknowledgement only from the server (no result). 2) Deferred synchronous calls: acknowledgement first, then a one-way call/callback interrupts the client with the result. 3) Multicast RPC: tasks to several servers, results back via callbacks.' },
          { l: 'b', q: 'Explain the reasons for replication in distributed systems.', a: 'Fault-tolerance (switch to another replica on crash), performance (data close to users; load balancing), scalability (avoid bottleneck at the main server), availability (data stored at several locations).' },
          { l: 'c', q: 'Briefly explain the two ways to arrange the replication of a fault-tolerant group of processes.', a: 'Flat group: leaderless, decisions made collectively (e.g. replicated-write). Hierarchical group: one elected coordinator and workers; the coordinator decides who does the job (e.g. primary-based).' },
          { l: 'd', q: () => 'Compute the vector clocks.' + F().vcTable([['P1', 'a', 's1', 's2'], ['P2', 'b', 'c', 'd'], ['P3', 'r1', 'e', 's3'], ['P4', 'r2', 'r3', 'f']]), a: () => F().vcTable([['P1', '1000', '2000', '3000'], ['P2', '0100', '0200', '0300'], ['P3', '2010', '2020', '2030'], ['P4', '3001', '3032', '3033']]) }
        ]
      },
      {
        n: 10, title: 'Chord DHT', w: 15,
        intro: () => `<p>m = 5; six servers (1, 5, 10, 15, 20, 29).</p>${ring([1, 5, 10, 15, 20, 29])()}`,
        subs: [
          { l: 'a', q: 'Compute the finger tables.', a: '1: 5, 5, 5, 10, 20 · 5: 10, 10, 10, 15, 29 · 10: 15, 15, 15, 20, 29 · 15: 20, 20, 20, 29, 1 · 20: 29, 29, 29, 29, 5 · 29: 1, 1, 1, 5, 15' },
          { l: 'b', q: 'Keys {5, 14, 20, 25}. Which servers? Show the formula.', a: 'pred(server) &lt; key ≤ server: 5 → 5 · 14 → 15 · 20 → 20 · 25 → 29' },
          { l: 'c', q: 'Resolve key 18 from server 1.', a: 'Round 1: n=1, succ=5: no. Finger(5)=20: 1&lt;20&lt;18? No. Finger(4)=10: yes → 10. Round 2: n=10, succ=15: 10&lt;18≤15? No. Finger(5)=29 no, Finger(4)=20 no, Finger(3)=15: 10&lt;15&lt;18 yes → 15. Round 3: n=15, succ=20: 15&lt;18≤20 → <b>server 20</b>.' },
          { l: 'd', q: 'Which features provide fault-tolerance and scalable search?', a: 'Data and process replication → fault tolerance. Finger table routing → scalable search in O(log n).' }
        ]
      }
    ]
  });

  /* ======================= MAI 2024 ======================= */
  D.exams.push({
    id: 'mai-2024', title: 'Eksamen 30. mai 2024', kind: 'past',
    tasks: [
      { n: 1, title: 'Flervalg', w: 10, mcSrc: 'mai 2024' },
      {
        n: 2, title: 'Prosjekt 3 – ChordDHT', w: 10,
        subs: [
          { l: 'a', q: 'What is the main purpose of the ChordDHT system?', a: 'Distributed and cooperative file sharing where multiple providers of content cooperate to store and serve each other’s files, ensuring scalability, performance, high availability and fault-tolerance.' },
          { l: 'b', q: 'How is the address size calculated?', a: 'Using MD5 with 128 bits: the address size is 2<sup>128</sup>.' },
          { l: 'c', q: 'What entities are given addresses?', a: 'The servers (processes) and the files.' },
          { l: 'd', q: 'What is the purpose of the finger table?', a: 'A routing table for efficiently and scalably resolving keys in O(log n).' },
          { l: 'e', q: 'Which approaches coordinate concurrent updates of the same file?', a: 'Distributed mutual exclusion and the remote-write protocol.' }
        ]
      },
      {
        n: 3, title: 'Gjennomstrømning og linkutnyttelse', w: 10,
        intro: '<p>Four servers S1–S4 and four clients C1–C4 share a middle link R1–R2 of R = 100 Mbps. Each server link Rs = 80 Mbps, each client link Rc = 40 Mbps.</p>',
        subs: [
          { l: 'a', q: 'Maximum achievable end-to-end throughput for each pair if the middle link is fairly shared? (justify)', a: '<b>25 Mbps</b> (100/4). Although servers can send at 80 and clients receive at 40, the shared middle link gives each pair only 25 Mbps.' },
          { l: 'b', q: 'Which link is the bottleneck? (justify)', a: 'The middle link R (same argument as in a).' },
          { l: 'c', q: 'Servers send at max rate. What are the link utilizations for the server links?', a: '25/80 = <b>0.31</b>' },
          { l: 'd', q: 'What are the link utilizations for the client links?', a: '25/40 = <b>0.62</b>' }
        ]
      },
      {
        n: 4, title: 'TCP/IP-stakken og pålitelig overføring', w: 10,
        subs: [
          { l: 'a', q: 'What are the five levels of the TCP/IP protocol stack?', a: 'Physical, Link, Network, Transport, Application.' },
          { l: 'b', q: 'Which layers are implemented by routers and which by hosts?', a: 'Routers: layers 1–3 (Physical, Link, Network). Hosts: all five layers.' },
          { l: 'c', q: 'Purposes of checksum, timer, sequence number and acknowledgement in TCP reliable data transfer?', a: 'Checksum: detect bit errors. Timer: time out and retransmit a packet because the packet or its ACK was lost. Sequence number: sequential numbering; gaps let the receiver detect loss, duplicates let it detect duplicate copies. Acknowledgement: receiver tells the sender a packet was received correctly; sender detects loss when no ACK arrives.' },
          { l: 'd', q: 'What kind of packet is a TCP segment encapsulated in?', a: 'An IP datagram at the network layer.' }
        ]
      },
      {
        n: 5, title: 'Distance-vector', w: 10,
        intro: () => `<div class="figure">${F().dv({ R1R3: 8, R2R3: 2, R2R4: 1, R3R4: 5 })}</div>`,
        subs: [
          { l: 'a', q: 'Least-cost path from R1 to R4?', a: 'R1–R3–R2–R4 = 8+2+1 = <b>11</b>.' },
          { l: 'b', q: 'Distance vectors for R1–R4 after initialization.', a: 'D_R1 = [0, ∞, 8, ∞] · D_R2 = [∞, 0, 2, 1] · D_R3 = [8, 2, 0, 5] · D_R4 = [∞, 1, 5, 0]' },
          { l: 'c', q: 'R1 has [0, 10, 8, 13] and receives D_R3 = [8, 2, 0, 3]. New D_R1?', a: '[0, 10, 8, <b>11</b>] (R4 via R3: 8 + 3).' },
          { l: 'd', q: 'R4 has [13, 1, 3, 0] and receives D_R2 = [10, 0, 2, 1] and D_R3 = [8, 2, 0, 3]. New D_R4?', a: 'R1: min(1+10, 5+8) = 11 → [<b>11</b>, 1, 3, 0].' }
        ]
      },
      {
        n: 6, title: 'DHCP, ARP, svitsjetabell og forwarding', w: 10,
        intro: () => `<div class="figure">${F().net2024(true)}</div>`,
        subs: [
          { l: 'a', q: 'A new host H6 (MAC 6A:6B:6C:6D:6E:6F) attaches to interface 1 of S1. Which protocol can it use to get an IP address?', a: 'DHCP.' },
          { l: 'b', q: 'H6 got 108.201.1.6 and sends to H1; first hop to R3. What IP address in the ARP query for R3’s interface 1? (justify)', a: 'The IP address of R3’s interface 1: <b>108.201.1.3</b>.' },
          { l: 'c', q: 'Content of S1’s switch table after H6 has sent a datagram to H4? (justify)', a: 'H6 first ARPs for R3; the switch learns H6’s MAC on interface 1. R3 replies; the switch learns R3’s MAC on interface 3. Table: 6A:6B:6C:6D:6E:6F → 1, 38:3B:3C:3D:3E:3F → 3.' },
          { l: 'd', q: 'What 32-bit pattern does 108.201.1.6 correspond to?', a: '01101100.11001001.00000001.00000110' },
          { l: 'e', q: 'R1: 11011101 11000110 00000001 → 2; 10000100 11001000 00000001 → 1; 01101100 11001001 00000001 → 3; otherwise → 1. Interfaces for i) 221.198.1.4 ii) 236.200.1.5 iii) 108.201.1.6?', a: 'i) match → <b>2</b> · ii) 11101100… no match → <b>1</b> · iii) match → <b>3</b>' }
        ]
      },
      {
        n: 7, title: 'RPC og feiltransparens', w: 5,
        subs: [
          { l: 'a', q: 'What is the purpose of using multithreading and callback mechanisms in RPC design?', a: 'To avoid blocking by constructing an asynchronous RPC, allowing the processes to continue running.' },
          { l: 'b', q: 'What is failure transparency?', a: 'Hiding the failure and recovery of an object: users/applications do not notice that some part fails, and the system subsequently (automatically) recovers.' }
        ]
      },
      {
        n: 8, title: 'Overlay-multicast (6 prosesser)', w: 10,
        intro: () => '<div class="figure">' + F().overlay({
          routers: [
            { id: 'Ra', x: 110, y: 80, p: 'A', px: 40, py: 25 }, { id: 'Rf', x: 260, y: 80, p: 'F', px: 260, py: 22 }, { id: 'Re', x: 410, y: 80, p: 'E', px: 480, py: 25 },
            { id: 'Rb', x: 110, y: 190, p: 'B', px: 40, py: 245 }, { id: 'Rc', x: 260, y: 190, p: 'C', px: 260, py: 250 }, { id: 'Rd', x: 410, y: 190, p: 'D', px: 480, py: 245 }
          ],
          links: [['Ra', 'Rf', 25], ['Rf', 'Re', 30], ['Ra', 'Rb', 10], ['Rb', 'Rc', 15], ['Rc', 'Rd', 10], ['Rd', 'Re', 15]]
        }) + '</div>',
        subs: [
          { l: 'a', q: 'Draw the fully connected overlay graph.', a: 'A–F 27 · A–E 52 · A–B 12 · A–C 27 · A–D 37 · F–E 32 · F–B 37 · F–C 52 · F–D 47 · E–D 17 · E–C 27 · E–B 42 · B–C 17 · B–D 27 · C–D 12' },
          { l: 'b', q: 'RDP from F to C using 1) F–A–E–D–B–C and 2) F–A–B–C–D–E?', a: 'Best F–C = 52. Tree 1: 27+52+17+27+17 = 140 → RDP 2.7. Tree 2: F–A–B–C = 27+12+17 = 56 → RDP 1.07. Tree 2 is more efficient.' },
          { l: 'c', q: 'Tree costs?', a: 'Tree 1 = 140, Tree 2 = 27+12+17+12+17 = 85. Tree 2 is more efficient.' }
        ]
      },
      {
        n: 9, title: 'Grupper, lost request og vektorklokker', w: 10,
        subs: [
          { l: 'a', q: 'Explain the two ways to arrange replication of a fault-tolerant group, with an example of each.', a: 'Flat group: leaderless, decisions collectively – e.g. replicated-write protocol. Hierarchical group: elected coordinator and workers – e.g. primary-based protocol.' },
          { l: 'b', q: 'The request to the RPC server was lost. How should client and server handle it?', a: 'Client: start a timer before sending, assign each request a sequence number, retransmit if no ACK before timeout. Server: for non-idempotent requests, keep track of the most recently received sequence number to detect retransmissions.' },
          { l: 'c', q: () => 'Compute the vector clocks.' + F().vcTable([['P1', 's1', 'a', 's2', 'b'], ['P2', 'c', 'd', 'e', 'f'], ['P3', 'r1', 'g', 's3', 'r4'], ['P4', 'r2', 'h', 'r3', 's4']]), a: () => F().vcTable([['P1', '1000', '2000', '3000', '4000'], ['P2', '0100', '0200', '0300', '0400'], ['P3', '1010', '1020', '1030', '3044'], ['P4', '3001', '3002', '3033', '3034']]) }
        ]
      },
      {
        n: 10, title: 'Chord DHT', w: 15,
        intro: () => `<p>m = 5; four servers (0, 9, 17, 30).</p>${ring([0, 9, 17, 30])()}`,
        subs: [
          { l: 'a', q: 'Compute the finger tables.', a: '0: 9, 9, 9, 9, 17 · 9: 17, 17, 17, 17, 30 · 17: 30, 30, 30, 30, 9 · 30: 0, 0, 9, 9, 17' },
          { l: 'b', q: 'Keys {2, 5, 19, 30}. Responsible servers?', a: '2 → 9 · 5 → 9 · 19 → 30 · 30 → 30' },
          { l: 'c', q: 'Resolve key 12 from server 0.', a: 'Round 1: n=0, succ=9: 0&lt;12≤9? No. Finger(5)=17 no; Finger(4)=9: 0&lt;9&lt;12 yes → 9. Round 2: n=9, succ=17: 9&lt;12≤17 → <b>17</b>.' },
          { l: 'd', q: 'Processes and data are replicated. What problem is solved?', a: 'Fault-tolerance, scalability, performance and availability – e.g. if a process fails another can take over; if data is corrupted at one process a replica can be obtained elsewhere.' },
          { l: 'e', q: 'Which feature provides scalable search?', a: 'The finger table – storing exponentially distant nodes lets search complete in O(log n).' }
        ]
      }
    ]
  });

  /* ======================= JAN 2025 ======================= */
  D.exams.push({
    id: 'jan-2025', title: 'Eksamen 7. januar 2025', kind: 'past',
    note: 'Samme dato og semester som din eksamen (7. januar) – en god indikator på formatet.',
    tasks: [
      { n: 1, title: 'Flervalg', w: 10, mcSrc: 'jan 2025' },
      {
        n: 2, title: 'Prosjekt 1 – sockets og RPC', w: 10,
        subs: [
          { l: 'a', q: 'List the three protocol layers implemented in the project and explain how they are related.', a: 'IoT application layer, RPC layer and Messaging layer. The messaging layer was implemented on top of TCP and used to implement the RPC layer; the RPC layer was used by the IoT application layer to implement the sensor-display-controller system.' },
          { l: 'b', q: 'Messages in task 1 have a fixed length of 128 bytes. Explain the purpose of the first 8 bits and why they are needed.', a: 'They specify the number of payload bytes in the subsequent 127 bytes. Needed because messages have a fixed length of 128 bytes (room for up to 127 bytes) but not all messages carry 127 bytes of payload.' },
          { l: 'c', q: 'What two elements identify a socket at the transport layer?', a: 'An IP address and a port number.' },
          { l: 'd', q: 'When the RPC server receives a request, how does it identify the method to be invoked?', a: 'The first byte of the RPC request (carried as payload in the messaging layer) specifies the number of the RPC method, which is used to look up the method in the RPC table on the server.' }
        ]
      },
      {
        n: 3, title: 'Forsinkelse og flaskehals', w: 10,
        intro: () => `<p>Link R1–R2: R = 10<sup>6</sup> bit/s, d = 10<sup>4</sup> m, s = 5·10<sup>8</sup> m/s.</p><div class="figure">${F().delayNet()}</div>`,
        subs: [
          { l: 'a', q: 'Packet L = 10<sup>3</sup> bits. Transmission delay?', a: 'd_trans = L/R = 10<sup>3</sup>/10<sup>6</sup> = <b>0.001 s</b>' },
          { l: 'b', q: 'R1: processing 0.002 s, queuing 0.01 s. Nodal delay?', a: 'd_prop = 10<sup>4</sup>/(5·10<sup>8</sup>) = 0.00002 s. d_nodal = 0.002 + 0.01 + 0.00002 + 0.001 = <b>0.01302 s</b>' },
          { l: 'c', q: 'End-to-end delay H1 → H3 (same delays everywhere)?', a: '3 × 0.01302 = <b>0.03906 s</b>' },
          { l: 'd', q: 'H1/H2→R1 = 50 Mbps, R1–R2 = 100 Mbps, R2–H3 = 10 Mbps. Bottleneck?', a: 'The link with minimum capacity: <b>R2–H3</b> (10 Mbps).' }
        ]
      },
      {
        n: 4, title: 'IPv4-headeren', w: 10, intro: () => F().ipv4,
        subs: [
          { l: 'a', q: 'What service does the IP protocol provide?', a: 'Unreliable multi-hop end-to-end transmission of datagrams.' },
          { l: 'b', q: 'Explain the purpose of Identifier, Flags and Fragmentation offset.', a: 'Identifier: which fragments belong to the same original datagram. Flags: when reassembly is complete (flag = 0 → last fragment). Fragmentation offset: where in the original datagram the fragment was positioned.' },
          { l: 'c', q: 'Explain Time-to-live, Source IP, Destination IP and Data.', a: 'TTL: detect routing loops (decremented per hop). Source IP: the sender. Destination IP: the receiver. Data: the actual data transmitted.' },
          { l: 'd', q: 'How does a sender specify whether the datagram contains UDP or TCP?', a: 'Using the Upper-layer protocol field.' }
        ]
      },
      {
        n: 5, title: 'Distance-vector', w: 10,
        intro: () => `<div class="figure">${F().dv({ R1R3: 5, R2R3: 2, R2R4: 8, R3R4: 1 })}</div>`,
        subs: [
          { l: 'a', q: 'Least-cost path from R1 to R4?', a: 'R1 → R3 → R4 = <b>6</b>' },
          { l: 'b', q: 'Distance vectors after initialization.', a: 'D_R1 = [0, ∞, 5, ∞] · D_R2 = [∞, 0, 2, 8] · D_R3 = [5, 2, 0, 1] · D_R4 = [∞, 8, 1, 0]' },
          { l: 'c', q: 'R1 has [0, 7, 5, 6] and receives D_R3 = [5, 2, 0, 1]. New D_R1?', a: '[0, 7, 5, 6] – unchanged (5+2 = 7, 5+1 = 6).' },
          { l: 'd', q: 'R4 has [6, 3, 1, 0] and receives D_R2 = [7, 0, 2, 3] and D_R3 = [5, 2, 0, 1]. New D_R4?', a: '[6, 3, 1, 0] – unchanged.' }
        ]
      },
      {
        n: 6, title: 'ARP, svitsj og CIDR', w: 10,
        intro: () => `<div class="figure">${F().switch3()}</div>`,
        subs: [
          { l: 'a', q: 'Content of H1’s ARP table after a datagram has been sent from H1 to H3?', a: '192.168.0.3 → 3A:3B:3C:3D:3E:3F' },
          { l: 'b', q: 'Content of the switch table after a datagram has been sent from H1 to H3?', a: '1A:1B:1C:1D:1E:1F → 3 · 3A:3B:3C:3D:3E:3F → 1', x: 'H1 sin ARP-query (kilde 1A…, port 3) og H3 sin ARP-reply (kilde 3A…, port 1).' },
          { l: 'c', q: 'What interval does 224.192.40.0/22 span? (justify)', a: '22-bit prefix: third byte 40 = 001010|00 → host part is the last 2 bits of byte 3 + byte 4. Interval <b>224.192.40.0 – 224.192.43.255</b>.', x: 'Sensorveiledningen har en trykkfeil i binærtallet (11001000 = 200 i stedet for 224 = 11100000), men intervallet er riktig.' },
          { l: 'd', q: 'What 32-bit pattern does 200.193.57.14 correspond to?', a: '11001000 11000001 00111001 00001110' },
          { l: 'e', q: 'Router: 11001000 11000001 001010 → 1; 11001000 11000001 001111 → 2; 00101000 00110101 0010100 → 3; otherwise → 4. Interfaces for i) 200.193.42.10 ii) 200.193.57.14 iii) 10.53.40.7?', a: 'i) 11001000 11000001 00101010 … → <b>1</b> · ii) …00111001 … no match → <b>4</b> · iii) 00001010 … no match → <b>4</b>' }
        ]
      },
      {
        n: 7, title: 'Servere og kommunikasjon', w: 5,
        subs: [
          { l: 'a', q: 'Describe the difference between stateful and stateless servers.', a: 'Stateful servers maintain persistent information about their clients; stateless servers keep no information about client state and can change their own state without informing any client.' },
          { l: 'b', q: 'Describe the difference between synchronous and asynchronous communication.', a: 'Synchronous: the sender is blocked until its request is known to be accepted. Asynchronous: the sender continues immediately after submitting its message for transmission.' }
        ]
      },
      {
        n: 8, title: 'Overlay-multicast', w: 10,
        intro: () => `<div class="figure">${F().overlay5({ ae: 40, ab: 5, bc: 10, cd: 5, de: 5 })}</div>`,
        subs: [
          { l: 'a', q: 'Draw the fully connected overlay graph.', a: 'A–B 7 · A–C 17 · A–D 22 · A–E 27 · B–C 12 · B–D 17 · B–E 22 · C–D 7 · C–E 12 · D–E 7' },
          { l: 'b', q: 'RDP from A to D using 1) A–E–D–B–C and 2) A–B–C–E–D?', a: 'Best A–D = 22. Tree 1: A–E–D = 27+7 = 34 → RDP 1.54. Tree 2: A–B–C–E–D = 7+12+12+7 = 38 → RDP 1.73. Tree 1 is better for A→D.' },
          { l: 'c', q: 'Tree costs?', a: 'Tree 1 = 63, Tree 2 = 38. Tree 2 is less costly overall.' }
        ]
      },
      {
        n: 9, title: 'Pålitelig multicast, RPC-feil og konsistens', w: 10,
        subs: [
          { l: 'a', q: 'How is hierarchical feedback control used in reliable group multicasting with feedback messages?', a: 'For scalability with very large groups, receivers are partitioned into subgroups organized in a tree. Each subgroup has a local coordinator C handling retransmission requests in its subgroup; if C misses m, it asks the coordinator of the sender’s (parent) subgroup. ACK/NACK go between coordinators, so fewer feedback messages.' },
          { l: 'b', q: 'Describe the five classes of failures in RPC systems.', a: '1) Client cannot locate the server. 2) Request lost. 3) Server crashes after receiving the request. 4) Reply lost. 5) Client crashes after sending the request (server replies to a restarted client).' },
          { l: 'c', q: 'Describe the difference between data-centric and client-centric consistency.', a: 'Data-centric: system-wide consistency for all replicas. Client-centric: consistency for a single client moving between replicas.' }
        ]
      },
      {
        n: 10, title: 'Chord DHT', w: 15,
        intro: () => `<p>m = 5; four servers (3, 12, 21, 31).</p>${ring([3, 12, 21, 31])()}`,
        subs: [
          { l: 'a', q: 'Compute the finger tables.', a: '3: 12, 12, 12, 12, 21 · 12: 21, 21, 21, 21, 31 · 21: 31, 31, 31, 31, 12 · 31: 3, 3, 3, 12, 21' },
          { l: 'b', q: 'Keys {6, 9, 15, 29}. Responsible servers?', a: '6 → 12 · 9 → 12 · 15 → 21 · 29 → 31' },
          { l: 'c', q: 'Resolve key 15 from server 31.', a: 'Round 1: n=31, succ=3: no. Finger(5)=21: 31&lt;21&lt;15? No. Finger(4)=12: 31&lt;12&lt;15 (wrap) yes → 12. Round 2: n=12, succ=21: 12&lt;15≤21 → <b>21</b>.' },
          { l: 'd', q: 'Reasons for replicating servers and files?', a: 'Fault-tolerance, scalability, performance, availability.' },
          { l: 'e', q: 'Purpose of the finger table?', a: 'Scalable search: storing exponentially distant nodes lets search complete in O(log n).' }
        ]
      }
    ]
  });

  /* ======================= JUNI 2025 ======================= */
  D.exams.push({
    id: 'juni-2025', title: 'Eksamen 5. juni 2025', kind: 'past',
    note: 'Nyeste eksamen. Hjelpemiddel: enkel kalkulator.',
    tasks: [
      { n: 1, title: 'Flervalg', w: 10, mcSrc: 'juni 2025' },
      {
        n: 2, title: 'Prosjekt 3 – ChordDHT', w: 10,
        subs: [
          { l: 'a', q: 'What type of application-layer communication protocol is used among the nodes?', a: 'Remote Procedure Call (RPC) – the Java language-based RPC called Java RMI.' },
          { l: 'b', q: 'How is the address space calculated and what is its size?', a: 'MD5 with 128 bits gives 2<sup>128</sup> possible addresses.' },
          { l: 'c', q: 'What entities are given names (identifiers) and how?', a: 'The files (replicas: filename + index) and the servers/processes/nodes – both by MD5 hashing of their names.' },
          { l: 'd', q: 'Which approaches avoid concurrent modification of a file by multiple processes?', a: 'Remote-write protocol and the distributed mutual exclusion algorithm.' }
        ]
      },
      {
        n: 3, title: 'Forsinkelse, flaskehals og utnyttelse', w: 10,
        intro: () => `<p>Link R1–R2: R = 10<sup>7</sup> bit/s, d = 10<sup>5</sup> m, s = 8·10<sup>8</sup> m/s.</p><div class="figure">${F().delayNet()}</div>`,
        subs: [
          { l: 'a', q: 'Packet L = 5000 bits. Transmission delay?', a: '5·10<sup>3</sup>/10<sup>7</sup> = <b>0.0005 s</b>' },
          { l: 'b', q: 'R1: processing 0.008 s, queuing 0.05 s. Nodal delay?', a: 'd_prop = 10<sup>5</sup>/(8·10<sup>8</sup>) = 0.000125 s. d_nodal = 0.008 + 0.05 + 0.000125 + 0.0005 = <b>0.0586 s</b>' },
          { l: 'c', q: 'H1/H2→R1 = 80 Mbps, R1–R2 = 30 Mbps, R2→H3 = 50 Mbps. Bottleneck?', a: 'R1–R2 (30 Mbps) – lowest transmission rate.' },
          { l: 'd', q: 'Only H1 sends at maximum rate to H3. Utilization of the link R2–H3? (justify)', a: 'H3 can receive at 50 Mbps but the bottleneck allows 30 Mbps: 30/50 = <b>0.6</b>.' }
        ]
      },
      {
        n: 4, title: 'HTTP', w: 10, intro: () => F().http,
        subs: [
          { l: 'a', q: 'At what layer is HTTP used?', a: 'Application layer.' },
          { l: 'b', q: 'Purpose of the fields method, URL, Version?', a: 'Method: what operation the server should perform on the resource (GET, POST, PUT, DELETE). URL: address/path of the resource. Version: HTTP version (e.g. HTTP/1.1).' },
          { l: 'c', q: 'How can a client specify the type (format) of the entity body?', a: 'With the header line Content-Type, e.g. Content-Type: application/json.' },
          { l: 'd', q: 'Which method updates a resource and which part contains the data?', a: 'PUT; the entity body.' }
        ]
      },
      {
        n: 5, title: 'Lag, ARP og svitsj', w: 10,
        intro: () => `<div class="figure">${F().hubSwitch(HUB_2025)}</div>`,
        subs: [
          { l: 'a', q: 'At which layer(s) do R (router), Hb (hub) and Sw (switch) operate?', a: 'R: Physical, Link, Network · Hb: Physical · Sw: Physical and Link' },
          { l: 'b', q: 'Describe the purpose of ARP.', a: 'An IP datagram must be encapsulated in a frame with source and destination MAC addresses. At the network layer we only know the IP address of the destination or next-hop router, so ARP resolves the corresponding MAC address.' },
          { l: 'c', q: 'H1 sends an ARP query for 200.102.1.3. Who receives it and who replies? (justify)', a: 'H2 and R receive the broadcast query (the hub repeats it on all ports). Only R sends back a unicast ARP reply to H1.' },
          { l: 'd', q: 'The switch table is empty and H4 sends a frame to H3. On which ports is it forwarded, and what is the table afterwards?', a: 'H4 first ARPs for H3: the frame arrives on port 3 and is flooded to ports 1 and 2. The ARP request/reply lets the switch learn both: 3 → 4A:4B:4C:4D:4E:4F, 2 → 3A:3B:3C:3D:3E:3F.' }
        ]
      },
      {
        n: 6, title: 'Routing, CIDR og forwarding', w: 10,
        subs: [
          { l: 'a', q: 'Explain the difference between the routing and forwarding functions.', a: 'Forwarding is router-local: moving an incoming packet from input to the appropriate output interface using the forwarding table. Routing is network-wide: computing the least-cost paths and configuring the forwarding tables.' },
          { l: 'b', q: 'Explain the differences between distance-vector and link-state algorithms.', a: 'Link-state uses global knowledge of the topology. Distance-vector computes least costs using local knowledge from immediate neighbours.' },
          { l: 'c', q: 'What interval does 223.1.9/24 span? (justify)', a: '11011111 00000001 00001001 | 00000000 → <b>223.1.9.0 – 223.1.9.255</b>' },
          { l: 'd', q: 'What 32-bit pattern does 223.1.17.40 correspond to?', a: '11011111 00000001 00010001 00101000' },
          { l: 'e', q: 'Router: 11011111 00000001 00000001 → 0; 11011111 00000001 00001001 → 2; 11011111 00000001 00000111 → 1; otherwise → 3. Interfaces for i) 223.1.9.40 ii) 223.1.7.125 iii) 223.53.40.7?', a: 'i) → <b>2</b> · ii) → <b>1</b> · iii) no match → <b>3</b>' }
        ]
      },
      {
        n: 7, title: 'Asynkron RPC', w: 5,
        intro: '<p>Processes A, B and C communicate using synchronous RPC: A and C are clients, B is a server (A → B request/reply, C → B request/reply).</p>',
        subs: [
          { l: 'a', q: 'Explain briefly how process B can be changed to an asynchronous RPC server.', a: 'B wants to avoid blocking and process many requests – a concurrent server. Use multithreading and (optionally) a client callback function registered on the server. B acknowledges the request and hands it off to a new thread; when processed, the thread triggers the callback to send the reply to the client.' },
          { l: 'b', q: 'Explain briefly how A and C can be changed to asynchronous RPC clients.', a: 'They need a reply, so they must avoid blocking while waiting: use multithreading and callbacks. A registers a callback with B and spawns a new thread for each request while the program continues on the main thread; B sends the reply via the callback.', x: 'Svar som bare nevner «send ACK» ga bare noen få poeng.' }
        ]
      },
      {
        n: 8, title: 'Overlay-multicast', w: 10,
        intro: () => `<div class="figure">${F().overlay5({ ae: 50, ab: 5, bc: 15, cd: 5, de: 10 })}</div>`,
        subs: [
          { l: 'a', q: 'Draw the fully connected overlay graph.', a: 'A–B 7 · A–C 22 · A–D 27 · A–E 37 · B–C 17 · B–D 22 · B–E 32 · C–D 7 · C–E 17 · D–E 12' },
          { l: 'b', q: 'RDP from C to E using 1) A–E–B–D–C and 2) A–E–D–B–C?', a: 'Best C–E = 17. Tree 1: C–D–B–E = 7+22+32 = 61 → RDP 3.59. Tree 2: C–B–D–E = 17+22+12 = 51 → RDP 3. Tree 2 is less costly.' },
          { l: 'c', q: 'Tree costs?', a: 'Tree 1 = 37+32+22+7 = 98. Tree 2 = 37+12+22+17 = 88. Tree 2 is cheaper.' }
        ]
      },
      {
        n: 9, title: 'Lost request, vektorklokker, kausal konsistens, replikering', w: 10,
        subs: [
          { l: 'a', q: 'The request to the RPC server was lost. How should client and server handle it?', a: 'Client: timer before sending, sequence number per request, retransmit if no ACK before timeout. Server: for non-idempotent requests, track the most recently received sequence number to detect retransmissions.' },
          { l: 'b', q: () => 'Compute the vector clocks (s<sub>i</sub>/r<sub>i</sub> = send/receive).' + F().vcTable([['p1', 'a', 's1', 'r3', 'b', ''], ['p2', 'r1', 's2', 'c', 's4', ''], ['p3', 'd', 'r2', 'e', 's3', 'r5'], ['p4', 'r4', 'f', 'g', 's5', 'h']]), a: () => F().vcTable([['P1', '1000', '2000', '3240', '4240', ''], ['P2', '2100', '2200', '2300', '2400', ''], ['P3', '0010', '2220', '2230', '2240', '2454'], ['P4', '2401', '2402', '2403', '2404', '2405']]) },
          { l: 'c', q: 'P1: W(x)a · P2: R(x)a W(x)b · P3: R(x)b R(x)a · P4: R(x)a R(x)b. Does it violate causal consistency?', a: 'Yes – b causally depends on a, so all must see a before b; P3 saw b before a.' },
          { l: 'd', q: 'Explain the reasons for using replication.', a: 'Fault-tolerance, performance (geographic + load balancing), scalability, availability.' }
        ]
      },
      {
        n: 10, title: 'Chord DHT', w: 15,
        intro: () => `<p>m = 5; four servers (5, 15, 23, 27).</p>${ring([5, 15, 23, 27])()}`,
        subs: [
          { l: 'a', q: 'Compute the finger tables.', a: '5: 15, 15, 15, 15, 23 · 15: 23, 23, 23, 23, 5 · 23: 27, 27, 27, 5, 15 · 27: 5, 5, 5, 5, 15' },
          { l: 'b', q: 'Keys {0, 10, 15, 23}. Responsible servers?', a: '0 → 5 · 10 → 15 · 15 → 15 · 23 → 23' },
          { l: 'c', q: 'Resolve key 25 from server 5.', a: 'Round 1: n=5, succ=15: no. Finger(5)=23: 5&lt;23&lt;25 yes → 23. Round 2: n=23, succ=27: 23&lt;25≤27 → <b>27</b>.' },
          { l: 'd', q: 'How does the DHT provide scalable search?', a: 'Each node’s finger table stores exponentially distant nodes, so search completes in O(log n).' },
          { l: 'e', q: 'How does it provide fault tolerance?', a: 'Data replication and process replication.' }
        ]
      }
    ]
  });
})();
