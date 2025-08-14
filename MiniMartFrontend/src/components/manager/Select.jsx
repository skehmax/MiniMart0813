import { useNavigate } from 'react-router-dom'

function Select() {
   const navigate = useNavigate()

   const navStyle = {
      marginRight: '20px',
      padding: '10px',
      backgroundColor: '#e2f53e',
      borderRadius: '5px',
      cursor: 'pointer', // 마우스 커서 바뀌도록
   }

   return (
      <div style={{ display: 'flex', margin: '50px' }}>
         <div style={navStyle} onClick={() => navigate('/manager')}>
            승인
         </div>
         <div style={navStyle} onClick={() => navigate('/manager/product')}>
            상품
         </div>
         <div style={navStyle} onClick={() => navigate('/manager/statistics')}>
            통계
         </div>
      </div>
   )
}

export default Select
