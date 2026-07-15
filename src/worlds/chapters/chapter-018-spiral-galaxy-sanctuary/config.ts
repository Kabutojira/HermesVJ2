import type { CameraPreset } from '../../../experience/camera/cameraPresets';

const cameraPreset: CameraPreset = { position: [0, 7.5, 17.5], target: [0, 2.2, 0], fov: 47 };

export const spiralGalaxyConfig = {
  id: 'chapter-018-spiral-galaxy-sanctuary',
  title: 'Spiral Galaxy Sanctuary',
  description: 'A many-colored spiral congregation turns slowly around a radiant galactic heart.',
  palette: ['#03050f', '#fff1c2', '#8bdcff', '#d39aff'],
  movementMode: 'orbit' as const,
  qualityHint: 'high' as const,
  cameraPreset,
  previewImage: '/social-preview.svg',
  createdAt: '2026-07-14T20:18:00Z',
  moodPrompt: 'deep spiral galaxy, dense layered stars, ceremonial rotation, cyan violet and warm white light',
};
