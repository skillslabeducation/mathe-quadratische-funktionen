/* Wiederholungsblatt der Lehrerin (15 Aufgabentypen). Jede Aufgabe gibt es mit den Zahlen vom Blatt
   (original = true) und mit neuen Zahlen. Die Aufgabentexte sind sinngemäß wiedergegeben. */
(function (root) {
  var M = root.M, Q = M.Q, P = M.P, f = M.f, t = M.t, g = M.g;
  var L = [];
  function A(nr, titel, gen) { L.push({ nr: nr, titel: titel, gen: gen }); }
  var BUCHST = 'abcdef';
  function lab(i, tex) { return BUCHST[i] + ') ' + tex; }
  function grafik(kurven, punkte, x, y) { return { x: x || [-7, 7], y: y || [-7, 7], breite: 320, einheit: 20, kurven: kurven, punkte: punkte || [] }; }
  function fnS(a, d, e) { a = Number(a); d = Number(d); e = Number(e); return function (x) { return a * (x - d) * (x - d) + e; }; }

  /* 1: Liegt der Punkt auf der Normalparabel? */
  A(1, 'Liegt der Punkt auf der Normalparabel?', function (z, orig) {
    var pkte = orig ? [[Q(9, 2), Q(22)], [Q(23, 10), Q(529, 100)]] : [0, 1].map(function () {
      var x = Q(z.int(11, 49) * z.vz(), 10), x2 = x.mal(x), drauf = z.chance(0.5);
      var y = drauf ? x2 : (z.chance(0.4) ? x.mal(2) : x2.plus(Q(z.wahl([-2, -1, 1, 2, 3]), z.wahl([1, 2, 4]))));
      return [x, y];
    });
    var namen = ['A', 'B'];
    return {
      typ: 'wb1', tr: false, text: 'Liegt der Punkt auf der Normalparabel $y = x^2$?',
      felder: pkte.map(function (p, i) {
        var drauf = p[0].mal(p[0]).gleich(p[1]);
        return { art: 'mc', label: lab(i, '$' + t.punkt(p[0], p[1], namen[i]) + '$'), loesung: drauf ? 0 : 1, optionen: [
          { html: 'ja', warum: '$' + f.tex(p[0]) + '^2 = ' + f.tex(p[0].mal(p[0])) + '$, nicht $' + f.tex(p[1]) + '$.' },
          { html: 'nein', warum: '$' + f.kl(p[0]) + '^2 = ' + f.tex(p[0].mal(p[0])) + '$. Das ist genau die y-Koordinate.' }] };
      }),
      tipps: ['Auf der Normalparabel gilt $y = x^2$. Quadriere die x-Koordinate.', 'Ohne Taschenrechner: $4{,}5^2 = 4{,}5\\cdot 4{,}5$. Rechne $45\\cdot 45$ und setze das Komma: zwei Nachkommastellen.'],
      weg: pkte.map(function (p, i) {
        var x2 = p[0].mal(p[0]), drauf = x2.gleich(p[1]);
        return { text: BUCHST[i] + ') ' + (drauf ? 'Stimmt: Der Punkt liegt auf der Normalparabel.' : 'Stimmt nicht: Der Punkt liegt nicht auf der Normalparabel.'), tex: f.kl(p[0]) + '^2 = ' + f.tex(x2) + (drauf ? ' = ' : ' \\neq ') + f.tex(p[1]) };
      }),
      grundlage: 'rechenregeln'
    };
  });

  /* 2: Graph zeichnen, Nullstellen ablesen */
  A(2, 'Graph zeichnen und Nullstellen ablesen', function (z, orig) {
    var k = orig ? 2 : z.int(1, 4), a = orig ? 1 : z.wahl([1, 1, -1]);
    var p = [Q(-a * k * k), Q(0), Q(a)];
    return {
      typ: 'wb2', tr: false,
      text: 'Zeichne den Graphen von $y = ' + t.poly(p) + '$ in dein Heft und lies die Nullstellen ab.',
      felder: [{ art: 'menge', label: 'Nullstellen:', loesung: [-k, k], typisch: [{ wert: [k], text: 'Die Parabel schneidet die x-Achse zweimal, links und rechts.' }, { wert: [-a * k * k], text: 'Das ist der Schnittpunkt mit der y-Achse. Nullstellen liegen auf der x-Achse.' }] }],
      tipps: ['Die Parabel ist die ' + (a > 0 ? '' : 'gespiegelte ') + 'Normalparabel, um ' + (k * k) + ' nach ' + (a > 0 ? 'unten' : 'oben') + ' verschoben. Scheitelpunkt $' + t.punkt(0, -a * k * k, 'S') + '$.', 'Nullstellen: $y = 0$ setzen und nach $x$ auflösen.'],
      weg: [
        { text: 'Scheitelpunkt $' + t.punkt(0, -a * k * k, 'S') + '$, von dort mit der Schablone der Normalparabel ' + (a > 0 ? '' : '(nach unten geöffnet) ') + 'zeichnen:', graph: grafik([{ fn: fnS(a, 0, -a * k * k) }], [{ x: -k, y: 0 }, { x: k, y: 0 }, { x: 0, y: -a * k * k, name: 'S' }], [-6, 6], a > 0 ? [-Math.max(5, k * k + 1), 7] : [-7, Math.max(5, k * k + 1)]) },
        { text: 'Rechnerisch zur Kontrolle:', tex: t.poly(p) + ' = 0\\;\\Rightarrow\\; x^2 = ' + (k * k) + '\\;\\Rightarrow\\; x = \\pm ' + k },
        { tex: t.menge([-k, k]) }
      ]
    };
  });

  /* 3: Was weißt du über a? */
  var A_OPT = ['a > 1', '0 < a < 1', '-1 < a < 0', 'a < -1'];
  A(3, 'Was kannst du über a sagen?', function (z, orig) {
    var oben = orig ? true : z.chance(0.5), enger = orig ? true : z.chance(0.5);
    var los = oben ? (enger ? 0 : 1) : (enger ? 3 : 2);
    return {
      typ: 'wb3', tr: false,
      text: 'Eine Parabel mit der Gleichung $y = ax^2$ ist nach ' + (oben ? 'oben' : 'unten') + ' geöffnet und ' + (enger ? 'enger' : 'weiter') + ' als die Normalparabel. Was kannst du über die Zahl $a$ sagen?',
      felder: [{ art: 'mc', loesung: los, optionen: A_OPT.map(function (o) { return { tex: o, warum: 'Nach oben geöffnet heißt $a > 0$, nach unten $a < 0$. Enger heißt $|a| > 1$, weiter heißt $|a| < 1$.' }; }) }],
      tipps: ['Das Vorzeichen von $a$ entscheidet über die Öffnung.', 'Enger (gestreckt): Betrag von $a$ größer als 1. Weiter (gestaucht): Betrag kleiner als 1.'],
      weg: [{ text: 'Nach ' + (oben ? 'oben' : 'unten') + ' geöffnet: $a ' + (oben ? '> 0' : '< 0') + '$. ' + (enger ? 'Enger als die Normalparabel: gestreckt, $|a| > 1$.' : 'Weiter als die Normalparabel: gestaucht, $|a| < 1$.'), tex: A_OPT[los] }]
    };
  });

  /* 4: Scheitelpunkt verschobener Normalparabeln */
  A(4, 'Scheitelpunkt angeben und verschobene Normalparabel zeichnen', function (z, orig) {
    var sp = orig ? [[-3, -3], [1, 2], [4, -6], [-2, 1]] : [0, 1, 2, 3].map(function () { return [z.nz(-5, 5), z.int(-5, 5)]; });
    var farben = M.ui && M.ui.FARBEN ? M.ui.FARBEN : ['#1f5fbf', '#d0452f', '#2e8b57', '#8a4fbf'];
    return {
      typ: 'wb4', tr: false,
      text: 'Gib den Scheitelpunkt an und zeichne die verschobene Normalparabel in dein Heft.',
      felder: sp.map(function (s, i) {
        return { art: 'punkt', label: lab(i, '$y = ' + t.spf(1, s[0], s[1]) + '$'), vor: '$S$', loesung: s, typisch: [{ wert: [-s[0], s[1]], text: 'Vorzeichenfalle: $' + t.lin(s[0]) + '$ bedeutet $d = ' + s[0] + '$.' }] };
      }),
      tipps: ['$y = (x - d)^2 + e$ hat den Scheitelpunkt $S(d|e)$.', 'Achtung bei $(x + 3)^2$: Das ist $(x - (-3))^2$, also $d = -3$.'],
      weg: sp.map(function (s, i) { return { text: BUCHST[i] + ')', tex: 'y = ' + t.spf(1, s[0], s[1]) + '\\;\\Rightarrow\\; ' + t.punkt(s[0], s[1], 'S') }; })
        .concat([{ text: 'Zeichnen: Scheitelpunkt eintragen, dann mit der Normalparabel-Schablone (1 nach rechts, 1 nach oben; 2 nach rechts, 4 nach oben):', graph: grafik(sp.map(function (s, i) { return { fn: fnS(1, s[0], s[1]), farbe: farben[i % 4], name: BUCHST[i] }; }), sp.map(function (s) { return { x: s[0], y: s[1] }; })) }])
    };
  });

  /* 5: x² − c = 0 */
  A(5, 'Einfache quadratische Gleichungen', function (z, orig) {
    var ws = orig ? [Q(8), Q(20), Q(3, 10)] : [Q(z.int(4, 15)), Q(10 * z.int(1, 3)), Q(z.int(1, 9), 10)];
    return {
      typ: 'wb5', tr: false, text: 'Löse die Gleichung.',
      felder: ws.map(function (w, i) {
        return { art: 'menge', label: lab(i, '$x^2 - ' + f.tex(w.mal(w)) + ' = 0$'), loesung: [w.neg(), w], typisch: [{ wert: [w], text: 'Es gibt zwei Lösungen: auch $' + f.tex(w.neg()) + '$ quadriert ergibt $' + f.tex(w.mal(w)) + '$.' }, { wert: [w.mal(w).neg(), w.mal(w)], text: 'Erst die Wurzel ziehen.' }] };
      }),
      tipps: ['Bring die Zahl auf die andere Seite: $x^2 = \\ldots$. Dann Wurzel ziehen, plus und minus.', 'Bei Kommazahlen: $0{,}3\\cdot 0{,}3 = 0{,}09$. Prüf so auch dein Ergebnis.'],
      weg: ws.map(function (w, i) { return { text: BUCHST[i] + ')', tex: 'x^2 = ' + f.tex(w.mal(w)) + '\\;\\Rightarrow\\; x = \\pm\\sqrt{' + f.tex(w.mal(w)) + '} = \\pm ' + f.tex(w) + '\\qquad ' + t.menge([w.neg(), w]) }; }),
      grundlage: 'umstellen'
    };
  });

  /* 6: Lösungsformel (pq-Formel) */
  A(6, 'Mit der Lösungsformel lösen', function (z, orig) {
    var paare = orig ? [[-1, -11], [6, -2]] : [0, 1].map(function () { var a, b; do { a = z.nz(-12, 12); b = z.nz(-12, 12); } while (a === b); return [a, b]; });
    return {
      typ: 'wb6', tr: false, text: 'Löse mit der Lösungsformel (pq-Formel).',
      felder: paare.map(function (r, i) {
        var p = Q(-(r[0] + r[1])), q = Q(r[0] * r[1]);
        return { art: 'menge', label: lab(i, '$' + t.poly([q, p, 1]) + ' = 0$'), loesung: r, typisch: g.pqTypisch(r) };
      }),
      tipps: ['$x_{1,2} = -\\frac{p}{2} \\pm \\sqrt{\\left(\\frac{p}{2}\\right)^2 - q}$. Lies $p$ und $q$ mit Vorzeichen ab.', 'Rechne erst $-\\frac{p}{2}$ und die Zahl unter der Wurzel aus, dann plus und minus.'],
      weg: [].concat.apply([], paare.map(function (r, i) {
        var w = g.pqWeg(Q(-(r[0] + r[1])), Q(r[0] * r[1])).weg;
        w[0] = { text: BUCHST[i] + ') ' + w[0].text, tex: w[0].tex };
        return w;
      }))
    };
  });

  /* 7: Zahlenrätsel: Zahl mal um k größere Zahl */
  A(7, 'Zahlenrätsel mit quadratischer Gleichung', function (z, orig) {
    var x = orig ? 12 : z.int(4, 15), k = orig ? 3 : z.int(1, 7), N = x * (x + k), x2 = -x - k;
    return {
      typ: 'wb7', tr: false,
      text: 'Ich denke mir eine Zahl und multipliziere sie mit der um ' + k + ' größeren Zahl. Das Produkt ist ' + N + '. Berechne die gedachte Zahl mit einer quadratischen Gleichung. Gib alle Möglichkeiten an.',
      felder: [{ art: 'menge', label: 'gedachte Zahl:', loesung: [x, x2], typisch: [{ wert: [x], text: 'Es gibt noch eine negative Zahl, die passt. Probe: $' + f.kl(x2) + '\\cdot ' + f.kl(x2 + k) + ' = ' + N + '$.' }] }],
      tipps: ['Gedachte Zahl $x$, die um ' + k + ' größere Zahl ist $x + ' + k + '$. Gleichung: $x\\cdot(x + ' + k + ') = ' + N + '$.', 'Ausmultiplizieren, alles auf eine Seite, dann pq-Formel.'],
      weg: [{ text: 'Gleichung aufstellen:', tex: 'x\\cdot(x + ' + k + ') = ' + N }, { text: 'Umformen:', tex: t.poly([-N, k, 1]) + ' = 0' }]
        .concat(g.pqWeg(Q(k), Q(-N)).weg.slice(0, -1))
        .concat([{ text: 'Probe: $' + x + '\\cdot ' + (x + k) + ' = ' + N + '$ und $' + f.kl(x2) + '\\cdot ' + f.kl(x2 + k) + ' = ' + N + '$. Beide Zahlen sind möglich.', tex: t.menge([x2, x]) }])
    };
  });

  /* 8: quadratische Ergänzung, Scheitelpunkt, Graph */
  A(8, 'Scheitelpunktform, Scheitelpunkt und Graph', function (z, orig) {
    var sp = orig ? [[Q(2), Q(1)], [Q(-3), Q(-5)], [Q(5, 2), Q(-6)], [Q(4), Q(0)]] : [
      [Q(z.nz(-5, 5)), Q(z.int(-6, 6))], [Q(z.nz(-5, 5)), Q(z.int(-6, 6))], [Q(z.wahl([-5, -3, -1, 1, 3, 5]), 2), Q(z.int(-6, 4))], [Q(z.nz(-5, 5)), Q(0)]];
    if (!orig) sp = z.mischen(sp);
    var felder = [], weg = [];
    sp.forEach(function (s, i) {
      var p = P.ausScheitel(1, s[0], s[1]), h = s[0].neg(), qe = s[0].mal(s[0]);
      felder.push({ art: 'term', label: lab(i, '$f(x) = ' + t.poly(p) + '$') + ': Scheitelpunktform', vor: '$f(x) =$', loesung: p, form: 'spf', typisch: [
        { wert: P.ausScheitel(1, s[0], P.koeff(p, 0).plus(qe)), text: 'Die quadratische Ergänzung muss wieder abgezogen werden.' },
        { wert: P.ausScheitel(1, s[0].neg(), s[1]), text: 'Vorzeichen in der Klammer: Bei $' + (h.vz() > 0 ? '+' : '-') + '\\ldots x$ heißt es $(x ' + (h.vz() > 0 ? '+' : '-') + ' \\ldots)^2$.' }] });
      felder.push({ art: 'punkt', label: 'Scheitelpunkt:', vor: '$S$', loesung: [s[0], s[1]] });
      var lin = t.poly([0, P.koeff(p, 1), 1]);
      weg.push({ text: BUCHST[i] + ') Ergänzung $\\left(\\frac{' + f.tex(P.koeff(p, 1)) + '}{2}\\right)^2 = ' + f.tex(qe) + '$:', tex: t.poly(p) + ' = ' + lin + ' + ' + f.tex(qe) + ' - ' + f.tex(qe) + (P.koeff(p, 0).istNull() ? '' : (P.koeff(p, 0).vz() < 0 ? ' - ' + f.tex(P.koeff(p, 0).abs()) : ' + ' + f.tex(P.koeff(p, 0)))) + ' = ' + t.spf(1, s[0], s[1]) + '\\qquad ' + t.punkt(s[0], s[1], 'S') });
    });
    weg.push({ text: 'Graphen: verschobene Normalparabeln mit diesen Scheitelpunkten.', graph: grafik(sp.map(function (s, i) { return { fn: fnS(1, s[0], s[1]), name: BUCHST[i] }; }), sp.map(function (s) { return { x: Number(s[0]), y: Number(s[1]) }; }), [-7, 7], [-8, 7]) });
    return {
      typ: 'wb8', tr: false,
      text: 'Forme in die Scheitelpunktform um und gib den Scheitelpunkt an. Den Graphen zeichnest du in dein Heft.',
      felder: felder,
      tipps: ['Quadratische Ergänzung: „Hälfte des Faktors vor $x$ zum Quadrat“ addieren und gleich wieder abziehen.', 'Beispiel: $x^2 - 4x + 5 = x^2 - 4x + 4 - 4 + 5 = (x - 2)^2 + 1$.'],
      weg: weg, grundlage: 'binome'
    };
  });

  /* 9: Parabelbogen aus Höhe und Spannweite */
  var BOEGEN = [['Das Dach einer Arena wird von einem parabelförmigen Stahlbogen getragen', 73, 180], ['Ein Brückenbogen hat die Form einer Parabel', 20, 80], ['Eine Halle hat ein parabelförmiges Dach', 12, 40], ['Ein Torbogen hat die Form einer Parabel', 6, 8], ['Ein Bogen einer Stahlbrücke ist parabelförmig', 45, 120], ['Ein Hangar hat ein parabelförmiges Dach', 25, 100]];
  /* Skizze eines großen Bogens: maßstäblich auf etwa 12 Kästchen Breite verkleinert, Punkte mit echten Maßen beschriftet */
  function skizze(p, S, N, W, H) {
    var sc = W / 10, fp = M.g.fn(p);
    var xs = N[0] < 0 ? [-6.5, 6.5] : [-1.5, 11.5];
    return { x: xs, y: [-1, Math.ceil(H / sc) + 2], breite: 320, kurven: [{ fn: function (x) { var y = fp(x * sc); return y >= -0.5 ? y / sc : NaN; } }],
      punkte: [{ x: S[0] / sc, y: S[1] / sc, name: 'S(' + S[0] + '|' + H + ')' }, { x: N[0] / sc, y: 0, name: '(' + N[0] + '|0)' }, { x: N[1] / sc, y: 0, name: '(' + N[1] + '|0)' }], schritt: 1e9 };
  }
  A(9, 'Parabelbogen: Funktionsgleichung bestimmen', function (z, orig) {
    var b = orig ? BOEGEN[0] : z.wahl(BOEGEN.slice(1)), H = b[1], W = b[2], h = W / 2;
    var links = !orig && z.chance(0.35);
    var a = Q(-H, h * h);
    var p = links ? P.ausNullstellen(a, 0, W) : [Q(H), Q(0), a];
    var S = links ? [h, H] : [0, H], N = links ? [0, W] : [-h, h];
    return {
      typ: 'wb9', tr: true,
      text: b[0] + '. Der Bogen ist an der höchsten Stelle ' + H + ' m hoch und hat eine Spannweite von ' + W + ' m. ' +
        (links ? 'Leg den Ursprung des Koordinatensystems an den linken Fußpunkt des Bogens.' : 'Leg den Ursprung des Koordinatensystems in die Mitte unter den Bogen (auf den Boden).') + ' Skizziere die Parabel im Heft und bestimme die Funktionsgleichung.',
      felder: [
        { art: 'punkt', label: 'Scheitelpunkt:', vor: '$S$', loesung: S, typisch: [{ wert: [H, 0], text: 'Zuerst die x-Koordinate, dann die Höhe.' }] },
        { art: 'menge', label: 'Nullstellen (Fußpunkte):', loesung: N, typisch: links ? [] : [{ wert: [-W, W], text: 'Die Spannweite ist der Abstand der Fußpunkte. Jeder liegt die Hälfte davon von der Mitte entfernt.' }] },
        { art: 'zahl', label: 'Streckfaktor (als Bruch oder auf 4 Nachkommastellen):', vor: '$a =$', loesung: a, runden: 4, typisch: [{ wert: Q(-H, h), text: 'Die Nullstelle wird beim Einsetzen quadriert: $' + h + '^2 = ' + (h * h) + '$.' }, { wert: a.neg(), text: 'Der Bogen ist nach unten geöffnet, $a$ ist negativ.' }] },
        { art: 'term', label: 'Funktionsgleichung:', vor: '$f(x) =$', muster: links ? '-' + H + '/' + (h * h) + 'x(x-' + W + ')' : '-' + H + '/' + (h * h) + 'x^2+' + H, bedingung: function (k) {
          var soll = [0, 1, 2].map(function (i) { return Number(P.koeff(p, i)); });
          var okA = Math.abs(k[2] - soll[2]) <= Math.abs(soll[2]) * 0.03, okB = Math.abs(k[1] - soll[1]) <= Math.max(0.02, Math.abs(soll[1]) * 0.03), okC = Math.abs(k[0] - soll[0]) <= Math.max(0.05, Math.abs(soll[0]) * 0.01);
          if (okA && okB && okC) return { ok: true };
          if (k[2] > 0) return { ok: false, meldung: 'Der Bogen ist nach unten geöffnet, $a$ muss negativ sein.' };
          if (!okA && okB && okC) return { ok: false, meldung: 'Der Ansatz passt, aber $a$ stimmt nicht. Setz eine Nullstelle ein und löse nach $a$ auf (runde höchstens auf 4 Nachkommastellen).' };
          return { ok: false, meldung: links ? 'Mit dem Ursprung am linken Fußpunkt: Ansatz $f(x) = a\\cdot x\\cdot(x - ' + W + ')$.' : 'Mit dem Scheitelpunkt auf der y-Achse: Ansatz $f(x) = ax^2 + ' + H + '$.' };
        } }
      ],
      tipps: [links ? 'Fußpunkte bei $x = 0$ und $x = ' + W + '$, Scheitelpunkt in der Mitte $(' + h + '|' + H + ')$.' : 'Scheitelpunkt auf der y-Achse: $S(0|' + H + ')$. Die Fußpunkte liegen bei $x = \\pm ' + h + '$.',
        links ? 'Ansatz $f(x) = a\\cdot x\\cdot(x - ' + W + ')$, dann den Scheitelpunkt einsetzen.' : 'Ansatz $f(x) = ax^2 + ' + H + '$, dann eine Nullstelle einsetzen: $0 = a\\cdot ' + h + '^2 + ' + H + '$.'],
      weg: [
        { text: 'Skizze mit Maßen (maßstäblich verkleinert):', graph: skizze(p, S, N, W, H) },
        { text: 'Scheitelpunkt und Nullstellen:', tex: t.punkt(S[0], S[1], 'S') + ';\\quad x_1 = ' + N[0] + ';\\; x_2 = ' + N[1] },
        { text: links ? 'Ansatz mit den Nullstellen, Scheitelpunkt einsetzen:' : 'Ansatz mit dem Scheitelpunkt, Nullstelle einsetzen:', tex: links ? H + ' = a\\cdot ' + h + '\\cdot(' + h + ' - ' + W + ') = ' + (-h * h) + 'a' : '0 = a\\cdot ' + h + '^2 + ' + H + ' = ' + (h * h) + 'a + ' + H },
        { tex: 'a = ' + f.tex(a) + '\\approx ' + f.tex(a.wert(), 4) },
        { text: 'Funktionsgleichung:', tex: 'f(x) = ' + (links ? t.fakt(a, 0, W) : t.poly(p)) + '\\approx ' + (links ? f.tex(a.wert(), 4) + '\\cdot x\\cdot(x - ' + W + ')' : f.tex(a.wert(), 4) + 'x^2 + ' + H) }
      ]
    };
  });

  /* 10: Lösungen ohne Lösungsformel (ausklammern) */
  A(10, 'Lösungen ohne Lösungsformel', function (z, orig) {
    var aufg = orig ? [{ tex: 'x^2 + 7x = 0', r: -7 }, { tex: 'x^2 - 6x = 0', r: 6 }, { tex: 'x^2 = 8x', r: 8 }, { tex: '2x = x^2', r: 2 }] : [0, 1, 2, 3].map(function (i) {
      var r = z.nz(-9, 9);
      if (i === 0 || i === 1) return { tex: t.poly([0, -r, 1]) + ' = 0', r: r };
      if (i === 2) return r > 0 ? { tex: 'x^2 = ' + r + 'x', r: r } : { tex: 'x^2 = ' + t.poly([0, r]), r: r };
      return { tex: t.poly([0, r]) + ' = x^2', r: r };
    });
    return {
      typ: 'wb10', tr: false, text: 'Gib die Lösungen an, ohne die Lösungsformel zu benutzen.',
      felder: aufg.map(function (a, i) { return { art: 'menge', label: lab(i, '$' + a.tex + '$'), loesung: [0, a.r], typisch: [{ wert: [a.r], text: 'Die Lösung $x = 0$ fehlt. Nie durch $x$ teilen, sondern $x$ ausklammern.' }, { wert: [0, -a.r], text: 'Vorzeichen der zweiten Lösung prüfen.' }] }; }),
      tipps: ['Bring alles auf eine Seite, sodass rechts 0 steht.', 'Klammere $x$ aus: $x\\cdot(x - \\ldots) = 0$. Dann die „Produkt = 0“-Regel.'],
      weg: aufg.map(function (a, i) { return { text: BUCHST[i] + ')', tex: t.poly([0, -a.r, 1]) + ' = 0\\;\\Rightarrow\\; x\\cdot ' + t.lin(a.r) + ' = 0\\;\\Rightarrow\\; ' + t.menge([0, a.r]) }; })
    };
  });

  /* 11: quadratische Gleichungen (eine Lösung; Wurzelziehen mit Bruch) */
  A(11, 'Quadratische Gleichungen lösen', function (z, orig) {
    var a1 = orig ? 2 : z.wahl([2, 3, -2]), r = orig ? -4 : z.nz(-5, 5), R = orig ? -24 : z.nz(-30, 30);
    var b1 = -2 * a1 * r, c1 = a1 * r * r + R;
    var k = orig ? 4 : z.wahl([4, 4, 25]), d = orig ? -2 : z.nz(-4, 4), s = orig ? Q(3, 2) : (k === 4 ? Q(z.wahl([1, 3, 5, 7]), 2) : Q(z.int(1, 4), 5));
    var m = s.mal(s).mal(k);
    var l2 = [Q(d).minus(s), Q(d).plus(s)];
    return {
      typ: 'wb11', tr: false, text: 'Löse die quadratische Gleichung.',
      felder: [
        { art: 'menge', label: lab(0, '$' + t.poly([c1, b1, a1]) + ' = ' + R + '$'), loesung: [r], typisch: [{ wert: [-r], text: 'Vorzeichen prüfen: Mach die Probe durch Einsetzen.' }, { wert: [], text: 'Bring zuerst die ' + R + ' auf die linke Seite. Die Diskriminante ist 0, es gibt genau eine Lösung.' }] },
        { art: 'menge', label: lab(1, '$' + k + '\\cdot ' + t.lin(d) + '^2 - ' + f.tex(m) + ' = 0$'), loesung: l2, typisch: [{ wert: [l2[1]], text: 'Beim Wurzelziehen gibt es zwei Fälle, plus und minus.' }, { wert: [Q(-d).minus(s), Q(-d).plus(s)], text: 'Vorzeichen: Aus $' + t.lin(d) + '$ folgt $x = ' + d + ' \\pm \\ldots$.' }] }
      ],
      tipps: ['a) Rechts muss 0 stehen. Dann durch ' + a1 + ' teilen. Erkennst du eine binomische Formel?', 'b) Erst $' + f.tex(m) + '$ nach rechts, dann durch ' + k + ' teilen, dann Wurzel ziehen: $\\sqrt{' + f.tex(s.mal(s)) + '} = ' + f.tex(s) + '$.'],
      weg: [
        { text: 'a) Alles auf eine Seite und durch ' + a1 + ' teilen:', tex: t.poly([c1 - R, b1, a1]) + ' = 0\\;\\Rightarrow\\; ' + t.poly([r * r, -2 * r, 1]) + ' = 0' },
        { text: 'Binomische Formel: genau eine Lösung (Diskriminante 0).', tex: t.lin(r) + '^2 = 0\\;\\Rightarrow\\; x = ' + r + '\\qquad ' + t.menge([r]) },
        { text: 'b) Umformen:', tex: k + '\\cdot ' + t.lin(d) + '^2 = ' + f.tex(m) + '\\;\\Rightarrow\\; ' + t.lin(d) + '^2 = ' + f.tex(s.mal(s)) },
        { text: 'Wurzel ziehen, zwei Fälle:', tex: 'x - ' + f.kl(d) + ' = \\pm ' + f.tex(s) + '\\;\\Rightarrow\\; ' + t.menge(l2) }
      ],
      grundlage: 'binome'
    };
  });

  /* 12: aufeinanderfolgende Zahlen, Produkt um N größer als Summe */
  A(12, 'Zahlenrätsel: Produkt und Summe', function (z, orig) {
    var n = orig ? 18 : z.int(5, 25), N = n * n - n - 1, n2 = 1 - n;
    return {
      typ: 'wb12', tr: false,
      text: 'Das Produkt zweier aufeinanderfolgender ganzer Zahlen ist um ' + N + ' größer als ihre Summe. Löse mit einer Gleichung. Gib die kleinere Zahl an (alle Möglichkeiten).',
      felder: [{ art: 'menge', label: 'kleinere Zahl:', loesung: [n, n2], typisch: [{ wert: [n], text: 'Auch zwei negative Zahlen erfüllen die Bedingung: $' + n2 + '$ und $' + (n2 + 1) + '$.' }, { wert: [n, n + 1], text: 'Gefragt ist jeweils nur die kleinere Zahl eines Paares.' }] }],
      tipps: ['Kleinere Zahl $x$, größere $x + 1$. Produkt $x\\cdot(x + 1)$, Summe $x + (x + 1)$.', 'Gleichung: $x\\cdot(x + 1) = x + (x + 1) + ' + N + '$. Alles auf eine Seite, dann pq-Formel.'],
      weg: [{ text: 'Gleichung:', tex: 'x\\cdot(x + 1) = x + (x + 1) + ' + N }, { text: 'Umformen:', tex: 'x^2 + x = 2x + ' + (N + 1) + '\\;\\Rightarrow\\; x^2 - x - ' + (N + 1) + ' = 0' }]
        .concat(g.pqWeg(Q(-1), Q(-(N + 1))).weg.slice(0, -1))
        .concat([{ text: 'Zwei Zahlenpaare: ' + n + ' und ' + (n + 1) + ' sowie ' + n2 + ' und ' + (n2 + 1) + '. Probe: $' + n + '\\cdot ' + (n + 1) + ' = ' + (n * (n + 1)) + '$ und $' + n + ' + ' + (n + 1) + ' + ' + N + ' = ' + (n * (n + 1)) + '$ ✓', tex: t.menge([n2, n]) }])
    };
  });

  /* 13: Pistole – Lösung im Gültigkeitsbereich */
  A(13, 'Sachaufgabe mit Gültigkeitsbereich', function (z, orig) {
    var t1 = orig ? 6 : z.int(3, 8), t2 = orig ? 18 : z.int(12, 20), Tg = 10;
    var v = 5 * (t1 + t2), H = 5 * t1 * t2;
    return {
      typ: 'wb13', tr: false,
      text: 'Eine Kugel wird senkrecht nach oben geschossen. Ihre Höhe $h$ (in m) nach der Zeit $t$ (in s) ist ungefähr $h = ' + v + 't - 5t^2$. Die Formel gilt nur für die ersten ' + Tg + ' Sekunden. Nach wie vielen Sekunden ist die Kugel ' + H + ' m hoch?',
      felder: [{ art: 'menge', label: 'Zeit in Sekunden:', loesung: [t1], typisch: [
        { wert: [t1, t2], text: 'Rechnerisch stimmen beide. Aber die Formel gilt nur für die ersten ' + Tg + ' Sekunden. Welche Lösung fällt weg?' },
        { wert: [t2], text: '$' + t2 + '$ s liegt außerhalb der ' + Tg + ' Sekunden, für die die Formel gilt.' }] }],
      tipps: ['Setz $h = ' + H + '$: $' + v + 't - 5t^2 = ' + H + '$. Bring alles auf eine Seite und teile durch $-5$.', 'Du bekommst zwei Lösungen. Prüf, welche in den ersten ' + Tg + ' Sekunden liegt.'],
      weg: [{ text: 'Gleichung aufstellen und umformen:', tex: v + 't - 5t^2 = ' + H + '\\quad |\\,-' + H + '\\qquad -5t^2 + ' + v + 't - ' + H + ' = 0\\quad |:(-5)' }, { tex: 't^2 - ' + (t1 + t2) + 't + ' + (t1 * t2) + ' = 0' }]
        .concat(g.pqWeg(Q(-(t1 + t2)), Q(t1 * t2)).weg.slice(0, -1))
        .concat([{ text: 'Die Formel gilt nur bis ' + Tg + ' s. Also fällt $t = ' + t2 + '$ weg. Antwort: Nach ' + t1 + ' Sekunden ist die Kugel ' + H + ' m hoch.', tex: 't = ' + t1 + '\\qquad ' + t.menge([t1]) }])
    };
  });

  /* 14: Scheitelpunkt und Form ohne Zeichnung */
  var FORMEN = ['nach oben, gestreckt', 'nach oben, gestaucht', 'nach unten, gestreckt', 'nach unten, gestaucht'];
  A(14, 'Scheitelpunkt und Form ohne Zeichnung', function (z, orig) {
    var par = orig ? [[Q(3), 5, -7], [Q(1, 2), -2, -8], [Q(-2), 4, -5]] : [0, 1, 2].map(function () { return [Q.aus(z.wahl([3, 2, Q(1, 2), -2, Q(-1, 2), -3, Q(1, 4), Q(3, 2)])), z.nz(-6, 6), z.int(-8, 8)]; });
    var felder = [], weg = [];
    par.forEach(function (p, i) {
      var a = p[0], fi = (a.vz() > 0 ? 0 : 2) + (a.abs().wert() > 1 ? 0 : 1);
      felder.push({ art: 'punkt', label: lab(i, '$f(x) = ' + t.spf(a, p[1], p[2]) + '$'), vor: '$S$', loesung: [p[1], p[2]], typisch: [{ wert: [-p[1], p[2]], text: 'Vorzeichenfalle bei $d$.' }] });
      felder.push({ art: 'mc', label: 'Form:', loesung: fi, optionen: FORMEN.map(function (o) { return { html: o, warum: 'Vorzeichen von $a$: Öffnung. Betrag von $a$ größer als 1: gestreckt, kleiner als 1: gestaucht. Hier ist $a = ' + f.tex(a) + '$.' }; }) });
      weg.push({ text: BUCHST[i] + ') $a = ' + f.tex(a) + '$: ' + FORMEN[fi] + '.', tex: t.punkt(p[1], p[2], 'S') });
    });
    return {
      typ: 'wb14', tr: false, text: 'Bestimme den Scheitelpunkt und beschreibe die Form der Parabel, ohne zu zeichnen.',
      felder: felder,
      tipps: ['$f(x) = a\\cdot(x - d)^2 + e$: Scheitelpunkt $S(d|e)$.', '$a > 0$ nach oben, $a < 0$ nach unten. $|a| > 1$ gestreckt (enger), $|a| < 1$ gestaucht (weiter).'],
      weg: weg
    };
  });

  /* 15: Pythagoras: Katheten aus Hypotenuse und Umfang */
  var TRIPEL = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41], [12, 35, 37]];
  A(15, 'Rechtwinkliges Dreieck: Katheten berechnen', function (z, orig) {
    var tr = orig ? [20, 21, 29] : z.wahl(TRIPEL), k = orig ? 1 : (tr[2] <= 13 ? z.int(1, 3) : 1);
    var a = tr[0] * k, b = tr[1] * k, c = tr[2] * k, U = a + b + c, s = a + b;
    var q = (s * s - c * c) / 2;
    return {
      typ: 'wb15', tr: true,
      text: 'In einem rechtwinkligen Dreieck ist die Hypotenuse ' + c + ' cm lang, der Umfang beträgt ' + U + ' cm. Wie lang sind die Katheten?',
      felder: [{ art: 'menge', label: 'Katheten in cm:', loesung: [a, b], platzhalter: 'z. B. 20; 21', typisch: [{ wert: [a], text: 'Die beiden Lösungen der Gleichung sind die beiden Katheten.' }] }],
      tipps: ['Pythagoras: $a^2 + b^2 = ' + c + '^2$. Umfang: $a + b + ' + c + ' = ' + U + '$, also $b = ' + s + ' - a$.', 'Setz $b = ' + s + ' - a$ in den Pythagoras ein, multipliziere aus und teile durch 2. Dann pq-Formel.'],
      weg: [
        { text: 'Pythagoras und Umfang:', tex: 'a^2 + b^2 = ' + (c * c) + ';\\qquad a + b = ' + s + '\\;\\Rightarrow\\; b = ' + s + ' - a' },
        { text: 'Einsetzen und ausmultiplizieren:', tex: 'a^2 + (' + s + ' - a)^2 = ' + (c * c) + '\\;\\Rightarrow\\; 2a^2 - ' + (2 * s) + 'a + ' + (s * s) + ' = ' + (c * c) },
        { text: 'Alles auf eine Seite, durch 2 teilen:', tex: 'a^2 - ' + s + 'a + ' + q + ' = 0' }
      ].concat(g.pqWeg(Q(-s), Q(q)).weg.slice(0, -1)).concat([{ text: 'Die beiden Lösungen sind die beiden Katheten. Probe: $' + a + '^2 + ' + b + '^2 = ' + (a * a + b * b) + ' = ' + c + '^2$ ✓', tex: a + '\\text{ cm und }' + b + '\\text{ cm}\\qquad ' + t.menge([a, b]) }]),
      grundlage: 'binome'
    };
  });

  M.WIEDERHOLUNG = L;
  function gen(nr) { var e = L.filter(function (x) { return x.nr === nr; })[0]; return function (z) { return e.gen(z, false); }; }
  M.bereich({
    id: 'wiederholung', gruppe: 'extra', titel: 'Wiederholungsblatt', kicker: 'Von deiner Lehrerin',
    kurz: 'Die 15 Aufgabentypen vom Wiederholungsblatt mit neuen Zahlen.',
    generatoren: {
      basis: [gen(1), gen(2), gen(3), gen(4), gen(5), gen(14)],
      standard: [gen(6), gen(7), gen(8), gen(10), gen(11)],
      knobel: [gen(9), gen(12), gen(13), gen(15)]
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
