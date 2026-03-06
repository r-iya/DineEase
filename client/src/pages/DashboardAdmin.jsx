import { useState, useEffect } from 'react';
import useAuthStore from '../context/useAuthStore';
import api from '../services/api';
import { toast } from 'sonner';
import { Trash2, CheckCircle } from 'lucide-react';

const DashboardAdmin = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalRestaurants: 0, totalBookings: 0, pendingRestaurants: 0 });
    const [pendingRestaurants, setPendingRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, pendingRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/restaurants/pending')
            ]);
            setStats(statsRes.data);
            setPendingRestaurants(pendingRes.data);
        } catch (error) {
            toast.error('Failed to load admin dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (id, isApproved) => {
        try {
            await api.put(`/admin/restaurants/${id}/approve`, { isApproved });
            toast.success(`Restaurant ${isApproved ? 'approved' : 'rejected'} successfully`);
            fetchData(); // refresh
        } catch (error) {
            toast.error('Action failed');
        }
    };

    if (loading) return <p className="p-8">Loading admin data...</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Restaurants</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalRestaurants}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Bookings</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 bg-purple-50">
                    <p className="text-sm font-medium text-purple-700 mb-1">Pending Approval</p>
                    <p className="text-3xl font-bold text-purple-900">{stats.pendingRestaurants}</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Restaurant Approvals</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {pendingRestaurants.length === 0 ? (
                    <p className="p-6 text-gray-500">No restaurants waiting for approval.</p>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {pendingRestaurants.map((r) => (
                            <li key={r._id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{r.name}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{r.location?.address} • {r.cuisine}</p>
                                    <p className="text-sm text-gray-700 max-w-2xl">{r.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleApproval(r._id, false)}
                                        className="flex items-center gap-1 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-md font-medium transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" /> Reject
                                    </button>
                                    <button
                                        onClick={() => handleApproval(r._id, true)}
                                        className="flex items-center gap-1 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-md font-medium transition-colors"
                                    >
                                        <CheckCircle className="h-4 w-4" /> Approve
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default DashboardAdmin;
