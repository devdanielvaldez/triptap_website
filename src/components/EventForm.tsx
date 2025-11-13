import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Mail, 
  Phone, 
  Globe,
  CheckCircle,
  Loader,
  AlertCircle,
  X,
  Plus,
  Minus
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

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

interface EventFormProps {
  onSubmit: (data: EventFormData) => Promise<void>;
  loading?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({ onSubmit, loading = false }) => {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState<EventFormData>({
    title: { en: '', es: '' },
    description: { en: '', es: '' },
    isFree: true,
    cost: 0,
    organizerEmail: '',
    organizerPhone: '',
    eventDate: '',
    eventTime: '',
    address: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const translations = {
    es: {
      title: 'Publicar Evento',
      subtitle: 'Comparte tu evento con la comunidad',
      basicInfo: 'Información Básica',
      titleEn: 'Título en Inglés',
      titleEs: 'Título en Español',
      descriptionEn: 'Descripción en Inglés',
      descriptionEs: 'Descripción en Español',
      eventDetails: 'Detalles del Evento',
      freeEvent: 'Evento Gratuito',
      paidEvent: 'Evento de Pago',
      cost: 'Costo',
      contactInfo: 'Información de Contacto',
      email: 'Email',
      phone: 'Teléfono',
      date: 'Fecha del Evento',
      time: 'Hora del Evento',
      address: 'Dirección',
      additionalNotes: 'Notas Adicionales',
      submit: 'Publicar Evento',
      submitting: 'Publicando...',
      success: '¡Evento enviado exitosamente!',
      successMessage: 'Tu evento ha sido enviado para revisión. Te notificaremos cuando sea aprobado.',
      required: 'Este campo es requerido',
      invalidEmail: 'Email inválido',
      invalidCost: 'El costo debe ser mayor a 0',
      futureDate: 'La fecha debe ser futura'
    },
    en: {
      title: 'Publish Event',
      subtitle: 'Share your event with the community',
      basicInfo: 'Basic Information',
      titleEn: 'Title in English',
      titleEs: 'Title in Spanish',
      descriptionEn: 'Description in English',
      descriptionEs: 'Description in Spanish',
      eventDetails: 'Event Details',
      freeEvent: 'Free Event',
      paidEvent: 'Paid Event',
      cost: 'Cost',
      contactInfo: 'Contact Information',
      email: 'Email',
      phone: 'Phone',
      date: 'Event Date',
      time: 'Event Time',
      address: 'Address',
      additionalNotes: 'Additional Notes',
      submit: 'Publish Event',
      submitting: 'Publishing...',
      success: 'Event Sending Successfully!',
      successMessage: 'Your event has been submitted for review. We will notify you when it is approved.',
      required: 'This field is required',
      invalidEmail: 'Invalid email',
      invalidCost: 'Cost must be greater than 0',
      futureDate: 'Date must be in the future'
    }
  };

  const tForm = (key: keyof typeof translations.es) => translations[language][key];

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EventFormData, string>> = {};

    if (!formData.title.en.trim()) newErrors.title = tForm('required');
    if (!formData.title.es.trim()) newErrors.title = tForm('required');
    if (!formData.description.en.trim()) newErrors.description = tForm('required');
    if (!formData.description.es.trim()) newErrors.description = tForm('required');
    if (!formData.organizerEmail.trim()) newErrors.organizerEmail = tForm('required');
    if (!formData.organizerPhone.trim()) newErrors.organizerPhone = tForm('required');
    if (!formData.eventDate) newErrors.eventDate = tForm('required');
    if (!formData.eventTime) newErrors.eventTime = tForm('required');
    if (!formData.address.trim()) newErrors.address = tForm('required');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.organizerEmail && !emailRegex.test(formData.organizerEmail)) {
      newErrors.organizerEmail = tForm('invalidEmail');
    }

    // Cost validation for paid events
    if (!formData.isFree && (!formData.cost || formData.cost <= 0)) {
      newErrors.cost = tForm('invalidCost');
    }

    // Date validation
    if (formData.eventDate && new Date(formData.eventDate) <= new Date()) {
      newErrors.eventDate = tForm('futureDate');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      setShowSuccess(true);
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          title: { en: '', es: '' },
          description: { en: '', es: '' },
          isFree: true,
          cost: 0,
          organizerEmail: '',
          organizerPhone: '',
          eventDate: '',
          eventTime: '',
          address: '',
          notes: ''
        });
        setShowSuccess(false);
      }, 10000);
    } catch (error) {
      console.error('Error submitting event:', error);
    }
  };

  const handleInputChange = (
    field: keyof EventFormData,
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleNestedInputChange = (
    parent: keyof EventFormData,
    field: string,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [field]: value
      }
    }));
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full text-center animate-bounce-in">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-scale" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2 animate-fade-in">
            {tForm('success')}
          </h2>
          <p className="text-gray-600 mb-6 animate-fade-in-delay">
            {tForm('successMessage')}
          </p>
          <button
            onClick={() => setShowSuccess(false)}
            className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors animate-fade-in-delay-2"
          >
            {language === 'es' ? 'Publicar Otro Evento' : 'Publish Another Event'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-down">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            {tForm('title')}
          </h1>
          <p className="text-xl text-gray-600">
            {tForm('subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Card */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-xl">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{tForm('basicInfo')}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Title in English */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {tForm('titleEn')} *
                </label>
                <input
                  type="text"
                  value={formData.title.en}
                  onChange={(e) => handleNestedInputChange('title', 'en', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                    errors.title ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder={language === 'es' ? 'Ej: Music Festival' : 'Eg: Music Festival'}
                />
              </div>

              {/* Title in Spanish */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {tForm('titleEs')} *
                </label>
                <input
                  type="text"
                  value={formData.title.es}
                  onChange={(e) => handleNestedInputChange('title', 'es', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                    errors.title ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder={language === 'es' ? 'Ej: Festival de Música' : 'Eg: Music Festival'}
                />
              </div>

              {/* Description in English */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {tForm('descriptionEn')} *
                </label>
                <textarea
                  value={formData.description.en}
                  onChange={(e) => handleNestedInputChange('description', 'en', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                    errors.description ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder={language === 'es' ? 'Describe tu evento en inglés...' : 'Describe your event in English...'}
                />
              </div>

              {/* Description in Spanish */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {tForm('descriptionEs')} *
                </label>
                <textarea
                  value={formData.description.es}
                  onChange={(e) => handleNestedInputChange('description', 'es', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                    errors.description ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder={language === 'es' ? 'Describe tu evento en español...' : 'Describe your event in Spanish...'}
                />
              </div>
            </div>
          </div>

          {/* Event Details Card */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 animate-slide-up-delay">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{tForm('eventDetails')}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Event Type */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Evento
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange('isFree', true)}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                      formData.isFree
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <CheckCircle className={`w-5 h-5 inline mr-2 ${formData.isFree ? 'opacity-100' : 'opacity-0'}`} />
                    {tForm('freeEvent')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('isFree', false)}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                      !formData.isFree
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <CheckCircle className={`w-5 h-5 inline mr-2 ${!formData.isFree ? 'opacity-100' : 'opacity-0'}`} />
                    {tForm('paidEvent')}
                  </button>
                </div>
              </div>

              {/* Cost */}
              {!formData.isFree && (
                <div className="space-y-2 animate-fade-in">
                  <label className="block text-sm font-medium text-gray-700">
                    {tForm('cost')} *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) => handleInputChange('cost', parseFloat(e.target.value) || 0)}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.cost ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.cost && <p className="text-red-500 text-sm">{errors.cost}</p>}
                </div>
              )}

              {/* Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {tForm('date')} *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => handleInputChange('eventDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.eventDate ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.eventDate && <p className="text-red-500 text-sm">{errors.eventDate}</p>}
              </div>

              {/* Time */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {tForm('time')} *
                </label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="time"
                    value={formData.eventTime}
                    onChange={(e) => handleInputChange('eventTime', e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.eventTime ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.eventTime && <p className="text-red-500 text-sm">{errors.eventTime}</p>}
              </div>

              {/* Address */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {tForm('address')} *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.address ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder={language === 'es' ? 'Dirección completa del evento...' : 'Full event address...'}
                  />
                </div>
                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
              </div>
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 animate-slide-up-delay-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-xl">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{tForm('contactInfo')}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {tForm('email')} *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={formData.organizerEmail}
                    onChange={(e) => handleInputChange('organizerEmail', e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                      errors.organizerEmail ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="tu@email.com"
                  />
                </div>
                {errors.organizerEmail && <p className="text-red-500 text-sm">{errors.organizerEmail}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {tForm('phone')} *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={formData.organizerPhone}
                    onChange={(e) => handleInputChange('organizerPhone', e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                      errors.organizerPhone ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder={language === 'es' ? '+1 234 567 8900' : '+1 234 567 8900'}
                  />
                </div>
                {errors.organizerPhone && <p className="text-red-500 text-sm">{errors.organizerPhone}</p>}
              </div>
            </div>
          </div>

          {/* Additional Notes Card */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 animate-slide-up-delay-3">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-xl">
                <Plus className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{tForm('additionalNotes')}</h2>
            </div>

            <div className="space-y-2">
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder={language === 'es' ? 'Información adicional que quieras compartir...' : 'Additional information you want to share...'}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center animate-fade-in">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin inline mr-2" />
                  {tForm('submitting')}
                </>
              ) : (
                tForm('submit')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;