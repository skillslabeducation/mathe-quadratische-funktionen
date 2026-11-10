/* Seite „Wiederholungsblatt“: alle 15 Aufgaben vom Blatt der Lehrerin,
   jeweils mit den Zahlen vom Blatt (zum Kontrollieren) und mit neuen Zahlen (zum Üben). */
(function (root) {
  var M = root.M, ui = M.ui, doc = root.document;
  var esc = ui.esc;
  var z = new M.Zufall();
  var SCHLUESSEL = 'mathe9-wiederholung-v1';

  function geloest() { try { return JSON.parse(root.localStorage.getItem(SCHLUESSEL) || '{}'); } catch (e) { return {}; } }
  function merke(nr, art) {
    var d = geloest(); d[nr] = d[nr] || {}; d[nr][art] = true;
    try { root.localStorage.setItem(SCHLUESSEL, JSON.stringify(d)); } catch (e) { /* egal */ }
  }

  M.wiederholungSeite = function (app) {
    doc.title = 'Wiederholungsblatt · Mathearbeit Quadratische Funktionen';
    var stand = geloest();
    var h = ['<nav class="kopfnav"><a href="#/" class="zurueck">← Übersicht</a></nav>',
      '<header class="seitenkopf"><p class="kicker">Von deiner Lehrerin</p><h1>Wiederholungsblatt</h1>',
      '<p class="unterzeile">Diese 15 Aufgabentypen hat deine Lehrerin zur Vorbereitung ausgeteilt. So ähnlich kommt es sehr wahrscheinlich in der Arbeit.</p>',
      '<div class="papier-hinweis"><strong>So gehst du vor:</strong> 1. Rechne das Blatt auf Papier. 2. Mit <strong>„Blatt prüfen“</strong> kontrollierst du deine Ergebnisse. Wenn etwas nicht stimmt, helfen Tipps und Lösungsweg. 3. Mit <strong>„Neue Zahlen“</strong> übst du jede Aufgabe so oft, bis sie sitzt.</div></header>',
      '<ol class="wb-liste">'];
    M.WIEDERHOLUNG.forEach(function (w) {
      var s = stand[w.nr] || {};
      h.push('<li class="wb-zeile" data-nr="' + w.nr + '"><div class="wb-kopf"><span class="wb-nr">' + w.nr + '</span><span class="wb-titel">' + esc(w.titel) + '</span>' +
        '<span class="wb-status">' + (s.original ? '<span class="marke stufe-basis">Blatt ✓</span>' : '') + (s.neu ? '<span class="marke stufe-standard">neu ✓</span>' : '') + '</span>' +
        '<span class="wb-knoepfe"><button type="button" class="knopf klein" data-art="original">Blatt prüfen</button><button type="button" class="knopf klein" data-art="neu">Neue Zahlen</button></span></div>' +
        '<div class="wb-platz"></div></li>');
    });
    h.push('</ol>');
    app.innerHTML = h.join('');

    var offen = null;
    app.querySelectorAll('.wb-zeile').forEach(function (zeile) {
      var nr = +zeile.getAttribute('data-nr'), w = M.WIEDERHOLUNG.filter(function (x) { return x.nr === nr; })[0];
      var platz = zeile.querySelector('.wb-platz');
      function zeigen(art) {
        if (offen && offen !== platz) offen.innerHTML = '';
        offen = platz;
        var a = w.gen(z, art === 'original');
        a.bereich = 'wiederholung'; a.stufe = 'standard';
        if (art === 'original') a.quelle = 'Zahlen vom Blatt';
        ui.aufgabeAnzeigen(platz, a, {
          onNeu: art === 'neu' ? function () { zeigen('neu'); } : null,
          neuText: 'Neue Zahlen',
          onGeprueft: function (richtig) {
            M.fortschritt.eintragen('wiederholung', art === 'original' ? 'basis' : 'standard', richtig);
            if (richtig) {
              merke(nr, art);
              var st = zeile.querySelector('.wb-status');
              if (st.innerHTML.indexOf(art === 'original' ? 'Blatt' : 'neu') < 0) st.innerHTML += art === 'original' ? '<span class="marke stufe-basis">Blatt ✓</span>' : '<span class="marke stufe-standard">neu ✓</span>';
            }
          }
        });
        platz.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      zeile.querySelectorAll('[data-art]').forEach(function (b) { b.addEventListener('click', function () { zeigen(b.getAttribute('data-art')); }); });
    });
  };
})(window);
