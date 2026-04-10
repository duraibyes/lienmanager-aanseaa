import { ProjectDateResponse } from "./date";
import { ProjectContractResponse } from "./deadline";
import { CommonData, ProjectRole, ProjectType } from "./master";

export interface Task {
  id: string;
  actionId?: number;
  assignedId?: number;
  assignedTo?: string;
  action: string;
  otherName?: string;
  dueDate: string;
  emailAlert: boolean;
  comment: string;
  isNew?: boolean;
}

export interface ProjectWizardData {
  projectId?: number;
  projectName: string;
  countryId: number;
  country?: string;
  state?: string;
  stateId: number;
  projectTypeId: number;
  roleId: number;
  customerTypeId: number;

  startDate: string;
  endDate: string;
  furnishingDates: string[];
  completionDate?: string;
  firstFurnishingDate?: string;
  lastFurnishingDate?: string;

  jobName: string;
  jobAddress: string;
  jobCity: string;
  jobStateId: number;
  jobZip: string;
  jobCountyId: number;
  jobCountryId: number;

  contractAmount: string;
  baseContractAmount: string;
  additionalCosts: string;
  revisedCost: string;
  paymentsCredits: string;
  unpaidBalance: string;
  jobProjectNumber: string;
  materialServicesDescription: string;

  selectedCustomerContacts: number;

  selectedProjectContacts: number[];

  documents: File[];
  uploaded_documents?: DocumentViewResponse[];

  tasks: Task[];
  removedTasks: string[];

  customerSignature: string;
  signatureDate: string;
}

export const initialProjectWizardData: ProjectWizardData = {
  projectId: undefined,
  projectName: '',
  countryId: 0,
  stateId: 0,
  projectTypeId: 0,
  roleId: 0,
  customerTypeId: 0,

  startDate: '',
  endDate: '',
  furnishingDates: [],
  completionDate: '',
  firstFurnishingDate: '',
  lastFurnishingDate: '',

  jobName: '',
  jobAddress: '',
  jobCity: '',
  jobStateId: 0,
  jobZip: '',
  jobCountryId: 0,
  jobCountyId: 0,

  contractAmount: '',
  baseContractAmount: '',
  additionalCosts: '',
  revisedCost: '',
  paymentsCredits: '',
  unpaidBalance: '',
  jobProjectNumber: '',
  materialServicesDescription: '',
  selectedCustomerContacts: 0,
  selectedProjectContacts: [],

  documents: [],
  uploaded_documents: [],

  tasks: [],
  removedTasks: [],

  customerSignature: '',
  signatureDate: '',
  country: '',
  state: '',
};


export interface WizardDraftResponse {
  draft_id?: number;
  step?: number;
  data: ProjectWizardData;
  isDraft: boolean;
}

export interface ProjectStatusCount {
  total: number;
  inprogress: number;
  active: number;
  completed: number;
}

export interface ProjectListRequest {
  page: number;
  per_page: number;
  search?: string;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
  status?: string;
  state_id?: string;
  action_id?: string;
  project_id?: number
}

export interface TaskResponse {
  id: number;
  project_id: number;
  task_action_id: number;
  task_name: string;
  complete_date: string;
  comment: string;
  email_alert: string;
  assigned_to: number;
  assigned_by: number;
  assigned_at: string;
  status: string;
}

export interface DocumentResponse {
  id: number;
  project_id: number;
  title: string;
  notes: string;
  date: string;
  filename: string;
}

export interface DBProject {
  id: string;
  project_name: string;
  status: string;
  user_id: string;
  address: string;
  city: string;
  zip: any;
  start_date: string;
  state: string;
  tasks: TaskResponse[];
  project_date: ProjectDateResponse[];
  documents: DocumentResponse[];
  project_contract: ProjectContractResponse;
  created_at: string;
  project_type?: { id: number, project_type: string, description?: string }
}

interface IndustryContactView {
  id: number;
  contact_name: string;
  address: string;
  title: string;
  contact_type: string;
  email: string;
  phone: string;
  zip: string;
  city: string;
  company: {
    id: number;
    company: string;
  }
}

export interface ProjectViewResponse {
  id: number;
  jobAddress: string;
  jobCity: string;
  jobCountyId: number;
  jobName: string;
  jobZip: number;
  projectName: number;
  projectTypeId: number;
  roleId: number;
  signature?: string;
  signatureDate?: string;
  startDate: string;
  stateId: number;
  status: number;
  user_id: number;
  endDate: string;
  customerTypeId: number;
  created_at: number;
  countryId: number;
  customer_name?: string;
  customerContacts?: {
    address: string;
    id: number;
    city: string;
    zip: string;
    get_contacts: {
      title: string;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      cell: string;
      contact_role: {
        name: string;
        role_type: string;
      }
    };
    company: {
      company: string;
    }

  },
  industryContacts?: IndustryContactView[];
  contracts: {
    id: number;
    additionalCosts: string;
    baseContractAmount: string;
    jobProjectNumber: number;
    paymentsCredits: string;
    total_claim_amount: string;
    waiver: string;
    materialServicesDescription: string;
  };
  documents?: DocumentViewResponse[];
  uploaded_documents?: DocumentViewResponse[];
  tasks: TaskViewResponse[];
  projectType: ProjectType;
  projectRole: ProjectRole;
  customerType: string;
  jobCounty: CommonData;
  country: string;
  state: string;
  dates: string[];
  selectedCustomerContacts: number;
  selectedProjectContacts: number[];
}

export interface DocumentViewResponse {
  id: number;
  notes?: string;
  filename: string;
  date: string;
  title: string;
  project_id?: number;
  file_url: string;
  file_name: string;
  file_size: string;
  file_size_bytes: string;
  file_extension: string;
}

export interface TaskViewResponse {
  actionType: string;
  assigned_at: string;
  assigned_by: number;
  assigned_to: number;
  comment: string;
  complete_date: string;
  due_date: string;
  email_alert: string;
  id: number
  status: string;
  task_action_id: number;
  task_name: string;
}