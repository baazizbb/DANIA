import "./About.css";

export default function About() {
  return (
    <div className="about-container">
      <section className="about-hero">
        <h1>About Us</h1>
        <p>
          We build clean, reliable, and user-focused web experiences for modern
          businesses.
        </p>
      </section>

      <section className="about-grid">
        <article className="about-card">
          <h2>Who We Are</h2>
          <p>
            We are a team of designers and developers focused on creating
            practical digital products that solve real business problems.
          </p>
        </article>

        <article className="about-card">
          <h2>Our Mission</h2>
          <p>
            Our mission is to deliver fast, accessible, and scalable solutions
            that help companies grow with confidence.
          </p>
        </article>

        <article className="about-card">
          <h2>Our Values</h2>
          <ul>
            <li>Quality in every detail</li>
            <li>Transparent communication</li>
            <li>Long-term partnership mindset</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
