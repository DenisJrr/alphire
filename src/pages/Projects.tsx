import { useState, useEffect } from 'react';
import { Blocks, Sparkles, Heart, Users, Target, Flame } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useApp } from '../App';
import { fullTranslations } from '../utils/translations';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ProjectsProps {
  onSelectProject: (id: string) => void;
  onNavigate?: (page: string) => void;
}

export function Projects({ onSelectProject, onNavigate }: ProjectsProps) {
  const { theme, language } = useApp();
  const t = fullTranslations[language].projects;
  const [content, setContent] = useState<any>({});

  useEffect(() => {
    loadContent();

    const handleContentUpdate = (event: any) => {
      if (event.detail?.projects) {
        setContent(event.detail.projects);
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
      setContent(data.content?.projects || {});
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

  // Default project data
  const defaultProjects = {
    arc: {
      name: language === 'en' ? 'ARC - Alpha Robotics Competition' : 'ARC - Competição Alpha de Robótica',
      description: language === 'en' 
        ? 'A LEGO robotics competition we organized to inspire younger students in STEM and robotics'
        : 'Uma competição de robótica LEGO que organizamos para inspirar estudantes mais jovens em STEM e robótica',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    },
    sgof: {
      name: language === 'en' ? 'SGOF - Steam Girls On Fire' : 'SGOF - Steam Girls On Fire',
      description: language === 'en'
        ? 'Empowering girls in STEM through hands-on robotics and engineering workshops'
        : 'Capacitando meninas em STEM através de oficinas práticas de robótica e engenharia',
      image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800',
    },
    flames: {
      name: language === 'en' ? 'Flames and Kindness' : 'Flames and Kindness',
      description: language === 'en'
        ? 'Community outreach program combining robotics demonstrations with social impact'
        : 'Programa de divulgação comunitária combinando demonstrações de robótica com impacto social',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
    },
  };

  const projects = [
    {
      id: 'arc',
      icon: Target,
      color: 'from-red-600 to-red-700',
      image: getContent('arc.image') || defaultProjects.arc.image,
      name: getContent('arc.name') || defaultProjects.arc.name,
      description: getContent('arc.description') || defaultProjects.arc.description,
    },
    {
      id: 'sgof',
      icon: Sparkles,
      color: 'from-red-500 to-orange-500',
      image: getContent('sgof.image') || defaultProjects.sgof.image,
      name: getContent('sgof.name') || defaultProjects.sgof.name,
      description: getContent('sgof.description') || defaultProjects.sgof.description,
    },
    {
      id: 'flames',
      icon: Flame,
      color: 'from-red-600 to-pink-600',
      image: getContent('flames.image') || defaultProjects.flames.image,
      name: getContent('flames.name') || defaultProjects.flames.name,
      description: getContent('flames.description') || defaultProjects.flames.description,
    },
  ];

  const bgPrimary = theme === 'dark' ? 'bg-[#0F0E0D]' : 'bg-[#F5F1E8]';
  const bgCard = theme === 'dark' ? 'bg-[#252320]' : 'bg-white';
  const textPrimary = theme === 'dark' ? 'text-[#F5F1E8]' : 'text-[#2C2416]';
  const textSecondary = theme === 'dark' ? 'text-[#C9C2B5]' : 'text-[#5C5346]';
  const borderColor = theme === 'dark' ? 'border-[#3A3632]' : 'border-[#E5DED0]';

  return (
    <div className={`min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 ${bgPrimary} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block px-3 sm:px-4 py-2 bg-[#D4A574]/10 border border-[#D4A574]/30 rounded-full mb-4 sm:mb-6">
            <span className="text-[#D4A574] text-sm sm:text-base">{getContent('header.badge') || (language === 'en' ? 'Community Impact' : 'Impacto Comunitário')}</span>
          </div>
          <h1 className={`text-3xl sm:text-4xl ${textPrimary} mb-4 sm:mb-6`}>
            {getContent('header.title') || (language === 'en' ? 'Our Projects' : 'Nossos Projetos')}
          </h1>
          <p className={`${textSecondary} max-w-2xl mx-auto text-sm sm:text-base px-4`}>
            {getContent('header.subtitle') || (language === 'en' ? 'Making a difference through education and innovation' : 'Fazendo a diferença através da educação e inovação')}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project) => {
            return (
              <button
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                className={`group text-left ${bgCard} border ${borderColor} rounded-2xl overflow-hidden hover:border-red-500/60 transition-all hover:-translate-y-1`}
              >
                {/* Image */}
                <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-[#D4A574]/20 to-[#9FBF8F]/20">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-br ${project.color} rounded-full flex items-center justify-center`}>
                    <project.icon className="text-white" size={24} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <h3 className={`text-lg sm:text-xl ${textPrimary} mb-2 sm:mb-3`}>
                    {project.name}
                  </h3>
                  <p className={`${textSecondary} text-sm sm:text-base leading-relaxed`}>
                    {project.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className={`mt-12 sm:mt-16 p-6 sm:p-8 ${bgCard} border border-[#D4A574]/30 rounded-2xl text-center`}>
          <Users className="text-[#D4A574] mx-auto mb-4" size={40} />
          <h3 className={`text-xl sm:text-2xl ${textPrimary} mb-3 sm:mb-4`}>
            {getContent('cta.title') || (language === 'en' ? 'Want to Get Involved?' : 'Quer Participar?')}
          </h3>
          <p className={`${textSecondary} mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base`}>
            {getContent('cta.description') || (language === 'en' ? 'Join us in making a positive impact through robotics and STEM education.' : 'Junte-se a nós para causar um impacto positivo através da robótica e educação STEM.')}
          </p>
          <button className="px-6 sm:px-8 py-3 bg-[#D4A574] text-white rounded-lg hover:bg-[#E5B685] transition-colors w-full sm:w-auto" onClick={() => onNavigate?.('contact')}>
            {getContent('cta.buttonText') || (language === 'en' ? 'Contact Us' : 'Entre em Contato')}
          </button>
        </div>
      </div>
    </div>
  );
}