/* Grundlage 4: Gleichungen und Formeln umstellen. */
(function (root) {
  var M = root.M, Q = M.Q, P = M.P, f = M.f, t = M.t, g = M.g;

  function kl(a) { return t.lin(Q.aus(a).neg()); } // (x + a)

  /* Basis 1: ax + b = c */
  function linear(z) {
    var a = z.wahl([2, 3, 4, 5, -2, -3, -4]), x = z.int(-8, 8), b = z.nz(-12, 12);
    var c = a * x + b;
    return {
      typ: 'linear', tr: false, text: 'Löse die Gleichung.',
      formel: t.poly([b, a]) + ' = ' + c,
      felder: [{ art: 'zahl', vor: '$x =$', loesung: x, typisch: [
        { wert: (c + b) / a, text: 'Um $' + (b > 0 ? '+' : '') + b + '$ wegzubekommen, rechnest du auf beiden Seiten $' + (b > 0 ? '-' : '+') + ' ' + Math.abs(b) + '$.' },
        { wert: c / a - b, text: 'Erst die Zahl ohne $x$ auf die andere Seite bringen, dann durch ' + f.tex(a) + ' teilen.' },
        { wert: -x, text: 'Prüf das Vorzeichen beim Teilen durch $' + f.tex(a) + '$.' }
      ] }],
      tipps: ['Bring zuerst die Zahl ohne $x$ auf die rechte Seite, dann teile durch den Faktor vor $x$.', 'Rechne auf beiden Seiten $' + (b > 0 ? '-\\ ' + b : '+\\ ' + (-b)) + '$.'],
      weg: [
        { text: 'Zahl ohne $x$ auf die andere Seite (Umkehroperation):', tex: t.poly([b, a]) + ' = ' + c + '\\quad |' + (b > 0 ? ' - ' + b : ' + ' + (-b)) },
        { text: 'Durch den Faktor vor $x$ teilen:', tex: t.poly([0, a]) + ' = ' + (c - b) + '\\quad |:' + f.kl(a) },
        { tex: 'x = ' + x }
      ]
    };
  }

  /* Basis 2: Klammer auf einer Seite, x auf beiden Seiten */
  function linearKlammer(z) {
    var k = z.wahl([2, 3, 4, -2, -3]), a = z.nz(-6, 6), c = z.wahl([1, 2, 3, 5, -1]), x = z.int(-6, 6);
    if (c === k) c = k + 1;
    var d = k * (x + a) - c * x;
    var links = k + '\\cdot ' + kl(a), rechts = t.poly([d, c]);
    return {
      typ: 'linearklammer', tr: false, text: 'Löse die Gleichung.',
      formel: links + ' = ' + rechts,
      felder: [{ art: 'zahl', vor: '$x =$', loesung: x, typisch: [
        { wert: (d - a) / (k - c), text: 'Beim Ausmultiplizieren der Klammer wird auch $' + f.kl(a) + '$ mit ' + f.tex(k) + ' malgenommen.' }
      ] }],
      tipps: ['Zuerst die Klammer ausmultiplizieren.', 'Dann alle Glieder mit $x$ auf eine Seite, alle Zahlen auf die andere.'],
      weg: [
        { text: 'Klammer ausmultiplizieren:', tex: t.poly([k * a, k]) + ' = ' + rechts },
        { text: 'Glieder mit $x$ nach links, Zahlen nach rechts:', tex: t.poly([0, k - c]) + ' = ' + (d - k * a) },
        { text: 'Durch $' + f.tex(k - c) + '$ teilen:', tex: 'x = ' + x }
      ],
      grundlage: 'klammern'
    };
  }

  /* Standard 3: x² = e und ax² = e (auch ohne Lösung) */
  function reinquadratisch(z) {
    var s = z.int(1, 12), a = z.wahl([1, 1, 2, 3, 4, 5, -1]);
    var keine = z.chance(0.2);
    var e = keine ? -a * s * s : a * s * s;
    var loes = keine ? [] : [s, -s];
    var links = a === 1 ? 'x^2' : (a === -1 ? '-x^2' : a + 'x^2');
    var weg = [];
    if (a !== 1) weg.push({ text: 'Durch $' + f.tex(a) + '$ teilen:', tex: 'x^2 = ' + f.tex(e / a) });
    if (keine) weg.push({ text: 'Keine Zahl ergibt quadriert etwas Negatives.', tex: '\\mathbb{L} = \\{\\,\\}' });
    else weg.push({ text: 'Wurzel ziehen. Es gibt eine positive und eine negative Lösung:', tex: 'x_1 = ' + s + ';\\quad x_2 = -' + s }, { tex: t.menge(loes) });
    return {
      typ: 'reinquadratisch', tr: false, text: 'Löse die Gleichung. Gib alle Lösungen an.',
      formel: links + ' = ' + e,
      felder: [{ art: 'menge', loesung: loes, typisch: keine ? [{ wert: [s, -s], text: 'Prüf das Vorzeichen: $x^2$ kann nie negativ sein.' }] : [
        { wert: [s], text: 'Es gibt noch eine zweite Lösung: Auch $(-' + s + ')^2 = ' + (s * s) + '$.' },
        { wert: [], text: 'Es gibt Lösungen. Teile zuerst durch den Faktor vor $x^2$.' }
      ] }],
      tipps: ['Bring die Gleichung auf die Form $x^2 = $ Zahl.', 'Ist die Zahl positiv, gibt es zwei Lösungen: $+\\sqrt{\\ldots}$ und $-\\sqrt{\\ldots}$. Ist sie negativ, gibt es keine.'],
      weg: weg
    };
  }

  /* Standard 4: (x − d)² = e */
  function binomGleichung(z) {
    var d = z.nz(-6, 6), k = z.int(1, 6), fall = z.wahl(['zwei', 'zwei', 'zwei', 'eine', 'keine']);
    var e = fall === 'zwei' ? k * k : (fall === 'eine' ? 0 : -k * k);
    var loes = fall === 'zwei' ? [d + k, d - k] : (fall === 'eine' ? [d] : []);
    var typisch = [];
    if (fall === 'zwei') typisch.push(
      { wert: [d + k], text: 'Beim Wurzelziehen gibt es zwei Fälle: $x ' + (d > 0 ? '-' : '+') + ' ' + Math.abs(d) + ' = ' + k + '$ oder $x ' + (d > 0 ? '-' : '+') + ' ' + Math.abs(d) + ' = -' + k + '$.' },
      { wert: [-d + k, -d - k], text: 'Vorzeichen: Aus $x ' + (d > 0 ? '-' : '+') + ' ' + Math.abs(d) + ' = \\ldots$ folgt $x = ' + d + ' \\pm \\ldots$.' },
      { wert: [d + k * k, d - k * k], text: 'Erst die Wurzel ziehen: $\\sqrt{' + (k * k) + '} = ' + k + '$.' });
    var weg = [{ text: 'Wurzel ziehen:', tex: fall === 'keine' ? '\\text{Ein Quadrat ist nie negativ.}' : (fall === 'eine' ? 'x ' + (d > 0 ? '- ' : '+ ') + Math.abs(d) + ' = 0' : 'x ' + (d > 0 ? '- ' : '+ ') + Math.abs(d) + ' = ' + k + '\\quad\\text{oder}\\quad x ' + (d > 0 ? '- ' : '+ ') + Math.abs(d) + ' = -' + k) }];
    if (fall === 'zwei') weg.push({ text: 'Nach $x$ auflösen:', tex: 'x_1 = ' + (d + k) + ';\\quad x_2 = ' + (d - k) });
    weg.push({ tex: t.menge(loes) });
    return {
      typ: 'binomgleichung', tr: false, text: 'Löse die Gleichung.',
      formel: kl(-d) + '^2 = ' + e,
      felder: [{ art: 'menge', loesung: loes, typisch: typisch }],
      tipps: ['Zieh auf beiden Seiten die Wurzel. Denk an die positive <strong>und</strong> die negative Wurzel.', fall === 'keine' ? 'Kann ein Quadrat negativ sein?' : 'Aus $(x - d)^2 = e$ wird $x - d = \\sqrt{e}$ oder $x - d = -\\sqrt{e}$.'],
      weg: weg
    };
  }

  /* Standard 5 / Knobel: Parameter bestimmen */
  function parameterA(z, knobel) {
    var d = z.int(-4, 4), e = z.int(-5, 5);
    var u = z.nz(-3, 3); // Abstand x0 − d
    var a = knobel ? z.wahl([Q(1, 2), Q(-1, 2), Q(1, 4), Q(-1, 4), Q(3, 2), Q(-3, 2), Q(-2), Q(3)]) : Q(z.wahl([1, -1, 2, -2, 3, -3]));
    var x0 = d + u, y0 = a.mal(u * u).plus(e);
    return {
      typ: 'parametera', tr: false,
      text: 'Die Parabel $f(x) = a\\cdot ' + t.lin(d) + '^2 ' + (e < 0 ? '- ' + (-e) : (e > 0 ? '+ ' + e : '')) + '$ geht durch den Punkt $' + t.punkt(x0, y0, 'P') + '$. Bestimme $a$.',
      felder: [{ art: 'zahl', vor: '$a =$', loesung: a, typisch: [
        { wert: y0.plus(-e).durch(u), text: 'Die Klammer wird quadriert: $' + f.kl(u) + '^2 = ' + (u * u) + '$.' },
        { wert: y0.durch(u * u), text: 'Zieh zuerst $' + f.tex(e) + '$ auf beiden Seiten ab, bevor du durch ' + (u * u) + ' teilst.' },
        { wert: a.neg(), text: 'Prüf das Vorzeichen.' }
      ] }],
      tipps: ['Setze die Koordinaten von $P$ ein: $x = ' + x0 + '$ und $f(x) = ' + f.tex(y0) + '$.', 'Dann bleibt eine Gleichung mit nur einer Unbekannten $a$. Stelle nach $a$ um.'],
      weg: [
        { text: 'Punkt einsetzen:', tex: f.tex(y0) + ' = a\\cdot(' + x0 + (d > 0 ? ' - ' + d : (d < 0 ? ' + ' + (-d) : '')) + ')^2' + (e < 0 ? ' - ' + (-e) : (e > 0 ? ' + ' + e : '')) },
        { text: 'Klammer ausrechnen:', tex: f.tex(y0) + ' = ' + (u * u === 1 ? '' : u * u) + 'a' + (e < 0 ? ' - ' + (-e) : (e > 0 ? ' + ' + e : '')) }
      ].concat(e === 0 ? [] : [
        { text: (e < 0 ? '$+\\,' + (-e) + '$' : '$-\\,' + e + '$') + ' auf beiden Seiten:', tex: f.tex(y0.minus(e)) + ' = ' + (u * u === 1 ? '' : u * u) + 'a' }
      ]).concat([
        { text: u * u === 1 ? 'Fertig:' : 'Durch ' + (u * u) + ' teilen:', tex: 'a = ' + f.tex(a) }
      ]),
      grundlage: 'rechenregeln'
    };
  }

  /* Knobel: c bestimmen */
  function parameterC(z) {
    var b = z.nz(-6, 6), c = z.int(-9, 9), x0 = z.nz(-3, 3);
    var y0 = x0 * x0 + b * x0 + c;
    return {
      typ: 'parameterc', tr: false,
      text: 'Die Parabel $f(x) = x^2 ' + (b > 0 ? '+ ' : '- ') + Math.abs(b) + 'x + c$ geht durch $' + t.punkt(x0, y0, 'P') + '$. Bestimme $c$.',
      felder: [{ art: 'zahl', vor: '$c =$', loesung: c, typisch: [
        { wert: y0 + x0 * x0 + b * x0, text: 'Um $c$ allein zu bekommen, ziehst du die anderen Glieder ab. Achte auf die Vorzeichen.' },
        { wert: y0 + x0 * x0 - b * x0, text: 'Prüf $' + f.kl(x0) + '^2 = ' + (x0 * x0) + '$: Ein Quadrat ist nie negativ.' }
      ] }],
      tipps: ['Setze $x = ' + x0 + '$ und $f(x) = ' + y0 + '$ ein.', 'Rechne $' + f.kl(x0) + '^2$ und $' + f.tex(b) + '\\cdot ' + f.kl(x0) + '$ aus, dann nach $c$ umstellen.'],
      weg: [
        { text: 'Punkt einsetzen:', tex: y0 + ' = ' + f.kl(x0) + '^2 ' + (b > 0 ? '+ ' : '- ') + Math.abs(b) + '\\cdot ' + f.kl(x0) + ' + c' },
        { text: 'Ausrechnen:', tex: y0 + ' = ' + (x0 * x0 + b * x0) + ' + c' },
        { text: 'Nach $c$ umstellen:', tex: 'c = ' + y0 + ' - ' + f.kl(x0 * x0 + b * x0) + ' = ' + c }
      ],
      grundlage: 'rechenregeln'
    };
  }

  /* Knobel: a·(x − d)² + e = 0 */
  function scheitelGleichung(z) {
    var a = z.wahl([2, 3, -2, -1, 4]), d = z.nz(-5, 5), k = z.int(1, 4);
    var e = -a * k * k;
    var loes = [d + k, d - k];
    var links = t.spf(a, d, e);
    return {
      typ: 'scheitelgleichung', tr: false, text: 'Löse die Gleichung.',
      formel: links + ' = 0',
      felder: [{ art: 'menge', loesung: loes, typisch: [
        { wert: [d + k], text: 'Beim Wurzelziehen gibt es zwei Fälle, positiv und negativ.' },
        { wert: [-d + k, -d - k], text: 'Vorzeichen: Aus $' + t.lin(d) + '$ folgt $x = ' + d + ' \\pm \\ldots$.' }
      ] }],
      tipps: ['Bring zuerst die Zahl ohne Klammer nach rechts, dann teile durch $' + a + '$.', 'Dann steht da $' + t.lin(d) + '^2 = ' + (k * k) + '$. Jetzt Wurzel ziehen.'],
      weg: [
        { text: 'Zahl nach rechts:', tex: (a === -1 ? '-' : a + '\\cdot ') + t.lin(d) + '^2 = ' + (-e) },
        { text: 'Durch $' + a + '$ teilen:', tex: t.lin(d) + '^2 = ' + (k * k) },
        { text: 'Wurzel ziehen, zwei Fälle:', tex: 'x ' + (d > 0 ? '- ' : '+ ') + Math.abs(d) + ' = ' + k + '\\quad\\text{oder}\\quad x ' + (d > 0 ? '- ' : '+ ') + Math.abs(d) + ' = -' + k },
        { tex: t.menge(loes) }
      ]
    };
  }

  M.bereich({
    id: 'umstellen', gruppe: 'grundlagen', titel: 'Gleichungen und Formeln umstellen',
    kurz: 'Äquivalenzumformungen, Wurzelziehen mit zwei Lösungen, Parameter bestimmen.',
    brauchst: 'Gleichungen lösen, Funktionsgleichung aus Punkten bestimmen, Schnittpunkte berechnen',
    erklaerung:
      '<h3>Äquivalenzumformung</h3><p>Was du auf einer Seite machst, machst du auch auf der anderen. Im Buch steht die Umformung rechts hinter einem Strich:</p>' +
      '$$3x - 4 = 11 \\quad |+4 \\qquad 3x = 15 \\quad |:3 \\qquad x = 5$$' +
      '<h3>Wurzelziehen: zwei Lösungen</h3>' +
      '$$x^2 = 25 \\;\\Rightarrow\\; x_1 = 5;\\; x_2 = -5 \\qquad \\mathbb{L} = \\{-5;\\ 5\\}$$' +
      '<p>$x^2 = 0$ hat nur die Lösung 0. $x^2 = -4$ hat keine Lösung: $\\mathbb{L} = \\{\\,\\}$.</p>' +
      '$$(x - 3)^2 = 16 \\;\\Rightarrow\\; x - 3 = 4 \\text{ oder } x - 3 = -4 \\;\\Rightarrow\\; x_1 = 7;\\; x_2 = -1$$' +
      '<h3>Parameter bestimmen</h3><p>Liegt ein Punkt auf der Parabel, setzt du seine Koordinaten ein. Übrig bleibt eine Gleichung mit einer Unbekannten, zum Beispiel $a$.</p>',
    generatoren: {
      basis: [linear, linearKlammer],
      standard: [reinquadratisch, binomGleichung, function (z) { return parameterA(z, false); }],
      knobel: [function (z) { return parameterA(z, true); }, parameterC, scheitelGleichung]
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
