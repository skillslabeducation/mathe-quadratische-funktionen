/* Prüft alle Aufgabengeneratoren: Start mit  node tests/generatoren.test.js  [Anzahl je Generator]
   - Lösung wird von der eigenen Prüfung als richtig erkannt (auch in der verlangten Form)
   - typische Fehler unterscheiden sich von der Lösung
   - ohne Taschenrechner: glatte Zahlen
   - alles TeX lässt sich mit KaTeX setzen
   - der Lösungsweg endet beim Ergebnis */
var path = require('path');
require(path.join(__dirname, 'laden.js'));
var katex = require(path.join(__dirname, '..', 'lib', 'katex', 'katex.min.js'));
var M = globalThis.M, Q = M.Q, P = M.P, f = M.f, t = M.t;

var N = +process.argv[2] || 500;
var fehler = [], warnungen = [];

function zahlEingabe(v) {
  if (v instanceof Q) return v.d === 1 ? String(v.n) : v.n + '/' + v.d;
  return String(v).replace('.', ',');
}
function polyEingabe(p) {
  p = P.neu(p);
  var s = '';
  for (var k = p.length - 1; k >= 0; k--) {
    var c = p[k];
    if (c.istNull()) continue;
    var b = c.abs(), bt = (b.d === 1 ? String(b.n) : '(' + b.n + '/' + b.d + ')');
    var teil = k === 0 ? bt : (b.gleich(1) ? '' : bt) + (k === 2 ? 'x^2' : 'x');
    s += (c.vz() < 0 ? '-' : (s ? '+' : '')) + teil;
  }
  return s || '0';
}
function qText(q) { q = Q.aus(q); return q.d === 1 ? String(q.n) : q.n + '/' + q.d; }
function termEingabe(feld) {
  var l = feld.loesung;
  if (feld.muster) return feld.muster;
  if (typeof l === 'function') {
    if (!feld.muster) throw new Error('Term-Lösung als Funktion braucht feld.muster für den Test');
    return feld.muster;
  }
  var p = P.neu(l);
  var a = P.koeff(p, 2), b = P.koeff(p, 1), c = P.koeff(p, 0);
  if (feld.form === 'spf') {
    var d = b.durch(a.mal(-2)), e = c.minus(a.mal(d).mal(d));
    var at = a.gleich(1) ? '' : (a.gleich(-1) ? '-' : '(' + qText(a) + ')');
    return at + (d.istNull() ? 'x^2' : '(x' + (d.vz() > 0 ? '-' : '+') + qText(d.abs()) + ')^2') + (e.istNull() ? '' : (e.vz() > 0 ? '+' : '-') + qText(e.abs()));
  }
  if (feld.form === 'fakt') {
    // Nullstellen rational bestimmen
    var disk = b.mal(b).minus(a.mal(c).mal(4)), w = disk.wurzel();
    if (!w) throw new Error('faktorisierte Form ohne rationale Nullstellen');
    var x1 = b.neg().plus(w).durch(a.mal(2)), x2 = b.neg().minus(w).durch(a.mal(2));
    var at2 = a.gleich(1) ? '' : (a.gleich(-1) ? '-' : '(' + qText(a) + ')');
    function lin(x) { return x.istNull() ? 'x' : '(x' + (x.vz() > 0 ? '-' : '+') + qText(x.abs()) + ')'; }
    return at2 + lin(x1) + lin(x2);
  }
  if (feld.form === 'quadrat') {
    var k = a.wurzel(), m = b.durch(k.mal(2));
    return '(' + (k.gleich(1) ? '' : qText(k)) + 'x' + (m.vz() > 0 ? '+' : '-') + qText(m.abs()) + ')^2';
  }
  return polyEingabe(p);
}
function mengeEingabe(werte, runden) {
  if (!werte.length) return 'keine Lösung';
  return werte.map(function (v) {
    if (runden !== undefined) return f.runde(Number(v), runden).toString().replace('.', ',');
    return (v instanceof Q) ? qText(v) : String(v).replace('.', ',');
  }).join('; ');
}
function richtigeEingabe(feld) {
  switch (feld.art) {
    case 'zahl': return feld.runden !== undefined ? String(f.runde(Number(feld.loesung), feld.runden)).replace('.', ',') : zahlEingabe(feld.loesung);
    case 'punkt': return '(' + zahlEingabe(feld.runden !== undefined ? f.runde(Number(feld.loesung[0]), feld.runden) : feld.loesung[0]) + '|' + zahlEingabe(feld.runden !== undefined ? f.runde(Number(feld.loesung[1]), feld.runden) : feld.loesung[1]) + ')';
    case 'menge': return mengeEingabe(feld.loesung, feld.runden);
    case 'punkte':
      if (!feld.loesung.length) return 'keine Schnittpunkte';
      return feld.loesung.map(function (p) {
        var r = function (v) { return feld.runden !== undefined ? String(f.runde(Number(v), feld.runden)).replace('.', ',') : zahlEingabe(v); };
        return '(' + r(p[0]) + '|' + r(p[1]) + ')';
      }).join('; ');
    case 'term': return termEingabe(feld);
    case 'mc': return feld.loesung;
  }
  return null;
}

