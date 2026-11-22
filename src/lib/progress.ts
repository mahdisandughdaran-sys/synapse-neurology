import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Score = { at: number; correct: number; total: number; stamp?: string };

type ProgressState = {
  done: Record<string, boolean>;
  cards: Record<string, boolean>;
  cases: Record<string, boolean>;
  scores: Score[];
  leafSeen: Record<string, boolean>;
  leafMiss: Record<string, boolean>;
  bookmark: number;
  markChapter: (id: string, value: boolean) => void;
  markCard: (key: string, known: boolean) => void;
  markCase: (id: string) => void;
  addScore: (score: Score) => void;
  markLeafResult: (key: string, correct: boolean) => void;
  setBookmark: (page: number) => void;
  reset: () => void;
};

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      done: {},
      cards: {},
      cases: {},
      scores: [],
      leafSeen: {},
      leafMiss: {},
      bookmark: 1,
      markChapter: (id, value) => set((s) => ({ done: { ...s.done, [id]: value } })),
      markCard: (key, known) => set((s) => ({ cards: { ...s.cards, [key]: known } })),
      markCase: (id) => set((s) => ({ cases: { ...s.cases, [id]: true } })),
      addScore: (score) => set((s) => ({ scores: [score, ...s.scores].slice(0, 12) })),
      markLeafResult: (key, correct) =>
        set((s) => {
          const leafMiss = { ...(s.leafMiss ?? {}) };
          if (correct) delete leafMiss[key];
          else leafMiss[key] = true;
          return {
            leafSeen: { ...(s.leafSeen ?? {}), [key]: true },
            leafMiss,
          };
        }),
      setBookmark: (page) => set((s) => (s.bookmark === page ? s : { bookmark: page })),
      reset: () =>
        set({ done: {}, cards: {}, cases: {}, scores: [], leafSeen: {}, leafMiss: {}, bookmark: 1 }),
    }),
    { name: "synapse-progress-v2", skipHydration: true },
  ),
);

export function cardKey(chapterId: string, index: number) {
  return `${chapterId}:${index}`;
}
