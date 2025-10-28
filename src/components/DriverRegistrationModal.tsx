import React, { useState } from 'react';
import axios from 'axios';
import { X, User, Mail, Phone, Lock, Calendar, Car, CreditCard, FileText, Shield, Upload, Building } from 'lucide-react';

interface DriverRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DriverRegistrationModal: React.FC<DriverRegistrationModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [vehicleMakes, setVehicleMakes] = useState<Array<{id: number, slug: string, make: string}>>([]);
  const [vehicleModels, setVehicleModels] = useState<Array<{id: number, slug: string, model: string, idmake: number}>>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [registrationData, setRegistrationData] = useState<{token?: string, driverId?: string, userId?: string}>({});
  const [formData, setFormData] = useState({
    // Datos personales
    name: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    identificationNumber: '',
    
    // Datos de licencia
    licenseNumber: '',
    licenseExpirationDate: '',
    
    // Datos del vehículo
    vehicleBrand: '',
    vehicleBrandId: '',
    vehicleModel: '',
    vehicleYear: '',
    vehiclePlateNumber: '',
    vehicleColor: '',
    vehicleFuelType: '',
    
    // Datos del seguro
    insuranceCompany: '',
    insuranceType: '',
    insuranceExpirationDate: '',
    
    // Datos bancarios
    accountNumber: '',
    bankName: '',
    accountType: 'Ahorros',
    accountIdentification: '',
    
    // Ficha técnica
    fichaNumber: '',
    
    // Asociación
    associationName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar marcas de vehículos cuando se abre el modal
  React.useEffect(() => {
    if (isOpen && vehicleMakes.length === 0) {
      loadVehicleMakes();
    }
  }, [isOpen]);

  const loadVehicleMakes = async () => {
    try {
      const response = await axios.get('https://dev.triptapmedia.com/api/drivers/makes');
      setVehicleMakes(response.data);
    } catch (error) {
      console.error('Error cargando marcas de vehículos:', error);
    }
  };

  const loadVehicleModels = async (makeId: string) => {
    if (!makeId) {
      setVehicleModels([]);
      return;
    }

    setLoadingModels(true);
    try {
      const response = await axios.get(`https://dev.triptapmedia.com/api/drivers/models/${makeId}`);
      setVehicleModels(response.data);
    } catch (error) {
      console.error('Error cargando modelos de vehículos:', error);
      setVehicleModels([]);
    } finally {
      setLoadingModels(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Si cambia la marca del vehículo, cargar los modelos y resetear el modelo seleccionado
    if (name === 'vehicleBrandId') {
      const selectedMake = vehicleMakes.find(make => make.id.toString() === value);
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        vehicleBrand: selectedMake ? selectedMake.make : '',
        vehicleModel: '' // Reset model when brand changes
      }));
      loadVehicleModels(value);
    } else if (name === 'vehicleModel') {
      const selectedModel = vehicleModels.find(model => model.model === value);
      setFormData(prev => ({ 
        ...prev, 
        [name]: value
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      // Validación datos personales
      if (!formData.name.trim()) newErrors.name = 'Nombre es requerido';
      if (!formData.lastName.trim()) newErrors.lastName = 'Apellido es requerido';
      if (!formData.email.trim()) newErrors.email = 'Email es requerido';
      if (!formData.phone.trim()) newErrors.phone = 'Teléfono es requerido';
      if (!formData.identificationNumber.trim()) newErrors.identificationNumber = 'Cédula es requerida';
      if (!formData.password) newErrors.password = 'Contraseña es requerida';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }

      if (formData.password && formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }
    }

    if (step === 2) {
      // Validación datos de licencia
      if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'Número de licencia es requerido';
      if (!formData.licenseExpirationDate) newErrors.licenseExpirationDate = 'Fecha de vencimiento es requerida';
    }

    if (step === 3) {
      // Validación datos del vehículo
      if (!formData.vehicleBrand.trim()) newErrors.vehicleBrand = 'Marca del vehículo es requerida';
      if (!formData.vehicleModel.trim()) newErrors.vehicleModel = 'Modelo del vehículo es requerido';
      if (!formData.vehicleYear.trim()) newErrors.vehicleYear = 'Año del vehículo es requerido';
      if (!formData.vehiclePlateNumber.trim()) newErrors.vehiclePlateNumber = 'Placa del vehículo es requerida';
      if (!formData.vehicleColor.trim()) newErrors.vehicleColor = 'Color del vehículo es requerido';
      if (!formData.vehicleFuelType.trim()) newErrors.vehicleFuelType = 'Tipo de combustible es requerido';
    }

    if (step === 4) {
      // Validación datos del seguro
      if (!formData.insuranceCompany.trim()) newErrors.insuranceCompany = 'Compañía de seguro es requerida';
      if (!formData.insuranceType.trim()) newErrors.insuranceType = 'Tipo de seguro es requerido';
      if (!formData.insuranceExpirationDate) newErrors.insuranceExpirationDate = 'Fecha de vencimiento es requerida';
    }

    if (step === 5) {
      // Validación datos bancarios y ficha
      if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Número de cuenta es requerido';
      if (!formData.bankName.trim()) newErrors.bankName = 'Nombre del banco es requerido';
      if (!formData.accountType.trim()) newErrors.accountType = 'Tipo de cuenta es requerido';
      if (!formData.accountIdentification.trim()) newErrors.accountIdentification = 'Identificación es requerida';
      if (!formData.fichaNumber.trim()) newErrors.fichaNumber = 'Número de ficha es requerido';
      if (!formData.associationName.trim()) newErrors.associationName = 'Nombre de asociación es requerido';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(5)) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('https://dev.triptapmedia.com/api/drivers/complete-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Datos personales
          name: formData.name,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          identificationNumber: formData.identificationNumber,
          
          // Datos de licencia
          licenseNumber: formData.licenseNumber,
          licenseExpirationDate: formData.licenseExpirationDate,
          
          // Datos del vehículo
          vehicleBrand: formData.vehicleBrand,
          vehicleModel: formData.vehicleModel,
          vehicleYear: formData.vehicleYear,
          vehiclePlateNumber: formData.vehiclePlateNumber,
          vehicleColor: formData.vehicleColor,
          vehicleFuelType: formData.vehicleFuelType,
          
          // Datos del seguro
          insuranceCompany: formData.insuranceCompany,
          insuranceType: formData.insuranceType,
          insuranceExpirationDate: formData.insuranceExpirationDate,
          
          // Datos bancarios
          bankDetail: {
            accountNumber: formData.accountNumber,
            bankName: formData.bankName,
            type: formData.accountType,
            identification: formData.accountIdentification
          },
          
          // Número de ficha
          fichaNumber: formData.fichaNumber,
          
          // Nombre de asociación
          associationName: formData.associationName,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setRegistrationData(responseData.data || {});
        setShowSuccessPopup(true);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Error en el registro'}`);
      }
    } catch (error) {
      alert('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    onClose();
    // Reset form
    setFormData({
      name: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '',
      identificationNumber: '', licenseNumber: '', licenseExpirationDate: '',
      vehicleBrand: '', vehicleBrandId: '', vehicleModel: '', vehicleYear: '', vehiclePlateNumber: '',
      vehicleColor: '', vehicleFuelType: '', insuranceCompany: '',
      insuranceType: '', insuranceExpirationDate: '',
      accountNumber: '', bankName: '', accountType: 'Ahorros', accountIdentification: '', fichaNumber: '', associationName: ''
    });
    setVehicleModels([]);
    setCurrentStep(1);
    setRegistrationData({});
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Datos Personales</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Nombre *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                  placeholder="Tu nombre"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Apellido *
                </label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                  placeholder="+1 (829) 343-0971"
                />
                {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Cédula *
              </label>
              <input
                type="text"
                name="identificationNumber"
                value={formData.identificationNumber}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                placeholder="000-0000000-0"
              />
              {errors.identificationNumber && <p className="text-red-400 text-sm mt-1">{errors.identificationNumber}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Contraseña *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                  placeholder="Mínimo 6 caracteres"
                />
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Confirmar Contraseña *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                  placeholder="Confirma tu contraseña"
                />
                {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Datos de Licencia</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Número de Licencia *
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                  placeholder="Número de licencia"
                />
                {errors.licenseNumber && <p className="text-red-400 text-sm mt-1">{errors.licenseNumber}</p>}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Fecha de Vencimiento *
                </label>
                <input
                  type="date"
                  name="licenseExpirationDate"
                  value={formData.licenseExpirationDate}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                />
                {errors.licenseExpirationDate && <p className="text-red-400 text-sm mt-1">{errors.licenseExpirationDate}</p>}
              </div>
            </div>

          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Datos del Vehículo</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  <Car className="w-4 h-4 inline mr-2" />
                  Marca *
                </label>
                <select
                  name="vehicleBrandId"
                  value={formData.vehicleBrandId}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                >
                  <option value="">Selecciona una marca</option>
                  {vehicleMakes.map((make) => (
                    <option key={make.id} value={make.id} className="bg-gray-800">
                      {make.make}
                    </option>
                  ))}
                </select>
                {errors.vehicleBrand && <p className="text-red-400 text-sm mt-1">{errors.vehicleBrand}</p>}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  <Car className="w-4 h-4 inline mr-2" />
                  Modelo *
                </label>
                <select
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                  disabled={!formData.vehicleBrandId || loadingModels}
                >
                  <option value="">
                    {!formData.vehicleBrandId 
                      ? 'Primero selecciona una marca' 
                      : loadingModels 
                        ? 'Cargando modelos...' 
                        : 'Selecciona un modelo'
                    }
                  </option>
                  {vehicleModels.map((model) => (
                    <option key={model.id} value={model.model} className="bg-gray-800">
                      {model.model}
                    </option>
                  ))}
                </select>
                {errors.vehicleModel && <p className="text-red-400 text-sm mt-1">{errors.vehicleModel}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Año *
                </label>
                <input
                  type="number"
                  name="vehicleYear"
                  value={formData.vehicleYear}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                  placeholder="2020"
                  min="1990"
                  max="2025"
                />
                {errors.vehicleYear && <p className="text-red-400 text-sm mt-1">{errors.vehicleYear}</p>}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Placa *
                </label>
                <input
                  type="text"
                  name="vehiclePlateNumber"
                  value={formData.vehiclePlateNumber}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                  placeholder="A123456"
                />
                {errors.vehiclePlateNumber && <p className="text-red-400 text-sm mt-1">{errors.vehiclePlateNumber}</p>}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Color *
                </label>
                <input
                  type="text"
                  name="vehicleColor"
                  value={formData.vehicleColor}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                  placeholder="Blanco, Negro, etc."
                />
                {errors.vehicleColor && <p className="text-red-400 text-sm mt-1">{errors.vehicleColor}</p>}
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Tipo de Combustible *
              </label>
              <select
                name="vehicleFuelType"
                value={formData.vehicleFuelType}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
              >
                <option value="">Selecciona el tipo de combustible</option>
                <option value="gasoline" className="bg-gray-800">Gasolina</option>
                <option value="diesel" className="bg-gray-800">Diesel</option>
                <option value="gas" className="bg-gray-800">Gas</option>
                <option value="electric" className="bg-gray-800">Eléctrico</option>
              </select>
              {errors.vehicleFuelType && <p className="text-red-400 text-sm mt-1">{errors.vehicleFuelType}</p>}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Datos del Seguro</h3>
            
            <div>
              <label className="block text-white font-medium mb-2">
                <Shield className="w-4 h-4 inline mr-2" />
                Compañía de Seguro *
              </label>
              <input
                type="text"
                name="insuranceCompany"
                value={formData.insuranceCompany}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                placeholder="Nombre de la aseguradora"
              />
              {errors.insuranceCompany && <p className="text-red-400 text-sm mt-1">{errors.insuranceCompany}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Tipo de Seguro *
                </label>
                <select
                  name="insuranceType"
                  value={formData.insuranceType}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                >
                  <option value="">Selecciona el tipo de seguro</option>
                  <option value="Full" className="bg-gray-800">Full</option>
                  <option value="Ley" className="bg-gray-800">Ley</option>
                </select>
                {errors.insuranceType && <p className="text-red-400 text-sm mt-1">{errors.insuranceType}</p>}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Fecha de Vencimiento *
                </label>
                <input
                  type="date"
                  name="insuranceExpirationDate"
                  value={formData.insuranceExpirationDate}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                />
                {errors.insuranceExpirationDate && <p className="text-red-400 text-sm mt-1">{errors.insuranceExpirationDate}</p>}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Datos Bancarios y Ficha</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  Número de Cuenta *
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                  placeholder="Número de cuenta bancaria"
                />
                {errors.accountNumber && <p className="text-red-400 text-sm mt-1">{errors.accountNumber}</p>}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Nombre del Banco *
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                  placeholder="Nombre de tu banco"
                />
                {errors.bankName && <p className="text-red-400 text-sm mt-1">{errors.bankName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Tipo de Cuenta *
                </label>
                <select
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                >
                  <option value="">Selecciona el tipo de cuenta</option>
                  <option value="Ahorros" className="bg-gray-800">Ahorros</option>
                  <option value="Corriente" className="bg-gray-800">Corriente</option>
                </select>
                {errors.accountType && <p className="text-red-400 text-sm mt-1">{errors.accountType}</p>}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Cédula *
                </label>
                <input
                  type="text"
                  name="accountIdentification"
                  value={formData.accountIdentification}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                  placeholder="000-0000000-0"
                />
                {errors.accountIdentification && <p className="text-red-400 text-sm mt-1">{errors.accountIdentification}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Número de Ficha Técnica *
                </label>
                <input
                  type="text"
                  name="fichaNumber"
                  value={formData.fichaNumber}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                  placeholder="Número de ficha técnica del vehículo"
                />
                {errors.fichaNumber && <p className="text-red-400 text-sm mt-1">{errors.fichaNumber}</p>}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  <Building className="w-4 h-4 inline mr-2" />
                  Nombre Asociación *
                </label>
                <input
                  type="text"
                  name="associationName"
                  value={formData.associationName}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#EF5AFF] focus:ring-2 focus:ring-[#EF5AFF]/20 transition-all duration-300"
                  placeholder="Nombre de la asociación"
                />
                {errors.associationName && <p className="text-red-400 text-sm mt-1">{errors.associationName}</p>}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  // Success Popup
  if (showSuccessPopup) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" />
        
        {/* Success Modal */}
        <div className="relative bg-gray-900 rounded-3xl p-8 max-w-lg w-full border border-white/10 animate-scale-in text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          {/* Success Message */}
          <h2 className="text-3xl font-bold text-white mb-4">
            ¡Registro
            <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent"> Exitoso!</span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-8">
            Tu cuenta de conductor ha sido creada correctamente
          </p>
          
          {/* Registration Details */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Cuenta de conductor activada</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#4EBEFF] rounded-full"></div>
                <span className="text-gray-300">Datos del vehículo registrados</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#EF5AFF] rounded-full"></div>
                <span className="text-gray-300">Listo para comenzar a ganar</span>
              </div>
            </div>
          </div>
          
          {/* Next Steps */}
          <div className="bg-gradient-to-r from-green-400/10 to-emerald-600/10 rounded-2xl p-6 border border-green-400/20 mb-8">
            <h3 className="text-lg font-bold text-white mb-3">Próximos Pasos:</h3>
            <div className="text-sm text-gray-300 space-y-2">
              <p>1. Nuestro equipo se contactará contigo en 24-48 horas</p>
              <p>2. Coordinaremos la instalación de la tableta</p>
              <p>3. ¡Comenzarás a ganar dinero extra!</p>
            </div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={handleSuccessClose}
            className="bg-gradient-to-r from-green-400 to-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 w-full"
          >
            ¡Perfecto, Entendido!
          </button>
          
          {/* Decorative elements */}
          <div className="flex justify-center space-x-2 mt-6">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-[#4EBEFF] rounded-full animate-pulse delay-200"></div>
            <div className="w-2 h-2 bg-[#EF5AFF] rounded-full animate-pulse delay-400"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10 animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Únete a <span className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent">TripTap</span>
          </h2>
          <p className="text-gray-300">Registro completo de conductor</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Paso {currentStep} de 5</span>
            <span className="text-sm text-gray-400">{Math.round((currentStep / 5) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Registrando...
                  </div>
                ) : (
                  'Completar Registro'
                )}
              </button>
            )}
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Al registrarte, aceptas nuestros términos y condiciones
        </p>
      </div>
    </div>
  );
};

export default DriverRegistrationModal;