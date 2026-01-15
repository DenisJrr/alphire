import { useState, useEffect } from 'react';
import { Save, ChevronDown, ChevronRight, Upload } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { supabase } from '../utils/supabase/client';

interface ContentEditorProps {
  theme: string;
  textPrimary: string;
  textSecondary: string;
  bgCard: string;
  borderColor: string;
}

export function ContentEditor({ theme, textPrimary, textSecondary, bgCard, borderColor }: ContentEditorProps) {
  const [content, setContent] = useState<any>({});
  const [originalContent, setOriginalContent] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set(['home']));
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'pt'>('en');
  const [uploadingFields, setUploadingFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
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
      setContent(data.content || {});
      setOriginalContent(JSON.parse(JSON.stringify(data.content || {})));
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    setSaving(true);
    setSuccessMessage('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5881ae94/content/bulk`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(content),
        }
      );

      if (response.ok) {
        setSuccessMessage('Content saved successfully! ✓');
        setOriginalContent(JSON.parse(JSON.stringify(content)));
        setTimeout(() => setSuccessMessage(''), 3000);
        
        // Dispatch event to notify all pages that content has been updated
        window.dispatchEvent(new CustomEvent('contentUpdated', { detail: content }));
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Failed to save content. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (page: string, section: string, field: string, file: File, skipUpdate = false) => {
    const fieldKey = `${page}.${section}.${field}`;
    setUploadingFields(new Set(uploadingFields).add(fieldKey));
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5881ae94/upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (data.url) {
        if (!skipUpdate) {
          updateContent(page, section, field, data.url);
        }
        return data.url;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      const newSet = new Set(uploadingFields);
      newSet.delete(fieldKey);
      setUploadingFields(newSet);
    }
    return null;
  };

  const updateContent = (page: string, section: string, field: string, value: any, language?: string) => {
    const newContent = { ...content };
    if (!newContent[page]) newContent[page] = {};
    if (!newContent[page][section]) newContent[page][section] = {};
    
    if (language) {
      if (!newContent[page][section][field]) newContent[page][section][field] = {};
      newContent[page][section][field][language] = value;
    } else {
      newContent[page][section][field] = value;
    }
    
    setContent(newContent);
  };

  const togglePage = (page: string) => {
    const newSet = new Set(expandedPages);
    if (newSet.has(page)) {
      newSet.delete(page);
    } else {
      newSet.add(page);
    }
    setExpandedPages(newSet);
  };

  const toggleSection = (sectionKey: string) => {
    const newSet = new Set(expandedSections);
    if (newSet.has(sectionKey)) {
      newSet.delete(sectionKey);
    } else {
      newSet.add(sectionKey);
    }
    setExpandedSections(newSet);
  };

  const hasChanges = JSON.stringify(content) !== JSON.stringify(originalContent);

  const inputClass = theme === 'dark'
    ? 'w-full px-3 py-2 bg-[#252320] border border-[#3A3632] rounded-lg text-[#F5F1E8] focus:outline-none focus:border-red-500'
    : 'w-full px-3 py-2 bg-white border border-[#E5DED0] rounded-lg text-[#2C2416] focus:outline-none focus:border-red-500';

  const pageConfigs = {
    home: {
      name: 'Home',
      icon: '🏠',
      sections: {
        hero: { name: 'Hero Section', fields: ['logo', 'background', 'motto', 'buttonLearn', 'buttonAchievements'] },
        about: { name: 'About Section', fields: ['badge', 'title', 'description1', 'description2', 'image'] },
        stats: { name: 'Statistics', fields: ['competitions', 'competitionsValue', 'awards', 'awardsValue', 'members', 'membersValue', 'founded', 'foundedValue'] },
        achievements: { name: 'Achievements', fields: ['badge', 'title', 'subtitle', 'connectYear', 'connect', 'connectDesc', 'winningYear', 'winning', 'winningDesc', 'controlYear', 'control', 'controlDesc'] },
      },
    },
    aboutTeam: {
      name: 'About Team',
      icon: '👥',
      sections: {
        header: { name: 'Header', fields: ['badge', 'title', 'subtitle', 'heroImage'] },
        schoolInfo: { name: 'School Info', fields: ['schoolLabel', 'schoolName', 'locationLabel', 'locationName', 'foundedLabel', 'foundedYear'] },
        mission: { name: 'Mission', fields: ['title', 'text'] },
        areas: { name: 'Areas of Focus', fields: ['title', 'admMarketing', 'admMarketingDesc', 'eletProg', 'eletProgDesc', 'mecCAD', 'mecCADDesc'] },
        timeline: { name: 'Timeline', fields: ['title', 'event1Year', 'event1Title', 'event1Desc', 'event2Year', 'event2Title', 'event2Desc', 'event3Year', 'event3Title', 'event3Desc', 'event4Year', 'event4Title', 'event4Desc'] },
        values: { name: 'Values', fields: ['title', 'teamwork', 'teamworkDesc', 'innovation', 'innovationDesc', 'community', 'communityDesc'] },
      },
    },
    sponsors: {
      name: 'Sponsors',
      icon: '🤝',
      sections: {
        header: { name: 'Header', fields: ['badge', 'title', 'subtitle'] },
        mainSponsors: { name: 'Section Title', fields: ['title'] },
        sponsorsList: { name: 'Sponsors List', fields: ['items'] },
        cta: { name: 'Call to Action', fields: ['title', 'subtitle', 'becomeButton', 'becomeButtonLink', 'downloadButton', 'downloadButtonLink'] },
      },
    },
    social: {
      name: 'Social',
      icon: '📱',
      sections: {
        header: { name: 'Header', fields: ['badge', 'title', 'subtitle'] },
        noPosts: { name: 'No Posts Message', fields: ['en', 'pt'] },
      },
    },
    robots: {
      name: 'Robots',
      icon: '🤖',
      sections: {
        header: { name: 'Header', fields: ['badge', 'title', 'subtitle'] },
        search: { name: 'Search Labels', fields: ['placeholder', 'filterSeason', 'allSeasons'] },
        noResults: { name: 'No Results Message', fields: ['en', 'pt'] },
      },
    },
    materials: {
      name: 'Materials',
      icon: '📁',
      sections: {
        header: { name: 'Header', fields: ['badge', 'title', 'subtitle'] },
        categories: { name: 'Material Categories', fields: ['items'] },
      },
    },
    projects: {
      name: 'Projects',
      icon: '🚀',
      sections: {
        header: { name: 'Header', fields: ['badge', 'title', 'subtitle'] },
        arc: { name: 'Project 1 - ARC', fields: ['name', 'description', 'image', 'fullDescription', 'title', 'gallery', 'details', 'goals', 'status'] },
        sgof: { name: 'Project 2 - SGOF', fields: ['name', 'description', 'image', 'fullDescription', 'title', 'gallery', 'details', 'goals', 'status'] },
        flames: { name: 'Project 3 - Flames', fields: ['name', 'description', 'image', 'fullDescription', 'title', 'gallery', 'details', 'goals', 'status'] },
        cta: { name: 'Call to Action', fields: ['title', 'description', 'buttonText'] },
      },
    },
    aboutWebsite: {
      name: 'About Website',
      icon: '💻',
      sections: {
        header: { name: 'Header', fields: ['badge', 'title', 'subtitle'] },
        intro: { name: 'Introduction', fields: ['title', 'description', 'heroImage'] },
        techStack: { name: 'Technology Stack', fields: ['title', 'react', 'reactDesc', 'tailwind', 'tailwindDesc', 'typescript', 'typescriptDesc', 'supabase', 'supabaseDesc'] },
        features: { name: 'Features', fields: ['title', 'responsive', 'responsiveDesc', 'bilingual', 'bilingualDesc', 'darkMode', 'darkModeDesc', 'cms', 'cmsDesc'] },
      },
    },
    navigation: {
      name: 'Navigation',
      icon: '🧭',
      sections: {
        menu: { name: 'Menu Items', fields: ['home', 'robots', 'social', 'sponsors', 'materials', 'projects', 'aboutTeam', 'aboutWebsite', 'admin'] },
      },
    },
    footer: {
      name: 'Footer',
      icon: '📄',
      sections: {
        content: { name: 'Footer Content', fields: ['abeImage'] },
      },
    },
  };

  const isImageField = (field: string) => {
    return field.includes('image') || field.includes('Image') || field.includes('logo') || field.includes('Logo') || field === 'background';
  };

  const isLongTextField = (field: string) => {
    return field.includes('description') || field.includes('Description') || field.includes('subtitle') || field.includes('Subtitle') || field === 'text' || field.includes('Desc') || field === 'fullDescription';
  };

  const isBilingualField = (value: any) => {
    return value && typeof value === 'object' && ('en' in value || 'pt' in value);
  };

  const renderField = (page: string, section: string, field: string, value: any) => {
    const fieldKey = `${page}.${section}.${field}`;
    const isUploading = uploadingFields.has(fieldKey);

    // Handle special case for noPosts, noResults, downloads which are directly bilingual
    if ((section === 'noPosts' || section === 'noResults' || section === 'downloads' || section === 'downloadButton') && (field === 'en' || field === 'pt')) {
      return (
        <div key={fieldKey} className="mb-4">
          <label className={`block ${textSecondary} text-sm mb-2`}>
            {field === 'en' ? '🇺🇸 English' : '🇧🇷 Portuguese'}
          </label>
          <textarea
            value={value || ''}
            onChange={(e) => updateContent(page, section, field, e.target.value)}
            className={inputClass}
            rows={2}
          />
        </div>
      );
    }

    // Gallery field (multiple images)
    if (field === 'gallery') {
      const galleryImages = Array.isArray(value) ? value : [];
      return (
        <div key={fieldKey} className="mb-4">
          <label className={`block ${textSecondary} text-sm mb-2`}>
            📸 Gallery Images (Student Photos, Event Photos, etc.)
          </label>
          <div className="space-y-3">
            {galleryImages.map((imageUrl: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <img src={imageUrl} alt={`Gallery ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => {
                    const newGallery = [...galleryImages];
                    newGallery[index] = e.target.value;
                    updateContent(page, section, field, newGallery);
                  }}
                  className={inputClass}
                  placeholder="Image URL"
                />
                <button
                  onClick={() => {
                    const newGallery = galleryImages.filter((_: any, i: number) => i !== index);
                    updateContent(page, section, field, newGallery);
                  }}
                  className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex-shrink-0 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const uploadedUrl = await handleImageUpload(page, section, field, file, true);
                    if (uploadedUrl) {
                      updateContent(page, section, field, [...galleryImages, uploadedUrl]);
                    }
                  }
                  e.target.value = '';
                }}
                className="hidden"
                id={`gallery-upload-${fieldKey}`}
                disabled={isUploading}
              />
              <label
                htmlFor={`gallery-upload-${fieldKey}`}
                className={`flex items-center gap-2 px-4 py-2 ${theme === 'dark' ? 'bg-[#3A3632]' : 'bg-gray-200'} rounded cursor-pointer hover:bg-red-600 hover:text-white transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isUploading ? 'Uploading...' : (
                  <>
                    <Upload size={16} />
                    Upload Image
                  </>
                )}
              </label>
              <button
                onClick={() => {
                  const newUrl = prompt('Or enter image URL:');
                  if (newUrl) {
                    updateContent(page, section, field, [...galleryImages, newUrl]);
                  }
                }}
                className="px-4 py-2 bg-[#D4A574] text-white rounded hover:bg-[#E5B685]"
              >
                + Add URL
              </button>
            </div>
            {galleryImages.length === 0 && (
              <p className="text-sm text-gray-500 italic">No gallery images yet. Upload or add URLs to create a gallery.</p>
            )}
          </div>
        </div>
      );
    }

    // Details and Goals fields (bilingual text arrays)
    if (field === 'details' || field === 'goals') {
      const fieldLabel = field === 'details' ? 'Highlights' : 'Goals';
      const isBilingual = value && typeof value === 'object' && ('en' in value || 'pt' in value);
      
      if (isBilingual) {
        const enItems = Array.isArray(value.en) ? value.en : [];
        const ptItems = Array.isArray(value.pt) ? value.pt : [];
        
        return (
          <div key={fieldKey} className="mb-6 p-4 border-2 border-dashed border-red-400 dark:border-red-600 rounded-lg bg-red-50/50 dark:bg-red-950/20">
            <label className={`block ${textPrimary} mb-3 text-base font-medium`}>
              {field === 'details' ? '✨ Highlights (Bilingual Points)' : '🎯 Goals (Bilingual Points)'}
            </label>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Each point will appear as a separate item with bullet points on your project page
            </p>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveLanguage('en')}
                className={`px-3 py-1 rounded text-sm ${activeLanguage === 'en' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                🇺🇸 EN
              </button>
              <button
                onClick={() => setActiveLanguage('pt')}
                className={`px-3 py-1 rounded text-sm ${activeLanguage === 'pt' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                🇧🇷 PT
              </button>
            </div>
            
            <div className="space-y-3">
              {activeLanguage === 'en' ? (
                <>
                  {enItems.map((item: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white text-xs mt-2 flex-shrink-0">
                        {index + 1}
                      </div>
                      <textarea
                        value={item}
                        onChange={(e) => {
                          const newItems = [...enItems];
                          newItems[index] = e.target.value;
                          updateContent(page, section, field, { ...value, en: newItems });
                        }}
                        className={inputClass}
                        rows={2}
                        placeholder={`Point ${index + 1} in English...`}
                      />
                      <button
                        onClick={() => {
                          const newItems = enItems.filter((_: any, i: number) => i !== index);
                          updateContent(page, section, field, { ...value, en: newItems });
                        }}
                        className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex-shrink-0 text-sm mt-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      updateContent(page, section, field, { ...value, en: [...enItems, ''] });
                    }}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium flex items-center justify-center gap-2"
                  >
                    + Add New Point (EN)
                  </button>
                </>
              ) : (
                <>
                  {ptItems.map((item: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white text-xs mt-2 flex-shrink-0">
                        {index + 1}
                      </div>
                      <textarea
                        value={item}
                        onChange={(e) => {
                          const newItems = [...ptItems];
                          newItems[index] = e.target.value;
                          updateContent(page, section, field, { ...value, pt: newItems });
                        }}
                        className={inputClass}
                        rows={2}
                        placeholder={`Ponto ${index + 1} em português...`}
                      />
                      <button
                        onClick={() => {
                          const newItems = ptItems.filter((_: any, i: number) => i !== index);
                          updateContent(page, section, field, { ...value, pt: newItems });
                        }}
                        className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex-shrink-0 text-sm mt-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      updateContent(page, section, field, { ...value, pt: [...ptItems, ''] });
                    }}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium flex items-center justify-center gap-2"
                  >
                    + Adicionar Novo Ponto (PT)
                  </button>
                </>
              )}
            </div>
          </div>
        );
      } else {
        // Initialize as bilingual structure if not already
        return (
          <div key={fieldKey} className="mb-6 p-4 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg">
            <label className={`block ${textSecondary} mb-3 text-base font-medium`}>
              {field === 'details' ? '✨ Highlights (Bilingual Points)' : '🎯 Goals (Bilingual Points)'}
            </label>
            <p className="text-sm text-gray-500 italic mb-3">No items yet. Click below to add your first point.</p>
            <button
              onClick={() => {
                updateContent(page, section, field, { en: [''], pt: [''] });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Initialize {fieldLabel}
            </button>
          </div>
        );
      }
    }

    // Materials items field (special array of material objects)
    if (field === 'items' && section === 'materialsData') {
      const materials = Array.isArray(value) ? value : [];
      
      return (
        <div key={fieldKey} className="mb-6 p-4 border-2 border-dashed border-blue-400 dark:border-blue-600 rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
          <label className={`block ${textPrimary} mb-3 text-base font-medium`}>
            📁 Materials & Downloads
          </label>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
            Add materials with download links. Each material will have a clickable download button.
          </p>
          
          <div className="space-y-4">
            {materials.map((material: any, index: number) => (
              <div key={index} className={`p-3 border ${borderColor} rounded-lg ${theme === 'dark' ? 'bg-[#1A1816]' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-red-600">Material #{index + 1}</span>
                  <button
                    onClick={() => {
                      const newMaterials = materials.filter((_: any, i: number) => i !== index);
                      updateContent(page, section, field, newMaterials);
                    }}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                  >
                    Delete Material
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="text-xs text-gray-500">🇺🇸 Name (English)</label>
                    <input
                      type="text"
                      value={material?.name?.en || ''}
                      onChange={(e) => {
                        const newMaterials = [...materials];
                        if (!newMaterials[index].name) newMaterials[index].name = {};
                        newMaterials[index].name.en = e.target.value;
                        updateContent(page, section, field, newMaterials);
                      }}
                      className={inputClass}
                      placeholder="Engineering Notebook 2024-2025"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">🇧🇷 Name (Portuguese)</label>
                    <input
                      type="text"
                      value={material?.name?.pt || ''}
                      onChange={(e) => {
                        const newMaterials = [...materials];
                        if (!newMaterials[index].name) newMaterials[index].name = {};
                        newMaterials[index].name.pt = e.target.value;
                        updateContent(page, section, field, newMaterials);
                      }}
                      className={inputClass}
                      placeholder="Caderno de Engenharia 2024-2025"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="text-xs text-gray-500">📂 Category</label>
                    <select
                      value={material?.category || 'notebooks'}
                      onChange={(e) => {
                        const newMaterials = [...materials];
                        newMaterials[index].category = e.target.value;
                        updateContent(page, section, field, newMaterials);
                      }}
                      className={inputClass}
                    >
                      <option value="notebooks">Notebooks</option>
                      <option value="cad">CAD</option>
                      <option value="programming">Programming</option>
                      <option value="media">Media (Photos)</option>
                      <option value="videos">Videos</option>
                      <option value="educational">Educational</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">📅 Season</label>
                    <input
                      type="text"
                      value={material?.season || ''}
                      onChange={(e) => {
                        const newMaterials = [...materials];
                        newMaterials[index].season = e.target.value;
                        updateContent(page, section, field, newMaterials);
                      }}
                      className={inputClass}
                      placeholder="2024-2025"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500">🔗 Download Link (Google Drive, Dropbox, etc.)</label>
                  <input
                    type="text"
                    value={material?.link || ''}
                    onChange={(e) => {
                      const newMaterials = [...materials];
                      newMaterials[index].link = e.target.value;
                      updateContent(page, section, field, newMaterials);
                    }}
                    className={inputClass}
                    placeholder="https://drive.google.com/file/d/..."
                  />
                </div>
              </div>
            ))}
            
            <button
              onClick={() => {
                const newMaterial = {
                  name: { en: '', pt: '' },
                  category: 'notebooks',
                  season: '2024-2025',
                  link: ''
                };
                updateContent(page, section, field, [...materials, newMaterial]);
              }}
              className="w-full px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium flex items-center justify-center gap-2"
            >
              + Add New Material
            </button>
          </div>
        </div>
      );
    }

    // Sponsors items field (special array of sponsor objects)
    if (field === 'items' && section === 'sponsorsList') {
      const sponsors = Array.isArray(value) ? value : [];
      
      return (
        <div key={fieldKey} className="mb-6 p-4 border-2 border-dashed border-purple-400 dark:border-purple-600 rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
          <label className={`block ${textPrimary} mb-3 text-base font-medium`}>
            🤝 Sponsors Management
          </label>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
            Add, edit, or remove sponsors. Each sponsor will be displayed on the Sponsors page with bilingual descriptions.
          </p>
          
          <div className="space-y-4">
            {sponsors.map((sponsor: any, index: number) => (
              <div key={index} className={`p-4 border ${borderColor} rounded-lg ${theme === 'dark' ? 'bg-[#1A1816]' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-red-600">Sponsor #{index + 1}</span>
                  <button
                    onClick={() => {
                      const newSponsors = sponsors.filter((_: any, i: number) => i !== index);
                      updateContent(page, section, field, newSponsors);
                    }}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                  >
                    Delete Sponsor
                  </button>
                </div>
                
                <div className="mb-3">
                  <label className="text-xs text-gray-500 mb-1 block">🏢 Sponsor Name</label>
                  <input
                    type="text"
                    value={sponsor?.name || ''}
                    onChange={(e) => {
                      const newSponsors = [...sponsors];
                      newSponsors[index].name = e.target.value;
                      updateContent(page, section, field, newSponsors);
                    }}
                    className={inputClass}
                    placeholder="Parker Hannifin, Dassault, etc."
                  />
                </div>

                <div className="mb-3">
                  <label className="text-xs text-gray-500 mb-1 block">📝 Description (Bilingual)</label>
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={() => setActiveLanguage('en')}
                      className={`px-2 py-1 rounded text-xs ${activeLanguage === 'en' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                      🇺🇸 EN
                    </button>
                    <button
                      onClick={() => setActiveLanguage('pt')}
                      className={`px-2 py-1 rounded text-xs ${activeLanguage === 'pt' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                      🇧🇷 PT
                    </button>
                  </div>
                  {activeLanguage === 'en' ? (
                    <textarea
                      value={sponsor?.description?.en || ''}
                      onChange={(e) => {
                        const newSponsors = [...sponsors];
                        if (!newSponsors[index].description) newSponsors[index].description = { en: '', pt: '' };
                        newSponsors[index].description.en = e.target.value;
                        updateContent(page, section, field, newSponsors);
                      }}
                      className={inputClass}
                      rows={2}
                      placeholder="Motion and control technologies..."
                    />
                  ) : (
                    <textarea
                      value={sponsor?.description?.pt || ''}
                      onChange={(e) => {
                        const newSponsors = [...sponsors];
                        if (!newSponsors[index].description) newSponsors[index].description = { en: '', pt: '' };
                        newSponsors[index].description.pt = e.target.value;
                        updateContent(page, section, field, newSponsors);
                      }}
                      className={inputClass}
                      rows={2}
                      placeholder="Tecnologias de movimento e controle..."
                    />
                  )}
                </div>

                <div className="mb-3">
                  <label className="text-xs text-gray-500 mb-1 block">🔗 Website URL</label>
                  <input
                    type="text"
                    value={sponsor?.url || ''}
                    onChange={(e) => {
                      const newSponsors = [...sponsors];
                      newSponsors[index].url = e.target.value;
                      updateContent(page, section, field, newSponsors);
                    }}
                    className={inputClass}
                    placeholder="https://www.sponsor-website.com"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">🖼️ Logo (URL or Upload)</label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const uploadedUrl = await handleImageUpload(page, section, `sponsor-logo-${index}`, file, true);
                          if (uploadedUrl) {
                            const newSponsors = [...sponsors];
                            newSponsors[index].logo = uploadedUrl;
                            updateContent(page, section, field, newSponsors);
                          }
                        }
                        e.target.value = '';
                      }}
                      className={`${inputClass} text-sm`}
                    />
                    {sponsor?.logo && sponsor.logo.startsWith('http') && (
                      <div className="relative inline-block">
                        <img src={sponsor.logo} alt="Logo preview" className="w-20 h-20 object-contain rounded border" />
                        <button
                          onClick={() => {
                            const newSponsors = [...sponsors];
                            newSponsors[index].logo = '';
                            updateContent(page, section, field, newSponsors);
                          }}
                          className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    <input
                      type="text"
                      value={sponsor?.logo || ''}
                      onChange={(e) => {
                        const newSponsors = [...sponsors];
                        newSponsors[index].logo = e.target.value;
                        updateContent(page, section, field, newSponsors);
                      }}
                      className={inputClass}
                      placeholder="Or paste logo URL (or use emoji like 🔧)"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button
              onClick={() => {
                const newSponsor = {
                  name: '',
                  description: { en: '', pt: '' },
                  url: '',
                  logo: '🤝'
                };
                updateContent(page, section, field, [...sponsors, newSponsor]);
              }}
              className="w-full px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium flex items-center justify-center gap-2"
            >
              + Add New Sponsor
            </button>
          </div>
        </div>
      );
    }

    // Material Categories items field (special array of category objects with materials)
    if (field === 'items' && section === 'categories') {
      const categories = Array.isArray(value) ? value : [];
      
      const iconOptions = ['Book', 'FileText', 'Code', 'Image', 'Video', 'GraduationCap', 'Folder', 'Archive', 'File', 'HardDrive'];
      const colorOptions = [
        { name: 'Red', value: 'from-red-600 to-red-700' },
        { name: 'Orange-Red', value: 'from-orange-600 to-red-600' },
        { name: 'Red-Orange', value: 'from-red-500 to-orange-500' },
        { name: 'Red-Pink', value: 'from-red-600 to-pink-600' },
        { name: 'Pink-Red', value: 'from-pink-600 to-red-600' },
        { name: 'Blue-Purple', value: 'from-blue-600 to-purple-600' },
        { name: 'Purple-Red', value: 'from-purple-600 to-red-600' },
        { name: 'Green-Red', value: 'from-green-600 to-red-600' },
      ];
      
      return (
        <div key={fieldKey} className="mb-6 p-4 border-2 border-dashed border-green-400 dark:border-green-600 rounded-lg bg-green-50/50 dark:bg-green-950/20">
          <label className={`block ${textPrimary} mb-3 text-base font-medium`}>
            📂 Material Categories Management
          </label>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
            Create custom categories (like "Notebooks", "CAD Files", etc.) and add unlimited materials to each category.
          </p>
          
          <div className="space-y-6">
            {categories.map((category: any, catIndex: number) => (
              <div key={catIndex} className={`p-4 border-2 ${borderColor} rounded-lg ${theme === 'dark' ? 'bg-[#1A1816]' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium text-red-600">📁 Category #{catIndex + 1}</span>
                  <button
                    onClick={() => {
                      const newCategories = categories.filter((_: any, i: number) => i !== catIndex);
                      updateContent(page, section, field, newCategories);
                    }}
                    className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Delete Category
                  </button>
                </div>
                
                {/* Category Settings */}
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Category Settings</h4>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">🇺🇸 Category Name (English)</label>
                      <input
                        type="text"
                        value={category?.title?.en || ''}
                        onChange={(e) => {
                          const newCategories = [...categories];
                          if (!newCategories[catIndex].title) newCategories[catIndex].title = {};
                          newCategories[catIndex].title.en = e.target.value;
                          updateContent(page, section, field, newCategories);
                        }}
                        className={inputClass}
                        placeholder="Engineering Notebooks"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">🇧🇷 Category Name (Portuguese)</label>
                      <input
                        type="text"
                        value={category?.title?.pt || ''}
                        onChange={(e) => {
                          const newCategories = [...categories];
                          if (!newCategories[catIndex].title) newCategories[catIndex].title = {};
                          newCategories[catIndex].title.pt = e.target.value;
                          updateContent(page, section, field, newCategories);
                        }}
                        className={inputClass}
                        placeholder="Cadernos de Engenharia"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">🎨 Icon</label>
                      <select
                        value={category?.icon || 'Book'}
                        onChange={(e) => {
                          const newCategories = [...categories];
                          newCategories[catIndex].icon = e.target.value;
                          updateContent(page, section, field, newCategories);
                        }}
                        className={inputClass}
                      >
                        {iconOptions.map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">🌈 Color Gradient</label>
                      <select
                        value={category?.color || 'from-red-600 to-red-700'}
                        onChange={(e) => {
                          const newCategories = [...categories];
                          newCategories[catIndex].color = e.target.value;
                          updateContent(page, section, field, newCategories);
                        }}
                        className={inputClass}
                      >
                        {colorOptions.map(color => (
                          <option key={color.value} value={color.value}>{color.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Materials in this category */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Materials in this category:</h4>
                  
                  {(category?.materials || []).map((material: any, matIndex: number) => (
                    <div key={matIndex} className={`p-3 border ${borderColor} rounded bg-gray-50 dark:bg-gray-900/20`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Item #{matIndex + 1}</span>
                        <button
                          onClick={() => {
                            const newCategories = [...categories];
                            newCategories[catIndex].materials = (category.materials || []).filter((_: any, i: number) => i !== matIndex);
                            updateContent(page, section, field, newCategories);
                          }}
                          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <label className="text-xs text-gray-500">🇺🇸 Name (English)</label>
                          <input
                            type="text"
                            value={material?.name?.en || ''}
                            onChange={(e) => {
                              const newCategories = [...categories];
                              if (!newCategories[catIndex].materials[matIndex].name) {
                                newCategories[catIndex].materials[matIndex].name = {};
                              }
                              newCategories[catIndex].materials[matIndex].name.en = e.target.value;
                              updateContent(page, section, field, newCategories);
                            }}
                            className={inputClass}
                            placeholder="Engineering Notebook 2024-2025"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">🇧🇷 Name (Portuguese)</label>
                          <input
                            type="text"
                            value={material?.name?.pt || ''}
                            onChange={(e) => {
                              const newCategories = [...categories];
                              if (!newCategories[catIndex].materials[matIndex].name) {
                                newCategories[catIndex].materials[matIndex].name = {};
                              }
                              newCategories[catIndex].materials[matIndex].name.pt = e.target.value;
                              updateContent(page, section, field, newCategories);
                            }}
                            className={inputClass}
                            placeholder="Caderno de Engenharia 2024-2025"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-gray-500">📅 Season/Year</label>
                          <input
                            type="text"
                            value={material?.season || ''}
                            onChange={(e) => {
                              const newCategories = [...categories];
                              newCategories[catIndex].materials[matIndex].season = e.target.value;
                              updateContent(page, section, field, newCategories);
                            }}
                            className={inputClass}
                            placeholder="2024-2025"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">🔗 Download Link</label>
                          <input
                            type="text"
                            value={material?.link || ''}
                            onChange={(e) => {
                              const newCategories = [...categories];
                              newCategories[catIndex].materials[matIndex].link = e.target.value;
                              updateContent(page, section, field, newCategories);
                            }}
                            className={inputClass}
                            placeholder="https://drive.google.com/..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={() => {
                      const newCategories = [...categories];
                      if (!newCategories[catIndex].materials) newCategories[catIndex].materials = [];
                      newCategories[catIndex].materials.push({
                        name: { en: '', pt: '' },
                        season: '2024-2025',
                        link: ''
                      });
                      updateContent(page, section, field, newCategories);
                    }}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center justify-center gap-2"
                  >
                    + Add Material to this Category
                  </button>
                </div>
              </div>
            ))}
            
            <button
              onClick={() => {
                const newCategory = {
                  title: { en: '', pt: '' },
                  icon: 'Book',
                  color: 'from-red-600 to-red-700',
                  materials: []
                };
                updateContent(page, section, field, [...categories, newCategory]);
              }}
              className="w-full px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700 text-base font-medium flex items-center justify-center gap-2"
            >
              + Add New Category
            </button>
          </div>
        </div>
      );
    }

    // Image fields
    if (isImageField(field)) {
      return (
        <div key={fieldKey} className="mb-4">
          <label className={`block ${textSecondary} text-sm mb-2`}>
            {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </label>
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(page, section, field, file);
              }}
              disabled={isUploading}
              className={inputClass}
            />
            {isUploading && (
              <p className="text-sm text-blue-600">Uploading...</p>
            )}
            {value && (
              <div className="relative">
                <img src={value} alt={field} className="w-32 h-32 object-cover rounded border" />
                <button
                  onClick={() => updateContent(page, section, field, '')}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            )}
            <input
              type="text"
              value={value || ''}
              onChange={(e) => updateContent(page, section, field, e.target.value)}
              className={inputClass}
              placeholder="Or paste image URL..."
            />
          </div>
        </div>
      );
    }

    // Special handling for fullDescription (always show both languages)
    if (field === 'fullDescription') {
      if (isBilingualField(value)) {
        const enValue = value.en || '';
        const ptValue = value.pt || '';
        
        return (
          <div key={fieldKey} className="mb-6 p-4 border-2 border-dashed border-green-400 dark:border-green-600 rounded-lg bg-green-50/50 dark:bg-green-950/20">
            <label className={`block ${textPrimary} mb-3 text-base font-medium`}>
              📝 Full Description (Bilingual)
            </label>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              This detailed description appears on the project detail page
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  🇺🇸 English
                </label>
                <textarea
                  value={enValue}
                  onChange={(e) => updateContent(page, section, field, e.target.value, 'en')}
                  className={inputClass}
                  rows={5}
                  placeholder="Enter full description in English..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  🇧🇷 Portuguese
                </label>
                <textarea
                  value={ptValue}
                  onChange={(e) => updateContent(page, section, field, e.target.value, 'pt')}
                  className={inputClass}
                  rows={5}
                  placeholder="Digite a descrição completa em português..."
                />
              </div>
            </div>
          </div>
        );
      } else {
        // If not bilingual yet, show conversion button
        return (
          <div key={fieldKey} className="mb-6 p-4 border-2 border-dashed border-yellow-400 dark:border-yellow-600 rounded-lg bg-yellow-50/50 dark:bg-yellow-950/20">
            <label className={`block ${textPrimary} mb-2 text-base font-medium`}>
              📝 Full Description (Single Language)
            </label>
            <textarea
              value={value || ''}
              onChange={(e) => updateContent(page, section, field, e.target.value)}
              className={inputClass}
              rows={5}
              placeholder="Enter full description..."
            />
            <button
              onClick={() => {
                updateContent(page, section, field, { en: value || '', pt: '' });
              }}
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center gap-2"
            >
              🌐 Convert to Bilingual (Add Portuguese)
            </button>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Click to enable English and Portuguese editing side-by-side
            </p>
          </div>
        );
      }
    }

    // Bilingual fields
    if (isBilingualField(value)) {
      const enValue = value.en || '';
      const ptValue = value.pt || '';
      
      return (
        <div key={fieldKey} className="mb-4">
          <label className={`block ${textSecondary} mb-2`}>
            {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </label>
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setActiveLanguage('en')}
              className={`px-3 py-1 rounded text-sm ${activeLanguage === 'en' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              🇺🇸 EN
            </button>
            <button
              onClick={() => setActiveLanguage('pt')}
              className={`px-3 py-1 rounded text-sm ${activeLanguage === 'pt' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              🇧🇷 PT
            </button>
          </div>
          {activeLanguage === 'en' ? (
            isLongTextField(field) ? (
              <textarea
                value={enValue}
                onChange={(e) => updateContent(page, section, field, e.target.value, 'en')}
                className={inputClass}
                rows={3}
                placeholder="English text..."
              />
            ) : (
              <input
                type="text"
                value={enValue}
                onChange={(e) => updateContent(page, section, field, e.target.value, 'en')}
                className={inputClass}
                placeholder="English text..."
              />
            )
          ) : (
            isLongTextField(field) ? (
              <textarea
                value={ptValue}
                onChange={(e) => updateContent(page, section, field, e.target.value, 'pt')}
                className={inputClass}
                rows={3}
                placeholder="Texto em português..."
              />
            ) : (
              <input
                type="text"
                value={ptValue}
                onChange={(e) => updateContent(page, section, field, e.target.value, 'pt')}
                className={inputClass}
                placeholder="Texto em português..."
              />
            )
          )}
        </div>
      );
    }

    // For sponsor descriptions that are not yet bilingual, add initialization button
    if (page === 'sponsors' && field === 'description' && !isBilingualField(value)) {
      return (
        <div key={fieldKey} className="mb-4">
          <label className={`block ${textSecondary} mb-2`}>
            Description (Currently Single Language)
          </label>
          <textarea
            value={value || ''}
            onChange={(e) => updateContent(page, section, field, e.target.value)}
            className={inputClass}
            rows={3}
            placeholder="Current description..."
          />
          <button
            onClick={() => {
              // Convert to bilingual format, keeping the current value as English
              updateContent(page, section, field, { en: value || '', pt: '' });
            }}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center gap-2"
          >
            🌐 Convert to Bilingual
          </button>
          <p className="text-xs text-gray-500 mt-1">
            Click to enable English and Portuguese editing for this description
          </p>
        </div>
      );
    }

    // Regular fields (non-bilingual)
    return (
      <div key={fieldKey} className="mb-4">
        <label className={`block ${textSecondary} text-sm mb-2`}>
          {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
        </label>
        {isLongTextField(field) ? (
          <textarea
            value={value || ''}
            onChange={(e) => updateContent(page, section, field, e.target.value)}
            className={inputClass}
            rows={3}
          />
        ) : (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => updateContent(page, section, field, e.target.value)}
            className={inputClass}
          />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`${bgCard} border ${borderColor} rounded-2xl p-6`}>
        <p className={textSecondary}>Loading content...</p>
      </div>
    );
  }

  return (
    <div className={`${bgCard} border ${borderColor} rounded-2xl p-4 sm:p-6`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className={`text-2xl ${textPrimary} mb-2`}>
            Content Management
          </h2>
          <p className={textSecondary}>
            Edit all website content organized by pages and sections
          </p>
        </div>
        {hasChanges && (
          <button
            onClick={saveContent}
            disabled={saving}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        )}
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-600">
          {successMessage}
        </div>
      )}

      <div className="space-y-3">
        {Object.entries(pageConfigs).map(([pageKey, pageConfig]: [string, any]) => {
          const isPageExpanded = expandedPages.has(pageKey);
          
          return (
            <div key={pageKey} className={`border ${borderColor} rounded-lg overflow-hidden`}>
              {/* Page Header */}
              <button
                onClick={() => togglePage(pageKey)}
                className={`w-full px-4 py-3 flex items-center justify-between ${theme === 'dark' ? 'bg-[#1A1816] hover:bg-[#252320]' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{pageConfig.icon}</span>
                  <span className={`${textPrimary}`}>{pageConfig.name}</span>
                </div>
                {isPageExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </button>

              {/* Page Content - Sections */}
              {isPageExpanded && (
                <div className="p-4 space-y-3">
                  {Object.entries(pageConfig.sections).map(([sectionKey, sectionConfig]: [string, any]) => {
                    const fullSectionKey = `${pageKey}.${sectionKey}`;
                    const isSectionExpanded = expandedSections.has(fullSectionKey);
                    
                    return (
                      <div key={fullSectionKey} className={`border ${borderColor} rounded-lg`}>
                        {/* Section Header */}
                        <button
                          onClick={() => toggleSection(fullSectionKey)}
                          className={`w-full px-3 py-2 flex items-center justify-between ${theme === 'dark' ? 'bg-[#252320] hover:bg-[#2A2724]' : 'bg-white hover:bg-gray-50'} transition-colors`}
                        >
                          <span className={`text-sm ${textPrimary}`}>{sectionConfig.name}</span>
                          {isSectionExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>

                        {/* Section Fields */}
                        {isSectionExpanded && (
                          <div className="p-3">
                            {sectionConfig.fields.map((field: string) => {
                              const fieldValue = content[pageKey]?.[sectionKey]?.[field];
                              return renderField(pageKey, sectionKey, field, fieldValue);
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {hasChanges && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={saveContent}
            disabled={saving}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      )}
    </div>
  );
}