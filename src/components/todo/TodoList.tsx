import React, { useState } from 'react';
import { Plus, Clock, Users, Trash2, X } from 'lucide-react';
import { TodoList as TodoListType, TodoItem } from '../../types/todo';
import { addTodoItem, deleteTodoList, deleteTodoItem } from '../../services/todoService';
import TodoItemModal from './TodoItemModal';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface TodoListProps {
  list: TodoListType;
  onItemClick: (item: TodoItem) => void;
  onRefresh: () => Promise<void>;
  onDelete?: (listId: string) => Promise<void>;
}

interface TodoItemComponentProps {
  item: TodoItem;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

const SortableItem: React.FC<TodoItemComponentProps> = ({ item, onClick, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: item.id,
    data: {
      type: 'item',
      item
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-50 rounded-lg p-3 cursor-grab hover:bg-gray-100 transition-colors relative group"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1" onClick={onClick}>
          <h4 className="font-medium text-gray-900">{item.title}</h4>
          {item.priority && (
            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(item.priority)}`}>
              {item.priority}
            </span>
          )}
        </div>
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-600 hover:bg-red-50 rounded-lg"
          title="Delete item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div onClick={onClick}>
        {item.description && (
          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {item.dueDate && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>
                {new Date(item.dueDate).toLocaleDateString()}
              </span>
            </div>
          )}
          {item.assignedTo && (
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>Assigned</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TodoList: React.FC<TodoListProps> = ({ list, onItemClick, onRefresh, onDelete }) => {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: list.id,
    data: {
      type: 'list',
      list
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const handleAddItem = async (title: string) => {
    if (!title.trim()) return;

    try {
      await addTodoItem({
        listId: list.id,
        title: title.trim(),
        position: list.items.length
      });
      await onRefresh();
      setIsAddingItem(false);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDeleteList = async () => {
    try {
      await deleteTodoList(list.id);
      if (onDelete) {
        await onDelete(list.id);
      }
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const handleDeleteItem = async (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await deleteTodoItem(itemId);
      await onRefresh();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="w-80 flex-shrink-0"
      {...attributes}
    >
      <div className="bg-white rounded-lg shadow-lg">
        <div 
          className="px-4 py-3 border-b border-gray-200 cursor-grab flex justify-between items-center"
          {...listeners}
        >
          <h3 className="font-semibold text-gray-900">{list.title}</h3>
          <div className="flex items-center gap-2">
            {showDeleteConfirm ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDeleteList}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-gray-500 hover:text-red-600 p-1 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="p-4 space-y-2">
          <SortableContext 
            items={list.items.map(item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {list.items.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                onClick={() => onItemClick(item)}
                onDelete={(e) => handleDeleteItem(item.id, e)}
              />
            ))}
          </SortableContext>

          {isAddingItem ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.elements.namedItem('title') as HTMLInputElement;
                handleAddItem(input.value);
              }}
              className="space-y-2"
            >
              <input
                name="title"
                type="text"
                placeholder="Enter item title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingItem(false)}
                  className="px-3 py-1.5 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Item
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingItem(true)}
              className="w-full flex items-center justify-center gap-2 p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;