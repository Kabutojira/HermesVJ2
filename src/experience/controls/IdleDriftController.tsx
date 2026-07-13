import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Vector3, type Vector3Tuple } from 'three';

export function IdleDriftController({ active, baselinePosition }: { active: boolean; baselinePosition: Vector3Tuple }) {
  const { camera } = useThree();
  const baseline = useRef(new Vector3(...baselinePosition));

  useEffect(() => {
    baseline.current.set(...baselinePosition);
  }, [baselinePosition]);

  useFrame(({ clock }) => {
    if (!active) return;
    const t = clock.getElapsedTime();
    camera.position.x = baseline.current.x + Math.sin(t * 0.15) * 0.45;
    camera.position.y = baseline.current.y + Math.cos(t * 0.2) * 0.18;
  });

  return null;
}
