import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import {
    collection,
    addDoc,
    doc,
    setDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import "../style/Register.css";

function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { signUp } = useUserAuth();

    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        console.log("=== REGISTRATION START ===");

        try {
            console.log("[1] Creating Auth user...");
            const userCredential = await signUp(email, password);
            const user = userCredential.user;

            console.log("[1] Auth Success! UID:", user.uid);

            console.log("[2] Saving to Firestore...");
            console.log("Collection: users");
            console.log("Document ID:", user.uid);
            console.log("Data:", {
                uid: user.uid,
                email: user.email,
                firstName: firstName,
                lastName: lastName,
                photoURL: null,
                phone: phone,
                role: role,
                isActive: true,
            });

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid, // Store the user's UID
                email: user.email,
                firstName: firstName,
                lastName: lastName,
                photoURL: null,
                phone: phone,
                role: role,
                isActive: true,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            alert("Sign up successfully!");

            console.log("[2] Firestore Success!");
            console.log("=== COMPLETE ===");

            navigate("/");
        } catch (err) {
            console.error("=== ERROR DETAILS ===");
            console.error(
                "Stage:",
                err.code?.includes("auth/") ? "Authentication" : "Firestore"
            );
            console.error("Code:", err.code);
            console.error("Message:", err.message);
            console.error("Full error:", err);
            setError(err.message);
        }
    };

    return (
        <div className="register-container">
            <div className="register-content">
                <button
                    onClick={() => navigate("/")}
                    className="back-to-welcome-btn"
                >
                    ← Back to Welcome
                </button>
                <div className="register-header">
                    <h1 className="brand-title">Student event planner</h1>
                </div>

                <div className="register-title-section">
                    <h2 className="register-main-title">Create an account</h2>
                    <p className="register-subtitle">
                        Already have an account?{" "}
                        <Link to="/login" className="login-link">
                            Log in
                        </Link>
                    </p>
                </div>

                {error && (
                    <div
                        className="alert alert-danger error-message"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label">First Name</label>
                        <input
                            type="text"
                            className="form-control custom-input"
                            placeholder="Enter your first name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Last Name</label>
                        <input
                            type="text"
                            className="form-control custom-input"
                            placeholder="Enter your last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Phone Number</label>
                        <input
                            type="tel"
                            className="form-control custom-input"
                            placeholder="Enter your 10-digits phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            pattern="[0-9]{10}"
                            title="Please enter a 10-digit phone number"
                            required
                        />
                    </div>

                    {/* Role Selection */}
                    <div className="mb-4">
                        <label className="form-label">I am a...</label>
                        <select
                            className="form-control custom-input"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="student">Student</option>
                            <option value="organizer">Event Organizer</option>
                        </select>
                        <small className="form-text text-muted">
                            Students can register for events. Organizers can
                            create and manage events.
                        </small>
                    </div>

                    <div className="mb-4">
                        <label className="form-label">What's your email?</label>
                        <input
                            type="email"
                            className="form-control custom-input"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <label className="form-label mb-0">
                                Create a password
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="password-toggle-btn"
                            >
                                <span className="eye-icon">👁</span>{" "}
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control custom-input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <p className="password-hint">
                        Use 8 or more characters with a mix of letters, numbers
                        & symbols
                    </p>

                    <button
                        type="submit"
                        className="btn btn-create-account w-100"
                    >
                        Create an account
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;
