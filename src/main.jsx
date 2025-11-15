import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import About from "./components/About.jsx"; // ✅ เพิ่ม import About
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import Unauthorized401 from "./components/Unauthorized401.jsx";
import EventDetail from "./components/EventDetail.jsx";
import Profile from "./components/Profile.jsx";
import Notification from "./components/Notification.jsx";
import EventConfirmed from "./components/EventConfirm.jsx";
import EventCreate from "./components/EventCreate.jsx";
import OrganizerHome from "./components/OrganizerHome.jsx";
import EventEdit from "./components/EventEdit.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import ForPartner from "./components/ForPartner.jsx";

import "bootstrap/dist/css/bootstrap.min.css";

import "./index.css";
import { UserAuthContextProvider } from "./context/UserAuthContext.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { EvChargerIcon } from "lucide-react";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/about", // ✅ เพิ่ม route สำหรับ About
        element: <About />,
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
        path: "/eventCreate",
        element: <EventCreate />,
    },
    {
        path: "/organizerHome",
        element: <OrganizerHome />,
    },
    {
        path: "/event/edit/:eventId",
        element: <EventEdit />,
    },
    {
        path: "/unauthorized401",
        element: <Unauthorized401 />,
    },
    {
        path: "/event/:eventId",
        element: <EventDetail />,
    },
    {
        path: "/profile",
        element: <Profile />,
    },
    {
        path: "/notification",
        element: <Notification />,
    },
    {
        path: "/event/:eventId/confirmed",
        element: <EventConfirmed />,
    },
    {
        path: "/forgotPassword",
        element: <ForgotPassword />,
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
    path: "/partner",
    element: <ForPartner />,
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <UserAuthContextProvider>
            <RouterProvider router={router} />
        </UserAuthContextProvider>
    </StrictMode>
);