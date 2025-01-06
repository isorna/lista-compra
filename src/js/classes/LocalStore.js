// Local Storage based class
export class LocalStore {
  // Private fields
  #name
  #items

  constructor(storeName) {
    this.#name = storeName
    this.#items = this._getParsedDataFromLocalStorage(this.#name)
  }

  get items() {
    return this.#items
  }

  // Private Methods
  _getParsedDataFromLocalStorage(dataSet) {
    return JSON.parse(window.localStorage.getItem(dataSet)) || []
  }

  _setDataToLocalStorage(dataSet) {
    window.localStorage.setItem(this.#name, JSON.stringify(dataSet))
  }

  // Public Methods
  addItem(item) {
    this.#items.push(item)
    this._setDataToLocalStorage(this.#items)
  }

  removeItem(item) {
    const index = this.#items.findIndex(loopItem => loopItem.id === item.id)
    this.#items.splice(index, 1)
    this._setDataToLocalStorage(this.#items)
  }

  reset() {
    this.#items = []
    this._setDataToLocalStorage(this.#items)
  }
}