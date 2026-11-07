/* Thema 1: Die quadratische Funktion – Gleichung, Tabelle, Graph; quadratisch, linear oder keins (Buch S. 75–76, AH S. 31). */
(function (root) {
  var M = root.M, Q = M.Q, P = M.P, f = M.f, t = M.t, g = M.g;

  var TYPEN = ['quadratisch', 'linear', 'keins von beiden'];
  var WARUM = {
    quadratisch: 'Nach dem Ausmultiplizieren und Zusammenfassen bleibt ein Glied mit $x^2$ übrig (und kein höheres). Das ist quadratisch.',
    linear: 'Nach dem Zusammenfassen bleibt höchstens $x$ ohne Quadrat übrig: $mx + n$. Das ist linear.',
    keins: 'Hier steht $x$ im Nenner, unter einer Wurzel, im Exponenten oder hoch 3. Das ist weder linear noch quadratisch.'
  };
  function mcTyp(richtig) {
    return TYPEN.map(function (n, i) {
      var key = i === 0 ? 'quadratisch' : (i === 1 ? 'linear' : 'keins');
      return { html: n, warum: i === richtig ? null : WARUM[['quadratisch', 'linear', 'keins'][richtig]] };
    });
  }

  /* B1: Quadratisch, linear oder keins von beiden? (Buch S. 75 Nr. 4) */
  function typErkennen(z) {
    var a = z.nz(-5, 5), b = z.nz(-6, 6), c = z.int(-9, 9), k = z.wahl([2, 3, 4]);
    var art = z.int(0, 2), tex, weg;
    if (art === 0) {
      var v = z.wahl([
        function () { return { tex: t.poly([c, b, a]), w: 'Die Gleichung hat die Form $ax^2 + bx + c$ mit $a = ' + a + ' \\neq 0$.' }; },
        function () { return { tex: k + 'x\\cdot ' + t.lin(-b), w: 'Ausmultipliziert: $' + t.poly([0, k * b, k]) + '$. Das ist quadratisch.' }; },
        function () { return { tex: t.lin(-b) + '^2', w: 'Ausmultipliziert: $' + t.poly([b * b, 2 * b, 1]) + '$. Das ist quadratisch.' }; },
        function () { return { tex: '\\frac{2}{3}x^2', w: 'Das ist $ax^2$ mit $a = \\frac{2}{3}$, also quadratisch.' }; },
        function () { return { tex: t.lin(-b) + '\\cdot ' + t.lin(k), w: 'Ausmultipliziert: $' + t.poly(P.ausNullstellen(1, -b, k)) + '$. Das ist quadratisch.' }; }
      ])();
      tex = v.tex; weg = v.w;
    } else if (art === 1) {
      var v1 = z.wahl([
        function () { return { tex: t.poly([b, a]), w: 'Die Gleichung hat die Form $mx + n$. Das ist linear.' }; },
        function () { return { tex: k + '\\cdot ' + t.lin(-b), w: 'Ausmultipliziert: $' + t.poly([k * b, k]) + '$. Kein $x^2$, also linear.' }; },
        function () { return { tex: '\\frac{x}{' + k + '} ' + (b > 0 ? '+ ' : '- ') + Math.abs(b), w: '$\\frac{x}{' + k + '} = \\frac{1}{' + k + '}x$. Das ist $mx + n$, also linear.' }; },
        function () { return { tex: '-x', w: 'Das ist $mx$ mit $m = -1$, also linear.' }; }
      ])();
      tex = v1.tex; weg = v1.w;
    } else {
      var v2 = z.wahl([
        function () { return { tex: '\\frac{1}{x}', w: '$x$ steht im Nenner. Das ist weder linear noch quadratisch.' }; },
        function () { return { tex: 'x^3 ' + (b > 0 ? '+ ' : '- ') + Math.abs(b), w: 'Die höchste Potenz ist $x^3$. Das ist weder linear noch quadratisch.' }; },
        function () { return { tex: '\\frac{2}{x^2 + x}', w: '$x$ steht im Nenner. Das ist weder linear noch quadratisch.' }; },
        function () { return { tex: '\\sqrt{x}', w: '$x$ steht unter der Wurzel. Das ist weder linear noch quadratisch.' }; }
      ])();
      tex = v2.tex; weg = v2.w;
    }
    return {
      typ: 'typerkennen', tr: false, text: 'Ist die Funktion quadratisch, linear oder keins von beiden?',
      formel: 'y = ' + tex,
      felder: [{ art: 'mc', loesung: art, optionen: mcTyp(art) }],
      tipps: ['Multipliziere Klammern aus und fasse zusammen. Dann schau, welche Potenz von $x$ die höchste ist.', 'Quadratisch: $ax^2 + bx + c$ mit $a \\neq 0$. Linear: $mx + n$. Steht $x$ im Nenner oder unter einer Wurzel, ist es keins von beiden.'],
      weg: [{ text: weg }]
    };
  }

  /* B2: Koeffizienten ablesen (AH S. 31 Nr. 3) */
  function koeffizienten(z) {
    var a = z.nz(-5, 5), b = z.int(-6, 6), c = z.int(-9, 9);
    if (b === 0 && c === 0) c = z.nz(-9, 9);
    var glieder = z.mischen([{ c: a, v: 'x^2' }, { c: b, v: 'x' }, { c: c, v: '' }].filter(function (gl) { return gl.c !== 0; }));
    var tex = g.summe(glieder);
    return {
      typ: 'koeffizienten', tr: false,
      text: 'Gib die Koeffizienten $a$, $b$ und $c$ der quadratischen Funktion an.',
      formel: 'f(x) = ' + tex,
      felder: [
        { art: 'zahl', vor: '$a =$', loesung: a, typisch: [{ wert: b, text: '$a$ ist der Faktor vor $x^2$, nicht vor $x$.' }, { wert: -a, text: 'Das Vorzeichen gehört dazu.' }] },
        { art: 'zahl', vor: '$b =$', loesung: b, typisch: [{ wert: a, text: '$b$ ist der Faktor vor $x$.' }, { wert: -b, text: 'Das Vorzeichen gehört dazu.' }] },
        { art: 'zahl', vor: '$c =$', loesung: c, typisch: [{ wert: -c, text: 'Das Vorzeichen gehört dazu.' }] }
      ],
      tipps: ['Sortiere zuerst nach der Form $ax^2 + bx + c$.', 'Fehlt ein Glied, ist sein Koeffizient 0. Vorzeichen gehören immer zum Koeffizienten.'],
      weg: [{ text: 'Sortieren:', tex: 'f(x) = ' + t.poly([c, b, a]) }, { tex: 'a = ' + a + ';\\quad b = ' + b + ';\\quad c = ' + c }]
    };
  }

  /* B3 / Thema 9: Punktprobe (AH S. 31 Nr. 4) */
  function punktprobe(z) {
    var a = Q(z.wahl([1, 1, -1, 2])), b = Q(z.int(-4, 4)), c = Q(z.int(-6, 6));
    var p = [c, b, a];
    var x1 = z.int(-3, -1), x2 = z.int(1, 3);
    var y1 = P.wertQ(p, x1), y2 = P.wertQ(p, x2);
    var drauf1 = z.chance(0.5), drauf2 = z.chance(0.5);
    var fehl1 = g.einsetzenFehler(p, x1);
    var py1 = drauf1 ? y1 : (fehl1.length ? Q.aus(fehl1[0].wert) : y1.plus(z.nz(-3, 3)));
    if (!drauf1 && py1.gleich(y1)) py1 = y1.plus(2);
    var py2 = drauf2 ? y2 : y2.plus(z.nz(-3, 3));
    var e1 = g.einsetzen(p, x1), e2 = g.einsetzen(p, x2);
    function mc(drauf, x, yp, y) {
      return { art: 'mc', loesung: drauf ? 0 : 1, label: 'Liegt $' + t.punkt(x, yp, x < 0 ? 'P' : 'Q') + '$ auf dem Graphen?', optionen: [
        { html: 'ja', warum: '$f(' + x + ') = ' + f.tex(y) + '$, nicht $' + f.tex(yp) + '$. Prüf beim Einsetzen die Vorzeichen.' },
        { html: 'nein', warum: '$f(' + x + ') = ' + f.tex(y) + '$. Das ist genau die y-Koordinate. Der Punkt liegt drauf.' }] };
    }
    return {
      typ: 'punktprobe', tr: false, text: 'Gegeben ist $f(x) = ' + t.poly(p) + '$. Prüfe mit der Punktprobe.',
      felder: [mc(drauf1, x1, py1, y1), mc(drauf2, x2, py2, y2)],
      tipps: ['Punktprobe: Setz die x-Koordinate ein und vergleiche $f(x)$ mit der y-Koordinate.', 'Negative Zahlen in Klammern einsetzen: $f(' + x1 + ') = ' + e1.weg[0].tex.split('= ')[1] + '$'],
      weg: e1.weg.concat([{ text: '$f(' + x1 + ') = ' + f.tex(y1) + '$. ' + (drauf1 ? 'Stimmt mit der y-Koordinate überein: P liegt auf dem Graphen.' : 'Die y-Koordinate ist $' + f.tex(py1) + '$: P liegt nicht auf dem Graphen.') }])
        .concat(e2.weg).concat([{ text: '$f(' + x2 + ') = ' + f.tex(y2) + '$. ' + (drauf2 ? 'Q liegt auf dem Graphen.' : 'Die y-Koordinate ist $' + f.tex(py2) + '$: Q liegt nicht auf dem Graphen.') }]),
      grundlage: 'rechenregeln'
    };
  }

  /* S1: In die allgemeine Form bringen (Buch S. 75 Beispiel B, S. 76 Nr. 5) */
  function allgemeineForm(z) {
    var art = z.int(0, 3), formel, erg, weg, typ = [];
    var a = z.nz(-6, 6), b = z.nz(-8, 8), k = z.wahl([2, 3, -2]);
    if (art === 0) {
      if (a === -b) b++;
      erg = P.ausNullstellen(1, -a, b); formel = t.lin(-a) + '\\cdot ' + t.lin(b);
      weg = [{ text: 'Jeder mit jedem:', tex: g.summe([{ c: 1, v: 'x^2' }, { c: -b, v: 'x' }, { c: a, v: 'x' }, { c: -a * b, v: '' }]) }, { text: 'Zusammenfassen:', tex: '= ' + t.poly(erg) }];
      typ.push({ wert: [erg[0], Q(0), Q(1)], text: 'Jeder mit jedem: Das Glied mit $x$ fehlt.' });
    } else if (art === 1) {
      erg = P.ausNullstellen(k, 0, b); formel = k + 'x\\cdot ' + t.lin(b);
      weg = [{ text: '$' + k + 'x$ mit jedem Glied der Klammer malnehmen:', tex: '= ' + t.poly(erg) }];
      typ.push({ wert: [Q(0), Q(-b), Q(k)], text: 'Auch das zweite Glied der Klammer wird mit $' + k + 'x$ malgenommen.' });
    } else if (art === 2) {
      var e = z.int(-6, 6);
      erg = P.ausScheitel(k, a, e); formel = t.spf(k, a, e);
      weg = [{ text: 'Binomische Formel:', tex: t.lin(a) + '^2 = ' + t.poly(P.ausScheitel(1, a, 0)) }, { text: 'Mit $' + k + '$ malnehmen und zusammenfassen:', tex: '= ' + t.poly(erg) }];
      typ.push({ wert: [Q(-k * a * a + e), Q(0), Q(k)], text: 'Binomische Formel: $' + t.lin(a) + '^2 = ' + t.poly(P.ausScheitel(1, a, 0)) + '$.' });
    } else {
      var m = 2 * z.nz(-5, 5);
      erg = [Q(m / 2), Q(0), Q(k)]; formel = '\\frac{' + t.poly([m, 0, 2 * k]) + '}{2}';
      weg = [{ text: 'Jedes Glied durch 2 teilen:', tex: '= ' + t.poly(erg) }];
      typ.push({ wert: [Q(m), Q(0), Q(k)], text: 'Beide Glieder werden durch 2 geteilt.' });
    }
    return {
      typ: 'allgform', tr: false, text: 'Zeige, dass die Funktion quadratisch ist: Bring sie in die Form $f(x) = ax^2 + bx + c$.',
      formel: 'f(x) = ' + formel,
      felder: [{ art: 'term', vor: '$f(x) =$', loesung: erg, form: 'allg', typisch: typ }],
      tipps: ['Klammern ausmultiplizieren, dann gleiche Glieder zusammenfassen.', 'Ist am Ende $a \\neq 0$, ist die Funktion quadratisch.'],
      weg: weg, grundlage: art === 2 ? 'binome' : 'klammern'
    };
  }

  /* S2: Wertetabelle (AH S. 31 Nr. 1) */
  function wertetabelle(z) {
    var halbe = z.chance(0.4);
    var a = halbe ? Q(z.wahl([1, -1, 2])) : Q.aus(z.wahl([1, -1, 2, Q(1, 2), Q(-1, 2)]));
    var b = halbe ? Q(0) : Q(z.int(-3, 3)), c = Q(z.int(-4, 4));
    var p = [c, b, a];
    var xs = halbe ? [-1.5, -1, -0.5, 0, 0.5, 1, 1.5] : [-2, -1, 0, 1, 2];
    var ys = xs.map(function (x) { return P.wertQ(p, x); });
    var vorgabe = xs.map(function (x, i) { return x === 0 ? ys[i] : null; });
    return {
      typ: 'wertetabelle1', tr: false, text: 'Fülle die Wertetabelle für $f(x) = ' + t.poly(p) + '$ aus.',
      felder: [{ art: 'tabelle', xs: xs, loesung: ys, vorgabe: vorgabe, typisch: xs.map(function (x) { return g.einsetzenFehler(p, x); }) }],
      tipps: ['Setz jeden x-Wert ein. Negative Zahlen in Klammern.', halbe ? '$(-0{,}5)^2 = 0{,}25$ und $(-1{,}5)^2 = 2{,}25$.' : 'Die Tabelle ist symmetrisch, wenn $b = 0$ ist. Sonst nicht.'],
      weg: g.einsetzen(p, xs[0]).weg.concat([{ text: 'Alle Werte:', tex: xs.map(function (x, i) { return 'f(' + f.tex(x) + ') = ' + f.tex(ys[i]); }).join(',\\ ') }]),
      grundlage: 'rechenregeln'
    };
  }

  /* S3: Tabelle zur Gleichung zuordnen (AH S. 31 Nr. 2) */
  function tabelleZuordnen(z) {
    var a = z.wahl([1, -1, 2]), b = z.nz(-3, 3), c = z.nz(-4, 4);
    var richtig = [Q(c), Q(b), Q(a)];
    var kand = [richtig, [Q(c), Q(-b), Q(a)], [Q(-c), Q(b), Q(a)], [Q(c), Q(b), Q(-a)], [Q(c), Q(0), Q(a)]];
    var opts = [richtig].concat(z.mischen(kand.slice(1)).slice(0, 3));
    var gemischt = z.mischen(opts);
    var xs = [-2, -1, 0, 1, 2], ys = xs.map(function (x) { return P.wertQ(richtig, x); });
    return {
      typ: 'tabellezuordnen', tr: false,
      text: 'Welche Funktionsgleichung passt zur Wertetabelle?<br>' +
        '<table class="werte"><tr><th>$x$</th>' + xs.map(function (x) { return '<td>' + f.zahl(x) + '</td>'; }).join('') + '</tr><tr><th>$f(x)$</th>' + ys.map(function (y) { return '<td>' + f.zahl(y) + '</td>'; }).join('') + '</tr></table>',
      felder: [{ art: 'mc', loesung: gemischt.indexOf(richtig), optionen: gemischt.map(function (p) {
        return { tex: 'f(x) = ' + t.poly(p), warum: p === richtig ? null : 'Setz zur Probe zwei x-Werte aus der Tabelle ein, z. B. $x = 0$ und $x = 1$.' };
      }) }],
      tipps: ['Bei $x = 0$ steht in der Tabelle $c$, also der y-Achsenabschnitt.', 'Setz noch $x = 1$ und $x = -1$ ein, um die anderen Gleichungen auszuschließen.'],
      weg: [{ text: 'Bei $x = 0$ steht ' + f.zahl(ys[2]) + ', also $c = ' + c + '$.' }, { text: 'Probe mit $x = 1$ und $x = -1$:', tex: 'f(1) = ' + f.tex(ys[3]) + ',\\quad f(-1) = ' + f.tex(ys[1]) }, { text: 'Passend:', tex: 'f(x) = ' + t.poly(richtig) }]
    };
  }

  /* K1: versteckt linear oder quadratisch */
  function versteckt(z) {
    var a = z.nz(-6, 6), k = z.wahl([2, 3]);
    var v = z.wahl([
      { tex: t.lin(-a) + '^2 - x^2', erg: [Q(a * a), Q(2 * a)], art: 1 },
      { tex: 'x\\cdot ' + t.lin(a) + ' - x^2 + 3', erg: [Q(3), Q(-a)], art: 1 },
      { tex: k + 'x\\cdot ' + t.lin(-a) + ' - ' + k + 'x^2', erg: [Q(0), Q(k * a)], art: 1 },
      { tex: '(x + ' + Math.abs(a) + ')\\cdot(x - ' + Math.abs(a) + ') + ' + (a * a), erg: [Q(0), Q(0), Q(1)], art: 0 },
      { tex: 'x^2 - ' + t.lin(a) + '^2', erg: [Q(-a * a), Q(2 * a)], art: 1 },
      { tex: t.lin(-a) + '^2 - 2x^2', erg: [Q(a * a), Q(2 * a), Q(-1)], art: 0 }
    ]);
    return {
      typ: 'versteckt', tr: false, text: 'Ist die Funktion quadratisch, linear oder keins von beiden? Multipliziere zuerst aus.',
      formel: 'y = ' + v.tex,
      felder: [{ art: 'mc', loesung: v.art, optionen: mcTyp(v.art) }],
      tipps: ['Auf den ersten Blick sieht man $x^2$. Aber hebt es sich vielleicht weg?', 'Multipliziere alles aus und fasse zusammen.'],
      weg: [{ text: 'Ausmultiplizieren und zusammenfassen:', tex: 'y = ' + t.poly(v.erg) }, { text: v.art === 0 ? 'Es bleibt ein Glied mit $x^2$: quadratisch.' : 'Das $x^2$ hebt sich weg: linear.' }],
      grundlage: 'binome'
    };
  }

  /* K2: Rechteck vergrößern (Buch S. 76 Nr. 9) */
  function rechteck(z) {
    var L = z.int(4, 9), B = z.int(2, L - 1);
    var A = P.ausNullstellen(1, -L, -B), u = [Q(2 * (L + B)), Q(4)];
    return {
      typ: 'rechteck', tr: false,
      text: 'Ein Rechteck ist ' + L + ' cm lang und ' + B + ' cm breit. Länge und Breite werden jeweils um $x$ cm vergrößert. Gib den Umfang $u(x)$ und den Flächeninhalt $A(x)$ an. Welche Funktion ist quadratisch?',
      felder: [
        { art: 'term', vor: '$u(x) =$', loesung: u, typisch: [{ wert: [Q(L + B), Q(2)], text: 'Der Umfang ist $2\\cdot$Länge $+ 2\\cdot$Breite.' }] },
        { art: 'term', vor: '$A(x) =$', loesung: A, form: 'allg', typisch: [{ wert: [Q(L * B), Q(0), Q(1)], text: 'Jeder mit jedem: $(' + L + ' + x)\\cdot(' + B + ' + x)$ hat auch Glieder mit $x$.' }] },
        { art: 'mc', label: 'Quadratisch ist:', loesung: 1, optionen: [{ html: 'der Umfang $u(x)$', warum: '$u(x)$ hat kein $x^2$, also linear.' }, { html: 'der Flächeninhalt $A(x)$' }, { html: 'beide', warum: '$u(x)$ hat kein $x^2$, also linear.' }] }
      ],
      tipps: ['Neue Länge $' + L + ' + x$, neue Breite $' + B + ' + x$.', '$u = 2\\cdot(\\text{Länge} + \\text{Breite})$, $A = \\text{Länge}\\cdot\\text{Breite}$. Danach ausmultiplizieren.'],
      weg: [
        { text: 'Umfang:', tex: 'u(x) = 2\\cdot(' + L + ' + x) + 2\\cdot(' + B + ' + x) = ' + t.poly(u) },
        { text: 'Flächeninhalt:', tex: 'A(x) = (' + L + ' + x)\\cdot(' + B + ' + x) = ' + t.poly(A) },
        { text: 'Der Umfang wächst gleichmäßig (linear), der Flächeninhalt immer stärker (quadratisch).' }
      ],
      grundlage: 'klammern'
    };
  }

  M.g.punktprobe = punktprobe;

  M.bereich({
    id: 'thema-01', gruppe: 'thema', titel: 'Die quadratische Funktion',
    erklaerung:
      '<div class="merk">Eine Funktion mit der Funktionsgleichung $f(x) = ax^2 + bx + c$ mit $a \\neq 0$ heißt <strong>quadratische Funktion</strong>. $a$, $b$ und $c$ heißen Koeffizienten. Ihr Graph heißt <strong>Parabel</strong>.</div>' +
      '<p>Beispiel Kugelstoßen: $h(x) = -0{,}1x^2 + 0{,}8x + 2$ (Weite $x$ in m, Höhe $h(x)$ in m). Dann ist $a = -0{,}1$, $b = 0{,}8$, $c = 2$.</p>' +
      '<h3>Ist das quadratisch?</h3><p>Klammern ausmultiplizieren und zusammenfassen. Bleibt $ax^2 + bx + c$ mit $a \\neq 0$, ist die Funktion quadratisch:</p>' +
      '$$f(x) = (x - 2)\\cdot(x - 1) = x^2 - 2x - x + 2 = x^2 - 3x + 2$$' +
      '<p>Also quadratisch mit $a = 1$; $b = -3$; $c = 2$. Bei $mx + n$ ist sie linear. Steht $x$ im Nenner oder unter einer Wurzel, ist sie keins von beiden.</p>' +
      '<h3>Punktprobe</h3><p>Liegt $P(-2|5)$ auf dem Graphen von $f(x) = x^2 - 1$? Einsetzen: $f(-2) = (-2)^2 - 1 = 3 \\neq 5$. Nein.</p>',
    generatoren: {
      basis: [typErkennen, koeffizienten, punktprobe],
      standard: [allgemeineForm, wertetabelle, tabelleZuordnen],
      knobel: [versteckt, rechteck, allgemeineForm]
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
