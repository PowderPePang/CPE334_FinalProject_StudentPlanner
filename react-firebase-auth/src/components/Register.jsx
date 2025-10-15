import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert, Button } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import { doc, setDoc } from 'firebase/firestore';
import { db } from "../firebase";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { signUp } = useUserAuth();

    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!validateForm()) {
            return;
        }
        
        try {
            const { user } = await signUp(email, password);
            
            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, {
                email,
                createdAt: new Date().toISOString()
            }, { merge: true });

            console.log("User data saved successfully");
            navigate("/");
        } catch (err) {
            console.error("Registration error:", err);
            setError(err.message);
        }
    };

    const validateForm = () => {
        if (!email || !password) {
            setError("All fields are required");
            return false;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return false;
        }
        return true;
    };

    return (
        <div>
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <h2 className="mb-3">Register</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control
                                type="email"
                                placeholder="Email address"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button variant="primary" type="submit">
                                Sign Up
                            </Button>
                        </div>
                    </Form>
                    <div className="p-4 box mt-3 text-center">
                        Already have an account? <Link to="/login">Log in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
