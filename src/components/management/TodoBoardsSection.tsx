import React from 'react';
import { ListTodo } from 'lucide-react';
import { Link } from 'react-router-dom';

const TodoBoardsSection: React.FC = () => {
  const boards = [
    { id: 'sts', name: 'Jobs To-do List' },
    { id: 'franco', name: 'Franco\'s To-do Lists' },
    { id: 'freek', name: 'Freek\'s To-do Lists' },
    { id: 'jeckie', name: 'Jeckie\'s To-do Lists' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <ListTodo className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">To-do List Management</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {boards.map(board => (
          <Link
            key={board.id}
            to={`/todo/${board.id}`}
            className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-lg font-medium text-gray-900">{board.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TodoBoardsSection;