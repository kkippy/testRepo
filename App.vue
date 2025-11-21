<template>
  <div class="min-h-screen bg-[#fafafa] text-primary font-sans selection:bg-black selection:text-white">
    
    <!-- --- HEADER --- -->
    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-all">
      <div class="max-w-[1800px] mx-auto px-6 py-4 flex justify-between items-center">
        <div class="flex items-center gap-2 cursor-pointer group" @click="handleBackToStore">
          <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
            <span class="text-blue-900 font-serif font-bold italic text-xl">Z</span>
          </div>
          <span class="text-xl font-serif font-semibold tracking-tight">Zelpis TP</span>
        </div>
        
        <div class="flex items-center gap-3">
           <!-- AI Search Trigger -->
           <button 
            @click="isSearchOpen = true"
            class="group flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-black hover:text-white rounded-full transition-all duration-300"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <span class="text-sm font-medium hidden sm:inline">Ask Zelpis AI</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Views -->
    <Transition name="fade" mode="out-in">
      <div v-if="currentView === 'list'" key="list-view">
         <!-- --- HERO SPLIT LAYOUT --- -->
        <header class="px-6 pt-12 pb-4 md:pt-20 md:pb-8 max-w-[1800px] mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <!-- Left: Typography -->
            <div class="lg:col-span-7 xl:col-span-8 space-y-6 z-10">
               <div v-if="searchResult" class="space-y-4">
                  <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-xs font-bold tracking-wider text-purple-600 uppercase">
                    AI Curated
                  </div>
                  <h1 class="text-4xl md:text-6xl font-serif leading-tight text-gray-900">
                    "{{ searchResult.reason }}"
                  </h1>
                  <button 
                    @click="clearSearch" 
                    class="group flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-black transition-colors mt-4"
                  >
                    <span class="border-b border-gray-300 group-hover:border-black pb-0.5">Back to all templates</span>
                  </button>
               </div>
               <div v-else>
                 <h1 class="text-6xl md:text-8xl font-serif font-medium leading-[0.9] tracking-tighter text-gray-900">
                    Template <br/>
                    <span class="text-gray-300 italic pl-4">Store.</span>
                  </h1>
                  <p class="text-lg text-gray-500 mt-6 max-w-md leading-relaxed font-light pl-2 border-l-2 border-gray-100">
                    Curated digital assets for the modern creator. High aesthetic, fluid interaction.
                  </p>
               </div>
            </div>

            <!-- Right: Illustration -->
            <div class="lg:col-span-5 xl:col-span-4 hidden lg:block">
               <HeroIllustration />
            </div>
          </div>
        </header>

        <!-- --- TOOLBAR (Categories + Search + Sort) --- -->
        <div class="sticky top-[73px] z-40 bg-[#fafafa]/95 backdrop-blur-md border-b border-gray-200/50 py-3 px-6 mb-8 transition-all shadow-sm">
           <div class="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
             
             <!-- Categories (Left) -->
             <div class="w-full md:w-auto overflow-x-auto no-scrollbar flex items-center space-x-2 pb-2 md:pb-0">
                <button
                  v-for="cat in ['All', ...CATEGORIES]"
                  :key="cat"
                  @click="activeCategory = cat"
                  class="whitespace-nowrap px-5 py-1.5 rounded-full text-sm transition-all duration-300 border"
                  :class="activeCategory === cat 
                      ? 'bg-black text-white border-black shadow-md' 
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-black'"
                >
                  {{ cat }}
                </button>
             </div>

             <!-- Tools (Right) -->
             <div class="w-full md:w-auto flex items-center gap-3">
                <!-- Text Search -->
                <div class="relative flex-1 md:w-64 group">
                   <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                     <svg class="w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35"/></svg>
                   </div>
                   <input 
                     type="text" 
                     placeholder="Filter templates..." 
                     v-model="textSearch"
                     class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-all placeholder-gray-400"
                   />
                </div>

                <!-- Sort Dropdown -->
                <div class="relative">
                  <button 
                    @click="isSortMenuOpen = !isSortMenuOpen"
                    class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:border-gray-400 transition-all whitespace-nowrap"
                  >
                    <span class="hidden sm:inline text-gray-500">Sort:</span>
                    <span class="capitalize">{{ sortOption.replace('-', ' ') }}</span>
                    <svg class="w-3 h-3 transition-transform" :class="isSortMenuOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                  
                  <Transition name="fade">
                     <div 
                       v-if="isSortMenuOpen" 
                       class="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 overflow-hidden"
                     >
                       <button
                         v-for="option in sortOptions"
                         :key="option"
                         @click="sortOption = option; isSortMenuOpen = false;"
                         class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between"
                         :class="sortOption === option ? 'font-medium text-black' : 'text-gray-500'"
                       >
                         <span class="capitalize">{{ option.replace('-', ' ') }}</span>
                         <span v-if="sortOption === option" class="w-1 h-1 bg-black rounded-full"></span>
                       </button>
                     </div>
                  </Transition>
                  
                  <div v-if="isSortMenuOpen" class="fixed inset-0 z-40 bg-transparent" @click="isSortMenuOpen = false"></div>
                </div>
             </div>
           </div>
        </div>

        <!-- --- MAIN GRID --- -->
        <main class="px-6 pb-24 max-w-[1800px] mx-auto min-h-[600px]">
          <div v-if="displayedTemplates.length === 0" class="flex flex-col items-center justify-center py-24 text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
               <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900">No templates found</h3>
            <button @click="clearSearch(); activeCategory = 'All';" class="mt-6 text-black border-b border-black hover:opacity-60 transition-opacity">Clear filters</button>
          </div>
          
          <TransitionGroup 
            name="list"
            tag="div"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-10"
          >
            <TemplateCard 
              v-for="template in displayedTemplates"
              :key="template.id" 
              :template="template" 
              @click="handleTemplateClick"
            />
          </TransitionGroup>
        </main>
      </div>

      <!-- --- DETAIL VIEW --- -->
      <ProductModal 
        v-else
        key="detail-view"
        :template="selectedTemplate" 
        :allTemplates="MOCK_TEMPLATES"
        @close="handleBackToStore"
        @relatedClick="handleTemplateClick" 
      />
    </Transition>

    <!-- --- OVERLAYS --- -->
    <SearchOverlay 
      :isOpen="isSearchOpen" 
      @close="isSearchOpen = false"
      @search="handleSmartSearch"
      :isSearching="isSearching"
    />
    
    <!-- --- FOOTER --- -->
    <footer class="bg-white border-t border-gray-100 py-24 px-6 mt-auto">
      <div class="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
         <div class="space-y-4">
           <h2 class="text-3xl font-serif font-bold tracking-tight">Zelpis TP</h2>
           <p class="text-gray-400 text-sm max-w-xs">
             Empowering creators with tools that blur the line between imagination and reality.
           </p>
         </div>
         <div class="flex flex-col sm:flex-row gap-8 sm:gap-16 text-sm">
           <div class="flex flex-col gap-4">
              <span class="font-bold text-black">Platform</span>
              <a href="#" class="text-gray-500 hover:text-black transition-colors">Browse</a>
              <a href="#" class="text-gray-500 hover:text-black transition-colors">Sell</a>
           </div>
           <div class="flex flex-col gap-4">
              <span class="font-bold text-black">Company</span>
              <a href="#" class="text-gray-500 hover:text-black transition-colors">Contact</a>
           </div>
         </div>
      </div>
      <div class="max-w-[1800px] mx-auto mt-16 pt-8 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
         <p>© 2024 Zelpis TP Inc.</p>
         <p>Designed with Gemini.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Template, TemplateCategory, SortOption } from './types';
