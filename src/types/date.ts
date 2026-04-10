export interface RemedyDateType {
  id: number;
  name: string;
  remedy_id: number;
  date_order: number;
  date_number: string;
  recurring: boolean;
  status: string;
}

export interface RemedyDateRequest {
  customer_type_id: number;
  project_type_id: number;
  role_id: number;
  state_id: number;
  project_id?: number;
}

export interface ProjectDateResponse {
  id: number;
  project_id: number;
  date_id: number;
  date_value: string;
}