import { Line, Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group } from 'three';

function DebrisField() {
  const debris = useMemo(() => Array.from({ length: 32 }, (_, index) => ({ x: Math.sin(index * 0.8) * (4 + (index % 4)), y: 1.2 + (index % 7) * 0.5, z: Math.cos(index * 0.8) * (4 + ((index + 1) % 4)), size: 0.16 + (index % 3) * 0.12 })), []);

  return <group>{debris.map((item, index) => (
    <mesh key={`${item.x}-${item.y}-${index}`} position={[item.x, item.y, item.z]} rotation={[index * 0.2, index * 0.1, 0.3]} castShadow>
      <octahedronGeometry args={[item.size, 0]} />
      <meshStandardMaterial color={index % 2 === 0 ? '#ffd791' : '#9bc6ff'} emissive={index % 2 === 0 ? '#9f5311' : '#1c3e8c'} emissiveIntensity={0.75} />
    </mesh>
  ))}</group>;
}

export function WormholeSpireWorld({ pulse }: { pulse: number }) {
  const rig = useRef<Group>(null);
  const ribbonPoints = useMemo(() => Array.from({ length: 24 }, (_, index) => {
    const t = index / 23;
    return [Math.sin(t * Math.PI * 2.4) * 1.5, 1.2 + t * 9.5, Math.cos(t * Math.PI * 2.4) * 1.5] as [number, number, number];
  }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (rig.current) {
      rig.current.rotation.y = t * 0.22;
      rig.current.position.y = Math.sin(t * 0.8 + pulse) * 0.1;
    }
  });

  return <group ref={rig}>
    <Sparkles count={140} scale={[16, 11, 16]} position={[0, 4.5, 0]} size={2.1} speed={0.4} color="#ffe0a2" />
    <mesh position={[0, 3.2, 0]} castShadow><cylinderGeometry args={[0.65, 1.4, 6.5, 12]} /><meshStandardMaterial color="#1f1736" metalness={0.75} roughness={0.25} emissive="#6543ff" emissiveIntensity={0.45} /></mesh>
    <mesh position={[0, 6.8, 0]} castShadow><icosahedronGeometry args={[1.1, 1]} /><meshStandardMaterial color="#ffe6a8" emissive="#ffba45" emissiveIntensity={1.7} /></mesh>
    <mesh position={[0, 1.1, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[2.8, 0.14, 16, 120]} /><meshStandardMaterial color="#98cbff" emissive="#6ba7ff" emissiveIntensity={1.4} /></mesh>
    <Line points={ribbonPoints} color="#ffeec9" lineWidth={3.5} />
    <DebrisField />
  </group>;
}
