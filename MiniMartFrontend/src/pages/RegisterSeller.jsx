import { useState } from 'react'
import '../styles/registerSeller.css'
import { useDispatch, useSelector } from 'react-redux'
import { registerSellerThunk } from '../features/sellerSlice'
import { useNavigate } from 'react-router-dom'
import { uploadImage } from '../api/uploadApi'

function RegisterSeller() {
   const dispatch = useDispatch()
   const { loading } = useSelector((s) => s.seller || { loading: false })
   const navigate = useNavigate()

   const [biz, setBiz] = useState('')
   const [bizName, setBizName] = useState('')
   const [introduce, setIntroduce] = useState('')
   const [bizNumber, setBizNumber] = useState('')
   const [representativeName, setRepresentativeName] = useState('')
   const [mainProduct, setMainProduct] = useState('')
   const [address, setAddress] = useState('')
   const [detailAddress, setDetailAddress] = useState('')
   const [postcode, setPostcode] = useState('')
   const [extraAddress, setExtraAddress] = useState('')

   // 업로드 관련 상태
   const [certPreview, setCertPreview] = useState(null)
   const [certUrl, setCertUrl] = useState(null)
   const [uploading, setUploading] = useState(false)

   // 보기용 하이픈 포맷
   const formatBiz = (v) => {
      const d = v.replace(/\D/g, '').slice(0, 10)
      const m = d.match(/^(\d{0,3})(\d{0,2})(\d{0,5})$/)
      return [m?.[1], m?.[2], m?.[3]].filter(Boolean).join('-')
   }

   const onFileChange = async (e) => {
      const file = e.target.files?.[0]
      if (!file) return

      // 간단 검증(5MB 이하, 이미지)
      if (!file.type.startsWith('image/')) {
         alert('이미지 파일만 업로드 가능합니다.')
         return
      }
      if (file.size > 5 * 1024 * 1024) {
         alert('파일 크기는 5MB 이하만 가능합니다.')
         return
      }

      setUploading(true)
      setCertPreview(URL.createObjectURL(file)) // 미리보기

      try {
         const url = await uploadImage(file) // 서버 업로드 → URL 응답
         setCertUrl(url)
      } catch (err) {
         console.error(err)
         alert('이미지 업로드에 실패했습니다.')
         setCertPreview(null)
         setCertUrl(null)
      } finally {
         setUploading(false)
      }
   }

   const handleRegister = () => {
      if (!biz || !bizName || !bizNumber || !representativeName || !address) {
         alert('필수 항목을 입력하세요.')
         return
      }

      const digitsBiz = biz.replace(/\D/g, '')
      if (digitsBiz.length !== 10) {
         alert('사업자등록번호는 숫자 10자리여야 합니다.')
         return
      }

      if (!certUrl) {
         const go = confirm('사업자등록증 사본이 업로드되지 않았습니다. 계속할까요?')
         if (!go) return
      }

      const business_address = `${postcode ? `[${postcode}] ` : ''}${address} ${detailAddress} ${extraAddress}`.trim()

      const payload = {
         name: bizName,
         introduce: introduce || null,
         phone_number: bizNumber.replace(/\D/g, ''),
         banner_img: certUrl || null, // ← 업로드 URL 넣기
         biz_reg_no: digitsBiz,
         representative_name: representativeName,
         main_products: mainProduct || null,
         business_address,
      }

      dispatch(registerSellerThunk(payload))
         .unwrap()
         .then(() => {
            alert('판매자 등록 완료!')
            navigate('/', { replace: true })
         })
         .catch((msg) => alert(msg))
   }

   return (
      <div className="register-container">
         <img className="logo" src="/Logo.png" alt="미니 로고" />

         <div className="register-input">
            <label>사업자 등록번호</label>
            <input type="text" value={biz} onChange={(e) => setBiz(formatBiz(e.target.value))} placeholder="XXX-XX-XXXXX" />
         </div>

         <div className="register-input">
            <label>사본 업로드</label>
            <input type="file" accept="image/*" onChange={onFileChange} />
            {uploading && <p style={{ marginTop: 6 }}>업로드 중...</p>}
            {certPreview && <img src={certPreview} alt="업로드 미리보기" style={{ marginTop: 8, width: 180, height: 'auto', borderRadius: 8, border: '1px solid #ddd' }} />}
            {certUrl && <p style={{ fontSize: 12, color: '#4b5563' }}>업로드 완료</p>}
         </div>

         <div className="register-input">
            <label>상호법인명</label>
            <input type="text" value={bizName} onChange={(e) => setBizName(e.target.value)} placeholder="(주)Minimart" />
         </div>

         <div className="register-input">
            <label>회사 소개</label>
            <input type="text" value={introduce} onChange={(e) => setIntroduce(e.target.value)} placeholder="어떤 회사인가요?" />
         </div>

         <div className="register-input">
            <label htmlFor="phone">대표 번호</label>
            <input type="text" value={bizNumber} onChange={(e) => setBizNumber(e.target.value)} placeholder="010-XXXX-XXXX" />
         </div>

         <div className="register-input">
            <label>대표자 명</label>
            <input type="text" value={representativeName} onChange={(e) => setRepresentativeName(e.target.value)} placeholder="대표자명 입력" />
         </div>

         <div className="register-input">
            <label>대표 판매 물품</label>
            <input type="text" value={mainProduct} onChange={(e) => setMainProduct(e.target.value)} placeholder="종목" />
         </div>

         <div className="register-input">
            <label>사업장 주소</label>
            <div className="postcode-box">
               <input type="text" className="postcode-box" value={postcode} maxLength={5} onChange={(e) => setPostcode(e.target.value.replace(/\D/g, ''))} placeholder="우편번호 입력" />
               <button className="postcode-button" type="button">
                  우편번호 찾기
               </button>
            </div>
         </div>

         <div className="register-input">
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="주소" />
         </div>

         <div className="address-detail-row">
            <div className="half-input">
               <input type="text" value={detailAddress} onChange={(e) => setDetailAddress(e.target.value)} placeholder="상세주소" />
            </div>
            <div className="half-input">
               <input type="text" value={extraAddress} onChange={(e) => setExtraAddress(e.target.value)} placeholder="참고항목" />
            </div>
         </div>

         <div className="button-group">
            <button disabled={loading || uploading} onClick={handleRegister}>
               {loading || uploading ? '처리 중...' : '판매자 신청하기'}
            </button>
         </div>
      </div>
   )
}

export default RegisterSeller
