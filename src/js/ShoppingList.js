
export class ShoppingList {
  // Private fields
  #basket
  #store

  constructor(store) {
    this.#store = store
    this.#basket = this.#store.items
  }

  get basket() {
    return this.#basket
  }

  // Private Methods
  _addToDataStore(item) {
    this.#store.addItem(item)
  }

  _resetDataStore() {
    this.#store.reset()
  }

  // Publich methods
  addItem(newItem) {
    if (typeof newItem.name === 'string') {
      this._addToDataStore(newItem)
    } else {
      try {
        throw new TypeError('Article must have a name')
      } catch (e) {
        console.error(e.name, e.message)
        if (e instanceof TypeError) console.log(e.stack)
      }
    }
  }

  emptyBasket() {
    this._resetDataStore()
  }

  // TODO: get total $$$
}