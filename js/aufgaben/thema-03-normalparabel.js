/* Thema 3: Normalparabel – Streckung, Spiegelung, Verschiebung, Scheitelpunktform (Buch S. 79–81). */
(function (root) {
  var M = root.M, Q = M.Q, P = M.P, f = M.f, t = M.t, g = M.g;

  var A_LEICHT = [1, -1, 2, -2];
  var A_SCHWER = [Q(1, 2), Q(-1, 2), Q(3), Q(-3), Q(3, 2), Q(-3, 2)];

  function fn(a, d, e) { a = Number(a); d = Number(d); e = Number(e); return function (x) { return a * (x - d) * (x - d) + e; }; }
  function fenster(a, d, e) { return M.ui && M.ui.fensterFuer ? M.ui.fensterFuer(Number(d), Number(e), Number(a)) : { x: [-6, 6], y: [-6, 6] }; }
  function graphSpec(a, d, e, mitS) {
    var w = fenster(a, d, e);
    return { x: w.x, y: w.y, breite: 360, kurven: [{ fn: fn(a, d, e) }], punkte: mitS ? [{ x: Number(d), y: Number(e) }] : [] };
  }
  function formText(a) {
    a = Q.aus(a);
    var b = a.abs();
    var form = b.gleich(1) ? 'weder gestreckt noch gestaucht' : (b.wert() > 1 ? 'gestreckt' : 'gestaucht');
    return (a.vz() > 0 ? 'nach oben geöffnet' : 'nach unten geöffnet (an der x-Achse gespiegelt)') + ', ' + form;
  }
  function verschiebungText(d, e) {
    var s = [];
    if (d > 0) s.push('um ' + d + ' nach rechts'); if (d < 0) s.push('um ' + (-d) + ' nach links');
    if (e > 0) s.push('um ' + e + ' nach oben'); if (e < 0) s.push('um ' + (-e) + ' nach unten');
    return s.length ? s.join(' und ') + ' verschoben' : 'nicht verschoben';
  }
  /* typische Fehler bei Scheitelpunktform-Antworten */
  function spfTypisch(a, d, e) {
    var l = [];
    if (d !== 0) l.push({ wert: P.ausScheitel(a, -d, e), text: 'Vorzeichen bei der Verschiebung in x-Richtung: Der Scheitelpunkt $S(' + f.tex(d) + '|' + f.tex(e) + ')$ führt zu $' + t.lin(d) + '^2$.' });
    if (e !== 0) l.push({ wert: P.ausScheitel(a, d, -e), text: 'Vorzeichen bei $e$: Liegt der Scheitelpunkt bei $y = ' + f.tex(e) + '$, steht in der Gleichung $' + (e > 0 ? '+\\,' : '-\\,') + Math.abs(e) + '$.' });
    if (d !== e) l.push({ wert: P.ausScheitel(a, e, d), text: 'Du hast $d$ und $e$ vertauscht. In $a\\cdot(x - d)^2 + e$ ist $d$ die x-Koordinate des Scheitelpunkts.' });
    return l;
  }

  /* Basis 1: Scheitelpunkt ablesen */
  function scheitelAblesen(z) {
    var a = z.wahl([1, -1, 2, -2, Q(1, 2), Q(-1, 2), 3]), d = z.int(-6, 6), e = z.int(-6, 6);
    if (d === 0 && e === 0) e = z.nz(-5, 5);
    var typ = [];
    if (d !== 0) typ.push({ wert: [-d, e], text: 'Vorzeichenfalle: In $' + t.lin(d) + '^2$ steckt $d = ' + d + '$. Der Scheitelpunkt liegt bei $x = ' + d + '$.' });
    if (e !== 0) typ.push({ wert: [d, -e], text: 'Das $e$ übernimmst du mit seinem Vorzeichen: $y = ' + e + '$.' });
    if (d !== 0 && e !== 0) typ.push({ wert: [-d, -e], text: 'Bei $x$ wechselt das Vorzeichen, bei $y$ nicht.' });
    return {
      typ: 'scheitelablesen', tr: false,
      text: 'Gib den Scheitelpunkt der Parabel an.',
      formel: 'f(x) = ' + t.spf(a, d, e),
      felder: [{ art: 'punkt', vor: '$S$', loesung: [d, e], typisch: typ }],
      tipps: ['Die Scheitelpunktform heißt $f(x) = a\\cdot(x - d)^2 + e$ mit Scheitelpunkt $S(d|e)$.', d < 0 ? 'Schreib $' + t.lin(d) + '$ als $(x - (' + d + '))$. Dann siehst du $d$ direkt.' : 'Lies $d$ in der Klammer und $e$ hinter der Klammer ab.'],
      weg: [
        { text: 'Vergleiche mit $f(x) = a\\cdot(x - d)^2 + e$:', tex: d < 0 ? t.lin(d) + ' = (x - (' + d + '))\\;\\Rightarrow\\; d = ' + d : 'd = ' + d },
        { tex: 'e = ' + e },
        { text: 'Also:', tex: t.punkt(d, e, 'S') }
      ]
    };
  }

  /* Basis 2: Lage und Aussehen (Buch S. 79 Beispiel A, S. 80 Nr. 3) */
  function lageAussehen(z) {
    var a = z.wahl([1, -1, 2, -2, Q(1, 2), Q(-1, 2), 3, Q(-1, 4)]), d = z.int(-5, 5), e = z.int(-5, 5);
    a = Q.aus(a);
    var b = a.abs();
    var formIdx = b.gleich(1) ? 2 : (b.wert() > 1 ? 0 : 1);
    return {
      typ: 'lageaussehen', tr: false,
      text: 'Welche Lage und welches Aussehen hat die Parabel?',
      formel: 'f(x) = ' + t.spf(a, d, e),
      felder: [
        { art: 'punkt', label: 'Scheitelpunkt:', vor: '$S$', loesung: [d, e], typisch: d ? [{ wert: [-d, e], text: 'Vorzeichenfalle bei $d$: $' + t.lin(d) + '$ bedeutet $d = ' + d + '$.' }] : [] },
        { art: 'mc', label: 'Öffnung:', loesung: a.vz() > 0 ? 0 : 1, optionen: [
          { html: 'nach oben geöffnet', warum: 'Das Vorzeichen von $a$ entscheidet: $a < 0$ heißt nach unten geöffnet.' },
          { html: 'nach unten geöffnet', warum: 'Das Vorzeichen von $a$ entscheidet: $a > 0$ heißt nach oben geöffnet.' }] },
        { art: 'mc', label: 'Form im Vergleich zur Normalparabel:', loesung: formIdx, optionen: [
          { html: 'gestreckt (enger)', warum: 'Gestreckt ist sie nur, wenn $|a| > 1$. Hier ist $|a| = ' + f.tex(b) + '$.' },
          { html: 'gestaucht (weiter geöffnet)', warum: 'Gestaucht ist sie nur, wenn $|a| < 1$. Hier ist $|a| = ' + f.tex(b) + '$.' },
          { html: 'weder gestreckt noch gestaucht', warum: 'Bei $|a| = ' + f.tex(b) + '$ ändert sich die Form.' }] }
      ],
      tipps: ['In $f(x) = a\\cdot(x - d)^2 + e$ bestimmt $a$ Öffnung und Form, $d$ und $e$ die Lage.', 'Hier ist $a = ' + f.tex(a) + '$. Positiv oder negativ? Betrag größer oder kleiner als 1?'],
      weg: [
        { text: 'Faktor $a = ' + f.tex(a) + '$: ' + formText(a) + '.' },
        { text: 'Die Parabel ist ' + verschiebungText(d, e) + '.', tex: t.punkt(d, e, 'S') }
      ]
    };
  }

  /* Basis 3: Funktionsgleichung aus Scheitelpunkt, a = 1 (Buch S. 80 Nr. 4) */
  function gleichungAusS(z) {
    var d = z.nz(-6, 6), e = z.int(-6, 6);
    var a = z.chance(0.3) ? -1 : 1;
    return {
      typ: 'gleichungauss', tr: false,
      text: 'Die Normalparabel wird ' + (a < 0 ? 'an der x-Achse gespiegelt und so ' : '') + 'verschoben, dass ihr Scheitelpunkt bei $' + t.punkt(d, e, 'S') + '$ liegt. Gib die Funktionsgleichung in Scheitelpunktform an.',
      felder: [{ art: 'term', vor: '$f(x) =$', loesung: P.ausScheitel(a, d, e), form: 'spf', typisch: spfTypisch(a, d, e), platzhalter: 'z. B. (x − 2)^2 + 3' }],
      tipps: ['Ansatz: $f(x) = a\\cdot(x - d)^2 + e$ mit $S(d|e)$.', 'Setze $a = ' + a + '$, $d = ' + d + '$ und $e = ' + e + '$ ein. Achtung: $x - (' + d + ')$' + (d < 0 ? ' $= x + ' + (-d) + '$.' : '.')],
      weg: [
        { text: 'Ansatz:', tex: 'f(x) = a\\cdot(x - d)^2 + e' },
        { text: '$a = ' + a + '$, $d = ' + d + '$, $e = ' + e + '$ einsetzen:', tex: 'f(x) = ' + (a < 0 ? '-' : '') + '(x - ' + f.kl(d) + ')^2 ' + (e < 0 ? '- ' + (-e) : '+ ' + e) },
        { tex: '= ' + t.spf(a, d, e) }
      ]
    };
  }

  /* Standard 1 / Knobel: Funktionsgleichung aus Graph (Buch S. 80 Beispiel B, S. 81 Nr. 9) */
  function gleichungAusGraph(z, schwer) {
    var a = schwer ? z.wahl(A_SCHWER) : z.wahl(A_LEICHT), d = z.int(-4, 4), e = z.int(-4, 4);
    a = Q.aus(a);
    return {
      typ: schwer ? 'graphschwer' : 'graph', tr: false,
      text: 'Gib die Funktionsgleichung der abgebildeten Parabel in Scheitelpunktform an. Der Scheitelpunkt ist markiert.',
      graph: graphSpec(a, d, e, true),
      felder: [{ art: 'term', vor: '$f(x) =$', loesung: P.ausScheitel(a, d, e), form: 'spf', typisch: spfTypisch(a, d, e), platzhalter: 'z. B. 2(x + 1)^2 − 3' }],
      tipps: ['Lies zuerst den Scheitelpunkt $S(d|e)$ ab.', 'Für $a$: Geh vom Scheitelpunkt eine Einheit nach rechts. $a$ gibt an, wie viele Einheiten du dann nach oben (+) oder unten (−) gehen musst, um die Parabel zu treffen.'],
      weg: [
        { text: 'Scheitelpunkt ablesen:', tex: t.punkt(d, e, 'S') + '\\;\\Rightarrow\\; d = ' + d + ',\\; e = ' + e },
        { text: 'Eine Einheit nach rechts vom Scheitelpunkt liegt der Parabelpunkt ' + (a.vz() > 0 ? 'um ' + f.tex(a) + ' höher' : 'um ' + f.tex(a.abs()) + ' tiefer') + '. Also:', tex: 'a = ' + f.tex(a) },
        { text: 'Einsetzen in $f(x) = a\\cdot(x - d)^2 + e$:', tex: 'f(x) = ' + t.spf(a, d, e) }
      ]
    };
  }

  /* Standard: Graph zur Gleichung finden (Buch S. 81 Nr. 11 Parabelzoo) */
  function graphZuordnen(z) {
    var a = Q.aus(z.wahl([1, -1, 2, -2, Q(1, 2), Q(-1, 2)])), d = z.nz(-3, 3), e = z.nz(-3, 3);
    var varianten = [
      { a: a, d: d, e: e, warum: null },
      { a: a, d: -d, e: e, warum: 'Diese Parabel ist in die falsche x-Richtung verschoben. $' + t.lin(d) + '$ heißt Scheitelpunkt bei $x = ' + d + '$.' },
      { a: a.neg(), d: d, e: e, warum: 'Die Öffnung passt nicht: Bei $a ' + (a.vz() > 0 ? '> 0' : '< 0') + '$ ist die Parabel nach ' + (a.vz() > 0 ? 'oben' : 'unten') + ' geöffnet.' },
      { a: a, d: d, e: -e, warum: 'Die Verschiebung in y-Richtung passt nicht: $e = ' + e + '$.' }
    ];
    var gemischt = z.mischen(varianten);
    var spec = function (v) { return { x: [-6, 6], y: [-6, 6], breite: 200, einheit: 15, kurven: [{ fn: fn(v.a, v.d, v.e) }], punkte: [] }; };
    return {
      typ: 'graphzuordnen', tr: false,
      text: 'Welcher Graph gehört zu $f(x) = ' + t.spf(a, d, e) + '$?',
      felder: [{ art: 'mc', loesung: gemischt.indexOf(varianten[0]), optionen: gemischt.map(function (v) { return { graph: spec(v), warum: v.warum, id: 'g' + v.a + '_' + v.d + '_' + v.e }; }) }],
      tipps: ['Bestimme zuerst den Scheitelpunkt und die Öffnung aus der Gleichung.', 'Scheitelpunkt $' + t.punkt(d, e, 'S') + '$, ' + (a.vz() > 0 ? 'nach oben' : 'nach unten') + ' geöffnet. Welcher Graph passt?'],
      weg: [
        { text: 'Aus der Scheitelpunktform:', tex: t.punkt(d, e, 'S') + ',\\quad a = ' + f.tex(a) },
        { text: 'Also ' + formText(a) + '. Nur ein Graph hat diesen Scheitelpunkt und diese Öffnung: Graph ' + 'ABCD'[gemischt.indexOf(varianten[0])] + '.' }
      ]
    };
  }

  /* Standard: Parabel mit Reglern anpassen */
  function regler(z) {
    var a = z.wahl([1, -1, 2, -2, 0.5, -0.5]), d = z.int(-4, 4), e = z.int(-4, 4);
    if (a === 1 && d === 0 && e === 0) e = 2;
    return {
      typ: 'regler', tr: false,
      text: 'Stell die Regler so ein, dass deine blaue Parabel genau auf der grauen gestrichelten Parabel liegt.',
      felder: [{ art: 'regler', ziel: { a: a, d: d, e: e } }],
      tipps: ['Bring zuerst den Scheitelpunkt an die richtige Stelle (Regler $d$ und $e$). Dann stellst du die Form mit $a$ ein.', 'Der Scheitelpunkt der grauen Parabel ist $' + t.punkt(d, e, 'S') + '$.'],
      weg: [
        { text: 'Scheitelpunkt der grauen Parabel ablesen:', tex: t.punkt(d, e, 'S') + '\\;\\Rightarrow\\; d = ' + d + ',\\; e = ' + e },
        { text: 'Form: eine Einheit nach rechts vom Scheitelpunkt geht es ' + (a > 0 ? f.tex(a) + ' nach oben' : f.tex(-a) + ' nach unten') + '.', tex: 'a = ' + f.tex(a) },
        { tex: 'f(x) = ' + t.spf(a, d, e) }
      ]
    };
  }

  /* Abbildungsfolge (Buch S. 81 Nr. 10). Standard: x-Verschiebung, Strecken, y-Verschiebung. Knobel: beliebige Reihenfolge. */
  function abbildungen(z, knobel) {
    var d = z.nz(-5, 5), e = z.nz(-5, 5);
    var k = Q.aus(z.wahl([2, 3, Q(1, 2), Q(3, 2), -1, -2, Q(-1, 2)]));
    var ops = [
      { art: 'x', w: d, text: 'Verschieben um ' + Math.abs(d) + ' Einheit' + (Math.abs(d) > 1 ? 'en' : '') + ' nach ' + (d > 0 ? 'rechts' : 'links') },
      { art: 's', w: k, text: k.gleich(-1) ? 'Spiegeln an der x-Achse' : 'Strecken in y-Richtung mit dem Faktor ' + f.zahl(k) },
      { art: 'y', w: e, text: 'Verschieben um ' + Math.abs(e) + ' Einheit' + (Math.abs(e) > 1 ? 'en' : '') + ' nach ' + (e > 0 ? 'oben' : 'unten') }
    ];
    if (knobel) ops = z.mischen(ops);
    // Ausführen: a, d, e; Strecken in y-Richtung multipliziert alle y-Werte (auch e)
    var A = Q(1), D = Q(0), E = Q(0), schritte = [];
    ops.forEach(function (o) {
      if (o.art === 'x') D = D.plus(o.w);
      if (o.art === 'y') E = E.plus(o.w);
      if (o.art === 's') { A = A.mal(o.w); E = E.mal(o.w); }
      schritte.push({ text: o.text + ':', tex: 'f(x) = ' + t.spf(A, D, E) });
    });
    var typ = spfTypisch(A, Number(D), Number(E));
    var iS = ops.map(function (o) { return o.art; }).indexOf('s'), iY = ops.map(function (o) { return o.art; }).indexOf('y');
    if (knobel && iS > iY && !E.istNull()) {
      typ.push({ wert: P.ausScheitel(A, D, E.durch(k)), text: 'Die Reihenfolge zählt: Wird nach dem Verschieben nach oben/unten gestreckt, wird auch der Abstand zur x-Achse gestreckt. Aus $e$ wird $' + f.tex(k) + '\\cdot e$.' });
    }
    var liste = ops.map(function (o, i) { return '①②③'[i] + ' ' + o.text; }).join('<br>');
    return {
      typ: knobel ? 'abbildungenknobel' : 'abbildungen', tr: false,
      text: 'Die Normalparabel $f(x) = x^2$ wird nacheinander so verändert:<br>' + liste + '<br>Gib die Funktionsgleichung der neuen Parabel in Scheitelpunktform an.',
      felder: [{ art: 'term', vor: '$f(x) =$', loesung: P.ausScheitel(A, D, E), form: 'spf', typisch: typ, platzhalter: 'z. B. 0,5(x − 3)^2 − 2' }],
      tipps: ['Führe die Schritte nacheinander aus und notiere nach jedem Schritt die Gleichung.', knobel ? 'Achtung bei der Reihenfolge: Strecken oder Spiegeln wirkt auf alle y-Werte, also auch auf eine Verschiebung nach oben oder unten, die schon passiert ist.' : 'Verschieben nach rechts um 3 heißt $(x - 3)^2$, Strecken mit Faktor $k$ heißt $k\\cdot(\\ldots)^2$.'],
      weg: [{ text: 'Start:', tex: 'f(x) = x^2' }].concat(schritte)
    };
  }

  /* Knobel: Spiegeln (Buch S. 80 Nr. 7) */
  function spiegeln(z) {
    var d = z.nz(-4, 4), e = z.nz(-4, 4), a = z.wahl([1, 2, Q(1, 2)]);
    a = Q.aus(a);
    var anX = z.chance(0.5);
    var A = anX ? a.neg() : a, D = anX ? d : -d, E = anX ? -e : e;
    return {
      typ: 'spiegeln', tr: false,
      text: 'Die Parabel $f(x) = ' + t.spf(a, d, e) + '$ wird an der ' + (anX ? 'x-Achse' : 'y-Achse') + ' gespiegelt. Gib die Gleichung der gespiegelten Parabel in Scheitelpunktform an.',
      graph: { x: [-7, 7], y: [-7, 7], breite: 300, einheit: 18, kurven: [{ fn: fn(a, d, e) }], punkte: [{ x: d, y: e, name: 'S' }] },
      felder: [{ art: 'term', vor: '$g(x) =$', loesung: P.ausScheitel(A, D, E), form: 'spf', platzhalter: 'z. B. −(x − 3)^2 − 1', typisch: anX ? [
        { wert: P.ausScheitel(a.neg(), d, e), text: 'Beim Spiegeln an der x-Achse wandert auch der Scheitelpunkt: Aus $y = ' + e + '$ wird $y = ' + (-e) + '$.' },
        { wert: P.ausScheitel(a, d, -e), text: 'Beim Spiegeln an der x-Achse dreht sich auch die Öffnung um.' }
      ] : [
        { wert: P.ausScheitel(a.neg(), d, e), text: 'Beim Spiegeln an der y-Achse bleibt die Öffnung gleich. Nur der Scheitelpunkt wandert auf die andere Seite.' },
        { wert: P.ausScheitel(a, d, -e), text: 'Beim Spiegeln an der y-Achse ändert sich die x-Koordinate, nicht die y-Koordinate.' }
      ] }],
      tipps: [anX ? 'An der x-Achse spiegeln: Alle y-Werte wechseln das Vorzeichen. Was passiert mit dem Scheitelpunkt und der Öffnung?' : 'An der y-Achse spiegeln: Links und rechts werden vertauscht. Was passiert mit dem Scheitelpunkt?', 'Der gespiegelte Scheitelpunkt ist $' + t.punkt(D, E, "S'") + '$.'],
      weg: [
        { text: 'Scheitelpunkt spiegeln:', tex: t.punkt(d, e, 'S') + '\\;\\to\\; ' + t.punkt(D, E, "S'") },
        { text: anX ? 'Öffnung dreht sich um: $a = ' + f.tex(A) + '$.' : 'Die Öffnung bleibt: $a = ' + f.tex(A) + '$.', tex: 'g(x) = ' + t.spf(A, D, E) }
      ]
    };
  }

  M.bereich({
    id: 'thema-03', gruppe: 'thema', titel: 'Normalparabel',
    erklaerung:
      '<p>Die einfachste quadratische Funktion ist $f(x) = x^2$. Ihr Graph heißt <strong>Normalparabel</strong>, Scheitelpunkt $S(0|0)$.</p>' +
      '<h3>Streckung und Spiegelung: $f(x) = ax^2$</h3>' +
      '<p>$a > 0$: nach oben geöffnet. $a < 0$: nach unten geöffnet, also an der x-Achse gespiegelt.<br>' +
      'Gestreckt (enger), wenn $|a| > 1$. Gestaucht (weiter), wenn $|a| < 1$.</p>' +
      '<h3>Verschiebung</h3>' +
      '<p>$f(x) = x^2 + e$: um $e$ nach oben ($e > 0$) oder unten ($e < 0$), Scheitelpunkt $S(0|e)$.<br>' +
      '$f(x) = (x - d)^2$: um $d$ nach rechts ($d > 0$) oder links ($d < 0$), Scheitelpunkt $S(d|0)$.</p>' +
      '<div class="merk"><strong>Scheitelpunktform:</strong> $f(x) = a\\cdot(x - d)^2 + e$ mit Scheitelpunkt $S(d|e)$.<br>' +
      '<strong>Vorzeichenfalle:</strong> $(x + 2)^2 = (x - (-2))^2$, also $d = -2$. Der Scheitelpunkt von $f(x) = (x + 2)^2 - 6$ ist $S(-2|-6)$, nicht $S(2|-6)$.</div>' +
      '<h3>Streckfaktor aus dem Graphen ablesen</h3>' +
      '<p>Geh vom Scheitelpunkt eine Einheit nach rechts. $a$ gibt an, wie viele Einheiten du nach oben ($a > 0$) oder unten ($a < 0$) gehen musst, um die Parabel zu treffen.</p>' +
      '<h3>Ausprobieren</h3><p>Bewege die Regler. Die graue Parabel ist die Normalparabel.</p>',
    widget: function (el) { M.ui.parabelRegler(el, { normal: true }); },
    generatoren: {
      basis: [scheitelAblesen, lageAussehen, gleichungAusS],
      standard: [function (z) { return gleichungAusGraph(z, false); }, graphZuordnen, regler, function (z) { return abbildungen(z, false); }],
      knobel: [function (z) { return gleichungAusGraph(z, true); }, function (z) { return abbildungen(z, true); }, spiegeln]
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
