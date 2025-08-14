import axios from 'axios'

// 문의 작성 API
export const createQna = async (formData) => {
   const res = await axios.post('/api/qna', formData, {
      headers: {
         'Content-Type': 'multipart/form-data',
      },
   })
   return res.data
}
