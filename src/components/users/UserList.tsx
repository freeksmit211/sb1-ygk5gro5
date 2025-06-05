import React, { useState, useEffect } from 'react';
import { User } from '../../types/user';
import { getUsers, deleteUser } from '../../services/userService';
import UserModal from './UserModal';
import UserPagesModal from './UserPagesModal';
import { Pencil, AlertTriangle, Eye, ListChecks } from 'lucide-react';
import { ROLE_LABELS } from '../../types/user';

const PAGE_LABELS: Record<string, string> = {
  '/': 'Dashboard',
  '/management': 'Management',
  '/management/portal': 'Management Portal',
  '/sales': 'Sales',
  '/sales-accounts': 'Sales Accounts',
  '/sales-accounts/ytd': 'Sales Year to Date',
  '/sales-accounts/franco/ytd': 'Franco Year to Date',
  '/sales-accounts/freek/ytd': 'Freek Year to Date',
  '/sales-accounts/jeckie/ytd': 'Jeckie Year to Date',
  '/projects': 'Projects',
  '/admin': 'Admin',
  '/sheq': 'SHEQ',
  '/invoices': 'Invoices',
  '/notices': 'Notices',
  '/contacts': 'Contacts',
  '/deliveries': 'Deliveries',
  '/meetings': 'Meetings',
  '/forms': 'Forms',
  '/stock': 'Stock',
  '/todo/franco': 'Franco\'s Tasks',
  '/todo/freek': 'Freek\'s Tasks',
  '/todo/jeckie': 'Jeckie\'s Tasks',
  '/todo/sts': 'Project Tasks',
  '/whatsapp': 'WhatsApp'
};

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPagesFor, setShowPagesFor] = useState<string | null>(null);
  const [showPagesModal, setShowPagesModal] = useState<User | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      setError('Failed to load users');
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleUserUpdated = async () => {
    await loadUsers();
    setSelectedUser(null);
    setShowPagesModal(null);
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(userId);
      await deleteUser(userId);
      await loadUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-700 font-medium mb-4">{error}</p>
        <button
          onClick={loadUsers}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No users found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                First Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Surname
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Accessible Pages
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <React.Fragment key={user.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.surname}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] || user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowPagesFor(showPagesFor === user.id ? null : user.id)}
                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="w-4 h-4" />
                        <span>{user.allowed_pages?.length || 0} pages</span>
                      </button>
                      <button
                        onClick={() => setShowPagesModal(user)}
                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                        title="Edit allowed pages"
                      >
                        <ListChecks className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-4">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={!!deletingId}
                      >
                        {deletingId === user.id ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <AlertTriangle className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
                {showPagesFor === user.id && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 bg-gray-50">
                      <div className="text-sm text-gray-600">
                        <h4 className="font-medium mb-2">Accessible Pages:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {user.allowed_pages?.map(page => (
                            <div key={page} className="bg-white px-3 py-1.5 rounded border text-sm">
                              {PAGE_LABELS[page] || page}
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <UserModal
          user={selectedUser}
          isOpen={true}
          onClose={() => setSelectedUser(null)}
          onUserUpdated={handleUserUpdated}
        />
      )}

      {showPagesModal && (
        <UserPagesModal
          user={showPagesModal}
          isOpen={true}
          onClose={() => setShowPagesModal(null)}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </div>
  );
};

export default UserList;