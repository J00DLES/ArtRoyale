import { Routes, Route } from "react-router";
import { useAuth } from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserPage from "./pages/UserPage";
import CharacterCreation from "./pages/CharacterCreation";
import CharacterPage from "./pages/CharacterPage";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users/:id" element={<UserPage />} />
          <Route path="/characters/new" element={<CharacterCreation />} />
          <Route path="/characters/:id" element={<CharacterPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
