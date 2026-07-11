import { describe, expect, it } from 'vitest';
import { chapterIdFromSearch, adjacentChapterId } from '../src/lib/navigation';
import { chapters } from '../src/worlds/registry';

describe('chapter navigation', () => {
  it('accepts only registered chapter ids from the URL', () => {
    expect(chapterIdFromSearch(`?chapter=${chapters[1].id}`)).toBe(chapters[1].id);
    expect(chapterIdFromSearch('?chapter=unknown')).toBe(chapters[0].id);
  });

  it('wraps previous and next navigation', () => {
    expect(adjacentChapterId(chapters[0].id, -1)).toBe(chapters.at(-1)?.id);
    expect(adjacentChapterId(chapters.at(-1)?.id ?? '', 1)).toBe(chapters[0].id);
  });
});
