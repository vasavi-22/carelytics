import { useEffect, useMemo } from "react";
import { PageHeader } from "../components/common/PageHeader";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchEncounters } from "../features/health/encountersSlice";
import { fetchPatients } from "../features/health/patientsSlice";
import type { EncounterSummary } from "../services/fhir/map";

function toDateKey(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function isWithinDays(iso: string | null, days: number) {
  if (!iso) return false;
  const start = new Date(iso);
  if (Number.isNaN(start.getTime())) return false;
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  return diffMs >= 0 && diffMs <= days * 24 * 60 * 60 * 1000;
}

function isCriticalEncounter(e: EncounterSummary) {
  const priority = e.priorityCode.toLowerCase();
  const classCode = e.classCode.toLowerCase();
  const p = [priority, classCode].join(" ");
  return (
    p.includes("emergency") ||
    p.includes("urgent") ||
    p.includes("high") ||
    p.includes("critical")
  );
}

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const encountersState = useAppSelector((s) => s.encounters);
  const patientsState = useAppSelector((s) => s.patients);

  useEffect(() => {
    if (encountersState.status === "idle") {
      void dispatch(fetchEncounters({ count: 90 }));
    }
    if (patientsState.status === "idle") {
      void dispatch(fetchPatients({ count: 30 }));
    }
  }, [dispatch, encountersState.status, patientsState.status]);

  const metrics = useMemo(() => {
    const encounters = encountersState.encounters;
    const recentEncounters = encounters.filter((e) => isWithinDays(e.start, 30));

    const uniqueActivePatients = new Set(
      recentEncounters.map((e) => e.patientId).filter((id): id is string => !!id),
    );

    const todayKey = toDateKey(new Date().toISOString());
    const todaysAppointments = todayKey
      ? encounters.filter((e) => (e.start ? toDateKey(e.start) === todayKey : false)).length
      : 0;

    const criticalAlerts = encounters.filter(isCriticalEncounter).length;

    const partnerClinics = new Set(
      recentEncounters
        .map((e) => e.location)
        .filter((loc) => loc && loc.trim().length > 0),
    );

    return [
      { label: "Active Patients", value: uniqueActivePatients.size },
      { label: "Today's Appointments", value: todaysAppointments },
      { label: "Critical Alerts", value: criticalAlerts },
      { label: "Partner Clinics", value: partnerClinics.size },
    ];
  }, [encountersState.encounters]);

  return (
    <section className="screen">
      <PageHeader
        title="Dashboard"
        description="Operational KPIs powered by real data from an open FHIR demo server."
      />

      <div className="metric-grid" aria-label="Dashboard metrics">
        {metrics.map((metric) => (
          <article key={metric.label} className="metric-card">
            <h3>{metric.label}</h3>
            <p className="metric-value">{metric.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
