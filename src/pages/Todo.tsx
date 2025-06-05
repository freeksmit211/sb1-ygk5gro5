import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TodoBoard from '../components/todo/TodoBoard';
import { ArrowLeft } from 'lucide-react';

const Todo: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();

  if (!boardId) {
    return <div className="p-6 text-white">Board not found</div>;
  }

  const getBoardTitle = (id: string) => {
    switch (id) {
      case 'sts':
        return 'Jobs To-do List';
      case 'franco':
        return 'Franco\'s To-do Lists';
      case 'freek':
        return 'Freek\'s To-do Lists';
      case 'jeckie':
        return 'Jeckie\'s To-do Lists';
      default:
        return 'To-do Lists';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:text-blue-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">{getBoardTitle(boardId)}</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <TodoBoard repId={boardId} />
      </div>
    </div>
  );
};

export default Todo;