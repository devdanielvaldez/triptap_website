import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, MapPin, Car, User, Star, Phone, Navigation, 
  CheckCircle, XCircle, Loader, AlertCircle, RefreshCw,
  Calendar, DollarSign, Thermometer, Music, Luggage
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { rideService } from '../services/rideService';

interface TripStatus {
  tripId: string;
  requestId: string;
  status: string;
  initiatedAt: string;
  pickupLocation: {
    latitude: number;
    longitude: number;
  };
  dropoffLocation: {
    latitude: number;
    longitude: number;
  };
  driver?: {
    id: string;
    name: string;
    vehicle: {
      brand: string;
      model: string;
      color: string;
      plateNumber: string;
    };
    currentLocation: {
      latitude: number;
      longitude: number;
    };
    photo: string;
    rating: number;
  };
  estimatedArrival: string;
}

interface TripDetails {
  origin: string;
  destination: string;
  vehicleType: string;
  fare: number;
  customerName: string;
  scheduledTime?: string;
}

const STATUS_CONFIG = {
  REQUESTED: {
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/20',
    borderColor: 'border-yellow-400',
    icon: Loader,
    message: { es: 'Buscando conductor', en: 'Looking for driver' },
    description: { 
      es: 'Estamos buscando el conductor perfecto para tu viaje', 
      en: 'We are finding the perfect driver for your ride' 
    }
  },
  ACCEPTED: {
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/20',
    borderColor: 'border-blue-400',
    icon: CheckCircle,
    message: { es: 'Conductor asignado', en: 'Driver assigned' },
    description: { 
      es: 'Un conductor ha aceptado tu viaje', 
      en: 'A driver has accepted your ride' 
    }
  },
  IN_ROUTE: {
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/20',
    borderColor: 'border-purple-400',
    icon: Car,
    message: { es: 'Conductor en camino', en: 'Driver on the way' },
    description: { 
      es: 'El conductor se dirige a tu ubicación', 
      en: 'The driver is heading to your location' 
    }
  },
  ARRIVED_AT_PICKUP: {
    color: 'text-green-400',
    bgColor: 'bg-green-400/20',
    borderColor: 'border-green-400',
    icon: MapPin,
    message: { es: 'Conductor ha llegado', en: 'Driver has arrived' },
    description: { 
      es: 'El conductor está esperando en el punto de recogida', 
      en: 'The driver is waiting at the pickup point' 
    }
  },
  IN_PROGRESS: {
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-400/20',
    borderColor: 'border-indigo-400',
    icon: Navigation,
    message: { es: 'Viaje en progreso', en: 'Trip in progress' },
    description: { 
      es: 'Estás en camino a tu destino', 
      en: 'You are on the way to your destination' 
    }
  },
  COMPLETED: {
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/20',
    borderColor: 'border-emerald-400',
    icon: CheckCircle,
    message: { es: 'Viaje completado', en: 'Trip completed' },
    description: { 
      es: '¡Has llegado a tu destino!', 
      en: 'You have arrived at your destination!' 
    }
  },
  CANCELLED: {
    color: 'text-red-400',
    bgColor: 'bg-red-400/20',
    borderColor: 'border-red-400',
    icon: XCircle,
    message: { es: 'Viaje cancelado', en: 'Trip cancelled' },
    description: { 
      es: 'El viaje ha sido cancelado', 
      en: 'The trip has been cancelled' 
    }
  }
};

const STATUS_FLOW = [
  'REQUESTED',
  'ACCEPTED', 
  'IN_ROUTE',
  'ARRIVED_AT_PICKUP',
  'IN_PROGRESS',
  'COMPLETED'
];

