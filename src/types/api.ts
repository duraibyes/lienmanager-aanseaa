export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
  overall_total?: number;
  total?: number;
  meta?: {
    total: number;
    page: number;
    per_page: number;
  };
}
