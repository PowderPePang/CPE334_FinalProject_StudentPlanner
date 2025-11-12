import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import React, { useState, useEffect } from 'react';
import {
  Home as HomeIcon, Search, Bell, User, Inbox, Calendar,
  ChevronLeft, ChevronRight, ArrowLeft, Filter
} from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

function PageHome() {
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State สำหรับ events จาก database
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ดึงข้อมูล events จาก Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsRef = collection(db, 'events');
        const q = query(eventsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const eventsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setEvents(eventsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("ไม่สามารถโหลดข้อมูล events ได้");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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

  // ฟังก์ชันสำหรับไปหน้า Notification
  const handleNotificationClick = () => {
    navigate('/notification');
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch =
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === '' || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
    setShowFilter(false);
  };

  // ดึง categories ที่ไม่ซ้ำกันจาก events
  const categories = [...new Set(events.map(event => event.category).filter(Boolean))];

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <div className="logo-icon"><Calendar /></div>
          <div className="logo-text">PLANNER</div>
        </div>

        <div className="overview-title">OVERVIEW</div>

        <button 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} 
          onClick={() => setActiveTab('dashboard')}
        >
          <HomeIcon /> Dashboard
        </button>
        <button 
          className={`nav-item ${activeTab === 'inbox' ? 'active' : ''}`} 
          onClick={() => setActiveTab('inbox')}
        >
          <Inbox /> Inbox
        </button>
        {/* เพิ่มการลิงก์ไปหน้า Notification */}
        <button 
          className={`nav-item ${activeTab === 'notification' ? 'active' : ''}`} 
          onClick={handleNotificationClick}
        >
          <Bell /> Notification
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <div className="header-left">
            <button className="back-btn"><ArrowLeft /> Back</button>
            <span className="header-title">Student event planner</span>
          </div>
          <div className="header-right">
            <button className="logout-btn" onClick={handleLogout}>Log out</button>
            <button className="profile-btn"><User className="profile-icon" /></button>
            {/* เพิ่มการลิงก์ที่ไอคอนกระดิ่ง */}
            <button className="bell-btn" onClick={handleNotificationClick}>
              <Bell className="bell-icon" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="search-container" style={{ position: 'relative' }}>
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search your course here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="filter-btn" onClick={() => setShowFilter(!showFilter)}>
            <Filter className="w-2 h-2" />
          </button>
          {showFilter && (
            <div className="filter-dropdown">
              {categories.length > 0 ? (
                categories.map(category => (
                  <div
                    key={category}
                    onClick={() => handleCategoryFilter(category)}
                    style={{
                      cursor: 'pointer',
                      padding: '0.5rem',
                      fontWeight: selectedCategory === category ? 'bold' : 'normal',
                      backgroundColor: selectedCategory === category ? '#f0f0f0' : 'transparent'
                    }}
                  >
                    {category} {selectedCategory === category && '✓'}
                  </div>
                ))
              ) : (
                <div style={{ padding: '0.5rem', color: '#999' }}>
                  No categories available
                </div>
              )}
              {selectedCategory && (
                <div
                  onClick={() => setSelectedCategory('')}
                  style={{
                    cursor: 'pointer',
                    padding: '0.5rem',
                    color: '#007bff',
                    borderTop: '1px solid #e0e0e0',
                    marginTop: '0.5rem'
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
          <div className="banner">
            <h2>Don't miss a single event!</h2>
            <p>Join more events!</p>
            <button className="banner-btn">Join Event Now! <span className="arrow-circle">→</span></button>
          </div>

          <div className="section-header">
            <h3>Summary For You</h3>
            <div className="nav-arrows">
              <button className="arrow-btn"><ChevronLeft /></button>
              <button className="arrow-btn"><ChevronRight /></button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              <p>กำลังโหลดข้อมูล...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#ff0000' }}>
              <p>{error}</p>
            </div>
          )}

          {/* Filter Info */}
          {!loading && (searchQuery || selectedCategory) && (
            <div style={{ marginBottom: '1rem', color: '#666' }}>
              Found {filteredEvents.length} event(s)
              {searchQuery && <> matching "{searchQuery}"</>}
              {selectedCategory && <> in {selectedCategory}</>}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                }}
                style={{
                  marginLeft: '1rem',
                  color: '#007bff',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Events Grid */}
          {!loading && !error && (
            filteredEvents.length > 0 ? (
              <div className="events-grid">
                {filteredEvents.map(event => (
                  <article 
                    key={event.id} 
                    className="event-card"
                    onClick={() => handleEventClick(event.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div
                      className="event-image"
                      style={{
                        backgroundImage: `url(${event.imageUrl || '/duck.jpg'})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                      }}
                    />
                    <div className="event-content">
                      <span className="event-tag">{event.category}</span>
                      <div className="event-title">{event.title}</div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${event.progress || 0}%` }}></div>
                      </div>
                      <div className="event-author">
                        <div className="author-avatar"></div>
                        <div className="author-info">
                          <div className="author-name">{event.author || 'Unknown'}</div>
                          <div className="author-role">{event.role || 'Organizer'}</div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
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