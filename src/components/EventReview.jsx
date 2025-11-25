import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { 
    doc, 
    getDoc, 
    updateDoc, 
    arrayUnion,
    increment,
    Timestamp 
} from "firebase/firestore";
import { db } from "../firebase";
import { ArrowLeft, Star } from "lucide-react";

function EventReview() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { user } = useUserAuth();
    
    // ✅ ประกาศ ALL hooks ที่นี่ก่อน (ห้ามมี hooks หลัง early returns!)
    const [event, setEvent] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [existingReview, setExistingReview] = useState(null);

    // ✅ useEffect ทั้งหมดต้องอยู่ตรงนี้ (ก่อน early returns และ conditionals)
    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                navigate("/login");
                return;
            }

            try {
                // ดึง user profile
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    setUserProfile(userDoc.data());
                }

                // ดึง event data
                const eventDoc = await getDoc(doc(db, "events", eventId));
                if (eventDoc.exists()) {
                    const eventData = eventDoc.data();
                    setEvent({ id: eventDoc.id, ...eventData });

                    // เช็คว่าเคย review แล้วหรือยัง
                    if (eventData.reviews) {
                        const existing = eventData.reviews.find(
                            r => r.userId === user.uid
                        );
                        if (existing) {
                            setExistingReview(existing);
                            setRating(existing.rating);
                            setComment(existing.comment);
                        }
                    }

                    // เช็คว่าลงทะเบียนหรือยัง
                    const isRegistered = eventData.participants?.some(
                        p => p.userId === user.uid
                    );
                    if (!isRegistered) {
                        alert("You must register for this event first!");
                        navigate(`/event/${eventId}`);
                        return;
                    }

                    // เช็คว่า event จบแล้วหรือยัง
                    const eventDate = eventData.endDate?.toDate 
                        ? eventData.endDate.toDate() 
                        : new Date(eventData.endDate);
                    if (eventDate > new Date()) {
                        alert("You can only review after the event ends!");
                        navigate(`/event/${eventId}`);
                        return;
                    }
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [eventId, user, navigate]);

    // ✅ Debug useEffect (optional - ลบได้ถ้าไม่ต้องการ)
    useEffect(() => {
        console.log("📊 EventReview State:", {
            rating,
            commentLength: comment.length,
            submitting,
            hasUserProfile: !!userProfile,
            hasEvent: !!event,
            isButtonDisabled: submitting || rating === 0 || comment.trim().length < 100
        });
    }, [rating, comment, submitting, userProfile, event]);

    // ✅ Handler functions (หลัง hooks)
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("🟢 Submit button clicked!");

        if (rating === 0) {
            alert("Please select a rating!");
            console.log("❌ Rating is 0");
            return;
        }

        if (comment.trim().length < 10) {
            alert("Please write at least 10 characters!");
            console.log("❌ Comment too short:", comment.length);
            return;
        }

        if (!userProfile) {
            alert("กรุณารอสักครู่...");
            console.log("❌ User profile not loaded yet");
            return;
        }

        try {
            setSubmitting(true);
            console.log("🔵 Starting review submission...");

            const review = {
                userId: user.uid,
                userName: userProfile.firstName && userProfile.lastName
                    ? `${userProfile.firstName} ${userProfile.lastName}`
                    : userProfile.email,
                userEmail: userProfile.email,
                rating: rating,
                comment: comment.trim(),
                createdAt: existingReview ? existingReview.createdAt : Timestamp.now(),
                updatedAt: Timestamp.now()
            };

            console.log("📝 Review object:", review);

            const eventRef = doc(db, "events", eventId);

            if (existingReview) {
                console.log("🔄 Updating existing review...");
                const eventDoc = await getDoc(eventRef);
                const eventData = eventDoc.data();

                const updatedReviews = eventData.reviews.filter(
                    r => r.userId !== user.uid
                );
                updatedReviews.push(review);

                const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
                const averageRating = totalRating / updatedReviews.length;

                await updateDoc(eventRef, {
                    reviews: updatedReviews,
                    averageRating: averageRating,
                    totalReviews: updatedReviews.length
                });

                console.log("✅ Review updated successfully");
                alert("Review updated successfully!");
            } else {
                console.log("➕ Adding new review...");
                
                const eventDoc = await getDoc(eventRef);
                
                if (!eventDoc.exists()) {
                    throw new Error("Event not found!");
                }
                
                const eventData = eventDoc.data();
                console.log("📄 Current event data:", eventData);
                
                const currentReviews = eventData.reviews || [];
                const updatedReviews = [...currentReviews, review];
                
                console.log("📊 Updated reviews array:", updatedReviews);
                
                const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
                const averageRating = totalRating / updatedReviews.length;

                console.log("📈 Calculated average:", averageRating);

                await updateDoc(eventRef, {
                    reviews: updatedReviews,
                    totalReviews: updatedReviews.length,
                    averageRating: averageRating
                });

                console.log("✅ Review added successfully to Firestore");
                alert("Review submitted successfully!");
            }

            console.log("🏠 Navigating to home...");
            navigate("/home");
            
        } catch (err) {
            console.error("❌ Error submitting review:");
            console.error("Error message:", err.message);
            console.error("Full error:", err);
            alert("Failed to submit review: " + err.message);
        } finally {
            setSubmitting(false);
            console.log("🔚 Submit process finished");
        }
    };

    // ✅ Conditional renders อยู่ท้ายสุด (หลัง ALL hooks)
    if (loading) {
        return <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>;
    }

    if (!event) {
        return <div style={{ padding: "2rem", textAlign: "center" }}>Event not found</div>;
    }

    // ✅ Main return
    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f5f7fa", padding: "2rem" }}>
            <div style={{ maxWidth: "700px", margin: "0 auto" }}>
                {/* Header */}
                <button
                    onClick={() => navigate("/home")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 1rem",
                        background: "white",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        cursor: "pointer",
                        marginBottom: "1.5rem"
                    }}
                >
                    <ArrowLeft size={20} />
                    Back to Home
                </button>

                {/* Review Card */}
                <div style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "2rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}>
                    <h1 style={{ 
                        fontSize: "1.75rem", 
                        fontWeight: "700", 
                        marginBottom: "0.5rem",
                        color: "#2d3748"
                    }}>
                        {existingReview ? "Edit Your Review" : "Write a Review"}
                    </h1>
                    <h2 style={{ 
                        fontSize: "1.25rem", 
                        fontWeight: "600", 
                        marginBottom: "2rem",
                        color: "#667eea"
                    }}>
                        {event?.title}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        {/* Rating */}
                        <div style={{ marginBottom: "2rem" }}>
                            <label style={{ 
                                display: "block", 
                                marginBottom: "1rem",
                                fontSize: "1.1rem",
                                fontWeight: "600"
                            }}>
                                How would you rate this event?
                            </label>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: "0.5rem"
                                        }}
                                    >
                                        <Star
                                            size={40}
                                            fill={(hoverRating || rating) >= star ? "#ffd700" : "none"}
                                            stroke={(hoverRating || rating) >= star ? "#ffd700" : "#cbd5e0"}
                                            strokeWidth={2}
                                        />
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <p style={{ marginTop: "0.5rem", color: "#666" }}>
                                    {rating === 5 && "⭐ Excellent!"}
                                    {rating === 4 && "⭐ Very Good!"}
                                    {rating === 3 && "⭐ Good"}
                                    {rating === 2 && "⭐ Fair"}
                                    {rating === 1 && "⭐ Poor"}
                                </p>
                            )}
                        </div>

                        {/* Comment */}
                        <div style={{ marginBottom: "2rem" }}>
                            <label style={{ 
                                display: "block", 
                                marginBottom: "0.5rem",
                                fontSize: "1.1rem",
                                fontWeight: "600"
                            }}>
                                Share your experience
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Tell us about your experience at this event..."
                                rows={6}
                                style={{
                                    width: "100%",
                                    padding: "1rem",
                                    borderRadius: "8px",
                                    border: "1px solid #e0e0e0",
                                    fontSize: "1rem",
                                    fontFamily: "inherit",
                                    resize: "vertical"
                                }}
                                required
                            />
                            <p style={{ 
                                marginTop: "0.5rem", 
                                fontSize: "0.85rem", 
                                color: "#999" 
                            }}>
                                Minimum 10 characters ({comment.length}/10)
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting || rating === 0 || comment.trim().length < 10}
                            style={{
                                width: "100%",
                                padding: "1rem",
                                background: submitting || rating === 0 || comment.trim().length < 10
                                    ? "#cccccc" 
                                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "1.1rem",
                                fontWeight: "600",
                                cursor: submitting || rating === 0 || comment.trim().length < 10 ? "not-allowed" : "pointer",
                                opacity: submitting || rating === 0 || comment.trim().length < 10 ? 0.6 : 1
                            }}
                        >
                            {submitting ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EventReview;
