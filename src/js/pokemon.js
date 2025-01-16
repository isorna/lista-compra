// 1. Solución rápida y moderna, PERO NO ES EFICIENTE
import POKEMONS from '../pokemon/pokedex.json' with { type: 'json' }

readPokemonsList()

document.addEventListener('DOMContentLoaded', onDOMContentLoaded)

/** ============== HOISTING ============== **/
/**
 * DOM Content Load event controller
 */
function onDOMContentLoaded(e) {
  // Código a ejecutar cuando cargue la página
  const searchButton = document.getElementById('searchButton')
  console.log('la página ha cargado', e)
  searchButton.addEventListener('click', onSearchClick)
}

/**
 * Search button click event controller
 * @param {event} e
 */
function onSearchClick(e){
  const searchInput = document.getElementById('search')
  const query = searchInput.value
  const listaDePokemonsBuscados = buscarPokemon(query)
  console.log('he clicado en el botón de búsqueda', listaDePokemonsBuscados)
}

/**
 * Leemos los datos de POKEMONS y con ellos construimos la tabla en el HTML
 *
 * Ejemplo de estructura:
 * <li class="pokemon-card">
      <!-- Componente: ficha de pokemon -->
      <a href="./ficha.html">
        <figure>
          <img src="./pokemon/images/001.png" alt="NOMBRE POKEMON">
          <figcaption>Nº 0001</figcaption>
        </figure>
      </a>
      <h1>NOMBRE POKEMON</h1>
      <p class="taglist">
        <em class="tag planta">Planta</em>
        <em class="tag veneno">Veneno</em>
      </p>
    </li>
 */
function readPokemonsList() {
  const LISTA = document.getElementsByClassName('pokemon-gallery')[0]
  // 15 DE ENERO: ESTO ESTÁ MAL
  // 1. Por cada elemento en la lista de pokemons,
  //    añadimos un nuevo elemento a la lista
  // for (let i = 0; i < POKEMONS.length; i++){
  for (let i = 0; i < 20; i++){
    let pokemonId = POKEMONS[i].id
    let liElement = document.createElement('li')
    let aElement = document.createElement('a')
    let figureElement = document.createElement('figure')
    let imgElement = document.createElement('img')
    let figcaptionElement = document.createElement('figcaption')
    let h1Element = document.createElement('h1')
    let tagListElement = document.createElement('p')
    // 2. Crear un nuevo nodo LI
    liElement.className = 'pokemon-card'
    // 2.1. Crear el link a la ficha
    aElement.href = './ficha.html?id=' + pokemonId
    // 2.2.1. Crear el figure
    // 2.2.1.1. Crear la imagen
    // Arreglar los id's que están mal en la carpeta images
    if (pokemonId === 662) {
      pokemonId = pokemonId + 'r'
    }
    if (pokemonId === 740) {
      pokemonId = pokemonId + 'le'
    }
    const numeroImagen = String(pokemonId).padStart(3, '0')
    imgElement.src = './pokemon/images/' + numeroImagen + '.png'
    // 2.2.1.2. Añadir la imagen al figure
    figureElement.appendChild(imgElement)
    // 2.2.1.3. Crear el figcaption
    figcaptionElement.innerText = 'Nº ' + numeroImagen.padStart(4, '0')
    // 2.2.1.4. Añadir el figcaption al figure
    figureElement.appendChild(figcaptionElement)
    // 2.2.2. Añadir el figure al link
    aElement.appendChild(figureElement)
    // 2.2. Añadir el link al LI
    liElement.appendChild(aElement)
    // 2.3. Crear el nombre del pokemon
    h1Element.innerText = POKEMONS[i].name.english
    // 2.4. Añadir el nombre al LI
    liElement.appendChild(h1Element)
    // 2.5. Crear la lista de tags
    tagListElement.className = 'taglist'
    // 2.5.1. Crear los tags
    for (let j = 0; j < POKEMONS[i].type.length; j++) {
      let tagItemElement = document.createElement('em')
      let pokemonType = POKEMONS[i].type[j]
      // 2.5.2. Añadir los tags
      tagItemElement.className = 'tag ' + pokemonType.toLowerCase()
      tagItemElement.innerText = pokemonType
      tagListElement.appendChild(tagItemElement)
    }
    // 2.6. Añadir la lista de tags
    liElement.appendChild(tagListElement)
    // 3. Añadir el LI a la LISTA
    LISTA.appendChild(liElement)
  }
}

/**
 * Search for a singular pokemon data sheet
 * @param {string} query
 * @returns string
 */
function buscarPokemon(query) {
  let returnValue = []
  // Como no sabemos si es un id o un texto, lo transformamos
  let numberQuery = Number(query)
  // Buscar el pokemon por nombre o por id
  // Usando POKEMONS, primero tenemos que saber si query es un id o un nombre
  if (!isNaN(numberQuery)) {// query es un número
    // Recorremos el array de POKEMONS
    for (let pokemon of POKEMONS) {
      if (pokemon.id === numberQuery) {
        returnValue.push(pokemon.name.english)
      }
    }
  } else {// query es una cadena de texto
    // Recorremos el array de POKEMONS
    for (let pokemon of POKEMONS) {
      // Lo cambiamos a un filtro por cadena de texto
      if (pokemon.name.english.includes(query)) {
        returnValue.push(pokemon.name.english)
      }
    }
  }
  console.log('estoy en buscarPokemon, he recibido: ', query)

  return returnValue
}