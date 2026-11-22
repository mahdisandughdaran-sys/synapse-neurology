import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Score = { at: number; correct: number; total: number; stamp?: string };

type ProgressState = {
  done: Record<string, boolean>;
  cards: Record<string, boolean>;
  cases: Record<string, boolean>;
  scores: Score[];
  markChapter: (id: string, value: boolean) => void;
  markCard: (key: string, known: boolean) => void;
  markCase: (id: string) => void;
  addScore: (score: Score) => void;
  reset: () => void;
};

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      done: {},
      cards: {},
      cases: {},
      scores: [],
      markChapter: (id, value) =>
        set((s) => ({ done: { ...s.done, [id]: value } })),
      markCard: (key, known) =>
        set((s) => ({ cards: { ...s.cards, [key]: known } })),
      markCase: (id) => set((s) => ({ cases: { ...s.cases, [id]: true } })),
      addScore: (score) => set((s) => ({ scores: [score, ...s.scores].slice(0, 12) })),
      reset: () => set({ done: {}, cards: {}, cases: {}, scores: [] }),
    }),
    { name: "synapse-progress-v1", skipHydration: true },
  ),
);

export function cardKey(chapterId: string, index: number) {
  return `${chapterId}:${index}`;
}
