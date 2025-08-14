import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuthStatusThunk, checkCookieThunk } from '../../features/authSlice'
import { useNavigate } from 'react-router-dom'
import '../../styles/googleinfo.css'
import { setCookie } from '../../api/authApi'
function GoogleLoginSuccess() {
   const { loading } = useSelector((s) => s.auth)
   const [isFirst, setisFirst] = useState(true)
   const [expired, setExpired] = useState(true)
   const dispatch = useDispatch()
   const navigate = useNavigate()
   useEffect(() => {
      dispatch(checkAuthStatusThunk())
         .unwrap()
         .then(async (result) => {
            result.user.age === null ? setisFirst(true) : setisFirst(false)
            dispatch(checkCookieThunk())
               .unwrap()
               .then((result) => {
                  setExpired(result)
                  if (expired === false) {
                     navigate('/')
                  }
               })
         })
   }, [dispatch, setisFirst, expired])

   useEffect(() => {
      if (!isFirst) {
         navigate('/')
      }
   }, [isFirst])

   function onGoTO(link) {
      return () => {
         navigate(link)
      }
   }

   function onSetCookie() {
      setCookie()
      navigate('/')
   }

   if (loading) {
      return <>잠시만 기다려 주세요...</>
   }
   if (isFirst) {
      return (
         <>
            <div className="google-info">
               <div className="google-info__wrap">
                  <div className="google-info__p">
                     <p>MiniMart에서 다양한 판매자의 물품을 구매하기 위해선 추가 개인정보를 입력해야 합니다.</p>
                  </div>
                  <div className="google-info__buttons">
                     <button onClick={onGoTO('/Mypage')}>내정보 수정하기</button>
                     <button onClick={onGoTO('/')}>다음에 변경하기</button>
                     <button onClick={onSetCookie}>30일 후 변경하기</button>
                  </div>
               </div>
            </div>
         </>
      )
   }
}

export default GoogleLoginSuccess
