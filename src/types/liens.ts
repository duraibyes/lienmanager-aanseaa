export interface DBLienProject {
  id: string;
  project_name: string;
  company_name: string;
  customer_name: string;
  status: string;
  user_id: string;
  state: string;
  project_type: string;
  project_contract: string;
  created_at: string;
  lien_provider: string;
}

interface CompanyProfile {
    id: number;
    company: string;
    website: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
    fax?: string;
}

export interface ProfileData {
    user: UserResponse;
    user_details: UserDetailsResponse;
    lien: LienProfileRespose;
    company?: CompanyProfile;
}

interface UserDetailsResponse {
    id:number;
    first_name: string;
    last_name: string;
    phone: string;
    zip_code: string;
    office_phone: string;
    address: string;
    city: string;
    image?: string;
    state_id?: number;
    state?: string;
    country?: string;
}

interface UserResponse {
    id: number;
    name: string;
    email: string;
}
interface LienProfileRespose {
    id:number;
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    city: string;
    address: string;
    role_name: string;
    zip: string;
    image: string;
    created_at: string;
    phone: string;
    states: string[];
    logo?: string;
    company_id?: string;
    companyPhone?: string;
    fax?: string;
    user_id?: number;
}

export interface LienState {
    id: number;
    lien_id: number;
    state_id: number;
    state: {
        name: string;
    }
}