import type { WorldChapter } from '../../registry';
import { lotusGateConfig } from './config';
import { LotusGateWorld } from './scene/LotusGateWorld';

export const chapter001LotusGate: WorldChapter = {
  ...lotusGateConfig,
  component: LotusGateWorld,
  interactionModel: {
    primaryAction: 'Click to send a pulse through the gate halo.',
    ambientResponse: 'Petals drift and the orbital halo breathes around the gate.',
  },
};
