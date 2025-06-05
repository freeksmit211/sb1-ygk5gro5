export interface TodoItem {
  id: string;
  listId: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  assignedTo?: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface TodoList {
  id: string;
  title: string;
  position: number;
  items: TodoItem[];
  createdAt: string;
  updatedAt: string;
}

export type NewTodoItem = Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>;
export type NewTodoList = Omit<TodoList, 'id' | 'items' | 'createdAt' | 'updatedAt'>;