/**
 * Handles navigation changes
 * @param {Location} location - The new location
 */
export function handleNavigation(location) {
  const newLocation = location.pathname.replace(/\/src/, '')

  switch (newLocation) {
    case '/':
      console.log('HOME')
      break
    default:
      console.log('NOT HOME', newLocation)
      break
  }
}