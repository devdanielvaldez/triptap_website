import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, Clock, Star, Calendar, Mail, Phone, CheckCircle, Loader, Copy, ExternalLink, Gift, Shield, Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

interface DealImage {
  url: string;
  altText: string;
  _id: string;
}

interface Merchant {
  name: string;
  website: string;
  logo: string;
}

interface Deal {
  _id: string;
  title: string;
  description: string;
  summary: string;
  images: DealImage[];
  highlights: string[];
  offerCode: string;
  expirationDate: string;
  status: string;
  category: string;
  isFeatured: boolean;
  termsAndConditions: string;
  merchant: Merchant;
  createdAt: string;
  updatedAt: string;
}

const DealDetailPage = () => {
  useLanguage();
  const { dealId } = useParams<{ dealId: string }>();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    if (dealId) {
      fetchDealDetails();
    }
  }, [dealId]);

  const fetchDealDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://dev.triptapmedia.com/api/deals/${dealId}`);
      setDeal(response.data.deal);
    } catch (error) {
      console.error('Error fetching deal details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatExpirationDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Expirado', expired: true, urgent: false };
    if (diffDays === 0) return { text: 'Expira hoy', expired: false, urgent: true };
    if (diffDays === 1) return { text: 'Expira mañana', expired: false, urgent: true };
    if (diffDays <= 7) return { text: `Expira en ${diffDays} días`, expired: false, urgent: true };
    
    return { 
      text: date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }), 
      expired: false, 
      urgent: false 
    };
  };

  const copyOfferCode = async () => {
    if (deal) {
      try {
        await navigator.clipboard.writeText(deal.offerCode);
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 2000);
      } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = deal.offerCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 2000);
      }
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Header />
        <div className="text-center pt-20">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-t-4 border-b-4 border-[#4EBEFF] rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-t-4 border-b-4 border-[#EF5AFF] rounded-full animate-spin-slow"></div>
          </div>
          <p className="text-white text-xl">Cargando oferta...</p>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="pt-24 pb-16 text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white mb-4">Oferta no encontrada</h1>
            <button
              onClick={() => navigate('/deals')}
              className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Volver a Ofertas
            </button>
          </div>
        </div>
      </div>
    );
  }

  const expirationStatus = formatExpirationDate(deal.expirationDate);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {/* Back Button */}
      <div className="pt-24 pb-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/deals')}
            className="flex items-center space-x-2 text-[#4EBEFF] hover:text-[#EF5AFF] transition-colors duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Volver a Ofertas</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pb-16 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative h-96 rounded-3xl overflow-hidden">
                {deal.images && deal.images.length > 0 ? (
                  <img
                    src={deal.images[selectedImageIndex].url}
                    alt={deal.images[selectedImageIndex].altText}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#EF5AFF]/20 to-[#4EBEFF]/20 flex items-center justify-center">
                    <Gift className="w-24 h-24 text-white/50" />
                  </div>
                )}
                
                {/* Status Overlays */}
                {deal.isFeatured && (
                  <div className="absolute top-4 left-4">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2">
                      <Star className="w-4 h-4" />
                      <span>OFERTA DESTACADA</span>
                    </div>
                  </div>
                )}
                
                {expirationStatus.urgent && !expirationStatus.expired && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                      ¡ÚLTIMOS DÍAS!
                    </div>
                  </div>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {deal.images && deal.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {deal.images.slice(0, 4).map((image, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                        selectedImageIndex === index ? 'ring-2 ring-[#EF5AFF]' : 'hover:opacity-80'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.altText}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-12 text-center">
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-white mb-6">Usar Esta Oferta</h3>
                
                {expirationStatus.expired ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-red-400" />
                    </div>
                    <h4 className="text-xl font-bold text-red-400 mb-2">Oferta Expirada</h4>
                    <p className="text-gray-400">Esta oferta ya no está disponible</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-[#EF5AFF]/10 to-[#4EBEFF]/10 rounded-2xl p-6 border border-[#EF5AFF]/20">
                      <div className="text-center">
                        <div className="text-gray-400 mb-2">Código de Oferta</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent mb-4">
                          {deal.offerCode}
                        </div>
                        <button
                          onClick={copyOfferCode}
                          className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 mx-auto"
                        >
                          <Copy className="w-4 h-4" />
                          <span>{codeCopied ? '¡Copiado!' : 'Copiar Código'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => window.open(deal.merchant.website, '_blank')}
                        className="bg-gradient-to-r from-green-400 to-emerald-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Usar Oferta Ahora</span>
                      </button>
                      
                      <button
                        onClick={() => navigate('/deals')}
                        className="border-2 border-[#4EBEFF] text-[#4EBEFF] px-8 py-4 rounded-full font-semibold hover:bg-[#4EBEFF] hover:text-white transition-all duration-300"
                      >
                        Ver Más Ofertas
                      </button>
                    </div>

                    <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 font-semibold text-sm">Cómo Usar</span>
                      </div>
                      <p className="text-blue-300 text-xs">
                        Copia el código y úsalo en el sitio web del merchant para obtener tu descuento.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Content */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl">{getCategoryIcon(deal.category)}</span>
                  <span className="text-gray-400 font-medium">{getCategoryName(deal.category)}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {deal.title}
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed mb-6">
                  {deal.description}
                </p>
              </div>

              {/* Merchant Info */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={deal.merchant.logo}
                    alt={deal.merchant.name}
                    className="w-12 h-12 rounded-lg object-contain bg-white/10 p-2"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white">{deal.merchant.name}</h3>
                    <a 
                      href={deal.merchant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4EBEFF] hover:text-[#EF5AFF] transition-colors duration-300 text-sm flex items-center space-x-1"
                    >
                      <span>Visitar sitio web</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Offer Code */}
              <div className="bg-gradient-to-r from-[#EF5AFF]/10 to-[#4EBEFF]/10 rounded-2xl p-6 border border-[#EF5AFF]/20">
                <div className="text-center">
                  <div className="text-gray-400 mb-2">Código de Oferta</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent mb-4">
                    {deal.offerCode}
                  </div>
                  <button
                    onClick={copyOfferCode}
                    className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 mx-auto"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{codeCopied ? '¡Copiado!' : 'Copiar Código'}</span>
                  </button>
                </div>
              </div>

              {/* Expiration */}
              <div className={`rounded-2xl p-4 border ${
                expirationStatus.expired 
                  ? 'bg-red-500/10 border-red-500/20' 
                  : expirationStatus.urgent 
                    ? 'bg-orange-500/10 border-orange-500/20' 
                    : 'bg-green-500/10 border-green-500/20'
              }`}>
                <div className="flex items-center space-x-3">
                  <Clock className={`w-5 h-5 ${
                    expirationStatus.expired 
                      ? 'text-red-400' 
                      : expirationStatus.urgent 
                        ? 'text-orange-400' 
                        : 'text-green-400'
                  }`} />
                  <span className={`font-semibold ${
                    expirationStatus.expired 
                      ? 'text-red-400' 
                      : expirationStatus.urgent 
                        ? 'text-orange-400' 
                        : 'text-green-400'
                  }`}>
                    {expirationStatus.text}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details and Claim */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Details */}
            <div className="space-y-8">
              {/* Overview */}
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">Descripción de la Oferta</h3>
                <p className="text-gray-300 leading-relaxed text-lg mb-6">
                  {deal.summary}
                </p>
                {deal.description && deal.description !== deal.summary && (
                  <p className="text-gray-300 leading-relaxed">
                    {deal.description}
                  </p>
                )}
              </div>

              {/* Highlights */}
              {deal.highlights && deal.highlights.length > 0 && (
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                  <h3 className="text-2xl font-bold text-white mb-6">Lo Que Incluye</h3>
                  <ul className="space-y-3">
                    {deal.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Terms and Conditions */}
              {deal.termsAndConditions && (
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Info className="w-6 h-6 mr-3 text-[#4EBEFF]" />
                    Términos y Condiciones
                  </h3>
                  <div className="bg-white/5 rounded-xl p-4 max-h-40 overflow-y-auto">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {deal.termsAndConditions}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DealDetailPage;