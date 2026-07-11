import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';

export function IdleDriftController({ active }: { active: boolean }) {
  const { camera } = useThree();
  const baseline = useRef(camera.position.clone());

  useFrame(({ clock }) => {
    if (!active) return;
    const t = clock.getElapsedTime();
    camera.position.x = baseline.current.x + Math.sin(t * 0.15) * 0.45;
    camera.position.y = baseline.current.y + Math.cos(t * 0.2) * 0.18;
  });

  return null;
}
