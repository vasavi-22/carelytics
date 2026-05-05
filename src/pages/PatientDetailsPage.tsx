import { useParams } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";

export function PatientDetailsPage() {
  const { patientId } = useParams();

  return (
    <section>
      <PageHeader
        title="Patient Details"
        description="Review patient profile, diagnosis, and recent encounter history."
      />
      <article className="patient-summary-card">
        <h3>Patient ID: {patientId ?? "P-1001"}</h3>
        <p>Name: Avery Johnson</p>
        <p>Age: 42</p>
        <p>Condition: Type 2 Diabetes (stable)</p>
        <p>Last Visit: 2026-04-19</p>
      </article>
    </section>
  );
}
