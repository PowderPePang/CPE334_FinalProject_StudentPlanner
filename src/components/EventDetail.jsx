// src/components/EventDetail.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, Users, Share2, Bookmark } from 'lucide-react';

function EventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // ข้อมูล events
  const eventsData = {
    1: {
      id: 1,
      title: 'How To Study Like A Duck With Dr.Boonyarit Event!',
      category: 'Education',
      progress: 45,
      author: 'Prashant Kumar Singh',
      role: 'Software Developer',
      date: 'November 25, 2025',
      time: '14:00 - 16:00',
      location: 'CPE Building, Room 501',
      attendees: 45,
      maxAttendees: 100,
      description: 'Join us for an insightful session on effective study techniques with Dr.Boonyarit. Learn how to optimize your learning process and achieve better results in your academic journey.',
      highlights: [
        'Interactive learning techniques',
        'Time management strategies',
        'Memory enhancement methods',
        'Q&A session with Dr.Boonyarit'
      ]
    },
    2: {
      id: 2,
      title: 'Sharing Session Event In CPE 10 Floor',
      category: 'Business',
      progress: 60,
      author: 'Prashant Kumar Singh',
      role: 'Software Developer',
      date: 'November 28, 2025',
      time: '10:00 - 12:00',
      location: 'CPE Building, 10th Floor',
      attendees: 60,
      maxAttendees: 100,
      description: 'A collaborative sharing session where students and professionals exchange ideas, experiences, and insights about business development and career growth.',
      highlights: [
        'Networking opportunities',
        'Industry insights',
        'Career development tips',
        'Experience sharing'
      ]
    },
    3: {
      id: 3,
      title: "Beginner's Guide To Becoming A Professional Frontend Developer By KBTK Talking",
      category: 'Technology',
      progress: 75,
      author: 'Prashant Kumar Singh',
      role: 'Software Developer',
      date: 'December 2, 2025',
      time: '13:00 - 17:00',
      location: 'Innovation Lab, Building A',
      attendees: 75,
      maxAttendees: 100,
      description: 'Comprehensive workshop for aspiring frontend developers. Learn the essential skills, tools, and best practices to kickstart your career in web development.',
      highlights: [
        'HTML, CSS, JavaScript fundamentals',
        'Modern frameworks overview',
        'Portfolio building strategies',
        'Hands-on coding exercises'
      ]
    }
  };

  // ถ้า eventId ไม่ตรงกับ keys ของ eventsData ให้ default เป็น event แรก
  const event = eventsData[Number(eventId)] || eventsData[1];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/home')} style={styles.backBtn}>
          <ArrowLeft size={20} /> Back to Events
        </button>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Left Column */}
        <div style={styles.leftColumn}>
          <div style={styles.eventImage}>
            <img src="/duck.jpg" alt={event.title} style={styles.image} />
          </div>

          <div style={styles.eventInfo}>
            <span style={styles.categoryBadge}>{event.category}</span>
            <h1 style={styles.eventTitle}>{event.title}</h1>

            <div style={styles.authorSection}>
              <div style={styles.authorAvatar}></div>
              <div>
                <div style={styles.authorName}>{event.author}</div>
                <div style={styles.authorRole}>{event.role}</div>
              </div>
            </div>

            <div style={styles.divider}></div>

            <h2 style={styles.sectionTitle}>About This Event</h2>
            <p style={styles.description}>{event.description}</p>

            <h3 style={styles.subTitle}>What You'll Learn</h3>
            <ul style={styles.highlightsList}>
              {event.highlights.map((highlight, index) => (
                <li key={index} style={styles.highlightItem}>{highlight}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div style={styles.rightColumn}>
          <div style={styles.detailsCard}>
            {/* Registration Progress */}
            <div style={styles.progressSection}>
              <div style={styles.progressHeader}>
                <span style={styles.progressLabel}>Registration</span>
                <span style={styles.progressCount}>
                  {event.attendees}/{event.maxAttendees}
                </span>
              </div>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${event.progress}%` }}></div>
              </div>
              <p style={styles.spotsRemaining}>
                {event.maxAttendees - event.attendees} spots remaining
              </p>
            </div>

            <div style={styles.divider}></div>

            {/* Event Details */}
            <div style={styles.detailsSection}>
              <div style={styles.detailItem}>
                <Calendar size={20} color="#666" />
                <div>
                  <div style={styles.detailLabel}>Date</div>
                  <div style={styles.detailValue}>{event.date}</div>
                </div>
              </div>

              <div style={styles.detailItem}>
                <Clock size={20} color="#666" />
                <div>
                  <div style={styles.detailLabel}>Time</div>
                  <div style={styles.detailValue}>{event.time}</div>
                </div>
              </div>

              <div style={styles.detailItem}>
                <MapPin size={20} color="#666" />
                <div>
                  <div style={styles.detailLabel}>Location</div>
                  <div style={styles.detailValue}>{event.location}</div>
                </div>
              </div>

              <div style={styles.detailItem}>
                <Users size={20} color="#666" />
                <div>
                  <div style={styles.detailLabel}>Attendees</div>
                  <div style={styles.detailValue}>{event.attendees} registered</div>
                </div>
              </div>
            </div>

            <div style={styles.divider}></div>

            {/* Action Buttons */}
            <div style={styles.actionsSection}>
              <button style={styles.registerBtn}>Register Now</button>
              <div style={styles.secondaryActions}>
                <button style={styles.secondaryBtn}><Bookmark size={16} /> Save</button>
                <button style={styles.secondaryBtn}><Share2 size={16} /> Share</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  header: { backgroundColor: 'white', borderBottom: '1px solid #e0e0e0', padding: '20px 40px' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'transparent', border: 'none', color: '#666', fontSize: '16px', cursor: 'pointer' },
  mainContent: { maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' },
  leftColumn: { display: 'flex', flexDirection: 'column', gap: '24px' },
  eventImage: { backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  image: { width: '100%', height: '400px', objectFit: 'cover' },
  eventInfo: { backgroundColor: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  categoryBadge: { display: 'inline-block', padding: '6px 16px', backgroundColor: '#e3f2fd', color: '#1976d2', borderRadius: '20px', fontSize: '14px', fontWeight: '600', marginBottom: '16px' },
  eventTitle: { fontSize: '32px', fontWeight: '700', color: '#2c3e50', marginBottom: '24px', lineHeight: '1.3' },
  authorSection: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' },
  authorAvatar: { width: '48px', height: '48px', backgroundColor: '#ccc', borderRadius: '50%' },
  authorName: { fontSize: '16px', fontWeight: '600', color: '#2c3e50' },
  authorRole: { fontSize: '14px', color: '#666' },
  divider: { height: '1px', backgroundColor: '#e0e0e0', margin: '24px 0' },
  sectionTitle: { fontSize: '24px', fontWeight: '600', color: '#2c3e50', marginBottom: '16px' },
  description: { fontSize: '16px', color: '#546e7a', lineHeight: '1.7', marginBottom: '24px' },
  subTitle: { fontSize: '20px', fontWeight: '600', color: '#2c3e50', marginBottom: '12px' },
  highlightsList: { listStyle: 'none', padding: 0, margin: 0 },
  highlightItem: { fontSize: '16px', color: '#546e7a', marginBottom: '12px', paddingLeft: '24px', position: 'relative' },
  rightColumn: { position: 'sticky', top: '20px', height: 'fit-content' },
  detailsCard: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  progressSection: { marginBottom: '20px' },
  progressHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  progressLabel: { fontSize: '14px', fontWeight: '600', color: '#666' },
  progressCount: { fontSize: '14px', fontWeight: '700', color: '#2c3e50' },
  progressBar: { width: '100%', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #1976d2 0%, #9c27b0 100%)', borderRadius: '4px', transition: 'width 0.3s ease' },
  spotsRemaining: { fontSize: '12px', color: '#666', margin: 0 },
  detailsSection: { display: 'flex', flexDirection: 'column', gap: '20px' },
  detailItem: { display: 'flex', gap: '12px' },
  detailLabel: { fontSize: '14px', fontWeight: '600', color: '#2c3e50', marginBottom: '4px' },
  detailValue: { fontSize: '14px', color: '#666' },
  actionsSection: { display: 'flex', flexDirection: 'column', gap: '12px' },
  registerBtn: { width: '100%', padding: '14px', background: 'linear-gradient(90deg, #1976d2 0%, #9c27b0 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  secondaryActions: { display: 'flex', gap: '12px' },
  secondaryBtn: { flex: 1, padding: '10px', backgroundColor: 'transparent', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },
};

export default EventDetail;
