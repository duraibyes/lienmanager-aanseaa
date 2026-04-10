// src/types/master.ts

export interface State {
  id: number;
  name: string;
  code: string;
  short_code?: string;
  country_id?: number;
}

export interface County {
  id: number;
  name: string;
  flip_code?: string;
}

export interface ProjectType {
  id: number;
  project_type: string;
  description?: string;
}

export interface ProjectRole {
  id: number;
  project_role: string;
  description?: string;
}

export interface CustomerType {
  id: number;
  name: string;
  description?: string;
}

export interface CustomerTypeRequest {
  state_id: number;
  project_type_id: number;
  role_id: number;
}

export interface CustomerTier {
  id: number;
  tier_code: string;
  tier_limit: string;
  customer: CustomerType;
}

export interface CommonData {
  id:number;
  name: string;
}
