import { describe, expect, it } from 'vitest';
import { worldManifest } from '../src/worlds/manifest';

describe('world manifest', () => {
  it('references an existing latest chapter', () => {
    expect(worldManifest.chapters.some((chapter) => chapter.id === worldManifest.latestChapterId)).toBe(true);
  });

  it('contains the launch chapters, visual studies, and five elemental chapters', () => {
    const elementalIds = [
      'chapter-008-tempest-lantern',
      'chapter-009-cinder-sanctum',
      'chapter-010-nebula-fountain',
      'chapter-011-frost-oracle',
      'chapter-012-thunder-forge',
    ];

    expect(worldManifest.chapters).toHaveLength(12);
    expect(new Set(worldManifest.chapters.map((chapter) => chapter.id)).size).toBe(12);
    expect(worldManifest.chapters.map((chapter) => chapter.id)).toEqual(expect.arrayContaining(elementalIds));
  });
});
