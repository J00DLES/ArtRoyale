import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useRequireUser } from "../hooks/useRequireUser";


// this is a page to view a user's profile and their art pieces. For now it just shows the user's info, 
// but we can expand it later to show their art pieces and other info.

function UserPage() {
    useRequireUser();
    const { id } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadUserProfile() {
            setLoading(true);
            setError("");

            try {
                const res = await fetch(`/api/users/${id}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to load user profile.");
                }

                if (isMounted) {
                    setProfileUser(data.user);
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
                <p>Eventually there will be characters and a bio here. </p>
                <h2>Characters</h2>
                <p>Show the five most recent characters made by the user.</p>
                <h2>Recent Attacks</h2>
                <p>Show the five most recent attacks made by the user.</p>
            </div>
            {/* We can add more user info and art pieces here later */}
        </div>
    );
}
export default UserPage;