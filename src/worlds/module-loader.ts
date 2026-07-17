export interface SceneModule<T> {
  chapter: T;
}

export function collectSceneModules<T extends { id: string; createdAt: string }>(modules: Record<string, SceneModule<T>>): T[] {
  const chapters = Object.values(modules).map((module) => module.chapter);
  const ids = new Set<string>();
  for (const chapter of chapters) {
    if (ids.has(chapter.id)) throw new Error(`Duplicate scene id: ${chapter.id}`);
    ids.add(chapter.id);
  }
  return chapters.sort((left, right) => left.createdAt.localeCompare(right.createdAt));
}
