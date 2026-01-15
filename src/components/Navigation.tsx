import { Menu, X, Moon, Sun, Globe } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../App';
import { fullTranslations } from '../utils/translations';
import logo from 'figma:asset/1c634555781d8c7b6d1909a60ffda035fc42f330.png';
import schoolLogo from 'figma:asset/ea2a5ef63b136e0361fba5c96ff6637995192598.png';
import schoolLogoDark from 'figma:asset/bf7cbcc728c91bfd28c6bc5eda7f40b3f194c3cb.png';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, language, toggleTheme, toggleLanguage } = useApp();
  const t = fullTranslations[language];

  const navItems = [
    { label: t.nav.home, page: 'home' },
    { label: t.nav.robots, page: 'robots' },
    { label: t.nav.projects, page: 'projects' },
    { label: t.nav.social, page: 'social' },
    { label: t.nav.sponsors, page: 'sponsors' },
    { label: t.nav.materials, page: 'materials' },
    { label: t.nav.contact, page: 'contact' },
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const bgColor = theme === 'dark' ? 'bg-[#0F0E0D]/95' : 'bg-[#FDFBF7]/95';
  const borderColor = theme === 'dark' ? 'border-[#3A3632]' : 'border-[#E5DED0]';
  const textColor = theme === 'dark' ? 'text-[#C9C2B5]' : 'text-[#5C5346]';
  const activeColor = theme === 'dark' ? 'text-[#D4A574]' : 'text-[#D4A574]';
  const hoverColor = theme === 'dark' ? 'hover:text-[#D4A574]' : 'hover:text-[#C49563]';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${bgColor} backdrop-blur-sm border-b ${borderColor} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <button 
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
          >
            <img src={theme === 'dark' ? schoolLogoDark : schoolLogo} alt="School Logo" className="h-10 sm:h-12 w-auto" />
            <img src={logo} alt="Alphire Logo" className="h-10 sm:h-12 w-auto" />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigate(item.page)}
                className={`transition-colors text-sm xl:text-base ${
                  currentPage === item.page ? activeColor : `${textColor} ${hoverColor}`
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-[#252320]' : 'bg-[#F5F1E8]'} hover:opacity-80 transition-opacity`}
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="text-[#D4A574]" size={18} />
              ) : (
                <Moon className="text-[#5C5346]" size={18} />
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-[#252320]' : 'bg-[#F5F1E8]'} hover:opacity-80 transition-opacity`}
              title={language === 'en' ? 'Português' : 'English'}
            >
              <div className="flex items-center gap-1.5">
                <Globe size={16} className="text-[#D4A574]" />
                <span className={`text-sm ${theme === 'dark' ? 'text-[#F5F1E8]' : 'text-[#2C2416]'}`}>
                  {language === 'en' ? 'EN' : 'PT'}
                </span>
              </div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden ${activeColor}`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className={`lg:hidden py-4 border-t ${borderColor}`}>
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigate(item.page)}
                className={`block py-2 w-full text-left transition-colors ${
                  currentPage === item.page ? activeColor : `${textColor} ${hoverColor}`
                }`}
              >
                {item.label}
              </button>
            ))}
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={toggleTheme}
                className={`flex-1 p-2 rounded-lg ${theme === 'dark' ? 'bg-[#252320]' : 'bg-[#F5F1E8]'} hover:opacity-80 transition-opacity text-center`}
              >
                {theme === 'dark' ? (
                  <span className="flex items-center justify-center gap-2 text-[#D4A574]">
                    <Sun size={18} /> Light
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 text-[#5C5346]">
                    <Moon size={18} /> Dark
                  </span>
                )}
              </button>

              <button
                onClick={toggleLanguage}
                className={`flex-1 px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-[#252320]' : 'bg-[#F5F1E8]'} hover:opacity-80 transition-opacity`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Globe size={16} className="text-[#D4A574]" />
                  <span className={`text-sm ${theme === 'dark' ? 'text-[#F5F1E8]' : 'text-[#2C2416]'}`}>
                    {language === 'en' ? 'PT-BR' : 'EN-US'}
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}