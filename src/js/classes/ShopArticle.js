export class Article {
  id
  name
  qty
  price
  constructor({ name, qty, price }){
    const timestamp = new Date()
    this.id = name + '_' + String(timestamp.getTime())
    this.name = name
    this.qty = Number(qty)
    this.price = Number(price)
  }
}

// Mixin / Herencia
export class UsualProduct extends Article {
  bought
  constructor({ name, qty, price }) {
    super({ name, qty, price })
    this.bought = false
  }
}

// Factoría
export const ARTICLE_TYPES = {
  USUAL: 'usual',
  BASIC: 'basic'
}

export class ArticleFactory {
  create(type, articleData) {
    switch (type) {
      case ARTICLE_TYPES.USUAL:
        return new UsualProduct(articleData)
        break
      case ARTICLE_TYPES.BASIC:
        return new Article(articleData)
    }
  }
}