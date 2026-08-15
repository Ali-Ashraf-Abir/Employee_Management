import {
    StrictMode
} from "react";

import {
    createRoot
} from "react-dom/client";

import {
    BrowserRouter
} from "react-router-dom";

import App from "./App";

import {
    AuthProvider
} from "./context/AuthContext";

import ErrorBoundary
    from "./components/common/ErrorBoundary";

import "./styles/globals.css";
import "./styles/login.css";
import "./styles/layout.css";
import "./styles/dashboard.css";
import "./styles/status.css";
import "./styles/employee.css";
import "./styles/attendance.css"
import "./styles/leaveType.css"
import "./styles/leaveRequest.css"
import "./styles/notification.css"
import { NotificationProvider } from "./context/NotificationContext";


createRoot(
    document.getElementById("root")!
).render(
    <StrictMode>
        <ErrorBoundary>
            <BrowserRouter>
                <AuthProvider>
                    <NotificationProvider>
                    <App />
                    </NotificationProvider>
                </AuthProvider>
            </BrowserRouter>
        </ErrorBoundary>
    </StrictMode>
);