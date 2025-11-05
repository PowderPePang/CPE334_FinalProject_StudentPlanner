import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const Unauthorized401 = () => {
    return (
        <div className="container text-center mt-5">
            <h1 className="display-1">401</h1>
            <h2 className="mb-4">Unauthorized Access</h2>
            <p className="lead mb-4">Please login to access this page</p>
            <Link to="/login">
                <Button variant="primary">Go to Login</Button>
            </Link>
        </div>
    );
};

export default Unauthorized401;
