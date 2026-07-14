import { describe, expect, it } from 'vitest';
import { AUTO_CAMERA_RESUME_MS, responsiveFov, spectatorFov } from '../src/experience/camera/spectatorCamera';

describe('spectator camera', () => {
  it('waits a few seconds before taking control back', () => {
    expect(AUTO_CAMERA_RESUME_MS).toBeGreaterThanOrEqual(3000);
    expect(AUTO_CAMERA_RESUME_MS).toBeLessThanOrEqual(6000);
  });

  it('widens portrait framing without changing landscape framing', () => {
    expect(responsiveFov(42, 16 / 9)).toBe(42);
    expect(responsiveFov(42, 9 / 16)).toBe(54);
  });

  it('zooms smoothly around the authored field of view', () => {
    expect(spectatorFov(42, 0)).toBeCloseTo(42);
    expect(spectatorFov(42, Math.PI / 2)).toBeCloseTo(45);
    expect(spectatorFov(42, Math.PI * 1.5)).toBeCloseTo(39);
  });
});