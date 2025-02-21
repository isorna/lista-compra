// @ts-check
import { ArticleFactory, ARTICLE_TYPES } from 'classes/ShopArticle'
import { simpleFetch } from '../js/lib/simpleFetch.js'
import { HttpError } from './classes/HttpError.js'
import { INITIAL_STATE, store } from './store/redux.js'
import { installRouter } from './lib/router.js'
// import { icons } from './lib/icons.js'

/** @import {State, User} from './store/redux.js' */
/** @import {Article, UsualProduct} from './classes/ShopArticle.js' */

/**
 * @typedef {Event} AdaptedCustomEvent
 * @property {any} detail
 */

const myFactory = new ArticleFactory
export const API_PORT = location.port ? `:${location.port}` : ''

// Assign DOM Content Loaded event
document.addEventListener('DOMContentLoaded', onDomContentLoaded)

// ======== EVENTS ======== //
function onDomContentLoaded() {
  const articleNameElement = document.getElementById('articleName')
  const newArticleElement = document.getElementById('newArticle')
  const newListElement = document.getElementById('newList')
  const logoutButton = document.getElementById('logoutButton')
  const modalWrapper = document.querySelector('#modalWrapper')

  // Activate router
  installRouter((/** @type {Location} */ location) => {handleNavigation(location)})
  // Home page
  articleNameElement?.addEventListener('keyup', onArticleNameKeyUp)
  newArticleElement?.addEventListener('click', onNewArticleClick)
  newListElement?.addEventListener('click', onNewListClick)
  // Login
  logoutButton?.addEventListener('click', onLogoutClick)

  // REMOVE: Log store changes
  // window.addEventListener('stateChanged', (event) => {
  //   console.log('stateChanged', /** @type {CustomEvent} */(event).detail)
  // })
  window.addEventListener('login-form-submit', (event) => {
    // console.log('login-form-submit', /** @type {CustomEvent} */(event).detail)
    onLoginComponentSubmit(/** @type {CustomEvent} */(event).detail)
  })

  window.addEventListener('on-modal-show', (event) => {
    const modalWrapper = document.querySelector('#modalWrapper')
    const modalTitle = document.querySelector('#modalWrapper h1')
    const modalText = document.querySelector('#modalWrapper p')
    const modalMessage = /** @type {CustomEvent} */(event).detail.text

    if (modalWrapper && modalText && modalTitle) {
      modalText.textContent = modalMessage
      modalWrapper.classList.remove('hidden')
    }
  })

  modalWrapper?.addEventListener('click', () => {
    const modalWrapper = document.querySelector('#modalWrapper')
    modalWrapper?.classList.add('hidden')
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
 * Handles a successful login from the login component
 * @param {Object} apiData - The user data returned from the API
 * @param {Object} [apiData.detail] - Message errors
 * @returns void
 */
function onLoginComponentSubmit(apiData) {
  console.log(`DESDE FUERA DEL COMPONENTE:`, apiData);
  //on-modal-show
  if (!apiData) {
    alert('Usuario no encontrado')
    return
  }
  if ('_id' in apiData
    && 'name' in apiData
    && 'email' in apiData
    && 'token' in apiData
    && 'role' in apiData) {
    const userData = /** @type {User} */(apiData)
    updateSessionStorage({ user: userData })
    // Redirect to home
    activateLoggedInUI(true)
    navigateTo('/')
  } else {
    alert('La estructura devuelta por la API no corresponde con la clase Usuario')
    let onModalErrorEvent = new CustomEvent("on-modal-show", {
      bubbles: true,
      detail: apiData.detail
    })

    window.dispatchEvent(onModalErrorEvent)
  }
}

/**
 * Logs out the user
 * @returns void
 */
async function onLogoutClick() {
  const userData = getDataFromSessionStorage()
  await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/logout/${userData.user._id}`, 'GET')

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
  const result = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/delete/all/articles`, 'DELETE')

  if (!result) {
    // Show error
    alert('Error deleting all articles')
    console.error('Error deleting all articles', result)
  } else {
    // 1. Empty the shopping list
    store.article.deleteAll(setLocalStorageFromStore)
    // 2. Empty Table Element
    updateArticleList([])
    // 3. Clean Up form
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
  const userData = getDataFromSessionStorage()

  const articleData = {
    name: getInputValue(articleNameElement),
    qty: getInputValue(qtyElement),
    price: getInputValue(priceElement),
    user_id: userData?.user._id
  }
  const payload = JSON.stringify(articleData)
  // Send fetch to API, create new article
  const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/articles`, 'POST', payload)
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
  updateArticleList([...store.article.getAll()])
  resetFocus()
}

/**
 * Retrieves the value from the specified input element.
 * @param {HTMLElement | null} inputElement - The input element from which to get the value.
 * @returns {string} The value of the input element, or an empty string if the element is null.
 */
export function getInputValue(inputElement) {
  if (inputElement) {
    return /** @type {HTMLInputElement} */(inputElement).value
  } else {
    return ''
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
//   // const apiData = await getAPIData(`http://${location.hostname}${API_PORT}/get.articles.json`)
//   const apiData = await getAPIData(`http://${location.hostname}${API_PORT}/read/articles`)

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
 * @param {any} [data]
 * @returns {Promise<Array<UsualProduct | User>>}
 */
export async function getAPIData(apiURL, method = 'GET', data) {
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
  const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/articles`)
  const storeData = {
    articles: apiData
  }
  updateArticleList(apiData)
  updateLocalStorage(storeData)
  const storedData = getDataFromLocalStorage()
  storedData?.articles.forEach((/** @type {Article | UsualProduct} */ savedArticle) => {
    store.article.create(savedArticle)
  });
}

/**
 * Propagate article list to article-list component
 * @param {Article[]} articles
 */
function updateArticleList(articles) {
  // Propagate article list to article-list component
  document.getElementById('articleList')?.setAttribute('articles', JSON.stringify(articles))
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
export function setLocalStorageFromStore() {
  // Remove user data from store before saving
  const storeState = store.getState()
  delete storeState.user
  updateLocalStorage(storeState)
}

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
    case '/index.html':
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
  const storedData = getDataFromSessionStorage()
  activateLoggedInUI(storedData?.user?.token)
}

/**
 * Updates the UI to show either the login link or the logout button
 * based on the given isLoggedIn flag
 * @param {boolean} [isLoggedIn=false]
 */
function activateLoggedInUI(isLoggedIn = false) {
  const loginLink = document.getElementById('loginLink')
  const logoutButton = document.getElementById('logoutButton')
  const username = document.getElementById('username')
  const storedData = getDataFromSessionStorage()
  // Update UI
  if (isLoggedIn) {
    loginLink?.classList.add('hidden')
    logoutButton?.classList.remove('hidden')
    username?.classList.remove('hidden')
    if (username) {
      username.innerText = `¡Hola ${storedData?.user?.name}!`
    }
  } else {
    logoutButton?.classList.add('hidden')
    loginLink?.classList.remove('hidden')
    username?.classList.add('hidden')
    if (username) {
      username.innerText = ''
    }
  }
}

/**
 * Exports for testing
 */
export {
  getDataFromLocalStorage,
  readShoppingList
}