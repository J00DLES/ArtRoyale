import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useParams } from "react-router";

function CharacterPage() {
    const { id: characterId } = useParams();
    const { user } = useAuth();
    const [character, setCharacter] = useState(null);
    const [resolvedImageUrl, setResolvedImageUrl] = useState("");
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
        async function fetchCharacter() {
            try {
                const res = await fetch(`/api/characters/${characterId}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to fetch character.");
                }

                const imageUrl = normalizeImageUrl(
                    data.imageUrl ??
                    data.image_url ??
                    data.image?.imageUrl ??
                    data.image?.image_url
                );

                setCharacter({
                    ...data,
                    imageUrl,
                    userId: data.userId ?? data.user_id,
                });
                setResolvedImageUrl(imageUrl);
            } catch (err) {
                setError(err.message || "Failed to fetch character.");
            }
        }

        fetchCharacter();
    }, [characterId]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!character) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{character.name}</h1>
            <p>{character.description}</p>
            {resolvedImageUrl ? (
                <a
                    href={resolvedImageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="character-page-image-link"
                    aria-label={`Open full-size image for ${character.name}`}
                >
                    <img
                        src={resolvedImageUrl}
                        alt={character.name}
                        className="character-page-image"
                    />
                </a>
            ) : (
                <p>No image available for this character yet.</p>
            )}
         {user && user.id === character.userId && (
                <Link to={`/characters/${characterId}/edit`} className="btn btn-primary btn-edit">
                    Edit Character
                </Link>
            )}
        </div>
    );
}

export default CharacterPage;