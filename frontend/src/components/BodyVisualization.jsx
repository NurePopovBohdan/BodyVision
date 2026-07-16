import { useLanguage } from '../context/LanguageContext.jsx';

const clamp = (value, min, max) => Math.min(Math.max(Number(value) || min, min), max);

const getShape = (data = {}, mode = 'current') => {
  const source = data || {};
  const shoulders = clamp(source.shoulders || source.desiredChest || source.chest || 110, 70, 160);
  const waist = clamp(source.waist || source.desiredWaist || 80, 50, 140);
  const hips = clamp(source.hips || source.desiredHips || 100, 60, 170);

  return {
    shoulderWidth: shoulders * 0.62,
    waistWidth: waist * 0.58,
    hipWidth: hips * 0.56,
    color: mode === 'current' ? '#2563eb' : '#059669',
    fill: mode === 'current' ? '#dbeafe' : '#d1fae5'
  };
};

const Silhouette = ({ title, data, mode }) => {
  const { t } = useLanguage();
  const shape = getShape(data, mode);
  const cx = 105;
  const shoulderY = 82;
  const waistY = 162;
  const hipY = 218;

  const path = [
    `M ${cx - shape.shoulderWidth / 2} ${shoulderY}`,
    `C ${cx - shape.shoulderWidth / 2 - 12} 118, ${cx - shape.waistWidth / 2 - 5} 132, ${cx - shape.waistWidth / 2} ${waistY}`,
    `C ${cx - shape.waistWidth / 2 + 2} 186, ${cx - shape.hipWidth / 2} 198, ${cx - shape.hipWidth / 2} ${hipY}`,
    `C ${cx - 30} 238, ${cx - 24} 280, ${cx - 18} 316`,
    `M ${cx + shape.shoulderWidth / 2} ${shoulderY}`,
    `C ${cx + shape.shoulderWidth / 2 + 12} 118, ${cx + shape.waistWidth / 2 + 5} 132, ${cx + shape.waistWidth / 2} ${waistY}`,
    `C ${cx + shape.waistWidth / 2 - 2} 186, ${cx + shape.hipWidth / 2} 198, ${cx + shape.hipWidth / 2} ${hipY}`,
    `C ${cx + 30} 238, ${cx + 24} 280, ${cx + 18} 316`
  ].join(' ');

  return (
    <div className="body-panel">
      <svg viewBox="0 0 210 350" role="img" aria-label={title}>
        <circle cx={cx} cy="42" r="27" fill={shape.fill} stroke={shape.color} strokeWidth="4" />
        <path d={path} fill="none" stroke={shape.color} strokeLinecap="round" strokeWidth="8" />
        <line x1={cx - shape.shoulderWidth / 2} y1={shoulderY} x2={cx + shape.shoulderWidth / 2} y2={shoulderY} stroke={shape.color} strokeWidth="6" strokeLinecap="round" />
        <line x1={cx - shape.waistWidth / 2} y1={waistY} x2={cx + shape.waistWidth / 2} y2={waistY} stroke={shape.color} strokeWidth="6" strokeLinecap="round" />
        <line x1={cx - shape.hipWidth / 2} y1={hipY} x2={cx + shape.hipWidth / 2} y2={hipY} stroke={shape.color} strokeWidth="6" strokeLinecap="round" />
      </svg>
      <strong>{title}</strong>
      {!data ? <span className="body-placeholder">{t('bodyPlaceholder')}</span> : null}
    </div>
  );
};

const BodyVisualization = ({ current, goal }) => {
  const { t } = useLanguage();
  const hasAnyData = Boolean(current || goal);

  return (
    <section className="panel visualization-panel">
      <div className="section-heading">
        <div>
          <span>{t('bodyModel')}</span>
          <h2>{t('bodyCompare')}</h2>
        </div>
        {!hasAnyData ? <div className="soft-badge">{t('demoSilhouette')}</div> : null}
      </div>
      <div className="body-visualization">
        <Silhouette title={t('currentShape')} data={current} mode="current" />
        <Silhouette title={t('desiredShape')} data={goal} mode="goal" />
      </div>
    </section>
  );
};

export default BodyVisualization;
