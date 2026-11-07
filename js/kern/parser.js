/* Eingaben lesen: Terme, Zahlen, Punkte, Lösungsmengen.
   Fehler werden als {fehler: 'Text'} gemeldet, damit die Seite freundlich nachfragen kann. */
(function (root) {
  var M = root.M;

  /* Gemeinsame Vorbereitung: Unicode-Zeichen vereinheitlichen */
  function vereinheitlichen(s) {
    return String(s)
      .replace(/[−–—]/g, '-')     // Minuszeichen, Gedankenstriche
      .replace(/[·⋅×*]/g, '*')    // Malpunkte
      .replace(/²/g, '^2')
      .replace(/³/g, '^3')
      .replace(/÷|:/g, '/')
      .replace(/[\[\{]/g, '(').replace(/[\]\}]/g, ')')
      .replace(/X/g, 'x')
      .replace(/±|\+-|\+\/-/g, '±')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* ---------- Term-Parser (rekursiv absteigend) ---------- */
  function tokens(s) {
    var t = [], i = 0;
    while (i < s.length) {
      var c = s[i];
      if (c === ' ') { i++; continue; }
      if (/[0-9.]/.test(c)) {
        var j = i;
        while (j < s.length && /[0-9.]/.test(s[j])) j++;
        var roh = s.slice(i, j);
        if ((roh.match(/\./g) || []).length > 1) return { fehler: 'Die Zahl „' + roh.replace('.', ',') + '“ hat zu viele Kommas.' };
        t.push({ k: 'zahl', v: parseFloat(roh) });
        i = j; continue;
      }
      if (c === 'x') {
        // "x2" ist meist als x² gemeint, aber mehrdeutig
        if (/[0-9]/.test(s[i + 1] || '')) return { fehler: 'Meinst du x²? Schreib x^2 oder nimm die Taste ².' };
        t.push({ k: 'x' }); i++; continue;
      }
      if (s.substr(i, 4) === 'sqrt') { t.push({ k: '√' }); i += 4; continue; }
      if (c === '√') { t.push({ k: '√' }); i++; continue; }
      if ('+-*/^()'.indexOf(c) >= 0) { t.push({ k: c }); i++; continue; }
      if (c === '±') return { fehler: 'Das Zeichen ± geht hier nicht. Schreib die Lösungen einzeln.' };
      return { fehler: 'Das Zeichen „' + c + '“ kann ich nicht lesen.' };
    }
    return t;
  }

  function parseTerm(eingabe) {
    var s = vereinheitlichen(eingabe).replace(/,/g, '.');
    s = s.replace(/^\s*(f\s*\(\s*x\s*\)|y|g\s*\(\s*x\s*\)|h\s*\(\s*x\s*\))\s*=\s*/i, '');
    if (!s) return { fehler: 'Das Feld ist noch leer.' };
    var t = tokens(s);
    if (t.fehler) return t;
    var pos = 0;
    function sieh() { return t[pos]; }
    function nimm(k) { if (t[pos] && t[pos].k === k) { pos++; return true; } return false; }
    function startPrimaer(tok) { return tok && (tok.k === 'zahl' || tok.k === 'x' || tok.k === '(' || tok.k === '√'); }

    function ausdruck() {
      var a = produkt();
      while (sieh() && (sieh().k === '+' || sieh().k === '-')) {
        var op = sieh().k; pos++;
        var b = produkt();
        a = { t: op, a: a, b: b };
      }
      return a;
    }
    function produkt() {
      var a = unaer();
      for (;;) {
        var tok = sieh();
        if (tok && (tok.k === '*' || tok.k === '/')) { pos++; a = { t: tok.k, a: a, b: unaer() }; }
        else if (startPrimaer(tok)) { a = { t: '*', a: a, b: potenz() }; } // 2x, 3(x-1), (x-1)(x+2)
        else break;
      }
      return a;
    }
    function unaer() {
      if (nimm('-')) return { t: 'neg', a: unaer() };
      if (nimm('+')) return unaer();
      return potenz();
    }
    function potenz() {
      var a = primaer();
      if (nimm('^')) return { t: '^', a: a, b: unaer() };
      return a;
    }
    function primaer() {
      var tok = sieh();
      if (!tok) throw new Error('Da fehlt noch etwas am Ende.');
      if (tok.k === 'zahl') { pos++; return { t: 'zahl', v: tok.v }; }
      if (tok.k === 'x') { pos++; return { t: 'x' }; }
      if (tok.k === '√') { pos++; return { t: '√', a: primaer() }; }
      if (nimm('(')) {
        var a = ausdruck();
        if (!nimm(')')) throw new Error('Eine Klammer wird nicht geschlossen.');
        return a;
      }
      if (tok.k === ')') throw new Error('Eine Klammer wird geschlossen, die nie geöffnet wurde.');
      throw new Error('An der Stelle „' + tok.k + '“ fehlt eine Zahl oder ein x.');
    }
    try {
      var baum = ausdruck();
      if (pos < t.length) {
        if (t[pos].k === ')') throw new Error('Eine Klammer wird geschlossen, die nie geöffnet wurde.');
        throw new Error('Die Eingabe ist nach „' + s.slice(0, 20) + '“ nicht ganz lesbar.');
      }
      return { baum: baum, text: s };
    } catch (e) {
      return { fehler: e.message };
    }
  }

  function auswerten(b, x) {
    switch (b.t) {
      case 'zahl': return b.v;
      case 'x': return x;
      case '+': return auswerten(b.a, x) + auswerten(b.b, x);
      case '-': return auswerten(b.a, x) - auswerten(b.b, x);
      case '*': return auswerten(b.a, x) * auswerten(b.b, x);
      case '/': return auswerten(b.a, x) / auswerten(b.b, x);
      case '^': return Math.pow(auswerten(b.a, x), auswerten(b.b, x));
      case 'neg': return -auswerten(b.a, x);
      case '√': return Math.sqrt(auswerten(b.a, x));
    }
    return NaN;
  }
  function enthaeltX(b) {
    if (!b) return false;
    if (b.t === 'x') return true;
    return enthaeltX(b.a) || enthaeltX(b.b);
  }

  /* Zahl lesen (Ausdruck ohne x erlaubt: 1/2, -0,5, √9) */
  function parseZahl(eingabe) {
    var s = vereinheitlichen(eingabe);
    s = s.replace(/^\s*[a-z]\s*(_?\d|[₀-₉])?\s*=\s*/i, ''); // "x = 3", "a=2", "x1 = 3"
    if (!s) return { fehler: 'Das Feld ist noch leer.' };
    var r = parseTerm(s);
    if (r.fehler) return r;
    if (enthaeltX(r.baum)) return { fehler: 'Hier ist nur eine Zahl gefragt, ohne x.' };
    var w = auswerten(r.baum, 0);
    if (!isFinite(w)) return { fehler: 'Diese Zahl kann ich nicht berechnen.' };
    return { wert: w };
  }

  /* Punkt lesen: (2|-8), 2|-8, (2;-8), (2,-8), S(2|-8) */
  function parsePunkt(eingabe) {
    var s = vereinheitlichen(eingabe);
    s = s.replace(/^[a-z]\s*[₀-₉\d]?\s*=?\s*/i, '').trim(); // Punktname weg
    if (!s) return { fehler: 'Das Feld ist noch leer.' };
    if (s.charAt(0) === '(' && s.charAt(s.length - 1) === ')') s = s.slice(1, -1);
    var teile;
    if (s.indexOf('|') >= 0) teile = s.split('|');
    else if (s.indexOf(';') >= 0) teile = s.split(';');
    else if ((s.match(/,/g) || []).length === 1) teile = s.split(',');
    else if ((s.match(/,/g) || []).length > 1) return { fehler: 'Trenne x und y mit einem senkrechten Strich, z. B. (2|−8).' };
    else teile = s.split(' ').filter(function (z) { return z; });
    if (teile.length !== 2) return { fehler: 'Ein Punkt braucht genau zwei Koordinaten, z. B. (2|−8).' };
    var x = parseZahl(teile[0]), y = parseZahl(teile[1]);
    if (x.fehler) return { fehler: 'x-Koordinate: ' + x.fehler };
    if (y.fehler) return { fehler: 'y-Koordinate: ' + y.fehler };
    return { x: x.wert, y: y.wert };
  }

  /* Mehrere Punkte lesen: "(−2|3); (4|3)", "S1(1|2) und S2(3|4)", "keine" */
  function parsePunkte(eingabe) {
    var s = vereinheitlichen(eingabe);
    if (!s) return { fehler: 'Das Feld ist noch leer.' };
    if (/kein/i.test(s)) return { punkte: [] };
    var treffer = s.match(/\([^()]*\)/g);
    if (!treffer) {
      var m = parseMenge(eingabe);
      if (!m.fehler && m.werte.length) return { nurZahlen: m.werte };
      return { fehler: 'Schreib jeden Punkt in Klammern, z. B. (−2|3); (4|3).' };
    }
    var pts = [];
    for (var i = 0; i < treffer.length; i++) {
      var p = parsePunkt(treffer[i]);
      if (p.fehler) return { fehler: 'Punkt ' + (i + 1) + ': ' + p.fehler };
      if (!pts.some(function (q) { return Math.abs(q.x - p.x) < 1e-9 && Math.abs(q.y - p.y) < 1e-9; })) pts.push(p);
    }
    return { punkte: pts };
  }

  /* Lösungsmenge lesen: "2; -3", "x1=2, x2=-3", "L={-3;2}", "±5", "keine" */
  function parseMenge(eingabe) {
    var s = vereinheitlichen(eingabe).toLowerCase();
    if (!s) return { fehler: 'Das Feld ist noch leer.' };
    if (/kein|leer|∅/.test(s) || /^\s*(l\s*=\s*)?\(\s*\)\s*$/.test(s)) return { werte: [] };
    s = s.replace(/l\s*=\s*/g, '');
    // Komma als Trenner, wenn danach Leerzeichen, Vorzeichen oder x kommt; sonst Dezimalkomma
    s = s.replace(/,(?=\s|[-+±x])/g, ';')
      .replace(/x\s*(_?\s*\d|[₀-₉])?\s*=\s*/g, ';')
      .replace(/\b(und|oder)\b/g, ';');
    // Klammern der Menge entfernen, wenn sie die ganze Eingabe umschließen
    s = s.trim();
    if (s.charAt(0) === '(' && s.charAt(s.length - 1) === ')' && s.slice(1, -1).indexOf('(') < 0) s = s.slice(1, -1);
    var teile = s.split(';').map(function (z) { return z.trim(); }).filter(function (z) { return z; });
    if (!teile.length) return { fehler: 'Ich finde keine Zahl. Schreib z. B. 2; −3 oder „keine Lösung“.' };
    var werte = [];
    for (var i = 0; i < teile.length; i++) {
      var tz = teile[i], beide = false;
      if (tz.charAt(0) === '±') { beide = true; tz = tz.slice(1); }
      else if (tz.indexOf('±') > 0) { // "-2 ± √3" -> beide Werte
        var lr = tz.split('±'), l = parseZahl(lr[0]), r = parseZahl(lr[1]);
        if (l.fehler) return { fehler: l.fehler };
        if (r.fehler) return { fehler: r.fehler };
        werte.push(l.wert + r.wert, l.wert - r.wert);
        continue;
      }
      var z = parseZahl(tz);
      if (z.fehler) return { fehler: z.fehler };
      werte.push(z.wert);
      if (beide && z.wert !== 0) werte.push(-z.wert);
    }
    // doppelte Werte zusammenfassen
    var eindeutig = [];
    werte.forEach(function (w) {
      if (!eindeutig.some(function (u) { return Math.abs(u - w) < 1e-9; })) eindeutig.push(w);
    });
    return { werte: eindeutig.sort(function (a, b) { return a - b; }) };
  }

  /* Eingabe als TeX zurückgeben (für die Vorschau „So lese ich deine Eingabe“) */
  var RANG = { '+': 1, '-': 1, '*': 2, '/': 2, 'neg': 3, '^': 4, 'zahl': 5, 'x': 5, '√': 5 };
  function zahlTex(v) { return String(v).replace('.', '{,}'); }
  function texVon(b, eltern) {
    var r = RANG[b.t], s;
    switch (b.t) {
      case 'zahl': s = zahlTex(b.v); break;
      case 'x': s = 'x'; break;
      case '+': s = texVon(b.a, 1) + ' + ' + texVon(b.b, b.b.t === 'neg' ? 9 : 1.5); break;
      case '-': s = texVon(b.a, 1) + ' - ' + texVon(b.b, b.b.t === 'neg' ? 9 : 1.5); break;
      case '*':
        var links = texVon(b.a, 2), rechts = texVon(b.b, b.b.t === 'neg' ? 9 : 2.5);
        var punkt = b.b.t === 'zahl' || b.b.t === 'neg' || (b.b.t === '^' && b.b.a.t === 'zahl') || b.a.t === 'x' && b.b.t === 'x';
        s = links + (punkt ? ' \\cdot ' : '') + rechts; break;
      case '/': return '\\frac{' + texVon(b.a, 0) + '}{' + texVon(b.b, 0) + '}';
      case '^': s = texVon(b.a, 4.5) + '^{' + texVon(b.b, 0) + '}'; break;
      case 'neg': s = '-' + texVon(b.a, 3); break;
      case '√': return '\\sqrt{' + texVon(b.a, 0) + '}';
    }
    return (eltern !== undefined && r < eltern) ? '(' + s + ')' : s;
  }

  /* Normalisierte Form für Formprüfungen: ohne Leerzeichen und Malzeichen */
  function kompakt(eingabe) {
    return vereinheitlichen(eingabe).replace(/,/g, '.')
      .replace(/^\s*(f\s*\(\s*x\s*\)|y)\s*=\s*/i, '')
      .replace(/[\s*]/g, '');
  }

  M.parse = {
    term: parseTerm, zahl: parseZahl, punkt: parsePunkt, menge: parseMenge, punkte: parsePunkte,
    auswerten: auswerten, enthaeltX: enthaeltX, kompakt: kompakt, vereinheitlichen: vereinheitlichen, tex: texVon
  };
})(typeof window !== 'undefined' ? window : globalThis);
