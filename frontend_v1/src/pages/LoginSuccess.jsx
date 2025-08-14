// src/pages/LoginSuccess.jsx
import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setToken, fetchUserInfoThunk } from '../features/authSlice'

const LoginSuccess = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const [searchParams] = useSearchParams()

   useEffect(() => {
      const token = searchParams.get('token')

      if (token) {
         dispatch(setToken(token))
         localStorage.setItem('token', token) // 🔒 토큰 확실히 저장
         setTimeout(() => {
            dispatch(fetchUserInfoThunk()) // ✅ 약간 딜레이를 줘서 axios가 토큰 읽을 수 있게
            navigate('/')
         }, 100)
      } else {
         navigate('/login')
      }
   }, [dispatch, navigate, searchParams])

   return <div>로그인 처리 중...</div>
}

export default LoginSuccess
