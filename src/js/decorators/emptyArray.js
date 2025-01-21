export function emptyArray(array) {
  array.empty = function() {
    while (this.length > 0){
      this.pop()
    }
  }
  return array
}