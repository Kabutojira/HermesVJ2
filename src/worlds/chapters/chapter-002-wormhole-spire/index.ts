import type { WorldChapter } from '../../registry';
import { wormholeSpireConfig } from './config';
import { WormholeSpireWorld } from './scene/WormholeSpireWorld';

export const chapter002WormholeSpire: WorldChapter = {
  ...wormholeSpireConfig,
  component: WormholeSpireWorld,
  interactionModel: {
    primaryAction: 'Click to intensify the spire pulse and debris shimmer.',
    ambientResponse: 'The ribbon corkscrews upward while debris drifts in measured rings.',
  },
};
