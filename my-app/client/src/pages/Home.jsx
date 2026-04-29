import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router";
import logo from "../assets/logo.png";

function Home() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="hero-badge">Create, challenge, repeat</p>
          <h1>{user ? `Welcome back, ${user.username}.` : "Welcome to Art Royale."}</h1>
          <p className="home-lead">
            Build characters, discover fresh visual references, and trade attacks with the rest of the arena.
          </p>
          <div className="home-actions">
            <Link to="/characters/recent" className="btn btn-primary">
              View recent characters
            </Link>
            <Link to="/inspiration" className="btn btn-secondary">
              Explore inspiration
            </Link>
          </div>
        </div>

        <div className="home-hero-card">
          <img src={logo} alt="Art Royale" className="home-logo" />
          <div className="home-stat-grid">
            <Link to="/characters/new" className="stat-card stat-link">
              <span className="stat-label">Start</span>
              <strong>Create a character</strong>
            </Link>
            <Link to="/characters/recent" className="stat-card stat-link">
              <span className="stat-label">Browse</span>
              <strong>Find recent art</strong>
            </Link>
            <Link to="/inspiration" className="stat-card stat-link">
              <span className="stat-label">Spark</span>
              <strong>Find Inspiration</strong>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-grid">
        <article className="feature-card">
          <p className="feature-kicker">Characters</p>
          <h2>Build a lineup that stands out.</h2>
          <p>Upload art, add a description, and turn each character into part of your roster.</p>
        </article>

        <article className="feature-card">
          <p className="feature-kicker">Battles</p>
          <h2>Attack characters with a custom message.</h2>
          <p>Send a challenge image and leave a reply that others can respond to from the character page.</p>
        </article>
      </section>
    </div>
  );
}

export default Home;
