import { useEffect, useState } from 'react';

import api, { getErrorMessage } from '../api/axios.js';
import LoadingState from '../components/LoadingState.jsx';
import { useToast } from '../components/ToastProvider.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const Profile = () => {
  const { setUser } = useAuth();
  const { t } = useLanguage();
  const toast = useToast();
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setForm(data.user);
      } catch (err) {
        setError(getErrorMessage(err));
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const { data } = await api.put('/users/profile', form);
      setForm(data.user);
      setUser(data.user);
      localStorage.setItem('bodyVisionUser', JSON.stringify(data.user));
      setMessage(t('profileUpdated'));
      toast.success(t('profileUpdated'));
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (!form && !error) return <LoadingState />;

  return (
    <div className="stack">
      <div className="page-title">
        <div>
          <span>{t('profileKicker')}</span>
          <h1>{t('profileTitle')}</h1>
        </div>
      </div>

      {error ? <div className="alert error">{error}</div> : null}
      {message ? <div className="alert success">{message}</div> : null}

      {form ? (
        <section className="panel">
          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              <span>{t('name')}</span>
              <input name="name" value={form.name || ''} onChange={handleChange} required />
            </label>
            <label>
              <span>{t('email')}</span>
              <input value={form.email || ''} disabled />
            </label>
            <label>
              <span>{t('gender')}</span>
              <select name="gender" value={form.gender || 'other'} onChange={handleChange}>
                <option value="male">{t('male')}</option>
                <option value="female">{t('female')}</option>
                <option value="other">{t('other')}</option>
              </select>
            </label>
            <label>
              <span>{t('age')}</span>
              <input name="age" type="number" value={form.age || ''} onChange={handleChange} />
            </label>
            <label>
              <span>{t('height')}</span>
              <input name="height" type="number" value={form.height || ''} onChange={handleChange} />
            </label>
            <label>
              <span>{t('currentWeight')}</span>
              <input name="currentWeight" type="number" value={form.currentWeight || ''} onChange={handleChange} />
            </label>
            <label>
              <span>{t('activity')}</span>
              <select name="activityLevel" value={form.activityLevel || 'moderate'} onChange={handleChange}>
                <option value="sedentary">{t('sedentary')}</option>
                <option value="light">{t('light')}</option>
                <option value="moderate">{t('moderate')}</option>
                <option value="active">{t('active')}</option>
                <option value="very_active">{t('veryActive')}</option>
              </select>
            </label>
            <label>
              <span>{t('createdAt')}</span>
              <input value={form.createdAt ? new Date(form.createdAt).toLocaleDateString('ru-RU') : ''} disabled />
            </label>
            <div className="form-actions wide">
              <button className="primary-button" type="submit" disabled={saving}>
                {saving ? t('saving') : t('saveProfile')}
              </button>
            </div>
          </form>
        </section>
      ) : null}
    </div>
  );
};

export default Profile;
