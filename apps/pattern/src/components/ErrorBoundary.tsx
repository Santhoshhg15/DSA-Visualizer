import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] React crash caught:', error);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: '#1e1e1e',
          color: '#f85149',
          padding: '24px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
          borderRadius: '12px',
          border: '1px solid #f85149',
          margin: '16px',
          maxHeight: '80vh',
          overflow: 'auto'
        }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: '#ff7b72' }}>
            ⚠️ React Rendering Error
          </div>
          <div style={{ color: '#ffa198', marginBottom: '8px' }}>
            <strong>Error:</strong> {this.state.error?.message}
          </div>
          <pre style={{ color: '#8b949e', fontSize: '10px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#0d1117', padding: '12px', borderRadius: '8px' }}>
            {this.state.error?.stack}
          </pre>
          {this.state.errorInfo && (
            <pre style={{ color: '#6e7681', fontSize: '10px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#0d1117', padding: '12px', borderRadius: '8px', marginTop: '8px' }}>
              {this.state.errorInfo.componentStack}
            </pre>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            style={{
              marginTop: '12px',
              padding: '8px 16px',
              background: '#21262d',
              border: '1px solid #30363d',
              borderRadius: '8px',
              color: '#e6edf3',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
