import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useParams } from "react-router";

function EditCharacter() {
    const { id: characterId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadCharacter() {
            setLoading(true);
            setError("");

            try {
                const res = await fetch(`/api/characters/${characterId}/edit`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to load character details.");
                }

                if (!isMounted) {
                    return;
                }

                setName(data.name || "");
                setDescription(data.description || "");
                setImagePreview(data.image_url || data.imageUrl || "");
            } catch (err) {
                if (isMounted) {
                    setError(err.message || "Failed to load character details.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadCharacter();

        return () => {
            isMounted = false;
        };
    }, [characterId]);

    useEffect(() => {
        if (!image) {
            return undefined;
        }

        const objectUrl = URL.createObjectURL(image);
        setImagePreview(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [image]);

    if (!user) {
        return <p>You must be logged in to edit a character.</p>;
    }

    if (loading) {
        return <p>Loading character details...</p>;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);

        if (image) {
            formData.append("image", image);
        }

        try {
            const res = await fetch(`/api/characters/${characterId}/edit`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to update character.");
            }

            navigate(`/characters/${characterId}`);
        } catch (err) {
            setError(err.message || "Failed to update character.");
        }
    }

    return (
        <div className="edit-character-page">
            <h2>Edit Character</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} className="edit-character-form">
                <div className="form-group">
                    <label htmlFor="name">Character Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Character Image:</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                {imagePreview && (
                    <div className="image-preview">
                        <p>Image Preview:</p>
                        <img src={imagePreview} alt="Character Preview" />
                    </div>
                )}
                <button type="submit" className="btn btn-primary">
                    Save Changes
                </button>
            </form>
         </div>
     );
}

export default EditCharacter;