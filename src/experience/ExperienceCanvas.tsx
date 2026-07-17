import { Html } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { lazy, Suspense, useEffect, useMemo } from 'react';
import { ACESFilmicToneMapping, PCFSoftShadowMap, SRGBColorSpace } from 'three';

import { CameraDirector } from './camera/CameraDirector';
import { ExplorerControls } from './controls/ExplorerControls';
import { IdleDriftController } from './controls/IdleDriftController';
import { SceneEnvironment } from './environment/SceneEnvironment';
import { WorldLighting } from './lighting/WorldLighting';
import { selectActiveChapter, useWorldStore } from '../app/world-store';
import { LoadingScreen } from '../components/LoadingScreen';
import { WebGLFallback } from '../components/WebGLFallback';
import type { QualityTier } from '../lib/performance';
import { resolveRenderCapabilities } from './rendering/quality';

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
  const capabilities = useMemo(() => resolveRenderCapabilities(qualityTier, reducedMotion), [qualityTier, reducedMotion]);
  const ChapterComponent = chapter.component;

  if (!webglAvailable) return <WebGLFallback chapterTitle={chapter.title} chapterDescription={chapter.description} />;

  return (
    <div className="canvas-wrap" onDoubleClick={interactive ? triggerPulse : undefined} aria-label="Interactive 3D world. Drag to orbit, pinch or scroll to zoom, and double tap to pulse.">
      <Canvas
        key={`renderer-${capabilities.antialias ? 'aa' : 'no-aa'}`}
        dpr={capabilities.dpr}
        shadows={capabilities.shadows}
        frameloop={reducedMotion ? 'demand' : 'always'}
        gl={{ antialias: capabilities.antialias, powerPreference: qualityTier === 'low' ? 'low-power' : 'high-performance' }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = SRGBColorSpace;
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
          gl.shadowMap.type = PCFSoftShadowMap;
        }}
        camera={{ position: chapter.cameraPreset.position, fov: chapter.cameraPreset.fov }}
        fallback={<WebGLFallback chapterTitle={chapter.title} chapterDescription={chapter.description} />}
      >
        <ContextLossMonitor onContextLost={onContextLost} />
        <Suspense fallback={<Html center><LoadingScreen /></Html>}>
          <CameraDirector preset={chapter.cameraPreset} />
          <IdleDriftController active={!interactive && !reducedMotion} baselinePosition={chapter.cameraPreset.position} />
          <SceneEnvironment paletteGround={chapter.palette[2]} quality={qualityTier} request={chapter.rendering?.environment} />
          <WorldLighting capabilities={capabilities} request={chapter.rendering?.lighting} />
          <ChapterComponent pulse={pulse} qualityTier={qualityTier} reducedMotion={reducedMotion} capabilities={capabilities} />
          <ExplorerControls mode={chapter.movementMode} baseFov={chapter.cameraPreset.fov} enabled={interactive} reducedMotion={reducedMotion} request={chapter.rendering?.controls} />
          {capabilities.postProcessing && chapter.qualityHint !== 'low' && chapter.rendering?.post ? <LazyWorldPostFX request={chapter.rendering.post} /> : null}
        </Suspense>
      </Canvas>
      <div className="pulse-readout" aria-live="polite">world pulse {pulse}</div>
    </div>
  );
}
