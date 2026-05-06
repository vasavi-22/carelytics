import { configureStore } from "@reduxjs/toolkit";
import { encountersReducer } from "../features/health/encountersSlice";
import { patientsReducer } from "../features/health/patientsSlice";

export const store = configureStore({
  reducer: {
    encounters: encountersReducer,
    patients: patientsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

