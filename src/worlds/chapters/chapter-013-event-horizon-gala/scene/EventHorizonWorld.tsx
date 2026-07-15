import { Line, Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group, Mesh } from 'three';
import type { WorldSceneProps } from '../../../registry';
import { getInfallingMatterPosition, type MutablePoint } from './motion';

type Point = [number, number, number];

const INFALL_INDEXES = [0, 1, 2, 3, 4, 5, 6, 7] as const;

function createWarpedPaths(arms: number, segments: number): Point[][] {
  return Array.from({ length: arms }, (_, arm) => Array.from({ length: segments }, (_, segment) => {
    const progress = segment / (segments - 1);
    const angle = arm * Math.PI * 2 / arms + progress * Math.PI * 4.6;
    const radius = 1.45 + progress * 4.7;
    return [Math.cos(angle) * radius, Math.sin(angle * 0.42) * 0.22, Math.sin(angle) * radius];
  }));
}

export function EventHorizonWorld({ pulse, qualityTier, reducedMotion }: WorldSceneProps) {
  const disk = useRef<Group>(null);
  const matter = useRef<(Mesh | null)[]>([]);
  const radialSegments = qualityTier === 'low' ? 16 : qualityTier === 'medium' ? 24 : 36;
  const lineSegments = qualityTier === 'low' ? 20 : qualityTier === 'medium' ? 30 : 44;
  const particleCount = reducedMotion ? 24 : qualityTier === 'low' ? 48 : qualityTier === 'medium' ? 82 : 128;
  const phase = pulse % 4;
  const paths = useMemo(() => createWarpedPaths(4, lineSegments), [lineSegments]);
  const positions = useMemo<MutablePoint[]>(() => INFALL_INDEXES.map(() => [0, 0, 0]), []);

  useFrame(({ clock }) => {
    const time = reducedMotion ? 0 : clock.elapsedTime;
    if (disk.current) disk.current.rotation.y = time * 0.11 + pulse * 0.06;
    for (const index of INFALL_INDEXES) {
      const mesh = matter.current[index];
      if (!mesh) continue;
      const point = getInfallingMatterPosition(index, time, positions[index]);
      mesh.position.set(point[0], point[1], point[2]);
      mesh.rotation.y = time * 0.8 + index;
    }
  });

  return <group position={[0, 2.6, 0]} rotation={[0.08, 0, -0.12]}>
    <ambientLight color="#a884ff" intensity={0.2} />
    <pointLight color="#ffbd66" intensity={3.2 + phase * 0.85} distance={19} position={[0, 2.2, 3.5]} />
    <Sparkles count={particleCount} scale={[16, 9, 13]} size={1.2 + phase * 0.18} speed={reducedMotion ? 0 : 0.12} color="#d9c8ff" />

    <group ref={disk} rotation={[0.12, 0, 0.08]}>
      {paths.map((points, index) => <Line key={index} points={points} color={index % 2 ? '#a884ff' : '#ffbd66'} lineWidth={1.2} transparent opacity={0.42 + phase * 0.09} />)}
      {[0, 1, 2].map((index) => <mesh key={index} rotation={[Math.PI / 2 + index * 0.08, index * 0.18, 0]}>
        <torusGeometry args={[1.9 + index * 0.62, 0.1 + index * 0.04, 10, radialSegments * 3]} />
        <meshStandardMaterial color="#16091e" emissive={index === 1 ? '#a884ff' : '#ffbd66'} emissiveIntensity={1.6 + phase * 0.42} transparent opacity={0.82 - index * 0.14} />
      </mesh>)}
      {INFALL_INDEXES.map((index) => <mesh key={index} ref={(mesh) => { matter.current[index] = mesh; }}>
        <icosahedronGeometry args={[0.08 + index % 3 * 0.025, 0]} />
        <meshBasicMaterial color={index % 2 ? '#a884ff' : '#ffbd66'} />
      </mesh>)}
    </group>

    <mesh>
      <sphereGeometry args={[1.22, radialSegments, radialSegments]} />
      <meshBasicMaterial color="#010104" />
    </mesh>
    <mesh scale={1.32 + phase * 0.065}>
      <sphereGeometry args={[1.2, radialSegments, radialSegments]} />
      <meshBasicMaterial color="#ffbd66" side={1} transparent opacity={0.1 + phase * 0.025} />
    </mesh>
  </group>;
}
