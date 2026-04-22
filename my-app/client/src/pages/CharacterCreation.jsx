import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router";

function CharacterCreation() {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return <p>You must be logged in to create a character.</p>;
    }

    return (
        <div>
            <h1>Create a New Character</h1>
            <p>This is where the character creation form will go.</p>
            <Link to={`/users/${user.id}`}>Back to Profile</Link>

            <form style={{ marginTop: "20px" }} onSubmit={(e) => {
                e.preventDefault();
                // Here you would handle form submission to create a new character
                // For now, we'll just navigate back to the user's profile
                navigate(`/users/${user.id}`);
            }}>
                <div className="form-group">
                    <label htmlFor="characterName">Character Name</label>
                    <input type="text" id="characterName" className="form-control" required />
                    < label htmlFor="characterDescription" id="characterDescription">Character Description</label>
                    <textarea id="characterDescription" className="form-control" rows="4"></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Create Character</button>
            </form>
        </div>
    );
}

export default CharacterCreation;