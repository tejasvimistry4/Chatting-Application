import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";

import { SocketProvider } from "./context/SocketContext";
import SocketListener from "./components/layout/SocketListener";

import { Toaster } from "react-hot-toast";

import App from "./App";

import "./api/interceptor";
import "./assets/styles/global.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <SocketProvider>
          <SocketListener />
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                borderRadius: "12px",
                background: "#ffffff",
                color: "#111827",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.10)",
              },
            }}
          />
        </SocketProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
