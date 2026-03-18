export interface DataPagination<Data> extends DataWrap<Data> {
  meta: {
    current_page: number
    from?: number
    total: number
    per_page: number
    last_page?: number
  }
}

export interface DataWrap<Data> {
  data: Data[]
}
