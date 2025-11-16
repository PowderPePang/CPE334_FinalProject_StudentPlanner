import { Link } from "react-router-dom";
import "./App.css";
import previewImage from "./assets/design-Photoroom.png"; // ✅ ใช้ไฟล์ที่คุณอัปโหลด

function App() {
    return (
        <div style={styles.landingPage}>
            {/* Header/Navigation */}
            <header style={styles.navbar}>
                <div style={styles.navBrand}>
                    <img src="/Logo.svg" alt="Logo" style={styles.logo} />
                    <span style={styles.brandName}>Yes we can Planner</span>
                </div>
                <nav style={styles.navLinks}>
                    <Link to="/" style={styles.navLink}>
                        Home
                    </Link>
                    <Link to="/partner" style={styles.navLink}>
                        For Partner
                    </Link>
                    <Link to="/about" style={styles.navLink}>
                        About
                    </Link>
                    <Link to="/study-tips" style={styles.navLink}>
                        Study Tips
                    </Link>
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
                        Many students struggle with procrastination, missed
                        deadlines, and academic stress – Yes We Can Planner is
                        here to change that. Designed to meet the real demands
                        of student life, it's the smarter way to plan, stay
                        focused, and achieve success.
                    </p>
                    <Link to="/register" style={styles.btnGetStarted}>
                        Get started for free
                    </Link>
                </div>

                {/* ✅ App Preview Image (no border, no box shadow) */}
                <div style={styles.heroImage}>
                    <img
                        src={previewImage}
                        alt="App Preview"
                        style={styles.previewImage}
                    />
                </div>
            </main>
        </div>
    );
}

const styles = {
    landingPage: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fdf8e3f2 0%, #f5f5f5fe 100%)",
        fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 60px",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
    },
    navBrand: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    logo: {
        width: "70px",
        height: "70px",
        objectFit: "contain",
    },
    brandName: {
        fontSize: "20px",
        fontWeight: "600",
        color: "#2c3e50",
    },
    navLinks: {
        display: "flex",
        gap: "40px",
        alignItems: "center",
    },
    navLink: {
        color: "#EA580C",
        textDecoration: "none",
        fontSize: "15px",
        fontWeight: "500",
        transition: "color 0.3s ease",
        cursor: "pointer",
    },
    navActions: {
        display: "flex",
        gap: "15px",
        alignItems: "center",
    },
    btnSignup: {
        padding: "10px 28px",
        backgroundColor: "#FBBF24",
        color: "white",
        textDecoration: "none",
        borderRadius: "25px",
        fontSize: "15px",
        fontWeight: "600",
        transition: "all 0.3s ease",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
    },
    btnLogin: {
        padding: "10px 28px",
        backgroundColor: "transparent",
        color: "#FBBF24",
        textDecoration: "none",
        borderRadius: "25px",
        fontSize: "15px",
        fontWeight: "600",
        border: "2px solid #FBBF24",
        cursor: "pointer",
        transition: "all 0.3s ease",
    },
    heroSection: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 40px", // ลดขอบรอบนอก
        gap: "20px", // ลดช่องว่างตรงกลางระหว่างข้อความกับรูป
    },
    heroContent: {
        flex: "1",
        maxWidth: "600px",
    },
    heroTitle: {
        fontSize: "52px",
        fontWeight: "700",
        color: "#2c3e50",
        lineHeight: "1.2",
        marginBottom: "24px",
    },
    heroDescription: {
        fontSize: "18px",
        color: "#546e7a",
        lineHeight: "1.7",
        marginBottom: "36px",
    },
    btnGetStarted: {
        display: "inline-block",
        padding: "16px 40px",
        backgroundColor: "#EA580C",
        color: "white",
        textDecoration: "none",
        borderRadius: "30px",
        fontSize: "16px",
        fontWeight: "600",
        transition: "all 0.3s ease",
        boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
        cursor: "pointer",
    },
    heroImage: {
        flex: "1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    previewImage: {
        width: "700px",
        height: "auto",
        borderRadius: "0px", // ✅ ไม่มีขอบโค้ง
        boxShadow: "none", // ✅ ไม่มีเงา
        background: "transparent", // ✅ ไม่มีพื้นหลัง
    },
};

export default App;