import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import UserInfoForm from '../components/my/UserInfoForm'
import OrderHistoryForm from '../components/my/OrderHistoryForm'
import FollowForm from '../components/my/FollowForm'
import '../styles/MyPage.css'

const API_BASE_URL = import.meta.env.VITE_API_URL

const MyPage = () => {
   const navigate = useNavigate()

   // 데이터 fetch 함수 정의
   const fetchData = async () => {
      try {
         const token = localStorage.getItem('token')
         if (!token) throw new Error('토큰 없음')

         const res = await fetch(`${import.meta.env.VITE_API_URL}/mypage`, {
            headers: { Authorization: `Bearer ${token}` },
         })

         if (!res.ok) throw new Error('데이터 로딩 실패')

         const data = await res.json()
         console.log('내 정보 데이터:', data)

         // TODO: 받은 데이터를 상태나 Redux에 저장하는 코드 추가
      } catch (err) {
         console.error(err)
         // 필요시 에러 처리 및 리다이렉트 등 추가
      }
   }

   useEffect(() => {
      const token = localStorage.getItem('token')
      if (!token) {
         navigate('/login')
         return
      }

      fetchData()
   }, [navigate])

   return (
      <div className="mypage-container">
         {/* 상단 사용자 정보 */}
         <UserInfoForm />

         {/* 구매 내역 */}
         <OrderHistoryForm />

         {/* 팔로잉 판매자 */}
         <FollowForm />
      </div>
   )
}

export default MyPage
