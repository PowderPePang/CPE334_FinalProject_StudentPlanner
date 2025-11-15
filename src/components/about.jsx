import { Link } from "react-router-dom";

function About() {
    return (
        <div style={styles.aboutPage}>
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
                    <a href="#partners" style={styles.navLink}>
                        For Partner
                    </a>
                    <a href="#about" style={styles.navLink}>
                        About
                    </a>
                    <a href="#tips" style={styles.navLink}>
                        Study Tips
                    </a>
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
            <section style={styles.heroSection}>
                <div style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>About Yes We Can Planner</h1>
                    <p style={styles.heroSubtitle}>
                        Empowering students and organizers to achieve more through smart planning
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <main style={styles.mainContent}>
                {/* Project Origin */}
                <section style={styles.section}>
                    <div style={styles.sectionContent}>
                        <div style={styles.badge}>Project Origin</div>
                        <h2 style={styles.sectionTitle}>Built on Software Engineering Excellence</h2>
                        <p style={styles.sectionText}>
                            Yes We Can Planner was conceived and developed as part of <strong>CPE 334 - Software Engineering</strong>, 
                            where we applied industry-standard development practices, agile methodologies, and user-centered design 
                            principles to create a solution that addresses real-world productivity challenges faced by students 
                            and event organizers.
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section style={styles.sectionAlt}>
                    <div style={styles.sectionContent}>
                        <div style={styles.iconBox}>
                            <span style={styles.icon}>🎯</span>
                        </div>
                        <h2 style={styles.sectionTitle}>Our Mission</h2>
                        <p style={styles.sectionText}>
                            To bridge the gap between academic demands and effective time management by providing 
                            an intuitive platform that helps students stay organized, meet deadlines, and reduce stress 
                            while enabling organizers to plan and coordinate events seamlessly.
                        </p>
                    </div>
                </section>

                {/* What We Offer - Two Columns */}
                <section style={styles.section}>
                    <h2 style={styles.centerTitle}>What We Offer</h2>
                    <div style={styles.twoColumns}>
                        <div style={styles.card}>
                            <div style={styles.cardIcon}>📚</div>
                            <h3 style={styles.cardTitle}>For Students</h3>
                            <ul style={styles.featureList}>
                                <li style={styles.featureItem}>
                                    <span style={styles.checkmark}>✓</span>
                                    New events alert and notifications
                                </li>
                                <li style={styles.featureItem}>
                                    <span style={styles.checkmark}>✓</span>
                                    Academic calendar integration
                                </li>
                                <li style={styles.featureItem}>
                                    <span style={styles.checkmark}>✓</span>
                                    Study session planning and reminders
                                </li>
                                <li style={styles.featureItem}>
                                    <span style={styles.checkmark}>✓</span>
                                    First to know about event updates
                                </li>
                            </ul>
                        </div>

                        <div style={styles.card}>
                            <div style={styles.cardIcon}>🎪</div>
                            <h3 style={styles.cardTitle}>For Organizers</h3>
                            <ul style={styles.featureList}>
                                <li style={styles.featureItem}>
                                    <span style={styles.checkmark}>✓</span>
                                    Easy event creation and management
                                </li>
                                <li style={styles.featureItem}>
                                    <span style={styles.checkmark}>✓</span>
                                    Customizable event pages and registration forms
                                </li>
                                <li style={styles.featureItem}>
                                    <span style={styles.checkmark}>✓</span>
                                    Attendance tracking and analytics
                                </li>
                                <li style={styles.featureItem}>
                                    <span style={styles.checkmark}>✓</span>
                                    Automated reminders and follow-ups
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section style={styles.sectionAlt}>
                    <div style={styles.sectionContent}>
                        <h2 style={styles.centerTitle}>Why Choose Yes We Can Planner?</h2>
                        <div style={styles.threeColumns}>
                            <div style={styles.benefit}>
                                <div style={styles.benefitIcon}>⚡</div>
                                <h4 style={styles.benefitTitle}>Intuitive Design</h4>
                                <p style={styles.benefitText}>
                                    Clean, user-friendly interface that requires no learning curve
                                </p>
                            </div>
                            <div style={styles.benefit}>
                                <div style={styles.benefitIcon}>🔒</div>
                                <h4 style={styles.benefitTitle}>Secure & Reliable</h4>
                                <p style={styles.benefitText}>
                                    Your data is protected with industry-standard security measures
                                </p>
                            </div>
                            <div style={styles.benefit}>
                                <div style={styles.benefitIcon}>🚀</div>
                                <h4 style={styles.benefitTitle}>Always Improving</h4>
                                <p style={styles.benefitText}>
                                    Regular updates based on user feedback and evolving needs
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section style={styles.ctaSection}>
                    <h2 style={styles.ctaTitle}>Ready to Transform Your Productivity?</h2>
                    <p style={styles.ctaText}>
                        Join thousands of students and organizers who have already discovered the power of smart planning
                    </p>
                    <Link to="/register" style={styles.btnCta}>
                        Get Started Today
                    </Link>
                </section>
            </main>

            {/* Footer */}
            <footer style={styles.footer}>
                <p style={styles.footerText}>
                    © 2024 Yes We Can Planner. A CPE 334 Software Engineering Project.
                </p>
            </footer>
        </div>
    );
}

