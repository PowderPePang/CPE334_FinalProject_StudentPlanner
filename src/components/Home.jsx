import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import React, { useState } from 'react';
import { Home, Search, Bell, User, Inbox, Calendar, ChevronLeft, ChevronRight, ArrowLeft, Filter } from 'lucide-react';


function PageHome() { 
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { logOut } = useUserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  const [activeTab, setActiveTab] = useState('dashboard');

  const events = [
    { id: 1, title: 'How To Study Like A Duck With Dr.Boonyarit Event!', category: 'Education', progress: 45, author: 'Prashant Kumar Singh', role: 'Software Developer' },
    { id: 2, title: 'Sharing Session Event In CPE 10 Floor', category: 'Business', progress: 60, author: 'Prashant Kumar Singh', role: 'Software Developer' },
    { id: 3, title: "Beginner's Guide To Becoming A Professional Frontend Developer By KBTK Talking", category: 'Technology', progress: 75, author: 'Prashant Kumar Singh', role: 'Software Developer' }
  ];

  // Filter events based on search query and selected category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
    setShowFilter(false);
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <div className="logo-icon"><Calendar /></div>
          <div className="logo-text">PLANNER</div>
        </div>

        <div className="overview-title">OVERVIEW</div>

        <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          <Home /> Dashboard
        </button>
        <button className={`nav-item ${activeTab === 'inbox' ? 'active' : ''}`} onClick={() => setActiveTab('inbox')}>
          <Inbox /> Inbox
        </button>
        <button className={`nav-item ${activeTab === 'notification' ? 'active' : ''}`} onClick={() => setActiveTab('notification')}>
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
            <button className="profile-btn">
            <User className="profile-icon" />
            </button>
            <button className="bell-btn">
            <Bell className="bell-icon" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="search-container" style={{position:'relative'}}>
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
            <Filter className="w-2 h-2"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
          </button>

          {showFilter && (
            <div className="filter-dropdown">
              <div 
                onClick={() => handleCategoryFilter('Technology')}
                style={{cursor: 'pointer', fontWeight: selectedCategory === 'Technology' ? 'bold' : 'normal'}}
              >
                Technology {selectedCategory === 'Technology' && '✓'}
              </div>
              <div 
                onClick={() => handleCategoryFilter('Business')}
                style={{cursor: 'pointer', fontWeight: selectedCategory === 'Business' ? 'bold' : 'normal'}}
              >
                Business {selectedCategory === 'Business' && '✓'}
              </div>
              <div 
                onClick={() => handleCategoryFilter('Education')}
                style={{cursor: 'pointer', fontWeight: selectedCategory === 'Education' ? 'bold' : 'normal'}}
              >
                Education {selectedCategory === 'Education' && '✓'}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="content">
          <div className="banner">
            <h2>No not miss a single event!</h2>
            <p>Join more event!</p>
            <button className="banner-btn">Join Event Now! <span className="arrow-circle">→</span></button>
          </div>

          <div className="section-header">
            <h3>Summary For You</h3>
            <div className="nav-arrows">
              <button className="arrow-btn"><ChevronLeft /></button>
              <button className="arrow-btn"><ChevronRight /></button>
            </div>
          </div>

          {/* Show search results info */}
          {(searchQuery || selectedCategory) && (
            <div style={{marginBottom: '1rem', color: '#666'}}>
              Found {filteredEvents.length} event(s)
              {searchQuery && ` matching "${searchQuery}"`}
              {selectedCategory && ` in ${selectedCategory}`}
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                }}
                style={{marginLeft: '1rem', color: '#007bff', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline'}}
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="events-grid">
              {filteredEvents.map(event => (
                <div key={event.id} className="event-card">
                  <div className={`event-image ${event.id === 1 ? 'code-bg' : event.id === 2 ? 'arm-bg' : 'pong-bg'}`}></div>
                  <div className="event-content">
                    <span className="event-tag">{event.category}</span>
                    <div className="event-title">{event.title}</div>
                    <div className="progress-bar"><div className="progress-fill" style={{width: `${event.progress}%`}}></div></div>
                    <div className="event-author">
                      <div className="author-avatar"></div>
                      <div className="author-info">
                        <div className="author-name">{event.author}</div>
                        <div className="author-role">{event.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{textAlign: 'center', padding: '3rem', color: '#666'}}>
              <h3>No events found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default PageHome;