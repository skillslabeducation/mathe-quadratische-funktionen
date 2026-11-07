/* Thema 7: Gleichungen algebraisch lösen – Wurzelziehen, „Produkt = 0“-Regel, pq-Formel (Buch S. 94–97). */
(function (root) {
  var M = root.M, Q = M.Q, P = M.P, f = M.f, t = M.t, g = M.g;

  var NICHT_QUADRAT = [2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 17, 18, 20];
  function mengeAus(werte) { return werte.map(Number); }
  /* Lösungsweg der pq-Formel im Buchstil; p, q als Q */
  function pqWeg(p, q) {
    p = Q.aus(p); q = Q.aus(q);
    var h = p.durch(2), mh = h.neg(), D = h.mal(h).minus(q);
    var w = [];
    w.push({ text: '$p$ und $q$ ablesen, mit Vorzeichen:', tex: 'p = ' + f.tex(p) + ';\\quad q = ' + f.tex(q) });
    w.push({ text: 'In die pq-Formel einsetzen:', tex: 'x_{1,2} = -\\frac{' + f.tex(p) + '}{2} \\pm \\sqrt{\\left(\\frac{' + f.tex(p) + '}{2}\\right)^2 - ' + f.kl(q) + '}' });
    var unter = f.tex(h.mal(h)) + (q.vz() < 0 ? ' + ' + f.tex(q.abs()) : ' - ' + f.tex(q));
    w.push({ text: 'Ausrechnen:', tex: '= ' + f.tex(mh) + ' \\pm \\sqrt{' + unter + '} = ' + f.tex(mh) + ' \\pm \\sqrt{' + f.tex(D) + '}' });
    var loes, exakt = null;
    if (D.vz() < 0) {
      w.push({ text: 'Die Diskriminante $D = ' + f.tex(D) + '$ ist negativ. Aus einer negativen Zahl kann man keine Wurzel ziehen.', tex: '\\mathbb{L} = \\{\\,\\}' });
      loes = [];
    } else if (D.istNull()) {
      w.push({ text: '$D = 0$: genau eine Lösung.', tex: 'x = ' + f.tex(mh) });
      w.push({ tex: t.menge([mh]) });
      loes = [mh];
    } else {
      var r = D.wurzel();
      if (r) {
        var x1 = mh.plus(r), x2 = mh.minus(r);
        w.push({ tex: 'x_1 = ' + f.tex(mh) + ' + ' + f.tex(r) + ' = ' + f.tex(x1) + ';\\quad x_2 = ' + f.tex(mh) + ' - ' + f.tex(r) + ' = ' + f.tex(x2) });
        w.push({ tex: t.menge([x1, x2]) });
        loes = [x1, x2];
      } else {
        var s = '\\sqrt{' + f.tex(D) + '}', m0 = mh.istNull() ? '' : f.tex(mh) + ' ';
        var e1 = m0 + (m0 ? '+ ' : '') + s, e2 = m0 + '- ' + s;
        var n1 = mh.wert() + Math.sqrt(D.wert()), n2 = mh.wert() - Math.sqrt(D.wert());
        w.push({ tex: 'x_1 = ' + e1 + ' \\approx ' + f.tex(n1, 2) + ';\\quad x_2 = ' + e2 + ' \\approx ' + f.tex(n2, 2) });
        w.push({ tex: '\\mathbb{L} = \\{' + e2 + ';\\ ' + e1 + '\\}' });
        loes = [n2, n1];
        exakt = { e1: e1, e2: e2 };
      }
    }
    return { weg: w, loes: loes, D: D, exakt: exakt };
  }
  /* typischer Fehler: −p/2 mit falschem Vorzeichen -> Lösungen gespiegelt */
  function pqTypisch(loes) {
    var l = [];
    if (loes.length) l.push({ wert: loes.map(function (x) { return -Number(x); }), text: 'Vorzeichen: Die Formel beginnt mit $-\\frac{p}{2}$. Ist $p$ negativ, wird $-\\frac{p}{2}$ positiv.' });
    if (loes.length === 2) {
      l.push({ wert: [Number(loes[0])], text: 'Es gibt zwei Lösungen: einmal $+\\sqrt{\\ldots}$ und einmal $-\\sqrt{\\ldots}$.' });
      l.push({ wert: [Number(loes[1])], text: 'Es gibt zwei Lösungen: einmal $+\\sqrt{\\ldots}$ und einmal $-\\sqrt{\\ldots}$.' });
    }
    return l;
  }
  function nullstellenPaar(z, nichtNull) {
    var a, b;
    do { a = z.int(-8, 8); b = z.int(-8, 8); } while (a === b || (nichtNull && (a === 0 || b === 0)));
    return [a, b];
  }

  /* ---------- Basis ---------- */

  /* B1: Wurzelziehen (Buch S. 94 Nr. 4) */
  function wurzelziehen(z) {
    var fall = z.wahl(['quadrat', 'quadrat', 'wurzel', 'faktor', 'plus', 'keine']);
    var s = z.int(1, 12), k = z.wahl([2, 3, 4, 5]), n = z.wahl(NICHT_QUADRAT);
    var formel, loes, weg = [], wurzel = false, typ = [];
    if (fall === 'quadrat') { formel = 'x^2 = ' + (s * s); loes = [s, -s]; }
    if (fall === 'wurzel') { formel = 'x^2 = ' + n; loes = [Math.sqrt(n), -Math.sqrt(n)]; wurzel = true; }
    if (fall === 'faktor') { formel = k + 'x^2 = ' + (k * s * s); loes = [s, -s]; weg.push({ text: 'Durch ' + k + ' teilen:', tex: k + 'x^2 = ' + (k * s * s) + '\\quad |:' + k + '\\qquad x^2 = ' + (s * s) }); }
    if (fall === 'plus') { formel = k + 'x^2 - ' + (k * s * s) + ' = 0'; loes = [s, -s];
      weg.push({ text: 'Zahl auf die andere Seite:', tex: k + 'x^2 = ' + (k * s * s) + '\\quad |:' + k }, { tex: 'x^2 = ' + (s * s) }); }
    if (fall === 'keine') { formel = z.chance(0.5) ? 'x^2 + ' + (s * s) + ' = ' + Math.max(0, s * s - z.int(1, 9)) : k + 'x^2 = -' + (k * s); loes = []; }
    if (loes.length === 2) {
      var wt = wurzel ? '\\sqrt{' + n + '}' : String(s);
      weg.push({ text: 'Wurzel ziehen. Es gibt zwei Lösungen:', tex: 'x_1 = ' + wt + ';\\quad x_2 = -' + wt });
      weg.push({ tex: '\\mathbb{L} = \\{-' + wt + ';\\ ' + wt + '\\}' });
      typ.push({ wert: [loes[0]], text: 'Auch die negative Zahl ergibt quadriert dasselbe. Es gibt zwei Lösungen.' });
    } else {
      weg.push({ text: 'Umformen ergibt $x^2$ = negative Zahl. Keine Zahl ergibt quadriert etwas Negatives.', tex: '\\mathbb{L} = \\{\\,\\}' });
      typ.push({ wert: [s, -s], text: 'Bring die Gleichung erst auf die Form $x^2 = \\ldots$. Ist rechts eine negative Zahl, gibt es keine Lösung.' });
    }
    if (wurzel) typ.push({ wert: [Math.sqrt(n)], text: 'Es gibt noch eine negative Lösung.' });
    return {
      typ: 'wurzelziehen', tr: false,
      text: 'Löse die Gleichung.' + (wurzel ? ' Gib die Lösungen exakt an (mit Wurzel, Taste √).' : ''),
      formel: formel,
      felder: [{ art: 'menge', loesung: loes, wurzel: wurzel, typisch: typ, platzhalter: wurzel ? 'z. B. √7; −√7' : undefined }],
      tipps: ['Bring die Gleichung auf die Form $x^2 = e$.', '$e > 0$: zwei Lösungen $\\sqrt{e}$ und $-\\sqrt{e}$. $e = 0$: eine Lösung. $e < 0$: keine Lösung.'],
      weg: weg, grundlage: 'umstellen'
    };
  }

  /* B2: „Produkt = 0“-Regel (Buch S. 97 Nr. 17) */
  function produktNull(z) {
    var art = z.wahl(['einfach', 'faktor', 'x', 'linear']);
    var ns = nullstellenPaar(z, art !== 'x'), formel, loes, weg;
    if (art === 'x') { ns = [0, z.nz(-9, 9)]; formel = 'x\\cdot ' + t.lin(ns[1]) + ' = 0'; }
    else if (art === 'faktor') { var k = z.wahl([2, 3, -2, Q(1, 2)]); formel = t.fakt(k, ns[0], ns[1]) + ' = 0'; }
    else if (art === 'linear') {
      // (2x + 4)·(3x − 9) = 0
      var k1 = z.wahl([2, 3]), k2 = z.wahl([2, 3, 4]);
      formel = '(' + t.poly([-k1 * ns[0], k1]) + ')\\cdot(' + t.poly([-k2 * ns[1], k2]) + ') = 0';
    } else formel = t.lin(ns[0]) + '\\cdot ' + t.lin(ns[1]) + ' = 0';
    loes = ns;
    weg = [
      { text: '„Produkt = 0“-Regel: Ein Produkt ist 0, wenn einer der Faktoren 0 ist.' },
      { text: 'Jeden Faktor gleich null setzen:', tex: 'x_1 = ' + ns[0] + ';\\quad x_2 = ' + ns[1] },
      { tex: t.menge(ns) }
    ];
    return {
      typ: 'produktnull', tr: false, text: 'Löse die Gleichung.', formel: formel,
      felder: [{ art: 'menge', loesung: loes, typisch: [
        { wert: ns.map(function (x) { return -x; }), text: 'Vorzeichenfalle: $(x - 3) = 0$ ergibt $x = 3$, $(x + 3) = 0$ ergibt $x = -3$.' },
        { wert: [ns[0]], text: 'Jeder Faktor liefert eine Lösung. Es gibt zwei.' },
        { wert: [ns[1]], text: 'Jeder Faktor liefert eine Lösung. Es gibt zwei.' }
      ] }],
      tipps: ['Ein Produkt ist 0, wenn einer der Faktoren 0 ist. Ausmultiplizieren ist nicht nötig.', 'Setze jede Klammer einzeln gleich 0 und löse nach $x$ auf.'],
      weg: weg
    };
  }

  /* B3: (x − d)² = e, auch mit Faktor (Buch S. 94 Beispiel A, S. 95 Nr. 5) */
  function binomGleichung(z) {
    var d = z.nz(-6, 6), k = z.wahl([1, 1, 2, 3]), fall = z.wahl(['quadrat', 'quadrat', 'wurzel', 'keine']);
    var r = z.int(1, 5), n = z.wahl([2, 3, 5, 6, 7, 10]);
    var e = fall === 'quadrat' ? r * r : (fall === 'wurzel' ? n : -r * r);
    var links = (k === 1 ? '' : k + '\\cdot ') + t.lin(d) + '^2';
    var formel = links + ' = ' + (k * e);
    var loes, weg = [], wurzel = fall === 'wurzel';
    if (k !== 1) weg.push({ text: 'Durch ' + k + ' teilen:', tex: t.lin(d) + '^2 = ' + e });
    var xd = 'x ' + (d > 0 ? '- ' + d : '+ ' + (-d));
    if (fall === 'keine') { loes = []; weg.push({ text: 'Ein Quadrat kann nicht negativ sein.', tex: '\\mathbb{L} = \\{\\,\\}' }); }
    else {
      var wt = wurzel ? '\\sqrt{' + n + '}' : String(r);
      weg.push({ text: 'Wurzel ziehen, zwei Fälle:', tex: xd + ' = ' + wt + '\\quad\\text{oder}\\quad ' + xd + ' = -' + wt });
      if (wurzel) {
        weg.push({ tex: 'x_1 = ' + d + ' + \\sqrt{' + n + '};\\quad x_2 = ' + d + ' - \\sqrt{' + n + '}' });
        weg.push({ tex: '\\mathbb{L} = \\{' + d + ' - \\sqrt{' + n + '};\\ ' + d + ' + \\sqrt{' + n + '}\\}' });
        loes = [d + Math.sqrt(n), d - Math.sqrt(n)];
      } else {
        weg.push({ tex: 'x_1 = ' + (d + r) + ';\\quad x_2 = ' + (d - r) });
        weg.push({ tex: t.menge([d + r, d - r]) });
        loes = [d + r, d - r];
      }
    }
    var typ = loes.length ? [
      { wert: loes.map(function (x) { return x - 2 * d; }), text: 'Vorzeichen: Aus $' + xd + ' = \\ldots$ folgt $x = ' + d + ' \\pm \\ldots$.' },
      { wert: [loes[0]], text: 'Beim Wurzelziehen gibt es zwei Fälle, positiv und negativ.' }
    ] : [{ wert: [d + r, d - r], text: 'Rechts steht nach dem Umformen eine negative Zahl. Ein Quadrat ist nie negativ.' }];
    return {
      typ: 'binomgleichung7', tr: false, text: 'Löse die Gleichung.' + (wurzel ? ' Gib die Lösungen exakt an (mit Wurzel).' : ''),
      formel: formel,
      felder: [{ art: 'menge', loesung: loes, wurzel: wurzel, typisch: typ, platzhalter: wurzel ? 'z. B. −3 + √5; −3 − √5' : undefined }],
      tipps: ['Bring die Gleichung auf die Form $(x - d)^2 = e$. Dann Wurzel ziehen.', 'Aus $(x - d)^2 = e$ wird $x - d = \\sqrt{e}$ oder $x - d = -\\sqrt{e}$.'],
      weg: weg, grundlage: 'umstellen'
    };
  }

  /* ---------- Standard ---------- */

  /* S1: pq-Formel mit glatten Lösungen (Buch S. 96 Nr. 11) */
  function pqGlatt(z) {
    var ns = nullstellenPaar(z, true);
    var p = Q(-(ns[0] + ns[1])), q = Q(ns[0] * ns[1]);
    var w = pqWeg(p, q);
    return {
      typ: 'pqglatt', tr: false, text: 'Löse die Gleichung mit der pq-Formel.',
      formel: t.poly([q, p, 1]) + ' = 0',
      felder: [
        { art: 'zahl', label: 'Lies ab:', vor: '$p =$', loesung: p, typisch: [{ wert: p.neg(), text: '$p$ ist der Faktor vor $x$, <strong>mit</strong> seinem Vorzeichen.' }] },
        { art: 'zahl', vor: '$q =$', loesung: q, typisch: [{ wert: q.neg(), text: '$q$ ist die Zahl ohne $x$, <strong>mit</strong> ihrem Vorzeichen.' }] },
        { art: 'menge', label: 'Lösungsmenge:', loesung: mengeAus(w.loes), typisch: pqTypisch(w.loes) }
      ],
      tipps: ['Die Gleichung hat schon die Normalform $x^2 + px + q = 0$. Lies $p$ und $q$ mit Vorzeichen ab.', 'pq-Formel: $x_{1,2} = -\\frac{p}{2} \\pm \\sqrt{\\left(\\frac{p}{2}\\right)^2 - q}$'],
      weg: w.weg
    };
  }

  /* S2: x ausklammern (Buch S. 97 Nr. 17f, S. 96 Nr. 9c) */
  function ausklammern(z) {
    var a = z.wahl([1, 1, 2, 3, -1, -2]), r = z.nz(-9, 9);
    var b = -a * r; // a x² + b x = 0 -> x(ax + b) = 0 -> x = 0 oder x = r
    var formel = t.poly([0, b, a]) + ' = 0';
    return {
      typ: 'ausklammern', tr: false, text: 'Löse die Gleichung.', formel: formel,
      felder: [{ art: 'menge', loesung: [0, r], typisch: [
        { wert: [r], text: 'Die Lösung $x = 0$ fehlt. Teile nie durch $x$, sondern klammere $x$ aus.' },
        { wert: [0, -r], text: 'Prüf das Vorzeichen der zweiten Lösung.' }
      ] }],
      tipps: ['Es gibt keine Zahl ohne $x$. Klammere $x$ aus.', 'Dann hast du ein Produkt: $x\\cdot(' + t.poly([b, a]) + ') = 0$. Jetzt die „Produkt = 0“-Regel.'],
      weg: [
        { text: '$x$ ausklammern:', tex: 'x\\cdot(' + t.poly([b, a]) + ') = 0' },
        { text: '„Produkt = 0“-Regel:', tex: 'x_1 = 0\\quad\\text{oder}\\quad ' + t.poly([b, a]) + ' = 0 \\;\\Rightarrow\\; x_2 = ' + r },
        { tex: t.menge([0, r]) }
      ]
    };
  }

  /* S3: Diskriminante und Anzahl der Lösungen (Buch S. 96 Basiswissen) */
  function diskriminante(z) {
    var m = z.nz(-6, 6), fall = z.int(0, 2);
    var D = fall === 0 ? -z.int(1, 9) : (fall === 1 ? 0 : z.int(1, 20));
    var p = Q(2 * m), q = Q(m * m - D);
    return {
      typ: 'diskriminante', tr: false,
      text: 'Berechne die Diskriminante $D = \\left(\\frac{p}{2}\\right)^2 - q$ und gib die Anzahl der Lösungen an.',
      formel: t.poly([q, p, 1]) + ' = 0',
      felder: [
        { art: 'zahl', vor: '$D =$', loesung: D, typisch: [
          { wert: m * m + Number(q), text: 'Prüf das Vorzeichen: Es heißt $-\\,q$, und $q = ' + f.tex(q) + '$.' },
          { wert: 4 * m * m - Number(q), text: 'Erst $p$ halbieren, dann quadrieren: $\\left(\\frac{' + f.tex(p) + '}{2}\\right)^2 = ' + (m * m) + '$.' }
        ] },
        { art: 'mc', label: 'Anzahl der Lösungen:', loesung: D < 0 ? 0 : (D === 0 ? 1 : 2), optionen: [
          { html: 'keine Lösung', warum: 'Keine Lösung gibt es nur bei $D < 0$.' },
          { html: 'genau eine Lösung', warum: 'Genau eine Lösung gibt es nur bei $D = 0$.' },
          { html: 'zwei Lösungen', warum: 'Zwei Lösungen gibt es nur bei $D > 0$.' }] }
      ],
      tipps: ['Lies $p$ und $q$ mit Vorzeichen ab: $p = ' + f.tex(p) + '$, $q = ' + f.tex(q) + '$.', '$D > 0$: zwei Lösungen. $D = 0$: eine Lösung. $D < 0$: keine Lösung.'],
      weg: [
        { tex: 'p = ' + f.tex(p) + ';\\quad q = ' + f.tex(q) },
        { text: 'Diskriminante:', tex: 'D = \\left(\\frac{' + f.tex(p) + '}{2}\\right)^2 - ' + f.kl(q) + ' = ' + (m * m) + (Number(q) < 0 ? ' + ' + (-Number(q)) : ' - ' + Number(q)) + ' = ' + D },
        { text: D < 0 ? '$D < 0$: keine Lösung.' : (D === 0 ? '$D = 0$: genau eine Lösung.' : '$D > 0$: zwei Lösungen.') }
      ]
    };
  }

  /* S4: Nullstellen einer Funktion (Buch S. 96 Nr. 9) */
  function nullstellenFunktion(z) {
    var art = z.wahl(['allg', 'spf', 'rein', 'spf']);
    var formel, loes, weg, tipps, typ = [];
    if (art === 'allg') {
      var ns = nullstellenPaar(z, true), p = Q(-(ns[0] + ns[1])), q = Q(ns[0] * ns[1]);
      var w = pqWeg(p, q);
      formel = 'f(x) = ' + t.poly([q, p, 1]);
      loes = mengeAus(w.loes); typ = pqTypisch(w.loes);
      weg = [{ text: 'Nullstellen: $f(x) = 0$ setzen.', tex: t.poly([q, p, 1]) + ' = 0' }].concat(w.weg);
      tipps = ['Nullstellen heißt: $f(x) = 0$. Das ist eine Gleichung in Normalform.', 'Mit der pq-Formel lösen.'];
    } else if (art === 'spf') {
      var a = z.wahl([1, -1, 2, -3]), d = z.nz(-5, 5), r = z.int(1, 5), keine = z.chance(0.25);
      var e = keine ? a * r * r : -a * r * r;
      formel = 'f(x) = ' + t.spf(a, d, e);
      loes = keine ? [] : [d + r, d - r];
      var xd = 'x ' + (d > 0 ? '- ' + d : '+ ' + (-d));
      weg = [{ text: 'Nullstellen: $f(x) = 0$ setzen und $' + f.tex(e) + '$ auf die andere Seite bringen.', tex: (a === 1 ? '' : (a === -1 ? '-' : a + '\\cdot ')) + t.lin(d) + '^2 = ' + (-e) }];
      if (a !== 1) weg.push({ text: 'Durch $' + a + '$ teilen:', tex: t.lin(d) + '^2 = ' + (-e / a) });
      if (keine) weg.push({ text: 'Ein Quadrat ist nie negativ.', tex: '\\mathbb{L} = \\{\\,\\}' });
      else weg.push({ text: 'Wurzel ziehen:', tex: xd + ' = ' + r + '\\quad\\text{oder}\\quad ' + xd + ' = -' + r }, { tex: t.menge(loes) });
      typ = keine ? [{ wert: [d + r, d - r], text: 'Prüf das Vorzeichen nach dem Umstellen: Rechts steht eine negative Zahl.' }] : [{ wert: [-d + r, -d - r], text: 'Vorzeichen: Aus $' + xd + '$ folgt $x = ' + d + ' \\pm \\ldots$.' }];
      tipps = ['Setz $f(x) = 0$. Bring die Zahl ohne Klammer auf die andere Seite und teile durch den Faktor.', 'Dann Wurzel ziehen, zwei Fälle.'];
    } else {
      var k = z.wahl([2, 3, -1, -2]), s = z.int(1, 6);
      formel = 'f(x) = ' + t.poly([-k * s * s, 0, k]);
      loes = [s, -s];
      weg = [{ text: '$f(x) = 0$ setzen und umformen:', tex: t.poly([0, 0, k]) + ' = ' + (k * s * s) }, { text: 'Durch $' + k + '$ teilen:', tex: 'x^2 = ' + (s * s) }, { tex: t.menge(loes) }];
      typ = [{ wert: [s], text: 'Auch die negative Zahl ist eine Lösung.' }];
      tipps = ['Nullstellen: $f(x) = 0$.', 'Bring die Gleichung auf die Form $x^2 = \\ldots$.'];
    }
    return {
      typ: 'nullstellen-' + art, tr: false, text: 'Berechne die Nullstellen der Funktion.', formel: formel,
      felder: [{ art: 'menge', label: 'Nullstellen:', loesung: loes, typisch: typ }],
      tipps: tipps, weg: weg
    };
  }

  /* ---------- Knobel ---------- */

  /* K1: ax² + bx + c = 0 mit a ≠ 1 (Buch S. 96 Beispiel D, S. 97 Nr. 12) */
  function pqMitA(z) {
    var a = Q.aus(z.wahl([2, 3, -1, -2, Q(1, 2), 4])), ns = nullstellenPaar(z, true);
    var b = a.mal(-(ns[0] + ns[1])), c = a.mal(ns[0] * ns[1]);
    var p = b.durch(a), q = c.durch(a);
    var w = pqWeg(p, q);
    var typ = pqTypisch(w.loes);
    var falschD = b.durch(2).mal(b.durch(2)).minus(c);
    if (falschD.vz() >= 0 && !a.gleich(1)) {
      var fr = Math.sqrt(falschD.wert()), mh = -b.wert() / 2;
      typ.push({ wert: falschD.istNull() ? [mh] : [mh + fr, mh - fr], text: 'Erst durch $' + f.tex(a) + '$ teilen! Die pq-Formel gilt nur für die Normalform $x^2 + px + q = 0$.' });
    }
    return {
      typ: 'pqmita', tr: false, text: 'Löse die Gleichung.',
      formel: t.poly([c, b, a]) + ' = 0',
      felder: [{ art: 'menge', loesung: mengeAus(w.loes), typisch: typ }],
      tipps: ['Vor $x^2$ steht $' + f.tex(a) + '$. Teile zuerst die ganze Gleichung durch $' + f.tex(a) + '$.', 'Danach hast du die Normalform $' + t.poly([q, p, 1]) + ' = 0$. Weiter mit der pq-Formel.'],
      weg: [{ text: 'Durch $' + f.tex(a) + '$ teilen, um die Normalform zu bekommen:', tex: t.poly([c, b, a]) + ' = 0\\quad |:' + f.kl(a) + '\\qquad ' + t.poly([q, p, 1]) + ' = 0' }].concat(w.weg)
    };
  }

  /* K2: Lösungen mit Wurzel, exakt und gerundet (Buch S. 95 Beispiel C, S. 96 Beispiel D) */
  function pqWurzel(z) {
    var m, D;
    do { m = z.int(-5, 5); D = z.wahl(NICHT_QUADRAT); } while (false);
    var p = Q(2 * m), q = Q(m * m - D);
    var w = pqWeg(p, q);
    var n1 = -m + Math.sqrt(D), n2 = -m - Math.sqrt(D);
    return {
      typ: 'pqwurzel', tr: true,
      text: 'Löse die Gleichung mit der pq-Formel. Gib die Lösungen exakt (mit Wurzel) und gerundet auf zwei Nachkommastellen an.',
      formel: t.poly([q, p, 1]) + ' = 0',
      felder: [
        { art: 'menge', label: 'Exakt:', loesung: [n1, n2], wurzel: true, platzhalter: 'z. B. 1 + √5; 1 − √5', typisch: [{ wert: [-n1, -n2], text: 'Vorzeichen: Die Formel beginnt mit $-\\frac{p}{2}$.' }] },
        { art: 'menge', label: 'Gerundet:', loesung: [n1, n2], runden: 2, platzhalter: 'z. B. 3,24; −1,24', typisch: [{ wert: [-n1, -n2], text: 'Vorzeichen: Die Formel beginnt mit $-\\frac{p}{2}$.' }] }
      ],
      tipps: ['$p = ' + f.tex(p) + '$, $q = ' + f.tex(q) + '$. Setze in $x_{1,2} = -\\frac{p}{2} \\pm \\sqrt{\\left(\\frac{p}{2}\\right)^2 - q}$ ein.', 'Unter der Wurzel kommt $' + D + '$ heraus. Das ist keine Quadratzahl, die Wurzel bleibt stehen: $' + w.exakt.e1 + '$.'],
      weg: w.weg
    };
  }

  /* K3: erst umformen, dann lösen (Buch S. 97 Nr. 13 a–c) */
  function umformen(z) {
    var ns = nullstellenPaar(z, true), u, v, k;
    do { u = z.int(-6, 6); v = (ns[0] + ns[1]) - u; k = u * v - ns[0] * ns[1]; } while (k === 0 || u === v);
    // (x − u)(x − v) = k  <=>  x² − (u+v)x + uv − k = 0
    var p = Q(-(u + v)), q = Q(u * v - k);
    var w = pqWeg(p, q);
    return {
      typ: 'umformen', tr: false, text: 'Löse die Gleichung.',
      formel: t.lin(u) + '\\cdot ' + t.lin(v) + ' = ' + k,
      felder: [{ art: 'menge', loesung: mengeAus(w.loes), typisch: pqTypisch(w.loes).concat([
        { wert: [u, v], text: 'Die „Produkt = 0“-Regel gilt nur, wenn auf einer Seite 0 steht. Hier steht rechts $' + k + '$. Erst ausmultiplizieren und alles auf eine Seite bringen.' }]) }],
      tipps: ['Rechts steht nicht 0. Multipliziere die Klammern aus und bring alles auf die linke Seite.', 'Ausmultipliziert: $' + t.poly(P.ausNullstellen(1, u, v)) + ' = ' + k + '$. Jetzt $' + (k > 0 ? '-\\,' + k : '+\\,' + (-k)) + '$ auf beiden Seiten.'],
      weg: [
        { text: 'Ausmultiplizieren:', tex: t.poly(P.ausNullstellen(1, u, v)) + ' = ' + k },
        { text: 'Alles auf eine Seite:', tex: t.poly([q, p, 1]) + ' = 0' }
      ].concat(w.weg),
      grundlage: 'klammern'
    };
  }

  /* K4: x auf beiden Seiten (Buch S. 95 Beispiel C) */
  function beideSeiten(z) {
    var ns = nullstellenPaar(z, true), m = z.nz(-5, 5), n = z.int(-8, 8);
    var p = Q(-(ns[0] + ns[1])), q = Q(ns[0] * ns[1]);
    // x² + (p + m)x + (q + n) = m x + n
    var links = t.poly([q.plus(n), p.plus(m), 1]), rechts = t.poly([n, m]);
    var w = pqWeg(p, q);
    return {
      typ: 'beideseiten', tr: false, text: 'Löse die Gleichung.',
      formel: links + ' = ' + rechts,
      felder: [{ art: 'menge', loesung: mengeAus(w.loes), typisch: pqTypisch(w.loes) }],
      tipps: ['Bring alles auf die linke Seite, sodass rechts 0 steht.', 'Rechne auf beiden Seiten $' + (m > 0 ? '-\\,' + t.poly([0, m]) : '+\\,' + t.poly([0, -m])) + '$ und $' + (n > 0 ? '-\\,' + n : (n < 0 ? '+\\,' + (-n) : '\\pm 0')) + '$.'],
      weg: [{ text: 'Alles auf eine Seite bringen:', tex: t.poly([q, p, 1]) + ' = 0' }].concat(w.weg)
    };
  }

  /* K5: drei Lösungen (Buch S. 97 Nr. 13 d–f) */
  function dreiLoesungen(z) {
    var r = z.nz(-9, 9), art = z.wahl(['diff', 'aus']);
    var s, formel, loes, zweiter;
    if (art === 'diff') { do { s = z.int(1, 9); } while (s === Math.abs(r)); formel = t.lin(r) + '\\cdot(x^2 - ' + (s * s) + ') = 0'; loes = [r, s, -s]; zweiter = 'x^2 - ' + (s * s) + ' = 0 \\;\\Rightarrow\\; x = \\pm ' + s; }
    else { do { s = z.nz(-9, 9); } while (s === r); formel = t.lin(r) + '\\cdot(' + t.poly([0, -s, 1]) + ') = 0'; loes = [r, 0, s]; zweiter = t.poly([0, -s, 1]) + ' = x\\cdot ' + t.lin(s) + ' = 0 \\;\\Rightarrow\\; x = 0 \\text{ oder } x = ' + s; }
    return {
      typ: 'dreiloesungen', tr: false, text: 'Löse die Gleichung. Achtung: Es kann mehr als zwei Lösungen geben.', formel: formel,
      felder: [{ art: 'menge', loesung: loes, typisch: [{ wert: [r], text: 'Auch der zweite Faktor kann null werden, und der liefert noch mehr Lösungen.' }, { wert: loes.slice(1), text: 'Der erste Faktor $' + t.lin(r) + '$ liefert auch eine Lösung.' }] }],
      tipps: ['„Produkt = 0“-Regel: Setz jeden Faktor einzeln gleich 0.', 'Der zweite Faktor ist selbst eine quadratische Gleichung mit zwei Lösungen.'],
      weg: [
        { text: 'Erster Faktor:', tex: t.lin(r) + ' = 0 \\;\\Rightarrow\\; x = ' + r },
        { text: 'Zweiter Faktor:', tex: zweiter },
        { tex: t.menge(loes) }
      ]
    };
  }

  M.g.pqWeg = pqWeg; M.g.pqTypisch = pqTypisch;

  M.bereich({
    id: 'thema-07', gruppe: 'thema', titel: 'Gleichungen algebraisch lösen',
    erklaerung:
      '<h3>1. Wurzelziehen: $x^2 = e$ und $(x - d)^2 = e$</h3>' +
      '<p>$e > 0$: zwei Lösungen. $e = 0$: eine Lösung. $e < 0$: keine Lösung, $\\mathbb{L} = \\{\\,\\}$.</p>' +
      '$$(x - 3)^2 = 16 \\;\\Rightarrow\\; x - 3 = 4 \\text{ oder } x - 3 = -4 \\;\\Rightarrow\\; \\mathbb{L} = \\{-1;\\ 7\\}$$' +
      '$$2\\cdot(x + 3)^2 = 10 \\quad |:2 \\qquad (x + 3)^2 = 5 \\qquad x_1 = -3 + \\sqrt{5};\\; x_2 = -3 - \\sqrt{5}$$' +
      '<h3>2. „Produkt = 0“-Regel</h3><p>Ein Produkt ist 0, wenn einer der Faktoren 0 ist.</p>' +
      '$$(x + 1)\\cdot(x - 3) = 0 \\;\\Rightarrow\\; x_1 = -1;\\; x_2 = 3$$' +
      '<p>Fehlt die Zahl ohne $x$, klammerst du $x$ aus: $x^2 - 10x = 0 \\Rightarrow x\\cdot(x - 10) = 0 \\Rightarrow x_1 = 0;\\ x_2 = 10$. Nie durch $x$ teilen, sonst geht $x = 0$ verloren.</p>' +
      '<h3>3. pq-Formel für $x^2 + px + q = 0$</h3>' +
      '<div class="merk">$$x_{1,2} = -\\frac{p}{2} \\pm \\sqrt{\\left(\\frac{p}{2}\\right)^2 - q}$$' +
      'Diskriminante $D = \\left(\\frac{p}{2}\\right)^2 - q$: $D > 0$ zwei Lösungen, $D = 0$ eine Lösung, $D < 0$ keine Lösung.</div>' +
      '<p><strong>Steht vor $x^2$ eine Zahl $a$, erst durch $a$ teilen.</strong> Achte auf die Vorzeichen von $p$ und $q$.</p>' +
      '$$\\begin{aligned} 2x^2 - 4x - 8 &= 0 \\quad |:2\\\\ x^2 - 2x - 4 &= 0 \\qquad p = -2;\\ q = -4\\\\ x_{1,2} &= -\\frac{-2}{2} \\pm \\sqrt{\\left(\\frac{-2}{2}\\right)^2 - (-4)} = 1 \\pm \\sqrt{5}\\\\ \\mathbb{L} &= \\{1 - \\sqrt{5};\\ 1 + \\sqrt{5}\\} \\approx \\{-1{,}24;\\ 3{,}24\\} \\end{aligned}$$',
    generatoren: {
      basis: [wurzelziehen, produktNull, binomGleichung],
      standard: [pqGlatt, ausklammern, diskriminante, nullstellenFunktion],
      knobel: [pqMitA, pqWurzel, umformen, beideSeiten, dreiLoesungen]
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
