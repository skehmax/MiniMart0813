import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createQnaThunk, resetQnaState } from '../features/qnaSlice'
import '../styles/qna.css'

// --- 고객센터 메인 페이지 컴포넌트 ---
const QnAPage = () => {
   const [activeTab, setActiveTab] = useState('faq') // 기본 탭을 '자주 묻는 질문'으로 설정

   return (
      <div className="qna-container">
         <div className="qna-header">
            <h1>고객센터</h1>
            <p>궁금한 점이 있으시면 언제든지 문의해주세요.</p>
         </div>

         <div className="qna-content">
            <div className="qna-tabs">
               <button className={`tab-button ${activeTab === 'faq' ? 'active' : ''}`} onClick={() => setActiveTab('faq')}>
                  자주 묻는 질문
               </button>
               <button className={`tab-button ${activeTab === 'inquiry' ? 'active' : ''}`} onClick={() => setActiveTab('inquiry')}>
                  1:1 문의하기
               </button>
            </div>

            {activeTab === 'faq' && <FAQSection />}
            {activeTab === 'inquiry' && <InquirySection />}
         </div>
      </div>
   )
}

// --- 1. 자주 묻는 질문(FAQ) 섹션 ---
const FAQSection = () => {
   const [expandedFaq, setExpandedFaq] = useState(null)
   const faqs = [
      { id: 1, question: '배송은 얼마나 걸리나요?', answer: '일반적으로 주문 후 2-3일 내에 배송됩니다. 지역에 따라 배송 시간이 다를 수 있으며, 주말 및 공휴일은 배송이 제외됩니다.' },
      { id: 2, question: '교환 및 반품은 어떻게 하나요?', answer: '상품 수령 후 7일 이내에 교환 및 반품이 가능합니다. 단, 상품이 훼손되지 않은 상태여야 하며, 고객센터를 통해 신청해주시기 바랍니다.' },
   ]

   const toggleFaq = (id) => {
      setExpandedFaq(expandedFaq === id ? null : id)
   }

   return (
      <div className="faq-section">
         <h2>자주 묻는 질문</h2>
         <div className="faq-list">
            {faqs.map((faq) => (
               <div key={faq.id} className="faq-item">
                  <div className="faq-question" onClick={() => toggleFaq(faq.id)}>
                     <span className="faq-q-mark">Q</span>
                     <span className="faq-question-text">{faq.question}</span>
                     <span className={`faq-arrow ${expandedFaq === faq.id ? 'expanded' : ''}`}>▼</span>
                  </div>
                  <div className={`faq-answer ${expandedFaq === faq.id ? 'expanded' : ''}`}>
                     <span className="faq-a-mark">A</span>
                     <span className="faq-answer-text">{faq.answer}</span>
                  </div>
               </div>
            ))}
         </div>
      </div>
   )
}

// --- 2. 1:1 문의하기 섹션 ---
const InquirySection = () => {
   const dispatch = useDispatch()
   const { user } = useSelector((state) => state.auth)
   const { loading, error, success } = useSelector((state) => state.qna)

   const [title, setTitle] = useState('')
   const [content, setContent] = useState('')
   const [isSecret, setIsSecret] = useState(false)
   const [images, setImages] = useState([])
   const [imagePreviews, setImagePreviews] = useState([])

   // 문의 등록 성공 시 폼 초기화
   useEffect(() => {
      if (success) {
         alert('문의가 성공적으로 등록되었습니다.')
         setTitle('')
         setContent('')
         setIsSecret(false)
         setImages([])
         setImagePreviews([])
         dispatch(resetQnaState()) // qnaSlice 상태 초기화
      }
      if (error) {
         alert(`오류: ${error}`)
         dispatch(resetQnaState())
      }
   }, [success, error, dispatch])

   const handleImageChange = (e) => {
      const files = Array.from(e.target.files)
      if (images.length + files.length > 5) {
         return alert('이미지는 최대 5개까지만 업로드 가능합니다.')
      }
      setImages([...images, ...files])

      const newPreviews = files.map((file) => URL.createObjectURL(file))
      setImagePreviews([...imagePreviews, ...newPreviews])
   }

   const handleSubmit = (e) => {
      e.preventDefault()
      if (!user) return alert('로그인이 필요합니다.')
      if (!title.trim() || !content.trim()) return alert('제목과 내용을 모두 입력해주세요.')

      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      formData.append('isSecret', isSecret)
      images.forEach((image) => formData.append('images', image))

      dispatch(createQnaThunk(formData))
   }

   if (!user) {
      return (
         <div className="login-required">
            <p>1:1 문의를 작성하려면 로그인이 필요합니다.</p>
            {/* <Link to="/login"><button className="login-btn">로그인하러 가기</button></Link> */}
         </div>
      )
   }

   return (
      <div className="inquiry-section">
         <h2>1:1 문의하기</h2>
         <form onSubmit={handleSubmit} className="inquiry-form">
            <div className="form-group">
               <label htmlFor="title">제목 *</label>
               <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
               <label htmlFor="content">내용 *</label>
               <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={8} required />
            </div>
            <div className="form-group">
               <label>이미지 첨부 (최대 5개)</label>
               <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} id="image-upload" />
               <div className="image-preview-list">
                  {imagePreviews.map((preview, index) => (
                     <img key={index} src={preview} alt="preview" className="image-preview-item" />
                  ))}
                  {images.length < 5 && (
                     <label htmlFor="image-upload" className="image-upload-button">
                        +
                     </label>
                  )}
               </div>
            </div>
            <div className="form-group checkbox-group">
               <label className="checkbox-label">
                  <input type="checkbox" checked={isSecret} onChange={(e) => setIsSecret(e.target.checked)} />
                  <span className="checkbox-custom"></span> 비밀글로 작성
               </label>
            </div>
            <div className="form-actions">
               <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? '등록 중...' : '문의 등록'}
               </button>
            </div>
         </form>
      </div>
   )
}

export default QnAPage
