import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'

// --- Helper Functions ---
// 이메일 마스킹 함수 (e.g., user@example.com -> u***@e***.com)
const maskEmail = (email) => {
   if (!email || !email.includes('@')) {
      return '이메일 정보가 올바르지 않습니다.'
   }
   const [localPart, domain] = email.split('@')
   const [domainName, domainTld] = domain.split('.')

   const maskedLocal = localPart.length > 1 ? localPart[0] + '*'.repeat(localPart.length - 1) : localPart
   const maskedDomain = domainName.length > 1 ? domainName[0] + '*'.repeat(domainName.length - 1) : domainName

   return `${maskedLocal}@${maskedDomain}.${domainTld}`
}

// --- Mock API: 실제로는 별도의 파일 (/pages/api/...)에 위치해야 합니다 ---

// Mock Database: 실제 프로젝트에서는 MySQL, PostgreSQL, MongoDB 등을 사용합니다.
const mockUserDatabase = [
   { id: 1, phone: '010-1234-5678', email: 'testuser@example.com', name: '홍길동' },
   { id: 2, phone: '010-9876-5432', email: 'gemini@google.com', name: '제미니' },
]

// API 1: 전화번호로 사용자 찾기
const findUserByPhoneAPI = async (phone) => {
   console.log(`[API] 전화번호로 사용자 검색: ${phone}`)
   return new Promise((resolve) => {
      setTimeout(() => {
         const user = mockUserDatabase.find((u) => u.phone === phone)
         if (user) {
            resolve({ success: true, maskedEmail: maskEmail(user.email) })
         } else {
            resolve({ success: false, message: '해당 전화번호로 가입된 회원이 없습니다.' })
         }
      }, 500) // 네트워크 지연 시뮬레이션
   })
}

// API 2: 이메일 인증 후 비밀번호 재설정 메일 발송
const sendResetEmailAPI = async (phone, email) => {
   console.log(`[API] 이메일 확인 및 재설정 메일 발송 요청: ${phone}, ${email}`)
   return new Promise((resolve) => {
      setTimeout(() => {
         const user = mockUserDatabase.find((u) => u.phone === phone)
         if (!user) {
            return resolve({ success: false, message: '사용자 정보를 찾을 수 없습니다. 처음부터 다시 시도해주세요.' })
         }
         if (user.email.toLowerCase() === email.toLowerCase()) {
            // 실제로는 여기서 nodemailer 등을 사용해 메일을 보냅니다.
            console.log(`[SUCCESS] ${user.email} 주소로 비밀번호 재설정 링크를 발송했습니다.`)
            resolve({ success: true, message: `[${user.email}] 주소로 비밀번호 재설정 안내 메일을 보냈습니다. 5분 안에 확인해주세요.` })
         } else {
            resolve({ success: false, message: '입력하신 이메일 주소가 일치하지 않습니다.' })
         }
      }, 1000) // 네트워크 지연 및 메일 발송 시간 시뮬레이션
   })
}

// --- React Frontend Component ---

