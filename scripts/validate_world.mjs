import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url);
const manifestSource = readFileSync(new URL('../src/worlds/manifest.ts', import.meta.url), 'utf8');
const registrySource = readFileSync(new URL('../src/worlds/registry.ts', import.meta.url), 'utf8');
const chaptersDir = new URL('../src/worlds/chapters', import.meta.url);

const latestMatch = manifestSource.match(/latestChapterId:\s*chapters\[0\]\.id/);
if (!latestMatch) {
  throw new Error('manifest must set latestChapterId from the first registered chapter');
}

if (!registrySource.includes('LotusGateWorld') || !registrySource.includes('WormholeSpireWorld')) {
  throw new Error('registry is missing one of the launch chapters');
}

const chapterDirs = readdirSync(chaptersDir).filter((entry) => statSync(join(chaptersDir.pathname, entry)).isDirectory());
if (chapterDirs.length < 2) {
  throw new Error(`expected at least 2 chapter directories, found ${chapterDirs.length}`);
}

console.log(`Validated ${chapterDirs.length} chapter directories and registry launch entries.`);
