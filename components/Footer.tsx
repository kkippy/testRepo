import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Footer: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#fcfaf8] text-gray-600 pt-16 pb-8 font-sans border-t border-gray-100 mt-auto">
      <div className="max-w-[1800px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">ZElpis-Template</h2>
            <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
              创意工作者的高品质模版商店
              <br />
              让设计更简单，让开发更高效。
            </p>
            <div className="flex gap-4 pt-2">
              {[
                { 
                  name: 'GitHub', 
                  url: 'https://github.com',
                  path: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'
                },
                { 
                  name: 'Twitter', 
                  url: 'https://twitter.com',
                  path: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z'
                },
                { 
                  name: 'YouTube', 
                  url: 'https://youtube.com',
                  path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'
                }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600"
                >
                  <span className="sr-only">{social.name}</span>
                  <svg className="w-4 h-4 fill-current opacity-60" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">产品</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-orange-400 transition-colors">热门模版</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">最新发布</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">限时优惠</a></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">支持</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-orange-400 transition-colors">使用文档</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">常见问题</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">联系我们</a></li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
             <h3 className="font-semibold text-gray-900 mb-4">订阅更新</h3>
             <p className="text-xs text-gray-500 mb-4">获取最新的设计趋势和独家优惠。</p>
             <div className="flex gap-2">
               <input 
                 type="email" 
                 placeholder="your@email.com" 
                 className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-orange-300 transition-colors"
               />
               <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors">
                 订阅
               </button>
             </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <div>
            &copy; {new Date().getFullYear()} ZElpis-Template. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-600 transition-colors">隐私政策</a>
            <a href="#" className="hover:text-gray-600 transition-colors">服务条款</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Cookie 设置</a>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 bg-white border border-gray-100 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-gray-600 group-hover:text-orange-400 transition-colors"
            >
              <path d="M18 15l-6-6-6 6"/>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};
