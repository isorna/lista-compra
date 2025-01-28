const testBuyArticle = require('../testBuyArticle.js')

describe('Voy a probar que se realiza la suma correctamente', () => {
  test('sumar 1 + 2 es igual a 3', () => {
    expect(testBuyArticle(1, 2)).toBe(3);
  });
})