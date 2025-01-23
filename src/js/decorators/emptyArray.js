/**
 * Decorator that adds an empty method to an array. This method removes all
 * elements from the array.
 * @param {Array} array The array to decorate.
 * @returns {Array} The decorated array.
 */
export function emptyArray(array) {
  /**
   * Removes all elements from the array.
   */
  array.empty = function() {
    while (this.length > 0) {
      this.pop()
    }
  }
  return array
}
