/* Thema 2: Parabeln – Nullstellen, Scheitelpunkt, Symmetrieachse, Öffnung (Buch S. 77). */
(function (root) {
  var M = root.M, Q = M.Q, P = M.P, f = M.f, t = M.t, g = M.g;

  function hochTief(a, richtig) {
    return { art: 'mc', label: 'Der Scheitelpunkt ist ein', loesung: a < 0 ? 0 : 1, optionen: [
      { html: 'Hochpunkt (Maximum)', warum: 'Die Parabel ist nach oben geöffnet. Der Scheitelpunkt ist der tiefste Punkt.' },
      { html: 'Tiefpunkt (Minimum)', warum: 'Die Parabel ist nach unten geöffnet. Der Scheitelpunkt ist der höchste Punkt.' }] };
  }
  function parabelMitNullstellen(z) {
    var x1, x2;
    do { x1 = z.int(-5, 5); x2 = z.int(-5, 5); } while (x1 === x2 || (x1 + x2) % 2 !== 0 || Math.abs(x1 - x2) > 6);
    var a = Q.aus(z.wahl([1, -1, Q(1, 2), Q(-1, 2)]));
    var p = P.ausNullstellen(a, x1, x2), d = (x1 + x2) / 2, e = P.wertQ(p, d);
    if (Math.abs(e.wert()) > 7) return parabelMitNullstellen(z);
    return { a: a, p: p, x1: Math.min(x1, x2), x2: Math.max(x1, x2), d: d, e: e };
  }

  /* B1: Scheitelpunkt, Symmetrieachse und Hoch/Tief am Graphen ablesen */
  function graphAblesen(z) {
    var a = Q.aus(z.wahl([1, -1, Q(1, 2), Q(-1, 2), 2, -2])), d = z.int(-4, 4), e = z.int(-4, 4);
    var p = P.ausScheitel(a, d, e);
    var w = g.fenster([[d - 3, e], [d + 3, e]], 1);
    if (a.vz() > 0) w.y[1] = Math.max(w.y[1], e + 5); else w.y[0] = Math.min(w.y[0], e - 5);
    return {
      typ: 'graphablesen2', tr: false, text: 'Lies am Graphen ab.',
      graph: { x: w.x, y: w.y, breite: 340, kurven: [{ fn: g.fn(p) }] },
      felder: [
        { art: 'punkt', label: 'Scheitelpunkt:', vor: '$S$', loesung: [d, e] },
        { art: 'zahl', label: 'Symmetrieachse: die senkrechte Gerade', vor: '$x =$', loesung: d, typisch: e !== d ? [{ wert: e, text: 'Die Symmetrieachse ist senkrecht. Sie geht durch den Scheitelpunkt, also gilt $x = $ x-Koordinate des Scheitelpunkts.' }] : [] },
        hochTief(a.wert())
      ],
      tipps: ['Der Scheitelpunkt ist der höchste oder tiefste Punkt der Parabel.', 'Die Symmetrieachse ist parallel zur y-Achse und geht durch den Scheitelpunkt.'],
      weg: [{ text: 'Scheitelpunkt ablesen:', tex: t.punkt(d, e, 'S') }, { text: 'Symmetrieachse durch den Scheitelpunkt:', tex: 'x = ' + d }, { text: a.vz() > 0 ? 'Nach oben geöffnet, also Tiefpunkt (Minimum).' : 'Nach unten geöffnet, also Hochpunkt (Maximum).' }]
    };
  }

  /* B2: Nullstellen am Graphen ablesen */
  function nullstellenAblesen(z) {
    var keine = z.chance(0.2), par, p, loes, w;
    if (keine) {
      var a = z.wahl([1, -1]), d = z.int(-3, 3), e = a * z.int(1, 3);
      p = P.ausScheitel(a, d, e); loes = []; w = g.fenster([[d - 3, e], [d + 3, e]], 2);
    } else {
      par = parabelMitNullstellen(z); p = par.p; loes = [par.x1, par.x2]; w = g.fenster([[par.x1, 0], [par.x2, 0], [par.d, par.e]], 1);
    }
    return {
      typ: 'nullstellenablesen', tr: false, text: 'Lies die Nullstellen der Parabel ab.',
      graph: { x: w.x, y: w.y, breite: 340, kurven: [{ fn: g.fn(p) }] },
      felder: [{ art: 'menge', label: 'Nullstellen:', loesung: loes, toleranz: 0.1, typisch: loes.length ? [{ wert: loes.map(function () { return 0; }).length === 2 ? [P.wertQ(p, 0).wert()] : [], text: 'Das ist der Schnittpunkt mit der y-Achse. Nullstellen liegen auf der x-Achse.' }] : [] }],
      tipps: ['Nullstellen sind die x-Werte, an denen die Parabel die x-Achse schneidet.', 'Gib nur die x-Werte an. Schneidet die Parabel die x-Achse nicht, gibt es keine Nullstellen.'],
      weg: [{ text: loes.length ? 'Die Parabel schneidet die x-Achse bei:' : 'Die Parabel schneidet die x-Achse nicht. Es gibt keine Nullstellen.', tex: loes.length ? 'x_1 = ' + loes[0] + ';\\quad x_2 = ' + loes[1] : undefined }, { tex: t.menge(loes) }]
    };
  }

  /* B3: Kopfmathematik – Scheitel-x aus den Nullstellen (Buch S. 77 Nr. 11) */
  function mitteKopf(z) {
    var x1 = z.int(-9, 6), x2 = x1 + z.int(1, 10);
    var m = Q(x1 + x2, 2);
    return {
      typ: 'mittekopf', tr: false, text: 'Kopfmathematik: Eine Parabel hat die Nullstellen $x_1 = ' + x1 + '$ und $x_2 = ' + x2 + '$. Wo liegt die Symmetrieachse?',
      felder: [{ art: 'zahl', vor: '$x =$', loesung: m, typisch: [{ wert: Q(x2 - x1, 2), text: 'Das ist der halbe Abstand. Gesucht ist die Mitte: $\\frac{x_1 + x_2}{2}$.' }] }],
      tipps: ['Die Parabel ist symmetrisch. Die Achse liegt genau in der Mitte zwischen den Nullstellen.', '$\\frac{x_1 + x_2}{2}$'],
      weg: [{ tex: 'x = \\frac{' + x1 + ' + ' + f.kl(x2) + '}{2} = ' + f.tex(m) }]
    };
  }

  /* S1: Punkt spiegeln (Buch S. 77 Nr. 12) */
  function punktSpiegeln(z) {
    var d = z.int(-4, 4), e = z.int(-4, 4), u = z.nz(-4, 4), h = z.nz(-6, 6);
    var px = d + u, py = e + h, qx = d - u;
    return {
      typ: 'punktspiegeln', tr: false,
      text: 'Eine Parabel hat den Scheitelpunkt $' + t.punkt(d, e, 'S') + '$ und geht durch $' + t.punkt(px, py, 'P') + '$.',
      felder: [
        { art: 'punkt', label: 'Gib einen weiteren Punkt der Parabel an (gespiegelt an der Symmetrieachse):', vor: "$P'$", loesung: [qx, py], typisch: [
          { wert: [-px, py], text: 'Gespiegelt wird an der Symmetrieachse $x = ' + d + '$, nicht an der y-Achse.' },
          { wert: [px, 2 * e - py], text: 'Die Symmetrieachse ist senkrecht. Beim Spiegeln bleibt die y-Koordinate gleich.' }] },
        { art: 'mc', label: 'Die Parabel ist', loesung: h > 0 ? 0 : 1, optionen: [
          { html: 'nach oben geöffnet', warum: '$P$ liegt tiefer als der Scheitelpunkt. Dann ist die Parabel nach unten geöffnet.' },
          { html: 'nach unten geöffnet', warum: '$P$ liegt höher als der Scheitelpunkt. Dann ist die Parabel nach oben geöffnet.' }] }
      ],
      tipps: ['Die Symmetrieachse ist $x = ' + d + '$. $P$ liegt ' + Math.abs(u) + ' Einheiten ' + (u > 0 ? 'rechts' : 'links') + ' davon.', 'Der Spiegelpunkt liegt genauso weit auf der anderen Seite, auf gleicher Höhe.'],
      weg: [
        { text: '$P$ liegt ' + Math.abs(u) + ' Einheiten ' + (u > 0 ? 'rechts' : 'links') + ' von der Achse $x = ' + d + '$. Der Spiegelpunkt liegt ' + Math.abs(u) + ' Einheiten ' + (u > 0 ? 'links' : 'rechts') + ':', tex: "P'(" + d + (u > 0 ? ' - ' : ' + ') + Math.abs(u) + '\\,|\\,' + py + ') = ' + t.punkt(qx, py, "P'") },
        { text: h > 0 ? '$P$ liegt höher als $S$: nach oben geöffnet.' : '$P$ liegt tiefer als $S$: nach unten geöffnet.' }
      ]
    };
  }

  /* B4: Scheitelpunkt einzeichnen (Punkt ins Koordinatensystem setzen) */
  function scheitelEinzeichnen(z) {
    var a = Q.aus(z.wahl([1, -1, 2, Q(1, 2), -2])), d = z.nz(-4, 4), e = z.nz(-4, 4);
    return {
      typ: 'scheiteleinzeichnen', tr: false,
      text: 'Markiere den Scheitelpunkt der Parabel $f(x) = ' + t.spf(a, d, e) + '$ im Koordinatensystem.',
      felder: [{ art: 'klick', name: 'S', loesung: [d, e], graph: { x: [-6, 6], y: [-6, 6], breite: 320 }, typisch: [
        { wert: [-d, e], text: 'Vorzeichenfalle: In $' + t.lin(d) + '$ steckt $d = ' + d + '$. Der Scheitelpunkt liegt bei $x = ' + d + '$.' },
        { wert: [d, -e], text: 'Die y-Koordinate ist $e = ' + e + '$, mit diesem Vorzeichen.' },
        { wert: [e, d], text: 'x und y vertauscht? Erst nach rechts oder links ($x$), dann nach oben oder unten ($y$).' }] }],
      tipps: ['Lies den Scheitelpunkt an der Scheitelpunktform $a\\cdot(x - d)^2 + e$ ab.', 'Hier ist $d = ' + d + '$ und $e = ' + e + '$.'],
      weg: [{ text: 'Scheitelpunktform ablesen:', tex: t.punkt(d, e, 'S') }, { text: 'Von $(0|0)$ aus ' + Math.abs(d) + ' nach ' + (d > 0 ? 'rechts' : 'links') + ' und ' + Math.abs(e) + ' nach ' + (e > 0 ? 'oben' : 'unten') + '.' }]
    };
  }

  /* S4: Spiegelpunkt einzeichnen */
  function spiegelpunktEinzeichnen(z) {
    var d = z.int(-2, 2), e = z.int(-3, 1), u = z.nz(-3, 3), h;
    do { h = z.int(1, 4) * z.vz(); } while (e + h < -5 || e + h > 5);
    var px = d + u, py = e + h, qx = d - u;
    return {
      typ: 'spiegelpunkteinzeichnen', tr: false,
      text: 'Eine Parabel hat den Scheitelpunkt $S$ und geht durch $P$. Markiere den Punkt $P\'$, der durch Spiegeln an der Symmetrieachse entsteht.',
      felder: [{ art: 'klick', name: "P'", loesung: [qx, py], graph: { x: [-6, 6], y: [-6, 6], breite: 320, punkte: [{ x: d, y: e, name: 'S' }, { x: px, y: py, name: 'P', farbe: '#1f5fbf' }] }, typisch: [
        { wert: [-px, py], text: 'Gespiegelt wird an der Symmetrieachse durch $S$ (bei $x = ' + d + '$), nicht an der y-Achse.' },
        { wert: [px, 2 * e - py], text: 'Die Symmetrieachse ist senkrecht. Die Höhe bleibt beim Spiegeln gleich.' }] }],
      tipps: ['Die Symmetrieachse ist die senkrechte Gerade durch $S$.', '$P$ liegt ' + Math.abs(u) + ' Einheit' + (Math.abs(u) > 1 ? 'en' : '') + ' ' + (u > 0 ? 'rechts' : 'links') + ' von der Achse. $P\'$ liegt genauso weit auf der anderen Seite, auf gleicher Höhe.'],
      weg: [{ text: 'Achse: $x = ' + d + '$. $P$ liegt ' + Math.abs(u) + ' ' + (u > 0 ? 'rechts' : 'links') + ' davon.' }, { text: 'Spiegelpunkt:', tex: t.punkt(qx, py, "P'") }]
    };
  }

  /* S2: gleiche Funktionswerte (Buch S. 77 Beispiel C) */
  function gleicheWerte(z) {
    var x1 = z.int(-6, 4), x2 = x1 + 2 * z.int(1, 4), y = z.int(-5, 9);
    var m = (x1 + x2) / 2;
    var formP = z.chance(0.5);
    return {
      typ: 'gleichewerte', tr: false,
      text: formP ? 'Die Punkte $' + t.punkt(x1, y, 'A') + '$ und $' + t.punkt(x2, y, 'B') + '$ liegen auf einer Parabel. Welche x-Koordinate hat der Scheitelpunkt?'
        : 'Für eine quadratische Funktion gilt $f(' + x1 + ') = f(' + x2 + ')$. Welche x-Koordinate hat der Scheitelpunkt?',
      felder: [{ art: 'zahl', vor: '$x_S =$', loesung: m, typisch: [{ wert: y, text: 'Gesucht ist die x-Koordinate. Sie liegt in der Mitte zwischen $' + x1 + '$ und $' + x2 + '$.' }] }],
      tipps: ['Gleiche Funktionswerte liegen symmetrisch zur Symmetrieachse.', 'Die Symmetrieachse liegt genau in der Mitte zwischen $' + x1 + '$ und $' + x2 + '$.'],
      weg: [{ text: 'Gleiche y-Werte liegen spiegelbildlich zur Symmetrieachse. Also in der Mitte:', tex: 'x_S = \\frac{' + x1 + ' + ' + f.kl(x2) + '}{2} = ' + m }]
    };
  }

  /* S3: Wertetabelle lesen (Buch S. 77 Basiswissen) */
  function tabelleLesen(z) {
    var par = parabelMitNullstellen(z);
    while (!par.e.istGanz() || Math.abs(par.x1 - par.x2) < 2) par = parabelMitNullstellen(z);
    var xs = [], von = par.x1 - 1, bis = par.x2 + 1;
    for (var x = von; x <= bis; x++) xs.push(x);
    var ys = xs.map(function (x) { return P.wertQ(par.p, x); });
    return {
      typ: 'tabellelesen', tr: false,
      text: 'Die Wertetabelle gehört zu einer quadratischen Funktion.<br><div class="tabelle-wrap"><table class="werte"><tr><th>$x$</th>' + xs.map(function (x) { return '<td>' + f.zahl(x) + '</td>'; }).join('') + '</tr><tr><th>$f(x)$</th>' + ys.map(function (y) { return '<td>' + f.zahl(y) + '</td>'; }).join('') + '</tr></table></div>',
      felder: [
        { art: 'menge', label: 'Nullstellen:', loesung: [par.x1, par.x2] },
        { art: 'punkt', label: 'Scheitelpunkt:', vor: '$S$', loesung: [par.d, par.e] },
        hochTief(par.a.wert())
      ],
      tipps: ['Nullstellen: Wo ist $f(x) = 0$?', 'Die Werte sind symmetrisch. Der Scheitelpunkt liegt in der Mitte, dort ist der größte oder kleinste Wert.'],
      weg: [
        { text: 'In der Tabelle ist $f(x) = 0$ bei:', tex: 'x_1 = ' + par.x1 + ';\\quad x_2 = ' + par.x2 },
        { text: 'Mitte der Nullstellen und dortiger Wert:', tex: t.punkt(par.d, par.e, 'S') },
        { text: par.a.vz() > 0 ? 'Dort ist der kleinste Wert: Tiefpunkt (Minimum).' : 'Dort ist der größte Wert: Hochpunkt (Maximum).' }
      ]
    };
  }

  /* K1: Maximum oder Minimum? (Check-up Nr. 3) */
  function maxMin(z) {
    var art = z.int(0, 2), a, d, e, formel, weg;
    if (art === 0) { a = z.wahl([1, -1, 2, -3]); d = 0; e = z.nz(-6, 6); formel = t.poly([e, 0, a]); weg = [{ text: 'Kein Glied mit $x$: Die Parabel ist nur in y-Richtung verschoben.', tex: t.punkt(0, e, 'S') }]; }
    else if (art === 1) { a = z.wahl([1, -1, 2, -2, Q(1, 2)]); d = z.nz(-5, 5); e = z.int(-6, 6); formel = t.spf(a, d, e); weg = [{ text: 'Scheitelpunktform:', tex: t.punkt(d, e, 'S') }]; }
    else {
      var par = parabelMitNullstellen(z); a = par.a; d = par.d; e = par.e; formel = t.fakt(a, par.x1, par.x2);
      weg = [{ text: 'Nullstellen $' + par.x1 + '$ und $' + par.x2 + '$, Mitte:', tex: 'x_S = ' + d }, { text: 'Einsetzen:', tex: 'y_S = f(' + d + ') = ' + f.tex(e) }, { tex: t.punkt(d, e, 'S') }];
    }
    a = Q.aus(a);
    weg.push({ text: a.vz() > 0 ? '$a > 0$: nach oben geöffnet, also Minimum.' : '$a < 0$: nach unten geöffnet, also Maximum.' });
    return {
      typ: 'maxmin', tr: false, text: 'Hat die Funktion ein Maximum oder ein Minimum? Gib den Scheitelpunkt an.',
      formel: 'f(x) = ' + formel,
      felder: [
        { art: 'mc', loesung: a.vz() < 0 ? 0 : 1, optionen: [{ html: 'Maximum (Hochpunkt)', warum: 'Bei $a > 0$ ist die Parabel nach oben geöffnet.' }, { html: 'Minimum (Tiefpunkt)', warum: 'Bei $a < 0$ ist die Parabel nach unten geöffnet.' }] },
        { art: 'punkt', label: 'Scheitelpunkt:', vor: '$S$', loesung: [d, e], typisch: d ? [{ wert: [-d, e], text: 'Vorzeichenfalle bei der x-Koordinate.' }] : [] }
      ],
      tipps: ['Das Vorzeichen von $a$ entscheidet: $a > 0$ Minimum, $a < 0$ Maximum.', art === 2 ? 'Bei der faktorisierten Form liegt $x_S$ in der Mitte der Nullstellen. $y_S$ bekommst du durch Einsetzen.' : 'Lies den Scheitelpunkt an der Gleichung ab.'],
      weg: weg
    };
  }

  /* K2: Scheitelpunkt aus zwei Punkten gleicher Höhe und der Scheitelhöhe */
  function scheitelAusSymmetrie(z) {
    var x1 = z.int(-6, 2), x2 = x1 + 2 * z.int(1, 4), y = z.int(-3, 6), e = y + z.nz(-6, 6);
    var m = (x1 + x2) / 2;
    return {
      typ: 'scheitelsymmetrie', tr: false,
      text: 'Eine Parabel geht durch $' + t.punkt(x1, y, 'A') + '$ und $' + t.punkt(x2, y, 'B') + '$. Ihr Scheitelpunkt hat die y-Koordinate $' + e + '$.',
      felder: [
        { art: 'punkt', label: 'Scheitelpunkt:', vor: '$S$', loesung: [m, e], typisch: [{ wert: [e, m], text: 'Zuerst die x-Koordinate, dann die y-Koordinate.' }] },
        { art: 'mc', label: 'Die Parabel ist', loesung: e < y ? 0 : 1, optionen: [{ html: 'nach oben geöffnet', warum: 'Der Scheitelpunkt liegt höher als A und B. Dann ist er der höchste Punkt.' }, { html: 'nach unten geöffnet', warum: 'Der Scheitelpunkt liegt tiefer als A und B. Dann ist er der tiefste Punkt.' }] }
      ],
      tipps: ['A und B haben dieselbe y-Koordinate. Sie liegen spiegelbildlich zur Symmetrieachse.', 'Die Symmetrieachse liegt in der Mitte von $' + x1 + '$ und $' + x2 + '$. Vergleiche dann die Höhe des Scheitelpunkts mit A und B.'],
      weg: [{ text: 'Symmetrieachse in der Mitte:', tex: 'x_S = \\frac{' + x1 + ' + ' + f.kl(x2) + '}{2} = ' + m }, { tex: t.punkt(m, e, 'S') }, { text: e < y ? 'S liegt tiefer als A und B: nach oben geöffnet.' : 'S liegt höher als A und B: nach unten geöffnet.' }]
    };
  }

  M.bereich({
    id: 'thema-02', gruppe: 'thema', titel: 'Parabeln: Graphen quadratischer Funktionen',
    erklaerung:
      '<ul><li><strong>Nullstellen</strong> sind die x-Koordinaten der Schnittpunkte der Parabel mit der x-Achse.</li>' +
      '<li>Der <strong>Scheitelpunkt</strong> ist der höchste Punkt (Hochpunkt, Maximum) oder der tiefste Punkt (Tiefpunkt, Minimum) der Parabel.</li>' +
      '<li>Die <strong>Symmetrieachse</strong> ist parallel zur y-Achse und geht durch den Scheitelpunkt.</li>' +
      '<li>Nach unten geöffnet: Scheitelpunkt ist ein Maximum. Nach oben geöffnet: ein Minimum.</li></ul>' +
      '<div class="merk">Gleiche Funktionswerte liegen symmetrisch zur Symmetrieachse. Aus $f(2) = f(6)$ folgt: Die Symmetrieachse liegt bei $x = 4$, in der Mitte.<br>' +
      'Genauso liegt der Scheitelpunkt genau in der Mitte zwischen den Nullstellen: $x_S = \\frac{x_1 + x_2}{2}$.</div>' +
      '<p>Beispiel: $f(x) = -x^2 + 2x + 3$ hat die Nullstellen $-1$ und $3$, den Scheitelpunkt $S(1|4)$ und ist nach unten geöffnet.</p>',
    generatoren: {
      basis: [graphAblesen, nullstellenAblesen, mitteKopf, scheitelEinzeichnen],
      standard: [punktSpiegeln, gleicheWerte, tabelleLesen, spiegelpunktEinzeichnen],
      knobel: [maxMin, scheitelAusSymmetrie, punktSpiegeln]
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
