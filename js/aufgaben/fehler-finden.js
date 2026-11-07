/* „Fehler finden“: vorgerechnete Lösungswege mit genau einem typischen Fehler.
   Jeder Generator liefert { bereich, titel, aufgabe, zeilen: [TeX], fehler: Index, richtig: TeX, warum, grundlage }. */
(function (root) {
  var M = root.M, Q = M.Q, P = M.P, f = M.f, t = M.t, g = M.g;
  var L = [];
  function reg(bereich, fn) { L.push({ bereich: bereich, fn: fn }); }
  function vz(n) { return n < 0 ? ' - ' + (-n) : ' + ' + n; }

  /* Minus vor der Klammer */
  reg('Grundlagen', function (z) {
    var a = z.int(3, 7), b = z.int(-6, 6), c = z.int(1, a - 1), d = z.int(2, 9);
    return {
      titel: 'Minus vor der Klammer', aufgabe: 'Vereinfache $' + t.poly([b, a]) + ' - (' + t.poly([-d, c]) + ')$.',
      zeilen: [t.poly([b, a]) + ' - (' + t.poly([-d, c]) + ')', '= ' + g.summe([{ c: a, v: 'x' }, { c: b, v: '' }, { c: -c, v: 'x' }, { c: -d, v: '' }]), '= ' + t.poly([b - d, a - c])],
      fehler: 1, richtig: '= ' + g.summe([{ c: a, v: 'x' }, { c: b, v: '' }, { c: -c, v: 'x' }, { c: d, v: '' }]),
      warum: 'Ein Minus vor der Klammer dreht <strong>alle</strong> Vorzeichen in der Klammer um. Aus $-(' + t.poly([-d, c]) + ')$ wird $' + t.poly([d, -c]) + '$, nicht $' + t.poly([-d, -c]) + '$.',
      grundlage: 'klammern'
    };
  });

  /* Binomische Formel vergessen */
  reg('Grundlagen', function (z) {
    var a = z.nz(-6, 6), c = z.int(-8, 8);
    var falsch = [Q(c - a * a), Q(0), Q(1)];
    return {
      titel: 'Binomische Formel', aufgabe: 'Bring $f(x) = ' + t.spf(1, a, c) + '$ in die allgemeine Form.',
      zeilen: ['f(x) = ' + t.spf(1, a, c), '= x^2 ' + (a > 0 ? '- ' : '- ') + (a * a) + vz(c).replace(' + 0', '').replace(' - 0', ''), '= ' + t.poly(falsch)],
      fehler: 1, richtig: '= ' + t.poly(P.ausScheitel(1, a, 0)) + (c ? vz(c) : ''),
      warum: 'Binomische Formel: $' + t.lin(a) + '^2 = ' + t.poly(P.ausScheitel(1, a, 0)) + '$. Das mittlere Glied $' + (a > 0 ? '-' : '+') + Math.abs(2 * a) + 'x$ fehlt, und das letzte Glied ist $+' + (a * a) + '$.',
      grundlage: 'binome'
    };
  });

  /* Quadrat einer negativen Zahl */
  reg('Grundlagen', function (z) {
    var k = z.int(2, 5), b = z.nz(-5, 5), c = z.int(-6, 6);
    var p = [Q(c), Q(b), Q(-1)];
    var falschWert = k * k - b * k + c;
    return {
      titel: 'Einsetzen', aufgabe: 'Berechne $f(-' + k + ')$ für $f(x) = ' + t.poly(p) + '$.',
      zeilen: ['f(-' + k + ') = -(-' + k + ')^2 ' + (b > 0 ? '+ ' : '- ') + Math.abs(b) + '\\cdot(-' + k + ')' + (c ? vz(c) : ''),
        '= ' + (k * k) + ' ' + (b > 0 ? '+ ' : '- ') + Math.abs(b) + '\\cdot(-' + k + ')' + (c ? vz(c) : ''),
        '= ' + (k * k) + vz(-b * k) + (c ? vz(c) : ''), '= ' + falschWert],
      fehler: 1, richtig: '= -' + (k * k) + ' ' + (b > 0 ? '+ ' : '- ') + Math.abs(b) + '\\cdot(-' + k + ')' + (c ? vz(c) : ''),
      warum: '$(-' + k + ')^2 = ' + (k * k) + '$, aber das Minus <strong>vor</strong> der Klammer bleibt stehen: $-(-' + k + ')^2 = -' + (k * k) + '$.',
      grundlage: 'rechenregeln'
    };
  });

  /* Punkt vor Strich beim Einsetzen */
  reg('Grundlagen', function (z) {
    var c = z.int(2, 9), b = z.int(2, 5), k = z.int(2, 4);
    return {
      titel: 'Rechenreihenfolge', aufgabe: 'Berechne $f(' + k + ')$ für $f(x) = ' + c + ' + ' + b + 'x^2$.',
      zeilen: ['f(' + k + ') = ' + c + ' + ' + b + '\\cdot ' + k + '^2', '= ' + (c + b) + '\\cdot ' + k + '^2', '= ' + (c + b) + '\\cdot ' + (k * k), '= ' + ((c + b) * k * k)],
      fehler: 1, richtig: '= ' + c + ' + ' + b + '\\cdot ' + (k * k) + ' = ' + c + ' + ' + (b * k * k) + ' = ' + (c + b * k * k),
      warum: 'Potenz vor Punkt vor Strich. Erst $' + k + '^2$, dann mal ' + b + ', erst ganz am Ende $+\\,' + c + '$.',
      grundlage: 'rechenregeln'
    };
  });

  /* Scheitelpunkt: Vorzeichen bei d */
  reg('Funktionen', function (z) {
    var a = z.wahl([2, -1, 3, Q(1, 2), -2]), d = z.int(1, 6), e = z.nz(-6, 6);
    a = Q.aus(a);
    return {
      titel: 'Scheitelpunkt ablesen', aufgabe: 'Gib Scheitelpunkt und Öffnung von $f(x) = ' + t.spf(a, -d, e) + '$ an.',
      zeilen: ['f(x) = ' + t.spf(a, -d, e), 'a = ' + f.tex(a) + '\\;\\Rightarrow\\; \\text{nach ' + (a.vz() > 0 ? 'oben' : 'unten') + ' geöffnet}', t.punkt(d, e, 'S')],
      fehler: 2, richtig: t.punkt(-d, e, 'S'),
      warum: '$(x + ' + d + ')^2 = (x - (-' + d + '))^2$, also $d = -' + d + '$. Der Scheitelpunkt liegt links von der y-Achse.',
      grundlage: null
    };
  });

  /* Streckfaktor nur beim ersten Summanden */
  reg('Funktionen', function (z) {
    var a = z.wahl([2, 3, -2]), d = z.nz(-4, 4), e = z.int(-5, 5);
    var bin = P.ausScheitel(1, d, 0);
    var falsch = [Q(d * d + e), Q(-2 * d), Q(a)];
    return {
      titel: 'Scheitelpunktform ausmultiplizieren', aufgabe: 'Bring $f(x) = ' + t.spf(a, d, e) + '$ in die allgemeine Form.',
      zeilen: ['f(x) = ' + t.spf(a, d, e), '= ' + a + '\\cdot(' + t.poly(bin) + ')' + (e ? vz(e) : ''), '= ' + g.summe([{ c: a, v: 'x^2' }, { c: -2 * d, v: 'x' }, { c: d * d, v: '' }]) + (e ? vz(e) : ''), '= ' + t.poly(falsch)],
      fehler: 2, richtig: '= ' + g.summe([{ c: a, v: 'x^2' }, { c: -2 * a * d, v: 'x' }, { c: a * d * d, v: '' }]) + (e ? vz(e) : ''),
      warum: 'Der Faktor $' + a + '$ gilt für <strong>jeden</strong> Summanden in der Klammer, nicht nur für $x^2$.',
      grundlage: 'klammern'
    };
  });

  /* Quadratische Ergänzung nicht wieder abgezogen */
  reg('Funktionen', function (z) {
    var m = z.nz(-6, 6), c = z.int(-8, 8);
    return {
      titel: 'Quadratische Ergänzung', aufgabe: 'Bring $f(x) = ' + t.poly([c, 2 * m, 1]) + '$ in die Scheitelpunktform.',
      zeilen: ['f(x) = ' + t.poly([c, 2 * m, 1]), '= ' + t.poly([0, 2 * m, 1]) + ' + ' + (m * m) + (c ? vz(c) : ''), '= ' + t.spf(1, -m, c)],
      fehler: 1, richtig: '= ' + t.poly([0, 2 * m, 1]) + ' + ' + (m * m) + ' - ' + (m * m) + (c ? vz(c) : ''),
      warum: 'Die quadratische Ergänzung $' + (m * m) + '$ muss man gleich wieder abziehen, sonst ändert sich der Term. Richtig ist am Ende $' + t.spf(1, -m, c - m * m) + '$.',
      grundlage: 'binome'
    };
  });

  /* Quadratische Ergänzung mit a ≠ 1: Ergänzung beim Herausholen nicht mit a malgenommen */
  reg('Funktionen', function (z) {
    var a = z.wahl([2, 3, 4]), d = z.nz(-4, 4), c = z.int(-6, 9);
    var b = -2 * a * d, inn = t.poly([0, -2 * d, 1]);
    return {
      titel: 'Quadratische Ergänzung mit Faktor', aufgabe: 'Bring $f(x) = ' + t.poly([c, b, a]) + '$ in die Scheitelpunktform.',
      zeilen: ['f(x) = ' + t.poly([c, b, a]), '= ' + a + '\\cdot(' + inn + ')' + (c ? vz(c) : ''), '= ' + a + '\\cdot(' + inn + ' + ' + (d * d) + ' - ' + (d * d) + ')' + (c ? vz(c) : ''),
        '= ' + a + '\\cdot(' + inn + ' + ' + (d * d) + ') - ' + (d * d) + (c ? vz(c) : ''), '= ' + t.spf(a, d, c - d * d)],
      fehler: 3, richtig: '= ' + a + '\\cdot(' + inn + ' + ' + (d * d) + ') - ' + a + '\\cdot ' + (d * d) + (c ? vz(c) : ''),
      warum: 'Holst du die abgezogene Ergänzung aus der Klammer, wird sie mit dem Faktor $' + a + '$ malgenommen: $-' + a + '\\cdot ' + (d * d) + '$.',
      grundlage: 'binome'
    };
  });

  /* pq-Formel: Vorzeichen von −p/2 */
  reg('Gleichungen', function (z) {
    var r1 = z.int(1, 5), r2 = r1 + z.int(1, 4), p = -(r1 + r2), q = r1 * r2;
    var h = p / 2, D = h * h - q, w = Math.sqrt(D);
    return {
      titel: 'pq-Formel', aufgabe: 'Löse $' + t.poly([q, p, 1]) + ' = 0$.',
      zeilen: [t.poly([q, p, 1]) + ' = 0', 'p = ' + p + ';\\quad q = ' + q, 'x_{1,2} = \\frac{' + p + '}{2} \\pm \\sqrt{\\left(\\frac{' + p + '}{2}\\right)^2 - ' + q + '}', '= ' + f.tex(h) + ' \\pm \\sqrt{' + f.tex(D) + '} = ' + f.tex(h) + ' \\pm ' + f.tex(w), t.menge([h - w, h + w])],
      fehler: 2, richtig: 'x_{1,2} = -\\frac{' + p + '}{2} \\pm \\sqrt{\\left(\\frac{' + p + '}{2}\\right)^2 - ' + q + '}',
      warum: 'Die pq-Formel beginnt mit $-\\frac{p}{2}$. Mit $p = ' + p + '$ ist $-\\frac{p}{2} = ' + f.tex(-h) + '$. Richtig ist $\\mathbb{L} = \\{' + r1 + ';\\ ' + r2 + '\\}$.',
      grundlage: null
    };
  });

  /* pq-Formel ohne vorher durch a zu teilen */
  reg('Gleichungen', function (z) {
    var a = z.wahl([2, 3]), r1 = z.int(-3, 2), r2 = r1 + z.int(1, 4);
    var b = -a * (r1 + r2), c = a * r1 * r2;
    return {
      titel: 'pq-Formel mit Faktor', aufgabe: 'Löse $' + t.poly([c, b, a]) + ' = 0$.',
      zeilen: [t.poly([c, b, a]) + ' = 0', 'p = ' + b + ';\\quad q = ' + c, 'x_{1,2} = -\\frac{' + b + '}{2} \\pm \\sqrt{\\left(\\frac{' + b + '}{2}\\right)^2 - ' + f.kl(c) + '}'],
      fehler: 1, richtig: '|:' + a + '\\quad ' + t.poly([r1 * r2, -(r1 + r2), 1]) + ' = 0;\\quad p = ' + (-(r1 + r2)) + ';\\; q = ' + (r1 * r2),
      warum: 'Die pq-Formel gilt nur für die Normalform $x^2 + px + q = 0$. Vorher muss die Gleichung durch $' + a + '$ geteilt werden.',
      grundlage: null
    };
  });

  /* Wurzelziehen: negative Lösung vergessen (häufiger Fehler, AH S. 42) */
  reg('Gleichungen', function (z) {
    var k = z.int(2, 14), m = z.wahl([1, 2, 3]);
    return {
      titel: 'Wurzelziehen', aufgabe: 'Löse $' + (m === 1 ? '' : m) + 'x^2 - ' + (m * k * k) + ' = 0$.',
      zeilen: [(m === 1 ? '' : m) + 'x^2 - ' + (m * k * k) + ' = 0', (m === 1 ? '' : m) + 'x^2 = ' + (m * k * k)].concat(m === 1 ? [] : ['x^2 = ' + (k * k)]).concat(['x = ' + k, '\\mathbb{L} = \\{' + k + '\\}']),
      fehler: m === 1 ? 2 : 3, richtig: 'x_1 = ' + k + ';\\quad x_2 = -' + k,
      warum: 'Auch $(-' + k + ')^2 = ' + (k * k) + '$. Beim Wurzelziehen gibt es zwei Lösungen: $\\mathbb{L} = \\{-' + k + ';\\ ' + k + '\\}$.',
      grundlage: 'umstellen'
    };
  });

  /* Durch x geteilt */
  reg('Gleichungen', function (z) {
    var k = z.nz(-9, 9), a = z.wahl([1, 2, 3]);
    return {
      titel: 'Durch x geteilt', aufgabe: 'Löse $' + (a === 1 ? '' : a) + 'x^2 = ' + (a * k) + 'x$.',
      zeilen: [(a === 1 ? '' : a) + 'x^2 = ' + (a * k) + 'x', (a === 1 ? '' : a) + 'x = ' + (a * k) + '\\qquad(\\text{durch } x \\text{ geteilt})'].concat(a === 1 ? [] : ['x = ' + k]).concat(['\\mathbb{L} = \\{' + k + '\\}']),
      fehler: 1, richtig: t.poly([0, -a * k, a]) + ' = 0\\;\\Rightarrow\\; ' + (a === 1 ? '' : a) + 'x\\cdot ' + t.lin(k) + ' = 0',
      warum: 'Teilt man durch $x$, geht die Lösung $x = 0$ verloren. Richtig: alles auf eine Seite, $x$ ausklammern, „Produkt = 0“-Regel. $\\mathbb{L} = ' + t.menge([0, k]).replace('\\mathbb{L} = ', '') + '$.',
      grundlage: null
    };
  });

  /* „Produkt = 0“: Vorzeichen */
  reg('Gleichungen', function (z) {
    var r1 = z.int(1, 9), r2 = z.int(1, 9);
    return {
      titel: '„Produkt = 0“-Regel', aufgabe: 'Löse $(x - ' + r1 + ')\\cdot(x + ' + r2 + ') = 0$.',
      zeilen: ['(x - ' + r1 + ')\\cdot(x + ' + r2 + ') = 0', 'x - ' + r1 + ' = 0\\quad\\text{oder}\\quad x + ' + r2 + ' = 0', 'x_1 = -' + r1 + ';\\quad x_2 = ' + r2, t.menge([-r1, r2])],
      fehler: 2, richtig: 'x_1 = ' + r1 + ';\\quad x_2 = -' + r2,
      warum: 'Aus $x - ' + r1 + ' = 0$ folgt $x = ' + r1 + '$ (auf beiden Seiten $+\\,' + r1 + '$). Aus $x + ' + r2 + ' = 0$ folgt $x = -' + r2 + '$.',
      grundlage: 'umstellen'
    };
  });

  /* Schnittpunkte: y-Werte vergessen bzw. 0 gesetzt */
  reg('Gleichungen', function (z) {
    var r1 = z.int(-4, 1), r2 = r1 + z.int(1, 5), m, n;
    do { m = z.int(-3, 3); n = z.int(-4, 4); } while (m * r1 + n === 0 || m * r2 + n === 0); // sonst läge ein Schnittpunkt wirklich auf der x-Achse
    var gp = [Q(n), Q(m)], diff = P.ausNullstellen(1, r1, r2), fp = P.plus(diff, gp);
    return {
      titel: 'Schnittpunkte', aufgabe: 'Berechne die Schnittpunkte von $f(x) = ' + t.poly(fp) + '$ und $g(x) = ' + t.poly(gp) + '$.',
      zeilen: [t.poly(fp) + ' = ' + t.poly(gp), t.poly(diff) + ' = 0', 'x_1 = ' + r1 + ';\\quad x_2 = ' + r2, t.punkt(r1, 0, 'S_1') + ';\\quad ' + t.punkt(r2, 0, 'S_2')],
      fehler: 3, richtig: 'S_1(' + r1 + '\\,|\\,' + f.tex(P.wertQ(gp, r1)) + ');\\quad S_2(' + r2 + '\\,|\\,' + f.tex(P.wertQ(gp, r2)) + ')',
      warum: 'Die Schnittpunkte zweier Graphen liegen meist nicht auf der x-Achse. Die y-Werte bekommst du durch Einsetzen in $g$: $g(' + r1 + ') = ' + f.tex(P.wertQ(gp, r1)) + '$, $g(' + r2 + ') = ' + f.tex(P.wertQ(gp, r2)) + '$.',
      grundlage: null
    };
  });

  M.FEHLER = L;
  M.FEHLER_BEREICHE = ['Grundlagen', 'Funktionen', 'Gleichungen'];
})(typeof window !== 'undefined' ? window : globalThis);
