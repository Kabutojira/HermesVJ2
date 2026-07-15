import type { CameraPreset } from '../experience/camera/cameraPresets';
import type { QualityTier } from '../lib/performance';
import type { MovementMode } from './shared/biomeTypes';
import type { InteractionModel } from './shared/interactionTypes';
import { lazy, type ComponentType } from 'react';
import { lotusGateConfig } from './chapters/chapter-001-lotus-gate/config';
import { wormholeSpireConfig } from './chapters/chapter-002-wormhole-spire/config';
import { prismOrchardConfig } from './chapters/chapter-003-prism-orchard/config';
import { solarChoirConfig } from './chapters/chapter-004-solar-choir/config';
import { tideCathedralConfig } from './chapters/chapter-005-tide-cathedral/config';
import { emberLoomConfig } from './chapters/chapter-006-ember-loom/config';
import { auroraReliquaryConfig } from './chapters/chapter-007-aurora-reliquary/config';
import { tempestLanternConfig } from './chapters/chapter-008-tempest-lantern/config';
import { cinderSanctumConfig } from './chapters/chapter-009-cinder-sanctum/config';
import { nebulaFountainConfig } from './chapters/chapter-010-nebula-fountain/config';
import { frostOracleConfig } from './chapters/chapter-011-frost-oracle/config';
import { thunderForgeConfig } from './chapters/chapter-012-thunder-forge/config';
import { eventHorizonConfig } from './chapters/chapter-013-event-horizon-gala/config';
import { cometShipyardConfig } from './chapters/chapter-014-comet-shipyard/config';
import { trinaryConfig } from './chapters/chapter-017-trinary-orrey/config';
import { spiralGalaxyConfig } from './chapters/chapter-018-spiral-galaxy-sanctuary/config';
import { deepSpaceConvergenceConfig } from './chapters/chapter-019-deep-space-convergence/config';
import { saturnOrbitInsertionConfig } from './chapters/chapter-020-saturn-orbit-insertion/config';
import { saturnRingsideDescentConfig } from './chapters/chapter-021-saturn-ringside-descent/config';
import { saturnNightsidePlasmaConfig } from './chapters/chapter-022-saturn-nightside-plasma/config';
import { saturnTerminatorCrossingConfig } from './chapters/chapter-023-saturn-terminator-crossing/config';
import { saturnOrbitalDawnConfig } from './chapters/chapter-024-saturn-orbital-dawn/config';

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
const PrismOrchardWorld = lazy(() => import('./chapters/chapter-003-prism-orchard/scene/PrismOrchardWorld').then((module) => ({ default: module.PrismOrchardWorld })));
const SolarChoirWorld = lazy(() => import('./chapters/chapter-004-solar-choir/scene/SolarChoirWorld').then((module) => ({ default: module.SolarChoirWorld })));
const TideCathedralWorld = lazy(() => import('./chapters/chapter-005-tide-cathedral/scene/TideCathedralWorld').then((module) => ({ default: module.TideCathedralWorld })));
const EmberLoomWorld = lazy(() => import('./chapters/chapter-006-ember-loom/scene/EmberLoomWorld').then((module) => ({ default: module.EmberLoomWorld })));
const AuroraReliquaryWorld = lazy(() => import('./chapters/chapter-007-aurora-reliquary/scene/AuroraReliquaryWorld').then((module) => ({ default: module.AuroraReliquaryWorld })));
const TempestWorld = lazy(() => import('./chapters/chapter-008-tempest-lantern/scene/TempestWorld').then((module) => ({ default: module.TempestWorld })));
const CinderWorld = lazy(() => import('./chapters/chapter-009-cinder-sanctum/scene/CinderWorld').then((module) => ({ default: module.CinderWorld })));
const NebulaWorld = lazy(() => import('./chapters/chapter-010-nebula-fountain/scene/NebulaWorld').then((module) => ({ default: module.NebulaWorld })));
const FrostWorld = lazy(() => import('./chapters/chapter-011-frost-oracle/scene/FrostWorld').then((module) => ({ default: module.FrostWorld })));
const ThunderWorld = lazy(() => import('./chapters/chapter-012-thunder-forge/scene/ThunderWorld').then((module) => ({ default: module.ThunderWorld })));
const EventHorizonWorld = lazy(() => import('./chapters/chapter-013-event-horizon-gala/scene/EventHorizonWorld').then((module) => ({ default: module.EventHorizonWorld })));
const CometShipyardWorld = lazy(() => import('./chapters/chapter-014-comet-shipyard/scene/CometShipyardWorld').then((module) => ({ default: module.CometShipyardWorld })));
const TrinaryWorld = lazy(() => import('./chapters/chapter-017-trinary-orrey/scene/TrinaryWorld').then((module) => ({ default: module.TrinaryWorld })));
const SpiralGalaxyWorld = lazy(() => import('./chapters/chapter-018-spiral-galaxy-sanctuary/scene/SpiralGalaxyWorld').then((module) => ({ default: module.SpiralGalaxyWorld })));
const DeepSpaceConvergenceWorld = lazy(() => import('./chapters/chapter-019-deep-space-convergence/scene/DeepSpaceConvergenceWorld').then((module) => ({ default: module.DeepSpaceConvergenceWorld })));
const SaturnOrbitInsertionWorld = lazy(() => import('./chapters/chapter-020-saturn-orbit-insertion/scene/SaturnOrbitInsertionWorld').then((module) => ({ default: module.SaturnOrbitInsertionWorld })));
const SaturnRingsideDescentWorld = lazy(() => import('./chapters/chapter-021-saturn-ringside-descent/scene/SaturnRingsideDescentWorld').then((module) => ({ default: module.SaturnRingsideDescentWorld })));
const SaturnNightsidePlasmaWorld = lazy(() => import('./chapters/chapter-022-saturn-nightside-plasma/scene/SaturnNightsidePlasmaWorld').then((module) => ({ default: module.SaturnNightsidePlasmaWorld })));
const SaturnTerminatorCrossingWorld = lazy(() => import('./chapters/chapter-023-saturn-terminator-crossing/scene/SaturnTerminatorCrossingWorld').then((module) => ({ default: module.SaturnTerminatorCrossingWorld })));
const SaturnOrbitalDawnWorld = lazy(() => import('./chapters/chapter-024-saturn-orbital-dawn/scene/SaturnOrbitalDawnWorld').then((module) => ({ default: module.SaturnOrbitalDawnWorld })));

