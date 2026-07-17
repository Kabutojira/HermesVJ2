import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';

interface ErrorBoundaryProps { children: ReactNode; resetKey?: string; }
interface ErrorBoundaryState { hasError: boolean; resetKey?: string; }

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, resetKey: this.props.resetKey };
  static getDerivedStateFromError() { return { hasError: true }; }
  static getDerivedStateFromProps(props: ErrorBoundaryProps, state: ErrorBoundaryState) {
    if (props.resetKey !== state.resetKey) return { hasError: false, resetKey: props.resetKey };
    return null;
  }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('HermesVJ2 render error', error, info); }

  render() {
    if (this.state.hasError) {
      return <section className="webgl-fallback" role="alert"><p className="eyebrow">Static transmission</p><h1>The world paused safely.</h1><p>The interactive scene could not render. Reload the page, enable browser hardware acceleration, or continue reading the chapter navigation.</p></section>;
    }
    return this.props.children;
  }
}
