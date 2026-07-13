import { useEffect, useState } from 'react';

export const canUseWebGL = (canvas: HTMLCanvasElement = document.createElement('canvas')): boolean => {
  try {
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
};

export const prefersReducedMotion = (mediaMatches: boolean, search: string): boolean =>
  mediaMatches || new URLSearchParams(search).get('motion') === 'reduce';

export function useReducedMotion(): boolean {
  const query = '(prefers-reduced-motion: reduce)';
  const readPreference = () => typeof window !== 'undefined' && prefersReducedMotion(window.matchMedia(query).matches, window.location.search);
  const [reduced, setReduced] = useState(readPreference);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setReduced(prefersReducedMotion(media.matches, window.location.search));
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return reduced;
}
