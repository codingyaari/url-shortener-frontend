'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createLink, updateLink } from '@/store/slices/linksSlice';

export function LinkModal({ isOpen, onClose, onSuccess, editLink = null }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    destinationUrl: '',
    customSlug: '',
    title: '',
    expiry: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (isOpen && editLink) {
      // Parse expiry date if it exists
      let expiryDate = null;
      if (editLink.expiry) {
        try {
          const date = new Date(editLink.expiry);
          if (!isNaN(date.getTime())) {
            expiryDate = date;
          }
        } catch (e) {
          // Invalid date, leave null
        }
      }
      
      setFormData({
        destinationUrl: editLink.destinationUrl || editLink.destination || '',
        customSlug: editLink.slug || '',
        title: editLink.title || '',
        expiry: expiryDate,
      });
    } else if (isOpen && !editLink) {
      // Reset form for new link
      setFormData({
        destinationUrl: '',
        customSlug: '',
        title: '',
        expiry: null,
      });
    }
    setError(null);
    setSuccess(null);
  }, [isOpen, editLink]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate slug - no spaces allowed
      if (formData.customSlug && /\s/.test(formData.customSlug)) {
        throw new Error('Slug cannot contain spaces. Please remove all spaces.');
      }

      // Format expiry date if selected
      let expiryDate = null;
      if (formData.expiry) {
        // Set to end of day in UTC
        const date = new Date(formData.expiry);
        date.setHours(23, 59, 59, 999);
        expiryDate = date.toISOString();
      }

      // Prepare link data for API
      const linkData = {
        destinationUrl: formData.destinationUrl,
        slug: formData.customSlug || undefined,
        title: formData.title || undefined,
        expiry: expiryDate || undefined,
      };

      let result;
      if (editLink) {
        // Update existing link
        result = await dispatch(updateLink({ id: editLink?._id, ...linkData }));
      } else {
        // Create new link
        result = await dispatch(createLink(linkData));
      }

      // Check if the action was successful
      if (createLink.fulfilled.match(result) || updateLink.fulfilled.match(result)) {
        setSuccess(editLink ? 'Link updated successfully!' : 'Link created successfully!');
        
        // Trigger refresh callback
        if (onSuccess) {
          onSuccess();
        }

        // Close modal after short delay
        setTimeout(() => {
          onClose();
        }, 100);

          // Reset form
          setFormData({
            destinationUrl: '',
            customSlug: '',
            title: '',
            expiry: null,
          });
          
      } else if (createLink.rejected.match(result) || updateLink.rejected.match(result)) {
        // Handle error from Redux action
        // result.payload is the error message string
        const errorMessage = result.payload || 'An error occurred';
        console.log('errorMessage::::', errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm" 
          />
          
          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-indigo-500/30 dark:border-indigo-400/50 dark:shadow-[0_0_40px_rgba(129,140,248,0.4)] max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b-2 border-indigo-500/20 dark:border-indigo-400/40 px-6 py-5 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 dark:from-indigo-400 dark:to-violet-500 flex items-center justify-center shadow-lg dark:shadow-[0_0_15px_rgba(129,140,248,0.4)]">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={editLink ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 4v16m8-8H4"} />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editLink ? 'Edit Link' : 'Create Short Link'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer hover:scale-110"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Destination URL */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label htmlFor="destinationUrl" className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
              <svg className="w-4 h-4 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Destination URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="destinationUrl"
              required
              value={formData.destinationUrl}
              onChange={(e) => setFormData({ ...formData, destinationUrl: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-2 border-indigo-500/20 dark:border-indigo-400/50 dark:shadow-[0_0_10px_rgba(129,140,248,0.2)] focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:text-white dark:focus:shadow-[0_0_20px_rgba(129,140,248,0.5)] focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
              placeholder="https://example.com/very/long/url"
            />
          </motion.div>

          {/* Two Column Layout */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 gap-5"
          >
            {/* Custom Slug */}
            <div>
              <label htmlFor="customSlug" className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                Custom Slug (optional)
              </label>
              <input
                type="text"
                id="customSlug"
                value={formData.customSlug}
                onChange={(e) => {
                  // Remove spaces and trim
                  const value = e.target.value.replace(/\s/g, '');
                  setFormData({ ...formData, customSlug: value });
                }}
                className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-2 border-indigo-500/20 dark:border-indigo-400/50 dark:shadow-[0_0_10px_rgba(129,140,248,0.2)] focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:text-white dark:focus:shadow-[0_0_20px_rgba(129,140,248,0.5)] focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
                placeholder="my-custom-link"
                pattern="[a-zA-Z0-9-_]+"
                title="Spaces are not allowed. Only alphanumeric characters, hyphens, and underscores allowed"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Leave empty for auto-generated. Spaces are not allowed.
              </p>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10m-7 4h7" />
                </svg>
                Title (optional)
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-2 border-indigo-500/20 dark:border-indigo-400/50 dark:shadow-[0_0_10px_rgba(129,140,248,0.2)] focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:text-white dark:focus:shadow-[0_0_20px_rgba(129,140,248,0.5)] focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
                placeholder="My Awesome Link"
              />
            </div>
          </motion.div>

          {/* Expiry Date */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label htmlFor="expiry" className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              <svg className="w-4 h-4 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Expiry Date <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <DatePicker
              selected={formData.expiry}
              onChange={(date) => setFormData({ ...formData, expiry: date })}
              minDate={new Date()}
              dateFormat="MMMM d, yyyy"
              isClearable
              placeholderText="Select expiry date (optional)"
              showPopperArrow={false}
              className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-2 border-indigo-500/20 dark:border-indigo-400/50 dark:shadow-[0_0_10px_rgba(129,140,248,0.2)] focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:text-white dark:focus:shadow-[0_0_20px_rgba(129,140,248,0.5)] focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
              wrapperClassName="w-full"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Leave empty for links that never expire. Past dates cannot be selected.
            </p>
          </motion.div>

          {/* Error/Success Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-xl bg-red-500/10 border-2 border-red-500/30 text-red-600 dark:text-red-400 flex items-center gap-2"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-xl bg-green-500/10 border-2 border-green-500/30 text-green-600 dark:text-green-400 flex items-center gap-2"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3 pt-2"
          >
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-2 border-gray-300/60 dark:border-gray-600/60 text-gray-900 dark:text-white font-semibold hover:scale-105 hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-all duration-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-500 dark:via-violet-500 dark:to-pink-500 text-white font-semibold hover:scale-105 hover:shadow-lg dark:shadow-[0_0_20px_rgba(129,140,248,0.4)] dark:hover:shadow-[0_0_30px_rgba(129,140,248,0.6)] transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{editLink ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editLink ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"} />
                  </svg>
                  <span>{editLink ? 'Update Link' : 'Create Link'}</span>
                </>
              )}
            </button>
          </motion.div>
        </form>
      </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


