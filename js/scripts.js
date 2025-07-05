const container = document.getElementById("pokemonContainer");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const sortOrder = document.getElementById("sortOrder");
const pagination = document.getElementById("pagination");
const errorMsg = document.getElementById("errorMsg");

let allPokemon = [];
let filteredPokemon = [];
let currentPage = 1;
const perPage = 20;

document.addEventListener("DOMContentLoaded", () => {
  fetchTypes();
  fetchAllPokemon();
  searchInput.addEventListener("input", applyFilters);
  typeFilter.addEventListener("change", applyFilters);
  sortOrder.addEventListener("change", applyFilters);
});

function fetchTypes() {
  fetch("https://pokeapi.co/api/v2/type")
    .then(res => res.json())
    .then(data => {
      data.results.forEach(type => {
        const opt = document.createElement("option");
        opt.value = type.name;
        opt.textContent = type.name;
        typeFilter.appendChild(opt);
      });
    });
}

async function fetchAllPokemon() {
  try {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=200");
    const data = await res.json();
    allPokemon = data.results;
    applyFilters();
  } catch (error) {
    errorMsg.textContent = "Error cargando Pokémon.";
  }
}

function applyFilters() {
  const search = searchInput.value.toLowerCase();
  const type = typeFilter.value;
  const order = sortOrder.value;

  filteredPokemon = allPokemon.filter(p => p.name.includes(search));

  if (type) {
    Promise.all(filteredPokemon.map(p => fetch(p.url).then(r => r.json())))
      .then(details => {
        filteredPokemon = details.filter(p =>
          p.types.some(t => t.type.name === type)
        );
        sortAndRender(order);
      });
  } else {
    sortAndRender(order);
  }
}

function sortAndRender(order) {
  filteredPokemon.sort((a, b) =>
    order === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );
  currentPage = 1;
  renderPokemon();
}

function renderPokemon() {
  container.innerHTML = "";
  pagination.innerHTML = "";
  errorMsg.textContent = "";

  const start = (currentPage - 1) * perPage;
  const pageData = filteredPokemon.slice(start, start + perPage);

  if (pageData.length === 0) {
    errorMsg.textContent = "No se encontraron resultados.";
    return;
  }

  pageData.forEach(pokemon => {
    const card = document.createElement("div");
    card.className = "card";

    const id = getIdFromUrl(pokemon.url);
    card.innerHTML = `
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" alt="${pokemon.name}" />
      <h3>${pokemon.name}</h3>
      <a href="details.html?id=${id}">Ver detalles</a>
    `;

    container.appendChild(card);
  });

  const totalPages = Math.ceil(filteredPokemon.length / perPage);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.disabled = true;
    btn.onclick = () => {
      currentPage = i;
      renderPokemon();
    };
    pagination.appendChild(btn);
  }
}

function getIdFromUrl(url) {
  const parts = url.split("/");
  return parts[parts.length - 2];
}
