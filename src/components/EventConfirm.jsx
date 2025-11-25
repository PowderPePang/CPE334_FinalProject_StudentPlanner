// ✅ เพิ่ม useLocation ใน import
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import React, { useState, useEffect } from 'react';
import {
  Home, Bell, User, Inbox, Calendar,
  ArrowLeft, Clock, CalendarPlus
} from 'lucide-react';
import { 
    doc, 
    getDoc, 
    updateDoc, 
    increment 
} from 'firebase/firestore'; 
import { db } from '../firebase';
import QRCode from 'qrcode';

function EventConfirmed() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ เรียกใช้ useLocation
  const { logOut, user } = useUserAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!user || !eventId) return;

      try {
        setLoading(true);
        const eventRef = doc(db, 'events', eventId);
        const eventSnap = await getDoc(eventRef);
        
        if (eventSnap.exists()) {
          const eventData = { id: eventSnap.id, ...eventSnap.data() };
          setEvent(eventData);

          // ตรวจสอบว่า User ปัจจุบันอยู่ใน participants หรือไม่
          let userParticipant = null;
          if (eventData.participants && Array.isArray(eventData.participants)) {
              userParticipant = eventData.participants.find(p => p.userId === user.uid);
          }

          // ✅ เช็คเพิ่ม: ถ้ามีชื่อใน DB OR เพิ่งกดมาจากหน้าลงทะเบียน (state.justRegistered)
          const isJustRegistered = location.state?.justRegistered;

          if (userParticipant || isJustRegistered) {
              setIsRegistered(true);
              
              // สร้าง QR Code
              const qrData = `EVENT:${eventId}|USER:${user.uid}|CHECKIN`;
              try {
                const qrUrl = await QRCode.toDataURL(qrData, {
                  width: 200,
                  margin: 2,
                  color: { dark: '#000000', light: '#FFFFFF' }
                });
                setQrCodeUrl(qrUrl);
              } catch (qrErr) {
                console.error("Error generating QR:", qrErr);
              }

          } else {
              // ถ้าไม่ได้ลงทะเบียน และไม่ได้กดมาจากหน้า Register
              setIsRegistered(false);
          }
        } else {
            console.log("No such event!");
        }
      } catch (err) {
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, user, location.state]); // ✅ เพิ่ม location.state ใน dependencies

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

  const handleAddToCalendar = () => {
    if (event && event.startDate) {
        const startDate = event.startDate.toDate ? event.startDate.toDate() : new Date(event.startDate);
        const endDate = event.endDate && event.endDate.toDate ? event.endDate.toDate() : new Date(event.endDate || event.startDate);

        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.location || '')}`;
        window.open(googleCalendarUrl, '_blank');
    } else {
        alert('Event data is incomplete for calendar export.');
    }
  };

  const confirmCancelRegistration = async () => {
    if (!event || !user) return;

    try {
      const eventRef = doc(db, 'events', eventId);
      
      const eventSnap = await getDoc(eventRef);
      if (!eventSnap.exists()) return;
      
      const currentData = eventSnap.data();
      const currentParticipants = currentData.participants || [];

      const updatedParticipants = currentParticipants.filter(p => p.userId !== user.uid);

      await updateDoc(eventRef, {
          participants: updatedParticipants,
          currentParticipants: increment(-1) 
      });

      alert('ยกเลิกการลงทะเบียนเรียบร้อยแล้ว');
      setShowCancelModal(false);
      navigate('/home'); 
    } catch (err) {
      console.error("Error canceling registration:", err);
      alert('เกิดข้อผิดพลาดในการยกเลิก: ' + err.message);
    }
  };

  // ✅ เช็คว่าอีเว้นจบหรือยัง
  const isEventEnded = () => {
    if (!event) return false;
    const now = new Date();
    // เช็คจาก endDate ก่อน ถ้าไม่มีให้ใช้ startDate (เผื่อเป็นวันเดียว)
    let end = null;
    if (event.endDate) {
       end = event.endDate.toDate ? event.endDate.toDate() : new Date(event.endDate);
    } else if (event.date) { // กรณีเก็บเป็น date
       end = event.date.toDate ? event.date.toDate() : new Date(event.date);
       // ถ้ามีแต่ start date ให้สมมติว่าจบสิ้นวันนั้น
       end.setHours(23, 59, 59);
    } else if (event.startDate) {
       end = event.startDate.toDate ? event.startDate.toDate() : new Date(event.startDate);
       end.setHours(23, 59, 59);
    }
    
    return end ? now > end : false;
  };

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>;
  }

  if (!isRegistered) {
      return (
          <div style={{ padding: "3rem", textAlign: "center" }}>
              <h2>Access Denied</h2>
              <p>คุณยังไม่ได้ลงทะเบียนสำหรับ Event นี้</p>
              <button onClick={() => navigate('/home')} style={{ marginTop: "1rem", padding: "0.5rem 1rem", cursor: "pointer" }}>
                  กลับหน้าหลัก
              </button>
          </div>
      );
  }

  const eventEnded = isEventEnded();

  return (
    <div className="container">
      <div className="sidebar">
        <div className="logo"><div className="logo-icon"><Calendar /></div><div className="logo-text">PLANNER</div></div>
        <div className="overview-title">OVERVIEW</div>
        <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => navigate('/home')}><Home /> Dashboard</button>
        <button className={`nav-item ${activeTab === 'inbox' ? 'active' : ''}`} onClick={() => setActiveTab('inbox')}><Inbox /> Inbox</button>
        <button className={`nav-item ${activeTab === 'notification' ? 'active' : ''}`} onClick={() => navigate('/notification')}><Bell /> Notification</button>
      </div>

      <div className="main-content">
        <div className="header">
          <div className="header-left"><button className="back-btn" onClick={handleBack}><ArrowLeft /> Back</button><span className="header-title">Event Detail</span></div>
          <div className="header-right"><button className="logout-btn" onClick={handleLogout}>Log out</button><button className="profile-btn"><User className="profile-icon" /></button><button className="bell-btn"><Bell className="bell-icon" /></button></div>
        </div>

        <div className="content">
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            
            {/* สถานะการลงทะเบียน */}
            {eventEnded ? (
                 <div style={{ backgroundColor: '#64748b', color: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: '600' }}>Event has ended</div>
            ) : (
                 <div style={{ backgroundColor: '#EA580C', color: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: '600' }}>✓ Registration Confirmed!</div>
            )}

            <div style={{ backgroundImage: `url(${event?.imageUrl || '/duck.jpg'})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '250px', borderRadius: '12px', marginBottom: '2rem', position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.9rem', fontWeight: '600' }}>{event?.category}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', marginTop: '2rem' }}>
              {/* Left Column: QR Code */}
              <div>
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '2px solid #e0e0e0', textAlign: 'center' }}>
                  {qrCodeUrl && (<img src={qrCodeUrl} alt="QR Code" style={{ width: '200px', height: '200px', margin: '0 auto', opacity: eventEnded ? 0.3 : 1 }} />)}
                  <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
                    {eventEnded ? 'QR Code expired' : 'Show this QR Code at the event entrance'}
                  </p>
                </div>
              </div>

              {/* Right Column: Details & Reviews */}
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', marginBottom: '1rem' }}>{event?.title}</h1>

                {/* ✅ ส่วนแสดง Rating (จะโชว์ก็ต่อเมื่อ event จบแล้ว หรือมี rating แล้ว) */}
                {(eventEnded || (event?.averageRating > 0)) && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", padding: "0.75rem", backgroundColor: "#fff3cd", borderRadius: "8px", width: "fit-content" }}>
                        <span style={{ fontSize: "1.5rem" }}>⭐</span>
                        <span style={{ fontSize: "1.25rem", fontWeight: "700" }}>
                            {event?.averageRating ? event.averageRating.toFixed(1) : 'N/A'}
                        </span>
                        <span style={{ color: "#666" }}>/5 ({event?.totalReviews || 0} reviews)</span>
                    </div>
                )}

                <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><Calendar size={18} color="#666" /><span style={{ color: '#333', fontWeight: '500' }}>{event?.date || event?.startDate?.toDate?.().toLocaleDateString('th-TH') || 'TBA'}</span></div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><Clock size={18} color="#666" /><span style={{ color: '#333', fontWeight: '500' }}>{event?.time || 'TBA'}</span></div>
                   {!eventEnded && (
                       <button onClick={handleAddToCalendar} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'white', border: '1px solid #2196f3', borderRadius: '6px', color: '#2196f3', cursor: 'pointer' }}><CalendarPlus size={18} /> Add to Calendar</button>
                   )}
                </div>

                {/* ปุ่มยกเลิก (ซ่อนถ้าจบไปแล้ว) */}
                {!eventEnded && (
                    <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#fff5f5', border: '1px solid #fee', borderRadius: '8px' }}>
                      <h3 style={{ fontSize: '1rem', color: '#666', marginBottom: '0.75rem' }}>Cannot attend?</h3>
                      <button onClick={() => setShowCancelModal(true)} style={{ padding: '0.6rem 1.5rem', backgroundColor: 'white', color: '#dc2626', border: '2px solid #dc2626', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Cancel Registration</button>
                    </div>
                )}

                {/* ✅ ส่วนรายการ Reviews (แสดงเมื่อ event จบแล้ว และมี reviews) */}
                {eventEnded && event?.reviews && event.reviews.length > 0 && (
                  <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid #eee" }}>
                      <h3 style={{ fontSize: '1.3rem', color: '#333', fontWeight: '600', marginBottom: '1rem' }}>Reviews</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {event.reviews
                            .sort((a, b) => {
                                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
                                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
                                return dateB - dateA;
                            })
                            .map((review, index) => (
                                <div key={index} style={{ padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                        <span style={{ fontWeight: "600" }}>{review.userName}</span>
                                        <div style={{ display: "flex", gap: "2px" }}>
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} style={{ color: i < review.rating ? "#ffd700" : "#e0e0e0", fontSize: "0.9rem" }}>⭐</span>
                                            ))}
                                        </div>
                                    </div>
                                    <p style={{ color: "#666", margin: 0, fontSize: "0.95rem" }}>{review.comment}</p>
                                </div>
                            ))}
                      </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>

      {showCancelModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', maxWidth: '450px', width: '90%', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Confirm Cancellation</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Are you sure you want to cancel your registration for "{event?.title}"?</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowCancelModal(false)} style={{ padding: '0.7rem 1.5rem', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>No, Keep it</button>
              <button onClick={confirmCancelRegistration} style={{ padding: '0.7rem 1.5rem', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventConfirmed;