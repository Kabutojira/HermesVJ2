import type { QualityTier } from '../../lib/performance';

interface GroundPlaneProps {
  tint?: string;
  quality: QualityTier;
  metalness?: number;
  roughness?: number;
}

export function GroundPlane({ tint = '#0b1224', quality, metalness = 0.2, roughness = 0.72 }: GroundPlaneProps) {
  const segments = quality === 'low' ? 48 : quality === 'medium' ? 64 : 96;
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow><circleGeometry args={[18, segments]} /><meshStandardMaterial color={tint} metalness={metalness} roughness={roughness} /></mesh>;
}
