import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group } from 'three';
import type { WorldSceneProps } from '../../../registry';
import { createHeroProfile, getStudioBudget } from './productGeometry';

export function CinematicProductStudioWorld({ pulse, qualityTier, reducedMotion, capabilities }: WorldSceneProps) {
  const hero = useRef<Group>(null);
  const budget = getStudioBudget(qualityTier);
  const profile = useMemo(() => createHeroProfile(qualityTier), [qualityTier]);
  const highlight = 1.7 + (pulse % 4) * 0.38;

  useFrame(({ clock }) => {
    if (!reducedMotion && hero.current) hero.current.rotation.y = -0.32 + clock.getElapsedTime() * 0.075 + pulse * 0.035;
  });

  return <group>
    <rectAreaLight color="#fff0dc" intensity={qualityTier === 'low' ? 6.5 : 8.5} width={5.5} height={8} position={[5.2, 7.2, 4.8]} rotation={[-0.35, 0.65, 0.18]} />
    <rectAreaLight color="#a8c7ff" intensity={qualityTier === 'low' ? 2.2 : 4.2} width={4} height={6} position={[-4.8, 5.2, 1.4]} rotation={[-0.2, -1.25, -0.08]} />
    <rectAreaLight color="#d6e4ff" intensity={3.4} width={3} height={5} position={[1.2, 6.5, -5]} rotation={[0.15, Math.PI, 0]} />

    <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow={capabilities.shadows}>
      <planeGeometry args={[28, 24]} />
      <meshPhysicalMaterial
        color="#161a1f"
        metalness={qualityTier === 'low' ? 0.48 : 0.68}
        roughness={qualityTier === 'low' ? 0.36 : 0.24}
        clearcoat={qualityTier === 'high' ? 0.28 : 0.12}
        clearcoatRoughness={0.34}
      />
    </mesh>
    <mesh position={[0, 6.2, -7.8]} receiveShadow={capabilities.shadows}>
      <planeGeometry args={[28, 13]} />
      <meshStandardMaterial color="#0d1015" roughness={0.92} metalness={0.04} />
    </mesh>
    <mesh position={[-9.5, 5, -1.5]} rotation={[0, Math.PI / 2.5, 0]}>
      <planeGeometry args={[12, 10]} />
      <meshStandardMaterial color="#151920" roughness={0.88} metalness={0.06} />
    </mesh>

    <group ref={hero} position={[0, 0.08, 0]} rotation={[0.015, -0.32 + pulse * 0.035, -0.025]}>
      <mesh castShadow={capabilities.shadows} receiveShadow={capabilities.shadows}>
        <latheGeometry args={[profile, budget.radialSegments]} />
        <meshPhysicalMaterial
          color="#bdc7d0"
          metalness={0.82}
          roughness={qualityTier === 'low' ? 0.28 : 0.17}
          clearcoat={qualityTier === 'high' ? 0.58 : 0.32}
          clearcoatRoughness={0.2}
          sheen={qualityTier === 'high' ? 0.18 : 0}
          sheenColor="#dce8f2"
          sheenRoughness={0.42}
        />
      </mesh>
      <mesh position={[0, 3.42, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow={capabilities.shadows}>
        <torusGeometry args={[0.94, 0.055, qualityTier === 'low' ? 10 : 18, budget.radialSegments]} />
        <meshStandardMaterial color="#35251c" metalness={0.78} roughness={0.2} emissive="#c36c32" emissiveIntensity={0.18} />
      </mesh>
      <mesh position={[0, 3.43, 1.08]} scale={[0.38, 0.38, 0.12]}>
        <sphereGeometry args={[1, qualityTier === 'low' ? 20 : 36, qualityTier === 'low' ? 12 : 24]} />
        <meshPhysicalMaterial
          color="#ffb46e"
          emissive="#d45d24"
          emissiveIntensity={highlight}
          metalness={0.18}
          roughness={0.16}
          clearcoat={0.72}
          clearcoatRoughness={0.12}
        />
      </mesh>
      <mesh position={[0, 0.1, 0]} castShadow={capabilities.shadows}>
        <cylinderGeometry args={[1.1, 1.18, 0.2, budget.radialSegments]} />
        <meshStandardMaterial color="#20252a" metalness={0.74} roughness={0.31} />
      </mesh>
    </group>
  </group>;
}
