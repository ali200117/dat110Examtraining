DAT110.addModule({
  id: 'security',
  title: 'Sikkerhet og kryptografi',
  source: 'van Steen & Tanenbaum kap. 9.1–9.2 · Kurose & Ross kap. 8.1–8.4, 8.6, 8.9',
  exam: 'Oppgave 1 j) HVERT ÅR (digital signatur, spoofing, non-repudiation, hvilken nøkkel?) og Oppgave 10e (bevis for non-repudiation – mai 2023)',
  goals: [
    'Kjenne sikkerhetsegenskapene: konfidensialitet, integritet, autentisering, non-repudiation, tilgjengelighet',
    'Skille symmetrisk og asymmetrisk kryptografi og vite når hver brukes',
    'Regne et lite RSA-eksempel og et Diffie-Hellman-eksempel',
    'Forklare hash, MAC og digitale signaturer – og hvilke egenskaper hver gir',
    'Vite hvilken nøkkel som brukes til å kryptere, signere og verifisere',
    'Forklare sertifikater/CA, nonce-basert autentisering, TLS og brannmurer'
  ],
  sections: [
    {
      id: 'security-1',
      title: 'Sikkerhetsegenskaper og trusler',
      html: `
<p>Persongalleriet: <b>Alice</b> og <b>Bob</b> vil kommunisere sikkert; <b>Trudy</b> (intruder) kan avlytte, endre, slette og sette inn meldinger.</p>
<div class="table-wrap"><table>
<tr><th>Egenskap</th><th>Betydning</th><th>Mekanisme</th></tr>
<tr><td><b>Konfidensialitet</b></td><td>Bare avsender og tiltenkt mottaker forstår innholdet</td><td>Kryptering</td></tr>
<tr><td><b>Integritet</b></td><td>Meldingen er ikke endret underveis (eller endringen oppdages)</td><td>Hash + MAC / digital signatur</td></tr>
<tr><td><b>Autentisering</b></td><td>Bekrefte identiteten til den andre parten</td><td>Passord, nonce, signatur, sertifikat</td></tr>
<tr><td><b>Non-repudiation</b> (ikke-benekting)</td><td>Avsenderen kan ikke nekte for å ha sendt/signert</td><td>Digital signatur med privat nøkkel</td></tr>
<tr><td><b>Tilgjengelighet</b></td><td>Tjenesten er tilgjengelig for legitime brukere</td><td>Brannmur, redundans, DoS-beskyttelse</td></tr>
<tr><td><b>Autorisasjon</b></td><td>Bare den som har lov, får gjøre operasjonen</td><td>Tilgangskontroll</td></tr>
</table></div>
<h3>STRIDE (forelesning)</h3>
<p><b>S</b>poofing (bryter autentisering) · <b>T</b>ampering (integritet) · <b>R</b>epudiation (non-repudiation) · <b>I</b>nformation disclosure (konfidensialitet) · <b>D</b>enial of service (tilgjengelighet) · <b>E</b>levation of privilege (autorisasjon).</p>
<p>van Steen sine fire trusselklasser: <b>avlytting</b> (interception), <b>avbrudd</b> (interruption), <b>modifikasjon</b>, <b>fabrikasjon</b>. Sikkerhetsmekanismer: kryptering, autentisering, autorisasjon og revisjon (auditing).</p>
`,
      quiz: [
        { q: 'Hvilken egenskap brytes ved spoofing?', o: ['Konfidensialitet', 'Autentisering', 'Tilgjengelighet', 'Autorisasjon'], a: [1], e: 'Spoofing = utgi seg for å være en annen.' },
        { q: 'Hva betyr non-repudiation?', o: ['Meldingen er kryptert', 'Avsenderen kan ikke benekte å ha sendt/signert meldingen', 'Tjenesten er alltid tilgjengelig', 'Meldingen er komprimert'], a: [1], e: 'Krever at bare avsenderen kunne laget signaturen.' }
      ]
    },
    {
      id: 'security-2',
      title: 'Symmetrisk og asymmetrisk kryptografi',
      html: `
<div class="compare">
<div><h4>Symmetrisk (delt nøkkel)</h4><ul><li>Samme hemmelige nøkkel K<sub>A,B</sub> brukes til å kryptere og dekryptere.</li><li>Eksempler: Caesar/substitusjon (svake), <b>DES/3DES</b>, <b>AES</b> (blokkchiffer, 128-bits blokker).</li><li><b>Rask</b> – brukes til bulkdata.</li><li><b>Problem</b>: hvordan blir Alice og Bob enige om nøkkelen? (nøkkeldistribusjon). N brukere trenger N(N−1)/2 nøkler.</li></ul></div>
<div><h4>Asymmetrisk (offentlig nøkkel)</h4><ul><li>Hver part har et nøkkelpar: <b>offentlig K<sup>+</sup></b> (kan deles) og <b>privat K<sup>−</sup></b> (hemmelig). Matematisk koblet.</li><li>K<sup>−</sup>(K<sup>+</sup>(m)) = m og K<sup>+</sup>(K<sup>−</sup>(m)) = m.</li><li>Eksempel: <b>RSA</b> (faktorisering av store tall er vanskelig).</li><li>Løser nøkkeldistribusjon, men er <b>~100–1000× tregere</b>.</li></ul></div>
</div>
<div class="callout tip"><span class="ct">Hvilken nøkkel til hva? (alltid på eksamen)</span>
<b>Konfidensialitet</b> – Bob sender hemmelig til Alice: krypter med <b>Alice sin offentlige nøkkel</b>; bare Alice (privat nøkkel) kan dekryptere.<br>
<b>Signatur</b> – Alice signerer: med <b>Alice sin private nøkkel</b>.<br>
<b>Verifisering</b> – Bob sjekker Alice sin signatur: med <b>Alice sin offentlige nøkkel</b>.</div>
<h3>RSA – nøkkelgenerering</h3>
<ol class="steps">
  <li>Velg to store primtall p og q.</li>
  <li>n = p · q og z = (p − 1)(q − 1).</li>
  <li>Velg e &lt; n slik at e og z er relativt primiske (ingen felles faktor).</li>
  <li>Finn d slik at e · d mod z = 1.</li>
  <li>Offentlig nøkkel K<sup>+</sup> = (n, e). Privat nøkkel K<sup>−</sup> = (n, d).</li>
</ol>
<span class="formula">Krypter: c = m^e mod n          Dekrypter: m = c^d mod n</span>
<div class="callout example"><span class="ct">Eksempel fra forelesning</span>p = 3, q = 11 → n = 33, z = 2 · 10 = 20. e = 3 (gcd(3, 20) = 1). d = 7 fordi 3 · 7 = 21 ≡ 1 (mod 20).<br>
Krypter m = 4: c = 4<sup>3</sup> mod 33 = 64 mod 33 = <b>31</b>.<br>
Dekrypter: 31<sup>7</sup> mod 33. Triks: 31 ≡ −2 (mod 33) → (−2)<sup>7</sup> = −128 ≡ −128 + 4·33 = <b>4</b> ✔</div>
<h3>Sesjonsnøkler og Diffie-Hellman</h3>
<p>I praksis brukes RSA (eller Diffie-Hellman) bare til å bli enige om en <b>symmetrisk sesjonsnøkkel</b>; resten krypteres med AES.</p>
<p><b>Diffie-Hellman</b>: offentlig primtall p og base g. Alice velger hemmelig x, sender A = g<sup>x</sup> mod p; Bob velger y, sender B = g<sup>y</sup> mod p. Begge regner nøkkelen K = B<sup>x</sup> = A<sup>y</sup> = g<sup>xy</sup> mod p. Eks.: p = 29, g = 2, x = 5, y = 12 → A = 3, B = 7, K = 7<sup>5</sup> mod 29 = 3<sup>12</sup> mod 29 = <b>16</b>. (Sårbar for man-in-the-middle uten autentisering!)</p>
<p>👉 Øv i <a href="trening.html#rsa">Regnetrening → RSA</a>.</p>
`,
      quiz: [
        { q: 'Bob vil kryptere en melding til Alice. Hvilken nøkkel bruker han?', o: ['Bob sin offentlige nøkkel', 'Alice sin offentlige nøkkel', 'Alice sin private nøkkel', 'Bob sin private nøkkel'], a: [1], e: 'Bare Alice kan dekryptere med sin private nøkkel.' },
        { q: 'RSA: p = 5, q = 7, e = 5. Hvilken verdi kan være d?', o: ['11', '24', '29', '35'], a: [2], e: 'n = 35, z = 24. 5 · 29 = 145 = 6·24 + 1 → d = 29 (Kurose sitt valg). Merk: d = 5 oppfyller også 5·5 = 25 ≡ 1 (mod 24), men er ikke blant alternativene.' },
        { q: 'Hvorfor brukes symmetrisk kryptering for bulkdata i TLS?', o: ['Den er sikrere enn asymmetrisk', 'Den er mye raskere; asymmetrisk brukes bare til å etablere nøkkelen', 'Asymmetrisk kan ikke kryptere data', 'Det er et krav i HTTP'], a: [1], e: 'Asymmetrisk løser nøkkeldistribusjon, men er treg.' },
        { q: 'Diffie-Hellman: p = 23, g = 5, Alice x = 6, Bob y = 15. Felles nøkkel?', o: ['2', '8', '19', '4'], a: [0], e: 'A = 5^6 mod 23 = 8, B = 5^15 mod 23 = 19, K = 19^6 mod 23 = 8^15 mod 23 = 2.' }
      ]
    },
    {
      id: 'security-3',
      title: 'Hash, MAC og digitale signaturer',
      html: `
<h3>Kryptografisk hashfunksjon H(m)</h3>
<p>Lager et kort «fingeravtrykk» (digest) av fast lengde (MD5: 128 bit, SHA-256: 256 bit). Egenskaper: <b>enveis</b> (umulig å finne m fra H(m)) og <b>kollisjonsresistent</b> (umulig å finne m′ ≠ m med samme hash). Hash alene gir <b>ikke</b> autentisering – Trudy kan bare lage ny melding og ny hash.</p>
<h3>MAC – Message Authentication Code</h3>
<p>Alice og Bob deler en hemmelighet s. Alice sender (m, H(m + s)). Bob regner H(m + s) selv og sammenligner. Gir <b>integritet og autentisering</b>, men <b>ikke non-repudiation</b>: begge kjenner s, så Bob kunne laget MAC-en selv. (HMAC er en standardisert MAC.)</p>
<h3>Digital signatur</h3>
<div class="figure"><svg viewBox="0 0 640 190" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="arK" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="ah"/></marker></defs>
  <text x="140" y="16" text-anchor="middle" class="txa">Alice signerer</text><text x="500" y="16" text-anchor="middle" class="txa">Bob verifiserer</text>
  <rect x="20" y="30" width="70" height="34" rx="6" class="bx"/><text x="55" y="52" text-anchor="middle" class="tx">m</text>
  <rect x="120" y="30" width="70" height="34" rx="6" class="bxw"/><text x="155" y="52" text-anchor="middle" class="txs">H(m)</text>
  <rect x="215" y="30" width="95" height="34" rx="6" class="bx2"/><text x="262" y="45" text-anchor="middle" class="txs">K⁻Alice</text><text x="262" y="58" text-anchor="middle" class="txs">(H(m))</text>
  <line x1="90" y1="47" x2="120" y2="47" class="ln" marker-end="url(#arK)"/><line x1="190" y1="47" x2="215" y2="47" class="ln" marker-end="url(#arK)"/>
  <text x="160" y="90" text-anchor="middle" class="txs">privat nøkkel</text>
  <line x1="310" y1="47" x2="370" y2="100" class="lna" marker-end="url(#arK)"/><line x1="90" y1="58" x2="370" y2="110" class="lna" marker-end="url(#arK)"/>
  <text x="250" y="125" text-anchor="middle" class="txs">sender (m, signatur)</text>
  <rect x="380" y="90" width="110" height="34" rx="6" class="bx2"/><text x="435" y="105" text-anchor="middle" class="txs">K⁺Alice(sign.)</text><text x="435" y="118" text-anchor="middle" class="txs">= H(m)?</text>
  <rect x="380" y="140" width="110" height="34" rx="6" class="bxw"/><text x="435" y="162" text-anchor="middle" class="txs">H(m) selv</text>
  <rect x="520" y="110" width="100" height="44" rx="8" class="bxg"/><text x="570" y="130" text-anchor="middle" class="txs">Like?</text><text x="570" y="145" text-anchor="middle" class="txs">→ gyldig</text>
  <line x1="490" y1="107" x2="520" y2="125" class="ln" marker-end="url(#arK)"/><line x1="490" y1="157" x2="520" y2="140" class="ln" marker-end="url(#arK)"/>
</svg></div>
<p>Signaturen gir <b>integritet</b> (endres m, stemmer ikke hashen), <b>autentisering</b> (bare Alice har K<sup>−</sup>) og <b>non-repudiation</b> (Alice kan ikke benekte – bare hun kjenner den private nøkkelen). Den gir <b>ikke</b> konfidensialitet (m sendes i klartekst). Man signerer hashen fordi asymmetriske operasjoner på store meldinger er dyre.</p>
<div class="callout exam"><span class="ct">Bevis for non-repudiation (mai 2023 10e)</span>
Symmetriske nøkler kan <b>ikke</b> gi non-repudiation – begge parter kjenner den delte nøkkelen. Bare offentlig-nøkkel-kryptografi kan, fordi en part kan holde den private nøkkelen hemmelig og bare dele den offentlige.<br>
Serveren har nøkkelpar K<sup>+</sup> og K<sup>−</sup> (bare eieren kjenner K<sup>−</sup>). Avsender bruker K<sup>−</sup> til å <b>signere digesten</b> av meldingen og sender meldingen + signaturen. Mottaker bruker avsenderens <b>K<sup>+</sup></b> til å dekryptere signaturen og beregner digesten selv med samme hashalgoritme. Er de like, kommer meldingen fra avsenderen. Avsenderen kan <b>ikke benekte</b> å ha signert, fordi K<sup>−</sup> bare er kjent av avsenderen.</div>
<div class="table-wrap"><table class="center">
<tr><th></th><th>Hash</th><th>MAC</th><th>Digital signatur</th><th>Kryptering</th></tr>
<tr><td>Integritet</td><td>(bare mot uhell)</td><td>✔</td><td>✔</td><td>–</td></tr>
<tr><td>Autentisering</td><td>✘</td><td>✔</td><td>✔</td><td>(indirekte)</td></tr>
<tr><td>Non-repudiation</td><td>✘</td><td>✘</td><td><b>✔</b></td><td>✘</td></tr>
<tr><td>Konfidensialitet</td><td>✘</td><td>✘</td><td>✘</td><td><b>✔</b></td></tr>
</table></div>
<div class="callout exam"><span class="ct">Flervalgssvarene du må kunne</span>
Mot <b>spoofing</b> av servere → <b>digital signatur</b> (mai 2022, mai 2023). · <b>Non-repudiation</b> → <b>digital signatur basert på asymmetrisk kryptering</b> (jan 2024). · <b>Integritet og non-repudiation</b> → <b>digital signatur</b> (jan 2025). · Bob verifiserer Alice sin signatur → <b>Alice sin offentlige nøkkel</b> (mai 2024). · Alice signerer → <b>Alice sin private nøkkel</b>.</div>
`,
      quiz: [
        { q: 'Hvilken sikkerhetsløsning reduserer risikoen for spoofing av servere?', o: ['Kryptering', 'Digital signatur', 'Hashing'], a: [1], e: 'Signaturen beviser hvem som laget meldingen.' },
        { q: 'Hvilken løsning kan gi non-repudiation?', o: ['Digital signatur basert på asymmetrisk kryptering', 'Digital signatur basert på symmetrisk kryptering', 'HMAC-signatur', 'Hashing'], a: [0], e: 'Bare privat nøkkel er unik for avsenderen.' },
        { q: 'Bob mottok en digitalt signert melding fra Alice. Hvilken nøkkel bruker han for å verifisere?', o: ['Bob sin private', 'Bob sin offentlige', 'Alice sin private', 'Alice sin offentlige'], a: [3], e: 'Verifiser med avsenderens offentlige nøkkel.' },
        { q: 'Alice vil signere en melding til Bob. Hvilken nøkkel bruker hun?', o: ['Alice sin offentlige', 'Alice sin private', 'Bob sin offentlige', 'Bob sin private'], a: [1], e: 'Signer med egen private nøkkel.' },
        { q: 'Hvilken løsning gir både integritet og non-repudiation?', o: ['Kryptering', 'Digital signatur', 'Message Authentication Code (MAC)'], a: [1], e: 'MAC gir integritet, men ikke non-repudiation.' },
        { q: 'Hvorfor gir en MAC ikke non-repudiation?', o: ['Fordi den ikke bruker hash', 'Fordi begge parter kjenner den delte hemmeligheten, så mottakeren kunne laget MAC-en selv', 'Fordi den er for kort', 'Den gjør det'], a: [1], e: 'Delt hemmelighet ⇒ ingen unik avsender.' }
      ]
    },
    {
      id: 'security-4',
      title: 'Sertifikater, autentisering, TLS og brannmurer',
      html: `
<h3>Sertifikater og CA</h3>
<p>Hvordan vet Bob at en offentlig nøkkel virkelig tilhører Alice? Trudy kan sende <em>sin</em> nøkkel og påstå at det er Alice sin (<b>man-in-the-middle</b>). Løsning: en <b>sertifiseringsinstans (CA)</b> verifiserer identiteten og <b>signerer et sertifikat</b> som binder navn ↔ offentlig nøkkel: K<sup>−</sup><sub>CA</sub>(navn, K<sup>+</sup>). Alle kjenner CA sin offentlige nøkkel (innebygd i nettlesere) og kan sjekke sertifikatet. → «Man-in-the-middle can be alleviated by using» <b>certificate</b>.</p>
<h3>Endepunkt-autentisering (ap1.0 → ap4.0)</h3>
<ul>
  <li>ap1.0 «Jeg er Alice» – Trudy kan si det samme.</li>
  <li>ap2.0 + kilde-IP – IP kan spoofes.</li>
  <li>ap3.0 + passord (evt. kryptert) – <b>playback-angrep</b>: Trudy tar opp og spiller av.</li>
  <li><b>ap4.0 nonce</b>: Bob sender et tall R som brukes <b>bare én gang</b>; Alice returnerer K<sub>A,B</sub>(R). Hindrer playback. (Med offentlig nøkkel: K<sup>−</sup><sub>A</sub>(R) – men da trengs sertifikat mot MITM.)</li>
</ul>
<h3>TLS (Transport Layer Security)</h3>
<p>Ligger mellom applikasjonen og TCP (HTTPS = HTTP over TLS). Gir konfidensialitet, integritet og serverautentisering.</p>
<ol class="steps">
  <li><b>Handshake</b>: klienten sender støttede algoritmer + nonce; serveren velger og sender <b>sertifikat</b> + nonce. Klienten verifiserer sertifikatet.</li>
  <li><b>Nøkkelutveksling</b>: klienten sender en pre-master secret kryptert med serverens offentlige nøkkel (eller Diffie-Hellman). Begge utleder <b>sesjonsnøkler</b> (separate for kryptering og MAC, hver retning).</li>
  <li>Begge sender en MAC av alle handshake-meldingene (oppdager manipulasjon).</li>
  <li><b>Data</b> sendes i <b>records</b>, kryptert symmetrisk med MAC og <b>sekvensnummer</b> (hindrer omrokkering/replay).</li>
</ol>
<h3>Brannmurer og IDS (operasjonell sikkerhet)</h3>
<ul>
  <li><b>Tilstandsløst pakkefilter</b>: slipper gjennom/blokkerer per pakke basert på IP-adresser, porter, protokoll, TCP-flagg.</li>
  <li><b>Tilstandsfullt filter</b>: følger TCP-forbindelser (slipper bare inn svar på forbindelser som er startet innenfra).</li>
  <li><b>Applikasjonsgateway</b>: filtrerer på applikasjonsdata (f.eks. bare visse brukere får telnet).</li>
  <li><b>IDS/IPS</b>: dyp pakkeinspeksjon, signatur- eller anomalibasert deteksjon av angrep.</li>
</ul>
`,
      quiz: [
        { q: 'Et man-in-the-middle-angrep kan reduseres ved å bruke …', o: ['Hashing', 'Sertifikat', 'Offentlig nøkkel alene', 'Digital signatur alene'], a: [1], e: 'Sertifikatet (signert av CA) binder nøkkelen til identiteten.' },
        { q: 'Hva er en nonce, og hvorfor brukes den i ap4.0?', o: ['Et passord', 'Et tall som brukes bare én gang – hindrer playback-angrep', 'En krypteringsalgoritme', 'En hashfunksjon'], a: [1], e: 'Opptak av gamle svar blir verdiløse.' },
        { q: 'Hvorfor har TLS sekvensnummer i records?', o: ['For å komprimere data', 'For å oppdage omrokkering, sletting og replay av records', 'For flytkontroll', 'For DNS'], a: [1], e: 'Sekvensnummeret inngår i MAC-en.' },
        { q: 'Hva gjør et tilstandsfullt pakkefilter som et tilstandsløst ikke gjør?', o: ['Krypterer pakkene', 'Holder oversikt over TCP-forbindelser og slipper bare inn pakker som hører til etablerte forbindelser', 'Ser på applikasjonsdata', 'Ingenting'], a: [1], e: 'Det følger forbindelsestilstand.' }
      ]
    }
  ],
  summary: [
    'Egenskaper: konfidensialitet, integritet, autentisering, non-repudiation, tilgjengelighet, autorisasjon. STRIDE.',
    'Symmetrisk: én delt nøkkel, rask (AES), nøkkeldistribusjonsproblem. Asymmetrisk: K+ / K−, treg, løser distribusjon (RSA).',
    'RSA: n = pq, z = (p−1)(q−1), e relativt primisk med z, ed mod z = 1. c = m^e mod n, m = c^d mod n.',
    'Diffie-Hellman: K = g^(xy) mod p – felles nøkkel over usikker kanal (sårbar for MITM uten autentisering).',
    'Kryptere til Alice: Alice sin offentlige. Signere: egen private. Verifisere: avsenderens offentlige.',
    'Hash: fingeravtrykk. MAC: integritet + autentisering (delt hemmelighet). Digital signatur: integritet + autentisering + non-repudiation.',
    'Mot spoofing og for non-repudiation: digital signatur (asymmetrisk). Mot MITM: sertifikat fra CA.',
    'Nonce hindrer playback. TLS: handshake med sertifikat → sesjonsnøkler → records med MAC + sekvensnummer.',
    'Brannmur: tilstandsløst/tilstandsfullt filter, applikasjonsgateway; IDS.'
  ],
  formulas: [
    { name: 'RSA nøkler', expr: 'n = p·q, z = (p−1)(q−1), e·d mod z = 1', note: 'K+ = (n,e), K− = (n,d)' },
    { name: 'RSA krypter/dekrypter', expr: 'c = m^e mod n ; m = c^d mod n', note: '' },
    { name: 'Diffie-Hellman', expr: 'A = g^x mod p, B = g^y mod p, K = B^x = A^y mod p', note: '' },
    { name: 'Digital signatur', expr: 'sig = K−_A(H(m)) ; verifiser: K+_A(sig) == H(m)', note: '' },
    { name: 'MAC', expr: 'H(m + s)', note: 's = delt hemmelighet' }
  ],
  examQA: [
    { q: 'What cryptography solution would you use to provide non-repudiation among the servers? Prove that it works.', a: 'Public-key cryptography / digital signatures (symmetric keys cannot give non-repudiation since both parties know the shared key). Each server has K+ (public) and K− (private, only the owner knows it). The sender signs the digest of the message with K− and sends message + signature; the receiver decrypts the signature with the sender’s K+, computes the digest with the same hash algorithm and compares. If equal, the message came from the sender, who cannot deny signing since only they know K−.' },
    { q: 'What security solution can provide integrity and non-repudiation?', a: 'Digital signature (based on asymmetric cryptography).' }
  ]
});
