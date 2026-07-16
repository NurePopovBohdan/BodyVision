import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useLanguage } from '../context/LanguageContext.jsx';

const emptyForm = {
  weight: '',
  bodyFatPercentage: '',
  chest: '',
  waist: '',
  hips: '',
  shoulders: '',
  arm: '',
  thigh: '',
  measuredAt: new Date().toISOString().slice(0, 10),
  notes: ''
};

const fields = [
  ['weight', 'weight', 'kg', true],
  ['bodyFatPercentage', 'chartFat', '%'],
  ['chest', 'chest', 'cm'],
  ['waist', 'waist', 'cm'],
  ['hips', 'hips', 'cm'],
  ['shoulders', 'shoulders', 'cm'],
  ['arm', 'arm', 'cm'],
  ['thigh', 'thigh', 'cm']
];

const MeasurementForm = ({ initialValue, onSubmit, onCancel, submitting }) => {
  const { t } = useLanguage();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialValue) {
      setForm({
        ...emptyForm,
        ...initialValue,
        measuredAt: initialValue.measuredAt
          ? new Date(initialValue.measuredAt).toISOString().slice(0, 10)
          : emptyForm.measuredAt
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialValue]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      {fields.map(([name, labelKey, unitKey, required]) => (
        <label key={name}>
          <span>{t(labelKey)}</span>
          <input
            name={name}
            type="number"
            step="0.1"
            min="0"
            value={form[name]}
            onChange={handleChange}
            required={required}
            placeholder={unitKey === '%' ? '%' : t(unitKey)}
          />
        </label>
      ))}

      <label>
        <span>{t('measurementDate')}</span>
        <input name="measuredAt" type="date" value={form.measuredAt} onChange={handleChange} required />
      </label>

      <label className="wide">
        <span>{t('notes')}</span>
        <textarea name="notes" value={form.notes || ''} onChange={handleChange} rows="3" />
      </label>

      <div className="form-actions">
        {onCancel ? (
          <button className="secondary-button" type="button" onClick={onCancel}>
            {t('cancel')}
          </button>
        ) : null}
        <button className="primary-button" type="submit" disabled={submitting}>
          <Save size={18} />
          <span>{submitting ? t('saving') : t('save')}</span>
        </button>
      </div>
    </form>
  );
};

export default MeasurementForm;
