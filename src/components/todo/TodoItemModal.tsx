import React, { useState } from 'react';
import { X, Calendar, User, Trash2 } from 'lucide-react';
import { TodoItem } from '../../types/todo';
import { updateTodoItem, deleteTodoItem } from '../../services/todoService';

interface TodoItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: TodoItem;
  onSave: () => Promise<void>;
}

const TodoItemModal: React.FC<TodoItemModalProps> = ({
  isOpen,
  onClose,
  item,
  onSave
}) => {
  const [formData, setFormData] = useState({
    title: item.title,
    description: item.description || '',
    dueDate: item.dueDate ? new Date(item.dueDate).toISOString().split('T')[0] : '',
    priority: item.priority || 'medium',
    assignedTo: item.assignedTo || '',
    listId: item.listId
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await updateTodoItem(item.id, {
        ...formData,
        listId: formData.listId,
        position: item.position
      });
      await onSave();
      onClose();
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      setIsSubmitting(true);
      await deleteTodoItem(item.id);
      await onSave();
      onClose();
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="px-6 py-4 bg-blue-600 flex justify-between items-center rounded-t-lg">
          <h3 className="text-xl font-bold text-white">Edit To-Do Item</h3>
          <button onClick={onClose} className="text-white hover:text-blue-100">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoItemModal;