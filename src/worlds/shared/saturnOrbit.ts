import type { QualityTier } from '../../lib/performance';

export type SaturnLighting = 'day' | 'night' | 'terminator';
export type Point = [number, number, number];

export const LOW_SATURN_ORBIT = {
  saturnEquatorialRadiusKm: 60_268,
  altitudeKm: 1_200,
  gravitationalParameterKm3PerSecond2: 37_931_207.8,
  periodSeconds: 15_547.306359905308,
  orbitalVelocityKmPerSecond: 24.84126996157469,
  stationSpinPeriodSeconds: 12,
} as const;

export type SaturnOrbitShot = {
  chapterId: string;
  title: string;
  lighting: SaturnLighting;
  orbitPhase: number;
  orbitPeriodSeconds: number;
  stationPosition: Point;
  stationRotation: Point;
  saturnPosition: Point;
  sunPosition: Point;
  plasmaColor: string;
};

export const SATURN_ORBIT_SHOTS: readonly SaturnOrbitShot[] = [
  {
    chapterId: 'chapter-020-saturn-orbit-insertion',
    title: 'Saturn Orbit Insertion',
    lighting: 'day',
    orbitPhase: 0.12,
    orbitPeriodSeconds: LOW_SATURN_ORBIT.periodSeconds,
    stationPosition: [-1.2, 2.9, 1.4],
    stationRotation: [0.22, -0.36, -0.2],
    saturnPosition: [3.8, 1.1, -9.4],
    sunPosition: [-12, 10, 9],
    plasmaColor: '#78ddff',
  },
  {
    chapterId: 'chapter-021-saturn-ringside-descent',
    title: 'Ringside Descent',
    lighting: 'day',
    orbitPhase: 0.28,
    orbitPeriodSeconds: LOW_SATURN_ORBIT.periodSeconds,
    stationPosition: [1.7, 2.5, 0.2],
    stationRotation: [0.48, 0.18, 0.36],
    saturnPosition: [-3.9, 1.3, -9.2],
    sunPosition: [10, 12, 7],
    plasmaColor: '#b8efff',
  },
  {
    chapterId: 'chapter-022-saturn-nightside-plasma',
    title: 'Nightside Plasma Wake',
    lighting: 'night',
    orbitPhase: 0.51,
    orbitPeriodSeconds: LOW_SATURN_ORBIT.periodSeconds,
    stationPosition: [-0.5, 2.6, 0.6],
    stationRotation: [0.2, 0.54, -0.52],
    saturnPosition: [3.5, 0.9, -9.6],
    sunPosition: [11, -3, -14],
    plasmaColor: '#a486ff',
  },
  {
    chapterId: 'chapter-023-saturn-terminator-crossing',
    title: 'Terminator Crossing',
    lighting: 'terminator',
    orbitPhase: 0.74,
    orbitPeriodSeconds: LOW_SATURN_ORBIT.periodSeconds,
    stationPosition: [0.8, 3.1, 1.2],
    stationRotation: [-0.28, 0.36, 0.16],
    saturnPosition: [-3.7, 1.1, -9.4],
    sunPosition: [-11, 6, -2],
    plasmaColor: '#ffb36f',
  },
  {
    chapterId: 'chapter-024-saturn-orbital-dawn',
    title: 'Orbital Dawn',
    lighting: 'night',
    orbitPhase: 0.91,
    orbitPeriodSeconds: LOW_SATURN_ORBIT.periodSeconds,
    stationPosition: [-1.5, 2.4, 1.5],
    stationRotation: [0.38, -0.18, 0.48],
    saturnPosition: [3.9, 1, -9.3],
    sunPosition: [-12, 2, -10],
    plasmaColor: '#f6b4ff',
  },
] as const;

export function getStationMotion(elapsedSeconds: number, orbitPhase: number) {
  return {
    axialRotation: elapsedSeconds / LOW_SATURN_ORBIT.stationSpinPeriodSeconds * Math.PI * 2,
    orbitalAngle: orbitPhase * Math.PI * 2 + elapsedSeconds / LOW_SATURN_ORBIT.periodSeconds * Math.PI * 2,
  };
}

export type PlasmaParticle = {
  position: Point;
  size: number;
  phase: number;
};

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0;
    return state / 4_294_967_296;
  };
}

export function createPlasmaParticles(qualityTier: QualityTier, seed = 0x5a71): PlasmaParticle[] {
  const count = qualityTier === 'low' ? 48 : qualityTier === 'medium' ? 84 : 132;
  const random = seededRandom(seed + count);

  return Array.from({ length: count }, (_, index) => {
    const progress = index / Math.max(1, count - 1);
    const wake = progress * 5.6 - 3.2;
    const bowRadius = 0.72 + progress * 0.42;
    const angle = random() * Math.PI * 2;
    return {
      position: [
        wake,
        Math.cos(angle) * bowRadius * (0.35 + random() * 0.65),
        Math.sin(angle) * bowRadius * (0.35 + random() * 0.65),
      ],
      size: 0.035 + random() * 0.085,
      phase: random() * Math.PI * 2,
    };
  });
}
