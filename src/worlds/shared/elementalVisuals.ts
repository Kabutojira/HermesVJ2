import type { QualityTier } from '../../lib/performance';

export interface ElementalBudget {
  particles: number;
  lineSegments: number;
  radialSegments: number;
}

const BUDGETS: Record<QualityTier, ElementalBudget> = {
  low: { particles: 36, lineSegments: 10, radialSegments: 16 },
  medium: { particles: 72, lineSegments: 16, radialSegments: 24 },
  high: { particles: 120, lineSegments: 24, radialSegments: 36 },
};

export const getElementalBudget = (tier: QualityTier): ElementalBudget => BUDGETS[tier];

export interface FountainArc {
  angle: number;
  points: [number, number, number][];
}

export function createFountainArcs(lanes: number, segments: number): FountainArc[] {
  return Array.from({ length: lanes }, (_, lane) => {
    const angle = (lane / lanes) * Math.PI * 2;
    const points = Array.from({ length: segments }, (_, segment) => {
      const progress = segment / (segments - 1);
      const radius = 1.25 + Math.sin(progress * Math.PI) * 3.1;
      const y = 1.1 + Math.sin(progress * Math.PI) * 4.8 - progress * 0.7;
      return [Math.cos(angle) * radius, y, Math.sin(angle) * radius] as [number, number, number];
    });
    return { angle, points };
  });
}

export interface ElementalPulseState {
  animate: boolean;
  effectScale: number;
  lightIntensity: number;
  effectOpacity: number;
}

export function getElementalPulseState(pulse: number, reducedMotion: boolean): ElementalPulseState {
  const phase = pulse % 4;
  return {
    animate: !reducedMotion,
    effectScale: 1 + phase * 0.045,
    lightIntensity: 3.2 + phase * 0.85,
    effectOpacity: 0.42 + phase * 0.1,
  };
}
