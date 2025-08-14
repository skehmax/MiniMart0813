import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { registerUser, loginUser, logoutUser, deleteUser, checkAuthStatus, getKakaoLoginUrl, fetchUserInfo, checkCookie } from '../api/authApi'

//카카오 로그인 관련
// 토큰으로 사용자 정보 가져오기
export const fetchUserInfoThunk = createAsyncThunk('auth/fetchUserInfo', async (_, { rejectWithValue }) => {
   try {
      const data = await fetchUserInfo()
      return data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '카카오 사용자 정보 불러오기 실패')
   }
})

// 카카오 로그인 URL 가져오기
export const getKakaoLoginUrlThunk = createAsyncThunk('auth/getKakaoLoginUrl', async (_, { rejectWithValue }) => {
   try {
      const data = await getKakaoLoginUrl()
      return data.url // { url: ... } 중 url 값만
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '카카오 로그인 URL 불러오기 실패')
   }
})

// 로컬 회원가입/로그인 관련
// 회원가입
export const registerUserThunk = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
   try {
      const response = await registerUser(userData)
      return response.data.user
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '회원가입 실패')
   }
})

// 로그인
export const loginUserThunk = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
   try {
      const response = await loginUser(credentials)
      if (response.data.token) {
         localStorage.setItem('token', response.data.token)
      }
      return response.data.user
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '로그인 실패')
   }
})

// 로그아웃
export const logoutUserThunk = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
   try {
      const response = await logoutUser()
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '로그아웃 실패')
   }
})

// 로그인 상태 확인
export const checkAuthStatusThunk = createAsyncThunk('auth/checkAuthStatus', async (_, { rejectWithValue }) => {
   try {
      const response = await checkAuthStatus()
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '로그인 상태 확인 실패')
   }
})

// 회원 탈퇴
export const deleteUserThunk = createAsyncThunk('auth/deleteUser', async (_, thunkAPI) => {
   try {
      const state = thunkAPI.getState()
      const token = state.auth.user?.token
      await deleteUser(token)

      // 탈퇴 성공 후 로그아웃 처리
      thunkAPI.dispatch(logoutUserThunk())
      return true
   } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data?.message || '탈퇴 실패')
   }
})

// 구글 로그인 쿠키 체크
export const checkCookieThunk = createAsyncThunk('auth/checkCookie', async (_, { rejectWithValue }) => {
   try {
      const response = await checkCookie()
      return response
   } catch (error) {
      return rejectWithValue(error.response.data?.message || '문제발생')
   }
})

const initialState = {
   token: localStorage.getItem('token') || null, // 카카오 로그인 토큰 저장
   loginUrl: '', // 카카오 로그인 URL
   user: null,
   isAuthenticated: false,
   loading: false,
   error: null,
   loginLoading: false,
   kakaoLoading: false,
}

const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      clearAuth(state) {
         state.user = null
         state.token = null
      },
      setToken: (state, action) => {
         state.token = action.payload
         localStorage.setItem('token', action.payload)
      },
      logout: (state) => {
         state.token = null
         state.user = null
         state.isAuthenticated = false
         localStorage.removeItem('token')
      },
   },
   extraReducers: (builder) => {
      /* 카카오 로그인 */
      builder
         .addCase(getKakaoLoginUrlThunk.pending, (state) => {
            state.loading = true
         })
         .addCase(getKakaoLoginUrlThunk.fulfilled, (state, action) => {
            state.loading = false
            state.loginUrl = action.payload
         })
         .addCase(getKakaoLoginUrlThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         /* 사용자 정보 가져오기 */
         .addCase(fetchUserInfoThunk.pending, (state) => {
            state.loading = true
         })
         .addCase(fetchUserInfoThunk.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload) {
               state.user = action.payload
               state.isAuthenticated = true
            } else {
               state.user = null
               state.isAuthenticated = false
            }
         })
         .addCase(fetchUserInfoThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.isAuthenticated = false
            state.user = null
         })

         /* 로컬 회원가입 */
         .addCase(registerUserThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(registerUserThunk.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload
         })
         .addCase(registerUserThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         /* 로컬 로그인 */
         .addCase(loginUserThunk.pending, (state) => {
            state.loginLoading = true
            state.error = null
         })
         .addCase(loginUserThunk.fulfilled, (state, action) => {
            state.loginLoading = false
            state.isAuthenticated = true
            state.user = action.payload
            state.error = null
         })
         .addCase(loginUserThunk.rejected, (state, action) => {
            state.loginLoading = false
            state.error = action.error.message || '로그인 실패'
         })

         /* 로컬 로그아웃 */
         .addCase(logoutUserThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(logoutUserThunk.fulfilled, (state, action) => {
            state.loading = false
            state.isAuthenticated = false
            state.user = null //로그아웃 후 유저 정보 초기화
         })
         .addCase(logoutUserThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         /* 로그인 상태 확인 */
         .addCase(checkAuthStatusThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(checkAuthStatusThunk.fulfilled, (state, action) => {
            state.loading = false
            state.isAuthenticated = action.payload.isAuthenticated
            state.user = action.payload.user || null
         })
         .addCase(checkAuthStatusThunk.rejected, (state, action) => {
            state.loading = false
            state.isAuthenticated = false
            state.user = null
            state.error = action.payload
         })
   },
})

export const { setToken, logout } = authSlice.actions
export default authSlice.reducer
