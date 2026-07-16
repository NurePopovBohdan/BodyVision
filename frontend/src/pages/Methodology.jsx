import { BookOpen, Calculator, HeartPulse } from 'lucide-react';

import { useLanguage } from '../context/LanguageContext.jsx';

const Methodology = () => {
  const { t } = useLanguage();

  return (
    <div className="stack">
      <div className="page-title">
        <div>
          <span>{t('methodKicker') || 'Methodology'}</span>
          <h1>{t('methodTitle') || 'Calculation methodology'}</h1>
        </div>
      </div>

      <div className="method-grid">
        <section className="panel method-card">
          <Calculator />
          <h2>BMI</h2>
          <p>BMI = weight / height². It gives a fast general estimate of body mass category, but does not replace medical assessment.</p>
        </section>
        <section className="panel method-card">
          <HeartPulse />
          <h2>BMR / Mifflin-St Jeor</h2>
          <p>BMR is estimated by Mifflin-St Jeor and then multiplied by activity level to calculate maintenance calories.</p>
        </section>
        <section className="panel method-card">
          <BookOpen />
          <h2>{t('progressMethod') || 'Progress'}</h2>
          <p>Progress is calculated by comparing the first measurement, current measurement and active goal for key metrics.</p>
        </section>
      </div>
    </div>
  );
};

export default Methodology;
