import { Environment, Lightformer } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import type { Group, MeshStandardMaterial } from 'three';
import type { WorldSceneProps } from '../../../registry';
import { galleryBudget, shouldUsePhysicalGlass } from './galleryData';

export function GlassGalleryWorld({ pulse, qualityTier, reducedMotion, capabilities }: WorldSceneProps) {
  const budget = galleryBudget[qualityTier];
  const pavilion = useRef<Group>(null);
  const seam = useRef<MeshStandardMaterial>(null);
  const pulseEnergy = useRef(0);
  const physicalGlass = shouldUsePhysicalGlass(qualityTier);

  useEffect(() => { pulseEnergy.current = 1; }, [pulse]);
  useFrame((state, delta) => {
    pulseEnergy.current = Math.max(0, pulseEnergy.current - delta * 0.55);
    if (pavilion.current && !reducedMotion) pavilion.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.055;
    if (seam.current) seam.current.emissiveIntensity = 0.75 + pulseEnergy.current * 2.8;
  });

  return <group>
    {physicalGlass && capabilities.reflectionSize > 0 && <Environment background={false} frames={1} resolution={Math.min(256, capabilities.reflectionSize)}>
      <Lightformer form="rect" color="#ffe0ad" intensity={4.5} position={[0, 5, -5]} scale={[8, 1, 1]} />
      <Lightformer form="rect" color="#b8edf0" intensity={3.2} position={[-5, 2, 1]} rotation={[0, Math.PI / 2, 0]} scale={[5, 1, 1]} />
      <Lightformer form="rect" color="#e5d8c6" intensity={2.6} position={[5, 1, 2]} rotation={[0, -Math.PI / 2, 0]} scale={[3, 1, 1]} />
    </Environment>}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow={capabilities.shadows}>
      <planeGeometry args={[24, 22]} />
      <meshStandardMaterial color="#cbc4b8" roughness={0.68} metalness={0.04} />
    </mesh>
    <mesh position={[0, 6.9, -6.8]} receiveShadow={capabilities.shadows}>
      <boxGeometry args={[23, 13.8, 0.35]} />
      <meshStandardMaterial color="#202126" roughness={0.82} />
    </mesh>

    {Array.from({ length: budget.columns }, (_, index) => {
      const side = index % 2 ? 1 : -1;
      const row = Math.floor(index / 2);
      return <group key={index} position={[side * 7.1, 3.25, 3.6 - row * 4.2]}>
        <mesh castShadow={capabilities.shadows && index < 4} receiveShadow={capabilities.shadows}>
          <cylinderGeometry args={[0.52, 0.62, 6.5, qualityTier === 'low' ? 8 : 16]} />
          <meshStandardMaterial color="#b8b0a4" roughness={0.52} metalness={0.08} />
        </mesh>
        <mesh position={[0, -3.08, 0]}>
          <cylinderGeometry args={[0.86, 0.92, 0.34, 12]} />
          <meshStandardMaterial color="#6f6a64" roughness={0.44} />
        </mesh>
      </group>;
    })}

    <group ref={pavilion} position={[-0.5, 0, -0.9]}>
      <mesh position={[0, 0.42, 0]} receiveShadow={capabilities.shadows}>
        <cylinderGeometry args={[4.2, 4.5, 0.82, 8]} />
        <meshStandardMaterial color="#393b3d" roughness={0.26} metalness={0.28} />
      </mesh>
      <mesh position={[0, 3.15, 0]} castShadow={capabilities.shadows}>
        <icosahedronGeometry args={[3.15, qualityTier === 'high' ? 2 : 1]} />
        {physicalGlass
          ? <meshPhysicalMaterial color="#d8eeee" roughness={0.12} metalness={0.02} transmission={0.82} thickness={0.72} ior={1.5} attenuationColor="#9fc8c7" attenuationDistance={3.8} envMapIntensity={1.65} clearcoat={0.35} clearcoatRoughness={0.16} />
          : <meshStandardMaterial color="#8fb9bc" roughness={0.18} metalness={0.16} transparent opacity={0.5} />}
      </mesh>
      <mesh position={[0, 3.15, 0]} scale={1.012}>
        <icosahedronGeometry args={[3.15, 1]} />
        <meshStandardMaterial ref={seam} color="#27383a" emissive="#bde8e6" emissiveIntensity={0.75} wireframe transparent opacity={0.36} />
      </mesh>
      <mesh position={[0, 3.15, 0]} scale={[0.2, 1.13, 0.2]}>
        <octahedronGeometry args={[2.5, 0]} />
        <meshStandardMaterial color="#c6a15d" metalness={0.86} roughness={0.18} />
      </mesh>
    </group>

    {[-4.8, 0, 4.8].map((x) => <group key={x} position={[x, 6.4, -5.9]}>
      <mesh>
        <boxGeometry args={[3.4, 0.12, 0.45]} />
        <meshStandardMaterial color="#fff1d5" emissive="#fff1d5" emissiveIntensity={2.1} />
      </mesh>
      <rectAreaLight width={3.4} height={0.35} color="#ffe4ba" intensity={8} position={[0, -0.2, 0.2]} rotation={[-Math.PI / 2, 0, 0]} />
    </group>)}
    <spotLight position={[5.5, 10, 6]} color="#fff0d6" intensity={85} angle={0.48} penumbra={0.86} distance={28} castShadow={capabilities.shadows} />
    <pointLight position={[-5, 4, 1]} color="#a8dbe2" intensity={12} distance={14} decay={2} />
  </group>;
}
