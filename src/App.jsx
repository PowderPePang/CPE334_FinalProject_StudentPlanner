import { useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

function App() {
    return (
        <div style={styles.landingPage}>
            {/* Header/Navigation */}
            <header style={styles.navbar}>
                <div style={styles.navBrand}>
                    <div style={styles.logo}>YP</div>
                    <span style={styles.brandName}>Yes we can Planner</span>
                </div>
                <nav style={styles.navLinks}>
                    <a href="#home" style={styles.navLink}>Home</a>
                    <a href="#parents" style={styles.navLink}>For Partner</a>
                    <a href="#about" style={styles.navLink}>About</a>
                    <a href="#tips" style={styles.navLink}>Study Tips</a>
                </nav>
                <div style={styles.navActions}>
                    <Link to="/register" style={styles.btnSignup}>
                        Sign Up
                    </Link>
                    <Link to="/login" style={styles.btnLogin}>
                        Log in
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <main style={styles.heroSection}>
                <div style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>
                        The Ultimate 
                        <br />
                        Productivity Tool
                    </h1>
                    <p style={styles.heroDescription}>
                        Many students struggle with procrastination, missed deadlines, and academic stress — Yes We Can Planner is here to change that.
Designed to meet the real demands of student life, it’s the smarter way to plan, stay focused, and achieve success.
                    </p>
                    <Link to="/register" style={styles.btnGetStarted}>
                        Get started for free
                    </Link>
                </div>
                <div style={styles.heroImage}>
                    <div style={styles.mockupPlaceholder}>
                        📱 App Preview
                    </div>
                </div>
            </main>
        </div>
    );
}

const styles = {
    landingPage: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 60px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    },
    navBrand: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    logo: {
        width: '45px',
        height: '45px',
        backgroundColor: '#1976d2',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '16px',
    },
    brandName: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#2c3e50',
    },
    navLinks: {
        display: 'flex',
        gap: '40px',
        alignItems: 'center',
    },
    navLink: {
        color: '#1976d2',
        textDecoration: 'none',
        fontSize: '15px',
        fontWeight: '500',
        transition: 'color 0.3s ease',
        cursor: 'pointer',
    },
    navActions: {
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
    },
    btnSignup: {
        padding: '10px 28px',
        backgroundColor: '#1976d2',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '25px',
        fontSize: '15px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
    },
    btnLogin: {
        padding: '10px 28px',
        backgroundColor: 'transparent',
        color: '#1976d2',
        textDecoration: 'none',
        borderRadius: '25px',
        fontSize: '15px',
        fontWeight: '600',
        border: '2px solid #1976d2',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    heroSection: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '80px 60px',
        maxWidth: '1400px',
        margin: '0 auto',
        gap: '60px',
    },
    heroContent: {
        flex: '1',
        maxWidth: '600px',
    },
    heroTitle: {
        fontSize: '52px',
        fontWeight: '700',
        color: '#2c3e50',
        lineHeight: '1.2',
        marginBottom: '24px',
    },
    heroDescription: {
        fontSize: '18px',
        color: '#546e7a',
        lineHeight: '1.7',
        marginBottom: '36px',
    },
    btnGetStarted: {
        display: 'inline-block',
        padding: '16px 40px',
        backgroundColor: '#1976d2',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '30px',
        fontSize: '16px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
        cursor: 'pointer',
    },
    heroImage: {
        flex: '1',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mockupPlaceholder: {
        width: '400px',
        height: '500px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px',
        fontWeight: '600',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    },
};

export default App;