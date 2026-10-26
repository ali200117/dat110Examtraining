/* Figurer som tegnes fra data: Chord-ring, vektede grafer og hendelsestidslinjer */
(function () {
  'use strict';
  const D = window.DAT110;
  const F = D.fig = {};
  let uid = 0;

  // Chord-ring. opts: { keys: [..], fingersOf: nodeId, path: [n1, n2, ...], size }
  F.chordRing = function (nodes, m, opts) {
    opts = opts || {};
    const N = Math.pow(2, m);
    const size = opts.size || 420;
    const cx = size / 2, cy = size / 2, r = size / 2 - 48;
    const id = 'cr' + (++uid);
    const pos = k => {
      const a = (k / N) * 2 * Math.PI - Math.PI / 2;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    };
    const out = [`<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="max-width:${size}px">`];
    out.push(`<defs><marker id="${id}a" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="aha"/></marker>
      <marker id="${id}b" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" style="fill:var(--svg-bad)"/></marker></defs>`);
    out.push(`<circle cx="${cx}" cy="${cy}" r="${r}" class="ln"/>`);
    const showAll = N <= 64;
    for (let k = 0; k < N; k++) {
      const [x, y] = pos(k);
      const isNode = nodes.includes(k);
      if (!isNode && showAll) {
        out.push(`<circle cx="${x}" cy="${y}" r="2.5" class="dot" opacity=".45"/>`);
        const [lx, ly] = [cx + (r + 16) * Math.cos((k / N) * 2 * Math.PI - Math.PI / 2), cy + (r + 16) * Math.sin((k / N) * 2 * Math.PI - Math.PI / 2)];
        out.push(`<text x="${lx}" y="${ly + 3}" text-anchor="middle" class="txmu" style="font-size:9px">${k}</text>`);
      }
    }
    (opts.keys || []).forEach(k => {
      const [x, y] = pos(k);
      out.push(`<rect x="${x - 6}" y="${y - 6}" width="12" height="12" rx="2" class="bxw"/>`);
      const a = (k / N) * 2 * Math.PI - Math.PI / 2;
      out.push(`<text x="${cx + (r - 22) * Math.cos(a)}" y="${cy + (r - 22) * Math.sin(a) + 4}" text-anchor="middle" class="txb" style="font-size:10px">k${k}</text>`);
    });
    if (opts.fingersOf !== undefined && opts.fingers) {
      const [x1, y1] = pos(opts.fingersOf);
      opts.fingers.forEach(f => {
        if (f === opts.fingersOf) return;
        const [x2, y2] = pos(f);
        out.push(`<path d="M${x1},${y1} Q${cx},${cy} ${x2},${y2}" class="lnd" marker-end="url(#${id}a)"/>`);
      });
    }
    if (opts.path && opts.path.length > 1) {
      for (let i = 0; i < opts.path.length - 1; i++) {
        const [x1, y1] = pos(opts.path[i]);
        const [x2, y2] = pos(opts.path[i + 1]);
        const mx = (x1 + x2) / 2 + (cx - (x1 + x2) / 2) * 0.35, my = (y1 + y2) / 2 + (cy - (y1 + y2) / 2) * 0.35;
        out.push(`<path d="M${x1},${y1} Q${mx},${my} ${x2},${y2}" class="lnb" marker-end="url(#${id}b)"/>`);
      }
    }
    nodes.forEach(k => {
      const [x, y] = pos(k);
      out.push(`<circle cx="${x}" cy="${y}" r="15" class="bx2"/><text x="${x}" y="${y + 4}" text-anchor="middle" class="tx" style="font-size:12px;font-weight:700">${k}</text>`);
    });
    out.push(`<text x="${cx}" y="${cy + 4}" text-anchor="middle" class="txmu">m = ${m} (0–${N - 1})</text>`);
    out.push('</svg>');
    return out.join('');
  };

  // Vektet graf. nodes: [{id, x, y, label, cls}], edges: [{a, b, w, cls}]
  F.graph = function (nodes, edges, opts) {
    opts = opts || {};
    const w = opts.width || 460, h = opts.height || 220;
    const byId = {};
    nodes.forEach(n => byId[n.id] = n);
    const out = [`<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="max-width:${w}px">`];
    edges.forEach(e => {
      const a = byId[e.a], b = byId[e.b];
      out.push(`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="${e.cls || 'ln'}"/>`);
      if (e.w !== undefined && e.w !== null) {
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        out.push(`<rect x="${mx - 13}" y="${my - 10}" width="26" height="18" rx="5" style="fill:var(--card)"/><text x="${mx}" y="${my + 4}" text-anchor="middle" class="txb">${e.w}</text>`);
      }
    });
    nodes.forEach(n => {
      if (n.shape === 'rect') {
        out.push(`<rect x="${n.x - 17}" y="${n.y - 14}" width="34" height="28" rx="6" class="${n.cls || 'bxg'}"/><text x="${n.x}" y="${n.y + 5}" text-anchor="middle" class="tx" style="font-weight:700">${n.label || n.id}</text>`);
      } else {
        out.push(`<circle cx="${n.x}" cy="${n.y}" r="${n.r || 20}" class="${n.cls || 'bx2'}"/><text x="${n.x}" y="${n.y + 5}" text-anchor="middle" class="tx" style="font-size:12px;font-weight:700">${n.label || n.id}</text>`);
      }
    });
    out.push('</svg>');
    return out.join('');
  };

  // Tidslinje for hendelser. procs: ['P1',...], rows: [[navn,...],...] (kolonneposisjon = indeks), msgs: [{from:[p,i], to:[p,j]}]
  F.timeline = function (procs, rows, msgs, opts) {
    opts = opts || {};
    const cols = Math.max(...rows.map(r => r.length));
    const colW = opts.colW || 90, rowH = 56, left = 50, top = 26;
    const w = left + cols * colW + 30, h = top + procs.length * rowH;
    const id = 'tl' + (++uid);
    const pt = (p, i) => [left + 30 + i * colW, top + p * rowH];
    const out = [`<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="max-width:${w}px">`];
    out.push(`<defs><marker id="${id}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="aha"/></marker></defs>`);
    procs.forEach((p, i) => {
      const y = top + i * rowH;
      out.push(`<text x="8" y="${y + 4}" class="tx" style="font-weight:700">${p}</text>`);
      out.push(`<line x1="${left}" y1="${y}" x2="${w - 10}" y2="${y}" class="ln"/>`);
    });
    (msgs || []).forEach(mm => {
      const [x1, y1] = pt(mm.from[0], mm.from[1]);
      const [x2, y2] = pt(mm.to[0], mm.to[1]);
      const dy = y2 > y1 ? -8 : 8;
      out.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2 + dy}" class="lna" marker-end="url(#${id})"/>`);
    });
    rows.forEach((r, p) => r.forEach((ev, i) => {
      if (!ev) return;
      const [x, y] = pt(p, i);
      out.push(`<circle cx="${x}" cy="${y}" r="5" class="dot"/>`);
      out.push(`<text x="${x}" y="${y - 10}" text-anchor="middle" class="tx" style="font-size:12px">${ev}</text>`);
      if (opts.labels && opts.labels[p] && opts.labels[p][i]) {
        out.push(`<text x="${x}" y="${y + 20}" text-anchor="middle" class="txm" style="font-size:10px">${opts.labels[p][i]}</text>`);
      }
    }));
    out.push('</svg>');
    return out.join('');
  };

  // Tegn alle figurer som er beskrevet med data-attributter inne i et element
  F.hydrate = function (root) {
    root.querySelectorAll('[data-chord]').forEach(el => {
      const nodes = el.dataset.chord.split(',').map(Number);
      const m = +el.dataset.m;
      const keys = el.dataset.keys ? el.dataset.keys.split(',').map(Number) : [];
      el.innerHTML = F.chordRing(nodes, m, { keys });
    });
  };
})();
