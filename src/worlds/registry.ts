import type { CameraPreset } from '../experience/camera/cameraPresets';
import type { QualityTier } from '../lib/performance';
import type { MovementMode } from './shared/biomeTypes';
import type { InteractionModel } from './shared/interactionTypes';
import { lazy, type ComponentType } from 'react';
import { lotusGateConfig } from './chapters/chapter-001-lotus-gate/config';
import { wormholeSpireConfig } from './chapters/chapter-002-wormhole-spire/config';

export interface WorldSceneProps {
  pulse: number;
  qualityTier: QualityTier;
  reducedMotion: boolean;
}

export interface WorldChapter {
  id: string;
  title: string;
  description: string;
  palette: string[];
  movementMode: MovementMode;
  qualityHint: QualityTier;
  cameraPreset: CameraPreset;
  interactionModel: InteractionModel;
  moodPrompt: string;
  createdAt: string;
  previewImage: string;
  component: ComponentType<WorldSceneProps>;
}

const LotusGateWorld = lazy(() => import('./chapters/chapter-001-lotus-gate/scene/LotusGateWorld').then((module) => ({ default: module.LotusGateWorld })));
const WormholeSpireWorld = lazy(() => import('./chapters/chapter-002-wormhole-spire/scene/WormholeSpireWorld').then((module) => ({ default: module.WormholeSpireWorld })));

export const chapters: WorldChapter[] = [
  { ...lotusGateConfig, component: LotusGateWorld, interactionModel: { primaryAction: 'Click to send a pulse through the gate halo.', ambientResponse: 'Petals drift and the orbital halo breathes around the gate.' } },
  { ...wormholeSpireConfig, component: WormholeSpireWorld, interactionModel: { primaryAction: 'Click to energize the wormhole spire.', ambientResponse: 'The field bends around the central signal.' } },
];
export const chapterMap = Object.fromEntries(chapters.map((chapter) => [chapter.id, chapter])) as Record<string, WorldChapter>;
