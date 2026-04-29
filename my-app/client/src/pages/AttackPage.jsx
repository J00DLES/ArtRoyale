import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useAuth } from "../hooks/useAuth";

function AttackPage() {
	const { id: attackId } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const [attack, setAttack] = useState(null);
	const [error, setError] = useState("");
	const [deleting, setDeleting] = useState(false);

	function normalizeImageUrl(rawUrl) {
		if (!rawUrl || typeof rawUrl !== "string") return "";
		const trimmed = rawUrl.trim();
		if (!trimmed) return "";
		if (trimmed.startsWith("//")) return `https:${trimmed}`;
		return trimmed;
	}

	useEffect(() => {
		let isMounted = true;

		async function fetchAttack() {
			try {
				const res = await fetch(`/api/attacks/${attackId}`);
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Failed to fetch attack.");
				}

				if (isMounted) {
					setAttack({
						...data.attack,
						imageUrl: normalizeImageUrl(data.attack?.image_url ?? data.attack?.imageUrl),
					});
				}
			} catch (err) {
				if (isMounted) setError(err.message || "Failed to load attack.");
			}
		}

		fetchAttack();

		return () => {
			isMounted = false;
		};
	}, [attackId]);

	if (error) return <p>{error}</p>;
	if (!attack) return <p>Loading attack...</p>;

	const canDelete = user && Number(user.id) === Number(attack.attacker_id);

	async function handleDelete() {
		const confirmed = window.confirm("Delete this attack? This cannot be undone.");

		if (!confirmed) {
			return;
		}

		setDeleting(true);
		setError("");

		try {
			const res = await fetch(`/api/attacks/${attackId}`, {
				method: "DELETE",
			});
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Failed to delete attack.");
			}

			navigate(`/characters/${attack.character_id}`);
		} catch (err) {
			setError(err.message || "Failed to delete attack.");
		} finally {
			setDeleting(false);
		}
	}

	return (
		<div>
			<h1>Attack #{attack.id}</h1>

			<p>
				<strong>Attacker:</strong>{" "}
				<Link to={`/users/${attack.attacker_id}`}>{attack.attacker_username || attack.attacker_id}</Link>
			</p>

			<p>
				<strong>Defender:</strong>{" "}
				<Link to={`/users/${attack.defender_id}`}>{attack.defender_username || attack.defender_id}</Link>
			</p>

			<p>
				<strong>Target Character:</strong>{" "}
				<Link to={`/characters/${attack.character_id}`}>View character</Link>
			</p>

			<p>{attack.message}</p>

			{canDelete && (
				<button type="button" className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
					{deleting ? "Deleting..." : "Delete Attack"}
				</button>
			)}

			{attack.imageUrl ? (
				<a href={attack.imageUrl} target="_blank" rel="noreferrer" className="character-page-image-link">
					<img src={attack.imageUrl} alt={attack.message || "attack image"} className="character-page-image" />
				</a>
			) : (
				<p>No image for this attack.</p>
			)}
		</div>
	);
}

export default AttackPage;
