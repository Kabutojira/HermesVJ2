export function WorldLighting() {
  return <>
    <ambientLight intensity={0.6} color="#7f8ecb" />
    <directionalLight intensity={2.2} color="#f4c1ff" position={[8, 12, 6]} castShadow />
    <pointLight intensity={28} color="#6df7ff" position={[0, 3.6, 0]} distance={22} decay={2} />
    <pointLight intensity={14} color="#ffa9e7" position={[-6, 2, -5]} distance={18} decay={2} />
  </>;
}
