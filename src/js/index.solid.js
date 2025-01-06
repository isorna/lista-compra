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
  const listaCompra = JSON.parse(window.localStorage.getItem('lista-compra')) || []

  if (listaCompra.length > 0){
    for (let i = 0; i < listaCompra.length; i++){
      addToElementsList(listaCompra[i].name)
    }
  }
}

function addToShoppingList(){
  const campoArticulo = document.getElementById('articulo')
  const nuevoArticulo = campoArticulo.value

  if (nuevoArticulo !== '') {
    const listaCompra = JSON.parse(window.localStorage.getItem('lista-compra')) || []
    const nuevaListaCompra = [
      ...listaCompra,
      {
        name: nuevoArticulo
      }
    ]
    window.localStorage.setItem('lista-compra', JSON.stringify(nuevaListaCompra))
    addToElementsList(nuevoArticulo)
  }
}

function addToElementsList(nuevoArticulo){
  const listaArticulos = document.getElementById('lista')
  const elemento = document.createElement('li')
  elemento.innerText = nuevoArticulo
  listaArticulos.appendChild(elemento)
  resetFormState()
}

function resetShoppingList() {
  const listaArticulos = document.getElementById('lista')
  window.localStorage.removeItem('lista-compra')

  for (let i = listaArticulos.childNodes.length - 1; i > 1; i--){
    listaArticulos.removeChild(listaArticulos.lastChild)
  }
  resetFormState()
}

function resetFormState(){
  const campoArticulo = document.getElementById('articulo')
  const botonArticulo = document.getElementById('nuevoArticulo')
  campoArticulo.value = ''
  botonArticulo.setAttribute('disabled', undefined)
}
