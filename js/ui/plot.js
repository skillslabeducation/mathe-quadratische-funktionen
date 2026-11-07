/* Koordinatensystem als SVG. Kästchen sind quadratisch, Achsen mit Pfeilen, Beschriftung im Buchstil. */
(function (root) {
  var M = root.M;
  M.ui = M.ui || {};

  var FARBEN = ['#1f5fbf', '#d0452f', '#2e8b57', '#8a4fbf'];

  /* spec: { x:[min,max], y:[min,max], breite?:px, kurven:[{fn, farbe?, strich?, name?}], punkte:[{x,y,name?,farbe?}],
             schritt?: Beschriftung jede n-te Einheit } */
  function plot(spec) {
    var xmin = spec.x[0], xmax = spec.x[1], ymin = spec.y[0], ymax = spec.y[1];
    var einheit = spec.einheit || Math.max(14, Math.min(34, Math.floor((spec.breite || 340) / (xmax - xmin))));
    var rand = 16;
    var B = (xmax - xmin) * einheit + 2 * rand, H = (ymax - ymin) * einheit + 2 * rand;
    function X(x) { return rand + (x - xmin) * einheit; }
    function Y(y) { return rand + (ymax - y) * einheit; }
    var s = [];
    s.push('<svg class="plot" viewBox="0 0 ' + B + ' ' + H + '" width="' + B + '" height="' + H + '" role="img" aria-label="' + (spec.titel || 'Koordinatensystem') + '"' +
      ' data-xmin="' + xmin + '" data-ymax="' + ymax + '" data-einheit="' + einheit + '" data-rand="' + rand + '">');
    // Gitter
    s.push('<g class="gitter">');
    for (var gx = Math.ceil(xmin); gx <= xmax; gx++) s.push('<line x1="' + X(gx) + '" y1="' + Y(ymin) + '" x2="' + X(gx) + '" y2="' + Y(ymax) + '"/>');
    for (var gy = Math.ceil(ymin); gy <= ymax; gy++) s.push('<line x1="' + X(xmin) + '" y1="' + Y(gy) + '" x2="' + X(xmax) + '" y2="' + Y(gy) + '"/>');
    s.push('</g>');
    // Achsen
    var schritt = spec.schritt || ((xmax - xmin) > 14 || (ymax - ymin) > 14 ? 2 : 1);
    s.push('<g class="achsen">');
    if (ymin <= 0 && ymax >= 0) {
      s.push('<line x1="' + X(xmin) + '" y1="' + Y(0) + '" x2="' + (X(xmax) + 8) + '" y2="' + Y(0) + '"/>');
      s.push('<path d="M' + (X(xmax) + 10) + ' ' + Y(0) + ' l-8 -4 v8 z" class="pfeil"/>');
      s.push('<text x="' + (X(xmax) + 4) + '" y="' + (Y(0) + 16) + '" class="achsname">x</text>');
      for (var tx = Math.ceil(xmin); tx < xmax; tx++) {
        if (tx === 0 || tx % schritt) continue;
        s.push('<line x1="' + X(tx) + '" y1="' + (Y(0) - 3) + '" x2="' + X(tx) + '" y2="' + (Y(0) + 3) + '"/>');
        s.push('<text x="' + X(tx) + '" y="' + (Y(0) + 14) + '" text-anchor="middle">' + (tx < 0 ? '−' + (-tx) : tx) + '</text>');
      }
    }
    if (xmin <= 0 && xmax >= 0) {
      s.push('<line x1="' + X(0) + '" y1="' + Y(ymin) + '" x2="' + X(0) + '" y2="' + (Y(ymax) - 8) + '"/>');
      s.push('<path d="M' + X(0) + ' ' + (Y(ymax) - 10) + ' l-4 8 h8 z" class="pfeil"/>');
      s.push('<text x="' + (X(0) + 8) + '" y="' + (Y(ymax) - 2) + '" class="achsname">y</text>');
      for (var ty = Math.ceil(ymin); ty < ymax; ty++) {
        if (ty === 0 || ty % schritt) continue;
        s.push('<line x1="' + (X(0) - 3) + '" y1="' + Y(ty) + '" x2="' + (X(0) + 3) + '" y2="' + Y(ty) + '"/>');
        s.push('<text x="' + (X(0) - 6) + '" y="' + (Y(ty) + 4) + '" text-anchor="end">' + (ty < 0 ? '−' + (-ty) : ty) + '</text>');
      }
    }
    s.push('</g>');
    // Kurven
    s.push('<defs><clipPath id="clip' + (plot.n = (plot.n || 0) + 1) + '"><rect x="' + X(xmin) + '" y="' + Y(ymax) + '" width="' + (X(xmax) - X(xmin)) + '" height="' + (Y(ymin) - Y(ymax)) + '"/></clipPath></defs>');
    var clip = 'clip' + plot.n;
    (spec.kurven || []).forEach(function (k, i) {
      var d = [], schritte = 240, offen = false;
      for (var j = 0; j <= schritte; j++) {
        var x = xmin + (xmax - xmin) * j / schritte, y = k.fn(x);
        if (!isFinite(y) || y > ymax + 50 || y < ymin - 50) { offen = false; continue; }
        d.push((offen ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(y).toFixed(1));
        offen = true;
      }
      var farbe = k.farbe || FARBEN[i % FARBEN.length];
      s.push('<path clip-path="url(#' + clip + ')" d="' + d.join(' ') + '" fill="none" stroke="' + farbe + '" stroke-width="' + (k.dicke || 2.4) + '"' +
        (k.strich ? ' stroke-dasharray="6 5"' : '') + ' stroke-linecap="round"/>');
      if (k.name) {
        var nx = k.nameX !== undefined ? k.nameX : xmax - 1, ny = k.fn(nx);
        if (isFinite(ny) && ny < ymax && ny > ymin) s.push('<text x="' + (X(nx) + 4) + '" y="' + (Y(ny) - 6) + '" class="kname" fill="' + farbe + '">' + k.name + '</text>');
      }
    });
    // Punkte
    (spec.punkte || []).forEach(function (p) {
      if (p.x < xmin || p.x > xmax || p.y < ymin || p.y > ymax) return;
      var farbe = p.farbe || '#222';
      s.push('<circle cx="' + X(p.x) + '" cy="' + Y(p.y) + '" r="4" fill="' + farbe + '"/>');
      if (p.name) s.push('<text x="' + (X(p.x) + 7) + '" y="' + (Y(p.y) - 7) + '" class="pname">' + p.name + '</text>');
    });
    s.push('</svg>');
    return s.join('');
  }

  /* Passenden Ausschnitt für eine Parabel mit Scheitel (d|e) finden */
  function fensterFuer(d, e, a) {
    var xmin = Math.min(-2, Math.floor(d) - 4), xmax = Math.max(2, Math.ceil(d) + 4);
    var ymin, ymax;
    if (a > 0) { ymin = Math.min(-2, Math.floor(e) - 2); ymax = Math.max(ymin + 9, 3); }
    else { ymax = Math.max(2, Math.ceil(e) + 2); ymin = Math.min(ymax - 9, -3); }
    return { x: [xmin, xmax], y: [ymin, ymax] };
  }

  M.ui.plot = plot;
  M.ui.fensterFuer = fensterFuer;
  M.ui.FARBEN = FARBEN;
})(typeof window !== 'undefined' ? window : globalThis);
