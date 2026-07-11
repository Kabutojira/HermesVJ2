import { onboardingCopy } from '../content/onboardingCopy';
import { worldLore } from '../content/worldLore';
import { EnterWorldButton } from './EnterWorldButton';

interface HeroOverlayProps {
  entered: boolean;
  onEnter: () => void;
}

export function HeroOverlay({ entered, onEnter }: HeroOverlayProps) {
  if (entered) return null;

  return (
    <section className="hero-overlay">
      <p className="eyebrow">{onboardingCopy.eyebrow}</p>
      <h1>{onboardingCopy.title}</h1>
      <p className="lead">{onboardingCopy.lead}</p>
      <p className="lore">{worldLore.summary}</p>
      <ul>
        {onboardingCopy.controls.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <EnterWorldButton onClick={onEnter} />
    </section>
  );
}
