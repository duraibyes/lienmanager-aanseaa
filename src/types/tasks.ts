
export interface TaskCountResponse {
    total_count: string;
    upcoming_count: string;
    overdue_count: string;
}

export interface DBTask {
  id: number;
  project_id: number;
  project_name: string;
  task_action_id?: number;
  task_action_name?: string;
  task_name: string;
  complete_date: string;
  due_date: string;
  due_status: string;
  comment?: string;
  email_alert: string;
  assigned_to: string;
  assigned_at: string;
  status: string;
  assigned_to_user: AssignToUser;
  days_difference?: string;  // This will hold the calculated days until due or overdue
  priority?: string;
}

export interface AssignToUser {
    id: number;
    name: string;
    email: string;
}