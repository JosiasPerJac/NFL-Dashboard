import type { ReactNode } from "react";

type ChartCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <article className="chart-card">
      <h3>{title}</h3>
      <p className="chart-subtitle">{subtitle}</p>
      {children}
    </article>
  );
}
