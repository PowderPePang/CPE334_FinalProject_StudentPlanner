import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { db } from "../firebase";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Camera,
    Save,
    X,
    Lock,
    Eye,
    EyeOff,
    Shield,
    Calendar,
} from "lucide-react";
import "../style/Profile.css";

function Profile() {
    const { user } = useUserAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [changePasswordMode, setChangePasswordMode] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        photoURL: "",
        role: "",
        isActive: false,
        createdAt: "",
    });

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        photoURL: "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadUserData();
    }, [user]);

    const loadUserData = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const data = userSnap.data();
                setUserData(data);
                setFormData({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    photoURL: data.photoURL || "",
                });
                setImagePreview(data.photoURL || null);
            }
        } catch (err) {
            console.error("Error loading user data:", err);
            setError("Failed to load user data");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size should be less than 5MB");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData((prev) => ({
                    ...prev,
                    photoURL: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setFormData((prev) => ({
            ...prev,
            photoURL: "",
        }));
    };

    const validateForm = () => {
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            setError("First name and last name are required");
            return false;
        }

        if (!formData.email.trim()) {
            setError("Email is required");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address");
            return false;
        }

        if (
            formData.phone &&
            !/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))
        ) {
            setError("Please enter a valid 10-digit phone number");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!validateForm()) {
            return;
        }

        try {
            setSaving(true);
            const userRef = doc(db, "users", user.uid);

            // Update Firestore
            await updateDoc(userRef, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                photoURL: formData.photoURL,
                updatedAt: new Date().toISOString(),
            });

            // Update Firebase Auth profile
            await updateProfile(user, {
                displayName: `${formData.firstName} ${formData.lastName}`,
                photoURL: formData.photoURL,
            });

            // Update email if changed
            if (formData.email !== userData.email) {
                await updateEmail(user, formData.email);
            }

            setUserData((prev) => ({
                ...prev,
                ...formData,
            }));

            setSuccess("Profile updated successfully!");
            setEditMode(false);
        } catch (err) {
            console.error("Error updating profile:", err);
            if (err.code === "auth/requires-recent-login") {
                setError(
                    "Please log out and log in again to update your email"
                );
            } else {
                setError("Failed to update profile. Please try again.");
            }
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            setSaving(true);
            await updatePassword(user, passwordData.newPassword);
            setSuccess("Password updated successfully!");
            setChangePasswordMode(false);
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err) {
            console.error("Error updating password:", err);
            if (err.code === "auth/requires-recent-login") {
                setError(
                    "Please log out and log in again to change your password"
                );
            } else {
                setError("Failed to update password. Please try again.");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            phone: userData.phone || "",
            photoURL: userData.photoURL || "",
        });
        setImagePreview(userData.photoURL || null);
        setEditMode(false);
        setError("");
        setSuccess("");
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A";
        const date = timestamp.toDate
            ? timestamp.toDate()
            : new Date(timestamp);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="profile-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <button
                    className="back-button"
                    onClick={() => navigate("/home")}
                >
                    <ArrowLeft size={20} />
                    Back to Home
                </button>
                <h1 className="page-title">My Profile</h1>
            </div>

            <div className="profile-content">
                {/* Profile Card */}
                <div className="profile-card">
                    {/* Avatar Section */}
                    <div className="avatar-section">
                        <div className="avatar-wrapper">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Profile"
                                    className="avatar-image"
                                />
                            ) : (
                                <div className="avatar-placeholder">
                                    <User size={64} />
                                </div>
                            )}
                            {editMode && (
                                <label className="avatar-edit-btn">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="avatar-input"
                                    />
                                    <Camera size={20} />
                                </label>
                            )}
                            {editMode && imagePreview && (
                                <button
                                    className="avatar-remove-btn"
                                    onClick={handleRemoveImage}
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        <div className="user-info-header">
                            <h2 className="user-name">
                                {userData.firstName} {userData.lastName}
                            </h2>
                            <span
                                className={`role-badge role-${userData.role}`}
                            >
                                {userData.role === "student"
                                    ? "Student"
                                    : "Organizer"}
                            </span>
                        </div>
                    </div>

                    {/* Messages */}
                    {error && <div className="alert alert-error">{error}</div>}
                    {success && (
                        <div className="alert alert-success">{success}</div>
                    )}

                    {/* Edit/Save Buttons */}
                    {!changePasswordMode && (
                        <div className="profile-actions">
                            {!editMode ? (
                                <>
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="btn-edit"
                                    >
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={() =>
                                            setChangePasswordMode(true)
                                        }
                                        className="btn-change-password"
                                    >
                                        <Lock size={18} />
                                        Change Password
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        className="btn-cancel"
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="btn-save"
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <>
                                                <div className="button-spinner"></div>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {/* Profile Information */}
                    {!changePasswordMode ? (
                        <div className="profile-info">
                            <div className="info-section">
                                <h3 className="section-title">
                                    Personal Information
                                </h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <label className="info-label">
                                            <User size={18} />
                                            First Name
                                        </label>
                                        {editMode ? (
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className="info-input"
                                                placeholder="First name"
                                            />
                                        ) : (
                                            <p className="info-value">
                                                {userData.firstName}
                                            </p>
                                        )}
                                    </div>

                                    <div className="info-item">
                                        <label className="info-label">
                                            <User size={18} />
                                            Last Name
                                        </label>
                                        {editMode ? (
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className="info-input"
                                                placeholder="Last name"
                                            />
                                        ) : (
                                            <p className="info-value">
                                                {userData.lastName}
                                            </p>
                                        )}
                                    </div>

                                    <div className="info-item">
                                        <label className="info-label">
                                            <Mail size={18} />
                                            Email Address
                                        </label>
                                        {editMode ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="info-input"
                                                placeholder="Email"
                                            />
                                        ) : (
                                            <p className="info-value">
                                                {userData.email}
                                            </p>
                                        )}
                                    </div>

                                    <div className="info-item">
                                        <label className="info-label">
                                            <Phone size={18} />
                                            Phone Number
                                        </label>
                                        {editMode ? (
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="info-input"
                                                placeholder="Phone number"
                                            />
                                        ) : (
                                            <p className="info-value">
                                                {userData.phone ||
                                                    "Not provided"}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="info-section">
                                <h3 className="section-title">
                                    Account Details
                                </h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <label className="info-label">
                                            <Shield size={18} />
                                            Role
                                        </label>
                                        <p className="info-value">
                                            {userData.role === "student"
                                                ? "Student"
                                                : "Organizer"}
                                        </p>
                                    </div>

                                    <div className="info-item">
                                        <label className="info-label">
                                            <Calendar size={18} />
                                            Member Since
                                        </label>
                                        <p className="info-value">
                                            {formatDate(userData.createdAt)}
                                        </p>
                                    </div>

                                    <div className="info-item">
                                        <label className="info-label">
                                            <Shield size={18} />
                                            Account Status
                                        </label>
                                        <p className="info-value">
                                            <span
                                                className={`status-badge ${
                                                    userData.isActive
                                                        ? "active"
                                                        : "inactive"
                                                }`}
                                            >
                                                {userData.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Change Password Form
                        <div className="change-password-section">
                            <h3 className="section-title">
                                <Lock size={20} />
                                Change Password
                            </h3>
                            <form
                                onSubmit={handlePasswordUpdate}
                                className="password-form"
                            >
                                <div className="form-group">
                                    <label className="form-label">
                                        New Password
                                    </label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={
                                                showNewPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className="info-input"
                                            placeholder="Enter new password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() =>
                                                setShowNewPassword(
                                                    !showNewPassword
                                                )
                                            }
                                        >
                                            {showNewPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Confirm Password
                                    </label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="info-input"
                                            placeholder="Confirm new password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="password-actions">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setChangePasswordMode(false);
                                            setPasswordData({
                                                currentPassword: "",
                                                newPassword: "",
                                                confirmPassword: "",
                                            });
                                            setError("");
                                        }}
                                        className="btn-cancel"
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-save"
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <>
                                                <div className="button-spinner"></div>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                Update Password
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
