import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router";
import { useNavigate, useParams } from "react-router";

function Attack() {
	const { id: characterId } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();

	const [character, setCharacter] = useState(null);
	const [message, setMessage] = useState("");
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		async function fetchCharacter() {
			try {
				const res = await fetch(`/api/characters/${characterId}`);
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Failed to load character.");
				}

				setCharacter({
					...data,
					userId: data.userId ?? data.user_id,
				});
			} catch (err) {
				setError(err.message || "Failed to load character.");
			}
		}

		fetchCharacter();
	}, [characterId]);

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
		return <p>You must be logged in to attack a character.</p>;
	}

	if (error) {
		return <p>{error}</p>;
	}

	if (!character) {
		return <p>Loading...</p>;
	}

	if (user.id === character.userId) {
		return <p>You cannot attack your own character.</p>;
	}

	async function handleSubmit(e) {
		e.preventDefault();

		const trimmedMessage = message.trim();

		if (!trimmedMessage) {
			setError("Attack message is required.");
			return;
		}

		if (!image) {
			setError("Attack image is required.");
			return;
		}

		setSubmitting(true);
		setError("");

		try {
			const formData = new FormData();
			formData.append("message", trimmedMessage);
			formData.append("image", image);

			const res = await fetch(`/api/characters/${characterId}/attack`, {
				method: "POST",
				body: formData,
			});
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Failed to send attack message.");
			}

			navigate(`/characters/${characterId}`);
		} catch (err) {
			setError(err.message || "Failed to send attack message.");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div className="attack-page">
			<h1>Attack {character.name}</h1>
			<p>Leave a message for {character.username || "this user"} to see.</p>
			{error && <p className="error">{error}</p>}
			<form onSubmit={handleSubmit} className="attack-form">
				<label htmlFor="attack-message">Attack message:</label>
				<textarea
					id="attack-message"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					maxLength={280}
					placeholder="Write your battle message..."
					required
				/>
				<label htmlFor="attack-image">Attack image:</label>
				<input
					type="file"
					id="attack-image"
					accept="image/*"
					onChange={(e) => setImage(e.target.files?.[0] || null)}
					required
				/>
				{imagePreview && (
					<div className="image-preview">
						<p>Image Preview:</p>
						<img src={imagePreview} alt="Attack preview" />
					</div>
				)}
				<button
					type="submit"
					className="btn btn-primary"
					disabled={submitting}
				>
					{submitting ? "Sending..." : "Send Attack"}
				</button>
			</form>
			<p>
				<Link to={`/characters/${characterId}`}>Back to character page</Link>
			</p>
		</div>
	);
}

export default Attack;


