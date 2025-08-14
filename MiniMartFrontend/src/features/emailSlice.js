import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { sendCodeByEmail, verifyCodeByEmail, resetPasswordByEmail } from '../api/emailApi'

// 1. 이메일로 인증 코드 전송
export const sendEmailCodeThunk = createAsyncThunk('email/sendCode', async (email, thunkAPI) => {
   try {
      const res = await sendCodeByEmail(email)
      return res.data
   } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
   }
})

// 2. 인증 코드 확인
export const verifyEmailCodeThunk = createAsyncThunk('email/verifyCode', async ({ email, code }, thunkAPI) => {
   try {
      const res = await verifyCodeByEmail(email, code)
      return res.data
   } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
   }
})

// 3. 새 비밀번호 재설정
export const resetPasswordThunk = createAsyncThunk('email/resetPassword', async ({ email, newPassword }, thunkAPI) => {
   try {
      const res = await resetPasswordByEmail(email, newPassword)
      return res.data
   } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
   }
})

const initialState = {
   email: '',
   codeVerified: false,
   loading: false,
   error: null,
   successMessage: '',
}

const emailSlice = createSlice({
   name: 'email',
   initialState,
   reducers: {
      clearEmailState: (state) => {
         state.email = ''
         state.codeVerified = false
         state.loading = false
         state.error = null
         state.successMessage = ''
      },
   },
   extraReducers: (builder) => {
      builder
         // 이메일 전송
         .addCase(sendEmailCodeThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(sendEmailCodeThunk.fulfilled, (state, action) => {
            state.loading = false
            state.successMessage = action.payload.message || '이메일 전송 성공'
            state.email = action.meta.arg
         })
         .addCase(sendEmailCodeThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload?.message || '이메일 전송 실패'
         })

         // 인증 코드 확인
         .addCase(verifyEmailCodeThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(verifyEmailCodeThunk.fulfilled, (state, action) => {
            state.loading = false
            state.codeVerified = true
            state.successMessage = action.payload.message || '인증 성공'
         })
         .addCase(verifyEmailCodeThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload?.message || '인증 실패'
         })

         // 비밀번호 재설정
         .addCase(resetPasswordThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(resetPasswordThunk.fulfilled, (state, action) => {
            state.loading = false
            state.successMessage = action.payload.message || '비밀번호 변경 성공'
         })
         .addCase(resetPasswordThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload?.message || '비밀번호 변경 실패'
         })
   },
})

export const { clearEmailState } = emailSlice.actions
export default emailSlice.reducer
