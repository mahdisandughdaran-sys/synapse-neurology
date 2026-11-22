import { chapters } from "./index";
import { leaves1 } from "./leaves-1";
import { leaves2 } from "./leaves-2";
import { leaves3 } from "./leaves-3";
import { leaves4 } from "./leaves-4";
import type { Leaf } from "./leaves-types";

export type { Leaf };

export const leaves: Leaf[] = [...leaves1, ...leaves2, ...leaves3, ...leaves4];

export function pageOfChapter(chapterId: string) {
  const index = leaves.findIndex((leaf) => leaf.chapterId === chapterId);
  return index < 0 ? 1 : index + 1;
}

export function chapterOfPage(page: number) {
  const leaf = leaves[page - 1];
  if (!leaf) return undefined;
  return chapters.find((chapter) => chapter.id === leaf.chapterId);
}

export function pagesOf(chapterId: string) {
  return leaves.flatMap((leaf, index) =>
    leaf.chapterId === chapterId ? [{ leaf, page: index + 1 }] : [],
  );
}
