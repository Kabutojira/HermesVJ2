import type { QualityTier } from '../../lib/performance';
import type { SceneEnvironmentRequest } from '../rendering/types';
import { FogVolume } from './FogVolume';
import { GroundPlane } from './GroundPlane';
import { SkyDome } from './SkyDome';
import { StarsField } from './StarsField';

export function SceneEnvironment({ paletteGround, quality, request }: { paletteGround: string; quality: QualityTier; request?: SceneEnvironmentRequest }) {
  const fog = request?.fog;
  const ground = request?.ground;
  return <>
    <color attach="background" args={[request?.background ?? '#040611']} />
    {fog === false ? null : <FogVolume {...(fog || {})} />}
    {request?.sky === false ? null : <SkyDome />}
    {request?.stars === false ? null : <StarsField quality={quality} />}
    {ground === false ? null : <GroundPlane tint={ground?.color ?? paletteGround} metalness={ground?.metalness} roughness={ground?.roughness} quality={quality} />}
  </>;
}
