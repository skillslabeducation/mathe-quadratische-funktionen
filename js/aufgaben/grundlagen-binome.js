/* Grundlage 3: Binomische Formeln (vorwärts und rückwärts). */
(function (root) {
  var M = root.M, Q = M.Q, P = M.P, f = M.f, t = M.t, g = M.g;

  function kl(a) { return t.lin(Q.aus(a).neg()); } // (x + a)

  /* Basis 1/2: (x + a)² bzw. (x − a)² */
  function binom12(z) {
    var a = z.nz(-9, 9);
    var erg = [Q(a * a), Q(2 * a), Q(1)];
    var plus = a > 0;
    return {
      typ: plus ? 'binom1' : 'binom2', tr: false, text: 'Multipliziere mit der binomischen Formel aus.',
      formel: kl(a) + '^2',
      felder: [{ art: 'term', loesung: erg, form: 'allg', typisch: [
        { wert: [Q(a * a), Q(0), Q(1)], text: 'Das mittlere Glied fehlt. $' + kl(a) + '^2 = ' + kl(a) + '\\cdot ' + kl(a) + '$, und jeder mit jedem ergibt auch $2\\cdot x\\cdot ' + f.kl(a) + '$.' },
        { wert: [Q(-a * a), Q(0), Q(1)], text: '$' + kl(a) + '^2$ ist nicht $x^2 - ' + (a * a) + '$. Schreib die Klammer zweimal hin und multipliziere jeden mit jedem.' },
        { wert: [Q(a * a), Q(a), Q(1)], text: 'Das mittlere Glied ist $2\\cdot ' + f.kl(a) + '\\cdot x$. Die 2 fehlt.' },
        { wert: [Q(-a * a), Q(2 * a), Q(1)], text: 'Das letzte Glied ist ein Quadrat, also immer positiv: $' + f.kl(a) + '^2 = ' + (a * a) + '$.' }
      ] }],
      tipps: [plus ? '1. binomische Formel: $(a + b)^2 = a^2 + 2ab + b^2$' : '2. binomische Formel: $(a - b)^2 = a^2 - 2ab + b^2$',
        'Hier ist $a = x$ und $b = ' + Math.abs(a) + '$. Das mittlere Glied ist $2\\cdot x\\cdot ' + Math.abs(a) + ' = ' + (2 * Math.abs(a)) + 'x$.'],
      weg: [
        { text: 'Mit der ' + (plus ? '1.' : '2.') + ' binomischen Formel, $a = x$ und $b = ' + Math.abs(a) + '$:', tex: kl(a) + '^2 = x^2 ' + (plus ? '+' : '-') + ' 2\\cdot x\\cdot ' + Math.abs(a) + ' + ' + Math.abs(a) + '^2' },
        { tex: '= ' + t.poly(erg) }
      ]
    };
  }

  /* Basis 3: (x + a)(x − a) */
  function binom3(z) {
    var a = z.int(1, 12);
    var erg = [Q(-a * a), Q(0), Q(1)];
    return {
      typ: 'binom3', tr: false, text: 'Multipliziere mit der binomischen Formel aus.',
      formel: z.chance(0.5) ? kl(a) + '\\cdot ' + kl(-a) : kl(-a) + '\\cdot ' + kl(a),
      felder: [{ art: 'term', loesung: erg, form: 'allg', typisch: [
        { wert: [Q(a * a), Q(0), Q(1)], text: 'Das letzte Glied ist $' + a + '\\cdot(-' + a + ') = -' + (a * a) + '$.' },
        { wert: [Q(a * a), Q(-2 * a), Q(1)], text: 'Das ist die 2. binomische Formel. Hier hast du aber eine Plus- und eine Minusklammer: die 3. binomische Formel.' }
      ] }],
      tipps: ['3. binomische Formel: $(a + b)\\cdot(a - b) = a^2 - b^2$', 'Die beiden mittleren Glieder $+' + a + 'x$ und $-' + a + 'x$ heben sich auf.'],
      weg: [
        { text: 'Mit der 3. binomischen Formel, $a = x$ und $b = ' + a + '$:', tex: 'x^2 - ' + a + '^2' },
        { tex: '= ' + t.poly(erg) }
      ]
    };
  }

  /* Standard 4: rückwärts, als Quadrat schreiben */
  function rueckwaerts(z) {
    var a = z.nz(-9, 9);
    var p = [Q(a * a), Q(2 * a), Q(1)];
    return {
      typ: 'binomrueck', tr: false, text: 'Schreibe den Term als Quadrat einer Klammer, also in der Form $(x + b)^2$ oder $(x - b)^2$.',
      formel: t.poly(p),
      felder: [{ art: 'term', loesung: p, form: 'quadrat', platzhalter: 'z. B. (x − 3)^2', typisch: [
        { wert: P.ausScheitel(1, a, 0), text: 'Schau aufs Vorzeichen des mittleren Glieds: $' + (a > 0 ? '+' : '-') + Math.abs(2 * a) + 'x$ gehört zu $' + kl(a) + '^2$.' }
      ] }],
      tipps: ['Das letzte Glied ist $b^2$. Welche Zahl quadriert ergibt $' + (a * a) + '$?', 'Das Vorzeichen des mittleren Glieds verrät, ob es $(x + \\ldots)^2$ oder $(x - \\ldots)^2$ ist.'],
      weg: [
        { text: 'Letztes Glied: $' + (a * a) + ' = ' + Math.abs(a) + '^2$, also $b = ' + Math.abs(a) + '$.' },
        { text: 'Mittleres Glied: $2\\cdot x\\cdot ' + Math.abs(a) + ' = ' + Math.abs(2 * a) + 'x$ passt. Das Vorzeichen ist ' + (a > 0 ? 'plus' : 'minus') + '.', tex: t.poly(p) + ' = ' + kl(a) + '^2' }
      ]
    };
  }

  /* Standard 5: Lücke für die quadratische Ergänzung */
  function luecke(z, knobel) {
    var b2 = knobel ? z.wahl([1, 3, 5, 7, -1, -3, -5, -7, 9, -9]) : z.wahl([4, 6, 8, 10, 12, 14, -4, -6, -8, -10, -12, -14]);
    var h = Q(b2, 2), c = h.mal(h);
    return {
      typ: knobel ? 'lueckehalb' : 'luecke', tr: false,
      text: 'Ergänze die Lücken so, dass eine binomische Formel entsteht.',
      formel: 'x^2 ' + (b2 > 0 ? '+ ' : '- ') + Math.abs(b2) + 'x + \\boxed{\\phantom{0}\\;?\\;\\phantom{0}} = \\left(x ' + (b2 > 0 ? '+' : '-') + ' \\boxed{\\phantom{0}\\;?\\;\\phantom{0}}\\right)^2',
      felder: [
        { art: 'zahl', label: 'Erste Lücke (Zahl ohne x):', loesung: c, typisch: [
          { wert: h.abs(), text: 'Das ist die Hälfte. Die Zahl ohne $x$ ist das Quadrat davon.' },
          { wert: Q(b2 * b2), text: 'Erst halbieren, dann quadrieren: $\\left(\\frac{' + Math.abs(b2) + '}{2}\\right)^2$.' },
          { wert: Q(Math.abs(b2)), text: 'Halbiere den Faktor vor $x$ und quadriere das Ergebnis.' }
        ] },
        { art: 'zahl', label: 'Zweite Lücke (in der Klammer, ohne Vorzeichen):', loesung: h.abs(), typisch: [
          { wert: c, text: 'In die Klammer gehört die Hälfte des Faktors vor $x$, nicht ihr Quadrat.' },
          { wert: Q(Math.abs(b2)), text: 'In die Klammer gehört die <strong>Hälfte</strong> des Faktors vor $x$.' }
        ] }
      ],
      tipps: ['„Halbiere den Faktor vor $x$ und quadriere.“ Das ist die quadratische Ergänzung.', 'Die Hälfte von $' + Math.abs(b2) + '$ ist $' + f.tex(h.abs()) + '$.'],
      weg: [
        { text: 'Faktor vor $x$ halbieren:', tex: '\\frac{' + Math.abs(b2) + '}{2} = ' + f.tex(h.abs()) },
        { text: 'Quadrieren ergibt die fehlende Zahl:', tex: f.tex(h.abs()) + '^2 = ' + f.tex(c) },
        { text: 'Kontrolle mit der binomischen Formel:', tex: 'x^2 ' + (b2 > 0 ? '+ ' : '- ') + Math.abs(b2) + 'x + ' + f.tex(c) + ' = ' + t.lin(h.neg()) + '^2' }
      ],
      grundlage: 'binome'
    };
  }

  /* Knobel 6: (kx ± a)² */
  function binomK(z) {
    var k = z.wahl([2, 3, 4]), a = z.nz(-7, 7);
    var erg = [Q(a * a), Q(2 * k * a), Q(k * k)];
    var term = '(' + t.poly([a, k]) + ')^2';
    return {
      typ: 'binomk', tr: false, text: 'Multipliziere mit der binomischen Formel aus.', formel: term,
      felder: [{ art: 'term', loesung: erg, form: 'allg', typisch: [
        { wert: [Q(a * a), Q(2 * k * a), Q(k)], text: 'Auch der Faktor vor $x$ wird quadriert: $(' + k + 'x)^2 = ' + (k * k) + 'x^2$.' },
        { wert: [Q(a * a), Q(0), Q(k * k)], text: 'Das mittlere Glied $2\\cdot ' + k + 'x\\cdot ' + f.kl(a) + '$ fehlt.' },
        { wert: [Q(a * a), Q(2 * a), Q(k * k)], text: 'Im mittleren Glied steht $2\\cdot ' + k + 'x\\cdot ' + f.kl(a) + '$, der Faktor ' + k + ' gehört dazu.' }
      ] }],
      tipps: ['Binomische Formel mit $a = ' + k + 'x$ und $b = ' + Math.abs(a) + '$.', '$(' + k + 'x)^2 = ' + (k * k) + 'x^2$ und $2\\cdot ' + k + 'x\\cdot ' + Math.abs(a) + ' = ' + (2 * k * Math.abs(a)) + 'x$.'],
      weg: [
        { text: 'Binomische Formel mit $a = ' + k + 'x$ und $b = ' + Math.abs(a) + '$:', tex: term + ' = (' + k + 'x)^2 ' + (a > 0 ? '+' : '-') + ' 2\\cdot ' + k + 'x\\cdot ' + Math.abs(a) + ' + ' + Math.abs(a) + '^2' },
        { tex: '= ' + t.poly(erg) }
      ]
    };
  }

  /* Knobel 7: rückwärts mit Faktor */
  function rueckwaertsK(z) {
    var k = z.wahl([2, 3]), a = z.nz(-5, 5);
    var p = [Q(a * a), Q(2 * k * a), Q(k * k)];
    return {
      typ: 'binomrueckk', tr: false, text: 'Schreibe den Term als Quadrat einer Klammer.',
      formel: t.poly(p),
      felder: [{ art: 'term', loesung: p, form: 'quadrat', platzhalter: 'z. B. (2x + 3)^2', typisch: [
        { wert: [Q(a * a), Q(-2 * k * a), Q(k * k)], text: 'Schau aufs Vorzeichen des mittleren Glieds.' }
      ] }],
      tipps: ['Erstes Glied: Welcher Term quadriert ergibt $' + (k * k) + 'x^2$? Letztes Glied: Welche Zahl quadriert ergibt $' + (a * a) + '$?', 'Prüf mit dem mittleren Glied: $2\\cdot ' + k + 'x\\cdot ' + Math.abs(a) + ' = ' + (2 * k * Math.abs(a)) + 'x$.'],
      weg: [
        { text: '$' + (k * k) + 'x^2 = (' + k + 'x)^2$ und $' + (a * a) + ' = ' + Math.abs(a) + '^2$.' },
        { text: 'Mittleres Glied passt, Vorzeichen ' + (a > 0 ? 'plus' : 'minus') + ':', tex: t.poly(p) + ' = (' + t.poly([a, k]) + ')^2' }
      ]
    };
  }

  /* Standard: 3. binomische Formel rückwärts */
  function rueckwaerts3(z) {
    var a = z.int(2, 11);
    var p = [Q(-a * a), Q(0), Q(1)];
    return {
      typ: 'binom3rueck', tr: false, text: 'Schreibe den Term als Produkt zweier Klammern (3. binomische Formel).',
      formel: t.poly(p),
      felder: [{ art: 'term', loesung: p, form: 'fakt', platzhalter: 'z. B. (x + 4)(x − 4)', typisch: [
        { wert: P.ausScheitel(1, a, 0), text: 'Das wäre $x^2 - ' + (2 * a) + 'x + ' + (a * a) + '$. Bei $x^2 - ' + (a * a) + '$ brauchst du eine Plus- und eine Minusklammer.' }
      ] }],
      tipps: ['$a^2 - b^2 = (a + b)\\cdot(a - b)$', '$' + (a * a) + ' = ' + a + '^2$'],
      weg: [{ text: '$' + (a * a) + ' = ' + a + '^2$, also mit der 3. binomischen Formel:', tex: t.poly(p) + ' = (x + ' + a + ')\\cdot(x - ' + a + ')' }]
    };
  }

  M.bereich({
    id: 'binome', gruppe: 'grundlagen', titel: 'Binomische Formeln',
    kurz: 'Vorwärts ausmultiplizieren und rückwärts erkennen. Die Grundlage der quadratischen Ergänzung.',
    brauchst: 'Scheitelpunktform → allgemeine Form, quadratische Ergänzung, Gleichungen wie $(x - 3)^2 = 16$',
    erklaerung:
      '<table><tr><td>1. binomische Formel</td><td>$(a + b)^2 = a^2 + 2ab + b^2$</td></tr>' +
      '<tr><td>2. binomische Formel</td><td>$(a - b)^2 = a^2 - 2ab + b^2$</td></tr>' +
      '<tr><td>3. binomische Formel</td><td>$(a + b)\\cdot(a - b) = a^2 - b^2$</td></tr></table>' +
      '<div class="merk"><strong>Klassiker-Fehler:</strong> $(x - 3)^2 \\neq x^2 - 9$. Richtig ist $(x - 3)^2 = x^2 - 6x + 9$. Das mittlere Glied $2ab$ nie vergessen.</div>' +
      '<h3>Rückwärts erkennen</h3><p>$x^2 + 8x + 16$: Die 16 ist $4^2$, und $2\\cdot x\\cdot 4 = 8x$ passt. Also $x^2 + 8x + 16 = (x + 4)^2$.</p>' +
      '<h3>Ergänzen (quadratische Ergänzung)</h3><p>Bei $x^2 + 10x + \\square$ fehlt „die Hälfte des Faktors vor $x$ zum Quadrat“: $\\left(\\frac{10}{2}\\right)^2 = 25$. Dann gilt $x^2 + 10x + 25 = (x + 5)^2$.</p>',
    generatoren: {
      basis: [binom12, binom12, binom3],
      standard: [rueckwaerts, function (z) { return luecke(z, false); }, rueckwaerts3],
      knobel: [binomK, rueckwaertsK, function (z) { return luecke(z, true); }]
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
