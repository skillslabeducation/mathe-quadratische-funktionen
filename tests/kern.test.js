/* Tests für Parser und Prüfung. Start: node tests/kern.test.js */
var assert = require('assert');
var path = require('path');
require(path.join(__dirname, 'laden.js'));
var M = globalThis.M, Q = M.Q, P = M.P;

var fehler = 0, anzahl = 0;
function test(name, fn) {
  anzahl++;
  try { fn(); } catch (e) { fehler++; console.log('FEHLER: ' + name + '\n   ' + e.message); }
}
function ok(feld, eingabe) {
  var r = M.pruefe(feld, eingabe);
  assert.ok(r.ok, 'sollte richtig sein: "' + eingabe + '" -> ' + JSON.stringify(r));
}
function falsch(feld, eingabe, meldungTeil) {
  var r = M.pruefe(feld, eingabe);
  assert.ok(!r.ok, 'sollte falsch sein: "' + eingabe + '"');
  if (meldungTeil) assert.ok(r.meldung && r.meldung.indexOf(meldungTeil) >= 0, 'Meldung für "' + eingabe + '" sollte "' + meldungTeil + '" enthalten, ist: ' + r.meldung);
}
function unlesbar(feld, eingabe) {
  var r = M.pruefe(feld, eingabe);
  assert.ok(r.lesbar === false, 'sollte unlesbar sein: "' + eingabe + '" -> ' + JSON.stringify(r));
}

/* Brüche */
test('Brüche', function () {
  assert.ok(Q(1, 2).plus(Q(1, 3)).gleich(Q(5, 6)));
  assert.ok(Q.aus(0.125).gleich(Q(1, 8)));
  assert.strictEqual(M.f.tex(Q(-1, 8)), '-\\frac{1}{8}');
  assert.strictEqual(M.f.tex(Q(1, 2)), '0{,}5');
  assert.strictEqual(M.f.zahl(-2.5), '−2,5');
});

/* Polynome und TeX */
test('Polynome', function () {
  var p = P.ausNullstellen(0.5, 6, -2);
  assert.ok(P.gleich(p, [-6, -2, 0.5]));
  assert.strictEqual(M.t.poly(p), '0{,}5x^2 - 2x - 6');
  assert.strictEqual(M.t.spf(2, -3, -1), '2\\cdot (x + 3)^2 - 1');
  assert.strictEqual(M.t.spf(-1, 0, 4), '-x^2 + 4');
  assert.strictEqual(M.t.spf(1, 2, 0), '(x - 2)^2');
  assert.ok(P.gleich(P.ausScheitel(2, 1, 3), [5, -4, 2]));
});

/* Terme */
var termFeld = { art: 'term', loesung: [2, -3, 1] }; // x² − 3x + 2
test('Term gleichwertig', function () {
  ['x^2-3x+2', 'x²-3x+2', 'x*x - 3*x + 2', '2-3x+x^2', 'X² − 3x + 2', 'f(x)=x^2-3x+2', '(x-1)(x-2)', 'x·x−3·x+2', ' x ^ 2 - 3 x + 2 ']
    .forEach(function (e) { ok(termFeld, e); });
});
test('Term falsch', function () {
  falsch(termFeld, 'x^2+3x+2');
  falsch(termFeld, 'x^2-3x-2');
});
test('Term unlesbar', function () {
  unlesbar(termFeld, 'x2-3x+2');
  unlesbar(termFeld, '');
  unlesbar(termFeld, '(x-1');
  unlesbar(termFeld, 'x^2-3x+2)');
});
test('Term Teildiagnose', function () {
  falsch(termFeld, 'x^2-3x-2', 'Teilweise richtig');
});
test('Term typischer Fehler', function () {
  var feld = { art: 'term', loesung: [9, -6, 1], typisch: [{ wert: [-9, 0, 1], text: 'BINOM' }] };
  falsch(feld, 'x^2-9', 'BINOM');
});
test('Formprüfung Scheitelpunktform', function () {
  var feld = { art: 'term', loesung: P.ausScheitel(2, 3, -1), form: 'spf' };
  ok(feld, '2(x-3)^2-1');
  ok(feld, '2*(x-3)²-1');
  ok(feld, '2·(x−3)²−1');
  var r = M.pruefe(feld, '2x^2-12x+17');
  assert.ok(!r.ok && r.fast, 'allgemeine Form sollte "fast" sein');
  var feld2 = { art: 'term', loesung: P.ausScheitel(-0.5, -2, 4), form: 'spf' };
  ok(feld2, '-0,5(x+2)^2+4');
  ok(feld2, '-1/2(x+2)^2+4');
  ok(feld2, '-(1/2)(x+2)^2+4');
  var feld3 = { art: 'term', loesung: P.ausScheitel(1, 0, -4), form: 'spf' };
  ok(feld3, 'x^2-4');
  var feld4 = { art: 'term', loesung: P.ausScheitel(-1, 3, 0), form: 'spf' };
  ok(feld4, '-(x-3)^2');
});
test('Formprüfung allgemeine und faktorisierte Form', function () {
  var allg = { art: 'term', loesung: P.ausNullstellen(1, 2, -3), form: 'allg' };
  ok(allg, 'x^2+x-6');
  assert.ok(M.pruefe(allg, '(x-2)(x+3)').fast);
  var fakt = { art: 'term', loesung: P.ausNullstellen(-0.125, -2, 4), form: 'fakt' };
  ok(fakt, '-1/8(x+2)(x-4)');
  ok(fakt, '-0,125·(x+2)·(x−4)');
  var fakt2 = { art: 'term', loesung: P.ausNullstellen(3, 0, 2), form: 'fakt' };
  ok(fakt2, '3x(x-2)');
});

