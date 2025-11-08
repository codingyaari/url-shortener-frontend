'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { ThemeToggle } from './ThemeToggle';
import { AnimatedThemeToggler } from './ui/animated-theme-toggler';

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glassmorphism Background with Gradient Border */}
      <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-md border-b border-gray-200/30 dark:border-indigo-500/10">
        {/* Animated gradient border effect */}
        <div className="absolute inset-0 border-b border-transparent bg-gradient-to-r from-transparent via-indigo-500/20 dark:via-indigo-500/30 to-transparent opacity-0 dark:opacity-100 transition-opacity duration-500" />
        {/* Subtle glow effect */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/50 dark:via-indigo-500/40 to-transparent" />
      </div>

      {/* Content */}
      <nav className="relative container mx-auto px-2 sm:px-5 lg:px-6 py-2.5 sm:py-3 flex items-center justify-between">
        {/* Logo Section */}
        <Link 
          href="/" 
          className="group flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0 flex-shrink"
        >
          {/* Logo Icon */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 rounded-xl blur-md opacity-60 dark:opacity-40 group-hover:opacity-80 dark:group-hover:opacity-60 transition-opacity duration-300" />
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(129,140,248,0.5)] group-hover:scale-110 transition-transform duration-300">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
          </div>
          
          {/* Logo Text */}
          <div className="flex flex-col min-w-0">
            <span className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent dark:drop-shadow-[0_0_15px_rgba(59,130,246,0.8)] group-hover:scale-105 transition-transform duration-300 truncate">
              URL Shortener
            </span>
            <span className="text-[9px] sm:text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:block">
              Short. Track. Analyze.
            </span>
          </div>
        </Link>
        
        {/* Right Side - Actions */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
          {/* Theme Toggle */}
          <AnimatedThemeToggler />
          {/* <ThemeToggle /> */}
          
          {/* Auth Section */}
          {status === 'loading' ? (
            <div className="w-8 h-8 border-2 border-indigo-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
          ) : session ? (
            <div className="flex items-center gap-3 sm:gap-4">
              {/* User Profile with Dropdown Style */}
              <Link 
                href="/dashboard" 
                className="group flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl bg-white/60 dark:bg-black/40 backdrop-blur-lg border border-gray-200/50 dark:border-indigo-500/30 hover:border-indigo-400 dark:hover:border-indigo-400/50 hover:bg-white/80 dark:hover:bg-black/60 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(129,140,248,0.4)] transition-all duration-300 cursor-pointer"
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {session.user?.image ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full blur-md opacity-50 dark:opacity-30 group-hover:opacity-70 dark:group-hover:opacity-50 transition-opacity duration-300" />
                      <img
                        src={session.user.image}
                        alt={session.user?.name || 'User'}
                        width={40}
                        height={40}
                        className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white dark:border-indigo-500/50 shadow-md group-hover:scale-110 transition-transform duration-300"
                      />
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full blur-md opacity-50 dark:opacity-30 group-hover:opacity-70 dark:group-hover:opacity-50 transition-opacity duration-300" />
                      <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 flex items-center justify-center text-white text-xs sm:text-sm font-bold border-2 border-white dark:border-indigo-500/50 shadow-md group-hover:scale-110 transition-transform duration-300">
                        {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    </>
                  )}
                </div>
                
                {/* User Name - Hidden on mobile */}
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {session.user?.name?.split(' ')[0] || 'User'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Dashboard
                  </span>
                </div>
              </Link>

              {/* Sign Out Button */}
              <button
                onClick={() => signOut()}
                className="group relative px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 dark:from-indigo-500 dark:via-violet-500 dark:to-pink-500 text-white font-semibold text-xs sm:text-sm hover:scale-105 hover:shadow-xl dark:shadow-[0_0_30px_rgba(129,140,248,0.7),0_0_60px_rgba(167,139,250,0.5)] dark:hover:shadow-[0_0_50px_rgba(129,140,248,1),0_0_100px_rgba(167,139,250,0.9)] transition-all duration-300 overflow-hidden cursor-pointer"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Sign Out</span>
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard', redirect: true })}
              className="group relative px-2.5 sm:px-3 lg:px-5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 dark:from-indigo-500 dark:via-violet-500 dark:to-pink-500 text-white font-semibold text-xs sm:text-sm hover:scale-105 hover:shadow-xl dark:shadow-[0_0_30px_rgba(129,140,248,0.7),0_0_60px_rgba(167,139,250,0.5)] dark:hover:shadow-[0_0_50px_rgba(129,140,248,1),0_0_100px_rgba(167,139,250,0.9)] transition-all duration-300 overflow-hidden cursor-pointer"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative flex items-center gap-1.5 sm:gap-2">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Sign In</span>
              </span>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

