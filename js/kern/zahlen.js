/* Zahlen: exakte Brüche (Q), Zufall, deutsche Formatierung.
   Läuft im Browser (window.M) und in Node (globalThis.M). */
(function (root) {
  var M = root.M || (root.M = {});

  function ggT(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { var t = a % b; a = b; b = t; }
    return a;
  }

  /* ---------- Bruch ---------- */
  function Q(n, d) {
    if (!(this instanceof Q)) return new Q(n, d);
    if (d === undefined) d = 1;
    if (!Number.isInteger(n) || !Number.isInteger(d)) {
      var q = Q.aus(n / d);
      n = q.n; d = q.d;
    }
    if (d === 0) throw new Error('Division durch 0');
    if (d < 0) { n = -n; d = -d; }
    var g = ggT(n, d) || 1;
    this.n = n / g;
    this.d = d / g;
    if (this.n === 0) this.n = 0; // -0 vermeiden
  }
  Q.aus = function (x) {
    if (x instanceof Q) return x;
    if (Number.isInteger(x)) return new Q(x, 1);
    // Dezimalzahl in Bruch (Nenner bis 10^6)
    for (var d = 1; d <= 1000000; d *= 10) {
      var n = Math.round(x * d);
      if (Math.abs(n / d - x) < 1e-12) return new Q(n, d);
    }
    throw new Error('Keine rationale Darstellung: ' + x);
  };
  Q.prototype.plus = function (b) { b = Q.aus(b); return new Q(this.n * b.d + b.n * this.d, this.d * b.d); };
  Q.prototype.minus = function (b) { b = Q.aus(b); return new Q(this.n * b.d - b.n * this.d, this.d * b.d); };
  Q.prototype.mal = function (b) { b = Q.aus(b); return new Q(this.n * b.n, this.d * b.d); };
  Q.prototype.durch = function (b) { b = Q.aus(b); return new Q(this.n * b.d, this.d * b.n); };
  Q.prototype.neg = function () { return new Q(-this.n, this.d); };
  Q.prototype.abs = function () { return new Q(Math.abs(this.n), this.d); };
  Q.prototype.hoch = function (k) { var r = new Q(1); for (var i = 0; i < k; i++) r = r.mal(this); return r; };
  Q.prototype.gleich = function (b) { b = Q.aus(b); return this.n === b.n && this.d === b.d; };
  Q.prototype.istNull = function () { return this.n === 0; };
  Q.prototype.istGanz = function () { return this.d === 1; };
  Q.prototype.vz = function () { return Math.sign(this.n); };
  Q.prototype.wert = function () { return this.n / this.d; };
  Q.prototype.valueOf = Q.prototype.wert;
  /* Wurzel, falls exakt (Zähler und Nenner Quadratzahlen), sonst null */
  Q.prototype.wurzel = function () {
    if (this.n < 0) return null;
    var a = Math.round(Math.sqrt(this.n)), b = Math.round(Math.sqrt(this.d));
    if (a * a === this.n && b * b === this.d) return new Q(a, b);
    return null;
  };
  /* "glatt" = ganz oder Nenner 2 (Halbe), 4 oder 5 mit höchstens 2 Nachkommastellen */
  Q.prototype.istGlatt = function () {
    return this.d === 1 || this.d === 2 || this.d === 4 || this.d === 5 || this.d === 10;
  };
  /* Darstellung als Dezimalzahl (0,25; 0,01; 0,005) statt Bruch? Wie im Buch: 1/8 bleibt ein Bruch. */
  Q.prototype.dezimal = function () {
    return [1, 2, 4, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000].indexOf(this.d) >= 0;
  };
  M.Q = Q;
  M.ggT = ggT;

  /* ---------- Zufall (mit Startwert, damit Tests reproduzierbar sind) ---------- */
  function Zufall(seed) {
    var s = (seed === undefined ? Math.floor(Math.random() * 4294967296) : seed) >>> 0;
    this.next = function () { // mulberry32
      s = (s + 0x6D2B79F5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  Zufall.prototype.int = function (a, b) { return a + Math.floor(this.next() * (b - a + 1)); };
  Zufall.prototype.nz = function (a, b) { // ganze Zahl ungleich 0
    var x; do { x = this.int(a, b); } while (x === 0); return x;
  };
  Zufall.prototype.wahl = function (arr) { return arr[Math.floor(this.next() * arr.length)]; };
  Zufall.prototype.chance = function (p) { return this.next() < p; };
  Zufall.prototype.vz = function () { return this.next() < 0.5 ? -1 : 1; };
  Zufall.prototype.mischen = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(this.next() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };
  /* mehrere verschiedene ganze Zahlen */
  Zufall.prototype.verschieden = function (k, a, b, ohneNull) {
    var res = [];
    while (res.length < k) {
      var x = this.int(a, b);
      if (ohneNull && x === 0) continue;
      if (res.indexOf(x) < 0) res.push(x);
    }
    return res;
  };
  M.Zufall = Zufall;

  /* ---------- Formatierung ---------- */
  var MINUS = '−';

  /* Zahl als Text (deutsch): −3; 0,5; 1/8 */
  function zahlText(x, stellen) {
    if (x instanceof Q) {
      if (x.dezimal()) return zahlText(x.wert());
      return (x.n < 0 ? MINUS : '') + Math.abs(x.n) + '/' + x.d;
    }
    if (stellen !== undefined) x = runde(x, stellen);
    var s = String(Math.abs(x));
    if (s.indexOf('e') >= 0) s = Math.abs(x).toFixed(10).replace(/0+$/, '');
    return (x < 0 ? MINUS : '') + s.replace('.', ',');
  }

  /* Zahl als TeX: -3; 0{,}5; -\frac{1}{8} */
  function zahlTex(x, stellen) {
    if (x instanceof Q) {
      if (x.dezimal()) return zahlTex(x.wert());
      return (x.n < 0 ? '-' : '') + '\\frac{' + Math.abs(x.n) + '}{' + x.d + '}';
    }
    if (stellen !== undefined) x = runde(x, stellen);
    var s = String(Math.abs(x));
    return (x < 0 ? '-' : '') + s.replace('.', '{,}');
  }

  function runde(x, stellen) {
    var f = Math.pow(10, stellen);
    var r = Math.round(x * f + (x >= 0 ? 1e-9 : -1e-9)) / f;
    return r === 0 ? 0 : r;
  }

  /* Zahl in Klammern, wenn negativ (für Einsetzen): (-3) */
  function klTex(x) {
    var w = (x instanceof Q) ? x.wert() : x;
    return w < 0 ? '(' + zahlTex(x) + ')' : zahlTex(x);
  }

  M.f = {
    MINUS: MINUS,
    zahl: zahlText,
    tex: zahlTex,
    kl: klTex,
    runde: runde
  };
})(typeof window !== 'undefined' ? window : globalThis);
