import { useEffect, useState } from 'react';
import { Shell } from './components/Shell';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HeroOverlay } from './components/HeroOverlay';
import { ChapterRail } from './components/ChapterRail';
import { Hud } from './components/Hud';
import { ExperienceCanvas } from './experience/ExperienceCanvas';
import { useQualityTier } from './lib/performance';
import { canUseWebGL, useReducedMotion } from './lib/runtime';
import { useUiStore } from './app/ui-store';
import { useWorldStore } from './app/world-store';
import { adjacentChapterId } from './lib/navigation';

function App() {
  const qualityTier = useQualityTier();
  const reducedMotion = useReducedMotion();
  const [webglAvailable, setWebglAvailable] = useState(() => new URLSearchParams(window.location.search).get('webgl') !== 'off' && canUseWebGL());
  const entered = useUiStore((state) => state.entered);
  const immersive = useUiStore((state) => state.immersive);
  const enterWorld = useUiStore((state) => state.enterWorld);
  const toggleImmersive = useUiStore((state) => state.toggleImmersive);

  const activeChapterId = useWorldStore((state) => state.activeChapterId);
  const setActiveChapter = useWorldStore((state) => state.setActiveChapter);
  const triggerPulse = useWorldStore((state) => state.triggerPulse);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('chapter', activeChapterId);
    window.history.replaceState({}, '', url);
  }, [activeChapterId]);

  useEffect(() => {
    if (!entered) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLButtonElement) return;
      if (event.code === 'Space') {
        event.preventDefault();
        triggerPulse();
      } else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
        setActiveChapter(adjacentChapterId(useWorldStore.getState().activeChapterId, 1));
      } else if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
        setActiveChapter(adjacentChapterId(useWorldStore.getState().activeChapterId, -1));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [entered, setActiveChapter, triggerPulse]);

  return (
    <Shell immersive={immersive}>
      <ErrorBoundary>
        <ExperienceCanvas interactive={entered} qualityTier={qualityTier} reducedMotion={reducedMotion} webglAvailable={webglAvailable} onContextLost={() => setWebglAvailable(false)} />
        <HeroOverlay entered={entered} onEnter={enterWorld} />
        <div className="chrome-layer">
          <Hud activeChapterId={activeChapterId} immersive={immersive} qualityTier={`${qualityTier}${reducedMotion ? ' · reduced motion' : ''}`} onToggleImmersive={toggleImmersive} onPrevious={() => setActiveChapter(adjacentChapterId(activeChapterId, -1))} onNext={() => setActiveChapter(adjacentChapterId(activeChapterId, 1))} onPulse={triggerPulse} />
          <ChapterRail activeChapterId={activeChapterId} onSelect={setActiveChapter} />
        </div>
      </ErrorBoundary>
    </Shell>
  );
}

export default App;
