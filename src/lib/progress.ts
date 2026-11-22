import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Score = { at: number; correct: number; total: number; stamp?: string };

type ProgressState = {
  done: Record<string, boolean>;
  cards: Record<string, boolean>;
  cases: Record<string, boolean>;
  scores: Score[];
  leafSeen: Record<string, boolean>;
  bookmark: number;
  markChapter: (id: string, value: boolean) => void;
  markCard: (key: string, known: boolean) => void;
  markCase: (id: string) => void;
  addScore: (score: Score) => void;
  markLeaf: (key: string) => void;
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
      bookmark: 1,
      markChapter: (id, value) => set((s) => ({ done: { ...s.done, [id]: value } })),
      markCard: (key, known) => set((s) => ({ cards: { ...s.cards, [key]: known } })),
      markCase: (id) => set((s) => ({ cases: { ...s.cases, [id]: true } })),
      addScore: (score) => set((s) => ({ scores: [score, ...s.scores].slice(0, 12) })),
      markLeaf: (key) => set((s) => ({ leafSeen: { ...(s.leafSeen ?? {}), [key]: true } })),
      setBookmark: (page) => set((s) => (s.bookmark === page ? s : { bookmark: page })),
      reset: () => set({ done: {}, cards: {}, cases: {}, scores: [], leafSeen: {}, bookmark: 1 }),
    }),
    { name: "synapse-progress-v1", skipHydration: true },
  ),
);

export function cardKey(chapterId: string, index: number) {
  return `${chapterId}:${index}`;
}
