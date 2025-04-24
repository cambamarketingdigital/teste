export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // User ID
  assignedBy: string; // User ID
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'doing' | 'done';
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  estimatedDays: number;
}

export interface TaskHistory {
  id: string;
  taskId: string;
  action: 'created' | 'updated' | 'completed' | 'reassigned';
  description: string;
  performedBy: string; // User ID
  createdAt: Date;
}