import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';

const initialState = {
  urls: [],
  currentUrl: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Create new URL
export const createUrl = createAsyncThunk(
  'urls/create',
  async (urlData, thunkAPI) => {
    try {
      const response = await api.post('/api/urls', urlData);
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

// Get all URLs for user
export const getUrls = createAsyncThunk(
  'urls/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/api/urls');
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

// Get URL by ID
export const getUrlById = createAsyncThunk(
  'urls/getById',
  async (urlId, thunkAPI) => {
    try {
      const response = await api.get(`/api/urls/${urlId}`);
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

// Update URL
export const updateUrl = createAsyncThunk(
  'urls/update',
  async ({ urlId, urlData }, thunkAPI) => {
    try {
      const response = await api.put(`/api/urls/${urlId}`, urlData);
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

// Delete URL
export const deleteUrl = createAsyncThunk(
  'urls/delete',
  async (urlId, thunkAPI) => {
    try {
      await api.delete(`/api/urls/${urlId}`);
      return urlId;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const urlSlice = createSlice({
  name: 'urls',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentUrl: (state) => {
      state.currentUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create URL cases
      .addCase(createUrl.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createUrl.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.urls.push(action.payload);
      })
      .addCase(createUrl.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get all URLs cases
      .addCase(getUrls.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUrls.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.urls = action.payload;
      })
      .addCase(getUrls.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get URL by ID cases
      .addCase(getUrlById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUrlById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentUrl = action.payload;
      })
      .addCase(getUrlById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update URL cases
      .addCase(updateUrl.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUrl.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.urls = state.urls.map((url) =>
          url._id === action.payload._id ? action.payload : url
        );
        state.currentUrl = action.payload;
      })
      .addCase(updateUrl.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete URL cases
      .addCase(deleteUrl.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUrl.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.urls = state.urls.filter((url) => url._id !== action.payload);
      })
      .addCase(deleteUrl.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearCurrentUrl } = urlSlice.actions;
export default urlSlice.reducer;