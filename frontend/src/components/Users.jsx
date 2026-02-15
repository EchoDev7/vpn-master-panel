import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, RefreshCw, Key, Shield } from 'lucide-react';
import { apiService } from '../services/api';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        traffic_limit_gb: 0,
        expire_days: 30
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await apiService.getUsers();
            setUsers(response.data.users || []);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiService.createUser(formData);
            setShowAddModal(false);
            setFormData({ username: '', password: '', email: '', traffic_limit_gb: 0, expire_days: 30 });
            loadUsers();
            alert('User created successfully!');
        } catch (error) {
            alert('Failed to create user: ' + (error.response?.data?.detail || error.message));
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await apiService.deleteUser(userId);
                loadUsers();
            } catch (error) {
                alert('Failed to delete user');
            }
        }
    };

    if (loading && users.length === 0) {
        return <div className="p-8 text-center text-gray-400">Loading users...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
                    <Shield className="text-blue-500" /> User Management
                </h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <UserPlus size={20} /> Add User
                </button>
            </div>

            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl border border-gray-700">
                <table className="w-full text-left">
                    <thead className="bg-gray-700/50 text-gray-300">
                        <tr>
                            <th className="p-4">Username</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Traffic Usage</th>
                            <th className="p-4">Expiry</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-700/30 transition-colors">
                                <td className="p-4 text-white font-medium">{user.username}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs ${user.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {user.is_active ? 'Active' : 'Disabled'}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-300">
                                    {user.traffic_used_gb} / {user.traffic_limit_gb || '∞'} GB
                                </td>
                                <td className="p-4 text-gray-300">
                                    {user.expire_at ? new Date(user.expire_at).toLocaleDateString() : 'Never'}
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button onClick={() => handleDelete(user.id)} className="text-red-400 hover:text-red-300 p-1">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">
                                    No users found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">Create New User</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Username</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Password</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Traffic Limit (GB)</label>
                                <input
                                    type="number"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                    value={formData.traffic_limit_gb}
                                    onChange={e => setFormData({ ...formData, traffic_limit_gb: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Expire Days</label>
                                <input
                                    type="number"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                    value={formData.expire_days}
                                    onChange={e => setFormData({ ...formData, expire_days: parseInt(e.target.value) })}
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
                                >
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
