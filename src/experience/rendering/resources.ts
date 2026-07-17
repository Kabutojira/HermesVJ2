import { useEffect } from 'react';

export interface DisposableResource {
  dispose: () => void;
}

export function disposeSceneResources(resources: Iterable<DisposableResource>): void {
  for (const resource of new Set(resources)) resource.dispose();
}

/**
 * Registers manually-created Three.js resources for deterministic scene-unmount cleanup.
 * Declarative R3F geometry and materials are disposed by R3F and do not belong here.
 */
export function useSceneResources(resources: readonly DisposableResource[]): void {
  useEffect(() => () => disposeSceneResources(resources), [resources]);
}
