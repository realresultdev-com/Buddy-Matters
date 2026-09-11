import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { searchService, SearchRecord } from "../services/search.service";

interface SearchState {
  recentSearches: SearchRecord[];
  isDropdownOpen: boolean;
  searchQuery: string;
  loadingHistory: boolean;
}

const initialState: SearchState = {
  recentSearches: [],
  isDropdownOpen: false,
  searchQuery: "",
  loadingHistory: false,
};

export const loadRecentSearches = createAsyncThunk(
  "search/loadRecentSearches",
  async (isLoggedIn: boolean) => {
    return await searchService.getRecentSearches(isLoggedIn);
  }
);

export const saveSearchQuery = createAsyncThunk(
  "search/saveSearchQuery",
  async ({ query, isLoggedIn }: { query: string; isLoggedIn: boolean }, { dispatch }) => {
    await searchService.saveRecentSearch(query, isLoggedIn);
    dispatch(loadRecentSearches(isLoggedIn));
  }
);

export const removeSearchRecord = createAsyncThunk(
  "search/removeSearchRecord",
  async ({ id, query, isLoggedIn }: { id: string; query: string; isLoggedIn: boolean }, { dispatch }) => {
    await searchService.removeRecentSearch(id, query, isLoggedIn);
    dispatch(loadRecentSearches(isLoggedIn));
  }
);

export const clearAllSearches = createAsyncThunk(
  "search/clearAllSearches",
  async (isLoggedIn: boolean, { dispatch }) => {
    await searchService.clearAll(isLoggedIn);
    dispatch(loadRecentSearches(isLoggedIn));
  }
);

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setDropdownOpen: (state, action: PayloadAction<boolean>) => {
      state.isDropdownOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadRecentSearches.pending, (state) => {
        state.loadingHistory = true;
      })
      .addCase(loadRecentSearches.fulfilled, (state, action) => {
        state.loadingHistory = false;
        state.recentSearches = action.payload;
      })
      .addCase(loadRecentSearches.rejected, (state) => {
        state.loadingHistory = false;
      });
  },
});

export const { setSearchQuery, setDropdownOpen } = searchSlice.actions;
export default searchSlice.reducer;
