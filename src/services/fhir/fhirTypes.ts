export type FhirHumanName = {
  family?: string[];
  given?: string[];
};

export type FhirAddress = {
  city?: string;
  state?: string;
  country?: string;
  line?: string[];
};

export type FhirPatient = {
  id?: string;
  name?: FhirHumanName[];
  gender?: string;
  birthDate?: string;
  address?: FhirAddress[];
};

export type FhirPeriod = {
  start?: string;
  end?: string;
};

export type FhirEncounter = {
  id?: string;
  status?: string;
  period?: FhirPeriod;
  class?: {
    code?: string;
    display?: string;
  };
  priority?: {
    code?: string;
    display?: string;
  };
  location?: Array<{
    location?: {
      display?: string;
    };
  }>;
  subject?: {
    reference?: string; // usually "Patient/{id}"
  };
};

export type FhirBundleEntry<T> = { resource?: T };

export type FhirBundle<T> = {
  resourceType?: "Bundle";
  entry?: Array<FhirBundleEntry<T>>;
};

