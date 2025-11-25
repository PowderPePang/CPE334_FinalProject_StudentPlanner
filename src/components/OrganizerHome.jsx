import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import {
    collection,
    getDocs,
    getDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import {
    Home,
    Calendar,
    User,
    Bell,
    Plus,
    Edit,
    Trash2,
    Users,
    BarChart3,
    Search,
    Filter,
    MoreVertical,
    Star,
} from "lucide-react";
import "../style/OrganizerHome.css";

function OrganizerHome() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showEventMenu, setShowEventMenu] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true); // ✅ เพิ่ม loading state
    const [selectedEventForReviews, setSelectedEventForReviews] = useState(null);

    const { logOut, user, loading: authLoading } = useUserAuth();
    const navigate = useNavigate();
    
    const filterEvents = () => {
        let filtered = events;

        if (searchQuery) {
            filtered = filtered.filter(
                (event) =>
                    event.title
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    event.organizer
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    event.location
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(
                (event) => event.category === selectedCategory
            );
        }

        setFilteredEvents(filtered);
    };

    const loadEvents = async () => {
            if (!user) {
                console.log("⏭️ Skipping events load - no user");
                return;
            }

            try {
                setLoading(true);
                console.log("🔵 Loading events for organizer:", user.uid);

                const eventsRef = collection(db, "events");

                // ✅ Filter เฉพาะ events ของตัวเอง!
                const q = query(
                    eventsRef,
                    where("organizerId", "==", user.uid),
                    orderBy("createdAt", "desc")
                );
                const querySnapshot = await getDocs(q);

                const eventsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                
                console.log("✅ My Events loaded:", eventsData.length);
                // console.log("Events data:", eventsData);

                setEvents(eventsData);

            } catch (err) {
                console.error("❌ Error loading events:", err);
                // console.error("Error code:", err.code);
                // console.error("Error message:", err.message);

                // ถ้า error เกี่ยวกับ index
                if (err.code === "failed-precondition") {
                    alert("Please create a Firestore index. Check the console for the link.");
                }
            } finally {
                setLoading(false);
            }
        };


    // ✅ เพิ่ม: ดึง User Profile และตรวจสอบ role
    useEffect(() => {
        const fetchUserProfile = async () => {
            // ❌ ถ้าไม่มี user หลังจากโหลดเสร็จแล้ว
            if (!user) {
                console.log("⚠️ No user after loading - redirecting to login");
                navigate("/login");
                return;
            }

            try {
                console.log("🔵 Fetching user profile for:", user.uid);
                const userDoc = await getDoc(doc(db, "users", user.uid));

                if (userDoc.exists()) {
                    const profile = userDoc.data();
                    console.log("✅ User Profile:", profile);
                    setUserProfile(profile);

                    // ✅ ตรวจสอบว่าเป็น organizer จริงไหม
                    if (profile.role !== "organizer") {
                        console.log("❌ Access denied - not an organizer");
                        alert("Access denied. This page is for organizers only!");
                        navigate("/home");
                    }
                } else {
                    console.log("❌ User profile not found");
                    navigate("/login");
                }
            } catch (err) {
                console.error("❌ Error fetching user profile:", err);
                navigate("/login");
            } finally {
                setProfileLoading(false);
            }
        };

        fetchUserProfile();
    }, [user, navigate]);

    // ✅ แก้ไข: Load events เฉพาะของตัวเอง
    useEffect(() => {
        if (user && userProfile?.role === "organizer") {
            loadEvents();
        }
    }, [user, userProfile]);

    useEffect(() => {
        filterEvents();
    }, [events, searchQuery, selectedCategory]);

    if (profileLoading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                fontSize: "1.5rem",
                color: "#666"
            }}>
                <div>⏳ Loading...</div>
            </div>
        );
    }

    // ✅ ถ้าไม่มี user หรือไม่ใช่ organizer (safeguard)
    if (!user || !userProfile || userProfile.role !== "organizer") {
        return null; // จะถูก redirect แล้วใน useEffect
    }

    // ✅ แก้ไข: ตรวจสอบ ownership ก่อนลบ
    const handleDeleteEvent = async (eventId) => {
        const event = events.find(e => e.id === eventId);

        // ✅ ตรวจสอบว่าเป็นเจ้าของ event จริงไหม
        if (event.organizerId !== user.uid) {
            alert("You can only delete your own events!");
            console.log("❌ Delete denied - not the owner");
            return;
        }

        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                console.log("🗑️ Deleting event:", eventId);
                await deleteDoc(doc(db, "events", eventId));
                setEvents(events.filter((event) => event.id !== eventId));
                setShowEventMenu(null);
                console.log("✅ Event deleted successfully");
                alert("Event deleted successfully!");
            } catch (err) {
                console.error("❌ Error deleting event:", err);
                alert("Failed to delete event");
            }
        }
    };

    const handleLogout = async () => {
        try {
            await logOut();
            navigate("/");
        } catch (err) {
            console.log(err.message);
        }
    };

    const handleProfileClick = () => {
        navigate("/profile");
    };

    const handleCategoryFilter = (category) => {
        setSelectedCategory(category === selectedCategory ? "" : category);
        setShowFilter(false);
    };

    const getTotalParticipants = () => {
        return events.reduce(
            (total, event) => total + (event.participants?.length || 0),
            0
        );
    };

    const getUpcomingEvents = () => {
        const today = new Date();
        return events.filter((event) => {
            if (!event.startDate) return false;
            const eventDate = event.startDate.toDate ? event.startDate.toDate() : new Date(event.startDate);
            return eventDate >= today;
        }).length;
    };

    const categoryOptions = [
        { value: "education", label: "Education" },
        { value: "health", label: "Health & Beauty" },
        { value: "environment", label: "Environment" },
        { value: "activity", label: "Activity" },
        { value: "technology", label: "Technology" },
        { value: "business", label: "Business" },
    ];

    const renderDashboard = () => (
        <div className="dashboard-view">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon stat-icon-primary">
                        <Calendar size={28} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{events.length}</div>
                        <div className="stat-label">Total Events</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon stat-icon-secondary">
                        <Calendar size={28} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{getUpcomingEvents()}</div>
                        <div className="stat-label">Upcoming Events</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon stat-icon-success">
                        <Users size={28} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">
                            {getTotalParticipants()}
                        </div>
                        <div className="stat-label">Total Participants</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon stat-icon-warning">
                        <BarChart3 size={28} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">
                            {events.length > 0
                                ? Math.round(
                                      getTotalParticipants() / events.length
                                  )
                                : 0}
                        </div>
                        <div className="stat-label">Avg. Participants</div>
                    </div>
                </div>
            </div>

            <div className="recent-events-section">
                <div className="section-header-org">
                    <h3>Recent Events</h3>
                    <button
                        onClick={() => navigate("/EventCreate")}
                        className="btn-create-event"
                    >
                        <Plus size={18} /> Create Event
                    </button>
                </div>
                {renderEventsList()}
            </div>
        </div>
    );

    const renderEventsList = () => {
        if (loading) {
            return <div className="loading-message">Loading events...</div>;
        }

        if (filteredEvents.length === 0) {
            return (
                <div className="empty-state">
                    <Calendar size={64} />
                    <h3>No events found</h3>
                    <p>Start by creating your first event</p>
                    <button
                        onClick={() => navigate("/EventCreate")}
                        className="btn-create-event"
                    >
                        <Plus size={18} /> Create Event
                    </button>
                </div>
            );
        }

        return (
            <div className="events-list">
                {filteredEvents.map((event) => (
                    <div key={event.id} className="event-list-item">
                        <div className="event-item-image">
                            {event.imageUrl ? (
                                <img src={event.imageUrl} alt={event.title} />
                            ) : (
                                <div className="event-placeholder">
                                    <Calendar size={32} />
                                </div>
                            )}
                        </div>

                        <div className="event-item-content">
                            <div className="event-item-header">
                                <div>
                                    <h4 className="event-item-title">
                                        {event.title}
                                    </h4>
                                    <div className="event-item-meta">
                                        <span className="event-category-badge">
                                            {event.category || "General"}
                                        </span>
                                        <span className="event-meta-text">
                                            {event.startDate && 
                                                new Date(event.startDate.toDate ? event.startDate.toDate() : event.startDate)
                                                    .toLocaleDateString('th-TH')}
                                        </span>
                                    </div>
                                    <div className="event-item-location">
                                        📍 {event.location || "TBA"}
                                    </div>
                                </div>

                                <div className="event-item-actions">
                                    <div className="event-participants-count">
                                        <Users size={16} />
                                        <span>
                                            {event.participants?.length || 0}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setShowEventMenu(
                                                showEventMenu === event.id
                                                    ? null
                                                    : event.id
                                            )
                                        }
                                        className="btn-menu"
                                    >
                                        <MoreVertical size={18} />
                                    </button>

                                    {showEventMenu === event.id && (
                                        <div className="event-menu-dropdown">
                                            <button
                                                onClick={() => {
                                                    navigate(
                                                        `/event/edit/${event.id}`
                                                    );
                                                    setShowEventMenu(null);
                                                }}
                                                className="menu-item"
                                            >
                                                <Edit size={16} /> Edit Event
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedEvent(event);
                                                    setShowEventMenu(null);
                                                    setActiveTab(
                                                        "participants"
                                                    );
                                                }}
                                                className="menu-item"
                                            >
                                                <Users size={16} /> View
                                                Participants
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedEventForReviews(event);
                                                    setShowEventMenu(null);
                                                    setActiveTab("reviews");
                                                }}
                                                className="menu-item"
                                            >
                                                <Star size={16} /> View Reviews 
                                                {event.reviews?.length > 0 && ` (${event.reviews.length})`}
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteEvent(event.id)
                                                }
                                                className="menu-item delete"
                                            >
                                                <Trash2 size={16} /> Delete
                                                Event
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }; // ✅ จบ renderEventsList ตรงนี้

    // ✅ เพิ่ม renderReviews() แยกออกมาตรงนี้ (ภายนอก renderEventsList)
    const renderReviews = () => {
        const event = selectedEventForReviews || filteredEvents[0];

        if (!event) {
            return (
                <div className="empty-state">
                    <Star size={64} />
                    <h3>No event selected</h3>
                    <p>Select an event to view its reviews</p>
                </div>
            );
        }

        const reviews = event.reviews || [];

        return (
            <div className="reviews-view">
                <div className="reviews-header">
                    <div>
                        <h3>{event.title}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                            <p className="reviews-count">
                                {reviews.length} reviews
                            </p>
                            {event.averageRating && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#fff3cd',
                                    borderRadius: '8px'
                                }}>
                                    <span style={{ fontSize: '1.5rem' }}>⭐</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                                        {event.averageRating.toFixed(1)}
                                    </span>
                                    <span style={{ color: '#666' }}>/5</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => setActiveTab('events')}
                        className="btn-secondary"
                    >
                        Back to Events
                    </button>
                </div>

                {reviews.length === 0 ? (
                    <div className="empty-state">
                        <Star size={64} />
                        <h3>No reviews yet</h3>
                        <p>Reviews will appear here once participants submit them</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        padding: '1rem'
                    }}>
                        {reviews
                            .sort((a, b) => {
                                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
                                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
                                return dateB - dateA;
                            })
                            .map((review, index) => (
                                <div 
                                    key={index}
                                    style={{
                                        padding: '1.5rem',
                                        backgroundColor: 'white',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'start',
                                        marginBottom: '0.75rem'
                                    }}>
                                        <div>
                                            <div style={{
                                                fontWeight: '600',
                                                color: '#2d3748',
                                                marginBottom: '0.25rem'
                                            }}>
                                                {review.userName}
                                            </div>
                                            <div style={{
                                                fontSize: '0.85rem',
                                                color: '#999'
                                            }}>
                                                {review.userEmail}
                                            </div>
                                            <div style={{
                                                fontSize: '0.85rem',
                                                color: '#999',
                                                marginTop: '0.25rem'
                                            }}>
                                                {review.createdAt?.toDate 
                                                    ? review.createdAt.toDate().toLocaleDateString('th-TH', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })
                                                    : 'Recent'}
                                            </div>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            gap: '0.25rem'
                                        }}>
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} style={{
                                                    color: i < review.rating ? '#ffd700' : '#e0e0e0',
                                                    fontSize: '1.25rem'
                                                }}>
                                                    ⭐
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <p style={{
                                        color: '#666',
                                        lineHeight: '1.6',
                                        margin: 0,
                                        whiteSpace: 'pre-wrap'
                                    }}>
                                        {review.comment}
                                    </p>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        );
    }; 

    const renderParticipants = () => {
        const event = selectedEvent || filteredEvents[0];

        if (!event) {
            return (
                <div className="empty-state">
                    <Users size={64} />
                    <h3>No event selected</h3>
                    <p>Select an event to view its participants</p>
                </div>
            );
        }

        const participants = event.participants || [];

        return (
            <div className="participants-view">
                <div className="participants-header">
                    <div>
                        <h3>{event.title}</h3>
                        <p className="participants-count">
                            {participants.length} registered participants
                        </p>
                    </div>
                    <button
                        onClick={() => setActiveTab("events")}
                        className="btn-secondary"
                    >
                        Back to Events
                    </button>
                </div>

                {participants.length === 0 ? (
                    <div className="empty-state">
                        <Users size={64} />
                        <h3>No participants yet</h3>
                        <p>Participants will appear here once they register</p>
                    </div>
                ) : (
                    <div className="participants-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Registration Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {participants.map((participant, index) => (
                                    <tr key={index}>
                                        <td>{participant.name}</td>
                                        <td>{participant.email}</td>
                                        <td>{participant.phone || "N/A"}</td>
                                        <td>
                                            {participant.registrationDate ||
                                                "N/A"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="organizer-container">
            {/* Sidebar */}
            <div className="organizer-sidebar">
                <div className="logo">
                    <div className="logo-icon">
                        <Calendar />
                    </div>
                    <div className="logo-text">ORGANIZER</div>
                </div>
                {/* ✅ แสดงชื่อ organizer */}
                {userProfile && (
                    <div style={{ 
                        padding: "1rem",
                        borderBottom: "1px solid #e0e0e0",
                        marginBottom: "1rem",
                        backgroundColor: "#f8f9fa"
                    }}>
                        <div style={{ 
                            fontWeight: "600", 
                            marginBottom: "0.25rem",
                            color: "#2d3748"
                        }}>
                            {userProfile.displayName}
                        </div>
                        <div style={{ 
                            fontSize: "0.85rem", 
                            color: "#666"
                        }}>
                            {userProfile.email}
                        </div>
                    </div>
                )}
                <div className="overview-title">MENU</div>

                <button
                    className={`nav-item ${
                        activeTab === "dashboard" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("dashboard")}
                >
                    <Home /> Dashboard
                </button>
                <button
                    className={`nav-item ${
                        activeTab === "events" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("events")}
                >
                    <Calendar /> My Events
                </button>
                <button
                    className={`nav-item ${
                        activeTab === "participants" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("participants")}
                >
                    <Users /> Participants
                </button>
                <button
                    className={`nav-item ${
                        activeTab === "notification" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("notification")}
                >
                    <Bell /> Notifications
                </button>
                {/* ✅ เพิ่มส่วนนี้ */}
                <button
                    className={`nav-item ${
                        activeTab === "reviews" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("reviews")}
                >
                    <Star /> Reviews
                </button>
            </div>

            {/* Main Content */}
            <div className="organizer-main-content">
                <div className="organizer-header">
                    <div className="header-left">
                        <span className="header-title">
                            Event Organizer Dashboard
                        </span>
                    </div>
                    <div className="header-right">
                        <button className="logout-btn" onClick={handleLogout}>
                            Log out
                        </button>
                        <button
                            className="profile-btn"
                            onClick={handleProfileClick}
                        >
                            <User className="profile-icon" />
                        </button>
                        <button className="bell-btn">
                            <Bell className="bell-icon" />
                        </button>
                    </div>
                </div>

                {/* Search and Filter - Only show in events tab */}
                {activeTab === "events" && (
                    <div className="search-filter-container">
                        <div className="search-box-org">
                            <Search className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            className="filter-btn-org"
                            onClick={() => setShowFilter(!showFilter)}
                        >
                            <Filter size={18} />
                            Filter
                        </button>
                        {showFilter && (
                            <div className="filter-dropdown-org">
                                <div className="filter-header">
                                    Filter by Category
                                </div>
                                {categoryOptions.map((category) => (
                                    <div
                                        key={category.value}
                                        onClick={() =>
                                            handleCategoryFilter(category.value)
                                        }
                                        className={`filter-option ${
                                            selectedCategory === category.value
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        {category.label}
                                        {selectedCategory === category.value &&
                                            " ✓"}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Content Area */}
                <div className="content-area">
                    {activeTab === "dashboard" && renderDashboard()}
                    {activeTab === "events" && (
                        <div className="events-view">
                            <div className="section-header-org">
                                <h3>My Events ({filteredEvents.length})</h3>
                                <button
                                    onClick={() => navigate("/event/create")}
                                    className="btn-create-event"
                                >
                                    <Plus size={18} /> Create New Event
                                </button>
                            </div>
                            {renderEventsList()}
                        </div>
                    )}
                    {activeTab === "participants" && renderParticipants()}
                    {activeTab === "notification" && (
                        <div className="empty-state">
                            <Bell size={64} />
                            <h3>No notifications</h3>
                            <p>You're all caught up!</p>
                        </div>
                    )}
                    {activeTab === "reviews" && renderReviews()}
                </div>
            </div>
        </div>
    );
}

export default OrganizerHome;
