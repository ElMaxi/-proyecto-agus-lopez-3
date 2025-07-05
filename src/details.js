document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const nombre = params.get("name");

  const detalleDiv = document.getElementById("detalle");

  try {const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);

    const pokemon = await response.json();

    detalleDiv.innerHTML = `
      <div class="pokemon-card">
        <h1>${pokemon.name}</h1>


        <img src="${pokemon.sprites.other["official-artwork"].front_default
        }" alt="${pokemon.name}" />


        <p>Tipo: ${pokemon.types.map((t) => t.type.name).join(", ")}</p>

        <p>Peso: ${pokemon.weight} g</p>
        <p>Altura: ${pokemon.height} cm</p>
        <p>Habilidades: ${pokemon.abilities.map((a) => a.ability.name).join(", ")}</p>
      </div>
    `;

  } catch (error) {
    detalleDiv.innerHTML = "<p>Error</p>";
    console.error(error);
  }
});