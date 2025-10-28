import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Car, Clock, ChevronDown, Loader, DollarSign, AlertCircle, 
  Sparkles, Navigation, Users, X, Calendar, Clock as ClockIcon, 
  Thermometer, Music, Luggage, User, Mail, Phone
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { rideService, PredefinedRoute } from '../services/rideService';

const VEHICLE_TYPES = [
  {
    id: 'NORMAL',
    name: { es: 'Normal', en: 'Normal' },
    description: { es: 'Vehículo estándar cómodo', en: 'Comfortable standard vehicle' },
    capacity: '4 pasajeros',
    icon: '🚗',
    gradient: 'from-blue-500 to-cyan-500',
    color: 'blue',
    apiType: 'standard'
  },
  {
    id: 'MINIVAN',
    name: { es: 'Minivan', en: 'Minivan' },
    description: { es: 'Ideal para grupos', en: 'Ideal for groups' },
    capacity: '6-8 pasajeros',
    icon: '🚐',
    gradient: 'from-green-500 to-emerald-500',
    color: 'green',
    apiType: 'premium'
  },
  {
    id: 'LUXURY',
    name: { es: 'Luxury', en: 'Luxury' },
    description: { es: 'Máximo confort y estilo', en: 'Maximum comfort and style' },
    capacity: '4 pasajeros',
    icon: '🚙',
    gradient: 'from-purple-500 to-pink-500',
    color: 'purple',
    apiType: 'luxury'
  },
];

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  isNowTrip: boolean;
  dateTrip: string;
  hourTrip: string;
  temperature: string;
  bags: string;
  musicActive: boolean;
}

interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

interface TripRequestData {
  origin: string;
  destination: string;
  typeTrip: string;
  fare: number;
  customerTripInfo: {
    name: string;
    email: string;
    phone: string;
    isNowTrip: boolean;
    dateTrip?: string;
    hourTrip?: string;
    temperature?: string;
    bags?: number;
    musicActive?: boolean;
  };
  pickupLocation: LocationCoordinates;
  dropoffLocation: LocationCoordinates;
}

