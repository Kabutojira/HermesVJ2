import { chapters } from '../worlds/registry';

interface ChapterRailProps {
  activeChapterId: string;
  onSelect: (id: string) => void;
}

export function ChapterRail({ activeChapterId, onSelect }: ChapterRailProps) {
  return (
    <div className="chapter-rail">
      {chapters.map((chapter, index) => (
        <button
          key={chapter.id}
          type="button"
          className={chapter.id === activeChapterId ? 'chapter-pill active' : 'chapter-pill'}
          onClick={() => onSelect(chapter.id)}
        >
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{chapter.title}</strong>
        </button>
      ))}
    </div>
  );
}
