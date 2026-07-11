import { Stars } from '@react-three/drei';

export function StarsField({ quality }: { quality: 'low' | 'medium' | 'high' }) {
  const count = quality === 'low' ? 600 : quality === 'medium' ? 1400 : 2500;
  return <Stars radius={70} depth={28} count={count} factor={3} saturation={0} fade speed={quality === 'low' ? 0 : 0.4} />;
}
