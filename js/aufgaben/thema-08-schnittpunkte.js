/* Thema 8: Schnittpunkte von zwei Graphen rechnerisch bestimmen (Buch S. 103, AH S. 46 Nr. 3, 4). */
(function (root) {
  var M = root.M, Q = M.Q, P = M.P, f = M.f, t = M.t, g = M.g;

  function paar(z, max, ohneNull) {
    var a, b;
    do { a = z.int(-max, max); b = z.int(-max, max); } while (a >= b || (ohneNull && (a === 0 || b === 0)));
    return [a, b];
  }
  function punkteTex(pts) { return pts.map(function (p, i) { return t.punkt(p[0], p[1], 'S_' + (i + 1)); }).join(';\\quad '); }
  /* Standard-Lösungsweg: gleichsetzen, umformen, lösen, y berechnen */
  function weg(fTex, gTex, diff, xs, gp, gName) {
    var w = [{ text: 'Funktionsterme gleichsetzen:', tex: fTex + ' = ' + gTex }, { text: 'Alles auf eine Seite:', tex: t.poly(diff) + ' = 0' }];
    var a = M.P.koeff(diff, 2);
    if (!a.gleich(1)) w.push({ text: 'Durch $' + f.tex(a) + '$ teilen:', tex: t.poly(P.skal(diff, Q(1).durch(a))) + ' = 0' });
    var nz = P.skal(diff, Q(1).durch(a));
    if (nz[0] && nz[0].istNull()) w.push({ text: '$x$ ausklammern, „Produkt = 0“-Regel:', tex: 'x\\cdot(' + t.poly([nz[1], 1]) + ') = 0\\;\\Rightarrow\\; x_1 = ' + xs[0] + ';\\; x_2 = ' + xs[1] });
    else w = w.concat(g.pqWeg(nz[1] || Q(0), nz[0]).weg.slice(0, -1));
    w.push({ text: 'y-Werte: x in die einfachere Funktion $' + gName + '$ einsetzen:', tex: xs.map(function (x) { return gName + '(' + f.tex(x) + ') = ' + f.tex(P.wertQ(gp, x)); }).join(';\\quad ') });
    w.push({ text: 'Schnittpunkte:', tex: punkteTex(xs.map(function (x) { return [x, P.wertQ(gp, x)]; })) });
    return w;
  }
  var NUR_X = 'Das sind nur die x-Werte. Gesucht sind Punkte $(x|y)$.';

  /* B1: Parabel und waagerechte Gerade */
  function waagerecht(z) {
    var a = z.wahl([1, -1, 2]), d = z.int(-3, 3), r = z.int(1, 4), k = z.int(-4, 5);
    var e = k - a * r * r;
    var fp = P.ausScheitel(a, d, e), xs = [d - r, d + r];
    return {
      typ: 'waagerecht', tr: false,
      text: 'Berechne die Schnittpunkte von $f(x) = ' + t.spf(a, d, e) + '$ und $g(x) = ' + k + '$.',
      felder: [{ art: 'punkte', loesung: xs.map(function (x) { return [x, k]; }), typisch: [{ wert: xs.map(function (x) { return [-x, k]; }), text: 'Vorzeichen beim Auflösen: Aus $' + t.lin(d) + '$ folgt $x = ' + d + ' \\pm \\ldots$.' }] }],
      tipps: ['Gleichsetzen: $' + t.spf(a, d, e) + ' = ' + k + '$. Dann wie in Thema 7 nach $x$ auflösen.', 'Die y-Koordinate ist bei beiden Punkten ' + k + ', denn $g$ ist waagerecht.'],
      weg: [
        { text: 'Gleichsetzen:', tex: t.spf(a, d, e) + ' = ' + k },
        { text: 'Umformen:', tex: t.lin(d) + '^2 = ' + (r * r) },
        { text: 'Wurzel ziehen:', tex: 'x_1 = ' + xs[0] + ';\\quad x_2 = ' + xs[1] },
        { text: '$g$ ist waagerecht, also ist $y = ' + k + '$:', tex: punkteTex(xs.map(function (x) { return [x, k]; })) }
      ]
    };
  }

  /* B2/B3: Parabel und Gerade (AH S. 46) */
  function parabelGerade(z, mitSchnittstellen) {
    var xs = paar(z, 4), m = z.int(-3, 3), n = z.int(-5, 5);
    var gp = [Q(n), Q(m)];
    var diff = P.ausNullstellen(1, xs[0], xs[1]);            // f − g
    var fp = P.plus(diff, gp);
    var loes = xs.map(function (x) { return [x, P.wertQ(gp, x)]; });
    var felder = [];
    if (mitSchnittstellen) felder.push({ art: 'menge', label: 'Schnittstellen (nur die x-Werte):', loesung: xs });
    felder.push({ art: 'punkte', label: mitSchnittstellen ? 'Schnittpunkte:' : null, loesung: loes, typisch: [{ wert: xs.map(function (x) { return [x, P.wertQ(fp, x).plus(1)]; }), text: 'Prüf die y-Werte noch einmal.' }] });
    return {
      typ: mitSchnittstellen ? 'schnittstellenpunkte' : 'parabelgerade', tr: false,
      text: 'Berechne die Schnittpunkte von $f(x) = ' + t.poly(fp) + '$ und $g(x) = ' + t.poly(gp) + '$.',
      felder: felder,
      tipps: ['Gleichsetzen $f(x) = g(x)$, alles auf eine Seite bringen, mit pq-Formel oder „Produkt = 0“-Regel lösen.', 'Am Ende die x-Werte in $g$ einsetzen. Das ist einfacher als $f$.'],
      weg: weg(t.poly(fp), t.poly(gp), diff, xs, gp, 'g')
    };
  }

  /* S1: zwei Parabeln (Check-up Merkkasten S. 111) */
  function zweiParabeln(z) {
    var xs = paar(z, 4), k = z.wahl([1, 2, -1, -2, 3]);
    var diff = P.ausNullstellen(k, xs[0], xs[1]);               // f − g
    var gp = [Q(z.int(-5, 5)), Q(z.int(-4, 4)), Q(z.wahl([1, -1, 2]))];
    var fp = P.plus(gp, diff);
    if (P.koeff(fp, 2).istNull()) return zweiParabeln(z);
    var einfach = P.koeff(gp, 1).istNull() || Math.abs(P.koeff(gp, 1).wert()) <= Math.abs(P.koeff(fp, 1).wert()) ? 'g' : 'f';
    var ep = einfach === 'g' ? gp : fp;
    var loes = xs.map(function (x) { return [x, P.wertQ(gp, x)]; });
    return {
      typ: 'zweiparabeln', tr: false,
      text: 'Berechne die Schnittpunkte der Parabeln $f(x) = ' + t.poly(fp) + '$ und $g(x) = ' + t.poly(gp) + '$.',
      felder: [{ art: 'punkte', loesung: loes }],
      tipps: ['Gleichsetzen und alles auf eine Seite. Die Glieder mit $x^2$ fassen sich zusammen.', 'Fehlt danach die Zahl ohne $x$, klammere $x$ aus. Sonst pq-Formel.'],
      weg: weg(t.poly(fp), t.poly(gp), diff, xs, ep, einfach)
    };
  }

  /* S2: Wie viele Schnittpunkte? (Buch S. 92 Nr. 6c) */
  function anzahl(z) {
    var m2 = z.nz(-3, 3), Dz = z.int(0, 2), D = [-z.int(1, 6), 0, z.int(1, 9)][Dz];
    var p = Q(2 * m2), q = Q(m2 * m2 - D);
    var m = z.int(-2, 2), n = z.int(-3, 3);
    var gp = [Q(n), Q(m)], fp = P.plus([q, p, Q(1)], gp);
    return {
      typ: 'anzahlschnitt', tr: false,
      text: 'Wie viele gemeinsame Punkte haben $f(x) = ' + t.poly(fp) + '$ und $g(x) = ' + t.poly(gp) + '$?',
      felder: [{ art: 'mc', loesung: Dz, optionen: [{ html: 'keinen', warum: 'Rechne die Diskriminante von $f(x) - g(x) = 0$ aus.' }, { html: 'genau einen', warum: 'Rechne die Diskriminante von $f(x) - g(x) = 0$ aus.' }, { html: 'zwei', warum: 'Rechne die Diskriminante von $f(x) - g(x) = 0$ aus.' }] }],
      tipps: ['Gleichsetzen und alles auf eine Seite bringen.', 'Die Diskriminante $D = \\left(\\frac{p}{2}\\right)^2 - q$ verrät die Anzahl: $D > 0$ zwei, $D = 0$ einer, $D < 0$ keiner.'],
      weg: [{ text: 'Gleichsetzen und umformen:', tex: t.poly([q, p, 1]) + ' = 0' }, { text: 'Diskriminante:', tex: 'D = \\left(\\frac{' + f.tex(p) + '}{2}\\right)^2 - ' + f.kl(q) + ' = ' + D }, { text: ['$D < 0$: kein gemeinsamer Punkt.', '$D = 0$: genau ein gemeinsamer Punkt (die Gerade berührt die Parabel).', '$D > 0$: zwei Schnittpunkte.'][Dz] }]
    };
  }

  /* S3: zwei verschobene Normalparabeln (Check-up Nr. 17b) */
  function normalparabeln(z) {
    var d1 = z.int(-4, 4), d2, x0 = z.int(-3, 3), e1 = z.int(-4, 4);
    do { d2 = z.int(-4, 4); } while (d2 === d1);
    var e2 = d1 * d1 - d2 * d2 + e1 - 2 * (d1 - d2) * x0;
    if (Math.abs(e2) > 12) return normalparabeln(z);
    var y0 = (x0 - d1) * (x0 - d1) + e1;
    return {
      typ: 'normalparabeln', tr: false,
      text: 'Berechne die Schnittpunkte der verschobenen Normalparabeln $f(x) = ' + t.spf(1, d1, e1) + '$ und $g(x) = ' + t.spf(1, d2, e2) + '$.',
      felder: [{ art: 'punkte', loesung: [[x0, y0]], typisch: [] }],
      tipps: ['Multipliziere beide Terme aus und setze sie gleich. Das $x^2$ fällt weg.', 'Es bleibt eine lineare Gleichung, also gibt es hier genau einen Schnittpunkt.'],
      weg: [
        { text: 'Ausmultiplizieren:', tex: 'f(x) = ' + t.poly(P.ausScheitel(1, d1, e1)) + ',\\quad g(x) = ' + t.poly(P.ausScheitel(1, d2, e2)) },
        { text: 'Gleichsetzen, $x^2$ fällt weg:', tex: t.poly(P.minus(P.ausScheitel(1, d1, e1), P.ausScheitel(1, d2, e2))) + ' = 0\\;\\Rightarrow\\; x = ' + x0 },
        { text: 'y-Wert:', tex: 'f(' + x0 + ') = ' + y0 },
        { tex: t.punkt(x0, y0, 'S') }
      ]
    };
  }

  /* K1: Schnittpunkte mit Wurzeln, gerundet (Buch S. 103 Basiswissen) */
  function gerundet(z) {
    var mh = z.int(-3, 3), D = z.wahl([2, 3, 5, 6, 7, 10, 11, 13]);
    var p = Q(-2 * mh), q = Q(mh * mh - D);
    var m = z.int(-2, 3), n = z.int(-4, 6);
    var gp = [Q(n), Q(m)], fp = P.plus([q, p, Q(1)], gp);
    var xs = [mh - Math.sqrt(D), mh + Math.sqrt(D)];
    var loes = xs.map(function (x) { return [x, m * x + n]; });
    return {
      typ: 'gerundet', tr: true,
      text: 'Berechne die Schnittpunkte von $f(x) = ' + t.poly(fp) + '$ und $g(x) = ' + t.poly(gp) + '$. Runde auf zwei Nachkommastellen.',
      felder: [{ art: 'punkte', loesung: loes, runden: 2, platzhalter: 'z. B. (5,16|11,16); (−1,16|4,84)' }],
      tipps: ['Gleichsetzen, alles auf eine Seite, pq-Formel. Die Wurzel geht nicht auf.', 'Rechne die y-Werte mit den ungerundeten x-Werten aus, z. B. $g(' + mh + ' + \\sqrt{' + D + '})$. Erst am Ende runden.'],
      weg: [{ text: 'Gleichsetzen und umformen:', tex: t.poly([q, p, 1]) + ' = 0' }].concat(g.pqWeg(p, q).weg.slice(0, -1)).concat([
        { text: 'y-Werte mit $g$ (ungerundet einsetzen, dann runden):', tex: xs.map(function (x) { return 'g(' + f.tex(x, 2) + '\\ldots) \\approx ' + f.tex(m * x + n, 2); }).join(';\\quad ') },
        { text: 'Schnittpunkte:', tex: loes.map(function (p, i) { return 'S_' + (i + 1) + ' \\approx (' + f.tex(p[0], 2) + '\\,|\\,' + f.tex(p[1], 2) + ')'; }).join(';\\quad ') }
      ])
    };
  }

  /* K2: gleiche Höhe zur gleichen Zeit (Buch S. 103 Nr. 10) */
  function gleicheHoehe(z) {
    var c = z.int(20, 60), T = z.int(5, 15), b2 = z.int(20, 40);
    var b1 = b2 + T;               // −5t² + b1 t + c = −4t² + b2 t + c  ⇔  −t² + T t = 0
    var h = -5 * T * T + b1 * T + c;
    if (h <= 0) return gleicheHoehe(z);
    return {
      typ: 'gleichehoehe', tr: false,
      text: 'Zwei Feuerwerksraketen werden gleichzeitig vom selben Dach gestartet. Ihre Höhen (in m) nach $t$ Sekunden sind $f(t) = -5t^2 + ' + b1 + 't + ' + c + '$ und $g(t) = -4t^2 + ' + b2 + 't + ' + c + '$.',
      felder: [
        { art: 'menge', label: 'Zu welchen Zeitpunkten sind beide gleich hoch (in s)?', loesung: [0, T], typisch: [{ wert: [T], text: 'Auch beim Start ($t = 0$) sind beide gleich hoch.' }] },
        { art: 'zahl', label: 'In welcher Höhe treffen sie sich nach dem Start (in m)?', loesung: h }
      ],
      tipps: ['Gleichsetzen: $f(t) = g(t)$. Die Zahl ' + c + ' fällt weg.', 'Klammere $t$ aus: $t\\cdot(\\ldots) = 0$. Die Höhe bekommst du durch Einsetzen.'],
      weg: [
        { text: 'Gleichsetzen und umformen:', tex: '-t^2 + ' + T + 't = 0' },
        { text: '$t$ ausklammern:', tex: 't\\cdot(-t + ' + T + ') = 0\\;\\Rightarrow\\; t_1 = 0;\\; t_2 = ' + T },
        { text: 'Höhe nach ' + T + ' s:', tex: 'g(' + T + ') = -4\\cdot ' + T + '^2 + ' + b2 + '\\cdot ' + T + ' + ' + c + ' = ' + h },
        { text: 'Nach ' + T + ' Sekunden sind beide Raketen ' + h + ' m hoch.' }
      ]
    };
  }

  M.bereich({
    id: 'thema-08', gruppe: 'thema', titel: 'Schnittpunkte von zwei Graphen rechnerisch bestimmen',
    erklaerung:
      '<p>Im Schnittpunkt stimmen die y-Werte überein: $f(x) = g(x)$.</p>' +
      '<div class="merk">1. Funktionsterme gleichsetzen.<br>2. Alles auf eine Seite bringen und die x-Koordinaten bestimmen (pq-Formel oder „Produkt = 0“-Regel).<br>3. y-Koordinaten: x-Werte in eine der Funktionen einsetzen (die einfachere).<br>4. Ergebnis als <strong>Punkte</strong> angeben.</div>' +
      '<p>Beispiel: $f(x) = x^2 - 4x + 1$ und $g(x) = -x^2 + 1$.</p>' +
      '$$x^2 - 4x + 1 = -x^2 + 1 \\;\\Rightarrow\\; 2x^2 - 4x = 0 \\;\\Rightarrow\\; 2x\\cdot(x - 2) = 0 \\;\\Rightarrow\\; x_1 = 0;\\; x_2 = 2$$' +
      '$$g(0) = 1,\\quad g(2) = -3 \\qquad S_1(0|1);\\; S_2(2|-3)$$' +
      '<p><strong>Achtung:</strong> Nur die x-Werte („Schnittstellen“) reichen nicht. Gefragt sind Schnittpunkte mit x und y.</p>',
    generatoren: {
      basis: [waagerecht, function (z) { return parabelGerade(z, false); }, function (z) { return parabelGerade(z, true); }],
      standard: [zweiParabeln, anzahl, normalparabeln],
      knobel: [gerundet, gleicheHoehe, zweiParabeln]
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