function glatt(v) {
  if (v instanceof Q) return v.d <= 12;
  var w = Number(v);
  if (!isFinite(w)) return false;
  try { var q = Q.aus(w); return q.d <= 12; } catch (e) { return false; }
}

function texe(a) { // alle TeX-Schnipsel einer Aufgabe
  var s = [];
  function aus(str) { if (!str) return; String(str).replace(/\$\$([\s\S]+?)\$\$/g, function (m, x) { s.push(x); return ''; }).replace(/\$([^$]+?)\$/g, function (m, x) { s.push(x); return ''; }); }
  aus(a.text); if (a.formel) s.push(a.formel);
  (a.tipps || []).forEach(aus);
  (a.weg || []).forEach(function (w) { aus(w.text); if (w.tex) s.push(w.tex); });
  a.felder.forEach(function (fd) {
    aus(fd.label); aus(fd.vor); aus(fd.nach);
    (fd.typisch || []).forEach(function (ty) { if (Array.isArray(ty)) ty.forEach(function (u) { aus(u.text); }); else aus(ty.text); });
    (fd.optionen || []).forEach(function (o) { if (o.tex) s.push(o.tex); aus(o.html); aus(o.warum); });
  });
  return s;
}

function pruefeAufgabe(a, wo) {
  if (!a.felder || !a.felder.length) return fehler.push(wo + ': keine Felder');
  if (!a.tipps || a.tipps.length < 2) warnungen.push(wo + ': weniger als 2 Tipps');
  if (!a.weg || !a.weg.length) fehler.push(wo + ': kein Lösungsweg');
  texe(a).forEach(function (x) {
    try { katex.renderToString(x, { throwOnError: true, strict: false }); }
    catch (e) { fehler.push(wo + ': TeX-Fehler in "' + x + '": ' + e.message.split('\n')[0]); }
  });
  a.felder.forEach(function (feld, i) {
    var w = wo + ' Feld ' + i + ' (' + feld.art + ')';
    if (feld.art === 'tabelle') {
      feld.loesung.forEach(function (v) { if (!a.tr && !glatt(v)) fehler.push(w + ': Tabellenwert nicht glatt ' + v); });
      return;
    }
    if (feld.art === 'klick') {
      var gx = feld.graph.x, gy = feld.graph.y, l = feld.loesung;
      if (l[0] < gx[0] || l[0] > gx[1] || l[1] < gy[0] || l[1] > gy[1]) fehler.push(w + ': Lösungspunkt außerhalb des Koordinatensystems ' + l);
      if (!M.pruefe({ art: 'punkt', loesung: l }, '(' + l[0] + '|' + l[1] + ')').ok) fehler.push(w + ': Punktprüfung schlägt fehl');
      return;
    }
    if (feld.art === 'regler') {
      if (feld.ziel.a === 0) fehler.push(w + ': a = 0');
      return;
    }
    if (feld.art === 'mc') {
      if (feld.loesung < 0 || feld.loesung >= feld.optionen.length) fehler.push(w + ': MC-Lösung außerhalb');
      var texte = feld.optionen.map(function (o) { return o.tex || o.html || JSON.stringify(o.graph && o.graph.kurven ? o.id : o); });
      var doppelt = texte.filter(function (x, k) { return texte.indexOf(x) !== k; });
      if (doppelt.length) fehler.push(w + ': doppelte MC-Optionen ' + doppelt.join(', '));
      return;
    }
    var eingabe;
    try { eingabe = richtigeEingabe(feld); } catch (e) { return fehler.push(w + ': ' + e.message); }
    var r = M.pruefe(feld, eingabe);
    if (!r.ok) fehler.push(w + ': richtige Eingabe "' + eingabe + '" nicht akzeptiert: ' + JSON.stringify(r) + ' | ' + a.formel + ' | ' + a.text);
    // glatte Zahlen ohne Taschenrechner
    if (!a.tr) {
      var werte = feld.art === 'zahl' ? [feld.loesung] : (feld.art === 'punkt' ? feld.loesung : (feld.art === 'menge' && !feld.wurzel && feld.toleranz === undefined ? feld.loesung :
        (feld.art === 'punkte' ? [].concat.apply([], feld.loesung) : [])));
      werte.forEach(function (v) { if (!glatt(v)) fehler.push(w + ': nicht glatt ohne Taschenrechner: ' + v + ' | ' + a.formel); });
    }
    // Lösung darf nicht gleichzeitig typischer Fehler sein
    (feld.art === 'punkte' ? [] : (feld.typisch || [])).forEach(function (ty) {
      var r2 = M.pruefe(feld, feld.art === 'term' ? (Array.isArray(ty.wert) ? polyEingabe(ty.wert) : null) : (feld.art === 'menge' ? mengeEingabe(ty.wert, feld.runden) : (feld.art === 'punkt' ? '(' + zahlEingabe(ty.wert[0]) + '|' + zahlEingabe(ty.wert[1]) + ')' : zahlEingabe(ty.wert))));
      if (r2.ok && feld.art !== 'term') warnungen.push(w + ': typischer Fehler ist gleich der Lösung (' + ty.text.slice(0, 40) + '…)');
    });
  });
  // Lösungsweg endet beim Ergebnis (für Aufgaben mit einem Feld)
  if (a.felder.length === 1 && a.weg && a.weg.length) {
    var feld = a.felder[0], letzte = a.weg[a.weg.length - 1].tex || a.weg[a.weg.length - 1].text || '';
    var ziel = null;
    if (feld.art === 'zahl' && feld.runden === undefined) ziel = f.tex(Q.aus(Number(feld.loesung)));
    if (feld.art === 'menge' && !feld.runden && !feld.wurzel) ziel = t.menge(feld.loesung.map(function (v) { return Q.aus(Number(v)); }));
    if (feld.art === 'term' && Array.isArray(feld.loesung) && (feld.form === 'allg' || !feld.form)) ziel = t.poly(feld.loesung);
    if (ziel && letzte.indexOf(ziel) < 0) fehler.push(wo + ': Lösungsweg endet nicht bei "' + ziel + '", sondern: "' + letzte + '"');
  }
}

