import { describe, expect, it } from 'vitest';
import {
  createGalaxyArmSpines,
  createGalaxyStarLayers,
  getTrinaryOrbitLayout,
  getTrinaryPlanetPosition,
} from '../src/worlds/shared/spaceVisuals';

describe('space visual contracts', () => {
  it('places each trinary planet and guide in the same tilted orbit plane', () => {
    for (const index of [0, 1, 2, 3]) {
      const orbit = getTrinaryOrbitLayout(index, 3, 18);

      expect(orbit.rotation).toEqual([0.1 * index, 0, 0]);
      expect(orbit.planetPosition[1]).toBe(0);
      expect(Math.hypot(orbit.planetPosition[0], orbit.planetPosition[2])).toBeCloseTo(orbit.radius);
      expect(orbit.guidePoints.every((point) => point[1] === 0)).toBe(true);
    }
  });

  it('advances trinary planets at distinct orbital rates', () => {
    const initial = [0, 1, 2, 3].map((index) => getTrinaryPlanetPosition(index, 2, 0));
    const advanced = [0, 1, 2, 3].map((index) => getTrinaryPlanetPosition(index, 2, 10));

    expect(advanced).not.toEqual(initial);
    advanced.forEach(([x, , z], index) => {
      expect(Math.hypot(x, z)).toBeCloseTo(Math.hypot(initial[index][0], initial[index][2]));
    });
    const angularChanges = advanced.map(([x, , z], index) => (
      Math.atan2(z, x) - Math.atan2(initial[index][2], initial[index][0])
    ).toFixed(3));
    expect(new Set(angularChanges).size).toBe(4);
  });

  it.each(['low', 'medium', 'high'] as const)('builds a dense, layered %s galaxy', (qualityTier) => {
    const layers = createGalaxyStarLayers(qualityTier);
    const starCount = layers.reduce((count, layer) => count + layer.positions.length / 3, 0);

    expect(layers).toHaveLength(3);
    expect(starCount).toBe(qualityTier === 'low' ? 720 : qualityTier === 'medium' ? 1320 : 2160);
    expect(new Set(layers.map((layer) => layer.color)).size).toBe(3);
    expect(new Set(layers.map((layer) => layer.size)).size).toBe(3);
    expect(layers.every((layer) => layer.positions.some((coordinate) => Math.abs(coordinate) > 4))).toBe(true);
  });

  it('keeps most stars close enough to four curved arm spines to preserve the spiral silhouette', () => {
    const layers = createGalaxyStarLayers('low');
    let starsNearAnArm = 0;
    let starCount = 0;

    for (const { positions } of layers) {
      for (let index = 0; index < positions.length; index += 3) {
        const x = positions[index];
        const z = positions[index + 2];
        const radius = Math.hypot(x, z);
        const angle = Math.atan2(z, x);
        const armPhase = angle - radius * 0.72;
        const nearestArm = Math.round(armPhase / (Math.PI / 2)) * (Math.PI / 2);
        const angularDistance = Math.abs(Math.atan2(
          Math.sin(armPhase - nearestArm),
          Math.cos(armPhase - nearestArm),
        ));

        if (angularDistance <= 0.3) starsNearAnArm += 1;
        starCount += 1;
      }
    }

    expect(starsNearAnArm / starCount).toBeGreaterThanOrEqual(0.9);
  });

  it('keeps every galaxy star population visible at the low-tier camera distance', () => {
    expect(createGalaxyStarLayers('low').every((layer) => layer.size >= 0.09)).toBe(true);
  });

  it('builds four continuous spiral spines from the galactic heart to the outer field', () => {
    const spines = createGalaxyArmSpines(48);

    expect(spines).toHaveLength(4);
    for (const spine of spines) {
      expect(spine).toHaveLength(49);
      expect(Math.hypot(spine[0][0], spine[0][2])).toBeCloseTo(0.8);
      expect(Math.hypot(spine.at(-1)![0], spine.at(-1)![2])).toBeCloseTo(6.8);
    }
  });

  it('keeps the low-tier star field inside the authored camera frame', () => {
    const outermostRadius = Math.max(...createGalaxyStarLayers('low').flatMap(({ positions }) => {
      const radii: number[] = [];
      for (let index = 0; index < positions.length; index += 3) {
        radii.push(Math.hypot(positions[index], positions[index + 2]));
      }
      return radii;
    }));

    expect(outermostRadius).toBeLessThanOrEqual(6.8);
  });
});
