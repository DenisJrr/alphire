import { useState, useEffect } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Search, Filter, Lightbulb } from 'lucide-react';
import { useApp } from '../App';
import { fullTranslations } from '../utils/translations';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import firstLogo from 'figma:asset/0e6ea90a13d4aed51a0701dae090f0d44793897f.png';

interface RobotsProps {
  onSelectRobot: (id: string) => void;
}

export function Robots({ onSelectRobot }: RobotsProps) {
  const { theme, language } = useApp();
  const t = fullTranslations[language].robots;
  
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [robotsData, setRobotsData] = useState<any[]>([]);

  const seasons = ['all', '2024-2025'];
  const alphabet = ['all', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  useEffect(() => {
    loadRobots();
  }, []);

  const loadRobots = async () => {
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
      setRobotsData(data.robots || []);
    } catch (error) {
      console.error('Error loading robots:', error);
    }
  };

  // Filter robots
  const filteredRobots = robotsData.filter(robot => {
    const matchesSeason = selectedSeason === 'all' || robot.season === selectedSeason;
    const matchesLetter = selectedLetter === 'all' || robot.teamName.toUpperCase().startsWith(selectedLetter);
    const matchesSearch = searchTerm === '' || 
      robot.robotName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.teamNumber.toString().includes(searchTerm);
    
    return matchesSeason && matchesLetter && matchesSearch;
  });

  // Sort alphabetically by team name
  const sortedRobots = [...filteredRobots].sort((a, b) => 
    a.teamName.localeCompare(b.teamName)
  );

  const bgPrimary = theme === 'dark' ? 'bg-[#0F0E0D]' : 'bg-[#F5F1E8]';
  const bgCard = theme === 'dark' ? 'bg-[#252320]' : 'bg-white';
  const inputBg = theme === 'dark' ? 'bg-[#252320]' : 'bg-white';
  const textPrimary = theme === 'dark' ? 'text-[#F5F1E8]' : 'text-[#2C2416]';
  const textSecondary = theme === 'dark' ? 'text-[#C9C2B5]' : 'text-[#5C5346]';
  const textMuted = theme === 'dark' ? 'text-[#8B8275]' : 'text-[#8B8275]';
  const borderColor = theme === 'dark' ? 'border-[#3A3632]' : 'border-[#E5DED0]';
  const hoverBorderColor = theme === 'dark' ? 'hover:border-[#D4A574]/40' : 'hover:border-[#D4A574]/40';

  return (
    <div className={`min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 ${bgPrimary} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block px-3 sm:px-4 py-2 bg-[#D4A574]/10 border border-[#D4A574]/30 rounded-full mb-4 sm:mb-6">
            <span className="text-[#D4A574] text-sm sm:text-base">{fullTranslations[language].nav.robots}</span>
          </div>
          <h1 className={`text-3xl sm:text-4xl ${textPrimary} mb-4 sm:mb-6`}>
            {t.title}
          </h1>
          <p className={`${textSecondary} max-w-2xl mx-auto text-sm sm:text-base px-4`}>
            {t.subtitle}
          </p>
        </div>

        {/* FIRST Values Section */}
        <div className={`mb-8 sm:mb-12 p-4 sm:p-8 ${bgCard} border ${borderColor} rounded-2xl`}>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#D4A574] to-[#9FBF8F] rounded-lg flex items-center justify-center flex-shrink-0">
              <Lightbulb className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <h2 className={`text-xl sm:text-2xl ${textPrimary} mb-2 sm:mb-3`}>{t.firstValues.title}</h2>
              <p className={`${textSecondary} leading-relaxed text-sm sm:text-base`}>
                {t.firstValues.content}
              </p>
              {/* FIRST Logo */}
              <div className="mt-4 sm:mt-6 flex items-center gap-4 sm:gap-6 flex-wrap">
                <ImageWithFallback
                  src={firstLogo}
                  alt="FIRST Logo"
                  className="h-8 sm:h-12 w-auto object-contain opacity-70"
                />
                <div className={`${textMuted} text-xs sm:text-sm`}>
                  Powered by FIRST® Tech Challenge
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="relative max-w-xl mx-auto">
            <Search className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 ${textMuted}`} size={18} />
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 ${inputBg} border ${borderColor} rounded-lg ${textPrimary} text-sm sm:text-base focus:outline-none focus:border-[#D4A574]/40 placeholder:${textMuted}`}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
          {/* Season Filter */}
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Filter className="text-[#D4A574]" size={16} />
              <span className={`${textPrimary} text-sm sm:text-base`}>{t.season}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {seasons.map(season => (
                <button
                  key={season}
                  onClick={() => setSelectedSeason(season)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-sm sm:text-base ${
                    selectedSeason === season
                      ? 'bg-[#D4A574] text-white'
                      : `${bgCard} ${textSecondary} border ${borderColor} ${hoverBorderColor}`
                  }`}
                >
                  {season === 'all' ? t.allSeasons : season}
                </button>
              ))}
            </div>
          </div>

          {/* Alphabet Filter */}
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Filter className="text-[#D4A574]" size={16} />
              <span className={`${textPrimary} text-sm sm:text-base`}>{t.alphabetical}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {alphabet.map(letter => (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(letter)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-colors text-sm sm:text-base ${
                    selectedLetter === letter
                      ? 'bg-[#D4A574] text-white'
                      : `${bgCard} ${textSecondary} border ${borderColor} ${hoverBorderColor}`
                  }`}
                >
                  {letter === 'all' ? '•' : letter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className={`mb-4 sm:mb-6 ${textMuted} text-sm sm:text-base`}>
          {t.showing} {sortedRobots.length} {sortedRobots.length !== 1 ? t.robots : t.robot}
        </div>

        {/* Robot Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {sortedRobots.map(robot => (
            <button
              key={robot.id}
              onClick={() => onSelectRobot(robot.id)}
              className={`group text-left ${bgCard} border ${borderColor} rounded-xl overflow-hidden ${hoverBorderColor} transition-all hover:-translate-y-1`}
            >
              {/* Image */}
              <div className={`relative h-40 sm:h-48 overflow-hidden ${theme === 'dark' ? 'bg-[#1A1816]' : 'bg-[#E5DED0]'}`}>
                <ImageWithFallback
                  src={robot.image}
                  alt={robot.robotName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 px-2 sm:px-3 py-1 bg-[#D4A574]/90 backdrop-blur-sm rounded-full text-white text-xs">
                  {robot.season}
                </div>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-4">
                <h3 className={`${textPrimary} mb-1 group-hover:text-[#D4A574] transition-colors text-sm sm:text-base`}>
                  {robot.robotName}
                </h3>
                <p className="text-[#D4A574] text-xs sm:text-sm mb-2">
                  {robot.teamName} - #{robot.teamNumber}
                </p>
                <p className={`${textMuted} text-xs sm:text-sm line-clamp-2`}>
                  {robot.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* No Results */}
        {sortedRobots.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <p className={`${textMuted} mb-4 text-sm sm:text-base`}>{t.noResults}</p>
            <button
              onClick={() => {
                setSelectedSeason('all');
                setSelectedLetter('all');
                setSearchTerm('');
              }}
              className="text-[#D4A574] hover:text-[#E5B685] transition-colors text-sm sm:text-base"
            >
              {t.clearFilters}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}