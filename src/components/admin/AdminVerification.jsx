import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    collection,
    getDocs,
    query,
    where,
    updateDoc,
    doc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import "../../style/style-admin/AdminVerification.css";

function AdminVerification() {
    const [activeView, setActiveView] = useState("verification");
    const [events, setEvents] = useState([]);
    const [pendingEvents, setPendingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adminName, setAdminName] = useState("Admin");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [dateFilter, setDateFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            const currentUser = auth.currentUser;
            if (currentUser) {
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("uid", "==", currentUser.uid));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const userData = querySnapshot.docs[0].data();
                    setAdminName(
                        userData.displayName ||
                            `${userData.firstName} ${userData.lastName}` ||
                            "Admin"
                    );
                }
            }

            const eventsSnapshot = await getDocs(collection(db, "events"));
            const eventsData = eventsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setEvents(eventsData);

            // Filter pending events (events waiting for verification)
            const pending = eventsData.filter(
                (event) => event.status === "pending" || !event.isVerified
            );
            setPendingEvents(pending);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEvent = async (eventId, approve) => {
        try {
            const eventDocRef = doc(db, "events", eventId);
            await updateDoc(eventDocRef, {
                isVerified: approve,
                status: approve ? "upcoming" : "rejected",
                verifiedAt: new Date(),
            });

            await loadData();
            alert(
                approve
                    ? "Event verified successfully!"
                    : "Event rejected."
            );
        } catch (error) {
            console.error("Error verifying event:", error);
            alert("Failed to update event status.");
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/admin/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    // Filter events based on selections
    const getFilteredEvents = () => {
        let filtered = [...pendingEvents];

        // Apply category filter
        if (categoryFilter !== "all") {
            filtered = filtered.filter((e) => e.category === categoryFilter);
        }

        // Apply date filter
        if (dateFilter !== "all") {
            const now = new Date();
            filtered = filtered.filter((e) => {
                // Check if requestedAt exists
                if (!e.requestedAt) return false;
                
                let requestedAt;
                try {
                    requestedAt = e.requestedAt?.toDate
                        ? e.requestedAt.toDate()
                        : new Date(e.requestedAt);
                    
                    // Check if date is valid
                    if (isNaN(requestedAt.getTime())) return false;
                } catch (error) {
                    console.error("Invalid date format:", e.requestedAt);
                    return false;
                }
                
                if (dateFilter === "today") {
                    return requestedAt.toDateString() === now.toDateString();
                } else if (dateFilter === "this-week") {
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    return requestedAt >= sevenDaysAgo && requestedAt <= now;

                } else if (dateFilter === "this-month") {
                    return (
                        requestedAt.getMonth() === now.getMonth() &&
                        requestedAt.getFullYear() === now.getFullYear()
                    );
                }
                return true;
            });
        }

        return filtered;
    };

    const filteredEvents = getFilteredEvents();

    if (loading) {
        return (
            <div className="admin-verification">
                <div className="loading-screen">
                    <div className="spinner"></div>
                    <p>Loading verification requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-verification">
            {/* Header */}
            <div className="admin-header">
                <div className="admin-header-left">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        ← Back
                    </button>
                    <span className="header-divider">|</span>
                    <span className="header-location">Home</span>
                </div>
                <div className="admin-header-center">
                    <h1>Student event planner</h1>
                </div>
                <div className="admin-header-right">
                    <button onClick={handleLogout} className="btn-logout">
                        log out
                    </button>
                    <div className="admin-avatar">{adminName[0]}</div>
                    <button className="btn-notification">🔔</button>
                </div>
            </div>

            {/* Sidebar */}
            <div
                className={`admin-sidebar ${
                    sidebarCollapsed ? "collapsed" : ""
                }`}
            >
                <button
                    className="sidebar-toggle"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                >
                    {sidebarCollapsed ? "→" : "←"}
                </button>

                {!sidebarCollapsed && (
                    <>
                        <div className="sidebar-section">
                            <div className="sidebar-title">MENU</div>
                            <button
                                className="sidebar-btn"
                                onClick={() => navigate("/admin/dashboard")}
                            >
                                📊 Dashboard
                            </button>
                        </div>
                        <div className="sidebar-section">
                            <div className="sidebar-title">OTHERS</div>
                            <button className="sidebar-btn">⚙️ Settings</button>
                            <button
                                className={`sidebar-btn ${
                                    activeView === "verification"
                                        ? "active"
                                        : ""
                                }`}
                            >
                                🧾 verification
                                {filteredEvents.length > 0 && (
                                    <span className="badge">
                                        {filteredEvents.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Main Content */}
            <div
                className={`admin-main-content ${
                    sidebarCollapsed ? "expanded" : ""
                }`}
            >
                <div className="verification-container">
                    <h2 className="page-title">Event Verification & Approval</h2>

                    {/* Filters */}
                    <div className="verification-filters">
                        <div className="filter-group">
                            <label>📅 Date:</label>
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All Dates</option>
                                <option value="today">Today</option>
                                <option value="this-week">This Week</option>
                                <option value="this-month">This Month</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>📁 Category:</label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All Categories</option>
                                <option value="education">Education</option>
                                <option value="technology">Technology</option>
                                <option value="business">Business</option>
                                <option value="sports">Sports</option>
                                <option value="entertainment">Entertainment</option>
                                <option value="health">Health</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    {filteredEvents.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">✓</div>
                            <h3>No Pending Verifications</h3>
                            <p>All events have been verified</p>
                        </div>
                    ) : (
                        <div className="verification-table">
                            {/* Table Header */}
                            <div className="table-header">
                                <div className="header-cell">Event ID</div>
                                <div className="header-cell">Event name</div>
                                <div className="header-cell">Category</div>
                                <div className="header-cell">Date</div>
                                <div className="header-cell">Action</div>
                            </div>

                            {/* Table Body */}
                            <div className="table-body">
                                {filteredEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="table-row"
                                    >
                                        <div className="table-cell">
                                            {event.eventId || event.id.slice(0, 4)}
                                        </div>
                                        <div className="table-cell">
                                            {event.title || event.eventName}
                                        </div>
                                        <div className="table-cell">
                                            {event.category}
                                        </div>
                                        <div className="table-cell">
                                            {event.requestedAt
                                                    ? (event.requestedAt.toDate
                                                    ? event.requestedAt.toDate().toLocaleDateString()
                                                : new Date(event.requestedAt).toLocaleDateString()
                                                )
                                            : "No Date"
                                            }
                                        </div>

                                        <div className="table-cell action-cell">
                                            <button
                                                className="btn-verify"
                                                onClick={() =>
                                                    handleVerifyEvent(
                                                        event.id,
                                                        true
                                                    )
                                                }
                                            >
                                                verify
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminVerification;