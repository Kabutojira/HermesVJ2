import { MeshReflectorMaterial } from '@react-three/drei';
import type { QualityTier } from '../../lib/performance';

export function GroundPlane({ tint = '#0b1224', quality }: { tint?: string; quality: QualityTier }) {
  if (quality === 'low') {
    return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow><circleGeometry args={[18, 48]} /><meshStandardMaterial color={tint} metalness={0.45} roughness={0.38} /></mesh>;
  }
  const resolution = quality === 'medium' ? 512 : 1024;
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow><circleGeometry args={[18, quality === 'medium' ? 64 : 96]} /><MeshReflectorMaterial color={tint} mirror={0.45} blur={[400, 180]} resolution={resolution} mixStrength={1.6} roughness={0.25} /></mesh>;
}
