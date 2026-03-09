import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../lib/translations';

const Footer = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  const [currentMessage, setCurrentMessage] = useState('news');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => prev === 'news' ? 'profile' : 'news');
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .ticker-text {
          animation: scroll 20s linear infinite;
          white-space: nowrap;
        }
      `}</style>
      
      <div className="flex items-center h-16 px-4">
        <div className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold mr-4 flex-shrink-0">
          📰 LIVE
        </div>
        
        <div className="flex-1 overflow-hidden relative">
          <div className="ticker-text text-white text-sm font-medium leading-relaxed">
            {t(`ticker.${currentMessage}`)}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
