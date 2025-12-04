import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Template } from '../types';
import { useNavigate } from 'react-router-dom';

interface HeroCarouselProps {
  featuredTemplates: Template[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ featuredTemplates }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % featuredTemplates.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [featuredTemplates.length]);

  const handleDotClick = (idx: number) => {
    setDirection(idx > activeIndex ? 1 : -1);
    setActiveIndex(idx);
  };

  const activeTemplate = featuredTemplates[activeIndex];

  // Animation Variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    })
  };

  const textVariants = {
    enter: { y: 20, opacity: 0 },
    center: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  if (!activeTemplate) return null;

  return (
    <div className="relative w-full h-[85vh] min-h-[700px] overflow-hidden bg-stone-900 text-white">
      
      {/* --- Background Layer: Blurred Parallax --- */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeTemplate.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.4, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-0"
        >
           <img 
             src={activeTemplate.imageUrl} 
             alt="bg" 
             className="w-full h-full object-cover blur-3xl brightness-50"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-stone-900/60 to-stone-900" />
        </motion.div>
      </AnimatePresence>

      {/* --- Main Content Grid --- */}
      <div className="relative z-10 w-full h-full flex items-center">
        <div className="max-w-[1800px] mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left: Typography */}
          <div className="lg:col-span-5 space-y-10">
             
             {/* Meta Info with Staggered Entrance */}
             <div className="space-y-6">
               <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeTemplate.id + '-meta'}
                    variants={textVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex flex-wrap gap-3"
                  >
                     <span className="px-3 py-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-xs font-medium tracking-wider uppercase text-white/80">
                       {activeTemplate.category}
                     </span>
                     <span className="px-3 py-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-xs font-medium tracking-wider uppercase text-orange-300">
                       Featured Collection
                     </span>
                  </motion.div>
               </AnimatePresence>

               <div className="overflow-hidden">
                 <AnimatePresence mode="wait">
                   <motion.h1
                     key={activeTemplate.id + '-title'}
                     variants={textVariants}
                     initial={{ y: 40, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     exit={{ y: -40, opacity: 0 }}
                     transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                     className="text-6xl md:text-8xl font-serif font-medium leading-[0.9] tracking-tight"
                   >
                     {activeTemplate.title}
                   </motion.h1>
                 </AnimatePresence>
               </div>

               <AnimatePresence mode="wait">
                 <motion.p
                   key={activeTemplate.id + '-desc'}
                   variants={textVariants}
                   initial="enter"
                   animate="center"
                   exit="exit"
                   transition={{ duration: 0.5, delay: 0.2 }}
                   className="text-lg text-gray-400 max-w-md leading-relaxed line-clamp-3"
                 >
                   {activeTemplate.description}
                 </motion.p>
               </AnimatePresence>
             </div>

             {/* Action Buttons */}
             <motion.div 
               className="flex items-center gap-6"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4 }}
             >
               <button 
                 onClick={() => navigate(`/template/${activeTemplate.id}`)}
                 className="group relative px-8 py-4 bg-white text-black rounded-full font-medium overflow-hidden"
               >
                 <div className="absolute inset-0 bg-orange-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                 <span className="relative flex items-center gap-2">
                   立即查看
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                 </span>
               </button>
               
               <div className="flex flex-col">
                 <span className="text-xs text-gray-500 uppercase tracking-widest">License Price</span>
                 <span className="text-2xl font-serif italic">¥{activeTemplate.price}</span>
               </div>
             </motion.div>

             {/* Progress Indicators */}
             <div className="pt-8 flex items-center gap-4">
                {featuredTemplates.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDotClick(idx)}
                    className="group relative h-1 w-12 bg-white/10 rounded-full overflow-hidden transition-all hover:h-2"
                  >
                    {idx === activeIndex && (
                      <motion.div 
                        layoutId="progress"
                        className="absolute inset-0 bg-white"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 8, ease: "linear" }}
                      />
                    )}
                    {idx !== activeIndex && (
                      <div className={`absolute inset-0 bg-white/40 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300`} />
                    )}
                  </button>
                ))}
             </div>
          </div>

          {/* Right: Visual Card Stack */}
          <div className="lg:col-span-7 h-[600px] md:h-[750px] relative perspective-2000 flex items-center justify-center lg:justify-end">
             <AnimatePresence initial={false} custom={direction} mode="popLayout">
               <motion.div
                 key={activeTemplate.id}
                 custom={direction}
                 variants={slideVariants}
                 initial="enter"
                 animate="center"
                 exit="exit"
                 transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                 className="absolute w-full max-w-5xl aspect-[16/10] cursor-pointer"
                 onClick={() => navigate(`/template/${activeTemplate.id}`)}
               >
                  <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                    <img 
                      src={activeTemplate.imageUrl} 
                      alt={activeTemplate.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                    />
                    
                    {/* Glossy Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none" />
                    
                    {/* Floating Tag */}
                    <div className="absolute bottom-8 left-8 bg-black/40 backdrop-blur-md border border-white/20 px-6 py-3 rounded-xl">
                       <div className="text-white font-serif text-xl">{activeTemplate.title}</div>
                       <div className="text-white/60 text-xs uppercase tracking-wider mt-1">Design Preview</div>
                    </div>
                  </div>
               </motion.div>
             </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};
