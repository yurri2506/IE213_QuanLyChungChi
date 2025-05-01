import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.js";
// import { BrowserRouter } from "react-router-dom";
import { store, persistor } from "./redux/store.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistGate } from "redux-persist/es/integration/react.js";
import { Provider } from "react-redux";

// const root = document.getElementById("root");
// if (!root) throw new Error("Root element not found");
const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient();

// ReactDOM.createRoot(root).render(
// <React.StrictMode>
//   {/* <BrowserRouter> */}
//   <App />
//   {/* </BrowserRouter> */}
// </React.StrictMode>
root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

// ReactDOM.createRoot(root).render(<App />);
