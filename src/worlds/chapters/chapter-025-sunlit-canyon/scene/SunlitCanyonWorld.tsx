import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Points } from 'three';
import type { WorldSceneProps } from '../../../registry';
import { createCanyonDust, createCanyonLayers, getCanyonBudget } from './canyonGeometry';

export function SunlitCanyonWorld({ pulse, qualityTier, reducedMotion, capabilities }: WorldSceneProps) {
  const dust = useRef<Points>(null);
  const budget = getCanyonBudget(qualityTier);
  const layers = useMemo(() => createCanyonLayers(qualityTier), [qualityTier]);
  const dustPositions = useMemo(() => createCanyonDust(qualityTier), [qualityTier]);

  useFrame(({ clock }) => {
    if (!reducedMotion && dust.current) dust.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.06) * 0.025;
  });

  return <group>
    {layers.map((layer, index) => (
      <mesh
        key={`${layer.position.join('-')}-${index}`}
        position={layer.position}
        rotation={layer.rotation}
        scale={layer.scale}
        castShadow={capabilities.shadows}
        receiveShadow={capabilities.shadows}
      >
        <icosahedronGeometry args={[1, budget.wallSegments]} />
        <meshStandardMaterial
          color={layer.color}
          roughness={0.94}
          metalness={0}
          emissive="#3d160d"
          emissiveIntensity={0.015 + (pulse % 4) * 0.008}
        />
      </mesh>
    ))}

    <mesh position={[-11, 7.2, -39]} scale={[8, 5, 5]} rotation={[0.05, 0.2, -0.03]} receiveShadow={capabilities.shadows}>
      <dodecahedronGeometry args={[1, qualityTier === 'high' ? 1 : 0]} />
      <meshStandardMaterial color="#a95635" roughness={0.98} metalness={0} />
    </mesh>
    <mesh position={[12, 6.2, -45]} scale={[9, 4.5, 5.5]} rotation={[-0.03, -0.3, 0.04]} receiveShadow={capabilities.shadows}>
      <dodecahedronGeometry args={[1, qualityTier === 'high' ? 1 : 0]} />
      <meshStandardMaterial color="#87402d" roughness={0.98} metalness={0} />
    </mesh>

    <points ref={dust} position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#f7d8a5" size={qualityTier === 'low' ? 0.075 : 0.055} transparent opacity={0.24} depthWrite={false} sizeAttenuation />
    </points>
  </group>;
}
