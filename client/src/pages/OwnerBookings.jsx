import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'sonner';
import { Calendar, Clock, Users, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

const OwnerBookings = () => {
    const { id } = useParams();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, [id]);

    const fetchBookings = async () => {
        try {
            // Need to fetch bookings for this specific restaurant
            // But server API currently doesn't have an owner-specific "view bookings by restaurant" route
            // We can fetch all bookings that belong to this restaurant IF there's a route.
            // Let's check server later or assume there is an API method like GET /restaurants/:id/bookings
            const res = await api.get(`/bookings/restaurant/${id}`); // We will need to make this endpoint if it doesn't exist
            setBookings(res.data);
        } catch (error) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (bookingId) => {
        try {
            await api.put(`/bookings/${bookingId}/cancel`);
            toast.success(`Booking cancelled`);
            fetchBookings();
        } catch (error) {
            toast.error('Failed to cancel booking');
        }
    }

    if (loading) return <div className="p-8">Loading Bookings...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Reservations</h1>

            {bookings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
                </div>
            ) : (
                <div className="grid gap-4">
                    {bookings.map((b) => (
                        <div key={b._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{b.userId?.name || 'Walk-in / Unknown User'} <span className="text-sm font-normal text-gray-500">({b.userId?.email || 'N/A'})</span></h3>
                                <div className="flex gap-4 text-sm text-gray-600 mb-2">
                                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {format(new Date(b.date), 'MMM dd, yyyy')}</span>
                                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {b.timeSlot}</span>
                                    <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {b.numberOfGuests} Guests</span>
                                </div>
                                {b.specialRequest && (
                                    <p className="text-sm bg-yellow-50 p-2 rounded text-yellow-800 italic">" {b.specialRequest} "</p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                    b.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {b.status.toUpperCase()}
                                </span>

                                {b.status === 'confirmed' && (
                                    <button onClick={() => updateStatus(b._id, 'cancelled')} className="p-2 text-red-600 hover:bg-red-50 rounded-full" title="Cancel Booking"><XCircle /></button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OwnerBookings;
