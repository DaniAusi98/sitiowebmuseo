import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import "./index.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { AuthProvider } from "./auth/auth-ctx.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import DialogsProvider from "./components/hooks/DialogsProvider";
import NotificationsProvider from "./components/hooks/Notification/NotificationProvider.jsx";

import theme from "./theme/theme";

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CssBaseline />
      <AuthProvider>
        <NotificationsProvider>
          <DialogsProvider>
            <App />
          </DialogsProvider>
        </NotificationsProvider>
      </AuthProvider>
    </LocalizationProvider>
  </ThemeProvider>,
);
