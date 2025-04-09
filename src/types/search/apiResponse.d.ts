export interface ApiResponse<T> {
  results?: T[];
  pagination?: Pagination;
}

export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
