export interface IPaginatedData<T> {
  count: number
  next: string
  previous: string
  results: T[]
}

export interface IPaginatedDataParams {
  page?: number
  pageSize?: number
}

export interface IPaginatedSearchDataParams {
  page?: number
  pageSize?: number
  searchTerm: string
}
