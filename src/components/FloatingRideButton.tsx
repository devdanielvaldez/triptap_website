import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Car, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function FloatingRideButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const isRidePage = location.pathname === '/request-ride';

  useEffect(() => {
    let timeout:any;
    if (isHovered) {
      setIsVisible(true);
    } else {
      timeout = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [isHovered]);

  useEffect(() => {
    setIsVisible(true);
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  if (isRidePage) {
    return null;
  }

  return (
    <>
      <div
        className="fixed bottom-6 right-6 z-50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={() => navigate('/request-ride')}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>

          <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 rounded-full shadow-2xl transition-all duration-300 transform group-hover:scale-110 flex items-center overflow-hidden">
            <div className="flex items-center p-4">
              <Car className="w-6 h-6" />
            </div>

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isVisible ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'
              }`}
            >
              <div className="pr-4 whitespace-nowrap font-bold">
                {t('ride.button')}
              </div>
            </div>
          </div>

          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </button>

        {isHovered && (
          <div className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-xl whitespace-nowrap animate-fade-in">
            <div className="text-sm font-semibold">{t('ride.tooltip')}</div>
            <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
