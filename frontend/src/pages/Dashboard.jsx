import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import api, { getErrorMessage } from '../api/axios.js';
import BodyVisualization from '../components/BodyVisualization.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import MetricCard from '../components/MetricCard.jsx';
import ProgressCharts from '../components/ProgressCharts.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const Dashboard = () => {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get('/dashboard');
        setData(response.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) return <LoadingState />;

  if (error) {
    return <div className="alert error">{error}</div>;
  }

  if (!data) {
    return <div className="alert error">{t('serverDataError')}</div>;
  }

  const current = data.currentMeasurement;
  const goal = data.activeGoal;
  const progress = data.progress;
  const recommendations = data.recommendations;
  const hasRequiredData = Boolean(current && goal);

  return (
    <div className="stack">
      <div className="page-title">
        <div>
          <span>{t('dashboardKicker')}</span>
          <h1>{t('dashboardTitle')}</h1>
        </div>
        <div className="progress-pill">{progress?.overall ?? 0}% {t('goalPercent')}</div>
      </div>

      {!hasRequiredData ? (
        <EmptyState
          title={t('needDataTitle')}
          text={t('needDataText')}
        />
      ) : null}

      {!hasRequiredData ? (
        <section className="panel onboarding-strip">
          <div>
            <span>{t('onboardingKicker') || 'Start'}</span>
            <h2>{t('onboardingTitle') || 'Setup guide'}</h2>
          </div>
          <Link className="primary-button" to="/onboarding">{t('openStep') || 'Open step'}</Link>
        </section>
      ) : null}

      <div className="metrics-grid">
        <MetricCard label={t('currentWeight')} value={current?.weight} unit={t('kg')} detail={`${t('target')}: ${goal?.desiredWeight ?? '—'} ${t('kg')}`} tone="blue" />
        <MetricCard label={t('bodyFat')} value={current?.bodyFatPercentage} unit="%" detail={`${t('target')}: ${goal?.desiredBodyFatPercentage ?? '—'}%`} tone="red" />
        <MetricCard label={t('waist')} value={current?.waist} unit={t('cm')} detail={`${t('difference')}: ${data.differences?.waist ?? '—'} ${t('cm')}`} tone="green" />
        <MetricCard label="BMI" value={recommendations?.bmi} detail={recommendations?.bmiCategory || t('noData')} tone="neutral" />
      </div>

      <div className="metrics-grid">
        <MetricCard label="BMR" value={recommendations?.bmr} unit={t('kcal')} detail={t('basalMetabolism')} />
        <MetricCard label={t('maintenanceCalories')} value={recommendations?.maintenanceCalories} unit={t('kcal')} detail={t('withActivity')} />
        <MetricCard label={t('recommendation')} value={recommendations?.recommendedCalories} unit={t('kcal')} detail={t('forGoal')} />
        <MetricCard label={t('daysToGoal')} value={recommendations?.goalTempo?.daysLeft} detail={`${t('tempo')}: ${recommendations?.goalTempo?.weeklyChangeKg ?? '—'} ${t('perWeek')}`} />
      </div>

      <BodyVisualization current={current} goal={goal} />

      {data.chartSeries?.length > 1 ? (
        <ProgressCharts series={data.chartSeries} />
      ) : (
        <EmptyState title={t('notEnoughHistoryTitle')} text={t('notEnoughHistoryText')} />
      )}
    </div>
  );
};

export default Dashboard;
