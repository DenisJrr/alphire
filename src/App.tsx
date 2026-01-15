import { useState, createContext, useContext, useEffect } from 'react';
import { Home } from './pages/Home';
import { Robots } from './pages/Robots';
import { RobotDetail } from './pages/RobotDetail';
import { Social } from './pages/Social';
import { Sponsors } from './pages/Sponsors';
import { Materials } from './pages/Materials';
import { EducationalMaterials } from './pages/EducationalMaterials';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { AboutTeam } from './pages/AboutTeam';
import { AboutWebsite } from './pages/AboutWebsite';
import { Admin } from './pages/Admin';
import { Contact } from './pages/Contact';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import faviconImage from 'figma:asset/f0019788c06f858e882bd33f6aa3f3106940c072.png';

interface AppContextType {
  theme: 'dark' | 'light';
  language: 'en' | 'pt';
  toggleTheme: () => void;
  toggleLanguage: () => void;
}

const AppContext = createContext<AppContextType>({
  theme: 'dark',
  language: 'en',
  toggleTheme: () => {},
  toggleLanguage: () => {},
});

export const useApp = () => useContext(AppContext);

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState<'en' | 'pt'>('en');

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'pt' : 'en');

  // Set favicon
  useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = faviconImage;
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  // Scroll to top whenever the page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedRobotId, selectedProjectId]);

  const renderPage = () => {
    if (currentPage === 'robot-detail' && selectedRobotId) {
      return <RobotDetail robotId={selectedRobotId} onBack={() => setCurrentPage('robots')} />;
    }
    
    if (currentPage === 'project-detail' && selectedProjectId) {
      return <ProjectDetail projectId={selectedProjectId} onBack={() => setCurrentPage('projects')} />;
    }

    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'robots':
        return <Robots onSelectRobot={(id) => {
          setSelectedRobotId(id);
          setCurrentPage('robot-detail');
        }} />;
      case 'projects':
        return <Projects onSelectProject={(id) => {
          setSelectedProjectId(id);
          setCurrentPage('project-detail');
        }} onNavigate={setCurrentPage} />;
      case 'social':
        return <Social />;
      case 'sponsors':
        return <Sponsors />;
      case 'materials':
        return <Materials onNavigate={setCurrentPage} />;
      case 'educational-materials':
        return <EducationalMaterials />;
      case 'about-team':
        return <AboutTeam />;
      case 'about-website':
        return <AboutWebsite onNavigate={setCurrentPage} />;
      case 'admin':
        return <Admin />;
      case 'contact':
        return <Contact />;
      default:
    }
  };

  const bgColor = theme === 'dark' ? 'bg-[#0F0E0D]' : 'bg-[#F5F1E8]';

  return (
    <AppContext.Provider value={{ theme, language, toggleTheme, toggleLanguage }}>
      <div className={`min-h-screen ${bgColor} transition-colors duration-300`}>
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
        {renderPage()}
        <Footer onNavigate={setCurrentPage} />
      </div>
    </AppContext.Provider>
  );
}