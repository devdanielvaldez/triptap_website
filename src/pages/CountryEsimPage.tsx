import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wifi, Globe, Clock, Database, Smartphone, Star, ShoppingCart, Loader } from 'lucide-react';
import { useLanguage, translateCountryName } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EsimCheckoutModal from '../components/EsimCheckoutModal';
import axios from 'axios';

interface EsimPackage {
  id: string;
  type: string;
  price: number;
  amount: number;
  day: number;
  is_unlimited: boolean;
  title: string;
  data: string;
  voice?: number;
  text?: number;
}

interface EsimOperator {
  id: number;
  title: string;
  image: {
    url: string;
    width: number;
    height: number;
  };
  packages: EsimPackage[];
  info: string[];
  plan_type: string;
  coverages: Array<{
    name: string;
    code: string;
    networks: Array<{
      name: string;
      types: string[];
    }>;
  }>;
}

interface EsimCountry {
  slug: string;
  country_code: string;
  title: string;
  image: {
    url: string;
    width: number;
    height: number;
  };
  operators: EsimOperator[];
}

const CountryEsimPage = () => {
  const { t, language } = useLanguage();
  const { countrySlug } = useParams<{ countrySlug: string }>();
  const navigate = useNavigate();
  const [country, setCountry] = useState<EsimCountry | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOperator, setSelectedOperator] = useState<number | null>(null);
  const [checkoutModal, setCheckoutModal] = useState<{
    isOpen: boolean;
    package: any;
    operator: any;
    country: any;
  }>({
    isOpen: false,
    package: null,
    operator: null,
    country: null
  });

  useEffect(() => {
    fetchCountryData();
  }, [countrySlug]);

  const fetchCountryData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://dev.triptapmedia.com/api/esim/?page=1&limit=500');
      const foundCountry = response.data.data.find((c: EsimCountry) => c.slug === countrySlug);
      setCountry(foundCountry || null);
    } catch (error) {
      console.error('Error fetching country data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDurationText = (days: number) => {
    if (days === 1) return t('esim.duration.day');
    if (days < 30) return `${days} ${t('esim.duration.days')}`;
    if (days === 30) return t('esim.duration.month');
    if (days < 365) return `${Math.round(days / 30)} ${t('esim.duration.months')}`;
    return t('esim.duration.year');
  };

  const handlePurchase = (operator: EsimOperator, pkg: EsimPackage) => {
    if (country) {
      setCheckoutModal({
        isOpen: true,
        package: pkg,
        operator: operator,
        country: country
      });
    }
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
          <p className="text-white text-xl">{t('esim.loading')}</p>
        </div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="pt-24 pb-16 text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white mb-4">País no encontrado</h1>
            <button
              onClick={() => navigate('/esim')}
              className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Volver a eSIM
            </button>
          </div>
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

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Back Button */}
          <button
            onClick={() => navigate('/esim')}
            className="flex items-center space-x-2 text-[#4EBEFF] hover:text-[#EF5AFF] transition-colors duration-300 mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Volver a eSIM</span>
          </button>

          {/* Country Header */}
          <div className="flex items-center space-x-6 mb-12">
            <img
              src={country.image.url}
              alt={translateCountryName(country.title, language, t)}
              className="w-24 h-24 rounded-2xl object-cover shadow-2xl"
            />
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {translateCountryName(country.title, language, t)}
                <span className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent"> eSIM</span>
              </h1>
              <p className="text-xl text-gray-300">
                {country.operators.length} {t('esim.operators')} • {country.operators.reduce((total, op) => total + op.packages.length, 0)} planes disponibles
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <Wifi className="w-8 h-8 text-[#EF5AFF] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">5G</div>
              <div className="text-gray-400 text-sm">Velocidad</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <Smartphone className="w-8 h-8 text-[#4EBEFF] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">Instantáneo</div>
              <div className="text-gray-400 text-sm">Activación</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <Database className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">Desde 1GB</div>
              <div className="text-gray-400 text-sm">Datos</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">24/7</div>
              <div className="text-gray-400 text-sm">Soporte</div>
            </div>
          </div>
        </div>
      </section>

      {/* Operators Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Operator Tabs */}
          <div className="flex flex-wrap gap-4 mb-12 justify-center">
            <button
              onClick={() => setSelectedOperator(null)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedOperator === null
                  ? 'bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              Todos los Operadores
            </button>
            {country.operators.map((operator) => (
              <button
                key={operator.id}
                onClick={() => setSelectedOperator(operator.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedOperator === operator.id
                    ? 'bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                {operator.title}
              </button>
            ))}
          </div>

          {/* Operators Grid */}
          <div className="space-y-12">
            {country.operators
              .filter(operator => selectedOperator === null || operator.id === selectedOperator)
              .map((operator, index) => (
              <div
                key={operator.id}
                className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Operator Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                      <Wifi className="w-8 h-8 text-[#4EBEFF]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{operator.title}</h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          operator.plan_type === 'data' 
                            ? 'bg-blue-500/20 text-blue-400' 
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {operator.plan_type === 'data' ? t('esim.data_only') : t('esim.data_voice_text')}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {operator.packages.length} planes disponibles
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Networks */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Redes Disponibles</h4>
                  <div className="flex flex-wrap gap-2">
                    {operator.coverages[0]?.networks.map((network, idx) => (
                      <span key={idx} className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-sm">
                        {network.name} {network.types.join('/')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Info */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-white mb-3">Información</h4>
                  <ul className="space-y-2">
                    {operator.info.map((info, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-gray-300">
                        <div className="w-2 h-2 bg-[#4EBEFF] rounded-full mt-2 flex-shrink-0"></div>
                        <span>{info}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Packages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {operator.packages.map((pkg) => (
                    <div key={pkg.id} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h5 className="text-lg font-bold text-white mb-1">{pkg.data}</h5>
                          <p className="text-gray-400 text-sm">
                            {getDurationText(pkg.day)}
                            {pkg.voice && ` • ${pkg.voice} ${t('esim.minutes')}`}
                            {pkg.text && ` • ${pkg.text} SMS`}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#4EBEFF]">${pkg.price}</div>
                          <div className="text-xs text-gray-400">USD</div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Datos:</span>
                          <span className="text-white font-medium">{pkg.data}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Duración:</span>
                          <span className="text-white font-medium">{getDurationText(pkg.day)}</span>
                        </div>
                        {pkg.voice && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Minutos:</span>
                            <span className="text-white font-medium">{pkg.voice}</span>
                          </div>
                        )}
                        {pkg.text && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">SMS:</span>
                            <span className="text-white font-medium">{pkg.text}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handlePurchase(operator, pkg)}
                        className="w-full bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>{t('esim.buy')} - ${pkg.price}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      
      <EsimCheckoutModal
        isOpen={checkoutModal.isOpen}
        onClose={() => setCheckoutModal({ isOpen: false, package: null, operator: null, country: null })}
        package={checkoutModal.package}
        operator={checkoutModal.operator}
        country={checkoutModal.country}
      />
    </div>
  );
};

export default CountryEsimPage;