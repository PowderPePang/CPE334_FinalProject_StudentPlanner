import { useState, useEffect } from "react";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import CookieConsent from "react-cookie-consent";
import CookieSettings from "./components/CookieSettings";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized401 from "./components/Unauthorized401";
import "./App.css";

function App() {
    const [showCookieSettings, setShowCookieSettings] = useState(false);
    const [showBanner, setShowBanner] = useState(true);

    useEffect(() => {
        const cookieConsent = localStorage.getItem('cookieConsent');
        if (cookieConsent === 'true') {
            setShowBanner(false);
        }
    }, []);

    const handleSaveCookieSettings = (settings) => {
        localStorage.setItem('cookieSettings', JSON.stringify(settings));
        setShowCookieSettings(false);
    };

    return (
        <div className="container mt-5">
            <Routes>
                <Route path="/" element={
                    <>
                        <h3 className="text-center">Welcome Page</h3>
                        <div className="button-container">
                            <Link to="/login" className="btn btn-success me-3">Login</Link>
                            <Link to="/register" className="btn btn-primary">Register</Link>
                        </div>
                    </>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/unauthorized" element={<Unauthorized401 />} />
                <Route path="*" element={<Navigate to="/unauthorized" replace />} />
            </Routes>

            {showBanner && (
                <CookieConsent
                    location="bottom"
                    buttonText="Accept All"
                    declineButtonText="Reject"
                    enableDeclineButton
                    onAccept={() => {
                        localStorage.setItem('cookieConsent', 'true');
                        setShowBanner(false);
                    }}
                    onDecline={() => {
                        setShowCookieSettings(true);
                        setShowBanner(false);
                    }}
                    style={{ background: "#2B373B" }}
                    buttonStyle={{
                        backgroundColor: "#09a50eff",
                        color: "white",
                        fontSize: "13px",
                        borderRadius: "5px",
                        margin: "10px"
                    }}
                    declineButtonStyle={{
                        backgroundColor: "#f44336",
                        color: "white",
                        fontSize: "13px",
                        borderRadius: "5px"
                    }}
                >
                    <div>
                        This website uses cookies to improve your experience.{" "}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setShowCookieSettings(true);
                            }}
                            style={{
                                textDecoration: "underline",
                                background: "none",
                                border: "none",
                                color: "white",
                                cursor: "pointer",
                                padding: "0 5px"
                            }}
                        >
                            Cookie Settings
                        </button>
                    </div>
                </CookieConsent>
            )}

            <CookieSettings
                show={showCookieSettings}
                handleClose={() => setShowCookieSettings(false)}
                handleSave={handleSaveCookieSettings}
            />
        </div>
    );
}

export default App;