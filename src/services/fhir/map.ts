import type { FhirEncounter, FhirPatient } from "./fhirTypes";

export type PatientSummary = {
  id: string;
  fullName: string;
  gender: string;
  age: number | null;
  city: string;
};

export type EncounterSummary = {
  id: string;
  status: string;
  start: string | null; // ISO
  classCode: string;
  priorityCode: string;
  location: string;
  patientId: string | null;
};

export function calculateAge(birthDate?: string): number | null {
  if (!birthDate) return null;
  const dob = new Date(birthDate);
  if (Number.isNaN(dob.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age -= 1;
  return age;
}

export function mapFhirPatientToSummary(p: FhirPatient): PatientSummary {
  const id = p.id ?? "";
  const name = p.name?.[0];
  const given = name?.given?.[0] ?? "";
  const family = name?.family?.[0] ?? "";
  const fullName = [given, family].filter(Boolean).join(" ") || "Unknown";
  const gender = p.gender ?? "unknown";
  const age = calculateAge(p.birthDate);
  const city = p.address?.[0]?.city ?? p.address?.[0]?.state ?? "—";
  return { id, fullName, gender, age, city };
}

export function mapFhirEncounterToSummary(e: FhirEncounter): EncounterSummary {
  const id = e.id ?? "";
  const start = e.period?.start ?? null;
  const patientId = e.subject?.reference?.startsWith("Patient/")
    ? e.subject.reference.replace("Patient/", "")
    : null;
  const classCode = e.class?.code ?? "";
  const priorityCode = e.priority?.code ?? "";
  const location = e.location?.[0]?.location?.display ?? "";
  return {
    id,
    status: e.status ?? "unknown",
    start,
    classCode,
    priorityCode,
    location,
    patientId,
  };
}

