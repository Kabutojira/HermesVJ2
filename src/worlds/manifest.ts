import { chapters } from './registry';

export const worldManifest = {
  latestChapterId: chapters[0].id,
  chapters: chapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    description: chapter.description,
    createdAt: chapter.createdAt,
    moodPrompt: chapter.moodPrompt,
    movementMode: chapter.movementMode,
    previewImage: chapter.previewImage,
    status: 'published' as const,
  })),
};
