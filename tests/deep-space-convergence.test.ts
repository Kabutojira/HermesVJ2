import { describe, expect, it } from 'vitest';
import {
  createDeepSpaceMotion,
  updateDeepSpaceMotion,
} from '../src/worlds/chapters/chapter-019-deep-space-convergence/scene/deepSpaceMotion';

function motionAt(time: number, pulse: number, reducedMotion: boolean) {
  return updateDeepSpaceMotion(createDeepSpaceMotion(), time, pulse, reducedMotion);
}

describe('deep-space convergence motion', () => {
  it('rotates the pulsar faster than the distant quasar', () => {
    const start = motionAt(0, 0, false);
    const later = motionAt(10, 0, false);

    expect(later.pulsarRotation - start.pulsarRotation).toBeGreaterThan(
      (later.quasarRotation - start.quasarRotation) * 4,
    );
  });

  it('moves the spacecraft smoothly around a bounded scale-establishing route', () => {
    const samples = Array.from({ length: 25 }, (_, index) => [...motionAt(index * 0.25, 1, false).spacecraftPosition]);

    for (const [x, y, z] of samples) {
      expect(x).toBeGreaterThanOrEqual(-3.6);
      expect(x).toBeLessThanOrEqual(3.6);
      expect(y).toBeGreaterThanOrEqual(0.9);
      expect(y).toBeLessThanOrEqual(2.1);
      expect(z).toBeGreaterThanOrEqual(-1.8);
      expect(z).toBeLessThanOrEqual(1.8);
    }

    for (let index = 1; index < samples.length; index += 1) {
      const previous = samples[index - 1];
      const current = samples[index];
      expect(Math.hypot(current[0] - previous[0], current[1] - previous[1], current[2] - previous[2])).toBeLessThan(0.5);
    }
  });

  it('freezes continuous motion while retaining pulse response under reduced motion', () => {
    expect(motionAt(0, 0, true)).toEqual(motionAt(18, 0, true));
    expect(motionAt(18, 3, true).pulseScale).toBeGreaterThan(motionAt(18, 0, true).pulseScale);
  });

  it('updates a reusable frame state without allocating another result object', () => {
    const motion = createDeepSpaceMotion();

    expect(updateDeepSpaceMotion(motion, 4, 2, false)).toBe(motion);
  });
});
