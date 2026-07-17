import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import type { Group, LineSegments, MeshStandardMaterial } from 'three';
import type { WorldSceneProps } from '../../../registry';
import { cityBudget, createCityBlocks, createRain } from './cityData';

export function NeonRainCityWorld({ pulse, qualityTier, reducedMotion, capabilities }: WorldSceneProps) {
  const budget = cityBudget[qualityTier];
  const blocks = useMemo(() => createCityBlocks(budget.buildings), [budget.buildings]);
  const rain = useMemo(() => createRain(budget.rain), [budget.rain]);
  const rainRef = useRef<LineSegments>(null);
  const towerRef = useRef<Group>(null);
  const signMaterial = useRef<MeshStandardMaterial>(null);
  const pulseEnergy = useRef(0);

  useEffect(() => { pulseEnergy.current = 1; }, [pulse]);
  useFrame((state, delta) => {
    if (!reducedMotion && rainRef.current) rainRef.current.position.y = -((state.clock.elapsedTime * 4.2) % 3.2);
    pulseEnergy.current = Math.max(0, pulseEnergy.current - delta * 0.75);
    if (towerRef.current && !reducedMotion) towerRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.09) * 0.035;
    if (signMaterial.current) signMaterial.current.emissiveIntensity = 2.2 + pulseEnergy.current * 2.4;
  });

  return <group>
    <group ref={towerRef} position={[-1.4, 0, -1.8]}>
      <mesh position={[0, 5.3, 0]} castShadow={capabilities.shadows}>
        <boxGeometry args={[3.1, 10.6, 2.8]} />
        <meshStandardMaterial color="#111624" metalness={0.56} roughness={0.3} />
      </mesh>
      <mesh position={[0, 11.1, 0]}>
        <cylinderGeometry args={[0.07, 0.12, 3.2, 8]} />
        <meshStandardMaterial color="#8199a5" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 8.7, 0.05]} castShadow={capabilities.shadows}>
        <octahedronGeometry args={[2.05, 0]} />
        <meshStandardMaterial ref={signMaterial} color="#172332" emissive="#39dff5" emissiveIntensity={2.2} metalness={0.35} roughness={0.2} />
      </mesh>
      {[-2.6, -0.8, 1, 2.8, 4.6].map((y, index) => <mesh key={y} position={[0, y + 5.2, 1.43]}>
        <boxGeometry args={[2.35, 0.08, 0.04]} />
        <meshStandardMaterial color={index % 2 ? '#ff4fb4' : '#46e6ff'} emissive={index % 2 ? '#ff4fb4' : '#46e6ff'} emissiveIntensity={1.7} />
      </mesh>)}
    </group>

    {blocks.map((block, index) => <group key={index} position={[block.x, block.height / 2, block.z]}>
      <mesh castShadow={capabilities.shadows && index < 8} receiveShadow={capabilities.shadows}>
        <boxGeometry args={[block.width, block.height, block.depth]} />
        <meshStandardMaterial color={block.tone > 0.5 ? '#151a24' : '#0b1019'} metalness={0.2} roughness={0.7} />
      </mesh>
      <mesh position={[-Math.sign(block.x) * (block.width / 2 + 0.012), block.height * 0.12, 0]}>
        <boxGeometry args={[0.025, Math.max(0.7, block.height * 0.52), block.depth * 0.68]} />
        <meshStandardMaterial color={index % 3 ? '#13262c' : '#321728'} emissive={index % 3 ? '#237383' : '#842555'} emissiveIntensity={0.24} />
      </mesh>
    </group>)}

    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow={capabilities.shadows} position={[0, 0.02, 0]}>
      <planeGeometry args={[18, 28]} />
      <meshStandardMaterial color="#080b10" metalness={0.18} roughness={0.54} />
    </mesh>
    {[
      [-2.5, 0.045, 1.8, 1.1, 6.5, '#36cbe0'],
      [2.2, 0.048, -2.1, 0.85, 4.4, '#d64697'],
      [-0.5, 0.05, -6.1, 1.4, 3.2, '#41b8ca'],
    ].map(([x, y, z, width, length, color], index) => <mesh key={index} rotation={[-Math.PI / 2, 0, index * 0.17]} position={[x as number, y as number, z as number]}>
      <planeGeometry args={[width as number, length as number]} />
      <meshStandardMaterial color="#081317" emissive={color as string} emissiveIntensity={0.018} metalness={0.32} roughness={0.1} transparent opacity={0.78} />
    </mesh>)}

    <lineSegments ref={rainRef} position={[0, 1.6, 0]}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[rain, 3]} /></bufferGeometry>
      <lineBasicMaterial color="#b9e9f4" transparent opacity={qualityTier === 'low' ? 0.26 : 0.4} depthWrite={false} />
    </lineSegments>
    <spotLight position={[-1, 10, 4]} target-position={[-1, 0, -3]} color="#d9f5ff" intensity={70} angle={0.55} penumbra={0.8} distance={26} castShadow={capabilities.shadows} />
    <pointLight position={[-3, 2.2, 1]} color="#36d7ee" intensity={16} distance={11} decay={2} />
    <pointLight position={[3, 2, -3]} color="#ff4fae" intensity={13} distance={10} decay={2} />
  </group>;
}
