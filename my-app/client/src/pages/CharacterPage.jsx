import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate, useParams } from "react-router";

function CharacterPage() {
    const { id: characterId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [character, setCharacter] = useState(null);
    const [resolvedImageUrl, setResolvedImageUrl] = useState("");
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [attacks, setAttacks] = useState([]);

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

    useEffect(() => {
        async function fetchAttacks() {
            try {
                const res = await fetch(`/api/characters/${characterId}/attacks`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to fetch attacks.");
                }

                setAttacks(Array.isArray(data.attacks) ? data.attacks : []);
            } catch (err) {
                setError(err.message || "Failed to fetch attacks.");
            }
        }

        fetchAttacks();
    }, [characterId]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!character) {
        return <p>Loading...</p>;
    }

    async function handleDelete() {
        const confirmed = window.confirm(
            `Delete ${character.name}? This cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        setDeleting(true);
        setError("");

        try {
            const res = await fetch(`/api/characters/${characterId}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to delete character.");
            }

            navigate(`/users/${character.userId}`);
        } catch (err) {
            setError(err.message || "Failed to delete character.");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <div className="detail-page character-page">
            <h1>{character.name}</h1>
            
            <h3>created by: <Link to={`/users/${character.userId}`}>{character.username || "Unknown Artist"}</Link></h3>
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
       
                 <div className="page-actions">
                {user && user.id !== character.userId && (
                    <Link to={`/characters/${characterId}/attack`} className="btn btn-primary btn-attack">
                        Attack!
                    </Link>
                )}
                {user && user.id === character.userId && (
                <Link to={`/characters/${characterId}/edit`} className="btn btn-primary btn-edit">
                    Edit Character
                </Link>
            )}
          {user && user.id === character.userId && (
                <button
                    type="button"
                    onClick={handleDelete}
                    className="btn btn-danger btn-delete"
                    disabled={deleting}
                >
                    {deleting ? "Deleting..." : "Delete Character"}
                </button>
            )}
            </div>

            <div className="profile-banner">
                <h2 className="profile-banner-title">Attacks</h2>
            </div>
            {attacks.length === 0 ? (
                <p>No attacks yet. Be the first to send a message.</p>
            ) : (
                <div>
                    {attacks.map((attack) => (
                        <div key={attack.id}>
                            <Link to={`/attacks/${attack.id}`} className="attack-list-item">
                                <strong>by {attack.attacker_username || "unknown"}</strong> {attack.message}
                                {attack.image_url && (
                                    <div>
                                        <img
                                            src={attack.image_url}
                                            alt={attack.message || "attack image"}
                                            className="character-page-image"
                                        />
                                    </div>
                                )}
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CharacterPage;