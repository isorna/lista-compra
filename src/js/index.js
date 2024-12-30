document.addEventListener('DOMContentLoaded', onDOMContentLoaded)

function onDOMContentLoaded() {
  const listaArticulos = document.getElementById('lista')
  const formulario = document.getElementById('formulario')
  const campoArticulo = document.getElementById('articulo')
  const botonArticulo = document.getElementById('nuevoArticulo')
  const botonNuevaLista = document.getElementById('nuevaLista')
  const listaCompra = JSON.parse(window.localStorage.getItem('lista-compra')) || []

  formulario.addEventListener('submit', onFormSubmit)
  campoArticulo.addEventListener('keyup', onInputKeyUp)
  botonArticulo.addEventListener('click', onNewArticleClick)
  botonNuevaLista.addEventListener('click', onNewListClick)

  if (listaCompra.length > 0){
    for (let i = 0; i < listaCompra.length; i++){
      const elemento = document.createElement('li')
      elemento.innerText = listaCompra[i].nombre
      listaArticulos.appendChild(elemento)
    }
  }
}

function onFormSubmit(e) {
  e.preventDefault()
}

function onInputKeyUp(e) {
  e.stopPropagation()
  const botonArticulo = document.getElementById('nuevoArticulo')

  if (this.value !== '') {
    botonArticulo.removeAttribute('disabled')
  } else {
    botonArticulo.setAttribute('disabled', undefined)
  }
}

function onNewArticleClick(e) {
  e.stopPropagation()
  const listaArticulos = document.getElementById('lista')
  const campoArticulo = document.getElementById('articulo')
  const botonArticulo = document.getElementById('nuevoArticulo')
  const listaCompra = JSON.parse(window.localStorage.getItem('lista-compra')) || []

  if (campoArticulo.value !== '') {
    const nuevaListaCompra = [
      ...listaCompra,
      {
        nombre: campoArticulo.value
      }
    ]
    window.localStorage.setItem('lista-compra', JSON.stringify(nuevaListaCompra))
    const elemento = document.createElement('li')
    elemento.innerText = campoArticulo.value
    listaArticulos.appendChild(elemento)
    campoArticulo.value = ''
    botonArticulo.setAttribute('disabled', undefined)
  }
}

function onNewListClick(e) {
  e.stopPropagation()
  const listaArticulos = document.getElementById('lista')
  const campoArticulo = document.getElementById('articulo')
  const botonArticulo = document.getElementById('nuevoArticulo')
  campoArticulo.value = ''
  botonArticulo.setAttribute('disabled', undefined)
  window.localStorage.removeItem('lista-compra')
  for (let i = listaArticulos.childNodes.length - 1; i > 1; i--){
    listaArticulos.removeChild(listaArticulos.lastChild)
  }
}