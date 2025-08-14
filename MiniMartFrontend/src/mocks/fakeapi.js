import { mockOrderHistory } from './fakeorder'
import { mockFollowedSellers } from './fakefollow.js'

// 주문 내역을 가져오는 가상 API 함수
export const getOrderHistory = () => {
   return new Promise((resolve) => {
      // 0.5초 후에 mockOrderHistory 데이터를 반환
      setTimeout(() => {
         resolve({ data: mockOrderHistory })
      }, 500)
   })
}
//팔로우한 판매자 목록을 가져오는 가상 API 함수 (추가)
export const getFollowedSellers = () => {
   return new Promise((resolve) => {
      setTimeout(() => {
         resolve({ data: mockFollowedSellers })
      }, 500)
   })
}
