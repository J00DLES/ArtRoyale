import { useEffect, useState } from "react";
import { Link } from "react-router";

const PROMPTS = [
  "art pose",
  "fantasy armor",
  "neon city",
  "space portrait",
  "stormy landscape",
  "mystic creature",
];

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

function getRandomPrompt() {
  return PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
}

function Inspiration() {
  const [searchInput, setSearchInput] = useState("art pose");
  const [query, setQuery] = useState("art pose");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchInspiration() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`/api/inspiration?q=${encodeURIComponent(query)}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch inspiration images.");
        }

        if (isMounted) {
          setImages(
            Array.isArray(data)
              ? data.map((image) => ({
                  ...image,
                  url: normalizeImageUrl(image.url),
                  full: normalizeImageUrl(image.full),
                }))
              : []
          );
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to fetch inspiration images.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchInspiration();

    return () => {
      isMounted = false;
    };
  }, [query]);

  function handleSubmit(event) {
    event.preventDefault();
    const nextQuery = searchInput.trim() || "art pose";
    setQuery(nextQuery);
  }

  function handleSurprise() {
    const nextQuery = getRandomPrompt();
    setSearchInput(nextQuery);
    setQuery(nextQuery);
  }

  return (
    <div className="inspiration-page">
      <section className="inspiration-hero">
        <div>
          <p className="inspiration-kicker">Random search generator</p>
          <h1>Find a visual spark for your next character.</h1>
          <p className="inspiration-description">
            Search by mood, setting, costume, or theme and pull a fresh batch of reference images.
          </p>
        </div>

        <form className="inspiration-search" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="inspiration-query">
            Search inspiration
          </label>
          <input
            id="inspiration-query"
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search for a style, scene, or mood"
          />
          <div className="inspiration-actions">
            <button type="submit" className="btn btn-primary">
              Search
            </button>
            <button type="button" className="btn inspiration-surprise-button" onClick={handleSurprise}>
              Surprise me
            </button>
          </div>
        </form>
      </section>

      <div className="inspiration-suggestions" aria-label="Suggested searches">
        {PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="inspiration-pill"
            onClick={() => {
              setSearchInput(prompt);
              setQuery(prompt);
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p className="info-message">Loading inspiration...</p>
      ) : images.length === 0 ? (
        <p className="info-message">No images found for “{query}”. Try another search.</p>
      ) : (
        <div className="inspiration-grid">
          {images.map((image) => (
            <article key={image.id} className="inspiration-card">
              <a href={image.full || image.url} target="_blank" rel="noreferrer" className="inspiration-image-link">
                <img src={image.url || image.full} alt={query} className="inspiration-image" />
              </a>
              <div className="inspiration-card-meta">
                <p className="inspiration-card-title">{query}</p>
                <p className="inspiration-card-credit">By {image.photographer || "Unknown photographer"}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="inspiration-footer-link">
        <Link to="/characters/recent">Back to recent characters</Link>
      </p>
    </div>
  );
}

export default Inspiration;