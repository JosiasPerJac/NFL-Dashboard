type KpiCardProps = {
  label: string;
  value: string;
  trend: string;
  icon: string;
};

export function KpiCard({ label, value, trend, icon }: KpiCardProps) {
  return (
    <article className="kpi-card">
      <div className="kpi-icon">{icon}</div>
      <h3>{label}</h3>
      <strong className="kpi-value">{value}</strong>
      <p className="kpi-trend">{trend}</p>
    </article>
  );
}