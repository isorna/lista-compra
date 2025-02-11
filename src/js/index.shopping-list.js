// @ts-check
import { ArticleFactory, ARTICLE_TYPES } from 'classes/ShopArticle'
import { simpleFetch } from '../js/lib/simpleFetch.js'
import { HttpError } from './classes/HttpError.js'
import { INITIAL_STATE, store } from './store/redux.js'
import { installRouter } from './lib/router.js'
// import { icons } from './lib/icons.js'

/** @import {State, User} from './store/redux.js' */
/** @import {Article, UsualProduct} from './classes/ShopArticle.js' */

const myFactory = new ArticleFactory
const API_PORT = 3333

// Assign DOM Content Loaded event
document.addEventListener('DOMContentLoaded', onDomContentLoaded)

// ======== EVENTS ======== //
function onDomContentLoaded() {
  const articleNameElement = document.getElementById('articleName')
  const newArticleElement = document.getElementById('newArticle')
  const newListElement = document.getElementById('newList')
  const loginForm = document.getElementById('loginForm')
  const logoutButton = document.getElementById('logoutButton')

  // Activate router
  installRouter((/** @type {Location} */ location) => {handleNavigation(location)})
  // Home page
  articleNameElement?.addEventListener('keyup', onArticleNameKeyUp)
  newArticleElement?.addEventListener('click', onNewArticleClick)
  newListElement?.addEventListener('click', onNewListClick)
  // Login
  loginForm?.addEventListener('submit', onLoginFormSubmit)
  logoutButton?.addEventListener('click', onLogoutClick)

  // REMOVE: Log store changes
  window.addEventListener('stateChanged', (event) => {
    console.log('stateChanged', /** @type {CustomEvent} */(event).detail)
  })

  // This is just a test
  // for (let icon in icons) {
  //   let iconElement = document.createElement('div')
  //   // @ts-expect-error testing
  //   iconElement.innerHTML = icons[icon]
  //   document.getElementById('menu')?.appendChild(iconElement)
  // }

  checkLoginStatus()
  readShoppingList()
  getShoppingListTotalAmount()
  // getUsualProducts()
}

function onArticleNameKeyUp() {
  const articleNameElement = document.getElementById('articleName')
  const newArticleElement = document.getElementById('newArticle')

  if (articleNameElement?.getAttribute('value') !== '') {
    newArticleElement?.removeAttribute('disabled')
  } else {
    newArticleElement?.setAttribute('disabled', 'true')
  }
}

function onNewArticleClick() {
  createShoppingListItem()
  cleanUpForm()
}

function onNewListClick() {
  resetShoppingList()
}

/**
 * Handle form submit event from login form
 * @param {Event} e
 */
async function onLoginFormSubmit(e){
  const emailElement = document.getElementById('email')
  const passwordElement = document.getElementById('password')
  const loginData = {
    email: getInputValue(emailElement),
    password: getInputValue(passwordElement)
  }

  e.preventDefault()

  if (loginData.email !== '' && loginData.password !== '') {
    const payload = JSON.stringify(loginData)
    const apiData = await getAPIData(`http://${location.hostname}:${API_PORT}/login`, 'POST', payload)

    if (!apiData) {
      // Show error
      alert('El usuario no existe')
    } else {
      if ('_id' in apiData
        && 'name' in apiData
        && 'email' in apiData
        && 'token' in apiData
        && 'role' in apiData) {
        const userData = /** @type {User} */(apiData)
        // store.user.login(userData, setSessionStorageFromStore)
        // setSessionStorageFromStore()
        updateSessionStorage({ user: userData })
        // Redirect to home
        activateLoggedInUI(true)
        navigateTo('/')
      } else {
        alert('Invalid user data')
      }
    }
  }
}

/**
 * Logs out the user
 * @returns void
 */
function onLogoutClick() {
  // Logout user
  // store.user.logout(setLocalStorageFromStore)
  // store.user.logout(setSessionStorageFromStore)
  updateSessionStorage({ user: {} })
  activateLoggedInUI(false)
  // Redirect to home
  navigateTo('/')
}

