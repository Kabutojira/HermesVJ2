import { create } from 'zustand';

interface UiState {
  entered: boolean;
  immersive: boolean;
  audioEnabled: boolean;
  detailPanelOpen: boolean;
  enterWorld: () => void;
  toggleImmersive: () => void;
  toggleAudio: () => void;
  toggleDetailPanel: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  entered: false,
  immersive: false,
  audioEnabled: false,
  detailPanelOpen: true,
  enterWorld: () => set({ entered: true }),
  toggleImmersive: () => set((state) => ({ immersive: !state.immersive })),
  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
  toggleDetailPanel: () => set((state) => ({ detailPanelOpen: !state.detailPanelOpen })),
}));
