'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-950 dark:to-black backdrop-blur-xl border-b border-gray-200 dark:border-blue-500/30 dark:shadow-[0_4px_20px_rgba(59,130,246,0.3)] transition-colors duration-500">
      <nav className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent dark:drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">
          URL Shortener
        </Link>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {status === 'loading' ? (
            <div className="w-4 h-4 border-2 border-indigo-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
          ) : session ? (
            <div className="flex items-center gap-4">
              {/* User Avatar - Clickable to Dashboard */}
              <Link href="/dashboard" className="cursor-pointer">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user?.name || 'User'}
                    width={'45px'}
                    height={'45px'}
                    className="relative p-0 rounded-full bg-white/70 dark:bg-black/50 backdrop-blur-lg border-2 border-indigo-500/20 dark:border-indigo-400/70 dark:shadow-[0_0_20px_rgba(129,140,248,0.6)] hover:scale-105 hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(129,140,248,0.9),0_0_60px_rgba(167,139,250,0.7)] dark:hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-300 min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"

                    // className="rounded-full object-cover border backdrop-blur-lg border-2 border-indigo-500/20 dark:border-indigo-400/70 hover:ring-2 hover:ring-indigo-400 dark:hover:ring-blue-400 transition-all"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 dark:from-blue-500 dark:to-blue-600 flex items-center justify-center text-white text-xs font-semibold border border-gray-300 dark:border-blue-500/50 hover:ring-2 hover:ring-indigo-400 dark:hover:ring-blue-400 transition-all">
                    {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </Link>

              {/* Sign Out Button */}
              <button
                onClick={() => signOut()}
                className="px-3 py-2 cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-500 dark:via-violet-500 dark:to-pink-500 text-white font-semibold hover:scale-105 hover:shadow-lg dark:shadow-[0_0_30px_rgba(129,140,248,0.7),0_0_60px_rgba(167,139,250,0.5)] dark:hover:shadow-[0_0_50px_rgba(129,140,248,1),0_0_100px_rgba(167,139,250,0.9)] transition-all duration-300"
                >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard', redirect: true })}
              className="px-3 py-2 cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-500 dark:via-violet-500 dark:to-pink-500 text-white font-semibold hover:scale-105 hover:shadow-lg dark:shadow-[0_0_30px_rgba(129,140,248,0.7),0_0_60px_rgba(167,139,250,0.5)] dark:hover:shadow-[0_0_50px_rgba(129,140,248,1),0_0_100px_rgba(167,139,250,0.9)] transition-all duration-300"
              >
              Sign In
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

