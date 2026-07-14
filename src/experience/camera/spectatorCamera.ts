export const AUTO_CAMERA_RESUME_MS = 4000;

const SPECTATOR_ZOOM_AMPLITUDE = 3;

export function responsiveFov(baseFov: number, aspect: number): number {
  return aspect < 0.75 ? baseFov + 12 : baseFov;
}

export function spectatorFov(baseFov: number, phase: number): number {
  return baseFov + Math.sin(phase) * SPECTATOR_ZOOM_AMPLITUDE;
}
