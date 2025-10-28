import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Wifi, Globe, Clock, Database, Smartphone, Star, ShoppingCart, Loader, Calendar, MapPin, ArrowRight } from 'lucide-react';
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

const EsimPage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [countries, setCountries] = useState<EsimCountry[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<EsimCountry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [showAllOptions, setShowAllOptions] = useState(false);
  
  // Search form state
  const [searchForm, setSearchForm] = useState({
    destination: '',
    dateRange: ''
  });
  
  // Country search dropdown
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [filteredCountriesForSearch, setFilteredCountriesForSearch] = useState<EsimCountry[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<EsimCountry | null>(null);
  
  // Filters for results
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedDataAmount, setSelectedDataAmount] = useState('all');
  
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
    fetchEsimData();
  }, []);

  useEffect(() => {
    // Filtrar países para el dropdown de búsqueda
    if (searchForm.destination.trim()) {
      const searchTerm = searchForm.destination.toLowerCase();
      const filtered = countries.filter(country => {
        const originalName = country.title.toLowerCase();
        const translatedName = translateCountryName(country.title, language, t).toLowerCase();
        
        // Buscar tanto en el nombre original como en la traducción
        return originalName.includes(searchTerm) || translatedName.includes(searchTerm);
      }
      ).slice(0, 8);
      setFilteredCountriesForSearch(filtered);
      setShowCountryDropdown(filtered.length > 0);
    } else {
      setFilteredCountriesForSearch([]);
      setShowCountryDropdown(false);
    }
  }, [searchForm.destination, countries, language, t]);

  useEffect(() => {
    if (showResults && selectedCountry) {
      filterPackages();
    }
  }, [selectedDuration, selectedDataAmount, selectedCountry, showResults]);

  const fetchEsimData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://dev.triptapmedia.com/api/esim/?page=1&limit=500');
      setCountries(response.data.data);
    } catch (error) {
      console.error('Error fetching eSIM data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTripDuration = () => {
    if (!searchForm.dateRange) return 0;
    const dates = searchForm.dateRange.split(' to ');
    if (dates.length !== 2) return 0;
    const departure = new Date(dates[0]);
    const returnDate = new Date(dates[1]);
    const diffTime = Math.abs(returnDate.getTime() - departure.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filterPackages = () => {
    if (!selectedCountry) return;

    const tripDuration = calculateTripDuration();
    let filtered = [selectedCountry];

    // Filter packages within the country based on trip duration and other filters
    filtered = filtered.map(country => ({
      ...country,
      operators: country.operators.map(operator => ({
        ...operator,
        packages: operator.packages.filter(pkg => {
          // Duration filter based on trip duration
          let durationMatch = selectedDuration === 'all';
          if (!durationMatch) {
            if (selectedDuration === '7' && pkg.day <= 7) durationMatch = true;
            if (selectedDuration === '30' && pkg.day > 7 && pkg.day <= 30) durationMatch = true;
            if (selectedDuration === '365' && pkg.day > 30) durationMatch = true;
          }

          // If we have trip duration, prioritize packages that cover the trip
          if (tripDuration > 0 && selectedDuration === 'all') {
            durationMatch = pkg.day >= tripDuration;
          }

          const dataMatch = selectedDataAmount === 'all' ||
            (selectedDataAmount === '1' && pkg.amount <= 1024) ||
            (selectedDataAmount === '5' && pkg.amount > 1024 && pkg.amount <= 5120) ||
            (selectedDataAmount === '10' && pkg.amount > 5120 && pkg.amount <= 10240) ||
            (selectedDataAmount === '20' && pkg.amount > 10240);

          return durationMatch && dataMatch;
        })
      }))
    })).filter(country => 
      country.operators.some(operator => operator.packages.length > 0)
    );

    setFilteredCountries(filtered);
  };

  const handleSearchFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCountrySelect = (country: EsimCountry) => {
    setSelectedCountry(country);
    setSearchForm(prev => ({ 
      ...prev, 
      destination: translateCountryName(country.title, language, t)
    }));
    setShowCountryDropdown(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCountry) {
      alert('Por favor selecciona un destino');
      return;
    }
    if (!searchForm.dateRange) {
      alert('Por favor selecciona las fechas de viaje');
      return;
    }
    
    setShowResults(true);
    filterPackages();
  };

  const handleShowAllOptions = () => {
    setShowAllOptions(true);
    setFilteredCountries(countries);
  };

  const handleBackToSearch = () => {
    setShowResults(false);
    setShowAllOptions(false);
    setSelectedCountry(null);
    setSearchForm({ destination: '', dateRange: '' });
    setSelectedDuration('all');
    setSelectedDataAmount('all');
  };

  const formatData = (amount: number) => {
    if (amount >= 1024) {
      return `${(amount / 1024).toFixed(0)} GB`;
    }
    return `${amount} MB`;
  };

  const getDurationText = (days: number) => {
    if (days === 1) return t('esim.duration.day');
    if (days < 30) return `${days} ${t('esim.duration.days')}`;
    if (days === 30) return t('esim.duration.month');
    if (days < 365) return `${Math.round(days / 30)} ${t('esim.duration.months')}`;
    return t('esim.duration.year');
  };

  const handlePurchase = (country: EsimCountry, operator: EsimOperator, pkg: EsimPackage) => {
    setCheckoutModal({
      isOpen: true,
      package: pkg,
      operator: operator,
      country: country
    });
  };

  const handleViewMore = (countrySlug: string) => {
    navigate(`/esim/${countrySlug}`);
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

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#EF5AFF] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#4EBEFF] rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Floating eSIM Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 left-20 text-4xl animate-float opacity-30">📱</div>
          <div className="absolute top-60 right-32 text-3xl animate-float delay-1000 opacity-25">🌐</div>
          <div className="absolute bottom-40 left-32 text-5xl animate-float delay-2000 opacity-20">📶</div>
          <div className="absolute bottom-32 right-20 text-3xl animate-float delay-500 opacity-30">✈️</div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8 animate-fade-in-up">
              <div className="w-20 h-20 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-full flex items-center justify-center mx-auto mb-6">
                <Wifi className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                {t('esim.hero.title')}
                <span className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent"> eSIM</span>
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              {t('esim.hero.description')}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up delay-400">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <Globe className="w-8 h-8 text-[#EF5AFF] mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">200+</div>
                <div className="text-gray-400 text-sm">{t('esim.stats.countries')}</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <Smartphone className="w-8 h-8 text-[#4EBEFF] mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">{t('esim.stats.instant')}</div>
                <div className="text-gray-400 text-sm">{t('esim.stats.activation')}</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <Database className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">5G</div>
                <div className="text-gray-400 text-sm">{t('esim.stats.speed')}</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-gray-400 text-sm">{t('esim.stats.support')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Form Section */}
      {!showResults && !showAllOptions && (
        <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Planifica tu
                  <span className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent"> Conectividad</span>
                </h2>
                <p className="text-xl text-gray-300">
                  Cuéntanos sobre tu viaje y te mostraremos las mejores opciones
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <form onSubmit={handleSearchSubmit} className="space-y-8">
                  {/* Destination Search */}
                  <div className="relative">
                    <label className="block text-white font-semibold mb-3 text-lg">
                      <MapPin className="w-5 h-5 inline mr-2" />
                      ¿A dónde viajas?
                    </label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="destination"
                        value={searchForm.destination}
                        onChange={handleSearchFormChange}
                        onFocus={() => {
                          if (searchForm.destination.trim() && filteredCountriesForSearch.length > 0) {
                            setShowCountryDropdown(true);
                          }
                        }}
                        onBlur={() => {
                          setTimeout(() => setShowCountryDropdown(false), 200);
                        }}
                        className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300 text-lg"
                        placeholder={language === 'es' ? "Busca tu destino..." : "Search your destination..."}
                        required
                      />
                      
                      {/* Country Dropdown */}
                      {showCountryDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-white/20 rounded-xl shadow-2xl max-h-80 overflow-y-auto z-50">
                          {filteredCountriesForSearch.map((country, index) => (
                            <div
                              key={country.slug}
                              onClick={() => handleCountrySelect(country)}
                              className="flex items-center space-x-4 p-4 hover:bg-white/10 cursor-pointer transition-colors duration-200 border-b border-white/10 last:border-b-0"
                            >
                              <img
                                src={country.image.url}
                                alt={translateCountryName(country.title, language, t)}
                                className="w-8 h-8 rounded object-cover"
                              />
                              <div className="flex-1">
                                <div className="text-white font-medium text-lg">
                                  {translateCountryName(country.title, language, t)}
                                </div>
                                {/* Mostrar nombre original si es diferente a la traducción */}
                                {country.title !== translateCountryName(country.title, language, t) && (
                                  <div className="text-gray-500 text-sm">
                                    {country.title}
                                  </div>
                                )}
                                <div className="text-gray-400 text-sm">
                                  {country.operators.length} {language === 'es' ? 'operadores' : 'operators'} • {country.operators.reduce((total, op) => total + op.packages.length, 0)} {language === 'es' ? 'planes' : 'plans'}
                                </div>
                              </div>
                              <div className="text-[#EF5AFF] font-semibold">
                                {language === 'es' ? 'Desde' : 'From'} ${Math.min(...country.operators.flatMap(op => op.packages.map(pkg => pkg.price)))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Travel Dates */}
                  <div>
                    <label className="block text-white font-semibold mb-3 text-lg">
                      <Calendar className="w-5 h-5 inline mr-2" />
                      {language === 'es' ? 'Fechas de viaje' : 'Travel dates'}
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-medium mb-3">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          {language === 'es' ? 'Salida' : 'Departure'}
                        </label>
                          <input
                            type="date"
                            onChange={(e) => {
                              const departureDate = e.target.value;
                              const currentRange = searchForm.dateRange.split(' to ');
                              const returnDate = currentRange[1] || '';
                              
                              if (departureDate && returnDate) {
                                setSearchForm(prev => ({ 
                                  ...prev, 
                                  dateRange: `${departureDate} to ${returnDate}` 
                                }));
                              } else if (departureDate) {
                                setSearchForm(prev => ({ 
                                  ...prev, 
                                  dateRange: departureDate 
                                }));
                              }
                            }}
                            value={searchForm.dateRange.split(' to ')[0] || ''}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-white text-lg focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300 hover:bg-white/15 cursor-pointer
                              [&::-webkit-calendar-picker-indicator]:bg-white/20 [&::-webkit-calendar-picker-indicator]:rounded-lg [&::-webkit-calendar-picker-indicator]:p-2 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:hover:bg-white/30 [&::-webkit-calendar-picker-indicator]:transition-all
                              [&::-webkit-datetime-edit]:text-white [&::-webkit-datetime-edit-fields-wrapper]:text-white [&::-webkit-datetime-edit-text]:text-gray-400 [&::-webkit-datetime-edit-month-field]:text-white [&::-webkit-datetime-edit-day-field]:text-white [&::-webkit-datetime-edit-year-field]:text-white"
                            required
                          />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-3">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          {language === 'es' ? 'Regreso' : 'Return'}
                        </label>
                          <input
                            type="date"
                            onChange={(e) => {
                              const returnDate = e.target.value;
                              const currentRange = searchForm.dateRange.split(' to ');
                              const departureDate = currentRange[0] || '';
                              
                              if (departureDate && returnDate) {
                                setSearchForm(prev => ({ 
                                  ...prev, 
                                  dateRange: `${departureDate} to ${returnDate}` 
                                }));
                              }
                            }}
                            value={searchForm.dateRange.split(' to ')[1] || ''}
                            min={searchForm.dateRange.split(' to ')[0] || new Date().toISOString().split('T')[0]}
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-white text-lg focus:outline-none focus:border-[#4EBEFF] focus:ring-2 focus:ring-[#4EBEFF]/20 transition-all duration-300 hover:bg-white/15 cursor-pointer
                              [&::-webkit-calendar-picker-indicator]:bg-white/20 [&::-webkit-calendar-picker-indicator]:rounded-lg [&::-webkit-calendar-picker-indicator]:p-2 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:hover:bg-white/30 [&::-webkit-calendar-picker-indicator]:transition-all
                              [&::-webkit-datetime-edit]:text-white [&::-webkit-datetime-edit-fields-wrapper]:text-white [&::-webkit-datetime-edit-text]:text-gray-400 [&::-webkit-datetime-edit-month-field]:text-white [&::-webkit-datetime-edit-day-field]:text-white [&::-webkit-datetime-edit-year-field]:text-white"
                            required
                          />
                      </div>
                    </div>
                  </div>

                  {/* Trip Duration Display */}
                  {searchForm.dateRange && searchForm.dateRange.includes(' to ') && (
                    <div className="bg-gradient-to-r from-[#EF5AFF]/10 to-[#4EBEFF]/10 rounded-xl p-4 border border-[#EF5AFF]/20">
                      <div className="text-center">
                        <div className="text-white font-semibold text-lg">
                          {language === 'es' ? 'Duración del viaje:' : 'Trip duration:'} {calculateTripDuration()} {language === 'es' ? 'días' : 'days'}
                        </div>
                        <div className="text-gray-300 text-sm mt-1">
                          {language === 'es' ? 'Te mostraremos planes que cubran toda tu estadía' : 'We\'ll show you plans that cover your entire stay'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Search Button */}
                  <div className="text-center">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white px-12 py-4 rounded-full text-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-3 mx-auto"
                    >
                      <Search className="w-6 h-6" />
                      <span>{language === 'es' ? 'Buscar Planes eSIM' : 'Search eSIM Plans'}</span>
                      <ArrowRight className="w-6 h-6" />
                    </button>
                  </div>
                </form>

                {/* Browse All Options */}
                <div className="mt-8 pt-8 border-t border-white/10 text-center">
                  <p className="text-gray-300 mb-4">
                    {language === 'es' ? '¿Prefieres explorar todas las opciones?' : 'Prefer to explore all options?'}
                  </p>
                  <button
                    onClick={handleShowAllOptions}
                    className="text-[#4EBEFF] hover:text-[#EF5AFF] font-semibold transition-colors duration-300 flex items-center space-x-2 mx-auto"
                  >
                    <Globe className="w-5 h-5" />
                    <span>{language === 'es' ? 'Ver todos los países y planes' : 'View all countries and plans'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      {(showResults || showAllOptions) && (
        <>
          {/* Filters Section */}
          <section className="py-8 bg-gray-800 sticky top-20 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleBackToSearch}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    <span>{language === 'es' ? 'Nueva Búsqueda' : 'New Search'}</span>
                  </button>
                  
                  {showResults && selectedCountry && (
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedCountry.image.url}
                        alt={translateCountryName(selectedCountry.title, language, t)}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <div>
                        <div className="text-white font-semibold">
                          {translateCountryName(selectedCountry.title, language, t)}
                        </div>
                        <div className="text-gray-400 text-sm">
                         {calculateTripDuration() > 0 && `${calculateTripDuration()} ${language === 'es' ? 'días de viaje' : 'days trip'}`}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {/* Duration Filter */}
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <select
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4EBEFF] focus:ring-2 focus:ring-[#4EBEFF]/20 transition-all duration-300"
                    >
                      <option value="all" className="bg-gray-800">{t('esim.filter.all_durations')}</option>
                      <option value="7" className="bg-gray-800">{t('esim.filter.week')}</option>
                      <option value="30" className="bg-gray-800">{t('esim.filter.month')}</option>
                      <option value="365" className="bg-gray-800">{t('esim.filter.year')}</option>
                    </select>
                  </div>

                  {/* Data Amount Filter */}
                  <div className="flex items-center space-x-2">
                    <Database className="w-5 h-5 text-gray-400" />
                    <select
                      value={selectedDataAmount}
                      onChange={(e) => setSelectedDataAmount(e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4EBEFF] focus:ring-2 focus:ring-[#4EBEFF]/20 transition-all duration-300"
                    >
                      <option value="all" className="bg-gray-800">{t('esim.filter.all_data')}</option>
                      <option value="1" className="bg-gray-800">≤ 1GB</option>
                      <option value="5" className="bg-gray-800">1GB - 5GB</option>
                      <option value="10" className="bg-gray-800">5GB - 10GB</option>
                      <option value="20" className="bg-gray-800">10GB+</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Countries Grid */}
          <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {filteredCountries.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{t('esim.no_results.title')}</h3>
                  <p className="text-gray-400">{t('esim.no_results.description')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCountries.map((country, index) => (
                    <div
                      key={country.slug}
                      className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Country Header */}
                      <div className="flex items-center space-x-4 mb-6">
                        <img
                          src={country.image.url}
                          alt={translateCountryName(country.title, language, t)}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="text-xl font-bold text-white">{translateCountryName(country.title, language, t)}</h3>
                          <p className="text-gray-400 text-sm">{country.operators.length} {t('esim.operators')}</p>
                        </div>
                      </div>

                      {/* Operators */}
                      <div className="space-y-4">
                        {country.operators.slice(0, 1).map((operator) => (
                          <div key={operator.id} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-white">{operator.title}</h4>
                              <span className="text-xs bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white px-2 py-1 rounded-full">
                                {operator.plan_type === 'data' ? t('esim.data_only') : t('esim.data_voice_text')}
                              </span>
                            </div>

                            {/* Networks */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {operator.coverages[0]?.networks.map((network, idx) => (
                                <span key={idx} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded">
                                  {network.name} {network.types.join('/')}
                                </span>
                              ))}
                            </div>

                            {/* Packages */}
                            <div className="space-y-2">
                              {operator.packages.slice(0, 3).map((pkg) => (
                                <div key={pkg.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                                  <div>
                                    <div className="font-medium text-white">{pkg.data}</div>
                                    <div className="text-sm text-gray-400">
                                      {getDurationText(pkg.day)}
                                      {pkg.voice && ` • ${pkg.voice} ${t('esim.minutes')}`}
                                      {pkg.text && ` • ${pkg.text} SMS`}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-lg font-bold text-[#4EBEFF]">${pkg.price}</div>
                                    <button
                                      onClick={() => handlePurchase(country, operator, pkg)}
                                      className="text-xs bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white px-3 py-1 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-1"
                                    >
                                      <ShoppingCart className="w-3 h-3" />
                                      <span>{t('esim.buy')}</span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                              
                              {country.operators.reduce((total, op) => total + op.packages.length, 0) > 3 && (
                                <div className="pt-4 border-t border-white/10">
                                  <button
                                    onClick={() => handleViewMore(country.slug)}
                                    className="w-full bg-gradient-to-r from-[#EF5AFF]/20 to-[#4EBEFF]/20 hover:from-[#EF5AFF]/30 hover:to-[#4EBEFF]/30 text-[#4EBEFF] py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 border border-[#4EBEFF]/30"
                                  >
                                    <span>
                                      {language === 'es' 
                                        ? `Ver todos los planes de ${translateCountryName(country.title, language, t)}`
                                        : `View all plans for ${translateCountryName(country.title, language, t)}`
                                      }
                                    </span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

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

export default EsimPage;