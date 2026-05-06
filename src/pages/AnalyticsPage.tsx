import { useEffect, useMemo } from "react";
import { PageHeader } from "../components/common/PageHeader";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchEncounters } from "../features/health/encountersSlice";
import { fetchPatients } from "../features/health/patientsSlice";
// (No direct types needed; we render derived aggregates)

function toDateKey(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function average(values: number[]) {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function ageBin(age: number) {
  if (age < 18) return "0-17";
  if (age < 36) return "18-35";
  if (age < 61) return "36-60";
  return "60+";
}

export function AnalyticsPage() {
  const dispatch = useAppDispatch();
  const encountersState = useAppSelector((s) => s.encounters);
  const patientsState = useAppSelector((s) => s.patients);

  useEffect(() => {
    if (encountersState.status === "idle") {
      void dispatch(fetchEncounters({ count: 120 }));
    }
    if (patientsState.status === "idle") {
      void dispatch(fetchPatients({ count: 36 }));
    }
  }, [dispatch, encountersState.status, patientsState.status]);

  const derived = useMemo(() => {
    const encounters = encountersState.encounters;
    const patients = patientsState.patients;

    const patientAgeById = new Map<string, number | null>(
      patients.map((p) => [p.id, p.age]),
    );

    const completionTotal = encounters.length;
    const completionFinished = encounters.filter((e) => e.status === "finished").length;
    const completionRate =
      completionTotal > 0 ? Math.round((completionFinished / completionTotal) * 100) : 0;

    // Admissions trend: last 7 days (by encounter period.start date)
    const today = new Date();
    const dateKeys: string[] = [];
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = toDateKey(d.toISOString());
      if (key) dateKeys.push(key);
    }

    const countsByDay = dateKeys.map((key) => {
      const count = encounters.filter((e) => (e.start ? toDateKey(e.start) === key : false)).length;
      return { key, count };
    });
    const maxCount = Math.max(0, ...countsByDay.map((x) => x.count));

    // Average age: based on patient referenced by encounters (best-effort from loaded patient list)
    const ages = encounters
      .map((e) => (e.patientId ? patientAgeById.get(e.patientId) ?? null : null))
      .filter((a): a is number => typeof a === "number");
    const avgAge = average(ages);

    // Age distribution
    const bins: Record<string, number> = { "0-17": 0, "18-35": 0, "36-60": 0, "60+": 0 };
    ages.forEach((age) => {
      const b = ageBin(age);
      bins[b] += 1;
    });

    const maxBin = Math.max(1, ...Object.values(bins));

    return {
      completionRate,
      completionFinished,
      completionTotal,
      countsByDay,
      maxCount,
      avgAge,
      bins,
      maxBin,
    };
  }, [encountersState.encounters, patientsState.patients]);

  return (
    <section className="screen">
      <PageHeader
        title="Analytics"
        description="Hospital-style operational analytics powered by public FHIR demo data."
      />

      <div className="analytics-grid">
        <article className="analytics-card analytics-card-wide">
          <h3>Patient Admission Trend</h3>
          <p>Encounters grouped by day (last 7 days).</p>
          <div className="bar-chart" aria-label="Admissions trend bar chart">
            {derived.countsByDay.map((d) => (
              <div key={d.key} className="bar-chart-bar">
                <div
                  className="bar"
                  style={{
                    height: `${Math.max(6, derived.maxCount > 0 ? (d.count / derived.maxCount) * 100 : 0)}%`,
                  }}
                />
                <div className="bar-label">{d.key.slice(5)}</div>
                <div className="bar-value">{d.count}</div>
              </div>
            ))}
          </div>
        </article>

        <article className="analytics-card">
          <h3>Treatment Outcome Score</h3>
          <p>Completion rate (finished encounters).</p>
          <div className="progress-wrap">
            <div className="progress-value">{derived.completionRate}%</div>
            <div className="progress">
              <div className="progress-bar" style={{ width: `${derived.completionRate}%` }} />
            </div>
            <div className="progress-sub">
              {derived.completionFinished} / {derived.completionTotal}
            </div>
          </div>
        </article>

        <article className="analytics-card">
          <h3>Patient Age Profile</h3>
          <p>Age distribution from referenced patients.</p>
          <div className="age-distribution">
            {Object.entries(derived.bins).map(([bin, count]) => (
              <div key={bin} className="age-row">
                <div className="age-label">{bin}</div>
                <div className="age-bar">
                  <div className="age-bar-inner" style={{ width: `${(count / derived.maxBin) * 100}%` }} />
                </div>
                <div className="age-count">{count}</div>
              </div>
            ))}
          </div>
          <p className="muted" style={{ marginTop: 10 }}>
            Avg age: {derived.avgAge === null ? "—" : Math.round(derived.avgAge)}
          </p>
        </article>
      </div>
    </section>
  );
}
