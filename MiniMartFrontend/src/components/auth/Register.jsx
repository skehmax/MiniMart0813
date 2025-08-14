import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUserThunk } from '../../features/authSlice'
import { useNavigate } from 'react-router-dom'
import '../../styles/register.css'
import { useDaumPostcodePopup } from 'react-daum-postcode'

function Register() {
   const [name, setName] = useState('')
   const [email, setEmail] = useState('')
   const [age, setAge] = useState('0')
   const [password, setPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')
   const [zipcode, setZipcode] = useState('')
   const [address, setAddress] = useState('')
   const [phone_number, setPhone_number] = useState('')
   const [detailaddress, setDetailaddress] = useState('')
   const [extraaddress, setExtraaddress] = useState('')
   const [isRegisterComplete, setIsRegisterComplete] = useState(false)

   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { loading, error } = useSelector((state) => state.auth)
   const user = useSelector((state) => state.auth.user)
   const profileUrl = user?.profile_img || '/uploads/profile-images/default.png'

   const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
   const validatePassword = (password) => /^(?=.*[A-Za-z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)
   const scriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
   const open = useDaumPostcodePopup(scriptUrl)

   //Daum 우편번호 검색
   const handleAddressSearch = () => {
      open({
         onComplete: (data) => {
            // 검색 결과에서 우편번호, 기본 주소 추출
            let roadAddr = data.roadAddress // 도로명 주소
            let extraAddr = '' // 참고항목 변수

            if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
               extraAddr += data.bname
            }
            if (data.buildingName !== '' && data.apartment === 'Y') {
               extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName
            }
            if (extraAddr !== '') {
               extraAddr = `(${extraAddr})`
            }

            setZipcode(data.zonecode)
            setAddress(roadAddr)
            setExtraaddress(extraAddr)
            setDetailaddress('') // 상세주소는 초기화
         },
      })
   }

   const handleRegister = () => {
      if (!email || !address || !password || !confirmPassword) {
         alert('모든 필드를 입력해주세요.')
         return
      }

      if (!validateEmail(email)) {
         alert('유효한 이메일 주소를 입력해주세요.')
         return
      }

      if (!validatePassword(password)) {
         alert('비밀번호는 8자리 이상이고, 영문자와 특수문자를 포함해야 합니다.')
         return
      }

      if (password !== confirmPassword) {
         alert('비밀번호가 일치하지 않습니다.')
         return
      }
      if (phone_number !== phone_number) {
         alert('핸드폰 번호 입력은 필수입니다.')
         return
      }
      if (age < 14) {
         alert('만 14세 이상만 가입이 가능합니다.')
         return
      }

      dispatch(
         registerUserThunk({
            name,
            email,
            password,
            phone_number,
            age,
            zipcode,
            address,
            detailaddress,
            extraaddress,
         })
      )
         .unwrap()
         .then(() => setIsRegisterComplete(true))
         .catch((err) => console.error('회원가입 에러:', err))
   }

   if (isRegisterComplete) {
      return (
         <div className="register-complete-box">
            <h2>회원가입이 완료되었습니다!</h2>
            <p>로그인 페이지로 이동하거나 다른 작업을 계속 진행할 수 있습니다.</p>
            <button onClick={() => navigate('/login')} className="register-complete-button">
               로그인 하러 가기
            </button>
         </div>
      )
   }
   return (
      <div className="register-container">
         <h2>회원가입</h2>
         {error && <p className="register-error">{error}</p>}

         <div className="register-input">
            <label>이름</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름을 입력해주세요" />
         </div>

         <div className="register-input">
            <label>이메일</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@example.com" />
         </div>

         <div className="register-input">
            <label>비밀번호</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8자리 이상, 특수문자 포함" />
         </div>

         <div className="register-input">
            <label>비밀번호 확인</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
         </div>

         <div className="register-input">
            <label htmlFor="birthYear">출생년도</label>
            <select
               id="birthYear"
               name="birthYear"
               className="birthyear-select"
               value={2025 - age}
               onChange={(e) => {
                  const selYear = parseInt(e.target.value, 10)
                  const calAge = 2025 - selYear
                  setAge(calAge)
               }}
            >
               {Array.from({ length: 2025 - 1899 + 1 }, (_, i) => {
                  const year = 2025 - i
                  return (
                     <option key={year} value={year}>
                        {year}
                     </option>
                  )
               })}
            </select>
         </div>

         <div className="register-input">
            <label htmlFor="phone">전화번호</label>
            <input
               type="tel"
               id="phone"
               name="phone"
               value={phone_number}
               className="phone-input"
               placeholder="01012345678"
               maxLength="11"
               onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, '')
                  setPhone_number(onlyNums)
               }}
            />
         </div>

         <div className="register-input">
            <label>주소지 입력</label>
            <div className="postcode-box">
               <input type="text" className="postcode-box" value={zipcode} readOnly placeholder="우편번호" />
               <button className="postcode-button" type="button" onClick={handleAddressSearch}>
                  우편번호 찾기
               </button>
            </div>
         </div>

         <div className="register-input">
            <input type="text" value={address} readOnly placeholder="주소" />
         </div>

         <div className="address-detail-row">
            <div className="half-input">
               <label>상세주소</label>
               <input type="text" value={detailaddress} onChange={(e) => setDetailaddress(e.target.value)} placeholder="상세주소" />
            </div>
            <div className="half-input">
               <label>참고항목</label>
               <input type="text" value={extraaddress} placeholder="참고항목" />
            </div>
         </div>

         <div className="register-sns">
            <p className="sns-label">다른 방법으로 회원가입하기</p>
            <div className="sns-icons">
               <img src="/icons/kakao-icon.png" alt="카카오 로그인" />
               <img src="/icons/google-icon.png" alt="구글 로그인" />
            </div>
         </div>

         <div className="button-group">
            <button onClick={handleRegister} disabled={loading}>
               {loading ? '가입 중...' : '회원가입 완료'}
            </button>
         </div>
      </div>
   )
}

export default Register
