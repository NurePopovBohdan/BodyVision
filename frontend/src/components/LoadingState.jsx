import { useLanguage } from '../context/LanguageContext.jsx';

const LoadingState = ({ label }) => (
  <LoadingStateInner label={label} />
);

const LoadingStateInner = ({ label }) => {
  const { t } = useLanguage();

  return (
    <div className="loading-state">
      <div className="loader" />
      <span>{label || t('loading')}</span>
    </div>
  );
};

export default LoadingState;
