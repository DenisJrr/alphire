import { useState, useEffect } from 'react';
import { Heart, ExternalLink } from 'lucide-react';
import { useApp } from '../App';
import { fullTranslations } from '../utils/translations';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function Sponsors() {
  const { theme, language } = useApp();
  const t = fullTranslations[language].sponsors;
  const [content, setContent] = useState<any>({});

  useEffect(() => {
    loadContent();

    const handleContentUpdate = (event: any) => {
      if (event.detail?.sponsors) {
        setContent(event.detail.sponsors);
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
      setContent(data.content?.sponsors || {});
    } catch (error) {
      console.error('Error loading content:', error);
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

  const mainSponsors = getContent('sponsorsList.items') || [];

  const getSponsorDescription = (sponsor: any) => {
    if (sponsor.description && typeof sponsor.description === 'object' && (sponsor.description.en || sponsor.description.pt)) {
      return sponsor.description[language] || sponsor.description.en || '';
    }
    return sponsor.description || '';
  };

  const bgPrimary = theme === 'dark' ? 'bg-[#0F0E0D]' : 'bg-[#F5F1E8]';
  const bgCard = theme === 'dark' ? 'bg-[#252320]' : 'bg-white';
  const textPrimary = theme === 'dark' ? 'text-[#F5F1E8]' : 'text-[#2C2416]';
  const textSecondary = theme === 'dark' ? 'text-[#C9C2B5]' : 'text-[#5C5346]';
  const textMuted = theme === 'dark' ? 'text-[#8B8275]' : 'text-[#8B8275]';
  const borderColor = theme === 'dark' ? 'border-[#3A3632]' : 'border-[#E5DED0]';

  return (
    <div className={`min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 ${bgPrimary} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block px-3 sm:px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-4 sm:mb-6">
            <span className="text-red-600 text-sm sm:text-base">{getContent('header.badge') || (language === 'en' ? 'Thank You' : 'Obrigado')}</span>
          </div>
          <h1 className={`text-3xl sm:text-4xl ${textPrimary} mb-4 sm:mb-6`}>
            {getContent('header.title') || t.title}
          </h1>
          <p className={`${textSecondary} max-w-2xl mx-auto text-sm sm:text-base px-4`}>
            {getContent('header.subtitle') || t.subtitle}
          </p>
        </div>

        {/* Main Sponsors */}
        <div className="mb-12 sm:mb-16">
          <h2 className={`text-2xl sm:text-3xl ${textPrimary} mb-6 sm:mb-8 text-center`}>
            {getContent('mainSponsors.title') || (language === 'en' ? 'Our Main Sponsors' : 'Nossos Principais Patrocinadores')}
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {mainSponsors.map((sponsor) => (
              <a
                key={sponsor.name}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group p-6 sm:p-8 ${bgCard} border ${borderColor} rounded-2xl hover:border-red-500/60 transition-all hover:-translate-y-1`}
              >
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="flex-shrink-0">
                    {sponsor.logo && sponsor.logo.startsWith('http') ? (
                      <ImageWithFallback 
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center text-2xl sm:text-3xl">
                        {sponsor.logo}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg sm:text-xl ${textPrimary} mb-2 group-hover:text-red-500 transition-colors`}>
                      {sponsor.name}
                    </h3>
                    <p className={`${textSecondary} text-sm sm:text-base mb-3`}>
                      {getSponsorDescription(sponsor)}
                    </p>
                    <div className="flex items-center gap-2 text-red-500 text-sm">
                      <span>{language === 'en' ? 'Visit website' : 'Visitar site'}</span>
                      <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Become a Sponsor CTA */}
        <div className={`p-6 sm:p-8 ${bgCard} border border-red-500/30 rounded-2xl text-center`}>
          <Heart className="text-red-500 mx-auto mb-4" size={40} />
          <h3 className={`text-xl sm:text-2xl ${textPrimary} mb-3 sm:mb-4`}>
            {getContent('cta.title') || (language === 'en' ? 'Become a Sponsor' : 'Torne-se um Patrocinador')}
          </h3>
          <p className={`${textSecondary} mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base`}>
            {getContent('cta.subtitle') || (language === 'en'
              ? 'Support our team and help us continue inspiring the next generation of innovators and engineers.'
              : 'Apoie nossa equipe e nos ajude a continuar inspirando a próxima geração de inovadores e engenheiros.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a 
              href={getContent('cta.becomeButtonLink') || 'mailto:ftc.alphalumen@gmail.com'}
              className="px-6 sm:px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto inline-block text-center"
            >
              {getContent('cta.becomeButton') || (language === 'en' ? 'Become a Sponsor' : 'Tornar-se Patrocinador')}
            </a>
            <a 
              href={getContent('cta.downloadButtonLink') || '#'}
              className={`px-6 sm:px-8 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors w-full sm:w-auto inline-block text-center`}
              download={getContent('cta.downloadButtonLink') ? undefined : false}
            >
              {getContent('cta.downloadButton') || (language === 'en' ? 'Download Sponsorship Package' : 'Baixar Pacote de Patrocínio')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}