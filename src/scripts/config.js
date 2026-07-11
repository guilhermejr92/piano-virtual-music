export const notes = [
  { key: "a", note: "C4", type: "white" },
  { key: "w", note: "C#4", type: "black" },
  { key: "s", note: "D4", type: "white" },
  { key: "e", note: "D#4", type: "black" },
  { key: "d", note: "E4", type: "white" },
  { key: "f", note: "F4", type: "white" },
  { key: "t", note: "F#4", type: "black" },
  { key: "g", note: "G4", type: "white" },
  { key: "y", note: "G#4", type: "black" },
  { key: "h", note: "A4", type: "white" },
  { key: "u", note: "A#4", type: "black" },
  { key: "j", note: "B4", type: "white" },
  { key: "k", note: "C5", type: "white" },
  { key: "o", note: "C#5", type: "black" },
  { key: "l", note: "D5", type: "white" },
  { key: "p", note: "D#5", type: "black" },
  { key: ";", note: "E5", type: "white" },
];

const n = (key, duration = 420) => ({ key, duration });

export const songs = {
  twinkle: {
    title: "Brilha, Brilha Estrelinha",
    notes: [
      n("a"), n("a"), n("g"), n("g"), n("h"), n("h"), n("g", 760),
      n("f"), n("f"), n("d"), n("d"), n("s"), n("s"), n("a", 760),
      n("g"), n("g"), n("f"), n("f"), n("d"), n("d"), n("s", 760),
      n("g"), n("g"), n("f"), n("f"), n("d"), n("d"), n("s", 760),
      n("a"), n("a"), n("g"), n("g"), n("h"), n("h"), n("g", 760),
      n("f"), n("f"), n("d"), n("d"), n("s"), n("s"), n("a", 900),
    ],
  },
  odeToJoy: {
    title: "Ode à Alegria",
    notes: [
      n("d"), n("d"), n("f"), n("g"), n("g"), n("f"), n("d"), n("s"),
      n("a"), n("a"), n("s"), n("d"), n("d", 620), n("s", 220), n("s", 720),
      n("d"), n("d"), n("f"), n("g"), n("g"), n("f"), n("d"), n("s"),
      n("a"), n("a"), n("s"), n("d"), n("s", 620), n("a", 220), n("a", 720),
    ],
  },
};
