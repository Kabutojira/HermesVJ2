import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ErrorBoundary } from '../src/components/ErrorBoundary';

function BrokenScene() {
  throw new Error('scene failed');
}

describe('scene error recovery', () => {
  afterEach(() => vi.restoreAllMocks());

  it('keeps navigation outside the boundary and resets when the chapter changes', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const view = render(<>
      <ErrorBoundary resetKey="chapter-a"><BrokenScene /></ErrorBoundary>
      <button>Next chapter</button>
    </>);

    expect(screen.getByRole('alert')).toHaveTextContent('The world paused safely.');
    expect(screen.getByRole('button', { name: 'Next chapter' })).toBeVisible();

    view.rerender(<>
      <ErrorBoundary resetKey="chapter-b"><div>Recovered scene</div></ErrorBoundary>
      <button>Next chapter</button>
    </>);
    expect(screen.getByText('Recovered scene')).toBeVisible();
  });
});
