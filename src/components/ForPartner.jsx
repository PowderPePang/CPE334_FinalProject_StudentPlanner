import { Link } from "react-router-dom";

function ForPartner() {
    return (
        <div style={styles.partnerPage}>
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
                    <h1 style={styles.heroTitle}>Partner With Us</h1>
                    <p style={styles.heroSubtitle}>
                        Join forces with Yes We Can Planner to empower students and organizers across campuses
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <main style={styles.mainContent}>
                {/* Why Partner Section */}
                <section style={styles.section}>
                    <div style={styles.sectionContent}>
                        <div style={styles.badge}>Partnership Opportunities</div>
                        <h2 style={styles.sectionTitle}>Why Partner With Us?</h2>
                        <p style={styles.sectionText}>
                            Yes We Can Planner is rapidly becoming the go-to productivity platform for students and event organizers. 
                            By partnering with us, you gain access to a highly engaged community of ambitious students, innovative 
                            organizers, and forward-thinking institutions who are always looking for tools and services that enhance 
                            their academic and professional journey.
                        </p>
                    </div>
                </section>

                {/* Partnership Types */}
                <section style={styles.sectionAlt}>
                    <h2 style={styles.centerTitle}>Partnership Opportunities</h2>
                    <div style={styles.threeColumns}>
                        <div style={styles.card}>
                            <div style={styles.cardIcon}>🏫</div>
                            <h3 style={styles.cardTitle}>Educational Institutions</h3>
                            <p style={styles.cardText}>
                                Universities, colleges, and schools can integrate Yes We Can Planner into their 
                                student support systems, helping students manage coursework, deadlines, and campus events.
                            </p>
                            <ul style={styles.benefitList}>
                                <li style={styles.benefitItem}>Campus-wide deployment</li>
                                <li style={styles.benefitItem}>Custom branding options</li>
                                <li style={styles.benefitItem}>Student success analytics</li>
                                <li style={styles.benefitItem}>Integration with LMS systems</li>
                            </ul>
                        </div>

                        <div style={styles.card}>
                            <div style={styles.cardIcon}>🤝</div>
                            <h3 style={styles.cardTitle}>Corporate Partners</h3>
                            <p style={styles.cardText}>
                                Companies looking to reach student demographics can partner with us for brand visibility, 
                                recruitment opportunities, and sponsored features.
                            </p>
                            <ul style={styles.benefitList}>
                                <li style={styles.benefitItem}>Sponsored events and features</li>
                                <li style={styles.benefitItem}>Direct access to talent pool</li>
                                <li style={styles.benefitItem}>Brand integration opportunities</li>
                                <li style={styles.benefitItem}>Campus recruitment tools</li>
                            </ul>
                        </div>

                        <div style={styles.card}>
                            <div style={styles.cardIcon}>🎯</div>
                            <h3 style={styles.cardTitle}>Event Organizers</h3>
                            <p style={styles.cardText}>
                                Professional event companies and campus organizations can leverage our platform to 
                                streamline event management and reach wider audiences.
                            </p>
                            <ul style={styles.benefitList}>
                                <li style={styles.benefitItem}>Premium event tools</li>
                                <li style={styles.benefitItem}>Advanced analytics dashboard</li>
                                <li style={styles.benefitItem}>Priority support</li>
                                <li style={styles.benefitItem}>White-label solutions</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section style={styles.section}>
                    <h2 style={styles.centerTitle}>Partner Benefits</h2>
                    <div style={styles.twoColumns}>
                        <div style={styles.benefitCard}>
                            <div style={styles.benefitIcon}>📊</div>
                            <h4 style={styles.benefitTitle}>Data & Analytics</h4>
                            <p style={styles.benefitText}>
                                Access comprehensive analytics and insights about user engagement, event participation, 
                                and platform usage to inform your strategies.
                            </p>
                        </div>
                        <div style={styles.benefitCard}>
                            <div style={styles.benefitIcon}>🌟</div>
                            <h4 style={styles.benefitTitle}>Brand Visibility</h4>
                            <p style={styles.benefitText}>
                                Increase your brand presence among students and organizers through featured placements 
                                and co-marketing opportunities.
                            </p>
                        </div>
                        <div style={styles.benefitCard}>
                            <div style={styles.benefitIcon}>🔧</div>
                            <h4 style={styles.benefitTitle}>Custom Integration</h4>
                            <p style={styles.benefitText}>
                                We work with you to create tailored solutions that fit your specific needs and integrate 
                                seamlessly with your existing systems.
                            </p>
                        </div>
                        <div style={styles.benefitCard}>
                            <div style={styles.benefitIcon}>💼</div>
                            <h4 style={styles.benefitTitle}>Dedicated Support</h4>
                            <p style={styles.benefitText}>
                                Receive priority support from our partnership team to ensure smooth collaboration 
                                and maximum value from the partnership.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Success Stories */}
                <section style={styles.sectionAlt}>
                    <div style={styles.sectionContent}>
                        <h2 style={styles.centerTitle}>Success Stories</h2>
                        <div style={styles.testimonialGrid}>
                            <div style={styles.testimonial}>
                                <p style={styles.testimonialText}>
                                    "Partnering with Yes We Can Planner has transformed how our students manage their 
                                    academic responsibilities. We've seen a 40% improvement in deadline adherence."
                                </p>
                                <div style={styles.testimonialAuthor}>
                                    <strong>Dr. Sarah Johnson</strong>
                                    <span style={styles.testimonialRole}>Dean of Student Affairs, University XYZ</span>
                                </div>
                            </div>
                            <div style={styles.testimonial}>
                                <p style={styles.testimonialText}>
                                    "The platform's event management tools have helped us organize over 50 campus events 
                                    with unprecedented efficiency. Student engagement has never been higher."
                                </p>
                                <div style={styles.testimonialAuthor}>
                                    <strong>Michael Chen</strong>
                                    <span style={styles.testimonialRole}>Campus Activities Director, ABC College</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Form Section */}
                <section style={styles.section}>
                    <div style={styles.contactSection}>
                        <h2 style={styles.centerTitle}>Ready to Partner?</h2>
                        <p style={styles.contactSubtitle}>
                            Let's discuss how we can work together to create value for students and organizers
                        </p>
                        <div style={styles.contactInfo}>
                            <div style={styles.contactItem}>
                                <span style={styles.contactIcon}>📧</span>
                                <div>
                                    <h4 style={styles.contactLabel}>Email Us</h4>
                                    <p style={styles.contactValue}>partnerships@yeswecanplanner.com</p>
                                </div>
                            </div>
                            <div style={styles.contactItem}>
                                <span style={styles.contactIcon}>📱</span>
                                <div>
                                    <h4 style={styles.contactLabel}>Call Us</h4>
                                    <p style={styles.contactValue}>+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div style={styles.contactItem}>
                                <span style={styles.contactIcon}>📍</span>
                                <div>
                                    <h4 style={styles.contactLabel}>Visit Us</h4>
                                    <p style={styles.contactValue}> 126 Pracha Uthit Rd., Bang Mod, Thung Khru, Bangkok 10140, Thailand</p>
                                </div>
                            </div>
                        </div>
                        <Link to="/register" style={styles.btnCta}>
                            Start Partnership Discussion
                        </Link>
                    </div>
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
    partnerPage: {
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
    threeColumns: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "32px",
    },
    twoColumns: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "32px",
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
        marginBottom: "16px",
    },
    cardText: {
        fontSize: "16px",
        color: "#546e7a",
        lineHeight: "1.6",
        marginBottom: "24px",
    },
    benefitList: {
        listStyle: "none",
        padding: 0,
        margin: 0,
    },
    benefitItem: {
        fontSize: "15px",
        color: "#546e7a",
        marginBottom: "10px",
        paddingLeft: "20px",
        position: "relative",
    },
    benefitCard: {
        backgroundColor: "white",
        padding: "32px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
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
    testimonialGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "32px",
        marginTop: "40px",
    },
    testimonial: {
        backgroundColor: "white",
        padding: "32px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    },
    testimonialText: {
        fontSize: "16px",
        color: "#546e7a",
        lineHeight: "1.7",
        marginBottom: "24px",
        fontStyle: "italic",
    },
    testimonialAuthor: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },
    testimonialRole: {
        fontSize: "14px",
        color: "#94a3b8",
    },
    contactSection: {
        textAlign: "center",
        padding: "60px 40px",
        backgroundColor: "rgba(234, 88, 12, 0.05)",
        borderRadius: "20px",
    },
    contactSubtitle: {
        fontSize: "18px",
        color: "#546e7a",
        marginBottom: "48px",
    },
    contactInfo: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "32px",
        marginBottom: "48px",
        maxWidth: "900px",
        margin: "0 auto 48px",
    },
    contactItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        textAlign: "center",
    },
    contactIcon: {
        fontSize: "40px",
    },
    contactLabel: {
        fontSize: "16px",
        fontWeight: "600",
        color: "#2c3e50",
        marginBottom: "8px",
    },
    contactValue: {
        fontSize: "15px",
        color: "#546e7a",
        margin: 0,
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

export default ForPartner