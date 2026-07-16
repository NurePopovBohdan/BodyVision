import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import api, { getErrorMessage } from '../api/axios.js';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import MeasurementCalendar from '../components/MeasurementCalendar.jsx';
import MeasurementForm from '../components/MeasurementForm.jsx';
import { useToast } from '../components/ToastProvider.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const normalizeMeasurement = (form) => {
  const payload = {};

  Object.entries(form).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      payload[key] = key === 'notes' || key === 'measuredAt' ? value : Number(value);
    }
  });

  return payload;
};

const Measurements = () => {
  const [measurements, setMeasurements] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const { t } = useLanguage();

  const loadMeasurements = async () => {
    try {
      const { data } = await api.get('/measurements');
      setMeasurements(data.measurements);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeasurements();
  }, []);

  const handleSubmit = async (form) => {
    setSaving(true);
    setError('');

    try {
      const payload = normalizeMeasurement(form);

      if (editing?._id) {
        await api.put(`/measurements/${editing._id}`, payload);
      } else {
        await api.post('/measurements', payload);
      }

      setEditing(null);
      await loadMeasurements();
      toast.success(editing?._id ? t('measurementUpdated') : t('measurementCreated'));
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
      await api.delete(`/measurements/${id}`);
      setMeasurements((current) => current.filter((item) => item._id !== id));
      toast.info(t('measurementDeleted'));
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
          <span>{t('history')}</span>
          <h1>{t('measurementsTitle')}</h1>
        </div>
        <button className="primary-button" type="button" onClick={() => setEditing({})}>
          <Plus size={18} />
          <span>{t('newMeasurement')}</span>
        </button>
      </div>

      {error ? <div className="alert error">{error}</div> : null}

      {editing !== null ? (
        <section className="panel">
          <div className="section-heading">
            <div>
              <span>{editing?._id ? t('editing') : t('add')}</span>
              <h2>{t('bodyParams')}</h2>
            </div>
          </div>
          <MeasurementForm
            initialValue={editing?._id ? editing : null}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
            submitting={saving}
          />
        </section>
      ) : null}

      <MeasurementCalendar measurements={measurements} />

      <section className="panel">
        {measurements.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{t('measurementDate')}</th>
                  <th>{t('weight')}</th>
                  <th>{t('chartFat')}</th>
                  <th>{t('chest')}</th>
                  <th>{t('waist')}</th>
                  <th>{t('hips')}</th>
                  <th>{t('shoulders')}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {measurements.map((item) => (
                  <tr key={item._id}>
                    <td>{new Date(item.measuredAt).toLocaleDateString('ru-RU')}</td>
                    <td>{item.weight} {t('kg')}</td>
                    <td>{item.bodyFatPercentage ?? '—'}%</td>
                    <td>{item.chest ?? '—'} {t('cm')}</td>
                    <td>{item.waist ?? '—'} {t('cm')}</td>
                    <td>{item.hips ?? '—'} {t('cm')}</td>
                    <td>{item.shoulders ?? '—'} {t('cm')}</td>
                    <td className="row-actions">
                      <button className="icon-button" type="button" onClick={() => setEditing(item)} title={t('edit')}>
                        <Edit2 size={16} />
                      </button>
                      <button className="icon-button danger" type="button" onClick={() => handleDelete(item._id)} title={t('delete')}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title={t('measurementsEmptyTitle')} text={t('measurementsEmptyText')} />
        )}
      </section>
    </div>
  );
};

export default Measurements;
