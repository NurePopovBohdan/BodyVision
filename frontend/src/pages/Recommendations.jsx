import { AlertTriangle, CheckCircle2, Flame, HeartPulse } from 'lucide-react';
import { useEffect, useState } from 'react';

import api, { getErrorMessage } from '../api/axios.js';
import LoadingState from '../components/LoadingState.jsx';
import MetricCard from '../components/MetricCard.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const getTranslatedRecommendation = (message, t) => {
  if (!message) return '';
  if (message.includes('moderate calorie deficit')) return t('recWeightLoss');
  if (message.includes('controlled calorie surplus')) return t('recMuscleGain');
  if (message.includes('calories near maintenance')) return t('recMaintenance');
  if (message.includes('Update body measurements')) return t('recUpdateMeasurements');
  if (message.includes('recommended weight loss')) return t('warningWeightLoss');
  if (message.includes('realistic muscle gain')) return t('warningMuscleGain');
  return message;
};

const Recommendations = () => {
  const { t } = useLanguage();
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const { data } = await api.get('/recommendations');
        setRecommendations(data.recommendations);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div className="stack">
      <div className="page-title">
        <div>
          <span>{t('calculations')}</span>
          <h1>{t('recommendationsTitle')}</h1>
        </div>
      </div>

      {error ? <div className="alert error">{error}</div> : null}

      {recommendations ? (
        <>
          <div className="metrics-grid">
            <MetricCard label="BMI" value={recommendations.bmi} detail={recommendations.bmiCategory || t('noData')} tone="blue" />
            <MetricCard label="BMR" value={recommendations.bmr} unit={t('kcal')} detail="Mifflin-St Jeor" tone="green" />
            <MetricCard label={t('maintenance')} value={recommendations.maintenanceCalories} unit={t('kcal')} detail={t('withActivity')} />
            <MetricCard label={t('recommendation')} value={recommendations.recommendedCalories} unit={t('kcal')} detail={`${recommendations.calorieAdjustment || 0} ${t('kcal')}`} tone="red" />
          </div>

          <section className="panel">
            <div className="recommendation-list">
              {recommendations.warning ? (
                <div className="recommendation warning">
                  <AlertTriangle size={22} />
                  <span>{getTranslatedRecommendation(recommendations.warning, t)}</span>
                </div>
              ) : (
                <div className="recommendation success">
                  <CheckCircle2 size={22} />
                  <span>{t('goalLooksRealistic')}</span>
                </div>
              )}

              <div className="recommendation">
                <Flame size={22} />
                <span>
                  {t('tempo')}: {recommendations.goalTempo?.weeklyChangeKg ?? '—'} {t('perWeek')},
                  {' '}{t('leftDays')} {recommendations.goalTempo?.daysLeft ?? '—'} {t('days')}.
                </span>
              </div>

              {recommendations.messages?.map((message) => (
                <div className="recommendation" key={message}>
                  <HeartPulse size={22} />
                  <span>{getTranslatedRecommendation(message, t)}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
};

export default Recommendations;
