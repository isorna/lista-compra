// @ts-check
import { ArticleFactory, ARTICLE_TYPES, Article, UsualProduct } from 'classes/ShopArticle'
import { shoppingList } from 'classes/Shop'
import { simpleFetch } from '../js/lib/simpleFetch.js'
import { HttpError } from './classes/HttpError.js'
import { store } from './store/redux.js'

const myFactory = new ArticleFactory

// Assign DOM Content Loaded event
document.addEventListener('DOMContentLoaded', onDomContentLoaded)

// ======== EVENTS ======== //
function onDomContentLoaded() {
  const articleNameElement = document.getElementById('articleName')
  const newArticleElement = document.getElementById('newArticle')
  const newListElement = document.getElementById('newList')

  articleNameElement?.addEventListener('keyup', onArticleNameKeyUp)
  newArticleElement?.addEventListener('click', onNewArticleClick)
  newListElement?.addEventListener('click', onNewListClick)

  console.log(store.article.getById('1'))

  readShoppingList()
  getShoppingListTotalAmount()
  getUsualProducts()
}

/**
 *
 * @param {KeyboardEvent} e
 */
function onArticleNameKeyUp(e) {
  const articleNameElement = document.getElementById('articleName')
  const newArticleElement = document.getElementById('newArticle')

  if (articleNameElement?.getAttribute('value') !== '') {
    newArticleElement?.removeAttribute('disabled')
  } else {
    newArticleElement?.setAttribute('disabled', 'true')
  }
}

/**
 *
 * @param {MouseEvent} e
 */
function onNewArticleClick(e) {
  createShoppingListItem()
  cleanUpForm()
}

/**
 *
 * @param {MouseEvent} e
 */
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
  shoppingList.get().empty()
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
  if (articleNameElement) {
    /** @type {HTMLInputElement} */(articleNameElement).value = ''
  }
  if (qtyElement) {
    /** @type {HTMLInputElement} */(qtyElement).value = ''
  }
  if (priceElement) {
    /** @type {HTMLInputElement} */(priceElement).value = ''
  }
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
    name: getInputValue(articleNameElement),
    qty: getInputValue(qtyElement),
    price: getInputValue(priceElement)
  }
  const newArticle = myFactory.create({ type: ARTICLE_TYPES.USUAL, articleData: articleData })

  shoppingList.get().push(newArticle)
  // Save shoppingList on localStorage
  localStorage.setItem('shoppingList', JSON.stringify(shoppingList.get()))
  getShoppingListTotalAmount()
  addNewRowToShoppingListTable(newArticle)
  resetFocus()
}

/**
 * Retrieves the value from the specified input element.
 * @param {HTMLElement | null} inputElement - The input element from which to get the value.
 * @returns {string} The value of the input element, or an empty string if the element is null.
 */
function getInputValue(inputElement) {
  if (inputElement) {
    return /** @type {HTMLInputElement} */(inputElement).value
  } else {
    return ''
  }
}

/**
 * Add a new row to the shopping list table element
 * @param {Article | UsualProduct} newArticleObject
 * @returns {any}
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
  newArticleTableCellQty.innerText = String(newArticleObject.qty)
  newArticleTableCellName.innerText = newArticleObject.name
  newArticleTableCellName.addEventListener('click', buyArticle.bind(newArticleTableCellName, clickEvent, newArticleObject.id, newArticleTableRow))
  newArticleTableCellPrice.innerText = String(newArticleObject.price)
  newArticleTableCellSubtotal.innerText = String(newArticleObject.qty * newArticleObject.price)
  newArticleDeleteButton.innerText = '🗑'
  newArticleDeleteButton.className = 'delete-button'
  newArticleDeleteButton.addEventListener('click', deleteShoppingListItem.bind(newArticleDeleteButton, clickEvent, newArticleObject.id, newArticleTableRow))
  newArticleDeleteButtonCell.appendChild(newArticleDeleteButton)
  // 1.2. Append Table Cells to Table Row
  newArticleTableRow.appendChild(newArticleTableCellQty)
  newArticleTableRow.appendChild(newArticleTableCellName)
  newArticleTableRow.appendChild(newArticleTableCellPrice)
  newArticleTableRow.appendChild(newArticleTableCellSubtotal)
  newArticleTableRow.appendChild(newArticleDeleteButtonCell)
  if (newArticleObject instanceof UsualProduct) {
    if (newArticleObject?.bought === true) {
      const cellToUpdate = newArticleTableRow.querySelector('td:nth-child(2)')
      newArticleTableRow.classList.add('bought')
      if (cellToUpdate) {
        cellToUpdate.innerHTML = '🗹 ' + cellToUpdate.innerHTML
      }
    }
  }
  // 2. Append the new Table Row to the shoppingListTableBodyElement
  shoppingListTableBodyElement?.appendChild(newArticleTableRow)
}

/**
 * Update item to bought
 * @param {MouseEvent} e
 * @param {string} itemId
 * @param {HTMLElement} rowToUpdate
 */
