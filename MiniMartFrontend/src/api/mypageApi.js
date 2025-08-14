import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
   baseURL: API_BASE_URL,
   withCredentials: true,
})

export const updateMyPage = (data) => {
   const token = localStorage.getItem('token')
   return axios.patch(`${API_BASE_URL}/mypage/edit`, data, {
      headers: {
         Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
   })
}
export const deleteAccount = () => api.delete('/mypage/delete')
export const writeReview = (orderId, reviewData) => api.post(`/orders/${orderId}/review`, reviewData)
export const unfollowSeller = (sellerId) => api.delete(`/unfollow/${sellerId}`)
