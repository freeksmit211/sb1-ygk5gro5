import { supabase } from '../lib/supabase';
import { TodoList, TodoItem, NewTodoList, NewTodoItem } from '../types/todo';

export const getTodoLists = async (): Promise<TodoList[]> => {
  try {
    // First get all lists
    const { data: lists, error: listsError } = await supabase
      .from('todo_lists')
      .select('*')
      .order('position');

    if (listsError) throw listsError;

    // Then get all items
    const { data: items, error: itemsError } = await supabase
      .from('todo_items')
      .select('*')
      .order('position');

    if (itemsError) throw itemsError;

    // Map items to their lists
    return lists.map(list => ({
      id: list.id,
      title: list.title,
      position: list.position,
      items: items
        .filter(item => item.list_id === list.id)
        .map(item => ({
          id: item.id,
          listId: item.list_id,
          title: item.title,
          description: item.description || '',
          dueDate: item.due_date,
          priority: item.priority,
          assignedTo: item.assigned_to,
          position: item.position,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        })),
      createdAt: list.created_at,
      updatedAt: list.updated_at
    }));
  } catch (error) {
    console.error('Error getting todo lists:', error);
    throw error;
  }
};

export const addTodoList = async (list: NewTodoList): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('todo_lists')
      .insert({
        title: list.title,
        position: list.position
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding todo list:', error);
    throw error;
  }
};

export const updateTodoList = async (
  id: string,
  updates: Partial<NewTodoList>
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('todo_lists')
      .update({
        title: updates.title,
        position: updates.position,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating todo list:', error);
    throw error;
  }
};

export const deleteTodoList = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('todo_lists')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting todo list:', error);
    throw error;
  }
};

export const addTodoItem = async (item: NewTodoItem): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('todo_items')
      .insert({
        list_id: item.listId,
        title: item.title,
        description: item.description || '',
        due_date: item.dueDate,
        priority: item.priority,
        assigned_to: item.assignedTo,
        position: item.position
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding todo item:', error);
    throw error;
  }
};

export const updateTodoItem = async (
  id: string,
  updates: Partial<NewTodoItem>
): Promise<void> => {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    // Only include fields that are provided in updates
    if (updates.listId !== undefined) updateData.list_id = updates.listId;
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
    if (updates.priority !== undefined) updateData.priority = updates.priority;
    if (updates.assignedTo !== undefined) updateData.assigned_to = updates.assignedTo;
    if (updates.position !== undefined) updateData.position = updates.position;

    const { error } = await supabase
      .from('todo_items')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating todo item:', error);
    throw error;
  }
};

export const deleteTodoItem = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('todo_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting todo item:', error);
    throw error;
  }
};