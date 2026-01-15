import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Admin emails list
const ADMIN_EMAILS = [
  'denisjrr23@gmail.com',
  'ftc.alphalumen@gmail.com',
];

// Create storage bucket on startup
const BUCKET_NAME = 'make-5881ae94-images';
(async () => {
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
  if (!bucketExists) {
    await supabase.storage.createBucket(BUCKET_NAME, {
      public: false,
      fileSizeLimit: 10485760, // 10MB
    });
    console.log('Storage bucket created:', BUCKET_NAME);
  }
})();

// Middleware to check if user is admin
async function checkAdmin(c: any, next: any) {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return c.json({ error: 'Invalid token' }, 401);
  }

  if (!ADMIN_EMAILS.includes(user.email || '')) {
    return c.json({ error: 'Admin access required' }, 403);
  }

  c.set('user', user);
  await next();
}

// Get all robots
app.get('/make-server-5881ae94/robots', async (c) => {
  try {
    const robots = await kv.getByPrefix('robot:');
    return c.json({ robots });
  } catch (error: any) {
    console.error('Error fetching robots:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Add or update robot (admin only)
app.post('/make-server-5881ae94/robots', checkAdmin, async (c) => {
  try {
    const robot = await c.req.json();
    const id = robot.id || `robot:${Date.now()}`;
    
    await kv.set(id, {
      ...robot,
      id,
      updatedAt: new Date().toISOString(),
    });

    return c.json({ success: true, id });
  } catch (error: any) {
    console.error('Error saving robot:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Delete robot (admin only)
app.delete('/make-server-5881ae94/robots/:id', checkAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(id);
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting robot:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get all social posts
app.get('/make-server-5881ae94/posts', async (c) => {
  try {
    const allPosts = await kv.getByPrefix('post:');
    // Filter out invisible posts for public view
    const isAdmin = c.req.header('X-Admin-View') === 'true';
    const posts = isAdmin ? allPosts : allPosts.filter((post: any) => post.visible !== false);
    
    // Sort by order field (ascending), or by updatedAt if order doesn't exist
    const sortedPosts = posts.sort((a: any, b: any) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      // Fallback to updatedAt
      return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
    });
    
    return c.json({ posts: sortedPosts });
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Add or update social post (admin only)
app.post('/make-server-5881ae94/posts', checkAdmin, async (c) => {
  try {
    const post = await c.req.json();
    const id = post.id || `post:${Date.now()}`;
    
    await kv.set(id, {
      ...post,
      id,
      updatedAt: new Date().toISOString(),
    });

    return c.json({ success: true, id });
  } catch (error: any) {
    console.error('Error saving post:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Delete social post (admin only)
app.delete('/make-server-5881ae94/posts/:id', checkAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(id);
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting post:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Track download
app.post('/make-server-5881ae94/downloads/:material', async (c) => {
  try {
    const material = c.req.param('material');
    const key = `download:${material}`;
    const current = await kv.get(key);
    const count = (current?.count || 0) + 1;
    
    await kv.set(key, {
      count,
      lastDownload: new Date().toISOString(),
    });

    return c.json({ success: true, count });
  } catch (error: any) {
    console.error('Error tracking download:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get download stats (admin only)
app.get('/make-server-5881ae94/downloads', checkAdmin, async (c) => {
  try {
    const downloads = await kv.getByPrefix('download:');
    return c.json({ downloads });
  } catch (error: any) {
    console.error('Error fetching downloads:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Upload image (admin only)
app.post('/make-server-5881ae94/upload', checkAdmin, async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Storage upload error:', error);
      return c.json({ error: error.message }, 500);
    }

    // Get signed URL (valid for 10 years)
    const { data: urlData } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileName, 315360000); // 10 years in seconds

    return c.json({ 
      success: true, 
      fileName,
      url: urlData?.signedUrl 
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get all website images
app.get('/make-server-5881ae94/website-images', async (c) => {
  try {
    let images = await kv.get('website:images');
    
    // Initialize with default images if none are set
    if (!images || Object.keys(images).length === 0) {
      images = {
        heroBackground: '',
        heroLogo: '',
        aboutTeamPhoto: '',
      };
      await kv.set('website:images', images);
    }
    
    return c.json({ images });
  } catch (error: any) {
    console.error('Error fetching website images:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Update website images (admin only)
app.post('/make-server-5881ae94/website-images', checkAdmin, async (c) => {
  try {
    const images = await c.req.json();
    await kv.set('website:images', images);
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error updating website images:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get all website content (text and images organized by page)
app.get('/make-server-5881ae94/content', async (c) => {
  try {
    let content = await kv.get('website:content');
    
    // Initialize with default content if none exists
    if (!content || Object.keys(content).length === 0) {
      content = await initializeDefaultContent();
      await kv.set('website:content', content);
    }
    
    return c.json({ content });
  } catch (error: any) {
    console.error('Error fetching website content:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Update website content (admin only)
app.post('/make-server-5881ae94/content', checkAdmin, async (c) => {
  try {
    const { page, section, field, value, language } = await c.req.json();
    
    let content = await kv.get('website:content') || {};
    
    if (!content[page]) content[page] = {};
    if (!content[page][section]) content[page][section] = {};
    if (!content[page][section][field]) content[page][section][field] = {};
    
    if (language) {
      content[page][section][field][language] = value;
    } else {
      content[page][section][field] = value;
    }
    
    await kv.set('website:content', content);
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error updating website content:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Bulk update website content (admin only)
app.post('/make-server-5881ae94/content/bulk', checkAdmin, async (c) => {
  try {
    const content = await c.req.json();
    await kv.set('website:content', content);
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error bulk updating website content:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Initialize default content
async function initializeDefaultContent() {
  return {
    home: {
      hero: {
        logo: '',
        background: '',
        motto: { en: 'Always in flames!', pt: 'Sempre em chamas!' },
        buttonLearn: { en: 'Learn More', pt: 'Saiba Mais' },
        buttonAchievements: { en: 'Our Achievements', pt: 'Nossas Conquistas' },
      },
      about: {
        badge: { en: 'About Us', pt: 'Sobre Nós' },
        title: { en: 'Who We Are', pt: 'Quem Somos' },
        description1: { 
          en: 'ALPHIRE #26456 is a passionate FTC robotics team from São Paulo, Brazil. Founded on August 1, 2024, we bring together 15 dedicated students united by our love for robotics and innovation.',
          pt: 'ALPHIRE #26456 é uma equipe apaixonada de robótica FTC de São Paulo, Brasil. Fundada em 1º de agosto de 2024, reunimos 15 estudantes dedicados unidos pelo amor à robótica e inovação.'
        },
        description2: {
          en: 'Our team embodies the spirit of gracious professionalism and collaborative competition. We believe in pushing boundaries, learning from challenges, and inspiring the next generation through STEM education.',
          pt: 'Nossa equipe incorpora o espírito de profissionalismo gracioso e competição colaborativa. Acreditamos em ultrapassar limites, aprender com desafios e inspirar a próxima geração através da educação STEM.'
        },
        image: '',
      },
      stats: {
        competitions: { en: 'Competitions', pt: 'Competições' },
        competitionsValue: '3',
        awards: { en: 'Awards', pt: 'Prêmios' },
        awardsValue: '3',
        members: { en: 'Members', pt: 'Membros' },
        membersValue: '15',
        founded: { en: 'Founded', pt: 'Fundado' },
        foundedValue: '2024',
      },
      achievements: {
        badge: { en: 'Achievements', pt: 'Conquistas' },
        title: { en: 'Our Achievements', pt: 'Nossas Conquistas' },
        subtitle: {
          en: 'Celebrating our journey of excellence in robotics competitions',
          pt: 'Celebrando nossa jornada de excelência em competições de robótica'
        },
        connectYear: '2024',
        connect: { en: 'Team Attributes', pt: 'Atributos da Equipe' },
        connectDesc: {
          en: 'Recognized for our outstanding community outreach efforts',
          pt: 'Reconhecidos por nossos esforços excepcionais de divulgação comunitária'
        },
        winningYear: '2025',
        winning: { en: 'Winning Alliance', pt: 'Aliança Vencedora' },
        winningDesc: {
          en: 'Champions of the 2025 SP off-season tournament',
          pt: 'Campeões do torneio de 2025 SP off-season'
        },
        controlYear: '2025',
        control: { en: 'Control Award', pt: 'Prêmio Control' },
        controlDesc: {
          en: 'Excellence in robot control and sensor integration',
          pt: 'Excelência em controle de robô e integração de sensores'
        },
      },
    },
    aboutTeam: {
      header: {
        badge: { en: 'Our Story', pt: 'Nossa História' },
        title: { en: 'About Team ALPHIRE', pt: 'Sobre a Equipe ALPHIRE' },
        subtitle: {
          en: 'Inspiring the next generation through robotics, innovation, and gracious professionalism',
          pt: 'Inspirando a próxima geração através de robótica, inovação e profissionalismo gracioso'
        },
        heroImage: '',
      },
      schoolInfo: {
        schoolLabel: { en: 'School', pt: 'Escola' },
        schoolName: 'Instituto Tecnológico',
        locationLabel: { en: 'Location', pt: 'Localização' },
        locationName: 'São Paulo, Brazil',
        foundedLabel: { en: 'Founded', pt: 'Fundado' },
        foundedYear: '2024',
      },
      mission: {
        title: { en: 'Our Mission', pt: 'Nossa Missão' },
        text: {
          en: 'Team Alphire is dedicated to inspiring young minds through robotics and STEM education. We believe in the power of collaboration, innovation, and gracious professionalism. Our mission is to create a positive impact in our community while developing the skills and knowledge necessary to become future leaders in technology and engineering.',
          pt: 'O Time Alphire é dedicado a inspirar mentes jovens através da robótica e educação STEM. Acreditamos no poder da colaboração, inovação e profissionalismo gracioso. Nossa missão é criar um impacto positivo em nossa comunidade enquanto desenvolvemos as habilidades e conhecimentos necessários para nos tornarmos futuros líderes em tecnologia e engenharia.'
        },
      },
      areas: {
        title: { en: 'Our Areas of Focus', pt: 'Nossas Áreas de Foco' },
        engineering: { en: 'Engineering', pt: 'Engenharia' },
        engineeringDesc: {
          en: 'Mechanical design, CAD modeling, and robot construction',
          pt: 'Design mecânico, modelagem CAD e construção do robô'
        },
        programming: { en: 'Programming', pt: 'Programação' },
        programmingDesc: {
          en: 'Autonomous code, teleoperation, and vision systems',
          pt: 'Código autônomo, teleoperação e sistemas de visão'
        },
        business: { en: 'Business', pt: 'Negócios' },
        businessDesc: {
          en: 'Sponsorship, marketing, and team management',
          pt: 'Patrocínio, marketing e gestão da equipe'
        },
        outreach: { en: 'Outreach', pt: 'Divulgação' },
        outreachDesc: {
          en: 'Community engagement and STEM education',
          pt: 'Engajamento comunitário e educação STEM'
        },
      },
      timeline: {
        title: { en: 'Our Journey', pt: 'Nossa Jornada' },
        event1Year: '2024',
        event1Title: { en: 'Team Founded', pt: 'Fundação da Equipe' },
        event1Desc: {
          en: 'Started with 15 passionate students on August 1st',
          pt: 'Começamos com 15 estudantes apaixonados em 1º de agosto'
        },
        event2Year: '2024',
        event2Title: { en: 'Team Attributes', pt: 'Atributos da Equipe' },
        event2Desc: {
          en: 'Won Team Attributes in December',
          pt: 'Ganhamos Atributos da Equipe em dezembro'
        },
        event3Year: '2025',
        event3Title: { en: 'Winning Alliance', pt: 'Aliança Vencedora' },
        event3Desc: {
          en: 'Part of Winning Alliance at SP off-season',
          pt: 'Parte da Aliança Vencedora no torneio de SP'
        },
        event4Year: '2025',
        event4Title: { en: 'Control Award', pt: 'Prêmio Control' },
        event4Desc: {
          en: 'Won Control Award at SP off-season',
          pt: 'Ganhamos o Prêmio Control no torneio de SP'
        },
      },
      values: {
        title: { en: 'Our Values', pt: 'Nossos Valores' },
        teamwork: { en: 'Teamwork', pt: 'Trabalho em Equipe' },
        teamworkDesc: {
          en: 'We succeed together through collaboration',
          pt: 'Temos sucesso juntos através da colaboração'
        },
        innovation: { en: 'Innovation', pt: 'Inovação' },
        innovationDesc: {
          en: 'We push boundaries with creative solutions',
          pt: 'Ultrapassamos limites com soluções criativas'
        },
        community: { en: 'Community', pt: 'Comunidade' },
        communityDesc: {
          en: 'We give back and inspire others',
          pt: 'Retribuímos e inspiramos outros'
        },
      },
    },
    sponsors: {
      header: {
        badge: { en: 'Thank You', pt: 'Obrigado' },
        title: { en: 'Our Sponsors', pt: 'Nossos Patrocinadores' },
        subtitle: {
          en: 'We are grateful for the support of our amazing sponsors who make our journey possible',
          pt: 'Somos gratos pelo apoio de nossos incríveis patrocinadores que tornam nossa jornada possível'
        },
      },
      mainSponsors: {
        title: { en: 'Our Main Sponsors', pt: 'Nossos Principais Patrocinadores' },
      },
      sponsor1: {
        name: 'Parker Hannifin',
        description: { en: 'Motion and control technologies', pt: 'Tecnologias de movimento e controle' },
        url: 'https://www.parker.com/br/pt/home.html',
        logo: '',
      },
      sponsor2: {
        name: 'Dassault Systèmes',
        description: { en: '3D design and engineering software', pt: 'Software de design 3D e engenharia' },
        url: 'https://www.3ds.com',
        logo: '',
      },
      sponsor3: {
        name: 'Packwind',
        description: { en: 'Packaging and logistics solutions', pt: 'Soluções de embalagem e logística' },
        url: 'https://packwind.com.br',
        logo: '',
      },
      sponsor4: {
        name: 'Alpha Lumen School',
        description: { en: 'Educational institution', pt: 'Instituição educacional' },
        url: 'https://www.alphalumen.org.br',
        logo: '',
      },
      cta: {
        title: { en: 'Become a Sponsor', pt: 'Torne-se um Patrocinador' },
        subtitle: {
          en: 'Join us in inspiring the next generation of engineers and innovators',
          pt: 'Junte-se a nós para inspirar a próxima geração de engenheiros e inovadores'
        },
        becomeButton: { en: 'Become a Sponsor', pt: 'Torne-se um Patrocinador' },
        downloadButton: { en: 'Download Sponsorship Package', pt: 'Baixar Pacote de Patrocínio' },
      },
    },
    social: {
      header: {
        badge: { en: 'Connect', pt: 'Conecte-se' },
        title: { en: 'Social Media', pt: 'Redes Sociais' },
        subtitle: {
          en: 'Follow our journey and stay updated with our latest achievements',
          pt: 'Acompanhe nossa jornada e fique atualizado com nossas últimas conquistas'
        },
      },
      noPosts: {
        en: 'No posts available at the moment. Check back soon!',
        pt: 'Nenhuma postagem disponível no momento. Volte em breve!'
      },
    },
    robots: {
      header: {
        badge: { en: 'Our Robots', pt: 'Nossos Robôs' },
        title: { en: 'Robot Database', pt: 'Base de Dados de Robôs' },
        subtitle: {
          en: 'Explore our collection of competitive robots and their achievements',
          pt: 'Explore nossa coleção de robôs competitivos e suas conquistas'
        },
      },
      search: {
        placeholder: { en: 'Search robots...', pt: 'Buscar robôs...' },
        filterSeason: { en: 'Filter by Season', pt: 'Filtrar por Temporada' },
        allSeasons: { en: 'All Seasons', pt: 'Todas as Temporadas' },
      },
      noResults: {
        en: 'No robots found. Try adjusting your search.',
        pt: 'Nenhum robô encontrado. Tente ajustar sua busca.'
      },
    },
    materials: {
      header: {
        badge: { en: 'Resources', pt: 'Recursos' },
        title: { en: 'Educational Materials', pt: 'Materiais Educacionais' },
        subtitle: {
          en: 'Free resources to help you learn robotics and STEM',
          pt: 'Recursos gratuitos para ajudá-lo a aprender robótica e STEM'
        },
      },
      categories: {
        all: { en: 'All Materials', pt: 'Todos os Materiais' },
        programming: { en: 'Programming', pt: 'Programação' },
        cad: { en: 'CAD Design', pt: 'Design CAD' },
        engineering: { en: 'Engineering', pt: 'Engenharia' },
        business: { en: 'Business', pt: 'Negócios' },
      },
      downloadButton: { en: 'Download', pt: 'Baixar' },
      downloads: { en: 'downloads', pt: 'downloads' },
    },
    projects: {
      header: {
        badge: { en: 'Innovation', pt: 'Inovação' },
        title: { en: 'Our Projects', pt: 'Nossos Projetos' },
        subtitle: {
          en: 'Exploring technology and making an impact in our community',
          pt: 'Explorando tecnologia e causando impacto em nossa comunidade'
        },
      },
      arc: {
        name: { en: 'Advanced Robotics Classes', pt: 'Aulas Avançadas de Robótica' },
        description: {
          en: 'Teaching robotics fundamentals to students in our community through hands-on workshops and training sessions.',
          pt: 'Ensinando fundamentos de robótica para estudantes em nossa comunidade através de workshops práticos e sessões de treinamento.'
        },
        image: '',
        status: { en: 'Active', pt: 'Ativo' },
      },
      sgof: {
        name: { en: 'STEM Girls of the Future', pt: 'Meninas STEM do Futuro' },
        description: {
          en: 'Empowering young girls to pursue careers in STEM through mentorship, workshops, and inspiring role models.',
          pt: 'Capacitando jovens garotas para seguir carreiras em STEM através de mentoria, workshops e modelos inspiradores.'
        },
        image: '',
        status: { en: 'Active', pt: 'Ativo' },
      },
      flames: {
        name: { en: 'Flames of Knowledge', pt: 'Chamas do Conhecimento' },
        description: {
          en: 'Creating free educational content and resources to help teams learn programming, CAD design, and engineering.',
          pt: 'Criando conteúdo educacional gratuito e recursos para ajudar equipes a aprender programação, design CAD e engenharia.'
        },
        image: '',
        status: { en: 'Completed', pt: 'Concluído' },
      },
      cta: {
        title: { en: 'Want to Collaborate?', pt: 'Quer Colaborar?' },
        description: {
          en: 'We\'re always looking for opportunities to share our knowledge and work with other teams and organizations. Get in touch if you\'d like to collaborate on a project!',
          pt: 'Estamos sempre procurando oportunidades para compartilhar nosso conhecimento e trabalhar com outras equipes e organizações. Entre em contato se quiser colaborar em um projeto!'
        },
        buttonText: { en: 'Contact Us', pt: 'Entre em Contato' },
      },
    },
    aboutWebsite: {
      header: {
        badge: { en: 'Technology', pt: 'Tecnologia' },
        title: { en: 'About This Website', pt: 'Sobre Este Site' },
        subtitle: {
          en: 'Built with passion using modern web technologies',
          pt: 'Construído com paixão usando tecnologias web modernas'
        },
      },
      intro: {
        title: { en: 'Our Digital Home', pt: 'Nosso Lar Digital' },
        description: {
          en: 'This website was designed and developed by our team to showcase our journey in robotics. It serves as a hub for our achievements, resources, and community engagement.',
          pt: 'Este site foi projetado e desenvolvido por nossa equipe para mostrar nossa jornada na robótica. Serve como um centro para nossas conquistas, recursos e engajamento comunitário.'
        },
      },
      techStack: {
        title: { en: 'Technology Stack', pt: 'Stack Tecnológico' },
        react: { en: 'React', pt: 'React' },
        reactDesc: { en: 'Modern UI framework', pt: 'Framework moderno de UI' },
        tailwind: { en: 'Tailwind CSS', pt: 'Tailwind CSS' },
        tailwindDesc: { en: 'Utility-first styling', pt: 'Estilização utility-first' },
        typescript: { en: 'TypeScript', pt: 'TypeScript' },
        typescriptDesc: { en: 'Type-safe code', pt: 'Código type-safe' },
        supabase: { en: 'Supabase', pt: 'Supabase' },
        supabaseDesc: { en: 'Backend & database', pt: 'Backend e banco de dados' },
      },
      features: {
        title: { en: 'Features', pt: 'Recursos' },
        responsive: { en: 'Responsive Design', pt: 'Design Responsivo' },
        responsiveDesc: {
          en: 'Works perfectly on all devices',
          pt: 'Funciona perfeitamente em todos os dispositivos'
        },
        bilingual: { en: 'Bilingual Support', pt: 'Suporte Bilíngue' },
        bilingualDesc: {
          en: 'English and Portuguese available',
          pt: 'Inglês e Português disponíveis'
        },
        darkMode: { en: 'Dark Mode', pt: 'Modo Escuro' },
        darkModeDesc: {
          en: 'Eye-friendly viewing experience',
          pt: 'Experiência de visualização agradável'
        },
        cms: { en: 'Content Management', pt: 'Gestão de Conteúdo' },
        cmsDesc: {
          en: 'Easy admin panel for updates',
          pt: 'Painel admin fácil para atualizações'
        },
      },
    },
    navigation: {
      home: { en: 'Home', pt: 'Início' },
      robots: { en: 'Robots', pt: 'Robôs' },
      social: { en: 'Social', pt: 'Social' },
      sponsors: { en: 'Sponsors', pt: 'Patrocinadores' },
      materials: { en: 'Materials', pt: 'Materiais' },
      projects: { en: 'Projects', pt: 'Projetos' },
      aboutTeam: { en: 'About Team', pt: 'Sobre a Equipe' },
      aboutWebsite: { en: 'About Website', pt: 'Sobre o Site' },
      admin: { en: 'Admin', pt: 'Admin' },
    },
    footer: {
      description: {
        en: 'ALPHIRE #26456 - Inspiring the next generation through robotics and innovation',
        pt: 'ALPHIRE #26456 - Inspirando a próxima geração através de robótica e inovação'
      },
      quickLinks: { en: 'Quick Links', pt: 'Links Rápidos' },
      followUs: { en: 'Follow Us', pt: 'Siga-nos' },
      copyright: {
        en: '© 2024 Team ALPHIRE. All rights reserved.',
        pt: '© 2024 Equipe ALPHIRE. Todos os direitos reservados.'
      },
    },
  };
}

// Health check
app.get('/make-server-5881ae94/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Submit contact form (public)
app.post('/make-server-5881ae94/contact', async (c) => {
  try {
    const submission = await c.req.json();
    const id = `contact:${Date.now()}`;
    
    await kv.set(id, {
      ...submission,
      id,
      submittedAt: new Date().toISOString(),
      read: false,
    });

    return c.json({ success: true, id });
  } catch (error: any) {
    console.error('Error saving contact submission:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get all contact submissions (admin only)
app.get('/make-server-5881ae94/contacts', checkAdmin, async (c) => {
  try {
    const contacts = await kv.getByPrefix('contact:');
    // Sort by most recent first
    contacts.sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    return c.json({ contacts });
  } catch (error: any) {
    console.error('Error fetching contact submissions:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Mark contact as read (admin only)
app.patch('/make-server-5881ae94/contacts/:id/read', checkAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    const contact = await kv.get(id);
    
    if (!contact) {
      return c.json({ error: 'Contact not found' }, 404);
    }

    await kv.set(id, {
      ...contact,
      read: true,
    });

    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error marking contact as read:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Delete contact submission (admin only)
app.delete('/make-server-5881ae94/contacts/:id', checkAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(id);
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting contact submission:', error);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);