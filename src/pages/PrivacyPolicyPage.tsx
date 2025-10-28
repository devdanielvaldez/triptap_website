import React from 'react';
import { Shield, Eye, Lock, Users, FileText, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicyPage = () => {
  const { t } = useLanguage();

  const sections = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "1. Información que Recopilamos",
      content: [
        "Información personal que nos proporcionas directamente (nombre, email, teléfono, cédula)",
        "Información de ubicación cuando utilizas nuestros servicios",
        "Datos de uso de la aplicación y tabletas interactivas",
        "Información de dispositivos y conexión",
        "Datos de interacción con publicidad mostrada"
      ]
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "2. Cómo Utilizamos tu Información",
      content: [
        "Proporcionar y mejorar nuestros servicios de transporte y publicidad",
        "Procesar pagos y transacciones",
        "Personalizar la experiencia publicitaria",
        "Comunicarnos contigo sobre nuestros servicios",
        "Cumplir con obligaciones legales y regulatorias",
        "Análisis y mejora de nuestros servicios"
      ]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "3. Compartir Información",
      content: [
        "Con conductores afiliados para coordinar servicios",
        "Con anunciantes (solo datos agregados y anónimos)",
        "Con proveedores de servicios que nos ayudan a operar",
        "Cuando sea requerido por ley o autoridades competentes",
        "En caso de fusión, adquisición o venta de activos",
        "Con tu consentimiento explícito"
      ]
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "4. Seguridad de Datos",
      content: [
        "Utilizamos encriptación SSL/TLS para proteger datos en tránsito",
        "Almacenamiento seguro con acceso restringido",
        "Auditorías regulares de seguridad",
        "Capacitación del personal en protección de datos",
        "Monitoreo continuo de amenazas de seguridad",
        "Respaldo y recuperación de datos"
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "5. Tus Derechos",
      content: [
        "Acceder a tu información personal",
        "Rectificar datos incorrectos o incompletos",
        "Solicitar la eliminación de tus datos",
        "Oponerte al procesamiento de tus datos",
        "Portabilidad de datos",
        "Retirar consentimiento en cualquier momento"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#EF5AFF] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#4EBEFF] rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8 animate-fade-in-up">
              <div className="w-20 h-20 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Políticas de
                <span className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent"> Privacidad</span>
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              En TripTap, protegemos tu privacidad y datos personales con los más altos estándares de seguridad
            </p>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 animate-fade-in-up delay-400">
              <p className="text-gray-300">
                <strong className="text-white">Última actualización:</strong> 1 de febrero de 2025
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Introduction */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Introducción</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                TripTap ("nosotros", "nuestro" o "la empresa") se compromete a proteger la privacidad de nuestros usuarios. 
                Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos tu información 
                personal cuando utilizas nuestros servicios de transporte y publicidad interactiva.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Al utilizar nuestros servicios, aceptas las prácticas descritas en esta política. Si no estás de acuerdo 
                con algún aspecto de esta política, te recomendamos no utilizar nuestros servicios.
              </p>
            </div>
          </div>

          {/* Policy Sections */}
          <div className="space-y-12 max-w-4xl mx-auto">
            {sections.map((section, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-xl flex items-center justify-center flex-shrink-0">
                    <div className="text-white">{section.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{section.title}</h3>
                </div>
                
                <ul className="space-y-3 ml-16">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-[#EF5AFF] rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300 leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Additional Sections */}
          <div className="space-y-12 max-w-4xl mx-auto mt-16">
            {/* Cookies */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-[#4EBEFF] to-[#EF5AFF] rounded-lg flex items-center justify-center mr-3">
                  <Eye className="w-4 h-4 text-white" />
                </div>
                6. Cookies y Tecnologías Similares
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Utilizamos cookies y tecnologías similares para mejorar tu experiencia, personalizar contenido y anuncios, 
                y analizar el uso de nuestros servicios. Puedes controlar las cookies a través de la configuración de tu navegador.
              </p>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-sm text-gray-400">
                  <strong>Tipos de cookies que utilizamos:</strong> Esenciales, de rendimiento, funcionales y de marketing.
                </p>
              </div>
            </div>

            {/* Data Retention */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                7. Retención de Datos
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Conservamos tu información personal solo durante el tiempo necesario para cumplir con los propósitos 
                descritos en esta política, a menos que la ley requiera o permita un período de retención más largo. 
                Los datos de ubicación se eliminan automáticamente después de 30 días.
              </p>
            </div>

            {/* International Transfers */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-4 h-4 text-white" />
                </div>
                8. Transferencias Internacionales
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Tus datos pueden ser transferidos y procesados en países fuera de República Dominicana. 
                Implementamos salvaguardas apropiadas para proteger tu información personal de acuerdo con esta política 
                y las leyes aplicables.
              </p>
            </div>

            {/* Changes to Policy */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-600 rounded-lg flex items-center justify-center mr-3">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                9. Cambios a esta Política
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos sobre cambios 
                significativos a través de nuestros servicios o por email. Tu uso continuado de nuestros servicios 
                después de dichos cambios constituye tu aceptación de la nueva política.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="bg-gradient-to-r from-[#EF5AFF]/10 to-[#4EBEFF]/10 rounded-3xl p-8 border border-white/10 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">¿Tienes Preguntas?</h3>
              <p className="text-gray-300 mb-6">
                Si tienes preguntas sobre esta Política de Privacidad o sobre cómo manejamos tus datos personales, 
                no dudes en contactarnos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:hola@triptaplatam.com"
                  className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Contactar por Email
                </a>
                <a 
                  href="tel:+18293430971"
                  className="border-2 border-[#EF5AFF] text-[#EF5AFF] px-8 py-3 rounded-full font-semibold hover:bg-[#EF5AFF] hover:text-white transition-all duration-300"
                >
                  Llamar Ahora
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;