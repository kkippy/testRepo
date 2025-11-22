
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthPageProps {
  onLogin: () => void;
}

// --- Background Blobs Component ---
const FluidBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#fcfaf8]">
      {/* Blob 1: Warm Orange */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-orange-300/30 rounded-full blur-[100px] mix-blend-multiply"
      />
      
      {/* Blob 2: Soft Rose */}
      <motion.div
        animate={{
          x: [0, -100, 50, 0],
          y: [0, 100, -50, 0],
          scale: [1, 1.3, 0.8, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-rose-300/20 rounded-full blur-[120px] mix-blend-multiply"
      />

      {/* Blob 3: Muted Lavender (for depth) */}
      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [0, 50, -50, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute top-[20%] right-[20%] w-[50vw] h-[50vw] bg-purple-300/20 rounded-full blur-[100px] mix-blend-multiply"
      />
      
      {/* Noise Texture Overlay for "Film Grain" feel */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
    </div>
  );
};

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validation Logic
  const isFormValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    const isPasswordValid = password.length >= 6;
    const isNameValid = isLogin ? true : name.trim().length > 0;
    
    return isEmailValid && isPasswordValid && isNameValid;
  }, [email, password, name, isLogin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Testing Mode: Validation bypassed
    // if (!isFormValid) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center px-4 sm:px-6">
      
      {/* --- Full Screen Dynamic Background --- */}
      <FluidBackground />

      {/* --- Foreground: The Glass Portal --- */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[440px]"
      >
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-2xl shadow-orange-900/5 rounded-[40px] p-8 md:p-12 overflow-hidden relative">
          
          {/* Glossy Reflection */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-50 border border-white/50 rounded-2xl mb-6 shadow-sm rotate-3">
               <span className="text-orange-900 font-serif font-bold italic text-2xl">Z</span>
            </div>
            <div className="overflow-hidden h-10 mb-2">
              <AnimatePresence mode="wait">
                <motion.h1 
                  key={isLogin ? 'h-login' : 'h-signup'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-3xl font-serif font-bold text-gray-900"
                >
                  {isLogin ? '欢迎回来' : '加入 Zelpis'}
                </motion.h1>
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              <motion.p 
                key={isLogin ? 'p-login' : 'p-signup'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-gray-500 text-sm"
              >
                {isLogin ? '请输入您的账号信息以继续' : '开启您的数字美学之旅'}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
             <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-4 pr-2">
                   <label className="text-xs font-bold uppercase tracking-wider text-gray-400">电子邮箱</label>
                   {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                     <span className="text-xs text-red-500 font-medium">格式不正确</span>
                   )}
                </div>
                <div className="relative group">
                  <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={`w-full bg-white/50 border ${email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'border-red-300 focus:border-red-400' : 'border-gray-200/60 focus:border-orange-300'} text-gray-900 px-6 py-4 rounded-full outline-none focus:ring-4 focus:ring-orange-500/10 focus:bg-white transition-all duration-300 shadow-sm placeholder-gray-300`}
                    placeholder="hello@example.com"
                  />
                </div>
             </div>

             <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-4 pr-2">
                   <label className="text-xs font-bold uppercase tracking-wider text-gray-400">密码</label>
                   {password && password.length < 6 && (
                      <span className="text-xs text-orange-500 font-medium">至少6位</span>
                   )}
                </div>
                <div className="relative group">
                  <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-white/50 border border-gray-200/60 text-gray-900 px-6 py-4 rounded-full outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-300 focus:bg-white transition-all duration-300 shadow-sm placeholder-gray-300"
                    placeholder="••••••••"
                  />
                </div>
             </div>

             <AnimatePresence>
               {!isLogin && (
                 <motion.div
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   className="overflow-hidden"
                 >
                   <div className="space-y-1.5 pt-1">
                      <label className="ml-4 text-xs font-bold uppercase tracking-wider text-gray-400">昵称</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-white/50 border border-gray-200/60 text-gray-900 px-6 py-4 rounded-full outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-300 focus:bg-white transition-all duration-300 shadow-sm placeholder-gray-300"
                        placeholder="您的称呼"
                      />
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>

             <div className="pt-4">
               <motion.button
                 whileHover={!isLoading ? { scale: 1.02, translateY: -2 } : {}}
                 whileTap={!isLoading ? { scale: 0.96 } : {}}
                 disabled={isLoading}
                 type="submit"
                 className={`w-full h-14 rounded-full font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 bg-gray-900 text-white shadow-xl shadow-gray-900/20 hover:shadow-2xl hover:bg-black cursor-pointer ${
                   isLoading ? 'opacity-80' : ''
                 }`}
               >
                 {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                 ) : (
                   <>
                     <span>{isLogin ? '立即登录' : '注册账户'}</span>
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                   </>
                 )}
               </motion.button>
             </div>
          </form>

          {/* Toggle */}
          <div className="relative z-10 mt-8 text-center">
             <button 
               type="button"
               onClick={() => setIsLogin(!isLogin)}
               className="text-sm text-gray-500 hover:text-black transition-colors"
             >
               {isLogin ? "还没有账号？" : "已有账号？"}
               <span className="font-bold underline decoration-gray-300 underline-offset-4 hover:decoration-black transition-all ml-1">
                 {isLogin ? '立即注册' : '直接登录'}
               </span>
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
