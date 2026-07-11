import { OrbitControls } from '@react-three/drei';

export function ExplorerControls() {
  return <OrbitControls enablePan={false} minDistance={5} maxDistance={18} minPolarAngle={0.35} maxPolarAngle={Math.PI / 2.02} target={[0, 2.3, 0]} />;
}
