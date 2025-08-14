// src/features/reviewSlice.js

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { writeReview } from '../api/reviewApi'

export const writeReviewThunk = createAsyncThunk('review/writeReview', async (reviewData, thunkAPI) => {
   try {
      const response = await writeReview(reviewData)
      return response
   } catch (err) {
      return thunkAPI.rejectWithValue(err.message || '리뷰 작성 실패')
   }
})

const reviewSlice = createSlice({
   name: 'review',
   initialState: {
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(writeReviewThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(writeReviewThunk.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(writeReviewThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export const { actions, reducer } = reviewSlice
export default reducer
