import { describe, expect, it } from 'vitest';
import { worldManifest } from '../src/worlds/manifest';
import {
  LOW_SATURN_ORBIT,
  SATURN_ORBIT_SHOTS,
  createPlasmaParticles,
  getStationMotion,
} from '../src/worlds/shared/saturnOrbit';

const SATURN_CHAPTER_IDS = [
  'chapter-020-saturn-orbit-insertion',
  'chapter-021-saturn-ringside-descent',
  'chapter-022-saturn-nightside-plasma',
  'chapter-023-saturn-terminator-crossing',
  'chapter-024-saturn-orbital-dawn',
];

describe('Saturn low-orbit visual contracts', () => {
  it('publishes exactly five Saturn station visuals in their authored order', () => {
    const publishedSaturnIds = worldManifest.chapters
      .map((chapter) => chapter.id)
      .filter((id) => id.includes('saturn'));

    expect(publishedSaturnIds).toEqual(SATURN_CHAPTER_IDS);
    expect(SATURN_ORBIT_SHOTS.map((shot) => shot.chapterId)).toEqual(SATURN_CHAPTER_IDS);
  });

  it('uses one physically plausible low Saturn orbit across every shot', () => {
    expect(LOW_SATURN_ORBIT.altitudeKm).toBe(1200);
    expect(LOW_SATURN_ORBIT.periodSeconds).toBeCloseTo(15547.306, 2);
    expect(LOW_SATURN_ORBIT.periodSeconds / 3600).toBeGreaterThan(4);
    expect(LOW_SATURN_ORBIT.periodSeconds / 3600).toBeLessThan(5);
    expect(new Set(SATURN_ORBIT_SHOTS.map((shot) => shot.orbitPeriodSeconds))).toEqual(
      new Set([LOW_SATURN_ORBIT.periodSeconds]),
    );
  });

  it('keeps rapid station spin independent from patient orbital travel', () => {
    const initial = getStationMotion(0, 0);
    const afterOneSpin = getStationMotion(LOW_SATURN_ORBIT.stationSpinPeriodSeconds, 0);

    expect(afterOneSpin.axialRotation - initial.axialRotation).toBeCloseTo(Math.PI * 2);
    expect(afterOneSpin.orbitalAngle - initial.orbitalAngle).toBeLessThan(0.01);
  });

  it('includes distinct day, night, and terminator compositions', () => {
    expect(SATURN_ORBIT_SHOTS.filter((shot) => shot.lighting === 'day')).toHaveLength(2);
    expect(SATURN_ORBIT_SHOTS.filter((shot) => shot.lighting === 'night')).toHaveLength(2);
    expect(SATURN_ORBIT_SHOTS.filter((shot) => shot.lighting === 'terminator')).toHaveLength(1);
  });

  it.each(['low', 'medium', 'high'] as const)('creates deterministic quality-scaled %s plasma', (qualityTier) => {
    const first = createPlasmaParticles(qualityTier, 42);
    const second = createPlasmaParticles(qualityTier, 42);
    const expectedCount = qualityTier === 'low' ? 48 : qualityTier === 'medium' ? 84 : 132;

    expect(first).toEqual(second);
    expect(first).toHaveLength(expectedCount);
    expect(first.every(({ position }) => position[0] <= 2.8 && position[0] >= -3.2)).toBe(true);
  });
});
