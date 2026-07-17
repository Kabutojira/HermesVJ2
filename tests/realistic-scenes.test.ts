import { describe, expect, it } from 'vitest';

import { neonCityConfig } from '../src/worlds/chapters/chapter-025-neon-rain-city/config';
import { cityBudget, createCityBlocks, createRain } from '../src/worlds/chapters/chapter-025-neon-rain-city/scene/cityData';
import { mountainLakeConfig } from '../src/worlds/chapters/chapter-026-golden-mountain-lake/config';
import { lakeBudget, shouldUseWater } from '../src/worlds/chapters/chapter-026-golden-mountain-lake/scene/lakeData';
import { glassGalleryConfig } from '../src/worlds/chapters/chapter-027-glass-gallery/config';
import { galleryBudget, shouldUsePhysicalGlass } from '../src/worlds/chapters/chapter-027-glass-gallery/scene/galleryData';

const configs = [neonCityConfig, mountainLakeConfig, glassGalleryConfig];

describe('city, lake, and gallery scene contracts', () => {
  it('provides stable, distinct metadata and bounded orbit cameras', () => {
    expect(new Set(configs.map(({ id }) => id)).size).toBe(3);
    expect(new Set(configs.map(({ title }) => title)).size).toBe(3);
    for (const config of configs) {
      expect(config.movementMode).toBe('orbit');
      expect(config.cameraPreset.fov).toBeGreaterThanOrEqual(35);
      expect(config.cameraPreset.fov).toBeLessThanOrEqual(55);
      expect(config.description.length).toBeGreaterThan(40);
    }
  });

  it('uses deterministic, monotonic geometry budgets', () => {
    expect(cityBudget.low.buildings).toBeLessThan(cityBudget.medium.buildings);
    expect(cityBudget.medium.buildings).toBeLessThan(cityBudget.high.buildings);
    expect(lakeBudget.low.ridgeSegments).toBeLessThan(lakeBudget.high.ridgeSegments);
    expect(galleryBudget.low.columns).toBeLessThan(galleryBudget.high.columns);
    expect(createCityBlocks(12, 99)).toEqual(createCityBlocks(12, 99));
    expect(createCityBlocks(12, 99)).not.toEqual(createCityBlocks(12, 100));
    expect(createRain(12)).toHaveLength(12 * 2 * 3);
  });

  it('hard-gates advanced water and glass paths while retaining fallbacks', () => {
    expect(shouldUseWater({ waterSize: 0 }, false)).toBe(false);
    expect(shouldUseWater({ waterSize: 512 }, true)).toBe(false);
    expect(shouldUseWater({ waterSize: 512 }, false)).toBe(true);
    expect(shouldUsePhysicalGlass('low')).toBe(false);
    expect(shouldUsePhysicalGlass('medium')).toBe(true);
  });
});
