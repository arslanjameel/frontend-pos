/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (role?: string) => {
  if (role === 'client') return '/acl'

  return '/home'
}

export default getHomeRoute
