import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';

// Async thunks for API calls
export const fetchLinkAnalytics = createAsyncThunk(
  'analytics/fetchLinkAnalytics',
  async ({ linkId, slug }, { rejectWithValue }) => {
    try {
      const identifier = linkId || slug;
      const response = await api.get(`/api/links/${identifier}/analytics`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch analytics'
      );
    }
  }
);

export const fetchStats = createAsyncThunk(
  'analytics/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/links/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch stats'
      );
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    linkAnalytics: null,
    stats: {
      totalLinks: 0,
      totalClicks: 0,
      activeLinks: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearLinkAnalytics: (state) => {
      state.linkAnalytics = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch link analytics
    builder
      .addCase(fetchLinkAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLinkAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.linkAnalytics = action.payload.analytics || action.payload;
      })
      .addCase(fetchLinkAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.linkAnalytics = null;
      })
      // Fetch stats
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats || action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearLinkAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;

