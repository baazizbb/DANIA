import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1 className="hero-title">
          Welcome to <span className="highlight">MyApp</span>
        </h1>
        <p className="hero-subtitle">
          Building amazing experiences with React and modern web technologies
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary">Get Started</button>
          <button className="btn btn-secondary">Learn More</button>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">Our Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">⚡</span>
            <h3>Fast Performance</h3>
            <p>Lightning-fast load times and smooth interactions</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🎨</span>
            <h3>Modern Design</h3>
            <p>Beautiful and responsive user interfaces</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔒</span>
            <h3>Secure</h3>
            <p>Built with security best practices in mind</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📱</span>
            <h3>Responsive</h3>
            <p>Works perfectly on all devices and screen sizes</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of users who trust our platform</p>
        <button className="btn btn-primary btn-large">Sign Up Now</button>
      </section>
    </div>
  );
}
