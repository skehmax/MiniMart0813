import axios from 'axios'
import minimartApi from './axiosApi'

const API_BASE_URL = import.meta.env.VITE_API_URL

export const writeReview = async ({ productId, reviewData }) => {
   const token = localStorage.getItem('token')
   const response = await minimartApi.get(`${API_BASE_URL}/products/${productId}/reviews`, reviewData, {
      headers: {
         Authorization: `Bearer ${token}`,
         'Content-Type': 'multipart/form-data',
      },
   })
   return response.data
}