function buyArticle(e, itemId, rowToUpdate) {
  // Find item inside shoppingList
  const itemIndex = shoppingList.get().findIndex((/** @type {UsualProduct} shoppingListItem */shoppingListItem) => shoppingListItem.id === itemId)
  const cellToUpdate = rowToUpdate.querySelector('td:nth-child(2)')
  if (shoppingList.get()[itemIndex].bought !== true) {
    shoppingList.get()[itemIndex].bought = true
    // Save shoppingList on localStorage
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList.get()))
    // Update html
    rowToUpdate.classList.add('bought')
    if (cellToUpdate) {
      cellToUpdate.innerHTML = '🗹 ' + cellToUpdate.innerHTML
    }
  } else {
    shoppingList.get()[itemIndex].bought = false
    // Save shoppingList on localStorage
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList.get()))
    // Update html
    rowToUpdate.classList.remove('bought')
    if (cellToUpdate) {
      cellToUpdate.innerHTML = cellToUpdate.innerHTML.replace('🗹 ', '')
    }
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
 * @param {MouseEvent} e
 * @param {string} itemIdToDelete
 * @param {HTMLElement} rowToDelete
 */
function deleteShoppingListItem(e, itemIdToDelete, rowToDelete) {
  // 1. Delete item from shoppingList
  // 1.1. Find item inside shoppingList
  const itemIndex = shoppingList.get().findIndex((/** @type {UsualProduct} shoppingListItem */shoppingListItem) => shoppingListItem.id === itemIdToDelete)
  // 1.2. Delete item from shoppingList Array
  shoppingList.get().splice(itemIndex, 1)
  rowToDelete.remove()
  getShoppingListTotalAmount()
  // Save shoppingList on localStorage
  localStorage.setItem('shoppingList', JSON.stringify(shoppingList.get()))
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
  for (let article of shoppingList.get()) {
    // 1. Calculate subtotals for each article
    const subtotal = article.qty * article.price
    // 2. Add all subtotals
    totalAmount += subtotal
  }
  // 3. Show it on table total amount cell
  if (shoppingListTableTotalElement) {
    shoppingListTableTotalElement.innerText = String(totalAmount)
  }
}

/**
 * Sets the focus on the first form field
 */
function resetFocus(){
  const articleNameElement = document.getElementById('articleName')
  articleNameElement?.focus()
}

/**
 * Get usual products and put them on datalist
 */
async function getUsualProducts() {
  const dataListElement = document.getElementById('productos')
  const apiData = await getAPIData()

  apiData.forEach((/** @type {UsualProduct} shoppingListItem */product) => {
    const newOptionElement = document.createElement('option')
    newOptionElement.value = product.name
    dataListElement?.appendChild(newOptionElement)
  })
}

/**
 * Get data from API
 * @returns {Promise<Array<UsualProduct>>}
 */
async function getAPIData() {
  // API endpoint
  const API_USUAL_PRODUCTS_URL = 'api/get.articles.json'
  let apiData

  try {
    apiData = await simpleFetch(API_USUAL_PRODUCTS_URL, {
      // Si la petición tarda demasiado, la abortamos
      signal: AbortSignal.timeout(3000),
    });
  } catch (/** @type {any | HttpError} */err) {
    if (err.name === 'AbortError') {
      console.error('Fetch abortado');
    }
    if (err instanceof HttpError) {
      if (err.response.status === 404) {
        console.error('Not found');
      }
      if (err.response.status === 500) {
        console.error('Internal server error');
      }
    }
  }

  return apiData
}

/**
 * Save new article to API
 * @param {UsualProduct} newArticle
 */
// function saveNewArticleToAPI(newArticle) {
//   // API endpoint
//   const API_USUAL_PRODUCTS_URL = 'api/get.articles.json'

//   fetch(API_USUAL_PRODUCTS_URL, { body: newArticle })
//     .then((response) => {
//       if (!response.ok) {
//         showError(response.status)
//       }

//       console.log('Articulo guardado')
//     })
// }

/**
 * Show error to user
 */
// TODO: create an error layer/popup
// function showError(errorMessage) {
//   window.alert(errorMessage)
//   console.error(errorMessage)
//   throw new Error(`HTTP error! Status: ${errorMessage}`);
// }

/**
 * Get saved sopphing list data
 */
function readShoppingList() {
  /** @type {Array<UsualProduct>} */
  const storedData = JSON.parse(localStorage.getItem('shoppingList') || '[]')
  storedData.forEach(savedArticle => {
    shoppingList.get().push(savedArticle)
    addNewRowToShoppingListTable(savedArticle)
  });
}