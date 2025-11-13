import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import ContactModal from './ContactModal';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  const handleNavigation = (path: any) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3 z-[60] relative">
            <img 
              src="https://static.wixstatic.com/media/8bd644_9ed4e04b4f64455baa72f0fe7a701edc~mv2.png/v1/fill/w_744,h_154,al_c,lg_1,q_85,enc_avif,quality_auto/full%20chroma.png" 
              alt="TripTap Logo" 
              className="h-8 lg:h-10 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => handleNavigation('/')} className="text-white hover:text-[#EF5AFF] transition-colors duration-300 font-medium">
              {t('nav.home')}
            </button>
            <button onClick={() => handleNavigation('/esim')} className="text-white hover:text-[#EF5AFF] transition-colors duration-300 font-medium">
              eSIM
            </button>
            <button onClick={() => handleNavigation('/deals')} className="text-white hover:text-[#EF5AFF] transition-colors duration-300 font-medium">
              Ofertas
            </button>
            <button onClick={() => handleNavigation('/entertainment')} className="text-white hover:text-[#EF5AFF] transition-colors duration-300 font-medium">
              Experiencias
            </button>
            <button onClick={() => handleNavigation('/advertising')} className="text-white hover:text-[#EF5AFF] transition-colors duration-300 font-medium">
              {t('nav.advertising')}
            </button>
            <button onClick={() => handleNavigation('/publish-events')} className="text-white hover:text-[#EF5AFF] transition-colors duration-300 font-medium">
              {t('nav.partners')}
            </button>
            <button onClick={() => handleNavigation('/business')} className="text-white hover:text-[#EF5AFF] transition-colors duration-300 font-medium">
              {t('nav.businesses')}
            </button>
            <button onClick={() => handleNavigation('/drivers')} className="text-white hover:text-[#EF5AFF] transition-colors duration-300 font-medium">
              {t('nav.drivers')}
            </button>
            <LanguageToggle />
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-[#EF5AFF] transition-colors duration-300 z-[60] relative"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
          {/* Mobile backdrop */}
          <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-md" onClick={() => setIsMenuOpen(false)} />
          
          {/* Mobile menu content */}
          <nav className="relative z-50 flex flex-col items-center justify-center h-screen space-y-6 text-center px-4 pt-20">
            <button onClick={() => handleNavigation('/')} className="block text-white hover:text-[#EF5AFF] transition-colors duration-300 font-medium text-2xl">
              {t('nav.home')}
            </button>
            <button onClick={() => handleNavigation('/esim')} className="block text-white hover:text-[#EF5AFF] transition-colors duration-300 font-medium text-2xl">
              eSIM
            </button>
            <button onClick={() => handleNavigation('/deals')} className="block text-white hover:text-[#EF5AFF] transition-colors duration-300 font-medium text-2xl">
              Ofertas
            </button>
            <button onClick={() => handleNavigation('/entertainment')} className="block text-white hover:text-[#EF5AFF] transition-colors duration-300 font-medium text-2xl">
              Experiencias
            </button>
            <button onClick={() => handleNavigation('/advertising')} className="block text-white hover:text-[#EF5AFF] transition-colors duration-300 font-medium text-2xl">
              {t('nav.advertising')}
            </button>
            <button onClick={() => handleNavigation('/publish-events')} className="block text-white hover:text-[#EF5AFF] transition-colors duration-300 font-medium text-2xl">
              {t('nav.partners')}
            </button>
            <button onClick={() => handleNavigation('/business')} className="block text-white hover:text-[#EF5AFF] transition-colors duration-300 font-medium text-2xl">
              {t('nav.businesses')}
            </button>
            <button onClick={() => handleNavigation('/drivers')} className="block text-white hover:text-[#EF5AFF] transition-colors duration-300 font-medium text-2xl">
              {t('nav.drivers')}
            </button>
            <div className="pt-8">
              <LanguageToggle />
            </div>
          </nav>
        </div>
      </div>
      </header>
      
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </>
  );
};

export default Header;