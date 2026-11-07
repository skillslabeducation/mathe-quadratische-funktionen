/* Terme: Polynome mit Bruch-Koeffizienten und TeX-Darstellung im Buchstil.
   Ein Polynom ist ein Array von Q: p[0] = Absolutglied, p[1] = Faktor vor x, p[2] = vor x². */
(function (root) {
  var M = root.M;
  var Q = M.Q, f = M.f;

  function P(arr) { // Normalisieren: Zahlen -> Q, führende Nullen entfernen
    var p = arr.map(function (c) { return Q.aus(c); });
    while (p.length > 1 && p[p.length - 1].istNull()) p.pop();
    return p;
  }
  function koeff(p, k) { return p[k] || Q(0); }
  function plus(p, q) {
    var n = Math.max(p.length, q.length), r = [];
    for (var i = 0; i < n; i++) r.push(koeff(p, i).plus(koeff(q, i)));
    return P(r);
  }
  function minus(p, q) { return plus(p, mal(q, [Q(-1)])); }
  function mal(p, q) {
    p = P(p); q = P(q);
    var r = [];
    for (var i = 0; i < p.length + q.length - 1; i++) r.push(Q(0));
    for (var a = 0; a < p.length; a++)
      for (var b = 0; b < q.length; b++) r[a + b] = r[a + b].plus(p[a].mal(q[b]));
    return P(r);
  }
  function skal(p, k) { return mal(p, [Q.aus(k)]); }
  function wert(p, x) { // numerisch
    var s = 0;
    for (var i = p.length - 1; i >= 0; i--) s = s * x + p[i].wert();
    return s;
  }
  function wertQ(p, x) { // exakt
    x = Q.aus(x);
    var s = Q(0);
    for (var i = p.length - 1; i >= 0; i--) s = s.mal(x).plus(p[i]);
    return s;
  }
  function gleich(p, q) {
    p = P(p); q = P(q);
    if (p.length !== q.length) return false;
    for (var i = 0; i < p.length; i++) if (!p[i].gleich(q[i])) return false;
    return true;
  }
  /* a·(x − d)² + e */
  function ausScheitel(a, d, e) {
    var lin = [Q.aus(d).neg(), Q(1)]; // x − d
    return plus(skal(mal(lin, lin), a), [Q.aus(e)]);
  }
  /* a·(x − x1)·(x − x2) */
  function ausNullstellen(a, x1, x2) {
    return skal(mal([Q.aus(x1).neg(), Q(1)], [Q.aus(x2).neg(), Q(1)]), a);
  }

  /* ---------- TeX ---------- */
  /* Koeffizient vor einer Variablen: 1 -> "", -1 -> "-", 0,5 -> "0{,}5" */
  function koeffTex(c) {
    c = Q.aus(c);
    if (c.gleich(1)) return '';
    if (c.gleich(-1)) return '-';
    return f.tex(c);
  }
  /* Polynom als TeX, z. B. "-0{,}5x^2 + 2x - 1" (Variable wählbar) */
  function polyTex(p, v) {
    v = v || 'x';
    p = P(p);
    var teile = [];
    for (var k = p.length - 1; k >= 0; k--) {
      var c = p[k];
      if (c.istNull()) continue;
      var pot = k === 0 ? '' : (k === 1 ? v : v + '^' + k);
      var betrag = c.abs();
      var s;
      if (k === 0) s = f.tex(betrag);
      else s = (betrag.gleich(1) ? '' : f.tex(betrag)) + pot;
      if (teile.length === 0) teile.push((c.vz() < 0 ? '-' : '') + s);
      else teile.push((c.vz() < 0 ? ' - ' : ' + ') + s);
    }
    return teile.length ? teile.join('') : '0';
  }
  /* (x - d) bzw. (x + 3) bzw. x */
  function linTex(d, v) {
    v = v || 'x';
    d = Q.aus(d);
    if (d.istNull()) return v;
    return '(' + v + (d.vz() > 0 ? ' - ' : ' + ') + f.tex(d.abs()) + ')';
  }
  function faktorTex(a, folgtKlammer) {
    a = Q.aus(a);
    if (a.gleich(1)) return '';
    if (a.gleich(-1)) return '-';
    return f.tex(a) + (folgtKlammer ? '\\cdot ' : '');
  }
  /* Scheitelpunktform a·(x − d)² + e */
  function spfTex(a, d, e, v) {
    d = Q.aus(d); e = Q.aus(e);
    var quad = d.istNull() ? (v || 'x') + '^2' : linTex(d, v) + '^2';
    var s = faktorTex(a, !d.istNull()) + quad;
    if (!e.istNull()) s += (e.vz() > 0 ? ' + ' : ' - ') + f.tex(e.abs());
    return s;
  }
  /* faktorisierte Form a·(x − x1)·(x − x2) */
  function faktTex(a, x1, x2, v) {
    var l1 = linTex(x1, v), l2 = linTex(x2, v);
    var s = faktorTex(a, l1.charAt(0) === '(') + l1;
    return s + (l2.charAt(0) === '(' ? '\\cdot ' : '\\cdot ') + l2;
  }
  /* Punkt (x|y) */
  function punktTex(x, y, name) {
    return (name || '') + '(' + f.tex(Q.aus(x)) + '\\,|\\,' + f.tex(Q.aus(y)) + ')';
  }
  /* Lösungsmenge 𝕃 = {−3; 2} (sortiert), wie im Buch mit Semikolon */
  function mengeTex(werte) {
    if (!werte.length) return '\\mathbb{L} = \\{\\,\\}';
    var w = werte.some(function (x) { return typeof x === 'string'; }) ? werte.slice()
      : werte.slice().sort(function (a, b) { return a.valueOf() - b.valueOf(); });
    return '\\mathbb{L} = \\{' + w.map(function (x) { return typeof x === 'string' ? x : f.tex(x); }).join(';\\ ') + '\\}';
  }

  M.P = {
    neu: P, plus: plus, minus: minus, mal: mal, skal: skal, wert: wert, wertQ: wertQ, gleich: gleich,
    koeff: koeff, ausScheitel: ausScheitel, ausNullstellen: ausNullstellen
  };
  M.t = {
    poly: polyTex, lin: linTex, spf: spfTex, fakt: faktTex, punkt: punktTex, menge: mengeTex, koeff: koeffTex
  };
})(typeof window !== 'undefined' ? window : globalThis);
