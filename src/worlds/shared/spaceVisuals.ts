import type { QualityTier } from '../../lib/performance';

type Point = [number, number, number];

export type TrinaryOrbitLayout = {
  radius: number;
  rotation: Point;
  planetPosition: Point;
  guidePoints: Point[];
};

export type GalaxyStarLayer = {
  color: string;
  positions: Float32Array;
  size: number;
};

export function getTrinaryOrbitLayout(index: number, pulse: number, segments: number): TrinaryOrbitLayout {
  const radius = 2.1 + index * 1.15;
  const planetPosition = getTrinaryPlanetPosition(index, pulse, 0);
  const guidePoints = Array.from({ length: segments + 1 }, (_, segment) => {
    const guideAngle = segment / segments * Math.PI * 2;
    return [Math.cos(guideAngle) * radius, 0, Math.sin(guideAngle) * radius] as Point;
  });

  return {
    radius,
    rotation: [0.1 * index, 0, 0],
    planetPosition,
    guidePoints,
  };
}

export function getTrinaryPlanetPosition(index: number, pulse: number, time: number): Point {
  const radius = 2.1 + index * 1.15;
  const angle = index * 1.63 + pulse * 0.14 + time * (0.19 - index * 0.027);
  return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius];
}

const GALAXY_LAYER_STYLES = [
  { color: '#fff1c2', ratio: 0.45, size: 0.09 },
  { color: '#8bdcff', ratio: 0.35, size: 0.14 },
  { color: '#d39aff', ratio: 0.2, size: 0.19 },
] as const;

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function createGalaxyArmSpines(segments: number): Point[][] {
  return Array.from({ length: 4 }, (_, arm) => (
    Array.from({ length: segments + 1 }, (_, segment) => {
      const progress = segment / segments;
      const radius = 0.8 + progress * 6;
      const angle = arm * Math.PI / 2 + radius * 0.72;
      return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius] as Point;
    })
  ));
}

export function createGalaxyStarLayers(qualityTier: QualityTier): GalaxyStarLayer[] {
  const total = qualityTier === 'low' ? 720 : qualityTier === 'medium' ? 1320 : 2160;
  let assigned = 0;

  return GALAXY_LAYER_STYLES.map((style, layerIndex) => {
    const count = layerIndex === GALAXY_LAYER_STYLES.length - 1
      ? total - assigned
      : Math.round(total * style.ratio);
    assigned += count;
    const positions = new Float32Array(count * 3);
    const random = seededRandom(0x51a7 + layerIndex * 7919 + total);

    for (let index = 0; index < count; index += 1) {
      const radius = 0.35 + Math.pow(random(), 0.68) * 6.4;
      const arm = index % 4;
      const angle = arm * Math.PI / 2 + radius * 0.72 + (random() - 0.5) * (0.24 + radius * 0.025);
      const thickness = 0.18 + radius * 0.055;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = (random() - 0.5) * thickness;
      positions[index * 3 + 2] = Math.sin(angle) * radius;
    }

    return { color: style.color, positions, size: style.size };
  });
}
