export default {
  meEndpoint: '/auth/me',
  loginEndpoint: '/account/login/',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken', // logout | refreshToken,
  userInfoKeyName: 'user',
}
