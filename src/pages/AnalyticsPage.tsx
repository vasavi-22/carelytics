import { PageHeader } from "../components/common/PageHeader";

const analyticsCards = [
  {
    title: "Patient Admission Trend",
    description: "Monthly view of admission rates and peak occupancy windows.",
  },
  {
    title: "Treatment Outcome Score",
    description: "Compare treatment effectiveness by facility and department.",
  },
  {
    title: "Revenue Realization",
    description: "Track claims, collections, and payment cycle performance.",
  },
];

export function AnalyticsPage() {
  return (
    <section>
      <PageHeader
        title="Analytics"
        description="Analyze healthcare performance with operational and financial insights."
      />
      <div className="analytics-grid">
        {analyticsCards.map((card) => (
          <article key={card.title} className="analytics-card">
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
