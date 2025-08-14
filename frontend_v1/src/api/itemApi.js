import minimartApi from './axiosApi'
const API_URL = import.meta.env.VITE_API_URL

//상품 추가
export const itemCreate = async (data) => {
   try {
      const config = {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      }
      const response = await minimartApi.post(`/item`, data, config)
      return response
   } catch (error) {
      console.error('상품 추가에 실패했습니다. :', error)
      throw error
   }
}

// 최근 상품 불러오기
export const itemRecent = async () => {
   try {
      const response = await minimartApi.get('/item/recent')
      return response.data
   } catch (error) {
      console.error('최근 상품 불러오기 실패 : ', error)
      throw error
   }
}

// 인기 상품 불러오기
export const itemPopular = async () => {
   try {
      const response = await minimartApi.get('/item/popular/age')
      return response.data
   } catch (error) {
      console.error('인기 상품 불러오기 실패 : ', error)
      throw error
   }
}

//단일 상품 불러오기
export const getItem = async (id) => {
   try {
      const response = await minimartApi.get(`/item/${id}`)
      return response
   } catch (error) {
      console.error('상품 불러오기 실패 : ', error)
      throw error
   }
}

//판매자 id 기반 상품 불러오기
export const getSellerItems = async (id) => {
   try {
      const response = await minimartApi.get(`/item/seller/${id}`)
      return response
   } catch (error) {
      console.error('상품 불러오기 실패 : ', error)
      throw error
   }
}
