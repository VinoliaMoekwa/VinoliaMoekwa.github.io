const TMDB_API_KEY = "26e23df218f38055a2572ca9c3ef6181";
const YOUTUBE_API_KEY = "AIzaSyA5jeVxBR4tDrZuvf3zzQOTd7RSp8ed8yc";

const detailsContainer = document.getElementById("detailsContainer");

function getDramaIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function fetchDramaDetails(dramaId) {
  const url = `https://api.themoviedb.org/3/tv/${dramaId}?api_key=${TMDB_API_KEY}&language=en-US`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch drama details");
  }

  return await response.json();
}

async function fetchTrailer(dramaName) {
  const searchQueries = [
    `${dramaName} official trailer kdrama`,
    `${dramaName} trailer kdrama`,
    `${dramaName} official teaser kdrama`
  ];

  for (const query of searchQueries) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(query)}&videoEmbeddable=true&videoSyndicated=true&key=${YOUTUBE_API_KEY}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        continue;
      }

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        return data.items[0];
      }
    } catch (error) {
      console.error("Trailer fetch error:", error);
    }
  }

  return null;
}

function saveFavorite() {
  if (!window.currentDrama) return;

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const alreadySaved = favorites.some((drama) => drama.id === window.currentDrama.id);

  if (alreadySaved) {
    alert("This drama is already in your favorites.");
    return;
  }

  favorites.push(window.currentDrama);
  localStorage.setItem("favorites", JSON.stringify(favorites));

  alert("Saved to favorites!");
}

function renderDetails(drama, trailer) {
  const poster = drama.poster_path
    ? `https://image.tmdb.org/t/p/w500${drama.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Image";

  const genres = drama.genres && drama.genres.length
    ? drama.genres.map((genre) => genre.name).join(", ")
    : "N/A";

  const releaseDate = drama.first_air_date || "Unknown";
  const rating = drama.vote_average ? drama.vote_average.toFixed(1) : "N/A";

  const trailerVideoId = trailer?.id?.videoId || trailer?.key || null;
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${drama.name} official trailer kdrama`
  )}`;

  detailsContainer.innerHTML = `
    <div class="details-card">
      <div class="details-grid">
        <div class="poster-column">
          <img class="details-poster" src="${poster}" alt="${drama.name}">
        </div>

        <div class="info-column">
          <h2>${drama.name}</h2>
          <p><strong>Original Name:</strong> ${drama.original_name || "N/A"}</p>
          <p><strong>First Air Date:</strong> ${releaseDate}</p>
          <p><strong>Rating:</strong> ⭐ ${rating}</p>
          <p><strong>Genres:</strong> ${genres}</p>
          <p><strong>Language:</strong> ${drama.original_language || "N/A"}</p>
          <p><strong>Overview:</strong> ${drama.overview || "No description available."}</p>
          <button class="save-favorite-btn" onclick="saveFavorite()">Save to Favorites</button>
        </div>
      </div>

      <div class="trailer-section">
        <h3>Watch Trailer</h3>
        ${
          trailerVideoId
            ? `<div class="video-wrapper">
                 <iframe
                   src="https://www.youtube.com/embed/${trailerVideoId}?rel=0"
                   title="YouTube trailer player"
                   frameborder="0"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   allowfullscreen>
                 </iframe>
               </div>`
            : `<p>No trailer found.</p>
               <p><a href="${youtubeSearchUrl}" target="_blank" rel="noopener noreferrer">Watch on YouTube</a></p>`
        }
      </div>
    </div>
  `;

  window.currentDrama = {
    id: drama.id,
    name: drama.name,
    original_name: drama.original_name,
    first_air_date: drama.first_air_date,
    vote_average: drama.vote_average,
    overview: drama.overview,
    poster_path: drama.poster_path
  };
}

async function loadDramaDetails() {
  const dramaId = getDramaIdFromUrl();

  if (!dramaId) {
    detailsContainer.innerHTML = "<p>No drama ID found in the URL.</p>";
    return;
  }

  try {
    const drama = await fetchDramaDetails(dramaId);
    const trailer = await fetchTrailer(drama.name);

    renderDetails(drama, trailer);
  } catch (error) {
    console.error("Error loading drama details:", error);
    detailsContainer.innerHTML = "<p>Failed to load drama details.</p>";
  }
}

loadDramaDetails();