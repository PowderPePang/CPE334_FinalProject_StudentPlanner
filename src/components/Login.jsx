import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import "../style/Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { logIn } = useUserAuth();

    const googleProvider = new GoogleAuthProvider();

    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await logIn(email, password);
            navigate("/home");
        } catch (err) {
            setError(err.message);
            console.log(err);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate("/home");
            console.log("Done");
        } catch (err) {
            console.log(err);
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <button
                    onClick={() => navigate("/")}
                    className="back-to-welcome-btn"
                >
                    ← Back to Welcome
                </button>

                <div className="login-header">
                    <h1 className="brand-title">Student event planner</h1>
                </div>

                <div className="login-title-section">
                    <h2 className="login-main-title">Log in</h2>
                </div>

                {error && (
                    <div
                        className="alert alert-danger error-message"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                <div className="social-login-top">
                    <button
                        onClick={handleGoogleLogin}
                        className="btn btn-google-login"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with Google
                    </button>
                </div>

                <div className="divider">
                    <span className="divider-text">OR</span>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label-login">Your email</label>
                        <input
                            type="email"
                            className="form-control custom-input-login"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <label className="form-label-login mb-0">
                                Your password
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="password-toggle-btn-login"
                            >
                                <span className="eye-icon">👁</span>{" "}
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control custom-input-login"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="login-options">
                        <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) =>
                                    setRememberMe(e.target.checked)
                                }
                            />
                            <label
                                className="form-check-label remember-me-label"
                                htmlFor="rememberMe"
                            >
                                Remember me
                            </label>
                        </div>
                        <Link
                            to="/forgotPassword"
                            className="forgot-password-link"
                        >
                            Forget your password
                        </Link>
                    </div>

                    <button type="submit" className="btn btn-login w-100">
                        Log in
                    </button>
                </form>

                <div className="signup-section">
                    <p className="signup-text">
                        Don't have an account?{" "}
                        <Link to="/register" className="signup-link">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
