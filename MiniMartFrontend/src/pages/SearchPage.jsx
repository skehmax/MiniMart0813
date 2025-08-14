import React from 'react'
import { useLocation, Link } from 'react-router-dom'

// 검색 결과 페이지 컴포넌트
const SearchPage = () => {
   const location = useLocation()
   // Home.jsx 또는 SearchBar.jsx에서 navigate로 전달한 검색 결과와 검색어를 받습니다.
   const { results, searchTerm } = location.state || { results: { items: [] }, searchTerm: '' }

   const styles = {
      // 전체 레이아웃을 위한 스타일
      pageContainer: { display: 'flex', maxWidth: '1400px', margin: '2rem auto', padding: '0 2rem', gap: '2rem' },

      // 왼쪽 필터 섹션 스타일
      filterSection: { width: '250px', flexShrink: 0 },
      filterBox: { border: '1px solid #eee', borderRadius: '8px', padding: '1.5rem' },
      filterTitle: { fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' },
      filterTag: { display: 'inline-block', backgroundColor: '#f0f0f0', color: '#555', padding: '0.5rem 1rem', borderRadius: '16px', marginRight: '0.5rem', marginBottom: '0.5rem' },

      // 오른쪽 상품 목록 스타일
      resultsSection: { flexGrow: 1 },
      title: { fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem' },
      highlight: { color: '#4338ca' },
      grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' },
      card: { border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', textDecoration: 'none', color: 'inherit' },
      img: { width: '100%', height: '240px', objectFit: 'cover', backgroundColor: '#f0f0f0' },
      info: { padding: '1rem' },
      itemName: { fontWeight: 'bold', fontSize: '1.1rem' },
      sellerName: { color: '#666', fontSize: '0.9rem' },
      price: { fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'right', marginTop: '0.5rem' },
   }

   return (
      <div style={styles.pageContainer}>
         {/* 왼쪽 필터 영역 */}
         <aside style={styles.filterSection}>
            <div style={styles.filterBox}>
               <h3 style={styles.filterTitle}>검색 필터</h3>
               <div>
                  {searchTerm && <span style={styles.filterTag}>{searchTerm} ×</span>}
                  {/* 예시 태그 */}
                  <span style={styles.filterTag}>티셔츠 ×</span>
                  <span style={styles.filterTag}>XL ×</span>
               </div>

               <h3 style={{ ...styles.filterTitle, marginTop: '2rem' }}>가격 설정</h3>
               <input type="range" min="0" max="5000000" style={{ width: '100%' }} />
               <p style={{ textAlign: 'center', color: '#888', marginTop: '0.5rem' }}>₩0 - ₩5,000,000</p>
            </div>
         </aside>

         {/* 오른쪽 검색 결과 영역 */}
         <main style={styles.resultsSection}>
            <h1 style={styles.title}>
               '<span style={styles.highlight}>{searchTerm || 'MD 추천 상품'}</span>'에 대한 검색 결과
               <span style={{ color: '#999', fontSize: '1.2rem', marginLeft: '1rem' }}>({results.totalItems || results.items.length || 0}개)</span>
            </h1>

            {results.items && results.items.length > 0 ? (
               <div style={styles.grid}>
                  {results.items.map((item) => (
                     <Link to={`/item/${item.id}`} key={item.id} style={styles.card}>
                        <img src={item.ItemImgs && item.ItemImgs.length > 0 ? item.ItemImgs[0].img_url : '/placeholder.png'} alt={item.name} style={styles.img} />
                        <div style={styles.info}>
                           <p style={styles.sellerName}>{item.Seller?.name || '판매자 정보 없음'}</p>
                           <p style={styles.itemName}>{item.name}</p>
                           <p style={styles.price}>{item.price.toLocaleString()}원</p>
                        </div>
                     </Link>
                  ))}
               </div>
            ) : (
               // 가짜 데이터 (API 결과가 없을 때 임시로 보여주기 위함)
               <div style={styles.grid}>
                  <div style={styles.card}>
                     <img src="https://image.msscdn.net/images/goods_img/20230308/3123733/3123733_17086708789399_500.jpg" alt="상품1" style={styles.img} />
                     <div style={styles.info}>
                        <p style={styles.itemName}>예시 상품 1</p>
                        <p style={styles.price}>35,000원</p>
                     </div>
                  </div>
                  <div style={styles.card}>
                     <img src="https://image.msscdn.net/images/goods_img/20230308/3123733/3123733_17086708789399_500.jpg" alt="상품1" style={styles.img} />
                     <div style={styles.info}>
                        <p style={styles.itemName}>예시 상품 2</p>
                        <p style={styles.price}>42,000원</p>
                     </div>
                  </div>
               </div>
            )}
         </main>
      </div>
   )
}

export default SearchPage
