import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import '../styles/qna.css'

const QnA = () => {
   const [activeTab, setActiveTab] = useState('inquiry')
   const [expandedFaq, setExpandedFaq] = useState(null)
   const [formData, setFormData] = useState({
      title: '',
      content: '',
      isSecret: false,
      images: [],
   })
   const [isSubmitting, setIsSubmitting] = useState(false)

   const token = useSelector((state) => state.auth.token)
   const user = useSelector((state) => state.auth.user)

   const faqs = [
      {
         id: 1,
         question: '배송은 얼마나 걸리나요?',
         answer: '일반적으로 주문 후 2-3일 내에 배송됩니다. 지역에 따라 배송 시간이 다를 수 있으며, 주말 및 공휴일은 배송이 제외됩니다.',
      },
      {
         id: 2,
         question: '교환 및 반품은 어떻게 하나요?',
         answer: '상품 수령 후 7일 이내에 교환 및 반품이 가능합니다. 단, 상품이 훼손되지 않은 상태여야 하며, 고객센터를 통해 신청해주시기 바랍니다.',
      },
      {
         id: 3,
         question: '결제 방법은 어떤 것들이 있나요?',
         answer: '신용카드, 무통장 입금, 카카오페이, 네이버페이 등 다양한 결제 방법을 지원합니다.',
      },
      {
         id: 4,
         question: '회원가입을 해야만 구매가 가능한가요?',
         answer: '회원가입 없이도 비회원 주문이 가능합니다. 하지만 회원가입을 하시면 적립금, 할인 혜택 등 다양한 혜택을 받으실 수 있습니다.',
      },
      {
         id: 5,
         question: '사이즈 교환은 무료인가요?',
         answer: '단순 변심으로 인한 사이즈 교환의 경우 왕복 배송비가 발생할 수 있습니다. 상품 불량이나 오배송의 경우 무료로 교환해드립니다.',
      },
   ]

   const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target
      setFormData((prev) => ({
         ...prev,
         [name]: type === 'checkbox' ? checked : value,
      }))
   }

   const handleImageChange = (e) => {
      const files = Array.from(e.target.files)
      if (files.length > 5) {
         alert('이미지는 최대 5개까지만 업로드 가능합니다.')
         return
      }
      setFormData((prev) => ({
         ...prev,
         images: files,
      }))
   }

   const handleSubmit = async (e) => {
      e.preventDefault()

      if (!user) {
         alert('로그인이 필요합니다.')
         return
      }

      if (!formData.title.trim() || !formData.content.trim()) {
         alert('제목과 내용을 모두 입력해주세요.')
         return
      }

      setIsSubmitting(true)

      try {
         const formDataToSend = new FormData()
         formDataToSend.append('title', formData.title)
         formDataToSend.append('content', formData.content)
         formDataToSend.append('isSecret', formData.isSecret.toString())

         formData.images.forEach((image, index) => {
            formDataToSend.append('images', image)
         })

         const response = await fetch('http://localhost:8000/api/qna', {
            method: 'POST',
            headers: {
               Authorization: `Bearer ${token}`,
            },
            body: formDataToSend,
         })

         const data = await response.json()

         if (response.ok) {
            alert('문의가 성공적으로 등록되었습니다.')
            setFormData({
               title: '',
               content: '',
               isSecret: false,
               images: [],
            })
            // 파일 input 초기화
            document.getElementById('image-input').value = ''
         } else {
            alert(data.message || '문의 등록에 실패했습니다.')
         }
      } catch (error) {
         console.error('Error submitting inquiry:', error)
         alert('문의 등록 중 오류가 발생했습니다.')
      } finally {
         setIsSubmitting(false)
      }
   }

   const toggleFaq = (id) => {
      setExpandedFaq(expandedFaq === id ? null : id)
   }

   return (
      <div className="qna-container">
         <div className="qna-header">
            <h1>Q&A</h1>
            <p>궁금한 점이 있으시면 언제든지 문의해주세요.</p>
         </div>

         <div className="qna-content">
            <div className="qna-tabs">
               <button className={`tab-button ${activeTab === 'faq' ? 'active' : ''}`} onClick={() => setActiveTab('faq')}>
                  자주 묻는 질문
               </button>
               <button className={`tab-button ${activeTab === 'inquiry' ? 'active' : ''}`} onClick={() => setActiveTab('inquiry')}>
                  1:1 문의
               </button>
            </div>

            {activeTab === 'faq' && (
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
            )}

            {activeTab === 'inquiry' && (
               <div className="inquiry-section">
                  <h2>1:1 문의</h2>
                  {!user ? (
                     <div className="login-required">
                        <p>문의를 작성하려면 로그인이 필요합니다.</p>
                        <button className="login-btn">로그인하러 가기</button>
                     </div>
                  ) : (
                     <form onSubmit={handleSubmit} className="inquiry-form">
                        <div className="form-group">
                           <label htmlFor="title">제목 *</label>
                           <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="문의 제목을 입력해주세요" required />
                        </div>

                        <div className="form-group">
                           <label htmlFor="content">내용 *</label>
                           <textarea id="content" name="content" value={formData.content} onChange={handleInputChange} placeholder="문의 내용을 상세히 작성해주세요" rows={8} required />
                        </div>

                        <div className="form-group">
                           <label htmlFor="image-input">이미지 첨부 (최대 5개)</label>
                           <input type="file" id="image-input" multiple accept="image/*" onChange={handleImageChange} className="file-input" />
                           {formData.images.length > 0 && (
                              <div className="selected-images">
                                 <p>선택된 파일: {formData.images.length}개</p>
                                 <ul>
                                    {Array.from(formData.images).map((file, index) => (
                                       <li key={index}>{file.name}</li>
                                    ))}
                                 </ul>
                              </div>
                           )}
                        </div>

                        <div className="form-group checkbox-group">
                           <label className="checkbox-label">
                              <input type="checkbox" name="isSecret" checked={formData.isSecret} onChange={handleInputChange} />
                              <span className="checkbox-custom"></span>
                              비밀글로 작성
                           </label>
                        </div>

                        <div className="form-actions">
                           <button type="submit" className="submit-btn" disabled={isSubmitting}>
                              {isSubmitting ? '등록 중...' : '문의 등록'}
                           </button>
                        </div>
                     </form>
                  )}
               </div>
            )}
         </div>
      </div>
   )
}

export default QnA
