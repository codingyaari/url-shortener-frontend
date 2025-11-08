
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';

// Async thunks for API calls
export const fetchLinks = createAsyncThunk(
  'links/fetchLinks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/links');
      return response.data;
    } catch (error) {
      // Error message is already extracted by axios interceptor
      return rejectWithValue(
        error.message || 'Failed to fetch links'
      );
    }
  }
);


export const createLink = createAsyncThunk(
  'links/createLink',
  async (linkData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/links', linkData);
      console.log('response in createLink::::', response.data);
      
      // Response interceptor handles success: false, so if we get here, success is true
      // But double-check just in case
      if (response.data?.success === false) {
        return rejectWithValue(
          response.data.message || 'Failed to create link'
        );
      }
      
      return response.data;
    } catch (error) {
      console.log('error in createLink::::', error);
      // Error message is already extracted by axios interceptor
      return rejectWithValue(
        error.message || 'Failed to create link'
      );
    }
  }
);

export const updateLink = createAsyncThunk(
  'links/updateLink',
  async ({ id, ...linkData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/links/${id}`, linkData);
      
      // Response interceptor handles success: false, so if we get here, success is true
      // But double-check just in case
      if (response.data?.success === false) {
        return rejectWithValue(
          response.data.message || 'Failed to update link'
        );
      }
      
      return response.data;
    } catch (error) {
      // Error message is already extracted by axios interceptor
      return rejectWithValue(
        error.message || 'Failed to update link'
      );
    }
  }
);

export const deleteLink = createAsyncThunk(
  'links/deleteLink',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/links/${id}`);
      
      // Check for success: false in response (if backend returns response body)
      if (response.data?.success === false) {
        return rejectWithValue(
          response.data.message || 'Failed to delete link'
        );
      }
      
      return id;
    } catch (error) {
      // Error message is already extracted by axios interceptor
      return rejectWithValue(
        error.message || 'Failed to delete link'
      );
    }
  }
);

export const fetchLinkBySlug = createAsyncThunk(
  'links/fetchLinkBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/links/slug/${slug}`);
      
      // Check for success: false in response
      if (response.data?.success === false) {
        return rejectWithValue(
          response.data.message || 'Failed to fetch link'
        );
      }
      
      return response.data;
    } catch (error) {
      // Error message is already extracted by axios interceptor
      return rejectWithValue(
        error.message || 'Failed to fetch link'
      );
    }
  }
);

const linksSlice = createSlice({
  name: 'links',
  initialState: {
    links: [],
    currentLink: null,
    loading: false,
    error: null,
    total: 0,
    active: 0,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentLink: (state) => {
      state.currentLink = null;
    },
    updateLinkInList: (state, action) => {
      const index = state.links.findIndex(
        (link) => link.id === action.payload.id || link.slug === action.payload.slug
      );
      if (index !== -1) {
        state.links[index] = { ...state.links[index], ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch links
    builder
      .addCase(fetchLinks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLinks.fulfilled, (state, action) => {
        state.loading = false;
        state.links = action.payload?.data || [];
        state.total = action.payload?.total ?? action.payload?.count ?? state.links.length;
        state.active = action.payload?.active ?? 0;
      })
      .addCase(fetchLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create link
      .addCase(createLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLink.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new link from API response to the beginning of the array
        state.links.unshift(action.payload?.data);
        // Update counts
        state.total = state.links.length;
        // Check if new link is active
        const newLink = action.payload?.data;
        if (newLink && (!newLink.expiry || new Date(newLink.expiry) > new Date()) && newLink.isActive !== false) {
          state.active += 1;
        }
      })
      .addCase(createLink.rejected, (state, action) => {
        state.loading = false;
        // action.payload is already the error message string from rejectWithValue
        state.error = action.payload || 'Failed to create link';
      })
      // Update link
      .addCase(updateLink.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(updateLink.fulfilled, (state, action) => {
        // state.loading = false;
        // Update the link in the array with the API response
        const updatedLink = action.payload?.data;
        const index = state.links.findIndex(
          (link) => link._id === updatedLink._id || link.id === updatedLink.id || link.slug === updatedLink.slug
        );
        
        let oldLink = null;
        if (index !== -1) {
          oldLink = state.links[index];
          state.links[index] = updatedLink;
        } else {
          // If link not found, add it (shouldn't happen, but just in case)
          state.links.unshift(updatedLink);
          state.total = state.links.length;
        }
        
        // Recalculate active count based on updated link status
        if (oldLink || updatedLink) {
          const wasActive = oldLink && (!oldLink.expiry || new Date(oldLink.expiry) > new Date()) && oldLink.isActive !== false;
          const isActive = updatedLink && (!updatedLink.expiry || new Date(updatedLink.expiry) > new Date()) && updatedLink.isActive !== false;
          
          if (wasActive && !isActive) {
            state.active = Math.max(0, state.active - 1);
          } else if (!wasActive && isActive) {
            state.active += 1;
          }
        }
        
        // Also update currentLink if it matches
        if (state.currentLink?._id === updatedLink._id || state.currentLink?.slug === updatedLink.slug) {
          state.currentLink = updatedLink;
        }
      })
      .addCase(updateLink.rejected, (state, action) => {
        state.loading = false;
        // action.payload is already the error message string from rejectWithValue
        state.error = action.payload || 'Failed to update link';
      })
      // Delete link
      .addCase(deleteLink.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(deleteLink.fulfilled, (state, action) => {
        // state.loading = false;
        // Check if deleted link was active before removing
        const deletedLink = state.links.find(link => link._id === action.payload);
        const wasActive = deletedLink && (!deletedLink.expiry || new Date(deletedLink.expiry) > new Date()) && deletedLink.isActive !== false;
        
        state.links = state.links.filter(
          (link) => link._id !== action.payload
        );
        
        // Update counts
        state.total = state.links.length;
        if (wasActive) {
          state.active = Math.max(0, state.active - 1);
        }
        
        if (state.currentLink?._id === action.payload) {
          state.currentLink = null;
        }
      })
      .addCase(deleteLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch link by slug
      .addCase(fetchLinkBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLinkBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLink = action.payload.link || action.payload;
      })
      .addCase(fetchLinkBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentLink = null;
      });
  },
});

export const { clearError, clearCurrentLink, updateLinkInList } = linksSlice.actions;
export default linksSlice.reducer;

