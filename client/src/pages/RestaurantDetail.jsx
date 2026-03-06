import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../context/useAuthStore';
import { toast } from 'sonner';
import { Star, MapPin, Clock, Calendar, Users, MessageSquare, Utensils } from 'lucide-react';
import { format } from 'date-fns';

const RestaurantDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();

    const [restaurant, setRestaurant] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Booking State
    const [bookingDate, setBookingDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [guests, setGuests] = useState(2);
    const [specialRequest, setSpecialRequest] = useState('');
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        fetchRestaurantData();
    }, [id]);

    const fetchRestaurantData = async () => {
        try {
            setLoading(true);
            const [resData, reviewsData] = await Promise.all([
                api.get(`/restaurants/${id}`),
                api.get(`/reviews/restaurant/${id}`)
            ]);
            setRestaurant(resData.data);
            setReviews(reviewsData.data);
        } catch (error) {
            toast.error('Failed to load restaurant details');
            navigate('/restaurants');
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.info('Please login to book a table');
            navigate('/login');
            return;
        }

        if (user?.role === 'admin' || user?.role === 'owner') {
            toast.error('Only Diners can book tables');
            return;
        }

        try {
            setIsBooking(true);
            await api.post('/bookings', {
                restaurantId: id,
                date: bookingDate,
                timeSlot,
                numberOfGuests: guests,
                specialRequest
            });
            toast.success('Table booked successfully!');
            setBookingDate('');
            setTimeSlot('');
            setSpecialRequest('');
            navigate('/profile');
        } catch (error) {
            // Error handled by interceptor ideally, but can be duplicate caught here
            console.error(error);
        } finally {
            setIsBooking(false);
        }
    };

    // Generate 1-hour time slots between opening and closing
    const generateTimeSlots = () => {
        if (!restaurant) return [];
        const slots = [];
        let current = parseInt(restaurant.openingTime.split(':')[0]);
        const end = parseInt(restaurant.closingTime.split(':')[0]);

        while (current < end) {
            slots.push(`${current.toString().padStart(2, '0')}:00`);
            current++;
        }
        return slots;
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
    if (!restaurant) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header & Gallery */}
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{restaurant.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                    <span className="flex items-center gap-1 font-medium text-yellow-500"><Star className="h-5 w-5 fill-yellow-500" /> {restaurant.rating?.toFixed(1) || 'No ratings'}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-5 w-5" /> {restaurant.location?.address || 'Location unavailable'}</span>
                    <span className="flex items-center gap-1"><Clock className="h-5 w-5" /> {restaurant.openingTime} - {restaurant.closingTime}</span>
                    <span className="font-semibold px-2 py-1 bg-gray-100 rounded-md">{restaurant.cuisine} • {restaurant.priceRange}</span>
                </div>

                {/* CSS Grid Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px] mb-8">
                    {restaurant.images && restaurant.images.length > 0 ? (
                        <>
                            <div className="md:col-span-2 h-full rounded-2xl overflow-hidden hover:opacity-95 transition-opacity cursor-pointer">
                                <img src={restaurant.images[0]} alt="Main" className="w-full h-full object-cover" />
                            </div>
                            <div className="grid grid-rows-2 gap-4 md:col-span-1 h-full">
                                {restaurant.images[1] && <img src={restaurant.images[1]} className="w-full h-full object-cover rounded-2xl" />}
                                {restaurant.images[2] && <img src={restaurant.images[2]} className="w-full h-full object-cover rounded-2xl" />}
                            </div>
                            <div className="grid grid-rows-2 gap-4 md:col-span-1 h-full">
                                {restaurant.images[3] && <img src={restaurant.images[3]} className="w-full h-full object-cover rounded-2xl" />}
                                {restaurant.images[4] && <img src={restaurant.images[4]} className="w-full h-full object-cover rounded-2xl" />}
                            </div>
                        </>
                    ) : (
                        <div className="col-span-4 h-full bg-gray-200 rounded-2xl flex items-center justify-center">
                            <span className="text-gray-400">No images available</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Details & Menu */}
                <div className="lg:col-span-2 space-y-10">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                        <p className="text-gray-700 leading-relaxed text-lg">{restaurant.description}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Utensils /> Menu Highlights</h2>
                        {restaurant.menu && restaurant.menu.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {restaurant.menu.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                        <span className="font-semibold text-gray-800">{item.name}</span>
                                        <span className="font-bold text-primary-600">${item.price.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">Menu not uploaded yet.</p>
                        )}
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2"><MessageSquare /> Reviews</h2>
                        {reviews.length > 0 ? (
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div key={review._id} className="p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-gray-900">{review.userId?.name || 'Anonymous'}</span>
                                            <div className="flex items-center text-yellow-500">
                                                <Star className="h-4 w-4 fill-yellow-500" />
                                                <span className="ml-1 text-sm font-medium">{review.rating}</span>
                                            </div>
                                        </div>
                                        {/* Show date */}
                                        <p className="text-xs text-gray-400 mb-2">{format(new Date(review.createdAt), 'MMM dd, yyyy')}</p>
                                        <p className="text-gray-700">{review.comment}</p>
                                        {review.image && <img src={review.image} alt="Review" className="mt-3 h-24 w-24 object-cover rounded-lg" />}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                        )}
                    </section>
                </div>

                {/* Right Column: Booking Widget */}
                <div className="lg:col-span-1">
                    <div className="bg-white border text-gray-900 border-gray-200 rounded-2xl shadow-xl p-6 sticky top-24">
                        <h3 className="text-xl font-bold mb-4">Book a Table</h3>
                        <form onSubmit={handleBooking} className="space-y-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="date"
                                        required
                                        min={new Date().toISOString().split('T')[0]} // Cannot book past dates
                                        value={bookingDate}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                        className="pl-10 w-full rounded-lg border border-gray-300 py-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <select
                                        required
                                        value={timeSlot}
                                        onChange={(e) => setTimeSlot(e.target.value)}
                                        className="pl-10 w-full rounded-lg border border-gray-300 py-2 focus:ring-primary-500 focus:border-primary-500"
                                    >
                                        <option value="" disabled>Select a time</option>
                                        {generateTimeSlots().map(slot => (
                                            <option key={slot} value={slot}>{slot}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="number"
                                        required min="1" max="20"
                                        value={guests}
                                        onChange={(e) => setGuests(parseInt(e.target.value))}
                                        className="pl-10 w-full rounded-lg border border-gray-300 py-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Special Request (Optional)</label>
                                <textarea
                                    rows="2"
                                    value={specialRequest}
                                    onChange={(e) => setSpecialRequest(e.target.value)}
                                    placeholder="Anniversary, Window seat..."
                                    className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isBooking}
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-transform transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                            >
                                {isBooking ? 'Confirming...' : 'Reserve Table'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantDetail;