// ======== METHODS ======== //

/**
 * Reset shopping list
 */
async function resetShoppingList() {
  // Reset database collection
  const result = await getAPIData(`http://${location.hostname}:${API_PORT}/delete/all/articles`, 'DELETE')

  if (!result) {
    // Show error
    alert('Error deleting all articles')
    console.error('Error deleting all articles', result)
  } else {
    // 1. Empty the shopping list
    store.article.deleteAll(setLocalStorageFromStore)
    // 2. Empty Table Element
    emptyTableElement()
    // 3. Update Table total amount cell
    getShoppingListTotalAmount()
    // 4. Clean Up form
    cleanUpForm()
  }
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
async function createShoppingListItem() {
  const articleNameElement = document.getElementById('articleName')
  const qtyElement = document.getElementById('qty')
  const priceElement = document.getElementById('price')

  const articleData = {
    name: getInputValue(articleNameElement),
    qty: getInputValue(qtyElement),
    price: getInputValue(priceElement)
  }
  const payload = JSON.stringify(articleData)
  // Send fetch to API, create new article
  const apiData = await getAPIData(`http://${location.hostname}:${API_PORT}/create/articles`, 'POST', payload)
  if (!apiData) {
    // Show error
    alert('Error creating article')
    console.error('Error creating article', apiData)
    return
  }
  // TODO: fix this "any" type assignment
  const newArticle = myFactory.create({ type: ARTICLE_TYPES.USUAL, articleData: /** @type {any} */(apiData) })
  store.article.create(newArticle, setLocalStorageFromStore)

  // Update html
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
  const newArticleImg = document.createElement('img')
  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  })
  // 1.1. Assign Table Cells values
  newArticleTableCellQty.innerText = String(newArticleObject.qty)
  newArticleTableCellName.innerText = newArticleObject.name
  newArticleTableCellName.addEventListener('click', buyArticle.bind(newArticleTableCellName, clickEvent, newArticleObject._id, newArticleTableRow))
  newArticleTableCellPrice.innerText = String(newArticleObject.price)
  newArticleTableCellSubtotal.innerText = String(newArticleObject.qty * newArticleObject.price)
  // newArticleDeleteButton.innerHTML = '&#128473;&#xfe0e;'
  newArticleDeleteButton.className = 'icon-button delete-button'
  newArticleImg.src = './assets/img/cancel.png'
  newArticleImg.setAttribute('alt', 'Eliminar')
  newArticleDeleteButton.appendChild(newArticleImg)
  newArticleDeleteButton.addEventListener('click', deleteShoppingListItem.bind(newArticleDeleteButton, clickEvent, newArticleObject._id, newArticleTableRow))
  newArticleDeleteButtonCell.appendChild(newArticleDeleteButton)
  // 1.2. Append Table Cells to Table Row
  newArticleTableRow.appendChild(newArticleTableCellQty)
  newArticleTableRow.appendChild(newArticleTableCellName)
  newArticleTableRow.appendChild(newArticleTableCellPrice)
  newArticleTableRow.appendChild(newArticleTableCellSubtotal)
  newArticleTableRow.appendChild(newArticleDeleteButtonCell)
  if (/** @type {UsualProduct} */(newArticleObject)?.bought === true) {
    newArticleTableRow.classList.add('bought')
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
async function buyArticle(e, itemId, rowToUpdate) {
  // Find item inside shoppingList
  const itemToUpdate = store.article.getById(itemId)
  // Update html
  if (itemToUpdate.bought !== true) {
    rowToUpdate.classList.add('bought')
  } else {
    rowToUpdate.classList.remove('bought')
  }
  // Modify Article data
  itemToUpdate.bought = !itemToUpdate.bought

  const updatedData = {
    bought: itemToUpdate.bought,
    test: {
      miPrueba: true,
      otraPrueba: [1,2,3]
    }
  }
  const payload = JSON.stringify(updatedData)
  // Send fetch to API, update article
  await getAPIData(`http://${location.hostname}:${API_PORT}/update/articles/${itemToUpdate._id}`, 'PUT', payload)
  // console.log('after update on API', apiData)
  store.article.update(itemToUpdate, setLocalStorageFromStore)
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
async function deleteShoppingListItem(e, itemIdToDelete, rowToDelete) {
  // Send fetch to API, delete article
  const result = await getAPIData(`http://${location.hostname}:${API_PORT}/delete/articles/${itemIdToDelete}`, 'DELETE')

  if (result) {
    console.log('after delete on API', result)
    // Delete item from store
    store.article.delete(store.article.getById(itemIdToDelete), setLocalStorageFromStore)
    // Update html
    rowToDelete.remove()
    getShoppingListTotalAmount()
  } else {
    alert('Error deleting article')
    console.error('Error deleting article', result)
  }
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

  for (let article of store.article.getAll()) {
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
// async function getUsualProducts() {
//   const dataListElement = document.getElementById('productos')
//   // const apiData = await getAPIData(`http://${location.hostname}:${API_PORT}/get.articles.json`)
//   const apiData = await getAPIData(`http://${location.hostname}:${API_PORT}/read/articles`)

//   apiData.forEach((itemData) => {
//     const product = /** @type {UsualProduct} */(itemData)
//     const newOptionElement = document.createElement('option')
//     newOptionElement.value = product.name
//     dataListElement?.appendChild(newOptionElement)
//   })
// }

/**
 * Get data from API
 * @param {string} apiURL
 * @param {string} method
 * @param {Object} [data]
 * @returns {Promise<Array<UsualProduct | User>>}
 */
async function getAPIData(apiURL, method = 'GET', data) {
  let apiData

  try {
    let headers = new Headers()
    headers.append('Content-Type', 'application/json')
    headers.append('Access-Control-Allow-Origin', '*')
    if (data) {
      headers.append('Content-Length', String(JSON.stringify(data).length))
    }
    // Set Bearer authorization if user is logged in
    if (isUserLoggedIn()) {
      const userData = getDataFromSessionStorage()
      headers.append('Authorization', `Bearer ${userData?.user?.token}`)
    }
    apiData = await simpleFetch(apiURL, {
      // Si la petición tarda demasiado, la abortamos
      signal: AbortSignal.timeout(3000),
      method: method,
      body: data ?? undefined,
      headers: headers
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
 * Get saved sopphing list data
 */
async function readShoppingList() {
  /** @type {State} */
  const apiData = await getAPIData(`http://${location.hostname}:${API_PORT}/read/articles`)
  console.log('apiData', apiData)
  const storeData = {
    articles: apiData
  }
  updateLocalStorage(storeData)
  const storedData = getDataFromLocalStorage()
  storedData?.articles.forEach((/** @type {Article | UsualProduct} */ savedArticle) => {
    store.article.create(savedArticle)
    addNewRowToShoppingListTable(savedArticle)
  });
}

/**
 * Saves shopping list on localStorage
 * @param {State} storeValue
 */
function updateLocalStorage(storeValue) {
  localStorage.setItem('shoppingList', JSON.stringify(storeValue))
}

/**
 * Saves shopping list on sessionStorage
 * @param {State} storeValue
 */
function updateSessionStorage(storeValue) {
  sessionStorage.setItem('shoppingList', JSON.stringify(storeValue))
}

/**
 * Saves the current state of the store in local storage.
 * Removes the user's data from the store before saving.
 */
function setLocalStorageFromStore() {
  // Remove user data from store before saving
  const storeState = store.getState()
  delete storeState.user
  updateLocalStorage(storeState)
}

/**
 * Saves the current state of the store in session storage.
 * Removes all data except the user data from the store before saving.
 */
// function setSessionStorageFromStore() {
//   // Remove unused data from store before saving
//   const storeState = store.getState()
//   delete storeState.articles
//   delete storeState.error
//   delete storeState.isLoading
//   delete storeState.route
//   updateSessionStorage(storeState)
// }

/**
 * Retrieves the shopping list data from local storage.
 *
 * @returns {State} Saved state.
 * If no data is found, returns an empty State object.
 */

function getDataFromLocalStorage() {
  const defaultValue = JSON.stringify(INITIAL_STATE)
  return JSON.parse(localStorage.getItem('shoppingList') || defaultValue)
}

/**
 * Checks if there is a user logged in by verifying the presence of a token
 * in the local storage.
 *
 * @returns {boolean} True if the user is logged in, false otherwise.
 */
function isUserLoggedIn() {
  const userData = getDataFromSessionStorage()
  return userData?.user?.token
}

/**
 * Retrieves the shopping list data from session storage.
 *
 * @returns {State} Saved state.
 * If no data is found, returns an empty State object.
 */

function getDataFromSessionStorage() {
  const defaultValue = JSON.stringify(INITIAL_STATE)
  return JSON.parse(sessionStorage.getItem('shoppingList') || defaultValue)
}

/**
 * Handles navigation changes
 * @param {Location} location - The new location
 */
function handleNavigation(location) {
  const newLocation = location.pathname.replace(/\/src/, '')
  store.route.set(newLocation, setLocalStorageFromStore)

  switch (newLocation) {
    case '/':
      document?.getElementById('login')?.classList.add('hidden')
      document?.getElementById('diary')?.classList.add('hidden')
      document?.getElementById('menus')?.classList.add('hidden')
      document?.getElementById('stats')?.classList.add('hidden')
      document?.getElementById('home')?.classList.remove('hidden')
      break
    case '/login':
      document?.getElementById('diary')?.classList.add('hidden')
      document?.getElementById('menus')?.classList.add('hidden')
      document?.getElementById('stats')?.classList.add('hidden')
      document?.getElementById('home')?.classList.add('hidden')
      document?.getElementById('login')?.classList.remove('hidden')
      break
    case '/diary':
      document?.getElementById('login')?.classList.add('hidden')
      document?.getElementById('menus')?.classList.add('hidden')
      document?.getElementById('stats')?.classList.add('hidden')
      document?.getElementById('home')?.classList.add('hidden')
      document?.getElementById('diary')?.classList.remove('hidden')
      break
    case '/menus':
      document?.getElementById('login')?.classList.add('hidden')
      document?.getElementById('diary')?.classList.add('hidden')
      document?.getElementById('stats')?.classList.add('hidden')
      document?.getElementById('home')?.classList.add('hidden')
      document?.getElementById('menus')?.classList.remove('hidden')
      break
    case '/stats':
      document?.getElementById('login')?.classList.add('hidden')
      document?.getElementById('diary')?.classList.add('hidden')
      document?.getElementById('menus')?.classList.add('hidden')
      document?.getElementById('home')?.classList.add('hidden')
      document?.getElementById('stats')?.classList.remove('hidden')
      break
    default:
      console.log('404', newLocation)
      break
  }
}

/**
 * Navigates to the specified path
 * @param {string} pathname
 */
function navigateTo(pathname) {
  const newLocation = {
    ...window.location,
    pathname
  }
  window.history.pushState({}, '', pathname)
  handleNavigation(newLocation)
}


/**
 * Check user login status
 */
function checkLoginStatus() {
  /** @type {State} */
  const storedData = getDataFromSessionStorage()
  if (storedData?.user?.token) {
    // const storeUserData = /** @type {User} */(storedData?.user)
    // delete storeUserData.password
    // store.user.login(storeUserData)
    activateLoggedInUI(true)
  }
}

/**
 * Updates the UI to show either the login link or the logout button
 * based on the given isLoggedIn flag
 * @param {boolean} [isLoggedIn=false]
 */
function activateLoggedInUI(isLoggedIn = false) {
  const loginLink = document.getElementById('loginLink')
  const logoutButton = document.getElementById('logoutButton')
  // Update UI
  if (isLoggedIn) {
    loginLink?.classList.add('hidden')
    logoutButton?.classList.remove('hidden')
  } else {
    logoutButton?.classList.add('hidden')
    loginLink?.classList.remove('hidden')
  }
}

/**
 * Exports for testing
 */
export {
  addNewRowToShoppingListTable,
  updateShoppingListItem,
  deleteShoppingListItem,
  getShoppingListTotalAmount,
  getDataFromLocalStorage,
  readShoppingList
}