export interface FilterPagination {
  page: number;
  limit: number;
  [index: string]: string | number;
}
