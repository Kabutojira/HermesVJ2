import { Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  CanvasTexture,
  DoubleSide,
  SRGBColorSpace,
  type Group,
  type Points,
} from 'three';

import type { WorldSceneProps } from '../registry';
import {
  SATURN_ORBIT_SHOTS,
  createPlasmaParticles,
  getStationMotion,
} from './saturnOrbit';

function createSaturnTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Unable to create Saturn texture');

  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  const bands = [
    [0, '#80684d'], [0.08, '#c6aa78'], [0.16, '#e7d29d'], [0.24, '#a98960'],
    [0.34, '#d9bf8a'], [0.43, '#f0dfb0'], [0.52, '#b89a6d'], [0.61, '#dfc895'],
    [0.72, '#9c7d58'], [0.82, '#ead6a6'], [0.92, '#b79569'], [1, '#6f5945'],
  ] as const;
  bands.forEach(([offset, color]) => gradient.addColorStop(offset, color));
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let band = 0; band < 44; band += 1) {
    const y = band / 44 * canvas.height;
    const alpha = 0.025 + (band % 5) * 0.009;
    context.fillStyle = band % 2 ? `rgba(255,244,205,${alpha})` : `rgba(62,42,35,${alpha})`;
    context.fillRect(0, y, canvas.width, 2 + (band % 3));
  }

  context.fillStyle = 'rgba(126,82,54,0.34)';
  context.beginPath();
  context.ellipse(366, 154, 40, 8, -0.08, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = 'rgba(242,214,161,0.28)';
  context.beginPath();
  context.ellipse(358, 152, 23, 3.5, -0.08, 0, Math.PI * 2);
  context.fill();

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function Saturn({ segments }: { segments: number }) {
  const texture = useMemo(createSaturnTexture, []);
  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <group rotation={[0.12, 0, -0.16]}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[5.2, segments, Math.max(20, Math.floor(segments / 2))]} />
        <meshStandardMaterial map={texture} color="#d8bc87" roughness={0.94} metalness={0.01} />
      </mesh>
      <mesh rotation={[1.02, 0, 0]}>
        <ringGeometry args={[6.15, 9.2, segments * 2, 4]} />
        <meshStandardMaterial color="#c7ad83" emissive="#594c3c" emissiveIntensity={0.12} transparent opacity={0.56} side={DoubleSide} roughness={0.78} depthWrite={false} />
      </mesh>
      <mesh rotation={[1.02, 0, 0]}>
        <ringGeometry args={[6.85, 7.18, segments * 2, 2]} />
        <meshBasicMaterial color="#2b211d" transparent opacity={0.72} side={DoubleSide} depthWrite={false} />
      </mesh>
      <mesh rotation={[1.02, 0, 0]}>
        <ringGeometry args={[7.62, 8.88, segments * 2, 3]} />
        <meshBasicMaterial color="#ead7ad" transparent opacity={0.28} side={DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Station({ segments, pulse }: { segments: number; pulse: number }) {
  const phase = pulse % 4;
  const spokes = [0, 1, 2, 3, 4, 5];

  return (
    <group scale={1 + phase * 0.018}>
      <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
        <torusGeometry args={[1.55, 0.16, 10, segments]} />
        <meshStandardMaterial color="#8793a6" emissive="#80dfff" emissiveIntensity={0.28 + phase * 0.12} metalness={0.9} roughness={0.22} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[1.92, 0.055, 7, segments]} />
        <meshBasicMaterial color="#8be9ff" transparent opacity={0.74} />
      </mesh>
      {spokes.map((index) => (
        <mesh key={index} rotation={[index * Math.PI / 3, 0, 0]} position={[0, Math.cos(index * Math.PI / 3) * 0.78, Math.sin(index * Math.PI / 3) * 0.78]}>
          <boxGeometry args={[0.12, 1.55, 0.08]} />
          <meshStandardMaterial color="#485467" metalness={0.86} roughness={0.28} />
        </mesh>
      ))}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.42, 0.42, 4.8, 16]} />
        <meshStandardMaterial color="#66758a" emissive="#d6ecff" emissiveIntensity={0.18} metalness={0.9} roughness={0.2} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 1.95, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.68, 0.5, 0.9, 12]} />
            <meshStandardMaterial color="#333e50" emissive="#ffcd82" emissiveIntensity={0.16 + phase * 0.08} metalness={0.78} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.82, 0]} scale={[0.7, 0.08, 0.38]}>
            <boxGeometry />
            <meshStandardMaterial color="#182d55" emissive="#4da4ff" emissiveIntensity={0.38} metalness={0.62} roughness={0.34} />
          </mesh>
          <mesh position={[0, -0.82, 0]} scale={[0.7, 0.08, 0.38]}>
            <boxGeometry />
            <meshStandardMaterial color="#182d55" emissive="#4da4ff" emissiveIntensity={0.38} metalness={0.62} roughness={0.34} />
          </mesh>
        </group>
      ))}
      {[-0.75, 0, 0.75].map((offset) => (
        <mesh key={offset} position={[offset, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.62, 0.045, 6, Math.max(16, Math.floor(segments / 2))]} />
          <meshBasicMaterial color="#d7ebff" transparent opacity={0.55} />
        </mesh>
      ))}
    </group>
  );
}

