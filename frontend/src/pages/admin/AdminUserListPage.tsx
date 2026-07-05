import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiXCircle, FiTrash2 } from 'react-icons/fi';
import { fetchUsers, deleteUser } from '@/api/auth';
import Loader from '@/components/Loader';
import Message from '@/components/Message';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

const AdminUserListPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    fetchUsers()
      .then(setUsers)
      .catch(() => setError('We couldn\'t load the user list right now. Please try again in a moment.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted');
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Could not delete user');
    }
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="error">{error}</Message>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Users ({users.length})</h2>
      <div className="overflow-x-auto bg-white border border-ink/8 rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/40 text-xs uppercase tracking-wider border-b border-ink/8">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Admin</th>
              <th className="p-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-ink/8 last:border-0">
                <td className="p-4 font-medium">{u.name}</td>
                <td className="p-4 text-ink/60">{u.email}</td>
                <td className="p-4">{u.isAdmin ? <FiCheckCircle className="text-emerald-500" /> : <FiXCircle className="text-ink/20" />}</td>
                <td className="p-4">
                  {!u.isAdmin && (
                    <button onClick={() => handleDelete(u._id)} className="text-red-500 hover:text-red-600">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserListPage;
