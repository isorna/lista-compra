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
  MILK: 'LECHE',
  FRUIT: 'FRUTA',
  MEAT: 'CARNE'
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

console.log(URLS.home, I18N.en['new.article'])

console.log('LISTA DE LA COMPRA POR DEFECTO', shoppingList)

// TOMORROW:
// Add current article to shopping list
function addToShoppingList() {
  // Add to shopping list as text string
  let newArticle = document.getElementById('article').value
  let articleQty = document.getElementById('qty').value
  let articlePrice = document.getElementById('price').value

  if (newArticle === '') {
    console.error('Falta el nombre del articulo')
    return
  } else {
    newArticle = newArticle.toUpperCase()
  }

  switch (newArticle) {
    case PRODUCTS.MILK:
      articleQty = 12
      break;
    case PRODUCTS.FRUIT:
      articleQty = 3
      break;
    default:
      if (articleQty === '') {
        articleQty = 0
      }
      break;
  }

  if (articlePrice === '') {
    articlePrice = 0
  }

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