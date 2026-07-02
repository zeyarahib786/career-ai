import { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  state = { hasError:false, error:null };

  static getDerivedStateFromError(error) { return { hasError:true, error }; }

  componentDidCatch(error, info) { console.error('ErrorBoundary:', error, info.componentStack); }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div role="alert" style={{ padding:'48px 32px', textAlign:'center', color:'var(--t3)' }}>
        <p style={{ fontSize:'1.5rem', color:'var(--t1)', marginBottom:'12px' }}>Something went wrong</p>
        <p style={{ marginBottom:'24px' }}>
          Please refresh the page or contact{' '}
          <a href="mailto:academy@solvagence.com" style={{ color:'var(--em)' }}>academy@solvagence.com</a>
        </p>
        <button onClick={() => window.location.reload()}
          style={{ padding:'12px 28px', background:'var(--em)', color:'#000', border:'none', borderRadius:'2px', fontWeight:700, cursor:'pointer' }}>
          Refresh Page
        </button>
      </div>
    );
  }
}

ErrorBoundary.propTypes = { children: PropTypes.node.isRequired };
export default ErrorBoundary;
