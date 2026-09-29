import Type from "./Type.js";

export default class Pokemon {
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
