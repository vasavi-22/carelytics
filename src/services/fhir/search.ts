import { HAPI_FHIR_BASE_URL } from "./hapi";
import type { FhirBundle, FhirEncounter, FhirPatient } from "./fhirTypes";
import { mapFhirEncounterToSummary, mapFhirPatientToSummary, type EncounterSummary, type PatientSummary } from "./map";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export async function searchPatientsFHIR(count = 24): Promise<PatientSummary[]> {
  // Public demo endpoint; results are fixed/deterministic-ish for development.
  const url = `${HAPI_FHIR_BASE_URL}/Patient?_count=${encodeURIComponent(String(count))}`;
  const bundle = await fetchJson<FhirBundle<FhirPatient>>(url);
  const entries = bundle.entry ?? [];

  return entries
    .map((entry) => entry.resource)
    .filter((p): p is FhirPatient => !!p)
    .filter((p) => !!p.id)
    .map(mapFhirPatientToSummary)
    .slice(0, count);
}

export async function searchEncountersFHIR(count = 50): Promise<EncounterSummary[]> {
  const url = `${HAPI_FHIR_BASE_URL}/Encounter?_count=${encodeURIComponent(String(count))}`;
  const bundle = await fetchJson<FhirBundle<FhirEncounter>>(url);
  const entries = bundle.entry ?? [];

  return entries
    .map((entry) => entry.resource)
    .filter((e): e is FhirEncounter => !!e)
    .filter((e) => !!e.id)
    .map(mapFhirEncounterToSummary)
    .slice(0, count);
}

