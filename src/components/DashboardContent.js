'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from './Header';
import { LinkModal } from './LinkModal';
import { LinksList } from './LinksList';
import { OverviewStats } from './OverviewStats';
import { ConfirmDialog } from './ConfirmDialog';
import { useToast } from './ToastContainer';
import { fetchLinks, deleteLink } from '@/store/slices/linksSlice';
import { ColorfulLights } from './ColorfulLights';

export function DashboardContent() {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editLink, setEditLink] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();
  
  // Get links from Redux store
  const { links, loading } = useSelector((state) => state.links);
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
  
  useEffect(() => {
    // Only fetch links if we don't have any data in Redux store (and not already loading)
    // Redux Persist will restore data from localStorage on mount, so we check if data exists
    if (links?.length === 0 && !loading) {
      console.log('fetching links::::', links?.length, loading);
      dispatch(fetchLinks());
    }
  }, [links?.length ]);

  const handleOpenModal = (link = null) => {
    setEditLink(link);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditLink(null);
  };

  const handleSuccess = () => {
    // Refresh links after create/update
    // Redux will automatically update from createLink/updateLink actions
    // But we can optionally refresh to get latest data
    // dispatch(fetchLinks());
  };

  const handleDeleteClick = (link) => {
    setLinkToDelete(link);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!linkToDelete) return;

    setIsDeleting(true);
    try {
      const result = await dispatch(deleteLink(linkToDelete._id));
      
      if (deleteLink.fulfilled.match(result)) {
        // Link deleted successfully - Redux will automatically update
        showToast('Link deleted successfully!', 'success');
        setIsDeleteDialogOpen(false);
        setLinkToDelete(null);
      } else if (deleteLink.rejected.match(result)) {
        // Handle error from Redux action
        const errorMessage = result.payload || 'Failed to delete link';
        showToast(errorMessage, 'error');
      }
    } catch (error) {
      console.error('Failed to delete link:', error);
      showToast(error.message || 'Failed to delete link', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setLinkToDelete(null);
    setIsDeleting(false);
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-black dark:text-white transition-colors duration-500 flex flex-col">
            <ColorfulLights />
      <Header />
      
      <main className="flex-1 overflow-hidden pt-16 sm:pt-20 pb-2">
        <div className="w-full px-3 sm:px-4 py-2 h-full flex flex-col">
          {/* Welcome Section - Redesigned */}
          <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 flex-shrink-0">
            {/* Welcome Card with Icons */}
            <div className="flex-1 min-w-0 bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border-2 border-indigo-200/60 dark:border-indigo-500/40 shadow-lg dark:shadow-[0_0_20px_rgba(129,140,248,0.2)] hover:shadow-xl dark:hover:shadow-[0_0_25px_rgba(129,140,248,0.3)] transition-all duration-300">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* User Icon with Gradient Background */}
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-pink-500 flex items-center justify-center shadow-md dark:shadow-[0_0_15px_rgba(129,140,248,0.4)]">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                    <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white dark:drop-shadow-[0_0_10px_rgba(129,140,248,0.5)] truncate">
                      Welcome back, <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400 bg-clip-text text-transparent">{session?.user?.name || 'User'}</span>!
                    </h1>
                    {/* Sparkle Icon */}
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 dark:text-indigo-400 flex-shrink-0 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">
                      Manage your links and track analytics
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="group relative w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-500 dark:via-violet-500 dark:to-pink-500 text-white font-semibold flex items-center justify-center gap-2.5 overflow-hidden transition-all duration-500 ease-out cursor-pointer text-xs sm:text-sm shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/20 hover:scale-[1.05] hover:shadow-xl hover:shadow-indigo-500/40 dark:hover:shadow-[0_0_15px_rgba(129,140,248,0.3)] dark:hover:scale-[1.05] active:scale-[0.98]"
            >
              {/* Animated background gradient overlay on hover */}
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></span>
              
              {/* Glowing effect for dark mode - Reduced */}
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-400/0 via-violet-300/0 to-pink-400/0 dark:group-hover:from-indigo-400/10 dark:group-hover:via-violet-300/10 dark:group-hover:to-pink-400/10 blur-xl transition-all duration-500 opacity-0 dark:group-hover:opacity-100"></span>
              
              {/* Icon with rotation animation */}
              <svg 
                className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 transition-all duration-300 group-hover:rotate-90 group-hover:scale-110" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              
              {/* Text with slight movement on hover */}
              <span className="relative z-10 transition-all duration-300 group-hover:tracking-wide">
                Create Links
              </span>
              
              {/* Border glow effect for dark mode - Reduced */}
              <span className="absolute inset-0 rounded-2xl border-2 border-transparent dark:group-hover:border-indigo-400/20 transition-all duration-500"></span>
            </button>
          </div>

          {/* Overview Stats - Centered after welcome */}
          {!loading && links.length > 0 && (
            <div className="mb-3 sm:mb-4 -mt-1 sm:-mt-2 flex justify-center flex-shrink-0 overflow-x-auto pb-2">
              <OverviewStats />
            </div>
          )}

          {/* Main Dashboard Grid */}
          <div className="flex-1 min-h-0">
            {/* Links Grid - Full width */}
            <div className="flex flex-col min-h-0 h-full">
              {loading ? (
                <div className="bg-white/80 dark:bg-blue-950/60 backdrop-blur-xl rounded-2xl p-12 border-2 border-indigo-500/20 dark:border-blue-500/50 dark:shadow-[0_0_30px_rgba(59,130,246,0.4),0_0_60px_rgba(37,99,235,0.2)]">
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-indigo-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                </div>
              ) : links.length === 0 ? (
                <div className="bg-white/80 dark:bg-blue-950/60 backdrop-blur-xl rounded-2xl p-12 border-2 border-indigo-500/20 dark:border-blue-500/50 dark:shadow-[0_0_30px_rgba(59,130,246,0.4),0_0_60px_rgba(37,99,235,0.2)] text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    No links yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Create your first short link to get started
                  </p>
                  <button
                    onClick={() => handleOpenModal()}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-500 dark:via-violet-500 dark:to-pink-500 text-white font-semibold hover:scale-105 hover:shadow-lg dark:shadow-[0_0_30px_rgba(129,140,248,0.7),0_0_60px_rgba(167,139,250,0.5)] dark:hover:shadow-[0_0_50px_rgba(129,140,248,1),0_0_100px_rgba(167,139,250,0.9)] transition-all duration-300 cursor-pointer"
                  >
                    Create Your First Link
                  </button>
                </div>
              ) : (
                <div className="flex flex-col h-full min-h-0">
                 
                  <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 -mr-1 sm:-mr-2 min-h-0">
                    <div className="pr-1 sm:pr-2 pb-2">
                      <LinksList
                        onEdit={handleOpenModal}
                        onDelete={handleDeleteClick}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Link Modal */}
      <LinkModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        editLink={editLink}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Link"
        message={`Are you sure you want to delete "${linkToDelete?.title || 'this link'}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
}
