import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchOrderHistoryThunk, cancelOrderThunk } from '../../features/mypageSlice'

const OrderHistoryForm = () => {
   const dispatch = useDispatch()
   const { orders, loading, error } = useSelector((state) => state.mypage)
   const navigate = useNavigate()

   useEffect(() => {
      dispatch(fetchOrderHistoryThunk())
   }, [dispatch])

   // 내정보 페이지에서 리뷰 작성(임시)
   const handleWriteReview = (order) => {
      // ReviewForm으로 이동하며 주문 정보를 state로 전달
      navigate('/review', { state: { order } })
   }

   const handleEditReview = (order) => {
      // TODO: 나중에 리뷰 수정 페이지로 이동하는 로직을 추가
      alert(`리뷰 수정 기능 (주문 ID: ${order.orderId})`)
   }

   // 배송 중 상품 주문 취소 기능
   const handleCancelOrder = (orderId) => {
      if (window.confirm('주문을 취소하시겠습니까?')) {
         // dispatch(cancelOrderThunk(orderId))
         //    .unwrap()
         //    .then(() => {
         //       alert('주문이 취소되었습니다.')
         //    })
         //    .catch((err) => {
         //       alert(`주문 취소 실패: ${err}`)
         //    })
      }
   }

   return (
      <section className="order-history-section">
         <h2 className="section-title">구매 내역</h2>

         {loading && <p className="loading">로딩 중...</p>}
         {error && <p className="error">에러: {error}</p>}
         {!loading && orders.length === 0 && <p className="empty-text">구매 내역이 없습니다.</p>}

         {!loading && orders.length > 0 && (
            <div className="order-list">
               {orders.map((order) => (
                  <div className="order-item" key={order.orderId}>
                     <div className="order-info-header">
                        <p>주문 번호: {order.orderId}</p>
                        <p>주문 날짜: {order.date}</p>
                        <p>총 결제 금액: {order.totalPrice}원</p>
                        <p>배송 상태: {order.status}</p>
                     </div>
                     <div className="order-item-details">
                        {order.items.map((item) => (
                           <div key={item.itemId} className="item-card">
                              <img src={item.imageUrl || '/default-product.png'} alt={item.name} />
                              <div className="item-info">
                                 <p className="item-name">{item.name}</p>
                                 <p className="item-price">
                                    {item.price}원 ({item.quantity}개)
                                 </p>
                              </div>
                           </div>
                        ))}
                     </div>
                     <div className="actions">
                        {order.status === '배송 완료' && (
                           <>
                              {order.hasReview ? (
                                 <button className="btn-small primary" onClick={() => handleEditReview(order)} disabled={loading}>
                                    리뷰 수정
                                 </button>
                              ) : (
                                 <button className="btn-small primary" onClick={() => handleWriteReview(order)} disabled={loading}>
                                    리뷰 작성
                                 </button>
                              )}
                           </>
                        )}
                        {/* 배송 중 상태일 때만 주문 취소 버튼 표시 */}
                        {order.status === '배송 중' && (
                           <button className="btn-small danger" onClick={() => handleCancelOrder(order.orderId)} disabled={loading}>
                              주문 취소
                           </button>
                        )}
                     </div>
                  </div>
               ))}
            </div>
         )}
      </section>
   )
}

export default OrderHistoryForm
