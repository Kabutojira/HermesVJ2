import { cameraPresets } from '../../../experience/camera/cameraPresets';
import { palettes } from '../../shared/palette';

export const lotusGateConfig = {
  id: 'chapter-001-lotus-gate',
  title: 'Lotus Gate',
  description: 'A mirror lake cradles a ceremonial gate, suspended petals, and a soft orbital halo that reacts to your clicks.',
  palette: palettes.lotus,
  movementMode: 'orbit' as const,
  qualityHint: 'medium' as const,
  cameraPreset: cameraPresets.lotusGate,
  previewImage: '/social-preview.svg',
  createdAt: '2026-07-11T18:00:00Z',
  moodPrompt: 'moonlit lotus gate over reflective water, patient fog, ritual sci-fi calm',
};
