export type DeepSpaceMotion = {
  pulsarRotation: number;
  quasarRotation: number;
  spacecraftPosition: [number, number, number];
  spacecraftYaw: number;
  spacecraftRoll: number;
  pulseScale: number;
};

export function createDeepSpaceMotion(): DeepSpaceMotion {
  return {
    pulsarRotation: 0,
    quasarRotation: 0,
    spacecraftPosition: [0, 0, 0],
    spacecraftYaw: 0,
    spacecraftRoll: 0,
    pulseScale: 1,
  };
}

export function updateDeepSpaceMotion(
  motion: DeepSpaceMotion,
  elapsedTime: number,
  pulse: number,
  reducedMotion: boolean,
): DeepSpaceMotion {
  const time = reducedMotion ? 0 : elapsedTime;
  const routePhase = time * 0.34;

  motion.pulsarRotation = time * 1.85;
  motion.quasarRotation = time * 0.12;
  motion.spacecraftPosition[0] = Math.sin(routePhase) * 3.4;
  motion.spacecraftPosition[1] = 1.5 + Math.sin(routePhase * 1.7) * 0.55;
  motion.spacecraftPosition[2] = Math.cos(routePhase) * 1.65;
  motion.spacecraftYaw = -routePhase;
  motion.spacecraftRoll = Math.sin(routePhase * 1.7) * 0.16;
  motion.pulseScale = 1 + (pulse % 4) * 0.055;

  return motion;
}
