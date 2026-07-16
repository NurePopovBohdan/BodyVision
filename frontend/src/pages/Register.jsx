import { Activity } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { getErrorMessage } from '../api/axios.js';
import { useToast } from '../components/ToastProvider.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const Register = () => {
  const { isAuthenticated, register } = useAuth();
  const { t } = useLanguage();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    gender: 'other',
    age: '',
    height: '',
    currentWeight: '',
    activityLevel: 'moderate'
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await register(form);
      toast.success(t('registerSuccess'));
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
      <section className="auth-card wide-auth">
        <div className="auth-brand">
          <div className="brand-mark"><Activity size={24} /></div>
          <div>
            <h1>{t('registerTitle')}</h1>
            <p>{t('registerSubtitle')}</p>
          </div>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          {error ? <div className="alert error wide">{error}</div> : null}
          <label>
            <span>{t('name')}</span>
            <input name="name" value={form.name} onChange={handleChange} required minLength="2" />
          </label>
          <label>
            <span>{t('email')}</span>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            <span>{t('password')}</span>
            <input name="password" type="password" value={form.password} onChange={handleChange} required minLength="8" />
          </label>
          <label>
            <span>{t('gender')}</span>
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="male">{t('male')}</option>
              <option value="female">{t('female')}</option>
              <option value="other">{t('other')}</option>
            </select>
          </label>
          <label>
            <span>{t('age')}</span>
            <input name="age" type="number" value={form.age} onChange={handleChange} min="12" max="100" />
          </label>
          <label>
            <span>{t('height')}</span>
            <input name="height" type="number" value={form.height} onChange={handleChange} min="100" max="250" placeholder={t('cm')} />
          </label>
          <label>
            <span>{t('currentWeight')}</span>
            <input name="currentWeight" type="number" value={form.currentWeight} onChange={handleChange} min="30" max="350" placeholder={t('kg')} />
          </label>
          <label>
            <span>{t('activity')}</span>
            <select name="activityLevel" value={form.activityLevel} onChange={handleChange}>
              <option value="sedentary">{t('sedentary')}</option>
              <option value="light">{t('light')}</option>
              <option value="moderate">{t('moderate')}</option>
              <option value="active">{t('active')}</option>
              <option value="very_active">{t('veryActive')}</option>
            </select>
          </label>
          <div className="form-actions wide">
            <button className="primary-button full-width" type="submit" disabled={submitting}>
              {submitting ? t('creating') : t('createAccount')}
            </button>
          </div>
        </form>

        <p className="auth-link">
          {t('alreadyAccount')} <Link to="/login">{t('login')}</Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
