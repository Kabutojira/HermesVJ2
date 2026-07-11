import { BackSide, Color } from 'three';

export function SkyDome() {
  return <mesh><sphereGeometry args={[65, 48, 48]} /><meshBasicMaterial color={new Color('#060814')} side={BackSide} /></mesh>;
}
