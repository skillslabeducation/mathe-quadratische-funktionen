/* Register der Lernbereiche (Grundlagen und Themen) und Aufgabenauswahl. */
(function (root) {
  var M = root.M;
  M.bereiche = {};
  M.STUFEN = ['basis', 'standard', 'knobel'];
  M.STUFEN_NAME = { basis: 'Basis', standard: 'Standard', knobel: 'Knobel' };

  /* def: { id, gruppe: 'grundlagen'|'thema', nr, titel, kurz, brauchst?, quellen?, erklaerung?, widget?,
            generatoren: { basis: [fn], standard: [fn], knobel: [fn] } }
     Jeder Generator ist fn(z) mit z = M.Zufall und liefert ein Aufgabenobjekt (siehe README im Ordner tests). */
  M.bereich = function (def) { M.bereiche[def.id] = def; };

  /* ---------- gemeinsame Bausteine für Lösungswege ---------- */
  var Q = M.Q;
  M.g = {};

  /* Einsetzen von x in ein Polynom p (Array von Q), Schritt für Schritt nach Rechenregeln */
  M.g.einsetzen = function (p, x, fname) {
    p = M.P.neu(p); x = Q.aus(x); fname = fname || 'f';
    var xs = M.f.kl(x);
    var teile = [];
    for (var k = p.length - 1; k >= 0; k--) if (!p[k].istNull()) teile.push({ k: k, q: p[k] });
    function vz(i, neg) { return i === 0 ? (neg ? '-' : '') : (neg ? ' - ' : ' + '); }
    var s1 = teile.map(function (t, i) {
      var b = t.q.abs();
      var bt = (b.gleich(1) && t.k > 0) ? '' : M.f.tex(b) + (t.k > 0 ? '\\cdot ' : '');
      var xt = t.k === 2 ? xs + '^2' : (t.k === 1 ? xs : '');
      return vz(i, t.q.vz() < 0) + bt + xt;
    }).join('');
    var x2 = x.mal(x);
    var s2 = teile.map(function (t, i) {
      var b = t.q.abs(), v = vz(i, t.q.vz() < 0);
      if (t.k === 2) return v + (b.gleich(1) ? M.f.tex(x2) : M.f.tex(b) + '\\cdot ' + M.f.tex(x2));
      if (t.k === 1) return v + (b.gleich(1) ? xs : M.f.tex(b) + '\\cdot ' + xs);
      return v + M.f.tex(b);
    }).join('');
    var werte = teile.map(function (t) { return t.q.mal(x.hoch(t.k)); });
    var s3 = werte.map(function (w, i) { return vz(i, w.vz() < 0) + M.f.tex(w.abs()); }).join('');
    var erg = werte.reduce(function (s, w) { return s.plus(w); }, Q(0));
    var weg = [{ text: 'Setze $x = ' + M.f.tex(x) + '$ ein.' + (x.vz() < 0 ? ' Negative Zahlen kommen in Klammern.' : ''), tex: fname + '(' + M.f.tex(x) + ') = ' + s1 }];
    if (p.length > 2) weg.push({ text: 'Zuerst die Potenz: $' + xs + '^2 = ' + M.f.tex(x2) + '$.', tex: '= ' + s2 });
    if (teile.length > 1) weg.push({ text: 'Dann die Punktrechnung (Malnehmen).', tex: '= ' + s3 });
    weg.push({ text: teile.length > 1 ? 'Zum Schluss die Strichrechnung.' : 'Ergebnis:', tex: '= ' + M.f.tex(erg) });
    return { erg: erg, weg: weg };
  };

  /* Summe einzelner Glieder ohne Zusammenfassen: [{c: Zahl, v: 'x^2'|'x'|''}] -> "x^2 + 3x - 2x - 6" */
  M.g.summe = function (glieder) {
    var s = '';
    glieder.forEach(function (gl, i) {
      var c = Q.aus(gl.c);
      if (c.istNull() && glieder.length > 1) return;
      var neg = c.vz() < 0, b = c.abs();
      var zahl = (gl.v && b.gleich(1)) ? '' : M.f.tex(b);
      var teil = zahl + (gl.v || '');
      s += (s === '' ? (neg ? '-' : '') : (neg ? ' - ' : ' + ')) + teil;
    });
    return s || '0';
  };

  /* Ausschnitt für einen Graphen, der alle wichtigen Punkte zeigt */
  M.g.fenster = function (pts, rand) {
    rand = rand === undefined ? 2 : rand;
    var xs = pts.map(function (p) { return Number(p[0]); }).concat([0]);
    var ys = pts.map(function (p) { return Number(p[1]); }).concat([0]);
    return {
      x: [Math.floor(Math.min.apply(null, xs)) - rand, Math.ceil(Math.max.apply(null, xs)) + rand],
      y: [Math.floor(Math.min.apply(null, ys)) - rand, Math.ceil(Math.max.apply(null, ys)) + rand]
    };
  };
  /* Funktion aus Polynom (für Graphen) */
  M.g.fn = function (p) { p = M.P.neu(p); return function (x) { return M.P.wert(p, x); }; };
  /* Punkt als Text für Aufgaben */
  M.g.pt = function (x, y, name) { return M.t.punkt(x, y, name); };

  /* Typische Fehler beim Einsetzen negativer Zahlen */
  M.g.einsetzenFehler = function (p, x) {
    p = M.P.neu(p); x = Q.aus(x);
    var a = M.P.koeff(p, 2), b = M.P.koeff(p, 1), c = M.P.koeff(p, 0);
    var t = [];
    if (x.vz() < 0 && !a.istNull()) {
      t.push({ wert: a.mal(x.mal(x).neg()).plus(b.mal(x)).plus(c), text: 'Achtung beim Quadrat: $' + M.f.kl(x) + '^2 = ' + M.f.tex(x.mal(x)) + '$, nicht $' + M.f.tex(x.mal(x).neg()) + '$. Minus mal Minus ergibt Plus.' });
    }
    if (!a.abs().gleich(1) && !a.istNull()) {
      t.push({ wert: a.mal(x).hoch(2).plus(b.mal(x)).plus(c), text: 'Erst quadrieren, dann mit dem Faktor malnehmen: $' + M.t.koeff(a) + 'x^2$ heißt $' + M.f.tex(a) + '\\cdot x^2$, nicht $(' + M.f.tex(a) + 'x)^2$.' });
    }
    if (x.vz() < 0 && !b.istNull()) {
      t.push({ wert: a.mal(x.mal(x)).plus(b.mal(x.abs())).plus(c), text: 'Prüf das Vorzeichen beim Glied mit $x$: $' + M.f.tex(b) + '\\cdot ' + M.f.kl(x) + ' = ' + M.f.tex(b.mal(x)) + '$.' });
    }
    return t;
  };

  /* Neue Aufgabe erzeugen; vermeidet nach Möglichkeit denselben Generator zweimal hintereinander. */
  M.neueAufgabe = function (bereichId, stufe, z, letzterIndex, festerIndex) {
    var b = M.bereiche[bereichId];
    var liste = b.generatoren[stufe];
    var i = Math.floor(z.next() * liste.length);
    if (liste.length > 1 && i === letzterIndex) i = (i + 1 + Math.floor(z.next() * (liste.length - 1))) % liste.length;
    if (festerIndex !== undefined && liste[festerIndex]) i = festerIndex; // gezielt ein Aufgabentyp (#/b/id/stufe/nr)
    var a = liste[i](z);
    a.bereich = bereichId;
    a.stufe = stufe;
    a.genIndex = i;
    if (!a.typ) a.typ = bereichId + '-' + stufe + '-' + i;
    return a;
  };
})(typeof window !== 'undefined' ? window : globalThis);
