import { Activity } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { getErrorMessage } from '../api/axios.js';
import { useToast } from '../components/ToastProvider.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const { t } = useLanguage();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'demo@bodyvision.local', password: 'Demo12345' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await login(form);
      toast.success(t('loginSuccess'));
      navigate('/dashboard');
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <div className="brand-mark"><Activity size={24} /></div>
          <div>
            <h1>Body Vision</h1>
            <p>{t('authSubtitle')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {error ? <div className="alert error">{error}</div> : null}
          <label>
            <span>{t('email')}</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <label>
            <span>{t('password')}</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              minLength="8"
              required
            />
          </label>
          <button className="primary-button full-width" type="submit" disabled={submitting}>
            {submitting ? t('loggingIn') : t('login')}
          </button>
        </form>

        <p className="auth-link">
          {t('noAccount')} <Link to="/register">{t('registerLink')}</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
