import { describe, expect, it } from 'vitest';
import { chapters } from '../src/worlds/registry';

describe('interaction modes', () => {
  it('keeps chapter movement modes within supported launch values', () => {
    const supported = ['orbit', 'guided', 'free-fly'];
    for (const chapter of chapters) {
      expect(supported).toContain(chapter.movementMode);
      expect(chapter.interactionModel.primaryAction.length).toBeGreaterThan(10);
    }
  });
});
