import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Template } from '../types';
import { useNavigate } from 'react-router-dom';

interface HeroCarouselProps {
  featuredTemplates: Template[];
}

const FloatingParticles = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
      xOffset: Math.random() * 100 - 50 // Increased horizontal movement
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-orange-100/30 blur-[1px]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -120, 0],
            x: [0, p.xOffset, 0],
            opacity: [0, 0.8, 0], // Increased opacity for better visibility
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const FolderCard = ({ template, navigate, isBack = false }: { template: Template; navigate: (path: string) => void; isBack?: boolean }) => {
  return (
    <div
      onClick={() => !isBack && navigate(`/template/${template.id}`)}
      className={`w-full h-full relative group perspective-1000 ${isBack ? 'cursor-default pointer-events-none' : 'cursor-pointer'}`}
    >
      <motion.div 
        initial={isBack ? { rotateY: -12, rotateX: 5, scale: 0.95, x: 40, opacity: 0.5 } : { rotateY: -12, rotateX: 5, scale: 1, x: 0, opacity: 1 }}
        animate={isBack ? { rotateY: -12, rotateX: 5, scale: 0.95, x: 40, opacity: 0.5 } : { rotateY: -12, rotateX: 5, scale: 1, x: 0, opacity: 1 }}
        whileHover={!isBack ? { rotateY: -8, rotateX: 2, y: -10, scale: 1.02 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full h-full relative transform-style-3d"
      >
        {/* Realistic Shadow Layers for Depth */}
        <div className="absolute inset-4 rounded-[24px] bg-black/40 blur-xl transform translate-y-8 translate-z-[-20px]" />
        <div className="absolute inset-4 rounded-[24px] bg-black/60 blur-2xl transform translate-y-16 translate-z-[-40px] opacity-70" />

        {/* Main Card Body - Skeuomorphic Design */}
          <div className="w-full h-full relative rounded-[24px] overflow-hidden z-10 bg-[#1a1a1a] transform-style-3d shadow-2xl">
            
            {/* Realistic Glass Border Structure */}
            <div className="absolute inset-0 z-50 rounded-[24px] pointer-events-none">
              {/* 1. Sharp Outer Edge (Rim Light) */}
              <div className="absolute inset-0 rounded-[24px] border border-white/20" />
              
              {/* 2. Inner Thick Glass Highlight (Top/Left dominant) - Simulates glass thickness */}
              <div className="absolute inset-0 rounded-[24px] shadow-[inset_1.5px_1.5px_0_0_rgba(255,255,255,0.5),inset_-1px_-1px_0_0_rgba(255,255,255,0.1)]" />
              
              {/* 3. Subtle Inner Glow to simulate volume */}
              <div className="absolute inset-0 rounded-[24px] shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]" />
            </div>

            {/* Image Layer */}
          <img 
            src={template.imageUrl} 
            alt={template.title}
            className={`w-full h-full object-cover transition-all duration-700 ${isBack ? 'grayscale opacity-50' : 'grayscale-0 opacity-100'}`}
          />
          
          {/* Glass Gloss / Reflection Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-60 z-20 pointer-events-none" />
          
          {/* Dynamic Sheen Effect on Hover - Removed */}
          
          {/* Content Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
        </div>

        {/* Floating Elements (Only for Front Card) */}
        {!isBack && (
          <>
            <div 
              className="absolute bottom-10 left-10 z-30 transform translate-z-[60px]"
              style={{ transform: "translateZ(60px)" }}
            >
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4">
                 <div>
                   <div className="text-white font-sans font-bold text-2xl tracking-tight">{template.title}</div>
                   <div className="text-white/60 text-xs uppercase tracking-widest mt-1">Premium Template</div>
                 </div>
                 <div className="w-px h-8 bg-white/20" />
                 <div className="text-orange-300 font-bold text-lg">¥{template.price}</div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

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
  const swapVariants = {
    enter: (direction: number) => ({
      zIndex: 0,
      opacity: 0.5,
      scale: 0.95,
      x: direction > 0 ? 40 : -120, // If Next: enter from stack (40). If Prev: enter from left (-120)
    }),
    center: {
      zIndex: 10,
      opacity: 1,
      scale: 1,
      x: 0,
    },
    exit: (direction: number) => ({
      zIndex: direction < 0 ? 0 : 20, // If Prev: exit to stack (low z). If Next: exit to left (high z, fly out)
      opacity: 0,
      scale: direction < 0 ? 0.95 : 1.1, // If Prev: scale down to stack. If Next: scale up/fly out
      x: direction < 0 ? 40 : -150, // If Prev: go to stack (40). If Next: fly left (-150)
    })
  };

  const textVariants = {
    enter: { y: 20, opacity: 0 },
    center: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  if (!activeTemplate) return null;

  return (
    <div className="relative w-full h-[92vh] min-h-[700px] overflow-hidden bg-stone-900 text-white">
      
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

      {/* Floating Particles */}
      <FloatingParticles />

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
                     <span className="px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-sm font-medium tracking-wider uppercase text-white/80">
                       {activeTemplate.category}
                     </span>
                     <span className="px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-sm font-medium tracking-wider uppercase text-orange-300">
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
                     className="text-6xl md:text-8xl font-sans font-bold leading-[0.9] tracking-tight"
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
                 <span className="text-2xl font-sans font-bold">¥{activeTemplate.price}</span>
               </div>
             </motion.div>

             {/* Progress Indicators */}
             <div className="pt-8 flex items-center gap-6">
                <span className="text-sm font-medium font-sans text-white/40 tracking-widest">
                  0{activeIndex + 1} <span className="mx-2 text-white/20">/</span> 0{featuredTemplates.length}
                </span>
                <div className="flex gap-3">
                  {featuredTemplates.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleDotClick(idx)}
                      className={`group relative h-1 rounded-full overflow-hidden transition-all duration-500 ${
                        idx === activeIndex ? 'w-16 bg-white/20' : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
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
                    </button>
                  ))}
                </div>
             </div>
          </div>

          {/* Right: Visual Card Stack */}
          <div className="lg:col-span-7 h-[600px] md:h-[750px] relative perspective-2000 flex items-center justify-center lg:justify-end">
             {/* Background Static Card (Next Item) */}
             <div className="absolute w-full max-w-5xl aspect-[16/10] z-0">
                <FolderCard 
                  template={featuredTemplates[(activeIndex + 1) % featuredTemplates.length]} 
                  navigate={navigate} 
                  isBack={true}
                />
             </div>

             {/* Active Animated Card */}
             <AnimatePresence initial={false} custom={direction} mode="popLayout">
               <motion.div
                 key={activeTemplate.id}
                 custom={direction}
                 variants={swapVariants}
                 initial="enter"
                 animate="center"
                 exit="exit"
                 transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                 className="absolute w-full max-w-5xl aspect-[16/10]"
               >
                 <FolderCard template={activeTemplate} navigate={navigate} />
               </motion.div>
             </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};
