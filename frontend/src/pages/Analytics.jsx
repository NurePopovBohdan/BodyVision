import { CalendarDays, FileDown, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import api, { getErrorMessage } from '../api/axios.js';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import MetricCard from '../components/MetricCard.jsx';
import ProgressCharts from '../components/ProgressCharts.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const periodDays = {
  week: 7,
  month: 31,
  all: Infinity
};

const Analytics = () => {
  const { t } = useLanguage();
  const [period, setPeriod] = useState('month');
  const [measurements, setMeasurements] = useState([]);
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [measurementResponse, goalResponse] = await Promise.all([
          api.get('/measurements'),
          api.get('/goals/active')
        ]);
        setMeasurements([...measurementResponse.data.measurements].sort((a, b) => new Date(a.measuredAt) - new Date(b.measuredAt)));
        setGoal(goalResponse.data.goal);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    if (period === 'all') return measurements;
    const start = new Date();
    start.setDate(start.getDate() - periodDays[period]);
    return measurements.filter((item) => new Date(item.measuredAt) >= start);
  }, [measurements, period]);

  const report = useMemo(() => {
    if (filtered.length < 2) return null;
    const first = filtered[0];
    const last = filtered[filtered.length - 1];

    const daysBetween = Math.max(1, Math.ceil((new Date(last.measuredAt) - new Date(first.measuredAt)) / 86400000));
    const dailyWeightRate = (last.weight - first.weight) / daysBetween;
    const remainingWeight = goal?.desiredWeight ? goal.desiredWeight - last.weight : null;
    const forecastDays = remainingWeight !== null && dailyWeightRate !== 0 && Math.sign(remainingWeight) === Math.sign(dailyWeightRate)
      ? Math.ceil(remainingWeight / dailyWeightRate)
      : null;
    const targetDaysLeft = goal?.targetDate ? Math.ceil((new Date(goal.targetDate) - new Date()) / 86400000) : null;

    return {
      weightDelta: Number((last.weight - first.weight).toFixed(1)),
      waistDelta: Number(((last.waist || 0) - (first.waist || 0)).toFixed(1)),
      fatDelta: Number(((last.bodyFatPercentage || 0) - (first.bodyFatPercentage || 0)).toFixed(1)),
      entries: filtered.length,
      firstDate: first.measuredAt,
      lastDate: last.measuredAt,
      forecastDays,
      targetDaysLeft,
      planStatus: forecastDays && targetDaysLeft ? forecastDays <= targetDaysLeft ? 'ahead' : 'behind' : 'unknown',
      stability: Math.max(0, Math.min(100, Math.round(100 - Math.abs(dailyWeightRate * 7) * 20)))
    };
  }, [filtered, goal]);

  if (loading) return <LoadingState />;

  return (
    <div className="stack report-page">
      <div className="page-title">
        <div>
          <span>{t('analyticsKicker') || 'Analytics'}</span>
          <h1>{t('analyticsTitle') || 'Progress report'}</h1>
        </div>
        <button className="primary-button no-print" type="button" onClick={() => window.print()}>
          <FileDown size={18} />
          <span>{t('exportPdf') || 'Export PDF'}</span>
        </button>
      </div>

      {error ? <div className="alert error">{error}</div> : null}

      <div className="segmented no-print">
        {['week', 'month', 'all'].map((item) => (
          <button className={period === item ? 'active' : ''} key={item} type="button" onClick={() => setPeriod(item)}>
            {t(`period_${item}`) || item}
          </button>
        ))}
      </div>

      {report ? (
        <>
          <div className="metrics-grid">
            <MetricCard
              label={t('weightChange') || 'Weight change'}
              value={report.weightDelta}
              unit={t('kg')}
              detail={report.weightDelta <= 0 ? t('trendDown') || 'Decreasing' : t('trendUp') || 'Increasing'}
              tone={report.weightDelta <= 0 ? 'green' : 'blue'}
            />
            <MetricCard label={t('waistChange') || 'Waist change'} value={report.waistDelta} unit={t('cm')} detail={t('selectedPeriod') || 'Selected period'} />
            <MetricCard label={t('fatChange') || 'Fat change'} value={report.fatDelta} unit="%" detail={t('selectedPeriod') || 'Selected period'} tone="red" />
            <MetricCard label={t('entries') || 'Entries'} value={report.entries} detail={`${new Date(report.firstDate).toLocaleDateString()} - ${new Date(report.lastDate).toLocaleDateString()}`} />
          </div>

          <div className="metrics-grid">
            <MetricCard label={t('forecastToGoal') || 'Forecast to goal'} value={report.forecastDays ?? '—'} unit={report.forecastDays ? t('days') : ''} detail={t('basedOnTrend') || 'Based on current trend'} tone="blue" />
            <MetricCard label={t('planVsFact') || 'Plan vs fact'} value={report.planStatus === 'ahead' ? 'OK' : report.planStatus === 'behind' ? '!' : '—'} detail={report.planStatus === 'ahead' ? t('aheadOfPlan') || 'On track' : report.planStatus === 'behind' ? t('behindPlan') || 'Behind plan' : t('noData')} tone={report.planStatus === 'behind' ? 'red' : 'green'} />
            <MetricCard label={t('stability') || 'Stability'} value={report.stability} unit="%" detail={t('stabilityText') || 'Lower volatility is better'} />
            <MetricCard label={t('targetDaysLeft') || 'Target days left'} value={report.targetDaysLeft ?? '—'} unit={report.targetDaysLeft ? t('days') : ''} detail={goal ? new Date(goal.targetDate).toLocaleDateString() : t('noData')} />
          </div>

          <section className="panel report-summary">
            <div className="summary-item">
              {report.weightDelta <= 0 ? <TrendingDown /> : <TrendingUp />}
              <span>{t('reportInsightWeight') || 'Weight trend is calculated from the first and latest selected measurement.'}</span>
            </div>
            <div className="summary-item">
              <CalendarDays />
              <span>{t('reportInsightCalendar') || 'Use this section as a printable weekly or monthly progress report.'}</span>
            </div>
          </section>

          <ProgressCharts series={filtered.map((item) => ({
            id: item._id,
            date: item.measuredAt,
            weight: item.weight,
            bodyFatPercentage: item.bodyFatPercentage,
            waist: item.waist
          }))} />
        </>
      ) : (
        <EmptyState title={t('analyticsEmptyTitle') || 'Not enough data'} text={t('analyticsEmptyText') || 'Add at least two measurements to build a report.'} />
      )}
    </div>
  );
};

export default Analytics;
