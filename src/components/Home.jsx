import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import React, { useState, useEffect } from "react";
import {
    Home as HomeIcon,
    Search,
    Bell,
    User,
    Inbox,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    Filter,
} from "lucide-react";
import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    orderBy,
    where,
} from "firebase/firestore";
import { db } from "../firebase";

function PageHome() {
    const [showFilter, setShowFilter] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const { logOut, user } = useUserAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("dashboard");
    // State สำหรับ events จาก database
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [myRegistrations, setMyRegistrations] = useState([]);

    // ✅ ดึง User Profile จาก Firestore
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user) return;
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    setUserProfile(userDoc.data());
                    console.log("User Profile:", userDoc.data());
                }
            } catch (err) {
                console.error("Error fetching user profile:", err);
            }
        };
        fetchUserProfile();
    }, [user]);

    // ดึงข้อมูล events จาก Firestore
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const eventsRef = collection(db, "events");
                // ✅ ใช้แค่ orderBy อย่างเดียว
                const q = query(eventsRef, orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const eventsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                console.log("✅ Events loaded:", eventsData.length);
                setEvents(eventsData);
                setError(null);
            } catch (err) {
                console.error("❌ Error fetching events:", err);
                // Fallback กรณีไม่มี index หรือ error อื่นๆ
                setError(`ไม่สามารถโหลดข้อมูล events ได้: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // ดึงข้อมูล Registrations (สำหรับ Students)
    useEffect(() => {
        const loadMyRegistrations = async () => {
            if (!user || !userProfile || loading) {
                return;
            }
            if (userProfile.role !== "student") {
                setMyRegistrations([]);
                return;
            }
            try {
                console.log("🔵Loading registrations for user:", user.uid);
                const registeredEvents = [];
                events.forEach((event) => {
                    if (
                        event.participants &&
                        Array.isArray(event.participants)
                    ) {
                        const userParticipant = event.participants.find(
                            (p) => p.userId === user.uid
                        );
                        if (userParticipant) {
                            registeredEvents.push({
                                id: event.id,
                                eventId: event.id,
                                eventTitle: event.title,
                                eventDate: event.startDate || event.date,
                                eventLocation: event.location,
                                eventCategory: event.category,
                                eventImage: event.imageUrl,
                                registrationDate:
                                    userParticipant.registrationDate,
                                checkedIn: userParticipant.checkedIn || false,
                                status: userParticipant.status || "confirmed",
                            });
                        }
                    }
                });
                registeredEvents.sort((a, b) => {
                    const dateA = new Date(a.registrationDate || 0);
                    const dateB = new Date(b.registrationDate || 0);
                    return dateB - dateA;
                });
                console.log("✅ Registered events:", registeredEvents);
                setMyRegistrations(registeredEvents);
            } catch (err) {
                console.error("❌ Error loading registrations:", err);
            }
        };
        loadMyRegistrations();
    }, [user, userProfile, events, loading]);

    const handleLogout = async () => {
        try {
            await logOut();
            navigate("/");
        } catch (err) {
            console.log(err.message);
        }
    };

    const handleEventClick = (eventId) => {
        navigate(`/event/${eventId}`);
    };

    // ✅ ฟังก์ชันสำคัญ: ไปหน้า EventConfirmed
    const handleRegisteredEventClick = (eventId) => {
        if (!eventId) return;
        navigate(`/event-confirmed/${eventId}`);
    };

    const handleProfileClick = () => {
        navigate("/profile");
    };

    const handleNotificationClick = () => {
        navigate("/notification");
    };

    const filteredEvents = events.filter((event) => {
        const matchesSearch =
            event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.category?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "" || event.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleCategoryFilter = (category) => {
        setSelectedCategory(category === selectedCategory ? "" : category);
        setShowFilter(false);
    };

    const categories = [
        ...new Set(events.map((event) => event.category).filter(Boolean)),
    ];

    return (
        <div className="container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="logo">
                    <div className="logo-icon">
                        <Calendar />
                    </div>
                    <div className="logo-text">PLANNER</div>
                </div>
                <div className="overview-title">OVERVIEW</div>
                <button
                    className={`nav-item ${
                        activeTab === "dashboard" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("dashboard")}
                >
                    <HomeIcon /> Dashboard
                </button>
                <button
                    className={`nav-item ${
                        activeTab === "inbox" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("inbox")}
                >
                    <Inbox /> Inbox
                </button>
                <button
                    className={`nav-item ${
                        activeTab === "notification" ? "active" : ""
                    }`}
                    onClick={handleNotificationClick}
                >
                    <Bell /> Notification
                </button>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="header">
                    <div className="header-left">
                        <button className="back-btn">
                            <ArrowLeft /> Back
                        </button>
                        <span className="header-title">
                            Student event planner
                        </span>
                    </div>
                    <div className="header-right">
                        {userProfile && (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    marginRight: "1rem",
                                }}
                            >
                                <span
                                    style={{
                                        fontWeight: "600",
                                        color: "#2d3748",
                                    }}
                                >
                                    {userProfile.displayName}
                                </span>
                                <span
                                    style={{
                                        fontSize: "0.85rem",
                                        padding: "0.25rem 0.5rem",
                                        backgroundColor:
                                            userProfile.role === "organizer"
                                                ? "#e3f2fd"
                                                : "#f3e5f5",
                                        color:
                                            userProfile.role === "organizer"
                                                ? "#1976d2"
                                                : "#7b1fa2",
                                        borderRadius: "4px",
                                        fontWeight: "500",
                                    }}
                                >
                                    {userProfile.role === "organizer"
                                        ? "🎯 Organizer"
                                        : "👤 Student"}
                                </span>
                            </div>
                        )}
                        <button className="logout-btn" onClick={handleLogout}>
                            Log out
                        </button>
                        <button
                            className="profile-btn"
                            onClick={handleProfileClick}
                        >
                            <User className="profile-icon" />
                        </button>
                        <button
                            className="bell-btn"
                            onClick={handleNotificationClick}
                        >
                            <Bell className="bell-icon" />
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div
                    className="search-container"
                    style={{ position: "relative" }}
                >
                    <div className="search-box">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search your course here..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        className="filter-btn"
                        onClick={() => setShowFilter(!showFilter)}
                    >
                        <Filter className="w-2 h-2" />
                    </button>
                    {showFilter && (
                        <div className="filter-dropdown">
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <div
                                        key={category}
                                        onClick={() =>
                                            handleCategoryFilter(category)
                                        }
                                        style={{
                                            cursor: "pointer",
                                            padding: "0.5rem",
                                            fontWeight:
                                                selectedCategory === category
                                                    ? "bold"
                                                    : "normal",
                                            backgroundColor:
                                                selectedCategory === category
                                                    ? "#f0f0f0"
                                                    : "transparent",
                                        }}
                                    >
                                        {category}{" "}
                                        {selectedCategory === category && "✓"}
                                    </div>
                                ))
                            ) : (
                                <div
                                    style={{ padding: "0.5rem", color: "#999" }}
                                >
                                    No categories available
                                </div>
                            )}
                            {selectedCategory && (
                                <div
                                    onClick={() => setSelectedCategory("")}
                                    style={{
                                        cursor: "pointer",
                                        padding: "0.5rem",
                                        color: "#007bff",
                                        borderTop: "1px solid #e0e0e0",
                                        marginTop: "0.5rem",
                                    }}
                                >
                                    Clear filter
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="content">
                    {/* ✅ ปุ่ม Create Event (สำหรับ Organizer) */}
                    {userProfile?.role === "organizer" && (
                        <div
                            style={{
                                marginBottom: "1.5rem",
                                display: "flex",
                                justifyContent: "flex-end",
                            }}
                        >
                            <button
                                onClick={() => navigate("/organizerHome")}
                                style={{
                                    padding: "0.75rem 1.5rem",
                                    background:
                                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontSize: "1rem",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    boxShadow:
                                        "0 4px 12px rgba(102, 126, 234, 0.3)",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                📊 Go to Organizer Dashboard
                            </button>
                        </div>
                    )}

                    {/* ✅ My Registered Events (สำหรับ Student) */}
                    {userProfile?.role === "student" && (
                        <div
                            style={{
                                marginBottom: "2rem",
                                padding: "1.5rem",
                                background:
                                    "linear-gradient(135deg, #f8f9ff 0%, #fff5f8 100%)",
                                borderRadius: "12px",
                                border: "2px solid #667eea",
                            }}
                        >
                            <h3
                                style={{
                                    margin: "0 0 1rem 0",
                                    fontSize: "1.25rem",
                                    fontWeight: "700",
                                    color: "#2d3748",
                                }}
                            >
                                📅 My Registered Events{" "}
                                {myRegistrations.length > 0 &&
                                    `(${myRegistrations.length})`}
                            </h3>
                            {myRegistrations.length === 0 ? (
                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "2rem",
                                        color: "#666",
                                    }}
                                >
                                    <p>You haven't registered for any events yet</p>
                                    <p
                                        style={{
                                            fontSize: "0.875rem",
                                            color: "#999",
                                        }}
                                    >
                                        Browse events below and register to see
                                        them here!
                                    </p>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "repeat(auto-fill, minmax(250px, 1fr))",
                                        gap: "1rem",
                                    }}
                                >
                                    {myRegistrations.map((registration) => (
                                        <div
                                            key={registration.id}
                                            // ✅ คลิกแล้วไปหน้า EventConfirmed
                                            onClick={() =>
                                                handleRegisteredEventClick(
                                                    registration.eventId
                                                )
                                            }
                                            style={{
                                                background: "white",
                                                borderRadius: "8px",
                                                padding: "1rem",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                                boxShadow:
                                                    "0 2px 8px rgba(0, 0, 0, 0.1)",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform =
                                                    "translateY(-4px)";
                                                e.currentTarget.style.boxShadow =
                                                    "0 4px 16px rgba(102, 126, 234, 0.3)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform =
                                                    "translateY(0)";
                                                e.currentTarget.style.boxShadow =
                                                    "0 2px 8px rgba(0, 0, 0, 0.1)";
                                            }}
                                        >
                                            <h4
                                                style={{
                                                    fontSize: "1rem",
                                                    fontWeight: "600",
                                                    color: "#2d3748",
                                                    margin: "0 0 0.5rem 0",
                                                }}
                                            >
                                                {registration.eventTitle}
                                            </h4>
                                            <p
                                                style={{
                                                    fontSize: "0.85rem",
                                                    color: "#666",
                                                    margin: "0 0 0.5rem 0",
                                                }}
                                            >
                                                🗓️{" "}
                                                {registration.eventDate &&
                                                    (registration.eventDate
                                                        .toDate
                                                        ? registration.eventDate
                                                              .toDate()
                                                              .toLocaleDateString(
                                                                  "th-TH",
                                                                  {
                                                                      year: "numeric",
                                                                      month: "long",
                                                                      day: "numeric",
                                                                  }
                                                              )
                                                        : typeof registration.eventDate ===
                                                          "string"
                                                        ? new Date(
                                                              registration.eventDate
                                                          ).toLocaleDateString(
                                                              "th-TH",
                                                              {
                                                                  year: "numeric",
                                                                  month: "long",
                                                                  day: "numeric",
                                                              }
                                                          )
                                                        : "TBA")}
                                            </p>
                                            <span
                                                style={{
                                                    display: "inline-block",
                                                    padding: "0.25rem 0.5rem",
                                                    borderRadius: "4px",
                                                    fontSize: "0.85rem",
                                                    fontWeight: "500",
                                                    backgroundColor:
                                                        registration.checkedIn
                                                            ? "#4caf50"
                                                            : "#ff9800",
                                                    color: "white",
                                                }}
                                            >
                                                {registration.checkedIn
                                                    ? "✅ Checked In"
                                                    : "⏳ Registered"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="banner">
                        <h2>Don't miss a single event!</h2>
                        <p>Join more events!</p>
                        <button className="banner-btn">
                            Join Event Now!{" "}
                            <span className="arrow-circle">→</span>
                        </button>
                    </div>

                    <div className="section-header">
                        <h3>Summary For You</h3>
                        <div className="nav-arrows">
                            <button className="arrow-btn">
                                <ChevronLeft />
                            </button>
                            <button className="arrow-btn">
                                <ChevronRight />
                            </button>
                        </div>
                    </div>

                    {loading && (
                        <div style={{ textAlign: "center", padding: "3rem" }}>
                            <p>กำลังโหลดข้อมูล...</p>
                        </div>
                    )}

                    {error && (
                        <div style={{ textAlign: "center", padding: "3rem", color: "red" }}>
                            <p>{error}</p>
                        </div>
                    )}

                    {!loading && (searchQuery || selectedCategory) && (
                        <div style={{ marginBottom: "1rem", color: "#666" }}>
                            Found {filteredEvents.length} event(s)
                            {searchQuery && <> matching "{searchQuery}"</>}
                            {selectedCategory && <> in {selectedCategory}</>}
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory("");
                                }}
                                style={{
                                    marginLeft: "1rem",
                                    color: "#007bff",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                }}
                            >
                                Clear filters
                            </button>
                        </div>
                    )}

                    {!loading && !error && (
                        filteredEvents.length > 0 ? (
                            <div className="events-grid">
                                {filteredEvents.map((event) => (
                                    <article
                                        key={event.id}
                                        className="event-card"
                                        onClick={() => handleEventClick(event.id)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <div
                                            className="event-image"
                                            style={{
                                                backgroundImage: `url(${
                                                    event.imageUrl || "/duck.jpg"
                                                })`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                            }}
                                        />
                                        <div className="event-content">
                                            <span className="event-tag">
                                                {event.category}
                                            </span>
                                            <div className="event-title">
                                                {event.title}
                                            </div>
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{
                                                        width: `${
                                                            ((event.currentParticipants || 0) /
                                                                event.capacity) *
                                                            100
                                                        }%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    marginTop: "0.5rem",
                                                    paddingTop: "0.5rem",
                                                    borderTop: "1px solid #e0e0e0",
                                                    fontSize: "0.85rem",
                                                    color: "#666",
                                                }}
                                            >
                                                <div>📍 {event.location}</div>
                                                <div>
                                                    👥 {event.currentParticipants || 0}
                                                    /{event.capacity}
                                                </div>
                                            </div>
                                            <div className="event-author">
                                                <div className="author-avatar"></div>
                                                <div className="author-info">
                                                    <div className="author-name">
                                                        {event.organizerName || "Unknown"}
                                                    </div>
                                                    <div className="author-role">
                                                        Organizer
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: "center", padding: "3rem" }}>
                                <h3>No events found</h3>
                                <p>Try adjusting your search or filters</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default PageHome;