import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' // 페이지 이동을 위해

// 가짜 로그인 API 함수. 실제 프로젝트에서는 fetch를 사용합니다.
const loginAPI = async (email, password) => {
   console.log(`로그인 시도: ${email}`)
   if (email === 'test@test.com' && password === '1234') {
      return { success: true, token: 'fake-jwt-token-for-example' }
   }
   return { success: false, message: '이메일 또는 비밀번호가 틀렸습니다.' }
}

export default function LoginPage() {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [rememberEmail, setRememberEmail] = useState(false) // 아이디 저장 체크박스 상태
   const navigate = useNavigate()

   // 1. 컴포넌트가 처음 로드될 때, localStorage에서 저장된 이메일을 찾습니다.
   useEffect(() => {
      const savedEmail = localStorage.getItem('rememberedEmail')
      if (savedEmail) {
         setEmail(savedEmail)
         setRememberEmail(true)
      }
   }, []) // []는 처음 한 번만 실행하라는 의미입니다.

   const handleLogin = async (e) => {
      e.preventDefault()
      const result = await loginAPI(email, password)

      if (result.success) {
         // 2. 로그인이 성공하고, '아이디 저장'이 체크되어 있다면 이메일을 저장합니다.
         if (rememberEmail) {
            localStorage.setItem('rememberedEmail', email)
         } else {
            // 3. 체크되어 있지 않다면, 혹시 저장되어 있을지 모를 이메일을 삭제합니다.
            localStorage.removeItem('rememberedEmail')
         }
         alert('로그인 성공!')
         // 실제로는 여기서 토큰을 저장하고 메인 페이지로 이동합니다.
         // sessionStorage.setItem('accessToken', result.token);
         // navigate('/main');
      } else {
         alert(result.message)
      }
   }

   // --- 스타일 객체 ---
   const styles = {
      card: { width: '100%', maxWidth: '400px', padding: '32px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
      input: { width: '100%', padding: '12px', marginTop: '8px', marginBottom: '16px', border: '1px solid #ccc', borderRadius: '8px', boxSizing: 'border-box' },
      button: { width: '100%', padding: '12px', fontWeight: '600', color: 'white', backgroundColor: '#4338ca', borderRadius: '8px', border: 'none', cursor: 'pointer' },
      checkboxContainer: { display: 'flex', alignItems: 'center', margin: '16px 0', gap: '8px' },
   }

   return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f1f5f9' }}>
         <div style={styles.card}>
            <h1 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>로그인</h1>
            <form onSubmit={handleLogin}>
               <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
               <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required />

               {/* 아이디 저장 체크박스 */}
               <div style={styles.checkboxContainer}>
                  <input type="checkbox" id="rememberEmail" checked={rememberEmail} onChange={(e) => setRememberEmail(e.target.checked)} />
                  <label htmlFor="rememberEmail">아이디 저장</label>
               </div>

               <button type="submit" style={styles.button}>
                  로그인
               </button>
            </form>
         </div>
      </div>
   )
}
