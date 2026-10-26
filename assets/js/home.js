/* Hjem: nedtelling, fremdrift, studieplan fram til eksamen og svake temaer */
(function () {
  'use strict';
  const D = window.DAT110;

  const PLAN = [
    { from: '2026-10-26', to: '2026-11-01', title: 'Uke 44 – Grunnlaget', items: [
      ['Modul 1: Internett, forsinkelse og gjennomstrømning', 'laer.html#intro'],
      ['Modul 2: Protokollag og innkapsling', 'laer.html#layers'],
      ['Modul 3: Distribuerte systemer og sky', 'laer.html#ds-intro'],
      ['Regnetrening: Forsinkelse (minst 5 oppgaver)', 'trening.html#delay'],
      ['Flashcards: begreper i del A', 'begreper.html'] ] },
    { from: '2026-11-02', to: '2026-11-08', title: 'Uke 45 – Applikasjon, tråder og RPC', items: [
      ['Modul 4: HTTP, DNS og sockets', 'laer.html#app'],
      ['Modul 5: Prosesser, tråder og servere', 'laer.html#proc'],
      ['Modul 6: RPC', 'laer.html#rpc'],
      ['Prosjekt 1 (seksjon 1–2 i prosjektmodulen)', 'laer.html#projects/projects-1'],
      ['Quiz: 20 spørsmål, tema RPC', 'quiz.html#rpc'] ] },
    { from: '2026-11-09', to: '2026-11-15', title: 'Uke 46 – Meldinger, multicast og transport', items: [
      ['Modul 7: MOM og publish-subscribe (prosjekt 2)', 'laer.html#mom'],
      ['Modul 8: Multicast og overlay', 'laer.html#mcast'],
      ['Regnetrening: Overlay/RDP (minst 5)', 'trening.html#overlay'],
      ['Modul 9: Transportlaget (UDP og rdt)', 'laer.html#transport'],
      ['Regnetrening: Sjekksum', 'trening.html#checksum'] ] },
    { from: '2026-11-16', to: '2026-11-22', title: 'Uke 47 – TCP og nettverkslaget', items: [
      ['Modul 9: TCP-delen ferdig', 'laer.html#transport/transport-5'],
      ['Modul 10: IP, fragmentering, CIDR og LPM', 'laer.html#network'],
      ['Regnetrening: IP & CIDR (minst 10)', 'trening.html#ip'],
      ['Regnetrening: Fragmentering', 'trening.html#frag'],
      ['Quiz: alle ekte eksamensspørsmål (Oppgave 1)', 'quiz.html#exam'] ] },
    { from: '2026-11-23', to: '2026-11-29', title: 'Uke 48 – Routing og linklaget', items: [
      ['Modul 11: Routing (DV, Dijkstra, OSPF, BGP)', 'laer.html#routing'],
      ['Regnetrening: Distance-vector (minst 5)', 'trening.html#dv'],
      ['Modul 12: Linklaget (ARP, svitsj, Ethernet)', 'laer.html#link'],
      ['Eksamen mai 2022 (første gjennomgang)', 'eksamen.html#mai-2022'] ] },
    { from: '2026-11-30', to: '2026-12-06', title: 'Uke 49 – Navngiving, DHT og klokker', items: [
      ['Modul 13: Navngiving og Chord DHT', 'laer.html#naming'],
      ['Regnetrening: Chord DHT (minst 8!)', 'trening.html#dht'],
      ['Modul 14: Klokker – Lamport og vektor', 'laer.html#clocks'],
      ['Regnetrening: Vektorklokker (minst 6)', 'trening.html#vc'],
      ['Eksamen mai 2023', 'eksamen.html#mai-2023'] ] },
    { from: '2026-12-07', to: '2026-12-13', title: 'Uke 50 – Koordinering og konsistens', items: [
      ['Modul 15: Mutex og valgalgoritmer', 'laer.html#mutex'],
      ['Modul 16: Konsistens og replikering', 'laer.html#consistency'],
      ['Prosjekt 3 (prosjektmodul seksjon 4)', 'laer.html#projects/projects-4'],
      ['Eksamen jan 2024', 'eksamen.html#jan-2024'] ] },
    { from: '2026-12-14', to: '2026-12-20', title: 'Uke 51 – Feiltoleranse og sikkerhet', items: [
      ['Modul 17: Feiltoleranse', 'laer.html#fault'],
      ['Modul 18: Sikkerhet og kryptografi', 'laer.html#security'],
      ['Regnetrening: RSA', 'trening.html#rsa'],
      ['Eksamen mai 2024', 'eksamen.html#mai-2024'] ] },
    { from: '2026-12-21', to: '2026-12-27', title: 'Uke 52 – Juleuke: lett repetisjon', items: [
      ['Flashcards: «bare de jeg ikke kan»', 'begreper.html'],
      ['Quiz: «bare spørsmål jeg bommet på»', 'quiz.html'],
      ['Eksamen jan 2025 (samme dato som din!)', 'eksamen.html#jan-2025'] ] },
    { from: '2026-12-28', to: '2027-01-03', title: 'Uke 53 – Eksamenstrening på tid', items: [
      ['Eksamen juni 2025', 'eksamen.html#juni-2025'],
      ['Øvingseksamen A på tid (4 t)', 'eksamen.html#ovelse-a'],
      ['Repeter de 3 svakeste temaene (se under)', 'quiz.html'],
      ['Regnetrening: én av hver type', 'trening.html'] ] },
    { from: '2027-01-04', to: '2027-01-06', title: 'Siste innspurt', items: [
      ['Øvingseksamen B på tid', 'eksamen.html#ovelse-b'],
      ['Formelark – lær det utenat', 'teori.html#formler'],
      ['Eksamensteknikk og ordrette formuleringer', 'teori.html#teknikk'],
      ['Sov godt kvelden før 😴', 'index.html'] ] },
    { from: '2027-01-07', to: '2027-01-07', title: '🎓 7. januar – EKSAMEN', items: [['Lykke til! Les oppgavene nøye og svar kort og presist.', 'teori.html#teknikk']] }
  ];

  function render() {
    const root = document.getElementById('home');
    const days = D.daysToExam();
    const mods = D.orderedModules();
    const done = D.store.get('done', {});
    const totalSec = mods.reduce((a, m) => a + m.sections.length, 0);
    const doneSec = mods.reduce((a, m) => a + m.sections.filter(s => done[s.id]).length, 0);
    const ts = D.topicStats();
    const answered = Object.values(ts).reduce((a, s) => a + s.answered, 0);
    const correct = Object.values(ts).reduce((a, s) => a + s.correctLast, 0);
    const last = D.store.get('lastModule', mods[0].id);
    const lastMod = D.getModule(last) || mods[0];
    const plan = D.store.get('plan', {});
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const weak = D.TOPICS.map(t => ({ t, s: ts[t.key] })).filter(x => x.s && x.s.answered >= 3)
      .map(x => ({ ...x, pct: x.s.correctLast / x.s.answered })).sort((a, b) => a.pct - b.pct).slice(0, 3);
    const qCount = D.modules.reduce((a, m) => a + m.sections.reduce((b, s) => b + (s.quiz || []).length, 0), 0);

    root.innerHTML = `
      <section class="hero">
        <h1>DAT110 – eksamenstrening</h1>
        <p>Distribuerte systemer og nettverksteknologi. Alt du trenger fram til eksamen <b>7. januar 2027</b>: læringsløp fra første til siste tema med mini-quizer, teoriark, en stor quizbank, alle tidligere eksamener med løsningsforslag, regnetrening med uendelig mange nye oppgaver og en begrepsliste.</p>
        <div class="btn-row"><a class="btn" href="laer.html#${lastMod.id}">▶ Fortsett: ${lastMod.title}</a><a class="btn secondary" href="eksamen.html">Eksamener</a><a class="btn ghost" href="trening.html">Regnetrening</a></div>
      </section>
      <div class="grid grid-4">
        <div class="card"><div class="stat">${days > 0 ? days : 0}</div><div class="stat-label">dager til eksamen</div></div>
        <div class="card"><div class="stat">${Math.round(100 * doneSec / totalSec)}%</div><div class="stat-label">av læringsløpet (${doneSec}/${totalSec} seksjoner)</div></div>
        <div class="card"><div class="stat">${answered}</div><div class="stat-label">quizspørsmål besvart</div></div>
        <div class="card"><div class="stat">${answered ? Math.round(100 * correct / answered) + '%' : '–'}</div><div class="stat-label">riktige (siste forsøk)</div></div>
      </div>

      <h2>Hva finner du hvor?</h2>
      <div class="grid grid-3">
        <a class="card" href="laer.html" style="color:inherit;text-decoration:none"><h3 class="mt0">📘 Læringsløp</h3><p class="small muted mb0">19 moduler fra første til siste tema – forklaringer, figurer, «hvorfor»-bokser, regnede eksempler fra eksamen og ${qCount} mini-quiz-spørsmål underveis.</p></a>
        <a class="card" href="teori.html" style="color:inherit;text-decoration:none"><h3 class="mt0">📑 Teori</h3><p class="small muted mb0">Kompakt oppslag per tema: huskeliste, formler og modellsvar. Samlet formelark og eksamensteknikk.</p></a>
        <a class="card" href="quiz.html" style="color:inherit;text-decoration:none"><h3 class="mt0">🧠 Quiz</h3><p class="small muted mb0">Flervalg fra hele faget: ekte eksamensspørsmål, Canvas-quizene og nye i eksamensstil. Filtrer, stokk og nullstill.</p></a>
        <a class="card" href="eksamen.html" style="color:inherit;text-decoration:none"><h3 class="mt0">📝 Eksamen</h3><p class="small muted mb0">6 tidligere eksamener (2022–2025) med sensorveiledning + 2 øvingseksamener. Tidtaker og selvvurdering.</p></a>
        <a class="card" href="trening.html" style="color:inherit;text-decoration:none"><h3 class="mt0">🧮 Regnetrening</h3><p class="small muted mb0">Nye tall hver gang: Chord, vektorklokker, IP/CIDR, forsinkelse, distance-vector, overlay, fragmentering, RSA.</p></a>
        <a class="card" href="begreper.html" style="color:inherit;text-decoration:none"><h3 class="mt0">📖 Begreper</h3><p class="small muted mb0">${D.glossary.length || '200+'} begreper med norsk forklaring, engelsk fagterm og eksamenstips. Flashcards og test.</p></a>
      </div>

      ${weak.length ? `<div class="callout warn"><span class="ct">Dine svakeste temaer akkurat nå</span>${weak.map(w => `<a href="laer.html#${w.t.key}">${w.t.short}</a> (${Math.round(100 * w.pct)} %)`).join(' · ')} – les modulen på nytt og ta quizen for temaet.</div>` : ''}

      <h2>Studieplan fram til 7. januar</h2>
      <p class="muted small">Ca. 10 uker. Huk av etter hvert – planen lagres i nettleseren. Inneværende uke er markert.</p>
      <div class="grid grid-2" id="plan"></div>

      <h2>Slik bruker du siden best</h2>
      <ol class="steps">
        <li><b>Les én modul om gangen</b> i læringsløpet. Svar på mini-quizen før du går videre – feil svar forklares.</li>
        <li><b>Regn selv</b> med en gang du har lest et regnetema (forsinkelse, IP, DV, overlay, DHT, vektorklokker).</li>
        <li><b>Ta én tidligere eksamen per uke</b> fra uke 48. Skriv svarene før du ser løsningen, og vurder deg selv ærlig.</li>
        <li><b>Bruk quizen med «bare de jeg bommet på»</b> for å lukke hull, og flashcards for begrepene.</li>
        <li><b>Siste uke:</b> øvingseksamener på tid, formelark og ordrette formuleringer.</li>
      </ol>
      <div class="flex"><span class="spacer"></span><button class="btn small ghost" id="resetAll">Nullstill ALL fremdrift</button></div>`;

    const planEl = root.querySelector('#plan');
    PLAN.forEach((w, wi) => {
      const from = new Date(w.from + 'T00:00:00'), to = new Date(w.to + 'T23:59:59');
      const current = today >= from && today <= to;
      const div = D.el('div', { class: 'plan-week' + (current ? ' current' : '') });
      const fmtD = d => d.toLocaleDateString('no-NO', { day: 'numeric', month: 'short' });
      div.innerHTML = `<h4>${w.title}${current ? ' <span class="tag good">nå</span>' : ''}</h4><div class="small muted">${fmtD(from)} – ${fmtD(to)}</div>
        <ul>${w.items.map((it, ii) => { const id = wi + '-' + ii; return `<li class="${plan[id] ? 'done' : ''}"><input type="checkbox" data-id="${id}" ${plan[id] ? 'checked' : ''}><span><a href="${it[1]}">${it[0]}</a></span></li>`; }).join('')}</ul>`;
      div.querySelectorAll('input').forEach(cb => cb.addEventListener('change', () => {
        const p = D.store.get('plan', {});
        if (cb.checked) p[cb.dataset.id] = true; else delete p[cb.dataset.id];
        D.store.set('plan', p);
        cb.closest('li').classList.toggle('done', cb.checked);
      }));
      planEl.appendChild(div);
    });
    root.querySelector('#resetAll').addEventListener('click', () => {
      if (confirm('Slette ALL fremdrift (lest, quizstatistikk, eksamenssvar, plan)?')) { D.store.clearAll(); render(); }
    });
  }

  document.addEventListener('DOMContentLoaded', render);
})();
