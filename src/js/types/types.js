/**
 * ejemplo de uso
 *
 * import { StringType } from './types/types.js'
 * let cadena = new StringType(1)
 * console.log('on load', cadena, cadena[0])
 */
export class StringType extends String {
  constructor(value) {
    super(value)
    if (typeof value !== 'string') {
      console.error(`${value} must be an string`)
    }
  }
}