import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useRequireUser } from "../hooks/useRequireUser";
import { Link } from "react-router";


// this is a page to view a user's profile and their art pieces. For now it just shows the user's info, 
// but we can expand it later to show their art pieces and other info.

function UserPage() {
    const currentUser = useRequireUser();
    const { id } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const [recentCharacters, setRecentCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const isOwnProfile = Number(currentUser?.id) === Number(profileUser?.id);

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
        let isMounted = true;

        async function loadUserProfile() {
            setLoading(true);
            setError("");

            try {
                const [profileRes, charactersRes] = await Promise.all([
                    fetch(`/api/users/${id}`),
                    fetch(`/api/users/${id}/characters`),
                ]);

                const profileData = await profileRes.json();
                const charactersData = await charactersRes.json();

                if (!profileRes.ok) {
                    throw new Error(profileData.error || "Failed to load user profile.");
                }

                if (!charactersRes.ok) {
                    throw new Error(charactersData.error || "Failed to load user characters.");
                }

                if (isMounted) {
                    setProfileUser(profileData.user);
                    setRecentCharacters(
                        (charactersData.characters || [])
                            .slice(0, 5)
                            .map((character) => ({
                                ...character,
                                imageUrl: normalizeImageUrl(character.imageUrl ?? character.image_url),
                            }))
                    );
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message || "Failed to load user profile.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadUserProfile();

        return () => {
            isMounted = false;
        };
    }, [id]);

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }


    return (
        <div className="user-page">
            <h1>{profileUser?.username}'s Profile</h1>
            <div className="user-info">
                <div className="profile-banner">
                    <h2 className="profile-banner-title">Characters</h2>
                    <div>
                        {isOwnProfile && (
                        <Link to="/characters/new" className="profile-banner-button">create character</Link>
                        )}  
                         <Link to ={`/users/${id}/characters`} className="profile-banner-button">view all...</Link>
                    </div>
                   
                </div>
                {recentCharacters.length > 0 ? (
                    <div className="user-character-grid">
                        {recentCharacters.map((character) => (
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
                ) : (
                    <p>No characters yet.</p>
                )}

               <div className="profile-banner">
                <h2 className="profile-banner-title">Recent Attacks</h2>
                </div>
                <p>Show the five most recent attacks made by the user.</p>
            </div>
            {/* We can add more user info and art pieces here later */}
        </div>
    );
}
export default UserPage;