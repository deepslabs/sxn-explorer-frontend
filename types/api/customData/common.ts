export interface CustomDataPageResponse<T> {
  items: Array<T>;
  pageNo: number;
  pageSize: number;
  totalPage: number;
  totalCount: string;
  hasPrev: boolean;
  hasNext: boolean;
  next_page_params: { items_count: number } | null;
}

export type CustomDataApiRequest<T extends Record<string, string | number | undefined>> = { pageNo: number; pageSize: number } & T;
