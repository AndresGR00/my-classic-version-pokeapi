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
const pokemonImagePath = "./public/pokeball.png";

const currentCard = document.querySelector(".pk-current-card");
const previousCard = document.querySelector(".pk-previous-card");
const nextCard = document.querySelector(".pk-next-card");
let currentPokemon;
let previousPokemon;
let nextPokemon;

// Info Buttons

const attachEventListenersToButtons = () => {
  const aboutButtons = document.querySelectorAll(".pk-about");
  const statusButtons = document.querySelectorAll(".pk-status");
  const movesButtons = document.querySelectorAll(".pk-moves");

  aboutButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".pk-current-card");
      const pokemonId = currentPokemon.id;
      displayAboutInfo(card, pokemonId);
    });
  });

  statusButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".pk-current-card");
      const pokemonId = currentPokemon.id;
      displayStatusInfo(card, pokemonId);
    });
  });

  movesButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".pk-current-card");
      const pokemonId = currentPokemon.id;
      displayMovesInfo(card, pokemonId);
    });
  });
};

const displayAboutInfo = async (card, pokemonId) => {
  try {
    // Hacer una solicitud a la API para obtener información adicional del Pokémon
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    const res = await fetch(apiUrl);
    const response = await res.json();

    // Extraer la información relevante del Pokémon desde la API
    const height = response.height;
    const weight = response.weight;

    // Crear el contenido HTML interpolado
    const aboutInfo = `
      <p class="pk-height"> Height: <strong>${height} ft</strong></p>
      <p class="pk-width"> Weight: <strong>${weight} lbs</strong></p>
    `;

    // Insertar el contenido en la tarjeta
    card.querySelector(".pk-content-info").innerHTML = aboutInfo;
  } catch (err) {
    console.log(err);
    alert("Hubo un error al obtener la información del Pokémon.");
  }
};

const displayStatusInfo = async (card, pokemonId) => {
  try {
    // Hacer una solicitud a la API para obtener información adicional del Pokémon
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    const res = await fetch(apiUrl);
    const response = await res.json();

    // Crear el contenido HTML interpolado
    const statusInfo = `
    <div class="pk-status-info">
      <div class="pk-status-even">
      <p class="pk-height"> ${response.stats[0].stat.name} <strong>${response.stats[0].base_stat}</strong> 
      <p class="pk-height"> ${response.stats[1].stat.name} <strong>${response.stats[1].base_stat}</strong>           
      <p class="pk-height"> ${response.stats[2].stat.name} <strong>${response.stats[2].base_stat}</strong>
      </div>
      <div class="pk-status-odds">
      <p class="pk-height"> ${response.stats[5].stat.name} <strong>${response.stats[5].base_stat}</strong>
      <p class="pk-height"> ${response.stats[3].stat.name} <strong>${response.stats[3].base_stat}</strong>
      <p class="pk-height"> ${response.stats[4].stat.name} <strong>${response.stats[4].base_stat}</strong>
      
      </div>
    </div>`;

    // Insertar el contenido en la tarjeta
    card.querySelector(".pk-content-info").innerHTML = statusInfo;
  } catch (err) {
    console.log(err);
    alert("Hubo un error al obtener la información del Pokémon.");
  }
};

const displayMovesInfo = async (card, pokemonId) => {
  try {
    // Hacer una solicitud a la API para obtener información adicional del Pokémon
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    const res = await fetch(apiUrl);
    const response = await res.json();
    console.log(response)

    // Crear el contenido HTML interpolado
    const movesInfo = `<div class="pk-moves-names pk-display-flex">
    <div class="pk-moves-left">
      <p class="pk-height"><strong>${response.moves[0].move.name}</strong></p>
      <p class="pk-height"><strong>${response.moves[1].move.name}</strong></p>
    </div>
    <div class="pk-moves-right">
      <p class="pk-height"><strong>${response.moves[2].move.name}</strong></p>
      <p class="pk-height"><strong>${response.moves[3].move.name}</strong></p>
    </div>
  </div>`;

    // Insertar el contenido en la tarjeta
    card.querySelector(".pk-content-info").innerHTML = movesInfo;
  } catch (err) {
    console.log(err);
    alert("Hubo un error al obtener la información del Pokémon.");
  }
};

//End Info Buttons

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

  // Agregar manejadores de eventos después de agregar el contenido
  attachEventListenersToButtons();
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

  // Agregar manejadores de eventos después de agregar el contenido
  attachEventListenersToButtons();
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
    <img src="${pokemonImagePath}" alt="Pokeball-icon" width="20px" height="20px">
    <h1 class="pk-name">${capitalizedPokemonName} #${pokemonData.id}</h1>
  </div>
  <div class="pk-sprite">
    <img src="${pokemonData.sprites.versions["generation-v"]["black-white"].animated.front_shiny}" alt="${pokemonData.name}" height="105px">
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

    // Agregar manejadores de eventos después de agregar el contenido
    attachEventListenersToButtons();
  } catch (err) {
    console.log(err);
  }
};

fetchFirstPokemon();
