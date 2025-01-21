/**
 * TODO: documentar cómo funciona la shoppingList
 */
const shoppingList = []
shoppingList.empty = function() {
  while (this.length > 0){
    this.pop()
  }
}

// Patrón: Singleton (IEEF)
// const shoppingList = (function () {})()

export { shoppingList }