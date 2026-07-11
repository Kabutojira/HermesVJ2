import { create } from 'zustand';

interface UiState {
  entered: boolean;
  immersive: boolean;

  enterWorld: () => void;
  toggleImmersive: () => void;

}

export const useUiStore = create<UiState>((set) => ({
  entered: false,
  immersive: false,

  enterWorld: () => set({ entered: true }),
  toggleImmersive: () => set((state) => ({ immersive: !state.immersive })),

}));
