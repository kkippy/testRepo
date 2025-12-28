import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Template, Review } from '../types';
import { TemplateGallery } from './TemplateGallery';
import { useNavigate, Link } from 'react-router-dom';

interface ProductDetailProps {
  template: Template;
  allTemplates?: Template[];
  onRelatedClick?: (template: Template) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onDownload?: (template: Template) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ 
  template, 
  allTemplates = [], 
  onRelatedClick,
  isFavorite = false,
  onToggleFavorite,
  onDownload
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [showFavoritePopup, setShowFavoritePopup] = useState(false);
  const [favoriteAction, setFavoriteAction] = useState<'add' | 'remove'>('add');
  
  // Review Logic State
  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [ratingInput, setRatingInput] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentInput, setCommentInput] = useState('');
  
  // Reply Logic State
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');
  
  // Like Logic State
  const [likedReviewIds, setLikedReviewIds] = useState<Set<string>>(new Set());

  // Animation State
  const [activeHearts, setActiveHearts] = useState<Record<string, {
    id: number;
    color: string;
    x: number;
    y: number;
    scale: number;
    delay: number;
    duration: number;
  }[]>>({});

  const triggerHearts = (reviewId: string) => {
    const colors = ['#FF0000', '#FF69B4', '#FF1493', '#9370DB', '#8A2BE2', '#FFA500', '#FFD700', '#00BFFF'];
    const newHearts = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      color: colors[Math.floor(Math.random() * colors.length)],
      x: (Math.random() - 0.5) * 20, // Tighter horizontal spread for "vertical" look
      y: -80 - Math.random() * 60,   // Varying vertical distance
      scale: 0.8 + Math.random() * 0.4,
      delay: i * 0.15,               // Staggered delay for "bubbling" effect
      duration: 2 + Math.random()    // Slower rise
    }));
    
    setActiveHearts(prev => ({
      ...prev,
      [reviewId]: [...(prev[reviewId] || []), ...newHearts]
    }));

    setTimeout(() => {
      setActiveHearts(prev => ({
        ...prev,
        [reviewId]: (prev[reviewId] || []).filter(h => !newHearts.find(nh => nh.id === h.id))
      }));
    }, 4000); // Increased cleanup time to account for longer duration + delays
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveTab('details');
    
    if (template) {
      setLocalReviews(template.reviews || []);
      setRatingInput(0);
      setCommentInput('');
      setHoverRating(0);
      setReplyingToId(null);
      setReplyInput('');
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
    if (onDownload) {
      onDownload(template);
    }
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
      date: '刚刚',
      likes: 0
    };

    setLocalReviews([newReview, ...localReviews]);
    setRatingInput(0);
    setCommentInput('');
    setHoverRating(0);
  };

  const handleLike = (reviewId: string) => {
    if (likedReviewIds.has(reviewId)) {
      // Unlike
      setLocalReviews(prev => prev.map(review => 
        review.id === reviewId ? { ...review, likes: Math.max((review.likes || 0) - 1, 0) } : review
      ));
      setLikedReviewIds(prev => {
        const next = new Set(prev);
        next.delete(reviewId);
        return next;
      });
    } else {
      // Like
      setLocalReviews(prev => prev.map(review => 
        review.id === reviewId ? { ...review, likes: (review.likes || 0) + 1 } : review
      ));
      setLikedReviewIds(prev => {
        const next = new Set(prev);
        next.add(reviewId);
        return next;
      });
      triggerHearts(reviewId);
    }
  };

  const handleReplyClick = (reviewId: string) => {
    if (replyingToId === reviewId) {
      setReplyingToId(null);
      setReplyInput('');
    } else {
      setReplyingToId(reviewId);
      setReplyInput('');
    }
  };

  const handleSubmitReply = (reviewId: string) => {
    if (!replyInput.trim()) return;

    const newReply = {
      user: '您',
      isDesigner: false,
      content: replyInput,
      date: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/\//g, '-')
    };

    setLocalReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, replies: [...(review.replies || []), newReply] } : review
    ));

    setReplyingToId(null);
    setReplyInput('');
  };

  const tabNames = {
    details: '详情',
    reviews: '评价'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-white z-40 relative pt-20"
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
              <Link to="/profile?tab=downloads" className="text-sm font-bold text-white underline underline-offset-4 hover:text-gray-200 transition-colors ml-1">查看</Link>
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
              {favoriteAction === 'add' && (
                <Link to="/profile?tab=favorites" className="text-sm font-bold text-gray-500 hover:text-black underline underline-offset-4 transition-colors">
                  查看收藏
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Back Button */}
      <div className="max-w-[1400px] mx-auto px-6 mb-8">
        <button 
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-gray-500 hover:text-black transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          <span className="font-medium">返回列表</span>
        </button>
      </div>

      {/* Top Core Area */}
      <div className="max-w-[1400px] mx-auto px-6 mb-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-8 border-b border-gray-100">
           <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
                 <span className="bg-gray-100 text-gray-900 px-3 py-1 rounded-full">{template.category}</span>
                 <div className="flex items-center text-yellow-500 gap-1">
                   <span>★</span>
                   <span className="text-black font-bold">{template.rating}</span>
                   <span className="text-gray-400">/ 5.0</span>
                 </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-gray-900">
                {template.title}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">¥{template.price}</span>
                {template.serviceTags && template.serviceTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {template.serviceTags.map((tag, idx) => {
                      const colorMap = {
                        green: 'bg-green-500',
                        blue: 'bg-blue-500',
                        purple: 'bg-purple-500',
                        orange: 'bg-orange-500',
                        red: 'bg-red-500'
                      };
                      return (
                        <div key={idx} className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                          <span className={`w-2 h-2 rounded-full ${colorMap[tag.color] || 'bg-gray-500'}`}></span>
                          <span>{tag.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
           </div>
           
           <div className="flex flex-col gap-4 w-full lg:w-auto items-end">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span>{template.downloadCount || 0} 次下载</span>
              </div>
              <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                <a 
                  href={template.previewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 lg:flex-none px-8 py-4 bg-white border border-gray-200 text-gray-900 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
                >
                  <span>实时预览</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
                <button 
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex-1 lg:flex-none px-8 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 min-w-[160px]"
                >
                   {isDownloading ? (
                     <>
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                       <span>处理中...</span>
                     </>
                   ) : (
                     <>
                       <span>立即下载</span>
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                     </>
                   )}
                </button>
              </div>
           </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="max-w-[1400px] mx-auto px-6 mb-16">
         <TemplateGallery template={template} />
      </div>

      {/* Content Container */}
      <div className="max-w-[1400px] mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Info & Content */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-gray-100 pb-1">
              {(['details', 'reviews'] as const).map(tab => (
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
                    {/* Designer's Introduction & Features */}
                    <div className="space-y-12">
                      {/* Designer's Note */}
                      <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 relative overflow-hidden">
                        <div className="relative z-10 max-w-3xl">
                           <div className="flex items-center gap-4 mb-6">
                              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-xl font-serif font-bold shadow-lg">
                                {template.author.charAt(0)}
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">设计者介绍</h3>
                                <p className="text-sm text-gray-500">From {template.author}</p>
                              </div>
                           </div>
                           <p className="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-6">
                             "{template.description} 我们致力于创造不仅美观，而且在实际开发中极其易用的工具。每一个像素都经过精心考量，只为助您打造卓越的数字产品。"
                           </p>
                           


                           {/* Usage Steps */}
                           {template.usageSteps && template.usageSteps.length > 0 && (
                             <div className="mt-8 pt-8 border-t border-gray-200/60">
                               <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">使用步骤</h4>
                               <ul className="space-y-3">
                                 {template.usageSteps.map((step, idx) => (
                                   <li key={idx} className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed">
                                     <span className="flex-shrink-0 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold mt-0.5">{idx + 1}</span>
                                     <span>{step}</span>
                                   </li>
                                 ))}
                               </ul>
                             </div>
                           )}
                        </div>
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-gray-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                      </div>


                    </div>
                  </motion.div>
                )}

                {/* {activeTab === 'code' && (
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
                )} */}

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
                    <div className="space-y-8">
                      <h3 className="text-lg font-bold">评价列表</h3>
                      {localReviews.length > 0 ? (
                        localReviews.map((review) => (
                          <motion.div 
                            key={review.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-xl border border-indigo-50 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                                  {review.user.charAt(0)}
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-gray-900">{review.user}</div>
                                  <div className="text-xs text-gray-500">{review.date}</div>
                                </div>
                              </div>
                              <div className="flex text-amber-400 text-sm">
                                {'★'.repeat(review.rating)}
                                <span className="text-gray-200">{'★'.repeat(5 - review.rating)}</span>
                              </div>
                            </div>
                            <p className="text-gray-700 text-base leading-relaxed mb-4">{review.comment}</p>
                            
                            {/* Action Bar */}
                            <div className="flex items-center gap-4 border-t border-gray-100 pt-3">
                               <div className="relative">
                                 <motion.button 
                                   whileTap={{ scale: 0.8 }}
                                   onClick={() => handleLike(review.id)}
                                   className={`text-xs font-bold flex items-center gap-1 transition-all px-2 py-1 rounded-full ${
                                     likedReviewIds.has(review.id) 
                                       ? 'bg-red-50 text-red-500' 
                                       : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50'
                                   }`}
                                 >
                                   <svg 
                                     width="14" 
                                     height="14" 
                                     viewBox="0 0 24 24" 
                                     fill={likedReviewIds.has(review.id) ? "currentColor" : "none"} 
                                     stroke="currentColor" 
                                     strokeWidth="2"
                                   >
                                     <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                                   </svg>
                                   点赞 {review.likes > 0 && <span>({review.likes})</span>}
                                 </motion.button>
                                 <AnimatePresence>
                                    {activeHearts[review.id]?.map(heart => (
                                      <motion.div
                                        key={heart.id}
                                        initial={{ opacity: 0, y: 10, scale: 0, x: heart.x }}
                                        animate={{ 
                                          opacity: [0, 1, 0],
                                          y: heart.y,
                                          scale: heart.scale,
                                        }}
                                        exit={{ opacity: 0 }}
                                        transition={{ 
                                          duration: heart.duration, 
                                          delay: heart.delay,
                                          ease: "easeOut",
                                          times: [0, 0.2, 1] 
                                        }}
                                        style={{ color: heart.color }}
                                        className="absolute top-0 left-2 pointer-events-none"
                                      >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                        </svg>
                                      </motion.div>
                                    ))}
                                  </AnimatePresence>
                               </div>
                               <button 
                                 onClick={() => handleReplyClick(review.id)}
                                 className={`text-xs font-bold flex items-center gap-1 transition-colors ${
                                   replyingToId === review.id ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'
                                 }`}
                               >
                                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                 回复
                               </button>
                            </div>

                            {/* Reply Input Form */}
                            {replyingToId === review.id && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3 overflow-hidden"
                              >
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                  <textarea
                                    value={replyInput}
                                    onChange={(e) => setReplyInput(e.target.value)}
                                    placeholder="写下您的回复..."
                                    className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm min-h-[80px] mb-3 bg-white"
                                    autoFocus
                                  />
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => setReplyingToId(null)}
                                      className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                      取消
                                    </button>
                                    <button
                                      onClick={() => handleSubmitReply(review.id)}
                                      disabled={!replyInput.trim()}
                                      className="px-4 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                      发送回复
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}

                            {/* Replies Section */}
                            {review.replies && review.replies.length > 0 && (
                              <div className="mt-4 space-y-3 pl-4 border-l-2 border-indigo-100">
                                {review.replies.map((reply, rIdx) => (
                                  <div key={rIdx} className={`p-4 rounded-xl ${reply.isDesigner ? 'bg-amber-50 border border-amber-100' : 'bg-gray-50 border border-gray-100'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${reply.isDesigner ? 'bg-amber-200 text-amber-800' : 'bg-gray-200 text-gray-700'}`}>
                                          {reply.isDesigner ? '作者' : reply.user}
                                        </span>
                                        {!reply.isDesigner && <span className="text-xs text-gray-400">回复了评论</span>}
                                      </div>
                                      <span className="text-xs text-gray-400 font-mono">{reply.date}</span>
                                    </div>
                                    <p className={`text-base leading-relaxed ${reply.isDesigner ? 'text-amber-900' : 'text-gray-600'}`}>
                                      {reply.content}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
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

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Features / Trust Badge */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
               <h3 className="font-bold text-gray-900 mb-4">购买权益</h3>
               <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                    <span>商业授权 (可商用)</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                    <span>永久免费更新</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                    <span>包含完整 Figma 源文件</span>
                  </div>
                </div>
            </div>

            {/* Favorite Button (Moved here) */}
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

            {/* Designer Profile (Moved from Left Column) */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">设计者</h3>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-xl font-serif font-bold">
                  {template.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{template.author}</h4>
                  <p className="text-gray-500 text-xs">资深界面交互设计师</p>
                </div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                专注于极简主义与功能性的平衡，致力于为开发者提供高审美标准的数字资产。
              </p>

              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <div className="text-center">
                  <div className="font-bold text-gray-900">{Math.floor(template.rating * 245)}</div>
                  <div className="text-[10px] text-gray-400 uppercase">销量</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">4.9</div>
                  <div className="text-[10px] text-gray-400 uppercase">评分</div>
                </div>
                <button className="px-4 py-1.5 text-xs font-bold bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                  关注
                </button>
              </div>

              {/* More from Author */}
              {authorTemplates.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-50">
                  <div className="text-xs font-bold text-gray-400 uppercase mb-3">更多作品</div>
                  <div className="space-y-3">
                    {authorTemplates.map(t => (
                      <div 
                        key={t.id} 
                        onClick={() => onRelatedClick && onRelatedClick(t)}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className="w-12 h-8 bg-gray-100 rounded overflow-hidden">
                          <img src={t.imageUrl} alt={t.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-medium text-gray-900 truncate group-hover:text-black transition-colors">{t.title}</h5>
                        </div>
                        <span className="text-xs text-gray-400">¥{t.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