var anzahl = 0;
Object.keys(M.bereiche).forEach(function (id) {
  var b = M.bereiche[id];
  if (b.erklaerung) {
    String(b.erklaerung).replace(/\$\$([\s\S]+?)\$\$/g, function (m, x) { try { katex.renderToString(x, { throwOnError: true }); } catch (e) { fehler.push(id + ' Erklärung: ' + e.message.split('\n')[0]); } return ''; })
      .replace(/\$([^$]+?)\$/g, function (m, x) { try { katex.renderToString(x, { throwOnError: true }); } catch (e) { fehler.push(id + ' Erklärung: ' + e.message.split('\n')[0]); } return ''; });
  }
  M.STUFEN.forEach(function (stufe) {
    b.generatoren[stufe].forEach(function (gen, gi) {
      var z = new M.Zufall(1000 + gi * 7919 + stufe.length * 31);
      for (var i = 0; i < N; i++) {
        var a;
        var wo = id + '/' + stufe + '/' + gi + ' #' + i;
        try { a = gen(z); a.stufe = stufe; } catch (e) { fehler.push(wo + ': Generator wirft ' + e.stack.split('\n').slice(0, 3).join(' ')); continue; }
        anzahl++;
        try { pruefeAufgabe(a, wo + ' [' + (a.typ || '') + ']'); } catch (e) { fehler.push(wo + ': Prüfung wirft ' + e.stack.split('\n').slice(0, 3).join(' ')); }
      }
    });
  });
});

