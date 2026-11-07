/* Antworten prüfen und typische Fehler erkennen.
   Ergebnis: { ok, fast, lesbar, meldung, gelesen }
   - ok: richtig
   - fast: gleichwertig, aber nicht in der verlangten Form (zählt nicht als Fehler)
   - lesbar: false, wenn die Eingabe nicht verstanden wurde (zählt nicht als Fehler) */
(function (root) {
  var M = root.M;
  var Q = M.Q, f = M.f, P = M.P, parse = M.parse;

  var EPS = 1e-9;
  var STELLEN = [-2.7, -1.3, 0.4, 1.9, 3.1, 5.3];

  function nahe(a, b, tol) {
    tol = tol === undefined ? EPS : tol;
    return Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  }
  /* Toleranz bei gerundeten Ergebnissen: halbe letzte Stelle plus Spielraum */
  function rundTol(stellen) { return stellen === undefined ? EPS : 0.5 * Math.pow(10, -stellen) + 1e-6; }
  /* stellen: undefined (exakt), Zahl (gerundet auf so viele Stellen) oder {tol: x} (abgelesen, absolute Toleranz) */
  function gleichZahl(a, b, stellen) {
    if (stellen === undefined) return nahe(a, b);
    if (typeof stellen === 'object') return Math.abs(a - b) <= stellen.tol + 1e-9;
    return Math.abs(a - b) <= rundTol(stellen);
  }
  function vgl(feld) { return feld.toleranz !== undefined ? { tol: feld.toleranz } : feld.runden; }

  /* Wert einer Lösung als Funktion x -> Zahl */
  function alsFunktion(l) {
    if (typeof l === 'function') return l;
    if (Array.isArray(l)) { var p = P.neu(l); return function (x) { return P.wert(p, x); }; }
    if (l && l.baum) return function (x) { return parse.auswerten(l.baum, x); };
    throw new Error('Unbekannte Termlösung');
  }
  function termGleich(fa, fb) {
    for (var i = 0; i < STELLEN.length; i++) {
      var a = fa(STELLEN[i]), b = fb(STELLEN[i]);
      if (!isFinite(a) || !isFinite(b) || !nahe(a, b, 1e-7)) return false;
    }
    return true;
  }
  /* Koeffizienten eines (höchstens quadratischen) Terms bestimmen, sonst null */
  function koeffizienten(fn) {
    var c0 = fn(0), y1 = fn(1), ym = fn(-1);
    var c2 = (y1 + ym) / 2 - c0, c1 = (y1 - ym) / 2;
    var probe = function (x) { return c2 * x * x + c1 * x + c0; };
    return termGleich(fn, probe) ? [c0, c1, c2] : null;
  }

  /* ---------- Formprüfungen ---------- */
  var NUM = '(\\d+(\\.\\d+)?(\\/\\d+(\\.\\d+)?)?)';
  var FAKTOR = '([-+]?(' + NUM + '|\\(-?' + NUM + '\\))?)';
  var LIN = '(\\(x([-+]' + NUM + ')?\\)|x)';
  var FORMEN = {
    spf: {
      re: new RegExp('^' + FAKTOR + '(\\(x([-+]' + NUM + ')?\\)\\^2|x\\^2)([-+]' + NUM + ')?$'),
      name: 'Scheitelpunktform a·(x − d)² + e'
    },
    allg: { re: /^[^()√]*$/, name: 'allgemeine Form ax² + bx + c (ohne Klammern)' },
    fakt: {
      re: new RegExp('^' + FAKTOR + '(' + LIN + LIN + '|\\(x[-+]' + NUM + '\\)\\^2)$'),
      name: 'faktorisierte Form a·(x − x₁)·(x − x₂)'
    },
    quadrat: {
      re: new RegExp('^\\(' + NUM + '?x[-+]' + NUM + '\\)\\^2$'),
      name: 'Form (… ± …)²'
    }
  };
  function hatForm(eingabe, form) {
    var s = parse.kompakt(eingabe);
    // Zahlen in Klammern wie (1/2)x^2 sind auch in der allgemeinen Form erlaubt
    if (form === 'allg') s = s.replace(/\(-?\d+(\.\d+)?(\/\d+(\.\d+)?)?\)/g, '1');
    return FORMEN[form].re.test(s);
  }

  /* ---------- Prüfer je Feldart ---------- */
  function pruefeZahl(feld, eingabe) {
    var r = parse.zahl(eingabe);
    if (r.fehler) return { lesbar: false, meldung: r.fehler };
    var l = Number(feld.loesung), w = r.wert;
    var gelesen = f.zahl(w);
    if (gleichZahl(w, l, vgl(feld))) return { ok: true, gelesen: gelesen };
    var t = typischZahl(feld, w);
    if (t) return { ok: false, meldung: t, gelesen: gelesen };
    if (feld.runden !== undefined && Math.abs(w - l) < 0.2) {
      return { ok: false, meldung: 'Knapp daneben. Runde erst ganz am Ende auf ' + feld.runden + ' Nachkommastellen.', gelesen: gelesen };
    }
    if (l !== 0 && gleichZahl(-w, l, vgl(feld))) return { ok: false, meldung: 'Der Betrag stimmt, aber das Vorzeichen nicht.', gelesen: gelesen };
    return { ok: false, gelesen: gelesen };
  }
  function typischZahl(feld, w) {
    var ts = feld.typisch || [];
    for (var i = 0; i < ts.length; i++) {
      if (gleichZahl(w, Number(ts[i].wert), vgl(feld))) return ts[i].text;
    }
    return null;
  }

  function pruefePunkt(feld, eingabe) {
    var r = parse.punkt(eingabe);
    if (r.fehler) return { lesbar: false, meldung: r.fehler };
    var lx = Number(feld.loesung[0]), ly = Number(feld.loesung[1]);
    var gelesen = '(' + f.zahl(r.x) + ' | ' + f.zahl(r.y) + ')';
    var okx = gleichZahl(r.x, lx, vgl(feld)), oky = gleichZahl(r.y, ly, vgl(feld));
    if (okx && oky) return { ok: true, gelesen: gelesen };
    var ts = feld.typisch || [];
    for (var i = 0; i < ts.length; i++) {
      if (gleichZahl(r.x, Number(ts[i].wert[0]), vgl(feld)) && gleichZahl(r.y, Number(ts[i].wert[1]), vgl(feld)))
        return { ok: false, meldung: ts[i].text, gelesen: gelesen };
    }
    if (!(lx === ly) && gleichZahl(r.x, ly, vgl(feld)) && gleichZahl(r.y, lx, vgl(feld)))
      return { ok: false, meldung: 'Hast du x und y vertauscht? Zuerst kommt die x-Koordinate, dann die y-Koordinate.', gelesen: gelesen };
    if (okx) return { ok: false, meldung: 'Die x-Koordinate stimmt. Prüf die y-Koordinate noch einmal.', gelesen: gelesen };
    if (oky) {
      if (lx !== 0 && gleichZahl(-r.x, lx, vgl(feld))) return { ok: false, meldung: 'Die y-Koordinate stimmt, bei der x-Koordinate ist das Vorzeichen falsch.', gelesen: gelesen };
      return { ok: false, meldung: 'Die y-Koordinate stimmt. Prüf die x-Koordinate noch einmal.', gelesen: gelesen };
    }
    return { ok: false, gelesen: gelesen };
  }

  function mengeGleich(a, b, stellen) {
    if (a.length !== b.length) return false;
    var as = a.slice().sort(function (p, q) { return p - q; });
    var bs = b.slice().sort(function (p, q) { return p - q; });
    for (var i = 0; i < as.length; i++) if (!gleichZahl(as[i], bs[i], stellen)) return false;
    return true;
  }
  function enthaelt(menge, w, stellen) {
    return menge.some(function (m) { return gleichZahl(w, m, stellen); });
  }
  function mengeText(werte) {
    if (!werte.length) return 'keine Lösung';
    return werte.map(function (w) { return f.zahl(w); }).join('; ');
  }
  function pruefeMenge(feld, eingabe) {
    var r = parse.menge(eingabe);
    if (r.fehler) return { lesbar: false, meldung: r.fehler };
    var l = feld.loesung.map(Number), w = r.werte;
    var gelesen = mengeText(w);
    if (mengeGleich(w, l, vgl(feld))) return { ok: true, gelesen: gelesen };
    // Komma als Trenner gemeint? z. B. "0,13" für 0 und 13
    if (/,/.test(eingabe)) {
      var alsListe = parse.menge(String(eingabe).replace(/,/g, ';'));
      if (!alsListe.fehler && mengeGleich(alsListe.werte, l, vgl(feld)))
        return { ok: false, fast: true, meldung: 'Meinst du ' + mengeText(alsListe.werte) + '? Trenne die Lösungen mit einem Semikolon, z. B. 0; 13. Ein Komma ohne Leerzeichen lese ich als Dezimalkomma.', gelesen: gelesen };
    }
    var ts = feld.typisch || [];
    for (var i = 0; i < ts.length; i++) {
      if (mengeGleich(w, ts[i].wert.map(Number), vgl(feld))) return { ok: false, meldung: ts[i].text, gelesen: gelesen };
    }
    if (feld.wurzel && feld.runden === undefined && mengeGleich(w, l, 1))
      return { ok: false, fast: true, meldung: 'Die Werte passen ungefähr. Gefragt ist hier die exakte Lösung mit Wurzel, z. B. $1 + \\sqrt{5}$ (Taste √).', gelesen: gelesen };
    if (!l.length) return { ok: false, meldung: 'Mach die Probe: Passt deine Zahl wirklich? Überleg, ob es überhaupt eine Lösung gibt.', gelesen: gelesen };
    if (!w.length) return { ok: false, meldung: 'Die Gleichung hat Lösungen. Rechne noch einmal nach.', gelesen: gelesen };
    var alleRichtig = w.every(function (x) { return enthaelt(l, x, vgl(feld)); });
    if (alleRichtig && w.length < l.length) return { ok: false, meldung: 'Was du hast, stimmt. Es fehlt aber noch eine Lösung.', gelesen: gelesen };
    var einigeRichtig = w.some(function (x) { return enthaelt(l, x, vgl(feld)); });
    if (einigeRichtig) return { ok: false, meldung: 'Eine deiner Zahlen stimmt, mindestens eine nicht. Mach die Probe durch Einsetzen.', gelesen: gelesen };
    return { ok: false, gelesen: gelesen };
  }

  function pruefeTerm(feld, eingabe) {
    var r = parse.term(eingabe);
    if (r.fehler) return { lesbar: false, meldung: r.fehler };
    if (feld.mitX !== false && !parse.enthaeltX(r.baum)) return { lesbar: false, meldung: 'Im Term fehlt das x.' };
    var fn = function (x) { return parse.auswerten(r.baum, x); };
    var gelesen = null;
    // Offene Aufgaben: mehrere richtige Antworten, geprüft über eine Bedingung an die Koeffizienten
    if (feld.bedingung) {
      var kb = koeffizienten(fn);
      if (!kb) return { ok: false, meldung: 'Das ist kein quadratischer Term.' };
      var b = feld.bedingung(kb);
      if (b.ok && feld.form && !hatForm(eingabe, feld.form))
        return { ok: false, fast: true, meldung: 'Deine Parabel passt. Gib sie aber in der ' + FORMEN[feld.form].name + ' an.' };
      return b;
    }
    var soll = alsFunktion(feld.loesung);
    if (termGleich(fn, soll)) {
      if (feld.form && !hatForm(eingabe, feld.form))
        return { ok: false, fast: true, meldung: 'Rechnerisch stimmt dein Term. Gefragt ist aber die ' + FORMEN[feld.form].name + '.' };
      return { ok: true };
    }
    var ts = feld.typisch || [];
    for (var i = 0; i < ts.length; i++) {
      if (termGleich(fn, alsFunktion(ts[i].wert))) return { ok: false, meldung: ts[i].text };
    }
    // Welche Teile stimmen? (nur bei quadratischen Termen sinnvoll)
    var ki = koeffizienten(fn), ks = koeffizienten(soll);
    if (ki && ks && ki[2] !== 0 && ks[2] !== 0 && feld.form === 'spf') {
      var ai = ki[2], di = -ki[1] / (2 * ai), ei = ki[0] - ai * di * di;
      var as = ks[2], ds = -ks[1] / (2 * as), es = ks[0] - as * ds * ds;
      var okA = nahe(ai, as, 1e-7), okD = nahe(di, ds, 1e-7), okE = nahe(ei, es, 1e-7);
      if (okD && okE && !okA) return { ok: false, meldung: nahe(ai, -as, 1e-7) ? 'Der Scheitelpunkt stimmt. Aber die Öffnung nicht: Prüf das Vorzeichen von $a$.' : 'Der Scheitelpunkt stimmt. Der Streckfaktor $a$ noch nicht.' };
      if (okA && !okD && nahe(di, -ds, 1e-7)) return { ok: false, meldung: 'Verschiebung in x-Richtung: falsches Vorzeichen. Bei $(x - 2)^2$ liegt der Scheitelpunkt bei $x = 2$, bei $(x + 2)^2$ bei $x = -2$.' };
      if (okA && okD && !okE) return { ok: false, meldung: 'Streckfaktor und Verschiebung in x-Richtung stimmen. Die Verschiebung in y-Richtung $e$ noch nicht.' };
      if (okA && !okD && okE) return { ok: false, meldung: 'Streckfaktor und $e$ stimmen. Die Verschiebung in x-Richtung $d$ noch nicht.' };
      if (!okA && okD && !okE) return { ok: false, meldung: 'Die x-Koordinate des Scheitelpunkts stimmt. Prüf $a$ und $e$.' };
    }
    if (ki && ks && feld.form !== 'spf' && feld.form !== 'fakt') {
      var namen = ['die Zahl ohne x', 'das Glied mit x', 'das Glied mit x²'];
      var richtig = [], falsch = [];
      for (var k = 2; k >= 0; k--) (nahe(ki[k], ks[k], 1e-7) ? richtig : falsch).push(namen[k]);
      if (richtig.length && falsch.length)
        return { ok: false, meldung: 'Teilweise richtig: ' + richtig.join(' und ') + ' stimmt. Nicht passend: ' + falsch.join(' und ') + '.' };
    }
    return { ok: false, gelesen: gelesen };
  }

  /* Mehrere Punkte (z. B. Schnittpunkte), Reihenfolge egal */
  function pruefePunkte(feld, eingabe) {
    var r = parse.punkte(eingabe);
    var soll = feld.loesung.map(function (p) { return [Number(p[0]), Number(p[1])]; });
    var xs = soll.map(function (p) { return p[0]; });
    if (r.nurZahlen) {
      if (mengeGleich(r.nurZahlen, xs, vgl(feld)))
        return { ok: false, meldung: 'Das sind nur die x-Werte der Schnittpunkte. Gesucht sind Punkte: Setz jeden x-Wert in eine der Funktionen ein und gib $(x|y)$ an.', gelesen: mengeText(r.nurZahlen) };
      return { lesbar: false, meldung: 'Gesucht sind Punkte. Schreib jeden Punkt in Klammern, z. B. (−2|3); (4|3).' };
    }
    if (r.fehler) return { lesbar: false, meldung: r.fehler };
    var ist = r.punkte;
    var gelesen = ist.length ? ist.map(function (p) { return '(' + f.zahl(p.x) + ' | ' + f.zahl(p.y) + ')'; }).join('; ') : 'keine';
    var v = vgl(feld);
    function passt(p, q) { return gleichZahl(p.x, q[0], v) && gleichZahl(p.y, q[1], v); }
    var alleTreffen = ist.every(function (p) { return soll.some(function (q) { return passt(p, q); }); });
    if (alleTreffen && ist.length === soll.length) return { ok: true, gelesen: gelesen };
    var ts = feld.typisch || [];
    for (var i = 0; i < ts.length; i++) {
      var t = ts[i].wert;
      if (t.length === ist.length && ist.every(function (p) { return t.some(function (q) { return passt(p, [Number(q[0]), Number(q[1])]); }); }))
        return { ok: false, meldung: ts[i].text, gelesen: gelesen };
    }
    if (!soll.length) return { ok: false, meldung: 'Prüf, ob es überhaupt Schnittpunkte gibt: Hat die Gleichung nach dem Gleichsetzen Lösungen?', gelesen: gelesen };
    if (!ist.length) return { ok: false, meldung: 'Es gibt Schnittpunkte. Rechne noch einmal nach.', gelesen: gelesen };
    if (alleTreffen) return { ok: false, meldung: 'Was du hast, stimmt. Es fehlt aber noch ein Schnittpunkt.', gelesen: gelesen };
    var xRichtig = ist.length === soll.length && ist.every(function (p) { return xs.some(function (x) { return gleichZahl(p.x, x, v); }); });
    if (xRichtig) return { ok: false, meldung: 'Die x-Werte stimmen. Prüf die y-Werte: Setz x in $f$ oder $g$ ein.', gelesen: gelesen };
    return { ok: false, gelesen: gelesen };
  }

  function pruefeMc(feld, wahl) {
    if (wahl === null || wahl === undefined) return { lesbar: false, meldung: 'Wähle eine Antwort aus.' };
    if (wahl === feld.loesung) return { ok: true };
    var opt = feld.optionen[wahl];
    return { ok: false, meldung: (opt && opt.warum) || null };
  }

  function pruefe(feld, eingabe) {
    switch (feld.art) {
      case 'zahl': return pruefeZahl(feld, eingabe);
      case 'punkt': return pruefePunkt(feld, eingabe);
      case 'menge': return pruefeMenge(feld, eingabe);
      case 'punkte': return pruefePunkte(feld, eingabe);
      case 'term': return pruefeTerm(feld, eingabe);
      case 'mc': return pruefeMc(feld, eingabe);
    }
    throw new Error('Unbekannte Feldart: ' + feld.art);
  }

  M.pruefe = pruefe;
  M.pruefen = {
    termGleich: termGleich, alsFunktion: alsFunktion, hatForm: hatForm, koeffizienten: koeffizienten,
    gleichZahl: gleichZahl, mengeGleich: mengeGleich
  };
})(typeof window !== 'undefined' ? window : globalThis);
