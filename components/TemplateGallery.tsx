import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Template } from '../types';

interface TemplateGalleryProps {
  template: Template;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ template }) => {
  const [selectedMedia, setSelectedMedia] = useState<{ type: 'video' | 'image'; url: string; caption?: string } | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Initialize with video or main image
  useEffect(() => {
    if (template.demoVideoUrl) {
      setSelectedMedia({ type: 'video', url: template.demoVideoUrl, caption: '演示视频' });
    } else {
      setSelectedMedia({ type: 'image', url: template.imageUrl, caption: '主预览图' });
    }
  }, [template]);

  const totalItems = (template.demoVideoUrl ? 1 : 0) + (template.screenshots?.length || 0);
  const isScrollable = totalItems > 5;

  useEffect(() => {
    const container = scrollContainerRef.current;
    
    const handleWheel = (e: WheelEvent) => {
      // Only handle if content is actually scrollable horizontally
      if (container  && e.deltaY !== 0) {
        // Prevent default vertical scrolling
        e.preventDefault();
        // Normalize scroll speed for different browsers (Firefox uses deltaMode 1)
        // const delta = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY;
        // container.scrollLeft += delta;
        container.scrollLeft += e.deltaY;
      }
    };

    // if (container && isScrollable) {
    //   container.addEventListener('wheel', handleWheel, { passive: false });
    // }
    
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [isScrollable]);

  if (!selectedMedia) return null;

  return (
    <div className="w-full space-y-6">
      {/* Main Preview Area */}
      <div className="w-full aspect-video bg-gray-100 rounded-2xl overflow-hidden shadow-sm border border-gray-200 relative group">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMedia.url}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {selectedMedia.type === 'video' ? (
              <video
                src={selectedMedia.url}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={selectedMedia.url}
                alt={selectedMedia.caption}
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Caption Overlay */}
        {selectedMedia.caption && (
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-medium">
                {selectedMedia.caption}
            </div>
        )}
      </div>

      {/* Thumbnails Row */}
      <div 
        ref={scrollContainerRef}
        className={isScrollable 
          ? "flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300"
          : "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
        }
      >
        {/* Main Video Thumbnail */}
        {template.demoVideoUrl && (
            <button
            onClick={() => setSelectedMedia({ type: 'video', url: template.demoVideoUrl!, caption: '演示视频' })}
            className={`group flex flex-col gap-2 text-left transition-all ${selectedMedia.url === template.demoVideoUrl ? 'opacity-100' : 'opacity-60 hover:opacity-100'} ${isScrollable ? 'flex-shrink-0 w-60' : ''}`}
            >
            <div className={`aspect-video rounded-lg overflow-hidden border-2 ${selectedMedia.url === template.demoVideoUrl ? 'border-black' : 'border-transparent group-hover:border-gray-300'} relative`}>
                <video src={template.demoVideoUrl} className="w-full h-full object-cover pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </div>
                </div>
            </div>
            <span className="text-xs font-medium text-gray-900 truncate pl-1">演示视频</span>
            </button>
        )}

        {/* Screenshot Thumbnails */}
        {template.screenshots && template.screenshots.map((shot, index) => (
        <button
            key={index}
            onClick={() => setSelectedMedia({ type: 'image', url: shot.url, caption: shot.caption })}
            className={`group flex flex-col gap-2 text-left transition-all ${selectedMedia.url === shot.url ? 'opacity-100' : 'opacity-60 hover:opacity-100'} ${isScrollable ? 'flex-shrink-0 w-60' : ''}`}
        >
            <div className={`aspect-video rounded-lg overflow-hidden border-2 ${selectedMedia.url === shot.url ? 'border-black' : 'border-transparent group-hover:border-gray-300'}`}>
            <img src={shot.url} alt={shot.caption} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-medium text-gray-900 truncate pl-1">{shot.caption || `预览图 ${index + 1}`}</span>
        </button>
        ))}
      </div>
    </div>
  );
};
