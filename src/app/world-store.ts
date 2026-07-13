import { create } from 'zustand';
import { chapterMap, chapters } from '../worlds/registry';

interface WorldState {
  activeChapterId: string;
  pulse: number;
  setActiveChapter: (id: string) => void;
  triggerPulse: () => void;
}

const initialChapterId = () => {
  if (typeof window === 'undefined') return chapters[0].id;
  const requested = new URLSearchParams(window.location.search).get('chapter');
  return requested && chapterMap[requested] ? requested : chapters[0].id;
};

export const useWorldStore = create<WorldState>((set) => ({
  activeChapterId: initialChapterId(),
  pulse: 0,
  setActiveChapter: (id) => set({ activeChapterId: chapterMap[id] ? id : chapters[0].id }),
  triggerPulse: () => set((state) => ({ pulse: state.pulse + 1 })),
}));

export const selectActiveChapter = (id: string) => chapterMap[id] ?? chapterMap[chapters[0].id];
