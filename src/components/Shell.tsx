import type { ReactNode } from 'react';

interface ShellProps {
  immersive: boolean;
  children: ReactNode;
}

export function Shell({ immersive, children }: ShellProps) {
  return <main className={immersive ? 'app-shell immersive' : 'app-shell'}>{children}</main>;
}
