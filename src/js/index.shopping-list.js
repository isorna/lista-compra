// Shopping List database
const shoppingList = []

document.addEventListener('DOMContentLoaded', onDomContentLoaded)

// ======== EVENTS ======== //
function onDomContentLoaded() {
  const articleNameElement = document.getElementById('articleName')
  const newArticleElement = document.getElementById('newArticle')
  const newListElement = document.getElementById('newList')

  console.log('DOM Content Loaded')
  articleNameElement.addEventListener('keyup', onArticleNameKeyUp)
  newArticleElement.addEventListener('click', onNewArticleClick)
  newListElement.addEventListener('click', onNewListClick)
}

function onArticleNameKeyUp(e) {
  console.log('Article name keyup')
}

function onNewArticleClick(e) {
  console.log('New Article click')
}

function onNewListClick(e) {
  console.log('New List click')
}

// ======== METHODS ======== //

/**
 * Reset shopping list
 */
function resetShoppingList() {
  console.log('Reset Shpping List')
}

/**
 * Clean up form
 */
function cleanUpForm() {
  console.log('Clean Up form')
}

/**
 * Create new shopping list item
 */
function createShoppingListItem() {
  console.log('Create Shpping List item')
}

/**
 * Update existing shopping list item
 */
function updateShoppingListItem() {
  console.log('Update Shpping List item')
}

/**
 * Delete existing shopping list item
 */
function deleteShoppingListItem() {
  console.log('Delete Shpping List item')
}

/**
 * Calculate shopping list total amount
 */
function getShoppingListTotalAmount() {
  console.log('Get Shopping List total amount')
}