/* gleichartige Meldungen zusammenfassen */
function zusammenfassen(liste) {
  var gruppen = {};
  liste.forEach(function (m) {
    var k = m.replace(/ #\d+/, '').replace(/"[^"]*"/g, '"…"').slice(0, 120);
    (gruppen[k] = gruppen[k] || []).push(m);
  });
  return Object.keys(gruppen).map(function (k) { return gruppen[k].length + '× ' + gruppen[k][0]; });
}
console.log(anzahl + ' Aufgaben erzeugt und geprüft (' + Object.keys(M.bereiche).length + ' Bereiche).');
if (warnungen.length && process.argv.indexOf('--warnungen') >= 0) { console.log('\nWarnungen (' + warnungen.length + '):'); zusammenfassen(warnungen).slice(0, 30).forEach(function (m) { console.log('  ' + m); }); }
if (fehler.length) {
  console.log('\nFEHLER (' + fehler.length + '):');
  zusammenfassen(fehler).slice(0, 40).forEach(function (m) { console.log('  ' + m); });
  process.exit(1);
}
console.log('Alle Generatoren in Ordnung.');

/* Merkblatt-TeX prüfen */
if (M.MERKBLATT) {
  var mfehler = 0;
  M.MERKBLATT.replace(/\$\$([\s\S]+?)\$\$/g, function (m, x) { try { katex.renderToString(x, { throwOnError: true }); } catch (e) { mfehler++; console.log('Merkblatt TeX-Fehler: ' + e.message.split('\n')[0]); } return ''; })
    .replace(/\$([^$]+?)\$/g, function (m, x) { try { katex.renderToString(x, { throwOnError: true }); } catch (e) { mfehler++; console.log('Merkblatt TeX-Fehler: ' + e.message.split('\n')[0]); } return ''; });
  if (mfehler) process.exit(1);
  console.log('Merkblatt: TeX in Ordnung.');
}

/* „Fehler finden“ prüfen */
if (M.FEHLER) {
  var ffehler = [];
  M.FEHLER.forEach(function (gen, gi) {
    var z = new M.Zufall(4242 + gi);
    for (var i = 0; i < N; i++) {
      var a = gen.fn(z), wo = 'Fehler finden #' + gi + ' (' + a.titel + ')';
      if (!(a.fehler >= 0 && a.fehler < a.zeilen.length)) ffehler.push(wo + ': Fehlerindex außerhalb');
      if (a.zeilen[a.fehler] === a.richtig) ffehler.push(wo + ': falsche Zeile = richtige Zeile: ' + a.richtig);
      var alle = a.zeilen.concat([a.richtig]);
      [a.aufgabe, a.warum].forEach(function (s) { String(s).replace(/\$([^$]+?)\$/g, function (m, x) { alle.push(x); return ''; }); });
      alle.forEach(function (x) { try { katex.renderToString(x, { throwOnError: true }); } catch (e) { ffehler.push(wo + ': TeX-Fehler in "' + x + '": ' + e.message.split('\n')[0]); } });
    }
  });
  if (ffehler.length) { console.log('\nFEHLER Fehler finden (' + ffehler.length + '):'); zusammenfassen(ffehler).slice(0, 20).forEach(function (m) { console.log('  ' + m); }); process.exit(1); }
  console.log('Fehler finden: ' + M.FEHLER.length + ' Vorlagen je ' + N + '-mal geprüft, in Ordnung.');
}

/* Wiederholungsblatt: Originalaufgaben gegen von Hand gerechnete Ergebnisse prüfen */
if (M.WIEDERHOLUNG) {
  var wfehler = [];
  var ERWARTET = {
    1: [1, 0],
    2: ['-2; 2'],
    3: [0],
    4: ['(-3|-3)', '(1|2)', '(4|-6)', '(-2|1)'],
    5: ['8; -8', '±20', '0,3; -0,3'],
    6: ['-1; -11', '6; -2'],
    7: ['12; -15'],
    8: ['(x-2)^2+1', '(2|1)', '(x+3)^2-5', '(-3|-5)', '(x-2,5)^2-6', '(2,5|-6)', '(x-4)^2', '(4|0)'],
    9: ['(0|73)', '-90; 90', '-73/8100', '-0,009x^2+73'],
    10: ['0; -7', '0; 6', '0; 8', '0; 2'],
    11: ['-4', '-0,5; -3,5'],
    12: ['18; -17'],
    13: ['6'],
    14: ['(5|-7)', 0, '(-2|-8)', 1, '(4|-5)', 2],
    15: ['20; 21']
  };
  M.WIEDERHOLUNG.forEach(function (w) {
    var a = w.gen(new M.Zufall(1), true), wo = 'Wiederholungsblatt Nr. ' + w.nr + ' (Original)';
    pruefeAufgabe(a, wo);
    var e = ERWARTET[w.nr];
    if (!e || e.length !== a.felder.length) { wfehler.push(wo + ': erwartet ' + (e ? e.length : 0) + ' Felder, hat ' + a.felder.length); return; }
    a.felder.forEach(function (feld, i) {
      var r = M.pruefe(feld, e[i]);
      if (!r.ok) wfehler.push(wo + ' Feld ' + i + ': "' + e[i] + '" nicht akzeptiert: ' + JSON.stringify(r));
    });
  });
  // ungenau gerundete Bogengleichung darf nicht durchgehen
  var bogen = M.WIEDERHOLUNG[8].gen(new M.Zufall(1), true);
  if (M.pruefe(bogen.felder[3], '-0,01x^2+73').ok) wfehler.push('Nr. 9: -0,01x^2+73 wird fälschlich akzeptiert');
  if (wfehler.length) { console.log('\nFEHLER Wiederholungsblatt:'); wfehler.forEach(function (m) { console.log('  ' + m); }); process.exit(1); }
  console.log('Wiederholungsblatt: alle 15 Originalaufgaben mit den erwarteten Ergebnissen geprüft, in Ordnung.');
}
