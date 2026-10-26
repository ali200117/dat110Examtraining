/* Quiz-siden: filtrer spørsmålsbanken og ta quizer med nullstilling */
(function () {
  'use strict';
  const D = window.DAT110;

  function allQuestions() {
    const fromModules = [];
    D.modules.forEach(m => m.sections.forEach(s => (s.quiz || []).forEach(q => fromModules.push(q))));
    return D.quizbank.concat(fromModules);
  }

  function sourceOf(q) {
    if (q.exam) return 'exam';
    if ((q.src || '').startsWith('Canvas')) return 'canvas';
    if ((q.src || '').startsWith('Læringsløp')) return 'learn';
    return 'extra';
  }

  function selection() {
    const topic = document.getElementById('qTopic').value;
    const src = document.getElementById('qSrc').value;
    const wrongOnly = document.getElementById('qWrong').checked;
    const stats = D.store.get('qstats', {});
    return allQuestions().filter(q =>
      (!topic || q.t === topic) &&
      (!src || sourceOf(q) === src) &&
      (!wrongOnly || (stats[q.id] && stats[q.id].last === 0)));
  }

  function buildSet() {
    const pool = selection();
    const count = document.getElementById('qCount').value;
    const shuffleQ = document.getElementById('qShuffle').checked;
    let set = shuffleQ ? D.shuffle(pool) : pool.slice();
    if (count !== 'all') set = set.slice(0, +count);
    return set;
  }

  function updatePoolInfo() {
    const n = selection().length;
    document.getElementById('qPool').textContent = `${n} spørsmål i utvalget (${allQuestions().length} totalt i banken)`;
  }

  function start() {
    const set = buildSet();
    const out = document.getElementById('quizOut');
    if (!set.length) {
      out.innerHTML = '<div class="card"><p>Ingen spørsmål i utvalget. Har du huket av «bare de jeg bommet på» uten å ha bommet på noe ennå? 🙂</p></div>';
      return;
    }
    D.Quiz.render(out, set, {
      shuffleOptions: document.getElementById('qShuffleOpts').checked,
      showSource: true,
      showTopic: !document.getElementById('qTopic').value,
      reshuffle: buildSet,
      onUpdate: renderStats
    });
    out.scrollIntoView({ behavior: 'smooth' });
  }

  function renderStats() {
    const ts = D.topicStats();
    const box = document.getElementById('qStats');
    const rows = D.TOPICS.map(t => {
      const s = ts[t.key];
      if (!s) return `<div class="topic-meter"><span class="name">${t.short}</span><div class="progress"><span style="width:0"></span></div><span class="small muted">–</span></div>`;
      const pct = Math.round(100 * s.correctLast / s.answered);
      return `<div class="topic-meter"><span class="name">${t.short}</span><div class="progress ${pct >= 75 ? 'green' : ''}"><span style="width:${pct}%"></span></div><span class="small nowrap">${pct}% <span class="muted">(${s.answered})</span></span></div>`;
    }).join('');
    box.innerHTML = rows;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const sel = document.getElementById('qTopic');
    sel.innerHTML = '<option value="">Alle temaer</option>' + D.TOPICS.map(t => `<option value="${t.key}">${t.name}</option>`).join('');
    const hash = location.hash.replace('#', '');
    if (D.TOPICS.some(t => t.key === hash)) sel.value = hash;
    if (hash === 'exam') document.getElementById('qSrc').value = 'exam';
    ['qTopic', 'qSrc', 'qWrong'].forEach(id => document.getElementById(id).addEventListener('change', updatePoolInfo));
    document.getElementById('qStart').addEventListener('click', start);
    document.getElementById('qResetStats').addEventListener('click', () => {
      if (confirm('Nullstille all quizstatistikk?')) { D.store.remove('qstats'); renderStats(); updatePoolInfo(); }
    });
    updatePoolInfo();
    renderStats();
    if (hash) start();
  });
})();
