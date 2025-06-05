import React, { useState, useEffect } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { getTodoLists, addTodoList, updateTodoItem, updateTodoList, deleteTodoList } from '../../services/todoService';
import { TodoList as TodoListType, TodoItem } from '../../types/todo';
import TodoList from './TodoList';
import TodoItemModal from './TodoItemModal';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

interface TodoBoardProps {
  repId: string;
}

const TodoBoard: React.FC<TodoBoardProps> = ({ repId }) => {
  const [lists, setLists] = useState<TodoListType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [selectedItem, setSelectedItem] = useState<TodoItem | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (repId) {
      loadLists();
    }
  }, [repId]);

  const loadLists = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTodoLists();
      // Filter lists by repId
      const prefix = repId === 'sts' ? 'Jobs' : repId.charAt(0).toUpperCase() + repId.slice(1);
      const repLists = data.filter(list => list.title.startsWith(prefix));
      setLists(repLists);
    } catch (error) {
      console.error('Failed to load to-do lists:', error);
      setError('Failed to load to-do lists. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim() || !repId) return;

    try {
      setError(null);
      const prefix = repId === 'sts' ? 'Jobs' : repId.charAt(0).toUpperCase() + repId.slice(1);
      const title = `${prefix}: ${newListTitle.trim()}`;
        
      await addTodoList({
        title,
        position: lists.length
      });
      await loadLists();
      setNewListTitle('');
      setIsAddingList(false);
    } catch (error) {
      console.error('Failed to add list:', error);
      setError('Failed to add list. Please try again.');
    }
  };

  const handleDeleteList = async (listId: string) => {
    try {
      await deleteTodoList(listId);
      await loadLists();
    } catch (error) {
      console.error('Failed to delete list:', error);
      setError('Failed to delete list. Please try again.');
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const findContainer = (id: string) => {
    if (lists.find(list => list.id === id)) {
      return id;
    }

    return lists.find(list => list.items.find(item => item.id === id))?.id;
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);
    
    if (!activeContainer || !overContainer) return;

    try {
      setError(null);
      
      // Handle list reordering
      if (active.id !== over.id && lists.find(list => list.id === active.id)) {
        const oldIndex = lists.findIndex(list => list.id === active.id);
        const newIndex = lists.findIndex(list => list.id === over.id);

        const newLists = arrayMove(lists, oldIndex, newIndex);
        setLists(newLists);

        await Promise.all(
          newLists.map((list, index) =>
            updateTodoList(list.id, { position: index })
          )
        );
        return;
      }

      // Find the lists involved in the operation
      const activeList = lists.find(list => list.id === activeContainer);
      const overList = lists.find(list => list.id === overContainer);

      if (!activeList || !overList) return;

      // Handle item reordering or moving between lists
      if (activeContainer === overContainer) {
        // Reordering within the same list
        const oldIndex = activeList.items.findIndex(item => item.id === active.id);
        const newIndex = activeList.items.findIndex(item => item.id === over.id);

        if (oldIndex !== newIndex) {
          const newItems = arrayMove(activeList.items, oldIndex, newIndex);
          await Promise.all(
            newItems.map((item, index) =>
              updateTodoItem(item.id, { position: index })
            )
          );
          await loadLists();
        }
      } else {
        // Moving item to a different list
        const item = activeList.items.find(item => item.id === active.id);
        if (!item) return;

        await updateTodoItem(item.id, {
          listId: overList.id,
          position: overList.items.length
        });
        await loadLists();
      }
    } catch (error: any) {
      console.error('Error updating items:', error);
      setError('Failed to update items. Please try again.');
      await loadLists(); // Reload lists to ensure UI matches server state
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {repId === 'sts' ? 'Jobs To-do List' : `${repId.charAt(0).toUpperCase() + repId.slice(1)}'s To-do Lists`}
          </h2>
          {!isAddingList && (
            <button
              onClick={() => setIsAddingList(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Add List
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex gap-6 overflow-x-auto pb-6">
          <SortableContext
            items={lists.map(list => list.id)}
            strategy={horizontalListSortingStrategy}
          >
            {lists.map((list) => (
              <TodoList 
                key={list.id} 
                list={list} 
                onItemClick={item => {
                  setSelectedItem(item);
                  setIsItemModalOpen(true);
                }}
                onRefresh={loadLists}
                onDelete={handleDeleteList}
              />
            ))}
          </SortableContext>

          {isAddingList && (
            <div className="w-80 flex-shrink-0">
              <form onSubmit={handleAddList} className="bg-white rounded-lg p-4">
                <input
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="Enter list title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingList(false);
                      setNewListTitle('');
                      setError(null);
                    }}
                    className="px-3 py-1.5 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add List
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {selectedItem && (
          <TodoItemModal
            isOpen={isItemModalOpen}
            onClose={() => {
              setIsItemModalOpen(false);
              setSelectedItem(null);
            }}
            item={selectedItem}
            onSave={loadLists}
          />
        )}
      </div>
    </DndContext>
  );
};

export default TodoBoard;