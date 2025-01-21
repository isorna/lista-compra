// Patrón: Singleton (IIEF)
const shoppingList = (function() {
  let shoppingListInstance

  return {
    get: () => {
      if (!shoppingListInstance) {
        // Init shoppingListInstance
        shoppingListInstance = []
        shoppingList.empty = function() {
          while (this.length > 0){
            this.pop()
          }
        }
      }
      return shoppingListInstance
    }
  }
})()

export { shoppingList }