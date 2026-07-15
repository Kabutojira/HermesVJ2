import type { CameraPreset } from '../../../experience/camera/cameraPresets';

const cameraPreset: CameraPreset = { position: [0, 5.4, 16.5], target: [0.2, 2.8, -0.8], fov: 48 };

export const deepSpaceConvergenceConfig = {
  id: 'chapter-019-deep-space-convergence',
  title: 'Deep-Space Convergence',
  description: 'A fast pulsar sweeps past a distant quasar while a small spacecraft crosses the charged gulf between them.',
  palette: ['#030713', '#75e8ff', '#ad95ff', '#fff0b0'],
  movementMode: 'guided' as const,
  qualityHint: 'high' as const,
  cameraPreset,
  previewImage: '/social-preview.svg',
  createdAt: '2026-07-14T19:30:00Z',
  moodPrompt: 'deep-space convergence, compact pulsar lighthouse, distant quasar jets, ceremonial spacecraft crossing sparse stars',
};
