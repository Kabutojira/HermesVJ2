import { Float, RoundedBox, Sparkles, Torus } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group } from 'three';
import type { WorldSceneProps } from '../../../registry';

function LotusPetals({ reducedMotion, qualityTier }: Pick<WorldSceneProps, 'reducedMotion' | 'qualityTier'>) {
  const count = qualityTier === 'low' ? 6 : qualityTier === 'medium' ? 9 : 12;
  const petals = useMemo(() => Array.from({ length: count }, (_, index) => ({ angle: (index / count) * Math.PI * 2, radius: 2.8 + (index % 3) * 0.55, height: 0.7 + (index % 4) * 0.25 })), [count]);

  return <group>{petals.map((petal, index) => (
    <Float key={`${petal.angle}-${index}`} speed={reducedMotion ? 0 : 1.4 + index * 0.05} rotationIntensity={reducedMotion ? 0 : 0.15} floatIntensity={reducedMotion ? 0 : 0.45}>
      <mesh position={[Math.cos(petal.angle) * petal.radius, petal.height, Math.sin(petal.angle) * petal.radius]} rotation={[0.2, petal.angle, 0.8]}>
        <capsuleGeometry args={[0.18, 0.8, qualityTier === 'low' ? 4 : 6, qualityTier === 'low' ? 8 : 12]} />
        <meshStandardMaterial color={index % 2 === 0 ? '#ffd5fb' : '#9af5ff'} emissive="#351544" emissiveIntensity={1.2} />
      </mesh>
    </Float>
  ))}</group>;
}

export function LotusGateWorld({ pulse, qualityTier, reducedMotion }: WorldSceneProps) {
  const halo = useRef<Group>(null);
  const gate = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (reducedMotion) return;
    const t = clock.getElapsedTime();
    if (halo.current) {
      halo.current.rotation.y = t * 0.18;
      halo.current.scale.setScalar(1 + Math.sin(t * 1.4 + pulse) * 0.04);
    }
    if (gate.current) gate.current.position.y = 1.4 + Math.sin(t * 0.7) * 0.08;
  });

  const sparkles = qualityTier === 'low' ? 32 : qualityTier === 'medium' ? 72 : 120;
  return <group>
    <Sparkles count={sparkles} scale={[13, 6, 13]} position={[0, 2.8, 0]} size={1.8} speed={reducedMotion ? 0 : 0.25} color="#ffe0ff" />
    <group ref={gate}>
      <RoundedBox args={[2.5, 4.6, 0.42]} radius={0.08} smoothness={qualityTier === 'low' ? 2 : 5} position={[0, 2.4, -0.1]} castShadow={qualityTier !== 'low'}><meshStandardMaterial color="#1d1531" metalness={0.6} roughness={0.25} emissive="#6d2bd1" emissiveIntensity={0.45} /></RoundedBox>
      <mesh position={[0, 2.35, 0.2]} castShadow={qualityTier !== 'low'}><torusGeometry args={[1.2, 0.12, qualityTier === 'low' ? 12 : 24, qualityTier === 'low' ? 48 : 96]} /><meshStandardMaterial color="#cbfbff" emissive="#7ae9ff" emissiveIntensity={2.8} /></mesh>
      <mesh position={[0, 1.25, 0.32]} rotation={[Math.PI / 2, 0, 0]}><ringGeometry args={[0.6, 1.8, qualityTier === 'low' ? 32 : 64]} /><meshBasicMaterial color="#62ceff" transparent opacity={0.2} /></mesh>
    </group>
    <group ref={halo} position={[0, 3.4, 0]}><Torus args={[3.5, 0.08, 16, qualityTier === 'low' ? 60 : 120]} rotation-x={Math.PI / 2}><meshStandardMaterial color="#ffdefd" emissive="#ffa6ef" emissiveIntensity={1.8} /></Torus><Torus args={[4.4, 0.04, 14, qualityTier === 'low' ? 40 : 80]} rotation={[Math.PI / 2, 0.35, 0]}><meshStandardMaterial color="#8aefff" emissive="#72e8ff" emissiveIntensity={1.5} /></Torus></group>
    <LotusPetals reducedMotion={reducedMotion} qualityTier={qualityTier} />
  </group>;
}
