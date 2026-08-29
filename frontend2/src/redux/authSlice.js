import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loading: false,
    user:null
  },
  // Define reducers inside the reducers object
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser:(state, action) => {
      state.user = action.payload;
    }
  },
});

// Export the action
export const { setLoading, setUser} = authSlice.actions;

// Export the reducer
export default authSlice.reducer;
