/* Thema 6: Gleichungen grafisch lösen – Nullstellen- und Schnittstellenverfahren (Buch S. 91–92, AH S. 41). */
(function (root) {
  var M = root.M, Q = M.Q, P = M.P, f = M.f, t = M.t, g = M.g;

  var TOL = 0.1, TOL_NAEH = 0.15;
  /* m·(x) + n mit eingesetztem x als TeX */
  function linEin(m, n, x) {
    var s = m === 0 ? '' : (m === 1 ? '' : (m === -1 ? '-' : f.tex(m) + '\\cdot ')) + f.kl(x);
    if (n) s += (s ? (n < 0 ? ' - ' + (-n) : ' + ' + n) : String(n));
    return s || '0';
  }
  function paar(z, max) {
    var a, b;
    do { a = z.int(-max, max); b = z.int(-max, max); } while (a >= b);
    return [a, b];
  }

  /* B1: Nullstellenverfahren */
  function nullstellenverfahren(z) {
    var r = paar(z, 4), a = z.wahl([1, 1, -1, Q(1, 2)]);
    var p = P.ausNullstellen(a, r[0], r[1]);
    var d = (r[0] + r[1]) / 2, e = P.wertQ(p, d).wert();
    if (Math.abs(e) > 8) return nullstellenverfahren(z);
    var w = g.fenster([[r[0], 0], [r[1], 0], [d, e]], 1);
    return {
      typ: 'nullstellenverfahren', tr: false,
      text: 'Löse die Gleichung $' + t.poly(p) + ' = 0$ grafisch. Abgebildet ist der Graph von $f(x) = ' + t.poly(p) + '$.',
      graph: { x: w.x, y: w.y, breite: 340, kurven: [{ fn: g.fn(p), name: 'f' }] },
      felder: [{ art: 'menge', label: 'Lösungen:', loesung: r, toleranz: TOL, typisch: [{ wert: [P.wertQ(p, 0).wert()], text: 'Das ist der Schnittpunkt mit der y-Achse. Die Lösungen von $f(x) = 0$ sind die Nullstellen, also die Schnittstellen mit der x-Achse.' }] }],
      tipps: ['Nullstellenverfahren: Die Lösungen von $f(x) = 0$ sind die Nullstellen von $f$.', 'Lies ab, wo die Parabel die x-Achse schneidet. Mach dann die Probe durch Einsetzen.'],
      weg: [{ text: 'Die Parabel schneidet die x-Achse bei', tex: 'x_1 = ' + r[0] + ';\\quad x_2 = ' + r[1] }, { text: 'Probe: $f(' + r[0] + ') = 0$ und $f(' + r[1] + ') = 0$ ✓', tex: t.menge(r) }]
    };
  }

  /* B2: Schnittstellenverfahren x² = mx + n */
  function schnittstellen(z) {
    var r = paar(z, 3), m = r[0] + r[1], n = -r[0] * r[1];
    var w = { x: [Math.min(-4, r[0] - 1), Math.max(4, r[1] + 1)], y: [-2, Math.max(9, Math.max(r[0] * r[0], r[1] * r[1]) + 1)] };
    return {
      typ: 'schnittstellen', tr: false,
      text: 'Löse $x^2 = ' + t.poly([n, m]) + '$ grafisch. Abgebildet sind die Normalparabel $f(x) = x^2$ und die Gerade $g(x) = ' + t.poly([n, m]) + '$.',
      graph: { x: w.x, y: w.y, breite: 340, kurven: [{ fn: function (x) { return x * x; }, name: 'f' }, { fn: function (x) { return m * x + n; }, name: 'g', farbe: '#d0452f' }] },
      felder: [{ art: 'menge', label: 'Lösungen:', loesung: r, toleranz: TOL, typisch: [{ wert: [r[0] * r[0], r[1] * r[1]], text: 'Das sind die y-Werte der Schnittpunkte. Die Lösungen sind die x-Werte.' }] }],
      tipps: ['Schnittstellenverfahren: Die Lösungen sind die x-Koordinaten der Schnittpunkte von $f$ und $g$.', 'Nur die x-Werte angeben. Probe: Setz sie links und rechts ein.'],
      weg: [{ text: 'Schnittpunkte ablesen, davon die x-Koordinaten:', tex: 'x_1 = ' + r[0] + ';\\quad x_2 = ' + r[1] },
        { text: 'Probe:', tex: f.kl(r[0]) + '^2 = ' + (r[0] * r[0]) + ',\\quad g(' + r[0] + ') = ' + linEin(m, n, r[0]) + ' = ' + (m * r[0] + n) + '\\;\\checkmark' }, { tex: t.menge(r) }]
    };
  }

  /* B3: Anzahl der Lösungen am Graphen */
  function anzahl(z) {
    var a = z.wahl([1, -1, Q(1, 2), Q(-1, 2)]), d = z.int(-3, 3), e = z.int(-3, 3);
    a = Q.aus(a);
    var fall = z.int(0, 2); // 0 keine, 1 eine, 2 zwei
    var k = fall === 1 ? e : e + (fall === 2 ? 1 : -1) * a.vz() * z.int(1, 3);
    var p = P.ausScheitel(a, d, e);
    var w = g.fenster([[d - 3, e], [d + 3, e], [0, k]], 2);
    return {
      typ: 'anzahlgrafisch', tr: false,
      text: 'Wie viele Lösungen hat die Gleichung $' + t.spf(a, d, e) + ' = ' + k + '$? Abgebildet sind $f(x) = ' + t.spf(a, d, e) + '$ und $g(x) = ' + k + '$.',
      graph: { x: w.x, y: w.y, breite: 340, kurven: [{ fn: g.fn(p), name: 'f' }, { fn: function () { return k; }, name: 'g', farbe: '#d0452f' }] },
      felder: [{ art: 'mc', loesung: fall, optionen: [{ html: 'keine Lösung', warum: 'Zähle die Schnittpunkte von Parabel und Gerade.' }, { html: 'genau eine Lösung', warum: 'Genau eine Lösung gibt es nur, wenn die Gerade die Parabel im Scheitelpunkt berührt.' }, { html: 'zwei Lösungen', warum: 'Zähle die Schnittpunkte von Parabel und Gerade.' }] }],
      tipps: ['Jeder Schnittpunkt von Parabel und Gerade ist eine Lösung.', 'Berührt die Gerade die Parabel genau im Scheitelpunkt, gibt es eine Lösung.'],
      weg: [{ text: ['Parabel und Gerade schneiden sich nicht: keine Lösung.', 'Die Gerade berührt die Parabel im Scheitelpunkt: genau eine Lösung.', 'Parabel und Gerade schneiden sich zweimal: zwei Lösungen.'][fall] }]
    };
  }

  /* S1: geschickt umformen (Buch S. 91 Beispiel A, AH S. 41 Nr. 2) */
  function umformen(z) {
    var r = paar(z, 3), p = -(r[0] + r[1]), q = r[0] * r[1];
    if (q === 0) return umformen(z);
    var gl = [Q(-q), Q(-p)];
    var w = { x: [Math.min(-4, r[0] - 1), Math.max(4, r[1] + 1)], y: [-2, Math.max(9, Math.max(r[0] * r[0], r[1] * r[1]) + 1)] };
    return {
      typ: 'umformengrafisch', tr: false,
      text: 'Forme $' + t.poly([q, p, 1]) + ' = 0$ so um, dass links nur $x^2$ steht. Dann kannst du die Normalparabel mit einer Geraden schneiden. Die Gerade ist schon eingezeichnet.',
      graph: { x: w.x, y: w.y, breite: 340, kurven: [{ fn: function (x) { return x * x; }, name: 'f' }, { fn: g.fn(gl), name: 'g', farbe: '#d0452f' }] },
      felder: [
        { art: 'term', label: 'Umgeformt: $x^2 = g(x)$ mit', vor: '$g(x) =$', loesung: gl, mitX: p !== 0, typisch: [{ wert: [Q(q), Q(p)], text: 'Beim Rüberbringen dreht sich das Vorzeichen um: Aus $' + (p > 0 ? '+' : '') + p + 'x$ links wird $' + (-p > 0 ? '+' : '') + (-p) + 'x$ rechts.' }] },
        { art: 'menge', label: 'Lösungen (abgelesen):', loesung: r, toleranz: TOL }
      ],
      tipps: ['Bring alles außer $x^2$ auf die rechte Seite. Vorzeichen umdrehen!', 'Die Lösungen sind die x-Werte der Schnittpunkte von Normalparabel und Gerade.'],
      weg: [{ text: 'Umformen:', tex: 'x^2 = ' + t.poly(gl) }, { text: 'Schnittstellen ablesen:', tex: 'x_1 = ' + r[0] + ';\\quad x_2 = ' + r[1] }, { tex: t.menge(r) }]
    };
  }

  /* S2: Näherungslösung und exakte Lösung (Buch S. 91 Basiswissen ②, S. 92 Nr. 4) */
  function naeherung(z) {
    var d = z.int(-2, 3), n = z.wahl([2, 3, 5, 6, 7]);
    var p = P.ausScheitel(1, d, -n);
    var l = [d - Math.sqrt(n), d + Math.sqrt(n)];
    var w = g.fenster([[d - 4, 0], [d + 4, 0], [d, -n]], 1);
    return {
      typ: 'naeherung', tr: false,
      text: 'Löse $' + t.spf(1, d, -n) + ' = 0$. Lies zuerst Näherungslösungen am Graphen ab (auf eine Nachkommastelle). Berechne dann die exakten Lösungen.',
      graph: { x: w.x, y: w.y, breite: 360, kurven: [{ fn: g.fn(p), name: 'f' }] },
      felder: [
        { art: 'menge', label: 'Näherung (abgelesen):', loesung: l, toleranz: TOL_NAEH, platzhalter: 'z. B. 1,6; 4,4' },
        { art: 'mc', label: 'Sind die abgelesenen Werte exakte Lösungen?', loesung: 1, optionen: [{ html: 'ja', warum: 'Mach die Einsetzprobe mit deinem abgelesenen Wert: Es kommt nicht genau 0 heraus.' }, { html: 'nein, nur Näherungen' }] },
        { art: 'menge', label: 'Exakte Lösungen:', loesung: l, wurzel: true, platzhalter: 'z. B. 3 + √2; 3 − √2' }
      ],
      tipps: ['Die Lösungen sind die Nullstellen. Am Graphen kannst du sie nur ungefähr ablesen.', 'Exakt: Bring $' + n + '$ nach rechts und zieh die Wurzel: $' + t.lin(d) + '^2 = ' + n + '$.'],
      weg: [
        { text: 'Ablesen:', tex: 'x_1 \\approx ' + f.tex(l[0], 1) + ';\\quad x_2 \\approx ' + f.tex(l[1], 1) },
        { text: 'Einsetzprobe:', tex: 'f(' + f.tex(l[1], 1) + ') = ' + f.tex(f.runde(P.wert(p, f.runde(l[1], 1)), 2)) + ' \\neq 0\\;\\text{: nicht exakt}' },
        { text: 'Exakt rechnen:', tex: t.lin(d) + '^2 = ' + n + '\\;\\Rightarrow\\; x - ' + f.kl(d) + ' = \\pm\\sqrt{' + n + '}' },
        { tex: '\\mathbb{L} = \\{' + (d ? d + ' - ' : '-') + '\\sqrt{' + n + '};\\ ' + (d ? d + ' + ' : '') + '\\sqrt{' + n + '}\\}' }
      ]
    };
  }

  /* S3: Einsetzprobe (Buch S. 91 Basiswissen ①) */
  function einsetzprobe(z) {
    var exakt = z.chance(0.5), a = z.wahl([1, 2]), x0, m, n;
    if (exakt) { x0 = z.wahl([-2, -1, 1, 2, 3]); var r2 = z.nz(-3, 4); if (r2 === x0) r2++; m = a * (x0 + r2); n = -a * x0 * r2; }
    else { m = z.int(1, 4); n = z.int(2, 9); var s = (m + Math.sqrt(m * m + 4 * a * n)) / (2 * a); x0 = Math.round(s * 2) / 2; if (Math.abs(x0 - s) < 1e-9) return einsetzprobe(z); }
    var fx = a * x0 * x0, gx = m * x0 + n;
    var fq = Q.aus(fx), gq = Q.aus(gx);
    return {
      typ: 'einsetzprobe', tr: false,
      text: 'Bei der Gleichung $' + (a === 1 ? '' : a) + 'x^2 = ' + t.poly([n, m]) + '$ wurde am Graphen $x \\approx ' + f.tex(x0) + '$ abgelesen. Mach die Einsetzprobe.',
      felder: [
        { art: 'zahl', label: 'Linke Seite:', vor: '$' + (a === 1 ? '' : a + '\\cdot ') + f.kl(x0) + '^2 =$', loesung: fq },
        { art: 'zahl', label: 'Rechte Seite:', vor: '$' + linEin(m, n, x0) + ' =$', loesung: gq },
        { art: 'mc', label: 'Ist $x = ' + f.tex(x0) + '$ eine exakte Lösung?', loesung: exakt ? 0 : 1, optionen: [{ html: 'ja, exakt', warum: 'Links und rechts kommt nicht dasselbe heraus.' }, { html: 'nein, nur eine Näherung', warum: 'Links und rechts kommt genau dasselbe heraus. Dann ist es eine exakte Lösung.' }] }
      ],
      tipps: ['Setz den Wert links und rechts ein und rechne beide Seiten aus.', 'Kommt auf beiden Seiten genau dasselbe heraus, ist die Lösung exakt. Sonst ist sie nur eine Näherung.'],
      weg: [{ text: 'Links:', tex: (a === 1 ? '' : a + '\\cdot ') + f.kl(x0) + '^2 = ' + f.tex(fq) }, { text: 'Rechts:', tex: linEin(m, n, x0) + ' = ' + f.tex(gq) },
        { text: exakt ? 'Beide Seiten sind gleich: Die Lösung ist exakt.' : 'Die Seiten sind verschieden: Die Lösung ist nicht exakt, nur eine Näherung.' }],
      grundlage: 'rechenregeln'
    };
  }

  /* K1: Lösungen aus zwei gezeichneten Graphen (Buch S. 92 Nr. 7, AH S. 41 Nr. 1) */
  function zweiGraphen(z) {
    var r = paar(z, 4), m = z.int(-2, 2), n = z.int(-3, 3);
    // f(x) − g(x) = (x − r0)(x − r1)  =>  f(x) = x² − (r0 + r1)x + r0 r1 + m x + n
    var fp = [Q(r[0] * r[1] + n), Q(m - r[0] - r[1]), Q(1)], gp = [Q(n), Q(m)];
    var pts = r.map(function (x) { return [x, m * x + n]; });
    var w = g.fenster(pts.concat([[(r[0] + r[1]) / 2, P.wertQ(fp, (r[0] + r[1]) / 2).wert()]]), 1);
    if (w.y[1] - w.y[0] > 16 || w.x[1] - w.x[0] > 14) return zweiGraphen(z);
    return {
      typ: 'zweigraphen', tr: false,
      text: 'Gezeichnet sind $f(x) = ' + t.poly(fp) + '$ und $g(x) = ' + t.poly(gp) + '$. Lies die Lösungen der Gleichung $f(x) = g(x)$ ab.',
      graph: { x: w.x, y: w.y, breite: 360, kurven: [{ fn: g.fn(fp), name: 'f' }, { fn: g.fn(gp), name: 'g', farbe: '#d0452f' }] },
      felder: [{ art: 'menge', label: 'Lösungen:', loesung: r, toleranz: TOL, typisch: [{ wert: pts.map(function (p) { return p[1]; }), text: 'Das sind die y-Werte der Schnittpunkte. Gesucht sind die x-Werte.' }] }],
      tipps: ['Die Lösungen von $f(x) = g(x)$ sind die x-Koordinaten der Schnittpunkte.', 'Mach zur Kontrolle die Probe: $f(x)$ und $g(x)$ müssen gleich sein.'],
      weg: [{ text: 'Schnittpunkte:', tex: t.punkt(pts[0][0], pts[0][1]) + ',\\ ' + t.punkt(pts[1][0], pts[1][1]) }, { text: 'Davon die x-Werte:', tex: t.menge(r) }]
    };
  }

  /* K2: Parameter für eine bestimmte Anzahl von Lösungen (Buch S. 92 Nr. 6b) */
  function parameterAnzahl(z) {
    var art = z.int(0, 1), m, b, k;
    if (art === 0) {
      m = 2 * z.nz(-3, 3); b = -(m * m) / 4;
      return {
        typ: 'beruehren', tr: false,
        text: 'Für welche Zahl $b$ hat die Gleichung $x^2 = ' + t.poly([0, m]) + ' + b$ genau eine Lösung?',
        felder: [{ art: 'zahl', vor: '$b =$', loesung: b, typisch: [{ wert: -b, text: 'Prüf das Vorzeichen. Rechne mit der Diskriminante nach: Genau eine Lösung gibt es bei $D = 0$.' }] }],
        tipps: ['Umformen zu $x^2 ' + (m > 0 ? '- ' + m : '+ ' + (-m)) + 'x - b = 0$. Genau eine Lösung gibt es bei Diskriminante $D = 0$.', '$D = \\left(\\frac{p}{2}\\right)^2 - q$ mit $p = ' + (-m) + '$ und $q = -b$.'],
        weg: [{ text: 'Umformen:', tex: 'x^2 ' + (m > 0 ? '- ' + m : '+ ' + (-m)) + 'x - b = 0' }, { text: 'Genau eine Lösung bei $D = 0$:', tex: 'D = \\left(\\frac{' + (-m) + '}{2}\\right)^2 - (-b) = ' + (m * m / 4) + ' + b = 0' }, { tex: 'b = ' + b }]
      };
    }
    k = z.int(-3, 5); var fall = z.int(0, 2);
    var antw = ['$e > ' + k + '$', '$e = ' + k + '$', '$e < ' + k + '$'];
    return {
      typ: 'anzahlparameter', tr: false,
      text: 'Die Gleichung lautet $x^2 + e = ' + k + '$. Für welche Werte von $e$ hat sie ' + ['keine Lösung', 'genau eine Lösung', 'zwei Lösungen'][fall] + '?',
      felder: [{ art: 'mc', loesung: fall, optionen: antw.map(function (a, i) { return { html: a, warum: 'Forme um: $x^2 = ' + k + ' - e$. Zwei Lösungen, wenn rechts etwas Positives steht. Eine, wenn 0. Keine, wenn negativ.' }; }) }],
      tipps: ['Forme um zu $x^2 = ' + k + ' - e$.', 'Rechts positiv: zwei Lösungen. Rechts 0: eine. Rechts negativ: keine.'],
      weg: [{ text: 'Umformen:', tex: 'x^2 = ' + k + ' - e' }, { text: ['Keine Lösung, wenn $' + k + ' - e < 0$, also $e > ' + k + '$.', 'Genau eine Lösung, wenn $' + k + ' - e = 0$, also $e = ' + k + '$.', 'Zwei Lösungen, wenn $' + k + ' - e > 0$, also $e < ' + k + '$.'][fall] }]
    };
  }

  M.bereich({
    id: 'thema-06', gruppe: 'thema', titel: 'Gleichungen grafisch lösen',
    erklaerung:
      '<p>Fasse linke und rechte Seite der Gleichung als Funktionsterme auf. Die x-Koordinaten der Schnittpunkte sind die Lösungen.</p>' +
      '<h3>① Schnittstellenverfahren</h3><p>$2x^2 = 4x + 10$: Zeichne $f(x) = 2x^2$ und $g(x) = 4x + 10$. Abgelesen: $x_1 \\approx -1{,}5$; $x_2 \\approx 3{,}5$.</p>' +
      '<p>Geschickt: Forme so um, dass links $x^2$ steht. Dann brauchst du nur die Normalparabel und eine Gerade: $x^2 - 3x - 4 = 0 \\Leftrightarrow x^2 = 3x + 4$.</p>' +
      '<h3>② Nullstellenverfahren</h3><p>$(x - 3)^2 - 2 = 0$: Zeichne $f(x) = (x - 3)^2 - 2$ und lies die Nullstellen ab: $x_1 \\approx 1{,}6$; $x_2 \\approx 4{,}4$.</p>' +
      '<div class="merk"><strong>Einsetzprobe:</strong> Setz den abgelesenen Wert ein. Kommt links und rechts genau dasselbe heraus, ist die Lösung exakt. Sonst ist sie nur eine Näherung: $f(1{,}6) = -0{,}04 \\neq 0$.<br>Meistens sind die Lösungen quadratischer Gleichungen irrational, grafisch bekommt man dann nur Näherungen.</div>' +
      '<p>Näherungen schreibt man mit „≈“: $\\mathbb{L} \\approx \\{-1{,}5;\\ 3{,}5\\}$.</p>',
    generatoren: {
      basis: [nullstellenverfahren, schnittstellen, anzahl],
      standard: [umformen, naeherung, einsetzprobe],
      knobel: [zweiGraphen, parameterAnzahl, naeherung]
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
