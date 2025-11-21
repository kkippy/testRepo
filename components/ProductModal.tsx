import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Template, Review } from '../types';
import { TemplateCard } from './TemplateCard';

interface ProductModalProps {
  template: Template | null;
  allTemplates?: Template[];
  onClose: () => void;
  onRelatedClick?: (template: Template) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ template, allTemplates = [], onClose, onRelatedClick }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'code' | 'reviews'>('details');
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Review Logic State
  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [ratingInput, setRatingInput] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentInput, setCommentInput] = useState('');

  // Scroll to top when mounted or when template changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveTab('details');
    setIsFavorite(false);
    
    if (template) {
      setLocalReviews(template.reviews || []);
      setRatingInput(0);
      setCommentInput('');
      setHoverRating(0);
    }
  }, [template]);

  if (!template) return null;

  const relatedTemplates = allTemplates
    .filter(t => t.category === template.category && t.id !== template.id)
    .slice(0, 4);
    
  // Find other templates by the same author
  const authorTemplates = allTemplates
    .filter(t => t.author === template.author && t.id !== template.id)
    .slice(0, 3);

  const handleDownload = () => {
    setIsDownloading(true);
    // Simulate API call
    setTimeout(() => {
      setIsDownloading(false);
      setShowDownloadPopup(true);
      // Auto hide popup
      setTimeout(() => setShowDownloadPopup(false), 3000);
    }, 1500);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (ratingInput === 0) return;

    const newReview: Review = {
      id: Date.now().toString(),
      user: '您', // In a real app, this would come from auth context
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
      {/* Download Popup Toast */}
      <AnimatePresence>
        {showDownloadPopup && (
          <motion.div 
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 bg-black text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3"
          >
            <div className="bg-green-500 rounded-full p-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span className="font-medium text-sm">文件下载成功！</span>
          </motion.div>
        )}
      </AnimatePresence>

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
            onClick={onClose}
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
                                     <div className="font-bold text-black text-sm">{review.user}</div>
                                     <div className="text-xs text-gray-400">{review.date}</div>
                                  </div>
                                </div>
                                <div className="flex text-yellow-500 text-xs">
                                   {'★'.repeat(Math.floor(review.rating))}
                                   <span className="text-gray-200">{'★'.repeat(5 - Math.floor(review.rating))}</span>
                                </div>
                              </div>
                              <p className="text-gray-600 text-sm mt-3 leading-relaxed">{review.comment}</p>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-gray-400">暂无评价，快来抢沙发吧！</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Column: Action Card */}
            <div className="lg:col-span-5">
               <div className="sticky top-32 bg-gray-50 rounded-2xl p-8 border border-gray-100">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                       <span className="block text-gray-500 text-sm">总价</span>
                       <span className="text-4xl font-serif font-medium">¥{template.price}</span>
                    </div>
                    <button 
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`p-3 rounded-full transition-all ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-white text-gray-400 hover:text-black'}`}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="w-full bg-black text-white py-5 rounded-xl font-medium text-lg hover:bg-gray-900 transition-all hover:shadow-xl hover:-translate-y-1 mb-4 flex justify-center items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isDownloading ? (
                      <>
                         <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                         </svg>
                         下载中...
                      </>
                    ) : (
                      <>
                        立即下载
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                      </>
                    )}
                  </button>
                  
                  <a 
                    href={template.previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex justify-center items-center w-full py-5 bg-white border border-gray-200 rounded-xl font-medium text-lg text-gray-700 hover:border-black hover:text-black transition-all"
                  >
                    在线预览
                  </a>

                  <div className="mt-8 space-y-4 text-sm text-gray-500">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      <span>即时下载</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      <span>终身更新</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      <span>包含技术支持</span>
                    </div>
                  </div>
               </div>
            </div>
            
          </div>

          {/* Related Templates */}
          {relatedTemplates.length > 0 && (
             <div className="mt-24 pt-16 border-t border-gray-100">
               <h2 className="text-3xl font-serif font-medium mb-12">猜你喜欢</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                 {relatedTemplates.map(rel => (
                   <TemplateCard 
                      key={rel.id} 
                      template={rel} 
                      onClick={(t) => onRelatedClick && onRelatedClick(t)} 
                   />
                 ))}
               </div>
             </div>
          )}

        </div>
      </div>
    </motion.div>
  );
};
