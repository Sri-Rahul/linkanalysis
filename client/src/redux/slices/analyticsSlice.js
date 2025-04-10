import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';

const initialState = {
  urlAnalytics: [],
  clicksOverTime: [],
  deviceBreakdown: [],
  browserBreakdown: [],
  osBreakdown: [],
  analyticsSummary: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get summary analytics for all user URLs
export const getAnalyticsSummary = createAsyncThunk(
  'analytics/getSummary',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/api/analytics/summary');
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get analytics for a specific URL
export const getUrlAnalytics = createAsyncThunk(
  'analytics/getUrlAnalytics',
  async (urlId, thunkAPI) => {
    try {
      const response = await api.get(`/api/analytics/url/${urlId}`);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get click statistics over time for a URL
export const getClicksOverTime = createAsyncThunk(
  'analytics/getClicksOverTime',
  async ({ urlId, timeframe }, thunkAPI) => {
    try {
      const response = await api.get(
        `/api/analytics/url/${urlId}/clicks?timeframe=${timeframe || 'week'}`
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get device breakdown for a URL
export const getDeviceBreakdown = createAsyncThunk(
  'analytics/getDeviceBreakdown',
  async (urlId, thunkAPI) => {
    try {
      const response = await api.get(`/api/analytics/url/${urlId}/devices`);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get browser breakdown for a URL
export const getBrowserBreakdown = createAsyncThunk(
  'analytics/getBrowserBreakdown',
  async (urlId, thunkAPI) => {
    try {
      const response = await api.get(`/api/analytics/url/${urlId}/browsers`);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get OS breakdown for a URL
export const getOsBreakdown = createAsyncThunk(
  'analytics/getOsBreakdown',
  async (urlId, thunkAPI) => {
    try {
      const response = await api.get(`/api/analytics/url/${urlId}/os`);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get analytics summary cases
      .addCase(getAnalyticsSummary.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAnalyticsSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.analyticsSummary = action.payload;
      })
      .addCase(getAnalyticsSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get URL analytics cases
      .addCase(getUrlAnalytics.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUrlAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.urlAnalytics = action.payload;
      })
      .addCase(getUrlAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get clicks over time cases
      .addCase(getClicksOverTime.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getClicksOverTime.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.clicksOverTime = action.payload;
      })
      .addCase(getClicksOverTime.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get device breakdown cases
      .addCase(getDeviceBreakdown.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDeviceBreakdown.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.deviceBreakdown = action.payload;
      })
      .addCase(getDeviceBreakdown.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get browser breakdown cases
      .addCase(getBrowserBreakdown.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBrowserBreakdown.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.browserBreakdown = action.payload;
      })
      .addCase(getBrowserBreakdown.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get OS breakdown cases
      .addCase(getOsBreakdown.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOsBreakdown.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.osBreakdown = action.payload;
      })
      .addCase(getOsBreakdown.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = analyticsSlice.actions;
export default analyticsSlice.reducer;