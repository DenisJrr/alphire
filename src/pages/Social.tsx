import { useState, useEffect } from 'react';
import { Instagram, Mail, ExternalLink, Music } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useApp } from '../App';
import { fullTranslations } from '../utils/translations';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function Social() {
  const { theme, language } = useApp();
  const t = fullTranslations[language].social;
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [content, setContent] = useState<any>({});

  useEffect(() => {
    loadPosts();
    loadContent();

    const handleContentUpdate = (event: any) => {
      if (event.detail?.social) {
        setContent(event.detail.social);
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
      setContent(data.content?.social || {});
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

  const loadPosts = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5881ae94/posts`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      setRecentPosts(data.posts || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const socialLinks = [
    {
      platform: 'Instagram',
      icon: Instagram,
      handle: '@alphire26456',
      url: 'https://www.instagram.com/alphire26456',
      color: 'from-purple-500 to-pink-500',
    },
    {
      platform: 'TikTok',
      icon: Music,
      handle: '@alphire26456',
      url: 'https://www.tiktok.com/@alphire26456',
      color: 'from-[#D4A574] to-[#C49563]',
    },
  ];



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
          <div className="inline-block px-3 sm:px-4 py-2 bg-[#D4A574]/10 border border-[#D4A574]/30 rounded-full mb-4 sm:mb-6">
            <span className="text-[#D4A574] text-sm sm:text-base">{getContent('header.badge') || (language === 'en' ? 'Connect With Us' : 'Conecte-se Conosco')}</span>
          </div>
          <h1 className={`text-3xl sm:text-4xl ${textPrimary} mb-4 sm:mb-6`}>
            {getContent('header.title') || t.title}
          </h1>
          <p className={`${textSecondary} max-w-2xl mx-auto text-sm sm:text-base px-4`}>
            {getContent('header.subtitle') || t.subtitle}
          </p>
        </div>

        {/* Social Media Cards */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {socialLinks.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group p-6 sm:p-8 ${bgCard} border ${borderColor} rounded-xl hover:border-[#D4A574]/40 transition-all hover:-translate-y-1`}
            >
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${social.color} rounded-xl flex items-center justify-center`}>
                  <social.icon className="text-white" size={28} />
                </div>
                <ExternalLink className={`${textMuted} group-hover:text-[#D4A574] transition-colors`} size={18} />
              </div>
              
              <h3 className={`text-xl sm:text-2xl ${textPrimary} mb-2`}>{social.platform}</h3>
              <p className="text-[#D4A574] mb-3 sm:mb-4 text-sm sm:text-base">{social.handle}</p>
            </a>
          ))}
        </div>

        {/* Recent Posts */}
        <div className="mb-12 sm:mb-16">
          <h2 className={`text-2xl sm:text-3xl ${textPrimary} mb-6 sm:mb-8 text-center`}>{t.latest}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
            {recentPosts.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className={textSecondary}>
                  {getContent('noPosts.en') || getContent('noPosts.pt') || (language === 'en' ? 'No posts yet. Check back soon!' : 'Nenhum post ainda. Volte em breve!')}
                </p>
              </div>
            )}
            {recentPosts.map((post) => (
              <a
                key={post.id}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`group aspect-square ${bgCard} border ${borderColor} rounded-xl overflow-hidden hover:border-[#D4A574]/40 transition-colors relative`}
              >
                {post.image && (
                  <ImageWithFallback
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 sm:p-4 flex items-end">
                  <p className="text-white text-xs sm:text-sm">{post.title}</p>
                </div>
              </a>
            ))}
          </div>
          <div className="text-center mt-6 sm:mt-8">
            <a
              href="https://www.instagram.com/alphire26456"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base"
            >
              <Instagram size={18} />
              {t.viewProfile}
            </a>
          </div>
        </div>

        {/* Contact Section */}
        <div className={`max-w-2xl mx-auto p-6 sm:p-8 ${bgCard} border ${borderColor} rounded-xl text-center`}>
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#D4A574] to-[#9FBF8F] rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Mail className="text-white" size={28} />
          </div>
          <h3 className={`text-xl sm:text-2xl ${textPrimary} mb-3 sm:mb-4`}>{t.contact}</h3>
          <p className={`${textSecondary} mb-4 sm:mb-6 text-sm sm:text-base`}>
            {t.contactDesc}
          </p>
          <a
            href="mailto:team26456@example.com"
            className="inline-block w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#D4A574] text-white rounded-lg hover:bg-[#E5B685] transition-colors text-sm sm:text-base"
          >
            {t.email}
          </a>
        </div>
      </div>
    </div>
  );
}