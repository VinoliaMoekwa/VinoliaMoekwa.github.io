const params = new URLSearchParams(window.location.search);
const dramaId = params.get("id");

// TEMP DATA (replace with API later)
const drama = {
  title: "Queen of Tears",
  poster: "https://via.placeholder.com/300x450",
  rating: "9.2",
  releaseDate: "2024",
  genre: "Romance, Drama",
  description: "A love story about a married couple.",
};

// Update DOM
document.getElementById("drama-title").textContent = drama.title;
document.getElementById("drama-poster").src = drama.poster;
document.getElementById("drama-rating").textContent = "⭐ " + drama.rating;
document.getElementById("drama-release-date").textContent = drama.releaseDate;
document.getElementById("drama-genre").textContent = drama.genre;
document.getElementById("drama-description").textContent = drama.description;

// Buttons
document.getElementById("favorite-btn").onclick = function () {
  alert("Added to favorites");
};

document.getElementById("trailer-btn").onclick = function () {
  alert("Trailer coming soon");
};

// FUTURE:
// fetch(`/api/dramas/${dramaId}`)
//   .then(res => res.json())
//   .then(data => console.log(data));
