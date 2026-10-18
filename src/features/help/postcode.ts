/** The 16 German states, by their official abbreviations. */
export type Bundesland =
  | "BW" // Baden-Württemberg
  | "BY" // Bayern
  | "BE" // Berlin
  | "BB" // Brandenburg
  | "HB" // Bremen
  | "HH" // Hamburg
  | "HE" // Hessen
  | "MV" // Mecklenburg-Vorpommern
  | "NI" // Niedersachsen
  | "NW" // Nordrhein-Westfalen
  | "RP" // Rheinland-Pfalz
  | "SL" // Saarland
  | "SN" // Sachsen
  | "ST" // Sachsen-Anhalt
  | "SH" // Schleswig-Holstein
  | "TH"; // Thüringen

/** German postcodes: exactly five digits, 01001–99998. */
export function isValidPostcode(value: string): boolean {
  if (!/^\d{5}$/.test(value)) return false;
  const n = Number(value);
  return n >= 1001 && n <= 99998;
}

/** State of most postcodes in each two-digit zone (05, 11 and 62 are unused). */
const ZONE_DEFAULT: Record<string, Bundesland> = {
  "01": "SN", "02": "SN", "03": "BB", "04": "SN", "06": "ST", "07": "TH", "08": "SN", "09": "SN",
  "10": "BE", "12": "BE", "13": "BE", "14": "BB", "15": "BB", "16": "BB", "17": "MV", "18": "MV", "19": "MV",
  "20": "HH", "21": "NI", "22": "HH", "23": "SH", "24": "SH", "25": "SH", "26": "NI", "27": "NI", "28": "HB", "29": "NI",
  "30": "NI", "31": "NI", "32": "NW", "33": "NW", "34": "HE", "35": "HE", "36": "HE", "37": "NI", "38": "NI", "39": "ST",
  "40": "NW", "41": "NW", "42": "NW", "44": "NW", "45": "NW", "46": "NW", "47": "NW", "48": "NW", "49": "NI",
  "50": "NW", "51": "NW", "52": "NW", "53": "NW", "54": "RP", "55": "RP", "56": "RP", "57": "NW", "58": "NW", "59": "NW",
  "60": "HE", "61": "HE", "63": "HE", "64": "HE", "65": "HE", "66": "SL", "67": "RP", "68": "BW", "69": "BW",
  "70": "BW", "71": "BW", "72": "BW", "73": "BW", "74": "BW", "75": "BW", "76": "BW", "77": "BW", "78": "BW", "79": "BW",
  "80": "BY", "81": "BY", "82": "BY", "83": "BY", "84": "BY", "85": "BY", "86": "BY", "87": "BY", "88": "BW", "89": "BW",
  "90": "BY", "91": "BY", "92": "BY", "93": "BY", "94": "BY", "95": "BY", "96": "BY", "97": "BY", "98": "TH", "99": "TH",
};

/** Postcode ranges that cross a state border and belong to a different state than their zone default. */
const EXCEPTIONS: [from: number, to: number, state: Bundesland][] = [
  [1941, 1998, "BB"], // Senftenberg, Lauchhammer
  [4600, 4639, "TH"], // Altenburger Land
  [4895, 4938, "BB"], // Elbe-Elster
  [6556, 6578, "TH"], // Kyffhäuserkreis
  [7919, 7919, "SN"],
  [7952, 7952, "SN"],
  [7985, 7985, "SN"],
  [14000, 14199, "BE"], // Berlin south-west
  [17261, 17291, "BB"], // Uckermark
  [17326, 17337, "BB"],
  [19271, 19273, "NI"], // Amt Neuhaus
  [19309, 19357, "BB"], // Prignitz
  [21000, 21149, "HH"], // Bergedorf, Harburg
  [21450, 21529, "SH"], // Herzogtum Lauenburg, Stormarn
  [22800, 22999, "SH"], // Norderstedt, Wedel, Ahrensburg
  [23921, 23999, "MV"], // Nordwestmecklenburg, Wismar
  [27500, 27580, "HB"], // Bremerhaven
  [28780, 28879, "NI"], // Bremen surroundings
  [29410, 29416, "ST"], // Salzwedel
  [34346, 34355, "NI"], // Hann. Münden
  [34414, 34439, "NW"], // Warburg, Marsberg
  [36400, 36469, "TH"], // Wartburgkreis
  [37200, 37299, "HE"], // Werra-Meißner-Kreis
  [37300, 37359, "TH"], // Eichsfeld
  [37671, 37696, "NW"], // Höxter
  [38486, 38489, "ST"], // Klötze
  [38820, 38899, "ST"], // Harz
  [48455, 48531, "NI"], // Grafschaft Bentheim
  [49477, 49549, "NW"], // Tecklenburger Land
  [53401, 53579, "RP"], // Ahrweiler, Neuwied
  [57501, 57648, "RP"], // Altenkirchen, Westerwald
  [63739, 63939, "BY"], // Aschaffenburg, Miltenberg
  [65558, 65558, "RP"],
  [65582, 65582, "RP"], // Diez
  [65623, 65629, "RP"],
  [66480, 66509, "RP"], // Zweibrücken
  [66849, 66999, "RP"], // Kaiserslautern, Kusel, Pirmasens
  [68519, 68519, "HE"], // Viernheim
  [68623, 68649, "HE"], // Lampertheim, Bürstadt, Biblis
  [69239, 69239, "HE"], // Neckarsteinach
  [69434, 69434, "HE"], // Hirschhorn
  [69483, 69488, "HE"],
  [69509, 69518, "HE"],
  [88131, 88179, "BY"], // Lindau
  [89231, 89449, "BY"], // Neu-Ulm, Günzburg, Dillingen
  [96515, 96529, "TH"], // Sonneberg
  [97877, 97877, "BW"], // Wertheim
  [97896, 97900, "BW"],
  [97911, 97999, "BW"], // Main-Tauber-Kreis
];

/**
 * Best-effort state for a postcode. Postcode areas do not follow state borders, so this is
 * approximate near borders (single places can be wrong); it is only used to pick the state's
 * Verbraucherzentrale. Returns null for invalid or unassigned postcodes.
 */
export function bundeslandForPostcode(plz: string): Bundesland | null {
  if (!isValidPostcode(plz)) return null;
  const n = Number(plz);
  const exception = EXCEPTIONS.find(([from, to]) => n >= from && n <= to);
  if (exception) return exception[2];
  return ZONE_DEFAULT[plz.slice(0, 2)] ?? null;
}