export const chapters: WorldChapter[] = [
  { ...lotusGateConfig, component: LotusGateWorld, interactionModel: { primaryAction: 'Click to send a pulse through the gate halo.', ambientResponse: 'Petals drift and the orbital halo breathes around the gate.' } },
  { ...wormholeSpireConfig, component: WormholeSpireWorld, interactionModel: { primaryAction: 'Click to energize the wormhole spire.', ambientResponse: 'The field bends around the central signal.' } },
  { ...prismOrchardConfig, component: PrismOrchardWorld, interactionModel: { primaryAction: 'Pulse the crystal crown.', ambientResponse: 'Prismatic paths turn through the orchard.' } },
  { ...solarChoirConfig, component: SolarChoirWorld, interactionModel: { primaryAction: 'Pulse the compact sun.', ambientResponse: 'Orbital voices shift their procession.' } },
  { ...tideCathedralConfig, component: TideCathedralWorld, interactionModel: { primaryAction: 'Pulse the floating pearl.', ambientResponse: 'Tidal ribs shimmer around the nave.' } },
  { ...emberLoomConfig, component: EmberLoomWorld, interactionModel: { primaryAction: 'Pulse the obsidian spindle.', ambientResponse: 'Molten threads retune their weave.' } },
  { ...auroraReliquaryConfig, component: AuroraReliquaryWorld, interactionModel: { primaryAction: 'Pulse the captive aurora.', ambientResponse: 'The reliquary redraws its orbital field.' } },
  { ...tempestLanternConfig, component: TempestWorld, interactionModel: { primaryAction: 'Pulse the charged lantern.', ambientResponse: 'Rain, particles, and branching lightning expand as the lantern flares.' } },
  { ...cinderSanctumConfig, component: CinderWorld, interactionModel: { primaryAction: 'Pulse the sanctum flame.', ambientResponse: 'Fire rises while sparks and molten paths brighten outward.' } },
  { ...nebulaFountainConfig, component: NebulaWorld, interactionModel: { primaryAction: 'Pulse the stellar well.', ambientResponse: 'Eleven plasma fountains expand through the particle mist.' } },
  { ...frostOracleConfig, component: FrostWorld, interactionModel: { primaryAction: 'Pulse the ice oracle.', ambientResponse: 'Snow, the ice crown, and cold light answer together.' } },
  { ...thunderForgeConfig, component: ThunderWorld, interactionModel: { primaryAction: 'Pulse the hammer ring.', ambientResponse: 'Electric branches, sparks, and gold-blue forge light surge.' } },
  { ...eventHorizonConfig, component: EventHorizonWorld, interactionModel: { primaryAction: 'Pulse the event horizon.', ambientResponse: 'Gravity brightens the spiral gala and expands its lensing halo.' } },
  { ...cometShipyardConfig, component: CometShipyardWorld, interactionModel: { primaryAction: 'Pulse the comet escort.', ambientResponse: 'Ion trails flare as the spacecraft crosses the convoy.' } },
  { ...trinaryConfig, component: TrinaryWorld, interactionModel: { primaryAction: 'Pulse the trinary orrery.', ambientResponse: 'Three suns and their planets advance through shared gravity.' } },
  { ...spiralGalaxyConfig, component: SpiralGalaxyWorld, interactionModel: { primaryAction: 'Pulse the spiral sanctuary.', ambientResponse: 'Layered stars brighten as the galactic congregation turns.' } },
  { ...deepSpaceConvergenceConfig, component: DeepSpaceConvergenceWorld, interactionModel: { primaryAction: 'Pulse the deep-space convergence.', ambientResponse: 'The pulsar beams, quasar jets, and spacecraft engine answer across the gulf.' } },
  { ...saturnOrbitInsertionConfig, component: SaturnOrbitInsertionWorld, interactionModel: { primaryAction: 'Pulse the insertion plasma.', ambientResponse: 'The station spins through a brighter cyan bow shock above Saturn.' } },
  { ...saturnRingsideDescentConfig, component: SaturnRingsideDescentWorld, interactionModel: { primaryAction: 'Pulse the ringside wake.', ambientResponse: 'Sunlight and plasma trace the station’s descent past the rings.' } },
  { ...saturnNightsidePlasmaConfig, component: SaturnNightsidePlasmaWorld, interactionModel: { primaryAction: 'Pulse the nightside wake.', ambientResponse: 'Violet plasma reveals the station against Saturn’s dark hemisphere.' } },
  { ...saturnTerminatorCrossingConfig, component: SaturnTerminatorCrossingWorld, interactionModel: { primaryAction: 'Pulse the terminator crossing.', ambientResponse: 'Amber plasma bridges Saturn’s warm day and blue night.' } },
  { ...saturnOrbitalDawnConfig, component: SaturnOrbitalDawnWorld, interactionModel: { primaryAction: 'Pulse the orbital dawn.', ambientResponse: 'Rose plasma and first light catch the station above the rings.' } },
];
export const chapterMap = Object.fromEntries(chapters.map((chapter) => [chapter.id, chapter])) as Record<string, WorldChapter>;
