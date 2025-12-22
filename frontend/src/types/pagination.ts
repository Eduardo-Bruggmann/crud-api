export type PaginatedResponse<T, Key extends string> = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
} & Record<Key, T[]>;
