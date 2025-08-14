import React, { useState } from 'react'
import axios from 'axios'
import '../../styles/findpassword.css'
import minimartApi from '../../api/axiosApi'

import { Link } from 'react-router-dom'

const FindPasswordForm = () => {
   const [step, setStep] = useState(1)
   const [email, setEmail] = useState('')
   const [codeInput, setCodeInput] = useState('')
   const [newPassword, setNewPassword] = useState('')
   const [message, setMessage] = useState('')

   // Step 1: 인증코드 요청
   const handleSendCode = async () => {
      try {
         const res = await minimartApi.post('auth/local/find/email/send-code', { email })
         setStep(2)
         setMessage('인증 코드가 이메일로 전송되었습니다.')
      } catch (err) {
         setMessage(err.response?.data?.message || '오류가 발생했습니다.')
      }
   }

   // Step 2: 인증코드 확인 및 비밀번호 유효성 검사
   const handleVerifyCode = async () => {
      const passwordRule = /^(?=.*[!@#$%^&*])(?=.*[a-zA-Z0-9]).{8,}$/
      if (!passwordRule.test(newPassword)) {
         setMessage('비밀번호는 8자리 이상이어야 하며, 특수문자를 1개 이상 포함해야 합니다.')
         return
      }

      try {
         const res = await minimartApi.post('auth/local/find/email/verify-and-reset', {
            email,
            verificationCode: codeInput,
            newPassword,
         })
         setStep(4)
         setMessage('비밀번호가 성공적으로 변경되었습니다.')
      } catch (err) {
         setMessage(err.response?.data?.message || '오류가 발생했습니다.')
      }
   }

   return (
      <div className="form-container">
         <h2>비밀번호 찾기</h2>

         {step === 1 && (
            <div className="form-box">
               <label>이메일</label>
               <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
               <button onClick={handleSendCode} className="btn">
                  인증 코드 전송
               </button>
            </div>
         )}

         {step === 2 && (
            <div className="form-box">
               <label>인증 코드</label>
               <input type="text" value={codeInput} onChange={(e) => setCodeInput(e.target.value)} className="input" />
               <label>새 비밀번호</label>
               <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input" />
               <button onClick={handleVerifyCode} className="btn">
                  비밀번호 변경
               </button>
            </div>
         )}

         {step === 4 && (
            <div className="form-box">
               <p>{message}</p>
               <Link to="/" className="btn">
                  홈으로 돌아가기
               </Link>
            </div>
         )}

         {message && step !== 4 && <p className="message-text">{message}</p>}
      </div>
   )
}

export default FindPasswordForm
