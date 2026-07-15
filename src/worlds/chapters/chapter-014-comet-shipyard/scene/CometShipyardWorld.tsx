import { Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group, Mesh } from 'three';
import type { WorldSceneProps } from '../../../registry';
import { getCometFlightPosition, type MutablePoint } from './motion';

const COMET_INDEXES = [0, 1, 2, 3, 4] as const;

export function CometShipyardWorld({ pulse, qualityTier, reducedMotion }: WorldSceneProps) {
  const comets = useRef<(Group | null)[]>([]);
  const planets = useRef<(Mesh | null)[]>([]);
  const positions = useMemo<MutablePoint[]>(() => COMET_INDEXES.map(() => [0, 0, 0]), []);
  const phase = pulse % 4;
  const radialSegments = qualityTier === 'low' ? 14 : qualityTier === 'medium' ? 22 : 30;
  const particleCount = reducedMotion ? 20 : qualityTier === 'low' ? 42 : qualityTier === 'medium' ? 76 : 118;

  useFrame(({ clock }) => {
    const time = reducedMotion ? 0 : clock.elapsedTime;
    for (const index of COMET_INDEXES) {
      const comet = comets.current[index];
      if (!comet) continue;
      const point = getCometFlightPosition(index, time, positions[index]);
      comet.position.set(point[0], point[1], point[2]);
      comet.rotation.x = Math.sin(time * 0.35 + index) * 0.08;
    }
    planets.current.forEach((planet, index) => {
      if (planet) planet.rotation.y = time * (0.08 + index * 0.035);
    });
  });

  return <group position={[0, 2.5, 0]}>
    <ambientLight color="#8be9ff" intensity={0.22} />
    <pointLight color="#8be9ff" intensity={3.1 + phase * 0.72} distance={20} position={[-1, 3, 4]} />
    <pointLight color="#ff9ad5" intensity={1.8 + phase * 0.38} distance={15} position={[4, -1, -2]} />
    <Sparkles count={particleCount} scale={[17, 10, 14]} size={1.25 + phase * 0.2} speed={reducedMotion ? 0 : 0.14} color="#d8f8ff" />

    {COMET_INDEXES.map((index) => <group key={index} ref={(group) => { comets.current[index] = group; }} scale={1 + phase * 0.035}>
      <mesh>
        <icosahedronGeometry args={[0.23 + index % 3 * 0.035, 1]} />
        <meshStandardMaterial color="#15263d" emissive={index % 2 ? '#ff9ad5' : '#8be9ff'} emissiveIntensity={1.8 + phase * 0.42} roughness={0.32} />
      </mesh>
      <mesh position={[0.85, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.2 + index * 0.025, 1.7, 14, 1, true]} />
        <meshBasicMaterial color={index % 2 ? '#ff9ad5' : '#8be9ff'} transparent opacity={0.34 + phase * 0.09} side={2} depthWrite={false} />
      </mesh>
      <mesh position={[1.55, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.12, 2.8, 12, 1, true]} />
        <meshBasicMaterial color="#d8f8ff" transparent opacity={0.16 + phase * 0.055} side={2} depthWrite={false} />
      </mesh>
    </group>)}

    <group position={[-0.55, -0.15, 0.4]} rotation={[0.1, 0, -0.18]}>
      <mesh rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.68, 3.2, 6]} />
        <meshStandardMaterial color="#243b5a" emissive="#8be9ff" emissiveIntensity={0.68 + phase * 0.2} metalness={0.82} roughness={0.24} />
      </mesh>
      <mesh position={[-1.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.38, 1.4, 18]} />
        <meshBasicMaterial color="#ff9ad5" transparent opacity={0.5 + phase * 0.08} />
      </mesh>
      <mesh position={[0.15, 0, 0]}><torusGeometry args={[1.08, 0.075, 8, 30]} /><meshBasicMaterial color="#8be9ff" transparent opacity={0.65} /></mesh>
    </group>

    <mesh ref={(mesh) => { planets.current[0] = mesh; }} position={[4.4, -1.8, -3]}>
      <sphereGeometry args={[0.78, radialSegments, radialSegments]} />
      <meshStandardMaterial color="#3b315f" emissive="#a884ff" emissiveIntensity={0.22} roughness={0.74} />
    </mesh>
    <group position={[-4.8, 2.5, -4]} rotation={[0.45, 0.2, 0]}>
      <mesh ref={(mesh) => { planets.current[1] = mesh; }}><sphereGeometry args={[0.55, radialSegments, radialSegments]} /><meshStandardMaterial color="#7b596d" roughness={0.82} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.9, 0.035, 8, 36]} /><meshBasicMaterial color="#ff9ad5" transparent opacity={0.48} /></mesh>
    </group>
  </group>;
}
