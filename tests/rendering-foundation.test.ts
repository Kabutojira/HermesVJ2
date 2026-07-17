import { describe, expect, it, vi } from 'vitest';

import { resolveRenderCapabilities } from '../src/experience/rendering/quality';
import { disposeSceneResources } from '../src/experience/rendering/resources';

describe('shared rendering quality policy', () => {
  it('disables expensive rendering features on constrained devices', () => {
    expect(resolveRenderCapabilities('low', false)).toEqual({
      antialias: false,
      dpr: 1,
      shadows: false,
      shadowMapSize: 0,
      reflectionSize: 0,
      waterSize: 0,
      postProcessing: false,
    });
  });

  it('caps medium and high rendering features centrally', () => {
    expect(resolveRenderCapabilities('medium', false)).toMatchObject({
      antialias: true,
      dpr: [1, 1.5],
      shadows: true,
      shadowMapSize: 1024,
      reflectionSize: 512,
      waterSize: 512,
      postProcessing: false,
    });
    expect(resolveRenderCapabilities('high', false)).toMatchObject({
      dpr: [1, 2],
      shadowMapSize: 2048,
      reflectionSize: 1024,
      waterSize: 1024,
      postProcessing: true,
    });
  });

  it('keeps optional post-processing off for reduced motion', () => {
    expect(resolveRenderCapabilities('high', true).postProcessing).toBe(false);
  });
});

describe('scene lifecycle cleanup', () => {
  it('disposes tracked resources once even when the same resource is registered twice', () => {
    const resource = { dispose: vi.fn() };
    disposeSceneResources([resource, resource]);
    expect(resource.dispose).toHaveBeenCalledOnce();
  });
});
