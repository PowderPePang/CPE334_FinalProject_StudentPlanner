import { Link } from "react-router-dom";

function StudyTips() {
    return (
        <div style={styles.tipsPage}>
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
            <section style={styles.heroSection}>
                <div style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>Study Tips & Strategies</h1>
                    <p style={styles.heroSubtitle}>
                        Proven techniques to boost your productivity, ace your exams, and achieve academic success
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <main style={styles.mainContent}>
                {/* Introduction */}
                <section style={styles.section}>
                    <div style={styles.sectionContent}>
                        <div style={styles.badge}>Expert Advice</div>
                        <h2 style={styles.sectionTitle}>Master Your Study Game</h2>
                        <p style={styles.sectionText}>
                            Success in academics isn't just about studying harder—it's about studying smarter. 
                            We've compiled research-backed strategies and practical tips from top-performing students 
                            and educational experts to help you maximize your learning potential and minimize stress.
                        </p>
                    </div>
                </section>

                {/* Time Management Tips */}
                <section style={styles.sectionAlt}>
                    <h2 style={styles.centerTitle}>⏰ Time Management Mastery</h2>
                    <div style={styles.twoColumns}>
                        <div style={styles.tipCard}>
                            <div style={styles.tipNumber}>1</div>
                            <h3 style={styles.tipTitle}>The Pomodoro Technique</h3>
                            <p style={styles.tipText}>
                                Study in focused 25-minute blocks followed by 5-minute breaks. After four cycles, 
                                take a longer 15-30 minute break. This prevents burnout and maintains high concentration.
                            </p>
                        </div>
                        <div style={styles.tipCard}>
                            <div style={styles.tipNumber}>2</div>
                            <h3 style={styles.tipTitle}>Time Blocking</h3>
                            <p style={styles.tipText}>
                                Schedule specific time blocks for different subjects or tasks. Treat these blocks 
                                like important appointments that can't be missed. Use Yes We Can Planner to organize them!
                            </p>
                        </div>
                        <div style={styles.tipCard}>
                            <div style={styles.tipNumber}>3</div>
                            <h3 style={styles.tipTitle}>Eat the Frog First</h3>
                            <p style={styles.tipText}>
                                Tackle your most challenging or important task first thing in the day when your 
                                energy and focus are at their peak. Everything else becomes easier afterward.
                            </p>
                        </div>
                        <div style={styles.tipCard}>
                            <div style={styles.tipNumber}>4</div>
                            <h3 style={styles.tipTitle}>The 2-Minute Rule</h3>
                            <p style={styles.tipText}>
                                If a task takes less than 2 minutes, do it immediately. This prevents small tasks 
                                from piling up and becoming overwhelming later.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Study Techniques */}
                <section style={styles.section}>
                    <h2 style={styles.centerTitle}>📚 Effective Study Techniques</h2>
                    <div style={styles.techniqueGrid}>
                        <div style={styles.techniqueCard}>
                            <div style={styles.techniqueIcon}>🎯</div>
                            <h3 style={styles.techniqueTitle}>Active Recall</h3>
                            <p style={styles.techniqueText}>
                                Test yourself regularly instead of just re-reading notes. Close your book and try 
                                to recall information from memory. This strengthens neural connections and improves retention.
                            </p>
                            <div style={styles.tipLabel}>Effectiveness: ⭐⭐⭐⭐⭐</div>
                        </div>
                        <div style={styles.techniqueCard}>
                            <div style={styles.techniqueIcon}>🔄</div>
                            <h3 style={styles.techniqueTitle}>Spaced Repetition</h3>
                            <p style={styles.techniqueText}>
                                Review material at increasing intervals (1 day, 3 days, 1 week, 2 weeks). This fights 
                                the forgetting curve and moves information into long-term memory.
                            </p>
                            <div style={styles.tipLabel}>Effectiveness: ⭐⭐⭐⭐⭐</div>
                        </div>
                        <div style={styles.techniqueCard}>
                            <div style={styles.techniqueIcon}>🗺️</div>
                            <h3 style={styles.techniqueTitle}>Mind Mapping</h3>
                            <p style={styles.techniqueText}>
                                Create visual diagrams that connect concepts and ideas. This helps you see the big 
                                picture and understand relationships between different topics.
                            </p>
                            <div style={styles.tipLabel}>Effectiveness: ⭐⭐⭐⭐</div>
                        </div>
                        <div style={styles.techniqueCard}>
                            <div style={styles.techniqueIcon}>👥</div>
                            <h3 style={styles.techniqueTitle}>The Feynman Technique</h3>
                            <p style={styles.techniqueText}>
                                Explain concepts in simple terms as if teaching someone else. If you can't explain it 
                                simply, you don't understand it well enough. This reveals knowledge gaps.
                            </p>
                            <div style={styles.tipLabel}>Effectiveness: ⭐⭐⭐⭐⭐</div>
                        </div>
                        <div style={styles.techniqueCard}>
                            <div style={styles.techniqueIcon}>✍️</div>
                            <h3 style={styles.techniqueTitle}>Cornell Note-Taking</h3>
                            <p style={styles.techniqueText}>
                                Divide your page into sections: notes, cues, and summary. This structured approach 
                                makes review sessions more efficient and improves information retention.
                            </p>
                            <div style={styles.tipLabel}>Effectiveness: ⭐⭐⭐⭐</div>
                        </div>
                        <div style={styles.techniqueCard}>
                            <div style={styles.techniqueIcon}>🎓</div>
                            <h3 style={styles.techniqueTitle}>Practice Testing</h3>
                            <p style={styles.techniqueText}>
                                Use past exams, practice problems, and quizzes to prepare. This reduces test anxiety 
                                and helps you identify weak areas that need more attention.
                            </p>
                            <div style={styles.tipLabel}>Effectiveness: ⭐⭐⭐⭐⭐</div>
                        </div>
                    </div>
                </section>

                {/* Productivity Hacks */}
                <section style={styles.sectionAlt}>
                    <div style={styles.sectionContent}>
                        <h2 style={styles.centerTitle}>⚡ Productivity Hacks</h2>
                        <div style={styles.hacksList}>
                            <div style={styles.hackItem}>
                                <span style={styles.hackIcon}>🌅</span>
                                <div style={styles.hackContent}>
                                    <h4 style={styles.hackTitle}>Study During Your Peak Hours</h4>
                                    <p style={styles.hackText}>
                                        Identify when you're most alert (morning, afternoon, or evening) and schedule 
                                        your hardest subjects during those times.
                                    </p>
                                </div>
                            </div>
                            <div style={styles.hackItem}>
                                <span style={styles.hackIcon}>📱</span>
                                <div style={styles.hackContent}>
                                    <h4 style={styles.hackTitle}>Eliminate Distractions</h4>
                                    <p style={styles.hackText}>
                                        Use apps to block social media, turn off notifications, and create a dedicated 
                                        study space free from interruptions.
                                    </p>
                                </div>
                            </div>
                            <div style={styles.hackItem}>
                                <span style={styles.hackIcon}>🎵</span>
                                <div style={styles.hackContent}>
                                    <h4 style={styles.hackTitle}>Use Background Sounds Wisely</h4>
                                    <p style={styles.hackText}>
                                        Some people focus better with instrumental music, white noise, or nature sounds. 
                                        Experiment to find what works for you—but avoid music with lyrics!
                                    </p>
                                </div>
                            </div>
                            <div style={styles.hackItem}>
                                <span style={styles.hackIcon}>💧</span>
                                <div style={styles.hackContent}>
                                    <h4 style={styles.hackTitle}>Stay Hydrated & Snack Smart</h4>
                                    <p style={styles.hackText}>
                                        Keep water nearby and choose brain-boosting snacks like nuts, fruits, and dark 
                                        chocolate. Avoid sugar crashes from junk food.
                                    </p>
                                </div>
                            </div>
                            <div style={styles.hackItem}>
                                <span style={styles.hackIcon}>💤</span>
                                <div style={styles.hackContent}>
                                    <h4 style={styles.hackTitle}>Prioritize Sleep</h4>
                                    <p style={styles.hackText}>
                                        Never sacrifice sleep for studying. Your brain consolidates memories during sleep. 
                                        Aim for 7-9 hours each night, especially before exams.
                                    </p>
                                </div>
                            </div>
                            <div style={styles.hackItem}>
                                <span style={styles.hackIcon}>🏃</span>
                                <div style={styles.hackContent}>
                                    <h4 style={styles.hackTitle}>Exercise Regularly</h4>
                                    <p style={styles.hackText}>
                                        Physical activity boosts blood flow to the brain, improves memory, and reduces 
                                        stress. Even a 15-minute walk can help!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Exam Preparation */}
                <section style={styles.section}>
                    <h2 style={styles.centerTitle}>📝 Exam Preparation Strategy</h2>
                    <div style={styles.timeline}>
                        <div style={styles.timelineItem}>
                            <div style={styles.timelineBadge}>4-6 Weeks Before</div>
                            <h4 style={styles.timelineTitle}>Start Early Review</h4>
                            <p style={styles.timelineText}>
                                Begin reviewing course materials and organizing your notes. Create a study schedule 
                                using Yes We Can Planner to spread out topics evenly.
                            </p>
                        </div>
                        <div style={styles.timelineItem}>
                            <div style={styles.timelineBadge}>2-3 Weeks Before</div>
                            <h4 style={styles.timelineTitle}>Intensive Practice</h4>
                            <p style={styles.timelineText}>
                                Work through practice problems, past exams, and review sessions. Focus on weak areas 
                                and clarify doubts with professors or study groups.
                            </p>
                        </div>
                        <div style={styles.timelineItem}>
                            <div style={styles.timelineBadge}>1 Week Before</div>
                            <h4 style={styles.timelineTitle}>Final Review & Mock Tests</h4>
                            <p style={styles.timelineText}>
                                Take full-length practice exams under timed conditions. Review all summaries and 
                                key concepts. Avoid learning new material at this stage.
                            </p>
                        </div>
                        <div style={styles.timelineItem}>
                            <div style={styles.timelineBadge}>Day Before</div>
                            <h4 style={styles.timelineTitle}>Light Review & Rest</h4>
                            <p style={styles.timelineText}>
                                Do a quick review of key formulas and concepts. Prepare your materials. Get a good 
                                night's sleep—cramming all night is counterproductive!
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section style={styles.ctaSection}>
                    <h2 style={styles.ctaTitle}>Ready to Level Up Your Study Game?</h2>
                    <p style={styles.ctaText}>
                        Start organizing your study schedule with Yes We Can Planner and put these tips into action!
                    </p>
                    <Link to="/register" style={styles.btnCta}>
                        Get Started Free
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
    tipsPage: {
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
    twoColumns: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
    },
    tipCard: {
        backgroundColor: "white",
        padding: "32px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        position: "relative",
    },
    tipNumber: {
        position: "absolute",
        top: "-15px",
        left: "32px",
        width: "40px",
        height: "40px",
        backgroundColor: "#FBBF24",
        color: "white",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px",
        fontWeight: "700",
        boxShadow: "0 4px 12px rgba(251, 191, 36, 0.4)",
    },
    tipTitle: {
        fontSize: "20px",
        fontWeight: "600",
        color: "#2c3e50",
        marginTop: "16px",
        marginBottom: "12px",
    },
    tipText: {
        fontSize: "16px",
        color: "#546e7a",
        lineHeight: "1.6",
    },
    techniqueGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "32px",
    },
    techniqueCard: {
        backgroundColor: "white",
        padding: "32px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        textAlign: "center",
    },
    techniqueIcon: {
        fontSize: "48px",
        marginBottom: "16px",
    },
    techniqueTitle: {
        fontSize: "20px",
        fontWeight: "600",
        color: "#2c3e50",
        marginBottom: "12px",
    },
    techniqueText: {
        fontSize: "15px",
        color: "#546e7a",
        lineHeight: "1.6",
        marginBottom: "16px",
    },
    tipLabel: {
        fontSize: "14px",
        color: "#FBBF24",
        fontWeight: "600",
    },
    hacksList: {
        display: "flex",
        flexDirection: "column",
        gap: "24px",
    },
    hackItem: {
        display: "flex",
        gap: "20px",
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
    },
    hackIcon: {
        fontSize: "40px",
        flexShrink: 0,
    },
    hackContent: {
        flex: 1,
    },
    hackTitle: {
        fontSize: "18px",
        fontWeight: "600",
        color: "#2c3e50",
        marginBottom: "8px",
    },
    hackText: {
        fontSize: "16px",
        color: "#546e7a",
        lineHeight: "1.6",
        margin: 0,
    },
    timeline: {
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        maxWidth: "800px",
        margin: "0 auto",
    },
    timelineItem: {
        backgroundColor: "white",
        padding: "32px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        borderLeft: "4px solid #FBBF24",
    },
    timelineBadge: {
        display: "inline-block",
        padding: "6px 16px",
        backgroundColor: "#EA580C",
        color: "white",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "600",
        marginBottom: "16px",
    },
    timelineTitle: {
        fontSize: "20px",
        fontWeight: "600",
        color: "#2c3e50",
        marginBottom: "12px",
    },
    timelineText: {
        fontSize: "16px",
        color: "#546e7a",
        lineHeight: "1.6",
        margin: 0,
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

export default StudyTips;