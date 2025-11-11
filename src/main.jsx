import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import Unauthorized401 from "./components/Unauthorized401.jsx";
import EventDetail from "./components/EventDetail.jsx";

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
        path: "/unauthorized401",
        element: <Unauthorized401 />,
    },
    {
        path: "/event/:id",
        element: <EventDetail />,
    },
    {
        path: "/home",
        element: (
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
        ),
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <UserAuthContextProvider>
            <RouterProvider router={router} />
        </UserAuthContextProvider>
    </StrictMode>
);
