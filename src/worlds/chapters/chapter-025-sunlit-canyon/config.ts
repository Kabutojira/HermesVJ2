import type { CameraPreset } from '../../../experience/camera/cameraPresets';

const cameraPreset: CameraPreset = {
  position: [1.5, 6.5, 18.5],
  target: [0, 2.6, -14],
  fov: 46,
};

export const sunlitCanyonConfig = {
  id: 'chapter-025-sunlit-canyon',
  title: 'Sunlit Canyon',
  description: 'Late-morning sun reveals stratified sandstone, dry desert air, and a long passage through monumental canyon walls.',
  palette: ['#8f3f24', '#d9864c', '#e8b779', '#6d2f24'],
  movementMode: 'orbit' as const,
  qualityHint: 'medium' as const,
  cameraPreset,
  previewImage: '/social-preview.svg',
  createdAt: '2026-07-16T15:12:00Z',
  moodPrompt: 'Hyperreal sunlit desert canyon, layered red sandstone, dry atmospheric depth, natural tonal range',
};
