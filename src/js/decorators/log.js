// Patrón: Decorator
export function logBasket(shoppingListInstance) {
  shoppingListInstance.log = function() {
    console.info(this.basket)
  }
  return shoppingListInstance
}