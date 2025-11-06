import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert, Button } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { signUp } = useUserAuth();

    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            // First, create the user account with Firebase Auth
            const userCredential = await signUp(email, password);

            // Then, add user info to Firestore
            await addDoc(collection(db, "users"), {
                uid: userCredential.user.uid, // Store the user's UID
                firstName,
                lastName,
                phone,
                email,
                createdAt: new Date(),
            });

            navigate("/");
        } catch (err) {
            setError(err.message);
            console.log(err);
        }
    };

    return (
        <div>
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <h2 className="mb-3">Register</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group
                            className="mb-3"
                            controlId="formBasicFirstName"
                        >
                            <Form.Control
                                type="text"
                                placeholder="Enter your first name"
                                onChange={(e) => setFirstName(e.target.value)}
                                pattern="[a-zA-Z]{3,20}"
                                title="3 to 20 letters"
                                required
                            />
                        </Form.Group>

                        <Form.Group
                            className="mb-3"
                            controlId="formBasicLastName"
                        >
                            <Form.Control
                                type="text"
                                placeholder="Enter your last name"
                                onChange={(e) => setLastName(e.target.value)}
                                pattern="[a-zA-Z]{3,20}"
                                title="3 to 20 letters"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPhone">
                            <Form.Control
                                type="text"
                                placeholder="Enter your phone number e.g. 0812345678"
                                onChange={(e) => setPhone(e.target.value)}
                                pattern="[0-9]{10}"
                                title="standard 10-digit number"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control
                                type="email"
                                placeholder="Email address"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group
                            className="mb-3"
                            controlId="formBasicPassword"
                        >
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
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
