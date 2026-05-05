import { PageHeader } from "../components/common/PageHeader";

const metrics = [
  { label: "Active Patients", value: "1,248" },
  { label: "Today's Appointments", value: "86" },
  { label: "Critical Alerts", value: "7" },
  { label: "Partner Clinics", value: "34" },
];

export function DashboardPage() {
  return (
    <section>
      <PageHeader
        title="Dashboard"
        description="Monitor operational KPIs across patient care and partner locations."
      />
      <div className="metric-grid">
        {metrics.map((metric) => (
          <article key={metric.label} className="metric-card">
            <h3>{metric.label}</h3>
            <p>{metric.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
