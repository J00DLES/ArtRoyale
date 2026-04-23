import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useParams } from "react-router";


function UserCharacters() {
    const { id: userId } = useParams();
    const { user } = useAuth();
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchCharacters() {
            setLoading(true);
            try {
                const res = await fetch(`/api/users/${userId}/characters`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to fetch characters.");
                }

                setCharacters(data.characters || []);
            } catch (err) {
                setError(err.message || "Failed to fetch characters.");
            } finally {
                setLoading(false);
            }
        }

        fetchCharacters();
    }, [userId]);

    if (error) {
        return <p>{error}</p>;
    }

    if (loading) {
        return <p>Loading characters...</p>;
    }

    if (characters.length === 0) {
        return <p>No characters found for this user.</p>;
    }

    return (
        <div>
            <h2>{user?.username}'s Characters</h2>
            <ul>
                {characters.map((char) => (
                    <li key={char.id}>
                        <Link to={`/characters/${char.id}`}>{char.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserCharacters;