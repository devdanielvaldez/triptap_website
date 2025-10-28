import React, { useState } from 'react';
import { Trash2, AlertTriangle, Shield, Clock, CheckCircle, Mail, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DeleteAccountPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    reason: '',
    additionalInfo: '',
    confirmDeletion: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reasons = [
    'Ya no uso el servicio',
    'Preocupaciones sobre privacidad',
    'Problemas técnicos',
    'Servicio al cliente insatisfactorio',
    'Encontré una alternativa mejor',
    'Otro motivo'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) newErrors.email = 'Email es requerido';
    if (!formData.phone.trim()) newErrors.phone = 'Teléfono es requerido';
    if (!formData.reason) newErrors.reason = 'Motivo es requerido';
    if (!formData.confirmDeletion) newErrors.confirmDeletion = 'Debes confirmar la eliminación';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simular envío de solicitud
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
    } catch (error) {
      alert('Error al enviar la solicitud. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
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
                Solicitud
                <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent"> Enviada</span>
              </h1>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 mb-8">
                <p className="text-xl text-gray-300 mb-6">
                  Tu solicitud de eliminación de cuenta ha sido recibida exitosamente.
                </p>
                
                <div className="space-y-4 text-left">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Procesaremos tu solicitud en un plazo de 7-14 días hábiles</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-[#4EBEFF]" />
                    <span className="text-gray-300">Recibirás confirmación por email una vez completado</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-[#EF5AFF]" />
                    <span className="text-gray-300">Tus datos serán eliminados de forma segura y permanente</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/"
                  className="bg-gradient-to-r from-green-400 to-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Volver al Inicio
                </a>
                <a 
                  href="mailto:hola@triptaplatam.com"
                  className="border-2 border-green-400 text-green-400 px-8 py-3 rounded-full font-semibold hover:bg-green-400 hover:text-white transition-all duration-300"
                >
                  Contactar Soporte
                </a>
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
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8 animate-fade-in-up">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Eliminar
                <span className="bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent"> Mi Cuenta</span>
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              Lamentamos que desees eliminar tu cuenta. Tu privacidad es importante para nosotros.
            </p>
          </div>
        </div>
      </section>

      {/* Warning Section */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-3xl p-8 border border-red-500/20 mb-12">
              <div className="flex items-start space-x-4">
                <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Importante: Antes de Continuar</h3>
                  <div className="space-y-3 text-gray-300">
                    <p>• <strong>Esta acción es irreversible.</strong> Una vez eliminada, no podrás recuperar tu cuenta.</p>
                    <p>• <strong>Perderás acceso permanente</strong> a todos tus datos, historial y configuraciones.</p>
                    <p>• <strong>Pagos pendientes</strong> serán procesados antes de la eliminación.</p>
                    <p>• <strong>El proceso toma 7-14 días hábiles</strong> para completarse totalmente.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-8 text-center">Solicitud de Eliminación de Cuenta</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email de la Cuenta *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
                      placeholder="tu@email.com"
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
                      placeholder="829 343 0971"
                    />
                    {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Motivo de Eliminación *
                  </label>
                  <select
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
                  >
                    <option value="">Selecciona un motivo</option>
                    {reasons.map((reason, index) => (
                      <option key={index} value={reason} className="bg-gray-800">
                        {reason}
                      </option>
                    ))}
                  </select>
                  {errors.reason && <p className="text-red-400 text-sm mt-1">{errors.reason}</p>}
                </div>

                {/* Additional Info */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Información Adicional (Opcional)
                  </label>
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 resize-none"
                    placeholder="Cuéntanos más sobre tu decisión (opcional)"
                  />
                </div>

                {/* Confirmation Checkbox */}
                <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/20">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="confirmDeletion"
                      checked={formData.confirmDeletion}
                      onChange={handleInputChange}
                      className="mt-1 w-5 h-5 text-red-500 bg-transparent border-2 border-red-500 rounded focus:ring-red-500 focus:ring-2"
                    />
                    <span className="text-white">
                      <strong>Confirmo que entiendo</strong> que esta acción eliminará permanentemente mi cuenta y todos los datos asociados. 
                      Esta acción no se puede deshacer.
                    </span>
                  </label>
                  {errors.confirmDeletion && <p className="text-red-400 text-sm mt-2">{errors.confirmDeletion}</p>}
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-red-500 to-orange-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Enviando Solicitud...
                      </div>
                    ) : (
                      'Solicitar Eliminación de Cuenta'
                    )}
                  </button>
                  
                  <a
                    href="/"
                    className="border-2 border-gray-400 text-gray-400 py-4 px-8 rounded-xl font-semibold text-lg hover:bg-gray-400 hover:text-white transition-all duration-300 text-center"
                  >
                    Cancelar
                  </a>
                </div>
              </form>
            </div>

            {/* Contact Support */}
            <div className="mt-12 text-center">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">¿Necesitas Ayuda?</h3>
                <p className="text-gray-300 mb-4">
                  Si tienes dudas o problemas, nuestro equipo de soporte está aquí para ayudarte.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="mailto:hola@triptaplatam.com"
                    className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Contactar Soporte
                  </a>
                  <a 
                    href="tel:+18293430971"
                    className="border-2 border-[#EF5AFF] text-[#EF5AFF] px-6 py-3 rounded-full font-semibold hover:bg-[#EF5AFF] hover:text-white transition-all duration-300"
                  >
                    Llamar Ahora
                  </a>
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

export default DeleteAccountPage;