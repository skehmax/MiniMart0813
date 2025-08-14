import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getPendingSellers, approveSeller, rejectSeller } from '../api/adminApi'

// Thunk: 승인 대기 목록 조회
export const fetchPendingSellers = createAsyncThunk('admin/fetchPendingSellers', async (_, { rejectWithValue }) => {
   try {
      const { data } = await getPendingSellers()
      return data
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '목록을 불러오는데 실패했습니다.')
   }
})

// Thunk: 판매자 승인
export const approveSellerThunk = createAsyncThunk('admin/approveSeller', async (sellerId, { rejectWithValue }) => {
   try {
      await approveSeller(sellerId)
      return sellerId // 성공 시 처리된 sellerId를 반환하여 state에서 제거
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '판매자 승인에 실패했습니다.')
   }
})

// Thunk: 판매자 거절
export const rejectSellerThunk = createAsyncThunk('admin/rejectSeller', async (sellerId, { rejectWithValue }) => {
   try {
      await rejectSeller(sellerId)
      return sellerId // 성공 시 처리된 sellerId를 반환하여 state에서 제거
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '판매자 거절에 실패했습니다.')
   }
})

const initialState = {
   sellers: [], // 승인 대기 목록
   loading: false,
   error: null,
}

const adminSlice = createSlice({
   name: 'admin',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         // 승인 대기 목록 조회
         .addCase(fetchPendingSellers.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchPendingSellers.fulfilled, (state, action) => {
            state.loading = false
            state.sellers = action.payload
         })
         .addCase(fetchPendingSellers.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // 판매자 승인
         .addCase(approveSellerThunk.fulfilled, (state, action) => {
            // action.payload는 승인된 sellerId
            state.sellers = state.sellers.filter((seller) => seller.id !== action.payload)
         })
         .addCase(approveSellerThunk.rejected, (state, action) => {
            // 실패 시 에러 처리 (예: alert, toast 등)
            state.error = action.payload
         })
         // 판매자 거절
         .addCase(rejectSellerThunk.fulfilled, (state, action) => {
            // action.payload는 거절된 sellerId
            state.sellers = state.sellers.filter((seller) => seller.id !== action.payload)
         })
         .addCase(rejectSellerThunk.rejected, (state, action) => {
            state.error = action.payload
         })
   },
})

export default adminSlice.reducer
