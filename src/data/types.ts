export type Section = { h: string; p: string };

export type Card = { q: string; a: string };

export type Question = {
  q: string;
  options: string[];
  answer: number;
  why: string;
};

export type Chapter = {
  id: string;
  n: number;
  title: string;
  en: string;
  blurb: string;
  minutes: number;
  sections: Section[];
  pearls: string[];
  flags: string[];
  cards: Card[];
  quiz: Question[];
};

export type NeuroCase = {
  id: string;
  title: string;
  tag: string;
  who: string;
  vignette: string;
  choices: string[];
  answer: number;
  why: string;
  teach: string[];
  chapterId: string;
};

export type Station = {
  id: string;
  title: string;
  doThis: string[];
  abnormal: string[];
  localizes: string;
};
