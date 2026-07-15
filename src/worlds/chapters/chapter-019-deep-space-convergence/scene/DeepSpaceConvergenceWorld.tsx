import { Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { DoubleSide, type Group } from 'three';

import type { WorldSceneProps } from '../../../registry';
import { createDeepSpaceMotion, updateDeepSpaceMotion } from './deepSpaceMotion';

const PULSAR_POSITION: [number, number, number] = [-2.9, 2.8, 0.3];
const QUASAR_POSITION: [number, number, number] = [4.5, 4.2, -4.8];

function Pulsar({ segments, pulse }: { segments: number; pulse: number }) {
  const phase = pulse % 4;

  return (
    <>
      <mesh>
        <sphereGeometry args={[0.82, segments, segments]} />
        <meshStandardMaterial color="#132657" emissive="#80edff" emissiveIntensity={2.6 + phase * 0.55} metalness={0.72} roughness={0.14} />
      </mesh>
      <mesh scale={1.28}>
        <sphereGeometry args={[0.82, segments, segments]} />
        <meshBasicMaterial color="#8cecff" transparent opacity={0.11 + phase * 0.025} side={DoubleSide} />
      </mesh>
      {[0, 1, 2].map((index) => (
        <mesh key={index} rotation={[Math.PI / 2 + index * 0.48, index * 0.72, 0]}>
          <torusGeometry args={[1.2 + index * 0.43, 0.025, 7, segments * 2]} />
          <meshBasicMaterial color={index === 1 ? '#eee9ff' : '#70e8ff'} transparent opacity={0.58 - index * 0.08} />
        </mesh>
      ))}
      <group rotation={[0.18, 0, -0.52]}>
        <mesh position={[0, 3.4, 0]}>
          <coneGeometry args={[0.5 + phase * 0.035, 6.8, 18, 1, true]} />
          <meshBasicMaterial color="#e8f8ff" transparent opacity={0.35 + phase * 0.07} side={DoubleSide} depthWrite={false} />
        </mesh>
        <mesh position={[0, -3.4, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.5 + phase * 0.035, 6.8, 18, 1, true]} />
          <meshBasicMaterial color="#77ddff" transparent opacity={0.3 + phase * 0.07} side={DoubleSide} depthWrite={false} />
        </mesh>
      </group>
    </>
  );
}

function Quasar({ segments, pulse }: { segments: number; pulse: number }) {
  const phase = pulse % 4;

  return (
    <>
      <mesh>
        <sphereGeometry args={[0.54, segments, segments]} />
        <meshBasicMaterial color="#fff4c4" />
      </mesh>
      {[0, 1, 2].map((index) => (
        <mesh key={index} rotation={[index * 0.08, 0.18 + index * 0.09, 0]}>
          <torusGeometry args={[0.95 + index * 0.48, 0.095 - index * 0.012, 8, segments * 3]} />
          <meshStandardMaterial color="#211142" emissive={index % 2 ? '#a694ff' : '#ffd68a'} emissiveIntensity={1.7 + phase * 0.36} transparent opacity={0.82 - index * 0.13} />
        </mesh>
      ))}
      <mesh position={[0, 2.7, 0]}>
        <coneGeometry args={[0.36 + phase * 0.025, 5.2, 16, 1, true]} />
        <meshBasicMaterial color="#b39cff" transparent opacity={0.3 + phase * 0.05} side={DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, -2.7, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.36 + phase * 0.025, 5.2, 16, 1, true]} />
        <meshBasicMaterial color="#ffd98d" transparent opacity={0.25 + phase * 0.05} side={DoubleSide} depthWrite={false} />
      </mesh>
    </>
  );
}

function Spacecraft({ segments, pulse }: { segments: number; pulse: number }) {
  const phase = pulse % 4;

  return (
    <group scale={0.62}>
      <mesh rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.52, 2.7, 6]} />
        <meshStandardMaterial color="#223654" emissive="#72ddff" emissiveIntensity={0.42 + phase * 0.12} metalness={0.86} roughness={0.24} />
      </mesh>
      <mesh position={[-0.18, 0.56, 0]} scale={[1.4, 0.08, 0.62]}>
        <boxGeometry />
        <meshStandardMaterial color="#18233f" emissive="#a994ff" emissiveIntensity={0.36} metalness={0.78} roughness={0.3} />
      </mesh>
      <mesh position={[-0.18, -0.56, 0]} scale={[1.4, 0.08, 0.62]}>
        <boxGeometry />
        <meshStandardMaterial color="#18233f" emissive="#a994ff" emissiveIntensity={0.36} metalness={0.78} roughness={0.3} />
      </mesh>
      <mesh position={[-1.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.3 + phase * 0.025, 1.7, Math.max(12, Math.floor(segments / 2)), 1, true]} />
        <meshBasicMaterial color="#78e8ff" transparent opacity={0.5 + phase * 0.08} side={DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0.3, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.68, 0.045, 6, Math.max(16, segments)]} />
        <meshBasicMaterial color="#d9c7ff" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

export function DeepSpaceConvergenceWorld({ pulse, qualityTier, reducedMotion }: WorldSceneProps) {
  const pulsar = useRef<Group>(null);
  const quasar = useRef<Group>(null);
  const spacecraft = useRef<Group>(null);
  const motion = useRef(createDeepSpaceMotion());
  const segments = qualityTier === 'low' ? 16 : qualityTier === 'medium' ? 24 : 32;
  const starCount = qualityTier === 'low' ? 36 : qualityTier === 'medium' ? 64 : 96;

  useFrame(({ clock }) => {
    if (!pulsar.current || !quasar.current || !spacecraft.current) return;

    const frame = updateDeepSpaceMotion(motion.current, clock.elapsedTime, pulse, reducedMotion);
    pulsar.current.rotation.z = frame.pulsarRotation;
    pulsar.current.scale.setScalar(frame.pulseScale);
    quasar.current.rotation.z = frame.quasarRotation;
    quasar.current.scale.setScalar(0.72 * frame.pulseScale);
    spacecraft.current.position.set(...frame.spacecraftPosition);
    spacecraft.current.rotation.set(frame.spacecraftRoll, frame.spacecraftYaw, frame.spacecraftRoll);
  });

  return (
    <group>
      <ambientLight color="#536fa8" intensity={0.2} />
      <pointLight color="#7be8ff" intensity={4.2 + (pulse % 4) * 0.7} distance={18} position={PULSAR_POSITION} />
      <pointLight color="#bd9cff" intensity={2.6 + (pulse % 4) * 0.4} distance={15} position={QUASAR_POSITION} />
      <Sparkles count={starCount} scale={[18, 10, 16]} size={qualityTier === 'low' ? 0.8 : 1.15} speed={reducedMotion ? 0 : 0.08} color="#b9d8ff" opacity={0.58} />

      <group ref={pulsar} position={PULSAR_POSITION}>
        <Pulsar segments={segments} pulse={pulse} />
      </group>
      <group ref={quasar} position={QUASAR_POSITION} scale={0.72}>
        <Quasar segments={segments} pulse={pulse} />
      </group>
      <group ref={spacecraft} position={[0, 1.5, 1.65]}>
        <Spacecraft segments={segments} pulse={pulse} />
      </group>
    </group>
  );
}
