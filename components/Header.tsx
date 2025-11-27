import React from 'react';
import { UserProfile } from '../types';

interface HeaderProps {
  onSearchClick: () => void;
  isAuthenticated: boolean;
  userProfile: UserProfile;
  onLoginClick: () => void;
  onProfileClick: () => void;
  onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearchClick,
  isAuthenticated,
  userProfile,
  onLoginClick,
  onProfileClick,
  onLogoClick
}) => {
  const isImageAvatar = typeof userProfile.avatar === 'string' && (userProfile.avatar.startsWith('http') || userProfile.avatar.startsWith('data:image'));
  return (
    <nav className="sticky top-0 z-50 bg-[#fcfaf8]/80 backdrop-blur-xl border-b border-gray-200/50 transition-all">
      <div className="max-w-[1800px] mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={onLogoClick}>
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
            <span className="text-orange-900 font-serif font-bold italic text-xl">Z</span>
          </div>
          <span className="text-xl font-serif font-semibold tracking-tight">Zelpis TP</span>
        </div>
        
        <div className="flex items-center gap-4">
            <button 
            onClick={onSearchClick}
          className="group flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-900 rounded-full transition-all duration-300"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <span className="text-sm font-medium hidden sm:inline">询问 Zelpis AI</span>
          </button>

          {isAuthenticated ? (
            <button 
              onClick={onProfileClick}
              className="w-9 h-9 rounded-full overflow-hidden cursor-pointer ring-2 ring-offset-2 ring-transparent hover:ring-orange-200 focus:outline-none"
            >
              {isImageAvatar ? (
                <img src={userProfile.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-orange-900 text-orange-50 flex items-center justify-center text-sm font-bold">
                  {userProfile.avatar}
                </div>
              )}
            </button>
          ) : (
            <button 
              onClick={onLoginClick}
              className="px-5 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
            >
              登录
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
