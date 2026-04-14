const dramas = [
  {
    id: 1,
    title: "Crash Landing on You",
    rating: 8.7,
    description: "A South Korean heiress accidentally lands in North Korea and meets an army officer.",
    image: "https://via.placeholder.com/300x200?text=Crash+Landing+on+You"
  },
  {
    id: 2,
    title: "Goblin",
    rating: 8.8,
    description: "A cursed immortal meets a high school girl who may be the one to end his eternal life.",
    image: "https://via.placeholder.com/300x200?text=Goblin"
  },
  {
    id: 3,
    title: "Itaewon Class",
    rating: 8.2,
    description: "An ex-con and his friends fight against a powerful company while building a bar in Itaewon.",
    image: "https://via.placeholder.com/300x200?text=Itaewon+Class"
  },
  {
    id: 4,
    title: "Business Proposal",
    rating: 8.1,
    description: "A woman goes on a blind date pretending to be her friend and ends up meeting her CEO.",
    image: "https://via.placeholder.com/300x200?text=Business+Proposal"
  },
  {
    id: 5,
    title: "Vincenzo",
    rating: 8.4,
    description: "A Korean-Italian mafia lawyer returns to Korea and takes down corrupt villains.",
    image: "https://via.placeholder.com/300x200?text=Vincenzo"
  },
  {
    id: 6,
    title: "True Beauty",
    rating: 8.0,
    description: "A teenage girl masters makeup to transform her life while dealing with love and self-image.",
    image: "https://via.placeholder.com/300x200?text=True+Beauty"
  }
];

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultsContainer = document.getElementById("resultsContainer");

function displayDramas(dramaList) {
  resultsContainer.innerHTML = "";

  if (dramaList.length === 0) {
    resultsContainer.innerHTML = "<p>No dramas found.</p>";
    return;
  }

  dramaList.forEach((drama) => {
    const card = document.createElement("div");
    card.classList.add("drama-card");

    card.innerHTML = `
      <img src="${drama.image}" alt="${drama.title}">
      <h3>${drama.title}</h3>
      <p><strong>Rating:</strong> ${drama.rating}/10</p>
      <p>${drama.description}</p>
      <button class="details-btn" data-id="${drama.id}">View Details</button>
    `;

    resultsContainer.appendChild(card);
  });

  const detailButtons = document.querySelectorAll(".details-btn");

  detailButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const dramaId = Number(this.dataset.id);
      const selectedDrama = dramas.find((drama) => drama.id === dramaId);

      localStorage.setItem("selectedDrama", JSON.stringify(selectedDrama));

      alert(`${selectedDrama.title} selected. Later this can open the details page.`);
      // later you can use:
      // window.location.href = "details.html";
    });
  });
}

function searchDramas() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredDramas = dramas.filter((drama) =>
    drama.title.toLowerCase().includes(searchTerm)
  );

  displayDramas(filteredDramas);
}

searchButton.addEventListener("click", searchDramas);

searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchDramas();
  }
});

displayDramas(dramas);