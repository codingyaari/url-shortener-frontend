'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white/95 dark:bg-black/90 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-indigo-500/30 dark:border-indigo-400/70 dark:shadow-[0_0_60px_rgba(129,140,248,0.6),0_0_120px_rgba(167,139,250,0.4)] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-black/90 backdrop-blur-xl border-b-2 border-indigo-500/20 dark:border-indigo-400/50 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {editLink ? 'Edit Link' : 'Create Short Link'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
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
          <div>
            <label htmlFor="destinationUrl" className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
              Destination URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="destinationUrl"
              required
              value={formData.destinationUrl}
              onChange={(e) => setFormData({ ...formData, destinationUrl: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-black/60 backdrop-blur-lg border-2 border-indigo-500/20 dark:border-indigo-400/60 dark:shadow-[0_0_15px_rgba(129,140,248,0.3)] focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:text-white dark:focus:shadow-[0_0_25px_rgba(129,140,248,0.8)] transition-all"
              placeholder="https://example.com/very/long/url"
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Custom Slug */}
            <div>
              <label htmlFor="customSlug" className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
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
                className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-black/60 backdrop-blur-lg border-2 border-indigo-500/20 dark:border-indigo-400/60 dark:shadow-[0_0_15px_rgba(129,140,248,0.3)] focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:text-white dark:focus:shadow-[0_0_25px_rgba(129,140,248,0.8)] transition-all"
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
              <label htmlFor="title" className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Title (optional)
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-black/60 backdrop-blur-lg border-2 border-indigo-500/20 dark:border-indigo-400/60 dark:shadow-[0_0_15px_rgba(129,140,248,0.3)] focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:text-white dark:focus:shadow-[0_0_25px_rgba(129,140,248,0.8)] transition-all"
                placeholder="My Awesome Link"
              />
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label htmlFor="expiry" className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
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
              className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-black/60 backdrop-blur-lg border-2 border-indigo-500/20 dark:border-indigo-400/60 dark:shadow-[0_0_15px_rgba(129,140,248,0.3)] focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:text-white dark:focus:shadow-[0_0_25px_rgba(129,140,248,0.8)] transition-all"
              wrapperClassName="w-full"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Leave empty for links that never expire. Past dates cannot be selected.
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border-2 border-red-500/30 text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-green-500/10 border-2 border-green-500/30 text-green-600 dark:text-green-400">
              {success}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl bg-white/70 dark:bg-black/50 backdrop-blur-lg border-2 border-indigo-500/20 dark:border-indigo-400/70 text-gray-900 dark:text-white font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-500 dark:via-violet-500 dark:to-pink-500 text-white font-semibold hover:scale-105 hover:shadow-lg dark:shadow-[0_0_30px_rgba(129,140,248,0.7),0_0_60px_rgba(167,139,250,0.5)] dark:hover:shadow-[0_0_50px_rgba(129,140,248,1),0_0_100px_rgba(167,139,250,0.9),0_0_150px_rgba(236,72,153,0.7)] dark:border-2 dark:border-indigo-400/60 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {editLink ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                editLink ? 'Update Link' : 'Create Link'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


