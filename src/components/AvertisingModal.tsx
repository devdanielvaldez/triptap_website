import React from 'react';
import { X, ExternalLink, Loader } from 'lucide-react';

interface AdvertisingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdvertisingModal: React.FC<AdvertisingModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = React.useState(true);

  const handleExternalOpen = () => {
    window.open('https://app.triptapmedia.com/register', '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900 rounded-3xl max-w-6xl w-full max-h-[90vh] border border-white/10 animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-full flex items-center justify-center">
              <ExternalLink className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold text-white">TripTap Ads Studio</h2>
              <p className="text-gray-400 text-sm">Crea tu campaña publicitaria</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-2">
            <button
              onClick={handleExternalOpen}
              className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white px-3 py-2 rounded-full text-xs font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-1 whitespace-nowrap"
            >
              <ExternalLink className="w-3 h-3" />
              <span className="hidden sm:inline">Abrir en Nueva Pestaña</span>
              <span className="sm:hidden">Abrir</span>
            </button>
            
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Iframe Container */}
        <div className="relative h-[70vh]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="text-center">
                <Loader className="w-8 h-8 text-[#EF5AFF] animate-spin mx-auto mb-4" />
                <p className="text-white">Cargando Ads Studio...</p>
              </div>
            </div>
          )}
          
          <iframe
            src="https://app.triptapmedia.com/register"
            className="w-full h-full border-0"
            onLoad={() => setIsLoading(false)}
            title="TripTap Ads Studio"
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-gray-800/50">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              ¿Problemas para cargar? Usa el botón "Abrir en Nueva Pestaña"
            </p>
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-[#EF5AFF] rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-[#4EBEFF] rounded-full animate-pulse delay-200"></div>
              <div className="w-2 h-2 bg-[#EF5AFF] rounded-full animate-pulse delay-400"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertisingModal;