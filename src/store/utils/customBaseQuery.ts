import {
  BaseQueryApi,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/dist/query'

import { getUrl } from 'src/services/http.service'
import { prepareHeaders } from './prepareHeaders'
import { validateStatus } from './validateStatus'

type ICustomBaseQuery = Promise<
  | {
      data: any
      error?: any
      meta?: { request: Request; response: Response } | any
    }
  | {
      error: {
        status: number
        data: any
      }
      data?: any
      meta?: { request: Request; response: Response } | any
    }
>

export const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {},
): ICustomBaseQuery => {
  try {
    const baseResult = await fetchBaseQuery({
      baseUrl: getUrl(),
      prepareHeaders: prepareHeaders,
      validateStatus: validateStatus,
    })(args, api, extraOptions)

    const statusCode =
      baseResult.meta?.response?.status || 409

    // @ts-ignore //TODO: make this better
    const meta = baseResult.meta

    if (statusCode >= 400) {
      const baseErr = baseResult.error || {}
      const baseData = baseResult.data || {}

      // @ts-ignore //TODO: make this better
      return {
        meta,
        error: {
          ...baseErr,
          ...baseData,
          status: statusCode,
        },
      }
    }

    // @ts-ignore //TODO: make this better
    return { meta, data: baseResult.data }
  } catch (error) {
    // @ts-ignore //TODO: make this better
    return { error }
  }
}
