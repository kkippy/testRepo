import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, Variants } from 'framer-motion';
import { Template } from '../types';

interface TemplateCardProps {
  template: Template;
  onClick: (template: Template) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Reset loading state if the image URL changes (e.g. during filtering/sorting reorders)
  useEffect(() => {
    setImgLoaded(false);
  }, [template.imageUrl]);

  // Mouse move effect for "3D" tilt or parallax on hover
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const transform = useMotionTemplate`perspective(1000px) rotateX(${mouseY.get() * -5}deg) rotateY(${mouseX.get() * 5}deg)`;

  // Animation Variants for "Falling Tile" effect
  const variants: Variants = {
    hidden: { 
      opacity: 0, 
      scale: 1.2, 
      y: -60, 
      x: -30, 
      rotateX: 20, 
      rotateY: 10,
      filter: 'blur(4px)' 
    },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      x: 0,
      rotateX: 0,
      rotateY: 0,
      filter: 'blur(0px)',
      transition: { 
        type: "spring", 
        damping: 18, 
        stiffness: 90,
        mass: 1
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      transition: { duration: 0.2 } 
    }
  };

  return (
    <motion.div
      layout
      variants={variants}
      className="group relative w-full cursor-pointer perspective-1000"
      onClick={() => onClick(template)}
    >
      {/* Main Card Container */}
      <motion.div
        ref={ref}
        style={{ transform }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-500 hover:shadow-2xl aspect-[16/10] ring-1 ring-black/5 hover:ring-black/10"
      >
        {/* Image Layer */}
        <div className="absolute inset-0 overflow-hidden bg-stone-100">
          {/* Skeleton Loader */}
          {!imgLoaded && (
            <div className="absolute inset-0 bg-stone-200 animate-pulse z-10 flex items-center justify-center">
              <svg className="w-8 h-8 text-stone-300 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          <motion.img
            src={template.imageUrl}
            alt={template.title}
            onLoad={() => setImgLoaded(true)}
            className={`h-full w-full object-cover will-change-transform origin-center transition-opacity duration-700 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            initial={{ scale: 1.05 }}
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
          
          {/* Hover Overlay: Darkens to make text readable */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
        </div>

        {/* Top Tags */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
           <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold text-black shadow-sm">
             {template.price === 0 ? '免费' : template.category}
           </span>
        </div>

        {/* Rating Badge (Visible on Hover) */}
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center gap-1 bg-white text-black px-2 py-1 rounded-full text-xs font-medium shadow-lg">
            <span className="text-yellow-500">★</span>
            <span>{template.rating}</span>
          </div>
        </div>

        {/* Preview Button (Center Overlay) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
           <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-2 rounded-full font-medium tracking-wide transform scale-90 group-hover:scale-100 transition-transform duration-300">
             查看详情
           </div>
        </div>

        {/* Bottom Info Layer */}
        <div className="absolute inset-x-0 bottom-0 p-5 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex justify-between items-end">
            <div className="space-y-0.5 text-white">
               <h3 className="text-lg font-serif font-medium text-shadow-sm leading-tight">
                 {template.title}
               </h3>
               <p className="text-[10px] font-medium tracking-wide uppercase opacity-80">
                 {template.author}
               </p>
            </div>
            
            <div className="text-right">
               <span className="block text-white font-bold text-base">
                ¥{template.price}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
