import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import api from '../services/api';
import { MapPin, Search, Star, Utensils } from 'lucide-react';

// Fix for default Leaflet icon not showing correctly in React/Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to dynamically set map view dynamically
const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 13);
    }, [center, map]);
    return null;
};

const RestaurantList = ({ showMap = false }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cuisineFilter, setCuisineFilter] = useState('');
    const [userLocation, setUserLocation] = useState(null); // [lat, lng]

    // Default to a central location (e.g., New York) if geolocation fails or is denied
    const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]);

    useEffect(() => {
        // Try to get user location
        if (showMap && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setUserLocation([lat, lng]);
                    setMapCenter([lat, lng]);
                    fetchRestaurants(lat, lng);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    fetchRestaurants();
                }
            );
        } else {
            fetchRestaurants();
        }
    }, [showMap]);

    const fetchRestaurants = async (lat, lng) => {
        try {
            setLoading(true);
            let url = '/restaurants';
            const params = new URLSearchParams();

            if (lat && lng) {
                params.append('lat', lat);
                params.append('lng', lng);
            }
            if (cuisineFilter) {
                params.append('cuisine', cuisineFilter);
            }

            const response = await api.get(`${url}?${params.toString()}`);
            setRestaurants(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (userLocation) {
            fetchRestaurants(userLocation[0], userLocation[1]);
        } else {
            fetchRestaurants();
        }
    };

    return (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${showMap ? 'flex flex-col md:flex-row gap-6 h-[calc(100vh-100px)]' : ''}`}>

            {/* Sidebar / List View */}
            <div className={`${showMap ? 'w-full md:w-1/3 flex flex-col h-full' : 'w-full'}`}>
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{showMap ? 'Nearby Restaurants' : 'All Restaurants'}</h1>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Filter by Cuisine (e.g., Italian)"
                                value={cuisineFilter}
                                onChange={(e) => setCuisineFilter(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                            Filter
                        </button>
                    </form>
                </div>

                {loading ? (
                    <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div></div>
                ) : restaurants.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">No restaurants found in this area.</p>
                ) : (
                    <div className={`grid gap-6 ${showMap ? 'overflow-y-auto pr-2 pb-2 grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                        {restaurants.map((restaurant) => (
                            <Link to={`/restaurant/${restaurant._id}`} key={restaurant._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                                <div className="h-48 bg-gray-200 overflow-hidden relative">
                                    {restaurant.images?.length > 0 ? (
                                        <img src={restaurant.images[0]} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            <Utensils className="h-12 w-12 text-gray-300" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-sm font-bold flex items-center gap-1 shadow-sm">
                                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> {restaurant.rating?.toFixed(1) || 'New'}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">{restaurant.name}</h3>
                                    <div className="flex items-center text-gray-500 text-sm mb-2 gap-4">
                                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {restaurant.cuisine}</span>
                                        <span className="font-medium text-gray-700">{restaurant.priceRange}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm line-clamp-2">{restaurant.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Map View */}
            {showMap && (
                <div className="w-full md:w-2/3 h-[50vh] md:h-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
                    <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapUpdater center={mapCenter} />

                        {/* User Location Marker */}
                        {userLocation && (
                            <Marker position={userLocation}>
                                <Popup>
                                    <div className="text-center font-semibold text-primary-600">You are here</div>
                                </Popup>
                            </Marker>
                        )}

                        {/* Restaurant Markers */}
                        {restaurants.map((restaurant) => {
                            const hasLocation = restaurant.location?.coordinates?.length === 2;
                            if (!hasLocation) return null;

                            const position = [restaurant.location.coordinates[1], restaurant.location.coordinates[0]]; // Map takes [lat, lng]

                            return (
                                <Marker key={restaurant._id} position={position}>
                                    <Popup>
                                        <div className="text-center">
                                            <p className="font-bold text-gray-900 mb-1">{restaurant.name}</p>
                                            <p className="text-sm text-gray-600 mb-2">{restaurant.cuisine}</p>
                                            <Link to={`/restaurant/${restaurant._id}`} className="text-primary-600 text-sm font-medium hover:underline">View details</Link>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </div>
            )}
        </div>
    );
};

export default RestaurantList;
