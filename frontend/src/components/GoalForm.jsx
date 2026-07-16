import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useLanguage } from '../context/LanguageContext.jsx';

const emptyGoal = {
  desiredWeight: '',
  desiredBodyFatPercentage: '',
  desiredWaist: '',
  desiredChest: '',
  desiredHips: '',
  targetDate: '',
  goalType: 'weight_loss',
  isActive: true
};

const GoalForm = ({ initialValue, onSubmit, submitting }) => {
  const { t } = useLanguage();
  const [form, setForm] = useState(emptyGoal);

  useEffect(() => {
    if (initialValue) {
      setForm({
        ...emptyGoal,
        ...initialValue,
        targetDate: initialValue.targetDate
          ? new Date(initialValue.targetDate).toISOString().slice(0, 10)
          : ''
      });
    } else {
      setForm(emptyGoal);
    }
  }, [initialValue]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>
        <span>{t('desiredWeight')}</span>
        <input name="desiredWeight" type="number" step="0.1" value={form.desiredWeight || ''} onChange={handleChange} placeholder={t('kg')} />
      </label>
      <label>
        <span>{t('desiredBodyFat')}</span>
        <input name="desiredBodyFatPercentage" type="number" step="0.1" value={form.desiredBodyFatPercentage || ''} onChange={handleChange} placeholder="%" />
      </label>
      <label>
        <span>{t('desiredWaist')}</span>
        <input name="desiredWaist" type="number" step="0.1" value={form.desiredWaist || ''} onChange={handleChange} placeholder={t('cm')} />
      </label>
      <label>
        <span>{t('desiredChest')}</span>
        <input name="desiredChest" type="number" step="0.1" value={form.desiredChest || ''} onChange={handleChange} placeholder={t('cm')} />
      </label>
      <label>
        <span>{t('desiredHips')}</span>
        <input name="desiredHips" type="number" step="0.1" value={form.desiredHips || ''} onChange={handleChange} placeholder={t('cm')} />
      </label>
      <label>
        <span>{t('targetDate')}</span>
        <input name="targetDate" type="date" value={form.targetDate || ''} onChange={handleChange} required />
      </label>
      <label>
        <span>{t('goalType')}</span>
        <select name="goalType" value={form.goalType} onChange={handleChange} required>
          <option value="weight_loss">{t('weightLoss')}</option>
          <option value="muscle_gain">{t('muscleGain')}</option>
          <option value="maintenance">{t('maintenance')}</option>
        </select>
      </label>
      <label className="checkbox-row">
        <input name="isActive" type="checkbox" checked={Boolean(form.isActive)} onChange={handleChange} />
        <span>{t('activeGoal')}</span>
      </label>
      <div className="form-actions">
        <button className="primary-button" type="submit" disabled={submitting}>
          <Save size={18} />
          <span>{submitting ? t('saving') : t('saveGoal')}</span>
        </button>
      </div>
    </form>
  );
};

export default GoalForm;
