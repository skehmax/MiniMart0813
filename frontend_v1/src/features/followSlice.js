import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import minimartApi from '../api/axiosApi' // 설정해둔 axios 인스턴스

// 팔로잉 목록을 불러오는 비동기 Thunk
export const fetchFollowingSellersThunk = createAsyncThunk('follow/fetchFollowing', async (_, { rejectWithValue }) => {
   try {
      const response = await minimartApi.get('/api/follow/sellers')
      return response.data.data
   } catch (error) {
      return rejectWithValue(error.response.data)
   }
})

const followSlice = createSlice({
   name: 'follow',
   initialState: {
      followingList: [],
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(fetchFollowingSellersThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchFollowingSellersThunk.fulfilled, (state, action) => {
            state.loading = false
            state.followingList = action.payload
         })
         .addCase(fetchFollowingSellersThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default followSlice.reducer
