import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import type { PerspectiveCamera } from 'three';
import { Vector3 } from 'three';
import type { CameraPreset } from './cameraPresets';
import { responsiveFov } from './spectatorCamera';

export function CameraDirector({ preset }: { preset: CameraPreset }) {
  const { camera, size } = useThree();
  const perspectiveCamera = camera as PerspectiveCamera;

  useEffect(() => {
    perspectiveCamera.position.set(...preset.position);
    perspectiveCamera.fov = responsiveFov(preset.fov, size.width / size.height);
    perspectiveCamera.lookAt(new Vector3(...preset.target));
    perspectiveCamera.updateProjectionMatrix();
  }, [perspectiveCamera, preset, size.height, size.width]);

  return null;
}
