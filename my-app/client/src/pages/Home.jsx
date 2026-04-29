import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router";
import logo from "../assets/logo.png";

function Home() {
  const { user } = useAuth();

  return (
    <div style={{ textAlign: "center" }}>
      <h2>{user ? `Welcome to Art Royale, ${user.username}!` : "Welcome to Art Royale!"}</h2>
      <p>ArtRoyale is a platform for creating and sharing digital art. Upload your artwork and attack other's characters to earn points!</p>
      <p>
        <Link to="/characters/recent" className="home-link">
          View recent characters
        </Link>
      </p>
      <p>
        <Link to="/inspiration" className="home-link">
          Explore random inspiration
        </Link>
      </p>
      
      
    </div>
  );
}

export default Home;
