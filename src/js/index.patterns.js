import { ARTICLE_TYPES, ArticleFactory } from "./classes/Article.js"
import { ShoppingList, withTotalMixin } from "./classes/ShoppingList.js"
import { LocalStore } from "./classes/LocalStore.js"
import { logBasket } from './decorators/log.js'

// Patrón: Factory
const fabricaArticulos = new ArticleFactory
// Patrón: Singleton (IEEF)
let listaCompra = (function() {
  let shoppingListInstance

  return {
    get: () => {
      if (!shoppingListInstance) {
        // Patrón: Decorator
        shoppingListInstance = logBasket(create())
      }
      return shoppingListInstance
    }
  }

  function create() {
    // Aquí podemos añadir los métodos y propiedades particulares de la instancia
    const dataStore = new LocalStore('lista-compra')
    // Mixin
    Object.assign(ShoppingList.prototype, withTotalMixin)
    return new ShoppingList(dataStore)
  }
})()

document.addEventListener('DOMContentLoaded', onDOMContentLoaded)

function onDOMContentLoaded() {
  const formulario = document.getElementById('formulario')
  const campoArticulo = document.getElementById('articulo')
  const botonArticulo = document.getElementById('nuevoArticulo')
  const botonNuevaLista = document.getElementById('nuevaLista')

  formulario.addEventListener('submit', onFormSubmit)
  campoArticulo.addEventListener('keyup', onInputKeyUp)
  botonArticulo.addEventListener('click', onNewArticleClick)
  botonNuevaLista.addEventListener('click', onNewListClick)

  loadShoppingList()
  // Patrón: Observer
  listaCompra.get().subscribe('formulario', 'add', addToElementsList)
  listaCompra.get().subscribe('formulario', 'remove', removeFromElementsList)
}

function onFormSubmit(e) {
  e.preventDefault()
}

function onInputKeyUp(e) {
  e.stopPropagation()
  const botonArticulo = document.getElementById('nuevoArticulo')

  if (e.code === 'Enter') {
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    })
    botonArticulo.dispatchEvent(clickEvent)
    return
  }

  if (this.value !== '') {
    botonArticulo.removeAttribute('disabled')
  } else {
    botonArticulo.setAttribute('disabled', undefined)
  }
}

function onNewArticleClick(e) {
  e.stopPropagation()
  addToShoppingList()
}

function onNewListClick(e) {
  e.stopPropagation()
  resetShoppingList()
}

function loadShoppingList() {
  const carrito = listaCompra.get()
  if (carrito.basket.length > 0){
    for (let i = 0; i < carrito.basket.length; i++){
      addToElementsList(carrito.basket[i])
    }
  }
  resetFormState()
}

function addToShoppingList() {
  const campoArticulo = document.getElementById('articulo')
  const nombreArticulo = campoArticulo.value
  const carrito = listaCompra.get()

  if (nombreArticulo !== '') {
    const campoPrecio = document.getElementById('precio')
    const campoQty = document.getElementById('qty')
    const qtyArticulo = campoQty.value || 1
    const precioArticulo = campoPrecio.value || 0
    // Patrón: Adapter
    const nuevoArticulo = fabricaArticulos.createTranslatedArticle(ARTICLE_TYPES.COMPLEX,
        nombreArticulo,
        qtyArticulo,
        precioArticulo)
    // Patrón: Observer
    carrito.addItem(nuevoArticulo)
  }
}

function addToElementsList(nuevoArticulo) {
  const listaArticulos = document.getElementById('lista')
  const elemento = document.createElement('li')
  const boton = document.createElement('button')
  // Patrón: Observer
  let elementText = nuevoArticulo.name
  if (nuevoArticulo?.qty > 0) {
    elementText = `${elementText} x ${nuevoArticulo.qty}`
  }
  if (nuevoArticulo?.price > 0) {
    elementText = `${elementText} @ ${nuevoArticulo.price}€`
  }
  elemento.innerText = elementText
  elemento.id = nuevoArticulo.id
  boton.innerText = 'BORRAR'
  boton.addEventListener('click', removeFromShoppingList.bind(this, nuevoArticulo), { once: true })
  elemento.appendChild(boton)
  listaArticulos.appendChild(elemento)
  resetFormState()
}

function removeFromShoppingList(articulo) {
  const carrito = listaCompra.get()
  carrito.removeItem(articulo)
}

function removeFromElementsList(articulo) {
  const listaArticulos = document.getElementById('lista')
  console.log('remove from elements list', articulo.id)
  for (const node of listaArticulos.childNodes) {
    if (node.id === articulo.id) {
      listaArticulos.removeChild(node)
    }
  }
}

function resetShoppingList() {
  const listaArticulos = document.getElementById('lista')
  const carrito = listaCompra.get()

  carrito.emptyBasket()

  for (let i = listaArticulos.childNodes.length - 1; i > 1; i--){
    listaArticulos.removeChild(listaArticulos.lastChild)
  }
  resetFormState()
}

function resetFormState() {
  const campoArticulo = document.getElementById('articulo')
  const campoQty = document.getElementById('qty')
  const campoPrecio = document.getElementById('precio')
  const botonArticulo = document.getElementById('nuevoArticulo')
  const totalLista = document.getElementById('total')
  const carrito = listaCompra.get()
  campoArticulo.value = ''
  campoQty.value = 1
  campoPrecio.value = 0
  botonArticulo.setAttribute('disabled', undefined)
  totalLista.innerText = `${carrito.getTotal()}€`
  // Patrón: Decorator
  carrito.log()
}
