/* Oppgave 1 fra alle tidligere eksamener (ordrett, engelsk) – fasit fra sensorveiledningene */
(function () {
  const D = window.DAT110;
  const X = (t, src, q, o, a, e) => D.quizbank.push({ id: 'ex-' + src.replace(/\W+/g, '-'), t, src: 'Eksamen ' + src, q, o, a, e, exam: true });

  // Mai 2022
  X('intro', 'mai 2022 1a', 'Which of the following situations may lead to loss of datagrams / packets in a packet-switched network?',
    ['There may be some interference on a communication link causing some of the transmitted bits to be changed', 'A host informs a packet switch that it decided not to transmit the packet anyway', 'Some buffers may overflow because too many packets arrives for transmission on a communication link'], [0, 2],
    'Bitfeil (pakken forkastes) og bufferoverflyt (pakken droppes) gir tap.');
  X('layers', 'mai 2022 1b', 'Which of the following protocols belong to the application layer of the TCP/IP protocol stack?',
    ['UDP', 'IP', 'DNS', 'HTTP', 'ARP'], [2, 3], 'UDP = transport, IP = nettverk, ARP = link.');
  X('transport', 'mai 2022 1c', 'How are communication end-points identified at the transport layer of the TCP/IP protocol stack?',
    ['Using IP addresses and link-layer addresses', 'Using only IP addresses', 'Using IP addresses and port numbers', 'Using IP addresses and process identifiers'], [2], 'Socket = IP + port.');
  X('link', 'mai 2022 1d', 'What service does the link-layer of the TCP/IP protocol stack generally provide?',
    ['Multi-hop forwarding of frames between hosts', 'Reliable transmission of frames across one communication link', 'Unreliable transmission of frames across one communication link'], [2], 'Ett hopp, oftest upålitelig.');
  X('link', 'mai 2022 1e', 'For which type of medium access protocol may collision of frames occur?',
    ['Frequency division multiplexing (FDM)', 'Carrier Sense with Multiple Access (CSMA)', 'Time-division multiplexing (TDM)'], [1], 'Random access kan kollidere; FDM/TDM partisjonerer kanalen.');
  X('rpc', 'mai 2022 1f', 'The main idea behind RPC is to',
    ['Send messages via TCP to a remote process', 'Allow a client process to call its own function and forward the results to the server', 'Allow a client process to invoke a function on a remote server process'], [2], 'Fjernkall som ser lokalt ut.');
  X('mcast', 'mai 2022 1g', 'An unstructured p2p overlay network of 500 nodes has a probability (p = 0.4) that two nodes are connected by an edge. What is the estimated number of messages that can be routed in this network?',
    ['50000', '125000', '200', '500'], [0], 'p · N(N−1)/2 = 0,4 · 124 750 ≈ 50 000.');
  X('mutex', 'mai 2022 1h', 'Which of the mutual exclusion algorithms requires 2*(N-1) messages for a process to enter its critical region where N is the total number of processes?',
    ['Distributed', 'Centralized', 'Token Ring', 'Decentralized'], [0], 'N−1 requests + N−1 OK.');
  X('security', 'mai 2022 1i', 'What is the security solution to mitigate spoofing of distributed system servers?',
    ['Encryption', 'Digital signature', 'Hashing'], [1], 'Signatur beviser opphav.');
  X('ds-intro', 'mai 2022 1j', 'Rapid elasticity is a cloud computing characteristic that relates to',
    ['Privacy', 'Security', 'Scalability'], [2], 'Rask opp-/nedskalering.');

  // Mai 2023
  X('intro', 'mai 2023 1a', 'What is Internetworking and the Internet about?',
    ['Enabling two computers connected by a single communication link to exchange information', 'Enabling a network-of-networks comprised of a heterogenous collection of data network technologies', 'Enabling a data network comprised of a collection of identical smaller networks'], [1], 'Nettverk av ulike nettverk.');
  X('layers', 'mai 2023 1b', 'What layers of the TCP/IP protocol stack does a router implement?',
    ['Physical', 'Link', 'Network', 'Transport', 'Application'], [0, 1, 2], 'Lag 1–3.');
  X('network', 'mai 2023 1c', 'What service does the TCP/IP network layer provide?',
    ['Reliable bi-directional transmission of a stream of bytes', 'Reliable point-to-point transmission of datagrams', 'Unreliable multi-hop forwarding of datagrams between hosts'], [2], 'Best effort.');
  X('transport', 'mai 2023 1d', 'How are communication endpoints identified at the transport layer of the TCP/IP protocol stack?',
    ['Using IP addresses only', 'Using IP addresses and port numbers', 'Using IP addresses and process identifiers', 'Using IP addresses and link-layer addresses'], [1], '');
  X('app', 'mai 2023 1e', 'What is a main purpose of the Domain Name System (DNS)?',
    ['Mapping of IP addresses to link-layer addresses', 'Mapping of Universal Resource Identifiers to files', 'Mapping of hostnames to IP addresses'], [2], 'IP → MAC er ARP.');
  X('consistency', 'mai 2023 1f', 'One way to enforce cache coherence when shared data is cached locally is to let the server send an invalidation to all caches when a data item is modified.',
    ['True', 'False'], [0], 'Invalideringsbasert cache-koherens.');
  X('naming', 'mai 2023 1g', 'A Distributed Hash Table uses 8 bits to define its address space. What is the size of the address space?',
    ['256', '128', '64', '8'], [0], '2^8.');
  X('security', 'mai 2023 1h', 'Which of the following cryptography schemes can protect against spoofing?',
    ['Asymmetric encryption', 'Digital signature', 'Hashing', 'Symmetric encryption'], [1], '');
  X('fault', 'mai 2023 1i', 'How many processes are needed to form a byzantine agreement in a group with k faulty processes?',
    ['3k+1', 'k+1', '2k+1', '3k'], [0], '');
  X('ds-intro', 'mai 2023 1j', 'A service model which makes it possible for customers to rent virtual machines in the cloud is known as:',
    ['Platform as a service', 'Infrastructure as a service', 'Software as a service', 'Utility as a service'], [1], '');

  // Jan 2024
  X('layers', 'jan 2024 1a', 'What layers of the TCP/IP protocol stack does a router implement?',
    ['Link', 'Physical', 'Application', 'Network', 'Transport'], [0, 1, 3], 'Merk at rekkefølgen på alternativene er stokket i forhold til 2023!');
  X('network', 'jan 2024 1b', 'What is the main purpose of the Dynamic Host Configuration Protocol?',
    ['Mapping of IP addresses to link-layer addresses', 'Mapping of hostnames to IP addresses', 'To automatically configure a host network interface with an IP address'], [2], '');
  X('transport', 'jan 2024 1c', 'Suppose we have a network that may duplicate datagrams, but where there are no transmissions errors, loss or overtaking. What protocol mechanism(s) are required to ensure reliable data transfer?',
    ['Retransmission', 'Sequence numbers', 'Acknowledgements', 'Checksums'], [1], 'Bare duplikater må oppdages.');
  X('network', 'jan 2024 1d', 'How are IP addresses used in the Internet networking layer?',
    ['IP addresses are assigned to hosts and to routers', 'IP addresses are assigned to network interfaces of hosts and of routers', 'IP addresses are assigned only to hosts'], [1], '');
  X('link', 'jan 2024 1e', 'What is the purpose of the “type” field of an Ethernet frame?',
    ['To specify what type of communication link is being used', 'To specify if the frame is a data or an acknowledgement frame', 'To specify what upper-layer protocol is encapsulated in the data part of the frame'], [2], '');
  X('mcast', 'jan 2024 1f', 'An unstructured p2p overlay network of 500 nodes has a probability (p = 0.4) that two nodes are connected by an edge. What is the estimated number of messages that can be routed in this network?',
    ['200', '50000', '500', '125000'], [1], '');
  X('fault', 'jan 2024 1g', 'The type of failure where a server fails to respond to incoming requests is known as',
    ['Response failure', 'Timing failure', 'Crash failure', 'Omission failure'], [3], '');
  X('ds-intro', 'jan 2024 1h', 'The cloud service model where users can develop and deploy a product in the cloud using the cloud development infrastructure is known as',
    ['Software as a Service', 'Platform as a Service', 'Development as a Service', 'Infrastructure as a Service'], [1], '');
  X('fault', 'jan 2024 1i', 'How many processes are needed to form a byzantine agreement in a group with k faulty processes?',
    ['3k+1', 'k+1', '2k+1', '3k'], [0], '');
  X('security', 'jan 2024 1j', 'What security solution can provide non-repudiation?',
    ['Digital signature based on asymmetric encryption', 'Digital signature based on symmetric encryption', 'HMAC signature', 'Hashing'], [0], '');

  // Mai 2024
  X('link', 'mai 2024 1a', 'What is the purpose of the Address Resolution Protocol (ARP)?',
    ['To configure a network interface with an IP address', 'To map an IP address into the corresponding link-layer (MAC) address', 'To configure a network card with a link-layer (MAC) address'], [1], '');
  X('layers', 'mai 2024 1b', 'Which of the following protocols belong to the application layer of the TCP/IP protocol stack?',
    ['IP', 'UDP', 'HTTP', 'TCP'], [2], '');
  X('network', 'mai 2024 1c', 'What is the role of the forwarding function executed at the network layer?',
    ['To compute the least cost routes (paths) in the network', 'To transfer datagrams from incoming links to the appropriate outgoing link', 'To provide diagnostic information in case of network errors'], [1], '');
  X('network', 'mai 2024 1d', 'How many IP addresses are contained in the 223.1.1.0/23 CIDR-block of addresses?',
    ['1', '9', '256', '512'], [3], '2^(32−23) = 512.');
  X('link', 'mai 2024 1e', 'What is the purpose of the “type” field of an Ethernet frame?',
    ['To specify what type of communication link is being used.', 'To specify if the frame is a data or an acknowledgement frame.', 'To specify what upper-layer protocol is encapsulated in the data part of the frame.'], [2], '');
  X('mutex', 'mai 2024 1f', 'Which of the mutual exclusion algorithms requires 2.(N-1) messages for a process to enter its critical region where N is the total number of processes?',
    ['Distributed', 'Token ring', 'Decentralized', 'Centralized'], [0], '');
  X('fault', 'mai 2024 1g', 'The type of failure where a server fails to respond to incoming requests is known as',
    ['Response failure', 'Timing failure', 'Crash failure', 'Omission failure'], [3], '');
  X('ds-intro', 'mai 2024 1h', 'A cloud service model where cloud providers rent out virtual machines to customers is known as:',
    ['Software as a Service', 'Platform as a Service', 'Development as a Service', 'Infrastructure as a Service'], [3], '');
  X('consistency', 'mai 2024 1i', 'A replicated-write protocol which is based on majority voting is called.',
    ['Local-write protocol', 'Active replication', 'Quorum-based protocol', 'Coherence-based protocol'], [2], '');
  X('security', 'mai 2024 1j', 'Bob received a digitally signed message from Alice. What key would he use to verify the message?',
    ['Bob’s private key', 'Bob’s public key', 'Alice’s private key', 'Alice’s public key'], [3], '');

  // Jan 2025
  X('link', 'jan 2025 1a', 'What service does the link-layer of the TCP/IP protocol stack generally provide?',
    ['Multi-hop forwarding of frames between hosts', 'Reliable transmission of frames across one communication link', 'Unreliable transmission of frames across one communication link'], [2], '');
  X('intro', 'jan 2025 1b', 'What is traffic intensity a measure of?',
    ['The amount of bits/second presented to a link for transmission', 'A relation between the amount of bits presented per time unit for transmission on the communication link and the rate with which the bits can be transmitted', 'The amount of bits received on an incoming communication link'], [1], 'La/R.');
  X('transport', 'jan 2025 1c', 'How are communication endpoints identified at the transport layer of the TCP/IP?',
    ['Using IP addresses and link-layer addresses', 'Using only IP addresses', 'Using IP addresses and port numbers', 'Using IP addresses and process identifiers'], [2], '');
  X('link', 'jan 2025 1d', 'For which type of medium access protocol may collision of frames occur?',
    ['Frequency division multiplexing (FDM)', 'Carrier Sense with Multiple Access (CSMA)', 'Time-division multiplexing (TDM)'], [1], '');
  X('app', 'jan 2025 1e', 'What is the main purpose of the Domain Name System (DNS)?',
    ['Mapping of IP addresses to link-layer addresses', 'Mapping of Universal Resource Identifiers to files', 'Mapping of hostnames to IP addresses'], [2], '');
  X('mcast', 'jan 2025 1f', 'A key reason to use a probabilistic flooding model in flooding-based multicasting is to:',
    ['Create a structured overlay network', 'Increase the number of messages to ensure reliability', 'Reduce the number of messages in the network'], [2], '');
  X('ds-intro', 'jan 2025 1g', 'Rapid elasticity is a cloud computing characteristic that relates to:',
    ['Scalability', 'Security', 'Privacy'], [0], '');
  X('rpc', 'jan 2025 1h', 'The main idea behind RPC is to:',
    ['Send messages via TCP to a remote process', 'Allow a client process to call its own function and forward the results to the server', 'Allow a client process to invoke a function on a remote server process'], [2], '');
  X('fault', 'jan 2025 1i', 'A general technique to provide process resilience in distributed systems is to:',
    ['Organize several identical processes into a group', 'Forecast the fault so that systems can act when the fault occurs', 'Use a fault-removal technique', 'Use a fault-prevention technique'], [0], '');
  X('security', 'jan 2025 1j', 'What security solution can be used to provide integrity and non-repudiation?',
    ['Encryption', 'Digital signature', 'Message Authentication Code (MAC)'], [1], 'MAC gir ikke non-repudiation.');

  // Juni 2025
  X('layers', 'juni 2025 1a', 'Assume that a router is connecting to three different communication links. How many instances of the link layer would the router have?',
    ['One', 'Three', 'Six'], [1], 'Ett per grensesnitt.');
  X('transport', 'juni 2025 1b', 'Delivering the data contained in a transport-segment to the correct socket is called',
    ['Demultiplexing', 'Encapsulation', 'Multiplexing', 'Decapsulation'], [0], '');
  X('transport', 'juni 2025 1c', 'How are communication endpoints identified at the transport layer of the TCP/IP?',
    ['Using IP addresses and link-layer addresses', 'Using only IP addresses', 'Using IP addresses and port numbers', 'Using IP addresses and process identifiers'], [2], '');
  X('transport', 'juni 2025 1d', 'Suppose you are given the following three 8-bit bytes: 01010011, 01100110, 00110100. What is the 1’s complement of the sum?',
    ['00000000', '10000100', '00010010'], [2], 'Sum 11101101 → invertert 00010010.');
  X('network', 'juni 2025 1e', 'What service is provided by the network layer of the TCP/IP protocol stack?',
    ['Unreliable end-to-end multi-hop transfer of datagrams between hosts', 'Unreliable transfer of datagrams between hosts and routers', 'Reliable end-to-end transfer of datagrams between routers'], [0], '');
  X('mutex', 'juni 2025 1f', 'Which of the mutual exclusion algorithms requires 2.(N-1) messages for a process to enter its critical region where N is the total number of processes?',
    ['Distributed', 'Decentralized', 'Token ring', 'Centralized'], [0], '');
  X('consistency', 'juni 2025 1g', 'A replicated-write protocol which is based on majority voting is called:',
    ['Active replication', 'Coherence-based protocol', 'Quorum-based protocol', 'Local-write protocol'], [2], '');
  X('fault', 'juni 2025 1h', 'A system is k-fault tolerant if:',
    ['It can survive when all of its processes except k processes failed', 'It can survive when the majority of its processes failed', 'It can survive when k+1 processes failed', 'It can survive when k processes failed'], [3], '');
  X('ds-intro', 'juni 2025 1i', 'A service model which makes it possible for customers to rent virtual machines in the cloud is known as:',
    ['Platform as a service', 'Infrastructure as a service', 'Utility as a service', 'Software as a service'], [1], '');
  X('consistency', 'juni 2025 1j', 'Continuous consistency model can provide:',
    ['The ordering of operations to be ensured at the replicas', 'A way to measure and specify the level of inconsistencies that an application can tolerate', 'Eventual consistency of replicated data'], [1], '');
})();
