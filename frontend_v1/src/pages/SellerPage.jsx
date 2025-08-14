import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import minimartApi from '../api/axiosApi'

const SellerPage = () => {
   const { sellerId } = useParams() // URL의 :sellerId 값을 가져옵니다.
   const [items, setItems] = useState([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      const fetchItems = async () => {
         try {
            setLoading(true)
            const response = await minimartApi.get(`/api/seller/${sellerId}/items`)
            setItems(response.data.data)
         } catch (error) {
            console.error('판매자 상품 로딩 실패:', error)
         } finally {
            setLoading(false)
         }
      }
      fetchItems()
   }, [sellerId])

   // 스타일 (SearchPage와 유사)
   const styles = {
      container: { maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem' },
      title: { fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem' },
      grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' },
      card: { border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', textDecoration: 'none', color: 'inherit' },
      img: { width: '100%', height: '250px', objectFit: 'cover', backgroundColor: '#f0f0f0' },
      info: { padding: '1rem' },
   }

   if (loading) return <div>로딩 중...</div>

   return (
      <div style={styles.container}>
         <h1 style={styles.title}>판매자 상품 목록</h1>
         <div style={styles.grid}>
            {items.map((item) => (
               <Link to={`/item/${item.id}`} key={item.id} style={styles.card}>
                  <img src={item.ItemImgs[0]?.img_url || '/placeholder.png'} alt={item.name} style={styles.img} />
                  <div style={styles.info}>
                     <p>{item.name}</p>
                     <p style={{ fontWeight: 'bold' }}>{item.price.toLocaleString()}원</p>
                  </div>
               </Link>
            ))}
         </div>
      </div>
   )
}

export default SellerPage
