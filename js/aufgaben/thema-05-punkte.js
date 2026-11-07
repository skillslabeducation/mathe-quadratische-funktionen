/* Thema 5: Bestimmung quadratischer Funktionen mithilfe besonderer Punkte (Buch S. 87–88, AH S. 39–40). */
(function (root) {
  var M = root.M, Q = M.Q, P = M.P, f = M.f, t = M.t, g = M.g;

  var A_WAHL = [1, -1, 2, -2, 3, Q(1, 2), Q(-1, 2), Q(1, 4), Q(-1, 4), Q(1, 3), Q(-1, 3)];
  function atex(a) { a = Q.aus(a); return a.gleich(1) ? '' : (a.gleich(-1) ? '-' : f.tex(a) + '\\cdot '); }

  /* Fall 1: Scheitelpunkt und ein weiterer Punkt */
  function fall1(z) {
    var a, d, e, u, y0;
    do { a = Q.aus(z.wahl(A_WAHL)); d = z.int(-4, 4); e = z.int(-5, 5); u = z.nz(-3, 3); y0 = a.mal(u * u).plus(e); } while (!y0.istGanz());
    var x0 = d + u;
    var spf = P.ausScheitel(a, d, e);
    return {
      typ: 'fall1', tr: false,
      text: 'Eine Parabel hat den Scheitelpunkt $' + t.punkt(d, e, 'S') + '$ und geht durch $' + t.punkt(x0, y0, 'P') + '$. Bestimme die Funktionsgleichung.',
      felder: [
        { art: 'zahl', label: 'Streckfaktor:', vor: '$a =$', loesung: a, typisch: [
          { wert: y0.durch(u * u), text: 'Zieh zuerst $' + f.tex(e) + '$ ab, bevor du durch ' + (u * u) + ' teilst.' },
          { wert: y0.minus(e).durch(u), text: 'Die Klammer wird quadriert: $(' + x0 + ' - ' + f.kl(d) + ')^2 = ' + (u * u) + '$.' },
          { wert: a.neg(), text: 'Prüf das Vorzeichen.' }] },
        { art: 'term', label: 'Funktionsgleichung in Scheitelpunktform:', vor: '$f(x) =$', loesung: spf, form: 'spf', typisch: [{ wert: P.ausScheitel(a, -d, e), text: 'Vorzeichen bei $d$: $S(' + d + '|' + e + ')$ führt zu $' + t.lin(d) + '^2$.' }] }
      ],
      tipps: ['Scheitelpunkt bekannt: Ansatz $f(x) = a\\cdot ' + t.lin(d) + '^2' + (e < 0 ? ' - ' + (-e) : (e > 0 ? ' + ' + e : '')) + '$.', 'Setz $P$ ein: $f(' + x0 + ') = ' + y0 + '$. Dann nach $a$ auflösen.'],
      weg: [
        { text: 'Ansatz mit dem Scheitelpunkt:', tex: 'f(x) = a\\cdot ' + t.lin(d) + '^2' + (e ? (e < 0 ? ' - ' + (-e) : ' + ' + e) : '') },
        { text: 'Punkt $P$ einsetzen:', tex: f.tex(y0) + ' = a\\cdot(' + x0 + ' - ' + f.kl(d) + ')^2' + (e ? (e < 0 ? ' - ' + (-e) : ' + ' + e) : '') },
        { tex: f.tex(y0) + ' = ' + (u * u) + 'a' + (e ? (e < 0 ? ' - ' + (-e) : ' + ' + e) : '') + '\\;\\Rightarrow\\; a = ' + f.tex(a) },
        { text: 'Funktionsgleichung:', tex: 'f(x) = ' + t.spf(a, d, e) }
      ],
      grundlage: 'umstellen'
    };
  }

  /* Fall 2: Nullstellen und ein weiterer Punkt */
  function fall2(z) {
    var a, x1, x2, x0, y0;
    do {
      a = Q.aus(z.wahl(A_WAHL)); x1 = z.int(-5, 5); x2 = z.int(-5, 5); x0 = z.int(-4, 4);
      y0 = a.mal((x0 - x1) * (x0 - x2));
    } while (x1 >= x2 || x0 === x1 || x0 === x2 || !y0.istGanz() || Math.abs(y0.wert()) > 30);
    var k = (x0 - x1) * (x0 - x2);
    return {
      typ: 'fall2', tr: false,
      text: 'Eine Parabel hat die Nullstellen $' + x1 + '$ und $' + x2 + '$ und geht durch $' + t.punkt(x0, y0, 'P') + '$. Bestimme die Funktionsgleichung.',
      felder: [
        { art: 'zahl', label: 'Streckfaktor:', vor: '$a =$', loesung: a, typisch: [{ wert: Q(k).durch(y0), text: 'Umgekehrt geteilt: Aus $' + k + 'a = ' + f.tex(y0) + '$ folgt $a = \\frac{' + f.tex(y0) + '}{' + k + '}$.' }, { wert: a.neg(), text: 'Prüf die Vorzeichen in den Klammern beim Einsetzen.' }] },
        { art: 'term', label: 'Funktionsgleichung in faktorisierter Form:', vor: '$f(x) =$', loesung: P.ausNullstellen(a, x1, x2), form: 'fakt', typisch: [{ wert: P.ausNullstellen(a, -x1, -x2), text: 'Vorzeichenfalle: Zur Nullstelle $' + x1 + '$ gehört $' + t.lin(x1) + '$.' }] }
      ],
      tipps: ['Nullstellen bekannt: Ansatz $f(x) = a\\cdot ' + t.lin(x1) + '\\cdot ' + t.lin(x2) + '$.', 'Setz $P$ ein und löse nach $a$ auf.'],
      weg: [
        { text: 'Ansatz mit den Nullstellen:', tex: 'f(x) = a\\cdot ' + t.lin(x1) + '\\cdot ' + t.lin(x2) },
        { text: 'Punkt $P$ einsetzen:', tex: f.tex(y0) + ' = a\\cdot(' + x0 + ' - ' + f.kl(x1) + ')\\cdot(' + x0 + ' - ' + f.kl(x2) + ') = ' + k + 'a' },
        { tex: 'a = \\frac{' + f.tex(y0) + '}{' + k + '} = ' + f.tex(a) },
        { text: 'Funktionsgleichung:', tex: 'f(x) = ' + t.fakt(a, x1, x2) }
      ],
      grundlage: 'umstellen'
    };
  }

  /* B3: Parameter bestimmen (Buch S. 88 Nr. 7, Check-up Nr. 10) */
  function parameter(z) {
    var art = z.int(0, 2), x0 = z.nz(-4, 4), k, y0, formel, weg;
    if (art === 0) { k = Q.aus(z.wahl([2, 3, -1, -2, Q(1, 2), Q(-1, 4)])); y0 = k.mal(x0 * x0); if (!y0.istGanz()) { x0 = 2 * x0; y0 = k.mal(x0 * x0); } formel = 'f(x) = k\\cdot x^2';
      weg = [{ text: 'Punkt einsetzen:', tex: f.tex(y0) + ' = k\\cdot ' + f.kl(x0) + '^2 = ' + (x0 * x0) + 'k' }, { tex: 'k = ' + f.tex(k) }]; }
    else if (art === 1) { k = Q(z.int(-9, 9)); y0 = Q(x0 * x0).minus(k); formel = 'f(x) = x^2 - k';
      weg = [{ text: 'Punkt einsetzen:', tex: f.tex(y0) + ' = ' + f.kl(x0) + '^2 - k = ' + (x0 * x0) + ' - k' }, { tex: 'k = ' + (x0 * x0) + ' - ' + f.kl(y0) + ' = ' + f.tex(k) }]; }
    else { k = Q(z.nz(-5, 5)); y0 = Q(x0 * x0 + k.wert() * x0); formel = 'f(x) = x^2 + kx';
      weg = [{ text: 'Punkt einsetzen:', tex: f.tex(y0) + ' = ' + f.kl(x0) + '^2 + k\\cdot ' + f.kl(x0) + ' = ' + (x0 * x0) + ' + ' + f.kl(x0) + 'k' }, { tex: 'k = ' + f.tex(k) }]; }
    return {
      typ: 'parameter5', tr: false,
      text: 'Die Parabel $' + formel + '$ geht durch $' + t.punkt(x0, y0, 'P') + '$. Bestimme $k$.',
      felder: [{ art: 'zahl', vor: '$k =$', loesung: k, typisch: [{ wert: k.neg(), text: 'Prüf beim Umstellen das Vorzeichen.' }] }],
      tipps: ['Setz die Koordinaten von $P$ für $x$ und $f(x)$ ein.', 'Dann bleibt eine Gleichung mit der Unbekannten $k$. Stelle nach $k$ um.'],
      weg: weg, grundlage: 'umstellen'
    };
  }

  /* S1: Fall 3 – y-Achsenabschnitt und zwei Punkte (LGS) */
  function fall3(z) {
    var a = z.nz(-3, 3), b = z.int(-5, 5), c = z.int(-6, 6);
    var x1 = z.wahl([1, -1]), x2 = z.wahl([2, -2, 3]);
    var p = [Q(c), Q(b), Q(a)];
    var y1 = P.wertQ(p, x1).wert(), y2 = P.wertQ(p, x2).wert();
    var r1 = y1 - c, r2 = y2 - c;
    // (I) x1² a + x1 b = r1 ; (II) x2² a + x2 b = r2 ; x1 = ±1
    var bAus = x1 === 1 ? 'b = ' + r1 + ' - a' : 'b = a - ' + f.kl(r1);
    var koefA = x1 === 1 ? x2 * x2 - x2 : x2 * x2 + x2, rechts = x1 === 1 ? r2 - x2 * r1 : r2 + x2 * r1;
    return {
      typ: 'fall3', tr: false,
      text: 'Eine Parabel hat den y-Achsenabschnitt $' + c + '$ und geht durch $' + t.punkt(x1, y1, 'A') + '$ und $' + t.punkt(x2, y2, 'B') + '$. Bestimme $a$, $b$ und die Funktionsgleichung.',
      felder: [
        { art: 'zahl', vor: '$a =$', loesung: a },
        { art: 'zahl', vor: '$b =$', loesung: b },
        { art: 'term', vor: '$f(x) =$', loesung: p, form: 'allg' }
      ],
      tipps: ['Ansatz $f(x) = ax^2 + bx + ' + f.kl(c) + '$. Setz $A$ und $B$ ein: Das gibt zwei Gleichungen (I) und (II) mit $a$ und $b$.', 'Löse (I) nach $b$ auf und setz das in (II) ein.'],
      weg: [
        { text: 'Ansatz mit $c = ' + c + '$:', tex: 'f(x) = ax^2 + bx ' + (c < 0 ? '- ' + (-c) : '+ ' + c) },
        { text: '$A$ einsetzen:', tex: '\\text{(I)}\\quad ' + y1 + ' = a\\cdot ' + f.kl(x1) + '^2 + b\\cdot ' + f.kl(x1) + (c < 0 ? ' - ' + (-c) : ' + ' + c) },
        { text: 'Vereinfachen:', tex: '\\text{(I)}\\quad a ' + (x1 === 1 ? '+' : '-') + ' b = ' + r1 },
        { text: '$B$ einsetzen:', tex: '\\text{(II)}\\quad ' + (x2 * x2) + 'a ' + (x2 < 0 ? '- ' + (-x2) : '+ ' + x2) + 'b = ' + r2 },
        { text: '(I) nach $b$ auflösen und in (II) einsetzen:', tex: bAus + '\\;\\Rightarrow\\; ' + koefA + 'a = ' + rechts + '\\;\\Rightarrow\\; a = ' + a },
        { text: '$a$ in (I) einsetzen:', tex: 'b = ' + b },
        { text: 'Funktionsgleichung:', tex: 'f(x) = ' + t.poly(p) }
      ]
    };
  }

  /* S2: Steckbrief (Buch S. 88 Nr. 8, Check-up Nr. 11) */
  function steckbrief(z) {
    var art = z.int(0, 1), a, d, e, text, weg, p;
    if (art === 0) {
      var h = z.int(1, 3), x1 = z.int(-6, 2), x2 = x1 + 2 * h;
      a = Q.aus(z.wahl([1, -1, 2, -2, Q(1, 2), Q(-1, 2)])); d = (x1 + x2) / 2; e = a.neg().mal(h * h);
      p = P.ausNullstellen(a, x1, x2);
      text = 'Steckbrief: Die Parabel hat die Nullstellen $' + x1 + '$ und $' + x2 + '$. Ihr ' + (a.vz() < 0 ? 'Maximum' : 'Minimum') + ' ist $' + f.tex(e) + '$. Gib eine Funktionsgleichung an.';
      weg = [
        { text: 'Scheitelpunkt in der Mitte der Nullstellen, Höhe = ' + (a.vz() < 0 ? 'Maximum' : 'Minimum') + ':', tex: t.punkt(d, e, 'S') },
        { text: 'Ansatz mit den Nullstellen und $S$ einsetzen:', tex: f.tex(e) + ' = a\\cdot(' + d + ' - ' + f.kl(x1) + ')\\cdot(' + d + ' - ' + f.kl(x2) + ') = ' + (-h * h) + 'a\\;\\Rightarrow\\; a = ' + f.tex(a) },
        { tex: 'f(x) = ' + t.fakt(a, x1, x2) + ' = ' + t.spf(a, d, e) },
        { text: 'Ausmultipliziert (jede Form ist richtig):', tex: 'f(x) = ' + t.poly(p) }
      ];
    } else {
      var u; d = z.int(-3, 3); u = z.nz(-3, 3); a = Q.aus(z.wahl([1, -1, Q(1, 2), Q(-1, 2), 2, Q(1, 4), Q(-1, 4)])); e = a.neg().mal(u * u);
      if (!e.istGanz()) { u = 2 * u; e = a.neg().mal(u * u); }
      var n = d + u;
      p = P.ausScheitel(a, d, e);
      text = 'Steckbrief: Der Scheitelpunkt ist $' + t.punkt(d, e, 'S') + '$, eine Nullstelle liegt bei $x = ' + n + '$. Gib eine Funktionsgleichung an.';
      weg = [
        { text: 'Ansatz mit dem Scheitelpunkt:', tex: 'f(x) = a\\cdot ' + t.lin(d) + '^2 ' + (e.vz() < 0 ? '- ' + f.tex(e.abs()) : '+ ' + f.tex(e)) },
        { text: 'Nullstelle bedeutet $f(' + n + ') = 0$:', tex: '0 = a\\cdot(' + n + ' - ' + f.kl(d) + ')^2 ' + (e.vz() < 0 ? '- ' + f.tex(e.abs()) : '+ ' + f.tex(e)) + '\\;\\Rightarrow\\; a = ' + f.tex(a) },
        { tex: 'f(x) = ' + t.spf(a, d, e) },
        { text: 'Ausmultipliziert (jede Form ist richtig):', tex: 'f(x) = ' + t.poly(p) }
      ];
    }
    return {
      typ: 'steckbrief', tr: false, text: text,
      felder: [{ art: 'term', vor: '$f(x) =$', loesung: p, typisch: [{ wert: P.skal(p, -1), text: 'Prüf das Vorzeichen von $a$: Bei einem Maximum ist die Parabel nach unten geöffnet.' }] }],
      tipps: ['Welche Form passt am besten? Scheitelpunkt bekannt: Scheitelpunktform. Nullstellen bekannt: faktorisierte Form.', 'Setz die zweite Angabe ein und bestimme $a$. Jede Form der Gleichung wird akzeptiert.'],
      weg: weg
    };
  }

  /* S3: Gleichung am Graphen ablesen, Punkt nicht direkt neben dem Scheitel (Buch S. 88 Nr. 6) */
  function graphMitPunkt(z) {
    var a = Q.aus(z.wahl([Q(1, 4), Q(-1, 4), Q(1, 2), Q(-1, 2), Q(3, 4), Q(-3, 4), 2, -2])), d = z.int(-3, 3), e = z.int(-3, 3);
    var u = a.abs().wert() >= 2 ? z.wahl([-1, 1]) : z.wahl([-2, 2]);
    var x0 = d + u, y0 = a.mal(u * u).plus(e);
    var w = g.fenster([[d - 3, e], [d + 3, e], [x0, y0]], 1);
    if (a.vz() > 0) w.y[1] = Math.max(w.y[1], e + 4); else w.y[0] = Math.min(w.y[0], e - 4);
    return {
      typ: 'graphpunkt', tr: false,
      text: 'Bestimme die Funktionsgleichung der Parabel. Scheitelpunkt $S$ und Punkt $P$ liegen auf Gitterpunkten.',
      graph: { x: w.x, y: w.y, breite: 340, kurven: [{ fn: g.fn(P.ausScheitel(a, d, e)) }], punkte: [{ x: d, y: e, name: 'S' }, { x: x0, y: y0.wert(), name: 'P' }] },
      felder: [{ art: 'term', vor: '$f(x) =$', loesung: P.ausScheitel(a, d, e), form: 'spf' }],
      tipps: ['Lies $S$ und $P$ ab. Ansatz: $f(x) = a\\cdot(x - d)^2 + e$.', 'Setz $P$ ein und bestimme $a$. Vorsicht: $P$ liegt ' + Math.abs(u) + ' Einheit' + (Math.abs(u) > 1 ? 'en' : '') + ' neben dem Scheitelpunkt.'],
      weg: [
        { text: 'Ablesen:', tex: t.punkt(d, e, 'S') + ',\\quad ' + t.punkt(x0, y0, 'P') },
        { text: 'Ansatz und $P$ einsetzen:', tex: f.tex(y0) + ' = a\\cdot(' + x0 + ' - ' + f.kl(d) + ')^2 ' + (e < 0 ? '- ' + (-e) : '+ ' + e) + ' = ' + (u * u) + 'a ' + (e < 0 ? '- ' + (-e) : '+ ' + e) },
        { tex: 'a = ' + f.tex(a) },
        { tex: 'f(x) = ' + t.spf(a, d, e) }
      ]
    };
  }

  /* K1: Gleichung bestimmen und Punktprobe (Buch S. 88 Nr. 4) */
  function mitPunktprobe(z) {
    var a, d, e, u, y0;
    do { a = Q.aus(z.wahl([1, -1, 2, -2, Q(1, 2), Q(-1, 2)])); d = z.int(-3, 3); e = z.int(-4, 4); u = z.nz(-2, 2); y0 = a.mal(u * u).plus(e); } while (!y0.istGanz());
    var p = P.ausScheitel(a, d, e), x0 = d + u;
    var xq = d + z.wahl([-3, 3]), yq = P.wertQ(p, xq), drauf = z.chance(0.5);
    var yqz = drauf ? yq : yq.plus(z.nz(-2, 2));
    var xs = d + z.wahl([-2, 2, 4]), s = P.wertQ(p, xs);
    return {
      typ: 'punktprobe5', tr: false,
      text: 'Eine Parabel hat den Scheitelpunkt $' + t.punkt(d, e, 'S') + '$ und geht durch $' + t.punkt(x0, y0, 'P') + '$.',
      felder: [
        { art: 'term', label: 'Funktionsgleichung:', vor: '$f(x) =$', loesung: p, form: 'spf' },
        { art: 'mc', label: 'Liegt $' + t.punkt(xq, yqz, 'Q') + '$ auf der Parabel?', loesung: drauf ? 0 : 1, optionen: [{ html: 'ja', warum: '$f(' + xq + ') = ' + f.tex(yq) + '$.' }, { html: 'nein', warum: '$f(' + xq + ') = ' + f.tex(yq) + '$. Das passt.' }] },
        { art: 'zahl', label: 'Ergänze die fehlende Koordinate von $A(' + xs + '|s)$:', vor: '$s =$', loesung: s }
      ],
      tipps: ['Ansatz mit dem Scheitelpunkt, dann $P$ einsetzen und $a$ bestimmen.', 'Für $Q$ und $A$: x-Koordinate in die fertige Gleichung einsetzen.'],
      weg: [
        { text: '$P$ einsetzen:', tex: f.tex(y0) + ' = ' + (u * u === 1 ? '' : u * u) + 'a ' + (e < 0 ? '- ' + (-e) : '+ ' + e) + '\\;\\Rightarrow\\; a = ' + f.tex(a) },
        { tex: 'f(x) = ' + t.spf(a, d, e) },
        { text: 'Punktprobe für $Q$:', tex: 'f(' + xq + ') = ' + f.tex(yq) + (drauf ? '\\;\\checkmark' : '\\neq ' + f.tex(yqz)) },
        { text: 'Koordinate von $A$:', tex: 's = f(' + xs + ') = ' + f.tex(s) }
      ]
    };
  }

  /* K2: Sachaufgabe Wurf (Buch S. 88 Nr. 9, AH S. 40 Nr. 3) */
  function wurf(z) {
    var paare = [[4, 4], [6, 9], [8, 8], [10, 5], [20, 10], [40, 20], [12, 9], [16, 8], [30, 15], [24, 12]];
    var wp = z.wahl(paare), w = wp[0], h = wp[1];
    var a = Q(-4 * h, w * w);
    var obj = z.wahl([['Ein Ball', 'fliegt'], ['Ein Flummi', 'springt'], ['Ein Wasserstrahl', 'reicht']]);
    return {
      typ: 'wurf', tr: true,
      text: obj[0] + ' ' + obj[1] + ' ' + w + ' m weit und erreicht dabei eine größte Höhe von ' + h + ' m. Die Bahn ist eine Parabel. Leg das Koordinatensystem so, dass der Start im Ursprung $(0|0)$ liegt und der Aufprall bei $(' + w + '|0)$.',
      felder: [
        { art: 'zahl', label: 'Streckfaktor:', vor: '$a =$', loesung: a, typisch: [{ wert: Q(h, w), text: 'Setz den Scheitelpunkt ein: $x_S = ' + (w / 2) + '$, und $(' + (w / 2) + ')\\cdot(' + (w / 2) + ' - ' + w + ')$ ausrechnen.' }, { wert: a.neg(), text: 'Die Bahn ist nach unten geöffnet, also ist $a$ negativ.' }] },
        { art: 'term', label: 'Funktionsgleichung:', vor: '$f(x) =$', loesung: P.ausNullstellen(a, 0, w) }
      ],
      tipps: ['Nullstellen sind $0$ und $' + w + '$: Ansatz $f(x) = a\\cdot x\\cdot(x - ' + w + ')$. Der Scheitelpunkt liegt in der Mitte bei $(' + (w / 2) + '|' + h + ')$.', 'Setz den Scheitelpunkt ein: $' + h + ' = a\\cdot ' + (w / 2) + '\\cdot(' + (w / 2) + ' - ' + w + ')$.'],
      weg: [
        { text: 'Nullstellen 0 und ' + w + ', Ansatz:', tex: 'f(x) = a\\cdot x\\cdot(x - ' + w + ')' },
        { text: 'Scheitelpunkt in der Mitte:', tex: t.punkt(w / 2, h, 'S') },
        { text: '$S$ einsetzen:', tex: h + ' = a\\cdot ' + (w / 2) + '\\cdot(' + (w / 2) + ' - ' + w + ') = ' + (-(w / 2) * (w / 2)) + 'a\\;\\Rightarrow\\; a = ' + f.tex(a) + (a.istGlatt() ? '' : '\\approx ' + f.tex(a.wert(), 3)) },
        { tex: 'f(x) = ' + t.fakt(a, 0, w) }
      ]
    };
  }

  /* K3: Gibt es eine Parabel durch drei Punkte? (Check-up Nr. 12b) */
  function dreiPunkte(z) {
    var m = z.nz(-3, 3), n = z.int(-3, 3), xs = [0, 1, 2].map(function (i) { return z.int(-1, 0) + i * z.int(1, 2); });
    xs = [xs[0], xs[0] + 1, xs[0] + 2 + z.int(0, 1)];
    var gerade = z.chance(0.5);
    var ys = xs.map(function (x, i) { return m * x + n + (gerade || i !== 1 ? 0 : z.nz(-2, 2)); });
    var s1 = (ys[1] - ys[0]) / (xs[1] - xs[0]), s2 = (ys[2] - ys[1]) / (xs[2] - xs[1]);
    return {
      typ: 'dreipunkte', tr: false,
      text: 'Gibt es eine Parabel, die durch $' + t.punkt(xs[0], ys[0], 'A') + '$, $' + t.punkt(xs[1], ys[1], 'B') + '$ und $' + t.punkt(xs[2], ys[2], 'C') + '$ geht?',
      felder: [{ art: 'mc', loesung: gerade ? 1 : 0, optionen: [
        { html: 'ja', warum: 'Die drei Punkte liegen auf einer Geraden (gleiche Steigung). Eine Parabel ist nirgends gerade, sie kann nicht durch drei Punkte einer Geraden gehen.' },
        { html: 'nein, die Punkte liegen auf einer Geraden', warum: 'Die Steigungen von A nach B und von B nach C sind verschieden. Die Punkte liegen nicht auf einer Geraden, es gibt also eine Parabel.' }] }],
      tipps: ['Berechne die Steigung von A nach B und von B nach C.', 'Sind beide Steigungen gleich, liegen die Punkte auf einer Geraden. Dann gibt es keine Parabel durch alle drei.'],
      weg: [{ text: 'Steigungen:', tex: 'm_{AB} = \\frac{' + ys[1] + ' - ' + f.kl(ys[0]) + '}{' + xs[1] + ' - ' + f.kl(xs[0]) + '} = ' + f.tex(Q.aus(s1)) + ',\\quad m_{BC} = \\frac{' + ys[2] + ' - ' + f.kl(ys[1]) + '}{' + xs[2] + ' - ' + f.kl(xs[1]) + '} = ' + f.tex(Q.aus(s2)) },
        { text: gerade ? 'Gleiche Steigung: Die Punkte liegen auf einer Geraden. Es gibt keine Parabel durch alle drei.' : 'Verschiedene Steigungen: Die Punkte liegen nicht auf einer Geraden. Es gibt genau eine Parabel durch alle drei.' }]
    };
  }

  M.bereich({
    id: 'thema-05', gruppe: 'thema', titel: 'Bestimmung mithilfe besonderer Punkte',
    erklaerung:
      '<p>Welche Form du als Ansatz nimmst, hängt davon ab, was gegeben ist:</p>' +
      '<h3>1. Scheitelpunkt und ein weiterer Punkt → Scheitelpunktform</h3>' +
      '<p>$S(-1|2)$, $P(3|-2)$: Ansatz $f(x) = a\\cdot(x + 1)^2 + 2$. $P$ einsetzen:</p>' +
      '$$-2 = a\\cdot(3 + 1)^2 + 2 \\;\\Rightarrow\\; 16a = -4 \\;\\Rightarrow\\; a = -\\frac{1}{4}$$' +
      '<h3>2. Nullstellen und ein weiterer Punkt → faktorisierte Form</h3>' +
      '<p>Nullstellen $3$ und $-2$, $P(1|-3)$: Ansatz $f(x) = a\\cdot(x - 3)\\cdot(x + 2)$. $P$ einsetzen:</p>' +
      '$$-3 = a\\cdot(1 - 3)\\cdot(1 + 2) = -6a \\;\\Rightarrow\\; a = \\frac{1}{2}$$' +
      '<h3>3. y-Achsenabschnitt und zwei Punkte → allgemeine Form</h3>' +
      '<p>$c = -1$, $A(-2|1)$, $B(1|4)$: Ansatz $f(x) = ax^2 + bx - 1$. Einsetzen ergibt ein Gleichungssystem:</p>' +
      '$$\\text{(I)}\\; 4a - 2b = 2 \\qquad \\text{(II)}\\; a + b = 5 \\;\\Rightarrow\\; a = 2,\\; b = 3$$' +
      '<p>Also $f(x) = 2x^2 + 3x - 1$.</p>',
    generatoren: {
      basis: [fall1, fall2, parameter],
      standard: [fall3, steckbrief, graphMitPunkt],
      knobel: [mitPunktprobe, wurf, dreiPunkte]
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
