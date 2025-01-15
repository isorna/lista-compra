// 1. Solución rápida y moderna, PERO NO ES EFICIENTE
import POKEMONS from '../pokemon/pokedex.json' with { type: 'json' }

console.log('Datos de Bulbasaur', POKEMONS)

readPokemonsList()

/** HOISTING */

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
  // 15 DE ENERO: ESTO ESTÁ MAL
  const LISTA = document.getElementsByClassName('pokemon-gallery')[0]
  // 1. Por cada elemento en la lista de pokemons,
  //    añadimos un nuevo elemento a la lista
  for (let i = 0; i < POKEMONS.length; i++){
    // 2. Crear un nuevo nodo LI
    let liElement = document.createElement('li')
    liElement.className = 'pokemon-card'
    // 2.1. Crear el nombre del pokemon
    let h1Element = document.createElement('h1')
    h1Element.innerText = POKEMONS[i].name.english
    // 2.2. Añadir el nombre al LI
    liElement.appendChild(h1Element)
    // 3. Añadir el LI a la LISTA
    LISTA.appendChild(liElement)
  }
}