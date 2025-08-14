import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { registerSeller } from '../api/sellerApi'

export const registerSellerThunk = createAsyncThunk('seller/register', async (payload, { rejectWithValue }) => {
   try {
      const { data } = await registerSeller(payload)
      return data.seller
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '판매자 등록 실패')
   }
})

const sellerSlice = createSlice({
   name: 'seller',
   initialState: { loading: false, error: null, profile: null },
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(registerSellerThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(registerSellerThunk.fulfilled, (state, action) => {
            state.loading = false
            state.profile = action.payload
         })
         .addCase(registerSellerThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default sellerSlice.reducer
