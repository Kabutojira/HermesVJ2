import type { WorldChapter } from '../../registry';

export const glassGalleryConfig = {
  id: 'chapter-027-glass-gallery',
  title: 'Vitreous Salon',
  description: 'A faceted glass pavilion rests inside a quiet stone salon, shaped by architectural light, soft shadow, and controlled room reflections.',
  palette: ['#090b10', '#f2e6cf', '#2d3035', '#9fd5db'],
  movementMode: 'orbit',
  qualityHint: 'high',
  cameraPreset: { position: [10.5, 4.7, 12], target: [0, 2.5, 0], fov: 39 },
  createdAt: '2026-07-16T15:22:00Z',
  moodPrompt: 'luxury glass gallery, sculptural pavilion, warm architectural lighting, PBR glass, soft shadows, no water',
  previewImage: '/social-preview.svg',
} satisfies Omit<WorldChapter, 'component' | 'interactionModel'>;
