import { describe, expect, it } from 'vitest';

import { chapter as canyonChapter } from '../src/worlds/chapters/chapter-025-sunlit-canyon/module';
import { createCanyonLayers, getCanyonBudget } from '../src/worlds/chapters/chapter-025-sunlit-canyon/scene/canyonGeometry';
import { chapter as studioChapter } from '../src/worlds/chapters/chapter-026-cinematic-product-studio/module';
import { createHeroProfile, getStudioBudget } from '../src/worlds/chapters/chapter-026-cinematic-product-studio/scene/productGeometry';

describe('sunlit canyon scene module', () => {
  it('publishes stable natural-light defaults without reflective effects', () => {
    expect(canyonChapter.id).toBe('chapter-025-sunlit-canyon');
    expect(canyonChapter.title).toBe('Sunlit Canyon');
    expect(canyonChapter.rendering?.lighting?.preset).toBe('natural');
    expect(canyonChapter.rendering?.environment?.ground).not.toBe(false);
    expect(canyonChapter.rendering?.post).toBe(false);
  });

  it('generates deterministic layered depth while scaling detail by quality', () => {
    expect(createCanyonLayers('medium')).toEqual(createCanyonLayers('medium'));
    expect(getCanyonBudget('low').wallSegments).toBeLessThan(getCanyonBudget('high').wallSegments);
    expect(createCanyonLayers('low')).toHaveLength(8);
    expect(createCanyonLayers('high')).toHaveLength(16);
  });
});

describe('cinematic product studio scene module', () => {
  it('publishes stable studio-light defaults with restrained high-tier post processing', () => {
    expect(studioChapter.id).toBe('chapter-026-cinematic-product-studio');
    expect(studioChapter.title).toBe('Monolith Studio');
    expect(studioChapter.rendering?.lighting?.preset).toBe('studio');
    expect(studioChapter.rendering?.environment?.ground).toBe(false);
    expect(studioChapter.rendering?.post).toEqual({
      bloom: { threshold: 1.25, strength: 0.18, radius: 0.16 },
      depthOfField: { focus: 14, aperture: 0.00008, maxBlur: 0.004 },
    });
  });

  it('keeps the procedural hero deterministic and reduces geometry on lower tiers', () => {
    expect(createHeroProfile('high')).toEqual(createHeroProfile('high'));
    expect(getStudioBudget('low').radialSegments).toBeLessThan(getStudioBudget('high').radialSegments);
    expect(createHeroProfile('low').length).toBeLessThan(createHeroProfile('high').length);
  });
});
