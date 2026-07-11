import { chapters } from '../worlds/registry';

export function chapterIdFromSearch(search: string): string {
  const requested = new URLSearchParams(search).get('chapter');
  return chapters.some((chapter) => chapter.id === requested) ? requested! : chapters[0].id;
}

export function adjacentChapterId(currentId: string, direction: -1 | 1): string {
  const currentIndex = Math.max(0, chapters.findIndex((chapter) => chapter.id === currentId));
  return chapters[(currentIndex + direction + chapters.length) % chapters.length].id;
}
