import type { CameraPreset } from '../experience/camera/cameraPresets';
import type { MovementMode } from './shared/biomeTypes';
import type { InteractionModel } from './shared/interactionTypes';
import { lazy } from 'react';
import { lotusGateConfig } from './chapters/chapter-001-lotus-gate/config';
import { wormholeSpireConfig } from './chapters/chapter-002-wormhole-spire/config';
import { prismOrchardConfig } from './chapters/chapter-003-prism-orchard/config';
import { solarChoirConfig } from './chapters/chapter-004-solar-choir/config';
import { tideCathedralConfig } from './chapters/chapter-005-tide-cathedral/config';
import { emberLoomConfig } from './chapters/chapter-006-ember-loom/config';
import { auroraReliquaryConfig } from './chapters/chapter-007-aurora-reliquary/config';

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

const LotusGateWorld = lazy(() => import('./chapters/chapter-001-lotus-gate/scene/LotusGateWorld').then((module) => ({ default: module.LotusGateWorld })));
const WormholeSpireWorld = lazy(() => import('./chapters/chapter-002-wormhole-spire/scene/WormholeSpireWorld').then((module) => ({ default: module.WormholeSpireWorld })));
const PrismOrchardWorld = lazy(() => import('./chapters/chapter-003-prism-orchard/scene/PrismOrchardWorld').then((module) => ({ default: module.PrismOrchardWorld })));
const SolarChoirWorld = lazy(() => import('./chapters/chapter-004-solar-choir/scene/SolarChoirWorld').then((module) => ({ default: module.SolarChoirWorld })));
const TideCathedralWorld = lazy(() => import('./chapters/chapter-005-tide-cathedral/scene/TideCathedralWorld').then((module) => ({ default: module.TideCathedralWorld })));
const EmberLoomWorld = lazy(() => import('./chapters/chapter-006-ember-loom/scene/EmberLoomWorld').then((module) => ({ default: module.EmberLoomWorld })));
const AuroraReliquaryWorld = lazy(() => import('./chapters/chapter-007-aurora-reliquary/scene/AuroraReliquaryWorld').then((module) => ({ default: module.AuroraReliquaryWorld })));

export const chapters: WorldChapter[] = [
  { ...lotusGateConfig, component: LotusGateWorld, interactionModel: { primaryAction: 'Click to send a pulse through the gate halo.', ambientResponse: 'Petals drift and the orbital halo breathes around the gate.' } },
  { ...wormholeSpireConfig, component: WormholeSpireWorld, interactionModel: { primaryAction: 'Click to energize the wormhole spire.', ambientResponse: 'The field bends around the central signal.' } },
  { ...prismOrchardConfig, component: PrismOrchardWorld, interactionModel: { primaryAction: 'Pulse the crystal crown.', ambientResponse: 'Prismatic paths turn through the orchard.' } },
  { ...solarChoirConfig, component: SolarChoirWorld, interactionModel: { primaryAction: 'Pulse the compact sun.', ambientResponse: 'Orbital voices shift their procession.' } },
  { ...tideCathedralConfig, component: TideCathedralWorld, interactionModel: { primaryAction: 'Pulse the floating pearl.', ambientResponse: 'Tidal ribs shimmer around the nave.' } },
  { ...emberLoomConfig, component: EmberLoomWorld, interactionModel: { primaryAction: 'Pulse the obsidian spindle.', ambientResponse: 'Molten threads retune their weave.' } },
  { ...auroraReliquaryConfig, component: AuroraReliquaryWorld, interactionModel: { primaryAction: 'Pulse the captive aurora.', ambientResponse: 'The reliquary redraws its orbital field.' } },
];
export const chapterMap = Object.fromEntries(chapters.map((chapter) => [chapter.id, chapter])) as Record<string, WorldChapter>;
