export type ContactRoleType = "customer" | "project";

export interface ContactRoleRequest {
  type: ContactRoleType;
}

export interface ContactRole {
  id: number;
  name: string;
  role_type: ContactRoleType;
}
export const MAX_FILE_SIZE = 2 * 1024 * 1024;

export interface CustomerContactDB {
  id: number;
  first_name: string;
  last_name: string;
  direct_phone: string;
  cell: string;
  email: string;
  company_name: string;
  website: string;
  title: string;
  city: string;
  state: string;
  zip: string;
  address: string;
  companyId?: string;
  role_id?: string
}