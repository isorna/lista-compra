export class Article {
  id
  name
  qty
  price
  constructor(name, qty, price){
    const timestamp = new Date()
    this.id = name + '_' + String(timestamp.getTime())
    this.name = name
    this.qty = Number(qty)
    this.price = Number(price)
  }
}

class UsualProduct extends Article {}