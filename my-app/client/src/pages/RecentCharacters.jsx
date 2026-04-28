import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router";
import { useNavigate, useParams } from "react-router";

function RecentCharacters() {
    // shows the 20 most recently created or edited characters, with the most recent first
    const { user } = useAuth();
    const navigate = useNavigate();
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
                const res = await fetch(`/api/characters/recent`);
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
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="recent-characters-page">
            <h2>Recently Created or Edited Characters</h2>
            {characters.length === 0 ? (
                <p>No characters found.</p>
            ) : (
                <div className="character-list">
                    {characters.map((character) => (
                        <Link
                            key={character.id}
                            to={`/characters/${character.id}`}
                            className="character-card"
                        >
                            {character.imageUrl ? (
                                <img
                                    src={character.imageUrl}
                                    alt={character.name || `Character ${character.id}`}
                                    className="character-card-image"
                                />
                            ) : (
                                <div className="character-card-placeholder">
                                    <span>No image</span>
                                </div>
                            )}
                            <div className="character-card-name">{character.name || `Character ${character.id}`}</div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default RecentCharacters;