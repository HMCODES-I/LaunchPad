const cards = [...document.querySelectorAll(".opportunity")];
const filters = [...document.querySelectorAll(".filter")];
const search = document.getElementById("search");
const resultCount = document.getElementById("resultCount");
const savedCount = document.getElementById("savedCount");
const modal = document.getElementById("modal");

let activeCategory = "All";
let saved = JSON.parse(localStorage.getItem("launchpadSaved") || "[]");

function updateSaved() {
  cards.forEach((card) => {
    const title = card.querySelector("h3").textContent;
    const button = card.querySelector(".save");
    const isSaved = saved.includes(title);

    button.classList.toggle("saved", isSaved);
    button.textContent = isSaved ? "♥" : "♡";
  });

  savedCount.textContent = saved.length;
  localStorage.setItem("launchpadSaved", JSON.stringify(saved));
}

function updateCards() {
  const term = search.value.toLowerCase().trim();
  let visible = 0;

  cards.forEach((card) => {
    const matchesCategory =
      activeCategory === "All" || card.dataset.category === activeCategory;

    const matchesSearch =
      card.dataset.search.includes(term) ||
      card.querySelector("h3").textContent.toLowerCase().includes(term);

    const show = matchesCategory && matchesSearch;
    card.hidden = !show;

    if (show) visible++;
  });

  resultCount.textContent =
    `${visible} ${visible === 1 ? "opportunity" : "opportunities"} found`;
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeCategory = button.dataset.category;
    updateCards();
  });
});

search.addEventListener("input", updateCards);

cards.forEach((card) => {
  card.querySelector(".save").addEventListener("click", () => {
    const title = card.querySelector("h3").textContent;

    if (saved.includes(title)) {
      saved = saved.filter((item) => item !== title);
    } else {
      saved.push(title);
    }

    updateSaved();
  });

  card.querySelector(".details").addEventListener("click", (event) => {
    const button = event.currentTarget;

    document.getElementById("modalCategory").textContent = button.dataset.category;
    document.getElementById("modalTitle").textContent = button.dataset.title;
    document.getElementById("modalDetails").textContent = button.dataset.details;
    document.getElementById("modalRequirements").textContent = button.dataset.requirements;
    document.getElementById("modalLocation").textContent = button.dataset.location;
    document.getElementById("modalFee").textContent = button.dataset.fee;
    document.getElementById("applyLink").href = button.dataset.link;

    modal.hidden = false;
  });
});

document.getElementById("closeModal").addEventListener("click", () => {
  modal.hidden = true;
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.hidden = true;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    modal.hidden = true;
  }
});

updateSaved();
updateCards();
