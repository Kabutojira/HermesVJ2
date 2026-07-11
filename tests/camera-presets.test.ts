import { describe, expect, it } from 'vitest';
import { cameraPresets } from '../src/experience/camera/cameraPresets';

describe('camera presets', () => {
  it('defines stable launch presets', () => {
    expect(Object.keys(cameraPresets)).toEqual(expect.arrayContaining(['lotusGate', 'wormholeSpire']));
    expect(cameraPresets.lotusGate.position).toHaveLength(3);
    expect(cameraPresets.wormholeSpire.fov).toBeGreaterThan(40);
  });
});
