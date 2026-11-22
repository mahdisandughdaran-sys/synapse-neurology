import type { Chapter } from "./types";
import { chaptersA } from "./course-a";
import { chaptersB } from "./course-b";
import { chaptersC } from "./course-c";

export const chapters: Chapter[] = [...chaptersA, ...chaptersB, ...chaptersC];

export function getChapter(id: string) {
  return chapters.find((c) => c.id === id);
}

export function cardCount() {
  return chapters.reduce((n, c) => n + c.cards.length, 0);
}

export function questionCount() {
  return chapters.reduce((n, c) => n + c.quiz.length, 0);
}