const styles = {
    aboutPage: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fdf8e3f2 0%, #f5f5f5fe 100%)",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
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
        boxShadow: "0 4px 12px rgba(251, 191, 36, 0.3)",
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
        padding: "80px 60px 60px",
        textAlign: "center",
        background: "linear-gradient(135deg, rgba(234, 88, 12, 0.05) 0%, rgba(251, 191, 36, 0.05) 100%)",
    },
    heroContent: {
        maxWidth: "800px",
        margin: "0 auto",
    },
    heroTitle: {
        fontSize: "48px",
        fontWeight: "700",
        color: "#2c3e50",
        marginBottom: "16px",
    },
    heroSubtitle: {
        fontSize: "20px",
        color: "#546e7a",
        lineHeight: "1.6",
    },
    mainContent: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 40px 60px",
    },
    section: {
        padding: "60px 0",
    },
    sectionAlt: {
        padding: "60px 40px",
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        borderRadius: "20px",
        margin: "40px 0",
    },
    sectionContent: {
        maxWidth: "800px",
        margin: "0 auto",
    },
    badge: {
        display: "inline-block",
        padding: "8px 20px",
        backgroundColor: "#FBBF24",
        color: "white",
        borderRadius: "20px",
        fontSize: "14px",
        fontWeight: "600",
        marginBottom: "20px",
    },
    sectionTitle: {
        fontSize: "36px",
        fontWeight: "700",
        color: "#2c3e50",
        marginBottom: "24px",
    },
    centerTitle: {
        fontSize: "36px",
        fontWeight: "700",
        color: "#2c3e50",
        marginBottom: "48px",
        textAlign: "center",
    },
    sectionText: {
        fontSize: "18px",
        color: "#546e7a",
        lineHeight: "1.8",
        marginBottom: "16px",
    },
    iconBox: {
        marginBottom: "24px",
    },
    icon: {
        fontSize: "48px",
    },
    twoColumns: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "40px",
    },
    card: {
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        transition: "transform 0.3s ease",
    },
    cardIcon: {
        fontSize: "48px",
        marginBottom: "20px",
    },
    cardTitle: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#2c3e50",
        marginBottom: "24px",
    },
    featureList: {
        listStyle: "none",
        padding: 0,
        margin: 0,
    },
    featureItem: {
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        marginBottom: "16px",
        fontSize: "16px",
        color: "#546e7a",
        lineHeight: "1.6",
    },
    checkmark: {
        color: "#FBBF24",
        fontWeight: "700",
        fontSize: "18px",
        flexShrink: 0,
    },
    threeColumns: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "32px",
        marginTop: "40px",
    },
    benefit: {
        textAlign: "center",
    },
    benefitIcon: {
        fontSize: "48px",
        marginBottom: "16px",
    },
    benefitTitle: {
        fontSize: "20px",
        fontWeight: "600",
        color: "#2c3e50",
        marginBottom: "12px",
    },
    benefitText: {
        fontSize: "16px",
        color: "#546e7a",
        lineHeight: "1.6",
    },
    ctaSection: {
        textAlign: "center",
        padding: "80px 40px",
        backgroundColor: "rgba(234, 88, 12, 0.05)",
        borderRadius: "20px",
        margin: "60px 0",
    },
    ctaTitle: {
        fontSize: "40px",
        fontWeight: "700",
        color: "#2c3e50",
        marginBottom: "16px",
    },
    ctaText: {
        fontSize: "18px",
        color: "#546e7a",
        marginBottom: "32px",
        lineHeight: "1.6",
    },
    btnCta: {
        display: "inline-block",
        padding: "16px 48px",
        backgroundColor: "#EA580C",
        color: "white",
        textDecoration: "none",
        borderRadius: "30px",
        fontSize: "16px",
        fontWeight: "600",
        transition: "all 0.3s ease",
        boxShadow: "0 6px 20px rgba(234, 88, 12, 0.4)",
        cursor: "pointer",
    },
    footer: {
        textAlign: "center",
        padding: "40px 20px",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderTop: "1px solid rgba(0, 0, 0, 0.05)",
    },
    footerText: {
        fontSize: "14px",
        color: "#546e7a",
        margin: 0,
    },
};

export default About;