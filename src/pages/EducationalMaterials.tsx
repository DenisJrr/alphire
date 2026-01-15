import { Download, BookOpen, Code, Wrench, Lightbulb, Cpu, Zap } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useApp } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function EducationalMaterials() {
  const { theme, language } = useApp();

  const trackDownload = async (materialName: string) => {
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5881ae94/downloads/${materialName}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
    } catch (error) {
      console.error('Error tracking download:', error);
    }
  };

  const materials = [
    {
      title: language === 'en' ? 'Robotics Basics Guide' : 'Guia Básico de Robótica',
      description: language === 'en' 
        ? 'A comprehensive introduction to robotics fundamentals. Learn about robot components, mechanics, and basic engineering principles. Perfect for beginners starting their robotics journey.'
        : 'Uma introdução abrangente aos fundamentos da robótica. Aprenda sobre componentes de robô, mecânica e princípios básicos de engenharia. Perfeito para iniciantes começando sua jornada em robótica.',
      image: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdGljcyUyMHdvcmtzaG9wfGVufDF8fHx8MTc2NDM1NDM5NHww&ixlib=rb-4.1.0&q=80&w=1080',
      icon: Wrench,
      color: 'from-red-600 to-orange-600',
      downloadLink: '#',
    },
    {
      title: language === 'en' ? 'Programming Tutorials' : 'Tutoriais de Programação',
      description: language === 'en'
        ? 'Step-by-step programming tutorials for FTC robots. Covers Java basics, autonomous programming, TeleOp control, and sensor integration. Includes practical examples and exercises.'
        : 'Tutoriais de programação passo a passo para robôs FTC. Cobre conceitos básicos de Java, programação autônoma, controle TeleOp e integração de sensores. Inclui exemplos práticos e exercícios.',
      image: 'https://images.unsplash.com/photo-1509701852059-c221a6f1e878?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBwcm9ncmFtbWluZyUyMHR1dG9yaWFsfGVufDF8fHx8MTc2NDM1OTM5N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      icon: Code,
      color: 'from-blue-600 to-purple-600',
      downloadLink: '#',
    },
    {
      title: language === 'en' ? 'CAD Design Workshop' : 'Workshop de Design CAD',
      description: language === 'en'
        ? 'Learn 3D design for robotics using industry-standard CAD software. Tutorials cover designing robot parts, creating assemblies, and preparing files for manufacturing.'
        : 'Aprenda design 3D para robótica usando software CAD padrão da indústria. Tutoriais cobrem design de peças de robô, criação de montagens e preparação de arquivos para fabricação.',
      image: 'https://images.unsplash.com/photo-1554919700-44be8d14cbcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdpbmVlcmluZyUyMGd1aWRlfGVufDF8fHx8MTc2NDM1OTM5OHww&ixlib=rb-4.1.0&q=80&w=1080',
      icon: BookOpen,
      color: 'from-green-600 to-teal-600',
      downloadLink: '#',
    },
    {
      title: language === 'en' ? 'Electronics Fundamentals' : 'Fundamentos de Eletrônica',
      description: language === 'en'
        ? 'Understanding electronics for robotics. Learn about circuits, motors, sensors, and control systems. Includes wiring diagrams and troubleshooting guides.'
        : 'Entendendo eletrônica para robótica. Aprenda sobre circuitos, motores, sensores e sistemas de controle. Inclui diagramas de fiação e guias de solução de problemas.',
      image: 'https://images.unsplash.com/photo-1577976655502-85300c5ca2cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMGJhc2ljc3xlbnwxfHx8fDE3NjQzNTkzOTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      icon: Cpu,
      color: 'from-yellow-600 to-orange-600',
      downloadLink: '#',
    },
    {
      title: language === 'en' ? 'Problem-Solving Strategies' : 'Estratégias de Resolução de Problemas',
      description: language === 'en'
        ? 'Develop critical thinking skills for robotics challenges. Learn systematic approaches to debugging, design iteration, and optimization. Real competition scenarios included.'
        : 'Desenvolva habilidades de pensamento crítico para desafios de robótica. Aprenda abordagens sistemáticas para depuração, iteração de design e otimização. Cenários de competição reais incluídos.',
      image: 'https://images.unsplash.com/photo-1759922378123-a1f4f1e39bae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBsZWFybmluZ3xlbnwxfHx8fDE3NjQyOTAyNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      icon: Lightbulb,
      color: 'from-pink-600 to-red-600',
      downloadLink: '#',
    },
    {
      title: language === 'en' ? 'STEM Education Resources' : 'Recursos de Educação STEM',
      description: language === 'en'
        ? 'Comprehensive STEM learning materials for students and educators. Covers mathematics, physics, and engineering concepts applied to robotics. Lesson plans and activities included.'
        : 'Materiais abrangentes de aprendizagem STEM para estudantes e educadores. Cobre conceitos de matemática, física e engenharia aplicados à robótica. Planos de aula e atividades incluídos.',
      image: 'https://images.unsplash.com/photo-1695473507919-f9a984f77b14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVtJTIwZWR1Y2F0aW9uJTIwcmVzb3VyY2VzfGVufDF8fHx8MTc2NDM1OTM5OHww&ixlib=rb-4.1.0&q=80&w=1080',
      icon: Zap,
      color: 'from-indigo-600 to-blue-600',
      downloadLink: '#',
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
          <div className="inline-block px-3 sm:px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-4 sm:mb-6">
            <span className="text-red-600 text-sm sm:text-base">
              {language === 'en' ? 'Learning Resources' : 'Recursos de Aprendizagem'}
            </span>
          </div>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl ${textPrimary} mb-4 sm:mb-6`}>
            {language === 'en' ? 'Educational Materials' : 'Materiais Educacionais'}
          </h1>
          <p className={`${textSecondary} max-w-2xl mx-auto text-sm sm:text-base px-4`}>
            {language === 'en'
              ? 'Free educational resources to help you learn robotics, programming, and engineering. Created by Team Alphire to share knowledge with the FIRST community.'
              : 'Recursos educacionais gratuitos para ajudá-lo a aprender robótica, programação e engenharia. Criado pelo Time Alphire para compartilhar conhecimento com a comunidade FIRST.'}
          </p>
        </div>

        {/* Materials Grid */}
        <div className="space-y-8 sm:space-y-12">
          {materials.map((material, index) => (
            <div
              key={index}
              className={`${bgCard} border ${borderColor} rounded-2xl overflow-hidden hover:border-red-500/40 transition-all`}
            >
              <div className={`grid lg:grid-cols-2 gap-6 sm:gap-8 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Image */}
                <div className={`relative h-64 sm:h-80 lg:h-auto ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <ImageWithFallback
                    src={material.image}
                    alt={material.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className={`absolute top-4 left-4 sm:top-6 sm:left-6 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${material.color} rounded-xl flex items-center justify-center`}>
                    <material.icon className="text-white" size={28} />
                  </div>
                </div>

                {/* Content */}
                <div className={`p-6 sm:p-8 flex flex-col justify-center ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <h2 className={`text-2xl sm:text-3xl ${textPrimary} mb-4`}>
                    {material.title}
                  </h2>
                  <p className={`${textSecondary} mb-6 leading-relaxed text-sm sm:text-base`}>
                    {material.description}
                  </p>
                  
                  {/* Stats or Features */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className={`px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-[#1A1816]' : 'bg-gray-100'} text-xs sm:text-sm ${textSecondary}`}>
                      {language === 'en' ? 'Free Download' : 'Download Grátis'}
                    </div>
                    <div className={`px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-[#1A1816]' : 'bg-gray-100'} text-xs sm:text-sm ${textSecondary}`}>
                      PDF Format
                    </div>
                    <div className={`px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-[#1A1816]' : 'bg-gray-100'} text-xs sm:text-sm ${textSecondary}`}>
                      {language === 'en' ? 'Updated 2024' : 'Atualizado 2024'}
                    </div>
                  </div>

                  {/* Download Button */}
                  <a
                    href={material.downloadLink}
                    download
                    onClick={() => trackDownload(material.title.toLowerCase().replace(/\s+/g, '-'))}
                    className={`inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${material.color} text-white rounded-lg hover:opacity-90 transition-opacity w-full sm:w-auto text-sm sm:text-base`}
                  >
                    <Download size={20} />
                    {language === 'en' ? 'Download Material' : 'Baixar Material'}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className={`mt-12 sm:mt-16 max-w-3xl mx-auto p-6 sm:p-8 ${bgCard} border border-red-500/30 rounded-2xl text-center`}>
          <BookOpen className="text-red-600 mx-auto mb-4" size={40} />
          <h3 className={`text-xl sm:text-2xl ${textPrimary} mb-3 sm:mb-4`}>
            {language === 'en' ? 'Want to Contribute?' : 'Quer Contribuir?'}
          </h3>
          <p className={`${textSecondary} mb-4 sm:mb-6 text-sm sm:text-base`}>
            {language === 'en'
              ? 'Have educational materials to share? We welcome contributions from the FIRST community to help others learn and grow.'
              : 'Tem materiais educacionais para compartilhar? Aceitamos contribuições da comunidade FIRST para ajudar outros a aprender e crescer.'}
          </p>
          <button className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base">
            {language === 'en' ? 'Contact Us' : 'Entre em Contato'}
          </button>
        </div>
      </div>
    </div>
  );
}
