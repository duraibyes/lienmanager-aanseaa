export interface SubUser {
    company_id?: number;
    company?: string;
    first_name: string;
    last_name: string;
    state_id: number;
    email: string;
    password: string;
    password_confirmation: string;
    address: string;
    city: string;
    zip_code: string;
    phone: string;
}

export const initialSubUserData = {
    company_id: 0,
    company: '',
    first_name: '',
    last_name: '',
    state_id: 0,
    email: '',
    password: '',
    password_confirmation: '',
    address: '',
    city: '',
    zip_code: '',
    phone: '',
}