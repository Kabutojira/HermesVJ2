import { chapters } from '../worlds/registry';
import { PerformanceBadge } from './PerformanceBadge';

interface HudProps {
  activeChapterId: string;
  immersive: boolean;
  qualityTier: string;
  onToggleImmersive: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onPulse: () => void;
}

export function Hud({ activeChapterId, immersive, qualityTier, onToggleImmersive, onPrevious, onNext, onPulse }: HudProps) {
  const chapter = chapters.find((entry) => entry.id === activeChapterId) ?? chapters[0];

  return (
    <div className="hud">
      <div>
        <p className="eyebrow">Active chapter</p>
        <h2>{chapter.title}</h2>
        <p>{chapter.description}</p>
      </div>
      <div className="hud-actions">
        <PerformanceBadge tier={qualityTier} />
        <button type="button" onClick={onPrevious} aria-label="Previous chapter">← Previous</button>
        <button type="button" onClick={onPulse}>Pulse <kbd>Space</kbd></button>
        <button type="button" onClick={onNext} aria-label="Next chapter">Next →</button>
        <button type="button" onClick={onToggleImmersive}>{immersive ? 'Windowed mode' : 'Immersive mode'}</button>
      </div>
    </div>
  );
}
