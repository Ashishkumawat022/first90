import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { store } from "./reduxToolkit/redux_store/store";
import { Provider } from "react-redux";
import { GlobalContextProvider } from "./store/global-context";

ReactDOM.render(
  <GlobalContextProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </GlobalContextProvider>,
  document.getElementById("root")
);
