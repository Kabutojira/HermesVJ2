import type { RenderCapabilities } from '../rendering/quality';
import type { SceneLightingRequest } from '../rendering/types';

export function WorldLighting({ capabilities, request }: { capabilities: RenderCapabilities; request?: SceneLightingRequest }) {
  const preset = request?.preset ?? 'dream';
  if (preset === 'none') return null;
  const castsShadow = capabilities.shadows && request?.shadows !== false;
  const shadowSize = capabilities.shadowMapSize || 1024;
  const key = <directionalLight
    intensity={request?.keyIntensity ?? (preset === 'natural' ? 3.2 : 2.2)}
    color={request?.keyColor ?? (preset === 'natural' ? '#fff0d2' : '#f4c1ff')}
    position={request?.keyPosition ?? [8, 12, 6]}
    castShadow={castsShadow}
    shadow-mapSize-width={shadowSize}
    shadow-mapSize-height={shadowSize}
    shadow-bias={-0.0002}
    shadow-normalBias={0.03}
  />;

  if (preset === 'studio') return <><hemisphereLight intensity={0.7} color="#f4f7ff" groundColor="#191b24" />{key}<pointLight intensity={16} color="#b9d8ff" position={[-5, 5, -4]} distance={20} decay={2} /></>;
  if (preset === 'natural') return <><hemisphereLight intensity={0.9} color="#b9d9ff" groundColor="#3a261c" />{key}</>;
  return <><hemisphereLight intensity={0.65} color="#7f8ecb" groundColor="#090b16" />{key}<pointLight intensity={28} color="#6df7ff" position={[0, 3.6, 0]} distance={22} decay={2} /><pointLight intensity={14} color="#ffa9e7" position={[-6, 2, -5]} distance={18} decay={2} /></>;
}
