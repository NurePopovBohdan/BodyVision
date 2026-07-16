import { Edit2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import api, { getErrorMessage } from '../api/axios.js';
import EmptyState from '../components/EmptyState.jsx';
import GoalForm from '../components/GoalForm.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { useToast } from '../components/ToastProvider.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const normalizeGoal = (form) => {
  const payload = {};

  Object.entries(form).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      payload[key] = ['goalType', 'targetDate'].includes(key) || typeof value === 'boolean'
        ? value
        : Number(value);
    }
  });

  return payload;
};

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const { t } = useLanguage();
  const goalLabels = {
    weight_loss: t('weightLoss'),
    muscle_gain: t('muscleGain'),
    maintenance: t('maintenance')
  };

  const loadGoals = async () => {
    try {
      const { data } = await api.get('/goals');
      setGoals(data.goals);
      setEditing(data.goals.find((goal) => goal.isActive) || null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleSubmit = async (form) => {
    setSaving(true);
    setError('');

    try {
      const payload = normalizeGoal(form);

      if (editing?._id) {
        await api.put(`/goals/${editing._id}`, payload);
      } else {
        await api.post('/goals', payload);
      }

      await loadGoals();
      toast.success(editing?._id ? t('goalUpdated') : t('goalCreated'));
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setError('');

    try {
      await api.delete(`/goals/${id}`);
      await loadGoals();
      toast.info(t('goalDeleted'));
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="stack">
      <div className="page-title">
        <div>
          <span>{t('targetShape')}</span>
          <h1>{t('goalsTitle')}</h1>
        </div>
      </div>

      {error ? <div className="alert error">{error}</div> : null}

      <section className="panel">
        <div className="section-heading">
          <div>
            <span>{editing?._id ? t('activeGoal') : t('newGoal')}</span>
            <h2>{t('goalParams')}</h2>
          </div>
        </div>
        <GoalForm initialValue={editing} onSubmit={handleSubmit} submitting={saving} />
      </section>

      <section className="panel">
        {goals.length ? (
          <div className="goals-list">
            {goals.map((goal) => (
              <article key={goal._id} className={`goal-item ${goal.isActive ? 'active' : ''}`}>
                <div>
                  <strong>{goalLabels[goal.goalType]}</strong>
                  <span>{t('until')} {new Date(goal.targetDate).toLocaleDateString('ru-RU')}</span>
                </div>
                <div className="goal-values">
                  <span>{goal.desiredWeight ?? '—'} {t('kg')}</span>
                  <span>{goal.desiredBodyFatPercentage ?? '—'}%</span>
                  <span>{goal.desiredWaist ?? '—'} {t('cm')} {t('waist').toLowerCase()}</span>
                </div>
                <div className="row-actions">
                  <button className="icon-button" type="button" onClick={() => setEditing(goal)} title={t('edit')}>
                    <Edit2 size={16} />
                  </button>
                  <button className="icon-button danger" type="button" onClick={() => handleDelete(goal._id)} title={t('delete')}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title={t('goalsEmptyTitle')} text={t('goalsEmptyText')} />
        )}
      </section>
    </div>
  );
};

export default Goals;
