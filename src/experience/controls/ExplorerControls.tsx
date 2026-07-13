import { OrbitControls } from '@react-three/drei';

export function ExplorerControls({ mode, reducedMotion }: { mode: 'orbit' | 'guided' | 'fixed' | 'free-fly'; reducedMotion: boolean }) {
  if (mode === 'fixed') return null;
  return <OrbitControls autoRotate={mode === 'guided' && !reducedMotion} autoRotateSpeed={0.25} enableDamping={!reducedMotion} enablePan={mode === 'free-fly'} enableRotate={mode !== 'guided' || reducedMotion} minDistance={5} maxDistance={18} minPolarAngle={0.35} maxPolarAngle={Math.PI / 2.02} target={[0, 2.3, 0]} />;
}
