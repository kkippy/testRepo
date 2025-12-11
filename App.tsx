import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Template, SortOption, UserProfile as UserProfileType, Transaction, DownloadRecord } from './types';
import { SearchOverlay } from './components/SearchOverlay';
import { Confetti } from './components/Confetti';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { getSmartRecommendations } from './services/geminiService';
import { MOCK_TEMPLATES } from './utils/mockData';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // View State (Filters)
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{ids: string[], reason: string} | null>(null);
  
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
  
  const [favorites, setFavorites] = useState<string[]>(['tpl-0', 'tpl-2', 'tpl-5']);
  const [downloadRecords, setDownloadRecords] = useState<DownloadRecord[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 't1', type: 'recharge', amount: 500, date: '2024-05-20', description: '钱包充值' },
    { id: 't2', type: 'expense', amount: 49, date: '2024-05-21', description: '购买模版: Lumina 筑梦集 1' }
  ]);

  // Filters
  const [textSearch, setTextSearch] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('featured');

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
      navigate('/');
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

  // Auth Logic
  const handleLogin = () => {
    setIsAuthenticated(true);
    // Trigger Celebration
    setShowConfetti(true);
    setShowLoginSuccess(true);
    
    setTimeout(() => {
       navigate('/');
       setTimeout(() => {
         setShowConfetti(false);
         setShowLoginSuccess(false);
       }, 3000);
    }, 1000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowConfetti(false);
  };

  const handleToggleFavorite = (template: Template) => {
    setFavorites(prev => {
      if (prev.includes(template.id)) {
        return prev.filter(id => id !== template.id);
      } else {
        return [...prev, template.id];
      }
    });
  };

  const favoriteTemplates = MOCK_TEMPLATES.filter(t => favorites.includes(t.id));

  const recordDownload = (template: Template) => {
    const entry: DownloadRecord = {
      id: Date.now().toString(),
      templateId: template.id,
      templateTitle: template.title,
      date: new Date().toLocaleString('zh-CN', { hour12: false })
    };
    setDownloadRecords(prev => [entry, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#fcfaf8] text-primary font-sans selection:bg-orange-200 selection:text-orange-900 relative">
      
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

      {/* Global Components */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSmartSearch}
        isSearching={isSearching}
      />

      {/* Header is visible on all pages except maybe login? Or conditionally rendered. 
          Current design had header always visible except for Auth view.
          Let's keep it that way. Login page is full screen overlay in previous design.
      */}
      {location.pathname !== '/login' && (
        <Header 
          onSearchClick={() => setIsSearchOpen(true)}
          isAuthenticated={isAuthenticated}
          userProfile={userProfile}
          onLoginClick={() => navigate('/login')}
          onProfileClick={() => navigate('/profile')}
          onLogoClick={() => navigate('/')}
        />
      )}

      <AnimatePresence mode="wait">
        <Routes location={location}>
          <Route path="/" element={
            <HomePage 
              searchResult={searchResult}
              clearSearch={clearSearch}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              textSearch={textSearch}
              setTextSearch={setTextSearch}
              sortOption={sortOption}
              setSortOption={setSortOption}
              onTemplateClick={(template) => navigate(`/template/${template.id}`)}
            />
          } />
          
          <Route path="/template/:id" element={
            <ProductPage 
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onDownloaded={recordDownload}
            />
          } />

          <Route path="/profile" element={
            isAuthenticated ? (
              <ProfilePage 
                user={userProfile}
                transactions={transactions}
                downloadRecords={downloadRecords}
                favoriteTemplates={favoriteTemplates}
                onLogout={handleLogout}
                onUpdateProfile={(updated) => setUserProfile(prev => ({ ...prev, ...updated }))}
              />
            ) : (
               // Redirect to login if not authenticated, or show login page
               <LoginPage onLogin={handleLogin} />
            )
          } />

          <Route path="/login" element={
            <LoginPage onLogin={handleLogin} />
          } />
        </Routes>
      </AnimatePresence>

      {/* Footer */}
      {location.pathname !== '/login' && <Footer />}
    </div>
  );
};

export default App;
