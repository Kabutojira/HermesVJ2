import { Shell } from './components/Shell';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HeroOverlay } from './components/HeroOverlay';
import { ChapterRail } from './components/ChapterRail';
import { Hud } from './components/Hud';
import { ExperienceCanvas } from './experience/ExperienceCanvas';
import { detectQualityTier } from './lib/performance';
import { useUiStore } from './app/ui-store';
import { useWorldStore } from './app/world-store';

function App() {
  const qualityTier = detectQualityTier();
  const entered = useUiStore((state) => state.entered);
  const immersive = useUiStore((state) => state.immersive);
  const enterWorld = useUiStore((state) => state.enterWorld);
  const toggleImmersive = useUiStore((state) => state.toggleImmersive);

  const activeChapterId = useWorldStore((state) => state.activeChapterId);
  const setActiveChapter = useWorldStore((state) => state.setActiveChapter);

  return (
    <Shell immersive={immersive}>
      <ErrorBoundary>
        <ExperienceCanvas interactive={entered} qualityTier={qualityTier} />
        <HeroOverlay entered={entered} onEnter={enterWorld} />
        <div className="chrome-layer">
          <Hud activeChapterId={activeChapterId} immersive={immersive} qualityTier={qualityTier} onToggleImmersive={toggleImmersive} />
          <ChapterRail activeChapterId={activeChapterId} onSelect={setActiveChapter} />
        </div>
      </ErrorBoundary>
    </Shell>
  );
}

export default App;
