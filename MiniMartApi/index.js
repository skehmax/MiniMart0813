const express = require('express') //express 프레임워크 가져오기
const app = express()
const PORT = 8000 // 포트 번호

// http://localhost:8000/ 으로 접속시 보여줄 내용
app.get('/', (req, res) => {
   res.send('Hello, Express!')
})

// 8000번 포트로 서버 시작
app.listen(PORT, () => {
   console.log(`서버가 작동 중 입니다. http://localhost:${PORT}`)
})
