import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, Pagination, ConfigProvider } from 'antd';
import { UserProfile as UserProfileType, Transaction, DownloadRecord, Template } from '../types';
import { TemplateCard } from './TemplateCard';
import { MOCK_TEMPLATES } from '../utils/mockData';

interface UserProfileProps {
  user: UserProfileType;
  transactions: Transaction[];
  downloadRecords: DownloadRecord[];
  favoriteTemplates: Template[];
  onLogout: () => void;
  onUpdateProfile: (updated: Partial<UserProfileType>) => void;
  onTemplateClick: (template: Template) => void;
  onHome: () => void;
  initialTab?: Tab;
}

export type Tab = 'profile' | 'favorites' | 'downloads' | 'wallet' | 'security';

interface FoilCardProps {
  tier: any;
  children: React.ReactNode;
}

// --- 3D Tilt Card Implementation (Revolut Metal Style) ---
const FoilCard: React.FC<FoilCardProps> = ({ tier, children }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to card center
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Normalize to -1 to 1 range
    const rotateX = ((y - centerY) / centerY) * -15; // Invert Y for natural tilt
    const rotateY = ((x - centerX) / centerX) * 15;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const isHero = tier.type === 'hero';

  // Dynamic Styles based on Tier
  const bgClass = isHero 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white' 
    : tier.type === 'pro'
      ? 'bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-gray-900'
      : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900';

  const borderClass = isHero 
    ? 'border-gray-700/50' 
    : tier.type === 'pro' 
      ? 'border-indigo-100' 
      : 'border-white';

  return (
    <div style={{ perspective: '1200px' }} className="w-full h-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
          mass: 0.8
        }}
        style={{ transformStyle: 'preserve-3d' }}
        className={`relative w-full h-full rounded-3xl border ${borderClass} shadow-xl overflow-hidden ${bgClass} transition-shadow duration-300 ${isHovered ? 'shadow-2xl' : 'shadow-xl'}`}
      >
        {/* Shine Effect Layer */}
        <div 
           className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"
           style={{
             background: `linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,${isHero ? '0.15' : '0.4'}) 50%, rgba(255,255,255,0) 100%)`,
             transform: `translateX(${rotation.y}%) translateY(${rotation.x}%) translateZ(1px)`,
             mixBlendMode: 'overlay'
           }}
        />

        {/* Content Container - Pops out in 3D */}
        <div 
          style={{ transform: 'translateZ(30px)' }}
          className="relative z-10 p-8 h-full flex flex-col"
        >
          {children}
        </div>
        
        {/* Background Depth Elements */}
        <div 
            style={{ transform: 'translateZ(10px)' }}
            className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[60px] opacity-40 pointer-events-none ${isHero ? 'bg-orange-500' : tier.type === 'pro' ? 'bg-indigo-300' : 'bg-gray-300'}`}
        />
        <div 
            style={{ transform: 'translateZ(5px)' }}
            className={`absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-[60px] opacity-40 pointer-events-none ${isHero ? 'bg-rose-600' : tier.type === 'pro' ? 'bg-purple-300' : 'bg-gray-200'}`}
        />
      </motion.div>
    </div>
  );
};

export const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  transactions, 
  downloadRecords, 
  favoriteTemplates,
  onLogout, 
  onUpdateProfile,
  onTemplateClick,
  onHome,
  initialTab = 'profile'
}) => {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio);
  const [editExpertise, setEditExpertise] = useState<string[]>(user.expertise || []);
  const [editSkills, setEditSkills] = useState<{ name: string; level: number }[]>(user.skills || []);
  const [editSocialLinks, setEditSocialLinks] = useState(user.socialLinks || {});
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);

  // Security State
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  
  // Account Deletion State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  // Recharge Toast State
  const [showRechargeSuccess, setShowRechargeSuccess] = useState(false);
  const [lastRecharge, setLastRecharge] = useState<{ amount: number; credits: number } | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Forgot Password State
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [showResetSuccess, setShowResetSuccess] = useState(false);

  // Download History State
  const [downloadSearch, setDownloadSearch] = useState('');
  const [downloadFilter, setDownloadFilter] = useState('all');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  
  // Download Pagination
  const [downloadPage, setDownloadPage] = useState(1);
  const downloadPageSize = 10;

  React.useEffect(() => {
    setDownloadPage(1);
  }, [downloadSearch, downloadFilter]);

  const filteredDownloads = React.useMemo(() => {
    return downloadRecords.map(record => {
      const template = MOCK_TEMPLATES.find(t => t.id === record.templateId);
      return {
        ...record,
        category: template?.category || '其他',
        imageUrl: template?.imageUrl,
        template // Keep reference for click handlers if needed
      };
    }).filter(item => {
      const matchesSearch = item.templateTitle.toLowerCase().includes(downloadSearch.toLowerCase());
      const matchesType = downloadFilter === 'all' || item.category === downloadFilter;
      return matchesSearch && matchesType;
    });
  }, [downloadRecords, downloadSearch, downloadFilter]);

  const handleForgotPassword = () => {
    if (!forgotEmail) {
      alert('请输入邮箱');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
        alert('请输入有效的邮箱地址');
        return;
    }

    setIsSendingReset(true);
    // Simulate API call
    setTimeout(() => {
      setIsSendingReset(false);
      setShowForgotPassword(false);
      setShowResetSuccess(true);
      setTimeout(() => {
        setShowResetSuccess(false);
        setForgotEmail('');
      }, 3000);
    }, 1500);
  };

  React.useEffect(() => {
    const maxPage = Math.ceil(favoriteTemplates.length / itemsPerPage) || 1;
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [favoriteTemplates.length]);

  const handleSaveProfile = () => {
    onUpdateProfile({ 
      name: editName, 
      bio: editBio,
      expertise: editExpertise,
      skills: editSkills,
      socialLinks: editSocialLinks
    });
    setIsEditing(false);
  };

  const isImageAvatar = typeof user.avatar === 'string' && (user.avatar.startsWith('http') || user.avatar.startsWith('data:image'));
  const handleAvatarClick = () => {
    setShowAvatarModal(true);
  };
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const url = await readAndCropToDataURL(file, 256);
    setPreviewUrl(url);
  };
  const confirmSaveAvatar = async () => {
    if (!previewUrl) return;
    setIsSavingAvatar(true);
    setTimeout(() => {
      onUpdateProfile({ avatar: previewUrl });
      setIsSavingAvatar(false);
      setShowAvatarModal(false);
      setPreviewUrl(null);
    }, 600);
  };
  const resetAvatarToInitial = () => {
    const initial = user.name?.charAt(0) || 'U';
    onUpdateProfile({ avatar: initial });
    setShowAvatarModal(false);
    setPreviewUrl(null);
  };

  const handleRecharge = (tier: any) => {
    const totalCredits = tier.credits + tier.bonus;
    
    // Update local UI state for toast
    setLastRecharge({ amount: tier.price, credits: totalCredits });
    setShowRechargeSuccess(true);
    
    // Update actual user balance via parent callback
    onUpdateProfile({ credits: user.credits + totalCredits });

    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowRechargeSuccess(false);
    }, 3000);
  };

  const handleDeleteAccountClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = () => {
    setShowDeleteConfirm(false);
    setShowDeleteSuccess(true);
    
    // Simulate API call and redirect
    setTimeout(() => {
      onLogout(); // This will effectively redirect to home in the App logic
    }, 1500);
  };

  const TabButton = ({ id, label, icon }: { id: Tab; label: string; icon: React.ReactNode }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
        activeTab === id 
          ? 'bg-black text-white shadow-lg' 
          : 'text-gray-500 hover:bg-gray-100 hover:text-black'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  // Recharge Tiers Configuration
  const rechargeTiers = [
    {
      id: 1,
      price: 100,
      credits: 1000,
      bonus: 0,
      type: 'basic',
      title: '基础包'
    },
    {
      id: 2,
      price: 200,
      credits: 2000,
      bonus: 100,
      type: 'pro',
      title: '进阶包'
    },
    {
      id: 3,
      price: 500,
      credits: 5000,
      bonus: 500,
      type: 'hero',
      title: '旗舰包'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfaf8] pt-24 pb-12 px-6 relative">
      
      {/* --- Global Overlays --- */}
      <AnimatePresence>
        {/* Recharge Success Toast */}
        {showRechargeSuccess && lastRecharge && (
          <motion.div
            key="recharge-toast"
            initial={{ opacity: 0, scale: 0.9, y: "-50%", x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, y: "-50%", x: "-50%" }}
            className="fixed top-1/2 left-1/2 z-[100] bg-white border border-green-100 shadow-2xl p-8 rounded-3xl flex flex-col items-center gap-4 text-center min-w-[300px]"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">充值成功</h4>
              <p className="text-gray-500 mt-2">
                已支付 <span className="font-bold text-black">¥{lastRecharge.amount}</span>
              </p>
              <div className="mt-4 bg-green-50 text-green-700 px-4 py-2 rounded-lg font-bold">
                获得 {lastRecharge.credits} 积分
              </div>
            </div>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <motion.div 
            key="delete-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-100"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">确认注销账号？</h3>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                此操作将永久删除您的个人资料、收藏夹及下载历史。该操作<span className="font-bold text-red-500">无法撤销</span>。
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={confirmDeleteAccount}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
                >
                  确认注销
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Delete Success Toast */}
        {showDeleteSuccess && (
          <motion.div
             key="delete-success"
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0 }}
             className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[100] bg-black/90 backdrop-blur-md text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3"
          >
             <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
             <span className="font-medium">账号已注销，正在跳转首页...</span>
          </motion.div>
        )}
        {showForgotPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-100"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">找回密码</h3>
                <p className="text-sm text-gray-500 mt-1">请输入您的注册邮箱，我们将向您发送重置链接。</p>
              </div>
              
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">邮箱地址</label>
                    <input 
                      type="email" 
                      placeholder="name@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:bg-white focus:border-black focus:outline-none transition-colors"
                    />
                 </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => setShowForgotPassword(false)} 
                  className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={handleForgotPassword} 
                  disabled={!forgotEmail || isSendingReset} 
                  className="flex-1 px-4 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingReset ? '发送中...' : '发送重置邮件'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {showResetSuccess && (
          <motion.div
             key="reset-success"
             initial={{ opacity: 0, scale: 0.9, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.9, y: 20 }}
             className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] bg-white px-8 py-6 rounded-2xl shadow-2xl border border-gray-100 flex flex-col items-center gap-4 min-w-[300px]"
          >
             <motion.div 
               initial={{ scale: 0, rotate: -180 }}
               animate={{ scale: 1, rotate: 0 }}
               transition={{ type: "spring", stiffness: 200, damping: 15 }}
               className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600"
             >
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
             </motion.div>
             <div className="text-center">
               <h3 className="text-xl font-bold text-gray-900 mb-1">邮件已发送</h3>
               <p className="text-gray-500 text-sm">请检查您的邮箱 {forgotEmail}</p>
             </div>
             <motion.div
               initial={{ width: 0 }}
               animate={{ width: "100%" }}
               transition={{ duration: 3 }}
               className="h-1 bg-green-500 rounded-full w-full mt-2"
             />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1400px] mx-auto">
        
        {/* Breadcrumb / Header */}
        <div className="flex items-center gap-2 mb-8 text-sm text-gray-400">
           <button onClick={onHome} className="hover:text-black transition-colors">首页</button>
           <span>/</span>
           <span className="text-black">个人中心</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-3">
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <div className="flex flex-col items-center text-center mb-8">
                  <button onClick={handleAvatarClick} className="group w-20 h-20 rounded-full mb-4 overflow-hidden relative shadow-inner focus:outline-none">
                    {isImageAvatar ? (
                      <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-2xl font-serif font-bold text-orange-900">
                        {user.avatar}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  </button>
                  <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-sm text-gray-400 mt-1">{user.email}</p>
                </div>

                <nav className="space-y-2">
                   <TabButton 
                     id="profile" 
                     label="个人资料" 
                     icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>} 
                   />
                   <TabButton 
                     id="favorites" 
                     label="我的收藏" 
                     icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>} 
                   />
                   <TabButton 
                     id="downloads" 
                     label="下载历史" 
                     icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>} 
                   />
                   {/* <TabButton 
                     id="wallet" 
                     label="积分钱包" 
                     icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>} 
                   /> */}
                   <TabButton 
                     id="security" 
                     label="账号安全" 
                     icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>} 
                   />
                </nav>

                <div className="mt-8 pt-8 border-t border-gray-100">
                   <button 
                     onClick={onLogout}
                     className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                   >
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                     <span>退出登录</span>
                   </button>
                </div>
             </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.3 }}
               className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[600px]"
             >
               {/* --- PROFILE TAB --- */}
               {activeTab === 'profile' && (
                 <div className="space-y-8">
                    <div>
                       <h3 className="text-2xl font-serif font-bold mb-1">个人资料</h3>
                       <p className="text-gray-400 text-sm">管理您的公开信息和简介。</p>
                    </div>
                    
                    <div className="space-y-6 max-w-2xl">
                       <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">昵称</label>
                          <input 
                            type="text" 
                            disabled={!isEditing}
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:bg-white focus:border-black focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">简介</label>
                          <textarea 
                            disabled={!isEditing}
                            value={editBio}
                            onChange={(e) => setEditBio(e.target.value)}
                            rows={4}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:bg-white focus:border-black focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed resize-none"
                          />
                       </div>

                       {/* --- Professional Profile --- */}
                       <div className="pt-6 border-t border-gray-100">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">职业档案</h4>
                          
                          {/* Expertise */}
                          <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-400 mb-2">擅长领域</label>
                            {isEditing ? (
                              <div className="flex flex-wrap gap-2">
                                {editExpertise.map((tag) => (
                                  <span key={tag} className="px-3 py-1 bg-black text-white rounded-full text-sm flex items-center gap-2">
                                    {tag}
                                    <button onClick={() => setEditExpertise(prev => prev.filter(t => t !== tag))} className="hover:text-gray-300">×</button>
                                  </span>
                                ))}
                                <input 
                                  type="text" 
                                  placeholder="+ 添加 (回车)" 
                                  className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-black min-w-[120px]"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      const val = e.currentTarget.value.trim();
                                      if (val && !editExpertise.includes(val)) {
                                        setEditExpertise([...editExpertise, val]);
                                        e.currentTarget.value = '';
                                      }
                                    }
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {user.expertise?.map((tag) => (
                                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                                    {tag}
                                  </span>
                                ))}
                                {(!user.expertise || user.expertise.length === 0) && <span className="text-gray-400 text-sm italic">未填写</span>}
                              </div>
                            )}
                          </div>

                          {/* Skills */}
                           <div>
                             <label className="block text-xs font-bold text-gray-400 mb-2">软件技能</label>
                             <div className="flex flex-wrap gap-3">
                               {(isEditing ? editSkills : user.skills || []).map((skill, index) => (
                                 <div 
                                   key={index} 
                                   className="w-[50px] h-[50px] rounded-[6px] bg-white border border-gray-100 shadow-sm flex items-center justify-center relative group hover:shadow-md transition-all cursor-default"
                                   title={`${skill.name} (${skill.level}%)`}
                                 >
                                    {/* Icon Generation Logic */}
                                    {(() => {
                                      const lower = skill.name.toLowerCase();
                                      if (lower.includes('figma')) {
                                        return (
                                          <svg width="24" height="24" viewBox="0 0 38 57" fill="none">
                                            <path d="M19 28.5C19 25.9804 20.0009 23.5641 21.7825 21.7825C23.5641 20.0009 25.9804 19 28.5 19C31.0196 19 33.4359 20.0009 35.2175 21.7825C36.9991 23.5641 38 25.9804 38 28.5C38 31.0196 36.9991 33.4359 35.2175 35.2175C33.4359 36.9991 31.0196 38 28.5 38L19 38V28.5Z" fill="#1ABCFE"/>
                                            <path d="M9.5 57C12.0196 57 14.4359 56.0009 16.2175 54.2175C17.9991 52.4359 19 50.0196 19 47.5V38H9.5C6.98044 38 4.56408 36.9991 2.78249 35.2175C1.00089 33.4359 0 31.0196 0 28.5C0 25.9804 1.00089 23.5641 2.78249 21.7825C4.56408 20.0009 6.98044 19 9.5 19H19V9.5C19 6.98044 17.9991 4.56408 16.2175 2.78249C14.4359 1.00089 12.0196 0 9.5 0C6.98044 0 4.56408 1.00089 2.78249 2.78249C1.00089 4.56408 0 6.98044 0 9.5C0 12.0196 1.00089 14.4359 2.78249 16.2175C4.56408 17.9991 6.98044 19 9.5 19Z" fill="#0ACF83"/>
                                            <path d="M19 0V19H28.5C31.0196 19 33.4359 17.9991 35.2175 16.2175C36.9991 14.4359 38 12.0196 38 9.5C38 6.98044 36.9991 4.56408 35.2175 2.78249C33.4359 1.00089 31.0196 0 28.5 0H19Z" fill="#FF7262"/>
                                            <path d="M0 28.5C0 31.0196 1.00089 33.4359 2.78249 35.2175C4.56408 36.9991 6.98044 38 9.5 38H19V28.5H9.5C6.98044 28.5 4.56408 27.4991 2.78249 25.7175C1.00089 23.9359 0 21.5196 0 19C0 21.5196 0 28.5 0 28.5Z" fill="#A259FF"/>
                                            <path d="M19 28.5V47.5C19 50.0196 17.9991 52.4359 16.2175 54.2175C14.4359 56.0009 12.0196 57 9.5 57C6.98044 57 4.56408 56.0009 2.78249 54.2175C1.00089 52.4359 0 50.0196 0 47.5C0 44.9804 1.00089 42.5641 2.78249 40.7825C4.56408 39.0009 6.98044 38 9.5 38H19V28.5Z" fill="#F24E1E"/>
                                          </svg>
                                        );
                                      }
                                      if (lower.includes('react')) {
                                        return (
                                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#61DAFB" strokeWidth="2">
                                            <circle cx="12" cy="12" r="3"></circle>
                                            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)"></ellipse>
                                            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-30 12 12)"></ellipse>
                                          </svg>
                                        );
                                      }
                                      if (lower.includes('typescript') || lower === 'ts') {
                                        return <div className="w-full h-full bg-[#3178C6] text-white flex items-center justify-center font-bold text-lg rounded-[6px]">TS</div>;
                                      }
                                      if (lower.includes('javascript') || lower === 'js') {
                                        return <div className="w-full h-full bg-[#F7DF1E] text-black flex items-center justify-center font-bold text-lg rounded-[6px]">JS</div>;
                                      }
                                      if (['ps', 'photoshop'].some(k => lower.includes(k))) return <div className="w-full h-full bg-[#001E36] text-[#31A8FF] flex items-center justify-center font-bold text-lg border-2 border-[#31A8FF] rounded-[6px]">Ps</div>;
                                      if (['ai', 'illustrator'].some(k => lower.includes(k))) return <div className="w-full h-full bg-[#330000] text-[#FF9A00] flex items-center justify-center font-bold text-lg border-2 border-[#FF9A00] rounded-[6px]">Ai</div>;
                                      if (['id', 'indesign'].some(k => lower.includes(k))) return <div className="w-full h-full bg-[#2D001E] text-[#FF3366] flex items-center justify-center font-bold text-lg border-2 border-[#FF3366] rounded-[6px]">Id</div>;
                                      
                                      return <div className="text-gray-400 font-bold text-sm uppercase">{skill.name.slice(0, 2)}</div>;
                                    })()}

                                   {isEditing && (
                                      <button 
                                        onClick={() => setEditSkills(prev => prev.filter((_, i) => i !== index))} 
                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                      >
                                        ×
                                      </button>
                                   )}
                                 </div>
                               ))}

                               {isEditing && (
                                 <div className="flex flex-col gap-2">
                                   <input 
                                     type="text" 
                                     placeholder="添加技能..." 
                                     className="w-[100px] h-[50px] px-2 bg-gray-50 border border-gray-200 border-dashed rounded-[6px] text-xs text-center focus:outline-none focus:border-black focus:bg-white transition-all"
                                     onKeyDown={(e) => {
                                       if (e.key === 'Enter') {
                                         const val = e.currentTarget.value.trim();
                                         if (val) {
                                           setEditSkills([...editSkills, { name: val, level: 80 }]);
                                           e.currentTarget.value = '';
                                         }
                                       }
                                     }}
                                   />
                                 </div>
                               )}
                               {!isEditing && (!user.skills || user.skills.length === 0) && <span className="text-gray-400 text-sm italic">未填写</span>}
                             </div>
                           </div>
                       </div>

                       {/* --- Social & Links --- */}
                       <div className="pt-6 border-t border-gray-100">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">社交与链接</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {/* Website */}
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                                </div>
                                {isEditing ? (
                                  <input 
                                    type="text"
                                    value={editSocialLinks.website || ''}
                                    onChange={(e) => setEditSocialLinks({...editSocialLinks, website: e.target.value})}
                                    placeholder="个人网站链接"
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:border-black focus:outline-none transition-colors"
                                  />
                                ) : (
                                  <a href={user.socialLinks?.website || '#'} target="_blank" rel="noopener noreferrer" className={`text-sm font-medium ${user.socialLinks?.website ? 'text-black hover:underline' : 'text-gray-400 pointer-events-none'}`}>
                                    {user.socialLinks?.website || '未设置'}
                                  </a>
                                )}
                             </div>

                             {/* Dribbble */}
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#ea4c89]/10 flex items-center justify-center text-[#ea4c89]">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-5.38c-3.72-3.8-10.64-4.27-16.63-1.43m4.89-12.06c2.53 4.29 2.53 10.96 0 15.24"></path></svg>
                                </div>
                                {isEditing ? (
                                  <input 
                                    type="text"
                                    value={editSocialLinks.dribbble || ''}
                                    onChange={(e) => setEditSocialLinks({...editSocialLinks, dribbble: e.target.value})}
                                    placeholder="Dribbble 用户名"
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:border-black focus:outline-none transition-colors"
                                  />
                                ) : (
                                  <a href={`https://dribbble.com/${user.socialLinks?.dribbble}`} target="_blank" rel="noopener noreferrer" className={`text-sm font-medium ${user.socialLinks?.dribbble ? 'text-black hover:underline' : 'text-gray-400 pointer-events-none'}`}>
                                    {user.socialLinks?.dribbble || '未设置'}
                                  </a>
                                )}
                             </div>

                             {/* Twitter */}
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#1da1f2]/10 flex items-center justify-center text-[#1da1f2]">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                                </div>
                                {isEditing ? (
                                  <input 
                                    type="text"
                                    value={editSocialLinks.twitter || ''}
                                    onChange={(e) => setEditSocialLinks({...editSocialLinks, twitter: e.target.value})}
                                    placeholder="Twitter 用户名"
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:border-black focus:outline-none transition-colors"
                                  />
                                ) : (
                                  <a href={`https://twitter.com/${user.socialLinks?.twitter}`} target="_blank" rel="noopener noreferrer" className={`text-sm font-medium ${user.socialLinks?.twitter ? 'text-black hover:underline' : 'text-gray-400 pointer-events-none'}`}>
                                    {user.socialLinks?.twitter || '未设置'}
                                  </a>
                                )}
                             </div>
                          </div>
                       </div>
                       
                       <div className="pt-4">
                         {isEditing ? (
                           <div className="flex gap-4">
                              <button 
                                onClick={handleSaveProfile}
                                className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                              >
                                保存修改
                              </button>
                              <button 
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-full font-medium hover:bg-gray-50 transition-colors"
                              >
                                取消
                              </button>
                           </div>
                         ) : (
                           <button 
                             onClick={() => setIsEditing(true)}
                             className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                           >
                             编辑资料
                           </button>
                         )}
                       </div>
                    </div>
                 </div>
               )}

               {/* --- FAVORITES TAB --- */}
               {activeTab === 'favorites' && (
                 <div className="space-y-8">
                    <div>
                       <h3 className="text-2xl font-serif font-bold mb-1">我的收藏</h3>
                       <p className="text-gray-400 text-sm">您保存的灵感和模版。</p>
                    </div>

                    {favoriteTemplates.length > 0 ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {favoriteTemplates
                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                            .map(tpl => (
                            <TemplateCard 
                              key={tpl.id} 
                              template={tpl} 
                              onClick={onTemplateClick} 
                            />
                          ))}
                        </div>
                        
                        {Math.ceil(favoriteTemplates.length / itemsPerPage) > 1 && (
                          <div className="flex justify-center items-center mt-12">
                             <ConfigProvider
                                theme={{
                                  token: {
                                    colorPrimary: '#000000',
                                    borderRadius: 8,
                                    colorBgContainer: '#ffffff',
                                  },
                                  components: {
                                    Pagination: {
                                      itemActiveBg: '#000000',
                                      itemActiveColor: '#ffffff',
                                    }
                                  }
                                }}
                             >
                                <Pagination
                                  current={currentPage}
                                  total={favoriteTemplates.length}
                                  pageSize={itemsPerPage}
                                  onChange={(page) => {
                                    setCurrentPage(page);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  showSizeChanger={false}
                                />
                             </ConfigProvider>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                         <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                         </div>
                         <h4 className="text-lg font-medium text-gray-900">暂无收藏</h4>
                         <p className="text-gray-400 text-sm mt-2">浏览商城，发现您心仪的设计。</p>
                         <button onClick={onHome} className="mt-6 text-black underline underline-offset-4 text-sm font-medium hover:opacity-70">去逛逛</button>
                      </div>
                    )}
                 </div>
               )}

               {/* --- DOWNLOADS TAB --- */}
               {activeTab === 'downloads' && (
                 <div className="space-y-8">
                    {/* Header & Controls */}
                    <div className="flex flex-col gap-6">
                       <div>
                          <h3 className="text-2xl font-serif font-bold mb-1">下载历史</h3>
                          <p className="text-gray-400 text-sm">查看您已购买和下载的资源。</p>
                       </div>

                       {/* Search & Filter Bar */}
                       <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1 relative">
                             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                             </div>
                             <input 
                               type="text"
                               placeholder="输入关键词查找..."
                               value={downloadSearch}
                               onChange={(e) => setDownloadSearch(e.target.value)}
                               className="w-full bg-white border border-gray-200 h-10 pl-10 pr-4 rounded-lg focus:outline-none focus:border-black text-sm font-medium placeholder:text-gray-400 transition-colors"
                             />
                          </div>
                          <div className="w-full md:w-48 relative">
                             <div className="relative">
                               <button 
                                  onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                                  className="w-full h-10 px-4 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-black cursor-pointer text-gray-600 hover:text-black transition-colors flex items-center justify-between"
                                >
                                  <span>{downloadFilter === 'all' ? '请选择类型' : downloadFilter}</span>
                                  <svg className={`w-4 h-4 transition-transform ${isFilterMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                                </button>

                                <AnimatePresence>
                                  {isFilterMenuOpen && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 10 }}
                                      className="absolute right-0 top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50"
                                    >
                                      {[
                                        { value: 'all', label: '全部' },
                                        { value: '作品集', label: '作品集' },
                                        { value: '电商零售', label: '电商零售' },
                                        { value: '博客资讯', label: '博客资讯' },
                                        { value: '后台管理', label: '后台管理' },
                                        { value: '落地页推广', label: '落地页推广' }
                                      ].map((option) => (
                                        <button
                                          key={option.value}
                                          onClick={() => {
                                            setDownloadFilter(option.value);
                                            setIsFilterMenuOpen(false);
                                          }}
                                          className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${downloadFilter === option.value ? 'bg-gray-50 text-black font-medium' : 'text-gray-600'}`}
                                        >
                                          {option.label}
                                        </button>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Table View */}
                    <div className="border border-gray-100 border-b-0 rounded-2xl overflow-hidden flex flex-col justify-between min-h-[600px] bg-white">
                       <div className="flex-1">
                           <Table
                              dataSource={filteredDownloads.slice((downloadPage - 1) * downloadPageSize, downloadPage * downloadPageSize)}
                              rowKey="id"
                              pagination={false}
                              locale={{
                                emptyText: (
                                  <div className="flex flex-col items-center justify-center py-24">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">还没有下载记录哦 ~</h3>
                                    <p className="text-gray-400 text-sm mb-8">遇见心动的模版，就把它带回家吧！</p>
                                    <button 
                                      onClick={onHome}
                                      className="px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
                                    >
                                      <span>探索商城</span>
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                    </button>
                                  </div>
                                )
                              }}
                              columns={[
                            {
                              title: '标题',
                              dataIndex: 'templateTitle',
                              key: 'templateTitle',
                              align: 'center',
                              render: (text, record: any) => (
                                <div className="flex items-center justify-center gap-4">
                                   <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                     {record.imageUrl ? (
                                       <img src={record.imageUrl} alt={record.templateTitle} className="w-full h-full object-cover" />
                                     ) : (
                                       <div className="w-full h-full flex items-center justify-center text-gray-400">
                                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                                       </div>
                                     )}
                                   </div>
                                   <span className="font-bold text-gray-900 line-clamp-1 max-w-[200px] text-left" title={record.templateTitle}>{record.templateTitle}</span>
                                </div>
                              )
                            },
                            {
                              title: '类型',
                              dataIndex: 'category',
                              key: 'category',
                              align: 'center',
                              render: (text) => (
                                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                                  {text}
                                </span>
                              )
                            },
                            {
                              title: '下载时间',
                              dataIndex: 'date',
                              key: 'date',
                              align: 'center',
                              render: (text) => (
                                <span className="text-sm text-gray-500 font-mono">{text.split(' ')[0]}</span>
                              )
                            },
                            {
                              title: '操作',
                              key: 'action',
                              align: 'center',
                              render: () => (
                                <div className="flex justify-center">
                                  <button className="px-4 py-2 bg-white border border-gray-200 text-xs font-bold uppercase rounded-lg hover:border-black hover:bg-black hover:text-white transition-all shadow-sm">
                                    下载
                                  </button>
                                </div>
                              )
                            }
                          ]}
                       />
                       </div>

                       {filteredDownloads.length > downloadPageSize && (
                         <div className="flex justify-center py-6 border-t border-gray-100">
                             <ConfigProvider
                                theme={{
                                  token: {
                                    colorPrimary: '#000000',
                                    borderRadius: 8,
                                    colorBgContainer: '#ffffff',
                                  },
                                  components: {
                                    Pagination: {
                                      itemActiveBg: '#000000',
                                      itemActiveColor: '#ffffff',
                                    }
                                  }
                                }}
                             >
                                <Pagination
                                  current={downloadPage}
                                  total={filteredDownloads.length}
                                  pageSize={downloadPageSize}
                                  onChange={(page) => setDownloadPage(page)}
                                  showSizeChanger={false}
                                />
                             </ConfigProvider>
                         </div>
                       )}
                    </div>
                 </div>
               )}

               {/* --- WALLET TAB --- */}
               {activeTab === 'wallet' && (
                  <div className="space-y-10">
                    <div>
                        <h3 className="text-2xl font-serif font-bold mb-1">积分钱包</h3>
                        <p className="text-gray-400 text-sm">当前余额: <span className="text-black font-bold text-lg">{user.credits}</span> 积分</p>
                    </div>

                    {/* 3D Metal Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {rechargeTiers.map((tier) => (
                        <FoilCard key={tier.id} tier={tier}>
                            {/* Hero Badge */}
                            {tier.type === 'hero' && (
                              <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider z-20">
                                最划算
                              </div>
                            )}
                            
                            <div className="mb-8 z-10">
                              <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${tier.type === 'hero' ? 'text-gray-400' : 'text-gray-400'}`}>
                                {tier.title}
                              </h4>
                              <div className="flex items-baseline gap-1">
                                <span className={`text-5xl font-serif font-bold tracking-tight`}>
                                  ¥{tier.price}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-3 mb-8 flex-1 z-10 relative">
                              <div className="flex items-center gap-3 text-sm">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${tier.type === 'hero' ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <span className="font-medium text-base">{tier.credits} 积分</span>
                              </div>
                              {tier.bonus > 0 && (
                                <div className="flex items-center gap-3 text-sm">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${tier.type === 'hero' ? 'bg-orange-500/20 text-orange-300' : 'bg-indigo-50 text-indigo-600'}`}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                  </div>
                                  <span className={`${tier.type === 'hero' ? 'text-orange-200' : 'text-indigo-600'} font-bold`}>
                                    + {tier.bonus} 赠送
                                  </span>
                                </div>
                              )}
                            </div>

                            <button 
                              onClick={() => handleRecharge(tier)}
                              className={`w-full py-4 rounded-xl font-bold text-sm transition-all uppercase tracking-wide relative z-20 ${
                              tier.type === 'hero'
                                ? 'bg-white text-black hover:bg-gray-100 shadow-xl'
                                : 'bg-gray-900 text-white hover:bg-black shadow-lg'
                            }`}>
                              立即充值
                            </button>
                        </FoilCard>
                      ))}
                    </div>


                    {/* Transaction History */}
                    <div className="pt-10 border-t border-gray-100">
                       <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-6">近期交易明细</h4>
                       <div className="space-y-3">
                          {transactions.map(tx => (
                            <div key={tx.id} className="flex justify-between items-center p-5 bg-gray-50 rounded-xl border border-gray-100">
                               <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    tx.type === 'recharge' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                  }`}>
                                    {tx.type === 'recharge' 
                                      ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                                      : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                                    }
                                  </div>
                                  <div>
                                    <div className="font-bold text-gray-900 text-sm">{tx.description}</div>
                                    <div className="text-xs text-gray-400 mt-0.5">{tx.date}</div>
                                  </div>
                               </div>
                               <div className={`font-mono font-bold text-sm ${tx.type === 'recharge' ? 'text-green-600' : 'text-black'}`}>
                                 {tx.type === 'recharge' ? '+' : '-'} {tx.amount}
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
               )}

               {/* --- SECURITY TAB --- */}
               {activeTab === 'security' && (
                 <div className="space-y-12">
                   <div>
                       <h3 className="text-2xl font-serif font-bold mb-1">账号安全</h3>
                       <p className="text-gray-400 text-sm">更新密码或管理您的账号状态。</p>
                   </div>

                   <div className="space-y-6 max-w-lg">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">当前密码</label>
                        <input 
                          type="password"
                          value={oldPass}
                          onChange={(e) => setOldPass(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:bg-white focus:border-black focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">新密码</label>
                        <input 
                          type="password"
                          value={newPass}
                          onChange={(e) => setNewPass(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:bg-white focus:border-black focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="flex gap-4 pt-2">
                        <button className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
                          更新密码
                        </button>
                        <button 
                          onClick={() => setShowForgotPassword(true)}
                          className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-full font-medium hover:bg-gray-50 transition-colors"
                        >
                          忘记密码
                        </button>
                      </div>
                   </div>

                   <div className="pt-10 border-t border-gray-100">
                     <h4 className="text-sm font-bold uppercase tracking-wider text-red-500 mb-4">危险区域</h4>
                     <div className="flex justify-between items-center p-5 bg-red-50 border border-red-100 rounded-xl">
                        <div>
                           <div className="font-bold text-gray-900">注销账号</div>
                           <p className="text-xs text-gray-500 mt-1">此操作不可逆，您的所有数据将被永久删除。</p>
                        </div>
                        <button 
                          onClick={handleDeleteAccountClick}
                          className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-600 hover:text-white transition-colors"
                        >
                          注销账号
                        </button>
                     </div>
                   </div>
                 </div>
               )}

            </motion.div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showAvatarModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-100"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">更换头像</h3>
                <p className="text-sm text-gray-500 mt-1">支持上传图片，自动裁剪为正方形。</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-200">
                  {previewUrl ? (
                    <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                  ) : isImageAvatar ? (
                    <img src={user.avatar} alt="current" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-2xl font-serif font-bold text-gray-600">
                      {user.avatar}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block">
                    <input type="file" accept="image/*" onChange={handleAvatarFileChange} className="block w-full text-sm" />
                  </label>
                  <p className="text-xs text-gray-400 mt-2">建议尺寸≥256×256，文件小于 2MB。</p>
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button onClick={() => setShowAvatarModal(false)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">取消</button>
                <button onClick={resetAvatarToInitial} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">恢复默认</button>
                <button onClick={confirmSaveAvatar} disabled={!previewUrl || isSavingAvatar} className="px-4 py-2 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSavingAvatar ? '保存中...' : '保存头像'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

async function readAndCropToDataURL(file: File, size: number): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  const minSide = Math.min(bitmap.width, bitmap.height);
  const sx = (bitmap.width - minSide) / 2;
  const sy = (bitmap.height - minSide) / 2;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, sx, sy, minSide, minSide, 0, 0, size, size);
  return canvas.toDataURL('image/png');
}
