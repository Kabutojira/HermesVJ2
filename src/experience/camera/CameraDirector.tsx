import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import type { PerspectiveCamera } from 'three';
import { Vector3 } from 'three';
import type { CameraPreset } from './cameraPresets';

export function CameraDirector({ preset }: { preset: CameraPreset }) {
  const { camera } = useThree();
  const perspectiveCamera = camera as PerspectiveCamera;

  useEffect(() => {
    perspectiveCamera.position.set(...preset.position);
    perspectiveCamera.fov = preset.fov;
    perspectiveCamera.lookAt(new Vector3(...preset.target));
    perspectiveCamera.updateProjectionMatrix();
  }, [perspectiveCamera, preset]);

  return null;
}
