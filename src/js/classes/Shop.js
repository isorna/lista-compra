import { emptyArray } from '../decorators/emptyArray.js'

// Patrón: Singleton (IIEF)
const shoppingList = (function() {
  let shoppingListInstance

  return {
    get: () => {
      if (!shoppingListInstance) {
        // Init shoppingListInstance
        shoppingListInstance = []
      }
      // Patron decorator
      return emptyArray(shoppingListInstance)
    }
  }
})()

export { shoppingList }