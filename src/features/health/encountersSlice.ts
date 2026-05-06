import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { searchEncountersFHIR } from "../../services/fhir/search";
import type { EncounterSummary } from "../../services/fhir/map";

type EncountersState = {
  status: "idle" | "loading" | "succeeded" | "failed";
  encounters: EncounterSummary[];
  errorMessage: string | null;
  lastFetchedAt: number | null;
};

const initialState: EncountersState = {
  status: "idle",
  encounters: [],
  errorMessage: null,
  lastFetchedAt: null,
};

export const fetchEncounters = createAsyncThunk<
  EncounterSummary[],
  { count?: number },
  { rejectValue: string }
>("encounters/fetchEncounters", async ({ count = 60 } = {}, { rejectWithValue }) => {
  try {
    const encounters = await searchEncountersFHIR(count);
    return encounters;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Failed to load encounters.",
    );
  }
});

export const encountersSlice = createSlice({
  name: "encounters",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEncounters.pending, (state) => {
        state.status = "loading";
        state.errorMessage = null;
      })
      .addCase(fetchEncounters.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.encounters = action.payload;
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchEncounters.rejected, (state, action) => {
        state.status = "failed";
        state.errorMessage = action.payload ?? "Failed to load encounters.";
      });
  },
});

export const encountersReducer = encountersSlice.reducer;

