import { Globe, Users, BookOpen, Share2, Target, Lightbulb, Heart, Code } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useApp } from '../App';
import { fullTranslations } from '../utils/translations';
import { useContent } from '../hooks/useContent';
import teamImage from 'figma:asset/8d2127b1af741bd339be0567a854a57b5558818c.png';

interface AboutWebsiteProps {
  onNavigate?: (page: string) => void;
}

export function AboutWebsite({ onNavigate }: AboutWebsiteProps) {
  const { theme, language } = useApp();
  const t = fullTranslations[language].aboutWebsite;
  const { getImage } = useContent('aboutWebsite');

  const goals = [
    {
      icon: Share2,
      title: language === 'en' ? 'Share Knowledge' : 'Compartilhar Conhecimento',
      description: language === 'en' 
        ? 'Document and share robot designs, code, and strategies with teams worldwide'
        : 'Documentar e compartilhar designs de robôs, código e estratégias com equipes em todo o mundo'
    },
    {
      icon: BookOpen,
      title: language === 'en' ? 'Educational Resource' : 'Recurso Educacional',
      description: language === 'en'
        ? 'Provide learning materials and inspiration for new teams starting their FTC journey'
        : 'Fornecer materiais de aprendizagem e inspiração para novas equipes iniciando sua jornada FTC'
    },
    {
      icon: Users,
      title: language === 'en' ? 'Build Community' : 'Construir Comunidade',
      description: language === 'en'
        ? 'Connect teams across Brazil and strengthen the FIRST community in Latin America'
        : 'Conectar equipes em todo o Brasil e fortalecer a comunidade FIRST na América Latina'
    },
    {
      icon: Lightbulb,
      title: language === 'en' ? 'Inspire Innovation' : 'Inspirar Inovação',
      description: language === 'en'
        ? 'Showcase creative solutions and encourage teams to think outside the box'
        : 'Mostrar soluções criativas e encorajar equipes a pensar fora da caixa'
    },
  ];

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
            <span className="text-red-500">{language === 'en' ? 'Our Mission' : 'Nossa Missão'}</span>
          </div>
          <h1 className={`text-4xl ${textColor} mb-6`}>
            {t.title}
          </h1>
          <p className={`${subtextColor} max-w-2xl mx-auto`}>
            {t.subtitle}
          </p>
        </div>

        {/* Hero Section */}
        <div className={`p-8 md:p-12 ${sectionBg} border ${borderColor} rounded-2xl mb-16`}>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Globe className="text-red-500" size={32} />
                <h2 className={`text-3xl ${textColor}`}>
                  {language === 'en' ? 'Knowledge for All' : 'Conhecimento para Todos'}
                </h2>
              </div>
              <p className={`${subtextColor} leading-relaxed mb-6`}>
                {language === 'en'
                  ? 'In FIRST Tech Challenge, one of our core values is Coopertition® - the idea that teams can and should help each other while competing. This website embodies that principle by creating a platform where teams from Brazil and around the world can share their innovations, learn from each other, and grow together.'
                  : 'No FIRST Tech Challenge, um de nossos valores fundamentais é Coopertition® - a ideia de que as equipes podem e devem se ajudar enquanto competem. Este site incorpora esse princípio ao criar uma plataforma onde equipes do Brasil e de todo o mundo podem compartilhar suas inovações, aprender umas com as outras e crescer juntas.'}
              </p>
              <p className={`${subtextColor} leading-relaxed`}>
                {language === 'en'
                  ? 'We believe that by openly sharing our designs, code, and experiences, we make the entire FIRST community stronger. Every robot documented here represents countless hours of work, creativity, and problem-solving - knowledge that should be celebrated and shared, not hidden.'
                  : 'Acreditamos que ao compartilhar abertamente nossos designs, código e experiências, tornamos toda a comunidade FIRST mais forte. Cada robô documentado aqui representa inúmeras horas de trabalho, criatividade e resolução de problemas - conhecimento que deve ser celebrado e compartilhado, não escondido.'}
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-700/20 rounded-2xl blur-3xl"></div>
              <img
                src={teamImage}
                alt="FIRST Team"
                className={`relative rounded-2xl w-full h-auto object-cover border ${borderColor}`}
              />
            </div>
          </div>
        </div>

        {/* Goals */}
        <div className="mb-16">
          <h2 className={`text-3xl ${textColor} mb-8 text-center`}>
            {language === 'en' ? 'Our Goals' : 'Nossos Objetivos'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <div
                key={goal.title}
                className={`p-6 ${cardBg} border ${borderColor} rounded-xl hover:border-red-500/40 transition-all hover:-translate-y-1`}
              >
                <goal.icon className="text-red-500 mb-4" size={32} />
                <h3 className={`text-xl ${textColor} mb-3`}>{goal.title}</h3>
                <p className={`${subtextColor}`}>{goal.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className={`p-8 ${sectionBg} border border-red-500/30 rounded-2xl text-center`}>
          <h2 className={`text-2xl ${textColor} mb-4`}>
            {language === 'en' ? 'Join Our Mission' : 'Junte-se à Nossa Missão'}
          </h2>
          <p className={`${subtextColor} mb-6 max-w-2xl mx-auto`}>
            {language === 'en'
              ? 'If you\'re a FIRST Tech Challenge team and want to share your robot on this platform, we\'d love to feature you! Together, we can build a stronger, more collaborative FTC community in Brazil and beyond.'
              : 'Se você é uma equipe FIRST Tech Challenge e quer compartilhar seu robô nesta plataforma, adoraríamos apresentá-lo! Juntos, podemos construir uma comunidade FTC mais forte e colaborativa no Brasil e além.'}
          </p>
          <button 
            onClick={() => onNavigate?.('contact')}
            className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            {language === 'en' ? 'Contact Us to Submit Your Robot' : 'Entre em Contato para Enviar Seu Robô'}
          </button>
        </div>
      </div>
    </div>
  );
}