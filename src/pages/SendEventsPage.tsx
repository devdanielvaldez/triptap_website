import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertCircle, 
  CheckCircle, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react';
import EventForm from '../components/EventForm';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

interface Event {
  _id: string;
  title: {
    en: string;
    es: string;
  };
  description: {
    en: string;
    es: string;
  };
  isFree: boolean;
  cost?: number;
  organizerEmail: string;
  organizerPhone: string;
  eventDate: string;
  eventTime: string;
  address: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface EventFormData {
  title: {
    en: string;
    es: string;
  };
  description: {
    en: string;
    es: string;
  };
  isFree: boolean;
  cost: number;
  organizerEmail: string;
  organizerPhone: string;
  eventDate: string;
  eventTime: string;
  address: string;
  notes: string;
}

const PublishEventPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [showAllEvents, setShowAllEvents] = useState(false);

  useEffect(() => {
    loadPublishedEvents();
  }, []);

  const loadPublishedEvents = async () => {
    try {
      const response = await fetch('https://dev.triptapmedia.com/api/events/public?limit=6');
      const data = await response.json();

      if (response.ok && data.success) {
        setEvents(data.data || []);
      } else {
        throw new Error(data.message || 'Error loading events');
      }
    } catch (err: any) {
      console.error('Error loading events:', err);
      setError(err.message || (language === 'es' ? 'Error al cargar eventos' : 'Error loading events'));
    } finally {
      setEventsLoading(false);
    }
  };

  const handleSubmit = async (formData: EventFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://dev.triptapmedia.com/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al publicar el evento');
      }

      if (!data.success) {
        throw new Error(data.message || 'Error al publicar el evento');
      }

      console.log('Event published successfully:', data);
      // Recargar eventos después de publicar uno nuevo
      await loadPublishedEvents();
      // Ocultar el formulario después del éxito
      setShowForm(false);
      
    } catch (err: any) {
      console.error('Error publishing event:', err);
      setError(err.message || (language === 'es' ? 'Error al publicar el evento' : 'Error publishing event'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const translations = {
    es: {
      title: 'Eventos',
      subtitle: 'Descubre y comparte eventos increíbles',
      publishedEvents: 'Eventos Publicados',
      viewAll: 'Ver Todos los Eventos',
      viewLess: 'Ver Menos',
      noEvents: 'No hay eventos publicados aún',
      noEventsDescription: 'Sé el primero en publicar un evento',
      registerEvent: 'Registrar Mi Evento',
      eventDetails: 'Detalles del Evento',
      free: 'Gratis',
      contact: 'Contacto',
      date: 'Fecha',
      time: 'Hora',
      location: 'Ubicación',
      price: 'Precio',
      organizer: 'Organizador',
      error: 'Error',
      success: 'Éxito',
      goBack: 'Volver al Inicio',
      contactSupport: 'Contactar Soporte',
      loadingEvents: 'Cargando eventos...'
    },
    en: {
      title: 'Events',
      subtitle: 'Discover and share amazing events',
      publishedEvents: 'Published Events',
      viewAll: 'View All Events',
      viewLess: 'View Less',
      noEvents: 'No published events yet',
      noEventsDescription: 'Be the first to publish an event',
      registerEvent: 'Register My Event',
      eventDetails: 'Event Details',
      free: 'Free',
      contact: 'Contact',
      date: 'Date',
      time: 'Time',
      location: 'Location',
      price: 'Price',
      organizer: 'Organizer',
      error: 'Error',
      success: 'Success',
      goBack: 'Back to Home',
      contactSupport: 'Contact Support',
      loadingEvents: 'Loading events...'
    }
  };

  const t = (key: keyof typeof translations.es) => translations[language][key];

  const displayedEvents = showAllEvents ? events : events.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 relative overflow-hidden">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Error Alert */}
        {error && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 animate-slide-down">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-red-800 text-sm font-medium">{t('error')}</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {showForm ? (
          <EventForm onSubmit={handleSubmit} loading={loading} />
        ) : (
          <div className="container mx-auto px-4">
            {/* Header Section */}
            <div className="text-center mb-12 animate-slide-down">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {t('title')}
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                {t('subtitle')}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-3 mx-auto"
              >
                <Plus className="w-5 h-5" />
                {t('registerEvent')}
              </button>
            </div>

            {/* Published Events Section */}
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">
                  {t('publishedEvents')}
                </h2>
                {events.length > 3 && (
                  <button
                    onClick={() => setShowAllEvents(!showAllEvents)}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {showAllEvents ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    {showAllEvents ? t('viewLess') : t('viewAll')}
                  </button>
                )}
              </div>

              {eventsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
                  <p className="text-gray-400 mt-4">{t('loadingEvents')}</p>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-12 bg-white/10 rounded-3xl backdrop-blur-lg border border-white/20">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {t('noEvents')}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {t('noEventsDescription')}
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    <Plus className="w-5 h-5 inline mr-2" />
                    {t('registerEvent')}
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedEvents.map((event) => (
                    <div
                      key={event._id}
                      className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:transform hover:scale-105"
                    >
                      {/* Event Header */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                          {language === 'es' ? event.title.es : event.title.en}
                        </h3>
                        <p className="text-gray-300 text-sm line-clamp-3">
                          {language === 'es' ? event.description.es : event.description.en}
                        </p>
                      </div>

                      {/* Event Details */}
                      <div className="space-y-3">
                        {/* Date and Time */}
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          <div>
                            <div className="text-gray-400">{t('date')}</div>
                            <div className="text-white font-medium">
                              {formatDate(event.eventDate)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <Clock className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <div>
                            <div className="text-gray-400">{t('time')}</div>
                            <div className="text-white font-medium">
                              {formatTime(event.eventTime)}
                            </div>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-3 text-sm">
                          <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
                          <div>
                            <div className="text-gray-400">{t('location')}</div>
                            <div className="text-white font-medium line-clamp-2">
                              {event.address}
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3 text-sm">
                          <DollarSign className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                          <div>
                            <div className="text-gray-400">{t('price')}</div>
                            <div className="text-white font-medium">
                              {event.isFree ? (
                                <span className="text-green-400">{t('free')}</span>
                              ) : (
                                `$${event.cost}`
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Organizer */}
                        <div className="pt-3 border-t border-white/20">
                          <div className="text-gray-400 text-sm mb-1">{t('organizer')}</div>
                          <div className="text-white text-sm">
                            {event.organizerEmail}
                          </div>
                          <div className="text-gray-300 text-xs">
                            {event.organizerPhone}
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="mt-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          event.status === 'PUBLISHED' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : event.status === 'APPROVED'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Load More Events Button */}
              {!showAllEvents && events.length > 3 && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setShowAllEvents(true)}
                    className="bg-white/10 backdrop-blur-lg border border-white/20 text-white px-8 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <Eye className="w-5 h-5" />
                    {t('viewAll')} ({events.length - 3} {language === 'es' ? 'más' : 'more'})
                  </button>
                </div>
              )}

              {/* Register Event CTA */}
              {events.length > 0 && (
                <div className="text-center mt-12 pt-8 border-t border-white/20">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {language === 'es' ? '¿Tienes un evento?' : 'Have an event?'}
                  </h3>
                  <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                    {language === 'es' 
                      ? 'Comparte tu evento con la comunidad y llega a más personas'
                      : 'Share your event with the community and reach more people'
                    }
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-3 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    {t('registerEvent')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PublishEventPage;