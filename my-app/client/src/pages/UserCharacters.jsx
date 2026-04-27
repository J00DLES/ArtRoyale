import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useParams } from "react-router";


function UserCharacters() {
    const { id: userId } = useParams();
    const { user } = useAuth();
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    function normalizeImageUrl(rawUrl) {
        if (!rawUrl || typeof rawUrl !== "string") {
            return "";
        }

        const trimmed = rawUrl.trim();

        if (!trimmed) {
            return "";
        }

        if (trimmed.startsWith("//")) {
            return `https:${trimmed}`;
        }

        return trimmed;
    }

    useEffect(() => {
        async function fetchCharacters() {
            setLoading(true);
            try {
                const res = await fetch(`/api/users/${userId}/characters`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to fetch characters.");
                }

                setCharacters(
                    (data.characters || []).map((character) => ({
                        ...character,
                        imageUrl: normalizeImageUrl(character.imageUrl ?? character.image_url),
                    }))
                );
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
            <div className="user-character-grid">
                {characters.map((character) => (
                    <Link
                        key={character.id}
                        to={`/characters/${character.id}`}
                        className="user-character-card"
                    >
                        {character.imageUrl ? (
                            <img
                                src={character.imageUrl}
                                alt={character.name}
                                className="user-character-image"
                            />
                        ) : (
                            <div className="user-character-image user-character-image--empty">
                                <span>No image</span>
                            </div>
                        )}
                        <span className="user-character-name">{character.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default UserCharacters;