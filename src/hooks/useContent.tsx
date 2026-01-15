import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function useContent(page: string) {
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();

    // Listen for content updates from admin panel
    const handleContentUpdate = (event: any) => {
      if (event.detail && event.detail[page]) {
        setContent(event.detail[page]);
      }
    };

    window.addEventListener('contentUpdated', handleContentUpdate);

    return () => {
      window.removeEventListener('contentUpdated', handleContentUpdate);
    };
  }, [page]);

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
      if (data.content && data.content[page]) {
        setContent(data.content[page]);
      }
    } catch (error) {
      console.error(`Error loading ${page} content:`, error);
    } finally {
      setLoading(false);
    }
  };

  const getText = (section: string, field: string, language: string) => {
    const value = content[section]?.[field];
    if (!value) return '';
    
    // If it's a bilingual object
    if (typeof value === 'object' && (value.en || value.pt)) {
      return value[language] || value.en || '';
    }
    
    // If it's a plain string
    return value;
  };

  const getImage = (section: string, field: string) => {
    return content[section]?.[field] || '';
  };

  return { content, loading, getText, getImage };
}
