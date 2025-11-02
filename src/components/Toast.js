'use client';

import { useEffect } from 'react';

export function Toast({ message, type = 'info', isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-close after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: {
      bg: 'bg-green-500/10 dark:bg-green-900/30',
      border: 'border-green-500/30 dark:border-green-400/50',
      text: 'text-green-600 dark:text-green-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    error: {
      bg: 'bg-red-500/10 dark:bg-red-900/30',
      border: 'border-red-500/30 dark:border-red-400/50',
      text: 'text-red-600 dark:text-red-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    info: {
      bg: 'bg-blue-500/10 dark:bg-blue-900/30',
      border: 'border-blue-500/30 dark:border-blue-400/50',
      text: 'text-blue-600 dark:text-blue-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const styles = typeStyles[type] || typeStyles.info;

  return (
    <div className="fixed top-20 right-4 z-50 transform transition-all duration-300 ease-in-out">
      <div
        className={`${styles.bg} ${styles.border} backdrop-blur-xl rounded-xl p-4 border-2 shadow-xl dark:shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center gap-3 min-w-[300px] max-w-md animate-in slide-in-from-top-5`}
      >
        <div className={styles.text}>{styles.icon}</div>
        <p className={`flex-1 ${styles.text} font-medium`}>{message}</p>
        <button
          onClick={onClose}
          className={`${styles.text} hover:opacity-70 transition-opacity cursor-pointer`}
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

