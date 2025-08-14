import React, { useState, useRef } from 'react'
import axios from 'axios'
import '../../styles/qna.css'

const API_BASE_URL = import.meta.env.VITE_API_URL

const QnAForm = () => {
   const fileInputRef = useRef(null)
   const [images, setImages] = useState([])
   const [title, setTitle] = useState('')
   const [content, setContent] = useState('')
   const [isSecret, setIsSecret] = useState(false)

   const handleImageChange = (e) => {
      const files = Array.from(e.target.files)
      setImages((prev) => [...prev, ...files])
      e.target.value = ''
   }
   const handleImageUploadClick = () => {
      fileInputRef.current.click()
   }
   const handleSubmit = async (e) => {
      e.preventDefault()

      if (!title.trim() || !content.trim()) {
         alert('제목과 내용을 모두 입력해주세요.')
         return
      }

      try {
         const formData = new FormData()
         images.forEach((img) => formData.append('images', img))
         formData.append('title', title)
         formData.append('content', content)
         formData.append('isSecret', isSecret)

         const res = await axios.post(`${API_BASE_URL}/api/qna`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true,
         })

         if (res.status === 201) {
            alert('질문이 등록되었습니다.')
            setImages([])
            setTitle('')
            setContent('')
            setIsSecret(false)
         }
      } catch (err) {
         console.error(err)
         alert('질문 등록에 실패했습니다.')
      }
   }

   return (
      <div className="qna-page">
         <h2 className="qna-title">질문을 등록해주세요</h2>
         <form className="qna-form" onSubmit={handleSubmit}>
            <div className="image-upload-section">
               <p className="upload-hint">이미지가 있다면 여러 장 첨부하실 수 있습니다.</p>
               <div className="image-preview-list">
                  {images.map((img, idx) => (
                     <div key={idx} className="image-preview-box">
                        <img src={URL.createObjectURL(img)} alt={`preview-${idx}`} />
                     </div>
                  ))}
                  {images.length < 5 && (
                     <div className="image-upload-box" onClick={handleImageUploadClick}>
                        <span>+</span>
                     </div>
                  )}
                  <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
               </div>
            </div>
            <div className="input-title-container">
               <label>제목</label>
               <input className="input-title" type="text" placeholder="제목을 입력하세요" value={title} onChange={(e) => setTitle(e.target.value)} />
               <label className="private-check">
                  <input type="checkbox" checked={isSecret} onChange={(e) => setIsSecret(e.target.checked)} />
                  비밀 글
               </label>
            </div>
            <div className="form-row">
               <label className="input-content-label">상세한 내용을 입력해주세요</label>
               <textarea className="input-content" placeholder="내용을 입력하세요" value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <button type="submit" className="submit-btn">
               등록 하기
            </button>
         </form>
      </div>
   )
}
export default QnAForm
