// @ts-check

/**
 * @typedef {Object} ArticleParams
 * @property {string} _id
 * @property {string} name
 * @property {string} qty
 * @property {string} price
*/

export class Article {
  _id
  name
  qty
  price
  /**
   * @param {ArticleParams} param0
   *  */
  constructor({ _id, name, qty, price }){
    // const timestamp = new Date()
    // this.id = name + '_' + String(timestamp.getTime())
    this._id = _id
    this.name = name
    this.qty = Number(qty)
    this.price = Number(price)
  }
}

// Mixin / Herencia
/**
 * @extends {Article}
 * @property {boolean} [bought=false]
 */
export class UsualProduct extends Article {
  bought
  /**
   * @constructor
   * @param {ArticleParams} param0  */
  constructor({ _id, name, qty, price }) {
    super({ _id, name, qty, price })
    this.bought = false
  }
}

// Factoría
export const ARTICLE_TYPES = {
  USUAL: 'usual',
  BASIC: 'basic'
}

export class ArticleFactory {
  /**
  * @param {object} param0
  * @param {string} param0.type
  * @param {ArticleParams} param0.articleData
  * @returns { Article | UsualProduct }  */
  create({ type, articleData }) {
    switch (type) {
      case ARTICLE_TYPES.USUAL:
        return new UsualProduct(articleData)
      case ARTICLE_TYPES.BASIC:
      default:
        return new Article(articleData)
    }
  }
}