import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Users, Target, Lightbulb, Heart, Sparkles, Flame } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useApp } from '../App';
import { fullTranslations } from '../utils/translations';
import { projectId as supabaseProjectId, publicAnonKey } from '../utils/supabase/info';

interface ProjectDetailProps {
  projectId: string;
  onBack: () => void;
}

export function ProjectDetail({ projectId, onBack }: ProjectDetailProps) {
  const { theme, language } = useApp();
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(true);

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
        `https://${supabaseProjectId}.supabase.co/functions/v1/make-server-5881ae94/content`,
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

  const defaultProjects: any = {
    arc: {
      title: 'ARC - Alpha Robotics Competition',
      description: language === 'en' 
        ? 'A LEGO robotics competition we organized to inspire younger students in STEM and robotics'
        : 'Uma competição de robótica LEGO que organizamos para inspirar estudantes mais jovens em STEM e robótica',
      fullDescription: language === 'en'
        ? 'The Alpha Robotics Competition (ARC) is our flagship outreach program designed to introduce elementary and middle school students to the exciting world of robotics. Using LEGO Mindstorms and SPIKE Prime kits, participants learn the fundamentals of engineering, programming, and teamwork through hands-on challenges.'
        : 'A Alpha Robotics Competition (ARC) é nosso programa de divulgação principal projetado para introduzir alunos do ensino fundamental ao emocionante mundo da robótica. Usando kits LEGO Mindstorms e SPIKE Prime, os participantes aprendem os fundamentos de engenharia, programação e trabalho em equipe através de desafios práticos.',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
      icon: Target,
      color: 'from-red-600 to-red-700',
      details: language === 'en' ? [
        'Over 50 students participated in our first edition',
        'Teams designed and built autonomous robots to complete missions',
        'Judges evaluated engineering design, innovation, and teamwork',
        'Winners received LEGO sets and robotics kits'
      ] : [
        'Mais de 50 alunos participaram da nossa primeira edição',
        'Equipes projetaram e construíram robôs autônomos para completar missões',
        'Juízes avaliaram design de engenharia, inovação e trabalho em equipe',
        'Vencedores receberam sets LEGO e kits de robótica'
      ],
      goals: language === 'en' ? [
        'Inspire younger students to pursue STEM careers',
        'Provide hands-on robotics experience',
        'Foster problem-solving and critical thinking skills',
        'Build community interest in FIRST programs'
      ] : [
        'Inspirar estudantes mais jovens a seguir carreiras STEM',
        'Fornecer experiência prática em robótica',
        'Promover habilidades de resolução de problemas e pensamento crítico',
        'Construir interesse comunitário em programas FIRST'
      ]
    },
    sgof: {
      title: 'SGOF - Steam Girls On Fire',
      description: language === 'en'
        ? 'Empowering girls in STEM through hands-on robotics and engineering workshops'
        : 'Capacitando meninas em STEM através de oficinas práticas de robótica e engenharia',
      fullDescription: language === 'en'
        ? 'Steam Girls On Fire (SGOF) is our initiative to encourage more girls to explore STEM fields. Through monthly workshops, mentorship programs, and hands-on projects, we create a supportive environment where girls can discover their potential in science, technology, engineering, and mathematics.'
        : 'Steam Girls On Fire (SGOF) é nossa iniciativa para encorajar mais meninas a explorar campos STEM. Através de workshops mensais, programas de mentoria e projetos práticos, criamos um ambiente de apoio onde as meninas podem descobrir seu potencial em ciência, tecnologia, engenharia e matemática.',
      image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800',
      icon: Sparkles,
      color: 'from-red-500 to-orange-500',
      details: language === 'en' ? [
        '30+ girls participate in our monthly workshops',
        'Topics include robotics, programming, 3D design, and electronics',
        'Female mentors from engineering fields share their experiences',
        'Hands-on projects using Arduino, 3D printers, and coding platforms'
      ] : [
        'Mais de 30 meninas participam de nossos workshops mensais',
        'Tópicos incluem robótica, programação, design 3D e eletrônica',
        'Mentoras de campos de engenharia compartilham suas experiências',
        'Projetos práticos usando Arduino, impressoras 3D e plataformas de programação'
      ],
      goals: language === 'en' ? [
        'Increase female representation in STEM',
        'Provide role models and mentorship',
        'Build confidence in technical skills',
        'Create a supportive community'
      ] : [
        'Aumentar a representação feminina em STEM',
        'Fornecer modelos e mentoria',
        'Construir confiança em habilidades técnicas',
        'Criar uma comunidade de apoio'
      ]
    },
    flames: {
      title: 'Flames and Kindness',
      description: language === 'en'
        ? 'Community outreach program combining robotics demonstrations with social impact'
        : 'Programa de divulgação comunitária combinando demonstrações de robótica com impacto social',
      fullDescription: language === 'en'
        ? 'Flames and Kindness represents our commitment to giving back to the community. We visit schools, community centers, and public events to demonstrate our robots while also conducting food drives, collecting donations, and volunteering. This program shows that STEM and social responsibility go hand in hand.'
        : 'Flames and Kindness representa nosso compromisso em retribuir à comunidade. Visitamos escolas, centros comunitários e eventos públicos para demonstrar nossos robôs enquanto também conduzimos campanhas de alimentos, coletamos doações e fazemos trabalho voluntário. Este programa mostra que STEM e responsabilidade social andam de mãos dadas.',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
      icon: Flame,
      color: 'from-red-600 to-pink-600',
      details: language === 'en' ? [
        'Visited 15+ schools and community centers',
        'Collected over 500kg of food for local food banks',
        'Engaged with 1000+ community members',
        'Demonstrated our FTC robot and explained FIRST values'
      ] : [
        'Visitamos mais de 15 escolas e centros comunitários',
        'Coletamos mais de 500kg de alimentos para bancos de alimentos locais',
        'Engajamos com mais de 1000 membros da comunidade',
        'Demonstramos nosso robô FTC e explicamos os valores FIRST'
      ],
      goals: language === 'en' ? [
        'Give back to our community',
        'Spread awareness about FIRST and robotics',
        'Inspire compassion and social responsibility',
        'Show that engineers can make a difference'
      ] : [
        'Retribuir à nossa comunidade',
        'Espalhar conscientização sobre FIRST e robótica',
        'Inspirar compaixão e responsabilidade social',
        'Mostrar que engenheiros podem fazer a diferença'
      ]
    }
  };

  // Merge database content with defaults
  const defaultData = defaultProjects[projectId];
  if (!defaultData) {
    return (
      <div className={`min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 ${theme === 'dark' ? 'bg-[#0F0E0D]' : 'bg-[#F5F1E8]'} flex items-center justify-center transition-colors duration-300`}>
        <div className="text-center">
          <p className={theme === 'dark' ? 'text-[#8B8275]' : 'text-[#8B8275]'}>Project not found</p>
          <button
            onClick={onBack}
            className="text-red-600 hover:text-red-500 transition-colors"
          >
            {language === 'en' ? 'Back to Projects' : 'Voltar para Projetos'}
          </button>
        </div>
      </div>
    );
  }

  const project = {
    ...defaultData,
    image: getContent(`${projectId}.image`) || defaultData.image,
    title: getContent(`${projectId}.title`) || defaultData.title,
    fullDescription: getContent(`${projectId}.fullDescription`) || defaultData.fullDescription,
    gallery: getContent(`${projectId}.gallery`) || [],
    details: getContent(`${projectId}.details`) || defaultData.details,
    goals: getContent(`${projectId}.goals`) || defaultData.goals
  };

  const bgPrimary = theme === 'dark' ? 'bg-[#0F0E0D]' : 'bg-[#F5F1E8]';
  const bgCard = theme === 'dark' ? 'bg-[#252320]' : 'bg-white';
  const textPrimary = theme === 'dark' ? 'text-[#F5F1E8]' : 'text-[#2C2416]';
  const textSecondary = theme === 'dark' ? 'text-[#C9C2B5]' : 'text-[#5C5346]';
  const borderColor = theme === 'dark' ? 'border-[#3A3632]' : 'border-[#E5DED0]';

  if (loading) {
    return (
      <div className={`min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 ${bgPrimary} flex items-center justify-center transition-colors duration-300`}>
        <div className="text-center">
          <p className={textSecondary}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 ${bgPrimary} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className={`flex items-center gap-2 ${textSecondary} hover:text-red-600 transition-colors mb-6 sm:mb-8`}
        >
          <ArrowLeft size={20} />
          {language === 'en' ? 'Back to Projects' : 'Voltar para Projetos'}
        </button>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 mb-8 sm:mb-12">
          {/* Main Image */}
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20 rounded-2xl blur-3xl`}></div>
            <ImageWithFallback
              src={project.image}
              alt={project.title}
              className={`relative rounded-2xl w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover border ${borderColor}`}
            />
          </div>

          {/* Content */}
          <div>
            <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${project.color} rounded-xl flex items-center justify-center mb-4 sm:mb-6`}>
              <project.icon className="text-white" size={28} />
            </div>

            <h1 className={`text-3xl sm:text-4xl ${textPrimary} mb-4 sm:mb-6`}>
              {project.title}
            </h1>

            <p className={`${textSecondary} leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base`}>
              {project.fullDescription}
            </p>

            {/* Details */}
            <div className="mb-6 sm:mb-8">
              <h2 className={`text-xl sm:text-2xl ${textPrimary} mb-4`}>
                {language === 'en' ? 'Highlights' : 'Destaques'}
              </h2>
              <div className="space-y-3">
                {project.details.map((detail: string, index: number) => (
                  <div key={index} className={`flex items-start gap-3 ${textSecondary} text-sm sm:text-base`}>
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${project.color} mt-2 flex-shrink-0`}></div>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div className={`p-4 sm:p-6 ${bgCard} border ${borderColor} rounded-xl`}>
              <h3 className={`text-lg sm:text-xl ${textPrimary} mb-4`}>
                {language === 'en' ? 'Our Goals' : 'Nossos Objetivos'}
              </h3>
              <div className="space-y-2">
                {project.goals.map((goal: string, index: number) => (
                  <div key={index} className={`flex items-start gap-3 ${textSecondary} text-sm sm:text-base`}>
                    <Lightbulb className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
                    <span>{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="mb-8 sm:mb-12">
            <h2 className={`text-2xl sm:text-3xl ${textPrimary} mb-6 text-center`}>
              {language === 'en' ? 'Gallery' : 'Galeria'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {project.gallery.map((imageUrl: string, index: number) => (
                <div key={index} className={`relative aspect-square rounded-xl overflow-hidden border ${borderColor}`}>
                  <ImageWithFallback
                    src={imageUrl}
                    alt={`${project.title} - Photo ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}