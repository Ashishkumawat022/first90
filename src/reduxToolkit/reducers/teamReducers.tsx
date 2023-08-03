import { createSlice } from '@reduxjs/toolkit';

export const initialState: any = [{
  "first_name": "",
  "last_name": "",
  "email": ""
}];

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    addTeam(state = initialState, action) {
      return [...state, action.payload]
    },
    firstName(state = initialState, action) {
      let prevState = [...state];
      // prevState[action.payload.index]["addSimulation"] = action.payload.simulationName;
      prevState[action.payload.index][action.payload.event] = action.payload.value;
    },
    lastName(state = initialState, action) {
      let prevState = [...state];
      prevState[action.payload.index][action.payload.event] = action.payload.value;
    },
    eMail(state = initialState, action) {
      let prevState = [...state];
      prevState[action.payload.index][action.payload.event] = action.payload.value;
    }
  },
})

export const { addTeam, firstName, lastName, eMail } = counterSlice.actions
export default counterSlice.reducer