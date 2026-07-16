import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { useState } from 'react';

import { useLanguage } from '../context/LanguageContext.jsx';

const formatDate = (value) => new Date(value).toLocaleDateString('ru-RU', {
  day: '2-digit',
  month: 'short'
});

const normalizeSeries = (series = []) => series.map((item) => ({
  ...item,
  label: formatDate(item.date)
}));

const ProgressCharts = ({ series }) => {
  const { t } = useLanguage();
  const [period, setPeriod] = useState('all');
  const periods = { week: 7, month: 31, all: Infinity };
  const data = normalizeSeries(series);
  const filteredData = period === 'all'
    ? data
    : data.filter((item) => {
      const start = new Date();
      start.setDate(start.getDate() - periods[period]);
      return new Date(item.date) >= start;
    });

  return (
    <div className="charts-grid">
      <section className="panel">
        <div className="section-heading">
          <div>
            <span>{t('history')}</span>
            <h2>{t('weightChart')}</h2>
          </div>
          <div className="segmented compact">
            {['week', 'month', 'all'].map((item) => (
              <button className={period === item ? 'active' : ''} key={item} type="button" onClick={() => setPeriod(item)}>
                {t(`period_${item}`) || item}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" />
            <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
            <Tooltip />
            <Area type="monotone" dataKey="weight" name={t('weight')} unit={` ${t('kg')}`} stroke="#2563eb" fill="#dbeafe" />
          </AreaChart>
        </ResponsiveContainer>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <span>{t('bodyParams')}</span>
            <h2>{t('compositionChart')}</h2>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="bodyFatPercentage" name={t('chartFat')} unit="%" stroke="#dc2626" strokeWidth={3} />
            <Line type="monotone" dataKey="waist" name={t('waist')} unit={` ${t('cm')}`} stroke="#059669" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default ProgressCharts;
