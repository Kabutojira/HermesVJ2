import { Bloom, ChromaticAberration, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';

export function WorldPostFX() {
  return <EffectComposer multisampling={2}>
    <Bloom intensity={0.75} luminanceThreshold={0.5} mipmapBlur />
    <Noise opacity={0.03} premultiply />
    <ChromaticAberration offset={[0.0007, 0.0012]} />
    <Vignette eskil={false} offset={0.18} darkness={0.85} />
  </EffectComposer>;
}
