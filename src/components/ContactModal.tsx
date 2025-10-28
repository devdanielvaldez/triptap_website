import React from 'react';
import { X, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      value: 'hola@triptaplatam.com',
      action: () => window.open('mailto:hola@triptaplatam.com'),
      gradient: 'from-[#EF5AFF] to-[#4EBEFF]'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Teléfono',
      value: '+1 (829) 343-0971',
      action: () => window.open('tel:+18293430971'),
      gradient: 'from-[#4EBEFF] to-[#EF5AFF]'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Ubicación',
      value: 'República Dominicana',
      action: () => {},
      gradient: 'from-green-400 to-emerald-600'
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'WhatsApp',
      value: '+1 (829) 343-0971',
      action: () => window.open('https://wa.me/18293430971'),
      gradient: 'from-emerald-400 to-green-600'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900 rounded-3xl p-8 max-w-lg w-full border border-white/10 animate-scale-in">
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
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Contáctanos
          </h2>
          <p className="text-gray-300">Estamos aquí para ayudarte</p>
        </div>

        {/* Contact Methods */}
        <div className="space-y-4">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              onClick={method.action}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group hover:scale-105"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${method.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">{method.icon}</div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{method.title}</h3>
                  <p className="text-gray-300">{method.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Responderemos lo antes posible
          </p>
          <div className="flex justify-center space-x-2 mt-4">
            <div className="w-2 h-2 bg-[#EF5AFF] rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-[#4EBEFF] rounded-full animate-pulse delay-200"></div>
            <div className="w-2 h-2 bg-[#EF5AFF] rounded-full animate-pulse delay-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;