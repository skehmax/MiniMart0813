import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createQna } from '../api/qnaApi' // Assumed API function for creating Q&A

// 문의 작성
export const createQnaThunk = createAsyncThunk('qna/createQna', async (formData, { rejectWithValue }) => {
   try {
      const res = await createQna(formData)
      return res
   } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Q&A 작성 실패' })
   }
})

const qnaSlice = createSlice({
   name: 'qna',
   initialState: {
      loading: false,
      error: null,
      success: false,
   },
   reducers: {
      resetQnaState: (state) => {
         state.loading = false
         state.error = null
         state.success = false
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(createQnaThunk.pending, (state) => {
            state.loading = true
            state.error = null
            state.success = false
         })
         .addCase(createQnaThunk.fulfilled, (state) => {
            state.loading = false
            state.success = true
         })
         .addCase(createQnaThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload?.message || '문의 작성 실패'
         })
   },
})

export const { resetQnaState } = qnaSlice.actions
export default qnaSlice.reducer
