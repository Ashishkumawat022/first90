import { createSlice } from '@reduxjs/toolkit';

export const initialState:any = {
   count : 2,
   value : "",
   button : 3,
    };

    const counterSlice = createSlice({
        name: 'IncreseButtons',
        initialState,
        reducers: {
          increment(state=initialState, action){
            state.count += 1;
            state.value = action.payload
          },
          changeDivUrl(state=initialState, action){
            state.value = action.payload
          },
          incrementModuleButton(state=initialState, action){
            state.button += 1;
          }
        },
      })
      
      export const { increment, changeDivUrl, incrementModuleButton } = counterSlice.actions
      export default counterSlice.reducer