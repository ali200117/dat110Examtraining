/* DAT110 Eksamenstrening – felles kjerne (navigasjon, tema, lagring, quiz-motor) */
(function () {
  'use strict';

  const D = window.DAT110 = window.DAT110 || {};
  D.modules = D.modules || [];
  D.quizbank = D.quizbank || [];
  D.glossary = D.glossary || [];
  D.exams = D.exams || [];

  D.EXAM_DATE = new Date('2027-01-07T09:00:00');

  // Temaene i faget, i rekkefølgen de gjennomgås i læringsløpet
  D.TOPICS = [
    { key: 'intro', name: 'Internett, forsinkelse og gjennomstrømning', part: 'A', short: 'Internett & forsinkelse' },
    { key: 'layers', name: 'Protokollag og innkapsling', part: 'A', short: 'Protokollag' },
    { key: 'ds-intro', name: 'Distribuerte systemer – introduksjon og sky', part: 'A', short: 'DS-intro & sky' },
    { key: 'app', name: 'Applikasjonslaget: HTTP, DNS og sockets', part: 'B', short: 'HTTP, DNS, sockets' },
    { key: 'proc', name: 'Prosesser, tråder, klienter og servere', part: 'B', short: 'Tråder & servere' },
    { key: 'rpc', name: 'Remote Procedure Call (RPC)', part: 'B', short: 'RPC' },
    { key: 'mom', name: 'Meldingsorientert kommunikasjon og publish-subscribe', part: 'B', short: 'MOM & pub-sub' },
    { key: 'mcast', name: 'Multicast, overlay-nettverk og gossip', part: 'B', short: 'Multicast & overlay' },
    { key: 'transport', name: 'Transportlaget: UDP, pålitelig overføring og TCP', part: 'C', short: 'Transport (UDP/TCP)' },
    { key: 'network', name: 'Nettverkslaget: IP, adressering og forwarding', part: 'D', short: 'IP & forwarding' },
    { key: 'routing', name: 'Routing: link-state, distance-vector, OSPF, BGP, ICMP', part: 'D', short: 'Routing' },
    { key: 'link', name: 'Linklaget: feildeteksjon, MAC, ARP, Ethernet og svitsjer', part: 'E', short: 'Linklaget' },
    { key: 'naming', name: 'Navngiving, DNS-oppslag og Chord DHT', part: 'F', short: 'Navngiving & DHT' },
    { key: 'clocks', name: 'Klokkesynkronisering og logiske klokker', part: 'F', short: 'Klokker' },
    { key: 'mutex', name: 'Gjensidig utelukkelse og valgalgoritmer', part: 'F', short: 'Mutex & valg' },
    { key: 'consistency', name: 'Konsistens og replikering', part: 'G', short: 'Konsistens' },
    { key: 'fault', name: 'Feiltoleranse og pålitelig kommunikasjon', part: 'G', short: 'Feiltoleranse' },
    { key: 'security', name: 'Sikkerhet og kryptografi', part: 'H', short: 'Sikkerhet' },
    { key: 'projects', name: 'Obligatoriske prosjekter 1–3', part: 'I', short: 'Prosjekter' }
  ];
  D.PARTS = {
    A: 'Del A – Grunnlag', B: 'Del B – Applikasjon og kommunikasjon', C: 'Del C – Transportlaget',
    D: 'Del D – Nettverkslaget', E: 'Del E – Linklaget', F: 'Del F – Navngiving og koordinering',
    G: 'Del G – Konsistens og feiltoleranse', H: 'Del H – Sikkerhet', I: 'Del I – Prosjektene'
  };
  D.topicName = function (key) {
    const t = D.TOPICS.find(x => x.key === key);
    return t ? t.name : key;
  };
  D.topicShort = function (key) {
    const t = D.TOPICS.find(x => x.key === key);
    return t ? t.short : key;
  };

  D.addModule = function (m) {
    D.modules.push(m);
    if (m.sections) {
      m.sections.forEach(s => (s.quiz || []).forEach((q, i) => {
        q.id = q.id || (s.id + '-q' + (i + 1));
        q.t = q.t || m.id;
        q.src = q.src || ('Læringsløp: ' + m.title);
      }));
    }
  };
  D.addQuestions = function (topic, list) {
    list.forEach((q, i) => {
      q.t = q.t || topic;
      q.id = q.id || ('qb-' + topic + '-' + (i + 1));
      D.quizbank.push(q);
    });
  };
  D.getModule = id => D.modules.find(m => m.id === id);
  D.orderedModules = function () {
    return D.TOPICS.map(t => D.getModule(t.key)).filter(Boolean);
  };

  /* ---------------- Lagring ---------------- */
  const PREFIX = 'dat110.';
  D.store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(PREFIX + key);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch (e) { /* privat modus */ }
    },
    remove(key) {
      try { localStorage.removeItem(PREFIX + key); } catch (e) { /* ignorer */ }
    },
    clearAll() {
      try {
        Object.keys(localStorage).filter(k => k.startsWith(PREFIX)).forEach(k => localStorage.removeItem(k));
      } catch (e) { /* ignorer */ }
    }
  };

  // Statistikk per spørsmål: { id: {c: riktige, w: feil, last: 1|0, t: tema} }
  D.recordAnswer = function (q, correct) {
    const stats = D.store.get('qstats', {});
    const s = stats[q.id] || { c: 0, w: 0, last: 0, t: q.t };
    if (correct) s.c++; else s.w++;
    s.last = correct ? 1 : 0;
    s.t = q.t;
    stats[q.id] = s;
    D.store.set('qstats', stats);
  };
  D.topicStats = function () {
    const stats = D.store.get('qstats', {});
    const out = {};
    Object.values(stats).forEach(s => {
      const o = out[s.t] || (out[s.t] = { answered: 0, correctLast: 0 });
      o.answered++;
      if (s.last) o.correctLast++;
    });
    return out;
  };

  /* ---------------- Hjelpere ---------------- */
  D.el = function (tag, attrs, html) {
    const e = document.createElement(tag);
    if (attrs) Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') e.className = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    });
    if (html !== undefined) e.innerHTML = html;
    return e;
  };
  D.esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  D.shuffle = function (arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  D.rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  D.pick = arr => arr[Math.floor(Math.random() * arr.length)];
  D.daysToExam = function () {
    const now = new Date();
    return Math.ceil((D.EXAM_DATE - now) / 86400000);
  };

  /* ---------------- Tema (lys/mørk) ---------------- */
  D.applyTheme = function () {
    const t = D.store.get('theme', null);
    if (t) document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.removeAttribute('data-theme');
  };
  D.toggleTheme = function () {
    const cur = document.documentElement.getAttribute('data-theme');
    const sysDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = cur ? cur === 'dark' : sysDark;
    D.store.set('theme', isDark ? 'light' : 'dark');
    D.applyTheme();
  };
  D.applyTheme();

  /* ---------------- Navigasjon ---------------- */
  D.PAGES = [
    { href: 'index.html', label: 'Hjem', id: 'home' },
    { href: 'laer.html', label: 'Læringsløp', id: 'learn' },
    { href: 'teori.html', label: 'Teori', id: 'theory' },
    { href: 'quiz.html', label: 'Quiz', id: 'quiz' },
    { href: 'eksamen.html', label: 'Eksamen', id: 'exam' },
    { href: 'trening.html', label: 'Regnetrening', id: 'trainer' },
    { href: 'begreper.html', label: 'Begreper', id: 'glossary' }
  ];
  D.renderHeader = function (active) {
    const header = D.el('header', { class: 'topbar' });
    const days = D.daysToExam();
    const links = D.PAGES.map(p => `<a href="${p.href}" class="${p.id === active ? 'active' : ''}">${p.label}</a>`).join('');
    header.innerHTML = `
      <div class="topbar-inner">
        <a class="brand" href="index.html"><span class="brand-logo">110</span><span>DAT110</span></a>
        <nav class="nav" id="mainNav">${links}</nav>
        <div class="top-actions">
          <span class="countdown-pill" title="Eksamen 7. januar 2027">${days > 0 ? days + ' dager til eksamen' : 'Eksamensdag!'}</span>
          <button class="icon-btn" id="themeBtn" title="Bytt lys/mørk modus" aria-label="Bytt tema">◐</button>
          <button class="icon-btn menu-btn" id="menuBtn" aria-label="Meny">☰</button>
        </div>
      </div>`;
    document.body.prepend(header);
    header.querySelector('#themeBtn').addEventListener('click', D.toggleTheme);
    header.querySelector('#menuBtn').addEventListener('click', () => header.querySelector('#mainNav').classList.toggle('open'));
    const footer = D.el('footer', { class: 'footer' },
      'DAT110 – Distribuerte systemer og nettverksteknologi · Eksamenstrening laget for eksamen 7. januar 2027 · Fremdrift lagres lokalt i nettleseren');
    document.body.appendChild(footer);
  };

  /* ---------------- Quiz-motor ---------------- */
  // Spørsmålsformat: { id, t, q, o: [...], a: [riktige indekser], e: forklaring, src }
  D.Quiz = {
    isMulti: q => (q.m === true) || (q.a && q.a.length > 1),

    render(container, questions, opts) {
      opts = Object.assign({ shuffleOptions: false, showSource: true, showTopic: false, title: null, compact: false }, opts || {});
      container.innerHTML = '';
      container.classList.add('quiz');
      const state = { answered: 0, correct: 0, total: questions.length, items: [] };

      const bar = D.el('div', { class: 'scorebar' });
      const updateBar = () => {
        const pct = state.total ? Math.round(100 * state.answered / state.total) : 0;
        bar.innerHTML = `
          <strong>${state.correct} / ${state.answered}</strong><span class="muted small">riktige av besvarte · ${state.total} spørsmål</span>
          <div class="progress"><span style="width:${pct}%"></span></div>
          <button class="btn small ghost" data-act="checkall">Sjekk alle</button>
          <button class="btn small secondary" data-act="reset">↺ Nullstill</button>`;
        bar.querySelector('[data-act=reset]').onclick = () => D.Quiz.render(container, opts.reshuffle ? opts.reshuffle() : questions, opts);
        bar.querySelector('[data-act=checkall]').onclick = () => state.items.forEach(it => { if (!it.locked) it.check(true); });
        if (opts.onUpdate) opts.onUpdate(state);
      };
      if (!opts.compact) container.appendChild(bar);

      questions.forEach((q, qi) => {
        const multi = D.Quiz.isMulti(q);
        const order = opts.shuffleOptions ? D.shuffle(q.o.map((_, i) => i)) : q.o.map((_, i) => i);
        const box = D.el('div', { class: 'q' });
        const meta = [];
        if (opts.showTopic) meta.push(D.topicShort(q.t));
        if (opts.showSource && q.src) meta.push(q.src);
        box.innerHTML = `
          <div class="q-head"><div class="q-num">${qi + 1}</div>
            <div><div class="q-text">${q.q}</div>${meta.length ? `<div class="q-meta">${D.esc(meta.join(' · '))}</div>` : ''}</div>
          </div>
          ${multi ? '<div class="q-hint">Flere svar kan være riktige – velg alle som stemmer.</div>' : ''}
          <ul class="opts"></ul>
          <div class="q-actions"><button class="btn small" data-act="check">Sjekk svar</button></div>
          <div class="q-feedback"></div>`;
        const ul = box.querySelector('.opts');
        const name = 'q_' + Math.random().toString(36).slice(2);
        order.forEach(oi => {
          const li = D.el('li', { class: 'opt' });
          li.dataset.idx = oi;
          li.innerHTML = `<input type="${multi ? 'checkbox' : 'radio'}" name="${name}"><span>${q.o[oi]}</span>`;
          li.addEventListener('click', ev => {
            if (item.locked) return;
            const inp = li.querySelector('input');
            if (ev.target !== inp) inp.checked = multi ? !inp.checked : true;
            ul.querySelectorAll('.opt').forEach(o => o.classList.toggle('sel', o.querySelector('input').checked));
          });
          ul.appendChild(li);
        });

        const fb = box.querySelector('.q-feedback');
        const item = {
          locked: false,
          check(silentIfEmpty) {
            const chosen = [...ul.querySelectorAll('.opt')].filter(o => o.querySelector('input').checked).map(o => +o.dataset.idx);
            if (!chosen.length) {
              if (!silentIfEmpty) { fb.className = 'q-feedback show part'; fb.innerHTML = 'Velg minst ett alternativ først.'; }
              if (silentIfEmpty !== true) return;
            }
            item.locked = true;
            box.classList.add('locked');
            ul.querySelectorAll('input').forEach(i => i.disabled = true);
            const correctSet = new Set(q.a);
            let hits = 0, wrongs = 0;
            ul.querySelectorAll('.opt').forEach(o => {
              const idx = +o.dataset.idx;
              const picked = chosen.includes(idx);
              o.classList.remove('sel');
              if (correctSet.has(idx) && picked) { o.classList.add('correct'); hits++; }
              else if (correctSet.has(idx)) o.classList.add('missed');
              else if (picked) { o.classList.add('wrong'); wrongs++; }
            });
            const allRight = hits === correctSet.size && wrongs === 0;
            const partial = !allRight && hits > 0;
            fb.className = 'q-feedback show ' + (allRight ? 'ok' : partial ? 'part' : 'no');
            const head = allRight ? '✔ Riktig!' : partial ? '◐ Delvis riktig.' : (chosen.length ? '✘ Ikke riktig.' : '– Ikke besvart.');
            const corr = q.a.map(i => q.o[i]).join(' · ');
            fb.innerHTML = `<strong>${head}</strong>${allRight ? '' : ` Riktig svar: <em>${corr}</em>`}${q.e ? `<div style="margin-top:6px">${q.e}</div>` : ''}`;
            box.querySelector('[data-act=check]').disabled = true;
            state.answered++;
            if (allRight) state.correct++;
            if (chosen.length) D.recordAnswer(q, allRight);
            updateBar();
          }
        };
        box.querySelector('[data-act=check]').onclick = () => item.check(false);
        state.items.push(item);
        container.appendChild(box);
      });
      updateBar();
      return state;
    }
  };

  /* ---------------- Små render-hjelpere for innhold ---------------- */
  D.renderMiniQuiz = function (container, questions, title) {
    const wrap = D.el('div', { class: 'mini-quiz' });
    wrap.innerHTML = `<h4>🧠 ${title || 'Mini-quiz – sjekk at du forstod'}</h4><p class="small muted mt0">Svar før du går videre. Spørsmålene er formulert annerledes enn i teksten – målet er forståelse, ikke pugging.</p>`;
    const qbox = D.el('div');
    wrap.appendChild(qbox);
    container.appendChild(wrap);
    D.Quiz.render(qbox, questions, { showSource: false });
  };

  document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    if (page) D.renderHeader(page);
  });
})();
