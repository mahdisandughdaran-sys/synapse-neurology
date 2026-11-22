export type Leaf = {
  chapterId: string;
  title: string;
  lead: string;
  body: string;
  note: string;
  q: string;
  options: [string, string, string];
  answer: 0 | 1 | 2;
  why: string;
};
