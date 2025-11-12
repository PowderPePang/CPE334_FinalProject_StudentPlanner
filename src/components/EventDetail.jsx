import { useNavigate, useParams } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import React, { useState, useEffect } from 'react';
import {
  Home, Search, Bell, User, Inbox, Calendar,
  ArrowLeft, MapPin, Clock, Users, Share2, CalendarPlus
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

function EventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { logOut, user } = useUserAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventRef = doc(db, 'events', eventId);
        const eventSnap = await getDoc(eventRef);
        
        if (eventSnap.exists()) {
          setEvent({ id: eventSnap.id, ...eventSnap.data() });
          setError(null);
        } else {
          setError("ไม่พบข้อมูล event");
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("ไม่สามารถโหลดข้อมูล event ได้");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

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

  const handleJoinEvent = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmRegister = async () => {
    // ส่งข้อมูลการลงทะเบียนไปยัง Firebase ตรงนี้
    try {
      // บันทึกการลงทะเบียนลง Firebase
      // await addDoc(collection(db, 'registrations'), { ... })
      
      setShowConfirmModal(false);
      // นำทางไปหน้ายืนยันการลงทะเบียนพร้อม QR Code
      navigate(`/event/${eventId}/confirmed`);
    } catch (err) {
      console.error("Error registering:", err);
      alert('เกิดข้อผิดพลาดในการลงทะเบียน');
    }
  };

  const handleCancelRegister = () => {
    setShowConfirmModal(false);
  };

  const handleAddToCalendar = () => {
    // สามารถเพิ่ม logic การเพิ่มลงปฏิทินจริงได้ตรงนี้
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

  if (error || !event) {
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
          <div style={{ textAlign: 'center', padding: '3rem', color: '#ff0000' }}>
            <p>{error}</p>
            <button onClick={handleBack} style={{ marginTop: '1rem' }}>
              กลับหน้าหลัก
            </button>
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

        {/* Event Detail Content */}
        <div className="content">
          <div className="event-detail-container">
            {/* Event Image with Category Tag */}
            <div style={{ position: 'relative', marginBottom: '2rem' }}>
              <div 
                className="event-detail-image"
                style={{
                  backgroundImage: `url(${event.imageUrl || '/duck.jpg'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '350px',
                  borderRadius: '12px',
                  position: 'relative'
                }}
              >
                {/* Category Tag - positioned at bottom left of image */}
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  backgroundColor: '#ff9800',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  {event.category}
                </div>
              </div>
            </div>

            {/* Event Title and Register Button */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start', 
              marginBottom: '2rem',
              gap: '2rem'
            }}>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#333', 
                margin: 0,
                flex: 1
              }}>
                {event.title}
              </h1>
              <button 
                className="banner-btn"
                onClick={handleJoinEvent}
                style={{
                  backgroundColor: '#ffd740',
                  color: '#000',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                🔧 Register
              </button>
            </div>

            {/* Date and Time Section - Blue Border Box */}
            <div style={{
              border: '2px solid #2196f3',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '2rem',
              backgroundColor: '#f8f9fa'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                marginBottom: '1rem',
                color: '#333',
                fontWeight: '600'
              }}>
                Date and Time
              </h3>
              
              <div style={{ display: 'flex', gap: '3rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={20} color="#666" />
                  <span style={{ color: '#666' }}>
                    <strong>Day, Date:</strong> {event.date || 'TBA'}
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={20} color="#666" />
                  <span style={{ color: '#666' }}>
                    <strong>Time:</strong> {event.time || 'TBA'}
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
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
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

            {/* Event Description */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                fontSize: '1.3rem', 
                marginBottom: '1rem', 
                color: '#333', 
                fontWeight: '600' 
              }}>
                Event Description
              </h3>
              <p style={{ 
                lineHeight: '1.8', 
                color: '#666', 
                fontSize: '1rem' 
              }}>
                {event.description || 'Lorem ipsum dolor sit amet consectetur. Eget vulputate sodis sit urna et aliquot. Vivamus facilisi diam et mi posuere malesuada nunc viverra nulla.'}
              </p>
            </div>

            {/* Additional Info Cards */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1.5rem',
              marginTop: '2rem'
            }}>
              {/* Location Card */}
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  marginBottom: '0.5rem' 
                }}>
                  <MapPin size={20} color="#2196f3" />
                  <strong style={{ color: '#333' }}>Location</strong>
                </div>
                <p style={{ color: '#666', margin: 0 }}>
                  {event.location || 'TBA'}
                </p>
              </div>

              {/* Participants Card */}
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  marginBottom: '0.5rem' 
                }}>
                  <Users size={20} color="#2196f3" />
                  <strong style={{ color: '#333' }}>Participants</strong>
                </div>
                <p style={{ color: '#666', margin: 0 }}>
                  {event.participants || 0} registered
                </p>
              </div>

              {/* Organizer Card */}
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  marginBottom: '0.5rem' 
                }}>
                  <User size={20} color="#2196f3" />
                  <strong style={{ color: '#333' }}>Organizer</strong>
                </div>
                <p style={{ color: '#666', margin: 0 }}>
                  {event.author || 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
            }}>
              {/* Event Image */}
              <div style={{
                width: '100%',
                height: '200px',
                backgroundImage: `url(${event.imageUrl || '/duck.jpg'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}></div>

              {/* Event Title */}
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {event.title}
              </h2>

              {/* Sub Total */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 0',
                borderTop: '1px solid #e0e0e0',
                borderBottom: '1px solid #e0e0e0',
                marginBottom: '1.5rem'
              }}>
                <span style={{ color: '#666', fontSize: '1.1rem' }}>Sub Total:</span>
                <span style={{ color: '#4caf50', fontSize: '1.2rem', fontWeight: 'bold' }}>Free</span>
              </div>

              {/* Date */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
              }}>
                <span style={{ color: '#666', fontSize: '1rem' }}>Date</span>
                <span style={{ color: '#4caf50', fontSize: '1rem', fontWeight: '600' }}>
                  {event.date || 'TBA'}
                </span>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirmRegister}
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '0.5rem'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#4caf50'}
              >
                confirm
              </button>

              {/* Cancel Button */}
              <button
                onClick={handleCancelRegister}
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: 'transparent',
                  color: '#666',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetail;