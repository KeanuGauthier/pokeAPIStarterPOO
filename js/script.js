import Pokemon from "./Pokemon.js";
import { typeColors } from "./Type.js";

const main = document.querySelector("main");
const generationSelect = document.querySelector("#generation");
const triSelect = document.querySelector("#tri");
const typeButtons = document.querySelectorAll(".btn-type");

typeButtons.forEach(button => {
  const type = button.dataset.type;
  button.style.backgroundColor = typeColors[type] || "grey";

  button.addEventListener("click", () => {
    button.classList.toggle("active");
    displayPokemons();
  });
});

let currentPokemons = [];

function displayPokemons() {
  main.innerHTML = "";

  const selectedButtons = document.querySelectorAll(".btn-type.active");
  const selectedTypes = Array.from(selectedButtons).map(button => button.dataset.type);

  let filteredData = [...currentPokemons];

  if (selectedTypes.length > 0) {
    filteredData = filteredData.filter(pokemon =>
      pokemon.arrTypes.some(type => selectedTypes.includes(type.name))
    );
  }

  if (triSelect.value === "nom") {
    filteredData.sort((a, b) => a.name.localeCompare(b.name));
  } else if (triSelect.value === "pv") {
    filteredData.sort((a, b) => b.hp - a.hp);
  } else if (triSelect.value === "attaque") {
    filteredData.sort((a, b) => b.attack - a.attack);
  } else if (triSelect.value === "type") {
    filteredData.sort((a, b) => a.arrTypes[0].name.localeCompare(b.arrTypes[0].name));
  }

  filteredData.forEach(pokemon => {
    main.appendChild(pokemon.displayCard());
  });
}

async function loadData(generation) {
  main.innerHTML = "";
  const response = await fetch(`https://tyradex.app/api/v1/gen/${generation}`);
  const data = await response.json();
  currentPokemons = data.map(item => new Pokemon(item));
  displayPokemons();
}

generationSelect.addEventListener("change", event => {
  const generation = Number(event.target.value);
  loadData(generation);
});

triSelect.addEventListener("change", () => {
  displayPokemons();
});

loadData(1);