/* Zahlen */
test('Zahlen', function () {
  var feld = { art: 'zahl', loesung: -2.5 };
  ['-2,5', '−2,5', '-2.5', '-5/2', 'x = -2,5'].forEach(function (e) { ok(feld, e); });
  falsch(feld, '2,5', 'Vorzeichen');
  var tr = { art: 'zahl', loesung: Math.sqrt(2), runden: 2 };
  ok(tr, '1,41');
  falsch(tr, '1,4', 'Knapp');
  falsch(tr, '1,42');
  var bruch = { art: 'zahl', loesung: Q(-1, 8) };
  ok(bruch, '-1/8'); ok(bruch, '-0,125');
});

/* Punkte */
test('Punkte', function () {
  var feld = { art: 'punkt', loesung: [2, -8] };
  ['(2|-8)', '(2|−8)', '2|-8', 'S(2|-8)', '(2;-8)', '(2,-8)', '( 2 | -8 )', '2 -8'].forEach(function (e) { ok(feld, e); });
  falsch(feld, '(-8|2)', 'vertauscht');
  falsch(feld, '(-2|-8)', 'Vorzeichen');
  falsch(feld, '(2|8)', 'x-Koordinate stimmt');
  var dez = { art: 'punkt', loesung: [2.5, -1] };
  ok(dez, '(2,5|-1)');
});

/* Lösungsmengen */
test('Lösungsmengen', function () {
  var feld = { art: 'menge', loesung: [2, -3] };
  ['2; -3', '-3;2', 'x1=2, x2=-3', 'x₁ = 2; x₂ = −3', 'L={-3;2}', '2 und -3', '2, -3', '{2; -3}', 'x=2 oder x=-3']
    .forEach(function (e) { ok(feld, e); });
  falsch(feld, '2', 'fehlt');
  falsch(feld, '2; 3', 'Eine deiner Zahlen stimmt');
  falsch(feld, 'keine Lösung', 'hat Lösungen');
  var pm = { art: 'menge', loesung: [5, -5] };
  ok(pm, '±5'); ok(pm, 'x = ±5'); ok(pm, '+-5');
  var leer = { art: 'menge', loesung: [] };
  ok(leer, 'keine Lösung'); ok(leer, 'L = {}'); ok(leer, 'keine');
  var dez = { art: 'menge', loesung: [2.5, -1] };
  ok(dez, '2,5; -1'); ok(dez, 'x1 = 2,5, x2 = -1');
  var tr = { art: 'menge', loesung: [-1 + Math.sqrt(5), -1 - Math.sqrt(5)], runden: 2 };
  ok(tr, '1,24; -3,24');
  var dop = { art: 'menge', loesung: [3] };
  ok(dop, '3'); ok(dop, '3; 3');
});

