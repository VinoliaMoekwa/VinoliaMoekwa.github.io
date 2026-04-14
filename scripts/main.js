const API_KEY = "26e23df218f38055a2572ca9c3ef6181";

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultsContainer = document.getElementById("resultsContainer");
const resultsHeading = document.getElementById("resultsHeading");

async function fetchPopularDramas() {
  resultsContainer.innerHTML = "<p>Loading popular dramas...</p>";

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_original_language=ko&sort_by=popularity.desc&vote_count.gte=20`
    );

    const data = await response.json();

    if (resultsHeading) {
      resultsHeading.textContent = "Popular K-Dramas";
    }

    displayResults(data.results || []);
  } catch (error) {
    console.error("Error loading popular dramas:", error);
    resultsContainer.innerHTML = "<p>Failed to load popular dramas.</p>";
  }
}

async function searchDramas() {
  const query = searchInput.value.trim();

  if (!query) {
    fetchPopularDramas();
    return;
  }

  resultsContainer.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US`
    );

    const data = await response.json();

    const kdramas = (data.results || []).filter((drama) => {
      const isKoreanLanguage = drama.original_language === "ko";
      const isKoreanCountry =
        Array.isArray(drama.origin_country) && drama.origin_country.includes("KR");

      return isKoreanLanguage || isKoreanCountry;
    });

    if (resultsHeading) {
      resultsHeading.textContent = `Search Results`;
    }

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

    const rating = drama.vote_average
      ? drama.vote_average.toFixed(1)
      : "N/A";

    return `
      <div class="card">
        <img src="${poster}" alt="${drama.name}">
        <h3>${drama.name}</h3>
        <p>⭐ ${rating}</p>
        <button onclick="goToDetails(${drama.id})">View Details</button>
      </div>
    `;
  }).join("");
}

function goToDetails(id) {
  window.location.href = `details.html?id=${id}`;
}

searchButton.addEventListener("click", searchDramas);

searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchDramas();
  }
});

fetchPopularDramas();