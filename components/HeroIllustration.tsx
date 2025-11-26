import React from 'react';
import { motion } from 'framer-motion';

export const HeroIllustration = () => (
  <div className="relative w-full h-full min-h-[400px] flex items-center justify-center perspective-1000 pointer-events-none select-none">
    {/* Ambient Gradients - Warm Tones */}
    <motion.div 
      initial={{ opacity: 0.3, scale: 1 }}
      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 8, repeat: Infinity }}
      className="absolute top-1/4 right-1/4 w-64 h-64 bg-orange-200 rounded-full blur-3xl mix-blend-multiply" 
    />
    <motion.div 
      initial={{ opacity: 0.3, scale: 1 }}
      animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 10, repeat: Infinity, delay: 1 }}
      className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-rose-100 rounded-full blur-3xl mix-blend-multiply" 
    />

    {/* Floating Abstract UI Elements - With Initial States to prevent Pop-in */}
    <motion.div
      initial={{ rotateX: 20, rotateY: -20, y: 0, opacity: 1 }}
      animate={{ 
        rotateX: [20, 15, 20], 
        rotateY: [-20, -10, -20],
        y: [0, -20, 0]
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="relative z-10 w-56 aspect-[3/4] bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl p-4 flex flex-col gap-4"
    >
      <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
         <div className="absolute inset-0 bg-gradient-to-tr from-orange-50 to-orange-100" />
      </div>
      <div className="space-y-2">
        <div className="w-3/4 h-2 bg-gray-200 rounded-full" />
        <div className="w-1/2 h-2 bg-gray-200 rounded-full" />
        <div className="w-full h-2 bg-gray-100 rounded-full mt-4" />
      </div>
      <div className="mt-auto flex justify-between items-center">
         <div className="w-6 h-6 rounded-full bg-gray-200" />
         <div className="w-12 h-4 rounded-full bg-black/5" />
      </div>
    </motion.div>

    {/* Background Card */}
    <motion.div
      initial={{ rotateX: 20, rotateY: -20, x: 40, y: 40, z: -50, opacity: 1 }}
      animate={{ 
        y: [40, 60, 40],
        rotateY: [-20, -25, -20]
      }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      className="absolute z-0 w-56 aspect-[3/4] bg-[#fafafa]/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl"
    />
    
    {/* Floating Sphere - Warm */}
    <motion.div
      initial={{ y: -10, opacity: 1 }}
      animate={{ y: [-10, 10, -10] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -left-4 top-1/3 w-16 h-16 bg-gradient-to-br from-orange-50 to-white rounded-full shadow-lg border border-white/50 backdrop-blur-sm z-20"
    />
  </div>
);
