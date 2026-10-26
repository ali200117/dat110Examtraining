/* Eksamenssiden: oversikt, eksamensvisning med svarfelt, løsningsforslag, selvvurdering og tidtaker */
(function () {
  'use strict';
  const D = window.DAT110;
  const val = v => (typeof v === 'function' ? v() : (v || ''));

  const PATTERN = [
    ['1', '10 %', 'Flervalg: a–e nettverk, f–j distribuerte systemer (fra Canvas-quizene). Flere svar kan være riktige.', 'Alle 6'],
    ['2', '10 %', 'Obligatorisk prosjekt: P1 RPC (jan 25), P2 pub-sub (jan 24), P3 ChordDHT (2023, mai 24, jun 25).', 'Alle 6'],
    ['3', '10 %', 'Forsinkelse (d_trans, d_prop, nodal, ende-til-ende), trafikkintensitet, flaskehals, gjennomstrømning, linkutnyttelse. (2022: IP-fragmentering)', 'Alle 6'],
    ['4', '10 %', 'Protokollformat: IPv4-header (2022, jan 25), HTTP-request (2023, jun 25), UDP-segment (jan 24), TCP/IP-lag + rdt-mekanismer (mai 24).', 'Alle 6'],
    ['5', '10 %', 'Distance-vector/Bellman-Ford (jan 24, mai 24, jan 25) eller ARP + hub/svitsj (2022, 2023, jun 25).', 'Alle 6'],
    ['6', '10 %', 'IP i binær, CIDR-intervall, longest prefix match, DHCP, ARP-query, svitsjetabell, innkapsling, routing vs forwarding, LS vs DV.', 'Alle 6'],
    ['7', '5 %', 'Kort DS-teori: RPC vs MOM, multithreading i servere, transparens, stateful/stateless, sync/async, asynkron RPC.', 'Alle 6'],
    ['8', '10 %', 'Overlay-multicast: fullt koblet graf, stretch/RDP for to/tre trær, tree cost.', 'Alle 6'],
    ['9', '10 %', 'Blandet DS: replikering/konsistens (kausal), RPC-feil (lost request/reply), vektorklokker, FIFO-ordning, grupper, asynkron RPC.', 'Alle 6'],
    ['10', '15 %', 'Chord DHT (m = 5): fingertabeller, ansvarlig server (pred &lt; k ≤ n), oppslag steg for steg, skalerbarhet/feiltoleranse.', 'Alle 6']
  ];

  function key(examId, t, l) { return `exam.${examId}.${t}.${l}`; }

  function examScore(exam) {
    let total = 0, got = 0, graded = 0;
    exam.tasks.forEach(task => {
      total += task.w;
      if (task.mcSrc || task.mc) {
        const r = D.store.get(key(exam.id, task.n, 'mc'), null);
        if (r) { got += task.w * r.correct / r.total; graded++; }
      } else {
        const grades = task.subs.map(s => D.store.get(key(exam.id, task.n, s.l) + '.g', null));
        const done = grades.filter(g => g !== null);
        if (done.length) {
          got += task.w * grades.reduce((a, g) => a + (g || 0), 0) / (2 * task.subs.length);
          graded++;
        }
      }
    });
    return { pct: total ? Math.round(100 * got / total) : 0, graded, tasks: exam.tasks.length };
  }

  function renderList() {
    const root = document.getElementById('examRoot');
    const card = e => {
      const s = examScore(e);
      return `<a class="card exam-list-item" href="#${e.id}" style="text-decoration:none;color:inherit">
        <div style="font-size:1.8rem">${e.kind === 'mock' ? '🧪' : '📄'}</div>
        <div style="flex:1"><strong>${e.title}</strong><div class="small muted">${e.kind === 'mock' ? 'Øvingseksamen – nye tall' : 'Ekte eksamen med sensorveiledning'}</div></div>
        <div class="right"><div class="stat" style="font-size:1.3rem">${s.graded ? s.pct + '%' : '–'}</div><div class="stat-label">${s.graded}/${s.tasks} oppgaver vurdert</div></div></a>`;
    };
    root.innerHTML = `
      <h1>📝 Eksamenstrening</h1>
      <p class="muted">Alle eksamenene fra 2022–2025 med sensorveiledningens løsningsforslag, pluss øvingseksamener i samme format. Skriv svarene dine i feltene, vis løsningsforslaget, og vurder deg selv (0 / ½ / 1). Flervalg rettes automatisk. Svarene lagres i nettleseren.</p>
      <div class="card"><h2 class="mt0">Eksamensmønsteret – det samme hvert år</h2>
        <p class="small muted">Eksamen har 10 oppgaver. Sensorveiledningen ber om «korte og konsise svar, som hovedregel 2–3 setninger per delspørsmål».</p>
        ${PATTERN.map(p => `<div class="pattern-row"><strong>Oppgave ${p[0]}</strong><span class="tag ${p[1] === '15 %' ? 'hot' : ''}">${p[1]}</span><span class="small">${p[2]}</span></div>`).join('')}
      </div>
      <h2>Ekte eksamener</h2><div class="grid grid-2">${D.exams.filter(e => e.kind === 'past').map(card).join('')}</div>
      <h2>Øvingseksamener</h2><div class="grid grid-2">${D.exams.filter(e => e.kind === 'mock').map(card).join('')}</div>
      <div class="callout tip"><span class="ct">Anbefalt rekkefølge</span>Ta eksamenene kronologisk fra 2022 til juni 2025 etter at du har gått gjennom læringsløpet. Ta øvingseksamen A og B på tid den siste uken. Bruk <a href="trening.html">Regnetrening</a> mellom eksamenene for Oppgave 3, 5, 6, 8, 9 og 10.</div>`;
    document.title = 'Eksamen – DAT110';
  }

  let timerHandle = null;
  function renderExam(exam) {
    const root = document.getElementById('examRoot');
    const examMode = D.store.get('examMode.' + exam.id, false);
    root.innerHTML = `
      <div class="flex"><a href="#" class="btn ghost small">← Alle eksamener</a><span class="spacer"></span>
        <span class="timer" id="timer"></span>
        <button class="btn small secondary" id="btnTimer">⏱ Start 4 t tidtaker</button>
        <label class="small"><input type="checkbox" id="examMode" ${examMode ? 'checked' : ''}> Eksamensmodus (skjul løsninger)</label>
      </div>
      <h1>${exam.title}</h1>
      ${exam.note ? `<div class="callout info">${exam.note}</div>` : ''}
      <div class="callout"><span class="ct">Slik bruker du siden</span>Les oppgaven nøye, skriv et kort og presist svar (2–3 setninger), og vis så løsningsforslaget. Gi deg selv 0, ½ eller 1 poeng per deloppgave. I eksamensmodus skjules løsningsforslagene til du trykker «Lever og vis løsninger».</div>
      <div id="scoreBox" class="scorebar"></div>
      <div id="tasks"></div>
      <div class="btn-row"><button class="btn good" id="btnSubmit">✔ Lever og vis alle løsninger</button><button class="btn bad" id="btnReset">↺ Nullstill alle svar i denne eksamenen</button></div>`;
    const tasksEl = root.querySelector('#tasks');

    exam.tasks.forEach(task => {
      const box = D.el('div', { class: 'exam-task', id: 'task-' + task.n });
      box.innerHTML = `<div class="exam-task-head"><span>Oppgave ${task.n}</span><span class="muted" style="font-weight:600">${task.title}</span><span class="w">${task.w} %</span></div>`;
      const body = D.el('div', { class: 'exam-task-body' });
      if (task.intro) body.appendChild(D.el('div', null, val(task.intro)));
      if (task.mcSrc || task.mc) {
        const qs = task.mc ? task.mc.map((q, i) => Object.assign({ id: `${exam.id}-mc-${i}`, t: 'mock', src: exam.title }, q))
          : D.quizbank.filter(q => q.exam && q.src.startsWith('Eksamen ' + task.mcSrc + ' 1'));
        const qbox = D.el('div');
        body.appendChild(qbox);
        D.Quiz.render(qbox, qs, {
          showSource: false, onUpdate: st => {
            if (st.answered === st.total) { D.store.set(key(exam.id, task.n, 'mc'), { correct: st.correct, total: st.total }); updateScore(); }
          }
        });
      } else {
        task.subs.forEach(s => {
          const sq = D.el('div', { class: 'subq' });
          const k = key(exam.id, task.n, s.l);
          const g = D.store.get(k + '.g', null);
          sq.innerHTML = `<div><span class="subq-label">${s.l})</span>${val(s.q)}</div>
            <textarea placeholder="Skriv svaret ditt her (lagres automatisk) …">${D.esc(D.store.get(k, ''))}</textarea>
            <div class="btn-row"><button class="btn small secondary" data-act="sol">Vis løsningsforslag</button>
              <div class="self-grade">Selvvurdering: ${[0, 1, 2].map(v => `<button data-g="${v}" class="${g === v ? 'on-' + v : ''}">${['0', '½', '1'][v]}</button>`).join('')}</div></div>
            <div class="solution hidden"><div class="st-title">Løsningsforslag</div><div>${val(s.a)}</div>${s.x ? `<div class="small" style="margin-top:6px"><b>Forklaring:</b> ${val(s.x)}</div>` : ''}</div>`;
          sq.querySelector('textarea').addEventListener('input', e => D.store.set(k, e.target.value));
          const sol = sq.querySelector('.solution');
          sq.querySelector('[data-act=sol]').addEventListener('click', ev => {
            if (document.getElementById('examMode').checked && !D.store.get('examSubmitted.' + exam.id, false)) {
              ev.target.textContent = 'Skjult i eksamensmodus';
              return;
            }
            sol.classList.toggle('hidden');
            ev.target.textContent = sol.classList.contains('hidden') ? 'Vis løsningsforslag' : 'Skjul løsningsforslag';
          });
          sq.querySelectorAll('[data-g]').forEach(b => b.addEventListener('click', () => {
            const v = +b.dataset.g;
            D.store.set(k + '.g', v);
            sq.querySelectorAll('[data-g]').forEach(x => x.className = (+x.dataset.g === v ? 'on-' + v : ''));
            updateScore();
          }));
          body.appendChild(sq);
        });
      }
      box.appendChild(body);
      tasksEl.appendChild(box);
    });

    if (D.fig) D.fig.hydrate(root);

    function updateScore() {
      const s = examScore(exam);
      root.querySelector('#scoreBox').innerHTML = `<strong>Poengsum: ${s.pct} %</strong><span class="small muted">(${s.graded} av ${s.tasks} oppgaver vurdert – vektet etter oppgavenes prosent)</span>
        <div class="progress ${s.pct >= 70 ? 'green' : ''}"><span style="width:${s.pct}%"></span></div>
        <span class="small muted">A ≥ 90 · B ≥ 80 · C ≥ 60 · D ≥ 50 · E ≥ 40 (typisk HVL-skala)</span>`;
    }
    updateScore();

    root.querySelector('#examMode').addEventListener('change', e => D.store.set('examMode.' + exam.id, e.target.checked));
    root.querySelector('#btnSubmit').addEventListener('click', () => {
      D.store.set('examSubmitted.' + exam.id, true);
      root.querySelectorAll('.solution').forEach(s => s.classList.remove('hidden'));
      root.querySelectorAll('[data-act=sol]').forEach(b => b.textContent = 'Skjul løsningsforslag');
      if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
    });
    root.querySelector('#btnReset').addEventListener('click', () => {
      if (!confirm('Slette alle svar og vurderinger for denne eksamenen?')) return;
      try {
        Object.keys(localStorage).filter(k => k.startsWith('dat110.exam.' + exam.id + '.') || k === 'dat110.examSubmitted.' + exam.id).forEach(k => localStorage.removeItem(k));
      } catch (e) { /* ignorer */ }
      renderExam(exam);
    });
    root.querySelector('#btnTimer').addEventListener('click', () => {
      const end = Date.now() + 4 * 3600 * 1000;
      if (timerHandle) clearInterval(timerHandle);
      const t = root.querySelector('#timer');
      const tick = () => {
        const left = Math.max(0, end - Date.now());
        const h = Math.floor(left / 3600000), m = Math.floor(left % 3600000 / 60000), s = Math.floor(left % 60000 / 1000);
        t.textContent = `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        if (!left) { clearInterval(timerHandle); t.textContent = 'Tiden er ute!'; }
      };
      tick();
      timerHandle = setInterval(tick, 1000);
    });
    document.title = exam.title + ' – DAT110';
    window.scrollTo(0, 0);
  }

  function route() {
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
    const id = location.hash.replace('#', '');
    const exam = D.exams.find(e => e.id === id);
    if (exam) renderExam(exam); else renderList();
  }

  document.addEventListener('DOMContentLoaded', () => {
    route();
    window.addEventListener('hashchange', route);
  });
})();
