/* Training für den Ernstfall: Probearbeit mit Zeitlimit und „Fehler finden“. */
(function (root) {
  var M = root.M, ui = M.ui, doc = root.document;
  var esc = ui.esc, mathe = ui.mathe, katex = ui.katex;
  var z = new M.Zufall();
  var uhr = null;
  root.addEventListener('hashchange', function () { if (uhr) { clearInterval(uhr); uhr = null; } });

  function zurueck() { return '<nav class="kopfnav"><a href="#/" class="zurueck">← Übersicht</a></nav>'; }
  function themaName(id) { var t = M.THEMEN.filter(function (x) { return x.id === id; })[0]; return t ? 'Thema ' + t.nr + ': ' + t.titel : (M.bereiche[id] ? M.bereiche[id].titel : id); }
  function datum(ms) { var d = new Date(ms); return d.toLocaleDateString('de-DE') + ', ' + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }); }

  /* ================= Probearbeit ================= */
  /* Bausteine: [Bereich, Stufe, Generator-Index] */
  var TEIL_A = {
    'thema-01': [['standard', 0], ['basis', 0]],
    'thema-02': [['standard', 2], ['knobel', 0]],
    'thema-03': [['basis', 1], ['standard', 0], ['standard', 3]],
    'thema-04': [['standard', 1], ['standard', 3], ['standard', 2], ['standard', 4]],
    'thema-05': [['basis', 0], ['basis', 1], ['standard', 0]],
    'thema-06': [['basis', 0], ['standard', 0]],
    'thema-07': [['standard', 0], ['standard', 1], ['basis', 0], ['knobel', 0]],
    'thema-08': [['basis', 1], ['standard', 0]],
    'thema-09': [['standard', 1], ['standard', 0]],
    'thema-10': [['basis', 0], ['basis', 1]]
  };
  /* Aufgabentypen vom Wiederholungsblatt der Lehrerin: Nummer -> [Stufe, Index] im Bereich 'wiederholung', dazu das passende Thema */
  var WB = { 1: ['basis', 0], 2: ['basis', 1], 3: ['basis', 2], 4: ['basis', 3], 5: ['basis', 4], 14: ['basis', 5],
    6: ['standard', 0], 7: ['standard', 1], 8: ['standard', 2], 10: ['standard', 3], 11: ['standard', 4],
    9: ['knobel', 0], 12: ['knobel', 1], 13: ['knobel', 2], 15: ['knobel', 3] };
  var WB_THEMA = { 1: 'thema-01', 2: 'thema-06', 3: 'thema-03', 4: 'thema-03', 5: 'thema-07', 6: 'thema-07', 7: 'thema-10', 8: 'thema-04',
    9: 'thema-05', 10: 'thema-07', 11: 'thema-07', 12: 'thema-10', 13: 'thema-09', 14: 'thema-03', 15: 'thema-10' };
  function wb(nr) { var w = WB[nr], a = M.neueAufgabe('wiederholung', w[0], z, -1, w[1]); a.bereich = WB_THEMA[nr]; return a; }
  function thema(id) { var w = z.wahl(TEIL_A[id]); return M.neueAufgabe(id, w[0], z, -1, w[1]); }
  function aufsteigend(a, b) { return a - b; }

  /* Die Probearbeit folgt dem Wiederholungsblatt (neue Zahlen), ergänzt um ein Thema vom Themenzettel, das auf dem Blatt fehlt. */
  function zusammenstellen(minuten) {
    var teilA, teilB;
    if (minuten === 90) {
      teilA = [1, 3, 4, 5, 6, 8, 10, 11, 14].map(wb).concat([thema(z.wahl(['thema-08', 'thema-05', 'thema-06']))]);
      teilB = [7, 9, 12, 13, 15].map(wb);
    } else {
      teilA = z.mischen([4, 5, 6, 8, 10, 11, 14]).slice(0, 4).concat([z.wahl([1, 3])]).sort(aufsteigend).map(wb)
        .concat([thema(z.wahl(['thema-08', 'thema-05', 'thema-06', 'thema-02']))]);
      teilB = z.mischen([7, 9, 12, 13]).slice(0, 2).sort(aufsteigend).map(wb); // ohne Nr. 15 (Pythagoras)
    }
    // Skizze als offene Aufgabe (Selbstbewertung)
    var a = z.wahl([1, -1, 2, -2, 0.5, -0.5]), d = z.int(-3, 3), e = z.int(-4, 3);
    return { teilA: teilA, teilB: teilB, skizze: { a: a, d: d, e: e } };
  }

  function punkteFeld(r) { return r.ok ? 1 : (r.fast ? 0.5 : 0); }

  M.probearbeit = function (app) {
    if (uhr) { clearInterval(uhr); uhr = null; }
    doc.title = 'Probearbeit · Mathearbeit Quadratische Funktionen';
    var bisher = M.fortschritt.probearbeiten();
    var h = [zurueck(), '<header class="seitenkopf"><p class="kicker">Training für den Ernstfall</p><h1>Probearbeit</h1>',
      '<p class="unterzeile">Wie in der Klassenarbeit: <strong>Teil A ohne Taschenrechner</strong>, <strong>Teil B mit Taschenrechner</strong>. Die Aufgaben folgen dem Wiederholungsblatt deiner Lehrerin, mit neuen Zahlen. Während der Probearbeit gibt es keine Tipps und keine Rückmeldung. Die Auswertung kommt am Ende.</p></header>',
      '<div class="karte"><h2>Vorbereitung</h2><ul class="liste-normal"><li>Papier und Stift bereitlegen. Rechne alles auf Papier, wie in der Arbeit.</li><li>Den Taschenrechner erst für Teil B nehmen.</li><li>Handy weg, Timer läuft sichtbar mit.</li><li>Eine Aufgabe sollst du im Heft skizzieren. Die bewertest du am Ende selbst.</li></ul>',
      '<p><strong>Dauer wählen:</strong></p><div class="aktionen"><button type="button" class="knopf haupt" data-min="45">45 Minuten (kurze Arbeit)</button><button type="button" class="knopf haupt" data-min="90">90 Minuten (lange Arbeit)</button></div></div>'];
    if (bisher.length) {
      h.push('<section><h2>Bisherige Probearbeiten</h2><table class="verlauf"><tr><th>Datum</th><th>Dauer</th><th>Ergebnis</th></tr>');
      bisher.slice().reverse().forEach(function (p) { h.push('<tr><td>' + esc(datum(p.datum)) + '</td><td>' + p.minuten + ' min</td><td><strong>' + p.prozent + ' %</strong> (' + String(p.punkte).replace('.', ',') + ' von ' + p.max + ' Punkten)</td></tr>'); });
      h.push('</table></section>');
    }
    app.innerHTML = h.join('');
    app.querySelectorAll('[data-min]').forEach(function (b) { b.addEventListener('click', function () { starten(app, +b.getAttribute('data-min')); }); });
  };

  function starten(app, minuten) {
    var arbeit = zusammenstellen(minuten);
    var ende = Date.now() + minuten * 60000;
    var karten = [];
    var h = ['<div class="pa-leiste"><span class="pa-zeit" aria-live="off"></span><span class="leise pa-info">Probearbeit · ' + minuten + ' min</span><button type="button" class="knopf haupt klein" id="abgeben">Abgeben</button></div>',
      '<header class="seitenkopf"><h1>Probearbeit</h1><p class="unterzeile">Rechne auf Papier und trag die Ergebnisse ein. Leere Felder zählen null Punkte.</p></header>',
      '<h2 class="teil">Teil A: ohne Taschenrechner</h2><div id="teilA"></div>',
      '<div class="pa-nr">Aufgabe ' + (arbeit.teilA.length + 1) + '</div><div class="karte skizze"><div class="marken"><span class="marke tr ohne">ohne Taschenrechner</span><span class="marke">Skizze im Heft</span></div><div class="frage">' +
      mathe('Skizziere in deinem Heft den Graphen von $f(x) = ' + M.t.spf(arbeit.skizze.a, arbeit.skizze.d, arbeit.skizze.e) + '$. Zeichne den Scheitelpunkt und den Schnittpunkt mit der y-Achse ein.') + '</div><div class="skizze-loesung" hidden></div></div>',
      '<h2 class="teil">Teil B: mit Taschenrechner</h2><div id="teilB"></div>',
      '<p><button type="button" class="knopf haupt" id="abgeben2">Probearbeit abgeben</button></p>'];
    app.innerHTML = h.join('');
    root.scrollTo(0, 0);
    function karteAnlegen(ziel, a, nr) {
      var platz = doc.createElement('div');
      platz.className = 'pa-aufgabe';
      platz.innerHTML = '<div class="pa-nr">Aufgabe ' + nr + '</div><div></div>';
      ziel.appendChild(platz);
      var k = ui.aufgabeAnzeigen(platz.lastChild, a, { hilfen: false, feedback: false, ohneAktionen: true, fokus: false, protokoll: false });
      karten.push({ a: a, k: k, teil: ziel.id === 'teilA' ? 'A' : 'B' });
    }
    var nr = 0;
    arbeit.teilA.forEach(function (a) { karteAnlegen(doc.getElementById('teilA'), a, ++nr); });
    arbeit.teilB.forEach(function (a) { karteAnlegen(doc.getElementById('teilB'), a, ++nr + 1); });

    var zeitEl = app.querySelector('.pa-zeit');
    function tick() {
      var rest = Math.max(0, ende - Date.now()), mm = Math.floor(rest / 60000), ss = Math.floor((rest % 60000) / 1000);
      zeitEl.textContent = 'Noch ' + mm + ':' + (ss < 10 ? '0' : '') + ss + ' min';
      zeitEl.classList.toggle('knapp', rest < 5 * 60000);
      if (rest <= 0) abgeben(true);
    }
    uhr = setInterval(tick, 1000); tick();
    var abgegeben = false;
    function abgeben(zeitUm) {
      if (abgegeben) return;
      if (!zeitUm && !root.confirm('Probearbeit jetzt abgeben?')) return;
      abgegeben = true;
      clearInterval(uhr); uhr = null;
      var verbraucht = Math.round((minuten * 60000 - Math.max(0, ende - Date.now())) / 60000);
      auswerten(app, arbeit, karten, minuten, zeitUm, verbraucht);
    }
    doc.getElementById('abgeben').addEventListener('click', function () { abgeben(false); });
    doc.getElementById('abgeben2').addEventListener('click', function () { abgeben(false); });
  }

  function auswerten(app, arbeit, karten, minuten, zeitUm, verbraucht) {
    var proThema = {}, punkte = 0, max = 0;
    karten.forEach(function (c) {
      var erg = c.k.auswerten();
      var p = erg.reduce(function (s, r) { return s + punkteFeld(r); }, 0), m = erg.length;
      c.punkte = p; c.max = m;
      punkte += p; max += m;
      var id = c.a.bereich;
      proThema[id] = proThema[id] || { p: 0, m: 0 };
      proThema[id].p += p; proThema[id].m += m;
      c.k.freigeben();
      var nrEl = c.k.karte.parentNode.previousSibling;
      if (nrEl) nrEl.innerHTML += ' <span class="pa-punkte' + (p === m ? ' voll' : '') + '">' + String(p).replace('.', ',') + ' von ' + m + ' Punkten</span> <span class="leise">· ' + esc(themaName(id)) + '</span>';
    });
    // Skizze: Musterlösung und Selbstbewertung
    var s = arbeit.skizze, pS = M.P.ausScheitel(s.a, s.d, s.e), c0 = M.P.wertQ(pS, 0);
    var sk = app.querySelector('.skizze-loesung');
    sk.hidden = false;
    var w = M.g.fenster([[s.d - 3, s.e], [s.d + 3, s.e], [0, c0.wert()]], 1);
    if (s.a > 0) w.y[1] = Math.max(w.y[1], s.e + 4); else w.y[0] = Math.min(w.y[0], s.e - 4);
    sk.innerHTML = '<strong>Musterlösung:</strong><div class="graph">' + ui.plot({ x: w.x, y: w.y, breite: 320, kurven: [{ fn: M.g.fn(pS) }], punkte: [{ x: s.d, y: s.e, name: 'S' }, { x: 0, y: c0.wert() }] }) + '</div>' +
      mathe('<p>Scheitelpunkt $' + M.t.punkt(s.d, s.e, 'S') + '$, ' + (s.a > 0 ? 'nach oben' : 'nach unten') + ' geöffnet, Streckfaktor $' + M.f.tex(s.a) + '$, Schnittpunkt mit der y-Achse $' + M.t.punkt(0, c0) + '$.</p>') +
      '<p><strong>Bewerte dich selbst:</strong></p><label class="check"><input type="checkbox" data-sp> Scheitelpunkt an der richtigen Stelle</label>' +
      '<label class="check"><input type="checkbox" data-sp> Öffnung und Form (Streckfaktor) richtig</label>' +
      '<label class="check"><input type="checkbox" data-sp> Schnittpunkt mit der y-Achse richtig eingezeichnet</label>' +
      '<label class="check"><input type="checkbox" data-sp> Bei Sachaufgaben einen Antwortsatz geschrieben</label>';
    max += 4;
    var eintrag = { datum: Date.now(), minuten: minuten, punkte: punkte, max: max, prozent: Math.round(100 * punkte / max), proThema: proThema };
    M.fortschritt.probearbeitEintragen(eintrag);
    if (M.protokoll) M.protokoll.probearbeit(eintrag);

    var zusammenfassung = doc.createElement('div');
    zusammenfassung.className = 'karte auswertung pa-ergebnis';
    app.insertBefore(zusammenfassung, app.querySelector('.seitenkopf').nextSibling);
    function zeigen() {
      var selbst = app.querySelectorAll('[data-sp]:checked').length;
      var gesamt = punkte + selbst, prozent = Math.round(100 * gesamt / max);
      eintrag.punkte = gesamt; eintrag.prozent = prozent;
      M.fortschritt.probearbeitAktualisieren(eintrag);
      var schwach = Object.keys(proThema).filter(function (id) { return proThema[id].p < 0.75 * proThema[id].m; });
      var hz = ['<h2>Ergebnis: ' + String(gesamt).replace('.', ',') + ' von ' + max + ' Punkten (' + prozent + ' %)</h2>',
        '<div class="balken gross"><div style="width:' + prozent + '%"></div></div>',
        '<p class="leise">' + (zeitUm ? 'Die Zeit war abgelaufen.' : 'Abgegeben nach ' + verbraucht + ' von ' + minuten + ' Minuten.') + ' Die Skizze zählt mit, sobald du dich unten selbst bewertest.</p>',
        '<table class="verlauf"><tr><th>Thema</th><th>Punkte</th><th></th></tr>'];
      Object.keys(proThema).sort().forEach(function (id) {
        var x = proThema[id];
        hz.push('<tr><td>' + esc(themaName(id)) + '</td><td>' + String(x.p).replace('.', ',') + ' / ' + x.m + '</td><td>' + (x.p < 0.75 * x.m ? '<a href="#/b/' + id + '">üben</a>' : '✓') + '</td></tr>');
      });
      hz.push('</table>');
      hz.push('<p>' + (schwach.length ? '<strong>Das solltest du noch üben:</strong> ' + schwach.map(function (id) { return '<a href="#/b/' + id + '">' + esc(themaName(id)) + '</a>'; }).join(', ') + '.' : '<strong>Stark!</strong> In allen Themen mindestens drei Viertel der Punkte.') + '</p>');
      hz.push('<p class="leise">Unten siehst du jede Aufgabe mit Rückmeldung. Mit „Lösungsweg“ kannst du jeden Schritt nachvollziehen.</p>');
      hz.push('<p><a class="knopf" href="#/probearbeit">Neue Probearbeit</a> <a class="knopf leise-knopf" href="#/">Zur Übersicht</a></p>');
      zusammenfassung.innerHTML = hz.join('');
    }
    app.querySelectorAll('[data-sp]').forEach(function (cb) { cb.addEventListener('change', zeigen); });
    app.querySelector('.pa-leiste').innerHTML = '<span class="pa-zeit">Abgegeben</span><a class="knopf klein" href="#/probearbeit">Neue Probearbeit</a>';
    app.querySelectorAll('#abgeben2').forEach(function (b) { b.parentNode.removeChild(b); });
    zeigen();
    root.scrollTo(0, 0);
  }

  /* ================= Fehler finden ================= */
  M.fehlerFinden = function (app) {
    doc.title = 'Fehler finden · Mathearbeit Quadratische Funktionen';
    var filter = 'Alle', serie = { n: 0, r: 0 };
    app.innerHTML = zurueck() + '<header class="seitenkopf"><p class="kicker">Training für den Ernstfall</p><h1>Fehler finden</h1>' +
      '<p class="unterzeile">Im Lösungsweg steckt <strong>genau ein</strong> typischer Fehler. Klick die Zeile an, in der er passiert.</p></header>' +
      '<div class="stufen" role="tablist">' + ['Alle'].concat(M.FEHLER_BEREICHE).map(function (b) { return '<button type="button" class="stufe-tab' + (b === filter ? ' aktiv' : '') + '" data-f="' + b + '">' + b + '</button>'; }).join('') + '</div>' +
      '<div class="ff-platz"></div><div class="bereich-stand ff-stand"></div>';
    var platz = app.querySelector('.ff-platz'), stand = app.querySelector('.ff-stand'), letzte = -1;
    app.querySelectorAll('[data-f]').forEach(function (b) {
      b.addEventListener('click', function () {
        filter = b.getAttribute('data-f');
        app.querySelectorAll('[data-f]').forEach(function (x) { x.classList.toggle('aktiv', x === b); });
        neu();
      });
    });
    function standZeigen() { stand.innerHTML = serie.n ? '<div class="balken-label">In dieser Sitzung: ' + serie.r + ' von ' + serie.n + ' Fehlern beim ersten Klick gefunden</div>' : ''; }
    function neu() {
      var liste = M.FEHLER.map(function (x, i) { return { x: x, i: i }; }).filter(function (o) { return filter === 'Alle' || o.x.bereich === filter; });
      var w = z.wahl(liste);
      if (liste.length > 1 && w.i === letzte) w = z.wahl(liste.filter(function (o) { return o.i !== letzte; }));
      letzte = w.i;
      var a = w.x.fn(z), versuche = 0, fertig = false;
      var h = ['<article class="karte aufgabe ff"><div class="marken"><span class="marke">' + esc(w.x.bereich) + '</span><span class="marke">' + esc(a.titel) + '</span></div>',
        '<div class="frage">' + mathe(a.aufgabe) + '</div><p class="leise">Welche Zeile enthält den Fehler?</p><ol class="ff-zeilen">'];
      a.zeilen.forEach(function (z2, i) { h.push('<li><button type="button" class="ff-zeile" data-z="' + i + '">' + katex(z2, false) + '</button></li>'); });
      h.push('</ol><div class="rueckmeldung" aria-live="polite"></div><div class="aktionen"><button type="button" class="knopf leise-knopf" data-neu>Nächste Aufgabe</button></div></article>');
      platz.innerHTML = h.join('');
      var rm = platz.querySelector('.rueckmeldung');
      platz.querySelectorAll('.ff-zeile').forEach(function (b) {
        b.addEventListener('click', function () {
          if (fertig) return;
          var i = +b.getAttribute('data-z');
          versuche++;
          if (i === a.fehler) {
            fertig = true;
            b.classList.add('fehler');
            serie.n++; if (versuche === 1) serie.r++;
            M.fortschritt.eintragen('fehler', 'basis', versuche === 1);
            if (M.protokoll) M.protokoll.fehler(a.titel, versuche === 1);
            rm.className = 'rueckmeldung gut';
            rm.innerHTML = '<strong>' + (versuche === 1 ? 'Gefunden!' : 'Jetzt hast du ihn.') + '</strong> ' + mathe(a.warum) +
              '<div class="ff-richtig">Richtig wäre:' + katex(a.richtig, true) + '</div>' +
              (a.grundlage && M.bereiche[a.grundlage] ? '<a href="#/b/' + a.grundlage + '">Grundlage auffrischen: ' + esc(M.bereiche[a.grundlage].titel) + '</a>' : '');
            standZeigen();
          } else {
            b.classList.add('ok');
            b.disabled = true;
            rm.className = 'rueckmeldung schlecht';
            rm.innerHTML = 'Diese Zeile stimmt. Such weiter.' + (versuche >= 2 ? ' Tipp: Rechne jeden Schritt selbst nach und vergleiche.' : '');
          }
        });
      });
      platz.querySelector('[data-neu]').addEventListener('click', neu);
    }
    neu(); standZeigen();
  };
})(window);
