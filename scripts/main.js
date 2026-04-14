const API_KEY = "26e23df218f38055a2572ca9c3ef6181";

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultsContainer = document.getElementById("resultsContainer");

async function searchDramas() {
  const query = searchInput.value.trim();

  if (!query) {
    resultsContainer.innerHTML = "<p>Please enter a drama name.</p>";
    return;
  }

  resultsContainer.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US`
    );

    const data = await response.json();
    console.log("TMDB data:", data);

    const kdramas = (data.results || []).filter((drama) => {
      const isKoreanLanguage = drama.original_language === "ko";
      const isKoreanCountry =
        Array.isArray(drama.origin_country) && drama.origin_country.includes("KR");

      return isKoreanLanguage || isKoreanCountry;
    });

    displayResults(kdramas);
  } catch (error) {
    console.error("Search error:", error);
    resultsContainer.innerHTML = "<p>Error loading dramas.</p>";
  }
}

function displayResults(dramas) {
  if (!dramas || dramas.length === 0) {
    resultsContainer.innerHTML = "<p>No K-Dramas found.</p>";
    return;
  }

  resultsContainer.innerHTML = dramas.map((drama) => {
    const poster = drama.poster_path
      ? `https://image.tmdb.org/t/p/w500${drama.poster_path}`
      : "https://via.placeholder.com/300x450?text=No+Image";

    return `
      <div class="drama-card">
        <img src="${poster}" alt="${drama.name}" width="100%">
        <h3>${drama.name}</h3>
        <p>⭐ ${drama.vote_average ? drama.vote_average.toFixed(1) : "N/A"}</p>
        <button onclick="goToDetails(${drama.id})">View Details</button>
      </div>
    `;
  }).join("");
}

function goToDetails(id) {
  window.location.href = `details.html?id=${id}`;
}

searchButton.addEventListener("click", searchDramas);

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchDramas();
  }
});