export default function TripStatusPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const [tripStatus, setTripStatus] = useState<TripStatus | null>(null);
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (!requestId) {
      setError(language === 'es' ? 'No se encontró el ID del viaje' : 'Trip ID not found');
      setLoading(false);
      return;
    }

    loadTripStatus();
    
    // Configurar intervalo para actualizar cada 5 segundos
    const interval = setInterval(loadTripStatus, 5000);
    
    return () => clearInterval(interval);
  }, [requestId, language]);

  const loadTripStatus = async () => {
    if (!requestId) return;

    try {
      const response = await rideService.getTripStatus(requestId);
      
      if (response.success) {
        setTripStatus(response.data);
        setLastUpdated(new Date());
        setError(null);

        // Si es la primera carga, intentar obtener detalles adicionales del localStorage
        if (!tripDetails) {
          const storedTripData = localStorage.getItem(`trip_${requestId}`);
          if (storedTripData) {
            setTripDetails(JSON.parse(storedTripData));
          }
        }
      } else {
        setError(response.message || (language === 'es' ? 'Error al cargar el estado del viaje' : 'Error loading trip status'));
      }
    } catch (err: any) {
      console.error('Error loading trip status:', err);
      setError(err.response?.data?.message || (language === 'es' ? 'Error de conexión' : 'Connection error'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status: string) => {
    return STATUS_FLOW.indexOf(status);
  };

  const getCurrentStatusIndex = () => {
    if (!tripStatus) return -1;
    return getStatusIndex(tripStatus.status);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(language === 'es' ? 'es-ES' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader className="w-16 h-16 text-yellow-400 animate-spin mx-auto mb-4" />
            <p className="text-white text-xl">
              {language === 'es' ? 'Cargando estado del viaje...' : 'Loading trip status...'}
            </p>
            {/* <p className="text-gray-400 mt-2">ID: {requestId}</p> */}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-2xl mx-auto text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              {language === 'es' ? 'Error' : 'Error'}
            </h2>
            <p className="text-gray-300 mb-4">{error}</p>
            {/* <p className="text-gray-400 text-sm mb-8">ID: {requestId}</p> */}
            <button
              onClick={() => navigate('/request-ride')}
              className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition-colors"
            >
              {language === 'es' ? 'Solicitar nuevo viaje' : 'Request new ride'}
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentStatus = tripStatus?.status || 'REQUESTED';
  const statusConfig = STATUS_CONFIG[currentStatus as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.REQUESTED;
  const StatusIcon = statusConfig.icon;
  const currentStepIndex = getCurrentStatusIndex();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {language === 'es' ? 'Seguimiento de Viaje' : 'Trip Tracking'}
            </h1>
            <p className="text-xl text-gray-300">
              {language === 'es' ? 'Monitorea tu viaje en tiempo real' : 'Monitor your ride in real time'}
            </p>
            {/* <p className="text-gray-400 text-sm mt-2">ID: {requestId}</p> */}
          </div>

          {/* Trip Information Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Trip Details */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {language === 'es' ? 'Detalles del Viaje' : 'Trip Details'}
                </h3>
                
                <div className="space-y-4">
                  {tripDetails?.origin && (
                    <div className="flex items-center gap-3 text-white">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="text-sm text-gray-400">
                          {language === 'es' ? 'Origen' : 'Origin'}
                        </div>
                        <div className="font-semibold">{tripDetails.origin}</div>
                      </div>
                    </div>
                  )}

                  {tripDetails?.destination && (
                    <div className="flex items-center gap-3 text-white">
                      <MapPin className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="text-sm text-gray-400">
                          {language === 'es' ? 'Destino' : 'Destination'}
                        </div>
                        <div className="font-semibold">{tripDetails.destination}</div>
                      </div>
                    </div>
                  )}

                  {tripDetails?.vehicleType && (
                    <div className="flex items-center gap-3 text-white">
                      <Car className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="text-sm text-gray-400">
                          {language === 'es' ? 'Vehículo' : 'Vehicle'}
                        </div>
                        <div className="font-semibold">{tripDetails.vehicleType}</div>
                      </div>
                    </div>
                  )}

                  {tripDetails?.fare && (
                    <div className="flex items-center gap-3 text-white">
                      <DollarSign className="w-5 h-5 text-yellow-400" />
                      <div>
                        <div className="text-sm text-gray-400">
                          {language === 'es' ? 'Tarifa' : 'Fare'}
                        </div>
                        <div className="font-semibold">${tripDetails.fare}</div>
                      </div>
                    </div>
                  )}

                  {tripDetails?.scheduledTime && (
                    <div className="flex items-center gap-3 text-white">
                      <Calendar className="w-5 h-5 text-orange-400" />
                      <div>
                        <div className="text-sm text-gray-400">
                          {language === 'es' ? 'Programado para' : 'Scheduled for'}
                        </div>
                        <div className="font-semibold">{tripDetails.scheduledTime}</div>
                      </div>
                    </div>
                  )}

                  {tripStatus?.initiatedAt && (
                    <div className="flex items-center gap-3 text-white">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-400">
                          {language === 'es' ? 'Solicitado el' : 'Requested on'}
                        </div>
                        <div className="font-semibold">{formatDate(tripStatus.initiatedAt)}</div>
                        <div className="text-sm text-gray-400">{formatTime(tripStatus.initiatedAt)}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Overview */}
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl border-2 ${statusConfig.borderColor} ${statusConfig.bgColor}`}>
                  <div className="flex items-center gap-4">
                    <StatusIcon className={`w-8 h-8 ${statusConfig.color} animate-pulse`} />
                    <div>
                      <div className={`text-lg font-bold ${statusConfig.color}`}>
                        {statusConfig.message[language]}
                      </div>
                      <div className="text-white text-sm">
                        {statusConfig.description[language]}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Driver Information */}
                {tripStatus?.driver && (
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    {/* <h4 className="text-lg font-semibold text-white mb-4">
                      {language === 'es' ? 'Información del Conductor' : 'Driver Information'}
                    </h4> */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        {/* <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-white font-semibold">{tripStatus.driver.name}</span>
                        </div> */}
                        <div className="flex items-center gap-2 mb-1">
                          <Car className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300 text-sm">
                            {tripStatus.driver.vehicle.brand} {tripStatus.driver.vehicle.model} • {tripStatus.driver.vehicle.color} • {tripStatus.driver.vehicle.plateNumber}
                          </span>
                        </div>
                        {/* <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 text-sm">{tripStatus.driver.rating}</span>
                          <Phone className="w-4 h-4 text-gray-400 ml-2" />
                          <span className="text-gray-300 text-sm">
                            {language === 'es' ? 'Llamar conductor' : 'Call driver'}
                          </span>
                        </div> */}
                      </div>
                    </div>
                  </div>
                )}

                {/* Estimated Arrival */}
                {tripStatus?.estimatedArrival && (
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-3">
                      <Clock className="w-6 h-6 text-yellow-400" />
                      <div>
                        <div className="text-sm text-gray-400">
                          {language === 'es' ? 'Tiempo estimado de llegada' : 'Estimated arrival time'}
                        </div>
                        <div className="text-white font-semibold">{tripStatus.estimatedArrival}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 mb-8">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              {language === 'es' ? 'Progreso del Viaje' : 'Trip Progress'}
            </h3>
            
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/20">
                <div 
                  className="bg-yellow-400 transition-all duration-500"
                  style={{ 
                    height: `${(currentStepIndex / (STATUS_FLOW.length - 1)) * 100}%` 
                  }}
                ></div>
              </div>

              {/* Status Steps */}
              <div className="space-y-8">
                {STATUS_FLOW.map((status, index) => {
                  const stepConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
                  const StepIcon = stepConfig.icon;
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  
                  return (
                    <div key={status} className="flex items-center gap-6">
                      <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-2 transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-yellow-400 border-yellow-400' 
                          : 'bg-white/10 border-white/20'
                      }`}>
                        <StepIcon className={`w-6 h-6 ${
                          isCompleted ? 'text-gray-900' : 'text-gray-400'
                        }`} />
                        {isCurrent && (
                          <div className="absolute -inset-2 border-2 border-yellow-400 rounded-full animate-ping"></div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className={`text-lg font-semibold transition-colors duration-300 ${
                          isCompleted ? 'text-yellow-400' : 'text-gray-400'
                        }`}>
                          {stepConfig.message[language]}
                        </div>
                        <div className={`text-sm transition-colors duration-300 ${
                          isCompleted ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          {stepConfig.description[language]}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Last Updated & Actions */}
          <div className="flex items-center justify-between">
            <div className="text-gray-400 text-sm">
              {lastUpdated && (
                <>
                  {language === 'es' ? 'Última actualización:' : 'Last updated:'}{' '}
                  {lastUpdated.toLocaleTimeString(language === 'es' ? 'es-ES' : 'en-US')}
                </>
              )}
            </div>
            
            <button
              onClick={loadTripStatus}
              disabled={loading}
              className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {language === 'es' ? 'Actualizar' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}