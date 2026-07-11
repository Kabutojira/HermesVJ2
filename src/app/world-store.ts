import { create } from 'zustand';
import { chapterMap, chapters } from '../worlds/registry';

interface WorldState {
  activeChapterId: string;
  pulse: number;
  setActiveChapter: (id: string) => void;
  triggerPulse: () => void;
}

export const useWorldStore = create<WorldState>((set) => ({
  activeChapterId: chapters[0].id,
  pulse: 0,
  setActiveChapter: (id) => set({ activeChapterId: id }),
  triggerPulse: () => set((state) => ({ pulse: state.pulse + 1 })),
}));

export const selectActiveChapter = (id: string) => chapterMap[id] ?? chapterMap[chapters[0].id];
