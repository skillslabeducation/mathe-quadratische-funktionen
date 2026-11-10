/* Lernprotokoll: wann, wo und wie lange geübt wurde, mit Ergebnissen.
   Gespeichert im Browser des Lerngeräts (localStorage), unabhängig vom Fortschritt.
   Ansicht: index.html#/protokoll (nicht verlinkt). */
(function (root) {
  var M = root.M, doc = root.document;
  var SCHLUESSEL = 'mathe9-protokoll-v1';
  var TAKT = 15;                 // Sekunden je Zeitmessung
  var LEERLAUF = 120;            // ohne Eingabe länger als 2 Minuten: Zeit zählt nicht
  var MAX_EREIGNISSE = 4000;
  var daten = null, bereich = 'start', letzteAktivitaet = Date.now();

  function laden() {
    if (daten) return daten;
    try { daten = JSON.parse(root.localStorage.getItem(SCHLUESSEL) || 'null'); } catch (e) { daten = null; }
    if (!daten || !daten.zeit) daten = { zeit: {}, ereignisse: [] };
    return daten;
  }
  function speichern() {
    try { root.localStorage.setItem(SCHLUESSEL, JSON.stringify(daten)); } catch (e) { /* ohne Speicher weiter */ }
  }
  function tag(ms) {
    var d = new Date(ms || Date.now());
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function ereignis(e) {
    var d = laden();
    e.t = Date.now();
    d.ereignisse.push(e);
    if (d.ereignisse.length > MAX_EREIGNISSE) d.ereignisse = d.ereignisse.slice(-MAX_EREIGNISSE);
    speichern();
  }

  /* aktive Lernzeit messen */
  function aktiv() { letzteAktivitaet = Date.now(); }
  ['keydown', 'click', 'input', 'scroll', 'touchstart'].forEach(function (ev) { root.addEventListener(ev, aktiv, { passive: true, capture: true }); });
  var letzteBewegung = 0;
  root.addEventListener('mousemove', function () { var n = Date.now(); if (n - letzteBewegung > 5000) { letzteBewegung = n; aktiv(); } }, { passive: true });
  setInterval(function () {
    if (doc.visibilityState !== 'visible') return;
    if (Date.now() - letzteAktivitaet > LEERLAUF * 1000) return;
    if (bereich === 'protokoll') return;
    var d = laden(), heute = tag();
    d.zeit[heute] = d.zeit[heute] || {};
    d.zeit[heute][bereich] = (d.zeit[heute][bereich] || 0) + TAKT;
    speichern();
  }, TAKT * 1000);

  /* Seitenwechsel: Bereich merken, Aufruf protokollieren */
  function seite(schluessel) {
    if (schluessel === bereich) return;
    bereich = schluessel;
    aktiv();
    if (schluessel !== 'protokoll') ereignis({ art: 'seite', b: schluessel });
  }

  function aufgabe(a, richtig, hilfen) {
    ereignis({ art: 'aufgabe', b: a.bereich, s: a.stufe, typ: a.typ, ok: richtig ? 1 : 0, t1: hilfen.tipp1 ? 1 : 0, t2: hilfen.tipp2 ? 1 : 0, w: hilfen.weg ? 1 : 0, sek: hilfen.sek });
  }
  function probearbeit(e) { ereignis({ art: 'probearbeit', min: e.minuten, p: e.punkte, max: e.max, proz: e.prozent }); }
  function fehler(titel, erster) { ereignis({ art: 'fehler', titel: titel, ok: erster ? 1 : 0 }); }

  /* ---------- Ansicht ---------- */
  var NAMEN = { start: 'Übersicht', aufwaermen: 'Aufwärmen', probearbeit: 'Probearbeit', fehler: 'Fehler finden', merkblatt: 'Merkblatt', wiederholung: 'Wiederholungsblatt' };
  function name(b) {
    if (NAMEN[b]) return NAMEN[b];
    var t = (M.THEMEN || []).filter(function (x) { return x.id === b; })[0];
    if (t) return 'Thema ' + t.nr + ': ' + t.titel;
    if (M.bereiche && M.bereiche[b]) return 'Grundlage: ' + M.bereiche[b].titel;
    return b;
  }
  function dauer(sek) {
    var m = Math.round(sek / 60);
    if (m < 1) return sek > 0 ? '< 1 min' : '–';
    return m >= 60 ? Math.floor(m / 60) + ' h ' + (m % 60) + ' min' : m + ' min';
  }
  function uhrzeit(ms) { var d = new Date(ms); return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }); }
  function datumLang(t) { var p = t.split('-'); var d = new Date(+p[0], +p[1] - 1, +p[2]); return d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' }); }

  function ansicht(app) {
    var esc = M.ui.esc, d = laden();
    doc.title = 'Lernprotokoll';
    var tage = {};
    Object.keys(d.zeit).forEach(function (t) { tage[t] = tage[t] || { zeit: d.zeit[t], aufg: 0, ok: 0, hilfe: 0, pa: [] }; });
    d.ereignisse.forEach(function (e) {
      var t = tag(e.t);
      tage[t] = tage[t] || { zeit: d.zeit[t] || {}, aufg: 0, ok: 0, hilfe: 0, pa: [] };
      if (e.art === 'aufgabe') { tage[t].aufg++; tage[t].ok += e.ok; if (e.t1 || e.t2 || e.w) tage[t].hilfe++; }
      if (e.art === 'probearbeit') tage[t].pa.push(e.proz + ' %');
    });
    var h = ['<nav class="kopfnav"><a href="#/" class="zurueck">← Übersicht</a></nav>',
      '<header class="seitenkopf"><p class="kicker">Nur für Eltern</p><h1>Lernprotokoll</h1>',
      '<p class="unterzeile">Gespeichert auf diesem Gerät, in diesem Browser. Lernzeit zählt nur, solange die Seite offen ist und in den letzten zwei Minuten etwas eingegeben oder geklickt wurde.</p></header>'];
    var tagListe = Object.keys(tage).sort().reverse();
    if (!tagListe.length) {
      h.push('<div class="karte"><p>Noch keine Einträge.</p></div>');
      app.innerHTML = h.join('');
      return;
    }
    // Tagesübersicht
    h.push('<section><h2>Pro Tag</h2><div class="tabelle-wrap"><table class="verlauf"><tr><th>Datum</th><th>Lernzeit</th><th>Aufgaben</th><th>davon richtig</th><th>mit Hilfe</th><th>Probearbeit</th><th>Wo am längsten</th></tr>');
    tagListe.forEach(function (t) {
      var x = tage[t], summe = 0, top = [];
      Object.keys(x.zeit || {}).forEach(function (b) { summe += x.zeit[b]; top.push([b, x.zeit[b]]); });
      top.sort(function (a, b) { return b[1] - a[1]; });
      h.push('<tr><td>' + esc(datumLang(t)) + '</td><td><strong>' + dauer(summe) + '</strong></td><td>' + x.aufg + '</td><td>' + (x.aufg ? x.ok + ' (' + Math.round(100 * x.ok / x.aufg) + ' %)' : '–') + '</td><td>' + (x.aufg ? x.hilfe : '–') + '</td><td>' + (x.pa.join(', ') || '–') + '</td><td>' +
        top.slice(0, 3).map(function (p) { return esc(name(p[0])) + ' (' + dauer(p[1]) + ')'; }).join('<br>') + '</td></tr>');
    });
    h.push('</table></div></section>');
    // pro Bereich gesamt
    var proB = {};
    Object.keys(d.zeit).forEach(function (t) { Object.keys(d.zeit[t]).forEach(function (b) { proB[b] = proB[b] || { sek: 0, aufg: 0, ok: 0, hilfe: 0 }; proB[b].sek += d.zeit[t][b]; }); });
    d.ereignisse.forEach(function (e) { if (e.art !== 'aufgabe') return; var b = proB[e.b] = proB[e.b] || { sek: 0, aufg: 0, ok: 0, hilfe: 0 }; b.aufg++; b.ok += e.ok; if (e.t1 || e.t2 || e.w) b.hilfe++; });
    h.push('<section><h2>Pro Thema (gesamt)</h2><div class="tabelle-wrap"><table class="verlauf"><tr><th>Bereich</th><th>Lernzeit</th><th>Aufgaben</th><th>richtig</th><th>mit Hilfe</th></tr>');
    Object.keys(proB).sort(function (a, b) { return proB[b].sek - proB[a].sek; }).forEach(function (b) {
      var x = proB[b];
      h.push('<tr><td>' + esc(name(b)) + '</td><td>' + dauer(x.sek) + '</td><td>' + (x.aufg || '–') + '</td><td>' + (x.aufg ? Math.round(100 * x.ok / x.aufg) + ' %' : '–') + '</td><td>' + (x.aufg ? x.hilfe : '–') + '</td></tr>');
    });
    h.push('</table></div></section>');
    // Verlauf
    h.push('<section><h2>Verlauf (neueste zuerst)</h2><div class="tabelle-wrap"><table class="verlauf"><tr><th>Zeit</th><th>Was</th></tr>');
    d.ereignisse.slice(-300).reverse().forEach(function (e) {
      var was;
      if (e.art === 'seite') was = 'öffnet ' + esc(name(e.b));
      else if (e.art === 'aufgabe') was = (e.ok ? '✓ ' : '✗ ') + esc(name(e.b)) + ', ' + (M.STUFEN_NAME[e.s] || e.s) + (e.t1 || e.t2 || e.w ? ' (' + [e.t1 ? 'Tipp 1' : '', e.t2 ? 'Tipp 2' : '', e.w ? 'Lösungsweg' : ''].filter(Boolean).join(', ') + ')' : '') + (e.sek ? ', ' + (e.sek < 60 ? e.sek + ' s' : Math.round(e.sek / 60) + ' min') : '');
      else if (e.art === 'probearbeit') was = '<strong>Probearbeit ' + e.min + ' min: ' + e.proz + ' %</strong> (' + String(e.p).replace('.', ',') + ' von ' + e.max + ' Punkten)';
      else if (e.art === 'fehler') was = (e.ok ? '✓ ' : '✗ ') + 'Fehler finden: ' + esc(e.titel);
      else was = esc(e.art);
      h.push('<tr><td>' + esc(datumLang(tag(e.t))) + ' ' + uhrzeit(e.t) + '</td><td>' + was + '</td></tr>');
    });
    h.push('</table></div></section>');
    h.push('<p><button type="button" class="knopf" id="csv">Als Datei speichern (CSV)</button> <button type="button" class="knopf leise-knopf" id="loeschen">Protokoll löschen</button></p>');
    app.innerHTML = h.join('');
    doc.getElementById('csv').addEventListener('click', function () {
      var zeilen = [['Datum', 'Uhrzeit', 'Art', 'Bereich', 'Stufe', 'Richtig', 'Tipp 1', 'Tipp 2', 'Lösungsweg', 'Sekunden', 'Info'].join(';')];
      d.ereignisse.forEach(function (e) {
        zeilen.push([tag(e.t), uhrzeit(e.t), e.art, name(e.b || ''), e.s || '', e.ok === undefined ? '' : e.ok, e.t1 || '', e.t2 || '', e.w || '', e.sek || '',
          e.art === 'probearbeit' ? e.proz + ' %' : (e.titel || '')].map(function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(';'));
      });
      zeilen.push('');
      zeilen.push('"Lernzeit pro Tag und Bereich (Minuten)"');
      Object.keys(d.zeit).sort().forEach(function (t) { Object.keys(d.zeit[t]).forEach(function (b) { zeilen.push('"' + t + '";"' + name(b) + '";' + Math.round(d.zeit[t][b] / 6) / 10); }); });
      var blob = new Blob(['﻿' + zeilen.join('\r\n')], { type: 'text/csv;charset=utf-8' });
      var a = doc.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = 'lernprotokoll-' + tag() + '.csv';
      doc.body.appendChild(a); a.click(); a.remove();
    });
    doc.getElementById('loeschen').addEventListener('click', function () {
      if (root.confirm('Das ganze Lernprotokoll auf diesem Gerät löschen?')) { daten = { zeit: {}, ereignisse: [] }; speichern(); ansicht(app); }
    });
  }

  M.protokoll = { seite: seite, aufgabe: aufgabe, probearbeit: probearbeit, fehler: fehler, ansicht: ansicht };
})(window);
