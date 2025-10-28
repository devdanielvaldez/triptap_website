import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Clock, Star, Calendar, ArrowRight, Loader, Filter, Gift, Percent, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

interface DealImage {
  url: string;
  altText: string;
  _id: string;
}

interface Deal {
  _id: string;
  title: string;
  summary: string;
  images: DealImage[];
  offerCode: string;
  expirationDate: string;
  status: string;
  category: string;
  isFeatured: boolean;
  createdAt: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalDeals: number;
  limit: number;
}

const DealsPage = () => {
  useLanguage();
  const navigate = useNavigate();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchDeals();
  }, [currentPage]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://dev.triptapmedia.com/api/deals/?page=${currentPage}&limit=12`);
      setDeals(response.data.deals);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatExpirationDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expirado';
    if (diffDays === 0) return 'Expira hoy';
    if (diffDays === 1) return 'Expira mañana';
    if (diffDays <= 7) return `Expira en ${diffDays} días`;
    
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTimeRemaining = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return { expired: true, urgent: false };
    if (diffDays <= 3) return { expired: false, urgent: true };
    return { expired: false, urgent: false };
  };

  const handleViewDetails = (dealId: string) => {
    navigate(`/deals/${dealId}`);
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(deals.map(deal => deal.category))];
    return categories;
  };

  const filteredDeals = selectedCategory === 'all' 
    ? deals 
    : deals.filter(deal => deal.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'travel': return '✈️';
      case 'food': return '🍽️';
      case 'entertainment': return '🎭';
      case 'shopping': return '🛍️';
      default: return '🎁';
    }
  };

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      travel: 'Viajes',
      food: 'Gastronomía',
      entertainment: 'Entretenimiento',
      shopping: 'Compras'
    };
    return names[category] || category;
  };

  if (loading && deals.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Header />
        <div className="text-center pt-20">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-t-4 border-b-4 border-[#4EBEFF] rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-t-4 border-b-4 border-[#EF5AFF] rounded-full animate-spin-slow"></div>
          </div>
          <p className="text-white text-xl">Cargando ofertas increíbles...</p>
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

        {/* Floating Deal Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 left-20 text-4xl animate-float opacity-30">🎁</div>
          <div className="absolute top-60 right-32 text-3xl animate-float delay-1000 opacity-25">💰</div>
          <div className="absolute bottom-40 left-32 text-5xl animate-float delay-2000 opacity-20">🏷️</div>
          <div className="absolute bottom-32 right-20 text-3xl animate-float delay-500 opacity-30">⚡</div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8 animate-fade-in-up">
              <div className="w-20 h-20 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Ofertas
                <span className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent"> Exclusivas</span>
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              Descubre descuentos increíbles y ofertas limitadas especialmente seleccionadas para ti
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up delay-400">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <Gift className="w-8 h-8 text-[#EF5AFF] mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">{pagination?.totalDeals || 0}</div>
                <div className="text-gray-400 text-sm">Ofertas Activas</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <Percent className="w-8 h-8 text-[#4EBEFF] mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">50%</div>
                <div className="text-gray-400 text-sm">Descuento Máx</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">{getUniqueCategories().length}</div>
                <div className="text-gray-400 text-sm">Categorías</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-gray-400 text-sm">Disponible</div>
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
              <span className="text-white font-semibold">Filtrar por categoría:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                Todas las ofertas
              </button>
              {getUniqueCategories().map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center space-x-2 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white shadow-lg'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <span>{getCategoryIcon(category)}</span>
                  <span>{getCategoryName(category)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Deals Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredDeals.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No hay ofertas disponibles</h3>
              <p className="text-gray-400">Intenta cambiar los filtros de búsqueda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDeals.map((deal, index) => {
                const timeStatus = getTimeRemaining(deal.expirationDate);
                
                return (
                  <div
                    key={deal._id}
                    className="bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105 animate-fade-in-up relative"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Featured Badge */}
                    {deal.isFeatured && (
                      <div className="absolute top-4 left-4 z-10">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                          <Star className="w-3 h-3" />
                          <span>DESTACADO</span>
                        </div>
                      </div>
                    )}

                    {/* Urgency Badge */}
                    {timeStatus.urgent && !timeStatus.expired && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                          ¡ÚLTIMOS DÍAS!
                        </div>
                      </div>
                    )}

                    {/* Expired Badge */}
                    {timeStatus.expired && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center">
                        <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                          OFERTA EXPIRADA
                        </div>
                      </div>
                    )}

                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      {deal.images && deal.images.length > 0 ? (
                        <img
                          src={deal.images[0].url}
                          alt={deal.images[0].altText}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#EF5AFF]/20 to-[#4EBEFF]/20 flex items-center justify-center">
                          <Gift className="w-16 h-16 text-white/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      
                      {/* Category Badge */}
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                          <span>{getCategoryIcon(deal.category)}</span>
                          <span>{getCategoryName(deal.category)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#4EBEFF] transition-colors duration-300">
                            {deal.title}
                          </h3>
                          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                            {deal.summary}
                          </p>
                        </div>
                      </div>

                      {/* Offer Code */}
                      <div className="bg-gradient-to-r from-[#EF5AFF]/10 to-[#4EBEFF]/10 rounded-xl p-4 mb-4 border border-[#EF5AFF]/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-gray-400 text-xs mb-1">Código de Oferta</div>
                            <div className="text-white font-bold text-lg">{deal.offerCode}</div>
                          </div>
                          <Tag className="w-6 h-6 text-[#EF5AFF]" />
                        </div>
                      </div>

                      {/* Expiration */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-gray-400 text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatExpirationDate(deal.expirationDate)}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          timeStatus.expired 
                            ? 'bg-red-500/20 text-red-400' 
                            : timeStatus.urgent 
                              ? 'bg-orange-500/20 text-orange-400' 
                              : 'bg-green-500/20 text-green-400'
                        }`}>
                          {deal.status.toUpperCase()}
                        </div>
                      </div>

                      <button
                        onClick={() => handleViewDetails(deal._id)}
                        disabled={timeStatus.expired}
                        className="w-full bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        <span>{timeStatus.expired ? 'Oferta Expirada' : 'Ver Oferta'}</span>
                        {!timeStatus.expired && <ArrowRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                );
              })}
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

export default DealsPage;