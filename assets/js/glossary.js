/* Begreper: søkbar liste, flashcards og «hvilket begrep er dette?»-test */
(function () {
  'use strict';
  const D = window.DAT110;
  let mode = 'list';

  function filtered() {
    const q = (document.getElementById('glSearch').value || '').toLowerCase().trim();
    const t = document.getElementById('glTopic').value;
    return D.glossary.filter(g =>
      (!t || g.t === t) &&
      (!q || (g.term + ' ' + g.en + ' ' + g.def + ' ' + g.ex).toLowerCase().includes(q)));
  }

  function renderList() {
    const items = filtered().slice().sort((a, b) => a.term.localeCompare(b.term, 'no'));
    const out = document.getElementById('glOut');
    document.getElementById('glCount').textContent = items.length + ' begreper';
    if (!items.length) { out.innerHTML = '<p class="muted">Ingen treff.</p>'; return; }
    out.innerHTML = '<div class="grid grid-2">' + items.map(g => `
      <div class="gl-item">
        <div class="flex"><span class="gl-term">${g.term}</span><span class="tag">${D.topicShort(g.t)}</span></div>
        <div class="gl-en">${g.en}</div>
        <p class="gl-def">${g.def}</p>
        ${g.ex ? `<div class="gl-ex">💡 ${g.ex}</div>` : ''}
      </div>`).join('') + '</div>';
  }

  // Flashcards
  let deck = [], pos = 0;
  function startCards() {
    const known = D.store.get('glKnown', {});
    const onlyUnknown = document.getElementById('glOnlyUnknown').checked;
    deck = D.shuffle(filtered().filter(g => !onlyUnknown || !known[g.term]));
    pos = 0;
    renderCard();
  }
  function renderCard() {
    const out = document.getElementById('glOut');
    document.getElementById('glCount').textContent = deck.length ? `Kort ${pos + 1} av ${deck.length}` : '';
    if (!deck.length) { out.innerHTML = '<div class="card center"><h3>🎉 Ingen kort igjen</h3><p class="muted">Alle begrepene i utvalget er markert som «kan». Fjern haken for bare ukjente, eller velg et annet tema.</p></div>'; return; }
    const g = deck[pos];
    const enFirst = document.getElementById('glEnFirst').checked;
    out.innerHTML = `
      <div class="flashcard" id="fc"><div class="flashcard-inner">
        <div class="flashcard-face"><div class="small muted">${D.topicShort(g.t)}</div><div class="big">${enFirst ? g.en : g.term}</div><div class="small muted" style="margin-top:12px">Klikk for å snu</div></div>
        <div class="flashcard-face back"><div style="font-weight:800;margin-bottom:6px">${g.term} <span class="muted small">(${g.en})</span></div><div>${g.def}</div>${g.ex ? `<div class="gl-ex" style="margin-top:10px">💡 ${g.ex}</div>` : ''}</div>
      </div></div>
      <div class="btn-row" style="justify-content:center">
        <button class="btn bad" id="fcNo">✘ Kunne ikke</button>
        <button class="btn good" id="fcYes">✔ Kunne</button>
      </div>`;
    document.getElementById('fc').onclick = e => e.currentTarget.classList.toggle('flipped');
    const next = knew => {
      const known = D.store.get('glKnown', {});
      if (knew) known[g.term] = true; else delete known[g.term];
      D.store.set('glKnown', known);
      if (!knew) deck.push(g);
      pos++;
      if (pos >= deck.length) { deck = []; }
      renderCard();
    };
    document.getElementById('fcYes').onclick = () => next(true);
    document.getElementById('fcNo').onclick = () => next(false);
  }

  // Test: vis definisjon, velg riktig begrep
  function startTest() {
    const pool = filtered();
    const out = document.getElementById('glOut');
    if (pool.length < 4) { out.innerHTML = '<p class="muted">Velg et utvalg med minst 4 begreper.</p>'; return; }
    const qs = D.shuffle(pool).slice(0, Math.min(15, pool.length)).map((g, i) => {
      const sameTopic = D.glossary.filter(x => x.t === g.t && x.term !== g.term);
      const others = D.shuffle(sameTopic.length >= 3 ? sameTopic : D.glossary.filter(x => x.term !== g.term)).slice(0, 3);
      const opts = D.shuffle([g, ...others]);
      return { id: 'gl-' + g.term, t: g.t, q: `Hvilket begrep passer til: <em>«${g.def}»</em>`, o: opts.map(x => x.term), a: [opts.indexOf(g)], e: `${g.term} (${g.en}). ${g.ex || ''}`, src: 'Begrepstest' };
    });
    document.getElementById('glCount').textContent = qs.length + ' spørsmål';
    D.Quiz.render(out, qs, { showSource: false, showTopic: true, reshuffle: null });
  }

  function render() {
    document.querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    document.getElementById('cardOpts').classList.toggle('hidden', mode !== 'cards');
    if (mode === 'list') renderList();
    else if (mode === 'cards') startCards();
    else startTest();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const sel = document.getElementById('glTopic');
    sel.innerHTML = '<option value="">Alle temaer</option>' + D.TOPICS.map(t => `<option value="${t.key}">${t.short}</option>`).join('');
    const hash = location.hash.replace('#', '');
    if (D.TOPICS.some(t => t.key === hash)) sel.value = hash;
    document.getElementById('glSearch').addEventListener('input', () => { if (mode === 'list') renderList(); });
    sel.addEventListener('change', render);
    document.getElementById('glOnlyUnknown').addEventListener('change', render);
    document.getElementById('glEnFirst').addEventListener('change', () => renderCard());
    document.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => { mode = b.dataset.mode; render(); }));
    document.getElementById('glReset').addEventListener('click', () => { D.store.remove('glKnown'); render(); });
    render();
  });
})();
