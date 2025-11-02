'use client';

import { Header } from '@/components/Header';
import { ThreeDCard } from '@/components/ThreeDCard';
import { ColorfulLights } from '@/components/ColorfulLights';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:bg-black dark:text-white transition-colors duration-500 relative overflow-hidden">
      <ColorfulLights />
      <Header />
      
      <main className="pt-20 pb-16 relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:via-violet-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent dark:neon-text-indigo">
                  Shorten URLs
                </span>
                <br />
                <span className="text-gray-900 dark:text-white dark:drop-shadow-[0_0_20px_rgba(129,140,248,0.8),0_0_40px_rgba(167,139,250,0.6),0_0_60px_rgba(45,212,191,0.4)]">
                  Instantly & Track Analytics
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Create short, memorable links that redirect instantly. 
                Monitor clicks, track performance, and gain insights with 
                real-time analytics—all in one beautiful dashboard.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {session ? (
                  <Link
                    href="/dashboard"
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-500 dark:via-violet-500 dark:to-pink-500 text-white font-semibold text-lg hover:scale-105 hover:shadow-lg dark:shadow-[0_0_30px_rgba(129,140,248,0.6),0_0_60px_rgba(167,139,250,0.4)] dark:hover:shadow-[0_0_50px_rgba(129,140,248,1),0_0_100px_rgba(167,139,250,0.8),0_0_150px_rgba(236,72,153,0.6)] dark:border-2 dark:border-indigo-400/50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => signIn('google', { callbackUrl: '/dashboard', redirect: true })}
                      className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-500 dark:via-violet-500 dark:to-pink-500 text-white font-semibold text-lg hover:scale-105 hover:shadow-lg dark:shadow-[0_0_40px_rgba(129,140,248,0.8),0_0_80px_rgba(167,139,250,0.6),0_0_120px_rgba(236,72,153,0.4)] dark:hover:shadow-[0_0_60px_rgba(129,140,248,1),0_0_120px_rgba(167,139,250,0.9),0_0_180px_rgba(236,72,153,0.7)] dark:border-2 dark:border-indigo-400/60 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-black cursor-pointer"
                    >
                      Get Started Free
                    </button>
                  </>
                )}
                <Link
                  href="#features"
                  className="px-8 py-4 rounded-xl bg-white/70 dark:bg-black/50 backdrop-blur-lg border-2 border-indigo-500/20 dark:border-indigo-400/80 text-gray-900 dark:text-white font-semibold text-lg hover:scale-105 hover:shadow-lg dark:shadow-[0_0_25px_rgba(129,140,248,0.5),0_0_50px_rgba(167,139,250,0.3)] dark:hover:shadow-[0_0_40px_rgba(129,140,248,0.8),0_0_80px_rgba(167,139,250,0.6),0_0_120px_rgba(45,212,191,0.4)] dark:hover:border-indigo-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-black"
                >
                  Learn More
                </Link>
              </div>
            </div>
            
            {/* Right: 3D Preview Card */}
            <div className="mt-8 lg:mt-0">
              <ThreeDCard>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white dark:drop-shadow-[0_0_15px_rgba(129,140,248,0.8),0_0_30px_rgba(167,139,250,0.5)]">
                      Short Link Preview
                    </h3>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/70 dark:bg-black/50 backdrop-blur-lg rounded-lg p-4 border-2 border-indigo-500/20 dark:border-indigo-400/70 dark:shadow-[0_0_25px_rgba(129,140,248,0.6),inset_0_0_20px_rgba(129,140,248,0.1)]">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Original URL
                      </div>
                      <div className="text-sm text-gray-900 dark:text-gray-200 truncate">
                        https://example.com/very/long/url/path...
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                    <div className="bg-white/70 dark:bg-black/50 backdrop-blur-lg rounded-lg p-4 border-2 border-indigo-500/30 dark:border-indigo-400/70 flex-1 dark:shadow-[0_0_30px_rgba(129,140,248,0.7),0_0_60px_rgba(167,139,250,0.5),inset_0_0_20px_rgba(129,140,248,0.15)]">
                      <div className="text-sm text-gray-500 dark:text-gray-200 mb-1">
                        Short Link
                      </div>
                      <div className="text-sm font-mono text-indigo-600 dark:neon-text-indigo">
                        short.ly/abc123
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white text-sm hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-all duration-300 dark:shadow-[0_0_25px_rgba(129,140,248,1),0_0_50px_rgba(167,139,250,0.8)] dark:hover:shadow-[0_0_35px_rgba(129,140,248,1),0_0_70px_rgba(167,139,250,1)] dark:border-2 dark:border-indigo-400/70 dark:hover:border-indigo-300">
                      Copy
                    </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-indigo-500/10 dark:border-indigo-500/30">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600 dark:neon-text-indigo">1.2K</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Clicks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-teal-500 dark:neon-text-teal">98%</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Success</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-violet-500 dark:neon-text-violet">24h</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Active</div>
                    </div>
                  </div>
                </div>
              </ThreeDCard>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white dark:drop-shadow-[0_0_30px_rgba(129,140,248,0.9),0_0_60px_rgba(167,139,250,0.7),0_0_90px_rgba(45,212,191,0.5)]">
            Powerful Features
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/70 dark:bg-black/50 backdrop-blur-lg rounded-2xl p-8 border-2 border-indigo-500/20 dark:border-indigo-400/70 dark:shadow-[0_0_40px_rgba(129,140,248,0.5),0_0_80px_rgba(167,139,250,0.3)] hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-[0_0_50px_rgba(129,140,248,0.8),0_0_100px_rgba(167,139,250,0.6),0_0_150px_rgba(236,72,153,0.4)] dark:hover:border-indigo-300 transition-[transform,box-shadow,border-color] duration-700 ease-out will-change-transform">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500 flex items-center justify-center mb-6 dark:shadow-[0_0_30px_rgba(129,140,248,1),0_0_60px_rgba(129,140,248,0.8),0_0_90px_rgba(167,139,250,0.6)]">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white dark:drop-shadow-[0_0_20px_rgba(129,140,248,0.9),0_0_40px_rgba(167,139,250,0.6)]">
                Lightning Fast
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Instant URL shortening with sub-millisecond redirect times. 
                Optimized infrastructure ensures your links are always available.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white/70 dark:bg-black/50 backdrop-blur-lg rounded-2xl p-8 border-2 border-teal-500/20 dark:border-teal-400/70 dark:shadow-[0_0_40px_rgba(45,212,191,0.5),0_0_80px_rgba(34,211,238,0.3)] hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-[0_0_50px_rgba(45,212,191,0.8),0_0_100px_rgba(34,211,238,0.6),0_0_150px_rgba(34,211,238,0.4)] dark:hover:border-teal-300 transition-[transform,box-shadow,border-color] duration-700 ease-out will-change-transform">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 dark:from-teal-400 dark:to-cyan-400 flex items-center justify-center mb-6 dark:shadow-[0_0_30px_rgba(45,212,191,1),0_0_60px_rgba(34,211,238,0.8),0_0_90px_rgba(34,211,238,0.6)]">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white dark:drop-shadow-[0_0_20px_rgba(45,212,191,0.9),0_0_40px_rgba(34,211,238,0.6)]">
                Real-Time Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track clicks, geographic data, referrers, and device types. 
                Monitor performance with beautiful, interactive charts.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white/70 dark:bg-black/50 backdrop-blur-lg rounded-2xl p-8 border-2 border-violet-500/20 dark:border-violet-400/70 dark:shadow-[0_0_40px_rgba(167,139,250,0.5),0_0_80px_rgba(236,72,153,0.3)] hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-[0_0_50px_rgba(167,139,250,0.8),0_0_100px_rgba(236,72,153,0.6),0_0_150px_rgba(236,72,153,0.4)] dark:hover:border-violet-300 transition-[transform,box-shadow,border-color] duration-700 ease-out will-change-transform">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 dark:from-violet-400 dark:to-pink-500 flex items-center justify-center mb-6 dark:shadow-[0_0_30px_rgba(167,139,250,1),0_0_60px_rgba(236,72,153,0.8),0_0_90px_rgba(236,72,153,0.6)]">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white dark:drop-shadow-[0_0_20px_rgba(167,139,250,0.9),0_0_40px_rgba(236,72,153,0.6)]">
                Secure & Private
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Custom expiration dates, password protection options, and 
                private link management. Your data stays secure.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