import TemplateCard from './components/TemplateCard.vue';
import SearchOverlay from './components/SearchOverlay.vue';
import ProductModal from './components/ProductModal.vue';
import HeroIllustration from './components/HeroIllustration.vue';
import { getSmartRecommendations } from './services/geminiService';

// --- MOCK DATA GENERATION ---
const CATEGORIES = Object.values(TemplateCategory);

const generateMockTemplates = (): Template[] => {
  return Array.from({ length: 32 }).map((_, i) => {
    const category = CATEGORIES[i % CATEGORIES.length];
    const id = `tpl-${i}`;
    
    // Generate Mock DSL Code
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

    return {
      id: id,
      title: [
        "Lumina Folio", "Apex Commerce", "Zenith Blog", "Nexus Dashboard", "Flux Landing", 
        "Orbit Agency", "Stellar Portfolio", "Vortex SaaS", "Echo News", "Pulse Admin",
        "Aether Shop", "Mono Deck", "Quantum UI", "Velvet Social", "Prism Analytics"
      ][i % 15] + ` ${Math.floor(i / 15) + 1}`,
      author: ["Studio K", "DesignFlow", "MinimalistCo", "PixelPerfect", "Avanti"][i % 5],
      price: 29 + (i % 8) * 10 + (i % 2 === 0 ? 9 : 0),
      category: category,
      description: `A meticulously crafted ${category.toLowerCase()} template designed for modern professionals. Features responsive layout, dark mode support, and ${['clean typography', 'smooth animations', 'advanced filtering', 'SEO optimization'][i%4]}. Perfect for creators looking to elevate their digital presence.`,
      imageUrl: `https://picsum.photos/1200/750?random=${i + 100}`,
      tags: ["React", "Tailwind", "Minimal", "Dark Mode", "Animation", "CMS", "NextJS", "Framer"][i % 8] 
            ? ["React", "Tailwind", "Minimal"] 
            : ["Vue", "GSAP", "Creative"],
      rating: 4 + (i % 10) / 10,
      dslCode: dslCode,
      previewUrl: '#',
      reviews: [
        {
          id: 'r1',
          user: 'Alex M.',
          rating: 5,
          date: '2 days ago',
          comment: 'Absolutely stunning design. The code quality is top notch.'
        },
        {
          id: 'r2',
          user: 'Sarah J.',
          rating: 4.5,
          date: '1 week ago',
          comment: 'Easy to customize, though I wish the documentation was a bit more detailed.'
        }
      ]
    };
  });
};

