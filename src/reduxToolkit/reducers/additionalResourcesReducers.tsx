import { createSlice } from "@reduxjs/toolkit";

export const initialState: any = {
  additional: 0,
};

export let additionalState: any[] = [
  {
    title: "",
    description: "",
    weblink: "",
  },
];

const counterSlice = createSlice({
  name: "resourceCounter",
  initialState,
  reducers: {
    firstCase(state = initialState, action) {
      state.additional += 1;
      additionalState = action.payload;
    },
    addLink(state = initialState, action) {
      let condition = additionalState[additionalState.length - 1];
      if (
        condition?.title === "" &&
        condition?.description === "" &&
        condition?.weblink === ""
      ) {
        return;
      } else {
        state.additional += 1;
        additionalState = [...additionalState, action.payload];
      }
    },
    title(state = initialState, action) {
      let prevState = [...additionalState];
      prevState[action.payload.index][action.payload.event] =
        action.payload.value;
    },
    description(state = initialState, action) {
      let prevState = [...additionalState];
      prevState[action.payload.index][action.payload.event] =
        action.payload.value;
    },
    weblink(state = initialState, action) {
      let prevState = [...additionalState];
      prevState[action.payload.index][action.payload.event] =
        action.payload.value;
    },
  },
});

export const { addLink, title, description, weblink, firstCase } =
  counterSlice.actions;
export default counterSlice.reducer;
