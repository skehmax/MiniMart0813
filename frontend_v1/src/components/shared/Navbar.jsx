import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUserThunk, fetchUserInfoThunk } from '../../features/authSlice'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Button = styled.button`
   width: 100px;
   height: 32px;
   font-size: 15px;
   border: none;
   border-radius: 6px;
   margin-right: 10px;
   cursor: pointer;
`

const LoginButton = styled.button`
   width: 69px;
   height: 25px;
   font-size: 10px;
   background-color: #2c2c2c;
   color: white;
   border: none;
   border-radius: 5px;
   cursor: pointer;
`
function Haeder() {
   const dispatch = useDispatch()
   const user = useSelector((state) => state.auth?.user)
   const token = useSelector((state) => state.auth.token)
   const navigate = useNavigate()

   useEffect(() => {
      if (token && !user) {
         dispatch(fetchUserInfoThunk())
      }
   }, [dispatch, token, user])

   const handleLogout = () => {
      dispatch(logoutUserThunk())
         .unwrap()
         .then(() => {
            navigate('/') // 로그아웃시 홈으로 이동
         })
         .catch((error) => {
            alert('로그아웃 실패: ' + error)
         })
   }

   const goToManager = () => {
      navigate('/manager')
   }
   return (
      <div>
         <div style={{ display: 'flex', width: '100%', height: '89px' }}>
            <div style={{ width: '315px', height: '80px', marginLeft: '30px' }}>
               <Link to="/">
                  <img src="/Logo.png" alt="미니마트 로고" />
               </Link>
            </div>
            <div style={{ width: '600px', height: '89px', display: 'flex', alignItems: 'center', marginRight: '50px' }}>
               <button style={{ fontSize: '14px', border: 'none', borderRadius: '6px', marginRight: '10px', width: '100px', height: '32px', backgroundColor: '#FACC15', color: 'white' }} onClick={() => navigate('/orders')}>
                  상품 주문
               </button>
               <Button onClick={() => navigate('/cart')}>장바구니</Button>
               <Button onClick={() => navigate('/chat')}>채팅</Button>
               <Button onClick={() => navigate('/customer-service')}>고객센터</Button>
               {user ? (
                  <>
                     {user.role == 'ADMIN' ? <Button onClick={goToManager}>고객 관리</Button> : null}
                     <img src={user.profile_img || '/none_profile_img.webp'} alt="프로필" style={{ width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer' }} onClick={() => navigate('/mypage')} referrerPolicy="no-referrer"/>
                     <p style={{ width: '60px', margin: '0 40px 0 20px' }}>{user.name}</p>
                     <LoginButton onClick={handleLogout}>로그아웃</LoginButton>
                  </>
               ) : (
                  <Link
                     to="/login"
                     style={{
                        display: 'inline-block',
                        width: 'fit-content',
                        textDecoration: 'none',
                     }}
                  >
                     <LoginButton>로그인</LoginButton>
                  </Link>
               )}
            </div>
         </div>
         <div style={{ height: '142px', backgroundColor: '#EBD96B' }}></div>
      </div>
   )
}

export default Haeder
