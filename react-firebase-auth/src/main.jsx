import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Unauthorized401 from "./components/Unauthorized401";
import { Navigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import "./index.css";
import { UserAuthContextProvider } from "./context/UserAuthContext.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/home",
        element: (
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
        ),
    },
    {
        path: "/unauthorized",
        element: <Unauthorized401 />,
    },
    {
        path: "*",
        element: <Navigate to="/unauthorized" replace />,
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <UserAuthContextProvider>
            <RouterProvider router={router} />
        </UserAuthContextProvider>
    </StrictMode>
);