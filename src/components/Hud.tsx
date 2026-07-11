import { chapters } from '../worlds/registry';
import { PerformanceBadge } from './PerformanceBadge';

interface HudProps {
  activeChapterId: string;
  immersive: boolean;
  qualityTier: string;
  onToggleImmersive: () => void;
  onTogglePanel: () => void;
  onToggleAudio: () => void;
}

export function Hud({ activeChapterId, immersive, qualityTier, onToggleImmersive, onTogglePanel, onToggleAudio }: HudProps) {
  const chapter = chapters.find((entry) => entry.id === activeChapterId) ?? chapters[0];

  return (
    <div className="hud">
      <div>
        <p className="eyebrow">Latest chapter</p>
        <h2>{chapter.title}</h2>
        <p>{chapter.description}</p>
      </div>
      <div className="hud-actions">
        <PerformanceBadge tier={qualityTier} />
        <button type="button" onClick={onToggleImmersive}>{immersive ? 'Windowed mode' : 'Immersive mode'}</button>
        <button type="button" onClick={onTogglePanel}>Toggle notes</button>
        <button type="button" onClick={onToggleAudio}>Ambient audio placeholder</button>
      </div>
    </div>
  );
}
