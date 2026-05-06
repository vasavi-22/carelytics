import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../components/common/PageHeader";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchPatients } from "../features/health/patientsSlice";

export function PatientDetailsPage() {
  const dispatch = useAppDispatch();
  const { status, patients, errorMessage } = useAppSelector((s) => s.patients);
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (status === "idle") {
      void dispatch(fetchPatients({ count: 24 }));
    }
  }, [dispatch, status]);

  const toggleLabel = useMemo(
    () => (view === "grid" ? "Grid View" : "List View"),
    [view],
  );

  return (
    <section className="screen">
      <PageHeader
        title="Patient Details"
        description="Explore patient profiles in Grid or List layout."
      />

      <div className="patients-toolbar">
        <div className="patients-toolbar-left">
          <span className="patients-count">
            {status === "loading" ? "Loading..." : `${patients.length} patients`}
          </span>
        </div>

        <label className="view-toggle" title="Toggle between grid and list view">
          <input
            type="checkbox"
            checked={view === "list"}
            onChange={(e) => setView(e.target.checked ? "list" : "grid")}
          />
          <span className="view-toggle-slider" aria-hidden="true" />
          <span className="view-toggle-label">{toggleLabel}</span>
        </label>
      </div>

      {errorMessage ? (
        <div className="error-banner" role="alert">
          {errorMessage}
        </div>
      ) : null}

      {status === "loading" ? <div className="loading">Fetching patients...</div> : null}

      {status !== "loading" ? (
        view === "grid" ? (
          <div className="patients-grid">
            {patients.map((p) => (
              <article key={p.id} className="patient-card">
                <h3 className="patient-name">{p.fullName}</h3>
                <div className="patient-meta">
                  <span className="pill">{p.gender}</span>
                  <span className="pill">{p.age === null ? "Age —" : `Age ${p.age}`}</span>
                  <span className="pill">{p.city}</span>
                </div>
                <div className="patient-id">ID: {p.id}</div>
              </article>
            ))}
          </div>
        ) : (
          <div className="patients-list" role="table" aria-label="Patients list">
            <div className="patients-list-header" role="row">
              <div role="columnheader">Patient</div>
              <div role="columnheader">Demographics</div>
              <div role="columnheader">Location</div>
            </div>
            {patients.map((p) => (
              <div key={p.id} className="patients-list-row" role="row">
                <div className="patients-list-cell">
                  <div className="patients-list-title">{p.fullName}</div>
                  <div className="patients-list-sub">ID: {p.id}</div>
                </div>
                <div className="patients-list-cell">
                  <span className="pill">{p.gender}</span>
                  <span className="pill">{p.age === null ? "Age —" : `Age ${p.age}`}</span>
                </div>
                <div className="patients-list-cell">
                  <span className="pill">{p.city}</span>
                </div>
              </div>
            ))}
          </div>
        )
      ) : null}
    </section>
  );
}
