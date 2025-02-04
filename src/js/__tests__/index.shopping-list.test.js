/* eslint-disable no-undef */
// import { getDataFromLocalStorage, readShoppingList } from "../index.shopping-list";
import { getDataFromLocalStorage } from "../index.shopping-list";
import mockData from '../../api/get.articles.json' with { type: 'json' }

describe('Add articles to the html table', () => {
  beforeEach(() => {
    localStorage.setItem('shoppingList', JSON.stringify({articles: mockData }))
  })
  it('should get an array of articles from local storage', () => {
    const data = getDataFromLocalStorage()

    expect(data.articles).not.toBeNull()
    expect(Array.isArray(data.articles)).toBe(true)
    expect(data.articles.length).toBeGreaterThan(0)
  })
  // it('should add articles to the html table', () => {
  //   document.body.innerHTML = `
  //     <table id="shoppingListTable">
  //       <thead>
  //         <tr>
  //           <th>Qty</th>
  //           <th>Name</th>
  //           <th>Price</th>
  //           <th>Subtotal</th>
  //           <th></th>
  //         </tr>
  //       </thead>
  //       <tbody id="shoppingListTableBody">
  //       </tbody>
  //     </table>
  //   `
  //   const tableBody = document.getElementById('shoppingListTableBody')
  //   expect(tableBody).not.toBeNull()
  //   expect(tableBody.getElementsByTagName('tr').length).toBe(0)
  //   readShoppingList()
  //   expect(tableBody.getElementsByTagName('tr').length).toBeGreaterThan(0)
  // })
})