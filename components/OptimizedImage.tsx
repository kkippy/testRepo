import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  priority = false,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Skeleton Loading State */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-stone-800 animate-pulse z-10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] animate-shimmer" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        // @ts-ignore - fetchPriority is standard but types might be outdated
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${props.className || ''}`}
        {...props}
      />
    </div>
  );
};
