import type { Vector3Tuple } from 'three';

export interface CameraPreset {
  position: Vector3Tuple;
  target: Vector3Tuple;
  fov: number;
}

export const cameraPresets = {
  lotusGate: {
    position: [0, 3.2, 11],
    target: [0, 1.4, 0],
    fov: 42,
  },
  wormholeSpire: {
    position: [0, 4.6, 13],
    target: [0, 3.2, 0],
    fov: 46,
  },
} satisfies Record<string, CameraPreset>;
