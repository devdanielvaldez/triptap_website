import React, { useState } from 'react';
import { X, CreditCard, User, MapPin, Phone, Mail, Lock, Wifi, CheckCircle, Loader } from 'lucide-react';
import axios from 'axios';

interface EsimPackage {
  id: string;
  title: string;
  data: string;
  price: number;
  day: number;
  voice?: number;
  text?: number;
}

interface EsimOperator {
  title: string;
  image: {
    url: string;
  };
}

interface EsimCountry {
  title: string;
  image: {
    url: string;
  };
}

interface EsimCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: EsimPackage;
  operator: EsimOperator;
  country: EsimCountry;
}

const EsimCheckoutModal: React.FC<EsimCheckoutModalProps> = ({ 
  isOpen, 
  onClose, 
  package: esimPackage, 
  operator, 
  country 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expirationMonth: '',
    expirationYear: '',
    securityCode: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Format card number
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formatted.length <= 19) {
        setFormData(prev => ({ ...prev, [name]: formatted }));
      }
      return;
    }
    
    // Format security code
    if (name === 'securityCode' && value.length > 4) return;
    
    // Format phone number
    if (name === 'phoneNumber') {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: numbers }));
      }
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.email.trim()) newErrors.email = 'Email es requerido';
      if (!formData.firstName.trim()) newErrors.firstName = 'Nombre es requerido';
      if (!formData.lastName.trim()) newErrors.lastName = 'Apellido es requerido';
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Teléfono es requerido';

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }
    }

    if (step === 2) {
      if (!formData.address.trim()) newErrors.address = 'Dirección es requerida';
      if (!formData.city.trim()) newErrors.city = 'Ciudad es requerida';
      if (!formData.state.trim()) newErrors.state = 'Provincia es requerida';
      if (!formData.postalCode.trim()) newErrors.postalCode = 'Código postal es requerido';
    }

    if (step === 3) {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Número de tarjeta es requerido';
      if (!formData.expirationMonth) newErrors.expirationMonth = 'Mes es requerido';
      if (!formData.expirationYear) newErrors.expirationYear = 'Año es requerido';
      if (!formData.securityCode.trim()) newErrors.securityCode = 'CVV es requerido';

      const cardNumber = formData.cardNumber.replace(/\s/g, '');
      if (cardNumber.length < 16) {
        newErrors.cardNumber = 'Número de tarjeta inválido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsProcessing(true);
    
    try {
      const payload = {
        package_id: esimPackage.id,
        email: formData.email,
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        expirationMonth: formData.expirationMonth,
        expirationYear: formData.expirationYear,
        securityCode: formData.securityCode,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: 'DO',
        phoneNumber: formData.phoneNumber
      };

      const response = await axios.post('https://dev.triptapmedia.com/api/esim/create-order', payload);
      
      setOrderData(response.data);
      setIsSuccess(true);
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error procesando el pago. Intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getDurationText = (days: number) => {
    if (days === 1) return '1 día';
    if (days < 30) return `${days} días`;
    if (days === 30) return '1 mes';
    if (days < 365) return `${Math.round(days / 30)} meses`;
    return '1 año';
  };

  const handleSuccessClose = () => {
    setIsSuccess(false);
    onClose();
    // Reset form
    setFormData({
      email: '', cardNumber: '', expirationMonth: '', expirationYear: '',
      securityCode: '', firstName: '', lastName: '', address: '',
      city: '', state: '', postalCode: '', phoneNumber: ''
    });
    setCurrentStep(1);
    setOrderData(null);
  };

  if (!isOpen) return null;

  // Success Screen
  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" />
        
        <div className="relative bg-gray-900 rounded-3xl p-8 max-w-lg w-full border border-white/10 animate-scale-in text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            ¡Compra
            <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent"> Exitosa!</span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-6">
            Tu eSIM ha sido procesado correctamente
          </p>
          
          {/* Email notification */}
          <div className="bg-blue-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 mb-8">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">Email de Activación Enviado</h3>
            </div>
            <p className="text-blue-300 text-sm leading-relaxed">
              Hemos enviado un email a <strong className="text-white">{formData.email}</strong> con las instrucciones detalladas 
              para activar tu eSIM. Revisa tu bandeja de entrada y sigue los pasos para comenzar a usar tu plan.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <img src={country.image.url} alt={country.title} className="w-8 h-8 rounded" />
              <div className="text-left">
                <div className="text-white font-semibold">{esimPackage.title}</div>
                <div className="text-gray-400 text-sm">{country.title} • {operator.title}</div>
              </div>
            </div>
            <div className="text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Datos:</span>
                <span className="text-white">{esimPackage.data}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duración:</span>
                <span className="text-white">{getDurationText(esimPackage.day)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total:</span>
                <span className="text-green-400 font-bold">${esimPackage.price}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleSuccessClose}
            className="bg-gradient-to-r from-green-400 to-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 w-full"
          >
            ¡Perfecto!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <div className="relative bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-full flex items-center justify-center">
              <Wifi className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Comprar eSIM</h2>
              <p className="text-gray-400">{country.title} • {operator.title}</p>
            </div>
          </div>
          
          <button onClick={onClose} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
          {/* Left Side - Form */}
          <div className="lg:col-span-2">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Paso {currentStep} de 3</span>
                <span className="text-sm text-gray-400">{Math.round((currentStep / 3) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <User className="w-6 h-6 text-[#EF5AFF]" />
                  <h3 className="text-xl font-bold text-white">Información Personal</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Nombre *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                      placeholder="Tu nombre"
                    />
                    {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Apellido *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                      placeholder="Tu apellido"
                    />
                    {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                    placeholder="tu@email.com"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                    placeholder="8091112233"
                  />
                  {errors.phoneNumber && <p className="text-red-400 text-sm mt-1">{errors.phoneNumber}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Address */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <MapPin className="w-6 h-6 text-[#4EBEFF]" />
                  <h3 className="text-xl font-bold text-white">Dirección de Facturación</h3>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Dirección *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#4EBEFF] focus:ring-2 focus:ring-[#4EBEFF]/20 transition-all duration-300"
                    placeholder="Calle Central 123"
                  />
                  {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Ciudad *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#4EBEFF] focus:ring-2 focus:ring-[#4EBEFF]/20 transition-all duration-300"
                      placeholder="Santo Domingo"
                    />
                    {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Provincia *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#4EBEFF] focus:ring-2 focus:ring-[#4EBEFF]/20 transition-all duration-300"
                      placeholder="Distrito Nacional"
                    />
                    {errors.state && <p className="text-red-400 text-sm mt-1">{errors.state}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Código Postal *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#4EBEFF] focus:ring-2 focus:ring-[#4EBEFF]/20 transition-all duration-300"
                    placeholder="10101"
                  />
                  {errors.postalCode && <p className="text-red-400 text-sm mt-1">{errors.postalCode}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <CreditCard className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-bold text-white">Información de Pago</h3>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Número de Tarjeta *</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
                    placeholder="1234 5678 9012 3456"
                  />
                  {errors.cardNumber && <p className="text-red-400 text-sm mt-1">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Mes *</label>
                    <select
                      name="expirationMonth"
                      value={formData.expirationMonth}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
                    >
                      <option value="">Mes</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1).padStart(2, '0')} className="bg-gray-800">
                          {String(i + 1).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    {errors.expirationMonth && <p className="text-red-400 text-sm mt-1">{errors.expirationMonth}</p>}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Año *</label>
                    <select
                      name="expirationYear"
                      value={formData.expirationYear}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
                    >
                      <option value="">Año</option>
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i} value={2025 + i} className="bg-gray-800">
                          {2025 + i}
                        </option>
                      ))}
                    </select>
                    {errors.expirationYear && <p className="text-red-400 text-sm mt-1">{errors.expirationYear}</p>}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      <Lock className="w-4 h-4 inline mr-1" />
                      CVV *
                    </label>
                    <input
                      type="text"
                      name="securityCode"
                      value={formData.securityCode}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
                      placeholder="123"
                    />
                    {errors.securityCode && <p className="text-red-400 text-sm mt-1">{errors.securityCode}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <Loader className="w-5 h-5 animate-spin mr-2" />
                      Procesando...
                    </div>
                  ) : (
                    `Pagar $${esimPackage.price}`
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 sticky top-6">
              <h3 className="text-xl font-bold text-white mb-6">Resumen del Pedido</h3>
              
              <div className="flex items-center space-x-4 mb-6">
                <img src={country.image.url} alt={country.title} className="w-12 h-12 rounded-lg" />
                <div>
                  <div className="text-white font-semibold">{esimPackage.title}</div>
                  <div className="text-gray-400 text-sm">{country.title}</div>
                  <div className="text-gray-400 text-sm">{operator.title}</div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Datos:</span>
                  <span className="text-white">{esimPackage.data}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duración:</span>
                  <span className="text-white">{getDurationText(esimPackage.day)}</span>
                </div>
                {esimPackage.voice && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Minutos:</span>
                    <span className="text-white">{esimPackage.voice}</span>
                  </div>
                )}
                {esimPackage.text && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">SMS:</span>
                    <span className="text-white">{esimPackage.text}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-white">Total:</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                    ${esimPackage.price}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-semibold text-sm">Activación Instantánea</span>
                </div>
                <p className="text-gray-300 text-xs">Tu eSIM se activará inmediatamente después del pago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EsimCheckoutModal;