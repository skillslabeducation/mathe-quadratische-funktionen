/* Thema 10: Problemlösen mit quadratischen Funktionen (Buch S. 105–107, AH S. 45). */
(function (root) {
  var M = root.M, Q = M.Q, P = M.P, f = M.f, t = M.t, g = M.g;

  /* Gleichung x² + px + q = 0 lösen, Weg ohne letzte Mengenzeile */
  function loesen(p, q) { return g.pqWeg(Q.aus(p), Q.aus(q)).weg.slice(0, -1); }

  /* B1: Rechteck, Länge k größer als Breite (Buch S. 105 Beispiel A) */
  function rechteckDifferenz(z) {
    var x = z.int(3, 15), k = z.int(1, 8), A = x * (x + k);
    return {
      typ: 'rechteckdiff', tr: false,
      text: 'Ein Rechteck ist ' + k + ' cm länger als breit. Sein Flächeninhalt beträgt ' + A + ' cm². Wie lang und wie breit ist es?',
      felder: [
        { art: 'zahl', label: 'Breite:', nach: 'cm', loesung: x, typisch: [{ wert: -x - k, text: 'Eine negative Länge ergibt hier keinen Sinn. Nimm die positive Lösung.' }] },
        { art: 'zahl', label: 'Länge:', nach: 'cm', loesung: x + k, typisch: [{ wert: x, text: 'Das ist die Breite. Die Länge ist ' + k + ' cm mehr.' }] }
      ],
      tipps: ['Skizze und Variable: Breite $x$, Länge $x + ' + k + '$. Zusammenhang: $x\\cdot(x + ' + k + ') = ' + A + '$.', 'Ausmultiplizieren, alles auf eine Seite, pq-Formel. Eine Lösung ist negativ und fällt weg.'],
      weg: [
        { text: 'Variable: Breite $x$, Länge $x + ' + k + '$. Zusammenhang:', tex: 'x\\cdot(x + ' + k + ') = ' + A },
        { text: 'Umformen:', tex: t.poly([-A, k, 1]) + ' = 0' }
      ].concat(loesen(k, -A)).concat([
        { text: 'Die negative Lösung $' + (-x - k) + '$ ergibt keinen Sinn. Probe: $' + x + '\\cdot ' + (x + k) + ' = ' + A + '$ ✓' },
        { text: 'Das Rechteck ist ' + x + ' cm breit und ' + (x + k) + ' cm lang.' }
      ])
    };
  }

  /* B2: Zahlenrätsel (Buch S. 106 Nr. 5) */
  function zahlenraetsel(z) {
    var art = z.int(0, 1);
    if (art === 0) {
      var n = z.int(4, 30), N = n * (n + 1);
      return {
        typ: 'aufeinanderfolgend', tr: false,
        text: 'Das Produkt zweier aufeinanderfolgender natürlicher Zahlen ist ' + N + '. Wie heißt die kleinere Zahl?',
        felder: [{ art: 'zahl', vor: 'kleinere Zahl:', loesung: n, typisch: [{ wert: -n - 1, text: 'Gesucht sind natürliche Zahlen. Die negative Lösung fällt weg.' }, { wert: n + 1, text: 'Das ist die größere der beiden Zahlen.' }] }],
        tipps: ['Kleinere Zahl $x$, die nächste ist $x + 1$. Zusammenhang: $x\\cdot(x + 1) = ' + N + '$.', 'Umformen zu $x^2 + x - ' + N + ' = 0$ und pq-Formel.'],
        weg: [{ text: 'Zusammenhang:', tex: 'x\\cdot(x + 1) = ' + N }, { text: 'Umformen:', tex: 'x^2 + x - ' + N + ' = 0' }].concat(loesen(1, -N)).concat([{ text: '$' + (-n - 1) + '$ ist keine natürliche Zahl. Die Zahlen sind ' + n + ' und ' + (n + 1) + '. Probe: $' + n + '\\cdot ' + (n + 1) + ' = ' + N + '$ ✓', tex: 'x = ' + n }])
      };
    }
    var r = z.int(2, 9), k = z.int(1, 6), N2 = r * r + k * r; // x² + kx = N2 → x = r oder x = −r − k
    return {
      typ: 'zahlquadrat', tr: false,
      text: 'Das Quadrat einer Zahl, vermehrt um das ' + (k === 1 ? 'Einfache' : k + '-Fache') + ' der Zahl, ergibt ' + N2 + '. Welche Zahlen kommen infrage?',
      felder: [{ art: 'menge', loesung: [r, -r - k], typisch: [{ wert: [r], text: 'Auch eine negative Zahl erfüllt die Bedingung. Es gibt zwei Lösungen.' }] }],
      tipps: ['Zahl $x$. Zusammenhang: $x^2 + ' + (k === 1 ? '' : k) + 'x = ' + N2 + '$.', 'Alles auf eine Seite, dann pq-Formel. Hier sind beide Lösungen sinnvoll.'],
      weg: [{ text: 'Zusammenhang:', tex: t.poly([0, k, 1]) + ' = ' + N2 }, { text: 'Umformen:', tex: t.poly([-N2, k, 1]) + ' = 0' }].concat(loesen(k, -N2)).concat([{ tex: t.menge([-r - k, r]) }])
    };
  }

  /* S1: Acker vergrößern (Buch S. 105 Basiswissen) */
  function vergroessern(z) {
    var L = z.wahl([60, 80, 100, 120]), B = L - z.wahl([10, 20, 30]), x = z.wahl([5, 10, 15, 20]);
    var dA = (L + x) * (B + x) - L * B;
    return {
      typ: 'vergroessern', tr: true,
      text: 'Ein rechteckiger Acker ist ' + L + ' m lang und ' + B + ' m breit. Länge und Breite sollen um gleich viel vergrößert werden, sodass die Fläche um ' + dA + ' m² wächst. Um wie viele Meter muss jede Seite verlängert werden?',
      felder: [{ art: 'zahl', vor: '$x =$', nach: 'm', loesung: x, typisch: [{ wert: -(L + B) - x, text: 'Eine negative Verlängerung ergibt hier keinen Sinn.' }] }],
      tipps: ['Neue Fläche: $(' + L + ' + x)\\cdot(' + B + ' + x) = ' + (L * B) + ' + ' + dA + '$.', 'Ausmultiplizieren, alles auf eine Seite, pq-Formel. Die negative Lösung fällt weg.'],
      weg: [
        { text: 'Zusammenhang:', tex: '(' + L + ' + x)\\cdot(' + B + ' + x) = ' + (L * B + dA) },
        { text: 'Ausmultiplizieren und umformen:', tex: t.poly([-dA, L + B, 1]) + ' = 0' }
      ].concat(loesen(L + B, -dA)).concat([
        { text: 'Die negative Lösung entfällt. Probe: $' + (L + x) + '\\cdot ' + (B + x) + ' = ' + (L * B + dA) + '$ ✓', tex: 'x = ' + x }
      ])
    };
  }

  /* S2: Reihen (Buch S. 106 Nr. 6, AH S. 45 Nr. 1) */
  function reihen(z) {
    var r = z.int(5, 40), k = z.int(2, 15), N = r * (r + k);
    var ding = z.wahl([['Bäume', 'Reihen', 'Bäume je Reihe', 'Bäumen'], ['Sitze', 'Reihen', 'Sitze je Reihe', 'Sitzen'], ['Stühle', 'Reihen', 'Stühle je Reihe', 'Stühlen']]);
    return {
      typ: 'reihen', tr: true,
      text: N + ' ' + ding[0] + ' sollen in gleich langen Reihen aufgestellt werden. In jeder Reihe sollen ' + k + ' ' + ding[0] + ' mehr stehen, als es Reihen gibt.',
      felder: [
        { art: 'zahl', label: 'Anzahl der ' + ding[1] + ':', loesung: r },
        { art: 'zahl', label: ding[2] + ':', loesung: r + k, typisch: [{ wert: r, text: 'Das ist die Anzahl der Reihen. Je Reihe sind es ' + k + ' mehr.' }] }
      ],
      tipps: ['Anzahl der Reihen $x$, je Reihe $x + ' + k + '$. Zusammenhang: $x\\cdot(x + ' + k + ') = ' + N + '$.', 'pq-Formel, nur die positive Lösung ergibt Sinn.'],
      weg: [{ text: 'Zusammenhang:', tex: 'x\\cdot(x + ' + k + ') = ' + N }, { text: 'Umformen:', tex: t.poly([-N, k, 1]) + ' = 0' }].concat(loesen(k, -N)).concat([
        { text: 'Es sind ' + r + ' ' + ding[1] + ' mit je ' + (r + k) + ' ' + ding[3] + '. Probe: $' + r + '\\cdot ' + (r + k) + ' = ' + N + '$ ✓' }])
    };
  }

  /* S3: Umfang und Flächeninhalt gegeben (Buch S. 106 Nr. 4b) */
  function umfangFlaeche(z) {
    var a = z.int(2, 15), b = z.int(a + 1, a + 12), U = 2 * (a + b), A = a * b, s = a + b;
    return {
      typ: 'umfangflaeche', tr: false,
      text: 'Ein Rechteck hat den Umfang ' + U + ' m und den Flächeninhalt ' + A + ' m². Wie lang sind seine Seiten?',
      felder: [{ art: 'menge', label: 'Seitenlängen (in m):', loesung: [a, b], platzhalter: 'z. B. 4; 9' }],
      tipps: ['Eine Seite $x$. Aus dem Umfang: Die andere Seite ist $' + s + ' - x$.', 'Zusammenhang: $x\\cdot(' + s + ' - x) = ' + A + '$. Umformen zu $x^2 - ' + s + 'x + ' + A + ' = 0$.'],
      weg: [{ text: 'Halber Umfang: $' + s + '$ m. Seiten $x$ und $' + s + ' - x$:', tex: 'x\\cdot(' + s + ' - x) = ' + A }, { text: 'Umformen:', tex: t.poly([A, -s, 1]) + ' = 0' }].concat(loesen(-s, A)).concat([
        { text: 'Beide Lösungen ergeben dasselbe Rechteck: Die Seiten sind ' + a + ' m und ' + b + ' m lang.', tex: t.menge([a, b]) }])
    };
  }

  /* K1: Optimieren mit einem Zaun (Buch S. 106 Nr. 9) */
  function optimieren(z) {
    var fluss = z.chance(0.6), L = fluss ? 4 * z.int(10, 50) : 4 * z.int(5, 25);
    var x = L / 4, A = fluss ? x * (L - 2 * x) : x * x;
    var Ap = fluss ? [Q(0), Q(L), Q(-2)] : [Q(0), Q(L / 2), Q(-1)];
    return {
      typ: 'optimieren', tr: false,
      text: 'Mit ' + L + ' m Zaun soll eine rechteckige Weide eingezäunt werden' + (fluss ? ', die an einer Seite an einen Fluss grenzt (dort braucht man keinen Zaun)' : '') + '. Wie groß muss die Seite $x$ ' + (fluss ? 'senkrecht zum Fluss ' : '') + 'sein, damit die Fläche möglichst groß wird?',
      felder: [
        { art: 'zahl', vor: '$x =$', nach: 'm', loesung: x, typisch: [{ wert: L / 2, text: 'Das ist eine Nullstelle von $A(x)$. Das Maximum liegt in der Mitte der Nullstellen.' }] },
        { art: 'zahl', label: 'Größte Fläche:', nach: 'm²', loesung: A }
      ],
      tipps: [fluss ? 'Zwei Seiten $x$ und eine Seite $' + L + ' - 2x$ (die vierte Seite ist der Fluss). Also $A(x) = x\\cdot(' + L + ' - 2x)$.' : 'Zwei Seiten $x$, zwei Seiten $' + (L / 2) + ' - x$. Also $A(x) = x\\cdot(' + (L / 2) + ' - x)$.',
        '$A(x)$ ist eine nach unten geöffnete Parabel. Das Maximum liegt in der Mitte zwischen den Nullstellen.'],
      weg: [
        { text: 'Flächeninhalt als Funktion:', tex: 'A(x) = ' + (fluss ? 'x\\cdot(' + L + ' - 2x)' : 'x\\cdot(' + (L / 2) + ' - x)') + ' = ' + t.poly(Ap) },
        { text: 'Nullstellen:', tex: 'x_1 = 0;\\quad x_2 = ' + (L / 2) },
        { text: 'Maximum in der Mitte:', tex: 'x = ' + x + ';\\quad A(' + x + ') = ' + A },
        { text: fluss ? 'Die Seiten senkrecht zum Fluss sind ' + x + ' m, die Seite parallel zum Fluss ' + (L - 2 * x) + ' m lang. Fläche: ' + A + ' m².' : 'Ein Quadrat mit ' + x + ' m Seitenlänge hat die größte Fläche: ' + A + ' m².' }
      ]
    };
  }

  /* K2: Dreieckszahlen (Buch S. 106 Nr. 7) */
  function dreieckszahlen(z) {
    var n = z.int(8, 40), D = n * (n + 1) / 2;
    return {
      typ: 'dreieckszahlen', tr: false,
      text: 'Die Dreieckszahlen sind 1, 3, 6, 10, … Die $n$-te Dreieckszahl ist $D(n) = \\frac{n\\cdot(n + 1)}{2}$. Die wievielte Dreieckszahl ist ' + D + '?',
      felder: [{ art: 'zahl', vor: '$n =$', loesung: n, typisch: [{ wert: -n - 1, text: '$n$ ist eine Platznummer und muss positiv sein.' }] }],
      tipps: ['Setz $D(n) = ' + D + '$ und multipliziere mit 2.', '$n^2 + n - ' + (2 * D) + ' = 0$, pq-Formel, nur die positive Lösung.'],
      weg: [{ text: 'Gleichung:', tex: '\\frac{n\\cdot(n + 1)}{2} = ' + D + '\\quad |\\cdot 2' }, { tex: 'n^2 + n - ' + (2 * D) + ' = 0' }].concat(loesen(1, -2 * D)).concat([{ text: 'Nur die positive Lösung ergibt Sinn:', tex: 'n = ' + n }])
    };
  }

  /* K3: Kosten, Umsatz, Gewinn (Buch S. 107 Nr. 14) */
  function gewinnzone(z) {
    var a = z.wahl([5, 10, 15]), r1 = z.int(1, 3), r2 = r1 + 2 * z.int(1, 3);
    var m = a * (r1 + r2), c = a * r1 * r2, xm = (r1 + r2) / 2, Gm = a * ((r2 - r1) / 2) * ((r2 - r1) / 2);
    var G = [Q(-c), Q(m), Q(-a)];
    return {
      typ: 'gewinnzone', tr: false,
      text: 'Eine Firma stellt Stühle her. Für $x$ (in 100 Stück) gilt: Kosten $K(x) = ' + a + 'x^2 + ' + c + '$, Umsatz $U(x) = ' + m + 'x$ (beides in 100 €).',
      felder: [
        { art: 'term', label: 'Gewinnfunktion:', vor: '$G(x) =$', loesung: G, form: 'allg', typisch: [{ wert: [Q(c), Q(-m), Q(a)], text: 'Gewinn ist Umsatz minus Kosten: $G(x) = U(x) - K(x)$.' }, { wert: [Q(c), Q(m), Q(-a)], text: 'Minus vor der Klammer: Auch die ' + c + ' wird abgezogen.' }] },
        { art: 'menge', label: 'Ab wann und bis wann macht die Firma Gewinn? (Gewinnschwellen, $G(x) = 0$)', loesung: [r1, r2] },
        { art: 'zahl', label: 'Maximaler Gewinn (in 100 €):', loesung: Gm, typisch: [{ wert: xm, text: 'Das ist die Stückzahl. Gesucht ist $G(' + xm + ')$.' }] }
      ],
      tipps: ['$G(x) = U(x) - K(x)$. Achtung: Die ganzen Kosten werden abgezogen, also Klammer setzen.', 'Gewinnschwellen: $G(x) = 0$. Maximaler Gewinn in der Mitte der Gewinnschwellen.'],
      weg: [
        { text: 'Gewinn = Umsatz − Kosten:', tex: 'G(x) = ' + m + 'x - (' + a + 'x^2 + ' + c + ') = ' + t.poly(G) },
        { text: '$G(x) = 0$, durch $' + (-a) + '$ teilen:', tex: t.poly([r1 * r2, -(r1 + r2), 1]) + ' = 0\\;\\Rightarrow\\; x_1 = ' + r1 + ';\\; x_2 = ' + r2 },
        { text: 'Maximum in der Mitte:', tex: 'G(' + xm + ') = ' + Gm },
        { text: 'Zwischen ' + (r1 * 100) + ' und ' + (r2 * 100) + ' Stühlen macht die Firma Gewinn, am meisten bei ' + (xm * 100) + ' Stück: ' + (Gm * 100) + ' €.' }
      ]
    };
  }

  M.bereich({
    id: 'thema-10', gruppe: 'thema', titel: 'Problemlösen',
    erklaerung:
      '<p>Sachaufgaben löst du in fünf Schritten:</p>' +
      '<ol><li><strong>Skizze und Variable:</strong> Was ist gesucht? Nenne es $x$.</li>' +
      '<li><strong>Zusammenhang:</strong> Stelle eine Gleichung oder Funktion auf.</li>' +
      '<li><strong>Rechnerische Lösung:</strong> pq-Formel, Wurzelziehen oder „Produkt = 0“-Regel.</li>' +
      '<li><strong>Probe:</strong> Passt das Ergebnis, auch mit Einheiten? Ergibt jede Lösung Sinn?</li>' +
      '<li><strong>Ergebnis:</strong> Antwortsatz.</li></ol>' +
      '<p>Beispiel: Ein Rechteck ist 4 cm länger als breit und hat 117 cm² Fläche. Breite $x$:</p>' +
      '$$x\\cdot(x + 4) = 117 \\;\\Rightarrow\\; x^2 + 4x + 4 = 121 \\;\\Rightarrow\\; (x + 2)^2 = 121 \\;\\Rightarrow\\; x + 2 = \\pm 11$$' +
      '<p>$x_1 = 9$; $x_2 = -13$ ergibt keinen Sinn. Das Rechteck ist 9 cm breit und 13 cm lang.</p>' +
      '<div class="merk"><strong>Optimieren:</strong> Ist nach dem Größten oder Kleinsten gefragt, stell eine quadratische Funktion auf. Das Maximum oder Minimum ist der Scheitelpunkt.</div>',
    generatoren: {
      basis: [rechteckDifferenz, zahlenraetsel],
      standard: [vergroessern, reihen, umfangFlaeche],
      knobel: [optimieren, dreieckszahlen, gewinnzone]
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
