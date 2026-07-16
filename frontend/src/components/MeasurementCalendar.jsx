import { useMemo } from 'react';

import { useLanguage } from '../context/LanguageContext.jsx';

const sameDay = (a, b) => a.toDateString() === b.toDateString();

const MeasurementCalendar = ({ measurements }) => {
  const { t } = useLanguage();
  const days = useMemo(() => {
    const today = new Date();
    const first = new Date(today);
    first.setDate(today.getDate() - 34);

    return Array.from({ length: 35 }, (_, index) => {
      const date = new Date(first);
      date.setDate(first.getDate() + index);
      const measurement = measurements.find((item) => sameDay(new Date(item.measuredAt), date));
      return { date, measurement };
    });
  }, [measurements]);

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <span>{t('calendarKicker') || 'Calendar'}</span>
          <h2>{t('calendarTitle') || 'Measurement calendar'}</h2>
        </div>
      </div>
      <div className="calendar-grid">
        {days.map(({ date, measurement }) => (
          <div className={`calendar-day ${measurement ? 'has-entry' : ''}`} key={date.toISOString()}>
            <span>{date.getDate()}</span>
            {measurement ? <strong>{measurement.weight} {t('kg')}</strong> : null}
          </div>
        ))}
      </div>
    </section>
  );
};

export default MeasurementCalendar;
