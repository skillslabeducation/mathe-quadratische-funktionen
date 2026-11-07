/* Thema 4: Darstellungsformen der Funktionsgleichung einer Parabel (Buch S. 83–85). */
(function (root) {
  var M = root.M, Q = M.Q, P = M.P, f = M.f, t = M.t, g = M.g;

  function vz(q) { q = Q.aus(q); return q.istNull() ? '' : (q.vz() < 0 ? ' - ' + f.tex(q.abs()) : ' + ' + f.tex(q)); }
  /* zwei verschiedene ganzzahlige Nullstellen mit gleicher Parität (Scheitel-x ganzzahlig) */
  function nullstellen(z, gleichParitaet) {
    var x1, x2;
    do { x1 = z.int(-6, 6); x2 = z.int(-6, 6); } while (x1 === x2 || (gleichParitaet && (x1 + x2) % 2 !== 0) || (x1 === 0 && x2 === 0));
    return x1 < x2 ? [x1, x2] : [x2, x1];
  }

  /* ---------- Basis ---------- */

  /* B1: direkt ablesen, je nach Form */
  function ablesen(z) {
    var form = z.wahl(['spf', 'allg', 'fakt']);
    var a = Q.aus(z.wahl([1, -1, 2, -2, 3, Q(1, 2), Q(-1, 2)]));
    var felder, formel, weg, tipps;
    var aFeld = { art: 'zahl', label: 'Streckfaktor:', vor: '$a =$', loesung: a, typisch: [{ wert: a.neg(), text: 'Das Vorzeichen gehört zum Streckfaktor dazu.' }] };
    if (form === 'spf') {
      var d = z.nz(-6, 6), e = z.int(-6, 6);
      formel = 'f(x) = ' + t.spf(a, d, e);
      felder = [aFeld, { art: 'punkt', label: 'Scheitelpunkt:', vor: '$S$', loesung: [d, e], typisch: [{ wert: [-d, e], text: 'Vorzeichenfalle: In $' + t.lin(d) + '$ steckt $d = ' + d + '$.' }] }];
      tipps = ['An der Scheitelpunktform $f(x) = a\\cdot(x - d)^2 + e$ liest du $a$ und den Scheitelpunkt $(d|e)$ ab.', 'Bei $' + t.lin(d) + '$ ist $d = ' + d + '$.'];
      weg = [{ text: 'Scheitelpunktform $a\\cdot(x - d)^2 + e$:', tex: 'a = ' + f.tex(a) + ',\\quad ' + t.punkt(d, e, 'S') }];
    } else if (form === 'allg') {
      var b = Q(z.int(-8, 8)), c = Q(z.nz(-9, 9));
      formel = 'f(x) = ' + t.poly([c, b, a]);
      felder = [aFeld, { art: 'punkt', label: 'Schnittpunkt mit der y-Achse:', loesung: [0, c], typisch: [{ wert: [c, 0], text: 'Auf der y-Achse ist $x = 0$. Der Punkt heißt also $(0|c)$.' }] }];
      tipps = ['An der allgemeinen Form $f(x) = ax^2 + bx + c$ liest du $a$ und den Schnittpunkt mit der y-Achse $(0|c)$ ab.', 'Setz in Gedanken $x = 0$ ein: Was bleibt übrig?'];
      weg = [{ text: 'Allgemeine Form $ax^2 + bx + c$:', tex: 'a = ' + f.tex(a) + ',\\quad c = ' + f.tex(c) }, { text: 'Schnittpunkt mit der y-Achse:', tex: t.punkt(0, c) }];
    } else {
      var ns = nullstellen(z, false);
      formel = 'f(x) = ' + t.fakt(a, ns[0], ns[1]);
      felder = [aFeld, { art: 'menge', label: 'Nullstellen:', loesung: ns, typisch: [{ wert: [-ns[0], -ns[1]], text: 'Vorzeichenfalle: $(x - 3)$ wird null für $x = 3$, $(x + 3)$ für $x = -3$.' }] }];
      tipps = ['An der faktorisierten Form $f(x) = a\\cdot(x - x_1)\\cdot(x - x_2)$ liest du $a$ und die Nullstellen ab.', '„Produkt-gleich-Null-Regel“: Für welches $x$ wird jede Klammer null?'];
      weg = [{ text: 'Faktorisierte Form $a\\cdot(x - x_1)\\cdot(x - x_2)$:', tex: 'a = ' + f.tex(a) }, { text: 'Jede Klammer gleich null setzen:', tex: 'x_1 = ' + ns[0] + ';\\quad x_2 = ' + ns[1] }, { tex: t.menge(ns) }];
    }
    return { typ: 'ablesen-' + form, tr: false, text: 'Lies direkt an der Funktionsgleichung ab.', formel: formel, felder: felder, tipps: tipps, weg: weg };
  }

  /* B2: Welche Form ist das? */
  function formErkennen(z) {
    var a = Q.aus(z.wahl([1, -1, 2, -2, Q(1, 2), 3])), ns = nullstellen(z, true);
    var p = P.ausNullstellen(a, ns[0], ns[1]);
    var d = (ns[0] + ns[1]) / 2, e = P.wertQ(p, d);
    var welche = z.int(0, 2);
    var formel = 'f(x) = ' + [t.spf(a, d, e), t.poly(p), t.fakt(a, ns[0], ns[1])][welche];
    var namen = ['Scheitelpunktform', 'allgemeine Form', 'faktorisierte Form'];
    var muster = ['$a\\cdot(x - d)^2 + e$', '$ax^2 + bx + c$', '$a\\cdot(x - x_1)\\cdot(x - x_2)$'];
    return {
      typ: 'formerkennen', tr: false, text: 'In welcher Form ist die Funktionsgleichung geschrieben?', formel: formel,
      felder: [{ art: 'mc', loesung: welche, optionen: namen.map(function (n, i) { return { html: n + ': ' + muster[i], warum: 'Vergleiche mit dem Muster ' + muster[welche] + '.' }; }) }],
      tipps: ['Gibt es Klammern? Wie viele, und steht ein Quadrat daran?', 'Eine quadrierte Klammer plus Zahl: Scheitelpunktform. Zwei Klammern malgenommen: faktorisierte Form. Keine Klammern: allgemeine Form.'],
      weg: [{ text: 'Das Muster ' + muster[welche] + ' passt. Es ist die ' + namen[welche] + '.' }]
    };
  }

  /* B3: Scheitel-x als Mitte der Nullstellen */
  function mitte(z) {
    var ns = nullstellen(z, z.chance(0.7));
    var xs = Q(ns[0] + ns[1], 2);
    return {
      typ: 'mitte', tr: false,
      text: 'Eine Parabel hat die Nullstellen $x_1 = ' + ns[0] + '$ und $x_2 = ' + ns[1] + '$. Welche x-Koordinate hat ihr Scheitelpunkt?',
      felder: [{ art: 'zahl', vor: '$x_S =$', loesung: xs, typisch: [
        { wert: Q(ns[1] - ns[0], 2), text: 'Das ist der halbe Abstand der Nullstellen. Gesucht ist die Mitte: $\\frac{x_1 + x_2}{2}$.' },
        { wert: Q(ns[0] + ns[1]), text: 'Die Summe musst du noch halbieren.' }
      ] }],
      tipps: ['Eine Parabel ist symmetrisch. Der Scheitelpunkt liegt genau in der Mitte zwischen den Nullstellen.', 'Mitte zweier Zahlen: $\\frac{x_1 + x_2}{2}$.'],
      weg: [{ text: 'Der Scheitelpunkt liegt in der Mitte zwischen den Nullstellen:', tex: 'x_S = \\frac{' + ns[0] + ' + ' + f.kl(ns[1]) + '}{2} = \\frac{' + (ns[0] + ns[1]) + '}{2} = ' + f.tex(xs) }]
    };
  }

  /* ---------- Standard ---------- */

  /* S1: faktorisierte Form -> allgemeine Form (Buch S. 83 Beispiel A a) */
  function faktAllg(z) {
    var a = Q.aus(z.wahl([1, -1, 2, -2, Q(1, 2), 3])), ns = nullstellen(z, false);
    var innen = P.ausNullstellen(1, ns[0], ns[1]), erg = P.skal(innen, a);
    var typ = [{ wert: P.ausNullstellen(a, -ns[0], -ns[1]), text: 'Vorzeichen in den Klammern prüfen.' }];
    if (!a.gleich(1)) typ.push({ wert: [innen[0], innen[1], a], text: 'Der Faktor $' + f.tex(a) + '$ gilt für alle Summanden: Erst die Klammern ausmultiplizieren, dann alles mit $' + f.tex(a) + '$ malnehmen.' });
    typ.push({ wert: P.skal([innen[0], Q(0), Q(1)], a), text: 'Jeder mit jedem: Das Glied mit $x$ fehlt.' });
    return {
      typ: 'faktallg', tr: false, text: 'Bestimme die allgemeine Form.',
      formel: 'f(x) = ' + t.fakt(a, ns[0], ns[1]),
      felder: [{ art: 'term', vor: '$f(x) =$', loesung: erg, form: 'allg', typisch: typ }],
      tipps: ['Erst die beiden Klammern ausmultiplizieren (jeder mit jedem), dann mit dem Faktor davor malnehmen.', t.lin(ns[0]) + '\\cdot ' + t.lin(ns[1]) === '' ? '' : '$' + t.lin(ns[0]) + '\\cdot ' + t.lin(ns[1]) + ' = ' + t.poly(innen) + '$'],
      weg: [
        { text: 'Klammern ausmultiplizieren:', tex: 'f(x) = ' + (a.gleich(1) ? t.poly(innen) : (a.gleich(-1) ? '-' : f.tex(a) + '\\cdot ') + '(' + t.poly(innen) + ')') },
        { text: a.gleich(1) ? 'Fertig:' : 'Mit $' + f.tex(a) + '$ malnehmen:', tex: '= ' + t.poly(erg) }
      ],
      grundlage: 'klammern'
    };
  }

  /* S2: Scheitelpunktform -> allgemeine Form, y-Achsenabschnitt (Buch S. 84 Nr. 4) */
  function spfAllg(z) {
    var a = Q.aus(z.wahl([1, -1, 2, -2, Q(1, 2), 3])), d = Q(z.nz(-5, 5)), e = Q(z.int(-7, 7));
    var bin = P.ausScheitel(1, d, 0), erg = P.ausScheitel(a, d, e);
    return {
      typ: 'spfallg', tr: false, text: 'Bestimme die allgemeine Form und gib den Schnittpunkt mit der y-Achse an.',
      formel: 'f(x) = ' + t.spf(a, d, e),
      felder: [
        { art: 'term', label: 'Allgemeine Form:', vor: '$f(x) =$', loesung: erg, form: 'allg', typisch: [
          { wert: [a.mal(d.mal(d)).neg().plus(e), Q(0), a], text: 'Binomische Formel: $' + t.lin(d) + '^2 = ' + t.poly(bin) + '$, nicht $x^2 - ' + f.tex(d.mal(d)) + '$.' },
          { wert: [d.mal(d).plus(e), d.mal(-2), a], text: 'Der Faktor $' + f.tex(a) + '$ gilt für alle Summanden der ausmultiplizierten Klammer.' },
          { wert: P.ausScheitel(a, d.neg(), e), text: 'Vorzeichen in der Klammer prüfen: $' + t.lin(d) + '^2 = ' + t.poly(bin) + '$.' }
        ] },
        { art: 'punkt', label: 'Schnittpunkt mit der y-Achse:', loesung: [0, erg[0]], typisch: [{ wert: [0, e], text: 'Das ist $e$, die y-Koordinate des Scheitelpunkts. Der y-Achsenabschnitt ist das $c$ der allgemeinen Form.' }] }
      ],
      tipps: ['Zuerst die Klammer mit der binomischen Formel auflösen, dann mit $' + f.tex(a) + '$ malnehmen, dann zusammenfassen.', 'Den Schnittpunkt mit der y-Achse liest du an der allgemeinen Form ab: $(0|c)$.'],
      weg: [
        { text: 'Binomische Formel:', tex: t.lin(d) + '^2 = ' + t.poly(bin) },
        { text: 'Einsetzen:', tex: 'f(x) = ' + (a.gleich(1) ? '' : (a.gleich(-1) ? '-' : f.tex(a) + '\\cdot ')) + '(' + t.poly(bin) + ')' + (e.istNull() ? '' : vz(e)) },
        { text: 'Ausmultiplizieren und zusammenfassen:', tex: '= ' + t.poly(erg) },
        { text: 'Schnittpunkt mit der y-Achse:', tex: t.punkt(0, erg[0]) }
      ],
      grundlage: 'binome'
    };
  }

  /* S3: faktorisierte Form -> Nullstellen, Scheitelpunkt, y-Achse (Buch S. 83 Beispiel A b, S. 84 Nr. 5) */
  function faktEigenschaften(z) {
    var a = Q.aus(z.wahl([1, -1, 2, -2, Q(1, 2), Q(-1, 2)])), ns = nullstellen(z, true);
    var p = P.ausNullstellen(a, ns[0], ns[1]);
    var xs = (ns[0] + ns[1]) / 2, ys = P.wertQ(p, xs);
    return {
      typ: 'fakteigenschaften', tr: false, text: 'Bestimme Nullstellen, Scheitelpunkt und Schnittpunkt mit der y-Achse.',
      formel: 'f(x) = ' + t.fakt(a, ns[0], ns[1]),
      felder: [
        { art: 'menge', label: 'Nullstellen:', loesung: ns, typisch: [{ wert: [-ns[0], -ns[1]], text: 'Vorzeichenfalle: $' + t.lin(ns[0]) + '$ wird null für $x = ' + ns[0] + '$.' }] },
        { art: 'punkt', label: 'Scheitelpunkt:', vor: '$S$', loesung: [xs, ys], typisch: [{ wert: [xs, ys.neg()], text: 'Prüf beim Einsetzen die Vorzeichen.' }] },
        { art: 'punkt', label: 'Schnittpunkt mit der y-Achse:', loesung: [0, p[0]], typisch: [{ wert: [0, Q(ns[0] * ns[1])], text: 'Den Faktor $a = ' + f.tex(a) + '$ nicht vergessen: $f(0) = ' + f.tex(a) + '\\cdot ' + f.kl(-ns[0]) + '\\cdot ' + f.kl(-ns[1]) + '$.' }] }
      ],
      tipps: ['Nullstellen: Jede Klammer gleich null setzen. Scheitelpunkt: $x_S$ liegt in der Mitte der Nullstellen, $y_S = f(x_S)$.', 'Schnittpunkt mit der y-Achse: $f(0)$ berechnen.'],
      weg: [
        { text: '„Produkt-gleich-Null-Regel“:', tex: 'x_1 = ' + ns[0] + ';\\quad x_2 = ' + ns[1] },
        { text: 'Scheitelpunkt in der Mitte der Nullstellen:', tex: 'x_S = \\frac{' + ns[0] + ' + ' + f.kl(ns[1]) + '}{2} = ' + xs },
        { text: 'Einsetzen:', tex: 'y_S = f(' + xs + ') = ' + (a.gleich(1) ? '' : (a.gleich(-1) ? '-' : f.tex(a) + '\\cdot ')) + '(' + xs + ' - ' + f.kl(ns[0]) + ')\\cdot(' + xs + ' - ' + f.kl(ns[1]) + ') = ' + f.tex(ys) },
        { tex: t.punkt(xs, ys, 'S') },
        { text: 'y-Achse: $f(0) = ' + f.tex(p[0]) + '$', tex: t.punkt(0, p[0]) }
      ],
      grundlage: 'rechenregeln'
    };
  }

  /* Weg der quadratischen Ergänzung im Buchstil */
  function ergaenzungWeg(a, b, c) { // f(x) = ax² + bx + c
    a = Q.aus(a); b = Q.aus(b); c = Q.aus(c);
    var p = b.durch(a), h = p.durch(2), qe = h.mal(h), d = h.neg(), e = c.minus(a.mal(qe));
    var w = [];
    var innen = t.poly([0, p, 1]);
    if (a.gleich(1)) {
      w.push({ text: 'Quadratische Ergänzung: „Hälfte des Faktors vor $x$ zum Quadrat“ $\\left(\\frac{' + f.tex(p) + '}{2}\\right)^2 = ' + f.tex(qe) + '$. Addieren und gleich wieder abziehen:',
        tex: 'f(x) = ' + innen + ' + ' + f.tex(qe) + ' - ' + f.tex(qe) + vz(c) });
      w.push({ text: 'Klammer bilden:', tex: '= (' + innen + ' + ' + f.tex(qe) + ') - ' + f.tex(qe) + vz(c) });
      w.push({ text: 'Binomische Formel anwenden und zusammenfassen:', tex: '= ' + t.spf(1, d, e) });
    } else {
      var at = a.gleich(-1) ? '-' : f.tex(a) + '\\cdot ';
      w.push({ text: '$' + f.tex(a) + '$ ausklammern (nur aus den Gliedern mit $x$):', tex: 'f(x) = ' + at + '(' + innen + ')' + vz(c) });
      w.push({ text: 'Quadratische Ergänzung in der Klammer: $\\left(\\frac{' + f.tex(p) + '}{2}\\right)^2 = ' + f.tex(qe) + '$', tex: '= ' + at + '(' + innen + ' + ' + f.tex(qe) + ' - ' + f.tex(qe) + ')' + vz(c) });
      w.push({ text: 'Die abgezogene Ergänzung aus der Klammer holen. Dabei mit $' + f.tex(a) + '$ malnehmen:', tex: '= ' + at + '(' + innen + ' + ' + f.tex(qe) + ') - ' + f.kl(a) + '\\cdot ' + f.tex(qe) + vz(c) });
      w.push({ text: 'Binomische Formel anwenden und zusammenfassen:', tex: '= ' + t.spf(a, d, e) });
    }
    w.push({ text: 'Scheitelpunkt:', tex: t.punkt(d, e, 'S') });
    return { weg: w, d: d, e: e, qe: qe, p: p };
  }
  function ergaenzungTypisch(a, d, e, qe, c) {
    a = Q.aus(a);
    var l = [
      { wert: P.ausScheitel(a, d, c.plus(a.mal(qe))), text: 'Die Ergänzung muss wieder <strong>abgezogen</strong> werden, damit sich der Term nicht ändert.' },
      { wert: P.ausScheitel(a, d, c), text: 'Die zusätzlich addierte Ergänzung musst du am Ende wieder abziehen.' },
      { wert: P.ausScheitel(a, d.neg(), e), text: 'Vorzeichen in der Klammer: Bei $+' + '\\ldots x$ heißt es $(x + \\ldots)^2$, bei $-\\ldots x$ heißt es $(x - \\ldots)^2$.' }
    ];
    if (!a.gleich(1)) l.push({ wert: P.ausScheitel(a, d, c.minus(qe)), text: 'Beim Herausholen aus der Klammer wird die Ergänzung mit $' + f.tex(a) + '$ malgenommen (im Buch: $-3\\cdot 4$).' });
    return l;
  }

  /* S4 / K: quadratische Ergänzung (Buch S. 85 Nr. 11, 12) */
  function ergaenzung(z, art) {
    var a, d, e;
    if (art === 'a1') { a = Q(1); d = Q(z.nz(-7, 7)); e = Q(z.int(-12, 12)); }
    else if (art === 'halb') { a = Q(1); d = Q(z.wahl([-7, -5, -3, -1, 1, 3, 5, 7]), 2); e = Q(z.int(-8, 8)).plus(Q(z.wahl([0, 1, 3]), 4)); }
    else { a = Q.aus(z.wahl([2, 3, -1, -2, Q(1, 2), -3])); d = Q(z.nz(-4, 4)); e = Q(z.int(-9, 9)); }
    var p = P.ausScheitel(a, d, e), b = p[1], c = p[0];
    var w = ergaenzungWeg(a, b, c);
    return {
      typ: 'ergaenzung-' + art, tr: false,
      text: 'Bring die Funktionsgleichung mit quadratischer Ergänzung in die Scheitelpunktform.',
      formel: 'f(x) = ' + t.poly(p),
      felder: [{ art: 'term', vor: '$f(x) =$', loesung: p, form: 'spf', typisch: ergaenzungTypisch(a, d, e, w.qe, c), platzhalter: 'z. B. (x + 4)^2 − 9' }],
      tipps: [a.gleich(1) ? 'Halbiere den Faktor vor $x$ und quadriere. Diese Zahl addierst du und ziehst sie gleich wieder ab.' : 'Klammere zuerst $' + f.tex(a) + '$ aus den Gliedern mit $x$ aus. Dann quadratische Ergänzung in der Klammer.',
        'Die quadratische Ergänzung ist $\\left(\\frac{' + f.tex(w.p) + '}{2}\\right)^2 = ' + f.tex(w.qe) + '$.'],
      weg: [{ tex: 'f(x) = ' + t.poly(p) }].concat(w.weg.slice(0, -1)),
      grundlage: 'binome'
    };
  }

  /* S5: aus Nullstellen und y-Achsenabschnitt (Buch S. 83 Beispiel B) */
  function ausPunkten(z) {
    var a, ns, c;
    do {
      a = Q.aus(z.wahl([1, -1, 2, -2, Q(1, 2), Q(-1, 2), Q(1, 4), Q(-1, 4), Q(1, 3), Q(-1, 3), Q(-1, 8)]));
      ns = nullstellen(z, false);
      c = a.mal(ns[0] * ns[1]);
    } while (ns[0] === 0 || ns[1] === 0 || !c.istGanz());
    var ansatz = 'a\\cdot ' + t.lin(ns[0]) + '\\cdot ' + t.lin(ns[1]);
    return {
      typ: 'auspunkten', tr: false,
      text: 'Von einer Parabel kennt man die Nullstellen $' + ns[0] + '$ und $' + ns[1] + '$ sowie den y-Achsenabschnitt $' + f.tex(c) + '$. Bestimme die Funktionsgleichung in faktorisierter Form.',
      felder: [{ art: 'term', vor: '$f(x) =$', loesung: P.ausNullstellen(a, ns[0], ns[1]), form: 'fakt', platzhalter: 'z. B. −1/8(x + 2)(x − 4)', typisch: [
        { wert: P.ausNullstellen(a, -ns[0], -ns[1]), text: 'Vorzeichenfalle: Zur Nullstelle $' + ns[0] + '$ gehört der Faktor $' + t.lin(ns[0]) + '$.' },
        { wert: P.ausNullstellen(Q(1).durch(a), ns[0], ns[1]), text: 'Beim Auflösen nach $a$ hast du umgekehrt geteilt. Aus $' + f.tex(Q(ns[0] * ns[1])) + 'a = ' + f.tex(c) + '$ folgt $a = \\frac{' + f.tex(c) + '}{' + f.tex(Q(ns[0] * ns[1])) + '}$.' },
        { wert: P.ausNullstellen(a.neg(), ns[0], ns[1]), text: 'Prüf das Vorzeichen von $a$ mit $f(0) = ' + f.tex(c) + '$.' },
        { wert: P.ausNullstellen(1, ns[0], ns[1]), text: 'Den Streckfaktor $a$ musst du noch mit dem y-Achsenabschnitt bestimmen.' }
      ] }],
      tipps: ['Nullstellen bekannt: Nimm die faktorisierte Form $f(x) = a\\cdot(x - x_1)\\cdot(x - x_2)$.', 'Der y-Achsenabschnitt bedeutet $f(0) = ' + f.tex(c) + '$. Setze $x = 0$ ein und löse nach $a$ auf.'],
      weg: [
        { text: 'Beide Nullstellen bekannt, faktorisierte Form verwenden:', tex: 'f(x) = ' + ansatz },
        { text: 'Der y-Achsenabschnitt ist $' + f.tex(c) + '$, d. h. $f(0) = ' + f.tex(c) + '$:', tex: 'a\\cdot(0 - ' + f.kl(ns[0]) + ')\\cdot(0 - ' + f.kl(ns[1]) + ') = ' + f.tex(c) },
        { tex: f.tex(Q(ns[0] * ns[1])) + 'a = ' + f.tex(c) + '\\;\\Rightarrow\\; a = ' + f.tex(a) },
        { text: 'Gesuchte Funktionsgleichung:', tex: 'f(x) = ' + t.fakt(a, ns[0], ns[1]) }
      ],
      grundlage: 'umstellen'
    };
  }

  /* S6: offene Aufgabe – Parabel mit vorgegebenen Nullstellen (Buch S. 84 Nr. 7) */
  function nullstellenOffen(z) {
    var ns = nullstellen(z, false), unten = z.chance(0.5);
    return {
      typ: 'nullstellenoffen', tr: false,
      text: 'Gib die Gleichung einer Parabel an, die die Nullstellen $x_1 = ' + ns[0] + '$ und $x_2 = ' + ns[1] + '$ hat und nach ' + (unten ? 'unten' : 'oben') + ' geöffnet ist. (Es gibt viele richtige Antworten.)',
      felder: [{ art: 'term', vor: '$f(x) =$', muster: (unten ? '-' : '') + '(x' + (ns[0] > 0 ? '-' : '+') + Math.abs(ns[0]) + ')(x' + (ns[1] > 0 ? '-' : '+') + Math.abs(ns[1]) + ')', bedingung: function (k) {
        var fx = function (x) { return k[2] * x * x + k[1] * x + k[0]; };
        if (Math.abs(k[2]) < 1e-9) return { ok: false, meldung: 'Das ist keine Parabel, der Faktor vor $x^2$ ist null.' };
        var n1 = Math.abs(fx(ns[0])) < 1e-7, n2 = Math.abs(fx(ns[1])) < 1e-7;
        if (!n1 || !n2) return { ok: false, meldung: (n1 || n2 ? 'Eine Nullstelle passt, die andere nicht.' : 'Die Nullstellen passen nicht.') + ' Tipp: faktorisierte Form $a\\cdot(x - x_1)\\cdot(x - x_2)$.' };
        if ((k[2] < 0) !== unten) return { ok: false, meldung: 'Die Nullstellen passen, aber die Öffnung nicht. Das Vorzeichen von $a$ entscheidet.' };
        return { ok: true };
      } }],
      tipps: ['Nimm die faktorisierte Form $f(x) = a\\cdot(x - x_1)\\cdot(x - x_2)$ und wähle ein passendes $a$.', 'Nach ' + (unten ? 'unten' : 'oben') + ' geöffnet heißt $a ' + (unten ? '< 0' : '> 0') + '$, z. B. $a = ' + (unten ? '-1' : '1') + '$.'],
      weg: [{ text: 'Nullstellen in die faktorisierte Form einsetzen, $a ' + (unten ? '< 0' : '> 0') + '$ wählen, zum Beispiel:', tex: 'f(x) = ' + t.fakt(unten ? -1 : 1, ns[0], ns[1]) }, { text: 'Auch $' + t.fakt(unten ? -2 : 2, ns[0], ns[1]) + '$ oder jedes andere $a ' + (unten ? '< 0' : '> 0') + '$ ist richtig.' }]
    };
  }

  /* ---------- Knobel ---------- */

  /* K: Parabel ohne Nullstellen (Buch S. 84 Nr. 8) */
  function ohneNullstellen(z) {
    var d = z.int(-5, 5), e = z.nz(-5, 5);
    return {
      typ: 'ohnenullstellen', tr: false,
      text: 'Gib die Gleichung einer Parabel mit dem Scheitelpunkt $' + t.punkt(d, e, 'S') + '$ an, die <strong>keine</strong> Nullstellen hat. (Es gibt viele richtige Antworten.)',
      felder: [{ art: 'term', vor: '$f(x) =$', form: 'spf', muster: (e < 0 ? '-' : '') + (d === 0 ? 'x^2' : '(x' + (d > 0 ? '-' : '+') + Math.abs(d) + ')^2') + (e > 0 ? '+' : '-') + Math.abs(e), bedingung: function (k) {
        var a = k[2]; if (Math.abs(a) < 1e-9) return { ok: false, meldung: 'Das ist keine Parabel.' };
        var dd = -k[1] / (2 * a), ee = k[0] - a * dd * dd;
        if (Math.abs(dd - d) > 1e-7 || Math.abs(ee - e) > 1e-7) return { ok: false, meldung: 'Der Scheitelpunkt deiner Parabel ist nicht $' + t.punkt(d, e, 'S') + '$.' };
        if (a * e < 0) return { ok: false, meldung: 'Diese Parabel schneidet die x-Achse. Liegt der Scheitelpunkt ' + (e > 0 ? 'oberhalb' : 'unterhalb') + ' der x-Achse, muss die Parabel nach ' + (e > 0 ? 'oben' : 'unten') + ' geöffnet sein.' };
        return { ok: true };
      } }],
      tipps: ['Der Scheitelpunkt liegt ' + (e > 0 ? 'oberhalb' : 'unterhalb') + ' der x-Achse. In welche Richtung muss die Parabel geöffnet sein, damit sie die x-Achse nie trifft?', 'Nach ' + (e > 0 ? 'oben' : 'unten') + ' geöffnet: $a ' + (e > 0 ? '> 0' : '< 0') + '$.'],
      weg: [{ text: 'Scheitelpunkt ' + (e > 0 ? 'oberhalb' : 'unterhalb') + ' der x-Achse, also nach ' + (e > 0 ? 'oben' : 'unten') + ' geöffnet ($a ' + (e > 0 ? '> 0' : '< 0') + '$), zum Beispiel:', tex: 'f(x) = ' + t.spf(e > 0 ? 1 : -1, d, e) }]
    };
  }

  /* K: Welche Gleichung gehört nicht zur selben Parabel? (Buch S. 84 Nr. 6) */
  function gleicheParabel(z) {
    var a = Q.aus(z.wahl([1, -1, 2, -2])), ns;
    do { ns = nullstellen(z, true); } while (ns[0] === -ns[1]); // sonst wären Verfälschungen gleichwertig
    var p = P.ausNullstellen(a, ns[0], ns[1]);
    var d = Q((ns[0] + ns[1]) / 2), e = P.wertQ(p, d);
    var falsch = z.wahl([
      { tex: t.spf(a, d.neg(), e), warum: '' },
      { tex: t.poly([p[0], p[1].neg(), p[2]]), warum: '' },
      { tex: t.fakt(a, -ns[0], -ns[1]), warum: '' },
      { tex: t.spf(a, d, e.neg()), warum: '' }
    ]);
    var richtig = [{ tex: t.spf(a, d, e) }, { tex: t.poly(p) }, { tex: t.fakt(a, ns[0], ns[1]) }];
    var alle = z.mischen(richtig.concat([falsch]));
    var idx = alle.indexOf(falsch);
    alle.forEach(function (o) { if (o !== falsch) o.warum = 'Diese Gleichung gehört zur selben Parabel. Prüf durch Ausmultiplizieren.'; });
    return {
      typ: 'gleicheparabel', tr: false,
      text: 'Drei der vier Gleichungen beschreiben dieselbe Parabel. Welche gehört <strong>nicht</strong> dazu?',
      felder: [{ art: 'mc', loesung: idx, optionen: alle.map(function (o) { return { tex: 'f(x) = ' + o.tex, warum: o.warum }; }) }],
      tipps: ['Multipliziere Scheitelpunktform und faktorisierte Form aus und vergleiche mit der allgemeinen Form.', 'Schneller: Vergleiche Scheitelpunkt, Nullstellen und y-Achsenabschnitt.'],
      weg: [
        { text: 'Die Parabel hat die Nullstellen $' + ns[0] + '$ und $' + ns[1] + '$, den Scheitelpunkt $' + t.punkt(d, e, 'S') + '$ und den y-Achsenabschnitt $' + f.tex(p[0]) + '$:', tex: t.spf(a, d, e) + ' = ' + t.poly(p) + ' = ' + t.fakt(a, ns[0], ns[1]) },
        { text: 'Nicht dazu gehört Antwort ' + 'ABCD'[idx] + ':', tex: 'f(x) = ' + falsch.tex }
      ]
    };
  }

  M.bereich({
    id: 'thema-04', gruppe: 'thema', titel: 'Darstellungsformen der Funktionsgleichung',
    erklaerung:
      '<p>Eine Parabel, drei Darstellungen. Jede hat ihre Vorteile:</p>' +
      '<table><tr><th></th><th>Scheitelpunktform</th><th>allgemeine Form</th><th>faktorisierte Form</th></tr>' +
      '<tr><td>Gleichung</td><td>$f(x) = a\\cdot(x - d)^2 + e$</td><td>$f(x) = ax^2 + bx + c$</td><td>$f(x) = a\\cdot(x - x_1)\\cdot(x - x_2)$</td></tr>' +
      '<tr><td>direkt ablesen</td><td>Streckfaktor $a$, Scheitelpunkt $(d|e)$</td><td>Streckfaktor $a$, Schnittpunkt mit der y-Achse $(0|c)$</td><td>Streckfaktor $a$, Nullstellen $x_1$ und $x_2$</td></tr></table>' +
      '<div class="merk">Der x-Wert des Scheitelpunkts liegt genau in der Mitte zwischen den Nullstellen.<br>Schneidet die Parabel die x-Achse nicht, gibt es keine faktorisierte Form.</div>' +
      '<h3>Faktorisierte Form → allgemeine Form</h3>' +
      '$$0{,}5\\cdot(x - 6)\\cdot(x + 2) = 0{,}5\\cdot(x^2 - 4x - 12) = 0{,}5x^2 - 2x - 6$$' +
      '<h3>Allgemeine Form → Scheitelpunktform: quadratische Ergänzung</h3>' +
      '<p>„Hälfte des Faktors vor $x$ zum Quadrat“ addieren und gleich wieder abziehen:</p>' +
      '$$\\begin{aligned} f(x) &= x^2 + 8x + 7\\\\ &= x^2 + 8x + 16 - 16 + 7\\\\ &= (x^2 + 8x + 16) - 16 + 7\\\\ &= (x + 4)^2 - 9 \\end{aligned}$$' +
      '<p>Mit Faktor vor $x^2$: erst ausklammern.</p>' +
      '$$\\begin{aligned} f(x) &= 3x^2 - 12x + 5\\\\ &= 3\\cdot(x^2 - 4x) + 5\\\\ &= 3\\cdot(x^2 - 4x + 4 - 4) + 5\\\\ &= 3\\cdot(x^2 - 4x + 4) - 3\\cdot 4 + 5\\\\ &= 3\\cdot(x - 2)^2 - 7 \\end{aligned}$$' +
      '<h3>Aus Nullstellen und einem Punkt</h3><p>Nullstellen in $f(x) = a\\cdot(x - x_1)\\cdot(x - x_2)$ einsetzen, dann den Punkt einsetzen und nach $a$ auflösen.</p>',
    generatoren: {
      basis: [ablesen, formErkennen, mitte],
      standard: [faktAllg, spfAllg, faktEigenschaften, function (z) { return ergaenzung(z, 'a1'); }, ausPunkten, nullstellenOffen],
      knobel: [function (z) { return ergaenzung(z, 'a'); }, function (z) { return ergaenzung(z, 'halb'); }, ohneNullstellen, gleicheParabel]
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
