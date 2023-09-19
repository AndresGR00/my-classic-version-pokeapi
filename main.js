import "./style.css";

const POKEMON_COLORS_BY_TYPE = {
  normal: "#a0a29f",
  fire: "#e72324",
  water: "#2382f0",
  grass: "#3da123",
  electric: "#f5c400",
  ice: "#3dd9ff",
  fighting: "#fe8100",
  poison: "#923fcb",
  ground: "#92511b",
  flying: "#82b9ef",
  psychic: "#ee3f7a",
  bug: "#93a213",
  rock: "#b0ab83",
  ghost: "#713f72",
  dragon: "#4f60e2",
  dark: "#503e3c",
  steel: "#60a2ba",
  fairy: "#ef71ef",
};

const currentCard = document.querySelector(".pk-current-card");
const previousCard = document.querySelector(".pk-previous-card");
const nextCard = document.querySelector(".pk-next-card");
let currentPokemon;
let previousPokemon;
let nextPokemon;

const searchButton = document.querySelector(".pk-submit");
searchButton.addEventListener("click", () => {
  const searchTerm = document.querySelector(".pk-search-bar").value;
  searchPokemon(searchTerm);
});

const searchPokemon = async (searchTerm) => {
  let pokemon;
  let apiUrl;

  // Comprobar si el término de búsqueda es un número o una cadena
  if (!isNaN(searchTerm)) {
    // Si es un número, buscar por número de ID
    apiUrl = `https://pokeapi.co/api/v2/pokemon/${searchTerm}`;
  } else {
    // Si es una cadena, buscar por nombre
    apiUrl = `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`;
  }

  try {
    const res = await fetch(apiUrl);
    const response = await res.json();

    pokemon = response;

    // Actualizar la tarjeta de Pokémon con los datos obtenidos
    const pokemonType = pokemon.types[0].type.name;
    const pokemonColor = POKEMON_COLORS_BY_TYPE[pokemonType];
    document.documentElement.style.setProperty("--pokemon-color", pokemonColor);

    currentCard.innerHTML = pokemonCardTemplate(pokemon);
    currentPokemon = pokemon;

    // Actualiza la carta siguiente
    const nextPokemonId = currentPokemon.id + 1;
    searchNextPokemon(nextPokemonId);

    if (currentPokemon.id === 1) {
      previousCard.style.backgroundImage = "none";
    } else {
      previousCard.style.backgroundImage = "";
    }

    // Actualiza la carta previa
    const previousPokemonId = currentPokemon.id - 1;
    searchPreviousPokemon(previousPokemonId);

    document.querySelector(".pk-search-bar").value = "";
  } catch (err) {
    console.log(err);
    alert("No se encontró un Pokémon con ese nombre o número.");
  }
};

const searchNextPokemon = async (pokemonId) => {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const response = await res.json();
    nextPokemon = response;
    renderNextPokemon(nextPokemon);
  } catch (err) {
    console.log(err);
    nextPokemon = null;
    renderNextPokemon(nextPokemon);
  }
};

const searchPreviousPokemon = async (pokemonId) => {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const response = await res.json();
    previousPokemon = response;
    renderPreviousPokemon(previousPokemon);
  } catch (err) {
    console.log(err);
    previousPokemon = null;
    renderPreviousPokemon(previousPokemon);
  }
};

const renderNextPokemon = (pokemon) => {
  if (!pokemon) {
    nextCard.innerHTML = ""; // Limpia la carta si no hay Pokémon siguiente
    return;
  }
  const pokemonType = pokemon.types[0].type.name;
  const pokemonColor = POKEMON_COLORS_BY_TYPE[pokemonType];
  document.documentElement.style.setProperty(
    "--pokemon-color-next",
    pokemonColor
  );
  nextCard.innerHTML = pokemonCardTemplate(pokemon);
};

const renderPreviousPokemon = (pokemon) => {
  if (!pokemon) {
    previousCard.innerHTML = ""; // Limpia la carta si no hay Pokémon previo
    return;
  }
  const pokemonType = pokemon.types[0].type.name;
  const pokemonColor = POKEMON_COLORS_BY_TYPE[pokemonType];
  document.documentElement.style.setProperty(
    "--pokemon-color-previous",
    pokemonColor
  );
  previousCard.innerHTML = pokemonCardTemplate(pokemon);
};

const previousSpan = document.querySelector(".pk-previous-span");
const nextSpan = document.querySelector(".pk-next-span");

previousSpan.addEventListener("click", () => {
  if (currentPokemon === null) {
    return;
  }
  const previousPokemonId = currentPokemon.id - 1;
  if (previousPokemonId > 0) {
    searchPokemon(previousPokemonId);
  }
});
nextSpan.addEventListener("click", () => {
  if (currentPokemon === null) {
    return;
  }
  const nextPokemonId = currentPokemon.id + 1;
  searchPokemon(nextPokemonId);
});

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const pokemonCardTemplate = (pokemonData) => {
  const capitalizedPokemonName = capitalizeFirstLetter(pokemonData.name);

  return `<div class="pk-name-and-id pk-display-flex">
    <img src="./assets/img/pokeball.png" alt="Pokeball-icon" width="20px" height="20px">
    <h1 class="pk-name">${capitalizedPokemonName} #${pokemonData.id}</h1>
  </div>
  <div class="pk-sprite">
    <img src="${pokemonData.sprites.other.dream_world.front_default}" alt="${pokemonData.name}" height="105px">
  </div>
  <div class="pk-type">
    <h2 class="pk-type-name">${pokemonData.types[0].type.name}</h2>
  </div>
  <div class="pk-info-buttons pk-display-flex">
    <button class="pk-about">About</button>
    <button class="pk-status">Status</button>
    <button class="pk-moves">Moves</button>
  </div>
  <div class="pk-content-info pk-display-flex-column">
    <p class="pk-height"> Height: <strong>${pokemonData.height} ft</strong></p>
    <p class="pk-width"> Weight: <strong>${pokemonData.weight} lbs</strong></p>
  </div>`;
};

const fetchFirstPokemon = async () => {
  let pokemon;

  try {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon/1");
    const response = await res.json();

    pokemon = response;
    currentPokemon = pokemon;

    const pokemonType = pokemon.types[0].type.name;
    const pokemonColor = POKEMON_COLORS_BY_TYPE[pokemonType];
    document.documentElement.style.setProperty("--pokemon-color", pokemonColor);

    currentCard.innerHTML += pokemonCardTemplate(pokemon);

    const nextPokemonId = currentPokemon.id + 1;
    searchNextPokemon(nextPokemonId);
  } catch (err) {
    console.log(err);
  }
};

fetchFirstPokemon();
