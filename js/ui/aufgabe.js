/* Aufgabenkarte: Anzeige, Eingabe, Prüfen, gestufte Hilfen. */
(function (root) {
  var M = root.M, ui = M.ui, doc = root.document;

  /* ---------- kleine Helfer ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function katex(t, display) {
    try { return root.katex.renderToString(t, { displayMode: !!display, throwOnError: false, strict: false }); }
    catch (e) { return '<code>' + esc(t) + '</code>'; }
  }
  /* Text mit $…$ (inline) und $$…$$ (abgesetzt) */
  function mathe(str) {
    if (str === undefined || str === null) return '';
    return String(str)
      .replace(/\$\$([\s\S]+?)\$\$/g, function (m, t) { return katex(t, true); })
      .replace(/\$([^$]+?)\$/g, function (m, t) { return katex(t, false); });
  }
  function el(html) { var d = doc.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }
  ui.esc = esc; ui.mathe = mathe; ui.katex = katex; ui.el = el;

  var LOB = ['Richtig.', 'Sitzt.', 'Stimmt genau.', 'Sauber gerechnet.', 'Genau so.'];
  var PLATZHALTER = {
    term: 'z. B. 2x^2 − 3x + 1',
    zahl: 'Zahl',
    punkt: 'z. B. (2|−8)',
    menge: 'z. B. 2; −3  oder  keine Lösung',
    punkte: 'z. B. (−2|3); (4|3)'
  };
  var feldZaehler = 0;

  /* ---------- Parabel mit Schiebereglern (für „Kurz erklärt“ und Aufgaben) ---------- */
  var A_WERTE = [-3, -2, -1.5, -1, -0.5, -0.25, 0.25, 0.5, 1, 1.5, 2, 3];
  function parabelRegler(container, opt) {
    opt = opt || {};
    var w = { a: opt.start ? opt.start.a : 1, d: opt.start ? opt.start.d : 0, e: opt.start ? opt.start.e : 0 };
    var id = 'r' + (++feldZaehler);
    container.innerHTML =
      '<div class="regler">' +
      '<div class="regler-plot"></div>' +
      '<div class="regler-steuer">' +
      '<label>a (Streckfaktor) <input type="range" min="0" max="' + (A_WERTE.length - 1) + '" step="1" data-k="a"> <output data-o="a"></output></label>' +
      '<label>d (Verschiebung in x-Richtung) <input type="range" min="-5" max="5" step="1" data-k="d"> <output data-o="d"></output></label>' +
      '<label>e (Verschiebung in y-Richtung) <input type="range" min="-5" max="5" step="1" data-k="e"> <output data-o="e"></output></label>' +
      '<div class="regler-gleichung"></div>' +
      '</div></div>';
    var plotEl = container.querySelector('.regler-plot');
    var gl = container.querySelector('.regler-gleichung');
    container.querySelector('[data-k=a]').value = A_WERTE.indexOf(w.a);
    container.querySelector('[data-k=d]').value = w.d;
    container.querySelector('[data-k=e]').value = w.e;
    function zeichnen() {
      var kurven = [];
      if (opt.ziel) kurven.push({ fn: function (x) { return opt.ziel.a * (x - opt.ziel.d) * (x - opt.ziel.d) + opt.ziel.e; }, farbe: '#9aa3ad', strich: true, dicke: 3 });
      if (opt.normal) kurven.push({ fn: function (x) { return x * x; }, farbe: '#c4c9cf', dicke: 1.6 });
      kurven.push({ fn: function (x) { return w.a * (x - w.d) * (x - w.d) + w.e; }, farbe: '#1f5fbf' });
      plotEl.innerHTML = ui.plot({ x: [-7, 7], y: [-6, 6], breite: 360, kurven: kurven, punkte: opt.ziel ? [] : [{ x: w.d, y: w.e, name: 'S', farbe: '#1f5fbf' }] });
      container.querySelector('[data-o=a]').textContent = M.f.zahl(w.a);
      container.querySelector('[data-o=d]').textContent = M.f.zahl(w.d);
      container.querySelector('[data-o=e]').textContent = M.f.zahl(w.e);
      if (!opt.ziel) {
        var art = Math.abs(w.a) > 1 ? 'gestreckt' : (Math.abs(w.a) < 1 ? 'gestaucht' : 'weder gestreckt noch gestaucht');
        gl.innerHTML = mathe('$f(x) = ' + M.t.spf(w.a, w.d, w.e) + '$') + '<br>' +
          mathe('Scheitelpunkt $' + M.t.punkt(w.d, w.e, 'S') + '$') + '<br>' +
          (w.a > 0 ? 'nach oben geöffnet' : 'nach unten geöffnet') + ', ' + art;
      } else {
        gl.innerHTML = mathe('$f(x) = ' + M.t.spf(w.a, w.d, w.e) + '$');
      }
      if (opt.onChange) opt.onChange(w);
    }
    container.querySelectorAll('input[type=range]').forEach(function (inp) {
      inp.addEventListener('input', function () {
        var k = inp.getAttribute('data-k');
        w[k] = k === 'a' ? A_WERTE[+inp.value] : +inp.value;
        zeichnen();
      });
    });
    zeichnen();
    return { werte: function () { return { a: w.a, d: w.d, e: w.e }; } };
  }
  ui.parabelRegler = parabelRegler;

  /* ---------- Vorschau der Eingabe ---------- */
  function vorschau(feld, wert) {
    if (!wert || !wert.trim()) return '';
    var p = M.parse, r;
    if (feld.art === 'term') {
      r = p.term(wert);
      return r.fehler ? '<span class="leise">' + esc(r.fehler) + '</span>' : 'Gelesen als: ' + katex(p.tex(r.baum));
    }
    if (feld.art === 'zahl') {
      r = p.zahl(wert);
      return r.fehler ? '<span class="leise">' + esc(r.fehler) + '</span>' : 'Gelesen als: ' + esc(M.f.zahl(r.wert));
    }
    if (feld.art === 'punkt') {
      r = p.punkt(wert);
      return r.fehler ? '<span class="leise">' + esc(r.fehler) + '</span>' : 'Gelesen als: ' + katex(M.t.punkt(r.x, r.y));
    }
    if (feld.art === 'menge') {
      r = p.menge(wert);
      if (r.fehler) return '<span class="leise">' + esc(r.fehler) + '</span>';
      if (!r.werte.length) return 'Gelesen als: keine Lösung';
      return 'Gelesen als: ' + katex(r.werte.map(function (v, i) { return 'x_' + (i + 1) + ' = ' + M.f.tex(v); }).join(';\\ '));
    }
    if (feld.art === 'punkte') {
      r = p.punkte(wert);
      if (r.fehler) return '<span class="leise">' + esc(r.fehler) + '</span>';
      if (r.nurZahlen) return '<span class="leise">Gesucht sind Punkte in Klammern, z. B. (−2|3).</span>';
      if (!r.punkte.length) return 'Gelesen als: keine Schnittpunkte';
      return 'Gelesen als: ' + katex(r.punkte.map(function (q, i) { return M.t.punkt(q.x, q.y, 'S_' + (i + 1)); }).join(';\\ '));
    }
    return '';
  }

  /* ---------- Aufgabenkarte ----------
     opt: { hilfen: bool, feedback: bool, onGeprueft(richtig, aufgabe), onNeu(), neuText } */
  function aufgabeAnzeigen(container, a, opt) {
    opt = opt || {};
    var hilfen = opt.hilfen !== false, feedback = opt.feedback !== false;
    var gezaehlt = false, wegGesehen = false, versuche = 0, genutzt = {}, start = Date.now();
    var h = [];
    h.push('<article class="karte aufgabe">');
    h.push('<div class="marken"><span class="marke stufe-' + a.stufe + '">' + M.STUFEN_NAME[a.stufe] + '</span>' +
      '<span class="marke tr ' + (a.tr ? 'mit' : 'ohne') + '">' + (a.tr ? 'mit Taschenrechner' : 'ohne Taschenrechner') + '</span>' +
      (a.quelle ? '<span class="marke quelle">' + esc(a.quelle) + '</span>' : '') + '</div>');
    h.push('<div class="frage">' + mathe(a.text) + '</div>');
    if (a.formel) h.push('<div class="formel">' + katex(a.formel, true) + '</div>');
    if (a.graph) h.push('<div class="graph">' + ui.plot(a.graph) + '</div>');
    h.push('<div class="felder"></div>');
    h.push('<div class="tasten" hidden>' +
      ['x', '²', '^', '√', '±', '|', '(', ')', '/', '−', ';'].map(function (t) {
        return '<button type="button" class="taste" data-t="' + t + '">' + t + '</button>';
      }).join('') + '</div>');
    h.push('<div class="aktionen"' + (opt.ohneAktionen ? ' hidden' : '') + '>');
    h.push('<button type="button" class="knopf haupt" data-a="pruefen">' + (opt.pruefText || 'Prüfen') + '</button>');
    if (hilfen) {
      if (a.tipps && a.tipps[0]) h.push('<button type="button" class="knopf" data-a="tipp1">Tipp 1</button>');
      if (a.tipps && a.tipps[1]) h.push('<button type="button" class="knopf" data-a="tipp2" disabled>Tipp 2</button>');
    }
    if ((hilfen || opt.ohneAktionen) && a.weg && a.weg.length) h.push('<button type="button" class="knopf" data-a="weg">Lösungsweg</button>');
    if (opt.onNeu) h.push('<button type="button" class="knopf leise-knopf" data-a="neu">' + (opt.neuText || 'Neue Aufgabe') + '</button>');
    h.push('</div>');
    h.push('<div class="rueckmeldung" aria-live="polite"></div>');
    h.push('<div class="hilfe" data-h="tipp1" hidden></div><div class="hilfe" data-h="tipp2" hidden></div>');
    h.push('<div class="hilfe weg" data-h="weg" hidden></div>');
    h.push('</article>');
    container.innerHTML = h.join('');
    var karte = container.firstElementChild;
    var felderEl = karte.querySelector('.felder');
    var tasten = karte.querySelector('.tasten');
    var letztesInput = null;
    var zustand = []; // je Feld: Funktion, die den Eingabewert liefert

    /* Felder aufbauen */
    a.felder.forEach(function (feld, i) {
      var fid = 'f' + (++feldZaehler);
      var box = el('<div class="feld" data-i="' + i + '"></div>');
      if (feld.label) box.appendChild(el('<div class="feld-label">' + mathe(feld.label) + '</div>'));
      if (feld.art === 'mc') {
        var auswahl = null;
        var liste = el('<div class="mc' + (feld.optionen.some(function (o) { return o.graph; }) ? ' mc-graph' : '') + '" role="radiogroup"></div>');
        feld.optionen.forEach(function (o, j) {
          var inhalt = o.graph ? ui.plot(o.graph) + (o.html ? '<div>' + mathe(o.html) + '</div>' : '') : mathe(o.html !== undefined ? o.html : '$' + o.tex + '$');
          var b = el('<button type="button" class="mc-option" role="radio" aria-checked="false"><span class="mc-buchstabe">' + 'ABCDEF'[j] + '</span><span class="mc-inhalt">' + inhalt + '</span></button>');
          b.addEventListener('click', function () {
            auswahl = j;
            liste.querySelectorAll('.mc-option').forEach(function (x) { x.classList.remove('gewaehlt'); x.setAttribute('aria-checked', 'false'); });
            b.classList.add('gewaehlt'); b.setAttribute('aria-checked', 'true');
          });
          liste.appendChild(b);
        });
        box.appendChild(liste);
        zustand.push(function () { return auswahl; });
      } else if (feld.art === 'tabelle') {
        var t = ['<table class="werte"><tr><th>' + mathe(feld.kopf ? feld.kopf[0] : '$x$') + '</th>'];
        feld.xs.forEach(function (x) { t.push('<td>' + esc(M.f.zahl(x)) + '</td>'); });
        t.push('</tr><tr><th>' + mathe(feld.kopf ? feld.kopf[1] : '$f(x)$') + '</th>');
        feld.xs.forEach(function (x, k) {
          var vorgabe = feld.vorgabe && feld.vorgabe[k] !== undefined && feld.vorgabe[k] !== null;
          t.push('<td>' + (vorgabe ? esc(M.f.zahl(feld.vorgabe[k])) : '<input type="text" inputmode="decimal" autocomplete="off" spellcheck="false" data-k="' + k + '" aria-label="Wert für x = ' + esc(M.f.zahl(x)) + '">') + '</td>');
        });
        t.push('</tr></table>');
        box.appendChild(el('<div class="tabelle-wrap">' + t.join('') + '</div>'));
        zustand.push(function () {
          var werte = [];
          box.querySelectorAll('input[data-k]').forEach(function (inp) { werte[+inp.getAttribute('data-k')] = inp.value; });
          return werte;
        });
      } else if (feld.art === 'klick') {
        // Punkt ins Koordinatensystem setzen
        var gesetzt = null, raster = feld.raster || 1;
        var kbox = el('<div class="klickflaeche">' + ui.plot(feld.graph) + '<div class="klick-info leise">Klick ins Koordinatensystem, um den Punkt zu setzen.</div></div>');
        box.appendChild(kbox);
        var svg = kbox.querySelector('svg'), info = kbox.querySelector('.klick-info');
        var NS = 'http://www.w3.org/2000/svg';
        svg.addEventListener('click', function (ev) {
          if (kbox.classList.contains('gesperrt')) return;
          var r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal, sk = r.width / vb.width;
          var sx = (ev.clientX - r.left) / sk, sy = (ev.clientY - r.top) / sk;
          var e = +svg.getAttribute('data-einheit'), rd = +svg.getAttribute('data-rand');
          var x = +svg.getAttribute('data-xmin') + (sx - rd) / e, y = +svg.getAttribute('data-ymax') - (sy - rd) / e;
          x = Math.round(x / raster) * raster; y = Math.round(y / raster) * raster;
          gesetzt = { x: x, y: y };
          var alt = svg.querySelector('.marker'); if (alt) alt.parentNode.removeChild(alt);
          var c = doc.createElementNS(NS, 'circle');
          c.setAttribute('class', 'marker'); c.setAttribute('r', '6');
          c.setAttribute('cx', rd + (x - +svg.getAttribute('data-xmin')) * e);
          c.setAttribute('cy', rd + (+svg.getAttribute('data-ymax') - y) * e);
          svg.appendChild(c);
          info.innerHTML = 'Gesetzt: ' + katex(M.t.punkt(x, y, feld.name || 'P'));
        });
        zustand.push(function () { return gesetzt; });
      } else if (feld.art === 'regler') {
        var rbox = el('<div></div>');
        box.appendChild(rbox);
        var regler = parabelRegler(rbox, { ziel: feld.ziel, start: feld.start || { a: 1, d: 0, e: 0 } });
        zustand.push(function () { return regler.werte(); });
      } else {
        var zeile = el('<div class="eingabezeile">' +
          (feld.vor ? '<span class="vor">' + mathe(feld.vor) + '</span>' : '') +
          '<input id="' + fid + '" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="' + esc(feld.platzhalter || PLATZHALTER[feld.art] || '') + '">' +
          (feld.nach ? '<span class="nach">' + mathe(feld.nach) + '</span>' : '') +
          (feld.art === 'menge' ? '<button type="button" class="knopf klein" data-keine="keine Lösung">keine Lösung</button>' : '') +
          (feld.art === 'punkte' ? '<button type="button" class="knopf klein" data-keine="keine Schnittpunkte">keine Schnittpunkte</button>' : '') +
          '</div>');
        box.appendChild(zeile);
        var vs = el('<div class="vorschau"></div>');
        box.appendChild(vs);
        var inp = zeile.querySelector('input');
        inp.addEventListener('input', function () { vs.innerHTML = vorschau(feld, inp.value); });
        var keine = zeile.querySelector('[data-keine]');
        if (keine) keine.addEventListener('click', function () { inp.value = keine.getAttribute('data-keine'); vs.innerHTML = vorschau(feld, inp.value); inp.focus(); });
        zustand.push(function () { return inp.value; });
      }
      box.appendChild(el('<div class="feld-rueck"></div>'));
      felderEl.appendChild(box);
    });

    /* Eingabetasten: erscheinen, sobald ein Textfeld aktiv ist */
    karte.addEventListener('focusin', function (ev) {
      if (ev.target.tagName === 'INPUT' && ev.target.type === 'text') { letztesInput = ev.target; tasten.hidden = false; }
    });
    tasten.addEventListener('mousedown', function (ev) { ev.preventDefault(); }); // Fokus behalten
    tasten.addEventListener('click', function (ev) {
      var b = ev.target.closest('.taste');
      if (!b || !letztesInput) return;
      var t = b.getAttribute('data-t');
      var s = letztesInput.selectionStart || letztesInput.value.length, e = letztesInput.selectionEnd || s;
      letztesInput.value = letztesInput.value.slice(0, s) + t + letztesInput.value.slice(e);
      letztesInput.selectionStart = letztesInput.selectionEnd = s + t.length;
      letztesInput.focus();
      letztesInput.dispatchEvent(new Event('input'));
    });
    karte.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' && ev.target.tagName === 'INPUT') { ev.preventDefault(); if (!opt.ohneAktionen) pruefen(); }
    });

    /* Prüfen */
    function pruefeFeld(feld, wert) {
      if (feld.art === 'tabelle') {
        var alle = true, lesbar = true, meldungen = [];
        feld.xs.forEach(function (x, k) {
          if (feld.vorgabe && feld.vorgabe[k] !== undefined && feld.vorgabe[k] !== null) return;
          var r = M.pruefe({ art: 'zahl', loesung: feld.loesung[k], runden: feld.runden, typisch: feld.typisch ? feld.typisch[k] : undefined }, wert[k] || '');
          if (r.lesbar === false) { lesbar = false; meldungen.push('Bei x = ' + M.f.zahl(x) + ': ' + r.meldung); }
          else if (!r.ok) { alle = false; meldungen.push('Bei x = ' + M.f.zahl(x) + ' stimmt der Wert noch nicht.' + (r.meldung ? ' ' + r.meldung : '')); }
        });
        if (!lesbar) return { lesbar: false, meldung: meldungen.join(' ') };
        return { ok: alle, meldung: meldungen.join(' ') };
      }
      if (feld.art === 'klick') {
        if (!wert) return { lesbar: false, meldung: 'Klick in das Koordinatensystem, um den Punkt zu setzen.' };
        return M.pruefe({ art: 'punkt', loesung: feld.loesung, typisch: feld.typisch }, '(' + wert.x + '|' + wert.y + ')');
      }
      if (feld.art === 'regler') {
        var z = feld.ziel;
        if (wert.a === z.a && wert.d === z.d && wert.e === z.e) return { ok: true };
        var m = [];
        if (wert.d !== z.d) m.push(wert.d === -z.d ? 'Die Verschiebung in x-Richtung hat das falsche Vorzeichen. Bei (x − 2)² wandert die Parabel nach rechts.' : 'Die Verschiebung in x-Richtung passt noch nicht.');
        if (wert.e !== z.e) m.push('Die Verschiebung in y-Richtung passt noch nicht.');
        if (wert.a !== z.a) m.push(wert.a === -z.a ? 'Die Öffnung stimmt nicht: Das Vorzeichen von a entscheidet, ob die Parabel nach oben oder unten geöffnet ist.' : 'Die Form passt noch nicht: Prüf den Streckfaktor a, z. B. mit einem Schritt vom Scheitelpunkt aus.');
        return { ok: false, meldung: m.join(' ') };
      }
      return M.pruefe(feld, wert);
    }

    function pruefen() {
      var ergebnisse = a.felder.map(function (feld, i) { return pruefeFeld(feld, zustand[i]()); });
      var unlesbar = ergebnisse.some(function (r) { return r.lesbar === false; });
      var fast = ergebnisse.some(function (r) { return r.fast; });
      var richtig = ergebnisse.every(function (r) { return r.ok; });
      if (!unlesbar && !fast) versuche++;

      if (feedback) {
        a.felder.forEach(function (feld, i) {
          var r = ergebnisse[i], box = felderEl.children[i], rk = box.querySelector('.feld-rueck');
          box.classList.remove('richtig', 'falsch', 'unklar');
          var txt = '';
          if (r.lesbar === false) { box.classList.add('unklar'); txt = r.meldung; }
          else if (r.ok) { box.classList.add('richtig'); txt = a.felder.length > 1 ? 'Richtig.' : ''; }
          else if (r.fast) { box.classList.add('unklar'); txt = r.meldung; }
          else { box.classList.add('falsch'); txt = r.meldung || (a.felder.length > 1 ? 'Stimmt noch nicht.' : ''); }
          // Parser-Meldungen können Zeichen aus der Eingabe enthalten, daher escapen; eigene Meldungen dürfen $TeX$ enthalten
          rk.innerHTML = txt ? (r.lesbar === false ? esc(txt) : mathe(txt)) : '';
        });
        var rm = karte.querySelector('.rueckmeldung');
        if (unlesbar || fast) {
          rm.className = 'rueckmeldung hinweis';
          rm.innerHTML = unlesbar ? 'Ich konnte nicht alles lesen. Schau dir die markierten Felder an.' : 'Fast geschafft, nur die Form passt noch nicht.';
        } else if (richtig) {
          rm.className = 'rueckmeldung gut';
          var lob = LOB[Math.floor(Math.random() * LOB.length)];
          var serie = opt.serie ? opt.serie() + (gezaehlt ? 0 : 1) : 0;
          rm.innerHTML = '<strong>' + lob + '</strong>' + (serie >= 3 && !wegGesehen ? ' Stark, ' + serie + '. richtige in Folge.' : '') +
            (wegGesehen ? ' Mit Lösungsweg nachvollzogen. Die nächste schaffst du allein.' : '');
        } else {
          rm.className = 'rueckmeldung schlecht';
          var tippHinweis = hilfen ? (versuche >= 2 && a.weg ? ' Schau dir den Lösungsweg Schritt für Schritt an.' : (a.tipps ? ' Ein Tipp hilft dir weiter.' : '')) : '';
          rm.innerHTML = '<strong>Noch nicht.</strong>' + tippHinweis +
            (a.grundlage && M.bereiche[a.grundlage] && hilfen ? ' <a href="#/b/' + a.grundlage + '">Grundlage auffrischen: ' + esc(M.bereiche[a.grundlage].titel) + '</a>' : '');
        }
      }
      if (!unlesbar && !fast && !gezaehlt) {
        gezaehlt = true;
        if (opt.onGeprueft) opt.onGeprueft(richtig && !wegGesehen, a);
        if (opt.protokoll !== false && M.protokoll) M.protokoll.aufgabe(a, richtig && !wegGesehen, { tipp1: genutzt.tipp1, tipp2: genutzt.tipp2, weg: wegGesehen, sek: Math.round((Date.now() - start) / 1000) });
      }
      return { richtig: richtig, unlesbar: unlesbar, fast: fast, ergebnisse: ergebnisse };
    }

    /* Hilfen */
    function zeigeHilfe(name) {
      genutzt[name] = true;
      var box = karte.querySelector('[data-h=' + name + ']');
      if (name === 'tipp1') box.innerHTML = '<strong>Tipp 1:</strong> ' + mathe(a.tipps[0]);
      if (name === 'tipp2') box.innerHTML = '<strong>Tipp 2:</strong> ' + mathe(a.tipps[1]);
      box.hidden = false;
    }
    var wegSchritt = 0;
    function zeigeWeg(alle) {
      var box = karte.querySelector('[data-h=weg]');
      wegGesehen = true;
      if (alle) wegSchritt = a.weg.length; else wegSchritt = Math.min(a.weg.length, wegSchritt + 1);
      var h = ['<strong>Lösungsweg</strong><ol class="schritte">'];
      for (var i = 0; i < wegSchritt; i++) {
        var s = a.weg[i];
        h.push('<li>' + (s.text ? '<div class="schritt-text">' + mathe(s.text) + '</div>' : '') + (s.tex ? '<div class="schritt-formel">' + katex(s.tex, true) + '</div>' : '') + '</li>');
      }
      h.push('</ol>');
      if (wegSchritt < a.weg.length) h.push('<div class="weg-knoepfe"><button type="button" class="knopf klein" data-w="weiter">Nächster Schritt</button> <button type="button" class="knopf klein leise-knopf" data-w="alle">Alle Schritte zeigen</button></div>');
      if (a.grundlage && M.bereiche[a.grundlage]) h.push('<p class="leise">Unsicher bei einem Schritt? <a href="#/b/' + a.grundlage + '">Grundlage auffrischen: ' + esc(M.bereiche[a.grundlage].titel) + '</a></p>');
      box.innerHTML = h.join('');
      box.hidden = false;
    }
    karte.querySelector('.aktionen').addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-a]');
      if (!b) return;
      var akt = b.getAttribute('data-a');
      if (akt === 'pruefen') pruefen();
      if (akt === 'tipp1') { zeigeHilfe('tipp1'); var t2 = karte.querySelector('[data-a=tipp2]'); if (t2) t2.disabled = false; }
      if (akt === 'tipp2') zeigeHilfe('tipp2');
      if (akt === 'weg') zeigeWeg(false);
      if (akt === 'neu' && opt.onNeu) opt.onNeu();
    });
    karte.querySelector('[data-h=weg]').addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-w]');
      if (b) zeigeWeg(b.getAttribute('data-w') === 'alle');
    });

    var erstes = karte.querySelector('.felder input[type=text]');
    if (erstes && opt.fokus !== false) setTimeout(function () { try { erstes.focus({ preventScroll: true }); } catch (e) { erstes.focus(); } }, 30);

    /* Prüfungsmodus: nach der Abgabe Rückmeldung zeigen und den Lösungsweg freigeben */
    function freigeben() {
      feedback = true;
      var r = pruefen();
      if (r.unlesbar) {
        var rmf = karte.querySelector('.rueckmeldung');
        rmf.className = 'rueckmeldung hinweis';
        rmf.innerHTML = 'Nicht vollständig bearbeitet. Schau dir den Lösungsweg an.';
      }
      var akt = karte.querySelector('.aktionen');
      akt.hidden = false;
      akt.querySelectorAll('[data-a]').forEach(function (b) { if (b.getAttribute('data-a') !== 'weg') b.hidden = true; });
      karte.querySelectorAll('input, .mc-option, .knopf[data-keine]').forEach(function (e) { e.disabled = true; });
      karte.querySelectorAll('.klickflaeche').forEach(function (k) { k.classList.add('gesperrt'); });
      tasten.hidden = true;
      return r;
    }
    /* Prüfungsmodus: Punkte je Feld berechnen, ohne etwas anzuzeigen */
    function auswerten() {
      return a.felder.map(function (feld, i) { return pruefeFeld(feld, zustand[i]()); });
    }

    return { pruefen: pruefen, karte: karte, freigeben: freigeben, auswerten: auswerten };
  }
  ui.aufgabeAnzeigen = aufgabeAnzeigen;
})(window);
