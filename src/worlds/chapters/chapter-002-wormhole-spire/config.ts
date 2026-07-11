import { cameraPresets } from '../../../experience/camera/cameraPresets';
import { palettes } from '../../shared/palette';

export const wormholeSpireConfig = {
  id: 'chapter-002-wormhole-spire',
  title: 'Wormhole Spire',
  description: 'A suspended observatory-spire channels a wormhole ribbon into the sky while debris and light threads circle its core.',
  palette: palettes.wormhole,
  movementMode: 'guided' as const,
  qualityHint: 'high' as const,
  cameraPreset: cameraPresets.wormholeSpire,
  previewImage: '/social-preview.svg',
  createdAt: '2026-07-11T18:10:00Z',
  moodPrompt: 'golden wormhole spire over still dark water, celestial debris, solemn sci-fi ritual',
};
