import { describe, expect, it, vi } from 'vitest';
import { classifyQualityTier } from '../src/lib/performance';
import { canUseWebGL, prefersReducedMotion } from '../src/lib/runtime';

describe('runtime capability policy', () => {
  it('selects a low tier for narrow or constrained devices', () => {
    expect(classifyQualityTier({ width: 390, devicePixelRatio: 3, hardwareConcurrency: 8 })).toBe('low');
    expect(classifyQualityTier({ width: 1440, devicePixelRatio: 1, hardwareConcurrency: 2 })).toBe('low');
  });

  it('selects medium and high tiers only when capability permits', () => {
    expect(classifyQualityTier({ width: 900, devicePixelRatio: 2, hardwareConcurrency: 8 })).toBe('medium');
    expect(classifyQualityTier({ width: 1440, devicePixelRatio: 1, hardwareConcurrency: 8 })).toBe('high');
  });

  it('allows deterministic reduced-motion validation without weakening media preferences', () => {
    expect(prefersReducedMotion(false, '?motion=reduce')).toBe(true);
    expect(prefersReducedMotion(true, '')).toBe(true);
    expect(prefersReducedMotion(false, '')).toBe(false);
  });

  it('reports WebGL unavailable when no context can be created', () => {
    const canvas = { getContext: vi.fn(() => null) } as unknown as HTMLCanvasElement;
    expect(canUseWebGL(canvas)).toBe(false);
  });

  it('accepts either WebGL2 or WebGL1', () => {
    const context = {} as WebGLRenderingContext;
    const canvas = { getContext: vi.fn((kind: string) => kind === 'webgl' ? context : null) } as unknown as HTMLCanvasElement;
    expect(canUseWebGL(canvas)).toBe(true);
  });
});
