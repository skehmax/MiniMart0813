import axios from 'axios'

const BASE_URL = 'http://localhost:8000/auth/find/email'

export const sendCodeByEmail = (email) => {
   return axios.post(`${BASE_URL}/send-code`, { email })
}

export const verifyCodeByEmail = (email, code) => {
   return axios.post(`${BASE_URL}/verify-code`, { email, code })
}

export const resetPasswordByEmail = (email, newPassword) => {
   return axios.post(`${BASE_URL}/reset-password`, {
      email,
      newPassword,
   })
}
