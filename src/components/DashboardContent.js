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
      <Header />
      
      <main className="flex-1 overflow-hidden pt-16 sm:pt-20 pb-2">
        <div className="w-full px-3 sm:px-4 py-2 h-full flex flex-col">
          {/* Welcome Section - Compact */}
          <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 flex-shrink-0">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 text-gray-900 dark:text-white dark:drop-shadow-[0_0_20px_rgba(129,140,248,0.8)] truncate">
                Welcome back, {session?.user?.name || 'User'}!
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Manage your links and track analytics
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-500 dark:via-violet-500 dark:to-pink-500 text-white font-semibold flex items-center justify-center gap-2 hover:scale-105 hover:shadow-lg dark:shadow-[0_0_30px_rgba(129,140,248,0.7),0_0_60px_rgba(167,139,250,0.5)] dark:hover:shadow-[0_0_50px_rgba(129,140,248,1),0_0_100px_rgba(167,139,250,0.9),0_0_150px_rgba(236,72,153,0.7)] dark:border-2 dark:border-indigo-400/60 transition-all duration-300 cursor-pointer text-xs sm:text-sm"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Link
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
