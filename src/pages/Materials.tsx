import { FileText, Download, Image, Video, Code, Book, GraduationCap, ArrowRight, Folder, Archive, File, HardDrive } from 'lucide-react';
import { useApp } from '../App';
import { fullTranslations } from '../utils/translations';
import { useState, useEffect } from 'react';
import { projectId as supabaseProjectId, publicAnonKey } from '../utils/supabase/info';

interface MaterialsProps {
  onNavigate?: (page: string) => void;
}

export function Materials({ onNavigate }: MaterialsProps) {
  const { theme, language } = useApp();
  const t = fullTranslations[language].materials;
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();

    const handleContentUpdate = (event: any) => {
      if (event.detail?.materials) {
        setContent(event.detail.materials);
      }
    };

    window.addEventListener('contentUpdated', handleContentUpdate);
    return () => window.removeEventListener('contentUpdated', handleContentUpdate);
  }, []);

  const loadContent = async () => {
    try {
      const response = await fetch(
        `https://${supabaseProjectId}.supabase.co/functions/v1/make-server-5881ae94/content`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      setContent(data.content?.materials || {});
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
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

  // Icon mapping
  const getIconComponent = (iconName: string) => {
    const icons: any = {
      Book, FileText, Code, Image, Video, GraduationCap, 
      Folder, Archive, File, HardDrive
    };
    return icons[iconName] || Book;
  };

  // Get categories from database
  const categoriesFromDB = getContent('categories.items') || [];
  
  // Build categories array
  const categories = categoriesFromDB.map((cat: any) => ({
    title: cat.title?.[language] || cat.title?.en || '',
    icon: getIconComponent(cat.icon || 'Book'),
    items: (cat.materials || []).map((material: any) => ({
      name: material.name?.[language] || material.name?.en || '',
      season: material.season || '2024-2025',
      link: material.link || '#'
    })),
    color: cat.color || 'from-red-600 to-red-700'
  }));

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
            <span className="text-red-600 text-sm sm:text-base">{language === 'en' ? 'Resources' : 'Recursos'}</span>
          </div>
          <h1 className={`text-3xl sm:text-4xl ${textPrimary} mb-4 sm:mb-6`}>
            {t.title}
          </h1>
          <p className={`${textSecondary} max-w-2xl mx-auto text-sm sm:text-base px-4`}>
            {t.subtitle}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {categories.map((category) => (
            <div
              key={category.title}
              className={`${bgCard} border ${borderColor} rounded-2xl p-4 sm:p-6 hover:border-red-500/40 transition-colors`}
            >
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center`}>
                  <category.icon className="text-white" size={20} />
                </div>
                <h2 className={`text-xl sm:text-2xl ${textPrimary}`}>{category.title}</h2>
              </div>

              <div className="space-y-3">
                {category.items.map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    className={`block p-3 sm:p-4 border ${borderColor} rounded-lg hover:border-red-500/40 transition-colors group`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className={`${textPrimary} group-hover:text-red-600 transition-colors text-sm sm:text-base mb-1`}>
                          {item.name}
                        </h3>
                        <p className={`${textMuted} text-xs sm:text-sm`}>{item.season}</p>
                      </div>
                      <Download className={`${textMuted} group-hover:text-red-600 transition-colors flex-shrink-0`} size={18} />
                    </div>
                  </a>
                ))}
              </div>

              {category.hasViewMore && onNavigate && (
                <button
                  onClick={() => onNavigate('educational-materials')}
                  className="w-full mt-4 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {language === 'en' ? 'View More Educational Materials' : 'Ver Mais Materiais Educacionais'}
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}