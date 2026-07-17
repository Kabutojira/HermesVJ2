import { describe, expect, it } from 'vitest';

import { collectSceneModules } from '../src/worlds/module-loader';

const chapter = (id: string, createdAt: string) => ({ id, createdAt });

describe('independent scene module discovery', () => {
  it('orders discovered modules by creation time without a central registry edit', () => {
    const modules = {
      './chapters/chapter-b/module.ts': { chapter: chapter('chapter-b', '2026-02-01T00:00:00Z') },
      './chapters/chapter-a/module.ts': { chapter: chapter('chapter-a', '2026-01-01T00:00:00Z') },
    };
    expect(collectSceneModules(modules).map((item) => item.id)).toEqual(['chapter-a', 'chapter-b']);
  });

  it('rejects duplicate discovered ids', () => {
    const duplicate = chapter('chapter-a', '2026-01-01T00:00:00Z');
    expect(() => collectSceneModules({ a: { chapter: duplicate }, b: { chapter: duplicate } })).toThrow(/duplicate scene id/i);
  });
});
