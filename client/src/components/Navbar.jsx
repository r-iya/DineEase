import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../context/useAuthStore';
import { Utensils, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex flex-shrink-0 items-center gap-2">
                            <Utensils className="h-8 w-8 text-primary-600" />
                            <span className="font-bold text-2xl text-gray-900 tracking-tight">DineEase</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {!isAuthenticated ? (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md font-medium transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md font-medium transition-colors">
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 mr-4">
                                    <UserIcon className="h-5 w-5 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">Hi, {user?.name}</span>
                                </div>

                                {user?.role === 'admin' && (
                                    <Link to="/admin" className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">Dashboard</Link>
                                )}
                                {user?.role === 'owner' && (
                                    <Link to="/owner" className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">My Restaurant</Link>
                                )}
                                {user?.role === 'user' && (
                                    <Link to="/profile" className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">My Bookings</Link>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-md transition-colors font-medium text-sm"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
