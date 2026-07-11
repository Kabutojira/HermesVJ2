import { Stars } from '@react-three/drei';

export function StarsField() {
  return <Stars radius={70} depth={28} count={2500} factor={3} saturation={0} fade speed={0.4} />;
}
