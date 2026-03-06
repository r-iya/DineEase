import { Link } from 'react-router-dom';
import { Utensils, MapPin, Star } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)]">
            {/* Hero Section */}
            <section className="relative bg-gray-900 text-white overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                        alt="Restaurant staging"
                        className="w-full h-full object-cover opacity-30"
                    />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Discover & Book the <span className="text-primary-500">Best Restaurants checkinggggggg</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-10">
                        One-stop platform to find local gems, view menus via AI scans, and book your table instantly.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <Link to="/map" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 transform hover:scale-105">
                            <MapPin className="h-5 w-5" /> Explore Nearby
                        </Link>
                        <Link to="/restaurants" className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center transform hover:scale-105">
                            View All Restaurants
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-gray-50 flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-primary-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                                <Utensils className="h-7 w-7 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">AI Menu Scanning</h3>
                            <p className="text-gray-600">Restaurant owners can instantly upload menu images while our AI extracts items and pricing smoothly.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-primary-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                                <MapPin className="h-7 w-7 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Location Based</h3>
                            <p className="text-gray-600">Find the great spots around you with our integrated precise map searches.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-primary-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                                <Star className="h-7 w-7 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Real-Time Bookings</h3>
                            <p className="text-gray-600">Know table availability in real-time and book slots instantly with SMS confirmations.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