function FindPasswordComponent() {
   const [step, setStep] = useState(1) // 1: 전화번호 입력, 2: 이메일 입력
   const [phone, setPhone] = useState('')
   const [email, setEmail] = useState('')
   const [maskedEmail, setMaskedEmail] = useState('')
   const [isLoading, setIsLoading] = useState(false)
   const [message, setMessage] = useState({ type: '', text: '' })

   const handlePhoneSubmit = async (e) => {
      e.preventDefault()
      if (!/^\d{3}-\d{3,4}-\d{4}$/.test(phone)) {
         setMessage({ type: 'error', text: '올바른 전화번호 형식(010-1234-5678)을 입력해주세요.' })
         return
      }
      setIsLoading(true)
      setMessage({ type: '', text: '' })

      const response = await findUserByPhoneAPI(phone)

      setIsLoading(false)
      if (response.success) {
         setMaskedEmail(response.maskedEmail)
         setStep(2)
         setMessage({ type: 'info', text: '회원님의 이메일 정보를 확인했습니다. 아래에 전체 이메일 주소를 입력해주세요.' })
      } else {
         setMessage({ type: 'error', text: response.message })
      }
   }

   const handleEmailSubmit = async (e) => {
      e.preventDefault()
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
         setMessage({ type: 'error', text: '올바른 이메일 형식을 입력해주세요.' })
         return
      }
      setIsLoading(true)
      setMessage({ type: '', text: '' })

      const response = await sendResetEmailAPI(phone, email)

      setIsLoading(false)
      if (response.success) {
         setStep(3) // 완료 단계
         setMessage({ type: 'success', text: response.message })
      } else {
         setMessage({ type: 'error', text: response.message })
      }
   }

   const resetProcess = () => {
      setStep(1)
      setPhone('')
      setEmail('')
      setMaskedEmail('')
      setIsLoading(false)
      setMessage({ type: '', text: '' })
   }

   // 메시지 스타일
   const messageStyle = {
      padding: '10px',
      margin: '10px 0',
      borderRadius: '8px',
      textAlign: 'center',
      color: 'white',
      display: message.text ? 'block' : 'none',
      backgroundColor: message.type === 'error' ? '#ef4444' : message.type === 'success' ? '#22c55e' : '#3b82f6',
   }

   return (
      <div className="bg-slate-100 flex items-center justify-center min-h-screen font-sans">
         <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
            <h1 className="text-3xl font-bold text-center text-slate-800">비밀번호 찾기</h1>

            <div style={messageStyle}>{message.text}</div>

            {step === 1 && (
               <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  <div>
                     <label htmlFor="phone" className="block text-sm font-medium text-slate-600">
                        가입 시 등록한 전화번호
                     </label>
                     <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="010-1234-5678"
                        className="w-full px-4 py-3 mt-1 text-slate-700 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        required
                        disabled={isLoading}
                     />
                  </div>
                  <button type="submit" className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 transition-all duration-300" disabled={isLoading}>
                     {isLoading ? '계정 확인 중...' : '이메일 찾기'}
                  </button>
               </form>
            )}

            {step === 2 && (
               <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg text-center">
                     <p className="text-slate-600">아래 이메일 정보가 맞는지 확인해주세요.</p>
                     <p className="text-lg font-bold text-slate-800 my-2">{maskedEmail}</p>
                  </div>
                  <div>
                     <label htmlFor="email" className="block text-sm font-medium text-slate-600">
                        이메일 주소 전체 입력
                     </label>
                     <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="w-full px-4 py-3 mt-1 text-slate-700 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        required
                        disabled={isLoading}
                     />
                  </div>
                  <div className="flex space-x-2">
                     <button
                        type="button"
                        onClick={resetProcess}
                        className="w-1/2 py-3 font-semibold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 disabled:bg-slate-300 transition-all duration-300"
                        disabled={isLoading}
                     >
                        뒤로
                     </button>
                     <button type="submit" className="w-1/2 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 transition-all duration-300" disabled={isLoading}>
                        {isLoading ? '전송 중...' : '재설정 메일 받기'}
                     </button>
                  </div>
               </form>
            )}

            {step === 3 && (
               <div className="text-center space-y-4">
                  <p className="text-slate-700">성공적으로 요청이 완료되었습니다.</p>
                  <button onClick={resetProcess} className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300">
                     처음으로 돌아가기
                  </button>
               </div>
            )}
         </div>
      </div>
   )
}

// --- React App Initialization ---
// This setup is for demonstration in a single file.
// In a real Next.js app, you would place FindPasswordComponent in your pages directory.
window.addEventListener('DOMContentLoaded', () => {
   const container = document.getElementById('root')
   if (container) {
      const root = createRoot(container)
      // Removed React.StrictMode to prevent potential environment conflicts.
      root.render(<FindPasswordComponent />)
   } else {
      console.error("Root element not found. Make sure you have a <div id='root'></div> in your HTML.")
   }
})

// In a real Next.js project, you would export the component:
// export default FindPasswordComponent;
