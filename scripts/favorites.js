const favoritesGrid = document.getElementById("favoritesGrid");

function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function removeFavorite(id) {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter((drama) => drama.id !== id);

  saveFavorites(updatedFavorites);
  loadFavorites();
}

function goToDetails(id) {
  window.location.href = `details.html?id=${id}`;
}

function loadFavorites() {
  const favorites = getFavorites();

  if (favorites.length === 0) {
    favoritesGrid.innerHTML = `
      <div class="empty-state">
        <p>No favorites saved yet.</p>
      </div>
    `;
    return;
  }

  favoritesGrid.innerHTML = favorites.map((drama) => {
    const poster = drama.poster_path
      ? `https://image.tmdb.org/t/p/w500${drama.poster_path}`
      : "https://via.placeholder.com/300x450?text=No+Image";

    const rating = drama.vote_average
      ? drama.vote_average.toFixed(1)
      : "N/A";

    const description = drama.overview
      ? drama.overview.length > 120
        ? `${drama.overview.slice(0, 120)}...`
        : drama.overview
      : "No description available.";

    return `
      <div class="card">
        <img src="${poster}" alt="${drama.name}">
        <h3>${drama.name}</h3>
        <p class="rating">⭐ ${rating}</p>
        <p class="description">${description}</p>
        <div class="favorites-actions">
          <button onclick="goToDetails(${drama.id})">View Details</button>
          <button onclick="removeFavorite(${drama.id})">Remove</button>
        </div>
      </div>
    `;
  }).join("");
}

loadFavorites();