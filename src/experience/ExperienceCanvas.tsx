import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';

import { CameraDirector } from './camera/CameraDirector';
import { ExplorerControls } from './controls/ExplorerControls';
import { IdleDriftController } from './controls/IdleDriftController';
import { GroundPlane } from './environment/GroundPlane';
import { SkyDome } from './environment/SkyDome';
import { StarsField } from './environment/StarsField';
import { FogVolume } from './environment/FogVolume';
import { WorldLighting } from './lighting/WorldLighting';
import { WorldPostFX } from './post/WorldPostFX';
import { selectActiveChapter, useWorldStore } from '../app/world-store';
import { LoadingScreen } from '../components/LoadingScreen';
import type { QualityTier } from '../lib/performance';

export function ExperienceCanvas({ interactive, qualityTier }: { interactive: boolean; qualityTier: QualityTier }) {
  const activeChapterId = useWorldStore((state) => state.activeChapterId);
  const pulse = useWorldStore((state) => state.pulse);
  const triggerPulse = useWorldStore((state) => state.triggerPulse);

  const chapter = useMemo(() => selectActiveChapter(activeChapterId), [activeChapterId]);
  const ChapterComponent = chapter.component;

  return (
    <div className="canvas-wrap" onDoubleClick={interactive ? triggerPulse : undefined} aria-label="Interactive 3D world. Drag to orbit, pinch or scroll to zoom, and double tap to pulse.">
      <Canvas dpr={qualityTier === 'low' ? 1 : qualityTier === 'medium' ? [1, 1.5] : [1, 2]} shadows={qualityTier !== 'low'} camera={{ position: chapter.cameraPreset.position, fov: chapter.cameraPreset.fov }}>
        <color attach="background" args={['#040611']} />
        <FogVolume />
        <Suspense fallback={null}>
          <CameraDirector preset={chapter.cameraPreset} />
          <IdleDriftController active={!interactive} />
          <WorldLighting />
          <SkyDome />
          <StarsField quality={qualityTier} />
          <GroundPlane tint={chapter.palette[2]} />
          <ChapterComponent pulse={pulse} />
          <ExplorerControls mode={chapter.movementMode} />
          <WorldPostFX enabled={qualityTier === 'high' && chapter.qualityHint !== 'low'} />
        </Suspense>
      </Canvas>
      {!interactive ? <LoadingScreen /> : null}
      <div className="pulse-readout" aria-live="polite">world pulse {pulse}</div>
    </div>
  );
}
