// src/components/ReviewForm.jsx

import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { writeReviewThunk } from '../../features/reviewSlice'
import '../../styles/review.css'

const ReviewForm = () => {
   const navigate = useNavigate()
   const location = useLocation()
   const dispatch = useDispatch()
   const { loading, error } = useSelector((state) => state.review)
   const { order } = location.state || {}

   const [rating, setRating] = useState(0)
   const [reviewText, setReviewText] = useState('')

   const reviewData = new FormData()

   if (!order) {
      navigate('/mypage')
      return null
   }

   const handleSubmitReview = async (e) => {
      e.preventDefault()

      if (rating === 0 || reviewText.trim() === '') {
         alert('별점과 리뷰 내용을 모두 입력해주세요.')
         return
      }

      reviewData.append('rating', rating)
      reviewData.append('content', reviewText)

      const resultAction = await dispatch(
         writeReviewThunk({
            productId: order.items[0].id,
            reviewData,
         })
      )

      if (writeReviewThunk.fulfilled.match(resultAction)) {
         alert('리뷰가 성공적으로 등록되었습니다!')
         navigate('/mypage')
      } else {
         alert(`리뷰 등록 실패: ${error}`)
      }
   }

   return (
      <div className="review-form-container">
         <h2 className="review-form-header">리뷰 작성</h2>

         <div className="product-review-info">
            <img src={order.items[0].imageUrl} alt={order.items[0].name} className="product-review-image" />
            <div className="product-review-details">
               <p className="product-review-name">{order.items[0].name}</p>
               <p className="product-review-date">구매일: {order.date}</p>
            </div>
         </div>

         <form onSubmit={handleSubmitReview} className="review-form">
            <div className="rating-section">
               <label>별점:</label>
               <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                     <span key={star} className={star <= rating ? 'star active' : 'star'} onClick={() => setRating(star)}>
                        ★
                     </span>
                  ))}
               </div>
            </div>

            <div className="review-text-section">
               <label>리뷰 내용:</label>
               <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="상품에 대한 솔직한 리뷰를 작성해주세요." />
            </div>

            <div className="form-actions">
               <button type="button" className="btn-cancel" onClick={() => navigate('/mypage')}>
                  취소
               </button>
               <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? '등록 중...' : '리뷰 등록'}
               </button>
            </div>
         </form>
      </div>
   )
}

export default ReviewForm
