import { Line, Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group } from 'three';
import type { WorldSceneProps } from '../registry';
import { createFountainArcs, getElementalBudget, getElementalPulseState } from './elementalVisuals';

const STUDIES = {
  tempest: { primary: '#79e8ff', secondary: '#eee9ff', dark: '#10182f' },
  cinder: { primary: '#ff6b35', secondary: '#ffc15c', dark: '#2a0d12' },
  nebula: { primary: '#8bf5ff', secondary: '#c58cff', dark: '#11142c' },
  frost: { primary: '#a9efff', secondary: '#738cff', dark: '#101b38' },
  thunder: { primary: '#66d9ff', secondary: '#ffd36a', dark: '#17182e' },
} as const;

type ElementalName = keyof typeof STUDIES;
type Point = [number, number, number];

function seeded(index: number, salt: number) {
  return ((Math.sin(index * 91.7 + salt * 47.3) * 43758.5453) % 1 + 1) % 1;
}

function makeStreaks(count: number, frost: boolean): Point[][] {
  return Array.from({ length: count }, (_, index) => {
    const x = seeded(index, 1) * 13 - 6.5;
    const y = seeded(index, 2) * 9 - 1.5;
    const z = seeded(index, 3) * 8 - 4;
    return [[x, y, z], [x + (frost ? 0.25 : -0.55), y - (frost ? 0.75 : 1.6), z]];
  });
}

function makeBranches(count: number, segments: number): Point[][] {
  return Array.from({ length: count }, (_, branch) => Array.from({ length: segments }, (_, segment) => {
    const progress = segment / (segments - 1);
    const angle = (branch / count) * Math.PI * 2;
    const radius = progress * 5.4;
    const jitter = Math.sin(segment * 3.17 + branch * 5.3) * 0.32 * progress;
    return [Math.cos(angle) * radius + jitter, 4.8 - progress * 4.1, Math.sin(angle) * radius - jitter] as Point;
  }));
}

function makeMoltenPaths(count: number, segments: number): Point[][] {
  return Array.from({ length: count }, (_, lane) => Array.from({ length: segments }, (_, segment) => {
    const progress = segment / (segments - 1);
    const angle = (lane / count) * Math.PI * 2 + Math.sin(progress * 5 + lane) * 0.32;
    const radius = 1.2 + progress * 5.1;
    return [Math.cos(angle) * radius, 0.08 + Math.sin(progress * Math.PI) * 0.3, Math.sin(angle) * radius] as Point;
  }));
}

