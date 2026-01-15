import { useState, useEffect } from 'react';
import { useApp } from '../App';
import { LogIn, LogOut, Plus, Edit2, Trash2, Save, UserPlus, Eye, EyeOff, Download as DownloadIcon, Upload, ArrowUp, ArrowDown, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { supabase } from '../utils/supabase/client';
import { ContentEditor } from '../components/ContentEditor';

export function Admin() {
  const { theme, language } = useApp();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'robots' | 'posts' | 'downloads' | 'control' | 'contacts'>('content');
  const [robots, setRobots] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [expandedContact, setExpandedContact] = useState<string | null>(null);
  const [editingRobot, setEditingRobot] = useState<any>(null);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [showRobotForm, setShowRobotForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [websiteImages, setWebsiteImages] = useState<any>({});

  const ADMIN_EMAILS = [
    'denisjrr23@gmail.com',
    'ftc.alphalumen@gmail.com',
  ];

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      const isAdminUser = ADMIN_EMAILS.includes(session.user.email || '');
      setIsAdmin(isAdminUser);
      if (isAdminUser) {
        loadData();
      }
    }
  };

  const loadData = async () => {
    await Promise.all([loadRobots(), loadPosts(), loadDownloads(), loadWebsiteImages(), loadContacts()]);
  };

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
      setRobots(data.robots || []);
    } catch (error) {
      console.error('Error loading robots:', error);
    }
  };

  const loadPosts = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5881ae94/posts`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'X-Admin-View': 'true',
          },
        }
      );
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const loadDownloads = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5881ae94/downloads`,
        {
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
          },
        }
      );
      const data = await response.json();
      setDownloads(data.downloads || []);
    } catch (error) {
      console.error('Error loading downloads:', error);
    }
  };

  const loadWebsiteImages = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5881ae94/website-images`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      setWebsiteImages(data.images || {});
    } catch (error) {
      console.error('Error loading website images:', error);
    }
  };

  const loadContacts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5881ae94/contacts`,
        {
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
          },
        }
      );
      const data = await response.json();
      setContacts(data.contacts || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const updateWebsiteImages = async (images: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5881ae94/website-images`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(images),
        }
      );
      
      if (response.ok) {
        setWebsiteImages(images);
      }
    } catch (error) {
      console.error('Error updating website images:', error);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
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
      return data.url || null;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      setError(error.message);
    } else {
      setError('Check your email for confirmation link!');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setError(error.message);
    } else {
      checkUser();
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  const saveRobot = async (robotData: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5881ae94/robots`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(robotData),
        }
      );
      
      if (response.ok) {
        loadRobots();
        setShowRobotForm(false);
        setEditingRobot(null);
      }
    } catch (error) {
      console.error('Error saving robot:', error);
    }
  };

  const deleteRobot = async (id: string) => {
    if (!confirm('Are you sure you want to delete this robot?')) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5881ae94/robots/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
          },
        }
      );
      loadRobots();
    } catch (error) {
      console.error('Error deleting robot:', error);
    }
  };

  const savePost = async (postData: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5881ae94/posts`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        }
      );
      
      if (response.ok) {
        loadPosts();
        setShowPostForm(false);
        setEditingPost(null);
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5881ae94/posts/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
          },
        }
      );
      loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const togglePostVisibility = async (post: any) => {
    await savePost({ ...post, visible: !post.visible });
  };

  const movePost = async (index: number, direction: 'up' | 'down') => {
    const newPosts = [...posts];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newPosts.length) return;
    
    // Swap the posts
    [newPosts[index], newPosts[targetIndex]] = [newPosts[targetIndex], newPosts[index]];
    
    // Update the order field for all posts
    const { data: { session } } = await supabase.auth.getSession();
    
    for (let i = 0; i < newPosts.length; i++) {
      const postWithOrder = { ...newPosts[i], order: i };
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5881ae94/posts`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postWithOrder),
        }
      );
    }
    
    // Update local state
    setPosts(newPosts);
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact message?')) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5881ae94/contacts/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
          },
        }
      );
      loadContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const bgPrimary = theme === 'dark' ? 'bg-[#0F0E0D]' : 'bg-[#F5F1E8]';
  const bgCard = theme === 'dark' ? 'bg-[#252320]' : 'bg-white';
  const textPrimary = theme === 'dark' ? 'text-[#F5F1E8]' : 'text-[#2C2416]';
  const textSecondary = theme === 'dark' ? 'text-[#C9C2B5]' : 'text-[#5C5346]';
  const borderColor = theme === 'dark' ? 'border-[#3A3632]' : 'border-[#E5DED0]';
  const inputClass = theme === 'dark'
    ? 'w-full px-4 py-3 bg-[#252320] border border-[#3A3632] rounded-lg text-[#F5F1E8] focus:outline-none focus:border-red-500'
    : 'w-full px-4 py-3 bg-white border border-[#E5DED0] rounded-lg text-[#2C2416] focus:outline-none focus:border-red-500';

  if (!user) {
    return (
      <div className={`min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 ${bgPrimary} transition-colors duration-300`}>
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`${bgCard} border ${borderColor} rounded-2xl p-6 sm:p-8`}>
            <div className="text-center mb-6">
              <h1 className={`text-2xl sm:text-3xl ${textPrimary} mb-2`}>
                {showLogin ? 'Admin Login' : 'Create Account'}
              </h1>
              <p className={`${textSecondary} text-sm`}>
                {showLogin ? 'Sign in to access the admin panel' : 'Register a new account'}
              </p>
            </div>

            {error && (
              <div className={`mb-4 p-3 rounded-lg ${error.includes('Check') ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'} text-sm`}>
                {error}
              </div>
            )}

            <form onSubmit={showLogin ? handleSignIn : handleSignUp} className="space-y-4">
              <div>
                <label className={`block ${textSecondary} text-sm mb-2`}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className={`block ${textSecondary} text-sm mb-2`}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                {showLogin ? (
                  <>
                    <LogIn size={20} />
                    Sign In
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setShowLogin(!showLogin);
                  setError('');
                }}
                className={`${textSecondary} hover:text-red-600 transition-colors text-sm`}
              >
                {showLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className={`min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 ${bgPrimary} transition-colors duration-300`}>
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`${bgCard} border ${borderColor} rounded-2xl p-8 text-center`}>
            <h1 className={`text-2xl ${textPrimary} mb-4`}>
              Access Denied
            </h1>
            <p className={`${textSecondary} mb-6`}>
              You don't have admin permissions. Contact the team administrator.
            </p>
            <p className={`${textSecondary} text-sm mb-6`}>
              Signed in as: {user.email}
            </p>
            <button
              onClick={signOut}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 ${bgPrimary} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className={`text-3xl ${textPrimary} mb-2`}>
              Admin Panel
            </h1>
            <p className={textSecondary}>
              Signed in as {user.email}
            </p>
          </div>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex gap-2 mb-6 border-b ${borderColor} overflow-x-auto`}>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-3 whitespace-nowrap ${activeTab === 'content' ? 'text-red-600 border-b-2 border-red-600' : textSecondary}`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('robots')}
            className={`px-4 py-3 whitespace-nowrap ${activeTab === 'robots' ? 'text-red-600 border-b-2 border-red-600' : textSecondary}`}
          >
            Robots
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-3 whitespace-nowrap ${activeTab === 'posts' ? 'text-red-600 border-b-2 border-red-600' : textSecondary}`}
          >
            Social Posts
          </button>
          <button
            onClick={() => setActiveTab('downloads')}
            className={`px-4 py-3 whitespace-nowrap ${activeTab === 'downloads' ? 'text-red-600 border-b-2 border-red-600' : textSecondary}`}
          >
            Downloads
          </button>
          <button
            onClick={() => setActiveTab('control')}
            className={`px-4 py-3 whitespace-nowrap ${activeTab === 'control' ? 'text-red-600 border-b-2 border-red-600' : textSecondary}`}
          >
            Image Control
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-3 whitespace-nowrap ${activeTab === 'contacts' ? 'text-red-600 border-b-2 border-red-600' : textSecondary}`}
          >
            Contacts
          </button>
        </div>

        {/* Content Tab */}
        {activeTab === 'content' && (
          <ContentEditor
            theme={theme}
            textPrimary={textPrimary}
            textSecondary={textSecondary}
            bgCard={bgCard}
            borderColor={borderColor}
          />
        )}

        {/* Robots Tab */}
        {activeTab === 'robots' && (
          <div className={`${bgCard} border ${borderColor} rounded-2xl p-4 sm:p-6`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className={`text-2xl ${textPrimary}`}>
                Manage Robots
              </h2>
              <button
                onClick={() => {
                  setEditingRobot({});
                  setShowRobotForm(true);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 w-full sm:w-auto"
              >
                <Plus size={18} />
                Add Robot
              </button>
            </div>

            {showRobotForm && (
              <RobotForm
                robot={editingRobot}
                onSave={saveRobot}
                onCancel={() => {
                  setShowRobotForm(false);
                  setEditingRobot(null);
                }}
                theme={theme}
              />
            )}

            <div className="space-y-4">
              {robots.length === 0 && !showRobotForm && (
                <p className={`${textSecondary} text-center py-8`}>
                  No robots yet. Click "Add Robot" to get started.
                </p>
              )}
              {robots.map((robot) => (
                <div
                  key={robot.id}
                  className={`p-4 border ${borderColor} rounded-lg`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className={textPrimary}>{robot.robotName}</h3>
                      <p className={textSecondary}>
                        {robot.teamName} #{robot.teamNumber}
                      </p>
                      <p className={`${textSecondary} text-sm`}>
                        {robot.city}, {robot.country} • {robot.season}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingRobot(robot);
                          setShowRobotForm(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteRobot(robot.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Posts Tab */}
        {activeTab === 'posts' && (
          <div className={`${bgCard} border ${borderColor} rounded-2xl p-4 sm:p-6`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className={`text-2xl ${textPrimary}`}>
                Manage Social Posts
              </h2>
              <button
                onClick={() => {
                  setEditingPost({ visible: true });
                  setShowPostForm(true);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 w-full sm:w-auto"
              >
                <Plus size={18} />
                Add Post
              </button>
            </div>

            {showPostForm && (
              <PostForm
                post={editingPost}
                onSave={savePost}
                onCancel={() => {
                  setShowPostForm(false);
                  setEditingPost(null);
                }}
                theme={theme}
              />
            )}

            <div className="space-y-4">
              {posts.length === 0 && !showPostForm && (
                <p className={`${textSecondary} text-center py-8`}>
                  No posts yet. Click "Add Post" to get started.
                </p>
              )}
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className={`p-4 border ${borderColor} rounded-lg ${post.visible === false ? 'opacity-50' : ''}`}
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full sm:w-24 h-24 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className={textPrimary}>{post.title}</h3>
                      <p className={`${textSecondary} text-sm mb-2`}>{post.link}</p>
                      <span className={`text-xs px-2 py-1 rounded ${post.visible === false ? 'bg-gray-500/20 text-gray-600' : 'bg-green-500/20 text-green-600'}`}>
                        {post.visible === false ? 'Hidden' : 'Visible'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => movePost(index, 'up')}
                        disabled={index === 0}
                        className={`p-2 rounded ${index === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
                        title="Move up"
                      >
                        <ArrowUp size={18} />
                      </button>
                      <button
                        onClick={() => movePost(index, 'down')}
                        disabled={index === posts.length - 1}
                        className={`p-2 rounded ${index === posts.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
                        title="Move down"
                      >
                        <ArrowDown size={18} />
                      </button>
                      <button
                        onClick={() => togglePostVisibility(post)}
                        className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded"
                        title={post.visible === false ? 'Make visible' : 'Hide post'}
                      >
                        {post.visible === false ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button
                        onClick={() => {
                          setEditingPost(post);
                          setShowPostForm(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Downloads Tab */}
        {activeTab === 'downloads' && (
          <div className={`${bgCard} border ${borderColor} rounded-2xl p-4 sm:p-6`}>
            <h2 className={`text-2xl ${textPrimary} mb-6`}>
              Download Statistics
            </h2>
            <div className="space-y-4">
              {downloads.length === 0 && (
                <p className={`${textSecondary} text-center py-8`}>
                  No downloads tracked yet.
                </p>
              )}
              {downloads.map((download) => (
                <div
                  key={download.id}
                  className={`p-4 border ${borderColor} rounded-lg flex items-center justify-between`}
                >
                  <div>
                    <h3 className={textPrimary}>
                      {download.id.replace('download:', '').replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </h3>
                    <p className={`${textSecondary} text-sm`}>
                      Last download: {new Date(download.lastDownload).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <DownloadIcon className="text-red-600" size={20} />
                    <span className={`text-2xl ${textPrimary}`}>{download.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Control Tab */}
        {activeTab === 'control' && (
          <ImageControl
            websiteImages={websiteImages}
            onUpdate={updateWebsiteImages}
            onUpload={uploadImage}
            theme={theme}
            textPrimary={textPrimary}
            textSecondary={textSecondary}
            bgCard={bgCard}
            borderColor={borderColor}
          />
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className={`${bgCard} border ${borderColor} rounded-2xl p-4 sm:p-6`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl ${textPrimary}`}>
                Contact Messages
              </h2>
              <span className={`px-3 py-1 rounded-full ${contacts.length > 0 ? 'bg-red-500/20 text-red-600' : 'bg-gray-500/20 text-gray-600'} text-sm`}>
                {contacts.length} {contacts.length === 1 ? 'message' : 'messages'}
              </span>
            </div>
            <div className="space-y-4">
              {contacts.length === 0 && (
                <p className={`${textSecondary} text-center py-8`}>
                  No contact messages yet.
                </p>
              )}
              {contacts.map((contact) => {
                const isExpanded = expandedContact === contact.id;
                const isRobotSubmission = contact.type === 'robot';
                
                return (
                  <div
                    key={contact.id}
                    className={`border ${borderColor} rounded-lg overflow-hidden transition-all`}
                  >
                    {/* Card Header */}
                    <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1A1816]" onClick={() => setExpandedContact(isExpanded ? null : contact.id)}>
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`p-3 rounded-full ${isRobotSubmission ? 'bg-blue-500/20' : 'bg-green-500/20'}`}>
                          <Mail className={isRobotSubmission ? 'text-blue-600' : 'text-green-600'} size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`${textPrimary} flex items-center gap-2`}>
                            {contact.name}
                            <span className={`text-xs px-2 py-1 rounded ${isRobotSubmission ? 'bg-blue-500/20 text-blue-600' : 'bg-green-500/20 text-green-600'}`}>
                              {isRobotSubmission ? 'Robot Submission' : 'General Contact'}
                            </span>
                          </h3>
                          <p className={`${textSecondary} text-sm`}>
                            {new Date(contact.submittedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteContact(contact.id);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          title="Delete contact"
                        >
                          <Trash2 size={18} />
                        </button>
                        {isExpanded ? <ChevronUp size={20} className={textSecondary} /> : <ChevronDown size={20} className={textSecondary} />}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className={`p-4 border-t ${borderColor} ${theme === 'dark' ? 'bg-[#1A1816]' : 'bg-gray-50'}`}>
                        <div className="space-y-4">
                          {/* Contact Method */}
                          <div>
                            <label className={`${textSecondary} text-sm block mb-1`}>Contact Method:</label>
                            <p className={textPrimary}>{contact.contactMethod}</p>
                          </div>

                          {/* Robot Submission Fields */}
                          {isRobotSubmission && (
                            <>
                              <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                  <label className={`${textSecondary} text-sm block mb-1`}>Team Number:</label>
                                  <p className={textPrimary}>{contact.teamNumber}</p>
                                </div>
                                <div>
                                  <label className={`${textSecondary} text-sm block mb-1`}>Team Name:</label>
                                  <p className={textPrimary}>{contact.teamName}</p>
                                </div>
                                <div>
                                  <label className={`${textSecondary} text-sm block mb-1`}>Robot Name:</label>
                                  <p className={textPrimary}>{contact.robotName}</p>
                                </div>
                                <div>
                                  <label className={`${textSecondary} text-sm block mb-1`}>Season:</label>
                                  <p className={textPrimary}>{contact.season}</p>
                                </div>
                              </div>

                              <div>
                                <label className={`${textSecondary} text-sm block mb-1`}>CAD Link:</label>
                                <a 
                                  href={contact.cadLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-700 underline break-all"
                                >
                                  {contact.cadLink}
                                </a>
                              </div>

                              <div>
                                <label className={`${textSecondary} text-sm block mb-1`}>Code Link:</label>
                                <a 
                                  href={contact.codeLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-700 underline break-all"
                                >
                                  {contact.codeLink}
                                </a>
                              </div>

                              <div>
                                <label className={`${textSecondary} text-sm block mb-1`}>Image Link:</label>
                                <a 
                                  href={contact.imageLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-700 underline break-all"
                                >
                                  {contact.imageLink}
                                </a>
                              </div>

                              <div>
                                <label className={`${textSecondary} text-sm block mb-1`}>Description:</label>
                                <p className={`${textPrimary} whitespace-pre-wrap`}>{contact.description}</p>
                              </div>
                            </>
                          )}

                          {/* General Message */}
                          {!isRobotSubmission && (
                            <div>
                              <label className={`${textSecondary} text-sm block mb-1`}>Message:</label>
                              <p className={`${textPrimary} whitespace-pre-wrap`}>{contact.message}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RobotForm({ robot, onSave, onCancel, theme }: any) {
  const [formData, setFormData] = useState(robot || {});
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5881ae94/upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: formDataUpload,
        }
      );

      const data = await response.json();
      if (data.url) {
        setFormData({ ...formData, image: data.url });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const currentPhotos = formData.photos || [];
    if (currentPhotos.length >= 5) {
      alert('Maximum 5 photos allowed');
      return;
    }

    setUploadingGallery(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5881ae94/upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: formDataUpload,
        }
      );

      const data = await response.json();
      if (data.url) {
        setFormData({ 
          ...formData, 
          photos: [...currentPhotos, data.url] 
        });
      }
    } catch (error) {
      console.error('Error uploading gallery image:', error);
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryPhoto = (index: number) => {
    const currentPhotos = formData.photos || [];
    const newPhotos = currentPhotos.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, photos: newPhotos });
  };

  const inputClass = theme === 'dark'
    ? 'w-full px-4 py-2 bg-[#252320] border border-[#3A3632] rounded-lg text-[#F5F1E8] focus:outline-none focus:border-red-500'
    : 'w-full px-4 py-2 bg-white border border-[#E5DED0] rounded-lg text-[#2C2416] focus:outline-none focus:border-red-500';

  const labelClass = theme === 'dark' ? 'text-[#C9C2B5]' : 'text-[#5C5346]';

  const currentPhotos = formData.photos || [];

  return (
    <form onSubmit={handleSubmit} className={`mb-6 p-4 sm:p-6 ${theme === 'dark' ? 'bg-[#1A1816]' : 'bg-gray-50'} rounded-lg`}>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={`block ${labelClass} text-sm mb-2`}>Robot Name *</label>
          <input
            type="text"
            placeholder="e.g., Phoenix"
            value={formData.robotName || ''}
            onChange={(e) => setFormData({ ...formData, robotName: e.target.value })}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={`block ${labelClass} text-sm mb-2`}>Team Name *</label>
          <input
            type="text"
            placeholder="e.g., Team Alphire"
            value={formData.teamName || ''}
            onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={`block ${labelClass} text-sm mb-2`}>Team Number *</label>
          <input
            type="text"
            placeholder="e.g., 26456"
            value={formData.teamNumber || ''}
            onChange={(e) => setFormData({ ...formData, teamNumber: e.target.value })}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={`block ${labelClass} text-sm mb-2`}>Season *</label>
          <input
            type="text"
            placeholder="e.g., 2024-2025"
            value={formData.season || ''}
            onChange={(e) => setFormData({ ...formData, season: e.target.value })}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={`block ${labelClass} text-sm mb-2`}>City *</label>
          <input
            type="text"
            placeholder="e.g., São Paulo"
            value={formData.city || ''}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={`block ${labelClass} text-sm mb-2`}>Country *</label>
          <input
            type="text"
            placeholder="e.g., Brazil"
            value={formData.country || ''}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={`block ${labelClass} text-sm mb-2`}>OPR (Offensive Power Rating)</label>
          <input
            type="number"
            step="0.01"
            placeholder="e.g., 85.5"
            value={formData.opr || ''}
            onChange={(e) => setFormData({ ...formData, opr: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className={`block ${labelClass} text-sm mb-2`}>Achievements</label>
        <textarea
          placeholder="e.g., Captain Alliance Winner, Control Award Winner"
          value={formData.achievements || ''}
          onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
          className={inputClass}
          rows={2}
        />
      </div>
      <div className="grid sm:grid-cols-1 gap-4 mb-4">
        <div>
          <label className={`block ${labelClass} text-sm mb-2`}>Main Robot Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className={inputClass}
            disabled={uploading}
          />
          {uploading && (
            <p className="text-sm text-blue-600 mt-2">Uploading...</p>
          )}
          {formData.image && (
            <div className="mt-2">
              <img src={formData.image} alt="Robot preview" className="w-32 h-32 object-cover rounded" />
            </div>
          )}
        </div>
        
        {/* Gallery Photos Section */}
        <div>
          <label className={`block ${labelClass} text-sm mb-2`}>
            📸 Robot Photos Gallery (Max 5 photos)
          </label>
          <div className="space-y-3">
            {currentPhotos.map((photoUrl: string, index: number) => (
              <div key={index} className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                <img 
                  src={photoUrl} 
                  alt={`Robot photo ${index + 1}`} 
                  className="w-20 h-20 object-cover rounded" 
                />
                <div className="flex-1 overflow-hidden">
                  <p className={`text-sm ${labelClass} truncate`}>Photo {index + 1}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeGalleryPhoto(index)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            
            {currentPhotos.length < 5 && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  className={inputClass}
                  disabled={uploadingGallery}
                />
                {uploadingGallery && (
                  <p className="text-sm text-blue-600 mt-2">Uploading photo...</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {currentPhotos.length}/5 photos uploaded
                </p>
              </div>
            )}
            
            {currentPhotos.length >= 5 && (
              <p className="text-sm text-orange-600">
                Maximum of 5 photos reached. Delete a photo to add a new one.
              </p>
            )}
            
            {currentPhotos.length === 0 && (
              <p className="text-sm text-gray-500 italic">
                No photos yet. Upload photos to create a gallery for this robot.
              </p>
            )}
          </div>
        </div>

        <div>
          <label className={`block ${labelClass} text-sm mb-2`}>CAD Link</label>
          <input
            type="url"
            placeholder="https://..."
            value={formData.cadLink || ''}
            onChange={(e) => setFormData({ ...formData, cadLink: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={`block ${labelClass} text-sm mb-2`}>Code Link</label>
          <input
            type="url"
            placeholder="https://..."
            value={formData.codeLink || ''}
            onChange={(e) => setFormData({ ...formData, codeLink: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
        >
          <Save size={18} />
          Save Robot
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function ImageControl({ websiteImages, onUpdate, onUpload, theme, textPrimary, textSecondary, bgCard, borderColor }: any) {
  const [images, setImages] = useState(websiteImages);
  const [uploading, setUploading] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const imageDefinitions = [
    {
      key: 'heroBackground',
      label: 'Home - Hero Background',
      description: 'Main background image on homepage hero section (Full team photo)',
      default: ''
    },
    {
      key: 'heroLogo',
      label: 'Home - ALPHIRE Logo',
      description: 'Large ALPHIRE logo with team number',
      default: ''
    },
    {
      key: 'aboutTeamPhoto',
      label: 'Home - About Team Photo',
      description: 'Team photo in "Who We Are" section (Team saluting)',
      default: ''
    },
  ];

  const handleImageUpload = async (key: string, file: File) => {
    setUploading(key);
    const url = await onUpload(file);
    if (url) {
      const newImages = { ...images, [key]: url };
      setImages(newImages);
      setHasChanges(true);
    }
    setUploading(null);
  };

  const handleSave = async () => {
    await onUpdate(images);
    setHasChanges(false);
    
    // Dispatch event to notify pages that images have been updated
    window.dispatchEvent(new CustomEvent('contentUpdated'));
  };

  const handleReset = (key: string) => {
    const def = imageDefinitions.find(d => d.key === key);
    if (def) {
      const newImages = { ...images, [key]: def.default };
      setImages(newImages);
      setHasChanges(true);
    }
  };

  return (
    <div className={`${bgCard} border ${borderColor} rounded-2xl p-4 sm:p-6`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className={`text-2xl ${textPrimary} mb-2`}>
            Image Control Center
          </h2>
          <p className={textSecondary}>
            Manage all website images in one place. Changes update in real-time.
          </p>
        </div>
        {hasChanges && (
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Save size={18} />
            Save Changes
          </button>
        )}
      </div>

      <div className="space-y-6">
        {imageDefinitions.map((def) => (
          <div
            key={def.key}
            className={`p-4 border ${borderColor} rounded-lg`}
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className={`${textPrimary} mb-2`}>{def.label}</h3>
                <p className={`${textSecondary} text-sm mb-4`}>{def.description}</p>
                
                <div className="space-y-2">
                  <label className={`block ${textSecondary} text-sm`}>
                    Upload New Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(def.key, file);
                    }}
                    disabled={uploading === def.key}
                    className={`w-full px-3 py-2 text-sm ${theme === 'dark' ? 'bg-[#252320] border-[#3A3632] text-[#F5F1E8]' : 'bg-white border-[#E5DED0] text-[#2C2416]'} border rounded-lg`}
                  />
                  {uploading === def.key && (
                    <p className="text-sm text-blue-600">Uploading...</p>
                  )}
                </div>

                <button
                  onClick={() => handleReset(def.key)}
                  className="mt-3 text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  Reset to Default
                </button>
              </div>

              <div>
                <p className={`${textSecondary} text-sm mb-2`}>Current Image Preview:</p>
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {images[def.key] ? (
                    <img
                      src={images[def.key]}
                      alt={def.label}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                      Using default image from design
                    </div>
                  )}
                </div>
                {images[def.key] && (
                  <p className={`${textSecondary} text-xs mt-2`}>Custom image uploaded</p>
                )}
                {!images[def.key] && (
                  <p className={`${textSecondary} text-xs mt-2`}>Using original design image</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PostForm({ post, onSave, onCancel, theme }: any) {
  const [formData, setFormData] = useState(post || { visible: true });
  const [uploading, setUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5881ae94/upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: formDataUpload,
        }
      );

      const data = await response.json();
      if (data.url) {
        setFormData({ ...formData, image: data.url });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const inputClass = theme === 'dark'
    ? 'w-full px-4 py-2 bg-[#252320] border border-[#3A3632] rounded-lg text-[#F5F1E8] focus:outline-none focus:border-red-500'
    : 'w-full px-4 py-2 bg-white border border-[#E5DED0] rounded-lg text-[#2C2416] focus:outline-none focus:border-red-500';

  const labelClass = theme === 'dark' ? 'text-[#C9C2B5]' : 'text-[#5C5346]';

  return (
    <form onSubmit={handleSubmit} className={`mb-6 p-4 sm:p-6 ${theme === 'dark' ? 'bg-[#1A1816]' : 'bg-gray-50'} rounded-lg`}>
      <div className="space-y-4 mb-4">
        <div>
          <label className={`block ${labelClass} text-sm mb-2`}>Post Title *</label>
          <input
            type="text"
            placeholder="e.g., Championship Winners!"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={`block ${labelClass} text-sm mb-2`}>Post Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className={inputClass}
            disabled={uploading}
          />
          {uploading && (
            <p className="text-sm text-blue-600 mt-2">Uploading...</p>
          )}
          {formData.image && (
            <div className="mt-2">
              <img src={formData.image} alt="Post preview" className="w-32 h-32 object-cover rounded" />
            </div>
          )}
        </div>
        <div>
          <label className={`block ${labelClass} text-sm mb-2`}>Link URL *</label>
          <input
            type="url"
            placeholder="https://..."
            value={formData.link || ''}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className={inputClass}
            required
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="visible"
            checked={formData.visible !== false}
            onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="visible" className={labelClass}>
            Visible on website
          </label>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
        >
          <Save size={18} />
          Save Post
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}