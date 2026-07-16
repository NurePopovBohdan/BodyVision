const MetricCard = ({ label, value, unit, detail, tone = 'neutral' }) => (
  <section className={`metric-card ${tone}`}>
    <span>{label}</span>
    <strong>
      {value ?? '—'}
      {value !== null && value !== undefined && unit ? <small>{unit}</small> : null}
    </strong>
    {detail ? <p>{detail}</p> : null}
  </section>
);

export default MetricCard;
