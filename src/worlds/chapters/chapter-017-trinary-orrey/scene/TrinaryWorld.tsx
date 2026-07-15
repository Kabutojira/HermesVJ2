import { Line, Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group } from 'three';
import type { WorldSceneProps } from '../../../registry';
import { getTrinaryOrbitLayout } from '../../../shared/spaceVisuals';

const ORBIT_INDEXES = [0, 1, 2, 3] as const;
const STAR_COLORS = ['#ffcb70', '#76dfff', '#ff739c'] as const;
const PLANET_COLORS = ['#cf7dff', '#829cff', '#d9a96c', '#71d7c2'] as const;

export function TrinaryWorld({ pulse, qualityTier, reducedMotion }: WorldSceneProps) {
  const stars = useRef<Group>(null);
  const orbitPivots = useRef<Array<Group | null>>([]);
  const lineSegments = qualityTier === 'low' ? 24 : qualityTier === 'medium' ? 38 : 56;
  const radialSegments = qualityTier === 'low' ? 16 : qualityTier === 'medium' ? 24 : 32;
  const particleCount = qualityTier === 'low' ? 48 : qualityTier === 'medium' ? 84 : 132;
  const orbits = useMemo(
    () => ORBIT_INDEXES.map((index) => getTrinaryOrbitLayout(index, pulse, lineSegments)),
    [lineSegments, pulse],
  );

  useFrame(({ clock }) => {
    const time = reducedMotion ? 0 : clock.elapsedTime;
    if (stars.current) stars.current.rotation.y = time * 0.07 + pulse * 0.08;
    orbitPivots.current.forEach((pivot, index) => {
      if (pivot) pivot.rotation.y = index * 1.63 + pulse * 0.14 + time * (0.19 - index * 0.027);
    });
  });

  const phase = pulse % 4;

  return <group position={[0, 2.6, 0]}>
    <ambientLight color="#6d72aa" intensity={0.3} />
    <Sparkles count={particleCount} scale={[17, 10, 15]} size={1.25} speed={reducedMotion ? 0 : 0.12} color="#d7e7ff" />

    <group ref={stars}>
      {STAR_COLORS.map((color, index) => {
        const angle = index * Math.PI * 2 / 3;
        const position: [number, number, number] = [
          Math.cos(angle) * 1.55,
          index === 1 ? 0.38 : index === 2 ? -0.26 : 0,
          Math.sin(angle) * 1.55,
        ];
        return <group key={color} position={position}>
          <pointLight color={color} intensity={2.2 + phase * 0.45} distance={9} />
          <mesh>
            <sphereGeometry args={[0.72 - index * 0.09, radialSegments, radialSegments]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.1 + phase * 0.45} roughness={0.28} />
          </mesh>
          <mesh scale={1.32}>
            <sphereGeometry args={[0.72 - index * 0.09, 16, 12]} />
            <meshBasicMaterial color={color} transparent opacity={0.1 + phase * 0.025} />
          </mesh>
        </group>;
      })}
    </group>

    {orbits.map((orbit, index) => <group key={index} rotation={orbit.rotation}>
      <Line
        points={orbit.guidePoints}
        color={PLANET_COLORS[index]}
        lineWidth={qualityTier === 'low' ? 0.6 : 0.9}
        transparent
        opacity={0.28 + phase * 0.05}
      />
      <group
        ref={(node) => { orbitPivots.current[index] = node; }}
        rotation={[0, index * 1.63 + pulse * 0.14, 0]}
      >
        <group position={[orbit.radius, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.2 + index * 0.055, 16, 12]} />
            <meshStandardMaterial color={PLANET_COLORS[index]} emissive={PLANET_COLORS[index]} emissiveIntensity={0.28 + phase * 0.12} roughness={0.66} />
          </mesh>
          {index > 1 ? <mesh rotation={[Math.PI / 2.4, 0, 0]}>
            <torusGeometry args={[0.34 + index * 0.045, 0.018, 6, 28]} />
            <meshBasicMaterial color="#e9d9ff" transparent opacity={0.55} />
          </mesh> : null}
        </group>
      </group>
    </group>)}
  </group>;
}
