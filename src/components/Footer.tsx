import { useState, useEffect } from 'react';
import { useApp } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import firstLogo from 'figma:asset/0e6ea90a13d4aed51a0701dae090f0d44793897f.png';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { theme, language } = useApp();
  const [content, setContent] = useState<any>({});

  useEffect(() => {
    loadContent();

    const handleContentUpdate = (event: any) => {
      if (event.detail?.footer) {
        setContent(event.detail.footer);
      }
    };

    window.addEventListener('contentUpdated', handleContentUpdate);
    return () => window.removeEventListener('contentUpdated', handleContentUpdate);
  }, []);

  const loadContent = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5881ae94/content`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      setContent(data.content?.footer || {});
    } catch (error) {
      console.error('Error loading footer content:', error);
    }
  };

  const getContent = (path: string) => {
    const keys = path.split('.');
    let value = content;
    
    for (const key of keys) {
      if (value && value[key] !== undefined) {
        value = value[key];
      } else {
        return null;
      }
    }
    
    if (value && typeof value === 'object' && (value.en || value.pt)) {
      return value[language] || value.en || '';
    }
    
    return value || null;
  };

  const bgColor = theme === 'dark' ? 'bg-[#1A1816]' : 'bg-[#FDFBF7]';
  const borderColor = theme === 'dark' ? 'border-[#3A3632]' : 'border-[#E5DED0]';
  const textColor = theme === 'dark' ? 'text-[#C9C2B5]' : 'text-[#5C5346]';
  const mutedColor = theme === 'dark' ? 'text-[#8B8275]' : 'text-[#8B8275]';

  return (
    <footer className={`${bgColor} border-t ${borderColor} py-8 sm:py-12 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:gap-8">
          {/* FIRST Logo */}
          <div className="flex justify-center">
            <img 
              src={firstLogo} 
              alt="FIRST Logo" 
              className="h-12 sm:h-16 md:h-20 w-auto opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
          
          {/* Team Info */}
          <div className={`text-center ${textColor}`}>
            <p className="text-sm sm:text-base mb-2">
              Team Alphire #26456
            </p>
            <p className={`text-xs sm:text-sm ${mutedColor}`}>
              {language === 'en' ? 'Always in flames!' : 'Sempre em chamas!'}
            </p>
          </div>

          {/* Contact Info */}
          <div className={`text-center ${textColor}`}>
            <p className={`text-sm sm:text-base ${mutedColor}`}>
              {language === 'en' ? 'Contact:' : 'Contato:'} <a href="mailto:ftc.alphalumen@gmail.com" className="text-red-500 hover:text-red-600 transition-colors">ftc.alphalumen@gmail.com</a>
            </p>
          </div>

          {/* ABE Logo/Image */}
          {getContent('abeImage') && (
            <div className="flex justify-center">
              <ImageWithFallback
                src={getContent('abeImage')}
                alt="ABE"
                className="h-12 sm:h-16 md:h-20 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          )}

          {/* Admin Link */}
          {onNavigate && (
            <div className="text-center">
              <button
                onClick={() => onNavigate('admin')}
                className={`text-xs ${mutedColor} hover:text-red-600 transition-colors`}
              >
                Admin
              </button>
            </div>
          )}

          {/* Copyright */}
          <div className={`text-xs sm:text-sm ${mutedColor} text-center`}>
            <p>
              © {new Date().getFullYear()} Team Alphire. {language === 'en' ? 'All rights reserved.' : 'Todos os direitos reservados.'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}