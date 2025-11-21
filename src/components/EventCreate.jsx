import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, addDoc, updateDoc, doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useUserAuth } from "../context/UserAuthContext";
import { ArrowLeft, Upload, X, Plus } from "lucide-react";
import "../style/EventCreate.css";

function EventManagement() {
    const navigate = useNavigate();
    const { eventId } = useParams();
    const isEditMode = !!eventId;
    const { user } = useUserAuth();

    const [formData, setFormData] = useState({
        title: "",
        organizer: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        building: "",
        floor: "",
        category: "",
        description: "",
        imageUrl: "",
        tags: [],
        currentParticipants: 0,
        maxParticipants: 100,
        status: "upcoming",
        participants: [],
    });

    const [newTag, setNewTag] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [userProfile, setUserProfile] = useState(null);

    const categoryOptions = [
        { value: "education", label: "Education", icon: "💡" },
        { value: "health", label: "Health & Beauty", icon: "❤️" },
        { value: "environment", label: "Environment", icon: "🌲" },
        { value: "activity", label: "Activity", icon: "⭐" },
        { value: "technology", label: "Technology", icon: "💻" },
        { value: "business", label: "Business", icon: "💼" },
    ];

    // ✅ ดึง user profile
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user) {
                console.log("⚠️ No user - redirecting to login");
                navigate("/login");
                return;
            }

            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const profile = userDoc.data();
                    setUserProfile(profile);

                    if (profile.role !== "organizer") {
                        alert("Access denied. Only organizers can create events!");
                        navigate("/home");
                    }
                } else {
                    navigate("/login");
                }
            } catch (err) {
                console.error("Error fetching user profile:", err);
                navigate("/login");
            }
        };

        fetchUserProfile();
    }, [user, navigate]);

    useEffect(() => {
        if (isEditMode && userProfile) {
            loadEventData();
        }
    }, [eventId, userProfile]);

    const loadEventData = async () => {
        try {
            setLoading(true);
            const eventDoc = await getDoc(doc(db, "events", eventId));
            if (eventDoc.exists()) {
                const data = eventDoc.data();

                // ✅ ตรวจสอบ ownership
                if (data.organizerId !== user.uid) {
                    alert("You can only edit your own events!");
                    navigate("/organizerHome");
                    return;
                }

                setFormData(data);

                if (data.imageUrl) {
                    setImagePreview(data.imageUrl);
                }
            }
        } catch (err) {
            setError("Failed to load event data");
            console.error(err);
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

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert("Image size must be less than 10MB");
                return;
            }

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

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()],
            }));
            setNewTag("");
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // ✅ Validation: end time > start time
            if (formData.endTime <= formData.startTime) {
                alert("End time must be after start time!");
                setLoading(false);
                return;
            }

            // ✅ สร้าง Timestamp จาก date และ time (สำหรับ query)
            const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
            const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

            // ✅ สร้างชื่อเต็มจาก firstName + lastName
            const fullName = userProfile.firstName && userProfile.lastName 
                ? `${userProfile.firstName} ${userProfile.lastName}`
                : userProfile.email;

            // ✅Event data ตาม structure จริง
            const eventData = {
                title: formData.title,
                organizer: formData.organizer,
                organizerId: user.uid, // ✅ เพิ่ม
                organizerName: fullName, // ✅ ใช้ firstName + lastName
                organizerEmail: userProfile.email, // ✅ เพิ่ม

                // ✅ เก็บทั้ง string และ Timestamp
                date: formData.date, // string: "2025-11-30" (backward compatible)
                startDate: Timestamp.fromDate(startDateTime), // ✅ Timestamp สำหรับ query/sort
                endDate: Timestamp.fromDate(endDateTime), // ✅ Timestamp
                startTime: formData.startTime, // string: "09:00"
                endTime: formData.endTime, // string: "12:30"

                location: formData.location,
                building: formData.building,
                floor: formData.floor,
                category: formData.category,
                description: formData.description,
                imageUrl: formData.imageUrl, // ✅ ตัว l เล็ก
                tags: formData.tags || [],

                // ✅ เพิ่ม fields ใหม่
                currentParticipants: formData.currentParticipants || 0,
                maxParticipants: formData.maxParticipants || 100,
                status: formData.status || "upcoming",
                participants: formData.participants || [],

                // ✅ Timestamps
                updatedAt: Timestamp.now(),
                createdAt: isEditMode ? formData.createdAt : Timestamp.now(),
            };

            if (isEditMode) {
                await updateDoc(doc(db, "events", eventId), eventData);
                console.log("✅ Event updated:", eventId);
                alert("Event updated successfully!");
            } else {
                const docRef = await addDoc(collection(db, "events"), eventData);
                console.log("✅ Event created:", docRef.id);
                alert("Event created successfully!");
            }

            navigate("/organizerHome");
        } catch (err) {
            setError(err.message);
            console.error("❌ Error saving event:", err);
            alert("Failed to save event: " + err.message);
        } finally {
            setLoading(false);
        }
    };
    
    if (!userProfile) {
        return (
            <div className="event-management-container">
                <div className="loading-state">Loading...</div>
            </div>
        );
    }

    if (loading && isEditMode) {
        return (
            <div className="event-management-container">
                <div className="loading-state">Loading event data...</div>
            </div>
        );
    }

    return (
        <div className="event-management-container">
            <div className="event-management-content">
                <div className="event-management-header">
                    <button
                        onClick={() => navigate("/organizerHome")}
                        className="back-button-event"
                    >
                        <ArrowLeft /> Back
                    </button>
                    <h1 className="page-title-event">
                        {isEditMode ? "Edit Event" : "Create New Event"}
                    </h1>
                </div>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="event-form">
                    {/* Image Upload */}
                    <div className="form-section">
                        <label className="section-label">
                            Event Banner Image
                        </label>
                        <div className="image-upload-area">
                            {imagePreview ? (
                                <div className="image-preview-container">
                                    <img
                                        src={imagePreview}
                                        alt="Event preview"
                                        className="image-preview"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImagePreview("");
                                            setFormData((prev) => ({
                                                ...prev,
                                                imageUrl: "",
                                            }));
                                        }}
                                        className="remove-image-btn"
                                    >
                                        <X />
                                    </button>
                                </div>
                            ) : (
                                <label className="upload-label">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="file-input"
                                    />
                                    <div className="upload-placeholder">
                                        <Upload size={40} />
                                        <p>Click to upload event image</p>
                                        <span className="upload-hint">
                                            PNG, JPG up to 10MB
                                        </span>
                                    </div>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="form-section">
                        <label className="section-label">Event Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter event title"
                            className="form-control event-input"
                            required
                        />
                    </div>

                    <div className="form-section">
                        <label className="section-label">Organizer *</label>
                        <input
                            type="text"
                            name="organizer"
                            value={formData.organizer}
                            onChange={handleInputChange}
                            placeholder="e.g., Energy Environment Safety and Health"
                            className="form-control event-input"
                            required
                        />
                    </div>

                    {/* Date and Time */}
                    <div className="form-row">
                        <div className="form-section">
                            <label className="section-label">Date *</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="form-control event-input"
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                        <div className="form-section">
                            <label className="section-label">
                                Start Time *
                            </label>
                            <input
                                type="time"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleInputChange}
                                className="form-control event-input"
                                required
                            />
                        </div>
                        <div className="form-section">
                            <label className="section-label">End Time *</label>
                            <input
                                type="time"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleInputChange}
                                className="form-control event-input"
                                required
                            />
                        </div>
                    </div>
                    
                    {/* Max Participants */}
                    <div className="form-section">
                        <label className="section-label">Max Participants</label>
                        <input
                            type="number"
                            name="maxParticipants"
                            value={formData.maxParticipants}
                            onChange={handleInputChange}
                            placeholder="Maximum number of participants (default: 100)"
                            className="form-control event-input"
                            min="1"
                        />
                    </div>

                    {/* Location */}
                    <div className="form-section">
                        <label className="section-label">
                            Location/Building *
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="e.g., N16 Learning Exchange Building"
                            className="form-control event-input"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-section">
                            <label className="section-label">Building</label>
                            <input
                                type="text"
                                name="building"
                                value={formData.building}
                                onChange={handleInputChange}
                                placeholder="Building name or number"
                                className="form-control event-input"
                            />
                        </div>
                        <div className="form-section">
                            <label className="section-label">Floor</label>
                            <input
                                type="text"
                                name="floor"
                                value={formData.floor}
                                onChange={handleInputChange}
                                placeholder="e.g., 1st floor"
                                className="form-control event-input"
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div className="form-section">
                        <label className="section-label">Category *</label>
                        <div className="category-grid">
                            {categoryOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            category: option.value,
                                        }))
                                    }
                                    className={`category-btn ${
                                        formData.category === option.value
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    <span className="category-icon">
                                        {option.icon}
                                    </span>
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="form-section">
                        <label className="section-label">Tags</label>
                        <div className="tags-input-container">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => {  // ✅ เปลี่ยนจาก onKeyPress
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addTag();
                                    }
                                }}
                                placeholder="Add tags (press Enter)"
                                className="form-control event-input"
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="add-tag-btn"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                        <div className="tags-display">
                            {formData.tags.map((tag, index) => (
                                <span key={index} className="tag-pill">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="remove-tag-btn"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="form-section">
                        <label className="section-label">
                            Event Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe your event..."
                            className="form-control event-textarea"
                            rows="6"
                            required
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate("/organizerHome")}
                            className="btn btn-cancel"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : isEditMode
                                ? "Update Event"
                                : "Create Event"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EventManagement;
