import { Float, Line, Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group } from 'three';

const STUDIES = {
  prism: { primary: '#7df9ff', secondary: '#e0a4ff', shape: 'crystal' },
  solar: { primary: '#ffd071', secondary: '#ff81ae', shape: 'sun' },
  tide: { primary: '#70e6ff', secondary: '#7e8fff', shape: 'pearl' },
  ember: { primary: '#ff784f', secondary: '#c08cff', shape: 'spindle' },
  aurora: { primary: '#75ffd1', secondary: '#d88cff', shape: 'relic' },
} as const;

type StudyName = keyof typeof STUDIES;

export function VisualStudy({ name, pulse }: { name: StudyName; pulse: number }) {
  const rig = useRef<Group>(null);
  const study = STUDIES[name];
  const paths = useMemo(() => Array.from({ length: 9 }, (_, i) => Array.from({ length: 20 }, (_, j) => {
    const y = j / 19 * 6 - 3;
    const radius = 1.8 + i * 0.23;
    return [Math.sin(y * (name === 'ember' ? 1.5 : 0.72) + i * 0.65) * radius, y, Math.cos(y + i) * (name === 'tide' ? 0.35 : 0.7)] as [number, number, number];
  })), [name]);

  useFrame(({ clock }) => {
    if (!rig.current) return;
    rig.current.rotation.y = clock.elapsedTime * 0.1 + pulse * 0.025;
    rig.current.rotation.z = Math.sin(clock.elapsedTime * 0.19 + pulse) * 0.06;
  });

  const geometry = study.shape === 'sun'
    ? <sphereGeometry args={[1.45, 40, 28]} />
    : study.shape === 'spindle'
      ? <cylinderGeometry args={[0.55, 1.35, 5.8, 8]} />
      : study.shape === 'pearl'
        ? <sphereGeometry args={[1.2, 32, 24]} />
        : study.shape === 'relic'
          ? <dodecahedronGeometry args={[1.65, 0]} />
          : <icosahedronGeometry args={[1.65, 1]} />;

  return <group position={[0, 3.2, 0]}>
    <Sparkles count={name === 'aurora' ? 130 : 90} scale={[14, 8, 14]} size={2} speed={0.18} color={study.primary} />
    <Float speed={0.65} floatIntensity={0.3}>
      <group ref={rig}>
        <mesh>{geometry}<meshStandardMaterial color="#172039" emissive={study.primary} emissiveIntensity={1.65} metalness={0.6} roughness={0.16} /></mesh>
        <mesh scale={0.67}><icosahedronGeometry args={[1.65, 1]} /><meshBasicMaterial color={study.secondary} wireframe transparent opacity={0.72} /></mesh>
        {[0, 1, 2].map((i) => <mesh key={i} rotation={[Math.PI / 2 + i * 0.38, i * 0.7, 0]}><torusGeometry args={[2.35 + i * 0.62, 0.045 + i * 0.012, 10, 96]} /><meshBasicMaterial color={i === 1 ? study.secondary : study.primary} transparent opacity={0.72} /></mesh>)}
      </group>
    </Float>
    {paths.map((points, i) => <Line key={i} points={points} color={i % 2 ? study.primary : study.secondary} lineWidth={name === 'ember' ? 2.2 : 1.15} transparent opacity={name === 'tide' ? 0.28 : 0.48} />)}
  </group>;
}
