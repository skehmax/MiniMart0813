import minimartApi from './axiosApi'

// 승인 대기 목록
export const getPendingSellers = () => minimartApi.get('/admin/sellers/pending')

// 승인
export const approveSeller = (id) => minimartApi.post(`/admin/sellers/approve/${id}`)

// 거절
export const rejectSeller = (id) => minimartApi.post(`/admin/sellers/reject/${id}`)
