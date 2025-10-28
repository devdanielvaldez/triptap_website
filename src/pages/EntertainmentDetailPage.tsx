import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, Star, Calendar, Mail, Phone, CheckCircle, Loader, Image as ImageIcon, Play, Shield } from 'lucide-react';
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
  included: string[];
  practicalInformation: Record<string, string>;
  goodToKnow: Record<string, string>;
  images: string[];
  emailProperty: string;
}

const EntertainmentDetailPage = () => {
  const { t, language } = useLanguage();
  const { placeId } = useParams<{ placeId: string }>();
  const navigate = useNavigate();
  const [place, setPlace] = useState<EntertainmentPlace | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [hotel, setHotel] = useState('');
  const [pickUpLocation, setPickUpLocation] = useState('');
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (placeId) {
      fetchPlaceDetails();
    }
  }, [placeId]);

  const fetchPlaceDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://dev.triptapmedia.com/api/entertainment/${placeId}`);
      setPlace(response.data.place);
    } catch (error) {
      console.error('Error fetching place details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableDaysText = (availableDays: any) => {
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const dayNames = language === 'es' 
      ? ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
      : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const availableCount = days.filter(day => availableDays[day]).length;
    
    if (availableCount === 7) {
      return language === 'es' ? 'Todos los días' : 'Every day';
    }
    
    return days
      .filter(day => availableDays[day])
      .map(day => dayNames[days.indexOf(day)])
      .join(', ');
  };

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !email || !phone || !hotel || !pickUpLocation) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Crear el datetime combinando fecha y hora
      const dateTime = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();
      
      const reservationData = {
        dateTime: dateTime,
        peopleCount: numberOfPeople,
        passengersTotal: numberOfPeople,
        userEmail: email,
        hotel: hotel,
        pickUpLocation: pickUpLocation,
        extrasProtectionPlus: false,
        freePassengers: 0
      };

      const response = await axios.post(
        `https://dev.triptapmedia.com/api/entertainment/${place?._id}/reservations`,
        reservationData
      );
      
      setIsSuccess(true);
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert('Error al procesar la reserva. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    if (!place) return 0;
    return place.pricePerPassenger * numberOfPeople;
  };

  const isVideoUrl = (url: string) => {
    return url.includes('.mp4') || url.includes('.webm') || url.includes('.mov');
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
          <p className="text-white text-xl">Cargando experiencia...</p>
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="pt-24 pb-16 text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white mb-4">Experiencia no encontrada</h1>
            <button
              onClick={() => navigate('/entertainment')}
              className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Volver a Experiencias
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success Screen
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        
        <section className="min-h-screen flex items-center justify-center pt-20 pb-16 bg-gradient-to-br from-gray-900 via-green-900/20 to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#4EBEFF] rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                ¡Reserva
                <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent"> Confirmada!</span>
              </h1>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">{place.name}</h3>
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fecha:</span>
                    <span className="text-white">{selectedDate} a las {selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Personas:</span>
                    <span className="text-white">{numberOfPeople}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hotel:</span>
                    <span className="text-white">{hotel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Recogida:</span>
                    <span className="text-white">{pickUpLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total:</span>
                    <span className="text-green-400 font-bold">${calculateTotal()} {place.currency}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-xl text-gray-300 mb-8">
                Hemos enviado los detalles de tu reserva a <strong className="text-white">{email}</strong>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/entertainment')}
                  className="bg-gradient-to-r from-green-400 to-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Ver Más Experiencias
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="border-2 border-green-400 text-green-400 px-8 py-3 rounded-full font-semibold hover:bg-green-400 hover:text-white transition-all duration-300"
                >
                  Volver al Inicio
                </button>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {/* Back Button */}
      <div className="pt-24 pb-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/entertainment')}
            className="flex items-center space-x-2 text-[#4EBEFF] hover:text-[#EF5AFF] transition-colors duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Volver a Experiencias</span>
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
                {place.images && place.images.length > 0 ? (
                  isVideoUrl(place.images[selectedImageIndex]) ? (
                    <video
                      src={place.images[selectedImageIndex]}
                      className="w-full h-full object-cover"
                      controls
                      poster=""
                    />
                  ) : (
                    <img
                      src={place.images[selectedImageIndex]}
                      alt={place.name}
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#EF5AFF]/20 to-[#4EBEFF]/20 flex items-center justify-center">
                    <Star className="w-24 h-24 text-white/50" />
                  </div>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {place.images && place.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {place.images.slice(0, 4).map((image, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                        selectedImageIndex === index ? 'ring-2 ring-[#EF5AFF]' : 'hover:opacity-80'
                      }`}
                    >
                      {isVideoUrl(image) ? (
                        <div className="w-full h-full bg-black flex items-center justify-center">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                      ) : (
                        <img
                          src={image}
                          alt={`${place.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-5 h-5 text-[#EF5AFF]" />
                  <span className="text-gray-400">{place.location}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {place.name}
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  {place.description}
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                    ${place.pricePerPassenger} {place.currency}
                  </div>
                  <div className="text-gray-400">por persona</div>
                </div>
                
                <div className="flex items-center space-x-4 text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{getAvailableDaysText(place.availableDays)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details and Reservation */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">Descripción General</h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {place.overview}
                </p>
              </div>

              {/* Included */}
              {place.included && place.included.length > 0 && (
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                  <h3 className="text-2xl font-bold text-white mb-6">Incluido</h3>
                  <ul className="space-y-3">
                    {place.included.map((item, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Practical Information */}
              {place.practicalInformation && Object.keys(place.practicalInformation).length > 0 && (
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                  <h3 className="text-2xl font-bold text-white mb-6">Información Práctica</h3>
                  <div className="space-y-4">
                    {Object.entries(place.practicalInformation).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-gray-400">{key}:</span>
                        <span className="text-white font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Good to Know */}
              {place.goodToKnow && Object.keys(place.goodToKnow).length > 0 && (
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                  <h3 className="text-2xl font-bold text-white mb-6">Bueno Saber</h3>
                  <div className="space-y-4">
                    {Object.entries(place.goodToKnow).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-gray-400">{key}:</span>
                        <span className="text-white font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reservation Form */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 sticky top-32">
                <h3 className="text-2xl font-bold text-white mb-6">Hacer Reserva</h3>
                
                <form onSubmit={handleReservation} className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Fecha *
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Hora *
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                      required
                    >
                      <option value="09:00" className="bg-gray-800">9:00 AM</option>
                      <option value="10:00" className="bg-gray-800">10:00 AM</option>
                      <option value="11:00" className="bg-gray-800">11:00 AM</option>
                      <option value="12:00" className="bg-gray-800">12:00 PM</option>
                      <option value="13:00" className="bg-gray-800">1:00 PM</option>
                      <option value="14:00" className="bg-gray-800">2:00 PM</option>
                      <option value="15:00" className="bg-gray-800">3:00 PM</option>
                      <option value="16:00" className="bg-gray-800">4:00 PM</option>
                      <option value="17:00" className="bg-gray-800">5:00 PM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      <Users className="w-4 h-4 inline mr-2" />
                      Número de Personas *
                    </label>
                    <input
                      type="number"
                      value={numberOfPeople}
                      onChange={(e) => setNumberOfPeople(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      max="20"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Hotel *
                    </label>
                    <input
                      type="text"
                      value={hotel}
                      onChange={(e) => setHotel(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                      placeholder="Nombre de tu hotel"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Lugar de Recogida *
                    </label>
                    <input
                      type="text"
                      value={pickUpLocation}
                      onChange={(e) => setPickUpLocation(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                      placeholder="Ej: Lobby del hotel, Recepción"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                      placeholder="+1 (829) 343-0971"
                      required
                    />
                  </div>


                  <div className="border-t border-white/10 pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xl font-bold text-white">Total:</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                        ${calculateTotal()} {place.currency}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white py-4 rounded-xl text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <Loader className="w-5 h-5 animate-spin mr-2" />
                        Procesando Reserva...
                      </div>
                    ) : (
                      'Confirmar Reserva'
                    )}
                  </button>
                </form>

                <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <p className="text-blue-300 text-sm">
                    <strong>Nota:</strong> Tu reserva será confirmada por email. El pago se realizará en el lugar de la experiencia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EntertainmentDetailPage;