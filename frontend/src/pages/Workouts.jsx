import { CheckCircle2, Dumbbell, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import api, { getErrorMessage } from '../api/axios.js';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { useToast } from '../components/ToastProvider.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const types = ['strength', 'cardio', 'mobility', 'recovery'];

const Workouts = () => {
  const { t } = useLanguage();
  const toast = useToast();
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({
    title: '',
    dayOfWeek: 'monday',
    workoutType: 'strength',
    exercisesText: 'Squat, 4x8-10\nBench press, 4x8-10'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadWorkouts = async () => {
    try {
      const { data } = await api.get('/workouts');
      setWorkouts(data.workouts);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  const parseExercises = (text) => text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, reps = '10-12'] = line.split(',').map((part) => part.trim());
      return { name, reps, sets: Number(reps.match(/\d+/)?.[0]) || 3 };
    });

  const createWorkout = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      await api.post('/workouts', {
        title: form.title,
        dayOfWeek: form.dayOfWeek,
        workoutType: form.workoutType,
        exercises: parseExercises(form.exercisesText)
      });
      setForm((current) => ({ ...current, title: '' }));
      await loadWorkouts();
      toast.success(t('workoutCreated') || 'Workout created');
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const toggleWorkout = async (workout) => {
    const { data } = await api.put(`/workouts/${workout._id}`, { completed: !workout.completed });
    setWorkouts((current) => current.map((item) => (item._id === workout._id ? data.workout : item)));
  };

  const deleteWorkout = async (id) => {
    await api.delete(`/workouts/${id}`);
    setWorkouts((current) => current.filter((item) => item._id !== id));
    toast.info(t('workoutDeleted') || 'Workout deleted');
  };

  if (loading) return <LoadingState />;

  return (
    <div className="stack">
      <div className="page-title">
        <div>
          <span>{t('workoutKicker') || 'Training'}</span>
          <h1>{t('workoutTitle') || 'Workout plan'}</h1>
        </div>
      </div>

      {error ? <div className="alert error">{error}</div> : null}

      <section className="panel">
        <form className="form-grid" onSubmit={createWorkout}>
          <label>
            <span>{t('workoutName') || 'Workout name'}</span>
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
          </label>
          <label>
            <span>{t('dayOfWeek') || 'Day'}</span>
            <select value={form.dayOfWeek} onChange={(event) => setForm({ ...form, dayOfWeek: event.target.value })}>
              {days.map((day) => <option key={day} value={day}>{t(day) || day}</option>)}
            </select>
          </label>
          <label>
            <span>{t('workoutType') || 'Type'}</span>
            <select value={form.workoutType} onChange={(event) => setForm({ ...form, workoutType: event.target.value })}>
              {types.map((type) => <option key={type} value={type}>{t(type) || type}</option>)}
            </select>
          </label>
          <label className="wide">
            <span>{t('exercises') || 'Exercises'}</span>
            <textarea rows="4" value={form.exercisesText} onChange={(event) => setForm({ ...form, exercisesText: event.target.value })} />
          </label>
          <div className="form-actions wide">
            <button className="primary-button" type="submit" disabled={saving}>
              <Plus size={18} />
              <span>{saving ? t('saving') : t('createWorkout') || 'Create workout'}</span>
            </button>
          </div>
        </form>
      </section>

      {workouts.length ? (
        <div className="workout-board">
          {days.map((day) => (
            <section className="panel workout-day" key={day}>
              <h2>{t(day) || day}</h2>
              {workouts.filter((workout) => workout.dayOfWeek === day).map((workout) => (
                <article className={`workout-card ${workout.completed ? 'completed' : ''}`} key={workout._id}>
                  <div>
                    <strong><Dumbbell size={16} /> {workout.title}</strong>
                    <span>{t(workout.workoutType) || workout.workoutType}</span>
                  </div>
                  <ul>
                    {workout.exercises.map((exercise, index) => (
                      <li key={`${exercise.name}-${index}`}>{exercise.name} · {exercise.sets} · {exercise.reps}</li>
                    ))}
                  </ul>
                  <div className="row-actions">
                    <button className="icon-button" type="button" onClick={() => toggleWorkout(workout)} title={t('complete')}>
                      <CheckCircle2 size={16} />
                    </button>
                    <button className="icon-button danger" type="button" onClick={() => deleteWorkout(workout._id)} title={t('delete')}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </section>
          ))}
        </div>
      ) : (
        <EmptyState title={t('workoutEmptyTitle') || 'No workouts yet'} text={t('workoutEmptyText') || 'Create a weekly plan connected to your body goal.'} />
      )}
    </div>
  );
};

export default Workouts;
