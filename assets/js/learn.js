/* Læringsløp: modulvisning med sidemeny, fremdrift og mini-quizer */
(function () {
  'use strict';
  const D = window.DAT110;

  function doneMap() { return D.store.get('done', {}); }
  function setDone(id, val) {
    const m = doneMap();
    if (val) m[id] = true; else delete m[id];
    D.store.set('done', m);
  }
  function moduleProgress(mod) {
    const dm = doneMap();
    const done = mod.sections.filter(s => dm[s.id]).length;
    return { done, total: mod.sections.length };
  }

  function renderSidebar(activeId) {
    const side = document.getElementById('sidebar');
    const mods = D.orderedModules();
    let html = '';
    let lastPart = null;
    let totalDone = 0, total = 0;
    mods.forEach((m, i) => {
      const t = D.TOPICS.find(x => x.key === m.id);
      if (t.part !== lastPart) {
        html += `<h4>${D.PARTS[t.part]}</h4>`;
        lastPart = t.part;
      }
      const p = moduleProgress(m);
      totalDone += p.done; total += p.total;
      const full = p.done === p.total;
      html += `<a class="side-link ${m.id === activeId ? 'active' : ''} ${full ? 'done' : ''}" href="#${m.id}">
        <span class="num">${full ? '✓' : i + 1}</span><span>${t.short}</span><span class="mini-progress">${p.done}/${p.total}</span></a>`;
    });
    const pct = total ? Math.round(100 * totalDone / total) : 0;
    side.innerHTML = `<div class="small muted">Total fremdrift</div>
      <div class="flex"><div class="progress green"><span style="width:${pct}%"></span></div><strong class="small">${pct}%</strong></div>${html}`;
  }

  function renderModule(id, sectionId) {
    const mods = D.orderedModules();
    const idx = Math.max(0, mods.findIndex(m => m.id === id));
    const mod = mods[idx];
    const t = D.TOPICS.find(x => x.key === mod.id);
    const main = document.getElementById('main');
    const dm = doneMap();
    main.innerHTML = '';

    const head = D.el('div', { class: 'module-head' });
    head.innerHTML = `
      <div class="kicker">${D.PARTS[t.part]} · Modul ${idx + 1} av ${mods.length}</div>
      <h1>${mod.title}</h1>
      <div class="small muted">📚 ${mod.source}</div>
      <div class="callout exam" style="margin-top:10px"><span class="ct">På eksamen</span>${mod.exam}</div>
      <div class="card" style="margin:10px 0"><strong>Etter denne modulen skal du kunne:</strong><ul class="goals">${mod.goals.map(g => `<li>${g}</li>`).join('')}</ul></div>
      <div class="toc-inline">${mod.sections.map((s, i) => `<a href="#${mod.id}/${s.id}" class="${dm[s.id] ? 'done' : ''}">${i + 1}. ${s.title}</a>`).join('')}</div>`;
    main.appendChild(head);

    mod.sections.forEach((s, i) => {
      const block = D.el('section', { class: 'section-block', id: s.id });
      const h2 = D.el('h2');
      h2.innerHTML = `<span class="sec-num">${idx + 1}.${i + 1}</span><span>${s.title}</span>`;
      const lbl = D.el('label', { class: 'done-toggle' });
      lbl.innerHTML = `<input type="checkbox" ${dm[s.id] ? 'checked' : ''}> Ferdig`;
      lbl.querySelector('input').addEventListener('change', ev => {
        setDone(s.id, ev.target.checked);
        renderSidebar(mod.id);
        const link = main.querySelector(`.toc-inline a[href="#${mod.id}/${s.id}"]`);
        if (link) link.classList.toggle('done', ev.target.checked);
      });
      h2.appendChild(lbl);
      block.appendChild(h2);
      const body = D.el('div', null, s.html);
      block.appendChild(body);
      if (s.quiz && s.quiz.length) D.renderMiniQuiz(block, s.quiz);
      main.appendChild(block);
      main.appendChild(D.el('hr'));
    });

    const sum = D.el('div', { class: 'card' });
    sum.innerHTML = `<h2>📝 Huskeliste for modulen</h2><ul>${mod.summary.map(x => `<li>${x}</li>`).join('')}</ul>
      <div class="btn-row"><a class="btn secondary" href="teori.html#${mod.id}">Se teoriark, formler og svarmaler →</a>
      <a class="btn ghost" href="quiz.html#${mod.id}">Ta hele quizen for temaet →</a></div>`;
    main.appendChild(sum);

    const prev = mods[idx - 1], next = mods[idx + 1];
    const pager = D.el('div', { class: 'pager' });
    pager.innerHTML = `${prev ? `<a class="btn ghost" href="#${prev.id}">← ${D.topicShort(prev.id)}</a>` : '<span></span>'}
      ${next ? `<a class="btn" href="#${next.id}">${D.topicShort(next.id)} →</a>` : '<a class="btn good" href="eksamen.html">Videre til eksamenstrening →</a>'}`;
    main.appendChild(pager);

    if (D.fig) D.fig.hydrate(main);
    renderSidebar(mod.id);
    D.store.set('lastModule', mod.id);
    document.title = mod.title + ' – DAT110';
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'auto' }), 30);
    } else {
      window.scrollTo(0, 0);
    }
  }

  function route() {
    const h = decodeURIComponent(location.hash.replace(/^#/, ''));
    const [mid, sid] = h.split('/');
    const first = D.orderedModules()[0];
    renderModule(mid && D.getModule(mid) ? mid : (D.store.get('lastModule', null) || first.id), sid);
  }

  document.addEventListener('DOMContentLoaded', () => {
    route();
    window.addEventListener('hashchange', route);
  });
})();
