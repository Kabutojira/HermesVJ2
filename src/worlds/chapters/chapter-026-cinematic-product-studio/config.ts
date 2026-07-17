import type { CameraPreset } from '../../../experience/camera/cameraPresets';

const cameraPreset: CameraPreset = {
  position: [8.4, 5.6, 12.2],
  target: [0, 2.7, 0],
  fov: 38,
};

export const cinematicProductStudioConfig = {
  id: 'chapter-026-cinematic-product-studio',
  title: 'Monolith Studio',
  description: 'A sculpted metal monolith stands in a controlled charcoal studio, shaped by broad softboxes and measured floor highlights.',
  palette: ['#090b0f', '#b9c4cf', '#252b32', '#c58b58'],
  movementMode: 'orbit' as const,
  qualityHint: 'high' as const,
  cameraPreset,
  previewImage: '/social-preview.svg',
  createdAt: '2026-07-16T15:13:00Z',
  moodPrompt: 'Cinematic luxury product studio, procedural sculpted monolith, brushed metal, softbox highlights, restrained depth of field',
};
