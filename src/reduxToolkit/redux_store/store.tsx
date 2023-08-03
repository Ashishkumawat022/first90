import { configureStore } from '@reduxjs/toolkit';
import teamReducers from '../reducers/teamReducers';
import simulationReducer from '../reducers/simulationReducer';
import moduleButtonReducer from '../reducers/moduleButtonReducer';
import additionalResourcesReducers from '../reducers/additionalResourcesReducers';
import loginReducer from '../reducers/loginReducer';
import triageReducer from '../reducers/triageReducer';

export const store = configureStore({
    reducer: {
        teamReducers: teamReducers,
        simulationReducer: simulationReducer,
        moduleButtonReducer: moduleButtonReducer,
        additionalResourcesReducers:additionalResourcesReducers,
        loginReducer: loginReducer,
        triageReducer: triageReducer
    },
})