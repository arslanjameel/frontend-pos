import { IPaginatedDataParams } from 'src/models/shared/IPaginatedData'
import { DEFAULT_PAGE_SIZE } from './globalConstants'
import capitalize from './capitalize'

export const NOT_FOUND_MSG = 'Not found.'

export const IsResourceNotFound = (obj: any) => {
  try {
    return Object.values(obj).includes(NOT_FOUND_MSG)
  } catch (e) {
    return true
  }
}

export const getCustomNotFoundError = (type = 'user') => ({
  errorTitle: capitalize(type) + ' Not Found',
  errorSubtitle: `Oops! The requested ${type} was not found on this server.`,
})

const errorKeys = [
  'error',
  'details',
  'detail',
  'non_field_errors',
]

interface ErrorResponse {
  [key: string]: string
}

export const extractErrorMessage = (
  response: ErrorResponse,
  defaultMsg = 'An error occurred',
) => {
  const errorKey = errorKeys.find(key =>
    response.hasOwnProperty(key),
  )

  if (errorKey) return response[errorKey]

  return defaultMsg
}

interface ResponseObject {
  [key: string]: string
}

export const hasErrorKey = (response: ResponseObject) => {
  return errorKeys.some(key => response.hasOwnProperty(key))
}

export const hasErrorStatus = (
  response: ResponseObject,
) => {
  return (
    Object.keys(response).includes('status') &&
    Number(response.status) >= 400
  )
}

export const getPaginationParams = (
  params: IPaginatedDataParams | void,
): Required<IPaginatedDataParams> => {
  if (params) {
    return {
      page: params.page || 1,
      pageSize: params.pageSize || DEFAULT_PAGE_SIZE,
    }
  } else {
    return { page: 1, pageSize: DEFAULT_PAGE_SIZE }
  }
}

interface ErrorResponseAlt {
  [key: string]: string[]
}

export const extractFirstErrorMessage = (
  errorResponse: ErrorResponseAlt,
): string | undefined => {
  try {
    const keys = Object.keys(errorResponse)
    if (keys.length === 0) return 'An error occurred'
    const firstKey = keys[0]

    return errorResponse[firstKey][0]
  } catch (e) {
    return 'An error occurred'
  }
}
