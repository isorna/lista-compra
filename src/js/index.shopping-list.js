import { ArticleFactory, ARTICLE_TYPES } from './classes/ShopArticle.js'
import { shoppingList } from './classes/Shop.js'

const myFactory = new ArticleFactory

// Assign DOM Content Loaded event
document.addEventListener('DOMContentLoaded', onDomContentLoaded)

// ======== EVENTS ======== //
function onDomContentLoaded() {
  const articleNameElement = document.getElementById('articleName')
  const newArticleElement = document.getElementById('newArticle')
  const newListElement = document.getElementById('newList')

  articleNameElement.addEventListener('keyup', onArticleNameKeyUp)
  newArticleElement.addEventListener('click', onNewArticleClick)
  newListElement.addEventListener('click', onNewListClick)

  readShoppingList()
  getShoppingListTotalAmount()
  getUsualProducts()
}

function onArticleNameKeyUp(e) {
  const articleNameElement = document.getElementById('articleName')
  const newArticleElement = document.getElementById('newArticle')

  if (articleNameElement.value !== '') {
    newArticleElement.disabled = undefined
  } else {
    newArticleElement.disabled = true
  }
}

function onNewArticleClick(e) {
  createShoppingListItem()
  cleanUpForm()
}

function onNewListClick(e) {
  resetShoppingList()
}

// ======== METHODS ======== //

/**
 * Reset shopping list
 */
function resetShoppingList() {
  // 1. Empty the shopping list
  localStorage.removeItem('shoppingList')
  shoppingList.empty()
  // 2. Empty Table Element
  emptyTableElement()
  // 3. Update Table total amount cell
  getShoppingListTotalAmount()
  // 4. Clean Up form
  cleanUpForm()
}

/**
 * Clean up form
 */
function cleanUpForm() {
  // 1. Get inputs and save them in const
  const articleNameElement = document.getElementById('articleName')
  const qtyElement = document.getElementById('qty')
  const priceElement = document.getElementById('price')
  // 2. Set input values to ''
  articleNameElement.value = ''
  qtyElement.value = ''
  priceElement.value = ''
}

// C.R.U.D.

/**
 * Create new shopping list item
 */
function createShoppingListItem() {
  const articleNameElement = document.getElementById('articleName')
  const qtyElement = document.getElementById('qty')
  const priceElement = document.getElementById('price')
  const articleData = {
    name: articleNameElement.value,
    qty: qtyElement.value,
    price: priceElement.value
  }
  const newArticle = myFactory.create(ARTICLE_TYPES.USUAL, articleData)

  shoppingList.push(newArticle)
  // Save shoppingList on localStorage
  localStorage.setItem('shoppingList', JSON.stringify(shoppingList))
  getShoppingListTotalAmount()
  addNewRowToShoppingListTable(newArticle)
  resetFocus()
}

/**
 * Add a new row to the shopping list table element
 */
function addNewRowToShoppingListTable(newArticleObject){
  const shoppingListTableBodyElement = document.getElementById('shoppingListTableBody')
  // 1. Create HTML Elements that represents the new article
  const newArticleTableRow = document.createElement('tr')
  const newArticleTableCellQty = document.createElement('td')
  const newArticleTableCellName = document.createElement('td')
  const newArticleTableCellPrice = document.createElement('td')
  const newArticleTableCellSubtotal = document.createElement('td')
  const newArticleDeleteButtonCell = document.createElement('td')
  const newArticleDeleteButton = document.createElement('button')
  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  })
  // 1.1. Assign Table Cells values
  newArticleTableCellQty.innerText = newArticleObject.qty
  newArticleTableCellName.innerText = newArticleObject.name
  newArticleTableCellName.addEventListener('click', buyArticle.bind(this, clickEvent, newArticleObject.id, newArticleTableRow))
  newArticleTableCellPrice.innerText = newArticleObject.price
  newArticleTableCellSubtotal.innerText = newArticleObject.qty * newArticleObject.price
  newArticleDeleteButton.innerText = '🗑'
  newArticleDeleteButton.className = 'delete-button'
  newArticleDeleteButton.addEventListener('click', deleteShoppingListItem.bind(this, clickEvent, newArticleObject.id, newArticleTableRow))
  newArticleDeleteButtonCell.appendChild(newArticleDeleteButton)
  // 1.2. Append Table Cells to Table Row
  newArticleTableRow.appendChild(newArticleTableCellQty)
  newArticleTableRow.appendChild(newArticleTableCellName)
  newArticleTableRow.appendChild(newArticleTableCellPrice)
  newArticleTableRow.appendChild(newArticleTableCellSubtotal)
  newArticleTableRow.appendChild(newArticleDeleteButtonCell)
  if (newArticleObject.bought === true) {
    newArticleTableRow.classList.add('bought')
    console.log('entra', newArticleTableCellName.innerText)
    newArticleTableRow.querySelector('td:nth-child(2)').innerHTML += '&#x1F5F9;'
  }
  // 2. Append the new Table Row to the shoppingListTableBodyElement
  shoppingListTableBodyElement.appendChild(newArticleTableRow)
}

