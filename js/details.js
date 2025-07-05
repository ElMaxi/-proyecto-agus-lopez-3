const container = document.getElementById("detailsContainer");

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (id) {
    fetchDetails(id);
  } else {
    container.textContent = "No se especificó un Pokémon.";
  }
});

function fetchDetails(id) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => res.json())
    .then(pokemon => {
      container.innerHTML = `
        <h1>${pokemon.name}</h1>
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${pokemon.name}"/>
        <p><strong>Altura:</strong> ${pokemon.height}</p>
        <p><strong>Peso:</strong> ${pokemon.weight}</p>
        <p><strong>Tipos:</strong> ${pokemon.types.map(t => t.type.name).join(", ")}</p>
        <p><strong>Habilidades:</strong> ${pokemon.abilities.map(a => a.ability.name).join(", ")}</p>
      `;
    })
    .catch(() => {
      container.textContent = "Error cargando los detalles.";
    });
}
