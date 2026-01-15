import { useState, useEffect } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ChevronDown, Trophy, Award, Users } from 'lucide-react';
import { useApp } from '../App';
import { fullTranslations } from '../utils/translations';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { teamImages } from '../utils/imageAssets';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const { theme, language } = useApp();
  const t = fullTranslations[language];
  const [content, setContent] = useState<any>({});
  const [websiteImages, setWebsiteImages] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
    loadWebsiteImages();

    const handleContentUpdate = (event: any) => {
      if (event.detail?.home) {
        setContent(event.detail.home);
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
      setContent(data.content?.home || {});
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWebsiteImages = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5881ae94/website-images`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      setWebsiteImages(data.images || {});
    } catch (error) {
      console.error('Error loading website images:', error);
    }
  };

  // Helper function to get content with fallback to translations
  const getContent = (path: string) => {
    const keys = path.split('.');
    let value = content;
    
    for (const key of keys) {
      if (value && value[key] !== undefined) {
        value = value[key];
      } else {
        // Fallback to translations
        return null;
      }
    }
    
    // If it's a bilingual field, return the current language
    if (value && typeof value === 'object' && (value.en || value.pt)) {
      return value[language] || value.en || '';
    }
    
    return value || null;
  };

  const achievements = [
    {
      icon: Award,
      title: getContent('achievements.connect') || (t.achievements?.connect || 'Team Attributes'),
      year: getContent('achievements.connectYear') || '2024',
      description: getContent('achievements.connectDesc') || (t.achievements?.connectDesc || 'First award at regional competition'),
    },
    {
      icon: Trophy,
      title: getContent('achievements.winning') || (t.achievements?.winning || 'Winning Alliance'),
      year: getContent('achievements.winningYear') || '2025',
      description: getContent('achievements.winningDesc') || (t.achievements?.winningDesc || 'Championship winning alliance'),
    },
    {
      icon: Award,
      title: getContent('achievements.control') || (t.achievements?.control || 'Control Award'),
      year: getContent('achievements.controlYear') || '2025',
      description: getContent('achievements.controlDesc') || (t.achievements?.controlDesc || 'Excellence in robot control systems'),
    },
  ];

  const stats = [
    { label: getContent('stats.competitions') || (t.stats?.competitions || 'Competitions'), value: getContent('stats.competitionsValue') || '3' },
    { label: getContent('stats.awards') || (t.stats?.awards || 'Awards'), value: getContent('stats.awardsValue') || '3' },
    { label: getContent('stats.members') || (t.stats?.members || 'Team Members'), value: getContent('stats.membersValue') || '15' },
    { label: getContent('stats.founded') || (t.stats?.founded || 'Year Founded'), value: getContent('stats.foundedValue') || '2024' },
  ];

  const bgPrimary = theme === 'dark' ? 'bg-[#0F0E0D]' : 'bg-[#F5F1E8]';
  const bgSecondary = theme === 'dark' ? 'bg-[#1A1816]' : 'bg-[#FDFBF7]';
  const bgCard = theme === 'dark' ? 'bg-[#252320]' : 'bg-white';
  const textPrimary = theme === 'dark' ? 'text-[#F5F1E8]' : 'text-[#2C2416]';
  const textSecondary = theme === 'dark' ? 'text-[#C9C2B5]' : 'text-[#5C5346]';
  const borderColor = theme === 'dark' ? 'border-[#3A3632]' : 'border-[#E5DED0]';
  const accentPrimary = theme === 'dark' ? 'text-[#D4A574]' : 'text-[#D4A574]';

  // Show loading state while content is being fetched
  if (loading) {
    return (
      <div className={`min-h-screen ${bgPrimary} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`${textSecondary} text-lg`}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 sm:pt-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={websiteImages.heroBackground || teamImages.fullTeam}
            alt="Team Alphire"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F0E0D]/80 via-[#0F0E0D]/70 to-[#0F0E0D]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img 
            src={getContent('hero.logo') || websiteImages.heroLogo || "https://figma:asset/1c634555781d8c7b6d1909a60ffda035fc42f330.png"}
            alt="ALPHIRE #26456"
            className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto mb-6 sm:mb-10"
          />
          
          <p className="text-lg sm:text-xl md:text-2xl text-white max-w-2xl mx-auto mb-8 sm:mb-10 px-4">
            {getContent('hero.motto') || (language === 'en' ? 'Always in flames!' : 'Sempre em chamas!')}
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 px-4">
            <button
              onClick={() => onNavigate('about-team')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#D4A574] text-white rounded-lg hover:bg-[#E5B685] transition-colors"
            >
              {getContent('hero.buttonLearn') || t.learnMore}
            </button>
            <button
              onClick={() => onNavigate('about-website')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-transparent text-[#D4A574] border border-[#D4A574] rounded-lg hover:bg-[#D4A574]/10 transition-colors"
            >
              {getContent('hero.buttonAchievements') || t.ourAchievements}
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="text-[#D4A574]" size={32} />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`py-12 sm:py-16 md:py-24 ${bgSecondary} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Image */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4A574]/20 to-[#9FBF8F]/20 rounded-2xl blur-3xl"></div>
              <img
                src={websiteImages.aboutTeamPhoto || teamImages.teamSaluting}
                alt="Team Alphire"
                className={`relative rounded-2xl w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover border ${borderColor}`}
              />
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <div className="inline-block px-3 sm:px-4 py-2 bg-[#D4A574]/10 border border-[#D4A574]/30 rounded-full mb-4 sm:mb-6">
                <span className="text-[#D4A574] text-sm sm:text-base">{getContent('about.badge') || t.aboutUs}</span>
              </div>
              
              <h2 className={`text-3xl sm:text-4xl ${textPrimary} mb-4 sm:mb-6`}>
                {getContent('about.title') || t.whoWeAre}
              </h2>
              
              <p className={`${textSecondary} mb-4 sm:mb-6 text-sm sm:text-base`}>
                {getContent('about.description1') || t.description1}
              </p>
              
              <p className={`${textSecondary} mb-6 sm:mb-8 text-sm sm:text-base`}>
                {getContent('about.description2') || t.description2}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-12 sm:py-16 md:py-24 ${bgPrimary} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`text-center p-4 sm:p-6 ${bgCard} border ${borderColor} rounded-xl hover:border-[#D4A574]/40 transition-colors`}
              >
                <div className="text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#D4A574] to-[#9FBF8F] mb-2">
                  {stat.value}
                </div>
                <div className={`${textSecondary} text-xs sm:text-sm`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className={`py-12 sm:py-16 md:py-24 ${bgSecondary} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block px-3 sm:px-4 py-2 bg-[#D4A574]/10 border border-[#D4A574]/30 rounded-full mb-4 sm:mb-6">
              <span className="text-[#D4A574] text-sm sm:text-base">{getContent('achievements.badge') || (t.achievements?.title || 'Our Achievements')}</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl ${textPrimary} mb-4 sm:mb-6`}>
              {getContent('achievements.title') || (t.achievements?.title || 'Our Achievements')}
            </h2>
            <p className={`${textSecondary} max-w-2xl mx-auto text-sm sm:text-base px-4`}>
              {getContent('achievements.subtitle') || (t.achievements?.subtitle || 'Celebrating our success in robotics competitions')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {achievements.map((achievement) => (
              <div
                key={achievement.title}
                className={`p-4 sm:p-6 ${bgCard} border ${borderColor} rounded-xl hover:border-[#D4A574]/40 transition-all hover:-translate-y-1`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#D4A574] to-[#9FBF8F] rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <achievement.icon className="text-white" size={20} />
                </div>
                <div className="text-[#D4A574] text-xs sm:text-sm mb-2">{achievement.year}</div>
                <h3 className={`${textPrimary} mb-2 text-sm sm:text-base`}>{achievement.title}</h3>
                <p className={`${textSecondary} text-xs sm:text-sm`}>{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}