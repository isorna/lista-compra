// 1. Definimos nuestra lista de la compra
// OLD CODE: do not use!!!
// var shoppingList = ['carne', 'pescado', 'fruta']
// Text strings
let newArticle = 'flanes'
// Numbers
let totalAmount = 0
// Arrays
let shoppingList = ['carne', 'pescado', 'fruta']
// Constants
const PERAS = 'peras'
// Objects
let productInformation = {
  qty: 0,
  name: '',
  price: 0
}
let shoppingListWithObjects = [
  {
    qty: 1,
    name: 'carne',
    price: 10
  },
  {
    qty: 2,
    name: 'fruta',
    price: 2
  },
  {
    qty: 3,
    name: 'pescado',
    price: 20
  }
]


console.log('LISTA DE LA COMPRA POR DEFECTO', shoppingList)
// console.info(shoppingList)
// console.error(shoppingList)



// TOMORROW:
function addToShoppingList(){
  let newArticle = document.getElementById('articulo').value
  shoppingList.push(newArticle)
  console.log('addToShoppingList', shoppingList)
}

function resetShoppingList(){
  shoppingList = []
  console.log('resetShoppingList', shoppingList)
}

function switchColor () {
  document.getElementsByTagName('header')[0].style.backgroundColor='cyan'
}