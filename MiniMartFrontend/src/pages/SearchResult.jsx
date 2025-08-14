import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import '../styles/searchResult.css'

const SearchResults = () => {
   const location = useLocation()
   const { results = [], searchTerm = '', success = true, error } = location.state || {}

   return (
      <div className="search-results-container">
         <div className="search-results-header">
            <h1>검색 결과</h1>
            <p className="search-term">'{searchTerm}'에 대한 검색 결과</p>
         </div>

         <div className="search-results-content">
            {error && (
               <div className="error-message">
                  <p>{error}</p>
                  <p>다시 시도해주시거나 다른 검색어를 입력해보세요.</p>
               </div>
            )}

            {!error && results.length === 0 && (
               <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h2>검색 결과가 없습니다</h2>
                  <p>'{searchTerm}'에 대한 검색 결과를 찾을 수 없습니다.</p>
                  <div className="suggestions">
                     <h3>검색 팁:</h3>
                     <ul>
                        <li>검색어의 철자가 정확한지 확인해보세요</li>
                        <li>더 일반적인 검색어를 사용해보세요</li>
                        <li>검색어를 줄여보세요</li>
                        <li>다른 키워드로 검색해보세요</li>
                     </ul>
                  </div>
                  <Link to="/" className="back-to-home">
                     홈으로 돌아가기
                  </Link>
               </div>
            )}

            {results.length > 0 && (
               <div className="results-section">
                  <div className="results-count">총 {results.length}개의 상품을 찾았습니다.</div>
                  <div className="results-grid">
                     {results.map((item, index) => (
                        <div key={item.id || index} className="result-item">
                           <div className="item-image">{item.image ? <img src={item.image} alt={item.name} /> : <div className="no-image">이미지 없음</div>}</div>
                           <div className="item-details">
                              <h3 className="item-name">{item.name || '상품명 없음'}</h3>
                              <p className="item-description">{item.description || '상품 설명이 없습니다.'}</p>
                              <div className="item-price">{item.price ? `₩${item.price.toLocaleString()}` : '가격 문의'}</div>
                              <Link to={`/product/${item.id}`} className="view-detail-btn">
                                 상세보기
                              </Link>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}
         </div>
      </div>
   )
}

export default SearchResults
