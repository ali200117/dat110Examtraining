/* Teori: kompakt oppslagsverk per tema – huskeliste, formler og svarmaler */
(function () {
  'use strict';
  const D = window.DAT110;

  function renderSide(active) {
    const side = document.getElementById('sidebar');
    let html = `<a class="side-link ${active === 'formler' ? 'active' : ''}" href="#formler"><span class="num">∑</span><span>Formelark (alt samlet)</span></a>
      <a class="side-link ${active === 'teknikk' ? 'active' : ''}" href="#teknikk"><span class="num">✎</span><span>Eksamensteknikk</span></a>`;
    let lastPart = null;
    D.orderedModules().forEach((m, i) => {
      const t = D.TOPICS.find(x => x.key === m.id);
      if (t.part !== lastPart) { html += `<h4>${D.PARTS[t.part]}</h4>`; lastPart = t.part; }
      html += `<a class="side-link ${m.id === active ? 'active' : ''}" href="#${m.id}"><span class="num">${i + 1}</span><span>${t.short}</span></a>`;
    });
    side.innerHTML = html;
  }

  function topicHtml(m) {
    const formulas = m.formulas && m.formulas.length ? `<h3>Formler og regler</h3><div class="table-wrap"><table><tr><th>Hva</th><th>Formel</th><th>Merknad</th></tr>${m.formulas.map(f => `<tr><td>${f.name}</td><td><code>${f.expr}</code></td><td class="small">${f.note || ''}</td></tr>`).join('')}</table></div>` : '';
    const qa = m.examQA && m.examQA.length ? `<h3>Typiske eksamensspørsmål – slik svarer du</h3>${m.examQA.map(x => `<details class="reveal"><summary>${x.q}</summary><div>${x.a}</div></details>`).join('')}` : '';
    return `<div class="module-head"><div class="kicker">${D.PARTS[D.TOPICS.find(t => t.key === m.id).part]}</div><h1>${m.title}</h1><div class="small muted">📚 ${m.source}</div></div>
      <div class="callout exam"><span class="ct">På eksamen</span>${m.exam}</div>
      <h3>Huskeliste</h3><ul>${m.summary.map(s => `<li>${s}</li>`).join('')}</ul>
      ${formulas}${qa}
      <h3>Hovedpunkter per seksjon</h3>
      <ul>${m.sections.map(s => `<li><a href="laer.html#${m.id}/${s.id}">${s.title}</a></li>`).join('')}</ul>
      <div class="btn-row"><a class="btn" href="laer.html#${m.id}">Les hele modulen med eksempler →</a><a class="btn secondary" href="quiz.html#${m.id}">Quiz på temaet →</a><a class="btn ghost" href="begreper.html#${m.id}">Begreper i temaet →</a></div>`;
  }

  function formulaSheet() {
    const rows = D.orderedModules().filter(m => m.formulas && m.formulas.length).map(m =>
      `<tr><th colspan="3" style="background:var(--accent-soft)">${m.title}</th></tr>` + m.formulas.map(f => `<tr><td>${f.name}</td><td><code>${f.expr}</code></td><td class="small">${f.note || ''}</td></tr>`).join('')).join('');
    return `<h1>∑ Formelark</h1><p class="muted">Alle formler og regneregler samlet. Skriv dem ut (Ctrl+P) eller lær dem utenat – det gir gratis poeng på Oppgave 3, 5, 6, 8, 9 og 10.</p>
      <div class="table-wrap"><table><tr><th>Hva</th><th>Formel</th><th>Merknad</th></tr>${rows}</table></div>
      <div class="callout tip"><span class="ct">Ekstra huskeregler</span>
      <ul class="mb0">
        <li>Lag (nedenfra): Fysisk – Link – Nettverk – Transport – Applikasjon. Ruter = 1–3, svitsj = 1–2, hub = 1.</li>
        <li>Endepunkt = IP-adresse + port. TCP-socket = 4-tuppel.</li>
        <li>Forwarding = lokal (tabelloppslag). Routing = global (beregner tabellene).</li>
        <li>ARP: IP → MAC. DNS: navn → IP. DHCP: gir IP-adresse.</li>
        <li>Mutex: sentralisert 3 meldinger, distribuert 2(N−1), token ring 1…∞.</li>
        <li>k-feiltoleranse: k+1 (crash), 2k+1 (avstemning), 3k+1 (bysantinsk enighet).</li>
        <li>Quorum: N_R + N_W &gt; N og N_W &gt; N/2.</li>
        <li>Signer med egen privat nøkkel; verifiser med avsenderens offentlige; krypter til B med Bs offentlige.</li>
      </ul></div>`;
  }

  function technique() {
    return `<h1>✎ Eksamensteknikk</h1>
      <div class="callout exam"><span class="ct">Fra forsiden på alle eksamenene</span>«Les oppgaveteksten nøye og vurder hva det spørres etter i hver enkelt deloppgave. Det ønskes korte og konsise svar på hver av oppgavene. Som hovedregel betyr det 2–3 setninger per delspørsmål. Dersom du mener at noen opplysninger mangler, beskriv antagelsene du har gjort.»</div>
      <h2>Fordel tiden etter vekten</h2>
      <div class="table-wrap"><table><tr><th>Oppgave</th><th>Vekt</th><th>Tid (av ~4 t)</th><th>Strategi</th></tr>
      <tr><td>1 Flervalg</td><td>10 %</td><td>15 min</td><td>Rask. Husk at flere svar kan være riktige – velg alle som stemmer.</td></tr>
      <tr><td>2 Prosjekt</td><td>10 %</td><td>20 min</td><td>Kjenn lagene, meldingsformatet, komponentene og hjelpemetodene i P1–P3.</td></tr>
      <tr><td>3 Forsinkelse</td><td>10 %</td><td>20 min</td><td>Formel → tall → svar med enhet. Ende-til-ende = antall sendende noder × nodal.</td></tr>
      <tr><td>4 Protokollformat</td><td>10 %</td><td>20 min</td><td>Ett kort formål per felt. Kjenn IPv4, UDP, HTTP og TCP-mekanismene.</td></tr>
      <tr><td>5 DV eller ARP</td><td>10 %</td><td>25 min</td><td>Vis min()-uttrykket for hver destinasjon. ARP: hvem mottar (hub = alle), hvem svarer.</td></tr>
      <tr><td>6 IP/forwarding</td><td>10 %</td><td>25 min</td><td>Skriv alltid binærformen – det er begrunnelsen sensor vil se.</td></tr>
      <tr><td>7 DS-teori</td><td>5 %</td><td>10 min</td><td>To–tre presise setninger per delspørsmål.</td></tr>
      <tr><td>8 Overlay</td><td>10 %</td><td>25 min</td><td>Tabell over alle par først. Sjekk begge veier rundt ringen.</td></tr>
      <tr><td>9 Blandet DS</td><td>10 %</td><td>25 min</td><td>Vektorklokker: skriv reglene først, regn mottak etter sending.</td></tr>
      <tr><td>10 Chord</td><td>15 %</td><td>35 min</td><td>Vis «succ(n + 2^(i−1))» for hver rad og hver runde i oppslaget. Skriv formelen pred &lt; k ≤ n.</td></tr></table></div>
      <h2>Når du ikke kjenner igjen spørsmålet</h2>
      <ol>
        <li><b>Finn begrepet</b> spørsmålet egentlig handler om (oversett til det du kan: «endpoint» = socket = IP + port).</li>
        <li><b>Definer</b> det med én setning.</li>
        <li><b>Forklar hvorfor</b> (hvilket problem løser det?).</li>
        <li><b>Gi et eksempel</b> fra prosjektene eller eksamenene.</li>
        <li><b>Skriv antakelser</b> hvis noe mangler – det er eksplisitt lov.</li>
      </ol>
      <h2>Formuleringer som går igjen – lær dem ordrett</h2>
      <ul>
        <li>IP: «Unreliable multi-hop end-to-end transmission of datagrams.»</li>
        <li>Link: «Unreliable transmission of frames across one communication link.»</li>
        <li>UDP: «Connectionless service where loss, duplication and overtaking of segments are possible.»</li>
        <li>Multithreaded server: «Handle multiple requests without blocking and exploit multi-processor architectures.»</li>
        <li>Primary-based vs replicated-write: «single-leader vs multi-leader writes».</li>
        <li>Data- vs client-centric: «system-wide consistency for all replicas vs consistency for a single client moving between replicas».</li>
        <li>DHT: «Finger table → O(log n) scalable search; data and process replication → fault tolerance.»</li>
        <li>Lost request/reply: «timer + retransmit; sequence numbers; server tracks latest sequence number for non-idempotent requests».</li>
      </ul>`;
  }

  function route() {
    const id = location.hash.replace('#', '') || 'formler';
    const main = document.getElementById('main');
    if (id === 'formler') main.innerHTML = formulaSheet();
    else if (id === 'teknikk') main.innerHTML = technique();
    else { const m = D.getModule(id); main.innerHTML = m ? topicHtml(m) : formulaSheet(); }
    renderSide(id);
    window.scrollTo(0, 0);
  }

  document.addEventListener('DOMContentLoaded', () => { route(); window.addEventListener('hashchange', route); });
})();
