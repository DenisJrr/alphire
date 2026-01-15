import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Users, Award, MapPin, Globe as GlobeIcon, ExternalLink, FileCode, Box } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useApp } from '../App';
import { fullTranslations } from '../utils/translations';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface RobotDetailProps {
  robotId: string;
  onBack: () => void;
}

export function RobotDetail({ robotId, onBack }: RobotDetailProps) {
  const { theme, language } = useApp();
  const t = fullTranslations[language].robots.detail;
  const [robot, setRobot] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRobot();
  }, [robotId]);

  const loadRobot = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5881ae94/robots`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      const foundRobot = data.robots?.find((r: any) => r.id === robotId);
      setRobot(foundRobot || null);
    } catch (error) {
      console.error('Error loading robot:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen pt-24 pb-16 ${theme === 'dark' ? 'bg-[#0F0E0D]' : 'bg-[#F5F1E8]'} flex items-center justify-center transition-colors duration-300`}>
        <div className="text-center">
          <p className={theme === 'dark' ? 'text-[#C9C2B5]' : 'text-[#5C5346]'}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!robot) {
    return (
      <div className={`min-h-screen pt-24 pb-16 ${theme === 'dark' ? 'bg-[#0F0E0D]' : 'bg-[#F5F1E8]'} flex items-center justify-center transition-colors duration-300`}>
        <div className="text-center">
          <p className={theme === 'dark' ? 'text-[#8B8275]' : 'text-[#8B8275]'}>Robot not found</p>
          <button
            onClick={onBack}
            className="text-[#D4A574] hover:text-[#E5B685] transition-colors"
          >
            {fullTranslations[language].robots.backToRobots}
          </button>
        </div>
      </div>
    );
  }

  const bgColor = theme === 'dark' ? 'bg-[#0F0E0D]' : 'bg-[#F5F1E8]';
  const cardBg = theme === 'dark' ? 'bg-[#252320]' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-[#F5F1E8]' : 'text-[#2C2416]';
  const subtextColor = theme === 'dark' ? 'text-[#C9C2B5]' : 'text-[#5C5346]';
  const mutedColor = theme === 'dark' ? 'text-[#8B8275]' : 'text-[#8B8275]';
  const borderColor = theme === 'dark' ? 'border-[#3A3632]' : 'border-[#E5DED0]';

  return (
    <div className={`min-h-screen pt-24 pb-16 ${bgColor} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className={`flex items-center gap-2 ${subtextColor} hover:text-[#D4A574] transition-colors mb-8`}
        >
          <ArrowLeft size={20} />
          {fullTranslations[language].robots.backToRobots}
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4A574]/20 to-[#9FBF8F]/20 rounded-2xl blur-3xl"></div>
            <ImageWithFallback
              src={robot.image}
              alt={robot.robotName}
              className={`relative rounded-2xl w-full h-[600px] object-cover border ${borderColor}`}
            />
          </div>

          {/* Content */}
          <div>
            {/* Season Badge */}
            <div className="inline-block px-4 py-2 bg-[#D4A574]/10 border border-[#D4A574]/30 rounded-full mb-6">
              <span className="text-[#D4A574]">{robot.season}</span>
            </div>

            {/* Robot Name */}
            <h1 className={`text-4xl ${textColor} mb-4`}>
              {robot.robotName}
            </h1>

            {/* Team Info */}
            <div className="flex items-center gap-2 text-[#D4A574] mb-8">
              <Users size={20} />
              <span>{robot.teamName} - #{robot.teamNumber}</span>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className={`text-xl ${textColor} mb-4`}>{t.about}</h2>
              <p className={`${subtextColor} leading-relaxed`}>
                {robot.fullDescription || robot.description}
              </p>
            </div>

            {/* OPR and Achievements */}
            <div className="mb-8 grid sm:grid-cols-2 gap-4">
              {robot.opr && (
                <div className={`p-4 ${cardBg} border ${borderColor} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="text-[#D4A574]" size={18} />
                    <div className={`${mutedColor} text-sm`}>OPR (Offensive Power Rating)</div>
                  </div>
                  <div className={`${textColor} text-2xl`}>{robot.opr}</div>
                </div>
              )}
              {robot.achievements && (
                <div className={`p-4 ${cardBg} border ${borderColor} rounded-lg ${!robot.opr ? 'sm:col-span-2' : ''}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="text-[#D4A574]" size={18} />
                    <div className={`${mutedColor} text-sm`}>Achievements</div>
                  </div>
                  <div className={textColor}>{robot.achievements}</div>
                </div>
              )}
            </div>

            {/* Team Information */}
            <div className="mb-8">
              <h2 className={`text-xl ${textColor} mb-4`}>{t.teamInfo}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className={`p-4 ${cardBg} border ${borderColor} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <GlobeIcon className="text-[#D4A574]" size={18} />
                    <div className={`${mutedColor} text-sm`}>{t.country}</div>
                  </div>
                  <div className={textColor}>{robot.country || 'USA'}</div>
                </div>
                <div className={`p-4 ${cardBg} border ${borderColor} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="text-[#D4A574]" size={18} />
                    <div className={`${mutedColor} text-sm`}>{t.city}</div>
                  </div>
                  <div className={textColor}>{robot.city || 'Silicon Valley, CA'}</div>
                </div>
              </div>
              {robot.teamDescription && (
                <div className={`mt-4 p-4 ${cardBg} border ${borderColor} rounded-lg`}>
                  <div className={`${mutedColor} text-sm mb-2`}>{t.aboutTeam}</div>
                  <p className={`${subtextColor} text-sm`}>{robot.teamDescription}</p>
                </div>
              )}
            </div>

            {/* Specifications */}
            {robot.specs && robot.specs.length > 0 && (
              <div className="mb-8">
                <h2 className={`text-xl ${textColor} mb-4`}>{t.specs}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {robot.specs.map((spec, index) => (
                    <div
                      key={index}
                      className={`p-4 ${cardBg} border ${borderColor} rounded-lg`}
                    >
                      <div className={`${mutedColor} text-sm mb-1`}>{spec.label}</div>
                      <div className={textColor}>{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resources & Links */}
            <div className="mb-8">
              <h2 className={`text-xl ${textColor} mb-4`}>{t.resources}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {robot.cadLink && (
                  <a
                    href={robot.cadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-4 ${cardBg} border ${borderColor} rounded-lg hover:border-[#D4A574]/40 transition-colors group`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Box className="text-[#D4A574]" size={20} />
                      <ExternalLink className={`${mutedColor} group-hover:text-[#D4A574] transition-colors`} size={16} />
                    </div>
                    <div className={`${textColor} mb-1`}>{t.cad}</div>
                    <div className={`${mutedColor} text-sm`}>{t.viewCad}</div>
                  </a>
                )}
                {robot.codeLink && (
                  <a
                    href={robot.codeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-4 ${cardBg} border ${borderColor} rounded-lg hover:border-[#D4A574]/40 transition-colors group`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <FileCode className="text-[#D4A574]" size={20} />
                      <ExternalLink className={`${mutedColor} group-hover:text-[#D4A574] transition-colors`} size={16} />
                    </div>
                    <div className={`${textColor} mb-1`}>{t.code}</div>
                    <div className={`${mutedColor} text-sm`}>{t.viewCode}</div>
                  </a>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className={`p-6 ${cardBg} border ${borderColor} rounded-xl`}>
              <div className={`flex items-center gap-2 ${mutedColor} text-sm`}>
                <Calendar size={16} />
                <span>{language === 'en' ? 'Season' : 'Temporada'}: {robot.season}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Robot Photos Gallery */}
        {robot.photos && robot.photos.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <h2 className={`text-2xl sm:text-3xl ${textColor} mb-6 text-center`}>
              {language === 'en' ? 'Robot Gallery' : 'Galeria do Robô'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {robot.photos.map((photoUrl: string, index: number) => (
                <div
                  key={index}
                  className={`relative aspect-square rounded-xl overflow-hidden border ${borderColor} group`}
                >
                  <ImageWithFallback
                    src={photoUrl}
                    alt={`${robot.robotName} - Photo ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4`}>
                    <span className="text-white text-sm">{language === 'en' ? 'Photo' : 'Foto'} {index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}