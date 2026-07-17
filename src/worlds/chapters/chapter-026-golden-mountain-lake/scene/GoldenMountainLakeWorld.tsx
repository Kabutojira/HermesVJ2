import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { DataTexture, PlaneGeometry, RGBAFormat, RepeatWrapping, ShaderMaterial, Texture, Vector3, type Mesh, type MeshBasicMaterial } from 'three';
import { Water } from 'three/addons/objects/Water.js';
import { useSceneResources, type DisposableResource } from '../../../../experience/rendering/resources';
import type { WorldSceneProps } from '../../../registry';
import { lakeBudget, ridgeHeight, shouldUseWater } from './lakeData';

function createNormalTexture(): DataTexture {
  const size = 64;
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y += 1) for (let x = 0; x < size; x += 1) {
    const offset = (y * size + x) * 4;
    const wave = Math.sin(x * 0.63) * Math.cos(y * 0.47) * 22;
    data[offset] = 128 + wave;
    data[offset + 1] = 128 - wave;
    data[offset + 2] = 255;
    data[offset + 3] = 255;
  }
  const texture = new DataTexture(data, size, size, RGBAFormat);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

export function GoldenMountainLakeWorld({ pulse, qualityTier, reducedMotion, capabilities }: WorldSceneProps) {
  const budget = lakeBudget[qualityTier];
  const ringRef = useRef<Mesh>(null);
  const pulseEnergy = useRef(0);
  const waterBundle = useMemo(() => {
    if (!shouldUseWater(capabilities, reducedMotion)) return null;
    const normals = createNormalTexture();
    const geometry = new PlaneGeometry(28, 32);
    const water = new Water(geometry, {
      textureWidth: capabilities.waterSize,
      textureHeight: capabilities.waterSize,
      waterNormals: normals,
      sunDirection: new Vector3(-0.62, 0.48, 0.62).normalize(),
      sunColor: 0xffd395,
      waterColor: 0x173f49,
      distortionScale: 1.7,
      fog: true,
    });
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.22;
    const material = water.material as ShaderMaterial;
    const mirrorTexture = material.uniforms.mirrorSampler.value as Texture;
    const disposable: DisposableResource = { dispose: () => {
      mirrorTexture.dispose();
      material.dispose();
      geometry.dispose();
      normals.dispose();
    } };
    return { water, material, disposable };
  }, [capabilities, reducedMotion]);
  const resources = useMemo(() => waterBundle ? [waterBundle.disposable] : [], [waterBundle]);
  useSceneResources(resources);

  useEffect(() => { pulseEnergy.current = 1; }, [pulse]);
  useFrame((_, delta) => {
    pulseEnergy.current = Math.max(0, pulseEnergy.current - delta * 0.32);
    if (waterBundle && !reducedMotion) waterBundle.material.uniforms.time.value += delta * 0.18;
    if (ringRef.current) {
      const scale = 1 + (1 - pulseEnergy.current) * 7;
      ringRef.current.scale.setScalar(scale);
      (ringRef.current.material as MeshBasicMaterial).opacity = pulseEnergy.current * 0.36;
    }
  });

  const ridge = Array.from({ length: budget.ridgeSegments }, (_, index) => {
    const x = (index / Math.max(1, budget.ridgeSegments - 1) - 0.5) * 25;
    const height = ridgeHeight(index, budget.ridgeSegments);
    return { x, height, depth: -10.5 - Math.sin(index * 1.7) * 0.55 };
  });

  return <group>
    {ridge.map((peak, index) => <group key={index} position={[peak.x, peak.height * 0.5 - 0.4, peak.depth]}>
      <mesh castShadow={capabilities.shadows && index % 3 === 0} receiveShadow={capabilities.shadows}>
        <coneGeometry args={[2.5, peak.height, qualityTier === 'low' ? 5 : 7, 1]} />
        <meshStandardMaterial color={index % 4 === 0 ? '#55646a' : '#39474c'} roughness={0.88} />
      </mesh>
      {peak.height > 6.4 && <mesh position={[0, peak.height * 0.34, 0]}>
        <coneGeometry args={[1.15, peak.height * 0.32, 7]} />
        <meshStandardMaterial color="#d8dfdc" roughness={0.7} />
      </mesh>}
    </group>)}
    {waterBundle ? <primitive object={waterBundle.water} /> : <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.22, 0]}>
      <planeGeometry args={[28, 32]} />
      <meshStandardMaterial color="#1b5864" metalness={0.28} roughness={0.3} />
    </mesh>}
    <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.3, 2]}>
      <ringGeometry args={[0.78, 0.86, 48]} />
      <meshBasicMaterial color="#ffd89a" transparent opacity={0} depthWrite={false} />
    </mesh>

    {Array.from({ length: budget.shoreStones }, (_, index) => {
      const side = index % 2 ? 1 : -1;
      return <mesh key={index} position={[side * (6.4 + (index % 5) * 0.75), 0.45, 5 - Math.floor(index / 2) * 1.4]} rotation={[0, index * 1.3, 0]} castShadow={capabilities.shadows && index < 6}>
        <dodecahedronGeometry args={[0.5 + (index % 3) * 0.18, 0]} />
        <meshStandardMaterial color="#383b39" roughness={0.96} />
      </mesh>;
    })}
    <directionalLight position={[-12, 9, 9]} color="#ffd18a" intensity={4.2} castShadow={capabilities.shadows} />
    <hemisphereLight color="#bbd5df" groundColor="#3a3028" intensity={0.75} />
  </group>;
}
