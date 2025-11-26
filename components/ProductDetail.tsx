import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Template, Review } from '../types';
import { useNavigate } from 'react-router-dom';

interface ProductDetailProps {
  template: Template;
  allTemplates?: Template[];
  onRelatedClick?: (template: Template) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ 
  template, 
  allTemplates = [], 
  onRelatedClick,
  isFavorite = false,
  onToggleFavorite
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'details' | 'code' | 'reviews'>('details');
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [showFavoritePopup, setShowFavoritePopup] = useState(false);
  const [favoriteAction, setFavoriteAction] = useState<'add' | 'remove'>('add');
  
  // Review Logic State
  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [ratingInput, setRatingInput] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentInput, setCommentInput] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveTab('details');
    
    if (template) {
      setLocalReviews(template.reviews || []);
      setRatingInput(0);
      setCommentInput('');
      setHoverRating(0);
    }
  }, [template]);

  const relatedTemplates = allTemplates
    .filter(t => t.category === template.category && t.id !== template.id)
    .slice(0, 4);
    
  const authorTemplates = allTemplates
    .filter(t => t.author === template.author && t.id !== template.id)
    .slice(0, 3);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setShowDownloadPopup(true);
      setTimeout(() => setShowDownloadPopup(false), 3000);
    }, 1500);
  };

  const toggleFavorite = () => {
    const newStatus = !isFavorite;
    if (onToggleFavorite) {
      onToggleFavorite();
    }
    setFavoriteAction(newStatus ? 'add' : 'remove');
    setShowFavoritePopup(true);
    setTimeout(() => setShowFavoritePopup(false), 2000);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (ratingInput === 0) return;

    const newReview: Review = {
      id: Date.now().toString(),
      user: '您', 
      rating: ratingInput,
      comment: commentInput,
      date: '刚刚'
    };

    setLocalReviews([newReview, ...localReviews]);
    setRatingInput(0);
    setCommentInput('');
    setHoverRating(0);
  };

  const tabNames = {
    details: '详情',
    code: '配置代码',
    reviews: '评价'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-white z-40 relative"
    >
      {/* Toasts Container */}
      <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none w-full px-4">
        <AnimatePresence>
          {showDownloadPopup && (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="bg-black text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 pointer-events-auto"
            >
              <div className="bg-green-500 rounded-full p-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <span className="font-medium text-sm">文件下载成功！</span>
            </motion.div>
          )}

          {showFavoritePopup && (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-full shadow-xl flex items-center gap-4 pointer-events-auto"
            >
              <div className={`rounded-full p-1.5 ${favoriteAction === 'add' ? 'text-white bg-red-500' : 'text-gray-400 bg-gray-100'}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill={favoriteAction === 'add' ? "currentColor" : "none"} stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </div>
              <span className="font-bold text-base">
                {favoriteAction === 'add' ? '已成功收藏该模版' : '已从收藏夹移除'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail Page Header */}
      <div className="relative h-[60vh] w-full overflow-hidden bg-gray-100">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={template.imageUrl} 
          alt={template.title} 
          className="w-full h-full object-cover"
        />
        
        {/* Back Button */}
        <div className="absolute top-6 left-6 md:top-12 md:left-12 z-50">
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg hover:bg-black hover:text-white transition-all duration-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            <span className="font-medium">返回列表</span>
          </button>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
      </div>

      {/* Content Container */}
      <div className="max-w-[1400px] mx-auto px-6 -mt-24 relative z-10 pb-24">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-16 border border-gray-100 min-h-[800px]">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Info & Content */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
                   <span className="bg-gray-100 text-gray-900 px-3 py-1 rounded-full">{template.category}</span>
                   <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                   <span>设计者：{template.author}</span>
                   <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                   <div className="flex text-yellow-500">
                     {'★'.repeat(Math.floor(template.rating))}
                     <span className="text-gray-300">{'★'.repeat(5 - Math.floor(template.rating))}</span>
                   </div>
                   <span className="text-gray-400">({template.rating})</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-serif text-primary tracking-tight leading-none">
                  {template.title}
                </h1>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-8 border-b border-gray-100 pb-1 pt-4">
                {(['details', 'code', 'reviews'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-medium uppercase tracking-wider transition-colors relative ${
                      activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tabNames[tab]}
                    {activeTab === tab && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                    )}
                  </button>
                ))}
              </div>

              <div className="min-h-[400px]">
                <AnimatePresence mode='wait'>
                  {activeTab === 'details' && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-12"
                    >
                      {/* Description */}
                      <div className="prose prose-lg prose-stone text-gray-600 leading-relaxed">
                        <p>{template.description}</p>
                        
                        <div className="pt-6">
                          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">技术栈</h3>
                          <div className="flex flex-wrap gap-3">
                            {template.tags.map(tag => (
                              <span key={tag} className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:border-black transition-colors cursor-default">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Designer Profile Section */}
                      <div className="bg-stone-50 rounded-2xl p-8 border border-stone-100">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-6">关于设计师</h3>
                        
                        <div className="flex flex-col md:flex-row gap-6 md:items-start">
                          {/* Avatar */}
                          <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-serif font-bold flex-shrink-0">
                            {template.author.charAt(0)}
                          </div>
                          
                          <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-xl font-bold text-gray-900">{template.author}</h4>
                                <p className="text-stone-500 text-sm">资深界面交互设计师</p>
                              </div>
                              <div className="flex gap-2">
                                <button className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-white border border-gray-200 rounded-full hover:bg-black hover:text-white transition-colors">
                                  关注
                                </button>
                                <button className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                                  联系
                                </button>
                              </div>
                            </div>

                            <p className="text-stone-600 text-sm leading-relaxed">
                              专注于极简主义与功能性的平衡，拥有 10 年以上 UI 设计经验。致力于为开发者提供高审美标准、易于维护的数字资产，帮助品牌在数字世界中脱颖而出。
                            </p>

                            {/* Designer Stats */}
                            <div className="flex gap-8 pt-2 border-t border-stone-200/50">
                              <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">{Math.floor(template.rating * 245)}</div>
                                <div className="text-xs text-gray-400 uppercase">总销量</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">{Math.floor(template.rating * 12)}k</div>
                                <div className="text-xs text-gray-400 uppercase">粉丝</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">4.9</div>
                                <div className="text-xs text-gray-400 uppercase">综合评分</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* More from Author */}
                        {authorTemplates.length > 0 && (
                          <div className="mt-8 pt-6 border-t border-stone-200">
                            <div className="text-xs font-bold text-gray-400 uppercase mb-4">更多来自 {template.author} 的作品</div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              {authorTemplates.map(t => (
                                <div 
                                  key={t.id} 
                                  onClick={() => onRelatedClick && onRelatedClick(t)}
                                  className="group cursor-pointer bg-white p-3 rounded-xl border border-stone-100 hover:border-stone-300 transition-all hover:shadow-md"
                                >
                                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3 relative">
                                    <img src={t.imageUrl} alt={t.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <h5 className="text-sm font-bold text-gray-800 truncate pr-2">{t.title}</h5>
                                    <span className="text-xs font-medium text-stone-500">¥{t.price}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'code' && (
                     <motion.div
                       key="code"
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -10 }}
                     >
                       <div className="bg-[#1a1a1a] rounded-xl p-6 overflow-x-auto shadow-inner border border-gray-800">
                         <div className="flex gap-2 mb-4">
                           <div className="w-3 h-3 rounded-full bg-red-500" />
                           <div className="w-3 h-3 rounded-full bg-yellow-500" />
                           <div className="w-3 h-3 rounded-full bg-green-500" />
                         </div>
                         <pre className="text-sm font-mono text-gray-300 leading-6">
                           <code>{template.dslCode}</code>
                         </pre>
                       </div>
                     </motion.div>
                  )}

                  {activeTab === 'reviews' && (
                    <motion.div
                      key="reviews"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-10"
                    >
                      {/* Review Form */}
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                        <h3 className="text-lg font-bold mb-4">撰写评价</h3>
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">评分</label>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRatingInput(star)}
                                  onMouseEnter={() => setHoverRating(star)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  className="text-2xl focus:outline-none transition-transform hover:scale-110"
                                >
                                  <span className={`${
                                    star <= (hoverRating || ratingInput) ? 'text-yellow-500' : 'text-gray-300'
                                  }`}>
                                    ★
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                             <label className="text-xs font-bold uppercase tracking-wider text-gray-500">评论内容</label>
                             <textarea 
                               value={commentInput}
                               onChange={(e) => setCommentInput(e.target.value)}
                               className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all min-h-[100px] text-sm"
                               placeholder="分享您使用该模版的体验..."
                             />
                          </div>

                          <button 
                            type="submit"
                            disabled={ratingInput === 0}
                            className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            发布评价
                          </button>
                        </form>
                      </div>

                      {/* Reviews List */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-serif font-bold">社区评价 ({localReviews.length})</h3>
                        
                        {localReviews.length > 0 ? (
                          localReviews.map((review) => (
                            <motion.div 
                              layout
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              key={review.id} 
                              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold">
                                    {review.user.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-gray-900">{review.user}</div>
                                    <div className="text-xs text-gray-500">{review.date}</div>
                                  </div>
                                </div>
                                <div className="flex text-yellow-500 text-sm">
                                  {'★'.repeat(review.rating)}
                                  <span className="text-gray-300">{'★'.repeat(5 - review.rating)}</span>
                                </div>
                              </div>
                              <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-12 text-gray-400">
                             暂无评价，快来抢沙发吧！
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Column: Sticky Sidebar for Purchase */}
            <div className="lg:col-span-5 relative">
              <div className="sticky top-8 space-y-8">
                {/* Price Card */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-end mb-6">
                      <div>
                        <div className="text-sm text-gray-500 mb-1 uppercase tracking-wider font-medium">授权价格</div>
                        <div className="text-4xl font-bold text-gray-900 font-serif">¥{template.price}</div>
                      </div>
                      <div className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase rounded-full border border-green-100">
                        商业授权
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                       <button 
                         onClick={handleDownload}
                         className="w-full py-4 bg-black text-white text-base font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 relative overflow-hidden"
                       >
                         {isDownloading ? (
                           <>
                             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                             <span>处理中...</span>
                           </>
                         ) : (
                           <>
                             <span>立即获取</span>
                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                           </>
                         )}
                       </button>
                       
                       <button 
                         onClick={toggleFavorite}
                         className={`w-full py-3 border-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                           isFavorite 
                             ? 'border-red-100 bg-red-50 text-red-500 hover:bg-red-100' 
                             : 'border-gray-100 text-gray-600 hover:border-gray-300 hover:text-black'
                         }`}
                       >
                         <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                         {isFavorite ? '已收藏' : '加入收藏夹'}
                       </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                        <span>永久免费更新</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                        <span>商业项目无限次使用</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                        <span>包含完整 Figma 源文件</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 text-center">
                  <div className="flex justify-center -space-x-3 mb-4">
                     {[1,2,3,4].map(i => (
                       <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
                     ))}
                  </div>
                  <p className="text-sm text-stone-600">
                    <span className="font-bold text-black">200+</span> 开发者已购买此模版
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
