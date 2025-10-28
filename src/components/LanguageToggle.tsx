import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-4 h-4 text-gray-300" />
      <div className="flex bg-white/10 rounded-full p-1">
        <button
          onClick={() => setLanguage('es')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
            language === 'es'
              ? 'bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white shadow-lg'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          ES
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
            language === 'en'
              ? 'bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white shadow-lg'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          EN
        </button>
      </div>
    </div>
  );
};

export default LanguageToggle;