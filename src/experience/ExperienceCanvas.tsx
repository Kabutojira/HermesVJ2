import { Html } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { lazy, Suspense, useEffect, useMemo } from 'react';

import { CameraDirector } from './camera/CameraDirector';
import { ExplorerControls } from './controls/ExplorerControls';
import { IdleDriftController } from './controls/IdleDriftController';
import { GroundPlane } from './environment/GroundPlane';
import { SkyDome } from './environment/SkyDome';
import { StarsField } from './environment/StarsField';
import { FogVolume } from './environment/FogVolume';
import { WorldLighting } from './lighting/WorldLighting';
import { selectActiveChapter, useWorldStore } from '../app/world-store';
import { LoadingScreen } from '../components/LoadingScreen';
import { WebGLFallback } from '../components/WebGLFallback';
import type { QualityTier } from '../lib/performance';

const LazyWorldPostFX = lazy(() => import('./post/WorldPostFX').then((module) => ({ default: module.WorldPostFX })));

function ContextLossMonitor({ onContextLost }: { onContextLost: () => void }) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const handleLoss = (event: Event) => {
      event.preventDefault();
      onContextLost();
    };
    canvas.addEventListener('webglcontextlost', handleLoss);
    return () => canvas.removeEventListener('webglcontextlost', handleLoss);
  }, [gl, onContextLost]);
  return null;
}

interface ExperienceCanvasProps {
  interactive: boolean;
  qualityTier: QualityTier;
  reducedMotion: boolean;
  webglAvailable: boolean;
  onContextLost: () => void;
}

export function ExperienceCanvas({ interactive, qualityTier, reducedMotion, webglAvailable, onContextLost }: ExperienceCanvasProps) {
  const activeChapterId = useWorldStore((state) => state.activeChapterId);
  const pulse = useWorldStore((state) => state.pulse);
  const triggerPulse = useWorldStore((state) => state.triggerPulse);
  const chapter = useMemo(() => selectActiveChapter(activeChapterId), [activeChapterId]);
  const ChapterComponent = chapter.component;

  if (!webglAvailable) return <WebGLFallback chapterTitle={chapter.title} chapterDescription={chapter.description} />;

  return (
    <div className="canvas-wrap" onDoubleClick={interactive ? triggerPulse : undefined} aria-label="Interactive 3D world. Drag to orbit, pinch or scroll to zoom, and double tap to pulse.">
      <Canvas
        dpr={qualityTier === 'low' ? 1 : qualityTier === 'medium' ? [1, 1.5] : [1, 2]}
        shadows={qualityTier !== 'low'}
        frameloop={reducedMotion ? 'demand' : 'always'}
        gl={{ antialias: qualityTier !== 'low', powerPreference: qualityTier === 'low' ? 'low-power' : 'high-performance' }}
        camera={{ position: chapter.cameraPreset.position, fov: chapter.cameraPreset.fov }}
        fallback={<WebGLFallback chapterTitle={chapter.title} chapterDescription={chapter.description} />}
      >
        <ContextLossMonitor onContextLost={onContextLost} />
        <color attach="background" args={['#040611']} />
        <FogVolume />
        <Suspense fallback={<Html center><LoadingScreen /></Html>}>
          <CameraDirector preset={chapter.cameraPreset} />
          <IdleDriftController active={!interactive && !reducedMotion} baselinePosition={chapter.cameraPreset.position} />
          <WorldLighting />
          <SkyDome />
          <StarsField quality={qualityTier} />
          <GroundPlane tint={chapter.palette[2]} quality={qualityTier} />
          <ChapterComponent pulse={pulse} qualityTier={qualityTier} reducedMotion={reducedMotion} />
          <ExplorerControls mode={chapter.movementMode} baseFov={chapter.cameraPreset.fov} enabled={interactive} reducedMotion={reducedMotion} />
          {qualityTier === 'high' && chapter.qualityHint !== 'low' && !reducedMotion ? <LazyWorldPostFX enabled /> : null}
        </Suspense>
      </Canvas>
      <div className="pulse-readout" aria-live="polite">world pulse {pulse}</div>
    </div>
  );
}
