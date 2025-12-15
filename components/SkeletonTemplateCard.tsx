import React from 'react';

export const SkeletonTemplateCard: React.FC = () => {
  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[16/10] animate-pulse border border-gray-200">
        {/* Image Placeholder */}
        <div className="absolute inset-0 bg-gray-200/50" />
        
        {/* Top Tag Placeholder */}
        <div className="absolute top-4 left-4 w-16 h-6 bg-gray-300/50 rounded-full" />
        
        {/* Bottom Info Placeholder */}
        <div className="absolute inset-x-0 bottom-0 p-5">
           <div className="flex justify-between items-end">
             <div className="space-y-3">
                <div className="w-32 h-6 bg-gray-300/50 rounded" />
                <div className="w-20 h-3 bg-gray-300/50 rounded" />
             </div>
             <div className="w-12 h-6 bg-gray-300/50 rounded" />
           </div>
        </div>
      </div>
    </div>
  );
};
