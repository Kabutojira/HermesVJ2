import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
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

export function ExperienceCanvas({ interactive }: { interactive: boolean }) {
  const activeChapterId = useWorldStore((state) => state.activeChapterId);
  const pulse = useWorldStore((state) => state.pulse);
  const triggerPulse = useWorldStore((state) => state.triggerPulse);

  const chapter = useMemo(() => selectActiveChapter(activeChapterId), [activeChapterId]);
  const ChapterComponent = chapter.component;

  return (
    <div className="canvas-wrap" onClick={interactive ? triggerPulse : undefined}>
      <Canvas shadows camera={{ position: chapter.cameraPreset.position, fov: chapter.cameraPreset.fov }}>
        <color attach="background" args={['#040611']} />
        <FogVolume />
        <Suspense fallback={null}>
          <CameraDirector preset={chapter.cameraPreset} />
          <IdleDriftController active={!interactive} />
          <WorldLighting />
          <SkyDome />
          <StarsField />
          <GroundPlane tint={chapter.palette[2]} />
          <Environment preset="night" />
          <ChapterComponent pulse={pulse} />
          <ExplorerControls />
          <WorldPostFX />
        </Suspense>
      </Canvas>
      {!interactive ? <LoadingScreen /> : null}
      <div className="pulse-readout">world pulse {pulse}</div>
    </div>
  );
}
