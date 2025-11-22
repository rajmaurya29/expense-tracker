import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  label: "All",
  from: null,
  to: null,
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilterLabel: (state, action) => {
      state.label = action.payload;
      state.from=state.to=null;
    },
    setCustomRange: (state, action) => {
      console.log(action.payload)
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
