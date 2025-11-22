import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserProfile as UserProfileType, Transaction, DownloadRecord, Template } from '../types';
import { TemplateCard } from './TemplateCard';

interface UserProfileProps {
  user: UserProfileType;
  transactions: Transaction[];
  downloadRecords: DownloadRecord[];
  favoriteTemplates: Template[];
  onLogout: () => void;
  onUpdateProfile: (updated: Partial<UserProfileType>) => void;
  onNavigateHome: () => void;
  onTemplateClick: (template: Template) => void;
}

type Tab = 'profile' | 'favorites' | 'downloads' | 'wallet' | 'security';

export const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  transactions, 
  downloadRecords, 
  favoriteTemplates,
  onLogout, 
  onUpdateProfile,
  onNavigateHome,
  onTemplateClick
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio);
  const [isEditing, setIsEditing] = useState(false);

  // Security State
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const handleSaveProfile = () => {
    onUpdateProfile({ name: editName, bio: editBio });
    setIsEditing(false);
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
      title: 'I 档 · 基础包'
    },
    {
      id: 2,
      price: 200,
      credits: 2000,
      bonus: 100,
      type: 'pro',
      title: 'II 档 · 进阶包'
    },
    {
      id: 3,
      price: 500,
      credits: 5000,
      bonus: 500,
      type: 'hero',
      title: 'III 档 · 旗舰包'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfaf8] pt-24 pb-12 px-6">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Breadcrumb / Header */}
        <div className="flex items-center gap-2 mb-8 text-sm text-gray-400">
           <button onClick={onNavigateHome} className="hover:text-black transition-colors">首页</button>
           <span>/</span>
           <span className="text-black">个人中心</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-3">
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <div className="flex flex-col items-center text-center mb-8">
                   <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center text-2xl font-serif font-bold text-orange-900 mb-4 shadow-inner">
                     {user.avatar}
                   </div>
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
                   <TabButton 
                     id="wallet" 
                     label="积分钱包" 
                     icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>} 
                   />
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
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {favoriteTemplates.map(tpl => (
                          <TemplateCard 
                            key={tpl.id} 
                            template={tpl} 
                            onClick={onTemplateClick} 
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                         <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                         </div>
                         <h4 className="text-lg font-medium text-gray-900">暂无收藏</h4>
                         <p className="text-gray-400 text-sm mt-2">浏览商城，发现您心仪的设计。</p>
                         <button onClick={onNavigateHome} className="mt-6 text-black underline underline-offset-4 text-sm font-medium hover:opacity-70">去逛逛</button>
                      </div>
                    )}
                 </div>
               )}

               {/* --- DOWNLOADS TAB --- */}
               {activeTab === 'downloads' && (
                 <div className="space-y-8">
                    <div>
                       <h3 className="text-2xl font-serif font-bold mb-1">下载历史</h3>
                       <p className="text-gray-400 text-sm">查看您已购买和下载的资源。</p>
                    </div>

                    <div className="space-y-4">
                       {downloadRecords.length > 0 ? (
                         downloadRecords.map(record => (
                           <div key={record.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-gray-900">{record.templateTitle}</h4>
                                    <p className="text-xs text-gray-400">下载于 {record.date}</p>
                                 </div>
                              </div>
                              <button className="px-4 py-2 text-xs font-bold uppercase border border-gray-200 rounded-lg hover:bg-black hover:text-white hover:border-black transition-colors">
                                再次下载
                              </button>
                           </div>
                         ))
                       ) : (
                         <p className="text-gray-400 text-sm text-center py-10">暂无下载记录。</p>
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

                    {/* Recharge Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {rechargeTiers.map((tier) => (
                        <motion.div
                          key={tier.id}
                          whileHover={{ y: -8 }}
                          animate={tier.type === 'hero' ? {
                            boxShadow: [
                              "0px 0px 0px rgba(99, 102, 241, 0)",
                              "0px 0px 25px rgba(99, 102, 241, 0.25)",
                              "0px 0px 0px rgba(99, 102, 241, 0)"
                            ]
                          } : {}}
                          transition={tier.type === 'hero' ? {
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          } : {}}
                          className={`relative rounded-2xl p-6 border flex flex-col cursor-pointer transition-all overflow-hidden ${
                            tier.type === 'hero' 
                              ? 'bg-[#1c1917] border-[#292524] text-white' 
                              : tier.type === 'pro'
                                ? 'bg-white border-indigo-100 text-gray-900 shadow-md shadow-indigo-100/50'
                                : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300'
                          }`}
                        >
                          {/* --- Background Patterns --- */}
                          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                             {tier.type === 'basic' && (
                               <div className="absolute -top-10 -right-10 w-40 h-40 opacity-10">
                                 <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-gray-900 w-full h-full">
                                    <circle cx="50" cy="50" r="40" strokeWidth="0.5" />
                                    <circle cx="50" cy="50" r="30" strokeWidth="0.5" />
                                    <circle cx="50" cy="50" r="20" strokeWidth="0.5" />
                                 </svg>
                               </div>
                             )}

                             {tier.type === 'pro' && (
                               <>
                                 <motion.div 
                                   animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                                   transition={{ duration: 6, repeat: Infinity }}
                                   className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" 
                                 />
                                 <motion.div 
                                   animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                                   transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                                   className="absolute top-10 right-0 w-32 h-32 bg-rose-400/10 rounded-full blur-2xl" 
                                 />
                               </>
                             )}

                             {tier.type === 'hero' && (
                               <>
                                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
                                  <motion.div 
                                     animate={{ rotate: 360, scale: [1, 1.3, 1] }}
                                     transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                     className="absolute -top-20 -left-20 w-[150%] h-[150%] bg-gradient-to-br from-orange-500/20 via-transparent to-purple-600/20 blur-3xl opacity-50"
                                  />
                               </>
                             )}
                          </div>

                          <div className="relative z-10 flex flex-col h-full">
                            {tier.type === 'hero' && (
                              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-400 to-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider transform rotate-12 z-10">
                                最划算
                              </div>
                            )}
                            
                            <div className="mb-6">
                              <h4 className={`text-sm font-bold uppercase tracking-wider mb-3 ${tier.type === 'hero' ? 'text-gray-400' : 'text-gray-500'}`}>
                                {tier.title}
                              </h4>
                              <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-serif font-bold tracking-tight">¥{tier.price}</span>
                              </div>
                            </div>

                            <div className="space-y-3 mb-8 flex-1">
                              <div className="flex items-center gap-2 text-sm">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${tier.type === 'hero' ? 'bg-orange-500/20 text-orange-300' : 'bg-indigo-50 text-indigo-600'}`}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <span className="font-medium">{tier.credits} 基础积分</span>
                              </div>
                              {tier.bonus > 0 && (
                                <div className="flex items-center gap-2 text-sm">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${tier.type === 'hero' ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-50 text-purple-600'}`}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                  </div>
                                  <span className={`${tier.type === 'hero' ? 'text-orange-200' : 'text-indigo-600'} font-bold`}>
                                    额外赠送 {tier.bonus} 积分
                                  </span>
                                </div>
                              )}
                            </div>

                            <button className={`w-full py-4 rounded-xl font-bold text-sm transition-all uppercase tracking-wide ${
                              tier.type === 'hero'
                                ? 'bg-white text-black hover:bg-gray-100 shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                                : tier.type === 'pro'
                                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black'
                            }`}>
                              立即充值
                            </button>
                          </div>
                        </motion.div>
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
                      <button className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
                        更新密码
                      </button>
                   </div>

                   <div className="pt-10 border-t border-gray-100">
                     <h4 className="text-sm font-bold uppercase tracking-wider text-red-500 mb-4">危险区域</h4>
                     <div className="flex justify-between items-center p-5 bg-red-50 border border-red-100 rounded-xl">
                        <div>
                           <div className="font-bold text-gray-900">注销账号</div>
                           <p className="text-xs text-gray-500 mt-1">此操作不可逆，您的所有数据将被永久删除。</p>
                        </div>
                        <button className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-600 hover:text-white transition-colors">
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
    </div>
  );
};