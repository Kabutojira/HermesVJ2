import { describe, expect, it } from 'vitest';
import {
  createFountainArcs,
  getElementalBudget,
  getElementalPulseState,
} from '../src/worlds/shared/elementalVisuals';

describe('elemental visual contracts', () => {
  it('creates eleven unique plasma fountain lanes', () => {
    const arcs = createFountainArcs(11, 18);

    expect(arcs).toHaveLength(11);
    expect(new Set(arcs.map((arc) => arc.angle.toFixed(8))).size).toBe(11);
    expect(arcs[10].angle).toBeCloseTo((10 / 11) * Math.PI * 2);
    expect(arcs.every((arc) => arc.points.length === 18)).toBe(true);
  });

  it('scales geometry and particle density by quality tier', () => {
    const low = getElementalBudget('low');
    const medium = getElementalBudget('medium');
    const high = getElementalBudget('high');

    expect(low.particles).toBeLessThan(medium.particles);
    expect(medium.particles).toBeLessThan(high.particles);
    expect(low.lineSegments).toBeLessThan(high.lineSegments);
    expect(low.radialSegments).toBeLessThan(high.radialSegments);
  });

  it('keeps every pulse visibly distinct when motion is reduced', () => {
    const first = getElementalPulseState(1, true);
    const second = getElementalPulseState(2, true);

    expect(first.animate).toBe(false);
    expect(second.animate).toBe(false);
    expect(first.effectScale).not.toBe(second.effectScale);
    expect(first.lightIntensity).not.toBe(second.lightIntensity);
    expect(first.effectOpacity).not.toBe(second.effectOpacity);
  });
});