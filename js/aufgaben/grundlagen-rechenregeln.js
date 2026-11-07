/* Grundlage 1: Punkt vor Strich, Potenzen, Vorzeichen, Einsetzen. */
(function (root) {
  var M = root.M, Q = M.Q, f = M.f, t = M.t, g = M.g;

  function zahlAufgabe(z, o) {
    return {
      typ: o.typ, tr: false, text: o.text, formel: o.formel,
      felder: [{ art: 'zahl', label: o.label, loesung: o.loesung, typisch: o.typisch }],
      tipps: o.tipps, weg: o.weg, grundlage: o.grundlage
    };
  }

  /* Basis 1: Punkt vor Strich */
  function punktVorStrich(z) {
    var a = z.int(2, 20), b = z.int(2, 9), c = z.int(2, 9), d = z.int(2, 9);
    var vorlagen = [
      { tex: a + ' + ' + b + '\\cdot ' + c, wert: a + b * c, falsch: (a + b) * c, s: b + '\\cdot ' + c + ' = ' + (b * c), rest: a + ' + ' + (b * c) },
      { tex: a + ' - ' + b + '\\cdot ' + c, wert: a - b * c, falsch: (a - b) * c, s: b + '\\cdot ' + c + ' = ' + (b * c), rest: a + ' - ' + (b * c) },
      { tex: '-' + a + ' + ' + b + '\\cdot ' + c, wert: -a + b * c, falsch: (-a + b) * c, s: b + '\\cdot ' + c + ' = ' + (b * c), rest: '-' + a + ' + ' + (b * c) },
      { tex: a + '\\cdot ' + b + ' - ' + c + '\\cdot ' + d, wert: a * b - c * d, falsch: (a * b - c) * d, s: a + '\\cdot ' + b + ' = ' + (a * b) + '\\text{ und }' + c + '\\cdot ' + d + ' = ' + (c * d), rest: (a * b) + ' - ' + (c * d) },
      { tex: (b * c + a) + ' - ' + (b * c) + ' : ' + c, wert: b * c + a - b, falsch: (a) / c, s: (b * c) + ' : ' + c + ' = ' + b, rest: (b * c + a) + ' - ' + b }
    ];
    var v = z.wahl(vorlagen);
    var typisch = [];
    if (Number.isInteger(v.falsch) && v.falsch !== v.wert) typisch.push({ wert: v.falsch, text: 'Du hast von links nach rechts gerechnet. Punktrechnung (· und :) kommt vor Strichrechnung (+ und −).' });
    return zahlAufgabe(z, {
      typ: 'pvs', text: 'Berechne ohne Taschenrechner.', formel: v.tex, label: 'Ergebnis:',
      loesung: v.wert, typisch: typisch,
      tipps: ['Was wird zuerst gerechnet: Malnehmen und Teilen oder Plus und Minus?', 'Rechne zuerst $' + v.s + '$.'],
      weg: [
        { text: 'Punktrechnung zuerst:', tex: v.s },
        { text: 'Einsetzen und dann die Strichrechnung:', tex: v.tex + ' = ' + v.rest + ' = ' + f.tex(v.wert) }
      ]
    });
  }

  /* Basis 2: Potenzen und Vorzeichen */
  function potenzen(z) {
    var a = z.int(2, 9), b = z.int(2, 9);
    var vorlagen = [
      { tex: '(-' + b + ')^2', wert: b * b, typisch: [{ wert: -b * b, text: 'Die Klammer gehört zum Quadrat: $(-' + b + ')\\cdot(-' + b + ') = ' + (b * b) + '$. Minus mal Minus ergibt Plus.' }],
        weg: [{ text: 'Das Quadrat gilt für die ganze Klammer, also auch für das Minus:', tex: '(-' + b + ')^2 = (-' + b + ')\\cdot(-' + b + ') = ' + (b * b) }] },
      { tex: '-' + b + '^2', wert: -b * b, typisch: [{ wert: b * b, text: 'Bei $-' + b + '^2$ wird nur die ' + b + ' quadriert. Das Minus bleibt stehen: $-' + b + '^2 = -(' + b + '\\cdot ' + b + ')$.' }],
        weg: [{ text: 'Ohne Klammer wird nur die Zahl quadriert. Das Minus bleibt davor:', tex: '-' + b + '^2 = -(' + b + '\\cdot ' + b + ') = ' + (-b * b) }] },
      { tex: a + ' - ' + b + '^2', wert: a - b * b, typisch: [{ wert: (a - b) * (a - b), text: 'Potenz kommt vor Strichrechnung. Rechne zuerst $' + b + '^2$.' }, { wert: a + b * b, text: 'Nur die ' + b + ' wird quadriert, das Minus davor bleibt: $' + a + ' - ' + (b * b) + '$.' }],
        weg: [{ text: 'Potenz zuerst:', tex: b + '^2 = ' + (b * b) }, { text: 'Dann die Strichrechnung:', tex: a + ' - ' + (b * b) + ' = ' + (a - b * b) }] },
      { tex: a + '\\cdot ' + b + '^2', wert: a * b * b, typisch: [{ wert: a * a * b * b, text: 'Die Potenz gehört nur zur ' + b + '. Erst $' + b + '^2$, dann mal ' + a + '.' }],
        weg: [{ text: 'Potenz vor Punktrechnung:', tex: b + '^2 = ' + (b * b) }, { tex: a + '\\cdot ' + (b * b) + ' = ' + (a * b * b) }] },
      { tex: a + ' - (-' + b + ')^2', wert: a - b * b, typisch: [{ wert: a + b * b, text: '$(-' + b + ')^2 = ' + (b * b) + '$. Davor steht aber noch ein Minus: $' + a + ' - ' + (b * b) + '$.' }],
        weg: [{ text: 'Zuerst die Potenz:', tex: '(-' + b + ')^2 = ' + (b * b) }, { text: 'Das Minus davor bleibt stehen:', tex: a + ' - ' + (b * b) + ' = ' + (a - b * b) }] }
    ];
    var v = z.wahl(vorlagen);
    return zahlAufgabe(z, {
      typ: 'potenz', text: 'Berechne ohne Taschenrechner.', formel: v.tex, label: 'Ergebnis:', loesung: v.wert, typisch: v.typisch,
      tipps: ['Reihenfolge: Klammern, dann Potenzen, dann Punkt-, dann Strichrechnung.', 'Schau genau hin: Gehört das Minus zur Klammer, die quadriert wird, oder steht es davor?'],
      weg: v.weg
    });
  }

  /* Standard 3 und Knobel 5: Einsetzen in einen Funktionsterm */
  function einsetzenAufgabe(z, knobel) {
    var a = knobel ? z.wahl([Q(1, 2), Q(-1, 2), Q(-3, 2), Q(3, 2)]) : Q(z.wahl([1, -1, 2, -2, 3, -3]));
    var b = Q(z.nz(-6, 6)), c = Q(z.int(-9, 9));
    var x = knobel ? Q(z.wahl([-4, -3, -2, -1, 3])) : Q(z.int(-4, -1));
    var p = [c, b, a];
    var e = g.einsetzen(p, x);
    return {
      typ: 'einsetzen', tr: false,
      text: 'Gegeben ist $f(x) = ' + t.poly(p) + '$. Berechne $f(' + f.tex(x) + ')$.',
      felder: [{ art: 'zahl', vor: '$f(' + f.tex(x) + ') =$', loesung: e.erg, typisch: g.einsetzenFehler(p, x) }],
      tipps: ['Setze $' + f.kl(x) + '$ überall für $x$ ein. Negative Zahlen immer in Klammern.', 'Reihenfolge: erst $' + f.kl(x) + '^2$ berechnen, dann malnehmen, dann addieren und subtrahieren.'],
      weg: e.weg
    };
  }

  /* Standard 4: Klammer und Potenz im Ausdruck */
  function klammerPotenz(z) {
    var a = z.int(10, 40), b = z.int(2, 4), c = z.int(1, 5), d = z.int(c + 1, c + 4);
    var dif = c - d; // negativ
    var wert = a - b * dif * dif;
    var tex = a + ' - ' + b + '\\cdot (' + c + ' - ' + d + ')^2';
    return zahlAufgabe(z, {
      typ: 'klammerpotenz', text: 'Berechne ohne Taschenrechner.', formel: tex, label: 'Ergebnis:', loesung: wert,
      typisch: [
        { wert: (a - b) * dif * dif, text: 'Punkt vor Strich: Erst $' + b + '\\cdot ' + (dif * dif) + '$, dann subtrahieren.' },
        { wert: a + b * dif * dif, text: 'Das Quadrat von $' + dif + '$ ist positiv, aber das Minus vor ' + b + ' bleibt stehen.' },
        { wert: a - b * b * dif * dif, text: 'Quadriert wird nur die Klammer, nicht die ' + b + '.' }
      ],
      tipps: ['Reihenfolge: Klammer, Potenz, Punkt, Strich.', 'Die Klammer ergibt $' + c + ' - ' + d + ' = ' + dif + '$. Was ist $(' + dif + ')^2$?'],
      weg: [
        { text: 'Klammer zuerst:', tex: tex + ' = ' + a + ' - ' + b + '\\cdot (' + dif + ')^2' },
        { text: 'Dann die Potenz:', tex: '= ' + a + ' - ' + b + '\\cdot ' + (dif * dif) },
        { text: 'Dann Punktrechnung:', tex: '= ' + a + ' - ' + (b * dif * dif) },
        { text: 'Zum Schluss Strichrechnung:', tex: '= ' + wert }
      ]
    });
  }

  /* Knobel 6: Wertetabelle */
  function wertetabelle(z) {
    var a = z.wahl([Q(1), Q(-1), Q(2), Q(-2), Q(1, 2), Q(-1, 2)]);
    var b = Q(z.int(-4, 4)), c = Q(z.int(-5, 5));
    var p = [c, b, a];
    var xs = [-2, -1, 0, 1, 2];
    var ys = xs.map(function (x) { return M.P.wertQ(p, x); });
    var typ = xs.map(function (x) { return g.einsetzenFehler(p, x); });
    var e = g.einsetzen(p, -2);
    return {
      typ: 'wertetabelle', tr: false,
      text: 'Fülle die Wertetabelle für $f(x) = ' + t.poly(p) + '$ aus.',
      felder: [{ art: 'tabelle', xs: xs, loesung: ys, vorgabe: [null, null, ys[2], null, null], typisch: typ }],
      tipps: ['Setze jeden x-Wert einzeln ein. Negative Zahlen in Klammern.', 'Bei $x = 0$ bleibt nur die Zahl ohne $x$ übrig. Prüf damit, ob du richtig einsetzt.'],
      weg: e.weg.concat([{ text: 'Genauso für die anderen Werte. Alle Ergebnisse:', tex: xs.map(function (x, i) { return 'f(' + x + ') = ' + f.tex(ys[i]); }).join(',\\quad ') }])
    };
  }

  M.bereich({
    id: 'rechenregeln', gruppe: 'grundlagen', titel: 'Punkt vor Strich und Vorzeichen',
    kurz: 'Rechenreihenfolge, Quadrate von negativen Zahlen, Werte in Funktionsterme einsetzen.',
    brauchst: 'Wertetabellen, Funktionswerte berechnen, Probe machen, Punkte prüfen',
    erklaerung:
      '<div class="merk"><strong>Reihenfolge:</strong> 1. Klammern → 2. Potenzen → 3. Punktrechnung (· und :) → 4. Strichrechnung (+ und −)</div>' +
      '<h3>Minus und Quadrat</h3>' +
      '<p>$(-3)^2 = (-3)\\cdot(-3) = 9$, denn die Klammer wird quadriert.</p>' +
      '<p>$-3^2 = -(3\\cdot 3) = -9$, denn ohne Klammer wird nur die 3 quadriert.</p>' +
      '<h3>Einsetzen in einen Funktionsterm</h3>' +
      '<p>Negative Zahlen beim Einsetzen <strong>immer in Klammern</strong> schreiben. Beispiel: $f(x) = -x^2 + 2x$, gesucht $f(-3)$:</p>' +
      '$$f(-3) = -(-3)^2 + 2\\cdot(-3) = -9 - 6 = -15$$' +
      '<p>Das Minus vor $x^2$ bleibt stehen, das Quadrat von $(-3)$ ist $+9$.</p>',
    generatoren: {
      basis: [punktVorStrich, potenzen],
      standard: [function (z) { return einsetzenAufgabe(z, false); }, klammerPotenz, potenzen],
      knobel: [function (z) { return einsetzenAufgabe(z, true); }, wertetabelle]
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
