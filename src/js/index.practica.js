// 1. Definimos nuestra lista de la compra
// Text strings
let newArticleName = 'flanes'
// Numbers
let totalAmount = 0
// Arrays
let shoppingList = []
// Constants
const PERAS = 'peras'
// TODO: define my shopping list items
const PRODUCTS = {
  MILK: 'leche',
  FRUIT: 'fruta',
  MEAT: 'carne'
}
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

console.log('LISTA DE LA COMPRA POR DEFECTO', shoppingList)

// TOMORROW:
// Add current article to shopping list
function addToShoppingList() {
  // Add to shopping list as text string
  let articleName = document.getElementById('article').value
  let articleQty = document.getElementById('qty').value
  let articlePrice = document.getElementById('price').value
  // Define new article object
  let newArticleObject = {
    qty: 0,
    name: '',
    price: 0
  }

  if (articleName === '') {
    console.error('Falta el nombre del articulo')
    return
  }

  // Depending on article type, assign default qty and price
  switch (articleName) {
    case PRODUCTS.MILK:
      articleQty = 12
      articlePrice = 24
      break;
    case PRODUCTS.FRUIT:
      articleQty = 3
      articlePrice = 2
      break;
    default:
      break;
  }

  // Change empty values to zero when needed
  if (articleQty === '') {
    articleQty = 0
  }
  if (articlePrice === '') {
    articlePrice = 0
  }

  // newArticleObject.name = articleName
  // newArticleObject.qty = articleQty
  // newArticleObject.price = articlePrice
  newArticleObject = {
    qty: articleQty,
    name: articleName,
    price: articlePrice
  }
  console.log('addToShoppingList NEW ARTICLE', newArticleObject)
  // Add to shopping list as object
  shoppingList.push(newArticleObject)
  console.log('addToShoppingList SHOPPING LIST', shoppingList)
}

/**
 *
 */
function resetShoppingList() {
  shoppingList = []
  console.log('resetShoppingList', shoppingList)
}

function switchColor() {
  document.getElementsByTagName('header')[0].style.backgroundColor = 'cyan'
}