import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="https://static.wixstatic.com/media/8bd644_9ed4e04b4f64455baa72f0fe7a701edc~mv2.png/v1/fill/w_744,h_154,al_c,lg_1,q_85,enc_avif,quality_auto/full%20chroma.png" 
                alt="TripTap Logo" 
                className="h-10 w-auto"
              />
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
              {t('footer.description')}
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <Twitter className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">{t('footer.contact')}</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#EF5AFF]" />
                <span className="text-gray-300">hola@triptaplatam.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#4EBEFF]" />
                <span className="text-gray-300">+1 (829) 343-0971</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-[#EF5AFF]" />
                <span className="text-gray-300">República Dominicana</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-center md:text-left">
            &copy; 2025 TripTap. {t('footer.rights')}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-[#EF5AFF] transition-colors duration-300">
              {t('footer.terms')}
            </a>
            <a href="/privacy-policy" className="text-gray-400 hover:text-[#EF5AFF] transition-colors duration-300">
              {t('footer.privacy')}
            </a>
            <a href="/delete-account" className="text-gray-400 hover:text-[#EF5AFF] transition-colors duration-300">
              Eliminar Cuenta
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;