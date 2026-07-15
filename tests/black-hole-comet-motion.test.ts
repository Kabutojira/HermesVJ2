import { describe, expect, it } from 'vitest';
import { getInfallingMatterPosition } from '../src/worlds/chapters/chapter-013-event-horizon-gala/scene/motion';
import { getCometFlightPosition } from '../src/worlds/chapters/chapter-014-comet-shipyard/scene/motion';

describe('black hole and comet motion', () => {
  it('pulls matter inward before it loops outside the event horizon', () => {
    const start = getInfallingMatterPosition(2, 0);
    const later = getInfallingMatterPosition(2, 1.5);

    expect(Math.hypot(later[0], later[2])).toBeLessThan(Math.hypot(start[0], start[2]));
    expect(Math.hypot(later[0], later[2])).toBeGreaterThan(1.2);
  });

  it('loops each moving comet cleanly along its own flight lane', () => {
    const start = getCometFlightPosition(1, 0);
    const looped = getCometFlightPosition(1, 12);
    const moving = getCometFlightPosition(1, 1);

    expect(looped).toEqual(start);
    expect(moving).not.toEqual(start);
  });
});
