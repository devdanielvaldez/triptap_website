import React, { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface RedirectCountdownProps {
  isOpen: boolean;
  onClose: () => void;
  targetUrl: string;
}

const RedirectCountdown: React.FC<RedirectCountdownProps> = ({ isOpen, onClose, targetUrl }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = targetUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, targetUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" />
      
      {/* Modal */}
      <div className="relative bg-gray-900 rounded-3xl p-8 max-w-lg w-full border border-white/10 animate-scale-in text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <ExternalLink className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Redirigiendo a nuestro
          </h2>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent">
            Ads Studio
          </h3>
        </div>

        {/* Countdown */}
        <div className="mb-8">
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(countdown / 5) * 283} 283`}
                  className="transition-all duration-1000 ease-linear"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#EF5AFF" />
                    <stop offset="100%" stopColor="#4EBEFF" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">{countdown}</span>
              </div>
            </div>
          </div>
          <p className="text-gray-300 text-lg">
            Serás redirigido en <span className="text-[#EF5AFF] font-bold">{countdown}</span> segundos
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-6">
          <div className="flex items-center justify-center mb-3">
            <ArrowLeft className="w-5 h-5 text-[#4EBEFF] mr-2" />
            <span className="text-white font-semibold">Consejo</span>
          </div>
          <p className="text-gray-300 text-sm">
            Puedes hacer clic en el botón "Atrás" de tu navegador para regresar a nuestra web en cualquier momento
          </p>
        </div>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
        >
          Cancelar Redirección
        </button>

        {/* Decorative elements */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-2 h-2 bg-[#EF5AFF] rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-[#4EBEFF] rounded-full animate-pulse delay-200"></div>
          <div className="w-2 h-2 bg-[#EF5AFF] rounded-full animate-pulse delay-400"></div>
        </div>
      </div>
    </div>
  );
};

export default RedirectCountdown;