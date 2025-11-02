'use client';

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', cancelText = 'Cancel', isLoading = false }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" />
      
      {/* Dialog */}
      <div className="relative w-full max-w-md bg-white/95 dark:bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-red-500/30 dark:border-red-400/50 dark:shadow-[0_0_60px_rgba(239,68,68,0.4),0_0_120px_rgba(220,38,38,0.3)] transform transition-all">
        {/* Icon */}
        <div className="flex items-center justify-center pt-8 pb-4">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center border-2 border-red-500/30 dark:border-red-400/50">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <h3 className="text-xl font-bold text-center mb-2 text-gray-900 dark:text-white">
            {title || 'Confirm Delete'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
            {message || 'Are you sure you want to delete this? This action cannot be undone.'}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 rounded-xl bg-white/70 dark:bg-black/50 backdrop-blur-lg border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-600 text-white font-semibold hover:scale-105 hover:shadow-lg dark:shadow-[0_0_30px_rgba(239,68,68,0.5),0_0_60px_rgba(220,38,38,0.3)] dark:hover:shadow-[0_0_40px_rgba(239,68,68,0.7),0_0_80px_rgba(220,38,38,0.5)] transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </span>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

