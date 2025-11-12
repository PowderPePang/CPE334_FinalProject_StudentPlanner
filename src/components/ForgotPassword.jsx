import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import "../style/ForgotPassword.css";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Send password reset email
            await sendPasswordResetEmail(auth, email);
            setSuccess(true);
        } catch (err) {
            console.error("Error sending reset email:", err);

            // Handle specific error cases
            switch (err.code) {
                case "auth/user-not-found":
                    setError("No account found with this email address.");
                    break;
                case "auth/invalid-email":
                    setError("Please enter a valid email address.");
                    break;
                case "auth/too-many-requests":
                    setError("Too many attempts. Please try again later.");
                    break;
                default:
                    setError("Failed to send reset email. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate("/login");
    };

    if (success) {
        return (
            <div className="forgot-password-container">
                <div className="forgot-password-content">
                    <button
                        onClick={handleBackToLogin}
                        className="back-to-login-btn"
                    >
                        <ArrowLeft size={18} />
                        Back to Login
                    </button>

                    <div className="success-state">
                        <div className="success-icon">
                            <CheckCircle size={64} />
                        </div>
                        <h2 className="success-title">Check Your Email</h2>
                        <p className="success-message">
                            We've sent a password reset link to
                        </p>
                        <p className="success-email">{email}</p>
                        <p className="success-instructions">
                            Click the link in the email to reset your password.
                            If you don't see it, check your spam folder.
                        </p>

                        <button
                            onClick={handleBackToLogin}
                            className="btn-back-to-login"
                        >
                            Back to Login
                        </button>

                        <button
                            onClick={() => {
                                setSuccess(false);
                                setEmail("");
                            }}
                            className="btn-resend"
                        >
                            Resend Email
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-content">
                <button
                    onClick={handleBackToLogin}
                    className="back-to-login-btn"
                >
                    <ArrowLeft size={18} />
                    Back to Login
                </button>

                <div className="forgot-password-header">
                    <div className="reset-icon">
                        <Mail size={48} />
                    </div>
                    <h1 className="brand-title">Student event planner</h1>
                </div>

                <div className="forgot-password-title-section">
                    <h2 className="forgot-password-main-title">
                        Reset Your Password
                    </h2>
                    <p className="forgot-password-subtitle">
                        Enter your email address and we'll send you a link to
                        reset your password.
                    </p>
                </div>

                {error && (
                    <div className="alert alert-danger error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="forgot-password-form">
                    <div className="form-group">
                        <label className="form-label-forgot">
                            Email Address
                        </label>
                        <div className="input-with-icon">
                            {/* <Mail className="input-icon" size={20} /> */}
                            <input
                                type="email"
                                className="form-control custom-input-forgot"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-reset-password"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="button-spinner"></div>
                                Sending...
                            </>
                        ) : (
                            "Send Reset Link"
                        )}
                    </button>
                </form>

                <div className="login-section">
                    <p className="login-text">
                        Remember your password?{" "}
                        <Link to="/login" className="login-link">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
