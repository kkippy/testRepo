import React, { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Template, SortOption, TemplateCategory } from '../types';
import { TemplateCard } from '../components/TemplateCard';
import { HeroCarousel } from '../components/HeroCarousel';
import { MOCK_TEMPLATES, CATEGORIES } from '../utils/mockData';

interface HomePageProps {
  searchResult: { ids: string[], reason: string } | null;
  clearSearch: () => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  textSearch: string;
  setTextSearch: (text: string) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  onTemplateClick: (template: Template) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  searchResult,
  clearSearch,
  activeCategory,
  setActiveCategory,
  textSearch,
  setTextSearch,
  sortOption,
  setSortOption,
  onTemplateClick
}) => {
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

  const sortOptionsMap: Record<SortOption, string> = {
    'featured': '精选推荐',
    'price-asc': '价格：低到高',
    'price-desc': '价格：高到低',
    'rating': '评分最高'
  };

  const [isSortMenuOpen, setIsSortMenuOpen] = React.useState(false);

  return (
    <motion.div
      key="list-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen"
    >
      {searchResult ? (
        <header className="px-6 pt-12 pb-4 md:pt-20 md:pb-8 max-w-[1800px] mx-auto">
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
        </header>
      ) : (
        <HeroCarousel featuredTemplates={MOCK_TEMPLATES.slice(0, 5)} />
      )}

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
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:border-black transition-colors min-w-[140px] justify-between"
                >
                  <span>{sortOptionsMap[sortOption]}</span>
                  <svg className={`w-4 h-4 transition-transform ${isSortMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                </button>
                
                <AnimatePresence>
                  {isSortMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50"
                    >
                      {Object.entries(sortOptionsMap).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => {
                            setSortOption(key as SortOption);
                            setIsSortMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${sortOption === key ? 'bg-orange-50 text-orange-900 font-medium' : 'text-gray-600'}`}
                        >
                          {label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
           </div>
         </div>
      </div>

      <main className="max-w-[1800px] mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {displayedTemplates.map((template, index) => (
            <TemplateCard 
              key={template.id} 
              template={template} 
              index={index}
              onClick={onTemplateClick}
            />
          ))}
        </div>
        
        {displayedTemplates.length === 0 && (
           <div className="py-32 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900">未找到相关模版</h3>
              <p className="text-gray-500 mt-2">尝试更换关键词或清除筛选条件</p>
              <button 
                onClick={() => {
                   clearSearch();
                   setActiveCategory('全部');
                   setTextSearch('');
                }}
                className="mt-6 px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                清除所有筛选
              </button>
           </div>
        )}
      </main>
    </motion.div>
  );
};
