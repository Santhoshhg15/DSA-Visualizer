import React from 'react';

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Catches any render error in the DP visualizer and shows a readable
 * crash report instead of a blank black screen.
 */
export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    console.error('[DP Visualizer] Render error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const msg = this.state.error?.message ?? 'Unknown error';
    const stack = this.state.error?.stack ?? '';
    const componentStack = this.state.errorInfo?.componentStack ?? '';

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '32px',
          background: 'var(--bg-color)',
          gap: '16px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div style={{ fontSize: '32px' }}>⚠️</div>
        <h2
          style={{
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--text-color)',
            margin: 0,
          }}
        >
          Visualizer Crashed
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--muted-color)', margin: 0, textAlign: 'center' }}>
          {msg}
        </p>

        {/* Full stack for debugging */}
        <pre
          style={{
            fontSize: '10px',
            color: 'var(--muted-color)',
            background: 'var(--input-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '12px',
            maxWidth: '600px',
            maxHeight: '220px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            textAlign: 'left',
          }}
        >
          {stack}
          {componentStack ? `\n\nComponent Stack:${componentStack}` : ''}
        </pre>

        <button
          onClick={this.handleReset}
          style={{
            fontSize: '12px',
            fontWeight: 600,
            padding: '8px 20px',
            borderRadius: '8px',
            background: 'var(--accent-indigo-bg)',
            border: '1px solid var(--accent-indigo)',
            color: 'var(--accent-indigo)',
            cursor: 'pointer',
          }}
        >
          Try to recover
        </button>
      </div>
    );
  }
}
