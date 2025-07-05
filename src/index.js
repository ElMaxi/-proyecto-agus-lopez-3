import "./css/styles.css";




const tipo = document.getElementById("tipo");








//Generador de cards para pokémones, tomando una lista de pokémones
function crearTarjeta(listaPokemones) {
  const pokemonEncontrado = document.getElementById("resultado");
  pokemonEncontrado.innerHTML = listaPokemones
    .map(
      (pokemon) => `
    <div class="pokemon-card">
      <h2 style="font-family: pokemon hollow;">${pokemon.name.toUpperCase()}</h2>
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
      <p style="font-family: pokemon solid;">Tipo: ${pokemon.types.map((t) => t.type.name).join(", ")}</p>
      <p style="font-family: pokemon solid;">Altura: ${pokemon.height / 10} m</p>
      <p style="font-family: pokemon solid;">Peso: ${pokemon.weight / 10} kg</p>
      <a href="sheets.html?name=${pokemon.name}">Ver sheet de ${pokemon.name}</a>
    </div>
  `
    )
    .join("");

  window.ultimaLista = listaPokemones;
}


// función de búsqueda, busca por nombre, y puede soportar nombres parciales, generando listas menos precisas pero más útiles
async function buscar() {
  const texto = document
    .getElementById("buscador")
    .value.trim()
    .toLowerCase();

  const pokemonEncontrado = document.getElementById("resultado");


  try {
    const exactResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${texto}`
    );
    if (exactResponse.ok) {
      const hayPokemon = await exactResponse.json();
      crearTarjeta([hayPokemon]);
      return;
    }

    const allResponse = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=100"
    );
    const data = await allResponse.json();

    const buscado = data.results.filter((p) => p.name.includes(texto));

    if (buscado.length === 0) {
      pokemonEncontrado.innerHTML =  "<p>no hay pokemones con ese nombre</p>";
      return;
    }
  
    


    const refsheet = await Promise.all(
      buscado
        .slice(0, 10)
        .map((p) => fetch(p.url).then((res) => res.json()))
    );



    crearTarjeta(refsheet);
  } catch (error) {
    pokemonEncontrado.innerHTML = "<p>Error al buscar Pokemon.</p>";
    console.error(error);
  }
}


//Ordena los pokémones por ID, o nombre, en base a una función 'sort' sobre una lista copia de la original; 'listaOrdenada'
function ordenId() {
  const ordenSeleccionado = document.getElementById("orden").value;
  const lista = window.ultimaLista;

  if (!lista || lista.length === 0) return;

  let listaOrdenada = lista; 

  switch (ordenSeleccionado) {
    case "idAsc":
      listaOrdenada.sort((a, b) => a.id - b.id);
      break;
    case "idDesc":
      listaOrdenada.sort((a, b) => b.id - a.id);
      break;
    case "nomAsc":
      listaOrdenada.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "nomDesc":
      listaOrdenada.sort((a, b) => b.name.localeCompare(a.name));
      break;
  }

  crearTarjeta(listaOrdenada);
}




//filtra por tipo usando cómo ayuda en el filtro, a la función 'ordenId', así ambos se aplican en simúltaneo

async function filtrarPorTipo() {
  const tipoSeleccionado = document.getElementById("tipo").value;
  const resultado = document.getElementById("resultado");

  if (tipoSeleccionado === "all") {
    return;
  }

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${tipoSeleccionado}`);

    const data = await response.json();

    const listaPokemones = data.pokemon.map((p) => p.pokemon);

    const detalles = await Promise.all(
      listaPokemones.slice(0, 50).map((p) =>
        fetch(p.url).then((res) => res.json())
      )
    );

    window.ultimaLista = detalles;
    ordenId(); 
  } catch (error) {
    resultado.innerHTML = "<p>Error al filtrar por tipo.</p>";
    console.error("Error al cargar pokemones por tipo:", error);
  }
}
















// listeners
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("buscarNombreBtn")
    .addEventListener("click", buscar);
});

document.getElementById("orden").addEventListener("change", () => {ordenId();});

document.getElementById("tipo").addEventListener("change", filtrarPorTipo);



