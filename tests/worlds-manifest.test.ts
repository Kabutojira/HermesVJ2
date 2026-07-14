import { describe, expect, it } from 'vitest';
import { worldManifest } from '../src/worlds/manifest';

describe('world manifest', () => {
  it('references an existing latest chapter', () => {
    expect(worldManifest.chapters.some((chapter) => chapter.id === worldManifest.latestChapterId)).toBe(true);
  });

  it('contains the two launch chapters and five visual studies', () => {
    expect(worldManifest.chapters).toHaveLength(7);
    expect(new Set(worldManifest.chapters.map((chapter) => chapter.id)).size).toBe(7);
  });
});
