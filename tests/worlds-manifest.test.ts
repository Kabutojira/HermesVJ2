import { describe, expect, it } from 'vitest';
import { worldManifest } from '../src/worlds/manifest';

describe('world manifest', () => {
  it('references an existing latest chapter', () => {
    expect(worldManifest.chapters.some((chapter) => chapter.id === worldManifest.latestChapterId)).toBe(true);
  });

  it('contains at least two launch chapters', () => {
    expect(worldManifest.chapters.length).toBeGreaterThanOrEqual(2);
  });
});
