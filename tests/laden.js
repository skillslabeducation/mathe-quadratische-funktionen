/* Lädt die Browser-Skripte in Node (gleiche Reihenfolge wie in index.html). */
var path = require('path');
var basis = path.join(__dirname, '..', 'js');
var dateien = [
  'kern/zahlen.js', 'kern/terme.js', 'kern/parser.js', 'kern/pruefen.js',
  'aufgaben/register.js', 'daten/themen.js', 'daten/merkblatt.js',
  'aufgaben/grundlagen-rechenregeln.js', 'aufgaben/grundlagen-klammern.js',
  'aufgaben/grundlagen-binome.js', 'aufgaben/grundlagen-umstellen.js',
  'aufgaben/thema-01-funktion.js', 'aufgaben/thema-02-parabeln.js',
  'aufgaben/thema-03-normalparabel.js', 'aufgaben/thema-04-darstellungsformen.js',
  'aufgaben/thema-05-punkte.js', 'aufgaben/thema-06-grafisch.js', 'aufgaben/thema-07-gleichungen.js',
  'aufgaben/thema-08-schnittpunkte.js', 'aufgaben/thema-09-fragen.js', 'aufgaben/thema-10-problemloesen.js',
  'aufgaben/wiederholung.js', 'aufgaben/fehler-finden.js'
];
var fs = require('fs');
dateien.forEach(function (d) {
  var p = path.join(basis, d);
  if (fs.existsSync(p)) require(p);
});