/**
 * Update item to bought
 */
function buyArticle(e, itemId, rowToUpdate) {
  // Find item inside shoppingList
  const itemIndex = shoppingList.findIndex((shoppingListItem) => shoppingListItem.id === itemId)
  if (shoppingList[itemIndex].bought !== true) {
    shoppingList[itemIndex].bought = true
    // Save shoppingList on localStorage
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList))
    // Update html
    rowToUpdate.classList.add('bought')
    rowToUpdate.querySelector('td:nth-child(2)').innerHTML += '&#x1F5F9;'
  }
}

/**
 * Update existing shopping list item
 */
function updateShoppingListItem() {
  getShoppingListTotalAmount()
}

/**
 * Delete existing shopping list item
 */
function deleteShoppingListItem(e, itemIdToDelete, rowToDelete) {
  // 1. Delete item from shoppingList
  // 1.1. Find item inside shoppingList
  const itemIndex = shoppingList.findIndex((shoppingListItem) => shoppingListItem.id === itemIdToDelete)
  // 1.2. Delete item from shoppingList Array
  shoppingList.splice(itemIndex, 1)
  rowToDelete.remove()
  getShoppingListTotalAmount()
  // Save shoppingList on localStorage
  localStorage.setItem('shoppingList', JSON.stringify(shoppingList))
}

/**
 * Empty table element
 */
function emptyTableElement() {
  const shoppingListTableBodyRowsList = document.querySelectorAll('tbody>tr')
  // 1. For each table row found
  for (let tableRow of shoppingListTableBodyRowsList) {
    // 2. Remove it from the table element
    tableRow.remove()
  }
}

/**
 * Calculate shopping list total amount
 */
function getShoppingListTotalAmount() {
  const shoppingListTableTotalElement = document.getElementById('shoppingListTableTotal')
  let totalAmount = 0
  for (let article of shoppingList) {
    // 1. Calculate subtotals for each article
    const subtotal = article.qty * article.price
    // 2. Add all subtotals
    totalAmount += subtotal
  }
  // 3. Show it on table total amount cell
  shoppingListTableTotalElement.innerText = totalAmount
}

/**
 * Sets the focus on the first form field
 */
function resetFocus(){
  const articleNameElement = document.getElementById('articleName')
  articleNameElement.focus()
}

/**
 * Get usual products and put them on datalist
 */
async function getUsualProducts() {
  const dataListElement = document.getElementById('productos')
  const apiData = await getAPIData()

  apiData.forEach((product) => {
    const newOptionElement = document.createElement('option')
    newOptionElement.value = product.name
    dataListElement.appendChild(newOptionElement)
  })
}

/**
 * Get data from API
 */
async function getAPIData() {
  // API endpoint
  const API_USUAL_PRODUCTS_URL = 'api/get.articles.json'

  const apiData = await fetch(API_USUAL_PRODUCTS_URL)
    .then((response) => {
      if (!response.ok) {
        showError(response.status)
      }

      return response.json();
    })
    // TODO:
    // .catch()...

  return apiData
}

/**
 * Save new article to API
 */
// TODO: verlo la proxima semana
function saveNewArticleToAPI(newArticle) {
  // API endpoint
  const API_USUAL_PRODUCTS_URL = 'api/get.articles.json'

  fetch(API_USUAL_PRODUCTS_URL, { body: newArticle })
    .then((response) => {
      if (!response.ok) {
        showError(response.status)
      }

      console.log('Articulo guardado')
    })
}

/**
 * Show error to user
 */
// TODO: create an error layer/popup
function showError(errorMessage) {
  window.alert(errorMessage)
  console.error(errorMessage)
  throw new Error(`HTTP error! Status: ${errorMessage}`);
}

/**
 * Get saved sopphing list data
 */
function readShoppingList() {
  // TODO: ESTA semana, explicar esta condición
  const storedData = JSON.parse(localStorage.getItem('shoppingList')) || []
  storedData.forEach(savedArticle => {
    shoppingList.push(savedArticle)
    addNewRowToShoppingListTable(savedArticle)
  });
}