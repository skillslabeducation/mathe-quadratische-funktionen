/* Merkblatt: eine Seite DIN A4 (Druckansicht in css/stil.css).
   Aufbau: Tabelle über die ganze Breite, darunter zwei feste Spalten. */
(function (root) {
  var M = root.M;
  M.MERKBLATT =
    '<h1>Merkblatt: Quadratische Funktionen und Gleichungen</h1>' +

    '<div class="block voll"><h2>Drei Darstellungsformen</h2><table>' +
    '<tr><th></th><th>Funktionsgleichung</th><th>direkt ablesen</th></tr>' +
    '<tr><td>Scheitelpunktform</td><td>$f(x) = a\\cdot(x - d)^2 + e$</td><td>Streckfaktor $a$, Scheitelpunkt $S(d|e)$</td></tr>' +
    '<tr><td>allgemeine Form</td><td>$f(x) = ax^2 + bx + c$</td><td>Streckfaktor $a$, Schnittpunkt mit der y-Achse $(0|c)$</td></tr>' +
    '<tr><td>faktorisierte Form</td><td>$f(x) = a\\cdot(x - x_1)\\cdot(x - x_2)$</td><td>Streckfaktor $a$, Nullstellen $x_1$ und $x_2$</td></tr></table>' +
    '<p>Der Scheitelpunkt liegt in der Mitte der Nullstellen: $x_S = \\frac{x_1 + x_2}{2}$, dann $y_S = f(x_S)$.</p></div>' +

    '<div class="spalten"><div class="spalte">' +

    '<div class="block"><h2>Streckfaktor und Verschiebung</h2><ul>' +
    '<li>$a > 0$: nach oben geöffnet. $a < 0$: nach unten (an der x-Achse gespiegelt).</li>' +
    '<li>$|a| > 1$: gestreckt (enger). $|a| < 1$: gestaucht (weiter).</li>' +
    '<li>$(x - d)^2$: um $d$ nach rechts. $(x + 2)^2$ heißt $d = -2$, also nach links.</li>' +
    '<li>$+\\,e$: um $e$ nach oben, $-\\,e$: nach unten.</li>' +
    '<li>$a$ am Graphen: vom Scheitelpunkt 1 nach rechts, dann $a$ nach oben bzw. unten.</li></ul></div>' +

    '<div class="block"><h2>Binomische Formeln</h2>' +
    '$$\\begin{aligned} &(a + b)^2 = a^2 + 2ab + b^2\\\\ &(a - b)^2 = a^2 - 2ab + b^2\\\\ &(a + b)\\cdot(a - b) = a^2 - b^2 \\end{aligned}$$</div>' +

    '<div class="block"><h2>Quadratische Ergänzung</h2>' +
    '<p>„Hälfte des Faktors vor $x$ zum Quadrat“ addieren und gleich wieder abziehen:</p>' +
    '$$\\begin{aligned} &x^2 + 8x + 7\\\\ &= x^2 + 8x + 16 - 16 + 7\\\\ &= (x + 4)^2 - 9 \\end{aligned}$$' +
    '<p>Mit $a \\neq 1$ erst ausklammern:</p>' +
    '$$\\begin{aligned} &3x^2 - 12x + 5\\\\ &= 3\\cdot(x^2 - 4x) + 5\\\\ &= 3\\cdot(x^2 - 4x + 4) - 3\\cdot 4 + 5\\\\ &= 3\\cdot(x - 2)^2 - 7 \\end{aligned}$$</div>' +

    '</div><div class="spalte">' +

    '<div class="block"><h2>Gleichungen lösen</h2><ul>' +
    '<li>$x^2 = e$: zwei Lösungen $\\pm\\sqrt{e}$ ($e > 0$), eine ($e = 0$), keine ($e < 0$).</li>' +
    '<li>$(x - d)^2 = e$: $x - d = \\sqrt{e}$ oder $x - d = -\\sqrt{e}$.</li>' +
    '<li>„Produkt = 0“-Regel: Ein Produkt ist 0, wenn ein Faktor 0 ist. Ohne Zahl: $x$ ausklammern.</li></ul>' +
    '<p><strong>pq-Formel</strong> für $x^2 + px + q = 0$ (vorher durch $a$ teilen):</p>' +
    '$$x_{1,2} = -\\frac{p}{2} \\pm \\sqrt{\\left(\\frac{p}{2}\\right)^2 - q}$$' +
    '<p>$D = \\left(\\frac{p}{2}\\right)^2 - q$: $D > 0$ zwei, $D = 0$ eine, $D < 0$ keine Lösung.</p></div>' +

    '<div class="block"><h2>Schnittpunkte von zwei Graphen</h2>' +
    '<p>1. Gleichsetzen $f(x) = g(x)$. 2. Alles auf eine Seite. 3. Lösen. 4. $x$ einsetzen, $y$ berechnen. Ergebnis sind <strong>Punkte</strong>.</p></div>' +

    '<div class="block"><h2>Funktionsgleichung bestimmen</h2><ul>' +
    '<li>Scheitelpunkt + Punkt: $a\\cdot(x - d)^2 + e$, Punkt einsetzen, $a$ ausrechnen.</li>' +
    '<li>Nullstellen + Punkt: $a\\cdot(x - x_1)\\cdot(x - x_2)$, Punkt einsetzen, $a$ ausrechnen.</li>' +
    '<li>y-Achsenabschnitt + zwei Punkte: $ax^2 + bx + c$ mit bekanntem $c$, zwei Gleichungen für $a$ und $b$.</li></ul></div>' +

    '<div class="block"><h2>Die häufigsten Fehler</h2><ul>' +
    '<li>$(x - 3)^2 = x^2 - 6x + 9$, <strong>nicht</strong> $x^2 - 9$.</li>' +
    '<li>$-(x - 3) = -x + 3$: Minus vor der Klammer dreht alle Vorzeichen.</li>' +
    '<li>$(-3)^2 = 9$, aber $-3^2 = -9$. Negative Zahlen in Klammern einsetzen.</li>' +
    '<li>$x^2 = 25$ hat zwei Lösungen: $5$ und $-5$. Nie durch $x$ teilen.</li>' +
    '<li>pq-Formel: erst durch $a$ teilen, $p$ und $q$ mit Vorzeichen.</li></ul></div>' +

    '</div></div>';
})(typeof window !== 'undefined' ? window : globalThis);
