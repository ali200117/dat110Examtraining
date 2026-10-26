/* Regnetrening: generatorer for regneoppgavene som kommer hvert år */
(function () {
  'use strict';
  const D = window.DAT110;
  const R = D.rand;

  /* ---------- hjelpere ---------- */
  const bin8 = n => n.toString(2).padStart(8, '0');
  const ipBin = ip => ip.split('.').map(x => bin8(+x)).join(' ');
  const clean = s => String(s || '').replace(/[\s.:,_-]/g, '');
  function parseNum(s) {
    if (s === undefined || s === null) return NaN;
    let t = String(s).trim().replace(/,/g, '.').replace(/\s/g, '').replace(/[sS]$/, '');
    let m = t.match(/^(-?[\d.]+)[*x·×]10\^?\(?(-?\d+)\)?$/);
    if (m) return parseFloat(m[1]) * Math.pow(10, +m[2]);
    m = t.match(/^10\^\(?(-?\d+)\)?$/);
    if (m) return Math.pow(10, +m[1]);
    if (t === '∞' || /^inf/i.test(t)) return Infinity;
    return Number(t);
  }
  const close = (a, b) => (a === Infinity && b === Infinity) || (isFinite(a) && isFinite(b) && Math.abs(a - b) <= Math.max(1e-9, Math.abs(b) * 0.011));
  function mark(input, ok) { input.classList.remove('ok', 'err'); input.classList.add(ok ? 'ok' : 'err'); return ok; }
  const fmt = x => (x === Infinity ? '∞' : (Math.abs(x) < 0.001 && x !== 0 ? x.toExponential(3).replace('e', '·10^') : +x.toPrecision(6)));
  const card = (title, intro) => `<div class="card"><h2 class="mt0">${title}</h2>${intro ? `<p class="muted">${intro}</p>` : ''}<div class="tr-body"></div></div>`;
  function controls(el, onNew, onCheck, onSolve) {
    const row = D.el('div', { class: 'btn-row' });
    row.innerHTML = '<button class="btn" data-a="check">✔ Sjekk</button><button class="btn secondary" data-a="sol">Vis løsning</button><button class="btn ghost" data-a="new">↻ Ny oppgave</button><span class="small muted" data-a="res"></span>';
    row.querySelector('[data-a=new]').onclick = onNew;
    row.querySelector('[data-a=check]').onclick = () => { const r = onCheck(); row.querySelector('[data-a=res]').textContent = r; };
    row.querySelector('[data-a=sol]').onclick = onSolve;
    el.appendChild(row);
    return row;
  }
  function solBox(el, html) {
    let box = el.querySelector('.sol-box');
    if (!box) { box = D.el('div', { class: 'sol-box' }); el.appendChild(box); }
    box.innerHTML = html;
    box.classList.toggle('hidden', false);
  }

  /* ================= Chord DHT ================= */
  function chordSucc(nodes, k, N) {
    k = ((k % N) + N) % N;
    const s = nodes.filter(n => n >= k);
    return s.length ? Math.min(...s) : Math.min(...nodes);
  }
  const inOpenClosed = (x, a, b, N) => { const d = (x - a + N) % N, e = (b - a + N) % N; return d > 0 && d <= (e === 0 ? N : e); }; // a < x ≤ b
  const inOpen = (x, a, b, N) => { const d = (x - a + N) % N, e = (b - a + N) % N; return d > 0 && d < (e === 0 ? N : e); }; // a < x < b
  function chordLookup(nodes, ft, start, k, N) {
    const lines = [];
    let n = start, round = 1, guard = 0;
    while (guard++ < 20) {
      const succ = ft[n][0];
      lines.push(`<b>Runde ${round}</b>: n = ${n}, k = ${k}, succ(${n}) = ${succ}`);
      if (inOpenClosed(k, n, succ, N)) {
        lines.push(`Steg 1: ${n} &lt; ${k} ≤ ${succ}? <b>Ja</b> → svaret er <b>${succ}</b>.`);
        return { ans: succ, lines };
      }
      lines.push(`Steg 1: ${n} &lt; ${k} ≤ ${succ}? Nei.`);
      let next = null;
      for (let i = ft[n].length - 1; i >= 0; i--) {
        const f = ft[n][i];
        const ok = inOpen(f, n, k, N);
        lines.push(`&nbsp;&nbsp;Steg 2: Finger(${i + 1}) = ${f}: ${n} &lt; ${f} &lt; ${k}? ${ok ? '<b>Ja</b> → gå til ' + f : 'Nei'}`);
        if (ok) { next = f; break; }
      }
      if (next === null) { lines.push(`Ingen finger mellom – svaret er succ(${n}) = ${succ}.`); return { ans: succ, lines }; }
      n = next; round++;
    }
    return { ans: null, lines };
  }
  function trainerDHT(el) {
    el.innerHTML = card('Chord DHT (Oppgave 10)', 'm = 5 (ID 0–31). Fingertabell: FT_n[i] = succ(n + 2^(i−1) mod 32). Ansvar: pred &lt; k ≤ n. Oppslag som i sensorveiledningen.');
    const body = el.querySelector('.tr-body');
    const N = 32;
    const cnt = R(4, 6);
    const set = new Set();
    while (set.size < cnt) set.add(R(0, 31));
    const nodes = [...set].sort((a, b) => a - b);
    const ft = {};
    nodes.forEach(n => ft[n] = [1, 2, 4, 8, 16].map(d => chordSucc(nodes, n + d, N)));
    const fNode = D.pick(nodes);
    const keys = [];
    while (keys.length < 4) { const k = R(0, 31); if (!keys.includes(k)) keys.push(k); }
    let lStart = D.pick(nodes), lKey;
    do { lKey = R(0, 31); } while (chordSucc(nodes, lKey, N) === ft[lStart][0] || nodes.includes(lKey) && lKey === lStart);
    const look = chordLookup(nodes, ft, lStart, lKey, N);
    body.innerHTML = `<div class="figure">${D.fig.chordRing(nodes, 5, { size: 340 })}</div>
      <p><b>Noder:</b> ${nodes.join(', ')}</p>
      <h4>a) Fingertabellen til node ${fNode}</h4>
      <div class="flex">${[1, 2, 3, 4, 5].map(i => `<label class="small">i=${i}: succ(${fNode}+${Math.pow(2, i - 1)}) = <input class="cell-input" data-ft="${i - 1}"></label>`).join('')}</div>
      <h4>b) Hvilken node har ansvaret for nøklene?</h4>
      <div class="flex">${keys.map((k, i) => `<label class="small">k = ${k} → <input class="cell-input" data-key="${i}"></label>`).join('')}</div>
      <h4>c) Slå opp nøkkel ${lKey} fra node ${lStart}. Hvilken node er ansvarlig?</h4>
      <label class="small">Svar: <input class="cell-input" data-look></label>`;
    controls(body, () => trainerDHT(el), () => {
      let ok = 0, tot = 0;
      body.querySelectorAll('[data-ft]').forEach(inp => { tot++; if (mark(inp, +inp.value === ft[fNode][+inp.dataset.ft] && inp.value !== '')) ok++; });
      body.querySelectorAll('[data-key]').forEach(inp => { tot++; if (mark(inp, +inp.value === chordSucc(nodes, keys[+inp.dataset.key], N) && inp.value !== '')) ok++; });
      const li = body.querySelector('[data-look]'); tot++; if (mark(li, +li.value === look.ans && li.value !== '')) ok++;
      return `${ok} av ${tot} riktige`;
    }, () => {
      const rows = nodes.map(n => `<tr><td><b>${n}</b></td>${ft[n].map((f, i) => `<td>succ(${(n + Math.pow(2, i)) % N}) = ${f}</td>`).join('')}</tr>`).join('');
      solBox(body, `<b>a) Fingertabeller for alle noder</b><div class="table-wrap"><table class="small mono"><tr><th>node</th><th>i=1</th><th>i=2</th><th>i=3</th><th>i=4</th><th>i=5</th></tr>${rows}</table></div>
        <b>b)</b> ${keys.map(k => `k=${k} → ${chordSucc(nodes, k, N)}`).join(' · ')} (regel: pred(n) &lt; k ≤ n)<br><br>
        <b>c)</b><br>${look.lines.join('<br>')}`);
    });
  }

  /* ================= Vektorklokker ================= */
  function genVC(P) {
    const E = R(3, 4);
    const seq = Array.from({ length: P }, () => []);
    const reserved = Array(P).fill(0);
    const pending = [];
    let msgLeft = R(2, Math.min(4, P + 1)), msgNo = 0, localNo = 0;
    const order = [];
    let guard = 0;
    const room = p => seq[p].length + reserved[p] < E;
    while (seq.some(s => s.length < E) && guard++ < 500) {
      const p = R(0, P - 1);
      if (seq[p].length >= E) continue;
      const mine = pending.filter(m => m.to === p);
      if (mine.length && (Math.random() < 0.6 || !room(p))) {
        const m = mine[0];
        pending.splice(pending.indexOf(m), 1);
        reserved[p]--;
        const ev = { p, name: 'r' + m.no, type: 'r', msg: m };
        seq[p].push(ev); order.push(ev);
        continue;
      }
      if (!room(p)) continue;
      const targets = [...Array(P).keys()].filter(q => q !== p && room(q) && seq[q].length + reserved[q] < E);
      if (msgLeft > 0 && targets.length && Math.random() < 0.5) {
        const q = D.pick(targets);
        const m = { no: ++msgNo, from: p, to: q };
        msgLeft--; reserved[q]++;
        const ev = { p, name: 's' + m.no, type: 's', msg: m };
        m.sendEv = ev;
        seq[p].push(ev); order.push(ev); pending.push(m);
        continue;
      }
      const ev = { p, name: 'abcdefghijklmnopqrstuvwxyz'[localNo++], type: 'l' };
      seq[p].push(ev); order.push(ev);
    }
    // vektorklokker og Lamport i global rekkefølge
    const vc = Array.from({ length: P }, () => Array(P).fill(0));
    const lc = Array(P).fill(0);
    order.forEach(ev => {
      const p = ev.p;
      if (ev.type === 'r') {
        const ts = ev.msg.sendEv.vc;
        for (let i = 0; i < P; i++) vc[p][i] = Math.max(vc[p][i], ts[i]);
        lc[p] = Math.max(lc[p], ev.msg.sendEv.lc);
      }
      vc[p][p]++;
      lc[p]++;
      ev.vc = vc[p].slice();
      ev.lc = lc[p];
    });
    return { P, seq };
  }
  function trainerVC(el) {
    el.innerHTML = card('Vektorklokker og Lamport (Oppgave 9)', 'Regel 1: send/lokal → egen komponent +1. Regel 2: mottak → elementvis max(egen, meldingens tidsstempel), deretter regel 1. Skriv vektorer som «2100» eller «2,1,0,0».');
    const body = el.querySelector('.tr-body');
    const P = D.store.get('vcP', 4);
    const mode = D.store.get('vcMode', 'vc');
    const g = genVC(P);
    const cols = Math.max(...g.seq.map(s => s.length));
    const msgs = [];
    g.seq.forEach((s, p) => s.forEach((ev, i) => { if (ev.type === 's') { const r = g.seq[ev.msg.to].findIndex(x => x.type === 'r' && x.msg === ev.msg); msgs.push({ from: [p, i], to: [ev.msg.to, r] }); } }));
    body.innerHTML = `<div class="flex"><label class="small">Prosesser: <select data-p>${[3, 4].map(n => `<option ${n === P ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
      <label class="small">Type: <select data-mode><option value="vc" ${mode === 'vc' ? 'selected' : ''}>Vektorklokker</option><option value="lc" ${mode === 'lc' ? 'selected' : ''}>Lamport-klokker</option></select></label></div>
      <p class="small">Hendelsene (s<sub>i</sub>/r<sub>i</sub> = sending/mottak av melding i, bokstaver = lokale hendelser):</p>
      <div class="table-wrap"><table class="center mono"><tr><th></th>${Array.from({ length: cols }, (_, i) => `<th>${i + 1}</th>`).join('')}</tr>
      ${g.seq.map((s, p) => `<tr><th>P${p + 1}</th>${Array.from({ length: cols }, (_, i) => s[i] ? `<td>${s[i].name}<br><input class="cell-input" data-p="${p}" data-i="${i}"></td>` : '<td></td>').join('')}</tr>`).join('')}
      </table></div>
      <details class="reveal"><summary>Vis som tidslinje</summary><div class="figure">${D.fig.timeline(g.seq.map((_, p) => 'P' + (p + 1)), g.seq.map(s => s.map(e => e.name)), msgs)}</div></details>`;
    body.querySelector('[data-p]').onchange = e => { D.store.set('vcP', +e.target.value); trainerVC(el); };
    body.querySelector('[data-mode]').onchange = e => { D.store.set('vcMode', e.target.value); trainerVC(el); };
    const want = ev => mode === 'vc' ? ev.vc.join('') : String(ev.lc);
    controls(body, () => trainerVC(el), () => {
      let ok = 0, tot = 0;
      body.querySelectorAll('input[data-i]').forEach(inp => {
        const ev = g.seq[+inp.dataset.p][+inp.dataset.i];
        tot++;
        if (mark(inp, clean(inp.value) === want(ev))) ok++;
      });
      return `${ok} av ${tot} riktige`;
    }, () => {
      solBox(body, `<div class="table-wrap"><table class="center mono"><tr><th></th>${Array.from({ length: cols }, (_, i) => `<th>${i + 1}</th>`).join('')}</tr>
        ${g.seq.map((s, p) => `<tr><th>P${p + 1}</th>${Array.from({ length: cols }, (_, i) => s[i] ? `<td>${s[i].name}: <b>${mode === 'vc' ? s[i].vc.join('') : s[i].lc}</b></td>` : '<td></td>').join('')}</tr>`).join('')}</table></div>
        <div class="small">${g.seq.flat().filter(e => e.type === 'r').map(e => `${e.name} hos P${e.p + 1}: max(…, ${mode === 'vc' ? '[' + e.msg.sendEv.vc.join(',') + ']' : e.msg.sendEv.lc}) og +1 → <b>${mode === 'vc' ? '[' + e.vc.join(',') + ']' : e.lc}</b>`).join('<br>')}</div>`);
    });
  }

  /* ================= IP, CIDR og LPM ================= */
  function trainerIP(el) {
    el.innerHTML = card('IP-adresser, CIDR og longest prefix match (Oppgave 6)', 'Posisjonsverdier: 128 64 32 16 8 4 2 1. /x-blokk har 2^(32−x) adresser.');
    const body = el.querySelector('.tr-body');
    const ip = [R(1, 223), R(0, 255), R(0, 255), R(0, 255)];
    const x = D.pick([16, 18, 20, 21, 22, 23, 24, 26, 27]);
    const baseIp = [R(10, 223), R(0, 255), R(0, 255), 0];
    const ipInt = baseIp.reduce((a, b) => a * 256 + b, 0);
    const mask = x === 0 ? 0 : (0xFFFFFFFF << (32 - x)) >>> 0;
    const first = (ipInt & mask) >>> 0, last = (first | (~mask >>> 0)) >>> 0;
    const toIp = n => [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
    // tabell for LPM
    const b1 = R(128, 223), b2 = R(0, 255), b3 = R(0, 255);
    const pre = bin8(b1) + bin8(b2) + bin8(b3);
    const lens = D.shuffle([16, 20, 24, 22, 18]).slice(0, 3).sort((a, b) => a - b);
    const table = lens.map((l, i) => ({ p: pre.slice(0, l), ifc: i + 1 }));
    table.push({ p: null, ifc: 0 });
    const lpm = bits => { let best = null; table.forEach(t => { if (t.p && bits.startsWith(t.p) && (!best || t.p.length > best.p.length)) best = t; }); return best ? best.ifc : 0; };
    const dests = [];
    const randAround = () => {
      const r = Math.random();
      if (r < 0.35) return [b1, b2, b3, R(0, 255)];
      if (r < 0.65) return [b1, b2, (b3 ^ (1 << R(0, 7))), R(0, 255)];
      if (r < 0.85) return [b1, (b2 ^ (1 << R(0, 3))), R(0, 255), R(0, 255)];
      return [R(1, 223), R(0, 255), R(0, 255), R(0, 255)];
    };
    while (dests.length < 3) dests.push(randAround());
    const fmtPre = p => p.match(/.{1,8}/g).join(' ');
    body.innerHTML = `
      <h4>a) Hva er ${ip.join('.')} i binær?</h4><input type="text" data-bin placeholder="xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx">
      <h4>b) CIDR-blokken ${toIp(first)}/${x}: første adresse, siste adresse og antall adresser</h4>
      <div class="flex"><label class="small">Første: <input class="cell-input wide" data-first></label><label class="small">Siste: <input class="cell-input wide" data-last></label><label class="small">Antall: <input class="cell-input wide" data-count></label></div>
      <h4>c) Videresendingstabell – hvilket grensesnitt?</h4>
      <div class="table-wrap"><table class="mono small"><tr><th>Destination</th><th>Interface</th></tr>${table.map(t => `<tr><td>${t.p ? fmtPre(t.p) : 'otherwise'}</td><td>${t.ifc}</td></tr>`).join('')}</table></div>
      <div class="flex">${dests.map((d, i) => `<label class="small">${d.join('.')} → <input class="cell-input" data-dest="${i}"></label>`).join('')}</div>`;
    controls(body, () => trainerIP(el), () => {
      let ok = 0, tot = 4;
      if (mark(body.querySelector('[data-bin]'), clean(body.querySelector('[data-bin]').value) === ip.map(bin8).join(''))) ok++;
      if (mark(body.querySelector('[data-first]'), body.querySelector('[data-first]').value.trim() === toIp(first))) ok++;
      if (mark(body.querySelector('[data-last]'), body.querySelector('[data-last]').value.trim() === toIp(last))) ok++;
      if (mark(body.querySelector('[data-count]'), parseNum(body.querySelector('[data-count]').value) === Math.pow(2, 32 - x))) ok++;
      body.querySelectorAll('[data-dest]').forEach(inp => { tot++; const d = dests[+inp.dataset.dest]; if (mark(inp, inp.value !== '' && +inp.value === lpm(d.map(bin8).join('')))) ok++; });
      return `${ok} av ${tot} riktige`;
    }, () => {
      solBox(body, `<b>a)</b> <span class="bits">${ipBin(ip.join('.'))}</span><br>
        <b>b)</b> /${x}: de første ${x} bitene er faste. Første = vertsbit 0 → <b>${toIp(first)}</b>, siste = vertsbit 1 → <b>${toIp(last)}</b>, antall = 2^${32 - x} = <b>${Math.pow(2, 32 - x)}</b><br>
        <span class="bits small">${ipBin(toIp(first))}<br>${ipBin(toIp(last))}</span><br>
        <b>c)</b><br>${dests.map(d => { const bits = d.map(bin8).join(''); const m = table.filter(t => t.p && bits.startsWith(t.p)); return `${d.join('.')} = <span class="bits">${ipBin(d.join('.'))}</span> → ${m.length ? 'matcher ' + m.map(t => t.p.length + ' bit (if ' + t.ifc + ')').join(', ') + ' → lengste: <b>' + lpm(bits) + '</b>' : 'ingen match → <b>otherwise (0)</b>'}`; }).join('<br>')}`);
    });
  }

  /* ================= Forsinkelse ================= */
  function trainerDelay(el) {
    el.innerHTML = card('Forsinkelse, trafikkintensitet og flaskehals (Oppgave 3)', 'Skriv svar i sekunder. Du kan skrive 0,001 eller 1e-3 eller 1*10^-3. 1 % avvik godtas.');
    const body = el.querySelector('.tr-body');
    const pick = D.pick;
    const Rr = pick([1e5, 1e6, 2e6, 5e6, 1e7, 1e8]);
    const L = pick([1e3, 2e3, 4e3, 5e3, 1e4, 2e4, 1e5]);
    const d = pick([1e3, 1e4, 5e4, 1e5, 2e5, 1e6]);
    const s = pick([2e8, 3e8, 5e8, 8e8]);
    const proc = pick([0.001, 0.002, 0.005, 0.008]);
    const queue = pick([0.004, 0.01, 0.02, 0.05]);
    const a = pick([5, 10, 20, 50, 100]);
    const rates = D.shuffle([10, 30, 50, 80, 100]).slice(0, 3);
    const tr = L / Rr, pr = d / s, nod = proc + queue + tr + pr, e2e = 3 * nod, ti = L * a / Rr;
    const bott = Math.min(...rates);
    const names = ['H1→R1', 'R1→R2', 'R2→H3'];
    const util = bott / rates[2];
    const sup = n => { const e = Math.floor(Math.log10(n) + 1e-9); const m = +(n / Math.pow(10, e)).toPrecision(3); return (m === 1 ? '' : m + '·') + '10<sup>' + e + '</sup>'; };
    body.innerHTML = `<div class="figure">${D.examFig ? D.examFig.delayNet() : ''}</div>
      <p>Link R1–R2: R = ${sup(Rr)} bit/s, d = ${sup(d)} m, s = ${sup(s)} m/s. Pakkelengde L = ${sup(L)} bit. R1: d<sub>proc</sub> = ${proc} s, d<sub>queue</sub> = ${queue} s. H1 og R2 har samme forsinkelser; alle linker er like.</p>
      <div class="kv">
        <b>a) d_trans</b><input class="cell-input wide" data-k="tr">
        <b>b) d_prop</b><input class="cell-input wide" data-k="pr">
        <b>c) d_nodal (R1)</b><input class="cell-input wide" data-k="nod">
        <b>d) ende-til-ende H1→H3</b><input class="cell-input wide" data-k="e2e">
        <b>e) trafikkintensitet når ${a} pakker/s</b><input class="cell-input wide" data-k="ti">
      </div>
      <p>f) Nye rater: H1→R1 = ${rates[0]} Mbps, R1→R2 = ${rates[1]} Mbps, R2→H3 = ${rates[2]} Mbps. Bare H1 sender (maks).</p>
      <div class="kv"><b>Flaskehals (link)</b><select data-bott><option value="">velg</option>${names.map((n, i) => `<option value="${i}">${n}</option>`).join('')}</select>
        <b>Gjennomstrømning (Mbps)</b><input class="cell-input wide" data-k="thr">
        <b>Utnyttelse R2→H3</b><input class="cell-input wide" data-k="util"></div>`;
    const want = { tr, pr, nod, e2e, ti, thr: bott, util };
    controls(body, () => trainerDelay(el), () => {
      let ok = 0, tot = 0;
      body.querySelectorAll('[data-k]').forEach(inp => { tot++; if (mark(inp, close(parseNum(inp.value), want[inp.dataset.k]))) ok++; });
      const sel = body.querySelector('[data-bott]'); tot++;
      if (mark(sel, sel.value !== '' && rates[+sel.value] === bott)) ok++;
      return `${ok} av ${tot} riktige`;
    }, () => {
      solBox(body, `a) d_trans = L/R = ${sup(L)} / ${sup(Rr)} = <b>${fmt(tr)} s</b><br>
        b) d_prop = d/s = ${sup(d)} / ${sup(s)} = <b>${fmt(pr)} s</b><br>
        c) d_nodal = ${proc} + ${queue} + ${fmt(tr)} + ${fmt(pr)} = <b>${fmt(nod)} s</b><br>
        d) 3 noder sender (H1, R1, R2): 3 · ${fmt(nod)} = <b>${fmt(e2e)} s</b><br>
        e) La/R = ${sup(L)} · ${a} / ${sup(Rr)} = <b>${fmt(ti)}</b> ${ti < 0.5 ? '(liten – lite kø)' : ti < 1 ? '(merkbar kø, vokser mot 1)' : '(≥ 1 – køen vokser uten grense!)'}<br>
        f) Flaskehals = laveste rate = <b>${names[rates.indexOf(bott)]} (${bott} Mbps)</b>. Gjennomstrømning ${bott} Mbps. Utnyttelse R2→H3 = ${bott}/${rates[2]} = <b>${fmt(util)}</b>`);
    });
  }

  /* ================= Distance-vector ================= */
  function trainerDV(el) {
    el.innerHTML = card('Distance-vector / Bellman-Ford (Oppgave 5)', 'D_x(y) = min_v { c(x,v) + D_v(y) }. Initialisering: 0 til seg selv, linkkost til naboer, ∞ ellers (skriv «inf» eller ∞).');
    const body = el.querySelector('.tr-body');
    const names = ['R1', 'R2', 'R3', 'R4'];
    const allE = [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [0, 3]];
    let edges;
    do {
      edges = D.shuffle(allE).slice(0, R(4, 5)).map(e => ({ a: e[0], b: e[1], w: R(1, 10) }));
    } while (!connected(edges) || edges.some(e => e.a === 0 && e.b === 3));
    function connected(es) { const seen = new Set([0]); let ch = true; while (ch) { ch = false; es.forEach(e => { if (seen.has(e.a) && !seen.has(e.b)) { seen.add(e.b); ch = true; } if (seen.has(e.b) && !seen.has(e.a)) { seen.add(e.a); ch = true; } }); } return seen.size === 4; }
    const c = Array.from({ length: 4 }, (_, i) => Array.from({ length: 4 }, (_, j) => i === j ? 0 : Infinity));
    edges.forEach(e => { c[e.a][e.b] = e.w; c[e.b][e.a] = e.w; });
    const init = c.map(r => r.slice());
    const dist = c.map(r => r.slice());
    for (let k = 0; k < 4; k++) for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) if (dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];
    // én oppdatering: x mottar initialvektorene fra ALLE naboer
    const x = R(0, 3);
    const nb = [0, 1, 2, 3].filter(v => v !== x && c[x][v] !== Infinity);
    const upd = [0, 1, 2, 3].map(y => y === x ? 0 : Math.min(...nb.map(v => c[x][v] + init[v][y])));
    const nodes = [{ id: 'R1', x: 60, y: 100 }, { id: 'R2', x: 210, y: 35 }, { id: 'R3', x: 210, y: 165 }, { id: 'R4', x: 360, y: 100 }];
    const fig = D.fig.graph(nodes, edges.map(e => ({ a: names[e.a], b: names[e.b], w: e.w })), { width: 420, height: 200 });
    const row = (pre, vals) => `<tr><th>D<sub>${pre}</sub></th>${[0, 1, 2, 3].map(j => `<td>${vals(j)}</td>`).join('')}</tr>`;
    body.innerHTML = `<div class="figure">${fig}</div>
      <h4>a) Least-cost fra R1 til R4</h4><label class="small">Kostnad: <input class="cell-input" data-lc></label>
      <h4>b) Distansevektorene etter initialisering</h4>
      <div class="table-wrap"><table class="center"><tr><th>y</th>${names.map(n => `<th>${n}</th>`).join('')}</tr>${[0, 1, 2, 3].map(i => row(names[i], j => `<input class="cell-input" data-init="${i}-${j}">`)).join('')}</table></div>
      <h4>c) ${names[x]} mottar initialvektorene fra alle naboene sine (${nb.map(v => names[v]).join(', ')}). Hva blir D<sub>${names[x]}</sub>?</h4>
      <div class="table-wrap"><table class="center"><tr><th>y</th>${names.map(n => `<th>${n}</th>`).join('')}</tr>${row(names[x], j => `<input class="cell-input" data-upd="${j}">`)}</table></div>
      <h4>d) D<sub>${names[x]}</sub> når algoritmen har konvergert</h4>
      <div class="table-wrap"><table class="center"><tr><th>y</th>${names.map(n => `<th>${n}</th>`).join('')}</tr>${row(names[x], j => `<input class="cell-input" data-fin="${j}">`)}</table></div>`;
    controls(body, () => trainerDV(el), () => {
      let ok = 0, tot = 1;
      if (mark(body.querySelector('[data-lc]'), parseNum(body.querySelector('[data-lc]').value) === dist[0][3])) ok++;
      body.querySelectorAll('[data-init]').forEach(inp => { tot++; const [i, j] = inp.dataset.init.split('-').map(Number); if (mark(inp, inp.value !== '' && parseNum(inp.value) === init[i][j])) ok++; });
      body.querySelectorAll('[data-upd]').forEach(inp => { tot++; if (mark(inp, inp.value !== '' && parseNum(inp.value) === upd[+inp.dataset.upd])) ok++; });
      body.querySelectorAll('[data-fin]').forEach(inp => { tot++; if (mark(inp, inp.value !== '' && parseNum(inp.value) === dist[x][+inp.dataset.fin])) ok++; });
      return `${ok} av ${tot} riktige`;
    }, () => {
      const f = v => v === Infinity ? '∞' : v;
      solBox(body, `<b>a)</b> ${dist[0][3]}<br><b>b)</b><div class="table-wrap"><table class="center mono"><tr><th>y</th>${names.map(n => `<th>${n}</th>`).join('')}</tr>${init.map((r, i) => `<tr><th>D_${names[i]}</th>${r.map(v => `<td>${f(v)}</td>`).join('')}</tr>`).join('')}</table></div>
        <b>c)</b> ${[0, 1, 2, 3].filter(y => y !== x).map(y => `${names[y]}: min(${nb.map(v => `${c[x][v]}+${f(init[v][y])}`).join(', ')}) = <b>${f(upd[y])}</b>`).join(' · ')}<br>
        <b>d)</b> D_${names[x]} = [${dist[x].map(f).join(', ')}]`);
    });
  }

  /* ================= Overlay / RDP ================= */
  function trainerOverlay(el) {
    el.innerHTML = card('Overlay-multicast: RDP og tree cost (Oppgave 8)', 'Prosessene henger på hver sin ruter med kost 1. Overlay-kant = 1 + korteste ruter-vei + 1. RDP = overlay-sti i treet / beste fysiske vei.');
    const body = el.querySelector('.tr-body');
    const w = { ab: D.pick([5, 10, 15]), bc: D.pick([5, 10, 15, 20, 30]), cd: D.pick([5, 10, 20]), de: D.pick([5, 10, 15, 20]), ae: D.pick([15, 25, 40, 50, 75]) };
    const P = ['A', 'B', 'C', 'D', 'E'];
    const ring = [w.ab, w.bc, w.cd, w.de, w.ae]; // Ra-Rb, Rb-Rc, Rc-Rd, Rd-Re, Re-Ra
    const tot = ring.reduce((a, b) => a + b, 0);
    const dist = (i, j) => { if (i === j) return 0; const [a, b] = i < j ? [i, j] : [j, i]; let s = 0; for (let k = a; k < b; k++) s += ring[k]; return Math.min(s, tot - s) + 2; };
    const pairs = [];
    for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) pairs.push([i, j]);
    const t1 = D.shuffle([0, 1, 2, 3, 4]), t2 = D.shuffle([0, 1, 2, 3, 4]);
    let src = R(0, 4), dst; do { dst = R(0, 4); } while (dst === src);
    const treePath = (t, a, b) => { const ia = t.indexOf(a), ib = t.indexOf(b); const [lo, hi] = ia < ib ? [ia, ib] : [ib, ia]; let s = 0; for (let k = lo; k < hi; k++) s += dist(t[k], t[k + 1]); return s; };
    const treeCost = t => { let s = 0; for (let k = 0; k < 4; k++) s += dist(t[k], t[k + 1]); return s; };
    const phys = dist(src, dst);
    const r1 = treePath(t1, src, dst) / phys, r2 = treePath(t2, src, dst) / phys;
    body.innerHTML = `<div class="figure">${D.examFig.overlay5(w)}</div>
      <h4>a) Fullt koblet overlay – minste forsinkelse per par (${pairs.length} kanter)</h4>
      <div class="flex">${pairs.map(([i, j]) => `<label class="small">${P[i]}–${P[j]} <input class="cell-input" data-pair="${i}${j}"></label>`).join('')}</div>
      <h4>b) RDP fra ${P[src]} til ${P[dst]} for tre 1: ${t1.map(i => P[i]).join(' – ')} og tre 2: ${t2.map(i => P[i]).join(' – ')}</h4>
      <div class="flex"><label class="small">RDP tre 1 <input class="cell-input" data-r1></label><label class="small">RDP tre 2 <input class="cell-input" data-r2></label></div>
      <h4>c) Tree cost</h4>
      <div class="flex"><label class="small">Tre 1 <input class="cell-input" data-c1></label><label class="small">Tre 2 <input class="cell-input" data-c2></label></div>`;
    controls(body, () => trainerOverlay(el), () => {
      let ok = 0, n = 0;
      body.querySelectorAll('[data-pair]').forEach(inp => { n++; const [i, j] = inp.dataset.pair.split('').map(Number); if (mark(inp, parseNum(inp.value) === dist(i, j))) ok++; });
      const chk = (sel, v) => { n++; const inp = body.querySelector(sel); if (mark(inp, inp.value !== '' && Math.abs(parseNum(inp.value) - v) < 0.015)) ok++; };
      chk('[data-r1]', r1); chk('[data-r2]', r2); chk('[data-c1]', treeCost(t1)); chk('[data-c2]', treeCost(t2));
      return `${ok} av ${n} riktige`;
    }, () => {
      const path = t => { const ia = t.indexOf(src), ib = t.indexOf(dst); const seg = ia < ib ? t.slice(ia, ib + 1) : t.slice(ib, ia + 1).reverse(); return seg.map(i => P[i]).join('–') + ' = ' + seg.slice(1).map((v, k) => dist(seg[k], v)).join('+'); };
      solBox(body, `<b>a)</b> ${pairs.map(([i, j]) => `${P[i]}–${P[j]} ${dist(i, j)}`).join(' · ')}<br>
        <b>b)</b> Beste fysiske ${P[src]}–${P[dst]} = ${phys}. Tre 1: ${path(t1)} = ${treePath(t1, src, dst)} → RDP = <b>${r1.toFixed(2)}</b>. Tre 2: ${path(t2)} = ${treePath(t2, src, dst)} → RDP = <b>${r2.toFixed(2)}</b>. ${r1 < r2 ? 'Tre 1' : r2 < r1 ? 'Tre 2' : 'Begge'} er best for ${P[src]}→${P[dst]}.<br>
        <b>c)</b> Tre 1 = ${treeCost(t1)}, tre 2 = ${treeCost(t2)} → ${treeCost(t1) < treeCost(t2) ? 'tre 1' : treeCost(t2) < treeCost(t1) ? 'tre 2' : 'like'} er mest effektivt globalt.`);
    });
  }

  /* ================= Fragmentering ================= */
  function trainerFrag(el) {
    el.innerHTML = card('IP-fragmentering (Oppgave 3/4)', 'Header = 20 byte. Maks data per fragment = MTU − 20 rundet ned til multiplum av 8. Offset i enheter à 8 byte.');
    const body = el.querySelector('.tr-body');
    const mtu = D.pick([1500, 1500, 1000, 576, 1280]);
    const total = R(15, 90) * 100 + D.pick([0, 20]);
    const id = R(100, 9999);
    const maxData = Math.floor((mtu - 20) / 8) * 8;
    const data = total - 20;
    const n = Math.ceil(data / maxData);
    const frags = Array.from({ length: n }, (_, k) => { const sz = k < n - 1 ? maxData : data - maxData * (n - 1); return { len: sz + 20, off: k * maxData / 8, flag: k < n - 1 ? 1 : 0 }; });
    body.innerHTML = `<p>Et datagram på <b>${total} byte</b> (20 byte header, identifier ${id}) skal videresendes over en link med <b>MTU = ${mtu}</b> byte.</p>
      <div class="kv"><b>Antall fragmenter</b><input class="cell-input" data-n></div>
      <p class="small">Fyll inn for hvert fragment (lengde inkl. header, offset, flagg):</p>
      <div class="table-wrap"><table class="center"><tr><th>#</th><th>Lengde</th><th>Offset</th><th>Flagg</th></tr>
      ${Array.from({ length: Math.max(n, 2) + 1 }, (_, k) => `<tr><td>${k + 1}</td><td><input class="cell-input" data-f="${k}-len"></td><td><input class="cell-input" data-f="${k}-off"></td><td><input class="cell-input" data-f="${k}-flag"></td></tr>`).join('')}</table></div>`;
    controls(body, () => trainerFrag(el), () => {
      let ok = 0, tot = 1;
      if (mark(body.querySelector('[data-n]'), +body.querySelector('[data-n]').value === n)) ok++;
      body.querySelectorAll('[data-f]').forEach(inp => {
        const [k, f] = inp.dataset.f.split('-'); const fr = frags[+k];
        if (!fr) { if (inp.value.trim() !== '') mark(inp, false); return; }
        tot++; if (mark(inp, inp.value !== '' && +inp.value === fr[f])) ok++;
      });
      return `${ok} av ${tot} riktige`;
    }, () => {
      solBox(body, `Data = ${total} − 20 = ${data}. Maks data per fragment = ${maxData} (${mtu} − 20${maxData !== mtu - 20 ? ', rundet ned til multiplum av 8' : ''}). Antall = ⌈${data}/${maxData}⌉ = <b>${n}</b>.<br>
        ${frags.map((f, k) => `Fragment ${k + 1}: id ${id}, lengde ${f.len} (data ${f.len - 20}), offset ${f.off} (= ${f.off * 8}/8), flagg ${f.flag}`).join('<br>')}`);
    });
  }

  /* ================= Sjekksum ================= */
  function trainerChecksum(el) {
    el.innerHTML = card('Internett-sjekksum (enerkomplement)', 'Legg sammen med wraparound (mente ut av toppen legges til nederst) og inverter alle bit.');
    const body = el.querySelector('.tr-body');
    const words = [R(0, 255), R(0, 255), R(0, 255)];
    let sum = 0;
    const steps = [];
    words.forEach((w, i) => { if (i === 0) { sum = w; return; } sum += w; let note = ''; if (sum > 255) { sum = (sum & 255) + 1; note = ' (wraparound +1)'; } steps.push(`+ ${bin8(w)} = ${bin8(sum)}${note}`); });
    const cs = (~sum) & 255;
    body.innerHTML = `<p class="bits">${words.map(bin8).join(', ')}</p>
      <div class="kv"><b>Sum (8 bit)</b><input class="cell-input wide" data-sum><b>Sjekksum</b><input class="cell-input wide" data-cs></div>`;
    controls(body, () => trainerChecksum(el), () => {
      let ok = 0;
      if (mark(body.querySelector('[data-sum]'), clean(body.querySelector('[data-sum]').value) === bin8(sum))) ok++;
      if (mark(body.querySelector('[data-cs]'), clean(body.querySelector('[data-cs]').value) === bin8(cs))) ok++;
      return `${ok} av 2 riktige`;
    }, () => solBox(body, `<pre>  ${bin8(words[0])}\n${steps.join('\n')}\nenerkomplement → ${bin8(cs)}</pre>`));
  }

  /* ================= RSA ================= */
  function trainerRSA(el) {
    el.innerHTML = card('RSA med små tall', 'n = p·q, z = (p−1)(q−1), e·d mod z = 1, c = m^e mod n, m = c^d mod n.');
    const body = el.querySelector('.tr-body');
    const primes = [3, 5, 7, 11, 13, 17];
    let p, q; do { p = D.pick(primes); q = D.pick(primes); } while (p === q);
    const n = p * q, z = (p - 1) * (q - 1);
    const gcd = (a, b) => b ? gcd(b, a % b) : a;
    const es = []; for (let e = 3; e < z; e++) if (gcd(e, z) === 1) es.push(e);
    const e = D.pick(es.slice(0, 5));
    let d = 1; while ((e * d) % z !== 1 || d === e) d++;
    const m = R(2, n - 2);
    const powmod = (b, x, md) => { let r = 1; b %= md; while (x > 0) { if (x & 1) r = r * b % md; b = b * b % md; x >>= 1; } return r; };
    const c = powmod(m, e, n);
    body.innerHTML = `<p>p = ${p}, q = ${q}, e = ${e}. Krypter m = ${m} med offentlig nøkkel og dekrypter igjen.</p>
      <div class="kv"><b>n</b><input class="cell-input" data-k="n"><b>z</b><input class="cell-input" data-k="z"><b>d (minste d ≠ e)</b><input class="cell-input" data-k="d"><b>c = m^e mod n</b><input class="cell-input" data-k="c"></div>`;
    const want = { n, z, d, c };
    controls(body, () => trainerRSA(el), () => {
      let ok = 0; body.querySelectorAll('[data-k]').forEach(inp => { if (mark(inp, inp.value !== '' && +inp.value === want[inp.dataset.k])) ok++; });
      return `${ok} av 4 riktige`;
    }, () => solBox(body, `n = ${p}·${q} = <b>${n}</b>, z = ${p - 1}·${q - 1} = <b>${z}</b>. d: ${e}·${d} = ${e * d} = ${Math.floor(e * d / z)}·${z} + 1 → <b>d = ${d}</b>.<br>c = ${m}^${e} mod ${n} = <b>${c}</b>. Kontroll: ${c}^${d} mod ${n} = ${powmod(c, d, n)} ✔<br>Offentlig nøkkel (${n}, ${e}), privat nøkkel (${n}, ${d}).`));
  }

  /* ================= Flooding ================= */
  function trainerFlood(el) {
    el.innerHTML = card('Flooding og antall kanter', 'Fullt koblet: N(N−1)/2. Tre: N−1. Tilfeldig graf: p·N(N−1)/2.');
    const body = el.querySelector('.tr-body');
    const N = D.pick([10, 20, 50, 100, 200, 500, 1000]), p = D.pick([0.2, 0.3, 0.4, 0.5, 0.6]);
    const full = N * (N - 1) / 2, tree = N - 1, rnd = p * full;
    body.innerHTML = `<p>N = ${N} noder, sannsynlighet for kant p = ${p}.</p>
      <div class="kv"><b>Meldinger i et tre</b><input class="cell-input wide" data-k="tree"><b>Fullt koblet</b><input class="cell-input wide" data-k="full"><b>Tilfeldig graf (forventet)</b><input class="cell-input wide" data-k="rnd"></div>`;
    const want = { tree, full, rnd };
    controls(body, () => trainerFlood(el), () => {
      let ok = 0; body.querySelectorAll('[data-k]').forEach(inp => { if (mark(inp, close(parseNum(inp.value), want[inp.dataset.k]))) ok++; });
      return `${ok} av 3 riktige`;
    }, () => solBox(body, `Tre: ${N} − 1 = <b>${tree}</b>. Fullt koblet: ${N}·${N - 1}/2 = <b>${full}</b>. Tilfeldig: ${p} · ${full} = <b>${fmt(rnd)}</b>.`));
  }

  const TRAINERS = [
    ['dht', 'Chord DHT', trainerDHT], ['vc', 'Vektorklokker', trainerVC], ['ip', 'IP & CIDR', trainerIP],
    ['delay', 'Forsinkelse', trainerDelay], ['dv', 'Distance-vector', trainerDV], ['overlay', 'Overlay/RDP', trainerOverlay],
    ['frag', 'Fragmentering', trainerFrag], ['checksum', 'Sjekksum', trainerChecksum], ['rsa', 'RSA', trainerRSA], ['flood', 'Flooding', trainerFlood]
  ];

  function show(id) {
    const t = TRAINERS.find(x => x[0] === id) || TRAINERS[0];
    document.querySelectorAll('.trainer-tabs button').forEach(b => b.classList.toggle('active', b.dataset.id === t[0]));
    t[2](document.getElementById('trOut'));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.getElementById('trTabs');
    tabs.innerHTML = TRAINERS.map(t => `<button data-id="${t[0]}">${t[1]}</button>`).join('');
    tabs.querySelectorAll('button').forEach(b => b.onclick = () => { history.replaceState(null, '', '#' + b.dataset.id); show(b.dataset.id); });
    show(location.hash.replace('#', ''));
    window.addEventListener('hashchange', () => show(location.hash.replace('#', '')));
  });
})();
