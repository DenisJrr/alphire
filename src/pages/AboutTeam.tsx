import { useState, useEffect } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Calendar, MapPin, Users, School, Target, Rocket, Award, Heart } from 'lucide-react';
import { useApp } from '../App';
import { fullTranslations } from '../utils/translations';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function AboutTeam() {
  const { theme, language } = useApp();
  const t = fullTranslations[language].aboutTeam;
  const [content, setContent] = useState<any>({});

  useEffect(() => {
    loadContent();

    const handleContentUpdate = (event: any) => {
      if (event.detail?.aboutTeam) {
        setContent(event.detail.aboutTeam);
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
      setContent(data.content?.aboutTeam || {});
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

  const timeline = [
    { 
      year: getContent('timeline.event1Year'), 
      event: getContent('timeline.event1Title'), 
      description: getContent('timeline.event1Desc') 
    },
    { 
      year: getContent('timeline.event2Year'), 
      event: getContent('timeline.event2Title'), 
      description: getContent('timeline.event2Desc') 
    },
    { 
      year: getContent('timeline.event3Year'), 
      event: getContent('timeline.event3Title'), 
      description: getContent('timeline.event3Desc') 
    },
    { 
      year: getContent('timeline.event4Year'), 
      event: getContent('timeline.event4Title'), 
      description: getContent('timeline.event4Desc') 
    },
  ].filter(item => item.event); // Only show timeline events that have data

  const areas = [
    { 
      icon: Award, 
      title: getContent('areas.admMarketing'), 
      description: getContent('areas.admMarketingDesc') 
    },
    { 
      icon: Target, 
      title: getContent('areas.eletProg'), 
      description: getContent('areas.eletProgDesc') 
    },
    { 
      icon: Rocket, 
      title: getContent('areas.mecCAD'), 
      description: getContent('areas.mecCADDesc') 
    },
  ].filter(area => area.title); // Only show areas that have data

  const bgColor = theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50';
  const sectionBg = theme === 'dark' ? 'bg-slate-900' : 'bg-white';
  const cardBg = theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subtextColor = theme === 'dark' ? 'text-slate-300' : 'text-gray-600';
  const mutedColor = theme === 'dark' ? 'text-slate-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-red-500/20' : 'border-red-200';

  return (
    <div className={`min-h-screen pt-24 pb-16 ${bgColor} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-6">
            <span className="text-red-500">{getContent('header.badge') || (language === 'en' ? 'Our Story' : 'Nossa História')}</span>
          </div>
          <h1 className={`text-4xl ${textColor} mb-6`}>
            {getContent('header.title') || t.title}
          </h1>
          <p className={`${subtextColor} max-w-2xl mx-auto`}>
            {getContent('header.subtitle') || t.subtitle}
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-16">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-700/20 rounded-2xl blur-3xl"></div>
            <ImageWithFallback
              src={getContent('header.heroImage') || "https://images.unsplash.com/photo-1728933102332-a4f1a281a621?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY0MjA1NDI5fDA&ixlib=rb-4.1.0&q=80&w=1080"}
              alt="Team Alphire"
              className={`relative rounded-2xl w-full h-[500px] object-cover border ${borderColor}`}
            />
          </div>
        </div>

        {/* School & Location Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className={`p-6 ${sectionBg} border ${borderColor} rounded-xl`}>
            <School className="text-red-500 mb-3" size={28} />
            <h3 className={`${textColor} mb-2`}>{getContent('schoolInfo.schoolLabel') || (language === 'en' ? 'School' : 'Escola')}</h3>
            <p className={subtextColor}>{getContent('schoolInfo.schoolName') || (language === 'en' ? 'Instituto Tecnológico' : 'Instituto Tecnológico')}</p>
          </div>
          <div className={`p-6 ${sectionBg} border ${borderColor} rounded-xl`}>
            <MapPin className="text-red-500 mb-3" size={28} />
            <h3 className={`${textColor} mb-2`}>{getContent('schoolInfo.locationLabel') || (language === 'en' ? 'Location' : 'Localização')}</h3>
            <p className={subtextColor}>{getContent('schoolInfo.locationName') || 'São Paulo, Brazil'}</p>
          </div>
          <div className={`p-6 ${sectionBg} border ${borderColor} rounded-xl`}>
            <Calendar className="text-red-500 mb-3" size={28} />
            <h3 className={`${textColor} mb-2`}>{getContent('schoolInfo.foundedLabel') || (language === 'en' ? 'Founded' : 'Fundado')}</h3>
            <p className={subtextColor}>{getContent('schoolInfo.foundedYear') || '2024'}</p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className={`p-8 ${sectionBg} border ${borderColor} rounded-2xl mb-16`}>
          <h2 className={`text-2xl ${textColor} mb-4`}>
            {getContent('mission.title') || (language === 'en' ? 'Our Mission' : 'Nossa Missão')}
          </h2>
          <p className={`${subtextColor} leading-relaxed text-lg`}>
            {getContent('mission.text') || (language === 'en' 
              ? 'Team Alphire is dedicated to inspiring young minds through robotics and STEM education. We believe in the power of collaboration, innovation, and gracious professionalism. Our mission is to create a positive impact in our community while developing the skills and knowledge necessary to become future leaders in technology and engineering.'
              : 'O Time Alphire é dedicado a inspirar mentes jovens através da robótica e educação STEM. Acreditamos no poder da colaboração, inovação e profissionalismo gracioso. Nossa missão é criar um impacto positivo em nossa comunidade enquanto desenvolvemos as habilidades e conhecimentos necessários para nos tornarmos futuros líderes em tecnologia e engenharia.')}
          </p>
        </div>

        {/* Team Areas */}
        <div className="mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            {areas.map((area) => (
              <div
                key={area.title}
                className={`p-6 ${cardBg} border ${borderColor} rounded-xl text-center hover:border-red-500/40 transition-all hover:-translate-y-1`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <area.icon className="text-white" size={28} />
                </div>
                <h3 className={`${textColor} mb-2`}>{area.title}</h3>
                <p className={`${mutedColor} text-sm`}>{area.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <div className="space-y-4">
            {timeline.map((item, index) => (
              <div
                key={index}
                className={`p-6 ${sectionBg} border ${borderColor} rounded-xl hover:border-red-500/40 transition-colors`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white">{item.year}</span>
                  </div>
                  <div>
                    <h3 className={`text-xl ${textColor} mb-2`}>{item.event}</h3>
                    <p className={subtextColor}>{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Values */}
        <div className={`p-8 ${sectionBg} border ${borderColor} rounded-2xl`}>
          <h2 className={`text-2xl ${textColor} mb-6 text-center`}>
            {getContent('values.title') || (language === 'en' ? 'Our Values' : 'Nossos Valores')}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Users className="text-red-500 mx-auto mb-3" size={32} />
              <h3 className={`${textColor} mb-2`}>{getContent('values.teamwork') || (language === 'en' ? 'Teamwork' : 'Trabalho em Equipe')}</h3>
              <p className={`${mutedColor} text-sm`}>
                {getContent('values.teamworkDesc') || (language === 'en' 
                  ? 'We succeed together through collaboration' 
                  : 'Temos sucesso juntos através da colaboração')}
              </p>
            </div>
            <div className="text-center">
              <Rocket className="text-red-500 mx-auto mb-3" size={32} />
              <h3 className={`${textColor} mb-2`}>{getContent('values.innovation') || (language === 'en' ? 'Innovation' : 'Inovação')}</h3>
              <p className={`${mutedColor} text-sm`}>
                {getContent('values.innovationDesc') || (language === 'en' 
                  ? 'We push boundaries with creative solutions' 
                  : 'Ultrapassamos limites com soluções criativas')}
              </p>
            </div>
            <div className="text-center">
              <Heart className="text-red-500 mx-auto mb-3" size={32} />
              <h3 className={`${textColor} mb-2`}>{getContent('values.community') || (language === 'en' ? 'Community' : 'Comunidade')}</h3>
              <p className={`${mutedColor} text-sm`}>
                {getContent('values.communityDesc') || (language === 'en' 
                  ? 'We give back and inspire others' 
                  : 'Retribuímos e inspiramos outros')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}