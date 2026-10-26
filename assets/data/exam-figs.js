/* Figurer som går igjen i eksamensoppgavene */
(function () {
  'use strict';
  const D = window.DAT110;
  const X = D.examFig = {};

  X.delayNet = function (withH4) {
    return `<svg viewBox="0 0 520 150" xmlns="http://www.w3.org/2000/svg" style="max-width:520px">
      <rect x="20" y="15" width="56" height="32" rx="5" class="bx"/><text x="48" y="36" text-anchor="middle" class="tx">H1</text>
      <rect x="20" y="100" width="56" height="32" rx="5" class="bx"/><text x="48" y="121" text-anchor="middle" class="tx">H2</text>
      <circle cx="190" cy="75" r="24" class="bx2"/><text x="190" y="80" text-anchor="middle" class="tx">R1</text>
      <circle cx="340" cy="75" r="24" class="bx2"/><text x="340" y="80" text-anchor="middle" class="tx">R2</text>
      <rect x="440" y="${withH4 ? 25 : 59}" width="56" height="32" rx="5" class="bx"/><text x="468" y="${withH4 ? 46 : 80}" text-anchor="middle" class="tx">H3</text>
      ${withH4 ? '<rect x="440" y="95" width="56" height="32" rx="5" class="bx"/><text x="468" y="116" text-anchor="middle" class="tx">H4</text><line x1="362" y1="83" x2="440" y2="110" class="lna" style="stroke-width:3"/>' : ''}
      <line x1="76" y1="35" x2="168" y2="66" class="lna" style="stroke-width:3"/><line x1="76" y1="112" x2="168" y2="84" class="lna" style="stroke-width:3"/>
      <line x1="214" y1="75" x2="316" y2="75" class="lna" style="stroke-width:3"/><line x1="364" y1="${withH4 ? 68 : 75}" x2="440" y2="${withH4 ? 42 : 75}" class="lna" style="stroke-width:3"/>
    </svg>`;
  };

  // H1,H2 – hub – R – svitsj – H3,H4
  X.hubSwitch = function (a) {
    return `<svg viewBox="0 0 700 230" xmlns="http://www.w3.org/2000/svg" style="max-width:700px">
      <rect x="20" y="35" width="56" height="34" rx="6" class="bx"/><text x="48" y="57" text-anchor="middle" class="tx">H1</text>
      <text x="20" y="18" class="txm">${a.h1ip}</text><text x="20" y="30" class="txm">${a.h1mac}</text>
      <rect x="20" y="150" width="56" height="34" rx="6" class="bx"/><text x="48" y="172" text-anchor="middle" class="tx">H2</text>
      <text x="20" y="200" class="txm">${a.h2ip}</text><text x="20" y="212" class="txm">${a.h2mac}</text>
      <circle cx="170" cy="110" r="26" class="bxw"/><text x="170" y="115" text-anchor="middle" class="tx">Hb</text>
      <circle cx="320" cy="110" r="26" class="bx2"/><text x="320" y="115" text-anchor="middle" class="tx">R</text>
      <text x="245" y="72" text-anchor="middle" class="txm">if1: ${a.r1ip}</text><text x="245" y="84" text-anchor="middle" class="txm">${a.r1mac}</text>
      <text x="400" y="72" text-anchor="middle" class="txm">if2: ${a.r2ip}</text><text x="400" y="84" text-anchor="middle" class="txm">${a.r2mac}</text>
      <circle cx="480" cy="110" r="26" class="bxg"/><text x="480" y="115" text-anchor="middle" class="tx">Sw</text>
      <rect x="610" y="35" width="56" height="34" rx="6" class="bx"/><text x="638" y="57" text-anchor="middle" class="tx">H3</text>
      <text x="560" y="18" class="txm">${a.h3ip}</text><text x="560" y="30" class="txm">${a.h3mac}</text>
      <rect x="610" y="150" width="56" height="34" rx="6" class="bx"/><text x="638" y="172" text-anchor="middle" class="tx">H4</text>
      <text x="560" y="200" class="txm">${a.h4ip}</text><text x="560" y="212" class="txm">${a.h4mac}</text>
      <line x1="76" y1="55" x2="150" y2="94" class="lna" style="stroke-width:3"/><line x1="76" y1="165" x2="150" y2="127" class="lna" style="stroke-width:3"/>
      <line x1="196" y1="110" x2="294" y2="110" class="lna" style="stroke-width:3"/><line x1="346" y1="110" x2="454" y2="110" class="lna" style="stroke-width:3"/>
      <line x1="503" y1="98" x2="610" y2="55" class="lna" style="stroke-width:3"/><line x1="503" y1="122" x2="610" y2="165" class="lna" style="stroke-width:3"/>
      <text x="440" y="128" class="txb">1</text><text x="512" y="88" class="txb">2</text><text x="512" y="142" class="txb">3</text>
      <text x="280" y="128" class="txb">1</text><text x="352" y="128" class="txb">2</text>
    </svg><div class="figcap">Tall i rødt ved svitsjen = portnummer. R: grensesnitt 1 mot huben, 2 mot svitsjen.</div>`;
  };

  // H1 – R1 – (R2, R3) – R4 – H2
  X.r1r4 = function (h1ip, h2ip) {
    return `<svg viewBox="0 0 600 170" xmlns="http://www.w3.org/2000/svg" style="max-width:600px">
      <rect x="20" y="65" width="56" height="32" rx="5" class="bx"/><text x="48" y="86" text-anchor="middle" class="tx">H1</text><text x="20" y="115" class="txm">${h1ip}</text>
      <circle cx="180" cy="81" r="22" class="bx2"/><text x="180" y="86" text-anchor="middle" class="tx">R1</text>
      <circle cx="300" cy="35" r="22" class="bx2"/><text x="300" y="40" text-anchor="middle" class="tx">R2</text>
      <circle cx="300" cy="135" r="22" class="bx2"/><text x="300" y="140" text-anchor="middle" class="tx">R3</text>
      <circle cx="420" cy="81" r="22" class="bx2"/><text x="420" y="86" text-anchor="middle" class="tx">R4</text>
      <rect x="520" y="65" width="56" height="32" rx="5" class="bx"/><text x="548" y="86" text-anchor="middle" class="tx">H2</text><text x="505" y="115" class="txm">${h2ip}</text>
      <line x1="76" y1="81" x2="158" y2="81" class="lna" style="stroke-width:3"/><line x1="199" y1="70" x2="280" y2="45" class="lna" style="stroke-width:3"/>
      <line x1="199" y1="92" x2="280" y2="125" class="lna" style="stroke-width:3"/><line x1="300" y1="57" x2="300" y2="113" class="lna" style="stroke-width:3"/>
      <line x1="320" y1="45" x2="400" y2="70" class="lna" style="stroke-width:3"/><line x1="320" y1="125" x2="400" y2="92" class="lna" style="stroke-width:3"/>
      <line x1="442" y1="81" x2="520" y2="81" class="lna" style="stroke-width:3"/>
      <text x="262" y="40" class="txb">1</text><text x="306" y="78" class="txb">2</text><text x="330" y="40" class="txb">3</text>
    </svg><div class="figcap">Røde tall = grensesnittene til R2 (1 mot R1, 2 mot R3, 3 mot R4).</div>`;
  };

  // Nettet fra jan 2024 og mai 2024 (H1–H5, R1–R3, S1). Adressene står i tabellen under figuren.
  X.net2024 = function (withH6) {
    const rows = [
      ['H1', '132.200.1.1', '1A:1B:1C:1D:1E:1F'], ['H2', '132.200.1.2', '2A:2B:2C:2D:2E:2F'], ['R1 if1', '132.200.1.3', '1B:1B:1C:1D:1E:1F'],
      ['H3', '221.198.1.3', '3A:3B:3C:3D:3E:3F'], ['H4', '221.198.1.4', '4A:4B:4C:4D:4E:4F'], ['R3 if1', '108.201.1.3', '38:3B:3C:3D:3E:3F'],
      ['H5', '108.201.1.5', '5A:5B:5C:5D:5E:5F']
    ];
    if (withH6) rows.push(['H6 (ny, på S1 port 1)', '–', '6A:6B:6C:6D:6E:6F']);
    return `<svg viewBox="0 0 560 ${withH6 ? 260 : 220}" xmlns="http://www.w3.org/2000/svg" style="max-width:560px">
      <rect x="20" y="40" width="56" height="32" rx="5" class="bx"/><text x="48" y="61" text-anchor="middle" class="tx">H1</text>
      <rect x="20" y="150" width="56" height="32" rx="5" class="bx"/><text x="48" y="171" text-anchor="middle" class="tx">H2</text>
      <line x1="76" y1="56" x2="110" y2="56" class="lna" style="stroke-width:3"/><line x1="76" y1="166" x2="110" y2="166" class="lna" style="stroke-width:3"/><line x1="110" y1="56" x2="110" y2="166" class="lna" style="stroke-width:3"/>
      <line x1="110" y1="111" x2="196" y2="111" class="lna" style="stroke-width:3"/>
      <circle cx="220" cy="111" r="24" class="bx2"/><text x="220" y="116" text-anchor="middle" class="tx">R1</text><text x="182" y="104" class="txb">1</text>
      <circle cx="350" cy="55" r="24" class="bx2"/><text x="350" y="60" text-anchor="middle" class="tx">R2</text>
      <line x1="242" y1="100" x2="328" y2="65" class="lna" style="stroke-width:3"/><text x="246" y="88" class="txb">2</text><text x="314" y="82" class="txb">2</text>
      <rect x="420" y="10" width="56" height="28" rx="5" class="bx"/><text x="448" y="29" text-anchor="middle" class="tx">H3</text>
      <rect x="490" y="10" width="56" height="28" rx="5" class="bx"/><text x="518" y="29" text-anchor="middle" class="tx">H4</text>
      <line x1="374" y1="52" x2="518" y2="52" class="lna" style="stroke-width:3"/><line x1="448" y1="38" x2="448" y2="52" class="lna" style="stroke-width:3"/><line x1="518" y1="38" x2="518" y2="52" class="lna" style="stroke-width:3"/><text x="380" y="46" class="txb">1</text>
      <circle cx="350" cy="165" r="24" class="bx2"/><text x="350" y="170" text-anchor="middle" class="tx">R3</text>
      <line x1="242" y1="122" x2="328" y2="155" class="lna" style="stroke-width:3"/><text x="246" y="146" class="txb">3</text><text x="312" y="162" class="txb">2</text>
      <circle cx="450" cy="165" r="22" class="bxg"/><text x="450" y="170" text-anchor="middle" class="tx">S1</text>
      <line x1="374" y1="165" x2="428" y2="165" class="lna" style="stroke-width:3"/><text x="378" y="185" class="txb">1</text><text x="416" y="185" class="txb">3</text>
      <rect x="490" y="150" width="56" height="30" rx="5" class="bx"/><text x="518" y="170" text-anchor="middle" class="tx">H5</text>
      <line x1="472" y1="165" x2="490" y2="165" class="lna" style="stroke-width:3"/><text x="474" y="158" class="txb">2</text>
      ${withH6 ? '<rect x="422" y="222" width="56" height="30" rx="5" class="bxw"/><text x="450" y="242" text-anchor="middle" class="tx">H6</text><line x1="450" y1="187" x2="450" y2="222" class="lna" style="stroke-width:3"/><text x="456" y="208" class="txb">1</text>' : ''}
    </svg>
    <div class="table-wrap"><table class="small mono" style="max-width:520px;margin:6px auto"><tr><th>Node</th><th>IP</th><th>MAC</th></tr>${rows.map(r => '<tr><td>' + r.join('</td><td>') + '</td></tr>').join('')}</table></div>
    <div class="figcap">Røde tall = grensesnitt-/portnummer.</div>`;
  };

  X.switch3 = function () {
    return `<svg viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg" style="max-width:520px">
      <rect x="150" y="20" width="56" height="30" rx="5" class="bx"/><text x="178" y="40" text-anchor="middle" class="tx">H1</text><text x="20" y="32" class="txm">192.168.0.1</text><text x="20" y="44" class="txm">1A:1B:1C:1D:1E:1F</text>
      <rect x="150" y="90" width="56" height="30" rx="5" class="bx"/><text x="178" y="110" text-anchor="middle" class="tx">H2</text><text x="20" y="102" class="txm">192.168.0.2</text><text x="20" y="114" class="txm">2A:2B:2C:2D:2E:2F</text>
      <rect x="150" y="160" width="56" height="30" rx="5" class="bx"/><text x="178" y="180" text-anchor="middle" class="tx">H3</text><text x="20" y="172" class="txm">192.168.0.3</text><text x="20" y="184" class="txm">3A:3B:3C:3D:3E:3F</text>
      <circle cx="360" cy="105" r="26" class="bxg"/><text x="360" y="110" text-anchor="middle" class="tx">S</text>
      <path d="M206,35 L360,35 L360,79" class="lna" style="stroke-width:3"/><line x1="206" y1="105" x2="334" y2="105" class="lna" style="stroke-width:3"/><path d="M206,175 L360,175 L360,131" class="lna" style="stroke-width:3"/>
      <text x="368" y="70" class="txb">3</text><text x="318" y="98" class="txb">2</text><text x="368" y="148" class="txb">1</text>
    </svg>`;
  };

  // Distance-vector-graf med fire rutere. e = {R1R2, R1R3, R2R3, R2R4, R3R4} (null = ingen link)
  X.dv = function (e) {
    const nodes = [{ id: 'R1', x: 60, y: 100 }, { id: 'R2', x: 210, y: 35 }, { id: 'R3', x: 210, y: 165 }, { id: 'R4', x: 360, y: 100 }];
    const edges = [];
    if (e.R1R2 != null) edges.push({ a: 'R1', b: 'R2', w: e.R1R2 });
    if (e.R1R3 != null) edges.push({ a: 'R1', b: 'R3', w: e.R1R3 });
    if (e.R2R3 != null) edges.push({ a: 'R2', b: 'R3', w: e.R2R3 });
    if (e.R2R4 != null) edges.push({ a: 'R2', b: 'R4', w: e.R2R4 });
    if (e.R3R4 != null) edges.push({ a: 'R3', b: 'R4', w: e.R3R4 });
    if (e.R1R4 != null) edges.push({ a: 'R1', b: 'R4', w: e.R1R4 });
    return D.fig.graph(nodes, edges, { width: 420, height: 200 });
  };

  // Overlay med rutere i ring og én prosess per ruter (kost 1). spec: {routers:[{id,x,y,p,px,py}], links:[[a,b,w]]}
  X.overlay = function (spec) {
    const nodes = [], edges = [];
    spec.routers.forEach(r => {
      nodes.push({ id: r.id, x: r.x, y: r.y, r: 16, cls: 'bx2' });
      nodes.push({ id: r.p, x: r.px, y: r.py, shape: 'rect', cls: 'bxg' });
      edges.push({ a: r.id, b: r.p, w: 1, cls: 'ln' });
    });
    spec.links.forEach(l => edges.push({ a: l[0], b: l[1], w: l[2], cls: 'lnd' }));
    return D.fig.graph(nodes, edges, { width: spec.w || 520, height: spec.h || 270 });
  };
  // Standardoppsett: 5 rutere (Ra, Re øverst; Rb, Rc, Rd nederst)
  X.overlay5 = function (w) {
    return X.overlay({
      routers: [
        { id: 'Ra', x: 120, y: 80, p: 'A', px: 50, py: 25 },
        { id: 'Re', x: 400, y: 80, p: 'E', px: 470, py: 25 },
        { id: 'Rb', x: 120, y: 190, p: 'B', px: 50, py: 245 },
        { id: 'Rc', x: 260, y: 190, p: 'C', px: 260, py: 250 },
        { id: 'Rd', x: 400, y: 190, p: 'D', px: 470, py: 245 }
      ],
      links: [['Ra', 'Re', w.ae], ['Ra', 'Rb', w.ab], ['Rb', 'Rc', w.bc], ['Rc', 'Rd', w.cd], ['Rd', 'Re', w.de]]
    });
  };

  X.vcTable = function (rows) {
    return '<div class="table-wrap"><table class="center mono">' + rows.map(r => '<tr><th>' + r[0] + '</th>' + r.slice(1).map(c => `<td>${c}</td>`).join('') + '</tr>').join('') + '</table></div>';
  };

  X.ipv4 = `<div class="table-wrap"><table class="center small" style="max-width:560px;margin:auto">
    <tr><td colspan="4" class="muted">32 bits</td></tr>
    <tr><td>Version</td><td>Header length</td><td>Type of service</td><td>Datagram length (bytes)</td></tr>
    <tr><td colspan="2">16-bit Identifier</td><td>Flags</td><td>13-bit Fragmentation offset</td></tr>
    <tr><td>Time-to-live</td><td>Upper-layer protocol</td><td colspan="2">Header checksum</td></tr>
    <tr><td colspan="4">32-bit Source IP address</td></tr>
    <tr><td colspan="4">32-bit Destination IP address</td></tr>
    <tr><td colspan="4">Options (if any)</td></tr>
    <tr><td colspan="4">Data</td></tr></table></div>`;
  X.udp = `<div class="table-wrap"><table class="center small" style="max-width:420px;margin:auto">
    <tr><td colspan="2" class="muted">32 bits</td></tr>
    <tr><td>Source port #</td><td>Dest. port #</td></tr><tr><td>Length</td><td>Checksum</td></tr>
    <tr><td colspan="2">Application data (message)</td></tr></table></div>`;
  X.http = `<div class="table-wrap"><table class="small" style="max-width:600px;margin:auto">
    <tr><th>Request line</th><td><code>method</code> sp <code>URL</code> sp <code>Version</code> cr lf</td></tr>
    <tr><th>Header lines</th><td><code>header field name:</code> sp <code>value</code> cr lf<br>⋮<br><code>header field name:</code> sp <code>value</code> cr lf</td></tr>
    <tr><th>Blank line</th><td>cr lf</td></tr><tr><th>Entity body</th><td>…</td></tr></table></div>`;
  X.ethernet = `<div class="table-wrap"><table class="center small" style="max-width:560px;margin:auto"><tr><td>Preamble</td><td>Dest. address</td><td>Source address</td><td>Type</td><td style="min-width:140px">Data (≤ 1500 bytes)</td><td>CRC</td></tr></table></div>`;
})();
