import { OrbitControls } from '@react-three/drei';

export function ExplorerControls({ mode }: { mode: 'orbit' | 'guided' | 'fixed' | 'free-fly' }) {
  if (mode === 'fixed') return null;
  return <OrbitControls autoRotate={mode === 'guided'} autoRotateSpeed={0.25} enablePan={mode === 'free-fly'} enableRotate={mode !== 'guided'} minDistance={5} maxDistance={18} minPolarAngle={0.35} maxPolarAngle={Math.PI / 2.02} target={[0, 2.3, 0]} />;
}
