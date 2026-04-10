export interface CustomerContact {
  role_id: number;
  firstName: string;
  lastName: string;
  email: string;
  directPhone: string;
  cell: string;
  id?: number
  is_new?: boolean;
}

export interface Customer {
  id?: number;
  role_id?: number;
  user_id?: string;
  company: string;
  companyId?: number;
  company_id?: number;
  website: string;
  address: string;
  city: string;
  state_id: number;
  zip: string;
  phone: string;
  fax: string;
  contacts: CustomerContact[];
  created_at?: string;
  updated_at?: string;
  is_new?: boolean;
  state?: string;
  first_name?: string;
  last_name?: string;
  image?: File | null;
  email?: string;
}

export const initialCustomer: Customer = {
  company: '',
  website: '',
  address: '',
  city: '',
  state_id: 0,
  zip: '',
  phone: '',
  fax: '',
  contacts: [],
  role_id: 0,
  is_new: false,
  id: 0,
  first_name: '',
  last_name: '',
  image: null,
  email: ''
};

export interface ProfileAdd {
  companyId: number,
  newCompanyName: string,
  companyPhone?: string,
  fax: string,
  role?: string,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  address: string,
  city: string,
  stateId: number,
  zip: string,
  profileImage: File | null,
  website: string;
}