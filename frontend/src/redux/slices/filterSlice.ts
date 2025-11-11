import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  label: "all",
  from: null,
  to: null,
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilterLabel: (state, action) => {
      state.label = action.payload;
    },
    setCustomRange: (state, action) => {
      state.from = action.payload.from;
      state.to = action.payload.to;
    },
    resetFilter: (state, action) => {
      state.label = action.payload;
      state.from = null;
      state.to = null;
    },
  },
});

export const { setFilterLabel, setCustomRange, resetFilter } =
  filterSlice.actions;

export default filterSlice.reducer;
