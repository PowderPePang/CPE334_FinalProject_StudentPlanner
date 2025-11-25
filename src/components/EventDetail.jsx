import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import {
  Home, Search, Bell, User, Inbox, Calendar,
  ArrowLeft, MapPin, Clock, Users, CalendarPlus
} from 'lucide-react';
import { doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
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
  const [userProfile, setUserProfile] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  // ดึง user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserProfile();
  }, [user, navigate]);

  // ดึงข้อมูล Event
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventRef = doc(db, 'events', eventId);
        const eventSnap = await getDoc(eventRef);

        if (eventSnap.exists()) {
          const eventData = { id: eventSnap.id, ...eventSnap.data() };
          setEvent(eventData);

          // เช็คว่าลงทะเบียนแล้วหรือยัง
          if (user && eventData.participants) {
            const registered = eventData.participants.some(
              p => p.userId === user.uid
            );
            setIsRegistered(registered);
          }

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

  const handleJoinEvent = () => {
    if (!user) {
      alert("กรุณา login ก่อนลงทะเบียน");
      navigate("/login");
      return;
    }

    if (isRegistered) {
      alert("คุณลงทะเบียน event นี้แล้ว!");
      return;
    }

    if (event.currentParticipants >= event.maxParticipants) {
      alert("Event นี้เต็มแล้ว!");
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmRegister = async () => {
    if (!userProfile) {
      alert("กรุณารอสักครู่...");
      return;
    }

    try {
      setRegistering(true);

      const participant = {
        userId: user.uid,
        name: userProfile.firstName && userProfile.lastName
          ? `${userProfile.firstName} ${userProfile.lastName}`
          : userProfile.email,
        email: userProfile.email,
        phone: userProfile.phone || "",
        registrationDate: new Date().toISOString().split('T')[0],
        status: "confirmed"
      };

      await updateDoc(doc(db, "events", eventId), {
        participants: arrayUnion(participant),
        currentParticipants: increment(1)
      });

      console.log("✅ Registration successful");
      setShowConfirmModal(false);

      // ส่ง state ไปด้วย เพื่อบอกหน้าถัดไปว่าเพิ่งลงทะเบียนเสร็จ
      navigate(`/event/${eventId}/confirmed`, { state: { justRegistered: true } });

    } catch (err) {
      console.error("❌ Error registering:", err);
      alert('เกิดข้อผิดพลาดในการลงทะเบียน: ' + err.message);
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegister = () => {
    setShowConfirmModal(false);
  };

  const handleAddToCalendar = () => {
    if (event.startDate) {
      const startDate = event.startDate.toDate ? event.startDate.toDate() : new Date(event.startDate);
      const endDate = event.endDate.toDate ? event.endDate.toDate() : new Date(event.endDate);

      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;

      window.open(googleCalendarUrl, '_blank');
    } else {
      alert('เพิ่มลงปฏิทินแล้ว!');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'TBA';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('th-TH', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'TBA';
    return timeString;
  };

  if (loading) {
    return (
      <div className="container"><div className="main-content"><p style={{ textAlign: 'center', padding: '3rem' }}>กำลังโหลดข้อมูล...</p></div></div>
    );
  }

  if (error || !event) {
    return (
      <div className="container"><div className="main-content"><p style={{ textAlign: 'center', padding: '3rem', color: 'red' }}>{error}</p><button onClick={handleBack}>กลับหน้าหลัก</button></div></div>
    );
  }

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo"><div className="logo-icon"><Calendar /></div><div className="logo-text">PLANNER</div></div>
        <div className="overview-title">OVERVIEW</div>
        <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><Home /> Dashboard</button>
        <button className={`nav-item ${activeTab === 'inbox' ? 'active' : ''}`} onClick={() => setActiveTab('inbox')}><Inbox /> Inbox</button>
        <button className={`nav-item ${activeTab === 'notification' ? 'active' : ''}`} onClick={() => setActiveTab('notification')}><Bell /> Notification</button>
      </div>

      <div className="main-content">
        <div className="header">
          <div className="header-left"><button className="back-btn" onClick={handleBack}><ArrowLeft /> Back</button><span className="header-title">Student Event Planner</span></div>
          <div className="header-right"><button className="logout-btn" onClick={handleLogout}>Log out</button><button className="profile-btn"><User className="profile-icon" /></button><button className="bell-btn"><Bell className="bell-icon" /></button></div>
        </div>

        <div className="content">
          <div className="event-detail-container">
            {/* Event Image & Category */}
            <div style={{ position: 'relative', marginBottom: '2rem' }}>
              <div className="event-detail-image" style={{ backgroundImage: `url(${event.imageUrl || '/duck.jpg'})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '350px', borderRadius: '12px', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', backgroundColor: '#ff9800', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.9rem', fontWeight: '600', transform: 'capitalize' }}>{event.category || 'General'}</div>
              </div>
            </div>

            {/* Title & Register Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', gap: '2rem' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333', margin: 0, flex: 1 }}>{event.title}</h1>
              <button
                className="banner-btn"
                onClick={handleJoinEvent}
                disabled={isRegistered || event.currentParticipants >= event.maxParticipants}
                style={{ backgroundColor: isRegistered ? '#9e9e9e' : event.currentParticipants >= event.maxParticipants ? '#f44336' : '#ffd740', color: isRegistered || event.currentParticipants >= event.maxParticipants ? '#fff' : '#000', border: 'none', padding: '0.75rem 2rem', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: isRegistered || event.currentParticipants >= event.maxParticipants ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isRegistered || event.currentParticipants >= event.maxParticipants ? 0.7 : 1 }}
              >
                {isRegistered ? '✓ Registered' : event.currentParticipants >= event.maxParticipants ? '✗ Full' : '🔧 Register'}
              </button>
            </div>

            {/* Date and Time */}
            <div style={{ border: '2px solid #2196f3', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem', backgroundColor: '#f8f9fa' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#333', fontWeight: '600' }}>Date and Time</h3>
              <div style={{ display: 'flex', gap: '3rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={20} color="#666" /><span style={{ color: '#666' }}><strong>Date:</strong> {formatDate(event.startDate || event.date)}</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={20} color="#666" /><span style={{ color: '#666' }}><strong>Time:</strong> {formatTime(event.startTime)} - {formatTime(event.endTime)}</span></div>
              </div>
              <button onClick={handleAddToCalendar} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'white', border: '1px solid #2196f3', borderRadius: '6px', color: '#2196f3', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '500', transition: 'all 0.3s ease' }}><CalendarPlus size={18} /> + Add to Calendar</button>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '2rem' }}><h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#333', fontWeight: '600' }}>Event Description</h3><p style={{ lineHeight: '1.8', color: '#666', fontSize: '1rem' }}>{event.description || 'No description available.'}</p></div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#333', fontWeight: '600' }}>Tags</h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>{event.tags.map((tag, index) => (<span key={index} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#e3f2fd', color: '#1976d2', borderRadius: '16px', fontSize: '0.9rem' }}>#{tag}</span>))}</div>
              </div>
            )}

            {/* Reviews Section (Added from Merge) */}
            {event.reviews && event.reviews.length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: '1.3rem', color: '#333', fontWeight: '600', margin: 0 }}>
                    Event Reviews ({event.totalReviews || event.reviews.length})
                  </h3>
                  {event.averageRating && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "#fff3cd", borderRadius: "8px" }}>
                      <span style={{ fontSize: "1.5rem" }}>⭐</span>
                      <span style={{ fontSize: "1.25rem", fontWeight: "700" }}>{event.averageRating.toFixed(1)}</span>
                      <span style={{ color: "#666" }}>/5</span>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {event.reviews
                    .sort((a, b) => {
                      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
                      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
                      return dateB - dateA;
                    })
                    .map((review, index) => (
                      <div key={index} style={{ padding: "1.5rem", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.75rem" }}>
                          <div>
                            <div style={{ fontWeight: "600", color: "#2d3748", marginBottom: "0.25rem" }}>{review.userName}</div>
                            <div style={{ fontSize: "0.85rem", color: "#999" }}>
                              {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString('th-TH') : 'Recent'}
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: "0.25rem" }}>
                            {[...Array(5)].map((_, i) => (
                              <span key={i} style={{ color: i < review.rating ? "#ffd700" : "#e0e0e0" }}>⭐</span>
                            ))}
                          </div>
                        </div>
                        <p style={{ color: "#666", lineHeight: "1.6", margin: 0 }}>{review.comment}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Additional Info Cards (Location, Participants, Organizer) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
              
              {/* Location Card */}
              <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <MapPin size={20} color="#2196f3" />
                  <strong style={{ color: '#333' }}>Location</strong>
                </div>
                <p style={{ color: '#666', margin: 0, marginBottom: '0.25rem' }}>{event.location || 'TBA'}</p>
                {event.building && (
                  <p style={{ color: '#999', margin: 0, fontSize: '0.9rem' }}>
                    Building: {event.building}{event.floor && `, Floor: ${event.floor}`}
                  </p>
                )}
              </div>

              {/* Participants Card */}
              <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Users size={20} color="#2196f3" />
                  <strong style={{ color: '#333' }}>Participants</strong>
                </div>
                <p style={{ color: '#666', margin: 0 }}>{event.currentParticipants || 0} / {event.maxParticipants || 100} registered</p>
              </div>

              {/* Organizer Card */}
              <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <User size={20} color="#2196f3" />
                  <strong style={{ color: '#333' }}>Organizer</strong>
                </div>
                <p style={{ color: '#666', margin: 0 }}>{event.organizer || event.organizerName || 'Unknown'}</p>
              </div>

            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', maxWidth: '500px', width: '90%', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' }}>
              <div style={{ width: '100%', height: '200px', backgroundImage: `url(${event.imageUrl || '/duck.jpg'})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px', marginBottom: '1.5rem' }}></div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333', marginBottom: '1rem', textAlign: 'center' }}>{event.title}</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0', marginBottom: '1.5rem' }}><span style={{ color: '#666', fontSize: '1.1rem' }}>Sub Total:</span><span style={{ color: '#4caf50', fontSize: '1.2rem', fontWeight: 'bold' }}>Free</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}><span style={{ color: '#666', fontSize: '1rem' }}>Date</span><span style={{ color: '#4caf50', fontSize: '1rem', fontWeight: '600' }}>{formatDate(event.startDate || event.date)}</span></div>
              <button onClick={handleConfirmRegister} style={{ width: '100%', padding: '1rem', backgroundColor: registering ? '#9e9e9e' : '#4caf50', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: '600', cursor: registering ? 'not-allowed' : 'pointer', marginBottom: '0.5rem' }}>{registering ? 'กำลังลงทะเบียน...' : 'Confirm'}</button>
              <button onClick={handleCancelRegister} disabled={registering} style={{ width: '100%', padding: '1rem', backgroundColor: 'transparent', color: '#666', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', cursor: registering ? 'not-allowed' : 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetail;