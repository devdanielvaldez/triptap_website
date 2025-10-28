import React from 'react';
import { X, Calculator } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import PricingCalculatorWidget from './PricingCalculatorWidget';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);

  const handleDownloadComplete = () => {
    setShowSuccessMessage(true);
    // Cerrar el modal después de 2 segundos
    setTimeout(() => {
      setShowSuccessMessage(false);
      onClose();
    }, 2000);
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
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold text-white">Calculadora de Precios</h2>
              <p className="text-gray-400 text-sm">Calcula el costo de tu campaña publicitaria</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Iframe Container */}
        <div className="relative max-h-[70vh] overflow-y-auto">
          {showSuccessMessage && (
            <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">¡Cotización Generada!</h3>
                <p className="text-gray-300">Tu archivo Excel ha sido descargado exitosamente</p>
              </div>
            </div>
          )}
          <PricingCalculatorWidget 
            theme="dark"
            companyName="TripTap"
            logoUrl="https://static.wixstatic.com/media/8bd644_9ed4e04b4f64455baa72f0fe7a701edc~mv2.png/v1/fill/w_744,h_154,al_c,lg_1,q_85,enc_avif,quality_auto/full%20chroma.png"
            onDownloadComplete={handleDownloadComplete}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-gray-800/50">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Obtén una cotización personalizada para tu campaña
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

export default QuoteModal;