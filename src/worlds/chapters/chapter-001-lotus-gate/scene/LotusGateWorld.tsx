import { Float, RoundedBox, Sparkles, Torus } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group } from 'three';
import { Color } from 'three';

function LotusPetals() {
  const petals = useMemo(() => Array.from({ length: 12 }, (_, index) => ({ angle: (index / 12) * Math.PI * 2, radius: 2.8 + (index % 3) * 0.55, height: 0.7 + (index % 4) * 0.25 })), []);

  return <group>{petals.map((petal, index) => (
    <Float key={`${petal.angle}-${index}`} speed={1.4 + index * 0.05} rotationIntensity={0.15} floatIntensity={0.45}>
      <mesh position={[Math.cos(petal.angle) * petal.radius, petal.height, Math.sin(petal.angle) * petal.radius]} rotation={[0.2, petal.angle, 0.8]}>
        <capsuleGeometry args={[0.18, 0.8, 6, 12]} />
        <meshStandardMaterial color={new Color(index % 2 === 0 ? '#ffd5fb' : '#9af5ff')} emissive={new Color('#351544')} emissiveIntensity={1.2} />
      </mesh>
    </Float>
  ))}</group>;
}

export function LotusGateWorld({ pulse }: { pulse: number }) {
  const halo = useRef<Group>(null);
  const gate = useRef<Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (halo.current) {
      halo.current.rotation.y = t * 0.18;
      const scale = 1 + Math.sin(t * 1.4 + pulse) * 0.04;
      halo.current.scale.setScalar(scale);
    }
    if (gate.current) {
      gate.current.position.y = 1.4 + Math.sin(t * 0.7) * 0.08;
    }
  });

  return <group>
    <Sparkles count={120} scale={[13, 6, 13]} position={[0, 2.8, 0]} size={1.8} speed={0.25} color="#ffe0ff" />
    <group ref={gate}>
      <RoundedBox args={[2.5, 4.6, 0.42]} radius={0.08} smoothness={5} position={[0, 2.4, -0.1]} castShadow>
        <meshStandardMaterial color="#1d1531" metalness={0.6} roughness={0.25} emissive="#6d2bd1" emissiveIntensity={0.45} />
      </RoundedBox>
      <mesh position={[0, 2.35, 0.2]} castShadow>
        <torusGeometry args={[1.2, 0.12, 24, 96]} />
        <meshStandardMaterial color="#cbfbff" emissive="#7ae9ff" emissiveIntensity={2.8} />
      </mesh>
      <mesh position={[0, 1.25, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 1.8, 64]} />
        <meshBasicMaterial color="#62ceff" transparent opacity={0.2} />
      </mesh>
    </group>
    <group ref={halo} position={[0, 3.4, 0]}>
      <Torus args={[3.5, 0.08, 24, 120]} rotation-x={Math.PI / 2}><meshStandardMaterial color="#ffdefd" emissive="#ffa6ef" emissiveIntensity={1.8} /></Torus>
      <Torus args={[4.4, 0.04, 14, 80]} rotation={[Math.PI / 2, 0.35, 0]}><meshStandardMaterial color="#8aefff" emissive="#72e8ff" emissiveIntensity={1.5} /></Torus>
    </group>
    <LotusPetals />
  </group>;
}