const MOCK_TEMPLATES = generateMockTemplates();
const sortOptions: SortOption[] = ['featured', 'price-asc', 'price-desc', 'rating'];

// State
const activeCategory = ref<string>('All');
const isSearchOpen = ref(false);
const isSearching = ref(false);
const searchResult = ref<{ids: string[], reason: string} | null>(null);

const currentView = ref<'list' | 'detail'>('list');
const selectedTemplate = ref<Template | null>(null);

const textSearch = ref('');
const sortOption = ref<SortOption>('featured');
const isSortMenuOpen = ref(false);

// Filter Pipeline
const displayedTemplates = computed(() => {
  let filtered = [...MOCK_TEMPLATES];

  // 1. AI Recommendations
  if (searchResult.value) {
    filtered = filtered.filter(t => searchResult.value!.ids.includes(t.id));
  }

  // 2. Category Filter
  if (activeCategory.value !== 'All') {
    filtered = filtered.filter(t => t.category === activeCategory.value);
  }

  // 3. Text Search
  if (textSearch.value.trim()) {
    const q = textSearch.value.toLowerCase();
    filtered = filtered.filter(t => 
      t.title.toLowerCase().includes(q) || 
      t.author.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }

  // 4. Sorting
  switch (sortOption.value) {
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
});

// Actions
const handleSmartSearch = async (query: string) => {
  isSearching.value = true;
  try {
    const result = await getSmartRecommendations(query, MOCK_TEMPLATES);
    searchResult.value = {
      ids: result.recommendedIds,
      reason: result.reasoning
    };
    activeCategory.value = 'All';
    textSearch.value = '';
    sortOption.value = 'featured';
    isSearchOpen.value = false;
    currentView.value = 'list';
  } catch (e) {
    console.error(e);
  } finally {
    isSearching.value = false;
  }
};

const clearSearch = () => {
  searchResult.value = null;
  textSearch.value = '';
};

const handleTemplateClick = (template: Template) => {
  selectedTemplate.value = template;
  currentView.value = 'detail';
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleBackToStore = () => {
  currentView.value = 'list';
  // Allow transition to start before clearing template
  setTimeout(() => {
    selectedTemplate.value = null;
  }, 500);
};
</script>