'use client';

import { Header } from '@/components/Header';
import { ThreeDCard } from '@/components/ThreeDCard';
import { ColorfulLights } from '@/components/ColorfulLights';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const { data: session } = useSession();
  const { theme, resolvedTheme } = useTheme();

  // Ensure dark class is applied to html element
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    const currentTheme = theme || 'light';
    
    if (currentTheme === 'dark') {
      htmlElement.classList.add('dark');
      htmlElement.setAttribute('data-theme', 'dark');
      htmlElement.style.backgroundColor = '#000000';
      if (bodyElement) bodyElement.style.backgroundColor = '#000000';
    } else {
      htmlElement.classList.remove('dark');
      htmlElement.setAttribute('data-theme', 'light');
      htmlElement.style.backgroundColor = '#ffffff';
      if (bodyElement) bodyElement.style.backgroundColor = '#ffffff';
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-black dark:to-gray-900 dark:text-white transition-all duration-500 relative overflow-hidden">
      <ColorfulLights />
      <Header />
      
      <main className="pt-16 sm:pt-20 pb-12 sm:pb-16 relative z-10">
        {/* Hero Section - Modern Design */}
        <section className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-8 sm:py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">
            {/* Left: Text Content - Redesigned */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8 order-1 lg:order-1">
              {/* Badge */}
              <div className="flex justify-center sm:justify-start">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/50 dark:border-blue-500/20 backdrop-blur-sm"
                >
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">Live & Active</span>
                </motion.div>
              </div>

              {/* Main Heading */}
              <div className="space-y-3 sm:space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight text-center sm:text-left mx-auto sm:mx-0 pb-[5%]  lg:pb-[0%] "
                >
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="inline sm:block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"
                  >
                    Shorten URL
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="inline sm:block text-gray-800 dark:text-white ml-1.5 sm:ml-0 sm:mt-1 lg:mt-2"
                  >
                    Instantly
                  </motion.span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                  className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg mx-auto sm:mx-0 text-center sm:text-left pb-[4%]  lg:pb-[0%] "
                >
                  Create short, memorable links that redirect instantly. Monitor clicks, track performance, and gain insights with real-time analytics—all in one beautiful dashboard.
                </motion.p>
              </div>
              
              {/* CTA Buttons - Redesigned */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                className="flex flex-row gap-2 sm:gap-3 lg:gap-4 pt-2 sm:pt-4 pb-[4%]  lg:pb-[0%] "
              >
                {session ? (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/dashboard"
                      className="group relative flex-1 sm:flex-none px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-500 dark:via-indigo-500 dark:to-purple-500 text-white font-bold text-xs sm:text-sm lg:text-base xl:text-lg hover:shadow-2xl shadow-lg transition-all duration-300 overflow-hidden block"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-1.5 lg:gap-2">
                        <span className="hidden sm:inline">Go to </span>Dashboard
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => signIn('google', { callbackUrl: '/dashboard', redirect: true })}
                    className="group relative flex-1 sm:flex-none px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-500 dark:via-indigo-500 dark:to-purple-500 text-white font-bold text-xs sm:text-sm lg:text-base xl:text-lg hover:shadow-2xl shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-1.5 lg:gap-2">
                      Get Started
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </motion.button>
                )}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="#features"
                    className="flex-1 sm:flex-none px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white font-semibold text-xs sm:text-sm lg:text-base xl:text-lg hover:bg-white dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 flex items-center justify-center gap-1 sm:gap-1.5 lg:gap-2"
                  >
                    Learn More
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Stats - Quick Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                className="flex items-center gap-3 sm:gap-4 lg:gap-6 pt-3 sm:pt-4 lg:absolute lg:w-[32%]"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  className="text-center flex-1"
                >
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400">1M+</div>
                  <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600 dark:text-gray-400">Links Created</div>
                </motion.div>
                <div className="w-px h-8 sm:h-10 lg:h-12 bg-gray-300 dark:bg-gray-700"></div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="text-center flex-1"
                >
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-600 dark:text-indigo-400">99.9%</div>
                  <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600 dark:text-gray-400">Uptime</div>
                </motion.div>
                <div className="w-px h-8 sm:h-10 lg:h-12 bg-gray-300 dark:bg-gray-700"></div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.9 }}
                  className="text-center flex-1"
                >
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600 dark:text-purple-400">24/7</div>
                  <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600 dark:text-gray-400">Support</div>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Right: 3D Preview Card - Enhanced */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="order-2 lg:order-2 mt-12 sm:mt-8 lg:mt-0 max-w-sm sm:max-w-none mx-auto lg:mx-0"
            >
              <ThreeDCard>
                <div className="space-y-2.5 sm:space-y-4 lg:space-y-5">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-2 sm:pb-3 lg:pb-4 border-b border-gray-700 dark:border-gray-700">
                    <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 min-w-0">
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50 shrink-0"></div>
                      <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white dark:text-white truncate">
                        Short Link Preview
                      </h3>
                    </div>
                    <div className="px-1.5 sm:px-2 lg:px-3 py-0.5 sm:py-1 rounded-lg bg-blue-900/30 dark:bg-blue-900/20 text-blue-300 dark:text-blue-400 text-[9px] sm:text-[10px] lg:text-xs font-semibold border border-blue-500/30 shrink-0">
                      Active
                    </div>
                  </div>
                  
                  {/* URL Fields */}
                  <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 border border-gray-700 dark:border-gray-700">
                      <div className="text-[9px] sm:text-[10px] lg:text-xs font-semibold text-gray-400 dark:text-gray-400 mb-1 sm:mb-1.5 lg:mb-2 uppercase tracking-wide">
                        Original URL
                      </div>
                      <div className="text-[10px] sm:text-xs lg:text-sm text-gray-200 dark:text-gray-300 truncate font-mono break-all">
                        https://example.com/very/long/url/path...
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
                      <div className="flex-1 min-w-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 border-2 border-blue-500/30 dark:border-blue-500/30">
                        <div className="text-[9px] sm:text-[10px] lg:text-xs font-semibold text-blue-300 dark:text-blue-400 mb-1 sm:mb-1.5 lg:mb-2 uppercase tracking-wide">
                          Short Link
                        </div>
                        <div className="text-xs sm:text-sm lg:text-base font-mono font-bold text-blue-200 dark:text-blue-300 truncate">
                          short.ly/abc123
                        </div>
                      </div>
                      <button className="px-2 sm:px-3 lg:px-4 xl:px-5 py-2 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-400 dark:hover:to-indigo-400 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2 lg:gap-3 pt-2 sm:pt-3 lg:pt-4 border-t border-gray-700 dark:border-gray-700">
                    <div className="text-center p-1.5 sm:p-2 lg:p-3 rounded-lg sm:rounded-xl bg-blue-900/30 dark:bg-blue-900/20 border border-blue-500/30 dark:border-blue-500/20">
                      <div className="text-sm sm:text-lg lg:text-xl font-bold text-blue-300 dark:text-blue-400">1.2K</div>
                      <div className="text-[9px] sm:text-[10px] lg:text-xs text-gray-400 dark:text-gray-400 mt-0.5 sm:mt-1">Clicks</div>
                    </div>
                    <div className="text-center p-1.5 sm:p-2 lg:p-3 rounded-lg sm:rounded-xl bg-green-900/30 dark:bg-green-900/20 border border-green-500/30 dark:border-green-500/20">
                      <div className="text-sm sm:text-lg lg:text-xl font-bold text-green-300 dark:text-green-400">98%</div>
                      <div className="text-[9px] sm:text-[10px] lg:text-xs text-gray-400 dark:text-gray-400 mt-0.5 sm:mt-1">Success</div>
                    </div>
                    <div className="text-center p-1.5 sm:p-2 lg:p-3 rounded-lg sm:rounded-xl bg-purple-900/30 dark:bg-purple-900/20 border border-purple-500/30 dark:border-purple-500/20">
                      <div className="text-sm sm:text-lg lg:text-xl font-bold text-purple-300 dark:text-purple-400">24h</div>
                      <div className="text-[9px] sm:text-[10px] lg:text-xs text-gray-400 dark:text-gray-400 mt-0.5 sm:mt-1">Active</div>
                    </div>
                  </div>
                </div>
              </ThreeDCard>
            </motion.div>
          </div>
        </section>
        
        {/* Features Section - Modern Grid */}
        <section id="features" className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-12 sm:py-16 lg:py-20">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/20 mb-3 sm:mb-4"
            >
              <span className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300">Features</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent px-2"
            >
              Powerful Features
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2"
            >
              Everything you need to shorten, track, and analyze your links
            </motion.p>
          </motion.div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-black/60 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-5 md:p-6 lg:p-8 border border-gray-700 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xl transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl sm:rounded-2xl lg:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 flex items-center justify-center mb-2 sm:mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm md:text-lg lg:text-xl font-bold mb-1 sm:mb-2 md:mb-3 text-white dark:text-white">
                  Lightning Fast
                </h3>
                <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-300 dark:text-gray-300 leading-relaxed">
                  Instant URL shortening with sub-millisecond redirect times. Optimized infrastructure ensures your links are always available.
                </p>
              </div>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-black/60 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-5 md:p-6 lg:p-8 border border-gray-700 dark:border-gray-700 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-2xl transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 to-cyan-900/20 dark:from-teal-900/10 dark:to-cyan-900/10 rounded-xl sm:rounded-2xl lg:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 dark:from-teal-400 dark:to-cyan-500 flex items-center justify-center mb-2 sm:mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm md:text-lg lg:text-xl font-bold mb-1 sm:mb-2 md:mb-3 text-white dark:text-white">
                  Real-Time Analytics
                </h3>
                <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-300 dark:text-gray-300 leading-relaxed">
                  Track clicks, geographic data, referrers, and device types. Monitor performance with beautiful, interactive charts.
                </p>
              </div>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-black/60 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-5 md:p-6 lg:p-8 border border-gray-700 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-2xl transition-all duration-500 col-span-2 md:col-span-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 dark:from-purple-900/10 dark:to-pink-900/10 rounded-xl sm:rounded-2xl lg:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-500 flex items-center justify-center mb-2 sm:mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm md:text-lg lg:text-xl font-bold mb-1 sm:mb-2 md:mb-3 text-white dark:text-white">
                  Secure & Private
                </h3>
                <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-300 dark:text-gray-300 leading-relaxed">
                  Custom expiration dates, password protection options, and private link management. Your data stays secure.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
