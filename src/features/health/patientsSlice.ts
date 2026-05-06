import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { searchPatientsFHIR } from "../../services/fhir/search";
import type { PatientSummary } from "../../services/fhir/map";

type PatientsState = {
  status: "idle" | "loading" | "succeeded" | "failed";
  patients: PatientSummary[];
  errorMessage: string | null;
  lastFetchedAt: number | null;
};

const initialState: PatientsState = {
  status: "idle",
  patients: [],
  errorMessage: null,
  lastFetchedAt: null,
};

export const fetchPatients = createAsyncThunk<
  PatientSummary[],
  { count?: number },
  { rejectValue: string }
>("patients/fetchPatients", async ({ count = 24 } = {}, { rejectWithValue }) => {
  try {
    const patients = await searchPatientsFHIR(count);
    return patients;
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Failed to load patients.");
  }
});

export const patientsSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.status = "loading";
        state.errorMessage = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.patients = action.payload;
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.status = "failed";
        state.errorMessage = action.payload ?? "Failed to load patients.";
      });
  },
});

export const patientsReducer = patientsSlice.reducer;

