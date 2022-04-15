import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "jotai";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/system";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import { SettingDialog } from "./components/SettingDialog";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider>
      <ThemeProvider theme={theme}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<App />}></Route>
            <Route path="/setting" element={<SettingDialog />}></Route>
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
