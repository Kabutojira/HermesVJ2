import { describe, expect, it } from 'vitest';
import { worldManifest } from '../src/worlds/manifest';

describe('world manifest', () => {
  it('references an existing latest chapter', () => {
    expect(worldManifest.chapters.some((chapter) => chapter.id === worldManifest.latestChapterId)).toBe(true);
  });

  it('publishes exactly the five requested space scenes after the existing chapters', () => {
    const expectedSpaceIds = [
      'chapter-013-event-horizon-gala',
      'chapter-014-comet-shipyard',
      'chapter-017-trinary-orrey',
      'chapter-018-spiral-galaxy-sanctuary',
      'chapter-019-deep-space-convergence',
    ];

    expect(worldManifest.chapters).toHaveLength(17);
    expect(new Set(worldManifest.chapters.map((chapter) => chapter.id)).size).toBe(17);
    expect(worldManifest.chapters.slice(12).map((chapter) => chapter.id)).toEqual(expectedSpaceIds);
  });
});
