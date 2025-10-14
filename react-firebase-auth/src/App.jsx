import { useState } from "react";
import { Link } from "react-router-dom";
import CookieConsent from "react-cookie-consent";
import CookieSettings from "./components/CookieSettings";
import "./App.css";

function App() {
    const [showCookieSettings, setShowCookieSettings] = useState(false);

    const handleSaveCookieSettings = (settings) => {
        localStorage.setItem('cookieSettings', JSON.stringify(settings));
        setShowCookieSettings(false);
    };

    return (
        <>
            <h3>Welcome Page</h3>
            <div className="button-container">
                <Link to="/login" className="btn btn-success me-3">
                    Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                    Register
                </Link>
            </div>

            <CookieConsent
                location="bottom"
                buttonText="Accept All"
                declineButtonText="Reject"
                enableDeclineButton
                style={{ background: "#2B373B" }}
                buttonStyle={{ 
                    backgroundColor: "#09a50eff", 
                    color: "white", 
                    fontSize: "13px",
                    borderRadius: "5px"
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
                        onClick={() => setShowCookieSettings(true)}
                        style={{ 
                            textDecoration: "underline",
                            background: "none",
                            border: "none",
                            color: "white",
                            cursor: "pointer",
                            padding: "0 5px"
                        }}
                    >
                        Cookie Setting
                    </button>
                </div>
            </CookieConsent>

            <CookieSettings
                show={showCookieSettings}
                handleClose={() => setShowCookieSettings(false)}
                handleSave={handleSaveCookieSettings}
            />
        </>
    );
}

export default App;