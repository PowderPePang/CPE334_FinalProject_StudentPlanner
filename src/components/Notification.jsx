import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import React, { useState } from 'react';
import {
  Home, Bell, User, Inbox, Calendar, ArrowLeft, Clock, CheckCircle, AlertCircle, Info, Trash2, Check
} from 'lucide-react';

function PageNotification() {
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notification');
  const [filter, setFilter] = useState('all');
  
  // ข้อมูลตัวอย่าง
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Event is about to start",
      message: "The event 'Web Development Workshop' will start in 30 minutes",
      type: "event",
      read: false,
      time: "30 minutes ago"
    },
    {
      id: 2,
      title: "New event added",
      message: "A new event 'AI & Machine Learning Seminar' has been added to your planner",
      type: "success",
      read: false,
      time: "1 hour ago"
    },
    {
      id: 3,
      title: "Event cancelled",
      message: "The event 'Database Design Class' has been cancelled",
      type: "alert",
      read: true,
      time: "2 hours ago"
    },
    {
      id: 4,
      title: "Reminder",
      message: "Don't forget to submit your assignment before Friday",
      type: "info",
      read: true,
      time: "1 day ago"
    },
    {
      id: 5,
      title: "Event reminder",
      message: "Tomorrow: Mobile App Development Workshop at 2:00 PM",
      type: "event",
      read: false,
      time: "1 day ago"
    }
  ]);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const handleDelete = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'event':
        return <Calendar className="w-6 h-6" />;
      case 'alert':
        return <AlertCircle className="w-6 h-6" />;
      case 'success':
        return <CheckCircle className="w-6 h-6" />;
      default:
        return <Info className="w-6 h-6" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'event':
        return { bg: '#E8F5FF', icon: '#FF8C42' };
      case 'alert':
        return { bg: '#FFE8E8', icon: '#FF6B6B' };
      case 'success':
        return { bg: '#E8F8F0', icon: '#4CAF50' };
      default:
        return { bg: '#F5F5F5', icon: '#999' };
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .container {
          display: flex;
          height: 100vh;
          background: #fafafa;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .sidebar {
          width: 250px;
          background: white;
          padding: 2rem 1rem;
          color: #333;
          border-right: 1px solid #f0f0f0;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 3rem;
          padding: 0 0.5rem;
        }

        .logo-icon {
          width: 50px;
          height: 50px;
          background: #FDB022;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .logo-text {
          font-weight: 700;
          font-size: 1.3rem;
          color: #000;
        }

        .overview-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: #aaa;
          padding: 0 0.5rem;
          margin-bottom: 1rem;
          letter-spacing: 1px;
        }

        .nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.9rem 1rem;
          margin-bottom: 0.5rem;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.95rem;
          color: #555;
          transition: all 0.2s;
          text-align: left;
        }

        .nav-item:hover {
          background: #f9f9f9;
          color: #333;
        }

        .nav-item.active {
          background: #FFF4E6;
          color: #FF8C42;
          font-weight: 500;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .header {
          background: white;
          padding: 1rem 2rem;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;
          color: #666;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .back-btn:hover {
          color: #333;
        }

        .header-title {
          font-size: 1rem;
          font-weight: 500;
          color: #333;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logout-btn {
          padding: 0.5rem 1.2rem;
          background: #000;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: #333;
        }

        .content {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          background: #fafafa;
        }

        .notification-header-section {
          max-width: 900px;
          margin: 0 auto 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .notification-title-group {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .notification-main-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .unread-badge {
          background: #FF6B6B;
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .filter-container {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .filter-tabs {
          display: flex;
          gap: 0.5rem;
          background: white;
          padding: 0.3rem;
          border-radius: 10px;
          border: 1px solid #e0e0e0;
        }

        .filter-tab {
          padding: 0.5rem 1.2rem;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          color: #666;
          transition: all 0.2s;
          font-weight: 500;
        }

        .filter-tab.active {
          background: #FF8C42;
          color: white;
        }

        .mark-all-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.2rem;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          color: #666;
          font-size: 0.9rem;
          transition: all 0.2s;
          font-weight: 500;
        }

        .mark-all-btn:hover {
          background: #f9f9f9;
          border-color: #FF8C42;
          color: #FF8C42;
        }

        .notification-list {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .notification-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid #e8e8e8;
          display: flex;
          gap: 1.2rem;
          transition: all 0.2s;
        }

        .notification-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .notification-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notification-body {
          flex: 1;
        }

        .notification-top {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 0.5rem;
        }

        .notification-text h3 {
          font-size: 1.05rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 0.4rem 0;
        }

        .notification-text p {
          font-size: 0.95rem;
          color: #666;
          margin: 0;
          line-height: 1.5;
        }

        .notification-time-display {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.85rem;
          color: #999;
        }

        .notification-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .action-button {
          padding: 0.5rem 1rem;
          border: 1px solid #e0e0e0;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.88rem;
          color: #666;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .action-button:hover {
          background: #f9f9f9;
        }

        .action-button.mark-read:hover {
          border-color: #FF8C42;
          color: #FF8C42;
        }

        .action-button.delete:hover {
          border-color: #FF6B6B;
          color: #FF6B6B;
          background: #FFF5F5;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #999;
        }

        .empty-state svg {
          width: 80px;
          height: 80px;
          margin: 0 auto 1rem;
          opacity: 0.3;
        }

        .empty-state h3 {
          font-size: 1.3rem;
          color: #666;
          margin-bottom: 0.5rem;
        }
      `}</style>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <div className="logo-icon"><Calendar size={24} /></div>
          <div className="logo-text">PLANNER</div>
        </div>

        <div className="overview-title">OVERVIEW</div>

        <button 
          className="nav-item"
          onClick={() => navigate('/home')}
        >
          <Home size={20} /> Dashboard
        </button>
        <button 
          className="nav-item"
          onClick={() => setActiveTab('inbox')}
        >
          <Inbox size={20} /> Inbox
        </button>
        <button 
          className={`nav-item ${activeTab === 'notification' ? 'active' : ''}`}
        >
          <Bell size={20} /> Notification
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate('/home')}>
              <ArrowLeft size={18} /> Back
            </button>
            <span className="header-title">Student event planner</span>
          </div>
          <div className="header-right">
            <button className="logout-btn" onClick={handleLogout}>log out</button>
          </div>
        </div>

        <div className="content">
          <div className="notification-header-section">
            <div className="notification-title-group">
              <h1 className="notification-main-title">All Notifications</h1>
              {unreadCount > 0 && (
                <span className="unread-badge">{unreadCount} unread</span>
              )}
            </div>
            
            <div className="filter-container">
              <div className="filter-tabs">
                <button 
                  className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
                  onClick={() => setFilter('unread')}
                >
                  Unread
                </button>
                <button 
                  className={`filter-tab ${filter === 'read' ? 'active' : ''}`}
                  onClick={() => setFilter('read')}
                >
                  Read
                </button>
              </div>
              
              {unreadCount > 0 && (
                <button className="mark-all-btn" onClick={handleMarkAllAsRead}>
                  <Check size={16} /> Mark all as read
                </button>
              )}
            </div>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <Bell />
              <h3>No notifications</h3>
              <p>
                {filter === 'unread' 
                  ? "You're all caught up! No unread notifications."
                  : filter === 'read'
                  ? "No read notifications yet."
                  : "You don't have any notifications yet."}
              </p>
            </div>
          ) : (
            <div className="notification-list">
              {filteredNotifications.map(notification => {
                const colors = getNotificationColor(notification.type);
                return (
                  <div key={notification.id} className="notification-card">
                    <div 
                      className="notification-icon-wrapper"
                      style={{ 
                        background: colors.bg,
                        color: colors.icon
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="notification-body">
                      <div className="notification-top">
                        <div className="notification-text">
                          <h3>{notification.title}</h3>
                          <p>{notification.message}</p>
                        </div>
                        <div className="notification-time-display">
                          <Clock size={14} />
                          {notification.time}
                        </div>
                      </div>
                      
                      <div className="notification-actions">
                        {!notification.read && (
                          <button 
                            className="action-button mark-read"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <Check size={16} /> Mark as read
                          </button>
                        )}
                        <button 
                          className="action-button delete"
                          onClick={() => handleDelete(notification.id)}
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PageNotification;