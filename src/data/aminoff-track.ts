import type { Chapter } from "./types";
import { aminoffAcute } from "./aminoff-acute";
import { aminoffExam } from "./aminoff-exam";
import { aminoffMethod } from "./aminoff-method";

/**
 * Independent study track for the opening clinical method:
 * history, examination, investigations, coma, and the start of confusional states.
 * Original teaching text. Not a reproduction of any textbook.
 */
export const aminoffChapters: Chapter[] = [...aminoffMethod, ...aminoffExam, ...aminoffAcute];

export function getAminoff(id: string) {
  return aminoffChapters.find((c) => c.id === id);
}
