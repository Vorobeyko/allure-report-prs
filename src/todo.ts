export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface CreateTodoDto {
  userId: number;
  title: string;
  completed?: boolean;
}

export interface UpdateTodoDto {
  title?: string;
  completed?: boolean;
}

export function isTodo(obj: unknown): obj is Todo {
  if (typeof obj !== 'object' || obj === null) return false;
  const t = obj as Record<string, unknown>;
  return (
    typeof t['id'] === 'number' &&
    typeof t['userId'] === 'number' &&
    typeof t['title'] === 'string' &&
    typeof t['completed'] === 'boolean'
  );
}