export function ElementalVisualStudy({ name, pulse, qualityTier, reducedMotion }: WorldSceneProps & { name: ElementalName }) {
  const rig = useRef<Group>(null);
  const palette = STUDIES[name];
  const budget = getElementalBudget(qualityTier);
  const pulseState = getElementalPulseState(pulse, reducedMotion);
  const weather = useMemo(() => makeStreaks(qualityTier === 'low' ? 18 : qualityTier === 'medium' ? 30 : 44, name === 'frost'), [name, qualityTier]);
  const branches = useMemo(() => makeBranches(qualityTier === 'low' ? 5 : 9, budget.lineSegments), [budget.lineSegments, qualityTier]);
  const molten = useMemo(() => makeMoltenPaths(qualityTier === 'low' ? 5 : 8, budget.lineSegments), [budget.lineSegments, qualityTier]);
  const fountain = useMemo(() => createFountainArcs(11, budget.lineSegments), [budget.lineSegments]);
  const crownCount = qualityTier === 'low' ? 7 : 11;
  const crown = useMemo(() => Array.from({ length: crownCount }, (_, index) => {
    const angle = (index / crownCount) * Math.PI * 2;
    return { angle, position: [Math.cos(angle) * 1.55, 1.45 + (index % 2) * 0.45, Math.sin(angle) * 1.55] as Point };
  }), [crownCount]);
  const hammerCount = qualityTier === 'low' ? 6 : 10;
  const hammers = useMemo(() => Array.from({ length: hammerCount }, (_, index) => {
    const angle = (index / hammerCount) * Math.PI * 2;
    return { angle, position: [Math.cos(angle) * 2.55, 1.55, Math.sin(angle) * 2.55] as Point };
  }), [hammerCount]);
  const reflectedBranches = useMemo(() => branches.slice(0, 4).map((points) => points.map(([x, y, z]) => [-x, y - 0.5, -z] as Point)), [branches]);

  useFrame(({ clock }) => {
    if (!rig.current) return;
    rig.current.rotation.y = pulseState.animate ? clock.elapsedTime * 0.08 + pulse * 0.09 : pulse * 0.09;
    rig.current.rotation.z = pulseState.animate ? Math.sin(clock.elapsedTime * 0.23) * 0.035 : 0;
  });

  const lineColor = name === 'cinder' || name === 'thunder' ? palette.secondary : palette.primary;
  const effectLines = name === 'nebula' ? fountain.map((arc) => arc.points) : name === 'cinder' ? molten : name === 'tempest' || name === 'thunder' ? branches : weather;

  return <group position={[0, 1.15, 0]}>
    <ambientLight color={palette.primary} intensity={0.35} />
    <pointLight color={palette.primary} intensity={pulseState.lightIntensity} distance={18} position={[0, 3.2, 1]} />
    <pointLight color={palette.secondary} intensity={pulseState.lightIntensity * 0.6} distance={14} position={[-3, 2, -2]} />
    <Sparkles count={budget.particles} scale={[13, 8, 10]} size={1.4 + (pulse % 4) * 0.35} speed={reducedMotion ? 0 : 0.24} color={palette.primary} />
    <group scale={pulseState.effectScale}>
      {effectLines.map((points, index) => <Line key={index} points={points} color={index % 3 === 1 ? palette.secondary : lineColor} lineWidth={name === 'cinder' ? 2.2 : 1.25} transparent opacity={pulseState.effectOpacity} />)}
      {name === 'tempest' ? weather.map((points, index) => <Line key={`rain-${index}`} points={points} color="#9edfff" lineWidth={0.65} transparent opacity={pulseState.effectOpacity * 0.55} />) : null}
      {name === 'frost' ? crown.map(({ angle, position }, index) => <mesh key={index} position={position} rotation={[0, -angle, -0.24]}><coneGeometry args={[0.22, 2.5, 5]} /><meshStandardMaterial color={palette.dark} emissive={palette.primary} emissiveIntensity={1.1 + (pulse % 4) * 0.3} roughness={0.22} /></mesh>) : null}
      {name === 'thunder' ? reflectedBranches.map((points, index) => <Line key={`gold-${index}`} points={points} color={palette.secondary} lineWidth={1.8} transparent opacity={pulseState.effectOpacity} />) : null}
    </group>
    <group ref={rig}>
      {name === 'tempest' ? <><mesh position={[0, 2.2, 0]}><cylinderGeometry args={[1.05, 0.72, 3.6, budget.radialSegments]} /><meshStandardMaterial color={palette.dark} emissive={palette.primary} emissiveIntensity={1.5 + (pulse % 4) * 0.35} metalness={0.7} roughness={0.2} /></mesh><mesh position={[0, 2.2, 0]}><sphereGeometry args={[0.72, budget.radialSegments, 12]} /><meshBasicMaterial color={palette.secondary} transparent opacity={0.68} /></mesh></> : null}
      {name === 'cinder' ? <>{[0, 1, 2].map((index) => <mesh key={index} position={[(index - 1) * 0.72, 1.4 + index * 0.35, 0]} scale={[1, 1 + (pulse % 4) * 0.08, 1]}><coneGeometry args={[1.15 - index * 0.2, 4.6 - index * 0.5, budget.radialSegments]} /><meshStandardMaterial color={index === 1 ? palette.secondary : palette.primary} emissive={palette.primary} emissiveIntensity={1.4 + (pulse % 4) * 0.45} transparent opacity={0.5} /></mesh>)}<mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[2.4, 0.34, 10, budget.radialSegments * 2]} /><meshStandardMaterial color={palette.dark} emissive={palette.secondary} emissiveIntensity={1.8} /></mesh></> : null}
      {name === 'nebula' ? <><mesh position={[0, 1.1, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[2.25, 0.58, budget.radialSegments, budget.radialSegments * 2]} /><meshStandardMaterial color={palette.dark} emissive={palette.secondary} emissiveIntensity={1.25 + (pulse % 4) * 0.35} metalness={0.68} roughness={0.16} /></mesh><mesh position={[0, 1.1, 0]}><sphereGeometry args={[0.78, budget.radialSegments, 16]} /><meshBasicMaterial color={palette.primary} transparent opacity={0.7} /></mesh></> : null}
      {name === 'frost' ? <mesh position={[0, 1.1, 0]}><octahedronGeometry args={[1.15, qualityTier === 'high' ? 2 : 1]} /><meshStandardMaterial color={palette.dark} emissive={palette.primary} emissiveIntensity={1.4 + (pulse % 4) * 0.4} metalness={0.45} roughness={0.12} /></mesh> : null}
      {name === 'thunder' ? <><mesh position={[0, 1.55, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[2.55, 0.16, 10, budget.radialSegments * 2]} /><meshStandardMaterial color={palette.dark} emissive={palette.secondary} emissiveIntensity={1.45 + (pulse % 4) * 0.35} metalness={0.82} roughness={0.18} /></mesh>{hammers.map(({ angle, position }, index) => <group key={index} position={position} rotation={[0, -angle, 0]}><mesh><boxGeometry args={[0.56, 0.75, 0.48]} /><meshStandardMaterial color="#292b3d" emissive={index % 2 ? palette.primary : palette.secondary} emissiveIntensity={1.05} metalness={0.9} /></mesh><mesh position={[0, -0.68, 0]}><cylinderGeometry args={[0.09, 0.09, 0.75, 8]} /><meshStandardMaterial color="#9b6c36" metalness={0.6} /></mesh></group>)}</> : null}
    </group>
  </group>;
}
