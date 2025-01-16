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

// Add current article to shopping list
function addToShoppingList() {
  // Add to shopping list as text string
  let articleName = document.getElementById('article').value
  let articleQty = document.getElementById('qty').value
  let articlePrice = document.getElementById('price').value
  let shoppingListTableBody = document.getElementById('shoppingListTableBody')
  let shoppingListTableTotal = document.getElementById('shoppingListTableTotal')
  let totalAmount = 0
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

  // Cast to numbers when needed
  articleQty = Number(articleQty)
  articlePrice = Number(articlePrice)

  // Update declared new article object with final values
  newArticleObject = {
    qty: articleQty,
    name: articleName,
    price: articlePrice
  }

  // Add to shopping list as object
  shoppingList.push(newArticleObject)

  // Calculate total amount
  for (let i = 0; i < shoppingList.length; i = i + 1) {
    // For each shoppingList item:
    let shoppingListItem = shoppingList[i]
    let shoppingListItemSubtotal = shoppingListItem.qty * shoppingListItem.price
    totalAmount = totalAmount + shoppingListItemSubtotal
  }
  shoppingListTableTotal.innerText = totalAmount

  // Create new article on table
  // 1. Create table row
  let newTableRow = document.createElement('tr')
  // 2. Create row cells
  let qtyCell = document.createElement('td')
  let nameCell = document.createElement('td')
  let priceCell = document.createElement('td')
  let subtotalCell = document.createElement('td')
  // 3. Add cell values
  qtyCell.innerText = newArticleObject.qty
  nameCell.innerText = newArticleObject.name
  priceCell.innerText = newArticleObject.price
  subtotalCell.innerText = (newArticleObject.qty * newArticleObject.price) + ' €'
  // 4. Add cells to table row
  newTableRow.appendChild(qtyCell)
  newTableRow.appendChild(nameCell)
  newTableRow.appendChild(priceCell)
  newTableRow.appendChild(subtotalCell)
  // 5. Add table row to shoppingListTableBody
  shoppingListTableBody.appendChild(newTableRow)
}

function resetShoppingList() {
  shoppingList = []
  console.log('resetShoppingList', shoppingList)
}