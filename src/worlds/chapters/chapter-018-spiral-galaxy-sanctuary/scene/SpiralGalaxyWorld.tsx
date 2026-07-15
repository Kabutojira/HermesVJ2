import { Line, Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group } from 'three';
import type { WorldSceneProps } from '../../../registry';
import { createGalaxyArmSpines, createGalaxyStarLayers } from '../../../shared/spaceVisuals';

const GALAXY_ARM_SPINES = createGalaxyArmSpines(64);
const GALAXY_ARM_COLORS = ['#fff1c2', '#8bdcff', '#d39aff', '#fff1c2'] as const;

export function SpiralGalaxyWorld({ pulse, qualityTier, reducedMotion }: WorldSceneProps) {
  const galaxy = useRef<Group>(null);
  const layers = useMemo(() => createGalaxyStarLayers(qualityTier), [qualityTier]);
  const phase = pulse % 4;
  const ambientCount = qualityTier === 'low' ? 28 : qualityTier === 'medium' ? 48 : 72;

  useFrame(({ clock }) => {
    if (!galaxy.current) return;
    const time = reducedMotion ? 0 : clock.elapsedTime;
    galaxy.current.rotation.y = time * 0.085 + pulse * 0.1;
    galaxy.current.scale.setScalar(1 + phase * 0.025);
  });

  return <group position={[0, 2.35, 0]}>
    <ambientLight color="#6c73b8" intensity={0.22} />
    <pointLight color="#fff1c2" intensity={3.4 + phase * 0.55} distance={18} position={[0, 2, 1]} />
    <Sparkles count={ambientCount} scale={[18, 11, 16]} size={0.9} speed={reducedMotion ? 0 : 0.08} color="#9cbcff" />

    <group ref={galaxy} rotation={[-Math.PI / 2 + 0.28, 0, -0.12]}>
      {GALAXY_ARM_SPINES.map((points, index) => <Line
        key={index}
        points={points}
        color={GALAXY_ARM_COLORS[index]}
        lineWidth={2.4 + phase * 0.3}
        transparent
        opacity={0.32 + phase * 0.035}
      />)}
      {layers.map((layer) => <points key={layer.color}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[layer.positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={layer.color}
          size={layer.size + phase * 0.006}
          sizeAttenuation
          transparent
          opacity={0.9 + phase * 0.025}
          depthWrite={false}
        />
      </points>)}

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.25, 0.16, 10, qualityTier === 'low' ? 48 : 84]} />
        <meshStandardMaterial color="#25143d" emissive="#d39aff" emissiveIntensity={1.2 + phase * 0.32} transparent opacity={0.7} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.72, qualityTier === 'low' ? 18 : 28, qualityTier === 'low' ? 14 : 22]} />
        <meshStandardMaterial color="#fff4ce" emissive="#fff1c2" emissiveIntensity={2.4 + phase * 0.5} roughness={0.2} />
      </mesh>
      <mesh scale={1.65}>
        <sphereGeometry args={[0.72, 18, 14]} />
        <meshBasicMaterial color="#8bdcff" transparent opacity={0.08 + phase * 0.02} depthWrite={false} />
      </mesh>
    </group>
  </group>;
}
