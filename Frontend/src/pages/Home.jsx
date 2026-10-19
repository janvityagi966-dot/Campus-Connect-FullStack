import { Link } from "react-router-dom";

const features = [
  { icon: "◎", title: "Discover opportunities", text: "Find relevant internships and entry-level roles in one place." },
  { icon: "↗", title: "Apply with confidence", text: "Keep your placement journey organized from application to outcome." },
  { icon: "✦", title: "Show your strengths", text: "Build a student profile that highlights the skills you are growing." }
];

export default function Home() {
  return (
    <main>
      <section className="hero-shell">
        <div className="hero container">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> YOUR NEXT OPPORTUNITY STARTS HERE</div>
            <h1>Make your next move <span>count.</span></h1>
            <p>One place to discover jobs, take the next step, and stay on top of your placement journey.</p>
            <div className="hero-actions">
              <Link className="button button-primary button-large" to="/jobs">Explore opportunities <span aria-hidden="true">→</span></Link>
              <Link className="button button-ghost button-large" to="/register">Create your profile</Link>
            </div>
            <div className="hero-note"><span className="note-check">✓</span> Organized. Focused. Career-ready.</div>
          </div>
          <div className="hero-visual" aria-label="Illustration of a student opportunity dashboard">
            <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
            <div className="visual-card main-visual-card">
              <div className="mini-card-top"><span className="mini-logo">cc</span><span className="live-pill">OPPORTUNITY MATCH</span></div>
              <div className="visual-title">Your next chapter</div>
              <div className="visual-subtitle">A little progress every day.</div>
              <div className="progress-track"><span /></div>
              <div className="visual-progress-row"><span>Profile strength</span><strong>Growing</strong></div>
              <div className="visual-divider" />
              <div className="visual-role"><div className="role-icon">✦</div><div><strong>Frontend Developer</strong><small>Internship · Flexible</small></div><span className="role-arrow">↗</span></div>
              <div className="visual-role"><div className="role-icon role-icon-purple">⌘</div><div><strong>Software Engineer</strong><small>Entry level · Full-time</small></div><span className="role-arrow">↗</span></div>
            </div>
            <div className="floating-chip chip-top"><span>✓</span> Keep moving forward</div>
            <div className="floating-chip chip-bottom"><span className="chip-spark">✦</span> Your journey, organized</div>
          </div>
        </div>
      </section>

      <section className="section container" id="features">
        <div className="section-intro"><p className="eyebrow">BUILT FOR YOUR JOURNEY</p><h2>Everything in one place.<br /><span>Less to keep track of.</span></h2><p>Spend less time switching between tools and more time preparing for what comes next.</p></div>
        <div className="feature-grid">
          {features.map((item, index) => <article className="feature-card" key={item.title}><div className={`feature-symbol symbol-${index}`}>{item.icon}</div><h3>{item.title}</h3><p>{item.text}</p><span className="feature-number">0{index + 1}</span></article>)}
        </div>
      </section>

      <section className="cta-section"><div className="container cta-inner"><div><p className="eyebrow eyebrow-light">YOUR JOURNEY BEGINS HERE</p><h2>Ready to take the next step?</h2><p>Create your account and keep your opportunities organized.</p></div><Link className="button button-white button-large" to="/register">Get started free <span aria-hidden="true">→</span></Link></div></section>
      <footer className="footer"><div className="container footer-inner"><Link className="brand brand-footer" to="/"><span className="brand-mark">C</span><span>CampusConnect</span></Link><span>Built to help students move forward.</span><span>© 2026 CampusConnect</span></div></footer>
    </main>
  );
}
