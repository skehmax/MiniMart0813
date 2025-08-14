import minimartApi from './axiosApi'

// 사본 파일 업로드
export const uploadImage = async (file) => {
   const fd = new FormData()
   fd.append('file', file)
   const { data } = await minimartApi.post('/files/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
   })
   return data.url
}
