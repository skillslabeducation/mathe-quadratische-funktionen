/* Grundlage 2: Klammern ausmultiplizieren. */
(function (root) {
  var M = root.M, Q = M.Q, P = M.P, f = M.f, t = M.t, g = M.g;

  function termAufgabe(o) {
    return {
      typ: o.typ, tr: false,
      text: o.text || 'Multipliziere aus und fasse zusammen.',
      formel: o.formel,
      felder: [{ art: 'term', label: o.label, loesung: o.loesung, form: o.form || 'allg', typisch: o.typisch }],
      tipps: o.tipps, weg: o.weg, grundlage: o.grundlage
    };
  }
  /* x + a als TeX-Klammer */
  function kl(a) { return t.lin(Q.aus(a).neg()); }

  /* Basis 1: Zahl mal Klammer */
  function zahlMalKlammer(z) {
    var k = z.wahl([-5, -4, -3, -2, 2, 3, 4, 5]), m = z.int(1, 3), n = z.nz(-9, 9);
    var innen = [Q(n), Q(m)];
    var erg = P.skal(innen, k);
    return termAufgabe({
      typ: 'zahlklammer', formel: f.tex(k) + '\\cdot (' + t.poly(innen) + ')', loesung: erg,
      typisch: [
        { wert: [Q(n), Q(k * m)], text: 'Der Faktor gilt für jeden Summanden in der Klammer, auch für den zweiten.' },
        { wert: [Q(-k * n), Q(k * m)], text: 'Prüf das Vorzeichen beim zweiten Produkt: $' + f.tex(k) + '\\cdot ' + f.kl(n) + ' = ' + f.tex(k * n) + '$.' }
      ],
      tipps: ['Jeder Summand in der Klammer wird mit $' + f.tex(k) + '$ malgenommen.', 'Rechne $' + f.tex(k) + '\\cdot ' + t.poly([0, m]) + '$ und $' + f.tex(k) + '\\cdot ' + f.kl(n) + '$ getrennt.'],
      weg: [
        { text: 'Jeden Summanden mit dem Faktor malnehmen:', tex: f.tex(k) + '\\cdot ' + t.poly([0, m]) + ' + ' + f.kl(k) + '\\cdot ' + f.kl(n) },
        { text: 'Vorzeichenregeln beachten:', tex: '= ' + t.poly(erg) }
      ]
    });
  }

  /* Basis 2: Minus vor der Klammer */
  function minusVorKlammer(z) {
    var a = z.nz(-5, 6), b = z.int(-9, 9), c = z.nz(-5, 5), d = z.nz(-9, 9);
    if (a === c) a = a + 1 === 0 ? 2 : a + 1;
    var erg = [Q(b - d), Q(a - c)];
    return termAufgabe({
      typ: 'minusklammer', formel: t.poly([b, a]) + ' - (' + t.poly([d, c]) + ')', loesung: erg,
      typisch: [
        { wert: [Q(b + d), Q(a - c)], text: 'Ein Minus vor der Klammer dreht <strong>alle</strong> Vorzeichen in der Klammer um, auch das zweite.' },
        { wert: [Q(b + d), Q(a + c)], text: 'Die Klammer darf nur wegfallen, wenn du alle Vorzeichen darin umdrehst.' },
        { wert: [Q(b - d), Q(a + c)], text: 'Auch das Vorzeichen beim $x$-Glied in der Klammer dreht sich um.' }
      ],
      tipps: ['Minus vor der Klammer heißt: Klammer weglassen und jedes Vorzeichen darin umdrehen.', 'Aus $-(' + t.poly([d, c]) + ')$ wird $' + t.poly([-d, -c]) + '$.'],
      weg: [
        { text: 'Klammer auflösen, alle Vorzeichen in der Klammer umdrehen:', tex: g.summe([{ c: a, v: 'x' }, { c: b, v: '' }, { c: -c, v: 'x' }, { c: -d, v: '' }]) },
        { text: 'Gleiche Glieder zusammenfassen:', tex: '= ' + t.poly(erg) }
      ]
    });
  }

  /* Standard 3: (x + a)(x + b) */
  function klammerMalKlammer(z) {
    var a = z.nz(-9, 9), b = z.nz(-9, 9);
    if (a === -b) b = b + (b > 0 ? 1 : -1);
    var erg = [Q(a * b), Q(a + b), Q(1)];
    return termAufgabe({
      typ: 'klammerklammer', formel: kl(a) + '\\cdot ' + kl(b), loesung: erg,
      typisch: [
        { wert: [Q(a * b), Q(0), Q(1)], text: 'Jeder mit jedem: Auch $x\\cdot ' + f.kl(b) + '$ und $' + f.kl(a) + '\\cdot x$ gehören dazu. Das mittlere Glied fehlt.' },
        { wert: [Q(-a * b), Q(a + b), Q(1)], text: 'Prüf das Vorzeichen beim Produkt der beiden Zahlen: $' + f.kl(a) + '\\cdot ' + f.kl(b) + ' = ' + f.tex(a * b) + '$.' },
        { wert: [Q(a * b), Q(-(a + b)), Q(1)], text: 'Prüf das Vorzeichen beim Glied mit $x$.' }
      ],
      tipps: ['Jeder Summand der ersten Klammer wird mit jedem Summanden der zweiten Klammer malgenommen. Das sind vier Produkte.', 'Die vier Produkte: $x\\cdot x$, $x\\cdot ' + f.kl(b) + '$, $' + f.kl(a) + '\\cdot x$ und $' + f.kl(a) + '\\cdot ' + f.kl(b) + '$.'],
      weg: [
        { text: 'Jeder mit jedem (vier Produkte):', tex: g.summe([{ c: 1, v: 'x^2' }, { c: b, v: 'x' }, { c: a, v: 'x' }, { c: a * b, v: '' }]) },
        { text: 'Die beiden Glieder mit $x$ zusammenfassen:', tex: '= ' + t.poly(erg) }
      ]
    });
  }

  /* Standard 4: (cx + a)(x + b) */
  function klammerMalKlammerC(z) {
    var c = z.wahl([2, 3, -1, -2]), a = z.nz(-7, 7), b = z.nz(-7, 7);
    var erg = [Q(a * b), Q(c * b + a), Q(c)];
    if (c * b + a === 0) a = a + 1 === 0 ? 2 : a + 1, erg = [Q(a * b), Q(c * b + a), Q(c)];
    return termAufgabe({
      typ: 'klammerklammerc', formel: '(' + t.poly([a, c]) + ')\\cdot ' + kl(b), loesung: erg,
      typisch: [
        { wert: [Q(a * b), Q(0), Q(c)], text: 'Jeder mit jedem: Das mittlere Glied mit $x$ fehlt.' },
        { wert: [Q(-a * b), Q(c * b + a), Q(c)], text: 'Prüf das Vorzeichen beim Produkt der beiden Zahlen.' }
      ],
      tipps: ['Vier Produkte: jeder Summand der ersten Klammer mit jedem der zweiten.', 'Die Produkte sind $' + t.poly([0, c]) + '\\cdot x$, $' + t.poly([0, c]) + '\\cdot ' + f.kl(b) + '$, $' + f.kl(a) + '\\cdot x$ und $' + f.kl(a) + '\\cdot ' + f.kl(b) + '$.'],
      weg: [
        { text: 'Jeder mit jedem:', tex: g.summe([{ c: c, v: 'x^2' }, { c: c * b, v: 'x' }, { c: a, v: 'x' }, { c: a * b, v: '' }]) },
        { text: 'Zusammenfassen:', tex: '= ' + t.poly(erg) }
      ]
    });
  }

  /* Standard 5: k(x + a) − m(x + b) */
  function zweiKlammern(z) {
    var k = z.wahl([2, 3, 4, 5]), m = z.wahl([1, 2, 3]), a = z.nz(-6, 6), b = z.nz(-6, 6);
    if (k === m) k++;
    var erg = [Q(k * a - m * b), Q(k - m)];
    var mt = m === 1 ? '' : m + '\\cdot ';
    return termAufgabe({
      typ: 'zweiklammern', formel: k + '\\cdot ' + kl(a) + ' - ' + mt + kl(b), loesung: erg,
      typisch: [
        { wert: [Q(k * a + m * b), Q(k - m)], text: 'Beim zweiten Teil steht ein Minus vor dem Produkt. Es dreht auch das Vorzeichen der Zahl in der Klammer um.' },
        { wert: [Q(k * a - b), Q(k - m)], text: 'Der Faktor ' + m + ' gilt für beide Summanden in der Klammer.' }
      ],
      tipps: ['Löse die Klammern nacheinander auf. Das Minus vor der zweiten Klammer gehört zum Faktor: $-' + m + '$.', 'Rechne $-' + m + '\\cdot x$ und $-' + m + '\\cdot ' + f.kl(b) + '$.'],
      weg: [
        { text: 'Beide Klammern auflösen (Faktor $-' + m + '$ bei der zweiten):', tex: g.summe([{ c: k, v: 'x' }, { c: k * a, v: '' }, { c: -m, v: 'x' }, { c: -m * b, v: '' }]) },
        { text: 'Zusammenfassen:', tex: '= ' + t.poly(erg) }
      ]
    });
  }

  /* Knobel 6: k·(x − a)·(x − b) */
  function faktorVorProdukt(z) {
    var k = z.wahl([Q(2), Q(-1), Q(-2), Q(3), Q(1, 2), Q(-1, 2)]);
    var a = z.nz(-6, 6), b = z.nz(-6, 6);
    if (a === b) b = -b;
    var innen = P.ausNullstellen(1, a, b);
    var erg = P.skal(innen, k);
    var typ = [];
    if (!k.gleich(-1)) typ.push({ wert: [innen[0], innen[1], k], text: 'Der Faktor gilt für den ganzen Term. Erst die Klammern ausmultiplizieren, dann <strong>jeden</strong> Summanden mit dem Faktor malnehmen.' });
    if (!k.abs().gleich(1)) typ.push({ wert: P.skal(innen, k.mal(k)), text: 'Den Faktor nur einmal verwenden, nicht in beide Klammern hineinziehen.' });
    if (k.gleich(-1)) typ.push({ wert: [innen[0], innen[1], Q(-1)], text: 'Das Minus vorne gilt für alle Summanden: Alle Vorzeichen drehen sich um.' });
    return termAufgabe({
      typ: 'faktorprodukt', formel: t.fakt(k, a, b), loesung: erg, typisch: typ,
      tipps: ['Zuerst die beiden Klammern miteinander ausmultiplizieren. Den Faktor davor erst danach berücksichtigen.', 'Es gilt $' + kl(-a) + '\\cdot ' + kl(-b) + ' = ' + t.poly(innen) + '$. Jetzt jeden Summanden mit $' + f.tex(k) + '$ malnehmen.'],
      weg: [
        { text: 'Erst die Klammern ausmultiplizieren:', tex: t.fakt(k, a, b) + ' = ' + (k.gleich(-1) ? '-' : f.tex(k) + '\\cdot ') + '(' + t.poly(innen) + ')' },
        { text: 'Dann jeden Summanden mit $' + f.tex(k) + '$ malnehmen:', tex: '= ' + t.poly(erg) }
      ],
      grundlage: 'klammern'
    });
  }

  /* Knobel 7: Scheitelpunktform in allgemeine Form */
  function scheitelAusmultiplizieren(z) {
    var a = z.wahl([Q(2), Q(-1), Q(-2), Q(3), Q(1, 2), Q(-1, 2)]);
    var d = Q(z.nz(-5, 5)), e = Q(z.int(-6, 6));
    var bin = P.ausScheitel(1, d, 0);           // (x − d)²
    var erg = P.ausScheitel(a, d, e);
    var typ = [
      { wert: [a.mal(d.mal(d)).neg().plus(e), Q(0), a], text: 'Binomische Formel: $' + t.lin(d) + '^2 = ' + t.poly(bin) + '$, nicht $x^2 - ' + f.tex(d.mal(d)) + '$.' },
      { wert: [d.mal(d).plus(e), d.mal(-2), a], text: 'Der Faktor $' + f.tex(a) + '$ gilt für alle Summanden der ausmultiplizierten Klammer.' },
      { wert: P.skal(P.ausScheitel(1, d, e), a), text: 'Das $' + (e.vz() < 0 ? '-' : '+') + ' ' + f.tex(e.abs()) + '$ steht außerhalb der Klammer und wird nicht mit $' + f.tex(a) + '$ malgenommen.' }
    ];
    return termAufgabe({
      typ: 'scheitelausmult', text: 'Bring den Term in die allgemeine Form $ax^2 + bx + c$.',
      formel: t.spf(a, d, e), loesung: erg, typisch: typ, grundlage: 'binome',
      tipps: ['Reihenfolge: erst die Klammer mit der binomischen Formel auflösen, dann mit $' + f.tex(a) + '$ malnehmen, dann $' + f.tex(e) + '$ addieren.', '$' + t.lin(d) + '^2 = ' + t.poly(bin) + '$'],
      weg: [
        { text: 'Binomische Formel für die Klammer:', tex: t.lin(d) + '^2 = ' + t.poly(bin) },
        { text: 'Einsetzen:', tex: t.spf(a, d, e) + ' = ' + (a.gleich(-1) ? '-' : f.tex(a) + '\\cdot ') + '(' + t.poly(bin) + ')' + (e.istNull() ? '' : (e.vz() < 0 ? ' - ' : ' + ') + f.tex(e.abs())) },
        { text: 'Mit $' + f.tex(a) + '$ malnehmen:', tex: '= ' + t.poly(P.skal(bin, a)) + (e.istNull() ? '' : (e.vz() < 0 ? ' - ' : ' + ') + f.tex(e.abs())) },
        { text: 'Zahlen zusammenfassen:', tex: '= ' + t.poly(erg) }
      ]
    });
  }

  /* Knobel 8: Minus vor einem Produkt */
  function minusVorProdukt(z) {
    var a = z.nz(-7, 7), b = z.nz(-7, 7);
    if (a === -b) b = b + 1 === 0 ? 2 : b + 1;
    var innen = [Q(a * b), Q(a + b), Q(1)];
    var erg = P.skal(innen, -1);
    return termAufgabe({
      typ: 'minusprodukt', formel: '-' + kl(a) + '\\cdot ' + kl(b), loesung: erg,
      typisch: [
        { wert: [Q(a * b), Q(a + b), Q(-1)], text: 'Das Minus vorne gilt für alle Summanden. Erst ausmultiplizieren, dann <strong>alle</strong> Vorzeichen umdrehen.' },
        { wert: [Q(-a * b), Q(a + b), Q(-1)], text: 'Nach dem Ausmultiplizieren drehen sich alle Vorzeichen um, auch beim Glied mit $x$.' }
      ],
      tipps: ['Rechne zuerst $' + kl(a) + '\\cdot ' + kl(b) + '$ aus und setze das Ergebnis in Klammern.', 'Dann löst du $-(\\ldots)$ auf, indem du jedes Vorzeichen umdrehst.'],
      weg: [
        { text: 'Erst die Klammern ausmultiplizieren, Ergebnis in Klammern lassen:', tex: '-(' + t.poly(innen) + ')' },
        { text: 'Minus vor der Klammer: alle Vorzeichen umdrehen:', tex: '= ' + t.poly(erg) }
      ]
    });
  }

  M.bereich({
    id: 'klammern', gruppe: 'grundlagen', titel: 'Klammern ausmultiplizieren',
    kurz: 'Zahl mal Klammer, Minus vor der Klammer, Klammer mal Klammer.',
    brauchst: 'faktorisierte Form → allgemeine Form, Scheitelpunktform → allgemeine Form, „Ist das eine quadratische Funktion?“',
    erklaerung:
      '<h3>Zahl mal Klammer</h3><p>Jeder Summand in der Klammer wird malgenommen:</p>' +
      '$$-3\\cdot(2x - 5) = -6x + 15$$' +
      '<h3>Minus vor der Klammer</h3><p>Klammer weglassen und <strong>alle</strong> Vorzeichen darin umdrehen:</p>' +
      '$$4x - (x - 3) = 4x - x + 3 = 3x + 3$$' +
      '<h3>Klammer mal Klammer: jeder mit jedem</h3>' +
      '$$(x - 2)\\cdot(x + 5) = x^2 + 5x - 2x - 10 = x^2 + 3x - 10$$' +
      '<h3>Faktor vor zwei Klammern</h3><p>Erst die Klammern ausmultiplizieren, dann alles mit dem Faktor malnehmen:</p>' +
      '$$0{,}5\\cdot(x - 6)\\cdot(x + 2) = 0{,}5\\cdot(x^2 - 4x - 12) = 0{,}5x^2 - 2x - 6$$',
    generatoren: {
      basis: [zahlMalKlammer, minusVorKlammer],
      standard: [klammerMalKlammer, klammerMalKlammerC, zweiKlammern],
      knobel: [faktorVorProdukt, scheitelAusmultiplizieren, minusVorProdukt]
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
