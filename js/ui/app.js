/* Seiten und Navigation (Hash-Routen, funktioniert per Doppelklick ohne Server). */
(function (root) {
  var M = root.M, ui = M.ui, doc = root.document;
  var esc = ui.esc, mathe = ui.mathe;
  var z = new M.Zufall();

  function app() { return doc.getElementById('app'); }
  function titel(t) { doc.title = t ? t + ' · Mathearbeit Quadratische Funktionen' : 'Mathearbeit Quadratische Funktionen'; }
  function zurueck() { return '<nav class="kopfnav"><a href="#/" class="zurueck">← Übersicht</a></nav>'; }

  var AMPEL_TEXT = { offen: 'noch nicht begonnen', arbeit: 'in Arbeit', sicher: 'sicher' };
  function ampel(id) {
    var s = M.fortschritt.status(id);
    var zahl = s.n ? s.n + ' bearbeitet, ' + s.r + ' richtig' : AMPEL_TEXT.offen;
    return '<span class="ampel ' + s.ampel + '" title="' + AMPEL_TEXT[s.ampel] + '"></span><span class="kachel-stand">' +
      (s.ampel === 'sicher' ? 'sicher · ' : '') + zahl + '</span>';
  }

  /* ---------- Übersicht ---------- */
  function kachel(href, nr, t, kurz, unten, bereit) {
    if (!bereit) {
      return '<div class="kachel gesperrt"><div class="kachel-nr">' + nr + '</div><div class="kachel-titel">' + esc(t) + '</div>' +
        '<div class="kachel-kurz">' + esc(kurz) + '</div><div class="kachel-unten"><span class="leise">folgt in Kürze</span></div></div>';
    }
    return '<a class="kachel" href="' + href + '"><div class="kachel-nr">' + nr + '</div><div class="kachel-titel">' + esc(t) + '</div>' +
      '<div class="kachel-kurz">' + esc(kurz) + '</div><div class="kachel-unten">' + (unten || '') + '</div></a>';
  }
  function seiteUebersicht() {
    titel('');
    var h = [];
    h.push('<header class="seitenkopf"><p class="kicker">Klasse 9 · Neue Wege 9 · Kapitel 4</p>' +
      '<h1>Quadratische Funktionen und Gleichungen</h1>' +
      '<p class="unterzeile">Training für die Mathearbeit. Erst die Grundlagen festigen, dann die zehn Themen vom Themenzettel üben.</p>' +
      '<div class="papier-hinweis"><strong>Rechne auf Papier, gib hier nur das Ergebnis ein.</strong> In der Arbeit schreibst du auch auf Papier. Die Seite prüft dein Ergebnis und hilft, wenn du nicht weiterkommst.</div>' +
      '</header>');
    if (M.WIEDERHOLUNG) {
      var swb = M.fortschritt.status('wiederholung');
      h.push('<section><a class="kachel wichtig" href="#/wiederholung"><div class="kachel-nr">Neu · von deiner Lehrerin</div><div class="kachel-titel">Wiederholungsblatt: 15 Aufgaben, so ähnlich kommt es in der Arbeit</div>' +
        '<div class="kachel-kurz">Rechne das Blatt auf Papier und prüfe hier deine Ergebnisse. Dann jede Aufgabe mit neuen Zahlen üben.</div><div class="kachel-unten">' + ampel('wiederholung') + '</div></a></section>');
    }
    h.push('<section><div class="abschnitt-kopf"><h2>Grundlagen festigen</h2><a class="knopf haupt" href="#/aufwaermen">Aufwärmen: 5 gemischte Aufgaben</a></div>' +
      '<p class="leise">Tipp: Starte jede Lernsitzung mit dem Aufwärmen.</p><div class="kacheln">');
    M.GRUNDLAGEN.forEach(function (id, i) {
      var b = M.bereiche[id];
      h.push(b ? kachel('#/b/' + id, 'G' + (i + 1), b.titel, b.kurz, ampel(id), true) : '');
    });
    h.push('</div></section>');
    h.push('<section><div class="abschnitt-kopf"><h2>Themen der Arbeit</h2></div><div class="kacheln">');
    M.THEMEN.forEach(function (t) {
      h.push(kachel('#/b/' + t.id, t.nr, t.titel, t.kurz, ampel(t.id), !!M.bereiche[t.id]));
    });
    h.push('</div></section>');
    h.push('<section><div class="abschnitt-kopf"><h2>Training für den Ernstfall</h2></div><div class="kacheln">');
    var pa = M.fortschritt.probearbeiten();
    h.push(kachel('#/probearbeit', 'P', 'Probearbeit', 'Teil A ohne, Teil B mit Taschenrechner, mit Zeitlimit und Auswertung.',
      pa.length ? 'zuletzt ' + pa[pa.length - 1].prozent + ' %' : '', !!M.probearbeit));
    h.push(kachel('#/fehler', 'F', 'Fehler finden', 'Ein vorgerechneter Weg enthält genau einen typischen Fehler. Findest du ihn?', ampel('fehler'), !!M.fehlerFinden));
    h.push(kachel('#/merkblatt', 'M', 'Merkblatt', 'Alle Formeln und Verfahren auf einer Seite, zum Ausdrucken.', '', !!M.MERKBLATT));
    h.push('</div></section>');
    h.push('<section class="weiter"><h2>Zum Weiterüben im Buch und Heft</h2><p>' + esc(M.WEITERUEBEN.arbeitsheft) + '</p><p>' + esc(M.WEITERUEBEN.checkup) + '</p></section>');
    h.push('<footer class="fuss"><button type="button" class="knopf leise-knopf klein" id="reset">Fortschritt zurücksetzen</button></footer>');
    app().innerHTML = h.join('');
    doc.getElementById('reset').addEventListener('click', function () {
      if (root.confirm('Wirklich den gesamten Fortschritt löschen?')) { M.fortschritt.zuruecksetzen(); seiteUebersicht(); }
    });
  }

  /* ---------- Bereich (Grundlage oder Thema) ---------- */
  function meta(id) {
    var b = M.bereiche[id];
    var t = M.THEMEN.filter(function (x) { return x.id === id; })[0];
    var gi = M.GRUNDLAGEN.indexOf(id);
    return {
      kicker: b.kicker || (t ? 'Thema ' + t.nr : 'Grundlage ' + (gi + 1)),
      titel: b.titel, kurz: b.kurz || (t && t.kurz),
      quellen: (t && t.quellen) || b.quellen || []
    };
  }

  function seiteBereich(id, stufe, fest) {
    fest = fest !== undefined && fest !== '' ? +fest : undefined;
    var b = M.bereiche[id];
    if (M.STUFEN.indexOf(stufe) < 0) stufe = 'basis';
    var m = meta(id);
    titel(b.titel);
    var h = [zurueck()];
    h.push('<header class="seitenkopf"><p class="kicker">' + esc(m.kicker) + '</p><h1>' + esc(m.titel) + '</h1>' +
      '<p class="unterzeile">' + mathe(m.kurz || '') + '</p>' +
      (b.brauchst ? '<p class="brauchst"><strong>Brauchst du für:</strong> ' + mathe(b.brauchst) + '</p>' : '') +
      (m.quellen.length ? '<p class="quellen"><strong>Im Buch und Heft:</strong> ' + esc(m.quellen.join(' · ')) + '</p>' : '') +
      '</header>');
    if (b.erklaerung) h.push('<details class="erklaert"><summary>Kurz erklärt</summary><div class="erklaert-inhalt">' + mathe(b.erklaerung) + '</div><div class="widget"></div></details>');
    h.push('<div class="stufen" role="tablist">' + M.STUFEN.map(function (s) {
      var st = M.fortschritt.status(id).stufen || {};
      var x = st[s];
      return '<a role="tab" class="stufe-tab' + (s === stufe ? ' aktiv' : '') + '" href="#/b/' + id + '/' + s + '" aria-selected="' + (s === stufe) + '">' +
        M.STUFEN_NAME[s] + (x ? ' <span class="leise">' + x.r + '/' + x.n + '</span>' : '') + '</a>';
    }).join('') + '</div>');
    h.push('<div class="banner" hidden></div><div class="aufgabe-platz"></div>');
    h.push('<div class="bereich-stand"></div>');
    app().innerHTML = h.join('');
    if (b.widget) {
      var det = app().querySelector('details.erklaert');
      var geladen = false;
      det.addEventListener('toggle', function () { if (det.open && !geladen) { geladen = true; b.widget(det.querySelector('.widget')); } });
    }

    var platz = app().querySelector('.aufgabe-platz');
    var banner = app().querySelector('.banner');
    var standEl = app().querySelector('.bereich-stand');
    var letzterIndex = -1, fehlerFolge = {}, richtigFolge = 0;

    function standZeigen() {
      var s = M.fortschritt.status(id);
      var anteil = s.letzte ? Math.round(100 * s.richtigLetzte / 10) : 0;
      standEl.innerHTML = '<div class="balken-label">Letzte 10 Aufgaben: ' + (s.letzte ? s.richtigLetzte + ' von ' + s.letzte + ' richtig' : 'noch keine') +
        (s.ampel === 'sicher' ? ' · <strong>sicher</strong>' : '') + '</div><div class="balken"><div style="width:' + anteil + '%"></div></div>';
    }
    function bannerZeigen(html) { banner.innerHTML = html; banner.hidden = false; }

    function neu() {
      banner.hidden = true;
      var a = M.neueAufgabe(id, stufe, z, letzterIndex, fest);
      letzterIndex = a.genIndex;
      ui.aufgabeAnzeigen(platz, a, {
        onNeu: neu,
        serie: function () { return richtigFolge; },
        onGeprueft: function (richtig, aufgabe) {
          M.fortschritt.eintragen(id, stufe, richtig);
          standZeigen();
          if (richtig) {
            fehlerFolge[aufgabe.typ] = 0;
            richtigFolge++;
            var naechste = M.STUFEN[M.STUFEN.indexOf(stufe) + 1];
            if (richtigFolge >= 4 && naechste) bannerZeigen('Läuft. Bereit für die nächste Stufe? <a class="knopf klein" href="#/b/' + id + '/' + naechste + '">Weiter mit ' + M.STUFEN_NAME[naechste] + '</a>');
          } else {
            richtigFolge = 0;
            fehlerFolge[aufgabe.typ] = (fehlerFolge[aufgabe.typ] || 0) + 1;
            if (fehlerFolge[aufgabe.typ] >= 2) {
              var vor = M.STUFEN[M.STUFEN.indexOf(stufe) - 1];
              var links = [];
              if (aufgabe.grundlage && M.bereiche[aufgabe.grundlage] && aufgabe.grundlage !== id) links.push('<a class="knopf klein" href="#/b/' + aufgabe.grundlage + '">Grundlage: ' + esc(M.bereiche[aufgabe.grundlage].titel) + '</a>');
              if (vor) links.push('<a class="knopf klein" href="#/b/' + id + '/' + vor + '">Eine Stufe leichter</a>');
              if (links.length) bannerZeigen('Diese Art Aufgabe hakt gerade. Kein Problem, ein Schritt zurück hilft oft. ' + links.join(' '));
            }
          }
        }
      });
    }
    standZeigen();
    neu();
  }

  /* ---------- Aufwärmen: 5 gemischte Grundlagen-Aufgaben ---------- */
  function seiteAufwaermen() {
    titel('Aufwärmen');
    var runde = [];
    var ids = M.GRUNDLAGEN.filter(function (id) { return M.bereiche[id]; });
    var reihen = z.mischen(ids);
    for (var i = 0; i < 5; i++) {
      var id = reihen[i % reihen.length];
      runde.push(M.neueAufgabe(id, z.chance(0.5) ? 'basis' : 'standard', z, -1));
    }
    var pos = 0, ergebnisse = [];
    app().innerHTML = zurueck() + '<header class="seitenkopf"><p class="kicker">Grundlagen</p><h1>Aufwärmen</h1>' +
      '<p class="unterzeile">Fünf gemischte Aufgaben quer durch die Grundlagen.</p></header>' +
      '<div class="zaehler"></div><div class="aufgabe-platz"></div>';
    var platz = app().querySelector('.aufgabe-platz'), zaehler = app().querySelector('.zaehler');
    function zeige() {
      if (pos >= runde.length) return fertig();
      zaehler.innerHTML = 'Aufgabe ' + (pos + 1) + ' von ' + runde.length + ' · ' + esc(M.bereiche[runde[pos].bereich].titel);
      var a = runde[pos];
      ui.aufgabeAnzeigen(platz, a, {
        neuText: pos + 1 < runde.length ? 'Weiter' : 'Auswertung',
        onNeu: function () { if (ergebnisse[pos] === undefined) ergebnisse[pos] = false; pos++; zeige(); },
        onGeprueft: function (richtig) { ergebnisse[pos] = richtig; M.fortschritt.eintragen(a.bereich, a.stufe, richtig); }
      });
    }
    function fertig() {
      var r = ergebnisse.filter(Boolean).length;
      var h = ['<div class="karte auswertung"><h2>' + r + ' von ' + runde.length + ' richtig</h2><ul class="liste">'];
      runde.forEach(function (a, i) {
        h.push('<li class="' + (ergebnisse[i] ? 'gut' : 'schlecht') + '">' + (ergebnisse[i] ? '✓ ' : '✗ ') + esc(M.bereiche[a.bereich].titel) +
          (ergebnisse[i] ? '' : ' · <a href="#/b/' + a.bereich + '/' + a.stufe + '">gezielt üben</a>') + '</li>');
      });
      h.push('</ul><p>' + (r === 5 ? 'Alles sitzt. Weiter mit den Themen.' : (r >= 3 ? 'Gute Basis. Übe das, was nicht geklappt hat, noch einmal gezielt.' : 'Nimm dir die markierten Grundlagen gezielt vor, bevor du mit den Themen weitermachst.')) + '</p>');
      h.push('<p><a class="knopf haupt" href="#/aufwaermen" id="nochmal">Noch eine Runde</a> <a class="knopf" href="#/">Zur Übersicht</a></p></div>');
      zaehler.innerHTML = '';
      platz.innerHTML = h.join('');
      doc.getElementById('nochmal').addEventListener('click', function (ev) { ev.preventDefault(); seiteAufwaermen(); });
    }
    zeige();
  }

  /* ---------- Merkblatt ---------- */
  function seiteMerkblatt() {
    titel('Merkblatt');
    app().innerHTML = zurueck() + '<div class="merkblatt-aktion"><button type="button" class="knopf haupt" id="drucken">Drucken</button></div>' +
      '<article class="merkblatt">' + mathe(M.MERKBLATT) + '</article>';
    doc.getElementById('drucken').addEventListener('click', function () { root.print(); });
  }

  function seiteFolgt(name) {
    titel(name);
    app().innerHTML = zurueck() + '<header class="seitenkopf"><h1>' + esc(name) + '</h1><p class="unterzeile">Dieser Bereich folgt in Kürze.</p></header>';
  }

  /* ---------- Router ---------- */
  function route() {
    var h = (root.location.hash || '').replace(/^#\/?/, '');
    var t = h.split('/');
    root.scrollTo(0, 0);
    doc.body.setAttribute('data-seite', t[0] || 'start');
    if (M.protokoll) M.protokoll.seite(t[0] === 'b' && M.bereiche[t[1]] ? t[1] : (t[0] || 'start'));
    if (t[0] === 'protokoll' && M.protokoll) return M.protokoll.ansicht(app());
    if (t[0] === 'b' && M.bereiche[t[1]]) return seiteBereich(t[1], t[2], t[3]);
    if (t[0] === 'wiederholung' && M.wiederholungSeite) return M.wiederholungSeite(app());
    if (t[0] === 'aufwaermen') return seiteAufwaermen();
    if (t[0] === 'merkblatt' && M.MERKBLATT) return seiteMerkblatt();
    if (t[0] === 'probearbeit') return M.probearbeit ? M.probearbeit(app()) : seiteFolgt('Probearbeit');
    if (t[0] === 'fehler') return M.fehlerFinden ? M.fehlerFinden(app()) : seiteFolgt('Fehler finden');
    return seiteUebersicht();
  }
  root.addEventListener('hashchange', route);
  root.addEventListener('DOMContentLoaded', route);
  ui.route = route;
})(window);
