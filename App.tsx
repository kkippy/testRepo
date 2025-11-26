
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Template, TemplateCategory, SortOption, UserProfile as UserProfileType, Transaction, DownloadRecord } from './types';
import { TemplateCard } from './components/TemplateCard';
import { SearchOverlay } from './components/SearchOverlay';
import { ProductModal } from './components/ProductModal';
import { AuthPage } from './components/AuthPage';
import { UserProfile } from './components/UserProfile';
import { Confetti } from './components/Confetti';
import { getSmartRecommendations } from './services/geminiService';

// --- MOCK DATA GENERATION ---
const CATEGORIES = Object.values(TemplateCategory);

const generateMockTemplates = (): Template[] => {
  return Array.from({ length: 32 }).map((_, i) => {
    const category = CATEGORIES[i % CATEGORIES.length];
    const id = `tpl-${i}`;
    
    const dslCode = `// ${id} Configuration
import { Layout, Theme } from '@zelpis/core';

export const config = {
  theme: {
    mode: 'dark',
    primary: '#${Math.floor(Math.random()*16777215).toString(16)}',
    font: 'Inter'
  },
  layout: {
    type: '${category.toLowerCase().replace(' ', '-')}',
    gridCols: ${i % 2 === 0 ? 12 : 4},
    gap: '2rem',
    fluid: true
  },
  features: [
    'seo-optimized',
    'lazy-loading',
    'accessibility-v2'
  ]
};`;

    const titles = [
      "Lumina 筑梦集", "Apex 极速电商", "Zenith 博客", "Nexus 仪表盘", "Flux 落地页", 
      "Orbit 创意代理", "Stellar 个人主页", "Vortex SaaS系统", "Echo 资讯网", "Pulse 后台管理",
      "Aether 精品店", "Mono 极简文稿", "Quantum UI 套件", "Velvet 社交中心", "Prism 数据分析"
    ];
    
    const authors = ["Studio K", "DesignFlow", "MinimalistCo", "PixelPerfect", "Avanti"];
    const descriptions = [
      "一款为现代创作者精心打造的模版。具备响应式布局，支持深色模式，以及干净的排版。",
      "专为高转化率设计的电商界面，流畅的动画效果和极致的性能优化。",
      "极简主义风格的博客主题，专注于内容阅读体验，SEO 友好。",
      "功能强大的后台管理系统，内置丰富的数据可视化组件。",
    ];

    const tagsList = [
      ["React", "Tailwind", "极简风格", "深色模式"],
      ["Vue", "GSAP", "创意交互", "3D效果"],
      ["NextJS", "Framer", "作品集", "动画"],
      ["Dashboard", "图表", "数据分析", "Admin"]
    ];

    const reviewsList = [
      { user: 'Alex M.', comment: '设计简直太惊艳了，代码质量也是一流。' },
      { user: 'Sarah J.', comment: '易于定制，文档如果再详细一点就完美了。' },
      { user: '李明', comment: '交互非常流畅，这就是我一直在寻找的风格。' },
      { user: 'DesignPro', comment: '作为设计师，我对这个模版的细节处理印象深刻。' }
    ];

    return {
      id: id,
      title: titles[i % titles.length] + ` ${Math.floor(i / titles.length) + 1}`,
      author: authors[i % authors.length],
      price: 29 + (i % 8) * 10 + (i % 2 === 0 ? 9 : 0),
      category: category,
      description: `这是一个${category}类别的顶级模版。${descriptions[i % descriptions.length]} 完美适合希望提升数字形象的专业人士。`,
      imageUrl: `https://picsum.photos/1200/750?random=${i + 100}`,
      tags: tagsList[i % tagsList.length],
      rating: 4 + (i % 10) / 10,
      dslCode: dslCode,
      previewUrl: '#',
      reviews: [
        {
          id: 'r1',
          user: reviewsList[i % 4].user,
          rating: 5,
          date: '2 天前',
          comment: reviewsList[i % 4].comment
        },
        {
          id: 'r2',
          user: reviewsList[(i + 1) % 4].user,
          rating: 4.5,
          date: '1 周前',
          comment: reviewsList[(i + 1) % 4].comment
        }
      ]
    };
  });
};

