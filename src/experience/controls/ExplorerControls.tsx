import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MathUtils, PerspectiveCamera } from 'three';

import { AUTO_CAMERA_RESUME_MS, responsiveFov, spectatorFov } from '../camera/spectatorCamera';

type MovementMode = 'orbit' | 'guided' | 'fixed' | 'free-fly';

interface ExplorerControlsProps {
  mode: MovementMode;
  baseFov: number;
  enabled?: boolean;
  reducedMotion: boolean;
}

export function ExplorerControls({ mode, baseFov, enabled = true, reducedMotion }: ExplorerControlsProps) {
  const camera = useThree((state) => state.camera) as PerspectiveCamera;
  const size = useThree((state) => state.size);
  const [autoActive, setAutoActive] = useState(enabled);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setAutoActive(enabled);
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, [enabled, mode]);

  const stopAutomaticCamera = useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    setAutoActive(false);
  }, []);

  const scheduleAutomaticCamera = useCallback(() => {
    if (!enabled || reducedMotion) return;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setAutoActive(true), AUTO_CAMERA_RESUME_MS);
  }, [enabled, reducedMotion]);

  useFrame(({ clock }, delta) => {
    if (!autoActive || reducedMotion || !enabled) return;
    const targetFov = spectatorFov(responsiveFov(baseFov, size.width / size.height), clock.getElapsedTime() * 0.22);
    const nextFov = MathUtils.damp(camera.fov, targetFov, 1.4, delta);
    if (Math.abs(nextFov - camera.fov) > 0.001) {
      camera.fov = nextFov;
      camera.updateProjectionMatrix();
    }
  });

  if (mode === 'fixed') return null;

  return (
    <OrbitControls
      enabled={enabled}
      autoRotate={autoActive && !reducedMotion}
      autoRotateSpeed={0.32}
      enableDamping={!reducedMotion}
      dampingFactor={0.06}
      enablePan={mode === 'free-fly'}
      enableRotate
      minDistance={5}
      maxDistance={18}
      minPolarAngle={0.35}
      maxPolarAngle={Math.PI / 2.02}
      target={[0, 2.3, 0]}
      onStart={stopAutomaticCamera}
      onEnd={scheduleAutomaticCamera}
    />
  );
}
