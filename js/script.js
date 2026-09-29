const main = document.querySelector("main");
const generationSelect = document.querySelector("#generation");
const triSelect = document.querySelector("#tri");
const typeButtons = document.querySelectorAll(".btn-type");

const typeColors = {
  "Plante": "#78C850",
  "Feu": "#F08030",
  "Eau": "#6890F0",
  "Insecte": "#A8B820",
  "Normal": "#A8A878",
  "Poison": "#A040A0",
  "Électrik": "#F8D030",
  "Sol": "#E0C068",
  "Vol": "#A890F0",
  "Combat": "#C03028",
  "Psy": "#F85888",
  "Roche": "#B8A038",
  "Spectre": "#705898",
  "Glace": "#98D8D8",
  "Dragon": "#7038F8",
  "Ténèbres": "#705848",
  "Acier": "#B8B8D0",
  "Fée": "#EE99AC"
};

class Type {
  constructor(data) {
    this.name = data.name;
    this.image = data.image;
    this.color = this.getColorHexa();
  }

  getColorHexa() {
    return typeColors[this.name] || "#808080";
  }
}

class Pokemon {
  constructor(data) {
    this.id = data.pokedex_id;
    this.image = data.sprites.regular;
    this.name = data.name.fr;
    this.apiTypes = data.types;
    this.arrTypes = this.apiTypes.map(type => new Type(type));
    this.hp = data.stats.hp;
    this.attack = data.stats.atk;
    this.defense = data.stats.def;
    this.special_attack = data.stats.spe_atk;
    this.speed = data.stats.vit;
  }

  displayCard() {
    const article = document.createElement("article");
    const color = this.arrTypes[0]?.color || "#808080";

    const types = this.arrTypes.map(type => `
      <span class="type" style="background-color: ${type.color}">
        ${type.name}
      </span>
    `).join("");

    article.style.backgroundColor = color;
    article.style.borderColor = color;

    article.innerHTML = `
      <figure>
        <picture>
          <img src="${this.image}" alt="Image ${this.name}" />
        </picture>
        <figcaption>
          <div class="types">${types}</div>
          <h2>${this.name}</h2>
          <ol>
            <li>Points de vie : ${this.hp}</li>
            <li>Attaque : ${this.attack}</li>
            <li>Défense : ${this.defense}</li>
            <li>Attaque spéciale : ${this.special_attack}</li>
            <li>Vitesse : ${this.speed}</li>
          </ol>
        </figcaption>
      </figure>
    `;

    return article;
  }
}

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
