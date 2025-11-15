import { useNavigate, useParams } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import React, { useState, useEffect } from 'react';
import {
  Home, Bell, User, Inbox, Calendar,
  ArrowLeft, Clock, CalendarPlus
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import QRCode from 'qrcode';

function EventConfirmed() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { logOut, user } = useUserAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventRef = doc(db, 'events', eventId);
        const eventSnap = await getDoc(eventRef);
        
        if (eventSnap.exists()) {
          const eventData = { id: eventSnap.id, ...eventSnap.data() };
          setEvent(eventData);
          
          // สร้าง QR Code สำหรับ event
          const qrData = `EVENT:${eventId}|USER:${user?.uid}|TIME:${new Date().getTime()}`;
          const qrUrl = await QRCode.toDataURL(qrData, {
            width: 200,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          setQrCodeUrl(qrUrl);
        }
      } catch (err) {
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId && user) {
      fetchEvent();
    }
  }, [eventId, user]);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleBack = () => {
    navigate('/home');
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // เพิ่ม logic บันทึกการ follow ลง Firebase
  };

  const handleAddToCalendar = () => {
    alert('เพิ่มลงปฏิทินแล้ว!');
  };

  if (loading) {
    return (
      <div className="container">
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
        <div className="main-content">
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <p>กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </div>
    );
  }

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
            <button className="back-btn" onClick={handleBack}>
              <ArrowLeft /> Back
            </button>
            <span className="header-title">Student Event Planner</span>
          </div>
          <div className="header-right">
            <button className="logout-btn" onClick={handleLogout}>Log out</button>
            <button className="profile-btn"><User className="profile-icon" /></button>
            <button className="bell-btn"><Bell className="bell-icon" /></button>
          </div>
        </div>

        {/* Registration Success Content */}
        <div className="content">
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Success Banner */}
            <div style={{
              backgroundColor: '#EA580C',
              color: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '2rem',
              textAlign: 'center',
              fontSize: '1.2rem',
              fontWeight: '600'
            }}>
              ✓ Register successed !
            </div>

            {/* Event Banner */}
            <div style={{
              backgroundImage: `url(${event?.imageUrl || '/duck.jpg'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '250px',
              borderRadius: '12px',
              marginBottom: '2rem',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                {event?.category}
              </div>
            </div>

            {/* Main Content Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '300px 1fr',
              gap: '2rem',
              marginTop: '2rem'
            }}>
              {/* Left Column - QR Code */}
              <div>
                <div style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '2px solid #e0e0e0',
                  textAlign: 'center'
                }}>
                  {qrCodeUrl && (
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code" 
                      style={{
                        width: '200px',
                        height: '200px',
                        margin: '0 auto'
                      }}
                    />
                  )}
                  <p style={{
                    marginTop: '1rem',
                    color: '#666',
                    fontSize: '0.9rem'
                  }}>
                    แสดง QR Code นี้เมื่อเข้างาน
                  </p>
                </div>
              </div>

              {/* Right Column - Event Details */}
              <div>
                {/* Event Title */}
                <h1 style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#333',
                  marginBottom: '1.5rem'
                }}>
                  {event?.title}
                </h1>

                {/* Hosted By Section */}
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  marginBottom: '1.5rem'
                }}>
                  <h3 style={{
                    fontSize: '1rem',
                    color: '#666',
                    marginBottom: '1rem',
                    fontWeight: '500'
                  }}>
                    Hosted by
                  </h3>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: '#ddd',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <User size={24} color="#999" />
                      </div>
                      <div>
                        <div style={{
                          fontWeight: '600',
                          color: '#333',
                          marginBottom: '0.25rem'
                        }}>
                          {event?.author || 'Event Organizer'}
                        </div>
                        <button
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#2196f3',
                            cursor: 'pointer',
                            padding: 0,
                            fontSize: '0.9rem',
                            textDecoration: 'underline'
                          }}
                        >
                          Contact
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleFollow}
                      style={{
                        padding: '0.5rem 1.5rem',
                        backgroundColor: isFollowing ? '#e0e0e0' : '#333',
                        color: isFollowing ? '#333' : 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '0.95rem'
                      }}
                    >
                      {isFollowing ? 'Following' : '+ Follow'}
                    </button>
                  </div>
                </div>

                {/* Date and Time Section */}
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  marginBottom: '1.5rem'
                }}>
                  <h3 style={{
                    fontSize: '1rem',
                    color: '#666',
                    marginBottom: '1rem',
                    fontWeight: '500'
                  }}>
                    Date and Time
                  </h3>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <Calendar size={18} color="#666" />
                      <span style={{ color: '#333', fontWeight: '500' }}>
                        {event?.date || 'TBA'}
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Clock size={18} color="#666" />
                      <span style={{ color: '#333', fontWeight: '500' }}>
                        {event?.time || 'TBA'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCalendar}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: 'white',
                      border: '1px solid #2196f3',
                      borderRadius: '6px',
                      color: '#2196f3',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#2196f3';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.color = '#2196f3';
                    }}
                  >
                    <CalendarPlus size={18} />
                    + Add to Calendar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventConfirmed;