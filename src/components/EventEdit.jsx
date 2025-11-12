import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    Users,
    Upload,
    Save,
    X,
} from "lucide-react";
import "../style/EventEdit.css";

function EventEdit() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { user } = useUserAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        floor: "",
        organizer: "",
        maxParticipants: "",
        imageUrl: "",
    });

    useEffect(() => {
        loadEventData();
    }, [eventId]);

    const loadEventData = async () => {
        try {
            setLoading(true);
            const eventRef = doc(db, "events", eventId);
            const eventSnap = await getDoc(eventRef);

            if (eventSnap.exists()) {
                const eventData = eventSnap.data();
                setFormData({
                    title: eventData.title || "",
                    description: eventData.description || "",
                    category: eventData.category || "",
                    date: eventData.date || "",
                    startTime: eventData.startTime || "",
                    endTime: eventData.endTime || "",
                    location: eventData.location || "",
                    floor: eventData.floor || "",
                    organizer: eventData.organizer || "",
                    maxParticipants: eventData.maxParticipants || "",
                    imageUrl: eventData.imageUrl || "",
                });
                setImagePreview(eventData.imageUrl || null);
            } else {
                alert("Event not found!");
                navigate("/OrganizerHome");
            }
        } catch (err) {
            console.error("Error loading event:", err);
            alert("Failed to load event data");
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData((prev) => ({
                    ...prev,
                    imageUrl: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setFormData((prev) => ({
            ...prev,
            imageUrl: "",
        }));
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            alert("Please enter an event title");
            return false;
        }
        if (!formData.date) {
            alert("Please select an event date");
            return false;
        }
        if (!formData.startTime || !formData.endTime) {
            alert("Please select start and end times");
            return false;
        }
        if (!formData.location.trim()) {
            alert("Please enter a location");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSaving(true);
            const eventRef = doc(db, "events", eventId);

            await updateDoc(eventRef, {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                date: formData.date,
                startTime: formData.startTime,
                endTime: formData.endTime,
                location: formData.location,
                floor: formData.floor,
                organizer: formData.organizer,
                maxParticipants: formData.maxParticipants,
                imageUrl: formData.imageUrl,
                updatedAt: new Date().toISOString(),
            });

            alert("Event updated successfully!");
            navigate("/OrganizerHome");
        } catch (err) {
            console.error("Error updating event:", err);
            alert(
                "Failed to update event. Please try again. Event image may be too large."
            );
        } finally {
            setSaving(false);
        }
    };

    const categoryOptions = [
        { value: "", label: "Select Category" },
        { value: "education", label: "Education" },
        { value: "health", label: "Health & Beauty" },
        { value: "environment", label: "Environment" },
        { value: "activity", label: "Activity" },
        { value: "technology", label: "Technology" },
        { value: "business", label: "Business" },
    ];

    if (loading) {
        return (
            <div className="event-edit-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading event data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="event-edit-container">
            <div className="event-edit-header">
                <button
                    className="back-button"
                    onClick={() => navigate("/OrganizerHome")}
                >
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>
                <h1 className="page-title">Edit Event</h1>
            </div>

            <div className="event-edit-content">
                <form onSubmit={handleSubmit} className="event-form">
                    {/* Image Upload Section */}
                    <div className="form-section">
                        <h3 className="section-title">Event Image</h3>
                        <div className="image-upload-container">
                            {imagePreview ? (
                                <div className="image-preview-wrapper">
                                    <img
                                        src={imagePreview}
                                        alt="Event preview"
                                        className="image-preview"
                                    />
                                    <button
                                        type="button"
                                        className="remove-image-btn"
                                        onClick={handleRemoveImage}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            ) : (
                                <label className="image-upload-label">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="image-input"
                                    />
                                    <div className="upload-placeholder">
                                        <Upload size={48} />
                                        <span>Click to upload event image</span>
                                        <small>PNG, JPG, GIF up to 10MB</small>
                                    </div>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="form-section">
                        <h3 className="section-title">Basic Information</h3>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label htmlFor="title">
                                    Event Title{" "}
                                    <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter event title"
                                    required
                                />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe your event"
                                    rows="5"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="category">
                                    Category <span className="required">*</span>
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {categoryOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="organizer">
                                    Organizer Name
                                </label>
                                <input
                                    type="text"
                                    id="organizer"
                                    name="organizer"
                                    value={formData.organizer}
                                    onChange={handleInputChange}
                                    placeholder="Enter organizer name"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="form-section">
                        <h3 className="section-title">
                            <Clock size={20} />
                            Date & Time
                        </h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="date">
                                    Event Date{" "}
                                    <span className="required">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="startTime">
                                    Start Time{" "}
                                    <span className="required">*</span>
                                </label>
                                <input
                                    type="time"
                                    id="startTime"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="endTime">
                                    End Time <span className="required">*</span>
                                </label>
                                <input
                                    type="time"
                                    id="endTime"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="form-section">
                        <h3 className="section-title">
                            <MapPin size={20} />
                            Location
                        </h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="location">
                                    Venue <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="Enter venue name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="floor">Floor / Room</label>
                                <input
                                    type="text"
                                    id="floor"
                                    name="floor"
                                    value={formData.floor}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 2nd Floor, Room 201"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Capacity */}
                    <div className="form-section">
                        <h3 className="section-title">
                            <Users size={20} />
                            Capacity
                        </h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="maxParticipants">
                                    Maximum Participants
                                </label>
                                <input
                                    type="number"
                                    id="maxParticipants"
                                    name="maxParticipants"
                                    value={formData.maxParticipants}
                                    onChange={handleInputChange}
                                    placeholder="Enter max capacity"
                                    min="1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => navigate("/OrganizerHome")}
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
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EventEdit;
