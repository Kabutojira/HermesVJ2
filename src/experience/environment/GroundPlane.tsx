import { MeshReflectorMaterial } from '@react-three/drei';

export function GroundPlane({ tint = '#0b1224' }: { tint?: string }) {
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow><circleGeometry args={[18, 96]} /><MeshReflectorMaterial color={tint} mirror={0.45} blur={[400, 180]} resolution={1024} mixStrength={1.6} roughness={0.25} /></mesh>;
}