export default function RequestRidePage() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [routes, setRoutes] = useState<PredefinedRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    vehicleType: '',
  });
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [fareInfo, setFareInfo] = useState<{ fare: number; estimatedTime: number } | null>(null);
  const [availableDestinations, setAvailableDestinations] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tripSuccess, setTripSuccess] = useState<{
    tripId: string;
    requestId: string;
    driversNotified: number;
  } | null>(null);
  
  const formRef = useRef<HTMLDivElement>(null);
  const vehicleRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    email: '',
    phone: '',
    isNowTrip: true,
    dateTrip: '',
    hourTrip: '',
    temperature: '22',
    bags: '0',
    musicActive: false
  });

  useEffect(() => {
    loadRoutes();
  }, []);

  useEffect(() => {
    if (formData.from && formData.to && formData.vehicleType) {
      loadFare();
    } else {
      setFareInfo(null);
    }
  }, [formData.from, formData.to, formData.vehicleType]);

  useEffect(() => {
    if (formData.from) {
      const route = routes.find(r => r.origin === formData.from);
      if (route) {
        const destinations = route.destinations.map(d => d.name);
        setAvailableDestinations(destinations);
      } else {
        setAvailableDestinations([]);
      }
    } else {
      setAvailableDestinations([]);
    }
  }, [formData.from, routes]);

  // Cerrar modal al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const data: any = await rideService.getAllRoutes();
      
      if (Array.isArray(data.data)) {
        setRoutes(data.data);
      } else {
        console.error('Expected array but got:', typeof data, data);
        setRoutes([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error loading routes:', err);
      setError(language === 'es' ? 'Error al cargar rutas disponibles' : 'Error loading available routes');
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFare = async () => {
    try {
      setIsAnimating(true);
      const data = await rideService.getFare(formData.from, formData.to, formData.vehicleType);
      setFareInfo(data);
      
      setTimeout(() => setIsAnimating(false), 500);
    } catch (err) {
      console.error('Error loading fare:', err);
      setFareInfo(null);
      setIsAnimating(false);
    }
  };

const handleFormSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!isFormValid) return;

  // Validar que al menos email o teléfono estén presentes
  if (!customerDetails.email && !customerDetails.phone) {
    setError(language === 'es' 
      ? 'Por favor ingresa al menos un email o número de teléfono' 
      : 'Please enter at least an email or phone number'
    );
    return;
  }

  // Validar que si no es viaje ahora, tenga fecha y hora
  if (!customerDetails.isNowTrip && (!customerDetails.dateTrip || !customerDetails.hourTrip)) {
    setError(language === 'es' 
      ? 'Por favor ingresa la fecha y hora para el viaje programado' 
      : 'Please enter date and time for the scheduled trip'
    );
    return;
  }

  try {
    setSubmitting(true);
    setError(null);

    // Obtener coordenadas para origen y destino
    const pickupLocation = {
      latitude: 0.0,
      longitude: 0.0
    };
    const dropoffLocation = {
      latitude: 0.0,
      longitude: 0.0
    };

    const selectedVehicle = VEHICLE_TYPES.find(v => v.id === formData.vehicleType);
    
    // Obtener el precio del viaje seleccionado
    const selectedVehiclePrice = formData.from && formData.to && Array.isArray(routes) ?
      routes.find(r => r.origin === formData.from)
        ?.destinations.find(d => d.name === formData.to)
        ?.prices.find(p => p.vehicleType === formData.vehicleType) : null;

    // Preparar datos según la documentación de la API
    const tripRequestData: any = {
      origin: formData.from,
      destination: formData.to,
      typeTrip: selectedVehicle?.apiType || 'standard',
      fare: selectedVehiclePrice?.price || fareInfo?.fare || 0,
      customerTripInfo: {
        name: customerDetails.name,
        email: customerDetails.email,
        phone: customerDetails.phone,
        isNowTrip: customerDetails.isNowTrip,
        temperature: `${customerDetails.temperature}°C`,
        bags: parseInt(customerDetails.bags),
        musicActive: customerDetails.musicActive
      },
      pickupLocation,
      dropoffLocation
    };

    // Si es un viaje programado, agregar fecha y hora
    if (!customerDetails.isNowTrip) {
      tripRequestData.customerTripInfo.dateTrip = customerDetails.dateTrip;
      tripRequestData.customerTripInfo.hourTrip = customerDetails.hourTrip;
    }

    // Llamar al servicio para crear la solicitud de viaje
    const response = await rideService.requestTrip(tripRequestData);

    if (response.success) {
      // Preparar datos para la pantalla de seguimiento
  const tripDetails = {
    origin: formData.from,
    destination: formData.to,
    vehicleType: selectedVehicle?.name[language] || '',
    fare: selectedVehiclePrice?.price || fareInfo?.fare || 0,
    customerName: customerDetails.name,
    scheduledTime: !customerDetails.isNowTrip ? 
      `${customerDetails.dateTrip} ${customerDetails.hourTrip}` : undefined
  };

  // Guardar en localStorage para que la nueva pestaña pueda acceder
  localStorage.setItem(`trip_${response.data.requestId}`, JSON.stringify(tripDetails));

  // Abrir nueva pestaña con la pantalla de seguimiento usando el requestId en la URL
  const tripStatusUrl = `/trip-status/${response.data.requestId}`;
  window.open(tripStatusUrl, '_blank');

      setTripSuccess({
        tripId: response.data.tripId,
        requestId: response.data.requestId,
        driversNotified: response.data.driversNotified
      });

      // Animación de éxito
      if (formRef.current) {
        formRef.current.classList.add('animate-pulse');
        setTimeout(() => {
          if (formRef.current) {
            formRef.current.classList.remove('animate-pulse');
          }
        }, 1000);
      }

      // Reset form
      setFormData({ from: '', to: '', vehicleType: '' });
      setFareInfo(null);
      setShowModal(false);
      
      // Reset customer details
      setCustomerDetails({
        name: '',
        email: '',
        phone: '',
        isNowTrip: true,
        dateTrip: '',
        hourTrip: '',
        temperature: '22',
        bags: '0',
        musicActive: false
      });

      // Mostrar mensaje de éxito
      setTimeout(() => {
        setTripSuccess(null);
      }, 5000);
    }
  } catch (err: any) {
    console.error('Error requesting trip:', err);
    const errorMessage = err.response?.data?.message || (language === 'es'
      ? 'Error al solicitar el viaje. Por favor intenta de nuevo.'
      : 'Error requesting ride. Please try again.');
    setError(errorMessage);
  } finally {
    setSubmitting(false);
  }
};

  const handleConfirmClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setShowModal(true);
    setError(null);
  };

  const selectLocation = (field: 'from' | 'to', location: string) => {
    setFormData({ ...formData, [field]: location });
    if (field === 'from') {
      setShowFromDropdown(false);
      setFormData({ ...formData, from: location, to: '' });
    }
    if (field === 'to') setShowToDropdown(false);
  };

  const selectVehicle = (vehicleId: string, index: number) => {
    setFormData({ ...formData, vehicleType: vehicleId });
    
    const button = vehicleRefs.current[index];
    if (button) {
      button.classList.add('animate-bounce');
      setTimeout(() => {
        button.classList.remove('animate-bounce');
      }, 300);
    }
  };

  const handleCustomerDetailChange = (field: keyof CustomerDetails, value: any) => {
    setCustomerDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScheduleTypeChange = (isNow: boolean) => {
    setCustomerDetails(prev => ({
      ...prev,
      isNowTrip: isNow,
      dateTrip: isNow ? '' : prev.dateTrip,
      hourTrip: isNow ? '' : prev.hourTrip
    }));
  };

  const origins = Array.isArray(routes) ? Array.from(new Set(routes.map(r => r.origin))) : [];
  const destinations = formData.from ? availableDestinations : [];
  const isFormValid = formData.from && formData.to && formData.vehicleType;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
              <Sparkles className="w-8 h-8 text-yellow-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <p className="text-white text-xl mt-4 animate-pulse">{t('ride.loading')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 overflow-hidden">
      {/* Background Animations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Header />

      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Mensaje de éxito */}
          {tripSuccess && (
            <div className="mb-8 bg-green-500/20 backdrop-blur-lg border border-green-500/50 rounded-2xl p-6 animate-slide-down">
              <div className="flex items-center justify-between text-green-200">
                <div className="flex items-center">
                  <Sparkles className="w-6 h-6 mr-3 flex-shrink-0 animate-pulse" />
                  <div>
                    <div className="font-medium text-lg">
                      {language === 'es' ? '¡Viaje solicitado exitosamente!' : 'Ride requested successfully!'}
                    </div>
                    <div className="text-sm opacity-80 mt-1">
                      {language === 'es' 
                        ? `Código: ${tripSuccess.requestId}. ${tripSuccess.driversNotified} conductores notificados.`
                        : `Code: ${tripSuccess.requestId}. ${tripSuccess.driversNotified} drivers notified.`
                      }
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setTripSuccess(null)}
                  className="p-1 hover:bg-green-500/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-3 border border-white/20 mb-6 animate-fade-in">
              <Sparkles className="w-5 h-5 text-yellow-400 animate-spin" />
              <span className="text-white font-semibold">
                {language === 'es' ? 'Viaja con estilo' : 'Ride in style'}
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {language === 'es' ? (
                <>
                  Solicita tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 animate-gradient">Viaje</span>
                </>
              ) : (
                <>
                  Request Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 animate-gradient">Ride</span>
                </>
              )}
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {t('ride.subtitle')}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 bg-red-500/20 backdrop-blur-lg border border-red-500/50 rounded-2xl p-6 animate-shake">
              <div className="flex items-center text-red-200">
                <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0 animate-pulse" />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Main Form */}
          <div 
            ref={formRef}
            className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden animate-slide-up"
          >
            {/* Form Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-400/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl"></div>

            <form onSubmit={handleConfirmClick} className="space-y-8 relative z-10">
              {/* Location Inputs */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* From Input */}
                <div className="relative group">
                  <label className="block text-white text-sm font-semibold mb-3 ml-1">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-500/20 rounded-lg">
                        <Navigation className="w-4 h-4 text-blue-400" />
                      </div>
                      {t('ride.from')}
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.from}
                      onChange={(e) => {
                        setFormData({ ...formData, from: e.target.value, to: '' });
                        setShowFromDropdown(true);
                      }}
                      onFocus={() => setShowFromDropdown(true)}
                      onBlur={() => setTimeout(() => setShowFromDropdown(false), 200)}
                      placeholder={t('ride.from.placeholder')}
                      className="w-full px-5 py-4 bg-white/15 border-2 border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-lg group-hover:border-white/30"
                    />
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform duration-300 group-hover:scale-110" />

                    {showFromDropdown && origins.length > 0 && (
                      <div className="absolute z-20 w-full mt-3 bg-gray-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 max-h-60 overflow-y-auto animate-dropdown">
                        {origins
                          .filter(loc => loc.toLowerCase().includes(formData.from.toLowerCase()))
                          .map((location, index) => (
                            <button
                              key={location}
                              type="button"
                              onClick={() => selectLocation('from', location)}
                              className="w-full px-5 py-4 text-left hover:bg-white/10 transition-all duration-200 border-b border-white/10 last:border-0 group/item"
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <div className="flex items-center gap-3 text-white">
                                <div className="p-2 bg-blue-500/20 rounded-lg group-hover/item:bg-blue-500/30 transition-colors">
                                  <MapPin className="w-4 h-4 text-blue-400" />
                                </div>
                                <span className="font-medium">{location}</span>
                              </div>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* To Input */}
                <div className="relative group">
                  <label className="block text-white text-sm font-semibold mb-3 ml-1">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-green-500/20 rounded-lg">
                        <MapPin className="w-4 h-4 text-green-400" />
                      </div>
                      {t('ride.to')}
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.to}
                      onChange={(e) => {
                        setFormData({ ...formData, to: e.target.value });
                        setShowToDropdown(true);
                      }}
                      onFocus={() => setShowToDropdown(true)}
                      onBlur={() => setTimeout(() => setShowToDropdown(false), 200)}
                      placeholder={t('ride.to.placeholder')}
                      disabled={!formData.from}
                      className="w-full px-5 py-4 bg-white/15 border-2 border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-lg group-hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform duration-300 group-hover:scale-110" />

                    {showToDropdown && destinations.length > 0 && (
                      <div className="absolute z-20 w-full mt-3 bg-gray-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 max-h-60 overflow-y-auto animate-dropdown">
                        {destinations
                          .filter(loc => loc.toLowerCase().includes(formData.to.toLowerCase()))
                          .map((location, index) => (
                            <button
                              key={location}
                              type="button"
                              onClick={() => selectLocation('to', location)}
                              className="w-full px-5 py-4 text-left hover:bg-white/10 transition-all duration-200 border-b border-white/10 last:border-0 group/item"
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <div className="flex items-center gap-3 text-white">
                                <div className="p-2 bg-green-500/20 rounded-lg group-hover/item:bg-green-500/30 transition-colors">
                                  <MapPin className="w-4 h-4 text-green-400" />
                                </div>
                                <span className="font-medium">{location}</span>
                              </div>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Vehicle Selection */}
              <div className="space-y-6">
                <label className="block text-white text-sm font-semibold mb-2 ml-1">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-purple-500/20 rounded-lg">
                      <Car className="w-4 h-4 text-purple-400" />
                    </div>
                    {t('ride.vehicle')}
                  </div>
                </label>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {VEHICLE_TYPES.map((vehicle, index) => {
                    const vehiclePrice = formData.from && formData.to && Array.isArray(routes) ?
                      routes.find(r => r.origin === formData.from)
                        ?.destinations.find(d => d.name === formData.to)
                        ?.prices.find(p => p.vehicleType === vehicle.id) : null;

                    const isSelected = formData.vehicleType === vehicle.id;
                    const isAvailable = formData.from && formData.to && vehiclePrice;

                    return (
                      <button
                        key={vehicle.id}
                        ref={el => vehicleRefs.current[index] = el}
                        type="button"
                        onClick={() => selectVehicle(vehicle.id, index)}
                        disabled={!isAvailable}
                        className={`relative p-6 rounded-2xl border-2 transition-all duration-500 transform overflow-hidden group ${
                          isSelected
                            ? `bg-gradient-to-br ${vehicle.gradient} border-transparent text-white scale-105 shadow-2xl`
                            : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:scale-105'
                        } ${
                          !isAvailable ? 'opacity-40 cursor-not-allowed hover:scale-100' : ''
                        }`}
                      >
                        {/* Background Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                          isSelected ? 'opacity-100' : ''
                        }`}></div>
                        
                        <div className="relative z-10">
                          <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                            {vehicle.icon}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="font-bold text-lg">{vehicle.name[language]}</div>
                            <div className="text-sm opacity-90 leading-relaxed">
                              {vehicle.description[language]}
                            </div>
                            <div className="flex items-center gap-1 text-xs opacity-70">
                              <Users className="w-3 h-3" />
                              {vehicle.capacity}
                            </div>
                          </div>

                          {vehiclePrice && (
                            <div className={`mt-4 font-bold text-2xl transform group-hover:scale-110 transition-transform duration-300 ${
                              isSelected ? 'text-white' : 'text-yellow-400'
                            }`}>
                              ${vehiclePrice.price}
                            </div>
                          )}
                        </div>

                        {/* Selection Indicator */}
                        {isSelected && (
                          <div className="absolute top-3 right-3">
                            <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                            <div className="w-3 h-3 bg-white rounded-full absolute top-0"></div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>


              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-5 rounded-2xl font-bold text-lg transition-all duration-500 transform relative overflow-hidden group ${
                  isFormValid
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 shadow-2xl shadow-yellow-400/25 hover:shadow-3xl hover:shadow-yellow-400/40 hover:scale-105'
                    : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                }`}
              >
                {/* Button Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  {t('ride.confirm')}
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modal de Confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-fade-in">
          <div 
            ref={modalRef}
            className="bg-gray-900/95 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modal-in"
          >
            <div className="p-8">
              {/* Header del Modal */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    {language === 'es' ? 'Confirmar Viaje' : 'Confirm Ride'}
                  </h2>
                  <p className="text-gray-300 mt-2">
                    {language === 'es' 
                      ? 'Completa tus datos para solicitar el viaje' 
                      : 'Complete your details to request the ride'}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Resumen del Viaje */}
              <div className="bg-white/10 rounded-2xl p-6 mb-8 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  {language === 'es' ? 'Resumen del Viaje' : 'Trip Summary'}
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-white">
                      <Navigation className="w-4 h-4 text-blue-400" />
                      <span className="font-medium">{formData.from}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span className="font-medium">{formData.to}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-white">
                      <Car className="w-4 h-4 text-purple-400" />
                      <span className="font-medium">
                        {VEHICLE_TYPES.find(v => v.id === formData.vehicleType)?.name[language]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulario de Datos del Cliente */}
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Información Básica */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-400" />
                        {language === 'es' ? 'Nombre completo *' : 'Full name *'}
                      </div>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerDetails.name}
                      onChange={(e) => handleCustomerDetailChange('name', e.target.value)}
                      className="w-full px-4 py-3 bg-white/15 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-all"
                      placeholder={language === 'es' ? 'Tu nombre completo' : 'Your full name'}
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-green-400" />
                        {language === 'es' ? 'Email' : 'Email'}
                      </div>
                    </label>
                    <input
                      type="email"
                      value={customerDetails.email}
                      onChange={(e) => handleCustomerDetailChange('email', e.target.value)}
                      className="w-full px-4 py-3 bg-white/15 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-all"
                      placeholder="email@ejemplo.com"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-purple-400" />
                        {language === 'es' ? 'Teléfono' : 'Phone'}
                      </div>
                    </label>
                    <input
                      type="tel"
                      value={customerDetails.phone}
                      onChange={(e) => handleCustomerDetailChange('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-white/15 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-all"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>

                {/* Programación del Viaje */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-4">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-yellow-400" />
                      {language === 'es' ? '¿Cuándo deseas el viaje?' : 'When do you want the ride?'}
                    </div>
                  </label>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <button
                      type="button"
                      onClick={() => handleScheduleTypeChange(true)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        customerDetails.isNowTrip
                          ? 'bg-yellow-400 border-yellow-400 text-gray-900'
                          : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                      }`}
                    >
                      <ClockIcon className="w-5 h-5 inline mr-2" />
                      {language === 'es' ? 'Ahora mismo' : 'Right now'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScheduleTypeChange(false)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        !customerDetails.isNowTrip
                          ? 'bg-yellow-400 border-yellow-400 text-gray-900'
                          : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                      }`}
                    >
                      <Calendar className="w-5 h-5 inline mr-2" />
                      {language === 'es' ? 'Programar' : 'Schedule'}
                    </button>
                  </div>

                  {!customerDetails.isNowTrip && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white text-sm font-semibold mb-2">
                          {language === 'es' ? 'Fecha' : 'Date'}
                        </label>
                        <input
                          type="date"
                          required
                          value={customerDetails.dateTrip}
                          onChange={(e) => handleCustomerDetailChange('dateTrip', e.target.value)}
                          className="w-full px-4 py-3 bg-white/15 border border-white/20 rounded-xl text-white focus:outline-none focus:border-yellow-400 transition-all"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-white text-sm font-semibold mb-2">
                          {language === 'es' ? 'Hora' : 'Time'}
                        </label>
                        <input
                          type="time"
                          required
                          value={customerDetails.hourTrip}
                          onChange={(e) => handleCustomerDetailChange('hourTrip', e.target.value)}
                          className="w-full px-4 py-3 bg-white/15 border border-white/20 rounded-xl text-white focus:outline-none focus:border-yellow-400 transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Preferencias Opcionales */}
                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {language === 'es' ? 'Preferencias opcionales' : 'Optional Preferences'}
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Temperatura */}
                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">
                        <div className="flex items-center gap-2">
                          <Thermometer className="w-4 h-4 text-blue-400" />
                          {language === 'es' ? 'Temperatura (°C)' : 'Temperature (°C)'}
                        </div>
                      </label>
                      <select
                        value={customerDetails.temperature}
                        onChange={(e) => handleCustomerDetailChange('temperature', e.target.value)}
                        className="w-full px-4 py-3 bg-white/15 border border-white/20 rounded-xl text-white focus:outline-none focus:border-yellow-400 transition-all"
                      >
                        {Array.from({ length: 16 }, (_, i) => i + 18).map(temp => (
                          <option key={temp} value={temp.toString()}>
                            {temp}°C
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Maletas */}
                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">
                        <div className="flex items-center gap-2">
                          <Luggage className="w-4 h-4 text-green-400" />
                          {language === 'es' ? 'Maletas' : 'Luggage'}
                        </div>
                      </label>
                      <select
                        value={customerDetails.bags}
                        onChange={(e) => handleCustomerDetailChange('bags', e.target.value)}
                        className="w-full px-4 py-3 bg-white/15 border border-white/20 rounded-xl text-white focus:outline-none focus:border-yellow-400 transition-all"
                      >
                        {Array.from({ length: 6 }, (_, i) => i).map(count => (
                          <option key={count} value={count.toString()}>
                            {count} {language === 'es' ? 'maletas' : 'bags'}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Música */}
                    <div className="flex items-end">
                      <label className="flex items-center gap-3 p-3 bg-white/10 rounded-xl border border-white/20 hover:bg-white/15 transition-colors cursor-pointer w-full">
                        <input
                          type="checkbox"
                          checked={customerDetails.musicActive}
                          onChange={(e) => handleCustomerDetailChange('musicActive', e.target.checked)}
                          className="hidden"
                        />
                        <div className={`w-6 h-6 rounded border-2 transition-all duration-300 flex items-center justify-center ${
                          customerDetails.musicActive 
                            ? 'bg-yellow-400 border-yellow-400' 
                            : 'border-white/30'
                        }`}>
                          {customerDetails.musicActive && (
                            <span className="text-gray-900 text-sm">✓</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-white">
                          <Music className="w-4 h-4 text-purple-400" />
                          <span>{language === 'es' ? 'Música en el viaje' : 'Music during ride'}</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex gap-4 pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 px-6 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
                  >
                    {language === 'es' ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !customerDetails.name || (!customerDetails.email && !customerDetails.phone)}
                    className="flex-1 py-4 px-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        {language === 'es' ? 'Solicitando...' : 'Requesting...'}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        {language === 'es' ? 'Confirmar Viaje' : 'Confirm Ride'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes dropdown {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes modal-in {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }

        .animate-dropdown {
          animation: dropdown 0.3s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-modal-in {
          animation: modal-in 0.3s ease-out;
        }

        .vehicle-item {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}