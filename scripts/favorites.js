const favoritesContainer = document.getElementById("favorites-container");
const favoritesCount = document.getElementById("favorites-count");

function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function removeFavorite(id) {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter(drama => drama.id !== id);

  saveFavorites(updatedFavorites);
  displayFavorites();
}

function displayFavorites() {
  const favorites = getFavorites();

  favoritesCount.textContent = favorites.length;
  favoritesContainer.innerHTML = "";

  if (favorites.length === 0) {
    favoritesContainer.innerHTML = `
      <div class="empty-message">
        <p>No favorite dramas yet.</p>
        <p>Go to the homepage and add some favorites.</p>
      </div>
    `;
    return;
  }

  favorites.forEach(drama => {
    const card = document.createElement("article");
    card.classList.add("favorite-card");

    card.innerHTML = `
      <img src="${drama.poster}" alt="${drama.title}">
      <div class="favorite-card-content">
        <h2>${drama.title}</h2>
        <p><strong>Rating:</strong> ${drama.rating || "N/A"}</p>
        <p>${drama.description || "No description available."}</p>
        <div class="card-buttons">
          <a class="details-btn" href="details.html?id=${drama.id}">View Details</a>
          <button class="remove-btn" data-id="${drama.id}">Remove</button>
        </div>
      </div>
    `;

    favoritesContainer.appendChild(card);
  });

  const removeButtons = document.querySelectorAll(".remove-btn");
  removeButtons.forEach(button => {
    button.addEventListener("click", function () {
      const dramaId = Number(this.dataset.id);
      removeFavorite(dramaId);
    });
  });
}

displayFavorites();