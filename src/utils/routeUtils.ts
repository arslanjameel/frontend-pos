export type ResourceType =
  | 'receipts'
  | 'brands'
  | 'categories'
  | 'credit-notes'
  | 'customers'
  | 'forgot-password'
  | 'home'
  | 'invoices'
  | 'login'
  | 'orders'
  | 'products'
  | 'quotes'
  | 'register'
  | 'reset-password'
  | 'roles-permissions'
  | 'stores'
  | 'suppliers'
  | 'userAccounts'
  | 'media'

export type UrlMode = 'edit' | 'view' | 'new'

const buildBaseUrl = (resourceType: ResourceType): string =>
  `/${resourceType}`

const appendItemIdAndMode = (
  baseUrl: string,
  params: { itemId?: number; mode?: UrlMode },
): string => {
  let fullPath = `${baseUrl}/`

  if (params.itemId) {
    fullPath += `${params.itemId}/`
  }

  if (params.mode) {
    fullPath += `${params.mode}/`
  }

  return fullPath
}

export const buildUrl = (
  resourceType: ResourceType,
  params?: { itemId?: number; mode?: UrlMode },
): string => {
  const baseUrl = buildBaseUrl(resourceType)

  if (params) {
    return appendItemIdAndMode(baseUrl, params)
  }

  return baseUrl
}

export const openUrls: ResourceType[] = [
  'reset-password',
  'login',
  'register',
  'forgot-password',
  'media',
]

export const isOpenUrl = (
  currentPath = window.location.pathname,
) => {
  return openUrls.some(url => currentPath.includes(url))
}