const MOCK_TEMPLATES = generateMockTemplates();

// --- HERO ILLUSTRATION COMPONENT ---
const HeroIllustration = () => (
  <div className="relative w-full h-full min-h-[400px] flex items-center justify-center perspective-1000 pointer-events-none select-none">
    {/* Ambient Gradients - Warm Tones */}
    <motion.div 
      initial={{ opacity: 0.3, scale: 1 }}
      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 8, repeat: Infinity }}
      className="absolute top-1/4 right-1/4 w-64 h-64 bg-orange-200 rounded-full blur-3xl mix-blend-multiply" 
    />
    <motion.div 
      initial={{ opacity: 0.3, scale: 1 }}
      animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 10, repeat: Infinity, delay: 1 }}
      className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-rose-100 rounded-full blur-3xl mix-blend-multiply" 
    />

    {/* Floating Abstract UI Elements - With Initial States to prevent Pop-in */}
    <motion.div
      initial={{ rotateX: 20, rotateY: -20, y: 0, opacity: 1 }}
      animate={{ 
        rotateX: [20, 15, 20], 
        rotateY: [-20, -10, -20],
        y: [0, -20, 0]
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="relative z-10 w-56 aspect-[3/4] bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl p-4 flex flex-col gap-4"
    >
      <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
         <div className="absolute inset-0 bg-gradient-to-tr from-orange-50 to-orange-100" />
      </div>
      <div className="space-y-2">
        <div className="w-3/4 h-2 bg-gray-200 rounded-full" />
        <div className="w-1/2 h-2 bg-gray-200 rounded-full" />
        <div className="w-full h-2 bg-gray-100 rounded-full mt-4" />
      </div>
      <div className="mt-auto flex justify-between items-center">
         <div className="w-6 h-6 rounded-full bg-gray-200" />
         <div className="w-12 h-4 rounded-full bg-black/5" />
      </div>
    </motion.div>

    {/* Background Card */}
    <motion.div
      initial={{ rotateX: 20, rotateY: -20, x: 40, y: 40, z: -50, opacity: 1 }}
      animate={{ 
        y: [40, 60, 40],
        rotateY: [-20, -25, -20]
      }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      className="absolute z-0 w-56 aspect-[3/4] bg-[#fafafa]/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl"
    />
    
    {/* Floating Sphere - Warm */}
    <motion.div
      initial={{ y: -10, opacity: 1 }}
      animate={{ y: [-10, 10, -10] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -left-4 top-1/3 w-16 h-16 bg-gradient-to-br from-orange-50 to-white rounded-full shadow-lg border border-white/50 backdrop-blur-sm z-20"
    />
  </div>
);

const App: React.FC = () => {
  // View State (Filters)
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{ids: string[], reason: string} | null>(null);
  
  // Navigation State (Replacing Router)
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'profile' | 'auth'>('list');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  // User State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfileType>({
    name: 'Design Enthusiast',
    email: 'user@example.com',
    bio: '热爱设计与极简主义的开发者。',
    avatar: 'D',
    credits: 1250
  });
  // Initialize with some mock favorite IDs to show functionality
  const [favorites, setFavorites] = useState<string[]>(['tpl-0', 'tpl-2', 'tpl-5']);
  
  const [downloadRecords, setDownloadRecords] = useState<DownloadRecord[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 't1', type: 'recharge', amount: 500, date: '2024-05-20', description: '钱包充值' },
    { id: 't2', type: 'expense', amount: 49, date: '2024-05-21', description: '购买模版: Lumina 筑梦集 1' }
  ]);

  // Filters
  const [textSearch, setTextSearch] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const sortOptionsMap: Record<SortOption, string> = {
    'featured': '精选推荐',
    'price-asc': '价格：低到高',
    'price-desc': '价格：高到低',
    'rating': '评分最高'
  };

  // Filter Logic Pipeline
  const displayedTemplates = useMemo(() => {
    let filtered = [...MOCK_TEMPLATES];

    if (searchResult) {
      filtered = filtered.filter(t => searchResult.ids.includes(t.id));
    }

    if (activeCategory !== '全部') {
      filtered = filtered.filter(t => t.category === activeCategory);
    }

    if (textSearch.trim()) {
      const q = textSearch.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.author.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    switch (sortOption) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        break;
    }

    return filtered;
  }, [activeCategory, searchResult, textSearch, sortOption]);

  // Handlers
  const handleSmartSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const result = await getSmartRecommendations(query, MOCK_TEMPLATES);
      setSearchResult({ ids: result.recommendedIds, reason: result.reasoning });
      setActiveCategory('全部');
      setTextSearch('');
      setSortOption('featured');
      setIsSearchOpen(false);
      setCurrentView('list');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchResult(null);
    setTextSearch('');
  };

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToStore = () => {
    setCurrentView('list');
    setTimeout(() => {
      setSelectedTemplate(null);
    }, 500);
  };

  // Auth Logic
  const handleLogin = () => {
    setIsAuthenticated(true);
    // Trigger Celebration
    setShowConfetti(true);
    setShowLoginSuccess(true);
    
    setTimeout(() => {
       setCurrentView('list');
       setTimeout(() => {
         setShowConfetti(false);
         setShowLoginSuccess(false);
       }, 3000);
    }, 1000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('list');
    setShowConfetti(false);
  };

  // Favorite Logic
  const handleToggleFavorite = (template: Template) => {
    setFavorites(prev => {
      if (prev.includes(template.id)) {
        return prev.filter(id => id !== template.id);
      } else {
        return [...prev, template.id];
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#fcfaf8] text-primary font-sans selection:bg-orange-200 selection:text-orange-900 relative overflow-x-hidden">
      
      {/* Confetti Overlay */}
      {showConfetti && <Confetti />}

      {/* Login Success Toast */}
      <AnimatePresence>
        {showLoginSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className="fixed top-24 left-1/2 z-[100] bg-white border border-green-100 shadow-2xl px-8 py-4 rounded-full flex items-center gap-3"
          >
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div className="font-bold text-gray-900">欢迎回来，{userProfile.name}！</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- AUTH VIEW --- */}
      {currentView === 'auth' ? (
         <div className="absolute inset-0 z-40 bg-[#fcfaf8]">
             <AuthPage onLogin={handleLogin} />
         </div>
      ) : (
        <>
          {/* --- HEADER --- */}
          <nav className="sticky top-0 z-50 bg-[#fcfaf8]/80 backdrop-blur-xl border-b border-gray-200/50 transition-all">
            <div className="max-w-[1800px] mx-auto px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2 cursor-pointer group" onClick={handleBackToStore}>
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-orange-900 font-serif font-bold italic text-xl">Z</span>
                </div>
                <span className="text-xl font-serif font-semibold tracking-tight">Zelpis TP</span>
              </div>
              
              <div className="flex items-center gap-4">
                 <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="group flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-900 rounded-full transition-all duration-300"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  <span className="text-sm font-medium hidden sm:inline">询问 Zelpis AI</span>
                </button>

                {isAuthenticated ? (
                  <div 
                    onClick={() => setCurrentView('profile')}
                    className="w-9 h-9 bg-orange-900 text-orange-50 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer hover:bg-orange-800 transition-colors ring-2 ring-offset-2 ring-transparent hover:ring-orange-200"
                  >
                    {userProfile.avatar}
                  </div>
                ) : (
                  <button 
                    onClick={() => setCurrentView('auth')}
                    className="px-5 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
                  >
                    登录
                  </button>
                )}
              </div>
            </div>
          </nav>

          <AnimatePresence mode="wait">
             {/* --- LIST VIEW --- */}
             {currentView === 'list' && (
                <motion.div
                  key="list-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }} // Simplified exit to avoid white flash
                  transition={{ duration: 0.4 }}
                  className="min-h-screen"
                >
                  <header className="px-6 pt-12 pb-4 md:pt-20 md:pb-8 max-w-[1800px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                      <div className="lg:col-span-7 xl:col-span-8 space-y-6 z-10">
                         {searchResult ? (
                           <div className="space-y-4">
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-xs font-bold tracking-wider text-orange-700 uppercase">
                                AI 甄选
                              </div>
                              <h1 className="text-4xl md:text-6xl font-serif leading-tight text-gray-900">
                                "{searchResult.reason}"
                              </h1>
                              <button 
                                onClick={clearSearch} 
                                className="group flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-black transition-colors mt-4"
                              >
                                <span className="border-b border-gray-300 group-hover:border-black pb-0.5">返回全部模版</span>
                              </button>
                           </div>
                         ) : (
                           <div>
                             <h1 className="text-6xl md:text-8xl font-serif font-medium leading-[0.9] tracking-tighter text-gray-900">
                                设计 · 模版 <br/>
                                <span className="text-gray-300 italic pl-4">灵感库</span>
                              </h1>
                              <p className="text-lg text-gray-500 mt-6 max-w-md leading-relaxed font-light pl-2 border-l-2 border-orange-100">
                                为现代创作者甄选的数字资产。极致的美学标准，流畅的交互体验。
                              </p>
                           </div>
                         )}
                      </div>

                      <div className="lg:col-span-5 xl:col-span-4 hidden lg:block">
                         <HeroIllustration />
                      </div>
                    </div>
                  </header>

                  {/* Toolbar */}
                  <div className="sticky top-[73px] z-40 bg-[#fcfaf8]/95 backdrop-blur-md border-b border-gray-200/50 py-3 px-6 mb-8 transition-all shadow-sm">
                     <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                       <div className="w-full md:w-auto overflow-x-auto no-scrollbar flex items-center space-x-2 pb-2 md:pb-0">
                          {['全部', ...CATEGORIES].map(cat => (
                            <button
                              key={cat}
                              onClick={() => { setActiveCategory(cat); }}
                              className={`whitespace-nowrap px-5 py-1.5 rounded-full text-sm transition-all duration-300 border ${
                                activeCategory === cat 
                                  ? 'bg-primary text-white border-primary shadow-md' 
                                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-black'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                       </div>

                       <div className="w-full md:w-auto flex items-center gap-3">
                          <div className="relative flex-1 md:w-64 group">
                             <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                               <svg className="w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35"/></svg>
                             </div>
                             <input 
                               type="text" 
                               placeholder="搜索模版..." 
                               value={textSearch}
                               onChange={(e) => setTextSearch(e.target.value)}
                               className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-all placeholder-gray-400"
                             />
                          </div>

                          <div className="relative">
                            <button 
                              onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:border-gray-400 transition-all whitespace-nowrap"
                            >
                              <span className="hidden sm:inline text-gray-500">排序:</span>
                              <span className="capitalize">{sortOptionsMap[sortOption]}</span>
                              <svg className={`w-3 h-3 transition-transform ${isSortMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                            </button>
                            
                            <AnimatePresence>
                               {isSortMenuOpen && (
                                 <motion.div 
                                   initial={{ opacity: 0, y: -5 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   exit={{ opacity: 0, y: -5 }}
                                   className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 overflow-hidden"
                                 >
                                   {(['featured', 'price-asc', 'price-desc', 'rating'] as SortOption[]).map((option) => (
                                     <button
                                       key={option}
                                       onClick={() => { setSortOption(option); setIsSortMenuOpen(false); }}
                                       className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${sortOption === option ? 'font-medium text-black' : 'text-gray-500'}`}
                                     >
                                       <span className="capitalize">{sortOptionsMap[option]}</span>
                                       {sortOption === option && <span className="w-1 h-1 bg-black rounded-full"></span>}
                                     </button>
                                   ))}
                                 </motion.div>
                               )}
                             </AnimatePresence>
                             {isSortMenuOpen && <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsSortMenuOpen(false)} />}
                          </div>
                       </div>
                     </div>
                  </div>

                  <main className="px-6 pb-24 max-w-[1800px] mx-auto min-h-[600px]">
                    {displayedTemplates.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                           <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">未找到相关模版</h3>
                        <button onClick={() => { clearSearch(); setActiveCategory('全部'); }} className="mt-6 text-black border-b border-black hover:opacity-60 transition-opacity">清空筛选条件</button>
                      </div>
                    ) : (
                      <motion.div 
                        layout
                        variants={{
                          hidden: {},
                          show: {
                            transition: {
                              staggerChildren: 0.06
                            }
                          }
                        }}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10"
                      >
                        <AnimatePresence mode='popLayout'>
                          {displayedTemplates.map((template) => (
                            <TemplateCard 
                              key={template.id} 
                              template={template} 
                              onClick={handleTemplateClick}
                            />
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </main>
                </motion.div>
             )}

             {/* --- DETAIL VIEW --- */}
             {currentView === 'detail' && selectedTemplate && (
               <ProductModal 
                 key="detail-view"
                 template={selectedTemplate} 
                 allTemplates={MOCK_TEMPLATES}
                 onClose={handleBackToStore}
                 onRelatedClick={handleTemplateClick}
                 isFavorite={favorites.includes(selectedTemplate.id)}
                 onToggleFavorite={() => handleToggleFavorite(selectedTemplate)} 
               />
             )}

             {/* --- PROFILE VIEW --- */}
             {currentView === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="absolute inset-0 z-40 bg-[#fcfaf8]"
                >
                  <UserProfile 
                    user={userProfile}
                    transactions={transactions}
                    downloadRecords={downloadRecords}
                    favoriteTemplates={MOCK_TEMPLATES.filter(t => favorites.includes(t.id))}
                    onLogout={handleLogout}
                    onUpdateProfile={(updated) => setUserProfile({ ...userProfile, ...updated })}
                    onTemplateClick={handleTemplateClick}
                    onHome={handleBackToStore}
                  />
                </motion.div>
             )}

          </AnimatePresence>

          <SearchOverlay 
            isOpen={isSearchOpen} 
            onClose={() => setIsSearchOpen(false)}
            onSearch={handleSmartSearch}
            isSearching={isSearching}
          />
          
          <footer className="bg-white border-t border-gray-100 py-24 px-6 mt-auto">
            <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
              <div className="space-y-4">
                <h2 className="text-3xl font-serif font-bold tracking-tight">Zelpis TP</h2>
                <p className="text-gray-400 text-sm max-w-xs">
                  为创作者赋能，打破想象与现实的边界。
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 text-sm">
                <div className="flex flex-col gap-4">
                    <span className="font-bold text-black">平台</span>
                    <a href="#" className="text-gray-500 hover:text-black transition-colors">浏览</a>
                    <a href="#" className="text-gray-500 hover:text-black transition-colors">出售</a>
                </div>
                <div className="flex flex-col gap-4">
                    <span className="font-bold text-black">公司</span>
                    <a href="#" className="text-gray-500 hover:text-black transition-colors">联系我们</a>
                </div>
              </div>
            </div>
            <div className="max-w-[1800px] mx-auto mt-16 pt-8 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
              <p>© 2024 Zelpis TP Inc.</p>
              <p>Designed with Gemini.</p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;
