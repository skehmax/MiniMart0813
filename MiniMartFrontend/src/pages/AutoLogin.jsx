import React, { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './LoginPage'

// 1. 유저 정보와 로그인/로그아웃 함수를 앱 전체에서 공유하기 위한 Context 생성
const AuthContext = createContext(null)

// API 서버 주소
const API_BASE_URL = 'http://localhost:8080/api'

export default function App() {
   const [user, setUser] = useState(null) // 로그인한 유저 정보
   const [isLoading, setIsLoading] = useState(true) // 로딩 상태

   // 2. 앱이 처음 시작될 때 자동 로그인 시도
   useEffect(() => {
      const autoLogin = async () => {
         const refreshToken = localStorage.getItem('refreshToken')
         if (!refreshToken) {
            setIsLoading(false)
            return // 리프레시 토큰이 없으면 바로 종료
         }

         try {
            // 리프레시 토큰으로 새 액세스 토큰 요청
            const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ refreshToken }),
            })

            if (res.ok) {
               const { accessToken } = await res.json()
               sessionStorage.setItem('accessToken', accessToken) // 새 액세스 토큰 저장
               // 실제로는 토큰을 디코딩하거나, '/me' 같은 API를 호출해 유저 정보를 가져옵니다.
               // 여기서는 예시로 간단하게 로그인 상태만 만듭니다.
               setUser({ loggedIn: true })
            } else {
               // 리프레시 토큰이 만료되었거나 유효하지 않음
               localStorage.removeItem('refreshToken')
            }
         } catch (error) {
            console.error('자동 로그인 실패:', error)
         } finally {
            setIsLoading(false) // 로딩 종료
         }
      }

      autoLogin()
   }, [])

   // 3. 로그인/로그아웃 함수
   const login = (userData, refreshToken) => {
      setUser(userData)
      if (refreshToken) {
         localStorage.setItem('refreshToken', refreshToken)
      }
   }

   const logout = () => {
      const refreshToken = localStorage.getItem('refreshToken')
      fetch(`${API_BASE_URL}/auth/logout`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ refreshToken }),
      })

      setUser(null)
      localStorage.removeItem('refreshToken')
      sessionStorage.removeItem('accessToken')
   }

   // 로딩 중일 때는 아무것도 보여주지 않음
   if (isLoading) {
      return <div>로딩 중...</div>
   }

   return (
      // 4. AuthContext.Provider로 하위 컴포넌트에 값들 전달
      <AuthContext.Provider value={{ user, login, logout }}>
         <BrowserRouter>
            <Routes>
               {/* 로그인이 되어있으면 메인 페이지, 아니면 로그인 페이지를 보여주는 예시 */}
               <Route path="/" element={user ? <MainPage /> : <LoginPage />} />
               {/* 다른 라우트들... */}
            </Routes>
         </BrowserRouter>
      </AuthContext.Provider>
   )
}

// 다른 컴포넌트에서 유저 정보나 로그아웃 함수를 쉽게 사용하기 위함
export const useAuth = () => {
   return useContext(AuthContext)
}

// 예시 메인 페이지
function MainPage() {
   const { logout } = useAuth()
   return (
      <div>
         <h1>메인 페이지</h1>
         <p>로그인에 성공했습니다!</p>
         <button onClick={logout}>로그아웃</button>
      </div>
   )
}
