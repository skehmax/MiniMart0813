import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPendingSellers, approveSellerThunk, rejectSellerThunk } from '../../features/adminSlice'

const styles = {
   container: { padding: '20px' },
   title: { marginBottom: '20px' },
   sellerItem: {
      border: '1px solid #ccc',
      padding: '15px',
      marginBottom: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   button: {
      marginLeft: '10px',
      padding: '8px 12px',
      cursor: 'pointer',
   },
   approveButton: {
      width: '120px',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
   },
   rejectButton: {
      width: '120px',
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
   },
}

const ManagerAllow = () => {
   const dispatch = useDispatch()
   // Redux store에서 admin 상태 가져오기
   const { sellers, loading, error } = useSelector((state) => state.admin)

   // 컴포넌트가 마운트될 때 승인 대기 목록을 불러옵니다.
   useEffect(() => {
      dispatch(fetchPendingSellers())
   }, [dispatch])

   // 승인 버튼 핸들러
   const handleApprove = (sellerId) => {
      if (window.confirm('정말로 이 판매자를 승인하시겠습니까?')) {
         dispatch(approveSellerThunk(sellerId))
      }
   }

   // 거절 버튼 핸들러
   const handleReject = (sellerId) => {
      if (window.confirm('정말로 이 판매자의 신청을 거절하시겠습니까?')) {
         dispatch(rejectSellerThunk(sellerId))
      }
   }

   if (loading) {
      return (
         <div style={styles.container}>
            <h2>로딩 중...</h2>
         </div>
      )
   }

   if (error) {
      return (
         <div style={styles.container}>
            <h2 style={{ color: 'red' }}>에러: {error}</h2>
         </div>
      )
   }

   return (
      <div style={styles.container}>
         <h1 style={styles.title}>판매자 승인 대기 목록</h1>
         {sellers.length === 0 ? (
            <p>승인 대기 중인 판매자가 없습니다.</p>
         ) : (
            sellers.map((seller) => (
               <div key={seller.id} style={styles.sellerItem}>
                  <div>
                     <p>
                        <strong>상호명:</strong> {seller.name}
                     </p>
                     <p>
                        <strong>신청자:</strong> {seller.User?.name} ({seller.User?.email})
                     </p>
                     <p>
                        <strong>사업자등록번호:</strong> {seller.biz_reg_no}
                     </p>
                  </div>
                  <div>
                     <button style={{ ...styles.button, ...styles.approveButton }} onClick={() => handleApprove(seller.id)}>
                        승인
                     </button>
                     <button style={{ ...styles.button, ...styles.rejectButton }} onClick={() => handleReject(seller.id)}>
                        거절
                     </button>
                  </div>
               </div>
            ))
         )}
      </div>
   )
}

export default ManagerAllow
