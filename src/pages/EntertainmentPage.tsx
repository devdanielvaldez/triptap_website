import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users, Star, Calendar, ArrowRight, Loader, Filter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

interface EntertainmentPlace {
  _id: string;
  name: string;
  location: string;
  description: string;
  overview: string;
  pricePerPassenger: number;
  currency: string;
  availableDays: {
    sun: boolean;
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
  };
  images?: string[];
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalPlaces: number;
  limit: number;
}

const EntertainmentPage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [places, setPlaces] = useState<EntertainmentPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('all');

  useEffect(() => {
    fetchPlaces();
  }, [currentPage]);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://dev.triptapmedia.com/api/entertainment/?page=${currentPage}&limit=12`);
      setPlaces(response.data.places);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching entertainment places:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableDaysText = (availableDays: any) => {
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const dayNames = language === 'es' 
      ? ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const availableCount = days.filter(day => availableDays[day]).length;
    
    if (availableCount === 7) {
      return language === 'es' ? 'Todos los días' : 'Every day';
    }
    
    const availableNames = days
      .filter(day => availableDays[day])
      .map((day, index) => dayNames[days.indexOf(day)])
      .slice(0, 3);
    
    return availableNames.join(', ') + (availableCount > 3 ? '...' : '');
  };

  const handleViewDetails = (placeId: string) => {
    navigate(`/entertainment/${placeId}`);
  };

  const getUniqueLocations = () => {
    const locations = [...new Set(places.map(place => place.location))];
    return locations;
  };

  const filteredPlaces = selectedLocation === 'all' 
    ? places 
    : places.filter(place => place.location === selectedLocation);

  if (loading && places.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Header />
        <div className="text-center pt-20">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-t-4 border-b-4 border-[#4EBEFF] rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-t-4 border-b-4 border-[#EF5AFF] rounded-full animate-spin-slow"></div>
          </div>
          <p className="text-white text-xl">Cargando experiencias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#EF5AFF] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#4EBEFF] rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Floating Entertainment Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 left-20 text-4xl animate-float opacity-30">🎭</div>
          <div className="absolute top-60 right-32 text-3xl animate-float delay-1000 opacity-25">🎪</div>
          <div className="absolute bottom-40 left-32 text-5xl animate-float delay-2000 opacity-20">🎨</div>
          <div className="absolute bottom-32 right-20 text-3xl animate-float delay-500 opacity-30">🎵</div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8 animate-fade-in-up">
              <div className="w-20 h-20 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Experiencias
                <span className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent"> Únicas</span>
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              Descubre las mejores experiencias de entretenimiento en República Dominicana
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in-up delay-400">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <MapPin className="w-8 h-8 text-[#EF5AFF] mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">{getUniqueLocations().length}+</div>
                <div className="text-gray-400 text-sm">Destinos</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <Star className="w-8 h-8 text-[#4EBEFF] mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">{pagination?.totalPlaces || 0}</div>
                <div className="text-gray-400 text-sm">Experiencias</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 col-span-2 md:col-span-1">
                <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-gray-400 text-sm">Soporte</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-gray-800 sticky top-20 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-white font-semibold">Filtrar por ubicación:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedLocation('all')}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedLocation === 'all'
                    ? 'bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                Todas las ubicaciones
              </button>
              {getUniqueLocations().map((location) => (
                <button
                  key={location}
                  onClick={() => setSelectedLocation(location)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedLocation === location
                      ? 'bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white shadow-lg'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Places Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPlaces.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No hay experiencias disponibles</h3>
              <p className="text-gray-400">Intenta cambiar los filtros de búsqueda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPlaces.map((place, index) => (
                <div
                  key={place._id}
                  className="bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {place.images && place.images.length > 0 ? (
                      <img
                        src={place.images[0]}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#EF5AFF]/20 to-[#4EBEFF]/20 flex items-center justify-center">
                        <Star className="w-16 h-16 text-white/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ${place.pricePerPassenger} {place.currency}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#4EBEFF] transition-colors duration-300">
                          {place.name}
                        </h3>
                        <div className="flex items-center text-gray-400 text-sm mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          {place.location}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {place.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-gray-400 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {getAvailableDaysText(place.availableDays)}
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Users className="w-4 h-4 mr-1" />
                        Por persona
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewDetails(place._id)}
                      className="w-full bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <span>Ver Detalles</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white shadow-lg'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EntertainmentPage;