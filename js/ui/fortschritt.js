/* Fortschritt im Browser speichern (localStorage). Funktioniert auch ohne Speicher, dann nur für die Sitzung. */
(function (root) {
  var M = root.M;
  var SCHLUESSEL = 'mathe9-quadratisch-v1';
  var daten = null;

  function leer() { return { b: {}, pa: [] }; }
  function laden() {
    if (daten) return daten;
    try {
      var roh = root.localStorage && root.localStorage.getItem(SCHLUESSEL);
      daten = roh ? JSON.parse(roh) : leer();
      if (!daten.b) daten.b = {};
      if (!daten.pa) daten.pa = [];
    } catch (e) { daten = leer(); }
    return daten;
  }
  function speichern() {
    try { root.localStorage && root.localStorage.setItem(SCHLUESSEL, JSON.stringify(daten)); } catch (e) { /* ohne Speicher weiter */ }
  }
  function bereichDaten(id) {
    var d = laden();
    if (!d.b[id]) d.b[id] = { s: {}, verlauf: [], zuletzt: 0 };
    return d.b[id];
  }

  function eintragen(bereichId, stufe, richtig) {
    var b = bereichDaten(bereichId);
    if (!b.s[stufe]) b.s[stufe] = { n: 0, r: 0 };
    b.s[stufe].n++;
    if (richtig) b.s[stufe].r++;
    b.verlauf.push(richtig ? 1 : 0);
    if (b.verlauf.length > 20) b.verlauf = b.verlauf.slice(-20);
    b.zuletzt = Date.now();
    speichern();
  }

  /* Ampel: offen (nichts gemacht), arbeit (begonnen), sicher (mind. 8 der letzten 10 richtig) */
  function status(bereichId) {
    var b = laden().b[bereichId];
    if (!b) return { n: 0, r: 0, ampel: 'offen', text: 'noch nicht begonnen' };
    var n = 0, r = 0;
    Object.keys(b.s).forEach(function (k) { n += b.s[k].n; r += b.s[k].r; });
    var letzte = b.verlauf.slice(-10);
    var richtigLetzte = letzte.reduce(function (s, x) { return s + x; }, 0);
    var ampel = n === 0 ? 'offen' : (letzte.length >= 10 && richtigLetzte >= 8 ? 'sicher' : 'arbeit');
    return { n: n, r: r, ampel: ampel, letzte: letzte.length, richtigLetzte: richtigLetzte, stufen: b.s, zuletzt: b.zuletzt };
  }

  function probearbeitEintragen(e) { laden().pa.push(e); speichern(); }
  function probearbeiten() { return laden().pa.slice(); }
  function probearbeitAktualisieren(e) { var d = laden(); if (d.pa.length) d.pa[d.pa.length - 1] = e; speichern(); }

  function zuruecksetzen() {
    daten = leer();
    try { root.localStorage && root.localStorage.removeItem(SCHLUESSEL); } catch (e) { /* egal */ }
  }

  M.fortschritt = {
    eintragen: eintragen, status: status, zuruecksetzen: zuruecksetzen,
    probearbeitEintragen: probearbeitEintragen, probearbeiten: probearbeiten, probearbeitAktualisieren: probearbeitAktualisieren
  };
})(typeof window !== 'undefined' ? window : globalThis);
