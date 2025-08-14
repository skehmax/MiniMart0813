import minimartApi from './axiosApi'
const API_URL = import.meta.env.VITE_API_URL

// 판매자 등록 (구매자 → 판매자 승급)
export const registerSeller = (payload) => minimartApi.post('/auth/seller/register', payload)
