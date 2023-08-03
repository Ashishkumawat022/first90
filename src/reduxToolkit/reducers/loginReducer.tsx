import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  isFirst: false,
};

export let firstLogin: boolean;
export let simulationData: any;

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    changeStatusLogin(state = initialState, action) {
      state.isFirst = action.payload;
      firstLogin = action.payload;
    },
    saveSimulationData(state = initialState, action) {
      simulationData = action.payload;
    },
  },
});

export const { changeStatusLogin, saveSimulationData } = counterSlice.actions;
export default counterSlice.reducer;
