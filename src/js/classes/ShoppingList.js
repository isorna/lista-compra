// Bussiness Object: Shopping List
import { addStringValidation } from 'decorators/validate'

export class ShoppingList {
  // Private fields
  #basket
  #store
  // Patrón: Observer
  #observers = []

  constructor(store) {
    this.#store = store
    this._syncStoreData()
    // Patrón: Decorator
    addStringValidation(this)
  }

  get basket() {
    return this.#basket
  }

  // Private Methods
  _addToDataStore(item) {
    this.#store.addItem(item)
    // Patrón: Observer
    this._notifySubscriptors('add', item)
  }

  _removeFromDataStore(item) {
    this.#store.removeItem(item)
    // Patrón: Observer
    this._notifySubscriptors('remove', item)
  }

  _syncStoreData() {
    this.#basket = this.#store.items
  }

  _resetDataStore() {
    this.#store.reset()
    this._syncStoreData()
  }

  // Patrón: Observer
  _notifySubscriptors(eventName, eventData) {
    this.#observers.forEach((subscriptor) => {
      if (subscriptor.eventName === eventName) {
        subscriptor.callback(eventData)
      }
    })
  }

  // Publich methods
  addItem(newItem) {
    // Patrón: Decorator
    if (this.validate.isString(newItem.name, 'Article name')) {
      const timestamp = new Date()
      newItem.id = `${newItem.name}_${String(timestamp.getTime())}`
      newItem.qty = Number(newItem?.qty)
      newItem.price = Number(newItem?.price)
      this._addToDataStore(newItem)
      return true
    } else {
      return false
    }
  }

  removeItem(item) {
    if (typeof item.id === 'string') {
      this._removeFromDataStore(item)
    } else {
      try {
        throw new TypeError(`Invalid item ID`)
      } catch (e) {
        console.error(e.name, e.message)
        if (e instanceof TypeError) console.log(e.stack)
      }
    }
  }

  emptyBasket() {
    this._resetDataStore()
  }

  // Patrón: Observer
  subscribe(subscriptor, eventName, callback) {
    this.#observers.push({
      subscriptor,
      eventName,
      callback
    })
  }

  // Patrón: Observer
  /**
   * Ejemplo de uso
   * listaCompra.get().unsubscribe('formulario', 'add')s
   */
  unsubscribe(subscriptor, eventName) {
    this.#observers.find((observer, index) => {
      if (observer.subscriptor === subscriptor && observer.eventName === eventName) {
        this.#observers.splice(index, 1)
      }
    })
  }
}

// Mixin
export const withTotalMixin = {
  getTotal() {
    let total = 0
    this.basket.forEach(item => total += item.price * item.qty ?? 0)
    return total
  }
}