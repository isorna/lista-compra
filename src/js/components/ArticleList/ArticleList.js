import { getAPIData, setLocalStorageFromStore, API_PORT } from '../../index.shopping-list.js';
import { store } from '../../store/redux.js'
import { importTemplate } from '../../lib/importTemplate.js';
// @ ts-expect-error TS doesn't like this
import ResetCSS from '../../../css/reset.css' with { type: 'css' }
// @ ts-expect-error TS doesn't like this
import AppCSS from '../../../css/app.css' with { type: 'css' }
// @ ts-expect-error TS doesn't like this
import ArticleListCSS from './ArticleList.css' with { type: 'css' }

const TEMPLATE = {
  id: 'articleListTemplate',
  url: './js/components/ArticleList/ArticleList.html'
}
// Wait for template to load
await importTemplate(TEMPLATE.url);

/**
 * ArticleList Table Web Component
 *
 * @class ArticleList
 * @property {Object[]} articles
 * @emits 'article-delete'
 * @emits 'article-update'
 */
export class ArticleList extends HTMLElement {
  static observedAttributes = ['articles'];
  articleList = []

  get articles() {
    return this.getAttribute('articles');
  }

  set articles(newValue) {
    this.setAttribute('articles', newValue);
  }

  get template(){
    return document.getElementById(TEMPLATE.id);
  }

  constructor() {
    super()
    this.articles = [];
  }
  // ======================= Lifecycle Methods ======================= //

  async connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets.push(ResetCSS, AppCSS, ArticleListCSS);

    // this._setUpContent();
    // Add event listeners to form elements
    // const form = this.shadowRoot.getElementById("loginForm");
    // form.addEventListener("submit", this._onFormSubmit.bind(this));
    // Global store state listener
    window.addEventListener('stateChanged', this._handleStateChanged.bind(this), { passive: true });
  }

  /**
   * Called when an observed attribute has changed.
   *
   * @param {String} name - The name of the attribute that changed.
   * @param {String} oldValue - The old value of the attribute.
   * @param {String} newValue - The new value of the attribute.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'articles') {
      // console.log(`attributeChangedCallback: Attribute ${name} has changed.`, oldValue, newValue);
      this._setUpContent();
    }
  }

  disconnectedCallback() {
    console.log("disconnectedCallback: Custom element removed from page.");
    // Don't forget to remove event listeners
    window.removeEventListener('stateChanged', this._handleStateChanged);
  }

  // ======================= Private Methods ======================= //

  /**
   * Private method to set up the content of the web component.
   *
   * Only render if the web component is connected and the template is loaded.
   * Replace any previous content with the template content.
   * @private
   */
  _setUpContent() {
    // Prevent render when disconnected or the template is not loaded
    if (this.shadowRoot && this.template && this.articles) {
      const articles = JSON.parse(this.articles)
      // Replace previous content
      this.shadowRoot.innerHTML = '';
      this.shadowRoot.appendChild(this.template.content.cloneNode(true));

      articles.forEach((article) => {
        this._addNewRowToShoppingListTable(article)
      });
      this._getShoppingListTotalAmount()
    }
  }

  /**
   * Handles a state change event from the store
   * @param {import('../../store/redux').State} state - The new state
   * @private
   */
  _handleStateChanged(state) {
    // Do whatever is needed in this component after a particular state value changes
    // Filter by the states needed in this component
    if (state?.detail?.type === 'CREATE_ARTICLE'){
      // eslint-disable-next-line no-unsafe-optional-chaining
      this.articleList = [...state?.detail?.changes?.articles]
    //   this._setUpContent();
    }
  }

  /**
   * Add a new row to the shopping list table element
   * @param {Article | UsualProduct} newArticleObject
   * @returns {any}
   */
  _addNewRowToShoppingListTable(newArticleObject){
    const shoppingListTableBodyElement = this.shadowRoot.getElementById('shoppingListTableBody')
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
    newArticleTableCellName.addEventListener('click', this._buyArticle.bind(this, clickEvent, newArticleObject._id, newArticleTableRow))
    newArticleTableCellPrice.innerText = String(newArticleObject.price)
    newArticleTableCellSubtotal.innerText = String(newArticleObject.qty * newArticleObject.price)
    // newArticleDeleteButton.innerHTML = '&#128473;&#xfe0e;'
    newArticleDeleteButton.title = 'Eliminar'
    newArticleDeleteButton.className = 'icon-button delete-button'
    newArticleImg.src = './assets/img/cancel.png'
    newArticleImg.setAttribute('alt', 'Eliminar')
    newArticleDeleteButton.appendChild(newArticleImg)
    newArticleDeleteButton.addEventListener('click', this._deleteShoppingListItem.bind(this, clickEvent, newArticleObject._id, newArticleTableRow))
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
  async _buyArticle(e, itemId, rowToUpdate) {
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
      bought: itemToUpdate.bought
    }
    const payload = JSON.stringify(updatedData)
    // Send fetch to API, update article
    await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/update/articles/${itemToUpdate._id}`, 'PUT', payload)
    // console.log('after update on API', apiData)
    store.article.update(itemToUpdate, setLocalStorageFromStore)
  }

  /**
   * Delete existing shopping list item
   * @param {MouseEvent} e
   * @param {string} itemIdToDelete
   * @param {HTMLElement} rowToDelete
   */
  async _deleteShoppingListItem(e, itemIdToDelete, rowToDelete) {
    // Send fetch to API, delete article
    const result = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/delete/articles/${itemIdToDelete}`, 'DELETE')

    if (result) {
      console.log('after delete on API', result)
      // Delete item from store
      store.article.delete(store.article.getById(itemIdToDelete), setLocalStorageFromStore)
      // Update html
      rowToDelete.remove()
      this._getShoppingListTotalAmount()
    } else {
      alert('Error deleting article')
      console.error('Error deleting article', result)
    }
  }

  /**
   * Calculate shopping list total amount
   */
  _getShoppingListTotalAmount() {
    const shoppingListTableTotalElement = this.shadowRoot.getElementById('shoppingListTableTotal')
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
   * Empty table element
   */
  _emptyTableElement() {
    const shoppingListTableBodyRowsList = this.shadowRoot.querySelectorAll('tbody>tr')
    // 1. For each table row found
    for (let tableRow of shoppingListTableBodyRowsList) {
      // 2. Remove it from the table element
      tableRow.remove()
    }
  }
}

customElements.define('article-list', ArticleList);