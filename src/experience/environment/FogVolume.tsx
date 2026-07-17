export function FogVolume({ color = '#040611', near = 11, far = 26 }: { color?: string; near?: number; far?: number }) {
  return <fog attach="fog" args={[color, near, far]} />;
}
