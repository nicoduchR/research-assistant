interface ThesisQuestionSeed {
  code: string;
  section: string;
  title: string;
  questionText: string;
  targetReferences: string[];
}

export const THESIS_QUESTION_SEED: ThesisQuestionSeed[] = [
  {
    code: 'Q1',
    section: 'S1',
    title: 'Definir la transformation digitale',
    questionText:
      "Qu'est-ce que la transformation digitale ? En quoi se distingue-t-elle de la numerisation (digitization) et de la digitalisation (digitalization) ?",
    targetReferences: ['Vial (2019)', 'Bharadwaj et al. (2013)'],
  },
  {
    code: 'Q2',
    section: 'S1',
    title: 'Dimensions de la transformation digitale',
    questionText:
      "Quelles sont les dimensions constitutives de la transformation digitale (technologique, organisationnelle, culturelle, strategique) et comment s'articulent-elles ?",
    targetReferences: ['Matt et al. (2015)', 'Hess et al. (2016)'],
  },
  {
    code: 'Q3',
    section: 'S1',
    title: 'Cadres theoriques SI',
    questionText:
      'Quels sont les principaux cadres theoriques mobilises en SI pour analyser la transformation digitale ? Quelles sont leurs forces et limites respectives ?',
    targetReferences: [
      'Baskerville et al. (2020)',
      'Vial (2019)',
      'Weill & Woerner (2018)',
    ],
  },
  {
    code: 'Q4',
    section: 'S2',
    title: 'Technologies leviers en milieu industriel',
    questionText:
      'Quelles technologies caracterisent la transformation digitale en milieu industriel (IoT, analytics, IA, cloud, plateformes) et comment reconfigurent-elles les processus ?',
    targetReferences: ['Higgins & Clark (2013)', 'Yoo et al. (2010)'],
  },
  {
    code: 'Q5',
    section: 'S2',
    title: 'Industrie 4.0 et diffusion',
    questionText:
      "Qu'est-ce que l'Industrie 4.0 et comment s'inscrit-il dans la transformation digitale des ecosystemes industriels ? Quelle en est la maturite de diffusion ?",
    targetReferences: ['Schwab (2016)', "Rogers - diffusion de l'innovation"],
  },
  {
    code: 'Q6',
    section: 'S2',
    title: 'Pratiques de travail et routines',
    questionText:
      'Comment les outils digitaux reconfigurent-ils concretement les pratiques de travail, les interactions et les routines organisationnelles ?',
    targetReferences: ['Orlikowski (2000)', 'Delaunay (2024)'],
  },
  {
    code: 'Q7',
    section: 'S3',
    title: 'Effets sur les structures organisationnelles',
    questionText:
      'Quels sont les effets de la transformation digitale sur les structures organisationnelles (hierarchies, frontieres, repartition des pouvoirs, nouveaux roles) ?',
    targetReferences: ['Leclercq-Vandelannoitte & Isaac (2013)', 'Tran (2014)'],
  },
  {
    code: 'Q8',
    section: 'S3',
    title: 'Tensions rationalisation-autonomie',
    questionText:
      "Comment la transformation digitale genere-t-elle des tensions entre injonction de rationalisation et injonction d'autonomie dans les organisations industrielles ?",
    targetReferences: ['Delaunay (2024)', 'Dery (2007)'],
  },
  {
    code: 'Q9',
    section: 'S3',
    title: "Succes, echec et appropriation",
    questionText:
      "Quels sont les facteurs de succes et d'echec des projets de transformation digitale en contexte industriel ? Quelles conditions permettent une appropriation reelle ?",
    targetReferences: ['De Vaujany (2006)', 'Desanctis & Poole (1994)'],
  },
  {
    code: 'Q10',
    section: 'S4',
    title: 'Transformation digitale et nature de la connaissance',
    questionText:
      'Dans quelle mesure la transformation digitale modifie-t-elle la nature de la connaissance produite et mobilisee en organisation (granularite, tracabilite, desincarnation) ?',
    targetReferences: ['Baskerville et al. (2020)', 'Kallinikos (2013)'],
  },
  {
    code: 'Q11',
    section: 'S4',
    title: 'Mediation instrumentale',
    questionText:
      "Comment les outils digitaux mediatisent-ils les interactions et la creation de connaissance collective ? Qu'apporte la notion de mediation instrumentale ?",
    targetReferences: ['Rabardel (1995)', 'Delaunay (2024)'],
  },
  {
    code: 'Q12',
    section: 'S4',
    title: 'Digital-enabled knowledge sharing',
    questionText:
      "Qu'est-ce que le digital-enabled knowledge sharing ? Quelles en sont les conditions d'emergence et les limites (surcharge, solitude sociale, rejet) ?",
    targetReferences: [
      'Maruping & Magni (2012)',
      'Maruping & Magni (2015)',
      'Leclercq-Vandelannoitte & Bertin (2018)',
    ],
  },
];
