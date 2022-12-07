export const Responses = {
  yes: 0,
  probably: 1,
  idk: 2,
  probablynot: 3,
  no: 4,
  replay: "replay",
  goback: "goback",
};

export const ResponsesDisplay = [
  { label: "Yes", weight: 1 },
  // { label: "Probably", weight: 1 },
  // { label: "I don't know", weight: 2 },
  // { label: "Probably not", weight: 3 },
  { label: "No", weight: 0 },
];

export const ColorArray = [
  "#58B26C",
  "#f76352",
  "#419895",
  "#446DAB",
  "#B1B325",
];

export const ScoringValueMatrice = [
  [3, 1, -1, -2, -3],
  [1, 3, 1, -1, -2],
  [-1, 1, 3, 1, -1],
  [-2, -1, 1, 3, 1],
  [-3, -2, -1, 1, 3],
];
