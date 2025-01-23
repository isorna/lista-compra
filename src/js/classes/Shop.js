// @ts-check
import { emptyArray } from '../decorators/emptyArray.js'
import { Article, UsualProduct } from './ShopArticle.js'

// Patrón: Singleton (IIEF)
const shoppingList = (function() {
  /**
   * @type {Array<UsualProduct | Article>}
   */
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