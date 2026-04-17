import { useAuth } from "../hooks/useAuth";
import logo from "../assets/logo.png";

function Home() {
  const { user } = useAuth();

  return (
    <div style={{ textAlign: "center" }}>
      <h2>{user ? `Welcome to Art Royale, ${user.username}!` : "Welcome to Art Royale!"}</h2>
      <img src={logo} alt="Art Royale" className="home-logo" />
    </div>
  );
}

export default Home;
