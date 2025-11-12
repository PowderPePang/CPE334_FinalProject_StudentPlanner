import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    query,
    where,
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
    const { logOut, user } = useUserAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadEvents();
    }, []);

    useEffect(() => {
        filterEvents();
    }, [events, searchQuery, selectedCategory]);

    const loadEvents = async () => {
        try {
            setLoading(true);
            const eventsRef = collection(db, "events");
            const q = query(eventsRef);
            const querySnapshot = await getDocs(q);

            const eventsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setEvents(eventsData);
        } catch (err) {
            console.error("Error loading events:", err);
        } finally {
            setLoading(false);
        }
    };

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

    const handleDeleteEvent = async (eventId) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await deleteDoc(doc(db, "events", eventId));
                setEvents(events.filter((event) => event.id !== eventId));
                setShowEventMenu(null);
                alert("Event deleted successfully!");
            } catch (err) {
                console.error("Error deleting event:", err);
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
        return events.filter((event) => new Date(event.date) >= today).length;
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
                                            {event.date} • {event.startTime} -{" "}
                                            {event.endTime}
                                        </span>
                                    </div>
                                    <div className="event-item-location">
                                        📍 {event.location}{" "}
                                        {event.floor && `- ${event.floor}`}
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
                        <button className="profile-btn">
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
                </div>
            </div>
        </div>
    );
}

export default OrganizerHome;
