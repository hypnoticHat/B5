export type Priority = 'low' | 'medium' | 'high';
export type Status   = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: number;
  title: string;
  description?: string;
  startDate?: string; 
  dueDate?: string; 
  priority: Priority;
  status: Status;
  assignedUserIds: number[]; 
  createdAt: string;
}
