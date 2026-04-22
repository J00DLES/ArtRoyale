import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router";

function CharacterCreation() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!image) {
            setImagePreview("");
            return undefined;
        }

        const objectUrl = URL.createObjectURL(image);
        setImagePreview(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [image]);

    if (!user) {
        return <p>You must be logged in to create a character.</p>;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("image", image);

        try {
            const res = await fetch("/api/characters/new", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create character.");
            }

            navigate(`/users/${user.id}`);
        } catch (err) {
            setError(err.message || "Failed to create character.");
        }
    }

    return (
        <div>
            <h1>Create a New Character</h1>
            <p>This is where the character creation form will go.</p>
            <Link to={`/users/${user.id}`}>Back to Profile</Link>

            {error && <p className="error-message">{error}</p>}

            <form style={{ marginTop: "20px" }} onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="characterName">Character Name</label>
                    <input
                        type="text"
                        id="characterName"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <label htmlFor="characterDescription">Character Description</label>
                    <textarea
                        id="characterDescription"
                        className="form-control"
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                    <label htmlFor="characterImage">Character Image</label>
                    <input
                        type="file"
                        id="characterImage"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                        required
                    />
                    {imagePreview && (
                        <div className="image-preview">
                            <p>Preview</p>
                            <img src={imagePreview} alt="Selected character preview" />
                        </div>
                    )}
                </div>
                <button type="submit" className="btn btn-primary">Create Character</button>
            </form>
        </div>
    );
}

export default CharacterCreation;