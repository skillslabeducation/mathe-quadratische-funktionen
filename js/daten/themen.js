/* Themen laut Themenzettel (Klassenarbeit „Quadratische Funktionen und Gleichungen“). */
(function (root) {
  var M = root.M;
  M.GRUNDLAGEN = ['rechenregeln', 'klammern', 'binome', 'umstellen'];
  M.THEMEN = [
    { id: 'thema-01', nr: 1, titel: 'Die quadratische Funktion',
      kurz: 'Funktionsgleichung, Tabelle und Graph. Quadratisch, linear oder keins von beiden?',
      quellen: ['Buch S. 75: Basiswissen, Beispiel A, Nr. 4, Beispiel B', 'Buch S. 76: Nr. 5', 'Arbeitsheft S. 31: Nr. 1, 2', 'Check-up Nr. 1'] },
    { id: 'thema-02', nr: 2, titel: 'Parabeln: Graphen quadratischer Funktionen',
      kurz: 'Nullstellen, Scheitelpunkt, Symmetrieachse, Öffnung.',
      quellen: ['Buch S. 77: Basiswissen, Beispiel C, Nr. 11, 12', 'Check-up Nr. 3'] },
    { id: 'thema-03', nr: 3, titel: 'Normalparabel',
      kurz: 'Strecken, spiegeln, verschieben. Die Scheitelpunktform.',
      quellen: ['Buch S. 79: Basiswissen, Beispiel A', 'Buch S. 80: Beispiel B, Nr. 3, 4, 5, 8', 'Buch S. 81: Nr. 10, 11', 'Arbeitsheft S. 32, 33, 34', 'Check-up Nr. 4–7, 13'] },
    { id: 'thema-04', nr: 4, titel: 'Darstellungsformen der Funktionsgleichung',
      kurz: 'Scheitelpunktform, allgemeine Form, faktorisierte Form. Umwandeln und quadratische Ergänzung.',
      quellen: ['Buch S. 83: Basiswissen, Beispiele A und B', 'Buch S. 84: Nr. 4, 5, 7a–d, 8, 9', 'Buch S. 85: Basiswissen, Nr. 10, 11, 12', 'Arbeitsheft S. 35–38', 'Check-up Nr. 2, 3, 8'] },
    { id: 'thema-05', nr: 5, titel: 'Bestimmung mithilfe besonderer Punkte',
      kurz: 'Aus Scheitelpunkt, Nullstellen oder Punkten die Funktionsgleichung bestimmen.',
      quellen: ['Buch S. 87: Basiswissen mit drei Beispielen', 'Buch S. 88: Nr. 5a–d, 6, 7, 8, 9', 'Arbeitsheft S. 39, 40', 'Check-up Nr. 9–12'] },
    { id: 'thema-06', nr: 6, titel: 'Gleichungen grafisch lösen',
      kurz: 'Lösungen am Graphen ablesen.',
      quellen: ['Buch S. 91: Basiswissen, Beispiel A, Nr. 3', 'Buch S. 92: Nr. 5, 6, 7', 'Arbeitsheft S. 41', 'Check-up Nr. 14'] },
    { id: 'thema-07', nr: 7, titel: 'Gleichungen algebraisch lösen',
      kurz: 'Einfache quadratische Gleichungen, pq-Formel, „Produkt = 0“-Regel.',
      quellen: ['Buch S. 94: Basiswissen, Beispiel A, Nr. 4', 'Buch S. 95: Nr. 5, 6', 'Buch S. 96: Basiswissen, Beispiel D, Nr. 11', 'Buch S. 97: Nr. 12, 13, 17 mit Beispiel', 'Arbeitsheft S. 42, 43', 'Check-up Nr. 15–18'] },
    { id: 'thema-08', nr: 8, titel: 'Schnittpunkte von zwei Graphen rechnerisch bestimmen',
      kurz: 'Gleichsetzen, lösen, y-Werte berechnen.',
      quellen: ['Buch S. 103: Basiswissen, Nr. 8', 'Check-up Nr. 24–26'] },
    { id: 'thema-09', nr: 9, titel: 'Typische Fragen an Funktionen',
      kurz: 'Funktionswerte, x-Werte, größter und kleinster Wert, Achsenschnittpunkte.',
      quellen: ['Buch S. 101: Basiswissen', 'Buch S. 102: Nr. 2–6', 'Buch S. 103: Nr. 9, 10', 'Buch S. 76: Nr. 6, 7, 9', 'Arbeitsheft S. 46', 'Check-up Nr. 20–23'] },
    { id: 'thema-10', nr: 10, titel: 'Problemlösen',
      kurz: 'Sachaufgaben mit quadratischen Funktionen.',
      quellen: ['Buch S. 105: Basiswissen, Beispiel A', 'Buch S. 106: Nr. 4, 5, 6, 7, 9', 'Buch S. 107: Nr. 11–14', 'Arbeitsheft S. 45'] }
  ];
  M.WEITERUEBEN = {
    arbeitsheft: 'Arbeitsheft S. 31, 32, 33, 34 (Nr. 1–3), 35, 36 (Nr. 1–4), 37 (Nr. 1–3), 38, 39, 40, 41, 42 (Nr. 1–3), 43 (Nr. 1–3), 45, 46',
    checkup: 'Buch Check-up S. 108, 109, 110 (Nr. 14–16), 111 (Nr. 20–26), Lösungen S. 249–252'
  };
})(typeof window !== 'undefined' ? window : globalThis);
