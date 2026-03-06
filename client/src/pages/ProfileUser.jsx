import { useState, useEffect } from 'react';
import useAuthStore from '../context/useAuthStore';
import api from '../services/api';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, XCircle, MapPin } from 'lucide-react';
import { format } from 'date-fns';

const ProfileUser = () => {
    const { user } = useAuthStore();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings/my');
            setBookings(res.data);
        } catch (error) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        try {
            await api.put(`/bookings/${id}/cancel`);
            toast.success('Booking cancelled successfully');
            fetchBookings();
        } catch (error) {
            toast.error('Failed to cancel booking');
        }
    };

    if (loading) return <div className="p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
            <p className="text-gray-600 mb-8">Manage your upcoming and past reservations.</p>

            {bookings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-500 mb-6">You haven't made any reservations.</p>
                    <Link to="/restaurants" className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition">
                        Find a Restaurant
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-start sm:items-center">

                            <div className="h-24 w-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                {booking.restaurantId?.images?.[0] ? (
                                    <img src={booking.restaurantId.images[0]} alt="Restaurant" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-gray-400">No Img</div>
                                )}
                            </div>

                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        <Link to={`/restaurant/${booking.restaurantId?._id}`} className="hover:text-primary-600">
                                            {booking.restaurantId?.name || 'Unknown Restaurant'}
                                        </Link>
                                    </h3>
                                    <span className={`px-2 py-1 text-xs font-bold rounded-md ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {booking.status.toUpperCase()}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {format(new Date(booking.date), 'MMM dd, yyyy')}</span>
                                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {booking.timeSlot}</span>
                                    <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {booking.numberOfGuests} Guests</span>
                                    {booking.restaurantId?.location?.address && <span className="flex items-center gap-1 truncate"><MapPin className="h-4 w-4" /> {booking.restaurantId.location.address}</span>}
                                </div>

                                {booking.specialRequest && (
                                    <p className="text-sm bg-gray-50 p-2 rounded-md italic text-gray-600 border border-gray-100">
                                        "{booking.specialRequest}"
                                    </p>
                                )}
                            </div>

                            {booking.status === 'confirmed' && new Date(booking.date) >= new Date(new Date().setHours(0, 0, 0, 0)) && (
                                <button
                                    onClick={() => handleCancel(booking._id)}
                                    className="flex items-center gap-1 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition-colors sm:w-auto w-full justify-center"
                                >
                                    <XCircle className="h-4 w-4" /> Cancel
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfileUser;
