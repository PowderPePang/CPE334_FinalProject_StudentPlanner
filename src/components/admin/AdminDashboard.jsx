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
import "../../style/style-admin/AdminDashboard.css";

function AdminDashboard() {
    const [activeView, setActiveView] = useState("dashboard");
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [pendingEvents, setPendingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adminName, setAdminName] = useState("Admin");
    const [timeframe, setTimeframe] = useState("all-time");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [locationFilter, setLocationFilter] = useState("all");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [hoveredSegment, setHoveredSegment] = useState(null);
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

            const usersSnapshot = await getDocs(collection(db, "users"));
            const usersData = usersSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUsers(usersData);

            const pending = usersData.filter(
                (user) => user.role === "organizer" && !user.isActive
            );
            setPendingUsers(pending);

            const eventsSnapshot = await getDocs(collection(db, "events"));
            const eventsData = eventsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setEvents(eventsData);

            // Count pending events for badge
            const pendingEventsCount = eventsData.filter(
                (event) => event.status === "pending" || !event.isVerified
            );
            setPendingEvents(pendingEventsCount);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyUser = async (userId, approve) => {
        try {
            const userDocRef = doc(db, "users", userId);
            await updateDoc(userDocRef, {
                isActive: approve,
                verifiedAt: new Date(),
            });

            await loadData();
            alert(approve ? "User verified successfully!" : "User rejected.");
        } catch (error) {
            console.error("Error verifying user:", error);
            alert("Failed to update user status.");
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

    // Filter data based on selections
    const getFilteredData = () => {
        let filteredEvents = [...events];
        let filteredUsers = [...users];

        // Apply timeframe filter
        const now = new Date();
        if (timeframe === "this-week") {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filteredUsers = filteredUsers.filter((u) => {
                const createdDate = u.createdAt?.toDate
                    ? u.createdAt.toDate()
                    : new Date(u.createdAt);
                return createdDate >= weekAgo;
            });
            filteredEvents = filteredEvents.filter((e) => {
                const createdDate = e.createdAt?.toDate
                    ? e.createdAt.toDate()
                    : new Date(e.createdAt);
                return createdDate >= weekAgo;
            });
        } else if (timeframe === "this-month") {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            filteredUsers = filteredUsers.filter((u) => {
                const createdDate = u.createdAt?.toDate
                    ? u.createdAt.toDate()
                    : new Date(u.createdAt);
                return createdDate >= monthAgo;
            });
            filteredEvents = filteredEvents.filter((e) => {
                const createdDate = e.createdAt?.toDate
                    ? e.createdAt.toDate()
                    : new Date(e.createdAt);
                return createdDate >= monthAgo;
            });
        }

        // Apply category filter
        if (categoryFilter !== "all") {
            filteredEvents = filteredEvents.filter(
                (e) => e.category === categoryFilter
            );
        }

        // Apply location filter
        if (locationFilter !== "all") {
            filteredEvents = filteredEvents.filter(
                (e) => e.building === locationFilter
            );
        }

        return { filteredUsers, filteredEvents };
    };

    // Analytics calculations with filtering
    const getUserGrowthData = () => {
        const { filteredUsers } = getFilteredData();
        const last6Days = [];
        const lastWeek = [];
        const today = new Date();

        for (let i = 11; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split("T")[0];

            const usersOnDay = filteredUsers.filter((u) => {
                const createdDate = u.createdAt?.toDate
                    ? u.createdAt.toDate().toISOString().split("T")[0]
                    : "";
                return createdDate === dateStr;
            }).length;

            if (i < 6) {
                last6Days.push({ day: i + 1, count: usersOnDay });
            }
            lastWeek.push({
                day: i + 1,
                count: usersOnDay,
            });
        }

        return { last6Days, lastWeek };
    };

    const getEventStatusData = () => {
        const { filteredEvents } = getFilteredData();
        const total = filteredEvents.length || 1;

        const completed = filteredEvents.filter(
            (e) => e.status === "completed"
        ).length;
        const ongoing = filteredEvents.filter(
            (e) => e.status === "ongoing"
        ).length;
        const upcoming = filteredEvents.filter(
            (e) => e.status === "upcoming"
        ).length;

        return {
            done: Math.round((completed / total) * 100),
            goingOn: Math.round((ongoing / total) * 100),
            planning: Math.round((upcoming / total) * 100),
            total: total,
        };
    };

    const getIssueReportData = () => {
        // Mock data - replace with real data from your system
        return {
            registrationError: 55,
            qrCheckIn: 85,
            eventNotUpToDate: 60,
        };
    };

    const getTopRatedEvents = () => {
        const { filteredEvents } = getFilteredData();
        return filteredEvents
            .filter((e) => e.rating)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 4);
    };

    const renderDashboardView = () => {
        const { filteredUsers, filteredEvents } = getFilteredData();
        const totalUsers = filteredUsers.length;
        const totalEvents = filteredEvents.length;
        const activeOrganizers = filteredUsers.filter(
            (u) => u.role === "organizer" && u.isActive
        ).length;
        const totalStudents = filteredUsers.filter(
            (u) => u.role === "student"
        ).length;
        const { last6Days, lastWeek } = getUserGrowthData();
        const eventStatus = getEventStatusData();
        const issues = getIssueReportData();
        const topEvents = getTopRatedEvents();

        const lastWeekGrowth =
            lastWeek.reduce((sum, day) => sum + day.count, 0) || 1;
        const last6DaysGrowth = last6Days.reduce(
            (sum, day) => sum + day.count,
            0
        );
        const growthPercent = (
            (last6DaysGrowth / lastWeekGrowth) *
            100
        ).toFixed(1);

        const maxCount = Math.max(
            ...lastWeek.map((d) => d.count),
            ...last6Days.map((d) => d.count),
            1
        );

        // Calculate donut chart segments
        const calculateDonutSegments = () => {
            const done = eventStatus.done;
            const goingOn = eventStatus.goingOn;
            const planning = eventStatus.planning;

            const circumference = 251.2;
            const doneLength = (done / 100) * circumference;
            const goingOnLength = (goingOn / 100) * circumference;
            const planningLength = (planning / 100) * circumference;

            return { doneLength, goingOnLength, planningLength, circumference };
        };

        const { doneLength, goingOnLength, planningLength, circumference } =
            calculateDonutSegments();

        return (
            <div className="dashboard-view-enhanced">
                {/* Filters */}
                <div className="dashboard-filters">
                    <div className="filter-group">
                        <label>Timeframe:</label>
                        <select
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value)}
                        >
                            <option value="all-time">All-time</option>
                            <option value="this-month">This Month</option>
                            <option value="this-week">This Week</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Category:</label>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="education">Education</option>
                            <option value="technology">Technology</option>
                            <option value="business">Business</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Location:</label>
                        <select
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="CPE Building">CPE Building</option>
                            <option value="N16 Building">N16 Building</option>
                        </select>
                    </div>
                </div>

                <div className="analytics-grid">
                    {/* User Management Summary */}
                    <div className="analytics-card large">
                        <div className="card-header">
                            <div>
                                <h3>User Management Summary</h3>
                                <div className="growth-indicator">
                                    <span className="growth-up">
                                        ↑ {growthPercent}%
                                    </span>
                                    <span className="growth-text">
                                        vs last week
                                    </span>
                                </div>
                                <p className="date-range">
                                    Start from 1-12 Dec, 2020
                                </p>
                            </div>
                            <button className="view-report-btn">
                                View Report
                            </button>
                        </div>

                        <div className="chart-container">
                            <div className="bar-chart">
                                {lastWeek.map((day, index) => (
                                    <div key={index} className="bar-group">
                                        <div className="bar-wrapper">
                                            <div
                                                className="bar bar-last-week"
                                                style={{
                                                    height: `${
                                                        (day.count / maxCount) *
                                                        100
                                                    }%`,
                                                }}
                                            >
                                                <span className="bar-tooltip">
                                                    {day.count}
                                                </span>
                                            </div>
                                            {last6Days[index] && (
                                                <div
                                                    className="bar bar-last-6-days"
                                                    style={{
                                                        height: `${
                                                            (last6Days[index]
                                                                .count /
                                                                maxCount) *
                                                            100
                                                        }%`,
                                                    }}
                                                >
                                                    <span className="bar-tooltip">
                                                        {last6Days[index].count}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <span className="bar-label">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="chart-legend">
                                <div className="legend-item">
                                    <span className="legend-color last-6-days"></span>
                                    <span>Last 6 days</span>
                                </div>
                                <div className="legend-item">
                                    <span className="legend-color last-week"></span>
                                    <span>Last Week</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Event Overview */}
                    <div className="analytics-card">
                        <div className="card-header">
                            <div>
                                <h3>event overview</h3>
                                <p className="date-range">From 1-6 Dec, 2020</p>
                            </div>
                            <button className="view-report-btn">
                                View Report
                            </button>
                        </div>

                        <div className="donut-chart-container">
                            <div className="donut-chart">
                                <svg viewBox="0 0 100 100">
                                    {/* Background circle */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke="#f0f0f0"
                                        strokeWidth="20"
                                    />
                                    {/* Done segment */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke="#e0e0e0"
                                        strokeWidth="20"
                                        strokeDasharray={`${doneLength} ${circumference}`}
                                        transform="rotate(-90 50 50)"
                                        strokeLinecap="round"
                                        className="donut-segment"
                                        onMouseEnter={() =>
                                            setHoveredSegment("done")
                                        }
                                        onMouseLeave={() =>
                                            setHoveredSegment(null)
                                        }
                                    />
                                    {/* Going On segment */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke="#fbbf24"
                                        strokeWidth="20"
                                        strokeDasharray={`${goingOnLength} ${circumference}`}
                                        strokeDashoffset={`-${doneLength}`}
                                        transform="rotate(-90 50 50)"
                                        strokeLinecap="round"
                                        className="donut-segment"
                                        onMouseEnter={() =>
                                            setHoveredSegment("goingOn")
                                        }
                                        onMouseLeave={() =>
                                            setHoveredSegment(null)
                                        }
                                    />
                                    {/* Planning segment */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke="#ea580c"
                                        strokeWidth="20"
                                        strokeDasharray={`${planningLength} ${circumference}`}
                                        strokeDashoffset={`-${
                                            doneLength + goingOnLength
                                        }`}
                                        transform="rotate(-90 50 50)"
                                        strokeLinecap="round"
                                        className="donut-segment"
                                        onMouseEnter={() =>
                                            setHoveredSegment("planning")
                                        }
                                        onMouseLeave={() =>
                                            setHoveredSegment(null)
                                        }
                                    />
                                </svg>
                                <div className="donut-center">
                                    <div className="donut-tooltip">
                                        {hoveredSegment === "done" && (
                                            <>
                                                <div className="tooltip-label">
                                                    Done
                                                </div>
                                                <div className="tooltip-date">
                                                    1-6 Dec
                                                </div>
                                                <div className="tooltip-value">
                                                    {eventStatus.done}%
                                                </div>
                                            </>
                                        )}
                                        {hoveredSegment === "goingOn" && (
                                            <>
                                                <div className="tooltip-label">
                                                    Going On
                                                </div>
                                                <div className="tooltip-date">
                                                    1-6 Dec
                                                </div>
                                                <div className="tooltip-value">
                                                    {eventStatus.goingOn}%
                                                </div>
                                            </>
                                        )}
                                        {hoveredSegment === "planning" && (
                                            <>
                                                <div className="tooltip-label">
                                                    Planning
                                                </div>
                                                <div className="tooltip-date">
                                                    1-6 Dec
                                                </div>
                                                <div className="tooltip-value">
                                                    {eventStatus.planning}%
                                                </div>
                                            </>
                                        )}
                                        {!hoveredSegment && (
                                            <>
                                                <div className="tooltip-label">
                                                    Done
                                                </div>
                                                <div className="tooltip-date">
                                                    1-6 Dec
                                                </div>
                                                <div className="tooltip-value">
                                                    {eventStatus.total} event
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="donut-stats">
                                <div className="stat-item">
                                    <span className="stat-dot done"></span>
                                    <span className="stat-label">Done</span>
                                    <span className="stat-value">
                                        {eventStatus.done}%
                                    </span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-dot going-on"></span>
                                    <span className="stat-label">Going On</span>
                                    <span className="stat-value">
                                        {eventStatus.goingOn}%
                                    </span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-dot planning"></span>
                                    <span className="stat-label">Planning</span>
                                    <span className="stat-value">
                                        {eventStatus.planning}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Issue Report */}
                    <div className="analytics-card">
                        <h3>Issue Report</h3>
                        <p className="subtitle">User-Reported Problem(s)</p>

                        <div className="issue-chart">
                            <div className="issue-circle registration">
                                <div className="circle-content">
                                    <div className="percentage">
                                        {issues.registrationError}%
                                    </div>
                                    <div className="label">
                                        Registration Error
                                    </div>
                                </div>
                            </div>
                            <div className="issue-circle qr-code">
                                <div className="circle-content">
                                    <div className="percentage">
                                        {issues.qrCheckIn}%
                                    </div>
                                    <div className="label">
                                        Can't Check-in with QR-code
                                    </div>
                                </div>
                            </div>
                            <div className="issue-circle not-updated">
                                <div className="circle-content">
                                    <div className="percentage">
                                        {issues.eventNotUpToDate}%
                                    </div>
                                    <div className="label">
                                        Event Not Up to Date
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ranking Rate */}
                    <div className="analytics-card">
                        <h3>Ranking Rate</h3>
                        <p className="subtitle">Most Favorite event by user</p>

                        <div className="ranking-list">
                            {topEvents.map((event, index) => (
                                <div key={event.id} className="ranking-item">
                                    <div className="event-avatar">
                                        {event.imageUrl ? (
                                            <img
                                                src={event.imageUrl}
                                                alt={event.title}
                                            />
                                        ) : (
                                            <div className="avatar-placeholder">
                                                {event.title[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className="event-name">
                                        {event.title}
                                    </div>
                                    <div className="event-rating">
                                        {event.rating}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderVerificationView = () => {
        if (pendingUsers.length === 0) {
            return (
                <div className="empty-state">
                    <div className="empty-icon">✓</div>
                    <h3>No Pending Verifications</h3>
                    <p>All organizers have been verified</p>
                </div>
            );
        }

        return (
            <div className="verification-view">
                <h2>Organizer Verification Requests</h2>
                <div className="verification-list">
                    {pendingUsers.map((user) => (
                        <div key={user.id} className="verification-card">
                            <div className="user-info">
                                <div className="user-avatar">
                                    {user.firstName?.[0]}
                                    {user.lastName?.[0]}
                                </div>
                                <div className="user-details">
                                    <h4>
                                        {user.firstName} {user.lastName}
                                    </h4>
                                    <p className="user-email">{user.email}</p>
                                    <p className="user-phone">
                                        📞 {user.phone}
                                    </p>
                                    <span className="role-badge">
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                            <div className="verification-actions">
                                <button
                                    onClick={() =>
                                        handleVerifyUser(user.id, true)
                                    }
                                    className="btn-approve"
                                >
                                    ✓ Approve
                                </button>
                                <button
                                    onClick={() =>
                                        handleVerifyUser(user.id, false)
                                    }
                                    className="btn-reject"
                                >
                                    ✗ Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="loading-screen">
                    <div className="spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
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
                                className={`sidebar-btn ${
                                    activeView === "dashboard" ? "active" : ""
                                }`}
                                onClick={() => setActiveView("dashboard")}
                            >
                                📊 Dashboard
                            </button>
                        </div>
                        <div className="sidebar-section">
                            <div className="sidebar-title">OTHERS</div>
                            <button className="sidebar-btn">⚙️ Settings</button>
                            <button
                                className="sidebar-btn"
                                onClick={() => navigate("/admin/verification")}
                            >
                                🧾 verification
                                {pendingEvents.length > 0 && (
                                    <span className="badge">
                                        {pendingEvents.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div
                className={`admin-main-content ${
                    sidebarCollapsed ? "expanded" : ""
                }`}
            >
                <div className="content-header">
                    <h2>Dashboard</h2>
                </div>
                {activeView === "dashboard" && renderDashboardView()}
                {activeView === "verification" && renderVerificationView()}
            </div>
        </div>
    );
}

export default AdminDashboard;