import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Component } from 'react';

import { LanguageContext } from '../context/LanguageContext.jsx';

class ErrorBoundary extends Component {
  static contextType = LanguageContext;

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('UI error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      const t = this.context?.t || ((key) => key);

      return (
        <main className="auth-page">
          <section className="auth-card error-card">
            <div className="auth-brand">
              <div className="brand-mark danger-mark"><AlertTriangle size={24} /></div>
              <div>
                <h1>{t('uiStopped')}</h1>
                <p>{t('uiStoppedText')}</p>
              </div>
            </div>
            <button className="primary-button full-width" type="button" onClick={() => window.location.reload()}>
              <RotateCcw size={18} />
              <span>{t('reload')}</span>
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
