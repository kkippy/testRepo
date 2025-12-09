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
  const [isSortMenuOpen, setIsSortMenuOpen] = React.useState(false);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [priceRange, setPriceRange] = React.useState<{ min: string; max: string }>({ min: '', max: '' });
  const [minRating, setMinRating] = React.useState<number | null>(null);

  // Horizontal scroll ref and handler
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const scrollWrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const wrapper = scrollWrapperRef.current;
    const container = scrollContainerRef.current;
    
    if (wrapper && container) {
      const handleWheel = (e: WheelEvent) => {
        // If scrolling vertically, prevent default and scroll horizontally
        if (e.deltaY !== 0) {
          e.preventDefault();
          container.scrollLeft += e.deltaY;
        }
      };
      // Use passive: false to allow preventDefault which is crucial for blocking vertical scroll
      wrapper.addEventListener('wheel', handleWheel, { passive: false });
      return () => wrapper.removeEventListener('wheel', handleWheel);
    }
  }, []);

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

    // Custom Filters
    if (priceRange.min) {
      filtered = filtered.filter(t => t.price >= Number(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(t => t.price <= Number(priceRange.max));
    }
    if (minRating) {
      filtered = filtered.filter(t => t.rating >= minRating);
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
  }, [activeCategory, searchResult, textSearch, sortOption, priceRange, minRating]);

  const activeFiltersCount = (priceRange.min ? 1 : 0) + (priceRange.max ? 1 : 0) + (minRating ? 1 : 0);

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
           
           {/* Categories - Optimized with Expandable View */}
           <div 
             ref={scrollWrapperRef}
             className="w-full md:w-auto flex items-center gap-2"
           >
              <div 
                ref={scrollContainerRef}
                className="flex items-center gap-2 overflow-x-auto max-w-[calc(100vw-40px)] md:max-w-xl pb-4 mask-image-linear-gradient-to-r [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-300"
              >
                {['全部', ...CATEGORIES].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-5 py-1.5 rounded-full text-sm transition-all duration-300 border ${
                      activeCategory === cat 
                        ? 'bg-primary text-white border-primary shadow-md' 
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-black'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                
                <button 
                   onClick={() => setIsFilterOpen(!isFilterOpen)}
                   className={`whitespace-nowrap flex items-center gap-1 px-5 py-1.5 rounded-full text-sm transition-all duration-300 border ${
                     isFilterOpen 
                       ? 'bg-gray-100 text-black border-gray-200' 
                       : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-black'
                   }`}
                >
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                   <span>更多</span>
                </button>
              </div>
           </div>

           <div className="w-full md:w-auto flex items-center gap-3">
              <div className="relative flex-1 md:w-80 group z-50">
                 <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                   <svg className="w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35"/></svg>
                 </div>
                 <input 
                   type="text" 
                   placeholder="搜索模版..." 
                   value={textSearch}
                   onChange={(e) => setTextSearch(e.target.value)}
                   className="w-full pl-9 pr-12 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-all placeholder-gray-400"
                 />
                 {/* Filter Toggle Inside Search Bar */}
                 <button 
                   onClick={() => setIsFilterOpen(!isFilterOpen)}
                   className={`absolute inset-y-0 right-0 px-3 flex items-center hover:text-black transition-colors ${activeFiltersCount > 0 || isFilterOpen ? 'text-orange-500' : 'text-gray-400'}`}
                 >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                    {activeFiltersCount > 0 && (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border border-white" />
                    )}
                 </button>
              </div>

              <div className="relative">
                <button 
                  onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:border-black transition-colors min-w-[140px] justify-between"
                >
                  <span>{sortOption === 'price-asc' ? '价格升序' : sortOption === 'price-desc' ? '价格降序' : sortOption === 'rating' ? '评分最高' : '推荐'}</span>
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
                      {[
                        { key: 'featured', label: '推荐' },
                        { key: 'price-asc', label: '价格升序' },
                        { key: 'price-desc', label: '价格降序' },
                        { key: 'rating', label: '评分最高' }
                      ].map(({ key, label }) => (
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

         {/* Filter Panel (Expandable) */}
         <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-gray-100 mt-4"
              >
                <div className="pt-6 pb-2 grid grid-cols-1 md:grid-cols-12 gap-8">
                   {/* Expanded Categories */}
                   <div className="md:col-span-7 space-y-3">
                     <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">所有分类</h3>
                     <div className="flex flex-wrap gap-2">
                       {['全部', ...CATEGORIES].map(cat => (
                         <button
                           key={cat}
                           onClick={() => setActiveCategory(cat)}
                           className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                             activeCategory === cat 
                               ? 'bg-black text-white border-black' 
                               : 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100'
                           }`}
                         >
                           {cat}
                         </button>
                       ))}
                     </div>
                   </div>

                   {/* Advanced Filters */}
                   <div className="md:col-span-5 space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">价格区间 (¥)</h3>
                          {(priceRange.min || priceRange.max) && (
                            <button onClick={() => setPriceRange({min: '', max: ''})} className="text-xs text-orange-500 hover:text-orange-600">清除</button>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                           <input 
                             type="number" 
                             placeholder="最低价" 
                             value={priceRange.min}
                             onChange={e => setPriceRange(p => ({ ...p, min: e.target.value }))}
                             className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
                           />
                           <span className="text-gray-400">-</span>
                           <input 
                             type="number" 
                             placeholder="最高价" 
                             value={priceRange.max}
                             onChange={e => setPriceRange(p => ({ ...p, max: e.target.value }))}
                             className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
                           />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                           <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">最低评分</h3>
                           {minRating && (
                             <button onClick={() => setMinRating(null)} className="text-xs text-orange-500 hover:text-orange-600">清除</button>
                           )}
                        </div>
                        <div className="flex gap-2">
                          {[4, 3, 2].map(rating => (
                             <button
                               key={rating}
                               onClick={() => setMinRating(minRating === rating ? null : rating)}
                               className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border transition-all ${
                                 minRating === rating 
                                   ? 'bg-yellow-50 border-yellow-200 text-yellow-700' 
                                   : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                               }`}
                             >
                               <span>{rating}+</span>
                               <svg className="w-3 h-3 mb-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                             </button>
                          ))}
                        </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
         </AnimatePresence>
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
