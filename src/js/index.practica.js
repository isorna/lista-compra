// 1. Definimos nuestra lista de la compra
// OLD CODE: do not use!!!
// var shoppingList = ['carne', 'pescado', 'fruta']
// Text strings
let newArticle = 'flanes'
// Numbers
let totalAmount = 0
// Arrays
let shoppingList = []
// Constants
const PERAS = 'peras'
// Example: dictionary
const URLS = {
  home: 'index.practica.html',
  tables: 'tablas.practica.html',
  notFound: '404.html'
}
const I18N = {
  es: {
    'new.article': 'Nuevo artículo'
  },
  en: {
    'new.article': 'New article'
  }
}
// Objects
let productInformation = {
  qty: 0,
  name: '',
  price: 0
}
let shoppingListWithObjects = [
  {
    qty: 1,
    name: 'carne',
    price: 10
  },
  {
    qty: 2,
    name: 'fruta',
    price: 2
  },
  {
    qty: 3,
    name: 'pescado',
    price: 20
  }
]

console.log(URLS.home, I18N.en['new.article'])

console.log('LISTA DE LA COMPRA POR DEFECTO', shoppingList)
// console.info(shoppingList)
// console.error(shoppingList)

// TOMORROW:
function addToShoppingList() {
  // Add to shopping list as text string
  let newArticle = document.getElementById('article').value
  let articleQty = document.getElementById('qty').value
  let articlePrice = document.getElementById('price').value
  // shoppingList.push(newArticle)
  // Add to shopping list as object
  let newArticleObject = {
    // TODO: remember to cast to numbers
    qty: articleQty,
    name: newArticle,
    price: articlePrice
  }
  shoppingList.push(newArticleObject)
  console.log('addToShoppingList', shoppingList)
}

function resetShoppingList() {
  shoppingList = []
  console.log('resetShoppingList', shoppingList)
}

function switchColor() {
  document.getElementsByTagName('header')[0].style.backgroundColor = 'cyan'
}