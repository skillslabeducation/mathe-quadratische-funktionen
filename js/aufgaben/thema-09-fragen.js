/* Thema 9: Typische Fragen an Funktionen (Buch S. 101–103, S. 76 Nr. 6, 7, 9, AH S. 46). */
(function (root) {
  var M = root.M, Q = M.Q, P = M.P, f = M.f, t = M.t, g = M.g;

  function paar(z, max) {
    var a, b;
    do { a = z.int(-max, max); b = z.int(-max, max); } while (a >= b || (a + b) % 2 !== 0);
    return [a, b];
  }
  function hochTief(a) {
    return { art: 'mc', label: 'Art des Scheitelpunkts:', loesung: Q.aus(a).vz() < 0 ? 0 : 1, optionen: [
      { html: 'Hochpunkt (Maximum)', warum: 'Bei $a > 0$ ist die Parabel nach oben geöffnet: Tiefpunkt.' },
      { html: 'Tiefpunkt (Minimum)', warum: 'Bei $a < 0$ ist die Parabel nach unten geöffnet: Hochpunkt.' }] };
  }

  /* B1: Funktionswert (y-Wert gesucht) */
  function funktionswert(z) {
    var a = Q.aus(z.wahl([1, -1, 2, -2, Q(1, 2), Q(-1, 2), 3])), b = Q(z.int(-6, 6)), c = Q(z.int(-9, 9));
    var p = [c, b, a], x = Q(z.nz(-4, 4));
    if (!P.wertQ(p, x).istGlatt()) x = Q(2 * x.wert());
    var e = g.einsetzen(p, x);
    return {
      typ: 'funktionswert', tr: false, text: 'Berechne den Funktionswert $f(' + f.tex(x) + ')$ für $f(x) = ' + t.poly(p) + '$.',
      felder: [{ art: 'zahl', vor: '$f(' + f.tex(x) + ') =$', loesung: e.erg, typisch: g.einsetzenFehler(p, x) }],
      tipps: ['y-Wert gesucht: x-Wert einsetzen.', 'Negative Zahlen in Klammern, erst Potenz, dann Punkt, dann Strich.'],
      weg: e.weg, grundlage: 'rechenregeln'
    };
  }

  /* B2: Schnittpunkt mit der y-Achse */
  function yAchse(z) {
    var art = z.int(0, 1), a = Q.aus(z.wahl([1, -1, 2, -2, Q(1, 2), 3])), formel, p, typ;
    if (art === 0) { var d = z.nz(-4, 4), e = z.int(-6, 6); p = P.ausScheitel(a, d, e); formel = t.spf(a, d, e); typ = [{ wert: [0, e], text: '$e$ ist die y-Koordinate des Scheitelpunkts, nicht der y-Achsenabschnitt. Setz $x = 0$ ein.' }]; }
    else { var x1 = z.nz(-5, 5), x2 = z.nz(-5, 5); p = P.ausNullstellen(a, x1, x2); formel = t.fakt(a, x1, x2); typ = [{ wert: [0, x1 * x2], text: 'Den Faktor $a = ' + f.tex(a) + '$ nicht vergessen.' }, { wert: [0, P.wertQ(p, 0).neg()], text: 'Vorzeichen prüfen: $(0 - ' + f.kl(x1) + ')\\cdot(0 - ' + f.kl(x2) + ')$.' }]; }
    var c = P.wertQ(p, 0);
    return {
      typ: 'yachse', tr: false, text: 'Wo schneidet der Graph von $f(x) = ' + formel + '$ die y-Achse?',
      felder: [{ art: 'punkt', loesung: [0, c], typisch: typ }],
      tipps: ['Auf der y-Achse ist $x = 0$. Berechne $f(0)$.', 'Der Schnittpunkt heißt $(0|f(0))$.'],
      weg: [{ text: '$x = 0$ einsetzen:', tex: 'f(0) = ' + formel.replace(/x/g, '(0)').replace(/\(\(0\) /g, '(0 ') + ' = ' + f.tex(c) }, { tex: t.punkt(0, c) }]
    };
  }

  /* S1: x-Wert gesucht (AH S. 46 Nr. 1) */
  function xWert(z) {
    var art = z.int(0, 1), formel, k, loes, weg;
    if (art === 0) {
      var a = z.wahl([1, 2, -1]), d = z.nz(-5, 5), e = z.int(-6, 6), r = z.int(1, 6);
      k = e + a * r * r; formel = t.spf(a, d, e); loes = [d - r, d + r];
      weg = [{ text: 'Gleichung aufstellen:', tex: formel + ' = ' + k }, { text: 'Umformen:', tex: t.lin(d) + '^2 = ' + (r * r) }, { text: 'Wurzel ziehen:', tex: 'x - ' + f.kl(d) + ' = \\pm ' + r }, { tex: t.menge(loes) }];
    } else {
      var xs = paar(z, 6), m = z.int(-5, 5);
      var p = P.ausNullstellen(1, xs[0], xs[1]); k = m;
      var fp = P.plus(p, [Q(m)]); formel = t.poly(fp); loes = xs;
      weg = [{ text: 'Gleichung aufstellen:', tex: formel + ' = ' + m }, { text: 'Alles auf eine Seite:', tex: t.poly(p) + ' = 0' }].concat(g.pqWeg(p[1], p[0]).weg);
    }
    return {
      typ: 'xwert', tr: false, text: 'Für welche x-Werte gilt $f(x) = ' + k + '$? Dabei ist $f(x) = ' + formel + '$.',
      felder: [{ art: 'menge', loesung: loes, typisch: [{ wert: [loes[1]], text: 'Es gibt zwei x-Werte mit diesem Funktionswert (Symmetrie).' }] }],
      tipps: ['x-Wert gesucht: Setz $f(x) = ' + k + '$ und löse die Gleichung.', art === 0 ? 'Bring die Zahl ohne Klammer auf die rechte Seite, teile durch den Faktor vor der Klammer und zieh die Wurzel.' : 'Bring ' + k + ' auf die linke Seite, dann pq-Formel.'],
      weg: weg
    };
  }

  /* S2: Nullstellen und Scheitelpunkt aus der allgemeinen Form (Buch S. 101 Basiswissen) */
  function nullstellenScheitel(z) {
    var xs = paar(z, 6), a = Q.aus(z.wahl([1, -1, 2, -2]));
    var p = P.ausNullstellen(a, xs[0], xs[1]), xm = (xs[0] + xs[1]) / 2, ym = P.wertQ(p, xm);
    var nz = P.skal(p, Q(1).durch(a));
    return {
      typ: 'nullstellenscheitel', tr: false, text: 'Berechne Nullstellen und Scheitelpunkt von $f(x) = ' + t.poly(p) + '$.',
      felder: [
        { art: 'menge', label: 'Nullstellen:', loesung: xs },
        { art: 'punkt', label: 'Scheitelpunkt:', vor: '$S$', loesung: [xm, ym], typisch: [{ wert: [xm, ym.neg()], text: 'Prüf beim Einsetzen die Vorzeichen.' }] },
        hochTief(a)
      ],
      tipps: ['Nullstellen: $f(x) = 0$ setzen' + (a.gleich(1) ? '' : ', durch $' + f.tex(a) + '$ teilen') + ', pq-Formel.', 'Scheitelpunkt: Mittelwert der Nullstellen ist $x_S$. Dann $y_S = f(x_S)$.'],
      weg: (a.gleich(1) ? [] : [{ text: 'Durch $' + f.tex(a) + '$ teilen:', tex: t.poly(nz) + ' = 0' }]).concat(g.pqWeg(nz[1], nz[0]).weg).concat([
        { text: 'Mittelwert der Nullstellen:', tex: 'x_S = \\frac{' + xs[0] + ' + ' + f.kl(xs[1]) + '}{2} = ' + xm },
        { text: 'Einsetzen:', tex: 'y_S = f(' + xm + ') = ' + f.tex(ym) + '\\qquad ' + t.punkt(xm, ym, 'S') },
        { text: a.vz() < 0 ? '$a < 0$: Hochpunkt (Maximum).' : '$a > 0$: Tiefpunkt (Minimum).' }])
    };
  }

  /* S3: Hoch- oder Tiefpunkt mit x_S = −b/(2a) (Buch S. 102 Nr. 4, 7) */
  function scheitelFormel(z) {
    var a = Q.aus(z.wahl([2, -2, 3, -3, Q(1, 2), Q(-1, 2), -1])), xs = z.nz(-4, 4), c = Q(z.int(-8, 8));
    var b = a.mal(-2 * xs), p = [c, b, a], ys = P.wertQ(p, xs);
    return {
      typ: 'scheitelformel', tr: false, text: 'Hat $f(x) = ' + t.poly(p) + '$ einen Hochpunkt oder einen Tiefpunkt? Bestimme ihn.',
      felder: [hochTief(a), { art: 'punkt', label: 'Scheitelpunkt:', vor: '$S$', loesung: [xs, ys], typisch: [{ wert: [-xs, P.wertQ(p, -xs)], text: 'Vorzeichen: $x_S = -\\frac{b}{2a}$. Mit $b = ' + f.tex(b) + '$ und $a = ' + f.tex(a) + '$.' }] }],
      tipps: ['$a < 0$: Hochpunkt, $a > 0$: Tiefpunkt.', 'Für die x-Koordinate gilt $x_S = -\\frac{b}{2a}$ (oder quadratische Ergänzung). Dann $y_S = f(x_S)$.'],
      weg: [
        { text: '$a = ' + f.tex(a) + '$: ' + (a.vz() < 0 ? 'Hochpunkt.' : 'Tiefpunkt.') },
        { text: 'x-Koordinate:', tex: 'x_S = -\\frac{b}{2a} = -\\frac{' + f.tex(b) + '}{2\\cdot ' + f.kl(a) + '} = ' + xs },
        { text: 'y-Koordinate:', tex: 'y_S = f(' + xs + ') = ' + f.tex(ys) },
        { tex: t.punkt(xs, ys, 'S') }
      ]
    };
  }

  /* K1: Feuerwerksrakete (Buch S. 101 Basiswissen) */
  function rakete(z) {
    var t1 = z.wahl([-1, -2]), t2 = z.int(6, 12), p = P.ausNullstellen(-5, t1, t2);
    var tm = (t1 + t2) / 2, hm = P.wertQ(p, tm), t0 = z.int(1, 3), h0 = P.wertQ(p, t0), c = p[0];
    var tA = z.int(1, Math.ceil(tm) - 1), H = P.wertQ(p, tA), tB = t1 + t2 - tA; // tA < tm < tB
    return {
      typ: 'rakete', tr: false,
      text: 'Die Höhe einer Feuerwerksrakete (in m) nach $t$ Sekunden ist $h(t) = ' + t.poly(p).replace(/x/g, 't') + '$.',
      felder: [
        { art: 'zahl', label: 'Wie hoch ist sie nach ' + t0 + ' s?', vor: '$h(' + t0 + ') =$', nach: 'm', loesung: h0, typisch: g.einsetzenFehler(p, t0) },
        { art: 'zahl', label: 'Aus welcher Höhe wird sie abgeschossen?', nach: 'm', loesung: c },
        { art: 'menge', label: 'Wann ist sie ' + f.zahl(H) + ' m hoch (in s)?', loesung: [tA, tB], typisch: [{ wert: [tA], text: 'Auf dem Weg nach oben und auf dem Weg nach unten: Es gibt zwei Zeitpunkte.' }] },
        { art: 'zahl', label: 'Nach wie vielen Sekunden trifft sie auf den Boden?', nach: 's', loesung: t2, typisch: [{ wert: t1, text: 'Eine negative Zeit ergibt im Sachzusammenhang keinen Sinn.' }] },
        { art: 'zahl', label: 'Welche maximale Höhe erreicht sie?', nach: 'm', loesung: hm, typisch: [{ wert: tm, text: 'Das ist der Zeitpunkt. Gefragt ist die Höhe: $h(' + f.tex(tm) + ')$.' }] }
      ],
      tipps: ['Ordne jede Frage einem Typ zu: y-Wert gesucht, y-Achse, x-Wert gesucht, Nullstellen, Hochpunkt.', 'Höchster Punkt: Mittelwert der Nullstellen bilden und einsetzen.'],
      weg: [
        { text: 'y-Wert gesucht:', tex: 'h(' + t0 + ') = ' + f.tex(h0) },
        { text: 'Schnittpunkt mit der y-Achse:', tex: 'h(0) = ' + f.tex(c) },
        { text: 'x-Wert gesucht: $h(t) = ' + f.zahl(H) + '$ und durch $-5$ teilen:', tex: t.poly(P.skal(P.minus(p, [H]), Q(-1, 5))).replace(/x/g, 't') + ' = 0\\;\\Rightarrow\\; t_1 = ' + tA + ';\\; t_2 = ' + tB },
        { text: 'Nullstellen: $h(t) = 0$:', tex: t.poly(P.skal(p, Q(-1, 5))).replace(/x/g, 't') + ' = 0\\;\\Rightarrow\\; t_1 = ' + t1 + ';\\; t_2 = ' + t2 },
        { text: '$t_1 = ' + t1 + '$ ergibt im Sachzusammenhang keinen Sinn. Sie trifft nach ' + t2 + ' s auf.' },
        { text: 'Hochpunkt: Mittelwert der Nullstellen:', tex: 't_S = \\frac{' + t1 + ' + ' + t2 + '}{2} = ' + f.tex(tm) + ';\\quad h(' + f.tex(tm) + ') = ' + f.tex(hm) }
      ]
    };
  }

  /* K2: Gewinn – SunFit-Aufgabe (Buch S. 76 Nr. 6, mit dem zum Graphen passenden Term) */
  function gewinn(z) {
    var p1 = z.wahl([5, 10, 15]), p2 = p1 + z.wahl([20, 30]), k = z.wahl([10, 20]);
    var G = P.ausNullstellen(-k, p1, p2), pm = (p1 + p2) / 2, Gm = P.wertQ(G, pm), p0 = p1 + 5, G0 = P.wertQ(G, p0);
    return {
      typ: 'gewinn', tr: true,
      text: 'Ein Fitnessstudio hat herausgefunden: Der monatliche Gewinn $G$ (in €) hängt vom Abopreis $p$ (in €) ab, $G(p) = ' + t.poly(G).replace(/x/g, 'p') + '$.',
      felder: [
        { art: 'zahl', label: 'Gewinn bei einem Abopreis von ' + p0 + ' €:', nach: '€', loesung: G0 },
        { art: 'zahl', label: 'Bei welchem Preis ist der Gewinn am größten?', nach: '€', loesung: pm },
        { art: 'zahl', label: 'Wie groß ist der Gewinn dann?', nach: '€', loesung: Gm, typisch: [{ wert: pm, text: 'Das ist der Preis. Gefragt ist der Gewinn $G(' + pm + ')$.' }] },
        { art: 'menge', label: 'Bei welchen Preisen gibt es weder Gewinn noch Verlust?', loesung: [p1, p2] }
      ],
      tipps: ['Kein Gewinn, kein Verlust heißt $G(p) = 0$: Nullstellen berechnen (erst durch $' + (-k) + '$ teilen).', 'Größter Gewinn: Hochpunkt. Der Preis liegt in der Mitte der Nullstellen.'],
      weg: [
        { text: 'Einsetzen:', tex: 'G(' + p0 + ') = ' + f.tex(G0) },
        { text: 'Nullstellen, durch $' + (-k) + '$ geteilt:', tex: t.poly(P.ausNullstellen(1, p1, p2)).replace(/x/g, 'p') + ' = 0\\;\\Rightarrow\\; p_1 = ' + p1 + ';\\; p_2 = ' + p2 },
        { text: 'Hochpunkt in der Mitte:', tex: 'p_S = ' + pm + ';\\quad G(' + pm + ') = ' + f.tex(Gm) },
        { text: 'Bei ' + pm + ' € ist der Gewinn mit ' + f.zahl(Gm) + ' € am größten.' }
      ]
    };
  }

  /* K3: Flugbahn (Buch S. 102 Nr. 6 Golfball) */
  function flugbahn(z) {
    var w = z.wahl([40, 50, 60, 82, 100]), a = Q(-1, z.wahl([100, 200]));
    var p = P.ausNullstellen(a, 0, w), xm = w / 2, hm = P.wertQ(p, xm);
    return {
      typ: 'flugbahn', tr: true,
      text: 'Die Flugbahn eines Golfballs wird beschrieben durch $h(x) = ' + t.poly(p) + '$ ($x$: Entfernung vom Abschlag in m, $h(x)$: Höhe in m).',
      felder: [
        { art: 'zahl', label: 'Wie weit fliegt der Ball?', nach: 'm', loesung: w, typisch: [{ wert: 0, text: '$x = 0$ ist der Abschlag. Gesucht ist die zweite Nullstelle.' }] },
        { art: 'zahl', label: 'Wie hoch fliegt er höchstens? (auf zwei Nachkommastellen)', nach: 'm', loesung: hm, runden: 2 }
      ],
      tipps: ['Nullstellen: $h(x) = 0$. Klammere $x$ aus.', 'Die größte Höhe liegt in der Mitte zwischen den Nullstellen.'],
      weg: [
        { text: '$x$ ausklammern:', tex: 'x\\cdot(' + t.poly([P.koeff(p, 1), P.koeff(p, 2)]) + ') = 0\\;\\Rightarrow\\; x_1 = 0;\\; x_2 = ' + w },
        { text: 'Mitte:', tex: 'x_S = ' + xm + ';\\quad h(' + xm + ') = ' + f.tex(hm) },
        { text: 'Der Ball fliegt ' + w + ' m weit und höchstens ' + f.zahl(hm) + ' m hoch.' }
      ]
    };
  }

  M.bereich({
    id: 'thema-09', gruppe: 'thema', titel: 'Typische Fragen an Funktionen',
    erklaerung:
      '<p>Beispiel Feuerwerksrakete: $h(x) = -5x^2 + 45x + 50$ ($x$ in s, $h$ in m).</p>' +
      '<table><tr><th>Frage</th><th>Was tun?</th><th>Beispiel</th></tr>' +
      '<tr><td>y-Wert (Funktionswert) gesucht</td><td>x einsetzen</td><td>$h(2) = -5\\cdot 2^2 + 45\\cdot 2 + 50 = 120$</td></tr>' +
      '<tr><td>Wo schneidet der Graph die y-Achse?</td><td>$x = 0$ einsetzen</td><td>$h(0) = 50$</td></tr>' +
      '<tr><td>x-Wert gesucht</td><td>Gleichung $h(x) = 90$ lösen</td><td>$x^2 - 9x + 8 = 0 \\Rightarrow x_1 = 1;\\ x_2 = 8$</td></tr>' +
      '<tr><td>Nullstellen gesucht</td><td>$h(x) = 0$ lösen</td><td>$x_1 = -1;\\ x_2 = 10$ ($-1$ ergibt hier keinen Sinn)</td></tr>' +
      '<tr><td>Hochpunkt oder Tiefpunkt gesucht</td><td>Mittelwert der Nullstellen, dann einsetzen</td><td>$x_S = 4{,}5$; $h(4{,}5) = 151{,}25$</td></tr></table>' +
      '<div class="merk">$a < 0$: Hochpunkt (Maximum). $a > 0$: Tiefpunkt (Minimum). Ohne Nullstellen hilft $x_S = -\\frac{b}{2a}$ oder die quadratische Ergänzung.</div>' +
      '<p>Bei Sachaufgaben immer prüfen, ob ein Ergebnis im Sachzusammenhang Sinn ergibt, und einen Antwortsatz schreiben.</p>',
    generatoren: {
      basis: [funktionswert, yAchse, function (z) { return g.punktprobe(z); }],
      standard: [xWert, nullstellenScheitel, scheitelFormel],
      knobel: [rakete, gewinn, flugbahn]
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
