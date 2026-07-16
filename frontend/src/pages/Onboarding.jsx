import { Camera, CheckCircle2, ClipboardList, Target, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useLanguage } from '../context/LanguageContext.jsx';

const steps = [
  { icon: ClipboardList, title: 'onboardingMeasurements', text: 'onboardingMeasurementsText', to: '/measurements' },
  { icon: Target, title: 'onboardingGoals', text: 'onboardingGoalsText', to: '/goals' },
  { icon: Camera, title: 'onboardingPhotos', text: 'onboardingPhotosText', to: '/photos' },
  { icon: TrendingUp, title: 'onboardingAnalytics', text: 'onboardingAnalyticsText', to: '/analytics' }
];

const Onboarding = () => {
  const { t } = useLanguage();

  return (
    <div className="stack">
      <div className="page-title">
        <div>
          <span>{t('onboardingKicker') || 'Start'}</span>
          <h1>{t('onboardingTitle') || 'Setup guide'}</h1>
        </div>
      </div>

      <div className="onboarding-grid">
        {steps.map(({ icon: Icon, title, text, to }, index) => (
          <Link className="onboarding-card" to={to} key={title}>
            <div className="step-number">{index + 1}</div>
            <Icon size={26} />
            <h2>{t(title) || title}</h2>
            <p>{t(text) || text}</p>
            <span><CheckCircle2 size={16} /> {t('openStep') || 'Open step'}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Onboarding;
