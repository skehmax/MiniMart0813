import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFollowedSellersThunk, unfollowSellerThunk } from '../../features/mypageSlice'

const FollowForm = () => {
   const dispatch = useDispatch()
   // Redux 스토어에서 팔로우 목록, 로딩 상태, 에러 상태를 가져옴
   const { followings, loading, error } = useSelector((state) => state.mypage)

   // 컴포넌트가 처음 렌더링될 때 팔로우 목록을 불러옴
   useEffect(() => {
      dispatch(fetchFollowedSellersThunk())
   }, [dispatch])

   // 팔로우 취소 핸들러
   const handleUnfollow = (sellerId) => {
      if (window.confirm('정말 팔로우를 취소하시겠습니까?')) {
         dispatch(unfollowSellerThunk(sellerId))
            .unwrap()
            .then(() => {
               alert('팔로우가 취소되었습니다.')
            })
            .catch((err) => {
               alert(`팔로우 취소 실패: ${err}`)
            })
      }
   }

   return (
      <section className="following-sellers-section">
         <h2 className="section-title">팔로잉 목록</h2>

         {loading && <p className="loading">로딩 중...</p>}
         {error && <p className="error">에러: {error}</p>}
         {!loading && followings.length === 0 && <p className="empty-text">팔로우한 판매자가 없습니다.</p>}

         {!loading && followings.length > 0 && (
            <div className="following-list">
               {followings.map((seller) => (
                  <div className="following-item" key={seller.sellerId}>
                     <img src={seller.profileImageUrl || '/default-seller.png'} alt={seller.storeName} className="following-thumbnail" />
                     <div className="following-info">
                        <p className="following-nickname">{seller.storeName}</p>
                        <p className="following-intro">{seller.introduction}</p>
                     </div>
                     <div className="actions">
                        <button className="unfollow-button" onClick={() => handleUnfollow(seller.sellerId)} disabled={loading}>
                           팔로우 취소
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </section>
   )
}

export default FollowForm
