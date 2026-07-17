import type { WorldChapter } from '../../registry';

export const mountainLakeConfig = {
  id: 'chapter-028-golden-mountain-lake',
  title: 'Aureate Divide',
  description: 'A calm alpine lake leads toward a split granite summit as the low sun warms snow, stone, and a single reflective water surface.',
  palette: ['#101921', '#f6c879', '#24434b', '#dce7e4'],
  movementMode: 'orbit',
  qualityHint: 'high',
  cameraPreset: { position: [8.5, 3.4, 13.8], target: [0, 2.7, -5.5], fov: 46 },
  createdAt: '2026-07-16T15:21:00Z',
  moodPrompt: 'mountain lake at golden hour, split alpine peak, calm reflective water, believable low sun and atmospheric ridges',
  previewImage: '/social-preview.svg',
} satisfies Omit<WorldChapter, 'component' | 'interactionModel'>;
