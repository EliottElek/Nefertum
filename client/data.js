export const questions = [
  {
    attribute: "FamilleConnu",
    label: "Connais-tu un membre de la famille de ton personnage ?",
  },
  {
    attribute: "EstEnfant",
    label: "Votre personnage est t-il un enfant ?",
  },
  {
    attribute: "EstHumain",
    label: "Votre personnage est t-il un humain ?",
  },
  {
    attribute: "CheveuxChatain",
    label: "Votre personnage as t-il les cheveux châtains ?",
  },
  {
    attribute: "CheveuxBlond",
    label: "Votre personnage as t-il les cheveux blonds ?",
  },
  {
    attribute: "PorteAccessoireTete",
    label: "Votre personnage porte t-il un accessoire sur la tête ?",
  },
  {
    attribute: "EnClasseDeCM1",
    label: "Votre personnage est t-il en classe de CM1 ?",
  },
  {
    attribute: "RapportAvecEcole",
    label: "Votre personnage as t-il un rapport avec l'école de South-Park ?",
  },
  {
    attribute: "ADesEnfants",
    label: "Votre personnage as t-il des un ou plusieurs enfants ?",
  },
  {
    attribute: "EstEnfantUnique",
    label: "Votre personnage est t-il enfant unique ?",
  },
  {
    attribute: "PorteLunette",
    label: "Votre personnage porte t-il des lunettes ?",
  },
  {
    attribute: "EstUnGarcon",
    label: "Votre personnage est-il un garcon ?",
  },
  {
    attribute: "EstPersonnagePrincipal",
    label: "Votre personnage est-il un personnage principal ?",
  },
  {
    attribute: "PossedePouvoir",
    label: "Votre personnage possède t-il un pouvoir ?",
  },
  {
    attribute: "PorteHabitBleu",
    label: "Votre personnage porte t-il un habit de couleur bleu ?",
  },
  {
    attribute: "RelationHomosexuelle",
    label: "Votre personnage as t-il des relations homosexuelles ?",
  },
  {
    attribute: "CheveuxLong",
    label: "Votre personnage as t-il des cheveux longs ?",
  },
  {
    attribute: "EstHandicape",
    label: "Votre personnage est-il handicape physique ou mentale ?",
  },
  {
    attribute: "EstMechant",
    label: "Votre personnage est-il de nature méchante ?",
  },
  {
    attribute: "PresentSaison1",
    label: "Votre personnage est-il présent dans la saison 1 ?",
  },
  {
    attribute: "OrigineAmericaine",
    label: "Votre personnage est-il d'origine Américaine ?",
  },
];
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
  { label: "Yes", weight: 0 },
  { label: "Probably", weight: 1 },
  { label: "I don't know", weight: 2 },
  { label: "Probably not", weight: 3 },
  { label: "No", weight: 4 },
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
// const questions = [
//     {
//       title: "Votre odeur vient-elle de la forêt ?",
//       possibleAnswers: [
//         { label: "Oui", weight: 1 },
//         { label: "Je ne sais pas", weight: 0.5 },
//         { label: "Non", weight: 0 },
//       ],
//     },
//     {
//       title: "Votre odeur est-elle acide ?",
//       possibleAnswers: [
//         { label: "Très acide", weight: 1 },
//         { label: "Acide", weight: 0.75 },
//         { label: "Je ne sais pas", weight: 0.5 },
//         { label: "Pas très acide", weight: 0.25 },
//         { label: "Pas du tout acide", weight: 0 },
//       ],
//     },
//     {
//       title: "Votre odeur vient-elle de la forêt ?",
//       possibleAnswers: [
//         { label: "Oui", weight: 1 },
//         { label: "Je ne sais pas", weight: 0.5 },
//         { label: "Non", weight: 0 },
//       ],
//     },
//     {
//       title: "Votre odeur est-elle agréable ?",
//       possibleAnswers: [
//         { label: "Oui", weight: 1 },
//         { label: "Je ne sais pas", weight: 0.5 },
//         { label: "Non", weight: 0 },
//       ],
//     },
//   ];