export function SaturnOrbitWorld({ shotIndex, pulse, qualityTier, reducedMotion }: WorldSceneProps & { shotIndex: number }) {
  const shot = SATURN_ORBIT_SHOTS[shotIndex];
  const carrier = useRef<Group>(null);
  const station = useRef<Group>(null);
  const plasma = useRef<Points>(null);
  const segments = qualityTier === 'low' ? 24 : qualityTier === 'medium' ? 36 : 48;
  const particles = useMemo(() => createPlasmaParticles(qualityTier, 770 + shotIndex * 97), [qualityTier, shotIndex]);
  const particlePositions = useMemo(() => new Float32Array(particles.flatMap(({ position }) => position)), [particles]);
  const pulsePhase = pulse % 4;
  const night = shot.lighting === 'night';

  useFrame(({ clock }) => {
    if (!carrier.current || !station.current || !plasma.current) return;
    const elapsed = reducedMotion ? 0 : clock.elapsedTime;
    const motion = getStationMotion(elapsed, shot.orbitPhase);
    const baseline = getStationMotion(0, shot.orbitPhase);
    const orbitDelta = motion.orbitalAngle - baseline.orbitalAngle;

    station.current.rotation.x = shot.stationRotation[0] + motion.axialRotation;
    station.current.rotation.y = shot.stationRotation[1];
    station.current.rotation.z = shot.stationRotation[2];
    carrier.current.position.x = shot.stationPosition[0] + Math.sin(orbitDelta) * 2.2;
    carrier.current.position.y = shot.stationPosition[1] + (1 - Math.cos(orbitDelta)) * 2.2;
    plasma.current.rotation.x = reducedMotion ? 0 : elapsed * 0.16;
  });

  return (
    <group>
      <ambientLight color={night ? '#27385c' : '#9cb4cf'} intensity={night ? 0.08 : 0.22} />
      <directionalLight
        castShadow={qualityTier !== 'low'}
        color={shot.lighting === 'terminator' ? '#ffd0a0' : '#fff0ce'}
        intensity={night ? 1.2 : 4.8}
        position={shot.sunPosition}
      />
      <pointLight color={shot.plasmaColor} intensity={2.4 + pulsePhase * 0.55} distance={13} position={shot.stationPosition} />
      <Sparkles count={qualityTier === 'low' ? 42 : qualityTier === 'medium' ? 72 : 108} scale={[22, 15, 18]} size={qualityTier === 'low' ? 0.75 : 1.05} speed={reducedMotion ? 0 : 0.05} color={night ? '#b6c8ff' : '#e2efff'} opacity={night ? 0.78 : 0.52} />

      <group position={shot.saturnPosition}>
        <Saturn segments={segments} />
      </group>

      <group ref={carrier} position={shot.stationPosition}>
        <group ref={station}>
          <Station segments={segments} pulse={pulse} />
        </group>
        <group rotation={[0, 0, shot.stationRotation[2]]}>
          <points ref={plasma} position={[0.2, 0, 0]}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
            </bufferGeometry>
            <pointsMaterial color={shot.plasmaColor} size={0.17 + pulsePhase * 0.022} transparent opacity={0.92} depthWrite={false} depthTest={false} blending={AdditiveBlending} sizeAttenuation />
          </points>
          <mesh position={[-0.25, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[1.25 + pulsePhase * 0.08, 4.8, segments, 1, true]} />
            <meshBasicMaterial color={shot.plasmaColor} transparent opacity={0.18 + pulsePhase * 0.025} side={DoubleSide} depthWrite={false} depthTest={false} blending={AdditiveBlending} />
          </mesh>
          <mesh position={[1.38, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[1.2, 0.06 + pulsePhase * 0.012, 8, segments]} />
            <meshBasicMaterial color="#eafaff" transparent opacity={0.46 + pulsePhase * 0.06} depthWrite={false} blending={AdditiveBlending} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