/* Hinweise auf typische Schüler-Schreibweisen */
test('Komma als Trenner in Lösungsmengen', function () {
  var feld = { art: 'menge', loesung: [0, 13] };
  var r = M.pruefe(feld, '0,13');
  assert.ok(!r.ok && r.fast && /Semikolon/.test(r.meldung), JSON.stringify(r));
  ok(feld, '0; 13'); ok(feld, '0, 13');
});
test('Exakte Wurzel-Lösungen', function () {
  var l = [-3 + Math.sqrt(15), -3 - Math.sqrt(15)];
  var feld = { art: 'menge', loesung: l, wurzel: true };
  ok(feld, '-3 + √15; -3 - √15'); ok(feld, '-3 ± √15'); ok(feld, '-3+sqrt(15); -3-sqrt(15)'); ok(feld, '-3 +- √(15)');
  var r = M.pruefe(feld, '0,87; -6,87');
  assert.ok(!r.ok && r.fast && /exakte/.test(r.meldung), JSON.stringify(r));
  var gerundet = { art: 'menge', loesung: l, runden: 2 };
  ok(gerundet, '0,87; -6,87');
  falsch(gerundet, '0,8; -6,8');
});
test('Offene Aufgaben mit Bedingung', function () {
  var feld = { art: 'term', form: 'spf', bedingung: function (k) { return { ok: k[2] > 0 && Math.abs(-k[1] / (2 * k[2]) - 2) < 1e-9 }; } };
  ok(feld, '3(x-2)^2+1');
  assert.ok(!M.pruefe(feld, '-(x-2)^2').ok);
  assert.ok(M.pruefe(feld, 'x^2-4x+5').fast, 'richtige Parabel in falscher Form sollte "fast" sein');
});
test('Scheitelpunktform: getrennte Diagnose', function () {
  var feld = { art: 'term', loesung: P.ausScheitel(2, 3, -1), form: 'spf' };
  falsch(feld, '2(x+3)^2-1', 'falsches Vorzeichen');
  falsch(feld, '(x-3)^2-1', 'Streckfaktor');
  falsch(feld, '-2(x-3)^2-1', 'Öffnung');
  falsch(feld, '2(x-3)^2+1', 'Verschiebung in y-Richtung');
});

console.log(anzahl - fehler + ' von ' + anzahl + ' Testgruppen bestanden.');
if (fehler) process.exit(1);

/* Mehrere Punkte und Ablese-Toleranz (Phase 2) */
var anzahl2 = 0, fehler2 = 0;
[['Schnittpunkte', function () {
  var feld = { art: 'punkte', loesung: [[-2, 3], [4, 3]] };
  ['(-2|3); (4|3)', '(4|3) (-2|3)', 'S1(-2|3) und S2(4|3)', '(−2|3);(4|3)'].forEach(function (e) { ok(feld, e); });
  falsch(feld, '-2; 4', 'nur die x-Werte');
  falsch(feld, '(-2|3)', 'fehlt');
  falsch(feld, '(-2|5); (4|7)', 'x-Werte stimmen');
  unlesbar(feld, 'zwei Punkte');
  var leer = { art: 'punkte', loesung: [] };
  ok(leer, 'keine Schnittpunkte');
  var tr = { art: 'punkte', loesung: [[2 + Math.sqrt(10), 8 + Math.sqrt(10)], [2 - Math.sqrt(10), 8 - Math.sqrt(10)]], runden: 2 };
  ok(tr, '(5,16|11,16); (-1,16|4,84)');
}], ['Ablese-Toleranz', function () {
  var feld = { art: 'menge', loesung: [3 - Math.sqrt(2), 3 + Math.sqrt(2)], toleranz: 0.15 };
  ok(feld, '1,6; 4,4'); ok(feld, '1,5; 4,5');
  falsch(feld, '1; 5');
}]].forEach(function (tc) {
  anzahl2++;
  try { tc[1](); } catch (e) { fehler2++; console.log('FEHLER: ' + tc[0] + '\n   ' + e.message); }
});
console.log(anzahl2 - fehler2 + ' von ' + anzahl2 + ' Zusatzgruppen bestanden.');
if (fehler2) process.exit(1);
