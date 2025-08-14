import minimartApi from './axiosApi'
const API_URL = import.meta.env.VITE_API_URL

// 카카오 로그인 URL 가져오기
export const getKakaoLoginUrl = async () => {
   try {
      const response = await minimartApi.get(`/auth/kakao`)
      return response.data // { url: '...' } 반환
   } catch (error) {
      console.error('카카오 로그인 오류', error)
      throw error
   }
}

// 카카오 사용자 정보 조회
export const fetchUserInfo = async () => {
   try {
      const response = await minimartApi.get('/auth/me')
      return response.data
   } catch (error) {
      if (error.response?.status === 401) {
         return null
      } else {
         console.error('사용자 정보 조회 오류:', error)
      }
      throw error
   }
}

// // 카카오 로그아웃
// export const KakaoLogout = async () => {
//    try {
//       await minimartApi.post('/auth/kakao/logout', {})
//    } catch (_) {
//    } finally {
//       localStorage.removeItem('token')
//    }
// }

// 회원가입
export const registerUser = async (userData) => {
   try {
      const response = await minimartApi.post(`${API_URL}/auth/local/register`, userData)
      return response
   } catch (error) {
      console.error('회원가입 요청 오류:', error)
      throw error
   }
}

// 로그인
export const loginUser = async (credentials) => {
   try {
      const response = await minimartApi.post(`${API_URL}/auth/local/login`, credentials)
      return response
   } catch (error) {
      console.error('로그인 요청 오류:', error)
      throw error
   }
}

// 로그아웃
export const logoutUser = async () => {
   const token = localStorage.getItem('token')

   if (token) {
      try {
         const response = await minimartApi.post(
            '/auth/local/logout',
            {},
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         )

         localStorage.removeItem('token')
         return response
      } catch (error) {
         console.error(`API Request 오류: ${error}`)

         throw error
      }
   } else {
      localStorage.removeItem('token')
      return { success: true, message: '이미 로그아웃 상태입니다.' }
   }
}

// 로그인 상태 확인
export const checkAuthStatus = async () => {
   try {
      const response = await minimartApi.get('/auth/status')
      return response
   } catch (error) {
      console.error('로그인 상태 확인 오류:', error)
      throw error
   }
}

// 회원탈퇴
export const deleteUser = async (token) => {
   const response = await minimartApi.delete('/users/me', {
      headers: { Authorization: `Bearer ${token}` },
   })
   return response.data
}

//구글 로그인시 확인창 관리 쿠키 생성
export const setCookie = async () => {
   const response = await minimartApi.post('/auth/google/setcookie')
   return response.data.expired
}

//구글 로그인시 쿠키 체크
export const checkCookie = async () => {
   const response = await minimartApi.get('/auth/google/checkcookie')
   return response.data.expired
}
