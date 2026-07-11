import type { CameraPreset } from '../experience/camera/cameraPresets';
import type { MovementMode } from './shared/biomeTypes';
import type { InteractionModel } from './shared/interactionTypes';
import { chapter001LotusGate } from './chapters/chapter-001-lotus-gate';
import { chapter002WormholeSpire } from './chapters/chapter-002-wormhole-spire';

export interface WorldChapter {
  id: string;
  title: string;
  description: string;
  palette: string[];
  movementMode: MovementMode;
  qualityHint: 'low' | 'medium' | 'high';
  cameraPreset: CameraPreset;
  interactionModel: InteractionModel;
  moodPrompt: string;
  createdAt: string;
  previewImage: string;
  component: React.ComponentType<{ pulse: number }>;
}

export const chapters: WorldChapter[] = [chapter001LotusGate, chapter002WormholeSpire];
export const chapterMap = Object.fromEntries(chapters.map((chapter) => [chapter.id, chapter])) as Record<string, WorldChapter>;
