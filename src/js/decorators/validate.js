// Patrón: Decorator
export function addStringValidation(hostInstance) {
  hostInstance.validate = {
    ...hostInstance.validate,
    isString
  }
  return
}

function isString(fieldValue, fieldName) {
  if (typeof fieldValue === 'string') {
    return true
  } else {
    try {
      throw new TypeError(`${fieldName} must be a valid text string`)
    } catch (e) {
      console.error(e.name, e.message)
      if (e instanceof TypeError) console.log(e.stack)
    }
  }
}